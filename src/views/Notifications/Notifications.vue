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
              <div class="card-header bg-secondary">
                <h3 class="card-title text-white w-auto">Notifications</h3>
                <i class="flex flex-fill" />
                <span
                  class="badge badge-primary mr-1"
                  title="Draft a notification"
                  style="cursor:pointer;"
                  onclick="showModal('draftNotificationModal')"
                  v-if="role_id != 3"
                  ><h3><i class="fas fa-plus" /></h3
                ></span>
                <span
                  class="badge badge-primary mr-1"
                  title="Draft a notification"
                  style="cursor:pointer;"
                  onclick="showModal('sendNotificationModal')"
                  v-if="role_id != 3"
                  ><h3><i class="fas fa-paper-plane" /></h3
                ></span>
              </div>
              <div class="card-body">
                <div class="row" v-if="Object.keys(userNotifications).length">
                  <template v-for="(notification, index) in userNotifications">
                    <div
                      :key="index"
                      v-if="
                        notification.status == null || notification.status != 1
                      "
                      class="col-sm-6 col-md-6"
                    >
                      <div
                        :class="'alert alert-' + notification.type"
                        :id="'notiAlert' + notification.noti_id"
                        style="position:relative; width:90% !important; left:32px;"
                      >
                        <button
                          type="button"
                          class="close text white"
                          :data-dismiss="'notiAlert' + notification.noti_id"
                          aria-hidden="true"
                          @click="closeNotification(notification.noti_id)"
                        >
                          &times;
                        </button>
                        <strong>{{ notification.title }}</strong>
                        <hr class="message-inner-separator" />
                        <p>{{ notification.message }}</p>
                      </div>
                    </div>
                  </template>
                </div>
                <div v-else class="row">
                  <h3>There is no notifications.</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--/User Dashboard-->

    <Footer />
    <!--------------Modal to draft notification------------------>
    <div id="draftNotificationModal" class="cv-modal normal ">
      <div
        class=""
        style="display: flex; flex-direction: column; max-width:3000px; width:50%; height:70%;"
      >
        <div class="card">
          <div class="card-header bg-secondary text-white">
            <h4>Draft a notification</h4>
          </div>
          <div class="card-body">
            <div class="form-group">
              <div class="row mb-1 d-flex align-items-center">
                <div class="col-sm-4 col-md-4">
                  <label class="form-label">Title</label>
                </div>
                <div class="col-sm-8 col-md-8">
                  <input
                    type="text"
                    class="form-control border border-secondary"
                    id="email"
                    placeholder="Enter title here"
                    v-model="notification[0].title"
                  />
                </div>
              </div>
              <div class="row mb-1 d-flex align-items-center">
                <div class="col-sm-4 col-md-4">
                  <label class="form-label">Message Type</label>
                </div>
                <div class="col-sm-8 col-md-8">
                  <select
                    class="form-control border border-secondary"
                    v-model="notification[0].type"
                  >
                    <option value="0" selected disabled>
                      Select message type</option
                    >
                    <option value="danger">Alert</option>
                    <option value="info">Information</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                  </select>
                </div>
              </div>
              <div class="row mb-1 d-flex align-items-center">
                <div class="col-sm-4 col-md-4">
                  <label class="form-label">Message</label>
                </div>
                <div class="col-sm-8 col-md-8">
                  <textarea
                    class="form-control border border-secondary"
                    name="message-textarea-input"
                    rows="4"
                    style="resize:none;"
                    placeholder="Type your message here.."
                    v-model="notification[0].message"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div
            class="card-footer d-flex align-items-center justify-content-center"
          >
            <button
              class="btn btn-success mr-1"
              type="button"
              @click="saveNotification()"
            >
              Save
            </button>
            <button
              class="btn btn-primary"
              onclick="hideModal('draftNotificationModal')"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-----------------end modal----------->

    <!--------------------display notification sample------------->
    <div id="notificationSampleModal" class="cv-modal normal ">
      <div
        class=""
        style="display: flex; flex-direction: column; max-width:3000px; width:50%; height:50%;"
      >
        <div class="card">
          <div class="card-header bg-secondary text-white">
            <h4>Notification</h4>
          </div>
          <div class="card-body  p-4">
            <div class="row">
              <div class="col-sm-12">
                <div
                  v-if="sampleNotification.length"
                  :class="'alert alert-' + sampleNotification[0].type"
                  style="position:relative; width:90% !important; left:32px;"
                >
                  <strong>{{ sampleNotification[0].title }}</strong>
                  <hr class="message-inner-separator" />
                  <p>{{ sampleNotification[0].message }}</p>
                </div>
              </div>
            </div>
          </div>
          <div
            class="card-footer mt-4 d-flex align-items-center justify-content-center"
          >
            <button
              class="btn btn-primary"
              onclick="hideModal('notificationSampleModal');showModal('sendNotificationModal');"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--------------------end modal------------------------------->

    <!--------------Modal to send notification------------------>
    <div
      id="sendNotificationModal"
      style="z-index:999999 !important;"
      class="cv-modal normal "
    >
      <div
        class=""
        style="display: flex; flex-direction: column; max-width:3000px; width:70%; height:60%;"
      >
        <div class="card">
          <div class="card-header bg-secondary text-white">
            <h4>Send a notification</h4>
          </div>
          <div class="card-body">
            <div class="form-group">
              <div class="row mb-1 d-flex align-items-center">
                <div class="col-sm-4 col-md-4">
                  <label class="form-label">Select Notification</label>
                </div>
                <div class="col-sm-7 col-md-7">
                  <select
                    class="form-control border border-secondary"
                    v-model="noti_id"
                    @change="
                      sampleNotification = [];
                      sampleNotification.push(notifications[noti_id]);
                    "
                  >
                    <option value="0" selected disabled
                      >Select notification</option
                    >
                    <template v-for="(notification, index) in notifications">
                      <option :key="index" :value="notification.noti_id">{{
                        notification.title
                      }}</option>
                    </template>
                  </select>
                </div>
                <div class="com-sm-1 col-md-1">
                  <span
                    v-if="sampleNotification.length"
                    class="badge badge-primary badge-pill"
                    title="Check notification."
                    style="cursor:pointer"
                    onclick="showModal('notificationSampleModal'); hideModal('sendNotificationModal');"
                  >
                    <i class="fas fa-eye" />
                  </span>
                </div>
              </div>
              <div class="row mb-1 d-flex align-items-center">
                <div class="col-sm-4 col-md-4">
                  <label class="form-label">Send to</label>
                </div>
                <div class="col-sm-4 col-md-4 p-4">
                  <div class="custom-controls-stacked">
                    <label
                      class="custom-control custom-radio d-inline-block mr-4"
                    >
                      <input
                        type="radio"
                        class="custom-control-input"
                        name="example-radios"
                        value="3"
                        v-model="sendToType"
                      />
                      <span class="custom-control-label">Students</span>
                    </label>
                    <label class="custom-control custom-radio d-inline-block">
                      <input
                        type="radio"
                        class="custom-control-input"
                        name="example-radios"
                        value="2"
                        v-model="sendToType"
                      />
                      <span class="custom-control-label">Teachers</span>
                    </label>
                  </div>
                </div>
                <div class="col-sn-1 col-md-1 p-4">
                  <span
                    v-if="sendToType == '3'"
                    class="badge badge-pill badge-secondary ml-1 py-2 px-3"
                    title="Select Grades and sections."
                    onclick="showModal('showStudentContactModal');hideModal('sendNotificationModal');"
                    style="cursor:pointer"
                    ><i
                      class="fas fa-plus fa-sm "
                      style="cursor:pointer"
                      title="Add"
                    ></i
                  ></span>
                </div>
              </div>
              <div
                class="row mb-1 d-flex align-items-center"
                v-if="selectedGrades.length && sendToType == '3'"
              >
                <div class="col-sm-4 col-md-4">
                  Selected Grades and Sections
                </div>
                <div class="col-sm-8 col-md-8 p-4">
                  <template v-for="(grade, index) in selectedGrades">
                    <span
                      :key="index"
                      class="badge badge-pill bg-secondary text-white mr-1 mt-1 p-2"
                      >Grade
                      {{ grade.cls_name }}
                      Section
                      {{ grade.sec_name }}

                      <i
                        class="fas fa-times text-primary ml-1"
                        style="cursor:pointer"
                        title="Remove"
                        @click="removeGrade(grade, index)"
                      ></i>
                    </span>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div
            class="card-footer d-flex align-items-center justify-content-center"
          >
            <button
              class="btn btn-success mr-1"
              type="button"
              @click="sendNotification()"
            >
              Send
            </button>
            <button
              class="btn btn-primary"
              onclick="hideModal('sendNotificationModal')"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-----------------end modal----------->

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
              onclick="hideModal('showStudentContactModal');showModal('sendNotificationModal');"
            >
              Save & Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-------------------modal end----------------------->
  </div>
