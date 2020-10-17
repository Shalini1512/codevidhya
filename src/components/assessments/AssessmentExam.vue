<template>
  <div
    class="container-fluid"
    id="container"
    style="padding:0"
    v-on:mouseover="mouseOver"
    :data-x="auth_user_id"
  >
    <!-- The Modal -->
    <div id="myModal" class="modal">
      <span class="close">&times;</span>
      <img class="modal-content" id="preview_img" />
    </div>

    <div id="overlay" v-on:mouseover="mouseOver">
      <div class="col-xs-2">
        <figure>
          <img
            id="spinner"
            class="img-responsive"
            src="../../static/img/spinner.gif"
          />
          <figcaption class="text-primary">
            <h4>Waiting for connection</h4>
          </figcaption>
          <figcaption class="text-dark">
            <h4>Please wait before submitting exam!!</h4>
          </figcaption>
          <figcaption v-if="onlineState == true">
            <button class="btn btn-info" style="width:auto;" v-on:click="off()">
              Submit Exam
            </button>
          </figcaption>
        </figure>
      </div>
    </div>

    <div class="alert alert-danger" v-if="onlineState == false">
      No Internet connection!!
    </div>

    <div class="row top-row">
      <div class="col-sm-2 top-columns">
        <img
          class="img-responsive"
          src="../../static/img/logo.png"
          height="60%"
          width="100%"
        />
      </div>
      <div class="col-sm-4 top-columns">
        <span class="testname">Assessment Name: {{ assessment_name }} </span>
      </div>
      <div class="col-sm-4 top-columns">
        <span class="student-name"> {{ name }}</span>
      </div>
      <div class="col-sm-2 top-columns">
        <span class="timer" id="timer"> {{ crnt_time }} </span>
      </div>
    </div>
    <!--second row-->
    <div class="row secnd-row-colmns">
      <div class="col-sm-1">
        <div class="dropdown" id="all_subjects_div">
          <button @click="myFunction()" class="dropbtn">
            &nbsp; &nbsp; &nbsp;
          </button>
          <div
            id="myDropdown"
            class="dropdown-content"
            style="overflow:hidden; left:0px;"
          >
            <div v-for="subject in subjects" :key="subject.sub_id">
              <button
                class="sub_btn_top bg-info"
                style="color:#FFF; width:100%;"
                v-on:click="
                  sub_name = subject.sub_name;
                  show_sub_que(subject.sub_id);
                  provide_ans('sub_btn');
                "
              >
                {{ subject.sub_name }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-3 ">
        <span class="row2-span">
          <div class="for_font" id="sub_name" style="display:block;">
            {{ sub_name }}
          </div>
        </span>
      </div>
      <div class="col-sm-3 ">
        <span class="row2-span"> Attempted </span
        ><span
          class="row2-numbers"
          id="tot_atmpt_que"
          style="display:inline-block;"
          >{{ tot_attempt }}</span
        >
      </div>
      <div class="col-sm-3">
        <span class="row2-span">Not Attempted </span>
        <span
          class="row2-numbers"
          id="tot_unatmpt_que"
          style="display:inline-block;"
          >{{ total_que - tot_attempt }}</span
        >
      </div>

      <div class="col-sm-2 text-right">
        <button @click="toggleDiv('myContent')" class="num-plate-btn">
          &nbsp; &nbsp; &nbsp; &nbsp;
        </button>
      </div>
    </div>

    <!--questions div section -->
    <div class="qstn-div">
      <div class="col-sm-12">
        <div id="sr_num">Question No.:&nbsp; {{ counter }}</div>

        <div
          style="display:block; overflow:auto; padding:8px 8px; user-select:none;"
          id="eng_que"
          name="que"
          v-html="question"
        >
          <div
            class="image-preview"
            style="padding-left:20px; user-select:none;"
            v-if="question_img != ''"
          >
            <img
              class="preview"
              id="question_img"
              :src="'../static/uploads/' + question_img"
              v-on:dblclick="zoom_img('question_img')"
            />
          </div>
        </div>
        <div
          style="display:block; overflow:auto; padding:8px 8px; user-select:none;"
          id="eng_opton"
        >
          <div
            v-if="
              (opt1 != '' || opt1_img != '') &&
                (opt2 != '' || opt2_img != '') &&
                (opt3 != '' || opt3_img != '') &&
                (opt4 != '' || opt4_img != '')
            "
          >
            <input
              type="radio"
              id="hidden-option"
              name="option"
              value="0"
              style="display:none;"
              :checked="checked0"
            />
            <div class="form-check">
              <div class="form-check-inline">
                <input
                  class="form-check-input eng_option"
                  type="radio"
                  name="option"
                  id="option1"
                  value="opt1"
                  :checked="checked1"
                  v-on:click="st_ans = 'opt1'"
                />
                <label
                  class="form-check-label"
                  for="option1"
                  v-html="opt1"
                ></label>
              </div>
              <div
                class="image-preview"
                style="padding-left:20px; user-select:none;"
                v-if="opt1_img != ''"
              >
                <img
                  class="preview"
                  style="user-select:none;"
                  id="opt1_img"
                  :src="'../static/uploads/' + opt1_img"
                  v-on:dblclick="zoom_img('opt1_img')"
                />
              </div>
            </div>
            <div class="form-check">
              <div class="form-check-inline">
                <input
                  class="form-check-input eng_option"
                  type="radio"
                  name="option"
                  id="option2"
                  value="opt2"
                  :checked="checked2"
                  v-on:click="st_ans = 'opt2'"
                />
                <label
                  class="form-check-label"
                  for="option2"
                  v-html="opt2"
                ></label>
              </div>
              <div
                class="image-preview"
                style="padding-left:20px; user-select:none;"
                v-if="opt2_img != ''"
              >
                <img
                  class="preview"
                  style="user-select:none;"
                  id="opt2_img"
                  :src="'../static/uploads/' + opt2_img"
                  v-on:dblclick="zoom_img('opt2_img')"
                />
              </div>
            </div>
            <div class="form-check">
              <div class="form-check-inline">
                <input
                  class="form-check-input eng_option"
                  type="radio"
                  name="option"
                  id="option3"
                  value="opt3"
                  :checked="checked3"
                  v-on:click="st_ans = 'opt3'"
                />
                <label
                  class="form-check-label"
                  for="option3"
                  v-html="opt3"
                ></label>
              </div>
              <div
                class="image-preview"
                style="padding-left:20px; user-select:none;"
                v-if="opt3_img != ''"
              >
                <img
                  class="preview"
                  style="user-select:none;"
                  id="opt3_img"
                  :src="'../static/uploads/' + opt3_img"
                  v-on:dblclick="zoom_img('opt3_img')"
                />
              </div>
            </div>
            <div class="form-check">
              <div class="form-check-inline">
                <input
                  class="form-check-input eng_option"
                  type="radio"
                  name="option"
                  id="option4"
                  value="opt4"
                  :checked="checked4"
                  v-on:click="st_ans = 'opt4'"
                />
                <label
                  class="form-check-label"
                  for="option4"
                  v-html="opt4"
                ></label>
              </div>
              <div
                class="image-preview"
                style="padding-left:20px; user-select:none;"
                v-if="opt4_img != ''"
              >
                <img
                  class="preview"
                  style="user-select:none;"
                  id="opt4_img"
                  :src="'../static/uploads/' + opt4_img"
                  v-on:dblclick="zoom_img('opt4_img')"
                />
              </div>
            </div>
          </div>
          <div v-else>
            <textarea
              class="form-control"
              id="sub_ans"
              cols="100"
              rows="15"
              style="border:thin solid #CCCCCC; resize:none;"
              v-model="sub_ans"
              v-on:keyup="textarea_value()"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
    <!--questions div section -->
    <!--footer button section-->
    <div id="lower-btn-div" class="row">
      <input
        type="button"
        class="btn bg-primary lower-btn "
        value="Clear"
        name="clear"
        id="Clear"
        style="color:#FFF; border-radius:5px 5px;"
        v-on:click="clear_response()"
      />
      <input
        type="button"
        name="pre"
        id="pre"
        class="btn bg-primary lower-btn"
        value="Previous"
        style="color:#FFF; border-radius:5px 5px;"
        v-on:click="
          navigation('previous');
          provide_ans('pre_btn');
        "
      />
      <input
        type="button"
        name="next"
        id="next"
        class="btn bg-primary lower-btn"
        value="Save & Next"
        style="color:#FFF; border-radius:5px 5px;"
        v-on:click="navigation('next')"
      />
      <input
        type="button"
        id="sbmt"
        name="exam_submit"
        class="btn bg-primary lower-btn"
        value="Submit Exam"
        style="color:#FFF; border-radius:5px 5px;"
        v-on:click="submit_exam()"
      />
    </div>
    <!--footer button section-->
    <div id="myContent">
      <div id="btn-plate">
        <div style="display:block;" id="butons">
          <div v-for="que_no in tot_que" :key="que_no">
            <div v-for="st_btn in user_ans" :key="st_btn.que_id">
              <button
                v-if="
                  que_no.sr_no == st_btn.sr_no &&
                    st_btn.st_ans == null &&
                    st_btn.visit == null
                "
                :class="'btn ' + not_attempt"
                v-on:click="
                  counter = que_no.sr_no;
                  load_question(que_no.sr_no, que_no.que_id);
                  provide_ans('que_btn');
                "
              >
                {{ que_no.sr_no }}
              </button>
              <button
                v-else-if="
                  que_no.sr_no == st_btn.sr_no &&
                    st_btn.st_ans == '' &&
                    st_btn.visit != ''
                "
                :class="'btn ' + visit"
                v-on:click="
                  counter = que_no.sr_no;
                  load_question(que_no.sr_no, que_no.que_id);
                  provide_ans('que_btn');
                "
              >
                {{ que_no.sr_no }}
              </button>
              <button
                v-else-if="
                  que_no.sr_no == st_btn.sr_no &&
                    st_btn.st_ans != '' &&
                    st_btn.visit != ''
                "
                :class="'btn ' + attempt"
                v-on:click="
                  counter = que_no.sr_no;
                  load_question(que_no.sr_no, que_no.que_id);
                  provide_ans('que_btn');
                "
              >
                {{ que_no.sr_no }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};
</script>

<script>
import AuthMixin from "../mixins/AuthMixin.js";

export default {
  mixins: [AuthMixin],
  data() {
    return {
      onlineState: navigator.onLine,
      cls_id: "",
      user_id: "",
      sec_id: "",
      role_id: "",
      sch_id: "",
      name: "",
      assessment_id: "",
      assessment_name: "",
      tot_que: [],
      subjects: [],
      user_ans: [],
      crnt_time: "",
      sub_ans: "",
      seconds: "",
      sub_name: "",
      counter: 1,
      question: "",
      opt1: "",
      opt2: "",
      opt3: "",
      opt4: "",
      st_ans: "",
      checked0: false,
      checked1: false,
      checked2: false,
      checked3: false,
      checked4: false,
      not_attempt: "not-attempt",
      attempt: "attempt",
      visit: "visit",
      tot_attempt: 0,
      total_que: "",
      st_visit: 1,
      exm_timer: 1,
      sub_id: "",
      question_img: "",
      opt1_img: "",
      opt2_img: "",
      opt3_img: "",
      opt4_img: "",
      exam_type: false
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    window.onbeforeunload = function(e) {
      e.preventDefault();
      e.returnValue = "Leave the exam?";
      //if we return nothing here (just calling return;) then there will be no pop-up question at all
      //return;
    };
  },
  methods: {
    onUserIdObtained() {
      this.name = this.$store.getters.getAuthData.auth_user_full_name;
      this.user_id = this.$store.getters.getAuthData.auth_user_id;
      this.st_id = this.$store.getters.getAuthData.auth_user_id;
      this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
      this.cls_id = this.$store.getters.getAuthData.auth_cls_id;
      this.role_id = this.$store.getters.getAuthData.auth_role_id;
      this.sec_id = this.$store.getters.getAuthData.auth_sec_id;
      if (this.$route.query.assessment) {
        var query = atob(this.$route.query.assessment);
        var params = query.split(",");
        this.assessment_id = params[0];
        this.assessment_name = params[1];
        if (this.user_id != undefined) {
          this.getAssessmentTime();
        }
      }
      this.assessment_que_detail();
    },
    toggleDiv: function(divId) {
      $("#" + divId).toggle();
    },
    myFunction: function() {
      document.getElementById("myDropdown").classList.toggle("show");
    },
    countdown: function(seconds) {
      var endTime, hours, mins, msLeft, time, sec;
      var obj = this;
      function twoDigits(n) {
        return n <= 9 ? "0" + n : n;
      }
      function updateTimer() {
        msLeft = endTime - +new Date();

        if (msLeft < 1000) {
          obj.exm_timer = 0;
          obj.submit_exam();
        } else {
          time = new Date(msLeft);
          hours = time.getUTCHours();
          hours = twoDigits(hours);
          mins = time.getUTCMinutes();
          mins = twoDigits(mins);
          sec = time.getUTCSeconds();
          sec = twoDigits(sec);
          document.getElementById("timer").innerHTML =
            hours + ":" + mins + ":" + sec;
          setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
        }
      }
      endTime = +new Date() + 1000 * seconds + 500;
      updateTimer();
    },
    getAssessmentTime: function() {
      this.$http
        .post("/api/user/Assessment_Time", {
          user_id: this.user_id,
          assessment_id: this.assessment_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.countdown(res.body.assessmentTime);
          }
        });
    },
    assessment_que_detail: function() {
      var i;
      this.$http
        .post("/api/user/Assessment_Que_Detail", {
          assessment_id: this.assessment_id,
          user_id: this.user_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.subjects = res.body.subjects;

            for (var i = 0; i < this.subjects.length; i++) {
              if (this.subjects[i].que_type > 0) {
                this.exam_type = true;
              }
            }
            this.tot_que = res.body.tot_que;

            this.user_ans = res.body.user_ans;
            this.sub_name = this.subjects[0].sub_name;
            this.sub_id = this.subjects[0].sub_id;

            this.question = this.tot_que[0].question;
            this.question_img = this.tot_que[0].question_img;
            this.opt1 = this.tot_que[0].opt1;
            this.opt2 = this.tot_que[0].opt2;
            this.opt3 = this.tot_que[0].opt3;
            this.opt4 = this.tot_que[0].opt4;
            this.opt1_img = this.tot_que[0].opt1_img;
            this.opt2_img = this.tot_que[0].opt2_img;
            this.opt3_img = this.tot_que[0].opt3_img;
            this.opt4_img = this.tot_que[0].opt4_img;
            this.check_select(this.counter);
            this.total_que = this.tot_que.length;
            this.done_question(this.counter, "", "load");
            this.attempt_que();
          }
        });
    },
    load_question: function(sr_no, que_id) {
      var i;
      var j;
      for (i = 0; i < this.tot_que.length; i++) {
        if (
          this.tot_que[i].sr_no == sr_no &&
          this.tot_que[i].que_id == que_id
        ) {
          this.sub_name = this.tot_que[i].sub_name;
          this.sub_id = this.tot_que[i].sub_id;
          this.question = this.tot_que[i].question;
          this.question_img = this.tot_que[i].question_img;
          this.opt1 = this.tot_que[i].opt1;
          this.opt2 = this.tot_que[i].opt2;
          this.opt3 = this.tot_que[i].opt3;
          this.opt4 = this.tot_que[i].opt4;
          this.opt1_img = this.tot_que[i].opt1_img;
          this.opt2_img = this.tot_que[i].opt2_img;
          this.opt3_img = this.tot_que[i].opt3_img;
          this.opt4_img = this.tot_que[i].opt4_img;
          break;
        }
      }
      this.check_select(sr_no);
      this.done_question(sr_no, "", "que_btn");
    },

    show_sub_que: function(sub_id) {
      var i;
      var j;

      for (i = 0; i < this.tot_que.length; i++) {
        if (this.tot_que[i].sub_id == sub_id) {
          this.counter = this.tot_que[i].sr_no;
          this.sub_name = this.tot_que[i].sub_name;
          this.sub_id = this.tot_que[i].sub_id;
          this.question = this.tot_que[i].question;
          this.question_img = this.tot_que[i].question_img;
          this.opt1 = this.tot_que[i].opt1;
          this.opt2 = this.tot_que[i].opt2;
          this.opt3 = this.tot_que[i].opt3;
          this.opt4 = this.tot_que[i].opt4;
          this.opt1_img = this.tot_que[i].opt1_img;
          this.opt2_img = this.tot_que[i].opt2_img;
          this.opt3_img = this.tot_que[i].opt3_img;
          this.opt4_img = this.tot_que[i].opt4_img;
          this.check_select(this.tot_que[i].sr_no);
          this.done_question(this.tot_que[i].sr_no, "", "sub_btn");
          break;
        }
      }
    },
    navigation: function(data) {
      var i;
      var sr_no;
      var pre_sr_no = this.counter;
      var len = this.tot_que.length - 1;
      var answer = "";

      if (data == "next") {
        answer = this.provide_ans("nxt_btn");
        this.done_question(pre_sr_no, answer, "nxt_btn");
        this.st_ans = "";
        answer = "";
        this.counter = this.counter + 1;
        for (i = 0; i < this.tot_que.length; i++) {
          if (this.counter <= this.tot_que.length) {
            if (this.tot_que[i].sr_no == this.counter) {
              this.counter = this.tot_que[i].sr_no;
              this.sub_name = this.tot_que[i].sub_name;
              this.sub_id = this.tot_que[i].sub_id;
              this.question = this.tot_que[i].question;
              this.question_img = this.tot_que[i].question_img;
              this.opt1 = this.tot_que[i].opt1;
              this.opt2 = this.tot_que[i].opt2;
              this.opt3 = this.tot_que[i].opt3;
              this.opt4 = this.tot_que[i].opt4;
              this.opt1_img = this.tot_que[i].opt1_img;
              this.opt2_img = this.tot_que[i].opt2_img;
              this.opt3_img = this.tot_que[i].opt3_img;
              this.opt4_img = this.tot_que[i].opt4_img;
              this.check_select(this.tot_que[i].sr_no);
              break;
            }
          } else {
            this.counter = this.tot_que[0].sr_no;
            this.sub_name = this.tot_que[0].sub_name;
            this.sub_id = this.tot_que[0].sub_id;
            this.question = this.tot_que[0].question;
            this.question_img = this.tot_que[0].question_img;
            this.opt1 = this.tot_que[0].opt1;
            this.opt2 = this.tot_que[0].opt2;
            this.opt3 = this.tot_que[0].opt3;
            this.opt4 = this.tot_que[0].opt4;
            this.opt1_img = this.tot_que[0].opt1_img;
            this.opt2_img = this.tot_que[0].opt2_img;
            this.opt3_img = this.tot_que[0].opt3_img;
            this.opt4_img = this.tot_que[0].opt4_img;
            this.check_select(this.tot_que[0].sr_no);
            break;
          }
        }
      } else if (data == "previous") {
        this.done_question(pre_sr_no, "", "pre_btn");
        this.counter = this.counter - 1;

        for (i = 0; i < this.tot_que.length; i++) {
          if (this.counter != 0) {
            if (this.tot_que[i].sr_no == this.counter) {
              this.counter = this.tot_que[i].sr_no;
              this.sub_name = this.tot_que[i].sub_name;
              this.sub_id = this.tot_que[0].sub_id;
              this.question = this.tot_que[i].question;
              this.question_img = this.tot_que[i].question_img;
              this.opt1 = this.tot_que[i].opt1;
              this.opt2 = this.tot_que[i].opt2;
              this.opt3 = this.tot_que[i].opt3;
              this.opt4 = this.tot_que[i].opt4;
              this.opt1_img = this.tot_que[i].opt1_img;
              this.opt2_img = this.tot_que[i].opt2_img;
              this.opt3_img = this.tot_que[i].opt3_img;
              this.opt4_img = this.tot_que[i].opt4_img;
              this.check_select(this.tot_que[i].sr_no);
              break;
            }
          } else {
            this.counter = this.tot_que[len].sr_no;
            this.sub_name = this.tot_que[len].sub_name;
            this.sub_id = this.tot_que[len].sub_id;
            this.question = this.tot_que[len].question;
            this.question_img = this.tot_que[len].question_img;
            this.opt1 = this.tot_que[len].opt1;
            this.opt2 = this.tot_que[len].opt2;
            this.opt3 = this.tot_que[len].opt3;
            this.opt4 = this.tot_que[len].opt4;
            this.opt1_img = this.tot_que[len].opt1_img;
            this.opt2_img = this.tot_que[len].opt2_img;
            this.opt3_img = this.tot_que[len].opt3_img;
            this.opt4_img = this.tot_que[len].opt4_img;
            this.check_select(this.tot_que[len].sr_no);
            break;
          }
        }
      }
    },
    check_select: function(sr_no) {
      var hiddenOpt = $("#hidden-option");
      if (hiddenOpt.length) hiddenOpt[0].checked = true;

      var j;
      this.checked0 = true;
      for (j = 0; j < this.user_ans.length; j++) {
        if (this.user_ans[j].sr_no == sr_no) {
          if (this.user_ans[j].st_ans == "opt1") {
            this.checked1 = true;
            this.checked2 = false;
            this.checked3 = false;
            this.checked4 = false;
          } else if (this.user_ans[j].st_ans == "opt2") {
            this.checked2 = true;
            this.checked1 = "";
            this.checked3 = false;
            this.checked4 = false;
          } else if (this.user_ans[j].st_ans == "opt3") {
            this.checked3 = true;
            this.checked1 = "";
            this.checked2 = false;
            this.checked4 = false;
          } else if (this.user_ans[j].st_ans == "opt4") {
            this.checked4 = true;
            this.checked1 = "";
            this.checked2 = false;
            this.checked3 = false;
          } else if (
            this.user_ans[j].st_ans != "opt1" &&
            this.user_ans[j].st_ans != "opt2" &&
            this.user_ans[j].st_ans != "opt3" &&
            this.user_ans[j].st_ans != "opt4" &&
            this.user_ans[j].st_ans != ""
          ) {
            this.sub_ans = this.user_ans[j].st_ans;
          } else {
            this.checked1 = false;
            this.checked2 = false;
            this.checked3 = false;
            this.checked4 = false;
            this.sub_ans = "";
          }
          break;
        } else {
          this.checked1 = false;
          this.checked2 = false;
          this.checked3 = false;
          this.checked4 = false;
        }
      }
    },
    done_question: function(sr_no, st_ans, btn_info) {
      var i;
      var que_id;
      var answer = "";
      var crnt_sr_no;
      this.tot_attempt = 0;

      var l = this.tot_que.length - 1;
      var lst_sr_no = this.tot_que[l].sr_no;
      var fst_sr_no = this.tot_que[0].sr_no;

      if (this.st_ans != "") {
        answer = st_ans;
      } else {
        answer = "";
      }

      for (i = 0; i < this.user_ans.length; i++) {
        if (this.user_ans[i].sr_no == sr_no) {
          que_id = this.user_ans[i].que_id;
          break;
        }
      }

      //storing current question data
      for (i = 0; i < this.user_ans.length; i++) {
        if (
          this.user_ans[i].sr_no == sr_no &&
          this.user_ans[i].st_ans != "" &&
          answer != ""
        ) {
          this.user_ans[i].user_id = this.user_id;
          this.user_ans[i].st_ans = answer;
          this.user_ans[i].visit = this.st_visit;
          break;
        } else if (
          this.user_ans[i].sr_no == sr_no &&
          this.user_ans[i].st_ans == "" &&
          this.user_ans[i].visit != "" &&
          answer != ""
        ) {
          this.user_ans[i].user_id = this.user_id;
          this.user_ans[i].st_ans = answer;
          this.user_ans[i].visit = this.st_visit;
          break;
        } else if (
          this.user_ans[i].sr_no == sr_no &&
          this.user_ans[i].visit == null
        ) {
          this.user_ans[i].user_id = this.user_id;
          this.user_ans[i].st_ans = answer;
          this.user_ans[i].visit = this.st_visit;
          break;
        }
      }

      //storing next or previous question data
      if (btn_info == "nxt_btn") {
        crnt_sr_no = this.counter + 1;
        if (crnt_sr_no > lst_sr_no) {
          crnt_sr_no = fst_sr_no;
        }

        for (i = 0; i < this.user_ans.length; i++) {
          if (
            this.user_ans[i].sr_no == crnt_sr_no &&
            this.user_ans[i].visit == null
          ) {
            this.user_ans[i].user_id = this.user_id;
            this.user_ans[i].st_ans = "";
            this.user_ans[i].visit = this.st_visit;
            break;
          }
        }
      } else if (btn_info == "pre_btn") {
        crnt_sr_no = this.counter - 1;
        if (crnt_sr_no < fst_sr_no) {
          crnt_sr_no = lst_sr_no;
        }

        for (i = 0; i < this.user_ans.length; i++) {
          if (
            this.user_ans[i].sr_no == crnt_sr_no &&
            this.user_ans[i].visit == null
          ) {
            this.user_ans[i].user_id = this.user_id;
            this.user_ans[i].st_ans = "";
            this.user_ans[i].visit = this.st_visit;
            break;
          }
        }
      }

      this.attempt_que();

      this.save_detail(que_id, answer, btn_info);
    },
    provide_ans: function(data) {
      if (data == "sub_btn" || data == "que_btn" || data == "pre_btn") {
        this.st_ans = "";
      } else if (data == "nxt_btn") {
        return this.st_ans;
      }
    },
    clear_response: function() {
      var i;
      var que_id;

      for (i = 0; i < this.user_ans.length; i++) {
        if (
          this.user_ans[i].sr_no == this.counter &&
          this.user_ans[i].st_ans != ""
        ) {
          this.user_ans[i].st_ans = "";
          que_id = this.user_ans[i].que_id;
          break;
        }
      }
      this.check_select(this.counter);
      this.attempt_que();
      this.save_detail(que_id, "", "clr_btn");
    },
    submit_exam: function() {
      if (
        this.tot_que.length != this.tot_attempt &&
        this.onlineState == true &&
        this.exm_timer != 0
      ) {
        var res = confirm("Do you really wants to submit the exam?");
        if (res == true) {
          this.$http
            .post("/api/user/Assessment_Done", {
              user_id: this.user_id,
              assessment_id: this.assessment_id,
              user_ans: this.user_ans
            })
            .then(function(res) {
              if (res.body.status == "403") {
                //this.$router.push('/login');
              } else {
                if (res.body.exam == "done") {
                  notify("You have successfully submitted the examination..!!");
                  if (this.exam_type == true) {
                    this.$router.push("/assessments/thankyou");
                  } else {
                    var det = btoa(this.assessment_id);
                    this.$router.push({
                      path: "/Assessments/CalculateMarks",
                      query: { assessment: det }
                    });
                  }
                }
              }
            });
        }
      } else if (this.onlineState == true) {
        this.$http
          .post("/api/user/Assessment_Done", {
            user_id: this.user_id,
            assessment_id: this.assessment_id,
            user_ans: this.user_ans
          })
          .then(function(res) {
            if (res.body.status == "403") {
              //this.$router.push('/login');
            } else {
              if (res.body.exam == "done") {
                notify("You have successfully submitted the examination..!!");
                if (this.exam_type == true) {
                  this.$router.push("/assessments/thankyou");
                } else {
                  var det = btoa(this.assessment_id);
                  this.$router.push({
                    path: "/Assessments/CalculateMarks",
                    query: { assessment: det }
                  });
                }
              }
            }
          });
      } else {
        this.on();
      }
    },

    textarea_value: function(event) {
      this.st_ans = this.sub_ans;
    },
    attempt_que: function() {
      var i;
      this.tot_attempt = 0;
      for (i = 0; i < this.user_ans.length; i++) {
        if (this.user_ans[i].st_ans != "" && this.user_ans[i].st_ans != null) {
          this.tot_attempt++;
        }
      }
    },
    mouseOver: function() {
      this.onlineState = navigator.onLine;
    },
    save_detail: function(que_id, answer, btn_info) {
      if (que_id != "" && answer != "" && btn_info == "nxt_btn") {
        this.$http
          .post("/api/user/Done_Assessment_Que", {
            user_id: this.user_id,
            assessment_id: this.assessment_id,
            que_id: que_id,
            st_ans: answer,
            visit: this.st_visit,
            sub_id: this.sub_id
          })
          .then(function(res) {
            if (res.body.status == "403") {
              //this.$router.push('/login');
            } else {
            }
          });
      } else if (que_id != "" && answer == "" && btn_info == "clr_btn") {
        this.$http
          .post("/api/user/Done_Assessment_Que", {
            user_id: this.user_id,
            assessment_id: this.assessment_id,
            que_id: que_id,
            st_ans: answer,
            visit: this.st_visit,
            sub_id: this.sub_id
          })
          .then(function(res) {
            if (res.body.status == "403") {
              //this.$router.push('/login');
            } else {
            }
          });
      }
    },
    on: function() {
      document.getElementById("overlay").style.display = "block";
    },
    off: function() {
      if (this.onlineState == true) {
        document.getElementById("overlay").style.display = "none";
        this.submit_exam();
      }
    },
    zoom_img: function(img_id) {
      // Get the modal
      var modal = document.getElementById("myModal");

      // Get the image and insert it inside the modal - use its "alt" text as a caption
      var img = document.getElementById(img_id);
      var modalImg = document.getElementById("preview_img");
      img.onclick = function() {
        modal.style.display = "block";
        modalImg.src = this.src;
      };

      // Get the <span> element that closes the modal
      var span = document.getElementsByClassName("close")[0];

      // When the user clicks on <span> (x), close the modal
      span.onclick = function() {
        modal.style.display = "none";
      };
    }
  }
};
</script>

