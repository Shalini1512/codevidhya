var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
var $sql = require('../sqlMap');
var multer = require('multer');
var fs = require('fs-extra');
var rimraf = require('rimraf')
//var csv = require('csv-parse');
var csvtojson = require("csvtojson");
var childProcess = require("child_process");
router.post('/test',(req, res) => {
  0
});