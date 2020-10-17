<template>
  <div id="login-root">
    <Header> </Header>
    <div class="page" style="margin-top:59px;">
      <div class="page-content z-index-10">
        <div class="container">
          <div class="row">
            <div class="col-xl-12 col-md-12 col-md-12 d-block mx-auto">
              <div class="card  mb-xl-0">
                <div class="card-header">
                  <h3 class="card-title">
                    <i class="fa fa-home mr-2"></i>Learn@Home
                  </h3>
                </div>
                <div class="card-body row">
                  <div class=" form-group col-xl-4">
                    <label class="form-label text-dark" id="name" required
                      >Full Name</label
                    >
                    <input
                      type="text"
                      id="name"
                      class="form-control"
                      placeholder="Full Name"
                      v-model="name"
                    />
                    <small
                      v-if="registerButtonClicked && !name"
                      class="cv-error"
                      ><i class="fas fa-exclamation-circle"></i> Name is
                      required.</small
                    >
                  </div>
                  <div class="form-group col-xl-4">
                    <label class="form-label text-dark">Gender</label>
                    <select class="form-control" id="gender">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Do not want to disclose"
                        >Do not want to disclose</option
                      >
                    </select>
                  </div>
                  <div class="form-group col-xl-4">
                    <label class="form-label text-dark">Grade</label>
                    <select class="form-control" id="grade">
                      <option value="Nursery">Grade Nursery</option>
                      <option value="LKG">Grade LKG</option>
                      <option value="UKG">Grade UKG</option>
                      <option value="1">Grade 1</option>
                      <option value="2">Grade 2</option>
                      <option value="3">Grade 3</option>
                      <option value="4">Grade 4</option>
                      <option value="5">Grade 5</option>
                      <option value="6">Grade 6</option>
                      <option value="7">Grade 7</option>
                      <option value="8">Grade 8</option>
                      <option value="9">Grade 9</option>
                      <option value="10">Grade 10</option>
                    </select>
                  </div>
                  <div class="form-group col-xl-6">
                    <label class="form-label text-dark">Email address</label>
                    <input
                      type="email"
                      id="email"
                      class="form-control"
                      v-model="email"
                      placeholder="Email"
                    />
                    <small
                      v-if="registerButtonClicked && !validateEmail(email)"
                      class="cv-error"
                      ><i class="fas fa-exclamation-circle"></i> Enter valid
                      email address.</small
                    >
                  </div>
                  <div class="form-group col-xl-6">
                    <label class="form-label text-dark">Mobile Number</label>
                    <input
                      type="text"
                      id="contact"
                      class="form-control"
                      placeholder="Enter 10 digit mobile number"
                      v-model="phone"
                    />
                    <small
                      v-if="registerButtonClicked && !validatePhone(phone)"
                      class="cv-error"
                      ><i class="fas fa-exclamation-circle"></i> Enter valid
                      phone number.</small
                    >
                  </div>
                  <div class="form-group col-xl-4">
                    <label class="form-label text-dark">City</label>
                    <input
                      type="text"
                      id="city"
                      class="form-control"
                      placeholder="city"
                      v-model="city"
                      required
                    />
                    <small
                      v-if="registerButtonClicked && !city"
                      class="cv-error"
                      ><i class="fas fa-exclamation-circle"></i> City Name is
                      required.</small
                    >
                  </div>
                  <div class="form-group col-xl-4">
                    <label class="form-label text-dark">State</label>
                    <input
                      type="text"
                      id="state"
                      class="form-control"
                      placeholder="State"
                    />
                  </div>
                  <div class="form-group col-xl-4">
                    <label class="form-label text-dark">Country</label>
                    <input
                      type="text"
                      id="country"
                      class="form-control"
                      placeholder="Country"
                    />
                  </div>
                  <div class="form-group col-xl-12">
                    <label class="form-label text-dark">username</label>
                    <input
                      type="username"
                      class="form-control"
                      placeholder="username"
                      v-model="usernameRegister"
                    />
                    <small
                      v-if="registerButtonClicked && !usernameRegister"
                      class="cv-error"
                      ><i class="fas fa-exclamation-circle"></i> Username is
                      required.</small
                    >
                  </div>
                  <div class="form-group col-xl-6">
                    <label class="form-label text-dark">password</label>
                    <input
                      :type="showRegPassword ? 'text' : 'password'"
                      class="form-control"
                      id="lmp-password"
                      placeholder="Password"
                      v-model="passwordRegister"
                    />
                    <i
                      :class="
                        'fa ' + (showRegPassword ? 'fa-eye-slash' : 'fa-eye')
                      "
                      style="position:absolute;right:5%;cursor:pointer;bottom:26%;"
                      @click="showRegPassword = !showRegPassword"
                    ></i>
                    <small
                      v-if="
                        registerButtonClicked &&
                          getPasswordInvalid(passwordRegister)
                      "
                      class="cv-error"
                      ><i class="fas fa-exclamation-circle"></i>
                      {{ getPasswordInvalid(passwordRegister) }}</small
                    >
                  </div>
                  <div class="form-group col-xl-6">
                    <label class="form-label text-dark"
                      >Re-enter password</label
                    >
                    <input
                      id="lmp-repassword"
                      class="form-control"
                      :type="showConfPassword ? 'text' : 'password'"
                      placeholder="Confirm password"
                      v-model="repassword"
                      @input="
                        repassword
                          ? passwordRegister != repassword
                            ? (repasswordErrorMsg = 'Passwords do not match')
                            : (repasswordErrorMsg = '')
                          : (repasswordErrorMsg = 'Re-enter password')
                      "
                    />
                    <i
                      :class="
                        'fa ' + (showConfPassword ? 'fa-eye-slash' : 'fa-eye')
                      "
                      style="position:absolute;right:5%;cursor:pointer;bottom:26%;"
                      @click="showConfPassword = !showConfPassword"
                    ></i>
                    <small
                      v-if="registerButtonClicked && repasswordErrorMsg"
                      class="cv-error"
                      ><i class="fas fa-exclamation-circle"></i>
                      {{ repasswordErrorMsg }}</small
                    >
                  </div>
                  <div class="form-group col-xl-8">
                    <label class="form-label text-dark">Institute Name</label>
                    <input
                      id="institute_name"
                      type="text"
                      class="form-control"
                      placeholder="Institute Name"
                    />
                  </div>

                  <!--<div class="form-group">
                    <label class="custom-control custom-checkbox">
                      <input type="checkbox" class="custom-control-input" />
                      <span class="custom-control-label text-dark"
                        >Agree the
                        <a href="terms.html">terms and policy</a></span
                      >
                    </label>
                  </div>-->

                  <div class="form-footer col-xl-12 text-center mt-2 pl-4">
                    <center>
                      <button
                        id="register-btn"
                        class="btn btn-primary btn-block col-xl-2"
                        @click.prevent="doRegister($event)"
                      >
                        Register
                      </button>
                    </center>
                  </div>
                  <!--  <div class="text-center  mt-3 text-dark">
                    Already have account?<a href="register.html">SignIn</a>
                  </div>-->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import Footer from "@/components/footer/Footer.vue";