<style>
#myImg {
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

#myImg:hover {
  opacity: 0.7;
}

/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 9999; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.9); /* Black w/ opacity */
}

/* Modal Content (image) */
.modal-content {
  margin: auto;
  display: block;
  width: 80%;
  max-width: 900px;
}

/* Caption of Modal Image */
#caption {
  margin: auto;
  display: block;
  width: 80%;
  max-width: 700px;
  text-align: center;
  color: #ccc;
  padding: 10px 0;
  height: 150px;
}

/* Add Animation */
.modal-content,
#caption {
  -webkit-animation-name: zoom;
  -webkit-animation-duration: 0.6s;
  animation-name: zoom;
  animation-duration: 0.6s;
}

@-webkit-keyframes zoom {
  from {
    -webkit-transform: scale(0);
  }
  to {
    -webkit-transform: scale(1);
  }
}

@keyframes zoom {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

/* The Close Button */
.close {
  position: absolute;
  top: 15px;
  right: 35px;
  color: #f1f1f1;
  font-size: 40px;
  font-weight: bold;
  transition: 0.3s;
}

.close:hover,
.close:focus {
  color: #bbb;
  text-decoration: none;
  cursor: pointer;
}

/* 100% Image Width on Smaller Screens */
@media only screen and (max-width: 700px) {
  .modal-content {
    width: 100%;
  }
}

img.preview {
  width: 250px;
  height: 150px;
  background-color: white;
  border: 2px solid #58d68d;
  padding: 2px;
  text-align: left;
}
#overlay {
  position: fixed; /* Sit on top of the page content */
  display: none; /* Hidden by default */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(
    248,
    235,
    232,
    0.5
  ); /* Black background with opacity */
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}
#spinner {
  margin-top: 20%;
}

