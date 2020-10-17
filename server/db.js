const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname + "/.env") });

const mysql = require("mysql");

var pool;

if (process.env.CV_SITE == "local") {
  pool = mysql.createPool({
    connectionLimit: 80,
    host: "localhost",
    port: "3306",
    user: "root",
    password: "ek19go3n",
    database: "test_codevidhya"
  });
} else if (process.env.CV_SITE == "main") {
  pool = mysql.createPool({
    connectionLimit: 50,
    host: "codevidhya.c4xzkxt5owyy.ap-south-1.rds.amazonaws.com",
    port: "3306",
    user: "admin",
    password: "ek19go3n",
    database: "codevidhya"
  });
} else if (process.env.CV_SITE == "test") {
  pool = mysql.createPool({
    connectionLimit: 50,
    host: "localhost",
    port: "3306",
    user: "root",
    password: "ek19go3n",
    database: "codevidhya"
  });
}
module.exports.pool = pool;

module.exports.getConnection = function() {
  return new Promise((resolve, reject) => {
    module.exports.pool.getConnection(function(err, conn) {
      if (err) reject("failed_to_get_db_connection");
      else resolve(conn);
    });
  });
};

/* module.exports.mysql = {
  host: "localhost",
  user: "root",
  password: "ek19go3n",
  database: "new_codevidhya",
  port: "3306"
};*/
