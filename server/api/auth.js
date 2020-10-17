var express = require("express");
var router = express.Router();

const path = require("path");
var pathUtils = require("./path-utils");
const jwt = require("jsonwebtoken");

var fs = require("fs-extra");
var mkdirp = require("mkdirp");
var dateFormat = require("dateformat");
var moment = require("moment");

var pool = require("../db").pool;

var dbUtils = require("./database-utils");
var UserTrack = require("./user_tracking_util");

const JWT_SECRET = "LKJ*(@BN823jhsdf!@*(";

const { OAuth2Client } = require("google-auth-library");
const GOOGLE_CLIENT_ID =
  "727076687673-qak299svdbrfe8svd6go6ikqnn6h8ins.apps.googleusercontent.com";

function getSessionToken(data) {
  const token = jwt.sign({ data }, JWT_SECRET, { expiresIn: "10h" });
  return token;
}

router.get("/checkSessionExpired", function(req, res) {
  res.json({ expired: req.session.token ? false : true });
});

router.post("/login", function(req, res) {
  var params = req.body;
  // console.log(params);
  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  pool.query(
    `
    SELECT
      cu.user_id,
      cu.sch_id,
      cu.role_id, cu.name,
      cu.email,
      cu.contact,
      cu.dob,
      cu.state,
      cu.city,
      cu.address,
      cu.path,
      csd.name as sch_name,
      csd.logo,
      csd.cv_pid
    FROM
      cv_users as cu,
      cv_school_detail as csd
    WHERE
      cu.sch_id=csd.sch_id
      and
      status=1
      and
      cu.username=?
      and
      password=?
    `,
    //"SELECT cu.user_id, cu.sch_id, cu.role_id, cu.name, cu.email, cu.contact, cu.dob, cu.state, cu.city, cu.address, cu.path, csd.name as sch_name, csd.logo FROM `cv_users` as cu, cv_school_detail as csd WHERE cu.sch_id=csd.sch_id and status=1 and cu.username=? and password=?",
    [params.username, params.password],
    async function(err, result, fields) {
      // console.log(result);
      if (err) {
        throw err;
      } else {
        if (result.length != 0) {
          pool.query(
            "SELECT cls_id,sec_id FROM cv_st_detail  where user_id= ? ",
            [result[0].user_id],
            async function(err, result1, fields) {
              if (err) {
                throw err;
              } else {
                var cls_idd, sec_idd;
                /*user tracking*/
                dologInChores(result[0].user_id, ip);
                /*user tracking*/
                if (result1.length) {
                  cls_idd = result1[0].cls_id;
                  sec_idd = result1[0].sec_id;
                } else {
                  cls_idd = 0;
                  sec_idd = 0;
                }
                const user = {
                  user_id: result[0].user_id,
                  sch_id: result[0].sch_id,
                  sch_name: result[0].sch_name,
                  role_id: result[0].role_id,
                  name: result[0].name,
                  cls_id: cls_idd,
                  sec_id: sec_idd,
                  dir_path: result[0].path,
                  sch_logo: result[0].logo,
                  user_email: result[0].email,
                  user_contact: result[0].contact,
                  program_id: result[0].cv_pid,
                };

                const token = getSessionToken(user);
                //req.session.token = token;
                req.session.user_id = user.user_id;
                req.session.dir_path = user.dir_path;
                res.json(user);
              }
            }
          );
        } else {
          pool.query(
            "SELECT admin_id,role_id, username FROM cv_admin where username=? and password=?",
            [params.username, params.password],
            function(err, result, fields) {
              //console.log("admin");
              //console.log(result);
              if (err) {
                throw err;
              } else {
                if (result.length != 0) {
                  const user = {
                    admin_id: result[0].admin_id,
                    role_id: result[0].role_id,
                    name: result[0].name,
                  };
                  const token = getSessionToken(user);
                  //req.session.token = token;
                  req.session.admin_id = user.admin_id;
                  res.json(user);
                } else {
                  /***add query for euro school user only */
                  pool.query(
                    `SELECT
                   cu.user_id,
                   cu.sch_id,
                   cu.role_id, cu.name,
                   cu.email,
                   cu.contact,
                   cu.dob,
                   cu.state,
                   cu.city,
                   cu.address,
                   cu.path,
                   csd.name as sch_name,
                   csd.logo,
                   csd.cv_pid
                 FROM
                   cv_users as cu,
                   cv_school_detail as csd
                 WHERE
                   cu.sch_id=csd.sch_id
                   and
                   status=0
                   and 
                   cu.role_id=3
                   and
                   cu.username=?
                   and
                   password=?
                   and cu.sch_id in (9,3,39)`,
                    [params.username, params.password],
                    async function(err, result21, fields) {
                      if (err) {
                        throw err;
                      } else {
                        if (result21.length != 0) {
                          res.json("inactive_user");
                        } else {
                          res.status(400).end();
                        }
                      }
                    }
                  );
                  /****end euro school */
                  //res.status(400).end();
                }
              }
            }
          );
        }
      }
    }
  );
});
router.post("/getUserdata", (req, res) => {
  let params = req.body;
  pool.query(
    `SELECT cv_users.name,cv_users.user_id,cv_users.status,cv_users.sex,cv_users.username,cv_users.contact,cv_users.dob,cv_st_detail.cls_id,cv_st_parent_detail.father_email_id,cv_st_parent_detail.fcontact_no from cv_users left join cv_st_detail on (cv_st_detail.user_id =cv_users.user_id) left join cv_st_parent_detail on find_in_set(cv_users.user_id,cv_st_parent_detail.user_id) where cv_users.username=? and cv_users.password=? and cv_users.status=0 and cv_users.sch_id in (9,3,39)`,
    [params.username, params.password],
    function(err, data) {
      //console.log(data);
      if (err) {
        console.log(err);
      } else {
        res.send(data);
      }
    }
  );
});
router.post("/useractivation", (req, res) => {
  var params = req.body;

  return dbUtils
    .runSqlQueryAsyncUpdate(
      "UPDATE `cv_users` SET `name`=?,`sex`=?,`contact`=?,`status`=?,`update_at`=now() WHERE user_id =?",
      [params.name, params.gender, params.contact, 1, params.user_id]
    )
    .then((res) => {
      if (res.err) throw res.err;
      else {
        return dbUtils.runSqlQueryAsyncUpdate(
          "UPDATE `cv_st_detail` SET `cls_id`=(select cls_id from cv_classes where cv_classes.cls_name=?) where user_id=?",
          [params.grade, params.user_id]
        );
      }
    })
    .then((res1) => {
      if (res1.error) {
        console.log(res1.error);
      } else {
        return dbUtils
          .runSqlQueryAsyncSelect(
            "SELECT cv_st_parent_detail.cv_st_p_id,cv_st_parent_detail.user_id from cv_st_parent_detail where cv_st_parent_detail.father_email_id=?",
            [params.f_email_id]
          )
          .then((data) => {
            if (data.err) {
              throw data.err;
            } else {
              if (data.result.length) {
                let userIds = data.result[0].user_id;
                let userId = params.user_id;
                //console.log(userIds);
                if (userIds.search(userId) !== -1) {
                  userIds = userIds + "," + userId;
                }
                userIds = userIds + "," + userId;
                return dbUtils.runSqlQueryAsyncUpdate(
                  "UPDATE `cv_st_parent_detail` SET user_id=?, `father_email_id`=?,`fcontact_no`=? where cv_st_parent_detail.cv_st_p_id=?",
                  [
                    userIds,
                    params.f_email_id,
                    params.f_contact,
                    data.result[0].cv_st_p_id,
                  ]
                );
              } else {
                return dbUtils.runSqlQueryAsyncInsert(
                  "INSERT INTO `cv_st_parent_detail`( `user_id`, `father_email_id`, `fcontact_no`) VALUES (?,?,?)",
                  [params.user_id, params.f_email_id, params.f_contact]
                );
              }
            }
          })
          .then((finals) => {
            //console.log(finals);
            return dbUtils.runSqlQueryAsyncSelect(
              "select * from cv_users where user_id=?",
              [params.user_id]
            );
          });
      }
    })
    .then((datares) => {
      req.session.user_id = datares.result.user_id;
      req.session.dir_path = datares.result.path;
      return res.end();
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/loginWithGoogle", function(req, res) {
  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);
  var googleUser;
  var userInDatabase;
  client
    .verifyIdToken({
      idToken: req.body.token,
      audience: GOOGLE_CLIENT_ID,
    })
    .then((ticket) => {
      const payload = ticket.getPayload();
      googleUser = payload;
      return dbUtils.runSqlQueryAsyncSelect(
        "select * from cv_users where email=? limit 1",
        [payload["email"]]
      );
    })
    .then((result) => {
      if (result.err) {
        throw new Error("failed");
      } else {
        if (!result.result.length) {
          // New user
          return registerIndependentUser({
            email: googleUser["email"],
            name: googleUser["name"],
            username: "g-" + googleUser["sub"],
            dirname: "g-" + googleUser["sub"],
            password: "",
          })
            .then((data) => {
              // user Tracking here
              dologInChores(data.userId, ip);
              // end user tracking
              var userData = {
                user_id: data.userId,
                sch_id: 1,
                sch_name: "Codevidhya",
                role_id: 3,
                name: googleUser["name"],
                dir_path: data.path,
                user_email: googleUser["email"],
              };
              var user = { token: setToken(userData), user: userData };
              return user;
              //});
            })
            .catch((err) => {
              throw new Error("user_already_exists");
            });
          // return false;
        } else {
          // Existing user
          userInDatabase = result.result[0];
          var user = userInDatabase;
          var userData = {
            user_id: user.user_id,
            sch_id: user.sch_id,
            sch_name: user.sch_name,
            role_id: user.role_id,
            name: user.name,
            dir_path: user.path,
            sch_logo: user.logo,
            user_email: user.email,
            user_contact: user.contact,
          };
          return userData;
        }
      }
    })
    .then((user) => {
      req.session.user_id = user.user_id;
      req.session.dir_path = user.dir_path;
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
      if (typeof err == "string") {
        res.status(400).send({ error: err });
      } else {
        res.status(400).send({ error: err.message });
      }
    });
});

router.post("/getUserFromSession", function(req, res) {
  if (!req.session.user_id && !req.session.admin_id) {
    res.status(400).end();
    return;
  }
  pool.query(
    //`SELECT cu.user_id,cu.sch_id,cu.role_id,cu.name,cu.email,cu.contact,cu.dob,cu.state,cu.city,cu.address,cu.path,csd.name as sch_name,csd.logo,csd.cv_pid FROM cv_users as cu,cv_school_detail as csd WHERE cu.sch_id=csd.sch_id and status=1 and cu.user_id=?`,
    `SELECT cu.user_id,cu.sch_id,cu.role_id,cu.name,cu.email,cu.contact,cu.dob,cu.state,cu.trainer,cu.sales,cu.city,cu.address,cu.path,csd.name as sch_name,csd.logo,cv_offerings.* FROM cv_users as cu inner join cv_school_detail as csd on (cu.sch_id=csd.sch_id) inner join cv_offerings on (cv_offerings.cv_pid =csd.cv_pid) WHERE status=1 and cu.user_id=?`,
    [req.session.user_id],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        if (result.length != 0) {
          pool.query(
            "SELECT cls_id,sec_id FROM cv_st_detail where user_id= ? ",
            [result[0].user_id],
            function(err, result1, fields) {
              if (err) {
                throw err;
              } else {
                var cls_idd, sec_idd;
                if (result1.length) {
                  cls_idd = result1[0].cls_id;
                  sec_idd = result1[0].sec_id;
                } else {
                  cls_idd = 0;
                  sec_idd = 0;
                }
                const user = {
                  user_id: result[0].user_id,
                  sch_id: result[0].sch_id,
                  sch_name: result[0].sch_name,
                  role_id: result[0].role_id,
                  name: result[0].name,
                  cls_id: cls_idd,
                  sec_id: sec_idd,
                  dir_path: result[0].path,
                  sch_logo: result[0].logo,
                  user_email: result[0].email,
                  user_contact: result[0].contact,
                  program_id: result[0].cv_pid,
                  trainer: result[0].trainer,
                  sales: result[0].sales,
                  programs: result[0],
                };

                //const token = getSessionToken(user);
                //req.session.token = token;
                req.session.user_id = user.user_id;
                req.session.dir_path = user.dir_path;
                res.json(user);
              }
            }
          );
        } else {
          pool.query(
            "SELECT admin_id,role_id, username FROM cv_admin where admin_id=?",
            [req.session.admin_id],
            function(err, result, fields) {
              if (err) {
                throw err;
              } else {
                if (result.length != 0) {
                  const user = {
                    admin_id: result[0].admin_id,
                    role_id: result[0].role_id,
                    name: result[0].name,
                  };
                  //const token = getSessionToken(user);
                  //req.session.token = token;
                  req.session.admin_id = user.admin_id;
                  res.json(user);
                } else {
                  res.status(400).end();
                }
              }
            }
          );
        }
      }
    }
  );
});
//
/***user track Function */
//console.log('calling');
//setInterval(UpdateGoogleSheets,900000); //15*60*1000
setInterval(UpdateGoogleSheets, 600000); //15*60*1000
//setInterval(UpdateGoogleSheets,10000); //15*60*1000

