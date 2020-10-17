<template>
  <div class="mr-4" style="display:flex; flex-direction:column;height:90%;">
    <div class="cv-tablayout cardlayout p-2 d-flex h-100 flex-column">
      <div class="row m-0 p-2 bg-secondary text-white ">
        <div class="active d-inline-block">
          <h5>Create new assessment</h5>
        </div>
        <i class="flex-fill"></i>
        <span
          class="d-inline-block mr-4"
          onclick="hideModal('createAssessmentModal')"
          ><i class="fas fa-times"></i
        ></span>
      </div>
      <!--Create assessment steps tabs-->
      <div class="content active d-flex h-100">
        <div id="assessments-tablayout" class="cv-tablayout w-100">
          <div class="tabs">
            <div id="step1-click" class="active">Create</div>
            <div id="step2-click">Add Questions</div>
            <!--<div id="step3-click">
              Assign
            </div>-->

            <i class="flex-filler"></i>
          </div>
          <!-- Step I div starts here--->
          <div class="content active" style="padding:12px 12px; height:100%;">
            <div
              style="display:flex; flex-direction:column; min-height: 400px;"
            >
              <div class="step1-a">
                <p><b>Enter the following details:</b></p>
              </div>
              <div class="step1-a">
                <div>
                  <p>Assessment name:<span class="text-danger">*</span></p>
                </div>
                <input
                  type="text"
                  id="asmntName"
                  name="assessment_name"
                  v-model="asmntName"
                  class="form-control col-sm-4"
                  placeholder="Type assessment name here.."
                />
              </div>
              <div class="step1-a">
                <div>
                  <p>Assessment duration:<span class="text-danger">*</span></p>
                </div>
                <input
                  type="text"
                  id="asmntDuration"
                  name="assessment_duration"
                  v-model="asmntDuration"
                  class="form-control col-sm-4"
                  placeholder="Enter duration in minutes."
                  onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                />
              </div>
              <div class="step1-a">
                <div>
                  <p>Assessment Topic:<span class="text-danger">*</span></p>
                </div>
                <select
                  class="form-control col-sm-4"
                  id="assessmentTopic"
                  v-model="asmntTopic"
                  disabled
                >
                  <option value="0">Select Topic</option>
                  <template v-for="(course, index) in courses">
                    <option :key="index" :value="course.book_id">{{
                      course.book_name
                    }}</option>
                  </template>
                </select>
              </div>
              <div class="step1-a">
                <div>
                  <p>Schedule On:<span class="text-danger">*</span></p>
                </div>
                <input
                  type="datetime-local"
                  id="asmntTime"
                  name="assessment_time"
                  v-model="asmnt_date"
                  class="form-control col-sm-4"
                  placeholder="Enter assessment schedule time."
                />
              </div>
              <div class="step1-a">
                <div>
                  <p>Assessment Description:</p>
                </div>
                <textarea
                  type="text"
                  id="asmntDuration"
                  name="assessment_description"
                  v-model="asmntDescription"
                  class="form-control col-sm-4"
                  cols="20"
                  rows="5"
                  style="resize:none; border:thin solid #999;"
                  placeholder="Enter description....."
                ></textarea>
              </div>

              <div class="step1-a text-center">
                <button
                  class="btn btn-info"
                  style="align-self: center"
                  @click="createAssessmentBySchoolTeachersForCourse('step1')"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          <!-- Step I div ends here --->
          <!-- Step II div starts here--->
          <div class="content h-100" style="padding:0px 0px; height:100%;">
            <div
              class="d-flex h-100 flex-column"
              style="min-height: 400px; padding: 0;"
            >
              <!--Select question section starts here -->
              <div
                class="mbody-a mr-0 d-flex h-100"
                style="flex-grow: 1; overflow-y: auto; padding: 0px 0px;"
              >
                <div
                  class=" row m-0 modal-left-row1 mx-3"
                  style="height: auto;"
                >
                  <div class="col-sm-1.5">Choose topic</div>
                  <div class="col-sm-2">
                    <select
                      v-model="sub_id"
                      class="form-control"
                      v-on:change="search_question()"
                    >
                      <option value=""> All </option>
                      <template v-for="(subject, index) in subjects">
                        <option
                          :key="index"
                          v-bind:value="subject.sub_id"
                          v-if="subject.sch_id == 0 || subject.sch_id == sch_id"
                          >{{ subject.sub_name }}</option
                        >
                      </template>
                    </select>
                  </div>
                  <div class="com-sm-1.5">Choose Marks</div>
                  <div class="col-sm-1">
                    <select v-model="queMarks" class="form-control">
                      <option value="1"> 1 </option>
                      <option value="2"> 2 </option>
                      <option value="3"> 3 </option>
                      <option value="4"> 4 </option>
                      <option value="5"> 5 </option>
                    </select>
                  </div>
                  <i class="flex flex-fill" />
                  <div class="col-sm-1.5">
                    Filter by Grade
                  </div>
                  <div class="col-sm-2">
                    <select class="form-control" v-model="filterselectedGrade">
                      <option value="">All</option>
                      <template v-for="(sch_class, index) in sch_classes">
                        <option :key="index" :value="sch_class.cls_id">{{
                          sch_class.cls_name
                        }}</option>
                      </template>
                    </select>
                  </div>
                  <!--<div class="col-sm-2 text-right">
                    <button
                      class="btn btn-warning"
                      onclick="showModal('addQueInQueTab-button-modal');"
                    >
                      Add new question <b>+</b>
                    </button>
                  </div>-->
                </div>
                <div class="modal-row-a d-flex  h-100">
                  <div
                    class="modal-left-right h-100"
                    style="margin-right: 8px;"
                  >
                    <div
                      class="modal-left-row1"
                      style="justify-content: space-between;"
                    >
                      <p>Questions for Assessment</p>
                    </div>
                    <div class="step2-a">
                      <table
                        class="w-100 h-100"
                        cellspacing="4"
                        cellpadding="4"
                      >
                        <thead class="bg-secondary text-white">
                          <tr>
                            <th class="text-white">Sr. No.</th>
                            <th class="text-white">Question</th>
                            <th class="text-white">Que. Type</th>
                            <th class="text-white">NTA</th>
                            <th class="text-white">Assigned to Grade</th>
                            <th class="text-white">Insert</th>
                          </tr>
                        </thead>
                        <tbody>
                          <template v-for="(question, index) in allQuestions">
                            <tr
                              :key="index"
                              v-if="
                                question.for_grade.includes(filterselectedGrade)
                              "
                            >
                              <td>
                                {{ index + 1 }}
                              </td>
                              <td><p v-html="question.question"></p></td>
                              <td>{{ question.que_type }}</td>
                              <td>{{ question.status }}</td>
                              <td>{{ question.for_grade }}</td>
                              <td>
                                <div
                                  class="badge badge-primary"
                                  style="cursor:pointer"
                                  v-if="!selectedQuestionIds[question.que_id]"
                                  @click="addQuestion(question)"
                                >
                                  Add
                                </div>
                                <div
                                  class="badge badge-success"
                                  style="cursor:pointer"
                                  v-else
                                >
                                  Added
                                </div>
                              </td>
                            </tr>
                          </template>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    class="modal-left-right h-100"
                    style="justify-content: flex-start;"
                  >
                    <div
                      class="modal-left-row1"
                      style="justify-content: space-between;"
                    >
                      <p>Assessment questions</p>
                    </div>
                    <div class="step2-a">
                      <table
                        class="table w-100"
                        cellspacing="4"
                        cellpadding="4"
                      >
                        <thead class="bg-secondary text-white">
                          <tr>
                            <th class="text-white">Sr. No.</th>
                            <th class="text-white">
                              Question ({{ selectedQuestion.length }})
                            </th>
                            <th class="text-white">Subject</th>
                            <th class="text-white">Marks ({{ totMarks }})</th>
                            <th class="text-white">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          <template
                            v-for="(question, index) in selectedQuestion"
                          >
                            <tr :key="index">
                              <td>{{ index + 1 }}</td>
                              <td><p v-html="question.question"></p></td>
                              <td>
                                {{ subjects[question.sub_id].sub_name }}
                              </td>
                              <td>{{ question.marks }}</td>
                              <td>
                                <div
                                  class="badge badge-primary"
                                  style="cursor:pointer"
                                  @click="
                                    selectedQuestion.splice(index, 1);
                                    selectedQuestionIds[question.que_id] = 0;
                                  "
                                >
                                  Remove
                                </div>
                              </td>
                            </tr>
                          </template>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <!--Select question section ends here-->
              <div class="p b-2">
                <button
                  class="btn btn-info"
                  style="align-self:center;"
                  @click="createAssessmentBySchoolTeachersForCourse('step2')"
                >
                  <span> Create</span>
                </button>
              </div>
            </div>
          </div>
          <!-- Step II div ends here --->
          <!-- Step III div starts here--->
          <div class="content" style="padding:4px 4px; height:100%;">
            <div style="display:flex; flex-direction:column; ">
              <div class="step1-a" style="padding: 0 0 5px 4px;">
                <p><b>Assign and schedule this assessment:</b></p>
              </div>
              <div class="step1-a  row">
                <template v-for="(sch_class, index) in sch_classes">
                  <div :key="index" class="col-sm-3 p-2 my-2">
                    <span class="badge badge-secondary p-2">
                      <table
                        class="m-0 w-100 text-center p-2  table-bordered border-top mb-0 border-dark"
                        cellspacing="5"
                        cellpadding="4"
                      >
                        <thead class="bg-secondary text-white">
                          <tr>
                            <th class="text-white"></th>
                            <th class="text-white">Grade</th>
                            <th class="text-white">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <input
                                type="checkbox"
                                style="width:18px; height:18px;"
                                v-bind:id="'clschk' + sch_class.cls_id"
                                v-model="selectedClass"
                                v-bind:value="sch_class.cls_id"
                              />
                            </td>
                            <td>{{ sch_class.cls_name }}</td>
                            <td>
                              <input
                                type="datetime-local"
                                class="'form-control"
                                :id="'gradeDate' + sch_class.cls_id"
                                :min="$moment().format('YYYY-MM-DDTHH:mm')"
                                :value="asmntTime"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </span>
                  </div>
                </template>
              </div>

              <div class="">
                <button
                  class="btn btn-info"
                  style="align-self:center;"
                  @click="createAssessment('step3')"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
          <!-- Step III div ends here --->
        </div>
      </div>
      <!--Create assessment tabs bottom end here-->
    </div>
    <!-- Modal of Add new question button -->
    <div id="addQueInQueTab-button-modal" class="cv-modal normal ">
      <div
        style="display: flex; flex-direction: column; max-width:3000px; width:98%; height:98%;"
      >
        <NewQuestion
          :sch_id="sch_id"
          :load_all_subjects="load_all_subjects"
        ></NewQuestion>
      </div>
    </div>
    <!--Modal ends here -->
  </div>
