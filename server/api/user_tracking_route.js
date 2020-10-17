var express = require("express");
var router = express.Router();

const path = require("path");
var pathUtils = require("./path-utils");
const jwt = require("jsonwebtoken");
var fs = require("fs-extra");
var mkdirp = require("mkdirp");
var pool = require("../db").pool;
var dbUtils = require("./database-utils");
var UserTrack = require("./user_tracking_util");
/*******admin logs tracking */
/**********Overall Tracking */
router.post("/get_log_analysis_reports", (req, res) => {
  let query =
    "SELECT count(cv_users.user_id) 'total_users',(SELECT count(cv_users.user_id) from cv_users where cv_users.role_id=1 and cv_users.status =1) 'total_school',(SELECT count(cv_users.user_id) FROM cv_users WHERE cv_users.sch_id<>1 and cv_users.role_id =3 and cv_users.status =1 )'total_students',(SELECT count(cv_users.user_id) from cv_users where cv_users.sch_id=1 and role_id=3 and cv_users.status =1)'total_individual',(SELECT count(cv_users.user_id) from cv_users where cv_users.role_id=2 and cv_users.status =1) 'total_teachers' FROM `cv_users` where cv_users.status =1";
  //"SELECT count(cv_users.user_id) 'total_users',(SELECT count(cv_users.user_id) from cv_users where cv_users.role_id=1) 'total_school',(SELECT count(cv_users.user_id) FROM cv_users WHERE cv_users.sch_id<>1 and cv_users.role_id =3 )'total_students',(SELECT count(cv_users.user_id) from cv_users where cv_users.sch_id=1 and role_id=3)'total_individual',(SELECT count(cv_users.user_id) from cv_users where cv_users.role_id=2) 'total_teachers' FROM `cv_users`";
  let param = [];
  dbUtils.runSqlQueryAsyncSelect(query, param).then(data => {
    if (data.err) res.send(data.err);
    else res.send(data.result);
  });
});
router.post("/get_visted_rec", (req, res) => {
  let query =
    "SELECT count(*) 'total_users',(SELECT count(DISTINCT user_spent_time.user_id) from user_spent_time) 'online_users',(count(*)-(SELECT count(DISTINCT user_spent_time.user_id) from user_spent_time)) 'offine_users' from cv_users left join cv_school_detail on cv_users.sch_id =cv_school_detail.sch_id where cv_users.status=1";
  //"SELECT count(*) 'total_users',(SELECT count(DISTINCT user_spent_time.user_id) from user_spent_time) 'online_users',(count(*)-(SELECT count(DISTINCT user_spent_time.user_id) from user_spent_time)) 'offine_users' from cv_users left join cv_school_detail on cv_users.sch_id =cv_school_detail.sch_id";
  dbUtils.runSqlQueryAsyncSelect(query, []).then(data => {
    if (data.err) res.send(data.err);
    else res.send(data.result);
  });
});

router.post("/get_y_onlne_rec", (req, res) => {
  let params = req.body;
  let query =
    "SELECT t1.*,(t1.active_users - t1.online_users) 'offline_users' from (SELECT COUNT(DISTINCT user_spent_time.user_id) 'active_users',(SELECT COUNT(DISTINCT user_spent_time.user_id) from user_spent_time WHERE user_spent_time.user_status=1 and DATE_FORMAT(user_spent_time.login_time,'%Y') <= ?) 'online_users' from user_spent_time where DATE_FORMAT(user_spent_time.login_time,'%Y') <= ?)t1";
  let param = [params.year, params.year];
  dbUtils.runSqlQueryAsyncSelect(query, param).then(data => {
    if (data.err) res.send(data.err);
    else res.send(data.result);
  });
});

