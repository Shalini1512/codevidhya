var express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
var router = express.Router();
let pdf = require("html-pdf");
let path = require("path");
var fs = require("fs");
const payUKey = "9ksPI4KL";
const payUSalt = "fpa0csfwMg";

const mg = require("mailgun-js");
const DOMAIN = "mail.codevidhya.com";
const api = "48d7da66096f4492f4534a1b87fe3fd7-73ae490d-24d26f4f";
const mailgun = mg({ apiKey: api, domain: DOMAIN });
/****Paypal SDK */
var paypal = require("paypal-rest-sdk");
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AQPGHm8qwpD-Us_YY0Nz2SpT3MN6pPCSwaa2MLNtlWMS2SRkUf5jwA5csSXoVgFPl721gOGLCLt5iNQZ", // live "ATEfcMABkHaTHu57mlCkm_x5EQIYo5aO0XKXRMojCmrgTemIGa_MILgPHuhDrbBYAtKV58LGvDmwyKpX",//"AQPGHm8qwpD-Us_YY0Nz2SpT3MN6pPCSwaa2MLNtlWMS2SRkUf5jwA5csSXoVgFPl721gOGLCLt5iNQZ oe sandbox: AQPGHm8qwpD-Us_YY0Nz2SpT3MN6pPCSwaa2MLNtlWMS2SRkUf5jwA5csSXoVgFPl721gOGLCLt5iNQZ", // please provide your client id here
  client_secret:
    "EAjxXg7dZTXpnEPbYP-trso1uebC8oXKOvQ6O91zVeiXbPMzSuaEbdPO1ZoPnhvPw1_DkiCBACRnezgB", //live :"EIy7zcDS75eebXqk03xGX-ilVQfheUfTSdw78GTlfRyT8qq8rpgaKtK8IYaPZHppjJ8MfmObq7WlJAyd"//"EAjxXg7dZTXpnEPbYP-trso1uebC8oXKOvQ6O91zVeiXbPMzSuaEbdPO1ZoPnhvPw1_DkiCBACRnezgB or sandbox: EAjxXg7dZTXpnEPbYP-trso1uebC8oXKOvQ6O91zVeiXbPMzSuaEbdPO1ZoPnhvPw1_DkiCBACRnezgB", // provide your client secret here
});
/***END Paypal SDk */
var db = require("../db");
var pool = db.pool;

function runSqlQueryAsyncSelect(query, params) {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, result) => {
      resolve({ err: err, result: result });
    });
  });
}

function runSqlQueryAsyncInsert(query, params) {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, result) => {
      resolve({
        err: err,
        result: result,
        insertId: result ? result.insertId : null,
      });
    });
  });
}

function runSqlQueryAsyncUpdate(query, params) {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, result) => {
      resolve({ err: err, result: result });
    });
  });
}

function getPayURequestHash(data) {
  //hashSequence = key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt;
  var hashSequence = String(
    payUKey +
      "|" +
      data.order_id +
      "|" +
      data.amount +
      "|" +
      data.product_info +
      "|" +
      data.first_name +
      "|" +
      data.email +
      "|||||||||||" +
      payUSalt
  );
  var hash = crypto.createHash("sha512");
  hash.update(hashSequence);
  return hash.digest("hex");
}
function getPayUResponseHash(data) {
  var hashSequence = String(
    payUSalt +
      "|" +
      data.status +
      "||||||" +
      data.udf5 +
      "|" +
      data.udf4 +
      "|" +
      data.udf3 +
      "|" +
      data.udf2 +
      "|" +
      data.udf1 +
      "|" +
      data.email +
      "|" +
      data.firstname +
      "|" +
      data.productinfo +
      "|" +
      data.amount +
      "|" +
      data.txnid +
      "|" +
      payUKey
  );
  var hash = crypto.createHash("sha512");
  hash.update(hashSequence);
  return hash.digest("hex");
}
router.get("/test_hash", (req, res) => {
  console.log(
    getPayUResponseHash({
      status: "success",
      udf5: "",
      udf4: "",
      udf3: "",
      udf2: "",
      udf1: "",
      email: "sharadbhatara@gmail.com",
      firstname: "Demo",
      productinfo: "HTML2",
      amount: "1.00",
      txnid: "12790",
    })
  );
  res.send(
    getPayUResponseHash({
      status: "success",
      udf5: "",
      udf4: "",
      udf3: "",
      udf2: "",
      udf1: "",
      email: "sharadbhatara@gmail.com",
      firstname: "Demo",
      productinfo: "HTML2",
      amount: "1.00",
      txnid: "12790",
    })
  );
});

async function generateOrder(
  userId,
  productId,
  price,
  email,
  phone,
  coupon_id,
  currencyValue = "INR"
) {
  var lastOrderId = 0;
  var newOrderId = 0;

  var conn;

  return db.getConnection().then((connection) => {
    conn = connection;
    return new Promise(function(resolve, reject) {
      conn.beginTransaction(function(err) {
        if (err) {
          conn.release();
          throw err;
        }
        conn.query(
          "select order_id from orders order by order_id desc limit 1",
          function(err, data) {
            if (err) {
              return conn.rollback(function() {
                conn.release();
                throw err;
              });
            } else {
              if (!data.length) {
                lastOrderId = 12789;
              } else {
                lastOrderId = data[0].order_id;
              }
              newOrderId = lastOrderId + 1;

              /*pool.query("select count(*) from orders where user_id=? and product_id=? and price=?",[userId,productId,price],function(err,data){
                 if(!err)
                 {
                     if(!data)
                     {*/
              conn.query(
                "insert into orders (`product_id`, `user_id`, `order_id`, `price`,`currency_type`,`email`,`contact_no`,`coupon_id`) values(?,?,?,?,?,?,?,?) ",
                [
                  productId,
                  userId,
                  newOrderId,
                  price,
                  currencyValue,
                  email,
                  phone,
                  coupon_id,
                ],
                function(err, data) {
                  if (err) {
                  } else {
                    conn.commit(function(err) {
                      if (err) {
                        return conn.rollback(function() {
                          conn.release();
                          throw err;
                        });
                      } else {
                        conn.release();
                        resolve(newOrderId);
                      }
                    });
                  }
                }
              );
            }
          }
        );
      });
    });
  });
}

async function getProductInfo(productId, couponId, currencyValue = "INR") {
  return new Promise(function(resolve, reject) {
    pool.query(
      // "select product_type from products where product_id=? ",
      // [productId],
      "select product_type,(SELECT discount from cv_coupons where coupon_id =? )'discount' from products  where product_id=?",
      [couponId, productId],
      function(err, data) {
        //  console.log(err);
        if (!err) {
          //console.log('data is here');
          //console.log(data);
          let productType = data[0].product_type;
          let discount = data[0].discount;
          if (!discount) {
            discount = 0;
          }

          switch (productType) {
            case "quiz":
              {
                // query quiz
                pool.query(
                  "select * from quiz where product_id=?",
                  [productId],
                  function(err, data1) {
                    if (!err) {
                      resolve({
                        name: data1[0].quiz_name,
                        desc: data1[0].quiz_name,
                        price: parseFloat(
                          data1[0].price - (data1[0].price * discount) / 100
                        ).toFixed(2),
                      });
                    }
                  }
                );
              }
              break;
            case "live_course":
              {
                pool.query(
                  "SELECT * FROM `live_courses` WHERE product_id=?",
                  [productId],
                  function(err, data1) {
                    if (!err) {
                      console.log();
                      resolve({
                        name: data1[0].live_course_name,
                        desc: data1[0].live_course_outcomes,
                        price:
                          currencyValue == "INR"
                            ? parseFloat(
                                data1[0].course_price -
                                  (data1[0].course_price * data[0].discount) /
                                    100
                              ).toFixed(2)
                            : parseFloat(
                                data1[0].int_course_price -
                                  (data1[0].int_course_price *
                                    data[0].discount) /
                                    100
                              ).toFixed(2),
                      });
                    }
                  }
                );
              }
              break;
            case "byte_size_course":
              {
                pool.query(
                  "SELECT * FROM `byte_size_courses` WHERE product_id=?",
                  [productId],
                  function(err, data1) {
                    if (!err) {
                      console.log();
                      resolve({
                        name: data1[0].byte_course_name,
                        desc: data1[0].byte_course_outcomes,
                        price: parseFloat(
                          data1[0].course_price -
                            (data1[0].course_price * data[0].discount) / 100
                        ).toFixed(2),
                      });
                    }
                  }
                );
              }
              break;
            case "course":
              {
                //books query
                pool.query(
                  "SELECT * FROM `books` where product_id=?",
                  [productId],
                  function(err, data1) {
                    if (!err) {
                      resolve({
                        name: data1[0].book_name,
                        desc: data1[0].course_description,
                        price: parseFloat(
                          data1[0].price -
                            (data1[0].price * data[0].discount) / 100
                        ).toFixed(2),
                      });
                    }
                  }
                );
              }
              break;
          }
        }
      }
    );
  });
}

router.get("/test_mail", (req, res) => {
  let BillTo = {
    name: "John Doe",
    email: "John@gmail.com",
    address: "street 4",
    city: "Delhi",
    state: "Delhi",
    phone: "+91-2345678978",
  };
  let Invoice = {
    id: "1234",
    date: "20 January 2020",
  };
  let Payment = {
    amountDue: 10000,
    booksDiscount: 5,
    totalAmount: 1000,
    discount: 100,
    couponDiscount: 10,
    tax: 0,
    grandtotal: 10000,
  };
  let Products = [
    {
      name: "Proudct 123",
      type: "product type dummy",
      qty: "1",
      unitPrice: "1000",
      price: "10000",
    },
  ];
  // console.log(paymentInfo);
  //console.log("i am here payment success");
  //  ejs.renderFile(path.join(__dirname, './views/', "invoice.ejs"), {BillTo: BillTo,Payment:Payment,Products:Products,Invoice:Invoice}, (err, data) =>{
  res.render(
    "invoice",
    { BillTo: BillTo, Payment: Payment, Products: Products, Invoice: Invoice },
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        //res.send(data);
        let options = {
          format: "A4",
          orientation: "portrait",
          header: {
            height: "5mm",
          },
          footer: {
            height: "5mm",
          },
        };
        let pdffile = "./invoices/" + Invoice.id + ".pdf";
        console.log(pdffile);
        pdf.create(data, options).toFile(pdffile, function(err, data) {
          if (err) {
            res.send(err);
            console.log("here", err);
          } else {
            console.log("filecreated");
            console.log(pdffile);
            // res.send("File created successfully");
          }
        });
      }
    }
  );
  res.end();
});

