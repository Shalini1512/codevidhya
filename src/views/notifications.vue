<template>
  <div id="notifications-root">
    <Header>
      <section>
        <div class="sptb-4 sptb-tab" style="padding-bottom: 2rem;">
          <div class="header-text mb-0">
            <div class="container">
              <div class="row align-items-center">
                <div
                  class="col-md-6"
                  style="display: flex; flex-direction: column; justify-content: center"
                >
                  <div class="text-left text-white">
                    <h1>Notifications</h1>
                    <p>All the notifications are here.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- /header-text -->
        </div>
      </section>
    </Header>
    <!--User Dashboard-->
    <section class="sptb">
      <div class="container-fluid">
        <div class="row">
          <!--side nav bar-->
          <sideNav></sideNav>
          <!-- end side nav-->

          <div class="col-xl-9 col-lg-12 col-md-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Notifications</h3>
              </div>
              <div class="card-body">
                <div class="settings-tab">
                  <ul class="tabs-menu nav">
                    <li class="">
                      <a href="#tab1" class="active" data-toggle="tab"
                        ><i class="fa fa-pencil"></i> Send a notification</a
                      >
                    </li>
                    <li>
                      <a href="#tab2" data-toggle="tab" class=""
                        ><i class="fe fe-inbox"></i> Received</a
                      >
                    </li>
                    <!--<li>
                      <a href="#tab3" data-toggle="tab" class=""
                        ><i class="fe fe-send"></i> Sent</a
                      >
                    </li>-->
                  </ul>
                  <div class="tab-content">
                    <div class="tab-pane active show" id="tab1">
                      <form class="form-horizontal">
                        <!--<div class="form-group">
                          <div class="row">
                            <div class="col-sm-2 col-md-2">
                              <div class="form-label">Send as</div>
                            </div>
                            <div class="col-sm-2 col-md-2">
                              <label class="custom-control custom-radio">
                                <input
                                  type="radio"
                                  class="custom-control-input"
                                  name="example-radios"
                                  value="option1"
                                  checked
                                />
                                <span class="custom-control-label"
                                  >Notification</span
                                >
                              </label>
                            </div>
                            <div class="col-sm-2 col-md-2">
                              <label class="custom-control custom-radio">
                                <input
                                  type="radio"
                                  class="custom-control-input"
                                  name="example-radios"
                                  value="option2"
                                />
                                <span class="custom-control-label">Email</span>
                              </label>
                            </div>
                            <div class="col-sm-2 col-md-2">
                              <label class="custom-control custom-radio">
                                <input
                                  type="radio"
                                  class="custom-control-input"
                                  name="example-radios"
                                  value="option3"
                                />
                                <span class="custom-control-label">Both</span>
                              </label>
                            </div>
                          </div>
                        </div>-->
                        <div class="form-group">
                          <div class="row">
                            <div class="col-sm-2 col-md-2">
                              <label class="form-label">To</label>
                            </div>
                            <div class="col-sm-9 col-md-9">
                              <!--<input
                                type="email"
                                class="form-control"
                                id="email"
                                placeholder="Enter students' email address"
                              />
                              <div class="p-2 border ">
                                <span
                                  class="badge badge-pill bg-secondary text-white mr-1"
                                  >Rajesh</span
                                >
                              </div>-->
                              <div class="border">
                                <template
                                  v-for="(grade, index) in selectedGrades"
                                >
                                  <span
                                    :key="index"
                                    class="badge badge-pill bg-secondary text-white mr-1 mt-1 p-2"
                                    >Grade
                                    {{ grade.cls_name }}
                                    section
                                    {{ grade.sec_name }}

                                    <i
                                      class="fas fa-times text-primary ml-1"
                                      style="cursor:pointer"
                                      title="Remove"
                                      @click="removeGrade(grade, index)"
                                    ></i>
                                  </span>
                                </template>
                                <span
                                  v-if="selectedGrades.length"
                                  class="badge badge-pill badge-secondary ml-1 py-2 px-3"
                                  onclick="showModal('showStudentContactModal')"
                                  style="cursor:pointer"
                                  ><i
                                    class="fas fa-plus fa-sm "
                                    style="cursor:pointer"
                                    title="Add"
                                  ></i
                                ></span>
                                <span
                                  v-if="!selectedGrades.length"
                                  style="color:grey;"
                                  ><h5>
                                    Select Grades and sections.

                                    <span
                                      class="badge badge-pill badge-secondary"
                                      onclick="showModal('showStudentContactModal')"
                                      style="cursor:pointer"
                                      ><i
                                        class="fas fa-plus fa-sm"
                                        style="cursor:pointer"
                                        title="Add"
                                      ></i
                                    ></span></h5
                                ></span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="form-group">
                          <div class="row">
                            <div class="col-sm-2 col-md-2">
                              <label class="form-label">Title</label>
                            </div>
                            <div class="col-sm-4 col-md-4">
                              <input
                                type="text"
                                class="form-control"
                                id="email"
                                placeholder="Enter title here"
                                v-model="notification[0].title"
                              />
                            </div>
                            <div class="col-sm-2 col-md-2">
                              <label class="form-label">Message Type</label>
                            </div>
                            <div class="col-sm-3 col-md-3">
                              <select
                                class="form-control"
                                v-model="notification[0].type"
                              >
                                <option value="0">Select message type</option>
                                <option value="danger">Alert</option>
                                <option value="info">Information</option>
                                <option value="warning">Warning</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="form-group">
                          <div class="row">
                            <div class="col-sm-2 col-md-2">
                              <label class="form-label">Message</label>
                            </div>
                            <div class="col-sm-10 col-md-10">
                              <textarea
                                class="form-control"
                                name="message-textarea-input"
                                rows="4"
                                placeholder="Type your message here.."
                                v-model="notification[0].message"
                              ></textarea>
                            </div>
                          </div>
                        </div>
                        <div class="text-right">
                          <button
                            class="btn btn-primary"
                            type="button"
                            @click="sendNotification()"
                          >
                            Send Notification
                          </button>
                        </div>
                      </form>
                    </div>
                    <div class="tab-pane" id="tab2">
                      Received Notifications
                    </div>
                    <div class="tab-pane" id="tab3">
                      <div class="row">
                        <div class="col-sm-12 p-2">
                          <template
                            v-for="(notification, index) in notifications"
                          >
                            <div
                              :class="'alert alert-' + notification.type"
                              style="position:relative !important; width:100% !important; right:0 !important; top:0 !important;"
                              :key="index"
                            >
                              <button
                                type="button"
                                class="close text-dark"
                                data-dismiss="alert"
                                aria-hidden="true"
                              >
                                ×
                              </button>
                              <strong>{{ notification.title }}</strong>
                              <hr class="message-inner-separator" />
                              <p>
                                {{ notification.message }}
                              </p>
                            </div>
                          </template>
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
    </section>
    <!--/User Dashboard-->

    <Footer />
    <!--------------Modal to select students------------------>
    <div id="showStudentContactModal" class="cv-modal normal ">
      <div
        class=""
        style="display: flex; flex-direction: column; max-width:3000px; width:70%; height:98%;"
      >
        <div class="card d-flex flex-grow h-100 mb-0 flex-column">
          <div class="card-header bg-secondary text-white">
            <h5>Select Grades for Notification</h5>
          </div>
          <div class="card-body flex-grow h-100" style="overflow:auto">
            <div class="row">
              <div class="col-sm-12">
                <table
                  class="table card-table table-vcenter text-nowrap table-border border-dark"
                >
                  <thead class="bg-primary text-white">
                    <tr>
                      <th class="text-white">Grade</th>
                      <th class="text-white">Sections</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(classes, index) in grades">
                      <tr :key="index">
                        <td>{{ classes.cls_name }}</td>
                        <td>
                          <template v-for="(sections, index) in sch_classes">
                            <span
                              :key="index"
                              class="badge badge-secondary mr-1"
                              style=""
                              v-if="
                                sections.cls_id == classes.cls_id &&
                                  sections.sec_id
                              "
                            >
                              <label class="custom-control custom-checkbox">
                                <input
                                  type="checkbox"
                                  class="custom-control-input"
                                  style="width:18px; height:18px"
                                  :checked="secChecked(sections) ? true : false"
                                  :id="
                                    'cls-' +
                                      sections.cls_id +
                                      'sec-' +
                                      sections.sec_id
                                  "
                                  :name="
                                    'cls-' +
                                      sections.cls_id +
                                      'sec-' +
                                      sections.sec_id
                                  "
                                  :value="sections.sec_id"
                                  @change="selectGrade(sections, $event)"
                                />
                                <span class="custom-control-label">{{
                                  sections.sec_name
                                }}</span>
                              </label>
                            </span>
                          </template>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="card-footer text-center">
            <button
              class="btn btn-success"
              onclick="hideModal('showStudentContactModal');"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-------------------modal end----------------------->
  </div>
