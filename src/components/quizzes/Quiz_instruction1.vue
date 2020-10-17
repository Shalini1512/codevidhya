<template>
  <div>
    <Header></Header>
    <div style="padding: 24px 24px 8px;">
      <div class="cv-input-group">
        <!--review for all-->
        <div class="cv-modal medium" id="quiz_reviews">
          <div style="padding: 24px 24px 8px;">
            <div
              class="header text-center"
              style="width:100%;"
              v-if="review_all.length"
            >
              <h3>
                {{ review_all[0].quiz_name ? review_all[0].quiz_name : "test" }}
                Reviews
              </h3>
            </div>
            <div class="body">
              <div
                class="lesson-cards testimonials-card"
                v-for="(review, rev_index) in review_all"
                v-bind:key="rev_index"
              >
                <div style="display:flex;flex-direction:row; width:100%;">
                  <img
                    :src="
                      review.profile_pic
                        ? '/assets/images/users/' + review.profile_pic
                        : '/assets/images/users/user.svg'
                    "
                    class="review-person"
                    style="flex-shrink: 0;width:56px;height:56px;padding:4px;background:#ddd;border-radius: 50%;"
                  />
                  <div
                    style="display:flex;flex-direction:column;margin-left:5%; width:100%;"
                  >
                    <div
                      style="display:flex;flex-direction:row;margin-top:5%;font-size:22px;min-width:100%;"
                    >
                      <span style="flex-grow:3">{{
                        review.name ? review.name : "Test"
                      }}</span>
                      <!--<span class="text-right" style="flex-grow:1"><input id="star-rating" class="rating lesson-review-item-rating" type="text" :value="(review.obt_rat).toString()" data-size="xs"/></span>-->
                      <div
                        class="rating-container theme-krajee-fas rating-xs rating-animate is-display-only"
                      >
                        <div class="rating-stars" title="">
                          <span class="empty-stars">
                            <span class="star"><i class="far fa-star"></i></span
                            ><span class="star"
                              ><i class="far fa-star"></i></span
                            ><span class="star"
                              ><i class="far fa-star"></i></span
                            ><span class="star"
                              ><i class="far fa-star"></i></span
                            ><span class="star"
                              ><i class="far fa-star"></i></span
                          ></span>
                          <span
                            class="filled-stars"
                            :style="'width:' + review.obt_rat * 20 + '%;'"
                            ><span class="star"
                              ><i class="fas fa-star"></i></span
                            ><span class="star"
                              ><i class="fas fa-star"></i></span
                            ><span class="star"
                              ><i class="fas fa-star"></i></span
                            ><span class="star"
                              ><i class="fas fa-star"></i></span
                            ><span class="star"
                              ><i class="fas fa-star"></i></span
                          ></span>
                        </div>
                      </div>
                    </div>
                    <div
                      class="cv-testimonials"
                      style="line-height:1.44;letter-spacing:.5px; font-style:italic;padding-top:12px;padding-left:10px;padding-right:10px;text-align:left;margin-top:10px;"
                    >
                      "{{ review.message }}"
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-2 text-right">
              <button
                class="btn btn-danger"
                onclick="hideModal('quiz_reviews')"
              >
                Close
              </button>
            </div>
          </div>
        </div>
        <!--end review for all-->

        <!--instruction-->
        <div class="cv-modal normal" id="quiz-instruction">
          <div style="padding: 24px 24px 8px;height:98%;width:98%;">
            <div
              class="header text-center"
              style="background:#20c997;color:#fff;padding:5px; fontsize:18px;margin-top:5px;margin-bottom:5px;"
            >
              <h3>
                {{ quiz_detail.length ? quiz_detail[0].quiz_name : "test" }}
              </h3>
            </div>
            <div class="body">
              <!--Modal-->
              <!--<div class="row heading" id="headr1" style="background:#20c997;color:#fff;padding:5px; fontsize:18px;margin-top:5px;margin-bottom:5px;">
							<div class="col-sm-12 text-center"><h4>{{quiz_detail.length?quiz_detail[0].quiz_name:''}} </h4></div> 
							
						</div>-->
              <div class="cv-input-group mt-2" style="overflow:auto;">
                <!-- <div class="d-flex">
                    <p class="flex-grow-1">Total Questions : {{quiz_detail.length?quiz_detail[0].total_question:''}}</p>
                    <p class="flex-grow-1 text-right">Total point : {{quiz_detail.length?quiz_detail[0].total_marks:''}}</p>
                </div>-->
                <h4 style="color:#000">Instruction:</h4>
                <p class="my-1" style="color:#000000">
                  <i
                    class="fas fa-dot-circle"
                    aria-hidden="true"
                    style="color:#20c997"
                  ></i>
                  &nbsp; This practice quiz is to determine your understanding
                  of the
                  {{ quiz_detail.length ? quiz_detail[0].quiz_subject : "" }}
                </p>
                <p class="my-1" style="color:#000000">
                  <i class="fas fa-dot-circle" style=" color:#20c997"></i>
                  &nbsp; You have only 1 attempt to complete the quiz.
                </p>
                <p class="my-1" style="color:#000000">
                  <i class="fas fa-dot-circle" style=" color:#20c997"></i>
                  &nbsp;<strong>Answering a Question : </strong>
                </p>
                <p class="my-1" style="color:#000000">
                  For each quiz exercise, select the appropriate option.
                </p>
                <ul class="scndul my-1" type="none">
                  <li>
                    <i class="fas fa-dot-circle" style="color:#fd7e14"></i>
                    There are one or more possible options for each question.
                  </li>
                </ul>

                <ul class="scndul my-1" type="none">
                  <li>
                    <i class="fas fa-dot-circle" style="color:#fd7e14"></i>
                    Don't just guess the correct options, think about them.
                  </li>
                </ul>

                <ul class="scndul my-1" type="none">
                  <li>
                    <i class="fas fa-dot-circle" style="color:#fd7e14"></i> When
                    you complete the quiz, you can check your score, questions
                    attempted and not attempted and also the correct option for
                    each question along with the description.
                  </li>
                </ul>

                <ul class="scndul my-1" type="none">
                  <li>
                    <i class="fas fa-dot-circle" style="color:#fd7e14"></i> You
                    will earn coins as a reward when you complete the quiz.
                  </li>
                </ul>
                <p class="my-1" style="color:#000000">
                  <i class="fas fa-dot-circle" style=" color:#20c997"></i>
                  &nbsp; You can share the quiz you attempted on different
                  social media platforms using the respective sharing options.
                </p>
                <h4 style="color:#000">General Instruction:</h4>
                <p class="my-1" style="color:#000000">
                  <i class="fas fa-dot-circle" style=" color:#20c997"></i>
                  &nbsp; The quizzes consist of questions carefully designed to
                  help you self-assess your comprehension of the information
                  presented on the topics covered in the module.
                </p>
                <p class="my-1" style="color:#000000">
                  <i class="fas fa-dot-circle" style=" color:#20c997"></i>
                  &nbsp; Each question in the quiz is of multiple-choice or
                  "true or false" format. Read each question carefully, and
                  click on the button next to your response that is based on the
                  information covered on the topic in the module.
                </p>
                <p class="my-1" style="color:#000000">
                  <i class="fas fa-dot-circle" style=" color:#20c997"></i>
                  &nbsp; After responding to a question, click on the "Submit"
                  button at the bottom to go to the next question.
                </p>
                <p class="my-1" style="color:#000000">
                  <i class="fas fa-dot-circle" style=" color:#20c997"></i>
                  &nbsp; After responding to the last question of the quiz,
                  clicking on the "Submit" button at the bottom will show your
                  performance.
                </p>
                <p class="my-1" style="color:#000000">
                  <i class="fas fa-dot-circle" style=" color:#20c997"></i>
                  &nbsp; The total score for the quiz is based on your responses
                  to all questions. If you respond incorrectly to a question or
                  retake a question again and get the correct response, your
                  quiz score will reflect it appropriately. However, your quiz
                  will not be graded, if you skip a question or exit before
                  responding to all the questions.
                </p>

                <p class="my-1" style="color:#000000">
                  <i class="fas fa-dot-circle" style=" color:#20c997"></i>
                  &nbsp; Click on the <b>Start</b> button to start attempting
                  the quiz.
                </p>
                <p class="my-2" style="color:#000000">
                  Good Luck!
                </p>
              </div>
              <!-- <div class="text-center"><button class="btn btn-info" onclick="hideMode('instruction-modal')">Close</button></div>-->
              <!--modal end-->
            </div>
            <div class="p-2 text-center">
              <button
                class="btn btn-danger"
                onclick="hideModal('quiz-instruction')"
              >
                Close
              </button>
            </div>
          </div>
        </div>
        <!--end instruction-->
        <div class="row" style="margin-top:40px;">
          <div class="col-lg-12 col-md-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title text-left w-50">
                  {{ quiz_detail.length ? quiz_detail[0].quiz_name : "" }}
                </h3>
                <span class="w-50"
                  ><h4 class=" text-right">
                    Created by:
                    {{ quiz_detail.length ? quiz_detail[0].name : "" }}
                  </h4></span
                >
              </div>
              <div class="card-body">
                <div class="text-wrap">
                  <div class="col-xl-11 row">
                    <div class="" style="margin-right: 20px;">
                      <img
                        alt="Responsive image"
                        :src="
                          '/dynamic/Quizzes/quiz_img/' +
                            [
                              quiz_detail.length
                                ? quiz_detail[0].quiz_img
                                  ? quiz_detail[0].quiz_img
                                  : 'default_quiz.png'
                                : 'default_quiz.png'
                            ]
                        "
                        style="width: 200px; background: rgb(51, 224, 255);"
                      />
                    </div>
                    <div class="">
                      <span class="row mx-1"
                        ><span>Subject: </span
                        ><span>{{
                          quiz_detail.length ? quiz_detail[0].quiz_subject : ""
                        }}</span></span
                      >
                      <span class="row mx-1"
                        ><span> Question: </span
                        ><span>{{
                          quiz_detail.length
                            ? quiz_detail[0].total_question
                            : ""
                        }}</span></span
                      >
                      <span class="row mx-1"
                        ><span> Points: </span
                        ><span>{{
                          quiz_detail.length ? quiz_detail[0].total_marks : ""
                        }}</span></span
                      >

                      <span
                        v-if="quiz_detail.length && quiz_detail[0].rating"
                        class="mt-2 row"
                        style="display:flex;flex-direction:row"
                      >
                        <div class="rating-stars mx-2">
                          <div>
                            <span class="empty-stars">
                              <span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                            ></span>
                            <span
                              class="filled-stars"
                              :style="
                                'width:' +
                                  (quiz_detail[0].rating
                                    ? quiz_detail[0].rating * 20
                                    : 90) +
                                  '%'
                              "
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                            ></span>
                          </div>
                        </div>
                        <span
                          class="mx-2"
                          style="cursor:pointer"
                          @click="quiz_reviews(quiz_detail[0].quiz_id)"
                          >View all</span
                        ></span
                      >
                      <span class="row my-1 mx-1 text-success"
                        >{{
                          quiz_detail.length ? quiz_detail[0].quiz_name : ""
                        }}
                        attempted by
                        {{
                          quiz_detail.length
                            ? quiz_detail[0].total_attempted
                            : ""
                        }}
                        users</span
                      >
                    </div>

                    <i class="flex-filler"></i>
                    <div></div>
                    <div>
                      <button
                        class="btn btn-purple"
                        style="cursor:pointer"
                        onclick="showModal('quiz-instruction')"
                      >
                        Instruction
                      </button>
                    </div>
                  </div>
                  <div class="col-lg-12 mt-1">
                    <h3>Description:</h3>
                    <p
                      class="p-2 mx-2"
                      v-html="
                        quiz_detail.length ? quiz_detail[0].quiz_desc : ''
                      "
                    ></p>
                  </div>
                  <div class="social text-center">
                    <p class="my-1">Share Quiz</p>
                    <i
                      class="fab fa-facebook-f"
                      @click="sharedCode('facebook')"
                      style="color:#fff;background:#3b5998;"
                    ></i>
                    <i
                      class="fab fa-twitter"
                      @click="sharedCode('twitter')"
                      style="color:#fff;background:#00acee;"
                    ></i>
                    <i
                      class="fab fa-linkedin"
                      @click="sharedCode('linkedin')"
                      style="color:#fff;background:#0e76a8"
                    ></i>
                    <i
                      class="fab fa-whatsapp"
                      @click="sharedCode('whatsapp')"
                      style="background:#25d366;color:#fff"
                    ></i>
                  </div>
                  <div
                    class="text-center mt-2"
                    style="bottom:0;position:relative"
                  >
                    <button
                      class="btn btn-info"
                      @click="quiz_next_step()"
                      style="cursor:pointer"
                    >
                      Start
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <component
      :is="'link'"
      href="/assets/bootstrap-star-rating/css/star-rating.min.css"
      media="all"
      rel="stylesheet"
      type="text/css"
    />
    <component
      :is="'link'"
      href="/assets/bootstrap-star-rating/themes/krajee-fas/theme.min.css"
      media="all"
      rel="stylesheet"
      type="text/css"
    />
    <component
      :is="'script'"
      src="/assets/bootstrap-star-rating/js/star-rating.min.js"
      type="text/javascript"
    />
    <component
      :is="'script'"
      src="/assets/bootstrap-star-rating/themes/krajee-fas/theme.min.js"
      type="text/javascript"
    />
  </div>