router.post("/get_onlne_rec", (req, res) => {
  let query =
    "SELECT t1.*,(t1.active_users - t1.online_users) 'offline_users' from (SELECT COUNT(DISTINCT user_spent_time.user_id) 'active_users',(SELECT COUNT(DISTINCT user_spent_time.user_id) from user_spent_time WHERE user_spent_time.user_status=1) 'online_users' from user_spent_time)t1";
  dbUtils.runSqlQueryAsyncSelect(query, []).then(data => {
    if (data.err) res.send(data.err);
    else res.send(data.result);
  });
});
router.post("/get_y_register_logs_details", (req, res) => {
  let params = req.body;
  let query =
    "select cv_school_detail.name,cv_school_detail.sch_id,(SELECT username from cv_users where cv_users.sch_id = cv_school_detail.sch_id and cv_users.role_id =1)'sch_user_name',(select count(*) from cv_users where cv_users.status =1 and  (DATE_FORMAT(cv_users.reg_date,'%Y') <=? or cv_users.reg_date IS NULL) )'total_student',(select count(*) from cv_users where cv_users.status =1 and cv_users.sch_id = cv_school_detail.sch_id and cv_users.name!=cv_school_detail.name and (DATE_FORMAT(cv_users.reg_date,'%Y') <=? or cv_users.reg_date IS NULL) group by cv_school_detail.sch_id) 'sch_by_users',(select t2.active_users from (SELECT count(t.user_id) 'active_users',t.sch_id from (SELECT user_spent_time.user_id,cv_users.sch_id FROM user_spent_time  left join cv_users on cv_users.user_id = user_spent_time.user_id and cv_users.status =1 WHERE DATE_FORMAT(user_spent_time.login_time,'%y') <= ?  GROUP by user_spent_time.user_id) t GROUP by t.sch_id) t2 where t2.sch_id =cv_school_detail.sch_id ) 'active_user',(SELECT count(*) from user_spent_time left join cv_users on cv_users.user_id = user_spent_time.user_id and cv_users.status =1 where cv_users.sch_id = cv_school_detail.sch_id and DATE_FORMAT(user_spent_time.login_time,'%Y') <= ?  group by cv_users.sch_id) 'per_day_log',(SELECT count(*) FROM user_spent_ip_address left join user_spent_time on (user_spent_ip_address.user_spen_id = user_spent_time.user_spen_id) LEFT join cv_users on cv_users.user_id = user_spent_time.user_id and cv_users.status =1 where cv_users.sch_id = cv_school_detail.sch_id and DATE_FORMAT(user_spent_ip_address.login_time,'%Y') <= ? group by cv_users.sch_id) 'each_ip_entry' FROM cv_school_detail where (select count(*) from cv_users where cv_users.status =1 and cv_users.sch_id = cv_school_detail.sch_id and cv_users.name!=cv_school_detail.name and (DATE_FORMAT(cv_users.reg_date,'%Y') <= ? or cv_users.reg_date IS NULL) group by cv_school_detail.sch_id) IS NOT NULL order by per_day_log desc,each_ip_entry desc";
  //"select cv_school_detail.name,cv_school_detail.sch_id,(select count(*) from cv_users where (DATE_FORMAT(cv_users.reg_date,'%Y') <=? or cv_users.reg_date IS NULL) )'total_student',(select count(*) from cv_users where cv_users.sch_id = cv_school_detail.sch_id and cv_users.name!=cv_school_detail.name and DATE_FORMAT(cv_users.reg_date,'%Y') <=? or cv_users.reg_date IS NULL group by cv_school_detail.sch_id) 'sch_by_users',(select t2.active_users from (SELECT count(t.user_id) 'active_users',t.sch_id from (SELECT user_spent_time.user_id,cv_users.sch_id FROM user_spent_time  left join cv_users on cv_users.user_id = user_spent_time.user_id WHERE DATE_FORMAT(user_spent_time.login_time,'%y') <= ?  GROUP by user_spent_time.user_id) t GROUP by t.sch_id) t2 where t2.sch_id =cv_school_detail.sch_id ) 'active_user',(SELECT count(*) from user_spent_time left join cv_users on cv_users.user_id = user_spent_time.user_id where cv_users.sch_id = cv_school_detail.sch_id and DATE_FORMAT(user_spent_time.login_time,'%Y') <= ?  group by cv_users.sch_id) 'per_day_log',(SELECT count(*) FROM user_spent_ip_address left join user_spent_time on (user_spent_ip_address.user_spen_id = user_spent_time.user_spen_id) LEFT join cv_users on cv_users.user_id = user_spent_time.user_id where cv_users.sch_id = cv_school_detail.sch_id and DATE_FORMAT(user_spent_ip_address.login_time,'%Y') <= ? group by cv_users.sch_id) 'each_ip_entry' FROM cv_school_detail where (select count(*) from cv_users where cv_users.sch_id = cv_school_detail.sch_id and cv_users.name!=cv_school_detail.name and DATE_FORMAT(cv_users.reg_date,'%Y') <= ? group by cv_school_detail.sch_id) IS NOT NULL order by per_day_log desc,each_ip_entry desc";
  let param = [
    params.year,
    params.year,
    params.year,
    params.year,
    params.year,
    params.year
  ];
  dbUtils.runSqlQueryAsyncSelect(query, param).then(data => {
    if (data.err) res.send(data.err);
    else res.send(data.result);
  });
});

