const express = require("express");
const app = express();
const cors = require("cors");

var corsOptions = {
  origin: "http://localhost:8600",
  optionsSuccessStatus: 200
};
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.static("Codeplay"));
app.use(express.static("dynamic"));
app.use(express.static("resources"));
app.listen(5000);
console.log("File server listening on port 5000");
