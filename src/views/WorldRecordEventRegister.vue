<template>
  <div class="home">
    <Header>
      <!--Breadcrumb-->
      <div>
        <div class="bannerimg">
          <div class="header-text mb-0">
            <div class="container">
              <div class="text-center text-white ">
                <h1 class="">Register Now!</h1>
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
    <section class="sptb">
      <div class="container">
        <div class="row justify-content-md-center">
          <div class="col-lg-9 col-md-12">
            <div class="card mb-0">
              <div class="card-header">
                <h3 class="card-title">Register</h3>
              </div>
              <div class="card-body">
                <div class="settings-tab">
                  <ul class="tabs-menu nav">
                    <li class="">
                      <a
                        href="#tab1"
                        id="tab1-link"
                        class="active"
                        data-toggle="tab"
                        ><i class="icon icon-speedometer"></i> Info</a
                      >
                    </li>
                    <li>
                      <a href="#tab2" id="tab2-link" data-toggle="tab" class=""
                        ><i class="icon icon-settings"></i> Fee Payment</a
                      >
                    </li>
                    <!--<li><a href="#tab3" data-toggle="tab" class=""><i class="icon icon-settings"></i>  Advanced</a></li>-->
                  </ul>
                  <div class="tab-content">
                    <div class="tab-pane active show" id="tab1">
                      <form class="form-horizontal">
                        <div class="row">
                          <div class="col-sm-6">
                            <div class="form-group col-md-10">
                              <label class="form-label" for="exampleInputEmail1"
                                >Student Name:
                                <small
                                  v-if="registerFormSubmitClicked && !st_name"
                                  class="cv-error"
                                  >Please enter your full name.</small
                                >
                              </label>
                              <input
                                type="text"
                                class="form-control"
                                id="name1"
                                v-model="st_name"
                                placeholder="Enter Full Name"
                              />
                            </div>

                            <div class="form-group col-md-10">
                              <label for="inputEmail4" class="col-form-label"
                                >Parent’s Full Name:
                                <small
                                  v-if="registerFormSubmitClicked && !st_fname"
                                  class="cv-error"
                                  >Please enter parent’s full name.</small
                                >
                              </label>
                              <input
                                type="text"
                                class="form-control"
                                id="inputEmail5"
                                v-model="st_fname"
                                placeholder="Enter first name and last name"
                              />
                            </div>

                            <div class="form-group col-md-10">
                              <label for="inputPassword4" class="col-form-label"
                                >Parent’s Contact:
                                <small
                                  v-if="
                                    registerFormSubmitClicked &&
                                      !validatePhone(contact)
                                  "
                                  class="cv-error"
                                  >Please enter valid phone number.</small
                                >
                              </label>
                              <input
                                type="text"
                                class="form-control"
                                v-model="contact"
                                maxlength="10"
                                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                                placeholder="Phone Number"
                              />
                            </div>

                            <div class="form-group col-md-10">
                              <label class="form-label" for="exampleInputEmail1"
                                >School Name:
                                <small
                                  v-if="registerFormSubmitClicked && !sch_name"
                                  class="cv-error"
                                  >Please enter school name.</small
                                >
                              </label>
                              <input
                                type="text"
                                class="form-control"
                                id="name1"
                                v-model="sch_name"
                                placeholder="Enter School Name"
                              />
                            </div>
                          </div>
                          <div class="col-sm-6 ">
                            <div class="form-group col-md-10">
                              <label for="inputEmail4" class="col-form-label"
                                >Student's Email Id:
                                <small
                                  v-if="
                                    registerFormSubmitClicked &&
                                      !validateEmail(st_email)
                                  "
                                  class="cv-error"
                                  >Please enter valid email address.</small
                                >
                              </label>
                              <input
                                type="email"
                                class="form-control"
                                id="inputEmail1"
                                v-model="st_email"
                                placeholder="Enter email address"
                              />
                            </div>

                            <div class="form-group col-md-10">
                              <label for="inputPassword4" class="col-form-label"
                                >Parent’s Email Address:
                                <small
                                  v-if="
                                    registerFormSubmitClicked &&
                                      !validateEmail(st_femail)
                                  "
                                  class="cv-error"
                                  >Please enter valid email address.</small
                                >
                              </label>
                              <input
                                type="email"
                                class="form-control"
                                id="inputEmail5"
                                v-model="st_femail"
                                placeholder="Email Address"
                              />
                            </div>

                            <div class="form-group col-md-10">
                              <label for="inputEmail4" class="col-form-label"
                                >Select Grade:</label
                              >
                              <select
                                data-placeholder="Select Grade"
                                v-model="grade"
                                class="form-control w-100 custom-select languages"
                              >
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                              </select>
                            </div>
                            <div class="form-group col-md-10">
                              <label class="form-label" for="exampleInputEmail1"
                                >City:
                                <small
                                  v-if="registerFormSubmitClicked && !city"
                                  class="cv-error"
                                  >Please enter your city.</small
                                >
                              </label>
                              <input
                                type="text"
                                class="form-control"
                                v-model="city"
                                id="name1"
                                placeholder="Enter City"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                      <div class="card-footer">
                        <a
                          href="#"
                          class="btn btn-primary"
                          v-on:click.prevent="doRegister()"
                          >Save & Continue</a
                        >
                      </div>
                    </div>
                    <div class="tab-pane" id="tab2">
                      <div class="form-group ">
                        <div class="row">
                          <div class="col-sm-12">
                            <h3 class="mb-5">Registration Fee</h3>
                            <h4>Rs. 500/-</h4>
                            <a
                              href="#"
                              class="btn btn-success mt-3"
                              v-if="paymentBtn"
                              v-on:click.prevent="doPayment()"
                              >Proceed to payment</a
                            >
                          </div>
                        </div>
                      </div>
                      <div
                        class="card-footer bg-success text-white"
                        v-if="!paymentBtn && successMessage"
                      >
                        {{ successMessage }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--/Section-->
    <!--Contact-->
    <div class="sptb">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="card ">
              <div class="card-body">
                <div class="support">
                  <div class="row text-white">
                    <div class="col-xl-6 col-lg-12 col-md-12 border-right">
                      <div class="support-service bg-primary">
                        <i class="fa fa-phone"></i>
                        <p>Call us at</p>
                        <h6>+91 7357286330</h6>
                      </div>
                    </div>
                    <div class="col-xl-6 col-lg-12 col-md-12 ">
                      <div class="support-service bg-success">
                        <i class="fa fa-clock-o"></i>
                        <p>Email us at</p>
                        <h6>contact@codevidhya.com</h6>
                      </div>
                    </div>
                    <!--<div class="col-xl-4 col-lg-12 col-md-12">
														<div class="support-service bg-danger">
															<i class="fa fa-envelope-o"></i>
															<p>Working Hours!</p>
															<h6>Mon-Sat(10:00-19:00)</h6>
															
														</div>
													</div>-->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--/Contact-->
    <Footer />
    <component
      :is="'script'"
      id="bolt"
      src="https://checkout-static.citruspay.com/bolt/run/bolt.min.js"
      bolt-color="ff003a"
    >
    </component>

    <!--component
      :is="'script'"
      id="bolt"
      src="https://sboxcheckout-static.citruspay.com/bolt/run/bolt.min.js"
      bolt-color="ff003a"
      bolt-logo="https://fasnacks.com/img/cookies.png"
    >
    </component-->
    <!--script
    id="bolt"
    src="https://checkout-static.citruspay.com/bolt/run/bolt.min.js"
    bolt-color="#2b7de9" bolt-logo="">
  </script-->
  </div>
</template>

<script>
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
      sch_name: "",
      st_email: "",
      st_femail: "",
      grade: 6,
      city: "",
      token: "",
      userId: "",
      reg_no: "",
      tokenData: [],
      paymentBtn: false,
      successMessage: ""
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
    validateEmail(email) {
      return window.validateEmail(email);
    },
    validatePhone(phone) {
      return window.validatePhone(phone);
    },

    doRegister: function() {
      this.registerFormSubmitClicked = true;
      var canSend = true;
      if (!this.st_name) {
        canSend = false;
      }
      if (!window.validateEmail(this.st_email)) {
        canSend = false;
      }
      if (!this.st_fname) {
        canSend = false;
      }
      if (!window.validateEmail(this.st_femail)) {
        canSend = false;
      }
      if (!window.validatePhone(this.contact)) {
        canSend = false;
      }
      if (!this.sch_name) {
        canSend = false;
      }
      if (!this.city) {
        canSend = false;
      }
      if (!canSend) {
        window.cvNotify("Please provide all details.", "error");
        return;
      }
      this.$http
        .post("/api/user/robothonUserRegister", {
          st_name: this.st_name,
          st_email: this.st_email,
          st_fname: this.st_fname,
          st_femail: this.st_femail,
          contact: this.contact,
          grade: this.grade,
          sch_name: this.sch_name,
          city: this.city
        })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            if (res.body.success == 1) {
              window.cvNotify(
                "You have successfull submitted the detail.",
                "notice"
              );
              this.token = res.body.token;
              this.paymentBtn = true;
              this.$router.push({
                path: "/robothon/register",
                query: { token: res.body.token }
              });
              this.checkToken();
            } else if (res.body.success == 0) {
              window.cvNotify("User already exist.", "warning");
            }
          }
        });
    },
    checkToken: function() {
      this.$http
        .post("/api/user/robothonCheckToken", { token: this.token })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            if (res.body.message == 1) {
           //   console.log("check token");
           //   console.log(res.body);
              this.tokenData = res.body.data[0];
              this.userId = res.body.data[0].user_id;
              this.checkUserStatus(res.body.data[0]);
              $("#tab1-link").removeClass("active");
              $("#tab1").removeClass("active");
              $("#tab2-link").addClass("active");
              $("#tab2").addClass("active");
            }
          }
        });
    },
    doPayment: function() {
      this.$http
        .post("/api/user/beginRobothonPaymentProcess", {
          tokenData: this.tokenData
        })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            this.token = res.body.token;
            this.$router.push({
              path: "/robothon/register",
              query: { token: res.body.token }
            });
            this.startBolt(res.body.transaction_data);
          }
        });
    },
    startBolt: function(transactionData) {
      let vm = this;
      this.order_id = transactionData.id;
      var data = {
        key: "" + transactionData.key,
        txnid: "" + transactionData.id,
        hash: transactionData.hash,
        amount: "" + transactionData.amount,
        firstname: transactionData.first_name,
        email: transactionData.email,
        phone: "" + transactionData.phone,
        productinfo: transactionData.product_info,
        surl: "https://codevidhya.com/robothon/register",
        furl: "https://codevidhya.com/robothon/register" //,
        //mode:'dropout'// non-mandatory for Customized Response Handling
      };
      var handler = {
        responseHandler: function(BOLT) {
          if (BOLT.response.status == "success") {
            vm.doPaymentSuccessful(BOLT.response);
            vm.paymentBtn = false;
            window.cvNotify("Payment successfull.", "notice");
            //vm.$router.push({path: '/robothon/download', query: {token:vm.token}});
          } else {
            //vm.processing = false;
          }
        },
        catchException: function(BOLT) {
          //vm.processing = false;
          //vm.buyClicked = false;
        }
      };
      bolt.launch(data, handler);
    },
    doPaymentSuccessful(boltResponse) {
      this.$http
        .post("/api/payments/payment_successful", boltResponse)
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
          }
        });
    },
    checkUserStatus: function(userData) {
      this.$http
        .post("/api/user/checkUserStatus", { userData: userData })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
           // console.log("check status");
          //  console.log(res.body);
            if (
              res.body.data.registerStatus == 1 &&
              (res.body.data.payStatus == null || res.body.data.payStatus == 0)
            ) {
              $("#tab1-link").removeClass("active");
              $("#tab1").removeClass("active");
              $("#tab2-link").addClass("active");
              $("#tab2").addClass("active");
              this.paymentBtn = true;
            } else if (
              res.body.data.registerStatus == 1 &&
              res.body.data.payStatus == 1
            ) {
              //this.$router.push({path: '/robothon/download', query: {token:this.token}});
            }
          }
        });
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
</style>
