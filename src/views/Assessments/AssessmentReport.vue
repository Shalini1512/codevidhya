<!--:style="'height:'+windowHegiht+'px !important;'"-->
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
                    <h2>Assessment Report</h2>
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
        <div class="col-xl-12 col-lg-12 col-md-12">
          <div class="card">
            <div class="card-header bg-secondary">
              <h3 class="card-title  text-white w-auto">Assessment Report</h3>
              <i class="flex-fill"></i>
            </div>
            <div class="card-body">
              <div class="row p-2 row">
                <div class="col-sm-3 mb-2">
                  <select
                    class="form-control border border-dark"
                    v-model="asmnt_id"
                    id="asmnt_id"
                    name="asmnt_id"
                    v-on:change="load_assessments_classes(asmnt_id)"
                  >
                    <option value="0" selected>Select Assessment</option>
                    <template v-for="(cvassessment, index) in cv_assessments">
                      <option
                        :key="index"
                        v-if="cvassessment.role_id == 3"
                        v-bind:value="cvassessment.assessment_id"
                        >{{ cvassessment.assessment_name }}</option
                      >
                    </template>
                  </select>
                </div>
                <div class="col-sm-2 mb-2">
                  <select
                    class="form-control border border-dark"
                    v-if="asmnt_id != 0"
                    v-model="asmnt_cls_id"
                    id="cls_id"
                    name="cls_id"
                    v-on:change="assessments_students()"
                  >
                    <option value="0" selected>Select Grade</option>
                    <option
                      v-for="(cls, index) in asmnt_classes"
                      v-bind:value="cls.cls_id"
                      :key="index"
                    >
                      {{ cls.cls_name }}</option
                    >
                  </select>
                </div>
                <i class="flex-fill" />
                <div class="col-sm-4 mb-2">
                  <div class="badge badge-dark w-100" style="font-size:12px;">
                    <table
                      class="w-100 text-nowrap table-bordered border-top m-0"
                      v-if="students.length"
                    >
                      <tr>
                        <th>Total students</th>
                        <th>Attempted</th>
                        <th>Not Attempted</th>
                      </tr>
                      <tr>
                        <td>{{ students.length }}</td>
                        <td>{{ students.length - st_count }}</td>
                        <td>{{ st_count }}</td>
                      </tr>
                    </table>
                  </div>
                </div>
                <div class="col-sm-12 pl-2 pt-2 mb-2">
                  <table
                    class="table card-table text-nowrap table-bordered border-top mb-0"
                    v-if="students.length"
                  >
                    <thead class="bg-secondary text-white">
                      <tr>
                        <th class="text-white">Sr. No.</th>
                        <th class="text-white">Student Name</th>
                        <th class="text-white">Section</th>
                        <th class="text-white">Score</th>
                        <th class="text-white">Status</th>
                        <th class="text-white">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(student, index) in students" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ student.name }}</td>
                        <td>{{ student.sec_name }}</td>
                        <td>{{ student.score }}</td>
                        <td>
                          <p v-if="student.exam_status > 0">Present</p>
                          <p v-else>Absent</p>
                        </td>
                        <td>
                          <button
                            class="btn btn-info"
                            v-bind:id="student.user_id"
                            v-on:click="check_assessment(student.user_id)"
                            v-if="
                              student.exam_status > 0 && student.score == null
                            "
                          >
                            Check
                          </button>
                          <button
                            class="btn btn-warning mr-2"
                            v-on:click="
                              view_report(student.user_id, student.sch_id)
                            "
                            v-if="student.score != null"
                          >
                            Report
                          </button>
                          <button
                            class="btn btn-danger mr-2"
                            v-on:click="clear_report(student.user_id, 'record')"
                            v-if="student.score != null"
                          >
                            Clear
                          </button>
                          <button
                            class="btn btn-warning mr-2"
                            v-on:click="clear_report(student.user_id, 'time')"
                            v-if="
                              student.exam_status > 0 && student.score == null
                            "
                          >
                            Reset Time
                          </button>
                          <span
                            v-if="
                              student.score == null && student.exam_status == 0
                            "
                            >Not Attempted</span
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="p-4" v-else><h4>No record.</h4></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/assessments/HeaderContent.vue";
import Footer from "@/components/footer/Footer.vue";
export default {
  name: "home",
  components: {
    Header,
    HeaderContent,
    Footer
  },
  data() {
    return {
      userId: 0,
      cls_id: this.$store.getters.getAuthData.auth_cls_id,
      user_id: this.$store.getters.getAuthData.auth_user_id,
      sec_id: this.$store.getters.getAuthData.auth_sec_id,
      role_id: this.$store.getters.getAuthData.auth_role_id,
      sch_id: this.$store.getters.getAuthData.auth_sch_id,
      assessments: [],
      cv_assessments: [],
      studentReport: [],
      sch_classes: [],
      classes: [],
      asmnt_classes: [],
      disabl: 0,
      asmnt_id: 0,
      asmnt_cls_id: 0,
      students: [],
      st_count: 0,
      windowHegiht: 0
    };
  },
  beforeCreate() {},
  created() {
    if (this.$route.query.assessment) {
      var query = atob(this.$route.query.assessment);
      var params = query.split(",");
      this.asmnt_id = params[0];
      this.asmnt_cls_id = params[2];
      this.load_assessments_classes(this.asmnt_id);
      this.assessments_students();
    }
  },
  beforeMount() {},
  mounted: function() {
    //initCvModals();
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.load_assessments();
        }
      }.bind(this)
    );
    var vm = this;
    $(document).ready(function() {
      vm.windowHegiht = $(window).height();
    });
    $(window).resize(
      function() {
        this.windowHegiht = $(window).height();
      }.bind(this)
    );
  },
  methods: {
    load_assessments: function() {
      this.$http
        .post("/api/user/DisplayAssessment", {
          cls_id: this.cls_id,
          sch_id: this.sch_id,
          user_id: this.user_id,
          role_id: this.role_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.cv_assessments = [];

            this.cv_assessments = res.body.cv_assessments;
          }
        });
    },
    load_assessments_classes: function(asmnt_id) {
      if (this.asmnt_id != 0) {
        this.$http
          .post("/api/user/Assessment_classes", {
            sch_id: this.sch_id,
            assessment_id: asmnt_id
          })
          .then(function(res) {
            if (res.body.status == "403") {
              //this.$router.push('/login');
            } else {
              this.classes = res.body.asmnt_classes;
              this.asmnt_classes = res.body.asmnt_classes;
              this.asmnt_cls_id = 0;
              this.students = [];
            }
          });
      } else {
        notify("Please select an assessment.", "info");
        this.asmnt_classes = [];
        this.asmnt_cls_id = 0;
        return false;
      }
    },

    assessments_students: function() {
      this.$http
        .post("/api/user/Assessment_students", {
          sch_id: this.sch_id,
          assessment_id: this.asmnt_id,
          cls_id: this.asmnt_cls_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.students = res.body.students;
            this.st_count = 0;
            for (var i = 0; i < this.students.length; i++) {
              if (this.students[i].exam_status == 0) {
                this.st_count += 1;
              }
            }
          }
        });
    },
    check_assessment: function(user_id) {
      var det = btoa(this.asmnt_id + "," + user_id + "," + this.asmnt_cls_id);
      this.$router.push({
        path: "/assessments/check",
        query: { assessment: det }
      });
    },

    st_view_report: function(asmnt_id, sch_id) {
      var det = btoa(asmnt_id + "," + this.user_id + "," + this.asmnt_cls_id);
      console.log(asmnt_id + "," + this.user_id + "," + this.asmnt_cls_id);
      /*this.$router.push({
        path: "/assessments/view-report",
        query: { assessment: det }
      });*/
      /*if (sch_id == 0) {
        this.$router.push({
          path: "/assessments/cv-student-report",
          query: { assessment: det }
        });
      } else {
        this.$router.push({
          path: "/assessments/view-report",
          query: { assessment: det }
        });
      }*/
    },
    view_report: function(user_id, sch_id) {
      //var det = btoa(this.asmnt_id + "," + user_id + "," + this.asmnt_cls_id);
      var det = btoa(this.asmnt_id + "," + user_id + "," + this.asmnt_cls_id);
      this.$router.push({
          path: "/assessments/view-report",
          query: { assessment: det }
        });
      /*if (sch_id == 0) {
        this.$router.push({
          path: "/assessments/cv-student-report",
          query: { assessment: det }
        });
      } else {
        this.$router.push({
          path: "/assessments/student-report",
          query: { assessment: det }
        });
      }*/
    },
    clearTeacherReport: function(asmnt_id, asmnt_name, duration) {
      this.$http
        .post("/api/user/ClearReport", {
          user_id: this.user_id,
          assessment_id: asmnt_id,
          clear_type: "record"
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.start_exam(asmnt_id, asmnt_name, duration);
          }
        });
    },
    clear_report: function(user_id, clr_type) {
      var message =
        clr_type == "record"
          ? "You really want to clear record?"
          : "You really want to reset time?";
      var vm = this;
      showConfirmationDialog({
        title: "Delete Record",
        message: message,
        callback: function(type) {
          if (type == "positive") {
            vm.$http
              .post("/api/user/ClearReport", {
                user_id: user_id,
                assessment_id: vm.asmnt_id,
                clear_type: clr_type
              })
              .then(function(res) {
                if (res.body.status == "403") {
                  //this.$router.push('/login');
                } else {
                  notify("Student record successfully cleared.", "success");
                  vm.assessments_students();
                }
              });
          }
        },
        positiveButton: "Reset",
        positiveButtonClass: "negative"
      });
    }
  }
};
</script>

