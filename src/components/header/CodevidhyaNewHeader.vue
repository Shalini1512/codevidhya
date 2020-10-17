<template>
  <div
    data-image-src="/assets/images/banners/banner2.jpg"
    class="cover-image bg-background3"
  >
    <div id="header" :class="pageScroll >= 56 ? 'scrolled' : ''">
      <router-link
        to="/"
        class="router-link-exact-active router-link-active"
        id="header-logo"
      >
        <img
          src="/assets/images/png/Codevidhya Logo.svg"
          alt="Codevidhya logo"
          class="header-brand-img"
        />
      </router-link>
      <nav id="header-menu" class="horizontalMenu clearfix d-md-flex">
        <div class="horizontal-overlapbg"></div>
        <div class="horizontal-overlapbg"></div>
        <ul data-v-aadacbfa class="horizontalMenu-list">
          <li aria-haspopup="true">
            <router-link to="/">Home</router-link>
          </li>
          <li aria-haspopup="true" v-if="user_id">
            <router-link to="/dashboard" v-if="auth_role_id == 3">
              Dashboard
            </router-link>
            <router-link to="/teacher-dashboard" v-if="auth_role_id == 2">
              Dashboard
            </router-link>
          </li>
          <li aria-haspopup="true">
            <transition name="bounce">
              <router-link v-if="show" class="live-coursess" to="/live-courses">
                Live Courses
                <sup class="bg-danger text-bold" style="padding: 2px 6px;">
                  New
                </sup>
              </router-link>
            </transition>
          </li>
          <li aria-haspopup="true">
            <router-link to="/for-schools">For Schools</router-link>
          </li>
          <li aria-haspopup="true">
            <router-link to="/why-coding">Why Coding?</router-link>
          </li>
          <li aria-haspopup="true">
            <router-link to="/in-media">In Media</router-link>
          </li>
          <li
            aria-haspopup="true"
            v-if="
              user_id &&
                (sales == 1 || programs
                  ? programs.demo_class_form == 1
                    ? true
                    : false
                  : false)
            "
          >
            <a href="#">
              Demo Session
              <span class="fe fe-chevron-down m-0"></span>
            </a>
            <ul class="sub-menu text-black">
              <li style="background:#000">
                <router-link
                  :to="'/trial-live-courses/register-for-demo-trial-class'"
                  >Demo Session Registration</router-link
                >
              </li>
              <li style="background:#000">
                <router-link
                  :to="'/trial-live-courses/trial-class-user-management'"
                  >Demo Session Users Management</router-link
                >
              </li>
              <li style="background:#000">
                <router-link
                  :to="'/trial-live-courses/trial-class-sales-follow-up'"
                  >Demo Session Follow up</router-link
                >
                <!--<a @click.prevent="waningMesg"> Trial Class Schedule Class Request</a>-->
              </li>
            </ul>
          </li>
          <!---->
        </ul>
      </nav>
      <i class="flex-grow-1"></i>
      <router-link to="/live-demo-session/request" class="register-btn">
        BOOK FREE TRIAL
      </router-link>
      <a
        href="#"
        class="login-btn cursor-pointer"
        v-if="shouldShowLoggedInState()"
        @click="doLogout()"
      >
        Logout
      </a>
      <router-link to="/login" v-else class="login-btn">Login</router-link>
    </div>
    <div
      id="sticky-wrapper"
      class="sticky-wrapper is-sticky"
      style="height: 11.1875px;"
    >
      <div
        data-v-aadacbfa
        class="header-style horizontal-main bg-dark-transparent clearfix"
        style="display: none; bottom: 0px; width: 1349px; position: absolute;"
      >
        <div class="horizontal-mainwrapper container clearfix"></div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import AuthMixin from "@/mixins/AuthMixin.js";

