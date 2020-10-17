/*
We use POST only because GET requests are cached by the browser,
which leads to weird behaviour.
*/

var express = require("express");
var router = express.Router();

const path = require("path");
var pathUtils = require("./path-utils");

var fs = require("fs-extra");
var rimraf = require("rimraf");
var mkdirp = require("mkdirp");
var multer = require("multer");

var db = require("../db");
var pool = db.pool;

var logQuery = require("../utils/benchmark-utils").logQuery;
var logQueryIfSlow = require("../utils/benchmark-utils").logQueryIfSlow;

function runSqlQueryAsyncSelect(query, params, conn) {
  /*
  conn: optional
    Pass a mysql connection to be used instead of using a connection from the pool.
    This is required when a specific connection object is required, such as in a
    transaction.
  */
  return new Promise((resolve, reject) => {
    var connection = conn || pool;
    connection.query(query, params, (err, result) => {
      if (err) {
        console.log(err);
        reject("query_failed");
      } else {
        resolve(result);
      }
    });
  });
}

function runSqlQueryAsyncInsert(query, params, conn) {
  /*
  conn: optional
    Pass a mysql connection to be used instead of using a connection from the pool.
    This is required when a specific connection object is required, such as in a
    transaction.
  */
  return new Promise((resolve, reject) => {
    var connection = conn || pool;
    connection.query(query, params, (err, result) => {
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

function runSqlQueryAsyncUpdate(query, params, conn) {
  /*
  conn: optional
    Pass a mysql connection to be used instead of using a connection from the pool.
    This is required when a specific connection object is required, such as in a
    transaction.
  */
  return new Promise((resolve, reject) => {
    var connection = conn || pool;
    connection.query(query, params, (err, result) => {
      if (err) {
        console.log(err);
        reject("query_failed");
      } else {
        resolve({ result: result, affectedRows: result.affectedRows });
      }
    });
  });
}

function runSqlQueryAsyncDelete(query, params, conn) {
  /*
  conn: optional
    Pass a mysql connection to be used instead of using a connection from the pool.
    This is required when a specific connection object is required, such as in a
    transaction.
  */
  return new Promise((resolve, reject) => {
    var connection = conn || pool;
    connection.query(query, params, (err, result) => {
      if (err) {
        console.log(err);
        reject("query_failed");
      } else {
        resolve({ result: result });
      }
    });
  });
}

function verifyRequest(req) {
  return new Promise(function(resolve, reject) {
    if (req.session.user_id) {
      resolve({ user_id: req.session.user_id, dir_path: req.session.dir_path });
    } else {
      reject("unauthorized");
    }
  });
}

function verifyAdmin(req) {
  return new Promise(function(resolve, reject) {
    if (req.session.admin_id) {
      resolve({ admin_id: req.session.admin_id });
    } else {
      reject("unauthorized");
    }
  });
}

function getUserData(userId) {
  return runSqlQueryAsyncSelect("select * from cv_users where user_id=?", [
    userId
  ])
    .then(result => {
      if (!result.length) throw new Error("user_not_found");
      return result[0];
    })
    .catch(err => {
      throw new Error("user_not_found");
    });
}

function getFileExtension(fileName) {
  var lastDotIndex = fileName.lastIndexOf(".");
  return lastDotIndex < 0 ? "" : fileName.substring(lastDotIndex + 1);
}

function filterWhitespaces(filename) {
  return filename.replace(/([ ]+)/gi, "_");
}

function fileNameHasIllegalCharacters(filename) {
  let match = filename.match(/([^a-z0-9-_ ]+)/gi);
  return !!(match && match.length);
}

function getFullCodeplayFilePath(userData, path) {
  return pathUtils.convertToSystemSlash(
    pathUtils.appRoot + "/Codeplay/" + userData.dir_path + "/" + path
  );
}

function createProjectDirectory(userData, dirName) {
  if (!userData || !userData.dir_path) return false;
  var dir = pathUtils.convertToSystemSlash(
    pathUtils.appRoot + "/Codeplay/" + userData.dir_path + "/" + dirName
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
  var dir = pathUtils.convertToSystemSlash(
    pathUtils.appRoot + "/Codeplay/" + userData.dir_path + "/" + dirName
  );
  rimraf.sync(dir);
  return true;
}

function renameProjectFile(userData, filePath, newName) {
  if (!userData || !userData.dir_path) return false;
  var path = pathUtils.convertToSystemSlash(
    pathUtils.appRoot + "/Codeplay/" + userData.dir_path + "/" + filePath
  );
  var newPath =
    path.substring(0, path.lastIndexOf(pathUtils.pathSeparator) + 1) + newName;
  try {
    fs.renameSync(path, newPath);
  } catch (e) {
    return false;
  }
  return true;
}

function deleteProjectFile(userData, filePath) {
  if (!userData || !userData.dir_path) return false;
  var path = pathUtils.convertToSystemSlash(
    pathUtils.appRoot + "/Codeplay/" + userData.dir_path + "/" + filePath
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
  var source = pathUtils.convertToSystemSlash(
    pathUtils.appRoot + "/server/misc/default_scratch_project.sb3"
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

  var createdProjectId;

  var conn;
  var userData;

  return verifyRequest(req)
    .then(data => {
      userData = data;
      return db.getConnection();
    })
    .then(connection => {
      conn = connection;
      return new Promise(function(resolve, reject) {
        conn.beginTransaction(function(err) {
          if (err) {
            reject(new Error("transaction_init_failure"));
          } else {
            new Promise(function(resolve1, reject1) {
              conn.query(
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
                      projectDirPath = pathUtils.convertToSystemSlash(
                        pathUtils.appRoot +
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
                createdProjectId = projectId;
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
                    default:
                      fileName = "index.html";
                      break;
                  }
                  conn.query(
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
      conn.release();
      res.send("" + createdProjectId);
    })
    .catch(err => {
      console.log(err);
      conn.release();
      if (err.message) res.status(400).send(err.message);
      else res.status(400).send("failed");
    });
});

router.post("/getRecentProjects", (req, res) => {
  var startTime = process.hrtime();
  return verifyRequest(req)
    .then(userData => {
      return new Promise(function(resolve, reject) {
        pool.query(
          `select projects.*,
            code_challenge_submissions.project_id as code_challenge_entry,
            challenge_submissions.project_id as annual_project_entry
            from projects
            left join code_challenge_submissions
              on projects.project_id=code_challenge_submissions.project_id
            left join challenge_submissions
              on projects.project_id=challenge_submissions.project_id
            where projects.user_id=?
            order by projects.updated_at desc limit 4`,
          [userData.user_id],
          function(err, data) {
            logQuery(startTime, "/api/projects/getRecentProjects");
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
      console.log(err);
      if (err && err.message) res.status(400).send(err.message);
      else res.status(400).send("failed");
    });
});

router.post("/getAllProjects", (req, res) => {
  var startTime = process.hrtime();
  return verifyRequest(req)
    .then(userData => {
      return new Promise(function(resolve, reject) {
        pool.query(
          `select projects.*,
          code_challenge_submissions.project_id as code_challenge_entry,
          challenge_submissions.project_id as annual_project_entry
          from projects
          left join code_challenge_submissions
            on projects.project_id=code_challenge_submissions.project_id
          left join challenge_submissions
            on projects.project_id=challenge_submissions.project_id
          where projects.user_id=?
          order by projects.name asc`,
          [userData.user_id],
          function(err, data) {
            logQuery(startTime, "/api/projects/getAllProjects");
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
      console.log(err);
      if (err && err.message) res.status(400).send(err.message);
      else res.status(400).send("failed");
    });
});

router.post("/getCommunityProjects", (req, res) => {
  var offset = req.body.query_offset;
  var startTime = process.hrtime();
  return new Promise(function(resolve, reject) {
    pool.query(
      `select
        projects.project_id,
        projects.user_id,
        projects.name,
        projects.description,
        projects.type,
        cv_users.name as user_name,
        cv_users.sch_id,
        cv_school_detail.name as school
        from projects
        inner join cv_users
        on cv_users.user_id=projects.user_id
        inner join cv_school_detail
        on cv_users.sch_id=cv_school_detail.sch_id
        where projects.name != 'my_files'
        order by projects.created_at desc
        limit 8
        offset ${offset}`,
      function(err, data) {
        logQuery(startTime, "/api/projects/getCommunityProjects");
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
      console.log(err);
      if (err && err.message) res.status(400).send(err.message);
      else res.status(400).send("failed");
    });
});

router.post("/deleteProject", (req, res) => {
  if (!req.body.projectId) {
    res.status(400).end();
    return;
  }
  var project;

  var conn;
  var useData;

  return verifyRequest(req)
    .then(data => {
      userData = data;
      return db.getConnection();
    })
    .then(connection => {
      conn = connection;
      return new Promise(function(resolve, reject) {
        conn.beginTransaction(function(err) {
          if (err) {
            reject(new Error("transaction_init_failure"));
          } else {
            new Promise(function(resolve1, reject1) {
              conn.query(
                "select * from projects where project_id=?",
                [req.body.projectId],
                function(err, data) {
                  if (err || !data.length) {
                    reject1(err);
                  } else {
                    resolve1(data[0]);
                  }
                }
              );
            })
              .then(proj => {
                project = proj;
                // Check if project is a code challenge or annual project entry
                return runSqlQueryAsyncSelect(
                  `
                    select * from code_challenge_submissions where project_id=?
                  `,
                  [project.project_id],
                  conn
                )
                  .then(codeChallengeEntry => {
                    if (codeChallengeEntry.length) {
                      throw new Error("code_challenge_entry");
                    }
                    return runSqlQueryAsyncSelect(
                      `
                      select * from challenge_submissions where project_id=?
                    `,
                      [project.project_id],
                      conn
                    );
                  })
                  .then(annualProjectEntry => {
                    if (annualProjectEntry.length) {
                      throw new Error("annual_project_entry");
                    }
                  });
              })
              .then(() => {
                return new Promise(function(resolve1, reject1) {
                  conn.query(
                    "delete from projects where project_id=?",
                    [req.body.projectId],
                    function(err) {
                      if (err) {
                        reject1("row_deletion_failed");
                      } else {
                        resolve1();
                      }
                    }
                  );
                });
              })
              .then(() => {
                return new Promise(function(resolve1, reject1) {
                  conn.query(
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
                var failureReason = err.message ? err.message : err;
                return conn.rollback(function(err) {
                  reject(new Error(failureReason));
                });
              });
          }
        });
      });
    })
    .then(() => {
      conn.release();
      res.end();
    })
    .catch(err => {
      console.log(err);
      conn.release();
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

  var userData;
  var conn;

  return verifyRequest(req)
    .then(data => {
      userData = data;
      return db.getConnection();
    })
    .then(connection => {
      conn = connection;
      return new Promise(function(resolve, reject) {
        conn.beginTransaction(function(err) {
          if (err) {
            reject(new Error("transaction_init_failure"));
          } else {
            new Promise(function(resolve1, reject1) {
              conn.query(
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
                  conn.query(
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
                  conn.query(
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
                  [req.body.projectId],
                  conn
                );
              })
              .then(() => {
                return new Promise(function(resolve1, reject1) {
                  var originalPath = pathUtils.convertToSystemSlash(
                    pathUtils.appRoot +
                      "/Codeplay/" +
                      userData.dir_path +
                      "/" +
                      originalDirectoryName
                  );
                  var newPath =
                    originalPath.substring(
                      0,
                      originalPath.lastIndexOf(pathUtils.pathSeparator) + 1
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
      conn.release();
      res.end();
    })
    .catch(err => {
      conn.release();
      if (err) res.status(400).send(err);
      else res.status(400).send("failed");
    });
});

function canEditProject(userId, projectId) {
  var canEdit = false;
  var isOwner = false;
  var isTeacher = false;
  var projectInfo;
  // First check if user is the project owner
  return runSqlQueryAsyncSelect("select * from projects where project_id=?", [
    projectId
  ])
    .then(result => {
      if (!result.length) {
        throw new Error("project_not_found");
      }
      projectInfo = result[0];
      if (projectInfo.user_id == userId) {
        canEdit = true;
        isOwner = true;
      }
    })
    .then(() => {
      if (!canEdit) {
        // Check if user is a teacher of the project owner's school.
        return runSqlQueryAsyncSelect(
          "select teacher.user_id from cv_users teacher, cv_users student where teacher.user_id=? and student.user_id=? and teacher.sch_id=student.sch_id and teacher.role_id=2",
          [userId, projectInfo.user_id]
        );
      }
    })
    .then(result => {
      if (canEdit)
        return {
          canEdit: canEdit,
          isOwner: isOwner,
          isTeacher: false
        };
      if (result.length) {
        // User is the teacher of the project owner
        return {
          canEdit: false,
          isOwner: false,
          isTeacher: true
        };
      } else {
        return {
          canEdit: false,
          isOwner: false,
          isTeacher: false
        };
      }
    })
    .catch(err => {
      return {
        canEdit: false
      };
    });
}

router.post("/getProjectInfo", (req, res) => {
  /*
  Get information about a project.
  Error response if:
    Project does not belong to user
    AND
    User is not a teacher of the school to which project owner belongs.
  */
  var canEdit;
  if (!req.body.projectId) {
    res.status(400).end();
    return;
  }
  return verifyRequest(req)
    .then(userData => {
      return canEditProject(userData.user_id, req.body.projectId);
    })
    .then(canEdits => {
      canEdit = canEdits;
      return new Promise(function(resolve, reject) {
        pool.query(
          `select projects.*,
            cv_users.path as user_path,
            cv_users.name as user_name,
            code_challenge_submissions.project_id as code_challenge_entry,
            code_challenge_submissions.started_at as code_challenge_started_at,
            code_challenges.name as code_challenge_name
            from projects inner join cv_users
            on cv_users.user_id=projects.user_id
            left join code_challenge_submissions
            on projects.project_id=code_challenge_submissions.project_id
            left join code_challenges
            on code_challenges.event_id=code_challenge_submissions.event_id
            where projects.project_id=?`,
          [req.body.projectId],
          function(err, data) {
            if (err || !data.length) {
              reject("not_found");
            } else {
              resolve(data[0]);
            }
          }
        );
      });
    })
    .then(result => {
      var data = result;
      if (canEdit.canEdit && canEdit.isOwner) {
        if (data.code_challenge_entry) {
          var entryTime = Date.parse(data.code_challenge_started_at);
          var endTime = entryTime + 30 * 60 * 1000;
          var timeRemaining = endTime - Date.now();
          if (timeRemaining <= 0) {
            data.code_challenge_time_remaining = 0;
          } else {
            data.code_challenge_time_remaining = timeRemaining;
          }
        }
      } else {
        data.code_challenge_entry = false;
        data.code_challenge_name = null;
        data.code_challenge_started_at = null;
      }
      data.isOwner = canEdit.isOwner;
      data.canEdit = canEdit.canEdit;
      data.isTeacher = canEdit.isTeacher;
      data.projectPath = pathUtils.getRelativePathFromFullPath(
        getFullCodeplayFilePath({ dir_path: data.user_path }, data.directory)
      );
      res.json(data);
    })
    .catch(err => {
      console.log(err);
      if (err && err.message) res.status(400).send(err.message);
      else res.status(400).send("failed");
    });
});

router.post("/getProjectPreviewInfo", (req, res) => {
  var projectId = req.body.project_id;
  if (!projectId) {
    res.status(400).end();
    return;
  }
  var projectInfo;

  return new Promise(function(resolve, reject) {
    pool.query(
      `select projects.*,
      cv_users.path as dir_path,
      cv_users.name as user_name
      from projects
      inner join cv_users
      on cv_users.user_id=projects.user_id
      where project_id=?`,
      [projectId],
      function(err, data) {
        if (err || !data.length) {
          reject("not_found");
        } else {
          resolve(data[0]);
        }
      }
    );
  })
    .then(result => {
      projectInfo = result;
      projectInfo.projectPath = pathUtils.getRelativePathFromFullPath(
        getFullCodeplayFilePath({ dir_path: result.dir_path }, result.directory)
      );
    })
    .then(() => {
      return runSqlQueryAsyncSelect(
        "select * from `project_files` where project_id=? and parent is null",
        [projectId]
      );
    })
    .then(result => {
      // Find the "main" file of the project
      if (!result.length) {
        throw new Error("error");
      } else {
        var files = result;
        if (projectInfo.type == "web") {
          var indexhtml;
          var anyhtml;
          for (var i = 0; i < files.length; i++) {
            var fileName = files[i].name;
            if (fileName == "index.html") {
              indexhtml = fileName;
              break;
            } else if (!anyhtml && getFileExtension(fileName) == "html") {
              anyhtml = fileName;
            }
          }
          projectInfo.main_file = indexhtml
            ? indexhtml
            : anyhtml
            ? anyhtml
            : null;
        } else if (projectInfo.type == "python") {
          var main;
          var any;
          for (var i = 0; i < files.length; i++) {
            var fileName = files[i].name;
            if (fileName == "main.py") {
              main = fileName;
              break;
            } else if (!any && getFileExtension(fileName) == "py") {
              any = fileName;
            }
          }
          projectInfo.main_file = main ? main : any ? any : null;
        }
      }
    })
    .then(() => {
      var userId = req.session.user_id;
      if (userId) {
        return runSqlQueryAsyncSelect(
          `
          select * from project_likes
          where project_id=? and user_id=?
        `,
          [projectId, userId]
        ).then(userLiked => {
          projectInfo.liked = !!userLiked.length;
        });
      }
    })
    .then(() => {
      return runSqlQueryAsyncSelect(
        `
          select * from project_views
          where project_id=?
        `,
        [projectId]
      ).then(result => {
        projectInfo.views = result.length ? result[0].count : 1;
      });
    })
    .then(() => {
      return runSqlQueryAsyncSelect(
        `
        select count(*) as likes from project_likes
        where project_id=?
      `,
        [projectId]
      ).then(result => {
        projectInfo.likes = result.length ? result[0].likes : 0;
      });
    })
    .then(() => {
      return runSqlQueryAsyncSelect(
        `
        select count(*) as comments from project_comments
        where project_id=?
      `,
        [projectId]
      ).then(result => {
        projectInfo.commentsCount = result.length ? result[0].comments : 0;
      });
    })
    .then(() => {
      res.json(projectInfo);
    })
    .catch(err => {
      console.log(err);
      if (err && err.message) res.status(400).send(err.message);
      else res.status(400).send("failed");
    });
});

router.post("/createProjectFile", (req, res) => {
  if (!req.body.projectId || !req.body.type || !req.body.name) {
    res.status(400).end();
    return;
  }

  var userData;
  var conn;

  return verifyRequest(req)
    .then(data => {
      userData = data;
      return db.getConnection();
    })
    .then(connection => {
      conn = connection;
      return new Promise(function(resolve, reject) {
        conn.beginTransaction(function(err) {
          if (err) {
            reject(new Error("transaction_init_failure"));
          } else {
            new Promise(function(resolve1, reject1) {
              if (req.body.parentId) {
                conn.query(
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
                      conn.query(
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
                conn.query(
                  "select * from projects where project_id=?",
                  [req.body.projectId],
                  function(err, data) {
                    if (err || !data.length) {
                      reject1("failed0");
                    } else if (data.length) {
                      var projectData = data[0];
                      var path = projectData.directory;
                      conn.query(
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
                  [req.body.projectId],
                  conn
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
      conn.release();
      res.end();
    })
    .catch(err => {
      conn.release();
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

  var userData;
  var conn;

  return verifyRequest(req)
    .then(data => {
      userData = data;
      return db.getConnection();
    })
    .then(connection => {
      conn = connection;
      return new Promise(function(resolve, reject) {
        conn.beginTransaction(function(err) {
          if (err) {
            reject(new Error("transaction_init_failure"));
          } else {
            new Promise(function(resolve1, reject1) {
              conn.query(
                "select project_files.*, projects.type as project_type from project_files inner join projects on project_files.project_id=projects.project_id where file_id=?",
                [req.body.fileId],
                function(err, data) {
                  if (err || !data.length) {
                    reject1("failed");
                  } else {
                    let file = data[0];
                    if (
                      file.name === "index.html" &&
                      file.project_type === "web" &&
                      !file.parent
                    ) {
                      reject1("failed");
                      return;
                    } else if (
                      file.name === "main.py" &&
                      file.project_type === "python" &&
                      !file.parent
                    ) {
                      reject1("failed");
                      return;
                    }
                    projectId = file.project_id;
                    filePath = file.path + "/" + file.name;
                    filePathNew = file.path + "/" + req.body.name;
                    resolve1();
                  }
                }
              );
            })
              .then(() => {
                return runSqlQueryAsyncUpdate(
                  "update project_files set name=? where file_id=?",
                  [req.body.name, req.body.fileId],
                  conn
                );
              })
              .then(() => {
                // Rename paths in all children files
                return runSqlQueryAsyncUpdate(
                  "update project_files set path=regexp_replace(path, ?, ?) where find_in_set(?, parents)",
                  ["^" + filePath, filePathNew, req.body.fileId],
                  conn
                );
              })
              .then(() => {
                return runSqlQueryAsyncUpdate(
                  "update projects set updated_at=CURRENT_TIMESTAMP where project_id in (?)",
                  [projectId],
                  conn
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
      conn.release();
      res.end();
    })
    .catch(err => {
      console.log(err);
      conn.release();
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

  var userData;
  var conn;

  return verifyRequest(req)
    .then(data => {
      userData = data;
      return db.getConnection();
    })
    .then(connection => {
      conn = connection;
      return new Promise(function(resolve, reject) {
        conn.beginTransaction(function(err) {
          if (err) {
            reject(new Error("transaction_init_failure"));
          } else {
            new Promise(function(resolve1, reject1) {
              conn.query(
                "select project_files.*, projects.type as project_type from project_files inner join projects on project_files.project_id=projects.project_id where file_id=?",
                [req.body.id],
                function(err, data) {
                  if (err || !data.length) {
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
                  if (
                    file.name === "index.html" &&
                    file.project_type === "web" &&
                    !file.parent
                  ) {
                    reject1("row_deletion_failed");
                  } else if (
                    file.name === "main.py" &&
                    file.project_type === "python" &&
                    !file.parent
                  ) {
                    reject1("row_deletion_failed");
                  } else {
                    conn.query(
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
                  [projectId],
                  conn
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
      conn.release();
      res.end();
    })
    .catch(err => {
      conn.release();
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
          // "SELECT * FROM `project_files` WHERE file_id=?",
          `SELECT project_files.*,
            cv_users.path as user_path
            FROM project_files
            left join projects
            on projects.project_id=project_files.project_id
            inner join cv_users
            on cv_users.user_id=projects.user_id
            WHERE file_id=?`,
          [req.body.id],
          function(err, data) {
            if (err || !data.length) {
              console.log(err);
              reject();
            } else {
              resolve(
                getFullCodeplayFilePath(
                  { dir_path: data[0].user_path },
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

  var userData;
  var conn;

  return verifyRequest(req)
    .then(data => {
      userData = data;
      return db.getConnection();
    })
    .then(connection => {
      conn = connection;
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
              conn.query(
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
                  [projectId],
                  conn
                );
              })
              .then(() => {
                return runSqlQueryAsyncUpdate(
                  "update project_files set updated_at=CURRENT_TIMESTAMP where file_id in (?)",
                  [fileIds],
                  conn
                );
              })
              .then(result => {
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
      conn.release();
      res.end();
    })
    .catch(err => {
      conn.release();
      if (err && err.message) res.status(400).send(err.message);
      else res.status(400).send("failed");
    });
});

router.post("/saveScratchProject", (req, res) => {
  /*
    Scratch project file names are always in this form
      project_folder_name.sb3
    */
  var projectId = req.headers.project_id;
  var fileName = "project.sb3";
  if (!projectId) {
    res.status(400).end();
    return;
  }
  var userData;
  var conn;

  return verifyRequest(req)
    .then(data => {
      userData = data;
      return db.getConnection();
    })
    .then(connection => {
      conn = connection;
      return new Promise(function(resolve, reject) {
        conn.beginTransaction(function(err) {
          if (err) {
            reject(new Error("transaction_init_failure"));
          } else {
            new Promise((resolve1, reject1) => {
              conn.query(
                "select * from projects where project_id=?",
                [projectId],
                (err, result) => {
                  if (err || !result.length) {
                    throw new Error("failed");
                  } else {
                    var dirPath = pathUtils.stripTrailingSlash(
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
                  [projectId],
                  conn
                );
              })
              .then(() => {
                return runSqlQueryAsyncUpdate(
                  "update projects set updated_at=CURRENT_TIMESTAMP where project_id in (?)",
                  [projectId],
                  conn
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
      conn.release();
      res.end();
    })
    .catch(err => {
      console.log(err);
      conn.release();
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

  var userData;
  var conn;

  return verifyRequest(req)
    .then(data => {
      userData = data;
      return db.getConnection();
    })
    .then(connection => {
      conn = connection;
      return new Promise(function(resolve, reject) {
        conn.beginTransaction(function(err) {
          if (err) {
            reject(new Error("transaction_init_failure"));
          } else {
            new Promise((resolve1, reject1) => {
              if (parentFolderId) {
                // Uploading to a folder inside a project
                conn.query(
                  "select * from project_files where file_id=?",
                  [parentFolderId],
                  (err, result) => {
                    if (err || !result.length) {
                      throw new Error("failed");
                    } else {
                      var dirPath = pathUtils.stripTrailingSlash(
                        getFullCodeplayFilePath(userData, result[0].path)
                      );
                      result[0].fullDirPath = dirPath;
                      resolve1(result[0]);
                    }
                  }
                );
              } else {
                // Uploading to the root of a project
                conn.query(
                  "select * from projects where project_id=?",
                  [projectId],
                  (err, result) => {
                    if (err || !result.length) {
                      throw new Error("failed");
                    } else {
                      var dirPath = pathUtils.stripTrailingSlash(
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
                      var fullFilePath = pathUtils.convertToSystemSlash(
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
                      conn.query(
                        "insert into project_files (project_id, type, parent, parents, name, path, created_at, updated_at) values(?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
                        [
                          projectId,
                          "file",
                          parentFolderId,
                          parents,
                          fileName,
                          parentPath
                        ],
                        err => {
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
                  [projectId],
                  conn
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
      conn.release();
      res.end();
    })
    .catch(err => {
      conn.release();
      if (err) res.status(400).send(err);
      else res.status(400).send("failed");
    });
});

router.post("/getSchoolInfo", (req, res) => {
  var schoolId;
  var responseData = new Object();
  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect("select * from cv_users where user_id=?", [
        userInfo.user_id
      ]);
    })
    .then(result => {
      if (!result.length) {
        throw new Error("user_not_found");
      }
      let userData = result[0];
      schoolId = userData.sch_id;
      if (userData.role_id != 2) {
        throw new Error("unauthorized");
      }

      return runSqlQueryAsyncSelect(
        "select cls_id from cv_st_detail where sch_id=? group by cls_id", // select cls_id, sec_id from cv_st_detail where sch_id=4 and cls_id>0 group by cls_id, sec_id;
        [schoolId]
      );
    })
    .then(result => {
      responseData.grades = result;
      return runSqlQueryAsyncSelect(
        "select sec_id from cv_st_detail where sch_id=? group by sec_id",
        [schoolId]
      );
    })
    .then(result => {
      responseData.sections = result;
    })
    .then(() => {
      res.send(responseData);
    })
    .catch(e => {
      if (e === "unauthorized") {
        res.status(403).end();
      } else {
        res.status(400).end();
      }
    });
});

router.post("/getStudents", (req, res) => {
  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect("select * from cv_users where user_id=?", [
        userInfo.user_id
      ]);
    })
    .then(result => {
      if (!result.length) {
        throw new Error("user_not_found");
      }
      let userData = result[0];
      if (userData.role_id != 2) {
        throw new Error("unauthorized");
      }
      return runSqlQueryAsyncSelect(
        "select cv_users.name, cv_users.user_id, cv_st_detail.cls_id, cv_st_detail.sec_id from cv_users inner join cv_st_detail on cv_users.user_id=cv_st_detail.user_id where cv_users.role_id=3 and cv_users.sch_id=? order by name asc",
        [userData.sch_id]
      );
    })
    .then(result => {
      res.send(result);
    })
    .catch(e => {
      if (e === "unauthorized") {
        res.status(403).end();
      } else {
        res.status(400).end();
      }
    });
});

router.post("/getStudentProjects", (req, res) => {
  var studentId = req.body.student_id;
  if (!studentId) {
    res.status(400).end();
    return;
  }
  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect("select * from cv_users where user_id=?", [
        userInfo.user_id
      ]);
    })
    .then(result => {
      if (!result.length) {
        throw new Error("unauthorized");
      }
      let userData = result[0];
      if (userData.role_id != 2) {
        throw new Error("unauthorized");
      }
      return runSqlQueryAsyncSelect(
        "select * from projects where user_id=? order by name asc",
        [studentId]
      );
    })
    .then(result => {
      res.send(result);
    })
    .catch(e => {
      if (e === "unauthorized") {
        res.status(403).end();
      } else {
        res.status(400).end();
      }
    });
});

/* ============ START CODE CHALLENGE AND CHALLENGES ==========
============================================================= */
router.post("/getAllChallenges", (req, res) => {
  return runSqlQueryAsyncSelect("select * from challenges")
    .then(result => {
      res.send(result);
    })
    .catch(e => {
      res.status(400).end();
    });
});

router.post("/getAnnualProjectGrades", (req, res) => {
  return verifyRequest(req)
    .then(userInfo => {
      runSqlQueryAsyncSelect("select * from challenges")
        .then(result => {
          res.send(result);
        })
        .catch(e => {
          res.status(400).end();
        });
    })
    .catch(err => {});
});

router.post("/getLiveChallenges", (req, res) => {
  return runSqlQueryAsyncSelect("select * from challenges where active=1")
    .then(result => {
      res.send(result);
    })
    .catch(e => {
      res.status(400).end();
    });
});

router.post("/getMyChallenges", (req, res) => {
  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        "select * from cv_users inner join cv_st_detail on cv_users.user_id=cv_st_detail.user_id where cv_users.user_id=?",
        [userInfo.user_id]
      );
    })
    .then(result => {
      if (!result.length) throw new Error("unauthorized");
      var user = result[0];
      return runSqlQueryAsyncSelect(
        `
        select *
        from
          (select challenges.event_id,
                      challenges.name,
                      annual_project_ratings.submission_id as rated
            from challenges
            left join challenge_submissions
            on challenge_submissions.event_id=challenges.event_id
            left join annual_project_ratings
            on annual_project_ratings.submission_id=challenge_submissions.submission_id
            where
              sch_id=?
            and
              cls_id=?
            and
              active=1) t
          where t.rated is NULL
        `,
        [user.sch_id, user.cls_id]
      );
    })
    .then(result => {
      res.send(result);
    })
    .catch(e => {
      console.log(e);
      res.status(400).end();
    });
});

router.post("/getChallengeInfo", (req, res) => {
  var eventId = req.body.event_id;
  return runSqlQueryAsyncSelect("select * from challenges where event_id=?", [
    eventId
  ])
    .then(result => {
      if (result.length) res.send(result[0]);
      else throw new Error("error");
    })
    .catch(e => {
      res.status(400).end();
    });
});

router.post("/getGradesAndSectionsHavingLiveChallenges", (req, res) => {
  var schoolId;
  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        "select * from cv_users where user_id=? and role_id=2",
        [userInfo.user_id]
      );
    })
    .then(result => {
      if (!result.length) {
        throw new Error("user_not_found");
      } else {
        return runSqlQueryAsyncSelect(
          `select cv_st_detail.cls_id, cv_st_detail.sec_id
          from cv_st_detail
          inner join challenges
            on challenges.cls_id=cv_st_detail.cls_id
          where cv_st_detail.sch_id=? and cv_st_detail.cls_id>0
          group by cv_st_detail.cls_id, cv_st_detail.sec_id
		      order by cv_st_detail.cls_id asc`,
          [result[0].sch_id]
        );
      }
    })
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post("/submitChallenge", (req, res) => {
  var userId;
  var eventId = req.body.eventId;
  var projectId = req.body.projectId;
  var desc = req.body.description;
  if (!projectId || !eventId || !desc) {
    res.status(400).end();
    return;
  }
  return verifyRequest(req)
    .then(userInfo => {
      userId = userInfo.user_id;
      return runSqlQueryAsyncSelect(
        "select * from challenge_submissions where event_id=? and user_id=?",
        [eventId, userId]
      );
    })
    .then(result => {
      if (result.length) throw new Error("already_submitted");
      return runSqlQueryAsyncSelect(
        "select * from projects where user_id=? and project_id=?",
        [userId, projectId]
      );
    })
    .then(result => {
      if (result.length) {
        return runSqlQueryAsyncInsert(
          "insert into challenge_submissions (event_id, user_id, project_id, description) values(?,?,?,?)",
          [eventId, userId, projectId, desc]
        );
      } else {
        throw new Error("project_not_found");
      }
    })
    .then(() => {
      res.end();
    })
    .catch(e => {
      console.log(e);
      if (e.message === "already_submitted") res.status(400).send(e.message);
      else res.status(400).end();
    });
});

router.post("/cancelChallengeSubmission", (req, res) => {
  var userId;
  var submissionId = req.body.submissionId;
  return verifyRequest(req)
    .then(userInfo => {
      userId = userInfo.user_id;
      return runSqlQueryAsyncSelect(
        "select * from challenge_submissions where submission_id=? and user_id=?",
        [submissionId, userInfo.user_id]
      );
    })
    .then(result => {
      if (result.length) {
        return runSqlQueryAsyncDelete(
          `delete from challenge_submissions
            where
              submission_id=?
            and
              submission_id not in (SELECT annual_project_ratings.submission_id from annual_project_ratings)
          `,
          [submissionId]
        );
      } else {
        throw new Error("cant_cancel");
      }
    })
    .then(() => {
      res.end();
    })
    .catch(e => {
      console.log(e);
      res.status(400).end();
    });
});

router.post("/getMyAnnualProjectSubmissions", (req, res) => {
  return verifyRequest(req)
    .then(userInfo => {
      var userId = userInfo.user_id;
      // return getUserData(userId);
      return runSqlQueryAsyncSelect(
        `select * from (select
          challenges.event_id,
          challenges.name as event_name,
          challenge_submissions.submission_id,
          challenge_submissions.status as submission_status,
          projects.project_id,
          projects.name as project_name,
          annual_project_ratings.submission_id as rated
          from challenge_submissions
          inner join challenges
            on challenges.event_id=challenge_submissions.event_id
          inner join projects
            on projects.project_id=challenge_submissions.project_id
          left join annual_project_ratings
          	on annual_project_ratings.submission_id=challenge_submissions.submission_id
          where challenge_submissions.user_id=?) t where t.rated is NULL`,
        [userInfo.user_id]
      );
    })
    .then(result => {
      res.send(result);
    })
    .catch(e => {
      console.log(e);
      res.status(400).end();
    });
});

router.post("/getChallengeSubmissionsForGrades", (req, res) => {
  var grades = req.body.grades;
  var sections = req.body.sections;

  return verifyRequest(req)
    .then(userInfo => {
      var userId = userInfo.user_id;
      return runSqlQueryAsyncSelect(
        `select
          challenges.event_id,
          challenges.name as event_name,
          challenge_submissions.submission_id,
          challenge_submissions.status as submission_status,
          projects.project_id,
          cv_users.name as user_name,
          cv_st_detail.cls_id as grade,
          cv_st_detail.sec_id as section,
          projects.name as project_name
          from challenge_submissions
            inner join challenges
              on challenges.event_id=challenge_submissions.event_id
            inner join projects
              on projects.project_id=challenge_submissions.project_id
            inner join cv_users
              on cv_users.user_id=challenge_submissions.user_id
            inner join cv_st_detail
              on cv_users.user_id=cv_st_detail.user_id
          where find_in_set(cv_st_detail.cls_id, ?) and find_in_set(cv_st_detail.sec_id, ?)`,
        [grades, sections]
      );
    })
    .then(result => {
      res.send(result);
    })
    .catch(e => {
      console.log(e);
      res.status(400).end();
    });
});

router.post("/getChallengeSubmissionsForGrade", (req, res) => {
  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        `select challenge_submissions.*,
        projects.name as project_name,
        cv_users.name as user_name
        from challenge_submissions
        inner join projects
        on projects.project_id=challenge_submissions.project_id
        inner join cv_users
        on cv_users.user_id=challenge_submissions.user_id
        inner join cv_st_detail
        on cv_st_detail.user_id=challenge_submissions.user_id
        where cv_st_detail.sch_id=?
        and cv_st_detail.cls_id=?
        and cv_st_detail.sec_id=?
      `,
        [userInfo.sch_id, req.body.grade, req.body.section]
      );
    })
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

/***************** Annual Project */
router.post("/getGradesAndSectionsHavingLiveAnnualProject", (req, res) => {
  var schoolId;
  return verifyRequest(req)
    .then(userInfo => {
      // Am I a teacher user?
      return runSqlQueryAsyncSelect(
        "select * from cv_users where user_id=? and role_id=2",
        [userInfo.user_id]
      );
    })
    .then(result => {
      if (!result.length) {
        throw new Error("user_not_found");
      } else {
        return runSqlQueryAsyncSelect(
          `
          select cv_st_detail.cls_id, cv_st_detail.sec_id, challenges.event_id
          from cv_st_detail
          inner join challenges
            on challenges.cls_id=cv_st_detail.cls_id and challenges.sch_id=cv_st_detail.sch_id
          where cv_st_detail.sch_id=? and cv_st_detail.cls_id>0
          group by cv_st_detail.cls_id, cv_st_detail.sec_id
          `,
          [result[0].sch_id]
        );
      }
    })
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post("/getAnnualProjectSubmissionsCountForGrade", (req, res) => {
  return verifyRequest(req)
    .then(userInfo => {
      return getUserData(userInfo.user_id);
    })
    .then(userData => {
      return runSqlQueryAsyncSelect(
        `select count(distinct challenge_submissions.submission_id) as count
                              from challenge_submissions
                              inner join challenges
                              on challenges.event_id=challenge_submissions.event_id
                              inner join projects
                              on projects.project_id=challenge_submissions.project_id
                              inner join cv_users
                              on cv_users.user_id=challenge_submissions.user_id
                              inner join cv_st_detail
                              on cv_st_detail.user_id=challenge_submissions.user_id
                              where cv_st_detail.sch_id=?
                              and cv_st_detail.cls_id=?
                              and challenges.active=1
        `,
        [userData.sch_id, req.body.grade]
      );
    })
    .then(result => {
      if (result.length) res.send(result[0]);
      else res.send({ count: 0 });
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post("/getAnnualProjectSubmissionsForGradeSection", (req, res) => {
  return verifyRequest(req)
    .then(userInfo => {
      return getUserData(userInfo.user_id);
    })
    .then(userData => {
      return runSqlQueryAsyncSelect(
        `select distinct challenge_submissions.submission_id,
        challenge_submissions.event_id,
        challenge_submissions.user_id,
        challenge_submissions.project_id,
        challenge_submissions.description,
        projects.name as project_name,
        cv_users.name as user_name,
        projects.type as project_type
        from challenge_submissions
        inner join challenges
          on challenges.event_id=challenge_submissions.event_id
        inner join projects
          on projects.project_id=challenge_submissions.project_id
        inner join cv_users
          on cv_users.user_id=challenge_submissions.user_id
        inner join cv_st_detail
          on cv_st_detail.user_id=challenge_submissions.user_id
        where cv_st_detail.sch_id=?
          and cv_st_detail.cls_id=?
          and cv_st_detail.sec_id=?
          and challenges.active=1
      `,
        [userData.sch_id, req.body.grade, req.body.section]
      );
    })
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post("/saveAnnualProjectSubmissionRating", (req, res) => {
  var eventId = req.body.event_id;
  var submissionId = req.body.submission_id;
  var ratings = req.body.ratings;
  var remark = req.body.remark;
  var shortlist = req.body.shortlist;
  if (!submissionId || !remark) {
    res.status(400).end();
    return;
  }

  var queryString = `insert into annual_project_ratings
                      (
                        submission_id,
                        criteria_1,
                        criteria_2,
                        criteria_3,
                        criteria_4,
                        criteria_5,
                        remark
                      )
                      values (?,?,?,?,?,?,?)
                      on duplicate key update
                      criteria_1=values(criteria_1),
                      criteria_2=values(criteria_2),
                      criteria_3=values(criteria_3),
                      criteria_4=values(criteria_4),
                      criteria_5=values(criteria_5),
                      remark=values(remark)
                      `;

  var userInfo;
  var userData;
  var conn;

  return verifyRequest(req)
    .then(info => {
      userInfo = info;
      return db.getConnection();
    })
    .then(connection => {
      conn = connection;
    })
    .then(() => {
      return getUserData(userInfo.user_id);
    })
    .then(data => {
      userData = data;
      if (userData.role_id != 2) throw new Error("unauthorized"); // Not a teacher
      return new Promise(function(resolve, reject) {
        conn.beginTransaction(function(err) {
          if (err) {
            reject("transaction_init_failure");
          } else {
            return runSqlQueryAsyncInsert(
              queryString,
              [
                submissionId,
                ratings["criteria_1"],
                ratings["criteria_2"],
                ratings["criteria_3"],
                ratings["criteria_4"],
                ratings["criteria_5"],
                remark
              ],
              conn
            )
              .then(() => {
                if (shortlist) {
                  return runSqlQueryAsyncInsert(
                    `insert into annual_project_shortlist_1
                    (event_id,
                      submission_id)
                    select ?, ? from DUAL
                    where not exists (
                      select *
                      from annual_project_shortlist_1
                      where event_id=?
                      and submission_id=?)
                      limit 1
                    `,
                    [eventId, submissionId, eventId, submissionId],
                    conn
                  );
                } else {
                  return runSqlQueryAsyncDelete(
                    `delete from annual_project_shortlist_1
                    where event_id=? and submission_id=?
                    `,
                    [eventId, submissionId],
                    conn
                  );
                }
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
      })
        .then(result => {
          conn.release();
          res.send();
        })
        .catch(err => {
          console.log(err);
          conn.release();
          res.status(400).end();
        });
    });
});

router.post("/getAnnualProjectRatingCriteria", (req, res) => {
  var projectType = req.body.project_type;
  return runSqlQueryAsyncSelect(
    "select * from annual_project_rating_criteria limit 1",
    [projectType]
  )
    .then(result => {
      if (result.length) res.send(result[0]);
      else throw new Error("error");
    })
    .catch(e => {
      console.log(e);
      res.status(400).end();
    });
});

router.post("/getAnnualProjectRatingsForGrade", (req, res) => {
  var grade = req.body.grade;
  var section = req.body.section;
  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        `
        select
          annual_project_ratings.submission_id,
          annual_project_shortlist_1.submission_id as shortlisted
        from annual_project_ratings
        inner join challenge_submissions
          on challenge_submissions.submission_id=annual_project_ratings.submission_id
        inner join cv_st_detail
          on cv_st_detail.user_id=challenge_submissions.user_id
        left join annual_project_shortlist_1
          on annual_project_shortlist_1.submission_id=annual_project_ratings.submission_id
        where cv_st_detail.cls_id=? and cv_st_detail.sec_id=?
        `,
        [grade, section]
      );
    })
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post("/getAnnualProjectRatingForSubmission", (req, res) => {
  var submissionId = req.body.submission_id;
  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        "select * from annual_project_ratings where submission_id=?",
        [submissionId]
      );
    })
    .then(result => {
      if (result.length) res.send(result[0]);
      else res.send({});
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post(
  "/getAnnualProjectRatingCompletionStatusForGradeGroup",
  (req, res) => {
    var grade = parseInt(req.body.grade);
    var eventId = req.body.event_id;
    var schoolId;

    var submissionsCount = 0;
    var ratingsCount = 0;

    var submissionCountQuery;
    var ratingsCountQuery;

    switch (grade) {
      case 1:
      case 2:
      case 3: {
        submissionCountQuery = `select count(*) as submissions
            from challenge_submissions
            inner join cv_users
            on cv_users.user_id=challenge_submissions.user_id
            inner join cv_st_detail
            on cv_st_detail.user_id=cv_users.user_id
            where cv_users.sch_id=? and cv_st_detail.cls_id in (1, 2, 3)
            `;
        break;
      }
      case 4:
      case 5: {
        submissionCountQuery = `select count(*) as submissions
            from challenge_submissions
            inner join cv_users
            on cv_users.user_id=challenge_submissions.user_id
            inner join cv_st_detail
            on cv_st_detail.user_id=cv_users.user_id
            where cv_users.sch_id=? and cv_st_detail.cls_id in (4, 5)
            `;
        break;
      }
      case 6:
      case 7: {
        submissionCountQuery = `select count(*) as submissions
            from challenge_submissions
            inner join cv_users
            on cv_users.user_id=challenge_submissions.user_id
            inner join cv_st_detail
            on cv_st_detail.user_id=cv_users.user_id
            where cv_users.sch_id=? and cv_st_detail.cls_id in (6, 7)
            `;
        break;
      }
      case 8:
      case 9:
      case 10: {
        submissionCountQuery = `select count(*) as submissions
            from challenge_submissions
            inner join cv_users
            on cv_users.user_id=challenge_submissions.user_id
            inner join cv_st_detail
            on cv_st_detail.user_id=cv_users.user_id
            where cv_users.sch_id=? and cv_st_detail.cls_id in (8, 9, 10)
            `;
        break;
      }
    }

    switch (grade) {
      case 1:
      case 2:
      case 3: {
        ratingsCountQuery = `select count(*) as ratings
            from annual_project_ratings
            inner join challenge_submissions
            on challenge_submissions.submission_id=annual_project_ratings.submission_id
            inner join cv_users
            on cv_users.user_id=challenge_submissions.user_id
            inner join cv_st_detail
            on cv_st_detail.user_id=cv_users.user_id
            where cv_users.sch_id=? and cv_st_detail.cls_id in (1, 2, 3)
            `;
        break;
      }
      case 4:
      case 5: {
        ratingsCountQuery = `select count(*) as ratings
            from annual_project_ratings
            inner join challenge_submissions
            on challenge_submissions.submission_id=annual_project_ratings.submission_id
            inner join cv_users
            on cv_users.user_id=challenge_submissions.user_id
            inner join cv_st_detail
            on cv_st_detail.user_id=cv_users.user_id
            where cv_users.sch_id=? and cv_st_detail.cls_id in (4, 5)
            `;
        break;
      }
      case 6:
      case 7: {
        ratingsCountQuery = `select count(*) as ratings
            from annual_project_ratings
            inner join challenge_submissions
            on challenge_submissions.submission_id=annual_project_ratings.submission_id
            inner join cv_users
            on cv_users.user_id=challenge_submissions.user_id
            inner join cv_st_detail
            on cv_st_detail.user_id=cv_users.user_id
            where cv_users.sch_id=? and cv_st_detail.cls_id in (6, 7)
            `;
        break;
      }
      case 8:
      case 9:
      case 10: {
        ratingsCountQuery = `select count(*) as ratings
            from annual_project_ratings
            inner join challenge_submissions
            on challenge_submissions.submission_id=annual_project_ratings.submission_id
            inner join cv_users
            on cv_users.user_id=challenge_submissions.user_id
            inner join cv_st_detail
            on cv_st_detail.user_id=cv_users.user_id
            where cv_users.sch_id=? and cv_st_detail.cls_id in (8, 9, 10)
            `;
        break;
      }
    }
    return verifyRequest(req)
      .then(userInfo => {
        return runSqlQueryAsyncSelect(
          "select * from cv_users where user_id=? and role_id=2",
          [userInfo.user_id]
        );
      })
      .then(result => {
        if (!result.length) {
          throw new Error("unauthorized");
        } else {
          schoolId = result[0].sch_id;
          return runSqlQueryAsyncSelect(submissionCountQuery, [schoolId]);
        }
      })
      .then(result => {
        submissionsCount = result[0].submissions;
      })
      .then(() => {
        return runSqlQueryAsyncSelect(ratingsCountQuery, [schoolId]);
      })
      .then(result => {
        ratingsCount = result[0].ratings;
        res.send({
          submissions_count: submissionsCount,
          ratings_count: ratingsCount
        });
      })
      .catch(err => {
        console.log(err);
        res.status(400).end();
      });
  }
);

function createAnnualProjectShortlist1Query(schoolId, grade) {
  switch (grade) {
    case 1:
    case 2:
    case 3: {
      return `SELECT
                challenge_submissions.submission_id,
                projects.project_id,
                projects.name,
                challenges.cls_id
              FROM annual_project_shortlist_1
              inner join challenges
              on challenges.event_id=annual_project_shortlist_1.event_id
              inner join challenge_submissions
              on challenge_submissions.submission_id=annual_project_shortlist_1.submission_id
              inner join projects
              on projects.project_id=challenge_submissions.project_id
              where
                challenges.sch_id=${schoolId}
              and
                challenges.cls_id in (1,2,3)`;
    }
    case 4:
    case 5: {
      return `SELECT
                challenge_submissions.submission_id,
                projects.project_id,
                projects.name,
                challenges.cls_id
              FROM annual_project_shortlist_1
              inner join challenges
              on challenges.event_id=annual_project_shortlist_1.event_id
              inner join challenge_submissions
              on challenge_submissions.submission_id=annual_project_shortlist_1.submission_id
              inner join projects
              on projects.project_id=challenge_submissions.project_id
              where
                challenges.sch_id=${schoolId}
              and
                challenges.cls_id in (4,5)`;
    }
    case 6:
    case 7: {
      return `SELECT
                challenge_submissions.submission_id,
                projects.project_id,
                projects.name,
                challenges.cls_id
                FROM annual_project_shortlist_1
                inner join challenges
                on challenges.event_id=annual_project_shortlist_1.event_id
                inner join challenge_submissions
                on challenge_submissions.submission_id=annual_project_shortlist_1.submission_id
                inner join projects
                on projects.project_id=challenge_submissions.project_id
                where
                  challenges.sch_id=${schoolId}
                and
                  challenges.cls_id in (6,7)`;
    }
    case 8:
    case 9:
    case 10: {
      return `SELECT
                  challenge_submissions.submission_id,
                  projects.project_id,
                  projects.name,
                  challenges.cls_id
                FROM annual_project_shortlist_1
                inner join challenges
                on challenges.event_id=annual_project_shortlist_1.event_id
                inner join challenge_submissions
                on challenge_submissions.submission_id=annual_project_shortlist_1.submission_id
                inner join projects
                on projects.project_id=challenge_submissions.project_id
                where
                  challenges.sch_id=${schoolId}
                and
                  challenges.cls_id in (8,9,10)`;
    }
  }
}
router.post("/getAnnualProjectShortlist1", (req, res) => {
  var grade = parseInt(req.body.grade);
  var eventId = req.body.event_id;
  var schoolId;

  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        "select * from cv_users where user_id=? and role_id=2",
        [userInfo.user_id]
      );
    })
    .then(result => {
      if (!result.length) {
        throw new Error("unauthorized");
      } else {
        schoolId = result[0].sch_id;
        var query = createAnnualProjectShortlist1Query(schoolId, grade);
        return runSqlQueryAsyncSelect(query, [eventId]);
      }
    })
    .then(result => {
      res.json({ grade: grade, shortlist: result });
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

function createAnnualProjectFinalShortlistQuery(schoolId, grade) {
  switch (grade) {
    case 1:
    case 2:
    case 3: {
      return `SELECT
                challenge_submissions.submission_id,
                projects.project_id,
                projects.name,
                challenges.cls_id
              FROM annual_project_final_shortlist
              inner join challenges
              on challenges.event_id=annual_project_shortlist_1.event_id
              inner join challenge_submissions
              on challenge_submissions.submission_id=annual_project_final_shortlist.submission_id
              inner join projects
              on projects.project_id=challenge_submissions.project_id
              where
                challenges.sch_id=${schoolId}
              and
                challenges.cls_id in (1,2,3)`;
    }
    case 4:
    case 5: {
      return `SELECT
                challenge_submissions.submission_id,
                projects.project_id,
                projects.name,
                challenges.cls_id
              FROM annual_project_shortlist_1
              inner join challenges
              on challenges.event_id=annual_project_shortlist_1.event_id
              inner join challenge_submissions
              on challenge_submissions.submission_id=annual_project_shortlist_1.submission_id
              inner join projects
              on projects.project_id=challenge_submissions.project_id
              where
                challenges.sch_id=${schoolId}
              and
                challenges.cls_id in (4,5)`;
    }
    case 6:
    case 7: {
      return `SELECT
                challenge_submissions.submission_id,
                projects.project_id,
                projects.name,
                challenges.cls_id
                FROM annual_project_shortlist_1
                inner join challenges
                on challenges.event_id=annual_project_shortlist_1.event_id
                inner join challenge_submissions
                on challenge_submissions.submission_id=annual_project_shortlist_1.submission_id
                inner join projects
                on projects.project_id=challenge_submissions.project_id
                where
                  challenges.sch_id=${schoolId}
                and
                  challenges.cls_id in (6,7)`;
    }
    case 8:
    case 9:
    case 10: {
      return `SELECT
                  challenge_submissions.submission_id,
                  projects.project_id,
                  projects.name,
                  challenges.cls_id
                FROM annual_project_shortlist_1
                inner join challenges
                on challenges.event_id=annual_project_shortlist_1.event_id
                inner join challenge_submissions
                on challenge_submissions.submission_id=annual_project_shortlist_1.submission_id
                inner join projects
                on projects.project_id=challenge_submissions.project_id
                where
                  challenges.sch_id=${schoolId}
                and
                  challenges.cls_id in (8,9,10)`;
    }
  }
}
router.post("/getAnnualProjectFinalShortlist", (req, res) => {
  var grade = parseInt(req.body.grade);
  var eventId = req.body.event_id;
  var schoolId;

  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        "select * from cv_users where user_id=? and role_id=2",
        [userInfo.user_id]
      );
    })
    .then(result => {
      if (!result.length) {
        throw new Error("unauthorized");
      } else {
        schoolId = result[0].sch_id;
        var query = createAnnualProjectFinalShortlistQuery(schoolId, grade);
        return runSqlQueryAsyncSelect(query, [eventId]);
      }
    })
    .then(result => {
      res.json({ grade: grade, shortlist: result });
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post("/submitFinalAnnualProjectShortlist", (req, res) => {
  var schoolId;
  var shortlist = req.body.shortlist;
  if (!shortlist.length) {
    res.status(400).end();
  }
  if (shortlist.length > 3) {
    res.status(400).end();
  }
  var anyGrade = parseInt(shortlist[0].cls_id);
  var grades;
  switch (anyGrade) {
    case 1:
    case 2:
    case 3: {
      grades = "1,2,3";
      break;
    }
    case 4:
    case 5: {
      grades = "4,5";
      break;
    }
    case 6:
    case 7: {
      grades = "6,7";
      break;
    }
    case 8:
    case 9:
    case 10: {
      grades = "8,9,10";
      break;
    }
  }

  var userInfo;
  var conn;

  return verifyRequest(req)
    .then(info => {
      userInfo = info;
      return db.getConnection();
    })
    .then(connection => {
      conn = connection;
      return runSqlQueryAsyncSelect(
        "select * from cv_users where user_id=? and role_id=2",
        [userInfo.user_id]
      );
    })
    .then(result => {
      if (!result.length) {
        throw new Error("unauthorized");
      } else {
        schoolId = result[0].sch_id;
        return runSqlQueryAsyncSelect(
          `
          select count(*) as submissions
          from annual_project_final_shortlist
          where
            sch_id=?
          and
            find_in_set(?, grades)
          `,
          [schoolId, anyGrade]
        );
      }
    })
    .then(result => {
      if (result.length && result[0].submissions) {
        throw new Error("final_shortlist_already_done");
      } else {
        var query = "";
        shortlist.forEach(function(item) {
          var submissionId = item.submission_id;
          query += `insert into annual_project_final_shortlist(sch_id, submission_id, grades) values(${schoolId}, ${submissionId}, "${grades}"); `;
        });
        query = "" + query;
        return new Promise(function(resolve, reject) {
          conn.beginTransaction(function(err) {
            if (err) {
              reject(new Error("transaction_init_failure"));
            } else {
              return runSqlQueryAsyncInsert(query, null, conn)
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
                  return conn.rollback(function(err) {
                    reject(new Error("error"));
                  });
                });
            }
          });
        });
      }
    })
    .then(() => {
      conn.release();
      res.send();
    })
    .catch(err => {
      conn.release();
      console.log(err);
      res.status(400).end();
    });
});

router.post("/getFinalShortlistCompletionStatusForGradeGroup", (req, res) => {
  var schoolId;
  var grade = parseInt(req.body.grade);
  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        "select * from cv_users where user_id=? and role_id=2",
        [userInfo.user_id]
      );
    })
    .then(result => {
      if (!result.length) {
        throw new Error("unauthorized");
      } else {
        schoolId = result[0].sch_id;
        return runSqlQueryAsyncSelect(
          `
        select count(*) as final_shortlist
        from annual_project_final_shortlist
        where
          sch_id=?
        and
          find_in_set(?, grades)
        `,
          [schoolId, grade]
        );
      }
    })
    .then(result => {
      var shortlistCount = 0;
      if (result.length) shortlistCount = result[0].final_shortlist;
      res.send({ grade: grade, shortlist_count: shortlistCount });
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

/***************** Annual Project - END */

/***************** Code Challenge */
router.post("/getLiveCodeChallenges", (req, res) => {
  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        "select * from cv_users where user_id=? and role_id=2",
        [userInfo.user_id]
      );
    })
    .then(result => {
      if (!result.length) {
        throw new Error("unauthorized");
      }
      return runSqlQueryAsyncSelect(
        "select * from code_challenges where sch_id=? and active=1",
        [result[0].sch_id]
      );
    })
    .then(result => {
      if (!result.length) throw new Error("no_challenges");
      var challenges = new Object();
      for (var i = 0; i < result.length; i++) {
        challenges[result[i].cls_id] = result[i];
      }
      res.send(challenges);
    })
    .catch(e => {
      console.log(e);
      res.status(400).end();
    });
});

router.post("/getGradesAndSectionsHavingLiveCodeChallenges", (req, res) => {
  var schoolId;
  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        "select * from cv_users where user_id=? and role_id=2",
        [userInfo.user_id]
      );
    })
    .then(result => {
      if (!result.length) {
        throw new Error("user_not_found");
      } else {
        schoolId = result[0].sch_id;
        return runSqlQueryAsyncSelect(
          `select cv_st_detail.cls_id, cv_st_detail.sec_id, code_challenges.event_id, count(code_challenge_winners.submission_id) as ranking_completed
          from cv_st_detail
          inner join code_challenges
            on code_challenges.cls_id=cv_st_detail.cls_id and code_challenges.sch_id=cv_st_detail.sch_id
          left join code_challenge_winners
            on code_challenge_winners.event_id=code_challenges.event_id
          where cv_st_detail.sch_id=? and cv_st_detail.cls_id>0
          group by cv_st_detail.cls_id, cv_st_detail.sec_id`,
          [schoolId]
        );
      }
    })
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

/*router.post("/getGradesAndSections", (req, res) => {
  var schoolId;
  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        "select * from cv_users where user_id=? and role_id=2",
        [userInfo.user_id]
      );
    })
    .then(result => {
      if (!result.length) {
        throw new Error("user_not_found");
      } else {
        return runSqlQueryAsyncSelect(
          `select cls_id, sec_id
            from cv_st_detail
            where sch_id=? and cls_id>0
            group by cls_id, sec_id`,
          [result[0].sch_id]
        );
      }
    })
    .then(result => {
      res.send(result);
    })
    .catch(err => {});
});*/

router.post("/startCodeChallengeForGrade", (req, res) => {
  var schoolId;
  var eventId = req.body.event_id;
  var schoolId = req.body.sch_id;
  var grade = req.body.grade;
  var section = req.body.section;

  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        "select * from cv_users where user_id=? and role_id=2",
        [userInfo.user_id]
      );
    })
    .then(result => {
      if (!result.length) {
        throw new Error("unauthorized");
      } else {
        schoolId = result[0].sch_id;
        return runSqlQueryAsyncSelect(
          "select * from code_challenges where sch_id=? and cls_id=?",
          [schoolId, grade]
        );
      }
    })
    .then(result => {
      if (!result.length) {
        throw new Error("no_challenges");
      }
      return runSqlQueryAsyncInsert(
        `insert into code_challenge_grades
        (event_id,
          sch_id,
          cls_id,
          sec_id)
        select ?, ?, ?, ? from DUAL
        where not exists (
          select *
          from code_challenge_grades
          where event_id=?
          and sch_id=?
          and cls_id=?
          and sec_id=?)
          limit 1
        `,
        [eventId, schoolId, grade, section, eventId, schoolId, grade, section]
      );
    })
    .then(result => {
      res.send();
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post("/getActiveCodeChallengesForGrades", (req, res) => {
  var schoolId;
  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        "select * from cv_users where user_id=? and role_id=2",
        [userInfo.user_id]
      );
    })
    .then(result => {
      if (!result.length) {
        throw new Error("unauthorized");
      } else {
        return runSqlQueryAsyncSelect(
          `select * from code_challenge_grades where sch_id=?`,
          [result[0].sch_id]
        );
      }
    })
    .then(result => {
      var challenges = new Object();
      for (var i = 0; i < result.length; i++) {
        let challenge = result[i];
        var challengeDate = new Date(Date.parse(challenge.date));
        var today = new Date();

        let expired =
          challengeDate.getFullYear() != today.getFullYear() ||
          challengeDate.getMonth() != today.getMonth() ||
          challengeDate.getDate() != today.getDate();

        challenges[challenge.cls_id + "-" + challenge.sec_id] = {
          expired: expired
        };
      }
      res.send(challenges);
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

// Code challenge submissions
router.post("/getCodeChallengeInfo", (req, res) => {
  var eventId = req.headers.event_id;
  return runSqlQueryAsyncSelect(
    "select * from code_challenges where event_id=?",
    [eventId]
  )
    .then(result => {
      if (result.length) res.send(result[0]);
      else throw new Error("error");
    })
    .catch(e => {
      res.status(400).end();
    });
});

router.post("/getCodeChallengeRatingCriteriaFor", (req, res) => {
  var projectType = req.body.project_type;
  return runSqlQueryAsyncSelect(
    "select * from code_challenge_rating_criteria where project_type=?",
    [projectType]
  )
    .then(result => {
      if (result.length) res.send(result[0]);
      else throw new Error("error");
    })
    .catch(e => {
      console.log(e);
      res.status(400).end();
    });
});

router.post("/getCodeChallengeSubmissionsCountForGrade", (req, res) => {
  return verifyRequest(req)
    .then(userInfo => {
      return getUserData(userInfo.user_id);
    })
    .then(userData => {
      return runSqlQueryAsyncSelect(
        `select count(distinct code_challenge_submissions.submission_id) as count
                              from code_challenge_submissions
                              inner join code_challenges
                              on code_challenges.event_id=code_challenge_submissions.event_id
                              inner join projects
                              on projects.project_id=code_challenge_submissions.project_id
                              inner join cv_users
                              on cv_users.user_id=code_challenge_submissions.user_id
                              inner join cv_st_detail
                              on cv_st_detail.user_id=code_challenge_submissions.user_id
                              where cv_st_detail.sch_id=?
                              and cv_st_detail.cls_id=?
                              and code_challenges.active=1
      `,
        [userData.sch_id, req.body.grade]
      );
    })
    .then(result => {
      if (result.length) res.send(result[0]);
      else res.send({ count: 0 });
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post("/getCodeChallengeSubmissionsForGradeSection", (req, res) => {
  return verifyRequest(req)
    .then(userInfo => {
      return getUserData(userInfo.user_id);
    })
    .then(userData => {
      return runSqlQueryAsyncSelect(
        `select distinct code_challenge_submissions.submission_id,
        code_challenge_submissions.event_id,
        code_challenge_submissions.user_id,
        code_challenge_submissions.project_id,
        projects.name as project_name,
        cv_users.name as user_name,
        code_challenges.project_type
        from code_challenge_submissions
        inner join code_challenges
        on code_challenges.event_id=code_challenge_submissions.event_id
        inner join projects
        on projects.project_id=code_challenge_submissions.project_id
        inner join cv_users
        on cv_users.user_id=code_challenge_submissions.user_id
        inner join cv_st_detail
        on cv_st_detail.user_id=code_challenge_submissions.user_id
        where cv_st_detail.sch_id=?
        and cv_st_detail.cls_id=?
        and cv_st_detail.sec_id=?
        and code_challenges.active=1
      `,
        [userData.sch_id, req.body.grade, req.body.section]
      );
    })
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post("/saveCodeChallengeSubmissionRating", (req, res) => {
  var submissionId = req.body.submission_id;
  var ratings = req.body.ratings;
  var remark = req.body.remark;
  if (!submissionId || !remark) {
    res.status(400).end();
    return;
  }

  var queryString = `insert into code_challenge_ratings
                      (
                        submission_id,
                        criteria_1,
                        criteria_2,
                        criteria_3,
                        criteria_4,
                        criteria_5,
                        remark
                      )
                      values (?,?,?,?,?,?,?)
                      on duplicate key update
                      criteria_1=values(criteria_1),
                      criteria_2=values(criteria_2),
                      criteria_3=values(criteria_3),
                      criteria_4=values(criteria_4),
                      criteria_5=values(criteria_5),
                      remark=values(remark)
                      `;

  return verifyRequest(req)
    .then(userInfo => {
      return getUserData(userInfo.user_id);
    })
    .then(userData => {
      if (userData.role_id != 2) throw new Error("unauthorized"); // Not a teacher
      return runSqlQueryAsyncInsert(queryString, [
        submissionId,
        ratings["criteria_1"],
        ratings["criteria_2"],
        ratings["criteria_3"],
        ratings["criteria_4"],
        ratings["criteria_5"],
        remark
      ]);
    })
    .then(result => {
      res.send();
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post("/getCodeChallengeRatingForSubmission", (req, res) => {
  var submissionId = req.body.submission_id;
  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        "select * from code_challenge_ratings where submission_id=?",
        [submissionId]
      );
    })
    .then(result => {
      if (result.length) res.send(result[0]);
      else res.send({});
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post("/getCodeChallengeRatingsForGrade", (req, res) => {
  var grade = req.body.grade;
  var section = req.body.section;
  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        `
    select code_challenge_ratings.submission_id
    from code_challenge_ratings
    inner join code_challenge_submissions
    on code_challenge_submissions.submission_id=code_challenge_ratings.submission_id
    inner join cv_st_detail
    on cv_st_detail.user_id=code_challenge_submissions.user_id
    where cv_st_detail.cls_id=? and cv_st_detail.sec_id=?
    `,
        [grade, section]
      );
    })
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post("/getCodeChallengeRatingCompletionStatusForGrade", (req, res) => {
  var grade = req.body.grade;
  var eventId = req.body.event_id;
  var schoolId;

  var submissionsCount = 0;
  var ratingsCount = 0;

  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        "select * from cv_users where user_id=? and role_id=2",
        [userInfo.user_id]
      );
    })
    .then(result => {
      if (!result.length) {
        throw new Error("unauthorized");
      } else {
        schoolId = result[0].sch_id;
        return runSqlQueryAsyncSelect(
          `select count(*) as submissions
        from code_challenge_submissions
        inner join cv_users
        on cv_users.user_id=code_challenge_submissions.user_id
        inner join cv_st_detail
        on cv_st_detail.user_id=cv_users.user_id
        where code_challenge_submissions.event_id=? and cv_users.sch_id=? and cv_st_detail.cls_id=?
        `,
          [eventId, schoolId, grade]
        );
      }
    })
    .then(result => {
      submissionsCount = result[0].submissions;
    })
    .then(() => {
      return runSqlQueryAsyncSelect(
        `select count(*) as ratings
      from code_challenge_ratings
      inner join code_challenge_submissions
      on code_challenge_submissions.submission_id=code_challenge_ratings.submission_id
      inner join cv_users
      on cv_users.user_id=code_challenge_submissions.user_id
      inner join cv_st_detail
      on cv_st_detail.user_id=cv_users.user_id
      where code_challenge_submissions.event_id=? and cv_users.sch_id=? and cv_st_detail.cls_id=?
      `,
        [eventId, schoolId, grade]
      );
    })
    .then(result => {
      ratingsCount = result[0].ratings;
      res.send({
        submissions_count: submissionsCount,
        ratings_count: ratingsCount
      });
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post("/getExistingWinnersForCodeChallenge", (req, res) => {
  var grade = req.body.grade;
  var eventId = req.body.event_id;
  var schoolId;

  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        "select * from cv_users where user_id=? and role_id=2",
        [userInfo.user_id]
      );
    })
    .then(result => {
      if (!result.length) {
        throw new Error("unauthorized");
      } else {
        schoolId = result[0].sch_id;
        return runSqlQueryAsyncSelect(
          "select * from code_challenge_winners where event_id=?",
          [eventId]
        );
      }
    })
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post("/getTopScorersInCodeChallenge", (req, res) => {
  var grade = req.headers.grade;
  /* An eventId belongs to all sections of all grades,
  so we are not going to use "grade" in our query.
  May be useful in the future. */
  var eventId = req.body.event_id;
  var exclude = req.body.exclude;
  var schoolId;

  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        "select * from cv_users where user_id=? and role_id=2",
        [userInfo.user_id]
      );
    })
    .then(result => {
      if (!result.length) {
        throw new Error("unauthorized");
      } else {
        schoolId = result[0].sch_id;

        return runSqlQueryAsyncSelect(
          `
      select * from code_challenge_winners where event_id=?
      `,
          [eventId]
        );
      }
    })
    .then(result => {
      var existingWinners = result;
      var excludeList = new Array();
      for (var i = 0; i < existingWinners.length; i++) {
        excludeList.push(existingWinners[i].submission_id);
      }
      excludeList = excludeList.join(",");

      if (existingWinners.length) {
        return runSqlQueryAsyncSelect(
          `select t.* from (select code_challenge_submissions.submission_id,
          (criteria_1+criteria_2+criteria_3+criteria_4+criteria_5) as score,
          (select max(criteria_1+criteria_2+criteria_3+criteria_4+criteria_5)
            from code_challenge_ratings
            inner join code_challenge_submissions
            on code_challenge_submissions.submission_id=code_challenge_ratings.submission_id
            where code_challenge_submissions.event_id=? and code_challenge_submissions.submission_id not in (?)) as max_score
          from code_challenge_ratings
          inner join code_challenge_submissions
          on code_challenge_submissions.submission_id=code_challenge_ratings.submission_id
          where code_challenge_submissions.event_id=?) t where t.score = max_score and t.submission_id not in (?) order by t.score desc
        `,
          [eventId, excludeList, eventId, excludeList]
        );
      } else {
        return runSqlQueryAsyncSelect(
          `select t.* from (select code_challenge_submissions.submission_id,
          (criteria_1+criteria_2+criteria_3+criteria_4+criteria_5) as score,
          (select max(criteria_1+criteria_2+criteria_3+criteria_4+criteria_5)
            from code_challenge_ratings
            inner join code_challenge_submissions
            on code_challenge_submissions.submission_id=code_challenge_ratings.submission_id
            where code_challenge_submissions.event_id=?) as max_score
          from code_challenge_ratings
          inner join code_challenge_submissions
          on code_challenge_submissions.submission_id=code_challenge_ratings.submission_id
          where code_challenge_submissions.event_id=?) t where t.score = max_score order by t.score desc
        `,
          [eventId, eventId]
        );
      }
    })
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post("/setSubmissionAsWinner", (req, res) => {
  var schoolId;
  var submissionId = req.body.submission_id;
  var eventId;
  var place = req.body.place;
  if (place != 1 && place != 2) {
    res.status(400).end();
    return;
  }
  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        "select * from cv_users where user_id=? and role_id=2",
        [userInfo.user_id]
      );
    })
    .then(result => {
      if (!result.length) {
        throw new Error("unauthorized");
      } else {
        schoolId = result[0].sch_id;

        return runSqlQueryAsyncSelect(
          `
      select * from code_challenge_submissions
      where submission_id=?
      `,
          [submissionId]
        );
      }
    })
    .then(result => {
      if (!result.length) {
        throw new Error("submission_does_not_exist");
      } else {
        eventId = result[0].event_id;
      }
      return runSqlQueryAsyncSelect(
        `
      select * from code_challenge_winners
      inner join code_challenge_submissions
      on code_challenge_submissions.event_id=code_challenge_winners.event_id
      where code_challenge_winners.event_id=? and place=?
      `,
        [eventId, place]
      );
    })
    .then(result => {
      if (result.length) {
        throw new Error("place_taken");
      }
      return runSqlQueryAsyncSelect(
        `
      select * from code_challenge_winners
      inner join code_challenge_submissions
      on code_challenge_submissions.event_id=code_challenge_winners.event_id
      where code_challenge_winners.event_id=? and code_challenge_winners.submission_id=?
      `,
        [eventId, submissionId]
      );
    })
    .then(result => {
      if (result.length) {
        throw new Error("winner_already_exists");
      } else {
        return runSqlQueryAsyncInsert(
          `
      insert into code_challenge_winners
      (
        event_id,
        submission_id,
        place
      )
      values (?,?,?)
      `,
          [eventId, submissionId, place]
        );
      }
    })
    .then(result => {
      res.end();
    })
    .catch(err => {
      console.dir(err);
      if (typeof err.message === "string") res.status(400).send(err.message);
      else res.status(400).end();
    });
});

/************* START Code Challenge - Student's side **/
router.post("/getMyCodeChallenge", (req, res) => {
  var userId;
  var myChallenge;
  if (new Date().getHours() > 23) {
    res.status(400).end();
    return;
  }
  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        "select * from cv_users inner join cv_st_detail on cv_users.user_id=cv_st_detail.user_id where cv_users.user_id=?",
        [userInfo.user_id]
      );
    })
    .then(result => {
      if (!result.length) {
        throw new Error("unauthorized");
      }
      userId = result[0].user_id;
      return runSqlQueryAsyncSelect(
        `select * from code_challenge_grades
          inner join code_challenges
          on code_challenge_grades.event_id=code_challenges.event_id
          where code_challenge_grades.sch_id=?
          and code_challenge_grades.cls_id=?
          and sec_id=?
          and active=1
          limit 1`,
        [result[0].sch_id, result[0].cls_id, result[0].sec_id]
      );
    })
    .then(result => {
      if (!result.length) {
        throw new Error("no_challenges");
      }
      let challenge = result[0];
      var challengeDate = new Date(Date.parse(challenge.date));
      var today = new Date();

      let expired =
        challengeDate.getFullYear() != today.getFullYear() ||
        challengeDate.getMonth() != today.getMonth() ||
        challengeDate.getDate() != today.getDate();

      if (expired) throw new Error("no_challenges");
      return challenge;
    })
    .then(challenge => {
      myChallenge = challenge;
      return runSqlQueryAsyncSelect(
        "select * from code_challenge_submissions where event_id=? and user_id=?",
        [challenge.event_id, userId]
      );
    })
    .then(submission => {
      if (submission.length) {
        myChallenge.attempted = true;
        myChallenge.project_id = submission[0].project_id;
        var submitAt = Date.parse(submission[0].started_at);
        if (Date.now() - submitAt > 30 * 60 * 1000) {
          myChallenge.completed = true;
        }
      }
      res.send(myChallenge);
    })
    .catch(e => {
      res.status(400).end();
    });
});

router.post("/startCodeChallenge", (req, res) => {
  var eventId = req.body.event_id;
  var userData;
  var projectId;

  if (!eventId) {
    res.status(400).end();
    return;
  }
  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        "select * from cv_users inner join cv_st_detail on cv_st_detail.user_id=cv_users.user_id where cv_users.user_id=? and cv_users.role_id=3",
        [userInfo.user_id]
      );
    })
    .then(result => {
      if (!result.length) {
        throw new Error("unauthorized");
      } else {
        userData = result[0];
        return runSqlQueryAsyncSelect(
          "select * from code_challenge_submissions where event_id=? and user_id=?",
          [eventId, userData.user_id]
        );
      }
    })
    .then(existingEntry => {
      if (existingEntry.length) {
        throw new Error("already_entered");
      }
      return runSqlQueryAsyncSelect(
        "select * from code_challenges where event_id=? and sch_id=? and cls_id=?",
        [eventId, userData.sch_id, userData.cls_id]
      );
    })
    .then(challengeInfo => {
      if (!challengeInfo.length) {
        throw new Error("challenge_not_found");
      }
      var challenge = challengeInfo[0];
      return new Promise((resolve, reject) => {
        req.runMiddleware(
          "/projects/createProject",
          {
            method: "post",
            body: {
              type: challenge.project_type,
              name: challenge.name,
              desc: "Entry for " + challenge.name
            }
          },
          function(code, data) {
            if (code == 200) {
              resolve(data);
            } else {
              reject("failed_to_create_project");
            }
          }
        );
      });
    })
    .then(createdProjectId => {
      projectId = createdProjectId;
      return runSqlQueryAsyncInsert(
        "insert into code_challenge_submissions (event_id, user_id, project_id) values(?,?,?)",
        [eventId, userData.user_id, createdProjectId]
      );
    })
    .then(() => {
      res.send("" + projectId);
    })
    .catch(err => {
      res.status(400).end();
    });
});

/******* START Code challenge admin side */
router.post("/getSchools", (req, res) => {
  return verifyAdmin(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        "select sch_id, name from cv_school_detail"
      );
    })
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post("/getGradesWithCodeChallengeForSchool", (req, res) => {
  var schoolId = req.body.school_id;
  return verifyAdmin(req)
    .then(userInfo => {
      return runSqlQueryAsyncSelect(
        `
        select cv_st_detail.cls_id,
        code_challenges.event_id,
        count(code_challenge_winners.submission_id) as ranking_completed
          from cv_st_detail
          inner join code_challenges
            on code_challenges.cls_id=cv_st_detail.cls_id and code_challenges.sch_id=cv_st_detail.sch_id
          left join code_challenge_winners
            on code_challenge_winners.event_id=code_challenges.event_id
          where cv_st_detail.sch_id=? and cv_st_detail.cls_id>0
          group by cv_st_detail.cls_id`,
        [schoolId]
      );
    })
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post("/getCodeChallengeResultsAndStatsForGrade", (req, res) => {
  // total submissions
  // total students
  // winners
  var schoolId = req.body.school_id;
  var grade = req.body.grade;

  var studentsCount;
  var submissionsCount;
  var winners;

  return verifyAdmin(req)
    .then(adminInfo => {
      /* winner count
    SELECT count(*) FROM `code_challenge_winners`
inner join code_challenges
on code_challenges.event_id=code_challenge_winners.event_id
WHERE code_challenges.cls_id=1 and code_challenges.sch_id=2
    */
      return runSqlQueryAsyncSelect(
        `
        select count(*) as students_count
        from cv_users
        inner join cv_st_detail
        on cv_st_detail.user_id=cv_users.user_id
        where cv_users.sch_id=? and cv_st_detail.cls_id=?
      `,
        [schoolId, grade]
      );
    })
    .then(result => {
      studentsCount = result[0].students_count;
      return runSqlQueryAsyncSelect(
        `
        SELECT count(*) as submissions_count
        FROM code_challenge_submissions
        inner join code_challenges
        on code_challenges.event_id=code_challenge_submissions.event_id
        WHERE code_challenges.sch_id=? and code_challenges.cls_id=?
        `,
        [schoolId, grade]
      );
    })
    .then(result => {
      submissionsCount = result[0].submissions_count;
    })
    .then(result => {
      return runSqlQueryAsyncSelect(
        `
        SELECT
          code_challenge_winners.place,
          code_challenge_submissions.project_id,
          code_challenge_submissions.user_id,
          cv_users.name,
          cv_st_detail.sec_id
        FROM code_challenge_winners
        inner join code_challenge_submissions
        on code_challenge_submissions.submission_id=code_challenge_winners.submission_id
        inner join cv_users
        on cv_users.user_id=code_challenge_submissions.user_id
        inner join cv_st_detail
        on cv_st_detail.user_id=cv_users.user_id
        where 
          cv_st_detail.sch_id=? and cv_st_detail.cls_id=?
        order by place asc
        `,
        [schoolId, grade]
      );
    })
    .then(result => {
      winners = result;
    })
    .then(() => {
      res.send({
        students: studentsCount,
        submissions: submissionsCount,
        winners: winners
      });
    })
    .catch(err => {
      console.log(err);
      res.end();
    });
});
/******* END Code challenge admin side */

/******* START Annual Project admin side */
router.post("/getGradesWithAnnualProjectForSchool", (req, res) => {
  var schoolId = req.body.school_id;
  return verifyAdmin(req)
    .then(userInfo => {
      // Get grades having annual project
      return runSqlQueryAsyncSelect(
        `
        select cv_st_detail.cls_id
          from cv_st_detail
          inner join challenges
            on challenges.sch_id=cv_st_detail.sch_id and challenges.cls_id=cv_st_detail.cls_id
          where cv_st_detail.sch_id=? and cv_st_detail.cls_id>0
          group by cv_st_detail.cls_id`,
        [schoolId]
      );
    })
    .then(result => {
      // Only get results with grades in any of these groups:
      // [1,2,3], [4,5], [6,7], [8,9,10]

      var gradeGroups = {
        // Keys are grades, values are groups to which the grades belong
        1: 1,
        2: 1,
        3: 1,
        4: 2,
        5: 2,
        6: 3,
        7: 3,
        8: 4,
        9: 4,
        10: 4
      };

      var gradesInGroup = { 1: "", 2: "", 3: "", 4: "" };
      var grades = new Array();

      var gradeGroupRepresentative = new Array(); // Contains grades, each representing the group to which it belongs, e.g. 1 represents the group of grades 1,2,3
      var gradeNames = new Object();

      var added123 = false;
      var added45 = false;
      var added67 = false;
      var added89x = false;

      result.forEach(function(grade) {
        switch (grade.cls_id) {
          case 1:
          case 2:
          case 3: {
            if (!added123) {
              grades.push(grade);
              added123 = true;
            }
            break;
          }
          case 4:
          case 5: {
            if (!added45) {
              grades.push(grade);
              added45 = true;
            }
            break;
          }
          case 6:
          case 7: {
            if (!added67) {
              grades.push(grade);
              added67 = true;
            }
            break;
          }
          case 8:
          case 9:
          case 10: {
            if (!added89x) {
              grades.push(grade);
              added89x = true;
            }
            break;
          }
        }

        gradesInGroup[gradeGroups[grade.cls_id]] += grade.cls_id + ", ";
      });
      for (key in gradesInGroup) {
        // Strip trailing comma and space
        gradesInGroup[key] = gradesInGroup[key].substring(
          0,
          gradesInGroup[key].length - 2
        );
      }
      res.send({
        gradeGroups: gradeGroups,
        gradesInGroup: gradesInGroup,
        grades: grades
      });
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post("/getAnnualProjectStatsForSchoolGradeGroup", (req, res) => {
  // total submissions
  // total students
  // winners
  var schoolId = req.body.school_id;
  var grades = req.body.grades;
  var grade = JSON.parse("[" + grades + "]")[0];

  var studentsCount;
  var submissionsCount;
  var finalShortlist;

  return verifyAdmin(req)
    .then(adminInfo => {
      // Get total students
      var query = `
        select count(*) as students_count
          from cv_users
          inner join cv_st_detail
          on cv_st_detail.user_id=cv_users.user_id
          where cv_users.sch_id=${schoolId} and cv_st_detail.cls_id in (${grades})`;
      return runSqlQueryAsyncSelect(query);
    })
    .then(result => {
      studentsCount = result[0].students_count;
      var query = `
          SELECT count(*) as submissions_count
            FROM challenge_submissions
            inner join challenges
            on challenges.event_id=challenge_submissions.event_id
            WHERE challenges.sch_id=${schoolId} and challenges.cls_id in (${grades})`;
      return runSqlQueryAsyncSelect(query);
    })
    .then(result => {
      submissionsCount = result[0].submissions_count;
    })
    .then(result => {
      return runSqlQueryAsyncSelect(
        `
        SELECT projects.project_id,
        projects.name as project_name,
        cv_users.name as user_name,
        cv_st_detail.cls_id as grade,
        cv_st_detail.sec_id as section
        FROM annual_project_final_shortlist
        inner join challenge_submissions
        on challenge_submissions.submission_id=annual_project_final_shortlist.submission_id
        inner join projects
        on projects.project_id=challenge_submissions.project_id
        inner join cv_st_detail
        on cv_st_detail.user_id=projects.user_id
        inner join cv_users
        on cv_users.user_id=cv_st_detail.user_id
        where annual_project_final_shortlist.sch_id=? and find_in_set(?, grades)
        `,
        [schoolId, grade]
      );
    })
    .then(result => {
      finalShortlist = result;
    })
    .then(() => {
      res.send({
        students: studentsCount,
        submissions: submissionsCount,
        finalShortlist: finalShortlist
      });
    })
    .catch(err => {
      console.log(err);
      res.end();
    });
});
/******* END Annual Project admin side */

/******* START Project Preview page */
router.post("/handleProjectViewed", (req, res) => {
  // total submissions
  // total students
  // winners
  var projectId = req.body.projectId;

  var conn;
  return db
    .getConnection()
    .then(connection => {
      conn = connection;
      return new Promise((resolve, reject) => {
        conn.beginTransaction(function(err) {
          if (err) {
            reject("transaction_init_failure");
          } else {
            runSqlQueryAsyncUpdate(
              `
                update project_views set count = count + 1 where project_id=?
              `,
              [projectId],
              conn
            )
              .then(result => {
                if (!result.affectedRows) {
                  return runSqlQueryAsyncUpdate(
                    `
                      insert into project_views(project_id, count) values(?, ?)
                    `,
                    [projectId, 1],
                    conn
                  );
                }
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
                return conn.rollback(function(err1) {
                  reject(err);
                });
              });
          }
        });
      });
    })
    .then(() => {
      conn.release();
      res.end();
    })
    .catch(err => {
      console.log(err);
      conn.release();
      res.end();
    });
});
/******* END Project Preview page */
module.exports = router;
