<template>
  <div class="w-100">
    <Header />
    <ProgressTop v-if="processing" />
    <div
      id="reset-password-root text-center row"
      class="h-100"
      style="min-height:100%; margin-top:59px; "
    >
      <div class="w-100 text-center pb-3 pt-4">
        <div class="circle-loader">
          <div class="checkmark draw"></div>
        </div>
        <p class="text-success mail-text" style="display:none">
          Email Verified
        </p>
        <p>
          <button
            id="toggle"
            type="button"
            class="btn btn-primary mt-3"
            @click="completeLoad()"
          >
            Dashboard
          </button>
        </p>
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
  name: "active-mail",
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
      userId: "",
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
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.token = new URL(window.location).searchParams.get("token");
          if (!this.token) {
            this.$router.back();
          }
          this.verifyEmail(this.token, userId);
        }
      }.bind(this)
    );
    if (!this.userId) {
      if (!this.token) {
        this.$router.back();
      } else {
        this.$router.push(
          "/login?redirect=" + encodeURIComponent(window.location.href)
        );
      }
      return;
    }
  },
  updated() {},
  methods: {
    completeLoad() {
      let vm = this;
      $(".circle-loader").toggleClass("load-complete");
      $(".checkmark").toggle();
      $(".mail-text").toggle();
      setInterval(this.$router.push("/dashboard"), 1000);
    },
    verifyEmail(token, userId) {
      axios
        .post("/api/profile/verifyToken", { token: token, user_id: userId })
        .then(res => {
          if (res.data == "invalid_token") {
            cvNotify("Time Out", "error");
            setInterval(this.$router.push("/dashboard"), 1000);
          } else {
            cvNotify("email verified", "success");
            this.completeLoad();
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
// This is just styling for this demo
body {
  padding: 5em;
  text-align: center;
}

h1 {
  margin-bottom: 1em;
}

// Define vars we'll be using
$brand-success: #5cb85c;
$loader-size: 7em;
$check-height: $loader-size/2;
$check-width: $check-height/2;
$check-left: ($loader-size/6 + $loader-size/12);
$check-thickness: 3px;
$check-color: $brand-success;

.circle-loader {
  margin-bottom: $loader-size/4;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-left-color: $check-color;
  animation: loader-spin 1.2s infinite linear;
  position: relative;
  display: inline-block;
  vertical-align: top;
  border-radius: 50%;
  width: $loader-size;
  height: $loader-size;
}

.load-complete {
  -webkit-animation: none;
  animation: none;
  border-color: $check-color;
  transition: border 500ms ease-out;
}

.checkmark {
  display: none;

  &.draw:after {
    animation-duration: 800ms;
    animation-timing-function: ease;
    animation-name: checkmark;
    transform: scaleX(-1) rotate(135deg);
  }

  &:after {
    opacity: 1;
    height: $check-height;
    width: $check-width;
    transform-origin: left top;
    border-right: $check-thickness solid $check-color;
    border-top: $check-thickness solid $check-color;
    content: "";
    left: $check-left;
    top: $check-height;
    position: absolute;
  }
}

@keyframes loader-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes checkmark {
  0% {
    height: 0;
    width: 0;
    opacity: 1;
  }
  20% {
    height: 0;
    width: $check-width;
    opacity: 1;
  }
  40% {
    height: $check-height;
    width: $check-width;
    opacity: 1;
  }
  100% {
    height: $check-height;
    width: $check-width;
    opacity: 1;
  }
}
</style>
