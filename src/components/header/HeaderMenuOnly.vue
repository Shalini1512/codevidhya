<template>
  <div class="cover-image bg-background3" data-image-src="/assets/images/banners/banner2.jpg">
    <div class="header-main menu-only">
      <!-- Mobile Header -->
      <div class="horizontal-header clearfix">
        <div class="container">
          <a id="horizontal-navtoggle" class="animated-arrow" @click="headerDisplay">
            <span></span>
          </a>
          <span class="smllogo">
            <router-link to="/">
              <img src="/assets/images/png/codevidhya_reverse_logo.png" width="120" alt="img" />
            </router-link>
          </span>
        </div>
      </div>
      <!-- /Mobile Header -->

      <!--Horizontal-main -->
      <div class="header-style horizontal-main bg-dark-transparent clearfix">
        <div class="horizontal-mainwrapper container clearfix">
          <nav class="horizontalMenu clearfix d-md-flex">
            <ul class="horizontalMenu-list">
              <li aria-haspopup="true">
                <router-link to="/">Home</router-link>
              </li>
              <li aria-haspopup="true" v-if="user_id">
                <router-link to="/dashboard" v-if="auth_role_id == 3">Dashboard</router-link>
                <router-link to="/teacher-dashboard" v-if="auth_role_id == 2">Dashboard</router-link>
              </li>
              <li aria-haspopup="true" v-if="programs.curriculum_course == 1 ? true : false">
                <router-link to="/courses">Courses</router-link>
              </li>
              <li aria-haspopup="true" v-if="programs.project == 1 ? true : false">
                <router-link to="/projects">Projects</router-link>
              </li>
              <template v-if="programs.assessment == 1 ? true : false">
                <li aria-haspopup="true" v-if="auth_role_id == 2">
                  <a href="#">
                    Assessments
                    <span class="fe fe-chevron-down m-0"></span>
                  </a>
                  <ul class="sub-menu">
                    <li>
                      <router-link
                        :to="'/institute/assessments'"
                        class="d-flex border-bottom"
                      >All Assessments</router-link>
                    </li>
                    <li>
                      <router-link
                        to="/assessment-questions"
                        class="d-flex border-bottom"
                      >Assessment Questions</router-link>
                    </li>
                    <li>
                      <router-link
                        to="/assessment-report"
                        class="d-flex border-bottom"
                      >Assessment Report</router-link>
                    </li>
                  </ul>
                </li>
              </template>
              <li aria-haspopup="true" v-if="programs.quiz == 1 ? true : false">
                <router-link to="/quizzes">Quiz</router-link>
              </li>
              <li aria-haspopup="true" v-if="programs.quickbook == 1 ? true : false">
                <router-link to="/quickbook">Quickbook</router-link>
              </li>
              <!-- resource start -->
              <li
                aria-haspopup="true"
                class="d-flex align-items-center"
                v-if="
                  programs
                    ? programs.online_resources == 1
                      ? true &&
                        user_id != 0 &&
                        $store.getters.getAuthData.auth_role_id == 3
                      : false
                    : false
                "
              >
                <a class="dropdown-toggle" data-toggle="dropdown">Resources</a>
                <ul class="dropdown-menu" role="menu">
                  <li
                    class="dropdown-header"
                    v-if="
                      $store.getters.getAuthData.auth_sch_id == 28 &&
                        ($store.getters.getAuthData.auth_cls_id >= 8 &&
                          $store.getters.getAuthData.auth_cls_id <= 10)
                    "
                  >Activity</li>
                  <li>
                    <!--<a
                      style="font-size:14px;"
                      download="Annual Project Mentorship Manual Final"
                      href="/dynamic/cv_resources/annual_project_manual/annual_project_mentorship_manual_final.pdf"
                      >Annual Project Manual</a
                    >-->
                    <router-link to="/resource/quizzes">Quiz</router-link>
                    <router-link to="/resource/assessments">Assessments</router-link>
                    <router-link to="/resource/projects">Projects</router-link>
                  </li>
                  <template
                    v-if="
                      $store.getters.getAuthData.auth_sch_id == 28 &&
                        ($store.getters.getAuthData.auth_cls_id >= 8 &&
                          $store.getters.getAuthData.auth_cls_id <= 10)
                    "
                  >
                    <li class="divider"></li>
                    <li class="dropdown-header">{{ $store.getters.getAuthData.programs.sch_name }}</li>
                    <li>
                      <a
                        style="font-size:14px;cursor:pointer"
                        :download="
                          'Python Grade ' +
                            $store.getters.getAuthData.auth_cls_id
                        "
                        :href="
                          '/static/textbooks/PythonGrade_' +
                            $store.getters.getAuthData.auth_cls_id +
                            '.pdf'
                        "
                      >Download Python Book</a>
                    </li>
                  </template>
                </ul>
              </li>
              <li
                aria-haspopup="true"
                class="d-flex align-items-center"
                v-if="
                  programs
                    ? programs.online_resources == 1
                      ? true &&
                        user_id != 0 &&
                        ($store.getters.getAuthData.auth_role_id == 2 ||
                          $store.getters.getAuthData.auth_role_id == 1)
                      : false
                    : false
                "
              >
                <a class="dropdown-toggle" data-toggle="dropdown">Resources</a>
                <ul class="dropdown-menu" role="menu">
                  <li
                    class="dropdown-header"
                    v-if="$store.getters.getAuthData.auth_sch_id == 28"
                  >Activity</li>
                  <li>
                    <router-link to="/resource/quizzes">Quiz</router-link>
                    <router-link to="/resource/assessments">Assessments</router-link>
                    <router-link to="/resource/projects">Projects</router-link>
                    <!--  <a
                      style="font-size:14px;"
                      download="Annual Project Mentorship Manual Final"
                      href="/dynamic/cv_resources/annual_project_manual/annual_project_mentorship_manual_final.pdf"
                      >Annual Project Manual</a
                    >-->
                  </li>

                  <template v-if="$store.getters.getAuthData.auth_role_id != 3">
                    <li class="divider"></li>
                    <li class="dropdown-header">Download Resources</li>
                    <li>
                      <a
                        data-toggle="modal"
                        onclick="showModal('answer_key_modal1')"
                        style="cursor:pointer;color:#333;"
                      >Answer key</a>
                    </li>
                    <li>
                      <a
                        onclick="showModal('lesson_plan_modal1')"
                        style="cursor:pointer;color:#333;"
                      >Lesson plan</a>
                    </li>
                    <template v-if="$store.getters.getAuthData.auth_sch_id == 28">
                      <li class="divider"></li>
                      <li class="dropdown-header">{{ $store.getters.getAuthData.programs.sch_name }}</li>
                    </template>
                    <!--<li>
                      <a
                        data-toggle="modal"
                        data-target="#answer_key_modal"
                        style="cursor:pointer;color:#333;"
                        >Answer key</a
                      >
                    </li>
                    <li>
                      <a
                        data-toggle="modal"
                        data-target="#bridge_course_modal"
                        style="cursor:pointer;color:#333;"
                        >Bridge course</a
                      >
                    </li>
                    <li>
                      <a
                        data-toggle="modal"
                        data-target="#que_bank_modal"
                        style="cursor:pointer;color:#333;"
                        >Question bank</a
                      >
                    </li>
                    <li>
                      <a
                        data-toggle="modal"
                        data-target="#lesson_plan_modal"
                        style="cursor:pointer;color:#333;"
                        >Lesson plan</a
                      >
                    </li>-->
                    <template v-if="$store.getters.getAuthData.auth_sch_id == 28">
                      <li>
                        <a
                          style="font-size:14px;"
                          :download="'Python Grade 8'"
                          :href="
                            '/dynamic/cv_resources/textbooks/PythonGrade_8.pdf'
                          "
                        >Download Python 8 Book</a>
                      </li>
                      <li>
                        <a
                          style="font-size:14px;"
                          :download="'Python Grade 9'"
                          :href="
                            'dynamic/cv_resources/textbooks/PythonGrade_9.pdf'
                          "
                        >Download Python 9 Book</a>
                      </li>
                      <li>
                        <a
                          style="font-size:14px;"
                          :download="'Python Grade 10'"
                          :href="
                            'dynamic/cv_resources/textbooks/PythonGrade_10.pdf'
                          "
                        >Download Python 10 Book</a>
                      </li>
                    </template>
                  </template>
                </ul>
              </li>
              <li
                aria-haspopup="true"
                v-if="user_id&&(sales==1||programs? programs.demo_class_form == 1 ? true : false:false)"
              >
                <a href="#">
                  Demo Session
                  <span class="fe fe-chevron-down m-0"></span>
                </a>
                <ul class="sub-menu">
                  <li>
                    <router-link
                      :to="'/trial-live-courses/register-for-demo-trial-class'"
                    >Demo Session Registration</router-link>
                  </li>
                  <li>
                    <router-link
                      :to="'/trial-live-courses/trial-class-user-management'"
                    >Demo Session Users Management</router-link>
                  </li>
                  <li>
                    <router-link
                      :to="'/trial-live-courses/trial-class-sales-follow-up'"
                    >Demo Session Follow up</router-link>
                    <!--<a @click.prevent="waningMesg"> Trial Class Schedule Class Request</a>-->
                  </li>
                </ul>
              </li>

              <!--resource end-->
              <li aria-haspopup="true" v-if="auth_role_id == 3 && programs.assessment == 1">
                <router-link to="/assessments">Assessments</router-link>
              </li>
              <li aria-haspopup="true" v-if="!user_id">
                <router-link to="/for-parents">For Parents</router-link>
              </li>
              <li aria-haspopup="true" v-if="!user_id">
                <router-link to="for-schools">For Schools</router-link>
              </li>
              <li aria-haspopup="true" v-if="!user_id">
                <router-link to="/why-coding">Why Coding?</router-link>
              </li>
              <li aria-haspopup="true" v-if="!user_id">
                <router-link to="/in-media">In Media</router-link>
              </li>

              <!--<li
                aria-haspopup="true"
                v-if="
                  user_id != 0 && $store.getters.getAuthData.auth_role_id == 3
                "
              >
                <router-link to="/assessments">Assessments</router-link>
              </li>-->

              <li aria-haspopup="true" v-if="!user_id">
                <router-link to="/enquiry">Enquiry</router-link>
              </li>
              <li aria-haspopup="true" v-if="!user_id">
                <router-link to="/contact">Contact Us</router-link>
              </li>
              <!--resource end-->
              <li aria-haspopup="true" class="d-lg-none mt-5 pb-5 mt-lg-0">
                <span>
                  <router-link to="/register" class="btn btn-info">Register Now</router-link>
                </span>
              </li>
            </ul>
            <!--<div id="navbar-coins" v-if="user_id != 0">
              <img src="/assets/images/quiz/coin-animated.svg" />
              <span id="grant_points">{{ coinsEarned }}</span>
            </div>-->
            <div class="pt-3" v-if="user_id != 0">
              <!--<button class="full-user-name bell-icon mr-1">
                  {{name}}
                </button>
                <span>
      <button class="a-bell-icon bell-icon" @click="openNotification($event)">
    <i class="fa fa-bell" ></i>
  </button>
  <span class="badge badge-notify">{{unreadNotification}}</span>
              </span>-->
              <button class="a-profile-icon btn-primary dropdown-toggle" data-toggle="dropdown">
                <i class="fas fa-user"></i>
              </button>
              <ul class="dropdown-menu" role="menu">
                <li>
                  <router-link to>
                    Earned Coins
                    <span class="badge badge-pill badge-primary float-right">
                      {{
                      coinsEarned
                      }}
                    </span>
                  </router-link>
                </li>
                <li>
                  <!--<router-link
                    v-if="userProfile.length"
                    :to="'/profile/' + userProfile[0].username"
                    >Profile</router-link
                  >-->
                  <a
                    v-if="
                      userProfile.length
                        ? userProfile[0].role_id == 3
                          ? true
                          : false
                        : false
                    "
                    @click.prevent="profileSwitch($event)"
                  >Profile</a>
                  <a
                    v-else-if="
                      userProfile.length
                        ? userProfile[0].role_id == 2
                          ? true
                          : false
                        : false
                    "
                    @click.prevent="profileTeacherSwitch($event)"
                  >Profile</a>
                </li>

                <li>
                  <router-link to="/my-quizzes">My Quizzes</router-link>
                </li>
                <li>
                  <router-link to="/quiz-progress">Quiz Performance</router-link>
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

    <!--start cv-resources modal-->
    <!--lesson Plan-->

    <div class="cv-modal normal modal fade" id="lesson_plan_modal1" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content" style="width:100%;">
          <div
            class="modal-header"
            style="background-color:#ec296b; color: #fff;border-top-left-radius:4px;border-top-right-radius:4px;"
          >
            <h3 class="modal-title" style>Download Lesson Plan</h3>
          </div>
          <div class="modal-body lesson-plan-body">
            <p style=" font-size: 16px; color: #444;">Select a grade for lesson plan.</p>
            <div id="ans-key-dl-form" style="display:flex;flex-direction:column;align-items:center">
              <select
                id="grade-select_lessonplan_grade"
                class
                style="height:40px;flex-grow:1;width:100%;"
                v-model="selectedLessonPlanGrade"
              >
                <option selected value="0">Select grade</option>
                <template v-for="(cls, cls_index) in cls_grp">
                  <option
                    v-bind:key="cls_index"
                    v-if="cls.cls_id < 11"
                    :value="cls.cls_id"
                  >Class {{ cls.cls_id }}</option>
                </template>
              </select>
              <p
                v-if="selectedLessonPlanGrade != '0'"
                style="font-size: 16px; color:#444;width:100%;"
              >Select a lesson.</p>
              <select
                id="grade-lesson-plan"
                v-if="selectedLessonPlanGrade != '0'"
                style="height:40px;flex-grow:1;width:100%;"
                :data-lesson="[
                  selectedLessonPlanGrade == '1' ||
                  selectedLessonPlanGrade == '5'
                    ? (lessonplans = 2)
                    : selectedLessonPlanGrade == '2' ||
                      selectedLessonPlanGrade == '3' ||
                      selectedLessonPlanGrade == '6'
                    ? (lessonplans = 2)
                    : (lessonplans = 2)
                ]"
              >
                <option selected value="0">Select lesson</option>

                <option
                  v-for="(lessonplan, l_ind) in lessonplans"
                  v-bind:key="l_ind"
                  :value="lessonplan"
                >Lesson plan {{ lessonplan }}</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary btn-round"
              v-on:click="down_lesson_plan()"
            >Download</button>
            <button
              type="button"
              class="btn btn-secondary"
              onclick="hideModal('lesson_plan_modal1')"
            >Close</button>
          </div>
        </div>
      </div>
    </div>
    <!--end lesson Plan-->
    <!--Answer Key-->
    <!-- Modal -->
    <div class="cv-modal normal modal fade fade" id="answer_key_modal1" role="dialog">
      <div class="modal-dialog" style>
        <!-- Modal content-->
        <div class="modal-content">
          <div
            class="modal-header"
            style="background-color: #ec296b;; color: #fff;border-top-left-radius:4px;border-top-right-radius:4px;"
          >
            <h3 class="modal-title" style>Download Answer Key</h3>
          </div>
          <div class="modal-body">
            <p style="padding: 0; font-size: 16px; color: #444;">Select a grade for Answer key.</p>

            <div id="ans-key-dl-form" style="display:flex;flex-direction:row;align-items:center">
              <select id="grade-select" class style="height:40px;flex-grow:1;">
                <option selected disabled value="0">Select grade</option>
                <template v-for="(cls, c_ind) in cls_grp">
                  <option
                    v-bind:key="c_ind"
                    v-if="cls.cls_id < 11"
                    :value="cls.cls_id"
                  >Class {{ cls.cls_id }}</option>
                </template>
              </select>
              <button
                type="button"
                class="btn btn-primary btn-round mt-0"
                style="height:40px;"
                v-on:click="down()"
              >Download</button>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button "
              class="btn btn-secondary"
              onclick="hideModal('answer_key_modal1')"
            >Close</button>
          </div>
        </div>
      </div>
    </div>

    <!--end modal-->
    <!-- Modal -->
    <!--end ANSWER key -->
    <!--Question Bank-->
    <!--Answer Key-->
    <!-- Modal -->
    <div class="modal fade" id="que_bank_modal" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content" style="width:100%;">
          <div
            class="modal-header"
            style="background-color:#ec296b; color: #fff;border-top-left-radius:4px;border-top-right-radius:4px;"
          >
            <h3 class="modal-title" style>Download Question Bank</h3>
          </div>
          <div class="modal-body">
            <p style=" font-size: 16px; color: #444;">Select a grade for Question Bank.</p>
            <div id="ans-key-dl-form" style="display:flex;flex-direction:row;align-items:center">
              <select id="grade-select_que_bank" class style="height:40px;flex-grow:1;">
                <option selected value="0">Select grade</option>
                <template v-for="(cls, q_cind) in cls_grp">
                  <option
                    :key="q_cind"
                    v-if="cls.cls_id < 9"
                    :value="cls.cls_id"
                  >Class {{ cls.cls_id }}</option>
                </template>
              </select>
            </div>
            <p style=" font-size: 16px; color: #444;">Select a grade for Answer Key.</p>

            <div id="ans-key-dl-form" style="display:flex;flex-direction:row;align-items:center">
              <select id="grade-select_que_bank_answer_key" class style="height:40px;flex-grow:1;">
                <option selected value="0">Select grade</option>
                <template v-for="(cls, a_cind) in cls_grp">
                  <option
                    v-bind:key="a_cind"
                    v-if="cls.cls_id < 9"
                    :value="cls.cls_id"
                  >Class {{ cls.cls_id }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary btn-round"
              v-on:click="down_que_bank()"
            >Download</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!--end modal-->
    <!-- Modal -->

    <!--end ANSWER key -->
    <!--end Question Bank-->
    <!--Bridge Course-->
    <!-- Modal -->
    <div class="modal fade" id="bridge_course_modal" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div
            class="modal-header"
            style="background-color:#ec296b; color: #fff;border-top-left-radius:4px;border-top-right-radius:4px;"
          >
            <h3 class="modal-title" style>Download Bridge Course</h3>
          </div>
          <div class="modal-body">
            <p style="padding: 0 16px; font-size: 16px; color: #444;">Select for Bridge Course.</p>

            <div id="ans-key-dl-form" style="display:flex;flex-direction:row;align-items:center">
              <select id="grade-select-bridge" class style="height:40px;flex-grow:1;">
                <option selected disabled value="0">Select grade</option>
                <option value="4" v-if="cls_grp.findIndex((x) => x.cls_id === 4)">Grade 4</option>
                <option value="6" v-if="cls_grp.findIndex((x) => x.cls_id === 6)">Grade 6</option>
              </select>
              <button
                type="button"
                class="btn btn-primary btn-round mt-0"
                style="height:40px;"
                v-on:click="down_bridge()"
              >Download</button>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!--end modal-->
    <!--end Bridge Course-->
    <!--end cv-resources modal-->
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
      user_id: "",
      headerInitialized: false,
      coinsEarned: 0,
      cls_grp: [],
      selectedLessonPlanGrade: 0,
      lessonplans: 0,
      sch_id: "",
      userProfile: [],
      unreadNotification: 0,
      name: "",
      sales: 0,
      programs: []
    };
  },
  mounted() {
    cvAuth.getUserId(
      function(userId) {
        this.user_id = userId;
        this.auth_role_id = this.$store.getters.getAuthData.auth_role_id;
        this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
        this.programId = this.$store.getters.getAuthData.auth_program_id;
        this.name = this.$store.getters.getAuthData.auth_user_full_name;
        this.programs = this.$store.getters.getAuthData.programs;
        this.sales = this.$store.getters.getAuthData.sales;
        this.grant_points(userId);
        this.getProfileInformation();
        this.cls_loop();
        //this.totalUnreadNoti(userId);
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
    $(".modal-backdrop").hide();
  },
  updated() {
    $(".modal-backdrop").hide();
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
      //this.$router.push({name:'studentdashboard',params:{openProfile:1}})
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
    getProfileInformation: function() {
      this.$http
        .post("/api/profile/getUserInformation", {
          user_id: this.user_id,
          role_id: this.auth_role_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.userProfile = res.body;
          }
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
<style scoped>
.modal-backdrop {
  display: none !important;
}
</style>
<style lang="scss" scoped>
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
</style>
