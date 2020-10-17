/*
Remove database entries in projects and project_files
if files related to these entries are not on disk.
*/
var express = require("express");
var router = express.Router();

const path = require("path");
var pathUtils = require("../../api/path-utils");
const jwt = require("jsonwebtoken");

var fs = require("fs-extra");
var rimraf = require("rimraf");
var mkdirp = require("mkdirp");

var mysql = require("mysql");
var conn = mysql.createConnection({
  host: "codevidhya.c4xzkxt5owyy.ap-south-1.rds.amazonaws.com",
  user: "root",
  password: "ek19go3n",
  database: "codevidhya",
  port: "3306"
});
conn.connect();

function runSqlQueryAsyncSelect(query, params) {
  return new Promise((resolve, reject) => {
    conn.query(query, params, (err, result) => {
      if (err) {
        reject("query_failed");
      } else {
        resolve(result);
      }
    });
  });
}

function runSqlQueryAsyncInsert(query, params) {
  return new Promise((resolve, reject) => {
    conn.query(query, params, (err, result) => {
      if (err) {
        reject("query_failed");
      } else {
        resolve({
          result: result,
          insertId: result ? result.insertId : null
        });
      }
    });
  });
}

function runSqlQueryAsyncUpdate(query, params) {
  return new Promise((resolve, reject) => {
    conn.query(query, params, (err, result) => {
      if (err) {
        reject("query_failed");
      } else {
        resolve({ result: result });
      }
    });
  });
}

function runSqlQueryAsyncDeleteReject(query, params) {
  return new Promise((resolve, reject) => {
    conn.query(query, params, (err, result) => {
      if (err) {
        reject("query_failed");
      } else {
        resolve(result);
      }
    });
  });
}

function getFullCodeplayFilePath(userData, path) {
  return pathUtils.convertToSystemSlash(
    pathUtils.appRoot + "/Codeplay/" + userData.dir_path + "/" + path
  );
}

function start() {
  var filesCount = 0;
  var handledFilesCount = 0;

  var projectsCount = 0;
  var handledProjectsCount = 0;

  // Cleanup file entries
  return new Promise((resolve, reject) => {
    conn.beginTransaction(function(err) {
      if (err) {
        reject(new Error("transaction_init_failure"));
      } else {
        return runSqlQueryAsyncSelect(
          "SELECT cu.path as user_directory, projf.file_id as file_id, projf.path as file_path, projf.name as file_name from cv_users as cu left join projects as proj on cu.user_id=proj.user_id INNER join project_files as projf on proj.project_id=projf.project_id"
        )
          .then(result => {
            if(!result) {
              return;
            }
            filesCount = result.length;
            return new Promise(async (resolve1, reject1) => {
              for (var i = 0; i < result.length; i++) {
                var fullFilePath = pathUtils.convertToSystemSlash(
                  pathUtils.appRoot +
                    "/Codeplay/" +
                    result[i].user_directory +
                    "/" +
                    result[i].file_path +
                    "/" +
                    result[i].file_name
                );

                if (!fs.existsSync(fullFilePath)) {
                  var res = await runSqlQueryAsyncDeleteReject(
                    "delete from project_files where file_id=?",
                    [result[i].file_id]
                  );
                  console.log("Deleted file entry: " + result[i].file_name);
                }
                handledFilesCount++;
                console.log(handledFilesCount + "/" + filesCount);
              }
              resolve1();
            });
          })
          .then(() => {
            // Cleanup project entries
            return runSqlQueryAsyncSelect(
              "SELECT proj.project_id as project_id, proj.name as project_name, proj.directory as project_directory, cu.path as user_directory from cv_users as cu left join projects as proj on cu.user_id=proj.user_id where cu.user_id=proj.user_id"
            );
          })
          .then(result => {
            if(!result) {
              return;
            }
            projectsCount = result.length;
            return new Promise(async (resolve1, reject1) => {
              for (var i = 0; i < result.length; i++) {
                var fullProjectPath = pathUtils.convertToSystemSlash(
                  pathUtils.appRoot +
                    "/Codeplay/" +
                    result[i].user_directory +
                    "/" +
                    result[i].project_directory
                );
                if (!fs.existsSync(fullProjectPath)) {
                  var res = await runSqlQueryAsyncDeleteReject(
                    "delete from projects where project_id=?",
                    [result[i].project_id]
                  );
                  console.log(
                    "Deleted project entry: " + result[i].project_name
                  );
                }
                handledProjectsCount++;
                console.log(handledProjectsCount + "/" + projectsCount);
              }
              resolve1();
            });
          })
          .then(() => {
            conn.commit(function(err) {
              if (err) {
                console.log(err);
                return conn.rollback(function(err) {
                  reject("rollback_failed");
                });
              } else {
                resolve();
              }
            });
          });
      }
    });
  })
    .then(() => {
      console.log("Completed");
      process.exit();
    })
    .catch(e => {
      console.log("Failed");
      console.log(e);
      process.exit();
    });
}

start();
