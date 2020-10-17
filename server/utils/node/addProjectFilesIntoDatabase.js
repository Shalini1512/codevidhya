var express = require("express");

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
        console.log(err);
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
        console.log(err);
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
        console.log(err);
        reject("query_failed");
      } else {
        resolve({ result: result });
      }
    });
  });
}

function getFilesInfo(dir) {
  var filesInfo = new Array();
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var filePath = pathUtils.convertToSystemSlash(dir + "/" + files[i]);
    var isDir = false;
    if (fs.statSync(filePath).isDirectory()) {
      isDir = true;
      var xx = getFilesInfo(filePath);
      if (xx.length) filesInfo = filesInfo.concat(xx);
    }
    var fileInfo = getFileInfoFromFullPath(filePath, isDir);
    if (fileInfo) {
      fileInfo.isDir = isDir;
      filesInfo.push(fileInfo);
    }
  }
  return filesInfo;
}

function getFileInfoFromFullPath(pathh, isDir) {
  // Return file path with appRoot, Codeplay, school name, user name removed. Like: projectName/fileName

  // Assume pathh is /home/user/www/codevidhya/Codeplay/demoschool/demostudent/project/folder/file.extension
  var codeplayPath = pathUtils.appRoot + "/Codeplay/";
  var codeplayStripped = pathh.substring(codeplayPath.length); // Strip appRoot/Codeplay/
  /*
  codeplayStripped = demoschool/demostudent/project/folder/file.extension
  */
  if (!codeplayStripped) return null;
  var split = codeplayStripped.split(pathUtils.pathSeparator);
  /*
  split = ["demoschool", "demostudent", "project", "folder", "file.extension"]
  */
  if (split.length < 3) {
    // This means it's either a school directory or user directory, not a real project folder or file
    return null;
  }

  var fileName = split.pop(); // file.extension
  var strippedPathWithSchool = split.join("/"); // demoschool/demostudent/project/folder
  var schoolName = split.shift(); // demoschool
  var userName = split.shift(); // demostudent
  var userRoot = schoolName + "/" + userName; // demoschool/demostudent
  var strippedPath = split.join("/"); // project/folder
  var parentName = split.pop(); // folder
  var parentPath = split.join("/"); // project

  split = strippedPath.split("/");
  var projectDir = split.shift();
  return {
    projectDir: projectDir,
    pathWithSchool: strippedPathWithSchool,
    userRoot: userRoot,
    path: strippedPath,
    name: fileName,
    parentPath: parentPath, // This is actually the parent's parent, considered only up to the project directory
    parentName: parentName,
    school: schoolName,
    user: userName,
    isProjectRoot: isDir ? !strippedPath && !projectDir : false
  };
}

function makeProjectEntry(fileInfo) {
  var userId;
  return runSqlQueryAsyncSelect("select * from cv_users where path=?", [
    fileInfo.userRoot
  ])
    .then(result => {
      if (!result.length) {
        throw new Error("no_owner_user");
      } else {
        return result[0].user_id;
      }
    })
    .then(user_id => {
      userId = user_id;
      // Check if project already exists
      return runSqlQueryAsyncSelect(
        "select * from projects where user_id=? and directory=?",
        [userId, fileInfo.name]
      );
    })
    .then(result => {
      if (!result.length) {
        return runSqlQueryAsyncInsert(
          "insert into projects (user_id,name,description,type,directory) values(?,?,?,?,?)",
          [userId, fileInfo.name, "This is a web project", "web", fileInfo.name]
        );
      }
    });
}

