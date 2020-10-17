<template>
  <div class="h-100">
    <!-- test-->
    <Header></Header>
    <div class="h-100" style="padding: 24px 24px 8px;">
      <div class="cv-input-group h-100">
        <div class="row" style="margin-top:40px;">
          <!--Quiz new design-->
          <div class="container-fluid " style="">
            <div class="row ">
              <div class="col-xl-8 col-md-8 p-5 ">
                <div class="card" style="height:auto;">
                  <div
                    class="bg-img"
                    :style="
                      'background-image:url(/dynamic/Quizzes/quiz_img/' +
                        [
                          quiz_detail.length
                            ? quiz_detail[0].quiz_img
                              ? quiz_detail[0].quiz_img
                              : 'default_quiz.png'
                            : 'default_quiz.png'
                        ] +
                        '); height:100%;min-height:300px;max-height:100%; background-repeat: no-repeat;background-size:contain;background-position: center;overflow-y:auto;filter:blur(6px);-webkit-filter:blur(6px);'
                    "
                  ></div>
                  <div class="bg-text" style="">
                    <div class="quiz_desc_inst">
                      <!--<div class="card-header">
								<h3 class="card-title text-left">Quiz Name: {{quiz_detail.length?quiz_detail[0].quiz_name:''}}</h3>
              </div>-->
                      <div
                        class="text-wrap d-flex justify-content-center align-items-center"
                        style="overflow-y:auto;min-height:300px;max-height:100%;"
                      >
                        <div class="col-lg-12 text-center" style="">
                          <h1>
                            {{
                              quiz_detail.length ? quiz_detail[0].quiz_name : ""
                            }}
                          </h1>
                          <!--<hr class="w-30">-->
                          <div
                            class="social text-center mt-5"
                            v-if="
                              quiz_detail.length
                                ? quiz_detail[0].social_sharing
                                  ? true
                                  : false
                                : false
                            "
                          >
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-12 mt-1 mb-5 quiz_desc">
                  <h3 style="color:#000">Description</h3>
                  <p
                    class="pt-2"
                    v-html="quiz_detail.length ? quiz_detail[0].quiz_desc : ''"
                  ></p>
                </div>
                <!--instruction-->
                <div class="col-lg-12 mt-1 mb-5 quiz_instruction">
                  <h3 style="color:#000">Instructions</h3>
                  <ul class="mx-4" style="list-style-type:disc;">
                    <li class="pt-2">
                      This practice quiz is to determine your understanding of
                      the
                      {{
                        quiz_detail.length ? quiz_detail[0].quiz_subject : ""
                      }}
                    </li>
                    <li class="my-1">
                      You have only 1 attempt to complete the quiz.
                    </li>
                  </ul>
                  <p class="my-1 mt-3">
                    <strong>Answering a Question </strong>
                  </p>
                  <ul class="mx-4" style="list-style-type:disc;">
                    <li class="my-1">
                      For each quiz exercise, select the appropriate option.
                    </li>

                    <ul class="mx-4" style="list-style-type:disc;">
                      <li>
                        There are one or more possible options for each
                        question.
                      </li>
                    </ul>

                    <ul class="mx-4" style="list-style-type:disc;">
                      <li>
                        Don't just guess the correct options, think about them.
                      </li>
                    </ul>

                    <ul class="mx-4" style="list-style-type:disc;">
                      <li>
                        When you complete the quiz, you can check your score,
                        questions attempted and not attempted and also the
                        correct option for each question along with the
                        description.
                      </li>
                    </ul>

                    <ul class="mx-4" style="list-style-type:disc;">
                      <li>
                        You will earn coins as a reward when you complete the
                        quiz.
                      </li>
                    </ul>
                    <li class="my-1">
                      You can share the quiz you attempted on different social
                      media platforms using the respective sharing options.
                    </li>
                  </ul>
                  <p class="my-1 mt-3"><strong>General Instructions</strong></p>
                  <ul class="mx-4" style="list-style-type:disc;">
                    <li class="my-1">
                      The quizzes consist of questions carefully designed to
                      help you self-assess your comprehension of the information
                      presented on the topics covered in the module.
                    </li>
                    <li class="my-1">
                      Each question in the quiz is of multiple-choice or "true
                      or false" format. Read each question carefully, and click
                      on the button next to your response that is based on the
                      information covered on the topic in the module.
                    </li>
                    <li class="my-1">
                      After responding to a question, click on the "Submit"
                      button at the bottom to go to the next question.
                    </li>
                    <li class="my-1">
                      After responding to the last question of the quiz,
                      clicking on the "Submit" button at the bottom will show
                      your performance.
                    </li>
                    <li class="my-1">
                      The total score for the quiz is based on your responses to
                      all questions. If you respond incorrectly to a question or
                      retake a question again and get the correct response, your
                      quiz score will reflect it appropriately. However, your
                      quiz will not be graded, if you skip a question or exit
                      before responding to all the questions.
                    </li>

                    <li class="my-1">
                      Click on the <b>Start</b> button to start attempting the
                      quiz.
                    </li>
                  </ul>
                  <span class="mt-3"><strong>Good Luck!</strong></span>
                </div>
                <!--end instruction-->
              </div>

              <div class="col-xl-4 col-md-4 p-5">
                <div class="p-3" style="background:rgba(0,0,0,0.05);">
                  <div class="col-lg-12">
                    <span
                      class=""
                      style="background:rgba(0,0,0,0.3);padding:5px 7px; color:#fff;border-radius:3px;"
                      >{{
                        quiz_detail.length ? quiz_detail[0].quiz_subject : ""
                      }}</span
                    >
                    <div
                      class="mt-5 text-center mb-4 ml-auto mr-auto bg-success"
                      style="border-radius:50%; width:60%; padding:40px;"
                    >
                      <h5 class="text-white text-center">Launch and win</h5>
                      <h1
                        class="text-white text-center"
                        style="font-size:80px; font-weight:600;text-shadow: 2px 4px 3px rgba(0,0,0,0.3);"
                      >
                        {{
                          quiz_detail.length ? quiz_detail[0].total_marks : ""
                        }}
                      </h1>
                      <h3 class="text-white text-center">Points</h3>
                    </div>

                    <div
                      class=" row ml-auto mr-auto mt-4 text-center justify-content-md-center"
                    >
                      <div
                        class="col-sm-12"
                        style="line-height:30px; background:;display:block; width:70%; border-radius:3px;"
                      >
                        <span> By </span>
                        <span
                          class=""
                          style="font-size:16px; line-height:30px; display:inline-block; font-weight:600;"
                          >{{ quiz_detail.length ? quiz_detail[0].name : "" }}
                        </span>
                      </div>
                    </div>
                    <hr />

                    <div class="row mt-3">
                      <div class="col-sm-4 col-xs-4 text-center" style="">
                        <h3
                          class=""
                          style="text-shadow: 2px 1px 1px rgba(0,0,0,0.3);"
                        >
                          {{
                            quiz_detail.length
                              ? quiz_detail[0].total_question
                              : ""
                          }}
                        </h3>
                        <span class="">Questions </span>
                      </div>
                      <div class="col-sm-4 col-xs-4 text-center" style="">
                        <h3
                          class=""
                          style="text-shadow: 2px 1px 1px rgba(0,0,0,0.3);"
                        >
                          {{
                            quiz_detail.length
                              ? quiz_detail[0].total_attempted
                              : ""
                          }}
                        </h3>
                        <span class="">Users Attempted </span>
                      </div>
                      <div class="col-sm-4 col-xs-4 text-center" style="">
                        <button
                          v-if="quiz_detail.length"
                          :class="
                            'btn btn-md btn-round btn-primary' +
                              [
                                quiz_detail[0].price == 0 ||
                                quiz_detail[0].status
                                  ? ''
                                  : ''
                              ]
                          "
                          @click="quiz_next_step()"
                        >
                          {{
                            (quiz_detail[0].price == 0 ||
                              quiz_detail[0].status == 1) &&
                            !quiz_detail[0].question_attempted
                              ? "Launch Quiz"
                              : (quiz_detail[0].price == 0 ||
                                  quiz_detail[0].status) &&
                                quiz_detail[0].question_attempted
                              ? "Resume"
                              : "Unlock (Rs. " + quiz_detail[0].price + ")"
                          }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="p-3"
                  v-if="quiz_detail.length && quiz_detail[0].rating"
                >
                  <h4 class="mt-3">Reviews and Rating</h4>

                  <!--thisbnavfhasdhhasfdhashdfgasgdfhsahdghasdjfsadf-->
                  <!--subject rating-->
                  <span
                    v-if="quiz_detail.length && quiz_detail[0].rating"
                    class="mt-2 row"
                    style="display:flex;flex-direction:row;overflow-y:auto"
                  >
                    <div class="rating-stars mx-2 mb-5">
                      <div>
                        <span class="empty-stars">
                          <span class="star"><i class="fas fa-star"></i></span
                          ><span class="star"><i class="fas fa-star"></i></span
                          ><span class="star"><i class="fas fa-star"></i></span
                          ><span class="star"><i class="fas fa-star"></i></span
                          ><span class="star"><i class="fas fa-star"></i></span
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
                          ><span class="star"><i class="fas fa-star"></i></span
                          ><span class="star"><i class="fas fa-star"></i></span
                          ><span class="star"><i class="fas fa-star"></i></span
                          ><span class="star"><i class="fas fa-star"></i></span
                          ><span class="star"><i class="fas fa-star"></i></span
                        ></span>
                      </div>
                    </div>
                  </span>
                  <!--end subject rating-->

                  <!--users reviews-->
                  <div
                    v-if="review_all.length"
                    class="row"
                    style="max-height:350px;overflow-y:auto"
                  >
                    <div
                      v-for="(review, rev_index) in review_all"
                      v-bind:key="rev_index"
                      :class="'col-sm-12' + [rev_index == 0 ? '' : 'mt-1']"
                      :style="
                        'display:flex;flex-direction:row;width:100%;' +
                          [
                            rev_index < review_all.length - 1
                              ? 'border-bottom:1px solid #ccc;'
                              : ''
                          ]
                      "
                    >
                      <!--parent-->
                      <div
                        class="mt-2 col-sm-12"
                        style="display:flex;flex-direction:row; width:100%;"
                      >
                        <div class="col-sm-3">
                          <img
                            :src="
                              review.profile_pic
                                ? '/assets/images/users/' + review.profile_pic
                                : '/assets/images/users/user.svg'
                            "
                            class="review-person"
                            style="flex-shrink: 0;width:56px;height:56px;padding:4px;background:#ddd;border-radius: 50%;"
                          />
                        </div>
                        <div
                          class="col-sm-8"
                          style="d-flex flex-direction-column"
                        >
                          <span style="margin-bottom:0px; font-weight:500;">{{
                            review.name ? review.name : "Test"
                          }}</span>
                          <div
                            class="rating-container theme-krajee-fas rating-xs rating-animate is-display-only"
                          >
                            <div
                              class="rating-stars mx-2"
                              style="margin-bottom:0px;"
                            >
                              <span class="empty-stars">
                                <span class="star"
                                  ><i class="far fa-star"></i></span
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
                          <div
                            class=""
                            v-if="
                              review_all.length
                                ? review.message
                                  ? true
                                  : false
                                : false
                            "
                            style="margin-top:5px; margin-bottom:10px;line-height:1.44;letter-spacing:.3px; font-style:italic;text-align:left; font-size:12px;"
                          >
                            {{ review.message }} t is based on the information
                            covered on the topic in the module. After responding
                            to a question, click on the "Submit" bu
                          </div>
                        </div>
                      </div>
                      <!--end parent-->
                    </div>
                    <!--test reviews-->

                    <!--end test reviews-->
                  </div>
                  <!--end users reviews-->
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--end quiz new design-->
      </div>
    </div>
    <!--test-->

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
  name: "quizInstruction",
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
      var left = screen.width / 2 - 580 / 2;
      var top = screen.height / 2 - 325 / 2;
      const quiz_subject = this.quiz_detail[0].quiz_subject;
      var vm = this;
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
          /*  window.open('https://www.facebook.com/sharer/sharer.php?quote='+encodeURIComponent('Hey this my Quote')+'&u=' + encodeURIComponent(window.location.hostname + '/share?type=quiz&id=' +
          quiz_id +
          '&user=' +
          this.userId+'&sharetype=2&src=sdkpreparse'),'sharer','toolbar=0,status=0,width=580,height=325, left='+left+', top='+top)});*/
          window.open(
            "https://www.facebook.com/sharer/sharer.php?quote=" +
              encodeURIComponent(
                `Hey! I have just found this interesting quiz on ${quiz_subject} Attempt this quiz and earn coins`
              ) +
              "&u=" +
              encodeURIComponent(
                window.location.hostname +
                  "/share?type=quiz&id=" +
                  quiz_id +
                  "&user=" +
                  vm.userId +
                  "&sharetype=2&src=sdkpreparse"
              ),
            "sharer",
            "toolbar=0,status=0,width=580,height=325, left=" +
              left +
              ", top=" +
              top
          );
        });
        a.click();
        /*"https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.hostname + "/share?type=quiz&id=" +
          quiz_id +
          "&user=" +
          this.userId+"&sharetype=2&src=sdkpreparse"),'toolbar=0,status=0,width=580,height=325'*/
      } else if (sharedType == "linkedin") {
        let url =
          "https://www.linkedin.com/shareArticle?mini=true&quote=" +
          encodeURIComponent(
            `Hey this my QuoteHey! I have just found this interesting quiz on ${quiz_subject} Attempt this quiz and earn coins`
          ) +
          "&url=" +
          encodeURIComponent(
            "https://" +
              window.location.hostname +
              "/share?type=quiz&id=" +
              quiz_id +
              "&user=" +
              vm.userId +
              "&sharetype=2"
          );
        window.open(
          url,
          "linkedin",
          "toolbar=0,status=0,width=580,height=325, left=" +
            left +
            ", top=" +
            top
        );
      } else if (sharedType == "whatsapp") {
        let url =
          "https://api.whatsapp.com/send?text=" +
          encodeURIComponent(
            "https://" +
              window.location.hostname +
              "/share?type=quiz&id=" +
              quiz_id +
              "&user=" +
              vm.userId +
              "&sharetype=2"
          );
        window.open(
          url,
          "whatsapp",
          "toolbar=0,status=0,width=580,height=325, left=" +
            left +
            ", top=" +
            top
        );
      } else if (sharedType == "twitter") {
        let url =
          "https://www.twitter.com/share?quote=" +
          encodeURIComponent(
            `Hey this my QuoteHey! I have just found this interesting quiz on ${quiz_subject} Attempt this quiz and earn coins`
          ) +
          "&url=" +
          encodeURIComponent(
            "https://" +
              window.location.hostname +
              "/share?type=quiz&id=" +
              quiz_id +
              "&user=" +
              vm.userId +
              "&sharetype=2"
          );
        window.open(
          url,
          "twitter",
          "toolbar=0,status=0,width=580,height=325, left=" +
            left +
            ", top=" +
            top
        );
      }
    },
    quiz_next_step: function() {

    
      if (
        (this.quiz_detail[0].price == 0 || this.quiz_detail[0].status==1)) {
        this.$router.push("quiz?id=" + this.quiz_detail[0].quiz_id);
      } else {
        this.$router.push(
          "/checkout?product_name=" +
            this.quiz_detail[0].slug +
            "&id=" +
            this.quiz_detail[0].product_id +
            "&sub_id=" +
            this.quiz_detail[0].sub_id +
            "&type=quiz"
        );
      }
    },
    quiz_reviews: function(quiz_id) {
      let vm = this;
      axios
        .post("/api/user/get_quiz_reviews", { quiz_id: quiz_id })
        .then(res => {
          vm.review_all = res.data.data;
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
      let vm = this;
      axios
        .post("api/user/quiz_particular_quiz_detail", {
          quiz_id: this.quiz_id,
          user_id: this.userId
        })
        .then(res => {
          if (res.status == 200) {
            vm.quiz_detail = res.data;
            if (!vm.quiz_detail.length) vm.$router.push("/quizzes");
            else vm.quiz_reviews(vm.quiz_detail[0].quiz_id);
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
<style lang="scss">
.cv-input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}
.social [class*="fab fa-"] {
  background-color: #333;
  border-radius: 40px;
  color: #fff;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  margin: auto 5px;
  width: 40px;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  font-weight: 300;
}
.fa-twitter:hover {
  background-color: #46c0fb;
}
.bg-image {
  /* The image used */

  /* Add the blur effect */
  filter: blur(40px);
  -webkit-filter: blur(40px);

  /* Full height */
  height: 100%;

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

/* Position text in the middle of the page/image */
.bg-text {
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.9); /* Black w/opacity/see-through */
  color: white;
  font-weight: bold;
  position: absolute;
  z-index: 2;

  width: 100%;
  min-height: 300px;
}
.quiz_desc_inst {
  bottom: 0;
}
.quiz_instruction {
  ul > li,
  p,
  span {
    color: #000;
  }
}
.quiz_desc > h4,
p {
  font: inherit !important;
  font-size: 14px !important;
  color: #000;
}
</style>