</template>

<script>
let ckEditorImageUrlInput;
import moment from "vue-moment";
import NewQuestion from "@/components/assessments/NewQuestion.vue";
import { VueEditor } from "vue2-editor";

export default {
  props: ["load_assessments", "sch_id", "courseId"],
  components: { NewQuestion },
  data() {
    return {
      user_id: this.$store.getters.getAuthData.auth_user_id,
      role_id: this.$store.getters.getAuthData.auth_role_id,
      asmntName: "",
      asmntDuration: "",
      asmntDescription: "",
      asmntTopic: this.courseId,
      selectedClass: [],
      asmntType: 0,
      asmntPrice: 0,
      subjects: new Object(),
      asmnt_id: 0,
      class_id: 0,
      asmntTime: this.$moment().format("YYYY-MM-DDTHH:mm"),
      mindate: this.$moment().format("YYYY-MM-DDTHH:mm"),
      allQuestions: [],
      sub_id: "",
      selectedQuestion: [],
      selectedQuestionIds: new Object(),
      queMarks: 1,
      asmntAssignedClass: [],
      assessmentDetail: [],
      sch_classes: [],
      courses: [],
      filterselectedGrade: "",
      asmnt_date: this.$moment().format("YYYY-MM-DDTHH:mm")
    };
  },
  computed: {
    totMarks() {
      var totalMarks = 0;
      for (var key in this.selectedQuestion) {
        totalMarks += parseInt(this.selectedQuestion[key].marks);
      }
      return totalMarks;
    }
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    this.load_all_subjects();
    this.load_classes();
    this.search_question();
    this.loadCourses();
  },
  methods: {
    addQueInAssessment: function() {
      $("#addQueInAssessment-button-modal > div").removeClass("visible");
      showModal($("#addQueInAssessment-button-modal"));
    },
    load_all_subjects: function() {
      this.$http.post("/api/user/All_subjects", {}).then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          //this.subjects=res.body.all_subject;
          this.subjects = new Object();
          var subjects = res.body.all_subject;
          for (var i = 0; i < subjects.length; i++) {
            this.subjects[subjects[i].sub_id] = subjects[i];
          }
        }
      });
    },
    loadCourses: function() {
      this.$http.post("/api/user/displayAllBooks").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.courses = res.body.courses;
        }
      });
    },
    load_classes: function() {
      this.$http
        .post("/api/user/School_classes", {
          sch_id: this.sch_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.sch_classes = res.body.all_classes;
          }
        });
    },

    search_question: function() {
      this.$http
        .post("/api/user/Subject_questions", {
          sub_id: this.sub_id,
          search_for: "",
          sch_id: this.sch_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.allQuestions = res.body.all_questions;
          }
        });
    },
    addQuestion(question) {
      if (this.selectedQuestionIds[question.que_id]) return;
      this.selectedQuestionIds[question.que_id] = 1;
      this.selectedQuestion.push(question);
      for (var i = 0; i < this.selectedQuestion.length; i++) {
        if (this.selectedQuestion[i].que_id == question.que_id) {
          Object.assign(this.selectedQuestion[i], { marks: this.queMarks });
        }
      }
    },
    createAssessmentByCodevidhya: function(step) {
      var asmnt_for = "";
      if (step == "step1") {
        if (!this.asmntName) {
          $("#asmntName").addClass("input-valid");
          cvNotify("Assessment name can not be empty.", "info");
        } else {
          $("#asmntName").removeClass("input-valid");
        }
        if (!this.asmntDuration) {
          $("#asmntDuration").addClass("input-valid");
          cvNotify("Assessment duration can not be empty.", "info");
        } else {
          $("#asmntDuration").removeClass("input-valid");
        }
        if (this.asmntType == 0) {
          $("#asmntType").addClass("input-valid");
          cvNotify("Please select assessment used for.", "info");
        } else {
          $("#asmntType").removeClass("input-valid");
        }
        if (this.asmntTopic == 0) {
          $("#assessmentTopic").addClass("input-valid");
          cvNotify("Please select assessment topic.", "info");
        } else {
          $("#assessmentTopic").removeClass("input-valid");
        }
        if (this.selectedClass.length == 0 && this.asmntType == 2) {
          cvNotify("Please select grades for assessment.", "warning");
          return false;
        }
        if (this.asmntName && this.asmntDuration && this.asmntType != 0) {
          if (this.asmntType != 2) {
            asmnt_for = 3;
          } else {
            asmnt_for = this.asmntType;
          }
          this.assessmentDetail.push({
            assessmentName: this.asmntName,
            duration: this.asmntDuration,
            description: this.asmntDescription,
            role_id: this.asmntType == 2 ? 2 : this.asmntType == 5 ? 2 : 3,
            book_id: this.asmntType == 1 ? 1 : 0,
            used_for: this.asmntType == 4 ? 1 : this.asmntType == 5 ? 1 : 0,
            asmnt_price: this.asmntPrice,
            forGrades: this.selectedClass,
            assessmentTopic: this.asmntTopic,
            user_id: 0
          });
          $("#step2-click").click();
        }
      } else if (step == "step2") {
        if (!this.asmntName || !this.asmntDuration) {
          cvNotify("Please create an assesment first.", "info");
          $("#step1-click").click();
        } else if (this.selectedQuestion.length < 1) {
          cvNotify(
            "Please select atleast one question for the assessment.",
            "info"
          );
        } else {
          showProgressOverlay("assessment-Create");
          this.$http
            .post("/api/user/CreateAssessment", {
              sch_id: this.sch_id,
              assessmentDetails: this.assessmentDetail,
              assessmentQuestion: this.selectedQuestion
            })
            .then(function(res) {
              if (res.body.status == "403") {
                //this.$router.push('/login');
              } else {
                if (res.body.success == 1) {
                  hideProgressOverlay("assessment-Create");
                  cvNotify(
                    "You have successfully created an assessment.",
                    "success"
                  );
                  this.load_assessments();
                  this.selectedClass = [];
                  this.selectedQuestion = [];
                  this.assessmentDetail = [];
                  this.selectedQuestionIds = new Object();
                  this.asmntName = "";
                  this.asmntDuration = "";
                  this.asmntType = 0;
                  this.asmntPrice = 0;
                  $("#step1-click").click();
                  hideModal("createAssessmentModal");
                  //this.$router.push("/assessments");
                } else {
                  cvNotify("This assessment already created.", "danger");
                  this.asmntName = "";
                  this.assessmentDetail = [];
                  this.asmntAssignedClass = [];
                  $("#step1-click").click();
                }
              }
            });
        }
      }
    },
    createAssessmentBySchoolTeachersForCourse: function(step) {
      console.log("hellodfdfd");
      var asmnt_for = "";
      if (step == "step1") {
        if (!this.asmntName) {
          $("#asmntName").addClass("input-valid");
          cvNotify("Assessment name can not be empty.", "info");
        } else {
          $("#asmntName").removeClass("input-valid");
        }
        if (!this.asmntDuration) {
          $("#asmntDuration").addClass("input-valid");
          cvNotify("Assessment duration can not be empty.", "info");
        } else {
          $("#asmntDuration").removeClass("input-valid");
        }

        if (this.asmntName && this.asmntDuration) {
          this.assessmentDetail.push({
            assessmentName: this.asmntName,
            duration: this.asmntDuration,
            description: this.asmntDescription,
            role_id: 3,
            book_id: 1,
            used_for: 0,
            asmnt_price: 0,
            forGrades: 0,
            assessmentTopic: this.asmntTopic,
            user_id: this.user_id,
            asmnt_date: this.$moment(this.asmnt_date).format(
              "YYYY-MM-DD HH:mm:ss"
            )
          });
          $("#step2-click").click();
        }
      } else if (step == "step2") {
        if (!this.asmntName || !this.asmntDuration) {
          cvNotify("Please create an assesment first.", "info");
          $("#step1-click").click();
        } else if (this.selectedQuestion.length < 1) {
          cvNotify(
            "Please select atleast one question for the assessment.",
            "info"
          );
        } else {
          showProgressOverlay("assessment-Create");
          this.$http
            .post("/api/user/CreateAssessmentForOtherSubjects", {
              sch_id: this.sch_id,
              assessmentDetails: this.assessmentDetail,
              assessmentQuestion: this.selectedQuestion
            })
            .then(function(res) {
              if (res.body.status == "403") {
                //this.$router.push('/login');
              } else {
                if (res.body.success == 1) {
                  hideProgressOverlay("assessment-Create");
                  cvNotify(
                    "You have successfully created an assessment.",
                    "success"
                  );
                  this.load_assessments();
                  this.selectedClass = [];
                  this.selectedQuestion = [];
                  this.assessmentDetail = [];
                  this.selectedQuestionIds = new Object();
                  this.asmntName = "";
                  this.asmntDuration = "";
                  this.asmntType = 0;
                  this.asmntPrice = 0;

                  $("#step1-click").click();
                  hideModal("createAssessmentModal");
                  //this.$router.push("/assessments");
                } else {
                  cvNotify("This assessment already created.", "danger");
                  this.asmntName = "";
                  this.assessmentDetail = [];
                  this.asmntAssignedClass = [];
                  $("#step1-click").click();
                }
              }
            });
        }
      }
    }
  },
  mounted: function() {
    initCvTablayouts();
  },
  updated() {
    initCvTablayouts();
  }
};
</script>
<style lang="scss">
.assessment-input-validation {
  border: solid thin #e74c3c;
}
/*Ankit design */
.step1-a {
  display: flex;
  flex-direction: row;
  padding: 4px;
  input {
    width: 250px;
  }
}
.step1-a > div {
  display: flex;
  min-width: 200px;
  align-items: center;
}
.step2-a {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-top: 8px;
  overflow: auto;
  background: #fff;
  border: 1px solid grey;
}
.step2-a > div {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid gray;
  div {
    padding: 2px;
    border-right: 1px solid grey;
    &:last-of-type {
      border-right: none;
    }
  }
  div.h1a {
    min-width: 40px;
    text-align: center;
  }
  div.h3a {
    min-width: 40px;
    text-align: center;
  }
  div.h4a {
    min-width: 150px;
  }
  div.h5a {
    min-width: 40px;
    text-align: center;
  }
  div.subject {
    min-width: 120px;
  }
  div.delete {
    min-width: 48px;
    text-align: center;
  }
}
.step3-a {
  display: flex;
  flex-direction: column;
  width: 480px;
  background: rgba(0, 0, 0, 0.1);
  & > div {
    display: flex;
    flex-direction: row;
    min-height: 48px;
    border-bottom: medium solid #fff;
    div {
      display: flex;
      min-width: 100px;
      border-left: medium solid #fff;
      padding: 2px 8px;
      align-items: center;
      justify-content: center;
    }
    input[type="checkbox"] {
      width: 15px;
      height: 15px;
    }
  }
}
.input-valid {
  border: thin solid #e74c3c !important;
}
</style>
