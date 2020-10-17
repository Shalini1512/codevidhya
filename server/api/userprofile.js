var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();
var request = require("request-promise-native");
var multer = require("multer");

var fs = require("fs-extra");
var rimraf = require("rimraf");
var mkdirp = require("mkdirp");
var csvtojson = require("csvtojson");
var childProcess = require("child_process");
const archiver = require("archiver");
const path = require("path");
var pathUtils = require("./path-utils");
var url = require("url");
const { OAuth2Client } = require("google-auth-library");
const GOOGLE_CLIENT_ID =
  "764117490764-cki4kqk4nth9d76750lbqp4uv23igb83.apps.googleusercontent.com";
const appRoot = path.resolve(path.join(__dirname, "../../"));
const pathSeparator = appRoot.indexOf("\\") >= 0 ? "\\" : "/";
var moment = require("moment");
var dbUtils = require("./database-utils");
var ProfilePicStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.resolve(appRoot + "/dynamic/profiles/"));
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

var profileUpload = multer({ storage: ProfilePicStorage });

var pool = require("../db").pool;

var jsonWrite = function(res, ret) {
  if (typeof ret === "undefined") {
    res.json({
      msg: "Invalid."
    });
  } else {
    res.json(ret);
  }
};
function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
function runSqlQueryAsyncSelect(query, params) {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, result) => {
      resolve({ err: err, result: result });
    });
  });
}

function runSqlQueryAsyncInsert(query, params) {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, result) => {
      resolve({
        err: err,
        result: result,
        insertId: result ? result.insertId : null
      });
    });
  });
}

function runSqlQueryAsyncUpdate(query, params) {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, result) => {
      resolve({ err: err, result: result });
    });
  });
}

async function runSqlQueryAsync(query, params) {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, result) => {
      if (err) {
        reject("query_failed");
      } else {
        resolve(result);
      }
    });
  });
}
router.post("/getAllSections", (req, res) => {
  pool.query("SELECT * FROM cv_sections", (err, result) => {
    res.send(result);
  });
});
router.post("/getAllClass", (req, res) => {
  pool.query("SELECT * FROM cv_classes", (err, result) => {
    res.send(result);
  });
});
router.post("/get_departments", (req, res) => {
  pool.query("select * from department", (err, data) => {
    res.send(data);
  });
});
router.post("/getUserInformation", (req, res) => {
  var params = req.body;
  console.log(params)
  let query =
    params.role_id == "3" || params.role_id == 3
      ? "SELECT cv_users.user_id,cv_users.sch_id,cv_users.role_id,cv_users.contact,cv_users.username,cv_users.password,cv_users.email,cv_users.email_verification,cv_users.name,cv_users.dob,cv_users.state,cv_users.city,cv_users.address,cv_users.pin_code,(case when cv_users.board then cv_users.board else (SELECT cv.board from cv_users cv where cv.sch_id =cv_users.sch_id and cv.role_id=1) end) 'board',cv_users.username,cv_users.profile_pic,cv_users.age,cv_users.coin_earned,cv_users.dept_id,cv_users.country,cv_users.sex,cv_users.emergency_contact_no,cv_st_detail.cls_id,cv_classes.cls_name 'grade',cv_st_detail.sec_id,cv_sections.sec_name,cv_st_detail.other_grade,cv_st_parent_detail.father_name,cv_st_parent_detail.father_email_id,cv_st_parent_detail.fcontact_no,cv_st_parent_detail.f_employer_name,cv_st_parent_detail.f_designation,cv_st_parent_detail.mother_name,cv_st_parent_detail.mother_email_id,cv_st_parent_detail.mcontact_no,cv_st_parent_detail.m_employer_name,cv_st_parent_detail.m_designation,cv_st_parent_detail.f_address,cv_st_parent_detail.m_address,cv_st_parent_detail.g_name,cv_st_parent_detail.g_email_id,cv_st_parent_detail.g_email_verification,cv_st_parent_detail.gcontact_no,cv_st_parent_detail.g_employer_name,cv_st_parent_detail.g_designation,cv_st_parent_detail.gaddress,cv_st_parent_detail.p_role_id,cv_st_parent_detail.father_email_verification,cv_st_parent_detail.father_email_verification,cv_st_parent_detail.mother_email_verification,(case when cv_users.sch_id!=1 then cv_school_detail.name else cv_st_detail.institute_name end) 'sch_name',cv_programs.name 'p_name',cv_programs.cv_pid,cv_offerings.* from cv_users left join cv_st_detail on (cv_users.user_id = cv_st_detail.user_id) inner join cv_classes on (cv_classes.cls_id =cv_st_detail.cls_id) left join cv_sections on (cv_st_detail.sec_id = cv_sections.sec_id) left join cv_st_parent_detail on (find_in_set(cv_users.user_id,cv_st_parent_detail.user_id)) inner join cv_school_detail on (cv_school_detail.sch_id = cv_users.sch_id) inner join cv_programs on (cv_programs.cv_pid = cv_school_detail.cv_pid) inner join cv_offerings on (cv_offerings.cv_pid =cv_programs.cv_pid) where cv_users.user_id=?"
      : "SELECT cv_users.user_id,cv_users.sch_id,cv_users.role_id,cv_users.name,cv_users.sex,cv_users.dept_id,cv_users.dob,cv_users.contact,cv_users.email,cv_users.country,cv_users.state,cv_users.city,cv_users.address,cv_users.pin_code,(case when cv_users.board then cv_users.board else (SELECT cv.board from cv_users cv where cv.sch_id =cv_users.sch_id and cv.role_id=1) end) 'board',cv_users.username,cv_users.password,cv_users.profile_pic  ,department.dept_name,cv_school_detail.name 'sch_name',cv_school_detail.cv_pid,cv_programs.name 'program_name' from cv_users left join department on (department.dept_id = cv_users.dept_id) inner join cv_school_detail on (cv_school_detail.sch_id = cv_users.sch_id) inner join cv_programs on (cv_programs.cv_pid = cv_school_detail.cv_pid)  where cv_users.user_id =?";
  return runSqlQueryAsyncSelect(query, [params.user_id])
    .then(result => {
      //console.log(result);
      res.send(result.result);
    })
    .catch(err => {
      res.status(400).end();
    });
});
router.post("/getTeacherGrades", (req, res) => {
  var params = req.body;
  let query =
    "SELECT cv_grade_assigned.grades FROM `cv_grade_assigned` WHERE cv_grade_assigned.user_id=?";
  return runSqlQueryAsyncSelect(query, [params.user_id])
    .then(result => {
      res.send(result.result);
    })
    .catch(err => {
      res.status(400).end();
    });
});
router.post("/getSchoolGrades", (req, res) => {
  var params = req.body;
  let query =
    "SELECT cv_classes.* FROM `cv_school_classes` inner join cv_classes on (cv_classes.cls_id =cv_school_classes.cls_id) inner join cv_users on (cv_users.sch_id =cv_school_classes.sch_id and cv_users.user_id=?) order by cv_school_classes.cls_id";
  return runSqlQueryAsyncSelect(query, [params.user_id])
    .then(result => {
      res.send(result.result);
    })
    .catch(err => {
      res.status(400).end();
    });
});
router.post("/updateStudentPasswordProfileDetail", (req, res, next) => {
  var params = req.body;

  return runSqlQueryAsyncUpdate(
    "UPDATE `cv_users` SET  `password`=? WHERE user_id=? and sch_id=?",
    [params.password, params.user_id, params.sch_id]
  ).then(result => {
    if (result.err) throw result.err;
    else res.send(result.result);
  });
});
/***email varification */
router.post("/postEmailVerification", async (req, res) => {
  //postEmailVerification
  let token = jwt.sign(
    {
      email: req.body.email,
      user_id: req.body.user_id,
      relation: req.body.relation,
      something: 12498,
      else: "heehaw"
    },
    "zmnduoi320984#*(^$(",
    { expiresIn: "10m" }
  );
  await emailVerifucationMessage(token, req.body.email);
  res.end();
});
/****End email verification */

