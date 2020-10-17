<template>
  <div>
    <Header>
      <HeaderContent />
    </Header>
    <div class="card">
      <div class="card-header justify-content-center" style="border: none;">
        <h2 style="font-weight: 700; padding-top: 6px;">
          Want to implement Coding Curriculum in School?
        </h2>
      </div>
      <div class="card-header justify-content-center">
        <h4>Fill the following form so that we can get in touch with you.</h4>
      </div>
      <div class="card-body">
        <form id="RequestForDemo" class="card-body" tabindex="500">
          <div class="form-row">
            <div class="form-group col-md-6">
              <div class="form-group">
                <label class="form-label" for="full-name">
                  Full Name
                  <span style="color: #ee0000;">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="full-name"
                  placeholder="Full Name"
                  maxlength="100"
                  v-model="demoFullname"
                  required
                />
                <small
                  v-if="demoFormSubmitClicked && !demoFullname"
                  class="error"
                  >Please enter your full name.</small
                >
              </div>
            </div>
            <div class="form-group col-md-6">
              <label for="inputEmail" class="form-label">
                Email
                <span style="color: #ee0000;">*</span>
              </label>
              <input
                type="email"
                class="form-control"
                id="inputEmail"
                placeholder="Email"
                maxlength="150"
                v-model="demoEmail"
                required
              />
              <small
                v-if="
                  demoFormSubmitClicked && !validateEmail(demoEmail)
                "
                class="error"
                >Please enter valid email address.</small
              >
            </div>
            <div class="form-group col-md-6">
              <label class="form-label" for="c_number">
                Contact Number
                <span style="color: #ee0000;">*</span>
              </label>
              <input
                type="number"
                class="form-control"
                id="c_number"
                placeholder="Contact Number"
                maxlength="15"
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                v-model="demoPhone"
                required
              />
              <small
                v-if="
                  demoFormSubmitClicked && !validatePhone(demoPhone)
                "
                class="error"
                >Please enter valid phone number.</small
              >
            </div>
            <div class="form-group col-md-6">
              <div class="form-group">
                <label for="school-name" class="form-label">
                  School Name
                  <span style="color: #ee0000;">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="school-name"
                  placeholder="School Name"
                  maxlength="200"
                  v-model="demoSchool"
                  required
                />
                <small
                  v-if="demoFormSubmitClicked && !demoSchool"
                  class="error"
                  >Please enter school name.</small
                >
              </div>
            </div>
            <div class="form-group col-md-6">
              <div class="form-group">
                <label class="form-label" for="city">
                  City
                  <span style="color: #ee0000;">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="city"
                  placeholder="City"
                  maxlength="100"
                  v-model="demoCity"
                  required
                />
                <small
                  v-if="demoFormSubmitClicked && !demoFullname"
                  class="error"
                  >Please enter your full name.</small
                >
              </div>
            </div>
            <div class="form-group col-md-6">
              <label for="country" class="form-label">
                Country
                <span style="color: #ee0000;">*</span>
              </label>
              <input
                type="text"
                class="form-control"
                id="country"
                placeholder="Country"
                maxlength="150"
                v-model="demoCountry"
                required
              />
              <small
                v-if="
                  demoFormSubmitClicked && !validateEmail(demoEmail)
                "
                class="error"
                >Please enter valid email address.</small
              >
            </div>
          </div>
          <div class="submit col-md-1" style="margin-left: auto; margin-right: auto;">
            <a
              class="btn btn-primary btn-block"
              href="#"
              @click="submitDemoRequest($event)"
              >Submit</a
            >
          </div>
        </form>
      </div>
    </div>
    <!--Enquiry section ends here-->

    <Footer />
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/enquiry/HeaderContent.vue";
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
      demoFormSubmitClicked: false,
      demoFullname: "",
      demoEmail: "",
      demoPhone: "",
      demoSchool: "",
      demoCity: "",
      demoCountry: "",
      curriculumFormSubmitClicked: false,
      curriculumFullname: "",
      curriculumEmail: "",
      curriculumPhone: "",
      curriculumSchool: "",
      curriculumSchoolAddress: "",
      curriculumSchoolLevel: "highschools",
      curriculumSchoolAffiliation: "",
      curriculumGrades: "RSProgram",
      curriculumSession: "s2020",
      curriculumReplyAt: "",
      curriculumNumberOfStudents: "",
      curriculumMessage: ""
    };
  },
  mounted() {
    window.jQuery("#tablayout").champ({
      plugin_type: "tab",
      active_tab: "1",
      controllers: "false"
    });

    window.jQuery(".select2").select2({
      minimumResultsForSearch: Infinity
    });
  },
  methods: {
    validateEmail(email) {
      return window.validateEmail(email);
    },
    validatePhone(phone) {
      return window.validatePhone(phone);
    },
    submitDemoRequest(e) {
      e.preventDefault();
      this.demoFormSubmitClicked = true;
      var canSend = true;
      if (!this.demoFullname) {
        canSend = false;
      }

      if (!this.validateEmail(this.demoEmail)) {
        canSend = false;
      }
      if (!this.demoSchool) {
        canSend = false;
      }
      // this.demoSchoolAffiliation = document.querySelector(
      //   'input[name="demo-affiliation"]:checked'
      // ).value;

      if (!this.validatePhone(this.demoPhone)) {
        canSend = false;
      }

      if (!canSend) {
        window.cvNotify("Please enter all details.", "error");
        return;
      }

      // var profile = window
      //   .jQuery("#demo-profile")
      //   .val()
      //   .join();
      var vm = this;
      axios
        .post("/api/user/sendDemoRequest", {
          name: this.demoFullname,
          email: this.demoEmail,
          phone: this.demoPhone,
          school: this.demoSchool,
          city: this.demoCity,
          country: this.demoCountry,
        })
        .then(() => {
          vm.demoFormSubmitClicked = false;
          vm.demoFullname = "";
          vm.demoEmail = "";
          vm.demoPhone = "";
          vm.demoSchool = "";
          window.cvNotify(
            "Your request for a demo has been submitted successfully."
          );
        })
        .catch(() => {
          window.cvNotify("Your request could not be submitted.", "error");
        });
    }
  }
};
</script>