//UpdateGoogleSheets();
async function UpdateGoogleSheets() {
  console.log("Function Called");
  // console.log("fadsfshd");
  var fs = require("fs"),
    readline = require("readline"),
    { google } = require("googleapis"),
    request = require("request"),
    { GoogleSpreadsheet } = require("google-spreadsheet"),
    creds = require("./client_secret.json");
  var doc = new GoogleSpreadsheet(
    "1_hsu8hV99x3ds-rTSIRqx81uAAyg2H-Buwd661OdpPg"
  );
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo(); // loads document properties and worksheets
  var sheet;
  if (process.env.CV_SITE == "local" || process.env.CV_SITE == "test") {
    sheet = doc.sheetsByIndex[7];
  } else if (process.env.CV_SITE == "main") {
    sheet = doc.sheetsByIndex[4];
  }
  console.log(sheet.title);
  //const sheet = doc.sheetsByIndex[4];

  //console.log(sheet);
  let rows = await sheet.getRows();
  await asyncforEach(rows, async (row, index) => {
    let query =
      "SELECT `mail_id`, DATE_FORMAT(`mail_send_date`,'%Y-%m-%d') 'mail_send_date', `username`, `status`, `time`, `reschedule`, DATE_FORMAT(`reschedule_date`,'%Y-%m-%d') 'reschedule_date', `reschedule_time`, `remainder_mail`, `feedback_mail` FROM `live_class_mail_send` WHERE username=? and  DATE_FORMAT(`mail_send_date`,'%Y-%m-%d')=? and time=?";
    let param = [];
    var dateString = row["Session Date"];
    if (dateString != "") var dateParts = dateString.split("/");
    var reschedulingdate = row["Rescheduling Date"];
    if (reschedulingdate != "")
      var rescheduleDateParts = reschedulingdate.split("/");

    let time = row["Time"];
    if (timePart != "") var timePart = time.split(":");

    var retime = row["Rescheduling Time"];
    if (retime != "") var retimePart = retime.split(":");

    let currentDate = new Date();
    if (reschedulingdate != "") {
      var rescheduleDateObject = new Date(
        +rescheduleDateParts[2],
        rescheduleDateParts[1] - 1,
        +rescheduleDateParts[0]
      ); //.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

      var rescheduleDateObj = new Date(rescheduleDateObject);
      //console.log('Before Date');
      //console.log(rescheduleDateObj.toLocaleString());
      //console.log(retimePart[0]+':'+retimePart[1]);
      rescheduleDateObj.setMinutes(
        rescheduleDateObj.getMinutes() + parseInt(retimePart[1])
      );
      rescheduleDateObj.setHours(
        rescheduleDateObj.getHours() + parseInt(retimePart[0])
      );
      //console.log('After time added');
      //console.log(rescheduleDateObj.toLocaleString());
      let redataObj1 = rescheduleDateObj.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      redataObj1 = new Date(redataObj1);
      var resdateObject = dateFormat(
        new Date(
          +rescheduleDateParts[2],
          rescheduleDateParts[1] - 1,
          +rescheduleDateParts[0]
        ),
        "yyyy-mm-dd"
      );
      currentDate = new Date();
      currentDate = currentDate.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      currentDate = new Date(currentDate);
      var rdiff = (rescheduleDateObj.getTime() - currentDate.getTime()) / 1000;
      rdiff /= 60;
      rdiff = Math.round(rdiff);
      //console.log('Rdifference start after changed');

      console.log(rdiff);
      console.log("tome date");
      console.log(rescheduleDateObject.toLocaleString());
      console.log("end time");
      console.log(redataObj1.toLocaleString());
      console.log(currentDate.toLocaleString());
      console.log("Rdifference end");
    }
    if (dateString != "") {
      var dateObject1 = new Date(
        +dateParts[2],
        dateParts[1] - 1,
        +dateParts[0]
      ); //.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

      var dataObj = new Date(dateObject1);
      dataObj.setMinutes(dataObj.getMinutes() + parseInt(timePart[1]));
      dataObj.setHours(dataObj.getHours() + parseInt(timePart[0]));
      console.log("After time added");
      console.log(dataObj.toLocaleString());
      let dataObj1 = dataObj.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      dataObj1 = new Date(dataObj);
      var dateObject = dateFormat(
        new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]),
        "yyyy-mm-dd"
      );
      //console.log('dateFormat');
      //console.log(dateObject);
      //console.log('row material start');
      //console.log(row);

      //console.log('end row material')
      currentDate = new Date();
      currentDate = currentDate.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      currentDate = new Date(currentDate);
      var diff = (dataObj.getTime() - currentDate.getTime()) / 1000;
      diff /= 60;
      diff = Math.round(diff);
      console.log("difference start");

      console.log(row["Username"]);
      console.log(diff);
      console.log("tome date");
      console.log(dataObj.toLocaleString());
      console.log("end time");
      console.log(dataObj1.toLocaleString());
      console.log(currentDate.toLocaleString());
      console.log("difference end");
    } else {
      dataObj = "";
      dateObject1 = "";
      dateObject = "";
      diff = 0;
    }

    //  console.log(row.username+' '+dateObject+' '+row.time);
    let GetDetails = [];
    return await dbUtils
      .runSqlQueryAsyncSelect(query, [row["Username"], dateObject, row["Time"]])
      .then(async (resultData) => {
        // console.log('query execute');
        // console.log(resultData);
        // console.log('query end')
        if (resultData.err) throw resultData.err;
        else {
          if (resultData.result.length) {
            GetDetails = resultData.result;
            if (
              GetDetails[0].remainder_mail != "1" &&
              ((diff <= 60 && diff >= 0) ||
                (GetDetails[0].reschedule == 1 && rdiff <= 60 && rdiff >= 0))
            ) {
              query =
                "UPDATE `live_class_mail_send` SET `remainder_mail`=? where live_class_mail_send.mail_id=?";
              param = [1, GetDetails[0].mail_id];

              return await dbUtils.runSqlQueryAsyncUpdate(query, param);
            } else if (
              row["Status"] == "Rescheduling" &&
              rdiff >= 0 &&
              (GetDetails[0].reschedule == 0 ||
                (GetDetails[0].reschedule == 1 &&
                  (resdateObject != GetDetails[0].reschedule_date ||
                    retime != GetDetails[0].reschedule_time)))
            ) {
              query =
                "UPDATE `live_class_mail_send` SET `reschedule`=1,`reschedule_date`=?,`reschedule_time`=?,`remainder_mail`='0',`feedback_mail`=0 WHERE mail_id=?";
              param = [resdateObject, retime, GetDetails[0].mail_id];

              return await dbUtils.runSqlQueryAsyncUpdate(query, param);
            } else if (
              GetDetails[0].feedback_mail != "1" &&
              diff <= -1 &&
              row["Status"] == "Done"
            ) {
              query =
                "UPDATE `live_class_mail_send` SET `feedback_mail`=? where live_class_mail_send.mail_id=?";
              param = [1, GetDetails[0].mail_id];

              return await dbUtils.runSqlQueryAsyncUpdate(query, param);
            } else {
              return "";
            }
          } else {
            query =
              "INSERT INTO `live_class_mail_send`(`mail_send_date`, `username`, `status`, `time`) VALUES (?,?,1,?)";
            param = [dateObject, row["Username"], row["Time"]];
            //  console.log('params');
            // console.log(param);
            if (
              row["Username"] != "" &&
              row["Time"] != "" &&
              row["Parent Name"] != "" &&
              row["Student Name"] != "" &&
              row["Session Date"] != "" &&
              row["Name of Session"] != "" &&
              row["Username"] != "" &&
              row["Password"] != "" &&
              row["Class Link"] != ""
            ) {
              if (
                row["Status"] != "Done" &&
                dataObj.getTime() >= currentDate.getTime()
              ) {
              }
              return await dbUtils.runSqlQueryAsyncInsert(query, param);
            } else return "";
          }
        }
      })
      .then(async (InsertedData) => {
        if (InsertedData) {
          if (InsertedData.err) throw InsertedData.err;
          else {
            if (GetDetails.length) {
              if (
                GetDetails[0].remainder_mail != "1" &&
                ((diff <= 60 && diff >= 0) ||
                  (GetDetails[0].reschedule == 1 && rdiff <= 60 && rdiff >= 0))
              ) {
                if (
                  GetDetails[0].reschedule == 1 &&
                  rdiff <= 60 &&
                  rdiff >= 0
                ) {
                  await remainderMailReschedule(row);
                } else {
                  await remainderMail(row);
                }
              } else if (
                row["Status"] == "Rescheduling" &&
                rdiff >= 0 &&
                (GetDetails[0].reschedule == 0 ||
                  (GetDetails[0].reschedule == 1 &&
                    (resdateObject != GetDetails[0].reschedule_date ||
                      retime != GetDetails[0].reschedule_time)))
              ) {
                await reschduleMail(row);
              } else if (
                GetDetails[0].feedback_mail != "1" &&
                diff <= -1 &&
                row["Status"] == "Done"
              ) {
                await feedbackMail(row);
              }
            } else if (diff >= 0) {
              await sendSessionScheduleMail(row);
            } else {
              console.log("only insert");
            }
            //query assigned
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  async function asyncforEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
  async function reschduleMail(...details) {
    console.log("Reschedule mail");
    /**Reschedule mail */
    await asyncforEach(details, async (detail, index) => {
      const mailgun = require("mailgun-js");
      const DOMAIN = "mail.codevidhya.com";
      const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
      const mg = mailgun({ apiKey: api, domain: DOMAIN });
      const data = {
        from: "Codevidhya <contact@codevidhya.com>",
        to: detail["Email ID"],
        cc: "Codevidhya <contact@codevidhya.com>",
        subject: `${detail["Student Name"]}'s Coding Class is Rescheduled `,
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
          <head> 
      <meta charset="UTF-8"> 
      <meta content="width=device-width, initial-scale=1" name="viewport"> 
      <meta name="x-apple-disable-message-reformatting"> 
      <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
      <meta content="telephone=no" name="format-detection"> 
      <title>Email Temp</title> 
      <!--[if (mso 16)]>
        <style type="text/css">
        a {text-decoration: none;}
        </style>
        <![endif]--> 
      <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> 
      <style type="text/css">
    @media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:30px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:20px!important; display:block!important; border-width:10px 0px 10px 0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .adapt-img-small { width:70%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
    #outlook a {
      padding:0;
    }
    .ExternalClass {
      width:100%;
    }
    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
      line-height:100%;
    }
    .es-button {
      mso-style-priority:100!important;
      text-decoration:none!important;
    }
    a[x-apple-data-detectors] {
      color:inherit!important;
      text-decoration:none!important;
      font-size:inherit!important;
      font-family:inherit!important;
      font-weight:inherit!important;
      line-height:inherit!important;
    }
    .es-desk-hidden {
      display:none;
      float:left;
      overflow:hidden;
      width:0;
      max-height:0;
      line-height:0;
      mso-hide:all;
    }
    </style> 
     </head> 
          <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
          <div class="es-wrapper-color" style="background-color:#F6F6F6;"> 
          <!--[if gte mso 9]>
          <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
            <v:fill type="tile" color="#f6f6f6"></v:fill>
          </v:background>
        <![endif]--> 
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;"> 
        <tr style="border-collapse:collapse;"> 
        <td valign="top" style="padding:0;Margin:0;"> 
         <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> 
           <tr style="border-collapse:collapse;"> 
            <td align="center" style="padding:0;Margin:0;"> 
             <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;"> 
               <tr style="border-collapse:collapse;"> 
                <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                 <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                   <tr style="border-collapse:collapse;"> 
                    <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> 
                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                       <tr style="border-collapse:collapse;"> 
                        <td align="center" style="padding:0;Margin:0;"><img class="adapt-img" src="https://codevidhya.com/socialshare/congratulation_mail/EmailSchedule.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="560"></td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
               <tr style="border-collapse:collapse;"> 
               <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
               <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                 <tr style="border-collapse:collapse;"> 
                  <td width="560" align="left" valign="top" style="padding:0;Margin:0;"> 
                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                   
                     <tr style="border-collapse:collapse;"> 
                        <td align="left" class="esd-block-text">
                            <h4 style="font-size: 20px;">Dear ${detail["Parent Name"]}</h4>
                        </td>
                    </tr> 
                     <tr style="border-collapse:collapse;"> 
                      <td align="left" style=""><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"> ${detail["Student Name"]}'s FREE demo has been rescheduled as per the following details:</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p></td> 
                     </tr> 
                     <tr style="border-collapse:collapse;"> 
                      <td align="left" style="padding:0;Margin:0;">
                      <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><strong>Date : </strong> ${detail["Rescheduling Date"]}<br/><strong>Timing : </strong>${detail["Rescheduling Time"]} Hrs<br/><strong>Module : </strong>${detail["Name of Session"]} </p></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
               </table></td> 
               </tr>
               <tr style="border-collapse:collapse;">
               <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
               <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
               <tr style="border-collapse:collapse;"> 
               <td align="left">
               <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">Ensure availability of the following for a great learning experience:<br/>
               <ul>
               <li>A laptop or a desktop.</li>
               <li>An active internet connection.</li>
               <li>Headphones or earphones.</li>
               <li>A notepad, pen or pencil.</li>
               <li>Zeal to Learn!</li>
               </ul></p>
               </td>
               </tr>
                
               </table>
               </td>
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
             <tr style="border-collapse:collapse;">
             <td align="left">
             <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
             Kindly find the exclusive link to join ${detail["Student Name"]}'s class below:<br/>
             </p>
             <p style="Margin:10;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
             <center><a style="text-decoration:none;padding:8px 16px; background:#008dd2;color:#fff" href="${detail["Class Link"]}" target="_blank">Join Class </a></center>
             </p>
             </td>
             </tr>
             </table>
             </td>
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
              <tr style="border-collapse:collapse;">
              <td align="left">
              <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
              Once this demo session is complete, ${detail["Student Name"]} will be eligible for a certificate from Codevidhya, which you can proudly share with your friends and family.
              </p>
              </td>
              </tr>
              <tr style="border-collapse:collapse;">
              <td align="left">
              <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
              We request you to be ready 10 minutes before the class starts.<br/>
              <Happy Learning!>
              </p>
              </td>
              </tr>
             </table>
              </td>
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
              <tr style="border-collapse:collapse;">
              <td align="left">
              <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
              Thank You
              </p>
              </td>
              </tr>
              </table>
             </td>
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
              <tr style="border-collapse:collapse;">
              <td align="left">
              <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
              <strong>
              Team Codevidhya
              </strong><br/>
              <strong>
              For support, call us at +91 73 5728 6330
              </strong><br/>
              </p>
              </td>
              </tr>
              </table>
             </td>
             </tr>
              <!--footer image-->
             <tr style="border-collapse:collapse;">
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
             <tr style="border-collapse:collapse;"> 
             <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
             <tr style="border-collapse:collapse;"> 
             <td align="center" style="padding:0;Margin:0;"><img class="adapt-img" src="https://codevidhya.com/socialshare/congratulation_mail/79221579249313822.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="560"></td> 
             </tr>
             <tr style="border-collapse:collapse;"> 
             <td align="center" style="padding:0;Margin:0;"> 
              <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                <tr style="border-collapse:collapse;"> 
                 <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://www.facebook.com/codevidhya/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Facebook" src="https://codevidhya.com/socialshare/congratulation_mail/facebook-circle-colored.png" alt="Fb" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                 <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://twitter.com/codevidhya?lang=en" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Twitter" src="https://codevidhya.com/socialshare/congratulation_mail/twitter-circle-colored.png" alt="Tw" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                 <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://www.instagram.com/codevidhya/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Instagram" src=https://codevidhya.com/socialshare/congratulation_mail/instagram-circle-colored.png" alt="Inst" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                 <td align="center" valign="top" style="padding:0;Margin:0;"><a target="_blank" href="https://www.linkedin.com/company/13221503/admin/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Linkedin" src="https://codevidhya.com/socialshare/congratulation_mail/linkedin-circle-colored.png" alt="In" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                </tr> 
              </table></td> 
            </tr> 
             </table>
             </td>
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="center">
             <p>
             <strong style="color:#008dd2">Codevidhya India Private Limited</strong><br/>
            <span style="color: #888; font-size:13px;">2nd floor, 96, Officers Campus, Sirsi Road, Vaishali Nagar, Jaipur -302021 (Rajasthan)<br/>
             +91  7357286330  | <a href="mailto:contact@codevidhya.com"><span style="color: #555; font-weight:600;text-decoration:none;"> contact@codevidhya.com </span></a><br/>
             <a style="text-decoration:none;" href="https://codevidhya.com" target="_blank">www.codevidhya.com </a>
             <span></p>
             </td>
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="center">
             
             </td>
             </tr>
             </table>
            </td>
             </tr>
             <!--End footer image-->
             
        </table>
          </div>
          </body>
          </html>`,
      };
      return mg.messages().send(data);
    });
    /***End Reschedule mail */
  }
  async function feedbackMail(...details) {
    console.log("Feedback mail");
    /***feedback mail */
    await asyncforEach(details, async (detail, index) => {
      const mailgun = require("mailgun-js");
      const DOMAIN = "mail.codevidhya.com";
      const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
      const mg = mailgun({ apiKey: api, domain: DOMAIN });
      const data = {
        from: "Codevidhya <contact@codevidhya.com>",
        to: detail["Email ID"],
        cc: "Codevidhya <contact@codevidhya.com>",
        subject: `${detail["Student Name"]}'s Certificate & Your Feedback`,
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
          <head> 
      <meta charset="UTF-8"> 
      <meta content="width=device-width, initial-scale=1" name="viewport"> 
      <meta name="x-apple-disable-message-reformatting"> 
      <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
      <meta content="telephone=no" name="format-detection"> 
      <title>Email Temp</title> 
      <!--[if (mso 16)]>
        <style type="text/css">
        a {text-decoration: none;}
        </style>
        <![endif]--> 
      <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> 
      <style type="text/css">
    @media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:30px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:20px!important; display:block!important; border-width:10px 0px 10px 0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .adapt-img-small { width:70%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
    #outlook a {
      padding:0;
    }
    .ExternalClass {
      width:100%;
    }
    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
      line-height:100%;
    }
    .es-button {
      mso-style-priority:100!important;
      text-decoration:none!important;
    }
    a[x-apple-data-detectors] {
      color:inherit!important;
      text-decoration:none!important;
      font-size:inherit!important;
      font-family:inherit!important;
      font-weight:inherit!important;
      line-height:inherit!important;
    }
    .es-desk-hidden {
      display:none;
      float:left;
      overflow:hidden;
      width:0;
      max-height:0;
      line-height:0;
      mso-hide:all;
    }
    </style> 
     </head> 
          <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
          <div class="es-wrapper-color" style="background-color:#F6F6F6;"> 
          <!--[if gte mso 9]>
          <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
            <v:fill type="tile" color="#f6f6f6"></v:fill>
          </v:background>
        <![endif]--> 
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;"> 
        <tr style="border-collapse:collapse;"> 
        <td valign="top" style="padding:0;Margin:0;"> 
         <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> 
           <tr style="border-collapse:collapse;"> 
            <td align="center" style="padding:0;Margin:0;"> 
             <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;"> 
               <tr style="border-collapse:collapse;"> 
                <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                 <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                   <tr style="border-collapse:collapse;"> 
                    <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> 
                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                       <tr style="border-collapse:collapse;"> 
                        <td align="center" style="padding:0;Margin:0;"><img class="adapt-img" src="https://codevidhya.com/socialshare/congratulation_mail/EmailSchedule.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="560"></td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
               <tr style="border-collapse:collapse;"> 
               <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
               <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                 <tr style="border-collapse:collapse;"> 
                  <td width="560" align="left" valign="top" style="padding:0;Margin:0;"> 
                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                   
                     <tr style="border-collapse:collapse;"> 
                        <td align="left" class="esd-block-text">
                            <h4 style="font-size: 20px;">Dear ${detail["Parent Name"]}</h4>
                        </td>
                    </tr> 
                     <tr style="border-collapse:collapse;"> 
                      <td align="left" style="">
                      <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"> 
                      We are glad you chose Codevidhya for giving ${detail["Student Name"]} a chance to be Creator of Technology by learning to Code. 
                      </p>
                      </td> 
                     </tr> 
                     <tr style="border-collapse:collapse;"> 
                      <td align="left" style="padding-top:20px;>
                      <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                      Congratulations on successful completion of ${detail["Student Name"]}'s first Coding Class. Here's ${detail["Student Name"]}'s Certificate of Completion that you can proudly share with your friends and family.
                      </p>
                      <p style="Margin:10;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                      <center><a style="text-decoration:none;padding:8px 16px; background:#008dd2;color:#fff" href="https://codevidhya.com/live-class/certificate" target="_blank">Certificate of Completion </a></center>
                      </p>
                      </td> 
                     </tr> 
                   </table></td> 
                 </tr> 
               </table></td> 
               </tr>
               <tr style="border-collapse:collapse;">
               <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
               <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
               <tr style="border-collapse:collapse;"> 
               <td align="left">
               <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
               As part of our efforts to understand your experience, we request your honest feedback
               </p>
               <p style="Margin:10;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
               <center><a style="text-decoration:none;padding:8px 16px; background:#008dd2;color:#fff" href="https://zfrmz.com/CG8nOYO2wDfhTwnOYPLu" target="_blank">Give Feedback </a></center>
               </p>
               </td>
               </tr>
                
               </table>
               </td>
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
             <tr style="border-collapse:collapse;">
             <td align="left">
             <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
             Complaint, or compliment, we would love to hear from you!
             </p>
             </td>
             </tr>
             </table>
             </td>
             </tr>
              <tr style="border-collapse:collapse;">
              <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;">
              <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
              Keep Coding!<br>
              Keep Creating!!
              </p>
              </td>
              </tr>
              <tr style="border-collapse:collapse;">
              <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
              <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
               <tr style="border-collapse:collapse;">
               <td align="left">
               <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
               <strong>
               Team Codevidhya
               </strong><br/>
               <strong>
               For support, call us at +91 73 5728 6330
               </strong><br/>
               </p>
               </td>
               </tr>
               </table>
              </td>
              </tr>
              <!--footer image-->
              <tr style="border-collapse:collapse;">
              <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
              <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
              <tr style="border-collapse:collapse;"> 
              <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
              <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
              <tr style="border-collapse:collapse;"> 
              <td align="center" style="padding:0;Margin:0;"><img class="adapt-img" src="https://codevidhya.com/socialshare/congratulation_mail/79221579249313822.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="560"></td> 
              </tr>
              <tr style="border-collapse:collapse;"> 
              <td align="center" style="padding:0;Margin:0;"> 
               <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://www.facebook.com/codevidhya/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Facebook" src="https://codevidhya.com/socialshare/congratulation_mail/facebook-circle-colored.png" alt="Fb" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                  <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://twitter.com/codevidhya?lang=en" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Twitter" src="https://codevidhya.com/socialshare/congratulation_mail/twitter-circle-colored.png" alt="Tw" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                  <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://www.instagram.com/codevidhya/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Instagram" src="https://codevidhya.com/socialshare/congratulation_mail/instagram.png" alt="Inst" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                  <td align="center" valign="top" style="padding:0;Margin:0;"><a target="_blank" href="https://www.linkedin.com/company/13221503/admin/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Linkedin" src="https://codevidhya.com/socialshare/congratulation_mail/linkedin-circle-colored.png" alt="In" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                 </tr> 
               </table></td> 
             </tr> 
              </table>
              </td>
              </tr>
              <tr style="border-collapse:collapse;">
              <td align="center">
              <p>
              <strong style="color:#008dd2">Codevidhya India Private Limited</strong><br/>
             <span style="color: #888; font-size:13px;">2nd floor, 96, Officers Campus, Sirsi Road, Vaishali Nagar, Jaipur -302021 (Rajasthan)<br/>
              +91  7357286330  | <a href="mailto:contact@codevidhya.com"><span style="color: #555; font-weight:600;text-decoration:none;"> contact@codevidhya.com </span></a><br/>
              <a style="text-decoration:none;" href="https://codevidhya.com" target="_blank">www.codevidhya.com </a>
              <span></p>
              </td>
              </tr>
              <tr style="border-collapse:collapse;">
              <td align="center">
              
              </td>
              </tr>
              </table>
             </td>
              </tr>
              <!--End footer image-->



             </table>
              </td>
             </tr>
            
         
             
        </table>
          </div>
          </body>
          </html>`,
      };
      return mg.messages().send(data);
    });

    /***End feedback mail */
  }
  async function remainderMailReschedule(...details) {
    console.log("remainder");
    await asyncforEach(details, async (detail, index) => {
      const mailgun = require("mailgun-js");
      const DOMAIN = "mail.codevidhya.com";
      const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
      const mg = mailgun({ apiKey: api, domain: DOMAIN });
      const data = {
        from: "Codevidhya <contact@codevidhya.com>",
        to: detail["Email ID"],
        cc: "Codevidhya <contact@codevidhya.com>",
        subject: `Reminder for ${detail["Student Name"]}'s Coding Class…Starts Soon!`,
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
        <head> 
    <meta charset="UTF-8"> 
    <meta content="width=device-width, initial-scale=1" name="viewport"> 
    <meta name="x-apple-disable-message-reformatting"> 
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
    <meta content="telephone=no" name="format-detection"> 
    <title>Email Temp</title> 
    <!--[if (mso 16)]>a
      <style type="text/css">
      a {text-decoration: none;}
      </style>
      <![endif]--> 
    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> 
    <style type="text/css">
  @media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:30px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:20px!important; display:block!important; border-width:10px 0px 10px 0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .adapt-img-small { width:70%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
  #outlook a {
    padding:0;
  }
  .ExternalClass {
    width:100%;
  }
  .ExternalClass,
  .ExternalClass p,
  .ExternalClass span,
  .ExternalClass font,
  .ExternalClass td,
  .ExternalClass div {
    line-height:100%;
  }
  .es-button {
    mso-style-priority:100!important;
    text-decoration:none!important;
  }
  a[x-apple-data-detectors] {
    color:inherit!important;
    text-decoration:none!important;
    font-size:inherit!important;
    font-family:inherit!important;
    font-weight:inherit!important;
    line-height:inherit!important;
  }
  .es-desk-hidden {
    display:none;
    float:left;
    overflow:hidden;
    width:0;
    max-height:0;
    line-height:0;
    mso-hide:all;
  }
  </style> 
   </head> 
        <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
        <div class="es-wrapper-color" style="background-color:#F6F6F6;"> 
        <!--[if gte mso 9]>
        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
          <v:fill type="tile" color="#f6f6f6"></v:fill>
        </v:background>
      <![endif]--> 
      <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;"> 
      <tr style="border-collapse:collapse;"> 
      <td valign="top" style="padding:0;Margin:0;"> 
       <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> 
         <tr style="border-collapse:collapse;"> 
          <td align="center" style="padding:0;Margin:0;"> 
           <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;"> 
             <tr style="border-collapse:collapse;"> 
              <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
               <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                 <tr style="border-collapse:collapse;"> 
                  <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> 
                   <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td align="center" style="padding:0;Margin:0;"><img class="adapt-img" src="https://codevidhya.com/socialshare/congratulation_mail/EmailSchedule.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="560"></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
               </table></td> 
             </tr> 
             <tr style="border-collapse:collapse;"> 
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
               <tr style="border-collapse:collapse;"> 
                <td width="560" align="left" valign="top" style="padding:0;Margin:0;"> 
                 <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                 
                   <tr style="border-collapse:collapse;"> 
                      <td align="left" class="esd-block-text">
                          <h4 style="font-size: 20px;">Dear ${detail["Parent Name"]}</h4>
                      </td>
                  </tr> 
                   <tr style="border-collapse:collapse;"> 
                    <td align="left" style=""><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                    A gentle reminder for ${detail["Student Name"]}'s FREE Coding Class, starting soon!
                    </p>
                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                    <br></p>
                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                    <br></p>
                    </td> 
                   </tr> 
                   <tr style="border-collapse:collapse;"> 
                    <td align="left" style="padding:0;Margin:0;">
                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                    <strong>Date : </strong> ${detail["Rescheduling Date"]}<br/>
                    <strong>Timing : </strong>${detail["Rescheduling Time"]} Hrs<br/>
                    <strong>Module : </strong>${detail["Name of Session"]} </p></td> 
                   </tr> 
                 </table></td> 
               </tr> 
             </table></td> 
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
             <tr style="border-collapse:collapse;"> 
             <td align="left">
             <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">Ensure availability of the following for a great learning experience:<br/>
             <ul>
             <li>A laptop or a desktop.</li>
             <li>An active internet connection.</li>
             <li>Headphones or earphones.</li>
             <li>A notepad, pen or pencil.</li>
             <li>Zeal to Learn!</li>
             </ul></p>
             </td>
             </tr>
              
             </table>
             </td>
           </tr>
           <tr style="border-collapse:collapse;">
           <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
           <tr style="border-collapse:collapse;">
           <td align="left">
           <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
           Kindly find the exclusive link to join ${detail["Student Name"]}'s class below:<br/>
           </p>
           <p style="Margin:10;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
             <center><a style="text-decoration:none;padding:8px 16px; background:#008dd2;color:#fff" href="${detail["Class Link"]}" target="_blank">Join Class </a></center>
             </p>
           </td>
           </tr>
           </table>
           </td>
           </tr>
           <tr style="border-collapse:collapse;">
           <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
            <tr style="border-collapse:collapse;">
            <td align="left">
            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
            Also under mentioned is the Codevidhya Platform username and password. Please refer when your trainer asks to login through www.codevidhya.com<br/>
            <strong>Username : </strong>${detail["Username"]}<br/>
            <strong>Password : </strong>${detail["Password"]}<br/>
            </p>
            </td>
            </tr>
            <tr style="border-collapse:collapse;">
            <td align="left">
            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
            Once this demo session is complete, ${detail["Student Name"]} will be eligible for a certificate from Codevidhya, which you can proudly share with your friends and family
            </p>
            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
            We look forward to your enthusiastic presence.
            </p>
            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
            Please be ready 10 minutes before the class starts. 
            </p>
            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
            For any assistance, feel free to reach out to us.
            </p>
            </td>
            </tr>
           </table>
            </td>
           </tr>
          
           <tr style="border-collapse:collapse;">
           <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
            <tr style="border-collapse:collapse;">
            <td align="left">
            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
            <strong>Regards,</strong><br/>
            <strong>
            Team Codevidhya
            </strong><br/>
            <strong>
            For support, call us at +91 73 5728 6330
            </strong><br/>
            </p>
            </td>
            </tr>
            </table>
           </td>
           </tr>
            <!--footer image-->
           <tr style="border-collapse:collapse;">
           <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
           <tr style="border-collapse:collapse;"> 
           <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
           <tr style="border-collapse:collapse;"> 
           <td align="center" style="padding:0;Margin:0;"><img class="adapt-img" src="https://codevidhya.com/socialshare/congratulation_mail/79221579249313822.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="560"></td> 
           </tr>
           <tr style="border-collapse:collapse;"> 
           <td align="center" style="padding:0;Margin:0;"> 
            <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
              <tr style="border-collapse:collapse;"> 
               <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://www.facebook.com/codevidhya/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Facebook" src="https://codevidhya.com/socialshare/congratulation_mail/facebook-circle-colored.png" alt="Fb" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
               <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://twitter.com/codevidhya?lang=en" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Twitter" src="https://codevidhya.com/socialshare/congratulation_mail/twitter-circle-colored.png" alt="Tw" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
               <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://www.instagram.com/codevidhya/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Instagram" src="https://codevidhya.com/socialshare/congratulation_mail/instagram-circle-colored.PNG" alt="Inst" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
               <td align="center" valign="top" style="padding:0;Margin:0;"><a target="_blank" href="https://www.linkedin.com/company/13221503/admin/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Linkedin" src="https://codevidhya.com/socialshare/congratulation_mail/linkedin-circle-colored.png" alt="In" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
              </tr> 
            </table></td> 
          </tr> 
           </table>
           </td>
           </tr>
           <tr style="border-collapse:collapse;">
           <td align="center">
           <p>
           <strong style="color:#008dd2">Codevidhya India Private Limited</strong><br/>
          <span style="color: #888; font-size:13px;">2nd floor, 96, Officers Campus, Sirsi Road, Vaishali Nagar, Jaipur -302021 (Rajasthan)<br/>
           +91  7357286330  | <a href="mailto:contact@codevidhya.com"><span style="color: #555; font-weight:600;text-decoration:none;"> contact@codevidhya.com </span></a><br/>
           <a style="text-decoration:none;" href="https://codevidhya.com" target="_blank">www.codevidhya.com </a>
           <span></p>
           </td>
           </tr>
           <tr style="border-collapse:collapse;">
           <td align="center">
           
           </td>
           </tr>
           </table>
          </td>
           </tr>
           <!--End footer image-->
           
      </table>
        </div>
        </body>
        </html>`,
      };
      return mg.messages().send(data);
    });
  }
  async function remainderMail(...details) {
    console.log("remainder");
    await asyncforEach(details, async (detail, index) => {
      const mailgun = require("mailgun-js");
      const DOMAIN = "mail.codevidhya.com";
      const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
      const mg = mailgun({ apiKey: api, domain: DOMAIN });
      const data = {
        from: "Codevidhya <contact@codevidhya.com>",
        to: detail["Email ID"],
        cc: "Codevidhya <contact@codevidhya.com>",
        subject: `Reminder for ${detail["Student Name"]}'s Coding Class…Starts Soon!`,
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
        <head> 
    <meta charset="UTF-8"> 
    <meta content="width=device-width, initial-scale=1" name="viewport"> 
    <meta name="x-apple-disable-message-reformatting"> 
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
    <meta content="telephone=no" name="format-detection"> 
    <title>Email Temp</title> 
    <!--[if (mso 16)]>
      <style type="text/css">
      a {text-decoration: none;}
      </style>
      <![endif]--> 
    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> 
    <style type="text/css">
  @media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:30px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:20px!important; display:block!important; border-width:10px 0px 10px 0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .adapt-img-small { width:70%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
  #outlook a {
    padding:0;
  }
  .ExternalClass {
    width:100%;
  }
  .ExternalClass,
  .ExternalClass p,
  .ExternalClass span,
  .ExternalClass font,
  .ExternalClass td,
  .ExternalClass div {
    line-height:100%;
  }
  .es-button {
    mso-style-priority:100!important;
    text-decoration:none!important;
  }
  a[x-apple-data-detectors] {
    color:inherit!important;
    text-decoration:none!important;
    font-size:inherit!important;
    font-family:inherit!important;
    font-weight:inherit!important;
    line-height:inherit!important;
  }
  .es-desk-hidden {
    display:none;
    float:left;
    overflow:hidden;
    width:0;
    max-height:0;
    line-height:0;
    mso-hide:all;
  }
  </style> 
   </head> 
        <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
        <div class="es-wrapper-color" style="background-color:#F6F6F6;"> 
        <!--[if gte mso 9]>
        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
          <v:fill type="tile" color="#f6f6f6"></v:fill>
        </v:background>
      <![endif]--> 
      <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;"> 
      <tr style="border-collapse:collapse;"> 
      <td valign="top" style="padding:0;Margin:0;"> 
       <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> 
         <tr style="border-collapse:collapse;"> 
          <td align="center" style="padding:0;Margin:0;"> 
           <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;"> 
             <tr style="border-collapse:collapse;"> 
              <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
               <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                 <tr style="border-collapse:collapse;"> 
                  <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> 
                   <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td align="center" style="padding:0;Margin:0;"><img class="adapt-img" src="https://codevidhya.com/socialshare/congratulation_mail/EmailSchedule.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="560"></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
               </table></td> 
             </tr> 
             <tr style="border-collapse:collapse;"> 
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
               <tr style="border-collapse:collapse;"> 
                <td width="560" align="left" valign="top" style="padding:0;Margin:0;"> 
                 <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                 
                   <tr style="border-collapse:collapse;"> 
                      <td align="left" class="esd-block-text">
                          <h4 style="font-size: 20px;">Dear ${detail["Parent Name"]}</h4>
                      </td>
                  </tr> 
                   <tr style="border-collapse:collapse;"> 
                    <td align="left" style=""><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                    A gentle reminder for ${detail["Student Name"]}'s FREE Coding Class, starting soon!
                    </p>
                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                    <br></p>
                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                    <br></p>
                    </td> 
                   </tr> 
                   <tr style="border-collapse:collapse;"> 
                    <td align="left" style="padding:0;Margin:0;">
                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                    <strong>Date : </strong> ${detail["Session Date"]}<br/>
                    <strong>Timing : </strong>${detail["Time"]} Hrs<br/>
                    <strong>Module : </strong>${detail["Name of Session"]} </p></td> 
                   </tr> 
                 </table></td> 
               </tr> 
             </table></td> 
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
             <tr style="border-collapse:collapse;"> 
             <td align="left">
             <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
             Ensure availability of the following for a great learning experience:<br/>
             <ul>
             <li>A laptop or a desktop.</li>
             <li>An active internet connection.</li>
             <li>Headphones or earphones.</li>
             <li>A notepad, pen or pencil.</li>
             <li>Zeal to Learn!</li>
             </ul></p>
             </td>
             </tr>
              
             </table>
             </td>
           </tr>
           <tr style="border-collapse:collapse;">
           <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
           <tr style="border-collapse:collapse;">
           <td align="left">
           <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
           Kindly find the exclusive link to join ${detail["Student Name"]}'s class below:<br/>
           </p>
           <p style="Margin:10;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
             <center><a style="text-decoration:none;padding:8px 16px; background:#008dd2;color:#fff" href="${detail["Class Link"]}" target="_blank">Join Class </a></center>
             </p>
           </td>
           </tr>
           </table>
           </td>
           </tr>
           <tr style="border-collapse:collapse;">
           <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
            <tr style="border-collapse:collapse;">
            <td align="left">
            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
            Also under mentioned is the Codevidhya Platform username and password. Please refer when your trainer asks to login through www.codevidhya.com<br/>
            <strong>Username : </strong>${detail["Username"]}<br/>
            <strong>Password : </strong>${detail["Password"]}<br/>
            </p>
            </td>
            </tr>
            <tr style="border-collapse:collapse;">
            <td align="left">
            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
            Once this demo session is complete, ${detail["Student Name"]} will be eligible for a certificate from Codevidhya, which you can proudly share with your friends and family
            </p>
            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
            We look forward to your enthusiastic presence.
            </p>
            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
            Please be ready 10 minutes before the class starts. 
            </p>
            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
            For any assistance, feel free to reach out to us.
            </p>
            </td>
            </tr>
           </table>
            </td>
           </tr>
          
           <tr style="border-collapse:collapse;">
           <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
            <tr style="border-collapse:collapse;">
            <td align="left">
            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
            <strong>Regards,</strong><br/>
            <strong>
            Team Codevidhya
            </strong><br/>
            <strong>
            For support, call us at +91 73 5728 6330
            </strong><br/>
            </p>
            </td>
            </tr>
            </table>
           </td>
           </tr>
            <!--footer image-->
           <tr style="border-collapse:collapse;">
           <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
           <tr style="border-collapse:collapse;"> 
           <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
           <tr style="border-collapse:collapse;"> 
           <td align="center" style="padding:0;Margin:0;"><img class="adapt-img" src="https://codevidhya.com/socialshare/congratulation_mail/79221579249313822.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="560"></td> 
           </tr>
           <tr style="border-collapse:collapse;"> 
           <td align="center" style="padding:0;Margin:0;"> 
            <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
              <tr style="border-collapse:collapse;"> 
               <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://www.facebook.com/codevidhya/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Facebook" src="https://codevidhya.com/socialshare/congratulation_mail/facebook-circle-colored.png" alt="Fb" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
               <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://twitter.com/codevidhya?lang=en" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Twitter" src="https://codevidhya.com/socialshare/congratulation_mail/twitter-circle-colored.png" alt="Tw" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
               <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://www.instagram.com/codevidhya/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Instagram" src="https://codevidhya.com/socialshare/congratulation_mail/instagram-circle-colored.PNG" alt="Inst" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
               <td align="center" valign="top" style="padding:0;Margin:0;"><a target="_blank" href="https://www.linkedin.com/company/13221503/admin/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Linkedin" src="https://codevidhya.com/socialshare/congratulation_mail/linkedin-circle-colored.png" alt="In" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
              </tr> 
            </table></td> 
          </tr> 
           </table>
           </td>
           </tr>
           <tr style="border-collapse:collapse;">
           <td align="center">
           <p>
           <strong style="color:#008dd2">Codevidhya India Private Limited</strong><br/>
          <span style="color: #888; font-size:13px;">2nd floor, 96, Officers Campus, Sirsi Road, Vaishali Nagar, Jaipur -302021 (Rajasthan)<br/>
           +91  7357286330  | <a href="mailto:contact@codevidhya.com"><span style="color: #555; font-weight:600;text-decoration:none;"> contact@codevidhya.com </span></a><br/>
           <a style="text-decoration:none;" href="https://codevidhya.com" target="_blank">www.codevidhya.com </a>
           <span></p>
           </td>
           </tr>
           <tr style="border-collapse:collapse;">
           <td align="center">
           
           </td>
           </tr>
           </table>
          </td>
           </tr>
           <!--End footer image-->
           
      </table>
        </div>
        </body>
        </html>`,
      };
      return mg.messages().send(data);
    });
  }
  async function sendSessionScheduleMail(...details) {
    await asyncforEach(details, async (detail, index) => {
      const mailgun = require("mailgun-js");
      const DOMAIN = "mail.codevidhya.com";
      const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
      const mg = mailgun({ apiKey: api, domain: DOMAIN });
      const data = {
        from: "Codevidhya <contact@codevidhya.com>",
        to: detail["Email ID"],
        cc: "Codevidhya <contact@codevidhya.com>",
        subject: `${detail["Student Name"]}'s Coding Class is Confirmed `,
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
          <head> 
      <meta charset="UTF-8"> 
      <meta content="width=device-width, initial-scale=1" name="viewport"> 
      <meta name="x-apple-disable-message-reformatting"> 
      <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
      <meta content="telephone=no" name="format-detection"> 
      <title>Email Temp</title> 
      <!--[if (mso 16)]>
        <style type="text/css">
        a {text-decoration: none;}
        </style>
        <![endif]--> 
      <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> 
      <style type="text/css">
    @media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:30px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:20px!important; display:block!important; border-width:10px 0px 10px 0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .adapt-img-small { width:70%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
    #outlook a {
      padding:0;
    }
    .ExternalClass {
      width:100%;
    }
    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
      line-height:100%;
    }
    .es-button {
      mso-style-priority:100!important;
      text-decoration:none!important;
    }
    a[x-apple-data-detectors] {
      color:inherit!important;
      text-decoration:none!important;
      font-size:inherit!important;
      font-family:inherit!important;
      font-weight:inherit!important;
      line-height:inherit!important;
    }
    .es-desk-hidden {
      display:none;
      float:left;
      overflow:hidden;
      width:0;
      max-height:0;
      line-height:0;
      mso-hide:all;
    }
    </style> 
     </head> 
          <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
          <div class="es-wrapper-color" style="background-color:#F6F6F6;"> 
          <!--[if gte mso 9]>
          <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
            <v:fill type="tile" color="#f6f6f6"></v:fill>
          </v:background>
        <![endif]--> 
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;"> 
        <tr style="border-collapse:collapse;"> 
        <td valign="top" style="padding:0;Margin:0;"> 
         <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> 
           <tr style="border-collapse:collapse;"> 
            <td align="center" style="padding:0;Margin:0;"> 
             <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;"> 
               <tr style="border-collapse:collapse;"> 
                <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                 <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                   <tr style="border-collapse:collapse;"> 
                    <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> 
                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                       <tr style="border-collapse:collapse;"> 
                        <td align="center" style="padding:0;Margin:0;"><img class="adapt-img" src="https://codevidhya.com/socialshare/congratulation_mail/EmailSchedule.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="560"></td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
               <tr style="border-collapse:collapse;"> 
               <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
               <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                 <tr style="border-collapse:collapse;"> 
                  <td width="560" align="left" valign="top" style="padding:0;Margin:0;"> 
                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                   
                     <tr style="border-collapse:collapse;"> 
                        <td align="left" class="esd-block-text">
                            <h4 style="font-size: 20px;">Dear ${detail["Parent Name"]}</h4>
                        </td>
                    </tr> 
                     <tr style="border-collapse:collapse;"> 
                      <td align="left" style=""><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">Congratulations! ${detail["Student Name"]}'s FREE demo has been scheduled as per the following details:</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p></td> 
                     </tr> 
                     <tr style="border-collapse:collapse;"> 
                      <td align="left" style="padding:0;Margin:0;">
                      <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><strong>Date : </strong> ${detail["Session Date"]}<br/><strong>Timing : </strong>${detail["Time"]} Hrs<br/><strong>Module : </strong>${detail["Name of Session"]} </p></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
               </table></td> 
               </tr>
               <tr style="border-collapse:collapse;">
               <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
               <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
               <tr style="border-collapse:collapse;"> 
               <td align="left">
               <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">Ensure availability of the following for a great learning experience:<br/>
               <ul>
               <li>A laptop or a desktop.</li>
               <li>An active internet connection.</li>
               <li>Headphones or earphones.</li>
               <li>A notepad, pen or pencil.</li>
               <li>Zeal to Learn!</li>
               </ul></p>
               </td>
               </tr>
                
               </table>
               </td>
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
             <tr style="border-collapse:collapse;">
             <td align="left">
             <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
             Kindly find the exclusive link to join ${detail["Student Name"]}'s class below:<br/>
             </p>
             <p style="Margin:10;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
             <center><a style="text-decoration:none;padding:8px 16px; background:#008dd2;color:#fff" href="${detail["Class Link"]}" target="_blank">Join Class </a></center>
             </p>
             </td>
             </tr>
             </table>
             </td>
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
              <tr style="border-collapse:collapse;">
              <td align="left">
              <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
              Once this demo session is complete, ${detail["Student Name"]} will be eligible for a certificate from Codevidhya, which you can proudly share with your friends and family.
              </p>
              </td>
              </tr>
              <tr style="border-collapse:collapse;">
              <td align="left">
              <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
              We request you to be ready 10 minutes before the class starts.<br/>
              <Happy Learning!>
              </p>
              </td>
              </tr>
             </table>
              </td>
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
              <tr style="border-collapse:collapse;">
              <td align="left">
              <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
              Thank You
              </p>
              </td>
              </tr>
              </table>
             </td>
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
              <tr style="border-collapse:collapse;">
              <td align="left">
              <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
              <strong>
              Team Codevidhya
              </strong><br/>
              <strong>
              For support, call us at +91 73 5728 6330
              </strong><br/>
              </p>
              </td>
              </tr>
              </table>
             </td>
             </tr>
              <!--footer image-->
             <tr style="border-collapse:collapse;">
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
             <tr style="border-collapse:collapse;"> 
             <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
             <tr style="border-collapse:collapse;"> 
             <td align="center" style="padding:0;Margin:0;"><img class="adapt-img" src="https://codevidhya.com/socialshare/congratulation_mail/79221579249313822.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="560"></td> 
             </tr>
             <tr style="border-collapse:collapse;"> 
             <td align="center" style="padding:0;Margin:0;"> 
              <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                <tr style="border-collapse:collapse;"> 
                 <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://www.facebook.com/codevidhya/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Facebook" src="https://codevidhya.com/socialshare/congratulation_mail/facebook-circle-colored.png" alt="Fb" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                 <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://twitter.com/codevidhya?lang=en" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Twitter" src="https://codevidhya.com/socialshare/congratulation_mail/twitter-circle-colored.png" alt="Tw" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                 <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://www.instagram.com/codevidhya/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Instagram" src="https://codevidhya.com/socialshare/congratulation_mail/instagram-circle-colored.png" alt="Inst" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                 <td align="center" valign="top" style="padding:0;Margin:0;"><a target="_blank" href="https://www.linkedin.com/company/13221503/admin/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Linkedin" src="https://codevidhya.com/socialshare/congratulation_mail/linkedin-circle-colored.png" alt="In" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                </tr> 
              </table></td> 
            </tr> 
             </table>
             </td>
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="center">
             <p>
             <strong style="color:#008dd2">Codevidhya India Private Limited</strong><br/>
            <span style="color: #888; font-size:13px;">2nd floor, 96, Officers Campus, Sirsi Road, Vaishali Nagar, Jaipur -302021 (Rajasthan)<br/>
             +91  7357286330  | <a href="mailto:contact@codevidhya.com"><span style="color: #555; font-weight:600;text-decoration:none;"> contact@codevidhya.com </span></a><br/>
             <a style="text-decoration:none;" href="https://codevidhya.com" target="_blank">www.codevidhya.com </a>
             <span></p>
             </td>
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="center">
             
             </td>
             </tr>
             </table>
            </td>
             </tr>
             <!--End footer image-->
             
        </table>
          </div>
          </body>
          </html>`,
      };
      return mg.messages().send(data);
    });
  }

  /* await doc.useServiceAccountAuth(creds, async function(err) {
    // Getting cells back from tab #2 of the file
   await doc.getRows(8, callback);
    // Callback function determining what to do with the information
    async function callback(err, rows) {
      await asyncforEach(rows, async (row, index) => {
        let query =
          "SELECT `mail_id`, DATE_FORMAT(`mail_send_date`,'%Y-%m-%d') 'mail_send_date', `username`, `status`, `time`, `reschedule`, DATE_FORMAT(`reschedule_date`,'%Y-%m-%d') 'reschedule_date', `reschedule_time`, `remainder_mail`, `feedback_mail` FROM `live_class_mail_send` WHERE username=? and  DATE_FORMAT(`mail_send_date`,'%Y-%m-%d')=? and time=?";
        let param = [];
        var dateString = row.sessiondate;
        if(dateString!='')
        var dateParts = dateString.split("/");
        var reschedulingdate =row.reschedulingdate;
        
        if(reschedulingdate!='')
        var rescheduleDateParts = reschedulingdate.split("/");
     
        let time = row.time;
        if(timePart!='')
        var timePart = time.split(":");
     
        var retime =row.reschedulingtime;
        if(retime!='')
        var retimePart =retime.split(":");
     
        let currentDate = new Date();
     if(reschedulingdate!='')
     {
       var rescheduleDateObject =new Date(
        +rescheduleDateParts[2],
        rescheduleDateParts[1] - 1,
        +rescheduleDateParts[0]
      ).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      
      var rescheduleDateObj =new Date(rescheduleDateObject);
      rescheduleDateObj.setMinutes(rescheduleDateObj.getMonth()+parseInt(retimePart[1]));
      rescheduleDateObj.setHours(rescheduleDateObj.getHours()+parseInt(retimePart[0]));
      let redataObj1 =rescheduleDateObj.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata"
      });
       var resdateObject =dateFormat(new Date(redataObj1),"yyyy-mm-dd");
       currentDate = new Date();
       var rdiff = (rescheduleDateObj.getTime() - currentDate.getTime()) / 1000;
       rdiff /= 60;
       rdiff = Math.round(rdiff); 
     }
        if(dateString!=''){
        var dateObject1 = new Date(
          +dateParts[2],
          dateParts[1] - 1,
          +dateParts[0]
        ).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      
          var dataObj = new Date(dateObject1);
          dataObj.setMinutes(dataObj.getMinutes() + parseInt(timePart[1]));
          dataObj.setHours(dataObj.getHours() + parseInt(timePart[0]));
          let dataObj1 = dataObj.toLocaleString("en-US", {
            timeZone: "Asia/Kolkata"
          });
  
          var dateObject = dateFormat(new Date(dataObj1), "yyyy-mm-dd");
          currentDate = new Date();
          var diff = (dataObj.getTime() - currentDate.getTime()) / 1000;
          diff /= 60;
          diff = Math.round(diff);  
        }
        else{
          
          dataObj='';
          dateObject1='';
          dateObject='';
          diff=0;
        }
        
       
      //  console.log(row.username+' '+dateObject+' '+row.time);
        let  GetDetails=[];
        return await dbUtils
          .runSqlQueryAsyncSelect(query, [row.username, dateObject, row.time])
          .then(async (resultData) => {
           
            if (resultData.err) throw resultData.err;
            else {
              if (resultData.result.length) {
                GetDetails = resultData.result;
                if (
                  GetDetails[0].remainder_mail != "1" &&
                  ((diff <= 60 && diff >= 0)||(GetDetails[0].reschedule==1 && ((rdiff <= 60 && rdiff >= 0)))
                )) {
                  query =
                    "UPDATE `live_class_mail_send` SET `remainder_mail`=? where live_class_mail_send.mail_id=?";
                  param = [1, GetDetails[0].mail_id];
                 
                  return await dbUtils.runSqlQueryAsyncUpdate(query, param);
                } 
                else if(row.status == "Rescheduling" && (rdiff>=0) &&((GetDetails[0].reschedule==0)||(GetDetails[0].reschedule==1&&(resdateObject != GetDetails[0].reschedule_date||retime != GetDetails[0].reschedule_time)))){

                    query="UPDATE `live_class_mail_send` SET `reschedule`=1,`reschedule_date`=?,`reschedule_time`=?,`remainder_mail`='0',`feedback_mail`=0 WHERE mail_id=?";
                    param=[resdateObject,retime,GetDetails[0].mail_id]
                   
                    return await dbUtils.runSqlQueryAsyncUpdate(query, param);
                 }
                else if (
                  GetDetails[0].feedback_mail != "1" &&
                  diff <= -1 &&
                  row.status == "Done"
                ) {
                  query =
                    "UPDATE `live_class_mail_send` SET `feedback_mail`=? where live_class_mail_send.mail_id=?";
                  param = [1, GetDetails[0].mail_id];
                  
                  return await dbUtils.runSqlQueryAsyncUpdate(query, param);
                } else {
                  return "";
                }
              } 
                 else {

                query =
                  "INSERT INTO `live_class_mail_send`(`mail_send_date`, `username`, `status`, `time`) VALUES (?,?,1,?)";
                param = [dateObject, row.username, row.time];
              
                if(row.username!=""&&row.time!=""&&row.parentname!=""&&row.studentname!=""&&row.sessiondate!=""&&row.nameofsession!=''&&row.username!=''&&row.password!=''&&row.classlink!=''){
                  if (
                    row.status != "Done" &&
                    dataObj.getTime() >= currentDate.getTime()
                  ) {
                    
                  }
                  return await dbUtils.runSqlQueryAsyncInsert(query, param);
                }
                
                else
                return "";
              }
            }
          })
          .then(async (InsertedData) => {
            
            if(InsertedData){
              if (InsertedData.err) throw InsertedData.err;
              else {
                if (GetDetails.length) {
                  
                  if (
                    GetDetails[0].remainder_mail != "1" &&
                    ((diff <= 60 && diff >= 0)||(GetDetails[0].reschedule==1 && ((rdiff <= 60 && rdiff >= 0)))
                  )) {
                    await remainderMail(row);
                  }
                  else if(row.status == "Rescheduling" && (rdiff>=0) &&((GetDetails[0].reschedule==0)||(GetDetails[0].reschedule==1&&(resdateObject != GetDetails[0].reschedule_date||retime != GetDetails[0].reschedule_time)))){
                    await reschduleMail(row);
                  }
                  else if (
                    GetDetails[0].feedback_mail != "1" &&
                    diff <= -1 &&
                    row.status == "Done"
                  ) {
                    await feedbackMail(row);
                  }
               }
               else
               {
                await sendSessionScheduleMail(row);
               }
            }
          }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
    async function asyncforEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }
    async function reschduleMail(...details)
    {
      console.log('reschedule mail');
    }
    async function feedbackMail(...details) {
      console.log("Feedback mail");
    }
    async function remainderMail(...details) {
      console.log("Remainder mail");
      await asyncforEach(details, async (detail, index) => {
        const mailgun = require("mailgun-js");
        const DOMAIN = "mail.codevidhya.com";
        const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
        const mg = mailgun({ apiKey: api, domain: DOMAIN });
        const data = {
          from: "Codevidhya <contact@codevidhya.com>",
          to: detail.emailid,
          cc: "Codevidhya <contact@codevidhya.com>",
          subject: "Reminder Mail  Before One Hour Of Demo Class",
          html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
        <head> 
    <meta charset="UTF-8"> 
    <meta content="width=device-width, initial-scale=1" name="viewport"> 
    <meta name="x-apple-disable-message-reformatting"> 
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
    <meta content="telephone=no" name="format-detection"> 
    <title>Email Temp</title> 
    <!--[if (mso 16)]>
      <style type="text/css">
      a {text-decoration: none;}
      </style>
      <![endif]--> 
    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> 
    <style type="text/css">
  @media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:30px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:20px!important; display:block!important; border-width:10px 0px 10px 0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .adapt-img-small { width:70%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
  #outlook a {
    padding:0;
  }
  .ExternalClass {
    width:100%;
  }
  .ExternalClass,
  .ExternalClass p,
  .ExternalClass span,
  .ExternalClass font,
  .ExternalClass td,
  .ExternalClass div {
    line-height:100%;
  }
  .es-button {
    mso-style-priority:100!important;
    text-decoration:none!important;
  }
  a[x-apple-data-detectors] {
    color:inherit!important;
    text-decoration:none!important;
    font-size:inherit!important;
    font-family:inherit!important;
    font-weight:inherit!important;
    line-height:inherit!important;
  }
  .es-desk-hidden {
    display:none;
    float:left;
    overflow:hidden;
    width:0;
    max-height:0;
    line-height:0;
    mso-hide:all;
  }
  </style> 
   </head> 
        <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
        <div class="es-wrapper-color" style="background-color:#F6F6F6;"> 
        <!--[if gte mso 9]>
        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
          <v:fill type="tile" color="#f6f6f6"></v:fill>
        </v:background>
      <![endif]--> 
      <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;"> 
      <tr style="border-collapse:collapse;"> 
      <td valign="top" style="padding:0;Margin:0;"> 
       <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> 
         <tr style="border-collapse:collapse;"> 
          <td align="center" style="padding:0;Margin:0;"> 
           <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;"> 
             <tr style="border-collapse:collapse;"> 
              <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
               <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                 <tr style="border-collapse:collapse;"> 
                  <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> 
                   <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td align="center" style="padding:0;Margin:0;"><img class="adapt-img" src="https://codevidhya.com/socialshare/congratulation_mail/EmailSchedule.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="560"></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
               </table></td> 
             </tr> 
             <tr style="border-collapse:collapse;"> 
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
               <tr style="border-collapse:collapse;"> 
                <td width="560" align="left" valign="top" style="padding:0;Margin:0;"> 
                 <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                 
                   <tr style="border-collapse:collapse;"> 
                      <td align="left" class="esd-block-text">
                          <h3 style="font-size: 31px;">Dear ${detail.parentname}</h3>
                      </td>
                  </tr> 
                   <tr style="border-collapse:collapse;"> 
                    <td align="left" style=""><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                    A gentle reminder for  ${detail.studentname}'s FREE Coding Class, starting in 60 minutes!
                    </p>
                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                    <br></p>
                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                    <br></p>
                    </td> 
                   </tr> 
                   <tr style="border-collapse:collapse;"> 
                    <td align="left" style="padding:0;Margin:0;">
                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                    <strong>Date : </strong> ${detail.sessiondate}<br/>
                    <strong>Timing : </strong>${detail.time} Hrs<br/>
                    <strong>Module : </strong>${detail.nameofsession} </p></td> 
                   </tr> 
                 </table></td> 
               </tr> 
             </table></td> 
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
             <tr style="border-collapse:collapse;"> 
             <td align="left">
             <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">Ensure availability of the following for a great learning experience:<br/>
             <ul>
             <li>A laptop or a desktop.</li>
             <li>An active internet connection.</li>
             <li>Headphones or earphones.</li>
             <li>A notepad, pen or pencil.</li>
             <li>Zeal to Learn!</li>
             </ul></p>
             </td>
             </tr>
              
             </table>
             </td>
           </tr>
           <tr style="border-collapse:collapse;">
           <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
           <tr style="border-collapse:collapse;">
           <td align="left">
           <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
           Kindly find the exclusive link to join ${detail.studentname}'s class below:<br/>
           </p>
           <p style="Margin:10;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
             <center><a style="text-decoration:none;padding:8px 16px; background:#008dd2;color:#fff" href="${detail.classlink}" target="_blank">Join Class </a></center>
             </p>
           </td>
           </tr>
           </table>
           </td>
           </tr>
           <tr style="border-collapse:collapse;">
           <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
            <tr style="border-collapse:collapse;">
            <td align="left">
            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
            Also under mentioned is the Codevidhya Platform username and password. Please refer when your trainer asks to login through www.codevidhya.com<br/>
            <strong>Username : </strong>${detail.username}<br/>
            <strong>Password : </strong>${detail.password}<br/>
            </p>
            </td>
            </tr>
            <tr style="border-collapse:collapse;">
            <td align="left">
            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
            Once this demo session is complete, ${detail.studentname} will be eligible for a certificate from Codevidhya, which you can proudly share with your friends and family
            </p>
            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
            We look forward to your enthusiastic presence.
            </p>
            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
            Please be ready 10 minutes before the class starts. 
            </p>
            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
            For any assistance, feel free to reach out to us.
            </p>
            </td>
            </tr>
           </table>
            </td>
           </tr>
          
           <tr style="border-collapse:collapse;">
           <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
            <tr style="border-collapse:collapse;">
            <td align="left">
            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
            <strong>Regards,</strong><br/>
            <strong>
            Team Codevidhya
            </strong><br/>
            <strong>
            For support, call us at +91 73 5728 6330
            </strong><br/>
            </p>
            </td>
            </tr>
            </table>
           </td>
           </tr>
            <!--footer image-->
           <tr style="border-collapse:collapse;">
           <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
           <tr style="border-collapse:collapse;"> 
           <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
           <tr style="border-collapse:collapse;"> 
           <td align="center" style="padding:0;Margin:0;"><img class="adapt-img" src="https://codevidhya.com/socialshare/congratulation_mail/79221579249313822.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="560"></td> 
           </tr>
           <tr style="border-collapse:collapse;"> 
           <td align="center" style="padding:0;Margin:0;"> 
            <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
              <tr style="border-collapse:collapse;"> 
               <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://www.facebook.com/codevidhya/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Facebook" src="https://codevidhya.com/socialshare/congratulation_mail/facebook-circle-colored.png" alt="Fb" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
               <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://twitter.com/codevidhya?lang=en" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Twitter" src="https://codevidhya.com/socialshare/congratulation_mail/twitter-circle-colored.png" alt="Tw" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
               <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://www.instagram.com/codevidhya/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Instagram" src=https://codevidhya.com/socialshare/congratulation_mail/instagram-circle-colored.PNG" alt="Inst" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
               <td align="center" valign="top" style="padding:0;Margin:0;"><a target="_blank" href="https://www.linkedin.com/company/13221503/admin/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Linkedin" src="https://codevidhya.com/socialshare/congratulation_mail/linkedin-circle-colored.png" alt="In" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
              </tr> 
            </table></td> 
          </tr> 
           </table>
           </td>
           </tr>
           <tr style="border-collapse:collapse;">
           <td align="center">
           <p>
           <strong style="color:#008dd2">Codevidhya India Private Limited</strong><br/>
          <span style="color: #888; font-size:13px;">2nd floor, 96, Officers Campus, Sirsi Road, Vaishali Nagar, Jaipur -302021 (Rajasthan)<br/>
           +91  7357286330  | <a href="mailto:contact@codevidhya.com"><span style="color: #555; font-weight:600;text-decoration:none;"> contact@codevidhya.com </span></a><br/>
           <a style="text-decoration:none;" href="https://codevidhya.com" target="_blank">www.codevidhya.com </a>
           <span></p>
           </td>
           </tr>
           <tr style="border-collapse:collapse;">
           <td align="center">
           
           </td>
           </tr>
           </table>
          </td>
           </tr>
           <!--End footer image-->
           
      </table>
        </div>
        </body>
        </html>`
        };
        return mg.messages().send(data);
      });
    }
    async function sendSessionScheduleMail(...details) {
      await asyncforEach(details, async (detail, index) => {
        const mailgun = require("mailgun-js");
        const DOMAIN = "mail.codevidhya.com";
        const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
        const mg = mailgun({ apiKey: api, domain: DOMAIN });
        const data = {
          from: "Codevidhya <contact@codevidhya.com>",
          to: detail.emailid,
          cc: "Codevidhya <contact@codevidhya.com>",
          subject: `${detail.studentname}'s Coding Class is Confirmed `,
          html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
          <head> 
      <meta charset="UTF-8"> 
      <meta content="width=device-width, initial-scale=1" name="viewport"> 
      <meta name="x-apple-disable-message-reformatting"> 
      <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
      <meta content="telephone=no" name="format-detection"> 
      <title>Email Temp</title> 
      <!--[if (mso 16)]>
        <style type="text/css">
        a {text-decoration: none;}
        </style>
        <![endif]--> 
      <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> 
      <style type="text/css">
    @media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:30px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:20px!important; display:block!important; border-width:10px 0px 10px 0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .adapt-img-small { width:70%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
    #outlook a {
      padding:0;
    }
    .ExternalClass {
      width:100%;
    }
    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
      line-height:100%;
    }
    .es-button {
      mso-style-priority:100!important;
      text-decoration:none!important;
    }
    a[x-apple-data-detectors] {
      color:inherit!important;
      text-decoration:none!important;
      font-size:inherit!important;
      font-family:inherit!important;
      font-weight:inherit!important;
      line-height:inherit!important;
    }
    .es-desk-hidden {
      display:none;
      float:left;
      overflow:hidden;
      width:0;
      max-height:0;
      line-height:0;
      mso-hide:all;
    }
    </style> 
     </head> 
          <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
          <div class="es-wrapper-color" style="background-color:#F6F6F6;"> 
          <!--[if gte mso 9]>
          <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
            <v:fill type="tile" color="#f6f6f6"></v:fill>
          </v:background>
        <![endif]--> 
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;"> 
        <tr style="border-collapse:collapse;"> 
        <td valign="top" style="padding:0;Margin:0;"> 
         <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> 
           <tr style="border-collapse:collapse;"> 
            <td align="center" style="padding:0;Margin:0;"> 
             <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;"> 
               <tr style="border-collapse:collapse;"> 
                <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                 <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                   <tr style="border-collapse:collapse;"> 
                    <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> 
                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                       <tr style="border-collapse:collapse;"> 
                        <td align="center" style="padding:0;Margin:0;"><img class="adapt-img" src="https://codevidhya.com/socialshare/congratulation_mail/EmailSchedule.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="560"></td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
               <tr style="border-collapse:collapse;"> 
               <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
               <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                 <tr style="border-collapse:collapse;"> 
                  <td width="560" align="left" valign="top" style="padding:0;Margin:0;"> 
                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                   
                     <tr style="border-collapse:collapse;"> 
                        <td align="left" class="esd-block-text">
                            <h3 style="font-size: 31px;">Dear ${detail.parentname}</h3>
                        </td>
                    </tr> 
                     <tr style="border-collapse:collapse;"> 
                      <td align="left" style=""><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">Congratulations! ${detail.studentname}'s FREE demo has been scheduled as per the following details:</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p></td> 
                     </tr> 
                     <tr style="border-collapse:collapse;"> 
                      <td align="left" style="padding:0;Margin:0;">
                      <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><strong>Date : </strong> ${detail.sessiondate}<br/><strong>Timing : </strong>${detail.time} Hrs<br/><strong>Module : </strong>${detail.nameofsession} </p></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
               </table></td> 
               </tr>
               <tr style="border-collapse:collapse;">
               <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
               <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
               <tr style="border-collapse:collapse;"> 
               <td align="left">
               <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">Ensure availability of the following for a great learning experience:<br/>
               <ul>
               <li>A laptop or a desktop.</li>
               <li>An active internet connection.</li>
               <li>Headphones or earphones.</li>
               <li>A notepad, pen or pencil.</li>
               <li>Zeal to Learn!</li>
               </ul></p>
               </td>
               </tr>
                
               </table>
               </td>
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
             <tr style="border-collapse:collapse;">
             <td align="left">
             <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
             Kindly find the exclusive link to join ${detail.studentname}'s class below:<br/>
             </p>
             <p style="Margin:10;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
             <center><a style="text-decoration:none;padding:8px 16px; background:#008dd2;color:#fff" href="${detail.classlink}" target="_blank">Join Class </a></center>
             </p>
             </td>
             </tr>
             </table>
             </td>
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
              <tr style="border-collapse:collapse;">
              <td align="left">
              <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
              Once this demo session is complete, ${detail.studentname} will be eligible for a certificate from Codevidhya, which you can proudly share with your friends and family.
              </p>
              </td>
              </tr>
              <tr style="border-collapse:collapse;">
              <td align="left">
              <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
              We request you to be ready 10 minutes before the class starts.<br/>
              <Happy Learning!>
              </p>
              </td>
              </tr>
             </table>
              </td>
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
              <tr style="border-collapse:collapse;">
              <td align="left">
              <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
              Thank You
              </p>
              </td>
              </tr>
              </table>
             </td>
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
              <tr style="border-collapse:collapse;">
              <td align="left">
              <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
              <strong>
              Team Codevidhya
              </strong><br/>
              <strong>
              For support, call us at +91 73 5728 6330
              </strong><br/>
              </p>
              </td>
              </tr>
              </table>
             </td>
             </tr>
              <!--footer image-->
             <tr style="border-collapse:collapse;">
             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
             <tr style="border-collapse:collapse;"> 
             <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
             <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
             <tr style="border-collapse:collapse;"> 
             <td align="center" style="padding:0;Margin:0;"><img class="adapt-img" src="https://codevidhya.com/socialshare/congratulation_mail/79221579249313822.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="560"></td> 
             </tr>
             <tr style="border-collapse:collapse;"> 
             <td align="center" style="padding:0;Margin:0;"> 
              <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                <tr style="border-collapse:collapse;"> 
                 <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://www.facebook.com/codevidhya/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Facebook" src="https://codevidhya.com/socialshare/congratulation_mail/facebook-circle-colored.png" alt="Fb" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                 <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://twitter.com/codevidhya?lang=en" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Twitter" src="https://codevidhya.com/socialshare/congratulation_mail/twitter-circle-colored.png" alt="Tw" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                 <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://www.instagram.com/codevidhya/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Instagram" src=https://codevidhya.com/socialshare/congratulation_mail/instagram-circle-colored.png" alt="Inst" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                 <td align="center" valign="top" style="padding:0;Margin:0;"><a target="_blank" href="https://www.linkedin.com/company/13221503/admin/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Linkedin" src="https://codevidhya.com/socialshare/congratulation_mail/linkedin-circle-colored.png" alt="In" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                </tr> 
              </table></td> 
            </tr> 
             </table>
             </td>
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="center">
             <p>
             <strong style="color:#008dd2">Codevidhya India Private Limited</strong><br/>
            <span style="color: #888; font-size:13px;">2nd floor, 96, Officers Campus, Sirsi Road, Vaishali Nagar, Jaipur -302021 (Rajasthan)<br/>
             +91  7357286330  | <a href="mailto:contact@codevidhya.com"><span style="color: #555; font-weight:600;text-decoration:none;"> contact@codevidhya.com </span></a><br/>
             <a style="text-decoration:none;" href="https://codevidhya.com" target="_blank">www.codevidhya.com </a>
             <span></p>
             </td>
             </tr>
             <tr style="border-collapse:collapse;">
             <td align="center">
             
             </td>
             </tr>
             </table>
            </td>
             </tr>
             <!--End footer image-->
             
        </table>
          </div>
          </body>
          </html>`
        };
        return mg.messages().send(data);
      });
    }
  });*/

  /* var options = {
    url: 'https://docs.google.com/spreadsheets/d/1_hsu8hV99x3ds-rTSIRqx81uAAyg2H-Buwd661OdpPg/edit?usp=sharing'
};
request(options, callback)*/
}
function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    //console.log(body);

    console.log(body);
  } else {
    console.log(error);
  }
}
setInterval(UserTrack.TrackingIdealUser, 635000);
//setInterval(UserTrack.TrackingIdealUser,605000);
//UserTrack.TrackingIdealUser();
//check every 10 =1000*60*10 minutes
function dologInChores(user_id, ip) {
  UserTrack.loginCheckFunction(user_id, ip).then(() => {
    UserTrack.trackingloginUpdate(user_id, ip);
  });
}
function doLogoutChores(user_id, ip) {
  UserTrack.loginCheckFunction(user_id, ip).then(() => {
    UserTrack.trackinglogoutUpdate(user_id, ip);
  });
}

router.post("/logout", async (req, res) => {
  /*********userTracking logout */
  /*user checkTracking function tracking*/
  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  if (req.session.user_id) doLogoutChores(req.session.user_id, ip);

  /*********end userTracking logout */
  req.session.admin_id = null;
  req.session.user_id = null;
  req.session.dir_path = null;
  res.end();
});

function registerIndependentUser(info) {
  return new Promise(async (resolve, reject) => {
    var result = await dbUtils.runSqlQueryAsyncSelect(
      "SELECT path from cv_users where sch_id=1 and role_id=1",
      []
    );
    var schoolPath = result.result[0].path;
    // console.log(schoolPath);
    var result1 = await dbUtils.runSqlQueryAsyncSelect(
      "SELECT username FROM `cv_users` where username=?",
      [info.email]
    );
    if (result1.result.length) {
      reject("already_exists");
    } else {
      var userPath = schoolPath + "/" + info.dirname;
      var result2 = await dbUtils.runSqlQueryAsyncInsert(
        "insert into cv_users (sch_id,role_id,name,email,contact,username,password,path,status) values(?,?,?,?,?,?,?,?,?)",
        [
          1,
          3,
          info.name,
          info.email,
          info.contact,
          info.username,
          info.password,
          userPath,
          1,
        ]
      );

      //console.log("error");
      //console.log(result2.err);
      if (result2.err) {
        reject("insert_failed");
      } else {
        var result3 = await dbUtils.runSqlQueryAsyncInsert(
          "insert into cv_st_detail (user_id,sch_id,cls_id,sec_id) values(?,?,?,?)",
          [result2.insertId, 1, 0, 0]
        );

        createStudentCodeplayDirectory(schoolPath, info.dirname);
        resolve({ userId: result2.insertId, path: userPath });
      }
    }
  });
}

function createStudentCodeplayDirectory(schooldir, username) {
  if (!schooldir || !username) return false;
  var dir = pathUtils.convertToSystemSlash(
    pathUtils.appRoot + "/Codeplay/" + schooldir + "/" + username
  );
  if (!fs.existsSync(dir)) {
    mkdirp.sync(dir);
    return true;
  } else {
    return false;
  }
}

router.post("/learnAtHomeRegisterUser", (req, res) => {
  var params = req.body;
  let query = "select path from cv_users where sch_id=38 and role_id=1";
  let param, schoolPath, userPath;
  return dbUtils
    .runSqlQueryAsyncSelect(query, [])
    .then((result) => {
      if (result.err) throw result.err;
      else {
        //console.log(result);
        schoolPath = result.result[0].path;
        query = "SELECT username FROM `cv_users` where username=? and email=?";
        param = [params.username, params.email];
        return dbUtils.runSqlQueryAsyncSelect(query, param).then((data) => {
          if (data.err) throw err;
          else {
            if (data.result.length) {
              return res.send("already_exists");
            } else {
              userPath = schoolPath + "/" + params.username;
              return dbUtils
                .runSqlQueryAsyncInsert(
                  "insert into cv_users (sch_id,role_id,name,sex,email,contact,username,password,path,status,city,state,country) values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
                  [
                    38,
                    3,
                    params.name,
                    params.gender,
                    params.email,
                    params.contact,
                    params.username,
                    params.password,
                    userPath,
                    1,
                    params.city,
                    params.state,
                    params.country,
                  ]
                )
                .then((insertdata) => {
                  if (insertdata.err) throw insertdata.err;
                  else {
                    //console.log(insertdata);
                    let user_id = insertdata.insertId;
                    (query =
                      "insert into cv_st_detail(user_id,sch_id,cls_id,sec_id,institute_name) values(?,?,(SELECT cv_classes.cls_id FROM `cv_classes` WHERE cv_classes.cls_name=?),?,?)"),
                      (param = [
                        insertdata.insertId,
                        38,
                        params.grade,
                        0,
                        params.institute_name,
                      ]);
                    return dbUtils
                      .runSqlQueryAsyncInsert(query, param)
                      .then(async (dataInfo) => {
                        if (dataInfo.err) throw dataInfo.err;
                        else {
                          await createStudentCodeplayDirectory(
                            schoolPath,
                            params.username
                          );
                          req.session.user_id = user_id;
                          req.session.dir_path = userPath;
                          return res.end();
                        }
                      });
                  }
                });
            }
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/registerUser", (req, res) => {
  var params = req.body;
  registerIndependentUser({
    email: params.email,
    name: params.name,
    contact: params.contact,
    username: params.username,
    dirname: params.username,
    password: params.password,
  })
    .then((userData) => {
      req.session.user_id = userData.userId;
      req.session.dir_path = userData.userPath;
      res.end();
    })
    .catch((err) => {
      console.log(err);
      if (err == "already_exists") {
        res.status(400).send(err);
      } else {
        res.status(400).end();
      }
    });
});

router.post("/sendPasswordResetEmail", (req, res) => {
  return dbUtils
    .runSqlQueryAsyncSelect("select email from cv_users where email=?", [
      req.body.email,
    ])
    .then((result) => {
      if (result.err) {
      } else {
        return jwt.sign(
          { email: req.body.email, something: 12498, else: "heehaw" },
          "zmnduoi320984#*(^$(",
          { expiresIn: "10m" }
        );
      }
    })
    .then((token) => {
      const mailgun = require("mailgun-js");
      const DOMAIN = "mail.codevidhya.com";
      const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
      const mg = mailgun({ apiKey: api, domain: DOMAIN });
      const data = {
        from: "Codevidhya <contact@codevidhya.com>",
        to: req.body.email,
        subject: "Codevidhya | Reset password",
        html: `<html>
      <body><p>To reset your password, please click on the following link.<br> 
      <a href="https://codevidhya.com/reset-password?token=${token}">Reset password</a></p>
      <p>This link will expire in 10 minutes.</p>

      <p>If you have any questions or concerns, you can connect with at <a href="https://codevidhya.com/contact">https://codevidhya.com/contact</a>.</p>
      <p>Regards,<br>Team Codevidhya</p>
      </body></html>`,
      };

      return mg.messages().send(data);
    })
    .then(() => {
      res.end();
    })
    .catch((err) => {
      console.log(err);
      res.status(400).end();
    });
});

function verifyPasswordResetToken(token) {
  return new Promise(function(resolve, reject) {
    jwt.verify(token, "zmnduoi320984#*(^$(", (err, data) => {
      if (!err && data) {
        resolve(data);
      } else {
        reject("invalid_token");
      }
    });
  });
}

router.post("/requestForPreviousLiveClass", (req, res) => {
  let params = req.body;
  let query =
    "SELECT * FROM `live_class_request` WHERE name=? and live_class_request.email=? and live_class_request.contact=? and live_class_request.kids_name=?";
  let param = [params.name, params.email, params.contact, params.kidsName];
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else if (dataResult.result.length) return "";
      else {
        return dbUtils.runSqlQueryAsyncInsert(
          "INSERT INTO `live_class_request`(`name`, `email`, `contact`,`kids_name`) VALUES (?,?,?,?)",
          [params.name, params.email, params.contact, params.kidsName]
        );
      }
    })
    .then(async (result) => {
      if (result) {
        if (result.err) throw result.err;
        else {
          await sentRequestDemoMail(params);
          return res.send(result);
        }
      } else {
        res.send(result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/requestForScheduleLiveClass", (req, res) => {
  let params = req.body;

  let query =
    "SELECT * FROM `live_class_request` WHERE name=? and live_class_request.email=? and live_class_request.contact=? and live_class_request.kids_name=?";
  let param = [params.name, params.email, params.contact, params.kidsName];
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else if (dataResult.result.length) return "";
      else {
        return dbUtils.runSqlQueryAsyncInsert(
          "INSERT INTO `live_class_request`(`name`, `email`, `contact`,`kids_name`,`expected_schedule_date`,`expected_schedule_time`,`sales_person_id`) VALUES (?,?,?,?,?,?,?)",
          [
            params.name,
            params.email,
            params.contact,
            params.kidsName,
            params.schedueDate,
            params.scheduleTime,
            params.sales_person_id,
          ]
        );
      }
    })
    .then(async (result) => {
      if (result) {
        if (result.err) throw result.err;
        else {
          query =
            "SELECT cv_users.name,cv_users.email,cv_users.email FROM `cv_users` WHERE user_id=?";
          param = [params.sales_person_id];
          return await dbUtils.runSqlQueryAsyncSelect(query, param);
          //await sentRequestDemoMail(params);
          //  await sendSMS(params);
        }
      } else {
        return "";
      }
    })
    .then(async (SalesResult) => {
      if (SalesResult) {
        if (SalesResult.err) throw SalesResult.err;
        else {
          await sentRequestDemoMailModified(
            SalesResult.result[0].name,
            SalesResult.result[0].email,
            params
          );
          return res.send(SalesResult);
        }
      } else {
        return res.send(SalesResult);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/requestForLiveClass", (req, res) => {
  let params = req.body;
  let query =
    "SELECT * FROM `live_class_request` WHERE name=? and live_class_request.email=? and live_class_request.contact=? and live_class_request.kids_name=?";
  let param = [params.name, params.email, params.contact, params.kidsName];
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else if (dataResult.result.length) return "";
      else {
        return dbUtils.runSqlQueryAsyncInsert(
          "INSERT INTO `live_class_request`(`name`, `email`, `contact`,`kids_name`) VALUES (?,?,?,?)",
          [params.name, params.email, params.contact, params.kidsName]
        );
      }
    })
    .then(async (result) => {
      if (result) {
        if (result.err) throw result.err;
        else {
          await sentRequestDemoMail(params);
          //  await sendSMS(params);
          return res.send(result);
        }
      } else {
        return res.send(result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
async function sendSMS(param) {
  /*const smsClient = require("./textLocalApi.js"); //Modify the path based on your app
const user = {name: "Ranjith", phone: "8290908900"};
smsClient.sendPartnerWelcomeMessage(user);*/

  const axios = require("axios");
  message = `This Template For Test ${param.name}`;
  let contact = "918290908900"; //"91" + param.contact;
  // console.log(contact);
  url = `https://api.textlocal.in/send/?apikey=JDA6Ts2/cNM-lYbBIMfebb30NCtWxpaST3CvrajE9f&sender=CODVDY&numbers=918290908900&message=${message}`;
  console.log(url);
  axios.get(url).then((result) => {
    //  console.log(result.data);
  });

  /****End textlocal api */
}

async function sentRequestDemoMailModified(sales_name, sales_email, param) {
  const mailgun = require("mailgun-js");
  var dateFormat = require("dateformat");

  const DOMAIN = "mail.codevidhya.com";
  const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
  const msg = mailgun({ apiKey: api, domain: DOMAIN });
  const data = {
    from: "Codevidhya <contact@codevidhya.com>",
    to: sales_email,
    cc: "cvlivebookings@codevidhya.com",
    subject: `DEMO Session follow up (${dateFormat(
      new Date(),
      "ddmmyyyy"
    )}) is added to your queue`,
    html: `<html>
    <body>
    <p><b><h3>Hi ${sales_name}</h3></b></p>
    <p><b> ${param.kidsName} </b> has sent you a request for live DEMO class</p>
    <p>Please contact them using following details to book a slot:</p>
     <p><b>Parent's Name: </b> ${param.name}</p>
     <p><b>Parent's Email ID: </b> ${param.email}</p>
     <p><b>Parent's Mobile Number: </b> ${param.contact}</p>
     <p><b>Kid's Name: </b> ${param.kidsName}</p>
     <p><b>Preferred Demo Date:</b> ${param.schedueDate}</p>
     <p><b>Preferred Demo Time:</b> ${param.scheduleTime}</p>
    </body>
    `,
  };
  return msg.messages().send(data);
}

async function sentRequestDemoMail(param) {
  const mailgun = require("mailgun-js");
  var dateFormat = require("dateformat");

  const DOMAIN = "mail.codevidhya.com";
  const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
  const msg = mailgun({ apiKey: api, domain: DOMAIN });
  const data = {
    from: "Codevidhya <contact@codevidhya.com>",
    to: "cvlivebookings@codevidhya.com", //"sharadbhatara@gmail.com",//
    subject: `Request for trial class-${dateFormat(new Date(), "ddmmyyyy")}`,
    html: `<html>
    <body>
    <p><b> ${param.kidsName} </b> sent you request for live trail class</p>
    <p>Please contact him using following detail</p>
     <p><b>Parent's Name: </b> ${param.name}</p>
     <p><b>Parent's Email ID: </b> ${param.email}</p>
     <p><b>Parent's Mobile Number: </b> ${param.contact}</p>
     <p><b>Kids Name: </b> ${param.kidsName}</p>
    </body>
    `,
  };
  return msg.messages().send(data);
}
router.post("/resetPassword", (req, res) => {
  var token = req.body.token;
  var password = req.body.password;
  var email;
  return verifyPasswordResetToken(token)
    .then((result) => {
      email = result.email;
      return dbUtils.runSqlQueryAsyncSelect(
        "select email from cv_users where email=?",
        [result.email]
      );
    })
    .then((result) => {
      if (result.err && !result.length) {
        throw new Error("failed");
      } else {
        return dbUtils.runSqlQueryAsyncUpdate(
          "update cv_users set password=? where email=?",
          [password, email]
        );
      }
    })
    .then(() => {
      res.end();
    })
    .catch((err) => {
      if (typeof err == "string") res.status(400).send(err);
      else res.status(400).end();
    });
});
module.exports.salesFollowupMail = sentRequestDemoMail;
module.exports = router;