html,
body {
  width: 100%;
  padding: 0px;
  margin: 0px auto;
}
h1,
h2,
h3,
h4,
h5,
p,
span,
div,
input,
button {
  font-family: Arial, Helvetica, sans-serif;
}
#container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.top-row {
  -webkit-box-shadow: 0px 1px 6px 0px rgba(117, 111, 117, 1);
  -moz-box-shadow: 0px 1px 6px 0px rgba(117, 111, 117, 1);
  box-shadow: 0px 1px 6px 0px rgba(117, 111, 117, 1);
}
.top-columns {
  background: #f1f1f1;
  line-height: 60px;
}
.testname {
  font-size: 15px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  color: #333333;
}
.student-name,
.timer {
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  color: #0066ff;
}
.timer {
  font-size: 17px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  color: #0066ff;
}

@media only screen and (max-width: 768px) {
  .top-columns {
    height: auto;
    line-height: normal;
    padding-top: 5px;
    padding-bottom: 5px;
  }
}

/* ############# Second Row ############## */
.secnd-row-colmns {
  padding: 10px 0px;
  background: #0066ff;
}
/*subject menus */
.dropbtn {
  background: url(../../static/img/bar-menu.png);
  color: #333333;
  padding: 0px;
  text-decoration: none;
  outline: none;
  border: none;
  width: auto;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #e2e2e2;
  min-width: 260px;
  overflow: auto;
  z-index: 2;
  line-height: 20px;
  text-align: left;
}
.sub_btn_top {
  padding: 5px 15px;
  margin: 1px;
  background: #e2e2e2;
  border: none;
  outline: none;
}
.indic_btn {
  padding: 5px 5px;
  margin: 1px;
  background: #ec7063;
  border: none;
  outline: none;
  float: right;
  border-radius: 3px;
  margin-right: 5px;
  color: #ffffff;
  width: 28px;
  height: 28px;
}