function sendTestMail() {
  const data = {
    from: "Codevidhya <contact@codevidhya.com>",
    to: "sharadbhatara@gmail.com",
    subject: "Codevidhya- Thanks For Choosing Codevidhya",
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
     <head> 
      <meta charset="UTF-8"> 
      <meta content="width=device-width, initial-scale=1" name="viewport"> 
      <meta name="x-apple-disable-message-reformatting"> 
      <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
      <meta content="telephone=no" name="format-detection"> 
      <title>Email Temp</title> 
      <!--[if (mso 16)]>
        <style type="text/css">
        a {text-decoration: none;}
        </style>
        <![endif]--> 
      <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> 
      <style type="text/css">
    @media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:30px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:20px!important; display:block!important; border-width:10px 0px 10px 0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .adapt-img-small { width:70%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
    #outlook a {
      padding:0;
    }
    .ExternalClass {
      width:100%;
    }
    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
      line-height:100%;
    }
    .es-button {
      mso-style-priority:100!important;
      text-decoration:none!important;
    }
    a[x-apple-data-detectors] {
      color:inherit!important;
      text-decoration:none!important;
      font-size:inherit!important;
      font-family:inherit!important;
      font-weight:inherit!important;
      line-height:inherit!important;
    }
    .es-desk-hidden {
      display:none;
      float:left;
      overflow:hidden;
      width:0;
      max-height:0;
      line-height:0;
      mso-hide:all;
    }
    </style> 
     </head> 
     <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;"> 
      <div class="es-wrapper-color" style="background-color:#F6F6F6;"> 
       <!--[if gte mso 9]>
          <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
            <v:fill type="tile" color="#f6f6f6"></v:fill>
          </v:background>
        <![endif]--> 
       <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;"> 
         <tr style="border-collapse:collapse;"> 
          <td valign="top" style="padding:0;Margin:0;"> 
           <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> 
             <tr style="border-collapse:collapse;"> 
              <td align="center" style="padding:0;Margin:0;"> 
               <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;"> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                   <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> 
                       <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="center" style="padding:0;Margin:0;"><img class="adapt-img" src="https://codevidhya.com/socialshare/congratulation_mail/50811579249387962.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="560"></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                       
                         <tr style="border-collapse:collapse;"> 
                            <td align="center" class="esd-block-text">
                                <h3 style="font-size: 31px;">Thanks for choosing Codevidhya.</h3>
                            </td>
                        
                         </tr> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="left" style="padding:0;Margin:0;padding-left:40px;padding-right:40px;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">Welcome to World of Digital Learning and Innovation, now you have access to all the core functionality you need to explore course name by logging in at www.codevidhya.com, including Course Content, Quizzes, Projects &amp; Online Support.</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p></td> 
                         </tr> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="center" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><strong>Here are a few resources to help you better explore Digital World</strong></p></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                   <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="193.33333333333334" valign="top"><![endif]--> 
                   <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="173.33333333333334" class="es-m-p0r es-m-p20b" align="center" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="left" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p></td> 
                         </tr> 
                       </table></td> 
                      <td class="es-hidden" width="20" style="padding:0;Margin:0;"></td> 
                     </tr> 
                   </table> 
                   <!--[if mso]></td><td width="173.33333333333334" valign="top"><![endif]--> 
                   <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="173.33333333333334" class="es-m-p20b" align="center" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="center" style="padding:0;Margin:0;"><img class="adapt-img-small" src="https://codevidhya.com/socialshare/congratulation_mail/40251579249857578.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="173"></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table> 
                   <!--[if mso]></td><td width="20"></td><td width="173.33333333333334" valign="top"><![endif]--> 
                   <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="173.33333333333334" align="center" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="left" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table> 
                   <!--[if mso]></td></tr></table><![endif]--></td> 
                 </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="center" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:17px;color:#333333;"><strong>Create Projects</strong></p></td> 
                         </tr> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="left" style="padding:0;Margin:0;padding-left:40px;padding-right:40px;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:17px;color:#333333;">A pla<span style="font-family:verdana, geneva, sans-serif;"></span>tform for you to create their Web Projects and enhance your learning by building Real World Projects with HTML, CSS &amp; JavaScript skill.</p></td> 
                         </tr> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="center" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:17px;color:#333333;"><br></p></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                   <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="194" valign="top"><![endif]--> 
                   <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="174" class="es-m-p0r es-m-p20b" align="center" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="left" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p></td> 
                         </tr> 
                       </table></td> 
                      <td class="es-hidden" width="20" style="padding:0;Margin:0;"></td> 
                     </tr> 
                   </table> 
                   <!--[if mso]></td><td width="173" valign="top"><![endif]--> 
                   <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="173" class="es-m-p20b" align="center" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="center" style="padding:0;Margin:0;"><img class="adapt-img-small" src="https://codevidhya.com/socialshare/congratulation_mail/47611579249857608.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="173"></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table> 
                   <!--[if mso]></td><td width="20"></td><td width="173" valign="top"><![endif]--> 
                   <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="173" align="center" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="left" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table> 
                   <!--[if mso]></td></tr></table><![endif]--></td> 
                 </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="center" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><strong>Challenge Yourself</strong></p></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                   <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="194" valign="top"><![endif]--> 
                   <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="174" class="es-m-p0r es-m-p20b" align="center" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="left" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p></td> 
                         </tr> 
                       </table></td> 
                      <td class="es-hidden" width="20" style="padding:0;Margin:0;"></td> 
                     </tr> 
                   </table> 
                   <!--[if mso]></td><td width="173" valign="top"><![endif]--> 
                   <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="173" class="es-m-p20b" align="center" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="center" style="padding:0;Margin:0;"><img class="adapt-img-small" src="https://codevidhya.com/socialshare/congratulation_mail/25901579249867955.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="173"></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table> 
                   <!--[if mso]></td><td width="20"></td><td width="173" valign="top"><![endif]--> 
                   <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="173" align="center" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="left" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table> 
                   <!--[if mso]></td></tr></table><![endif]--></td> 
                 </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="left" style="padding:0;Margin:0;padding-left:40px;padding-right:40px;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">Prov<span style="font-family:verdana, geneva, sans-serif;"></span>e your skills by completing quizzes and challenges on the go with courses. We strongly believe the best learning is "Learn by Doing" approach.</p></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="center" style="padding:0;Margin:0;"><img class="adapt-img" src="https://codevidhya.com/socialshare/congratulation_mail/79221579249313822.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="560"></td> 
                         </tr> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="center" style="padding:0;Margin:0;"> 
                           <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                             <tr style="border-collapse:collapse;"> 
                              <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://www.facebook.com/codevidhya/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Facebook" src="https://codevidhya.com/socialshare/congratulation_mail/facebook-circle-colored.png" alt="Fb" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                              <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://twitter.com/codevidhya?lang=en" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Twitter" src="https://codevidhya.com/socialshare/congratulation_mail/twitter-circle-colored.png" alt="Tw" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                              <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://www.instagram.com/codevidhya/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Instagram" src=https://codevidhya.com/socialshare/congratulation_mail/instagram-circle-colored.png" alt="Inst" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                              <td align="center" valign="top" style="padding:0;Margin:0;"><a target="_blank" href="https://www.linkedin.com/company/13221503/admin/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Linkedin" src="https://codevidhya.com/socialshare/congratulation_mail/linkedin-circle-colored.png" alt="In" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                             </tr> 
                           </table></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
               </table></td> 
             </tr> 
           </table></td> 
         </tr> 
       </table> 
      </div>  
     </body>
    </html>
    `,
  };
  return mailgun.messages().send(data);
}

router.get("/hehe", (req, res) => {
  // console.log("hahahah");
  res.send("heheheheh");
});
//payment router details
/*******Paypal paytm gateway */
router.post("/all_paypalproduct_beginTransaction", async (req, res) => {
  let params = req.body;
  var productInfo = null;

  return await getProductInfo(params.product_id, params.coupon_id, "USD")
    .then((productInf) => {
      productInfo = productInf;
    })
    .then(() => {
      return generateOrder(
        params.user_id,
        params.product_id,
        productInfo.price,
        params.email,
        params.phone,
        params.coupon_id,
        "USD"
      );
    })
    .then(async (newOrderId) => {
      var payment = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: `http://localhost:3010/payments/paypal_success?user_id=${params.user_id}&product_id=${params.product_id}&order_id=${newOrderId}`,
          cancel_url: `http://localhost:3010/payments/paypal_err?user_id=${params.user_id}&product_id=${params.product_id}&order_id=${newOrderId}`,
        },
        transactions: [
          {
            item_list: {
              items: [
                {
                  name: params.product_name,
                  sku: params.prod_info + "",
                  price: productInfo.price,
                  currency: "USD",
                  quantity: 1,
                },
              ],
            },
            amount: {
              total: productInfo.price,
              currency: "USD",
            },
            description: params.prod_info,
          },
        ],
      };
      createPay(payment)
        .then((transaction) => {
          var id = transaction.id;
          var links = transaction.links;
          var counter = links.length;
          while (counter--) {
            if (links[counter].method == "REDIRECT") {
              return res.send(
                JSON.stringify({
                  transaction_data: {
                    redirect: links[counter].href,
                    id: newOrderId,
                    amount: productInfo.price,
                    first_name: params.full_name.split(" ")[0],
                    email: params.email,
                    phone: params.phone,
                    product_info: params.prod_info, //productInfo.name
                  },
                })
              );
            }
          }
        })
        .catch((err) => {
          return res.redirect("/err");
        });
    });
});
/****Paypal request */
let response, order_id, someinfo;
router.get("/paypal_success", async (req, res) => {
  var paramlist = req.query,
    someInfo;
  order_id = paramlist.order_id;
  let query = `select cv_users.name,cv_users.email,cv_users.contact,cv_users.role_id,cv_users.address,cv_users.state,cv_users.city,products.product_id,(case WHEN products.product_type='quiz' THEN quiz.price when products.product_type='live_course' then live_courses.course_price ELSE books.price end) 'product_price',(case WHEN products.product_type='quiz' THEN quiz.quiz_name when products.product_type='live_course' then live_courses.live_course_name ELSE books.book_name end) 'product_name',(case WHEN products.product_type='quiz' THEN quiz.sub_id else '' END) 'quiz_sub_id',(case WHEN products.product_type='quiz' THEN quiz.quiz_id when products.product_type='live_course' then live_courses.product_id ELSE books.slug end)'product_slug',live_courses.live_course_slug 'live_course_slug',(case when products.product_type='quiz' then '' WHEN products.product_type='live_course' then '' else books_price.actual_price end) 'actual_price',(case when products.product_type='quiz' then '' WHEN products.product_type='live_course' then live_courses.int_course_price else books_price.discount end) 'actual_discount',(case when products.product_type='quiz' then '' WHEN products.product_type='live_course' then '' else books_price.dis_price end) 'actual_dis_price',cv_coupons.coupon_id,cv_coupons.coupon_code,cv_coupons.discount 'discount',products.product_type  from orders inner join cv_users on (cv_users.user_id =orders.user_id) inner join products on (products.product_id = orders.product_id) left join cv_coupons on (cv_coupons.coupon_id = orders.coupon_id) left join books on (books.product_id = orders.product_id) left join books_price on (books_price.book_id =books.book_id) LEFT join quiz on (quiz.product_id = orders.product_id) left join live_courses on (live_courses.product_id = products.product_id)  where order_id=?`;
  let param = [paramlist.order_id];
  return await runSqlQueryAsyncSelect(query, param)
    .then(async (result) => {
      if (result.err) throw new Error("order_not_found");
      else if (result.result.length && result.result[0].status == 1) {
        throw new Error("order_already_verified");
      } else {
        someInfo = result.result[0];
      }
    })
    .then(async () => {
      query = "update orders set status=1,paymentId=?,mode=? where order_id=?";
      param = [paramlist.paymentId, "", paramlist.order_id];
      return await dbUtils.runSqlQueryAsyncUpdate(query, param);
    })
    .then(async (updateResult) => {
      try {
        console.log("order mail call");
        if (updateResult) {
          query =
            "select cv_users.name,cv_users.email,cv_users.contact,cv_users.role_id,cv_users.address,cv_users.state,cv_users.city,products.product_id,(case WHEN products.product_type='quiz' THEN quiz.price when products.product_type='live_course' then live_courses.int_course_price ELSE books.price end) 'product_price',(case WHEN products.product_type='quiz' THEN quiz.quiz_name when products.product_type='live_course' then live_courses.live_course_name ELSE books.book_name end) 'product_name',(case WHEN products.product_type='quiz' THEN quiz.sub_id else '' END) 'quiz_sub_id',(case WHEN products.product_type='quiz' THEN quiz.quiz_id when products.product_type='live_course' then live_courses.product_id ELSE books.slug end)'product_slug',(case when products.product_type='quiz' then '' WHEN products.product_type='live_course' then '' else books_price.actual_price end) 'actual_price',(case when products.product_type='quiz' then '' WHEN products.product_type='live_course' then '' else books_price.discount end) 'actual_discount',(case when products.product_type='quiz' then '' WHEN products.product_type='live_course' then '' else books_price.dis_price end) 'actual_dis_price',cv_coupons.coupon_id,cv_coupons.coupon_code,cv_coupons.discount 'discount',products.product_type  from orders inner join cv_users on (cv_users.user_id =orders.user_id) inner join products on (products.product_id = orders.product_id) left join cv_coupons on (cv_coupons.coupon_id = orders.coupon_id) left join books on (books.product_id = orders.product_id) left join books_price on (books_price.book_id =books.book_id) LEFT join quiz on (quiz.product_id = orders.product_id) left join live_courses on (live_courses.product_id = products.product_id)  where orders.status=1 and  order_id=?";
          param = [paramlist.order_id];
          return await dbUtils
            .runSqlQueryAsyncSelect(query, param)
            .then(async (result3) => {
              if (result3) {
                someInfo = result3.result[0];
                let BillTo = {
                  name: result3.result[0].name,
                  email: result3.result[0].email,
                  address: result3.result[0].address,
                  city: result3.result[0].city,
                  state: result3.result[0].state,
                  phone: result3.result[0].contact,
                };
                let Invoice = {
                  id: paramlist.order_id,
                  date: paramlist.order_id,
                  transcationId: paramlist.paymentId,
                };
                let Payment = {
                  amountDue: result3.result[0].discount
                    ? result3.result[0].product_price *
                      ((100 - result3.result[0].discount) / 100)
                    : result3.result[0].product_price,
                  booksDiscount: result3.result[0].actual_discount
                    ? result3.result[0].actual_price -
                      result3.result[0].actual_dis_price
                    : 0,
                  totalAmount: result3.result[0].actual_price
                    ? result3.result[0].actual_price
                    : result3.result[0].product_price,
                  product_price: result3.result[0].product_price,
                  discount: result3.result[0].discount
                    ? (result3.result[0].discount *
                        result3.result[0].product_price) /
                      100
                    : 0,
                  couponDiscount: result3.result[0].coupon_code
                    ? result3.result[0].coupon_code
                    : 0,
                  tax: "0",
                  grandtotal: result3.result[0].discount
                    ? result3.result[0].product_price *
                      ((100 - result3.result[0].discount) / 100)
                    : result3.result[0].product_price,
                };
                let Products = [
                  {
                    name: someInfo.product_name,
                    type: someInfo.product_type,
                    quantity: "1",
                    unitPrice: result3.result[0].actual_price
                      ? result3.result[0].actual_price
                      : result3.result[0].product_price,
                    amount: result3.result[0].actual_price
                      ? result3.result[0].actual_price
                      : result3.result[0].product_price,
                  },
                ];

                res.render(
                  "invoice_pytm",
                  {
                    BillTo: BillTo,
                    Payment: Payment,
                    Products: Products,
                    Invoice: Invoice,
                  },
                  async (err, data) => {
                    if (err) {
                      res.send(err);
                    } else {
                      let options = {
                        format: "A4",
                        orientation: "portrait",
                        header: {
                          height: "5mm",
                        },
                        footer: {
                          height: "5mm",
                        },
                      };
                      pdf
                        .create(data, options)
                        .toBuffer(async function(err, buffer) {
                          console.log("order mail start");

                          await setorderMessage(
                            paramlist.ORDERID,
                            someInfo.name,
                            someInfo.email,
                            someInfo.product_name,
                            someInfo.product_type,
                            paramlist.TXNAMOUNT,
                            someInfo.address,
                            someInfo.city,
                            someInfo.state,
                            someInfo.contact,
                            paramlist.TXNDATE,
                            result3.result[0].product_price,
                            result3.result[0].coupon_code,
                            result3.result[0].discount,
                            new mailgun.Attachment({
                              data: buffer,
                              filename: "invoice.pdf",
                            })
                          );
                        });
                    }
                  }
                );
                /***End Invoice */
                await sendCongratulationMail(
                  someInfo.product_name,
                  someInfo.product_type,
                  someInfo.email
                );
                console.log("congratulation Mail");
                console.log("congratulation Mail");
                await sendAdminMail(
                  paramlist.ORDERID,
                  someInfo.name,
                  someInfo.email,
                  someInfo.product_name,
                  someInfo.product_type,
                  paramlist.TXNAMOUNT,
                  someInfo.address,
                  someInfo.city,
                  someInfo.state,
                  someInfo.contact,
                  paramlist.TXNDATE
                );
                console.log("Admin Mail");
              } else {
                return "";
              }
            });
        } else {
          return "";
        }
      } catch (e) {
        console.log("i am error");
        console.log(e);
      }
    })
    .then(async () => {
      let url;
      if (someInfo.product_type == "course") {
        if (process.env.CV_SITE == "local") {
          url = "http://localhost:8080/courses/" + someInfo.product_slug;
        } else if (process.env.CV_SITE == "test")
          url = "https://test.codevidhya.com/courses/" + someInfo.product_slug;
        else url = "https://codevidhya.com/courses/" + someInfo.product_slug;
        res.redirect(url);
      } else if (someInfo.product_type == "live_course") {
        if (process.env.CV_SITE == "local") {
          url =
            "http://localhost:8080/live-courses-thank-you?id=" +
            someInfo.product_slug +
            "&name=" +
            someInfo.product_name;
        } else if (process.env.CV_SITE == "test") {
          url =
            "http://test.codevidhya.com/live-courses-thank-you?id=" +
            someInfo.product_slug +
            "&name=" +
            someInfo.product_name;
        } else
          url =
            "https://codevidhya.com/live-courses-thank-you?id=" +
            someInfo.product_slug +
            "&name=" +
            someInfo.product_name;
        res.redirect(url);
      }
    });
});
router.get("/paypal_err", (req, res) => {
  console.log(req);
});
/****End Paypal Request */
// helper functions
var createPay = (payment) => {
  return new Promise((resolve, reject) => {
    paypal.payment.create(payment, function(err, payment) {
      if (err) {
        reject(err);
      } else {
        resolve(payment);
      }
    });
  });
};
/****End Paypal paytm gateway */
/****Paytm payment gateway details */
let paramarray = {};
router.post("/all_paytmproduct_beginTransaction", async (req, res) => {
  var paytm_config = await require("./paytm/paytm_config").paytm_config;
  var paytm_checksum = await require("./paytm/checksum");
  const https = await require("https");
  var querystring = await require("querystring");
  let params = req.body;
  var productInfo = null;
  return await getProductInfo(params.product_id, params.coupon_id)
    .then(async (productInf) => {
      console.log(productInf);
      productInfo = productInf;
    })
    .then(async () => {
      return await generateOrder(
        params.user_id,
        params.product_id,
        productInfo.price,
        params.email,
        params.phone,
        params.coupon_id
      );
    })
    .then(async (newOrderId) => {
      paramarray["ORDER_ID"] = "" + newOrderId;
      paramarray["CUST_ID"] = "CUST" + newOrderId;
      paramarray["INDUSTRY_TYPE_ID"] = paytm_config.INDUSTRY_TYPE_ID;
      paramarray["CHANNEL_ID"] = paytm_config.CHANNEL_ID;
      paramarray["TXN_AMOUNT"] = "" + productInfo.price;
      paramarray["MID"] = paytm_config.MID;
      paramarray["WEBSITE"] = paytm_config.WEBSITE;
      paramarray["PAYTM_MERCHANT_KEY"] = paytm_config.PAYTM_MERCHANT_KEY;
      var paramlist = {};
      var PAYTM_MERCHANT_KEY;
      for (name in paramarray) {
        if (name == "PAYTM_MERCHANT_KEY") {
          PAYTM_MERCHANT_KEY = paramarray[name];
        } else {
          paramlist[name] = paramarray[name];
        }
      }
      //paramlist["CALLBACK_URL"] = "http://localhost:3010/response";
      if (process.env.CV_SITE == "local") {
        paramlist["CALLBACK_URL"] =
          "http://localhost:8080/api/paytm_response/response";
      } else if (process.env.CV_SITE == "test") {
        paramlist["CALLBACK_URL"] =
          "https://test.codevidhya.com/api/paytm_response/response";
      } else {
        paramlist["CALLBACK_URL"] =
          "https://codevidhya.com/api/paytm_response/response";
      }
      console.log(PAYTM_MERCHANT_KEY);
      let resultdata;
      await paytm_checksum.genchecksum(
        paramlist,
        PAYTM_MERCHANT_KEY,
        async function(err, result) {
          resultdata = await result;
          console.log(result);

          res.send(
            JSON.stringify({
              transaction_data: {
                checksum: result,
              },
            })
          );
        }
      );
    });
});

