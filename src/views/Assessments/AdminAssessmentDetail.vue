<template>
  <div id="projects-root">
    <Header>
      <section>
        <div class="card mt-2 mb-0" style="height:400px">
          <div class="row pt-4">
            <div class="col-md-12 col-lg-6  pr-0 ">
              <div class="card-body p-7 pabout">
                <h2 class="mb-4 font-weight-semibold">
                  {{ assessment.assessment_name }}
                </h2>
                <h4 class="leading-normal">
                  <i class="fas fa-calendar-alt mr-1"></i> Created on:
                  <i class="flex-fill"></i>
                  {{ $moment(assessment.date).format("LL") }}
                </h4>
                <h4 class="leading-normal">
                  <i class="fas fa-question-circle mr-1"></i> Total Questions:
                  <i class="flex-fill"></i> {{ assessment.tot_que }}
                </h4>
                <h4 class="leading-normal">
                  <i class="fas fa-list-ol mr-1"></i> Total Marks:
                  <i class="flex-fill"></i> {{ assessment.tot_marks }}
                </h4>
                <h4 class="leading-normal">
                  <i class="fas fa-clock mr-1"></i> Duration:
                  <i class="flex-fill"></i> {{ assessment.duration }} min.
                </h4>
                <h4 class="leading-normal">
                  <i class="fas fa-pen mr-1"></i> Description:
                  <i class="flex-fill"></i> <br />{{ assessment.description }}
                </h4>
                <!--<a href="#" class="btn btn-primary mt-2">Back</a>-->
              </div>
            </div>
            <div class="col-md-12 col-lg-6 pl-0 pr-0 d-none d-lg-block">
              <img
                src="/assets/images/project-thumbs/web.svg"
                height="355"
                style="width:100% !important;"
                alt="img"
                class="br-br-2 br-tr-2"
              />
            </div>
          </div>
        </div>
      </section>
    </Header>
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12 p-0">
          <div class="card">
            <div class="card-body">
              <table
                class="table card-table text-nowrap table-bordered border-top mb-0"
                v-if="sch_id != 0"
              >
                <thead class="bg-secondary text-white">
                  <tr>
                    <th class="text-white">Assigned to</th>
                    <th class="text-white">Scheduled Time</th>
                    <th class="text-white d-flex">
                      Action <i class="flex flex-fill"></i
                      ><span
                        class="badge badge-primary"
                        style="cursor:pointer;"
                        v-if="assessment.sch_id == 0"
                        onclick="showModal('assignSchedule-modal')"
                        >Assign to grade</span
                      >
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(cls, index) in asignedAsmntClass">
                    <tr :key="index">
                      <td>Grade {{ cls.cls_name }}</td>
                      <td>{{ $moment(cls.date).format("LLLL") }}</td>
                      <td>
                        <button
                          class="btn btn-small btn-success mr-1"
                          :disabled="assessment.sch_id == 0 ? false : true"
                          @click="
                            editAssessmentModal(cls.date);
                            asmnt_cls_id = cls.cls_id;
                          "
                        >
                          Edit
                        </button>
                        <button
                          class="btn btn-small btn-danger mr-1"
                          :disabled="assessment.sch_id == 0 ? false : true"
                          @click="
                            delete_assessment();
                            asmnt_cls_id = cls.cls_id;
                          "
                        >
                          Delete
                        </button>
                        <button
                          class="btn btn-small btn-secondary"
                          title="notifications"
                          @click="assessments_students(cls.cls_id)"
                        >
                          <i class="far fa-bell"></i>
                        </button>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
              <table
                class="table card-table text-nowrap table-bordered border-top mb-0"
                v-else-if="this.asmnt_cat == 3 || this.asmnt_cat == 4"
              >
                <thead class="bg-secondary text-white">
                  <tr>
                    <th class="text-white">Sr. No.</th>
                    <th class="text-white">School Name</th>
                    <th class="text-white">Grades</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(grade, index) in assignedAssessmentDetail">
                    <tr :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>
                        {{ grade.sch_name }}
                      </td>
                      <td>
                        {{ grade.cls_name }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
              <table
                class="table card-table text-nowrap table-bordered border-top mb-0"
                v-else-if="this.asmnt_cat == 2"
              >
                <thead class="bg-secondary text-white">
                  <tr>
                    <th class="text-white">Sr. No.</th>
                    <th class="text-white">School Name</th>
                    <th class="text-white">Assessment Date</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(school, index) in assignedAssessmentDetail">
                    <tr :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>
                        {{ school.sch_name }}
                      </td>
                      <td>{{ $moment(school.date).format("LLLL") }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
              <table
                class="table card-table text-nowrap table-bordered border-top mb-0"
                v-else-if="this.asmnt_cat == 1"
              >
                <thead class="bg-secondary text-white">
                  <tr>
                    <th class="text-white">Sr. No.</th>
                    <th class="text-white">Course Name</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(course, index) in assignedAssessmentDetail">
                    <tr :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>
                        {{ course.book_name }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 p-0">
          <div class="card">
            <div class="card-header bg-secondary text-white d-flex">
              <h4>Assessment Questions</h4>
              <i class="flex flex-fill"></i>
              <span
                class="btn btn-success mr-1"
                style="cursor:pointer"
                v-if="assessment.sch_id == 0"
                onclick="showModal('addMoreQueInQueTab-button-modal');"
                >Add More Questions</span
              >
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table
                  class="m-0 table card-table table-bordered border-top mb-0"
                >
                  <thead class="bg-primary text-white">
                    <tr>
                      <th class="text-white">Sr. No.</th>
                      <th class="text-white">Question</th>
                      <th class="text-white">Option 1</th>
                      <th class="text-white">Option 2</th>
                      <th class="text-white">Option 3</th>
                      <th class="text-white">Option 4</th>
                      <th class="text-white">Marks</th>
                      <th class="text-white" v-if="assessment.sch_id == 0">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(question, index) in asmnt_que">
                      <tr :key="index">
                        <td>{{ index + 1 }}</td>
                        <td><p v-html="question.question"></p></td>
                        <td
                          :class="
                            question.true_ans == 'opt1'
                              ? 'bg-success text-white'
                              : ''
                          "
                        >
                          <p v-html="question.opt1"></p>
                        </td>
                        <td
                          :class="
                            question.true_ans == 'opt2'
                              ? 'bg-success text-white'
                              : ''
                          "
                        >
                          <p v-html="question.opt2"></p>
                        </td>
                        <td
                          :class="
                            question.true_ans == 'opt3'
                              ? 'bg-success text-white'
                              : ''
                          "
                        >
                          <p v-html="question.opt3"></p>
                        </td>
                        <td
                          :class="
                            question.true_ans == 'opt4'
                              ? 'bg-success text-white'
                              : ''
                          "
                        >
                          <p v-html="question.opt4"></p>
                        </td>
                        <td>{{ question.marks }}</td>
                        <td>
                          <i
                            class="fas fa-times"
                            title="Delete Assessment"
                            style="font-size:20px; cursor:pointer;color:red;"
                            v-if="assessment.sch_id == 0"
                            @click="delete_question(question.que_id)"
                          ></i>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal of Edit button -->
    <div id="edit-button-modal" class="cv-modal cv-modal-normal">
      <div
        class="px-2 py-2"
        style="max-width:3000px; width:500px; height: 300px;"
      >
        <div class="card">
          <div class="card-header bg-secondary text-white">
            <h4>Grade: {{ asmnt_cls_id }} Assessment</h4>
          </div>
          <div class="card-body">
            <p class="p-2" style="font-size:18px;">
              Change the scheduled assessment date:
            </p>
            <p class="p-2">
              <input
                type="datetime-local"
                id="asmnt_time"
                v-model="asmntUpdateTime"
                class="form-control"
                :min="$moment().format('YYYY-MM-DDTHH:mm')"
              />
            </p>
          </div>
          <div class="card-footer d-flex justify-content-end">
            <button
              class="btn btn-success mr-1"
              @click="updateAssessmentTime()"
            >
              Save changes
            </button>
            <button
              class="btn btn-danger"
              onclick="hideModal('edit-button-modal');"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--maodal ends heare--->
    <!-- Modal to show notifications to students -->

    <div id="showNotificationModal" class="cv-modal normal ">
      <div
        class=""
        style="display: flex; flex-direction: column; max-width:3000px; width:98%; height:98%;"
      >
        <div class="row p-2 ml-2 mt-2 mr-2">
          <div class="col-sm-12 modal-left-row1" style="background:#1e96ff;">
            <h4>Student Notification Status</h4>
          </div>
        </div>
        <div class="row p-2 ml-2 mr-2 flex-grow-1" style="overflow:auto;">
          <table
            class="table table-bordered border-top h-100 text-center"
            style="background:#D5DBDB"
            cellspacing="4"
            cellpadding="4"
          >
            <thead class="bg-secondary text-white">
              <tr>
                <th class="text-white">Sr. No.</th>
                <th class="text-white">Student Name</th>
                <th class="text-white">Grade</th>
                <th class="text-white">Section</th>
                <th class="text-white">Email</th>
                <th class="text-white">Email Status</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(student, index) in students">
                <tr :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ student.name }}</td>
                  <td>{{ student.cls_name }}</td>
                  <td>{{ student.sec_name }}</td>
                  <td>{{ student.email }}</td>
                  <td>
                    <i
                      v-if="student.email"
                      class="far fa-check-circle"
                      style="color:#58D68D"
                    ></i>
                    <i
                      v-else
                      class="far fa-times-circle"
                      style="color:#E74C3C"
                    ></i>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="row m-2 p-2">
          <div class="col-sm-12 text-center">
            <button
              class="btn btn-danger"
              onclick="hideModal('showNotificationModal');"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!--Modal ends here -->

    <!-- Modal of assign and schedule this assessment starts here -->
    <div id="assignSchedule-modal" class="cv-modal cv-modal-normal">
      <div
        style="padding: 24px 24px 8px; max-width:3000px; width:630px; height: 660px;"
      >
        <div class="cv-input-group">
          <div
            class="row heading modal-heading-a p-2 text-white"
            style="font-size:18px;"
          >
            Assign and schedule this assessment
          </div>
        </div>
        <div class="step3-a">
          <table
            class="m-0 w-100 text-center p-2  table-bordered border-top mb-0"
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
              <template v-for="(sch_class, index) in sch_classes">
                <tr :key="index">
                  <td>
                    <input
                      type="checkbox"
                      style="width:18px; height:18px;"
                      v-bind:id="'cls' + sch_class.cls_id"
                      v-model="selectedClass"
                      v-bind:value="sch_class.cls_id"
                    />
                  </td>
                  <td>{{ sch_class.cls_name }}</td>
                  <td>
                    <input
                      v-if="asmnt_classes[sch_class.cls_id]"
                      type="datetime-local"
                      class="'form-control"
                      :id="'cls_date' + sch_class.cls_id"
                      :min="$moment().format('YYYY-MM-DDTHH:mm')"
                      :value="
                        $moment(asmnt_classes[sch_class.cls_id].date).format(
                          'YYYY-MM-DDTHH:mm'
                        )
                      "
                      :disabled="
                        selectedClass.includes(sch_class.cls_id) ? true : false
                      "
                    />
                    <input
                      v-else
                      type="datetime-local"
                      class="'form-control"
                      :id="'cls_date' + sch_class.cls_id"
                      :min="$moment().format('YYYY-MM-DDTHH:mm')"
                      :value="$moment().format('YYYY-MM-DDTHH:mm')"
                    />
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="modal-body-buttons-a m-4">
          <button class="btn btn-success mr-1" @click="assignAssessment()">
            Save
          </button>
          <button
            class="btn btn-danger "
            onclick="hideModal('assignSchedule-modal');"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
    <!-- Modal of assign and schedule this assessment ends here-->
    <!-- Modal of Add new question button -->
    <div id="addMoreQueInQueTab-button-modal" class="cv-modal normal ">
      <div
        style="display: flex; flex-direction: column; max-width:3000px; width:98%; height:95%; padding:20px 20px;"
      >
        <div class="modal-row-a">
          <div class="modal-left-row1 w-100">
            <label class="mr-2">Choose topic </label>
            <select
              class="form-control w-20 mr-2"
              v-model="sub_id"
              v-on:change="load_questions()"
            >
              <option value=""> All </option>
              <template v-for="(subject, index) in subjects">
                <option
                  :key="index"
                  v-bind:value="subject.sub_id"
                  v-if="subject.sch_id == sch_id"
                  >{{ subject.sub_name }}</option
                >
              </template>
            </select>
            <label class="mr-2">Choose Marks </label>
            <select class="form-control w-10" v-model="queMarks">
              <option value="1"> 1 </option>
              <option value="2"> 2 </option>
              <option value="3"> 3 </option>
              <option value="4"> 4 </option>
              <option value="5"> 5 </option>
            </select>
            <i class="flex-fill"></i>
            <button
              class="btn btn-primary"
              onclick="showModal('addQueInQueTab-button-modal');"
            >
              Add new question <b>+</b>
            </button>
          </div>
        </div>
        <div class="row p-2 m-0" style="height:85%;">
          <div class="col-sm-6 modal-left-row1" style="background:#1e96ff;">
            <h4>Questions for Assessment</h4>
          </div>
          <div class="col-sm-6 modal-left-row1" style="background:#1e96ff;">
            <h4>Assessment questions</h4>
          </div>
          <div class="col-sm-6 p-2" style="overflow:auto; height:95%;">
            <table class="w-100 h-100" cellspacing="4" cellpadding="4">
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
                  <tr :key="index">
                    <td>{{ index + 1 }}</td>
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
          <div class="col-sm-6 p-2" style="overflow:auto; height:100%;">
            <table class="table w-100" cellspacing="4" cellpadding="4">
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
                <template v-for="(question, index) in selectedQuestion">
                  <tr :key="index">
                    <td>{{ index + 1 }}</td>
                    <td><p v-html="question.question"></p></td>
                    <td>{{ subjects[question.sub_id].sub_name }}</td>
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
        <div class="p-2 mt-2 text-center">
          <button
            class="btn btn-success mr-2"
            @click="addAssessmentQuestions()"
          >
            Save
          </button>
          <button
            class="btn btn-danger"
            onclick="hideModal('addMoreQueInQueTab-button-modal');"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
    <!--Modal ends here -->
    <!-- Modal of Add new question -->
    <div id="addQueInQueTab-button-modal" class="cv-modal normal ">
      <div
        style="display: flex; flex-direction: column; max-width:3000px; width:98%; height:98%;"
      >
        <newQuestion
          :sch_id="sch_id"
          :load_questions="load_questions"
          :load_all_subjects="load_all_subjects"
        ></newQuestion>
      </div>
    </div>
    <!--Modal ends here -->
  </div>
</template>

<script>
import moment from "vue-moment";
import NewQuestion from "@/components/assessments/NewQuestion.vue";
import Header from "@/components/header/HeaderMenuForAdmin.vue";
export default {
  components: { NewQuestion, Header },
  data() {
    return {
      user_id: this.$store.getters.getAuthData.auth_user_id,
      role_id: this.$store.getters.getAuthData.auth_role_id,
      sch_id: "",
      sch_name: "",
      assessments: [],
      cv_assessments: [],
      sch_classes: [],
      asmnt_classes: new Object(),
      asignedAsmntClass: [],
      asmnt_id: "",
      asmnt_que: [],
      assessment: [],
      asmnt_cls_id: "",
      asmntUpdateTime: this.$moment().format("YYYY-MM-DDTHH:mm"),
      selectedClass: [],
      asmntAssignedClass: [],
      subjects: new Object(),
      sub_id: "",
      allQuestions: [],
      queMarks: 1,
      selectedQuestion: [],
      selectedQuestionIds: new Object(),
      students: [],
      st_count: 0,
      asmnt_cat: "",
      schools: new Object(),
      assignedAssessmentDetail: new Object()
    };
  },
  beforeCreate() {},
  created() {
    if (this.$route.query.assessment) {
      var query = atob(this.$route.query.assessment);
      var params = query.split(",");
      this.asmnt_id = params[0];
      this.sch_id = params[1];
      this.asmnt_cat = params[2];
      if (this.asmnt_cat == 4) {
      }
      this.load_schools();
      this.load_assessments_classes();
      this.school_classes();
      this.load_all_subjects();
      this.load_questions();
      this.load_assessments();

      this.load_assessment_questions();
    }
  },
  beforeMount() {},
  computed: {
    totMarks() {
      var totalMarks = 0;
      for (var key in this.selectedQuestion) {
        totalMarks += parseInt(this.selectedQuestion[key].marks);
      }
      return totalMarks;
    }
  },
  mounted() {
    initExpandableLayout(".cv-expandable-layout");
  },
  updated() {},
  methods: {
    load_schools: function() {
      this.$http.post("/api/user/DisplaySchools").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push("/login");
        } else {
          var schools = res.body.schools;
          for (var i = 0; i < schools.length; i++) {
            this.schools[schools[i].sch_id] = schools[i];
          }
        }
      });
    },
    load_all_subjects: function() {
      this.$http.post("/api/user/All_subjects").then(function(res) {
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
    load_questions: function() {
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
    load_assessments: function() {
      this.$http
        .post("/api/user/DisplayAssessment", {
          sch_id: this.sch_id,
          role_id: this.role_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.assessments = res.body.assessments;
            for (var i = 0; i < this.assessments.length; i++) {
              if (this.assessments[i].assessment_id == this.asmnt_id) {
                this.assessment = this.assessments[i];
                break;
              }
            }
          }
        });
    },
    school_classes: function() {
      this.$http
        .post("/api/user/School_classes", { sch_id: this.sch_id })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.sch_classes = res.body.all_classes;
          }
        });
    },
    load_assessments_classes: function() {
      this.$http
        .post("/api/user/Assessment_classes", {
          sch_id: this.sch_id,
          assessment_id: this.asmnt_id,
          asmnt_cat: this.asmnt_cat
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            if (this.sch_id != 0) {
              this.asignedAsmntClass = res.body.asmnt_classes;
              var ass_classes = res.body.asmnt_classes;
              for (var i = 0; i < ass_classes.length; i++) {
                this.asmnt_classes[ass_classes[i].cls_id] = ass_classes[i];
                this.selectedClass[i] = ass_classes[i].cls_id;
              }
            } else {
              this.assignedAssessmentDetail = res.body.asmnt_classes;
            }
          }
        });
    },
    load_assessment_questions: function() {
      this.selectedQuestion = [];
      this.selectedQuestionIds = new Object();
      this.$http
        .post("/api/user/Selected_assessment_detail", {
          assessment_id: this.asmnt_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.asmnt_que = res.body.asmnt_que;
            for (var i = 0; i < this.asmnt_que.length; i++) {
              this.selectedQuestion.push(this.asmnt_que[i]);
              this.selectedQuestionIds[this.asmnt_que[i].que_id] = 1;
            }
          }
        });
    },
    addAssessmentQuestions: function() {
      if (!this.selectedQuestion.length) {
        cvNotify(
          "There is on one question selected for the assessment, please select.",
          "info"
        );
        return false;
      }
      this.$http
        .post("/api/user/Assessment_questions", {
          assessment_id: this.asmnt_id,
          sch_id: this.sch_id,
          questions: this.selectedQuestion
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            if (res.body.success == 1) {
              cvNotify("You have added more question to assessment.", "info");
              this.selectedQuestion = [];
              this.load_assessments();
              this.load_assessment_questions();
              hideModal("addMoreQueInQueTab-button-modal");
            }
          }
        });
    },
    assignAssessment: function() {
      if (this.selectedClass.length != 0) {
        for (var i = 0; i < this.selectedClass.length; i++) {
          var dt = $("#cls_date" + this.selectedClass[i]).val();
          var cls_date = this.$moment(dt).format("YYYY-MM-DD HH:mm:ss");
          this.asmntAssignedClass.push({
            cls_id: this.selectedClass[i],
            asmnt_date: cls_date
          });
        }
        this.$http
          .post("/api/user/assignAssessment", {
            asmnt_id: this.asmnt_id,
            sch_id: this.sch_id,
            classes: this.asmntAssignedClass
          })
          .then(function(res) {
            if (res.body.status == "403") {
              //this.$router.push('/login');
            } else {
              if (res.body.success == 1) {
                cvNotify(
                  "You have successfully assigned this assessment.",
                  "info"
                );
                this.load_assessments_classes();
                this.asmntAssignedClass = [];
                hideModal("assignSchedule-modal");
              }
            }
          });
      } else {
        cvNotify("Please select at least one grade.", "info");
        return false;
      }
    },
    delete_question: function(que_id) {
      var vm = this;
      showConfirmationDialog({
        title: "Delete Question",
        message: "Do you really want to delete this question?",
        callback: function(type) {
          if (type == "positive") {
            vm.$http
              .post("/api/user/Delete_assessment_question", {
                assessment_id: vm.asmnt_id,
                que_id: que_id
              })
              .then(function(res) {
                if (res.body.status == "403") {
                  //this.$router.push('/login');
                } else {
                  cvNotify(
                    "You have successfully deleted the question.",
                    "info"
                  );
                  vm.load_assessments();
                  vm.load_assessment_questions();
                }
              });
          }
        },
        positiveButton: "Delete",
        positiveButtonClass: "negative"
      });
    },
    updateAssessmentTime: function() {
      var asmnt_tm = this.$moment(this.asmntUpdateTime).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.$http
        .post("/api/user/Assessment_update", {
          sch_id: this.sch_id,
          assessment_id: this.asmnt_id,
          cls_id: this.asmnt_cls_id,
          asmnt_time: asmnt_tm
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            //this.applied_assessment=res.body.asmnt_applied;
            if (res.body.data == "done") {
              cvNotify("Date & Time successfully updated.", "info");
              this.load_assessments_classes();
              this.asmnt_cls_id = "";
              hideModal("edit-button-modal");
            }
          }
        });
    },
    delete_assessment: function() {
      var vm = this;
      showConfirmationDialog({
        title: "Delete Assessment",
        message: "Are sure to delete assessment for this grade?",
        callback: function(type) {
          if (type == "positive") {
            vm.$http
              .post("/api/user/Delete_assessment_for_class", {
                assessment_id: vm.asmnt_id,
                sch_id: vm.sch_id,
                cls_id: vm.asmnt_cls_id
              })
              .then(function(res) {
                if (res.body.status == "403") {
                  //this.$router.push('/login');
                } else {
                  cvNotify("You have successfully deleted.", "info");
                  vm.load_assessments_classes();
                  vm.asmnt_cls_id = "";
                }
              });
          }
        },
        positiveButton: "Delete",
        positiveButtonClass: "negative"
      });
    },
    assessments_students: function(cls_id) {
      showProgressOverlay("notification-loader");
      this.$http
        .post("/api/user/Assessment_students", {
          sch_id: this.sch_id,
          assessment_id: this.asmnt_id,
          cls_id: cls_id
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
            hideProgressOverlay("notification-loader");
            showModal("showNotificationModal");
          }
        });
    },
    editAssessmentModal: function(asmntDate) {
      this.asmntUpdateTime = this.$moment(asmntDate).format("YYYY-MM-DDTHH:mm");
      $("#edit-button-modal > div").removeClass("visible");
      showModal($("#edit-button-modal"));
    }
  }
};
</script>
<style lang="scss">
.topbh {
  display: flex;
  align-items: center;
  div {
    display: flex;
    justify-content: center;
  }
  .back-a {
    background: #efefef;
    width: 85px;
    height: 35px;
    border-radius: 20px;
    align-items: center;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
    :hover {
      cursor: pointer;
    }
  }
}

