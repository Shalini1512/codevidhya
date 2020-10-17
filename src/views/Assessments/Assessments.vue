<template>
  <div id="assessments-root" >
    <Header>
      <HeaderContent />
    </Header>
    <div class="container-fluid" >
      <div class="row">
        <div class="col-xl-12 col-lg-12 col-md-12" >
          <div class="card">
            <div class="card-header bg-secondary">
              <h3 class="card-title text-white w-auto">Assessments</h3>
            </div>
            <div class="card-body">
              <div class="panel panel-primary">
                <div class="tab-menu-heading">
                  
                  <div class="tabs-menu ">
                    <!-- Tabs -->
                    <ul class="nav panel-tabs">
                      <li class="" v-if="sch_id!=1"><a href="#instituteAssessments" class="active" data-toggle="tab">Institute Assessments<span class="badge badge-pill badge-secondary">{{schoolUserAssessment.length}}</span></a></li>
                      <li><a href="#codevidhyaSkillAssessments" data-toggle="tab" :class="sch_id==1?'active':''">Codevidhya Skill Assessments <span class="badge badge-pill badge-secondary">{{codevidhyaUserAssessment.length}}</span></a></li>
                      <li><a href="#checkYourCodingQuotient" id="coding-quotient-tab" data-toggle="tab">Check Your Coding Quotient <span class="badge badge-pill badge-secondary">{{publicUserAssessment.length}}</span></a></li>
                      <li><a href="#assessmentReport" id="assessmentReportTab" data-toggle="tab">Assessment Report</a></li>
                    </ul>
                  </div>
                </div>
                <div class="panel-body tabs-menu-body">
                  <div class="tab-content">
                    <div :class="sch_id!=1?'tab-pane active':'tab-pane'" id="instituteAssessments">
                      <!--School Assessment card  start for school-->
                          <div v-if="schoolUserAssessment.length">
                          <template v-for="(assessment, index) in schoolUserAssessment" >
                            <div  :key="index" v-if="assessment.score==null && assessment.tot_que!=0" class="col-sm-3 d-inline-block">
                              <div class="card">
                                <img class="card-img-top br-tr-3 br-tl-3" src="/assets/images/project-thumbs/web.svg" alt="Well, I didn't vote for you.">
                                <span v-if="assessment.score==null && ($moment(assessment.date) > $moment(serverTime))" class="badge badge-warning p-2 col-sm-12 remaining-time" style="position:absolute; right:0;" :data-remaining-time="assessment.date"></span>
                                <div class="card-body d-flex flex-column">
                                  <h4>{{ assessment.assessment_name }}</h4>
                                  <div class="text-muted">
                                    <p style="margin-bottom:4; margin-top:8px;"> Total Questions: {{ assessment.tot_que }} </p>
                                    <p style="margin-bottom:4;"> Total Marks : {{ assessment.tot_marks }} </p>
                                    <p style="margin-bottom:0; marigin-top:4px;"> Duration : {{ assessment.duration }} min.</p>
                                  </div>
                                </div>
                                <div class="card-body d-flex">
                                  
                                  <button class="btn btn-sm btn-info"  @click="openModal('instruction-modal')" v-if="role_id == 3" > More </button>
                                  <i class="flex-fill"></i>
                                  <button class="btn btn-sm btn-success bd-highlight" v-if=" assessment.exam_status == 'true' && assessment.exam__submit_status ==0 && assessment.score == null && assessment.user_id != null" @click="start_exam(assessment.assessment_id,assessment.assessment_name,assessment.duration)"> Resume </button>
                                    <button class="btn btn-sm btn-success bd-highlight" v-else-if=" assessment.exam_status == 'false' && assessment.score == null && assessment.user_id == null && ($moment(assessment.date).format('YYYY-MM-DD') == $moment(serverTime).format('YYYY-MM-DD'))" @click="start_exam(assessment.assessment_id,assessment.assessment_name,assessment.duration)"> Start </button>
                                    <button class="btn btn-sm btn-primary bd-highlight" v-else-if="  assessment.score != null && assessment.user_id != null " onclick="$('#assessmentReportTab').click();" > Result </button>
                                </div>
                              </div>
                            </div>
                          </template>
                        </div>
                        <div v-if="!schoolUserAssessment.length">
                          <h5 style="color:#666"> There is no assessment scheduled by institute. </h5> 
                        </div>
                      <!-- school Assessment card end-->
                    </div>
                    <div :class="sch_id==1?'tab-pane active':'tab-pane'" id="codevidhyaSkillAssessments">
                      <!--codevidhya skill Assessment card  start for school-->
                        <div v-if="codevidhyaUserAssessment.length">
                          <template v-for="(assessment, index) in codevidhyaUserAssessment" >
                            <div  :key="index" v-if="assessment.score==null && assessment.tot_que!=0" class="col-sm-3 d-inline-block">
                              <div class="card">
                                <img class="card-img-top br-tr-3 br-tl-3" src="/assets/images/project-thumbs/web.svg" alt="Well, I didn't vote for you.">
                                <span v-if="assessment.score==null && ($moment(assessment.date) > $moment(serverTime))" class="badge badge-warning p-2 col-sm-12 remaining-time" style="position:absolute; right:0;" :data-remaining-time="assessment.date"></span>
                                <div class="card-body d-flex flex-column">
                                  <h4>{{ assessment.assessment_name }}</h4>
                                  <div class="text-muted">
                                    <p style="margin-bottom:4; margin-top:8px;"> Total Questions: {{ assessment.tot_que }} </p>
                                    <p style="margin-bottom:4;"> Total Marks : {{ assessment.tot_marks }} </p>
                                    <p style="margin-bottom:0; marigin-top:4px;"> Duration : {{ assessment.duration }} min.</p>
                                  </div>
                                </div>
                                <div class="card-body d-flex">
                                  <button class="btn btn-sm btn-info"  @click="openModal('instruction-modal')" v-if="role_id == 3" > More </button>
                                  <i class="flex-fill"></i>
                                  <!--<button class="btn btn-sm btn-success bd-highlight" v-if=" assessment.exam_status == 'true' && assessment.score == null && assessment.user_id != null" @click="start_exam(assessment.assessment_id,assessment.assessment_name,assessment.duration)"> Resume </button>-->
                                    <button class="btn btn-sm btn-success bd-highlight" v-if=" assessment.exam_status == 'false' && assessment.score == null && assessment.user_id == null && $moment(assessment.date) < $moment(serverTime)" @click="start_exam(assessment.assessment_id,assessment.assessment_name,assessment.duration)"> Start </button>
                                    <button class="btn btn-sm btn-primary bd-highlight" v-else-if="  assessment.score != null && assessment.user_id != null " onclick="$('#assessmentReportTab').click();" > Result </button>
                                </div>
                              </div>
                            </div>
                          </template>
                        </div>
                        <div v-if="!codevidhyaUserAssessment.length">
                          <h5 style="color:#666"> There is no assessment scheduled by Codevidhya. </h5> 
                        </div>
                      <!-- school Assessment card end-->
                    </div>
                    <div class="tab-pane " id="checkYourCodingQuotient">
                      <!--coding quotient Assessment card  start for school-->
                        <div v-if="publicUserAssessment.length">
                          <template v-for="(assessment, index) in publicUserAssessment" >
                            <div  :key="index" v-if="assessment.tot_que!=0" class="col-sm-3 d-inline-block">
                              <div class="card">
                                <img class="card-img-top br-tr-3 br-tl-3" src="/assets/images/project-thumbs/web.svg" alt="Well, I didn't vote for you.">
                                <span v-if="assessment.score==null && ($moment(assessment.date) > $moment(serverTime))" class="badge badge-warning p-2 col-sm-12 remaining-time" style="position:absolute; right:0;" :data-remaining-time="assessment.date"></span>
                                <span v-if="assessment.score" class="badge badge-success p-2 col-sm-12" style="position:absolute; right:0;">Attempted</span>
                                <div class="card-body d-flex flex-column">
                                  <h4>{{ assessment.assessment_name }}</h4>
                                  <div class="text-muted">
                                    <p style="margin-bottom:4; margin-top:8px;"> Total Questions: {{ assessment.tot_que }} </p>
                                    <p style="margin-bottom:4;"> Total Marks : {{ assessment.tot_marks }} </p>
                                    <p style="margin-bottom:0; marigin-top:4px;"> Duration : {{ assessment.duration }} min.</p>
                                  </div>
                                </div>
                                <div class="card-body d-flex">
                                  <button class="btn btn-sm btn-info"  @click="openModal('instruction-modal')" v-if="role_id == 3" > More </button>
                                  <i class="flex-fill"></i>
                                  <!--<button class="btn btn-sm btn-success bd-highlight" v-if=" assessment.exam_status == 'true' && assessment.score == null && assessment.user_id != null" @click="start_exam(assessment.assessment_id,assessment.assessment_name,assessment.duration)"> Resume </button>-->
                                    <button :id="'start-btn'" class="btn btn-sm btn-success bd-highlight" v-if=" assessment.exam_status == 'false' && assessment.score == null && assessment.user_id == null && $moment(assessment.date) < $moment(serverTime)" @click="start_exam(assessment.assessment_id,assessment.assessment_name,assessment.duration)"> Start </button>
                                    <button class="btn btn-sm btn-primary bd-highlight" v-else-if="  assessment.score != null && assessment.user_id != null " onclick="$('#assessmentReportTab').click();" > Result </button>
                                </div>
                              </div>
                            </div>
                          </template>
                        </div>
                        <div v-if="!publicUserAssessment.length">
                          <h5 style="color:#666"> There is no assessment scheduled. </h5> 
                        </div>
                        <!-- coding quatient Assessment card end-->
                    </div>
                    <div class="tab-pane" id="assessmentReport">
                      <div v-if="studentReport.length">
                        <template v-for="(assessment, index) in studentReport">
                          <div
                            class="row bg-secondary text-white p-2 d-flex align-items-center mb-2"
                            :key="index"
                            v-if="
                              assessment.score != null &&
                                assessment.book_id == 0
                            "
                          >
                            <div class="col-sm-4">
                              {{ assessment.assessment_name }}
                            </div>
                            <div class="col-sm-4">
                              You got
                              <span class="badge badge-success ml-1 mr-1">{{
                                assessment.score
                              }}</span>
                              marks out of
                              <span class="badge badge-primary ml-1 mr-1">{{
                                assessment.tot_marks
                              }}</span>
                              marks.
                            </div>
                            <div
                              class="col-sm-4 text-right"
                              
                            >
                              <button
                                class="btn btn-warning mr-1"
                                @click="
                                  st_view_report(
                                    assessment.assessment_id,
                                    assessment.sch_id
                                  )
                                "
                              >
                                Report
                              </button>
                              <button
                              
                                class="btn btn-primary mr-1"
                                @click="view_solution(assessment.assessment_id)"
                              >
                                Solution
                              </button>
                            </div>
                          </div>
                        </template>
                      </div>
                      <div
                        v-else
                        class="row"
                        style="margin:4px; padding:5px 5px;"
                      >
                        <div class="quediv-a">
                          <h5 style="color:#666">No Record.</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    
    <!-- iNSTRUCTION Modal details -->
    <div id="instruction-modal" class="cv-modal normal">
      <div style="max-width:3000px; width:90%; height: 90%;">
        <div class="row bg-secondary p-2 text-white mb-2"><div class="col-sm-12"><h4>Assessment Instructions</h4></div></div>
        <div class="cv-input-group p-2" style="overflow:auto;">
          <p class="mb-2"  style="color:#000000"> <i class="fas fa-dot-circle" aria-hidden="true" style="color:#08CA73" ></i>
            &nbsp; <strong> Countdown Timer:</strong> The countdown timer at the
            top right of screen will display the remaining time available for
            you to complete the examination. when the timer reaches zero, the
            examination will end automatically. You need not terminate the
            examination or submit your paper.
          </p>
          
          <p class="mb-2" style="color:#000000">
            <i class="fas fa-dot-circle" style=" color:#08CA73"></i> &nbsp; Note
            that your answer for the current question will not be saved, if you
            navigate to another question directly by clicking on a question
            number without saving the answer to the previous question.
          </p>
          <p class="mb-2" style="color:#000000">
            <i class="fas fa-dot-circle" style=" color:#08CA73"></i>
            &nbsp;<strong>Answering a Question : </strong>
          </p>
          <p style="color:#000000">
            Procedure for answering a multiple choice question:
          </p>
          <p class="pl-4">
            <ul class="p-2" type="none">
              <li>
                <i class="fas fa-dot-circle text-danger"></i> 
                <b> Choose one answer from the 4 options (A,B,C,D) given below the question, click on the bubble placed before the chosen option.</b>
              </li>
              <li>
                        <i class="fas fa-dot-circle text-danger"
                        
                        ></i> 
                <b>To deselect your chosen answer, click on the bubble of the chosen option again or click on the Clear Response button.</b>
              </li>
              <li>
                <i class="fas fa-dot-circle text-danger"></i> 
                <b>To change your chosen answer. click on the bubble of another option.</b>
              </li>
              <li>
                <i class="fas fa-dot-circle text-danger" ></i> 
                <b>To save your answer, you MUST click on the</b> <strong> Save & Next</strong>
              </li>

            </ul>
          </p>  

          <p class="mb-2" style="color:#000000">
            <i class="fas fa-dot-circle text-success"></i> &nbsp;
            Sections of the question paper are displayed on the top bar of the
            screen. Questions in this section can be viewed by clicking on the
            name of the section.
          </p>
          <p  class="mb-2" style="color:#000000">
            <i class="fas fa-dot-circle text-success"></i> &nbsp;
            After clicking the <strong> Save & Next</strong> for the last
            question in a section, you will automatically be taken to the first
            question of the next section.
          </p>
          <p  class="mb-2" style="color:#000000">
            <i class="fas fa-dot-circle text-success"></i> &nbsp;
            <strong>Read the following instructions carefully:</strong>
          </p>
          <p class="pl-4">
            <ul type="none">
              <li>
                <i class="fas fa-dot-circle text-danger"></i>
                <b>This test comprises multiple-choice questions (MCQs). </b>
              </li>
              <li>
                <i class="fas fa-dot-circle text-danger"></i>
                <b
                  >You are advised not to close the browser window before
                  submitting the test.</b
                >
              </li>
              <li>
                <i class="fas fa-dot-circle text-danger"></i>
                <b
                  >In case the test does not load completely or becomes
                  un-responsive, click on browser's refresh button to reload.</b
                >
              </li>
              <li>
                <i class="fas fa-dot-circle" style="color:#FF6633"></i>
                <b
                  >You can write this test only once, so for best results do not
                  try to guess answers.
                </b>
              </li>
               <li>
                <i class="fas fa-dot-circle" style="color:#FF6633"></i>
                <b>No negetive marking for wrong answers. </b>
              </li>
            </ul>
          </p>  
          <br>
          <p class="mb-2" style="color:#000000">
            <i class="fas fa-dot-circle" style=" color:#08CA73"></i> &nbsp;
            <strong> Declaration : </strong>
          </p>
          <p class="mb-2 pt-2" style="color:#000000">
            I have read all the instructions carefully and have understood them.
            I agree not to cheat or use unfair means in this examination. I
            understand that using unfair means of any sort for my own or someone
            else's advantage will lead to my immediate disqualification. The
            decision of <strong>Codevidhya</strong> will be final in these
            matters and cannot be appealed.
          </p>
        </div>
        <div class="text-center">
          <button class="btn btn-info" onclick="hideModal('instruction-modal');">Close </button>
        </div>
      </div>
    </div>
    <!---->
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
      codevidhyaAssessments: [],
      schoolAssessments: [],
      cv_assessments: [],
      userAssessment: [],
      publicUserAssessment: [],
      codevidhyaUserAssessment: [],
      schoolUserAssessment: [],
      assessmentsForSchool: [],
      studentReport: [],
      sch_classes: [],
      classes: [],
      asmnt_classes: [],
      queForGrade: [],
      serverTime: "",
      remainingTime: "",
      disabl: 0,
      sub_name: "",
      que_type: "obj_type",
      asmnt_id: 0,
      asmnt_cls_id: 0,
      students: [],
      st_count: 0,
      subjects: [],
      sub_id: "",
      search_que: "",
      allQuestions: [],
      newSubject: "",
      inputType: "que",
      queId: 0,
      updateQuestion: [],
      question: "",
      opt1: "",
      opt2: "",
      opt3: "",
      opt4: "",
      questionImg: "",
      opt1Img: "",
      opt2Img: "",
      opt3Img: "",
      opt4Img: "",
      trueAns: 0,
      content: "",
      imagePreview: "",
      config: {
        toolbar: [
          {
            name: "basicstyles",
            items: [
              "Bold",
              "Italic",
              "Underline",
              "Strike",
              "Subscript",
              "Superscript"
            ]
          },
          {
            name: "paragraph",
            items: ["NumberedList", "BulletedList", "-", "Outdent", "Indent"]
          },
          { name: "colors", items: ["TextColor", "BGColor"] },
          {
            name: "insert",
            items: ["Table", "SpecialChar"]
          },
          { name: "styles", items: ["Font", "FontSize"] }
        ]
      },
    };
  },
  beforeCreate() {
    
  },
  created() {
    
  },
  beforeMount() {},
  updated : function(){
      var vm = this;
      var items = $('.remaining-time');
			for(var i=0 ; i<items.length; i++){
        var assessmentDate = items[i].dataset.remainingTime
        
				var timeDiff = vm.timeDifference(assessmentDate);
        this.countdown(timeDiff, items[i])
      }
  },
  mounted: function() {
    //initCvModals();
    
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.getServerTime();
          if (this.$route.query.type) {
            if(this.$route.query.type == 'coding-quotient'){
              $('#coding-quotient-tab').click();
            }
          }
        }else  if (!userId) {
          this.$router.push(
            "/login?redirect=" + encodeURIComponent(window.location.href)
          );
        }  
      }.bind(this)
    );
  },
  methods: {
    openModal: function(modalId) {
      $("#" + modalId + " > div").removeClass("visible");
      showModal($("#" + modalId));
    },
    assessmentDetails: function(assessment_id) {
      var det = btoa(assessment_id);
      this.$router.push({
        name: "assessmentdetail",
        query: { assessment: det }
      });
    },
    getServerTime: function() {
      this.$http.post("/api/user/getServerTime").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.serverTime = res.body.serverTime;
          this.load_classes();
          this.load_assessments();
          //this.assessmentForUsers();
          this.load_all_subjects();
          this.load_questions();
        }
      });
    },
    load_classes: function() {
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
    load_all_subjects: function() {
      this.$http.post("/api/user/All_subjects", {}).then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.subjects = res.body.all_subject;
        }
      });
    },
    load_questions: function() {
      this.$http
        .post("/api/user/Subject_questions", {
          sub_id: this.sub_id,
          search_for: this.search_que,
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
    editQuestion: function(queId, question) {
      this.updateQuestion = [];
      this.queId = queId;
      this.updateQuestion = question;
      showModal("updateQueInQueTab-button-modal");
    },
    deleteQuestion: function(que_id) {
      var vm = this;
      showConfirmationDialog({
        title:
          '<span class="text-danger">Are you sure to delete this question?</span>',
        message:
          "Once you delete it, you will not be able to use this question anymore.",
        callback: function(type) {
          if (type == "positive") {
            vm.$http
              .post("/api/user/disableQuestion", {
                que_id: que_id,
                sch_id: vm.sch_id
              })
              .then(function(res) {
                if (res.body.status == "403") {
                  //this.$router.push('/login');
                } else {
                  if (res.body.success == 1) {
                    cvNotify("You have successfully deleted", "success");
                    vm.load_questions();
                  }
                }
              });
          }
        },
        positiveButton: "Delete",
        positiveButtonClass: "negative"
      });
    },

    assessmentForUsers: function() {
      var cls_id;
      this.schoolUserAssessment=[]
      if (this.role_id == 2) {
        cls_id = 0;
      } else {
        cls_id = this.cls_id;
      }
      this.$http
        .post("/api/user/assessmentForUsers", {
          cls_id: cls_id,
          sch_id: this.sch_id,
          user_id: this.user_id,
          role_id: this.role_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            var assessments = res.body.data;
            if (this.role_id == 3) {
              for (var i = 0; i < assessments.length; i++) {
                if (assessments[i].sch_id == 0 && assessments[i].book_id == 0) {
                  this.codevidhyaUserAssessment.push(assessments[i]);
                } else {
                  this.schoolUserAssessment.push(assessments[i]);
                }
              }
            } else {
              this.userAssessment = assessments;
            }
          }
        });
    },
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
            this.assessments=[]
            this.cv_assessments=[]
            this.schoolAssessments=[]
            this.assessmentsForSchool=[]
            this.codevidhyaAssessments=[]
            this.codevidhyaUserAssessment=[]
            this.publicAssessments=[]
            this.publicUserAssessment=[]
            if (this.role_id == 3) {
              this.assessments = res.body.data;
               var assreport= new Object();
              for (var i = 0; i < this.assessments.length; i++) {

                if (
                  this.assessments[i].sch_id == 0 &&
                   this.assessments[i].role_id == 3 &&
                  this.assessments[i].book_id == 0 &&
                   this.assessments[i].status == 1 &&
                  this.assessments[i].used_for == 0 &&
                  this.assessments[i].tot_que!=0
                ) {
                    if(this.assessments[i].score==null)
                    {
                      this.codevidhyaUserAssessment.push(this.assessments[i]);
                    }
                      
                }  
                if (
                  this.assessments[i].sch_id==this.sch_id && 
                   this.assessments[i].role_id == 3 &&
                  this.assessments[i].book_id == 0 &&
                  this.assessments[i].status == 1 &&
                  this.assessments[i].used_for == 0 &&
                  this.assessments[i].tot_que!=0
                ) {
                    if(this.assessments[i].score==null) 
                      this.schoolUserAssessment.push(this.assessments[i]);
                }

                if (
                  this.assessments[i].sch_id == 0 &&
                  this.assessments[i].role_id == 3 &&
                  this.assessments[i].book_id == 0 &&
                  this.assessments[i].used_for == 1 &&
                  this.assessments[i].tot_que!=0
                ) {
                    //if(this.assessments[i].score==null)
                      this.publicUserAssessment.push(this.assessments[i]);
                }

                if (
                  this.assessments[i].score != null &&
                  this.assessments[i].book_id == 0
                ) {
                 
                  if (!assreport.hasOwnProperty(this.assessments[i].assessment_id)) {
                    assreport[this.assessments[i].assessment_id] = this.assessments[i];
                    this.studentReport.push(this.assessments[i]);
                }
                 
                }
              }
            } 
            
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

    start_exam: function(asmnt_id, asmnt_name, duration) {
      this.$http
        .post("/api/user/Insert_assessment_time", {
          user_id: this.user_id,
          duration: duration,
          assessment_id: asmnt_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            var det = btoa(asmnt_id + "," + asmnt_name);
            this.$router.push({
              path: "/assessments/assessment-exam",
              query: { assessment: det }
            });
            //this.$router.push({path: '/Assessments/Assessment-Exam', query: {assessment_id: asmnt_id, assessment_name:assessment_name}});
          }
        });

      var i;
      var j;
    },
    view_solution: function(asmnt_id) {
      var det = btoa(asmnt_id + "," + this.user_id + "," + this.cls_id);
      this.$router.push({
        path: "/assessments/solution",
        query: { assessment: det }
      });
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
      var det = btoa(asmnt_id + "," + this.user_id + "," + this.cls_id);
      this.$router.push({
          path: "/assessments/view-report",
          query: { assessment: det }
        });
        /*
      if (sch_id == 0) {
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
      var det = btoa(this.asmnt_id + "," + user_id + "," + this.asmnt_cls_id);
      if (sch_id == 0) {
        this.$router.push({
          path: "/assessments/cv-student-report",
          query: { assessment: det }
        });
      } else {
        this.$router.push({
          path: "/assessments/student-report",
          query: { assessment: det }
        });
      }
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
    },
    timeDifference: function(date1) {
      //var dt =
      var dateA = new Date(date1).getTime();
      var dateB = new Date(this.serverTime).getTime();
      var timeDiff = Math.floor((dateA - dateB) / 1000);
      return timeDiff;
    },
    countdown: function(seconds, node) {
      var endTime, hours, minutes, msLeft, time, seconds, days;
      var vm = this;
      function twoDigits(n) {
        return n <= 9 ? "0" + n : n;
      }

      function updateTimer(prevtime, node) {
        var msLeft = prevtime - 1;
        if (msLeft < 1) {
          node.textContent = "Live now.";
          //node.style.display="none";
          //vm.getServerTime();
        } else {
          seconds = msLeft;
          minutes = Math.floor(seconds / 60);
          hours = Math.floor(minutes / 60);
          days = Math.floor(hours / 24);
          hours = hours - days * 24;
          minutes = minutes - days * 24 * 60 - hours * 60;
          seconds =
            seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

          node.textContent =
            (days > 0 ? days + " Days " : "") +
            (hours ? hours + " Hours " : "") +
            (minutes ? minutes + " Minutes " : "") +
            seconds +
            " Seconds";
        }
        setTimeout(updateTimer, 1000, msLeft, node);
      }
      updateTimer(seconds, node);
    },
    shareAssessment: function(sharedType) {
      if (sharedType == "facebook") {
        var a = document.createElement("a");
        a.target = "_blank";
        a.href =
          "https://www.facebook.com/sharer/sharer.php?u=https://codevidhya.com/MySharedCode/share-assessment.php?src=sdkpreparse";
        a.click();
      } else if (sharedType == "whatsapp") {
        window.open(
          "https://api.whatsapp.com/send?text=https://codevidhya.com/MySharedCode/share-assessment.php",
          "_blank"
        );
      } else if (sharedType == "twitter") {
        window.open(
          "https://www.twitter.com/share?url=https://codevidhya.com/MySharedCode/share-assessment.php",
          "_blank"
        );
      } else if (sharedType == "linkedin") {
        window.open(
          "https://www.linkedin.com/shareArticle?mini=true&url=https://codevidhya.com/MySharedCode/share-assessment.php",
          "_blank"
        );
      }
    }
  }
};
</script>

<style lang="scss">
#assessments-root {
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
