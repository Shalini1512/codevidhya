<template>
  <div class="container-fluid m-0 p-0">
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
                    <!--  <a href="" class="typewrite" data-period="2000" data-type='[ "Code to Decode your Future" ]'>
                        <span class="wrap"></span>
                </a>-->
                    <h1>Assessment Solution</h1>
                    <p>
                      Assessment solution.
                    </p>
                  </div>
                </div>
                <!--<div class="btn-list col-md-6 row justify-content-end">
              <button class="btn btn-secondary" @click="onCreateNewClick()">
                <i class="fas fa-plus"></i>
                Create new
              </button>
            </div>-->
              </div>
            </div>
          </div>
          <!-- /header-text -->
        </div>
      </section>
    </Header>
    <div class="container-fluid p-4">
      <!-- student details---->
      <div class="card">
        <div class="card-header bg-secondary text-white">
          <h5>Assessment Detail</h5>
        </div>
        <div class="card-body p-0">
          <div class="row">
            <div class="col-sm-12">
              <table class="table card-table table-vcenter text-nowrap">
                <thead class="bg-primary text-white">
                  <tr>
                    
                    <th class="text-white">Assessment Name</th>
                    <th class="text-white">Total Question</th>
                    <th class="text-white">Total Marks</th>
                    <th class="text-white">Your Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                   
                    <td>
                      <h5>{{ asmnt_name }}</h5>
                    </td>
                    <td>
                      <h5>{{ asmnt_tot_que }}</h5>
                    </td>
                    <td>
                      <h5>{{ asmnt_tot_marks }}</h5>
                    </td>
                    <td>
                      <h5>
                        You got
                        <span
                          class="badge badge-success badge-pill py-2 px-3"
                          >{{ student_score }}</span
                        >
                        marks out of
                        <span class="badge badge-danger badge-pill py-2 px-3">{{
                          asmnt_tot_marks
                        }}</span>
                        marks.
                      </h5>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!--end---->
      <!-- Assessment solution---->
      <div class="card">
        <div class="card-header bg-secondary text-white">
          <h5>Assessment Solution</h5>
        </div>
        <div class="card-body p-0">
          <div class="row">
            <div class="col-sm-12">
              <table class="table card-table">
                <thead class="bg-primary text-white">
                  <tr>
                    <th class="text-white">Sr. No.</th>
                    <th class="text-white">Question</th>
                    <th class="text-white">Option1</th>
                    <th class="text-white">Option2</th>
                    <th class="text-white">Option3</th>
                    <th class="text-white">Option4</th>
                    <th class="text-white">Marks</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(std_que, index) in students_detail">
                    <tr :key="index">
                      <td>{{ index + 1 }}</td>
                      <td v-html="std_que.question"></td>
                      <td
                        :class="
                          std_que.true_ans == 'opt1'
                            ? 'bg-success text-white'
                            : std_que.st_ans == 'opt1'
                            ? 'bg-danger text-white'
                            : ''
                        "
                        v-html="std_que.opt1"
                      ></td>
                      <td
                        :class="
                          std_que.true_ans == 'opt2'
                            ? 'bg-success text-white'
                            : std_que.st_ans == 'opt2'
                            ? 'bg-danger text-white'
                            : ''
                        "
                        v-html="std_que.opt2"
                      ></td>
                      <td
                        :class="
                          std_que.true_ans == 'opt3'
                            ? 'bg-success text-white'
                            : std_que.st_ans == 'opt3'
                            ? 'bg-danger text-white'
                            : ''
                        "
                        v-html="std_que.opt3"
                      ></td>
                      <td
                        :class="
                          std_que.true_ans == 'opt4'
                            ? 'bg-success text-white'
                            : std_que.st_ans == 'opt4'
                            ? 'bg-danger text-white'
                            : ''
                        "
                        v-html="std_que.opt4"
                      ></td>
                      <td v-if="std_que.true_ans == std_que.st_ans">
                        {{ std_que.marks }}
                      </td>
                      <td v-else>0</td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!--end---->

      <div class="container-fluid text-white text-center">
        <input
          type="button"
          name="next"
          class="btn btn-primary"
          value="Back to Home"
          v-on:click="back_to_home()"
        />
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import moment from "vue-moment";
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/assessments/HeaderContent.vue";

