<template>
  <div>
    <Header />
    <div id="sales-followup-container">
      <div id="sales-followup-inner" v-if="(schedularManagement&&schedularManagement.length)">
        <div class="cv-card mb-1">
          <form class="form-inline ml-2">
            <i class="fas fa-search" aria-hidden="true"></i>
            <input
              class="form-control form-control-sm ml-3 w-75"
              type="text"
              placeholder="Search By Student Name"
              aria-label="Search"
              @input="handleSearchChange"
              v-model="searchWord"
            />
          </form>
        </div>
        <table class="cv-card table">
          <thead>
            <tr id="sale-item-1" @click="toggleSaleItemClicked">
              <th>Sr. no.</th>
              <th>Student Name</th>
              <th>Course Module</th>
              <th>Schedule/UnSchedule</th>
              <th>Schedule Date</th>
              <th>Notification Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <template v-for="(data,index) in filteredSchedulerManagementData">
            <tbody :key="index">
              <tr :id="'row'+(index+1)" class="toggle" @click="toggleSaleItemClicked">
                <td>{{index+1}}</td>
                <td>
                  {{data.kids_name?data.kids_name:'-'}}
                  <span>
                    <i class="fas fa-info-circle student-info-btn" @click="traineeModalData(index)"></i>
                  </span>
                </td>
                <td>{{data.theme?data.theme:'-'}}</td>
                <td>{{data.Scedule=='Scheduled'?'Schedule':'Unschedule'}}</td>
                <td>{{data.expected_schedule_date1?data.expected_schedule_date1:'-'}}</td>
                <td>{{data.request_at?$moment(data.expected_schedule_date).isSame($moment(), 'day')?$moment(data.request_at).format('hh:mm A'):$moment(data.request_at).format('DD MMM'):''}}</td>
                <td>
                  <button
                    v-if="data.Scedule!='Scheduled'"
                    class="btn btn-pill btn-primary"
                    @click="scheduleClass(index)"
                  >Schedule</button>
                </td>
              </tr>
              <tr
                class="sale-item-1-info CollapseDiv"
                :id="'row'+(index+1)+'-followup'"
                style="display:none;"
              >
                <td colspan="7">
                  <div class="row" style="float:right">
                    <button class="btn btn-link pb-4" @click="followupModal(index)">New Feedback</button>
                  </div>
                  <template v-for="(followupdetail,index1) in followupdetails">
                    <div
                      class="media mt-0 p-5"
                      :key="index1"
                      v-if="followupdetail.req_id ==filteredSchedulerManagementData[index].req_id"
                    >
                      <div class="d-flex mr-3">
                        <a href="#">
                          <img
                            class="media-object brround"
                            alt="64x64"
                            src="/assets/images/users/user.svg"
                          />
                        </a>
                      </div>
                      <div class="media-body">
                        <h4 class="mt-0 mb-1 font-weight-bold">{{followupdetail.sales_person_name}}</h4>
                        <small class="text-muted">
                          <i class="fa fa-calendar"></i>
                          {{$moment(followupdetail.followup_time).format('LLLL')}}
                          <i
                            class="ml-3 fa fa-book"
                          ></i>
                          {{followupdetail.theme}}
                        </small>
                        <h3>{{followupdetail.status}}</h3>
                        <p class="font-13 mb-2 mt-2">{{followupdetail.remark}}</p>
                      </div>
                    </div>
                  </template>
                </td>
              </tr>
            </tbody>
          </template>
        </table>
      </div>
      <div v-else>
        <div class="text-center col-xl-12 m-6 text-gray">No Sales Lead Yet!</div>
      </div>


    </div>
    <!--followup mail-->
    <!-- Large Modal -->
    <div :id="'AnswerModal'" class="modal fade">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header pd-x-20">
            <h3 class="modal-title">Follow up</h3>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body pd-20">
            <div class="card mb-lg-0">
              <div class="card-body">
                <div>
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control"
                      :id="'ans_topic'"
                      placeholder="Student Name"
                    />
                  </div>
                  <div class="form-group">
                    <input type="text" class="form-control" :id="'ans_title'" placeholder="Status" />
                  </div>
                  <div class="form-group">
                    <textarea
                      class="content2 form-control"
                      :id="'ans_desc'"
                      name="example"
                      rows="6"
                      placeholder="Description"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- modal-body -->
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="postFollowupData()">Post</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <!-- modal-dialog -->
    <!--end followup mail-->

    <!--user information-->
    <div id="demo-trainee-information" class="cv-modal large">
      <div>
        <h3
          class="text-center mt-3"
          id="trail-course-name"
        >{{filteredSchedulerManagementData.length?filteredSchedulerManagementData[SelectedKey].kids_name:''}}</h3>
        <div class="course-details">
          <div class="col-sm-12 mx-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Parent Name:</label>
            <span
              style="margin-left:3%;"
            >{{filteredSchedulerManagementData.length?filteredSchedulerManagementData[SelectedKey].parent_name:''}}</span>
          </div>
          <div class="col-sm-12 mx-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Parent Email:</label>
            <span
              style="margin-left:3%;"
            >{{filteredSchedulerManagementData.length?filteredSchedulerManagementData[SelectedKey].parent_email:''}}</span>
          </div>
          <div class="col-sm-12 mx-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Parent Contact:</label>
            <span
              style="margin-left:3%;"
            >{{filteredSchedulerManagementData.length?filteredSchedulerManagementData[SelectedKey].parent_contact:''}}</span>
          </div>
          <div class="col-sm-12 mx-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Country:</label>
            <span
              style="margin-left:3%;"
            >{{filteredSchedulerManagementData.length?filteredSchedulerManagementData[SelectedKey].country:''}}</span>
          </div>
          <div class="col-sm-12 mx-4">
            <label style="font-weight:bold;font-display: 'Poppins';">State:</label>
            <span
              style="margin-left:3%;"
            >{{filteredSchedulerManagementData.length?filteredSchedulerManagementData[SelectedKey].state:''}}</span>
          </div>
          <div class="col-sm-12 mx-4">
            <label style="font-weight:bold;font-display: 'Poppins';">City:</label>
            <span
              style="margin-left:3%;"
            >{{filteredSchedulerManagementData.length?filteredSchedulerManagementData[SelectedKey].city:''}}</span>
          </div>
          <div class="col-sm-12 mx-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Course Module:</label>
            <span
              style="margin-left:3%;"
            >{{filteredSchedulerManagementData.length?filteredSchedulerManagementData[SelectedKey].theme:''}}</span>
          </div>
        </div>
        <div class="text-center my-4">
          <button class="btn btn-primary" @click="handleCloseLearnAtHomeClicked">Close</button>
        </div>
      </div>
    </div>
    <!--Feedback Modal -->

    <!--end user information-->
    <Loader v-if="processing" />
  </div>
