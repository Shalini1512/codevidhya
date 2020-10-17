<template>
  <div>
    <Header />
    <div class="panel-body tabs-menu-body">
      <div class="tab-content">
        <div class="tab-pane active" id="tab1" style="padding-top:3%;">
          <div class="row p-2 bg-primary d-flex align-items-center">
            <div class="col-sm-1 text-white">
              Courses
              <select
                class="form-control"
                id="filterCourses"
                @change="filterAccordingSubject()"
              >
                <option value="0">All</option>
                <template v-for="(course,index) in courses">
                  <option :key="index" :value="course.course_id">{{course.course_name}}</option>
                </template>
              </select>
            </div>
            <div class="col-sm-1 text-white">
              Trainers
              <select
                class="form-control"
                id="filterTrainer"
                @change="filterAccordingSubject()"
              >
                <option value="0">All</option>
                <template v-for="(trainer,index) in trainerList">
                  <option :key="index" :value="trainer.user_id">{{trainer.name}}</option>
                </template>
              </select>
            </div>
            <div class="col-sm-1 text-white">
              Booked
              <select class="form-control" id="booked" @change="filterAccordingSubject()">
                <option value="0">All</option>
                <option value="booked">Booked/Blocked/Leave</option>
                <option value="not_booked">Not Booked</option>
              </select>
            </div>
            <div class="col-sm-1 text-white">
              Filter Data
              <select class="form-control" id="filterdate" @change="fileterByDate">
                <option value="0">All</option>
                <option value="1">Filter</option>
              </select>
            </div>
            <div class="col-sm-2 text-white" id="start_date" style="display:none">
              Start Date
              <input
                class="form-control"
                id="filter_start_date"
                type="date"
                @change="filterDateForTrainerTimeSlot()"
              />
            </div>
            <div class="col-sm-2 text-white" id="last_date" style="display:none">
              Last Date
              <input
                class="form-control"
                id="filter_last_date"
                type="date"
                @change="filterDateForTrainerTimeSlot()"
              />
            </div>
            <div class="col-sm-2 text-right add-schedule-button">
              <!-- <button
                class="btn btn-white"
                @click="callFunctionForNewTimeSlot($event)"
              >Booked/leave Calender</button>-->
            </div>
          </div>
          <!--table-->
          <div class="row mt-4" v-if="userTimeSlots&&userTimeSlots.length">
            <div class="col-sm-12">
              <div class="table-responsive">
                <table class="table card-table table-vcenter text-nowrap" style="overflow:auto">
                  <thead class="bg-secondary text-white">
                    <tr>
                      <th class="text-white">Sr. No.</th>
                      <th class="text-white">Trainer Name</th>
                      <th class="text-white">Date</th>
                      <th class="text-white">Time Slot</th>
                      <th class="text-white">Duration</th>
                      <th class="text-white">Course</th>
                      <th class="text-white">Booked For</th>
                      <th class="text-white">Booked/Not Booked</th>
                      <th class="text-white">Session Status</th>
                      <th class="text-white">Feedback/Certificate</th>
                      <td class="text-white">Action</td>
                    </tr>
                  </thead>

                  <tbody>
                    <template v-for="(userTimeSlot,index) in userTimeSlots">
                      <tr :key="index">
                        <th>{{+index+1}}</th>
                        <th>{{userTimeSlot.trainer_name}}</th>
                        <td>{{$moment(userTimeSlot.date_s_time_slot).format("dddd,MMMM Do YYYY")}}</td>
                        <td>{{$moment(userTimeSlot.date_s_time_slot).format("hh:mm A")}}-{{$moment(userTimeSlot.date_e_time_slot).format("hh:mm A")}}</td>
                        <td>{{userTimeSlot.duration?userTimeSlot.duration:"0"}} Minutes</td>
                        <td>{{userTimeSlot.course_name}}</td>
                        <td>{{userTimeSlot.name}}</td>
                        <!--<td>{{userTimeSlot.name?'Booked':'Not Booked'}}</td>-->
                        <td>
                          <select
                            class="form-control book-options"
                            :id="'book_option'+(index+1)"
                            disabled="true"
                          >
                            <option
                              :selected="userTimeSlot.name && userTimeSlot.booked==0? true:false"
                              value="booked"
                              disabled
                            >Booked</option>
                            <option
                              :selected="!userTimeSlot.name && userTimeSlot.booked==1?true:false"
                              value="blocked"
                            >Blocked/Leave</option>
                            <option
                              :selected="!userTimeSlot.name && userTimeSlot.booked==0?true:false"
                              value="not_book"
                            >Not Booked</option>
                          </select>
                        </td>
                        <td class="row">
                          <select
                            class="form-control users-status col-sm-10"
                            :id="'user_status'+(index+1)"
                            disabled="true"
                            @change="GetCancleReasonOption(index,userTimeSlot.assigned_id)"
                          >
                            <option
                              value="not_done"
                              :selected="
                                userTimeSlot &&
                                userTimeSlot.statusss == 'not_done'
                                  ? true
                                  : false
                              "
                              disabled
                            >Not Done</option>
                            <option
                              value="reschedule"
                              :selected="
                                userTimeSlot &&
                                userTimeSlot.statusss == 'reschedule'
                                  ? true
                                  : false
                              "
                              disabled
                            >Reschedule</option>
                            <option
                              value="done"
                              :selected="userTimeSlot && userTimeSlot.statusss == 'done'? true: false"
                            >Done</option>
                            <option
                              value="cancle"
                              :selected="
                                userTimeSlot &&
                                userTimeSlot.statusss == 'cancle'
                                  ? true
                                  : false"
                            >Cancle</option>
                          </select>
                          <i
                            v-if="userTimeSlot && userTimeSlot.statusss == 'cancle'"
                            class="fa fa-info-circle text-info mt-3"
                            :id="'cancleRegion'+(index+1)"
                            style="cursor:pointer"
                            @click="GetCancleReason(userTimeSlot.cancle_region,userTimeSlot.assigned_id)"
                          ></i>
                          <i
                            v-if="userTimeSlot && userTimeSlot.statusss == 'done'"
                            class="fa fa-info-circle text-info mt-3"
                            :id="'SoldRegion'+(index+1)"
                            style="cursor:pointer"
                            @click="feedbackMethod(index)"
                          ></i>
                        </td>
                        <td>
                          <select
                            :id="'session-feedback-' + (index + 1)"
                            class="certificate-keyword-select form-control flex-grow-1"
                            disabled="true"
                          >
                            <option value="Zeal to learn">Zeal to learn</option>
                            <option value="Creativity">Creativity</option>
                            <option value="Enthusiasm">Enthusiasm</option>
                            <option value="Inquisitiveness">Inquisitiveness</option>
                          </select>
                        </td>
                        <td>
                          <i
                            class="fas fa-edit trainer-row-edit text-success mr-2"
                            :id="'edit'+(index+1)"
                            @click="editScheduleFunction(userTimeSlot.trainer_calender_id,(index+1))"
                          ></i>
                          <i
                            class="fas fa-save trainer-row-save text-success mr-2"
                            :id="'save'+(index+1)"
                            @click="saveScheduleTime(userTimeSlot.trainer_calender_id,(index+1))"
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
          </div>
          <div v-else>
            <div class="text-center col-xl-12 m-6 text-gray">No Slot Available Yet!</div>
          </div>

          <!--end table-->
        </div>
      </div>
    </div>
    <Loader v-if="processing" />

    <!--View Cancle Region-->
    <div id="CancleRegion" class="cv-modal large">
      <div
        style="display: flex; flex-direction: column; max-width:3000px; width:60%; height:60%; overflow:auto;"
      >
        <div class="row m-0 p-2 bg-secondary text-white">
          <div class="active d-inline-block">
            <h3>Cancle Region</h3>
          </div>
          <i class="flex-fill"></i>
          <span class="d-inline-block mr-4" onclick="hideModal('CancleRegion')">
            <i class="fas fa-times"></i>
          </span>
        </div>
        <div class="text-center p-4 mt-4">
          <div class="form-group mt-4">
            <textarea
              class="content2 form-control feedbacks-descs"
              id="cancle-session-region"
              name="example"
              rows="6"
              placeholder="Detail descriptions..."
            ></textarea>
          </div>
          <div class="form-footer col-xl-12 text-center mt-4 pl-4">
            <center>
              <button
                type="button"
                class="feedbackSubmits btn btn-secondary"
                :id="'cancle-region-button'"
                @click="SubmitCancleRegion"
              >Submit</button>
            </center>
          </div>
        </div>
      </div>
    </div>
    <!-- End View Cancle Region-->
    <!--feddback test-->
    <div id="feedbackTest" class="cv-modal large">
      <div
        style="display: flex; flex-direction: column; max-width:3000px; width:60%; height:60%; overflow:auto;"
      >
        <div class="row m-0 p-2 bg-secondary text-white">
          <div class="active d-inline-block">
            <h3>Final Status</h3>
          </div>
          <i class="flex-fill"></i>
          <span class="d-inline-block mr-4" onclick="hideModal('feedbackTest')">
            <i class="fas fa-times"></i>
          </span>
        </div>
        <!--container-->
        <template v-for="(data, index) in userTimeSlotsFeedback">
          <div class="text-center p-4" :key="index">
            <div class="form-group">
              <select
                class="form-control col-sm-10 users-feedbacks"
                :id="'user-feedback'+(index + 1)"
                @click="ViewCoursesEnable(index+1)"
              >
                <option value="0">--Select Option--</option>
                <template v-for="(feedback, key) in feedbacks">
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
                v-if="viewCourses && (suggestedCourseSelection && suggestedCourseSelection.length)"
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
              ></textarea>
            </div>
            <div class="form-footer col-xl-12 text-center mt-2 pl-4">
              <center>
                <button
                  v-if="userTimeSlotsFeedback&&userTimeSlotsFeedback[0].feedback_status_id"
                  type="button"
                  class="feedbackSubmits btn btn-secondary"
                  :id="'feedbacksubmit'+(index+1)"
                  @click="submitFeedbackMessage(data.assigned_id,(index+1))"
                  disabled
                >Submit</button>
                <button
                  v-else
                  type="button"
                  class="feedbackSubmits btn btn-secondary"
                  :id="'feedbacksubmit'+(index+1)"
                  @click="submitFeedbackMessage(data.assigned_id,(index+1))"
                >Submit</button>
              </center>
            </div>
          </div>
        </template>
        <!--end container-->
      </div>
    </div>
    <!--end feedback final Result-->
  </div>