.dropdown-content a {
  color: black;
  padding: 5px 10px;
  text-decoration: none;
  display: block;
}
.dropdown-content a:hover {
  background: #f2f2f2;
}
.row2-span {
  color: #f4f4f4;
}
.row2-numbers {
  padding: 2px 5px;
  border: thin solid #cccccc;
  margin-left: 5px;
  color: #ffffff;
  font-weight: bold;
}
.num-plate-btn {
  background: url(../../static/img/bar-menu.png);
  color: #333333;
  padding: 0px;
  text-decoration: none;
  outline: none;
  border: none;
  width: auto;
}
.num-plate-btn:hover,
.num-plate-btn:focus {
  color: #333333;
  text-decoration: none;
}

.show {
  display: block;
}
#myContent {
  background: #f7f7f7;
  display: none;
  width: 30%;
  height: auto;
  position: absolute;
  right: 0;
  top: 108px;
}
#section-name,
#section-name > span {
  width: 100%;
  height: auto;
  background: #e2e2e2;
  color: #666666;
  font-weight: bold;
  padding: 5px 0px;
  float: left;
  text-align: center;
}
#btn-plate {
  width: 100%;
  height: auto;
  float: left;
  background: ;
  padding: 5px 5px;
}
.not-attempt {
  height: 42px;
  width: 42px;
  color: #333333;
  background: #d5dbdb;
  margin: 5px;
  border: none;
  outline: none;
  float: left;
}

