<template>
  <div id="assessments-root" >
    <Header>
      <HeaderContent />
    </Header>
    <div class="container-fluid" >
      <div class="row">
        <div class="col-xl-12 col-lg-12 col-md-12" >
          <div class="card">
            <!--<div class="card-header bg-secondary">
              <h3 class="card-title text-white w-auto">Assessments</h3>
            </div>-->
            <div class="card-body">
                  <template v-for="(assessment,index) in publicUserAssessment" >
                            <div  :key="index" v-if="assessment.score==null && assessment.tot_que!=0 && assessment.assessment_id==asmnt_id" class="col-sm-3 d-inline-block">
                              <div class="card">
                                <img class="card-img-top br-tr-3 br-tl-3" src="/assets/images/project-thumbs/web.svg" alt="Well, I didn't vote for you.">
                                <div class="card-body d-flex flex-column">
                                  <h4>{{ assessment.assessment_name }}</h4>
                                  <div class="text-muted">
                                    <p style="margin-bottom:4; margin-top:8px;"> Total Questions: {{ assessment.tot_que }} </p>
                                    <p style="margin-bottom:4;"> Total Marks : {{ assessment.tot_marks }} </p>
                                    <p style="margin-bottom:0; marigin-top:4px;"> Duration : {{ assessment.duration }} min.</p>
                                  </div>
                                </div>
                                <div class="card-body d-flex">
                                  
                                  <button class="btn btn-info mr-1" onclick="showModal('instruction-modal')">More</button>
                                  <i class="flex-fill"></i>
                                                                 
                            <button class="btn btn-success mr-1" @click="start_exam(assessment.assessment_id, assessment.assessment_name, assessment.duration )">Start</button>

                                </div>
                              </div>
                            </div>
                          </template>
             
              <!----single purchase------>
                  <template v-for="(assessment,index) in packageAssessment">
                    <div  :key="index" v-if="assessment.score==null && assessment.tot_que!=0" class="col-sm-3 d-inline-block">
                              <div class="card">
                                <img class="card-img-top br-tr-3 br-tl-3" src="/assets/images/project-thumbs/web.svg" alt="Well, I didn't vote for you.">
                                 <span v-if="assessment.order_status==0" class="arrow-ribbon bg-primary"><i class="fas fa-rupee-sign"></i> {{assessment.price}}<sup>*</sup></span>
                                <div class="card-body d-flex flex-column">
                                  <h4>{{ assessment.assessment_name }}</h4>
                                  <div class="text-muted">
                                    <p style="margin-bottom:4; margin-top:8px;"> Total Questions: {{ assessment.tot_que }} </p>
                                    <p style="margin-bottom:4;"> Total Marks : {{ assessment.tot_marks }} </p>
                                    <p style="margin-bottom:0; marigin-top:4px;"> Duration : {{ assessment.duration }} min.</p>
                                  </div>
                                </div>
                                <div class="card-body d-flex" v-if="assessment.order_status==0">
                                  
                                  <i class="flex-fill"></i>
                                                     <button class="btn btn-primary mr-1"   @click="buyProducts(assessment.assessment_id)">Buy Now</button>    

                                </div>
                                 <div class="card-body d-flex" v-else>
                                  
                                 <button class="btn btn-info mr-1" onclick="showModal('instruction-modal')">More</button>  
                                  <i class="flex-fill"></i>
                                    <button class="btn btn-success mr-1"  @click="start_exam(assessment.assessment_id, assessment.assessment_name, assessment.duration )">Start</button>

                                </div>
                              </div>
                            </div>

                   
                  </template> 
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
import Header from "@/components/header/Header.vue";
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
      cls_id:'',
      user_id: '',
      sec_id: '',
      role_id: '',
      sch_id: '',
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
      asmntOn:0,
     purchasedAssessments:[],
      packageAssessment:[],
      selectedProducts:new Object(),
      allPackages:[],
   
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
    this.getServerTime();
    if (this.$route.query.assessment) {
      var query = atob(this.$route.query.assessment);
      var params = query.split(",");
      this.asmnt_id = params[0];
      this.asmntOn = params[1];
    }

    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.cls_id= this.$store.getters.getAuthData.auth_cls_id;
          this.user_id= this.$store.getters.getAuthData.auth_user_id;
          this.sec_id= this.$store.getters.getAuthData.auth_sec_id;
          this.role_id= this.$store.getters.getAuthData.auth_role_id;
          this.sch_id= this.$store.getters.getAuthData.auth_sch_id;
          //this.load_attempted_assessment();

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
          this.load_all_packages()
          this.load_assessments();
        }
      });
    },
    load_all_packages : function() {
      this.$http.post("/api/user/All_packages", {}).then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          var allPackages = res.body.all_packages;
          for(var i=0; i<allPackages.length;i++){
            if(allPackages[i].used_for =='assessment'){
              this.allPackages.push(allPackages[i]);
            }
          }
        }
      });
    },
    buyProducts: function(assessment_id){
      
       /*this.$router.push(
        "/institute/assessments/checkout?products=" +
          this.selectedProducts +
          "&purchaseType=" +
          encodeURIComponent(buyType) 
      );*/

      this.$router.push({
        name: "individualassessmentcheckout",
        query: { assessmentDetail:assessment_id }});

    },
    load_attempted_assessment: function() {
      this.$http
        .post("/api/user/DisplayAssessment",{user_id:this.userId, sch_id:this.sch_id,cls_id:this.cls_id,role_id:this.role_id})
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.publicUserAssessment=[]
             this.assessments = res.body.assessments;
               var assreport= new Object();
              for (var i = 0; i < this.assessments.length; i++) {
                if (
                  this.assessments[i].sch_id == 0 &&
                  this.assessments[i].role_id == 3 &&
                  this.assessments[i].book_id == 0 &&
                  this.assessments[i].used_for == 1 &&
                  this.assessments[i].tot_que!=0
                ) {
                      this.publicUserAssessment.push(this.assessments[i]);
                }
              }
          }
        });
    },
    load_assessments: function() {
      this.$http
        .post("/api/user/DisplayIndividualAssessment",{user_id:this.userId})
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.publicUserAssessment=[]
             this.assessments = res.body.assessments;
               var assreport= new Object();
              for (var i = 0; i < this.assessments.length; i++) {
                if (
                  this.assessments[i].sch_id == 0 &&
                  this.assessments[i].role_id == 3 &&
                  this.assessments[i].book_id == 0 &&
                  this.assessments[i].used_for == 1 &&
                  this.assessments[i].tot_que!=0
                ) {
                      this.publicUserAssessment.push(this.assessments[i]);
                }

                if(this.assessments[i].price!=0 && this.assessments[i].status==1){
                this.packageAssessment.push(this.assessments[i]);

                if(this.assessments[i].price!=0 && this.assessments[i].package_id && this.assessments[i].order_id){
                  this.purchasedAssessments.push(this.assessments[i]);
                }
              }
              }
          }
        });
    },
  
    start_exam: function(asmnt_id, asmnt_name, duration) {
     // console.log(btoa(98 + "," + 3))
      window.localStorage.removeItem('userAns')
      var det = btoa(asmnt_id + "," + asmnt_name + "," + duration+','+this.asmntOn);
     if(this.userId){
       this.$http
        .post("/api/individualAssessments/CheckAssessment", {
          user_id: this.userId,
          assessment_id: asmnt_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            if (res.body.exam == 1) {
              cvNotify(
                "You have already attempted this assessment..!!",
                "notice"
              );
            } else {
              this.$router.push({path: "/individual/assessment/assessment-exam",query: { assessment: det }});
            }
          }
        });
        
      }else{
          this.$router.push({path: "/individual/assessment/assessment-exam",query: { assessment: det }});
      }
    
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

blink {
  -webkit-animation: 1.2s linear infinite condemned_blink_effect; /* for Safari 4.0 - 8.0 */
  animation: 1.2s linear infinite condemned_blink_effect;

}

/* for Safari 4.0 - 8.0 */
@-webkit-keyframes condemned_blink_effect { 
  0% {
    visibility: hidden;
  }
  50% {
    visibility: hidden;
  }
  100% {
    visibility: visible;
  }
}

@keyframes condemned_blink_effect {
  0% {
    visibility: hidden;
  }
  50% {
    visibility: hidden;
  }
  100% {
    visibility: visible;
  }
}
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
