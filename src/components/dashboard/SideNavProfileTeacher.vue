<template>
  <div class="col-xl-3 col-lg-12 col-md-12 teacher-sidebar-dashboard-menu" style="margin-top:57px;">
    <div style="position:relative;overflow:auto;height:86%;">
      <div class="card">
        <div class="card-body text-center item-user border-bottom">
          <div class="profile-pic">
            <div class="profile-image-container">
              <img
                :src="
                  userProfile.length
                    ? userProfile[0].profile_pic
                      ? userProfile[0].profile_pic
                        ? '/dynamic/profiles/' + userProfile[0].profile_pic
                        : '/assets/images/users/user.svg'
                      : '/assets/images/users/user.svg'
                    : '/assets/images/users/user.svg'
                "
                alt="user"
              />
            </div>
            <span class="user-basic col-sm-12">
              <h4 class="mb-0 font-weight-semibold text-dark">
                {{
                userProfile.length
                ? userProfile[0].name
                ? userProfile[0].name
                : ""
                : ""
                }}
              </h4>
              <span
                v-if="
                  userProfile.length
                    ? userProfile[0].sch_name
                      ? true
                      : false
                    : false
                "
              >{{ userProfile.length ? userProfile[0].sch_name : "" }}</span>
            </span>
          </div>
        </div>
        <div class="item1-links mb-0">
          <a
            href="#"
            class="d-flex border-bottom"
            id="profile"
            @click.prevent="moveToProfile($event)"
          >
            <span class="icon1 mr-3">
              <i class="far fa-id-card"></i>
            </span>
            Profile
          </a>
          <div id="accordion2" class="item1-links">
            <a
              class="accordion-toggle collapsed d-flex border-bottom"
              data-toggle="collapse"
              data-parent="#accordion2"
              :href="'#collapse2'"
              aria-expanded="false"
              @click="studentprofile('student', $event)"
            >
              <span class style="display:flex;">
                <span class="icon1 mr-3">
                  <i class="fas fa-users"></i>
                </span>
                Students
              </span>
            </a>
            <div
              id="collapse2"
              class="panel-collapse collapse cursor-pointer student-profile"
              role="tabpanel"
              aria-expanded="false"
            >
              <a
                href="#"
                class="d-flex border-bottom pl-7"
                style="cursor:pointer"
                @click.prevent="
                  StudentProfileSetting('profile_setting', $event)
                "
              >Profile Settings</a>
              <!--<a
                href="#"
                class="d-flex border-bottom pl-7"
                style="cursor:pointer"
                @click.prevent="
                  StudentProfileSetting('promote_students', $event)
                "
              >Promote Students</a>-->
              <a
                href="#"
                class="d-flex border-bottom pl-7"
                style="cursor:pointer"
                @click.prevent="StudentProfileSetting('monitors', $event)"
              >Monitoring</a>
            </div>
          </div>

          <a
            href="#"
            class="d-flex border-bottom"
            @click.prevent="updateuserProfile('mycourses', $event)"
          >
            <span class="icon1 mr-3">
              <i class="fas fa-book-reader"></i>
            </span>
            Courses
          </a>

          <a
            href="#"
            class="d-flex border-bottom"
            @click.prevent="updateuserProfile('projects', $event)"
          >
            <span class="icon1 mr-3">
              <i class="fas fa-folder-open"></i>
            </span>
            Projects
          </a>

          <a
            href="#"
            class="d-flex border-bottom"
            @click.prevent="updateuserProfile('quizzes', $event)"
          >
            <span class="icon1 mr-3">
              <i class="fas fa-folder-open"></i>
            </span>
            Quizzes
          </a>
          <a v-if="trainer"
            href="#"
            id="trainer-class-schedular"
            class="d-flex border-bottom"
            @click.prevent="moveClassSchedule($event)"
          >
            <span class="icon1 mr-3">
              <i class="icon icon-calendar"></i>
            </span>
            Trainer Class Schedular
          </a>
          <div v-if="programId == 1" id="accordion2" class="item1-links" style="display:none;">
            <a
              class="accordion-toggle collapsed d-flex border-bottom"
              data-toggle="collapse"
              data-parent="#accordion2"
              :href="'#collapse1'"
              aria-expanded="false"
              @click="updateuserProfile('resources', $event)"
            >
              <span class style="display:flex;">
                <span class="icon1 mr-3">
                  <i class="fas fa-tools"></i>
                </span>
                Resources
              </span>
            </a>
            <div
              id="collapse1"
              class="panel-collapse collapse cursor-pointer active download-modal"
              role="tabpanel"
              aria-expanded="false"
            >
              <a
                class="d-flex border-bottom pl-7"
                style="cursor:pointer"
                download="Annual Project Mentorship Manual Final"
                href="/dynamic/cv_resources/annual_project_manual/annual_project_mentorship_manual_final.pdf"
              >Annual Project Manual</a>
              <template v-if="$store.getters.getAuthData.auth_role_id != 3">
                <a
                  style="cursor:pointer"
                  data-toggle="modal"
                  data-target="#answer_key_modal"
                  class="d-flex border-bottom pl-7"
                  @click="downloadModal('answer_key', $event)"
                >Answer key</a>

                <a
                  style="cursor:pointer"
                  data-toggle="modal"
                  data-target="#bridge_course_modal"
                  class="d-flex border-bottom pl-7"
                  @click="downloadModal('bridge_course', $event)"
                >Bridge course</a>

                <a
                  style="cursor:pointer"
                  data-toggle="modal"
                  data-target="#que_bank_modal"
                  class="d-flex border-bottom pl-7"
                  @click="downloadModal('question_bank', $event)"
                >Question bank</a>

                <a
                  style="cursor:pointer"
                  data-toggle="modal"
                  data-target="#lesson_plan_modal"
                  class="d-flex border-bottom pl-7"
                  @click="downloadModal('lesson_plan', $event)"
                >Lesson plan</a>

                <template v-if="$store.getters.getAuthData.auth_sch_id == 28">
                  <a
                    style="cursor:pointer"
                    class="d-flex border-bottom pl-7"
                    :download="'Python Grade 8'"
                    :href="'/dynamic/cv_resources/textbooks/PythonGrade_8.pdf'"
                  >Download Python 8 Book</a>

                  <a
                    style="cursor:pointer"
                    class="d-flex border-bottom pl-7"
                    :download="'Python Grade 9'"
                    :href="'dynamic/cv_resources/textbooks/PythonGrade_9.pdf'"
                  >Download Python 9 Book</a>

                  <a
                    style="cursor:pointer"
                    class="d-flex border-bottom pl-7"
                    :download="'Python Grade 10'"
                    :href="'dynamic/cv_resources/textbooks/PythonGrade_10.pdf'"
                  >Download Python 10 Book</a>
                </template>
              </template>
            </div>
          </div>
          <!--resourse end-->

          <!--<router-link to="/notifications" class="d-flex border-bottom">
          <span class="icon1 mr-3">
            <i class="fas fa-bell"></i>
          </span>
          Notifications
          </router-link>-->
          <a
            href="#"
            id="notification"
            class="d-flex border-bottom"
            @click.prevent="moveToNoti($event)"
          >
            <span class="icon1 mr-3">
              <i class="fas fa-bell"></i>
            </span>
            Notifications
          </a>
          <!-- <a href="#" class="d-flex border-bottom" @click="doLogout()">
          <span class="icon1 mr-3">
            <i class="fas fa-power-off"></i>
          </span>
          Logout
          </a>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthMixin from "@/mixins/AuthMixin.js";
