<template>
  <div
    class="cover-image bg-background3"
    data-image-src="/assets/images/banners/banner2.jpg"
  >
    <!--Topbar-->
    <div class="header-main">
      <!--Header-->

      <!--/Header-->

      <!-- Mobile Header -->
      <div class="horizontal-header clearfix">
        <div class="container-fluid">
          <a
            id="horizontal-navtoggle"
            class="animated-arrow"
            @click="headerDisplay"
          >
            <span></span>
          </a>
          <span class="smllogo">
            <router-link to="/">
              <img
                src="/assets/images/png/Codevidhya Logo.svg"
                width="120"
                alt="img"
              />
            </router-link>
          </span>
        </div>
      </div>
      <!-- /Mobile Header -->

      <!--Horizontal-main -->
      <div class="header-style horizontal-main bg-dark-transparent">
        <div class="horizontal-mainwrapper container-fluid">
          <nav class="horizontalMenu clearfix d-md-flex">
            <div class="header-search-logo d-flex align-items-center mr-4">
              <router-link to="/" class="header-logo">
                <img
                  src="/assets/images/png/Codevidhya Logo.svg"
                  class="header-brand-img"
                  alt=" logo"
                />
              </router-link>
            </div>
            <ul class="horizontalMenu-list">
              <li aria-haspopup="true">
                <router-link to="/">Home</router-link>
              </li>
              <li aria-haspopup="true">
                <router-link to="/dashboard" v-if="role_id == 3"
                  >Dashboard</router-link
                >
                <router-link to="/teacher-dashboard" v-if="role_id == 2"
                  >Dashboard</router-link
                >
              </li>
              <li aria-haspopup="true" v-if="role_id == 2">
                <a href="#">
                  Assessments
                  <span class="fe fe-chevron-down m-0"></span>
                </a>
                <ul class="sub-menu">
                  <li>
                    <router-link
                      :to="{
                        name: 'instituteassessments'
                      }"
                      v-if="role_id == 2"
                      class="d-flex border-bottom"
                      >All Assessments</router-link
                    >
                  </li>
                  <li>
                    <router-link
                      to="/assessment-questions"
                      class="d-flex border-bottom"
                      >Assessment Questions</router-link
                    >
                  </li>
                  <li>
                    <router-link
                      to="/assessment-report"
                      class="d-flex border-bottom"
                      >Assessment Report</router-link
                    >
                  </li>
                </ul>
              </li>
              <li aria-haspopup="true" v-if="role_id == 3">
                <router-link to="/assessments">Assessments</router-link>
              </li>

              <li aria-haspopup="true">
                <router-link to="/courses">Courses</router-link>
              </li>
              <li aria-haspopup="true">
                <router-link to="/projects">Projects</router-link>
              </li>
              <!--<li>
                <a href="https://studio.codevidhya.com/projects">Projects</a>
              </li>-->
              <li aria-haspopup="true">
                <router-link to="/quickbook">Quickbook</router-link>
              </li>
              <li aria-haspopup="true">
                <router-link to="/quizzes">Quiz</router-link>
              </li>
              <li aria-haspopup="true">
                <router-link to="/notifications">Notifications</router-link>
              </li>
            </ul>

            <div class="pt-4 mt-1 w-10 ">
              {{ userProfile.length ? userProfile[0].name : "" }}
            </div>
            <div
              class="pt-3"
              v-if="
                userProfile.length && userProfile[0].user_id
                  ? userProfile[0].user_id != 0
                  : 0
              "
            >
              <button
                class="a-profile-icon btn-primary dropdown-toggle"
                data-toggle="dropdown"
              >
                <i class="fas fa-user"></i>
              </button>
              <ul class="dropdown-menu" role="menu">
                <li>
                  <router-link to>
                    Earned Coins
                    <span class="badge badge-pill badge-primary float-right">{{
                      coinsEarned
                    }}</span>
                  </router-link>
                </li>
                <li>
                  <!--<router-link v-if="userProfile.length" :to="'/profile/'+userProfile[0].username">Profile</router-link>-->
                  <a
                    v-if="
                      userProfile.length
                        ? userProfile[0].role_id == 3
                          ? true
                          : false
                        : false
                    "
                    @click.prevent="profileSwitch($event)"
                    >Profile</a
                  >
                  <a
                    v-else-if="
                      userProfile.length
                        ? userProfile[0].role_id == 2
                          ? true
                          : false
                        : false
                    "
                    @click.prevent="
                      $router.push({
                        name: 'teacher-dashboard',
                        params: { openProfile: 1 }
                      })
                    "
                    >Profile</a
                  >
                </li>

                <li>
                  <router-link to="/my-quizzes">My Quizzes</router-link>
                </li>
                <li>
                  <router-link to="/quiz-progress"
                    >Quiz Performance</router-link
                  >
                </li>
                <li>
                  <a href="#" @click="doLogout()">Logout</a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
    <!--/Horizontal-main -->

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
      cls_id: "",
      user_id: 0,
      sec_id: "",
      role_id: "",
      sch_id: "",
      userId: 0,
      headerInitialized: false,
      userProfile: [],
      coinsEarned: 0
    };
  },
  mounted() {
    cvAuth.getUserId(
      function(userId) {
        this.user_id = userId;
        this.userId = userId;
        this.cls_id = this.$store.getters.getAuthData.auth_cls_id;
        this.sec_id = this.$store.getters.getAuthData.auth_sec_id;
        this.role_id = this.$store.getters.getAuthData.auth_role_id;
        this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
        this.getProfileInformation();
        this.grant_points(userId);
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
    headerDisplay() {
      $("body").toggleClass("active");
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
      //this.$router.push({name:'studentdashboard',params:{openProfile:1}})
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
        });
    },
    getProfileInformation: function() {
      let vm = this;
      axios
        .post("/api/profile/getUserInformation", {
          user_id: this.user_id,
          role_id: this.role_id
        })
        .then((res) => {
          if (!res.data.length) {
            //vm.$router.push("/login");
          } else {
            vm.userProfile = res.data;
          }
        });
    }
    /*onLoginPage() {
      var pathName = window.location.pathname;
      return ~pathName.indexOf("/login") || ~pathName.indexOf("/register");
    }*/
  }
};
</script>

<style lang="scss">
@media only screen and (min-width: 991px) {
  .horizontal-main {
    height: 59px;
  }
}
.sticky-wrapper.is-sticky .horizontal-main {
  padding: 0;
}
</style>