router.post("/get_register_logs_details", (req, res) => {
  pool.query(
    //"select cv_school_detail.name,cv_school_detail.sch_id,(SELECT username from cv_users where cv_users.user_id = cv_school_detail.sch_id)'sch_user_name',(select count(*) from cv_users where cv_users.status =1 )'total_student',(select count(*) from cv_users where cv_users.status =1 and cv_users.sch_id = cv_school_detail.sch_id and cv_users.name!=cv_school_detail.name group by cv_school_detail.sch_id) 'sch_by_users',(select t2.active_users from (SELECT count(t.user_id) 'active_users',t.sch_id from (SELECT user_spent_time.user_id,cv_users.sch_id FROM user_spent_time  left join cv_users on cv_users.user_id = user_spent_time.user_id and cv_users.status =1  GROUP by user_spent_time.user_id) t GROUP by t.sch_id) t2 where t2.sch_id =cv_school_detail.sch_id ) 'active_user',(SELECT count(*) from user_spent_time left join cv_users on cv_users.user_id = user_spent_time.user_id and cv_users.status =1 where cv_users.sch_id = cv_school_detail.sch_id group by cv_users.sch_id) 'per_day_log',(SELECT count(*) FROM user_spent_ip_address left join user_spent_time on (user_spent_ip_address.user_spen_id = user_spent_time.user_spen_id) LEFT join cv_users on cv_users.user_id = user_spent_time.user_id and cv_users.status =1 where cv_users.sch_id = cv_school_detail.sch_id group by cv_users.sch_id) 'each_ip_entry' FROM cv_school_detail where (select count(*) from cv_users where cv_users.status =1 and cv_users.sch_id = cv_school_detail.sch_id and cv_users.name!=cv_school_detail.name group by cv_school_detail.sch_id) IS NOT NULL order by per_day_log desc,each_ip_entry desc",
    "select cv_school_detail.name,cv_school_detail.sch_id,(SELECT username from cv_users where cv_users.sch_id = cv_school_detail.sch_id and cv_users.role_id=1)'sch_user_name',(select count(*) from cv_users where cv_users.status =1 )'total_student',(select count(*) from cv_users where cv_users.status =1 and cv_users.sch_id = cv_school_detail.sch_id and cv_users.name!=cv_school_detail.name group by cv_school_detail.sch_id) 'sch_by_users',(select t2.active_users from (SELECT count(t.user_id) 'active_users',t.sch_id from (SELECT user_spent_time.user_id,cv_users.sch_id FROM user_spent_time  left join cv_users on cv_users.user_id = user_spent_time.user_id and cv_users.status =1  GROUP by user_spent_time.user_id) t GROUP by t.sch_id) t2 where t2.sch_id =cv_school_detail.sch_id ) 'active_user',(SELECT count(*) from user_spent_time left join cv_users on cv_users.user_id = user_spent_time.user_id and cv_users.status =1 where cv_users.sch_id = cv_school_detail.sch_id group by cv_users.sch_id) 'per_day_log',(SELECT count(*) FROM user_spent_ip_address left join user_spent_time on (user_spent_ip_address.user_spen_id = user_spent_time.user_spen_id) LEFT join cv_users on cv_users.user_id = user_spent_time.user_id and cv_users.status =1 where cv_users.sch_id = cv_school_detail.sch_id group by cv_users.sch_id) 'each_ip_entry' FROM cv_school_detail where (select count(*) from cv_users where cv_users.status =1 and cv_users.sch_id = cv_school_detail.sch_id and cv_users.name!=cv_school_detail.name group by cv_school_detail.sch_id) IS NOT NULL order by per_day_log desc,each_ip_entry desc",
    function(err, data) {
      if (!err) {
        //  console.log(data);
        res.json({
          status: "200",
          data: data
        });
      }
    }
  );
});
router.post("/get_y_visted_rec", (req, res) => {
  let params = req.body;
  let query =
    "SELECT count(*) 'total_users',(SELECT count(DISTINCT user_spent_time.user_id) from user_spent_time where DATE_FORMAT(user_spent_time.login_time,'%Y') <= ?) 'online_users',(count(*)-(SELECT count(DISTINCT user_spent_time.user_id) from user_spent_time where DATE_FORMAT(user_spent_time.login_time,'%Y') <= ?)) 'offine_users' from cv_users left join cv_school_detail on cv_users.sch_id =cv_school_detail.sch_id where cv_users.status =1 and  (DATE_FORMAT(cv_users.reg_date,'%Y') <= ?  or cv_users.reg_date IS NULL)"; //"SELECT count(*) 'total_users',(SELECT count(DISTINCT user_spent_time.user_id) from user_spent_time where DATE_FORMAT(user_spent_time.login_time,'%Y') <= ?) 'online_users',(count(*)-(SELECT count(DISTINCT user_spent_time.user_id) from user_spent_time where DATE_FORMAT(user_spent_time.login_time,'%Y') <= ?)) 'offine_users' from cv_users left join cv_school_detail on cv_users.sch_id =cv_school_detail.sch_id where (DATE_FORMAT(cv_users.reg_date,'%Y') <= ?  or cv_users.reg_date IS NULL)";
  let param = [params.year, params.year, params.year];
  dbUtils.runSqlQueryAsyncSelect(query, param).then(data => {
    if (data.err) res.send(data.err);
    else res.send(data.result);
  });
});
router.post("/get_per_year", (req, res) => {
  let params = req.body;
  let query =
    "SELECT  count(t1.user_id) 'online_users',DATE_FORMAT(t1.login_time, '%M') 'month',t1.total_users from (SELECT user_spent_time.user_id,user_spent_time.login_time,cv_users.reg_date,(SELECT count(*) from cv_users where cv_users.status =1 and  (cv_users.reg_date IS NULL or  DATE_FORMAT(cv_users.reg_date,'%Y') <= ?)) 'total_users' from user_spent_time join cv_users on cv_users.user_id = user_spent_time.user_id where cv_users.status =1 and DATE_FORMAT(user_spent_time.login_time,'%Y') <= ? and cv_users.reg_date IS NULL or DATE_FORMAT(cv_users.reg_date,'%Y') <= ?)t1 GROUP by month order by Month(t1.login_time)";
  //"SELECT  count(t1.user_id) 'online_users',DATE_FORMAT(t1.login_time, '%M') 'month',t1.total_users from (SELECT user_spent_time.user_id,user_spent_time.login_time,cv_users.reg_date,(SELECT count(*) from cv_users where cv_users.reg_date IS NULL or  DATE_FORMAT(cv_users.reg_date,'%Y') < ?) 'total_users' from user_spent_time join cv_users on cv_users.user_id = user_spent_time.user_id where DATE_FORMAT(user_spent_time.login_time,'%Y') <= ? and cv_users.reg_date IS NULL or DATE_FORMAT(cv_users.reg_date,'%Y') <= ?)t1 GROUP by month order by Month(t1.login_time)";
  let param = [params.year, params.year, params.year];
  dbUtils.runSqlQueryAsyncSelect(query, param).then(data => {
    if (data.err) res.send(data.err);
    else res.send(data.result);
  });
});