/***Email Verification function */

emailVerifucationMessage = async (token, email) => {
  const mailgun = require("mailgun-js");
  const DOMAIN = "mail.codevidhya.com";
  const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
  const mg = mailgun({ apiKey: api, domain: DOMAIN });
  const data = {
    from: "Codevidhya <contact@codevidhya.com>",
    to: email,
    subject: "Codevidhya | Email Verification",
    html: `<html>
        <body>
        <p>To verify email,please click on the following link.<br/>
        <a href="https://codevidhya.com/active-mail?token=${token}">Email Verification</a>
        </p>
        <p>This link will expire in 10 minutes.</p>

      <p>If you have any questions or concerns, you can connect with at <a href="https://codevidhya.com/contact">https://codevidhya.com/contact</a>.</p>
      <p>Regards,<br>Team Codevidhya</p>
        </body>
        </html>`
  };
  return mg.messages().send(data);
};
/****End Email verification function */
/***email verify with token */
router.post("/verifyToken", (req, res) => {
  var params = req.body,
    query,
    param,
    dataObject;
  let cuserId = req.body.user_id;
  let verifyTokenObj = "";
  return verifyToken(params.token)
    .then(verifyToken => {
      verifyTokenObj = verifyToken;
      if (verifyToken != "invalid_token") {
        if (
          verifyTokenObj.user_id == cuserId &&
          verifyTokenObj.relation == "self"
        ) {
          let query =
            "UPDATE `cv_users` SET  `email`=?, `email_verification`=? where cv_users.user_id=?";
          let param = [verifyTokenObj.email, 1, verifyTokenObj.user_id];
          return dbUtils
            .runSqlQueryAsyncUpdate(query, param)
            .then(async data => {
              if (data.err) throw data.err;
              else {
                await Alluserverfication(verifyTokenObj.email);
                await Parentveridication(verifyTokenObj);
                res.send(verifyTokenObj);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else if (verifyToken.user_id == cuserId) {
          query =
            "SELECT * FROM `cv_st_parent_detail` WHERE find_in_set(?,user_id)";
          param = [verifyToken.user_id];
          return dbUtils
            .runSqlQueryAsyncSelect(query, param)
            .then(async resultData => {
             // console.log(resultData);
              if (resultData.err) throw resultData.err;
              else {
                if (resultData.result.length) {
               //   console.log("data exist in parent table");
                  switch (verifyTokenObj.relation) {
                    case "Father":
                      if (
                        verifyTokenObj.email ==
                        resultData.result[0].father_email_id
                      ) {
                        query =
                          "UPDATE `cv_st_parent_detail` SET `father_email_id`=?,`father_email_verification`=? where find_in_set(?,user_id)";
                        param = [
                          verifyTokenObj.email,
                          1,
                          verifyTokenObj.user_id
                        ];
                      } else {
                        query =
                          "UPDATE `cv_st_parent_detail` SET `father_email_id`=?,`father_email_verification`=? where find_in_set(?,user_id)";
                        param = [
                          verifyTokenObj.email,
                          1,
                          verifyTokenObj.user_id
                        ];
                        deleteParentRecord(
                          "Father",
                          verifyTokenObj.email,
                          verifyTokenObj.user_id
                        );
                      }
                      break;
                    case "Mother":
                      if (
                        verifyTokenObj.email ==
                        resultData.result[0].mother_email_id
                      ) {
                        query =
                          "UPDATE `cv_st_parent_detail` SET `mother_email_id`=?,`mother_email_verification`=? where find_in_set(?,user_id)";
                        param = [
                          verifyTokenObj.email,
                          1,
                          verifyTokenObj.user_id
                        ];
                      } else {
                        query =
                          "UPDATE `cv_st_parent_detail` SET `mother_email_id`=?,`mother_email_verification`=? where find_in_set(?,user_id)";
                        param = [
                          verifyTokenObj.email,
                          1,
                          verifyTokenObj.user_id
                        ];
                        deleteParentRecord(
                          "Mother",
                          verifyTokenObj.email,
                          verifyTokenObj.user_id
                        );
                      }
                      break;
                    case "Guardian":
                      if (
                        verifyTokenObj.email == resultData.result[0].g_email_id
                      ) {
                        query =
                          "UPDATE `cv_st_parent_detail` SET `g_email_id`=?,`g_email_verification`=? where find_in_set(?,user_id)";
                        param = [
                          verifyTokenObj.email,
                          1,
                          verifyTokenObj.user_id
                        ];
                      } else {
                        query =
                          "UPDATE `cv_st_parent_detail` SET `g_email_id`=?,`g_email_verification`=? where find_in_set(?,user_id)";
                        param = [
                          verifyTokenObj.email,
                          1,
                          verifyTokenObj.user_id
                        ];
                        deleteParentRecord(
                          "Guardian",
                          verifyTokenObj.email,
                          verifyTokenObj.user_id
                        );
                      }
                      break;
                  }
                  //console.log(query);
                 // console.log(param);
                  return await dbUtils.runSqlQueryAsyncUpdate(query, param);
                } else {
                  switch (verifyTokenObj.relation) {
                    case "Father":
                      query =
                        "select cv_st_parent_detail.cv_st_p_id,cv_st_parent_detail.user_id from cv_st_parent_detail where father_email_id=?";
                      break;
                    case "Mother":
                      query =
                        "select cv_st_parent_detail.cv_st_p_id,cv_st_parent_detail.user_id from cv_st_parent_detail where mother_email_id=?";
                      break;
                    case "Guardian":
                      query =
                        "select cv_st_parent_detail.cv_st_p_id,cv_st_parent_detail.user_id from cv_st_parent_detail where g_email_id=?";
                      break;
                  }
                  param = [verifyTokenObj.email];
                  return await dbUtils.runSqlQueryAsyncSelect(query, param);
                }
              }
            })
            .then(async resultParent => {
            //  console.log("affected or selected");
            //  console.log(resultParent);
           //   console.log(typeof resultParent.result.length !== "undefined");
              if (resultParent.err) throw resultParent.err;
              else {
                if (
                  typeof resultParent.result.length !== "undefined" &&
                  resultParent.result.cv_st_p_id
                ) {
                //  console.log("update existing parent user_id");
                  let userIds = await (resultParent.result[0].user_id +
                    "," +
                    verifyTokenObj.user_id);

                  switch (verifyTokenObj.relation) {
                    case "Father":
                      query =
                        "UPDATE `cv_st_parent_detail` SET `user_id`=?,father_email_id=?,father_email_verification=? where cv_st_parent_detail.cv_st_p_id=?";
                      break;
                    case "Mother":
                      query =
                        "UPDATE `cv_st_parent_detail` SET `user_id`=?,mother_email_id=?,mother_email_verification=? where cv_st_parent_detail.cv_st_p_id=?";
                      break;
                    case "Guardian":
                      query =
                        "UPDATE `cv_st_parent_detail` SET `user_id`=?,g_email_id=?,g_email_verification=? where cv_st_parent_detail.cv_st_p_id=?";
                      break;
                  }
                  param = [
                    await userIds,
                    verifyTokenObj.email,
                    1,
                    await resultParent.result[0].cv_st_p_id
                  ];
                  return await dbUtils.runSqlQueryAsyncUpdate(query, param);
                }

                // }
                else if (
                  typeof resultParent.result.length !== "undefined" &&
                  sresultParent.result.affectedRows
                ) {
               //   console.log("No action");
                  return resultParent;
                } else {
              //    console.log("New record");
                  switch (verifyTokenObj.relation) {
                    case "Father":
                      query =
                        "INSERT INTO `cv_st_parent_detail`( `user_id`, `father_email_id`, `father_email_verification`) VALUES (?,?,?)";
                      param = [verifyTokenObj.user_id, verifyTokenObj.email, 1];
                      break;
                    case "Mother":
                      query =
                        "INSERT INTO `cv_st_parent_detail`( `user_id`, `mother_email_id`, `mother_email_verification`) VALUES (?,?,?)";
                      param = [verifyTokenObj.user_id, verifyTokenObj.email, 1];
                      break;
                    case "Guardian":
                      query =
                        "INSERT INTO `cv_st_parent_detail`( `user_id`, `g_email_id`, `g_email_verification`) VALUES (?,?,?)";
                      param = [verifyTokenObj.user_id, verifyTokenObj.email, 1];
                      break;
                  }
                  return await dbUtils.runSqlQueryAsyncInsert(query, param);
                }
              }
            })
            .then(updateResult => {
            //  console.log("updated null or inserted parent record");
            //  console.log(updateResult);
              if (updateResult.err) throw updateResult.err;
              else {
                query =
                  "SELECT * FROM `cv_st_parent_detail` WHERE find_in_set(?,user_id)";
                param = [verifyTokenObj.user_id];
                return dbUtils.runSqlQueryAsyncSelect(query, param);
              }
            })
            .then(dataRecord => {
              if (dataRecord.err) throw dataRecord.err;
              else {
                dataObject = dataRecord.result;
                query =
                  "SELECT  cv_users.user_id  FROM `cv_users` WHERE cv_users.email=? and cv_users.role_id=4";
                param = [verifyTokenObj.email];
                return dbUtils.runSqlQueryAsyncSelect(query, param);
              }
            })
            .then(async parentRec => {
             // console.log("find parent data in cv users");
             // console.log(parentRec);
              if (parentRec.err) throw parentRec.err;
              else if (parentRec.result.length) {
                query =
                  "UPDATE `cv_users` SET `email_verification` = ? WHERE cv_users.user_id=?";
                param = [1, parentRec.result[0].user_id];
                return await dbUtils.runSqlQueryAsyncUpdate(query, param);
              } else {
                let gender = "",
                  pname = "",
                  pcontact = "";
                switch (verifyTokenObj.relation) {
                  case "Father":
                    gender = "Male";
                    pname = dataObject[0].father_name;
                    pcontact = dataObject[0].fcontact_no;
                    break;
                  case "Mother":
                    gender = "Female";
                    pname = dataObject[0].mother_name;
                    pcontact = dataObject[0].mcontact_no;
                    break;
                  default:
                    gender = "";
                    pname = dataObject[0].g_name;
                    pcontact = dataObject[0].gcontact_no;
                }
                username = verifyToken.email.substring(
                  0,
                  verifyToken.email.lastIndexOf("@")
                );
                let parentfolder = await createfolder("parents");
                username = username.replace(/\s/, "").toLowerCase();
                username = await checkUser(username);
                let new_path = "parents/" + username;
                let path = await createfolder(new_path);
                let password = await genpassword();

                query =
                  "INSERT INTO `cv_users`(`sch_id`, `role_id`, `name`, `sex`, `contact`, `email`, `email_verification`,username,password, path, `status`, `cv_st_p_id`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
                param = [
                  "1",
                  "4",
                  pname,
                  gender,
                  pcontact,
                  verifyToken.email,
                  1,
                  username,
                  password,
                  path,
                  1,
                  dataObject[0].cv_st_p_id
                ];
                return await dbUtils.runSqlQueryAsyncInsert(query, param);
              }
            })
            .then(pdetail => {
             // console.log("updated or inserted parent record in user table");
            //  console.log(pdetail);
              if (pdetail.err) throw pdetail.err;
              else {
                Alluserverfication(verifyTokenObj.email);
                res.send(verifyToken);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    })
    .catch(err => {
      console.log(err);
      return res.json(err);
    });
});
/****parent table update */
Parentveridication = async verifyTokenObj => {
  let query =
    "SELECT * FROM `cv_st_parent_detail` WHERE find_in_set(?,user_id)";
  param = [verifyTokenObj.user_id];
  return await dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then(async result => {
      if (result.err) throw result.err;
      else {
        if (result.result.length) {
          if (result.result.father_email_id == verifyTokenObj.email) {
            query =
              "UPDATE `cv_st_parent_detail` SET `father_email_verification`=? where cv_st_parent_detail.cv_st_p_id=?";
          } else if (result.result.mother_email_id == verifyTokenObj.email)
            query =
              "UPDATE `cv_st_parent_detail` SET `father_email_verification`=? where cv_st_parent_detail.cv_st_p_id=?";
          else if (result.result.g_email_id == verifyTokenObj.email) {
            query =
              "UPDATE `cv_st_parent_detail` SET `g_email_verification`=? where cv_st_parent_detail.cv_st_p_id=?";
          }

          param = [1, result.result[0].cv_st_p_id];
         // console.log(query);
        //  console.log(param);
          return await dbUtils.runSqlQueryAsyncUpdate(query, param);
        } else {
          return "";
        }
      }
    })
    .then(finalRes => {
      return finalRes;
    })
    .catch(err => {
      console.log(err);
    });
};
/***all user simailar data verification */
Alluserverfication = email => {
  let query = "UPDATE `cv_users` SET `email_verification`=1 where email=?";
  return dbUtils
    .runSqlQueryAsyncUpdate(query, [email])
    .then(UpdateRes => {
      if (UpdateRes.err) throw UpdateRes.err;
      else {
        return UpdateRes;
      }
    })
    .catch(err => {
      console.log(err);
    });
};
/*****end all users data verification  */
/****Delete Unused parent user_id */
function deleteParentRecord(relation, email, user_id) {
  //console.log("deleted parent record");
  let query =
    "DELETE FROM `cv_users` WHERE cv_users.email =? and cv_users.role_id=?";
  return dbUtils.runSqlQueryAsyncUpdate(query, [email, 4]).then(delresult => {
    if (delresult.err) throw delresult.err;
    else return delresult;
  });
}
/****End delete unused parent user_id */

/********Password Generation */
genpassword = function() {
  var text = "";
  var possible = "abcdefghjkmnpqrstuvwxyz23456789@#$^*";
  for (var i = 0; i <= 5; i++) {
    text = text + possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
/*********End Password Generation */
/****Create Folder */
function createfolder() {
  dir = appRoot + "/Codeplay/" + arguments[0];
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  return arguments[0];
}
/****End Folder */

/****Create username */
async function checkUser(username) {
  return await dbUtils
    .runSqlQueryAsyncSelect("SELECT username FROM cv_users  WHERE username=?", [
      username
    ])
    .then(async res => {
      if (res.err) throw res.err;
      else if (res.result.length) {
        username += Math.floor(Math.random() * username.length);
        return await checkUser(username);
      } else return username;
    })
    .catch(err => {
      console.log(err);
    });
}
/****End username */
/****verify token function */
verifyToken = async token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, "zmnduoi320984#*(^$(", (err, data) => {
      if (!err && data) {
        resolve(data);
      } else {
        reject("invalid_token");
      }
    });
  });
};
/****End verify token functiuon */
/*****End verify token */
router.post("/updateUserProfileInfo", (req, res, next) => {
  var params = req.body;

  return runSqlQueryAsyncUpdate(
    params.editProfile[0].role_id == 3
      ? "update cv_users SET name=?, parent_name=?, email=?, contact=?, dob=?, state=?, city=?, address=?, password=? where sch_id=? and user_id=?"
      : "update cv_users SET name=?, email=?, contact=?, state=?, city=?, address=?, password=? where sch_id=? and user_id=?",
    params.editProfile[0].role_id == 3
      ? [
          params.editProfile[0].name,
          params.editProfile[0].parent_name,
          params.editProfile[0].email,
          params.editProfile[0].contact,
          params.editProfile[0].dob,
          params.editProfile[0].state,
          params.editProfile[0].city,
          params.editProfile[0].address,
          params.editProfile[0].password,
          params.editProfile[0].sch_id,
          params.editProfile[0].user_id
        ]
      : [
          params.editProfile[0].name,
          params.editProfile[0].email,
          params.editProfile[0].contact,
          params.editProfile[0].state,
          params.editProfile[0].city,
          params.editProfile[0].address,
          params.editProfile[0].password,
          params.editProfile[0].sch_id,
          params.editProfile[0].user_id
        ]
  )
    .then(result => {
      if (result.err) {
        throw result.err;
      } else {
        res.json({
          data: "done"
        });
      }
    })
    .catch(err => {
      res.status(400).end();
    });
});
router.post("/updateTeacherBasicProfileDetail", (req, res) => {
  var params = req.body;
  // console.log(params);
  let query = "";
  let param = "";
  query =
    "UPDATE `cv_users` SET `name`=?,`sex`=?,`contact`=?,`email`=?,`dob`=?,`country`=?,`state`=?,`city`=?,`address`=?,`dept_id`=? WHERE user_id=? and sch_id=?";
  param = [
    params.data.name,
    params.data.sex,
    params.data.contact_no,
    params.data.email,
    params.data.dob,
    params.data["select-countries"],
    params.data["select-state"],
    params.data["select-cities"],
    params.data.address,
    params.data.dept_id,
    params.user_id,
    params.sch_id
  ];
  return dbUtils
    .runSqlQueryAsyncUpdate(query, param)
    .then(result => {
      if (result.err) throw result.err;
      else res.send(result.result);
    })
    .catch(err => {
      res.send(result.err);
    });
});
router.post("/updateStudentBasicProfileDetail", (req, res) => {
  var params = req.body;
  let query = "";
  let param = "";
  if (params.sch_id != 1 && params.cv_pid == 1) {
    query =
      "UPDATE `cv_users` SET  `name`=?,`sex`=?,`contact`=?,`email`=?,`dob`=?,`country`=?,`state`=?,`city`=?,`address`=?,`emergency_contact_no`=? WHERE user_id=? and sch_id=?";
    param = [
      params.data.name,
      params.data.sex,
      params.data.contact_no,
      params.data.email,
      params.data.dob,
      params.data["select-countries"],
      params.data["select-state"],
      params.data["select-cities"],
      params.data.address,
      params.data.student_emergency_contact_no,
      params.user_id,
      params.sch_id
    ];
    return dbUtils
      .runSqlQueryAsyncUpdate(query, param)
      .then(result => {
        if (result.err) throw result.err;
        else res.send(result.result);
      })
      .catch(err => {
        res.send(result.err);
      });
  } else {
    query =
      "UPDATE `cv_users` SET `name`=?,`sex`=?,`contact`=?,`email`=?,`dob`=?,`country`=?,`state`=?,`city`=?,`address`=?,`board`=?,`emergency_contact_no`=? WHERE user_id=? and sch_id=?";
    param = [
      params.data.name,
      params.data.sex,
      params.data.contact_no,
      params.data.email,
      params.data.dob,
      params.data["select-countries"],
      params.data["select-state"],
      params.data["select-cities"],
      params.data.address,
      params.data.board,
      params.data.student_emergency_contact_no,
      params.user_id,
      params.sch_id
    ];
    return dbUtils.runSqlQueryAsyncUpdate(query, param).then(resp => {
      if (resp.err) console.log(err);
      else query = "SELECT * FROM `cv_st_detail` WHERE user_id=?";
      param = [params.user_id];
      return dbUtils
        .runSqlQueryAsyncSelect(query, param)
        .then(data => {
          if (data.err) console.log(data.err);
          else {
            if (data.result.length) {
              query =
                "UPDATE `cv_st_detail` SET `cls_id`=?,`sec_id`=?,`institute_name`=?,`other_grade`=? WHERE user_id=? and sch_id=?";
              param = [
                params.data.grade,
                params.data.section,
                params.data.institute_name,
                params.data.other_grade,
                params.user_id,
                params.sch_id
              ];
              return dbUtils.runSqlQueryAsyncUpdate(query, param);
            } else {
              query =
                "INSERT INTO `cv_st_detail`(`user_id`, `sch_id`, `cls_id`, `sec_id`, `institute_name`, `other_grade`) VALUES (?,?,?,?.?)";
              param = [
                params.user_id,
                params.sch_id,
                params.data.grade,
                params.data.section,
                params.data.institute_name,
                params.data.other_grade
              ];
              return dbUtils.runSqlQueryAsyncInsert(query, param);
            }
          }
        })
        .then(fin => {
          return res.send(fin);
        });
    });
  }
});
router.post("/updateStudentGuardianProfileDetail", (req, res) => {
  let params = req.body;
  let query =
    "select cv_st_p_id from cv_st_parent_detail where find_in_set(?, user_id)";
  let param = [params.user_id];
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then(response => {
      if (response.err) throw response.err;
      else {
        if (response.result.length) {
          query =
            "UPDATE `cv_st_parent_detail` SET `g_name`=?,`g_email_id`=?,`gcontact_no`=?,`g_employer_name`=?,`g_designation`=?,`gaddress`=? WHERE find_in_set(?,user_id)";
          param = [
            params.data.guardian_name,
            params.data.guardian_email_id,
            params.data.gcontact_no,
            params.data.g_employer_name,
            params.data.g_designation,
            params.data.g_address,
            params.user_id
          ];
          return dbUtils.runSqlQueryAsyncUpdate(query, param);
        } else {
          query =
            "INSERT INTO `cv_st_parent_detail`( `user_id`, `g_name`, `g_email_id`, `gcontact_no`, `g_employer_name`, `g_designation`,`gaddress`) VALUES (?,?,?,?,?,?,?)";
          param = [
            params.user_id,
            params.data.guardian_name,
            params.data.guardian_email_id,
            params.data.gcontact_no,
            params.data.g_employer_name,
            params.data.g_designation,
            params.data.g_address
          ];
          return dbUtils.runSqlQueryAsyncInsert(query, param);
        }
      }
    })
    .then(ress => {
      //console.log(ress);
      if (ress.err) throw ress.err;
      else return res.send(ress.result);
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("/updateStudentMotherProfileDetail", (req, res) => {
  let params = req.body;
  let query =
    "select cv_st_p_id from cv_st_parent_detail where find_in_set(?, user_id)";
  let param = [params.user_id];
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then(response => {
      if (response.err) throw response.err;
      else {
        if (response.result.length) {
          query =
            "UPDATE `cv_st_parent_detail` SET `mother_name`=?,`mother_email_id`=?,`mcontact_no`=?,`m_employer_name`=?,`m_designation`=?,`m_address`=? WHERE find_in_set(?,user_id)";
          param = [
            params.data.mother_name,
            params.data.mother_email_id,
            params.data.mcontact_no,
            params.data.m_employer_name,
            params.data.m_designation,
            params.data.m_address,
            params.user_id
          ];
          return dbUtils.runSqlQueryAsyncUpdate(query, param);
        } else {
          query =
            "INSERT INTO `cv_st_parent_detail`( `user_id`, `mother_name`, `mother_email_id`, `mcontact_no`, `m_employer_name`, `m_designation`,`m_address`) VALUES (?,?,?,?,?,?,?)";
          param = [
            params.user_id,
            params.data.mother_name,
            params.data.mother_email_id,
            params.data.mcontact_no,
            params.data.m_employer_name,
            params.data.m_designation,
            params.data.m_address
          ];
          return dbUtils.runSqlQueryAsyncInsert(query, param);
        }
      }
    })
    .then(ress => {
      if (ress.err) throw ress.err;
      else return res.send(ress.result);
    })
    .catch(err => {
      console.log(err);
    });
});
router.post("/updateStudentFatherProfileDetail", (req, res) => {
  let params = req.body;
  let query =
    "select count(*) 'length' from cv_st_parent_detail where find_in_set(?, user_id)";
  let param = [params.user_id];
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then(response => {
      if (response.err) throw response.err;
      else {
        if (response.result.length) {
          query =
            "UPDATE `cv_st_parent_detail` SET `father_name`=?,`father_email_id`=?,`fcontact_no`=?,`f_employer_name`=?,`f_designation`=?,`f_address`=? WHERE find_in_set(?,user_id)";
          param = [
            params.data.father_name,
            params.data.father_email_id,
            params.data.fcontact_no,
            params.data.f_employer_name,
            params.data.f_designation,
            params.data.f_address,
            params.user_id
          ];
          return dbUtils.runSqlQueryAsyncUpdate(query, param);
        } else {
          query =
            "INSERT INTO `cv_st_parent_detail`( `user_id`, `father_name`, `father_email_id`, `fcontact_no`, `f_employer_name`, `f_designation`,`f_address`) VALUES (?,?,?,?,?,?,?)";
          param = [
            params.user_id,
            params.data.father_name,
            params.data.father_email_id,
            params.data.fcontact_no,
            params.data.f_employer_name,
            params.data.f_designation,
            params.data.f_address
          ];
          return dbUtils.runSqlQueryAsyncInsert(query, param);
        }
      }
    })
    .then(ress => {
      if (ress.err) throw ress.err;
      else return res.send(ress.result);
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("/updateStudentProfileInfo", (req, res, next) => {
  var params = req.body;

  return runSqlQueryAsyncUpdate(
    "UPDATE cv_users, cv_st_detail SET cv_users.name = ?, cv_users.parent_name = ?, cv_users.contact = ?, cv_users.email = ?, cv_users.dob = ?, cv_users.state = ?, cv_users.city = ?, cv_users.address = ?, cv_users.password = ?, cv_st_detail.cls_id = ?, cv_st_detail.sec_id = ? WHERE cv_users.user_id = cv_st_detail.user_id AND cv_users.user_id=? AND cv_users.sch_id=?;",
    [
      params.editProfile[0].name,
      params.editProfile[0].parent_name,
      params.editProfile[0].contact,
      params.editProfile[0].email,
      params.editProfile[0].dob,
      params.editProfile[0].state,
      params.editProfile[0].city,
      params.editProfile[0].address,
      params.editProfile[0].password,
      params.editProfile[0].cls_id,
      params.editProfile[0].sec_id,
      params.editProfile[0].user_id,
      params.editProfile[0].sch_id
    ]
  )
    .then(result => {
      if (result.err) {
      } else {
        res.json({
          data: "done"
        });
      }
    })
    .catch(err => {
      res.status(400).end();
    });
});

router.post("/updateUserProfilePic", profileUpload.any(), (req, res, next) => {
  var params = req.body;
  var profilePic = "";
  if (req.files.length > 0 && params.profleType == "update") {
    profilePic = req.files[0].filename;
  }
  return runSqlQueryAsyncUpdate(
    "update cv_users SET profile_pic=? where sch_id=? and user_id=?",
    [profilePic, params.sch_id, params.user_id]
  )
    .then(result => {
      if (result.err) {
      } else {
        deleteProfilePic(params.oldFileName);
        res.json({
          data: "done"
        });
      }
    })
    .catch(err => {
      res.status(400).end();
    });
});

function deleteProfilePic(fileName) {
  if (!fileName) return false;
  var path = pathUtils.convertToSystemSlash(
    pathUtils.appRoot + "/static/profiles/" + fileName
  );
  rimraf.sync(path);
  return true;
}

/*Student Profile*/
router.post("/All_sections", (req, res) => {
  var params = req.body;
  pool.query("SELECT * FROM cv_sections ORDER BY sec_id ASC", function(
    err,
    result,
    fields
  ) {
    if (err) {
      throw err;
    } else {
      res.json({
        status: "200",
        all_sections: result
      });
    }
  });
});
router.post("/School_classes", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT cc.cls_id, cc.cls_name FROM  cv_classes as cc, cv_school_classes as csc where csc.sch_id=? and csc.cls_id=cc.cls_id  ORDER BY csc.cls_id ASC",
    [params.sch_id],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          all_classes: result
        });
      }
    }
  );
});
router.post("/schoolClassesWithSections", (req, res) => {
  var params = req.body;
  return runSqlQueryAsyncSelect(
    "select cv_school_classes.cls_id,(SELECT cv_classes.cls_name FROM cv_classes where cv_classes.cls_id=cv_school_classes.cls_id)as cls_name, t.sec_id,(SELECT cv_sections.sec_name FROM cv_sections where cv_sections.sec_id=t.sec_id)as sec_name from cv_school_classes left join (SELECT cv_st_detail.cls_id,cv_st_detail.sec_id,cv_st_detail.sch_id from cv_st_detail where cv_st_detail.sch_id=? group by cv_st_detail.cls_id,cv_st_detail.sec_id) t on cv_school_classes.cls_id =t.cls_id where cv_school_classes.sch_id=? order by cv_school_classes.cls_id, t.sec_id",
    [params.sch_id, params.sch_id]
  )
    .then(result => {
      res.json({
        success: 1,
        all_classes: result.result
      });
    })
    .catch(error => {});
});
router.post("/School_students", (req, res) => {
  var params = req.body;
  if (params.sch_id != 0 && params.cls_id == 0 && params.sec_id == 0) {
    pool.query(
      "SELECT cu.*,cu.email,csd.cls_id,csd.sec_id,cc.cls_name,cs.sec_name FROM cv_users as cu, cv_st_detail as csd,cv_classes as cc, cv_sections as cs WHERE cu.status= 1 and cu.user_id=csd.user_id and cu.sch_id=csd.sch_id and cc.cls_id=csd.cls_id and cs.sec_id=csd.sec_id and cu.role_id=3 and cu.sch_id=?  ORDER BY cu.user_id ASC ",
      [params.sch_id],
      function(err, result, fields) {
        if (err) {
          ////console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            all_students: result
          });
        }
      }
    );
  } else if (params.sch_id != 0 && params.cls_id != 0 && params.sec_id == 0) {
    pool.query(
      "SELECT cu.*,cu.email,csd.cls_id,csd.sec_id,cc.cls_name,cs.sec_name FROM cv_users as cu, cv_st_detail as csd,cv_classes as cc, cv_sections as cs WHERE cu.status= 1 and cu.user_id=csd.user_id and cu.sch_id=csd.sch_id and cc.cls_id=csd.cls_id and cs.sec_id=csd.sec_id and cu.role_id=3 and cu.sch_id=? and csd.cls_id=?   ORDER BY cu.user_id ASC",
      [params.sch_id, params.cls_id],
      function(err, result, fields) {
        if (err) {
          ////console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            all_students: result
          });
        }
      }
    );
  } else if (params.sch_id != 0 && params.cls_id != 0 && params.sec_id != 0) {
    pool.query(
      "SELECT cu.*,cu.email,csd.cls_id,csd.sec_id,cc.cls_name,cs.sec_name FROM cv_users as cu, cv_st_detail as csd,cv_classes as cc, cv_sections as cs WHERE cu.status= 1 and cu.user_id=csd.user_id and cu.sch_id=csd.sch_id and cc.cls_id=csd.cls_id and cs.sec_id=csd.sec_id and cu.role_id=3 and cu.sch_id=? and csd.cls_id=? and csd.sec_id=? ORDER BY cu.user_id ASC",
      [params.sch_id, params.cls_id, params.sec_id],
      function(err, result, fields) {
        if (err) {
          ////console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            all_students: result
          });
        }
      }
    );
  }
});

router.post("/promoteStudents", (req, res, next) => {
  var params = req.body;
  var usersIds = Object.keys(params.promoteStudents);
  return new Promise(async function(resolve, reject) {
    for (var i = 0; i < usersIds.length; i++) {
      var result = await runSqlQueryAsyncUpdate(
        "update cv_st_detail SET cls_id=? where sch_id=? and user_id=?",
        [params.promote_cls_id, params.sch_id, usersIds[i]]
      );
    }
    resolve();
  })
    .then(() => {
      res.json({
        data: "done"
      });
    })
    .catch(err => {
      res.status(400).end();
    });
});

router.post("/deleteStudents", (req, res, next) => {
  var params = req.body;
  var usersIds = Object.keys(params.deleteStudents);
  var i;
  for (i = 0; i < usersIds.length; i++) {
    deleteStudent(params.sch_id, usersIds[i]);
  }
  
  if (i == usersIds.length) {
    res.json({
      data: "done"
    });
  }
});

function deleteStudent(sch_id, user_id) {
  return new Promise(async function(resolve, reject) {
    return runSqlQueryAsyncInsert(
      "INSERT into cv_users_deleted SELECT * from cv_users where sch_id= ? and user_id=?  ",
      [sch_id, user_id]
    )
      .then(() => {
        return runSqlQueryAsyncInsert(
          "INSERT into cv_st_detail_deleted SELECT * from cv_st_detail where sch_id= ? and user_id=?  ",
          [sch_id, user_id]
        );
      })
      .then(() => {
        return runSqlQueryAsyncSelect(
          "DELETE from cv_users where sch_id= ? and user_id=?  ",
          [sch_id, user_id]
        ).then(() => {
          return runSqlQueryAsyncSelect(
            "DELETE from cv_st_detail where sch_id= ? and user_id=?  ",
            [sch_id, user_id]
          );
        });
      });
  });
}
module.exports = router;
