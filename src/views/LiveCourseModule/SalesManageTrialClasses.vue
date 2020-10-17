<template>
  <div>
    <Header>
      <div class="bannerimg">
        <div class="header-text mb-0">
          <div class="container">
            <div class="text-center text-white">
              <h1 class>Demo Session Management</h1>
            </div>
          </div>
        </div>
      </div>
    </Header>
    <!--register users-->
    <!--Register-section-->
    <section class="sptb">
      <div class="container">
        <div class="row">
          <div class="single-page">
            <div class="col-lg-8 col-xl-12 col-md-12 d-block mx-auto">
              <div class="wrapper wrapper2">
                <!--Table Start-->
                <div class="table-responsive">
                  <table class="table card-table table-vcenter text-nowrap" style="overflow:auto">
                    <thead class="bg-secondary text-white">
                      <tr>
                        <th class="text-white">Sr. No.</th>
                        <th class="text-white">Date</th>
                        <th class="text-white">Time Slot</th>
                        <th class="text-white">Duration</th>
                        <th class="text-white">Course Module</th>
                        <th class="text-white">Session Status</th>
                        <th class="text-white">Student Name</th>
                        <th class="text-white">Trainer Name</th>
                        <th class="text-white">Final Status</th>
                        <td class="text-white">Action</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(data,index) in schedularManagement" :key="index">
                        <td>{{index+1}}</td>
                        <td>{{data.schedule_date}}</td>
                        <td>{{data.schedule_s_time}}-{{data.schedule_e_time}}</td>
                        <td>{{data.duration}} Minutes</td>
                        <td>{{data.theme}}</td>
                        <td>
                          <select
                            class="form-control users-status"
                            :id="'user_status'+(index+1)"
                            @change="userStatusChange(index)"
                            disabled
                          >
                            <option
                              value="not_done"
                              :selected="data.statusss=='not_done'?true:false"
                            >Not Done</option>
                            <option
                              value="reschedule"
                              :selected="data.statusss=='reschedule'?true:false"
                            >Reschedule</option>
                            <option value="done" :selected="data.statusss=='done'?true:false">Done</option>
                          </select>
                        </td>
                        <td>
                          {{data.trainee_name}}
                          <i
                            class="fa fa-info-circle text-info"
                            @click="traineeModalData(index)"
                          ></i>
                        </td>
                        <td>{{data.trainer_name}}</td>
                        <td>
                          {{data.feedback_status?data.feedback_status:'_'}}
                          <i
                            v-if="data.feedback_status"
                            class="fa fa-info-circle text-info cursor-pointer"
                            @click="feedbackMethod(index)"
                          ></i>
                        </td>
                        <td>
                          <i
                            class="fas fa-edit trainer-row-edit text-success mr-2"
                            :id="'edit'+(index+1)"
                            @click="editScheduleFunction((index+1))"
                          ></i>
                          <i
                            class="fas fa-save trainer-row-save text-success mr-2"
                            :id="'save'+(index+1)"
                            @click="saveScheduleTime((index+1))"
                            style="display:none"
                          ></i>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!--table end-->
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
    <!--Reschedule time-->
    <div id="demo-trainee-reschedule" class="cv-modal large">
      <div>
        <h3
          class="text-center mt-3"
          id="trail-course-name"
        >{{schedularManagement.length?schedularManagement[SelectedKey].trainee_name:''}}</h3>
        <div class="course-details">
          <div class="col-sm-12 mx-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Parent Name:</label>
            <span
              style="margin-left:3%;"
            >{{schedularManagement.length?schedularManagement[SelectedKey].parent_name:''}}</span>
          </div>
          <div class="col-sm-12 mx-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Parent Email:</label>
            <span
              style="margin-left:3%;"
            >{{schedularManagement.length?schedularManagement[SelectedKey].parent_email:''}}</span>
          </div>
          <div class="col-sm-12 mx-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Parent Contact:</label>
            <span
              style="margin-left:3%;"
            >{{schedularManagement.length?schedularManagement[SelectedKey].parent_contact:''}}</span>
          </div>
          <div class="col-sm-12 mx-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Course Module:</label>
            <span
              style="margin-left:3%;"
            >{{schedularManagement.length?schedularManagement[SelectedKey].theme:''}}</span>
          </div>
          <div class="col-sm-12 mx-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Session Date:</label>
            <input
              type="date"
              placeholder
              id="schedule-time"
              v-model="rescheduledate"
              @change="availableTimeSlot"
            />
          </div>
          <div class="col-sm-12 mx-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Trainer Name:</label>
            <select id="trainer" class="form-control" @click="availableTimeSlot">
              <option
                v-for="(trainer,index) in trainersList"
                :key="index"
                :value="trainer.user_id"
              >{{trainer.name}}</option>
            </select>
          </div>
        </div>
        <div class="row mt-4" v-if="availableTimeSlots && availableTimeSlots.length">
          <caption class="col-sm-12 text-center">Available Time Slot</caption>
          <div class="col-sm-12">
            <div class="col-12 p-0 pt-2">
              <div
                v-for="(availableTimeSlot,index) in availableTimeSlots"
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
                    :value="availableTimeSlot.schedule_s_time"
                  />
                  <label
                    for="radiotime0"
                    :class="'font12 sm_font12  radio_custom_label noOutline timeslots'"
                    :id="'timeslot'+(index+1)"
                  >
                    <i
                      class="fa fa-check Timechecks"
                      style="display:none"
                      :id="'checked'+(index+1)"
                    ></i>
                    &nbsp;{{availableTimeSlot.schedule_s_time}}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center my-4">
          <button class="btn btn-primary mx-1" @click="rescheduleClass()">Confirm</button>
          <button class="btn btn-primary" @click="handleCloseRescheduleClicked">Close</button>
        </div>
      </div>
    </div>
    <!--end reschedule time-->

    <!--user information-->
    <div id="demo-trainee-information" class="cv-modal large">
      <div>
        <h3
          class="text-center mt-3"
          id="trail-course-name"
        >{{schedularManagement.length?schedularManagement[SelectedKey].trainee_name:''}}</h3>
        <div class="course-details row mt-2">
          <div class="col-sm-6 px-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Parent Name:</label>
            <span
              style="margin-left:3%;"
            >{{schedularManagement.length?schedularManagement[SelectedKey].parent_name:''}}</span>
          </div>
          <div class="col-sm-6 px-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Parent Email:</label>
            <span
              style="margin-left:3%;"
            >{{schedularManagement.length?schedularManagement[SelectedKey].parent_email:''}}</span>
          </div>
          <div class="col-sm-6 px-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Parent Contact:</label>
            <span
              style="margin-left:3%;"
            >{{schedularManagement.length?schedularManagement[SelectedKey].parent_contact:''}}</span>
          </div>
          <div class="col-sm-6 px-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Course Module:</label>
            <span
              style="margin-left:3%;"
            >{{schedularManagement.length?schedularManagement[SelectedKey].theme:''}}</span>
          </div>
          <div class="col-sm-6 px-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Session Date:</label>
            <span
              style="margin-left:3%;"
            >{{schedularManagement.length?schedularManagement[SelectedKey].schedule_date:''}}</span>
          </div>
          <div class="col-sm-6 px-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Session Time:</label>
            <span
              style="margin-left:3%;"
            >{{ schedularManagement.length?schedularManagement[SelectedKey].schedule_s_time:''}}-{{ schedularManagement.length?schedularManagement[SelectedKey].schedule_e_time:''}}</span>
          </div>
        </div>
        <div v-if="schedularManagement.length&&schedularManagement[SelectedKey].req_id">
          <h3
            class="text-center mt-3"
            id="trail-course-name"
          >{{schedularManagement.length?schedularManagement[SelectedKey].trainer_name+"'s":''}} suggestion</h3>
          <div class="course-details row mt-2">
            <div class="col-sm-12 px-4" v-if="schedularManagement.length&&SuggestedCouses.length">
              <label
                style="font-weight:bold;font-display: 'Poppins';font-size:16px;"
              >Course Suggestion:</label>
              <span
                style="margin-left:3%;"
                v-for="(SuggestedCouse,index) in SuggestedCouses"
                :key="index"
              >{{index+1}}. {{ schedularManagement.length?SuggestedCouse:''}}</span>
            </div>
            <div class="col-sm-12 px-4" v-if="schedularManagement.length&&Skills.length">
              <label
                style="font-weight:bold;font-display: 'Poppins';font-size:16px;"
              >{{schedularManagement.length?schedularManagement[SelectedKey].trainee_name+"'s":''}} Skills:</label>
              <br />
              <span style="margin-left:3%;my-1" v-for="(Skill,key) in Skills" :key="key">
                <b class="mx-2">{{Object.keys(Skill).toString()}}:</b>
                {{parseFloat(Object.values(Skill).toString())*100+'%'}}
                <br />
              </span>
            </div>

            <div class="col-sm-12 px-4" v-if="schedularManagement.length&&SuggestedCouses.length">
              <label style="font-weight:bold;font-display: 'Poppins';font-size:16px;">Description:</label>

              <span
                style="margin-left:3%;"
              >{{schedularManagement.length?schedularManagement[SelectedKey].comments:''}}</span>
            </div>
          </div>
        </div>
        <div class="text-center my-4">
          <button class="btn btn-primary" @click="handleCloseLearnAtHomeClicked">Close</button>
        </div>
      </div>
    </div>
    <!--Feedback Modal -->
    <!-- Large Modal -->
    <template v-for="(data,index) in schedularManagement">
      <div :id="'Feedback'+(index+1)" class="modal fade" :key="index">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header pd-x-20">
              <h3 class="modal-title">Final Status</h3>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body pd-20">
              <div class="card mb-lg-0">
                <div class="card-body">
                  <div>
                    <div class="form-group">
                      <select
                        class="form-control col-sm-10 users-feedbacks"
                        :id="'user-feedback'+(index+1)"
                        @click="ViewCoursesEnable(index+1)"
                        disabled
                      >
                        <option value="0">--Select Option--</option>
                        <template v-for="(feedback,key) in feedbacks">
                          <option
                            :key="key"
                            :value="feedback.feedback_status_id"
                            :selected="feedback.feedback_status_id === data.feedback_status_id?true:false"
                          >{{feedback.feedback_status}}</option>
                        </template>
                      </select>
                    </div>
                    <div class="form-group">
                      <select
                        class="form-control col-sm-10 users-feedbacks"
                        style="color:#000;"
                        :id="'user-products'+(index+1)"
                        v-if="data.feedback_status_id==4||viewCourses === 1"
                      >
                        <option value="0" disabled>--Select Option--</option>
                        <template v-for="(suggestCourse,key2) in suggestedCourseSelection">
                          <option
                            style="color:#000;"
                            :key="key2"
                            :value="suggestCourse.product_id"
                            :selected="suggestCourse.product_id ==data.sale_product_id?true:false"
                          >{{suggestCourse.live_course_name}}</option>
                        </template>
                      </select>
                    </div>

                    <div class="form-group">
                      <textarea
                        class="content2 form-control feedbacks-descs"
                        :id="'feed_desc'+(index+1)"
                        name="example"
                        rows="6"
                        placeholder="Detail descriptions..."
                        :value="data.feedback_message"
                        disabled
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- modal-body -->
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary feedbackSubmits"
                :id="'feedbacksubmit'+(index+1)"
                disabled
                @click="submitFeedbackMessage(data.assigned_id,(index+1))"
              >Submit</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- modal-dialog -->
    <!--End FeedbackModal -->
    <!--end user information-->
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
  components: {
    Header,
    Footer,
    Loader
  },
  data: function() {
    return {
      userId: 0,
      processing: false,
      schedularManagement: [],
      SelectedKey: 0,
      rescheduledate: new Date().toISOString().slice(0, 10),
      rescheduleTime: "",
      trainersList: [],
      availableTimeSlots: [],
      selectTimeSlot: -1,
      feedbacks: [],
      trainerSuggestion: [],
      SuggestedCouses: [],
      Skills: [],
      viewCourses: 0,
      suggestedCourseSelection: []
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
          this.getSalesScheduleClasses();
        }
      }.bind(this)
    );
  },
  methods: {
    ViewCoursesEnable(key) {
      let CourseOption = $("#user-feedback" + key).val();
      if (CourseOption == 4) {
        this.viewCourses = 1;
      } else {
        this.viewCourses = 0;
      }
    },
    feedbackMethod(key) {
      if (this.schedularManagement[key].course_suggestion) {
        let CourseIds = this.schedularManagement[key].courses_ids;
        axios
          .post("/api/liveCourse/getSuggestedCourses", {
            courses_ids: CourseIds
          })
          .then(res => {
            this.suggestedCourseSelection = res.data;
          });
      }

      //console.log(this.Skills);
      $("#Feedback" + (key + 1)).modal("show");
    },
    submitFeedbackMessage(assigned_id, key) {
      let feedbackDes = $("#feed_desc" + key).val();
      let feedbackStatus = $("#user-feedback" + key).val();
      let product_id;
      if (feedbackStatus == 4) {
        product_id = $("#user-products" + key).val();
        if (!product_id || product_id == 0) {
          cvNotify("Please wait trainer suggestion", "warning");
          return false;
        }
      } else {
        product_id = 0;
      }
      axios
        .post("/api/liveCourse/saveMyTraineeFeedback", {
          assigned_id: assigned_id,
          feed_desc: feedbackDes,
          feedbackStatus: feedbackStatus,
          product_id: product_id,
          user_id: this.userId
        })
        .then(async res => {
          cvNotify("Successfully Updated");

          $("#Feedback" + key).modal("hide");
          await this.saveScheduleTime(key + 1);
          await this.getSalesScheduleClasses();
          await this.saveScheduleTime(key);
        });
    },
    rescheduleClass() {
      let courseId = this.schedularManagement[this.SelectedKey].course_id;
      let pre_trainer_id = this.schedularManagement[this.SelectedKey]
        .trainer_id;
      let pre_trainer_name = this.schedularManagement[this.SelectedKey]
        .trainer_name;
      let pre_trainer_email = this.schedularManagement[this.SelectedKey]
        .trainer_mail;
      let pre_trainer_contact = this.schedularManagement[this.SelectedKey]
        .trainer_contact;
      var trainer_id = $("#trainer").val();
      let pre_trainer_calender_id = this.schedularManagement[this.SelectedKey]
        .trainer_calender_id;
      let assigned_id = this.schedularManagement[this.SelectedKey].assigned_id;
      let trainer_name = this.trainersList.filter(
        x => x.user_id == trainer_id
      )[0].name;
      let trainer_mail = this.trainersList.filter(
        x => x.user_id == trainer_id
      )[0].trainer_email;
      let trainer_contact = this.trainersList.filter(
        x => x.user_id == trainer_id
      )[0].trainer_contact;
      if (this.selectTimeSlot == -1)
        cvNotify("Please choose kids time slot", "error");
      else {
        let trainer_calender_id = this.availableTimeSlots[this.selectTimeSlot]
          .trainer_calender_id;
        let date_s_time_slot = this.availableTimeSlots[this.selectTimeSlot]
          .date_s_time_slot;
        let class_id = this.trainersList.filter(x => x.user_id == trainer_id)[0]
          .t_class_link_id;
        let class_link_name = this.trainersList.filter(
          x => x.user_id == trainer_id
        )[0].class_link;
        this.processing = true;

        axios
          .post("/api/liveCourse/sendRequestForReschedule", {
            parent_name: this.schedularManagement[this.SelectedKey].parent_name,
            parent_mail: this.schedularManagement[this.SelectedKey]
              .parent_email,
            parent_contact: this.schedularManagement[this.SelectedKey]
              .parent_contact,
            kids_name: this.schedularManagement[this.SelectedKey].trainee_name,
            trainee_id: this.schedularManagement[this.SelectedKey].trainee_id,
            demo_course_id: courseId,
            trainer_id: trainer_id,
            pre_trainer_id: pre_trainer_id,
            trainer_name: trainer_name,
            pre_trainer_name: pre_trainer_name,
            trainer_email: trainer_mail,
            pre_trainer_email: this.schedularManagement[this.SelectedKey]
              .trainer_email,
            trainer_contact: trainer_contact,
            pre_trainer_contact: pre_trainer_contact,
            trainer_calender_id: trainer_calender_id,
            t_class_link_id: class_id,
            pre_date_s_time_slot: this.schedularManagement[this.SelectedKey]
              .date_s_time_slot,
            date_s_time_slot: date_s_time_slot,
            theme: this.schedularManagement[this.SelectedKey].theme,
            class_link: class_link_name,
            assigned_id: assigned_id,
            sales_person_id: this.userId
          })
          .then(async res => {
            this.processing = false;
            cvNotify("Successfully Rescheduled");
            await this.getSalesScheduleClasses();
            await this.saveScheduleTime(this.SelectedKey + 1);
            hideModal("demo-trainee-reschedule");
          });
      }
      //console.log(trainer_mail);
    },
    changeTimeSlot(index) {
      $(".timeslots").removeClass("active_slot");
      $("#timeslot" + (index + 1)).addClass("active_slot");
      $(".Timechecks").hide();
      $("#checked" + (index + 1)).show();
      this.selectTimeSlot = index;
    },
    availableTimeSlot() {
      var trainer_id = $("#trainer").val();
      if (!trainer_id) trainer_id = this.trainersList[0].user_id;
      let vm = this;

      this.rescheduledate = new Date(this.rescheduledate);
      /* this.rescheduledate = this.rescheduledate.toLocaleString("en-US", {
            timeZone: "Asia/Kolkata"
            });*/
      this.rescheduledate = new Date(this.rescheduledate);
      let h = this.rescheduledate.getHours();
      let m = this.rescheduledate.getMinutes();
      if (h < 10) h = "0" + h;
      if (m < 10) m = "0" + m;
      this.rescheduleTime = h + ":" + m;
      this.rescheduledate = this.rescheduledate.toISOString().slice(0, 10);
      axios
        .post("/api/liveCourse/gettraineravailableTimeSlots", {
          user_id: trainer_id,
          dates: this.rescheduledate
        })
        .then(res => {
          vm.availableTimeSlots = res.data;
        });
    },
    userStatusChange(key) {
      let statuss = $("#user_status" + (key + 1)).val();

      if (statuss == "reschedule") {
        this.SelectedKey = key;
        this.rescheduledate = new Date(
          this.schedularManagement[this.SelectedKey].date_s_time_slot
        );
        let courseId = this.schedularManagement[this.SelectedKey].course_id;
        axios
          .post("/api/liveCourse/getTrainersAccordingList", {
            course_id: courseId
          })
          .then(res => {
            this.trainersList = res.data;
            if (this.trainersList && this.trainersList.length) {
              this.availableTimeSlot();
            } else {
              this.availableTimeSlots = [];
            }
            showModal("demo-trainee-reschedule");
          });

        //
      }
    },
    editScheduleFunction(key) {
      $(".fa-edit").show();
      $("#edit" + key).hide();
      $(".trainer-row-save").hide();
      $("#save" + key).show();
      $(".users-status").attr("disabled", "disabled");
      $(".users-feedbacks").attr("disabled", "disabled");

      let keyy = key - 1;

      if (this.schedularManagement[keyy].statusss == "done") {
        $(".feedbackSubmits").attr("disabled", "disabled");
        $(".feedbacks-descs").attr("disabled", "disabled");
        $(".users-feedbacks").attr("disabled", "disabled");

        if (!this.schedularManagement[keyy].feedback_status_id) {
          $("#user-feedback" + key).removeAttr("disabled");
          $("#user-products" + key).removeAttr("disabled");
          $("#feed_desc" + key).removeAttr("disabled");
          $("#feedbacksubmit" + key).removeAttr("disabled");
        }

        $("#Feedback" + key).modal("show");

        if (this.schedularManagement[keyy].course_suggestion) {
          let CourseIds = this.schedularManagement[keyy].courses_ids;
          axios
            .post("/api/liveCourse/getSuggestedCourses", {
              courses_ids: CourseIds
            })
            .then(res => {
              this.suggestedCourseSelection = res.data;
            });
        }

        $("#feedbacksubmit" + key).removeAttr("disabled");
      } else $("#user_status" + key).removeAttr("disabled");
    },
    saveScheduleTime(key) {
      let userStatus = $("#user_status" + key).val();
      let ind = key - 1;

      if (userStatus == "done" || userStatus == "not_done") {
        if (this.schedularManagement[ind].statusss != userStatus) {
          cvNotify("Sales Person only Reschedule user class", "warning");
          $("#user_status" + key).val(this.schedularManagement[ind].statusss);
        }
      }
      $(".trainer-row-save").hide();
      $(".fa-edit").show();
      $("#edit" + key).show();
      $(".users-status").attr("disabled", "disabled");
      $(".feedbacks-descs").attr("disabled", "disabled");
      $(".users-feedbacks").attr("disabled", "disabled");
      $(".feedbackSubmits").attr("disabled", "disabled");
      // cvNotify("Coming Soon", "Warning");
    },
    handleCloseLearnAtHomeClicked() {
      hideModal("demo-trainee-information");
    },
    handleCloseRescheduleClicked() {
      hideModal("demo-trainee-reschedule");
    },
    traineeModalData(key) {
      this.SelectedKey = key;
      if (this.schedularManagement[this.SelectedKey].course_suggestion)
        this.SuggestedCouses = this.schedularManagement[
          this.SelectedKey
        ].course_suggestion.split("|");
      if (this.schedularManagement[this.SelectedKey].skills) {
        this.Skills = JSON.parse(
          this.schedularManagement[this.SelectedKey].skills
        );
      }

      showModal("demo-trainee-information");
      //
    },
    getSalesScheduleClasses() {
      axios
        .post("/api/liveCourse/getTrialDataForSales", { user_id: this.userId })
        .then(res => {
          this.schedularManagement = res.data.result;
        });
      axios.post("/api/liveCourse/getSalesPersonFeedbacks").then(res => {
        this.feedbacks = res.data;
      });
      /*axios.post("/api/liveCourse/getSalesSuggestionByTrainer", { user_id: this.userId }).then(res =>{
           this.trainerSuggestion =res.data;
        })*/
    }
  }
};
</script>
<style scoped lang="scss">
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