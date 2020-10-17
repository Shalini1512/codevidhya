<template>
  <div id="login-root">
    <Header> </Header>
    <ProgressTop v-if="isLoggingIn" />

    <div id="login-page-root">
      <form v-if="mode == 'login'" id="lmp-login-form">
        <div id="header">
          <h3>Log in</h3>
        </div>
        <div id="login-with">
          <div
            @click="
              isLoggingIn ? '' : loginWith({ with: 'google', action: 'login' })
            "
            :class="isLoggingIn || !gapiLoaded ? 'disabled' : ''"
          >
            Log in with
            <img src="../assets/images/icons/google.png" />
          </div>
          <!--div style="margin-left: 8px" @click="loginWith({with: 'facebook', action: 'login'})">Log in with<i class="fab fa-facebook"></i></div-->
        </div>

        <!-- <div class="lmp-or">
          <p>Or</p>
        </div>-->
        <fieldset :disabled="isLoggingIn">
          <div class="form-group">
            <label for="lmp-username">Username</label>
            <input
              id="lmp-username"
              class="form-control"
              type="email"
              placeholder="Enter username"
              v-model="username"
            />
            <small v-if="loginButtonClicked && !username" class="cv-error"
              ><i class="fas fa-exclamation-circle"></i> Username is
              required.</small
            >
          </div>

          <div class="form-group" style="position:relative">
            <label for="lmp-password">Password</label>
            <input
              id="lmp-password"
              class="form-control pr-5"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter password"
              v-model="password"
              @input="password ? (passwordErrorMsg = '') : ''"
            />
            <i
              :class="'fa ' + (showPassword ? 'fa-eye-slash' : 'fa-eye')"
              style="position:absolute; right:6px; bottom:12px; cursor:pointer"
              @click="showPassword = !showPassword"
            ></i>
            <small
              v-if="loginButtonClicked && (!password || passwordErrorMsg)"
              class="cv-error"
              ><i class="fas fa-exclamation-circle"></i>
              {{
                passwordErrorMsg ? passwordErrorMsg : "Password is required."
              }}</small
            >
          </div>
          <button
            id="login-btn"
            class="btn btn-primary w-100"
            @click="doLogin($event)"
          >
            Log in
          </button>
          <router-link
            to="/reset-password"
            id="forgot-password"
            class="btn btn-link"
          >
            Forgot password?
          </router-link>
          <i class="flex-filler"></i>

          <div id="register-now-wrapper">
            <span>New user?</span>
            <button
              href="#"
              id="login-now"
              class="btn btn-link"
              @click="changeFormMode($event, 'register')"
            >
              Sign up
            </button>
          </div>
        </fieldset>
      </form>

      <form v-else-if="mode == 'register'" id="lmp-signup-form">
        <div id="login-with">
          <div @click="loginWith({ with: 'google', action: 'signup' })">
            Sign up with
            <img src="../assets/images/icons/google.png" />
          </div>
          <!--div>Sign up with<i class="fab fa-facebook" @click="loginWith('facebook')"></i></div-->
        </div>
        <div class="lmp-or">
          <p>Or</p>
        </div>
        <fieldset :disabled="isLoggingIn">
          <div class="row w-100">
            <div class="col-md-6">
              <div class="form-group">
                <label for="lmp-name">Full name</label>
                <input
                  id="lmp-name"
                  class="form-control"
                  type="text"
                  placeholder="Full name"
                  v-model="name"
                />
                <small v-if="registerButtonClicked && !name" class="cv-error"
                  ><i class="fas fa-exclamation-circle"></i> Name is
                  required.</small
                >
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="lmp-password">Username</label>
                <input
                  id="lmp-username"
                  class="form-control"
                  type="text"
                  placeholder="Username"
                  v-model="usernameRegister"
                />
                <small
                  v-if="registerButtonClicked && !usernameRegister"
                  class="cv-error"
                  ><i class="fas fa-exclamation-circle"></i> Username is
                  required.</small
                >
              </div>
            </div>
          </div>

          <div class="row w-100">
            <div class="col-md-6">
              <div class="form-group">
                <label for="lmp-email">Email</label>
                <input
                  id="lmp-email"
                  class="form-control"
                  type="text"
                  placeholder="Email"
                  v-model="email"
                />
                <small
                  v-if="registerButtonClicked && !validateEmail(email)"
                  class="cv-error"
                  ><i class="fas fa-exclamation-circle"></i> Enter valid email
                  address.</small
                >
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="lmp-phone">Phone</label>
                <input
                  id="lmp-phone"
                  class="form-control"
                  type="number"
                  placeholder="Phone"
                  v-model="phone"
                />
                <small
                  v-if="registerButtonClicked && !validatePhone(phone)"
                  class="cv-error"
                  ><i class="fas fa-exclamation-circle"></i> Enter valid phone
                  number.</small
                >
              </div>
            </div>
          </div>

          <div class="row w-100">
            <div class="col-md-6">
              <div class="form-group" style="position: relative">
                <label for="lmp-password">Password</label>
                <input
                  id="lmp-password"
                  class="form-control"
                  :type="showRegPassword ? 'text' : 'password'"
                  placeholder="Password"
                  v-model="passwordRegister"
                />
                <i
                  :class="'fa ' + (showRegPassword ? 'fa-eye-slash' : 'fa-eye')"
                  style="position:absolute; right:6px; bottom:12px; cursor:pointer"
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
            </div>
            <div class="col-md-6">
              <div class="form-group" style="position: relative">
                <label for="lmp-password">Re-enter password</label>
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
                  style="position:absolute; right:6px; bottom:12px; cursor:pointer"
                  @click="showConfPassword = !showConfPassword"
                ></i>
                <small
                  v-if="registerButtonClicked && repasswordErrorMsg"
                  class="cv-error"
                  ><i class="fas fa-exclamation-circle"></i>
                  {{ repasswordErrorMsg }}</small
                >
              </div>
            </div>
          </div>
          <div class="d-flex flex-column w-100 align-items-center">
            <button
              id="register-btn"
              class="btn btn-primary w-100"
              style="max-width: 300px;"
              @click="doRegister($event)"
            >
              Sign up
            </button>
            <i class="flex-filler"></i>
            <div
              id="register-now-wrapper"
              class="row w-100 align-items-center justify-content-center"
            >
              <span>Existing user?</span>
              <button
                href="#"
                id="login-now"
                class="btn btn-link"
                @click="changeFormMode($event, 'login')"
              >
                Log in
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>

    <Footer />
    <!--active--->
    <!-- small Modal -->
    <div id="inactiveMessage" class="modal fade">
      <div class="modal-dialog modal-sm" id="activeform" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h6 class="tx-14 mg-b-0 tx-uppercase tx-inverse tx-bold">
              {{ active == 1 ? "Inactive Account" : "Info" }}
            </h6>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <template v-if="active == 1">
              <p>Update the info to active your account.</p>
            </template>
            <template v-if="active == 2">
              <div class="card-body row">
                <div class=" form-group col-xl-12">
                  <label class="form-label text-dark" id="name" required
                    >Full Name</label
                  >
                  <input
                    type="text"
                    id="name"
                    class="form-control"
                    placeholder="Full Name"
                    v-model="aname"
                  />
                  <small v-if="registerButtonClicked && !aname" class="cv-error"
                    ><i class="fas fa-exclamation-circle"></i> Name is
                    required.</small
                  >
                </div>
                <div class="form-group col-xl-6">
                  <label class="form-label text-dark">Gender</label>
                  <select class="form-control" id="agender">
                    <option
                      value="Male"
                      :selected="
                        agender == 'male' || agender == 'Male' ? true : false
                      "
                      >Male</option
                    >
                    <option
                      value="Female"
                      :selected="
                        agender == 'female' || agender == 'Female'
                          ? true
                          : false
                      "
                      >Female</option
                    >
                    <option
                      value="Other"
                      :selected="
                        agender == 'other' || agender == 'Other' ? true : false
                      "
                      >Other</option
                    >
                    <option
                      value="Do not want to disclose"
                      :selected="
                        agender == 'do not want to disclose' ||
                        agender == 'Do not want to disclose'
                          ? true
                          : false
                      "
                      >Do not want to disclose</option
                    >
                  </select>
                </div>

                <div class="form-group col-xl-6">
                  <label class="form-label text-dark">Grade</label>
                  <select class="form-control" id="agrade">
                    <option
                      value="Nursery"
                      :selected="agrade == 11 ? true : false"
                      >Grade Nursery</option
                    >
                    <option value="LKG" :selected="agrade == 12 ? true : false"
                      >Grade LKG</option
                    >
                    <option value="UKG" :selected="agrade == 12 ? true : false"
                      >Grade UKG</option
                    >
                    <option value="1" :selected="agrade == 1 ? true : false"
                      >Grade 1</option
                    >
                    <option value="2" :selected="agrade == 2 ? true : false"
                      >Grade 2</option
                    >
                    <option value="3" :selected="agrade == 3 ? true : false"
                      >Grade 3</option
                    >
                    <option value="4" :selected="agrade == 4 ? true : false"
                      >Grade 4</option
                    >
                    <option value="5" :selected="agrade == 5 ? true : false"
                      >Grade 5</option
                    >
                    <option value="6" :selected="agrade == 6 ? true : false"
                      >Grade 6</option
                    >
                    <option value="7" :selected="agrade == 7 ? true : false"
                      >Grade 7</option
                    >
                    <option value="8" :selected="agrade == 8 ? true : false"
                      >Grade 8</option
                    >
                    <option value="9" :selected="agrade == 9 ? true : false"
                      >Grade 9</option
                    >
                    <option value="10" :selected="agrade == 10 ? true : false"
                      >Grade 10</option
                    >
                  </select>
                </div>

                <div class="form-group col-xl-12">
                  <label class="form-label text-dark">Mobile Number</label>
                  <input
                    type="text"
                    id="contact"
                    class="form-control"
                    placeholder="Enter 10 digit mobile number"
                    v-model="aphone"
                  />
                  <small
                    v-if="registerButtonClicked && !validatePhone(aphone)"
                    class="cv-error"
                    ><i class="fas fa-exclamation-circle"></i> Enter valid phone
                    number.</small
                  >
                </div>
                <div class="form-group col-xl-12">
                  <label class="form-label text-dark">Father's Mobile No</label>
                  <input
                    type="text"
                    id="city"
                    class="form-control"
                    placeholder="Father's Mobile No"
                    v-model="afphone"
                    required
                  />
                  <small
                    v-if="registerButtonClicked && !validatePhone(afphone)"
                    class="cv-error"
                    ><i class="fas fa-exclamation-circle"></i> Enter valid phone
                    number.</small
                  >
                </div>
                <div class="form-group col-xl-12">
                  <label class="form-label text-dark">Father's Email ID</label>
                  <input
                    type="text"
                    id="f_email"
                    class="form-control"
                    placeholder="Father's Email ID"
                    v-model="afemail"
                  />
                  <small
                    v-if="registerButtonClicked && !validateEmail(afemail)"
                    class="cv-error"
                    ><i class="fas fa-exclamation-circle"></i> Enter valid email
                    address.</small
                  >
                </div>
                <!--  <div class="text-center  mt-3 text-dark">
                    Already have account?<a href="register.html">SignIn</a>
                  </div>-->
              </div>
            </template>
          </div>
          <!-- modal-body -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              value="update"
              @click="activeUser($event)"
            >
              Update
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
      <!-- modal-dialog -->
    </div>
    <!-- modal -->
    <div
      class="modal fade"
      id="inactiveForm"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <!--  <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="example-Modal3">New message</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="recipient-name" class="form-control-label"
                  >Recipient:</label
                >
                <input type="text" class="form-control" id="recipient-name" />
              </div>
              <div class="form-group">
                <label for="message-text" class="form-control-label"
                  >Message:</label
                >
                <textarea class="form-control" id="message-text"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button type="button" class="btn btn-primary">Send message</button>
          </div>
        </div>-->
      </div>
    </div>
    <!--inActive Registyer-->
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
      username: "",
      usernameRegister: "",
      email: "",
      phone: "",
      password: "",
      passwordRegister: "",
      repassword: "",
      passwordErrorMsg: "",
      userId: "",
      active: 1,

      repasswordErrorMsg: "",
      showPassword: false,
      showRegPassword: false,
      showConfPassword: false,
      aname: "",
      aphone: "",
      agender: "",
      agrade: "",
      afphone: "",
      afemail: "",
      ausername: "",
      auserId: ""
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
            if (res.data == "inactive_user") {
              vm.isLoggingIn = false;
              $("#inactiveMessage").modal("show");
              axios
                .post("/api/auth/getUserdata", {
                  username: username,
                  password: password
                })
                .then(data => {
                  vm.aname = data.data[0].name;
                  vm.agender = data.data[0].sex;
                  vm.agrade = data.data[0].cls_id;
                  vm.aphone = data.data[0].contact;
                  vm.afphone = data.data[0].fcontact_no;
                  vm.afemail = data.data[0].father_email_id;
                  vm.auserId = data.data[0].user_id;
                });
            } else {
              vm.onLoggedIn(res.data);
            }
          }
        })
        .catch(function(err) {
          if (err.response.status == 400) {
            vm.passwordErrorMsg = "Incorrect username or password.";
          }
          vm.isLoggingIn = false;
        });
    },
    activeUser(e) {
      if ($(e.target).val() == "update") {
        $(e.target).val("activate");
        $(e.target).text("Activate");
        var element = document.getElementById("activeform");
        element.classList.remove("modal-sm");
        this.active = 2;
      } else {
        //  $(e.target).val("active");
        //  var element = document.getElementById("activeform");
        //        element.classList.add("modal-sm");
        //      $(e.target).text("Update");
        //    this.active = 1;
        e.preventDefault();
        this.registerButtonClicked = true;
        var canSubmit = true;
        if (!this.aname) {
          canSubmit = false;
        }
        if (!this.validatePhone(this.aphone)) {
          canSubmit = false;
        }
        if (!this.validatePhone(this.afphone)) {
          canSubmit = false;
        }
        if (!this.validateEmail(this.afemail)) {
          canSubmit = false;
        }
        if (!canSubmit) return;
        else {
          let grade = $("#agrade").val();
          let gender = $("#gender").val();

          axios
            .post("/api/auth/useractivation", {
              user_id: this.auserId,
              name: this.aname,
              gender: gender,
              grade: grade,
              contact: this.aphone,
              f_contact: this.afphone,
              f_email_id: this.afemail
            })
            .then(data => {
              $("#inactiveMessage").modal("hide");
              cvNotify("successfully activated!", "success");
            });
        }
      }

      // $("#inactiveMessage").modal("hide");
      //$("#inactiveForm").modal("show");
      /* var element = document.getElementById("myDIV");
  element.classList.remove("mystyle"); */
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
      var vm = this;
      axios
        .post("/api/auth/registerUser", {
          username: this.usernameRegister,
          name: this.name,
          email: this.email,
          contact: this.phone,
          password: this.passwordRegister
        })
        .then(function(res) {
          // vm.$ga.event("register", "username-password", "register", 1);
          window.open("/", "_self");
        })
        .catch(err => {
          vm.isLoggingIn = false;
          if (err.response.body == "already_exists") {
            window.cvNotify("User already exists.", "error");
          }
        });
    },
    initGoogleSignin: function() {
      var vm = this;

      //setTimeout(function() {
      // Using setTimeout because gapi is not defined otherwise
      try {
        gapi.load("auth2", function() {
          gapi.auth2
            .init({
              client_id:
                "727076687673-qak299svdbrfe8svd6go6ikqnn6h8ins.apps.googleusercontent.com",
              scope:
                "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"
            })
            .then(
              function(success) {
                vm.gapiLoaded = true;
              },
              // On error
              function(error) {}
            );
        });
      } catch (e) {}
      //}, 1000);
    },
    loginWith(options) {
      var vm = this;
      this.password = "";
      if (options.with == "google") {
        if (!this.gapiLoaded) return;
        this.isLoggingIn = true;
        try {
          gapi.auth2
            .getAuthInstance()
            .signOut()
            .then(function() {
              vm.startGoogleSignin(options.action);
            });
        } catch (err) {
          vm.startGoogleSignin(options.action);
        }
      } else if (options.with == "facebook") {
        this.isLoggingIn = true;
        FB.login(function(response) {
          if (response.authResponse) {
            var token = response.authResponse.accessToken;
            vm.loginWithFacebookIdToken({
              action: options.action,
              token: token
            });
          } else {
            var x = 5;
          }
        });
      }
    },
    startGoogleSignin(action) {
      var vm = this;
      gapi.auth2
        .getAuthInstance()
        .signIn()
        .then(
          // On success
          function(googleUser) {
            var token = googleUser.getAuthResponse().id_token;
            vm.loginWithGoogleIdToken({
              action: action,
              token: token
            });
          },
          // On error
          function(error) {
            vm.isLoggingIn = false;
          }
        );
    },
    loginWithGoogleIdToken(data) {
      var vm = this;
      axios
        .post("/api/auth/loginWithGoogle", {
          action: data.action,
          token: data.token
        })
        .then(function(res) {
          if (!res.data)
            cvNotify("New Registrations are temporarily disabled.", "warning");
          else vm.onLoggedIn(res.data);
        })
        .catch(err => {
          vm.isLoggingIn = false;
          if (err && err.body) {
            if (err.body.error == "user_not_found") {
              window.cvNotify("You are not registered.", "error");
            }
            if (err.body.error == "user_already_exists") {
              window.cvNotify("You are already registered.", "error");
            }
          }
        });
    },
    loginWithFacebookIdToken(data) {
      this.$http
        .post("/api/user/loginWithFacebook", {
          action: data.action,
          token: data.token
        })
        .then(function(res) {
          this.$ga.event("login", "facebook", "login", 1);
          this.auth_setToken(res.body.token);
          this.auth_checkToken();
        })
        .catch(err => {
          if (err && err.body) {
            if (err.body.error == "user_not_found") {
              window.cvNotify("You are not registered.", "error");
            }
            if (err.body.error == "user_already_exists") {
              window.cvNotify("You are already registered.", "error");
            }
            if (err.body.error == "no_email") {
              window.cvNotify(
                "This Facebook account does not have an email id.",
                "error"
              );
            }
          }
        });
    },
    onLoggedIn(userData) {
      // this.saveUserData(userData);
      var redirect = new URL(window.location).searchParams.get("redirect");
      if (redirect) {
        window.open(decodeURIComponent(redirect), "_self");
      } else {
        if (userData.role_id == 3) {
          window.open("/dashboard", "_self");
        } else if (userData.role_id == 2) {
          window.open("/teacher-dashboard", "_self");
        } else if (userData.role_id == 1) {
          window.open("/schooladmin-dashboard", "_self");
        }
      }
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
