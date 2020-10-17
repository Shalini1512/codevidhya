<template>
  <div style="position:relative;overflow:auto;height:100%;margin-top:59px;">
    <div class="panel-body tabs-menu-body">
      <div class="tab-content">
        <div class="tab-pane active" id="tab1">
          <div
            class="row p-2 bg-primary d-flex align-items-center"
            style="width: 100%; padding-left: 0; padding: 20px !important;"
          >
            <div class="col-sm-2 text-white">
              Courses
              <select
                class="form-control"
                id="filterCourses"
                @change="filterAccordingSubject()"
              >
                <option value="0">All</option>
                <template v-for="(course, index) in courses">
                  <option :key="index" :value="course.course_id">{{
                    course.course_name
                  }}</option>
                </template>
              </select>
            </div>
            <div class="col-sm-2 text-white">
              Booked/Not Booked
              <select
                class="form-control"
                id="filterbooked"
                @change="filterAccordingSubject()"
              >
                <option value="0">All</option>
                <option value="booked">Booked</option>
                <option value="not_booked">Not Booked</option>
              </select>
            </div>
            <div class="col-sm-2 text-white">
              Filter Data
              <select
                class="form-control"
                id="filterdate"
                @change="fileterByDate"
              >
                <option value="0">All</option>
                <option value="1">Filter</option>
              </select>
            </div>
            <div
              class="col-sm-2 text-white"
              id="start_date"
              style="display:none"
            >
              Start Date
              <input
                class="form-control"
                id="filter_start_date"
                type="date"
                @change="filterDateForTrainerTimeSlot()"
              />
            </div>
            <div
              class="col-sm-2 text-white"
              id="last_date"
              style="display:none"
            >
              Last Date
              <input
                class="form-control"
                id="filter_last_date"
                type="date"
                @change="filterDateForTrainerTimeSlot()"
              />
            </div>
            <div
              class="col-sm-6 text-right add-schedule-button"
              style="margin-top: 20px;"
            >
              <button
                class="btn btn-white"
                @click="callFunctionForNewTimeSlot($event)"
              >
                Add Time Slot
              </button>
            </div>
          </div>
          <!--table-->
          <div v-if="userTimeSlots && userTimeSlots.length">
            <div>
              <table
                class="table-responsive card-table text-nowrap"
                id="table-id"
              >
                <thead class="bg-secondary text-white">
                  <tr>
                    <th class="text-white">Sr. No.</th>
                    <th class="text-white">Date</th>
                    <th class="text-white">Time Slot</th>
                    <th class="text-white">Duration</th>
                    <th class="text-white">Course</th>
                    <th class="text-white">Student Name</th>
                    <th class="text-white">Booked/Not Booked</th>
                    <th class="text-white">Session Status</th>
                    <th class="text-white">Feedback/Certificate</th>
                    <th class="text-white">Psycometric</th>
                    <th class="text-white">Purchases Status</th>
                    <th class="text-white">Action</th>
                  </tr>
                </thead>

                <tbody>
                  <template v-for="(userTimeSlot, index) in userTimeSlots">
                    <tr :key="index">
                      <th>{{ index + 1 }}</th>
                      <td>{{ userTimeSlot.schedule_date }}</td>
                      <td>
                        {{
                          userTimeSlot.schedule_s_time +
                            "-" +
                            userTimeSlot.schedule_e_time
                        }}
                      </td>
                      <td>{{ userTimeSlot.duration }} Minutes</td>
                      <td>{{ userTimeSlot.course_name }}</td>
                      <td>
                        {{ userTimeSlot.name }}
                        <i
                          v-if="userTimeSlot.name"
                          class="fa fa-info-circle cursor-pointer"
                          style="cursor:pointer"
                          @click="traineeModalData(index)"
                        ></i>
                      </td>
                      <!--<td>{{userTimeSlot.name?'Booked':'Not Booked'}}</td>-->
                      <td>
                        <select
                          class="form-control book-options"
                          :id="'book_option' + (index + 1)"
                          :data-item-id="userTimeSlot.trainer_calender_id"
                          :data-original-value="userTimeSlot.statusss"
                          disabled="true"
                        >
                          <option
                            :selected="
                              userTimeSlot.name && userTimeSlot.booked == 0
                                ? true
                                : false
                            "
                            value="booked"
                            disabled
                            >Booked</option
                          >
                          <option
                            :selected="
                              !userTimeSlot.name && userTimeSlot.booked == 1
                                ? true
                                : false
                            "
                            value="blocked"
                            >Blocked/Leave</option
                          >
                          <option
                            :selected="
                              !userTimeSlot.name && userTimeSlot.booked == 0
                                ? true
                                : false
                            "
                            value="not_book"
                            >Not Booked</option
                          >
                        </select>
                      </td>
                      <td class="row">
                        <select
                          class="users-status form-control col-sm-10"
                          :id="'user_status' + (index + 1)"
                          :data-item-id="userTimeSlot.trainer_calender_id"
                          :data-original-value="userTimeSlot.statusss"
                          disabled="true"
                          @change="
                            GetCancleReasonOption(
                              index,
                              userTimeSlot.assigned_id
                            )
                          "
                        >
                          <option
                            value="not_done"
                            :selected="
                              userTimeSlot.name &&
                              userTimeSlot.statusss == 'not_done'
                                ? true
                                : false
                            "
                            disabled
                            >Not Done</option
                          >
                          <option
                            value="reschedule"
                            :selected="
                              userTimeSlot.name &&
                              userTimeSlot.statusss == 'reschedule'
                                ? true
                                : false
                            "
                            disabled
                            >Reschedule</option
                          >
                          <option
                            value="done"
                            :selected="
                              userTimeSlot.name &&
                              userTimeSlot.statusss == 'done'
                                ? true
                                : false
                            "
                            >Done</option
                          >
                          <option
                            value="cancle"
                            :selected="
                              userTimeSlot.name &&
                              userTimeSlot.statusss == 'cancle'
                                ? true
                                : false
                            "
                            >Cancle</option
                          >
                        </select>
                        <i
                          v-if="
                            userTimeSlot.name &&
                              userTimeSlot.statusss == 'cancle'
                          "
                          class="fa fa-info-circle text-info mt-2"
                          @click="
                            GetCancleReason(
                              userTimeSlot.cancle_region,
                              userTimeSlot.assigned_id
                            )
                          "
                        ></i>
                      </td>
                      <!--td><button v-if="(userTimeSlot.name && userTimeSlot.statusss=='done')&&!userTimeSlot.student_feedback_id?true:false" class="btn btn-link btn-black" @click="$router.push({name:'StudentfeedbackReport',params:{req_id:userTimeSlot.req_id}})">Feedback</button></td-->
                      <td>
                        <select
                          :id="'session-feedback-' + (index + 1)"
                          class="certificate-keyword-select form-control flex-grow-1"
                          disabled="true"
                        >
                          <option value="Zeal to Learn">Zeal to Learn</option>
                          <option value="Creativity">Creativity</option>
                          <option value="Enthusiasm">Enthusiasm</option>
                          <option value="Inquisitiveness"
                            >Inquisitiveness</option
                          >
                        </select>
                      </td>
                      <!--<td><button v-if="(userTimeSlot.name && userTimeSlot.statusss=='done')&&!userTimeSlot.student_feedback_id?true:false" class="btn btn-link btn-black" @click="$router.push({name:'StudentfeedbackReport',params:{req_id:userTimeSlot.req_id}})">Feedback</button></td>-->
                      <td>
                        <button
                          v-if="
                            userTimeSlot.name && userTimeSlot.statusss == 'done'
                              ? true
                              : false
                          "
                          class="btn btn-link btn-black"
                          @click="
                            $router.push({
                              name: 'StudentfeedbackReport',
                              params: { req_id: userTimeSlot.req_id },
                            })
                          "
                        >
                          Report
                        </button>
                      </td>
                      <td>
                        {{
                          userTimeSlot.feedback_status
                            ? userTimeSlot.feedback_status
                            : "none"
                        }}
                        <i
                          v-if="userTimeSlot.student_feedback_id"
                          class="fa fa-info-circle text-info"
                          style="cursor:pointer"
                          @click="feedbackMethod(index)"
                        ></i>
                      </td>
                      <td>
                        <i
                          class="fas fa-edit trainer-row-edit text-success mr-2"
                          :id="'edit' + (index + 1)"
                          @click="
                            editScheduleFunction(
                              userTimeSlot.trainer_calender_id,
                              index + 1
                            )
                          "
                        ></i>
                        <i
                          class="fas fa-save trainer-row-save text-success mr-2"
                          :id="'save' + (index + 1)"
                          @click="
                            saveScheduleTime(
                              userTimeSlot.trainer_calender_id,
                              index + 1
                            )
                          "
                          style="display:none"
                        ></i>
                        <i
                          class="far fa-trash-alt text-danger"
                          onclick="cvNotify('Comming Soon','warning')"
                          style="display:none"
                        ></i>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else>
            <div class="text-center col-xl-12 m-6 text-gray">
              No Slot Available Yet!
            </div>
          </div>
          <!--end table-->
        </div>
      </div>
    </div>
    <Loader v-if="processing" />
  </div>
