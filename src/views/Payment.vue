<template>
  <div>
    <Header>
      <HeaderContent />
    </Header>
    <div class="card">
      <div id="coupon-outer">
        <div id="coupon-input">
          <input type="text" placeholder="Coupon Code" id="coupon-code">
          <p id="err-msg" style="color: red; font-size: 12px; margin: 0; padding: 0;"></p>
          <p id="suc-msg" style="color: green; font-size: 12px; margin: 0; padding: 0;"></p>
          <div>
            <button class="btn btn-success" v-on:click="submitCoupon()">Ok</button>
            <button class="btn btn-danger" v-on:click="toggleDiscount('coupon', true)">Cancel</button>
          </div>
        </div>
      </div>
      <div id="discount-outer">
        <div id="discount-input">
          <input type="text" placeholder="Discount amount" id="discount-amount">
          <div>
            <button class="btn btn-success" v-on:click="submitDiscount()">Ok</button>
            <button class="btn btn-danger" v-on:click="toggleDiscount('discount', true)">Cancel</button>
          </div>
        </div>
      </div>
      <div class="card-header justify-content-center">
        <h2 style="font-weight: 700; padding-top: 66px;">Cash Payment</h2>
      </div>
      <div class="content_wrapper">
        <div class="tab_content active">
          <div class="wrapper wrapper2">
            <form id class="card-body" tabindex="500">
              <div class="form-row">
                <div class="form-group col-md-6">
                  <div class="form-group">
                    <label class="form-label" for="selectcourse">Course Name </label>
                    <select class="form-control" @change="courseSelected($event)">
                      <option disabled selected>select course</option>
                      <option v-for="course in allCourses" :key="course.live_course_id" :value="course.live_course_id">
                        {{course.live_course_name}}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="form-group col-md-6">
                  <div class="form-group">
                    <label class="form-label" for="username">
                      Username
                      <span style="color: #ee0000;">*</span>
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="user-name"
                      placeholder="username"
                      maxlength="100"
                      v-model="username"
                      v-on:input="autocompleteUser"
                      v-on:keydown="selectAutocomplete"
                      required
                    />
                    <div id="autocomplete-section" class="col-md-12">
                    </div>
                    <small
                      v-if="demoFormSubmitClicked && !demoFullname"
                      class="error"
                    >Please enter your full name.</small>
                  </div>
                </div>
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
                    >Please enter your full name.</small>
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
                  >Please enter valid email address.</small>
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
                  >Please enter valid phone number.</small>
                </div>
                <div class="form-group col-md-6">
                  <div class="form-group">
                    <label class="form-label" for="actualPrice">Actual Course Price</label>
                    <input
                      type="number"
                      class="form-control"
                      id="name1"
                      v-model="actualPrice"
                      required
                    />
                    <small
                      v-if="requestFormSubmitClicked && !course"
                      class="cv-error"
                    >Please enter course price.</small>
                  </div>
                </div>
                <div class="form-group col-md-6">
                  <div class="form-group">
                    <label class="form-label" for="discountprice">Discount Price</label>

                    <select class="form-control" id="discount-option" v-on:change="getCoupon($event)">
                      <option selected disabled>Select</option>
                      <option value="discountprice">Discount Price</option>
                      <option value="couponcode">Coupon Code</option>
                    </select>
                  </div>
                </div>
                <!-- <div class="form-group col-md-6">
                  <div class="form-group">
                    <label class="form-label" for="discountprice">Coupon Code</label>
                    <input 
                      type="text"
                      class="form-control"
                      v-model="couponCode"
                    >
                  </div>
                </div> -->
                <div class="form-group col-md-6">
                  <div class="form-group">
                    <label class="form-label" for="finalprice">Final Course Price</label>
                    <input
                      type="text"
                      class="form-control"
                      id="name1"
                      placeholder="Final Course Price"
                      v-model="finalPrice"
                      required
                      disabled
                    />
                    <small v-if="requestFormSubmitClicked && !course" class="cv-error">Final Price.</small>
                  </div>
                </div>
              </div>
              <div class="submit col-md-4" style="margin-left: auto; margin-right: auto;">
                <a
                  class="btn btn-primary btn-block"
                  href="#"
                  @click="submitDemoRequest($event)"
                >Submit</a>
              </div>
            </form>
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
//import HeaderContent from "@/components/enquiry/HeaderContent.vue";
import Footer from "@/components/footer/Footer.vue";

import axios from "axios";

