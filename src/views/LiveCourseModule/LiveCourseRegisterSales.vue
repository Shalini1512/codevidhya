<template>
  <div>
    <Header></Header>
    <section class="sptb mt-2">
      <div class="container customerpage">
        <div class="row">
          <div class="single-page">
            <div class="col-lg-8 col-xl-12 col-md-12 d-block mx-auto">
              <div class="wrapper wrapper2">
                <form id="Register" class="card-body" tabindex="500">
                  <h3>Demo Session Booking</h3>
                  <div class="row">
                    <div class="name col-sm-6">
                      <input type="text" name="name" v-model="parent_name" />
                      <label>Parent's Name</label>
                      <small v-if="registerButtonClicked && !parent_name" class="cv-error">
                        <i class="fas fa-exclamation-circle"></i> Name is
                        required.
                      </small>
                    </div>
                    <div class="mail col-sm-6">
                      <input type="email" name="mail" v-model="parent_mail" />
                      <label>Parent's Mail</label>
                      <small
                        v-if="registerButtonClicked && !validateEmail(parent_mail )"
                        class="cv-error"
                      >
                        <i class="fas fa-exclamation-circle"></i> Enter valid
                        email address.
                      </small>
                    </div>
                    <div class="contact col-sm-6 mt-3">
                      <input type="text" name="contact" v-model="parent_contact" />
                      <label>Parent's Mobile Number</label>
                      <small
                        v-if="registerButtonClicked && !validatePhone(parent_contact)"
                        class="cv-error"
                      >
                        <i class="fas fa-exclamation-circle"></i> Enter valid
                        phone number.
                      </small>
                    </div>
                    <div class="kids col-sm-6 mt-3">
                      <input type="text" name="contact" v-model="kids_name" />
                      <label>Kid's Name</label>
                      <small v-if="registerButtonClicked && !kids_name" class="cv-error">
                        <i class="fas fa-exclamation-circle"></i> Enter Kids Name.
                      </small>
                    </div>
                    <div class="col-sm-6 mt-3">
                      <select class="form-control" id="grade">
                        <option value="UKG">Grade UKG</option>
                        <option value="1">Grade 1</option>
                        <option value="2">Grade 2</option>
                        <option value="3">Grade 3</option>
                        <option value="4">Grade 4</option>
                        <option value="5">Grade 5</option>
                        <option value="6">Grade 6</option>
                        <option value="7">Grade 7</option>
                        <option value="8">Grade 8</option>
                        <option value="9">Grade 9</option>
                        <option value="10">Grade 10</option>
                        <option value="11">Grade 11</option>
                        <option value="12">Grade 12</option>
                      </select>
                      <label>Grade</label>
                    </div>
                    <div class="col-sm-6 mt-3">
                      <input type="text" name="country" v-model="country" />
                      <label>Country</label>
                    </div>
                    <div class="col-sm-6 mt-3">
                      <input type="text" name="country" v-model="state" />
                      <label>State</label>
                    </div>
                    <div class="col-sm-6 mt-3">
                      <input type="text" name="country" v-model="city" />
                      <label>City</label>
                    </div>
                    <div class="col-sm-6 mt-3">
                      <select id="course_level" class="form-control" @change="GetTarinersList">
                        <option
                          v-for="(demoCourse,index) in demoCourses"
                          :key="index"
                          :value="demoCourse.demo_course_id"
                        >{{demoCourse.demo_course_name}} ({{demoCourse.theme}})</option>
                      </select>
                      <i
                        class="fa fa-info-circle text-info"
                        style="position:absolute;right:6%;cursor:pointer;bottom:22%;"
                        @click="demoCourseDetails"
                      ></i>
                      <label>Demo Session</label>
                    </div>
                    <div class="institute col-sm-12 mt-3">
                      <input type="text" name="inst" v-model="institute_name" />
                      <label>Institution Name</label>
                    </div>
                    <div class="col-sm-6 mt-3" v-if="trainersList && trainersList.length">
                      <select id="trainer" class="form-control" @click="availableTimeSlot">
                        <option
                          v-for="(trainer,index) in trainersList"
                          :key="index"
                          :value="trainer.user_id"
                        >{{trainer.name}}</option>
                      </select>
                      <label>Alloted To(Trainer)</label>
                    </div>

                    <div class="col-sm-6 mt-3">
                      <input
                        type="date"
                        placeholder
                        id="schedule-time"
                        v-model="currentDate"
                        @change="availableTimeSlot"
                      />
                      <label>Date</label>
                      <small v-if="registerButtonClicked && !currentDate" class="cv-error">
                        <i class="fas fa-exclamation-circle"></i> Schedule date and time is required.
                      </small>
                    </div>
                  </div>
                  <div class="row mt-4" v-if="availableTimeSlots && availableTimeSlots.length">
                    <caption class="col-sm-12 text-center">Available Time Slot</caption>
                    <div class="col-sm-12">
                      <div class="table-responsive">
                        <table
                          class="table card-table table-vcenter text-nowrap"
                          style="overflow:auto"
                        >
                          <thead class="bg-secondary text-white">
                            <tr>
                              <th class="text-white">Sr. No.</th>
                              <th class="text-white">Date</th>
                              <th class="text-white">Time Slot</th>
                              <td class="text-white">Action</td>
                            </tr>
                          </thead>
                          <tbody>
                            <template v-for="(availableTimeSlot,index) in availableTimeSlots">
                              <tr :key="index">
                                <td>{{index+1}}</td>
                                <td>{{availableTimeSlot.schedule_date}}</td>
                                <td>{{availableTimeSlot.schedule_s_time}}-{{availableTimeSlot.schedule_e_time}}</td>
                                <td>
                                  <input
                                    :value="availableTimeSlot.trainer_calender_id"
                                    type="radio"
                                    name="bookslot"
                                  />
                                </td>
                              </tr>
                            </template>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div class="submit text-center mt-2" style="height:160px;">
                    <a class="btn btn-primary" @click="bookForTrailClasss($event)">Submit</a>
                  </div>
                </form>
                <!--<hr class="divider">-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--/Register-section-->
    <!--end users-->
    <div class="sptb bg-white mb-0">
      <Footer />
    </div>
    <!--demo course modal-->
    <div id="demo-course-modal" class="cv-modal large">
      <div>
        <h3
          class="text-center"
          id="trail-course-name"
        >{{demoCourses.length?demoCourses[Selectedkey].demo_course_name:''}}</h3>

        <div class="row course-details">
          <div class="col-sm-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Age Group:</label>
            <span
              id="trial_age_group"
              style="margin-left:3%;"
            >{{demoCourses.length?demoCourses[Selectedkey].age_group:''}}</span>
          </div>
          <div class="col-sm-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Grade:</label>
            <span
              id="trial_grade_group"
              tyle="margin-left:3%;"
            >{{demoCourses.length?demoCourses[Selectedkey].grade:''}}</span>
          </div>
          <div class="col-sm-12 mt-2">
            <label style="font-weight:bold;font-display: 'Poppins'; font-size: 1.2rem;">Theme:</label>
          </div>
          <div
            class="col-sm-12"
            id="theme1"
          >{{demoCourses.length?demoCourses[Selectedkey].theme:''}}</div>
          <div class="col-sm-12 mt-2" v-if="prerequisites.length">
            <label
              style="font-weight:bold;font-display: 'Poppins';font-size: 1.2rem; margin-bottom:0;"
            >Prerequisite:</label>
          </div>
          <div class="col-sm-12" id="prerequisite">
            <ul v-if="prerequisites.length">
              <li v-for="(prerequisite,index) in prerequisites" :key="index">{{prerequisite}}</li>
            </ul>
          </div>
          <div class="col-sm-12 mt-2" v-if="topics.length">
            <label
              style="font-weight:bold;font-display: 'Poppins';font-size: 1.2rem;margin-bottom:0;"
            >Topics:</label>
          </div>
          <div class="col-sm-12" id="topics">
            <ul v-if="topics.length">
              <li v-for="(topic,index) in topics" :key="index">{{topic}}</li>
            </ul>
          </div>
          <div class="col-sm-12 mt-2">
            <label
              style="font-weight:bold;font-display: 'Poppins';font-size: 1.2rem;margin-bottom:0;"
            >Outcomes:</label>
          </div>
          <div class="col-sm-12" id="outcomes" v-if="outcomes.length">
            <ul v-if="outcomes.length">
              <li v-for="(outcome,index) in outcomes" :key="index">{{outcome}}</li>
            </ul>
          </div>
        </div>
        <div class="text-center mt-4">
          <button class="btn btn-primary" @click="handleCloseLearnAtHomeClicked">Close</button>
        </div>
      </div>
    </div>
    <!--end demo course modal-->
    <!--modal-->
    <div id="successMessage" class="cv-modal small">
      <div class="p-3">
        <p class="m-3" id="msgg">Successfull submitted.</p>
        <div id="footer" class="d-flex flex-row justify-content-center mt-4">
          <button class="cv-button" @click="closeModal()">Okay</button>
        </div>
      </div>
    </div>
    <!--end modal-->
    <!--modal-->
    <div id="errorMessage" class="cv-modal small">
      <div class="p-3">
        <p class="m-3" id="msgg">Slot immediately booked by other users.</p>
        <div id="footer" class="d-flex flex-row justify-content-center mt-4">
          <button class="cv-button" @click="closeModal2()">Okay</button>
        </div>
      </div>
    </div>
    <div id="warningMessage" class="cv-modal small">
      <div class="p-3">
        <p class="m-3" id="msgg">Data Already exists.</p>
        <div id="footer" class="d-flex flex-row justify-content-center mt-4">
          <button class="cv-button" @click="closeModal3()">Okay</button>
        </div>
      </div>
    </div>
    <!--end modal-->
    <Loader v-if="processing" />
  </div>
