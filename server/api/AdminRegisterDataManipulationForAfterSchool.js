var express = require("express");
var router = express.Router();
const path = require("path");
var pathUtils = require("./path-utils");
const jwt = require("jsonwebtoken");
var fs = require("fs-extra");
var mkdirp = require("mkdirp");
var multer = require("multer");
var dateFormat = require("dateformat");
var pool = require("../db").pool;
var dbUtils = require("./database-utils");
const appRoot = path.resolve(path.join(__dirname, "../../"));
const pathSeparator = appRoot.indexOf("\\") >= 0 ? "\\" : "/";
var moment = require("moment");
var excel = require("excel4node");
const XLSX = require("xlsx");
router.post("/downloadRecordFile", (req, res, next) => {
  let params = req.body;
  let workbook = new excel.Workbook();
  let sheet1 = workbook.addWorksheet("SchoolDetail");
  let sheet2 = workbook.addWorksheet("TeacherDetails");
  let sheet3 = workbook.addWorksheet("StudentDetails");
  var schoolcols = [
    "School Name",
    "Address",
    "Contact",
    "Board",
    "Email",
    "City",
    "State",
    "Country"
  ];
  let teachercols = [
    "Name",
    "Gender",
    "Contact",
    "Email",
    "Address",
    "City",
    "State",
    "Country"
  ];
  let studentcols = [
    "Name",
    "Grade",
    "Section",
    "Gender",
    "Contact",
    "Email",
    "DOB",
    "Address",
    "City",
    "State",
    "Country",
    "Parent Name",
    "Relation",
    "Parent Email",
    "Course Enrolled"
  ];

  let cv_programe = [];
  return dbUtils
    .runSqlQueryAsyncSelect(
      "SELECT after_school_course.course_name FROM `after_school_course`",
      []
    )
    .then(result => {
      if (result.err) throw err;
      else {
        schoolcols.forEach((cel, index) => {
          sheet1.cell(1, index + 1).string(cel);
        });
        teachercols.forEach((cel, index) => {
          sheet2.cell(1, index + 1).string(cel);
        });
        studentcols.forEach((cel, index) => {
          sheet3.cell(1, index + 1).string(cel);
        });

        result.result.forEach((dat, ind) => {
          cv_programe.push(dat.course_name);
        });
        let Gender = "Male,Female,Other,Do not want to disclose";
        let Grade = "1,2,3,4,5,6,7,8,9,10,11,12";
        let Section = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";

        sheet1.addDataValidation({
          type: "custom",
          prompt: "Follow email address format Example: abc@email.com",
          error: "Follow correct email format",
          allowBlank: 0,
          sqref: "E2:E1048576",
          formulas: ['=ISNUMBER(MATCH("*@*.?*",E2,0))']
        });

        sheet2.addDataValidation({
          type: "custom",
          prompt: "Follow email address format Example: abc@email.com",
          error: "Follow email address format",
          allowBlank: 0,
          sqref: "D2:D1048576",
          formulas: ['=ISNUMBER(MATCH("*@*.?*",D2,0))']
        });
        sheet3.addDataValidation({
          type: "custom",
          prompt: "Follow date format i.e. (1-Aug-2002)",
          error: "Follow date format ",
          allowBlank: 0,
          sqref: "G2:G1048576",
          formulas: ['=AND(ISNUMBER(G2),LEFT(CELL("format",G2),1)="D")']
        });
        sheet3.addDataValidation({
          type: "custom",
          prompt: "Follow email address format Example: abc@email.com",
          error: "Write correct email address",
          allowBlank: 0,
          sqref: "F2:F1048576", // =ISNUMBER(MATCH("*@*.?*",A2,0))
          formulas: ['=ISNUMBER(MATCH("*@*.?*",F2,0))']
        });
        sheet3.addDataValidation({
          type: "custom",
          prompt: "Follow email address format Example: abc@email.com",
          error: "Write correct email address",
          allowBlank: 0,
          sqref: "N2:N1048576",
          formulas: ['=ISNUMBER(MATCH("*@*.?*",N2,0))']
        });

        sheet2.addDataValidation({
          type: "list",
          prompt: "Choose gender",
          error: "Invalid choice. Choose from the given options.",
          allowBlank: true,
          showDropDown: true,
          sqref: "B2:B1048576",
          formulas: [Gender]
        });
        sheet3.addDataValidation({
          type: "list",
          prompt: "Choose enroll course",
          error: "Invalid choice. Choose from the given options.",
          allowBlank: true,
          showDropDown: true,
          sqref: "O2:O1048576",
          formulas: [cv_programe.join()]
        });
        sheet3.addDataValidation({
          type: "list",

          prompt: "Choose grade",
          error: "Invalid choice. Choose from the given options.",
          allowBlank: true,
          showDropDown: true,
          sqref: "B2:B1048576",
          formulas: [Grade]
        });
        sheet3.addDataValidation({
          type: "list",
          prompt: "Choose section",
          error: "Invalid choice.Choose from the given options.",
          allowBlank: true,
          showDropDown: true,
          sqref: "C2:C1048576",
          formulas: [Section]
        });
        sheet3.addDataValidation({
          type: "list",
          allowBlank: true,
          prompt: "Choose gender",
          error: "Invalid choice.Choose from the given options.",
          showDropDown: true,
          sqref: "D2:D1048576",
          formulas: [Gender]
        });
        sheet1.addDataValidation({
          type: "custom",
          allowBlank: true,
          prompt: "Mobile number must be in numeric only",
          error: "Mobile number should be 10 digit whole number",
          sqref: "C2:C1048576",
          formulas: ["=AND(ISNUMBER(C2),LEN(C2)=10)"]
        });

        sheet2.addDataValidation({
          type: "custom",
          allowBlank: true,
          prompt: "Mobile number must be in numeric only",
          error: "Mobile number should be 10 digit whole number",
          sqref: "C2:C1048576",
          formulas: ["=AND(ISNUMBER(D2),LEN(D2)=10)"]
        });
        sheet3.addDataValidation({
          type: "custom",
          allowBlank: true,
          prompt: "Mobile number must be in numeric only",
          error: "Mobile number should be 10 digit whole number",
          sqref: "E2:E1048576",
          formulas: ["=AND(ISNUMBER(E2),LEN(E2)=10)"]
        });
        return dbUtils.runSqlQueryAsyncSelect(
          "SELECT p_role_name FROM `parent_roles`",
          []
        );
      }
    })
    .then(result1 => {
      if (result1.err) throw result1.err;
      else {
        let relation = [];
        result1.result.forEach((dat, ind) => {
          relation.push(dat.p_role_name);
        });
        sheet3.addDataValidation({
          type: "list",
          allowBlank: true,
          prompt: "Choose relation with the student",
          error: "Invalid choice.Choose from the given options.",
          showDropDown: true,
          sqref: "M2:M1048576",
          formulas: [relation.join()]
        });
        workbook.write("SchoolRecord.xlsx", res);
      }
    })
    .catch(err => {
      console.log(err);
    });
});
var FileRecord = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.resolve(appRoot + "/dynamic/school_record"));
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
let schoolRecordupload = multer({ storage: FileRecord });
router.post(
  "/uploadSchoolRecord",
  schoolRecordupload.any(),
  (req, res, next) => {
    var params = req.body;
    let username = "";

    let existingSubjects = new Object();
    if (req.files.length > 0) {
      let file = req.files[0];
      const workbook = XLSX.readFile(
        appRoot + "/dynamic/school_record/" + file.filename
      );
      const sheetNameList = workbook.SheetNames;
      let sheetsRecord = [],
        cv_pid;
      sheetNameList.forEach((dat, index) => {
        sheetsRecord.push(
          XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[index]])
        );
      });
      let sch_id = 0;
      let query =
        "SELECT cv_school_detail.sch_id,cv_users.user_id,cv_users.username FROM `cv_school_detail` inner join cv_users on (cv_users.sch_id =cv_school_detail.sch_id and cv_users.role_id =1) WHERE cv_school_detail.name=? and cv_school_detail.email=?";
      let param = [
        sheetsRecord[0][0]["School Name"],
        sheetsRecord[0][0]["Email"]
      ];
      /**School Registration */
      return dbUtils
        .runSqlQueryAsyncSelect(query, param)
        .then(data => {
          console.log(data);
          if (data.err) throw err;
          else if (data.result && data.result.length) {
            sch_id = data.result[0].sch_id;
            username = data.result[0].username;
            return "";
          } else {
            query = "SELECT cv_pid FROM `cv_programs` WHERE cv_pid=2";
            //param = [sheetsRecord[0][0].Program];
            return dbUtils.runSqlQueryAsyncSelect(query, param);
          }
        })
        .then(dat2 => {
          if (dat2) {
            cv_pid = dat2.result[0].cv_pid;
            query = "SELECT course_id FROM `after_school_course` ";
            return dbUtils.runSqlQueryAsyncSelect(query, []);
          } else {
            return "";
          }
        })
        .then(data1 => {
          if (!data1) {
            return "";
          } else {
            if (data1.err) throw err;
            else {
              let courseIds = [];
              data1.result.forEach((dat, index) => {
                courseIds.push(dat.course_id);
              });
              console.log(courseIds);
              query =
                "INSERT INTO `cv_school_detail`( `name`, `contact`, `email`, `city`, `state`, `address`,`cv_pid`, `curriculum_course_available`,`course_id`) VALUES (?,?,?,?,?,?,?,?,?)";
              param = [
                sheetsRecord[0][0]["School Name"],
                sheetsRecord[0][0].Contact,
                sheetsRecord[0][0].Email,
                sheetsRecord[0][0].City,
                sheetsRecord[0][0].State,
                sheetsRecord[0][0].Address,
                cv_pid,
                1,
                courseIds.join(),
                1
              ];
              return dbUtils.runSqlQueryAsyncInsert(query, param);
            }
          }
        })
        .then(async record => {
          console.log(record);

          // else {
          if (!record) {
            return "";
          } else {
            if (record.err) throw record.er;
            else {
              let password = await genpassword();
              username = sheetsRecord[0][0]["School Name"].replace(
                /[^a-zA-Z ]/g,
                " "
              );
              username = username.replace(/\s/g, "").toLowerCase();
              username = await checkUser(username);
              let userpath = await createfolder(username);
              query =
                "INSERT INTO `cv_users`(`sch_id`, `role_id`, `name`, `contact`, `email`, `country`, `state`, `city`, `address`,`board`, `username`, `password`, `path`, `status`, `profile_pic`) VALUES ((SELECT sch_id FROM cv_school_detail WHERE email=?),1,?,?,?,?,?,?,?,?,?,?,?,1,'')";
              param = [
                sheetsRecord[0][0].Email,
                sheetsRecord[0][0]["School Name"],
                sheetsRecord[0][0].Contact,
                sheetsRecord[0][0].Email,
                sheetsRecord[0][0].Country,
                sheetsRecord[0][0].State,
                sheetsRecord[0][0].City,
                sheetsRecord[0][0].Address,
                sheetsRecord[0][0].Board,
                username,
                password,
                userpath
              ];
              return await dbUtils.runSqlQueryAsyncInsert(query, param);
            }
          }
          //  }
        })
        .then(async schoolmsg => {
          if (schoolmsg.err) throw schoolmsg.err;
          else {
            /*** */
            sch_id = await getSchooIdFromEmail(sheetsRecord[0][0].Email);
            let board = await sheetsRecord[0][0].Board;

            await teacherRecordsUpdation(
              sch_id,
              username,
              board,
              sheetsRecord[1]
            );
            await studentRecordsUpdation(
              sch_id,
              username,
              board,
              sheetsRecord[2]
            );
          }
        })
        .catch(err => {
          console.log(err);
        });
      /** End School Registration */
    }
  }
);
async function asyncforEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
async function studentRecordsUpdation(
  sch_id,
  sch_username,
  board,
  ...StudentDetailss
) {
  await asyncforEach(StudentDetailss, async (studentdetails, indexes) => {
    await asyncforEach(studentdetails, async (studentdetail, index) => {
      /***Student query */

      let dob = null,
        userId,
        cv_st_p_id = 0,
        username,
        password,
        roleId,
        parent_username,
        parent_password,
        parent_path,
        courseId = null;
      if (studentdetail.DOB) {
        dob = dateFormat(
          new Date(Math.round(studentdetail.DOB - 25569) * 86400 * 1000),
          "yyyy-mm-dd"
        );
      }
      let query = "",
        param = [];
      if (
        studentdetail["Parent Name"] &&
        studentdetail["Parent Email"] &&
        studentdetail.Section
      ) {
        let contactS = "",
          addr = "";
        studentdetail.Contact ? (contactS = "=") : (contactS = "IS");
        studentdetail.Address ? (addr = "=") : (addr = "IS");
        console.log(studentdetail.Contact + "   " + contactS);
        query = `SELECT t.* from (SELECT cv_users.user_id,parent_roles.p_role_id,cv_st_parent_detail.cv_st_p_id FROM cv_users inner join cv_st_detail on (cv_st_detail.user_id = cv_users.user_id) inner join cv_st_parent_detail on (cv_users.user_id in (cv_st_parent_detail.user_id)) INNER join parent_roles on (parent_roles.p_role_id =cv_st_parent_detail.p_role_id) WHERE cv_users.name=? and cv_st_detail.cls_id =? and cv_st_detail.sec_id =(SELECT cv_sections.sec_id  from cv_sections where cv_sections.sec_name=?) and cv_users.contact ${contactS} ? and cv_users.address ${addr} ? and parent_roles.p_role_name=? and cv_users.sch_id=?) t inner join cv_st_parent_detail on (cv_st_parent_detail.cv_st_p_id =t.cv_st_p_id) where (case when t.p_role_id=1 then (cv_st_parent_detail.father_name =? and cv_st_parent_detail.father_email_id=?) when t.p_role_id=2 then (cv_st_parent_detail.mother_name =? and cv_st_parent_detail.mother_email_id=?) else (cv_st_parent_detail.g_name=? and cv_st_parent_detail.g_email_id=?) end);`;
        param = [
          studentdetail.Name,
          studentdetail.Grade ? studentdetail.Grade : 0,
          studentdetail.Section ? studentdetail.Section : 0,
          studentdetail.Contact,
          studentdetail.Address,
          studentdetail.Relation,
          sch_id,
          studentdetail["Parent Name"],
          studentdetail["Parent Email"],
          studentdetail["Parent Name"],
          studentdetail["Parent Email"],
          studentdetail["Parent Name"],
          studentdetail["Parent Email"]
        ];
      } else if (studentdetail.Section) {
        let contactS = "",
          db = "";
        studentdetail.Contact ? (contactS = "=") : (contactS = "IS");
        dob ? (db = "=") : (db = "IS");
        query = `SELECT * FROM cv_users INNER join cv_st_detail on (cv_st_detail.user_id =cv_users.user_id) where cv_users.name=? and cv_users.role_id=? and cv_users.contact ${contactS} ? and cv_users.dob ${db} ? and cv_st_detail.cls_id=? and cv_st_detail.sec_id=(SELECT cv_sections.sec_id  from cv_sections where cv_sections.sec_name=?) and cv_st_detail.course_id=(SELECT after_school_course.course_id from after_school_course where after_school_course.course_name=?)`;
        param = [
          studentdetail.Name,
          3,
          studentdetail.Contact ? studentdetail.Contact : null,
          dob ? dob : null,
          studentdetail.Grade ? studentdetail.Grade : 0,
          studentdetail.Section ? studentdetail.Section : 0,
          studentdetail["Course Enrolled"]
        ];
      } else {
        let contactS = "",
          db = "";
        studentdetail.Contact ? (contactS = "=") : (contactS = "IS");
        dob ? (db = "=") : (db = "IS");
        query = `SELECT * FROM cv_users INNER join cv_st_detail on (cv_st_detail.user_id =cv_users.user_id) where cv_users.name=? and cv_users.role_id=?  and cv_users.contact ${contactS} ? and cv_users.dob ${db} ? and cv_st_detail.cls_id=? and cv_st_detail.sec_id=? and cv_st_detail.course_id=(SELECT after_school_course.course_id from after_school_course where after_school_course.course_name=?)`;
        param = [
          studentdetail.Name,
          3,
          studentdetail.Contact ? studentdetail.Contact : null,
          dob ? dob : null,
          studentdetail.Grade ? studentdetail.Grade : 0,
          studentdetail.Section ? studentdetail.Section : 0,
          studentdetail["Course Enrolled"]
        ];
      }
      return await dbUtils
        .runSqlQueryAsyncSelect(query, param)
        .then(async data => {
          if (data.err) {
            throw err;
          } else {
            if (data.result && data.result.length) return "";
            else {
              username = studentdetail.Name.replace(/[^a-zA-Z ]/g, " ");
              username = username.replace(/\s/g, "").toLowerCase();
              username = await checkUser(username);
              let new_path = sch_username + "/" + username;
              userpath = await createfolder(new_path);
              password = await genpassword();
              if (studentdetail.DOB) {
                dob = dateFormat(
                  new Date(
                    Math.round(studentdetail.DOB - 25569) * 86400 * 1000
                  ),
                  "yyyy-mm-dd"
                );
              } else {
                dob = null;
              }
              query =
                "INSERT INTO `cv_users`(`sch_id`, `role_id`, `name`, `sex`, `contact`, `email`, `dob`, `country`, `state`, `city`, `address`, `board`, `username`, `password`, `path`,status) VALUES (?,3,?,?,?,?,?,?,?,?,?,?,?,?,?,1)";
              param = [
                sch_id,
                studentdetail.Name,
                studentdetail.Gender,
                studentdetail.Contact,
                studentdetail.Email,
                dob,
                studentdetail.Country,
                studentdetail.state,
                studentdetail.City,
                studentdetail.Address,
                board,
                username,
                password,
                userpath
              ];
              return dbUtils.runSqlQueryAsyncInsert(query, param);
            }
          }
        })
        .then(stres => {
          if (stres) {
            if (stres.err) throw stres.err;
            else {
              query =
                "SELECT after_school_course.course_id FROM `after_school_course` WHERE after_school_course.course_name=?";
              param = [studentdetail["Course Enrolled"]];
              return dbUtils.runSqlQueryAsyncSelect(query, param);
            }
          } else {
            return "";
          }
        })
        .then(stresult => {
          if (stresult) {
            if (stresult.err) throw stresult.err;
            else {
              courseId = stresult.result[0].course_id;
              query =
                "SELECT `user_id` FROM `cv_users` WHERE cv_users.username=? and cv_users.password=?";
              param = [username, password];

              return dbUtils.runSqlQueryAsyncSelect(query, param);
            }
          } else {
            return "";
          }
        })
        .then(getstuserid => {
          if (getstuserid) {
            if (getstuserid.err) throw getstuserid.err;
            else {
              userId = getstuserid.result[0].user_id;
              query =
                "SELECT * FROM `cv_st_detail` WHEre cv_st_detail.user_id =? and cv_st_detail.sch_id=?";
              param = [userId, sch_id];
              return dbUtils.runSqlQueryAsyncSelect(query, param);
            }
          } else {
            return "";
          }
        })
        .then(testdata => {
          if (testdata) {
            if (testdata.err) throw testdata.err;
            else if (testdata.result && testdata.result.length) {
              return testdata;
            } else {
              if (studentdetail.Grade)
                query =
                  "INSERT INTO `cv_st_detail`(`user_id`, `sch_id`, `cls_id`, `sec_id`,`course_id`) VALUES (?,?,?,(SELECT cv_sections.sec_id FROM `cv_sections` WHERE cv_sections.sec_name=?),?)";
              else
                query =
                  "INSERT INTO `cv_st_detail`(`user_id`, `sch_id`, `cls_id`, `sec_id`,`course_id`) VALUES (?,?,?,?,?)";
              param = [
                userId,
                sch_id,
                studentdetail.Grade ? studentdetail.Grade : 0,
                studentdetail.Section ? studentdetail.Section : 0,
                courseId
              ];
              return dbUtils.runSqlQueryAsyncInsert(query, param);
            }
          } else {
            return "";
          }
        })
        .then(inseruserdata => {
          if (inseruserdata) {
            if (inseruserdata.err) throw inseruserdata;
            else {
              query =
                "SELECT `p_role_id` FROM `parent_roles` WHERE  parent_roles.p_role_name=?";
              param = [studentdetail.Relation];
              return dbUtils.runSqlQueryAsyncSelect(query, param);
            }
          } else {
            return "";
          }
        })
        .then(async getProlId => {
          if (getProlId) {
            if (getProlId.err) throw getProlId;
            else {
              if (getProlId.result && getProlId.result.length) {
                roleId = getProlId.result[0].p_role_id;
                //test st_parent user_id
                if (roleId == 1) {
                  query =
                    "SELECT `cv_st_p_id`,user_id FROM `cv_st_parent_detail` WHERE  cv_st_parent_detail.father_email_id =?";
                } else if (roleId == 2) {
                  query =
                    "SELECT `cv_st_p_id`,user_id FROM `cv_st_parent_detail` WHERE  cv_st_parent_detail.mother_email_id =?";
                } else if (roleId == 3) {
                  query =
                    "SELECT `cv_st_p_id`,user_id FROM `cv_st_parent_detail` WHERE  cv_st_parent_detail.g_email_id =?";
                }
                param = [studentdetail["Parent Email"]];
                return await dbUtils.runSqlQueryAsyncSelect(query, param);
              }
            }
          } else {
            return "";
          }
        })
        .then(async getcvstpid => {
          if (getcvstpid) {
            if (getcvstpid.err) throw getcvstpid.err;
            else {
              if (getcvstpid.result && getcvstpid.result.length) {
                cv_st_p_id = getcvstpid.result[0].cv_st_p_id;
                let userIds = getcvstpid.result[0].user_id;
                userIds = userIds + "," + userId;

                query =
                  "UPDATE `cv_st_parent_detail` SET `user_id`=? where cv_st_parent_detail.cv_st_p_id=?";
                param = [userIds, cv_st_p_id];
              } else {
                if (roleId == 1) {
                  query =
                    "INSERT INTO `cv_st_parent_detail`(`user_id`, `father_name`, `father_email_id`,`p_role_id`) VALUES (?,?,?,?)";
                  param = [
                    userId,
                    studentdetail["Parent Name"],
                    studentdetail["Parent Email"],
                    roleId
                  ];
                } else if (roleId == 2) {
                  query =
                    "INSERT INTO `cv_st_parent_detail`(`user_id`,  `mother_name`, `mother_email_id`,`p_role_id`) VALUES (?,?,?,?)";
                  param = [
                    userId,
                    studentdetail["Parent Name"],
                    studentdetail["Parent Email"],
                    roleId
                  ];
                } else if (roleId == 3) {
                  query =
                    "INSERT INTO `cv_st_parent_detail`( `user_id`, `g_name`, `g_email_id`,`p_role_id`) VALUES (?,?,?,?)";
                  param = [
                    userId,
                    studentdetail["Parent Name"],
                    studentdetail["Parent Email"],
                    roleId
                  ];
                }
              }
              console.log(query);
              console.log(param);
              return dbUtils.runSqlQueryAsyncInsert(query, param);
            }
          } else {
            return "";
          }
        })
        .then(async parentUpdateatSt => {
          console.log(parentUpdateatSt);
          if (parentUpdateatSt) {
            if (parentUpdateatSt.err) {
              throw parentUpdateatSt.err;
            } else {
              query =
                "SELECT cv_st_parent_detail.cv_st_p_id FROM `cv_st_parent_detail` WHERE ? in (user_id)";
              param = [userId];
              return await dbUtils.runSqlQueryAsyncSelect(query, param);
            }
          } else {
            return "";
          }
        })
        .then(async cvstpid => {
          console.log(cvstpid);
          if (cvstpid) {
            if (cvstpid.err) throw cvstpid.err;
            else {
              if (cvstpid.result && cvstpid.result.length)
                cv_st_p_id = cvstpid.result[0].cv_st_p_id;
              query = "UPDATE `cv_users` SET `cv_st_p_id`=? WHERE user_id=?";
              param = [cv_st_p_id, userId];
              return dbUtils.runSqlQueryAsyncUpdate(query, param);
            }
          } else {
            return "";
          }
        })
        .then(async updateCvUser => {
          if (updateCvUser) {
            query =
              "SELECT * FROM `cv_users` WHERE cv_users.name =? and cv_users.email=? and cv_users.role_id=4";
            param = [
              studentdetail["Parent Name"],
              studentdetail["Parent Email"]
            ];

            return dbUtils.runSqlQueryAsyncSelect(query, param);
          } else {
            return "";
          }
        })
        .then(async gercvUser => {
          if (gercvUser) {
            if (gercvUser.err) throw gercvUser.err;
            else if (gercvUser.result && gercvUser.result.length)
              return gercvUser;
            else {
              let parentfolder = await createfolder("parents"); //parent_password,parent_path;
              parent_username = studentdetail["Parent Name"].replace(
                /[^a-zA-Z ]/g,
                " "
              );
              parent_username = parent_username
                .replace(/\s/g, "")
                .toLowerCase();
              parent_username = await checkUser(parent_username);
              let new_path = "parents/" + parent_username;
              parent_path = await createfolder(new_path);
              parent_password = await genpassword();
              let gender = "";
              if (roleId == 1) {
                gender = "Male";
              } else if (roleId == 2) {
                gender = "Female";
              } else {
                gender = "";
              }
              query =
                "INSERT INTO `cv_users`(`sch_id`, `role_id`, `name`, `sex`, `contact`, `email`, `username`, `password`, `path`,cv_st_p_id,status) VALUES (1,4,?,?,?,?,?,?,?,?,1)";
              param = [
                studentdetail["Parent Name"],
                gender,
                studentdetail.Contact,
                studentdetail["Parent Email"],
                parent_username,
                parent_password,
                parent_path,
                cv_st_p_id
              ];
              return dbUtils.runSqlQueryAsyncInsert(query, param);
            }
          } else {
            return "";
          }
        })
        .then(updated => {
          if (updated) {
            if (updated.err) throw err;
            else {
              console.log("success");
              return updated;
            }
          } else {
            return updated;
          }
        })
        .catch(err => {
          console.log(err);
        });
      /***End Student query */
    });
  });
}
async function teacherRecordsUpdation(
  sch_id,
  sch_username,
  board,
  ...teachersDetailss
) {
  // const start = async() =>{
  await asyncforEach(teachersDetailss, async (teacherdetails, indexs) => {
    await asyncforEach(teacherdetails, async (teacherdetail, index) => {
      /***Teacher query */
      let dept_id = 0,
        username,
        password,
        userpath,
        assignedgrades,
        skillset;
      let query = "",
        param = "";
      if (teacherdetail.Email) {
        query =
          "SELECT user_id FROM `cv_users` WHERE cv_users.name=? and cv_users.email=? and cv_users.sch_id=? and cv_users.role_id=2";
        param = [teacherdetail.Name, teacherdetail.Email, sch_id];
      } else {
        query =
          "SELECT user_id FROM `cv_users` WHERE cv_users.name=? and cv_users.contact=? and cv_users.sch_id=? and cv_users.role_id=2";
        param = [teacherdetail.Name, teacherdetail.Contact, sch_id];
      }
      return await dbUtils
        .runSqlQueryAsyncSelect(query, param)
        .then(async data => {
          console.log(data);
          if (data.err) throw data.err;
          else {
            if (data.result && data.result.length) return "";
            else {
              query = "SELECT `dept_id` FROM `department` limit 1";
              return await dbUtils.runSqlQueryAsyncSelect(query, []);
            }
          }
        })
        .then(async depts => {
          console.log(depts);
          if (depts) {
            if (depts.err) throw depts.err;
            else {
              dept_id = depts.result[0].dept_id;
              username = teacherdetail.Name.replace(/[^a-zA-Z ]/g, " ");
              username = username.replace(/\s/g, "").toLowerCase();
              username = await checkUser(username);
              let new_path = sch_username + "/" + username;
              userpath = await createfolder(new_path);
              password = await genpassword();
              query =
                "INSERT INTO `cv_users`(`sch_id`, `role_id`, `name`, `sex`,  `contact`, `email`, `country`, `state`, `city`, `address`, `username`, `password`, `path`, `status`,`dept_id`,`board`) VALUES (?,2,?,?,?,?,?,?,?,?,?,?,?,1,?,?)";
              param = [
                sch_id,
                teacherdetail.Name,
                teacherdetail.Gender,
                teacherdetail.Contact,
                teacherdetail.Email,
                teacherdetail.Country,
                teacherdetail.State,
                teacherdetail.City,
                teacherdetail.Address,
                username,
                password,
                userpath,
                dept_id,
                board
              ];
              return await dbUtils.runSqlQueryAsyncInsert(query, param);
            }
          } else {
            return "";
          }
        })

        .then(async recodSuccessfull => {
          console.log("grades record");
          console.log(recodSuccessfull);
          if (recodSuccessfull) {
            if (recodSuccessfull.err) throw recodSuccessfull;
            else {
              console.log("Teacher successfully inserted");
              return recodSuccessfull;
            }
          } else {
            return "";
          }
        })
        .catch(err => {
          console.log(err);
        });
      /*****End Teacher Query */
    });
  });

  //}
  // await start();

  //let query="SELECT user_id FROM `cv_users` WHERE cv_users.email=? and cv_users.sch_id=?";
  //let param=[];
  //return dbUtils.runSqlQueryAsyncSelect(query,param).then()
}
async function CurriculumAssigned(sch_id, curriculumgrades) {
  grades = curriculumgrades.split(",").filter(e => e.length != 0);
  await asyncforEach(grades, async (grade, index) => {
    let query =
      "SELECT cv_school_classes.sch_id FROM `cv_school_classes` WHERE sch_id=? and cv_school_classes.cls_id=?";
    let param = [sch_id, grade];
    return await dbUtils
      .runSqlQueryAsyncSelect(query, param)
      .then(data => {
        if (data.err) return data.err;
        else if (data.result && data.result.length) {
          return data;
        } else {
          query =
            "INSERT INTO `cv_school_classes`(`sch_id`, `cls_id`) VALUES (?,?)";
          param = [sch_id, grade];
          return dbUtils.runSqlQueryAsyncInsert(query, param);
        }
      })
      .then(inserted => {
        if (inserted.err) throw inserted.err;
        else {
          return inserted;
        }
      })
      .catch(err => {
        console.log(err);
      });
  });
}

function getSchooIdFromEmail() {
  return dbUtils
    .runSqlQueryAsyncSelect(
      "SELECT sch_id FROM cv_school_detail WHERE email=?",
      [arguments[0]]
    )
    .then(result => {
      if (result.err) throw result.err;
      else return result.result[0].sch_id;
    })
    .catch(err => {
      console.log(err);
    });
}
function createfolder() {
  dir = appRoot + "/Codeplay/" + arguments[0];
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  return arguments[0];
}

async function checkUser(username) {
  return await dbUtils
    .runSqlQueryAsyncSelect("SELECT username FROM cv_users  WHERE username=?", [
      username
    ])
    .then(async res => {
      console.log(res.result.length);
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
genpassword = function() {
  var text = "";
  var possible = "abcdefghjkmnpqrstuvwxyz23456789@#$^*";
  for (var i = 0; i <= 5; i++) {
    text = text + possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
module.exports = router;
