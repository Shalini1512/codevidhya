<template>
  <div class="d-flex flex-column" style="background: #fff;">
    <Header></Header>
    <!-- <Skills /> -->
    <div
      id="container"
      class="page d-flex flex-column flex-grow-1"
      style="margin: 30px; margin-top: 87px;"
    >
      <div class="row d-flex">
        <div
          id="register"
          class="col-xl-6 col-md-12 col-md-12 flex-1"
          style="padding-right: -12px;"
        >
          <div
            class="card mb-xl-0 basic-information"
            style="padding: 30px; background: #f0fdff;"
          >
            <div class="card-header">
              <h3 class="card-title text-center col-sm-12">
                Book Your Free Trial Now
              </h3>
            </div>
            <div class="card-body row">
              <div class="form-group col-xl-12">
                <label class="form-label text-dark" id="name" required>
                  Parent's Name
                </label>
                <input
                  type="text"
                  id="name"
                  class="form-control"
                  placeholder="Parent's Name"
                  v-model="name"
                />
                <small v-if="registerButtonClicked && !name" class="cv-error">
                  <i class="fas fa-exclamation-circle"></i>
                  Parent's Name is required.
                </small>
              </div>

              <div class="form-group col-xl-12">
                <label class="form-label text-dark">Parent's Email ID</label>
                <input
                  type="email"
                  id="email"
                  class="form-control"
                  v-model="email"
                  placeholder="Parent's Email ID"
                />
                <small
                  v-if="registerButtonClicked && !validateEmail(email)"
                  class="cv-error"
                >
                  <i class="fas fa-exclamation-circle"></i>
                  Enter Valid Parent's Email ID.
                </small>
              </div>

              <div class="form-group col-xl-12">
                <label class="form-label text-dark">
                  Parent's Mobile Number
                </label>

                <!--<input
                  type="text"
                  id="contact"
                  class="form-control"
                  maxlength="10"
                  onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                  placeholder="Enter 10 digit mobile number"
                  v-model="phone"
                />-->
                <vue-tel-input
                  v-model="phone"
                  id="contact"
                  :valid-characters-only="true"
                  @input="onInput"
                  placeholder="Enter 10 digit mobile number"
                ></vue-tel-input>
                <small
                  v-if="!validPhoneNumber && registerButtonClicked"
                  class="cv-error"
                >
                  <i class="fas fa-exclamation-circle"></i>
                  Enter Valid Parent's Mobile Number.
                </small>
              </div>
              <div class="form-group col-xl-12">
                <label class="form-label text-dark">Kid's Name</label>
                <input
                  type="text"
                  id="kidsname"
                  class="form-control"
                  placeholder="Kid's Name"
                  v-model="kidsName"
                />
                <small
                  v-if="registerButtonClicked && !kidsName"
                  class="cv-error"
                >
                  <i class="fas fa-exclamation-circle"></i>
                  Enter Kid's Name
                </small>
              </div>
              <div class="form-group col-xl-12">
                <label class="form-label text-dark">Kid's Grade</label>
                <div class="product-tags clearfix">
                  <ul class="mb-0" style="padding-left: 0; list-style: none;">
                    <template v-for="(demoCourse, index) in demoCourses">
                      <li class="cursor-pointer" :key="index">
                        <a
                          :class="'grades cursor-pointer p-4 mx-2 '"
                          :id="'grade' + demoCourse.demo_course_id"
                          @click="
                            GetCourseGrade(index + 1, demoCourse.demo_course_id)
                          "
                        >
                          Grade {{ demoCourse.grade }}
                        </a>
                      </li>
                    </template>
                  </ul>
                </div>
              </div>
          

              <div class="form-footer col-xl-12 text-center mt-2 pl-4">
                <center>
                  <button
                    id="register-btn"
                    class="btn btn-outline-primary btn-pill"
                    @click.prevent="doRegister($event)"
                    style="background-color: #028dd2; color: #fff; border: 2px solid #fff !important;"
                  >
                    Schedule Free Demo Session
                  </button>
                </center>
              </div>
            >
            </div>
          </div>
          <div
            class="card mb-xl-0 schedule-time flex-grow-1 h-100"
            style="display: none; background: #f0fdff;"
          >
            <div class="card-header">
              <h3 class="card-title text-center col-sm-12">
                Schedule Your Free Trial
              </h3>
            </div>
            <div class="card-body row h-100">
              <label class="form-label text-dark col-sm-12">Select Date</label>
              <div
                class="d-flex slots-date-container overflow-auto px-1"
                v-if="schedule_dates && schedule_dates.length"
              >
                <div
                  class="my-2 d-flex justify-content-center ml-0 mr-2"
                  v-for="(schedule_date, index) in schedule_dates"
                  :key="index"
                  @click="changeDates(index)"
                >
                  <div
                    :class="
                      'd-flex flex-column align-items-center justify-content-center text-center cursor_pointer calactive1 ' +
                        [
                          index == scheduleTimeKey
                            ? 'calactive2'
                            : 'calactive22',
                        ]
                    "
                  >
                    <div
                      class="calactive3 heading_bold cvfont"
                      style="font: 100 1rem/1 'Poppins';"
                    >
                      {{ $moment(schedule_date.dates).format("ddd") }}
                    </div>
                    <div
                      class="font20 heading_bold jss655"
                      style="font: 400 1.3rem/1 'Poppins';"
                    >
                      {{ $moment(schedule_date.dates).format("DD") }}
                    </div>
                    <div
                      class="font12 heading_reg"
                      style="font: 200 0.75rem/1 'Poppins';"
                    >
                      {{ $moment(schedule_date.dates).format("MMM") }}
                    </div>
                  </div>
                </div>

              
              </div>
              <div class="container-fluid mt-3">
                <div>
                  Select Time
                  <span class="text-orange">
                    {{
                      schedule_dates.length
                        ? $moment(schedule_dates[scheduleTimeKey].dates).format(
                            "ddd DD MMMM"
                          )
                        : ""
                    }}
                  </span>
                </div>
                <div>
                  <div class="col-12 p-0 pt-2">
                    <div
                      v-for="(time, index) in schedule_time"
                      class="col-4 d-inline-block px-1"
                      :key="index"
                      @click="changeTimeSlot(index)"
                    >
                      <div class="radio_div text-center">
                        <input
                          id="radiotime0"
                          class="radio_custom d-none"
                          name="radio-group"
                          type="hidden"
                          readonly
                          :value="time.time"
                        />
                        <label
                          for="radiotime0"
                          :class="
                            'font12 sm_font12  radio_custom_label noOutline timeslots'
                          "
                          :id="'timeslot' + (index + 1)"
                          :style="
                            Object.keys(filterDataArray).includes(
                              time.time + ''
                            )
                              ? filterDataArray[time.time].length == 0
                                ? 'background:#ccc;color:#fff'
                                : ''
                              : ''
                          "
                        >
                          <i
                            class="fa fa-check Timechecks"
                            style="display: none;"
                            :id="'checked' + (index + 1)"
                          ></i>
                          &nbsp;{{ time.time }}
                        </label>
                      </div>
                    </div>
                    <!--<div class="col-4 d-inline-block px-1">
                                   <div class="radio_div text-center">
                                     <input id="radiotime0" class="radio_custom d-none" name="radio-group" type="hidden" readonly="" value="01:00 PM">
                                     <label for="radiotime0" class="font12 sm_font12 active_slot heading_bold radio_custom_label noOutline">
                                       <i class="fa fa-check"></i> 1:00 PM</label>
                                       </div>
                    </div>-->
                  </div>
                </div>
              </div>
              <div class="col-12 px-1 mt-3 text-center">
                <div class="mb-2">
                  <p class="heading_reg sm_font12 font12 text-center mb-1">
                    <span color="#636363" class="sc-bdVaJa ldJVDI">
                      Due to high demand, it's difficult to reschedule a Demo
                      Session.
                      <br class="d-none d-sm-block" />
                      Please pick your slot carefully.
                    </span>
                  </p>
                </div>
                <div class="mb-sm-3 jss448">
                  <div class="sm_font12 font12 heading_bold text-center mb-2">
                    <span
                      class="sc-bdVaJa gORufA heading_bold sm_font12 font12"
                      color="#ff9055"
                    >
                      {{
                        schedule_dates.length
                          ? $moment(
                              schedule_dates[scheduleTimeKey].dates
                            ).format("ddd DD MMMM")
                          : ""
                      }},{{
                        schedule_time.length
                          ? schedule_time[schedueDateTime].time
                          : ""
                      }}
                    </span>
                  </div>
                  <div class="text-center">
                    <button
                      class="btn btn-link text-secondary"
                      @click="anotherDaySchedule()"
                    >
                      Request free demo session for some other day
                    </button>
                  </div>
                  <button
                    class="btn btn-orange"
                    throttletime="3000"
                    @click="beforeFinalSubmit()"
                  >
                    CONFIRM SLOT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="description"
          class="col-xl-6 col-md-12 d-block m-0 p-0 flex-1"
        >
          <div class="card mb-xl-0 h-100 pb-5" style="background: #f0fdff;">
            <div
              class="box h-100 p-4 pl-5 pr-5 mr-1 d-flex flex-column justify-content-center sm_bx0"
              style="background: #f0fdff;"
            >
              <div class="info_items row" style="padding: 30px;">
                <div class="col-xl-1">
                  <i class="fa fa-ban text-success fa-2x mr-1"></i>
                </div>
                <div class="info_details col-xl-11">
                  <h4 style="font-weight: bold;">No Promotions Ever!</h4>
                  <div class="heading4_reg">
                    Codevidhya will never call or email you for marketing
                    offers. Your phone and email are used only to update you on
                    your child's progress.
                  </div>
                </div>
              </div>
              <div class="info_items row mt-4" style="padding: 45px;">
                <div class="col-xl-1">
                  <i class="fas fa-child text-success fa-2x mr-1"></i>
                </div>
                <div class="info_details col-xl-11">
                  <h4 style="font-weight: bold;">100% Kids Friendly</h4>
                  <div class="heading4_reg">
                    Codevidhya provides 100% kids friendly environment.
                  </div>
                </div>
              </div>
              <div class="info_items row mt-4" style="padding: 45px;">
                <div class="col-xl-1">
                  <i class="fas fa-lock text-warning fa-2x mr-1"></i>
                </div>
                <div class="info_details col-xl-11">
                  <h4 style="font-weight: bold;">Secure</h4>
                  <div class="heading4_reg">
                    Codevidhya provides 100% secure environment.
                  </div>
                </div>
              </div>
              <div class="info_items row mt-4" style="padding: 45px;">
                <div class="col-xl-1">
                  <i class="fas fa-phone text-success fa-2x mr-1"></i>
                </div>
                <div class="info_details col-xl-11">
                  <h4 style="font-weight: bold;">Contact Us</h4>
                  <div class="heading4_reg">
                    We are available for you 24*7 at
                    <a
                      href="mailto:contact@codevidhya.com"
                      class="heading4_bold text_blue"
                    >
                      contact@codevidhya.com
                    </a>
                  </div>
                </div>
              </div>
              <!--<div class="info_items"><div class="icons icon-support"></div><div class="info_details"><div class="header heading3_bold">Contact Us - 24x7</div><div class="heading4_reg">We’re devoted to our mission of making your kids creators versus consumers of technology. We’re available 24x7 for you at <a href="mailto:support@whitehatjr.com" class="heading4_bold text_blue">support@whitehatjr.com</a></div></div></div><div class="info_items"><div class="icons icon-exclamation-mark"></div><div class="info_details"><div class="header heading3_bold">For Siblings</div><div class="heading4_reg">Please use a distinct parent <b>Email ID</b> and <b>Mobile Number</b> for each sibling.</div>
                             </div>
              </div>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--schedule class for another day-->
    <div id="anotherdaySchedule" class="cv-modal medium">
      <div class="p-2">
        <h3 class="text-center">Request to Schedule a Free Class</h3>
        <div class="m-3">
          <p>
            Schedule date:
            <input
              type="date"
              placeholder
              id="schedule-time"
              :min="minSchedularDate"
              v-model="SchedularDate"
            />
          </p>
          <p class="mt-2">
            Schedule Time:
            <input
              type="time"
              placeholder
              id="schedule-e-time"
              v-model="SchedularTime"
            />
          </p>
        </div>

        <div id="footer" class="d-flex flex-row justify-content-center mt-3">
          <button
            class="btn btn-success mr-1"
            @click="sendRegistrationRequestbeforeFinal"
          >
            Send
          </button>
          <button
            class="btn btn-danger ml-1"
            @click="closeOtherDayScheduleClass"
          >
            Close
          </button>
        </div>
      </div>
    </div>
    <!--end schedule class for another day-->
    <!--modal-->
    <div id="successMessage" class="cv-modal small">
      <div class="p-3">
        <p class="m-3" id="msgg">
          Thank you for your request. We will get back to you shortly.
        </p>
        <div id="footer" class="d-flex flex-row justify-content-center mt-4">
          <button class="cv-button" @click="closeModal()">Okay</button>
        </div>
      </div>
    </div>
    <Footer />
    <!--end modal-->
    <Loader v-if="processing" />
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import Footer from "@/components/footer/Footer.vue";
import ProgressTop from "@/components/widgets/ProgressTop.vue";
import AuthMixin from "@/mixins/AuthMixin.js";
import Loader from "@/components/widgets/BlockingLoader.vue";
import Skills from "@/components/home/Skills.vue";
import axios from "axios";
import moment from "vue-moment";
import { VueTelInput } from "vue-tel-input";
export default {
  components: {
    Header,
    ProgressTop,
    Footer,
    VueTelInput,
    Loader,
    Skills,
  },

  mixins: [AuthMixin],
  data() {
    return {
      processing: false,
      gapiLoaded: false,
      shown: false,
      mode: "login",
      loginButtonClicked: false,
      registerButtonClicked: false,
      isLoggingIn: false,
      FB: undefined,
      name: "",
      kidsName: "",
      grade: "",
      username: "",
      usernameRegister: "",
      email: "",
      phone: "",
      countrycode: "",
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
      courseId: 0,
      demoCourses: [],
      TrialcourseId: 0,
      datesAndSlot: [],
      mindate: this.$moment().format("YYYY-MM-DD"),
      schedule_dates: [],
      schedule_time: [],
      schedule_times: [],
      scheduleTimeKey: 0,
      schedueDateTime: 0,
      schedueDateTimeKey: -1,
      scheduleOn: this.$moment().format("YYYY-MM-DD"),
      today: [],
      validPhoneNumber: false,
      tomorrow: [],
      filterDataArray: [],
      nextDayTomorrow: [],
      sales_person_id: "",
      country: "",
      state: "",
      SchedularDate: new Date().toISOString().slice(0, 10),
      SchedularTime: "09:00",
      minSchedularDate: new Date().toISOString().slice(0, 10),
    };
  },
  mounted() {
    // showModal("successMessage");
    this.getCourseDetails();
  },
  methods: {
    closeOtherDayScheduleClass() {
      hideModal("anotherdaySchedule");
    },
    anotherDaySchedule() {
      if (this.schedule_dates.length) {
        let dates = new Date(
          this.schedule_dates[this.schedule_dates.length - 1].dates
        );
        let nextDate = dates.setDate(dates.getDate() + 1);
        this.SchedularDate = this.minSchedularDate = new Date(nextDate)
          .toISOString()
          .slice(0, 10);
      }

      showModal("anotherdaySchedule");
    },
    onInput(formattedNumber, { number, valid, country }) {
      this.validPhoneNumber = valid;
      this.phone = number.international;
    },
    async changeDates(index) {
      this.schedule_time = [];
      this.scheduleTimeKey = index;
      this.schedueDateTimeKey = -1;
      let vm = this;
      vm.today = [];

      await vm.datesAndSlot.forEach(async (item, index) => {
        if (item.length) {
          let today_data = item.filter(
            (x) => x.start_date == vm.schedule_dates[vm.scheduleTimeKey].dates
          );
          if (today_data.length) {
            if (!vm.today.length) vm.today = today_data;
            else {
              await today_data.forEach(async (sitem, index) => {
                let fileterIndex = vm.today.findIndex(
                  (x) =>
                    x.start_date == sitem.start_date && x.time == sitem.time
                );
                if (fileterIndex != -1 && sitem.booked == "not_booked") {
                  vm.today[fileterIndex] = sitem;
                }
              });
            }
          }
        }
      });

      await vm.todayFilter();
    },
    beforeFinalSubmit() {
      let vm = this;
      axios.post("/api/liveCourse/getSalesPersonId").then((res) => {
        vm.sales_person_id = res.data;
        vm.sales_person_id =
          vm.sales_person_id[
            Math.floor(Math.random() * vm.sales_person_id.length)
          ].user_id;
        vm.finalFormSubmit();
      });
    },

    finalFormSubmit() {
      let vm = this;
      if (this.schedueDateTimeKey == -1) {
        cvNotify("Please Choose Your Time Slot", "error");
      } else {
        this.processing = true;
        let trainer_id = this.filterDataArray[
          this.schedule_time[this.schedueDateTimeKey].time
        ][0].trainer_id;
        let trainer_calender_id = this.filterDataArray[
          this.schedule_time[this.schedueDateTimeKey].time
        ][0].trainer_calender_id;
        let grade = 0;
        let institute_name = "";
        let class_id = this.filterDataArray[
          this.schedule_time[this.schedueDateTimeKey].time
        ][0].t_class_link_id;
        let date_s_time_slot = this.filterDataArray[
          this.schedule_time[this.schedueDateTimeKey].time
        ][0].date_s_time_slot;
        let theme = this.demoCourses.filter(
          (x) => x.demo_course_id == this.courseId
        )[0].theme;
        let class_link_name = this.filterDataArray[
          this.schedule_time[this.schedueDateTimeKey].time
        ][0].class_link;

        let vm = this;
        axios
          .post("/api/liveCourse/sendRequestForScheduleMail", {
            parent_name: this.name,
            parent_mail: this.email,
            parent_contact: this.phone,
            kids_name: this.kidsName,
            demo_course_id: this.courseId,
            trainer_id: trainer_id,
            trainer_calender_id: trainer_calender_id,
            grade: grade,
            institute_name: institute_name,
            t_class_link_id: class_id,
            date_s_time_slot: date_s_time_slot,
            theme: theme,
            class_link: class_link_name,
            country: this.country,
            state: this.state,
            city: this.city,
            sales_person_id: this.sales_person_id,
          })
          .then((res) => {
            if (res.data == "booked") {
              $("#msgg").text("Slot immediately booked by other users.");
            } else {
              $("#msgg").text("Your Slot Is Booked Successfully");
            }
            showModal("successMessage");
            vm.processing = false;
            if (res.data != "booked") {
              setTimeout(vm.changeRouter, 3000);
            } else {
              this.getCoursesTimeSchedule(this.courseId);
            }
          })
          .catch((err) => {
            vm.processing = false;
            vm.isLoggingIn = false;
            if (err.response.body == "already_exists") {
              window.cvNotify("User already exists.", "error");
            }
          });
      }
    },
    changeRouter() {
      this.$router.push("/");
    },
    changeTimeSlot(index) {
      if (this.filterDataArray[this.schedule_time[index].time].length != 0) {
        $(".timeslots").removeClass("active_slot");
        $("#timeslot" + (index + 1)).addClass("active_slot");
        $(".Timechecks").hide();
        $("#checked" + (index + 1)).show();
        this.schedueDateTime = index;
        this.schedueDateTimeKey = index;
      }
    },
    getCourseDetails() {
      let vm = this;
      axios.post("/api/liveCourse/getDemoCoursesForFreeTrail").then((res) => {
        vm.demoCourses = res.data;
      });
    },
    GetCourseGrade(key, courseId) {
      $(".grades").removeClass("active");
      $("#grade" + courseId).addClass("active");
    },
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

    doRegister(e) {
      e.preventDefault();
      this.registerButtonClicked = true;
      var canSubmit = true;
      if (!this.name) {
        canSubmit = false;
      }

      if (!this.validateEmail(this.email)) {
        canSubmit = false;
      }

      if (!this.validPhoneNumber) {
        canSubmit = false;
      }
      let element = document.querySelectorAll(".grades");
      element.forEach((item, index) => {
        if (item.className.indexOf("active") != -1) {
          this.courseId = item.id;
          this.courseId = this.courseId.replace("grade", "");
        }
      });
      if (!this.courseId) {
        cvNotify("Choose Your Grade", "warning");
        canSubmit = false;
      }
      if (!this.kidsName) {
        canSubmit = false;
      }

      if (!canSubmit) return;
      // this.sendRegistrationRequest();
      this.getCoursesTimeSchedule(this.courseId);
    },
    closeModal() {
      hideModal("successMessage");
    },
    getCoursesTimeSchedule(courseId) {
      $(".basic-information").hide();
      $(".schedule-time").show();
      let vm = this;
      axios.post("/api/liveCourse/getDemoUniqueTimes").then((res) => {
        vm.schedule_times = res.data;
        axios.post("/api/liveCourse/getDemoUniqueDates").then((res) => {
          vm.schedule_dates = res.data;
          axios
            .post("/api/liveCourse/getTrialCoursesNextThreeDaysSchedule", {
              courseId: courseId,
            })
            .then(async (res) => {
              vm.datesAndSlot = res.data;
              vm.today = [];
              await vm.datesAndSlot.forEach(async (item, index) => {
                if (item.length) {
                  let today_data = item.filter(
                    (x) =>
                      x.start_date ==
                      vm.schedule_dates[vm.scheduleTimeKey].dates
                  );
                  if (today_data.length) {
                    if (!vm.today.length) vm.today = today_data;
                    else {
                      await today_data.forEach(async (sitem, index) => {
                        let fileterIndex = vm.today.findIndex(
                          (x) =>
                            x.start_date == sitem.start_date &&
                            x.time == sitem.time
                        );
                        if (
                          fileterIndex != -1 &&
                          sitem.booked == "not_booked"
                        ) {
                          vm.today[fileterIndex] = sitem;
                        }
                      });
                    }
                  }
                }
              });

              await vm.todayFilter();
            });
        });
      });
    },
    todayFilter() {
      let vm = this;

      vm.schedule_times.forEach(async (filterData, index) => {
        vm.filterDataArray[filterData.time] = vm.today.filter(
          (x) => x.time == filterData.time && x.booked == "not_booked"
        );
      });

      vm.schedule_time = vm.schedule_times;
    },
    sendRegistrationRequestbeforeFinal() {
      var vm = this;
      axios.post("/api/liveCourse/getSalesPersonId").then((res) => {
        vm.sales_person_id = res.data;
        vm.sales_person_id =
          vm.sales_person_id[
            Math.floor(Math.random() * vm.sales_person_id.length)
          ].user_id;
        vm.sendRegistrationRequest();
      });
    },
    sendRegistrationRequest() {
      let vm = this;
      this.isLoggingIn = true;
      this.processing = true;
      //post requestForLiveClass
      axios
        .post("/api/auth/requestForScheduleLiveClass", {
          name: this.name,
          email: this.email,
          contact: this.phone,
          kidsName: this.kidsName,
          schedueDate: this.SchedularDate,
          scheduleTime: this.SchedularTime,
          sales_person_id: this.sales_person_id,
        })
        .then(function(res) {
          vm.processing = false;
          hideModal("anotherdaySchedule");
          if (res.data == "") {
            $("#msgg").text("This request already sent.");
            showModal("successMessage");
          } else {
            $("#msgg").text(
              "Thank you for your query.We will get back to you shortly."
            );
            showModal("successMessage");
            setTimeout(vm.changeRouter, 3000);
          }
        })
        .catch((err) => {
          vm.processing = false;
          vm.isLoggingIn = false;
          if (err.response.body == "already_exists") {
            window.cvNotify("User already exists.", "error");
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.calactive1 {
  width: 72px;
  height: 72px;
  cursor: pointer;
}
.radio_div {
  font-size: 0.875rem;
}
.radio_custom {
  opacity: 0;
  position: absolute;
}
.calactive2 {
  border: 1px solid #5f93e3;
  background: #e4efff;
  border-radius: 8px;
  cursor: pointer;
}
.radio_custom_label.active_slot {
  background: #266ad1;
  border: 1px solid #266ad1;
  color: #fff;
  box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.18);
}
.radio_custom_label {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  padding: 8px 5px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #dedede;
  color: #266ad1;
  background: #fff;
}
.calactive22 {
  border: 1px solid #e7e7e7;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
}
.calactive3 {
  color: #5f93e3;
  cursor: pointer;
}
.cvfont {
  font-size: 0.875rem;
  cursor: pointer;
}
.font20 {
  font-size: 1.25rem;
  cursor: pointer;
}
.jss655 {
  line-height: 1;
  cursor: pointer;
}
.font12 {
  font-size: 0.75rem;
  cursor: pointer;
}
.active {
  background: #e75160 !important;
  border-color: #e75160 !important;
  color: #fff !important;
}
.grades {
  border-radius: 0.5rem;
  font: 100 0.75rem/1 "Poppins";
  text-align: center;
}
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
#live-class {
  position: fixed;
  width: 100%;
  height: 100%;
  #container {
    min-height: 0;

    #register {
      flex-shrink: 0;
      overflow-y: auto;
    }

    #description {
      background: #fff;
      overflow: auto;
    }
  }
}

#form-sidebar {
  margin-left: 0 !important;
  height: 584px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-around !important;
  flex-grow: 1 !important;
}
</style>
