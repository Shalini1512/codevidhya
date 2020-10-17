<template>
  <div>
    <Header />
    <div class="panel-body tabs-menu-body">
      <div class="tab-content">
        <div class="tab-pane active" id="tab1" style="padding-top:3%;">
          <div class="row p-2 bg-primary d-flex align-items-center">
            <div class="col-sm-2 text-white">
              Sales member
              <select
                class="form-control"
                id="filterSales"
                @change="filterAccordingSubject()"
              >
                <option value="0">All</option>
                <template v-for="(salesperson, index) in salesPersons">
                  <option :key="index" :value="salesperson.user_id">{{salesperson.name}}</option>
                </template>
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
                @change="filterAccordingSubject()"
              />
            </div>
            <div class="col-sm-2 text-white" id="last_date" style="display:none">
              Last Date
              <input
                class="form-control"
                id="filter_last_date"
                type="date"
                @change="filterAccordingSubject()"
              />
            </div>
            <div class="col-sm-5 text-right add-schedule-button">
              <button class="btn btn-round text-white" @click="export_data()">
                <u>Export As Excel</u>
                <downloadExcel
                  ref="reportDownload"
                  id="click_export"
                  :data="dataForExcel"
                  :before-generate="startDownload"
                  :before-finish="finishDownload"
                  style="display:none;"
                  :name="'Trial Course Sales Report'"
                ></downloadExcel>
              </button>
            </div>
          </div>
          <!--table-->
          <div class="row mt-4" v-if="schedularManagement&&schedularManagement.length">
            <div class="col-sm-12">
              <div class="table-responsive">
                <table class="table card-table table-vcenter text-nowrap" style="overflow:auto">
                  <thead class="bg-secondary text-white">
                    <tr>
                      <th class="text-white">Sr. No.</th>
                      <th class="text-white">Sales Person Name</th>
                      <th class="text-white">Date</th>
                      <th class="text-white">Time Slot</th>
                      <!--<th class="text-white">Duration</th>-->
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
                      <td>{{data.sales_name}}</td>
                      <td>{{data.schedule_date}}</td>
                      <td>{{data.schedule_s_time}}-{{data.schedule_e_time}}</td>
                      <!--<td>{{data.duration}} Minutes</td>-->
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
            </div>
          </div>
          <div v-else>
            <div class="text-center col-xl-12 m-6 text-gray">No Slot Available Yet!</div>
          </div>

          <!--end table-->
        </div>
      </div>
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
            <span
              style="margin-left:3%;"
            >{{schedularManagement.length?schedularManagement[SelectedKey].schedule_date:''}}</span>
          </div>
          <div class="col-sm-12 mx-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Session Time:</label>
            <span
              style="margin-left:3%;"
            >{{ schedularManagement.length?schedularManagement[SelectedKey].schedule_s_time:''}}-{{ schedularManagement.length?schedularManagement[SelectedKey].schedule_e_time:''}}</span>
          </div>
        </div>
        <div class="text-center my-4">
          <button class="btn btn-primary" @click="handleCloseLearnAtHomeClicked">Close</button>
        </div>
      </div>
    </div>
    <!--Feedback Modal -->
    <!-- Large Modal -->
    <template v-for="( data, index ) in schedularManagement">
      <div :id="'Feedback'+ ( index + 1)" class="modal fade" :key="index">
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
                        v-if="data.feedback_status_id ==4"
                        disabled
                      >
                        <option value="0" disabled>--Select Option--</option>
                        <template v-for="(suggestCourse,key2) in suggestedCourseSelection">
                          <option
                            style="color:#000;"
                            :key="key2"
                            :value="suggestCourse.product_id"
                            :selected="suggestCourse.product_id == data.sale_product_id ? true : false"
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

    <!--end demo course modal-->
    <Loader v-if="processing" />
  </div>
</template>
<script>
import moment from "vue-moment";
import Header from "@/components/header/HeaderMenuForAdmin.vue";
import Footer from "@/components/footer/Footer.vue";
import Loader from "@/components/widgets/BlockingLoader.vue";
import axios from "axios";
import JsonExcel from "vue-json-excel";