</template>
<script>
import Header from "@/components/header/Header.vue";
import sideNav from "@/components/dashboard/SideNavTeacher.vue";
import Footer from "@/components/footer/Footer.vue";
export default {
  components: {
    Header,
    Footer,
    sideNav
  },
  data() {
    return {
      cls_id: 0,
      sec_id: 0,
      grades: [],
      notifications: [],
      sch_classes: [],
      selectedGrades: [],
      notification: [
        {
          title: "",
          type: 0,
          message: ""
        }
      ]
    };
  },
  mounted: function() {
    //initCvModals();

    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.user_id = this.$store.getters.getAuthData.auth_user_id;
          this.role_id = this.$store.getters.getAuthData.auth_role_id;
          this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
          this.loadNotifications();
          this.loadClassesWithSections();
        }
      }.bind(this)
    );
  },
  methods: {
    loadClassesWithSections: function() {
      this.$http
        .post("/api/profile/schoolClassesWithSections", { sch_id: 3 })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.sch_classes = res.body.all_classes;
            var grd;
            for (var i = 0; i < this.sch_classes.length; i++) {
              if (this.sch_classes[i].cls_id != grd) {
                this.grades.push(this.sch_classes[i]);
              }
              grd = this.sch_classes[i].cls_id;
            }
          }
        });
    },

    loadNotifications: function() {
      this.$http
        .post("/api/profile/displayAllNotifications", { sch_id: this.sch_id })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            this.notifications = res.body.notifications;
          }
        });
    },
    selectGrade: function(grades, event) {
      if (event.target.checked == true) {
        this.selectedGrades.push(grades);
      } else if (event.target.checked == false) {
        for (var i = 0; i < this.selectedGrades.length; i++) {
          if (
            this.selectedGrades[i].sec_id == grades.sec_id &&
            this.selectedGrades[i].cls_id == grades.cls_id
          ) {
            this.selectedGrades.splice(i, 1);
          }
        }
      }
    },
    removeGrade: function(grade, index) {
      for (var i = 0; i < this.selectedGrades.length; i++) {
        if (
          this.selectedGrades[i].sec_id == grade.sec_id &&
          this.selectedGrades[i].cls_id == grade.cls_id
        ) {
          this.selectedGrades.splice(i, 1);
        }
      }
    },
    secChecked: function(grades) {
      for (var i = 0; i < this.selectedGrades.length; i++) {
        if (
          this.selectedGrades[i].sec_id == grades.sec_id &&
          this.selectedGrades[i].cls_id == grades.cls_id
        ) {
          return true;
        }
      }
    },
    getValidate: function() {
      if (!this.selectedGrades.length) {
        cvNotify(
          "Select at least one grade and section to send notification.",
          "warning"
        );
        return false;
      } else if (this.notification[0].title == "") {
        cvNotify("Please provide title of the notification.", "warning");
        return false;
      } else if (this.notification[0].type == "") {
        cvNotify("Please provide notification type.", "warning");
        return false;
      } else if (this.notification[0].message == "") {
        cvNotify("Please provide message of the notification.", "warning");
        return false;
      }
    },
    clearNotification: function() {
      this.notification[0].title = "";
      this.notification[0].type = "";
      this.notification[0].message = "";
      this.selectedGrades = [];
    },
    sendNotification: function() {
      this.getValidate();
      this.$http
        .post("/api/profile/sendNotifications", {
          notification: this.notification,
          to: this.selectedGrades,
          sch_id: this.sch_id,
          role_id: 3
        })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            if (res.body.success == 1) {
              cvNotify("Notification sent successfully.", "success");

              this.clearNotification();
              this.loadNotifications();
            }
          }
        });
    }
  }
};
</script>
<style lang="scss">
.alert-fix {
  position: relative !important;
  top: 0 !important;
  right: 0 !important;
  width: 100% !important;
}
</style>
