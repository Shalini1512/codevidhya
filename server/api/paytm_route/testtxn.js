var config = require("../../api/paytm/paytm_config").paytm_config;
var checksum = require("../../api/paytm/checksum");

module.exports = function(app) {
  // var paramarray =require('../../api/payments').paramarray;
  // console.log(paramarray)
  let paramarray = {};
  let newOrderId = 13407;
  paramarray["ORDER_ID"] = newOrderId;
  paramarray["CUST_ID"] = "CUST" + newOrderId;
  paramarray["INDUSTRY_TYPE_ID"] = config.INDUSTRY_TYPE_ID;
  paramarray["CHANNEL_ID"] = config.CHANNEL_ID;
  paramarray["TXN_AMOUNT"] = "100";
  paramarray["MID"] = config.MID;
  paramarray["WEBSITE"] = config.WEBSITE;
  paramarray["PAYTM_MERCHANT_KEY"] = config.PAYTM_MERCHANT_KEY;
  app.get("/testtxn", function(req, res) {
    console.log("in restaurant");
    console.log("--------testtxnjs----");

    res.render("testtxn.ejs", { config: paramarray });
  });

  app.post("/testtxn", function(req, res) {
    console.log("POST Order start");
    var paramlist = req.body;
    // console.log(paramlist);
    var paramarray = new Array();
    // console.log(paramlist);
    for (name in paramlist) {
      if (name == "PAYTM_MERCHANT_KEY") {
        var PAYTM_MERCHANT_KEY = paramlist[name];
      } else {
        paramarray[name] = paramlist[name];
      }
    }
    console.log(paramarray);
    paramarray["CALLBACK_URL"] = "http://localhost:3010/response"; // in case if you want to send callback
    console.log(PAYTM_MERCHANT_KEY);
    checksum.genchecksum(paramarray, PAYTM_MERCHANT_KEY, function(err, result) {
      console.log(result);
      res.render("pgredirect.ejs", { restdata: result });
    });

    console.log("POST Order end");
  });
  //vidisha
};
