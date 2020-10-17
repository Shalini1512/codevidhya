<template>
  <div>
    <Header />
    <ProgressTop v-if="processing" />

    <div id="reset-password-root">
      <form v-if="!passwordResetDone && !emailSent">
        <h3>Reset password</h3>
        <template v-if="token">
          <fieldset class="w-100" :disabled="processing">
            <div class="form-group w-100">
              <label for="password">New password</label>
              <input
                id="password"
                class="form-control"
                type="password"
                v-model="password"
              />
              <small
                v-if="setPasswordClicked && getPasswordInvalid(password)"
                class="cv-error"
                ><i class="fas fa-exclamation-circle"></i>
                {{ getPasswordInvalid(password) }}</small
              >
            </div>

            <div class="form-group w-100">
              <label for="repassword">Confirm password</label>
              <input
                id="repassword"
                class="form-control"
                type="password"
                v-model="repassword"
              />
              <small
                v-if="
                  setPasswordClicked && (!repassword || repassword != password)
                "
                class="cv-error"
                ><i class="fas fa-exclamation-circle"></i>
                {{
                  !repassword
                    ? "Re-enter password."
                    : repassword != password
                    ? "Passwords do not match."
                    : "Re-enter password."
                }}</small
              >
            </div>
            <div class="text-center">
              <button class="btn btn-primary" @click="doPasswordReset($event)">
                Reset password
              </button>
            </div>
          </fieldset>
        </template>

        <template v-else>
          <fieldset class="w-100" :disabled="processing">
            <div class="form-group w-100">
              <label for="email"
                >Enter the email address assosciated with your account
                below.</label
              >
              <input
                id="email"
                class="form-control"
                type="email"
                placeholder="Enter email"
                v-model="email"
              />
              <small
                v-if="sendEmailClicked && !validateEmail(email)"
                class="cv-error"
                ><i class="fas fa-exclamation-circle"></i> Please enter a valid
                email.</small
              >
            </div>
            <div class="text-center">
              <button
                id="login-btn"
                class="btn btn-primary"
                @click="sendPasswordResetEmail($event)"
              >
                Send password reset email
              </button>
            </div>
          </fieldset>
        </template>
      </form>
      <div v-else-if="emailSent" id="password-reset-success">
        <p>
          A link to reset your password has been sent to your email address.
        </p>
        <button class="btn btn-secondary" @click="$router.push('/login')">
          <i class="fas fa-arrow-left"></i>Back to Login page
        </button>
      </div>
      <div v-else-if="passwordResetDone" id="password-reset-success">
        <p style="margin-bottom: 24px">Password changed successfully.</p>
        <button class="btn btn-secondary" @click="$router.push('/login')">
          <i class="fas fa-arrow-left"></i>Back to Login page
        </button>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import Footer from "@/components/footer/Footer.vue";
import ProgressTop from "@/components/widgets/ProgressTop.vue";

import axios from "axios";

export default {
  name: "home",
  components: {
    Header,
    Footer,
    ProgressTop
  },
  data() {
    return {
      processing: false,
      token: "",
      tokenValid: false,
      emailError: false,
      passwordError: false,
      repasswordError: false,
      email: "",
      password: "",
      repassword: "",
      passwordErrorMsg: "",
      repasswordErrorMsg: "",
      emailSent: false,
      passwordResetDone: false,
      sendEmailClicked: false,
      setPasswordClicked: false
    };
  },
  mounted() {
    this.token = new URL(window.location).searchParams.get("token");
  },
  methods: {
    validateEmail(email) {
      return validateEmail(email);
    },
    getPasswordInvalid(password) {
      return getPasswordInvalid(password);
    },
    sendPasswordResetEmail(e) {
      e.preventDefault();
      var vm = this;
      this.sendEmailClicked = true;
      if (!this.email) {
        return;
      }
      if (this.processing) return;
      this.processing = true;
      axios
        .post("/api/auth/sendPasswordResetEmail", {
          email: this.email
        })
        .then(function(res) {
          vm.emailSent = true;
          vm.processing = false;
        })
        .catch(err => {
          vm.processing = false;
        });
    },
    doPasswordReset(e) {
      e.preventDefault();
      this.setPasswordClicked = true;
      var canSubmit = true;
      if (!this.password) {
        canSubmit = false;
      }

      if (!this.repassword && this.password != this.repassword) {
        canSubmit = false;
      }

      if (!canSubmit) return;

      this.sendPasswordResetRequest();
    },
    sendPasswordResetRequest() {
      var vm = this;
      if (this.processing) return;
      this.processing = true;
      axios
        .post("/api/auth/resetPassword", {
          token: this.token,
          password: this.password
        })
        .then(function(res) {
          vm.processing = false;
          vm.passwordResetDone = true;
        })
        .catch(function(err) {
          vm.processing = false;
          if (err.response.data == "invalid_token")
            cvNotify("Token invalid or expired.", "error");
          else cvNotify("Failed to reset password.", "error");
        });
    }
  }
};
</script>

<style lang="scss">
#reset-password-root {
  min-height: 100%;
  padding: 24px;
  form {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 480px;
    margin: 64px auto 24px;
    padding: 32px;
    border: none;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    &#lmp-login-form {
      max-width: 400px;
      margin: 0 auto;
    }
  }
  h3 {
    margin-bottom: 16px;
    font-weight: 700;
    font-size: 2rem;
    line-height: 1;
    text-align: center;
  }
  fieldset:disabled button {
    cursor: default;
  }
  #password-reset-success {
    max-width: 600px;
    margin: 64px auto 24px;
    padding: 32px;
    background: #fff;
    color: #444;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    p {
      margin-bottom: 24px;
      font: 700 1.6rem/1 "Poppins", sans-serif;
    }
    button {
      i {
        margin-right: 16px;
      }
    }
  }
}
</style>