</template>
<script>
import moment from "vue-moment";
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import Footer from "@/components/footer/Footer.vue";
import Loader from "@/components/widgets/BlockingLoader.vue";
import axios from "axios";
/*import datetime from 'vuejs-datetimepicker';*/

export default {
  name: "RegisterForTrialClass",
  props: ["RegisterData"],
  components: {
    Header,
    Footer,
    Loader
  },
  data: function() {
    return {
      userId: 0,
      processing: false,
      registerButtonClicked: false,
      demoCourses: [],
      Selectedkey: 0,
      prerequisites: [],
      topics: [],
      outcomes: [],
      dateTimes: "",
      parent_name: "",
      parent_mail: "",
      parent_contact: "",
      kids_name: "",
      grade: 0,
      courses: 0,
      institute_name: "",
      trainer_name: "",
      schedule_date: "",
      query_assigned_to: "",
      trainersList: "",
      availableTimeSlots: "",
      reqId: 0,
      country: "",
      state: "",
      city: "",
      currentDate: new Date().toISOString().slice(0, 10)
    };
  },
  mounted() {
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.role_id = this.$store.getters.getAuthData.auth_role_id;
          this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
          this.currentDate = new Date();
          this.currentDate.setTime(
            this.currentDate.getTime() + 330 * 60 * 1000
          );
          this.currentDate = this.currentDate.toISOString().substring(0, 10);
          $("#schedule-time").prop("min", this.currentDate);
          if (this.RegisterData) {
            this.parent_name = this.RegisterData.parent_name;
            this.parent_mail = this.RegisterData.parent_email;
            let parent_contact = this.RegisterData.parent_contact.replace(
              /\s+/g,
              ""
            );
            this.parent_contact = parent_contact.replace("+", "");
            this.kids_name = this.RegisterData.kids_name;
            this.reqId = this.RegisterData.req_id;
            this.country = this.RegisterData.country;
            this.state = this.RegisterData.state;
            this.city = this.RegisterData.city;
            this.currentDate =
              this.RegisterData.expected_schedule_date != "0000-00-00"
                ? new Date(this.RegisterData.expected_schedule_date)
                    .toISOString()
                    .slice(0, 10)
                : this.currentDate;
            this.institute_name = this.RegisterData.institute;
            let grade =
              this.RegisterData.grade != 0 ? this.RegisterData.grade : "UKG";
            $("#grade").val(grade);
            $("#course_level").val(this.RegisterData.demo_course_id);
          }

          this.getAllDemoCourses();
        }
      }.bind(this)
    );
  },
  methods: {
    closeModal() {
      hideModal("successMessage");
    },
    closeModal2() {
      hideModal("errorMessage");
    },
    closeModal3() {
      hideModal("warningMessage");
    },

    validateEmail(email) {
      return validateEmail(email);
    },
    validatePhone(phone) {
      return validatePhone(phone);
    },
    bookForTrailClasss(e) {
      e.preventDefault();
      var trainer_calender_id = $("input[name=bookslot]:checked").val();
      this.registerButtonClicked = true;
      var canSubmit = true;
      if (!this.parent_name) canSubmit = false;
      if (!this.validateEmail(this.parent_mail)) canSubmit = false;
      if (!this.validatePhone(this.parent_contact)) canSubmit = false;
      if (!this.kids_name) canSubmit = false;
      if (!trainer_calender_id) {
        canSubmit = false;
        cvNotify("Please Select Time Slot", "warning");
      }
      if (!canSubmit) return;
      this.sendRequest();
    },
    sendRequest() {
      this.processing = true;
      var demo_course_id = $("#course_level").val();
      var trainer_id = $("#trainer").val();
      var grade = $("#grade").val();
      let class_id = this.trainersList.filter(x => x.user_id == trainer_id)[0]
        .t_class_link_id;
      let class_link_name = this.trainersList.filter(
        x => x.user_id == trainer_id
      )[0].class_link;

      var trainer_calender_id = $("input[name=bookslot]:checked").val();
      var date_s_time_slot = this.availableTimeSlots.filter(
        x => x.trainer_calender_id == trainer_calender_id
      )[0].date_s_time_slot;
      axios
        .post("/api/liveCourse/sendRequestForScheduleMail", {
          parent_name: this.parent_name,
          parent_mail: this.parent_mail,
          parent_contact: this.parent_contact,
          kids_name: this.kids_name,
          demo_course_id: demo_course_id,
          trainer_id: trainer_id,
          trainer_calender_id: trainer_calender_id,
          grade: grade,
          institute_name: this.institute_name,
          t_class_link_id: class_id,
          date_s_time_slot: date_s_time_slot,
          theme: this.demoCourses[this.Selectedkey].theme,
          class_link: class_link_name,
          req_id: this.reqId,
          country: this.country,
          state: this.state,
          city: this.city,
          sales_person_id: this.userId
        })
        .then(res => {
          // console.log(res.data);
          if (res.data != "booked" && res.data != "err result") {
            this.parent_name = "";
            this.parent_mail = "";
            this.parent_contact = "";
            this.kids_name = "";
            $("input[name=bookslot]").prop("checked", false);

            showModal("successMessage");
          } else if (res.data == "err result") {
            showModal("warningMessage");
          } else {
            showModal("errorMessage");
          }
          this.getAllDemoCourses();
          this.processing = false;
        });
    },
    getAllDemoCourses() {
      let vm = this;
      axios.post("/api/liveCourse/getDemoCoursesForFreeTrail").then(res => {
        vm.demoCourses = res.data;
        this.GetTarinersList();
      });
    },
    GetTarinersList() {
      var trial_course_id = $("#course_level").val();
      if (!trial_course_id)
        trial_course_id = this.demoCourses[0].demo_course_id;

      axios
        .post("/api/liveCourse/getTrainersAccordingList", {
          course_id: trial_course_id
        })
        .then(res => {
          this.trainersList = res.data;

          if (this.trainersList && this.trainersList.length) {
            this.availableTimeSlot();
          } else {
            this.availableTimeSlots = [];
          }
        });
    },
    availableTimeSlot() {
      var trainer_id = $("#trainer").val();
      if (!trainer_id) trainer_id = this.trainersList[0].user_id;
      let vm = this;

      axios
        .post("/api/liveCourse/gettraineravailableTimeSlots", {
          user_id: trainer_id,
          dates: this.currentDate
        })
        .then(res => {
          vm.availableTimeSlots = res.data;
        });
    },
    demoCourseDetails() {
      let demoCourseId = $("#course_level").val();
      let demoClassdata = this.demoCourses.findIndex(
        x => x.demo_course_id == demoCourseId
      );
      // console.log(demoClassdata);
      this.Selectedkey = demoClassdata;
      this.prerequisites = this.demoCourses[
        this.Selectedkey
      ].prerequisite.split(",");
      this.topics = this.demoCourses[this.Selectedkey].topics.split(",");
      this.outcomes = this.demoCourses[this.Selectedkey].outcomes.split(",");
      // console.log(this.prerequisites);

      showModal("demo-course-modal");
    },
    handleCloseLearnAtHomeClicked() {
      hideModal("demo-course-modal");
    },
    handleRegisterLearnAtHomeClicked() {
      console.log("dfsdf");
    }
  }
};
</script>
<style scoped lang="scss">
#demo-course-modal {
  & > div {
    padding: 0 16px 16px;
    overflow: auto;
  }
  h3 {
    padding: 24px 0 16px;
    font-display: "Poppins";
    font-weight: bold;
  }
  img {
    display: block;
    width: 300px;
    margin: 0 auto 16px;
    border-radius: 8px;
  }

  .course-details {
    padding: 0 0 16px;
    font-size: 1rem;
    text-align: left;
  }
  p {
    padding: 0 0 16px;
    font-size: 1rem;
    text-align: left;
  }

  .btn-link {
    color: #212121;
  }
}
</style>