<style lang="scss">
#projects-root {
  .lms-section-heading {
    font-size: 2rem;
    line-height: 1;
    margin-bottom: 24px;
  }
}
#projects-hero {
  position: relative;
  width: 100%;
  padding: 32px 0;
  color: #fff;
  background-image: url("/static/dashboard/img/new/hero-bg.svg");
  background-size: cover;
  background-position: bottom;
  & * {
    position: relative;
    z-index: 1;
  }
  &::before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(113, 0, 179, 0.5);
    z-index: 0;
  }
  & > div {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    div {
      flex-grow: 1;
    }
    button {
      background: #fff;
      color: #000;
      i {
        margin-right: 8px;
      }
      &:last-of-type {
        margin-left: 8px;
      }
    }
  }
  h3 {
    margin: 0 0 16px;
  }
}

#project-cards-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 24px;
}

.project-card {
  display: flex;
  flex-direction: column;
  width: 23%;
  margin-bottom: 32px;
  border-radius: 4px;
}

.project-card-img {
  width: 100%;
  height: 0;
  padding-bottom: 50%;
  flex-shrink: 0;
  background: #efefef;
  border: none;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.project-card-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  padding: 16px;
  align-items: stretch;
  padding-right: 16px;
}

.project-card {
  position: relative;
  opacity: 1;
  transition: all 300ms, box-shadow 300ms, opacity 1000ms;
  h3 {
    margin: 0;
    padding: 0;
    font-size: 1.2rem;
    font-family: "Nunito", sans-serif !important;
    font-weight: 600;
    line-height: 1;
  }
  p {
    margin: 8px 0 0;
    font-size: 0.9rem;
    color: #444;
    font-family: "Nunito", sans-serif !important;
  }
}

.project-type-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  background: rgb(209, 42, 120);
  font-size: 0.8rem;
  line-height: 1;
  color: #fff;
  border-radius: 16px;
}

.project-card-bottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px;
  img {
    width: 32px;
    height: 32px;
    margin-right: 16px;
    border-radius: 16px;
    background: #000;
    outline: none;
  }
  span {
    padding-top: 3px;
    font-family: "Nunito";
    line-height: 1;
  }
  .edit-project-btn {
    margin: 0;
    padding: 7px 16px;
    border-radius: 4px;
    font-size: 0.9rem;
    line-height: 1;
  }
}

#new-project-modal {
  .body {
    display: flex;
    flex-direction: column;
    padding: 16px 24px;
  }
  label {
    margin-bottom: 4px;
  }
  select {
    margin-bottom: 16px;
    padding-left: 8px;
    padding-right: 8px;
  }
  textarea {
    height: 64px;
    padding: 8px;
    line-height: 1.2;
    resize: none;
  }
}
</style>