import Footer from "@/components/footer/Footer.vue";
export default {
  components: { Header, Footer, HeaderContent },
  data() {
    return {
      cls_id: this.$store.getters.getAuthData.auth_cls_id,
      user_id: this.$store.getters.getAuthData.auth_user_id,
      sec_id: this.$store.getters.getAuthData.auth_sec_id,
      role_id: this.$store.getters.getAuthData.auth_role_id,
      sch_id: this.$store.getters.getAuthData.auth_sch_id,
      st_id: this.$store.getters.getAuthData.auth_st_id,
      st_name: "",
      name: "",
      token: "",
      cls_name: "",
      asmnt_id: "",
      asmnt_name: "",
      asmnt_tot_que: "",
      asmnt_tot_marks: "",
      assessments: [],
      cv_assessment: [],
      classes: [],
      students: [],
      st_tot_marks: 0,
      students_detail: [],
      student_obtained: [],
      que: [],
      student_score: ""
    };
  },
  beforeCreate() {},
  created() {
    if (this.$route.query.assessment) {
      var query = atob(this.$route.query.assessment);
      var params = query.split(",");
      this.asmnt_id = params[0];
      this.st_id = params[1];
      this.cls_id = params[2];
      this.load_assessments();
      //this.assessments_students();
      this.students_assessment();
    }
  },
  beforeMount() {
    this.load_assessments();
    //this.assessments_students();
    this.students_assessment();
  },
  mounted: function() {
    var vm = this;
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.cls_id = this.$store.getters.getAuthData.auth_cls_id;
          this.user_id = this.$store.getters.getAuthData.auth_user_id;
          this.sec_id = this.$store.getters.getAuthData.auth_sec_id;
          this.role_id = this.$store.getters.getAuthData.auth_role_id;
          this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
          this.st_name = this.$store.getters.getAuthData.auth_user_full_name;
          this.load_assessments();
         // this.assessments_students();
          this.students_assessment();
        }
      }.bind(this)
    );
  },

  methods: {
    back_to_home: function() {
      this.$router.push({ path: "/assessments" });
    },
    load_assessments: function() {
      this.$http
        .post("/api/user/DisplayAssessment", {
          sch_id: this.sch_id,
          user_id: this.user_id,
          role_id: this.role_id,
          cls_id: this.cls_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            if (this.role_id == 3) {
              this.assessments = res.body.data;
            } else {
              this.assessments = res.body.assessments;
              this.cv_assessments = res.body.cv_assessments;
            }

            for (var i = 0; i < this.assessments.length; i++) {
              if (this.assessments[i].assessment_id == this.asmnt_id) {
                this.asmnt_tot_que = this.assessments[i].tot_que;
                this.asmnt_tot_marks = this.assessments[i].tot_marks;
                this.asmnt_name = this.assessments[i].assessment_name;
                break;
              }
            }
            for (var i = 0; i < this.cv_assessments.length; i++) {
              if (this.cv_assessments[i].assessment_id == this.asmnt_id) {
                this.asmnt_tot_que = this.cv_assessments[i].tot_que;
                this.asmnt_tot_marks = this.cv_assessments[i].tot_marks;
                this.asmnt_name = this.cv_assessments[i].assessment_name;
                break;
              }
            }
          }
        });
    },
    /*assessments_students: function() {
      this.$http
        .post("/api/user/Assessment_students", {
          sch_id: this.sch_id,
          assessment_id: this.asmnt_id,
          cls_id: this.cls_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.students = res.body.students;
            for (var i = 0; i < this.students.length; i++) {
              if (this.students[i].user_id == this.st_id) {
                this.st_name = this.students[i].name;
                this.cls_name = this.students[i].cls_name;
                this.sec_id = this.students[i].sec_name;
                break;
              }
            }
          }
        });
    },*/
    students_assessment: function() {
      this.$http
        .post("/api/user/Student_assessment_solution", {
          user_id: this.st_id,
          assessment_id: this.asmnt_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.students_detail = res.body.students_detail;
            this.student_score = res.body.students_score[0].score;
          }
        });
    }
  }
};
</script>

<style></style>
