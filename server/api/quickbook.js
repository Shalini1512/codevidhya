/*
We use POST only because GET requests are cached by the browser,
which leads to weird behaviour.
*/

var express = require("express");
var router = express.Router();
var cors = require("cors");

var atob = require("atob");

const path = require("path");
var pathUtils = require("./path-utils");

var fs = require("fs-extra");
var rimraf = require("rimraf");
var mkdirp = require("mkdirp");
var multer = require("multer");

var pathUtils = require("./path-utils");

var pool = require("../db").pool;

function runSqlQueryAsyncSelect(query, params) {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, result) => {
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
    pool.query(query, params, (err, result) => {
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
    pool.query(query, params, (err, result) => {
      if (err) {
        console.log(err);
        reject("query_failed");
      } else {
        resolve({ result: result, affectedRows: result.affectedRows });
      }
    });
  });
}

function runSqlQueryAsyncDelete(query, params) {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, result) => {
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

function canAccessExample(userId, exampleId) {
  return runSqlQueryAsyncSelect(
    `
    select cv_st_detail.cls_id from cv_users
    inner join cv_st_detail
    on cv_st_detail.user_id=cv_users.user_id
    inner join textbook_examples
    on textbook_examples.grade=cv_st_detail.cls_id
    where cv_st_detail.user_id=? and textbook_examples.item_id=?
    `,
    [userId, exampleId]
  )
    .then(result => {
      if (result.length) return true;
      else return false;
    })
    .catch(err => {
      return false;
    });
}

function getQuickbookTopicDataForSkill(courseName, index) {
  if (~courseName.toLowerCase().indexOf("html")) {
    return {
      fake_id: index,
      type: "for_independent_user",
      skill: "html",
      name: "HTML & CSS"
    };
  }
  if (~courseName.toLowerCase().indexOf("javascript")) {
    return {
      fake_id: index,
      type: "for_independent_user",
      skill: "javascript",
      name: "JavaScript"
    };
  }
  if (~courseName.toLowerCase().indexOf("python")) {
    return {
      fake_id: index,
      type: "for_independent_user",
      skill: "python",
      name: "Python"
    };
  }
}
function getQuickbookTopicsForIndependentUsers(userId) {
  return runSqlQueryAsyncSelect(
    `
    SELECT book_name FROM orders
    INNER JOIN books
    ON books.product_id=orders.product_id
    WHERE user_id=?
  `,
    [userId]
  ).then(result => {
    var data = new Array();
    if (result.length) {
      var i;
      for (i = 0; i < result.length; i++) {
        data.push(getQuickbookTopicDataForSkill(result[i].book_name, i));
      }
    }
    return data;
  });
}

router.post("/getTopics", (req, res) => {
  var userId = 0;
  return verifyRequest(req)
    .then(userInfo => {
      return getUserData(userInfo.user_id);
    })
    .then(userData => {
      userId = userData.user_id;
      if (userData.sch_id == 1) {
        // Independent user
        return getQuickbookTopicsForIndependentUsers(userId);
      } else {
        return runSqlQueryAsyncSelect(
          `
          SELECT textbook_example_topics.* FROM cv_users
          INNER JOIN cv_st_detail
          ON cv_st_detail.user_id=cv_users.user_id
          RIGHT JOIN textbook_example_topics
          on textbook_example_topics.grade=cv_st_detail.cls_id
          WHERE cv_users.user_id=?
        `,
          [userId]
        );
      }
    })
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.end();
    });
});

function getExamplesForSpecificSkill(skill) {
  var examples = new Object();
  var skills;
  switch (skill) {
    case "html":
    case "css": {
      skills = "'html', 'css'";
      examples.topicName = "HTML & CSS";
    }
  }
  return runSqlQueryAsyncSelect(
    `
    SELECT * FROM textbook_examples
    WHERE skill in (${skills})
    `
  ).then(result => {
    examples.examples = result;
    return examples;
  });
}