router.get("/paytm_response", (req, res) => {
  console.log("i am here");
  res.render("testtxn.ejs", { config: paramarray });
});

/***End paytm gateway details */

router.post("/all_product_beginTransaction", (req, res) => {
  let params = req.body;

  var productInfo = null;
  return getProductInfo(params.product_id, params.coupon_id)
    .then((productInf) => {
      console.log(productInf);
      productInfo = productInf;
    })
    .then(() => {
      return generateOrder(
        params.user_id,
        params.product_id,
        productInfo.price,
        params.email,
        params.phone,
        params.coupon_id
      );
    })
    .then((newOrderId) => {
      var requestHash = getPayURequestHash({
        order_id: newOrderId,
        amount: productInfo.price,
        product_info: params.prod_info, //productInfo.name,
        first_name: params.full_name.split(" ")[0],
        email: params.email,
      });

      res.send(
        JSON.stringify({
          transaction_data: {
            key: payUKey,
            id: newOrderId,
            hash: requestHash,
            amount: productInfo.price,
            first_name: params.full_name.split(" ")[0],
            email: params.email,
            phone: params.phone,
            product_info: params.prod_info, //productInfo.name
          },
        })
      );
    });
});
//end payment details
router.post("/beginTransaction", (req, res) => {
  let params = req.body;
  var productInfo = null;
  return getProductInfo(params.product_id)
    .then((productInf) => {
      productInfo = productInf;
    })
    .then(() => {
      return generateOrder(
        params.user_id,
        params.product_id,
        productInfo.price,
        params.email,
        params.phone
      );
    })
    .then((newOrderId) => {
      var requestHash = getPayURequestHash({
        order_id: newOrderId,
        amount: productInfo.price,
        product_info: productInfo.name,
        first_name: params.full_name.split(" ")[0],
        email: params.email,
      });

      res.send(
        JSON.stringify({
          transaction_data: {
            key: payUKey,
            id: newOrderId,
            hash: requestHash,
            amount: productInfo.price,
            first_name: params.full_name.split(" ")[0],
            email: params.email,
            phone: params.phone,
            product_info: productInfo.name,
          },
        })
      );
    });
});