import axios from "axios";
import profilesetting from "@/views/Profile/ProfileSetting.vue";

export default {
  mixins: [AuthMixin],
  props: ["userProfiles"],
  data() {
    return {
      user_img: "",
      cls_id: "",
      user_id: 0,
      sec_id: "",
      role_id: "",
      sch_id: "",
      user_full_name: "",
      selectedLessonPlanGrade: 0,
      lessonplans: 0,
      userId: 0,
      userProfile: [],
      cls_grp: [],
      curriculum: [],
      programId: 1,
      edit: 0,
      profilePic: "",
      trainer: "",
      profilePicData: new FormData()
    };
  },
  mounted: function() {
    //initCvModals();

    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.user_id = userId;
          this.cls_id = this.$store.getters.getAuthData.auth_cls_id;
          this.user_id = this.$store.getters.getAuthData.auth_user_id;
          this.user_full_name = this.$store.getters.getAuthData.auth_user_full_name;
          this.sec_id = this.$store.getters.getAuthData.auth_sec_id;
          this.role_id = this.$store.getters.getAuthData.auth_role_id;
          this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
          this.programId = this.$store.getters.getAuthData.auth_program_id;
          this.trainer = this.$store.getters.getAuthData.trainer;
          this.getProfileInformation();
          //this.cls_loop();

          this.course_for_user(userId, this.role_id);
        }
      }.bind(this)
    );
  },
  methods: {
    /* infection(){
      this.getProfileInformation();
    },*/
    accountSetting(account_deal) {
      $(".student-profile > a").removeClass("active");
      $(".download-modal >a").removeClass("active");
      $(".item1-links > a").removeClass("active");
      this.$emit("accountSetting");
    },
    downloadModal(modal_name, event) {
      //$(".item1-links > a").removeClass("active");
      $(".student-profile > a").removeClass("active");
      $(".download-modal >a").removeClass("active");
      $(event.toElement).addClass("active");
    },
    studentprofile(profile_name, event) {
      $(".student-profile > a").removeClass("active");
      $(".download-modal >a").removeClass("active");
      $(".item1-links > a").removeClass("active");
      $(event.toElement).addClass("active");
    },
    StudentProfileSetting(profile_name, event) {
      $(".student-profile > a").removeClass("active");
      $(".download-modal >a").removeClass("active");
      $(event.toElement).addClass("active");
      this.$emit("studentProfileSetting", profile_name, event);
    },

    removedProfile(event) {
      this.$emit("removeUserProfile", event);
    },
    updateuserProfile(profile_name, event) {
      $(".student-profile > a").removeClass("active");
      $(".download-modal >a").removeClass("active");
      if (profile_name != "resources")
        this.$emit("updatedDashboard", profile_name, event);
      else {
        $(".item1-links > a").removeClass("active");
        $(event.toElement).addClass("active");
      }
    },
    course_for_user: function(userId, role_id) {
      // console.log(userId);
      axios
        .post("/api/user/get_user_course", {
          user_id: userId,
          role_id: role_id
        })
        .then(res => {
          this.curriculum = res.data;
        });
    },

    getProfileInformation: function() {
      let vm = this;
      axios
        .post("/api/profile/getUserInformation", {
          user_id: this.userId,
          role_id: this.role_id
        })
        .then(res => {
          if (!res.data.length) {
            // vm.$router.push("/login");
          } else {
            vm.userProfile = res.data;
          }
        });
    },
    moveClassSchedule(e) {
      let elem_id = e.toElement.id;
      this.moveSchedule(elem_id);
    },
    moveSchedule(id) {
      $(".item1-links > a").removeClass("active");
      $(".student-profile > a").removeClass("active");
      $(".download-modal >a").removeClass("active");
      $("#" + id).addClass("active");
      this.$emit("updateAgainSchedular", id);
    },
    moveToNoti(e) {
      let elem_id = e.toElement.id;
      this.moveNoti(elem_id);
    },
    moveNoti(id) {
      $(".item1-links > a").removeClass("active");
      $(".student-profile > a").removeClass("active");
      $(".download-modal >a").removeClass("active");
      $("#" + id).addClass("active");
      this.$emit("updateAgainNoti", id);
    },

    moveToProfile(e) {
      let elem_id = e.toElement.id;

      this.moveprofile(elem_id);
    },
    moveprofile(id) {
      $(".item1-links > a").removeClass("active");
      $(".student-profile > a").removeClass("active");
      $(".download-modal >a").removeClass("active");
      $("#" + id).addClass("active");
      let vm = this;
      if (vm.role_id == 2) {
        this.$emit("updateAgainEdit", id);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.profile-image-container {
  padding: 24px;
  text-align: center;
  img {
    width: 128px;
    height: 128px;
    border-radius: 50%;
    border: 4px solid #fff;
  }
}
.teacher-sidebar-dashboard-menu {
  position: fixed;
  height: 100%;
  margin-top: 0;
}
.user-basic {
  text-align: center;
}
.profile-pic {
  text-align: center !important;
}
@media only screen and (max-width: 1024px) {
  .profile-pic {
    text-align: left !important;
  }
  .profile-image-container {
    text-align: left !important;
  }
  .user-basic {
    text-align: left !important;
  }
  .teacher-sidebar-dashboard-menu {
    position: fixed;
    height: 100%;
    margin-top: 0px;
    text-align: left;
  }
}
@media only screen and (max-width: 992px) {
  .profile-pic {
    text-align: center !important;
  }
  .profile-image-container {
    text-align: center !important;
  }
  .user-basic {
    text-align: center !important;
  }

  .teacher-sidebar-dashboard-menu {
    position: relative;
    height: auto;
    margin-top: 0px;
    text-align: center;
  }
}
</style>