/****schoool tracking */
router.post("/get_visited_logs_sch_basic_details", (req, res) => {
  let params = req.body;
  dbUtils
    .runSqlQueryAsyncSelect(
      "SELECT cv_school_detail.name 'sch_name',(select no_lab from cv_school_week_lab where cv_school_week_lab.sch_id = cv_school_detail.sch_id)'week_lab',(SELECT count(user_id) from cv_users where cv_users.sch_id = cv_school_detail.sch_id) 'tot_users',(SELECT count(user_id) from cv_users where cv_users.sch_id = cv_school_detail.sch_id and cv_users.role_id=3) 'tot_students',(SELECT count(user_id) from cv_users where cv_users.sch_id = cv_school_detail.sch_id and cv_users.role_id=2) 'tot_teachers',(SELECT count(*) from (SELECT COUNT(*),cv_users.sch_id from user_spent_time left join cv_users on user_spent_time.user_id =cv_users.user_id GROUP by user_spent_time.user_id) cug where cug.sch_id=cv_school_detail.sch_id) 'active_users',(SELECT count(*) from user_spent_time left join cv_users on (cv_users.user_id = user_spent_time.user_id) left join cv_school_detail on (cv_school_detail.sch_id = cv_users.sch_id) where cv_users.sch_id in (SELECT sch_id from cv_users where cv_users.username=?))'login_user' from cv_school_detail inner join cv_users on (cv_users.sch_id =cv_school_detail.sch_id and cv_users.role_id=1) where cv_users.username=?",
      [params.sch_name, params.sch_name]
    )
    .then(data => {
      if (data.err) res.send(data.err);
      else res.send(data.result);
    });
});