</template>
<script>
import moment from "vue-moment";
//import Header from "@/components/header/HeaderMenuOnly.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import Footer from "@/components/footer/Footer.vue";
import Loader from "@/components/widgets/BlockingLoader.vue";
import axios from "axios";
export default {
  components: { Header, Footer, Loader },
  data() {
    return {
      userId: 0,
      schedularManagement: [],
      SelectedKey: 0,
      followupdetails: [],
      searchWord: "",
      filteredSchedulerManagementData: [],
      processing: false
    };
  },
  mounted() {
    hideTawk();
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.getSalesScheduleClasses();
        }
      }.bind(this)
    );
  },
  methods: {
    handleSearchChange() {
      var vm = this;

      if (!this.searchWord) {
        this.filteredSchedulerManagementData = this.schedularManagement;
        return;
      }

      this.filteredSchedulerManagementData = this.schedularManagement.filter(
        item => {
          return item.kids_name.includes(vm.searchWord);
        }
      );
    },

    scheduleClass(key) {
      this.$router.push({
        name: "RegisterForTrialClassSales",
        params: { RegisterData: this.schedularManagement[key] }
      });
    },
    handleCloseLearnAtHomeClicked() {
      hideModal("demo-trainee-information");
    },
    followupModal(key) {
      this.SelectedKey = key;
      $("#ans_topic").val(
        this.filteredSchedulerManagementData.length
          ? this.filteredSchedulerManagementData[this.SelectedKey].kids_name
          : ""
      );
      $("#AnswerModal").modal();
    },

    feedbackMethod(key) {
      $("#Feedback" + (key + 1)).modal("show");
    },
    submitFeedbackMessage(assigned_id, key) {
      let feedbackDes = $("#feed_desc" + key).val();
      let feedbackStatus = $("#user-feedback" + key).val();
      axios
        .post("/api/liveCourse/saveMyTraineeFeedback", {
          assigned_id: assigned_id,
          feed_desc: feedbackDes,
          feedbackStatus: feedbackStatus
        })
        .then(async res => {
          cvNotify("Successfully Updated");

          $("#Feedback" + key).modal("hide");
          await this.saveScheduleTime(key + 1);
          await this.getSalesScheduleClasses();
        });
    },

    postFollowupData() {
      let status = $("#ans_title").val();
      let detail = $("#ans_desc").val();
      let reqId = this.filteredSchedulerManagementData[this.SelectedKey].req_id;
      axios
        .post("/api/liveCourse/sentFollowupdetail", {
          user_id: this.userId,
          req_id: reqId,
          status: status,
          desc: detail
        })
        .then(res => {
          this.getSalesScheduleClasses();
          $("#AnswerModal").modal("hide");
        });
    },

    handleCloseRescheduleClicked() {
      hideModal("demo-trainee-reschedule");
    },
    traineeModalData(key) {
      this.SelectedKey = key;
      showModal("demo-trainee-information");
      //
    },
    getSalesScheduleClasses() {
      let vm = this;
      // vm.processing =true;
      axios
        .post("/api/liveCourse/getAllUnscheduleSalesLead", {
          user_id: this.userId
        })
        .then(res => {
          vm.schedularManagement = res.data;
          //vm.filteredSchedulerManagementData = vm.schedularManagement;
          vm.processing = false;
          axios
            .post("/api/liveCourse/getFollowupDetails", {
              user_id: this.userId
            })
            .then(res => {
              vm.followupdetails = res.data;
              this.handleSearchChange();
            });
        });
    },
    toggleSaleItemClicked(e) {
      var id = e.currentTarget.id;
      $("#CollapseDiv").hide();
      if ($("#" + id + "-followup").is(":visible"))
        $("#" + id + "-followup").hide();
      else $("#" + id + "-followup").show();
    }
  },
  updated() {},
  beforeDestroy() {
    showTawk();
  }
};
</script>

<style lang="scss">
#sales-followup-container {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  align-items: stretch;
  min-height: 0;
  padding-top: 59px;

  #sales-followup-inner {
    position: absolute;
    top: 59px;
    bottom: 0;
    width: 100%;
    padding: 16px;
    overflow: auto;
    tr {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    th {
      font-weight: bold;
    }
    td,
    th {
      padding: 16px;
    }

    tr.toggle {
      cursor: pointer;
      transition: all 200ms;
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }

  .student-info-btn {
    cursor: pointer;
  }

  #student-info-modal {
    .body {
      padding: 16px;
    }
    .student-info-row {
      display: flex;
      flex-direction: row;
      padding-bottom: 8px;
      p:first-of-type {
        min-width: 240px;
        font-weight: bold;
      }
    }
  }
}
</style>
