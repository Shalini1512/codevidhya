<template>
  <!---->
  <div
    id="quiz-exam"
    class="w-100"
    style="position:fixed; height:100%;"
    onmousedown="return false;"
    onselectstart="return false;"
  >
    <Header> </Header>
    <!--Quiz exam div -->
    <div class="container-fluid" style=" overflow-y:scroll;height:98%;margin-top:57px;">
      <div class="row h-100">
        <div class="col-xl-8 col-md-8 p-5 h-100" style="overflow-y:auto;">
          <div class="card" style="background:#f5f7fb; height:100%;">
            <div
              class="question"
              :id="quiz_questions.length ? quiz_questions[index].que_id : ''"
              v-html="
                quiz_questions.length ? quiz_questions[index].question : ''
              "
            ></div>
            <div class="text-right p-5">
              <button
                @click="
                  submit(
                    quiz_questions.length ? quiz_questions[index].que_id : ''
                  )
                "
                class="btn btn-purple"
              >
                Submit Answer
              </button>
            </div>
          </div>
        </div>
        <div class="col-xl-4 col-md-4 p-5">
          <div
            class="card p-5"
            style="background:rgba(100,8,204,.192); height:100%;"
          >
            <h3 class="mb-5 font-weight-bold">
              {{ quiz_questions.length ? quiz_questions[0].quiz_name : "" }}
            </h3>
            <h4 class="mb-1 font-weight-bold">Subject</h4>
            <p>{{ quiz_questions.length ? quiz_questions[0].subject : "" }}</p>
            <i class="flex-grow-1"></i>
            <div id="quiz-score" class="d-flex">
              <div
                id="question-count"
                class="d-flex flex-column"
                style="flex-grow: 1;"
              >
                <span style="font-size:1.5rem;"
                  >{{ index + 1 }}/{{ total_question }}</span
                >
                <span>Questions</span>
              </div>
              <div id="coins-wrapper" class="d-flex">
                <img
                  style="width: 48px"
                  src="/assets/images/quiz/coin-animated.svg"
                  class="mr-1"
                />
                <div id="coin-count" class="d-flex flex-column">
                  <span style="font-size:1.5rem;"
                    ><span
                      id="points"
                      v-if="
                        quiz_questions.length
                          ? quiz_questions[0].obtain_points == '' ||
                            quiz_questions[0].obtain_points == null
                          : true
                      "
                      >0</span
                    ><span id="points">{{
                      quiz_questions.length
                        ? quiz_questions[0].obtain_points
                        : 0
                    }}</span
                    ><span
                      >/{{
                        quiz_questions.length
                          ? quiz_questions[0].total_points
                          : 0
                      }}</span
                    ></span
                  >
                  <span>Coins earned</span>
                </div>
              </div>
            </div>
            <div class="progress mt-2" style="background:rgba(0,0,0,.5);">
              <div
                class="progress-bar"
                :style="
                  'width:' +
                    ((index + 1) * 100) / total_question +
                    '%; background:#f5127b;'
                "
                role="progressbar"
                :aria-valuenow="((index + 1) * 100) / total_question"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--quiz reaction model-->

    <div id="quiz-question-submitted-modal" class="cv-modal medium">
      <div class="cardlayout">
        <div
          class="body"
          style="display: flex; flex-direction: row; padding: 24px; overflow: visible; font-family:sans-serif"
        >
          <img
            src="/assets/images/quiz/happy.gif"
            id="reaction-image"
            style="width: 200px; margin-right: 24px; border-radius: 8px"
          />
          <div style="display: flex; flex-direction: column; flex-grow: 1;">
            <h3 id="reaction-heading" style="font-family:sans-serif">
              You got the correct answer!
            </h3>
            <p
              style="margin-bottom: 24px; font-weight: bold; font-size: 1.1rem;font-family:sans-serif"
            >
              You have earned <span id="point">0</span> points.
            </p>
            <p style="margin-bottom: 16px;font-family:sans-serif">
              Correct answer: {{ answerMessage }}
            </p>
            <p
              style="font-style: italic; line-height: 1.5;font-family:sans-serif"
              id="des"
            >
              {{ answerDescription }}
            </p>
            <button
              class="btn btn-primary"
              v-if="index == quiz_questions.length - 1"
              @click="show_modal()"
            >
              Continue
            </button>
            <button
              class="btn btn-primary"
              v-else
              @click="next_quiz(quiz_questions[index].que_id)"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--end quiz reaction model-->
    <!--complete quiz-->

    <div id="quiz-complete-modal" class="cv-modal medium">
      <div class="cardlayout">
        <div
          class="body"
          style="display: flex; flex-direction: column; align-items: center; margin: 32px 0; overflow: visible; text-align: center; overflow:auto"
        >
          <h3 style="margin-bottom: 24px;" id="reaction-heading">
            Congratulation! You have completed the quiz!
          </h3>

          <img
            src="/assets/images/quiz/complete_quiz.gif"
            id="reaction-image"
            style="width: 50%; max-width: 240px; margin-bottom: 24px; border-radius: 800px"
          />

          <p style="margin-bottom: 24px;">
            You have earned <span id="complete-points">0</span> out of
            <span id="complete-total-points">100</span> points.
          </p>
          <!-- Font awesome icon for-->
          <!--<div class="share_result">
          <span><i class="fab fa-facebook" style="color:#3b5998;background:#fff;font-size:30px;"></i></span>
          <span><i class="fab fa-twitter" style="color:#fff;background:#00acee;font-size:30px;display:inline-block;"></i></span>
        </div>-->
          <div class="social">
            <p class="my-1">Challenge your friend!</p>
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
          <!--end font awesome icons-->

          <div class="my-1">
            <label
              >Rating:
              <input
                id="star-rating"
                class="rating lesson-review-item-rating"
                type="text"
                value="5"
                data-size="xs"
            /></label>
            <label
              >Review:<textarea
                id="feedback_msg"
                rows="6"
                cols="76"
                style="height:80px;resize:none;"
              >
              </textarea
            ></label>
          </div>

          <button class="btn btn-purple" @click="submit_exam()">Finish</button>
        </div>
      </div>
    </div>
    <!--end complete quiz-->
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
//import Header from "@/components/header/HeaderMenuOnly.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import axios from "axios";
export default {
  name: "quiz-exam",
  //props: ["quiz_id", "quiz_slug", "sub_id"],
  components: {
    Header
  },
  data() {
    return {
      quiz_questions: "",
      index: 0,
      total_question: 0,
      points: 0,
      que_id: 0,
      userId: 0,
      quiz_id: 0,
      quiz_slug: "",
      sub_id: 0,
      answerMessage: "That is correct!",
      answerDescription: "",
      keydownCallback: null
    };
  },
  mounted() {
    $("#quiz-exam").contextmenu(function() {
      return false;
    });
    $(".clear-rating").hide();

    cvAuth.getUserId(
      function(userId) {
        this.userId = userId;
        if (!userId) {
          // this.$router.push("/login?redirect="+encodeURIComponent(window.location.href));
        }
        this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
        this.quiz_question(userId);
      }.bind(this)
    );

    $(".lesson-review-item-rating").rating({
      displayOnly: false,
      theme: "krajee-fas",
      showCaption: false
    });
    if (this.keydownCallback)
      window.removeEventListener("keydown", this.keydownCallback);
    this.keydownCallback = function(event) {
      //console.log(event);
      if (event.keyCode == 123) {
        event.preventDefault();
        return false;
      } else if (
        (event.ctrlKey && event.shiftKey && event.keyCode == 73) ||
        (event.ctrlKey && event.shiftKey && event.keyCode == 74)
      ) {
        event.preventDefault();
        return false;
      } else if (event.ctrlKey && event.keyCode == "C".charCodeAt(0)) {
        event.preventDefault();
        return false;
      } else if (event.ctrlKey && event.keyCode == "A".charCodeAt(0)) {
        event.preventDefault();
        return false;
      } else if (
        event.ctrlKey &&
        event.shiftKey &&
        event.keyCode == "I".charCodeAt(0)
      ) {
        event.preventDefault();
        return false;
      } else if (
        event.ctrlKey &&
        event.shiftKey &&
        event.keyCode == "C".charCodeAt(0)
      ) {
        event.preventDefault();
        return false;
      } else if (
        event.ctrlKey &&
        event.shiftKey &&
        event.keyCode == "J".charCodeAt(0)
      ) {
        event.preventDefault();
        return false;
      } else if (event.ctrlKey && event.keyCode == "U".charCodeAt(0)) {
        event.preventDefault();
        return false;
      }
    }.bind(this);
    let vm = this;

    window.addEventListener("keydown", vm.keydownCallback);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.keydownCallback);
  },
  methods: {
    sharedCode: function(sharedType) {
      //obtained out_of,quiz_name,quiz_id,quiz_slug
      let obtain = $("#complete-point").text();
      let out_of = $("complete-total-points").text();
      let quiz_name = this.quiz_questions[0].quiz_name;
      let quiz_id = this.quiz_questions[0].quiz_id;
      let quiz_slug = this.quiz_questions[0].quiz_slug;
      var left = screen.width / 2 - 580 / 2;
      var top = screen.height / 2 - 325 / 2;
      let vm = this;
      if (sharedType == "facebook") {
        //test.codevidhya.com/api/user/fb-share
        var a = document.createElement("a");
        a.target = "_blank";
        a.href = "javascript: void(0)";
        /*  "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.hostname + "/share?type=quiz&id=" +
          quiz_id +
          "&user=" +
          this.userId+"&src=sdkpreparse");*/
        a.addEventListener("click", function(e) {
          e.preventDefault();
          window.open(
            "https://www.facebook.com/sharer/sharer.php?u=" +
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
          "https://www.linkedin.com/shareArticle?mini=true&url=" +
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
          "https://www.twitter.com/share?url=" +
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
    show_modal: function() {
      hideModal("quiz-question-submitted-modal");
      //start animation
      confetti.start(3000);
      showModal("quiz-complete-modal");
    },
    submit_exam: function() {
      confetti.stop();
      var rating = $("#star-rating").val();
      var feedback_msg = $("#feedback_msg").val();
      this.$http
        .post("/api/user/updateCoinsInWallet", {
          user_id: this.userId,
          quiz_id: this.quiz_id,
          rating: rating,
          message: feedback_msg
        })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            let grant_points = parseInt($("#grant_points").text());
            grant_points = grant_points + this.points;
            $("#grant_points").text(grant_points);
            hideModal("qquiz-complete-modal");
            this.$router.push("/quiz-result?id=" + this.quiz_id);
            /*this.$router.push({
              name: "ViewAllQuizzesResults",
              params: { sub_id: this.sub_id }
            });*/
          }
        });

      //this.$router.push({name:'challenges'});
    },
    quiz_question: function(userId) {
      this.quiz_id = new URL(window.location).searchParams.get("id");
      if (!userId) {
        // this.$router.push("/quizzes");
        this.$router.push(
          "/login?redirect=" + encodeURIComponent(window.location.href)
        );
        return false;
      }
      axios
        .post("/api/user/DisplayQuizeAllQuestions", {
          user_id: this.$store.getters.getAuthData.auth_user_id,
          quiz_id: this.quiz_id,
          quiz_slug: this.quiz_slug
        })
        .then(res => {
          this.quiz_questions = res.data.data;
          if (!this.quiz_questions.length) this.$router.push("/quizzes");
          //  console.log(this.quiz_questions);

          if (
            (this.quiz_questions[0].price != 0 &&
              this.quiz_questions[0].status != 1) ||
            this.userId == this.quiz_questions[0].user_id
          ) {
            // console.log(this.quiz_questions);
            // this.$router.push("/quizzes");
            return false;
          } else if (
            this.quiz_questions[0].total_attempted_questions ==
            this.quiz_questions[0].total_questions
          ) {
            this.$router.push("quiz-result?id=" + this.quiz_id);
            //this.$router.push({ name: "ViewAllQuizzesResults" });
          }
          this.quiz_slug = this.quiz_questions[this.index].quiz_slug;
          this.que_id = this.quiz_questions[this.index].que_id;
          this.total_question = this.quiz_questions.length;
          if (
            this.quiz_questions[this.index].obtain_points == "" ||
            this.quiz_questions[this.index].obtain_points == null
          ) {
            this.points = 0;
          } else {
            this.points = parseInt(
              this.quiz_questions[this.index].obtain_points
            );
          }

          for (var i = 0; i < this.quiz_questions.length; i++) {
            if (
              this.quiz_questions[i].que_id == this.quiz_questions[i].atempt_que
            ) {
              this.index = this.index + 1;
            }
            this.quiz_questions[
              i
            ].question = this.getQuizContentWithAllTemplateRendered_local(
              this.quiz_questions[i].question
            );
          }
        });
    },
    next_quiz: function(que_id) {
      hideModal("quiz-question-submitted-modal");

      let curr_index =
        this.quiz_questions.findIndex(x => x.que_id === que_id) + 1;
      let qt_id = this.quiz_questions[this.index].qt_id;
      if (curr_index >= this.quiz_questions.length) {
        return false;
      }
      this.index = curr_index;
      this.que_id = this.quiz_questions[this.index].que_id;

      /**insert quiz data */
    },

    submit: function(que_id) {
      let point = 0;
      let qtext = "";
      let correctAns = "";
      let givenAns = "";
      let des = "";
      let correctIndex = "";
      let givenIndex = "";
      if (this.quiz_questions[this.index].qt_id == 1) {
        qtext = $("#" + que_id)
          .find(".qtext")
          .text();
        correctAns = $("#" + que_id).find(">div")[0].dataset.answer;
        givenAns = $("#" + que_id)
          .find(".qtext")
          .text();
        des = $("#" + que_id)
          .find(".lms-description")
          .text();
      } else {
        qtext = $("#" + que_id)
          .find(".qtest")
          .text();
        correctAns = $("#" + que_id).find(">div")[0].dataset.answer;
        correctIndex = $("#" + que_id).find(">div")[0].dataset.option;
        givenAns = $("#" + que_id)
          .find(".lms-mcq-selected-answer")
          .text();
        givenIndex =
          $($("#" + que_id).find(".lms-mcq-selected-answer"))
            .parent()
            .index() + 1;
        des = $("#" + que_id)
          .find(".mcq-description")
          .text();
      }

      var correctAnsRegex = new RegExp(correctAns);
      this.answerMessage = correctAns;
      this.answerDescription = des;
      //if (givenAns == correctAns) {
      if (
        givenAns.match(correctAnsRegex) ||
        (correctIndex == givenIndex && correctIndex && givenIndex)
      ) {
        point = this.quiz_questions[this.index].points;
        $("#reaction-image").attr("src", "/assets/images/quiz/happy.gif");
        $("#reaction-heading").text("You got the correct answer!");
      } else {
        $("#reaction-heading").text("Oh no!");

        $("#reaction-image").attr("src", "/assets/images/quiz/puzzled.gif");
        point = 0;
      }
      $("#des").text(des);
      showModal("quiz-question-submitted-modal");
      $("#point").text(point);
      let grant_points = parseInt($("#grant_points").text());
      this.points = parseInt(this.points) + parseInt(point);
      $("#points").text(this.points);

      if (this.index == this.quiz_questions.length - 1) {
        grant_points = grant_points + this.points;
        // $("#grant_points").text(grant_points);
        $("#complete-points").text(this.points);
        $("#complete-total-points").text(this.quiz_questions[0].total_points);
      }
      let quiz_idd = this.quiz_questions[0].quiz_id;

      this.$http
        .post("/api/user/insertQuizResult", {
          user_id: this.$store.getters.getAuthData.auth_user_id,
          quiz_id: quiz_idd,
          quiz_slug: this.quiz_slug,
          point: point,
          que_id: this.quiz_questions[this.index].que_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            if (res.body.data == "1") {
              /// notify("Successfully submited","success");
              //  this.$router.push({name:'quiz', params:{quiz_id:this.quiz_questions[0].quiz_id}});
            } else {
              // notify("Successfully submited","success");
              //  this.$router.push({name:'quiz', params:{quiz_id:this.quiz_questions[0].quiz_id}});
            }
          }
        });
    },
    getQuizContentWithAllTemplateRendered_local: function(content) {
      content = this.getQuizRepresentation_local(content);
      content = this.getQuestionContentWithMcqQuizTemplatesRendered_local(
        content
      );
      content = content.replace(/style="font-size:[\s]*16px"/g, "");
      content = content.replace(/<a.*name="examples_no">\d*<\/a>/g, "");
      return content;
    },
    getQuizRepresentation_local: function(content) {
      var QuizTemplates = getWholeMatches(
        content,
        /<pre>[\s\S]?\s*%fwo%/,
        /%endfwo%[\s\S]?\s*<\/pre>/
      );
      for (var i = 0; i < QuizTemplates.length; i++) {
        var markup = this._getQuizFwoMarkupFromTemplate_local(QuizTemplates[i]);
        content = content.replace(QuizTemplates[i], markup);
      }
      return content;
    },

    _getQuizFwoMarkupFromTemplate_local: function(template) {
      template = template.replace(
        /<pre>[\s\S]?\s*%fwo%/,
        '<div class="quiz-item quiz_fill_in_blank" style="background:#f5f7fb;" data-answer="'
      );
      template = template.replace("%answer%", "");
      template = template.replace(
        "%endanswer%%questionpoint%",
        '" data-point="'
      );
      template = template.replace("%endquestionpoint%", '">');

      template = template.replace("%question%", "<h3>");
      template = template.replace("%endquestion%", "</h3>");
      template = template.replace(
        "%statement%",
        '<p class="fwo-statement qtext">'
      );
      template = template.replace(/%br%/g, "<br>");
      template = template.replace(/%words%/g, "<span>");
      template = template.replace(/%endwords%/g, "</span>");
      template = template.replace(
        /%blank%/g,
        '<span class="fwo-blank fwo-blank-normal my-1" contenteditable="true"></span>'
      );
      template = template.replace(
        /%blanksmall%/g,
        '<span class="fwo-blank fwo-blank-small my-1" contenteditable="true"></span>'
      );
      template = template.replace(
        /%blanklarge%/g,
        '<span class="fwo-blank fwo-blank-large my-1" contenteditable="true"></span>'
      );
      template = template.replace("%endstatement%", "</p>");

      template = template.replace("%options%", '<div class="lms-fwo-options">');
      template = template.replace(
        /%option%/g,
        '<button class="option btn mr-3 my-1" style="background: #e5e8ee; min-width:182px;">'
      );
      template = template.replace(/%endoption%/g, "</button>");
      //template = template.replace("%endoptions%",'</div><button class="submit-fwo-btn">Submit</button>');
      template = template.replace("%endoptions%", "</div>");
      template = template.replace(
        "%description%",
        '<div><p class="lms-description explanation">'
      );
      template = template.replace("%enddescription%", "</p></div>");
      template = template.replace(
        "%correctfeedback%",
        '<div><p class="lms-correct-ans-feedback"><i class="fas fa-check-circle"></i><span>'
      );
      template = template.replace("%endcorrectfeedback%", "</span></p>");
      template = template.replace(
        "%wrongfeedback%",
        '<p class="lms-wrong-ans-feedback"><i class="fas fa-times-circle"></i><span>'
      );
      template = template.replace("%endwrongfeedback%", "</span></p>");
      template = template.replace(/%endfwo%[\s\S]?\s*<\/pre>/, "</div></div>");

      // Make the first blank active
      template = template.replace(
        /<span class="fwo-blank (.*?)"/,
        '<span class="fwo-blank $1 fwo-active-blank"'
      );

      return template;
    },
    getQuestionContentWithMcqQuizTemplatesRendered_local: function(content) {
      var mcqQuizTemplates = getWholeMatches(
        content,
        /<pre>[\s\S]?\s*%mcq%/,
        /%endmcq%[\s\S]?\s*<\/pre>/
      );
      for (var i = 0; i < mcqQuizTemplates.length; i++) {
        var markup = this._getMcqQuestionMarkupFromTemplate_local(
          mcqQuizTemplates[i]
        );
        markup = markup.replace(/<p><\/p>/g, "");
        markup = markup.replace(/<p><pre><\/pre><\/p>/g, "");
        markup = markup.replace(/<pre><\/pre>/g, "");
        markup = markup.replace(/<p><\/p>/g, "");
        content = content.replace(mcqQuizTemplates[i], markup);
      }
      return content;
    },

    _getMcqQuestionMarkupFromTemplate_local: function(template) {
      template = template.replace(
        /<pre>[\s\S]?\s*%mcq%/,
        '<div class="quiz-mcq quiz-item" style="background:#f5f7fb;" data-answer="'
      );
      template = template.replace(/%answer%/, "");
      template = template.replace("%answer%", "");
      template = template.replace("%endanswer%", '" ');
      template = template.replace("%trueoption%", ' data-option="');
      template = template.replace("%endtrueoption%", '" ');
      template = template.replace("%questionpoint%", '" data-point="');
      template = template.replace("%endquestionpoint%", '">');
      template = template.replace(
        "%question%",
        '<h3 class=""  id="qtest">Question '
      );
      template = template.replace("%endquestion%", "</h3>");
      template = template.replace(
        "%questionimg%",
        '<div style="width:400px"><img class="mb-3" alt="Responsive image" src="/dynamic/Quizzes/quiz_question_options_images/'
      );
      template = template.replace(
        "%endquestionimg%",
        '" style="display:block;width:100%;height:auto"/></div>'
      );

      template = template.replace("%options%", '<div class="lms-mcq-options">');
      template = template.replace(
        /%option%/g,
        '<div class="option-container mb-2"><button class="radiocontainer btn text-left mb-2" style="min-width: 240px; background: #e5e8ee; border-radius:3px;">'
      );
      template = template.replace(
        /%optionimg%/g,
        '<div style="width:100%;margin-top:2%;"><img  alt="Responsive image" src="/dynamic/Quizzes/quiz_question_options_images/'
      );
      template = template.replace(
        /%endoptionimg%/g,
        '" style="display:block;width:100%;height:auto"/></div>'
      );
      template = template.replace(/%optiontxt%/g, "<p>");
      template = template.replace(/%endoptiontxt%/g, "</p>");

      template = template.replace(/%endoption%/g, "</button></div>");

      template = template.replace("%endoptions%", "</div>");
      template = template.replace(
        "%description%",
        '<div><p class="mcq-description">'
      );
      template = template.replace("%enddescription%", "</p></div>");

      template = template.replace(/%endmcq%[\s\S]?\s*<\/pre>/, "</div>");

      return template;
    },
    /**end rendee */
    /* local function*/
    initMcqQuestion: function() {
      $(".lms-mcq-options button").unbind("click");
      $(".lms-mcq-options button").click(function(e) {
        $($($(this.parentElement).siblings()).find("button")).removeClass(
          "lms-mcq-selected-answer"
        );
        $($($(this.parentElement).siblings()).find("button")).removeClass(
          "lms-mcq-wrong-answer"
        );

        // $(this.parentElement.parentElement).find(".mcq-description").css("display","flex");
        let correctOptionsIndex = $(this.parentElement).index() + 1;
        // console.log(correctOptionsIndex);

        if (
          this.innerText ==
            this.parentElement.parentElement.getAttribute("data-answer") ||
          correctOptionsIndex ==
            this.parentElement.parentElement.parentElement.getAttribute(
              "data-option"
            )
        ) {
          $(this).addClass("lms-mcq-selected-answer");
          // let point = $("#point").text();
          point = 0; //parseInt(point);
          point =
            point +
            parseInt(
              this.parentElement.parentElement.getAttribute("data-point")
            );

          var correctModal = $("#qotd-submitted-modal");
          if (correctModal.length) {
            correctModal
              .prepareTransition({ property: "opacity" })
              .addClass("modal-shown");
          }
        } else {
          let testimonialElements = $(".radiocontainer");

          $(this).addClass("lms-mcq-selected-answer");
        }
      });
    },

    initFillQuizzes: function() {
      $(".lms-fwo-options button").unbind("click");
      $(".lms-fwo-options button").click(function(e) {
        $(e.currentTarget.parentElement.parentElement)
          .find(".fwo-active-blank")
          .text(e.currentTarget.textContent);
        var nextBlank = $(e.currentTarget.parentElement.parentElement)
          .find(".fwo-active-blank")
          .nextAll(".fwo-blank");
        $(e.currentTarget.parentElement.parentElement)
          .find(".fwo-active-blank")
          .removeClass("fwo-active-blank");
        if (nextBlank.length > 0) {
          $(nextBlank[0]).addClass("fwo-active-blank");
        } else {
          $(e.currentTarget.parentElement.parentElement)
            .find(".fwo-blank")
            .addClass("fwo-active-blank");
        }
        let length = $(e.currentTarget.parentElement.parentElement).find(
          ".fwo-blank"
        ).length;
        let divs = $(e.currentTarget.parentElement.parentElement).find(
          ".fwo-blank"
        ); //document.querySelectorAll(".fwo-blank");

        for (var i = 0; i < length; i++) {
          if (divs[i].innerText == "" || divs[i].innerText == null) {
            return false;
          }
        }

        $(e.currentTarget.parentElement.parentElement)
          .find(".fwo-blank")
          .attr("contenteditable", false);
        // $(e.currentTarget.parentElement.parentElement).find(".radiocontainer").attr("disabled",true);

        if (
          $(this.parentElement.parentElement)
            .find(".qtext")
            .text() ==
          this.parentElement.parentElement.getAttribute("data-answer")
        ) {
        } else {
        }
        /* let nodes = this.parentElement.getElementsByTagName('*');
         for(var i = 0; i < nodes.length; i++){
          nodes[i].disabled = true;
      }*/
        let que_id = this.parentElement.parentElement.parentElement.getAttribute(
          "data-set"
        );
        let user_id = $("#user_id").val();
        let quiz_id = $("#quiz_id").val();

        //ajax code to sent data to server
        let p = parseInt(
          this.parentElement.parentElement.getAttribute("data-point")
        );

        $(this.parentElement.parentElement.parentElement.parentElement)
          .find(".nextbtns")
          .removeAttr("disabled");
        //  $(this.parentElement.parentElement).find(".lms-description").css("display","flex");
      });

      $(".fwo-blank").unbind("click");
      $(".fwo-blank").click(function(e) {
        $(e.currentTarget.parentElement)
          .find(".fwo-blank")
          .removeClass("fwo-active-blank");
        $(e.currentTarget).addClass("fwo-active-blank");
      });
    }

    /*end function*/
  },
  updated() {
    this.initMcqQuestion();
    this.initFillQuizzes();
    $(".clear-rating").hide();
    $(".lesson-review-item-rating").rating({
      displayOnly: false,
      theme: "krajee-fas",
      showCaption: false
    });
  }
};
</script>
<style lang="scss">
.quizOpt {
  background: #e5e8ee;
  min-width: 400px;
}
.lms-mcq-options {
  counter-reset: quiz-options-counter;
  .radiocontainer {
    &::before {
      counter-increment: quiz-options-counter;
      margin-right: 8px;
      background: #f5df19;
      color: #000;
      font-weight: 600;
      text-align: center;
      padding: 5px 8px;

      border-radius: 50%;

      margin-bottom: 40px !important;
      content: counter(quiz-options-counter);
    }
  }
}
#qtest > pre {
  padding-left: 0px !important;
}
.option-container > button {
  pre {
    padding-top: 10px !important;
    color: #000 !important;
    padding-left: 0px !important;
    padding-bottom: 0px !important;
    margin-bottom: 0px !important;
    line-height: normal !important;
    height: auto !important;
  }
}
.option-container > .lms-mcq-selected-answer {
  background: #5bc783 !important;
  pre {
    position: relative;
    color: #fff !important;
  }
}
@media only screen and (max-width: 750px) {
  #quiz-menu {
    width: 100%;
  }
}

@media only screen and (max-width: 768px) {
  #quiz-exam {
    overflow-y: auto;
  }
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
/*.share_result {
  span{
      i.fa {
  display: inline-block;
   border-radius: 60px;
   
  box-shadow: 0px 0px 2px #888;
  padding: 0.5em 0.6em;

}
  }

} */
</style>