</template>
<script>
//import Header from "@/components/dashboard/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import sideNav from "@/components/dashboard/SideNav.vue";
import Footer from "@/components/footer/Footer.vue";
export default {
  components: {
    Header,
    Footer,
    sideNav
  },
  data() {
    return {
      cls_id: "",
      sec_id: "",
      user_id: "",
      sch_id: "",
      role_id: "",
      grades: [],
      notifications: new Object(),
      sch_classes: [],
      selectedGrades: [],
      notification: [
        {
          title: "",
          type: 0,
          message: ""
        }
      ],
      sampleNotification: [],
      noti_id: "",
      sendToType: 3,
      userNotifications: new Object()
    };
  },
  mounted: function() {
    //initCvModals();

    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
          this.user_id = this.$store.getters.getAuthData.auth_user_id;
          this.role_id = this.$store.getters.getAuthData.auth_role_id;
          this.cls_id = this.$store.getters.getAuthData.auth_cls_id;
          this.sec_id = this.$store.getters.getAuthData.auth_sec_id;
          this.loadNotifications();
          this.loadUserNotifications();
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
    loadUserNotifications: function() {
      this.userNotifications = new Object();
      this.$http
        .post("/api/notifications/userNotifications", {
          sch_id: this.sch_id,
          role_id: this.role_id,
          user_id: this.user_id,
          cls_id: this.cls_id,
          sec_id: this.sec_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            var notifications = res.body.notifications;
            for (var i = 0; i < notifications.length; i++) {
              this.userNotifications[notifications[i].noti_id] =
                notifications[i];
            }
          }
        });
    },
    loadNotifications: function() {
      this.$http
        .post("/api/notifications/displayAllNotifications", {
          sch_id: this.sch_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            var notifications = res.body.notifications;
            for (var i = 0; i < notifications.length; i++) {
              this.notifications[notifications[i].noti_id] = notifications[i];
            }
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
      /*if (!this.selectedGrades.length) {
        cvNotify(
          "Select at least one grade and section to send notification.",
          "warning"
        );
        return false;
      } else */
      if (this.notification[0].title == "") {
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
    saveNotification: function() {
      this.getValidate();
      this.$http
        .post("/api/notifications/saveNotifications", {
          notification: this.notification,
          sch_id: this.sch_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            if (res.body.success == 1) {
              cvNotify("Notification saved successfully.", "success");
              hideModal("draftNotificationModal");
              this.clearNotification();
              this.loadNotifications();
            }
          }
        });
    },
    sendNotification: function() {
      this.$http
        .post("/api/notifications/sendNotifications", {
          noti_id: this.noti_id,
          sch_id: this.sch_id,
          role_id: this.sendToType,
          selectedGrades: this.selectedGrades
        })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            if (res.body.success == 1) {
              cvNotify("Notification successfully sent.", "success");
              hideModal("sendNotificationModal");
              this.clearNotification();
              this.loadUserNotifications();
            }
          }
        });
    },
    closeNotification: function(noti_id) {
      this.$http
        .post("/api/notifications/disableNotification", {
          user_id: this.user_id,
          noti_id: noti_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            if (res.body.success == 1) {
              this.loadUserNotifications();
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
