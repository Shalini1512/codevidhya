const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname + "/.env") });

const auth = require("./api/auth.js");
const userApi = require("./api/userApi");
const assessments = require("./api/assessments");
const individualAssessments = require("./api/individualAssessments");
const userProfile = require("./api/userprofile");
const notifications = require("./api/notifications");
const payments = require("./api/payments");
const projects = require("./api/projects.js");
const liveCourses = require("./api/liveCourses.js");
const quickbook = require("./api/quickbook.js");
const reactions = require("./api/reactions.js");
const userTracking = require("./api/user_tracking_route.js");
const country_handle = require("./api/country_handle.js");
const LeadSquareHandShake = require("./api/LeadSquareHanshake.js");
const adminschooldatamanipulation = require("./api/AdminRegisterDataManipulation.js");
const adminadterschooldatamanipulation = require("./api/AdminRegisterDataManipulationForAfterSchool.js");
const express = require("express");
const session = require("express-session");
var redirect = require("express-redirect");
var MySQLStore = require("express-mysql-session")(session);
const bodyParser = require("body-parser");
const getRawBody = require("raw-body");
var contentType = require("content-type");
var router = express.Router();
cluster = require("cluster");
var cors = require("cors");
const app = express();
redirect(app);
require("run-middleware")(app);

const MAIN_PORT_DEFAULT = 3020;
const TEST_PORT_DEFAULT = 3010;
const SESSION_SECRET = "ZX&*@BNh3290BN#h3298H";

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (
    req.originalUrl == "/payments/payment_successful" &&
    (!req.headers.referer ||
      (!~req.headers.referer.indexOf("codevidhya.com") &&
        !~req.headers.referer.indexOf("localhost")))
  ) {
    getRawBody(
      req,
      {
        length: req.headers["content-length"],
        limit: "1mb",
        encoding: contentType.parse(req).parameters.charset,
      },
      function(err, string) {
        if (err) return next(err);
        req.rawBody = string;
        next();
      }
    );
  } else {
    next();
  }
});

var sessionStoreOptions;
if (process.env.CV_SITE == "local") {
  sessionStoreOptions = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "ek19go3n",
    database: "test_codevidhya",
    schema: {
      tableName: "sessions",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data",
      },
    },
  };
} else if (process.env.CV_SITE == "main") {
  sessionStoreOptions = {
    host: "codevidhya.c4xzkxt5owyy.ap-south-1.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "ek19go3n",
    database: "codevidhya",
    schema: {
      tableName: "sessions",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data",
      },
    },
  };
} else if (process.env.CV_SITE == "test") {
  sessionStoreOptions = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "ek19go3n",
    database: "codevidhya",
    schema: {
      tableName: "sessions",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data",
      },
    },
  };
}

var sessionStore = new MySQLStore(sessionStoreOptions);

app.use(
  session({
    secret: SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }, // set to true when on https
  })
);

const paytm_response = require("./api/paytm_route/response.js");
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use("/auth", auth);
app.use("/user", userApi);
app.use("/payments", payments);
app.use("/projects", projects);
app.use("/quickbook", quickbook);
app.use("/reactions", reactions);
app.use("/assessments", assessments);
app.use("/individualAssessments", individualAssessments);
app.use("/profile", userProfile);
app.use("/notifications", notifications);
app.use("/countries", country_handle);
app.use("/userTracking", userTracking);
app.use("/liveCourse", liveCourses);
app.use("/ApiHandshake", LeadSquareHandShake);
app.use("/adminschooldatamanipulation", adminschooldatamanipulation);
app.use("/adminadterschooldatamanipulation", adminadterschooldatamanipulation);
app.use("/paytm_response", paytm_response);
app.use(router);

require("./api/paytm_route/testtxn")(app);
require("./api/paytm_route/pgredirect")(app);

var port = TEST_PORT_DEFAULT;
if (process.env.CV_SITE == "main") {
  port = process.argv[2] || MAIN_PORT_DEFAULT;
} else if (process.env.CV_SITE == "local") {
  port = TEST_PORT_DEFAULT;
} else if (process.env.CV_SITE == "test") {
  port = TEST_PORT_DEFAULT;
}

app.listen(port);

console.log("Server running on port " + port);
