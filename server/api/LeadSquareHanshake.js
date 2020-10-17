var express = require("express");
var router = express.Router();
const path = require("path");
var pathUtils = require("./path-utils");
const jwt = require("jsonwebtoken");
var fs = require("fs-extra");
var mkdirp = require("mkdirp");
var multer = require("multer");
var dateFormat = require("dateformat");
var dbUtils = require("./database-utils");
const appRoot = path.resolve(path.join(__dirname, "../../"));
const pathSeparator = appRoot.indexOf("\\") >= 0 ? "\\" : "/";
/** get LeadSqure Confirmed Data*/
//setInterval(CallLeadSquareConfirmedLead, 60000);
async function CallLeadSquareConfirmedLead() {
  console.log("i am LeadSquare function");
  //get LeadSqiare to get Api Data
  //same data as LiveCourse.js  /uploadDemoClassRequests request(Upload Excel Data) method
}
/***End LeadSquare data */
module.exports = router;