import axios from "axios";
export default {
  mixins: [AuthMixin],
  data() {
    return {
      auth_role_id: 0,
      user_id: null,
      headerInitialized: false,
      coinsEarned: 0,
      cls_grp: [],
      selectedLessonPlanGrade: 0,
      lessonplans: 0,
      sch_id: "",
      programId: 1,
      userProfile: null,
      unreadNotification: 0,
      name: "",
      show: true,
      sales: 0,
      pageScroll: 0,
      programs: new Array(),
    };
  },
  mounted() {
    this.$nextTick(function() {
      let vm = this;
      window.setInterval(() => {
        vm.show = !vm.show;
      }, 500);
    });
    cvAuth.getUserId(
      function(userId) {
        this.user_id = userId;
        this.auth_role_id = this.$store.getters.getAuthData.auth_role_id;
        this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
        this.programId = this.$store.getters.getAuthData.auth_program_id;
        this.name = this.$store.getters.getAuthData.auth_user_full_name;
        this.programs = this.$store.getters.getAuthData.programs;
        this.sales = this.$store.getters.getAuthData.sales;
        this.userProfile = this.$store.getters.getProfileData;
        this.getProfileInformation();
        /*if (!this.userProfile) {
          this.getUserProfile(this.user_id, this.auth_role_id);
        }
        this.userProfile = this.$store.getters.getProfileData;*/
        this.grant_points(userId);
        this.cls_loop();
        this.totalUnreadNoti(userId);
      }.bind(this)
    );

    if (!this.headerInitialized) {
      $(".horizontal-main").sticky({ topSpacing: 0 });
      $('<div class="horizontal-overlapbg"></div>').prependTo(
        ".horizontalMenu"
      );
      $("#horizontal-navtoggle").on("click", function(e) {
        $("body").toggleClass("active");
      });
      $(".horizontal-overlapbg").on("click", function(e) {
        $("body").removeClass("active");
      });
      $(".horizontalMenu > .horizontalMenu-list > li")
        .has(".sub-menu")
        .prepend(
          '<span class="horizontalMenu-click"><i class="horizontalMenu-arrow fas fa-angle-down"></i></span>'
        );
      $(".horizontalMenu > .horizontalMenu-list > li")
        .has(".horizontal-megamenu")
        .prepend(
          '<span class="horizontalMenu-click"><i class="horizontalMenu-arrow fas fa-angle-down"></i></span>'
        );
      $(".horizontalMenu-click").on("click", function(e) {
        $(this)
          .toggleClass("horizontal-activearrow")
          .parent()
          .siblings()
          .children()
          .removeClass("horizontal-activearrow");
        $(
          ".horizontalMenu > .horizontalMenu-list > li > .sub-menu, .horizontal-megamenu"
        )
          .not(
            $(this).siblings(
              ".horizontalMenu > .horizontalMenu-list > li > .sub-menu, .horizontal-megamenu"
            )
          )
          .slideUp("slow");
        $(this)
          .siblings(".sub-menu")
          .slideToggle("slow");
        $(this)
          .siblings(".horizontal-megamenu")
          .slideToggle("slow");
      });
      $(".horizontalMenu > .horizontalMenu-list > li > ul > li")
        .has(".sub-menu")
        .prepend(
          '<span class="horizontalMenu-click02"><i class="horizontalMenu-arrow fas fa-angle-down"></i></span>'
        );
      $(".horizontalMenu > .horizontalMenu-list > li > ul > li > ul > li")
        .has(".sub-menu")
        .prepend(
          '<span class="horizontalMenu-click02"><i class="horizontalMenu-arrow fas fa-angle-down"></i></span>'
        );
      $(".horizontalMenu-click02").on("click", function(e) {
        $(this)
          .children(".horizontalMenu-arrow")
          .toggleClass("horizontalMenu-rotate");
        $(this)
          .siblings("li > .sub-menu")
          .slideToggle("slow");
      });

      this.headerInitialized = true;
    }
  },
  methods: {
    waningMesg() {
      cvNotify("Coming Soon!", "warning");
    },
    headerDisplay() {
      $("body").toggleClass("active");
    },
    openNotification(event) {
      if (
        this.$router.currentRoute.name == "studentdashboard" ||
        this.$router.currentRoute.name == "teacherdashboard"
      ) {
        this.$emit("openMyUnnreadNotification", event);
      } else {
        if (this.auth_role_id == 3)
          this.$router.push({
            name: "studentdashboard",
            params: { OpenNotif: 1 },
          });
        else if (this.auth_role_id == 2)
          this.$router.push({
            name: "teacherdashboard",
            params: { OpenNotif: 1 },
          });
      }
    },
    profileSwitch(event) {
      if (this.$router.currentRoute.name == "studentdashboard") {
        this.$emit("OpenProfileCurrent", event);
      } else {
        this.$router.push({
          name: "studentdashboard",
          params: { openProfile: 1 },
        });
      }
    },
    profileTeacherSwitch(event) {
      if (this.$router.currentRoute.name == "teacherdashboard") {
        this.$emit.push("OpenProfileCurrent", event);
      } else {
        this.$router.push({
          name: "teacherdashboard",
          params: { openProfile: 1 },
        });
      }
    },
    getUserPrograms(programId) {
      //axios.post("/api/profile/getUserPrograms",);
      // console.log("user");
    },
    getProfileInformation: function() {
      this.$http
        .post("/api/profile/getUserInformation", {
          user_id: this.user_id,
          role_id: this.auth_role_id,
        })
        .then(function(res) {
          this.userProfile = res.body;
        });
    },
    totalUnreadNoti(userId) {
      let vm = this;
      axios
        .post("/api/notifications/getunreadnotification", { user_id: userId })
        .then((res) => {
          vm.unreadNotification = res.data.result[0].unread;
        });
    },

    grant_points: function(userId) {
      this.$http
        .post("/api/user/grant_points", { user_id: userId })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            let points = res.body.data;
            let grant_p = 0;
            if (points.length == 0) $("#grant_points").text(0);
            else {
              this.coinsEarned = Math.floor(points[0].coin_earned);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onLoginPage() {
      var pathName = window.location.pathname;
      return ~pathName.indexOf("/login") || ~pathName.indexOf("/register");
    },
    cls_loop: function() {
      this.$http
        .post("/api/user/download_cls_file", { sch_id: this.sch_id })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            this.cls_grp = res.body.data;
          }
        });
    },
    down_bridge: function() {
      var grade = document.getElementById("grade-select-bridge").value;

      if (grade != 0) {
        var link = document.createElement("a");
        link.download = "grade_" + grade + "_bridge_course";
        link.href =
          "/dynamic/cv_resources/bridgeCourse/grade_" + grade + ".pdf";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        //delete link;
      }
    },
    down_lesson_plan: function() {
      var grade = document.getElementById("grade-select_lessonplan_grade")
        .value;
      var lesson_plan = document.getElementById("grade-lesson-plan").value;
      if (grade != 0 && lesson_plan != 0) {
        var link = document.createElement("a");
        link.download = "Grade " + grade + " Lesson Plan " + lesson_plan;
        link.href =
          "/dynamic/cv_resources/lessonPlans/grade" +
          grade +
          "/grade_" +
          grade +
          "_lesson_plan_" +
          lesson_plan +
          ".pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    down_que_bank: function() {
      var grade = document.getElementById("grade-select_que_bank").value;
      if (grade != 0) {
        var link = document.createElement("a");
        link.download = "Question Bank Grade " + grade;
        link.href =
          "/dynamic/cv_resources/question_bank/question_bank_grade_" +
          grade +
          ".pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // delete link;
      }
      var ans_key = document.getElementById("grade-select_que_bank_answer_key")
        .value;

      if (ans_key != 0) {
        var link = document.createElement("a");
        link.download = "Question Bank Answer Key Grade " + ans_key;
        link.href =
          "/dynamic/cv_resources/question_bank/question_bank_answer_key_grade_" +
          ans_key +
          ".pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    down: function() {
      var grade = document.getElementById("grade-select").value;
      if (grade != 0) {
        var link = document.createElement("a");
        link.download = "grade_" + grade + "_answer_key";
        link.href =
          "/dynamic/cv_resources/answer_key/answer/grade_" + grade + ".pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // delete link;
      }
    },
  },
};
</script>
<style scoped>
.modal-backdrop {
  display: none !important;
}
</style>
<style lang="scss" scoped>
@media only screen and (min-width: 991px) {
  .horizontal-main {
    height: 59px;
  }
}
.sticky-wrapper.is-sticky .horizontal-main {
  padding: 0;
}

#navbar-coins {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 16px;
  margin-top: 12px;
  margin-bottom: 12px;
  padding: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  transition: all 200ms;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  img {
    width: 24px;
  }
  span {
    padding-left: 8px;
    padding-right: 4px;
    font: bold 1.2rem/1 "Rubik";
  }
}