</template>
<script>
import moment from "vue-moment";
import Header from "@/components/header/HeaderMenuForAdmin.vue";
import Footer from "@/components/footer/Footer.vue";
import Loader from "@/components/widgets/BlockingLoader.vue";
import axios from "axios";

export default {
  name: "AdminTrainerManagement",
  components: {
    Header,
    Footer,
    Loader
  },
  data() {
    return {
      userId: 0,
      isSignedIn: "",
      sch_id: "",
      courses: [],
      trainerList: [],
      userTimeSlots: [],
      cancleRegionId: "",
      CancleUserId: "",
      viewCourses: "",
      feedbacks:[],
      suggestedCourseSelection:[],
      userTimeSlotsFeedback:[],
      processing: false
    };
  },
  mounted() {
    hideTawk();
    this.getBasicDeatils();
  },

  methods: {
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
          $(".feedbackSubmits").removeAttr("disabled");
          $(".feedbacks-descs").removeAttr("disabled");
          $(".users-feedbacks").removeAttr("disabled");
          this.$refs.trainerscheduletime.filterAccordingSubject();
          hideModal("feedbackTest");
        });
    },
     ViewCoursesEnable(key) {
      let CourseOption = $("#user-feedback" + key).val();
      if (CourseOption == 4) {
        this.viewCourses = 1;
      } else {
        this.viewCourses = 0;
      }
    },
    async feedbackMethod(key) {
      let reqId = this.userTimeSlots[key].req_id;
      let CourseIds = this.userTimeSlots[key].courses_ids;
    this.processing = true;
      let vm = this;
      axios
        .post("/api/liveCourse/getSuggestedCourses", {
          courses_ids: CourseIds
        })
        .then(async res => {
          this.suggestedCourseSelection = res.data;
         
          await axios
            .post("/api/liveCourse/getSalesPersonFeedbacks")
            .then(async res => {
              this.feedbacks = res.data;
              await axios
                .post("/api/liveCourse/getParticularRequestFinalStep", {
                  user_id: vm.userTimeSlots[key].trainer_id,
                  req_id: reqId
                })
                .then(async res => {
                  vm.userTimeSlotsFeedback = res.data;
                  vm.processing = false;
                  if (
                    vm.userTimeSlotsFeedback &&
                    vm.userTimeSlotsFeedback[0].feedback_status
                  ) {
                    if (vm.userTimeSlotsFeedback[0].feedback_status_id == 4) {
                      vm.viewCourses = 1;
                    } else {
                      vm.viewCourses = 0;
                    }
                    await $(".feedbackSubmits").attr("disabled", "disabled");
                    await $(".feedbacks-descs").attr("disabled", "disabled");
                    await $(".users-feedbacks").attr("disabled", "disabled");

                    showModal("feedbackTest");
                  } else {
                    $(".feedbackSubmits").removeAttr("disabled");
                    $(".feedbacks-descs").removeAttr("disabled");
                    $(".users-feedbacks").removeAttr("disabled");

                    showModal("feedbackTest");
                  }
                });
            });
        });
    },
    GetCancleReasonOption(key, assigned_id) {
      let option = $("#user_status" + (key + 1)).val();
      $("#cancleRegion" + (key + 1)).show();
      $("#SoldRegion" + (key + 1)).show();
      if (option == "cancle") {
        $("#cancleRegion").show();
        this.cancleRegionId = this.userTimeSlots[key].assigned_id;
        this.CancleUserId = this.userTimeSlots[key].trainer_id;
        let detail = this.userTimeSlots[key].cancle_region;
        $("#cancle-session-region").val(detail);
        $("#cancle-session-region").removeAttr("disabled");
        $("#cancle-region-button").removeAttr("disabled");

        showModal("CancleRegion");
      } else if (option == "done") {
        $("#SoldRegion" + (key + 1)).show();
      }
    },
    GetCancleReason(region, assigned_id) {
      $("#cancle-session-region").val(region);
      $("#cancle-session-region").attr("disabled", "disabled");
      $("#cancle-region-button").attr("disabled", "disabled");
      showModal("CancleRegion");
    },
    SubmitCancleRegion() {
      let regionDetail = $("#cancle-session-region").val();
      axios
        .post("/api/liveCourse/postCancleRegion", {
          assigned_id: this.cancleRegionId,
          detail: regionDetail,
          user_id: this.CancleUserId
        })
        .then(res => {
          cvNotify("Successfully Updated");
          $(".feedbackSubmits").removeAttr("disabled");
          $(".feedbacks-descs").removeAttr("disabled");
          $(".users-feedbacks").removeAttr("disabled");
          this.filterAccordingSubject();
          hideModal("CancleRegion");
        });
    },
    editScheduleFunction(trainer_calender_id, index) {
      let booked_value = this.userTimeSlots.filter(
        x => x.trainer_calender_id == trainer_calender_id
      );
      let timeslot = new Date(booked_value[0].date_s_time_slot).toLocaleString(
        "en-US",
        {
          timeZone: "Asia/Kolkata"
        }
      );
      timeslot = new Date(timeslot);
      let currentDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata"
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

      var user_status = $("#user_status" + index).val();
      var book_option = $("#book_option" + index).val();
      var certificateKeyword = $("#session-feedback-" + index).val();
      if (book_option == "blocked") {
        booked = 1;
      } else {
        booked = 0;
      }
      let booked_value = this.userTimeSlots.filter(
        x => x.trainer_calender_id == trainer_calender_id
      );
      axios
        .post("/api/liveCourse/updateTrainerschedule", {
          trainer_id: booked_value[0].trainer_id,
          user_id: booked_value[0].user_id,
          booked: booked,
          trainer_calender_id: booked_value[0].trainer_calender_id,
          user_status: user_status,
          certificate_keyword: certificateKeyword
        })
        .then(res => {
          vm.courses = res.data;
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
      axios.post("/api/liveCourse/getAllTrainerCourses").then(res => {
        vm.courses = res.data;
      });
      axios.post("/api/liveCourse/getAllTrainerList").then(res => {
        vm.trainerList = res.data;
        axios
          .post("/api/liveCourse/getAllTrainerClassSlots")
          .then(async res => {
            let userTimeSlots = res.data;

            let vmuserTimeSlots = [];
            userTimeSlots.forEach(async (items, index) => {
              if (items.length) {
                await items.forEach(async (item, index) => {
                  vm.userTimeSlots.push(item);
                });
              }
            });

            vm.processing = false;
          });
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
            end_date: end_date
          })
          .then(res => {
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
            end_date: end_date
          })
          .then(resData => {
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
      var trainer_id = $("#filterTrainer").val();
      var booked = $("#booked").val();
      this.processing = false;
      this.userTimeSlots = [];
      let vm = this;

      if (selval != 0 || course_id != 0 || trainer_id != 0 || booked != 0) {
        let start_date, end_date, name;
        if (selval != 0) {
          start_date = document.getElementById("filter_start_date").valueAsDate;
          end_date = document.getElementById("filter_last_date").valueAsDate;
        } else {
          start_date = "";
          end_date = "";
        }
        if (trainer_id != 0) {
          name = $("#filterTrainer option:selected").text();
        }

        axios
          .post("/api/liveCourse/getCourseAllWiseTimeSlot", {
            user_id: trainer_id,
            name: name,
            demo_course_id: course_id,
            selval: selval,
            booked: booked,
            start_date: start_date,
            end_date: end_date
          })
          .then(res => {
            let userTimeSlots = res.data;
            if (trainer_id != 0) {
              vm.userTimeSlots = userTimeSlots;
            } else {
              let vmuserTimeSlots = [];
              userTimeSlots.forEach(async (items, index) => {
                if (items.length) {
                  await items.forEach(async (item, index) => {
                    vm.userTimeSlots.push(item);
                  });
                }
              });
            }

            vm.processing = false;
          });
      } else {
        this.getBasicDeatils();
      }
    },
    fileterByDate() {
      this.processing = true;
      let course_id = $("#filterCourses").val();
      var selval = $("#filterdate").val();
      if (selval == 1) {
        $(".add-schedule-button")
          .addClass("col-sm-4")
          .removeClass("col-sm-8");
        document.getElementById("filter_start_date").valueAsDate = new Date();
        document.getElementById("filter_last_date").valueAsDate = new Date();
        let start_date = new Date();
        let end_date = new Date();
        $("#start_date").show();
        $("#last_date").show();

        // this.filteredByDateData(start_date,end_date);
      } else {
        $(".add-schedule-button")
          .addClass("col-sm-8")
          .removeClass("col-sm-4");
        $("#start_date").hide();
        $("#last_date").hide();
      }
      this.filterAccordingSubject();
    }
  },
  updated() {},
  beforeDestroy() {
    showTawk();
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

#trainers {
  background-color: #fff;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

#trainers:hover,
#trainers:focus {
  background-color: #fff;
}
#serach-trainer {
  box-sizing: border-box;
  border-bottom: 1px solid #ddd;
}
#search-trainer:focus {
  outline: 3px slid #ddd;
}

#trainer_names {
  background-color: #f6f6f6;
  overflow: auto;
  border: 1px solid #ddd;
  z-index: 1;
}

#trainer_names span {
  color: #000;
  padding: 8px 8px;
  text-decoration: none;
  display: block;
  cursor: pointer;
}
#trainers > span :hover {
  background: #ccc;
}
#expected-users {
  height: 100px;
  overflow: auto;
}
#expected-users span {
  color: #000;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}
#expected-users span:hover {
  background-color: #ddd;
}
</style>