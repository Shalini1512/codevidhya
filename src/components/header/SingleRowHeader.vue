<template>
  <div id="header" :class="pageScroll >= 56 ? 'scrolled' : ''">
    <router-link to="/" id="header-logo">
      <img
        src="/assets/images/png/Codevidhya Logo.svg"
        class="header-brand-img"
        alt="Codevidhya logo"
      />
    </router-link>
    <nav id="header-menu">
      <router-link to="/">Home</router-link>
      <!--template v-if="user_id"-->
      <router-link to="/dashboard" v-if="auth_role_id == 3"
        >Dashboard</router-link
      >
      <router-link to="/teacher-dashboard" v-if="auth_role_id == 2"
        >Dashboard</router-link
      >
      <router-link class="live-coursess" to="/live-courses"
        >Live Courses</router-link
      >

      <router-link to="for-schools">For Schools</router-link>

      <router-link to="/why-coding">Why Coding?</router-link>
      <router-link to="/in-media">In Media</router-link>
      <router-link to="/contact">Contact Us</router-link>

      <!--router-link
        to="/projects"
        v-if="programs ? (programs.project == 1 ? true : false) : true"
        >Projects</router-link
      -->
      <!--/template-->
    </nav>

    <i class="flex-grow-1" />
    <router-link to="/register" class="register-btn">Book Free Trial</router-link>
    <router-link to="/login" class="login-btn">Login</router-link>
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
      programs: new Array(),

      pageScroll: 0
    };
  },
  mounted() {
    this.$nextTick(function() {
      let vm = this;
      window.setInterval(() => {
        vm.show = !vm.show;
      }, 500);
    });

    window.addEventListener(
      "scroll",
      function(e) {
        this.handleScroll(e);
      }.bind(this)
    );

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
    handleScroll(e) {
      this.pageScroll = document.documentElement.scrollTop;
    },

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
            params: { OpenNotif: 1 }
          });
        else if (this.auth_role_id == 2)
          this.$router.push({
            name: "teacherdashboard",
            params: { OpenNotif: 1 }
          });
      }
    },
    profileSwitch(event) {
      if (this.$router.currentRoute.name == "studentdashboard") {
        this.$emit("OpenProfileCurrent", event);
      } else {
        this.$router.push({
          name: "studentdashboard",
          params: { openProfile: 1 }
        });
      }
    },
    profileTeacherSwitch(event) {
      if (this.$router.currentRoute.name == "teacherdashboard") {
        this.$emit.push("OpenProfileCurrent", event);
      } else {
        this.$router.push({
          name: "teacherdashboard",
          params: { openProfile: 1 }
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
          role_id: this.auth_role_id
        })
        .then(function(res) {
          this.userProfile = res.body;
        });
    },
    totalUnreadNoti(userId) {
      let vm = this;
      axios
        .post("/api/notifications/getunreadnotification", { user_id: userId })
        .then(res => {
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
        .catch(err => {
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
    }
  }
};
</script>
<style lang="scss">
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