function sendCongratulationMail(product_name, type, email) {
  //console.log("after scm class");
  //console.log(product_name+' '+type+' '+email);
  const data = {
    from: "Codevidhya <contact@codevidhya.com>",
    to: email,
    subject: "Codevidhya- Thanks For Choosing Codevidhya",
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
     <head> 
      <meta charset="UTF-8"> 
      <meta content="width=device-width, initial-scale=1" name="viewport"> 
      <meta name="x-apple-disable-message-reformatting"> 
      <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
      <meta content="telephone=no" name="format-detection"> 
      <title>Email Temp</title> 
      <!--[if (mso 16)]>
        <style type="text/css">
        a {text-decoration: none;}
        </style>
        <![endif]--> 
      <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> 
      <style type="text/css">
    @media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:30px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:20px!important; display:block!important; border-width:10px 0px 10px 0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .adapt-img-small { width:70%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
    #outlook a {
      padding:0;
    }
    .ExternalClass {
      width:100%;
    }
    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
      line-height:100%;
    }
    .es-button {
      mso-style-priority:100!important;
      text-decoration:none!important;
    }
    a[x-apple-data-detectors] {
      color:inherit!important;
      text-decoration:none!important;
      font-size:inherit!important;
      font-family:inherit!important;
      font-weight:inherit!important;
      line-height:inherit!important;
    }
    .es-desk-hidden {
      display:none;
      float:left;
      overflow:hidden;
      width:0;
      max-height:0;
      line-height:0;
      mso-hide:all;
    }
    </style> 
     </head> 
     <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;"> 
      <div class="es-wrapper-color" style="background-color:#F6F6F6;"> 
       <!--[if gte mso 9]>
          <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
            <v:fill type="tile" color="#f6f6f6"></v:fill>
          </v:background>
        <![endif]--> 
       <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;"> 
         <tr style="border-collapse:collapse;"> 
          <td valign="top" style="padding:0;Margin:0;"> 
           <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> 
             <tr style="border-collapse:collapse;"> 
              <td align="center" style="padding:0;Margin:0;"> 
               <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;"> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                   <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> 
                       <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="center" style="padding:0;Margin:0;"><img class="adapt-img" src="https://codevidhya.com/socialshare/congratulation_mail/50811579249387962.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="560"></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                       
                         <tr style="border-collapse:collapse;"> 
                            <td align="center" class="esd-block-text">
                                <h3 style="font-size: 31px;">Thanks for choosing Codevidhya.</h3>
                            </td>
                        
                         </tr> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="left" style="padding:0;Margin:0;padding-left:40px;padding-right:40px;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">Welcome to World of Digital Learning and Innovation, now you have access to all the core functionality you need to explore course ${product_name} by logging in at www.codevidhya.com, including Course Content, Quizzes, Projects &amp; Online Support.</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p></td> 
                         </tr> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="center" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><strong>Here are a few resources to help you better explore Digital World</strong></p></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                   <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="193.33333333333334" valign="top"><![endif]--> 
                   <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="173.33333333333334" class="es-m-p0r es-m-p20b" align="center" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="left" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p></td> 
                         </tr> 
                       </table></td> 
                      <td class="es-hidden" width="20" style="padding:0;Margin:0;"></td> 
                     </tr> 
                   </table> 
                   <!--[if mso]></td><td width="173.33333333333334" valign="top"><![endif]--> 
                   <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="173.33333333333334" class="es-m-p20b" align="center" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="center" style="padding:0;Margin:0;"><img class="adapt-img-small" src="https://codevidhya.com/socialshare/congratulation_mail/40251579249857578.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="173"></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table> 
                   <!--[if mso]></td><td width="20"></td><td width="173.33333333333334" valign="top"><![endif]--> 
                   <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="173.33333333333334" align="center" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="left" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table> 
                   <!--[if mso]></td></tr></table><![endif]--></td> 
                 </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="center" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:17px;color:#333333;"><strong>Create Projects</strong></p></td> 
                         </tr> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="left" style="padding:0;Margin:0;padding-left:40px;padding-right:40px;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:17px;color:#333333;">A pla<span style="font-family:verdana, geneva, sans-serif;"></span>tform for you to create their Web Projects and enhance your learning by building Real World Projects with HTML, CSS &amp; JavaScript skill.</p></td> 
                         </tr> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="center" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:17px;color:#333333;"><br></p></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                   <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="194" valign="top"><![endif]--> 
                   <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="174" class="es-m-p0r es-m-p20b" align="center" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="left" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p></td> 
                         </tr> 
                       </table></td> 
                      <td class="es-hidden" width="20" style="padding:0;Margin:0;"></td> 
                     </tr> 
                   </table> 
                   <!--[if mso]></td><td width="173" valign="top"><![endif]--> 
                   <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="173" class="es-m-p20b" align="center" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="center" style="padding:0;Margin:0;"><img class="adapt-img-small" src="https://codevidhya.com/socialshare/congratulation_mail/47611579249857608.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="173"></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table> 
                   <!--[if mso]></td><td width="20"></td><td width="173" valign="top"><![endif]--> 
                   <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="173" align="center" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="left" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table> 
                   <!--[if mso]></td></tr></table><![endif]--></td> 
                 </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="center" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><strong>Challenge Yourself</strong></p></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                   <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="194" valign="top"><![endif]--> 
                   <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="174" class="es-m-p0r es-m-p20b" align="center" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="left" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p></td> 
                         </tr> 
                       </table></td> 
                      <td class="es-hidden" width="20" style="padding:0;Margin:0;"></td> 
                     </tr> 
                   </table> 
                   <!--[if mso]></td><td width="173" valign="top"><![endif]--> 
                   <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="173" class="es-m-p20b" align="center" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="center" style="padding:0;Margin:0;"><img class="adapt-img-small" src="https://codevidhya.com/socialshare/congratulation_mail/25901579249867955.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="173"></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table> 
                   <!--[if mso]></td><td width="20"></td><td width="173" valign="top"><![endif]--> 
                   <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="173" align="center" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="left" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;"><br></p></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table> 
                   <!--[if mso]></td></tr></table><![endif]--></td> 
                 </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="left" style="padding:0;Margin:0;padding-left:40px;padding-right:40px;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;">Prov<span style="font-family:verdana, geneva, sans-serif;"></span>e your skills by completing quizzes and challenges on the go with courses. We strongly believe the best learning is "Learn by Doing" approach.</p></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
                 <tr style="border-collapse:collapse;"> 
                  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
                       <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="center" style="padding:0;Margin:0;"><img class="adapt-img" src="https://codevidhya.com/socialshare/congratulation_mail/79221579249313822.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="560"></td> 
                         </tr> 
                         <tr style="border-collapse:collapse;"> 
                          <td align="center" style="padding:0;Margin:0;"> 
                           <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                             <tr style="border-collapse:collapse;"> 
                              <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://www.facebook.com/codevidhya/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Facebook" src="https://codevidhya.com/socialshare/congratulation_mail/facebook-circle-colored.png" alt="Fb" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                              <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://twitter.com/codevidhya?lang=en" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Twitter" src="https://codevidhya.com/socialshare/congratulation_mail/twitter-circle-colored.png" alt="Tw" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                              <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px;"><a target="_blank" href="https://www.instagram.com/codevidhya/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Instagram" src=https://codevidhya.com/socialshare/congratulation_mail/instagram-circle-colored.png" alt="Inst" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                              <td align="center" valign="top" style="padding:0;Margin:0;"><a target="_blank" href="https://www.linkedin.com/company/13221503/admin/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;text-decoration:underline;color:#2CB543;"><img title="Linkedin" src="https://codevidhya.com/socialshare/congratulation_mail/linkedin-circle-colored.png" alt="In" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a></td> 
                             </tr> 
                           </table></td> 
                         </tr> 
                       </table></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
               </table></td> 
             </tr> 
           </table></td> 
         </tr> 
       </table> 
      </div>  
     </body>
    </html>
    `,
  };
  return mailgun.messages().send(data);
}

function setorderMessage(
  orderId,
  name,
  email,
  productName,
  productType,
  price,
  address,
  city,
  state,
  user_contact,
  purachsed_at,
  actual_price,
  coupon_code,
  discount,
  attachmentBuffer
) {
  const data = {
    from: "Codevidhya <contact@codevidhya.com>",
    to: email,
    attachment: attachmentBuffer,
    subject: "Codevidhya - Your order has been received!",
    html: `<!doctype html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        
        <head>
          <title> </title>
          <!--[if !mso]><!-- -->
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <!--<![endif]-->
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style type="text/css">
            #outlook a {
              padding: 0;
            }
        
            .ReadMsgBody {
              width: 100%;
            }
        
            .ExternalClass {
              width: 100%;
            }
        
            .ExternalClass * {
              line-height: 100%;
            }
        
            body {
              margin: 0;
              padding: 0;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
            }
        
            table,
            td {
              border-collapse: collapse;
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
            }
        
            img {
              border: 0;
              height: auto;
              line-height: 100%;
              outline: none;
              text-decoration: none;
              -ms-interpolation-mode: bicubic;
            }
        
            p {
              display: block;
              margin: 13px 0;
            }
          </style>
          <!--[if !mso]><!-->
          <style type="text/css">
            @media only screen and (max-width:480px) {
              @-ms-viewport {
                width: 320px;
              }
              @viewport {
                width: 320px;
              }
            }
          </style>
          <!--<![endif]-->
          <!--[if mso]>
                <xml>
                <o:OfficeDocumentSettings>
                  <o:AllowPNG/>
                  <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
          <!--[if lte mso 11]>
                <style type="text/css">
                  .outlook-group-fix { width:100% !important; }
                </style>
                <![endif]-->
          <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
          <style type="text/css">
            @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
          </style>
          <!--<![endif]-->
          <style type="text/css">
            @media only screen and (min-width:480px) {
              .mj-column-per-85 {
                width: 85% !important;
                max-width: 85%;
              }
            }
          </style>
          <style type="text/css">
            @media only screen and (max-width:480px) {
              table.full-width-mobile {
                width: 100% !important;
              }
              td.full-width-mobile {
                width: auto !important;
              }
            }
          </style>
        </head>
        
        <body style="background-color:#f1f1f1;">
          <div style="background-color:#f1f1f1;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
              <tbody>
                <tr>
                  <td>
                    <!--[if mso | IE]>
              <table
                 align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
              >
                <tr>
                  <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
              <![endif]-->
                    <div style="Margin:0px auto;max-width:600px;">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                        <tbody>
                          <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;text-align:center;vertical-align:top;">
                              <!--[if mso | IE]>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        
                <tr>
              
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                                  <tr>
                                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                        <tbody>
                                          <tr>
                                            <td style="width:180px;"> <img alt="" height="48" src="https://codevidhya.com/socialshare/mail/new-logo-codevidhya2_wgmrmo.png" style="border:0;display:block;outline:none;text-decoration:none;height:48px;width:100%;" width="180" />                                      </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  
                </tr>
              
                          </table>
                        <![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]>
                  </td>
                </tr>
              </table>
              <![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
              <tbody>
                <tr>
                  <td>
                    <!--[if mso | IE]>
              <table
                 align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
              >
                <tr>
                  <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
              <![endif]-->
                    <div style="Margin:0px auto;max-width:600px;">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                        <tbody>
                          <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                              <!--[if mso | IE]>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        
                <tr>
              
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                                  <tr>
                                    <td align="center" style="font-size:0px;padding:3px 3px;word-break:break-word;">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                        <tbody>
                                          <tr>
                                            <td style="width:50px;"> <img height="50" src="https://codevidhya.com/socialshare/mail/verified.jpg" style="border:0;display:block;outline:none;text-decoration:none;height:50px;width:100%;" width="50" /> </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="center" style="font-size:0px;padding:10px 25px;padding-top:10px;padding-bottom:10px;word-break:break-word;">
                                      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:14px;line-height:1;text-align:center;color:#45474e;"> <span style="font-size: 26px; line-height: 30px;">Payment Received</span> </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="center" style="font-size:0px;padding:10px 25px;padding-top:10px;word-break:break-word;">
                                      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:14px;line-height:1;text-align:center;color:#45474e;"> <span style="font-size: 14px; line-height: 20px;">We have received your <span style="font-weight:600;">Rs. ${actual_price}</span> Payment, ${name}.</span>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                      <p style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:85%;"> </p>
                                      <!--[if mso | IE]>
                <table
                   align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:383.5px;" role="presentation" width="383.5px"
                >
                  <tr>
                    <td style="height:0;line-height:0;">
                      &nbsp;
                    </td>
                  </tr>
                </table>
              <![endif]-->
                                    </td>
                                  </tr>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  
                </tr>
              
                          </table>
                        <![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]>
                  </td>
                </tr>
              </table>
              <![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
              <tbody>
                <tr>
                  <td>
                    <!--[if mso | IE]>
              <table
                 align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
              >
                <tr>
                  <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
              <![endif]-->
                    <div style="Margin:0px auto;max-width:600px;">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                        <tbody>
                          <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:0px;text-align:center;vertical-align:top;">
                              <!--[if mso | IE]>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        
                <tr>
              
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                                  <tr>
                                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#888888;">
                                        <p style="margin-right:10px;width:100%;display:flex;"> <span align="left" style="width:50%; min-width:50%; flex-grow:1;">Order Id</span> <span style="font-weight:600;">#${orderId}</span> </p>
                                        <p style="margin-right:10px;width:100%;display:flex;"> <span align="left" style="width:50%; min-width:50%; flex-grow:1;">Product Name</span> <span style="font-weight:600;">${productName}</span> </p>
                                        <p style="margin-right:10px;width:100%;display:flex;"> <span align="left" style="width:50%; min-width:50%; flex-grow:1;">Payment Amount</span> <span style="font-weight:600;">Rs. ${actual_price}</span> </p>
                                        <p style="margin-right:10px;width:100%;display:flex;">
                                        <span align="left" style="width:50%; min-width:50%; flex-grow:1;">Coupon Applied</span> <span style="font-weight:600;">${
                                          coupon_code ? coupon_code : ""
                                        }</span> </p>
                                        <p style="margin-right:10px;width:100%;display:flex;">
                                        <span align="left" style="width:50%; min-width:50%; flex-grow:1;">Coupon Discount</span> <span style="font-weight:600;">(-) Rs. ${(actual_price *
                                          discount) /
                                          100}</span> </p>
                                        <p style="margin-right:10px;width:100%;display:flex;"> <span align="left" style="width:50%; min-width:50%; flex-grow:1;">Paid Online<br>(including all taxes)*</span></span> <span style="font-weight:600;">Rs. ${price}</span> </p>
                                        <p style="margin-right:10px;width:100%;display:flex;"> <span align="left" style="width:50%; min-width:50%; flex-grow:1;">Payment Date</span> <span style="font-weight:600;">${purachsed_at}</span> </p>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  
                </tr>
              
                          </table>
                        <![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]>
                  </td>
                </tr>
              </table>
              <![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
              <tbody>
                <tr>
                  <td>
                    <!--[if mso | IE]>
              <table
                 align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
              >
                <tr>
                  <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
              <![endif]-->
                    <div style="Margin:0px auto;max-width:600px;">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                        <tbody>
                          <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-top:0px;text-align:center;vertical-align:top;">
                              <!--[if mso | IE]>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        
                <tr>
              
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                                  <tr>
                                    <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                      <p style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:85%;"> </p>
                                      <!--[if mso | IE]>
                <table
                   align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:383.5px;" role="presentation" width="383.5px"
                >
                  <tr>
                    <td style="height:0;line-height:0;">
                      &nbsp;
                    </td>
                  </tr>
                </table>
              <![endif]-->
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:center;color:#888888;">
                                        <p style="color: #888;"> Need Assistance? Feel free to reach out at <a href="mailto:contact@codevidhya.com"><span style="color: #555; font-weight:600;text-decoration:none;"> contact@codevidhya.com </span></a> </p>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  
                </tr>
              
                          </table>
                        <![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]>
                  </td>
                </tr>
              </table>
              <![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
              <tbody>
                <tr>
                  <td>
                    <!--[if mso | IE]>
              <table
                 align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
              >
                <tr>
                  <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
              <![endif]-->
                    <div style="Margin:0px auto;max-width:600px;">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                        <tbody>
                          <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:10px;text-align:center;vertical-align:top;">
                              <!--[if mso | IE]>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        
                <tr>
              
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                                  <tr>
                                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:center;color:#000000;">
                                        <p style="color: #888; font-size:13px;line-height:20px;">Codevidhya India Private Limited | <a style="text-decoration:none;" href="https://codevidhya.com" target="_blank">www.codevidhya.com </a><br> We are Social- <a style="text-decoration:none;font-weight:600;" href="https://www.facebook.com/codevidhya"
                                            target="_blank"> Facebook </a>| <a style="text-decoration:none;font-weight:600;" href="https://www.twitter.com/codevidhya" target="_blank"> Twitter</a> | <a style="text-decoration:none;font-weight:600;" href="https://www.instagram.com/codevidhya"
                                            target="_blank"> Instagram </a>| <a style="text-decoration:none;font-weight:600;" href="https://www.linkedin.com/company/codevidhya" target="_blank"> Linkedin  </a></p>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  
                </tr>
              
                          </table>
                        <![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]>
                  </td>
                </tr>
              </table>
              <![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </body>
        
        </html>`,
  };
  return mailgun.messages().send(data);
}

function sentConfirmMail(
  orderId,
  name,
  email,
  productName,
  productType,
  price,
  address,
  city,
  state,
  user_contact,
  purachsed_at
) {
  const data = {
    from: "Codevidhya <contact@codevidhya.com>",
    to: email,
    subject: "Welcome to codevidhya",
    html: `<!doctype html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        
        <head>
          <title> </title>
          <!--[if !mso]><!-- -->
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <!--<![endif]-->
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style type="text/css">
            #outlook a {
              padding: 0;
            }
        
            .ReadMsgBody {
              width: 100%;
            }
        
            .ExternalClass {
              width: 100%;
            }
        
            .ExternalClass * {
              line-height: 100%;
            }
        
            body {
              margin: 0;
              padding: 0;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
            }
        
            table,
            td {
              border-collapse: collapse;
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
            }
        
            img {
              border: 0;
              height: auto;
              line-height: 100%;
              outline: none;
              text-decoration: none;
              -ms-interpolation-mode: bicubic;
            }
        
            p {
              display: block;
              margin: 13px 0;
            }
          </style>
          <!--[if !mso]><!-->
          <style type="text/css">
            @media only screen and (max-width:480px) {
              @-ms-viewport {
                width: 320px;
              }
              @viewport {
                width: 320px;
              }
            }
          </style>
          <!--<![endif]-->
          <!--[if mso]>
                <xml>
                <o:OfficeDocumentSettings>
                  <o:AllowPNG/>
                  <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
          <!--[if lte mso 11]>
                <style type="text/css">
                  .outlook-group-fix { width:100% !important; }
                </style>
                <![endif]-->
          <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
          <style type="text/css">
            @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
          </style>
          <!--<![endif]-->
          <style type="text/css">
            @media only screen and (min-width:480px) {
              .mj-column-per-85 {
                width: 85% !important;
                max-width: 85%;
              }
            }
          </style>
          <style type="text/css">
            @media only screen and (max-width:480px) {
              table.full-width-mobile {
                width: 100% !important;
              }
              td.full-width-mobile {
                width: auto !important;
              }
            }
          </style>
        </head>
        
        <body style="background-color:#f1f1f1;">
          <div style="background-color:#f1f1f1;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#f1f1f1;background-color:#f1f1f1;width:100%;">
              <tbody>
                <tr>
                  <td>
                    <!--[if mso | IE]>
              <table
                 align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
              >
                <tr>
                  <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
              <![endif]-->
                    <div style="Margin:0px auto;max-width:600px;">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                        <tbody>
                          <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                              <!--[if mso | IE]>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        
                <tr>
              
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                  <tbody>
                                    <tr>
                                      <td style="vertical-align:middle;padding:10px 10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                          <tr>
                                            <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                                <tbody>
                                                  <tr>
                                                    <td style="width:180px;"> <img height="48" src="https://codevidhya.com/socialshare/mail/new-logo-codevidhya2_wgmrmo.png" style="border:0;display:block;outline:none;text-decoration:none;height:48px;width:100%;" width="180" />                                              </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  <![endif]-->
                              <!-- row 2 -->
                              <!--[if mso | IE]>
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                  <tbody>
                                    <tr>
                                      <td style="background-color:#ffffff;vertical-align:middle;padding-top:15px;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <h2 align="center" style="color:#2E4053;">Welcome to Codevidhya </h2>
                                                <p align="center" style="color: #888;font-size:14px; line-height:20px;"> Thanks for choosing Codevidhya, ${name}!</p>
                                                <p align="center" style="color: #888; font-size:14px; margin-left:10px; margin-right:10px; line-height:20px;"> Thanks for learning with Codevidhya. You are welcome to explore <b>"${name}"</b>. You can access this course by logging in at <a style="text-decoration:none;" href="https://codevidhya.com" target="_blank"><b style="color:#888">www.codevidhya.com</b></a>,
                                                  including Quizzes, CodePlay and Discussion Forum and more. </p>
                                                <p align="center" style="color: #888; font-size:14px;line-height:20px;">- Codevidhya Team </p>
                                              </div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <p style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:100%;"> </p>
                                              <!--[if mso | IE]>
                <table
                   align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:460px;" role="presentation" width="460px"
                >
                  <tr>
                    <td style="height:0;line-height:0;">
                      &nbsp;
                    </td>
                  </tr>
                </table>
              <![endif]-->
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  <![endif]-->
                              <!-- row 3 -->
                              <!--[if mso | IE]>
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                  <tbody>
                                    <tr>
                                      <td style="background-color:#ffffff;vertical-align:middle;padding-top:5px;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                          <tr>
                                            <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                                <tbody>
                                                  <tr>
                                                    <td style="width:30px;"> <img height="30" src="https://codevidhya.com/socialshare/mail/order_email_img/check.jpg" style="border:0;display:block;outline:none;text-decoration:none;height:30px;width:100%;" width="30" /> </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <h3 align="center" style="color: #555;"> Learn to Code </h3>
                                                <p align="center" style="color: #888; font-size:13px; margin-left:10px; margin-right:10px; line-height:20px;"> Explore Codevidhya courses and start learning to Code in HTML, CSS, JavaScript, Python, Robotics with amazing support from our educators community. </p>
                                              </div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                                <tbody>
                                                  <tr>
                                                    <td style="width:30px;"> <img height="30" src="https://codevidhya.com/socialshare/mail/order_email_img/check.jpg" style="border:0;display:block;outline:none;text-decoration:none;height:30px;width:100%;" width="30" /> </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <h3 align="center" style="color: #555;"> Create Projects </h3>
                                                <p align="center" style="color: #888; font-size:13px; margin-left:10px; margin-right:10px; line-height:20px;"> Enhance your learning by building real-world projects in CodePlay, a dedicated place to learners where they can create their Web Projects by exploring HTML, CSS, JavaScript skills. </p>
                                              </div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                                <tbody>
                                                  <tr>
                                                    <td style="width:30px;"> <img height="30" src="https://codevidhya.com/socialshare/mail/check.jpg" style="border:0;display:block;outline:none;text-decoration:none;height:30px;width:100%;" width="30" /> </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <h3 align="center" style="color: #555;"> Test Yourself </h3>
                                                <p align="center" style="color: #888; font-size:13px; margin-left:10px; margin-right:10px; line-height:20px;"> Prove your skills by completing quizzes and challenges on the go with courses. We strongly believe the best learning in "Learn by Doing" approach. </p>
                                              </div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <p style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:100%;"> </p>
                                              <!--[if mso | IE]>
                <table
                   align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:460px;" role="presentation" width="460px"
                >
                  <tr>
                    <td style="height:0;line-height:0;">
                      &nbsp;
                    </td>
                  </tr>
                </table>
              <![endif]-->
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  <![endif]-->
                              <!-- row 4 -->
                              <!--[if mso | IE]>
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                  <tbody>
                                    <tr>
                                      <td style="background-color:#ffffff;vertical-align:middle;padding-top:0px;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <p align="center" style="color: #888; font-size:14px; line-height:20px; margin-left:10px; margin-right:10px; "> Need Assistance? Feel free to reach out at <a style="color: #555; text-decoration:none;" href="mailto:contact@codevidhya.com"><b> contact@codevidhya.com </b></a> </p>
                                              </div>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  <![endif]-->
                              <!-- row 5 footer -->
                              <!--[if mso | IE]>
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                  <tbody>
                                    <tr>
                                      <td style="vertical-align:middle;padding-top:0px;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <p align="center" style="color: #888; font-size:13px;line-height:20px;">Codevidhya India Private Limited | <a href="https://codevidhya.com" style="text-decoration:none;" target="_blank">www.codevidhya.com </a><br> We are Social- <b>
              <a style="text-decoration:none;"  href="https://www.facebook.com/codevidhya" target="_blank"> Facebook </a>|
              <a style="text-decoration:none;" href="https://www.twitter.com/codevidhya" target="_blank"> Twitter</a> | 
              <a style="text-decoration:none;" href="https://www.instagram.com/codevidhya" target="_blank"> Instagram </a>|
              <a style="text-decoration:none;" href="https://www.linkedin.com/company/codevidhya" target="_blank"> Linkedin </b> </a>
                                                </p>
                                              </div>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  
                </tr>
              
                          </table>
                        <![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]>
                  </td>
                </tr>
              </table>
              <![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </body>
        
        </html>`,
  };
  return mailgun.messages().send(data);
}

function sendAdminMail(
  orderId,
  name,
  email,
  productName,
  productType,
  price,
  address,
  city,
  state,
  user_contact,
  purachsed_at
) {
  const data = {
    from: "Codevidhya <contact@codevidhya.com>",
    to: "contact@codevidhya.com",
    subject: "New Order Received",
    html: `<!doctype html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        
        <head>
          <title> </title>
          <!--[if !mso]><!-- -->
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <!--<![endif]-->
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style type="text/css">
            #outlook a {
              padding: 0;
            }
        
            .ReadMsgBody {
              width: 100%;
            }
        
            .ExternalClass {
              width: 100%;
            }
        
            .ExternalClass * {
              line-height: 100%;
            }
        
            body {
              margin: 0;
              padding: 0;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
            }
        
            table,
            td {
              border-collapse: collapse;
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
            }
        
            img {
              border: 0;
              height: auto;
              line-height: 100%;
              outline: none;
              text-decoration: none;
              -ms-interpolation-mode: bicubic;
            }
        
            p {
              display: block;
              margin: 13px 0;
            }
          </style>
          <!--[if !mso]><!-->
          <style type="text/css">
            @media only screen and (max-width:480px) {
              @-ms-viewport {
                width: 320px;
              }
              @viewport {
                width: 320px;
              }
            }
          </style>
          <!--<![endif]-->
          <!--[if mso]>
                <xml>
                <o:OfficeDocumentSettings>
                  <o:AllowPNG/>
                  <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
          <!--[if lte mso 11]>
                <style type="text/css">
                  .outlook-group-fix { width:100% !important; }
                </style>
                <![endif]-->
          <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
          <style type="text/css">
            @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
          </style>
          <!--<![endif]-->
          <style type="text/css">
            @media only screen and (min-width:480px) {
              .mj-column-per-85 {
                width: 85% !important;
                max-width: 85%;
              }
            }
          </style>
          <style type="text/css">
            @media only screen and (max-width:480px) {
              table.full-width-mobile {
                width: 100% !important;
              }
              td.full-width-mobile {
                width: auto !important;
              }
            }
          </style>
        </head>
        
        <body style="background-color:#f1f1f1;">
          <div style="background-color:#f1f1f1;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#f1f1f1;background-color:#f1f1f1;width:100%;">
              <tbody>
                <tr>
                  <td>
                    <!--[if mso | IE]>
              <table
                 align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
              >
                <tr>
                  <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
              <![endif]-->
                    <div style="Margin:0px auto;max-width:600px;">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                        <tbody>
                          <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                              <!--[if mso | IE]>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        
                <tr>
              
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                  <tbody>
                                    <tr>
                                      <td style="vertical-align:middle;padding:10px 10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                          <tr>
                                            <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                                <tbody>
                                                  <tr>
                                                    <td style="width:180px;"> <img height="48" src="https://codevidhya.com/socialshare/mail/new-logo-codevidhya2_wgmrmo.png" style="border:0;display:block;outline:none;text-decoration:none;height:48px;width:100%;" width="180" />                                              </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  <![endif]-->
                              <!-- row 2 -->
                              <!--[if mso | IE]>
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                  <tbody>
                                    <tr>
                                      <td style="background-color:#ffffff;vertical-align:middle;padding-top:15px;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <h2 align="center" style="color:#2E4053;">New Order Received </h2>
                                                <p align="center" style="color: #888;font-size:14px; line-height:20px;"> You have received a new order from <b>${name}.</b></p>
                                              </div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <p style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:100%;"> </p>
                                              <!--[if mso | IE]>
                <table
                   align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:460px;" role="presentation" width="460px"
                >
                  <tr>
                    <td style="height:0;line-height:0;">
                      &nbsp;
                    </td>
                  </tr>
                </table>
              <![endif]-->
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <p align="center" style="letter-spacing:2"><b>ORDER DETAILS </b></p>
                                              </div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <div style="display:flex;flex-direction:row;"> <span style="color: #888; font-size:13px; flex-grow:1; line-height:30px">Order Id</span> <span align="right" style="color: #555; font-size:13px; line-height:30px;"><b> #${orderId}</b></span> </div>
                                                <div style="display:flex;flex-direction:row;">
                                                <span style="color: #888; font-size:13px; flex-grow:1; line-height:25px;">Product Name</span> <span style="color: #555; font-size:13px;line-height:25px;"><b> ${productName}</b></span> </div>
                                                <div style="display:flex;flex-direction:row;">
                                                <span style="color: #888; font-size:13px; flex-grow:1; line-height:20px;">Payment Amount <br/>(including all taxes)*</span> <span style="color: #555; font-size:13px;line-height:25px;"><b>Rs. ${price}</b></span> </div>
                                                <div style="display:flex;flex-direction:row;"> <span style="color: #888; font-size:13px; flex-grow:1; line-height:20px;">Coupon Discount</span> <span style="color: #555; font-size:13px;line-height:25px;"><b>(-) Rs. 0</b></span> </div>
                                                <div style="display:flex;flex-direction:row;">
                                                <span style="color: #888; font-size:13px; flex-grow:1; line-height:25px;">Paid Online</span> <span style="color: #555; font-size:13px;line-height:25px;"><b>Rs. ${price}</b></span> </div>
                                                <div style="display:flex;flex-direction:row;">
                                                <span style="color: #888; font-size:13px; flex-grow:1; line-height:25px;">Payment Date</span> <span style="color: #555; font-size:13px;line-height:25px;"><b>${purachsed_at}</b></span> </div>
                                                <div style="display:flex;flex-direction:row;">
                                                <span style="color: #888; font-size:13px; flex-grow:1; line-height:25px;">Payment Status</span> <span style="color: #555; font-size:13px;line-height:25px; background:#0077ff;padding:1px 10px; border-radius:3px; color:#fff;"><b>Success</b></span>                                          </div>
                                              </div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <p style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:100%;"> </p>
                                              <!--[if mso | IE]>
                <table
                   align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:460px;" role="presentation" width="460px"
                >
                  <tr>
                    <td style="height:0;line-height:0;">
                      &nbsp;
                    </td>
                  </tr>
                </table>
              <![endif]-->
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <p align="center" style="letter-spacing:2"><b>CUSTOMER DETAILS </b></p>
                                              </div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <div style="display:flex;flex-direction:row;"> <span style="color: #888; font-size:13px; flex-grow:1; line-height:30px">Customer Name</span> <span style="color: #555; font-size:13px; line-height:30px;"><b> ${name}</b></span> </div>
                                                <div style="display:flex;flex-direction:row;">
                                                <span style="color: #888; font-size:13px; flex-grow:1; line-height:25px;">Contact Number</span> <span style="color: #555; font-size:13px;line-height:25px;"><b> ${user_contact}</b></span> </div>
                                                <div style="display:flex;flex-direction:row;">
                                                <span style="color: #888; font-size:13px; flex-grow:1; line-height:20px;">Email Address</span> <span style="color: #555; font-size:13px;line-height:25px;"><b>${email}</b></span> </div>
                                              </div>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  <![endif]-->
                              <!-- row 3 -->
                              <!--[if mso | IE]>
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                  <tbody>
                                    <tr>
                                      <td style="vertical-align:middle;padding-top:0px;padding-bottom:10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <p align="center" style="color: #888; font-size:13px;line-height:20px;">Codevidhya India Private Limited | <a href="https://codevidhya.com" style="text-decoration:none;" target="_blank">www.codevidhya.com </a><br> We are Social- <b>
              <a style="text-decoration:none;"  href="https://www.facebook.com/codevidhya" target="_blank"> Facebook </a>|
              <a style="text-decoration:none;" href="https://www.twitter.com/codevidhya" target="_blank"> Twitter</a> | 
              <a style="text-decoration:none;" href="https://www.instagram.com/codevidhya" target="_blank"> Instagram </a>|
              <a style="text-decoration:none;" href="https://www.linkedin.com/company/codevidhya" target="_blank"> Linkedin </b> </a>
                                                </p>
                                              </div>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  
                </tr>
              
                          </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]>
                  </td>
                </tr>
              </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </body>
        </html>`,
  };
  //console.log("successfull admin login");
  return mailgun.messages().send(data);
}
router.post("/check_order_status", (req, res) => {
  let params = req.body;
  pool.query(
    "select * from order where user_id =? and product_id =? and status =1",
    [params.user_id, params.prod_id],
    function(data221) {
      if (data221.length) {
        res.json({
          status: "200",
          data: "0",
        });
      } else {
        pool.query(
          "update orders set status=? where user_id=? and order_id=?",
          [1, params.user_id, params.order_id],
          function(err, data) {
            if (!err) {
              pool.query(
                "SELECT orders.id,orders.product_id,orders.price,orders.email,orders.order_id,orders.contact_no,cv_users.name,cv_users.address,cv_users.city,cv_users.state,cv_users.contact 'user_contact',(CASE WHEN products.product_type = 'quiz' THEN quiz.quiz_name ELSE books.book_name END) 'product_name',products.product_type, DATE_FORMAT(orders.purchased_at, '%W %D %M %Y') 'purachsed_at'  from orders left join cv_users on orders.user_id = cv_users.user_id left join products on orders.product_id = products.product_id left join quiz on quiz.product_id =products.product_id left join books on books.product_id = products.product_id where orders.user_id=? and orders.order_id=?",
                [params.user_id, params.order_id],
                function(err, data1) {
                  if (!err) {
                    if (data1.length) {
                      let orderId,
                        name,
                        email,
                        productName,
                        productType,
                        price,
                        address,
                        city,
                        state,
                        user_contact,
                        purachsed_at;
                      orderId = params.order_id;
                      name = data1[0].product_name;
                      email = data1[0].email;
                      productName = data1[0].product_name;
                      productType = data1[0].product_type;
                      price = data1[0].price;
                      address = data1[0].address;
                      city = data1[0].city;
                      state = data1[0].state;
                      user_contact = data1[0].user_contact;
                      purachsed_at = data1[0].purachsed_at;
                      setorderMessage(
                        orderId,
                        name,
                        email,
                        productName,
                        productType,
                        price,
                        address,
                        city,
                        state,
                        user_contact,
                        purachsed_at
                      );
                      sendAdminMail(
                        orderId,
                        name,
                        email,
                        productName,
                        productType,
                        price,
                        address,
                        city,
                        state,
                        user_contact,
                        purachsed_at
                      );
                      /*sentConfirmMail(
                        orderId,
                        name,
                        email,
                        productName,
                        productType,
                        price,
                        address,
                        city,
                        state,
                        user_contact,
                        purachsed_at
                      );*/
                      sendCongratulationMail(productName, productType, email);

                      res.json({
                        status: "200",
                        data: "1",
                        success: true,
                      });
                    } else {
                      pool.query(
                        "SELECT orders.id,orders.product_id,orders.price,orders.email,orders.order_id,orders.contact_no,cv_users.name,cv_users.address,cv_users.city,cv_users.state,cv_users.contact 'user_contact',(CASE WHEN products.product_type = 'quiz' THEN quiz.quiz_name ELSE books.book_name END) 'product_name',products.product_type, DATE_FORMAT(orders.purchased_at, '%W %D %M %Y') 'purachsed_at'  from orders left join cv_users on orders.user_id = cv_users.user_id left join products on orders.product_id = products.product_id left join quiz on quiz.product_id =products.product_id left join books on books.product_id = products.product_id where orders.user_id=? order by order_id limit 1",
                        [params.user_id],
                        function(err, data1) {
                          pool.query(
                            "update orders set status=? where user_id=? order by order_id desc",
                            [1, params.user_id, data1[0].order_id],
                            function(err, data) {
                              let orderId,
                                name,
                                email,
                                productName,
                                productType,
                                price,
                                address,
                                city,
                                state,
                                user_contact,
                                purachsed_at;
                              orderId = params.order_id;
                              name = data1[0].product_name;
                              email = data1[0].email;
                              productName = data1[0].product_name;
                              productType = data1[0].product_type;
                              price = data1[0].price;
                              address = data1[0].address;
                              city = data1[0].city;
                              state = data1[0].state;
                              user_contact = data1[0].user_contact;
                              purachsed_at = data1[0].purachsed_at;

                              setorderMessage(
                                orderId,
                                name,
                                email,
                                productName,
                                productType,
                                price,
                                address,
                                city,
                                state,
                                user_contact,
                                purachsed_at
                              );
                              sendCongratulationMail(
                                productName,
                                productType,
                                email
                              );
                              sentConfirmMail(
                                orderId,
                                name,
                                email,
                                productName,
                                productType,
                                price,
                                address,
                                city,
                                state,
                                user_contact,
                                purachsed_at
                              );
                              sendAdminMail(
                                orderId,
                                name,
                                email,
                                productName,
                                productType,
                                price,
                                address,
                                city,
                                state,
                                user_contact,
                                purachsed_at
                              );
                              res.json({
                                status: "200",
                                data: "1",
                                success: true,
                              });
                            }
                          );
                        }
                      );
                    }
                  }
                }
              );
            } else {
              res.json({
                status: "200",
                data: "0",
              });
            }
          }
        );
      }
    }
  );
});

const cors = require("cors");
var corsOptions = {
  origin: "http://localhost:8080",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

router.options("/payment_successful", cors(corsOptions));

router.post("/payment_successful", cors(corsOptions), function(req, res) {
  if (!req.rawBody && !req.body) {
    res.end();
    return;
  }
  var paymentInfo = new Object();
  if (req.rawBody) {
    // This block will be reached when payment is verified by PayU servers.
    let params = JSON.parse(req.rawBody);
    // console.log("sercer");
    //   console.log(params);

    paymentInfo.name = params.customerName;
    paymentInfo.email = params.customerEmail;
    paymentInfo.phone = params.customerPhone;
    paymentInfo.productInfo = params.productInfo;
    paymentInfo.amount = params.amount;
    paymentInfo.transactionId = params.merchantTransactionId;
    paymentInfo.hash = params.hash;
    paymentInfo.paymentId = params.paymentId;
    paymentInfo.mode = params.mode;
  } else {
    // This block will be reached when payment is verified from the browser.
    let params = req.body;
    // console.log("Client");
    // console.log(params);

    paymentInfo.name = params.firstname;
    paymentInfo.email = params.email;
    paymentInfo.phone = params.phone;
    paymentInfo.productInfo = params.productinfo;
    paymentInfo.amount = params.amount;
    paymentInfo.transactionId = params.txnid;
    paymentInfo.hash = params.hash;
    paymentInfo.paymentId = params.paymentId;
    paymentInfo.mode = params.mode;
  }

  let rhash = getPayUResponseHash({
    status: "success",
    udf5: "",
    udf4: "",
    udf3: "",
    udf2: "",
    udf1: "",
    email: paymentInfo.email,
    firstname: paymentInfo.name,
    productinfo: paymentInfo.productInfo,
    amount: paymentInfo.amount,
    txnid: paymentInfo.transactionId,
  });

  if (rhash != paymentInfo.hash) {
    res.status(400).end();
    return;
  }
  var someInfo = "";

  return runSqlQueryAsyncSelect(
    "SELECT orders.id,orders.status,orders.product_id,orders.price,orders.email,orders.order_id,orders.contact_no,cv_users.name,cv_users.address,cv_users.city,cv_users.state,cv_users.contact 'user_contact',(CASE WHEN products.product_type = 'quiz' THEN quiz.quiz_name WHEN products.product_type='live_course' THEN live_courses.live_course_name ELSE books.book_name END) 'product_name',products.product_type, DATE_FORMAT(orders.purchased_at, '%W %D %M %Y') 'purachsed_at'  from orders left join cv_users on orders.user_id = cv_users.user_id left join products on orders.product_id = products.product_id left join quiz on (quiz.product_id =products.product_id) left join books on (books.product_id = products.product_id) left join live_courses on (live_courses.product_id =products.product_id) where orders.order_id=?",
    [paymentInfo.transactionId]
  )
    .then(function(result) {
      if (result.err) {
        throw new Error("order_not_found");
      } else if (result.result.length && result.result[0].status == 1) {
        throw new Error("order_already_verified");
      } else {
        someInfo = result.result[0];
        console.log(someInfo);
      }
    })
    .then(() => {
      return runSqlQueryAsyncUpdate(
        "update orders set status=1, email=?, contact_no=?,paymentId=?,mode=? where order_id=?",
        [
          paymentInfo.email,
          paymentInfo.phone,
          paymentInfo.paymentId,
          paymentInfo.mode,
          paymentInfo.transactionId,
        ]
      );
    })
    .then((result) => {
      try {
        console.log("order mail call");
        return runSqlQueryAsyncSelect(
          // "select case WHEN products.product_type='quiz' THEN quiz.price ELSE books.price end 'product_price',case when products.product_type='quiz' then '' else books_price.actual_price end 'actual_price',case when products.product_type='quiz' then '' else books_price.discount end 'actual_discount',case when products.product_type='quiz' then '' else books_price.dis_price end 'actual_dis_price' ,cv_coupons.coupon_id,cv_coupons.coupon_code,cv_coupons.discount,products.product_type  from orders join products on (products.product_id = orders.product_id) left join cv_coupons on (cv_coupons.coupon_id = orders.coupon_id) left join books on (books.product_id = orders.product_id) inner join books_price on (books_price.book_id =books.book_id) LEFT join quiz on (quiz.product_id = orders.product_id) where status=? and email=? and  contact_no=? and order_id=?",
          "select (case WHEN products.product_type='quiz' THEN quiz.price when products.product_type='live_course' then live_courses.course_price ELSE books.price end) 'product_price',(case when products.product_type='quiz' then '' WHEN products.product_type='live_course' then '' else books_price.actual_price end) 'actual_price',(case when products.product_type='quiz' then '' WHEN products.product_type='live_course' then '' else books_price.discount end) 'actual_discount',(case when products.product_type='quiz' then '' WHEN products.product_type='live_course' then '' else books_price.dis_price end) 'actual_dis_price',cv_coupons.coupon_id,cv_coupons.coupon_code,cv_coupons.discount 'discount',products.product_type  from orders inner join products on (products.product_id = orders.product_id) left join cv_coupons on (cv_coupons.coupon_id = orders.coupon_id) left join books on (books.product_id = orders.product_id) left join books_price on (books_price.book_id =books.book_id) LEFT join quiz on (quiz.product_id = orders.product_id) left join live_courses on (live_courses.product_id = products.product_id)  where status=1 and email=? and  contact_no=? and order_id=?",
          [paymentInfo.email, paymentInfo.phone, paymentInfo.transactionId]
        ).then(function(result3) {
          /****Invoice */
          let BillTo = {
            name: paymentInfo.name,
            email: paymentInfo.email,
            address: someInfo.address,
            city: someInfo.city,
            state: someInfo.state,
            phone: paymentInfo.phone,
          };
          let Invoice = {
            id: paymentInfo.transactionId,
            date: someInfo.purachsed_at,
          };
          let Payment = {
            amountDue: result3.result[0].discount
              ? result3.result[0].product_price *
                ((100 - result3.result[0].discount) / 100)
              : result3.result[0].product_price,
            booksDiscount: result3.result[0].actual_discount
              ? result3.result[0].actual_price -
                result3.result[0].actual_dis_price
              : 0,
            totalAmount: result3.result[0].actual_price
              ? result3.result[0].actual_price
              : result3.result[0].product_price,
            product_price: result3.result[0].product_price,
            discount: result3.result[0].discount
              ? (result3.result[0].discount * result3.result[0].product_price) /
                100
              : 0,
            couponDiscount: result3.result[0].coupon_code
              ? result3.result[0].coupon_code
              : 0,
            tax: "0",
            grandtotal: result3.result[0].discount
              ? result3.result[0].product_price *
                ((100 - result3.result[0].discount) / 100)
              : result3.result[0].product_price,
          };
          let Products = [
            {
              name: someInfo.product_name,
              type: someInfo.product_type,
              quantity: "1",
              unitPrice: result3.result[0].actual_price
                ? result3.result[0].actual_price
                : result3.result[0].product_price,
              amount: result3.result[0].actual_price
                ? result3.result[0].actual_price
                : result3.result[0].product_price,
            },
          ];

          res.render(
            "invoice",
            {
              BillTo: BillTo,
              Payment: Payment,
              Products: Products,
              Invoice: Invoice,
            },
            async (err, data) => {
              if (err) {
                res.send(err);
              } else {
                let options = {
                  format: "A4",
                  orientation: "portrait",
                  header: {
                    height: "5mm",
                  },
                  footer: {
                    height: "5mm",
                  },
                };
                //let invoiceFile = "./invoices/" + Invoice.id + ".pdf";
                //filePath = invoiceFile;
                pdf.create(data, options).toBuffer(function(err, buffer) {
                  console.log("order mail");

                  setorderMessage(
                    paymentInfo.transactionId,
                    paymentInfo.name,
                    paymentInfo.email,
                    someInfo.product_name,
                    someInfo.product_type,
                    paymentInfo.amount,
                    someInfo.address,
                    someInfo.city,
                    someInfo.state,
                    paymentInfo.phone,
                    someInfo.purachsed_at,
                    result3.result[0].product_price,
                    result3.result[0].coupon_code,
                    result3.result[0].discount,
                    new mailgun.Attachment({
                      data: buffer,
                      filename: "invoice.pdf",
                    })
                  );
                });
              }
            }
          );

          /********End Invoice */

          sendCongratulationMail(
            someInfo.product_name,
            someInfo.product_type,
            paymentInfo.email
          );
          console.log("congratulation Mail");
          console.log(
            paymentInfo.name +
              " " +
              someInfo.product_name +
              " " +
              someInfo.product_type
          );
          sendAdminMail(
            paymentInfo.transactionId,
            paymentInfo.name,
            paymentInfo.email,
            someInfo.product_name,
            someInfo.product_type,
            paymentInfo.amount,
            someInfo.address,
            someInfo.city,
            someInfo.state,
            paymentInfo.phone,
            someInfo.purachsed_at
          );
        });
      } catch (e) {
        // We catch the error here because we don't consider this a "fatal" error.
        // Order should complete even without successful sending of email.
        console.log("i am error");
        console.log(e);
      }
    })
    .then(() => {
      res.end();
    })
    .catch((err) => {
      console.log(err);
      res.status(200).end();
    });
});
function sendRobothonMailToUser(userData) {
  var token = (token = jwt.sign(
    {
      userId: userData.user_id,
      st_name: userData.name,
      contact: userData.contact,
      email: userData.email,
      parent_name: userData.parent_name,
      grade: userData.grade,
      sch_name: userData.sch_name,
      reg_no: userData.order_id,
    },
    "zmnduoi320984#*(^$(",
    { expiresIn: "7d" }
  ));

  const data = {
    from: "Codevidhya <contact@codevidhya.com>",
    to: userData.email,
    subject: "Codevidhya Robothon Ticket",
    html: `<html>
    <body>
      <p>Dear ${userData.name} </p>
      <p>Thanks for registering for Robothon. We are looking forward to see you there and sharing necessary details with you.</p>
      <p><b>Event Date – 22 Dec. 2019</b></p>
      <p><b>Place: Euro International School, Sikar</b></p>
      <p><b>Address: Chandpura Chauraha, Near Todi Nagar,</b></p>
      <p><b>Bajaj Gram Sanwali, Sikar.</b></p>
      <p><b>Contact : 7357286330</b></p>
      <p><b>Timing: 09:00 AM to 02:00 PM</b></p>
      <p><b>Note:</b> Printed event pass is mandatory while attending the workshop. Please, download your ticket from here.</p>
      <p><button style="background:#2980B9; color:#FFFFFF; padding:5px 5px; border:none; border-radius:3px 3px;"><a href="https://codevidhya.com/robothon/download?token=${token}" style="color:#FFFFFF;">Download Ticket</a></button></p>
      <p>Regards</p>
      <p>Team Codevidhya</p>
    </body></html>`,
  };
  return mailgun.messages().send(data);
}

function sendRobothonMailToAdmin(userData) {
  const data = {
    from: "Codevidhya <contact@codevidhya.com>",
    to: "contact@codevidhya.com",
    subject: "New Order Received",
    html: `<!doctype html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        
        <head>
          <title> </title>
          <!--[if !mso]><!-- -->
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <!--<![endif]-->
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style type="text/css">
            #outlook a {
              padding: 0;
            }
        
            .ReadMsgBody {
              width: 100%;
            }
        
            .ExternalClass {
              width: 100%;
            }
        
            .ExternalClass * {
              line-height: 100%;
            }
        
            body {
              margin: 0;
              padding: 0;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
            }
        
            table,
            td {
              border-collapse: collapse;
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
            }
        
            img {
              border: 0;
              height: auto;
              line-height: 100%;
              outline: none;
              text-decoration: none;
              -ms-interpolation-mode: bicubic;
            }
        
            p {
              display: block;
              margin: 13px 0;
            }
          </style>
          <!--[if !mso]><!-->
          <style type="text/css">
            @media only screen and (max-width:480px) {
              @-ms-viewport {
                width: 320px;
              }
              @viewport {
                width: 320px;
              }
            }
          </style>
          <!--<![endif]-->
          <!--[if mso]>
                <xml>
                <o:OfficeDocumentSettings>
                  <o:AllowPNG/>
                  <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
          <!--[if lte mso 11]>
                <style type="text/css">
                  .outlook-group-fix { width:100% !important; }
                </style>
                <![endif]-->
          <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
          <style type="text/css">
            @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
          </style>
          <!--<![endif]-->
          <style type="text/css">
            @media only screen and (min-width:480px) {
              .mj-column-per-85 {
                width: 85% !important;
                max-width: 85%;
              }
            }
          </style>
          <style type="text/css">
            @media only screen and (max-width:480px) {
              table.full-width-mobile {
                width: 100% !important;
              }
              td.full-width-mobile {
                width: auto !important;
              }
            }
          </style>
        </head>
        
        <body style="background-color:#f1f1f1;">
          <div style="background-color:#f1f1f1;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#f1f1f1;background-color:#f1f1f1;width:100%;">
              <tbody>
                <tr>
                  <td>
                    <!--[if mso | IE]>
              <table
                 align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
              >
                <tr>
                  <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
              <![endif]-->
                    <div style="Margin:0px auto;max-width:600px;">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                        <tbody>
                          <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                              <!--[if mso | IE]>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        
                <tr>
              
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                  <tbody>
                                    <tr>
                                      <td style="vertical-align:middle;padding:10px 10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                          <tr>
                                            <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                                <tbody>
                                                  <tr>
                                                    <td style="width:180px;"> <img height="48" src="https://codevidhya.com/socialshare/mail/new-logo-codevidhya2_wgmrmo.png" style="border:0;display:block;outline:none;text-decoration:none;height:48px;width:100%;" width="180" />                                              </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  <![endif]-->
                              <!-- row 2 -->
                              <!--[if mso | IE]>
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                  <tbody>
                                    <tr>
                                      <td style="background-color:#ffffff;vertical-align:middle;padding-top:15px;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <h2 align="center" style="color:#2E4053;">New Order Received </h2>
                                                <p align="center" style="color: #888;font-size:14px; line-height:20px;"> You have received a new order from <b>${userData.name}.</b></p>
                                              </div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <p style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:100%;"> </p>
                                              <!--[if mso | IE]>
                <table
                   align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:460px;" role="presentation" width="460px"
                >
                  <tr>
                    <td style="height:0;line-height:0;">
                      &nbsp;
                    </td>
                  </tr>
                </table>
              <![endif]-->
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <p align="center" style="letter-spacing:2"><b>ORDER DETAILS </b></p>
                                              </div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <div style="display:flex;flex-direction:row;"> <span style="color: #888; font-size:13px; flex-grow:1; line-height:30px">Order Id</span> <span align="right" style="color: #555; font-size:13px; line-height:30px;"><b> #${userData.order_id}</b></span> </div>
                                                <div style="display:flex;flex-direction:row;">
                                                <span style="color: #888; font-size:13px; flex-grow:1; line-height:25px;">Product Name</span> <span style="color: #555; font-size:13px;line-height:25px;"><b> Robothon 1.0 </b></span> </div>
                                                <div style="display:flex;flex-direction:row;">
                                                <span style="color: #888; font-size:13px; flex-grow:1; line-height:20px;">Payment Amount <br/>(including all taxes)*</span> <span style="color: #555; font-size:13px;line-height:25px;"><b>Rs. 500 </b></span> </div>
                                                <div style="display:flex;flex-direction:row;"> <span style="color: #888; font-size:13px; flex-grow:1; line-height:20px;">Coupon Discount</span> <span style="color: #555; font-size:13px;line-height:25px;"><b>(-) Rs. 0</b></span> </div>
                                                <div style="display:flex;flex-direction:row;">
                                                <span style="color: #888; font-size:13px; flex-grow:1; line-height:25px;">Paid Online</span> <span style="color: #555; font-size:13px;line-height:25px;"><b>Rs. 500</b></span> </div>
                                                <div style="display:flex;flex-direction:row;">
                                                <span style="color: #888; font-size:13px; flex-grow:1; line-height:25px;">Payment Date</span> <span style="color: #555; font-size:13px;line-height:25px;"><b>${userData.purachsed_at}</b></span> </div>
                                                <div style="display:flex;flex-direction:row;">
                                                <span style="color: #888; font-size:13px; flex-grow:1; line-height:25px;">Payment Status</span> <span style="color: #555; font-size:13px;line-height:25px; background:#0077ff;padding:1px 10px; border-radius:3px; color:#fff;"><b>Success</b></span>                                          </div>
                                              </div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <p style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:100%;"> </p>
                                              <!--[if mso | IE]>
                <table
                   align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #e1e1e1;font-size:1;margin:0px auto;width:460px;" role="presentation" width="460px"
                >
                  <tr>
                    <td style="height:0;line-height:0;">
                      &nbsp;
                    </td>
                  </tr>
                </table>
              <![endif]-->
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <p align="center" style="letter-spacing:2"><b>CUSTOMER DETAILS </b></p>
                                              </div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <div style="display:flex;flex-direction:row;"> <span style="color: #888; font-size:13px; flex-grow:1; line-height:30px">Student Name &nbsp;&nbsp;</span> <span style="color: #555; font-size:13px; line-height:30px;"><b> ${userData.name}</b></span> </div>
                                                <div style="display:flex;flex-direction:row;"> <span style="color: #888; font-size:13px; flex-grow:1; line-height:20px;">Student's Email Address &nbsp;&nbsp;</span> <span style="color: #555; font-size:13px;line-height:25px;"><b>${userData.email}</b></span></div>
                                                <div style="display:flex;flex-direction:row;"> <span style="color: #888; font-size:13px; flex-grow:1; line-height:30px">Parent’s Full Name &nbsp;&nbsp;</span> <span style="color: #555; font-size:13px; line-height:30px;"><b> ${userData.parent_name}</b></span> </div>
                                                <div style="display:flex;flex-direction:row;"> <span style="color: #888; font-size:13px; flex-grow:1; line-height:20px;">Parent’s Email Address &nbsp;&nbsp;</span> <span style="color: #555; font-size:13px;line-height:25px;"><b>${userData.parent_email}</b></span></div>
                                                <div style="display:flex;flex-direction:row;"> <span style="color: #888; font-size:13px; flex-grow:1; line-height:25px;">Parent’s Contact &nbsp;&nbsp;</span> <span style="color: #555; font-size:13px;line-height:25px;"><b> ${userData.contact}</b></span> </div>
                                                <div style="display:flex;flex-direction:row;"> <span style="color: #888; font-size:13px; flex-grow:1; line-height:30px">Student's Grade &nbsp;&nbsp;</span> <span style="color: #555; font-size:13px; line-height:30px;"><b> ${userData.grade}</b></span> </div>
                                                <div style="display:flex;flex-direction:row;"> <span style="color: #888; font-size:13px; flex-grow:1; line-height:30px">School Name &nbsp;&nbsp;</span> <span style="color: #555; font-size:13px; line-height:30px;"><b> ${userData.sch_name}</b></span> </div>
                                                <div style="display:flex;flex-direction:row;"> <span style="color: #888; font-size:13px; flex-grow:1; line-height:30px">Student's City &nbsp;&nbsp;</span> <span style="color: #555; font-size:13px; line-height:30px;"><b> ${userData.city}</b></span> </div>
                                              </div>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  <![endif]-->
                              <!-- row 3 -->
                              <!--[if mso | IE]>
                    <td
                       class="" style="vertical-align:middle;width:510px;"
                    >
                  <![endif]-->
                              <div class="mj-column-per-85 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                  <tbody>
                                    <tr>
                                      <td style="vertical-align:middle;padding-top:0px;padding-bottom:10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                          <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                                <p align="center" style="color: #888; font-size:13px;line-height:20px;">Codevidhya India Private Limited | <a href="https://codevidhya.com" style="text-decoration:none;" target="_blank">www.codevidhya.com </a><br> We are Social- <b>
              <a style="text-decoration:none;"  href="https://www.facebook.com/codevidhya" target="_blank"> Facebook </a>|
              <a style="text-decoration:none;" href="https://www.twitter.com/codevidhya" target="_blank"> Twitter</a> | 
              <a style="text-decoration:none;" href="https://www.instagram.com/codevidhya" target="_blank"> Instagram </a>|
              <a style="text-decoration:none;" href="https://www.linkedin.com/company/codevidhya" target="_blank"> Linkedin </b> </a>
                                                </p>
                                              </div>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                    </td>
                  
                </tr>
              
                          </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]>
                  </td>
                </tr>
              </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </body>
        </html>`,
  };
  return mailgun.messages().send(data);
}

module.exports = router;
