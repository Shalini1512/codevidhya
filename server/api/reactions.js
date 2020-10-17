/*
We use POST only because GET requests are cached by the browser,
which leads to weird behaviour.
*/

var express = require("express");
var router = express.Router();

var db = require("../db");
var pool = db.pool;

function runSqlQueryAsyncSelect(query, params, conn) {
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

function runSqlQueryAsyncUpdate(query, params, conn) {
  return new Promise((resolve, reject) => {
    var connection = conn || pool;
    connection.query(query, params, (err, result) => {
      if (err) {
        reject("query_failed");
      } else {
        resolve(result);
      }
    });
  });
}

function runSqlQueryAsyncDelete(query, params, conn) {
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

function verifyRequest(req) {
  return new Promise(function(resolve, reject) {
    if (req.session.user_id) {
      resolve({ user_id: req.session.user_id, dir_path: req.session.dir_path });
    } else {
      reject("unauthorized");
    }
  });
}

function getUserData(userId, conn) {
  return runSqlQueryAsyncSelect("select * from cv_users where user_id=?", [
    userId
  ], conn)
    .then(result => {
      if (!result.length) throw new Error("user_not_found");
      return result[0];
    })
    .catch(err => {
      throw new Error("user_not_found");
    });
}

router.post("/addCommentForProject", (req, res) => {
  var projectId = req.body.project_id;
  var message = req.body.message;
  if (!projectId) {
    res.status(400).end();
  }
  return verifyRequest(req)
    .then(userInfo => {
      return runSqlQueryAsyncInsert(
        `
      insert into project_comments (user_id, project_id, parent_comment_id, message)
      values(?, ?, ?, ?)
      `,
        [userInfo.user_id, projectId, null, message]
      );
    })
    .then(result => {
      return runSqlQueryAsyncSelect(
        `
        select
          comment_id,
          name as user_name,
          message
        from project_comments
        inner join cv_users
        on cv_users.user_id=project_comments.user_id
        where comment_id=?
        `,
        [result.insertId]
      );
    })
    .then(result => {
      res.send(result[0]);
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post("/getCommentsCountForProject", (req, res) => {
  var projectId = req.body.project_id;
  return runSqlQueryAsyncSelect(
    `
    select count(*) as comments from project_comments
    where project_id=?
  `,
    [projectId]
  )
    .then(result => {
      res.send({ count: result[0].comments });
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post("/getProjectComments", (req, res) => {
  var projectId = req.body.project_id;
  var latestCommentId = req.body.latest_comment_id;
  var comments = new Array();
  var query;
  var params;
  if (latestCommentId) {
    query = `
            select
              comment_id,
              name as user_name,
              message
            from project_comments
            inner join cv_users
            on cv_users.user_id=project_comments.user_id
            where project_id=? and comment_id<?
            order by created_at desc
            limit 10
            `;
    params = [projectId, latestCommentId];
  } else {
    query = `
            select
              comment_id,
              name as user_name,
              message
            from project_comments
            inner join cv_users
            on cv_users.user_id=project_comments.user_id
            where project_id=?
            order by created_at desc
            limit 10
            `;
    params = [projectId];
  }
  return runSqlQueryAsyncSelect(query, params)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

router.post("/toggleProjectLike", function(req, res) {
  var projectId = req.body.projectId;
  var userId;

  var likeAdded = false;

  var conn;

  return verifyRequest(req)
    .then(userInfo => {
      userId = userInfo.user_id;
      return db.getConnection();
    })
    .then(connection => {
      conn = connection;
      return new Promise(function(resolve, reject) {
        conn.beginTransaction(function(err) {
          if (err) {
            reject(new Error("transaction_init_failure"));
          } else {
            return runSqlQueryAsyncDelete(
              "delete from project_likes where project_id=? and user_id=?",
              [projectId, userId],
              conn
            )
              .then(result => {
                if (result.affectedRows < 1) {
                  // Like doesn't exist, so add new Like
                  likeAdded = true;
                  return runSqlQueryAsyncInsert(
                    "insert into project_likes(project_id, user_id) values(?, ?)",
                    [projectId, userId],
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
                return conn.rollback(function(err) {
                  reject("failed");
                });
              });
          }
        });
      });
    })
    .then(() => {
      conn.release();
      res.send({ likeAdded: likeAdded });
    })
    .catch(err => {
      conn.release();
      console.log(err);
    });
});
module.exports = router;