.attempt {
  height: 42px;
  width: 42px;
  color: #fff;
  background: #08ca73;
  margin: 5px;
  border: none;
  outline: none;
  float: left;
}

.visit {
  height: 42px;
  width: 42px;
  color: #fff;
  background: #ec7063;
  margin: 5px;
  border: none;
  outline: none;
  float: left;
}

#attmpt-plate {
  background: #f3f3f3;
  float: left;
  text-align: center;
  margin-top: 15px;
  padding: 10px 10px;
  width: 100%;
}
#pattempted {
  padding: 5px 20px;
  border: 2px solid #666666;
  border-radius: 20px;
  width: 50%;
  text-align: center;
  margin: 0px auto;
}
.spanattempted {
  padding: 3px 7px;
  background: #0066ff;
  color: #ffffff;
  font-weight: bold;
  border-radius: 5px;
}
#punattempted {
  padding: 5px 20px;
  border: 2px solid #666666;
  border-radius: 20px;
  width: 50%;
  text-align: center;
  margin: 0px auto;
  margin-top: 8px;
}

/* Question div starts from here#########*/
.qstn-div {
  text-align: left;
  font-size: 16px;
  color: #333333;
  width: 100%;
  height: 100%;
  flex-grow: 1;
  overflow: auto;
  text-align: left;
}
.optn-div {
  text-align: left;
  font-size: 16px;
  color: #333333;
  height: auto;
}

/* ################# lower button dv ############*/
#lower-btn-div {
  padding-left: 100px;
  padding-top: 5px;
  padding-bottom: 5px;
  background: #fff;
  width: 100%;
}
@media only screen and (max-width: 1050px) {
  #lower-btn-div {
    left: 0px;
  }
}
.lower-btn {
  padding: 5px 20px;
  font-size: 18px;
  font-weight: ;
  color: #0066ff;
  background: none;
  border: thin solid #0066ff;
  outline: none;
  border-radius: 20px;
  margin: 3px;
}
</style>
