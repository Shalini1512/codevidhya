<template>
  <div>
    <Header>
      <HeaderContent />
    </Header>

    <div class="sptb bg-white">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="row">
              <div class="col-lg-8 col-md-12 mb-5" style="margin: auto !important;">
                <div class="card border-0 text-white">
                  <div class="support-service bg-primary">
                    <div class="support-service bg-primary">
                      <i class="fas fa-phone"></i>
                      <h6 class="m-2">+91 7357286330</h6>
                      <h6 class="m-2">contact@codevidhya.com</h6>
                      <P class="pl-5" style="color: #fff; size: 16px;">Talk to our Representative for Queries / Sales / Schools</P
                      >
                    </div>
                  </div>

                  <h3 class="text-danger mt-5 mb-3 font-weight-semibold">
                    Codevidhya India Private Limited
                  </h3>
                  <h4 class="text-grey">
                    <strong>Corporate Office</strong>
                  </h4>
                  <p class="text-dark mt-1">
                    Codevidhya India (P) Limited,<br>
                    2<sup>nd</sup> Floor, 96, Officers Campus,<br>
                    Sirsi Road, Vaishali Nagar, 
                    Jaipur - 302021, <br> Rajasthan, India.
                  </p>

                  <!--<hr />

                <h4 class="text-dark">
                  <strong>Registered Office</strong>
                </h4>
                <p>
                  Codevidhya Private Limited, G1, Ground Floor, IRIS Tower,
                  Todinagar, Sikar (Rajasthan) India.
                </p>-->
                </div>
                <div class="col-lg-12 col-md-12">
                  <h2 class="text-center">Write to us!</h2>
                  <div class="card mb-0">
                    <div class="card-body">
                      <div class="form-group">
                        <label class="form-label" for="exampleInputPassword1"
                          >Full Name</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          id="name1"
                          placeholder="Your Name"
                          v-model="fullName"
                        />
                        <small
                          v-if="contactFormSubmitClicked && !fullName"
                          class="cv-error"
                          >Please enter full name.</small
                        >
                      </div>
                      <div class="form-group">
                        <label class="form-label" for="exampleInputPassword1"
                          >Phone Number</label
                        >
                        <input
                          type="Number"
                          class="form-control"
                          id="exampleInputnumber"
                          placeholder="Phone Number"
                          v-model="phone"
                          minlength="10"
                          required
                        />
                        <small
                          v-if="
                            contactFormSubmitClicked && !validatePhone(phone)
                          "
                          class="cv-error"
                          >Please enter valid phone number.</small
                        >
                      </div>
                      <div class="form-group">
                        <label class="form-label" for="exampleInputPassword1"
                          >Email Address</label
                        >
                        <input
                          type="email"
                          class="form-control"
                          id="email"
                          placeholder="Email Address"
                          v-model="email"
                          required
                        />
                        <small
                          v-if="
                            contactFormSubmitClicked && !validateEmail(email)
                          "
                          class="cv-error"
                          >Please enter valid email address.</small
                        >
                      </div>
                     
                      <div class="form-group">
                        <label class="form-label" for="exampleInputPassword1"
                          >Message</label
                        >
                        <textarea
                          class="form-control"
                          name="example-textarea-input"
                          rows="4"
                          placeholder="Message"
                          v-model="message"
                          required
                        ></textarea>
                        <!-- <small
                          v-if="contactFormSubmitClicked"
                          class="cv-error"
                          >Message cannot be left empty</small
                        > -->
                      </div>
                      <div class="form-group">
                        <div class="text-center" style="">
                          <button
                            type="submit"
                            class="btn btn-primary mt-3 center"
                            @click="sendContactUsMessage()"
                          >
                            Send Message
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/contact-us/HeaderContent.vue";
import Footer from "@/components/footer/Footer.vue";

import axios from "axios";

export default {
  name: "home",
  components: {
    Header,
    HeaderContent,
    Footer
  },
  data: function() {
    return {
      contactFormSubmitClicked: false,
      fullName: "",
      email: "",
      phone: "",
      message: ""
    };
  },
  mounted() {},
  methods: {
    validateEmail(email) {
      return window.validateEmail(email);
    },
    validatePhone(phone) {
      return window.validatePhone(phone);
    },
    sendContactUsMessage() {
      this.contactFormSubmitClicked = true;
      var canSend = true;
      if (!this.fullName) {
        canSend = false;
      }
      if (!window.validatePhone(this.phone)) {
        canSend = false;
      }
      if (!window.validateEmail(this.email)) {
        return;
      }
      // if (!this.message) {
      //   canSend = false;
      // }
      if (!canSend) {
        window.cvNotify("Please provide all details.", "error");
        return;
      }
     
      axios
        .post("/api/user/sendContactUsMessage", {
          name: this.fullName,
          email: this.email,
          phone: this.phone,
          message: this.message
        })
        .then(() => {
          this.fullName = "";
          this.email = "";
          this.phone = "";
          this.message = "";
          window.cvNotify(
            "Thanks for reaching out to us. We will get back to you as soon as possible."
          );
        })
        .catch(() => {
          window.cvNotify("Sorry, your message could not be sent.", "error");
        });
    }
  }
};
</script>