function getExamplesInTopicForSchoolStudents(userData, topic) {
  var examples = new Object();
  return runSqlQueryAsyncSelect(
    `
    select * from cv_st_detail
    where user_id=?
  `,
    [userData.user_id]
  )
    .then(result => {
      userData.cls_id = result[0].cls_id;
      return runSqlQueryAsyncSelect(
        `
      SELECT * from textbook_example_topics
      where topic=?
      `,
        [topic]
      );
    })
    .then(result => {
      if (!result.length) throw new Error("topic_not_found");
      var topicInfo = result[0];
      examples.topicName = topicInfo.name;
      if (topicInfo.grade == userData.cls_id) {
        accessType = topicInfo.access_type;
        var examplesQuery;
        var params;
        if (accessType == "topicwise") {
          examplesQuery = `
          SELECT * FROM textbook_examples
          WHERE topic=?
        `;
          params = topic;
        } else {
          examplesQuery = `
          SELECT * FROM textbook_examples
          WHERE topic=? AND grade=?
        `;
          params = [topic, userData.cls_id];
        }
        return runSqlQueryAsyncSelect(examplesQuery, params);
      } else {
        throw new Error("not_allowed_to_access_examples");
      }
    })
    .then(result => {
      /*
    Scratch examples have base64 encoded sb3 files in the content field.
    Can be too large. So we don't include content while sending the list of examples.
    The content will be retrieved for each individual example on demand.
    */
      for (var i = 0; i < result.length; i++) {
        if (result[i].topic == "scratch") {
          result[i].content = "";
        }
      }
      examples.examples = result;
      return examples;
    });
}

router.post("/getExamplesInTopic", (req, res) => {
  /*
  TODO: Handle individual users
  */
  var userData;
  var userId = 0;
  var grade = 1;
  var topic = req.body.topic;
  var skill = req.body.skill; // Course/skill purchased by independent user

  return verifyRequest(req)
    .then(userInfo => {
      return getUserData(userInfo.user_id);
    })
    .then(userdata => {
      userData = userdata;
      userId = userData.user_id;
      if (userData.sch_id == 1) {
        // Independent users
        if (!skill) throw new Error("skill_unspecified");
        return getExamplesForSpecificSkill(skill);
      } else {
        // School users
        return getExamplesInTopicForSchoolStudents(userData, topic);
      }
    })
    .then(examples => {
      res.send(examples);
    })
    .catch(err => {
      console.log(err);
      res.end();
    });
});

/*function base64ToArrayBuffer(base64) {
  var binary_string = atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

function binaryStringToArrayBuffer(binaryString) {
  var len = binaryString.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}*/

/* REMOVE ON BUILD */
var corsOptions = {
  origin: "http://localhost:8601",
  optionsSuccessStatus: 200
};

function getDefaultScratchExample() {
  var filePath = pathUtils.convertToSystemSlash(
    pathUtils.appRoot + "/server/data/quickbook/default_scratch_example.json"
  );
  var data = fs.readFileSync(filePath);
  data = JSON.parse(data);
  var base64String = data.sb3;
  var buf = Buffer.from(base64String, "base64");
  return Promise.resolve(buf);
}

function getScratchExampleContentFromDatabase(exampleId) {
  return runSqlQueryAsyncSelect(
    `
    select * from textbook_examples
    where item_id=?
    `,
    [exampleId]
  ).then(result => {
    if (!result.length) throw new Error("not_found");
    var exampleContent = JSON.parse(result[0].content);
    var base64String = exampleContent.sb3;
    var buf = Buffer.from(base64String, "base64");
    return buf;
  });
}

router.get("/getScratchFile/:exampleId", cors(corsOptions), (req, res) => {
  var exampleId = req.params.exampleId;
  /* return verifyRequest(req)
    .then(userInfo => {
      console.log(userInfo);
      // return canAccessExample(userInfo.user_id, exampleId);
      return true;
    })*/
  return Promise.resolve(true)
    .then(canAccess => {
      if (!canAccess) throw new Error("not_allowed");
    })
    .then(() => {
      if (exampleId == 0) {
        return getDefaultScratchExample();
      } else {
        return getScratchExampleContentFromDatabase(exampleId);
      }
    })
    .then(buf => {
      res.send(buf);
    })
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

module.exports = router;