.table-div-a {
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.05);
}
.table-row-a {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  height: 50px;
  padding: 8px 24px 8px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.table-cell-a {
  width: 25%;
}
.link-a {
  background: rgb(50, 155, 255);
  color: #fff;
  border-radius: 12px;
}
.link-a:hover {
  color: #fff;
  opacity: 0.8;
}

.remove-borderradius {
  border-radius: 0 !important;
}
.cv-button-a {
  padding: 10px 12px;
}
.lesson-topic-list-subtopic > div {
  width: 60px;
  padding: 8px 4px 8px 8px;
  font-size: 16px;
  font-family: "Rubik", sans-serif;
}
.to-make-bold {
  font-weight: bold;
}
.div-card-a {
  padding: 6px 36px;
  background: rgb(5, 155, 255);
}
.div-cardbody-a {
  padding: 12px 0;
  /*border-radius: 12px; */
  background: rgba(0, 0, 0, 0.05);
  height: auto;
  width: 100%;
}
.text-heading-a {
  font-family: "Rubik", sans-serif;
  font-weight: bold;
  font-size: 2rem;
  color: #fff;
}
.text-paragraph-a {
  font-size: 1.2em;
  font-family: "Rubik", sans-serif;
  color: #fff;
}
.highlight-correctoption {
  background: rgb(57, 213, 143);
  color: #fff;
}
.modal-heading-a {
  background: rgb(5, 155, 255) !important;
}
.modal-body-a {
  display: flex;
  flex-direction: column;
  height: 160px;
  align-content: space-between;
}
.modal-body-a > div {
  height: 80px;
}
.modal-body-buttons-a {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
}
</style>
