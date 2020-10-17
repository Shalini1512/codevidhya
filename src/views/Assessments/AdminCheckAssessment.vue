<template>
  <div id="projects-root">
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
                    <h3>Check Assessment</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Header>
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-12 col-lg-12 col-md-12 pt-4">
          <div class="row">
            <div class="col-sm-12">
              <table class="table table-vcenter text-wrap table-secondary">
                <thead class="bg-secondary text-white">
                  <tr>
                    <th class="text-white">Student Name</th>
                    <th class="text-white" v-if="asmntType != 2">Grade</th>
                    <th class="text-white" v-if="asmntType != 2">
                      Section
                    </th>
                    <th class="text-white">Assessment Name</th>
                    <th class="text-white">Total Question</th>
                    <th class="text-white">Total Marks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ st_name }}</td>
                    <td v-if="asmntType != 2">{{ cls_name }}</td>
                    <td v-if="asmntType != 2">{{ sec_name }}</td>
                    <td>{{ asmnt_name }}</td>
                    <td>{{ asmnt_tot_que }}</td>
                    <td>{{ asmnt_tot_marks }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-sm-12">
              <table class="table table-vcenter text-wrap table-secondary">
                <thead class="bg-secondary text-white">
                  <tr>
                    <th class="text-white">Sr.No.</th>
                    <th class="text-white">Question</th>
                    <th class="text-white">True Ans</th>
                    <th class="text-white">Student Ans</th>
                    <th class="text-white">Marks</th>
                    <th class="text-white">Obtain Marks</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(std_que, index) in students_detail">
                    <tr :key="index">
                      <td>{{ index + 1 }}</td>
                      <td v-html="std_que.question"></td>
                      <td>{{ std_que.true_ans }}</td>
                      <td>{{ std_que.st_ans }}</td>
                      <td>{{ std_que.marks }}</td>
                      <td v-if="std_que.true_ans == ''">
                        <input
                          type="text"
                          class="form-control"
                          v-bind:name="std_que.marks"
                          v-bind:id="std_que.que_id"
                          v-on:keyup="update_marks"
                        />
                      </td>
                      <td v-else-if="std_que.true_ans == std_que.st_ans">
                        {{ std_que.marks }}
                      </td>
                      <td v-else>0</td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <div
              class="col-sm-12 col-md-12 d-flex justify-content-center align-items-center"
            >
              <input
                type="button"
                name="next"
                class="btn btn-warning mr-1"
                value="Back"
                v-on:click="back_to_home()"
              />
              <input
                type="button"
                name="next"
                class="btn btn-warning mr-1"
                value="Generate Report"
                v-on:click="generate_report()"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "vue-moment";
import Header from "@/components/header/HeaderMenuForAdmin.vue";

export default {
  components: {
    Header
  },
  data() {
    return {
      userId: 0,
      st_id: "",
      cls_id: "",
      user_id: "",
      sec_id: "",
      role_id: "",
      sch_id: "",
      st_name: "",
      user_name: "",
      cls_name: "",
      name: "",
      sec_name: "",
      asmnt_id: "",
      asmnt_name: "",
      asmnt_tot_que: "",
      asmnt_tot_marks: "",
      assessments: [],
      classes: [],
      students: [],
      st_tot_marks: 0,
      students_detail: [],
      student_obtained: [],
      que: [],
      asmntType: "",
      report_sch_id: ""
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted: function() {
    if (this.$route.query.assessment) {
      var query = atob(this.$route.query.assessment);
      var params = query.split(",");
      this.asmnt_id = params[0];
      this.st_id = params[1];
      this.report_sch_id = params[2];
      this.asmntType = params[3];
      this.assessmentStudents();
      this.assessmentQuestionDetail();
    }
    this.load_assessments();
  },
  methods: {
    back_to_home: function() {
      this.$router.push({ path: "/admin-assessments", query: {} });
    },
    load_assessments: function() {
      this.$http
        .post("/api/user/DisplayAssessment", {
          sch_id: this.sch_id,
          user_id: this.$store.getters.getAuthData.auth_user_id,
          role_id: this.$store.getters.getAuthData.auth_role_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.assessments = res.body.assessments;
            for (var i = 0; i < this.assessments.length; i++) {
              if (this.assessments[i].assessment_id == this.asmnt_id) {
                this.asmnt_tot_que = this.assessments[i].tot_que;
                this.asmnt_tot_marks = this.assessments[i].tot_marks;
                this.asmnt_name = this.assessments[i].assessment_name;
                break;
              }
            }
          }
        });
    },
    assessmentStudents: function() {
      this.$http
        .post("/api/user/Assessment_students", {
          sch_id: this.report_sch_id,
          assessment_id: this.asmnt_id,
          cls_id: this.cls_id,
          asmntType: this.asmntType
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
                this.sec_name = this.students[i].sec_name;
                this.sec_id = this.students[i].sec_id;
              }
            }
          }
        });
    },

    assessmentQuestionDetail: function() {
      this.$http
        .post("/api/user/Student_assessment_detail", {
          user_id: this.st_id,
          assessment_id: this.asmnt_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.students_detail = res.body.students_detail;
            for (var i = 0; i < this.students_detail.length; i++) {
              if (
                this.students_detail[i].st_ans ==
                  this.students_detail[i].true_ans &&
                this.students_detail[i].st_ans != ""
              ) {
                this.student_obtained.push({
                  user_id: this.st_id,
                  assessment_id: this.asmnt_id,
                  que_id: this.students_detail[i].que_id,
                  marks: this.students_detail[i].marks
                });
              } else {
                this.student_obtained.push({
                  user_id: this.st_id,
                  assessment_id: this.asmnt_id,
                  que_id: this.students_detail[i].que_id,
                  marks: 0
                });
              }
            }
          }
        });
    },
    update_marks: function(event) {
      var input = event.target;
      if (parseInt(input.value) <= parseInt(input.name) && input.value != "") {
        for (var i = 0; i < this.student_obtained.length; i++) {
          if (this.student_obtained[i].que_id == input.id) {
            this.student_obtained[i].marks = input.value;
          }
        }
      } else if (input.value != "") {
        cvNotify("Obtain marks exceeds to question marks.", "danger");
        for (var i = 0; i < this.student_obtained.length; i++) {
          if (this.student_obtained[i].que_id == input.id) {
            this.student_obtained[i].marks = 0;
          }
        }
      } else if (input.value == "") {
        for (var i = 0; i < this.student_obtained.length; i++) {
          if (this.student_obtained[i].que_id == input.id) {
            this.student_obtained[i].marks = 0;
          }
        }
      }
    },
    generate_report: function() {
      this.$http
        .post("/api/user/Assessment_marks", {
          user_id: this.st_id,
          assessment_id: this.asmnt_id,
          cls_id: this.cls_id,
          sch_id: this.report_sch_id,
          obtain_marks: this.student_obtained
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            if (res.body.data == "done") {
              this.calculateResult();
            }
          }
        });
    },
    calculateResult: function() {
      this.$http
        .post("/api/user/Assessment_result", {
          user_id: this.st_id,
          assessment_id: this.asmnt_id,
          cls_id: this.cls_id,
          sec_id: this.sec_id,
          sch_id: this.report_sch_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            if (res.body.data == "done") {
              cvNotify("Result calculated successfully");
              window.close();
            }
          }
        });
    }
  }
};
</script>
<style></style>
