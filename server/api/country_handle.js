var express = require("express");
var router = express.Router();

const path = require("path");
var pathUtils = require("./path-utils");
const jwt = require("jsonwebtoken");
var fs = require("fs-extra");
var mkdirp = require("mkdirp");
const yourhandle= require('countrycitystatejson')

/*******admin logs tracking */
/**********Overall Tracking */
router.post("/get_all_country",(req,res) =>{
  let data = yourhandle.getCountries();
  res.send(data);
});
router.post("/get_all_state",(req,res)=>{
  let params = req.body;
  let data = yourhandle.getStatesByShort(params.shortname);
  res.send(data);
});
router.post("/get_all_cities",(req,res) =>{
  let params =req.body;
  let data =yourhandle.getCities(params.shortname, params.state);
  res.send(data);
});
module.exports = router;