router.post("/get_visited_logs_sch_details", (req, res) => {
  let params = req.body;
  pool.query(
    "SELECT cv_users.name,cv_users.username,cv_users.user_id,cv_st_detail.cls_id,cv_sections.sec_name,(case when cv_users.role_id=1 then 'School' WHEN cv_users.role_id=2 then 'Teacher' WHEN cv_users.role_id=3 then 'Student' end) 'role',cv_school_detail.name 'sch_name',(SELECT min(user_spent_ip_address.login_time) from user_spent_ip_address left join user_spent_time on (user_spent_time.user_spen_id = user_spent_ip_address.user_spen_id) left join cv_users on (cv_users.user_id = user_spent_time.user_id) left join cv_st_detail on (cv_st_detail.user_id = cv_users.user_id) left join cv_sections on (cv_sections.sec_id = cv_st_detail.sec_id) left join cv_school_detail on (cv_school_detail.sch_id = cv_users.sch_id) where cv_school_detail.name IN(SELECT cv_school_detail.name from cv_school_detail join cv_users on (cv_users.sch_id = cv_school_detail.sch_id and cv_users.role_id=1) WHERE cv_users.username=?)) 'min_date', user_spent_ip_address.login_time,(Case when user_spent_ip_address.logout_time then user_spent_ip_address.logout_time when user_spent_time.logout_time then user_spent_time.logout_time else null end) 'logout_time',user_spent_ip_address.login_ip_address,SEC_TO_TIME(user_spent_ip_address.time_spend) 'time_spent' FROM `user_spent_ip_address` inner join user_spent_time on (user_spent_time.user_spen_id = user_spent_ip_address.user_spen_id) inner join cv_users on (cv_users.user_id = user_spent_time.user_id) left join cv_st_detail on (cv_st_detail.user_id = cv_users.user_id) left join cv_sections on (cv_sections.sec_id = cv_st_detail.sec_id) left join cv_school_detail on (cv_school_detail.sch_id = cv_users.sch_id) where cv_users.sch_id IN(SELECT cv_school_detail.sch_id from cv_school_detail join cv_users on (cv_users.sch_id = cv_school_detail.sch_id and cv_users.role_id =1) WHERE cv_users.username=?) order by time_spent desc",
    [params.sch_name, params.sch_name],
    function(err, data) {
      // console.log(data);
      if (!err) {
        res.json({
          status: "200",
          data: data
        });
      }
    }
  );
});
router.post("/get_visited_logs_sch_datails_cal", (req, res) => {
  let params = req.body;
  pool.query(
    //"SELECT cv_school_detail.name 'sch_name',(select no_lab from cv_school_week_lab where cv_school_week_lab.sch_id = cv_school_detail.sch_id)'week_lab',(SELECT count(user_id) from cv_users where cv_users.sch_id = cv_school_detail.sch_id) 'tot_users',(SELECT count(user_id) from cv_users where cv_users.sch_id = cv_school_detail.sch_id and cv_users.role_id=3) 'tot_students',(SELECT count(user_id) from cv_users where cv_users.sch_id = cv_school_detail.sch_id and cv_users.role_id=2) 'tot_teachers',(SELECT count(*) from (SELECT COUNT(*),user_spent_time.user_id,user_spent_time.login_time,cv_users.sch_id from user_spent_time left join cv_users on user_spent_time.user_id =cv_users.user_id where user_spent_time.login_time BETWEEN ? and ? group by user_spent_time.user_id) cug where cug.sch_id=cv_school_detail.sch_id) 'active_users',(SELECT count(*) from user_spent_time left join cv_users on (cv_users.user_id = user_spent_time.user_id) left join cv_school_detail on (cv_school_detail.sch_id = cv_users.sch_id) where cv_users.sch_id in (SELECT sch_id from cv_users where cv_users.username=?) and user_spent_time.login_time BETWEEN ? and ?)'login_user',cv_users.name,cv_users.username,cv_st_detail.cls_id,cv_sections.sec_name,(case when cv_users.role_id=1 then 'School' WHEN cv_users.role_id=2 then 'Teacher' WHEN cv_users.role_id=3 then 'Student' end) 'role', user_spent_ip_address.login_time,user_spent_ip_address.logout_time,user_spent_ip_address.login_ip_address,SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(case when user_spent_ip_address.logout_time then user_spent_ip_address.logout_time else now() end ,user_spent_ip_address.login_time))) 'time_spent' FROM `user_spent_ip_address` left join user_spent_time on (user_spent_time.user_spen_id = user_spent_ip_address.user_spen_id) left join cv_users on (cv_users.user_id = user_spent_time.user_id) left join cv_st_detail on (cv_st_detail.user_id = cv_users.user_id) left join cv_sections on (cv_sections.sec_id = cv_st_detail.sec_id) left join cv_school_detail on (cv_school_detail.sch_id = cv_users.sch_id) where cv_school_detail.name IN(SELECT cv_school_detail.name from cv_school_detail join cv_users on cv_users.user_id = cv_school_detail.sch_id WHERE cv_users.username=?) and user_spent_ip_address.login_time BETWEEN ? and ? order by time_spent desc",
    //"SELECT cv_school_detail.name 'sch_name',(select no_lab from cv_school_week_lab where cv_school_week_lab.sch_id = cv_school_detail.sch_id)'week_lab',(SELECT count(user_id) from cv_users where cv_users.sch_id = cv_school_detail.sch_id) 'tot_users',(SELECT count(user_id) from cv_users where cv_users.sch_id = cv_school_detail.sch_id and cv_users.role_id=3) 'tot_students',(SELECT count(user_id) from cv_users where cv_users.sch_id = cv_school_detail.sch_id and cv_users.role_id=2) 'tot_teachers',(SELECT count(*) from (SELECT COUNT(*),user_spent_time.user_id,user_spent_time.login_time,cv_users.sch_id from user_spent_time left join cv_users on user_spent_time.user_id =cv_users.user_id where user_spent_time.login_time BETWEEN ? and ? group by user_spent_time.user_id) cug where cug.sch_id=cv_school_detail.sch_id) 'active_users',(SELECT count(*) from user_spent_time left join cv_users on (cv_users.user_id = user_spent_time.user_id) left join cv_school_detail on (cv_school_detail.sch_id = cv_users.sch_id) where cv_users.sch_id in (SELECT sch_id from cv_users where cv_users.username=?) and user_spent_time.login_time BETWEEN ? and ?)'login_user',cv_users.name,cv_users.username,cv_st_detail.cls_id,cv_sections.sec_name,(case when cv_users.role_id=1 then 'School' WHEN cv_users.role_id=2 then 'Teacher' WHEN cv_users.role_id=3 then 'Student' end) 'role', user_spent_ip_address.login_time,user_spent_ip_address.logout_time,user_spent_ip_address.login_ip_address,SEC_TO_TIME(user_spent_ip_address.time_spend) 'time_spent' FROM `user_spent_ip_address` left join user_spent_time on (user_spent_time.user_spen_id = user_spent_ip_address.user_spen_id) left join cv_users on (cv_users.user_id = user_spent_time.user_id) left join cv_st_detail on (cv_st_detail.user_id = cv_users.user_id) left join cv_sections on (cv_sections.sec_id = cv_st_detail.sec_id) left join cv_school_detail on (cv_school_detail.sch_id = cv_users.sch_id) where cv_school_detail.name IN(SELECT cv_school_detail.name from cv_school_detail join cv_users on (cv_users.sch_id = cv_school_detail.sch_id and cv_users.role_id =1) WHERE cv_users.username=?) and user_spent_ip_address.login_time BETWEEN ? and ? order by time_spent desc",
    //[params.start_date,params.end_date,params.sch_name,params.start_date,params.end_date,params.sch_name,params.start_date,params.end_date],
    "SELECT cv_users.name,cv_users.username,cv_users.user_id,cv_st_detail.cls_id,cv_sections.sec_name,(case when cv_users.role_id=1 then 'School' WHEN cv_users.role_id=2 then 'Teacher' WHEN cv_users.role_id=3 then 'Student' end) 'role',cv_school_detail.name 'sch_name',(SELECT min(user_spent_ip_address.login_time) from user_spent_ip_address left join user_spent_time on (user_spent_time.user_spen_id = user_spent_ip_address.user_spen_id) left join cv_users on (cv_users.user_id = user_spent_time.user_id) left join cv_st_detail on (cv_st_detail.user_id = cv_users.user_id) left join cv_sections on (cv_sections.sec_id = cv_st_detail.sec_id) left join cv_school_detail on (cv_school_detail.sch_id = cv_users.sch_id) where cv_school_detail.name IN(SELECT cv_school_detail.name from cv_school_detail join cv_users on (cv_users.sch_id = cv_school_detail.sch_id and cv_users.role_id=1) WHERE cv_users.username=?)) 'min_date', user_spent_ip_address.login_time,(Case when user_spent_ip_address.logout_time then user_spent_ip_address.logout_time when user_spent_time.logout_time then user_spent_time.logout_time else null end) 'logout_time',user_spent_ip_address.login_ip_address,SEC_TO_TIME(user_spent_ip_address.time_spend) 'time_spent' FROM `user_spent_ip_address` inner join user_spent_time on (user_spent_time.user_spen_id = user_spent_ip_address.user_spen_id) inner join cv_users on (cv_users.user_id = user_spent_time.user_id) left join cv_st_detail on (cv_st_detail.user_id = cv_users.user_id) left join cv_sections on (cv_sections.sec_id = cv_st_detail.sec_id) left join cv_school_detail on (cv_school_detail.sch_id = cv_users.sch_id) where cv_users.sch_id IN(SELECT cv_school_detail.sch_id from cv_school_detail join cv_users on (cv_users.sch_id = cv_school_detail.sch_id and cv_users.role_id =1) WHERE cv_users.username=?) and user_spent_ip_address.login_time BETWEEN ? and ?  order by time_spent desc",
    [params.sch_name, params.sch_name, params.start_date, params.end_date],
    function(err, data) {
      // console.log(data);
      if (!err) {
        res.json({
          status: "200",
          data: data
        });
      }
    }
  );
});
router.post("/get_school_classes", (req, res) => {
  let params = req.body;
  pool.query(
    "SELECT cv_school_classes.cls_id,cv_school_detail.name,cv_school_classes.sch_id from cv_school_classes left join cv_users on (cv_users.sch_id =cv_school_classes.sch_id) left join cv_school_detail on (cv_school_detail.sch_id = cv_school_classes.sch_id) where cv_users.username=? order by cv_school_classes.cls_id",
    [params.sch_name],
    (err, data) => {
      //console.log(data);
      res.send(data);
    }
  );
});
//current month week wise report
router.post("/get_month_visited_weekwise_report", (req, res) => {
  let params = req.body;
  console.log(params);
  let query =
    "SELECT count(user_spent_time.user_spen_id)'online_users',week(user_spent_time.login_time) 'week',user_spent_time.login_time 'login_date',DAYNAME(user_spent_time.login_time)'Day' from user_spent_time left join cv_users on (cv_users.user_id =user_spent_time.user_id)where DATE_FORMAT(user_spent_time.login_time,'%m%y') =DATE_FORMAT(?,'%m%y') and cv_users.sch_id in (SELECT sch_id from cv_users where username=?) GROUP by DATE_FORMAT(user_spent_time.login_time,'%d%m%y') ORDER BY login_date,`week` ASC";
  return dbUtils
    .runSqlQueryAsyncSelect(query, [params.monthWeek, params.sch_username])
    .then(data => {
      res.send(data.result);
    });
});
//pre 6 month all data date wise
router.post("/get_month_wise_data", (req, res) => {
  let params = req.body;
  let query =
    "SELECT count(user_spent_time.user_id) 'online_users',Date_FORMAT(login_time,'%D %M %Y') 'login_date',DATE_FORMAT(login_time, '%M') 'month',DATE_FORMAT(login_time,'%M %Y') 'month_title',(SELECT count(*) FROM cv_users WHERE cv_users.status =1 and (cv_users.reg_date IS NULL or DATE_FORMAT(cv_users.reg_date,'%Y')) <= DATE_FORMAT(now(),'%Y') and cv_users.sch_id = cv_school_detail.sch_id) 'total_users' FROM `user_spent_time` left join cv_users on (cv_users.user_id = user_spent_time.user_id) left join cv_school_detail on (cv_school_detail.sch_id = cv_users.sch_id) where cv_school_detail.sch_id in (SELECT sch_id from cv_users where username =?) and user_spent_time.login_time > (last_day(now()) + interval 1 day - interval 6 month)  group by login_date order by DATE(user_spent_time.login_time)";
  return dbUtils.runSqlQueryAsyncSelect(query, [params.sch_name]).then(data => {
    res.send(data.result);
  });
});
//pre 6 month record
router.post("/get_bar_graphics_data", (req, res) => {
  let params = req.body;
  pool.query(
    "SELECT count(user_spent_time.user_id) 'online_users',DATE_FORMAT(login_time, '%M') 'month',DATE_FORMAT(login_time, '%Y') 'year',max(login_time)'login_time',(SELECT count(*) FROM cv_users WHERE cv_users.status =1 and (cv_users.reg_date IS NULL or DATE_FORMAT(cv_users.reg_date,'%Y')) <= DATE_FORMAT(now(),'%Y') and cv_users.sch_id = cv_school_detail.sch_id) 'total_users' FROM `user_spent_time` left join cv_users on (cv_users.user_id = user_spent_time.user_id) left join cv_school_detail on (cv_school_detail.sch_id = cv_users.sch_id) where cv_school_detail.sch_id in (SELECT sch_id from cv_users where username =?) and user_spent_time.login_time > (last_day(now()) + interval 1 day - interval 6 month) group by month  order by DATE(user_spent_time.login_time)",
    [params.sch_name],
    (err, data) => {
      res.send(data);
    }
  );
});
//pre 7 days record
router.post("/get_pre_week_graphics_data", (req, res) => {
  let params = req.body;
  pool.query(
    "SELECT count(user_spent_time.user_id) 'online_users',DAYNAME(login_time) 'Day',DATE_FORMAT(login_time,'%D %M %Y')'date',(SELECT count(*) FROM cv_users  WHERE cv_users.status =1 and (cv_users.reg_date IS NULL or DATE_FORMAT(cv_users.reg_date,'%Y')) <= DATE_FORMAT(now(),'%Y') and cv_users.sch_id = cv_school_detail.sch_id) 'total_users' FROM `user_spent_time` left join cv_users on (cv_users.user_id = user_spent_time.user_id) left join cv_school_detail on (cv_school_detail.sch_id = cv_users.sch_id) where cv_school_detail.sch_id in (SELECT sch_id from cv_users where username =?) and login_time > DATE_SUB(now(), INTERVAL 7 day) GROUP by day order by DATE_FORMAT(login_time, '%d%m%y')",
    [params.sch_name],
    (err, data) => {
      res.send(data);
    }
  );
});
//get school tracking tot years
router.post("/get_sch_tot_year", (req, res) => {
  let params = req.body;
  let query =
    "SELECT DATE_FORMAT(login_time,'%Y') 'year' FROM `user_spent_time` left join cv_users on (cv_users.user_id = user_spent_time.user_id and sch_id in (SELECT sch_id from cv_users where username=?)) group by DATE_FORMAT(login_time,'%Y') order by year DESC";
  let param = [params.sch_name];
  return dbUtils.runSqlQueryAsyncSelect(query, param).then(result => {
    res.send(result.result);
  });
});
//end school tracking tot years
/*******Individual */
router.post("/get_visited_logs_individual_ips", (req, res) => {
  let params = req.body;
  pool.query(
    "SELECT DATE_FORMAT(user_spent_ip_address.login_time,'%D %M %Y') 'Date', user_spent_ip_address.login_ip_address,SEC_TO_TIME(user_spent_ip_address.time_spend)'spent_time' FROM `user_spent_ip_address` left join  user_spent_time on (user_spent_time.user_spen_id = user_spent_ip_address.user_spen_id) left join cv_users on (user_spent_time.user_id = cv_users.user_id) where cv_users.username=? order by date(user_spent_ip_address.login_time)",
    [params.username],
    (err, data) => {
      res.send(data);
    }
  );
});

