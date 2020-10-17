<template>
  <div class="h-100">
    <!--test-->
    <Header></Header>
    <div class="h-100" style="padding: 24px 24px 8px;">
      <div class="cv-input-group h-100">
        <div class="row" style="margin-top:40px;">
          <!--Quiz new design-->
          <div class="container-fluid " style="">
            <div class="row ">
              <!--left start-->
              <div class="col-sm-8 p-5">
                <!--image-->
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
                      <div
                        class="text-wrap  justify-content-center align-items-center"
                        style="min-height:300px;max-height:100%;"
                      >
                        <div class="row" style="width:100%;margin-left:0px;">
                          <div class="col-sm-4">
                            <span
                              class=""
                              style="background:rgba(255,255,255,0.3);padding:5px 7px;top:5px;margin-left:5px; color:#fff;border-radius:3px;"
                              >{{
                                quiz_detail.length ? quiz_detail[0].subject : ""
                              }}</span
                            >
                            <div
                              class="mt-5 text-center mb-4 ml-auto mr-auto bg-success"
                              style="border-radius:50%; width:75%; padding:35px;"
                            >
                              <h5 class="text-white text-center">You earned</h5>
                              <h1
                                class="text-white text-center"
                                style="font-size:70px; font-weight:600;text-shadow: 2px 4px 3px rgba(0,0,0,0.3);"
                              >
                                {{
                                  quiz_detail.length
                                    ? quiz_detail[0].obtained
                                    : ""
                                }}
                              </h1>
                              <h3 class="text-white text-center">Points</h3>
                            </div>
                          </div>

                          <div class="col-sm-8 ">
                            <div class="col-lg-12 mt-5" style="">
                              <h1>
                                {{
                                  quiz_detail.length
                                    ? quiz_detail[0].quiz_name
                                    : ""
                                }}
                              </h1>
                              <span style="font-weight:300"
                                >Attempted on:
                                {{
                                  quiz_detail.length
                                    ? $moment(
                                        quiz_detail[0].attempted_at
                                      ).format("LL")
                                    : ""
                                }}</span
                              >

                              <div class="row mt-3">
                                <div
                                  class=""
                                  style="width:auto; padding-top:10px; padding-left:10px; padding-right:30px; padding-bottom:10px; display:block; float:left;"
                                >
                                  <h3
                                    class="text-center"
                                    style="text-shadow: 2px 1px 1px rgba(0,0,0,0.3);"
                                  >
                                    {{
                                      quiz_detail.length
                                        ? quiz_detail[0].total_points
                                        : ""
                                    }}
                                  </h3>
                                  <span class="">Total Points </span>
                                </div>
                                <div
                                  class=""
                                  style="width:auto; padding:10px 30px; display:block; float:left;"
                                >
                                  <h3
                                    class="text-center"
                                    style="text-shadow: 2px 1px 1px rgba(0,0,0,0.3);"
                                  >
                                    {{
                                      quiz_detail.length
                                        ? quiz_detail[0].total_que
                                        : ""
                                    }}
                                  </h3>
                                  <span class="">Total Questions </span>
                                </div>
                                <div
                                  class=""
                                  style="width:auto; padding:10px 30px; display:block; float:left;"
                                >
                                  <h3
                                    class="text-center"
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
                              </div>

                              <div
                                class="social  mt-5"
                                v-if="
                                  quiz_detail.length
                                    ? quiz_detail[0].social_sharing
                                      ? true
                                      : false
                                    : false
                                "
                              >
                                <span
                                  class="mr-3"
                                  style="padding:8px 7px; background:#ec296b; color:#fff; font-size:16px; font-weight:300; border-radius:3px;"
                                  >Challenge your friends
                                </span>
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
                  </div>
                </div>
                <!--end image-->
                <!--questions analysis-->
                <div class="col-lg-12 mt-1 mb-5 quiz_desc">
                  <h3 style="color:#000">Questions Analysis</h3>
                  <div class="row justify-content-md-center mt-5 ">
                    <div
                      class="col-sm-3 text-center shadow m-2 p-5"
                      style="background:#fff; border-radius:3px;"
                    >
                      <h4>TOTAL</h4>
                      <button
                        class="btn btn-primary mt-3 btn-circle btn-circle-lg m-1"
                        style="width: 55px; height: 55px; line-height: 55px; font-size: 1.1rem; text-align: center; padding: 0; border-radius: 50%;"
                      >
                        {{ quiz_detail.length ? quiz_detail[0].total_que : "" }}
                      </button>
                    </div>

                    <div
                      class="col-sm-3 text-center shadow m-2 p-5"
                      style="background:#fff; border-radius:3px;"
                    >
                      <h4>INCORRECT</h4>
                      <button
                        class="btn btn-danger mt-3 btn-circle btn-circle-lg m-1"
                        style="width: 55px; height: 55px; line-height: 55px; font-size: 1.1rem; text-align: center; padding: 0; border-radius: 50%;"
                      >
                        {{ quiz_detail.length ? quiz_detail[0].wrong_que : "" }}
                      </button>
                    </div>

                    <div
                      class="col-sm-3 text-center shadow m-2 p-5"
                      style="background:#fff; border-radius:3px;"
                    >
                      <h4>CORRECT</h4>
                      <button
                        class="btn btn-success mt-3 btn-circle btn-circle-lg m-1"
                        style="width: 55px; height: 55px; line-height: 55px; font-size: 1.1rem; text-align: center; padding: 0; border-radius: 50%;"
                      >
                        {{
                          quiz_detail.length ? quiz_detail[0].correct_que : ""
                        }}
                      </button>
                    </div>
                  </div>
                </div>
                <!-- questions analysis ending here-->

                <!--view more quiz section-->
                <div class="col-lg-12 mt-1 mb-5 quiz_desc ">
                  <h3 class="mb-5" style="color:#000;">More Quizzes</h3>
                  <span
                    class=""
                    style="background:rgba(220, 53, 69, 0.1); border-radius:3px; padding:7px 8px;cursor:pointer"
                    @click="$router.push('/quizzes')"
                    >View All </span
                  ><br />

                  <div class="mt-3 row" v-if="quizzes && quizzes.length">
                    <template v-for="(quiz, quiz_index) in quizzes">
                      <div
                        class=" quizzes-card col-md-6 col-xl-4 "
                        v-bind:key="quiz_index"
                      >
                        <!--new card-->
                        <div class="card">
                          <div class="item-card2-img">
                            <img
                              :src="
                                '/dynamic/Quizzes/quiz_img/' +
                                  [
                                    quiz.quiz_img
                                      ? quiz.quiz_img
                                      : 'default_quiz.png'
                                  ]
                              "
                              alt="img"
                              class="cover-image"
                              style="background:#33E0FF; height:150px;"
                            />
                            <div class="item-tag" style="top:15px;">
                              <span
                                class="text-white bg-warning p-1 "
                                style="border-radius:3px;z-index:9999; position:relative"
                                :title="
                                  quiz.no_of_questions + ' users attempted'
                                "
                                ><i
                                  class="fa fa-paper-plane"
                                  data-toggle="tooltip"
                                  title="fa fa-paper-plane"
                                ></i>
                                {{ quiz.total_attempted }}</span
                              >
                            </div>
                            <div class="item-tag" style="left:15px;">
                              <span
                                class="text-white bg-primary p-1"
                                style="border-radius:3px;"
                                >Questions: {{ quiz.no_of_questions }}</span
                              >
                            </div>
                            <div class="item-tag">
                              <span
                                class="text-white bg-primary p-1"
                                style="border-radius:3px;"
                                >Points: {{ quiz.total_points }}</span
                              >
                            </div>
                          </div>
                          <!--card body-->
                          <div class="card-body">
                            <div class="item-card2">
                              <div class="item-card2-text mb-3">
                                <h4
                                  class="font-weight-semibold text-dark mb-1"
                                  v-html="
                                    quiz.quiz_name ? quiz.quiz_name : 'test'
                                  "
                                ></h4>
                                <div
                                  class="mb-1 text-muted"
                                  style="font-size:12px;"
                                >
                                  By: <i class="icon icon-user mr-1"></i
                                  ><span
                                    class=""
                                    style="font-size:12px;"
                                    v-html="
                                      quiz.name ? quiz.name : 'Codevidhya'
                                    "
                                  ></span>
                                </div>
                                <p
                                  style="font-size:16px; color:#5e748e;"
                                  v-if="quiz.quiz_desc"
                                  v-html="
                                    quiz.quiz_desc.length >= 30
                                      ? quiz.quiz_desc.substring(0, 30) + '...'
                                      : quiz.quiz_desc
                                  "
                                ></p>
                              </div>
                              <div v-if="quiz.rating" class="">
                                <span class="rating-stars d-inline-block mr-2">
                                  <span class="empty-stars">
                                    <span class="star"
                                      ><i class="fas fa-star"></i
                                    ></span>
                                    <span class="star"
                                      ><i class="fas fa-star"></i
                                    ></span>
                                    <span class="star"
                                      ><i class="fas fa-star"></i
                                    ></span>
                                    <span class="star"
                                      ><i class="fas fa-star"></i
                                    ></span>
                                    <span class="star"
                                      ><i class="fas fa-star"></i
                                    ></span>
                                  </span>
                                  <span
                                    class="filled-stars"
                                    :style="
                                      'width:' +
                                        (quiz.rating ? quiz.rating * 20 : 90) +
                                        '%'
                                    "
                                  >
                                    <span class="star"
                                      ><i class="fas fa-star"></i
                                    ></span>
                                    <span class="star"
                                      ><i class="fas fa-star"></i
                                    ></span>
                                    <span class="star"
                                      ><i class="fas fa-star"></i
                                    ></span>
                                    <span class="star"
                                      ><i class="fas fa-star"></i
                                    ></span>
                                    <span class="star"
                                      ><i class="fas fa-star"></i
                                    ></span>
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <!--end card body-->
                          <!--card footer-->
                          <div class="card-footer">
                            <div class="item-card2-footer">
                              <div class="product-item-wrap d-flex">
                                <div class="product-item-price">
                                  <span
                                    class="newprice text-dark"
                                    style="font-size:14px;"
                                  >
                                    {{
                                      quiz.price ? "Rs. " + quiz.price : "Free"
                                    }}</span
                                  >
                                </div>
                                <button
                                  class="btn btn-primary ml-auto price"
                                  style="border-radius:4px;width:auto;"
                                  v-html="'Learn More'"
                                  @click="quiz_action(quiz)"
                                >
                                  Learn More
                                </button>
                              </div>
                            </div>
                          </div>
                          <!--end card footer-->
                        </div>
                        <!--end new card-->
                      </div>
                    </template>
                  </div>
                  <div
                    class="text-center w-100"
                    style="color:#cc;padding:24px;"
                    v-else
                  >
                    There are no Quizzes!
                  </div>

                  <!--<div class="row justify-content-md-center mt-5 ">
                    <div class="col-sm-3 text-center shadow m-2 p-5" style="background:#fff; border-radius:3px;">
                      <h4> TOTAL</h4>
                      <button class="btn btn-primary mt-3 btn-circle btn-circle-lg m-1" style="width: 55px; height: 55px; line-height: 55px; font-size: 1.1rem; text-align: center; padding: 0; border-radius: 50%;">56</button>
                      
                    </div>

                    <div class="col-sm-3 text-center shadow m-2 p-5" style="background:#fff; border-radius:3px;">
                      <h4> INCORRECT</h4>
                      <button class="btn btn-danger mt-3 btn-circle btn-circle-lg m-1" style="width: 55px; height: 55px; line-height: 55px; font-size: 1.1rem; text-align: center; padding: 0; border-radius: 50%;">56</button>
                    </div>

                    <div class="col-sm-3 text-center shadow m-2 p-5" style="background:#fff; border-radius:3px;">
                      <h4> CORRECT</h4>
                      <button class="btn btn-success mt-3 btn-circle btn-circle-lg m-1" style="width: 55px; height: 55px; line-height: 55px; font-size: 1.1rem; text-align: center; padding: 0; border-radius: 50%;">56</button>
                    </div>

                    <div class="col-sm-3 text-center shadow m-2 p-5" style="background:#fff; border-radius:3px;">
                      <h4> CORRECT</h4>
                      <button class="btn btn-success mt-3 btn-circle btn-circle-lg m-1" style="width: 55px; height: 55px; line-height: 55px; font-size: 1.1rem; text-align: center; padding: 0; border-radius: 50%;">56</button>
                    </div>
                   </div>-->
                </div>
                <!-- view more quizzess section ending here-->
              </div>
              <!--end left-->
              <!--right part-->
              <div class="col-xl-4 col-md-4 p-5">
                <div class="p-3" style="background:rgba(0,0,0,0.05);">
                  <div class="col-lg-12">
                    <h4 class="text-center mt-3">YOUR ANSWERS</h4>
                    <!--<span class="" style="background:rgba(0,0,0,0.3);padding:5px 7px; color:#fff;border-radius:3px;">{{quiz_detail.length?quiz_detail[0].subject:''}}</span>-->
                    <div
                      class="col-sm-12 mt-3 p-0 text-center"
                      v-if="quiz_questions.length"
                    >
                      <button
                        v-for="(quiz_question, que_index) in quiz_questions"
                        v-bind:key="que_index"
                        :class="
                          'btn btn-circle btn-circle-lg m-3' +
                            [
                              quiz_question.points == 0
                                ? ' btn-primary'
                                : ' btn-success'
                            ]
                        "
                        style="width: 35px; height: 35px; line-height: 35px; font-size: 1.0rem; text-align: center; padding: 0; border-radius: 50%;"
                      >
                        {{ que_index + 1 }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="row justify-content-md-center p-5">
                  <div class="col-sm-6 ">
                    <!-- <button class="btn btn-round btn-lg btn-primary"> Start Next Quiz </button>-->
                  </div>
                </div>
                <!--review rating-->

                <div
                  class="p-3"
                  v-if="quiz_detail.length && quiz_detail[0].rating"
                >
                  <h4 class="mt-3">Reviews and Rating</h4>
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
                          :style="'width:' + 4 * 20 + '%'"
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
                    style="max-height:680px;overflow-y:auto"
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
                            {{ review.message }}
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
                <!--end review rating-->
              </div>
              <!--end right part-->
            </div>
          </div>

          <!--End Quiz new design-->
        </div>
      </div>
    </div>
    <!--end test-->
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
  name: "quizResult",
  components: { Header },
  data() {
    return {
      quiz_detail: "",
      quiz_id: "",
      review_all: [],
      userId: 0,
      quiz_questions: "",
      quizzes: ""
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
    $(".lesson-review-item-rating").rating({
      displayOnly: true,
      theme: "krajee-fas",
      showCaption: false
    });
  },
  methods: {
    quiz_action: function(quiz) {
      this.$router.push("/quiz-instruction?id=" + quiz.quiz_id);
    },
    sharedCode: function(sharedType) {
      //obtained out_of,quiz_name,quiz_id,quiz_slug

      let quiz_name = this.quiz_detail[0].quiz_name;
      let total_points = this.quiz_detail[0].total_points;
      let obtained = this.quiz_detail[0].obtained;
      let quiz_id = this.quiz_detail[0].quiz_id;
      let quiz_slug = this.quiz_detail[0].quiz_slug;
      var left = screen.width / 2 - 580 / 2;
      var top = screen.height / 2 - 325 / 2;
      const quiz_subject = this.quiz_detail[0].subject;
      let vm = this;
      if (sharedType == "facebook") {
        //test.codevidhya.com/api/user/fb-share
        var a = document.createElement("a");
        a.href = "javascript: void(0)";
        /* "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.hostname + "/share?type=quiz&id=" +
          quiz_id +
          "&user=" +
          this.userId+"&src=sdkpreparse");*/
        // a.click("window.open('"+a.href+"','popup','width=600,height=600')");
        a.addEventListener("click", function(e) {
          e.preventDefault();

          window.open(
            "https://www.facebook.com/sharer/sharer.php?quote=" +
              encodeURIComponent(
                `Hey! I have just attempted this interesting quiz on ${quiz_subject}. Attempt this quiz and earn coins.`
              ) +
              "&u=" +
              encodeURIComponent(
                window.location.hostname +
                  "/share?type=quiz&id=" +
                  quiz_id +
                  "&user=" +
                  vm.userId +
                  "&src=sdkpreparse"
              ),
            "sharer",
            "toolbar=0,status=0,width=580,height=325, left=" +
              left +
              ", top=" +
              top
          );
        });
        a.click();
      } else if (sharedType == "linkedin") {
        let url =
          "https://www.linkedin.com/shareArticle?mini=true&quote=" +
          encodeURIComponent(
            `Hey! I have just attempted this interesting quiz on ${quiz_subject}. Attempt this quiz and earn coins.`
          ) +
          "&url=" +
          encodeURIComponent(
            "https://" +
              window.location.hostname +
              "/share?type=quiz&id=" +
              quiz_id +
              "&user=" +
              vm.userId
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
              vm.userId
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
            `Hey! I have just attempted this interesting quiz on ${quiz_subject}. Attempt this quiz and earn coins.`
          ) +
          "&url=" +
          encodeURIComponent(
            "https://" +
              window.location.hostname +
              "/share?type=quiz&id=" +
              quiz_id +
              "&user=" +
              vm.userId
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
      // this.$router.push("quiz?id="+this.quiz_detail[0].quiz_id);
      this.$router.push({
        name: "ViewAllQuizzesResults",
        params: { sub_id: this.sub_id }
      });
    },
    quiz_reviews: function(quiz_id) {
      axios
        .post("/api/user/get_quiz_reviews", { quiz_id: quiz_id })
        .then(res => {
          this.review_all = res.data.data;
        });
    },
    quiz_details: function(userId) {
      this.quiz_id = new URL(window.location).searchParams.get("id");
      if (!userId) {
        this.$router.push(
          "/login?redirect=" + encodeURIComponent(window.location.href)
        );
        return false;
      }
      axios
        .post("api/user/quiz_particular_quiz_result_detail", {
          quiz_id: this.quiz_id,
          user_id: this.userId
        })
        .then(res => {
          if (res.status == 200) {
            this.quiz_detail = res.data;

            axios
              .post("api/user/display_all_sub_quizzes_view_result", {
                quiz_id: this.quiz_detail[0].quiz_id,
                user_id: this.userId,
                sub_id: this.quiz_detail[0].sub_id
              })
              .then(res1 => {
                this.quizzes = res1.data;
                //console.log(this.quizzes);
              });
            this.quiz_reviews(this.quiz_detail[0].quiz_id);
          }
        });
      axios
        .post("api/user/quiz_result_questions", {
          quiz_id: this.quiz_id,
          user_id: this.userId
        })
        .then(res => {
          this.quiz_questions = res.data;
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
