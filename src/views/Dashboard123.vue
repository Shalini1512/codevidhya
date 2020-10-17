<template>
  <div id="projects-root">
    <Header>
      <HeaderContent />
    </Header>
    <!--User Dashboard-->
    <section class="sptb">
      <div class="container-fluid">
        <div class="row">
          <!--side nav bar-->
          <sideNav></sideNav>
          <!-- end side nav-->

          <div class="col-xl-9 col-lg-12 col-md-12">
            <div class="card mb-0">
              <div class="card-header bg-secondary">
                <h3 class="card-title text-white">Recent Activities</h3>
              </div>
              <div class="card-body">
                <!--this section for course-->
                <div class=" card p-2 row">
                  <div class="col-sm-12 pl-2 pt-2 mb-2">
                    <h3 class="card-title">Courses</h3>
                  </div>
                  <div class="col-sm-12 p-2">
                    <template v-for=" (lms_book,index) in lms_user_books" >
                      <div :key="index" v-if="unlockedCourses[lms_book.book_id]" class="col-sm-6 col-xl-4 col-sm-4 d-inline-block">
                        <div class="card">
                          <span
                            class="badge badge-success m-1"
                            style="position:absolute; right:0"
                            >Beginner</span
                          >
                          <a href="#"
                            ><img
                              class="card-img-top br-tr-3 br-tl-3"
                              src="/assets/images/project-thumbs/web.svg"
                              alt="Well, I didn't vote for you."
                          /></a>
                          <div class="card-body d-flex flex-column">
                            <h4>{{lms_book.book_name}}</h4>
                            <div class="text-muted mt-1"  >
                              <p v-if="lms_book.slug == 'html&css'">Study the Codevidhya HTML & CSS textbook course interactively.</p>
                              <p v-else-if="lms_book.slug == 'html&css_2'">Enhance your html & CSS skills.</p>
                              <p v-else-if="lms_book.slug == 'html&css_3'">Become an expert in HTML &CSS.</p>
                              <p v-else-if="lms_book.slug == 'css'">Study the Codevidhya CSS textbook course interactively.</p>
                              <p v-else-if="lms_book.slug == 'css_2'">Enhance your CSS skills.</p>
                              <p v-else-if="lms_book.slug == 'css_3'">Become an expert in CSS.</p>
                              <p v-else-if="lms_book.slug == 'javascript'">Study the Codevidhya JavaScript textbook course interactively.</p>
                              <p v-else-if="lms_book.slug == 'javascript_2'">Enhance your JavaScript skills.</p>
                              <p v-else-if="lms_book.slug == 'javascript_3'">Become an expert in JavaScript.</p>
                              <p v-else-if="lms_book.slug == 'python'">Study the Codevidhya Python textbook course interactively.</p>
                              <p v-else-if="lms_book.slug == 'python_2'">Enhance your PYTHON skills.</p>
                              <p v-else-if="lms_book.slug == 'python_3'">Become an expert in PYTHON.</p>
                              <p v-else-if="lms_book.slug == 'database'">Study the Codevidhya SQL textbook course interactively.</p>
                              <p v-else-if="lms_book.slug == 'sql_2'">Enhance your SQL skills.</p>
                              <p v-else-if="lms_book.slug == 'sql_3'">Become an expert in SQL.</p>
                              <p v-else-if="lms_book.slug == 'learn_robotics_with_line_follower_robot'">Learn the fundamentals of Robotics programming, Hardware Design and Concepts.</p>
                            </div>
                            <div class="mt-4">
                              <p class="h6" v-if="lms_book.slug == 'html&css'" >Age: 9 to 11</p>
                              <p class="h6" v-else-if="lms_book.slug == 'javascript'" >Age: 12 to 14</p>
                              <p class="h6" v-else-if="lms_book.slug == 'python'" >Age: 15 to 16</p>
                              <p class="h6" v-else-if="lms_book.slug == 'database'" >Ages: 12 to 16</p>
                              <p class="h6" v-else-if="lms_book.slug == 'learn_robotics_with_line_follower_robot'">Ages: 12 to 16</p>
                            </div>
                          </div>
                          <div class="card-footer text-right">
                            <span v-if="unlockedCourses[lms_book.book_id]">
                              <button  class="btn btn-success"  @click="lms_book.level=='Beginner'||lms_book.purchases_status?call_url(lms_book.slug,lms_book.book_id,lms_book.per): notify_for_future1(lms_book.book_name);">Start Learning</button>
                            </span>
                          </div>
                        </div>
                      </div>
                    </template>  
                  </div>
                </div>
                <!--end course section-->
                <!--this section for assessments-->
                <div class=" card p-1 row">
                  <div class="col-sm-12 pl-2 pt-2 mb-2">
                    <h3 class="card-title">Assessments</h3>
                  </div>
                  <div class="col-sm-12 p-2">
                    <template v-for="(assessment, index) in assessments" >
                      <div  :key="index" v-if="!assessment.score" class="col-sm-6 col-xl-4 col-sm-4 d-inline-block">
                        <div class="card">
                          <a href="#"><img class="card-img-top br-tr-3 br-tl-3" src="/assets/images/project-thumbs/web.svg" alt="Well, I didn't vote for you."></a>
                          <div class="card-body d-flex flex-column">
                            <h4>{{ assessment.assessment_name }}</h4>
                            <div class="text-muted">
                              <p style="margin-bottom:4; margin-top:8px;"> Total Questions: {{ assessment.tot_que }} </p>
                              <p style="margin-bottom:4;"> Total Marks : {{ assessment.tot_marks }} </p>
                              <p style="margin-bottom:0; marigin-top:4px;"> Duration : {{ assessment.duration }} min.</p>
                            </div>
                          </div>
                          <div class="card-body d-flex">
                            <button class="btn btn-info"  @click="openModal('instruction-modal')" v-if="role_id == 3" > More </button>
                            <i class="flex-fill"></i>
                            <button class="btn btn-success" v-if="assessment.exam_status == 'true' && assessment.score == null && assessment.user_id != null" @click=" start_exam(assessment.assessment_id, assessment.assessment_name, assessment.duration)"> Resume </button>
                            <button class="btn btn-success" v-else-if="assessment.exam_status == 'false' && assessment.score == null && assessment.user_id == null && $moment(assessment.date) < $moment(serverTime)" @click="start_exam( assessment.assessment_id, assessment.assessment_name, assessment.duration )">Start </button>
                            <button class="btn btn-secondary" v-else-if=" assessment.exam_status == 'true' && assessment.score != null && assessment.user_id != null "> Result will be soon. </button>

                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
                <!--end assessments section-->
                <!--this section for projects-->
                <div class=" card p-1 row">
                  <div class="col-sm-12 pl-2 pt-2 mb-2">
                    <h3 class="card-title">Projects</h3>
                  </div>
                  <div class="col-sm-12 p-2">
                    <template  v-for="project in recentProjects">
                      <div :key="project.project_id" class="col-sm-6 col-xl-4 col-sm-4 d-inline-block"  v-if="!project.hidden" :style="project.hidden ? 'visibility: hidden' : 'visibility: visible'">
                        <div class="card">
                         <div v-if="project.type == 'scratch'" class="project-card-img" style="background-image:url(/assets/images/project-thumbs/scratch.png);" >
                            <div class="project-type-tag" style="background-color: #f1c40f">
                              {{ project.type }}
                            </div>
                          </div>
                          <div v-else-if="project.type == 'python'" class="project-card-img" style="background-image:url(/assets/images/project-thumbs/python.jpg);">
                            <div class="project-type-tag" style="background-color: #3498DB">
                              {{ project.type }}
                            </div>
                          </div>
                          <div v-else class="project-card-img" style="background-image:url(/assets/images/project-thumbs/web.svg);" >
                            <div class="project-type-tag" style="background-color: #E74C3C">
                              {{ project.type }}
                            </div>
                          </div>
                          
                          <div class="card-body d-flex flex-column">
                            <h4>{{ project.name }}</h4>
                            <div class="text-muted">{{ project.description }}</div>
                          </div>
                          <div class="card-footer text-right">
                           <button class="btn btn-success" @click=" $router.push({ name: 'project-editor', params: { id: project.project_id }})"> Edit </button>
                          </div>
                        </div>
                        
                      </div>
                    </template>  
                  </div>
                </div>
                <!--end projects section-->
                <!--this section for quize-->
                <div class=" card p-1 row">
                  <div class="col-sm-12 pl-2 pt-2 mb-2">
                    <h3 class="card-title">Quizzes</h3>
                  </div>
                  <div class="col-sm-12 p-2">
                    <template  v-for="(quiz, quiz_index) in quizzes">
                      <div :key="quiz_index" v-if="quiz.attempted_question != quiz.no_of_questions" class="col-sm-6 col-xl-4 col-sm-4 d-inline-block">

                        <div class="card">
                          <div class="item-card2-img">
                            <img class="card-img-top br-tr-3 br-tl-3" :src="quiz.quiz_img?'/assets/images/'+quiz.quiz_img:'/assets/images/project-thumbs/web.svg'">
                            <div class="item-tag" style="top:15px;">
                                <span class="text-white bg-warning p-1 " style="border-radius:3px;z-index:9999; position:relative" :title="quiz.no_of_questions+' users attempted'"><i class="fa fa-paper-plane" data-toggle="tooltip" title="fa fa-paper-plane"></i> {{quiz.total_attempted}}</span>
                            </div>
                            <div class="item-tag" style="left:15px;">
                                <span class="text-white bg-primary p-1" style="border-radius:3px;">Questions: {{quiz.no_of_questions}}</span>
                            </div>
                            <div class="item-tag" >
                                <span class="text-white bg-primary p-1" style="border-radius:3px;">Points: {{quiz.total_points}}</span>
                            </div>
                          </div>
                          <div class="card-body d-flex flex-column">
                            <div class="item-card2">
                              <div class="item-card2-text mb-3">
                                <h4 class="font-weight-semibold text-dark mb-1" v-html="quiz.quiz_name ? quiz.quiz_name : 'test'"></h4>
                                <div class="mb-1 text-muted" style="font-size:12px;">By: <i class="icon icon-user mr-1"></i><span class="" style="font-size:12px;" v-html="quiz.name ? quiz.name:'Codevidhya'"></span>
                                </div>
                                <p style="font-size:16px; color:#5e748e;" v-if="(quiz.quiz_desc)" v-html="(quiz.quiz_desc).length >=30 ? quiz.quiz_desc.substring(0,30)+'...':quiz.quiz_desc"></p>
                              </div>
                              <div >
                                  <span class="rating-stars d-inline-block mr-2">
                                      <span class="empty-stars"  >
                                        <span class="star"><i class="fas fa-star"></i></span>
                                        <span class="star"><i class="fas fa-star"></i></span>
                                        <span class="star"><i class="fas fa-star"></i></span>
                                        <span class="star"><i class="fas fa-star"></i></span>
                                        <span class="star"><i class="fas fa-star"></i></span>
                                      </span>
                                      <span class="filled-stars" :style="'width:' + (quiz.rating ? quiz.rating * 20 : 0) + '%' ">
                                        <span class="star"><i class="fas fa-star"></i></span>
                                        <span class="star"><i class="fas fa-star"></i></span>
                                        <span class="star"><i class="fas fa-star"></i></span>
                                        <span class="star"><i class="fas fa-star"></i></span>
                                        <span class="star"><i class="fas fa-star"></i></span>
                                      </span>
                                  </span>
                                  <!--<span
                                    class="mx-1 d-inline-block"
                                    style="cursor:pointer"
                                    @click="quiz_reviews(quiz.quiz_id)"
                                    ><u>View all</u>
                                  </span>-->
                              </div>
                            </div>
                          </div>
                          <div class="card-footer d-flex">
                            <i class="flex-fill"></i>
                            <button class="btn btn-success" @click="router.push('/quizzes/quiz-instruction?id='+quiz.quiz_id)">Learn More</button>
                          </div>
                        </div>
                      </div>
                    </template>  
                  </div>
                </div>
                <!--end quizzes section-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--/User Dashboard-->
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
                <i class="fas fa-dot-circle text-danger"></i> 
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
import axios from "axios";
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/dashboard/HeaderContent.vue";
import SideNav from "@/components/dashboard/SideNav.vue";
import Footer from "@/components/footer/Footer.vue";
export default {
  name: "home",
  components: {
    Header,
    HeaderContent,
    SideNav,
    Footer
  },
  data() {
    return {
      userId: 0,
      isSignedIn: "",
      cls_id: this.$store.getters.getAuthData.auth_cls_id,
      user_id: this.$store.getters.getAuthData.auth_user_id,
      sec_id: this.$store.getters.getAuthData.auth_sec_id,
      role_id: this.$store.getters.getAuthData.auth_role_id,
      sch_id: this.$store.getters.getAuthData.auth_sch_id,
      assessments: [],
      serverTime: "",
      unlockedCourses: {},
      lms_books: [],
      lms_user_books: [],
      allQuizzes:[],
      quizzes: [],
      sch_quizzes:[],
      recentProjects: [],
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted: function() {
    //initCvModals();
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.cls_id= this.$store.getters.getAuthData.auth_cls_id;
          this.user_id= this.$store.getters.getAuthData.auth_user_id;
          this.sec_id= this.$store.getters.getAuthData.auth_sec_id;
          this.role_id= this.$store.getters.getAuthData.auth_role_id;
          this.sch_id= this.$store.getters.getAuthData.auth_sch_id;
          this.getServerTime();
          
        }
      }.bind(this)
    );
  },
  methods: {
    openModal: function(modalId) {
      $("#" + modalId + " > div").removeClass("visible");
      showModal($("#" + modalId));
    },
    
    getServerTime: function() {
      this.$http.post("/api/user/getServerTime").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.serverTime = res.body.serverTime;
          this.lmscont(this.userId);
          this.load_assessments();
          this.getAllQuizzess(this.userId);
          this.getRecentProjects();
        }
      });
    },
    lmscont(userId) {
      /*dashboard user cart*/
          this.$http
        .post("/api/user/DisplayUserLmsActivity", {
          user_id: userId
        })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            this.lms_user_books = res.body.data;
           for (var i = 0; i < this.lms_user_books.length; i++) {
     
              this.unlockedCourses[this.lms_user_books[i].book_id] = false;
              if (this.userId == 0) {
                 this.unlockedCourses[this.lms_books[i].book_id] = false;
              } else {
                if(this.sch_id == 1) {
                  // Independent user
                  if(this.lms_user_books[i].purchases_status) {
                    this.unlockedCourses[this.lms_user_books[i].book_id] = true;
                  }
                } else if(this.sch_id != 1) {
                  // School student
                  if(this.isCourseForMyGrade(this.lms_user_books[i].slug)) {
                    this.unlockedCourses[this.lms_user_books[i].book_id] = true;
                  } else {
                    if(this.lms_user_books[i].purchases_status) {
                      this.unlockedCourses[this.lms_user_books[i].book_id] = true;
                    }
                  }
                }
              }

            }
          }
        });
        /*end dashboard user cart*/
    },
     isCourseForMyGrade(slug) {
       
      switch (this.cls_id?this.cls_id:0) {
        case 10:
        case 9:
        case 8: {
          if(~['python', 'database'].indexOf(slug)) return true;
          return false;
        }
        case 7: {
          if(~['javascript', 'database'].indexOf(slug)) return true;
          return false;
        }
        case 6: {
          if(~['javascript'].indexOf(slug)) return true;
          return false;
        }
        case 5:
        case 4: {
          if(~['html&css'].indexOf(slug)) return true;
          return false;
        }
      }
    },
    call_url: function(bookName, bookId, book_per) {
      let ec = btoa(bookId);
      let bookSlug = bookName;

      this.$router.push({
        name: "BooksTopics",
        params: { curName: bookSlug, bookId: ec, book_per: book_per }
      });
      //this.$router.push({name:'BooksTopics', params:{curName:bookName}});
    },
    notify_for_future1: function(e)
    {
      notify("Will be available soon!","warning");
      return false;
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
            this.assessments = [];
            this.cv_assessments = [];
            this.schoolAssessments = [];
            this.schoolUserAssessment = [];
            this.assessmentsForSchool = [];
            this.codevidhyaAssessments = [];
            this.codevidhyaUserAssessment = [];
            this.publicAssessments = [];
            this.publicUserAssessment = [];
            if (this.role_id == 3) {
              this.assessments = res.body.data.concat( res.body.publicAssessments);
            } 
          }
        });
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
          }
        });

      var i;
      var j;
    },
    getAllQuizzess: function(userId) {
      this.$http.post("/api/user/display_all_sub_quizzes", { user_id: userId }).then(function(res) {
        if (res.body.status == "403") {
        } else {
          this.quizzes = res.body.data;
        }
      });
        this.$http.post("/api/user/display_all_school_sub_quizzess",{user_id:userId}).then(function(res){
          if (res.body.status == "403") {
          } else {
            this.sch_quizzes = res.body.data;
            
          }
        });
    
      
    },
    getRecentProjects: function() {
      this.$http
        .post("/api/projects/getRecentProjects")
        .then(function(res) {
          if (res.body.length) {
            var recentProjects = res.body;
            var placeholdersCount = 4 - recentProjects.length;
            for (var i = 0; i < placeholdersCount; i++) {
              // Add these placeholder items to help with flex space-between
              recentProjects.push({
                project_id: "hidden-" + i,
                hidden: "hidden"
              });
            }
            this.recentProjects = recentProjects;
          } else {
            this.recentProjects = [];
          }
        })
        .catch(function() {});
    },
    timeDifference: function(date1) {
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
          node.textContent = "This assessment is live.";
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
