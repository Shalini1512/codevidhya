var express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
var router = express.Router();
var request = require("request-promise-native");
let pdf = require("html-pdf");
var multer = require("multer");
const path = require("path");
var url = require("url");
var fs = require("fs");
const payUKey = "9ksPI4KL";
const payUSalt = "fpa0csfwMg";
const mg = require("mailgun-js");
const DOMAIN = "mail.codevidhya.com";
const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
const mailgun = mg({ apiKey: api, domain: DOMAIN });

const appRoot = path.resolve(path.join(__dirname, "../../"));
const pathSeparator = appRoot.indexOf("\\") >= 0 ? "\\" : "/";
var moment = require("moment");
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "../static/uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});
var upload = multer({ storage: storage });
var db = require("../db");
var pool = db.pool;
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
                    success: 1
                  });
                }
              }
            );
          } else {
            res.json({
              status: "200",
              success: 0
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
        all_subject: result
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
        all_classes: result
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
        //console.log("error");
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
          all_sections: result
        });
      }
    }
  );
});

router.post("/getServerTime", (req, res) => {
  res.json({
    status: "200",
    serverTime: new Date()
  });
});

router.post("/displayAllBooks", (req, res) => {
  var params = req.body;
  return runSqlQueryAsyncSelect("SELECT book_id, book_name FROM books")
    .then((result) => {
      res.json({
        success: 1,
        courses: result.result
      });
    })
    .catch((error) => {});
});

router.post("/CreateAssessment", function(req, res) {
  var params = req.body;
  var assessmentDetail = [];
  return new Promise(async function(resolve, reject) {
    var result0 = await runSqlQueryAsyncSelect(
      "SELECT assessment_name  FROM cv_assessments where sch_id=? AND assessment_name=?",
      [params.sch_id, params.assessmentDetails[0].assessmentName]
    );
    if (result0.result.length > 0) {
      reject();
    } else {
      var result00 = await runSqlQueryAsyncInsert(
        "INSERT INTO cv_assessments (assessment_name, duration, status, sch_id, role_id,book_id,used_for,tot_que, tot_marks) values(?,?,?,?,?,?,?,?,?)",
        [
          params.assessmentDetails[0].assessmentName,
          params.assessmentDetails[0].duration,
          1,
          params.sch_id,
          params.assessmentDetails[0].role_id,
          0,
          0,
          0,
          0
        ]
      );
      resolve(result00.insertId);
    }
  })
    .then(async (assessmentId) => {
      return new Promise(async function(resolve, reject) {
        if (params.assessmentQuestion.length != 0) {
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
                  params.assessmentQuestion[i].marks
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
        if (params.assessmentClass.length != 0) {
          for (var j = 0; j < params.assessmentClass.length; j++) {
            var result3 = await runSqlQueryAsyncSelect(
              "SELECT assessment_id  FROM cv_assessment_for_school where sch_id=? AND assessment_id=? AND cls_id=?",
              [params.sch_id, assessmentId, params.assessmentClass[j].cls_id]
            );
            if (result3.result.length == 0) {
              var result4 = await runSqlQueryAsyncInsert(
                "INSERT INTO cv_assessment_for_school values(?,?,?,?) ",
                [
                  assessmentId,
                  params.sch_id,
                  params.assessmentClass[j].cls_id,
                  params.assessmentClass[j].asmnt_date
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
      emailforAssessment(params, assessmentDetail);
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

/* this block used for notifications*/
function sendNotification(user_id, message) {
  var result = runSqlQueryAsyncInsert(
    "INSERT INTO cv_notifications (user_id,message,status) values(?,?,?)",
    [user_id, message, 1]
  );
}

router.post("/displayAllNotifications", (req, res) => {
  var params = req.body;
  return runSqlQueryAsyncSelect(
    "SELECT * FROM cv_notifications where user_id=? AND status=1",
    [params.user_id]
  )
    .then((result) => {
      res.json({
        success: 1,
        notifications: result.result
      });
    })
    .catch((error) => {});
});

router.post("/disableNotification", (req, res) => {
  var params = req.body;
  return runSqlQueryAsyncSelect(
    "UPDATE  cv_notifications set status=0 where id=? and user_id=?",
    [params.noti_id, params.user_id]
  )
    .then((result) => {
      res.json({
        success: 1
      });
    })
    .catch((error) => {});
});

/*  notifications block end*/
function sendMailForAssessment(userDetail) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: "contact@codevidhya.com",
      pass: "QUjtxzddGgRA"
    }
  });

  for (var i = 0; i < userDetail.length; i++) {
    transporter.sendMail({
      from: "contact@codevidhya.com", // sender address
      to: userDetail[i].userEmail, // list of receivers
      subject: "Assessment Notification", // Subject line
      html: userDetail[i].message
    });
  }
}

function emailforAssessment(params, assessmentDetails) {
  var assessmentName = "";
  var assessmentDuration = "";
  var schoolName = "";
  var createdDate = "";
  var detailsForEmail = [];
  var msg =
    "A new assessment scheduled for you, please check your assessment panel.";

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
          var userDetail = result1.result;
          for (var j = 0; j < userDetail.length; j++) {
            var message = `<html>
                <body>
                  <p>Dear ${userDetail[j].studentName},</p>
                  <p>Your school has scheduled an assessment for your Grade that will be held on ${moment(
                    assessmentDetails[i].asmnt_date
                  ).format(
                    "DD MMMM, YYYY"
                  )}. The detailed description of the assessment is given below.</p>
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
                        <th style='border: 1px solid black;text-align:left;width:auto;'>Date created</th>
                        <td style='border: 1px solid black;'>${moment(
                          createdDate
                        ).format("DD MMMM, YYYY")}</td>
                      </tr>
                      <tr>
                        <th style='border: 1px solid black;text-align:left;width:auto;'>Assigned to</th>
                        <td style='border: 1px solid black;'>${
                          assessmentDetails[i].cls_id
                        }</td>
                      </tr>
                    </table
                  </p>
                  <p>You can attempt this assessment in your school on ${moment(
                    assessmentDetails[i].asmnt_date
                  ).format("DD MMMM, YYYY")} by ${moment(
              assessmentDetails[i].asmnt_date
            ).format("hh:mm a")} sharp.</p>
                  <p><b>Note:</b> Your school can reschedule or cancel this assessment depending upon the circumstances. </p>
                  <p>For any further details or concern, you can contact to your subject teacher.</p>
                  <p>Thank you</p>
                  <p>${schoolName}</p>
                  <p>You are receiving this mail as your school is the part of the Codevidhya family.</p>
                </body></html>`;
            sendNotification(userDetail[j].user_id, msg);
            if (userDetail[j].email) {
              detailsForEmail.push({
                user_id: userDetail[j].user_id,
                userEmail: userDetail[j].email,
                message: message
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
            "INSERT INTO cv_assessment_for_school values(?,?,?,?) ",
            [
              params.asmnt_id,
              params.sch_id,
              params.classes[i].cls_id,
              params.classes[i].asmnt_date
            ]
          );
          assessmentDetail.push(params.classes[i]);
        }
      }
    }
    resolve(assessmentDetail);
  })
    .then(() => {
      emailforAssessment(params, assessmentDetail);
      res.json({ success: 1 });
    })
    .catch((error) => {});
});

router.post("/assignAssessmentToTeacher", (req, res) => {
  var params = req.body;
  return new Promise(async function(resolve, reject) {
    var result = await runSqlQueryAsyncSelect(
      "SELECT assessment_id  FROM cv_assessment_for_school where sch_id=? AND assessment_id=? AND cls_id=0",
      [params.sch_id, params.asmnt_id]
    );
    if (result.result.length == 0) {
      var result4 = await runSqlQueryAsyncInsert(
        "INSERT INTO cv_assessment_for_school values(?,?,?,?) ",
        [params.asmnt_id, params.sch_id, 0, params.asmnt_date]
      );
      resolve(1);
    } else {
      resolve(0);
    }
  })
    .then((status) => {
      res.json({ success: status });
    })
    .catch((error) => {});
});

router.post("/assignAssessmentToCourse", (req, res) => {
  var params = req.body;
  return new Promise(async function(resolve, reject) {
    var result2 = runSqlQueryAsyncUpdate(
      "UPDATE cv_assessments SET book_id=? where assessment_id=?",
      [params.book_id, params.asmnt_id]
    );
    resolve();
  })
    .then(() => {
      res.json({ success: 1 });
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
          asmnt_classes: result
        });
      }
    }
  );
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
          status: "200"
        });
      }
    }
  );
});

