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

var ProfilePicStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.resolve(appRoot + "/public/static/profiles/"));
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

router.post("/saveNotifications", (req, res, next) => {
  var params = req.body;
  return new Promise(async function(resolve, reject) {
    return runSqlQueryAsyncInsert(
      "INSERT INTO cv_notifications (title,message,type,status,sch_id) values(?,?,?,?,?)",
      [
        params.notification[0].title,
        params.notification[0].message,
        params.notification[0].type,
        1,
        params.sch_id
      ]
    )
      .then(result => {
        if (result.result.insertId) {
          res.json({
            success: 1
          });
        }
      })
      .catch(err => {
        res.status(400).end();
      });
  });
});

router.post("/sendAdminNotifcation",(req,res)=>{
let params =req.body;
return new Promise(async function(resolve,reject){
 return runSqlQueryAsyncInsert("INSERT INTO cv_notifications (title,message,type,status,sch_id,file_name,file_type,	for_all) values(?,?,?,?,?,?,?,?)",
 [params.notification[0].title,params.notification[0].message,params.notification[0].type,1,params.notification[0].sch_id,params.notification[0].filename,params.notification[0].filetype,1]).then(result=>{
  res.send(result);
})

});
});
router.post("/getStudentVideoNotification",(req,res)=>{
  var params =req.body;
 
  pool.query("SELECT * FROM `cv_notifications` WHERE  cv_notifications.status=1 and cv_notifications.type='video' and cv_notifications.sch_id in (SELECT sch_id from cv_users where user_id=?) and cv_notifications.noti_id not in (SELECT cv_notification_status.noti_id from cv_notification_status where cv_notification_status.user_id=? and cv_notification_status.status=1) ORDER by cv_notifications.noti_id desc limit 1",
  [params.user_id,params.user_id],function(err,data){
    //console.log(data);
    res.send(data);
  });
 });
router.post("/readNotification",(req,res)=>{
  var params =req.body;
  pool.query(
    "INSERT INTO `cv_notification_status`(`noti_id`, `user_id`, `status`) VALUES (?,?,?)",
    [params.noti_id,params.user_id,1],function(err,data){
      res.send(data);
    }
  );

});
router.post("/sendNotifications", (req, res, next) => {
  var params = req.body;
  return new Promise(async function(resolve, reject) {
    if (params.selectedGrades.length && params.role_id == 3) {
      for (var i = 0; i < params.selectedGrades.length; i++) {
        var result = await runSqlQueryAsyncInsert(
          "INSERT INTO cv_notification_for (noti_id, sch_id, cls_id, sec_id,role_id) values(?,?,?,?,?)",
          [
            params.noti_id,
            params.sch_id,
            params.selectedGrades[i].cls_id,
            params.selectedGrades[i].sec_id,
            params.role_id
          ]
        );
      }
    } else {
      var result = await runSqlQueryAsyncInsert(
        "INSERT INTO cv_notification_for (noti_id, sch_id, cls_id, sec_id,role_id) values(?,?,?,?,?)",
        [params.noti_id, params.sch_id, 0, 0, params.role_id]
      );
    }
    resolve();
  })
    .then(result => {
      res.json({
        success: 1
      });
    })
    .catch(err => {
      res.status(400).end();
    });
});
router.post("/displayAllNotifications", (req, res) => {
  var params = req.body;
  return runSqlQueryAsyncSelect(
    "SELECT * FROM cv_notifications where status=1 and sch_id=?",
    [params.sch_id]
  )
    .then(result => {
      res.json({
        notifications: result.result
      });
    })
    .catch(error => {});
});

router.post("/userNotifications", (req, res) => {
  var params = req.body;
  return runSqlQueryAsyncSelect(
    "SELECT cn.noti_id, cn.title, cn.type, cn.message, cns.user_id, cns.status FROM cv_notifications as cn INNER JOIN cv_notification_for as cnf ON cn.noti_id=cnf.noti_id left JOIN cv_notification_status as cns ON cnf.noti_id = cns.noti_id and cns.user_id=? where cn.status=1 and cnf.cls_id=? and (cnf.sec_id=? or cnf.sec_id=0)  and cnf.sch_id=? and cnf.role_id=?",
    [
      params.user_id,
      params.cls_id,
      params.sec_id,
      params.sch_id,
      params.role_id
    ]
  )
    .then(result => {
      res.json({
        notifications: result.result
      });
    })
    .catch(error => {});
});

router.post("/getunreadnotification",(req,res) =>{
 var params =req.body;
  return runSqlQueryAsyncSelect(
    "SELECT count(*) 'unread'  from cv_notifications inner join cv_notification_for on (cv_notification_for.noti_id =cv_notifications.noti_id) inner join cv_users on (cv_users.user_id=? and cv_users.sch_id =cv_notification_for.sch_id) left join cv_st_detail on (cv_st_detail.user_id = cv_users.user_id) where cv_notifications.status=1 and (case when cv_users.role_id=3 then cv_notification_for.cls_id=cv_st_detail.cls_id and cv_notification_for.sec_id=cv_st_detail.sec_id else cv_notification_for.cls_id=0 and cv_notification_for.sec_id=0 end) and cv_notifications.noti_id NOT in (SELECT cv_notification_status.noti_id from cv_notification_status where cv_notification_status.user_id=?) and cv_notification_for.role_id =cv_users.role_id",
    [params.user_id,params.user_id]
    ).then(data=>{
      if(data.err)
      throw data.err
      else
      res.send(data);
    })
});

router.post("/disableNotification", (req, res) => {
  var params = req.body;
  return runSqlQueryAsyncInsert(
    "Insert INTO  cv_notification_status (noti_id, user_id, status) values(?,?,?)",
    [params.noti_id, params.user_id, 1]
  )
    .then(result => {
      res.json({
        success: 1
      });
    })
    .catch(error => {});
});

module.exports = router;
