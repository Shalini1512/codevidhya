<template>
  <div class="home">
    <Header>
      <!--Breadcrumb-->
      <div>
        <div class="bannerimg">
          <div class="header-text mb-0">
            <div class="container">
              <div class=" text-center text-white ">
                <button class="btn btn-warning" v-on:click="checkToken()">
                  <h1 class="">Download Ticket</h1>
                </button>
                <!--<ol class="breadcrumb text-center">
									<li class="breadcrumb-item"><a href="#">Home</a></li>
									<li class="breadcrumb-item active text-white" aria-current="page">Contact</li>
								</ol>-->
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--/Breadcrumb-->
    </Header>

    <div class="sptb">
      <div class="container border w-70" id="ticket-div">
        <div class="row">
          <div class="col-sm-6">
            <img
              id="brand-logo"
              src="../assets/logo.png"
              alt="img"
              class="bg-white m-2 br-3 p-1 img-fluid"
              style="width:200px;"
            />
          </div>
          <div class="col-sm-6 text-right">
            <!--<img src="../assets/images/worldrecordevent/stemorg logo.png" alt="img" class="bg-white br-3 m-2 p-1 img-fluid" style="width:300px;">-->
          </div>
        </div>
        <div id="a-1" class="row p-4" style="margin-top:20px;">
          <div class="col-sm-12" style="padding-bottom:5px;">
            <h3>Codevidhya Robothon</h3>
          </div>
          <div class="col-sm-12">
            <h5>14 Dec 2019, Euro International School, Sikar</h5>
          </div>
        </div>
        <div
          class="row"
          style="margin-top:10px; margin-bottom:0; padding-left:10px;"
        >
          <div class="col-sm-6"><!--Order No. 1501--></div>
          <div class="col-sm-6 text-right">
            AMOUNT : <i class="fas fa-rupee-sign"></i> 500
          </div>
        </div>
        <div class="container border p-5" style="padding-left:10px;">
          <div class="row bg-white" id="pd">
            <div class="col-sm-2">Registration No.</div>
            <div class="col-sm-10">
              <b>{{ tokenData.order_id }}</b>
            </div>
            <!--<div class="col-sm-2">Registration Type </div><div class="col-sm-10"><b>Robothon Member</b></div>-->
            <div class="col-sm-2">Name</div>
            <div class="col-sm-10">
              <b>{{ tokenData.name }}</b>
            </div>
            <div class="col-sm-2">Parent's Name</div>
            <div class="col-sm-10">
              <b>{{ tokenData.parent_name }}</b>
            </div>
            <div class="col-sm-2">Grade</div>
            <div class="col-sm-10">
              <b>{{ tokenData.grade }}</b>
            </div>
            <div class="col-sm-2">Contact</div>
            <div class="col-sm-10">
              <b>{{ tokenData.contact }}</b>
            </div>
            <div class="col-sm-2">Email</div>
            <div class="col-sm-10">
              <b>{{ tokenData.email }}</b>
            </div>
            <div class="col-sm-2">School Name</div>
            <div class="col-sm-10">
              <b>{{ tokenData.sch_name }}</b>
            </div>
          </div>
        </div>

        <div
          class="container border p-5"
          style="padding-left:10px; margin-top:10px"
        >
          <div class="row" style="margin-bottom:10px; ">
            <div class="col-sm-6" style="font-family:times new roman;">
              <h4><b>Time & Venue</b></h4>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12">
              <i class="far fa-clock"></i> Sunday, Dec 22 2019 09:00 AM to 02:00
              PM
            </div>
            <div class="col-sm-12">
              <i class="fas fa-map-marker-alt"></i> At Euro International
              School, Sikar, Rajasthan, India, 332001
            </div>
          </div>
        </div>
        <div
          class="container border p-5"
          style="padding-left:10px;margin-top:10px"
        >
          <div class="row" style=" margin-bottom:10px;">
            <div class="col-sm-6" style="font-family:times new roman;">
              <h4><b>Organizer</b></h4>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12">Codevidhya India Private Limited</div>
            <div class="col-sm-12">
              <b>Note:</b> For any further clarification, you can reach out at
              <b>contact@codevidhya.com</b>
            </div>
          </div>
        </div>

        <div
          class="container border p-5"
          style="padding-left:10px;margin-top:10px"
        >
          <div class="row" style="margin-bottom:10px;">
            <div class="col-sm-6" style="font-family:times new roman;">
              <h4><b>Terms and Conditions</b></h4>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12">
              We follow a "No refund" policy upon cancellation.
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    <component
      :is="'script'"
      id="bolt"
      src="https://sboxcheckout-static.citruspay.com/bolt/run/bolt.min.js"
      bolt-color="ff003a"
      bolt-logo="https://fasnacks.com/img/cookies.png"
    >
    </component>
   
  </div>
</template>

