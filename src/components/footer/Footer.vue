<template>
  <section>
    <footer class="bg-dark text-white">
      <div class="footer-main">
        <div class="container">
          <div class="row">
            <div class="col-lg-3 col-md-12">
              <h6>About</h6>
              <hr
                class="deep-purple accent-3 mb-4 mt-0 d-inline-block mx-auto"
              />
              <p>
                Codevidhya equips students age 6 to 16 with programming skills
                to hone their Computational Thinking Skills & Problem Solving
                Skills to ensure success in the Algorithms economy.
              </p>
            </div>
            <div class="col-lg-2 col-md-12">
              <h6>Company</h6>
              <hr
                class="deep-purple text-primary accent-3 mb-4 mt-0 d-inline-block mx-auto"
              />
              <ul class="list-unstyled mb-0">
                <li>
                  <router-link to="/about-us">About Us</router-link>
                </li>
                <li>
                  <router-link to="/contact">Contact Us</router-link>
                </li>
                <li>
                  <router-link to="/team">Our Team</router-link>
                </li>
                 <li>
                <router-link to="/projects">Projects</router-link>
              </li>
               <li>
                <router-link to="/for-parents">For Parents</router-link>
              </li>
               <!--<li>
                <router-link to="/for-parents">Feature Projects</router-link>
              </li>-->
                <li>
                  <router-link to="/terms-of-use">Terms of Use</router-link>
                </li>
                <li>
                  <router-link to="/faq">FAQ</router-link>
                </li>
                <li>
                  <router-link to="/privacy-policy">Privacy Policy</router-link>
                </li>
                <li>
                  <router-link to="/payment&refund-policy">Payment & Refund Policy</router-link>
                </li>
                
              </ul>
            </div>
            <div class="col-lg-1"></div>
            <div class="col-lg-3 col-md-12">
              <h6>Contact</h6>
              <hr
                class="deep-purple text-primary accent-3 mb-4 mt-0 d-inline-block mx-auto"
              />
              <ul class="list-unstyled mb-0">
                <li>
                  <a href="https://www.google.com/maps/search/?api=1&query=codevidhya" target="_blank">
                    <i class="fas fa-home mr-3 text-primary"></i> 2<sup>nd</sup> floor, 96, Officers
                    Campus, Sirsi Road, Vaishali Nagar, Jaipur - 302021, Rajasthan, India. 
                  </a>
                </li>
                <li>
                  <a href="mailto:contact@codevidhya.com">
                    <i class="fas fa-envelope mr-3 text-primary"></i>
                    contact@codevidhya.com
                  </a>
                </li>
                <li>
                  <a href="tel:+917357286330">
                    <i class="fas fa-phone mr-3 text-primary"></i> +91
                    7357286330
                  </a>
                </li>
              </ul>
              <ul class="list-unstyled list-inline mt-3">
                <li class="list-inline-item">
                  <a
                    class="btn-floating btn-sm rgba-white-slight mx-1 waves-effect waves-light"
                    href="http://facebook.com/codevidhya"
                    target="_blank"
                  >
                    <i class="fab fa-facebook"></i>
                  </a>
                </li>
                <li class="list-inline-item">
                  <a
                    class="btn-floating btn-sm rgba-white-slight mx-1 waves-effect waves-light"
                    href="http://twitter.com/codevidhya"
                    target="_blank"
                  >
                    <i class="fab fa-twitter"></i>
                  </a>
                </li>
                <li class="list-inline-item">
                  <a
                    class="btn-floating btn-sm rgba-white-slight mx-1 waves-effect waves-light"
                    href="http://instagram.com/codevidhya"
                    target="_blank"
                  >
                    <i class="fab fa-instagram"></i>
                  </a>
                </li>
                <li class="list-inline-item">
                  <a
                    class="btn-floating btn-sm rgba-white-slight mx-1 waves-effect waves-light"
                    href="http://linkedin.com/company/codevidhya"
                    target="_blank"
                  >
                    <i class="fab fa-linkedin"></i>
                  </a>
                </li>
              </ul>
            </div>
            <div class="col-lg-3 col-md-12">
              <h6>Payments</h6>
              <hr
                class="deep-purple text-primary accent-3 mb-4 mt-0 d-inline-block mx-auto"
              />
              <div class="clearfix"></div>
              <ul class="footer-payments">
                <li class="pl-0">
                  <a href="javascript:;">
                    <i class="fab fa-cc-amex" aria-hidden="true"></i>
                  </a>
                </li>
                <li>
                  <a href="javascript:;">
                    <i class="fab fa-cc-visa" aria-hidden="true"></i>
                  </a>
                </li>
                <li>
                  <a href="javascript:;">
                    <i class="fas fa-credit-card" aria-hidden="true"></i>
                  </a>
                </li>
                <li>
                  <a href="javascript:;">
                    <i class="fab fa-cc-mastercard" aria-hidden="true"></i>
                  </a>
                </li>
                <li>
                  <a href="javascript:;">
                    <i class="fab fa-cc-paypal" aria-hidden="true"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
              <!-- <h6>Subscribe</h6>
              <hr
                class="deep-purple text-primary accent-3 mb-4 mt-0 d-inline-block mx-auto"
              />
              <div class="clearfix"></div>
              <div class="input-group w-100">
                <input
                  type="email"
                  class="form-control br-tl-3 br-bl-3"
                  placeholder="Email"
                  v-model="email"
                />
                <div class="input-group-append">
                  <button
                    type="button"
                    class="btn btn-primary br-tr-3 br-br-3"
                    @click="sendSubscriptionRequest()"
                  >
                    Subscribe
                  </button>
                </div>
                <span
                  v-if="submitFormClicked && !validateEmail(email)"
                  class="cv-error w-100"
                  >Please enter a valid email address.</span
                >
              </div> -->
      </div>
      <div class="bg-dark text-white p-0">
        <div class="container">
          <div class="row d-flex">
            <div class="col-lg-12 col-sm-12 mt-3 mb-3 text-center">
              Copyright © Codevidhya | Codevidhya India Pvt.Ltd | All rights
              reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  </section>
</template>

<script>
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
      this.$http
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