</template>

<script>
import moment from "vue-moment";
import Loader from "@/components/widgets/BlockingLoader.vue";
import axios from "axios";
import AuthMixin from "@/mixins/AuthMixin.js";

export default {
  mixins: [AuthMixin],
  components: {
    Loader,
  },
  data() {
    return {
      userId: 0,
      isSignedIn: "",
      sch_id: "",
      courses: [],
      userTimeSlots: [],
      SelectedKey: 0,
      followUpDetails: [],
      processing: false,
      feedbacks: [],
      suggestedCourseSelection: [],
      changingStatusForItem: 0,
      selectElementForCurrentStatusChangeModal: null,
      originalStatusValueForSelectedStatusChange: "not_done",
    };
  },
  mounted: function() {
    hideTawk();
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.role_id = this.$store.getters.getAuthData.auth_role_id;
          this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
          this.getBasicDeatils(this.userId);
        }
      }.bind(this)
    );
  },
  methods: {
    async feedbackMethod(key) {
      let reqId = this.userTimeSlots[key].req_id;
      let CourseIds = this.userTimeSlots[key].courses_ids;

      this.$emit("OpenFinalStatus", { reqId, CourseIds });
    },
    GetCancleReasonOption(key, assigned_id) {
      let option = $("#user_status" + (key + 1)).val();
      if (option == "cancle") {
        let region = this.userTimeSlots[key].cancle_region;
        let action = "view";
        this.$emit("ViewCancleRegion", { region, action, assigned_id });
      }
    },
    GetCancleReason(region, assigned_id) {
      let action = "hide";
      this.$emit("ViewCancleRegion", { region, action, assigned_id });
    },
    traineeModalData(key) {
      let reqId = this.userTimeSlots[key].req_id;
      this.$emit("OpenFollowupModal", reqId);
    },
    editScheduleFunction(trainer_calender_id, index) {
      let booked_value = this.userTimeSlots.filter(
        (x) => x.trainer_calender_id == trainer_calender_id
      );
      let timeslot = new Date(booked_value[0].date_s_time_slot).toLocaleString(
        "en-US",
        {
          timeZone: "Asia/Kolkata",
        }
      );
      timeslot = new Date(timeslot);
      let currentDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      currentDate = new Date(currentDate);

      if (
        currentDate.getTime() > timeslot.getTime() &&
        (booked_value[0].name == null || booked_value[0].name === "")
      ) {
        cvNotify("This slot time elapsed", "warning");
      } else {
        $(".fa-edit").show();
        $("#edit" + index).hide();
        $(".trainer-row-save").hide();
        $("#save" + index).show();
        $(".book-options").attr("disabled", "disabled");

        $(".users-status").attr("disabled", "disabled");
        if (booked_value[0].user_id) {
          $("#user_status" + index).removeAttr("disabled");
          $("#session-feedback-" + index).removeAttr("disabled");
        }
        if (currentDate.getTime() <= timeslot.getTime())
          $("#book_option" + index).removeAttr("disabled");
      }
    },
    saveScheduleTime(trainer_calender_id, index) {
      var booked,
        vm = this;
      vm.processing = true;
      var user_status = $("#user_status" + index).val();
      var book_option = $("#book_option" + index).val();

      var certificateKeyword = $("#session-feedback-" + index).val();

      if (book_option == "blocked") {
        booked = 1;
      } else {
        booked = 0;
      }
      let booked_value = this.userTimeSlots.filter(
        (x) => x.trainer_calender_id == trainer_calender_id
      );
      axios
        .post("/api/liveCourse/updateTrainerschedule", {
          trainer_id: this.userId,
          user_id: booked_value[0].user_id,
          booked: booked,
          trainer_calender_id: booked_value[0].trainer_calender_id,
          user_status: user_status,
          certificate_keyword: certificateKeyword,
        })
        .then((res) => {
          //vm.courses = res.data;
          $(".trainer-row-save").hide();
          $(".fa-edit").show();
          $("#edit" + index).show();
          $(".book-options").attr("disabled", "disabled");
          $(".users-status").attr("disabled", "disabled");
          $("#session-feedback-" + index).attr("disabled", "true");
          let time = $("#filterdate").val();
          let filterCourses = $("#filterCourses").val();
          if (time == 0) {
            this.fileterByDate();
          } else {
            this.filterAccordingSubject();
          }
          vm.processing = false;
        });
    },
    callFunctionForNewTimeSlot: function(e) {
      this.$emit("OpenNewSlotModel", e);
    },
    getBasicDeatils: function(userId) {
      let vm = this;
      this.processing = true;
      axios
        .post("/api/liveCourse/getTrainerallCourses", { user_id: userId })
        .then((res) => {
          vm.courses = res.data;
        });
      axios
        .post("/api/liveCourse/getTrainerClassSlots", { user_id: userId })
        .then((res) => {
          vm.userTimeSlots = res.data;

          vm.processing = false;
        });
      axios.post("/api/liveCourse/getSalesPersonFeedbacks").then((res) => {
        this.feedbacks = res.data;
      });
    },
    filteredByDateData(start_date, end_date) {
      let vm = this;
      this.userTimeSlots = [];
      this.processing = true;
      let course_id = $("#filterCourses").val();
      if (course_id == 0) {
        axios
          .post("/api/liveCourse/getFilerDateWiseTrainerClassSlots", {
            user_id: this.userId,
            start_date: start_date,
            end_date: end_date,
          })
          .then((res) => {
            vm.userTimeSlots = res.data;
            vm.processing = false;
          });
      } else {
        let start_date = document.getElementById("filter_start_date")
          .valueAsDate;
        let end_date = document.getElementById("filter_last_date").valueAsDate;
        axios
          .post("/api/liveCourse/getCourseDateWiseTimeSlot", {
            user_id: this.userId,
            demo_course_id: course_id,
            start_date: start_date,
            end_date: end_date,
          })
          .then((resData) => {
            vm.userTimeSlots = resData.data;
            vm.processing = false;
          });
      }
    },
    filterDateForTrainerTimeSlot() {
      this.processing = true;
      let start_date = document.getElementById("filter_start_date").valueAsDate;
      let end_date = document.getElementById("filter_last_date").valueAsDate;
      this.filterAccordingSubject();
    },
    filterAccordingSubject() {
      let course_id = $("#filterCourses").val();
      var selval = $("#filterdate").val();
      let booked = $("#filterbooked").val();
      this.processing = false;
      this.userTimeSlots = [];
      let vm = this;
      let start_date, end_date;
      if (selval != 0) {
        start_date = document.getElementById("filter_start_date").valueAsDate;
        end_date = document.getElementById("filter_last_date").valueAsDate;
      }
      if (selval != 0 || course_id != 0 || booked != 0) {
        axios
          .post("/api/liveCourse/getCourseWiseTimeSlot", {
            user_id: this.userId,
            demo_course_id: course_id,
            selval: selval,
            booked: booked,
            start_date: start_date,
            end_date: end_date,
          })
          .then((resData) => {
            vm.userTimeSlots = resData.data;

            vm.processing = false;
          });
      } else {
        this.getBasicDeatils(this.userId);
      }
    },
    fileterByDate() {
      this.processing = true;
      let course_id = $("#filterCourses").val();
      var selval = $("#filterdate").val();
      if (selval == 1) {
        $(".add-schedule-button")
          .addClass("col-sm-2")
          .removeClass("col-sm-6");
        document.getElementById("filter_start_date").valueAsDate = new Date();
        document.getElementById("filter_last_date").valueAsDate = new Date();
        let start_date = new Date();
        let end_date = new Date();
        $("#start_date").show();
        $("#last_date").show();

        //  this.filteredByDateData(start_date,end_date);
      } else {
        $(".add-schedule-button")
          .addClass("col-sm-6")
          .removeClass("col-sm-2");
        $("#start_date").hide();
        $("#last_date").hide();
      }

      this.filterAccordingSubject();
    },
  },
  beforeDestroy() {
    showTawk();
  },
};
</script>
<style scoped>
#status-modal select {
  padding: 8px 16px;
}
#status-modal .body {
  padding: 16px 32px;
}
#table-id {
  text-align: center;
}
#table-id th {
  text-transform: uppercase;
  padding: 10px;
}
@media only screen and (max-width: 600px) {
  #table-id {
    width: 100vw !important;
    overflow-x: auto !important;
    padding: 10px 0;
  }
}
</style>
