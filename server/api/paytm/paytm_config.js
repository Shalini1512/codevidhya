'use strict';

var PAYTM_STAG_URL = 'https://pguat.paytm.com';
var PAYTM_PROD_URL = 'https://secure.paytm.in';
var MID = 'AKbhHF29460355992086';// MID FOR Test'xGwDIh37891812812882' and For 'AKbhHF29460355992086'  PROD;
var PAYTM_ENVIORMENT = 'PROD';//'TEST';   // PROD FOR PRODUCTION anf TEST FOR TEST
var PAYTM_MERCHANT_KEY = 'DjIPNhvWk5PVauR_'; //TEST eudP4RT6Eb9Bkm6j  and PROD  DjIPNhvWk5PVauR_
var WEBSITE = 'DEFAULT';//'WEBSTAGING';//TEST WEBSTAGING and PROD DEFAULT
var CHANNEL_ID =  'WEB';//TEST  WEB and PROD WEB
var INDUSTRY_TYPE_ID = 'Retail';//TEST Retail and PROD Retail
var PAYTM_FINAL_URL = '';//TEST  and PROD 
if (PAYTM_ENVIORMENT== 'TEST') {
  PAYTM_FINAL_URL = 'https://securegw-stage.paytm.in/order/process';
}else{
  PAYTM_FINAL_URL = 'https://securegw.paytm.in/theia/processTransaction';
}
module.exports = {
  paytm_config: {
		MID: MID,
    WEBSITE: WEBSITE,
    PAYTM_FINAL_URL :PAYTM_FINAL_URL,
    CHANNEL_ID: CHANNEL_ID,
    INDUSTRY_TYPE_ID: INDUSTRY_TYPE_ID,
    PAYTM_MERCHANT_KEY : PAYTM_MERCHANT_KEY
	}
}