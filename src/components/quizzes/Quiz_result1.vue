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

        <div class="row" style="margin-top:40px;">
          <div class="col-lg-12 col-md-12">
            <div class="card">
              <div class="card-header row m-0">
                <div
                  class="card-title text-left col-xl-4 col-md-4 col-xs-12 my-1"
                >
                  <h3>
                    {{ quiz_detail.length ? quiz_detail[0].quiz_name : "" }}
                  </h3>
                </div>
                <div class="col-xl-5 col-md-4 col-xs-12 text-left my-1">
                  <h4 class="">
                    You got
                    {{ quiz_detail.length ? quiz_detail[0].rank : "" }} rank out
                    of
                    {{
                      quiz_detail.length ? quiz_detail[0].total_attempted : ""
                    }}
                  </h4>
                </div>
                <div class="col-xl-3 col-md-4 col-xs-12 text-left my-1">
                  <h4 class=" ">
                    Created by:
                    {{ quiz_detail.length ? quiz_detail[0].name : "" }}
                  </h4>
                </div>
              </div>
              <div class="card-body">
                <div class="text-wrap">
                  <div class="d-flex">
                    <div style="margin-right: 20px;">
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
                    <div class="mx-1">
                      <span class="row"
                        ><span>Subject: </span
                        ><span>{{
                          quiz_detail.length ? quiz_detail[0].subject : ""
                        }}</span></span
                      >
                      <span class="row"
                        ><span> Obtain: </span
                        ><span>{{
                          quiz_detail.length ? quiz_detail[0].obtained : ""
                        }}</span></span
                      >
                      <span class="row"
                        ><span> Totol points: </span
                        ><span>{{
                          quiz_detail.length ? quiz_detail[0].total_points : ""
                        }}</span></span
                      >
                      <span class="row"
                        ><span> Attempted at: </span
                        ><span>
                          {{
                            quiz_detail.length
                              ? $moment(quiz_detail[0].attempted_at).format(
                                  "LL"
                                )
                              : ""
                          }}</span
                        ></span
                      >

                      <span
                        v-if="
                          quiz_detail.length ? quiz_detail[0].rating : false
                        "
                        class="mt-1 row"
                        style="display:flex;flex-direction:row"
                      >
                        <div class="rating-stars">
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
                      <span class="row my-1 text-success"
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

                    <!--<div>
                 <button class="btn btn-purple" style="cursor:pointer" onclick="showModal('quiz-instruction')">Instruction</button>
                </div>-->
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
                    <p class="my-1">Challege your friend!</p>
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
                      View all
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
  name: "quizResult1",
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
    $(".lesson-review-item-rating").rating({
      displayOnly: true,
      theme: "krajee-fas",
      showCaption: false
    });
  },
  methods: {
    sharedCode: function(sharedType) {
      //obtained out_of,quiz_name,quiz_id,quiz_slug

      let quiz_name = this.quiz_detail[0].quiz_name;
      let total_points = this.quiz_detail[0].total_points;
      let obtained = this.quiz_detail[0].obtained;
      let quiz_id = this.quiz_detail[0].quiz_id;
      let quiz_slug = this.quiz_detail[0].quiz_slug;
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
            "https://www.facebook.com/sharer/sharer.php?u=" +
              encodeURIComponent(
                window.location.hostname +
                  "/share?type=quiz&id=" +
                  quiz_id +
                  "&user=" +
                  this.userId +
                  "&src=sdkpreparse"
              ),
            "sharer",
            "toolbar=0,status=0,width=580,height=325"
          );
        });
        a.click();
      } else if (sharedType == "linkedin") {
        let url =
          "https://www.linkedin.com/shareArticle?mini=true&url=" +
          encodeURIComponent(
            "https://" +
              window.location.hostname +
              "/share?type=quiz&id=" +
              quiz_id +
              "&user=" +
              this.userId
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
              this.userId
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
              this.userId
          );
        window.open(url, "twitter", "toolbar=0,status=0,width=580,height=325");
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
          //   console.log(this.review_all);
          showModal("quiz_reviews");
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
            // console.log(this.quiz_detail);
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