router.post("/assessmentForUsers", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT ca.assessment_id, ca.assessment_name, ca.duration,ca.role_id,ca.book_id, cafs.date,(select count(que_id) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_que,(select sum(marks) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_marks,ca.sch_id,(select user_id from cv_assessment_exam_time as caet where caet.user_id=? and caet.assessment_id=cafs.assessment_id) as user_id,(select score from cv_assessment_result as car where car.user_id=? and car.assessment_id=cafs.assessment_id) as score,(select case when count(user_id)>0 then 'true' else 'false' end from cv_assessment_exam_time as caet where caet.user_id=? and caet.assessment_id=cafs.assessment_id and caet.exm_end_time > now()) as exam_status  FROM cv_assessments as ca, cv_assessment_for_school as cafs where ca.assessment_id=cafs.assessment_id AND cafs.cls_id=? AND cafs.sch_id=?",
    [
      params.user_id,
      params.user_id,
      params.user_id,
      params.cls_id,
      params.sch_id
    ],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: result
        });
      }
    }
  );
});

router.post("/displayCourseAsessment", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT ca.assessment_id, ca.assessment_name, ca.duration,ca.role_id,ca.book_id, (select count(que_id) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_que,(select sum(marks) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_marks,ca.sch_id,(select user_id from cv_assessment_exam_time as caet where caet.user_id=? and caet.assessment_id=ca.assessment_id) as user_id,(select score from cv_assessment_result as car where car.user_id=? and car.assessment_id=ca.assessment_id) as score,(select case when count(user_id)>0 then 'true' else 'false' end from cv_assessment_exam_time as caet where caet.user_id=? and caet.assessment_id=ca.assessment_id and caet.exm_end_time > now()) as exam_status  FROM cv_assessments as ca where ca.book_id=?",
    [params.user_id, params.user_id, params.user_id, params.book_id],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          assessments: result
        });
      }
    }
  );
});

router.post("/DisplayAssessment", (req, res) => {
  var params = req.body;
  if (params.role_id == 3) {
    pool.query(
      "SELECT ca.assessment_id, ca.assessment_name, ca.duration,ca.book_id,ca.used_for, cafs.date,(select count(que_id) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_que,(select sum(marks) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_marks,ca.sch_id,(select user_id from cv_assessment_exam_time as caet where caet.user_id=? and caet.assessment_id=cafs.assessment_id) as user_id,(select score from cv_assessment_result as car where car.user_id=? and car.assessment_id=cafs.assessment_id) as score,(select case when count(user_id)>0 then 'true' else 'false' end from cv_assessment_exam_time as caet where caet.user_id=? and caet.assessment_id=cafs.assessment_id and caet.exm_end_time > now()) as exam_status  FROM cv_assessments as ca, cv_assessment_for_school as cafs where ca.assessment_id=cafs.assessment_id AND cafs.cls_id=? AND cafs.sch_id=?",
      [
        params.user_id,
        params.user_id,
        params.user_id,
        params.cls_id,
        params.sch_id
      ],
      function(err, result, fields) {
        if (err) {
          throw err;
        } else {
          pool.query(
            "SELECT DISTINCT ca.assessment_id, ca.assessment_name,ca.duration,ca.book_id,ca.used_for,(select count(que_id) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_que,(select sum(marks) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_marks,ca.date, ca.status, ca.sch_id,ca.role_id, (select user_id from cv_assessment_exam_time as caet where caet.user_id=? and caet.assessment_id=ca.assessment_id) as user_id,(select score from cv_assessment_result as car where car.user_id=? and car.assessment_id=ca.assessment_id) as score,(select case when count(user_id)>0 then 'true' else 'false' end from cv_assessment_exam_time as caet where caet.user_id=? and caet.assessment_id=ca.assessment_id and caet.exm_end_time > now()) as exam_status FROM cv_assessments as ca where ca.sch_id=0 and ca.role_id=3 and ca.book_id=0 and ca.used_for=1",
            [params.user_id, params.user_id, params.user_id],
            function(err, result1, fields) {
              if (err) {
                throw err;
              } else {
                res.json({
                  status: "200",
                  data: result,
                  publicAssessments: result1
                });
              }
            }
          );
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
            "SELECT DISTINCT ca.assessment_id, ca.assessment_name,ca.duration,ca.book_id,ca.used_for,(select count(que_id) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_que,(select sum(marks) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_marks,ca.date, ca.status, ca.sch_id,ca.role_id FROM cv_assessments as ca, cv_assessment_for_school as cafs where ca.assessment_id=cafs.assessment_id and cafs.sch_id=? ",
            [params.sch_id],
            function(err, result1, fields) {
              if (err) {
                throw err;
              } else {
                res.json({
                  status: "200",
                  assessments: result,
                  cv_assessments: result1
                });
              }
            }
          );
        }
      }
    );
  } else {
    pool.query(
      "SELECT DISTINCT ca.assessment_id, ca.assessment_name,ca.duration,ca.book_id,ca.used_for,(select count(que_id) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_que,(select sum(marks) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_marks,ca.date, ca.status, ca.sch_id,ca.role_id FROM cv_assessments as ca",
      function(err, result, fields) {
        if (err) {
          throw err;
        } else {
          res.json({
            status: "200",
            assessments: result
          });
        }
      }
    );
  }
});

