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
var url = require("url");
var logQuery = require("../utils/benchmark-utils").logQuery;

var logQueryIfSlow = require("../utils/benchmark-utils").logQueryIfSlow;

const { OAuth2Client } = require("google-auth-library");
const GOOGLE_CLIENT_ID =
  "764117490764-cki4kqk4nth9d76750lbqp4uv23igb83.apps.googleusercontent.com";
const appRoot = path.resolve(path.join(__dirname, "../../"));
const pathSeparator = appRoot.indexOf("\\") >= 0 ? "\\" : "/";
var moment = require("moment");
var excel = require("excel4node");
const XLSX = require("xlsx");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.resolve(appRoot + "/static/uploads/"));
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
var schlogo = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.resolve(appRoot + "/static/school_logo/"));
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

var upload = multer({ storage: storage });
var schoollogo = multer({ storage: schlogo });

var db = require("../db");
var pool = db.pool;

var jsonWrite = function(res, ret) {
  if (typeof ret === "undefined") {
    res.json({
      msg: "Invalid.",
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
        insertId: result ? result.insertId : null,
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

function runSqlQueryAsyncDelete(query, params) {
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

const randomFiles = function(dir, callback) {
  fs.readdir(dir, (err, files) => {
    if (err) return callback(err);

    function checkRandom() {
      if (!files.length) {
        return callback(null, "");
      }
      const randomIndex = Math.floor(Math.random() * files.length);
      const file = files[randomIndex];
      fs.stat(path.join(dir, file), (err, stats) => {
        if (err) return callback(err);
        if (stats.isFile()) {
          return callback(null, file);
        }
        files.splice(randomIndex, 1);
        checkRandom();
      });
    }
    checkRandom();
  });
};

router.post("/getrandomfile", async (req, res) => {
  //console.log('Hey! i am here');
  res.end();
  /* const dir = path.resolve(appRoot + "/resources/quotes_of_day/");
  randomFiles(dir, (err, filename) => {
    if (err) {
      console.log(err);
    } else if (!filename) {
      console.log("no files in /temp/myapp");
    } else {
      // console.log("random filename is " + filename);
      res.send(filename);
    }
  });*/
});
router.post("/sendPasswordResetEmail", (req, res) => {
  return runSqlQueryAsyncSelect("select email from cv_users where email=?", [
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
      <a href="https://dev.codevidhya.com/reset-password?token=${token}">Reset password</a></p>
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

router.post("/resetPassword", (req, res) => {
  var token = req.body.token;
  var password = req.body.password;
  var email;
  return verifyPasswordResetToken(token)
    .then((result) => {
      email = result.email;
      return runSqlQueryAsyncSelect(
        "select email from cv_users where email=?",
        [result.email]
      );
    })
    .then((result) => {
      if (result.err && !result.length) {
        throw new Error("failed");
      } else {
        return runSqlQueryAsyncUpdate(
          "update cv_users set password=? where email=?",
          [password, email]
        );
      }
    })
    .then(() => {
      res.end();
    })
    .catch((err) => {
      res.end();
    });
});

router.post("/getGradeForNoti", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT cv_school_classes.cls_id FROM `cv_school_classes` where cv_school_classes.sch_id=?",
    [params.sch_id],
    function(err, data) {
      res.send(data);
    }
  );
});
router.post("/checkLogin", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT cu.user_id, cu.sch_id, cu.role_id, cu.name, cu.email, cu.contact, cu.dob, cu.state, cu.city, cu.address, cu.path, csd.name as sch_name, csd.logo FROM `cv_users` as cu, cv_school_detail as csd WHERE cu.sch_id=csd.sch_id and status=1 and cu.email=?",
    [params.useremail],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        if (result.length != 0) {
          if (result[0].role_id == 3 && result.length != 0) {
            pool.query(
              "SELECT cls_id,sec_id FROM cv_st_detail  where user_id= ? ",
              [result[0].user_id],
              function(err, result1, fields) {
                if (err) {
                  throw err;
                } else {
                  const user = {
                    user_id: result[0].user_id,
                    sch_id: result[0].sch_id,
                    sch_name: result[0].sch_name,
                    role_id: result[0].role_id,
                    name: result[0].name,
                    cls_id: result1[0].cls_id,
                    sec_id: result1[0].sec_id,
                    dir_path: result[0].path,
                    sch_logo: result[0].logo,
                    user_email: result[0].email,
                    user_contact: result[0].contact,
                  };
                  const token = setToken(user);
                  res.json({
                    token: token,
                    user: result[0].username,
                  });
                }
              }
            );
          } else if (result.length != 0) {
            const user = {
              user_id: result[0].user_id,
              sch_id: result[0].sch_id,
              sch_name: result[0].sch_name,
              role_id: result[0].role_id,
              name: result[0].name,
              dir_path: result[0].path,
              sch_logo: result[0].logo,
              user_email: result[0].email,
              user_contact: result[0].contact,
            };
            const token = setToken(user);
            res.json({
              token: token,
              user: result[0].username,
            });
          }
        } else {
          pool.query(
            "SELECT role_id, username FROM cv_admin where username=? and password=?",
            [params.username, params.password],
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
                  const token = setToken(user);
                  res.json({
                    token: token,
                    user: result[0].username,
                  });
                } else {
                  res.json({
                    user: 0,
                  });
                }
              }
            }
          );
        }
      }
    }
  );
});

/*router.post("/login", function(req, res) {
  var params = req.body;
  pool.query(
    "SELECT cu.user_id, cu.sch_id, cu.role_id, cu.name, cu.email, cu.contact, cu.dob, cu.state, cu.city, cu.address, cu.path, csd.name as sch_name, csd.logo FROM `cv_users` as cu, cv_school_detail as csd WHERE cu.sch_id=csd.sch_id and status=1 and cu.username=? and password=?",
    [params.username, params.password],
    function(err, result, fields) {
      if (err) {
        ////console.log("error");
        throw err;
      } else {
        if (result.length != 0) {
          if (result[0].role_id == 3 && result.length != 0) {
            pool.query(
              "SELECT cls_id,sec_id FROM cv_st_detail  where user_id= ? ",
              [result[0].user_id],
              function(err, result1, fields) {
                if (err) {
                  throw err;
                } else {
                  const user = {
                    user_id: result[0].user_id,
                    sch_id: result[0].sch_id,
                    sch_name: result[0].sch_name,
                    role_id: result[0].role_id,
                    name: result[0].name,
                    cls_id: result1[0].cls_id,
                    sec_id: result1[0].sec_id,
                    dir_path: result[0].path,
                    sch_logo: getRelativePathFromFullPath(
                      path.resolve(
                        appRoot + "/static/school_logo/" + result[0].logo
                      )
                    ),
                    user_email: result[0].email,
                    user_contact: result[0].contact
                  };
                  const token = setToken(user);
                  res.json({
                    token: token,
                    user: result[0].username
                  });
                }
              }
            );
          } else if (result.length != 0) {
            const user = {
              user_id: result[0].user_id,
              sch_id: result[0].sch_id,
              sch_name: result[0].sch_name,
              role_id: result[0].role_id,
              name: result[0].name,
              dir_path: result[0].path,
              sch_logo: getRelativePathFromFullPath(
                path.resolve(appRoot + "/static/school_logo/" + result[0].logo)
              ),
              user_email: result[0].email,
                    user_contact: result[0].contact
            };
            const token = setToken(user);
            res.json({
              token: token,
              user: result[0].username
            });
          }
        } else {
          pool.query(
            "SELECT role_id, username FROM cv_admin where username=? and password=?",
            [params.username, params.password],
            function(err, result, fields) {
              if (err) {
                ////console.log("error");
                throw err;
              } else {
                if (result.length != 0) {
                  const user = {
                    admin_id: result[0].admin_id,
                    role_id: result[0].role_id,
                    name: result[0].name
                  };
                  const token = setToken(user);
                  res.json({
                    token: token,
                    user: result[0].username
                  });
                } else {
                  res.json({
                    user: 0
                  });
                }
              }
            }
          );
        }
      }
    }
  );
});*/
async function loginCheckFunction(user_id) {
  let qury =
    "SELECT * FROM `user_spent_time` WHERE user_id =? and user_status =1 ";
  let param = [user_id];
  pool.query(qury, param, async function(err, data) {
    if (data.length) {
      for (var i = 0; i < data.length; i++) {
        let qury =
          "select user_visited_page.visited_id,user_visited_page.user_spen_id,user_visited_page.page_from,user_visited_page.page_to,user_visited_page.page_in_time,user_visited_page.page_out_time,user_visited_page.update_time,user_visited_page.ideal_time,user_visited_page.spen_time_sec,user_spent_time.user_id from user_visited_page LEFT join user_spent_time on user_visited_page.user_spen_id = user_spent_time.user_spen_id where user_visited_page.user_spen_id=?";
        let param = [data[i].user_spen_id];
        await runSqlQueryAsync(qury, param).then(async function(datas) {
          for (var j = 0; j < datas.length; j++) {
            qury =
              "select * from visited_page_summary where page_name = ? and user_id =?";
            param = [datas[j].page_to, datas[j].user_id];
            await runSqlQueryAsync(qury, param).then(async function(datum) {
              if (datum.length) {
                qury =
                  "UPDATE `visited_page_summary` SET `spent_time`=?,`ideal_time`=?,`visited_times`=? where page_name=? and user_id=?";
                let spent_time = datum[0].spent_time + datas[j].spen_time_sec;
                let ideal_time = datum[0].ideal_time + datas[j].ideal_time;
                param = [
                  spent_time,
                  ideal_time,
                  datas[j].update_time,
                  datas[j].page_to,
                  datum[0].user_id,
                ];
                await runSqlQueryAsync(qury, param).then((datadelete) => {});
              } else {
                qury =
                  "INSERT INTO `visited_page_summary`(`user_spen_id`, `page_name`, `user_id`, `spent_time`, `ideal_time`, `visited_times`) values(?,?,?,?,?,?)";
                param = [
                  datas[j].user_spen_id,
                  datas[j].page_to,
                  datas[j].user_id,
                  datas[j].spen_time_sec,
                  datas[j].ideal_time,
                  datas[j].update_time,
                ];
                await runSqlQueryAsync(qury, param).then((datainsert) => {
                  //  console.log("successful inserted login");
                });
              }
            });
            //  console.log("inner step"+j);
          }
          qury =
            "select * from user_spent_time where user_spen_id=? and user_status = 1";
          params = [data[i].user_spen_id];

          await runSqlQueryAsync(qury, params).then(async function(dataU) {
            // console.log("updations data");
            if (dataU) {
              let allspentTime = dataU[0].spend_time;
              if (!allspentTime) {
                allspentTime = 0;
              }
              qury =
                "UPDATE `user_spent_time` SET `logout_time`= now(),user_status=0,spend_time= (" +
                parseInt(allspentTime) +
                " + (SELECT sum(TIME_TO_SEC(TIMEDIFF(CASE When page_out_time then page_out_time else update_time end,page_in_time))-ideal_time) FROM `user_visited_page` WHERE user_spen_id=? group  by user_spen_id)) where  user_id=? and user_spen_id=?";
              (params = [data[i].user_spen_id, user_id, data[i].user_spen_id]),
                //   console.log(qury);
                // console.log(params);
                await runSqlQueryAsync(qury, params).then(
                  (dataUpdateStatus) => {
                    //  console.log(dataUpdateStatus);
                  }
                );
            }
          });

          qury = "DELETE FROM `user_visited_page` WHERE user_spen_id =?";
          param = [data[i].user_spen_id];
          await runSqlQueryAsync(qury, param).then((datadelete) => {
            //  console.log("delete operation insert");
          });
        });
        qury =
          "UPDATE `user_spent_time` SET user_status =? where user_spen_id=?";
        param = [0, data[i].user_spen_id];
        await runSqlQueryAsync(qury, param).then((resultUpdate) => {
          //  console.log("login update/inactive user operation");
        });
        // console.log("outer step"+i);
      }
    }
  });
}

router.post("/for_enquiry", function(req, res) {
  var params = req.body;
  pool.query(
    "INSERT INTO `cv_enquiry`(`name`, `email`, `phone_no`, `profile`, `school_name`, `school_level`, `address`, `affiliation`, `grades`, `when`, `message`) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
    [
      params.name,
      params.email,
      params.phone,
      params.profile,
      params.school_name,
      params.school_level,
      params.address,
      params.affiliation,
      params.grades,
      params.when,
      params.message,
    ],
    function(err, data) {
      if (err) {
        console.log(err);
      } else {
        res.json({
          status: 200,
          data: "success",
        });
      }
    }
  );
});
router.post("/login", function(req, res) {
  var params = req.body;
  pool.query(
    "SELECT cu.user_id, cu.sch_id, cu.role_id, cu.name, cu.email, cu.contact, cu.dob, cu.state, cu.city, cu.address, cu.path, csd.name as sch_name, csd.logo FROM `cv_users` as cu, cv_school_detail as csd WHERE cu.sch_id=csd.sch_id and status=1 and cu.username=? and password=?",
    [params.username, params.password],
    async function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        if (result.length != 0) {
          pool.query(
            "SELECT cls_id,sec_id FROM cv_st_detail  where user_id= ? ",
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
                };
                const token = setToken(user);

                res.json({
                  token: token,
                  user: result[0].username,
                });
              }
            }
          );

          //remove tracking  await loginCheckFunction(result[0].user_id);
          /* pool.query(
            "SELECT * FROM `user_spent_time` where user_spent_time.user_id=? and DATE_FORMAT(user_spent_time.login_time,'%d %m %y') = DATE_FORMAT(now(),'%d %m %y')",
            [result[0].user_id],
            function(err, data) {
              // console.log(data);
              if (data.length) {
                let count = parseInt(data[0].times_in_day) + 1;
                
              pool.query(
                  "update `user_spent_time` set times_in_day =?,login_time=now(),user_status=? where user_id =? and DATE_FORMAT(user_spent_time.login_time,'%d %m %y') = DATE_FORMAT(now(),'%d %m %y')",
                  [count, 1, result[0].user_id],
                  function(err, data1) {
                    console.log(err);
                    if (!err) {
                      if (result[0].role_id == 3 && result.length != 0) {
                        pool.query(
                          "SELECT cls_id,sec_id FROM cv_st_detail  where user_id= ? ",
                          [result[0].user_id],
                          function(err, result1, fields) {
                            if (err) {
                              throw err;
                            } else {
                              const user = {
                                user_id: result[0].user_id,
                                sch_id: result[0].sch_id,
                                sch_name: result[0].sch_name,
                                role_id: result[0].role_id,
                                name: result[0].name,
                                cls_id: result1[0].cls_id,
                                sec_id: result1[0].sec_id,
                                dir_path: result[0].path,
                                sch_logo: getRelativePathFromFullPath(
                                  path.resolve(
                                    appRoot +
                                      "/static/school_logo/" +
                                      result[0].logo
                                  )
                                ),
                                user_email: result[0].email,
                                user_contact: result[0].contact
                              };
                              const token = setToken(user);

                              res.json({
                                token: token,
                                user: result[0].username
                              });
                            }
                          }
                        );
                      } else if (result.length != 0) {
                        const user = {
                          user_id: result[0].user_id,
                          sch_id: result[0].sch_id,
                          sch_name: result[0].sch_name,
                          role_id: result[0].role_id,
                          name: result[0].name,
                          dir_path: result[0].path,
                          sch_logo: getRelativePathFromFullPath(
                            path.resolve(
                              appRoot + "/static/school_logo/" + result[0].logo
                            )
                          ),
                          user_email: result[0].email,
                          user_contact: result[0].contact
                        };
                        const token = setToken(user);
                        res.json({
                          token: token,
                          user: result[0].username
                        });
                      }
                    }
                  }
                );
              } else {
                // console.log("else condition");
               /* pool.query(
                  "INSERT INTO `user_spent_time`(`user_id`,`user_status`) VALUES (?,?)",
                  [result[0].user_id, 1],
                  function(err, data) {
                    if (!err) {
                      if (result[0].role_id == 3 && result.length != 0) {
                        pool.query(
                          "SELECT cls_id,sec_id FROM cv_st_detail  where user_id= ? ",
                          [result[0].user_id],
                          function(err, result1, fields) {
                            if (err) {
                              throw err;
                            } else {
                              const user = {
                                user_id: result[0].user_id,
                                sch_id: result[0].sch_id,
                                sch_name: result[0].sch_name,
                                role_id: result[0].role_id,
                                name: result[0].name,
                                cls_id: result1[0].cls_id,
                                sec_id: result1[0].sec_id,
                                dir_path: result[0].path,
                                sch_logo: getRelativePathFromFullPath(
                                  path.resolve(
                                    appRoot +
                                      "/static/school_logo/" +
                                      result[0].logo
                                  )
                                ),
                                user_email: result[0].email,
                                user_contact: result[0].contact
                              };
                              const token = setToken(user);
                              res.json({
                                token: token,
                                user: result[0].username
                              });
                            }
                          }
                        );
                      } else if (result.length != 0) {
                        const user = {
                          user_id: result[0].user_id,
                          sch_id: result[0].sch_id,
                          sch_name: result[0].sch_name,
                          role_id: result[0].role_id,
                          name: result[0].name,
                          dir_path: result[0].path,
                          sch_logo: getRelativePathFromFullPath(
                            path.resolve(
                              appRoot + "/static/school_logo/" + result[0].logo
                            )
                          ),
                          user_email: result[0].email,
                          user_contact: result[0].contact
                        };
                        const token = setToken(user);
                        res.json({
                          token: token,
                          user: result[0].username
                        });
                      }
                    }
                  }
                );
              }
            }
          );*/
        } else {
          pool.query(
            "SELECT role_id, username FROM cv_admin where username=? and password=?",
            [params.username, params.password],
            function(err, result, fields) {
              if (err) {
                ////console.log("error");
                throw err;
              } else {
                if (result.length != 0) {
                  const user = {
                    admin_id: result[0].admin_id,
                    role_id: result[0].role_id,
                    name: result[0].name,
                  };
                  const token = setToken(user);
                  res.json({
                    token: token,
                    user: result[0].username,
                  });
                } else {
                  res.json({
                    user: 0,
                  });
                }
              }
            }
          );
        }
      }
    }
  );
});
function checkTrackUser(userId) {
  //console.log('the user id is ' + userId);
  return runSqlQueryAsyncSelect(
    "SELECT * FROM `user_spent_time` where user_spent_time.user_id=? and DATE_FORMAT(user_spent_time.login_time,'%d %m %y') = DATE_FORMAT(now(),'%d %m %y')",
    userId
  ).then((result) => {
    if (!result.err) {
      if (result.result.length) {
        // console.log(result.result);
        //remove login    loginCheckFunction(userId);
        let count = parseInt(result.result[0].times_in_day) + 1;
        return runSqlQueryAsyncUpdate(
          "update `user_spent_time` set times_in_day =?,login_time=now(),user_status=? where user_id =? and DATE_FORMAT(user_spent_time.login_time,'%d %m %y') = DATE_FORMAT(now(),'%d %m %y')",
          [count, 1, userId]
        );
      } else {
        return runSqlQueryAsyncInsert(
          "INSERT INTO `user_spent_time`(`user_id`,`user_status`) VALUES (?,?)",
          [userId, 1]
        );
      }
    }
  });
}

router.post("/loginWithGoogle", function(req, res) {
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
      return runSqlQueryAsyncSelect(
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
              // Tracking removed

              //return checkTrackUser(data.userId)
              //.then(() => {
              // console.log('we are here bro')
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
        } else {
          // Existing user
          userInDatabase = result.result[0];
          return checkTrackUser(userInDatabase.user_id).then(() => {
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
            var user = { token: setToken(userData), user: userData };
            return user;
          });
        }
      }
    })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      if (typeof err == "string") {
        res.status(400).send({ error: err });
      } else {
        res.status(400).send({ error: err.message });
      }
    });
});

const FACEBOOK_APP_ID = "337832333556675";
const FACEBOOK_APP_SECRET = "cfbc740fbcc124457cf2d530fab4397f";
router.post("/loginWithFacebook", function(req, res) {
  var facebookUser;
  request
    .get(
      "https://graph.facebook.com/debug_token?  _token=" +
        req.body.token +
        "&access_token=" +
        FACEBOOK_APP_ID +
        "|" +
        FACEBOOK_APP_SECRET
    )
    .then((response) => {
      var userData = JSON.parse(response);
      if (!userData.data.is_valid) {
        throw new Error("unauthorized");
      } else {
        return userData.data.user_id;
      }
    })
    .then((userId) => {
      return request.get(
        "https://graph.facebook.com/" +
          userId +
          "?fields=id,email,name&access_token=" +
          req.body.token
      );
    })
    .then((response) => {
      facebookUser = JSON.parse(response);
      if (!facebookUser.email) {
        throw new Error("no_email");
      }
      return runSqlQueryAsyncSelect(
        "select * from cv_users where email=? limit 1",
        [facebookUser.email]
      );
    })
    .then((result) => {
      if (result.err) {
        throw new Error("failed");
      } else {
        if (!result.result.length) {
          // New user
          return registerIndependentUser({
            email: facebookUser.email,
            name: facebookUser.name,
            username: "f-" + facebookUser.id,
            dirname: "f-" + facebookUser.id,
            password: "",
          })
            .then((data) => {
              // Remove tracking
              //return checkTrackUser(data.userId)
              //.then(() => {
              // console.log('we are here bro')
              var userData = {
                user_id: data.userId,
                sch_id: 1,
                sch_name: "Codevidhya",
                role_id: 3,
                name: facebookUser.name,
                dir_path: data.path,
                user_email: facebookUser.email,
              };
              var user = { token: setToken(userData), user: userData };
              return user;
              //});
            })
            .catch((err) => {
              throw new Error("user_already_exists");
            });
        } else {
          // Existing user
          userInDatabase = result.result[0];
          return checkTrackUser(userInDatabase.user_id).then(() => {
            var user = userInDatabase;
            //   console.log('we are there sis')
            //console.log(user);
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
            var user = { token: setToken(userData), user: userData };
            return user;
          });
        }
      }
    })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      if (typeof err == "string") {
        res.status(400).send({ error: err });
      } else {
        res.status(400).send({ error: err.message });
      }
    });
});

function setToken(user) {
  const token = jwt.sign({ user }, "my_pass", { expiresIn: "10h" });
  return token;
}

function verifyToken(token) {
  return new Promise(function(resolve, reject) {
    jwt.verify(token, "my_pass", (err, data) => {
      if (!err && data) {
        resolve(data.user);
      } else {
        throw new Error("invalid_token");
      }
    });
  });
}

function verifyRequest(req) {
  return verifyToken(req.headers["authorization"]);
}

router.post("/protected", (req, res) => {
  jwt.verify(req.body.token, "my_pass", (err, data) => {
    if (err || !data) {
      res.json({
        text: "invalid token",
        status: "403",
      });
    } else {
      res.json({
        text: "this is protected",
        status: "200",
        data: data,
      });
    }
  });
});

router.post("/DisplayUser", (req, res) => {
  jwt.verify(req.body.token, "my_pass", (err, data) => {
    if (err || !data) {
      res.json({
        text: "invalid token",
        status: "403",
      });
    } else {
      res.json({
        text: "this is protected",
        status: "200",
        data: data,
      });
    }
  });
});
router.post("/checkUser", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT email FROM cv_users WHERE email=?",
    [params.useremail],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          auth_user: result.length,
        });
      }
    }
  );
});
function checkUserProfile(params) {
  var count = 0;
  var per = "";
  if (params[0].role_id == 2 || params[0].role_id == 1) {
    if (params[0].contact != "") {
      count++;
    }
    if (params[0].email != "") {
      count++;
    }
    if (params[0].state != "") {
      count++;
    }
    if (params[0].city != "") {
      count++;
    }
    if (params[0].address != "") {
      count++;
    }
    if (params[0].pin_code != "") {
      count++;
    }
    if (params[0].email_verified != "0") {
      count++;
    }

    per = Math.ceil((count * 100) / 7);
  } else if (params[0].role_id == 3) {
    if (params[0].contact) {
      count++;
    }
    if (params[0].email) {
      count++;
    }
    if (params[0].dob) {
      count++;
    }
    if (params[0].state) {
      count++;
    }
    if (params[0].city) {
      count++;
    }
    if (params[0].address) {
      count++;
    }
    if (params[0].pin_code) {
      count++;
    }
    if (params[0].email_verified) {
      count++;
    }
    per = Math.ceil((count * 100) / 8);
  }
  return per;
}

router.post("/User_profile", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT cu.user_id,cu.sch_id, cu.role_id, cu.name, cu.parent_name, cu.contact, cu.email, cu.dob, cu.state, cu.city, cu.address, cu.pin_code, cu.username, cu.password, cu.path, cu.status, cu.profile_pic, (SELECT cc.cls_name from cv_classes as cc WHERE cc.cls_id = csd.cls_id) as cls_name, (SELECT cs.sec_name from cv_sections as cs WHERE cs.sec_id = csd.sec_id) as sec_name, (SELECT cc.cls_name from cv_classes as cc WHERE cc.cls_id = csd.cls_id) as cls_name, (SELECT csdd.name from cv_school_detail as csdd WHERE csdd.sch_id = cu.sch_id) as sch_name,(SELECT vc.status from verification_codes as vc WHERE vc.user_id = cu.user_id) as email_verified  FROM cv_users as cu left join cv_st_detail as csd on cu.user_id = csd.user_id where cu.user_id=?",
    [params.user_id],
    function(err, result, fields) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        if (result.length != 0) {
          var profileCount = checkUserProfile(result);
          res.json({
            status: "200",
            profile: result,
            profileCount: profileCount,
          });
        }
      }
    }
  );
});

function sendverification(otpCode, useremail) {
  /*process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: "contact@codevidhya.com",
      pass: "QUjtxzddGgRA"
    }
  });
  return transporter.sendMail({
    from: "contact@codevidhya.com", // sender address
    to: useremail, // list of receivers
    subject: "Codevidhya | Verify your account", // Subject line
    html: `<html>
		<body><p>Thank you for choosing Codevidhya. Please verify 
		your account by entering the code below at 
		<a href=\"http://apptest.codevidhya.com/Dashboard\">http://apptest.codevidhya.com/Dashboard</a></p>
		<p style="font: bold 24px/1 sans-serif;">${otpCode}</p>

		<p>If you have any questions or concerns, you can connect with at <a href="https://codevidhya.com/contact">https://codevidhya.com/contact</a>.</p>
		<p>Regards,<br>Team Codevidhya</p>
		</body></html>`
  });

  // send mail with defined transport object*/
  const mailgun = require("mailgun-js");
  const DOMAIN = "mail.codevidhya.com";
  const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
  const mg = mailgun({ apiKey: api, domain: DOMAIN });
  const data = {
    from: "Codevidhya <contact@codevidhya.com>",
    to: useremail,
    subject: "Codevidhya | Verify your account",
    html: `<html>
							<body><p>Thank you for choosing Codevidhya. Please verify 
							your account by entering the code below at 
							<a href=\"https://studio.codevidhya.com/Dashboard\">https://studio.codevidhya.com/Dashboard</a></p>
							<p style="font: bold 24px/1 sans-serif;">${otpCode}</p>

							<p>If you have any questions or concerns, you can connect with at <a href="https://codevidhya.com/contact">https://codevidhya.com/contact</a>.</p>
							<p>Regards,<br>Team Codevidhya</p>
							</body></html>`,
  };

  return mg.messages().send(data);
}

router.post("/sendVerificationCode", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT * FROM verification_codes WHERE user_id=?",
    [params.user_id],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        if (result.length != 0) {
          sendverification(result[0].otp_code, params.user_email).then(
            function() {
              res.json({
                status: "200",
                success: true,
              });
            }
          );
        }
      }
    }
  );
});

function uploadProfilePicture(req, res) {
  var uploadPath = path.resolve(appRoot + "/static/dashboard/profiles");
  var diskStorage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
      cb(null, file.fieldname + ".jpg");
    },
  });

  var upload = multer({ storage: diskStorage }).any();
  return upload(req, res, function(err) {
    if (err) {
      return 0;
    }
    return 1;
  });
}

router.post("/Update_profile", (req, res, next) => {
  var params = req.headers;
  var otpCode = genpassword();
  if (params.role_id != 3) {
    pool.query(
      "UPDATE cv_users SET email=?, contact=?, state=?, city=?, address=?, pin_code =?, profile_pic=?  where user_id=? ",
      [
        params.useremail,
        params.usercontact,
        params.userstate,
        params.usercity,
        params.useraddress,
        params.userpincode,
        params.userprofilepic,
        params.user_id,
      ],
      function(err, result1, fields) {
        if (err) {
          throw err;
        } else {
          pool.query(
            "SELECT * FROM verification_codes WHERE user_id=?",
            [params.user_id],
            function(err, result, fields) {
              if (err) {
                throw err;
              } else {
                if (result.length != 0) {
                  uploadProfilePicture(req, res);
                  sendverification(result[0].otp_code, params.useremail).then(
                    function() {
                      res.json({
                        status: "200",
                        success: true,
                      });
                    }
                  );
                } else {
                  pool.query(
                    "INSERT INTO verification_codes (user_id, otp_code, status) values(?,?,?) ",
                    [params.user_id, otpCode, "0"],
                    function(err, result1, fields) {
                      if (err) {
                        throw err;
                      } else {
                        uploadProfilePicture(req, res);
                        sendverification(otpCode, params.useremail)
                          .then(function() {
                            res.json({
                              status: "200",
                              success: true,
                            });
                          })
                          .catch((e) => {
                            res.json({
                              status: "200",
                              success: true,
                            });
                          });
                      }
                    }
                  );
                }
              }
            }
          );
        }
      }
    );
  } else {
    pool.query(
      "UPDATE cv_users SET parent_name=?, dob=?, email=?, contact=?, state=?, city=?, address=?, pin_code=?, profile_pic=?  where user_id=? ",
      [
        params.parentname,
        params.userdob,
        params.useremail,
        params.usercontact,
        params.userstate,
        params.usercity,
        params.useraddress,
        params.userpincode,
        params.userprofilepic,
        params.user_id,
      ],
      function(err, result1, fields) {
        if (err) {
          throw err;
        } else {
          pool.query(
            "SELECT * FROM verification_codes WHERE user_id=?",
            [params.user_id],
            function(err, result, fields) {
              if (err) {
                throw err;
              } else {
                if (result.length != 0) {
                  uploadProfilePicture(req, res);
                  sendverification(result[0].otp_code, params.useremail).then(
                    function() {
                      res.json({
                        status: "200",
                        success: true,
                      });
                    }
                  );
                } else {
                  pool.query(
                    "INSERT INTO verification_codes (user_id, otp_code, status) values(?,?,?) ",
                    [params.user_id, otpCode, "0"],
                    function(err, result1, fields) {
                      if (err) {
                        throw err;
                      } else {
                        uploadProfilePicture(req, res);
                        sendverification(otpCode, params.useremail)
                          .then(function() {
                            res.json({
                              status: "200",
                              success: true,
                            });
                          })
                          .catch((e) => {
                            res.json({
                              status: "200",
                              success: true,
                            });
                          });
                      }
                    }
                  );
                }
              }
            }
          );
        }
      }
    );
  }
});

router.post("/verifyCode", (req, res) => {
  var params = req.body;
  pool.query(
    "UPDATE verification_codes SET status=? where user_id=? and otp_code=?",
    ["1", params.user_id, params.otpCode],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        if (result.affectedRows == 0) {
          res.json({
            status: "200",
            success: false,
          });
        } else if (result.affectedRows) {
          res.json({
            status: "200",
            success: true,
          });
        }
      }
    }
  );
});

//this request for add new subject
router.post("/Add_subjects", (req, res) => {
  var params = req.body;
  if (params.sub_name)
    pool.query(
      "SELECT sub_name FROM cv_subjects where sch_id=? and sub_name=?",
      [params.sch_id, params.sub_name],
      function(err, result, fields) {
        if (err) {
          throw err;
        } else {
          if (result.length == 0) {
            pool.query(
              "INSERT INTO cv_subjects (sch_id, sub_name) values(?,?)",
              [params.sch_id, params.sub_name],
              function(err, result, fields) {
                if (err) {
                  //console.log("error");
                  throw err;
                } else {
                  res.json({
                    status: "200",
                    success: 1,
                  });
                }
              }
            );
          } else {
            res.json({
              status: "200",
              success: 0,
            });
          }
        }
      }
    );
});

// this subject for all subjects
router.post("/All_subjects", (req, res) => {
  var params = req.body;
  pool.query("SELECT * FROM cv_subjects ORDER BY sub_id ASC", function(
    err,
    result,
    fields
  ) {
    if (err) {
      //console.log("error");
      throw err;
    } else {
      res.json({
        status: "200",
        all_subject: result,
      });
    }
  });
});

router.post("/All_classes", (req, res) => {
  var params = req.body;
  pool.query("SELECT * FROM cv_classes ORDER BY cls_id ASC", function(
    err,
    result,
    fields
  ) {
    if (err) {
      //console.log("error");
      throw err;
    } else {
      res.json({
        status: "200",
        all_classes: result,
      });
    }
  });
});

router.post("/All_sections", (req, res) => {
  var params = req.body;
  pool.query("SELECT * FROM cv_sections ORDER BY sec_id ASC", function(
    err,
    result,
    fields
  ) {
    if (err) {
      //console.log("error");
      throw err;
    } else {
      res.json({
        status: "200",
        all_sections: result,
      });
    }
  });
});

router.post("/School_classes", (req, res) => {
  var params = req.body;
  if (params.sch_id == 0 || params.sch_id == "") {
    pool.query(
      "SELECT cls_id, cls_name FROM cv_classes ORDER BY cls_id ASC",
      [params.sch_id],
      function(err, result, fields) {
        if (err) {
          //console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            all_classes: result,
          });
        }
      }
    );
  } else {
    pool.query(
      "SELECT cc.cls_id, cc.cls_name FROM  cv_classes as cc, cv_school_classes as csc where csc.sch_id=? and csc.cls_id=cc.cls_id  ORDER BY csc.cls_id ASC",
      [params.sch_id],
      function(err, result, fields) {
        if (err) {
          //console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            all_classes: result,
          });
        }
      }
    );
  }
});

router.post("/School_sections", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT DISTINCT csd.sec_id, cs.sec_id, cs.sec_name FROM cv_st_detail as csd, cv_sections as cs where cs.sec_id=csd.sec_id and csd.sch_id=? and csd.cls_id=? ORDER BY cs.sec_id ASC",
    [params.sch_id, params.cls_id],
    function(err, result, fields) {
      if (err) {
        //console.log("error");
        throw err;
      } else {
        res.json({
          status: "200",
          all_sections: result,
        });
      }
    }
  );
});

/*##############################################################################
##################################Start Codevidhya.com ################################
################################################################################*/
function sendMailTouser(mailuser, subject='', message='') {
  const mailgun = require("mailgun-js");
  const DOMAIN = "mail.codevidhya.com";
  const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
  const mg = mailgun({ apiKey: api, domain: DOMAIN });
  const data = {
    from: "Codevidhya <contact@codevidhya.com>",
    to: mailuser,
    subject: subject,
    html: message,
  };
  return mg.messages().send(data);
}

function sendMailToAdmin(subject, message) {
  const mailgun = require("mailgun-js");
  const DOMAIN = "mail.codevidhya.com";
  const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
  const mg = mailgun({ apiKey: api, domain: DOMAIN });
  const data = {
    from: "Codevidhya <contact@codevidhya.com>",
    to: "contact@codevidhya.com",
    subject: subject,
    html: message,
  };
  return mg.messages().send(data);
}

router.post("/doEmailSubscription", (req, res) => {
  var params = req.body;
  return runSqlQueryAsyncInsert(
    "INSERT INTO cv_subscriptions (email) values(?)",
    [params.email]
  )
    .then((result) => {
      if (result.err) {
        if (result.err.code == "ER_DUP_ENTRY") {
          res.status(400).send("already_subscribed");
        }
      } else {
        res.end();
      }
    })
    .catch((error) => {
      res.status(400).end();
    });
});

router.post("/sendContactUsMessage", (req, res) => {
  var params = req.body;
  return runSqlQueryAsyncInsert(
    "INSERT INTO cv_contact_us (name, email, contact, message) values(?,?,?,?)",
    [params.name, params.email, params.phone, params.message]
  )
    .then((result) => {
      res.end();
    })
    .catch((error) => {
      res.status(400).end();
    });
});

router.post("/sendCourseRequest", (req, res) => {
  var params = req.body;
  return runSqlQueryAsyncInsert(
    "INSERT INTO cv_course_request (course_name, grade, parent_name, phone, email) values(?,?,?,?,?)",
    [
      params.courseName,
      params.grade,
      params.parentName,
      params.phone,
      params.email,
    ]
  )
    .then(() => {
      res.end();
    })
    .catch((error) => {
      res.status(400).end();
    });
});

router.post("/sendDemoRequest", function(req, res) {
  var params = req.body;
  var adminSubject = "New Demo Request";
  var adminMessage = `
    <html>
    <body>
      <p><strong>Name</strong></p>
      <p>${params.name}</p>
      <p><strong>Email Address</strong></p>
      <p>${params.email}</p>
      <p><strong>Contact Number</strong></p>
      <p>${params.phone}</p>
      <p><strong>School Name</strong></p>
      <p>${params.school}</p>
      <p><strong>City</strong></p>
      <p>${params.city}</p>
      <p><strong>Country</strong></p>
      <p>${params.country}</p>
    </body></html>`;
  var userSubject = "Codevidhya | Coding Program for Schools";
  var userMessage = `
    <html>
    <body>
      <p>Dear ${params.name},</p>
      <p>Greetings of the day!</p>
      <p>We have received your demo request and would like to thank you showing your interest in Codevidhya. Our Program Support team will get back to you soon.</p>
      <p>Thank you!</p>
      <p>Regards</p>
      <p>Team Codevidhya</p>
    </body></html>`;

  // need to be updated after changing table structure.
  pool.query(
    "INSERT INTO `cv_demo_request`(`name`, `email`, `phone_no`, `school_name`,`city`,`country`) VALUES (?,?,?,?,?,?)",
    [
      params.name,
      params.email,
      params.phone,
      params.school_name,
      params.city,
      params.country,
    ],
    function(err, data) {
      if (err) {
        res.status(400).end();
      } else {
        //sendMailTouser(params.email);
        //sendMailToAdmin(adminSubject);
        res.end();
      }
    }
  );
  res.sendStatus(200);
});

router.post("/sendCurriculumRequest", function(req, res) {
  var params = req.body;
  var adminSubject = "New Request for Curriculum";
  var adminMessage = `
    <html>
    <body>
      <p><strong>Name</strong></p>
      <p>${params.name}</p>
      <p><strong>Email Address</strong></p>
      <p>${params.email}</p>
      <p><strong>Contact Number</strong></p>
      <p>${params.phone}</p>
      <p><strong>City</strong></p>
      <p>${params.city}</p>
      <p><strong>Country</strong></p>
      <p>${params.country}</p>
    </body></html>`;
  var userSubject = "Codevidhya | Coding Program for Schools";
  var userMessage = `
    <html>
    <body>
      <p>Dear ${params.name},</p>
      <p>Greetings of the day!</p>
      <p>We have received your demo request and would like to thank you showing your interest in Codevidhya. Our Program Support team will get back to you soon.</p>
      <p>Thank you!</p>
      <p>Regards</p>
      <p>Team Codevidhya</p>
    </body></html>`;
  pool.query(
    "INSERT INTO `cv_curriculum_request`(`name`, `email`, `phone`, `profile`, `school`, `school_level`, `address`, `affiliation`, `grades`, `session`, `no_of_students`, `reply_at`, `message`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      params.name,
      params.email,
      params.phone,
      params.profile,
      params.school_name,
      params.school_level,
      params.address,
      params.affiliation,
      params.grades,
      params.session,
      params.no_of_students,
      params.reply_at,
      params.message,
    ],
    function(err, data) {
      if (err) {
        res.status(400).end();
      } else {
        sendMailTouser(params.email, userSubject, userMessage);
        sendMailToAdmin(adminSubject, adminMessage);
        res.end();
      }
    }
  );
});

/*##############################################################################
##################################End Codevidhya################################
################################################################################*/

/*##############################################################################
##################################Start Assessment################################
################################################################################*/
router.post("/getServerTime", (req, res) => {
  res.json({
    status: "200",
    serverTime: new Date(),
  });
});

router.post("/AllProducts", (req, res) => {
  var params = req.body;
  return runSqlQueryAsyncSelect("SELECT * FROM products")
    .then((result) => {
      res.json({
        success: 1,
        allProducts: result.result,
      });
    })
    .catch((error) => {});
});

router.post("/All_packages", (req, res) => {
  var params = req.body;
  return runSqlQueryAsyncSelect("SELECT * FROM product_packages")
    .then((result) => {
      res.json({
        success: 1,
        all_packages: result.result,
      });
    })
    .catch((error) => {});
});

router.post("/displayAllBooks", (req, res) => {
  var params = req.body;
  return runSqlQueryAsyncSelect("SELECT book_id, book_name FROM books")
    .then((result) => {
      res.json({
        success: 1,
        courses: result.result,
      });
    })
    .catch((error) => {});
});

router.post("/CreateAssessmentForOtherSubjects", function(req, res) {
  var params = req.body;
  var schoolGrades = "";
  var assessmentDetail = [];
  return new Promise(async function(resolve, reject) {
    var result0 = await runSqlQueryAsyncSelect(
      "SELECT assessment_name  FROM cv_assessments where sch_id=? AND assessment_name=?",
      [params.sch_id, params.assessmentDetails[0].assessmentName]
    );
    if (result0.result.length > 0) {
      reject();
    } else {
      return new Promise((resolve1, reject1) => {
        resolve1();
      })
        .then(() => {
          return runSqlQueryAsyncInsert(
            "INSERT INTO cv_assessments (assessment_name, duration,description, status, sch_id, role_id,book_id,used_for,price, product_id,for_grades,user_id) values(?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              params.assessmentDetails[0].assessmentName,
              params.assessmentDetails[0].duration,
              params.assessmentDetails[0].description,
              1,
              params.sch_id,
              params.assessmentDetails[0].role_id,
              params.assessmentDetails[0].book_id,
              params.assessmentDetails[0].used_for,
              params.assessmentDetails[0].asmnt_price,
              0,
              schoolGrades,
              params.assessmentDetails[0].user_id,
            ]
          );
        })
        .then((result00) => {
          resolve(result00.insertId);
        });
    }
  })
    .then(async (assessmentId) => {
      return new Promise(async function(resolve, reject) {
        if (
          params.assessmentQuestion &&
          params.assessmentQuestion.length != 0
        ) {
          for (var i = 0; i < params.assessmentQuestion.length; i++) {
            var result = await runSqlQueryAsyncSelect(
              "SELECT que_id FROM cv_assessment_question WHERE assessment_id=? and que_id=?",
              [assessmentId, params.assessmentQuestion[i].que_id]
            );
            if (result.result.length == 0) {
              var result1 = await runSqlQueryAsyncInsert(
                "INSERT INTO cv_assessment_question (sr_no,assessment_id,que_id,sub_id,marks) values(?,?,?,?,?)",
                [
                  0,
                  assessmentId,
                  params.assessmentQuestion[i].que_id,
                  params.assessmentQuestion[i].sub_id,
                  params.assessmentQuestion[i].marks,
                ]
              );
              if (!result1.err) {
                var result2 = await runSqlQueryAsyncUpdate(
                  "UPDATE cv_questions SET status=status+1 where que_id = ?",
                  [params.assessmentQuestion[i].que_id]
                );
              }
            }
          }
        }
        return runSqlQueryAsyncSelect(
          "SELECT assessment_id  FROM cv_assessment_for_other_course where sch_id=? AND assessment_id=?",
          [params.sch_id, assessmentId]
        )
          .then((result3) => {
            if (result3.result.length == 0) {
              return runSqlQueryAsyncInsert(
                "INSERT INTO cv_assessment_for_other_course values(?,?,?,?,?,?) ",
                [
                  assessmentId,
                  params.sch_id,
                  params.assessmentDetails[0].assessmentTopic,
                  params.assessmentDetails[0].asmnt_date,
                  0,
                  0,
                ]
              );
            }
          })
          .then(() => {
            resolve(assessmentId);
          });
      });
    })
    .then((assessmentId) => {
      //emailforAssessmentToStudents(params, assessmentDetail);

      var i;
      var j;
      var k = 1;
      var l = 0;
      return new Promise(async function(resolve, reject) {
        var result = await runSqlQueryAsyncSelect(
          "SELECT DISTINCT sub_id FROM cv_assessment_question WHERE assessment_id=?",
          [assessmentId]
        );
        if (result.result.length > 0) {
          var subjects = result.result;
          for (i = 0; i < subjects.length; i++) {
            var sub_id = subjects[i].sub_id;
            var result1 = await runSqlQueryAsyncSelect(
              "SELECT que_id FROM cv_assessment_question WHERE assessment_id=? and sub_id=?",
              [assessmentId, sub_id]
            );
            if (result1.result.length > 0) {
              var questions = result1.result;
              for (j = k; j < k + questions.length; j++) {
                var que_id = questions[l].que_id;
                var result2 = await runSqlQueryAsyncUpdate(
                  "UPDATE cv_assessment_question SET sr_no=? where assessment_id=? and que_id = ?",
                  [j, assessmentId, que_id]
                );
                l++;
              }
              k = j;
              l = 0;
            }
          }
        }
        resolve();
      });
    })
    .then(() => {
      res.json({ success: 1 });
    })
    .catch((error) => {
      res.json({ success: 0 });
    });
});

router.post("/CreateAssessment", function(req, res) {
  var params = req.body;
  var schoolGrades = "";
  var productId = 0;
  if (
    params.assessmentDetails[0].forGrades &&
    params.assessmentDetails[0].forGrades.length
  ) {
    for (i = 0; i < params.assessmentDetails[0].forGrades.length; i++) {
      schoolGrades += params.assessmentDetails[0].forGrades[i] + ",";
    }
    schoolGrades = schoolGrades.substring(0, schoolGrades.length - 1);
  }

  var assessmentDetail = [];
  return new Promise(async function(resolve, reject) {
    var result0 = await runSqlQueryAsyncSelect(
      "SELECT assessment_name  FROM cv_assessments where sch_id=? AND assessment_name=?",
      [params.sch_id, params.assessmentDetails[0].assessmentName]
    );
    if (result0.result.length > 0) {
      reject();
    } else {
      return new Promise((resolve1, reject1) => {
        if (
          params.sch_id == 0 &&
          params.assessmentDetails[0].asmnt_price &&
          params.assessmentDetails[0].asmnt_price != 0
        ) {
          return runSqlQueryAsyncInsert(
            "INSERT INTO products (product_type) values(?)",
            [params.assessmentDetails[0].assessmentName]
          ).then((insertResult) => {
            if (insertResult.insertId) {
              productId = insertResult.insertId;
            }
            resolve1();
          });
        } else {
          resolve1();
        }
      })
        .then(() => {
          return runSqlQueryAsyncInsert(
            "INSERT INTO cv_assessments (assessment_name, duration,description, status, sch_id, role_id,book_id,used_for,price, product_id,for_grades,user_id) values(?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              params.assessmentDetails[0].assessmentName,
              params.assessmentDetails[0].duration,
              params.assessmentDetails[0].description,
              1,
              params.sch_id,
              params.assessmentDetails[0].role_id,
              params.assessmentDetails[0].book_id,
              params.assessmentDetails[0].used_for,
              params.assessmentDetails[0].asmnt_price,
              productId,
              schoolGrades,
              params.assessmentDetails[0].user_id,
            ]
          );
        })
        .then((result00) => {
          resolve(result00.insertId);
        });
    }
  })
    .then(async (assessmentId) => {
      return new Promise(async function(resolve, reject) {
        if (
          params.assessmentQuestion &&
          params.assessmentQuestion.length != 0
        ) {
          for (var i = 0; i < params.assessmentQuestion.length; i++) {
            var result = await runSqlQueryAsyncSelect(
              "SELECT que_id FROM cv_assessment_question WHERE assessment_id=? and que_id=?",
              [assessmentId, params.assessmentQuestion[i].que_id]
            );
            if (result.result.length == 0) {
              var result1 = await runSqlQueryAsyncInsert(
                "INSERT INTO cv_assessment_question (sr_no,assessment_id,que_id,sub_id,marks) values(?,?,?,?,?)",
                [
                  0,
                  assessmentId,
                  params.assessmentQuestion[i].que_id,
                  params.assessmentQuestion[i].sub_id,
                  params.assessmentQuestion[i].marks,
                ]
              );
              if (!result1.err) {
                var result2 = await runSqlQueryAsyncUpdate(
                  "UPDATE cv_questions SET status=status+1 where que_id = ?",
                  [params.assessmentQuestion[i].que_id]
                );
              }
            }
          }
        }

        if (params.assessmentClass && params.assessmentClass.length != 0) {
          for (var j = 0; j < params.assessmentClass.length; j++) {
            var result3 = await runSqlQueryAsyncSelect(
              "SELECT assessment_id  FROM cv_assessment_for_school where sch_id=? AND assessment_id=? AND cls_id=?",
              [params.sch_id, assessmentId, params.assessmentClass[j].cls_id]
            );
            if (result3.result.length == 0) {
              var result4 = await runSqlQueryAsyncInsert(
                "INSERT INTO cv_assessment_for_school values(?,?,?,?,?) ",
                [
                  assessmentId,
                  params.sch_id,
                  params.assessmentClass[j].cls_id,
                  params.assessmentClass[j].asmnt_date,
                  0,
                ]
              );
              params.asmnt_id = assessmentId;
              assessmentDetail.push(params.assessmentClass[j]);
            }
          }
        }
        resolve(assessmentId);
      });
    })
    .then((assessmentId) => {
      emailforAssessmentToStudents(params, assessmentDetail);

      var i;
      var j;
      var k = 1;
      var l = 0;
      return new Promise(async function(resolve, reject) {
        var result = await runSqlQueryAsyncSelect(
          "SELECT DISTINCT sub_id FROM cv_assessment_question WHERE assessment_id=?",
          [assessmentId]
        );
        if (result.result.length > 0) {
          var subjects = result.result;
          for (i = 0; i < subjects.length; i++) {
            var sub_id = subjects[i].sub_id;
            var result1 = await runSqlQueryAsyncSelect(
              "SELECT que_id FROM cv_assessment_question WHERE assessment_id=? and sub_id=?",
              [assessmentId, sub_id]
            );
            if (result1.result.length > 0) {
              var questions = result1.result;
              for (j = k; j < k + questions.length; j++) {
                var que_id = questions[l].que_id;
                var result2 = await runSqlQueryAsyncUpdate(
                  "UPDATE cv_assessment_question SET sr_no=? where assessment_id=? and que_id = ?",
                  [j, assessmentId, que_id]
                );
                l++;
              }
              k = j;
              l = 0;
            }
          }
        }
        resolve();
      });
    })
    .then(() => {
      res.json({ success: 1 });
    })
    .catch((error) => {
      res.json({ success: 0 });
    });
});

function emailforAssessmentToStudents(params, assessmentDetails) {
  var assessmentName = "";
  var assessmentDuration = "";
  var schoolName = "";
  var createdDate = "";
  var detailsForEmail = [];

  return new Promise(async function(resolve, reject) {
    var result = await runSqlQueryAsyncSelect(
      "SELECT  csd.name, ca.assessment_name, ca.duration, ca.date as createdDate FROM cv_school_detail as csd,cv_assessments as ca where csd.sch_id=? AND ca.assessment_id=?",
      [params.sch_id, params.asmnt_id]
    );

    if (result.result.length != 0) {
      assessmentName = result.result[0].assessment_name;
      assessmentDuration = result.result[0].duration;
      schoolName = result.result[0].name;
      createdDate = result.result[0].createdDate;
      for (var i = 0; i < assessmentDetails.length; i++) {
        var result1 = await runSqlQueryAsyncSelect(
          "SELECT cu.user_id, cu.name as studentName, cu.email  FROM cv_users as cu, cv_st_detail csd where cu.sch_id=? and cu.role_id=3 and csd.cls_id=? and cu.user_id=csd.user_id",
          [params.sch_id, assessmentDetails[i].cls_id]
        );
        if (result1.result.length) {
          sendNotificationToUsers(
            1,
            params.sch_id,
            assessmentDetails[i].cls_id,
            0,
            3
          );
          var userDetail = result1.result;
          for (var j = 0; j < userDetail.length; j++) {
            var message = `<html>
                <body>
                  <p>Dear ${userDetail[j].studentName},</p>
                  <p>Greetings from Codevidhya!</p>
                  <p>An Assessment has been scheduled for you to be attempted on the detailed information given below :</p> 
                  <p style='width:50%;'>
                    <table style='border: 1px solid black;border-collapse: collapse;' cellpadding='5'>
                      <tr>
                        <th style='border: 1px solid black;text-align:left;width:auto;'>Assessment Name</th>
                        <td style='border: 1px solid black;'>${assessmentName}</td>
                      </tr>
                      <tr>
                        <th style='border: 1px solid black;text-align:left;width:auto;'>Assessment Duration</th>
                        <td style='border: 1px solid black;'>${assessmentDuration} Minutes</td>
                      </tr>
                      <tr>
                        <th style='border: 1px solid black;text-align:left;width:auto;'>Date of Assessment </th>
                        <td style='border: 1px solid black;'>${moment(
                          assessmentDetails[i].asmnt_date
                        ).format("DD MMMM, YYYY")} @ ${moment(
              assessmentDetails[i].asmnt_date
            ).format("hh:mm a")}</td>
                      </tr>
                    </table
                  </p>
                  <p><b>Note:</b> Assessment can be rescheduled or canceled, you will be informed about the same. </p>
                  <p>Kindly contact your teacher in case of any concern/question.</p>
                  <p>We wish you Good Luck for the assessment.</p>
                  <p>You are receiving this mail as your school is the part of the Codevidhya family.</p>
                </body></html>`;
            if (userDetail[j].email) {
              detailsForEmail.push({
                user_id: userDetail[j].user_id,
                userEmail: userDetail[j].email,
                message: message,
              });
            }
          }
        }
      }
    }
    resolve(detailsForEmail);
  })
    .then((detailsForEmail) => {
      sendMailForAssessment(detailsForEmail);
      res.end();
    })
    .catch((error) => {});
}

function emailforAssessmentToTeachers(params) {
  var assessmentName = "";
  var assessmentDuration = "";
  var scheduledDate = "";
  var detailsForEmail = [];

  return new Promise(async function(resolve, reject) {
    var result = await runSqlQueryAsyncSelect(
      "SELECT ca.assessment_name, ca.duration, ca.date as createdDate, (select cafs.date from cv_assessment_for_school as cafs where cafs.assessment_id=ca.assessment_id and cafs.cls_id=0 and cafs.sch_id=?) as scheduledDate FROM cv_assessments as ca where  ca.assessment_id=?",
      [params.sch_id, params.assessment_id]
    );

    if (result.result.length != 0) {
      assessmentName = result.result[0].assessment_name;
      assessmentDuration = result.result[0].duration;
      scheduledDate = result.result[0].scheduledDate;

      var result1 = await runSqlQueryAsyncSelect(
        "SELECT cu.user_id, cu.name as studentName, cu.email  FROM cv_users as cu where cu.sch_id=? and cu.role_id=2",
        [params.sch_id]
      );
      if (result1.result.length) {
        var userDetail = result1.result;
        for (var j = 0; j < userDetail.length; j++) {
          var message = `<html>
                <body>
                  <p>Dear Educator,</p>
                  <p>Greetings from Codevidhya!</p>
                  <p>We are delighted to share with you that in line with our promised services, the Codevidhya Certified Teacher Assessment are about to commence.</p> 
                  <p>The following shall be the details of Assessment scheduled for you:</p>
                  <p style='width:50%;'>
                    <table style='border: 1px solid black;border-collapse: collapse;' cellpadding='5'>
                      <tr>
                        <th style='border: 1px solid black;text-align:left;width:auto;'>Assessment Name</th>
                        <td style='border: 1px solid black;'>${assessmentName}</td>
                      </tr>
                      <tr>
                        <th style='border: 1px solid black;text-align:left;width:auto;'>Assessment Duration</th>
                        <td style='border: 1px solid black;'>${assessmentDuration} Minutes</td>
                      </tr>
                      <tr>
                        <th style='border: 1px solid black;text-align:left;width:auto;'>Date of Assessment </th>
                        <td style='border: 1px solid black;'>${moment(
                          scheduledDate
                        ).format("DD MMMM, YYYY")} @ ${moment(
            scheduledDate
          ).format("hh:mm a")}</td>
                      </tr>
                    </table
                  </p>
                  <p><b>Note:</b></p>
                  <p>  1. It is upto the discretion of Codevidhya to reschedule or cancel the assessment. You will be informed about the same. </p>
                  <p>  2. The Assessment shall be available to teacher for respective Grade(s) only.</p>
                  <p>Kindly contact Codevidhya in case of any concern/question.</p>
                  <p></p>
                  <p><b>We wish you Good Luck for the assessment.</b></p>

                  <p><em>You are receiving this mail as your school is the part of the Codevidhya family.</em></p>
                </body></html>`;
          if (userDetail[j].email) {
            detailsForEmail.push({
              user_id: userDetail[j].user_id,
              userEmail: userDetail[j].email,
              message: message,
            });
          }
        }
      }
    }
    resolve(detailsForEmail);
  })
    .then((detailsForEmail) => {
      sendMailForAssessment(detailsForEmail);
      res.end();
    })
    .catch((error) => {});
}

/*  notifications block end*/
function sendMailForAssessment(userDetail) {
  const mailgun = require("mailgun-js");
  const DOMAIN = "mail.codevidhya.com";
  const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
  const mg = mailgun({ apiKey: api, domain: DOMAIN });

  for (var i = 0; i < userDetail.length; i++) {
    const data = {
      from: "Codevidhya <contact@codevidhya.com>",
      to: userDetail[i].userEmail,
      subject: "Assessment Notification",
      html: userDetail[i].message,
    };

    return mg.messages().send(data);
  }
}

/* this block used for notifications*/
function sendNotificationToUsers(noti_id, sch_id, cls_id, sec_id, role_id) {
  var result = runSqlQueryAsyncInsert(
    "INSERT INTO cv_notification_for (noti_id, sch_id, cls_id, sec_id, role_id) values(?,?,?,?,?)",
    [noti_id, sch_id, cls_id, sec_id, role_id]
  );
}

router.post("/assignAssessment", (req, res) => {
  var params = req.body;
  var assessmentDetail = [];
  return new Promise(async function(resolve, reject) {
    if (params.classes.length != 0) {
      for (var i = 0; i < params.classes.length; i++) {
        var result = await runSqlQueryAsyncSelect(
          "SELECT assessment_id  FROM cv_assessment_for_school where sch_id=? AND assessment_id=? AND cls_id=?",
          [params.sch_id, params.asmnt_id, params.classes[i].cls_id]
        );
        if (result.result.length == 0) {
          var result4 = await runSqlQueryAsyncInsert(
            "INSERT INTO cv_assessment_for_school values(?,?,?,?,?) ",
            [
              params.asmnt_id,
              params.sch_id,
              params.classes[i].cls_id,
              params.classes[i].asmnt_date,
              0,
            ]
          );
          assessmentDetail.push(params.classes[i]);
        }
      }
    }
    resolve(assessmentDetail);
  })
    .then((assessmentDetail) => {
      emailforAssessmentToStudents(params, assessmentDetail);
      res.json({ success: 1 });
    })
    .catch((error) => {});
});

router.post("/assignAssessmentToTeacher", (req, res) => {
  var params = req.body;
  var i;
  var objKeys = Object.keys(params.schoolsDetail);
  return new Promise(async function(resolve, reject) {
    for (i = 0; i < objKeys.length; i++) {
      if (params.schoolsDetail[objKeys[i]].status == true) {
        assignAssessmentToTeacher(params.schoolsDetail[objKeys[i]]);
      }
    }
    if (i >= objKeys.length) {
      res.json({ success: 1 });
    }
  }).catch((error) => {});
});

function assignAssessmentToTeacher(params) {
  runSqlQueryAsyncSelect(
    "SELECT assessment_id  FROM cv_assessment_for_school where sch_id=? AND assessment_id=? AND cls_id=0",
    [params.sch_id, params.assessment_id]
  ).then((result) => {
    if (result.result.length == 0) {
      runSqlQueryAsyncInsert(
        "INSERT INTO cv_assessment_for_school values(?,?,?,?,?) ",
        [
          params.assessment_id,
          params.sch_id,
          params.cls_id,
          params.date,
          params.result_date,
        ]
      ).then((result) => {
        sendNotificationToUsers(1, params.sch_id, 0, 0, 2);
        emailforAssessmentToTeachers(params);
      });
    }
  });
}

router.post("/assignAssessmentToCourse", (req, res) => {
  var params = req.body;
  return new Promise(async function(resolve, reject) {
    var result = await runSqlQueryAsyncSelect(
      "SELECT assessment_id  FROM cv_assessment_for_course where book_id=? AND assessment_id=?",
      [params.book_id, params.asmnt_id]
    );
    if (result.result.length == 0) {
      runSqlQueryAsyncInsert(
        "insert into cv_assessment_for_course values(?,?,?)",
        [params.asmnt_id, params.book_id, 1]
      ).then(() => {
        resolve(1);
      });
    } else {
      resolve(0);
    }
  })
    .then((status) => {
      res.json({ success: status });
    })
    .catch((error) => {});
});

router.post("/assignAssessmentToCodeQuotient", (req, res) => {
  var params = req.body;
  return new Promise(async function(resolve, reject) {
    var result2 = runSqlQueryAsyncUpdate(
      "UPDATE cv_assessments SET used_for=1 where assessment_id=?",
      [params.asmnt_id]
    );
    resolve();
  })
    .then(() => {
      res.json({ success: 1 });
    })
    .catch((error) => {});
});

router.post("/Assessment_classes", (req, res) => {
  var params = req.body;
  console.log(params);
  if (params.sch_id != 0) {
    pool.query(
      "SELECT cc.cls_id, cc.cls_name, cafs.date FROM cv_assessment_for_school as cafs, cv_classes as cc where  cafs.cls_id=cc.cls_id and cafs.sch_id=? and cafs.assessment_id=? ORDER BY cafs.cls_id ASC",
      [params.sch_id, params.assessment_id],
      function(err, result, fields) {
        if (err) {
          //console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            asmnt_classes: result,
          });
        }
      }
    );
  } else if (params.asmnt_cat == 3 || params.asmnt_cat == 4) {
    pool.query(
      "SELECT cc.cls_id, cc.cls_name, cafs.date, (SELECT csd.name from cv_school_detail  as csd where csd.sch_id=cafs.sch_id ) sch_name, cafs.sch_id FROM cv_assessment_for_school as cafs, cv_classes as cc  where  cafs.cls_id=cc.cls_id and cafs.assessment_id=?",
      [params.assessment_id],
      function(err, result, fields) {
        if (err) {
          //console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            asmnt_classes: result,
          });
        }
      }
    );
  } else if (params.asmnt_cat == 2) {
    pool.query(
      "SELECT  cafs.date, (SELECT csd.name from cv_school_detail  as csd where csd.sch_id=cafs.sch_id ) sch_name, cafs.sch_id FROM cv_assessment_for_school as cafs where  cafs.assessment_id=?",
      [params.assessment_id],
      function(err, result, fields) {
        if (err) {
          //console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            asmnt_classes: result,
          });
        }
      }
    );
  } else if (params.asmnt_cat == 1) {
    pool.query(
      "SELECT cafs.assessment_id, cafs.book_id, (SELECT books.book_name FROM books WHERE books.book_id=cafs.book_id) as book_name FROM `cv_assessment_for_course`  as cafs where assessment_id=?",
      [params.assessment_id],
      function(err, result, fields) {
        if (err) {
          //console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            asmnt_classes: result,
          });
        }
      }
    );
  }
});

router.post("/Delete_assessment_for_class", (req, res) => {
  var params = req.body;
  pool.query(
    "Delete from cv_assessment_for_school where assessment_id=? and sch_id=? and cls_id=?",
    [params.assessment_id, params.sch_id, params.cls_id],
    function(err, result, fields) {
      if (err) {
        //console.log("error");
        throw err;
      } else {
        res.json({
          status: "200",
        });
      }
    }
  );
});

router.post("/assessmentForUsers", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT ca.assessment_id, ca.assessment_name, ca.duration, ca.description, ca.status, ca.sch_id, ca.role_id, ca.used_for, ca.book_id,  ca.price, ca.product_id,ca.for_grades as assessment_grades,cafs.date,cafs.result_date,(select count(que_id) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_que,(select sum(marks) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_marks,(select user_id from cv_assessment_exam_time as caet where caet.user_id=? and caet.assessment_id=ca.assessment_id limit 1) as user_id,(select score from cv_assessment_result as car where car.user_id=? and car.assessment_id=ca.assessment_id limit 1) as score,(select case when count(user_id)>0 then 'true' else 'false' end from cv_assessment_exam_time as caet where caet.user_id=? and caet.assessment_id=ca.assessment_id and caet.exm_end_time > now()) as exam_status,(select caet.exam_status from cv_assessment_exam_time as caet where caet.user_id=? and caet.assessment_id=ca.assessment_id limit 1) as exam_submit_status,  (SELECT cga.grades from cv_grade_assigned as cga where cga.user_id=?) as teacher_grades, (SELECT od.package_id from order_details as od where od.product_id = ca.product_id and od.order_id = (SELECT order_id from orders as o  where o.status=1 and od.order_id=o.order_id and o.user_id=?)) as package_id, (SELECT od.order_id from order_details as od where od.product_id = ca.product_id and od.order_id = (SELECT order_id from orders as o  where o.status=1 and od.order_id=o.order_id and o.user_id=?)) as order_id   FROM cv_assessments as ca left join cv_assessment_for_school as cafs on ca.assessment_id=cafs.assessment_id AND cafs.cls_id=? AND cafs.sch_id=?  where ca.role_id=2 order by ca.assessment_id DESC",
    [
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.cls_id,
      params.sch_id,
    ],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: result,
        });
      }
    }
  );
});

router.post("/displayOtherCourseAsessment", (req, res) => {
  var params = req.body;
  if (params.role_id == 2) {
    pool.query(
      "SELECT DISTINCT ca.assessment_id, ca.assessment_name,ca.duration, ca.description, ca.book_id,ca.used_for,(select count(que_id) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_que,(select sum(marks) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_marks,cafoc.date, ca.status, ca.sch_id,ca.role_id FROM cv_assessments as ca, cv_assessment_for_other_course as cafoc where ca.assessment_id=cafoc.assessment_id and cafoc.book_id=? and  cafoc.sch_id=? order by ca.assessment_id DESC ",
      [params.book_id, params.sch_id],
      function(err, result, fields) {
        if (err) {
          throw err;
        } else {
          res.json({
            status: "200",
            assessments: result,
          });
        }
      }
    );
  } else {
    pool.query(
      "SELECT ca.assessment_id, ca.assessment_name, ca.duration, ca.description, ca.book_id,ca.used_for,ca.sch_id,ca.status,ca.role_id, cafoc.date,(select count(que_id) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_que,(select sum(marks) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_marks,(select user_id from cv_assessment_exam_time as caet where caet.user_id=? and caet.assessment_id=cafoc.assessment_id limit 1) as user_id,(select score from cv_assessment_result as car where car.user_id=? and car.assessment_id=cafoc.assessment_id limit 1) as score,(select case when count(user_id)>0 then 'true' else 'false' end from cv_assessment_exam_time as caet where caet.user_id=? and caet.assessment_id=cafoc.assessment_id and caet.exm_end_time > now()) as exam_status,(select caet.exam_status from cv_assessment_exam_time as caet where caet.user_id=? and caet.assessment_id=ca.assessment_id limit 1) as exam_submit_status  FROM cv_assessments as ca, cv_assessment_for_other_course as cafoc where ca.assessment_id=cafoc.assessment_id AND ca.role_id=3 and ca.book_id=1 AND cafoc.sch_id=? and cafoc.book_id=? order by ca.assessment_id DESC",
      [
        params.user_id,
        params.user_id,
        params.user_id,
        params.user_id,
        params.sch_id,
        params.book_id,
      ],
      function(err, result, fields) {
        if (err) {
          throw err;
        } else {
          res.json({
            status: "200",
            assessments: result,
          });
        }
      }
    );
  }
});

router.post("/displayOtherCourseAsessmentResult", (req, res) => {
  var params = req.body;
  pool.query(
    "select ca.assessment_name, (select sum(marks) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_marks ,cu.user_id, cu.name,(select score from cv_assessment_result as car where car.user_id=cu.user_id and car.assessment_id=ca.assessment_id) as score,(select count(user_id) from cv_assessment_exam_time as caet where caet.user_id=cu.user_id and caet.assessment_id=ca.assessment_id) as exam_attempt, cafoc.result_date  from cv_assessments as ca, books_price as bp, cv_assessment_for_other_course as cafoc,cv_st_detail as csd, cv_users as cu where ca.assessment_id=cafoc.assessment_id and ca.assessment_id=? and bp.book_id=cafoc.book_id and cafoc.book_id=? and cafoc.sch_id=? and csd.sch_id=cafoc.sch_id and cu.user_id=csd.user_id and csd.cls_id=bp.for_grade",
    [params.assessment_id, params.book_id, params.sch_id],
    function(err, result, fields) {
      if (err) {
        //console.log("error");
        throw err;
      } else {
        res.json({
          status: "200",
          assessmentsResult: result,
        });
      }
    }
  );
});

router.post("/displayCourseAsessment", (req, res) => {
  var params = req.body;
  if (params.role_id == 2) {
    pool.query(
      "SELECT ca.assessment_id, ca.assessment_name,ca.duration,ca.description, ca.role_id, ca.book_id,ca.used_for, ca.sch_id,ca.status,ca.role_id, (select count(que_id) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_que,(select sum(marks) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_marks FROM cv_assessments as ca,cv_assessment_for_course as cafc where ca.book_id=1 and ca.status=1 and ca.assessment_id=cafc.assessment_id and cafc.book_id=? order by ca.assessment_id DESC",
      [params.book_id],
      function(err, result, fields) {
        if (err) {
          throw err;
        } else {
          res.json({
            status: "200",
            assessments: result,
          });
        }
      }
    );
  } else {
    pool.query(
      "SELECT ca.assessment_id, ca.assessment_name,ca.duration,ca.description, ca.role_id, ca.book_id,ca.used_for, ca.sch_id,ca.status,ca.role_id, (select count(que_id) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_que,(select sum(marks) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_marks,(select user_id from cv_assessment_exam_time as caet where caet.user_id=? and caet.assessment_id=ca.assessment_id) as user_id,(select score from cv_assessment_result as car where car.user_id=? and car.assessment_id=ca.assessment_id) as score,(select case when count(user_id)>0 then 'true' else 'false' end from cv_assessment_exam_time as caet where caet.user_id=? and caet.assessment_id=ca.assessment_id and caet.exm_end_time > now()) as exam_status  FROM cv_assessments as ca,cv_assessment_for_course as cafc where ca.book_id=1 and ca.status=1 and ca.assessment_id=cafc.assessment_id and cafc.book_id=? order by ca.assessment_id DESC",
      [params.user_id, params.user_id, params.user_id, params.book_id],
      function(err, result, fields) {
        if (err) {
          throw err;
        } else {
          res.json({
            status: "200",
            assessments: result,
          });
        }
      }
    );
  }
});

router.post("/DisplayAssessment", (req, res) => {
  var params = req.body;
  if (params.role_id == 3) {
    pool.query(
      "SELECT ca.assessment_id, ca.assessment_name, ca.duration, ca.description, ca.book_id,ca.used_for,ca.sch_id,ca.status,ca.role_id, cafs.date,(select count(que_id) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_que,(select sum(marks) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_marks,(select user_id from cv_assessment_exam_time as caet where caet.user_id=? and caet.assessment_id=cafs.assessment_id limit 1) as user_id,(select score from cv_assessment_result as car where car.user_id=? and car.assessment_id=cafs.assessment_id limit 1) as score,(select case when count(user_id)>0 then 'true' else 'false' end from cv_assessment_exam_time as caet where caet.user_id=? and caet.assessment_id=cafs.assessment_id and caet.exm_end_time > now()) as exam_status,(select caet.exam_status from cv_assessment_exam_time as caet where caet.user_id=? and caet.assessment_id=ca.assessment_id limit 1) as exam_submit_status  FROM cv_assessments as ca, cv_assessment_for_school as cafs where ca.assessment_id=cafs.assessment_id AND ca.role_id=3 AND cafs.cls_id=? AND cafs.sch_id=? order by ca.assessment_id DESC",
      [
        params.user_id,
        params.user_id,
        params.user_id,
        params.user_id,
        params.cls_id,
        params.sch_id,
      ],
      function(err, result, fields) {
        if (err) {
          throw err;
        } else {
          res.json({
            status: "200",
            data: result,
          });
        }
      }
    );
  } else if (params.role_id == 1 || params.role_id == 2) {
    pool.query(
      "SELECT *  FROM cv_assessments where sch_id=? ",
      [params.sch_id],
      function(err, result, fields) {
        if (err) {
          throw err;
        } else {
          pool.query(
            "SELECT DISTINCT ca.assessment_id, ca.assessment_name,ca.duration, ca.description, ca.book_id,ca.used_for,(select count(que_id) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_que,(select sum(marks) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_marks,ca.date, ca.status, ca.sch_id,ca.role_id FROM cv_assessments as ca, cv_assessment_for_school as cafs where ca.assessment_id=cafs.assessment_id and cafs.sch_id=? order by ca.assessment_id DESC ",
            [params.sch_id],
            function(err, result1, fields) {
              if (err) {
                throw err;
              } else {
                res.json({
                  status: "200",
                  assessments: result,
                  cv_assessments: result1,
                });
              }
            }
          );
        }
      }
    );
  } else {
    pool.query(
      "SELECT ca.*, (select count(que_id) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_que,(select sum(marks) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_marks FROM cv_assessments as ca order by ca.assessment_id DESC",
      function(err, result, fields) {
        if (err) {
          throw err;
        } else {
          res.json({
            status: "200",
            assessments: result,
          });
        }
      }
    );
  }
});

router.post("/DisplayIndividualAssessment", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT ca.*, (select count(que_id) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_que,(select sum(marks) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_marks, (SELECT count(orders.user_id) from orders where orders.user_id=? and orders.product_id=ca.product_id and orders.status=1) as order_status FROM cv_assessments as ca order by ca.assessment_id DESC",
    [params.user_id],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          assessments: result,
        });
      }
    }
  );
});

router.post("/School_assessment", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT DISTINCT ca.assessment_id, ca.assessment_name,ca.duration, ca.description, ca.book_id,ca.used_for,(select count(que_id) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_que,(select sum(marks) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_marks,ca.date, ca.status, ca.sch_id,ca.role_id FROM cv_assessments as ca, cv_assessment_for_school as cafs where ca.assessment_id=cafs.assessment_id and cafs.sch_id=?",
    [params.sch_id],
    function(err, result, fields) {
      if (err) {
        //console.log("error");
        throw err;
      } else {
        res.json({
          status: "200",
          cv_assessments: result,
        });
      }
    }
  );
});

router.post("/Assessment_detail", (req, res) => {
  var params = req.body;
  pool.query(
    "Select * from cv_assessments where assessment_id=?",
    [params.assessment_id],
    function(err, result, fields) {
      if (err) {
        //console.log("error");
        throw err;
      } else {
        res.json({
          status: "200",
          assessment_det: result,
        });
      }
    }
  );
});

router.post("/Assessment_applied", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT ca.assessment_id,ca.assessment_name,cc.cls_id, cc.cls_name,cafs.date,ca.sch_id FROM cv_assessments as ca, cv_assessment_for_school as cafs, cv_classes as cc where ca.assessment_id=cafs.assessment_id and ca.status=1 and cafs.cls_id=cc.cls_id and cafs.sch_id=? and cafs.assessment_id=? ORDER BY cafs.assessment_id ASC",
    [params.sch_id, params.assessment_id],
    function(err, result, fields) {
      if (err) {
        //console.log("error");
        throw err;
      } else {
        res.json({
          status: "200",
          asmnt_applied: result,
        });
      }
    }
  );
});

router.post("/Insert_assessment_time", (req, res) => {
  var params = req.body;
  var startTime = new Date().getTime();
  var endTime = startTime + parseInt(params.duration) * 60 * 1000; // + 30 minutes
  pool.query(
    "Select * from cv_assessment_exam_time where user_id=? and assessment_id=?",
    [params.user_id, params.assessment_id],
    function(err, result, fields) {
      if (err) {
        //console.log("error");
        throw err;
      } else {
        var exam_end_time = result.length ? result[0].exm_end_time : 0;
        var exam_status = startTime < new Date(exam_end_time);
        if (exam_status == true) {
          res.json({
            status: "200",
          });
          return false;
        }

        if (result.length != 0) {
          pool.query(
            "UPDATE cv_assessment_exam_time SET exm_strt_time=?, exm_end_time=? where user_id=? and assessment_id=?",
            [
              new Date(startTime),
              new Date(endTime),
              params.user_id,
              params.assessment_id,
            ],
            function(err, result1, fields) {
              if (err) {
                //console.log("error");
                throw err;
              } else {
                res.json({
                  status: "200",
                  data: result1,
                });
              }
            }
          );
        } else {
          pool.query(
            "INSERT INTO cv_assessment_exam_time values(?,?,?,?,?) ",
            [
              params.user_id,
              params.assessment_id,
              new Date(startTime),
              new Date(endTime),
              0,
            ],
            function(err, result1, fields) {
              if (err) {
                //console.log("error");
                throw err;
              } else {
                //console.log(result);
                res.json({
                  status: "200",
                  data: result1,
                });
              }
            }
          );
        }
      }
    }
  );
});

router.post("/Assessment_Time", (req, res) => {
  var params = req.body;
  pool.query(
    "Select * from cv_assessment_exam_time where user_id=? and assessment_id=?",
    [params.user_id, params.assessment_id],
    function(err, result, fields) {
      if (err) {
        //console.log("error");
        throw err;
      } else {
        var endTime = result[0].exm_end_time;
        var diff = new Date(endTime) - new Date();
        var totSeconds = diff / 1000;
        res.json({
          status: "200",
          assessmentTime: totSeconds,
        });
      }
    }
  );
});

router.post("/Assessment_Que_Detail", (req, res) => {
  var params = req.body;

  pool.query(
    "SELECT DISTINCT caq.sub_id, cs.sub_name, (SELECT count(caqq.que_id) from cv_assessment_question as caqq, cv_questions as cq WHERE caqq.assessment_id=caq.assessment_id and caqq.sub_id=caq.sub_id and caqq.que_id = cq.que_id and cq.true_ans='') as que_type FROM cv_assessment_question as caq, cv_subjects as cs WHERE caq.assessment_id=? AND caq.sub_id=cs.sub_id",
    [params.assessment_id],
    function(err, result, fields) {
      if (err) {
        //console.log("error");
        throw err;
      } else {
        pool.query(
          "SELECT caq.sr_no, cq.que_id, cs.sub_id, cs.sub_name, cq.question,cq.question_img, cq.opt1,cq.opt1_img, cq.opt2,cq.opt2_img, cq.opt3,cq.opt3_img, cq.opt4,cq.opt4_img FROM cv_assessment_question as caq, cv_questions as cq, cv_subjects as cs WHERE caq.que_id = cq.que_id and caq.sub_id=cs.sub_id AND caq.assessment_id=? ORDER BY caq.sr_no ASC",
          [params.assessment_id],
          function(err, result1, fields) {
            if (err) {
              //console.log("error");
              throw err;
            } else {
              pool.query(
                "SELECT caq.assessment_id, caq.sr_no, caq.que_id, caq.sub_id, (select cae.user_id from cv_assessment_exam as cae WHERE cae.que_id=caq.que_id and cae.user_id=? and cae.assessment_id=?) as user_id, (select cae.st_ans from cv_assessment_exam as cae WHERE cae.que_id=caq.que_id and cae.user_id=? and cae.assessment_id=?) as st_ans, (select cae.visit from cv_assessment_exam as cae WHERE cae.que_id=caq.que_id and cae.user_id=? and cae.assessment_id=?) as visit FROM cv_assessment_question as caq WHERE caq.assessment_id=? ORDER BY caq.sr_no ASC",
                [
                  params.user_id,
                  params.assessment_id,
                  params.user_id,
                  params.assessment_id,
                  params.user_id,
                  params.assessment_id,
                  params.assessment_id,
                ],
                function(err, result2, fields) {
                  if (err) {
                    //console.log("error");
                    throw err;
                  } else {
                    res.json({
                      status: "200",
                      subjects: result,
                      tot_que: result1,
                      user_ans: result2,
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

router.post("/Done_Assessment_Que", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT que_id FROM cv_assessment_exam WHERE user_id=? and assessment_id=? and que_id=?",
    [params.user_id, params.assessment_id, params.que_id],
    function(err, result, fields) {
      if (err) {
        //console.log("error");
        throw err;
      } else {
        if (result.length == 0) {
          pool.query(
            "INSERT INTO cv_assessment_exam values(?,?,?,?,?,?,?) ",
            [
              params.user_id,
              params.assessment_id,
              params.que_id,
              params.sub_id,
              params.st_ans,
              params.visit,
              0,
            ],
            function(err, result1, fields) {
              if (err) {
                //console.log("error");
                throw err;
              } else {
                pool.query(
                  "SELECT caq.assessment_id, caq.sr_no, caq.que_id, (select cae.user_id from cv_assessment_exam as cae WHERE cae.que_id=caq.que_id and cae.user_id=? and cae.assessment_id=?) as user_id, (select cae.st_ans from cv_assessment_exam as cae WHERE cae.que_id=caq.que_id and cae.user_id=? and cae.assessment_id=?) as st_ans, (select cae.visit from cv_assessment_exam as cae WHERE cae.que_id=caq.que_id and cae.user_id=? and cae.assessment_id=?) as visit FROM cv_assessment_question as caq WHERE caq.assessment_id=? ORDER BY caq.sr_no ASC",
                  [
                    params.user_id,
                    params.assessment_id,
                    params.user_id,
                    params.assessment_id,
                    params.user_id,
                    params.assessment_id,
                    params.assessment_id,
                  ],
                  function(err, result2, fields) {
                    if (err) {
                      //console.log("error");
                      throw err;
                    } else {
                      res.json({
                        status: "200",
                        user_ans: result2,
                      });
                    }
                  }
                );
              }
            }
          );
        } else {
          if (params.st_ans != "" || params.st_ans == "") {
            pool.query(
              "UPDATE cv_assessment_exam SET st_ans=? where user_id=? and assessment_id=? and que_id=? ",
              [
                params.st_ans,
                params.user_id,
                params.assessment_id,
                params.que_id,
              ],
              function(err, result1, fields) {
                if (err) {
                  //console.log("error");
                  throw err;
                } else {
                  pool.query(
                    "SELECT caq.sr_no, caq.que_id, (select cae.user_id from cv_assessment_exam as cae WHERE cae.que_id=caq.que_id and cae.user_id=? and cae.assessment_id=?) as user_id, (select cae.st_ans from cv_assessment_exam as cae WHERE cae.que_id=caq.que_id and cae.user_id=? and cae.assessment_id=?) as st_ans, (select cae.visit from cv_assessment_exam as cae WHERE cae.que_id=caq.que_id and cae.user_id=? and cae.assessment_id=?) as visit FROM cv_assessment_question as caq WHERE caq.assessment_id=? ORDER BY caq.sr_no ASC",
                    [
                      params.user_id,
                      params.assessment_id,
                      params.user_id,
                      params.assessment_id,
                      params.user_id,
                      params.assessment_id,
                      params.assessment_id,
                    ],
                    function(err, result2, fields) {
                      if (err) {
                        //console.log("error");
                        throw err;
                      } else {
                        res.json({
                          status: "200",
                          user_ans: result2,
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      }
    }
  );
});

router.post("/Assessment_done", (req, res) => {
  var params = req.body;
  var i;
  var que_id;
  runSqlQueryAsyncUpdate(
    "UPDATE cv_assessment_exam_time SET exam_status=1 where  user_id=? and assessment_id=?",
    [params.user_id, params.assessment_id]
  );
  res.json({
    status: "200",
    exam: "done",
  });

  /*for (i = 0; i < params.user_ans.length; i++) {
    if (
      params.user_ans[i].st_ans != null &&
      params.user_ans[i].visit != null &&
      params.user_ans[i].user_id == params.user_id
    ) {
      
      
      pool.query(
        "DELETE FROM cv_assessment_exam WHERE user_id=? and assessment_id=? and que_id=?",
        [params.user_id, params.assessment_id, params.user_ans[i].que_id],
        function(err, result, fields) {
          if (err) {
            //console.log("error");
            throw err;
          } else {
          }
        }
      );

      pool.query(
        "INSERT INTO cv_assessment_exam values(?,?,?,?,?,?,?) ",
        [
          params.user_id,
          params.assessment_id,
          params.user_ans[i].que_id,
          params.user_ans[i].sub_id,
          params.user_ans[i].st_ans,
          params.user_ans[i].visit,
          0
        ],
        function(err, result1, fields) {
          if (err) {
            //console.log("error");
            throw err;
          } else {
          }
        }
      );
    }
  }*/
});

router.post("/downloadQuestionFile", (req, res, next) => {
  var params = req.body;
  var workbook = new excel.Workbook();
  var i;
  var schoolGrades = "";
  var schoolSubjects = "";
  var cols = [
    "Subject",
    "SubjectName",
    "Question",
    "Option1",
    "Option2",
    "Option3",
    "Option4",
    "TrueAnswer",
    "GradeFrom",
    "GradeTo",
  ];

  var trueAns = "opt1,opt2,opt3,opt4";
  var worksheet1 = workbook.addWorksheet("Sheet1");

  for (i = 0; i < cols.length; i++) {
    worksheet1.cell(1, i + 1).string(cols[i]);
  }

  worksheet1.addDataValidation({
    type: "list",
    allowBlank: 1,
    sqref: "H2:H1048576",
    formulas: [trueAns],
  });

  return new Promise(async function(resolve, reject) {
    return runSqlQueryAsyncSelect(
      params.sch_id == 0
        ? "SELECT cls_id, cls_name FROM  cv_classes ORDER BY cls_id ASC"
        : "SELECT cc.cls_id, cc.cls_name FROM  cv_classes as cc, cv_school_classes as csc where csc.sch_id=? and csc.cls_id=cc.cls_id  ORDER BY csc.cls_id ASC",
      [params.sch_id]
    )
      .then((result) => {
        if (result.result.length) {
          for (i = 0; i < result.result.length; i++) {
            schoolGrades += result.result[i].cls_name + ",";
          }
          schoolGrades = schoolGrades.substring(0, schoolGrades.length - 1);
        }
        worksheet1.addDataValidation({
          type: "list",
          allowBlank: 1,
          sqref: "I2:I1048576",
          formulas: [schoolGrades],
        });
        worksheet1.addDataValidation({
          type: "list",
          allowBlank: 1,
          sqref: "J2:J1048576",
          formulas: [schoolGrades],
        });
        resolve();
      })
      .then(() => {
        return runSqlQueryAsyncSelect(
          "SELECT * FROM  cv_subjects where sch_id=?  ORDER BY sub_id ASC",
          [params.sch_id]
        )
          .then((result) => {
            if (result.result.length) {
              for (i = 0; i < result.result.length; i++) {
                schoolSubjects += result.result[i].sub_name + ",";
              }
              schoolSubjects = schoolSubjects + "Other";
              /*schoolSubjects = schoolSubjects.substring(
                0,
                schoolSubjects.length - 1
              );*/
            }
            worksheet1.addDataValidation({
              type: "list",
              allowBlank: 1,
              sqref: "A2:A1048576",
              formulas: [schoolSubjects],
            });
            resolve();
          })
          .then(() => {
            workbook.write("Questions File.xlsx", res);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

router.post("/UploadQuestionFile", upload.any(), (req, res, next) => {
  var params = req.body;
  var existingSubjects = new Object();
  if (req.files.length > 0) {
    var file = req.files[0];

    const workbook = XLSX.readFile(
      appRoot + "/static/uploads/" + file.filename
    );
    const sheetNameList = workbook.SheetNames;
    var QuestionsList = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetNameList[0]]
    );

    return new Promise(async function(resolve, reject) {
      return runSqlQueryAsyncSelect(
        "select * from cv_subjects where sch_id=? or sch_id=0",
        [params.sch_id]
      )
        .then((result) => {
          var data = result.result;
          data.forEach((sub) => {
            existingSubjects[sub.sub_name] = sub.sub_id;
          });
        })
        .then(async () => {
          for (var i = 0; i < QuestionsList.length; i++) {
            var schoolGrades = "";
            for (
              j = QuestionsList[i].GradeFrom;
              j <= QuestionsList[i].GradeTo;
              j++
            ) {
              schoolGrades += j + ",";
            }
            schoolGrades = schoolGrades.substring(0, schoolGrades.length - 1);

            if (existingSubjects[QuestionsList[i].Subject]) {
              sub_id = existingSubjects[QuestionsList[i].Subject];
              createNewQuestion(
                QuestionsList[i],
                sub_id,
                schoolGrades,
                params.sch_id
              );
            } else {
              var dataArray = [
                {
                  sch_id: params.sch_id,
                  sub_name: QuestionsList[i].SubjectName,
                },
              ];
              await createNewSubject(dataArray).then((subjectId) => {
                existingSubjects[QuestionsList[i].SubjectName] = subjectId;
                createNewQuestion(
                  QuestionsList[i],
                  subjectId,
                  schoolGrades,
                  params.sch_id
                );
              });
            }
          }
        })
        .then(() => {
          var status = deleteQuestionFile(file.filename);
          if (status == true) {
            res.json({
              status: 1,
            });
          }
        });
    });
  }
});

function deleteQuestionFile(fileName) {
  if (!fileName) return false;
  var path = convertToSystemSlash(appRoot + "/static/uploads/" + fileName);
  rimraf.sync(path);
  return true;
}

function createNewSubject(params) {
  var existingSubId;
  return runSqlQueryAsyncSelect(
    "SELECT sub_id,sub_name FROM cv_subjects where sch_id=? and sub_name=?",
    [params[0].sch_id, params[0].sub_name]
  )
    .then((result) => {
      if (result.result.length) {
        //return result.result[0].sub_id
        existingSubId = result.result[0].sub_id;
        throw new Error("Subject already exist");
      }
    })
    .then(() => {
      return runSqlQueryAsyncInsert(
        "INSERT INTO cv_subjects (sch_id, sub_name) values(?,?)",
        [params[0].sch_id, params[0].sub_name]
      );
    })
    .then((result) => {
      return result.result.insertId;
    })
    .catch((err) => {
      //console.log(err);
      return existingSubId;
    });
}

function createNewQuestion(questionDetails, sub_id, assessmentGrades, sch_id) {
  var Question = "";
  var Option1 = "";
  var Option2 = "";
  var Option3 = "";
  var Option4 = "";
  var TrueAnswer = "";

  if (questionDetails.Question) Question = questionDetails.Question;
  if (questionDetails.Option1) Option1 = questionDetails.Option1;
  if (questionDetails.Option2) Option2 = questionDetails.Option2;
  if (questionDetails.Option3) Option3 = questionDetails.Option3;
  if (questionDetails.Option4) Option4 = questionDetails.Option4;
  if (questionDetails.TrueAnswer) TrueAnswer = questionDetails.TrueAnswer;

  runSqlQueryAsyncInsert(
    "INSERT INTO cv_questions (sub_id,question,question_img, opt1,opt1_img,opt2,opt2_img,opt3,opt3_img,opt4,opt4_img,true_ans,sch_id,status, for_grade,que_status) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ",
    [
      sub_id,
      Question,
      "",
      Option1,
      "",
      Option2,
      "",
      Option3,
      "",
      Option4,
      "",
      TrueAnswer,
      sch_id,
      0,
      assessmentGrades,
      1,
    ]
  );
}

router.post("/New_question", upload.any(), (req, res, next) => {
  var params = req.body;
  var que_img = params.question_img;
  var opt1_img = params.option1_img;
  var opt2_img = params.option2_img;
  var opt3_img = params.option3_img;
  var opt4_img = params.option4_img;
  var i;
  if (req.files.length > 0) {
    for (i = 0; i < req.files.length; i++) {
      if (req.files[i].fieldname == "question_img") {
        que_img = req.files[i].filename;
      } else if (req.files[i].fieldname == "option1_img") {
        opt1_img = req.files[i].filename;
      } else if (req.files[i].fieldname == "option2_img") {
        opt2_img = req.files[i].filename;
      } else if (req.files[i].fieldname == "option3_img") {
        opt3_img = req.files[i].filename;
      } else if (req.files[i].fieldname == "option4_img") {
        opt4_img = req.files[i].filename;
      }
    }
  }

  pool.query(
    "INSERT INTO cv_questions (sub_id,question,question_img, opt1,opt1_img,opt2,opt2_img,opt3,opt3_img,opt4,opt4_img,true_ans,sch_id,status, for_grade,que_status) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ",
    params.que_type == "obj_type"
      ? [
          params.sub_id,
          params.question,
          que_img,
          params.option1,
          opt1_img,
          params.option2,
          opt2_img,
          params.option3,
          opt3_img,
          params.option4,
          opt4_img,
          params.true_ans,
          params.sch_id,
          0,
          params.queForGrade,
          1,
        ]
      : [
          params.sub_id,
          params.question,
          que_img,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          params.sch_id,
          0,
          params.queForGrade,
          1,
        ],
    function(err, result, fields) {
      if (err) {
        //console.log("error");
        throw err;
      } else {
        //console.log(result);
        res.json({
          status: "200",
          data: "done",
        });
      }
    }
  );
});

router.post("/Subject_questions", (req, res) => {
  var params = req.body;
  if (params.search_for != "") {
    pool.query(
      "SELECT cq.*, (select case when (cqq.opt1!='' or cqq.opt1_img!='') and (cqq.opt2!='' or cqq.opt2_img!='') and (cqq.opt3!='' or cqq.opt3_img!='') and (cqq.opt4!='' or cqq.opt4_img!='') then 'Objective' else 'Subjective' end      from cv_questions as cqq where cqq.que_id=cq.que_id) as que_type FROM cv_questions as cq where cq.que_status=1 and cq.sub_id=? and cq.sch_id=? and cq.question LIKE '%" +
        params.search_for +
        "%'  ORDER BY cq.que_id DESC",
      [params.sub_id, params.sch_id],
      function(err, result, fields) {
        if (err) {
          //console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            all_questions: result,
          });
        }
      }
    );
  } else if (params.sub_id != "") {
    pool.query(
      "SELECT cq.*, (select case when (cqq.opt1!='' or cqq.opt1_img!='') and (cqq.opt2!='' or cqq.opt2_img!='') and (cqq.opt3!='' or cqq.opt3_img!='') and (cqq.opt4!='' or cqq.opt4_img!='') then 'Objective' else 'Subjective' end from cv_questions as cqq where cqq.que_id=cq.que_id) as que_type FROM cv_questions as cq where cq.que_status=1 and cq.sub_id=? and cq.sch_id=? ORDER BY cq.que_id DESC",
      [params.sub_id, params.sch_id],
      function(err, result, fields) {
        if (err) {
          //console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            all_questions: result,
          });
        }
      }
    );
  } else {
    pool.query(
      "SELECT cq.*, (select case when (cqq.opt1!='' or cqq.opt1_img!='') and (cqq.opt2!='' or cqq.opt2_img!='') and (cqq.opt3!='' or cqq.opt3_img!='') and (cqq.opt4!='' or cqq.opt4_img!='') then 'Objective' else 'Subjective' end      from cv_questions as cqq where cqq.que_id=cq.que_id) as que_type FROM cv_questions as cq where cq.que_status=1 and cq.sch_id=? ORDER BY cq.que_id DESC",
      [params.sch_id],
      function(err, result, fields) {
        if (err) {
          //console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            all_questions: result,
          });
        }
      }
    );
  }
});

router.post("/Update_question", upload.any(), (req, res, next) => {
  var params = req.body;
  var que_img = params.question_img;
  var opt1_img = params.option1_img;
  var opt2_img = params.option2_img;
  var opt3_img = params.option3_img;
  var opt4_img = params.option4_img;
  var i;

  if (req.files.length > 0) {
    for (i = 0; i < req.files.length; i++) {
      if (req.files[i].fieldname == "question_img") {
        que_img = req.files[i].filename;
      } else if (req.files[i].fieldname == "option1_img") {
        opt1_img = req.files[i].filename;
      } else if (req.files[i].fieldname == "option2_img") {
        opt2_img = req.files[i].filename;
      } else if (req.files[i].fieldname == "option3_img") {
        opt3_img = req.files[i].filename;
      } else if (req.files[i].fieldname == "option4_img") {
        opt4_img = req.files[i].filename;
      }
    }
  }

  pool.query(
    "UPDATE cv_questions SET question=?, question_img=?, opt1=?,opt1_img=?, opt2=?, opt2_img=?, opt3=?, opt3_img=?, opt4=?, opt4_img=?, true_ans=?, for_grade=?   where que_id=? and sub_id=? ",
    [
      params.question,
      que_img,
      params.option1,
      opt1_img,
      params.option2,
      opt2_img,
      params.option3,
      opt3_img,
      params.option4,
      opt4_img,
      params.true_ans,
      params.queForGrade,
      params.que_id,
      params.sub_id,
    ],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: "done",
        });
      }
    }
  );
});

router.post("/Selected_assessment_detail", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT DISTINCT caq.sub_id, cs.sub_name, (SELECT COUNT(caq.que_id) from cv_assessment_question as caq where caq.sub_id=cs.sub_id and caq.assessment_id=?) as tot_que,(SELECT sum(caq.marks) from cv_assessment_question as caq where caq.sub_id=cs.sub_id and caq.assessment_id=?) as tot_marks FROM cv_assessment_question as caq, cv_subjects as cs where caq.sub_id=cs.sub_id and caq.assessment_id=? ORDER BY caq.sub_id ASC",
    [params.assessment_id, params.assessment_id, params.assessment_id],
    function(err, result, fields) {
      if (err) {
        //console.log("error");
        throw err;
      } else {
        pool.query(
          "SELECT assessment_id,que_id,sub_id,marks FROM cv_assessment_question where assessment_id=? ORDER BY que_id ASC",
          [params.assessment_id],
          function(err, result1, fields) {
            if (err) {
              //console.log("error");
              throw err;
            } else {
              pool.query(
                "SELECT caq.sr_no, caq.que_id, cs.sub_id,cs.sub_name, cq.question, cq.opt1, cq.opt2, cq.opt3, cq.opt4, cq.true_ans,caq.marks FROM cv_assessment_question as caq, cv_subjects as cs, cv_questions as cq  where caq.assessment_id=? AND caq.que_id = cq.que_id AND caq.sub_id=cs.sub_id ORDER BY caq.sr_no ASC",
                [params.assessment_id],
                function(err, result2, fields) {
                  if (err) {
                    //console.log("error");
                    throw err;
                  } else {
                    res.json({
                      status: "200",
                      selected_que: result,
                      que: result1,
                      asmnt_que: result2,
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

router.post("/Assessment_questions", (req, res) => {
  var params = req.body;
  return new Promise(async function(resolve, reject) {
    if (params.questions.length != 0) {
      for (var i = 0; i < params.questions.length; i++) {
        var result = await runSqlQueryAsyncSelect(
          "SELECT que_id  FROM cv_assessment_question where assessment_id=? AND que_id=?",
          [params.assessment_id, params.questions[i].que_id]
        );
        if (result.result.length == 0) {
          var result2 = await runSqlQueryAsyncInsert(
            "INSERT INTO cv_assessment_question (assessment_id,que_id,sub_id,marks) values(?,?,?,?)",
            [
              params.assessment_id,
              params.questions[i].que_id,
              params.questions[i].sub_id,
              params.questions[i].marks,
            ]
          );
          if (!result2.err) {
            var result3 = await runSqlQueryAsyncUpdate(
              "UPDATE cv_questions SET status=status+1 where que_id = ?",
              [params.questions[i].que_id]
            );
          }
        } else {
          var result4 = await runSqlQueryAsyncUpdate(
            "UPDATE cv_assessment_question SET marks=? where assessment_id-? and que_id=?",
            [
              params.questions[i].marks,
              params.assessment_id,
              params.questions[i].que_id,
            ]
          );
        }
      }
    }
    resolve();
  })
    .then(() => {
      var i;
      var j;
      var k = 1;
      var l = 0;
      return new Promise(async function(resolve, reject) {
        var result = await runSqlQueryAsyncSelect(
          "SELECT DISTINCT sub_id FROM cv_assessment_question WHERE assessment_id=?",
          [params.assessment_id]
        );
        if (result.result.length > 0) {
          var subjects = result.result;
          for (i = 0; i < subjects.length; i++) {
            var sub_id = subjects[i].sub_id;
            var result1 = await runSqlQueryAsyncSelect(
              "SELECT que_id FROM cv_assessment_question WHERE assessment_id=? and sub_id=?",
              [params.assessment_id, sub_id]
            );
            if (result1.result.length > 0) {
              var questions = result1.result;
              for (j = k; j < k + questions.length; j++) {
                var que_id = questions[l].que_id;
                var result2 = await runSqlQueryAsyncUpdate(
                  "UPDATE cv_assessment_question SET sr_no=? where assessment_id=? and que_id = ?",
                  [j, params.assessment_id, que_id]
                );
                l++;
              }
              k = j;
              l = 0;
            }
          }
        }
        resolve();
      });
    })
    .then(() => {
      res.json({ success: 1 });
    })
    .catch((error) => {});
});

router.post("/Update_sr_no", (req, res) => {
  var params = req.body;
  var i;
  var j;
  var k = 1;
  var l = 0;
  return new Promise(async function(resolve, reject) {
    var result = await runSqlQueryAsyncSelect(
      "SELECT DISTINCT sub_id FROM cv_assessment_question WHERE assessment_id=?",
      [params.assessmentId]
    );
    if (result.result.length > 0) {
      var subjects = result.result;
      for (i = 0; i < subjects.length; i++) {
        var sub_id = subjects[i].sub_id;
        var result1 = await runSqlQueryAsyncSelect(
          "SELECT que_id FROM cv_assessment_question WHERE assessment_id=? and sub_id=?",
          [params.assessmentId, sub_id]
        );
        if (result1.result.length > 0) {
          var questions = result1.result;
          for (j = k; j < k + questions.length; j++) {
            var que_id = questions[l].que_id;
            var result2 = await runSqlQueryAsyncUpdate(
              "UPDATE cv_assessment_question SET sr_no=? where assessment_id=? and que_id = ?",
              [j, params.assessmentId, que_id]
            );
            l++;
          }
          k = j;
          l = 0;
        }
      }
    }
    resolve();
  })
    .then(() => {
      res.json({ status: "200" });
    })
    .catch((error) => {});
});

router.post("/Delete_assessment_question", (req, res) => {
  var params = req.body;
  pool.query(
    "DELETE FROM cv_assessment_question WHERE assessment_id=? AND que_id=?",
    [params.assessment_id, params.que_id],
    function(err, result, fields) {
      if (err) {
        //console.log("error");
        throw err;
      } else {
        res.json({
          status: "200",
        });
      }
    }
  );
});

router.post("/Assessment_students", (req, res) => {
  var params = req.body;
  if (
    params.asmntType &&
    (params.asmntType == 2 || params.asmntType == 5) &&
    params.assessment_id
  ) {
    pool.query(
      "SELECT ca.assessment_name, (select sum(marks) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_marks ,cu.user_id, (SELECT csd.name from cv_school_detail as csd where csd.sch_id=cu.sch_id) as school_name,  cu.name,(select score from cv_assessment_result as car where car.user_id=cu.user_id and car.assessment_id=ca.assessment_id) as score, (select count(user_id) from cv_assessment_exam_time as caet where caet.user_id=cu.user_id and caet.assessment_id=ca.assessment_id) as exam_status,(select cafs.result_date from cv_assessment_for_school as cafs where cafs.sch_id=cu.sch_id and cafs.assessment_id=ca.assessment_id) as result_date, ca.sch_id FROM cv_users as cu, cv_assessments as ca WHERE cu.user_id and cu.role_id=ca.role_id and cu.sch_id=? and ca.assessment_id=?",
      [params.sch_id, params.assessment_id],
      function(err, result, fields) {
        if (err) {
          //console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            students: result,
          });
        }
      }
    );
  } else {
    pool.query(
      "SELECT cu.user_id, cu.name,cu.email, cc.cls_name, cs.sec_name,cs.sec_id,(select score from cv_assessment_result as car where car.user_id=cst.user_id and car.assessment_id=ca.assessment_id) as score, (select cls_rank from cv_assessment_result as car where car.user_id=cst.user_id and car.assessment_id=ca.assessment_id) as cls_rank,(select sec_rank from cv_assessment_result as car where car.user_id=cst.user_id and car.assessment_id=ca.assessment_id) as sec_rank, (select count(user_id) from cv_assessment_exam_time as caet where caet.user_id=cst.user_id and caet.assessment_id=ca.assessment_id) as exam_status, ca.sch_id FROM `cv_st_detail` as cst, cv_sections as cs, cv_classes as cc, cv_users as cu, cv_assessments as ca WHERE cst.user_id=cu.user_id and cst.cls_id=? and cs.sec_id=cst.sec_id and cst.cls_id=cc.cls_id and cu.sch_id=?  and ca.assessment_id =? order by cs.sec_name",
      [params.cls_id, params.sch_id, params.assessment_id],
      function(err, result, fields) {
        if (err) {
          //console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            students: result,
          });
        }
      }
    );
  }
});

router.post("/Student_assessment_detail", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT caq.que_id, cq.question, cq.opt1, cq.opt2, cq.opt3, cq.opt4, cq.true_ans,(SELECT st_ans from cv_assessment_exam as cae where caq.assessment_id=cae.assessment_id and caq.que_id= cae.que_id and cae.user_id=?) as st_ans,  caq.marks FROM `cv_assessment_question` as caq, cv_questions as cq WHERE cq.que_id = caq.que_id  and caq.assessment_id=?",
    [params.user_id, params.assessment_id],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          students_detail: result,
        });
      }
    }
  );
});

router.post("/Assessment_marks", (req, res) => {
  var params = req.body;
  for (var i = 0; i < params.obtain_marks.length; i++) {
    if (params.obtain_marks[i].marks != "") {
      pool.query(
        "UPDATE cv_assessment_exam SET marks=? where user_id=? and assessment_id=? and que_id = ?",
        [
          params.obtain_marks[i].marks,
          params.obtain_marks[i].user_id,
          params.obtain_marks[i].assessment_id,
          params.obtain_marks[i].que_id,
        ],
        function(err, result1, fields) {
          if (err) {
            throw err;
          } else {
          }
        }
      );
    }
  }
  if (i == params.obtain_marks.length) {
    res.json({
      status: "200",
      data: "done",
    });
  }
});

router.post("/Assessment_result", (req, res) => {
  var params = req.body;
  return new Promise(async function(resolve, reject) {
    var result = await runSqlQueryAsyncSelect(
      "SELECT DISTINCT caq.sub_id, cs.sub_name ,(select sum(marks) from cv_assessment_question as caqq WHERE assessment_id=? and caq.sub_id=caqq.sub_id) as max_marks, (select CASE WHEN sum(cae.marks) IS NULL THEN 0 ELSE sum(cae.marks) END from cv_assessment_exam as cae where cae.sub_id=caq.sub_id and cae.assessment_id=caq.assessment_id and cae.user_id=?) as obtain_marks FROM `cv_assessment_question` as caq, cv_subjects as cs WHERE caq.assessment_id=? AND cs.sub_id=caq.sub_id",
      [params.assessment_id, params.user_id, params.assessment_id]
    ).then(async (result) => {
      var score = 0;
      for (var i = 0; i < result.result.length; i++) {
        await runSqlQueryAsyncInsert(
          "INSERT INTO cv_assessment_marks values(?,?,?,?,?)",
          [
            params.user_id,
            params.sch_id,
            params.assessment_id,
            result.result[i].sub_id,
            result.result[i].obtain_marks,
          ]
        );

        score = score + result.result[i].obtain_marks;
      }
      resolve(score);
    });
  }).then((score) => {
    return runSqlQueryAsyncInsert(
      "INSERT INTO cv_assessment_result values(?,?,?,?,?,?)",
      [params.user_id, params.sch_id, params.assessment_id, score, "0", "0"]
    ).then(() => {
      move_data(params);
      res.json({
        status: "200",
        data: "done",
      });
    });
  });
});

function class_rank(params) {
  var cls_rank = 0;
  var ol_score = 0;
  pool.query(
    "SELECT cu.user_id,car.score FROM cv_users as cu, cv_st_detail as csd, cv_assessment_result car WHERE cu.sch_id=? and csd.user_id=cu.user_id and csd.cls_id=? and car.user_id=csd.user_id and car.assessment_id=? ORDER BY car.score DESC",
    [params.sch_id, params.cls_id, params.assessment_id],
    function(err, result, fields) {
      if (err) {
        //console.log("error");
        throw err;
      } else {
        if (result.length != 0) {
          for (var i = 0; i < result.length; i++) {
            if (result[i].score == ol_score) {
              pool.query(
                "UPDATE cv_assessment_result SET cls_rank=? where user_id=? and assessment_id=?",
                [cls_rank, result[i].user_id, params.assessment_id],
                function(err, result1, fields) {
                  if (err) {
                    //console.log("error");
                    throw err;
                  } else {
                  }
                }
              );
            } else {
              cls_rank++;
              pool.query(
                "UPDATE cv_assessment_result SET cls_rank=? where user_id=? and assessment_id=?",
                [cls_rank, result[i].user_id, params.assessment_id],
                function(err, result1, fields) {
                  if (err) {
                    //console.log("error");
                    throw err;
                  } else {
                  }
                }
              );
            }
            ol_score = result[i].score;
          }
        }
      }
    }
  );
}

function section_rank(params) {
  var sec_rank = 0;
  var ol_score = 0;

  pool.query(
    "SELECT cu.user_id,car.score FROM cv_users as cu, cv_st_detail as csd, cv_assessment_result car WHERE cu.sch_id=? and csd.user_id=cu.user_id and csd.cls_id=? and csd.sec_id=? and car.user_id=csd.user_id and car.assessment_id=? ORDER BY car.score DESC",
    [params.sch_id, params.cls_id, params.sec_id, params.assessment_id],
    function(err, result, fields) {
      if (err) {
        //console.log("error");
        throw err;
      } else {
        if (result.length != 0) {
          for (var i = 0; i < result.length; i++) {
            if (result[i].score == ol_score) {
              pool.query(
                "UPDATE cv_assessment_result SET sec_rank=? where user_id=? and assessment_id=?",
                [sec_rank, result[i].user_id, params.assessment_id],
                function(err, result1, fields) {
                  if (err) {
                    //console.log("error");
                    throw err;
                  } else {
                  }
                }
              );
            } else {
              sec_rank++;
              pool.query(
                "UPDATE cv_assessment_result SET sec_rank=? where user_id=? and assessment_id=?",
                [sec_rank, result[i].user_id, params.assessment_id],
                function(err, result1, fields) {
                  if (err) {
                    //console.log("error");
                    throw err;
                  } else {
                  }
                }
              );
            }
            ol_score = result[i].score;
          }
        }
      }
    }
  );
}

function move_data(params) {
  return new Promise(async function(resolve, reject) {
    return runSqlQueryAsyncInsert(
      "INSERT INTO cv_assessment_solution (user_id,assessment_id,que_id,sub_id,st_ans,visit,marks) SELECT user_id,assessment_id,que_id,sub_id,st_ans,visit,marks FROM cv_assessment_exam WHERE user_id=? and assessment_id=?",
      [params.user_id, params.assessment_id]
    ).then((result) => {
      return runSqlQueryAsyncDelete(
        "DELETE From cv_assessment_exam WHERE user_id=? and assessment_id=?",
        [params.user_id, params.assessment_id]
      );
    });
  });
}

router.post("/Get_assessment_marks", (req, res) => {
  var params = req.body;
  if (params.marks_type == "comb_marks") {
    pool.query(
      "SELECT ca.assessment_id,ca.assessment_name, car.score as obtained_marks, car.sec_rank, car.cls_rank, (SELECT round(avg(score)) from cv_assessment_result as carr WHERE carr.assessment_id=ca.assessment_id and carr.sch_id=cafs.sch_id) as avg_marks, (select count(user_id) from cv_st_detail as csd where csd.sch_id=cafs.sch_id and csd.cls_id=cafs.cls_id) as tot_cls_st,(select count(user_id) from cv_st_detail as csdd where csdd.sch_id=cafs.sch_id and csdd.cls_id=cafs.cls_id and csdd.sec_id=?) as tot_sec_st FROM `cv_assessments` as ca, cv_assessment_for_school as cafs, cv_assessment_result as car where ca.sch_id=0 and ca.assessment_id=cafs.assessment_id and cafs.sch_id=? and cafs.cls_id=? and ca.assessment_id=car.assessment_id and cafs.sch_id=car.sch_id and car.user_id=?",
      [params.sec_id, params.sch_id, params.cls_id, params.user_id],
      function(err, result, fields) {
        if (err) {
          //console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            students_marks: result,
          });
        }
      }
    );
  } else {
    pool.query(
      "SELECT DISTINCT caq.sub_id,cs.sub_name,(SELECT sum(caqq.marks) from cv_assessment_question as caqq WHERE caqq.sub_id=caq.sub_id and caq.assessment_id=caqq.assessment_id) as max_marks,(SELECT marks from cv_assessment_marks as cam WHERE cam.sub_id=caq.sub_id and cam.user_id=? and cam.assessment_id=caq.assessment_id) as obtain_marks,(SELECT round(avg(marks)) from cv_assessment_marks as cam WHERE cam.sub_id=caq.sub_id and cam.assessment_id=caq.assessment_id and cam.sch_id=?) as avg_marks FROM `cv_assessment_question` as caq, cv_subjects as cs WHERE assessment_id=? and cs.sub_id=caq.sub_id",
      [params.user_id, params.sch_id, params.assessment_id],
      function(err, result, fields) {
        if (err) {
          //console.log("error");
          throw err;
        } else {
          pool.query(
            "SELECT score, sec_rank, cls_rank,(select count(user_id) from cv_st_detail as csd where csd.sch_id=? and csd.cls_id=?) as tot_cls_st,(select count(user_id) from cv_st_detail as csdd where csdd.sch_id=? and csdd.cls_id=? and csdd.sec_id=?) as tot_sec_st from cv_assessment_result as car where car.assessment_id=? and car.user_id=?",
            [
              params.sch_id,
              params.cls_id,
              params.sch_id,
              params.cls_id,
              params.sec_id,
              params.assessment_id,
              params.user_id,
            ],
            function(err, result1, fields) {
              if (err) {
                //console.log("error");
                throw err;
              } else {
                res.json({
                  status: "200",
                  students_marks: result,
                  students_score: result1,
                });
              }
            }
          );
        }
      }
    );
  }
});

router.post("/Student_assessment_solution", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT caq.que_id, cq.question, cq.opt1, cq.opt2, cq.opt3, cq.opt4, cq.true_ans, cas.st_ans, caq.marks FROM `cv_assessment_question` as caq, cv_questions as cq, cv_assessment_solution as cas WHERE cq.que_id = caq.que_id and caq.assessment_id=cas.assessment_id and caq.que_id= cas.que_id and cas.user_id=? and caq.assessment_id=?",
    [params.user_id, params.assessment_id],
    function(err, result, fields) {
      if (err) {
        //console.log("error");
        throw err;
      } else {
        pool.query(
          "SELECT score from cv_assessment_result  where assessment_id=? and user_id=?",
          [params.assessment_id, params.user_id],
          function(err, result1, fields) {
            if (err) {
              //console.log("error");
              throw err;
            } else {
              res.json({
                status: "200",
                students_detail: result,
                students_score: result1,
              });
            }
          }
        );
      }
    }
  );
});

router.post("/Assessment_update", (req, res, next) => {
  var params = req.body;
  pool.query(
    "UPDATE cv_assessment_for_school SET date=? where sch_id=? and assessment_id=? and cls_id=? ",
    [params.asmnt_time, params.sch_id, params.assessment_id, params.cls_id],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: "done",
        });
      }
    }
  );
});

router.post("/ClearReport", upload.any(), (req, res, next) => {
  var params = req.body;
  if (params.clear_type == "time") {
    pool.query(
      "DELETE FROM cv_assessment_exam_time where assessment_id=? and user_id=?",
      [params.assessment_id, params.user_id],
      function(err, result1, fields) {
        if (err) {
          throw err;
        } else {
          res.json({
            status: "200",
            data: "done",
          });
        }
      }
    );
  } else if (params.clear_type == "record") {
    pool.query(
      "DELETE FROM cv_assessment_exam where assessment_id=? and user_id=?",
      [params.assessment_id, params.user_id],
      function(err, result1, fields) {
        if (err) {
          throw err;
        } else {
        }
      }
    );
    pool.query(
      "DELETE FROM cv_assessment_exam_time where assessment_id=? and user_id=?",
      [params.assessment_id, params.user_id],
      function(err, result1, fields) {
        if (err) {
          throw err;
        } else {
        }
      }
    );
    pool.query(
      "DELETE FROM cv_assessment_marks where assessment_id=? and user_id=?",
      [params.assessment_id, params.user_id],
      function(err, result1, fields) {
        if (err) {
          throw err;
        } else {
        }
      }
    );
    pool.query(
      "DELETE FROM cv_assessment_result where assessment_id=? and user_id=?",
      [params.assessment_id, params.user_id],
      function(err, result1, fields) {
        if (err) {
          throw err;
        } else {
        }
      }
    );
    pool.query(
      "DELETE FROM cv_assessment_solution where assessment_id=? and user_id=?",
      [params.assessment_id, params.user_id],
      function(err, result1, fields) {
        if (err) {
          throw err;
        } else {
          res.json({
            status: "200",
            data: "done",
          });
        }
      }
    );
  }
});

router.post("/disableQuestion", (req, res) => {
  var params = req.body;
  return runSqlQueryAsyncSelect(
    "UPDATE  cv_questions set que_status=0 where que_id=? and sch_id=?",
    [params.que_id, params.sch_id]
  )
    .then((result) => {
      res.json({
        success: 1,
      });
    })
    .catch((error) => {});
});

router.get("/shareAssessment", (req, res) => {
  let params = req.query;
  var title = `Codevidhya Coding Quotient`;
  var desc = `Go check it out this assessment. it help your coding Quotient`;
  var url = `https://codevidhya.com/shareAssessment?assessment=${params.assessment}`;
  var imag = "https://codevidhya.com/socialshare/share_assessment.jpg";

  res.render("shareCodingQuotient", {
    title: title,
    desc: desc,
    url: url,
    img: imag,
  });
});

router.get("/shareIndividualUserAssessment", (req, res) => {
  let params = req.query;
  runSqlQueryAsyncSelect(
    "SELECT ca.assessment_id, (select count(que_id) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_que,(select sum(marks) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_marks,(SELECT car.score from cv_assessment_result as car where car.assessment_id=ca.assessment_id and car.user_id=?) as score FROM cv_assessments as ca where ca.assessment_id=?  order by ca.assessment_id DESC",
    [params.user_id, params.assessment_id]
  ).then((result) => {
    var title = `Codevidhya Coding Quotient`;
    var desc = `I have scored ${result.result.score} marks out of ${result.result.tot_marks} marks. Go check it out this assessment. it help your coding Quotient`;
    var url = `https://codevidhya.com/shareAssessment?assessment=${params.assessment}`;
    var imag = "https://codevidhya.com/socialshare/share_assessment.jpg";

    res.render("shareCodingQuotient", {
      title: title,
      desc: desc,
      url: url,
      img: imag,
    });
  });
});
/*##############################################################################
##################################End Assessment################################
################################################################################*/

/*######################################################################
################################Quickbook Starts#########################
#######################################################################*/
router.post("/QuickExamples", upload.any(), (req, res, next) => {
  var params = req.body;
  if (params.role_id != 3) {
    var book_id;
    var book_id1;
    if (params.cls_id == "4-5") {
      book_id = 1;
      book_id1 = 3;
    } else if (params.cls_id == "6-7") {
      var book_id = 2;
      var book_id1 = 4;
    } else if (params.cls_id == "8") {
      var book_id = 5;
    }
    pool.query(
      "SELECT id,book_id, title, content, css, js,exp_html,exp_css,exp_js,qr_code FROM book_content WHERE book_id=? or book_id=? ORDER BY book_id",
      [book_id, book_id1],
      function(err, result, fields) {
        if (err) {
          throw err;
        } else {
          res.json({
            status: "200",
            quickExamples: result,
          });
        }
      }
    );
  } else {
    pool.query(
      "SELECT bc.id,bc.title, bc.content, bc.css, bc.js, bc.exp_html,bc.exp_css, bc.exp_js,bc.qr_code FROM book_for_class as bfs, book_content as bc WHERE bfs.cls_id=? and bc.book_id=bfs.book_id ",
      [params.cls_id],
      function(err, result, fields) {
        if (err) {
          throw err;
        } else {
          res.json({
            status: "200",
            quickExamples: result,
          });
        }
      }
    );
  }
});

router.post("/SharedCode", (req, res, next) => {
  var params = req.body;
  pool.query(
    "INSERT INTO cv_shared_code (user_id, htmlcode, csscode, jscode) values(?,?,?,?) ",
    [params.user_id, params.htmlCode, params.cssCode, params.jsCode],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          codeId: result.insertId,
        });
      }
    }
  );
});

router.post("/GetSharedCode", (req, res, next) => {
  var params = req.body;
  pool.query(
    "SELECT * from cv_shared_code  where code_id=?",
    [params.codeId],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: result,
        });
      }
    }
  );
});

function createfile(filePath, code) {
  fs.writeFile(filePath, code, function(err) {});
}
router.post("/ExportToCodeplay", (req, res, next) => {
  var params = req.body;
  var dirPath = path.resolve(
    appRoot +
      "/static/Codeplay/" +
      params.dirPath +
      pathSeparator +
      params.foldername
  );
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
    createfile(dirPath + "/index.html", params.htmlCode);
    createfile(dirPath + "/style.css", params.cssCode);
    createfile(dirPath + "/script.js", params.jsCode);
    res.json({
      status: "200",
      done: true,
    });
  } else {
    res.json({
      status: "200",
      folderexist: true,
      done: false,
    });
  }
});

/*######################################################################
################################Codeplay Starts#########################
#######################################################################*/
/*function filterFileName(filename) {
  return filename.replace(/([^a-z0-9]+)/gi, '_').toLowerCase();
}*/

function filterWhitespaces(filename) {
  return filename.replace(/([ ]+)/gi, "_");
}

function fileNameHasIllegalCharacters(filename) {
  let match = filename.match(/([^a-z0-9-_ ]+)/gi);
  return !!(match && match.length);
}

function getFullCodeplayFilePath(userData, path) {
  return convertToSystemSlash(
    appRoot + "/Codeplay/" + userData.dir_path + "/" + path
  );
}
/*
function createProjectDirectory(userData, dirName) {
  if (!userData || !userData.dir_path) return false;
  var dir = convertToSystemSlash(
    appRoot + "/Codeplay/" + userData.dir_path + "/" + dirName
  );

  if (!fs.existsSync(dir)) {
    mkdirp.sync(dir);
    return true;
  } else {
    rimraf.sync(dir);
    mkdirp.sync(dir);
    return true;
  }
}

function deleteProjectDirectory(userData, dirName) {
  if (!userData || !userData.dir_path) return false;
  var dir = convertToSystemSlash(
    appRoot + "/Codeplay/" + userData.dir_path + "/" + dirName
  );
  rimraf.sync(dir);
  return true;
}

function renameProjectFile(userData, filePath, newName) {
  if (!userData || !userData.dir_path) return false;
  var path = convertToSystemSlash(
    appRoot + "/Codeplay/" + userData.dir_path + "/" + filePath
  );
  var newPath =
    path.substring(0, path.lastIndexOf(pathSeparator) + 1) + newName;
  try {
    fs.renameSync(path, newPath);
  } catch (e) {
    return false;
  }
  return true;
}

function deleteProjectFile(userData, filePath) {
  if (!userData || !userData.dir_path) return false;
  var path = convertToSystemSlash(
    appRoot + "/Codeplay/" + userData.dir_path + "/" + filePath
  );
  rimraf.sync(path);
  return true;
}

function createFolderInProject(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
    return "created";
  } else {
    return "already_exists";
  }
}
function createFileInProject(path) {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, "");
    return "created";
  } else {
    return "already_exists";
  }
}

function createDefaultScratchFile(dest) {
  var source = convertToSystemSlash(
    appRoot + "/server/misc/default_scratch_project.sb3"
  );
  fs.copyFileSync(source, dest);
  return "created";
}

router.post("/createProject", (req, res) => {
  var data = req.body;
  if (!data.name) {
    res.end();
    return;
  }
  var dirName = filterWhitespaces(data.name).toLowerCase();
  if (fileNameHasIllegalCharacters(dirName)) {
    res.end();
    return;
  }

  var dirCreated = false;
  var indexCreated = false;

  var projectDirPath;
  var indexPath;

  return verifyRequest(req)
    .then(userData => {
      return new Promise(function(resolve, reject) {
        conn.beginTransaction(function(err) {
          if (err) {
            reject(new Error("transaction_init_failure"));
          } else {
            new Promise(function(resolve1, reject1) {
              pool.query(
                "insert into projects(user_id, type, name, description, directory, created_at, updated_at) values(?,?,?,?,?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
                [userData.user_id, data.type, data.name, data.desc, dirName],
                function(err, result) {
                  if (err) {
                    if (err.code == "ER_DUP_ENTRY") {
                      reject1("duplicate_entry");
                    } else {
                      reject1("failed");
                    }
                  } else {
                    dirCreated = createProjectDirectory(userData, dirName);
                    if (dirCreated) {
                      projectDirPath = convertToSystemSlash(
                        appRoot +
                          "/Codeplay/" +
                          userData.dir_path +
                          "/" +
                          dirName
                      );
                      resolve1(result.insertId);
                    } else {
                      reject1();
                    }
                  }
                }
              );
            })
              .then(projectId => {
                // Create index.html file
                return new Promise(function(resolve2, reject2) {
                  var fileName;

                  switch (data.type) {
                    case "web":
                      fileName = "index.html";
                      break;
                    case "python":
                      fileName = "main.py";
                      break;
                    case "scratch":
                      fileName = "project.sb3";
                      break;
                  }
                  pool.query(
                    "insert into project_files (project_id, type, name, path, created_at, updated_at) values(?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
                    [projectId, "file", fileName, dirName],
                    function(err) {
                      if (err) {
                        reject2("failed3");
                      } else {
                        indexPath = getFullCodeplayFilePath(
                          userData,
                          dirName + "/" + fileName
                        );
                        indexCreated =
                          data.type == "scratch"
                            ? createDefaultScratchFile(indexPath)
                            : createFileInProject(indexPath);
                        if (indexCreated == "created") {
                          resolve2();
                        } else {
                          reject2();
                        }
                      }
                    }
                  );
                });
              })
              .then(() => {
                conn.commit(function(err) {
                  if (err) {
                    return conn.rollback(function(err) {
                      reject(new Error("rollback_failed"));
                    });
                  } else {
                    resolve();
                  }
                });
              })
              .catch(err => {
                var failureReason = err;
                if (dirCreated) rimraf.sync(projectDirPath);
                if (indexCreated) rimraf.sync(indexPath);
                return conn.rollback(function(err) {
                  reject(new Error(failureReason));
                });
              });
          }
        });
      });
    })
    .then(() => {
      res.end();
    })
    .catch(err => {
      if (err.message) res.status(400).send(err.message);
      else res.status(400).send("failed");
    });
});

router.get("/getRecentProjects", (req, res) => {
  return verifyRequest(req)
    .then(userData => {
      return new Promise(function(resolve, reject) {
        pool.query(
          "select * from projects where user_id=? order by updated_at desc limit 4",
          [userData.user_id],
          function(err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          }
        );
      });
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      if (err && err.message) res.status(400).send(err.message);
      else res.status(400).send("failed");
    });
});

router.get("/getAllProjects", (req, res) => {
  return verifyRequest(req)
    .then(userData => {
      return new Promise(function(resolve, reject) {
        pool.query(
          "select * from projects where user_id=? order by name asc",
          [userData.user_id],
          function(err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          }
        );
      });
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      if (err && err.message) res.status(400).send(err.message);
      else res.status(400).send("failed");
    });
});

router.get("/getCommunityProjects", (req, res) => {
//console.log(req.headers);
  var offset = req.headers.query_offset;
  return new Promise(function(resolve, reject) {
    pool.query(
      `select
      projects.project_id,
      projects.user_id,
      projects.name,
      projects.description,
      projects.type,
      cv_users.name as user_name
      from projects
      inner join cv_users
      on cv_users.user_id=projects.user_id
      order by projects.created_at desc
      limit 8
      offset ${offset}`,
      function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      if (err && err.message) res.status(400).send(err.message);
      else res.status(400).send("failed");
    });
});

router.post("/deleteProject", (req, res) => {
  if (!req.body.projectId) {
    res.status(400).end();
    return;
  }
  return verifyRequest(req)
    .then(userData => {
      return new Promise(function(resolve, reject) {
        conn.beginTransaction(function(err) {
          if (err) {
            reject(new Error("transaction_init_failure"));
          } else {
            new Promise(function(resolve1, reject1) {
              pool.query(
                "select * from projects where project_id=?",
                [req.body.projectId],
                function(err, data) {
                  if (err) {
                    reject1(err);
                  } else if (data.length) {
                    resolve1(data[0]);
                  }
                }
              );
            })
              .then(project => {
                return new Promise(function(resolve1, reject1) {
                  pool.query(
                    "delete from projects where project_id=?",
                    [req.body.projectId],
                    function(err) {
                      if (err) {
                        reject1("row_deletion_failed");
                      } else {
                        resolve1(project);
                      }
                    }
                  );
                });
              })
              .then(project => {
                return new Promise(function(resolve1, reject1) {
                  pool.query(
                    "delete from project_files where project_id=?",
                    [req.body.projectId],
                    function(err) {
                      if (err) {
                        reject1("row_deletion_failed");
                      } else {
                        var dirDeleted = deleteProjectDirectory(
                          userData,
                          project.directory
                        );
                        if (dirDeleted) {
                          resolve1();
                        } else {
                          reject1("row_deletion_failed");
                        }
                      }
                    }
                  );
                });
              })
              .then(() => {
                conn.commit(function(err) {
                  if (err) {
                    return conn.rollback(function(err) {
                      reject(new Error("rollback_failed"));
                    });
                  } else {
                    resolve();
                  }
                });
              })
              .catch(err => {
                var failureReason = err;
                return conn.rollback(function(err) {
                  reject(new Error(failureReason));
                });
              });
          }
        });
      });
    })
    .then(() => {
      res.end();
    })
    .catch(err => {
      if (err && err.message) res.status(400).send(err.message);
      else res.status(400).send("failed");
    });
});

router.post("/renameProject", (req, res) => {
  // TODO check if project is owned by current user
  if (!req.body.projectId || !req.body.newName) {
    res.status(400).end();
    return;
  }
  var originalDirectoryName;
  var newDirectoryName = filterWhitespaces(req.body.newName).toLowerCase();
  if (fileNameHasIllegalCharacters(newDirectoryName)) {
    res.end();
    return;
  }
  return verifyRequest(req)
    .then(userData => {
      return new Promise(function(resolve, reject) {
        conn.beginTransaction(function(err) {
          if (err) {
            reject(new Error("transaction_init_failure"));
          } else {
            new Promise(function(resolve1, reject1) {
              pool.query(
                "select * from projects where project_id=?",
                [req.body.projectId],
                function(err, data) {
                  if (err || !data.length) {
                    reject1("project_not_found");
                  } else {
                    originalDirectoryName = data[0].directory;
                    resolve1();
                  }
                }
              );
            })
              .then(() => {
                return new Promise(function(resolve1, reject1) {
                  pool.query(
                    "update projects set name=?, directory=? where project_id=?",
                    [req.body.newName, newDirectoryName, req.body.projectId],
                    function(err, data) {
                      if (err) {
                        if (err.code == "ER_DUP_ENTRY") {
                          reject1("duplicate_entry");
                        } else {
                          reject1("error");
                        }
                      } else {
                        resolve1();
                      }
                    }
                  );
                });
              })
              .then(() => {
                return new Promise(function(resolve1, reject1) {
                  var originalPath = convertToSystemSlash(
                    appRoot +
                      "/Codeplay/" +
                      userData.dir_path +
                      "/" +
                      originalDirectoryName
                  );
                  var newPath =
                    originalPath.substring(
                      0,
                      originalPath.lastIndexOf(pathSeparator) + 1
                    ) + newDirectoryName;
                  try {
                    fs.renameSync(originalPath, newPath);
                    resolve1();
                  } catch (e) {
                    reject1("failed_to_rename");
                  }
                });
              })
              .then(() => {
                return new Promise(function(resolve1, reject1) {
                  pool.query(
                    "update project_files set path=regexp_replace(path, ?, ?) where project_id=?",
                    [
                      "^" + originalDirectoryName,
                      newDirectoryName,
                      req.body.projectId
                    ],
                    function(err) {
                      if (err) {
                        reject1("failed_to_rename");
                      } else {
                        resolve1();
                      }
                    }
                  );
                });
              })
              .then(() => {
                return runSqlQueryAsyncUpdate(
                  "update projects set updated_at=CURRENT_TIMESTAMP where project_id in (?)",
                  [req.body.projectId]
                );
              })
              .then(() => {
                conn.commit(function(err) {
                  if (err) {
                    return conn.rollback(function(err) {
                      reject("rollback_failed");
                    });
                  } else {
                    resolve();
                  }
                });
              })
              .catch(err => {
                var failureReason = err;
                return conn.rollback(function(err) {
                  reject(failureReason);
                });
              });
          }
        });
      });
    })
    .then(() => {
      res.end();
    })
    .catch(err => {
      if (err) res.status(400).send(err);
      else res.status(400).send("failed");
    });
});

router.post("/getProjectInfo", (req, res) => {
  if (!req.body.projectId) {
    res.status(400).end();
    return;
  }
  return verifyRequest(req)
    .then(userData => {
      return new Promise(function(resolve, reject) {
        pool.query(
          "select * from projects where project_id=?",
          [req.body.projectId],
          function(err, data) {
            if (err || !data.length) {
              reject("not_found");
            } else {
              resolve([userData, data[0]]);
            }
          }
        );
      });
    })
    .then(result => {
      var data = result[1];
      data.projectPath = getRelativePathFromFullPath(
        getFullCodeplayFilePath(result[0], result[1].directory)
      );
      res.json(data);
    })
    .catch(err => {
      if (err && err.message) res.status(400).send(err.message);
      else res.status(400).send("failed");
    });
});

router.post("/createProjectFile", (req, res) => {
  if (!req.body.projectId || !req.body.type || !req.body.name) {
    res.status(400).end();
    return;
  }
  return verifyRequest(req)
    .then(userData => {
      return new Promise(function(resolve, reject) {
        conn.beginTransaction(function(err) {
          if (err) {
            reject(new Error("transaction_init_failure"));
          } else {
            new Promise(function(resolve1, reject1) {
              if (req.body.parentId) {
                pool.query(
                  "select * from project_files where file_id=?",
                  [req.body.parentId],
                  function(err, data) {
                    if (err || !data.length) {
                      reject1("failed1");
                    } else if (data.length) {
                      var parentData = data[0];
                      var parents =
                        (parentData.parents ? parentData.parents + "," : "") +
                        req.body.parentId;
                      var path = parentData.path + "/" + parentData.name;
                      pool.query(
                        "insert into project_files (project_id, type, parent, parents, name, path, created_at, updated_at) values(?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
                        [
                          req.body.projectId,
                          req.body.type,
                          req.body.parentId,
                          parents,
                          req.body.name,
                          path
                        ],
                        function(err) {
                          if (err) {
                            reject1("failed2");
                          } else {
                            var fullPath = getFullCodeplayFilePath(
                              userData,
                              path + "/" + req.body.name
                            );
                            if (req.body.type == "folder") {
                              var created = createFolderInProject(fullPath);
                              if (created == "created") {
                                resolve1();
                              } else {
                                reject1(created); // Already exists
                              }
                            } else if (req.body.type == "file") {
                              var created = createFileInProject(fullPath);
                              if (created == "created") {
                                resolve1();
                              } else {
                                reject1(created); // Already exists
                              }
                            }
                          }
                        }
                      );
                    }
                  }
                );
              } else {
                // This case happens when we user is trying to create a file/folder in the project's root
                pool.query(
                  "select * from projects where project_id=?",
                  [req.body.projectId],
                  function(err, data) {
                    if (err || !data.length) {
                      reject1("failed0");
                    } else if (data.length) {
                      var projectData = data[0];
                      var path = projectData.directory;
                      pool.query(
                        "insert into project_files (project_id, type, name, path) values(?, ?, ?, ?)",
                        [
                          req.body.projectId,
                          req.body.type,
                          req.body.name,
                          path
                        ],
                        function(err) {
                          if (err) {
                            reject1("failed3");
                          } else {
                            // Create file
                            var fullPath = getFullCodeplayFilePath(
                              userData,
                              projectData.directory + "/" + req.body.name
                            );
                            if (req.body.type == "folder") {
                              var created = createFolderInProject(fullPath);
                              if (created == "created") {
                                resolve1();
                              } else {
                                reject1(created); // Already exists
                              }
                            } else if (req.body.type == "file") {
                              var created = createFileInProject(fullPath);
                              if (created == "created") {
                                resolve1();
                              } else {
                                reject1(created); // Already exists
                              }
                            }
                          }
                        }
                      );
                    }
                  }
                );
              }
            })
              .then(() => {
                return runSqlQueryAsyncUpdate(
                  "update projects set updated_at=CURRENT_TIMESTAMP where project_id in (?)",
                  [req.body.projectId]
                );
              })
              .then(() => {
                conn.commit(function(err) {
                  if (err) {
                    return conn.rollback(function(err) {
                      reject(new Error("rollback_failed"));
                    });
                  } else {
                    resolve();
                  }
                });
              })
              .catch(err => {
                var failureReason = err;
                return conn.rollback(function(err) {
                  reject(new Error(failureReason));
                });
              });
          }
        });
      });
    })
    .then(() => {
      res.end();
    })
    .catch(err => {
      if (err && err.message) res.status(400).send(err.message);
      else res.status(400).send("failed");
    });
});

router.post("/renameProjectFile", (req, res) => {
  if (!req.body.fileId || !req.body.name) {
    res.status(400).end();
    return;
  }
  var filePath;
  var filePathNew;
  var projectId;

  return verifyRequest(req)
    .then(userData => {
      return new Promise(function(resolve, reject) {
        conn.beginTransaction(function(err) {
          if (err) {
            reject(new Error("transaction_init_failure"));
          } else {
            new Promise(function(resolve1, reject1) {
              pool.query(
                "select * from project_files where file_id=?",
                [req.body.fileId],
                function(err, data) {
                  if (err || !data.length) {
                    reject1("failed");
                  } else {
                    projectId = data[0].project_id;
                    var fileData = data[0];
                    filePath = fileData.path + "/" + fileData.name;
                    filePathNew = fileData.path + "/" + req.body.name;
                    resolve1();
                  }
                }
              );
            })
              .then(() => {
                pool.query(
                  "update project_files set name=? where file_id=?",
                  [req.body.name, req.body.fileId],
                  function(err) {
                    if (err) {
                      throw new Error("failed");
                    } else {
                    }
                  }
                );
              })
              .then(() => {
                // Rename paths in all children files
                pool.query(
                  "update project_files set path=regexp_replace(path, ?, ?) where find_in_set(?, parents)",
                  ["^" + filePath, filePathNew, req.body.fileId],
                  function(err) {
                    if (err) {
                      throw new Error("failed");
                    } else {
                    }
                  }
                );
              })
              .then(() => {
                var renamed = renameProjectFile(
                  userData,
                  filePath,
                  req.body.name
                );
                if (!renamed) {
                  throw new Error("failed_to_rename");
                }
              })
              .then(() => {
                return runSqlQueryAsyncUpdate(
                  "update projects set updated_at=CURRENT_TIMESTAMP where project_id in (?)",
                  [projectId]
                );
              })
              .then(() => {
                conn.commit(function(err) {
                  if (err) {
                    return conn.rollback(function(err) {
                      reject(new Error("rollback_failed"));
                    });
                  } else {
                    resolve();
                  }
                });
              })
              .catch(err => {
                var failureReason = err;
                return conn.rollback(function(err) {
                  reject(new Error(failureReason));
                });
              });
          }
        });
      });
    })
    .then(() => {
      res.end();
    })
    .catch(err => {
      console.log(err);
      if (err && err.message) res.status(400).send(err.message);
      else res.status(400).send("failed");
    });
});

router.post("/deleteProjectFile", (req, res) => {
  if (!req.body.id) {
    res.status(400).end();
    return;
  }
  var projectId;
  return verifyRequest(req)
    .then(userData => {
      return new Promise(function(resolve, reject) {
        conn.beginTransaction(function(err) {
          if (err) {
            reject(new Error("transaction_init_failure"));
          } else {
            new Promise(function(resolve1, reject1) {
              pool.query(
                "select * from project_files where file_id=?",
                [req.body.id],
                function(err, data) {
                  if (err && !data.length) {
                    reject1("file_not_found");
                  } else if (data.length) {
                    projectId = data[0].project_id;
                    resolve1(data[0]);
                  }
                }
              );
            })
              .then(file => {
                return new Promise(function(resolve1, reject1) {
                  if (file.name == "index.html") {
                    reject1("row_deletion_failed");
                  } else {
                    pool.query(
                      "delete from project_files where file_id=? or find_in_set(?, parents) ",
                      [req.body.id, req.body.id],
                      function(err) {
                        if (err) {
                          throw new Error(err.code);
                        } else {
                          var deleted = deleteProjectFile(
                            userData,
                            file.path + "/" + file.name
                          );
                          if (deleted) {
                            resolve1();
                          } else {
                            reject1("row_deletion_failed");
                          }
                        }
                      }
                    );
                  }
                });
              })
              .then(() => {
                return runSqlQueryAsyncUpdate(
                  "update projects set updated_at=CURRENT_TIMESTAMP where project_id in (?)",
                  [projectId]
                );
              })
              .then(() => {
                conn.commit(function(err) {
                  if (err) {
                    return conn.rollback(function(err) {
                      reject(new Error("rollback_failed"));
                    });
                  } else {
                    resolve();
                  }
                });
              })
              .catch(err => {
                var failureReason = err;
                return conn.rollback(function(err) {
                  reject(new Error(failureReason));
                });
              });
          }
        });
      });
    })
    .then(() => {
      res.end();
    })
    .catch(err => {
      if (err && err.message) res.status(400).send(err.message);
      else res.status(400).send("failed");
    });
});

router.post("/getProjectRootContent", (req, res) => {
  if (!req.body.projectId) {
    res.status(400).end();
    return;
  }
  return verifyRequest(req).then(userData => {
    pool.query(
      "select * from project_files where project_id=? and parents is NULL",
      [req.body.projectId, ""],
      function(err, data) {
        if (err) {
          res.status(400).end();
        } else {
          res.json(data);
        }
      }
    );
  });
});

router.post("/getProjectFiles", (req, res) => {
  if (!req.body.projectId) {
    res.status(400).end();
    return;
  }
  return verifyRequest(req).then(userData => {
    pool.query(
      "SELECT * FROM `project_files` WHERE project_id=? ORDER BY type DESC, name",
      [req.body.projectId],
      function(err, data) {
        if (err) {
          res.status(400).end();
        } else {
          res.json(data);
        }
      }
    );
  });
});

router.post("/getProjectFileContent", (req, res) => {
  if (!req.body.id) {
    res.status(400).end();
    return;
  }
  return verifyRequest(req)
    .then(userData => {
      return new Promise((resolve, reject) => {
        pool.query(
          "SELECT * FROM `project_files` WHERE file_id=?",
          [req.body.id],
          function(err, data) {
            if (err || !data.length) {
              reject();
            } else {
              resolve(
                getFullCodeplayFilePath(
                  userData,
                  data[0].path + "/" + data[0].name
                )
              );
            }
          }
        );
      });
    })
    .then(filePath => {
      fs.readFile(filePath, "utf8", function(err, data) {
        if (err) {
          throw new Error("failed");
        }
        res.send(data.replace(/\r/g, ""));
      });
    })
    .catch(err => {
      if (err && err.message) res.status(400).send(err.message);
      else res.status(400).send("failed");
    });
});

router.post("/saveProjectFiles", (req, res) => {
  var data = req.body;
  return verifyRequest(req)
    .then(userData => {
      var fileIds = new Array();
      var projectId = -1;
      for (var fileId in data.files) {
        fileIds.push(fileId);
      }
      return new Promise(function(resolve, reject) {
        conn.beginTransaction(function(err) {
          if (err) {
            reject(new Error("transaction_init_failure"));
          } else {
            new Promise(function(resolve1, reject1) {
              pool.query(
                "select * from project_files where file_id in (?)",
                [fileIds],
                function(err, result) {
                  if (err || !result.length) {
                    reject();
                  } else {
                    projectId = result[0].project_id;
                    for (var i = 0; i < result.length; i++) {
                      var fullFilePath = getFullCodeplayFilePath(
                        userData,
                        result[i].path + "/" + result[i].name
                      );
                      fs.writeFileSync(
                        fullFilePath,
                        data.files[result[i].file_id]
                      );
                    }
                    resolve1();
                  }
                }
              );
            })
              .then(() => {
                return runSqlQueryAsyncUpdate(
                  "update projects set updated_at=CURRENT_TIMESTAMP where project_id in (?)",
                  [projectId]
                );
              })
              .then(() => {
                return runSqlQueryAsyncUpdate(
                  "update project_files set updated_at=CURRENT_TIMESTAMP where file_id in (?)",
                  [fileIds]
                );
              })
              .then(result => {
                if (result.err) {
                  throw new Error("failed");
                }
                conn.commit(function(err) {
                  if (err) {
                    return conn.rollback(function(err) {
                      reject(new Error("rollback_failed"));
                    });
                  } else {
                    resolve();
                  }
                });
              })
              .catch(err => {
                var failureReason = err;
                return conn.rollback(function(err) {
                  reject(new Error(failureReason));
                });
              });
          }
        });
      });
    })
    .then(() => {
      res.end();
    })
    .catch(err => {
      if (err && err.message) res.status(400).send(err.message);
      else res.status(400).send("failed");
    });
});

router.post("/saveScratchProject", (req, res) => {
  
  //Scratch project file names are always in this form
  //  project_folder_name.sb3
  
  //console.log(req.body);
  var projectId = req.headers.project_id;
  var fileName = "project.sb3";
  if (!projectId) {
    res.status(400).end();
    return;
  }
  return verifyRequest(req)
    .then(userData => {
      return new Promise(function(resolve, reject) {
        conn.beginTransaction(function(err) {
          if (err) {
            reject(new Error("transaction_init_failure"));
          } else {
            new Promise((resolve1, reject1) => {
              pool.query(
                "select * from projects where project_id=?",
                [projectId],
                (err, result) => {
                  if (err || !result.length) {
                    throw new Error("failed");
                  } else {
                    var dirPath = stripTrailingSlash(
                      getFullCodeplayFilePath(userData, result[0].directory)
                    );
                    resolve1({
                      path: result[0].directory,
                      fullDirPath: dirPath
                    });
                  }
                }
              );
            })
              .then(parentData => {
                return new Promise((resolve2, reject2) => {
                  var diskStorage = multer.diskStorage({
                    destination: function(req, file, cb) {
                      cb(null, parentData.fullDirPath);
                    },
                    filename: function(req, file, cb) {
                      cb(null, fileName);
                    }
                  });
                  var upload = multer({ storage: diskStorage }).any();
                  upload(req, res, function(err) {
                    if (err) {
                      reject2(err.message);
                    } else {
                      resolve2();
                    }
                  });
                });
              })
              .then(() => {
                return runSqlQueryAsyncUpdate(
                  "update project_files set updated_at=CURRENT_TIMESTAMP where project_id=?",
                  [projectId]
                );
              })
              .then(() => {
                return runSqlQueryAsyncUpdate(
                  "update projects set updated_at=CURRENT_TIMESTAMP where project_id in (?)",
                  [projectId]
                );
              })
              .then(() => {
                conn.commit(function(err) {
                  if (err) {
                    return conn.rollback(function(err) {
                      reject(new Error("rollback_failed"));
                    });
                  } else {
                    resolve();
                  }
                });
              })
              .catch(err => {
                return conn.rollback(function(err1) {
                  reject(err);
                });
              });
          }
        });
      });
    })
    .then(() => {
      res.end();
    })
    .catch(err => {
      console.log(err);
      if (err) res.status(400).send(err);
      else res.status(400).send("failed");
    });
});

router.post("/uploadProjectFile", (req, res) => {
  var projectId = req.headers.project_id;
  var parentFolderId = req.headers.parent_folder_id
    ? req.headers.parent_folder_id
    : null;
  var fileName;
  return verifyRequest(req)
    .then(userData => {
      return new Promise(function(resolve, reject) {
        conn.beginTransaction(function(err) {
          if (err) {
            reject(new Error("transaction_init_failure"));
          } else {
            new Promise((resolve1, reject1) => {
              if (parentFolderId) {
                // Uploading to a folder inside a project
                pool.query(
                  "select * from project_files where file_id=?",
                  [parentFolderId],
                  (err, result) => {
                    if (err || !result.length) {
                      throw new Error("failed");
                    } else {
                      var dirPath = stripTrailingSlash(
                        getFullCodeplayFilePath(userData, result[0].path)
                      );
                      result[0].fullDirPath = dirPath;
                      resolve1(result[0]);
                    }
                  }
                );
              } else {
                // Uploading to the root of a project
                pool.query(
                  "select * from projects where project_id=?",
                  [projectId],
                  (err, result) => {
                    if (err || !result.length) {
                      throw new Error("failed");
                    } else {
                      var dirPath = stripTrailingSlash(
                        getFullCodeplayFilePath(userData, result[0].directory)
                      );
                      resolve1({
                        path: result[0].directory,
                        fullDirPath: dirPath
                      });
                    }
                  }
                );
              }
            })
              .then(parentData => {
                return new Promise((resolve2, reject2) => {
                  var diskStorage = multer.diskStorage({
                    destination: function(req, file, cb) {
                      cb(null, parentData.fullDirPath);
                    },
                    filename: function(req, file, cb) {
                      fileName = file.originalname;
                      var fullFilePath = convertToSystemSlash(
                        parentData.fullDirPath + "/" + fileName
                      );
                      if (fs.existsSync(fullFilePath)) {
                        cb(new Error("already_exists"));
                      } else {
                        cb(null, fileName);
                      }
                    }
                  });
                  var upload = multer({ storage: diskStorage }).any();
                  upload(req, res, function(err) {
                    if (err) {
                      reject2(err.message);
                    } else {
                      var parents = null; // = parentFolderId && parentData.parents ? parentData.parents + ',' + parentFolderId : null;
                      if (parentFolderId) {
                        if (parentData.parents) {
                          parents = parentData.parents + "," + parentFolderId;
                        } else {
                          parents = parentFolderId;
                        }
                      }
                      var parentPath = parentData.path;
                      pool.query(
                        "insert into project_files (project_id, type, parent, parents, name, path, created_at, updated_at) values(?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
                        [
                          projectId,
                          "file",
                          parentFolderId,
                          parents,
                          fileName,
                          parentPath
                        ],
                        error => {
                          if (err) {
                            reject2("failed");
                          } else {
                            resolve2();
                          }
                        }
                      );
                    }
                  });
                });
              })
              .then(() => {
                return runSqlQueryAsyncUpdate(
                  "update projects set updated_at=CURRENT_TIMESTAMP where project_id in (?)",
                  [projectId]
                );
              })
              .then(() => {
                conn.commit(function(err) {
                  if (err) {
                    return conn.rollback(function(err) {
                      reject(new Error("rollback_failed"));
                    });
                  } else {
                    resolve();
                  }
                });
              })
              .catch(err => {
                return conn.rollback(function(err1) {
                  reject(err);
                });
              });
          }
        });
      });
    })
    .then(() => {
      res.end();
    })
    .catch(err => {
      if (err) res.status(400).send(err);
      else res.status(400).send("failed");
    });
});
*/
//Load user directory
router.post("/Load_dir", (req, res, next) => {
  var params = req.body;
  var endPath = "/Codeplay/" + params.rootPath;
  var dirStruct = getDirectoryTree(path.resolve(appRoot + endPath));
  res.json({ status: "200", dirStruct: dirStruct });
});

router.post("/loadAllStudentsProjects", (req, res, next) => {
  var params = req.body;
  if (params.role_id == 2) {
    var projStruct = getDirectoryTree(
      path.resolve(appRoot + "/Codeplay/" + params.rootPath.split("/")[0])
    );
    projStruct.name = "Students Projects";
    res.json({ status: "200", studentsTree: projStruct });
  } else {
    res.json({ status: "200" });
  }
});

var getDirectoryTree = function(fullDirPath) {
  files = fs.readdirSync(fullDirPath);
  var rootDir = {};
  rootDir.name = "My Files";
  var dirContent = getDirectoryContent(stripTrailingSlash(fullDirPath));
  sortDirectoryContent(dirContent);
  rootDir.type = "dir";
  rootDir.path = convertToForwardSlash(stripAppRoot(fullDirPath));
  rootDir.content = dirContent;
  return rootDir;
};

function getDirectoryContent(fullDirPath) {
  files = fs.readdirSync(fullDirPath);
  var dirContent = [];
  files.forEach(function(file) {
    var fullFilePath = path.resolve(fullDirPath + pathSeparator + file);
    if (fs.statSync(fullFilePath).isDirectory()) {
      content = getDirectoryContent(fullFilePath);
      dirContent.push({
        name: file,
        type: "dir",
        content: content,
        path: convertToForwardSlash(stripAppRoot(fullFilePath)),
      });
    } else {
      if (!isZipFile(fullFilePath)) {
        dirContent.push({
          name: file,
          type: "file",
          path: convertToForwardSlash(stripAppRoot(fullFilePath)),
        });
      }
    }
  });
  return dirContent;
}

function sortDirectoryContent(directoryContent) {
  function compareFolderOrFile(a, b) {
    if (a.type == "file" && b.type == "dir") return 1;
  }
  directoryContent.sort(compareFolderOrFile);
  directoryContent.forEach(function(item) {
    if (item.type == "dir") {
      sortDirectoryContent(item.content);
    }
  });
}

function appendDir(pathh, dirName) {
  if (hasTrailingSlash(pathh)) return path.resolve(pathh + dirName);
  else return path.resolve(pathh + pathSeparator + dirName);
}

function getDirName(pathh) {
  return pathh.substring(pathh.lastIndexOf(pathSeparator) + 1, pathh.length);
}

function stripTrailingSlash(string) {
  if (string.charAt(string.length - 1) == pathSeparator)
    return string.substring(0, string.length - 1);
  else return string;
}

function stripAppRoot(pathh) {
  return pathh.substr(appRoot.length);
}

function convertToForwardSlash(pathh) {
  return pathh.replace(/\\/g, "/");
}

function convertToSystemSlash(pathh) {
  // Convert file path to have either \ or / depending on the OS
  if (pathSeparator == "/") {
    return pathh.replace(/\\/g, "/");
  } else if (pathSeparator == "\\") {
    return pathh.replace(/\//g, "\\");
  }
}

function hasTrailingSlash(string) {
  return string.charAt(string.length - 1) == pathSeparator;
}

function getRelativePathFromFullPath(fullFilePath) {
  return convertToForwardSlash(stripAppRoot(fullFilePath));
}

function isZipFile(filePath) {
  let extensionRegex = /\.zip$/;
  return extensionRegex.test(filePath);
}

// End Load user directory

//Reading file content
router.post("/Read_file", (req, res, next) => {
  var params = req.body;
  var fullFilePath = convertToSystemSlash(params.file_path);
  if (fullFilePath.indexOf(appRoot) < 0) {
    fullFilePath = appRoot + fullFilePath;
  }
  fs.readFile(fullFilePath, "utf8", function(err, data) {
    if (err) throw err;
    res.json({
      status: "200",
      data: data,
    });
  });
});

//Creating new file
router.post("/Create_file", (req, res, next) => {
  var params = req.body;
  var fullFilePath = convertToSystemSlash(
    params.file_path + pathSeparator + params.filename
  );
  if (fullFilePath.indexOf(appRoot) < 0) {
    fullFilePath = appRoot + fullFilePath;
  }
  fs.writeFile(fullFilePath, "", function(err) {
    if (err) {
    } else {
      res.json({
        status: "200",
        data: "done",
      });
    }
  });
});

//Saving files
router.post("/Save_file", (req, res, next) => {
  var params = req.body;
  var fullFilePath = convertToSystemSlash(params.file_path);
  if (fullFilePath.indexOf(appRoot) < 0) {
    fullFilePath = appRoot + fullFilePath;
  }
  fs.writeFile(fullFilePath, params.content, function(err) {
    if (err) {
    } else {
      res.json({
        status: "200",
      });
    }
  });
});

//Creating new folder
router.post("/Create_folder", (req, res, next) => {
  var params = req.body;
  var dir = convertToSystemSlash(
    params.folder_path + pathSeparator + params.foldername
  );
  if (dir.indexOf(appRoot) < 0) {
    dir = appRoot + dir;
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    res.json({
      status: "200",
      success: 1,
    });
  } else {
    res.json({
      status: "200",
      success: 0,
    });
  }
});

//Copy and paste files
router.post("/Replace_file", (req, res, next) => {
  var params = req.body;
  var srcPath = convertToSystemSlash(params.editOptions[0].itemSrcPath);
  var editType = params.editOptions[0].editType;
  var destPath = convertToSystemSlash(params.itemDestPath);

  if (srcPath.indexOf(appRoot) < 0) {
    srcPath = appRoot + srcPath;
  }

  if (destPath.indexOf(appRoot) < 0) {
    destPath = appRoot + destPath;
  }

  if (editType == "copy") {
    return copyItem(srcPath, destPath)
      .then(() => {
        res.json({
          result: "success",
        });
      })
      .catch((err) => {
        if (err.message.indexOf("exists") >= 0) {
          res.json({
            result: "exists",
          });
        } else {
          res.json({
            result: "failed",
          });
        }
      });
  } else if (editType == "cut") {
    return moveItem(srcPath, destPath)
      .then(() => {
        res.json({
          result: "success",
        });
      })
      .catch((err) => {
        if (err.message.indexOf("exists") >= 0) {
          res.json({
            result: "exists",
          });
        } else {
          res.json({
            result: "failed",
          });
        }
      });
  }
});

//moving files and folders
function moveItem(srcPath, destPath) {
  return fs.move(srcPath, appendDir(destPath, getDirName(srcPath)), {
    overwrite: false,
    errorOnExist: true,
  });
}
//copying files and folders
function copyItem(srcPath, destPath) {
  return fs.copy(srcPath, appendDir(destPath, getDirName(srcPath)), {
    overwrite: false,
    errorOnExist: true,
  });
}

//Deleting folder
router.post("/Delete_folder", (req, res, next) => {
  var params = req.body;
  var fs = require("fs");
  var dir = convertToSystemSlash(params.item_path);
  if (dir.indexOf(appRoot) < 0) {
    dir = appRoot + dir;
  }

  rimraf(dir, (error) => {
    if (!error) {
      res.json({
        status: "200",
        success: 1,
      });
    } else {
      res.json({
        status: "200",
        success: 0,
      });
    }
  });
});

//Renaming files
router.post("/Rename_item", (req, res, next) => {
  var params = req.body;
  var fs = require("fs");
  var itemPath = convertToSystemSlash(params.item_path);
  if (itemPath.indexOf(appRoot) < 0) {
    itemPath = appRoot + itemPath;
  }
  var dirpath = itemPath.substring(0, itemPath.lastIndexOf(pathSeparator) + 1);
  var newPath = dirpath + params.item_name;

  //root folder name can not be changed
  if (
    params.item_path.indexOf(params.root_path) + params.root_path.length !=
    params.item_path.length
  ) {
    //check if root folders name try to change
    fs.rename(itemPath, newPath, function(err) {
      if (!err) {
        res.json({
          status: "200",
          success: 1,
        });
      } else {
        res.json({
          status: "200",
          success: 0,
        });
      }
    });
  }
});

//Download folders
router.get("/download_zip", (req, res, next) => {
  var params = req.body;
  var fs = require("fs");
  var itemPath = convertToSystemSlash(req.query.item_path);
  if (itemPath.indexOf(appRoot) < 0) {
    itemPath = appRoot + itemPath;
  }
  var outputFilePath;

  if (fs.statSync(itemPath).isDirectory()) {
    outputFilePath = itemPath + ".zip";
    zipDirectory(itemPath, outputFilePath)
      .then(() => {
        res.download(outputFilePath, function(error) {
          rimraf(outputFilePath, (error) => {});
        });
      })
      .catch(() => {});
  }
});

function zipDirectory(source, out) {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on("error", (err) => reject(err))
      .pipe(stream);

    stream.on("close", () => resolve());
    archive.finalize();
  });
}

//uploading files
router.post("/Upload_files", (req, res, next) => {
  var uploadPath = convertToSystemSlash(req.headers.upload_path);
  if (uploadPath.indexOf(appRoot) < 0) {
    uploadPath = appRoot + uploadPath;
  }
  var diskStorage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    },
  });
  var upload = multer({ storage: diskStorage }).any();
  upload(req, res, function(err) {
    if (err) {
      return res.end("Error uploading file.");
    }
    res.end("File is uploaded");
  });
});

/************************School Course Curriculum */
router.post("/get_user_course", (req, res) => {
  let params = req.body;
  pool.query(
    "select role_id from cv_users where user_id=?",
    [params.user_id],
    function(err, dataa) {
      if (dataa[0].role_id == 3) {
        pool.query(
          "SELECT books.book_name,books.book_id,books.slug,round(((select COUNT(*) from st_book where st_book.book_id = books.book_id and st_id=? group by st_book.book_id )/(select COUNT(*) from book_pages where book_pages.book_id = books.book_id group by book_pages.book_id ))*100) 'per' from books INNER join books_price on (books_price.book_id =books.book_id) where books_price.sch_course=1 and books_price.for_grade in (SELECT cls_id from cv_users inner join cv_st_detail on (cv_st_detail.user_id = cv_users.user_id) where cv_users.user_id=? and books_price.visible=1)",
          [params.user_id, params.user_id],
          function(err, data) {
            res.send(data);
          }
        );
      } else if (dataa[0].role_id == 2 || dataa[0].role_id == 1) {
        pool.query(
          "SELECT books.book_name,books.book_id,books.slug,round(((select COUNT(*) from st_book where st_book.book_id = books.book_id and st_id=? group by st_book.book_id )/(select COUNT(*) from book_pages where book_pages.book_id = books.book_id group by book_pages.book_id ))*100) 'per' from books INNER join books_price on (books_price.book_id =books.book_id) where books_price.sch_course=1 and books_price.for_grade in (SELECT cls_id from cv_school_classes left join cv_users on (cv_users.sch_id =cv_school_classes.sch_id) where cv_users.user_id=?) and books_price.visible =1 order by books.book_group",
          [params.user_id, params.user_id],
          function(err, data) {
            res.send(data);
          }
        );
      }
    }
  );
});
/*********End School Courses Curriculum */

/*######################################################################
################################LMS Starts#########################
#######################################################################*/

router.post("/getTeacherClasses", (req, res) => {
  let params = req.body;
  pool.query(
    "SELECT cls_id FROM `cv_school_classes` WHERE sch_id=? order by cls_id",
    [params.sch_id],
    function(err, data) {
      res.send(data);
    }
  );
});
router.post("/get_product_review", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT product_feedback.obt_rat,product_feedback.max_rat,product_feedback.message,case when products.product_type='quiz' then quiz.quiz_name when products.product_type='course' THEN books.book_name end 'product_name',cv_users.name,cv_users.profile_pic,cv_users.user_id from product_feedback left join books on books.product_id = product_feedback.product_id left join cv_users on cv_users.user_id =product_feedback.user_id left join products on products.product_id = product_feedback.product_id left join quiz on quiz.product_id = products.product_id where product_feedback.product_id=? order by product_feedback.obt_rat desc",
    [params.product_id],
    function(err, data) {
      if (!err) {
        res.json({
          status: 200,
          data: data,
        });
      } else console.log(err);
    }
  );
});
router.post("/UdateUserData", (req, res) => {
  var params = req.body;
  console.log(params);
  if (params.email == 1) {
    pool.query(
      "UPDATE `cv_users` SET `contact`=? where user_id =?",
      [params.phone, params.user_id],
      function(err, result) {
        if (!err) {
          res.json({
            status: 200,
            data: result,
          });
        } else {
          console.log(err);
        }
      }
    );
  } else {
    pool.query(
      "select email FROM `cv_users` WHERE cv_users.email=?",
      [params.email],
      function(err, data) {
        if (data && data.length) {
          res.json({
            status: 200,
            data: "0",
          });
        } else {
          pool.query(
            "UPDATE `cv_users` SET `contact`=?,`email`=? where user_id =?",
            [params.phone, params.email, params.user_id],
            function(err, result) {
              if (!err) {
                res.json({
                  status: 200,
                  data: result,
                });
              } else {
                console.log(err);
              }
            }
          );
        }
      }
    );
  }
});
router.post("/curnt_read", (req, res) => {
  var params = req.body;
  page_id = params.page_id;
  st_id = params.st_id;
  topic_id = params.topic_id;
  book_id = params.book_id;
  pool.query(
    "select count(*) as cnt from st_book where page_id=? and st_id=? and topic_id=?",
    [params.page_id, params.st_id, params.topic_id],
    function(err, data) {
      if (err) {
      } else {
        if (data[0].cnt > 0) {
          pool.query(
            "UPDATE st_book SET status=? where st_id=? and page_id=? ",
            ["1", params.st_id, params.page_id],
            function(err, result1, fields) {
              if (err) {
                throw err;
              } else {
                res.json({
                  status: "200",
                  data: result1,
                });
              }
            }
          );
        } else {
          pool.query(
            "INSERT INTO st_book(page_id,st_id,status,book_id,topic_id) values(?,?,?,?,?) ",
            [
              params.page_id,
              params.st_id,
              "1",
              params.book_id,
              params.topic_id,
            ],
            function(err, result, fields) {
              if (err) {
                throw err;
              } else {
                res.json({
                  status: "200",
                  data: result,
                });
              }
            }
          );
        }
      }
    }
  );
});

//nav_class
router.post("/download_cls_file", (req, res) => {
  var params = req.body; //get sch_id
  pool.query(
    "SELECT cls_id FROM `cv_school_classes` WHERE sch_id=? order by cv_school_classes.cls_id",
    [params.sch_id],
    function(err, result1, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: result1,
        });
      }
    }
  );
});
//searchTopics
router.post("/DisplaySearchTopics", (req, res) => {
  var params = req.body;
  var search_text = params.search_text;

  if (search_text != "") {
    // var query ="SELECT book_pages.page_name,book_pages.page_id,book_title.slug as 'title_slug',book_title.topic_name,books.book_name,books.slug as 'book_slug',books.book_name,book_title.topic_name FROM `book_pages` left join book_title on book_pages.topic_id= book_title.topic_id left join books on book_pages.book_id = books.book_id WHERE book_pages.page_name REGEXP '" +search_text +"'";
    var query =
      // "SELECT book_pages.page_name,book_pages.page_id,book_title.slug as 'title_slug',book_title.topic_name,books.book_name,books.slug as 'book_slug',books.book_name,book_title.topic_name, CASE WHEN cv_st_detail.cls_id =4 THEN 'html' WHEN cv_st_detail.cls_id =5 THEN 'css' WHEN cv_st_detail.cls_id =6 THEN 'javascript' WHEN cv_st_detail.cls_id =7 THEN 'sql' WHEN cv_st_detail.cls_id =8 THEN 'python' WHEN cv_st_detail.cls_id=9 THEN 'python' WHEN cv_st_detail.cls_id=10 THEN 'python' ELSE '' END AS 'st_subject' FROM `book_pages` left join book_title on book_pages.topic_id= book_title.topic_id left join books on book_pages.book_id = books.book_id left join cv_st_detail on cv_st_detail.user_id='" +
      "SELECT book_pages.page_name,book_pages.page_id,book_title.slug as 'title_slug',book_title.topic_name,books.book_name,books.slug as 'book_slug',books.book_name,book_title.topic_name, CASE WHEN cv_st_detail.cls_id =4 || cv_st_detail.cls_id =5 THEN 'html&css'  WHEN cv_st_detail.cls_id =6 THEN 'javascript' WHEN cv_st_detail.cls_id =7 THEN 'sql' WHEN cv_st_detail.cls_id =8 THEN 'python' WHEN cv_st_detail.cls_id=9 THEN 'python' WHEN cv_st_detail.cls_id=10 THEN 'python' ELSE '' END AS 'st_subject' FROM `book_pages` left join book_title on book_pages.topic_id= book_title.topic_id left join books on book_pages.book_id = books.book_id left join cv_st_detail on cv_st_detail.user_id='" +
      params.user_id +
      "' WHERE book_pages.page_name REGEXP '" +
      search_text +
      "'";

    pool.query(query, function(err, result1, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: result1,
        });
      }
    });
  } else {
    res.json({
      status: "200",
      data: "",
    });
  }
});

//end search topic
//update topic
router.post("/update_topic", (req, res) => {
  var params = req.body;
  pool.query(
    "update `book_pages` set page_name=? where page_id=?",
    [params.topic_name, params.topic_id],
    function(err, result1, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: result1,
        });
      }
    }
  );
});

//delete daat
router.post("/delete_data", (req, res) => {
  var params = req.body;
  pool.query(
    "DELETE FROM `book_pages` WHERE page_id=?",
    [params.sub_topic_id],
    function(err, data) {
      if (err) {
      } else {
        pool.query(
          "Delete FROM `st_book` where page_id=?",
          [params.sub_topic_id],
          function(err, data) {
            if (err) {
            } else {
              pool.query(
                "select count(*) as cnt from book_pages where topic_id=?",
                [params.topic_id],
                function(err, data2) {
                  if (err) {
                  } else {
                    if (data2[0].cnt == 0) {
                      pool.query(
                        "DELETE FROM  book_title where topic_id=?",
                        [params.topic_id],
                        function(err, data2) {
                          if (err) {
                          } else {
                            res.json({
                              status: "200",
                              data: 1,
                            });
                          }
                        }
                      );
                    } else {
                      res.json({
                        status: "200",
                        data: 2,
                      });
                    }
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});
router.post("/insert_data", (req, res) => {
  var params = req.body;
  var topic_id = params.topic_id;
  if (topic_id == "new_topic") {
    pool.query(
      "select  topic_id  from book_title where book_id=? and topic_name=? group by topic_id",
      [params.book_id, params.topic_name],
      function(err, datas) {
        if (err) {
          throw err;
        } else {
          if (datas && datas.length) {
            res.json({
              status: "200",
              data: "Already inserted.",
            });
          } else {
            pool.query(
              "INSERT INTO `book_title`(`book_id`, `topic_name` ,`slug`)values(?,?,?) ",
              [
                params.book_id,
                params.topic_name,
                params.topic_name.toLowerCase(),
              ],
              function(err, result, fields) {
                if (err) {
                  throw err;
                } else {
                  var topic_id = "";
                  pool.query(
                    "select topic_id  from book_title where book_id=? and topic_name=?",
                    [params.book_id, params.topic_name],
                    function(err, data) {
                      if (err) {
                        throw err;
                      } else {
                        topic_id = data[0].topic_id;
                        pool.query(
                          "INSERT INTO `book_pages`(`page_name`,`book_id`, `topic_id`, `content`,`slug`) values(?,?,?,?,?)",
                          [
                            params.sub_topic,
                            params.book_id,
                            topic_id,
                            params.book_data,
                            params.sub_topic.toLowerCase(),
                          ],
                          function(err, result1, fields) {
                            if (err) {
                              throw err;
                            } else {
                              res.json({
                                status: "200",
                                data: "Successfully Inserted.", //result,
                              });
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          }
        }
      }
    );
  } else {
    var sub_topic_id = params.sub_topic_id;

    if (sub_topic_id == "new_sub_topic") {
      var sub_topic = params.sub_topic;

      pool.query(
        "select page_id from book_pages where book_id=? and topic_id=? and page_name=?",
        [params.book_id, params.topic_id, sub_topic],
        function(err, datas) {
          if (err) {
            throw err;
          } else {
            if (datas.length) {
              topic_id = datas[0].page_id;
              res.json({
                status: "200",
                data: "Already inserted.",
              });
            } else {
              pool.query(
                "INSERT INTO `book_pages`(`page_name`,`slug`,`book_id`, `topic_id`, `content`) values(?,?,?,?,?)",
                [
                  params.sub_topic,
                  params.sub_topic.toLowerCase(),
                  params.book_id,
                  params.topic_id,
                  params.book_data,
                ],
                function(err, result1, fields) {
                  if (err) {
                    throw err;
                  } else {
                    res.json({
                      status: "200",
                      data: "Successfully Inserted.", //result1,
                    });
                  }
                }
              );
            }
          }
        }
      );
    } else {
      pool.query(
        "UPDATE `book_pages` SET `content`=? where page_id=?",
        [params.book_data, params.sub_topic_id],
        function(err, result11, fields) {
          if (err) {
            throw err;
          } else {
            res.json({
              status: "200",
              data: "Successfully Updated.",
            });
          }
        }
      );
    }
  }
});
router.post("/DisplayAdminBooksName", (req, res) => {
  pool.query(
    "SELECT * FROM `books` INNER join books_price on (books_price.book_id =books.book_id)",
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: result,
        });
      }
    }
  );
});

router.post("/Displaybooksname", (req, res) => {
  pool.query(
    "SELECT * FROM `books` INNER join books_price on (books_price.book_id =books.book_id) where books_price.visible=1",
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: result,
        });
      }
    }
  );
});

router.post("/UpdateBookPrice", (req, res) => {
  let params = req.body;
  pool.query(
    "Update `books` INNER join books_price on (books.book_id =books_price.book_id) SET books.price=?,books_price.discount=?,books_price.actual_price=?,books_price.dis_price=? where books.book_id=?",
    [
      params.new_price,
      params.discount,
      params.actual_price,
      params.actual_price - params.new_price,
      params.book_id,
    ],
    (err, data) => {
      res.send(data);
    }
  );
});
router.post("/DisplaySubTopics", (req, res) => {
  var params = req.body;
  //"SELECT book_pages.page_id,book_pages.page_id,book_pages.book_id,book_pages.page_name,book_pages.topic_id,book_pages.chapter_id,book_pages.content,st_book.status FROM book_pages left join st_book on (book_pages.page_id = st_book.page_id and st_id=? ) where book_pages.topic_id=(select topic_id from book_title where slug=? and book_id=(select book_id from books where slug=? )) order by book_pages.page_id"
  var query, param;
  if (params.st_id == 0) {
    query =
      "select * from (SELECT book_pages.page_id,book_pages.book_id,book_pages.page_name,book_pages.topic_id,book_pages.chapter_id,book_pages.content,st_book.status,book_title.topic_name,book_title.slug 'topic_slug' FROM book_pages left join st_book on (book_pages.page_id = st_book.page_id and st_id=?) left join book_title on (book_pages.topic_id = book_title.topic_id) where book_pages.topic_id=(select topic_id from book_title where slug=? and book_id=(select book_id from books where slug=? )) and book_title.visible=1 and book_pages.visible=1 order by book_pages.page_id) t where topic_slug =(SELECT slug from book_title where book_title.book_id = t.book_id order by book_title.topic_id ASC limit 1 )";
    param = [params.st_id, params.topic_name, params.book_name];
  } else {
    query =
      "SELECT books_price.sch_course,books_price.for_grade,(case WHEN books_price.sch_course=1 then (books_price.for_grade in (SELECT cls_id from cv_school_classes where cv_school_classes.sch_id in (SELECT sch_id from cv_users where cv_users.user_id=?))) else null end) 'for_sch_curriculum', book_pages.page_id,book_pages.page_id,book_pages.book_id,book_pages.page_name,book_pages.topic_id,book_pages.chapter_id,book_pages.content,st_book.status,book_title.topic_name FROM book_pages left join st_book on (book_pages.page_id = st_book.page_id and st_id=?) left join book_title on (book_pages.topic_id = book_title.topic_id) inner join books on(books.book_id =book_title.book_id) inner join books_price on (books_price.book_id = books.book_id) where book_pages.topic_id=(select topic_id from book_title where slug=? and book_title.visible=1 and book_pages.visible=1 and book_id=(select book_id from books where slug=?)) order by book_pages.page_id";
    //"SELECT books.sch_course,books.for_grade,(case WHEN books.sch_course=1 then (books.for_grade in (SELECT cls_id from cv_school_classes where cv_school_classes.sch_id in (SELECT sch_id from cv_users where cv_users.user_id=?))) else null end) 'for_sch_curriculum', book_pages.page_id,book_pages.page_id,book_pages.book_id,book_pages.page_name,book_pages.topic_id,book_pages.chapter_id,book_pages.content,st_book.status,book_title.topic_name FROM book_pages left join st_book on (book_pages.page_id = st_book.page_id and st_id=?) left join book_title on (book_pages.topic_id = book_title.topic_id) inner join books on(books.book_id =book_title.book_id) where book_pages.topic_id=(select topic_id from book_title where slug=? and book_id=(select book_id from books where slug=?)) order by book_pages.page_id";

    param = [params.st_id, params.st_id, params.topic_name, params.book_name];
  }
  pool.query(query, param, function(err, result, fields) {
    if (err) {
      throw err;
    } else {
      res.json({
        status: "200",
        data: result,
      });
    }
  });
});

router.post("/DisplaySubTopicss", (req, res) => {
  var params = req.body;
  //pool.query("SELECT book_pages.page_id,book_pages.book_id,book_pages.page_name,book_pages.topic_id,book_pages.chapter_id,book_pages.content,st_book.status,quiz_que.question,quiz_que.description,quiz_que.true_ans FROM book_pages  left join st_book on (book_pages.page_id = st_book.page_id and st_id=? ) left join quiz_que on (book_pages.page_id = quiz_que.page_id)  where book_pages.topic_id = ?",[params.st_id,params.book_id],function (err, result, fields) {
  pool.query(
    "SELECT book_pages.page_id,book_pages.page_id,book_pages.book_id,book_pages.page_name,book_pages.topic_id,book_pages.chapter_id,book_pages.content FROM book_pages where book_pages.topic_id=? order by book_pages.page_id",
    [params.topic_id],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: result,
        });
      }
    }
  );
});

router.post("/Displaybooks", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT book_pages.page_id,book_pages.book_id,book_pages.topic_id,book_pages.chapter_id,book_title.topic_name as title,book_pages.content,st_book.status FROM book_pages left join book_title on (book_title.topic_id = book_pages.topic_id) left join st_book on (book_pages.page_id = st_book.page_id and st_id=? )  where book_pages.book_id = ? order by book_pages.page_id",
    [params.st_id, params.book_id],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: result,
        });
      }
    }
  );
});

router.post("/DisplaySubTopicCont", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT content from book_pages where page_id = ?",
    [params.sub_topic_id],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: result,
        });
      }
    }
  );
});

router.post("/next_topic", (req, res) => {
  var params = req.body;
  let next_topic_id = parseInt(params.current_topic_id) + 1;
  pool.query(
    "SELECT book_title.topic_id, book_title.book_id, `topic_name`, book_title.slug 'topic_slug',min(book_pages.page_id) 'page_id',books.slug 'book_slug' FROM `book_title` left join book_pages on book_pages.topic_id = book_title.topic_id join books on books.book_id = book_title.book_id WHERE  book_title.topic_id=? and book_title.book_id=?",
    [next_topic_id, params.book_id],
    function(err, data) {
      if (!err) {
        res.json({
          status: 200,
          data: data,
        });
      } else {
        console.log(err);
      }
    }
  );
});
/***other course */
router.post("/DisplayOtherTopics", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT books.book_id,books.book_name,book_title.topic_id,book_title.topic_name from book_title inner join books on (books.book_id=book_title.book_id and books.slug=?) where book_title.topic_id in (SELECT topic_id from other_course_content where other_course_content.content_type='video') and book_title.sch_id in(SELECT sch_id from cv_users where cv_users.user_id=?) or book_title.sch_id in (select sch_id from other_course_business_module where find_in_set((SELECT sch_id from cv_users where cv_users.user_id=?),other_course_business_module.other_sch_id))",
    [params.slug, params.user_id, params.user_id],
    function(err, data) {
      if (err) console.log(err);
      else {
        res.send(data);
      }
    }
  );
});
router.post("/DisplayByteTopics", (req, res) => {
  let params = req.body;
  console.log(params);
  pool.query(
    "SELECT byte_size_courses.byte_course_name 'book_name',byte_size_courses.byte_course_id, `topic_id`, `byte_size_course_id`, `topic_name`, `topic_slug`, `content`, `type`, `visible`, `quiz_id` FROM `byte_size_course_topics` left join byte_size_courses on (byte_size_courses.byte_course_id =byte_size_course_topics.byte_size_course_id) where byte_size_courses.byte_course_slug=?",
    [params.slug],
    (err, data) => {
      if (err) console.log(err);
      else res.send(data);
    }
  );
});
router.post("/DisplayDOtherTopics", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT books.book_id,books.book_name,book_title.topic_id,book_title.topic_name from book_title inner join books on (books.book_id=book_title.book_id and books.slug=?) where book_title.topic_id in (SELECT topic_id from other_course_content where other_course_content.content_type='document') and book_title.sch_id in (SELECT sch_id from cv_users where cv_users.user_id=?) or book_title.sch_id in (select sch_id from other_course_business_module where find_in_set((SELECT sch_id from cv_users where cv_users.user_id=?),other_course_business_module.other_sch_id))",
    [params.slug, params.user_id, params.user_id],
    function(err, data) {
      if (err) console.log(err);
      else {
        res.send(data);
      }
    }
  );
});

router.post("/DisplayAllOFSubTopics", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT other_course_content.* FROM `other_course_content` inner join books on (books.book_id = other_course_content.book_id and other_course_content.content_type='document') WHERE books.slug=? and other_course_content.sch_id in (SELECT sch_id from cv_users where cv_users.user_id=?) or other_course_content.sch_id in (select sch_id from other_course_business_module where find_in_set((SELECT sch_id from cv_users where cv_users.user_id=?),other_course_business_module.other_sch_id))",
    [params.slug, params.user_id, params.user_id],
    function(err, data) {
      if (err) console.log(err);
      else {
        res.send(data);
      }
    }
  );
});

router.post("/DisplayAllOVSubTopics", (req, res) => {
  var params = req.body;
  //console.log(params);
  pool.query(
    "SELECT other_course_content.* FROM `other_course_content` inner join books on (books.book_id = other_course_content.book_id and other_course_content.content_type='video') WHERE books.slug=? and other_course_content.sch_id in (SELECT sch_id from cv_users where cv_users.user_id=?) or other_course_content.sch_id in (select sch_id from other_course_business_module where find_in_set((SELECT sch_id from cv_users where cv_users.user_id=?),other_course_business_module.other_sch_id))",
    [params.slug, params.user_id, params.user_id],
    function(err, data) {
      if (err) console.log(err);
      else {
        //console.log(data);
        res.send(data);
      }
    }
  );
});
router.post("/getOSCourseDetails", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT books.course_description, books.book_name,books.slug,books.book_id,books.product_id,books_price.sch_course,books_price.book_summary,books_price.description,books_price.learn,books_price.prerequisite from books inner join books_price on (books_price.book_id = books.book_id) where  books.slug=?",
    [params.slug],
    function(err, data) {
      if (err) console.log(err);
      else res.send(data);
    }
  );
});
router.post("/InsertQAQuestion", (req, res) => {
  var params = req.body;
  pool.query(
    "INSERT INTO `course_qa`(`book_id`, `user_id`, `question_topic`, `question_title`, `question_description`, `response_qa_id`) VALUES (?,?,?,?,?,?)",
    [
      params.book_id,
      params.user_id,
      params.question_topic,
      params.question_title,
      params.question_description,
      0,
    ],
    function(err, data) {
      if (err) console.log(err);
      else res.send(data);
    }
  );
});
router.post("/InsertQRQuestion", (req, res) => {
  var params = req.body;
  pool.query(
    "INSERT INTO `course_qa`(`book_id`, `user_id`, `question_topic`, `question_title`, `question_description`, `response_qa_id`) VALUES (?,?,?,?,?,?)",
    [
      params.book_id,
      params.user_id,
      params.question_topic,
      params.question_title,
      params.question_description,
      params.qa_id,
    ],
    function(err, data) {
      if (err) console.log(err);
      else res.send(data);
    }
  );
});
router.post("/getOtherCourseAskedQuestions", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT course_qa.qa_id,course_qa.user_id,course_qa.question_topic,course_qa.question_title,course_qa.question_description,course_qa.response_qa_id,DATE_FORMAT(course_qa.question_time, '%W %D %M %Y') 'date',cv_users.name,(case when cv_users.role_id=1 then 'School Admin' when cv_users.role_id=2 then 'Teacher' when cv_users.role_id=3 then 'Student' end) 'role' FROM `course_qa` INNER join cv_users on (cv_users.user_id =course_qa.user_id) where course_qa.book_id=?",
    [params.book_id],
    function(err, data) {
      if (err) {
        console.log(err);
      } else res.send(data);
    }
  );
});
/****End other course */
router.post("/DisplayTopics", (req, res) => {
  var params = req.body;

  pool.query(
    //"SELECT books.book_name,books.slug 'book_slug',books.product_id,books.level,books_price.sch_course,books_price.age_group,books_price.book_summary,books_price.description,books_price.learn,books_price.prerequisite,books_price.actual_price,books_price.for_grade,products.product_type,books.prod_info,books.price,bp.slug,bp.topic_id,bp.topic_name,bp.slug 'topic_slug',bp.topic_id,bp.book_id,(select count(topic_id) from book_pages as bpp where book_id=bp.book_id and bp.topic_id=bpp.topic_id group by topic_id) as total_subtopic,ROUND(((select count(topic_id) from st_book as sb where sb.book_id=bp.book_id and bp.topic_id=sb.topic_id and st_id=? group by topic_id)*100/(select count(topic_id) from book_pages as bpp where book_id=bp.book_id and bp.topic_id=bpp.topic_id and bpp.visible=1 group by topic_id))) as per,(SELECT orders.status from orders where orders.product_id =books.product_id  and  orders.user_id =? order by orders.order_id desc limit 1) 'purchases_status',(SELECT sch_id from cv_users where cv_users.user_id=?)'sch_id',ROUND(((select count(topic_id) from st_book as sb where sb.book_id=bp.book_id and st_id=?)*100/(select count(topic_id) from book_pages as bpp where book_id=bp.book_id and visible=1))) as tot_per,(select count(topic_id) from book_pages as bpp where book_id=bp.book_id and bpp.visible=1) as tot_sub_topic,(SELECT count(topic_id) from book_title as bt where book_id =bp.book_id and bt.visible=1) as tot_topic FROM `book_title` as bp  inner join books on (bp.book_id = books.book_id) INNER join books_price on(books_price.book_id = books.book_id) inner join products on (products.product_id =books.product_id) left join orders on (orders.product_id = products.product_id) where books.slug=? and books_price.visible=1 and bp.visible=1 and  bp.book_id=(select books.book_id from books INNER JOIN books_price on (books_price.book_id = books.book_id) where books_price.visible=1 and bp.visible =1 and books.slug=? and books_price.for_grade=0 or books_price.for_grade in (SELECT cls_id from cv_school_classes where sch_id in (SELECT sch_id from cv_users where cv_users.user_id=?)) limit 1) group by bp.topic_id order by bp.topic_id",
    //"SELECT * FROM (SELECT books.book_name,books.slug 'book_slug',books.product_id,books.level,books_price.sch_course,books_price.age_group,books_price.book_summary,books_price.description,books_price.learn,books_price.prerequisite,books_price.actual_price,books_price.for_grade,products.product_type,books.prod_info,books.price,bp.slug,bp.topic_id,bp.topic_name,bp.slug 'topic_slug',bp.book_id,(select count(topic_id) from book_pages as bpp where book_id=bp.book_id and bp.topic_id=bpp.topic_id group by topic_id) as total_subtopic,ROUND(((select count(topic_id) from st_book as sb where sb.book_id=bp.book_id and bp.topic_id=sb.topic_id and st_id=? group by topic_id)*100/(select count(topic_id) from book_pages as bpp where book_id=bp.book_id and bp.topic_id=bpp.topic_id and bpp.visible=1 group by topic_id))) as per,(SELECT orders.status from orders where orders.product_id =books.product_id  and  orders.user_id =? order by orders.order_id desc limit 1) 'purchases_status',(SELECT sch_id from cv_users where cv_users.user_id=?)'sch_id',(SELECT role_id from cv_users where cv_users.user_id=?) 'role_id',ROUND(((select count(topic_id) from st_book as sb where sb.book_id=bp.book_id and st_id=?)*100/(select count(topic_id) from book_pages as bpp where book_id=bp.book_id and visible=1))) as tot_per,(select count(topic_id) from book_pages as bpp where book_id=bp.book_id and bpp.visible=1) as tot_sub_topic,(SELECT count(topic_id) from book_title as bt where book_id =bp.book_id and bt.visible=1) as tot_topic FROM book_title as bp inner join books on (books.book_id =bp.book_id) INNER join books_price on (books_price.book_id =books.book_id) inner join products on(products.product_id = books.product_id) where books.slug =? and books_price.visible=1 and bp.visible=1)t where (SELECT orders.status from orders where orders.product_id =t.product_id and orders.status=1 and orders.user_id=?) IS NOT NULL or (case WHEN (t.role_id=3 and t.for_grade<>0) then t.for_grade in (SELECT cv_st_detail.cls_id from cv_st_detail INNER join cv_users on (cv_users.user_id =cv_st_detail.user_id) where cv_users.user_id=?) when ((t.role_id=2 or t.role_id=1)and t.for_grade<>0) then t.for_grade in (SELECT cv_school_classes.cls_id from cv_school_classes left join cv_users on(cv_users.sch_id = cv_school_classes.sch_id and cv_users.user_id=?)) end)",
    //latest query "SELECT * FROM (SELECT books.book_name,books.slug 'book_slug',books.product_id,books.level,books_price.sch_course,books_price.age_group,books_price.book_summary,books_price.description,books_price.learn,books_price.prerequisite,books_price.actual_price,books_price.for_grade,products.product_type,books.prod_info,books.price,bp.slug,bp.topic_id,bp.topic_name,bp.slug 'topic_slug',bp.book_id,(select count(topic_id) from book_pages as bpp where book_id=bp.book_id and bp.topic_id=bpp.topic_id group by topic_id) as total_subtopic,ROUND(((select count(topic_id) from st_book as sb where sb.book_id=bp.book_id and bp.topic_id=sb.topic_id and st_id=? group by topic_id)*100/(select count(topic_id) from book_pages as bpp where book_id=bp.book_id and bp.topic_id=bpp.topic_id and bpp.visible=1 group by topic_id))) as per,(SELECT orders.status from orders where orders.product_id =books.product_id  and  orders.user_id =? order by orders.order_id desc limit 1) 'purchases_status',(SELECT sch_id from cv_users where cv_users.user_id=?)'sch_id',(SELECT cv_offerings.curriculum_course from cv_offerings inner join cv_school_detail on (cv_school_detail.cv_pid =cv_offerings.cv_pid) where cv_school_detail.sch_id =(SELECT sch_id FROM cv_users WHERE cv_users.user_id=?)) 'course_available',(SELECT role_id from cv_users where cv_users.user_id=?) 'role_id',ROUND(((select count(topic_id) from st_book as sb where sb.book_id=bp.book_id and st_id=?)*100/(select count(topic_id) from book_pages as bpp where book_id=bp.book_id and visible=1))) as tot_per,(select count(topic_id) from book_pages as bpp where book_id=bp.book_id and bpp.visible=1) as tot_sub_topic,(SELECT count(topic_id) from book_title as bt where book_id =bp.book_id and bt.visible=1) as tot_topic FROM book_title as bp inner join books on (books.book_id =bp.book_id) INNER join books_price on (books_price.book_id =books.book_id) inner join products on(products.product_id = books.product_id) where books.slug =? and books_price.visible=1 and bp.visible=1)t where (SELECT orders.status from orders where orders.product_id =t.product_id and orders.status=1 and orders.user_id=?) IS NOT NULL or (case WHEN (t.role_id=3 and t.for_grade<>0) then t.for_grade in (SELECT cv_st_detail.cls_id from cv_st_detail INNER join cv_users on (cv_users.user_id =cv_st_detail.user_id) where cv_users.user_id=?) when ((t.role_id=2 or t.role_id=1)and t.for_grade<>0) then t.for_grade in (SELECT cv_school_classes.cls_id from cv_school_classes left join cv_users on(cv_users.sch_id = cv_school_classes.sch_id and cv_users.user_id=?)) end) and t.course_available=1",
    "SELECT * FROM (SELECT books.book_name,books.img,books.slug 'book_slug',books.product_id,books.level,books_price.sch_course,books_price.age_group,books_price.book_summary,books_price.description,books_price.learn,books_price.prerequisite,books_price.actual_price,books_price.for_grade,products.product_type,books.prod_info,books.price,bp.slug,bp.topic_id,bp.topic_name,bp.slug 'topic_slug',bp.book_id,(select count(topic_id) from book_pages as bpp where book_id=bp.book_id and bp.topic_id=bpp.topic_id group by topic_id) as total_subtopic,(select count(topic_id) from st_book as stb where stb.book_id=bp.book_id and stb.topic_id=bp.topic_id and  stb.st_id=? group by stb.topic_id) 'st_read_topic',ROUND(((select count(topic_id) from st_book as sb where sb.book_id=bp.book_id and bp.topic_id=sb.topic_id and st_id=? group by topic_id)*100/(select count(topic_id) from book_pages as bpp where book_id=bp.book_id and bp.topic_id=bpp.topic_id and bpp.visible=1 group by topic_id))) as per,(SELECT orders.status from orders where orders.product_id =books.product_id  and  orders.user_id =? order by orders.order_id desc limit 1) 'purchases_status',(SELECT sch_id from cv_users where cv_users.user_id=?)'sch_id',(SELECT cv_offerings.curriculum_course from cv_offerings inner join cv_school_detail on (cv_school_detail.cv_pid =cv_offerings.cv_pid) where cv_school_detail.sch_id =(SELECT sch_id FROM cv_users WHERE cv_users.user_id=?)) 'course_available',(SELECT role_id from cv_users where cv_users.user_id=?) 'role_id',ROUND(((select count(topic_id) from st_book as sb where sb.book_id=bp.book_id and st_id=?)*100/(select count(topic_id) from book_pages as bpp where book_id=bp.book_id and visible=1))) as tot_per,(select count(topic_id) from book_pages as bpp where book_id=bp.book_id and bpp.visible=1) as tot_sub_topic,(SELECT count(topic_id) from book_title as bt where book_id =bp.book_id and bt.visible=1) as tot_topic FROM book_title as bp inner join books on (books.book_id =bp.book_id) INNER join books_price on (books_price.book_id =books.book_id) inner join products on(products.product_id = books.product_id) where books.slug =? and books_price.visible=1 and bp.visible=1)t where t.for_grade =0 or (case WHEN (t.role_id=3 and t.for_grade<>0) then t.for_grade in (SELECT cv_st_detail.cls_id from cv_st_detail INNER join cv_users on (cv_users.user_id =cv_st_detail.user_id) where cv_users.user_id=?) when ((t.role_id=2 or t.role_id=1)and t.for_grade<>0) then t.for_grade in (SELECT cv_school_classes.cls_id from cv_school_classes left join cv_users on(cv_users.sch_id = cv_school_classes.sch_id and cv_users.user_id=?)) end) and t.course_available=1",
    [
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.slug,
      params.user_id,
      //params.user_id,
      params.user_id,
    ],
    function(err, result, fields) {
      //SELECT books.book_name,bp.slug,bp.topic_id,bp.topic_name,bp.topic_id,bp.book_id,(select count(topic_id) from book_pages as bpp where book_id=bp.book_id and bp.topic_id=bpp.topic_id group by topic_id) as total_subtopic,ROUND(((select count(topic_id) from st_book as sb where sb.book_id=bp.book_id and bp.topic_id=sb.topic_id and st_id=? group by topic_id)*100/(select count(topic_id) from book_pages as bpp where book_id=bp.book_id and bp.topic_id=bpp.topic_id group by topic_id))) as per FROM `book_title` as bp left join books on bp.book_id = books.book_id Where bp.book_id=(select book_id from books where books.slug=? limit 1) group by bp.topic_id order by bp.topic_id
      //console.log(result);
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: result,
        });
      }
    }
  );
});
router.post("/DisplayAllotedClasses", (req, res) => {
  var params = req.body;
  pool.query(
    "select DISTINCT * from cv_alloted_class where sch_id in (select sch_id from cv_users where user_id=?)",
    [params.user_id],
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      } else {
        console.log(err);
      }
    }
  );
});
//subTopics
router.post("/DisplayAllSubTopics", (req, res) => {
  var params = req.body;
  pool.query(
    // "SELECT book_pages.page_id,book_pages.page_id,book_pages.book_id,book_pages.page_name,book_pages.topic_id,st_book.status,books.course_description,books.book_cover_content_url	FROM book_pages left join books on (book_pages.book_id = books.book_id) left join st_book on (book_pages.page_id = st_book.page_id and st_id=?) where book_pages.visible=1 and book_pages.book_id=(select book_id from books where slug=? order by book_pages.page_id)  order by book_pages.page_id",
    "SELECT book_pages.page_id,book_pages.page_id,book_pages.book_id,book_pages.page_name,book_pages.topic_id,st_book.status,books.course_description,books.book_cover_content_url	FROM book_pages left join books on (book_pages.book_id = books.book_id) INNER join books_price on (books_price.book_id = books.book_id) left join st_book on (book_pages.page_id = st_book.page_id and st_id=?) where book_pages.visible=1 and books_price.visible=1 and book_pages.book_id=(select book_id from books where slug=? order by book_pages.page_id)  order by book_pages.page_id",
    [params.user_id, params.slug],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: result,
        });
      }
    }
  );
});
router.post("/DisplayTopicss", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT book_title.*,books.price,books_price.actual_price,books_price.discount,books_price.sch_course,books_price.for_grade FROM `book_title` INNER join books on (books.book_id =book_title.book_id) inner join books_price on (books_price.book_id =books.book_id) WHERE book_title.book_id=?",
    [params.book_id],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: result,
        });
      }
    }
  );
});

/*router.post("/DisplayQuizTypes", (req, res) => {
  pool.query("SELECT * FROM `quiz_type`", function(err, result, fields) {
    if (err) {
      throw err;
    } else {
      res.json({
        status: "200",
        data: result
      });
    }
  });
});*/

//end lms
/*############################################################################
########################## QUIZ #########################################
*/
/*############################################################################
########################## QUIZ #########################################
*/
router.post("/DisplayQuizTypeForQuiz", (req, res) => {
  pool.query("Select * from quiz_type", function(err, result, fields) {
    if (err) {
      throw err;
    } else {
      ////console.log(result);
      res.json({
        status: "200",
        data: result,
      });
    }
  });
});

router.post("/update_inst_permission", (req, res) => {
  let params = req.body;
  pool.query(
    "UPDATE `quiz` SET `public_institute`=? WHERE quiz_id=? and user_id=?",
    [params.publish_institute, params.quiz_id, params.user_id],
    (err, data) => {
      res.send(data);
    }
  );
});
router.post("/update_admininst_permission", (req, res) => {
  let params = req.body;

  pool.query(
    "update `quiz` SET `public_institute` =? WHERE quiz_id=?",
    [params.publish_institute, params.quiz_id],
    (err, data) => {
      res.send(data);
    }
  );
});
router.post("/get_teacher_all_questions", (req, res) => {
  var params = req.body;
  pool.query(
    "select questions_for_quiz.*,(SELECT count(que_id) from quiz_question where quiz_question.que_id = questions_for_quiz.que_id group by quiz_question.que_id) 'used_times' from questions_for_quiz left join quiz_question on questions_for_quiz.que_id = quiz_question.que_id left join quiz on quiz_question.quiz_id = quiz.quiz_id where quiz.user_id =?",
    [params.user_id],
    function(err, data, fields) {
      if (err) {
        throw err;
      } else {
        //console.log(data);
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

router.post("/quiz_result_questions", (req, res) => {
  var param = req.body;
  pool.query(
    "SELECT * FROM `st_quiz_result` WHERE quiz_id=? and user_id=?",
    [param.quiz_id, param.user_id],
    function(err, data) {
      if (err) console.log(err);
      else res.send(data);
    }
  );
});
router.post("/quiz_particular_quiz_result_detail", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT case when  cv_users.name IS NOT NULL then cv_users.name else 'Codevidhya' end 'name',quiz_subject.subject,t1.*,(select count(t21.user_id) 'total_students' from  (select t11.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id) t11 group by t11.user_id,t11.quiz_id) t21 where t21.quiz_id=t1.quiz_id) 'total_attempted' from (SELECT sum(st_quiz_result.points) 'obtained',quiz.user_id 'quiz_user_id',(SELECT COUNT(*) from st_quiz_result s where s.quiz_id =st_quiz_result.quiz_id and s.user_id=?) 'attempted_que',(SELECT COUNT(*) from st_quiz_result s where s.quiz_id =? and s.user_id=? and s.points<>0) 'correct_que',(SELECT COUNT(*) from st_quiz_result s where s.quiz_id =? and s.user_id=? and s.points = 0) 'wrong_que',(SELECT COUNT(*) from quiz_question s where s.quiz_id =st_quiz_result.quiz_id) 'total_que',(SELECT sum(points) from quiz_question s where s.quiz_id =st_quiz_result.quiz_id) 'total_points',quiz.quiz_id,quiz.quiz_name,quiz.quiz_img,quiz.quiz_desc,quiz.slug 'quiz_slug',(case when quiz.user_id=0 then 1 WHEN (quiz.visible=1 and quiz.public_permission=1) then 1 else 0 end) 'social_sharing',max(st_quiz_result.attempted_at) 'attempted_at',quiz.sub_id,quiz.user_id,quiz.visible,quiz.public_permission,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating' FROM `st_quiz_result` join quiz on (quiz.quiz_id = st_quiz_result.quiz_id and st_quiz_result.user_id=?) left join products on quiz.product_id =products.product_id where quiz.user_id!=? group by st_quiz_result.quiz_id  order by max(st_quiz_result.attempted_at) DESC)t1 left join quiz_subject on (quiz_subject.sub_id = t1.sub_id) left join cv_users on (t1.quiz_user_id = cv_users.user_id) where  t1.attempted_que = t1.total_que and t1.quiz_id =?",
    [
      params.user_id,
      params.quiz_id,
      params.user_id,
      params.quiz_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.quiz_id,
    ],
    function(err, data) {
      res.send(data);
    }
  );
});

router.post("/quiz_particular_quiz_detail", (req, res) => {
  var param = req.body;
  var startTime = process.hrtime();
  pool.query(
    //"SELECT quiz.quiz_id,quiz.sub_id,quiz.quiz_name,quiz.quiz_img,quiz.slug,quiz.quiz_desc,quiz.user_id,quiz.created_at,quiz.price,quiz.visible,quiz.product_id,(case WHEN cv_users.name THEN cv_users.name ELSE 'Codevidhya' end)  'name',orders.status,(select count(t21.user_id) 'total_students' from  (select t11.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id) t11 group by t11.user_id,t11.quiz_id) t21 where t21.quiz_id=quiz.quiz_id) 'total_attempted',(SELECT count(*) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_question',(SELECT sum(quiz_question.points)  from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_marks',quiz_subject.subject 'quiz_subject',(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = quiz.product_id) 'rating' FROM `quiz` left join products on (quiz.product_id = products.product_id) left join cv_users on (cv_users.user_id = quiz.user_id) left join quiz_subject on (quiz.sub_id = quiz_subject.sub_id) left join orders on (orders.product_id = quiz.product_id and orders.user_id = ?)  WHERE quiz_id=?",
    "SELECT quiz.quiz_id,quiz.sub_id,quiz.quiz_name,quiz.quiz_img,quiz.slug,quiz.quiz_desc,quiz.user_id,quiz.created_at,quiz.price,quiz.visible,quiz.product_id,(case when quiz.user_id=0 then 1 WHEN (quiz.visible=1 and quiz.public_permission=1) then 1 else 0 end) 'social_sharing',(case WHEN cv_users.name THEN cv_users.name ELSE 'Codevidhya' end)  'name',orders.status,(select count(t21.user_id) 'total_students' from  (select t11.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id) t11 group by t11.user_id,t11.quiz_id) t21 where t21.quiz_id=quiz.quiz_id) 'total_attempted',(SELECT count(*) from st_quiz_result where st_quiz_result.user_id=? and st_quiz_result.quiz_id=?)'question_attempted',(SELECT count(*) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_question',(SELECT sum(quiz_question.points)  from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_marks',quiz_subject.subject 'quiz_subject',(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = quiz.product_id) 'rating' FROM `quiz` left join products on (quiz.product_id = products.product_id) left join cv_users on (cv_users.user_id = quiz.user_id) left join quiz_subject on (quiz.sub_id = quiz_subject.sub_id) left join orders on (orders.product_id = quiz.product_id and orders.user_id = ? and orders.status IS NOT NULL)  WHERE quiz_id=? and quiz.public_institute=1",
    [param.user_id, param.quiz_id, param.user_id, param.quiz_id],
    function(err, data) {
      logQuery(startTime, "/api/user/quiz_particular_quiz_detail");
      res.send(data);
    }
  );
});
router.post("/get_all_questions", (req, res) => {
  pool.query(
    "select questions_for_quiz.*,(SELECT count(que_id) from quiz_question where quiz_question.que_id = questions_for_quiz.que_id group by quiz_question.que_id) 'used_times' from questions_for_quiz",
    function(err, data, fields) {
      if (err) {
        throw err;
      } else {
        //console.log(data);
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
//quizzes_rank
router.post("/get_oveall_rak", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT sum(points) 'obtained',user_id,quiz_id,@rank:=@rank+1 from st_quiz_result join( select @rank:=0) r GROUP by user_id order by sum(points) desc",
    [],
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
//get order quiz
router.post("/get_order_quiz", (req, res) => {
  pool.query(
    "SELECT quiz.quiz_name,quiz.quiz_id from orders join quiz on quiz.product_id = orders.product_id group by quiz.quiz_id",
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/get_order_course", (req, res) => {
  pool.query(
    "SELECT books.book_name,books.book_id from orders join books on books.product_id =orders.product_id GROUP by books.product_id;",
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
//get order detaio at admin side
router.post("/get_quiz_order", (req, res) => {
  pool.query(
    "SELECT orders.order_id,orders.price,products.product_type,orders.purchased_at,orders.email 'order_email',orders.contact_no 'order_phone_no',quiz.quiz_id,quiz.quiz_name,quiz.slug 'quiz_slug',books.book_name 'course_name',books.book_id,books.slug 'course_slug',cv_users.user_id,cv_users.name,cv_users.email,cv_users.contact,cv_school_detail.name 'school_name',(select count(orders.order_id) from orders where orders.status =1) 'total_orders',(SELECT count(*) FROM `orders` join products on products.product_id = orders.product_id WHERE products.product_type='quiz' and orders.status =1)'quiz_total',(SELECT count(*) FROM `orders` join products on products.product_id = orders.product_id WHERE products.product_type='course' and orders.status =1) 'course_total' from orders join products on orders.product_id = products.product_id left join quiz on quiz.product_id =products.product_id left join books on orders.product_id = books.product_id join cv_users on orders.user_id = cv_users.user_id join cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id where orders.status=?  ORDER by orders.order_id desc",
    [1],
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

router.post("/get_my_order", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT orders.order_id,orders.price,products.product_type, DATE_FORMAT(orders.purchased_at, '%W %D %M %Y') 'purachsed_at',orders.email 'order_email',orders.contact_no 'order_phone_no',quiz.quiz_id,quiz.quiz_name,quiz.slug 'quiz_slug',quiz.price 'quiz_price',books.book_name 'course_name',books.book_id,books.slug 'course_slug',books.price 'book_price',cv_users.user_id,cv_users.name,cv_users.email,cv_users.contact ,CONCAT(cv_users.address,'\n',cv_users.city,'\n',cv_users.state) 'address',cv_school_detail.name 'school_name',cv_coupons.coupon_id,cv_coupons.coupon_code,cv_coupons.discount from orders join products on orders.product_id = products.product_id LEFT join cv_coupons on cv_coupons.coupon_id = orders.coupon_id left join quiz on quiz.product_id =products.product_id left join books on orders.product_id = books.product_id join cv_users on orders.user_id = cv_users.user_id join cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id where orders.status=? and orders.user_id =? and (quiz.slug=? or books.slug= ?) ORDER by orders.order_id desc limit 1",
    [1, params.user_id, params.product_slug, params.product_slug],
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

router.post("/get_my_all_order", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT orders.order_id,orders.price,products.product_type,orders.purchased_at,orders.email 'order_email',orders.contact_no 'order_phone_no',quiz.quiz_id,quiz.quiz_name,quiz.slug 'quiz_slug',books.book_name 'course_name',books.book_id,books.slug 'course_slug',cv_users.user_id,cv_users.name,cv_users.email,cv_users.contact,cv_school_detail.name 'school_name',(select count(orders.order_id) from orders) 'total_orders',(select count(orders.order_id) from orders where orders.product_id =quiz.product_id)'quiz_total',(select COUNT(orders.order_id) from orders where orders.product_id = books.product_id) 'course_total' from orders join products on orders.product_id = products.product_id left join quiz on quiz.product_id =products.product_id left join books on orders.product_id = books.product_id join cv_users on orders.user_id = cv_users.user_id join cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id where orders.status=? and orders.user_id =? ORDER by orders.order_id desc",
    [1, params.user_id],
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

//Results
router.post("/display_overall_quiz_rank", (req, res) => {
  var params = req.body;
  //SELECT sum(st_quiz_result.points) 'obtained',(SELECT COUNT(*) from st_quiz_result s where s.quiz_id =st_quiz_result.quiz_id and s.user_id=?) 'attempted_que',(SELECT COUNT(*) from quiz_question s where s.quiz_id =st_quiz_result.quiz_id) 'total_que',quiz.quiz_id,quiz.quiz_name,max(st_quiz_result.attempted_at) 'attempted_at' FROM `st_quiz_result` join quiz on quiz.quiz_id = st_quiz_result.quiz_id and st_quiz_result.user_id=? group by st_quiz_result.quiz_id HAVING attempted_que = total_que order by max(st_quiz_result.attempted_at) desc
  //pool.query("SELECT sum(st_quiz_result.points) 'obtained',quiz.quiz_name,quiz.quiz_id,(select sum(points) from quiz_question where quiz_question.quiz_id = st_quiz_result.quiz_id group by quiz_id) 'tot_points',max(st_quiz_result.attempted_at) 'attempted_at',(SELECT COUNT(*) from st_quiz_result s where s.quiz_id =st_quiz_result.quiz_id and s.user_id=? and s.points!=0) 'right_que',(SELECT COUNT(*) from st_quiz_result s where s.quiz_id =st_quiz_result.quiz_id and s.user_id=? and s.points=0) 'wrong_que' FROM `st_quiz_result` join quiz on quiz.quiz_id = st_quiz_result.quiz_id and st_quiz_result.user_id=? group by st_quiz_result.quiz_id order by max(st_quiz_result.attempted_at) desc",[params.user_id,params.user_id,params.user_id],function(err,data){
  pool.query(
    //"SELECT sum(st_quiz_result.points) 'obtained',(SELECT COUNT(*) from st_quiz_result s where s.quiz_id =st_quiz_result.quiz_id and s.user_id=?) 'attempted_que',(SELECT COUNT(*) from quiz_question s where s.quiz_id =st_quiz_result.quiz_id) 'total_que',(SELECT sum(points) from quiz_question s where s.quiz_id =st_quiz_result.quiz_id) 'total_points',quiz.quiz_id,quiz.quiz_name,quiz.slug 'quiz_slug' ,max(st_quiz_result.attempted_at) 'attempted_at',quiz.sub_id,quiz.user_id,quiz.visible,quiz.public_permission,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating' FROM `st_quiz_result` join quiz on (quiz.quiz_id = st_quiz_result.quiz_id and st_quiz_result.user_id=?) left join products on quiz.product_id =products.product_id where quiz.user_id!=? and (quiz.user_id=0 or (quiz.visible=1 and quiz.public_permission=1))  group by st_quiz_result.quiz_id HAVING attempted_que = total_que order by max(st_quiz_result.attempted_at) DESC",
    "select cv_users.name,t1.*,(select count(t21.user_id) 'total_students' from  (select t11.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id) t11 group by t11.user_id,t11.quiz_id) t21 where t21.quiz_id=t1.quiz_id) 'total_attempted' from (SELECT sum(st_quiz_result.points) 'obtained',quiz.user_id 'quiz_user_id',(SELECT COUNT(*) from st_quiz_result s where s.quiz_id =st_quiz_result.quiz_id and s.user_id=?) 'attempted_que',(SELECT COUNT(*) from quiz_question s where s.quiz_id =st_quiz_result.quiz_id) 'total_que',(SELECT sum(points) from quiz_question s where s.quiz_id =st_quiz_result.quiz_id) 'total_points',quiz.quiz_id,quiz.quiz_name,quiz.quiz_img,quiz.quiz_desc,quiz.slug 'quiz_slug' ,max(st_quiz_result.attempted_at) 'attempted_at',quiz.sub_id,quiz.user_id,quiz.visible,quiz.public_permission,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating' FROM `st_quiz_result` join quiz on (quiz.quiz_id = st_quiz_result.quiz_id and st_quiz_result.user_id=?) left join products on quiz.product_id =products.product_id where quiz.user_id!=? and (quiz.user_id=0 or (quiz.visible=1 and quiz.public_permission=1))  group by st_quiz_result.quiz_id HAVING attempted_que = total_que order by max(st_quiz_result.attempted_at) DESC)t1 left join cv_users on t1.quiz_user_id = cv_users.user_id",
    [params.user_id, params.user_id, params.user_id],
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/display_overall_school_quiz_rank", (req, res) => {
  var params = req.body;
  //SELECT sum(st_quiz_result.points) 'obtained',(SELECT COUNT(*) from st_quiz_result s where s.quiz_id =st_quiz_result.quiz_id and s.user_id=?) 'attempted_que',(SELECT COUNT(*) from quiz_question s where s.quiz_id =st_quiz_result.quiz_id) 'total_que',quiz.quiz_id,quiz.quiz_name,max(st_quiz_result.attempted_at) 'attempted_at' FROM `st_quiz_result` join quiz on quiz.quiz_id = st_quiz_result.quiz_id and st_quiz_result.user_id=? group by st_quiz_result.quiz_id HAVING attempted_que = total_que order by max(st_quiz_result.attempted_at) desc
  //pool.query("SELECT sum(st_quiz_result.points) 'obtained',quiz.quiz_name,quiz.quiz_id,(select sum(points) from quiz_question where quiz_question.quiz_id = st_quiz_result.quiz_id group by quiz_id) 'tot_points',max(st_quiz_result.attempted_at) 'attempted_at',(SELECT COUNT(*) from st_quiz_result s where s.quiz_id =st_quiz_result.quiz_id and s.user_id=? and s.points!=0) 'right_que',(SELECT COUNT(*) from st_quiz_result s where s.quiz_id =st_quiz_result.quiz_id and s.user_id=? and s.points=0) 'wrong_que' FROM `st_quiz_result` join quiz on quiz.quiz_id = st_quiz_result.quiz_id and st_quiz_result.user_id=? group by st_quiz_result.quiz_id order by max(st_quiz_result.attempted_at) desc",[params.user_id,params.user_id,params.user_id],function(err,data){
  pool.query(
    // "SELECT sum(st_quiz_result.points) 'obtained',(SELECT COUNT(*) from st_quiz_result s where s.quiz_id =st_quiz_result.quiz_id and s.user_id=?) 'attempted_que',(SELECT COUNT(*) from quiz_question s where s.quiz_id =st_quiz_result.quiz_id) 'total_que',(SELECT sum(points) from quiz_question s where s.quiz_id =st_quiz_result.quiz_id) 'total_points',quiz.quiz_id,quiz.quiz_name,max(st_quiz_result.attempted_at) 'attempted_at',quiz.sub_id,quiz.user_id,quiz.slug 'quiz_slug',quiz.visible,quiz.public_permission,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating' FROM `st_quiz_result` join quiz on quiz.quiz_id = st_quiz_result.quiz_id and st_quiz_result.user_id=? join products on quiz.product_id = products.product_id where quiz.user_id!=? and (quiz.sch_id in (select sch_id from cv_users WHERE cv_users.user_id =?) and quiz.visible=0) group by st_quiz_result.quiz_id HAVING attempted_que = total_que order by max(st_quiz_result.attempted_at) DESC",
    "select cv_users.name,t1.*,(select count(t21.user_id) 'total_students' from  (select t11.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id) t11 group by t11.user_id,t11.quiz_id) t21 where t21.quiz_id=t1.quiz_id) 'total_attempted' from (SELECT sum(st_quiz_result.points) 'obtained',quiz.user_id 'quiz_user_id',(SELECT COUNT(*) from st_quiz_result s where s.quiz_id =st_quiz_result.quiz_id and s.user_id=?) 'attempted_que',(SELECT COUNT(*) from quiz_question s where s.quiz_id =st_quiz_result.quiz_id) 'total_que',(SELECT sum(points) from quiz_question s where s.quiz_id =st_quiz_result.quiz_id) 'total_points',quiz.quiz_id,quiz.quiz_name,quiz.quiz_img,quiz.quiz_desc,max(st_quiz_result.attempted_at) 'attempted_at',quiz.sub_id,quiz.user_id,quiz.slug 'quiz_slug',quiz.visible,quiz.public_permission,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating' FROM `st_quiz_result` join quiz on quiz.quiz_id = st_quiz_result.quiz_id and st_quiz_result.user_id=? join products on quiz.product_id = products.product_id where quiz.user_id!=? and (quiz.sch_id in (select sch_id from cv_users WHERE cv_users.user_id =?) and quiz.visible=0) group by st_quiz_result.quiz_id HAVING attempted_que = total_que order by max(st_quiz_result.attempted_at) DESC)t1 left join cv_users on t1.quiz_user_id = cv_users.user_id",
    [params.user_id, params.user_id, params.user_id, params.user_id],
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

//grant points grant_points
router.post("/grant_points", (req, res) => {
  var params = req.body;
  pool.query(
    //old version  "SELECT sum(st_quiz_result.points) 'obtained',(SELECT COUNT(*) from st_quiz_result s where s.quiz_id =st_quiz_result.quiz_id and s.user_id=?) 'attempted_que',(SELECT COUNT(*) from quiz_question s where s.quiz_id =st_quiz_result.quiz_id) 'total_que' FROM `st_quiz_result` join quiz on quiz.quiz_id = st_quiz_result.quiz_id and st_quiz_result.user_id=? group by st_quiz_result.quiz_id HAVING attempted_que = total_que order by max(st_quiz_result.attempted_at) desc",
    //new version [params.user_id, params.user_id],
    "select coin_earned from cv_users where user_id=?",
    [params.user_id],
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
//top 5 student
router.post("/display_top_quiz_st_name", (req, res) => {
  var params = req.body;
  pool.query(
    "select sum(t1.grant_point) 'grant_points',t1.name,t1.profile_pic from (SELECT sum(st_quiz_result.points) 'grant_point',cv_users.name,st_quiz_result.quiz_id,cv_users.user_id,cv_users.profile_pic,count(st_quiz_result.que_id) 'attempted_que',(SELECT count(que_id) from quiz_question WHERE quiz_question.quiz_id = st_quiz_result.quiz_id) 'total_que' from st_quiz_result join cv_users on st_quiz_result.user_id = cv_users.user_id  group by st_quiz_result.quiz_id,st_quiz_result.user_id having attempted_que = total_que order by sum(st_quiz_result.points) desc) t1  group by t1.user_id order by grant_points DESC limit 5",
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

//indivisual quiz rank
router.post("/display_ind_quiz_rank", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT sum(points) 'obtained',user_id,quiz_id,max(attempted_at),@rownum := @rownum + 1 from st_quiz_result JOIN (SELECT @rownum := 0) r where quiz_id=? GROUP by quiz_id,user_id order by max(attempted_at),sum(points) desc",
    [params.quiz_id],
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/display_all_sub_quizzes_view_result", (req, res) => {
  var params = req.body;
  pool.query("select * from quiz where quiz_id=?", [params.quiz_id], function(
    err,
    test
  ) {
    let user_id = test[0].user_id;

    if (user_id == 0 || (user_id != 0 && test[0].visible == 1)) {
      pool.query(
        "SELECT cv_users.name,t1.* from (SELECT quiz.quiz_id,quiz.quiz_name,quiz.quiz_desc,quiz.quiz_img,quiz.slug,quiz.sub_id,quiz.price,quiz.user_id 'quiz_user_id',quiz.visible,quiz.public_permission,(select count(que_id) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'no_of_questions',(select sum(points) from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id and st_quiz_result.user_id='?' group by quiz_id) 'obtain_points',(select attempted_at from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id  and st_quiz_result.user_id='?' order by st_quiz_result.que_id desc limit 1) 'attempted_at',orders.status,orders.order_id,orders.user_id 'order_user_id',quiz.product_id 'quiz_product_id',products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating',(select count(t21.user_id) 'total_students' from( select t11.* from ( select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id) t11 group by t11.user_id,t11.quiz_id) t21 where t21.quiz_id=quiz.quiz_id) 'total_attempted' from  quiz left join products on quiz.product_id = products.product_id left JOIN orders on quiz.product_id = orders.product_id and orders.user_id='?' where quiz.user_id!='?' and (quiz.user_id=0 or (quiz.visible=1 and quiz.public_permission=1))  order by quiz_id DESC)t1 left join cv_users on t1.quiz_user_id =cv_users.user_id where t1.sub_id =? and t1.no_of_questions IS NOT NULL and (t1.quiz_user_id=0 or (t1.visible=1 and t1.public_permission=1)) limit 3",
        [
          params.user_id,
          params.user_id,
          params.user_id,
          params.user_id,
          params.sub_id,
        ],
        function(err, data) {
          res.send(data);
        }
      );
    } else {
      pool.query(
        "select cv_users.name,t1.*  from (SELECT quiz.quiz_id,quiz.quiz_name,quiz.quiz_img,quiz.quiz_desc,quiz.slug,quiz.sub_id,quiz.price,quiz.user_id 'quiz_user_id',quiz.visible,quiz.public_permission,(select count(que_id) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'no_of_questions',(select sum(points) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_points',(select count(que_id) from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id and st_quiz_result.user_id=? order by st_quiz_result.que_id limit 1) 'attempted_question',(select sum(points) from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id and st_quiz_result.user_id=? group by quiz_id) 'obtain_points',(select attempted_at from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id  and st_quiz_result.user_id=? order by st_quiz_result.que_id desc limit 1) 'attempted_at',orders.status,orders.order_id,orders.user_id,quiz.product_id,products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating',(select count(t21.user_id) 'total_students' from  (select t11.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id) t11 group by t11.user_id,t11.quiz_id) t21 where t21.quiz_id=quiz.quiz_id) 'total_attempted' from  quiz left join products on quiz.product_id = products.product_id left JOIN orders on quiz.product_id = orders.product_id and orders.user_id=? where quiz.user_id!=? and (quiz.sch_id in (select sch_id from cv_users WHERE cv_users.user_id =?) and quiz.visible=0)   order by quiz_id DESC) t1 left join cv_users on t1.quiz_user_id =cv_users.user_id where t1.no_of_questions IS NOT NULL and cv_users.role_id =2 and t1.sub_id=? and t1.total_attempted!=t1.no_of_questions limit 3",
        [
          params.user_id,
          params.user_id,
          params.user_id,
          params.user_id,
          params.user_id,
          params.user_id,
          params.sub_id,
        ],
        function(err, data) {
          res.send(data);
        }
      );
    }
  });
});
router.post("/display_dashboard_sub_quizzes", (req, res) => {
  var params = req.body;
  var startTime = process.hrtime();
  pool.query(
    "select cv_users.name,t1.*,(SELECT count(tot.quiz_id) from (SELECT count(quiz_question.que_id) 'total_que',quiz_question.quiz_id,quiz.sub_id from quiz_question left join quiz on quiz.quiz_id = quiz_question.quiz_id where (quiz.user_id=0 or (quiz.visible=1 and quiz.public_permission=1)) and quiz.user_id!=?  group by quiz_question.quiz_id)tot group by tot.sub_id having tot.sub_id =t1.sub_id) 'quiz_total_quiz',(SELECT count(atmpt2.quiz_id)'attempt_quiz' from (select atmpt1.* from (SELECT atmp.*,(SELECT COUNT(st_quiz_result.que_id) 'attempt_que' from st_quiz_result left join quiz on quiz.quiz_id =st_quiz_result.quiz_id where st_quiz_result.user_id=?  group by st_quiz_result.quiz_id  having st_quiz_result.quiz_id =atmp.quiz_id) 'attempt_que' from (SELECT count(quiz_question.que_id) 'total_que',quiz_question.quiz_id,quiz.sub_id from quiz_question left join quiz on quiz.quiz_id = quiz_question.quiz_id where quiz.user_id!=? and  (quiz.user_id=0 or (quiz.visible=1 and quiz.public_permission=1)) group by quiz_question.quiz_id) atmp) atmpt1  where  atmpt1.total_que =atmpt1.attempt_que)atmpt2 group by atmpt2.sub_id having atmpt2.sub_id = t1.sub_id) 'total_quiz_attempt' from (SELECT quiz.quiz_id,quiz.quiz_name,quiz.quiz_desc,quiz.quiz_img,quiz.slug,quiz.sub_id,quiz.price,quiz.user_id 'quiz_user_id',quiz.visible,quiz.public_permission,quiz.public_institute,quiz.created_at,(select count(que_id) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'no_of_questions',(select sum(points) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_points',(select count(que_id) from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id and st_quiz_result.user_id=? order by st_quiz_result.que_id limit 1) 'attempted_question',(select sum(points) from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id and st_quiz_result.user_id=? group by quiz_id) 'obtain_points',(select attempted_at from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id  and st_quiz_result.user_id=? order by st_quiz_result.que_id desc limit 1) 'attempted_at',orders.status,orders.order_id,orders.user_id,quiz.product_id,products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating',(select count(t21.user_id) 'total_students' from  (select t11.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id) t11 group by t11.user_id,t11.quiz_id) t21 where t21.quiz_id=quiz.quiz_id) 'total_attempted' from  quiz left join products on quiz.product_id = products.product_id left JOIN orders on quiz.product_id = orders.product_id and orders.user_id=? where quiz.user_id!=? and (quiz.user_id=0 or (quiz.visible=1 and quiz.public_permission=1))  order by quiz_id DESC) t1 left join cv_users on t1.quiz_user_id =cv_users.user_id where t1.no_of_questions IS NOT NULL and (t1.quiz_user_id=0 or (t1.visible=1 and t1.public_permission=1)) and t1.public_institute=1 and (t1.price=0 or t1.status IS NOT NULL) and (t1.attempted_question!=t1.no_of_questions) ORDER by t1.created_at desc limit 3",
    [
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
    ],
    function(err, data, fields) {
      logQuery(startTime, "/api/user/display_dashboard_sub_quizzes (15s)");
      if (err) {
        console.log(err);
      } else {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/display_all_sub_quizzes", (req, res) => {
  var params = req.body;
  //console.log(params)
  if (params.user_id == 0) {
    pool.query(
      //"select cv_users.name,t1.* from (SELECT quiz.quiz_id,quiz.quiz_name,quiz.quiz_desc,quiz.quiz_img,quiz.slug,quiz.sub_id,quiz.price,quiz.user_id 'quiz_user_id',quiz.visible,quiz.public_permission,(select count(que_id) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'no_of_questions',(select sum(points) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_points',(@attmpt:=0) 'attempted_question',(@obt:=0) 'obtain_points',(@attmpt:=null) 'attempted_at',(@os:=0) status,(@oi:=null) order_id,(@ui:=0) user_id,quiz.product_id,products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating',(select count(t21.user_id) 'total_students' from  (select t11.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id) t11 group by t11.user_id,t11.quiz_id) t21 where t21.quiz_id=quiz.quiz_id) 'total_attempted' from  quiz left join products on quiz.product_id = products.product_id where  (quiz.user_id=0 or (quiz.visible=1 and quiz.public_permission=1))  order by quiz_id DESC) t1 left join cv_users on t1.quiz_user_id =cv_users.user_id  where t1.no_of_questions IS NOT NULL and (t1.quiz_user_id=0 or (t1.visible=1 and t1.public_permission=1))",
      "select cv_users.name,t1.* from (SELECT quiz.quiz_id,quiz.quiz_name,quiz.quiz_desc,quiz.quiz_img,quiz.slug,quiz.sub_id,quiz.price,quiz.user_id 'quiz_user_id',quiz.visible,quiz.public_permission,quiz.public_institute,(select count(que_id) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'no_of_questions',(select sum(points) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_points',(@attmpt:=0) 'attempted_question',(@obt:=0) 'obtain_points',(@attmpt:=null) 'attempted_at',(@os:=0) status,(@oi:=null) order_id,(@ui:=0) user_id,quiz.product_id,products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating',(select count(t21.user_id) 'total_students' from  (select t11.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id) t11 group by t11.user_id,t11.quiz_id) t21 where t21.quiz_id=quiz.quiz_id) 'total_attempted' from  quiz left join products on quiz.product_id = products.product_id where quiz.public_institute =1 and  (quiz.user_id=0 or (quiz.visible=1 and quiz.public_permission=1))  order by quiz_id DESC) t1 left join cv_users on t1.quiz_user_id =cv_users.user_id  where t1.no_of_questions IS NOT NULL and (t1.quiz_user_id=0 or (t1.visible=1 and t1.public_permission=1)) and t1.public_institute=1",
      function(err, data, fields) {
        if (err) {
        } else {
          res.json({
            status: "200",
            data: data,
          });
        }
      }
    );
  } else {
    pool.query(
      //"select cv_users.name,t1.*,(SELECT count(tot.quiz_id) from (SELECT count(quiz_question.que_id) 'total_que',quiz_question.quiz_id,quiz.sub_id from quiz_question left join quiz on quiz.quiz_id = quiz_question.quiz_id where (quiz.user_id=0 or (quiz.visible=1 and quiz.public_permission=1)) and quiz.user_id!=?  group by quiz_question.quiz_id)tot group by tot.sub_id having tot.sub_id =t1.sub_id) 'quiz_total_quiz',(SELECT count(atmpt2.quiz_id)'attempt_quiz' from (select atmpt1.* from (SELECT atmp.*,(SELECT COUNT(st_quiz_result.que_id) 'attempt_que' from st_quiz_result left join quiz on quiz.quiz_id =st_quiz_result.quiz_id where st_quiz_result.user_id=?  group by st_quiz_result.quiz_id  having st_quiz_result.quiz_id =atmp.quiz_id) 'attempt_que' from (SELECT count(quiz_question.que_id) 'total_que',quiz_question.quiz_id,quiz.sub_id from quiz_question left join quiz on quiz.quiz_id = quiz_question.quiz_id where quiz.user_id!=? and  (quiz.user_id=0 or (quiz.visible=1 and quiz.public_permission=1)) group by quiz_question.quiz_id) atmp) atmpt1  where  atmpt1.total_que =atmpt1.attempt_que)atmpt2 group by atmpt2.sub_id having atmpt2.sub_id = t1.sub_id) 'total_quiz_attempt' from (SELECT quiz.quiz_id,quiz.quiz_name,quiz.quiz_desc,quiz.quiz_img,quiz.slug,quiz.sub_id,quiz.price,quiz.user_id 'quiz_user_id',quiz.visible,quiz.public_permission,quiz.public_institute,(select count(que_id) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'no_of_questions',(select sum(points) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_points',(select count(que_id) from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id and st_quiz_result.user_id=? order by st_quiz_result.que_id limit 1) 'attempted_question',(select sum(points) from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id and st_quiz_result.user_id=? group by quiz_id) 'obtain_points',(select attempted_at from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id  and st_quiz_result.user_id=? order by st_quiz_result.que_id desc limit 1) 'attempted_at',orders.status,orders.order_id,orders.user_id,quiz.product_id,products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating',(select count(t21.user_id) 'total_students' from  (select t11.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id) t11 group by t11.user_id,t11.quiz_id) t21 where t21.quiz_id=quiz.quiz_id) 'total_attempted' from  quiz left join products on quiz.product_id = products.product_id left JOIN orders on quiz.product_id = orders.product_id and orders.user_id=? where quiz.user_id!=? and (quiz.user_id=0 or (quiz.visible=1 and quiz.public_permission=1))  order by quiz_id DESC) t1 left join cv_users on t1.quiz_user_id =cv_users.user_id where t1.no_of_questions IS NOT NULL and (t1.quiz_user_id=0 or (t1.visible=1 and t1.public_permission=1)) and t1.public_institute=1",
      "select cv_users.name,t1.*,(SELECT count(tot.quiz_id) from (SELECT count(quiz_question.que_id) 'total_que',quiz_question.quiz_id,quiz.sub_id from quiz_question left join quiz on quiz.quiz_id = quiz_question.quiz_id where (quiz.user_id=0 or (quiz.visible=1 and quiz.public_permission=1)) and quiz.user_id!=?  group by quiz_question.quiz_id)tot group by tot.sub_id having tot.sub_id =t1.sub_id) 'quiz_total_quiz',(SELECT count(atmpt2.quiz_id)'attempt_quiz' from (select atmpt1.* from (SELECT atmp.*,(SELECT COUNT(st_quiz_result.que_id) 'attempt_que' from st_quiz_result left join quiz on quiz.quiz_id =st_quiz_result.quiz_id where st_quiz_result.user_id=?  group by st_quiz_result.quiz_id  having st_quiz_result.quiz_id =atmp.quiz_id) 'attempt_que' from (SELECT count(quiz_question.que_id) 'total_que',quiz_question.quiz_id,quiz.sub_id from quiz_question left join quiz on quiz.quiz_id = quiz_question.quiz_id where quiz.user_id!=? and  (quiz.user_id=0 or (quiz.visible=1 and quiz.public_permission=1)) group by quiz_question.quiz_id) atmp) atmpt1  where  atmpt1.total_que =atmpt1.attempt_que)atmpt2 group by atmpt2.sub_id having atmpt2.sub_id = t1.sub_id) 'total_quiz_attempt' from (SELECT quiz.quiz_id,quiz.quiz_name,quiz.quiz_desc,quiz.quiz_img,quiz.slug,quiz.sub_id,quiz.price,quiz.user_id 'quiz_user_id',quiz.visible,quiz.public_permission,quiz.public_institute,(select count(que_id) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'no_of_questions',(select sum(points) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_points',(select count(que_id) from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id and st_quiz_result.user_id=? order by st_quiz_result.que_id limit 1) 'attempted_question',(select sum(points) from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id and st_quiz_result.user_id=? group by quiz_id) 'obtain_points',(select attempted_at from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id  and st_quiz_result.user_id=? order by st_quiz_result.que_id desc limit 1) 'attempted_at',orders.status,orders.order_id,orders.user_id,quiz.product_id,products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating',(select count(t21.user_id) 'total_students' from  (select t11.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id) t11 group by t11.user_id,t11.quiz_id) t21 where t21.quiz_id=quiz.quiz_id) 'total_attempted' from  quiz left join products on quiz.product_id = products.product_id left JOIN orders on (quiz.product_id = orders.product_id and orders.user_id=? and orders.status=1) where quiz.user_id!=? and (quiz.user_id=0 or (quiz.visible=1 and quiz.public_permission=1))  order by quiz_id DESC) t1 left join cv_users on t1.quiz_user_id =cv_users.user_id where t1.no_of_questions IS NOT NULL and (t1.quiz_user_id=0 or (t1.visible=1 and t1.public_permission=1)) and t1.public_institute=1",
      [
        params.user_id,
        params.user_id,
        params.user_id,
        params.user_id,
        params.user_id,
        params.user_id,
        params.user_id,
        params.user_id,
      ],
      function(err, data, fields) {
        if (err) {
          console.log(err);
        } else {
          res.json({
            status: "200",
            data: data,
          });
        }
      }
    );
  }
});

router.post("/get_quiz_reviews", (req, res) => {
  var param = req.body;

  pool.query(
    "select product_feedback.obt_rat,product_feedback.max_rat,product_feedback.message,cv_users.name,cv_users.profile_pic,quiz.quiz_name from product_feedback left join quiz on product_feedback.product_id = quiz.product_id left join cv_users on product_feedback.user_id = cv_users.user_id where product_feedback.product_id in (SELECT product_id from quiz WHERE quiz.quiz_id =?)",
    [param.quiz_id],
    function(err, data) {
      if (!err) {
        res.json({
          status: 200,
          data: data,
        });
      } else console.log(err);
    }
  );
});
router.post("/display_all_school_sub_quizzess", (req, res) => {
  var params = req.body;
  pool.query(
    //"select cv_users.name,t1.*,(SELECT count(tot.quiz_id) from (SELECT count(quiz_question.que_id) 'total_que',quiz_question.quiz_id,quiz.sub_id from quiz_question left join quiz on quiz.quiz_id = quiz_question.quiz_id  left join cv_users on cv_users.user_id = quiz.user_id where quiz.user_id!=? and quiz.sch_id in (SELECT sch_id from cv_users where cv_users.user_id=?) and quiz.visible=0 and cv_users.role_id=2 group by quiz_question.quiz_id)tot group by tot.sub_id having tot.sub_id =t1.sub_id) 'quiz_total_quiz',(SELECT count(atmpt2.quiz_id)'attempt_quiz' from (select atmpt1.* from (SELECT atmp.*,(SELECT COUNT(st_quiz_result.que_id) 'attempt_que' from st_quiz_result left join quiz on quiz.quiz_id =st_quiz_result.quiz_id  where quiz.user_id!=? and quiz.sch_id in (SELECT sch_id from cv_users where cv_users.user_id=?) and quiz.visible=0 and  st_quiz_result.user_id=?  group by st_quiz_result.quiz_id having st_quiz_result.quiz_id =atmp.quiz_id) 'attempt_que' from (SELECT count(quiz_question.que_id) 'total_que',quiz_question.quiz_id,quiz.sub_id from quiz_question left join quiz on quiz.quiz_id = quiz_question.quiz_id left join cv_users on cv_users.user_id = quiz.user_id where quiz.user_id!=? and quiz.sch_id in (SELECT sch_id from cv_users where cv_users.user_id=?) and quiz.visible=0 and cv_users.role_id=2  group by quiz_question.quiz_id) atmp) atmpt1  where  atmpt1.total_que =atmpt1.attempt_que)atmpt2 group by atmpt2.sub_id having atmpt2.sub_id = t1.sub_id) 'total_quiz_attempt' from (SELECT quiz.quiz_id,quiz.quiz_name,quiz.quiz_img,quiz.quiz_desc,quiz.slug,quiz.sub_id,quiz.price,quiz.user_id 'quiz_user_id',quiz.visible,quiz.public_permission,(select count(que_id) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'no_of_questions',(select sum(points) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_points',(select count(que_id) from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id and st_quiz_result.user_id=? order by st_quiz_result.que_id limit 1) 'attempted_question',(select sum(points) from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id and st_quiz_result.user_id=? group by quiz_id) 'obtain_points',(select attempted_at from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id  and st_quiz_result.user_id=? order by st_quiz_result.que_id desc limit 1) 'attempted_at',orders.status,orders.order_id,orders.user_id,quiz.product_id,products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating',(select count(t21.user_id) 'total_students' from  (select t11.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id) t11 group by t11.user_id,t11.quiz_id) t21 where t21.quiz_id=quiz.quiz_id) 'total_attempted' from  quiz left join products on quiz.product_id = products.product_id left JOIN orders on quiz.product_id = orders.product_id and orders.user_id=? where quiz.user_id!=? and (quiz.sch_id in (select sch_id from cv_users WHERE cv_users.user_id =?) and quiz.visible=0)   order by quiz_id DESC) t1 left join cv_users on t1.quiz_user_id =cv_users.user_id where t1.no_of_questions IS NOT NULL and cv_users.role_id =2 and t1.total_attempted!=t1.no_of_questions",
    "select cv_users.name,t1.*,(SELECT count(tot.quiz_id) from (SELECT count(quiz_question.que_id) 'total_que',quiz_question.quiz_id,quiz.sub_id from quiz_question left join quiz on quiz.quiz_id = quiz_question.quiz_id  left join cv_users on cv_users.user_id = quiz.user_id where quiz.user_id!=? and quiz.sch_id in (SELECT sch_id from cv_users where cv_users.user_id=?) and quiz.visible=0 and cv_users.role_id=2 group by quiz_question.quiz_id)tot group by tot.sub_id having tot.sub_id =t1.sub_id) 'quiz_total_quiz',(SELECT count(atmpt2.quiz_id)'attempt_quiz' from (select atmpt1.* from (SELECT atmp.*,(SELECT COUNT(st_quiz_result.que_id) 'attempt_que' from st_quiz_result left join quiz on quiz.quiz_id =st_quiz_result.quiz_id  where quiz.user_id!=? and quiz.sch_id in (SELECT sch_id from cv_users where cv_users.user_id=?) and quiz.visible=0 and  st_quiz_result.user_id=?  group by st_quiz_result.quiz_id having st_quiz_result.quiz_id =atmp.quiz_id) 'attempt_que' from (SELECT count(quiz_question.que_id) 'total_que',quiz_question.quiz_id,quiz.sub_id from quiz_question left join quiz on quiz.quiz_id = quiz_question.quiz_id left join cv_users on cv_users.user_id = quiz.user_id where quiz.user_id!=? and quiz.sch_id in (SELECT sch_id from cv_users where cv_users.user_id=?) and quiz.visible=0 and cv_users.role_id=2  group by quiz_question.quiz_id) atmp) atmpt1  where  atmpt1.total_que =atmpt1.attempt_que)atmpt2 group by atmpt2.sub_id having atmpt2.sub_id = t1.sub_id) 'total_quiz_attempt' from (SELECT quiz.quiz_id,quiz.quiz_name,quiz.quiz_img,quiz.quiz_desc,quiz.slug,quiz.sub_id,quiz.price,quiz.user_id 'quiz_user_id',quiz.visible,quiz.public_permission,quiz.public_institute,(select count(que_id) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'no_of_questions',(select sum(points) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_points',(select count(que_id) from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id and st_quiz_result.user_id=? order by st_quiz_result.que_id limit 1) 'attempted_question',(select sum(points) from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id and st_quiz_result.user_id=? group by quiz_id) 'obtain_points',(select attempted_at from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id  and st_quiz_result.user_id=? order by st_quiz_result.que_id desc limit 1) 'attempted_at',orders.status,orders.order_id,orders.user_id,quiz.product_id,products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating',(select count(t21.user_id) 'total_students' from  (select t11.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id) t11 group by t11.user_id,t11.quiz_id) t21 where t21.quiz_id=quiz.quiz_id) 'total_attempted' from  quiz left join products on quiz.product_id = products.product_id left JOIN orders on quiz.product_id = orders.product_id and orders.user_id=? where quiz.user_id!=? and quiz.public_institute=1 and (quiz.sch_id in (select sch_id from cv_users WHERE cv_users.user_id =?) and quiz.visible=0)   order by quiz_id DESC) t1 left join cv_users on t1.quiz_user_id =cv_users.user_id where t1.no_of_questions IS NOT NULL and cv_users.role_id =2 and t1.total_attempted!=t1.no_of_questions",
    [
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
    ],
    function(err, data, fields) {
      if (err) {
      } else {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

router.post("/display_dashboard_school_sub_quizzess", (req, res) => {
  var params = req.body;
  pool.query(
    //"select cv_users.name,t1.*,(SELECT count(tot.quiz_id) from (SELECT count(quiz_question.que_id) 'total_que',quiz_question.quiz_id,quiz.sub_id from quiz_question left join quiz on quiz.quiz_id = quiz_question.quiz_id  left join cv_users on cv_users.user_id = quiz.user_id where quiz.user_id!=? and quiz.sch_id in (SELECT sch_id from cv_users where cv_users.user_id=?) and quiz.visible=0 and cv_users.role_id=2 group by quiz_question.quiz_id)tot group by tot.sub_id having tot.sub_id =t1.sub_id) 'quiz_total_quiz',(SELECT count(atmpt2.quiz_id)'attempt_quiz' from (select atmpt1.* from (SELECT atmp.*,(SELECT COUNT(st_quiz_result.que_id) 'attempt_que' from st_quiz_result left join quiz on quiz.quiz_id =st_quiz_result.quiz_id  where quiz.user_id!=? and quiz.sch_id in (SELECT sch_id from cv_users where cv_users.user_id=?) and quiz.visible=0 and  st_quiz_result.user_id=?  group by st_quiz_result.quiz_id having st_quiz_result.quiz_id =atmp.quiz_id) 'attempt_que' from (SELECT count(quiz_question.que_id) 'total_que',quiz_question.quiz_id,quiz.sub_id from quiz_question left join quiz on quiz.quiz_id = quiz_question.quiz_id left join cv_users on cv_users.user_id = quiz.user_id where quiz.user_id!=? and quiz.sch_id in (SELECT sch_id from cv_users where cv_users.user_id=?) and quiz.visible=0 and cv_users.role_id=2  group by quiz_question.quiz_id) atmp) atmpt1  where  atmpt1.total_que =atmpt1.attempt_que)atmpt2 group by atmpt2.sub_id having atmpt2.sub_id = t1.sub_id) 'total_quiz_attempt' from (SELECT quiz.quiz_id,quiz.quiz_name,quiz.quiz_img,quiz.quiz_desc,quiz.slug,quiz.sub_id,quiz.price,quiz.user_id 'quiz_user_id',quiz.visible,quiz.public_permission,(select count(que_id) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'no_of_questions',(select sum(points) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_points',(select count(que_id) from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id and st_quiz_result.user_id=? order by st_quiz_result.que_id limit 1) 'attempted_question',(select sum(points) from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id and st_quiz_result.user_id=? group by quiz_id) 'obtain_points',(select attempted_at from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id  and st_quiz_result.user_id=? order by st_quiz_result.que_id desc limit 1) 'attempted_at',orders.status,orders.order_id,orders.user_id,quiz.product_id,products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating',(select count(t21.user_id) 'total_students' from  (select t11.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id) t11 group by t11.user_id,t11.quiz_id) t21 where t21.quiz_id=quiz.quiz_id) 'total_attempted' from  quiz left join products on quiz.product_id = products.product_id left JOIN orders on quiz.product_id = orders.product_id and orders.user_id=? where quiz.user_id!=? and (quiz.sch_id in (select sch_id from cv_users WHERE cv_users.user_id =?) and quiz.visible=0)   order by quiz_id DESC) t1 left join cv_users on t1.quiz_user_id =cv_users.user_id where t1.no_of_questions IS NOT NULL and cv_users.role_id =2 and t1.total_attempted!=t1.no_of_questions",
    "select cv_users.name,t1.*,(SELECT count(tot.quiz_id) from (SELECT count(quiz_question.que_id) 'total_que',quiz_question.quiz_id,quiz.sub_id from quiz_question left join quiz on quiz.quiz_id = quiz_question.quiz_id  left join cv_users on cv_users.user_id = quiz.user_id where quiz.user_id!=? and quiz.sch_id in (SELECT sch_id from cv_users where cv_users.user_id=?) and quiz.visible=0 and cv_users.role_id=2 group by quiz_question.quiz_id)tot group by tot.sub_id having tot.sub_id =t1.sub_id) 'quiz_total_quiz',(SELECT count(atmpt2.quiz_id)'attempt_quiz' from (select atmpt1.* from (SELECT atmp.*,(SELECT COUNT(st_quiz_result.que_id) 'attempt_que' from st_quiz_result left join quiz on quiz.quiz_id =st_quiz_result.quiz_id  where quiz.user_id!=? and quiz.sch_id in (SELECT sch_id from cv_users where cv_users.user_id=?) and quiz.visible=0 and  st_quiz_result.user_id=?  group by st_quiz_result.quiz_id having st_quiz_result.quiz_id =atmp.quiz_id) 'attempt_que' from (SELECT count(quiz_question.que_id) 'total_que',quiz_question.quiz_id,quiz.sub_id from quiz_question left join quiz on quiz.quiz_id = quiz_question.quiz_id left join cv_users on cv_users.user_id = quiz.user_id where quiz.user_id!=? and quiz.sch_id in (SELECT sch_id from cv_users where cv_users.user_id=?) and quiz.visible=0 and cv_users.role_id=2  group by quiz_question.quiz_id) atmp) atmpt1  where  atmpt1.total_que =atmpt1.attempt_que)atmpt2 group by atmpt2.sub_id having atmpt2.sub_id = t1.sub_id) 'total_quiz_attempt' from (SELECT quiz.quiz_id,quiz.quiz_name,quiz.quiz_img,quiz.quiz_desc,quiz.slug,quiz.sub_id,quiz.price,quiz.user_id 'quiz_user_id',quiz.visible,quiz.public_permission,quiz.created_at,quiz.public_institute,(select count(que_id) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'no_of_questions',(select sum(points) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_points',(select count(que_id) from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id and st_quiz_result.user_id=? order by st_quiz_result.que_id limit 1) 'attempted_question',(select sum(points) from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id and st_quiz_result.user_id=? group by quiz_id) 'obtain_points',(select attempted_at from st_quiz_result where st_quiz_result.quiz_id = quiz.quiz_id  and st_quiz_result.user_id=? order by st_quiz_result.que_id desc limit 1) 'attempted_at',orders.status,orders.order_id,orders.user_id,quiz.product_id,products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating',(select count(t21.user_id) 'total_students' from  (select t11.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id) t11 group by t11.user_id,t11.quiz_id) t21 where t21.quiz_id=quiz.quiz_id) 'total_attempted' from  quiz left join products on quiz.product_id = products.product_id left JOIN orders on quiz.product_id = orders.product_id and orders.user_id=? where quiz.user_id!=? and quiz.public_institute=1 and (quiz.sch_id in (select sch_id from cv_users WHERE cv_users.user_id =?) and quiz.visible=0)   order by quiz_id DESC) t1 left join cv_users on t1.quiz_user_id =cv_users.user_id where t1.no_of_questions IS NOT NULL and cv_users.role_id =2 and (t1.total_attempted!=t1.no_of_questions) and (t1.price=0 or t1.status IS NOT NULL) ORDER by t1.created_at desc limit 3",
    [
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
    ],
    function(err, data, fields) {
      if (err) {
      } else {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/get_all_quizzes", (req, res) => {
  //query
  var params = req.body;
  pool.query(
    "SELECT quiz_subject.sub_id,quiz_subject.subject,quiz_subject.slug,quiz_subject.price,(select count(*) from quiz where quiz.sub_id = quiz_subject.sub_id group by sub_id) 'no_of_quiz',(select sum(points) from quiz_question left join quiz on quiz_question.quiz_id = quiz.quiz_id group by sub_id having quiz.sub_id = quiz_subject.sub_id ) 'no_of_point',(select count(*) from orders where orders.sub_id = quiz_subject.sub_id and orders.user_id=?) 'status' from quiz_subject order by sub_id",
    [params.user_id],
    function(err, data, fields) {
      if (err) {
      } else {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

router.post("/AllTeacherQuizes", (req, res) => {
  var params = req.body;

  pool.query(
    // "SELECT DATE(quiz.created_at) AS created_at,quiz.price,quiz.quiz_id,quiz.quiz_name,quiz.slug,quiz.sub_id,quiz.visible,quiz.public_permission, (CASE WHEN quiz.sub_id =1 THEN 'HTML' WHEN quiz.sub_id =2 THEN 'CSS' WHEN quiz.sub_id=3 THEN 'JavaScript' WHEN quiz.sub_id=4 THEN 'Python' WHEN quiz.sub_id=5 THEN 'SQL' ELSE '' END) AS 'Subject',(SELECT count(*) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_question',(SELECT sum(quiz_question.points)  from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_marks' ,(select count(t2.user_id) 'total_students' from  (select t.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id,st_quiz_result.checked from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id where quiz.user_id=?) t group by t.user_id,t.quiz_id) t2 where t2.quiz_id=quiz.quiz_id) 'total_attempted',(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating' from quiz join products on quiz.product_id =products.product_id where user_id =?",
    "SELECT DATE(quiz.created_at) AS created_at,quiz.price,quiz.quiz_id,quiz.quiz_name,quiz.slug,quiz.sub_id,quiz.visible,quiz.public_permission,quiz.public_institute, (CASE WHEN quiz.sub_id =1 THEN 'HTML' WHEN quiz.sub_id =2 THEN 'CSS' WHEN quiz.sub_id=3 THEN 'JavaScript' WHEN quiz.sub_id=4 THEN 'Python' WHEN quiz.sub_id=5 THEN 'SQL' WHEN quiz.sub_id=6 THEN 'Gk'  ELSE '' END) AS 'Subject',quiz.quiz_img,quiz_subject.subject 'quiz_subject',(SELECT count(*) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_question',(SELECT sum(quiz_question.points)  from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_marks' ,(select count(t2.user_id) 'total_students' from  (select t.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id where quiz.user_id=?) t group by t.user_id,t.quiz_id) t2 where t2.quiz_id=quiz.quiz_id) 'total_attempted',(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating' from quiz join products on quiz.product_id =products.product_id left join quiz_subject on quiz.sub_id = quiz_subject.sub_id where user_id =?",
    //"SELECT DATE(quiz.created_at) AS created_at,quiz.price,quiz.quiz_id,quiz.quiz_name,quiz.slug,quiz.sub_id,quiz.visible,quiz.public_permission,cv_users.role_id, (CASE WHEN quiz.sub_id =1 THEN 'HTML' WHEN quiz.sub_id =2 THEN 'CSS' WHEN quiz.sub_id=3 THEN 'JavaScript' WHEN quiz.sub_id=4 THEN 'Python' WHEN quiz.sub_id=5 THEN 'SQL' WHEN quiz.sub_id=6 THEN 'Gk'  ELSE '' END) AS 'Subject',quiz.quiz_img,quiz_subject.subject 'quiz_subject',(SELECT count(*) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_question',(SELECT sum(quiz_question.points)  from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_marks' ,(select count(t2.user_id) 'total_students' from  (select t.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id where quiz.user_id=?) t group by t.user_id,t.quiz_id) t2 where t2.quiz_id=quiz.quiz_id) 'total_attempted',(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating' from quiz join products on quiz.product_id =products.product_id left join quiz_subject on (quiz.sub_id = quiz_subject.sub_id) left join cv_users on (cv_users.user_id =quiz.user_id)  where quiz.user_id =?",
    [params.user_id, params.user_id],
    function(err, data, fields) {
      if (err) {
      } else {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/ApprovePublishPermission", (req, res) => {
  var params = req.body;
  pool.query(
    "update quiz set visible=1 where quiz_id=?",
    [params.quiz_id],
    function(err, result) {
      if (err) {
      } else {
        res.json({
          status: 200,
          data: 1,
        });
      }
    }
  );
});
router.post("/ApproveUserPublishPermission", (req, res) => {
  var params = req.body;
  pool.query(
    "update quiz set visible=1 where quiz_id=?",
    [params.quiz_id],
    function(err, result) {
      if (err) {
      } else {
        pool.query(
          "select * from quiz where quiz_id =?",
          [params.quiz_id],
          function(err, data) {
            if (!err) {
              let query =
                "UPDATE `cv_users` cu,cv_users c1 SET cu.coin_earned =  cu.coin_earned + " +
                10 +
                " WHERE cu.user_id = c1.user_id and cu.user_id =" +
                data[0].user_id;
              pool.query(query, function(err, result1) {
                if (!err) {
                  res.json({
                    status: 200,
                    data: 1,
                  });
                } else console.log(err);
              });
            } else console.log(err);
          }
        );
      }
    }
  );
});
router.post("/RejectPublishPermission", (req, res) => {
  var params = req.body;
  pool.query(
    "update quiz set public_permission=0 where quiz_id=?",
    [params.quiz_id],
    function(err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json({
          status: 200,
          data: 1,
        });
      }
    }
  );
});

router.post("/AllteachersQuizzes", (req, res) => {
  var params = req.body;
  pool.query(
    // "SELECT DATE(quiz.created_at) AS created_at,quiz.price,quiz.quiz_id,quiz.quiz_name,quiz.slug,quiz.sub_id,quiz.visible,quiz.public_permission,quiz.user_id,cv_users.name 'teacher_name',cv_school_detail.name 'school_name', (CASE WHEN quiz.sub_id =1 THEN 'HTML' WHEN quiz.sub_id =2 THEN 'CSS' WHEN quiz.sub_id=3 THEN 'JavaScript' WHEN quiz.sub_id=4 THEN 'Python' WHEN quiz.sub_id=5 THEN 'SQL' ELSE '' END) AS 'Subject',(SELECT count(*) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_question',(SELECT sum(quiz_question.points)  from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_marks',(select count(t2.user_id) 'total_students' from  (select t.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id,st_quiz_result.checked from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id where quiz.user_id<>0) t group by t.user_id,t.quiz_id) t2 where t2.quiz_id=quiz.quiz_id) 'total_attempted',(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating'  from quiz join products on quiz.product_id = products.product_id left join cv_users on quiz.user_id = cv_users.user_id left join cv_school_detail on cv_users.sch_id =cv_school_detail.sch_id where quiz.user_id !=0",
    "SELECT DATE(quiz.created_at) AS created_at,quiz.price,quiz.quiz_id,quiz.quiz_name,quiz.slug,quiz.sub_id,quiz.visible,quiz.public_permission,quiz.user_id,cv_users.name 'teacher_name',cv_school_detail.name 'school_name', (CASE WHEN quiz.sub_id =1 THEN 'HTML' WHEN quiz.sub_id =2 THEN 'CSS' WHEN quiz.sub_id=3 THEN 'JavaScript' WHEN quiz.sub_id=4 THEN 'Python' WHEN quiz.sub_id=5 THEN 'SQL' ELSE '' END) AS 'Subject',quiz.quiz_img,quiz_subject.subject 'quiz_subject',(SELECT count(*) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_question',(SELECT sum(quiz_question.points)  from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_marks',(select count(t2.user_id) 'total_students' from  (select t.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id where quiz.user_id<>0) t group by t.user_id,t.quiz_id) t2 where t2.quiz_id=quiz.quiz_id) 'total_attempted',(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating'  from quiz join products on quiz.product_id = products.product_id left join quiz_subject on quiz_subject.sub_id = quiz.sub_id left join cv_users on quiz.user_id = cv_users.user_id left join cv_school_detail on cv_users.sch_id =cv_school_detail.sch_id where quiz.user_id !=0 and cv_users.role_id=2 or cv_users.role_id=1",
    function(err, data, fields) {
      if (err) {
      } else {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/AllUsersQuizzes", (req, res) => {
  var params = req.body;
  pool.query(
    // "SELECT DATE(quiz.created_at) AS created_at,quiz.price,quiz.quiz_id,quiz.quiz_name,quiz.slug,quiz.sub_id,quiz.visible,quiz.public_permission,quiz.user_id,cv_users.name 'teacher_name',cv_school_detail.name 'school_name', (CASE WHEN quiz.sub_id =1 THEN 'HTML' WHEN quiz.sub_id =2 THEN 'CSS' WHEN quiz.sub_id=3 THEN 'JavaScript' WHEN quiz.sub_id=4 THEN 'Python' WHEN quiz.sub_id=5 THEN 'SQL' ELSE '' END) AS 'Subject',(SELECT count(*) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_question',(SELECT sum(quiz_question.points)  from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_marks',(select count(t2.user_id) 'total_students' from  (select t.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id,st_quiz_result.checked from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id where quiz.user_id<>0) t group by t.user_id,t.quiz_id) t2 where t2.quiz_id=quiz.quiz_id) 'total_attempted',(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating'  from quiz join products on quiz.product_id = products.product_id left join cv_users on quiz.user_id = cv_users.user_id left join cv_school_detail on cv_users.sch_id =cv_school_detail.sch_id where quiz.user_id !=0",
    "SELECT DATE(quiz.created_at) AS created_at,quiz.price,quiz.quiz_id,quiz.quiz_name,quiz.slug,quiz.sub_id,quiz.visible,quiz.public_permission,quiz.user_id,cv_users.name 'teacher_name',cv_school_detail.name 'school_name', (CASE WHEN quiz.sub_id =1 THEN 'HTML' WHEN quiz.sub_id =2 THEN 'CSS' WHEN quiz.sub_id=3 THEN 'JavaScript' WHEN quiz.sub_id=4 THEN 'Python' WHEN quiz.sub_id=5 THEN 'SQL' ELSE '' END) AS 'Subject',quiz.quiz_img,quiz_subject.subject 'quiz_subject',(SELECT count(*) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_question',(SELECT sum(quiz_question.points)  from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_marks',(select count(t2.user_id) 'total_students' from  (select t.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id where quiz.user_id<>0) t group by t.user_id,t.quiz_id) t2 where t2.quiz_id=quiz.quiz_id) 'total_attempted',(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating'  from quiz join products on quiz.product_id = products.product_id left join quiz_subject on quiz_subject.sub_id = quiz.sub_id left join cv_users on quiz.user_id = cv_users.user_id left join cv_school_detail on cv_users.sch_id =cv_school_detail.sch_id where quiz.user_id !=0 and cv_users.role_id=3",
    function(err, data, fields) {
      if (err) {
      } else {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/AllteachersfilterQuizzes", (req, res) => {
  var params = req.body;
  pool.query(
    // "SELECT DATE(quiz.created_at) AS created_at,quiz.price,quiz.quiz_id,quiz.quiz_name,quiz.slug,quiz.sub_id,quiz.visible,quiz.public_permission,quiz.user_id,cv_users.name 'teacher_name',cv_school_detail.name 'school_name', (CASE WHEN quiz.sub_id =1 THEN 'HTML' WHEN quiz.sub_id =2 THEN 'CSS' WHEN quiz.sub_id=3 THEN 'JavaScript' WHEN quiz.sub_id=4 THEN 'Python' WHEN quiz.sub_id=5 THEN 'SQL' ELSE '' END) AS 'Subject',(SELECT count(*) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_question',(SELECT sum(quiz_question.points)  from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_marks',(select count(t2.user_id) 'total_students' from  (select t.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id,st_quiz_result.checked from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id where quiz.user_id<>0) t group by t.user_id,t.quiz_id) t2 where t2.quiz_id=quiz.quiz_id) 'total_attempted',(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating'  from quiz join products on quiz.product_id = products.product_id left join cv_users on quiz.user_id = cv_users.user_id left join cv_school_detail on cv_users.sch_id =cv_school_detail.sch_id where quiz.user_id !=0 and quiz.public_permission=? and quiz.visible=?",
    "SELECT DATE(quiz.created_at) AS created_at,quiz.price,quiz.quiz_id,quiz.quiz_name,quiz_desc,quiz_img,quiz.slug,quiz.sub_id,quiz.visible,quiz.public_permission,quiz.user_id,cv_users.name 'teacher_name',cv_school_detail.name 'school_name', (CASE WHEN quiz.sub_id =1 THEN 'HTML' WHEN quiz.sub_id =2 THEN 'CSS' WHEN quiz.sub_id=3 THEN 'JavaScript' WHEN quiz.sub_id=4 THEN 'Python' WHEN quiz.sub_id=5 THEN 'SQL' ELSE '' END) AS 'Subject',quiz_subject.subject 'quiz_subject',(SELECT count(*) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_question',(SELECT sum(quiz_question.points)  from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_marks',(select count(t2.user_id) 'total_students' from  (select t.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id where quiz.user_id<>0) t group by t.user_id,t.quiz_id) t2 where t2.quiz_id=quiz.quiz_id) 'total_attempted',(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating'  from quiz left join quiz_subject on quiz.sub_id = quiz_subject.sub_id join products on quiz.product_id = products.product_id left join cv_users on quiz.user_id = cv_users.user_id left join cv_school_detail on cv_users.sch_id =cv_school_detail.sch_id where quiz.user_id !=0 and (cv_users.role_id=2 or cv_users.role_id=1)  and quiz.public_permission=? and quiz.visible=?",
    [params.public_permission, params.visible],
    function(err, data, fields) {
      if (err) {
      } else {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/AllUsersfilterQuizzes", (req, res) => {
  var params = req.body;
  pool.query(
    // "SELECT DATE(quiz.created_at) AS created_at,quiz.price,quiz.quiz_id,quiz.quiz_name,quiz.slug,quiz.sub_id,quiz.visible,quiz.public_permission,quiz.user_id,cv_users.name 'teacher_name',cv_school_detail.name 'school_name', (CASE WHEN quiz.sub_id =1 THEN 'HTML' WHEN quiz.sub_id =2 THEN 'CSS' WHEN quiz.sub_id=3 THEN 'JavaScript' WHEN quiz.sub_id=4 THEN 'Python' WHEN quiz.sub_id=5 THEN 'SQL' ELSE '' END) AS 'Subject',(SELECT count(*) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_question',(SELECT sum(quiz_question.points)  from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_marks',(select count(t2.user_id) 'total_students' from  (select t.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id,st_quiz_result.checked from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id where quiz.user_id<>0) t group by t.user_id,t.quiz_id) t2 where t2.quiz_id=quiz.quiz_id) 'total_attempted',(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating'  from quiz join products on quiz.product_id = products.product_id left join cv_users on quiz.user_id = cv_users.user_id left join cv_school_detail on cv_users.sch_id =cv_school_detail.sch_id where quiz.user_id !=0 and quiz.public_permission=? and quiz.visible=?",
    "SELECT DATE(quiz.created_at) AS created_at,quiz.price,quiz.quiz_id,quiz.quiz_name,quiz_desc,quiz_img,quiz.slug,quiz.sub_id,quiz.visible,quiz.public_permission,quiz.user_id,cv_users.name 'teacher_name',cv_school_detail.name 'school_name', (CASE WHEN quiz.sub_id =1 THEN 'HTML' WHEN quiz.sub_id =2 THEN 'CSS' WHEN quiz.sub_id=3 THEN 'JavaScript' WHEN quiz.sub_id=4 THEN 'Python' WHEN quiz.sub_id=5 THEN 'SQL' ELSE '' END) AS 'Subject',quiz_subject.subject 'quiz_subject',(SELECT count(*) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_question',(SELECT sum(quiz_question.points)  from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_marks',(select count(t2.user_id) 'total_students' from  (select t.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id where quiz.user_id<>0) t group by t.user_id,t.quiz_id) t2 where t2.quiz_id=quiz.quiz_id) 'total_attempted',(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating'  from quiz left join quiz_subject on quiz.sub_id = quiz_subject.sub_id join products on quiz.product_id = products.product_id left join cv_users on quiz.user_id = cv_users.user_id left join cv_school_detail on cv_users.sch_id =cv_school_detail.sch_id where quiz.user_id !=0 and cv_users.role_id=3 and quiz.public_permission=? and quiz.visible=?",
    [params.public_permission, params.visible],
    function(err, data, fields) {
      if (err) {
      } else {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

router.post("/AllQuizes", (req, res) => {
  var params = req.body;
  pool.query(
    //"SELECT DATE(quiz.created_at) AS created_at,quiz.price,quiz.quiz_id,quiz.quiz_name,quiz.slug,quiz.sub_id, (CASE WHEN quiz.sub_id =1 THEN 'HTML' WHEN quiz.sub_id =2 THEN 'CSS' WHEN quiz.sub_id=3 THEN 'JavaScript' WHEN quiz.sub_id=4 THEN 'Python' WHEN quiz.sub_id=5 THEN 'SQL' ELSE '' END) AS 'Subject',(SELECT count(*) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_question',(SELECT sum(quiz_question.points)  from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_marks',(select count(t2.user_id) 'total_students' from  (select t.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id,st_quiz_result.checked from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id where quiz.user_id=0) t group by t.user_id,t.quiz_id) t2 where t2.quiz_id=quiz.quiz_id)'total_attempted',(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating'  from quiz join products on quiz.product_id = products.product_id where user_id =0",
    "SELECT DATE(quiz.created_at) AS created_at,quiz.price,quiz.quiz_id,quiz.quiz_name,quiz.slug,quiz.sub_id,quiz.public_institute, (CASE WHEN quiz.sub_id =1 THEN 'HTML' WHEN quiz.sub_id =2 THEN 'CSS' WHEN quiz.sub_id=3 THEN 'JavaScript' WHEN quiz.sub_id=4 THEN 'Python' WHEN quiz.sub_id=5 THEN 'SQL' ELSE '' END) AS 'Subject',quiz.quiz_img,quiz_subject.subject 'quiz_subject',(SELECT count(*) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_question',(SELECT sum(quiz_question.points)  from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_marks',(select count(t2.user_id) 'total_students' from  (select t.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result left join quiz on quiz.quiz_id = st_quiz_result.quiz_id where quiz.user_id=0) t group by t.user_id,t.quiz_id) t2 where t2.quiz_id=quiz.quiz_id)'total_attempted',(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = products.product_id) 'rating'  from quiz join products on quiz.product_id = products.product_id left join quiz_subject on quiz_subject.sub_id = quiz.sub_id where user_id =0",
    function(err, data, fields) {
      if (err) {
      } else {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/DisplayAllQuizes", (req, res) => {
  var params = req.body;
  ////console.log(params);
  pool.query(
    //"select DATE(quiz.created_at) AS created_at,quiz.quiz_id,quiz.quiz_name,quiz.slug, CASE WHEN quiz.sub_id =1 THEN 'HTML' WHEN quiz.sub_id =2 THEN 'CSS' WHEN quiz.sub_id=3 THEN 'JavaScript' WHEN quiz.sub_id=4 THEN 'Python' WHEN quiz.sub_id=5 THEN 'SQL' ELSE '' END AS 'Subject',count(quiz_que.que_id) AS 'total_question',sum(quiz_que.points) as 'total_marks',st_quiz_result.points 'obtain_points',cv_users.name AS 'created_by',st_quiz_result.attempted_at from quiz left join cv_users on (quiz.user_id=cv_users.user_id and cv_users.sch_id in(SELECT sch_id from cv_users where user_id=?))left join st_quiz_result on (st_quiz_result.quiz_id = quiz.quiz_id and st_quiz_result.user_id=?) left join quiz_questions as quiz_que on quiz.quiz_id = quiz_que.quiz_id group by quiz_que.quiz_id ORDER by quiz.quiz_id",
    "select DATE(quiz.created_at) AS created_at,quiz.quiz_id,quiz.quiz_name,quiz.slug,quiz_subject.sub_id,quiz_subject.subject,count(quiz_que.que_id) AS 'total_question',sum(quiz_que.points) as 'total_marks',st_quiz_result.points 'obtain_points',cv_users.name AS 'created_by',st_quiz_result.attempted_at from quiz left join quiz_subject on quiz.sub_id = quiz_subject.sub_id left join cv_users on (quiz.user_id=cv_users.user_id and cv_users.sch_id in(SELECT sch_id from cv_users where user_id=?))left join st_quiz_result on (st_quiz_result.quiz_id = quiz.quiz_id and st_quiz_result.user_id=?) left join quiz_question as quiz_que on quiz.quiz_id = quiz_que.quiz_id where quiz_subject.slug=? group by quiz_que.quiz_id ORDER by quiz.quiz_id",
    [params.user_id, params.user_id, params.slug],
    function(err, data, fields) {
      if (err) {
        throw err;
      } else {
        // //console.log(data);
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

router.post("/get_payment_detail", (req, res) => {
  var params = req.body;

  pool.query(
    //"SELECT quiz.quiz_name,quiz.sub_id,quiz.price,quiz_subject.subject,cv_users.name,cv_users.email,cv_users.contact,quiz.product_id,products.product_type from quiz left join products on quiz.product_id = products.product_id left join quiz_subject on quiz.sub_id =quiz_subject.sub_id join cv_users where quiz.quiz_id=? and cv_users.user_id=?",
    "SELECT case when products.product_type ='quiz' THEN quiz.quiz_name ELSE books.book_name END 'product_name',case WHEN products.product_type ='quiz' THEN quiz.slug ELSE books.slug END 'slug', products.product_id,products.product_type,quiz.sub_id,quiz.price,quiz_subject.subject,cv_users.name,cv_users.email,cv_users.contact,quiz.product_id,products.product_type  from products left join quiz on quiz.product_id = products.product_id left join quiz_subject on quiz.sub_id =quiz_subject.sub_id left join books on books.product_id = products.product_id join cv_users where cv_users.user_id=? and products.product_id=?",
    [params.user_id, params.product_id],
    function(err, data) {
      if (err) {
      } else {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

router.post("/get_product_payment_detail", (req, res) => {
  var params = req.body,
    query;
  var requestCountry = require("request-country");
  var geoip = require("geoip-lite");

  let ip = "117.220.166.122"; //"207.97.227.239"; //req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  //let ip = "207.97.227.239";
  //  let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  var geo = geoip.lookup(ip);
  //console.log(params);
  if (geo && geo.country != "IN")
    query =
      "SELECT 'USD' as 'cprice', (case when products.product_type ='quiz' THEN quiz.quiz_name WHEN products.product_type='live_course' then live_courses.live_course_name when products.product_type='byte_size_course' then byte_size_courses.byte_course_name ELSE books.book_name END) 'product_name',(CASE when products.product_type='quiz' THEN quiz.quiz_img WHEN products.product_type='live_course' then live_courses.img when products.product_type='byte_size_course' then byte_size_courses.img ELSE books.img END) 'img_name' ,(case WHEN products.product_type ='quiz' THEN quiz.quiz_desc WHEN products.product_type='live_course' then live_courses.live_course_outcomes when products.product_type='byte_size_course' then byte_size_courses.description ELSE books.course_description END) 'description',(case when products.product_type = 'quiz' THEN quiz.quiz_id WHEN products.product_type='live_course' then live_courses.live_course_id when products.product_type='byte_size_course' then byte_size_courses.byte_course_id else books.book_id end) 'p_p_id',(case WHEN products.product_type ='quiz' THEN quiz.slug WHEN products.product_type='live_course' then live_courses.live_course_slug when products.product_type='byte_size_course' then byte_size_courses.byte_course_slug  ELSE books.slug END) 'slug',books.prod_info, products.product_id,products.product_type,(case when products.product_type ='quiz' then quiz.sub_id WHEN products.product_type='live_course' then live_courses.live_course_id WHEN products.product_type='byte_size_course' then byte_size_courses.byte_course_id ELSE books.book_id end)'sub_id',(case when products.product_type = 'quiz' then quiz.price WHEN products.product_type='live_course' then live_courses.int_course_price when products.product_type='byte_size_course' then byte_size_courses.course_price ELSE books.price end) 'price',quiz_subject.subject,(SELECT cv_users.name from cv_users WHERE user_id=?) 'name',(SELECT cv_users.email from cv_users WHERE user_id=?) 'email',(SELECT cv_users.contact from cv_users WHERE user_id=?) 'contact',(SELECT cv_users.sch_id from cv_users where cv_users.user_id =?) 'sch_id',(SELECT orders.status from orders where orders.user_id =? and orders.product_id = products.product_id and orders.status =1) 'purchased_status'  from products left join quiz on (quiz.product_id = products.product_id) left join quiz_subject on (quiz.sub_id =quiz_subject.sub_id) left join books on (books.product_id = products.product_id) left join live_courses on (live_courses.product_id = products.product_id) LEFT join byte_size_courses on (byte_size_courses.product_id = products.product_id) where products.product_id =?";
  else
    query =
      "SELECT 'IN' as 'cprice', (case when products.product_type ='quiz' THEN quiz.quiz_name WHEN products.product_type='live_course' then live_courses.live_course_name when products.product_type='byte_size_course' then byte_size_courses.byte_course_name ELSE books.book_name END) 'product_name',(CASE when products.product_type='quiz' THEN quiz.quiz_img WHEN products.product_type='live_course' then live_courses.img when products.product_type='byte_size_course' then byte_size_courses.img ELSE books.img END) 'img_name' ,(case WHEN products.product_type ='quiz' THEN quiz.quiz_desc WHEN products.product_type='live_course' then live_courses.live_course_outcomes when products.product_type='byte_size_course' then byte_size_courses.description ELSE books.course_description END) 'description',(case when products.product_type = 'quiz' THEN quiz.quiz_id WHEN products.product_type='live_course' then live_courses.live_course_id when products.product_type='byte_size_course' then byte_size_courses.byte_course_id else books.book_id end) 'p_p_id',(case WHEN products.product_type ='quiz' THEN quiz.slug WHEN products.product_type='live_course' then live_courses.live_course_slug when products.product_type='byte_size_course' then byte_size_courses.byte_course_slug  ELSE books.slug END) 'slug',books.prod_info, products.product_id,products.product_type,(case when products.product_type ='quiz' then quiz.sub_id WHEN products.product_type='live_course' then live_courses.live_course_id WHEN products.product_type='byte_size_course' then byte_size_courses.byte_course_id ELSE books.book_id end)'sub_id',(case when products.product_type = 'quiz' then quiz.price WHEN products.product_type='live_course' then live_courses.course_price when products.product_type='byte_size_course' then byte_size_courses.course_price ELSE books.price end) 'price',quiz_subject.subject,(SELECT cv_users.name from cv_users WHERE user_id=?) 'name',(SELECT cv_users.email from cv_users WHERE user_id=?) 'email',(SELECT cv_users.contact from cv_users WHERE user_id=?) 'contact',(SELECT cv_users.sch_id from cv_users where cv_users.user_id =?) 'sch_id',(SELECT orders.status from orders where orders.user_id =? and orders.product_id = products.product_id and orders.status =1) 'purchased_status'  from products left join quiz on (quiz.product_id = products.product_id) left join quiz_subject on (quiz.sub_id =quiz_subject.sub_id) left join books on (books.product_id = products.product_id) left join live_courses on (live_courses.product_id = products.product_id) LEFT join byte_size_courses on (byte_size_courses.product_id = products.product_id) where products.product_id =?";
  pool.query(
    query,
    [
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.product_id,
    ],
    function(err, data) {
      if (err) {
        //console.log(err);
      } else {
        //  console.log(data);
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/get_coupons_detail", (req, res) => {
  var params = req.body;

  pool.query(
    //"SELECT t.* from (SELECT cv_coupons.coupon_id,cv_coupons.coupon_code,cv_coupons.coupon_desc,cv_coupons.discount,cv_coupons.start_date,cv_coupons.expiry_date,cv_coupons.product_id,cv_coupons.visible_all,cv_coupons.times_used,(SELECT count(orders.coupon_id) from orders where user_id =? and orders.status =1 and orders.coupon_id = cv_coupons.coupon_id) 'coupons_used_times',(select count(*) from  cv_coupons  where cv_coupons.visible_all =0 )'private_coupons' from cv_coupons  where (cv_coupons.product_id = ? or cv_coupons.product_id =0) and (cv_coupons.expiry_date IS NULL or cv_coupons.expiry_date >= now()))t where (t.times_used - t.coupons_used_times) > 0  order by t.coupon_id desc",
    "SELECT t.* from (SELECT cv_coupons.coupon_id,cv_coupons.user_id 'cuser_id',cv_coupons.coupon_code,cv_coupons.coupon_desc,cv_coupons.discount,cv_coupons.start_date,cv_coupons.expiry_date,cv_coupons.product_id,cv_coupons.visible_all,cv_coupons.times_used,(SELECT count(orders.coupon_id) from orders where user_id =? and orders.status =1 and orders.coupon_id = cv_coupons.coupon_id) 'coupons_used_times',(SELECT count(orders.coupon_id) from orders where orders.status =1 and orders.coupon_id = cv_coupons.coupon_id) 'ind_coupons_used_times',(select count(*) from  cv_coupons  where cv_coupons.visible_all =0)'private_coupons' from cv_coupons  where (cv_coupons.product_id = ? or cv_coupons.product_id =0) and (cv_coupons.expiry_date IS NULL or cv_coupons.expiry_date >= now()))t where (t.times_used - t.coupons_used_times) > 0 and (case when t.cuser_id<>0 then (t.times_used -t.ind_coupons_used_times>0) else true end)  order by t.coupon_id desc",
    [params.user_id, params.product_id],
    function(err, data) {
      if (err) {
      } else {
        res.json({
          status: 200,
          data: data,
        });
      }
    }
  );
});
//question of the day
router.post("/DisplayQuizesAllQuestions", (req, res) => {
  var params = req.body;
  // //console.log(params);
  pool.query(
    "SELECT quiz_questions.que_id,quiz_questions.points,quiz_type.type,quiz_type.qt_id,quiz_questions.question, quiz_subject.subject AS 'Subject',quiz_questions.points from quiz_questions left join quiz_type on quiz_questions.qt_id =quiz_type.qt_id left join quiz_subject on (quiz_subject.sub_id = quiz_questions.sub_id) where quiz_questions.user_id in(select user_id from cv_users where sch_id in(select sch_id from cv_users where user_id=?))  and quiz_questions.que_id not in(SELECT que_id from st_quiz_result where user_id=?) order by quiz_questions.sub_id",
    [params.user_id, params.user_id],
    function(err, data, fields) {
      if (err) {
      } else {
        //   //console.log(data);
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/DisplayQuizeAllQuestions", (req, res) => {
  var params = req.body;
  pool.query(
    /*"SELECT quiz_question.que_id,quiz_question.points,quiz_type.type,quiz_type.qt_id,questions_for_quiz.question,quiz.quiz_name,quiz.slug 'quiz_slug',quiz.price,quiz.quiz_id,questions_for_quiz.qt_id,quiz_subject.subject,(select sum(points) from quiz_question left join quiz on quiz_question.quiz_id = quiz.quiz_id where quiz_question.quiz_id=?) 'total_points',(select sum(points) from st_quiz_result left join quiz on st_quiz_result.quiz_id = quiz.quiz_id where st_quiz_result.quiz_id=? and st_quiz_result.user_id=?) 'obtain_points', st_quiz_result.que_id 'atempt_que',orders.status from quiz_question join questions_for_quiz on quiz_question.que_id = questions_for_quiz.que_id left join quiz_subject on questions_for_quiz.sub_id =quiz_subject.sub_id left join quiz_type on questions_for_quiz.qt_id =quiz_type.qt_id left join quiz on quiz_question.quiz_id = quiz.quiz_id left join st_quiz_result on (quiz_question.que_id =st_quiz_result.que_id and st_quiz_result.user_id=? and st_quiz_result.quiz_id=?) left join orders on (orders.product_id =quiz.product_id and orders.user_id=?) where quiz_question.quiz_id=?",
    [
      params.quiz_id,
      params.quiz_id,
      params.user_id,
      params.user_id,
      params.quiz_id,
      params.user_id,
      params.quiz_id
    ],*/
    "SELECT quiz_question.que_id,quiz_question.points,quiz_type.type,quiz_type.qt_id,questions_for_quiz.question,quiz.quiz_name,quiz.user_id,quiz.slug 'quiz_slug',quiz.price,quiz.quiz_id,questions_for_quiz.qt_id,quiz_subject.subject,(select sum(points) from quiz_question left join quiz on quiz_question.quiz_id = quiz.quiz_id where quiz_question.quiz_id=?) 'total_points',(select sum(points) from st_quiz_result left join quiz on st_quiz_result.quiz_id = quiz.quiz_id where st_quiz_result.quiz_id=? and st_quiz_result.user_id=?) 'obtain_points', st_quiz_result.que_id 'atempt_que',(SELECT count(st_quiz_result.que_id) FROM st_quiz_result left join quiz on st_quiz_result.quiz_id = quiz.quiz_id WHERE st_quiz_result.quiz_id =? and st_quiz_result.user_id =?)'total_attempted_questions',(select COUNT(quiz_question.que_id) from quiz_question where quiz_question.quiz_id=?) 'total_questions',orders.status from quiz_question join questions_for_quiz on quiz_question.que_id = questions_for_quiz.que_id left join quiz_subject on questions_for_quiz.sub_id =quiz_subject.sub_id left join quiz_type on questions_for_quiz.qt_id =quiz_type.qt_id left join quiz on quiz_question.quiz_id = quiz.quiz_id left join st_quiz_result on (quiz_question.que_id =st_quiz_result.que_id and st_quiz_result.user_id=? and st_quiz_result.quiz_id=?) left join orders on (orders.product_id =quiz.product_id and orders.user_id=? and orders.status IS NOT NULL) where quiz_question.quiz_id=? and quiz.public_institute=1",
    [
      params.quiz_id,
      params.quiz_id,
      params.user_id,
      params.quiz_id,
      params.user_id,
      params.quiz_id,
      params.user_id,
      params.quiz_id,
      params.user_id,
      params.quiz_id,
    ],
    function(err, data, fields) {
      if (err) {
      } else {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/DisplayPoints", (req, res) => {
  var params = req.body;
  ////console.log(params);
  pool.query(
    "select sum(points) as points FROM `st_quiz_result` where user_id=?",
    [params.user_id],
    function(err, data, fields) {
      if (err) {
        //console.log(err);
      } else {
        // //console.log(data);
        if (data.length != 0) {
          res.json({
            status: "200",
            data: data,
          });
        } else {
          res.json({
            status: "200",
            data: "0",
          });
        }
      }
    }
  );
});

router.post("/updateCoinsInWallet", (req, res) => {
  var params = req.body;

  pool.query(
    //"SELECT sum(st_quiz_result.points) 'obtained',(SELECT COUNT(*) from st_quiz_result s where s.quiz_id =st_quiz_result.quiz_id and s.user_id=?) 'attempted_que',(SELECT COUNT(*) from quiz_question s where s.quiz_id =st_quiz_result.quiz_id) 'total_que',quiz.user_id 'quiz_user_id',(select count(t2.user_id) 'total_students' from (select t.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id,st_quiz_result.checked from st_quiz_result WHERE st_quiz_result.quiz_id =?) t GROUP by t.user_id having  t.checked=0) t2) 'total_attempt_users',quiz.product_id FROM `st_quiz_result` join quiz on quiz.quiz_id = st_quiz_result.quiz_id and st_quiz_result.user_id=?  where   quiz.quiz_id =? group by st_quiz_result.quiz_id HAVING attempted_que = total_que order by max(st_quiz_result.attempted_at) desc",
    "SELECT sum(st_quiz_result.points) 'obtained',(SELECT COUNT(*) from st_quiz_result s where s.quiz_id =st_quiz_result.quiz_id and s.user_id=?) 'attempted_que',(SELECT COUNT(*) from quiz_question s where s.quiz_id =st_quiz_result.quiz_id) 'total_que',quiz.user_id 'quiz_user_id',(select count(t2.user_id) 'total_students' from (select t.* from (select st_quiz_result.user_id,st_quiz_result.quiz_id from st_quiz_result WHERE st_quiz_result.quiz_id =? and st_quiz_result.checked=0) t GROUP by t.user_id) t2)'total_attempt_users',quiz.product_id FROM `st_quiz_result` left join quiz on quiz.quiz_id = st_quiz_result.quiz_id and st_quiz_result.user_id=?  where  quiz.quiz_id =? group by st_quiz_result.quiz_id HAVING attempted_que = total_que order by max(st_quiz_result.attempted_at) desc",
    [params.user_id, params.quiz_id, params.user_id, params.quiz_id],
    function(err, data) {
      if (!err) {
        let qry =
          "UPDATE `cv_users` cu,cv_users c1 SET cu.coin_earned =  cu.coin_earned + " +
          data[0].obtained +
          " WHERE cu.user_id = c1.user_id and cu.user_id =" +
          params.user_id;
        pool.query(qry, function(err, data1) {
          if (!err) {
            if (data[0].quiz_user_id != 0) {
              let new_coin = (data[0].total_attempt_users * 5) / 100;
              let qry1 =
                "UPDATE `cv_users` cu,cv_users c1 SET cu.coin_earned =  cu.coin_earned + " +
                new_coin +
                " WHERE cu.user_id = c1.user_id and cu.user_id = " +
                data[0].quiz_user_id;
              pool.query(qry1, function(err, data2) {
                if (err) {
                  console.log(err);
                } else {
                  pool.query(
                    "update st_quiz_result set checked=1 where quiz_id=?",
                    [params.quiz_id],
                    function(err, data4) {
                      if (!err) {
                        pool.query(
                          "SELECT `prod_f_id`, `product_id` FROM `product_feedback` WHERE product_id =? and user_id=?",
                          [data[0].product_id, params.user_id],
                          function(err, feedbackdata) {
                            if (!err) {
                              if (feedbackdata.length) {
                                pool.query(
                                  "update product_feedback set `obt_rat`=?,`max_rat`=?,`message`=? where product_id=? and user_id=?",
                                  [
                                    params.rating,
                                    5,
                                    params.message,
                                    data[0].product_id,
                                    params.user_id,
                                  ],
                                  function(err, feebackresponce) {
                                    if (!err) {
                                      res.json({
                                        status: 200,
                                        data: 1,
                                      });
                                    } else console.log(err);
                                  }
                                );
                              } else {
                                pool.query(
                                  "INSERT INTO `product_feedback`(`user_id`, `product_id`, `obt_rat`, `max_rat`, `message`) VALUES (?,?,?,?,?)",
                                  [
                                    params.user_id,
                                    data[0].product_id,
                                    params.rating,
                                    5,
                                    params.message,
                                  ],
                                  function(err, feedbackdata) {
                                    if (!err) {
                                      res.json({
                                        status: 200,
                                        data: 1,
                                      });
                                    } else console.log(err);
                                  }
                                );
                              }
                            } else console.log(err);
                          }
                        );
                      } else {
                        console.log(err);
                      }
                    }
                  );
                }
              });
            } else {
              pool.query(
                "SELECT `prod_f_id`, `product_id` FROM `product_feedback` WHERE product_id =? and user_id=?",
                [data[0].product_id, params.user_id],
                function(err, feedbackdata) {
                  if (!err) {
                    if (feedbackdata.length) {
                      pool.query(
                        "update product_feedback set `obt_rat`=?,`max_rat`=?,`message`=? where product_id=? and user_id=?",
                        [
                          params.rating,
                          5,
                          params.message,
                          data[0].product_id,
                          params.user_id,
                        ],
                        function(err, feebackresponce) {
                          if (!err) {
                            res.json({
                              status: 200,
                              data: 1,
                            });
                          } else console.log(err);
                        }
                      );
                    } else {
                      pool.query(
                        "INSERT INTO `product_feedback`(`user_id`, `product_id`, `obt_rat`, `max_rat`, `message`) VALUES (?,?,?,?,?)",
                        [
                          params.user_id,
                          data[0].product_id,
                          params.rating,
                          5,
                          params.message,
                        ],
                        function(err, feedbackdata) {
                          if (!err) {
                            res.json({
                              status: 200,
                              data: 1,
                            });
                          } else console.log(err);
                        }
                      );
                    }
                  } else console.log(err);
                }
              );
            }
          } else {
            console.log(err);
          }
        });
      } else {
        console.log(err);
      }
    }
  );
});
router.post("/insertQuizResult", (req, res) => {
  ////console.log(req);
  var params = req.body;

  pool.query(
    "select * from st_quiz_result where que_id=? and user_id=? and quiz_id=?",
    [params.que_id, params.user_id, params.quiz_id],
    function(err, datas, fields) {
      if (err) {
      } else {
        // //console.log(datas);
        if (datas.length != 0) {
          //updation command
          pool.query(
            "UPDATE `st_quiz_result` SET points=?,attempted_at=now() where que_id=? and user_id=? and quiz_id=?",
            [params.point, params.que_id, params.user_id, params.quiz_id],
            function(err, data1) {
              if (err) {
              } else {
                pool.query(
                  "select sum(points) as points FROM `st_quiz_result` where user_id=? and quiz_id=?",
                  [params.user_id, params.quiz_id],
                  function(err, data, fields) {
                    if (err) {
                      // //console.log(err);
                    } else {
                      // //console.log(data);
                      res.json({
                        status: "200",
                        data: data,
                      });
                    }
                  }
                );
              }
            }
          );
        } else {
          //insert query
          pool.query(
            "INSERT INTO `st_quiz_result`(`que_id`, `user_id`, `points`,`quiz_id`) values(?,?,?,?)",
            [params.que_id, params.user_id, params.point, params.quiz_id],
            function(err, result1, fields) {
              if (err) {
                //  //console.log(err);
              } else {
                pool.query(
                  "select sum(points) as points FROM `st_quiz_result` where user_id=? and quiz_id=?",
                  [params.user_id, params.quiz_id],
                  function(err, data, fields) {
                    if (err) {
                      // //console.log(err);
                    } else {
                      res.json({
                        status: "200",
                        data: data,
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    }
  );
});

router.post("/InsertChallengeQuestion", (req, res) => {
  var params = req.body;
  ////console.log(params);
  pool.query(
    //"select * from quiz_questions where sub_id =? and user_id=? and qt_id=? and question=? and quiz_id=?",
    "select * from quiz_questions where sub_id =? and user_id=? and qt_id=? and question=? and quiz_id=?",
    [
      params.sub_id,
      params.user_id,
      params.qt_id,
      params.question,
      params.quiz_id,
    ],
    function(err, data, fields) {
      if (err) {
        throw err;
      } else {
        if (data.length != 0) {
          res.json({
            status: "200",
            data: "0",
          });
        } else {
          pool.query(
            "INSERT INTO `quiz_questions`(`sub_id`, `quiz_id`, `user_id`, `qt_id`, `question`, `points`) VALUES(?,?,?,?,?,?)",
            [
              params.sub_id,
              params.quiz_id,
              params.user_id,
              params.qt_id,
              params.question,
              params.point,
            ],
            function(err, result1, fields) {
              if (err) {
                throw err;
              } else {
                res.json({
                  status: "200",
                  data: "1", //result1,
                });
              }
            }
          );
        }
      }
    }
  );
});

router.post("/sent_public_request", (req, res) => {
  var params = req.body;
  pool.query(
    "update quiz set public_permission =1,public_institute=1 where quiz_id =? and user_id=?",
    [params.quiz_id, params.user_id],
    function(err, data) {
      if (err) {
      } else {
        res.json({
          status: 200,
          data: 1,
        });
      }
    }
  );
});

router.post("/sent_inst_request", (req, res) => {
  var params = req.body;
  pool.query(
    "update quiz set public_institute=1 where quiz_id =? and user_id=?",
    [params.quiz_id, params.user_id],
    function(err, data) {
      if (err) {
      } else {
        res.json({
          status: 200,
          data: 1,
        });
      }
    }
  );
});
router.post("/get_public_quiz_updation", (req, res) => {
  var params = req.body;

  pool.query(
    "select count(*) 'exists' from quiz where  quiz_name=?",
    [params.quiz_name],
    function(err, data) {
      if (!err) {
        if (data[0].exists > 0) {
          res.json({
            status: "200",
            data: data[0].exists + 1,
          });
        } else {
          var qury =
            "UPDATE `quiz` SET quiz_name='" +
            params.quiz_name +
            "',slug='" +
            params.quiz_name.replace(/\s/g, "_").toLowerCase() +
            "' where quiz_id=" +
            params.quiz_id +
            "";

          pool.query(qury, function(err, data2, fields) {
            if (err) {
            } else {
              res.json({
                status: 200,
                data: 1,
              });
            }
          });
        }
      }
    }
  );
});

router.post("/get_public_quiz_existance", (req, res) => {
  var params = req.body;
  pool.query(
    "select count(*) 'exists' from quiz where  quiz_name=?",
    [params.quiz_name],
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data[0].exists,
        });
      }
    }
  );
});

router.post("/InsertTeacherQuizMultipleQuestions", (req, res) => {
  var params = req.body;

  var data = params.questions_id;
  let flag = 0;
  var conn;

  return db
    .getConnection()
    .then((connection) => {
      conn = connection;
    })
    .then(() => {
      conn.beginTransaction(function(err) {
        if (err) {
          conn.release();
          res.json({
            status: "200",
            data: "0",
          });
          return;
        }
        for (var i = 0; i < data.length; i++) {
          conn.query(
            "INSERT INTO `quiz_question`(`que_id`, `quiz_id`, `points`) values(?,?,?)",
            [data[i].que_id, params.quiz_id, data[i].point],
            function(err) {
              if (err) {
                return conn.rollback(function() {
                  throw err;
                });
              } else {
                flag = 1;
              }
            }
          );
        }

        conn.commit(function(err) {
          if (err) {
            return conn.rollback(function() {
              throw err;
            });
          } else {
            conn.query(
              "SELECT DISTINCT * FROM questions_for_quiz WHERE sub_id=? and user_id =? and que_id not in(SELECT que_id from quiz_question where quiz_id=? )",
              [params.sub_id, params.user_id, params.quiz_id],
              function(err, data2) {
                if (err) {
                  conn.release();
                } else {
                  conn.release();
                  res.json({
                    status: "200",
                    data: data2,
                  });
                }
              }
            );
          }
        });
      });
    })
    .catch((err) => {
      try {
        conn.release();
      } catch (e) {}
    });
});

router.post("/InsertQuizMultipleQuestions", (req, res) => {
  ////console.log(req.body);
  var params = req.body;
  var data = params.questions_id;
  let flag = 0;

  var conn;

  return db
    .getConnection()
    .then((connection) => {
      conn = connection;
    })
    .then(() => {
      conn.beginTransaction(function(err) {
        if (err) {
          conn.release();
          res.json({
            status: "200",
            data: "0",
          });
          return;
        }
        for (var i = 0; i < data.length; i++) {
          conn.query(
            "INSERT INTO `quiz_question`(`que_id`, `quiz_id`, `points`) values(?,?,?)",
            [data[i].que_id, params.quiz_id, data[i].point],
            function(err) {
              if (err) {
                return conn.rollback(function() {
                  throw err;
                });
              } else {
                flag = 1;
              }
            }
          );
        }

        conn.commit(function(err) {
          if (err) {
            return conn.rollback(function() {
              throw err;
            });
          } else {
            conn.query(
              "SELECT DISTINCT * FROM questions_for_quiz WHERE sub_id=? and que_id not in(SELECT que_id from quiz_question where quiz_id=? )",
              [params.sub_id, params.quiz_id],
              function(err, data) {
                if (err) {
                  conn.release();
                } else {
                  conn.release();
                  res.json({
                    status: "200",
                    data: data,
                  });
                }
              }
            );
          }
        });
      });
    })
    .catch((err) => {
      try {
        conn.release();
      } catch (e) {}
    });
});

router.post("/InsertTeacherQuizQuestions", (req, res) => {
  var params = req.body;

  pool.query(
    "select * from questions_for_quiz where sub_id=? and qt_id=? and question=? and user_id =?",
    [params.sub_id, params.qt_id, params.question, params.user_id],
    function(err, data, fields) {
      if (err) {
      } else {
        if (data.length != 0) {
          pool.query(
            "select * from quiz_question where que_id=? and quiz_id=?",
            [data[0].que_id, params.quiz_id],
            function(err, data2, fields) {
              if (err) {
              } else {
                if (data2.length != 0) {
                  res.json({
                    status: "200",
                    data: "0",
                  });
                } else {
                  pool.query(
                    "INSERT INTO `quiz_question`(`que_id`, `quiz_id`, `points`) values(?,?,?)",
                    [data2[0].que_id, params.que_id, params.point],
                    function(err, data1, fields) {
                      res.json({
                        status: "200",
                        data: "1",
                      });
                    }
                  );
                }
              }
            }
          );
        } else {
          pool.query(
            "INSERT INTO `questions_for_quiz`(`question`, `sub_id`, `qt_id`,`user_id`) values(?,?,?,?)",
            [params.question, params.sub_id, params.qt_id, params.user_id],
            function(err, result) {
              if (err) {
              } else {
                pool.query(
                  "select * from questions_for_quiz where user_id =? order by que_id desc limit 1",
                  [params.user_id],
                  function(err, data1, fields) {
                    if (err) {
                      //console.log(err);
                    } else {
                      pool.query(
                        "INSERT INTO `quiz_question`(`que_id`, `quiz_id`, `points`) values(?,?,?)",
                        [data1[0].que_id, params.quiz_id, params.point],
                        function(err, data1, fields) {
                          if (err) {
                          } else {
                            res.json({
                              status: "200",
                              data: "1",
                            });
                          }
                        }
                      );
                    }
                  }
                );
                /*pool.query("INSERT INTO `quiz_question`(`que_id`, `quiz_id`, `points`) values(?,?,?)",
      [params.que_id]
      );*/
              }
            }
          );
        }
      }
    }
  );
});

router.post("/InsertQuizQuestions", (req, res) => {
  var params = req.body;

  pool.query(
    "select * from questions_for_quiz where sub_id=? and qt_id=? and question=?",
    [params.sub_id, params.qt_id, params.question],
    function(err, data, fields) {
      if (err) {
      } else {
        if (data.length != 0) {
          pool.query(
            "select * from quiz_question where que_id=? and quiz_id=?",
            [data[0].que_id, params.quiz_id],
            function(err, data2, fields) {
              if (err) {
              } else {
                if (data2.length != 0) {
                  res.json({
                    status: "200",
                    data: "0",
                  });
                } else {
                  pool.query(
                    "INSERT INTO `quiz_question`(`que_id`, `quiz_id`, `points`) values(?,?,?)",
                    [data2[0].que_id, params.que_id, params.point],
                    function(err, data1, fields) {
                      res.json({
                        status: "200",
                        data: "1",
                      });
                    }
                  );
                }
              }
            }
          );
        } else {
          pool.query(
            "INSERT INTO `questions_for_quiz`(`question`, `sub_id`, `qt_id`) values(?,?,?)",
            [params.question, params.sub_id, params.qt_id],
            function(err, result) {
              if (err) {
              } else {
                pool.query(
                  "select * from questions_for_quiz order by que_id desc limit 1",
                  function(err, data1, fields) {
                    if (err) {
                      //console.log(err);
                    } else {
                      pool.query(
                        "INSERT INTO `quiz_question`(`que_id`, `quiz_id`, `points`) values(?,?,?)",
                        [data1[0].que_id, params.quiz_id, params.point],
                        function(err, data1, fields) {
                          if (err) {
                          } else {
                            res.json({
                              status: "200",
                              data: "1",
                            });
                          }
                        }
                      );
                    }
                  }
                );
                /*pool.query("INSERT INTO `quiz_question`(`que_id`, `quiz_id`, `points`) values(?,?,?)",
      [params.que_id]
      );*/
              }
            }
          );
        }
      }
    }
  );
  /*pool.query("select * from quiz_question where sub_id =? and user_id=? and qt_id=? and question=? and quiz_id=?",[
    params.sub_id,
    params.user_id,
    params.qt_id,
     params.question,
     params.quiz_id
  ], function(err,data,fields){
     if(err)
     {
       throw err;
     }
     else{
        if(data.length!=0)
        {
          res.json({
            status:"200",
            data:"0",
          });
        }
        else{
             pool.query("INSERT INTO `quiz_questions`(`sub_id`, `quiz_id`, `user_id`, `qt_id`, `question`, `points`) VALUES(?,?,?,?,?,?)",[
               params.sub_id,
               params.quiz_id,
               params.user_id,
               params.qt_id,
               params.question,
               params.point
             ],function(err, result1, fields) {
              if (err) {
                throw err;
              } else {
                      res.json({
                      status: "200",
                      data:"1", //result1,
                    });
                  }
                });  
        }
     }
  });*/
});
router.post("/DeleteQuizQuestion", (req, res) => {
  var params = req.body;
  pool.query(
    "DELETE FROM `quiz_question` WHERE que_id=? and quiz_id=?",
    [params.que_id, params.quiz_id],
    function(err, data) {
      if (err) {
      } else {
        res.json({
          status: "200",
          data: "1",
        });
      }
    }
  );
});
router.post("/DisplayCurrentQuizQuestions", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT DISTINCT questions_for_quiz.que_id,questions_for_quiz.question,questions_for_quiz.sub_id,questions_for_quiz.qt_id,quiz_question.points,(SELECT count(que_id) from quiz_question where quiz_question.que_id =questions_for_quiz.que_id group by quiz_question.que_id) 'used_times' FROM questions_for_quiz join quiz_question on (questions_for_quiz.que_id = quiz_question.que_id and quiz_id=?) WHERE questions_for_quiz.sub_id=?",
    [params.quiz_id, params.sub_id],
    function(err, data) {
      if (err) {
      } else {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/get_subject", (req, res) => {
  var params = req.body;
  pool.query("select * from quiz_subject", function(err, data) {
    if (err) {
      //console.log(err);
    } else {
      // //console.log(data);
      res.json({
        status: "200",
        data: data,
      });
    }
  });
});
router.post("/getSubTopicsForQuiz", (req, res) => {
  let params = req.body;
  pool.query(
    "SELECT * FROM `book_title` WHERE book_title.book_id=?",
    [params.book_id],
    function(err, data) {
      if (err) console.log(err);
      else res.send(data);
    }
  );
});
router.post("/get_course_subjects", (req, res) => {
  let params = req.body;
  pool.query(
    "SELECT books.* FROM `books` inner join books_price on (books.book_id = books_price.book_id) where books_price.downloaad=0",
    function(err, data) {
      if (err) {
        throw err;
      } else {
        res.send(data);
      }
    }
  );
});

router.post("/DisplayAllTeacherQuizQuestions", (req, res) => {
  var params = req.body;
  //pool.query("SELECT * FROM `questions_for_quiz` left join quiz_question on (questions_for_quiz.que_id =quiz_question.que_id and quiz_question.quiz_id!=? )  WHERE sub_id=?",[params.quiz_id,params.sub_id],function(err,data){
  pool.query(
    "SELECT DISTINCT questions_for_quiz.*,(SELECT count(que_id) from quiz_question where quiz_question.que_id = questions_for_quiz.que_id group by quiz_question.que_id) 'used_times' FROM questions_for_quiz WHERE sub_id=? and user_id =? and que_id not in(SELECT que_id from quiz_question where quiz_id=?)",
    [params.sub_id, params.user_id, params.quiz_id],
    function(err, data) {
      if (err) {
      } else {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

router.post("/DisplayQuizQuestions", (req, res) => {
  var params = req.body;
  //pool.query("SELECT * FROM `questions_for_quiz` left join quiz_question on (questions_for_quiz.que_id =quiz_question.que_id and quiz_question.quiz_id!=? )  WHERE sub_id=?",[params.quiz_id,params.sub_id],function(err,data){
  pool.query(
    "SELECT DISTINCT questions_for_quiz.*,(SELECT count(que_id) from quiz_question where quiz_question.que_id = questions_for_quiz.que_id group by quiz_question.que_id) 'used_times' FROM questions_for_quiz WHERE sub_id=? and que_id not in(SELECT que_id from quiz_question where quiz_id=?)",
    [params.sub_id, params.quiz_id],
    function(err, data) {
      if (err) {
      } else {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

/***challenge */
router.post("/InsertQuizQuestion", (req, res) => {
  var params = req.body;
  ////console.log(params);
  pool.query(
    "select * from quiz_question where sub_id =? and user_id=? and qt_id=? and question=? and quiz_id=?",
    [
      params.sub_id,
      params.user_id,
      params.qt_id,
      params.question,
      params.quiz_id,
    ],
    function(err, data, fields) {
      if (err) {
        throw err;
      } else {
        if (data.length != 0) {
          res.json({
            status: "200",
            data: "0",
          });
        } else {
          pool.query(
            "INSERT INTO `quiz_questions`(`sub_id`, `quiz_id`, `user_id`, `qt_id`, `question`, `points`) VALUES(?,?,?,?,?,?)",
            [
              params.sub_id,
              params.quiz_id,
              params.user_id,
              params.qt_id,
              params.question,
              params.point,
            ],
            function(err, result1, fields) {
              if (err) {
                throw err;
              } else {
                res.json({
                  status: "200",
                  data: "1", //result1,
                });
              }
            }
          );
        }
      }
    }
  );
});

//update price
router.post("/UpdateQuizPrice", (req, res) => {
  var params = req.body;
  // console.log(params);
  pool.query(
    "UPDATE `quiz` SET price =? where quiz_id=?",
    [params.quiz_price, params.quiz_id],
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: "success",
        });
      }
    }
  );
});
router.post("/update_quiz_basic", (req, res) => {
  var params = req.body;

  pool.query(
    "select * from quiz where quiz_id=? and user_id=? ",
    [params.quiz_id, params.user_id],
    function(err, data1) {
      if (!err) {
        let public_permission = data1[0].public_permission;
        if (public_permission == 1) {
          pool.query(
            "select * from quiz where (quiz_name =? or slug = ?) and quiz_id <> ? and (user_id=0 or public_permission=1)",
            [
              params.quiz_name,
              params.quiz_name.replace(" ", "_").toLowerCase(),
              params.quiz_id,
            ],
            function(err, data2) {
              if (data2.length) {
                res.send("0");
              } else {
                /****change query */
                pool.query(
                  "update `quiz` set quiz_name =?,quiz_desc=?,slug = ? where quiz_id=?",
                  [
                    params.quiz_name,
                    params.quiz_desc,
                    params.quiz_name.replace(" ", "_").toLowerCase(),
                    params.quiz_id,
                  ],
                  function(err, data) {
                    res.send(data);
                  }
                );
                /******end changes query */
              }
            }
          );
        } else {
          pool.query(
            "select * from quiz where (quiz_name =? or slug = ?) and user_id =? and quiz_id <> ?",
            [
              params.quiz_name,
              params.quiz_name.replace(" ", "_").toLowerCase(),
              params.user_id,
              params.quiz_id,
            ],
            function(err, data2) {
              if (data2.length) {
                res.send("0");
              } else {
                /****change query */
                pool.query(
                  "update `quiz` set quiz_name =?,quiz_desc=?,slug=? where quiz_id=?",
                  [
                    params.quiz_name,
                    params.quiz_desc,
                    params.quiz_name.replace(" ", "_").toLowerCase(),
                    params.quiz_id,
                  ],
                  function(err, data) {
                    res.send(data);
                  }
                );
                /******end changes query */
              }
            }
          );
        }
      } else console.log(err);
    }
  );
});

/*********Admin side Quiz update */
router.post("/update_quiz_basic_admin", (req, res) => {
  var params = req.body;

  pool.query("select * from quiz where quiz_id=? ", [params.quiz_id], function(
    err,
    data1
  ) {
    if (!err) {
      let public_permission = data1[0].public_permission;
      if (public_permission == 1) {
        pool.query(
          "select * from quiz where (quiz_name =? or slug = ?) and quiz_id <> ? and (user_id=0 or public_permission=1)",
          [
            params.quiz_name,
            params.quiz_name.replace(" ", "_").toLowerCase(),
            params.quiz_id,
          ],
          function(err, data2) {
            if (data2.length) {
              res.send("0");
            } else {
              /****change query */
              pool.query(
                "update `quiz` set quiz_name =?,quiz_desc=?,slug = ? where quiz_id=?",
                [
                  params.quiz_name,
                  params.quiz_desc,
                  params.quiz_name.replace(" ", "_").toLowerCase(),
                  params.quiz_id,
                ],
                function(err, data) {
                  res.send(data);
                }
              );
              /******end changes query */
            }
          }
        );
      } else {
        pool.query(
          "select * from quiz where (quiz_name =? or slug = ?)  and quiz_id <> ?",
          [
            params.quiz_name,
            params.quiz_name.replace(" ", "_").toLowerCase(),

            params.quiz_id,
          ],
          function(err, data2) {
            if (data2.length) {
              res.send("0");
            } else {
              /****change query */
              pool.query(
                "update `quiz` set quiz_name =?,quiz_desc=?,slug=? where quiz_id=?",
                [
                  params.quiz_name,
                  params.quiz_desc,
                  params.quiz_name.replace(" ", "_").toLowerCase(),
                  params.quiz_id,
                ],
                function(err, data) {
                  res.send(data);
                }
              );
              /******end changes query */
            }
          }
        );
      }
    } else console.log(err);
  });
});
/*****End Admin side Quiz Update */
/*********Upload images for Quiz */
/* Quiz icon */
var quizIconStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.resolve(appRoot + "/dynamic/Quizzes/quiz_img"));
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});
var QuizUploadIcon = multer({ storage: quizIconStorage });
router.post("/quiz_icon_img", QuizUploadIcon.any(), (req, res, next) => {
  res.end();
});

/* end Quiz icon */
/** **Upload Question image for Quiz */
var quizQuestionStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(
      null,
      path.resolve(appRoot + "/dynamic/Quizzes/quiz_question_options_images")
    );
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});
var QuizUploadQuestionImage = multer({ storage: quizQuestionStorage });
router.post(
  "/quiz_questions_img",
  QuizUploadQuestionImage.any(),
  (req, res, next) => {
    res.end();
  }
);
/** ****End upload Questiond */
/****End Upload images for Quiz */
/********user insert Quiz */
router.post("/InsertUserQuizDetail", (req, res) => {
  var params = req.body;
  //console.log(params);
  pool.query(
    //"SELECT * FROM `quiz` where quiz_name=? and sub_id=?",
    "SELECT * FROM `quiz` where quiz_name=?  and  user_id=?",
    [params.quiz_name, params.user_id],
    function(err, data, fields) {
      if (err) {
        throw err;
      } else {
        if (data.length != 0) {
          res.json({
            status: "200",
            data: "0",
          });
        } else {
          pool.query(
            "INSERT INTO `products`(`product_type`) VALUES (?)",
            ["quiz"],
            function(err, data) {
              if (!err) {
                pool.query(
                  "select product_id from products order by product_id desc limit 1",
                  function(err, data1) {
                    if (!err) {
                      let product_id = data1[0].product_id;
                      pool.query(
                        "INSERT INTO `quiz`(`quiz_name`,`quiz_desc`,`quiz_img`,`slug`,`user_id`,`sub_id`,`price`,`product_id`,`sch_id`,`coin_earned`,`public_institute`) values(?,?,?,?,?,?,?,?,?,?,?)",
                        [
                          params.quiz_name,
                          params.quiz_desc,
                          params.quiz_img_files,
                          params.quiz_name.replace(" ", "_").toLowerCase(),
                          params.user_id,
                          params.sub_id,
                          params.quiz_price,
                          product_id,
                          params.sch_id,
                          "0",
                          "1",
                        ],
                        function(err, result1, fields) {
                          if (err) {
                            throw err;
                          } else {
                            /*pool.query(
                              "UPDATE `cv_users` cu,cv_users c1 SET cu.coin_earned =  cu.coin_earned + 10 WHERE cu.user_id = c1.user_id and cu.user_id = ?",
                              [params.user_id],
                              function(err, update) {*/
                            pool.query(
                              "select * from quiz where user_id=? order by quiz_id desc limit 1",
                              [params.user_id],
                              function(err, data2) {
                                if (err) {
                                  throw err;
                                } else {
                                  res.json({
                                    status: "200",
                                    data: data2,
                                  });
                                }
                              }
                            );
                            /* }
                            );*/
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    }
  );
});
/****end user insert Quiz */
router.post("/InsertTeacherQuizDetail", (req, res) => {
  var params = req.body;
  //console.log(params);
  pool.query(
    //"SELECT * FROM `quiz` where quiz_name=? and sub_id=?",
    "SELECT * FROM `quiz` where quiz_name=?  and  user_id=?",
    [params.quiz_name, params.user_id],
    function(err, data, fields) {
      if (err) {
        throw err;
      } else {
        if (data.length != 0) {
          res.json({
            status: "200",
            data: "0",
          });
        } else {
          pool.query(
            "INSERT INTO `products`(`product_type`) VALUES (?)",
            ["quiz"],
            function(err, data) {
              if (!err) {
                pool.query(
                  "select product_id from products order by product_id desc limit 1",
                  function(err, data1) {
                    if (!err) {
                      let product_id = data1[0].product_id;
                      pool.query(
                        "INSERT INTO `quiz`(`quiz_name`,`quiz_desc`,`quiz_img`,`slug`,`user_id`,`sub_id`,`price`,`product_id`,`sch_id`,`coin_earned`,`public_institute`) values(?,?,?,?,?,?,?,?,?,?,?)",
                        [
                          params.quiz_name,
                          params.quiz_desc,
                          params.quiz_img_files,
                          params.quiz_name.replace(" ", "_").toLowerCase(),
                          params.user_id,
                          params.sub_id,
                          params.quiz_price,
                          product_id,
                          params.sch_id,
                          "10",
                          "0",
                        ],
                        function(err, result1, fields) {
                          if (err) {
                            throw err;
                          } else {
                            pool.query(
                              "UPDATE `cv_users` cu,cv_users c1 SET cu.coin_earned =  cu.coin_earned + 10 WHERE cu.user_id = c1.user_id and cu.user_id = ?",
                              [params.user_id],
                              function(err, update) {
                                pool.query(
                                  "select * from quiz where user_id=? order by quiz_id desc limit 1",
                                  [params.user_id],
                                  function(err, data2) {
                                    if (err) {
                                      throw err;
                                    } else {
                                      res.json({
                                        status: "200",
                                        data: data2, //result1,
                                      });
                                    }
                                  }
                                );
                              }
                            );
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    }
  );
});

router.post("/InsertQuizDetail", (req, res) => {
  var params = req.body;

  pool.query(
    //"SELECT * FROM `quiz` where quiz_name=? and sub_id=?",
    "SELECT * FROM `quiz` where quiz_name=?",
    [params.quiz_name],
    function(err, data, fields) {
      if (err) {
        throw err;
      } else {
        if (data.length != 0) {
          res.json({
            status: "200",
            data: "0",
          });
        } else {
          pool.query(
            "INSERT INTO `products`(`product_type`) VALUES (?)",
            ["quiz"],
            function(err, data) {
              if (!err) {
                pool.query(
                  "select product_id from products order by product_id desc limit 1",
                  function(err, data1) {
                    if (!err) {
                      let product_id = data1[0].product_id;
                      pool.query(
                        // "INSERT INTO `quiz`(`quiz_name`,`slug`,`sub_id`) values(?,?,?,?)",[ params.quiz_name,params.quiz_name.replace(" ", "_").toLowerCase(),params.sub_id,params.price]
                        "INSERT INTO `quiz`(`quiz_name`,`slug`,`quiz_desc`,`sub_id`,`price`,`product_id`,`public_institute`) values(?,?,?,?,?,?,?)",
                        [
                          params.quiz_name,
                          params.quiz_name.replace(" ", "_").toLowerCase(),
                          params.quiz_desc,
                          params.sub_id,
                          params.quiz_price,
                          product_id,
                          "0",
                        ],
                        function(err, result1, fields) {
                          if (err) {
                            throw err;
                          } else {
                            pool.query(
                              "select * from quiz order by quiz_id desc limit 1",
                              function(err, data2) {
                                if (err) {
                                  throw err;
                                } else {
                                  res.json({
                                    status: "200",
                                    data: data2, //result1,
                                  });
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    }
  );
});

router.post("/InsertCourseQuizDetail", (req, res) => {
  let params = req.body;
  //console.log(params);
  /****Insert Quiz */
  return runSqlQueryAsyncSelect(
    "SELECT count(*) 'number' FROM `book_title` inner join quiz on (quiz.quiz_id =book_title.book_id) where topic_id=? and book_id=? and book_title.quiz_id IS NOT NULL",
    [params.book_id, params.topic_id]
  )
    .then((dataResult) => {
      if (dataResult.err) throw err;
      else {
        //workin g remaining
      }
    })
    .catch((err) => {
      console.log(err);
    });
  /***Insert Quiz */
});
router.post("/delete_quiz_icon", (req, res) => {
  let params = req.body;

  pool.query(
    "UPDATE `quiz` SET `quiz_img`='' WHERE quiz.quiz_id=? and quiz.user_id=?",
    [params.quiz_id, params.user_id],
    function(err, data) {
      if (err) console.log(err);
      else res.send(data);
    }
  );
});
router.post("/delete_admin_quiz_icon", (req, res) => {
  let params = req.body;

  pool.query(
    "UPDATE `quiz` SET `quiz_img`='' WHERE quiz.quiz_id=?",
    [params.quiz_id],
    function(err, data) {
      if (err) console.log(err);
      else res.send(data);
    }
  );
});
router.post("/update_admin_quiz_icon", (req, res) => {
  let params = req.body;

  pool.query(
    "UPDATE `quiz` SET `quiz_img`=? WHERE quiz.quiz_id=?",
    [params.quiz_img, params.quiz_id],
    function(err, data) {
      if (err) console.log(err);
      else res.send(data);
    }
  );
});

router.post("/update_quiz_icon", (req, res) => {
  let params = req.body;

  pool.query(
    "UPDATE `quiz` SET `quiz_img`=? WHERE quiz.quiz_id=? and quiz.user_id=?",
    [params.quiz_img, params.quiz_id, params.user_id],
    function(err, data) {
      if (err) console.log(err);
      else res.send(data);
    }
  );
});
router.post("/GetQuizDetail", (req, res) => {
  let params = req.body;
  pool.query(
    "SELECT quiz.quiz_name,quiz.quiz_desc,quiz.quiz_img,quiz.sub_id,quiz.price,quiz_subject.subject,quiz.public_institute,quiz.visible,quiz.public_permission FROM `quiz` left join quiz_subject on quiz.sub_id = quiz_subject.sub_id  WHERE quiz_id=? and quiz.user_id=?",
    [params.quiz_id, params.user_id],
    function(err, data) {
      if (!err) res.send(data);
      else console.log(err);
    }
  );
});
router.post("/GetQuizDetailAdmin", (req, res) => {
  let params = req.body;
  pool.query(
    "SELECT quiz.quiz_name,quiz.quiz_desc,quiz.quiz_img,quiz.sub_id,quiz.price,quiz.visible,quiz.public_permission,quiz.public_institute,quiz_subject.subject,quiz.user_id FROM `quiz` left join quiz_subject on quiz.sub_id = quiz_subject.sub_id  WHERE quiz_id=?",
    [params.quiz_id],
    function(err, data) {
      if (!err) res.send(data);
      else console.log(err);
    }
  );
});
/***Social sharing */
router.get("/share_quiz", (req, res) => {
  let params = req.query;
  pool.query(
    "SELECT quiz.quiz_id,quiz.quiz_name,quiz.quiz_desc,(SELECT cv_users.name from cv_users where cv_users.user_id=?) 'name' from quiz where quiz.quiz_id=?",
    [params.user, params.id],
    function(err, data) {
      var title = `Codevidhya ${data[0].quiz_name}`;
      var desc = `Go check it out this quiz. it help your coding Quiotitent @codevidhya!`;
      var url = `https://codevidhya.com/share?type=quiz&id=${params.id}&user=${params.user}`;
      var imag = "https://codevidhya.com/socialshare/share_quiz.png";
      res.render("share_quiz", {
        title: title,
        desc: desc,
        url: url,
        img: imag,
      });
    }
  );
});

router.get("/live-course/:curname", (req, res) => {
  let courseSlug = req.params;
  if (courseSlug.curname == "scratch_your_first_step") {
    var title = `Scratch, Your First Step`;
    var desc = `Get introduced to the creative world of animations in a fun and interactive way.`;
    var url = `https://codevidhya.com/live-course/scratch_your_first_step`;
    var img = `https://codevidhya.com/socialshare/lcourse1.jpg`;
    var twimg = `https://codevidhya.com/socialshare/lcourse1.jpg`;
  } else if (courseSlug.curname == "story_telling_through_coding") {
    var title = `Story telling & Animation through Coding!`;
    var desc = `Create stories and master the art of story telling through Coding!`;
    var url = `https://codevidhya.com/live-course/story_telling_and_animation_through_coding`;
    var img = `https://codevidhya.com/socialshare/lcourses2.jpg`;
    var twimg = `https://codevidhya.com/socialshare/lcourses2.jpg`;
  } else if (
    courseSlug.curname == "story_telling_and_animation_through_coding"
  ) {
    var title = `Story Telling through Coding`;
    var desc = `Create stories and master the art of story telling through Coding!`;
    var url = `https://codevidhya.com/live-course/story_telling_through_coding`;
    var img = `https://codevidhya.com/socialshare/lcourses2.jpg`;
    var twimg = `https://codevidhya.com/socialshare/lcourses2.jpg`;
  } else if (courseSlug.curname == "scratch_that_gamify_it") {
    var title = `Scratch that, Gamify It!!`;
    var desc = `Give your imagination a shape! Create the games you always dreamt of.`;
    var url = `https://codevidhya.com/live-course/scratch_that_gamify_it`;
    var img = `https://codevidhya.com/socialshare/lcourse3.jpg`;
    var twimg = `https://codevidhya.com/socialshare/lcourse3.jpg`;
  } else if (courseSlug.curname == "enter_the_world_of_web_development") {
    var title = `Explore the fascinating world of Web Technologies - your first step towards Web Development`;
    var desc = `Introduction to Web Technologies`;
    var url = `https://codevidhya.com/live-course/enter_the_world_of_web_development`;
    var img = `https://codevidhya.com/socialshare/lcourse4.jpg`;
    var twimg = `https://codevidhya.com/socialshare/lcourse4.jpg`;
  } else if (courseSlug.curname == "showcase_your_web_skills") {
    var title = ` Create your first Dynamic Website using HTML, CSS, JavaScript.`;
    var desc = `First Dynamic Website`;
    var url = `https://codevidhya.com/live-course/showcase_your_web_skills`;
    var img = `https://codevidhya.com/socialshare/lcourse5.jpg`;
    var twimg = `https://codevidhya.com/socialshare/lcourse5.jpg`;
  } else if (courseSlug.curname == "app_no_001") {
    var title = `App No 001`;
    var desc = `Flaunt your first ever app!`;
    var url = `https://codevidhya.com/live-course/app_no_001`;
    var img = `https://codevidhya.com/socialshare/lcourse6.jpg`;
    var twimg = `https://codevidhya.com/socialshare/lcourse6.jpg`;
  } else if (courseSlug.curname == "python_the_beginning") {
    var title = `Python - The Beginning!`;
    var desc = `The Beginning!:Learn the most easiest and the most powerful text- based language in the world`;
    var url = `https://codevidhya.com/live-course/python_the_beginning`;
    var img = `https://codevidhya.com/socialshare/lcourse7.jpg`;
    var twimg = `https://codevidhya.com/socialshare/lcourse7.jpg`;
  }

  res.render("bookShare", {
    title: title,
    desc: desc,
    url: url,
    img: img,
    twimg: twimg,
  });
});

router.get("/share", (req, res) => {
  let params = req.query;
  if (params.type == "quiz") {
    if (params.sharetype) {
      pool.query(
        "SELECT quiz.quiz_id,quiz.quiz_name,quiz.quiz_desc,(SELECT cv_users.name from cv_users where cv_users.user_id=?) 'name' from quiz where quiz.quiz_id=?",
        [params.user, params.id],
        function(err, data) {
          var title = `Codevidhya ${data[0].quiz_name}`;
          var desc = `Go check it out this quiz. it help your coding Quiotitent @codevidhya!`;
          var url = `https://codevidhya.com/share?type=quiz&id=${params.id}&user=${params.user}&sharetype=2`;
          var imag = "https://codevidhya.com/socialshare/share_quiz.png";
          res.render("share", {
            title: title,
            desc: desc,
            url: url,
            img: imag,
          });
        }
      );
    } else {
      pool.query(
        "select sum(st_quiz_result.points) 'obtained',sum(quiz_question.points) 'total_points',max(st_quiz_result.attempted_at) 'attempted_at',quiz.quiz_name,cv_users.name from st_quiz_result join quiz_question on (st_quiz_result.que_id = quiz_question.que_id and st_quiz_result.quiz_id=? and st_quiz_result.user_id=?) join quiz on (quiz.quiz_id = st_quiz_result.quiz_id) join cv_users on (st_quiz_result.user_id = cv_users.user_id and cv_users.user_id=?) where quiz_question.quiz_id=? and st_quiz_result.user_id=?",
        [params.id, params.user, params.user, params.id, params.user],
        function(err, data) {
          //  console.log(data);
          var total = data[0].total_points;
          var obtained = data[0].obtained;
          var quizName = data[0].quiz_name;
          var title = `I got ${obtained}/${total} in ${quizName}!`;
          var desc = `Can you score better? Try it now!`;
          var url = `https://codevidhya.com/share?type=quiz&id=${params.id}&user=${params.user}`;
          var imag = "https://codevidhya.com/socialshare/share_result.png";
          res.render("share", {
            title: title,
            desc: desc,
            url: url,
            img: imag,
          });
        }
      );
    }
  }
});

/*****end social sharing */
//end quiz
/*############################################################################
######################### Admin Home data ########################################*/
router.post("/get_admin_required_data", (req, res) => {
  pool.query(
    //"SELECT (select count(*) from cv_users where role_id=1) 'no_of_schools',(select count(*) from cv_users where role_id=2) 'no_of_teachers',(select (count(*)+1997) from cv_users where role_id=3 or role_id=2) 'no_of_students' FROM `cv_users` limit 1",
    "SELECT (select count(*) from cv_users where role_id=1 and sch_id <> 1) 'no_of_schools',(select count(*) from cv_users where role_id=2) 'no_of_teachers',(select (count(*)) from cv_users where role_id=3 or role_id=2 and sch_id <> 1) 'no_of_students',(SELECT count(*) from cv_users where sch_id =1 and role_id =3) 'no_of_individual' FROM `cv_users` limit 1",
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/get_adminregister_schools_details", (req, res) => {
  pool.query(
    "select cv_school_detail.name,cv_school_detail.sch_id,(select count(*) from cv_users )'total_student',(select count(*) from cv_users where cv_users.sch_id = cv_school_detail.sch_id and cv_users.name!=cv_school_detail.name group by cv_school_detail.sch_id) 'sch_by_users' FROM cv_school_detail where (select count(*) from cv_users where cv_users.sch_id = cv_school_detail.sch_id and cv_users.name!=cv_school_detail.name group by cv_school_detail.sch_id) IS NOT NULL limit 5",
    function(err, data) {
      if (!err) {
        //  console.log(data);
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
//end Admin Home
/*############################################################################
######################### Admin logs ########################################*/
//logout  and one change in login router function
/*############################################################################
######################### Admin Home data ########################################*/
router.post("/get_admin_required_data", (req, res) => {
  pool.query(
    "SELECT (select count(*) from cv_users where role_id=1) 'no_of_schools',(select count(*) from cv_users where role_id=1) 'no_of_teachers',(select count(*) from cv_users where role_id=3) 'no_of_students' FROM `cv_users` limit 1",
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/get_adminregister_schools_details", (req, res) => {
  pool.query(
    "select cv_school_detail.name,cv_school_detail.sch_id,(select count(*) from cv_users )'total_student',(select count(*) from cv_users where cv_users.sch_id = cv_school_detail.sch_id and cv_users.name!=cv_school_detail.name group by cv_school_detail.sch_id) 'sch_by_users' FROM cv_school_detail where (select count(*) from cv_users where cv_users.sch_id = cv_school_detail.sch_id and cv_users.name!=cv_school_detail.name group by cv_school_detail.sch_id) IS NOT NULL limit 5",
    function(err, data) {
      if (!err) {
        //  console.log(data);
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
//end Admin Home
/*############################################################################
######################### Admin logs ########################################*/
//logout  and one change in login router function
router.post("/logout_spend_time", async (req, res) => {
  let params = req.body;
  //console.log("params logout");
  //console.log(params);
  let query =
    "select user_spen_id from user_spent_time where user_id =?  order by user_spen_id desc limit 1";
  let param = [params.user_id];
  return new Promise(async function(resolve, reject) {
    await runSqlQueryAsync(query, param).then(async function(data) {
      //  console.log("data level at paramsss");
      if (data.length != 0) {
        let user_span_id = data[0].user_spen_id;
        query =
          "SELECT visited_id FROM `user_visited_page` WHERE user_spen_id=? order by visited_id desc";
        param = [data[0].user_spen_id];
        await runSqlQueryAsync(query, param).then(async function(data1) {
          {
            //  console.log('hehehehe')
            //    console.log(data1);
            if (data1.length) {
              query =
                "UPDATE `user_visited_page` SET `page_out_time`=now(),spen_time_sec=(TIME_TO_SEC(TIMEDIFF(now(),page_in_time))-ideal_time) WHERE visited_id=?";
              param = [data1[0].visited_id];
              await runSqlQueryAsync(query, param).then(async function(data2) {
                {
                  //   console.log("successful user_visited_page updated");
                  //   console.log(data[0].user_spen_id);
                  //  console.log(user_span_id);
                  query =
                    "select user_visited_page.visited_id,user_visited_page.user_spen_id,user_visited_page.page_from,user_visited_page.page_to,user_visited_page.page_in_time,user_visited_page.page_out_time,user_visited_page.update_time,user_visited_page.ideal_time,user_visited_page.spen_time_sec,user_spent_time.user_id from user_visited_page LEFT join user_spent_time on user_visited_page.user_spen_id = user_spent_time.user_spen_id where user_visited_page.user_spen_id=?";
                  param = [user_span_id];
                  await runSqlQueryAsync(query, param).then(async function(
                    datas
                  ) {
                    let qury = "";
                    let params = "";
                    //   console.log("datas level check");
                    for (var i = 0; i < datas.length; i++) {
                      qury =
                        "select * from visited_page_summary where page_name = ? and user_id =?";
                      params = [datas[i].page_to, datas[i].user_id];
                      //      console.log(params);
                      await runSqlQueryAsync(qury, params).then(async function(
                        datum
                      ) {
                        if (datum.length) {
                          qury =
                            "UPDATE `visited_page_summary` SET `spent_time`=?,`ideal_time`=?,`visited_times`=? where page_name=? and user_id=?";
                          let spent_time =
                            datum[0].spent_time + datas[i].spen_time_sec;
                          let ideal_time =
                            datum[0].ideal_time + datas[i].ideal_time;
                          params = [
                            spent_time,
                            ideal_time,
                            datas[i].update_time,
                            datas[i].page_to,
                            datum[0].user_id,
                          ];
                          await runSqlQueryAsync(qury, params).then(
                            (datadelete) => {
                              //      console.log("udate page summary success");
                            }
                          );
                        } else {
                          qury =
                            "INSERT INTO `visited_page_summary`(`page_name`, `user_id`, `spent_time`, `ideal_time`, `visited_times`) values(?,?,?,?,?)";
                          params = [
                            datas[i].page_to,
                            datas[i].user_id,
                            datas[i].spen_time_sec,
                            datas[i].ideal_time,
                            datas[i].update_time,
                          ];
                          await runSqlQueryAsync(qury, params).then(
                            (datainsert) => {
                              //      console.log("udate page summary insert");
                            }
                          );
                        }
                      });
                    }
                    qury =
                      "select * from user_spent_time where user_id =? and DATE_FORMAT(user_spent_time.login_time,'%d %m %y') = DATE_FORMAT(now(),'%d %m %y') limit 1";
                    params = [req.body.user_id];
                    //    console.log("get user_spent_time data");
                    // console.log(qury)
                    // console.log(req.body.user_id);

                    await runSqlQueryAsync(qury, params).then(async function(
                      dataU
                    ) {
                      // console.log("Retrive user_page_spent_time");
                      // console.log(dataU);
                      let allspentTime = dataU[0].spend_time;
                      if (!allspentTime) allspentTime = 0;
                      //  console.log("spent time checked again" +allspentTime);
                      qury =
                        "UPDATE `user_spent_time` SET `logout_time`= now(),user_status=0,spend_time= (" +
                        parseInt(allspentTime) +
                        " + (SELECT sum(TIME_TO_SEC(TIMEDIFF(CASE When page_out_time then page_out_time else update_time end,page_in_time))-ideal_time) FROM `user_visited_page` WHERE user_spen_id=? group  by user_spen_id)) where  user_id=? and user_spen_id=?";
                      (params = [user_span_id, req.body.user_id, user_span_id]),
                        //   console.log(qury);
                        // console.log(params);
                        await runSqlQueryAsync(qury, params).then(
                          (dataUpdateStatus) => {
                            //  console.log("logout user updation");
                          }
                        );
                    });

                    qury =
                      "DELETE FROM `user_visited_page` WHERE user_spen_id =?";
                    params = [user_span_id];
                    await runSqlQueryAsync(qury, params).then((datadelete) => {
                      //   console.log("logout delete updation");
                      resolve();
                    });
                  });
                }
              });
            } else {
              qury =
                "UPDATE `user_spent_time` SET `logout_time`= now(),user_status=0 where  user_id=? and user_spen_id=?";
              (params = [req.body.user_id, user_span_id]),
                await runSqlQueryAsync(qury, params).then(
                  (dataUpdateStatus) => {
                    // console.log("logout user updation else");
                    resolve();
                  }
                );
            }
          }
        });
      } else {
        resolve();
      }
    });
  })
    .then(() => {
      res.end();
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

router.post("/get_tot_users", (req, res) => {
  pool.query(
    //"SELECT count(t.group_user)'online_users',(select count(*) from cv_users)'total_users'  from (SELECT count(*) 'group_user' from user_spent_time group by user_id) t",
    "SELECT count(t.group_user)'online_users',(select count(*) from cv_users where cv_users.status=1)'total_users' from (SELECT count(*) 'group_user' from user_spent_time group by user_id) t",
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/get_tot_year", (req, res) => {
  pool.query(
    "SELECT DATE_FORMAT(login_time,'%Y') 'year' FROM `user_spent_time` group by DATE_FORMAT(login_time,'%Y') order by year DESC",
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/get_month_users", (req, res) => {
  pool.query(
    //"SELECT count(user_id) 'online_users',DATE_FORMAT(login_time, '%M') 'month',(SELECT count(*) FROM cv_users  WHERE cv_users.reg_date IS NULL or DATE_FORMAT(cv_users.reg_date,'%Y') <=DATE_FORMAT(now(),'%Y')) 'total_users' FROM `user_spent_time` GROUP by month order by DATE_FORMAT(login_time, '%m')",
    "SELECT count(user_id) 'online_users',DATE_FORMAT(login_time, '%M') 'month',(SELECT count(*) FROM cv_users  WHERE cv_users.status =1 and (cv_users.reg_date IS NULL or DATE_FORMAT(cv_users.reg_date,'%Y')) <=DATE_FORMAT(now(),'%Y')) 'total_users' FROM `user_spent_time` GROUP by month order by DATE_FORMAT(login_time, '%m')",
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/get_per_year", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT count(t1.user_id) 'online_users',DATE_FORMAT(t1.login_time, '%M') 'month',(SELECT count(*) FROM cv_users  WHERE cv_users.reg_date IS NULL or DATE_FORMAT(cv_users.reg_date,'%Y') <=?) 'total_users' FROM (SELECT user_spent_time.user_id,user_spent_time.login_time,cv_users.reg_date from user_spent_time join cv_users on cv_users.user_id = user_spent_time.user_id where DATE_FORMAT(user_spent_time.login_time,'%Y') <=? and cv_users.reg_date IS NULL or DATE_FORMAT(cv_users.reg_date,'%Y') <=? ) t1 GROUP by month",
    [params.year, params.year, params.year],
    (err, data) => {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/get_logs_details", (req, res) => {
  pool.query(
    "SELECT count(*) 'total_active' FROM `user_spent_time` WHERE user_status=1",
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/get_online_user_basic_detail", (req, res) => {
  let params = req.body;
  pool.query(
    //"select cv_users.name,cv_users.address,cv_school_detail.name 'sch_name',CASE WHEN cv_st_detail.sec_id=1 then 'A' WHEN cv_st_detail.sec_id=2 then 'B' WHEN cv_st_detail.sec_id=3 then 'C' WHEN cv_st_detail.sec_id=4 then 'D' WHEN cv_st_detail.sec_id=5 then 'E' WHEN cv_st_detail.sec_id=6 then 'F' WHEN cv_st_detail.sec_id=7 then 'G' WHEN cv_st_detail.sec_id=8 then 'H' WHEN cv_st_detail.sec_id=9 then 'I' WHEN cv_st_detail.sec_id=10 then 'J' WHEN cv_st_detail.sec_id=11 then 'K' WHEN cv_st_detail.sec_id=12 then 'L' WHEN cv_st_detail.sec_id=13 then 'M' WHEN cv_st_detail.sec_id=14 then 'N' WHEN cv_st_detail.sec_id=15 then 'O' WHEN cv_st_detail.sec_id=16 then 'P' WHEN cv_st_detail.sec_id=17 then 'Q' WHEN cv_st_detail.sec_id=18 then 'R' WHEN cv_st_detail.sec_id=19 then 'S' WHEN cv_st_detail.sec_id=20 then 'T' WHEN cv_st_detail.sec_id=21 then 'U' WHEN cv_st_detail.sec_id=22 then 'V' WHEN cv_st_detail.sec_id=23 then 'W' WHEN cv_st_detail.sec_id=24 then 'X' WHEN cv_st_detail.sec_id=25 then 'Y' WHEN cv_st_detail.sec_id=26 then 'Z' END 'sec',cv_users.role_id,CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role',cv_st_detail.cls_id from cv_users left join cv_st_detail on cv_st_detail.user_id = cv_users.user_id left join cv_school_detail on cv_school_detail.sch_id = cv_users.sch_id where username=?",
    "select cv_users.name,cv_users.address,cv_users.sch_id,cv_school_detail.name 'sch_name',CASE WHEN cv_st_detail.sec_id=1 then 'A' WHEN cv_st_detail.sec_id=2 then 'B' WHEN cv_st_detail.sec_id=3 then 'C' WHEN cv_st_detail.sec_id=4 then 'D' WHEN cv_st_detail.sec_id=5 then 'E' WHEN cv_st_detail.sec_id=6 then 'F' WHEN cv_st_detail.sec_id=7 then 'G' WHEN cv_st_detail.sec_id=8 then 'H' WHEN cv_st_detail.sec_id=9 then 'I' WHEN cv_st_detail.sec_id=10 then 'J' WHEN cv_st_detail.sec_id=11 then 'K' WHEN cv_st_detail.sec_id=12 then 'L' WHEN cv_st_detail.sec_id=13 then 'M' WHEN cv_st_detail.sec_id=14 then 'N' WHEN cv_st_detail.sec_id=15 then 'O' WHEN cv_st_detail.sec_id=16 then 'P' WHEN cv_st_detail.sec_id=17 then 'Q' WHEN cv_st_detail.sec_id=18 then 'R' WHEN cv_st_detail.sec_id=19 then 'S' WHEN cv_st_detail.sec_id=20 then 'T' WHEN cv_st_detail.sec_id=21 then 'U' WHEN cv_st_detail.sec_id=22 then 'V' WHEN cv_st_detail.sec_id=23 then 'W' WHEN cv_st_detail.sec_id=24 then 'X' WHEN cv_st_detail.sec_id=25 then 'Y' WHEN cv_st_detail.sec_id=26 then 'Z' END 'sec',cv_users.role_id,CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role',cv_st_detail.cls_id,(SELECT user_spent_time.login_time from user_spent_time where user_spent_time.user_id = cv_users.user_id order by user_spent_time.user_spen_id desc limit 1) 'last_login' from cv_users left join cv_st_detail on cv_st_detail.user_id = cv_users.user_id left join cv_school_detail on cv_school_detail.sch_id = cv_users.sch_id where username=?",
    [params.username],
    function(err, data) {
      res.json({
        status: "200",
        data: data,
      });
    }
  );
});
router.post("/get_active_user_details", (req, res) => {
  let params = req.body;

  pool.query(
    //"SELECT user_spent_time.login_time,user_spent_time.user_id,(SELECT user_visited_page.page_to from user_visited_page where user_visited_page.user_spen_id =user_spent_time.user_spen_id and user_visited_page.page_out_time IS NULL order by user_visited_page.visited_id desc limit 1)'active_page',user_spent_time.user_spen_id,cv_users.name,cv_users.address,cv_school_detail.name 'sch_name',CASE WHEN cv_st_detail.sec_id=1 then 'A' WHEN cv_st_detail.sec_id=2 then 'B' WHEN cv_st_detail.sec_id=3 then 'C' WHEN cv_st_detail.sec_id=4 then 'D' WHEN cv_st_detail.sec_id=5 then 'E' WHEN cv_st_detail.sec_id=6 then 'F' WHEN cv_st_detail.sec_id=7 then 'G' WHEN cv_st_detail.sec_id=8 then 'H' WHEN cv_st_detail.sec_id=9 then 'I' WHEN cv_st_detail.sec_id=10 then 'J' WHEN cv_st_detail.sec_id=11 then 'K' WHEN cv_st_detail.sec_id=12 then 'L' WHEN cv_st_detail.sec_id=13 then 'M' WHEN cv_st_detail.sec_id=14 then 'N' WHEN cv_st_detail.sec_id=15 then 'O' WHEN cv_st_detail.sec_id=16 then 'P' WHEN cv_st_detail.sec_id=17 then 'Q' WHEN cv_st_detail.sec_id=18 then 'R' WHEN cv_st_detail.sec_id=19 then 'S' WHEN cv_st_detail.sec_id=20 then 'T' WHEN cv_st_detail.sec_id=21 then 'U' WHEN cv_st_detail.sec_id=22 then 'V' WHEN cv_st_detail.sec_id=23 then 'W' WHEN cv_st_detail.sec_id=24 then 'X' WHEN cv_st_detail.sec_id=25 then 'Y' WHEN cv_st_detail.sec_id=26 then 'Z' END 'sec',cv_users.role_id,CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role',cv_st_detail.cls_id from user_spent_time join cv_users on cv_users.user_id = user_spent_time.user_spen_id left join cv_school_detail on cv_users.sch_id =cv_school_detail.sch_id left join cv_st_detail on cv_users.user_id =cv_st_detail.user_id where user_spent_time.user_status=1 and user_spent_time.user_id in (SELECT user_id from cv_users where username=?)",
    //"SELECT user_spent_time.login_time,user_spent_time.user_id,(SELECT user_visited_page.page_to from user_visited_page where user_visited_page.user_spen_id =user_spent_time.user_spen_id and user_visited_page.page_out_time IS NULL order by user_visited_page.visited_id desc limit 1)'active_page',(SELECT SEC_TO_TIME(user_visited_page.ideal_time) 'ideal_time' from user_visited_page where user_visited_page.user_spen_id =user_spent_time.user_spen_id and user_visited_page.page_out_time IS NULL order by user_visited_page.visited_id desc limit 1)'ideal_time',(SELECT SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(now(),user_visited_page.page_in_time))-user_visited_page.ideal_time) 'spent_time' from user_visited_page where user_visited_page.user_spen_id =user_spent_time.user_spen_id and user_visited_page.page_out_time IS NULL order by user_visited_page.visited_id desc limit 1)'spend_time',user_spent_time.user_spen_id,cv_users.name,cv_users.address,cv_school_detail.name 'sch_name',CASE WHEN cv_st_detail.sec_id=1 then 'A' WHEN cv_st_detail.sec_id=2 then 'B' WHEN cv_st_detail.sec_id=3 then 'C' WHEN cv_st_detail.sec_id=4 then 'D' WHEN cv_st_detail.sec_id=5 then 'E' WHEN cv_st_detail.sec_id=6 then 'F' WHEN cv_st_detail.sec_id=7 then 'G' WHEN cv_st_detail.sec_id=8 then 'H' WHEN cv_st_detail.sec_id=9 then 'I' WHEN cv_st_detail.sec_id=10 then 'J' WHEN cv_st_detail.sec_id=11 then 'K' WHEN cv_st_detail.sec_id=12 then 'L' WHEN cv_st_detail.sec_id=13 then 'M' WHEN cv_st_detail.sec_id=14 then 'N' WHEN cv_st_detail.sec_id=15 then 'O' WHEN cv_st_detail.sec_id=16 then 'P' WHEN cv_st_detail.sec_id=17 then 'Q' WHEN cv_st_detail.sec_id=18 then 'R' WHEN cv_st_detail.sec_id=19 then 'S' WHEN cv_st_detail.sec_id=20 then 'T' WHEN cv_st_detail.sec_id=21 then 'U' WHEN cv_st_detail.sec_id=22 then 'V' WHEN cv_st_detail.sec_id=23 then 'W' WHEN cv_st_detail.sec_id=24 then 'X' WHEN cv_st_detail.sec_id=25 then 'Y' WHEN cv_st_detail.sec_id=26 then 'Z' END 'sec',cv_users.role_id,CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role',cv_st_detail.cls_id from user_spent_time join cv_users on cv_users.user_id = user_spent_time.user_id left join cv_school_detail on cv_users.sch_id =cv_school_detail.sch_id left join cv_st_detail on cv_users.user_id =cv_st_detail.user_id where user_spent_time.user_status=1 and user_spent_time.user_id in (SELECT user_id from cv_users where username=?)",
    "SELECT user_spent_time.login_time,user_spent_time.user_id,(SELECT user_visited_page.page_to from user_visited_page where user_visited_page.user_spen_id =user_spent_time.user_spen_id and user_visited_page.page_out_time IS NULL order by user_visited_page.visited_id desc limit 1)'active_page',(SELECT SEC_TO_TIME(user_visited_page.ideal_time) 'ideal_time' from user_visited_page where user_visited_page.user_spen_id =user_spent_time.user_spen_id and user_visited_page.page_out_time IS NULL order by user_visited_page.visited_id desc limit 1)'ideal_time',(SELECT SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(now(),user_visited_page.page_in_time))) 'spent_time' from user_visited_page where user_visited_page.user_spen_id =user_spent_time.user_spen_id and user_visited_page.page_out_time IS NULL order by user_visited_page.visited_id desc limit 1)'spent_time',(SELECT SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(now(),user_visited_page.page_in_time))-user_visited_page.ideal_time) 'spent_time' from user_visited_page where user_visited_page.user_spen_id =user_spent_time.user_spen_id and user_visited_page.page_out_time IS NULL order by user_visited_page.visited_id desc limit 1)'actual_spend_time',user_spent_time.user_spen_id,cv_users.name,cv_users.address,cv_school_detail.name 'sch_name',CASE WHEN cv_st_detail.sec_id=1 then 'A' WHEN cv_st_detail.sec_id=2 then 'B' WHEN cv_st_detail.sec_id=3 then 'C' WHEN cv_st_detail.sec_id=4 then 'D' WHEN cv_st_detail.sec_id=5 then 'E' WHEN cv_st_detail.sec_id=6 then 'F' WHEN cv_st_detail.sec_id=7 then 'G' WHEN cv_st_detail.sec_id=8 then 'H' WHEN cv_st_detail.sec_id=9 then 'I' WHEN cv_st_detail.sec_id=10 then 'J' WHEN cv_st_detail.sec_id=11 then 'K' WHEN cv_st_detail.sec_id=12 then 'L' WHEN cv_st_detail.sec_id=13 then 'M' WHEN cv_st_detail.sec_id=14 then 'N' WHEN cv_st_detail.sec_id=15 then 'O' WHEN cv_st_detail.sec_id=16 then 'P' WHEN cv_st_detail.sec_id=17 then 'Q' WHEN cv_st_detail.sec_id=18 then 'R' WHEN cv_st_detail.sec_id=19 then 'S' WHEN cv_st_detail.sec_id=20 then 'T' WHEN cv_st_detail.sec_id=21 then 'U' WHEN cv_st_detail.sec_id=22 then 'V' WHEN cv_st_detail.sec_id=23 then 'W' WHEN cv_st_detail.sec_id=24 then 'X' WHEN cv_st_detail.sec_id=25 then 'Y' WHEN cv_st_detail.sec_id=26 then 'Z' END 'sec',cv_users.role_id,CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role',cv_st_detail.cls_id from user_spent_time join cv_users on cv_users.user_id = user_spent_time.user_id left join cv_school_detail on cv_users.sch_id =cv_school_detail.sch_id left join cv_st_detail on cv_users.user_id =cv_st_detail.user_id where user_spent_time.user_status=1 and user_spent_time.user_id in (SELECT user_id from cv_users where username=?)",
    [params.username],
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

router.post("/get_online_user_visitedpages", (req, res) => {
  let params = req.body;
  let urld = url.format({
    protocol: req.protocol,
    host: req.get("host"),
    pathname: req.originalUrl,
  });

  pool.query(
    "select visited_page_summary.visited_summary_id,visited_page_summary.page_name,visited_page_summary.user_id,SEC_TO_TIME((visited_page_summary.spent_time + visited_page_summary.ideal_time))'actual_spend_time',SEC_TO_TIME(visited_page_summary.spent_time) 'spent_time',SEC_TO_TIME(visited_page_summary.ideal_time) 'ideal_time',visited_page_summary.visited_times 'latest_visit_times' from visited_page_summary where visited_page_summary.user_id in (SELECT user_id FROM cv_users where username=?)",
    [params.username],
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/get_active_user_visitedpages", (req, res) => {
  let params = req.body;
  pool.query(
    //"select user_visited_page.page_to,user_visited_page.page_in_time,user_visited_page.page_out_time,SEC_TO_TIME(user_visited_page.ideal_time) 'ideal_time',SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(now(),user_visited_page.page_in_time))-user_visited_page.ideal_time) 'spent_time' from user_visited_page where user_visited_page.user_spen_id in(SELECT user_spent_time.user_spen_id from user_spent_time where user_spent_time.user_id in(SELECT cv_users.user_id from cv_users where username=?) and user_spent_time.user_status=1) and user_visited_page.page_out_time is NOT NULL",
    //"select t1.page_to,max(t1.page_in_time) 'page_in_time',max(t1.page_out_time) 'page_out_time',SEC_TO_TIME(sum(t1.ideal_time)) 'ideal_time',SEC_TO_TIME(sum(t1.actual_spent_time)) 'actual_spent_time',SEC_TO_TIME(sum(t1.spent_time)) 'spent_time' from (select user_visited_page.page_to,user_visited_page.page_in_time,user_visited_page.page_out_time,(user_visited_page.ideal_time) 'ideal_time',(TIME_TO_SEC(TIMEDIFF(now(),user_visited_page.page_in_time))-user_visited_page.ideal_time) 'actual_spent_time',SEC_TO_TIME(user_visited_page.spen_time_sec) 'spent_time' from user_visited_page where user_visited_page.user_spen_id in(SELECT user_spent_time.user_spen_id from user_spent_time where user_spent_time.user_id in(SELECT cv_users.user_id from cv_users where username=?) and user_spent_time.user_status=1) and user_visited_page.page_out_time is NOT NULL) t1 group by t1.page_to",
    "select t1.page_to,max(t1.page_in_time) 'page_in_time',max(t1.page_out_time) 'page_out_time',SEC_TO_TIME(sum(t1.ideal_time)) 'ideal_time',SEC_TO_TIME(abs(sum(t1.actual_spent_time))) 'actual_spent_time',SEC_TO_TIME(sum(t1.spent_time)) 'spent_time' from (select user_visited_page.page_to,user_visited_page.page_in_time,user_visited_page.page_out_time,(user_visited_page.ideal_time) 'ideal_time',(TIME_TO_SEC(TIMEDIFF(case when user_visited_page.page_out_time THEN user_visited_page.page_out_time else user_visited_page.update_time end,user_visited_page.page_in_time)) - user_visited_page.ideal_time) 'actual_spent_time',SEC_TO_TIME(user_visited_page.spen_time_sec) 'spent_time' from user_visited_page where user_visited_page.user_spen_id in(SELECT user_spent_time.user_spen_id from user_spent_time where user_spent_time.user_id in(SELECT cv_users.user_id from cv_users where username=?) and user_spent_time.user_status=1) and user_visited_page.page_out_time is NOT NULL) t1 group by t1.page_to",
    [params.username],
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

router.post("/get_active_logs_details", (req, res) => {
  pool.query(
    "SELECT user_spent_time.user_status,cv_users.name,user_spent_time.login_time,cv_school_detail.name 'organisation',CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role',(select count(*) FROM user_visited_page WHERE user_visited_page.user_spen_id = user_spent_time.user_spen_id group by user_visited_page.user_spen_id)'visited_page',user_spent_time.user_id,cv_users.username FROM `user_spent_time` join cv_users on cv_users.user_id =user_spent_time.user_id left join cv_school_detail on cv_school_detail.sch_id = cv_users.sch_id where user_spent_time.user_status=1",
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

router.post("/get_school_logs_analysis", (req, res) => {
  let params = req.body;
  pool.query(
    "SELECT count(*) 'total_users',(SELECT count(DISTINCT user_spent_time.user_id) from user_spent_time left join cv_users on user_spent_time.user_id = cv_users.user_id left join cv_school_detail on cv_users.sch_id =cv_school_detail.sch_id where cv_users.user_id <> cv_school_detail.sch_id and cv_school_detail.name =?) 'online_users',(count(*)-(SELECT count(DISTINCT user_spent_time.user_id) from user_spent_time left join cv_users on user_spent_time.user_id = cv_users.user_id left join cv_school_detail on cv_users.sch_id =cv_school_detail.sch_id where cv_users.user_id <> cv_school_detail.sch_id and cv_school_detail.name =?)) 'offine_users' from cv_users left join cv_school_detail on cv_users.sch_id =cv_school_detail.sch_id where cv_users.user_id <> cv_school_detail.sch_id and cv_school_detail.name =?",
    [params.sch_name, params.sch_name, params.sch_name],
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/get_school_logs_online_users_analysis", (req, res) => {
  let params = req.body;
  pool.query(
    //"SELECT sum(vps.spent_time) 'total_spent_time',(select count(t1.user_id) 'below' from (SELECT visited_page_summary.user_id 'user_id',round((sum(visited_page_summary.spent_time)/(select sum(visited_page_summary.spent_time) from visited_page_summary  left join cv_users on visited_page_summary.user_id = cv_users.user_id left JOIN cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id WHERE cv_school_detail.name =?))*100,0)  'time_in_percentage' from visited_page_summary left join cv_users on visited_page_summary.user_id = cv_users.user_id left JOIN cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id WHERE cv_school_detail.name =? group by user_id) t1 where t1.time_in_percentage <= 33) 'low',(select count(t1.user_id) 'below' from (SELECT visited_page_summary.user_id 'user_id',round((sum(visited_page_summary.spent_time)/(select sum(visited_page_summary.spent_time) from visited_page_summary  left join cv_users on visited_page_summary.user_id = cv_users.user_id left JOIN cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id WHERE cv_school_detail.name =?))*100,0)  'time_in_percentage' from visited_page_summary left join cv_users on visited_page_summary.user_id = cv_users.user_id left JOIN cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id WHERE cv_school_detail.name =? group by user_id) t1 where t1.time_in_percentage > 33 and t1.time_in_percentage<=66) 'average',(select count(t1.user_id) 'below' from (SELECT visited_page_summary.user_id 'user_id',round((sum(visited_page_summary.spent_time)/(select sum(visited_page_summary.spent_time) from visited_page_summary  left join cv_users on visited_page_summary.user_id = cv_users.user_id left JOIN cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id WHERE cv_school_detail.name =?))*100,0)  'time_in_percentage' from visited_page_summary left join cv_users on visited_page_summary.user_id = cv_users.user_id left JOIN cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id WHERE cv_school_detail.name =? group by user_id) t1 where t1.time_in_percentage > 66) 'good' from visited_page_summary vps left join cv_users on vps.user_id = cv_users.user_id left JOIN cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id WHERE cv_school_detail.name =?",
    //[params.sch_name,params.sch_name,params.sch_name,params.sch_name,params.sch_name,params.sch_name,params.sch_name],
    "SELECT round(Avg((user_spent_time.spend_time/user_spent_time.times_in_day)),0) 'total_spent_time',(select count(t1.avg_spent_time) 'low' from (SELECT round(Avg((user_spent_time.spend_time/user_spent_time.times_in_day)),0) 'avg_spent_time',user_spent_time.user_id from user_spent_time left  join cv_users on cv_users.user_id = user_spent_time.user_id left join cv_school_detail on cv_school_detail.sch_id = cv_users.sch_id where cv_school_detail.name =? group by user_spent_time.user_id) t1 where avg_spent_time <20)'low',(select count(t1.avg_spent_time) 'low' from (SELECT round(Avg((user_spent_time.spend_time/user_spent_time.times_in_day)),0) 'avg_spent_time',user_spent_time.user_id from user_spent_time left  join cv_users on cv_users.user_id = user_spent_time.user_id left join cv_school_detail on cv_school_detail.sch_id = cv_users.sch_id where cv_school_detail.name =? group by user_spent_time.user_id) t1 where avg_spent_time = 20)'average',(select count(t1.avg_spent_time) 'low' from (SELECT round(Avg((user_spent_time.spend_time/user_spent_time.times_in_day)),0) 'avg_spent_time',user_spent_time.user_id from user_spent_time left  join cv_users on cv_users.user_id = user_spent_time.user_id left join cv_school_detail on cv_school_detail.sch_id = cv_users.sch_id where cv_school_detail.name =? group by user_spent_time.user_id) t1 where avg_spent_time >20)'good' from user_spent_time left join cv_users on cv_users.user_id = user_spent_time.user_id join cv_school_detail on cv_school_detail.sch_id = cv_users.sch_id where cv_school_detail.name =?",
    [params.sch_name, params.sch_name, params.sch_name, params.sch_name],
    function(err, data) {
      //console.log(data);
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/get_filter_cls_visited_logs_sch_details", (req, res) => {
  let params = req.body;
  pool.query(
    //"SELECT t1.spent_time,t1.name,t1.username,t1.user_id,t1.sec,t1.role_id,t1.role,t1.cls_id ,CASE WHEN round((t1.user_spent_time/t1.total_spent_time)*100,0) <= 33 then 'Below Average' WHEN round((t1.user_spent_time/t1.total_spent_time)*100,0)> 33 and round((t1.user_spent_time/t1.total_spent_time)*100,0) <= 66 THEN 'Average' else 'Above Average' end 'platform_time',SEC_TO_TIME(t1.total_spent_time) 'total_spent_time' from (SELECT SEC_TO_TIME(round(AVG(visited_page_summary.spent_time),0)) 'spent_time',sum(visited_page_summary.spent_time) 'user_spent_time',(SELECT sum(visited_page_summary.spent_time) from visited_page_summary left join cv_users on visited_page_summary.user_id = cv_users.user_id left join cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id where cv_school_detail.name =?) 'total_spent_time',visited_page_summary.user_id,cv_users.name,cv_users.username,CASE WHEN cv_st_detail.sec_id=1 then 'A' WHEN cv_st_detail.sec_id=2 then 'B' WHEN cv_st_detail.sec_id=3 then 'C' WHEN cv_st_detail.sec_id=4 then 'D' WHEN cv_st_detail.sec_id=5 then 'E' WHEN cv_st_detail.sec_id=6 then 'F' WHEN cv_st_detail.sec_id=7 then 'G' WHEN cv_st_detail.sec_id=8 then 'H' WHEN cv_st_detail.sec_id=9 then 'I' WHEN cv_st_detail.sec_id=10 then 'J' WHEN cv_st_detail.sec_id=11 then 'K' WHEN cv_st_detail.sec_id=12 then 'L' WHEN cv_st_detail.sec_id=13 then 'M' WHEN cv_st_detail.sec_id=14 then 'N' WHEN cv_st_detail.sec_id=15 then 'O' WHEN cv_st_detail.sec_id=16 then 'P' WHEN cv_st_detail.sec_id=17 then 'Q' WHEN cv_st_detail.sec_id=18 then 'R' WHEN cv_st_detail.sec_id=19 then 'S' WHEN cv_st_detail.sec_id=20 then 'T' WHEN cv_st_detail.sec_id=21 then 'U' WHEN cv_st_detail.sec_id=22 then 'V' WHEN cv_st_detail.sec_id=23 then 'W' WHEN cv_st_detail.sec_id=24 then 'X' WHEN cv_st_detail.sec_id=25 then 'Y' WHEN cv_st_detail.sec_id=26 then 'Z' END 'sec',cv_users.role_id,CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role',cv_st_detail.cls_id from visited_page_summary left join cv_users on cv_users.user_id = visited_page_summary.user_id left JOIN cv_st_detail on cv_users.user_id = cv_st_detail.user_id left join cv_school_detail on cv_school_detail.sch_id = cv_users.sch_id where cv_school_detail.name =? group by visited_page_summary.user_id) t1 where role_id =? and cls_id =? order by role_id desc",
    "SELECT t1.user_id, SEC_TO_TIME(t1.avg_spent_time) 'avg_spent_time',cv_st_detail.cls_id,CASE WHEN t1.avg_spent_time < 20 then 'Below Average' WHEN t1.avg_spent_time =20 then 'Average' Else 'Above Average' END 'platform_time',cv_users.name,cv_users.username,CASE WHEN cv_st_detail.sec_id=1 then 'A' WHEN cv_st_detail.sec_id=2 then 'B' WHEN cv_st_detail.sec_id=3 then 'C' WHEN cv_st_detail.sec_id=4 then 'D' WHEN cv_st_detail.sec_id=5 then 'E' WHEN cv_st_detail.sec_id=6 then 'F' WHEN cv_st_detail.sec_id=7 then 'G' WHEN cv_st_detail.sec_id=8 then 'H' WHEN cv_st_detail.sec_id=9 then 'I' WHEN cv_st_detail.sec_id=10 then 'J' WHEN cv_st_detail.sec_id=11 then 'K' WHEN cv_st_detail.sec_id=12 then 'L' WHEN cv_st_detail.sec_id=13 then 'M' WHEN cv_st_detail.sec_id=14 then 'N' WHEN cv_st_detail.sec_id=15 then 'O' WHEN cv_st_detail.sec_id=16 then 'P' WHEN cv_st_detail.sec_id=17 then 'Q' WHEN cv_st_detail.sec_id=18 then 'R' WHEN cv_st_detail.sec_id=19 then 'S' WHEN cv_st_detail.sec_id=20 then 'T' WHEN cv_st_detail.sec_id=21 then 'U' WHEN cv_st_detail.sec_id=22 then 'V' WHEN cv_st_detail.sec_id=23 then 'W' WHEN cv_st_detail.sec_id=24 then 'X' WHEN cv_st_detail.sec_id=25 then 'Y' WHEN cv_st_detail.sec_id=26 then 'Z' END 'sec',cv_users.role_id,CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role' from (SELECT round(Avg(user_spent_time.spend_time/ user_spent_time.times_in_day),0) 'avg_spent_time',user_spent_time.user_id from user_spent_time left  join cv_users on cv_users.user_id = user_spent_time.user_id left join cv_school_detail on cv_school_detail.sch_id = cv_users.sch_id where cv_school_detail.name =? group by user_spent_time.user_id) t1 left join cv_users on cv_users.user_id = t1.user_id left join cv_st_detail on cv_st_detail.user_id = cv_users.user_id left join cv_school_detail on cv_school_detail.sch_id = cv_users.user_id  where role_id =? and cls_id =?",
    [params.sch_name, params.role_id, params.cls_id],
    function(err, data) {
      // console.log(data);
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/get_filter_visited_logs_sch_details", (req, res) => {
  let params = req.body;
  pool.query(
    //"SELECT t1.spent_time,t1.name,t1.username,t1.user_id,t1.sec,t1.role_id,t1.role,t1.cls_id ,CASE WHEN round((t1.user_spent_time/t1.total_spent_time)*100,0) <= 33 then 'Below Average' WHEN round((t1.user_spent_time/t1.total_spent_time)*100,0)> 33 and round((t1.user_spent_time/t1.total_spent_time)*100,0) <= 66 THEN 'Average' else 'Above Average' end 'platform_time',SEC_TO_TIME(t1.total_spent_time) 'total_spent_time' from (SELECT SEC_TO_TIME(round(AVG(visited_page_summary.spent_time),0)) 'spent_time',sum(visited_page_summary.spent_time) 'user_spent_time',(SELECT sum(visited_page_summary.spent_time) from visited_page_summary left join cv_users on visited_page_summary.user_id = cv_users.user_id left join cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id where cv_school_detail.name =?) 'total_spent_time',visited_page_summary.user_id,cv_users.name,cv_users.username,CASE WHEN cv_st_detail.sec_id=1 then 'A' WHEN cv_st_detail.sec_id=2 then 'B' WHEN cv_st_detail.sec_id=3 then 'C' WHEN cv_st_detail.sec_id=4 then 'D' WHEN cv_st_detail.sec_id=5 then 'E' WHEN cv_st_detail.sec_id=6 then 'F' WHEN cv_st_detail.sec_id=7 then 'G' WHEN cv_st_detail.sec_id=8 then 'H' WHEN cv_st_detail.sec_id=9 then 'I' WHEN cv_st_detail.sec_id=10 then 'J' WHEN cv_st_detail.sec_id=11 then 'K' WHEN cv_st_detail.sec_id=12 then 'L' WHEN cv_st_detail.sec_id=13 then 'M' WHEN cv_st_detail.sec_id=14 then 'N' WHEN cv_st_detail.sec_id=15 then 'O' WHEN cv_st_detail.sec_id=16 then 'P' WHEN cv_st_detail.sec_id=17 then 'Q' WHEN cv_st_detail.sec_id=18 then 'R' WHEN cv_st_detail.sec_id=19 then 'S' WHEN cv_st_detail.sec_id=20 then 'T' WHEN cv_st_detail.sec_id=21 then 'U' WHEN cv_st_detail.sec_id=22 then 'V' WHEN cv_st_detail.sec_id=23 then 'W' WHEN cv_st_detail.sec_id=24 then 'X' WHEN cv_st_detail.sec_id=25 then 'Y' WHEN cv_st_detail.sec_id=26 then 'Z' END 'sec',cv_users.role_id,CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role',cv_st_detail.cls_id from visited_page_summary left join cv_users on cv_users.user_id = visited_page_summary.user_id left JOIN cv_st_detail on cv_users.user_id = cv_st_detail.user_id left join cv_school_detail on cv_school_detail.sch_id = cv_users.sch_id where cv_school_detail.name =? group by visited_page_summary.user_id) t1 where role_id =? order by role_id desc",
    "SELECT t1.user_id, SEC_TO_TIME(t1.avg_spent_time) 'avg_spent_time',cv_st_detail.cls_id,CASE WHEN t1.avg_spent_time < 20 then 'Below Average' WHEN t1.avg_spent_time =20 then 'Average' Else 'Above Average' END 'platform_time',cv_users.name,cv_users.username,CASE WHEN cv_st_detail.sec_id=1 then 'A' WHEN cv_st_detail.sec_id=2 then 'B' WHEN cv_st_detail.sec_id=3 then 'C' WHEN cv_st_detail.sec_id=4 then 'D' WHEN cv_st_detail.sec_id=5 then 'E' WHEN cv_st_detail.sec_id=6 then 'F' WHEN cv_st_detail.sec_id=7 then 'G' WHEN cv_st_detail.sec_id=8 then 'H' WHEN cv_st_detail.sec_id=9 then 'I' WHEN cv_st_detail.sec_id=10 then 'J' WHEN cv_st_detail.sec_id=11 then 'K' WHEN cv_st_detail.sec_id=12 then 'L' WHEN cv_st_detail.sec_id=13 then 'M' WHEN cv_st_detail.sec_id=14 then 'N' WHEN cv_st_detail.sec_id=15 then 'O' WHEN cv_st_detail.sec_id=16 then 'P' WHEN cv_st_detail.sec_id=17 then 'Q' WHEN cv_st_detail.sec_id=18 then 'R' WHEN cv_st_detail.sec_id=19 then 'S' WHEN cv_st_detail.sec_id=20 then 'T' WHEN cv_st_detail.sec_id=21 then 'U' WHEN cv_st_detail.sec_id=22 then 'V' WHEN cv_st_detail.sec_id=23 then 'W' WHEN cv_st_detail.sec_id=24 then 'X' WHEN cv_st_detail.sec_id=25 then 'Y' WHEN cv_st_detail.sec_id=26 then 'Z' END 'sec',cv_users.role_id,CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role' from (SELECT round(Avg(user_spent_time.spend_time/ user_spent_time.times_in_day),0) 'avg_spent_time',user_spent_time.user_id from user_spent_time left  join cv_users on cv_users.user_id = user_spent_time.user_id left join cv_school_detail on cv_school_detail.sch_id = cv_users.sch_id where cv_school_detail.name =? group by user_spent_time.user_id) t1 left join cv_users on cv_users.user_id = t1.user_id left join cv_st_detail on cv_st_detail.user_id = cv_users.user_id left join cv_school_detail on cv_school_detail.sch_id = cv_users.user_id where role_id=?",
    [params.sch_name, params.role_id],
    function(err, data) {
      // console.log(data);
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/get_school_classes", (req, res) => {
  let params = req.body;
  pool.query(
    "SELECT * from cv_school_classes where cv_school_classes.sch_id in(SELECT sch_id FROM cv_school_detail where name=?) order by cls_id",
    [params.sch_name],
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/get_visited_logs_sch_details", (req, res) => {
  let params = req.body;
  pool.query(
    //  "SELECT t1.spent_time,t1.name,t1.username,t1.user_id,t1.sec,t1.role_id,t1.role,t1.cls_id ,CASE WHEN round((t1.user_spent_time/t1.total_spent_time)*100,0) <= 33 then 'Below Average' WHEN round((t1.user_spent_time/t1.total_spent_time)*100,0)> 33 and round((t1.user_spent_time/t1.total_spent_time)*100,0) <= 66 THEN 'Average' else 'Above Average' end 'platform_time',SEC_TO_TIME(t1.total_spent_time) 'total_spent_time' from (SELECT SEC_TO_TIME(round(AVG(visited_page_summary.spent_time),0)) 'spent_time',sum(visited_page_summary.spent_time) 'user_spent_time',(SELECT sum(visited_page_summary.spent_time) from visited_page_summary left join cv_users on visited_page_summary.user_id = cv_users.user_id left join cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id where cv_school_detail.name =?) 'total_spent_time',visited_page_summary.user_id,cv_users.name,cv_users.username,CASE WHEN cv_st_detail.sec_id=1 then 'A' WHEN cv_st_detail.sec_id=2 then 'B' WHEN cv_st_detail.sec_id=3 then 'C' WHEN cv_st_detail.sec_id=4 then 'D' WHEN cv_st_detail.sec_id=5 then 'E' WHEN cv_st_detail.sec_id=6 then 'F' WHEN cv_st_detail.sec_id=7 then 'G' WHEN cv_st_detail.sec_id=8 then 'H' WHEN cv_st_detail.sec_id=9 then 'I' WHEN cv_st_detail.sec_id=10 then 'J' WHEN cv_st_detail.sec_id=11 then 'K' WHEN cv_st_detail.sec_id=12 then 'L' WHEN cv_st_detail.sec_id=13 then 'M' WHEN cv_st_detail.sec_id=14 then 'N' WHEN cv_st_detail.sec_id=15 then 'O' WHEN cv_st_detail.sec_id=16 then 'P' WHEN cv_st_detail.sec_id=17 then 'Q' WHEN cv_st_detail.sec_id=18 then 'R' WHEN cv_st_detail.sec_id=19 then 'S' WHEN cv_st_detail.sec_id=20 then 'T' WHEN cv_st_detail.sec_id=21 then 'U' WHEN cv_st_detail.sec_id=22 then 'V' WHEN cv_st_detail.sec_id=23 then 'W' WHEN cv_st_detail.sec_id=24 then 'X' WHEN cv_st_detail.sec_id=25 then 'Y' WHEN cv_st_detail.sec_id=26 then 'Z' END 'sec',cv_users.role_id,CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role',cv_st_detail.cls_id from visited_page_summary left join cv_users on cv_users.user_id = visited_page_summary.user_id left JOIN cv_st_detail on cv_users.user_id = cv_st_detail.user_id left join cv_school_detail on cv_school_detail.sch_id = cv_users.sch_id where cv_school_detail.name =? group by visited_page_summary.user_id) t1 order by role_id desc",
    //[params.sch_name, params.sch_name],
    "SELECT t1.user_id, SEC_TO_TIME(t1.avg_spent_time) 'spent_time',cv_st_detail.cls_id,CASE WHEN t1.avg_spent_time < 20 then 'Below Average' WHEN t1.avg_spent_time =20 then 'Average' Else 'Above Average' END 'platform_time',cv_users.name,cv_users.username,CASE WHEN cv_st_detail.sec_id=1 then 'A' WHEN cv_st_detail.sec_id=2 then 'B' WHEN cv_st_detail.sec_id=3 then 'C' WHEN cv_st_detail.sec_id=4 then 'D' WHEN cv_st_detail.sec_id=5 then 'E' WHEN cv_st_detail.sec_id=6 then 'F' WHEN cv_st_detail.sec_id=7 then 'G' WHEN cv_st_detail.sec_id=8 then 'H' WHEN cv_st_detail.sec_id=9 then 'I' WHEN cv_st_detail.sec_id=10 then 'J' WHEN cv_st_detail.sec_id=11 then 'K' WHEN cv_st_detail.sec_id=12 then 'L' WHEN cv_st_detail.sec_id=13 then 'M' WHEN cv_st_detail.sec_id=14 then 'N' WHEN cv_st_detail.sec_id=15 then 'O' WHEN cv_st_detail.sec_id=16 then 'P' WHEN cv_st_detail.sec_id=17 then 'Q' WHEN cv_st_detail.sec_id=18 then 'R' WHEN cv_st_detail.sec_id=19 then 'S' WHEN cv_st_detail.sec_id=20 then 'T' WHEN cv_st_detail.sec_id=21 then 'U' WHEN cv_st_detail.sec_id=22 then 'V' WHEN cv_st_detail.sec_id=23 then 'W' WHEN cv_st_detail.sec_id=24 then 'X' WHEN cv_st_detail.sec_id=25 then 'Y' WHEN cv_st_detail.sec_id=26 then 'Z' END 'sec',cv_users.role_id,CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role' from (SELECT round(Avg(user_spent_time.spend_time/ user_spent_time.times_in_day),0) 'avg_spent_time',user_spent_time.user_id from user_spent_time left  join cv_users on cv_users.user_id = user_spent_time.user_id left join cv_school_detail on cv_school_detail.sch_id = cv_users.sch_id where cv_school_detail.name =? group by user_spent_time.user_id) t1 left join cv_users on cv_users.user_id = t1.user_id left join cv_st_detail on cv_st_detail.user_id = cv_users.user_id left join cv_school_detail on cv_school_detail.sch_id = cv_users.user_id",
    [params.sch_name],
    function(err, data) {
      // console.log(data);
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

router.post("/get_filter_cls_register_logs_sch_details", (req, res) => {
  let params = req.body;
  pool.query(
    "select cv_users.user_id,cv_users.name,cv_st_detail.cls_id,CASE WHEN cv_st_detail.sec_id=1 then 'A' WHEN cv_st_detail.sec_id=2 then 'B' WHEN cv_st_detail.sec_id=3 then 'C' WHEN cv_st_detail.sec_id=4 then 'D' WHEN cv_st_detail.sec_id=5 then 'E' WHEN cv_st_detail.sec_id=6 then 'F' WHEN cv_st_detail.sec_id=7 then 'G' WHEN cv_st_detail.sec_id=8 then 'H' WHEN cv_st_detail.sec_id=9 then 'I' WHEN cv_st_detail.sec_id=10 then 'J' WHEN cv_st_detail.sec_id=11 then 'K' WHEN cv_st_detail.sec_id=12 then 'L' WHEN cv_st_detail.sec_id=13 then 'M' WHEN cv_st_detail.sec_id=14 then 'N' WHEN cv_st_detail.sec_id=15 then 'O' WHEN cv_st_detail.sec_id=16 then 'P' WHEN cv_st_detail.sec_id=17 then 'Q' WHEN cv_st_detail.sec_id=18 then 'R' WHEN cv_st_detail.sec_id=19 then 'S' WHEN cv_st_detail.sec_id=20 then 'T' WHEN cv_st_detail.sec_id=21 then 'U' WHEN cv_st_detail.sec_id=22 then 'V' WHEN cv_st_detail.sec_id=23 then 'W' WHEN cv_st_detail.sec_id=24 then 'X' WHEN cv_st_detail.sec_id=25 then 'Y' WHEN cv_st_detail.sec_id=26 then 'Z' END 'sec',(SELECT count(*) from cv_users left join cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id  where cv_users.name != cv_school_detail.name and  cv_users.sch_id =(SELECT sch_id from cv_school_detail where cv_school_detail.name=?)) 'tot_users',CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role',(SELECT SEC_TO_TIME(round(abs(avg((visited_page_summary.spent_time))),0)) from visited_page_summary where visited_page_summary.user_id = cv_users.user_id GROUP by visited_page_summary.user_id) 'avg_time' from cv_users left join cv_st_detail on cv_users.user_id =cv_st_detail.user_id  left join cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id where cv_users.name != cv_school_detail.name and  cv_users.sch_id=(SELECT sch_id from cv_school_detail where cv_school_detail.name=?) and cv_users.role_id=? and cv_st_detail.cls_id=? group by cv_users.user_id order by cv_users.role_id desc",
    [params.sch_name, params.sch_name, params.role_id, params.cls_id],
    function(err, data) {
      if (!err) {
        // console.log(data);
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

router.post("/get_filter_role_register_logs_sch_details", (req, res) => {
  let params = req.body;
  pool.query(
    "select cv_users.user_id,cv_users.name,cv_st_detail.cls_id,CASE WHEN cv_st_detail.sec_id=1 then 'A' WHEN cv_st_detail.sec_id=2 then 'B' WHEN cv_st_detail.sec_id=3 then 'C' WHEN cv_st_detail.sec_id=4 then 'D' WHEN cv_st_detail.sec_id=5 then 'E' WHEN cv_st_detail.sec_id=6 then 'F' WHEN cv_st_detail.sec_id=7 then 'G' WHEN cv_st_detail.sec_id=8 then 'H' WHEN cv_st_detail.sec_id=9 then 'I' WHEN cv_st_detail.sec_id=10 then 'J' WHEN cv_st_detail.sec_id=11 then 'K' WHEN cv_st_detail.sec_id=12 then 'L' WHEN cv_st_detail.sec_id=13 then 'M' WHEN cv_st_detail.sec_id=14 then 'N' WHEN cv_st_detail.sec_id=15 then 'O' WHEN cv_st_detail.sec_id=16 then 'P' WHEN cv_st_detail.sec_id=17 then 'Q' WHEN cv_st_detail.sec_id=18 then 'R' WHEN cv_st_detail.sec_id=19 then 'S' WHEN cv_st_detail.sec_id=20 then 'T' WHEN cv_st_detail.sec_id=21 then 'U' WHEN cv_st_detail.sec_id=22 then 'V' WHEN cv_st_detail.sec_id=23 then 'W' WHEN cv_st_detail.sec_id=24 then 'X' WHEN cv_st_detail.sec_id=25 then 'Y' WHEN cv_st_detail.sec_id=26 then 'Z' END 'sec',(SELECT count(*) from cv_users left join cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id  where cv_users.name != cv_school_detail.name and  cv_users.sch_id =(SELECT sch_id from cv_school_detail where cv_school_detail.name=?)) 'tot_users',CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role',(SELECT SEC_TO_TIME(round(abs(avg((visited_page_summary.spent_time))),0)) from visited_page_summary where visited_page_summary.user_id = cv_users.user_id GROUP by visited_page_summary.user_id) 'avg_time' from cv_users left join cv_st_detail on cv_users.user_id =cv_st_detail.user_id  left join cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id where cv_users.name != cv_school_detail.name and  cv_users.sch_id=(SELECT sch_id from cv_school_detail where cv_school_detail.name=?) and cv_users.role_id=? group by cv_users.user_id order by cv_users.role_id desc",
    [params.sch_name, params.sch_name, params.role_id],
    function(err, data) {
      if (!err) {
        // console.log(data);
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/get_register_logs_sch_details", (req, res) => {
  let params = req.body;
  //console.log(params);
  pool.query(
    //"select cv_users.user_id,cv_users.name,cv_st_detail.cls_id,CASE WHEN cv_st_detail.sec_id=1 then 'A' WHEN cv_st_detail.sec_id=2 then 'B' WHEN cv_st_detail.sec_id=3 then 'C' WHEN cv_st_detail.sec_id=4 then 'D' WHEN cv_st_detail.sec_id=5 then 'E' WHEN cv_st_detail.sec_id=6 then 'F' WHEN cv_st_detail.sec_id=7 then 'G' WHEN cv_st_detail.sec_id=8 then 'H' WHEN cv_st_detail.sec_id=9 then 'I' WHEN cv_st_detail.sec_id=10 then 'J' WHEN cv_st_detail.sec_id=11 then 'K' WHEN cv_st_detail.sec_id=12 then 'L' WHEN cv_st_detail.sec_id=13 then 'M' WHEN cv_st_detail.sec_id=14 then 'N' WHEN cv_st_detail.sec_id=15 then 'O' WHEN cv_st_detail.sec_id=16 then 'P' WHEN cv_st_detail.sec_id=17 then 'Q' WHEN cv_st_detail.sec_id=18 then 'R' WHEN cv_st_detail.sec_id=19 then 'S' WHEN cv_st_detail.sec_id=20 then 'T' WHEN cv_st_detail.sec_id=21 then 'U' WHEN cv_st_detail.sec_id=22 then 'V' WHEN cv_st_detail.sec_id=23 then 'W' WHEN cv_st_detail.sec_id=24 then 'X' WHEN cv_st_detail.sec_id=25 then 'Y' WHEN cv_st_detail.sec_id=26 then 'Z' END 'sec',SEC_TO_TIME(abs(round(avg(t1.avg_time),0)))'avg_time',(SELECT count(*) from cv_users left join cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id  where cv_users.name != cv_school_detail.name and  cv_users.sch_id =(SELECT sch_id from cv_school_detail where cv_school_detail.name=?)) 'tot_users',CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role' from cv_users left join (select (SELECT ROUND(avg(TIME_TO_SEC(TIMEDIFF(CASE When page_out_time then page_out_time else update_time end,page_in_time))-ideal_time),0) FROM `user_visited_page` WHERE user_visited_page.user_spen_id=user_spent_time.user_spen_id group  by user_spen_id) 'avg_time',user_spent_time.user_id from user_spent_time) t1 on cv_users.user_id = t1.user_id left join cv_st_detail on cv_users.user_id =cv_st_detail.user_id  left join cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id where cv_users.name != cv_school_detail.name and  cv_users.sch_id=(SELECT sch_id from cv_school_detail where cv_school_detail.name=?)   group by cv_users.user_id order by cv_users.role_id desc",
    //"select cv_users.user_id,cv_users.name,cv_st_detail.cls_id,CASE WHEN cv_st_detail.sec_id=1 then 'A' WHEN cv_st_detail.sec_id=2 then 'B' WHEN cv_st_detail.sec_id=3 then 'C' WHEN cv_st_detail.sec_id=4 then 'D' WHEN cv_st_detail.sec_id=5 then 'E' WHEN cv_st_detail.sec_id=6 then 'F' WHEN cv_st_detail.sec_id=7 then 'G' WHEN cv_st_detail.sec_id=8 then 'H' WHEN cv_st_detail.sec_id=9 then 'I' WHEN cv_st_detail.sec_id=10 then 'J' WHEN cv_st_detail.sec_id=11 then 'K' WHEN cv_st_detail.sec_id=12 then 'L' WHEN cv_st_detail.sec_id=13 then 'M' WHEN cv_st_detail.sec_id=14 then 'N' WHEN cv_st_detail.sec_id=15 then 'O' WHEN cv_st_detail.sec_id=16 then 'P' WHEN cv_st_detail.sec_id=17 then 'Q' WHEN cv_st_detail.sec_id=18 then 'R' WHEN cv_st_detail.sec_id=19 then 'S' WHEN cv_st_detail.sec_id=20 then 'T' WHEN cv_st_detail.sec_id=21 then 'U' WHEN cv_st_detail.sec_id=22 then 'V' WHEN cv_st_detail.sec_id=23 then 'W' WHEN cv_st_detail.sec_id=24 then 'X' WHEN cv_st_detail.sec_id=25 then 'Y' WHEN cv_st_detail.sec_id=26 then 'Z' END 'sec',(SELECT count(*) from cv_users left join cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id  where cv_users.name != cv_school_detail.name and  cv_users.sch_id =(SELECT sch_id from cv_school_detail where cv_school_detail.name=?)) 'tot_users',CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role',(SELECT SEC_TO_TIME(round(abs(avg((visited_page_summary.spent_time -visited_page_summary.ideal_time))),0)) from visited_page_summary where visited_page_summary.user_id = cv_users.user_id GROUP by visited_page_summary.user_id) 'avg_time' from cv_users left join cv_st_detail on cv_users.user_id =cv_st_detail.user_id  left join cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id where cv_users.name != cv_school_detail.name and  cv_users.sch_id=(SELECT sch_id from cv_school_detail where cv_school_detail.name=?)   group by cv_users.user_id order by cv_users.role_id desc",
    "select cv_users.user_id,cv_users.name,cv_st_detail.cls_id,CASE WHEN cv_st_detail.sec_id=1 then 'A' WHEN cv_st_detail.sec_id=2 then 'B' WHEN cv_st_detail.sec_id=3 then 'C' WHEN cv_st_detail.sec_id=4 then 'D' WHEN cv_st_detail.sec_id=5 then 'E' WHEN cv_st_detail.sec_id=6 then 'F' WHEN cv_st_detail.sec_id=7 then 'G' WHEN cv_st_detail.sec_id=8 then 'H' WHEN cv_st_detail.sec_id=9 then 'I' WHEN cv_st_detail.sec_id=10 then 'J' WHEN cv_st_detail.sec_id=11 then 'K' WHEN cv_st_detail.sec_id=12 then 'L' WHEN cv_st_detail.sec_id=13 then 'M' WHEN cv_st_detail.sec_id=14 then 'N' WHEN cv_st_detail.sec_id=15 then 'O' WHEN cv_st_detail.sec_id=16 then 'P' WHEN cv_st_detail.sec_id=17 then 'Q' WHEN cv_st_detail.sec_id=18 then 'R' WHEN cv_st_detail.sec_id=19 then 'S' WHEN cv_st_detail.sec_id=20 then 'T' WHEN cv_st_detail.sec_id=21 then 'U' WHEN cv_st_detail.sec_id=22 then 'V' WHEN cv_st_detail.sec_id=23 then 'W' WHEN cv_st_detail.sec_id=24 then 'X' WHEN cv_st_detail.sec_id=25 then 'Y' WHEN cv_st_detail.sec_id=26 then 'Z' END 'sec',(SELECT count(*) from cv_users left join cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id  where cv_users.name != cv_school_detail.name and  cv_users.sch_id =(SELECT sch_id from cv_school_detail where cv_school_detail.name=?)) 'tot_users',CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role',(SELECT SEC_TO_TIME(round(abs(avg((visited_page_summary.spent_time))),0)) from visited_page_summary where visited_page_summary.user_id = cv_users.user_id GROUP by visited_page_summary.user_id) 'avg_time' from cv_users left join cv_st_detail on cv_users.user_id =cv_st_detail.user_id  left join cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id where cv_users.name != cv_school_detail.name and  cv_users.sch_id=(SELECT sch_id from cv_school_detail where cv_school_detail.name=?)   group by cv_users.user_id order by cv_users.role_id desc",
    [params.sch_name, params.sch_name],
    function(err, data) {
      if (!err) {
        // console.log(data);
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

router.post("/get_individual_logs_details", (req, res) => {
  pool.query(
    //"select t1.name,t1.organisation,t1.role, sum(visited_page) 'visited_page',SEC_TO_TIME(SUM(TIME_TO_SEC(abs(spent_time)))) 'spent_time' from (SELECT user_spent_time.user_status,cv_users.name,cv_users.user_id,cv_school_detail.name 'organisation',CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role',(select count(*) from user_visited_page where user_visited_page.user_spen_id = user_spent_time.user_spen_id group by user_spen_id) 'visited_page',(select TIMEDIFF(SEC_TO_TIME( SUM(ABS(TIME_TO_SEC(page_out_time)))),SEC_TO_TIME(SUM(ABS(TIME_TO_SEC(page_in_time))))) 'spent_time' from user_visited_page where user_visited_page.user_spen_id = user_spent_time.user_spen_id group by user_spen_id) 'spent_time',cv_users.username FROM `user_spent_time` join cv_users on cv_users.user_id =user_spent_time.user_id left join cv_school_detail on cv_school_detail.sch_id = cv_users.sch_id) t1 group by t1.user_id",
    //"select t1.name,t1.username,t1.organisation,t1.role, sum(visited_page) 'visited_page',SEC_TO_TIME(SUM(t1.spent_time)) 'spent_time' from (SELECT user_spent_time.user_status,cv_users.username,cv_users.user_id,cv_school_detail.name 'organisation',CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role',(select count(*) from visited_page_summary where visited_page_summary.user_id = user_spent_time.user_id group by user_id) 'visited_page',(select ((sum(visited_page_summary.spent_time)-sum(visited_page_summary.ideal_time))) 'spent_time' from visited_page_summary where visited_page_summary.user_id = user_spent_time.user_id group by visited_page_summary.user_id) 'spent_time',cv_users.username FROM `user_spent_time` join cv_users on cv_users.user_id =user_spent_time.user_id left join cv_school_detail on cv_school_detail.sch_id = cv_users.sch_id) t1 where visited_page IS NOT NULL group by t1.user_id",
    "select t1.name,t1.username,t1.organisation,t1.role, sum(visited_page) 'visited_page',SEC_TO_TIME(SUM(t1.spent_time)) 'spent_time',SEC_TO_TIME(SUM(t1.spent_time)) 'ideal_time' from (SELECT user_spent_time.user_status,cv_users.name,cv_users.user_id,cv_school_detail.name 'organisation',cv_users.sch_id,CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role',(select count(*) from visited_page_summary where visited_page_summary.user_id = user_spent_time.user_id group by user_id) 'visited_page',(select ((sum(visited_page_summary.spent_time))) 'spent_time' from visited_page_summary where visited_page_summary.user_id = user_spent_time.user_id group by visited_page_summary.user_id) 'spent_time',(select ((sum(visited_page_summary.ideal_time))) 'ideal_time' from visited_page_summary where visited_page_summary.user_id = user_spent_time.user_id group by visited_page_summary.user_id) 'ideal_time',cv_users.username FROM `user_spent_time` join cv_users on cv_users.user_id =user_spent_time.user_id left join cv_school_detail on cv_school_detail.sch_id = cv_users.sch_id) t1 where visited_page IS NOT NULL and sch_id=1 group by t1.user_id",
    function(err, data) {
      if (!err) {
        //  console.log(data);
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

router.post("/get_online_logs_details", (req, res) => {
  pool.query(
    //"select t1.name,t1.organisation,t1.role, sum(visited_page) 'visited_page',SEC_TO_TIME(SUM(TIME_TO_SEC(abs(spent_time)))) 'spent_time' from (SELECT user_spent_time.user_status,cv_users.name,cv_users.user_id,cv_school_detail.name 'organisation',CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role',(select count(*) from user_visited_page where user_visited_page.user_spen_id = user_spent_time.user_spen_id group by user_spen_id) 'visited_page',(select TIMEDIFF(SEC_TO_TIME( SUM(ABS(TIME_TO_SEC(page_out_time)))),SEC_TO_TIME(SUM(ABS(TIME_TO_SEC(page_in_time))))) 'spent_time' from user_visited_page where user_visited_page.user_spen_id = user_spent_time.user_spen_id group by user_spen_id) 'spent_time',cv_users.username FROM `user_spent_time` join cv_users on cv_users.user_id =user_spent_time.user_id left join cv_school_detail on cv_school_detail.sch_id = cv_users.sch_id) t1 group by t1.user_id",
    //"select t1.name,t1.username,t1.organisation,t1.role, sum(visited_page) 'visited_page',SEC_TO_TIME(SUM(t1.spent_time)) 'spent_time' from (SELECT user_spent_time.user_status,cv_users.username,cv_users.user_id,cv_school_detail.name 'organisation',CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role',(select count(*) from visited_page_summary where visited_page_summary.user_id = user_spent_time.user_id group by user_id) 'visited_page',(select ((sum(visited_page_summary.spent_time)-sum(visited_page_summary.ideal_time))) 'spent_time' from visited_page_summary where visited_page_summary.user_id = user_spent_time.user_id group by visited_page_summary.user_id) 'spent_time',cv_users.username FROM `user_spent_time` join cv_users on cv_users.user_id =user_spent_time.user_id left join cv_school_detail on cv_school_detail.sch_id = cv_users.sch_id) t1 where visited_page IS NOT NULL group by t1.user_id",
    "select t1.name,t1.username,t1.organisation,t1.role, sum(visited_page) 'visited_page',SEC_TO_TIME(SUM(t1.spent_time)) 'spent_time',SEC_TO_TIME(SUM(t1.spent_time)) 'ideal_time' from (SELECT user_spent_time.user_status,cv_users.name,cv_users.user_id,cv_school_detail.name 'organisation',CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role',(select count(*) from visited_page_summary where visited_page_summary.user_id = user_spent_time.user_id group by user_id) 'visited_page',(select ((sum(visited_page_summary.spent_time))) 'spent_time' from visited_page_summary where visited_page_summary.user_id = user_spent_time.user_id group by visited_page_summary.user_id) 'spent_time',(select ((sum(visited_page_summary.ideal_time))) 'ideal_time' from visited_page_summary where visited_page_summary.user_id = user_spent_time.user_id group by visited_page_summary.user_id) 'ideal_time',cv_users.username FROM `user_spent_time` join cv_users on cv_users.user_id =user_spent_time.user_id left join cv_school_detail on cv_school_detail.sch_id = cv_users.sch_id) t1 where visited_page IS NOT NULL group by t1.user_id",
    function(err, data) {
      if (!err) {
        //  console.log(data);
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

router.post("/focus_visited_page", (req, res) => {
  let params = req.body;
  pool.query(
    "SELECT user_spent_time.user_spen_id from user_spent_time where user_id=? and user_status=0 order by login_time desc limit 1",
    [params.user_id],
    function(err, data) {
      if (!err) {
        if (data.length) {
          pool.query(
            "Update user_spent_time set user_status=1 where user_spen_id=?",
            [data[0].user_spen_id],
            function(err, result) {
              if (!err) {
                pool.query(
                  "SELECT * FROM `user_visited_page` WHERE user_visited_page.user_spen_id =? and user_visited_page.page_to=? order by visited_id desc limit 1",
                  [data[0].user_spen_id, params.page_full_path],
                  function(err, data1) {
                    if (!err) {
                      if (data1.length) {
                        let ideal_time = data1[0].ideal_time;
                        /*pool.query(
                            "UPDATE `user_visited_page` SET ideal_time= ("+ideal_time+" + (TIME_TO_SEC(TIMEDIFF(now(),update_time)))) WHERE visited_id=?",
                            [data1[0].visited_id],
                            function(err, result2) {
                              pool.query(
                                "UPDATE `user_visited_page` SET update_time =now() where visited_id=?",
                                [data1[0].visited_id],
                                function(err, result3) {
                                  if (!err) {
                                    res.json({
                                      status: "200",
                                      data: "1"
                                    });
                                  }
                                }
                              );
                            }
                          );*/
                      }
                    }
                  }
                );
              }
            }
          );
        }
      }
    }
  );
});
router.post("/ideal_visited_page", (req, res) => {
  let params = req.body;
  //console.log(params);
  var conn;

  return db
    .getConnection()
    .then((connection) => {
      conn = connection;
    })
    .then(() => {
      conn.beginTransaction(function(err) {
        if (err) {
          conn.release();
          res.json({
            status: "200",
            data: "0",
          });
          return;
        }

        conn.query(
          "SELECT user_spent_time.user_spen_id from user_spent_time where user_id=? order by login_time desc limit 1",
          [params.user_id],
          function(err, data) {
            if (!err) {
              //   console.log("enter for update user_status");
              if (data.length) {
                conn.query(
                  "Update user_spent_time set user_status=1 where user_spen_id=?",
                  [data[0].user_spen_id],
                  function(err, result) {
                    if (!err) {
                      conn.query(
                        "SELECT * FROM `user_visited_page` WHERE user_visited_page.user_spen_id =? and user_visited_page.page_to=? order by visited_id desc",
                        [data[0].user_spen_id, params.page_full_path],
                        function(err, data1) {
                          if (!err) {
                            // console.log(data);
                            //  console.log("success");
                            //  console.log(data1);
                            if (data1.length) {
                              //   console.log("enter for update ideal time");
                              let ideal_time = data1[0].ideal_time + 60;
                              let query =
                                "UPDATE `user_visited_page` SET `ideal_time`=" +
                                ideal_time +
                                " WHERE visited_id=?";
                              // console.log(query);
                              conn.query(query, [data1[0].visited_id], function(
                                err,
                                result2
                              ) {
                                //   console.log("enter for update update_time");
                                conn.query(
                                  "UPDATE `user_visited_page` SET update_time =now() where visited_id=?",
                                  [data1[0].visited_id],
                                  function(err, result3) {
                                    conn.release();
                                    if (!err) {
                                      res.json({
                                        status: "200",
                                        data: "1",
                                      });
                                    }
                                  }
                                );
                              });
                            } else {
                              // console.log("inserted");
                              conn.query(
                                "INSERT INTO `user_visited_page`(`user_spen_id`,`page_from`,`page_to`,`update_time`,`ideal_time`) VALUES (?,?,?,now(),?)",
                                [
                                  data[0].user_spen_id,
                                  params.page_full_path,
                                  params.page_full_path,
                                  60,
                                ],
                                function(err, data3) {
                                  conn.release();
                                  if (!err) {
                                    res.json({
                                      status: "200",
                                      data: "1",
                                    });
                                  }
                                }
                              );
                            }
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          }
        );
      });
    })
    .catch((err) => {
      try {
        conn.release();
      } catch (e) {}
    });
});

router.post("/close_window", (req, res) => {
  let params = req.body;
  //console.log("close_window");
  // console.log(params);

  pool.query(
    "select user_spen_id from user_spent_time where user_id =?  order by user_spen_id desc limit 1",
    [params.user_id],
    function(err, data) {
      if (!err) {
        // console.log("successful enter user_spent time first query close");
        if (data.length != 0) {
          let user_span_id = data[0].user_spen_id;
          pool.query(
            "SELECT visited_id FROM `user_visited_page` WHERE user_spen_id=? order by visited_id desc",
            [data[0].user_spen_id],
            function(err, data1) {
              if (!err) {
                if (data1.length) {
                  pool.query(
                    "UPDATE `user_visited_page` SET `page_out_time`=now(),spen_time_sec=(TIME_TO_SEC(TIMEDIFF(now(),page_in_time))-ideal_time) WHERE visited_id=?",
                    [data1[0].visited_id],
                    function(err, data2) {
                      if (!err) {
                        //    console.log("successful user_visited_page updated");
                        pool.query(
                          "select user_visited_page.visited_id,user_visited_page.user_spen_id,user_visited_page.page_from,user_visited_page.page_to,user_visited_page.page_in_time,user_visited_page.page_out_time,user_visited_page.update_time,user_visited_page.ideal_time,user_visited_page.spen_time_sec,user_spent_time.user_id from user_visited_page LEFT join user_spent_time on user_visited_page.user_spen_id = user_spent_time.user_spen_id where user_visited_page.user_spen_id=?",
                          [user_span_id],
                          async function(err, datas) {
                            let qury = "";
                            let params = "";
                            for (var i = 0; i < datas.length; i++) {
                              qury =
                                "select * from visited_page_summary where page_name = ? and user_id =?";
                              params = [datas[i].page_to, datas[i].user_id];
                              //    console.log(params);
                              await runSqlQueryAsync(qury, params).then(
                                async function(datum) {
                                  //console.log("data");
                                  //console.log(datum);

                                  if (datum.length) {
                                    qury =
                                      "UPDATE `visited_page_summary` SET `spent_time`=?,`ideal_time`=?,`visited_times`=? where page_name=? and user_id=?";
                                    let spent_time =
                                      datum[0].spent_time +
                                      datas[i].spen_time_sec;
                                    let ideal_time =
                                      datum[0].ideal_time + datas[i].ideal_time;
                                    params = [
                                      spent_time,
                                      ideal_time,
                                      datas[i].update_time,
                                      datas[i].page_to,
                                      datum[0].user_id,
                                    ];
                                    await runSqlQueryAsync(qury, params).then(
                                      (datadelete) => {
                                        //console.log("successful updated");
                                      }
                                    );
                                  } else {
                                    qury =
                                      "INSERT INTO `visited_page_summary`(`page_name`, `user_id`, `spent_time`, `ideal_time`, `visited_times`) values(?,?,?,?,?)";
                                    params = [
                                      datas[i].page_to,
                                      datas[i].user_id,
                                      datas[i].spen_time_sec,
                                      datas[i].ideal_time,
                                      datas[i].update_time,
                                    ];
                                    await runSqlQueryAsync(qury, params).then(
                                      (datainsert) => {
                                        // console.log("successful inserted");
                                      }
                                    );
                                  }
                                }
                              );
                              //  console.log("step ="+(i+1))
                            }
                            qury =
                              "select * from user_spent_time where user_id =? and DATE_FORMAT(user_spent_time.login_time,'%d %m %y') = DATE_FORMAT(now(),'%d %m %y')";
                            params = [req.body.user_id];

                            await runSqlQueryAsync(qury, params).then(
                              async function(dataU) {
                                //    console.log("updations data");
                                //console.log(dataU);
                                let allspentTime = dataU[0].spend_time;
                                if (!allspentTime) allspentTime = 0;
                                qury =
                                  "UPDATE `user_spent_time` SET `logout_time`= now(),user_status=0,spend_time= (" +
                                  parseInt(allspentTime) +
                                  " + (SELECT sum(TIME_TO_SEC(TIMEDIFF(CASE When page_out_time then page_out_time else update_time end,page_in_time))-ideal_time) FROM `user_visited_page` WHERE user_spen_id=? group  by user_spen_id)) where  user_id=? and user_spen_id=?";
                                (params = [
                                  user_span_id,
                                  req.body.user_id,
                                  user_span_id,
                                ]),
                                  //console.log(qury);
                                  //console.log(params);
                                  await runSqlQueryAsync(qury, params).then(
                                    (dataUpdateStatus) => {
                                      //  console.log(dataUpdateStatus);
                                    }
                                  );
                              }
                            );

                            qury =
                              "DELETE FROM `user_visited_page` WHERE user_spen_id =?";
                            params = [user_span_id];
                            await runSqlQueryAsync(qury, params).then(
                              (datadelete) => {
                                //      console.log("delete operation");
                              }
                            );
                          }
                        );
                      }
                    }
                  );
                } else {
                  qury =
                    "UPDATE `user_spent_time` SET `logout_time`= now(),user_status=0 where  user_id=? and user_spen_id=?";
                  (params = [user_span_id, req.body.user_id, user_span_id]),
                    runSqlQueryAsync(qury, params).then((dataUpdateStatus) => {
                      //  console.log("close window user updation else");
                      // res
                    });
                }
              }
            }
          );
        }
      }
    }
  );
});

router.post("/blur_visited_page", (req, res) => {
  let params = req.body;
  //console.log("before destroy called");
  // console.log(params);
  pool.query(
    "SELECT user_spent_time.user_spen_id from user_spent_time where user_id=? order by login_time desc limit 1",
    [params.user_id],
    function(err, data) {
      if (!err) {
        pool.query(
          "Update user_spent_time set user_status=0 where user_spen_id=?",
          [data[0].user_spen_id],
          function(err, result) {
            if (!err) {
              pool.query(
                "SELECT * FROM `user_visited_page` WHERE user_visited_page.user_spen_id =? and user_visited_page.page_to=? order by visited_id desc",
                [data[0].user_spen_id, params.page_full_path],
                function(err, data1) {
                  if (!err) {
                    //   console.log(data1);

                    if (data1.length) {
                      let spend_time = data1[0].spen_time_sec;
                      if (!spend_time) spend_time = 0;
                      let query =
                        "UPDATE `user_visited_page` SET `spen_time_sec`=(" +
                        parseInt(spend_time) +
                        "+(TIME_TO_SEC(TIMEDIFF(now(),update_time)))) WHERE visited_id=?";
                      /*pool.query(
                        query,
                        [data1[0].visited_id],
                        function(err, result2) {
                          pool.query(
                            "UPDATE `user_visited_page` SET update_time =now() where visited_id=?",
                            [data1[0].visited_id],
                            function(err, result3) {
                              if (!err) {
                                res.json({
                                  status: "200",
                                  data: "1"
                                });
                              }
                            }
                          );
                        }
                      );*/
                    }
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});
router.post("/get_online_logs_details_date_wise", (req, res) => {
  let params = req.body;

  query =
    "SELECT user_spent_time.user_id,user_spent_time.login_time,user_spent_time.logout_time,SEC_TO_TIME(round((user_spent_time.spend_time/user_spent_time.times_in_day),0)) 'spend_time',user_status,user_spent_time.times_in_day,cv_users.name,cv_users.address,cv_st_detail.cls_id,cv_st_detail.sec_id,cv_school_detail.name 'sch_name',cv_users.role_id,CASE WHEN cv_st_detail.sec_id=1 then 'A' WHEN cv_st_detail.sec_id=2 then 'B' WHEN cv_st_detail.sec_id=3 then 'C' WHEN cv_st_detail.sec_id=4 then 'D' WHEN cv_st_detail.sec_id=5 then 'E' WHEN cv_st_detail.sec_id=6 then 'F' WHEN cv_st_detail.sec_id=7 then 'G' WHEN cv_st_detail.sec_id=8 then 'H' WHEN cv_st_detail.sec_id=9 then 'I' WHEN cv_st_detail.sec_id=10 then 'J' WHEN cv_st_detail.sec_id=11 then 'K' WHEN cv_st_detail.sec_id=12 then 'L' WHEN cv_st_detail.sec_id=13 then 'M' WHEN cv_st_detail.sec_id=14 then 'N' WHEN cv_st_detail.sec_id=15 then 'O' WHEN cv_st_detail.sec_id=16 then 'P' WHEN cv_st_detail.sec_id=17 then 'Q' WHEN cv_st_detail.sec_id=18 then 'R' WHEN cv_st_detail.sec_id=19 then 'S' WHEN cv_st_detail.sec_id=20 then 'T' WHEN cv_st_detail.sec_id=21 then 'U' WHEN cv_st_detail.sec_id=22 then 'V' WHEN cv_st_detail.sec_id=23 then 'W' WHEN cv_st_detail.sec_id=24 then 'X' WHEN cv_st_detail.sec_id=25 then 'Y' WHEN cv_st_detail.sec_id=26 then 'Z' END 'sec',CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role' FROM `user_spent_time` left JOIN cv_users on user_spent_time.user_id = cv_users.user_id left join cv_st_detail on cv_users.user_id = cv_st_detail.user_id left join cv_school_detail on cv_users.sch_id =cv_school_detail.sch_id WHERE  DATE_FORMAT(login_time,'%d %m %y') = DATE_FORMAT('" +
    params.sorted_date +
    "','%d %m %y')";
  pool.query(query, function(err, data) {
    if (!err) {
      res.json({
        status: "200",
        data: data,
      });
    }
  });
});

router.post("/get_online_logs_schools", (req, res) => {
  let query =
    "SELECT cv_school_detail.sch_id,cv_school_detail.name from user_spent_time left join cv_users on cv_users.user_id = user_spent_time.user_id left join cv_school_detail on cv_users.sch_id = cv_school_detail.sch_id group by cv_school_detail.sch_id";
  pool.query(query, function(err, data) {
    if (!err) {
      res.json({
        status: "200",
        data: data,
      });
    }
  });
});
router.post("/get_online_logs_details_all_date_wise", (req, res) => {
  let params = req.body;
  var startTime = process.hrtime();
  let query =
    "SELECT user_spent_time.user_id,user_spent_time.login_time,user_spent_time.logout_time,SEC_TO_TIME(round((user_spent_time.spend_time/user_spent_time.times_in_day),0)) 'spend_time',user_status,user_spent_time.times_in_day,cv_users.name,cv_users.address,cv_st_detail.cls_id,cv_st_detail.sec_id,cv_school_detail.name 'sch_name',cv_users.role_id,CASE WHEN cv_st_detail.sec_id=1 then 'A' WHEN cv_st_detail.sec_id=2 then 'B' WHEN cv_st_detail.sec_id=3 then 'C' WHEN cv_st_detail.sec_id=4 then 'D' WHEN cv_st_detail.sec_id=5 then 'E' WHEN cv_st_detail.sec_id=6 then 'F' WHEN cv_st_detail.sec_id=7 then 'G' WHEN cv_st_detail.sec_id=8 then 'H' WHEN cv_st_detail.sec_id=9 then 'I' WHEN cv_st_detail.sec_id=10 then 'J' WHEN cv_st_detail.sec_id=11 then 'K' WHEN cv_st_detail.sec_id=12 then 'L' WHEN cv_st_detail.sec_id=13 then 'M' WHEN cv_st_detail.sec_id=14 then 'N' WHEN cv_st_detail.sec_id=15 then 'O' WHEN cv_st_detail.sec_id=16 then 'P' WHEN cv_st_detail.sec_id=17 then 'Q' WHEN cv_st_detail.sec_id=18 then 'R' WHEN cv_st_detail.sec_id=19 then 'S' WHEN cv_st_detail.sec_id=20 then 'T' WHEN cv_st_detail.sec_id=21 then 'U' WHEN cv_st_detail.sec_id=22 then 'V' WHEN cv_st_detail.sec_id=23 then 'W' WHEN cv_st_detail.sec_id=24 then 'X' WHEN cv_st_detail.sec_id=25 then 'Y' WHEN cv_st_detail.sec_id=26 then 'Z' END 'sec',CASE WHEN cv_users.role_id=1 THEN 'School' WHEN cv_users.role_id=2 THEN 'Teacher' WHEN cv_users.role_id=3 THEN 'Student' END 'role',(SELECT count(*) from user_spent_time) 'total_users' FROM `user_spent_time` left JOIN cv_users on user_spent_time.user_id = cv_users.user_id left join cv_st_detail on cv_users.user_id = cv_st_detail.user_id left join cv_school_detail on cv_users.sch_id =cv_school_detail.sch_id order by  DATE_FORMAT(login_time,'%d %m %y')";
  pool.query(query, function(err, data) {
    logQuery(startTime, "/api/user/get_online_logs_details_all_date_wise");
    if (!err) {
      res.json({
        status: "200",
        data: data,
      });
    }
  });
});

router.post("/user_visited_page", (req, res) => {
  let params = req.body;
  pool.query(
    "SELECT user_spent_time.user_spen_id from user_spent_time where user_id=? order by login_time desc limit 1",
    [params.user_id],
    function(err, data) {
      if (!err) {
        //console.log(params);
        if (data.length != 0) {
          pool.query(
            "UPDATE `user_spent_time` SET user_status=1 where user_spen_id=?",
            [data[0].user_spen_id],
            function(err, result) {
              if (!err) {
                pool.query(
                  "SELECT * FROM `user_visited_page` WHERE user_visited_page.user_spen_id =? and user_visited_page.page_to=? order by visited_id desc",
                  [data[0].user_spen_id, params.from],
                  function(err, data1) {
                    if (data1.length != 0) {
                      pool.query(
                        "UPDATE `user_visited_page` SET `page_out_time`=now(),spen_time_sec= spen_time_sec+ TIME_TO_SEC(TIMEDIFF(now(),page_in_time)) WHERE visited_id=?",
                        [data1[0].visited_id],
                        function(err, data2) {
                          if (!err) {
                            pool.query(
                              "INSERT INTO `user_visited_page`(`user_spen_id`,`page_from`,`page_to`,`update_time`) VALUES (?,?,?,now())",
                              [data[0].user_spen_id, params.from, params.to],
                              function(err, data3) {
                                if (!err) {
                                  res.json({
                                    status: "200",
                                    data: "1",
                                  });
                                }
                              }
                            );
                          }
                        }
                      );
                    } else {
                      pool.query(
                        "INSERT INTO `user_visited_page`(`user_spen_id`,`page_from`,`page_to`,`update_time`) VALUES (?,?,?,now())",
                        [data[0].user_spen_id, params.from, params.to],
                        function(err, data3) {
                          if (!err) {
                            res.json({
                              status: "200",
                              data: "1",
                            });
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        } else {
          res.json({
            status: "200",
            data: "1",
          });
        }

        //pool.query("INSERT INTO `user_visited_page`(`user_spen_id`, `page_from`, `page_to`, `page_in_time`, `page_out_time`) VALUES (?,?,?,?,?)",[data[0].user_spen_id,params.to,]);
        //console.log(data[0].user_spen_id);
      }
    }
  );
});
//end logs

//end logs
/*###########################################################################
########################### Products#########################################*/
router.post("/getNOProjects", (req, res) => {
  pool.query("SELECT count(*) 'total_projects' FROM `projects`", function(
    err,
    data
  ) {
    if (!err) {
      res.json({
        status: "200",
        data: data,
      });
    }
  });
});
router.post("/getNOChallenges", (req, res) => {
  pool.query("SELECT count(*) 'total_challenges' FROM `quiz`", function(
    err,
    data
  ) {
    if (!err) {
      res.json({
        status: "200",
        data: data,
      });
    }
  });
});
router.post("/getNOAssessments", (req, res) => {
  pool.query(
    "SELECT count(*) 'total_assessments' FROM `cv_assessments`",
    function(err, data) {
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
router.post("/DisplayCourses", (req, res) => {
  let params = req.body;
  // console.log(params);
  var startTime = process.hrtime();
  pool.query(
    //"SELECT b.book_name 'book_name',b.slug,b.img,b.book_id,b.level,b.price,(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ) 'tot_pages' FROM `books` as b where b.book_id in(1,3,4,5) order by book_group ASC",
    //"SELECT distinct b.book_name,b.slug,b.img,b.book_id,b.level,b.product_id,(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ) 'tot_pages',(select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id ) 'st_pages',(select sch_id from cv_users where user_id =?)'sch_id',round(((select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id )/(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ))*100) 'per',(SELECT orders.status from orders where orders.product_id = b.product_id order by orders.order_id desc limit 1) 'purchases_status',b.price,products.product_type FROM `books` as b  join products on products.product_id = b.product_id  left join orders on products.product_id =orders.product_id where  b.book_id in(1,3,4,5) group  by products.product_id  order by b.book_group,b.book_id ASC",
    //[params.user_id, params.user_id,params.user_id],
    //"SELECT distinct b.book_name,b.slug,b.img,b.book_id,b.prod_info,b.level,b.product_id,b.book_group,(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ) 'tot_pages',(select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id ) 'st_pages',(select sch_id from cv_users where user_id =?)'sch_id',round(((select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id )/(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ))*100) 'per',(SELECT orders.status from orders where orders.user_id=? and orders.product_id = b.product_id order by orders.order_id desc limit 1) 'purchases_status',b.price,products.product_type FROM `books` as b  join products on products.product_id = b.product_id  left join orders on products.product_id =orders.product_id where b.book_id in(1,3,4,5) ORDER by b.book_group,b.book_id",
    "SELECT distinct b.book_name,b.slug,b.img,b.book_id,b.prod_info,b.level,b.product_id,b.book_group,(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ) 'tot_pages',(select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id ) 'st_pages',(select sch_id from cv_users where user_id =?)'sch_id',round(((select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id )/(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ))*100) 'per',(SELECT orders.status from orders where orders.user_id=? and orders.product_id = b.product_id and orders.status =1 order by orders.order_id desc limit 1) 'purchases_status',b.price,products.product_type FROM `books` as b  join products on products.product_id = b.product_id  left join orders on products.product_id =orders.product_id where b.book_id in(1,3,4,5) ORDER by b.book_group,b.book_id",
    [params.user_id, params.user_id, params.user_id, params.user_id],
    function(err, data) {
      // console.log(data);
      logQuery(startTime, "/api/user/DisplayCourses");
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});

router.post("/no_of_tot_users", (req, res) => {
  pool.query("SELECT count(*) 'tot_users' FROM `cv_users`", function(
    err,
    data
  ) {
    if (!err) {
      res.json({
        status: "200",
        data: data,
      });
    }
  });
});

router.post("/DisplayQuizzes", (req, res) => {
  var startTime = process.hrtime();
  pool.query(
    "SELECT quiz.quiz_id,quiz.quiz_name,quiz.slug,quiz.sub_id,quiz.price,(select count(que_id) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'no_of_questions',(select sum(points) from quiz_question where quiz_question.quiz_id = quiz.quiz_id group by quiz_id) 'total_points',quiz.product_id FROM `quiz` order by total_points desc limit 4 ",
    function(err, data) {
      logQuery(startTime, "/api/user/DisplayQuizzes");
      if (!err) {
        res.json({
          status: "200",
          data: data,
        });
      }
    }
  );
});
//end
/*############################################################################
########################## dashboard #########################################
*/

router.post("/DisplayOtherLmsActivity", (req, res) => {
  var params = req.body;
  var startTime = process.hrtime();
  pool.query(
    "SELECT distinct b.book_name,b.slug,b.prod_info,b.img,b.book_id,b.level,b.product_id,b.book_group,books_price.actual_price,books_price.book_summary,books_price.discount,books_price.dis_price,(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id )'tot_pages',(select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id ) 'st_pages',(select sch_id from cv_users where user_id =?)'sch_id',round(((select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id )/(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ))*100) 'per',(SELECT orders.status from orders where orders.user_id=? and orders.product_id = b.product_id and  orders.status =1 order by orders.order_id desc limit 1) 'purchases_status',b.price,products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = b.product_id) 'avg_rating' FROM `books` as b INNER join books_price on(b.book_id =books_price.book_id) join products on (products.product_id = b.product_id)  left join orders on (products.product_id =orders.product_id) where books_price.visible=1 and books_price.sch_course=0 and b.book_id<>1 order by b.book_group",
    [params.user_id, params.user_id, params.user_id, params.user_id],
    function(err, result, fields) {
      logQuery(startTime, "/api/user/DisplayOtherLmsActivity");
      if (err) {
        throw err;
      } else {
        //  console.log(result);
        res.json({
          status: "200",
          data: result,
        });
      }
    }
  );
});

/****Next course learn */
router.post("/DisplayLmsActivityForNextCourses", (req, res) => {
  var params = req.body;
  var startTime = process.hrtime();
  pool.query(
    "select * from (SELECT distinct b.book_name,b.slug,b.prod_info,b.img,b.book_id,b.level,b.product_id,b.book_group,books_price.actual_price,books_price.book_summary,books_price.discount,books_price.dis_price,(select sch_id from cv_users where user_id =?)'sch_id',(SELECT orders.status from orders where orders.user_id=? and orders.product_id = b.product_id and  orders.status =1 order by orders.order_id desc limit 1) 'purchases_status',b.price,products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = b.product_id) 'avg_rating' FROM `books` as b INNER join books_price on(b.book_id =books_price.book_id) join products on (products.product_id = b.product_id)  left join orders on (products.product_id =orders.product_id) where books_price.visible=1 and books_price.sch_course=0 order by b.book_group) t where t.purchases_status IS NULL limit 3",
    [params.user_id, params.user_id],
    function(err, result, fields) {
      logQuery(startTime, "/api/user/DisplayLmsActivityForNextCourses");
      if (err) console.log(err);
      else {
        res.json({
          status: 200,
          data: result,
        });
      }
    }
  );
});
/******End Course Learn */
/*function convertCurrency(value = 1, currencyFrom, currencyTo, day)
{
  const moment = require('moment');
const request = require('bluebird').promisifyAll(require('request'), { multiArgs: true });
const fixerUrl = 'http://data.fixer.io/api/latest?access_key=e5c3c3bd8057ff614d3e79aaa405308b';
const formatedDay = (!day) ? '/latest' : moment(day).format('YYYY-MM-DD');
console.log(value+' '+currencyFrom+' '+currencyTo);
return new Promise((resolve, reject) => request.getAsync(`http://data.fixer.io/api/latest?access_key=e5c3c3bd8057ff614d3e79aaa405308b&base=EUR`).then((response) => {
  const parsedResponse = JSON.parse(response[1]);
if (typeof value !== 'number') reject(new Error('Value to convert is NaN.'));
  if (parsedResponse.error === 'Invalid base') {
    reject(new Error('Invalid currency base.'));
  } else if (!Object.keys(parsedResponse.rates).includes(currencyTo)) {
    reject(new Error('Invalid currency to convert.'));
  }

  const rateFrom = parsedResponse.rates[currencyTo];
  const convertedValue = value * rateFrom;
  resolve({
    currencyFrom,
    currencyTo,
    value,
    convertedValue,
  });
}));
}*/
router.post("/DisplayLmsActivity", (req, res) => {
  //var requestCountry = require('request-country');
  /*var geoip = require("geoip-lite");
  
  let ip = '207.97.227.239'//req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log(ip);
  var geo = geoip.lookup(ip);
  console.log(geo);
   convertCurrency(200, 'EUR', 'INR', '2015-08-29').then(response =>{
     console.log(response);
   })
  var n = require('country-js');
  console.log(n.search('US'))*/
  // console.log(requestCountry(req,'US'));
  var params = req.body;
  var startTime = process.hrtime();
  /***Save for future */

  //"SELECT distinct b.book_name,b.slug,b.prod_info,b.img,b.book_id,b.level,b.product_id,b.book_group,books_price.actual_price,books_price.book_summary,books_price.discount,books_price.dis_price,(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id )'tot_pages',(select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id ) 'st_pages',(select sch_id from cv_users where user_id =?)'sch_id',round(((select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id )/(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ))*100) 'per',(SELECT orders.status from orders where orders.user_id=? and orders.product_id = b.product_id and  orders.status =1 order by orders.order_id desc limit 1) 'purchases_status',b.price,products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = b.product_id) 'avg_rating' FROM `books` as b INNER join books_price on(b.book_id =books_price.book_id) join products on (products.product_id = b.product_id)  left join orders on (products.product_id =orders.product_id) where books_price.visible=1 and books_price.sch_course=0 order by b.book_group",
  //[params.user_id, params.user_id, params.user_id, params.user_id],
  /***End Future */
  pool.query(
    //"SELECT distinct b.book_name,b.slug,b.prod_info,b.img,b.book_id,b.level,b.product_id,b.book_group,books_price.actual_price,books_price.book_summary,books_price.discount,books_price.dis_price,(SELECT orders.status from orders where orders.user_id=? and orders.product_id = b.product_id and  orders.status =1 order by orders.order_id desc limit 1) 'purchases_status',b.price,products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = b.product_id) 'avg_rating' FROM `books` as b INNER join books_price on(b.book_id =books_price.book_id) join products on (products.product_id = b.product_id)  left join orders on (products.product_id =orders.product_id) where books_price.visible=1 and books_price.sch_course=0 order by b.book_group",
    "SELECT distinct b.book_name,b.slug,b.prod_info,b.img,b.book_id,b.level,b.product_id,b.book_group,books_price.actual_price,books_price.book_summary,books_price.discount,books_price.dis_price, orders.status 'purchases_status',b.price,products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = b.product_id) 'avg_rating' FROM `books` as b INNER join books_price on(b.book_id =books_price.book_id) join products on (products.product_id = b.product_id)  left join orders on (products.product_id =orders.product_id and status=1 and user_id=?) where books_price.visible=1 and books_price.sch_course=0 order by b.book_group",
    [params.user_id],
    function(err, result, fields) {
      logQuery(startTime, "/api/user/DisplayLmsActivity");
      if (err) {
        console.log(err);
        throw err;
      } else {
        //  console.log(result);
        res.json({
          status: "200",
          data: result,
        });
      }
    }
  );
});

/***GETLMSActivity */
router.post("/getLMSUserActivity", (req, res) => {
  var params = req.body;
  var startTime = process.hrtime();
  let query =
    "SELECT book_title.book_id, count(book_pages.page_id) 'tot_topic',count(st_book.page_id) 'st_read_topic',book_title.topic_name,book_title.slug,book_title.topic_id,(SELECT bp.page_id from book_pages bp where bp.topic_id =book_pages.topic_id ORDER by bp.page_id limit 1) 'page_id' from book_pages inner join book_title on (book_title.topic_id = book_pages.topic_id) left join st_book on (st_book.page_id =book_pages.page_id and st_book.st_id=?) where book_pages.book_id in (?) and book_pages.visible=1 and book_title.visible=1 GROUP by book_pages.topic_id order by book_pages.topic_id";
  let param = [params.userId, params.books];
  pool.query(query, param, (err, result) => {
    logQuery(startTime, "/api/user/getLMSUserActivity");
    res.send(result);
  });
});
/******End LMS Activity */

router.post("/DisplayDashboardLmsActivity", (req, res) => {
  var params = req.body;
  var startTime = process.hrtime();
  let query =
    //"select t.* from (SELECT b.book_name,b.slug,b.book_group,b.img,b.book_id,b.level,b.product_id,books_price.book_summary,books_price.age_group,books_price.sch_course,books_price.for_grade,books_price.actual_price,books_price.visible,books_price.downloaad,books_price.download_link,books_price.other_courses,(SELECT role_id from cv_users where cv_users.user_id=10)'role_id',(SELECT sch_id from cv_users where cv_users.user_id=10)'sch_id',(SELECT cv_offerings.curriculum_course from cv_offerings inner join cv_school_detail on (cv_school_detail.cv_pid =cv_offerings.cv_pid) where cv_school_detail.sch_id =(SELECT sch_id FROM cv_users WHERE cv_users.user_id=10)) 'course_available',(select cv_school_detail.other_subject_course_available from cv_school_detail inner join cv_users on (cv_users.sch_id =cv_school_detail.sch_id and cv_users.user_id=10)) 'other_subject_course',(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ) 'tot_pages',(select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=0 group by st_book.book_id ) 'st_pages',round(((select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=0 group by st_book.book_id )/(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ))*100) 'per',(SELECT orders.status from orders where orders.product_id = b.product_id and orders.status =1 and orders.user_id = 0 order by orders.order_id desc limit 1) 'purchases_status',b.price,products.product_type from books as b inner join books_price on (books_price.book_id =b.book_id) inner join products on (products.product_id = b.product_id) where books_price.visible=1) t where (SELECT orders.status from orders where orders.product_id =t.product_id and orders.status=1 and orders.user_id=10) IS NOT NULL or (case WHEN (t.role_id=3 and t.for_grade<>0) then t.for_grade in (SELECT cv_st_detail.cls_id from cv_st_detail INNER join cv_users on (cv_users.user_id =cv_st_detail.user_id) where cv_users.user_id=10) when ((t.role_id=2 or t.role_id=1)and t.for_grade<>0) then t.for_grade in (SELECT cv_school_classes.cls_id from cv_school_classes left join cv_users on(cv_users.sch_id = cv_school_classes.sch_id and cv_users.user_id=10))  end) and t.course_available=1";
    //"select t.* from (SELECT b.book_name,b.slug,b.book_group,b.img,b.book_id,b.level,b.product_id,books_price.book_summary,books_price.age_group,books_price.sch_course,books_price.for_grade,books_price.actual_price,books_price.visible,books_price.downloaad,books_price.download_link,books_price.other_courses,(SELECT role_id from cv_users where cv_users.user_id=?)'role_id',(SELECT sch_id from cv_users where cv_users.user_id=?)'sch_id',(SELECT cv_offerings.curriculum_course from cv_offerings inner join cv_school_detail on (cv_school_detail.cv_pid =cv_offerings.cv_pid) where cv_school_detail.sch_id =(SELECT sch_id FROM cv_users WHERE cv_users.user_id=?)) 'course_available',(select cv_school_detail.other_subject_course_available from cv_school_detail inner join cv_users on (cv_users.sch_id =cv_school_detail.sch_id and cv_users.user_id=?)) 'other_subject_course',(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ) 'tot_pages',(select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id ) 'st_pages',round(((select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id )/(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ))*100) 'per',(SELECT orders.status from orders where orders.product_id = b.product_id and orders.status =1 and orders.user_id = 0 order by orders.order_id desc limit 1) 'purchases_status',b.price,products.product_type from books as b inner join books_price on (books_price.book_id =b.book_id) inner join products on (products.product_id = b.product_id) where books_price.visible=1) t where (SELECT orders.status from orders where orders.product_id =t.product_id and orders.status=1 and orders.user_id=?) IS NOT NULL or (case WHEN (t.role_id=3 and t.for_grade<>0) then t.for_grade in (SELECT cv_st_detail.cls_id from cv_st_detail INNER join cv_users on (cv_users.user_id =cv_st_detail.user_id) where cv_users.user_id=?) when ((t.role_id=2 or t.role_id=1)and t.for_grade<>0) then t.for_grade in (SELECT cv_school_classes.cls_id from cv_school_classes left join cv_users on(cv_users.sch_id = cv_school_classes.sch_id and cv_users.user_id=?))  end) and t.course_available=1";
    "select t.* from (SELECT b.book_name,b.slug,b.book_group,b.img,b.book_id,b.level,b.product_id,books_price.book_summary,books_price.age_group,books_price.sch_course,books_price.for_grade,books_price.actual_price,books_price.visible,books_price.downloaad,books_price.download_link,books_price.other_courses,(SELECT role_id from cv_users where cv_users.user_id=?)'role_id',(SELECT sch_id from cv_users where cv_users.user_id=?)'sch_id',(SELECT cv_offerings.curriculum_course from cv_offerings inner join cv_school_detail on (cv_school_detail.cv_pid =cv_offerings.cv_pid) where cv_school_detail.sch_id =(SELECT sch_id FROM cv_users WHERE cv_users.user_id=?)) 'course_available',(select cv_school_detail.other_subject_course_available from cv_school_detail inner join cv_users on (cv_users.sch_id =cv_school_detail.sch_id and cv_users.user_id=?)) 'other_subject_course',(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ) 'tot_pages',(select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id ) 'st_pages',round(((select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id )/(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ))*100) 'per',(SELECT orders.status from orders where orders.product_id = b.product_id and orders.status =1 and orders.user_id = ? order by orders.order_id desc limit 1) 'purchases_status',b.price,products.product_type from books as b inner join books_price on (books_price.book_id =b.book_id) inner join products on (products.product_id = b.product_id) where books_price.visible=1) t where (SELECT orders.status from orders where orders.product_id =t.product_id and orders.status=1 and orders.user_id=?) IS NOT NULL or (case WHEN (t.role_id=3 and t.for_grade<>0) then t.for_grade in (SELECT cv_st_detail.cls_id from cv_st_detail INNER join cv_users on (cv_users.user_id =cv_st_detail.user_id) where cv_users.user_id=?) when ((t.role_id=2 or t.role_id=1)and t.for_grade<>0) then t.for_grade in (SELECT cv_school_classes.cls_id from cv_school_classes left join cv_users on(cv_users.sch_id = cv_school_classes.sch_id and cv_users.user_id=?))  end) and t.course_available=1";
  pool.query(
    query,
    [
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
    ],
    (err, result) => {
      //console.log(result);
      logQuery(startTime, "/api/user/DisplayDashboardLmsActivity");
      res.send(result);
    }
  );
});
router.post("/DisplayUserLmsActivity", (req, res) => {
  var params = req.body;
  //console.log("display lmss user activity");
  //console.log(params);
  var startTime = process.hrtime();
  pool.query(
    //"SELECT b.book_name,b.book_group,b.slug,b.img,b.book_id,b.level,(SELECT cls_id from cv_st_detail where cv_st_detail.user_id = ?) 'cls_id',b.product_id,(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ) 'tot_pages',(select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id ) 'st_pages',(select sch_id from cv_users where user_id =?)'sch_id',round(((select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id )/(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ))*100) 'per',(SELECT orders.status from orders where orders.product_id = b.product_id and orders.status =1 order by orders.order_id desc limit 1) 'purchases_status',b.price,products.product_type FROM `books` as b  join products on products.product_id = b.product_id  where (SELECT orders.status from orders where orders.product_id = b.product_id and orders.user_id =? order by orders.order_id desc limit 1) IS NOT NULL or ((SELECT cv_users.sch_id from cv_users join cv_st_detail on cv_users.user_id = cv_st_detail.user_id where cv_users.user_id =?) <> 1 and b.level ='Beginner') order by b.book_group,b.book_id ASC",
    //"SELECT b.book_name,b.book_group,b.slug,b.img,b.book_id,b.level,(SELECT cls_id from cv_st_detail where cv_st_detail.user_id = ?) 'cls_id',b.product_id,(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ) 'tot_pages',(select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id ) 'st_pages',(select sch_id from cv_users where user_id =?)'sch_id',round(((select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id )/(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ))*100) 'per',(SELECT orders.status from orders where orders.product_id = b.product_id and orders.status =1 order by orders.order_id desc limit 1) 'purchases_status',b.price,products.product_type FROM `books` as b  join products on products.product_id = b.product_id  where (SELECT orders.status from orders where orders.product_id = b.product_id and orders.user_id =?  and orders.status =1) IS NOT NULL or ((SELECT cv_users.sch_id from cv_users join cv_st_detail on cv_users.user_id = cv_st_detail.user_id where cv_users.user_id =?) <> 1 and b.level ='Beginner') order by b.book_group,b.book_id ASC",
    "SELECT b.book_name,b.book_group,b.slug,b.img,b.book_id,b.level,(SELECT cls_id from cv_st_detail where cv_st_detail.user_id = ?) 'cls_id',b.product_id,(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ) 'tot_pages',(select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id ) 'st_pages',(select sch_id from cv_users where user_id =?)'sch_id',round(((select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id )/(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ))*100) 'per',(SELECT orders.status from orders where orders.product_id = b.product_id and orders.status =1 and orders.user_id = ? order by orders.order_id desc limit 1) 'purchases_status',b.price,products.product_type FROM `books` as b  join products on products.product_id = b.product_id  where (SELECT orders.status from orders where orders.product_id = b.product_id and orders.user_id =?  and orders.status =1) IS NOT NULL or ((SELECT cv_users.sch_id from cv_users join cv_st_detail on cv_users.user_id = cv_st_detail.user_id where cv_users.user_id =?) <> 1 and b.level ='Beginner') order by b.book_group,b.book_id ASC",
    [
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
      params.user_id,
    ],
    function(err, result, fields) {
      logQuery(startTime, "/api/user/DisplayUserLmsActivity");
      if (err) {
        throw err;
      } else {
        // console.log(result);
        res.json({
          status: "200",
          data: result,
        });
      }
    }
  );
});

router.post("/DisplaySubjectForQuiz", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT b.book_name,b.slug,b.img,b.book_id,b.level,(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ) 'tot_pages',(select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id ) 'st_pages',round(((select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id )/(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ))*100) 'per' FROM `books` as b",
    [params.user_id, params.user_id],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: result,
        });
      }
    }
  );
});

router.post("/DisplayLtAssesment", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT b.book_name,b.img,b.book_id, (select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ) 'tot_pages',(select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id ) 'st_pages',round(((select COUNT(*) from st_book where st_book.book_id = b.book_id and st_id=? group by st_book.book_id )/(select COUNT(*) from book_pages where book_pages.book_id = b.book_id group by book_pages.book_id ))*100) 'per' FROM `books` as b order by book_id ASC",
    [params.user_id, params.user_id],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: result,
        });
      }
    }
  );
});
router.post("/submit_course_feedback", (req, res) => {
  var params = req.body;

  pool.query(
    "SELECT `prod_f_id`, `product_id` FROM `product_feedback` WHERE product_id =? and user_id=?",
    [params.product_id, params.user_id],
    function(err, feedbackdata) {
      if (!err) {
        if (feedbackdata.length) {
          pool.query(
            "update product_feedback set `obt_rat`=?,`max_rat`=?,`message`=? where product_id=? and user_id=?",
            [
              params.rating,
              5,
              params.message,
              params.product_id,
              params.user_id,
            ],
            function(err, feebackresponce) {
              if (!err) {
                res.json({
                  status: 200,
                  data: 1,
                });
              } else console.log(err);
            }
          );
        } else {
          pool.query(
            "INSERT INTO `product_feedback`(`user_id`, `product_id`, `obt_rat`, `max_rat`, `message`) VALUES (?,?,?,?,?)",
            [
              params.user_id,
              params.product_id,
              params.rating,
              5,
              params.message,
            ],
            function(err, feedbackdata) {
              if (!err) {
                res.json({
                  status: 200,
                  data: 1,
                });
              } else console.log(err);
            }
          );
        }
      }
    }
  );
});

/*###############################################################################
############################## Start Discuss Community ################################*/
router.post("/discussPostCategory", (req, res) => {
  pool.query("SELECT * FROM cv_discuss_category", function(
    err,
    result,
    fields
  ) {
    if (err) {
      ////console.log(err);
      throw err;
    } else {
      ////console.log(result);
      res.json({
        status: "200",
        postCategory: result,
      });
    }
  });
});

router.post("/discussPosts", (req, res) => {
  pool.query(
    "SELECT (select name from cv_users as cu where cdp.user_id = cu.user_id ) as user, cdp.post_id, cdp.title, cdp.content, cdp.status, cdp.created_at, (SELECT title from cv_discuss_category as cdc where cdp.category_id = cdc.category_id) as post_category,(SELECT count(*) from cv_discuss_post_replies as cdpr where cdpr.post_id = cdp.post_id) as post_replies FROM cv_discuss_posts as cdp ORDER BY created_at",
    function(err, result, fields) {
      if (err) {
        ////console.log(err);
        throw err;
      } else {
        ////console.log(result);
        res.json({
          status: "200",
          allPosts: result,
        });
      }
    }
  );
});

router.post("/submitDiscussPosts", (req, res) => {
  var params = req.body;
  pool.query(
    "INSERT INTO cv_discuss_posts(user_id, title, content, category_id, status)  values(?,?,?,?,?)",
    [
      params.user_id,
      params.postTitle,
      params.postContent,
      params.postCategory,
      1,
    ],
    function(err, result1, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          success: true,
        });
      }
    }
  );
});

router.post("/submitDiscussPostsReply", (req, res) => {
  var params = req.body;
  pool.query(
    "INSERT INTO cv_discuss_post_replies(user_id, post_id, content)  values(?,?,?)",
    [params.user_id, params.postId, params.postContent],
    function(err, result1, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          success: true,
        });
      }
    }
  );
});

router.post("/discussPost", (req, res) => {
  var params = req.body;

  pool.query(
    "SELECT (select name from cv_users as cu where cdp.user_id = cu.user_id ) as user, cdp.post_id, cdp.title, cdp.content, cdp.status, cdp.created_at, (SELECT title from cv_discuss_category as cdc where cdp.category_id = cdc.category_id) as post_category,(SELECT count(*) from cv_discuss_post_replies as cdpr where cdpr.post_id = cdp.post_id) as post_replies FROM cv_discuss_posts as cdp where cdp.post_id =? ORDER BY created_at",
    [params.postId],
    function(err, result, fields) {
      if (err) {
        ////console.log(err);
        throw err;
      } else {
        pool.query(
          "SELECT cdpr.reply_id, cdpr.user_id, cdpr.post_id, cdpr.content, cdpr.created_at, cu.name as user FROM `cv_discuss_post_replies` as cdpr, cv_users as cu WHERE cdpr.user_id = cu.user_id and cdpr.post_id=?",
          [params.postId],
          function(err, result1, fields) {
            if (err) {
              ////console.log(err);
              throw err;
            } else {
              res.json({
                status: "200",
                discussPost: result,
                postReplies: result1,
              });
            }
          }
        );
      }
    }
  );
});

/*###############################################################################
############################## End Discuss Community ################################*/

/*###############################################################################
############################## Admin Side Codding ################################*/
router.post("/DisplaySchools", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT cu.*, csd.logo FROM cv_users as cu, cv_school_detail as csd where cu.role_id=1 and cu.sch_id=csd.sch_id ORDER BY csd.sch_id ASC",
    function(err, result, fields) {
      if (err) {
        ////console.log("error");
        throw err;
      } else {
        res.json({
          status: "200",
          schools: result,
        });
      }
    }
  );
});
router.post("/DisplaySchoolsWithClasses", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT csc.sch_id,(select csd.name from cv_school_detail as csd where csd.sch_id=csc.sch_id) as school_name, cc.cls_id, cc.cls_name, (SELECT count(*) from cv_st_detail csdd where csdd.sch_id=csd.sch_id and csdd.cls_id=csc.cls_id) as total_students FROM  cv_classes as cc, cv_school_classes as csc, cv_school_detail as csd where csc.sch_id=csd.sch_id and csc.cls_id=cc.cls_id  ORDER BY csd.sch_id, csc.cls_id ASC",
    function(err, result, fields) {
      if (err) {
        ////console.log("error");
        throw err;
      } else {
        res.json({
          status: "200",
          schoolsGrades: result,
        });
      }
    }
  );
});

router.post("/School_students", (req, res) => {
  var params = req.body;
  if (params.sch_id != 0 && params.cls_id == 0 && params.sec_id == 0) {
    pool.query(
      "SELECT cu.*,csd.cls_id,csd.sec_id,cc.cls_name,cs.sec_name, cspd.cv_st_p_id, cspd.father_name, cspd.father_email_id, cspd.fcontact_no, cspd.f_employer_name, cspd.f_designation, cspd.mother_name, cspd.mother_email_id, cspd.mcontact_no, cspd.m_employer_name, cspd.m_designation, cspd.f_address, cspd.m_address, cspd.g_name, cspd.g_email_id, cspd.gcontact_no, cspd.g_employer_name, cspd.g_designation, cspd.gaddress  FROM (cv_users as cu, cv_st_detail as csd,cv_classes as cc, cv_sections as cs) LEFT join cv_st_parent_detail as cspd on  cu.cv_st_p_id = cspd.cv_st_p_id WHERE cu.user_id=csd.user_id and cu.sch_id=csd.sch_id and cc.cls_id=csd.cls_id and cs.sec_id=csd.sec_id and cu.role_id=3 and cu.sch_id=?  ORDER BY cu.user_id ASC",
      [params.sch_id],
      function(err, result, fields) {
        if (err) {
          ////console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            all_students: result,
          });
        }
      }
    );
  } else if (params.sch_id != 0 && params.cls_id != 0 && params.sec_id == 0) {
    pool.query(
      "SELECT cu.*,csd.cls_id,csd.sec_id,cc.cls_name,cs.sec_name , cspd.cv_st_p_id, cspd.father_name, cspd.father_email_id, cspd.fcontact_no, cspd.f_employer_name, cspd.f_designation, cspd.mother_name, cspd.mother_email_id, cspd.mcontact_no, cspd.m_employer_name, cspd.m_designation, cspd.f_address, cspd.m_address, cspd.g_name, cspd.g_email_id, cspd.gcontact_no, cspd.g_employer_name, cspd.g_designation, cspd.gaddress FROM (cv_users as cu, cv_st_detail as csd,cv_classes as cc, cv_sections as cs) LEFT join cv_st_parent_detail as cspd on  cu.cv_st_p_id = cspd.cv_st_p_id WHERE cu.user_id=csd.user_id and cu.sch_id=csd.sch_id and cc.cls_id=csd.cls_id and cs.sec_id=csd.sec_id and cu.role_id=3 and cu.sch_id=? and csd.cls_id=?   ORDER BY cu.user_id ASC",
      [params.sch_id, params.cls_id],
      function(err, result, fields) {
        if (err) {
          ////console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            all_students: result,
          });
        }
      }
    );
  } else if (params.sch_id != 0 && params.cls_id != 0 && params.sec_id != 0) {
    pool.query(
      "SELECT cu.*, csd.cls_id,csd.sec_id,cc.cls_name,cs.sec_name, cspd.cv_st_p_id, cspd.father_name, cspd.father_email_id, cspd.fcontact_no, cspd.f_employer_name, cspd.f_designation, cspd.mother_name, cspd.mother_email_id, cspd.mcontact_no, cspd.m_employer_name, cspd.m_designation, cspd.f_address, cspd.m_address, cspd.g_name, cspd.g_email_id, cspd.gcontact_no, cspd.g_employer_name, cspd.g_designation, cspd.gaddress FROM (cv_users as cu, cv_st_detail as csd,cv_classes as cc, cv_sections as cs) LEFT join cv_st_parent_detail as cspd on  cu.cv_st_p_id = cspd.cv_st_p_id WHERE cu.user_id=csd.user_id and cu.sch_id=csd.sch_id and cc.cls_id=csd.cls_id and cs.sec_id=csd.sec_id and cu.role_id=3 and cu.sch_id=? and csd.cls_id=? and csd.sec_id=? ORDER BY cu.user_id ASC",
      [params.sch_id, params.cls_id, params.sec_id],
      function(err, result, fields) {
        if (err) {
          ////console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            all_students: result,
          });
        }
      }
    );
  }
});

function registerIndependentUser(info) {
  return new Promise(async (resolve, reject) => {
    var result = await runSqlQueryAsyncSelect(
      "SELECT path from cv_users where sch_id=1 and role_id=1",
      []
    );
    var schoolPath = result.result[0].path;
    // console.log(schoolPath);
    var result1 = await runSqlQueryAsyncSelect(
      "SELECT username FROM `cv_users` where username=?",
      [info.email]
    );
    if (result1.result.length) {
      reject("exist");
    } else {
      var userPath = schoolPath + "/" + info.dirname;
      var result2 = await runSqlQueryAsyncInsert(
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

      console.log("error");
      //  console.log(result2.err);
      if (result2.err) {
        reject("insert_failed");
      } else {
        var result3 = await runSqlQueryAsyncInsert(
          "insert into cv_st_detail (user_id,sch_id,cls_id,sec_id) values(?,?,?,?)",
          [result2.insertId, 1, 0, 0]
        );

        createStudentCodeplayDirectory(schoolPath, info.dirname);
        resolve({ userId: result2.insertId, path: userPath });
      }
    }
  });
}
router.post("/UserRegister", (req, res) => {
  var params = req.body;
  //console.log("new user")
  //console.log(params)
  registerIndependentUser({
    email: params.email,
    name: params.name,
    contact: params.contact,
    username: params.username,
    dirname: params.username,
    password: params.password,
  })
    .then(() => {
      res.status(200).json({
        msg: "success",
      });
    })
    .catch((err) => {
      console.log(err);
      if (err == "exist") {
        res.status(400).json({
          msg: "exist",
        });
      }
    });
});
function createStudentCodeplayDirectory(schooldir, username) {
  if (!schooldir || !username) return false;
  var dir = convertToSystemSlash(
    appRoot + "/Codeplay/" + schooldir + "/" + username
  );
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    return true;
  } else {
    return false;
  }
}
/*router.post("/Student_register", (req, res) => {
  var params = req.body;
  st_register(params);
});

router.post("/Multi_student_register", upload.any(), (req, res, next) => {
  var params = req.body;
  var dataarray;
  var file = req.files[0];
 

  csvtojson()
    .fromFile(file.path)
    .then(function (data) {
      //when parse finished, result will be emitted here.

      for (var i = 0; i < data.length; i++) {
        dataarray = {
          sch_id: params.sch_id,
          schoolPath: params.schoolPath,
          cls_id: data[i].Class,
          sec_id: data[i].Section,
          name: data[i].Name,
          contact: data[i].Contact,
          email: data[i].Email,
          dob: data[i].Dob,
          state: data[i].State,
          city: data[i].City,
          address: data[i].Address
        };
        st_register(dataarray);
      }
      res.json({
        status: "200",
        data: "done"
      });
    });
});*/
router.post("/Student_register", (req, res) => {
  var params = req.body;
  registerStudent(params);
  res.json({
    status: "200",
    data: "done",
  });
});

router.post("/Multi_student_register", upload.any(), (req, res, next) => {
  var params = req.body;
  var dataarray;
  var file = req.files[0];
  /*fs.createReadStream(file.path).pipe(csv()).on('data', function(data){
		});*/

  csvtojson()
    .fromFile(file.path)
    .then(async function(data) {
      //when parse finished, result will be emitted here.

      for (var i = 0; i < data.length; i++) {
        if (data[i].Name != "") {
          dataarray = {
            sch_id: params.sch_id,
            schoolPath: params.schoolPath,
            cls_id: data[i].Class,
            sec_id: data[i].Section,
            name: data[i].Name,
            fname: data[i].Father_Name,
            contact: data[i].Contact,
            email: data[i].Email,
            dob: data[i].Dob,
            state: data[i].State,
            city: data[i].City,
            address: data[i].Address,
          };
          await registerStudent(dataarray);
        }
      }
      res.json({
        status: "200",
        data: "done",
      });
    });
});

function incrementUsernameSuffix(username) {
  var endingNumber = username.match(/\d+$/g);
  var name = username.substring(
    0,
    endingNumber ? username.length - endingNumber[0].length : username.length
  );
  if (endingNumber) {
    return name + (parseInt(endingNumber) + 1);
  } else {
    return name + 1;
  }
}
/*function createStudentCodeplayDirectory(schooldir, username) {
  if (!schooldir || !username) return false;
  var dir = convertToSystemSlash(
    appRoot + "/Codeplay/" + schooldir + "/" + username
  );
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    return true;
  } else {
    return false;
  }
}
*/
function registerStudent(params) {
  // demostudent12 demostudent13
  var password = genpassword();
  var username = params.name.replace(/[^a-zA-Z ]/g, "");
  username = username.replace(/\s/g, "").toLowerCase();
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT username FROM `cv_users` where username RLIKE "^' +
        username +
        '[0-9]+$" order by user_id desc limit 1',
      function(err, result) {
        if (err) {
        } else {
          if (result.length) {
            username = incrementUsernameSuffix(result[0].username);
          }
          var userpath = params.schoolPath + "/" + username;
          createStudentCodeplayDirectory(params.schoolPath, username);
          pool.query(
            "INSERT INTO cv_users (sch_id,role_id,name,parent_name,contact,email,dob,state,city,address,username,password,path,status) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              params.sch_id,
              3,
              params.name,
              params.fname,
              params.contact,
              params.email,
              params.dob,
              params.state,
              params.city,
              params.address,
              username,
              password,
              userpath,
              1,
            ],
            function(err, result, fields) {
              if (err) {
                //console.log("error");
                throw err;
              } else {
                result.insertId;
                pool.query(
                  "INSERT INTO cv_st_detail (user_id,sch_id,cls_id,sec_id) values(?,?,?,?)",
                  [
                    result.insertId,
                    params.sch_id,
                    params.cls_id,
                    params.sec_id,
                  ],
                  function(err, result1, fields) {
                    if (err) {
                      //console.log("error");
                      throw err;
                    } else {
                      resolve();
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  }).then(() => {});
}

function genpassword() {
  var text = "";
  var possible = "abcdefghjkmnpqrstuvwxyz23456789";

  for (var i = 0; i <= 5; i++) {
    text = text + possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function createfolder(userpath) {
  dir = "../Codeplay/" + userpath;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

function st_register(params) {
  var password = genpassword();
  var username = params.name.replace(/[^a-zA-Z ]/g, "");
  username = username.replace(/\s/g, "").toLowerCase();
  checkUser(username);
  function checkUser(username) {
    pool.query(
      "SELECT username FROM cv_users  WHERE username=?",
      [username],
      function(err, result, fields) {
        if (err) {
          ////console.log("error");
          throw err;
        } else {
          if (result.length != 0) {
            checkUser(username + result.length);
          } else {
            // Register this username
            userpath = params.schoolPath + "/" + username;
            createfolder(userpath);
            pool.query(
              "INSERT INTO cv_users (sch_id,role_id,name,contact,email,dob,state,city,address,username,password,path,status) values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
              [
                params.sch_id,
                3,
                params.name,
                params.contact,
                params.email,
                params.dob,
                params.state,
                params.city,
                params.address,
                username,
                password,
                userpath,
                0,
              ],
              function(err, result, fields) {
                if (err) {
                  ////console.log("error");
                  throw err;
                } else {
                  result.insertId;
                  pool.query(
                    "INSERT INTO cv_st_detail (user_id,sch_id,cls_id,sec_id) values(?,?,?,?)",
                    [
                      result.insertId,
                      params.sch_id,
                      params.cls_id,
                      params.sec_id,
                    ],
                    function(err, result1, fields) {
                      if (err) {
                        ////console.log("error");
                        throw err;
                      } else {
                      }
                    }
                  );
                }
              }
            );
          }
        }
      }
    );
  }
}

router.post("/update_student", upload.any(), (req, res, next) => {
  var params = req.body;
  pool.query(
    "UPDATE cv_users SET name=?,email=?,contact=?,state=?,city=?,address=?, password=? where sch_id=? and user_id=?",
    [
      params.studentDetails.name,
      params.studentDetails.email,
      params.studentDetails.contact,
      params.studentDetails.state,
      params.studentDetails.city,
      params.studentDetails.address,
      params.studentDetails.password,
      params.studentDetails.sch_id,
      params.studentDetails.user_id,
    ],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        pool.query(
          "UPDATE cv_st_detail SET cls_id=?, sec_id=? where sch_id=? and user_id=?",
          [
            params.studentDetails.cls_id,
            params.studentDetails.sec_id,
            params.studentDetails.sch_id,
            params.studentDetails.user_id,
          ],
          function(err, result1, fields) {
            if (err) {
              throw err;
            } else {
              res.json({
                status: "200",
                data: "done",
              });
            }
          }
        );
      }
    }
  );
});

router.post("/Delete_student", upload.any(), (req, res, next) => {
  var params = req.body;
  pool.query(
    "UPDATE cv_users set status=? where sch_id=? and user_id=?",
    [params.acivateValue, params.sch_id, params.user_id],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: "done",
        });
      }
    }
  );
});

router.post("/studentActivation", upload.any(), (req, res, next) => {
  var params = req.body;
  if (req.files.length > 0) {
    var file = req.files[0];

    const workbook = XLSX.readFile(
      appRoot + "/static/uploads/" + file.filename
    );
    const sheetNameList = workbook.SheetNames;
    var StudentList = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetNameList[0]]
    );
    var i;
    for (i = 0; i < StudentList.length; i++) {
      StudentActivation(StudentList[i]);
    }
    if (i == StudentList.length) {
      var status = deleteQuestionFile(file.filename);
      if (status == true) {
        res.json({
          status: 1,
        });
      }
    }
  }
});

function StudentActivation(params) {
  return new Promise(async function(resolve, reject) {
    return runSqlQueryAsyncSelect(
      "select username from cv_users where username=?",
      [params.username]
    ).then((result) => {
      if (result.result.length) {
        runSqlQueryAsyncUpdate(
          "UPDATE cv_users set status=? where username=?",
          [params.activate, params.username]
        );
      }
    });
  });
}

router.post("/School_register", upload.any(), (req, res, next) => {
  var params = req.body;
  var filename = "";
  if (req.files.length != 0) {
    filename = req.files[0].filename;
  }
  var password = genpassword();
  var username = params.name.replace(/[^a-zA-Z ]/g, "");
  username = username.replace(/\s/g, "").toLowerCase();

  pool.query(
    "SELECT username FROM cv_users  WHERE username=?",
    [username],
    function(err, result, fields) {
      if (err) {
        ////console.log("error");
        throw err;
      } else {
        if (result.length != 0) {
          username = username + result.length;
        }
        pool.query(
          "INSERT INTO cv_school_detail (name,email,contact,city,state,address,logo) values(?,?,?,?,?,?,?)",
          [
            params.name,
            params.email,
            params.contact,
            params.city,
            params.state,
            params.address,
            filename,
          ],
          function(err, result, fields) {
            if (err) {
              ////console.log("error");
              throw err;
            } else {
              result.insertId;
              pool.query(
                "INSERT INTO cv_users (sch_id,role_id,name,contact,email,state,city,address,path,username,password,status) values(?,?,?,?,?,?,?,?,?,?,?,?)",
                [
                  result.insertId,
                  1,
                  params.name,
                  params.contact,
                  params.email,
                  params.state,
                  params.city,
                  params.address,
                  params.sch_dir,
                  username,
                  password,
                  1,
                ],
                function(err, result1, fields) {
                  if (err) {
                    ////console.log("error");
                    throw err;
                  } else {
                    createfolder(params.sch_dir);
                    res.json({
                      status: "200",
                      data: "done",
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

router.post("/Update_school", upload.any(), (req, res, next) => {
  var params = req.body;
  pool.query(
    "UPDATE cv_users SET name=?, email=?, contact=?, city=?, state=?, address=?, password=? where sch_id=? and user_id=?",
    [
      params.schoolDetail.name,
      params.schoolDetail.email,
      params.schoolDetail.contact,
      params.schoolDetail.city,
      params.schoolDetail.state,
      params.schoolDetail.address,
      params.schoolDetail.password,
      params.schoolDetail.sch_id,
      params.schoolDetail.user_id,
    ],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        pool.query(
          "UPDATE cv_school_detail SET name=?, email=?, contact=?, city=?, state=?, address=? where sch_id=?",
          [
            params.schoolDetail.name,
            params.schoolDetail.email,
            params.schoolDetail.contact,
            params.schoolDetail.city,
            params.schoolDetail.state,
            params.schoolDetail.address,
            params.schoolDetail.sch_id,
          ],
          function(err, result1, fields) {
            if (err) {
              throw err;
            } else {
              res.json({
                status: "200",
                data: "done",
              });
            }
          }
        );
      }
    }
  );
});

router.post("/Delete_school", (req, res, next) => {
  var params = req.body;
  pool.query(
    "UPDATE cv_users set status=? where sch_id=?",
    [params.acivateValue, params.sch_id],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: "done",
        });
      }
    }
  );
});

router.post("/assignGradesToSchool", (req, res) => {
  var params = req.body;
  var schoolKeys = Object.keys(params.schoolsDetail);
  schoolKeys.forEach((key) => {
    assignGradeToSchool(params.schoolsDetail[key], key);
  });
  res.json({
    success: 1,
  });
});

function assignGradeToSchool(schoolGrades, sch_id) {
  return new Promise(async function(resolve, reject) {
    for (var i = 1; i <= 10; i++) {
      if (schoolGrades[i] == true) {
        await runSqlQueryAsyncSelect(
          "SELECT cls_id FROM cv_school_classes WHERE sch_id=? and cls_id=?",
          [sch_id, i]
        ).then((result) => {
          if (!result.result.length) {
            runSqlQueryAsyncInsert(
              "INSERT INTO cv_school_classes (sch_id, cls_id) values(?,?)",
              [sch_id, i]
            );
          }
        });
      } else if (schoolGrades[i] == false) {
        await runSqlQueryAsyncDelete(
          "DELETE FROM cv_school_classes WHERE sch_id=? and cls_id=?",
          [sch_id, i]
        );
      }
    }
  });
}

function staff_register(params) {
  var password = genpassword();
  var username = params.name.replace(/[^a-zA-Z ]/g, "");
  username = username.replace(/\s/g, "").toLowerCase();
  checkUser(username);
  function checkUser(username) {
    pool.query(
      "SELECT username FROM cv_users  WHERE username=?",
      [username],
      function(err, result, fields) {
        if (err) {
          ////console.log("error");
          throw err;
        } else {
          if (result.length != 0) {
            checkUser(username + result.length);
          } else {
            // Register this username
            userpath = params.schoolPath + "/" + username;
            createfolder(userpath);
            pool.query(
              "INSERT INTO cv_users (sch_id,role_id,name,contact,email,state,city,address,username,password,path,status) values(?,?,?,?,?,?,?,?,?,?,?,?)",
              [
                params.sch_id,
                2,
                params.name,
                params.contact,
                params.email,
                params.state,
                params.city,
                params.address,
                username,
                password,
                userpath,
                1,
              ],
              function(err, result, fields) {
                if (err) {
                  ////console.log("error");
                  throw err;
                } else {
                }
              }
            );
          }
        }
      }
    );
  }
}

router.post("/Staff_register", (req, res, next) => {
  var params = req.body;
  staff_register(params);
});

router.post("/Multi_staff_register", upload.any(), (req, res, next) => {
  var params = req.body;
  var dataarray;
  var file = req.files[0];
  /*fs.createReadStream(file.path).pipe(csv()).on('data', function(data){
		});*/

  csvtojson()
    .fromFile(file.path)
    .then(function(data) {
      //when parse finished, result will be emitted here.
      for (var i = 0; i < data.length; i++) {
        dataarray = {
          sch_id: params.sch_id,
          schoolPath: params.schoolPath,
          name: data[i].Name,
          contact: data[i].Contact,
          email: data[i].Email,
          state: data[i].State,
          city: data[i].City,
          address: data[i].Address,
        };
        staff_register(dataarray);
      }
      res.json({ status: "200", data: "done" });
    });
});

router.post("/DisplayStaff", (req, res) => {
  var params = req.body;
  pool.query(
    params.sch_id
      ? "SELECT cu.*, (SELECT cga.grades from cv_grade_assigned as cga where cu.user_id=cga.user_id) as grades FROM cv_users as cu  where cu.role_id=2 and cu.sch_id=?  ORDER BY cu.user_id ASC"
      : "SELECT cu.*, (SELECT cga.grades from cv_grade_assigned as cga where cu.user_id=cga.user_id) as grades FROM cv_users as cu  where cu.role_id=2 ORDER BY cu.user_id ASC",
    params.sch_id ? [params.sch_id] : "",
    function(err, result, fields) {
      if (err) {
        ////console.log("error");
        throw err;
      } else {
        res.json({
          status: "200",
          staffs: result,
        });
      }
    }
  );
});

router.post("/Update_staff", upload.any(), (req, res, next) => {
  pool.query(
    "UPDATE cv_users SET name=?, email=?, contact=?, city=?, state=?, address=?,  password=? where sch_id=? and user_id=?",
    [
      params.teacherDetail.name,
      params.teacherDetail.email,
      params.teacherDetail.contact,
      params.teacherDetail.city,
      params.teacherDetail.state,
      params.teacherDetail.address,
      params.teacherDetail.password,
      params.teacherDetail.sch_id,
      params.teacherDetail.user_id,
    ],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: "done",
        });
      }
    }
  );
});

router.post("/Delete_staff", upload.any(), (req, res, next) => {
  var params = req.body;
  pool.query(
    "update cv_users set status=? where role_id=2 and user_id=? ",
    [params.acivateValue, params.user_id],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: "done",
        });
      }
    }
  );
});

router.post("/assignGradesToTeachers", (req, res) => {
  var params = req.body;
  for (var i = 0; i < params.teachersDetails.length; i++) {
    assignGradeToTeacher(params.teachersDetails[i]);
  }
  if (i == params.teachersDetails.length) {
    res.json({
      success: 1,
    });
  }
});

function assignGradeToTeacher(userData) {
  var schoolGrades = "";
  for (i = 0; i < userData.grades.length; i++) {
    if (userData.grades[i] != null) {
      schoolGrades += userData.grades[i] + ",";
    }
  }
  schoolGrades = schoolGrades.substring(0, schoolGrades.length - 1);

  if (userData.grades.length && schoolGrades != "") {
    return runSqlQueryAsyncSelect(
      "SELECT user_id FROM cv_grade_assigned WHERE user_id=?",
      [userData.user_id]
    ).then((result) => {
      if (!result.result.length) {
        runSqlQueryAsyncInsert(
          "INSERT INTO cv_grade_assigned (user_id, sch_id, grades,skills,subjects) values(?,?,?,?,?)",
          [userData.user_id, userData.sch_id, schoolGrades, "", ""]
        );
      } else {
        runSqlQueryAsyncUpdate(
          "UPDATE cv_grade_assigned SET grades=? where user_id=? and sch_id=?",
          [schoolGrades, userData.user_id, userData.sch_id]
        );
      }
    });
  }
}

/*End*/

var lmsStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.resolve(appRoot + "/resources/Book_content/"));
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});
var lmsUpload = multer({ storage: lmsStorage });

router.post("/uploadLmsImage", lmsUpload.any(), (req, res, next) => {
  //console.log(res);
  res.end();
});
let lmsVideoStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.resolve(appRoot + "/resources/books_video/"));
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});
let lmsVideoUpload = multer({ storage: lmsVideoStorage });
router.post("/uploadLmsVideo", lmsVideoUpload.any(), (req, res, next) => {
  res.end();
});

router.get("/getLmsVideos", (req, res) => {
  var dir = path.resolve(appRoot + "/resources/books_video");
  if (fs.existsSync(dir)) {
    fs.readdir(dir, (err, files) => {
      res.send(files);
    });
  } else {
    res.send();
  }
});

/***Other Course */
router.post("/getSchools", (req, res) => {
  pool.query(
    "SELECT * FROM `cv_school_detail` WHERE sch_id NOT IN(1,2)",
    function(err, data) {
      if (err) console.log(err);
      else {
        //console.log(data);
        res.send(data);
      }
    }
  );
});
router.post("/getCourseAccess", (req, res) => {
  let params = req.body;
  pool.query(
    "SELECT `other_subject_course_available` FROM `cv_school_detail` WHERE sch_id=?",
    [params.sch_id],
    function(err, data) {
      if (err) console.log(err);
      else {
        res.send(data);
      }
    }
  );
});
router.post("/getCourseAllTopics", (req, res) => {
  let params = req.body;

  pool.query(
    "SELECT book_title.topic_id,book_title.topic_name,book_title.book_id FROM `book_title` WHERE book_title.book_id=? and book_title.sch_id=?",
    [params.bookId, params.sch_id],
    function(err, data) {
      if (err) console.log(err);
      else {
        res.send(data);
      }
    }
  );
});
router.post("/UpdateUTopic", (req, res) => {
  let params = req.body;
  pool.query(
    "UPDATE `book_title` SET `topic_name`=? where topic_id=?",
    [params.topic_name, params.topic_id],
    function(err, data) {
      if (err) {
        console.log(err);
      } else {
        res.send(data);
      }
    }
  );
});
router.post("/UpdateUSTopic", (req, res) => {
  let params = req.body;
  pool.query(
    "UPDATE `other_course_content` SET `name`=? where other_course_content.other_course_content_id=?",
    [params.topic_name, params.other_course_content_id],
    function(err, data) {
      if (err) {
        console.log(err);
      } else {
        res.send(data);
      }
    }
  );
});
router.post("/DeleteMSTopic", (req, res) => {
  let params = req.body;
  pool.query(
    "DELETE FROM `other_course_content` WHERE other_course_content.other_course_content_id=?",
    [params.other_course_content_id],
    function(err, data) {
      if (err) console.log(err);
      else {
        res.send(data);
      }
    }
  );
});
router.post("/DeleteMTopic", (req, res) => {
  let params = req.body;
  pool.query(
    "DELETE FROM `book_title` WHERE topic_id=?",
    [params.topic_id],
    function(err, data) {
      if (err) console.log(err);
      else {
        res.send(data);
      }
    }
  );
});
router.post("/getThisCourseSubTopics", (req, res) => {
  let params = req.body;
  pool.query(
    "SELECT `other_course_content_id`, `topic_id`, `name`,`content_type` FROM `other_course_content` WHERE other_course_content.topic_id=? and other_course_content.sch_id=?",
    [params.topic_id, params.sch_id],
    function(err, data) {
      if (err) console.log(err);
      else {
        res.send(data);
      }
    }
  );
});
router.post("/getOtherCourseSubTopics", (req, res) => {
  let params = req.body;
  pool.query(
    "SELECT * FROM `book_title` WHERE book_id=?",
    [params.book_id],
    function(err, data) {
      if (err) console.log(err);
      else {
        res.send(data);
      }
    }
  );
});
router.post("/InsertCNewTopic", (req, res) => {
  let params = req.body;
  pool.query(
    "INSERT INTO `book_title`(`book_id`, `topic_name`, `slug`,`sch_id`, `visible`, `user_id`) VALUES (?,?,?,?,1,?)",
    [
      params.book_id,
      params.topic_name,
      params.topic_name.toLowerCase(),
      params.sch_id,
      params.user_id,
    ],
    function(err, data) {
      if (err) console.log(err);
      else res.send(data);
    }
  );
});

router.post("/insertOtherCourseTopic", (req, res) => {
  let params = req.body;
  pool.query(
    "INSERT INTO `book_title`(`book_id`, `topic_name`, `slug`,`sch_id`, `visible`) VALUES (?,?,?,?,1)",
    [params.book_id, params.topic, params.topic.toLowerCase(), params.sch_id],
    function(err, data) {
      if (err) console.log(err);
      else {
        pool.query(
          "SELECT * FROM `book_title` WHERE book_id=?",
          [params.book_id],
          function(err, data) {
            if (err) console.log(err);
            else {
              res.send(data);
            }
          }
        );
      }
    }
  );
});
router.post("/uploadUOtherLmsCont", (req, res) => {
  let params = req.body;
  pool.query(
    "INSERT INTO `other_course_content`(`book_id`,`topic_id`, `name`, `content`, `type`,`content_type`,`sch_id`,`user_id`) VALUES (?,?,?,?,?,?,?,?)",
    [
      params.book_id,
      params.topic_id,
      params.pageName,
      params.content,
      params.type,
      params.contentType,
      params.sch_id,
      params.user_id,
    ],
    function(err, data) {
      if (err) console.log(err);
      else res.send(data);
    }
  );
});
router.post("/uploadOtherLmsCont", async (req, res) => {
  let params = req.body;

  await pool.query(
    "INSERT INTO `other_course_content`(`book_id`,`topic_id`, `name`, `content`, `type`,`content_type`,`sch_id`) VALUES (?,?,?,?,?,?,?)",
    [
      params.book_id,
      params.topic_id,
      params.pageName,
      params.content,
      params.type,
      params.contentType,
      params.sch_id,
    ],
    function(err, data) {
      if (err) console.log(err);
      else res.send(data);
    }
  );
});

router.get("/getLCourses", (req, res) => {
  pool.query(
    "SELECT * FROM `books` inner join books_price on (books_price.book_id = books.book_id) where books_price.other_courses=1",
    function(err, data) {
      if (err) console.log(err);
      res.send(data);
    }
  );
});
router.get("/getOtherLmsVideos", (req, res) => {
  var dir = path.resolve(appRoot + "/resources/other_course_video");
  if (fs.existsSync(dir)) {
    fs.readdir(dir, (err, files) => {
      res.send(files);
    });
  } else {
    res.send();
  }
});
let lmsOtherVideoStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.resolve(appRoot + "/resources/other_course_video/"));
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});
let lmsOtherVideoUpload = multer({ storage: lmsOtherVideoStorage });
router.post(
  "/uploadOtherLmsVideo",
  lmsOtherVideoUpload.any(),
  (req, res, next) => {
    res.end();
  }
);

/***End Course */
/****Upload Admin Notifcation */
let notiVideoStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.resolve(appRoot + "/resources/notification_video/"));
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});
let notiVideoUload = multer({ storage: notiVideoStorage });
router.post(
  "/uploadAdminVideoNotification",
  notiVideoUload.any(),
  (req, res, next) => {
    res.end();
  }
);
/****End uplod Admin Notifcation */
/***Other pdf */
let lmsOtherPdfStorage = multer.diskStorage({
  destination: async function(req, file, cb) {
    await cb(null, path.resolve(appRoot + "/resources/other_course_pdf/"));
  },
  filename: async function(req, file, cb) {
    await cb(null, file.originalname);
  },
});
let lmsOtherPdfUpload = multer({ storage: lmsOtherPdfStorage });
router.post(
  "/uploadOtherLmsPdf",
  lmsOtherPdfUpload.any(),
  async (req, res, next) => {
    res.end();
  }
);

/***End pdf */

router.get("/getLmsImages", (req, res) => {
  var dir = path.resolve(appRoot + "/resources/Book_content");
  if (fs.existsSync(dir)) {
    fs.readdir(dir, function(err, files) {
      res.json(files);
    });
  } else {
    res.send();
  }
});

/*------------------start robothon--------------------------*/
const crypto = require("crypto");
const payUKey = "9ksPI4KL";
const payUSalt = "fpa0csfwMg";

router.post("/robothonUserRegister", (req, res) => {
  var params = req.body;
  var token = "";
  var reg = "";
  var insertId = "";
  return runSqlQueryAsyncSelect(
    "SELECT email  FROM cv_robothon_users where email=?",
    [params.st_email]
  )
    .then((result) => {
      if (result.err) {
      } else {
        if (!result.result.length) {
          return runSqlQueryAsyncInsert(
            "INSERT INTO cv_robothon_users (name, email, parent_name, parent_email, contact, grade, sch_name, city,status) values(?,?,?,?,?,?,?,?,?) ",
            [
              params.st_name,
              params.st_email,
              params.st_fname,
              params.st_femail,
              params.contact,
              params.grade,
              params.sch_name,
              params.city,
              1,
            ]
          );
        } else {
          throw new Error("already exist");
        }
      }
    })
    .then((result) => {
      if (result && result.result.insertId) {
        //reg_no =1500+result.result.insertId;
        token = jwt.sign(
          {
            userId: result.result.insertId,
            st_name: params.st_name,
            contact: params.contact,
            email: params.st_email,
            parent_name: params.st_fname,
            grade: params.grade,
            sch_name: params.sch_name,
          },
          "zmnduoi320984#*(^$(",
          { expiresIn: "7d" }
        );
        sendRobothonUserMail(params, token);
        res.json({
          success: 1,
          token: token,
        });
        //return runSqlQueryAsyncUpdate("update cv_robothon_users set reg_no=? where user_id=?",[reg_no, result.result.insertId])
      }
    })
    .catch((err) => {
      if (typeof err != "string") {
        if (err.message == "already exist") {
          res.json({
            success: 0,
            insertId: 0,
          });
        }
      }
    });
});

function sendRobothonUserMail(params, token) {
  const mailgun = require("mailgun-js");
  const DOMAIN = "mail.codevidhya.com";
  const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
  const mg = mailgun({ apiKey: api, domain: DOMAIN });
  const data = {
    from: "Codevidhya <contact@codevidhya.com>",
    to: params.st_email,
    subject: "Codevidhya | Robothon ",
    html: `<html>
      <body>
        <p>Dear ${params.st_name} </p>
        <p>Thanks for registering for Robothon. To ensure your registration, kindly continue to payment.</p>
        <p><a href="codevidhya.com/robothon/register?token=${token}"> Click here</a> to proceed payment.<br></p> 
        <p>
          <b>After payment please make sure, you received a ticket</b>. Kindly bring the printout of event   pass at venue.
        </p>
        <p>We are looking forward to see you there.</p>
        <p>Regards</p>
        <p>Team Codevidhya</p>
      </body></html>`,
  };

  return mg.messages().send(data);
}

router.post("/robothonCheckToken", (req, res) => {
  var params = req.body;
  var tokenData = "";
  var chkToken = false;
  jwt.verify(params.token, "zmnduoi320984#*(^$(", (err, data) => {
    if (!err && data) {
      chkToken = true;
      tokenData = data;
    }
  });
  if (chkToken == true) {
    runSqlQueryAsyncSelect(
      "SELECT cru.*, cro.order_id, cro.status as payStatus, DATE_FORMAT(cro.purchased_at, '%W %D %M %Y') 'purachsed_at' from `cv_robothon_users` as cru LEFT JOIN cv_robothon_orders as cro ON cru.user_id=cro.user_id where cru.user_id=?",
      [tokenData.userId]
    ).then((result) => {
      res.json({
        message: 1,
        data: result.result,
      });
    });
  }
});

router.post("/beginRobothonPaymentProcess", (req, res) => {
  var params = req.body;
  var token = "";
  return generateRobothonOrder(params.tokenData.user_id).then((newOrderId) => {
    token = jwt.sign(
      {
        userId: params.tokenData.user_id,
        st_name: params.tokenData.name,
        contact: params.tokenData.contact,
        email: params.tokenData.email,
        parent_name: params.tokenData.parent_name,
        grade: params.tokenData.grade,
        sch_name: params.tokenData.sch_name,
        reg_no: newOrderId,
      },
      "zmnduoi320984#*(^$(",
      { expiresIn: "7d" }
    );
    var requestHash = getPayURequestHashForRobothon({
      order_id: newOrderId,
      amount: 500,
      product_info: "Robothon", //productInfo.name,
      first_name: params.tokenData.name.split(" ")[0],
      email: params.tokenData.email,
    });
    res.send(
      JSON.stringify({
        transaction_data: {
          key: payUKey,
          id: newOrderId,
          hash: requestHash,
          amount: 500,
          first_name: params.tokenData.name.split(" ")[0],
          email: params.tokenData.email,
          phone: params.tokenData.contact,
          product_info: "Robothon", //productInfo.name
        },
        token: token,
      })
    );
  });
});

function getPayURequestHashForRobothon(data) {
  //hashSequence = key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt;
  var hashSequence = String(
    payUKey +
      "|" +
      data.order_id +
      "|" +
      data.amount +
      "|" +
      data.product_info +
      "|" +
      data.first_name +
      "|" +
      data.email +
      "|||||||||||" +
      payUSalt
  );
  var hash = crypto.createHash("sha512");
  hash.update(hashSequence);
  return hash.digest("hex");
}

/*
async function generateRobothonOrder(userId) {
  var lastOrderId = 0;
  var newOrderId = 0;
  return new Promise(function(resolve, reject) {
    conn.beginTransaction(function(err) {
      if (err) {
        res.json({
          status: "200",
          data: "0"
        });
      }

      pool.query(
        "select order_id from cv_robothon_orders order by order_id desc limit 1",
        function(err, data) {
          if (err) {
            return conn.rollback(function() {
              throw err;
            });
          } else {
            if (!data.length) {
              lastOrderId = 1500;
            } else {
              lastOrderId = data[0].order_id;
            }
            newOrderId = lastOrderId + 1;
            pool.query(
              "select order_id from cv_robothon_orders  where user_id=?",
              [userId],
              function(err, data1) {
                if (err) {
                  return conn.rollback(function() {
                    throw err;
                  });
                } else {
                  if (data1.length == 0) {
                    pool.query(
                      "insert into cv_robothon_orders (`user_id`, `order_id`, `price`) values(?,?,?) ",
                      [userId, newOrderId, "500"],
                      function(err, data) {
                        if (err) {
                        } else {
                          conn.commit(function(err) {
                            if (err) {
                              return conn.rollback(function() {
                                throw err;
                              });
                            } else {
                              resolve(newOrderId);
                            }
                          });
                        }
                      }
                    );
                  } else {
                    resolve(data1[0].order_id);
                  }
                }
              }
            );
          }
        }
      );
    });
  });
}
*/

router.post("/checkUserStatus", (req, res) => {
  var params = req.body;
  return runSqlQueryAsyncSelect(
    "SELECT cru.user_id, cru.status as registerStatus, cro.status as payStatus from cv_robothon_users as cru Left join cv_robothon_orders as cro on cru.user_id=cro.user_id and cru.user_id=?",
    [params.userData.user_id]
  ).then((result) => {
    if (result.err) {
      throw new Error("order_not_found");
    } else if (result.result.length) {
      res.json({
        data: result.result[0],
      });
    }
  });
});

/*-------------------end----------------------*/
/*------------------------------------start live course---------------------------------*/

router.post("/displayLiveCourses", (req, res) => {
  var params = req.body;
  return runSqlQueryAsyncSelect("SELECT * from live_courses").then((result) => {
    if (result.err) {
      throw new Error("order_not_found");
    } else if (result.result.length) {
      res.json({
        data: result.result,
      });
    }
  });
});

router.post("/displayLiveCourseStudents", (req, res) => {
  var params = req.body;
  if (params.role == "codevidhya") {
    return runSqlQueryAsyncSelect(
      "SELECT cu.*, (SELECT lcc.status from live_course_certificate as lcc where lcc.user_id=cu.user_id and lcc.live_course_id=lc.live_course_id) as certificate_status FROM `cv_users` as cu, live_courses as lc, orders WHERE orders.product_id=lc.product_id and cu.user_id=orders.user_id and orders.status=1 and lc.live_course_id=?",
      [params.course_id]
    ).then((result) => {
      if (result.result.length) {
        res.json({
          data: result.result,
        });
      }
    });
  } else if (params.role == "student") {
    return runSqlQueryAsyncSelect(
      "SELECT lc.*, lcc.status FROM live_courses as lc, orders, live_course_certificate as lcc WHERE orders.product_id=lc.product_id and lcc.user_id=orders.user_id and orders.status=1 and lcc.status=1  and lcc.user_id=?",
      [params.user_id]
    ).then((result) => {
      if (result.result.length) {
        res.json({
          data: result.result,
        });
      }
    });
  }
});

router.post("/certificatePermission", (req, res) => {
  var params = req.body;
  return runSqlQueryAsyncSelect(
    "SELECT user_id FROM live_course_certificate WHERE user_id=? and live_course_id=?",
    [params.user_id, params.course_id]
  )
    .then((result) => {
      if (!result.result.length) {
        return runSqlQueryAsyncInsert(
          "INSERT INTO live_course_certificate (user_id, live_course_id,status) values(?,?,?)",
          [params.user_id, params.course_id, params.acivateValue]
        );
      } else {
        return runSqlQueryAsyncUpdate(
          "UPDATE live_course_certificate SET status=? where user_id=? and live_course_id=?",
          [params.acivateValue, params.user_id, params.course_id]
        );
      }
    })
    .then(() => {
      res.json({
        data: "done",
      });
    });
});

router.get("/getUsernameList", (req, res) => {
  try {
    const queryString = req.query.q;
    return runSqlQueryAsyncSelect(
      `SELECT username FROM cv_users WHERE username LIKE '${queryString}%' AND role_id=1 AND trainer=0 AND sales=0 ORDER BY username ASC`
    ).then((result) => {
      if (result.err) {
        console.log(result.err);
        res.json({
          error: "no matching username",
        });
      } else if (result.result) {
        res.json({
          data: result.result,
        });
      }
    });
  } catch (e) {
    res.json({
      error: "no matching username",
    });
  }
});

// temporary controller
// need to be replaced with a route with authentication middleware
router.get("/getUserDetails", (req, res) => {
  try {
    const username = req.query.q;
    return runSqlQueryAsyncSelect(
      `SELECT name, contact, email, user_id FROM cv_users WHERE username='${username}' AND role_id=1 AND trainer=0 AND sales=0`
    ).then((result) => {
      console.log(result);
      if (result.err) {
        console.log(result.err);
        res.json({
          error: "no matching username",
        });
      } else if (result.result) {
        res.json({
          data: result.result,
        });
      }
    });
  } catch (e) {
    res.json({
      error: "no matching username",
    });
  }
});
/*------------------------------------end-----------------------------------------------*/

module.exports = router;
