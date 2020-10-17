var express = require("express");
var router = express.Router();
const path = require("path");
var pathUtils = require("./path-utils");
const jwt = require("jsonwebtoken");
var fs = require("fs-extra");
var mkdirp = require("mkdirp");
var pool = require("../db").pool;
var multer = require("multer");
var dbUtils = require("./database-utils");
var ffmpeg = require("ffmpeg");
var dateFormat = require("dateformat");
let pdf = require("html-pdf");
const mg = require("mailgun-js");
const DOMAIN = "mail.codevidhya.com";
const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
const mailgun = mg({ apiKey: api, domain: DOMAIN });
var multer = require("multer");
const XLSX = require("xlsx");
const appRoot = path.resolve(path.join(__dirname, "../../"));
const pathSeparator = appRoot.indexOf("\\") >= 0 ? "\\" : "/";

router.post("/DisplayLiveCourses", (req, res) => {
  let params = req.body;
  return dbUtils
    .runSqlQueryAsyncSelect(
      "SELECT `live_course_id`, `live_course_name`, `live_course_slug`,`img`, `live_course_outcomes`, `grade`, `age_group`, `per_hour_price`, `duration`, live_courses.actual_price ,`course_price`, `course_theme`,  orders.status 'purchases_status',products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = live_courses.product_id) 'avg_rating' FROM `live_courses` inner join products on (products.product_id =live_courses.product_id) left join orders on (products.product_id =orders.product_id and user_id=? and orders.status=1)",
      [params.user_id]
    )
    .then((result) => {
      if (result.err) {
        throw result.err;
      } else {
        return res.send(result.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/DisplayByteCourse", (req, res) => {
  let params = req.body;

  console.log("byte size ");
  return dbUtils
    .runSqlQueryAsyncSelect(
      "SELECT `byte_course_id`, `byte_course_name`, `byte_course_slug`,`img`, `byte_course_outcomes`, `grade`, `age_group`, `per_hour_price`, `duration`, `course_price`, `course_theme`,  orders.status 'purchases_status',products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = byte_size_courses.product_id) 'avg_rating' FROM `byte_size_courses` inner join products on (products.product_id =byte_size_courses.product_id) left join orders on (products.product_id =orders.product_id and user_id=?)",
      [params.user_id]
    )
    .then((result) => {
      if (result.err) {
        throw result.err;
      } else {
        return res.send(result.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/getusersfortrainer", (req, res) => {
  let params = req.body;
  let query =
    "SELECT cv_users.user_id,cv_users.name FROM `cv_users`  WHERE name REGEXP '" +
    params.text +
    "?'";
  return dbUtils.runSqlQueryAsyncSelect(query, []).then((result) => {
    if (result.err) {
      throw result.err;
    } else {
      return res.send(result.result);
    }
  });
});

router.post("/sendRequestForReschedule", async (req, res) => {
  var moment = require("moment"); // require

  let params = req.body;
  // console.log(params);
  let dateTimeSlot = new Date(params.date_s_time_slot);
  /* dateTimeSlot =dateTimeSlot.toLocaleString("en-US", {
  timeZone: "Asia/Kolkata"
  });*/
  dateTimeSlot = new Date(dateTimeSlot);
  previousDateTimeSlot = new Date(params.pre_date_s_time_slot);
  /* previousDateTimeSlot =previousDateTimeSlot.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata"
    });*/
  preDateTimeSlot = new Date(previousDateTimeSlot);
  let pSlotDate = dateFormat(preDateTimeSlot, "yyyy-mm-dd");
  let pSlotTime = dateFormat(preDateTimeSlot, "HH:MM:ss");
  let Slotdate = dateFormat(dateTimeSlot, "yyyy-mm-dd");
  let SlotTime = dateFormat(dateTimeSlot, "HH:MM:ss");
  let query =
    "UPDATE `live_demo_course_assigned` SET `trainer_id`=?,`reschedule`=1,`reschedule_date`=?,`reschedule_time`=?,`t_class_link_id`=?,`trainer_calender_id`=?,`sales_person_id`=? WHERE assigned_id=?";
  let param = [
    params.trainer_id,
    Slotdate,
    SlotTime,
    params.t_class_link_id,
    params.trainer_calender_id,
    params.sales_person_id,
    params.assigned_id,
  ];
  return dbUtils
    .runSqlQueryAsyncUpdate(query, param)
    .then(async (dataResponse) => {
      if (dataResponse.err) throw dataResponse.err;
      else {
        let query =
          "UPDATE `live_class_mail_send` SET `reschedule`=1,`reschedule_date`=?,`reschedule_time`=?,`remainder_mail`=0,`feedback_mail`=0 where live_class_mail_send.username in (select username from cv_users where cv_users.user_id=?)";
        let param = [Slotdate, SlotTime, params.trainee_id];
        return await dbUtils.runSqlQueryAsyncUpdate(query, param);
      }
    })
    .then(async (dataRes) => {
      if (dataRes.err) throw dataRes;
      else {
        await reschedulemail({
          theme: params.theme,
          kids: params.kids_name,
          parent_name: params.parent_name,
          parent_mail: params.parent_mail,
          s_date: Slotdate,
          s_time: SlotTime,
          class_link: params.class_link,
        });
        await preTrainerMail({
          theme: params.theme,
          trainer_name: params.pre_trainer_name,
          trainer_email: params.pre_trainer_email,
          s_date: pSlotDate,
          s_time: pSlotTime,
          kids: params.kids_name,
        });
        await trainerMail({
          theme: params.theme,
          trainer_name: params.trainer_name,
          trainer_email: params.trainer_email,
          s_date: Slotdate,
          s_time: SlotTime,
          kids: params.kids_name,
        });
        //await SalespersongRescheduleMail()
        return res.send(dataRes);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/insertDataTrainerSchedular", async (req, res) => {
  params = req.body;

  let response = await inserTrainerScheduleDateTime(params);
  res.send(response);
});

async function inserTrainerScheduleDateTime(...datas) {
  let user_id = datas[0].user_id;
  let duration = datas[0].duration;
  let currentDate = datas[0].currentDate;
  let filterArray = datas[0].filterArray;
  let lfilterArray = datas[0].lfilterArray;
  let lunchbreakIndex = datas[0].lunchbreakIndex;
  let next_date = currentDate;
  await asyncforEach(filterArray, (item, index) => {
    if (item == "12:00:00 AM") {
      let s_date = new Date(currentDate);
      next_date = s_date.setDate(s_date.getDate() + 1);
      next_date = new Date(next_date).toISOString().slice(0, 10);
    }

    let s_date = new Date(next_date + " " + item);
    let l_date = new Date(next_date + " " + lfilterArray[index]);
    /*s_date =s_date.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata"
      });*/
    s_date = dateFormat(s_date, "yyyy-mm-dd HH:MM:ss");
    /* l_date =l_date.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata"
        });*/
    l_date = dateFormat(l_date, "yyyy-mm-dd HH:MM:ss");

    let findindex, calender_id;
    let filterdatas, query, param;

    return dbUtils
      .runSqlQueryAsyncSelect(
        "SELECT trainer_calendar.trainer_calender_id,user_ids,trainer_calendar.booked_ids FROM `trainer_calendar`  WHERE trainer_calendar.date_s_time_slot =?",
        [s_date]
      )
      .then(async (dataResult) => {
        if (dataResult.err) throw dataResult.err;
        else if (dataResult.result && dataResult.result.length) {
          var userIds = dataResult.result[0].user_ids;
          var bookedIds = dataResult.result[0].booked_ids;
          calender_id = dataResult.result[0].trainer_calender_id;
          filterdatas = userIds.split(",").filter((e) => e.length != 0);
          findindex = filterdatas.findIndex((x) => x == user_id);

          if (findindex != -1) {
            return "";
          } else {
            userIds = userIds + "," + user_id;
            if (bookedIds) {
              let filterdatas = bookedIds
                .split(",")
                .filter((e) => e.length != 0);
              if (filterdatas.length == 1) {
                if (filterdatas != user_id) {
                  bookedIds = bookedIds + "," + user_id;
                }
              } else {
                findindex = filterdatas.findindex((x) => x == user_id);
                if (findindex == -1) {
                  bookedIds = bookedIds + "," + user_id;
                }
              }
            } else bookedIds = user_id;

            if (lunchbreakIndex == index + 1) {
              query = `UPDATE trainer_calendar SET user_ids=?,booked_ids=? WHERE trainer_calendar.trainer_calender_id=?`;
              param = [userIds, bookedIds, calender_id];
            } else {
              query = `UPDATE trainer_calendar SET user_ids=? WHERE trainer_calendar.trainer_calender_id=?`;
              param = [userIds, calender_id];
            }

            return dbUtils.runSqlQueryAsyncUpdate(query, param);
          }
        } else {
          if (lunchbreakIndex + 1 == index) {
            query =
              "INSERT INTO `trainer_calendar`(`date_s_time_slot`,`date_e_time_slot`, `user_ids`, `duration`, `break_time`,`booked_ids`,`calenter_type`) VALUES (?,?,?,?,?,?,?)";
            param = [s_date, l_date, user_id, duration, "0", user_id, "demo"];
          } else {
            query =
              "INSERT INTO `trainer_calendar`(`date_s_time_slot`,`date_e_time_slot`, `user_ids`, `duration`, `break_time`,`calenter_type`) VALUES (?,?,?,?,?,?)";
            param = [s_date, l_date, user_id, duration, "0", "demo"];
          }

          return dbUtils.runSqlQueryAsyncInsert(query, param);
        }
      })
      .then((finalResult) => {
        if (finalResult) {
          if (finalResult.err) throw finalResult.err;
          else {
            return finalResult;
          }
        } else {
          return finalResult;
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

router.post("/getTrainerForAdd", (req, res) => {
  params = req.body;
  return res.send("hi");
});

router.post("/getSalesPersonFeedbacks", (req, res) => {
  return dbUtils
    .runSqlQueryAsyncSelect("SELECT * FROM `feedback_status`", [])
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else {
        return res.send(dataResult.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

/****Admin side sales management */
router.post("/getAllSalesMembers", (req, res) => {
  let query, param;
  query =
    "SELECT cv_users.user_id,cv_users.name FROM `cv_users` inner join cv_school_detail on (cv_school_detail.sch_id =cv_users.sch_id and cv_school_detail.cv_pid=4) WHERE cv_users.role_id<>1 and cv_users.status=1";
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then((dataRes) => {
      if (dataRes.err) throw dataRes.err;
      else {
        return res.send(dataRes.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/getAllSalesPersonFilterData", async (req, res) => {
  let params = req.body;

  let query, param, start_date, end_date;
  if (params.selval != 0) {
    start_date = new Date(params.start_date);
    start_date = dateFormat(start_date, "yyyy-mm-dd");
    end_date = new Date(params.end_date);
    end_date = dateFormat(end_date, "yyyy-mm-dd");
  }
  if (params.user_id == 0) {
    query =
      "SELECT cv_users.user_id,cv_users.name FROM `cv_users` inner join cv_school_detail on (cv_school_detail.sch_id =cv_users.sch_id and cv_school_detail.cv_pid=4) WHERE cv_users.role_id<>1 and cv_users.status=1";
    return dbUtils
      .runSqlQueryAsyncSelect(query, [])
      .then(async (dataResult) => {
        if (dataResult.err) throw dataResult.err;
        else {
          let resultData = dataResult.result;
          let unique_date = [];
          await asyncforEach(resultData, async (item, index) => {
            let selval =
              params.selval != 0
                ? ` and DATE_FORMAT(trainer_calendar.date_s_time_slot,'%Y-%m-%d') between '${start_date}' and '${end_date}'`
                : "";

            query =
              "SELECT trainer_calendar.date_s_time_slot,? as sales_id,? as 'sales_name',live_demo_course_assigned.trainer_calender_id,live_demo_course_assigned.user_id' trainee_id',live_demo_course_assigned.assigned_id,live_demo_course_assigned.feedback_status_id,feedback_status.feedback_status,live_demo_course_assigned.feedback_message, trainer_calendar.date_e_time_slot, Date_Format(trainer_calendar.date_s_time_slot,'%W %M %e %Y') 'schedule_date',Date_Format(trainer_calendar.date_s_time_slot,'%h:%i %p') 'schedule_s_time',Date_Format(trainer_calendar.date_e_time_slot,'%h:%i %p') 'schedule_e_time',trainer_calendar.duration,demo_trial_courses.theme,demo_trial_courses.demo_course_id 'course_id',cv.name 'trainee_name',t.name 'trainer_name',t.user_id 'trainer_id',t.email 'trainer_email',t.contact 'trainer_contact',(case when live_class_mail_send.feedback_mail=1 then 'done' when live_class_mail_send.reschedule=1 then 'reschedule' else 'not_done' END) 'statusss',live_class_request.name 'parent_name',live_class_request.email 'parent_email',live_class_request.contact 'parent_contact' FROM `live_demo_course_assigned` left join feedback_status on (feedback_status.feedback_status_id = live_demo_course_assigned.feedback_status_id) left join demo_trial_courses on (demo_trial_courses.demo_course_id =live_demo_course_assigned.demo_course_id) left join cv_users cv on (cv.user_id =live_demo_course_assigned.user_id) left join cv_users t on (t.user_id =live_demo_course_assigned.trainer_id) left join live_class_mail_send on (live_class_mail_send.username =cv.username) left join trainer_calendar on (trainer_calendar.trainer_calender_id = live_demo_course_assigned.trainer_calender_id) left join live_class_request on (live_class_request.req_id =live_demo_course_assigned.req_id)  WHERE live_demo_course_assigned.sales_person_id=?" +
              selval;
            param = [item.user_id, item.name, item.user_id];
            await dbUtils
              .runSqlQueryAsyncSelect(query, param)
              .then(async (calendarResult) => {
                if (calendarResult.err) throw calendarResult.err;
                else {
                  unique_date.push(calendarResult.result);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          });
          return res.send(unique_date);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    let selval =
      params.selval != 0
        ? ` and DATE_FORMAT(trainer_calendar.date_s_time_slot,'%Y-%m-%d') between '${start_date}' and '${end_date}'`
        : "";

    query =
      "SELECT trainer_calendar.date_s_time_slot,? as sales_id,? as 'sales_name',live_demo_course_assigned.trainer_calender_id,live_demo_course_assigned.user_id' trainee_id',live_demo_course_assigned.assigned_id,live_demo_course_assigned.feedback_status_id,feedback_status.feedback_status,live_demo_course_assigned.feedback_message, trainer_calendar.date_e_time_slot, Date_Format(trainer_calendar.date_s_time_slot,'%W %M %e %Y') 'schedule_date',Date_Format(trainer_calendar.date_s_time_slot,'%h:%i %p') 'schedule_s_time',Date_Format(trainer_calendar.date_e_time_slot,'%h:%i %p') 'schedule_e_time',trainer_calendar.duration,demo_trial_courses.theme,demo_trial_courses.demo_course_id 'course_id',cv.name 'trainee_name',t.name 'trainer_name',t.user_id 'trainer_id',t.email 'trainer_email',t.contact 'trainer_contact',(case when live_class_mail_send.feedback_mail=1 then 'done' when live_class_mail_send.reschedule=1 then 'reschedule' else 'not_done' END) 'statusss',live_class_request.name 'parent_name',live_class_request.email 'parent_email',live_class_request.contact 'parent_contact' FROM `live_demo_course_assigned` left join feedback_status on (feedback_status.feedback_status_id = live_demo_course_assigned.feedback_status_id) left join demo_trial_courses on (demo_trial_courses.demo_course_id =live_demo_course_assigned.demo_course_id) left join cv_users cv on (cv.user_id =live_demo_course_assigned.user_id) left join cv_users t on (t.user_id =live_demo_course_assigned.trainer_id) left join live_class_mail_send on (live_class_mail_send.username =cv.username) left join trainer_calendar on (trainer_calendar.trainer_calender_id = live_demo_course_assigned.trainer_calender_id) left join live_class_request on (live_class_request.req_id =live_demo_course_assigned.req_id)  WHERE live_demo_course_assigned.sales_person_id=?" +
      selval;

    param = [params.user_id, params.name, params.user_id];
    await dbUtils
      .runSqlQueryAsyncSelect(query, param)
      .then(async (calendarResult) => {
        if (calendarResult.err) throw calendarResult.err;
        else {
          // console.log(calendarResult.result);
          return res.send(calendarResult.result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
router.post("/getAllTrialDataForSales", (req, res) => {
  let query, param;
  query =
    "SELECT cv_users.user_id,cv_users.name FROM `cv_users` inner join cv_school_detail on (cv_school_detail.sch_id =cv_users.sch_id and cv_school_detail.cv_pid=4) WHERE cv_users.role_id<>1 and cv_users.status=1";
  return dbUtils
    .runSqlQueryAsyncSelect(query, [])
    .then(async (dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else {
        let resultData = dataResult.result;
        let unique_date = [];
        await asyncforEach(resultData, async (item, index) => {
          query =
            "SELECT  ? as sales_id,? as 'sales_name', trainer_calendar.date_s_time_slot,live_demo_course_assigned.trainer_calender_id,live_demo_course_assigned.user_id' trainee_id',live_demo_course_assigned.assigned_id,live_demo_course_assigned.feedback_status_id,live_demo_course_assigned.sale_product_id,feedback_status.feedback_status,live_demo_course_assigned.feedback_message, trainer_calendar.date_e_time_slot, Date_Format(trainer_calendar.date_s_time_slot,'%W %M %e %Y') 'schedule_date',Date_Format(trainer_calendar.date_s_time_slot,'%h:%i %p') 'schedule_s_time',Date_Format(trainer_calendar.date_e_time_slot,'%h:%i %p') 'schedule_e_time',trainer_calendar.duration,demo_trial_courses.theme,demo_trial_courses.demo_course_id 'course_id',cv.name 'trainee_name',t.name 'trainer_name',t.user_id 'trainer_id',t.email 'trainer_email',t.contact 'trainer_contact',(case when live_class_mail_send.feedback_mail=1 then 'done' when live_class_mail_send.reschedule=1 then 'reschedule' else 'not_done' END) 'statusss',live_class_request.name 'parent_name',live_class_request.email 'parent_email',live_class_request.contact 'parent_contact',live_class_student_feedback.skills,live_class_student_feedback.courses_ids,live_class_student_feedback.course_suggestion,live_class_student_feedback.comments,live_class_student_feedback.req_id FROM `live_demo_course_assigned` left join feedback_status on (feedback_status.feedback_status_id = live_demo_course_assigned.feedback_status_id) left join demo_trial_courses on (demo_trial_courses.demo_course_id =live_demo_course_assigned.demo_course_id) left join cv_users cv on (cv.user_id =live_demo_course_assigned.user_id) left join cv_users t on (t.user_id =live_demo_course_assigned.trainer_id) left join live_class_mail_send on (live_class_mail_send.username =cv.username) left join trainer_calendar on (trainer_calendar.trainer_calender_id = live_demo_course_assigned.trainer_calender_id) left join live_class_request on (live_class_request.req_id =live_demo_course_assigned.req_id) left join live_class_student_feedback on (live_class_student_feedback.req_id =live_demo_course_assigned.req_id) WHERE live_demo_course_assigned.sales_person_id=?";
          //"SELECT  ? as sales_id,? as 'sales_name', trainer_calendar.date_s_time_slot,live_demo_course_assigned.trainer_calender_id,live_demo_course_assigned.user_id' trainee_id',live_demo_course_assigned.assigned_id,live_demo_course_assigned.feedback_status_id,feedback_status.feedback_status,live_demo_course_assigned.feedback_message, trainer_calendar.date_e_time_slot, Date_Format(trainer_calendar.date_s_time_slot,'%W %M %e %Y') 'schedule_date',Date_Format(trainer_calendar.date_s_time_slot,'%h:%i %p') 'schedule_s_time',Date_Format(trainer_calendar.date_e_time_slot,'%h:%i %p') 'schedule_e_time',trainer_calendar.duration,demo_trial_courses.theme,demo_trial_courses.demo_course_id 'course_id',cv.name 'trainee_name',t.name 'trainer_name',t.user_id 'trainer_id',t.email 'trainer_email',t.contact 'trainer_contact',(case when live_class_mail_send.feedback_mail=1 then 'done' when live_class_mail_send.reschedule=1 then 'reschedule' else 'not_done' END) 'statusss',live_class_request.name 'parent_name',live_class_request.email 'parent_email',live_class_request.contact 'parent_contact' FROM `live_demo_course_assigned` left join feedback_status on (feedback_status.feedback_status_id = live_demo_course_assigned.feedback_status_id) left join demo_trial_courses on (demo_trial_courses.demo_course_id =live_demo_course_assigned.demo_course_id) left join cv_users cv on (cv.user_id =live_demo_course_assigned.user_id) left join cv_users t on (t.user_id =live_demo_course_assigned.trainer_id) left join live_class_mail_send on (live_class_mail_send.username =cv.username) left join trainer_calendar on (trainer_calendar.trainer_calender_id = live_demo_course_assigned.trainer_calender_id) left join live_class_request on (live_class_request.req_id =live_demo_course_assigned.req_id)  WHERE live_demo_course_assigned.sales_person_id=?";
          param = [item.user_id, item.name, item.user_id];
          await dbUtils
            .runSqlQueryAsyncSelect(query, param)
            .then(async (calendarResult) => {
              if (calendarResult.err) throw calendarResult.err;
              else {
                unique_date.push(calendarResult.result);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
        return res.send(unique_date);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
/***End sales management */

router.post("/getSuggestedCourses", (req, res) => {
  let params = req.body;

  let query = `SELECT live_course_id, live_course_name, description, live_course_slug, img, live_course_outcomes, grade, age_group, per_hour_price, duration, actual_price, course_price, course_theme, product_id FROM live_courses WHERE live_course_id in (${params.courses_ids})`;
  return dbUtils
    .runSqlQueryAsyncSelect(query, [])
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else {
        return res.send(dataResult.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/getTrialDataForSales", (req, res) => {
  let params = req.body;
  let query =
    "SELECT trainer_calendar.date_s_time_slot,live_demo_course_assigned.trainer_calender_id,live_demo_course_assigned.user_id'trainee_id',live_demo_course_assigned.assigned_id,live_demo_course_assigned.feedback_status_id,live_demo_course_assigned.sale_product_id,feedback_status.feedback_status,live_demo_course_assigned.feedback_message, trainer_calendar.date_e_time_slot, Date_Format(trainer_calendar.date_s_time_slot,'%W %M %e %Y') 'schedule_date',Date_Format(trainer_calendar.date_s_time_slot,'%h:%i %p') 'schedule_s_time',Date_Format(trainer_calendar.date_e_time_slot,'%h:%i %p') 'schedule_e_time',trainer_calendar.duration,demo_trial_courses.theme,demo_trial_courses.demo_course_id 'course_id',cv.name 'trainee_name',t.name 'trainer_name',t.user_id 'trainer_id',t.email 'trainer_email',t.contact 'trainer_contact',(case when live_class_mail_send.feedback_mail=1 then 'done' when live_class_mail_send.reschedule=1 then 'reschedule' else 'not_done' END) 'statusss',live_class_request.name 'parent_name',live_class_request.email 'parent_email',live_class_request.contact 'parent_contact',live_class_student_feedback.skills,  live_class_student_feedback.courses_ids,live_class_student_feedback.course_suggestion,live_class_student_feedback.comments,live_class_student_feedback.req_id FROM `live_demo_course_assigned` left join feedback_status on (feedback_status.feedback_status_id = live_demo_course_assigned.feedback_status_id) left join demo_trial_courses on (demo_trial_courses.demo_course_id =live_demo_course_assigned.demo_course_id) left join cv_users cv on (cv.user_id =live_demo_course_assigned.user_id) left join cv_users t on (t.user_id =live_demo_course_assigned.trainer_id) left join live_class_mail_send on (live_class_mail_send.username =cv.username) left join trainer_calendar on (trainer_calendar.trainer_calender_id = live_demo_course_assigned.trainer_calender_id) left join live_class_request on (live_class_request.req_id =live_demo_course_assigned.req_id) left join live_class_student_feedback on (live_class_student_feedback.req_id =live_demo_course_assigned.req_id)  WHERE live_demo_course_assigned.sales_person_id=?";
  let param = [params.user_id];
  return dbUtils.runSqlQueryAsyncSelect(query, param).then((dataResult) => {
    if (dataResult.err) throw dataResult.err;
    else {
      return res.send(dataResult);
    }
  });
});

router.post("/saveMyTraineeFeedback", (req, res) => {
  let params = req.body;
  //console.log(params);
  let query =
    "UPDATE `live_demo_course_assigned` SET `feedback_status_id`=?,`feedback_message`=?,`sale_product_id`=?,`sold_by`=? WHERE live_demo_course_assigned.assigned_id=?";
  let param = [
    params.feedbackStatus,
    params.feed_desc,
    params.product_id,
    params.user_id,
    params.assigned_id,
  ];
  return dbUtils
    .runSqlQueryAsyncUpdate(query, param)
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else {
        return res.send(dataResult.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/updateTrainerschedule", (req, res) => {
  let params = req.body,
    findindex,
    feedback;
  //console.log(params);
  query =
    "SELECT `booked_ids` FROM `trainer_calendar` WHERE trainer_calender_id=?";
  param = [params.trainer_calender_id];
  var certificateKeyword = params.certificate_keyword;
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else {
        if (params.booked == 0) {
          return "";
        } else {
          var bookedUserIds = dataResult.result[0].booked_ids;
          if (bookedUserIds) {
            let filterdatas = bookedUserIds
              .split(",")
              .filter((e) => e.length != 0);
            if (filterdatas.length == 1) {
              if (filterdatas != params.trainer_id) {
                bookedUserIds = bookedUserIds + "," + params.trainer_id;
              }
            } else {
              findindex = filterdatas.findindex((x) => x == params.trainer_id);
              if (findindex == -1) {
                bookedUserIds = bookedUserIds + "," + params.trainer_id;
              }
            }
          } else {
            bookedUserIds = params.trainer_id;
          }
          query =
            "UPDATE `trainer_calendar` SET  `booked_ids`=? WHERE trainer_calendar.trainer_calender_id=?";
          param = [bookedUserIds, params.trainer_calender_id];
          return dbUtils.runSqlQueryAsyncUpdate(query, param);
        }
      }
    })
    .then((updateResult) => {
      if (updateResult.err) throw updateResult.err;
      else {
        if (params.user_id) {
          query =
            "SELECT  `feedback_mail`  FROM `live_class_mail_send` INNER join cv_users on (cv_users.username = live_class_mail_send.username) WHERE cv_users.user_id=?";
          param = [params.user_id];
          return dbUtils.runSqlQueryAsyncSelect(query, param);
        } else {
          return "";
        }
      }
    })
    .then((dataForTest) => {
      if (dataForTest) {
        if (dataForTest.err) throw dataForTest.err;
        else {
          feedback = dataForTest.result[0].feedback_mail;
          let status;
          if (params.user_status == "done") status = 1;
          else status = 0;
          if (status == 0)
            query =
              "UPDATE `live_class_mail_send` SET  `feedback_mail`=?,`certificate_mail`=0, certificate_keyword=? where live_class_mail_send.username in (SELECT username from cv_users where user_id=?)";
          else
            query =
              "UPDATE `live_class_mail_send` SET  `feedback_mail`=?, certificate_keyword=? where live_class_mail_send.username in (SELECT username from cv_users where user_id=?)";
          param = [status, certificateKeyword, params.user_id];
          return dbUtils.runSqlQueryAsyncUpdate(query, param);
        }
      } else {
        return "";
      }
    })
    .then(async (dataUpdateResult) => {
      if (dataUpdateResult) {
        if (dataUpdateResult.err) throw dataUpdateResult.err;
        else {
          if (feedback == 0 && params.user_status == "done") {
            query =
              "SELECT live_class_request.email,live_class_request.contact,live_class_request.name 'parent_name',live_class_request.kids_name FROM `live_class_request` inner join live_demo_course_assigned on (live_demo_course_assigned.req_id =live_class_request.req_id) WHERE live_demo_course_assigned.user_id=?";
            param = [params.user_id];
            return dbUtils.runSqlQueryAsyncSelect(query, param);
            //feedbackMail
          } else {
            return "";
          }
        }
      } else {
        return "";
      }
    })
    .then(async (finalresult) => {
      if (finalresult) {
        if (finalresult.err) throw finalresult.err;
        else {
          await feedbackMail(finalresult.result);
          await ThankyouSMS(finalresult.result);
          res.send(finalresult);
        }
      } else {
        res.send(finalresult);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/getSalesPersonId", (req, res) => {
  let query =
    "SELECT cv_users.user_id FROM `cv_users` inner join cv_school_detail on (cv_school_detail.sch_id =cv_users.sch_id) WHERE (cv_school_detail.cv_pid=4 or cv_users.sales=1) and cv_users.role_id<>1 and cv_users.status=1";
  return dbUtils.runSqlQueryAsyncSelect(query, []).then((dataResult) => {
    if (dataResult.err) throw dataResult.err;
    else {
      return res.send(dataResult.result);
    }
  });
});

router.post("/getAllTrainerCourses", (req, res) => {
  let params = req.body;
  return dbUtils
    .runSqlQueryAsyncSelect(
      "SELECT trainer_subjects.trainer_sub_id,trainer_subjects.course_id,(CASE WHEN trainer_subjects.course_type='demo' then demo_trial_courses.demo_course_name else live_courses.live_course_name end) 'course_name' FROM `trainer_subjects` left join demo_trial_courses on (demo_trial_courses.demo_course_id =trainer_subjects.course_id and trainer_subjects.course_type='demo') left JOIN live_courses on (live_courses.live_course_id =trainer_subjects.course_id and trainer_subjects.course_type='live') GROUP by trainer_subjects.course_id",
      []
    )
    .then(async (dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else {
        return res.send(dataResult.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/getAllTrainerList", (req, res) => {
  return dbUtils
    .runSqlQueryAsyncSelect(
      "SELECT cv_users.user_id,cv_users.name from cv_users where trainer=1 and cv_users.status=1",
      []
    )
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else {
        return res.send(dataResult.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

/**URl Redirect */
router.post("/getMyLiveClassDetails", (req, res) => {
  let params = req.body;
  let currentDate = new Date();
  currentDate = currentDate.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  currentDate = new Date(currentDate);
  query = `SELECT trainer_calendar.date_s_time_slot,trainer_calendar.date_e_time_slot,'${currentDate}' as 'currentDate',trainer_class_link.class_link FROM live_demo_course_assigned inner join trainer_calendar on (trainer_calendar.trainer_calender_id =live_demo_course_assigned.trainer_calender_id) inner join trainer_class_link on (trainer_class_link.t_class_link_id = live_demo_course_assigned.t_class_link_id) WHERE live_demo_course_assigned.req_id=? and live_demo_course_assigned.user_id=?`;
  return dbUtils
    .runSqlQueryAsyncSelect(query, [params.req_id, params.user_id])
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else {
        return res.send(dataResult.result);
      }
    });
});
/****End URL Redirect */

router.post("/sendRequestForScheduleMail", (req, res) => {
  let params = req.body,
    class_link,
    sales_name,
    sales_email;
  var dateFormat = require("dateformat");
  var s_date = new Date(params.date_s_time_slot);
  var s_date1 = dateFormat(s_date, "yyyy-mm-dd");
  var s_time = dateFormat(s_date, "HH:MM");
  
  let insertreqId, user_id, username, password;
  let query = `SELECT trainer_calendar.trainer_calender_id FROM trainer_calendar WHERE (trainer_calendar.booked_ids IS NULL or !FIND_IN_SET(${params.trainer_id},booked_ids)) and trainer_calendar.trainer_calender_id=${params.trainer_calender_id} and trainer_calendar.trainer_calender_id not in (SELECT trainer_calender_id from live_demo_course_assigned where live_demo_course_assigned.trainer_id= ${params.trainer_id})`;
  let param = [];
  /* "SELECT trainer_calendar.trainer_calender_id FROM `trainer_calendar` WHERE (trainer_calendar.booked_ids IS NULL or !FIND_IN_SET(?,booked_ids)) and trainer_calendar.trainer_calender_id=? and trainer_calendar.trainer_calender_id not in (SELECT trainer_calender_id from live_demo_course_assigned where live_demo_course_assigned.trainer_id=?)";
  let param = [
    params.trainer_id,
    params.trainer_calender_id,
    params.trainer_id
  ];*/

  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then((Datarespons) => {
      if (Datarespons.err) throw Datarespons.err;
      else if (Datarespons && Datarespons.result.length) {
        query =
          "SELECT * FROM `live_class_request` WHERE name=? and live_class_request.email=? and live_class_request.contact=? and live_class_request.kids_name=?";
        param = [
          params.parent_name,
          params.parent_mail,
          params.parent_contact,
          params.kids_name,
        ];
        return dbUtils
          .runSqlQueryAsyncSelect(query, param)
          .then((dataResult) => {
            if (dataResult.err) throw dataResult.err;
            else if (dataResult.result.length) return "";
            else if (params.req != undefined && params.req_id != 0)
              return Datarespons;
            else {
              return dbUtils.runSqlQueryAsyncInsert(
                "INSERT INTO `live_class_request`(`name`, `email`, `contact`,`kids_name`,`city`, `state`, `country`) VALUES (?,?,?,?,?,?,?)",
                [
                  params.parent_name,
                  params.parent_mail,
                  params.parent_contact,
                  params.kids_name,
                  params.city,
                  params.state,
                  params.country,
                ]
              );
            }
          })
          .then(async (result) => {
            if (result) {
              console.log("Insert Rsult");
              console.log(result);
              if (result.err) throw result.err;
              else {
                insertreqId =
                  params.req_id != 0
                    ? params.req_id
                    : result && result.result.length
                    ? result.insertId
                    : "0";
                if (insertreqId === undefined) insertreqId = result.insertId;
                if (insertreqId != 0) {
                  password = await genpassword();
                  username = params.kids_name.replace(/[^a-zA-Z ]/g, " ");
                  username = username.replace(/\s/g, "").toLowerCase();
                  username = await checkUser(username);
                  let new_path = "codevidhya/" + username;
                  userpath = await createfolder(new_path);
                  password = await genpassword();
                  query =
                    "INSERT INTO `cv_users`(`sch_id`, `role_id`, `name`, `username`, `password`, `path`,`status`,`country`, `state`, `city`) VALUES (1,3,?,?,?,?,?,?,?,?)";
                  let param = [
                    params.kids_name,
                    username,
                    password,
                    userpath,
                    1,
                    params.country,
                    params.state,
                    params.city,
                  ];
                  return await dbUtils.runSqlQueryAsyncInsert(query, param);
                } else {
                  return "";
                }
              }
            } else {
              return "";
            }
          })
          .then(async (dataUResult) => {
            if (dataUResult) {
              if (dataUResult.err) throw dataUResult.err;
              else {
                user_id = dataUResult.insertId;
                if (params.grade != 0)
                  query =
                    "INSERT INTO `cv_st_detail`(`user_id`, `sch_id`, `cls_id`,`institute_name`) VALUES (?,1,(SELECT cv_classes.cls_id FROM `cv_classes` WHERE cv_classes.cls_name=?),?)";
                else
                  query =
                    "INSERT INTO `cv_st_detail`(`user_id`, `sch_id`, `cls_id`,`institute_name`) VALUES (?,1,?,?)";
                param = [user_id, params.grade, params.institute_name];
                return await dbUtils.runSqlQueryAsyncInsert(query, param);
              }
            } else {
              return "";
            }
          })
          .then(async (dataUCResult) => {
            if (dataUCResult) {
              if (dataUCResult.err) throw dataUCResult.err;
              else {
                query =
                  "INSERT INTO `live_demo_course_assigned`(`req_id`, `user_id`, `demo_course_id`, `trainer_id`,`session_date`, `session_time`, `t_class_link_id`,`trainer_calender_id`,`sales_person_id`)VALUES (?,?,?,?,?,?,?,?,?)"; //"INSERT INTO `live_demo_course_assigned`(`req_id`, `user_id`, `demo_course_id`, `trainer_id`, `t_class_link_id`,`trainer_calender_id`)VALUES (?,?,?,?,?,?)";
                param = [
                  insertreqId,
                  user_id,
                  params.demo_course_id,
                  params.trainer_id,
                  s_date1,
                  s_time,
                  params.t_class_link_id,
                  params.trainer_calender_id,
                  params.sales_person_id,
                ]; //[insertreqId,user_id,params.demo_course_id,params.trainer_id,params.t_class_link_id,params.trainer_calender_id];
                return await dbUtils.runSqlQueryAsyncInsert(query, param);
              }
            } else {
              return "";
            }
          })
          .then(async (assignedResult) => {
            if (assignedResult) {
              if (assignedResult.err) throw assignedResult.err;
              else {
                query =
                  "INSERT INTO `live_class_mail_send`(`mail_send_date`, `username`, `status`, `time`,`platform`) VALUES (?,?,?,?,?)";
                param = [s_date1, username, 0, s_time, 1];
                return await dbUtils.runSqlQueryAsyncInsert(query, param);
                //console.log("success");
                //res.send(assignedResult);
              }
            } else {
              return "";
            }
          })
          .then(async (dataResult) => {
            if (dataResult) {
              if (dataResult.err) throw dataResult.err;
              else {
                query =
                  "SELECT cv_users.name,cv_users.email FROM `cv_users` WHERE user_id=?";
                param = [params.sales_person_id];

                return await dbUtils.runSqlQueryAsyncSelect(query, param);
              }
            } else {
              return "";
            }
          })
          .then(async (dataResultForCVMail) => {
            if (dataResultForCVMail) {
              if (dataResultForCVMail.err) throw dataResultForCVMail.err;
              else {
                sales_name = dataResultForCVMail.result[0].name;
                sales_email = dataResultForCVMail.result[0].email;

                query =
                  "SELECT cv_users.name,cv_users.email FROM `cv_users` WHERE user_id=?";
                param = [params.trainer_id];

                return await dbUtils.runSqlQueryAsyncSelect(query, param);
              }
            } else {
              return "";
            }
          })
          .then(async (dataResultAssigned) => {
            if (dataResultAssigned) {
              if (dataResultAssigned.err) throw dataResultAssigned.err;
              else {
                  await salesPersonFollowUpMail({
                  theme: params.theme,
                  sales_person_name: sales_name,
                  sales_person_email: sales_email,
                  s_date: s_date1,
                  s_time: s_time,
                  kids: params.kids_name,
                  parent_name: params.parent_name,
                  parent_mail: params.parent_mail,
                  parent_contact: params.parent_contact,
                  trainer_name: dataResultAssigned.result[0].name,
                });
                let scheduleMailD = await sendScheduleMail({
                  theme: params.theme,
                  kids: params.kids_name,
                  parent_name: params.parent_name,
                  parent_mail: params.parent_mail,
                  s_date: s_date1,
                  s_time: s_time,
                  username: username,
                  password: password,
                  reqId:insertreqId,
                  class_link: params.class_link,
                });
                await sendScheduleSMS({
                  theme: params.theme,
                  kids: params.kids_name,
                  parent_name: params.parent_name,
                  parent_contact: params.parent_contact,
                  s_date: s_date1,
                  s_time: s_time,
                  username: username,
                  password: password,
                  class_link: params.class_link,
                });
                // await remainderSMS({theme:params.theme,contact:params.parent_contact,kids:params.kids_name,parent_name:params.parent_name,parent_mail:params.parent_mail,s_date:s_date1,s_time:s_time,username:username,password:password,class_link:params.class_link});
                // console.log(scheduleMailD);
                if (dataResultAssigned.result[0].email) {
                  //   console.log('trainer mail')
                  await trainerMail({
                    theme: params.theme,
                    trainer_name: dataResultAssigned.result[0].name,
                    trainer_email: dataResultAssigned.result[0].email,
                    s_date: s_date1,
                    s_time: s_time,
                    kids: params.kids_name,
                  });
                }
                res.send(dataResultAssigned);
              }
            } else {
              //  console.log("else result");
              return res.send("err result");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        return res.send("booked");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/getCompletedDemoSessionsListForCurrentStudent", (req, res) => {
  if (!req.session.user_id) {
    return res.status(403).send("unauthorized");
  }

  return dbUtils
    .runSqlQueryAsyncSelect(
      `
    SELECT * FROM cv_users
    WHERE user_id=?
  `,
      [req.session.user_id]
    )
    .then((result) => {
      if (!result.result.length) throw new Error("unauthorized");
      return dbUtils.runSqlQueryAsyncSelect(
        `
        SELECT * FROM live_class_mail_send
        WHERE username=? and platform=1
        `,
        [result.result[0].username]
      );
    });
});

async function salesPersonFollowUpMail(...details) {
  await asyncforEach(details, async (detail, index) => {
    // console.log("call sales person");
    // console.log("call trainer call");
    const mailgun = require("mailgun-js");
    const DOMAIN = "mail.codevidhya.com";
    const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
    const mg = mailgun({ apiKey: api, domain: DOMAIN });
    const data = {
      from: "Codevidhya <contact@codevidhya.com>",
      to: detail.sales_person_email,
      cc: "cvlivebookings@codevidhya.com",
      subject: `Request for DEMO class - (${detail.s_date} ${detail.s_time}) is added to your queue`,
      html: `<html>
      <body>
      <p><b><h3>Hi ${detail.sales_person_name}</h3></b></p>
      <p>Follow up of a new booking is in queue</p>
      <p>Please contact them using following details to book a slot:<br/>
      <b>Student Name:</b>${detail.kids} <br/>
      <b>Trainer Name:</b>${detail.trainer_name}<br/>
      <b>Date:</b> ${detail.s_date}<br/>
      <b>Time:</b> ${detail.s_time}<br/>
      <b>Module:</b> ${detail.theme}
      </p>
      </body>
      </html>`,
    };
    return mg.messages().send(data);
  });
}

async function trainerMail(...details) {
  await asyncforEach(details, async (detail, index) => {
    // console.log("call trainer call");
    const mailgun = require("mailgun-js");
    const DOMAIN = "mail.codevidhya.com";
    const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
    const mg = mailgun({ apiKey: api, domain: DOMAIN });
    const data = {
      from: "Codevidhya <contact@codevidhya.com>",
      to: detail.trainer_email,
      cc: "cvlivebookings@codevidhya.com",
      subject: `Your Demo schedule (${detail.s_date} ${detail.s_time})`,
      html: `<html>
    <body>
    <p><b><h3>Hi ${detail.trainer_name}</h3></b></p>
    <p> Your Demo Session with ${detail.kids} is confirmed.<br/>
    Date: ${detail.s_date}<br/>
    Time: ${detail.s_time}<br/>
    Module: ${detail.theme}
    </p>
    </body>
    </html>`,
    };
    return mg.messages().send(data);
  });
}

async function preTrainerMail(...details) {
  // console.log(details);
  await asyncforEach(details, async (detail, index) => {
    // console.log("call pre trainer call");
    const mailgun = require("mailgun-js");
    const DOMAIN = "mail.codevidhya.com";
    const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
    const mg = mailgun({ apiKey: api, domain: DOMAIN });
    const data = {
      from: "Codevidhya <contact@codevidhya.com>",
      to: detail.trainer_email,
      cc: "cvlivebookings@codevidhya.com",
      subject: `Your DEMO Session (${detail.s_date} ${detail.s_time}) is rescheduled /cancelled`,
      html: `<html>
      <body>
      <p><b><h3>Hi ${detail.trainer_name}</h3></b></p>
      <p> Your Demo Session with ${detail.kids} is rescheduled/cancelled<br/>
      <p>(${detail.s_date} ${detail.s_time}) slot is available for new users.</p>
      </p>
      </body>
      </html>`,
    };
    return mg.messages().send(data);
  });
}

async function reschedulemail(...details) {
  //console.log("call reschedule mail call");
  await asyncforEach(details, async (detail, index) => {
    const mailgun = require("mailgun-js");
    const DOMAIN = "mail.codevidhya.com";
    const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
    const mg = mailgun({ apiKey: api, domain: DOMAIN });
    const data = {
      from: "Codevidhya <contact@codevidhya.com>",
      to: detail.parent_mail,
      cc: "cvlivebookings@codevidhya.com",
      subject: `${detail.kids}'s Coding Class is Rescheduled `,
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
                        <h4 style="font-size: 20px;">Dear ${detail.parent_name}</h4>
                    </td>
                </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style=""><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"> ${detail.kids}'s FREE demo has been rescheduled as per the following details:</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p></td> 
                 </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding:0;Margin:0;">
                  <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><strong>Date : </strong> ${detail.s_date}<br/><strong>Timing : </strong>${detail.s_time} Hrs<br/><strong>Module : </strong>${detail.theme} </p></td> 
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
         Kindly find the exclusive link to join ${detail.kids}'s class below:<br/>
         </p>
         <p style="Margin:10;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
         <center><a style="text-decoration:none;padding:8px 16px; background:#008dd2;color:#fff" href="${detail.class_link}" target="_blank">Join Class </a></center>
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
          Once this demo session is complete, ${detail.kids} will be eligible for a certificate from Codevidhya, which you can proudly share with your friends and family.
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
}

async function sendScheduleSMS(...details) {
  //console.log("schedule SMS");
  var msg91 = require("msg91")("330557AG4QIikx45T5ecf9d0bP1", "CVLIVE", "4");
  await asyncforEach(details, async (detail, index) => {
    const axios = require("axios");
    let contactN = detail.parent_contact;
    contactN = contactN.replace(/\s+/g, "");
    contactN = contactN.replace("+", "");
    message = `Congratulations ${detail.kids}
    Your CV Live demo session is confirmed.
       Date : ${detail.s_date}
       Timing : ${detail.s_time} Hrs
   Here is the exclusive link to join your class:
   ${detail.class_link}
   Refer to your mailbox for details`;
    let contact = contactN;
    msg91.send(contact, message, (err, response) => {
      if (err) console.log(err);
      // console.log(response);
    });
  });
}

async function sendScheduleMail(...details) {
  console.log("schedule mail");
  await asyncforEach(details, async (detail, index) => {
    const mailgun = require("mailgun-js");
    const DOMAIN = "mail.codevidhya.com";
    const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
    const mg = mailgun({ apiKey: api, domain: DOMAIN });
    const data = {
      from: "Codevidhya <contact@codevidhya.com>",
      to: detail.parent_mail,
      cc: "cvlivebookings@codevidhya.com",
      subject: `${details[0].kids}'s Coding Class is Confirmed `,
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
                        <h4 style="font-size: 20px;">Dear ${details[0].parent_name}</h4>
                    </td>
                </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style=""><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">Congratulations! ${details[0].kids}'s FREE demo has been scheduled as per the following details:</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p></td> 
                 </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding:0;Margin:0;">
                  <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><strong>Date : </strong> ${details[0].s_date}<br/><strong>Timing : </strong>${details[0].s_time} Hrs<br/><strong>Module : </strong>${details[0].theme} </p></td> 
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
         Kindly find the exclusive link to join ${details[0].kids}'s class below:<br/>
         </p>
         <p style="Margin:10;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
         <!--<center><a style="text-decoration:none;padding:8px 16px; background:#008dd2;color:#fff" href="${details[0].class_link}" target="_blank">Join Class </a></center>-->
         <center><a style="text-decoration:none;padding:8px 16px; background:#008dd2;color:#fff" href="https://test.codevidhya.com/live-class?reqId=${reqId}" target="_blank">Join Class </a></center>
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
            <strong>Username : </strong>${details[0].username}<br/>
            <strong>Password : </strong>${details[0].password}<br/>
            </p>
            </td>
            </tr>
         <tr style="border-collapse:collapse;">
         <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
         <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
          <tr style="border-collapse:collapse;">
          <td align="left">
          <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
          Once this demo session is complete, ${details[0].kids} will be eligible for a certificate from Codevidhya, which you can proudly share with your friends and family.
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
  }).catch((err) => {
    return err;
  });
}

/****remainder and reschedule mail */
async function trainerRemainderMail(...details) {
  console.log("trainer reminder call");
  await asyncforEach(details, async (detail, index) => {
    const mailgun = require("mailgun-js");
    const DOMAIN = "mail.codevidhya.com";
    const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
    const mg = mailgun({ apiKey: api, domain: DOMAIN });
    const data = {
      from: "Codevidhya <contact@codevidhya.com>",
      to: detail.trainer_email,
      cc: "cvlivebookings@codevidhya.com",
      subject: `Reminder for ${detail.kids_name}'s Coding Class…Starts Soon!`,
      html: `<html>
      <body>
      <p><b><h3>Hi ${detail.trainer_name}</h3></b></p>
      <p> Your Demo Session with ${detail.kids_name} is on your ${detail.class_link}<br/>
      Date: ${detail.mail_send_date}<br/>
      Time: ${detail.time}<br/>
      Module: ${detail.theme}
      </p>
      </body>
      </html>`,
    };
    return mg.messages().send(data);
  });
}

async function remainderSMS(...details) {
  console.log("remainder SMS");

  var msg91 = require("msg91")("330557AG4QIikx45T5ecf9d0bP1", "CVLIVE", "4");
  await asyncforEach(details, async (detail, index) => {
    const axios = require("axios");
    let contactN = detail.contact;
    contactN = contactN.replace(/\s+/g, "");
    contactN = contactN.replace("+", "");
    let sch_date, sch_time;
    sch_date =
      detail.reschedule == 1 ? detail.reschedule_date : detail.mail_send_date;
    sch_time = detail.reschedule == 1 ? detail.reschedule_time : detail.time;
    message = `${detail.kids_name}
    A gentle reminder for your demo class scheduled at:
       Date : ${sch_date}
       Timing : ${sch_time} Hrs
       Module : ${detail.theme}
   Here is the exclusive link to join your class:
   ${detail.class_link}
   Join the classroom 5 minutes before the scheduled time.
   Codevidhya credentials for hands-on:
       Username : ${detail.username}
       Password : ${detail.password}
   Login to www.codevidhya.com 
   
   Refer to your mailbox for details.`;
    let contact = contactN;
    msg91.send(contact, message, (err, response) => {
      if (err) console.log(err);
      console.log(response);
    });
    //url = `https://api.textlocal.in/send/?apikey=JDA6Ts2/cNM-lYbBIMfebb30NCtWxpaST3CvrajE9f&sender=CODVDY&numbers=${contact}&message=${message}`;

    /*axios.get(url).then((result) => {
      console.log(result.data);
    });*/
  });
}

async function remainderMail(...details) {
  console.log("reminder call");
  await asyncforEach(details, async (detail, index) => {
    const mailgun = require("mailgun-js");
    const DOMAIN = "mail.codevidhya.com";
    const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
    const mg = mailgun({ apiKey: api, domain: DOMAIN });
    const data = {
      from: "Codevidhya <contact@codevidhya.com>",
      to: detail.parent_email,
      cc: "cvlivebookings@codevidhya.com",
      subject: `Reminder for ${detail.kids_name}'s Coding Class…Starts Soon!`,
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
                      <h4 style="font-size: 20px;">Dear ${detail.parent_name}</h4>
                  </td>
              </tr> 
               <tr style="border-collapse:collapse;"> 
                <td align="left" style=""><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                A gentle reminder for ${detail.kids_name}'s FREE Coding Class, starting soon!
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
                <strong>Date : </strong> ${detail.mail_send_date}<br/>
                <strong>Timing : </strong>${detail.time} Hrs<br/>
                <strong>Module : </strong>${detail.theme} </p></td> 
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
       Kindly find the exclusive link to join ${detail.kids_name}'s class below:<br/>
       </p>
       <p style="Margin:10;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
         <center><a style="text-decoration:none;padding:8px 16px; background:#008dd2;color:#fff" href="${detail.class_link}" target="_blank">Join Class </a></center>
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
        Once this demo session is complete, ${detail.kids_name} will be eligible for a certificate from Codevidhya, which you can proudly share with your friends and family
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
/*end reminder mail */
async function CertificateSMS(...details) {
  console.log("schedule SMS");
  var msg91 = require("msg91")("330557AG4QIikx45T5ecf9d0bP1", "CVLIVE", "4");
  await asyncforEach(details, async (detail, index) => {
    const axios = require("axios");
    let contactN = detail.contact;
    contactN = contactN.replace(/\s+/g, "");
    contactN = contactN.replace("+", "");
    message = `Dear ${detail.kids_name}

    Congratulations on completing your demo session with CV Live.
    
    Here is the link to your Completion Certificate-
    https://codevidhya.com/live-class/certificate
    
    Codevidhya wishes you a great Coding journey ahead.`;

    let contact = contactN;
    msg91.send(contact, message, (err, response) => {
      if (err) console.log(err);
      console.log(response);
    });
  });
}
/****feedback Mail function */
async function certificateMail(...details) {
  /***feedback mail */
  await asyncforEach(details, async (detail, index) => {
    const mailgun = require("mailgun-js");
    const DOMAIN = "mail.codevidhya.com";
    const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
    const mg = mailgun({ apiKey: api, domain: DOMAIN });
    const data = {
      from: "Codevidhya <contact@codevidhya.com>",
      to: detail.parent_email,
      cc: "cvlivebookings@codevidhya.com",
      subject: `${detail.kids_name}'s  Demo Completion Certificate`,
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
                          <h4 style="font-size: 20px;">Dear ${detail.kids_name}</h4>
                      </td>
                  </tr> 
                   <tr style="border-collapse:collapse;"> 
                    <td align="left" style="">
                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"> 
                    We are glad you chose Codevidhya for taking up the opportunity to be Creator of Technology by learning to Code. 
                    </p>
                    </td> 
                   </tr> 
                   <tr style="border-collapse:collapse;"> 
                    <td align="left" style="padding-top:20px;>
                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                    Congratulations on successful completion of your first Coding Class. Here's your Certificate of Completion that you can proudly share with your friends and family.
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
            <!-- <tr style="border-collapse:collapse;">
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
           </tr>-->
           <tr style="border-collapse:collapse;">
           <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
           <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
           <tr style="border-collapse:collapse;">
           <td align="left">
           <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
           Codevidhya wishes you great Coding journey ahead.
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

  /***End Certificate mail */
}
async function ThankyouSMS(...details) {
  console.log("Thank you SMS");
  await asyncforEach(details, async (detail, index) => {
    var msg91 = require("msg91")("330557AG4QIikx45T5ecf9d0bP1", "CVLIVE", "4");
    await asyncforEach(details, async (detail, index) => {
      console.log(detail);
      const axios = require("axios");
      let contactN = detail[0].contact;
      contactN = contactN.replace(/\s+/g, "");
      contactN = contactN.replace("+", "");
      message = `Dear ${detail[0].kids_name}
    Congratulations on completing your demo session with CV Live.
    
    Share your valuable feedback here-
    https://docs.google.com/forms/d/e/1FAIpQLSeHFcopECJbalve5LWlcdLYwLd0JCRTdThloukXQIRDQI59Hw/viewform
    
    We would love to hear from you.`;

      let contact = contactN;
      msg91.send(contact, message, (err, response) => {
        if (err) console.log(err);
        console.log(response);
      });
    });
  });
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
      to: detail[0].email,
      cc: "cvlivebookings@codevidhya.com",
      subject: `${detail[0].kids_name}'s Feedback`,
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
                        <h4 style="font-size: 20px;">Dear ${detail[0].kids_name}</h4>
                    </td>
                </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="">
                  <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"> 
                  Thank your for trusting Codevidhya to embark on your Coding journey.
                  </p>
                  </td> 
                 </tr> 
                 <!--<tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding-top:20px;>
                  <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                  Congratulations on successful completion of your first Coding Class. As part of our efforts to understand your experience, we request your honest feedback
                  </p>
                  <p style="Margin:10;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                  <center><a style="text-decoration:none;padding:8px 16px; background:#008dd2;color:#fff" href="https://codevidhya.com/live-class/certificate" target="_blank">Certificate of Completion </a></center>
                  </p>
                  </td> 
                 </tr> -->
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
           Thank your for trusting Codevidhya to embark on your Coding journey.
           </p>
           <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
           Congratulations on successful completion of your first Coding Class. As part of our efforts to understand your experience, we request your honest feedback
           </p>
           <p style="Margin:10;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
           <center><a style="text-decoration:none;padding:8px 16px; background:#008dd2;color:#fff" href="https://docs.google.com/forms/d/e/1FAIpQLSeHFcopECJbalve5LWlcdLYwLd0JCRTdThloukXQIRDQI59Hw/viewform" target="_blank">Give Feedback </a></center>
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
/***end Feedbackmail */
setInterval(scheduleMailer, 60000);
//scheduleMailer();
function scheduleMailer() {
  console.log("scheduleMailer call");
  let s_date, s_time;
  let query =
    "SELECT `mail_id`, DATE_FORMAT(live_class_mail_send.mail_send_date,'%m/%d/%Y') mail_send_date,live_class_mail_send.status,live_class_mail_send.time,live_class_mail_send.reschedule, DATE_FORMAT(live_class_mail_send.reschedule_date,'%m/%d/%Y') reschedule_date,live_class_mail_send.reschedule_time, live_class_mail_send.remainder_mail, live_class_mail_send.feedback_mail,live_class_mail_send.certificate_mail,demo_trial_courses.theme 'theme',trainer_class_link.class_link,cvt.name 'trainer_name',cvt.email 'trainer_email',live_class_request.email 'parent_email',live_class_request.name 'parent_name',live_class_request.contact,live_class_request.kids_name,cv_users.username,cv_users.password FROM `live_class_mail_send` inner join cv_users on (live_class_mail_send.username=cv_users.username) inner join live_demo_course_assigned on (live_demo_course_assigned.user_id = cv_users.user_id) inner join live_class_request on (live_class_request.req_id =live_demo_course_assigned.req_id) inner join cv_users cvt on (cvt.user_id =live_demo_course_assigned.trainer_id) inner join demo_trial_courses on (demo_trial_courses.demo_course_id =live_demo_course_assigned.demo_course_id) inner join trainer_class_link on (live_demo_course_assigned.t_class_link_id =trainer_class_link.t_class_link_id) where live_class_mail_send.platform=1";
  //"SELECT `mail_id`, DATE_FORMAT(live_class_mail_send.mail_send_date,'%m/%d/%Y') mail_send_date,live_class_mail_send.status,live_class_mail_send.time,live_class_mail_send.reschedule, DATE_FORMAT(live_class_mail_send.reschedule_date,'%m/%d/%Y') reschedule_date,live_class_mail_send.reschedule_time, live_class_mail_send.remainder_mail, live_class_mail_send.feedback_mail,demo_trial_courses.theme 'theme',trainer_class_link.class_link,cvt.name 'trainer_name',cvt.email 'trainer_email',live_class_request.email 'parent_email',live_class_request.name 'parent_name',live_class_request.contact,live_class_request.kids_name,cv_users.username,cv_users.password FROM `live_class_mail_send` inner join cv_users on (live_class_mail_send.username=cv_users.username) inner join live_demo_course_assigned on (live_demo_course_assigned.user_id = cv_users.user_id) inner join live_class_request on (live_class_request.req_id =live_demo_course_assigned.req_id) inner join cv_users cvt on (cvt.user_id =live_demo_course_assigned.trainer_id) inner join demo_trial_courses on (demo_trial_courses.demo_course_id =live_demo_course_assigned.demo_course_id) inner join trainer_class_link on (live_demo_course_assigned.t_class_link_id =trainer_class_link.t_class_link_id) where live_class_mail_send.remainder_mail=0 or live_class_mail_send.feedback_mail=0 and live_class_mail_send.platform=1";
  return dbUtils
    .runSqlQueryAsyncSelect(query, [])
    .then(async (dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else {
        let details = dataResult.result;
        await asyncforEach(details, async (detail, index) => {
          if (detail.remainder_mail == 0) {
            if (detail.reschedule == 1) {
              s_date = detail.reschedule_date;
              s_time = detail.reschedule_time;
            } else {
              s_date = detail.mail_send_date;
              s_time = detail.time;
            }
            let time = s_time.split(":");

            let currentDate = new Date();
            var dateSch = new Date(s_date);
            /*dateSch =dateSch.toLocaleString("en-US", {
            timeZone: "Asia/Kolkata"
            });*/
            dateSch = new Date(dateSch);

            dateSch.setMinutes(dateSch.getMinutes() + parseInt(time[1]));
            dateSch.setHours(dateSch.getHours() + parseInt(time[0]));
            dateSch = new Date(dateSch);
            currentDate = currentDate.toLocaleString("en-US", {
              timeZone: "Asia/Kolkata",
            });
            currentDate = new Date(currentDate);
            let diff = (dateSch.getTime() - currentDate.getTime()) / 1000;
            diff /= 60;
            diff = Math.round(diff);

            if (diff <= 60 && diff >= 0) {
              query =
                "UPDATE `live_class_mail_send` SET `remainder_mail`=1 where `platform`=1 and live_class_mail_send.mail_id=?";
              param = [detail.mail_id];
              return dbUtils
                .runSqlQueryAsyncUpdate(query, param)
                .then(async (updatedResults) => {
                  if (updatedResults) {
                    if (updatedResults.err) throw updatedResults.err;
                    else {
                      await remainderMail(detail);
                      await trainerRemainderMail(detail);
                      if (detail.contact) await remainderSMS(detail);
                    }
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }
          console.log(detail.certificate_mail);
          /****Certificate mail */
          if (detail.certificate_mail == 0 && detail.feedback_mail == 1) {
            //console.log("certificate call")
            if (detail.reschedule == 1) {
              s_date = detail.reschedule_date;
              s_time = detail.reschedule_time;
            } else {
              s_date = detail.mail_send_date;
              s_time = detail.time;
            }
            let time = s_time.split(":");

            let currentDate = new Date();
            var dateSch = new Date(s_date);
            /*dateSch =dateSch.toLocaleString("en-US", {
            timeZone: "Asia/Kolkata"
            });*/
            dateSch = new Date(dateSch);

            dateSch.setMinutes(dateSch.getMinutes() + parseInt(time[1]));
            dateSch.setHours(dateSch.getHours() + parseInt(time[0]));
            dateSch = new Date(dateSch);
            currentDate = currentDate.toLocaleString("en-US", {
              timeZone: "Asia/Kolkata",
            });
            currentDate = new Date(currentDate);
            //   console.log(dateSch + " " + currentDate);
            let diff = (currentDate.getTime() - dateSch.getTime()) / 1000;
            // console.log("sdfsdf");
            //  console.log(diff);
            if (diff >= 720) {
              query =
                "UPDATE `live_class_mail_send` SET `certificate_mail`=1 where `platform`=1 and live_class_mail_send.mail_id=?";
              param = [detail.mail_id];
              return dbUtils
                .runSqlQueryAsyncUpdate(query, param)
                .then(async (updatedResults) => {
                  if (updatedResults) {
                    if (updatedResults.err) throw updatedResults.err;
                    else {
                      await certificateMail(detail);
                      await CertificateSMS(detail);
                    }
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }
          /****End Certificate mail */
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
/****End remainder and reschedule mail */
async function createfolder() {
  dir = appRoot + "/Codeplay/" + arguments[0];
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  return arguments[0];
}

async function checkUser(username) {
  return await dbUtils
    .runSqlQueryAsyncSelect("SELECT username FROM cv_users  WHERE username=?", [
      username,
    ])
    .then(async (res) => {
      if (res.err) throw res.err;
      else if (res.result.length) {
        username += Math.floor(Math.random() * username.length);
        return await checkUser(username);
      } else return username;
    })
    .catch((err) => {
      console.log(err);
    });
}
genpassword = function() {
  var text = "";
  var possible = "abcdefghjkmnpqrstuvwxyz23456789@#$^*";
  for (var i = 0; i <= 5; i++) {
    text = text + possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

router.post("/getTrainersAccordingList", (req, res) => {
  let params = req.body;
  return dbUtils
    .runSqlQueryAsyncSelect(
      "SELECT trainer_subjects.trainer_sub_id,cv_users.name,cv_users.email 'trainer_email',cv_users.contact 'trainer_contact',trainer_subjects.user_id,trainer_class_link.t_class_link_id,trainer_class_link.class_link FROM `trainer_subjects` inner join cv_users on (cv_users.user_id =trainer_subjects.user_id and trainer_subjects.course_type='demo') left join trainer_class_link on (trainer_class_link.user_id = cv_users.user_id and (trainer_subjects.course_id =trainer_class_link.course_id or trainer_class_link.course_id=0)) WHERE trainer_subjects.course_id =? and trainer_subjects.course_type='demo'",
      [params.course_id]
    )
    .then((result) => {
      return res.send(result.result);
    });
});
router.post("/gettraineravailableTimeSlots", (req, res) => {
  let params = req.body;

  return dbUtils
    .runSqlQueryAsyncSelect(
      "SELECT trainer_calendar.trainer_calender_id,trainer_calendar.date_s_time_slot,Date_Format(trainer_calendar.date_s_time_slot,'%W %M %e %Y') 'schedule_date',Date_Format(trainer_calendar.date_s_time_slot,'%h:%i %p') 'schedule_s_time',Date_Format(trainer_calendar.date_e_time_slot,'%h:%i %p') 'schedule_e_time',trainer_calendar.date_e_time_slot,DATE_FORMAT(trainer_calendar.date_s_time_slot,'%Y-%m-%d') 'date',trainer_calendar.booked_ids FROM `trainer_calendar` WHERE find_in_set(?,trainer_calendar.user_ids) and trainer_calendar.trainer_calender_id not in(select live_demo_course_assigned.trainer_calender_id FROM live_demo_course_assigned where live_demo_course_assigned.trainer_id=?) and trainer_calendar.date_s_time_slot > DATE_ADD(CONVERT_TZ(now(),'+00:00','+5:30'), INTERVAL 1 HOUR) and DATE_FORMAT(trainer_calendar.date_s_time_slot,'%Y-%m-%d') =? and (trainer_calendar.booked_ids IS NULL or !find_in_set(?,booked_ids))  order by trainer_calendar.date_s_time_slot",
      [params.user_id, params.user_id, params.dates, params.user_id]
    )
    .then((result) => {
      if (result.err) throw result.err;
      else return res.send(result.result);
    });
});
router.post("/getUserDetails", (req, res) => {
  let params = req.body;
  return dbUtils
    .runSqlQueryAsyncSelect(
      "SELECT `user_id`, `name`,  `contact`, `email` FROM `cv_users` WHERE user_id=?",
      [params.user_id]
    )
    .then((result) => {
      if (result.err) {
        throw result.err;
      } else {
        return res.send(result.result);
      }
    });
});
/***Trainer Related data */
router.post("/getTrainerallCourses", (req, res) => {
  let params = req.body;
  let query =
    "SELECT trainer_subjects.user_id,trainer_subjects.course_id,trainer_subjects.course_type,(CASE WHEN trainer_subjects.course_type='demo' THEN demo_trial_courses.demo_course_name ELSE live_courses.live_course_name END) 'course_name'  FROM `trainer_subjects` left join demo_trial_courses on (demo_trial_courses.demo_course_id =trainer_subjects.course_id and trainer_subjects.course_type='demo') left join live_courses on (live_courses.live_course_id =trainer_subjects.course_id and trainer_subjects.course_type='live') WHERE user_id=?";
  let param = [params.user_id];
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else return res.send(dataResult.result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/getAllTrainerClassSlots", (req, res) => {
  let params = req.body,
    query,
    param;
  query =
    "SELECT cv_users.user_id,cv_users.name FROM `cv_users` inner join trainer_subjects on(trainer_subjects.user_id = cv_users.user_id) WHERE trainer=1 and status=1 group by cv_users.user_id";
  return dbUtils
    .runSqlQueryAsyncSelect(query, [])
    .then(async (dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else {
        let resultData = dataResult.result;
        let unique_date = [];
        await asyncforEach(resultData, async (item, index) => {
          query =
            "SELECT trainer_calendar.trainer_calender_id,? as 'trainer_name',? as 'trainer_id',trainer_calendar.date_s_time_slot,trainer_calendar.date_e_time_slot,trainer_calendar.duration,trainer_calendar.break_time,(case when find_in_set(?,trainer_calendar.booked_ids) then '1' else '0' end) 'booked',demo_trial_courses.demo_course_name 'course_name',trainer_class_link.class_link,cv_users.name,cv_users.user_id,cv_classes.cls_name 'grade' from trainer_calendar left join live_demo_course_assigned on (live_demo_course_assigned.trainer_calender_id =trainer_calendar.trainer_calender_id and live_demo_course_assigned.trainer_id=?) left join demo_trial_courses on (demo_trial_courses.demo_course_id =live_demo_course_assigned.demo_course_id) left join trainer_class_link on (live_demo_course_assigned.t_class_link_id = trainer_class_link.t_class_link_id) left join cv_users on (cv_users.user_id =live_demo_course_assigned.user_id) left join cv_st_detail on (cv_st_detail.user_id =cv_users.user_id) left join cv_classes on (cv_classes.cls_id = cv_st_detail.cls_id) where find_in_set(?,user_ids) order by date_s_time_slot";
          param = [
            item.name,
            item.user_id,
            item.user_id,
            item.user_id,
            item.user_id,
          ];
          await dbUtils
            .runSqlQueryAsyncSelect(query, param)
            .then(async (calendarResult) => {
              if (calendarResult.err) throw calendarResult.err;
              else {
                unique_date.push(calendarResult.result);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
        return res.send(unique_date);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/getTrainerClassSlots", (req, res) => {
  let params = req.body;
  let query =
    "SELECT trainer_calendar.trainer_calender_id,live_demo_course_assigned.req_id,trainer_calendar.date_s_time_slot,Date_Format(trainer_calendar.date_s_time_slot,'%W %M %e %Y') 'schedule_date',Date_Format(trainer_calendar.date_s_time_slot,'%h:%i %p') 'schedule_s_time',Date_Format(trainer_calendar.date_e_time_slot,'%h:%i %p') 'schedule_e_time',live_demo_course_assigned.feedback_status_id,live_demo_course_assigned.sale_product_id,feedback_status.feedback_status,live_demo_course_assigned.feedback_message,trainer_calendar.date_e_time_slot,(case when live_class_mail_send.feedback_mail=1 then 'done' when live_class_mail_send.reschedule=1 then 'reschedule' else 'not_done' END) 'statusss',trainer_calendar.duration,trainer_calendar.break_time,(case when find_in_set(?,trainer_calendar.booked_ids) then '1' else '0' end) 'booked',demo_trial_courses.demo_course_name 'course_name',trainer_class_link.class_link,cv_users.name,cv_users.user_id,cv_classes.cls_name 'grade',live_class_student_feedback.student_feedback_id,live_class_student_feedback.skills,  live_class_student_feedback.courses_ids,live_class_student_feedback.course_suggestion,live_class_student_feedback.comments from trainer_calendar left join live_demo_course_assigned on (live_demo_course_assigned.trainer_calender_id =trainer_calendar.trainer_calender_id and live_demo_course_assigned.trainer_id=?) left join feedback_status on (feedback_status.feedback_status_id = live_demo_course_assigned.feedback_status_id) left join demo_trial_courses on (demo_trial_courses.demo_course_id =live_demo_course_assigned.demo_course_id) left join trainer_class_link on (live_demo_course_assigned.t_class_link_id = trainer_class_link.t_class_link_id) left join cv_users on (cv_users.user_id =live_demo_course_assigned.user_id) left join cv_st_detail on (cv_st_detail.user_id =cv_users.user_id) left join cv_classes on (cv_classes.cls_id = cv_st_detail.cls_id) left join live_class_mail_send on (live_class_mail_send.username =cv_users.username) left join live_class_student_feedback on (live_class_student_feedback.req_id =live_demo_course_assigned.req_id) where find_in_set(?,user_ids) order by date_s_time_slot";
  let param = [params.user_id, params.user_id, params.user_id];
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else return res.send(dataResult.result);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/getFilerDateWiseTrainerClassSlots", (req, res) => {
  let params = req.body;
  let start_date = new Date(params.start_date);
  /*start_date =start_date.toLocaleString("en-US",{
    timeZone:"Asia/Kolkata"
  });*/
  start_date = dateFormat(start_date, "yyyy-mm-dd");
  let end_date = new Date(params.end_date);
  /*end_date =end_date.toLocaleString("en-US",{
      timeZone:"Asia/Kolkata"
    });*/
  end_date = dateFormat(end_date, "yyyy-mm-dd");
  let query =
    "SELECT trainer_calendar.trainer_calender_id,live_demo_course_assigned.req_id,trainer_calendar.date_s_time_slot,Date_Format(trainer_calendar.date_s_time_slot,'%W %M %e %Y') 'schedule_date',Date_Format(trainer_calendar.date_s_time_slot,'%h:%i %p') 'schedule_s_time',Date_Format(trainer_calendar.date_e_time_slot,'%h:%i %p') 'schedule_e_time',(case when live_class_mail_send.feedback_mail=1 then 'done' when live_class_mail_send.reschedule=1 then 'reschedule' else 'not_done' END) 'statusss',trainer_calendar.date_e_time_slot,trainer_calendar.duration,trainer_calendar.break_time,(case when find_in_set(?,trainer_calendar.booked_ids) then '1' else '0' end) 'booked',demo_trial_courses.demo_course_name 'course_name',trainer_class_link.class_link,cv_users.name,cv_users.user_id,cv_classes.cls_name 'grade',live_class_student_feedback.student_feedback_id from trainer_calendar left join live_demo_course_assigned on (live_demo_course_assigned.trainer_calender_id =trainer_calendar.trainer_calender_id and live_demo_course_assigned.trainer_id=?) left join demo_trial_courses on (demo_trial_courses.demo_course_id =live_demo_course_assigned.demo_course_id) left join trainer_class_link on (live_demo_course_assigned.t_class_link_id = trainer_class_link.t_class_link_id) left join cv_users on (cv_users.user_id =live_demo_course_assigned.user_id) left join cv_st_detail on (cv_st_detail.user_id =cv_users.user_id) left join cv_classes on (cv_classes.cls_id = cv_st_detail.cls_id) left join live_class_mail_send on (live_class_mail_send.username =cv_users.username) left join live_class_student_feedback on (live_class_student_feedback.req_id =live_demo_course_assigned.req_id)  where find_in_set(?,user_ids) and DATE_FORMAT(trainer_calendar.date_s_time_slot,'%Y-%m-%d') between ? and ?  order by date_s_time_slot";
  let param = [];
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else return res.send(dataResult.result);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/getLiveCoursesForFeedback", (req, res) => {
  return dbUtils
    .runSqlQueryAsyncSelect("SELECT * FROM `live_courses`", [])
    .then((datares) => {
      return res.send(datares.result);
    });
});
router.post("/getUserFolloupDetails", (req, res) => {
  let params = req.body,
    query,
    param;
  query =
    "SELECT live_class_salesperson_followup.status,live_class_salesperson_followup.remark,Date_Format(`follup_time`,'%W %M %e %Y %H:%i') 'followup_time',cv_users.name 'sales_Person_name',demo_trial_courses.theme FROM `live_class_salesperson_followup` inner join live_demo_course_assigned on (live_demo_course_assigned.req_id =live_class_salesperson_followup.req_id) inner join cv_users on (cv_users.user_id = live_demo_course_assigned.sales_person_id) inner join demo_trial_courses on (demo_trial_courses.demo_course_id =live_demo_course_assigned.demo_course_id) WHERE live_class_salesperson_followup.req_id=? order by live_class_salesperson_followup.follup_time DESC";
  param = [params.req_id];
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else return res.send(dataResult.result);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/getCourseDateWiseTimeSlot", (req, res) => {
  let params = req.body;

  let start_date = new Date(params.start_date);
  /*start_date =start_date.toLocaleString("en-US",{
    timeZone:"Asia/Kolkata"
  });*/
  start_date = dateFormat(start_date, "yyyy-mm-dd");
  let end_date = new Date(params.end_date);
  /*end_date =end_date.toLocaleString("en-US",{
      timeZone:"Asia/Kolkata"
    });*/
  end_date = dateFormat(end_date, "yyyy-mm-dd");
  let query =
    "SELECT trainer_calendar.trainer_calender_id,live_demo_course_assigned.req_id,trainer_calendar.date_s_time_slot,Date_Format(trainer_calendar.date_s_time_slot,'%W %M %e %Y') 'schedule_date',Date_Format(trainer_calendar.date_s_time_slot,'%h:%i %p') 'schedule_s_time',Date_Format(trainer_calendar.date_e_time_slot,'%h:%i %p') 'schedule_e_time',trainer_calendar.date_e_time_slot,(case when live_class_mail_send.feedback_mail=1 then 'done' when live_class_mail_send.reschedule=1 then 'reschedule' else 'not_done' END) 'statusss',trainer_calendar.duration,trainer_calendar.break_time,(case when find_in_set(?,trainer_calendar.booked_ids) then '1' else '0' end) 'booked',demo_trial_courses.demo_course_name 'course_name',trainer_class_link.class_link,cv_users.name,cv_users.user_id,cv_classes.cls_name 'grade',live_class_student_feedback.student_feedback_id from trainer_calendar left join live_demo_course_assigned on (live_demo_course_assigned.trainer_calender_id =trainer_calendar.trainer_calender_id and live_demo_course_assigned.trainer_id=?) inner join demo_trial_courses on (demo_trial_courses.demo_course_id =live_demo_course_assigned.demo_course_id and demo_trial_courses.demo_course_id=?) left join trainer_class_link on (live_demo_course_assigned.t_class_link_id = trainer_class_link.t_class_link_id) left join cv_users on (cv_users.user_id =live_demo_course_assigned.user_id) left join cv_st_detail on (cv_st_detail.user_id =cv_users.user_id) left join cv_classes on (cv_classes.cls_id = cv_st_detail.cls_id) left join live_class_mail_send on (live_class_mail_send.username =cv_users.username) eft join live_class_student_feedback on (live_class_student_feedback.req_id =live_demo_course_assigned.req_id) where find_in_set(?,user_ids) and DATE_FORMAT(trainer_calendar.date_s_time_slot,'%Y-%m-%d') between ? and ?  order by date_s_time_slot";
  let param = [
    params.user_id,
    params.user_id,
    params.demo_course_id,
    params.user_id,
    start_date,
    end_date,
  ];
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else return res.send(dataResult.result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/getCourseAllWiseTimeSlot", (req, res) => {
  let params = req.body;
  let query, param, start_date, end_date;

  if (params.selval != 0) {
    start_date = new Date(params.start_date);
    start_date = dateFormat(start_date, "yyyy-mm-dd");
    end_date = new Date(params.end_date);
    end_date = dateFormat(end_date, "yyyy-mm-dd");
  }
  if (params.user_id == 0) {
    query =
      "SELECT cv_users.user_id,cv_users.name FROM `cv_users` inner join trainer_subjects on(trainer_subjects.user_id = cv_users.user_id) WHERE trainer=1 and status=1 group by cv_users.user_id";
    return dbUtils
      .runSqlQueryAsyncSelect(query, [])
      .then(async (dataResult) => {
        if (dataResult.err) throw dataResult.err;
        else {
          let resultData = dataResult.result;

          let unique_date = [];
          await asyncforEach(resultData, async (item, index) => {
            let courseId =
              params.demo_course_id != 0
                ? ` and  live_demo_course_assigned.demo_course_id =${params.demo_course_id}`
                : "";
            let selval =
              params.selval != 0
                ? ` and DATE_FORMAT(trainer_calendar.date_s_time_slot,'%Y-%m-%d') between '${start_date}' and '${end_date}'`
                : "";
            let booked =
              params.booked != 0
                ? params.booked == "booked"
                  ? ` left join live_demo_course_assigned on (live_demo_course_assigned.trainer_calender_id =trainer_calendar.trainer_calender_id and live_demo_course_assigned.trainer_id=${item.user_id})`
                  : ` left join live_demo_course_assigned on (live_demo_course_assigned.trainer_calender_id =trainer_calendar.trainer_calender_id and live_demo_course_assigned.trainer_id=${item.user_id})`
                : ` left join live_demo_course_assigned on (live_demo_course_assigned.trainer_calender_id =trainer_calendar.trainer_calender_id and live_demo_course_assigned.trainer_id=${item.user_id})`;
            let booked_params =
              params.booked != 0
                ? params.booked == "not_booked"
                  ? ` and trainer_calendar.trainer_calender_id not in (SELECt live_demo_course_assigned.trainer_calender_id from live_demo_course_assigned where live_demo_course_assigned.trainer_id=${item.user_id})  and (case when find_in_set(${item.user_id},trainer_calendar.booked_ids) then false else true end)`
                  : ` and (trainer_calendar.trainer_calender_id  in (SELECt live_demo_course_assigned.trainer_calender_id from live_demo_course_assigned where live_demo_course_assigned.trainer_id=${item.user_id})  or (case when find_in_set(${item.user_id},trainer_calendar.booked_ids) then true else false end))`
                : "";
            query = `SELECT trainer_calendar.trainer_calender_id,'${item.name}' as 'trainer_name','${item.user_id}' as 'trainer_id',trainer_calendar.date_s_time_slot,trainer_calendar.date_e_time_slot,trainer_calendar.duration,trainer_calendar.break_time,(case when find_in_set(${item.user_id},trainer_calendar.booked_ids) then '1' else '0' end) 'booked',demo_trial_courses.demo_course_name 'course_name',trainer_class_link.class_link,cv_users.name,cv_users.user_id,cv_classes.cls_name 'grade' from trainer_calendar ${booked} left join demo_trial_courses on (demo_trial_courses.demo_course_id =live_demo_course_assigned.demo_course_id) left join trainer_class_link on (live_demo_course_assigned.t_class_link_id = trainer_class_link.t_class_link_id) left join cv_users on (cv_users.user_id =live_demo_course_assigned.user_id) left join cv_st_detail on (cv_st_detail.user_id =cv_users.user_id) left join cv_classes on (cv_classes.cls_id = cv_st_detail.cls_id) where find_in_set(${item.user_id},user_ids) ${courseId} ${selval} ${booked_params} order by date_s_time_slot`;
            param = [];
            console.log(query);
            await dbUtils
              .runSqlQueryAsyncSelect(query, param)
              .then(async (calendarResult) => {
                if (calendarResult.err) throw calendarResult.err;
                else {
                  unique_date.push(calendarResult.result);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          });

          return res.send(unique_date);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (params.trainer_id != 0) {
    let courseId =
      params.demo_course_id != 0
        ? ` and  live_demo_course_assigned.demo_course_id =${params.demo_course_id}`
        : "";
    let selval =
      params.selval != 0
        ? ` and DATE_FORMAT(trainer_calendar.date_s_time_slot,'%Y-%m-%d') between '${start_date}' and '${end_date}'`
        : "";
    let booked =
      params.booked != 0
        ? params.booked == "booked"
          ? ` left join live_demo_course_assigned on (live_demo_course_assigned.trainer_calender_id =trainer_calendar.trainer_calender_id and live_demo_course_assigned.trainer_id=${params.user_id})`
          : ` left join live_demo_course_assigned on (live_demo_course_assigned.trainer_calender_id =trainer_calendar.trainer_calender_id and live_demo_course_assigned.trainer_id=${params.user_id})`
        : `left join live_demo_course_assigned on (live_demo_course_assigned.trainer_calender_id =trainer_calendar.trainer_calender_id and live_demo_course_assigned.trainer_id=${params.user_id})`;
    let booked_params =
      params.booked != 0
        ? params.booked == "not_booked"
          ? ` and trainer_calendar.trainer_calender_id not in (SELECt live_demo_course_assigned.trainer_calender_id from live_demo_course_assigned where live_demo_course_assigned.trainer_id=${params.user_id})  and (case when find_in_set(${params.user_id},trainer_calendar.booked_ids) then false else true end)`
          : ` and (trainer_calendar.trainer_calender_id  in (SELECt live_demo_course_assigned.trainer_calender_id from live_demo_course_assigned where live_demo_course_assigned.trainer_id=${params.user_id})  or (case when find_in_set(${params.user_id},trainer_calendar.booked_ids) then true else false end))`
        : "";
    query = `SELECT trainer_calendar.trainer_calender_id,'${params.name}' as 'trainer_name','${params.user_id}' as 'trainer_id',trainer_calendar.date_s_time_slot,trainer_calendar.date_e_time_slot,trainer_calendar.duration,trainer_calendar.break_time,(case when find_in_set(${params.user_id},trainer_calendar.booked_ids) then '1' else '0' end) 'booked',demo_trial_courses.demo_course_name 'course_name',trainer_class_link.class_link,cv_users.name,cv_users.user_id,cv_classes.cls_name 'grade' from trainer_calendar ${booked} left join demo_trial_courses on (demo_trial_courses.demo_course_id =live_demo_course_assigned.demo_course_id) left join trainer_class_link on (live_demo_course_assigned.t_class_link_id = trainer_class_link.t_class_link_id) left join cv_users on (cv_users.user_id =live_demo_course_assigned.user_id) left join cv_st_detail on (cv_st_detail.user_id =cv_users.user_id) left join cv_classes on (cv_classes.cls_id = cv_st_detail.cls_id) where find_in_set(${params.user_id},user_ids) ${courseId} ${selval} ${booked_params} order by date_s_time_slot`;
    // console.log(query);
    param = [];
    return dbUtils
      .runSqlQueryAsyncSelect(query, param)
      .then(async (calendarResult) => {
        if (calendarResult.err) throw calendarResult.err;
        else {
          return res.send(calendarResult.result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
router.post("/getCourseWiseTimeSlot", (req, res) => {
  let dataBetweenDates,
    params = req.body;

  let demoCourseId =
    params.demo_course_id != 0
      ? ` and demo_trial_courses.demo_course_id=${params.demo_course_id}`
      : "";
  let CourseSelection = params.demo_course_id != 0 ? ` inner ` : " left";
  let booked =
    params.booked != 0
      ? params.booked == "booked"
        ? " inner "
        : " left "
      : " left ";
  let notBooked =
    params.booked != 0
      ? params.booked == "not_booked"
        ? ` and trainer_calendar.trainer_calender_id NOT IN(SELECT live_demo_course_assigned.trainer_calender_id from live_demo_course_assigned where live_demo_course_assigned.trainer_id=${params.user_id})`
        : ""
      : " ";
  if (params.selval != 0) {
    let start_date = new Date(params.start_date);
    start_date = dateFormat(start_date, "yyyy-mm-dd");
    let end_date = new Date(params.end_date);
    end_date = dateFormat(end_date, "yyyy-mm-dd");
    dataBetweenDates = ` and DATE_FORMAT(trainer_calendar.date_s_time_slot,'%Y-%m-%d') between '${start_date}' and '${end_date}'`;
  } else {
    dataBetweenDates = ``;
  }

  let query;
  if (params.booked != 0 && params.booked == "not_booked")
    query = `select t.* from (SELECT trainer_calendar.trainer_calender_id,live_demo_course_assigned.req_id,trainer_calendar.date_s_time_slot,Date_Format(trainer_calendar.date_s_time_slot,'%W %M %e %Y') 'schedule_date',Date_Format(trainer_calendar.date_s_time_slot,'%h:%i %p') 'schedule_s_time',Date_Format(trainer_calendar.date_e_time_slot,'%h:%i %p') 'schedule_e_time',live_demo_course_assigned.feedback_status_id,live_demo_course_assigned.sale_product_id,feedback_status.feedback_status,live_demo_course_assigned.feedback_message,trainer_calendar.date_e_time_slot,(case when live_class_mail_send.feedback_mail=1 then 'done' when live_class_mail_send.reschedule=1 then 'reschedule' else 'not_done' END) 'statusss',trainer_calendar.duration,trainer_calendar.break_time,(case when find_in_set(${params.user_id},trainer_calendar.booked_ids) then '1' else '0' end) 'booked',demo_trial_courses.demo_course_name 'course_name',trainer_class_link.class_link,cv_users.name,cv_users.user_id,cv_classes.cls_name 'grade',live_class_student_feedback.student_feedback_id,live_class_student_feedback.skills,  live_class_student_feedback.courses_ids,live_class_student_feedback.course_suggestion,live_class_student_feedback.comments from trainer_calendar ${booked} join live_demo_course_assigned on (live_demo_course_assigned.trainer_calender_id =trainer_calendar.trainer_calender_id and live_demo_course_assigned.trainer_id=${params.user_id}) left join feedback_status on (feedback_status.feedback_status_id = live_demo_course_assigned.feedback_status_id) ${CourseSelection} join demo_trial_courses on (demo_trial_courses.demo_course_id =live_demo_course_assigned.demo_course_id ${demoCourseId}) left join trainer_class_link on (live_demo_course_assigned.t_class_link_id = trainer_class_link.t_class_link_id) left join cv_users on (cv_users.user_id =live_demo_course_assigned.user_id) left join cv_st_detail on (cv_st_detail.user_id =cv_users.user_id) left join cv_classes on (cv_classes.cls_id = cv_st_detail.cls_id) left join live_class_mail_send on (live_class_mail_send.username =cv_users.username) left join live_class_student_feedback on (live_class_student_feedback.req_id =live_demo_course_assigned.req_id) where find_in_set(${params.user_id},user_ids) ${dataBetweenDates} ${notBooked}) t where t.booked=0  order by t.date_s_time_slot desc`;
  else
    query = `SELECT trainer_calendar.trainer_calender_id,live_demo_course_assigned.req_id,trainer_calendar.date_s_time_slot,Date_Format(trainer_calendar.date_s_time_slot,'%W %M %e %Y') 'schedule_date',Date_Format(trainer_calendar.date_s_time_slot,'%h:%i %p') 'schedule_s_time',Date_Format(trainer_calendar.date_e_time_slot,'%h:%i %p') 'schedule_e_time',live_demo_course_assigned.feedback_status_id,live_demo_course_assigned.sale_product_id,feedback_status.feedback_status,live_demo_course_assigned.feedback_message,trainer_calendar.date_e_time_slot,(case when live_class_mail_send.feedback_mail=1 then 'done' when live_class_mail_send.reschedule=1 then 'reschedule' else 'not_done' END) 'statusss',trainer_calendar.duration,trainer_calendar.break_time,(case when find_in_set(${params.user_id},trainer_calendar.booked_ids) then '1' else '0' end) 'booked',demo_trial_courses.demo_course_name 'course_name',trainer_class_link.class_link,cv_users.name,cv_users.user_id,cv_classes.cls_name 'grade',live_class_student_feedback.student_feedback_id,live_class_student_feedback.skills,  live_class_student_feedback.courses_ids,live_class_student_feedback.course_suggestion,live_class_student_feedback.comments from trainer_calendar ${booked} join live_demo_course_assigned on (live_demo_course_assigned.trainer_calender_id =trainer_calendar.trainer_calender_id and live_demo_course_assigned.trainer_id=${params.user_id}) left join feedback_status on (feedback_status.feedback_status_id = live_demo_course_assigned.feedback_status_id) ${CourseSelection} join demo_trial_courses on (demo_trial_courses.demo_course_id =live_demo_course_assigned.demo_course_id ${demoCourseId}) left join trainer_class_link on (live_demo_course_assigned.t_class_link_id = trainer_class_link.t_class_link_id) left join cv_users on (cv_users.user_id =live_demo_course_assigned.user_id) left join cv_st_detail on (cv_st_detail.user_id =cv_users.user_id) left join cv_classes on (cv_classes.cls_id = cv_st_detail.cls_id) left join live_class_mail_send on (live_class_mail_send.username =cv_users.username) left join live_class_student_feedback on (live_class_student_feedback.req_id =live_demo_course_assigned.req_id) where find_in_set(${params.user_id},user_ids) ${dataBetweenDates} ${notBooked}  order by date_s_time_slot desc`;
  // console.log(query);
  let param = [];
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else return res.send(dataResult.result);
    })
    .catch((err) => {
      console.log(err);
    });
});

/****End Trainer Related data */

router.post("/downloadExcelFiles", async (req, res, next) => {
  let params = req.body;
  var excel = require("excel4node");
  const XLSX = require("xlsx");
  let workbook = new excel.Workbook();
  let sheet1 = workbook.addWorksheet("Demo Class Requests");
  var sheetCols = [
    "Parent's Name",
    "Parent's Email",
    "Parent's Contact",
    "Kid's Name",
    "Age",
    "Grade",
    "City",
    "State",
    "Country",
    "Demo Courses",
    "Institute Name",
    "Alloted To(Sales)",
    "Schedule Date",
  ];
  sheetCols.forEach((cel, index) => {
    sheet1.cell(1, index + 1).string(cel);
  });
  let salesPersons = "",
    letCourses = "";
  let Grade = "UKG,1,2,3,4,5,6,7,8,9,10";
  await params.salesPersons.forEach((item) => {
    if (salesPersons.length) {
      salesPersons = salesPersons + "," + item.name;
    } else {
      salesPersons = item.name;
    }
  });
  await params.courses.forEach((course) => {
    if (letCourses.length) {
      letCourses = letCourses + "," + `${course.demo_course_name}`;
    } else {
      letCourses = `${course.demo_course_name}`;
    }
    //letCourses.push(course.demo_course_name+'('+course.theme+')');
  });

  //console.log(letCourses+' '+salesPersons )
  sheet1.addDataValidation({
    type: "custom",
    prompt: "Follow email address format Example: abc@email.com",
    error: "Follow correct email format",
    allowBlank: 0,
    sqref: "B2:B1048576",
    formulas: ['=ISNUMBER(MATCH("*@*.?*",B2,0))'],
  });
  sheet1.addDataValidation({
    type: "custom",
    prompt: "Follow date format i.e. (1-Aug-2002)",
    error: "Follow date format ",
    allowBlank: 0,
    sqref: "M2:M1048576",
    formulas: ['=AND(ISNUMBER(M2),LEFT(CELL("format",M2),1)="D")'],
  });

  sheet1.addDataValidation({
    type: "custom",
    allowBlank: true,
    prompt: "Mobile number must be in numeric only",
    error: "Mobile number should be 10 digit whole number",
    sqref: "C2:C1048576",
    formulas: ["=AND(ISNUMBER(C2),LEN(C2)=10)"],
  });
  sheet1.addDataValidation({
    type: "list",
    prompt: "Choose grade",
    error: "Invalid choice. Choose from the given options.",
    allowBlank: true,
    showDropDown: true,
    sqref: "F2:F1048576",
    formulas: [Grade],
  });
  sheet1.addDataValidation({
    type: "list",
    prompt: "Choose grade",
    error: "Invalid choice. Choose from the given options.",
    allowBlank: true,
    showDropDown: true,
    sqref: "L2:L1048576",
    formulas: [salesPersons],
  });
  sheet1.addDataValidation({
    type: "list",
    prompt: "Choose grade",
    error: "Invalid choice. Choose from the given options.",
    allowBlank: true,
    showDropDown: true,
    sqref: "J2:J1048576",
    formulas: [letCourses],
  });

  workbook.write("UploadLiveClassMultipleRequests.xlsx", res);
});

/***coupons */
router.post("/saveUserCoupons", (req, res) => {
  let params = req.body;
  let query =
    "SELECT `coupon_id` FROM `cv_coupons` WHERE cv_coupons.user_id=? and cv_coupons.coupon_code=? and cv_coupons.coupon_desc and cv_coupons.discount=? and cv_coupons.product_id=0 and cv_coupons.visible_all=0";
  //"INSERT INTO `cv_coupons`( `user_id`, `coupon_code`, `coupon_desc`, `discount`, `product_id`) VALUES (?,?,?,?,?);";
  let param = [
    params.user_id,
    params.coupon_code,
    params.coupon_desc,
    params.discount,
  ];
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      if (dataResult.result.length) return "";
      else {
        query =
          "INSERT INTO `cv_coupons`( `user_id`, `coupon_code`, `coupon_desc`, `discount`, `product_id`,`visible_all`) VALUES (?,?,?,?,?,?)";
        param = [
          params.user_id,
          params.coupon_code,
          params.coupon_desc,
          params.discount,
          0,
          0,
        ];
        return dbUtils.runSqlQueryAsyncInsert(query, param);
      }
    })
    .then(async (result) => {
      if (result) {
        if (result.err) throw result.err;
        else {
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

router.post("/getCouponsUsers", (req, res) => {
  return dbUtils
    .runSqlQueryAsyncSelect(
      "SELECT DISTINCT cv_users.user_id,cv_users.name FROM `cv_coupons` inner join cv_users on (cv_users.user_id = cv_coupons.user_id)",
      []
    )
    .then((data) => {
      if (data.err) throw data.err;
      else return res.send(data.result);
    })
    .catch((err) => {
      console.log(err);
    });
});
/****End coupons */
router.post("/getUserLiveCourse", (req, res) => {
  let params = req.body;
  return dbUtils
    .runSqlQueryAsyncSelect("SELECT trainer from cv_users where user_id=?", [
      params.user_id,
    ])
    .then((result) => {
      if (result.err) {
        throw result.err;
      } else {
        let query = "";
        if (result.result[0].trainer == 1) {
          query =
            "SELECT `live_course_id`, `live_course_name`, `live_course_slug`,`img`, `live_course_outcomes`, `grade`, `age_group`, `per_hour_price`, `duration`, `course_price`, `course_theme`,orders.status 'purchases_status',products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = live_courses.product_id) 'avg_rating' FROM `live_courses` inner join products on (products.product_id =live_courses.product_id) left join orders on (products.product_id =orders.product_id and user_id=? and orders.status=1)";
        } else {
          query =
            "SELECT `live_course_id`, `live_course_name`, `live_course_slug`,`img`, `live_course_outcomes`, `grade`, `age_group`, `per_hour_price`, `duration`, `course_price`, `course_theme`,  orders.status 'purchases_status',products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = live_courses.product_id) 'avg_rating' FROM `live_courses` inner join products on (products.product_id =live_courses.product_id) inner join orders on (products.product_id =orders.product_id and user_id=? and orders.status=1)";
        }
        return dbUtils
          .runSqlQueryAsyncSelect(query, [params.user_id])
          .then((data) => {
            if (data.err) throw data.err;
            else {
              return res.send(data.result);
            }
          });
        //return res.send(result.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/OtherCourses", (req, res) => {
  let params = req.body;
  return dbUtils
    .runSqlQueryAsyncSelect(
      "SELECT `live_course_id`, `live_course_name`, `live_course_slug`,`img`, `live_course_outcomes`, `grade`, `age_group`, `per_hour_price`, `duration`, `course_price`, `course_theme`,  orders.status 'purchases_status',products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = live_courses.product_id) 'avg_rating' FROM `live_courses` inner join products on (products.product_id =live_courses.product_id) left join orders on (products.product_id =orders.product_id and user_id=? and orders.status=1) WHERE live_courses.live_course_slug!=?",
      [params.user_id, params.courseSlug]
    )
    .then((result) => {
      if (result.err) {
        throw result.err;
      } else {
        return res.send(result.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/OtherByteCourses", (req, res) => {
  let params = req.body;
  return dbUtils
    .runSqlQueryAsyncSelect(
      "SELECT `byte_course_id`, `byte_course_name`, `byte_course_slug`,`img`, `byte_course_outcomes`, `grade`, `age_group`, `per_hour_price`, `duration`, `course_price`, `course_theme`,  orders.status 'purchases_status',products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = byte_size_courses.product_id) 'avg_rating' FROM `byte_size_courses` inner join products on (products.product_id =byte_size_courses.product_id) left join orders on (products.product_id =orders.product_id and user_id=? and orders.status=1) WHERE byte_size_courses.byte_course_slug=?",
      [params.user_id, params.courseSlug]
    )
    .then((result) => {
      if (result.err) {
        throw result.err;
      } else {
        return res.send(result.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/getCoursesTopics", (req, res) => {
  let params = req.body;
  return dbUtils
    .runSqlQueryAsyncSelect(
      "SELECT `topic_id`, `live_course_id`, `topic_name`, `topic_slug`, `visible`, `session`, `time_in_minutes` FROM `live_course_topics` WHERE live_course_id=? and visible=1",
      [params.live_course_id]
    )
    .then((result) => {
      if (result.err) {
        throw result.err;
      } else {
        return res.send(result.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/getByteCoursesTopics", (req, res) => {
  let params = req.body;
  return dbUtils
    .runSqlQueryAsyncSelect(
      "SELECT `topic_id`, `byte_size_course_id`, `topic_name`, `topic_slug`,`content`, `visible`, `session`, `time_in_minutes` FROM byte_size_course_topics WHERE byte_size_course_id=? and visible=1",
      [params.live_course_id]
    )
    .then((result) => {
      if (result.err) {
        throw result.err;
      } else {
        return res.send(result.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/getCourseDetails", (req, res) => {
  let params = req.body;
  return dbUtils
    .runSqlQueryAsyncSelect(
      "SELECT `live_course_id`, `live_course_name`, `live_course_slug`,`img`, `live_course_outcomes`, `grade`, `age_group`, `per_hour_price`, `duration`,live_courses.actual_price, `course_price`, `course_theme`,live_courses.product_id,  orders.status 'purchases_status',products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = live_courses.product_id) 'avg_rating' FROM `live_courses` inner join products on (products.product_id =live_courses.product_id) left join orders on (products.product_id =orders.product_id and user_id=? and orders.status=1) where live_courses.live_course_slug=?",
      [params.user_id, params.courseSlug]
    )
    .then((result) => {
      if (result.err) {
        throw result.err;
      } else {
        return res.send(result.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/getByteCourseDetails", (req, res) => {
  let params = req.body;
  return dbUtils
    .runSqlQueryAsyncSelect(
      "SELECT `byte_course_id`, `byte_course_name`, `byte_course_slug`,`img`, `byte_course_outcomes`, `grade`, `age_group`, `per_hour_price`, `duration`, `course_price`, `course_theme`,byte_size_courses.product_id,  orders.status 'purchases_status',products.product_type,(SELECT avg(product_feedback.obt_rat) from product_feedback group by product_feedback.product_id HAVING product_feedback.product_id = byte_size_courses.product_id) 'avg_rating' FROM `byte_size_courses` inner join products on (products.product_id =byte_size_courses.product_id) left join orders on (products.product_id =orders.product_id and user_id=? and orders.status=1) where byte_size_courses.byte_course_slug=?",
      [params.user_id, params.courseSlug]
    )
    .then((result) => {
      if (result.err) {
        throw result.err;
      } else {
        return res.send(result.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/test123", (req, res) => {
  let skills = [100, 80 , 60, 40];
  let minMumIndex = skills.indexOf(Math.min.apply(Math, skills));
  let courseSuggestion = "Scratch that, Gamify It !!|Scratch, Your First Step !!".split("|");

  let enhanceSkills = Object.keys("Hello World").toString();
  let course1 = `https://test.codevidhya.com/assets/psycometric_icons/${
    courseSuggestion[0]
  }.png`;
  let course2 = `https://test.codevidhya.com/assets/psycometric_icons/${
    courseSuggestion[1]
  }.png`;
  console.log(course1 + " " + course2);
  await res.render(
    "studentReport",
    {
      studentName: params.studentName,
      skills: skills,
      enhanceSkills: enhanceSkills,
      course1: course1,
      course2: course2,
    },
    async (err, data) => {
      if (err) {
        res.send(err);
      } else {
        let options = {
          height: "1123px",
          width: "794px",
          orientation: "portrait",
          renderDelay: 10000,
        };

        pdf.create(data, options).toBuffer(async function(err, buffer) {
          // //console.log(buffer)
          // await sendPsychometicReport(
          //   params,
          //   skills,
          //   new mailgun.Attachment({
          //     data: buffer,
          //     filename: "Psycomatric.pdf",
          //   })
          // );
          return res.send(buffer);
        });
      }
    }
  );
});

/***Upload live Course Content */
router.post("/getThisCourseSubTopics", (req, res) => {
  let params = req.body;
  pool.query(
    "SELECT `live_course_content_id`, `live_course_id`, `topic_id`, `name`, `content`, `type`, `content_type`, `is_link`, `user_id`, `sch_id` FROM `live_course_content` WHERE topic_id=?",
    [params.topic_id],
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
    "UPDATE `live_course_topics` SET `topic_name`=? where topic_id=?",
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
router.post("/InsertCNewTopic", (req, res) => {
  let params = req.body;
  pool.query(
    "INSERT INTO `live_course_topics`(`live_course_id`, `topic_name`, `topic_slug`, `visible`, `user_id`) VALUES (?,?,?,1,?)",
    [
      params.book_id,
      params.topic_name,
      params.topic_name.toLowerCase(),
      params.user_id,
    ],
    function(err, data) {
      if (err) console.log(err);
      else res.send(data);
    }
  );
});
router.post("/DeleteMTopic", (req, res) => {
  let params = req.body;
  pool.query(
    "DELETE FROM `live_course_topics` WHERE topic_id=?",
    [params.topic_id],
    function(err, data) {
      if (err) console.log(err);
      else {
        res.send(data);
      }
    }
  );
});

let lmsOtherVideoStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.resolve(appRoot + "/resources/live_course_video/"));
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
/***upload live courses document */
let lmsOtherPdfStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.resolve(appRoot + "/resources/live_course_doc/"));
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});
let lmsOtherPdfUpload = multer({ storage: lmsOtherPdfStorage });
router.post("/uploadOtherLmsPdf", lmsOtherPdfUpload.any(), (req, res, next) => {
  res.end();
});
/****End Live courses document */
router.post("/uploadUOtherLmsCont", async (req, res) => {
  let params = req.body;
  /*start video compress*/
  /*    var pathh = "http://localhost:8080/resources/live_course_video/Mera.mp4";
     
     console.log("path")
     console.log(pathh);
     try {
     await new ffmpeg(pathh).then(async function(err,video) {
        if(err)
        {
          console.log("err")
          console.log(err);
          console.log('Error: ' + err);
        }
        else
        {
          var pathhh =  "http://localhost:8080/resources/live_course_video/fs/Mera.mp4";
          video
        .setVideoSize('640x?', true, true, '#fff')
        .setAudioChannels(2)
        .save(pathhh, function (error, file) {
          if (!error)
            console.log('Video file: ' + file);
        });
        }
        
    
      })
    } catch (e) {
      console.log(e.code);
      console.log(e.msg);
    }*/
  /*  try {
        new ffmpeg(appRoot + "/resources/live_course_video/director_message.mp4", function (err, video) {
          if (!err) {
            video.setVideoSize('50%', true, false);
            video.setVideoFormat('avi');
            video.save(appRoot + "/resources/live_course_video/fs/director_message.mp4", function (error, file) {
              console.log(file);
              if (!error)
                console.log('Video file: ' + file);
                else
                {
                  console.log("err");
                  console.log(err);
                }
            });
            console.log('The video is ready to be processed');
          
            
          } else {
            console.log('Error: ' + err);
          }
        });
      } catch (e) {
        console.log(e.code);
        console.log(e.msg);
      }*/

  /**End video compress */
  pool.query(
    "INSERT INTO `live_course_content`(`live_course_id`,`topic_id`, `name`, `content`, `type`,`content_type`,`user_id`) VALUES (?,?,?,?,?,?,?)",
    [
      params.book_id,
      params.topic_id,
      params.pageName,
      params.content,
      params.type,
      params.contentType,
      params.user_id,
    ],
    function(err, data) {
      if (err) console.log(err);
      else res.send(data);
    }
  );
});
router.post("/UpdateUSTopic", (req, res) => {
  let params = req.body;
  pool.query(
    "UPDATE `live_course_content` SET `name`=? where live_course_content.live_course_content_id=?",
    [params.topic_name, params.live_course_content_id],
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
    "DELETE FROM `live_course_content` WHERE live_course_content.live_course_content_id=?",
    [params.live_course_content_id],
    function(err, data) {
      if (err) console.log(err);
      else {
        res.send(data);
      }
    }
  );
});
/**End Upload Live Course Content */
/****Demo live class */
router.post("/getParticularRequestFinalStep", (req, res) => {
  let params = req.body;
  let query =
    "SELECT trainer_calendar.trainer_calender_id,live_demo_course_assigned.req_id,live_demo_course_assigned.assigned_id,trainer_calendar.date_s_time_slot,Date_Format(trainer_calendar.date_s_time_slot,'%W %M %e %Y') 'schedule_date',Date_Format(trainer_calendar.date_s_time_slot,'%h:%i %p') 'schedule_s_time',Date_Format(trainer_calendar.date_e_time_slot,'%h:%i %p') 'schedule_e_time',live_demo_course_assigned.feedback_status_id,live_demo_course_assigned.sale_product_id,feedback_status.feedback_status,live_demo_course_assigned.feedback_message,trainer_calendar.date_e_time_slot,(case when live_class_mail_send.feedback_mail=1 then 'done' when live_class_mail_send.reschedule=1 then 'reschedule' else 'not_done' END) 'statusss',trainer_calendar.duration,trainer_calendar.break_time,(case when find_in_set(?,trainer_calendar.booked_ids) then '1' else '0' end) 'booked',demo_trial_courses.demo_course_name 'course_name',trainer_class_link.class_link,cv_users.name,cv_users.user_id,cv_classes.cls_name 'grade',live_class_student_feedback.student_feedback_id,live_class_student_feedback.skills,  live_class_student_feedback.courses_ids,live_class_student_feedback.course_suggestion,live_class_student_feedback.comments from trainer_calendar inner join live_demo_course_assigned on (live_demo_course_assigned.trainer_calender_id =trainer_calendar.trainer_calender_id and live_demo_course_assigned.trainer_id=?) left join feedback_status on (feedback_status.feedback_status_id = live_demo_course_assigned.feedback_status_id) left join demo_trial_courses on (demo_trial_courses.demo_course_id =live_demo_course_assigned.demo_course_id) left join trainer_class_link on (live_demo_course_assigned.t_class_link_id = trainer_class_link.t_class_link_id) left join cv_users on (cv_users.user_id =live_demo_course_assigned.user_id) left join cv_st_detail on (cv_st_detail.user_id =cv_users.user_id) left join cv_classes on (cv_classes.cls_id = cv_st_detail.cls_id) left join live_class_mail_send on (live_class_mail_send.username =cv_users.username) left join live_class_student_feedback on (live_class_student_feedback.req_id =live_demo_course_assigned.req_id) where find_in_set(?,user_ids) and live_demo_course_assigned.req_id=? order by date_s_time_slot";
  let param = [params.user_id, params.user_id, params.user_id, params.req_id];
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else return res.send(dataResult.result);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/getDemoCoursesForFreeTrail", (req, res) => {
  let params = req.body;
  return dbUtils
    .runSqlQueryAsyncSelect("select * from demo_trial_courses", [])
    .then((result) => {
      if (result.err) throw result.err;
      else {
        return res.send(result.result);
      }
    });
});
router.post("/GetStudentExistFeedbackDetails", (req, res) => {
  let params = req.body;
  return dbUtils
    .runSqlQueryAsyncSelect(
      "SELECT * FROM `live_class_student_feedback` WHERE live_class_student_feedback.req_id=? and live_class_student_feedback.user_id=?",
      [params.req_id, params.user_id]
    )
    .then((dataResult) => {
      return res.send(dataResult.result);
    });
});
router.post("/PostStudentDetailForCourseSuggestion", async (req, res) => {
  let query,
    param,
    params = req.body;

  query =
    "SELECT live_class_student_feedback.student_feedback_id FROM `live_class_student_feedback` WHERE live_class_student_feedback.user_id=? and live_class_student_feedback.req_id=?";
  param = [params.user_id, params.req_id];

  return await dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then(async (dataResult) => {
      // console.log(dataResult.result)
      if (dataResult.err) throw dataResult.err;
      else if (dataResult && dataResult.result.length) {
        query =
          "UPDATE `live_class_student_feedback` SET skills=?,`course_suggestion`=?,`comments`=?,courses_ids=? WHERE req_id=? and user_id=?";
        param = [
          JSON.stringify(params.skills),
          params.course_suggestion,
          params.comment,
          params.courses_ids,
          params.req_id,
          params.user_id,
        ];
        return dbUtils.runSqlQueryAsyncUpdate(query, param);
      } else {
        query =
          "INSERT INTO `live_class_student_feedback`(`req_id`, `user_id`, `skills`, `course_suggestion`,`courses_ids`, `comments`) VALUES (?,?,?,?,?,?)";
        param = [
          params.req_id,
          params.user_id,
          JSON.stringify(params.skills),
          params.course_suggestion,
          params.courses_ids,
          params.comment,
        ];

        return await dbUtils.runSqlQueryAsyncInsert(query, param);
      }
    })
    .then(async (dataRes) => {
      if (dataRes.err) throw dataRes.err;
      else {
        //  console.log(dataRes.result);
        let skills = [];
        params.skills.forEach((item, index) => {
          skills.push(parseFloat(Object.values(item).toString()) * 100);
        });
        let minMumIndex = skills.indexOf(Math.min.apply(Math, skills));
        let courseSuggestion = params.course_suggestion.split("|");

        let enhanceSkills = Object.keys(params.skills[minMumIndex]).toString();
        let course1 = `https://test.codevidhya.com/assets/psycometric_icons/${
          courseSuggestion[0]
        }.png`;
        let course2 = `https://test.codevidhya.com/assets/psycometric_icons/${
          courseSuggestion[1]
        }.png`;
        console.log(course1 + " " + course2);
        await res.render(
          "studentReport",
          {
            studentName: params.studentName,
            skills: skills,
            enhanceSkills: enhanceSkills,
            course1: course1,
            course2: course2,
          },
          async (err, data) => {
            //console.log(err);
            //console.log(data);
            if (err) {
              res.send(err);
            } else {
              let options = {
                height: "1123px",
                width: "794px",
                orientation: "portrait",
                renderDelay: 10000,
              };

              pdf.create(data, options).toBuffer(async function(err, buffer) {
                //console.log(buffer)
                await sendPsychometicReport(
                  params,
                  skills,
                  new mailgun.Attachment({
                    data: buffer,
                    filename: "Psycomatric.pdf",
                  })
                );
                return res.send("successfull send data");
              });
            }
          }
        );
        // await sendPsychometrictReport(params);
        // return res.send(dataRes.result);
      }
    });
});
var FileRecord = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.resolve(appRoot + "/dynamic/school_record"));
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});
let uploadSpreadsheet = multer({ storage: FileRecord });

router.post(
  "/uploadDemoClassRequests",
  uploadSpreadsheet.any(),
  async (req, res, next) => {
    var params = req.body;
    var dateFormat = require("dateformat");
    let existingSubjects = new Object();
    if (req.files.length > 0) {
      let file = req.files[0];
      const workbook = XLSX.readFile(
        appRoot + "/dynamic/school_record/" + file.filename
      );
      const sheetNameList = workbook.SheetNames;
      let sheetsRecord = [];
      sheetNameList.forEach((dat, index) => {
        sheetsRecord.push(
          XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[index]])
        );
      });
      // console.log(sheetsRecord)
      await asyncforEach(sheetsRecord, async (items, index) => {
        await asyncforEach(items, async (item, index1) => {
          let query,
            scheduleDate = "";
          // console.log(item);
          let fetchCourseId =
            item["Demo Courses"] != undefined
              ? `(select demo_course_id from demo_trial_courses where demo_course_name='${
                  item["Demo Courses"]
                }')`
              : "0";
          query = `SELECT  live_class_request.req_id FROM live_class_request where name ='${
            item["Parent's Name"] != undefined ? item["Parent's Name"] : ""
          }' and email ='${
            item["Parent's Email"] != undefined ? item["Parent's Email"] : ""
          }' and contact ='${
            item["Parent's Contact"] != undefined
              ? item["Parent's Contact"]
              : ""
          }' and kids_name ='${
            item["Kid's Name"] != undefined ? item["Kid's Name"] : ""
          }' and demo_course_id= ${fetchCourseId}`;
          return dbUtils
            .runSqlQueryAsyncSelect(query, [])
            .then((dataResult) => {
              if (dataResult.err) throw dataResult.err;
              else if (dataResult && dataResult.result.length) {
                return "";
              } else {
                if (item["Schedule Date"]) {
                  scheduleDate = dateFormat(
                    new Date(
                      Math.round(item["Schedule Date"] - 25569) * 86400 * 1000
                    ),
                    "yyyy-mm-dd"
                  );
                } else {
                  scheduleDate = "";
                }
                let salePerson_id =
                  item && item["Alloted To(Sales)"] != undefined
                    ? `(select user_id from cv_users where name ='${
                        item["Alloted To(Sales)"]
                      }' and sch_id in (SELECT sch_id FROM cv_school_detail where cv_school_detail.cv_pid=4))`
                    : " 0";

                let couseId =
                  item && item["Demo Courses"] != undefined
                    ? `(select demo_course_id from demo_trial_courses where demo_course_name='${
                        item["Demo Courses"]
                      }')`
                    : "0";
                let grade =
                  item && item["Grade"] != undefined
                    ? `(select cls_id from cv_classes where cls_name ='${
                        item["Grade"]
                      }')`
                    : `0`;
                if (scheduleDate) {
                  query = `INSERT INTO live_class_request(name, email, contact, kids_name, institute, city, state, country, cls_id, expected_schedule_date, sales_person_id, demo_course_id) VALUES ('${
                    item["Parent's Name"] != undefined
                      ? item["Parent's Name"]
                      : ""
                  }','${
                    item["Parent's Email"] != undefined
                      ? item["Parent's Email"]
                      : ""
                  }','${
                    item["Parent's Contact"] != undefined
                      ? item["Parent's Contact"]
                      : ""
                  }','${
                    item["Kid's Name"] != undefined ? item["Kid's Name"] : ""
                  }','${
                    item["Institute Name"] != undefined
                      ? item["Institute Name"]
                      : ""
                  }','${item["City"] != undefined ? item["City"] : ""}','${
                    item["State"] != undefined ? item["State"] : ""
                  }','${
                    item["Country"] != undefined ? item["Country"] : ""
                  }',${grade},'${scheduleDate}',${salePerson_id},${couseId})`;
                } else {
                  query = `INSERT INTO live_class_request(name, email, contact, kids_name, institute, city, state, country, cls_id, sales_person_id, demo_course_id) VALUES ('${
                    item["Parent's Name"] != undefined
                      ? item["Parent's Name"]
                      : ""
                  }','${
                    item["Parent's Email"] != undefined
                      ? item["Parent's Email"]
                      : ""
                  }','${
                    item["Parent's Contact"] != undefined
                      ? item["Parent's Contact"]
                      : ""
                  }','${
                    item["Kid's Name"] != undefined ? item["Kid's Name"] : ""
                  }','${
                    item["Institute Name"] != undefined
                      ? item["Institute Name"]
                      : ""
                  }','${item["City"] != undefined ? item["City"] : ""}','${
                    item["State"] != undefined ? item["State"] : ""
                  }','${
                    item["Country"] != undefined ? item["Country"] : ""
                  }',${grade},${salePerson_id},${couseId})`;
                }

                return dbUtils.runSqlQueryAsyncInsert(query, []);
              }
            })
            .then(async (RecordResponse) => {
              if (RecordResponse) {
                if (RecordResponse.err) throw RecordResponse.err;
                else {
                  let salePerson_email =
                    item && item["Alloted To(Sales)"] != undefined
                      ? `(select * from cv_users where name ='${
                          item["Alloted To(Sales)"]
                        }' and sch_id in (SELECT sch_id FROM cv_school_detail where cv_school_detail.cv_pid=4))`
                      : " 0";

                  if (salePerson_email != 0) {
                    return await dbUtils.runSqlQueryAsyncSelect(
                      salePerson_email,
                      []
                    );
                  } else {
                    return "";
                  }
                }
              } else {
                return "";
              }
            })
            .then(async (SalesPersonDetails) => {
              if (SalesPersonDetails) {
                if (SalesPersonDetails.err) throw SalesPersonDetails.err;
                else {
                  await salesFollowupMails(
                    SalesPersonDetails.result[0].name,
                    SalesPersonDetails.result[0].email,
                    scheduleDate,
                    item
                  );
                  return SalesPersonDetails;
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
      });

      return res.send("data Upload");
    }

    try {
      let c = 0;
      const workbook = XLSX.read(req.file.buffer);
      // console.log(workbook);
    } catch (e) {
      res.status(400).send({
        message: "Invalid spreadsheet check sample file for reference",
        error: e.message,
      });
    }
  }
);
async function salesFollowupMails(
  sales_name,
  sales_email,
  schedule_data,
  param
) {
  let dateSchedule = schedule_data
    ? `<p><b>Preferred Demo Date:</b> ${
        param["Schedule Date"] != undefined ? schedule_data : ""
      }</p>`
    : "";
  const mailgun = require("mailgun-js");
  var dateFormat = require("dateformat");
  let institute = param["Institute Name"]
    ? `<p><b>Institute Name:</b> ${param["Institute Name"]}</p>`
    : "";

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
    <p><b> ${
      param["Kid's Name"]
    } </b> has sent you a request for live DEMO class</p>
    <p>Please contact them using following details to book a slot:</p>
     <p><b>Parent's Name: </b> ${
       param["Parent's Name"] != undefined ? param["Parent's Name"] : ""
     }</p>
     <p><b>Parent's Email ID: </b> ${
       param["Parent's Email"] != undefined ? param["Parent's Email"] : ""
     }</p>
     <p><b>Parent's Mobile Number: </b> ${
       param["Parent's Contact"] != undefined ? param["Parent's Contact"] : ""
     }</p>
     <p><b>Kid's Name: </b> ${
       param["Kid's Name"] != undefined ? param["Kid's Name"] : ""
     }</p>
      ${dateSchedule}
    </body>
    `,
  };
  return msg.messages().send(data);
}

async function sendPsychometicReport(params, skills, attachmentBuffer) {
  console.log("Psycometric Report");
  const mailgun = require("mailgun-js");
  const DOMAIN = "mail.codevidhya.com";
  const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
  const mg = mailgun({ apiKey: api, domain: DOMAIN });
  const data = {
    from: "Codevidhya <contact@codevidhya.com>",
    to: params.parent_email,
    cc: "cvlivebookings@codevidhya.com",
    attachment: attachmentBuffer,
    subject: `Psycomatric Report`,
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
                      <h4 style="font-size: 20px;">Dear ${params.studentName}</h4>
                  </td>
              </tr> 
               <tr style="border-collapse:collapse;"> 
                <td align="left" style="">
                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">
                Congratulations on completing your First Session with Codevidhya. <br/>
                It was a true delight to have you in our session and your trainer is greatly optimistic about your coding journey.
                </p></td> 
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
         Codevidhya is truly delighted to share with you, your Demo session feedback report that gives insights on your child's progress on 21st Century Skills.<br/>
         Our machine learning algorithms and live teacher feedback assessed your performance real-time and generated a unique report as attached in the mail.
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
       You are great with your 21st Century Skills. <br/>
       Codevidhya wants you to work more intently on your comparatively weaker areas as early as possible.
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
          We look forward to having ${params.studentName} as part of the Codevidhya Family and embarking on their journey to be the 'Creator of Technology'
          </p>
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
}
router.post("/GetStudentDetailForCourseSuggestion", (req, res) => {
  let query,
    params = req.body;
  query =
    "SELECT live_class_request.name 'parent_name',live_class_request.email 'parent_email',live_class_request.contact 'parent_contact',demo_trial_courses.theme,cv_users.name,cv_users.user_id,live_class_request.req_id FROM `live_class_request` inner join live_demo_course_assigned on (live_demo_course_assigned.req_id =live_class_request.req_id) inner join cv_users on (cv_users.user_id =live_demo_course_assigned.user_id) inner join demo_trial_courses on (demo_trial_courses.demo_course_id = live_demo_course_assigned.demo_course_id) WHERE live_class_request.req_id=?";
  return dbUtils
    .runSqlQueryAsyncSelect(query, [params.req_id])
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else return res.send(dataResult.result);
    });
});

router.post("/getDemoUniqueDates", (req, res) => {
  let currentDate = new Date();
  currentDate = currentDate.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  let start_date = dateFormat(currentDate, "yyyy-mm-dd");
  currentDate1 = new Date(currentDate);
  let nextdate = currentDate1.setDate(currentDate1.getDate() + 2);
  nextdate = new Date(nextdate);
  /*nextdate =nextdate.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata"
      });*/
  let end_date = dateFormat(nextdate, "yyyy-mm-dd");

  return dbUtils
    .runSqlQueryAsyncSelect(
      "SELECT  Date_format(date_s_time_slot,'%Y-%m-%d') 'dates' from trainer_calendar where trainer_calendar.calenter_type='demo' and date_format(date_s_time_slot,'%Y-%m-%d') BETWEEN ? and ? group by dates order by dates",
      [start_date, end_date]
    )
    .then((result) => {
      if (result.err) throw result.err;
      else {
        return res.send(result.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/getSalesSuggestionByTrainer", (req, res) => {
  let params = req.body;
  let query, param;
  query =
    "SELECT `student_feedback_id`, `req_id`, `user_id`, `skills`, `course_suggestion`, `comments` FROM `live_class_student_feedback` inner join live_demo_course_assigned on (live_demo_course_assigned.req_id =live_class_student_feedback.req_id) WHERE live_demo_course_assigned.sales_person_id=?";
  params = [params.user_id];
  return dbUtils.runSqlQueryAsyncSelect(query, params).then((dataResult) => {
    if (dataResult.err) throw dataResult.err;
    else {
      return res.send(dataResult.result);
    }
  });
});
router.post("/getFollowupDetails", (req, res) => {
  let query, param, params;
  params = req.body;
  query =
    "SELECT `live_class_salesperson_followup_id`,cv_users.name 'sales_person_name',demo_trial_courses.theme, live_class_salesperson_followup.req_id, live_class_salesperson_followup.status, `remark`, Date_Format(`follup_time`,'%W %M %e %Y %H:%i') 'followup_time',(case when live_demo_course_assigned.req_id then 'Scheduled' else 'UnSchedule' end) 'Scedule' FROM `live_class_salesperson_followup` inner join live_class_request on (live_class_request.req_id =live_class_salesperson_followup.req_id) inner join cv_users on (cv_users.user_id =live_class_request.sales_person_id) left join demo_trial_courses on (demo_trial_courses.demo_course_id = live_class_request.demo_course_id) LEFT JOIN live_demo_course_assigned on (live_demo_course_assigned.req_id =live_class_salesperson_followup.req_id) WHERE live_class_request.sales_person_id=? order by follup_time desc";
  param = [params.user_id];
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else {
        return res.send(dataResult.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/admin_getFollowupDetails", (req, res) => {
  if (!req.session.admin_id) {
    // Only admins are allowed
    return res.status(403).send({
      error: {
        code: 403,
        message: "unauthorized",
      },
    });
  }
  let query, param, params;
  params = req.body;
  query =
    "SELECT `live_class_salesperson_followup_id`,cv_users.name 'sales_person_name',demo_trial_courses.theme, live_class_salesperson_followup.req_id, live_class_salesperson_followup.status, `remark`, Date_Format(`follup_time`,'%W %M %e %Y %H:%i') 'followup_time',(case when live_demo_course_assigned.req_id then 'Scheduled' else 'UnSchedule' end) 'Scedule' FROM `live_class_salesperson_followup` inner join live_class_request on (live_class_request.req_id =live_class_salesperson_followup.req_id) inner join cv_users on (cv_users.user_id =live_class_request.sales_person_id) left join demo_trial_courses on (demo_trial_courses.demo_course_id = live_class_request.demo_course_id) LEFT JOIN live_demo_course_assigned on (live_demo_course_assigned.req_id =live_class_salesperson_followup.req_id) order by follup_time desc";
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else {
        return res.send(dataResult.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/allotRequestToSalesPerson", (req, res) => {
  let params = req.body;
  let query, param;
  query =
    "SELECT * FROM `live_class_request` WHERE name=? and live_class_request.email=? and live_class_request.contact=? and live_class_request.kids_name=? and live_class_request.expected_schedule_date=?";
  param = [
    params.parent_name,
    params.parent_mail,
    params.parent_contact,
    params.kids_name,
    params.schedule_date,
  ];
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else if (dataResult.result.length) return "";
      else {
        return dbUtils.runSqlQueryAsyncInsert(
          "INSERT INTO `live_class_request`(`name`, `email`, `contact`,`kids_name`,`expected_schedule_date`,`sales_person_id`,`demo_course_id`,`institute`,`city`,`state`,`country`,`cls_id`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            params.parent_name,
            params.parent_mail,
            params.parent_contact,
            params.kids_name,
            params.schedule_date,
            params.sales_id,
            params.demo_course_id,
            params.institute_name,
            params.city,
            params.state,
            params.country,
            params.grade,
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
          param = [params.sales_id];
          return await dbUtils.runSqlQueryAsyncSelect(query, param);
          // await sentRequestDemoMail(params);
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
          await salesFollowupMail(
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
async function salesFollowupMail(sales_name, sales_email, param) {
  const mailgun = require("mailgun-js");
  var dateFormat = require("dateformat");
  let institute = param.institute_name
    ? `<p><b>Institute Name:</b> ${param.institute_name}</p>`
    : "";
  let theme =
    param.demo_course_id != 0 ? `<p><b>Module:</b> ${param.theme}</p>` : "";
  let Grade =
    param.grade != 0 ? `<p><b>Module:</b> ${param.gradeName}</p>` : "";

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
    <p><b> ${param.kids_name} </b> has sent you a request for live DEMO class</p>
    <p>Please contact them using following details to book a slot:</p>
     <p><b>Parent's Name: </b> ${param.parent_name}</p>
     <p><b>Parent's Email ID: </b> ${param.parent_mail}</p>
     <p><b>Parent's Mobile Number: </b> ${param.parent_contact}</p>
     <p><b>Kid's Name: </b> ${param.kids_name}</p>
     ${Grade} ${institute} ${theme}
     <p><b>Preferred Demo Date:</b> ${param.schedule_date}</p>
    
    </body>
    `,
  };
  return msg.messages().send(data);
}

router.post("/sentFollowupdetail", (req, res) => {
  let query, param, params;
  let currentDate = new Date();
  currentDate = currentDate.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });

  currentDate = dateFormat(currentDate, "yyyy-mm-dd HH:MM:ss");
  console.log(currentDate);
  params = req.body;
  query =
    "INSERT INTO `live_class_salesperson_followup`( `req_id`, `status`, `remark`,`follup_time`) VALUES (?,?,?,?)";
  param = [params.req_id, params.status, params.desc, currentDate];
  return dbUtils
    .runSqlQueryAsyncInsert(query, param)
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else return res.send(dataResult.result);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/getCerficateDetails", (req, res) => {
  let params = req.body;
  query =
    "SELECT live_demo_course_assigned.assigned_id,cv_users.name,live_class_mail_send.certificate_keyword,demo_trial_courses.theme FROM `live_demo_course_assigned` inner join cv_users on (cv_users.user_id =live_demo_course_assigned.user_id) inner join demo_trial_courses on (demo_trial_courses.demo_course_id = live_demo_course_assigned.demo_course_id) inner join live_class_mail_send on (live_class_mail_send.username = cv_users.username) WHERE live_demo_course_assigned.user_id=? and live_class_mail_send.certificate_mail=1 and live_class_mail_send.platform=1 and live_class_mail_send.certificate_mail IS NOT NULL";
  return dbUtils
    .runSqlQueryAsyncSelect(query, [params.user_id])
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else {
        return res.send(dataResult.result);
      }
    });
});
router.post("/getAllUnscheduleSalesLead", (req, res) => {
  let query, param, params;
  params = req.body;
  query =
    "SELECT live_class_request.req_id, live_class_request.name 'parent_name', live_class_request.email 'parent_email',(case when live_demo_course_assigned.req_id then 'Scheduled' else 'UnSchedule' end) 'Scedule', live_class_request.contact 'parent_contact', `kids_name`, `institute`,live_class_request.country,live_class_request.state,live_class_request.city, cv_classes.cls_name 'grade',cv_classes.cls_id, DATE_FORMAT(`request_at`,'%W %M %e %Y') request_at,Date_FORMAT(`expected_schedule_date`,'%Y-%m-%d') expected_schedule_date, Date_FORMAT(`expected_schedule_date`,' %e %M %Y') expected_schedule_date1,demo_trial_courses.theme, live_class_request.sales_person_id, live_class_request.demo_course_id FROM `live_class_request` left join cv_users on (cv_users.user_id = live_class_request.sales_person_id) left join cv_classes on (cv_classes.cls_id = live_class_request.cls_id) LEFT JOIN live_demo_course_assigned on (live_demo_course_assigned.req_id =live_class_request.req_id) left join demo_trial_courses on (demo_trial_courses.demo_course_id IN (live_class_request.demo_course_id,live_demo_course_assigned.demo_course_id)) WHERE live_class_request.sales_person_id=? order by live_class_request.request_at desc";
  param = [params.user_id];
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else {
        return res.send(dataResult.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/admin_getAllUnscheduleSalesLead", (req, res) => {
  if (!req.session.admin_id) {
    // Only admins are allowed
    return res.status(403).send({
      error: {
        code: 403,
        message: "unauthorized",
      },
    });
  }
  let query, param, params;
  params = req.body;
  query = `SELECT
          live_class_request.req_id,
          live_class_request.name parent_name,
          live_class_request.email parent_email,
          (case when live_demo_course_assigned.req_id
            then 'Scheduled' else 'UnSchedule'
            end) 'Scedule',
          live_class_request.contact parent_contact,
          kids_name,
          institute,
          cv_classes.cls_name grade,
          cv_classes.cls_id,
          DATE_FORMAT(request_at,'%W %M %e %Y') request_at,
          Date_FORMAT(expected_schedule_date,'%Y-%m-%d') expected_schedule_date,
          Date_FORMAT(expected_schedule_date,' %e %M %Y') expected_schedule_date1,
          demo_trial_courses.theme,
          live_class_request.sales_person_id,
          live_class_request.demo_course_id,
          cv_users.name sales_person_name
        FROM live_class_request
          left join cv_users
            on (cv_users.user_id = live_class_request.sales_person_id)
          left join cv_classes
            on (cv_classes.cls_id = live_class_request.cls_id)
          LEFT JOIN live_demo_course_assigned
            on (live_demo_course_assigned.req_id =live_class_request.req_id)
          left join demo_trial_courses
            on (demo_trial_courses.demo_course_id
                  IN (live_class_request.demo_course_id,live_demo_course_assigned.demo_course_id))
        WHERE live_class_request.sales_person_id>0
        order by live_class_request.request_at desc`;
  //param=[params.user_id];
  return dbUtils
    .runSqlQueryAsyncSelect(query)
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else {
        return res.send(dataResult.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/getDemoUniqueTimes", (req, res) => {
  let currentDate = new Date();
  currentDate = currentDate.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  let start_date = dateFormat(currentDate, "yyyy-mm-dd");
  currentDate1 = new Date(currentDate);
  let nextdate = currentDate1.setDate(currentDate1.getDate() + 2);
  nextdate = new Date(nextdate);
  /*nextdate =nextdate.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata"
      });*/
  let end_date = dateFormat(nextdate, "yyyy-mm-dd");
  let query =
    "SELECT Date_format(date_s_time_slot,'%r') 'time' from trainer_calendar where trainer_calendar.calenter_type='demo' and date_format(date_s_time_slot,'%Y-%m-%d') BETWEEN ? and ? group by Date_format(date_s_time_slot,'%H:%i') order by Date_format(date_s_time_slot,'%H:%i')";
  let param = [start_date, end_date];
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then((dataResult) => {
      if (dataResult.err) throw dataResult.err;
      else {
        return res.send(dataResult.result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/getTrialCoursesNextThreeDaysSchedule", (req, res) => {
  let params = req.body;
  let currentDate = new Date();
  currentDate = currentDate.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  let start_date = dateFormat(currentDate, "yyyy-mm-dd");
  currentDate1 = new Date(currentDate);
  let nextdate = currentDate1.setDate(currentDate1.getDate() + 2);
  nextdate = new Date(nextdate);
  /* nextdate =nextdate.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata"
      });*/
  let end_date = dateFormat(nextdate, "yyyy-mm-dd");

  let query =
    "SELECT `user_id` FROM `trainer_subjects` WHERE course_id=? and course_type='demo'";
  let param = [params.courseId, start_date, end_date];
  return dbUtils
    .runSqlQueryAsyncSelect(query, param)
    .then(async (resdData) => {
      if (resdData.err) throw resdData.err;
      else {
        let resultData = resdData.result;
        let unique_date = [];
        await asyncforEach(resultData, async (item, index) => {
          if (process.env.CV_SITE == "main" || process.env.CV_SITE == "test")
            query =
              "SELECT trainer_calendar.trainer_calender_id,`date_s_time_slot`,Date_Format(`date_s_time_slot`,'%Y-%m-%d') 'start_date',? 'trainer_id',Date_format(`date_s_time_slot`,'%r') 'time', `user_ids`, (case when find_in_set(?,booked_ids) then 'booked' when live_demo_course_assigned.assigned_id then 'booked' When !(trainer_calendar.date_s_time_slot > DATE_ADD(CONVERT_TZ(now(),'+00:00','+5:30'), INTERVAL 1 HOUR)) THEN 'booked'  else 'not_booked' end) 'booked',trainer_class_link.class_link,trainer_class_link.t_class_link_id FROM `trainer_calendar` left join live_demo_course_assigned on (live_demo_course_assigned.trainer_calender_id =trainer_calendar.trainer_calender_id and live_demo_course_assigned.trainer_id=?) inner join trainer_class_link on (trainer_class_link.user_id =? and trainer_class_link.course_type='demo' and (trainer_class_link.course_id=0 or trainer_class_link.course_id=?)) where find_in_set(?,user_ids) and DATE_FORMAT(date_s_time_slot,'%Y-%m-%d') BETWEEN ? and ? and trainer_calendar.calenter_type='demo' order by date_s_time_slot";
          else
            query =
              "SELECT trainer_calendar.trainer_calender_id,`date_s_time_slot`,Date_Format(`date_s_time_slot`,'%Y-%m-%d') 'start_date',? 'trainer_id',Date_format(`date_s_time_slot`,'%r') 'time', `user_ids`, (case when find_in_set(?,booked_ids) then 'booked' when live_demo_course_assigned.assigned_id then 'booked' When !(trainer_calendar.date_s_time_slot > DATE_ADD(now(), INTERVAL 1 HOUR)) THEN 'booked'  else 'not_booked' end) 'booked',trainer_class_link.class_link,trainer_class_link.t_class_link_id FROM `trainer_calendar` left join live_demo_course_assigned on (live_demo_course_assigned.trainer_calender_id =trainer_calendar.trainer_calender_id and live_demo_course_assigned.trainer_id=?) inner join trainer_class_link on (trainer_class_link.user_id =? and trainer_class_link.course_type='demo' and (trainer_class_link.course_id=0 or trainer_class_link.course_id=?)) where find_in_set(?,user_ids) and DATE_FORMAT(date_s_time_slot,'%Y-%m-%d') BETWEEN ? and ? and trainer_calendar.calenter_type='demo' order by date_s_time_slot";
          param = [
            item.user_id,
            item.user_id,
            item.user_id,
            item.user_id,
            params.courseId,
            item.user_id,
            start_date,
            end_date,
          ];
          await dbUtils
            .runSqlQueryAsyncSelect(query, param)
            .then(async (calendarResult) => {
              if (calendarResult.err) throw calendarResult.err;
              else {
                unique_date.push(calendarResult.result);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
        return res.send(unique_date);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
/****End demo live classes */

module.exports = router;