.a-profile-icon {
  width: 36px;
  height: 36px;
  border-radius: 18px;
  border: none;
}
.full-user-name {
  background: none;
  border: none;
  color: #fff;
}
.a-bell-icon {
  width: 36px;
  height: 36px;
  border-radius: 18px;
  border: none;
  font-size: 18px;
  background: rgba(0, 0, 0, 0.1);
}
.badge-notify {
  background: #e75160;
  position: relative;
  color: #fff;
  top: -14px;
  left: -14px;
  border-radius: 30%;
  font-size: 10px;
}

.dropdown-toggle::after {
  display: none;
}

.bounce-enter-active {
  animation: bounce-in 1s;
}
.bounce-leave-active {
  animation: bounce-in 1s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0.95);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
#header {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  height: 64px;
  padding: 0 32px;
  background: rgb(0, 141, 210);
  z-index: 1000;
  &.scrolled {
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
  }

  .register-btn {
    margin-right: 8px;
  }

  .register-btn,
  .login-btn {
    padding: 8px 16px;
    border-radius: 32px;
    color: #222;
    background: #fff;
    transition: all 200ms;
    &:hover {
      background: #222;
      color: #fff;
    }
  }
}
#header-logo {
}

#header-menu {
  margin-left: 48px;
  a {
    padding: 8px 16px;
    color: #fff;
    transition: all 200ms;
    &:hover {
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
