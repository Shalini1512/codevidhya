var pool = require("../db").pool;

module.exports.runSqlQueryAsyncSelect = function(query, params, conn) {
  /*
  conn: optional
    Pass a mysql connection to be used instead of using a connection from the pool.
    This is required when a specific connection object is required, such as in a
    transaction.
  */
  return new Promise((resolve, reject) => {
    var connection = conn || pool;
    connection.query(query, params, (err, result) => {
      resolve({ err: err, result: result });
    });
  });
};

module.exports.runSqlQueryAsyncInsert = function(query, params, conn) {
  /*
  conn: optional
    Pass a mysql connection to be used instead of using a connection from the pool.
    This is required when a specific connection object is required, such as in a
    transaction.
  */
  return new Promise((resolve, reject) => {
    var connection = conn || pool;
    connection.query(query, params, (err, result) => {
      resolve({
        err: err,
        result: result,
        insertId: result ? result.insertId : null
      });
    });
  });
};

module.exports.runSqlQueryAsyncUpdate = function(query, params, conn) {
  /*
  conn: optional
    Pass a mysql connection to be used instead of using a connection from the pool.
    This is required when a specific connection object is required, such as in a
    transaction.
  */
  return new Promise((resolve, reject) => {
    var connection = conn || pool;
    connection.query(query, params, (err, result) => {
      resolve({ err: err, result: result });
    });
  });
};