</template>
<script>
import axios from "axios";
//import Header from "@/components/header/HeaderMenuOnly.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import moment from "vue-moment";
export default {
  name: "quizInstruction1",
  components: { Header },
  data() {
    return {
      quiz_detail: "",
      quiz_id: "",
      review_all: [],
      userId: 0
    };
  },
  mounted() {
    cvAuth.getUserId(
      function(userId) {
        this.userId = userId;
        if (!userId) {
          //this.$router.push("/login?redirect="+encodeURIComponent(window.location.href));
        }
        this.sch_id = this.$store.getters.getAuthData.auth_sch_id;

        this.quiz_details(userId);
      }.bind(this)
    );
  },
  methods: {
    sharedCode: function(sharedType) {
      //obtained out_of,quiz_name,quiz_id,quiz_slug
      let quiz_name = this.quiz_detail[0].quiz_name;
      let quiz_id = this.quiz_detail[0].quiz_id;
      let quiz_slug = this.quiz_detail[0].slug;
      if (sharedType == "facebook") {
        //test.codevidhya.com/api/user/fb-share
        var a = document.createElement("a");
        a.target = "_blank";
        a.href = "javascript: void(0)";
        /*   "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.hostname + "/share?type=quiz&id=" +
          quiz_id +
          "&user=" +
          this.userId+"&sharetype=2&src=sdkpreparse");*/
        a.addEventListener("click", function(e) {
          e.preventDefault();
          window.open(
            "https://www.facebook.com/sharer/sharer.php?u=" +
              encodeURIComponent(
                window.location.hostname +
                  "/share?type=quiz&id=" +
                  quiz_id +
                  "&user=" +
                  this.userId +
                  "&sharetype=2&src=sdkpreparse"
              ),
            "sharer",
            "toolbar=0,status=0,width=580,height=325"
          );
        });
        a.click();
        /*"https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.hostname + "/share?type=quiz&id=" +
          quiz_id +
          "&user=" +
          this.userId+"&sharetype=2&src=sdkpreparse"),'toolbar=0,status=0,width=580,height=325'*/
      } else if (sharedType == "linkedin") {
        let url =
          "https://www.linkedin.com/shareArticle?mini=true&url=" +
          encodeURIComponent(
            "https://" +
              window.location.hostname +
              "/share?type=quiz&id=" +
              quiz_id +
              "&user=" +
              this.userId +
              "&sharetype=2"
          );
        window.open(url, "linkedin", "toolbar=0,status=0,width=580,height=325");
      } else if (sharedType == "whatsapp") {
        let url =
          "https://api.whatsapp.com/send?text=" +
          encodeURIComponent(
            "https://" +
              window.location.hostname +
              "/share?type=quiz&id=" +
              quiz_id +
              "&user=" +
              this.userId +
              "&sharetype=2"
          );
        window.open(url, "whatsapp", "toolbar=0,status=0,width=580,height=325");
      } else if (sharedType == "twitter") {
        let url =
          "https://www.twitter.com/share?url=" +
          encodeURIComponent(
            "https://" +
              window.location.hostname +
              "/share?type=quiz&id=" +
              quiz_id +
              "&user=" +
              this.userId +
              "&sharetype=2"
          );
        window.open(url, "twitter", "toolbar=0,status=0,width=580,height=325");
      }
    },
    quiz_next_step: function() {
      /*if(this.userId==0)
           {
               this.$router.push(
          "/login?redirect=" + encodeURIComponent(window.location.href)
        );
        return false;
           }
           else{
             this.$router.push("quiz?id="+this.quiz_detail[0].quiz_id);
           }*/
      this.$router.push("quiz?id=" + this.quiz_detail[0].quiz_id);
    },
    quiz_reviews: function(quiz_id) {
      axios
        .post("/api/user/get_quiz_reviews", { quiz_id: quiz_id })
        .then(res => {
          this.review_all = res.data.data;
          //   console.log(this.review_all);
          showModal("quiz_reviews");
        });
    },
    quiz_details: function(userId) {
      this.quiz_id = new URL(window.location).searchParams.get("id");
      if (!userId) {
        /*  this.$router.push(
          "/login?redirect=" + encodeURIComponent(window.location.href)
        );
        return false;*/
      }
      axios
        .post("api/user/quiz_particular_quiz_detail", { quiz_id: this.quiz_id })
        .then(res => {
          if (res.status == 200) {
            this.quiz_detail = res.data;
          }
        });
    }
  },
  update() {
    $(".lesson-review-item-rating").rating({
      displayOnly: true,
      theme: "krajee-fas",
      showCaption: false
    });
  }
};
</script>
<style>
.cv-input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}
.social [class*="fab fa-"] {
  background-color: #333;
  border-radius: 30px;
  color: #fff;
  display: inline-block;
  height: 30px;
  line-height: 30px;
  margin: auto 3px;
  width: 30px;
  font-size: 15px;
  text-align: center;
  cursor: pointer;
}
.fa-twitter:hover {
  background-color: #46c0fb;
}
</style>