router.post("/School_assessment", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT DISTINCT ca.assessment_id, ca.assessment_name,ca.duration,ca.book_id,ca.used_for,(select count(que_id) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_que,(select sum(marks) from cv_assessment_question as caq where caq.assessment_id = ca.assessment_id ) as tot_marks,ca.date, ca.status, ca.sch_id,ca.role_id FROM cv_assessments as ca, cv_assessment_for_school as cafs where ca.assessment_id=cafs.assessment_id and cafs.sch_id=?",
    [params.sch_id],
    function(err, result, fields) {
      if (err) {
        //console.log("error");
        throw err;
      } else {
        res.json({
          status: "200",
          cv_assessments: result
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
          assessment_det: result
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
          asmnt_applied: result
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
            status: "200"
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
              params.assessment_id
            ],
            function(err, result1, fields) {
              if (err) {
                //console.log("error");
                throw err;
              } else {
                res.json({
                  status: "200",
                  data: result1
                });
              }
            }
          );
        } else {
          pool.query(
            "INSERT INTO cv_assessment_exam_time values(?,?,?,?) ",
            [
              params.user_id,
              params.assessment_id,
              new Date(startTime),
              new Date(endTime)
            ],
            function(err, result1, fields) {
              if (err) {
                //console.log("error");
                throw err;
              } else {
                //console.log(result);
                res.json({
                  status: "200",
                  data: result1
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
          assessmentTime: totSeconds
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
                "SELECT caq.assessment_id, caq.sr_no, caq.que_id, caq.sub_id FROM cv_assessment_question as caq WHERE caq.assessment_id=? ORDER BY caq.sr_no ASC",
                [params.assessment_id],
                function(err, result2, fields) {
                  if (err) {
                    //console.log("error");
                    throw err;
                  } else {
                    res.json({
                      status: "200",
                      subjects: result,
                      tot_que: result1,
                      user_ans: result2
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
              0
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
                    params.assessment_id
                  ],
                  function(err, result2, fields) {
                    if (err) {
                      //console.log("error");
                      throw err;
                    } else {
                      res.json({
                        status: "200",
                        user_ans: result2
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
                params.que_id
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
                      params.assessment_id
                    ],
                    function(err, result2, fields) {
                      if (err) {
                        //console.log("error");
                        throw err;
                      } else {
                        res.json({
                          status: "200",
                          user_ans: result2
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

router.post("/CheckAssessment", (req, res) => {
  var params = req.body;
  return runSqlQueryAsyncSelect(
    "select * from cv_assessment_result where user_id=? and assessment_id=?",
    [params.user_id, params.assessment_id]
  ).then((result) => {
    if (result.result.length) {
      res.json({
        exam: 1
      });
    } else {
      res.json({
        exam: 0
      });
    }
  });
});

router.post("/Assessment_done", (req, res) => {
  var params = req.body;
  var userAns = new Object();
  var assessmentMarks = 0;
  for (var i = 0; i < params.user_ans.length; i++) {
    userAns[params.user_ans[i].que_id] = params.user_ans[i];
  }
  return new Promise(async function(resolve, reject) {
    return runSqlQueryAsyncSelect(
      "SELECT cq.que_id,cq.sub_id,cq.true_ans, caq.marks FROM `cv_assessment_question` as caq, cv_questions as cq WHERE cq.que_id = caq.que_id and caq.assessment_id=?",
      [params.assessment_id]
    ).then(async (result) => {
      var score = 0;

      for (var i = 0; i < result.result.length; i++) {
        var marks = 0;
        assessmentMarks = assessmentMarks + result.result[i].marks;
        if (
          userAns[result.result[i].que_id] &&
          userAns[result.result[i].que_id].st_ans == result.result[i].true_ans
        ) {
          marks = result.result[i].marks;
          score = score + result.result[i].marks;
        }

        await runSqlQueryAsyncInsert(
          "INSERT INTO cv_assessment_solution (user_id,assessment_id,que_id,sub_id,st_ans,visit,marks) values(?,?,?,?,?,?,?)",
          [
            params.user_id,
            params.assessment_id,
            result.result[i].que_id,
            result.result[i].sub_id,
            userAns[result.result[i].que_id].st_ans,
            userAns[result.result[i].que_id].visit,
            marks
          ]
        );
      }
      resolve(score);
    });
  }).then((score) => {
    return runSqlQueryAsyncInsert(
      "INSERT INTO cv_assessment_result values(?,?,?,?,?,?)",
      [params.user_id, params.sch_id, params.assessment_id, score, "0", "0"]
    )
      .then(() => {
        return runSqlQueryAsyncSelect(
          "SELECT DISTINCT caq.sub_id, cs.sub_name ,(select sum(marks) from cv_assessment_question as caqq WHERE assessment_id=? and caq.sub_id=caqq.sub_id) as max_marks, (select  sum(cas.marks) from cv_assessment_solution as cas where cas.sub_id=caq.sub_id and cas.assessment_id=caq.assessment_id and cas.user_id=?) as obtain_marks FROM `cv_assessment_question` as caq, cv_subjects as cs WHERE caq.assessment_id=? AND cs.sub_id=caq.sub_id",
          [params.assessment_id, params.user_id, params.assessment_id]
        ).then((result) => {
          for (var i = 0; i < result.result.length; i++) {
            return runSqlQueryAsyncInsert(
              "INSERT INTO cv_assessment_marks values(?,?,?,?,?)",
              [
                params.user_id,
                params.sch_id,
                params.assessment_id,
                result.result[i].sub_id,
                result.result[i].obtain_marks
              ]
            );
          }
        });
      })
      .then(() => {
        res.json({
          exam: "done",
          score: score,
          totMarks: assessmentMarks
        });
      });
  });
});

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
  if (params.que_type == "obj_type") {
    pool.query(
      "INSERT INTO cv_questions (sub_id,question,question_img, opt1,opt1_img,opt2,opt2_img,opt3,opt3_img,opt4,opt4_img,true_ans,sch_id,status, for_grade) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ",
      [
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
        params.queForGrade
      ],
      function(err, result, fields) {
        if (err) {
          //console.log("error");
          throw err;
        } else {
          //console.log(result);
          res.json({
            status: "200",
            data: "done"
          });
        }
      }
    );
  } else if (params.que_type == "subj_type") {
    pool.query(
      "INSERT INTO cv_questions (sub_id,question,question_img,sch_id,status,for_grade) values(?,?,?,?,?,?) ",
      [
        params.sub_id,
        params.question,
        que_img,
        params.sch_id,
        0,
        params.queForGrade
      ],
      function(err, result, fields) {
        if (err) {
          //console.log("error");
          throw err;
        } else {
          //console.log(result);
          res.json({
            status: "200",
            data: "done"
          });
        }
      }
    );
  }
});

router.post("/Subject_questions", (req, res) => {
  var params = req.body;
  if (params.search_for != "") {
    pool.query(
      "SELECT * FROM cv_questions where sub_id=? and sch_id=? and question LIKE '%" +
        params.search_for +
        "%'  ORDER BY que_id DESC",
      [params.sub_id, params.sch_id],
      function(err, result, fields) {
        if (err) {
          //console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            all_questions: result
          });
        }
      }
    );
  } else if (params.sub_id != "") {
    pool.query(
      "SELECT * FROM cv_questions where sub_id=? and sch_id=? ORDER BY que_id DESC",
      [params.sub_id, params.sch_id],
      function(err, result, fields) {
        if (err) {
          //console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            all_questions: result
          });
        }
      }
    );
  } else {
    pool.query(
      "SELECT * FROM cv_questions where sch_id=?  ORDER BY sub_id ASC",
      [params.sch_id],
      function(err, result, fields) {
        if (err) {
          //console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            all_questions: result
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
      params.sub_id
    ],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.json({
          status: "200",
          data: "done"
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
                      asmnt_que: result2
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
              params.questions[i].marks
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
              params.questions[i].que_id
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
          status: "200"
        });
      }
    }
  );
});

router.post("/Assessment_students", (req, res) => {
  var params = req.body;

  if (params.asmntType && params.asmntType == 2 && params.assessment_id) {
    pool.query(
      "SELECT cu.user_id, cu.name,(select score from cv_assessment_result as car where car.user_id=cu.user_id and car.assessment_id=ca.assessment_id) as score, (select count(user_id) from cv_assessment_exam_time as caet where caet.user_id=cu.user_id and caet.assessment_id=ca.assessment_id) as exam_status, ca.sch_id FROM cv_users as cu, cv_assessments as ca WHERE cu.user_id and cu.role_id=ca.role_id and cu.sch_id=? and ca.assessment_id=?",
      [params.sch_id, params.assessment_id],
      function(err, result, fields) {
        if (err) {
          //console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            students: result
          });
        }
      }
    );
  } else {
    pool.query(
      "SELECT cu.user_id, cu.name,cu.email, cc.cls_name, cs.sec_name,cs.sec_id,(select score from cv_assessment_result as car where car.user_id=cst.user_id and car.assessment_id=ca.assessment_id) as score, (select cls_rank from cv_assessment_result as car where car.user_id=cst.user_id and car.assessment_id=ca.assessment_id) as cls_rank,(select sec_rank from cv_assessment_result as car where car.user_id=cst.user_id and car.assessment_id=ca.assessment_id) as sec_rank, (select count(user_id) from cv_assessment_exam_time as caet where caet.user_id=cst.user_id and caet.assessment_id=ca.assessment_id) as exam_status, ca.sch_id FROM `cv_st_detail` as cst, cv_sections as cs, cv_classes as cc, cv_users as cu, cv_assessments as ca WHERE cst.user_id=cu.user_id and cst.cls_id=? and cs.sec_id=cst.sec_id and cst.cls_id=cc.cls_id and cu.sch_id=?  and ca.assessment_id =?",
      [params.cls_id, params.sch_id, params.assessment_id],
      function(err, result, fields) {
        if (err) {
          //console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            students: result
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
          students_detail: result
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
          params.obtain_marks[i].que_id
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
      data: "done"
    });
  }
});

router.post("/Assessment_result", (req, res) => {
  var params = req.body;
  pool.query(
    "SELECT DISTINCT caq.sub_id, cs.sub_name ,(select sum(marks) from cv_assessment_question as caqq WHERE assessment_id=? and caq.sub_id=caqq.sub_id) as max_marks, (select  sum(cae.marks) from cv_assessment_exam as cae where cae.sub_id=caq.sub_id and cae.assessment_id=caq.assessment_id and cae.user_id=?) as obtain_marks FROM `cv_assessment_question` as caq, cv_subjects as cs WHERE caq.assessment_id=? AND cs.sub_id=caq.sub_id",
    [params.assessment_id, params.user_id, params.assessment_id],
    function(err, result, fields) {
      if (err) {
        throw err;
      } else {
        var score = 0;
        for (var i = 0; i < result.length; i++) {
          pool.query(
            "INSERT INTO cv_assessment_marks values(?,?,?,?,?) ",
            [
              params.user_id,
              params.sch_id,
              params.assessment_id,
              result[i].sub_id,
              result[i].obtain_marks
            ],
            function(err, result1, fields) {
              if (err) {
                throw err;
              } else {
              }
            }
          );
          score = score + result[i].obtain_marks;
        }
        if (i == result.length) {
          pool.query(
            "INSERT INTO cv_assessment_result values(?,?,?,?,?,?) ",
            [
              params.user_id,
              params.sch_id,
              params.assessment_id,
              score,
              "0",
              "0"
            ],
            function(err, result2, fields) {
              if (err) {
                throw err;
              } else {
                class_rank(params);
                section_rank(params);
                move_data(params);

                res.json({
                  status: "200",
                  data: "done"
                });
              }
            }
          );
        }
      }
    }
  );
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
  pool.query(
    "INSERT INTO cv_assessment_solution (user_id,assessment_id,que_id,sub_id,st_ans,visit,marks) SELECT user_id,assessment_id,que_id,sub_id,st_ans,visit,marks FROM cv_assessment_exam WHERE user_id=? and assessment_id=?",
    [params.user_id, params.assessment_id],
    function(err, result, fields) {
      if (err) {
        //console.log("error");
        throw err;
      } else {
        pool.query(
          "DELETE From cv_assessment_exam WHERE user_id=? and assessment_id=?",
          [params.user_id, params.assessment_id],
          function(err, result1, fields) {
            if (err) {
              //console.log("error");
              throw err;
            } else {
            }
          }
        );
      }
    }
  );
}

router.post("/Get_assessment_marks", (req, res) => {
  var params = req.body;
  if (params.marks_type == "comb_marks") {
    pool.query(
      "SELECT ca.assessment_id,ca.assessment_name,ca.tot_marks, car.score as obtained_marks, car.sec_rank, car.cls_rank, (SELECT round(avg(score)) from cv_assessment_result as carr WHERE carr.assessment_id=ca.assessment_id and carr.sch_id=cafs.sch_id) as avg_marks, (select count(user_id) from cv_st_detail as csd where csd.sch_id=cafs.sch_id and csd.cls_id=cafs.cls_id) as tot_cls_st,(select count(user_id) from cv_st_detail as csdd where csdd.sch_id=cafs.sch_id and csdd.cls_id=cafs.cls_id and csdd.sec_id=?) as tot_sec_st FROM `cv_assessments` as ca, cv_assessment_for_school as cafs, cv_assessment_result as car where ca.sch_id=0 and ca.assessment_id=cafs.assessment_id and cafs.sch_id=? and cafs.cls_id=? and ca.assessment_id=car.assessment_id and cafs.sch_id=car.sch_id and car.user_id=?",
      [params.sec_id, params.sch_id, params.cls_id, params.user_id],
      function(err, result, fields) {
        if (err) {
          //console.log("error");
          throw err;
        } else {
          res.json({
            status: "200",
            students_marks: result
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
              params.user_id
            ],
            function(err, result1, fields) {
              if (err) {
                //console.log("error");
                throw err;
              } else {
                res.json({
                  status: "200",
                  students_marks: result,
                  students_score: result1
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
                students_score: result1
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
          data: "done"
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
            data: "done"
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
            data: "done"
          });
        }
      }
    );
  }
});

//payment router details
router.post("/beginTransactionProcess", (req, res) => {
  let params = req.body;
  var productInfo = null;
  return new Promise(async function(resolve, reject) {
    return generateOrder(
      params.user_id,
      0,
      params.payment_details[0].totalPrice,
      params.user_email,
      params.user_contact,
      0
    ).then((newOrderId) => {
      for (var i = 0; i < params.products.length; i++) {
        runSqlQueryAsyncInsert(
          "INSERT INTO order_details (package_id,product_id, order_id) values(?,?,?)",
          [
            params.payment_details[0].package_id,
            params.products[i].product_id,
            newOrderId
          ]
        );
      }
      var requestHash = getPayURequestHash({
        order_id: newOrderId,
        amount: params.payment_details[0].totalPrice,
        product_info: params.payment_details[0].package_name, //productInfo.name,
        first_name: params.user_full_name.split(" ")[0],
        email: params.user_email
      });

      res.send(
        JSON.stringify({
          transaction_data: {
            key: payUKey,
            id: newOrderId,
            hash: requestHash,
            amount: params.payment_details[0].totalPrice,
            first_name: params.user_full_name.split(" ")[0],
            email: params.user_email,
            phone: params.user_contact,
            product_info: params.payment_details[0].package_name //productInfo.name
          }
        })
      );
    });
  });
});

async function generateOrder(
  userId,
  productId,
  price,
  email,
  phone,
  coupon_id
) {
  var lastOrderId = 0;
  var newOrderId = 0;

  var conn;

  return db.getConnection().then((connection) => {
    conn = connection;
    return new Promise(function(resolve, reject) {
      conn.beginTransaction(function(err) {
        if (err) {
          conn.release();
          throw err;
        }
        conn.query(
          "select order_id from orders order by order_id desc limit 1",
          function(err, data) {
            if (err) {
              return conn.rollback(function() {
                conn.release();
                throw err;
              });
            } else {
              if (!data.length) {
                lastOrderId = 12789;
              } else {
                lastOrderId = data[0].order_id;
              }
              newOrderId = lastOrderId + 1;
              conn.query(
                "insert into orders (`product_id`, `user_id`, `order_id`, `price`,`email`,`contact_no`,`coupon_id`) values(?,?,?,?,?,?,?) ",
                [productId, userId, newOrderId, price, email, phone, coupon_id],
                function(err, data) {
                  if (err) {
                  } else {
                    conn.commit(function(err) {
                      if (err) {
                        return conn.rollback(function() {
                          conn.release();
                          throw err;
                        });
                      } else {
                        conn.release();
                        resolve(newOrderId);
                      }
                    });
                  }
                }
              );
            }
          }
        );
      });
    });
  });
}

function getPayURequestHash(data) {
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
function getPayUResponseHash(data) {
  var hashSequence = String(
    payUSalt +
      "|" +
      data.status +
      "||||||" +
      data.udf5 +
      "|" +
      data.udf4 +
      "|" +
      data.udf3 +
      "|" +
      data.udf2 +
      "|" +
      data.udf1 +
      "|" +
      data.email +
      "|" +
      data.firstname +
      "|" +
      data.productinfo +
      "|" +
      data.amount +
      "|" +
      data.txnid +
      "|" +
      payUKey
  );
  var hash = crypto.createHash("sha512");
  hash.update(hashSequence);
  return hash.digest("hex");
}

const cors = require("cors");
var corsOptions = {
  origin: "http://localhost:8080",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

router.options("/assessmentPaymentSuccessful", cors(corsOptions));

router.post("/assessmentPaymentSuccessful", cors(corsOptions), function(
  req,
  res
) {
  if (!req.rawBody && !req.body) {
    res.end();
    return;
  }
  var paymentInfo = new Object();
  if (req.rawBody) {
    // This block will be reached when payment is verified by PayU servers.
    let params = JSON.parse(req.rawBody);

    // console.log("server");
    //   console.log(params);
    paymentInfo.name = params.customerName;
    paymentInfo.email = params.customerEmail;
    paymentInfo.phone = params.customerPhone;
    paymentInfo.productInfo = params.productInfo;
    paymentInfo.amount = params.amount;
    paymentInfo.transactionId = params.merchantTransactionId;
    paymentInfo.hash = params.hash;
  } else {
    // This block will be reached when payment is verified from the browser.
    let params = req.body;
    // console.log("Client");
    // console.log(params);
    paymentInfo.name = params.firstname;
    paymentInfo.email = params.email;
    paymentInfo.phone = params.phone;
    paymentInfo.productInfo = params.productinfo;
    paymentInfo.amount = params.amount;
    paymentInfo.transactionId = params.txnid;
    paymentInfo.hash = params.hash;
  }

  let rhash = getPayUResponseHash({
    status: "success",
    udf5: "",
    udf4: "",
    udf3: "",
    udf2: "",
    udf1: "",
    email: paymentInfo.email,
    firstname: paymentInfo.name,
    productinfo: paymentInfo.productInfo,
    amount: paymentInfo.amount,
    txnid: paymentInfo.transactionId
  });

  if (rhash != paymentInfo.hash) {
    res.status(400).end();
    return;
  }
  var someInfo = "";

  return runSqlQueryAsyncSelect(
    "SELECT orders.id,orders.status,orders.product_id,orders.price,orders.email,orders.order_id,orders.contact_no,cv_users.name,cv_users.address,cv_users.city,cv_users.state,cv_users.contact 'user_contact', DATE_FORMAT(orders.purchased_at, '%W %D %M %Y') 'purachsed_at'  from orders left join cv_users on orders.user_id = cv_users.user_id left join products on orders.product_id = products.product_id left join quiz on quiz.product_id =products.product_id left join books on books.product_id = products.product_id where orders.order_id=?",
    [paymentInfo.transactionId]
  )
    .then(function(result) {
      if (result.err) {
        throw new Error("order_not_found");
      } else if (result.result.length && result.result[0].status == 1) {
        throw new Error("order_already_verified");
      } else {
        someInfo = result.result[0];
      }
    })
    .then(() => {
      return runSqlQueryAsyncUpdate(
        "update orders set status=1, email=?, contact_no=? where order_id=?",
        [paymentInfo.email, paymentInfo.phone, paymentInfo.transactionId]
      );
    })
    .then((result) => {
      try {
        return runSqlQueryAsyncSelect(
          "select o.order_id, pp.*   from orders as o,product_packages as pp  where pp.package_id = (SELECT DISTINCT od.package_id from order_details as od where od.order_id =o.order_id)  and o.status=1 and o.email=? and  o.contact_no=? and order_id=?",
          [paymentInfo.email, paymentInfo.phone, paymentInfo.transactionId]
        ).then(function(result3) {
          var product_name = result3.result[0].package_name;
          var subTotal = result3.result[0].price;
          var discountPrice = Math.ceil(
            (result3.result[0].price * result3.result[0].discount) / 100
          );
          var totalPrice = subTotal - discountPrice;
          var product_type = result3.result[0].used_for;

          /****Invoice */
          let BillTo = {
            name: paymentInfo.name,
            email: paymentInfo.email,
            address: someInfo.address,
            city: someInfo.city,
            state: someInfo.state,
            phone: paymentInfo.phone
          };

          let Invoice = {
            id: paymentInfo.transactionId,
            date: someInfo.purachsed_at,
            totalPrice: totalPrice
          };

          let Products = [
            {
              name: product_name,
              subTotal: subTotal,
              discountPrice: discountPrice,
              totalPrice: totalPrice
            }
          ];

          res.render(
            "assessmentInvoice",
            {
              BillTo: BillTo,
              Products: Products,
              Invoice: Invoice
            },

            async (err, data) => {
              if (err) {
                res.send(err);
              } else {
                let options = {
                  format: "A4",
                  orientation: "portrait",
                  header: {
                    height: "5mm"
                  },
                  footer: {
                    height: "5mm"
                  }
                };

                pdf.create(data, options).toBuffer(function(err, buffer) {
                  setorderMessage(
                    paymentInfo.transactionId,
                    paymentInfo.email,
                    product_name,
                    subTotal,
                    discountPrice,
                    totalPrice,
                    someInfo.purachsed_at,
                    new mailgun.Attachment({
                      data: buffer,
                      filename: "invoice.pdf"
                    })
                  );
                });
              }
            }
          );

          /********End Invoice */

          sendCongratulationMail(product_name, paymentInfo.email);
          sendAdminMail(
            paymentInfo.transactionId,
            paymentInfo.name,
            paymentInfo.email,
            product_name,
            product_type,
            paymentInfo.amount,
            someInfo.address,
            someInfo.city,
            someInfo.state,
            paymentInfo.phone,
            someInfo.purachsed_at
          );
        });
      } catch (e) {
        // We catch the error here because we don't consider this a "fatal" error.
        // Order should complete even without successful sending of email.
        // console.log("i am error");
        console.log(e);
      }
    })
    .then(() => {
      res.end();
    })
    .catch((err) => {
      console.log(err);
      res.status(200).end();
    });
});

function sendCongratulationMail(product_name, email) {
  const data = {
    from: "Codevidhya <contact@codevidhya.com>",
    to: email,
    subject: "Thanks for purchasing Codevidhya Certified Teacher Assessment",
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
                          <td align="center" style="padding:0;Margin:0;"><img class="adapt-img" src="https://codevidhya.com/socialshare/congratulation_mail/welcomecertified.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="560"></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="left" style="padding:0;Margin:0;padding-left:40px;padding-right:40px;">
                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                              Hello ,
                            </p>
                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                              Welcome to Codevidhya! 
                            </p>
                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                              We are so thrilled that you decided to take up this Assessment. To give your career a boost. Hats off on 
                              making an excellent decision. To attempt the Codevidhya Certified Teacher Assessment chosen by you,
                              Log on to www.codevidhya.com.  
                            </p>
                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                              To explore the world of Digital Learning and Innovation explore our Self Online Courses 
                            </p>
                            
                          </td>
                          <td>
                            <a href="https://codevidhya.com/courses" traget="_new"><img class="adapt-img" src="https://codevidhya.com/socialshare/congratulation_mail/courses123.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="560"></a>
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
                      <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="center" style="padding:0;margin:0;"><a href="https://codevidhya.com/in-media" traget="_new"><img class="adapt-img" src="https://codevidhya.com/socialshare/congratulation_mail/79221579249313822.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="560"></a></td> 
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
                       </table></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
               </table></td> 
             </tr> 
           </table></td> 
         </tr> 
       </table> 
      </div>  
     </body>
    </html>
    `
  };
  return mailgun.messages().send(data);
}

function setorderMessage(
  orderId,
  email,
  productName,
  subTotal,
  discountPrice,
  totalPrice,
  purachsed_at,
  attachmentBuffer
) {
  const data = {
    from: "Codevidhya <contact@codevidhya.com>",
    to: email,
    attachment: attachmentBuffer,
    subject: "Codevidhya - Your order has been received!",
    html: `<!doctype html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        
        <head>
          <title> </title>
          <!--[if !mso]><!-- -->
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <!--<![endif]-->
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style type="text/css">
            #outlook a {
              padding: 0;
            }
        
            .ReadMsgBody {
              width: 100%;
            }
        
            .ExternalClass {
              width: 100%;
            }
        
            .ExternalClass * {
              line-height: 100%;
            }
        
            body {
              margin: 0;
              padding: 0;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
            }
        
            table,
            td {
              border-collapse: collapse;
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
            }
        
            img {
              border: 0;
              height: auto;
              line-height: 100%;
              outline: none;
              text-decoration: none;
              -ms-interpolation-mode: bicubic;
            }
        
            p {
              display: block;
              margin: 13px 0;
            }
          </style>
          <!--[if !mso]><!-->
          <style type="text/css">
            @media only screen and (max-width:480px) {
              @-ms-viewport {
                width: 320px;
              }
              @viewport {
                width: 320px;
              }
            }
          </style>
          <!--<![endif]-->
          <!--[if mso]>
                <xml>
                <o:OfficeDocumentSettings>
                  <o:AllowPNG/>
                  <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
          <!--[if lte mso 11]>
                <style type="text/css">
                  .outlook-group-fix { width:100% !important; }
                </style>
                <![endif]-->
          <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
          <style type="text/css">
            @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
          </style>
          <!--<![endif]-->
          <style type="text/css">
            @media only screen and (min-width:480px) {
              .mj-column-per-85 {
                width: 85% !important;
                max-width: 85%;
              }
            }
          </style>
          <style type="text/css">
            @media only screen and (max-width:480px) {
              table.full-width-mobile {
                width: 100% !important;
              }
              td.full-width-mobile {
                width: auto !important;
              }
            }
          </style>
        </head>
        
        <body style="background-color:#f1f1f1;">
          <div style="background-color:#f1f1f1;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
              <tbody>
                <tr>
                  <td>
                    <!--[if mso | IE]>
              <table
                 align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
              >
                <tr>
                  <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
              <![endif]-->
                    <div style="Margin:0px auto;max-width:600px;">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                        <tbody>
                          <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;text-align:center;vertical-align:top;">
                              <!--[if mso | IE]>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        
                <tr>
              
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                                  <tr>
                                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                        <tbody>
                                          <tr>
                                            <td style="width:180px;"> <img alt="" height="48" src="https://codevidhya.com/socialshare/mail/new-logo-codevidhya2_wgmrmo.png" style="border:0;display:block;outline:none;text-decoration:none;height:48px;width:100%;" width="180" />                                      </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  
                </tr>
              
                          </table>
                        <![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]>
                  </td>
                </tr>
              </table>
              <![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
              <tbody>
                <tr>
                  <td>
                    <!--[if mso | IE]>
              <table
                 align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
              >
                <tr>
                  <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
              <![endif]-->
                    <div style="Margin:0px auto;max-width:600px;">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                        <tbody>
                          <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                              <!--[if mso | IE]>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        
                <tr>
              
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                                  <tr>
                                    <td align="center" style="font-size:0px;padding:3px 3px;word-break:break-word;">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                        <tbody>
                                          <tr>
                                            <td style="width:50px;"> <img height="50" src="https://codevidhya.com/socialshare/mail/verified.jpg" style="border:0;display:block;outline:none;text-decoration:none;height:50px;width:100%;" width="50" /> </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="center" style="font-size:0px;padding:10px 25px;padding-top:10px;padding-bottom:10px;word-break:break-word;">
                                      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:14px;line-height:1;text-align:center;color:#45474e;"> <span style="font-size: 26px; line-height: 30px;">Payment Received</span> </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="center" style="font-size:0px;padding:10px 25px;padding-top:10px;word-break:break-word;">
                                      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:14px;line-height:1;text-align:center;color:#45474e;"> <span style="font-size: 14px; line-height: 20px;">We have received your payment of <span style="font-weight:600;">Rs. ${totalPrice}</span>.</span>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                      <p style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:85%;"> </p>
                                      <!--[if mso | IE]>
                <table
                   align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:383.5px;" role="presentation" width="383.5px"
                >
                  <tr>
                    <td style="height:0;line-height:0;">
                      &nbsp;
                    </td>
                  </tr>
                </table>
              <![endif]-->
                                    </td>
                                  </tr>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  
                </tr>
              
                          </table>
                        <![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]>
                  </td>
                </tr>
              </table>
              <![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
              <tbody>
                <tr>
                  <td>
                    <!--[if mso | IE]>
              <table
                 align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
              >
                <tr>
                  <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
              <![endif]-->
                    <div style="Margin:0px auto;max-width:600px;">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                        <tbody>
                          <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:0px;text-align:center;vertical-align:top;">
                              <!--[if mso | IE]>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        
                <tr>
              
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                                  <tr>
                                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#888888;">
                                        <p style="margin-right:10px;width:100%;display:flex;"> <span align="left" style="width:50%; min-width:50%; flex-grow:1;">Order Id</span> <span style="font-weight:600;">#${orderId}</span> </p>
                                        <p style="margin-right:10px;width:100%;display:flex;"> <span align="left" style="width:50%; min-width:50%; flex-grow:1;">Product Name</span> <span style="font-weight:600;">${productName}</span> </p>
                                        <p style="margin-right:10px;width:100%;display:flex;"> <span align="left" style="width:50%; min-width:50%; flex-grow:1;">Product Amount</span> <span style="font-weight:600;">Rs. ${subTotal}</span> </p>
                                        <p style="margin-right:10px;width:100%;display:flex;">
                                        <span align="left" style="width:50%; min-width:50%; flex-grow:1;">Discount</span> <span style="font-weight:600;">(-) Rs. ${discountPrice}</span> </p>
                                        <p style="margin-right:10px;width:100%;display:flex;"> <span align="left" style="width:50%; min-width:50%; flex-grow:1;">Paid Online<br>(including all taxes)*</span></span> <span style="font-weight:600;">Rs. ${totalPrice}</span> </p>
                                        <p style="margin-right:10px;width:100%;display:flex;"> <span align="left" style="width:50%; min-width:50%; flex-grow:1;">Payment Date</span> <span style="font-weight:600;">${purachsed_at}</span> </p>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  
                </tr>
              
                          </table>
                        <![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]>
                  </td>
                </tr>
              </table>
              <![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
              <tbody>
                <tr>
                  <td>
                    <!--[if mso | IE]>
              <table
                 align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
              >
                <tr>
                  <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
              <![endif]-->
                    <div style="Margin:0px auto;max-width:600px;">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                        <tbody>
                          <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-top:0px;text-align:center;vertical-align:top;">
                              <!--[if mso | IE]>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        
                <tr>
              
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                                  <tr>
                                    <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                      <p style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:85%;"> </p>
                                      <!--[if mso | IE]>
                <table
                   align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:383.5px;" role="presentation" width="383.5px"
                >
                  <tr>
                    <td style="height:0;line-height:0;">
                      &nbsp;
                    </td>
                  </tr>
                </table>
              <![endif]-->
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:center;color:#888888;">
                                        <p style="color: #888;"> Need Assistance? Feel free to reach out at <a href="mailto:contact@codevidhya.com"><span style="color: #555; font-weight:600;text-decoration:none;"> contact@codevidhya.com </span></a> </p>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  
                </tr>
              
                          </table>
                        <![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]>
                  </td>
                </tr>
              </table>
              <![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
              <tbody>
                <tr>
                  <td>
                    <!--[if mso | IE]>
              <table
                 align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
              >
                <tr>
                  <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
              <![endif]-->
                    <div style="Margin:0px auto;max-width:600px;">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                        <tbody>
                          <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:10px;text-align:center;vertical-align:top;">
                              <!--[if mso | IE]>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        
                <tr>
              
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                                  <tr>
                                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:center;color:#000000;">
                                        <p style="color: #888; font-size:13px;line-height:20px;">Codevidhya India Private Limited | <a style="text-decoration:none;" href="https://codevidhya.com" target="_blank">www.codevidhya.com </a><br> We are Social- <a style="text-decoration:none;font-weight:600;" href="https://www.facebook.com/codevidhya"
                                            target="_blank"> Facebook </a>| <a style="text-decoration:none;font-weight:600;" href="https://www.twitter.com/codevidhya" target="_blank"> Twitter</a> | <a style="text-decoration:none;font-weight:600;" href="https://www.instagram.com/codevidhya"
                                            target="_blank"> Instagram </a>| <a style="text-decoration:none;font-weight:600;" href="https://www.linkedin.com/company/codevidhya" target="_blank"> Linkedin  </a></p>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  
                </tr>
              
                          </table>
                        <![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]>
                  </td>
                </tr>
              </table>
              <![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </body>
        
        </html>`
  };
  return mailgun.messages().send(data);
}

function sendAdminMail(
  orderId,
  name,
  email,
  productName,
  productType,
  price,
  address,
  city,
  state,
  user_contact,
  purachsed_at
) {
  const data = {
    from: "Codevidhya <contact@codevidhya.com>",
    to: "contact@codevidhya.com",
    subject: "New Order Received",
    html: `<!doctype html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        
        <head>
          <title> </title>
          <!--[if !mso]><!-- -->
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <!--<![endif]-->
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style type="text/css">
            #outlook a {
              padding: 0;
            }
        
            .ReadMsgBody {
              width: 100%;
            }
        
            .ExternalClass {
              width: 100%;
            }
        
            .ExternalClass * {
              line-height: 100%;
            }
        
            body {
              margin: 0;
              padding: 0;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
            }
        
            table,
            td {
              border-collapse: collapse;
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
            }
        
            img {
              border: 0;
              height: auto;
              line-height: 100%;
              outline: none;
              text-decoration: none;
              -ms-interpolation-mode: bicubic;
            }
        
            p {
              display: block;
              margin: 13px 0;
            }
          </style>
          <!--[if !mso]><!-->
          <style type="text/css">
            @media only screen and (max-width:480px) {
              @-ms-viewport {
                width: 320px;
              }
              @viewport {
                width: 320px;
              }
            }
          </style>
          <!--<![endif]-->
          <!--[if mso]>
                <xml>
                <o:OfficeDocumentSettings>
                  <o:AllowPNG/>
                  <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
          <!--[if lte mso 11]>
                <style type="text/css">
                  .outlook-group-fix { width:100% !important; }
                </style>
                <![endif]-->
          <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
          <style type="text/css">
            @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
          </style>
          <!--<![endif]-->
          <style type="text/css">
            @media only screen and (min-width:480px) {
              .mj-column-per-85 {
                width: 85% !important;
                max-width: 85%;
              }
            }
          </style>
          <style type="text/css">
            @media only screen and (max-width:480px) {
              table.full-width-mobile {
                width: 100% !important;
              }
              td.full-width-mobile {
                width: auto !important;
              }
            }
          </style>
        </head>
        
        <body style="background-color:#f1f1f1;">
          <div style="background-color:#f1f1f1;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#f1f1f1;background-color:#f1f1f1;width:100%;">
              <tbody>
                <tr>
                  <td>
                    <!--[if mso | IE]>
              <table
                 align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
              >
                <tr>
                  <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
              <![endif]-->
                    <div style="Margin:0px auto;max-width:600px;">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                        <tbody>
                          <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                              <!--[if mso | IE]>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        
                <tr>
              
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                  <tbody>
                                    <tr>
                                      <td style="vertical-align:middle;padding:10px 10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                          <tr>
                                            <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                                <tbody>
                                                  <tr>
                                                    <td style="width:180px;"> <img height="48" src="https://codevidhya.com/socialshare/mail/new-logo-codevidhya2_wgmrmo.png" style="border:0;display:block;outline:none;text-decoration:none;height:48px;width:100%;" width="180" />                                              </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  <![endif]-->
                              <!-- row 2 -->
                              <!--[if mso | IE]>
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                  <tbody>
                                    <tr>
                                      <td style="background-color:#ffffff;vertical-align:middle;padding-top:15px;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <h2 align="center" style="color:#2E4053;">New Order Received </h2>
                                                <p align="center" style="color: #888;font-size:14px; line-height:20px;"> You have received a new order from <b>${name}.</b></p>
                                              </div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <p style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:100%;"> </p>
                                              <!--[if mso | IE]>
                <table
                   align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:460px;" role="presentation" width="460px"
                >
                  <tr>
                    <td style="height:0;line-height:0;">
                      &nbsp;
                    </td>
                  </tr>
                </table>
              <![endif]-->
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <p align="center" style="letter-spacing:2"><b>ORDER DETAILS </b></p>
                                              </div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <div style="display:flex;flex-direction:row;"> <span style="color: #888; font-size:13px; flex-grow:1; line-height:30px">Order Id</span> <span align="right" style="color: #555; font-size:13px; line-height:30px;"> <b> #${orderId}</b></span> </div>
                                                <div style="display:flex;flex-direction:row;">
                                                <span style="color: #888; font-size:13px; flex-grow:1; line-height:25px;">Product Name </span> <span style="color: #555; font-size:13px;line-height:25px;"> <b> ${productName}</b></span> </div>
                                                <div style="display:flex;flex-direction:row;">
                                                <span style="color: #888; font-size:13px; flex-grow:1; line-height:20px;">Payment Amount <br/>(including all taxes)*</span> <span style="color: #555; font-size:13px;line-height:25px;"><b>Rs. ${price}</b></span> </div>
                                                <div style="display:flex;flex-direction:row;">
                                                <span style="color: #888; font-size:13px; flex-grow:1; line-height:25px;">Paid Online </span> <span style="color: #555; font-size:13px;line-height:25px;"> <b>Rs. ${price}</b></span> </div>
                                                <div style="display:flex;flex-direction:row;">
                                                <span style="color: #888; font-size:13px; flex-grow:1; line-height:25px;">Payment Date </span> <span style="color: #555; font-size:13px;line-height:25px;"> <b>${purachsed_at}</b></span> </div>
                                                <div style="display:flex;flex-direction:row;">
                                                <span style="color: #888; font-size:13px; flex-grow:1; line-height:25px;">Payment Status </span> <span style="color: #555; font-size:13px;line-height:25px; background:#0077ff;padding:1px 10px; border-radius:3px; color:#fff;"> <b>Success</b></span>                                          </div>
                                              </div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <p style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:100%;"> </p>
                                              <!--[if mso | IE]>
                <table
                   align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:460px;" role="presentation" width="460px"
                >
                  <tr>
                    <td style="height:0;line-height:0;">
                      &nbsp;
                    </td>
                  </tr>
                </table>
              <![endif]-->
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <p align="center" style="letter-spacing:2"><b>CUSTOMER DETAILS </b></p>
                                              </div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <div style="display:flex;flex-direction:row;"> <span style="color: #888; font-size:13px; flex-grow:1; line-height:30px">Customer Name</span> <span style="color: #555; font-size:13px; line-height:30px;"><b> ${name}</b></span> </div>
                                                <div style="display:flex;flex-direction:row;">
                                                <span style="color: #888; font-size:13px; flex-grow:1; line-height:25px;">Contact Number</span> <span style="color: #555; font-size:13px;line-height:25px;"><b> ${user_contact}</b></span> </div>
                                                <div style="display:flex;flex-direction:row;">
                                                <span style="color: #888; font-size:13px; flex-grow:1; line-height:20px;">Email Address</span> <span style="color: #555; font-size:13px;line-height:25px;"><b>${email}</b></span> </div>
                                              </div>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  <![endif]-->
                              <!-- row 3 -->
                              <!--[if mso | IE]>
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                  <tbody>
                                    <tr>
                                      <td style="vertical-align:middle;padding-top:0px;padding-bottom:10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <p align="center" style="color: #888; font-size:13px;line-height:20px;">Codevidhya India Private Limited | <a href="https://codevidhya.com" style="text-decoration:none;" target="_blank">www.codevidhya.com </a><br> We are Social- <b>
              <a style="text-decoration:none;"  href="https://www.facebook.com/codevidhya" target="_blank"> Facebook </a>|
              <a style="text-decoration:none;" href="https://www.twitter.com/codevidhya" target="_blank"> Twitter</a> | 
              <a style="text-decoration:none;" href="https://www.instagram.com/codevidhya" target="_blank"> Instagram </a>|
              <a style="text-decoration:none;" href="https://www.linkedin.com/company/codevidhya" target="_blank"> Linkedin </b> </a>
                                                </p>
                                              </div>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  
                </tr>
              
                          </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]>
                  </td>
                </tr>
              </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </body>
        </html>`
  };
  return mailgun.messages().send(data);
}
module.exports = router;