import ProgressTop from "@/components/widgets/ProgressTop.vue";
import AuthMixin from "@/mixins/AuthMixin.js";
import axios from "axios";

export default {
  components: {
    Header,
    ProgressTop,
    Footer
  },
  mixins: [AuthMixin],
  data() {
    return {
      gapiLoaded: false,
      shown: false,
      mode: "login",
      loginButtonClicked: false,
      registerButtonClicked: false,
      isLoggingIn: false,
      FB: undefined,
      name: "",
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
      
    };
  },
  mounted() {
    if (~window.location.pathname.indexOf("/register")) {
      this.mode = "register";
    } else {
      this.mode = "login";
    }
    var script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = function() {
      this.gapiLoaded = true;
      this.initGoogleSignin();
    }.bind(this);
    document.getElementById("login-root").appendChild(script);
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
    doLogin(e) {
      e.preventDefault();
      this.loginButtonClicked = true;
      var canSubmit = true;
      if (!this.username) {
        canSubmit = false;
      }
      if (!this.password) {
        this.passwordErrorMsg = "Password is required";
        canSubmit = false;
      }
      if (!canSubmit) return;

      this.sendLoginRequest(this.username, this.password);
    },
    sendLoginRequest(username, password) {
      this.isLoggingIn = true;
      var vm = this;
      axios
        .post("/api/auth/login", { username: username, password: password })
        .then(function(res) {
          if (res.data.admin_id) {
            window.open("/admin-dashboard", "_self");
          } else {
            vm.onLoggedIn(res.data);
          }
        })
        .catch(function(err) {
          if (err.response.status == 400) {
            vm.passwordErrorMsg = "Incorrect username or password.";
          }
          vm.isLoggingIn = false;
        });
    },
    doRegister(e) {
      e.preventDefault();
      this.registerButtonClicked = true;
      var canSubmit = true;
      if (!this.name) {
        canSubmit = false;
      }
      if (!this.usernameRegister) {
        canSubmit = false;
      }
      if (!this.city) {
        canSubmit = false;
      }

      if (!this.validateEmail(this.email)) {
        canSubmit = false;
      }

      if (!this.validatePhone(this.phone)) {
        canSubmit = false;
      }
      if (this.getPasswordInvalid(this.passwordRegister)) {
        canSubmit = false;
      }
      if (!this.repassword) {
        this.repasswordErrorMsg = "Re-enter password.";
        canSubmit = false;
      } else if (this.passwordRegister != this.repassword) {
        this.repasswordErrorMsg = "Passwords do not match.";
        canSubmit = false;
      } else {
        this.repasswordErrorMsg = "";
      }

      if (!canSubmit) return;
      this.sendRegistrationRequest();
    },
    sendRegistrationRequest() {
      this.isLoggingIn = true;
      let grade = $("#grade").val();
      let state = $("#state").val();
      let country = $("#country").val();
      let gender = $("#gender").val();
      let institute_name = $("#institute_name").val();
      var vm = this;
      axios
        .post("/api/auth/learnAtHomeRegisterUser", {
          username: this.usernameRegister,
          name: this.name,
          email: this.email,
          contact: this.phone,
          city: this.city,
          state: state,
          country: country,
          password: this.passwordRegister,
          grade: grade,
          gender: gender,
          institute_name: institute_name
        })
        .then(function(res) {
          if (res.data == "already_exists") {
            window.cvNotify("User or Email already exists.", "error");
          } else {
            window.open("/dashboard", "_self");
          }
          //window.open("/", "_self");
        })
        .catch(err => {
          console.log(err);
          vm.isLoggingIn = false;
          if (err.response.body == "already_exists") {
            window.cvNotify("User already exists.", "error");
          }
        });
    }
  }
};
</script>

<style lang="scss">
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
</style>