export default {
  name: "CashPayment",
  components: {
    Header,
    //HeaderContent,
    Footer
  },
  data: function() {
    return {
      actualPrice: 0,
      finalPrice: 0,
      discount: 0,
      couponCode: "",
      username: "",
      user_id: "",
      userRegex: "",
      usernameList: [],
      focused: 0,
      requestFormSubmitClicked: false,
      demoFormSubmitClicked: false,
      demoFullname: "",
      demoEmail: "",
      demoPhone: "",
      demoSchool: "",
      demoSchoolAddress: "",
      demoSchoolLevel: "highschools",
      demoSchoolAffiliation: "",
      demoGrades: "g1to10",
      demoReplyAt: "",
      demoMessage: "",
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
      curriculumMessage: "",
      allCourses: []
    };
  },
  mounted() {
    window.jQuery("#tablayout").champ({
      plugin_type: "tab",
      active_tab: "1",
      controllers: "false"
    });
    const vm = this;
    axios.post("/api/liveCourse/getLiveCoursesForFeedback")
      .then(res => {
        vm.allCourses = res.data;
      })
      .catch(e => {
        console.log(e.message);
      });
    window.jQuery(".select2").select2({
      minimumResultsForSearch: Infinity
    });
    vm.userRegex = new RegExp("^(?![\s\S])");
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

      if (!this.demoSchoolAddress) {
        canSend = false;
      }

      this.demoSchoolAffiliation = document.querySelector(
        'input[name="demo-affiliation"]:checked'
      ).value;

      if (!this.validatePhone(this.demoPhone)) {
        canSend = false;
      }

      if (!canSend) {
        window.cvNotify("Please enter all details.", "error");
        return;
      }

      var profile = window
        .jQuery("#demo-profile")
        .val()
        .join();
      var vm = this;
      axios
        .post("/api/user/sendDemoRequest", {
          name: this.demoFullname,
          email: this.demoEmail,
          phone: this.demoPhone,
          profile: profile,
          school_name: this.demoSchool,
          school_level: this.demoSchoolLevel,
          address: this.demoSchoolAddress,
          affiliation: this.demoSchoolAffiliation,
          grades: this.demoGrades,
          reply_at: this.demoReplyAt,
          message: this.demoMessage
        })
        .then(() => {
          vm.demoFormSubmitClicked = false;
          vm.demoFullname = "";
          vm.demoEmail = "";
          vm.demoPhone = "";
          vm.demoSchool = "";
          vm.demoSchoolAddress = "";
          vm.demoReplyAt = "";
          vm.demoMessage = "";
          window.cvNotify(
            "Your request for a demo has been submitted successfully."
          );
        })
        .catch(() => {
          window.cvNotify("Your request could not be submitted.", "error");
        });
    },
    submitCurriculumRequest(e) {
      e.preventDefault();
      this.curriculumFormSubmitClicked = true;
      var profile = window
        .jQuery("#curriculum-profile")
        .val()
        .join();

      var canSend = true;
      if (!this.curriculumFullname) {
        canSend = false;
      }

      if (!this.validateEmail(this.curriculumEmail)) {
        canSend = false;
      }

      if (!this.curriculumSchool) {
        canSend = false;
      }

      if (!this.curriculumSchoolAddress) {
        canSend = false;
      }

      this.curriculumSchoolAffiliation = document.querySelector(
        'input[name="curriculum-affiliation"]:checked'
      ).value;

      if (!this.validatePhone(this.curriculumPhone)) {
        canSend = false;
      }

      if (!canSend) {
        window.cvNotify("Please enter all details.", "error");
        return;
      }
      var vm = this;
      axios
        .post("/api/user/sendCurriculumRequest", {
          name: this.curriculumFullname,
          email: this.curriculumEmail,
          phone: this.curriculumPhone,
          profile: profile,
          school_name: this.curriculumSchool,
          school_level: this.curriculumSchoolLevel,
          address: this.curriculumSchoolAddress,
          affiliation: this.curriculumSchoolAffiliation,
          grades: this.curriculumGrades,
          session: this.curriculumSession,
          no_of_students: this.curriculumNumberOfStudents,
          reply_at: this.curriculumReplyAt,
          message: this.curriculumMessage
        })
        .then(() => {
          vm.curriculumFormSubmitClicked = false;
          vm.curriculumFullname = "";
          vm.curriculumEmail = "";
          vm.curriculumPhone = "";
          vm.curriculumSchool = "";
          vm.curriculumSchoolAddress = "";
          vm.curriculumReplyAt = "";
          vm.curriculumNumberOfStudents = "";
          vm.curriculumMessage = "";
          window.cvNotify(
            "Your request for curriculum has been submitted successfully."
          );
        })
        .catch(() => {
          window.cvNotify("Your request could not be submitted.", "error");
        });
    },
    courseSelected($event) {
      const vm = this;
      const id = $event.target.value;
      for(let i=0; i<vm.allCourses.length; i++) {
        if(vm.allCourses[i].live_course_id == id) {
          vm.actualPrice = vm.allCourses[i].course_price;
          vm.finalPrice = ((1-vm.discount/100)*vm.actualPrice).toFixed(2);
          break;
        }
      }
    },
    getCoupon($event) {
      if($event.target.value == "couponcode") {
        this.toggleDiscount("coupon");
      } else if($event.target.value == "discountprice") {
        this.toggleDiscount("discount");
      }
    },
    toggleDiscount(str, reset = false) {
      const x = document.getElementById(`${str}-outer`);
      if(reset) {
        let select_box = document.getElementById("discount-option");
        select_box.selectedIndex = null;
      }

      if(x.style.display == "block") {
        x.style.display = "none";
        return;
      }
      x.style.display = "block";
    },
    submitCoupon() {
      const x = document.getElementById("coupon-code");
      const vm = this;
      axios.get(`/api/livecourse/getCoupon/${x.value}?user_id=${vm.user_id}`)
        .then(res => {
          if(res.data.error) {
            document.getElementById("err-msg").innerHTML = res.data.error;
            setTimeout(() => {
               document.getElementById("err-msg").innerHTML = "";
            }, 2000);
          } else {
            vm.discount = res.data.discount;
            vm.couponCode = x.value;
            document.getElementById("suc-msg").innerHTML = `Congratualtions! You got ${vm.discount}% off`;
            vm.finalPrice = ((1-vm.discount/100)*vm.actualPrice).toFixed(2);
            setTimeout(() => {
               document.getElementById("suc-msg").innerHTML = "";
               vm.toggleDiscount("coupon", false);
            }, 2000);
          }
        })
        .catch(e => console.log(e));
      
    },
    submitDiscount() {
      const vm  = this;
      let x = document.getElementById("discount-amount");
      let discountAmount = x.value;
      vm.finalPrice = vm.actualPrice - discountAmount;
      vm.toggleDiscount("discount", false);

    },
    async getMatchingUsername() {
      console.log("HELLO1");
      const vm = this;
      const { data } = await axios.get(`/api/user/getUsernameList?q=${vm.username}`);
      console.log(data);
      if(data.error) {
        console.log("back1");
        return [];
      }
      const usernameList = data.data.map(row => row.username);
      console.log(usernameList);
      console.log("back");
      return usernameList;
      
    },
    renderUsernameList(clear = false) {
      if(clear) {
        document.getElementById("autocomplete-section").innerHTML = "";
        return;
      }
      const vm = this;
      const html = vm.usernameList.map((name, idx) => 
        `<div 
          class="auto-opt ${vm.focused == idx ? 'selected' : ''}" 
        >
          <h4>${name}</h4>
        </div>`).join('');
      document.getElementById("autocomplete-section").innerHTML = html;
    },
    async autocompleteUser($event) {
      const vm = this;
      if(vm.username.length < 1) {
        vm.renderUsernameList(true);
        vm.focused = 0;
        return;
      }

      if(vm.usernameList.length == 0 || !vm.userRegex.test(vm.username)) {
        vm.userRegex = new RegExp(`^{vm.username}`, 'gi');
        vm.usernameList = await vm.getMatchingUsername();
      } else { 
        vm.userRegex = new RegExp(`^{vm.username}`, 'gi');
        vm.usernameList = vm.usernameList.filter(x => vm.userRegex.test(x));
      }

      vm.renderUsernameList();
    },
    async selectAutocomplete($event) {
      const vm = this;
      const key = $event.keyCode;
      console.log(key);
      if(key == 13) {
        vm.username = vm.usernameList[vm.focused];
        await vm.getUserDetail();
        console.log(vm.demoPhone);
        vm.usernameList = [];
        vm.renderUsernameList(true);
        return;
      } else if(key == 40 & vm.focused < vm.usernameList.length-1) {
        vm.focused++;
      } else if(key == 38 && vm.focused > 0) {
        vm.focused--;
      }

      vm.renderUsernameList();
    },
    async getUserDetail() {
      const vm = this;
      try {
         const { data } = await axios.get(`/api/user/getUserDetails?q=${vm.username}`);
         console.log(data);
         vm.demoFullname = data.data[0].name;
         vm.demoEmail = data.data[0].email;
         vm.demoPhone = data.data[0].contact;
         vm.user_id = data.data[0].user_id;
      } catch(e) {
        console.log(e);
      }
    }
  }
};
</script>

<style>
#coupon-outer, #discount-outer {
  top: 0;
  left: 0;
  position: absolute;
  z-index: 2;
  height: 100vh;
  width: 100vw;
  background: rgba(255, 255, 255, 0.7);
  display: none;
}
#coupon-input, #discount-input {
  padding: 20px;
  position: absolute;
  top: calc(50% - 200px);
  left: calc(50% - 250px);
  z-index: 2;
  width: 500px;
  height: 200px;
  display: flex;
  flex-direction: column;
  background: #f0faff;
  justify-content: space-around;
  align-items: center;
  border-radius: 20px;
  border: 2px dashed #aeaeae;
  max-width: 80%;
}
#coupon-input input, #discount-input input {
  border: none;
  border-bottom: 1px solid #aeaeae;
  border-radius: 0;
  background: inherit;
  padding: 5px 0;
}
#coupon-input button, #discount-input button {
  margin: 0 40px;
  width: 80px
}
#autocomplete-section {
  z-index: 2; 
  position: absolute; 
  padding-left: 0;
  margin: 0; 
}
.selected {
  background-color: rgb(60, 145, 255) !important;
  color: white;
}
.auto-opt {
  padding: 10px;
  background: rgb(227, 254, 255);
}
</style>