export default {
  name: "AdminTrainerManagement",
  components: {
    Header,
    Footer,
    downloadExcel: JsonExcel,
    Loader
  },
  data() {
    return {
      userId: 0,
      schedularManagement: [],
      SelectedKey: 0,
      rescheduledate: new Date().toISOString().slice(0, 10),
      rescheduleTime: "",
      trainersList: [],
      availableTimeSlots: [],
      selectTimeSlot: -1,
      feedbacks: [],
      salesPersons: [],
      dataForExcel: [],
      processing: false,
      trainerSuggestion: [],
      SuggestedCouses: [],
      Skills: [],
      viewCourses: 0,

      suggestedCourseSelection: []
    };
  },
  mounted() {
    hideTawk();
    this.getSalesScheduleClasses();
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
          // await this.saveScheduleTime(key);
        });
    },
    startDownload() {
      this.processing = true;
    },
    finishDownload() {
      this.processing = false;
    },
    export_data() {
      let vm = this;
      this.schedularManagement.forEach(async (data, index) => {
        if (index == 0) {
          vm.dataForExcel = [];
        }

        vm.dataForExcel.push({
          "Sr No": index + 1,
          "Sales Person Name": data.sales_name,
          Date: data.schedule_date,
          "Time Slot": data.schedule_s_time + "-" + data.schedule_e_time,
          "Course Module": data.theme,
          "Session Status":
            data.statusss == "done"
              ? "Done"
              : data.statusss == "not_done"
              ? "Not:done"
              : "Reschedule",
          "Student Name": data.trainee_name,
          "Trainer Name": data.trainer_name,
          "Feedback Status": data.feedback_status ? data.feedback_status : "_",
          "Feedback Description": data.feedback_message,
          "Parent Name": data.parent_name,
          "Parent Email": data.parent_email,
          "Parent Contact": data.parent_contact
        });
      });
      this.$refs.reportDownload.generate();
    },
    fileterByDate() {
      this.processing = true;
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
    },
    filterDateForTrainerTimeSlot() {},
    filterAccordingSubject() {
      let selval = $("#filterdate").val();
      let salesperson_id = $("#filterSales").val();
      let vm = this,
        start_date,
        end_date;
      this.processing = true;
      this.schedularManagement = [];
      if (salesperson_id != 0 || selval != 0) {
        if (selval != 0) {
          start_date = document.getElementById("filter_start_date").valueAsDate;
          end_date = document.getElementById("filter_last_date").valueAsDate;
        } else {
          start_date = "";
          end_date = "";
        }

        let name = $("#filterSales option:selected").text();

        axios
          .post("/api/liveCourse/getAllSalesPersonFilterData", {
            user_id: salesperson_id,
            name: name,
            selval: selval,
            start_date: start_date,
            end_date: end_date
          })
          .then(res => {
            if (salesperson_id != 0) {
              vm.schedularManagement = res.data;
            } else {
              let schedularManagement = res.data;
              let vmschedularManagement = [];
              schedularManagement.forEach(async (items, index) => {
                if (items.length) {
                  await items.forEach(async (item, index) => {
                    vm.schedularManagement.push(item);
                  });
                }
              });
            }
            vm.processing = false;
          });
      } else {
        this.getSalesScheduleClasses();
      }
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
        $("#user-feedback" + key).removeAttr("disabled");
        //$("#user-products" + key).removeAttr("disabled");
        //$("#feed_desc" + key).removeAttr("disabled");
        //$("#Feedback" + key).modal("show");
        //$("#feedbacksubmit" + key).removeAttr("disabled");
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
      let vm = this;
      vm.processing = true;
      axios.post("/api/liveCourse/getAllSalesMembers").then(res => {
        this.salesPersons = res.data;
      });
      axios.post("/api/liveCourse/getAllTrialDataForSales").then(res => {
        let schedularManagement = res.data;
        let vmschedularManagement = [];
        schedularManagement.forEach(async (items, index) => {
          if (items.length) {
            await items.forEach(async (item, index) => {
              vm.schedularManagement.push(item);
            });
          }
        });
        vm.processing = false;
      });

      axios.post("/api/liveCourse/getSalesPersonFeedbacks").then(res => {
        this.feedbacks = res.data;
      });
    }
  },
  updated() {},
  beforeDestroy() {
    showTawk();
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