/*******end admin logs tracking */

router.post("/user_visited_page", (req, res) => {
  let params = req.body;
  let dataObject = "";
  //console.log(params);
  let query =
    "SELECT user_spent_time.user_spen_id from user_spent_time where user_id=? order by login_time desc limit 1";
  let param = [params.user_id];
  dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then(data => {
      //console.log(data);
      if (data.err) res.send(data.err);
      else {
        if (data.err) throw data.err;
        dataObject = data;
        query =
          "SELECT visited_id FROM `user_visited_page` WHERE user_visited_page.user_spen_id=? and user_visited_page.page_from=? and user_visited_page.page_to=?";
        param = [data.result[0].user_spen_id, params.from, params.to];
        return dbUtils.runSqlQueryAsyncSelect(query, param);
      }
    })
    .then(data2 => {
      if (data2.err) {
        throw data2.err;
      } else if (data2.result.length) {
        query =
          "UPDATE `user_visited_page` u1 INNER join `user_visited_page` u2 on (u1.visited_id = u2.visited_id and u2.user_spen_id=? and u2.page_to=?) SET u1.page_out_time= now(),u1.spen_time_sec= u1.spen_time_sec+ TIME_TO_SEC(TIMEDIFF(now(),u1.page_in_time))";
        param = [dataObject.result[0].user_spen_id, params.from];
        return dbUtils.runSqlQueryAsyncUpdate(query, param);
      } else {
        query =
          "INSERT INTO `user_visited_page`(`user_spen_id`,`page_from`,`page_to`,`update_time`) VALUES (?,?,?,now())";
        params = [dataObject.result[0].user_spen_id, params.from, params.to];
        return dbUtils.runSqlQueryAsyncInsert(query, param);
      }
    })
    .then(results => {
      if (results.err) throw result.err;
      console.log(params.from + " to " + params.to);
      res.send(results);
    })
    .catch(err => {
      res.send(err);
    });
});

module.exports = router;
