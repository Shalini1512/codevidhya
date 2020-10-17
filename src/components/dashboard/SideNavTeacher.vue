<template>
  <div class="col-md-3">
    <div>
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">My Dashboard</h3>
        </div>
        <div class="card-body text-center item-user border-bottom">
          <div class="profile-pic">
            <div class="profile-pic-img">
              <span
                class="bg-success dots"
                data-toggle="tooltip"
                data-placement="top"
                title="online"
              ></span>
              <img
                :src="
                  userProfile.length
                    ? userProfile[0].profile_pic
                      ? userProfile[0].profile_pic
                        ? '/static/profiles/' + userProfile[0].profile_pic
                        : '/assets/images/users/user.svg'
                      : '/assets/images/users/user.svg'
                    : '/assets/images/users/user.svg'
                "
                class="brround"
                alt="user"
              />
            </div>
            <span class="text-center"> </span>
            <h4 class="mt-5 mb-0 font-weight-semibold text-dark">
              {{
                userProfile.lenght
                  ? userProfile[0].name
                    ? userProfile[0].name
                    : ""
                  : ""
              }}
            </h4>
          </div>
        </div>
        <div class="item1-links mb-0">
          <!--<a href="#" class="d-flex border-bottom"  @click.prevent="moveToProfile($event)">
          <span class="icon1 mr-3">
            <i class="far fa-id-card"></i>
          </span> 
          Profile
        </a>-->
          <div class="dropdown show" v-if="role_id == 2">
            <a
              class="d-flex border-bottom dropdown-toggle"
              data-toggle="dropdown"
              id="student-dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span class="icon1 mr-3">
                <i class="fas fa-user"></i>
              </span>
              Students' Profile
              <i class="flex-fill"></i>
            </a>
            <ul
              class="dropdown-menu w-100 m-0"
              role="menu"
              aria-labelledby="student-dropdown"
            >
              <router-link to="/profile-setting" class="d-flex border-bottom"
                >Profile Setting</router-link
              >

              <router-link
                to="/assessment-questions"
                class="d-flex border-bottom"
                >Monitoring</router-link
              >
            </ul>
          </div>
          <router-link to="/courses" class="d-flex border-bottom">
            <span class="icon1 mr-3">
              <i class="fas fa-book-reader"></i>
            </span>
            Courses
          </router-link>
          <!--<a href="#" class="d-flex border-bottom" @click.prevent="updateuserProfile('mycourses',$event)">
          <span class="icon1 mr-3">
            <i class="fas fa-book-reader"></i>
          </span>
          Courses
        </a>-->
          <!--<template v-if="((sch_id!==1)&& (role_id===3)) &&(curriculum.length) ">
        <router-link class="d-flex border-bottom" :to ="{name: 'course-details',params: { curName: curriculum[0].slug, bookId: curriculum[0].book_id, book_per: curriculum[0].per}}">
          <span class="icon1 mr-3">
            <i class="fas fa-book-reader"></i>
          </span>
          Institute Curriculum
        </router-link>
        </template>-->

          <!--<div v-if="((sch_id!==1)&& (role_id===2))&&(curriculum.length) " id="accordion2" class="item1-links">
          <a
            class="accordion-toggle collapsed d-flex border-bottom"
            data-toggle="collapse"
            data-parent="#accordion2"
            :href="'#collapse2'"
            aria-expanded="false"
          >
            <span class style="display:flex;">
               <span class="icon1 mr-3">
            <i class="fas fa-book-reader"></i>
          </span>
              Institute Curriculum
            </span>
          </a>
          <div
            id="collapse2"
            class="panel-collapse collapse cursor-pointer active"
            role="tabpanel"
            aria-expanded="false"
          >
          
          <template v-for="(cur,c_key) in curriculum">
             <router-link :key="c_key" class="d-flex border-bottom pl-7" :to ="{name: 'course-details',params: { curName: cur.slug, bookId: cur.book_id, book_per: cur.per}}">{{cur.book_name}}</router-link>
            

          </template>
       
  </div>
        </div>-->

          <div class="dropdown show" v-if="role_id == 2">
            <a
              class="d-flex border-bottom dropdown-toggle"
              data-toggle="dropdown"
              id="assessment-dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span class="icon1 mr-3">
                <i class="fas fa-clipboard-list"></i>
              </span>
              Assessments
              <i class="flex-fill"></i>
            </a>
            <ul
              class="dropdown-menu w-100 m-0"
              role="menu"
              aria-labelledby="assessment-dropdown"
            >
              <router-link
                :to="{
                  name: 'instituteassessments'
                }"
                class="d-flex border-bottom"
                v-if="role_id == 2"
                >All Assessments</router-link
              >
              <router-link
                to="/assessment-questions"
                class="d-flex border-bottom"
                >Assessment Questions</router-link
              >
              <router-link to="/assessment-report" class="d-flex border-bottom"
                >Assessment Report</router-link
              >
            </ul>
          </div>
          <!-- <router-link to="/assessments" class="d-flex border-bottom" v-if="role_id == 3">
          <span class="icon1 mr-3">
            <i class="fas fa-clipboard-list"></i>
          </span>
          Assessments
        </router-link>-->
          <a
            href="#"
            v-if="role_id == 3"
            class="d-flex border-bottom"
            @click.prevent="updateuserProfile('assessments', $event)"
          >
            <span class="icon1 mr-3">
              <i class="fas fa-clipboard-list"></i>
            </span>
            Assessments
          </a>

          <router-link to="/projects" class="d-flex border-bottom">
            <span class="icon1 mr-3">
              <i class="fas fa-folder-open"></i>
            </span>
            Projects
          </router-link>
          <!--<a href="#" class="d-flex border-bottom" @click.prevent="updateuserProfile('projects',$event)">
          <span class="icon1 mr-3">
            <i class="fas fa-folder-open"></i>
          </span>
          Projects
        </a>-->
          <router-link to="/quizzes" class="d-flex border-bottom">
            <span class="icon1 mr-3">
              <i class="fas fa-edit"></i>
            </span>
            Quizzes
          </router-link>
          <!--   <a href="#" class="d-flex border-bottom" @click.prevent="updateuserProfile('quizzes',$event)">
          <span class="icon1 mr-3">
            <i class="fas fa-folder-open"></i>
          </span>
          Quizzes
        </a>-->
          <!--<router-link to="/quickbook" class="d-flex border-bottom">
          <span class="icon1 mr-3">
            <i class="fas fa-book"></i>
          </span> Quickbook
        </router-link>-->
          <!--resourse start-->
          <div v-if="programId != 2" id="accordion2" class="item1-links">
            <a
              class="accordion-toggle collapsed d-flex border-bottom"
              data-toggle="collapse"
              data-parent="#accordion2"
              :href="'#collapse1'"
              aria-expanded="false"
              @click="updateuserProfile('quizzes', $event)"
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
              class="panel-collapse collapse cursor-pointer active"
              role="tabpanel"
              aria-expanded="false"
            >
              <a
                class="d-flex border-bottom pl-7"
                download="Annual Project Mentorship Manual Final"
                href="/dynamic/cv_resources/annual_project_manual/annual_project_mentorship_manual_final.pdf"
              >
                Annual Project Manual
              </a>
              <template v-if="$store.getters.getAuthData.auth_role_id != 3">
                <a
                  data-toggle="modal"
                  data-target="#answer_key_modal"
                  class="d-flex border-bottom pl-7"
                  >Answer key</a
                >

                <a
                  data-toggle="modal"
                  data-target="#bridge_course_modal"
                  class="d-flex border-bottom pl-7"
                  >Bridge course</a
                >

                <a
                  data-toggle="modal"
                  data-target="#que_bank_modal"
                  class="d-flex border-bottom pl-7"
                  >Question bank</a
                >

                <a
                  data-toggle="modal"
                  data-target="#lesson_plan_modal"
                  class="d-flex border-bottom pl-7"
                  >Lesson plan</a
                >

                <template v-if="$store.getters.getAuthData.auth_sch_id == 28">
                  <a
                    class="d-flex border-bottom pl-7"
                    :download="'Python Grade 8'"
                    :href="'/dynamic/cv_resources/textbooks/PythonGrade_8.pdf'"
                    >Download Python 8 Book</a
                  >

                  <a
                    class="d-flex border-bottom pl-7"
                    :download="'Python Grade 9'"
                    :href="'dynamic/cv_resources/textbooks/PythonGrade_9.pdf'"
                    >Download Python 9 Book</a
                  >

                  <a
                    class="d-flex border-bottom pl-7"
                    :download="'Python Grade 10'"
                    :href="'dynamic/cv_resources/textbooks/PythonGrade_10.pdf'"
                    >Download Python 10 Book</a
                  >
                </template>
              </template>
            </div>
          </div>
          <!--resourse end-->

          <router-link to="/notifications" class="d-flex border-bottom">
            <span class="icon1 mr-3">
              <i class="fas fa-bell"></i>
            </span>
            Notifications
          </router-link>
          <!--<a href="#" class="d-flex border-bottom" @click.prevent="moveToNoti($event)">
          <span class="icon1 mr-3">
           <i class="fas fa-bell"></i>
          </span>
          Notifications
        </a>-->
          <!-- <a href="#" class="d-flex border-bottom" @click="doLogout()">
          <span class="icon1 mr-3">
            <i class="fas fa-power-off"></i>
          </span>
          Logout
        </a>-->
        </div>
      </div>
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
                  <option selected value="0">Select lesson</option>

                  <option
                    v-for="(lessonplan, l_ind) in lessonplans"
                    v-bind:key="l_ind"
                    :value="lessonplan"
                    >Lesson plan {{ lessonplan }}</option
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
                <select
                  id="grade-select"
                  class
                  style="height:40px;flex-grow:1;"
                >
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
                    v-if="cls_grp.findIndex(x => x.cls_id === 4)"
                    >Grade 4</option
                  >
                  <option
                    value="6"
                    v-if="cls_grp.findIndex(x => x.cls_id === 6)"
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
  </div>
</template>

<script>
import AuthMixin from "@/mixins/AuthMixin.js";
import axios from "axios";

export default {
  mixins: [AuthMixin],
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
      edit: 0
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
          //console.log(this.role_id);
          this.getProfileInformation();
          this.cls_loop();
          this.course_for_user(userId, this.role_id);
        }
      }.bind(this)
    );
  },
  methods: {
    updateuserProfile(profile_name, event) {
      this.$emit("updatedDashboard", profile_name, event);
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
            //vm.$router.push("/login");
          } else {
            vm.userProfile = res.data;
          }
        });
    },
    moveToNoti(e) {
      let vm = this;
      $(".item1-links > a").removeClass("active");
      $(e.toElement).addClass("active");
      this.$emit("updateAgainNoti", e);
    },
    moveToProfile(e) {
      let vm = this;
      $(".item1-links > a").removeClass("active");
      $(e.toElement).addClass("active");
      if (vm.role_id == 3) {
        this.$emit("updateAgainEdit", e);
      }
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
