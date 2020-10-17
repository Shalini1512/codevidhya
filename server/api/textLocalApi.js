const axios = require("axios");
axios.get("https://api.textlocal.in/send/?apikey=JDA6Ts2/cNM-lYbBIMfebb30NCtWxpaST3CvrajE9f&sender=CODVDY&numbers=918290908900&message=This Template For Test").then(result=>{
    console.log(result);
})


const tlClient = axios.create({
  baseURL: "https://api.textlocal.in/",
  params: {
    apiKey: "JDA6Ts2/cNM-lYbBIMfebb30NCtWxpaST3CvrajE9f", //Text local api key
    sender: "CODVDY"
  }
});

const smsClient = {
  sendPartnerWelcomeMessage: user => {
    if (user && user.phone && user.name) {
        console.log(user.phone+' '+user.name);
      const params = new URLSearchParams();
      params.append("numbers", [parseInt("91" + user.phone)]);
      params.append(
        "message",
        `This Template For Test hiii`
      );
      console.log(params);
      tlClient.get("/send", params).then(res=>{
          console.log(res.data);
      });
      
    }
  },
  sendVerificationMessage: user => {
    if (user && user.phone) {
      const params = new URLSearchParams();
      params.append("numbers", [parseInt("91" + user.phone)]);
      params.append(
        "message",
        `Your iWheels verification code is ${user.verifyCode}`
      );
      tlClient.get("/send", params);
    }
  }
};

module.exports = smsClient;

  /*const axios = require("axios");
  message = `This Template For Test ${param.name}`;
  let contact = "918290908900";//"91" + param.contact;
 // console.log(contact);
  url = `https://api.textlocal.in/send/?apikey=JDA6Ts2/cNM-lYbBIMfebb30NCtWxpaST3CvrajE9f&sender=CODVDY&numbers=918290908900&message=This Template For Test hii`;
  console.log(url);
  axios.get(url).then((result) => {
  //  console.log(result.data);
  });*/