<template>
  <div class="d-flex flex-column">
    <Header> </Header>
    <div
      id="container"
      class="page d-flex  flex-column flex-grow-1"
      style="margin-top:57px;"
    >
      <div
        class="row d-flex flex-row flex-grow-1 flex-shrink-1"
        style="min-height: 0;"
      >
        <div
          id="register"
          class="col-xl-6 col-md-12 col-md-12 d-block flex-grow-1"
        >
          <div class="card mb-xl-0 schedule-time flex-grow-1 h-100 ">
            <div class="card-header">
              <h3 class="card-title text-center col-sm-12">
                Enquiry Form
              </h3>
            </div>
            <div class="card-body row">
              <div class=" form-group col-xl-12">
                <label class="form-label text-dark" id="name" required
                  >Parent's Name</label
                >
                <input
                  type="text"
                  id="name"
                  class="form-control"
                  placeholder="Parent's Name"
                  v-model="name"
                />
                <small v-if="registerButtonClicked && !name" class="cv-error"
                  ><i class="fas fa-exclamation-circle"></i> Parent's Name is
                  required.</small
                >
              </div>

              <div class="form-group col-xl-12">
                <label class="form-label text-dark">Parent's Email ID</label>
                <input
                  type="email"
                  id="email"
                  class="form-control"
                  v-model="email"
                  placeholder="Parent's Email ID"
                />
                <small
                  v-if="registerButtonClicked && !validateEmail(email)"
                  class="cv-error"
                  ><i class="fas fa-exclamation-circle"></i> Enter valid
                  Parent's Email ID.</small
                >
              </div>
              <div class="form-group col-xl-12">
                <label class="form-label text-dark"
                  >Parent's Mobile Number</label
                >
                <input
                  type="text"
                  id="contact"
                  class="form-control"
                  maxlength="10"
                  onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                  placeholder="Enter 10 digit mobile number"
                  v-model="phone"
                />
                <small
                  v-if="registerButtonClicked && !validatePhone(phone)"
                  class="cv-error"
                  ><i class="fas fa-exclamation-circle"></i> Enter valid
                  Parent's Mobile Number.</small
                >
              </div>
              <div class="form-group col-xl-12">
                <label class="form-label text-dark">Kid's Name</label>
                <input
                  type="text"
                  id="kidsname"
                  class="form-control"
                  placeholder="Kid's Name"
                  v-model="kidsName"
                />
                <small
                  v-if="registerButtonClicked && !kidsName"
                  class="cv-error"
                >
                  <i class="fas fa-exclamation-circle"></i> Enter Kid's Name
                </small>
              </div>

              <!--<div class="form-group col-xl-6">
                <label class="form-label text-dark">Course Name</label>
                <select class="form-control" v-model="courseId">
                  <option value="0">Select Course</option>
                  <template>
                    <option>Absolute Beginner</option>
                    <option>Intermediate - Scratch</option>
                    <option>Intermediate - HTML, CSS, JavaScript</option>
                  </template>
                </select>
                <small
                  v-if="registerButtonClicked && courseId == 0"
                  class="cv-error"
                >
                  <i class="fas fa-exclamation-circle"></i> Select Course
                </small>
              </div>
              <div class="form-group col-xl-6">
                <label class="form-label text-dark">Schedule On</label>
                <input
                  type="date"
                  class="form-control"
                  :min="mindate"
                  :value="scheduleOn"
                />

                <small
                  v-if="registerButtonClicked && !kidsName"
                  class="cv-error"
                >
                </small>
              </div>
              <div class="form-group col-xl-6">
                <label class="form-label text-dark">Time Slot</label>
                <div class="custom-controls-stacked">
                  <label
                    class="custom-control custom-radio d-inline-block mr-3"
                  >
                    <input
                      type="radio"
                      class="custom-control-input"
                      name="example-radios"
                      value="option1"
                      checked
                    />
                    <span class="custom-control-label">10 Am to 10:30 Am</span>
                  </label>
                  <label
                    class="custom-control custom-radio d-inline-block mr-2"
                  >
                    <input
                      type="radio"
                      class="custom-control-input"
                      name="example-radios"
                      value="option2"
                    />
                    <span class="custom-control-label">11 Am to 11:30 Am</span>
                  </label>
                </div>
              </div>-->

              <div class="form-footer col-xl-12 text-center mt-2 pl-4">
                <center>
                  <button
                    id="register-btn"
                    class="btn btn-primary btn-block col-xl-2"
                    @click.prevent="doRegister($event)"
                  >
                    Submit
                  </button>
                </center>
              </div>
              <!--  <div class="text-center  mt-3 text-dark">
                    Already have account?<a href="register.html">SignIn</a>
                  </div>-->
            </div>
          </div>
        </div>
        <div
          id="description"
          class="col-xl-6  col-md-12 d-block m-0 p-0 flex-1"
        >
          <div class="card mb-xl-0 h-100  pb-5">
            <div
              class="box h-100 p-4 pl-5 pr-5 mr-1 d-flex flex-column justify-content-center sm_bx0"
              id="form-sidebar"
              style=""
            >
              <div class="info_items row" style="padding: 30px;">
                <div class="col-xl-1">
                  <i class="fa fa-ban text-success fa-2x mr-1"></i>
                </div>
                <div class="info_details col-xl-11">
                  <h4 style="font-weight: bold;">No Promotions Ever!</h4>
                  <div class="heading4_reg">
                    Codevidhya will never call or email you for marketing
                    offers. Your phone and email are used only to update you on
                    your child's progress.
                  </div>
                </div>
              </div>
              <div class="info_items row mt-4" style="padding: 45px;">
                <div class="col-xl-1">
                  <i class="fas fa-child text-success fa-2x mr-1"></i>
                </div>
                <div class="info_details col-xl-11">
                  <h4 style="font-weight: bold;">100% Kids Friendly</h4>
                  <div class="heading4_reg">
                    Codevidhya provides 100% kids friendly environment.
                  </div>
                </div>
              </div>
              <div class="info_items row mt-4" style="padding: 45px;">
                <div class="col-xl-1">
                  <i class="fas fa-lock text-warning fa-2x mr-1"></i>
                </div>
                <div class="info_details col-xl-11">
                  <h4 style="font-weight: bold;">Secure</h4>
                  <div class="heading4_reg">
                    Codevidhya provides 100% secure environment.
                  </div>
                </div>
              </div>
              <div class="info_items row mt-4" style="padding: 45px;">
                <div class="col-xl-1">
                  <i class="fas fa-phone text-success fa-2x mr-1"></i>
                </div>
                <div class="info_details col-xl-11">
                  <h4 style="font-weight: bold;">Contact Us</h4>
                  <div class="heading4_reg">
                    We are available for you 24*7 at
                    <a
                      href="mailto:contact@codevidhya.com"
                      class="heading4_bold text_blue"
                    >
                      contact@codevidhya.com
                    </a>
                  </div>
                </div>
              </div>
              <!--<div class="info_items"><div class="icons icon-support"></div><div class="info_details"><div class="header heading3_bold">Contact Us - 24x7</div><div class="heading4_reg">We’re devoted to our mission of making your kids creators versus consumers of technology. We’re available 24x7 for you at <a href="mailto:support@whitehatjr.com" class="heading4_bold text_blue">support@whitehatjr.com</a></div></div></div><div class="info_items"><div class="icons icon-exclamation-mark"></div><div class="info_details"><div class="header heading3_bold">For Siblings</div><div class="heading4_reg">Please use a distinct parent <b>Email ID</b> and <b>Mobile Number</b> for each sibling.</div>
                             </div>
              </div>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--modal-->
    <div id="successMessage" class="cv-modal small">
      <div class="p-3">
        <p class="m-3" id="msgg">
          Thank you for your query.We will get back to you shortly.
        </p>
        <div id="footer" class="d-flex flex-row justify-content-center mt-4">
          <button class="cv-button" @click="closeModal()">
            Okay
          </button>
        </div>
      </div>
    </div>
    <!--end modal-->
    <Loader v-if="processing" />
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import Footer from "@/components/footer/Footer.vue";
import ProgressTop from "@/components/widgets/ProgressTop.vue";
import AuthMixin from "@/mixins/AuthMixin.js";
import Loader from "@/components/widgets/BlockingLoader.vue";
import axios from "axios";
import moment from "vue-moment";
export default {
  components: {
    Header,
    ProgressTop,
    Footer,
    Loader,
  },

  mixins: [AuthMixin],
  data() {
    return {
      processing: false,
      gapiLoaded: false,
      shown: false,
      mode: "login",
      loginButtonClicked: false,
      registerButtonClicked: false,
      isLoggingIn: false,
      FB: undefined,
      name: "",
      kidsName: "",
      grade: "",
      username: "",
      usernameRegister: "",
      email: "",
      phone: "",
      password: "",
      passwordRegister: "",
      repassword: "",
      passwordErrorMsg: "",
      userId: "",
      repasswordErrorMsg: "",
      showPassword: false,
      showRegPassword: false,
      city: "",
      showConfPassword: false,
      courseId: 0,
      mindate: this.$moment().format("YYYY-MM-DD"),
      scheduleOn: this.$moment().format("YYYY-MM-DD"),
    };
  },
  mounted() {
    // showModal("successMessage");
  },
  methods: {
    changeFormMode(e, mode) {
      e.preventDefault();
      this.mode = mode;
    },
    validateEmail(email) {
      return validateEmail(email);
    },
    validatePhone(phone) {
      return validatePhone(phone);
    },
    getPasswordInvalid(password) {
      return getPasswordInvalid(password);
    },

    doRegister(e) {
      e.preventDefault();
      this.registerButtonClicked = true;
      var canSubmit = true;
      if (!this.name) {
        canSubmit = false;
      }

      if (!this.validateEmail(this.email)) {
        canSubmit = false;
      }

      if (!this.validatePhone(this.phone)) {
        canSubmit = false;
      }
      if (!this.kidsName) {
        canSubmit = false;
      }
      if (!canSubmit) return;

      this.sendRegistrationRequest();
    },
    closeModal() {
      hideModal("successMessage");
    },
    sendRegistrationRequest() {
      this.isLoggingIn = true;
      this.processing = true;
      var vm = this;

      axios
        .post("/api/auth/requestForPreviousLiveClass", {
          name: this.name,
          email: this.email,
          contact: this.phone,
          kidsName: this.kidsName,
        })
        .then(function(res) {
          vm.processing = false;
          if (res.data == "") {
            $("#msgg").text("This request already sent.");
          } else {
            $("#msgg").text(
              "Thank you for your query.We will get back to you shortly."
            );
          }
          showModal("successMessage");
          //cvNotify("Thank you for your query.We will get back to you shortly.","success")
          setTimeout(function() {
            window.open("/", "_self");
          }, 5000);
        })
        .catch((err) => {
          // console.log(err);
          vm.processing = false;
          vm.isLoggingIn = false;
          if (err.response.body == "already_exists") {
            window.cvNotify("User already exists.", "error");
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
#login-page-root {
  padding: 24px;
  padding-top: 80px;
  #header {
    position: relative;
    display: none;
    width: 100%;
    margin-bottom: 48px;
    h3 {
      flex-grow: 1;
      font: 700 2rem/1 "Poppins";
      text-align: center;
    }
  }
  form {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 32px;
    border: none;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    &#lmp-login-form {
      max-width: 400px;
      margin: 0 auto;
    }
    fieldset,
    .form-group {
      width: 100%;
    }
    fieldset {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
  input {
    width: 100%;
  }

  #login-with {
    display: flex;
    flex-direction: row;
    margin: 24px 0;
    div {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 8px 16px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      cursor: pointer;
      color: #3b5998;
      &.disabled {
        cursor: default;
        opacity: 0.5;
      }
      i {
        margin-left: 8px;
        font-size: 24px;
      }
      &:first-of-type {
        img {
          display: block;
          width: 24px;
          height: 24px;
          margin-left: 8px;
        }
      }
    }
  }
  #forgot-password {
    margin: 0 auto;
    font-weight: bold;
  }
  :disabled #forgot-password {
    opacity: 0.5;
  }
  #register-now-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 16px;
  }

  #login-now,
  #register-now {
    font-weight: bold;
  }

  .two-col {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    & > div {
      width: 48%;
    }
  }

  #login-btn,
  #register-btn {
    margin-top: 16px;
    margin-bottom: 32px;
  }
  #register-btn {
    max-width: 240px;
  }

  .lmp-or {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 300px;
    margin-bottom: 16px;
    text-align: center;
    &::before {
      content: " ";
      display: block;
      position: absolute;
      top: 50%;
      width: 100%;
      height: 1px;
      background: rgba(0, 0, 0, 0.2);
      z-index: 0;
    }
    p {
      position: relative;
      width: 32px;
      margin: 0;
      background: #fff;
    }
  }

  /* Mobile */
  @media screen and (max-width: 800px) {
    & > div {
      width: 98%;
      height: auto;
    }
    .two-col {
      flex-direction: column;
      & > div {
        width: 100%;
      }
    }
    #login-btn,
    #register-btn {
      max-width: 100%;
      margin-top: 24px;
    }
  }
}
#live-class {
  position: fixed;
  width: 100%;
  height: 100%;
  #container {
    min-height: 0;

    #register {
      flex-shrink: 0;
      overflow-y: auto;
    }

    #description {
      background: #fff;
      overflow: auto;
    }
  }
}
</style>
