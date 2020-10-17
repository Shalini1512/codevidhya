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

        <div class="lmp-or">
          <p>Or</p>
        </div>
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

          <div class="form-group">
            <label for="lmp-password">Password</label>
            <input
              id="lmp-password"
              class="form-control"
              type="password"
              placeholder="Enter password"
              v-model="password"
              @input="password ? (passwordErrorMsg = '') : ''"
            />
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
              <div class="form-group">
                <label for="lmp-password">Password</label>
                <input
                  id="lmp-password"
                  class="form-control"
                  type="password"
                  placeholder="Password"
                  v-model="passwordRegister"
                />
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
              <div class="form-group">
                <label for="lmp-password">Re-enter password</label>
                <input
                  id="lmp-repassword"
                  class="form-control"
                  type="password"
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
      repasswordErrorMsg: ""
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
          //vm.saveUserData(res.data);
          vm.onLoggedIn();
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
              apiKey: "AIzaSyBn5nqy-mtg75Xz_GvyzaCkAgCmFW33-ck",
              client_id:
                "764117490764-cki4kqk4nth9d76750lbqp4uv23igb83.apps.googleusercontent.com",
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
          vm.onLoggedIn();
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
        window.open("/", "_self");
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
