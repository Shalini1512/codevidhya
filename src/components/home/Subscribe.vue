<template>
  <section>
    <div
      class="cover-image sptb bg-background-color"
      data-image-src="/assets/images/banners/banner4.jpg"
    >
      <div class="content-text mb-0">
        <div class="content-text mb-0">
          <div class="container">
            <div class="text-center text-white">
              <h2 class="mb-4">Subscribe</h2>
              <p class="fs-16">
                Get first dibs on updates from Coding, IOT, AI and ML,
                Innovations in Education as soon as they're published.
              </p>
              <div class="row">
                <div class="col-lg-8 mx-auto d-block">
                  <div class="mt-5 text-left">
                    <div class="input-group sub-input mt-1">
                      <input
                        type="email"
                        class="form-control input-lg"
                        placeholder="Enter your Email"
                        v-model="email"
                      />
                      <div class="input-group-append">
                        <button
                          type="button"
                          class="btn btn-primary btn-lg br-tr-3 br-br-3"
                          @click="sendSubscriptionRequest()"
                        >
                          Subscribe
                        </button>
                      </div>
                    </div>

                    <span
                      v-if="submitFormClicked && !validateEmail(email)"
                      class="cv-error"
                      >Please enter a valid email address.</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      email: "",
      submitFormClicked: false
    };
  },
  methods: {
    validateEmail(email) {
      return window.validateEmail(email);
    },
    sendSubscriptionRequest() {
      var vm = this;
      this.submitFormClicked = true;
      if (!window.validateEmail(this.email)) {
        return;
      }
      axios
        .post("/api/user/doEmailSubscription", { email: this.email })
        .then(() => {
          vm.submitFormClicked = false;
          vm.email = "";
          window.cvNotify(
            "Congratulations! You are now subscribed to our promotions and offers."
          );
        })
        .catch(err => {
          if (err.response.data == "already_subscribed") {
            vm.submitFormClicked = false;
            vm.email = "";
            window.cvNotify("You are already subscribed.");
            return;
          }
          window.cvNotify(
            "Sorry, we couldn't add you to our subscriptions.",
            "error"
          );
        });
    }
  }
};
</script>

<style scoped>
h2 {
  font-weight: bold;
}
</style>
