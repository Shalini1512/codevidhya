<template>
  <div
    class="cover-image bg-background3"
    data-image-src="/assets/images/banners/banner2.jpg"
  >
    <div class="header-main menu-only">
      <!-- Mobile Header -->
      <div class="horizontal-header clearfix">
        <div class="container">
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
                src="/assets/images/png/codevidhya_reverse_logo.png"
                width="120"
                alt="img"
              />
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
              <!--<li aria-haspopup="true">
                <router-link to="/">Home</router-link>
              </li>-->
              <li aria-haspopup="true">
                <router-link to="/admin-dashboard">Dashboard</router-link>
              </li>
              <li aria-haspopup="true">
                <a href="#"
                  >School
                  <span class="fe fe-chevron-down m-0"></span>
                </a>
                <ul class="sub-menu">
                  <li>
                    <router-link
                      :to="'/admin-school-registration'"
                      class="d-flex border-bottom"
                      >Register</router-link
                    >
                  </li>
                  <li>
                    <router-link
                      to="/admin-school-details"
                      class="d-flex border-bottom"
                      >School Details</router-link
                    >
                  </li>
                  <li>
                    <router-link to="/assigngradestoschool"
                      >Assign Grades To School</router-link
                    >
                  </li>
                  <li>
                    <a
                      class="d-flex border-bottom cursor-pointer"
                      @click.prevent="download_sheet()"
                    >
                      Download Annual Program Sheet</a
                    >
                  </li>
                  <li>
                    <a
                      class="d-flex border-bottom cursor-pointer"
                      @click="download_after_school_scheet()"
                      >Download After School Program sheet</a
                    >
                  </li>
                </ul>
              </li>
              <li aria-haspopup="true">
                <a href="#"
                  >Staff
                  <span class="fe fe-chevron-down m-0"></span>
                </a>
                <ul class="sub-menu">
                  <li>
                    <router-link
                      :to="'/admin-staff-registrations'"
                      class="d-flex border-bottom"
                      >Register</router-link
                    >
                  </li>
                  <li>
                    <router-link
                      to="/admin-staff-details"
                      class="d-flex border-bottom"
                      >Staff Details</router-link
                    >
                  </li>
                  <li>
                    <router-link to="/assigngradestoteachers"
                      >Assign Grades To Teachers</router-link
                    >
                  </li>
                </ul>
              </li>
              <li aria-haspopup="true">
                <a href="#"
                  >Student
                  <span class="fe fe-chevron-down m-0"></span>
                </a>
                <ul class="sub-menu">
                  <li>
                    <router-link
                      :to="'/admin-student-registrations'"
                      class="d-flex border-bottom"
                      >Register</router-link
                    >
                  </li>
                  <li>
                    <router-link
                      to="/admin-student-details"
                      class="d-flex border-bottom"
                      >Student Details</router-link
                    >
                  </li>
                  <li>
                    <router-link
                      to="/admin-student-activation"
                      class="d-flex border-bottom"
                      >Activate Student</router-link
                    >
                  </li>
                  <li>
                    <router-link
                      to="/admin-promote-students"
                      class="d-flex border-bottom"
                      >Promote Students</router-link
                    >
                  </li>
              
                </ul>
              </li>

              <li aria-haspopup="true">
                <router-link to="/quiz-admin">Quiz</router-link>
              </li>
              <li aria-haspopup="true">
                <a href="#"
                  >Courses<span class="fe fe-chevron-down m-0"></span
                ></a>
                <ul class="sub-menu">
                  <li aria-haspopup="true">
                    <router-link to="/course-builder"
                      >Course Builder</router-link
                    >
                  </li>
                  <li aria-haspopup="true">
                    <router-link to="/other-course"
                      >Learn@Home Upload</router-link
                    >
                  </li>
                  <li>
                    <router-link
                      :to="'/admin-live-courses/register-for-demo-trial-class'"
                      class="d-flex border-bottom"
                      >Register Users For Live Demo Class</router-link
                    >
                  </li>
                </ul>
              </li>

              <li aria-haspopup="true">
                <router-link to="/admin-assessments">Assessments</router-link>
              </li>
              <li aria-haspopup="true">
                <a href="#">Projects<span class="fe fe-chevron-down m-0"></span></a>
                <ul class="sub-menu">
                  <li>
                <router-link to="/admin/code-challenge"
                  >Code Challenge</router-link
                >
              </li>
              <li>
                <router-link to="/admin/annual-project"
                  >Annual Project</router-link
                >
              </li>
                </ul>
              </li>
                     <li aria-haspopup="true">
                <a href="#">Trainers/Sales<span class="fe fe-chevron-down m-0"></span></a>
                <ul class="sub-menu">
                  <li>
                <router-link to="/admin-trainer/add-new-trainer"
                  >Add Trainer</router-link
                >
              </li>
              <li>
                <router-link to="/admin-trainer/trainer-management"
                  >Trainers Management</router-link
                >
              </li>
              <li>
                <router-link to="/admin-sales/sales-live-course-management"
                  >Sales Management</router-link
                >
              </li>
              <li>
               <router-link to="/admin-sales/assign-new-sales-lead">
               Add New Sales Lead
               </router-link>

              </li>
              <li>
               <router-link to="/admin-sales/trial-class-sales-followup">
               Sales Followup
               </router-link>

              </li>
                </ul>
              </li>
            
              <li aria-haspopup="true">
               <a href="#">Coupons<span class="fe fe-chevron-down m-0"></span></a>
               <ul class="sub-menu">
                  <li>
                <router-link to="/admin/coupon-for-individual"
                  >Coupons For Individual</router-link
                >
              </li>
               </ul>
              </li>
                              

            </ul>

            <div class="d-flex align-items-center px-1" v-if="user_id != 0">
              <button
                class="a-profile-icon btn-primary dropdown-toggle"
                data-toggle="dropdown"
              >
                <i class="fas fa-user"></i>
              </button>
              <ul class="dropdown-menu" role="menu">
                <li><a href="#" @click="doLogout()">Logout</a></li>
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
    <div class="modal fade" id="lesson_plan_modal" role="dialog">
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
            <p style=" font-size: 16px; color: #444;">
              Select a grade for lesson plan.
            </p>
            <div
              id="ans-key-dl-form"
              style="display:flex;flex-direction:column;align-items:center"
            >
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
                    v-if="cls.cls_id < 9"
                    :value="cls.cls_id"
                    >Class {{ cls.cls_id }}</option
                  >
                </template>
              </select>
              <p
                v-if="selectedLessonPlanGrade != '0'"
                style="font-size: 16px; color:#444;width:100%;"
              >
                Select a lesson.
              </p>
              <select
                id="grade-lesson-plan"
                v-if="selectedLessonPlanGrade != '0'"
                style="height:40px;flex-grow:1;width:100%;"
                :data-lesson="[
                  selectedLessonPlanGrade == '1' ||
                  selectedLessonPlanGrade == '5'
                    ? (lessonplans = 10)
                    : selectedLessonPlanGrade == '2' ||
                      selectedLessonPlanGrade == '3' ||
                      selectedLessonPlanGrade == '6'
                    ? (lessonplans = 9)
                    : (lessonplans = 11)
                ]"
              >
                <option selected value="0">Select grade</option>

                <option
                  v-for="(lessonplan, l_ind) in lessonplans"
                  v-bind:key="l_ind"
                  :value="lessonplan"
                  >lesson plan {{ lessonplan }}</option
                >
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary btn-round"
              v-on:click="down_lesson_plan()"
            >
              Download
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--end lesson Plan-->
    <!--Answer Key-->
    <!-- Modal -->
    <div class="modal fade" id="answer_key_modal" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div
            class="modal-header"
            style="background-color: #ec296b;; color: #fff;border-top-left-radius:4px;border-top-right-radius:4px;"
          >
            <h3 class="modal-title" style>Download Answer Key</h3>
          </div>
          <div class="modal-body">
            <p style="padding: 0; font-size: 16px; color: #444;">
              Select a grade for Answer key.
            </p>

            <div
              id="ans-key-dl-form"
              style="display:flex;flex-direction:row;align-items:center"
            >
              <select id="grade-select" class style="height:40px;flex-grow:1;">
                <option selected disabled value="0">Select grade</option>
                <template v-for="(cls, c_ind) in cls_grp">
                  <option
                    v-bind:key="c_ind"
                    v-if="cls.cls_id < 10"
                    :value="cls.cls_id"
                    >Class {{ cls.cls_id }}</option
                  >
                </template>
              </select>
              <button
                type="button"
                class="btn btn-primary btn-round mt-0"
                style="height:40px;"
                v-on:click="down()"
              >
                Download
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button "
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
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
            <p style=" font-size: 16px; color: #444;">
              Select a grade for Question Bank.
            </p>
            <div
              id="ans-key-dl-form"
              style="display:flex;flex-direction:row;align-items:center"
            >
              <select
                id="grade-select_que_bank"
                class
                style="height:40px;flex-grow:1;"
              >
                <option selected value="0">Select grade</option>
                <template v-for="(cls, q_cind) in cls_grp">
                  <option
                    :key="q_cind"
                    v-if="cls.cls_id < 9"
                    :value="cls.cls_id"
                    >Class {{ cls.cls_id }}</option
                  >
                </template>
              </select>
            </div>
            <p style=" font-size: 16px; color: #444;">
              Select a grade for Answer Key.
            </p>

            <div
              id="ans-key-dl-form"
              style="display:flex;flex-direction:row;align-items:center"
            >
              <select
                id="grade-select_que_bank_answer_key"
                class
                style="height:40px;flex-grow:1;"
              >
                <option selected value="0">Select grade</option>
                <template v-for="(cls, a_cind) in cls_grp">
                  <option
                    v-bind:key="a_cind"
                    v-if="cls.cls_id < 9"
                    :value="cls.cls_id"
                    >Class {{ cls.cls_id }}</option
                  >
                </template>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary btn-round"
              v-on:click="down_que_bank()"
            >
              Download
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
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
            <p style="padding: 0 16px; font-size: 16px; color: #444;">
              Select for Bridge Course.
            </p>

            <div
              id="ans-key-dl-form"
              style="display:flex;flex-direction:row;align-items:center"
            >
              <select
                id="grade-select-bridge"
                class
                style="height:40px;flex-grow:1;"
              >
                <option selected disabled value="0">Select grade</option>
                <option
                  value="4"
                  v-if="cls_grp.findIndex((x) => x.cls_id === 4)"
                  >Grade 4</option
                >
                <option
                  value="6"
                  v-if="cls_grp.findIndex((x) => x.cls_id === 6)"
                  >Grade 6</option
                >
              </select>
              <button
                type="button"
                class="btn btn-primary btn-round mt-0"
                style="height:40px;"
                v-on:click="down_bridge()"
              >
                Download
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
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
import JsonExcel from "vue-json-excel";
import Loader from "@/components/widgets/BlockingLoader.vue";
export default {
  mixins: [AuthMixin],
  components: {
    downLoadExcel: JsonExcel
  },
  data() {
    return {
      auth_role_id: 0,
      user_id: null,
      headerInitialized: false,
      coinsEarned: 0,
      cls_grp: [],
      selectedLessonPlanGrade: 0,
      lessonplans: 0,
      sch_id: ""
    };
  },
  mounted() {
    cvAuth.getUserId(
      function(userId) {
        this.user_id = userId;
        this.auth_role_id = this.$store.getters.getAuthData.auth_role_id;
        this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
        this.grant_points(userId);
        this.cls_loop();
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
    download_after_school_scheet: function() {
      this.$http
        .post(
          "/api/adminadterschooldatamanipulation/downloadRecordFile",
          { sch_id: 0 },
          { responseType: "blob" }
        )
        .then((res) => {
          let blob = new Blob([res.body], {
            type: res.headers.get("content-type")
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "SchoolRecord.xlsx";
          link.click();
        });
    },
    download_sheet: function() {
      this.$http
        .post(
          "/api/adminschooldatamanipulation/downloadRecordFile",
          { sch_id: 0 },
          { responseType: "blob" }
        )
        .then((res) => {
          let blob = new Blob([res.body], {
            type: res.headers.get("content-type")
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "SchoolRecord.xlsx";
          link.click();
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
              /*    for (var i = 0; i < points.length; i++) {
                grant_p = grant_p + points[i].obtained;
              }*/
              this.coinsEarned = Math.floor(points[0].coin_earned);
            }
          }
        });
    },
    onLoginPage() {
      var pathName = window.location.pathname;
      //return ~pathName.indexOf("/login") || ~pathName.indexOf("/register");
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
.dropdown-toggle::after {
  display: none;
}
</style>