function makeFileEntry(fileInfo) {
  var userId;
  var projectId;
  var projectType;
  var parentInfo;
  return runSqlQueryAsyncSelect("select * from cv_users where path=?", [
    fileInfo.userRoot
  ])
    .then(result => {
      if (!result.length) {
        throw new Error("no_owner_user");
      } else {
        return result[0].user_id;
      }
    })
    .then(user_id => {
      userId = user_id;
      // Get project info
      return runSqlQueryAsyncSelect(
        "select * from projects where user_id=? and directory=?",
        [userId, fileInfo.projectDir]
      );
    })
    .then(projectInfo => {
      if (!projectInfo.length) {
        throw new Error("cant_continue");
      } else {
        // Get file parent info
        projectId = projectInfo[0].project_id;
        projectType = projectInfo[0].type;

        if (fileInfo.parentPath && fileInfo.parentName) {
          return runSqlQueryAsyncSelect(
            "select * from project_files where project_id=? and name=? and path=?",
            [projectId, fileInfo.parentName, fileInfo.parentPath]
          );
        }
      }
    })
    .then(parentInf => {
      parentInfo = parentInf && parentInf.length ? parentInf[0] : null;
      // Get file info
      return runSqlQueryAsyncSelect(
        "select * from project_files where project_id=? and path=? and name=?",
        [projectId, fileInfo.path, fileInfo.name]
      );
    })
    .then(file => {
      // Check if file entry already exists
      if (!file.length) {
        // File entry does not already exist. Proceed with insertion.

        if (
          (projectType != "web" &&
            fileInfo.name == "index.html" &&
            !fileInfo.parentPath) ||
          (projectType != "python" &&
            fileInfo.name == "main.py" &&
            !fileInfo.parentPath)
        ) {
          /*
            When the project is in database and its type isn't web and the file is index.html and it is in the root directory of the project, delete it.
            This block is to handle the case when index.html files are created
            by create_default_web_project.sh in all project folders.
          */
          var fullFilePath = pathUtils.convertToSystemSlash(
            pathUtils.appRoot +
              "/Codeplay/" +
              fileInfo.pathWithSchool +
              "/" +
              fileInfo.name
          );
          rimraf.sync(fullFilePath);
          throw new Error("file_not_inserted_and_deleted");
        }

        if (parentInfo) {
          var parent = parentInfo.file_id;
          var parents = parentInfo.parents
            ? parentInfo.parents + "," + parent
            : parent;
          return runSqlQueryAsyncInsert(
            "insert into project_files(project_id,type,parent,parents,name,path) values(?,?,?,?,?,?)",
            [
              projectId,
              fileInfo.isDir ? "folder" : "file",
              parent,
              parents,
              fileInfo.name,
              fileInfo.path
            ]
          );
        } else {
          return runSqlQueryAsyncInsert(
            "insert into project_files(project_id,type,name,path) values(?,?,?,?)",
            [
              projectId,
              fileInfo.isDir ? "folder" : "file",
              fileInfo.name,
              fileInfo.path
            ]
          );
        }
      }
    })
    .then(result => {
      if (result && fileInfo.isDir) {
        // On inserting a directory, update children's parent and parents fields
        return runSqlQueryAsyncUpdate(
          "update project_files SET parent=case when path=? then ? else parent end, parents=case when parents is not null then concat(parents, ?) else ? end where project_id=? and (path like ? or path like ?)",
          [
            fileInfo.path + "/" + fileInfo.name,
            result.insertId,
            "," + result.insertId,
            result.insertId,
            projectId,
            fileInfo.path + "/" + fileInfo.name,
            fileInfo.path + "/" + fileInfo.name + "/%"
          ]
        );
      }
    })
    .catch(e => {
      console.log(e);
      if (typeof e == "string") {
        throw new Error(e);
      } else if (e.message && e.message != "file_not_inserted_and_deleted") {
        throw new Error(e.message);
      }
    });
}

function start() {
  var dir = pathUtils.convertToSystemSlash(pathUtils.appRoot + "/Codeplay");
  var filesInfo = getFilesInfo(dir);
  var orphanedFiles = new Array(); // Holds filesInfo[i] of files with no owner user in the database. i.e. Orphaned directories
  var filesInfoWithoutOrphans = new Array();
  var totalFiles = filesInfo.length;
  var handledFiles = 0;
  return new Promise((resolve, reject) => {
    conn.beginTransaction(async function(err) {
      if (!err) {
        try {
          // Make entries of only projects
          for (var i = 0; i < filesInfo.length; i++) {
            try {
              if (filesInfo[i].isProjectRoot) {
                await makeProjectEntry(filesInfo[i]);
                handledFiles++;
                if (verbose) {
                  console.log(
                    handledFiles +
                      "/" +
                      totalFiles +
                      " Created project: " +
                      filesInfo[i].name
                  );
                }
              }
              filesInfoWithoutOrphans.push(filesInfo[i]);
            } catch (e) {
              if (e.message == "no_owner_user") {
                orphanedFiles.push(filesInfo[i]);
              } else {
                throw new Error("failed_here");
              }
            }
          }
          for (var i = 0; i < filesInfo.length; i++) {
            try {
              if (!filesInfo[i].isProjectRoot && filesInfo[i].projectDir) {
                handledFiles++;
                await makeFileEntry(filesInfo[i]);
                if (verbose) {
                  console.log(
                    handledFiles +
                      "/" +
                      totalFiles +
                      " Entered file: " +
                      filesInfo[i].name
                  );
                }
              }
              filesInfoWithoutOrphans.push(filesInfo[i]);
            } catch (e) {
              console.log(e);
              if (e.message == "no_owner_user") {
                orphanedFiles.push(filesInfo[i]);
              } else {
                throw new Error("failed_there");
              }
            }
          }

          // Delete user directory for users not in database
          for (var i = 0; i < orphanedFiles.length; i++) {
            var fullFilePath = pathUtils.convertToSystemSlash(
              pathUtils.appRoot + "/Codeplay/" + orphanedFiles[i].pathWithSchool
            );
            rimraf.sync(fullFilePath);
          }

          conn.commit();
          resolve();
        } catch (err) {
          console.log(err);
          conn.rollback();
          reject();
        }
      }
    });
  });
}

var verbose = true;
start()
  .then(() => {
    console.log("Completed");
    process.exit();
  })
  .catch(() => {
    console.log("Failed");
    process.exit();
  });