<script>
import html2canvas from "html2canvas";
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import Footer from "@/components/footer/Footer.vue";
export default {
  components: {
    Header,
    Footer
  },
  data() {
    return {
      registerFormSubmitClicked: false,
      st_name: "",
      st_fname: "",
      contact: "",
      sch_name: "l",
      st_email: "",
      st_femail: "",
      grade: 5,
      city: "",
      token: "",
      userId: "",
      reg_no: "",
      tokenData: []
    };
  },
  created() {
    if (this.$route.query.token) {
      this.token = this.$route.query.token;
      this.checkToken();
    }
  },
  mounted() {},
  methods: {
    checkToken: function() {
      this.$http
        .post("/api/user/robothonCheckToken", { token: this.token })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            if (res.body.message == 1) {
              this.tokenData = res.body.data[0];
              this.checkUserStatus(res.body.data[0]);
            }
          }
        });
    },
    checkUserStatus: function(userData) {
      this.$http
        .post("/api/user/checkUserStatus", { userData: userData })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            if (
              res.body.data.registerStatus == 1 &&
              res.body.data.payStatus == 1
            ) {
              this.downloadTicket();
            } else {
              window.cvNotify(
                "Please complete your registration process.",
                "warning"
              );
            }
          }
        });
    },
    downloadTicket: function() {
      var doc = new jsPDF("p", "mm", [297, 210], true);
      var width = doc.internal.pageSize.width;
      var height = doc.internal.pageSize.height;
      doc.addImage(
        document.querySelector("#brand-logo"),
        "png",
        10,
        10,
        50,
        15
      );
      doc.setTextColor("#4b5d73");
      doc.setFontSize(20);
      doc.text("Codevidhya Robothon", 10, 50);
      doc.setFontSize(14);
      doc.text("22 Dec 2019, Euro International School, Sikar", 10, 57);
      doc.setFontSize(10);
      doc.text("AMOUNT: Rs. 500", width - 45, 78);

      doc.setDrawColor(75, 93, 115);
      doc.line(10, 80, width - 10, 80);

      doc.setFontSize(18);
      doc.text("Student Detail", 10, 87);
      doc.setFontSize(10);
      doc.fromHTML(
        '<div style="color:#4b5d73;">Registration No.</div>',
        10,
        90
      );
      doc.fromHTML(
        '<div style="color:#4b5d73;"><b>' +
          this.tokenData.order_id +
          "</b></div>",
        40,
        90
      );
      /*doc.fromHTML('<div style="color:#4b5d73;">Ticket Type</div>',10,95)
				doc.fromHTML('<div style="color:#4b5d73;"><b>Robothon Members</b></div>',40,95)*/
      doc.fromHTML('<div style="color:#4b5d73;">Name</div>', 10, 95);
      doc.fromHTML(
        '<div style="color:#4b5d73;"><b>' + this.tokenData.name + "</b></div>",
        40,
        95
      );

      doc.fromHTML(
        '<div style="color:#4b5d73;">Parent&#39;s Name</div>',
        10,
        100
      );
      doc.fromHTML(
        '<div style="color:#4b5d73;"><b>' +
          this.tokenData.parent_name +
          "</b></div>",
        40,
        100
      );

      doc.fromHTML('<div style="color:#4b5d73;">Grade</div>', 10, 105);
      doc.fromHTML(
        '<div style="color:#4b5d73;"><b>' + this.tokenData.grade + "</b></div>",
        40,
        105
      );
      doc.fromHTML('<div style="color:#4b5d73;">Contact</div>', 10, 110);
      doc.fromHTML(
        '<div style="color:#4b5d73;"><b>' +
          this.tokenData.contact +
          "</b></div>",
        40,
        110
      );

      doc.fromHTML('<div style="color:#4b5d73;">Email</div>', 10, 115);
      doc.fromHTML(
        '<div style="color:#4b5d73;"><b>' + this.tokenData.email + "</b></div>",
        40,
        115
      );

      doc.fromHTML('<div style="color:#4b5d73;">School Name</div>', 10, 120);
      doc.fromHTML(
        '<div style="color:#4b5d73;"><b>' +
          this.tokenData.sch_name +
          "</b></div>",
        40,
        120
      );

      doc.setFontSize(18);
      doc.text("Time & Venue", 10, 140);
      doc.setFontSize(10);
      doc.text("Sunday, Dec 22 2019 09:00 AM to 02:00 PM", 10, 147);
      doc.text(
        "At Euro International School, Sikar, Rajasthan, India, 332001",
        10,
        152
      );

      doc.setFontSize(18);
      doc.text("Organizer", 10, 162);
      doc.setFontSize(12);
      doc.text("Codevidhya India Private Limited", 10, 168);
      doc.fromHTML(
        '<div style="color:#4b5d73"><b>Note:</b> For any further clarification, you can reach out at <b>contact@codevidhya.com</b></div>',
        10,
        169
      );

      doc.setFontSize(18);
      doc.text("Terms and Conditions", 10, 182);
      doc.setFontSize(10);
      doc.text('We follow a "No refund" policy upon cancellation.', 10, 188);

      /*html2canvas(document.querySelector('#ticket-div')).then(canvas => {
			    doc.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10,100,100);
			    doc.save('Certificate.pdf');
				});*/
      doc.save("Robothon-" + this.tokenData.name + ".pdf");
    }
  }
};
</script>

<style>
.home-card-2 {
  padding: 48px 36px;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 20px 31px 0 rgba(0, 0, 0, 0.16), 0 0 20px 0 rgba(0, 0, 0, 0.04);
}
.home-card-part {
  flex-wrap: wrap;
  padding-top: 16px;
}
.home-card-part > div {
  display: flex;
  flex-direction: column;
  padding: 16px 8px;
  flex-grow: 1;
  max-width: 150px;
  align-items: center;
}
.home-card-part > div > div {
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
}
.home-card-part-image {
  width: 100%;
  height: auto;
  margin-bottom: 20px;
}
.home-card-part-image img {
  width: 60%;
}
.image-section {
  padding: 18px 0;
  z-index: 5;
  position: relative;
}
.image-section div {
  display: inline-block;
  margin: 6px 0.5%;
  width: 23.5%;
  height: 180px;
  border-radius: 4px;
  overflow: hidden;
}
#ticket-div {
  width: 297mm !important;
  height: 210 !important;
}
</style>
