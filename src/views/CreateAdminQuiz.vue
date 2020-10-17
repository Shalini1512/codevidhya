<template>
  <div id="cQuizPage" class="h-100 w-100" style="position:fixed;">
    <!-- Navbar -->
    <AdminNavbar />
    <div class="row h-100 p-0" id="main">
      <div
        class="col-xl-12 text-right"
        id="quiz-top"
        style="padding:60px 16px 0px 16px"
        v-show="quizID ? (quiz_detail[0].user_id == 0 ? true : false) : false"
      >
        <template>
          <button
            class="btn btn-danger mx-1"
            id="draft"
            @click="publish_for_school"
          >
            <i class="fas fa-save mx-1"></i>Save As Draft
          </button>
          <!--:disabled="quiz_detail.length ?quiz_detail[0].public_institute==0 ? true : false:false "-->
          <button
            class="btn btn-success mx-1"
            id="publish"
            @click="publish_for_school"
            v-if="quizID ? quiz_detail[0].public_institute == 1 : false"
            disabled
          >
            <i class="fa fa-globe mx-1"></i>Published
          </button>
          <button
            class="btn btn-success mx-1"
            id="publish"
            @click="publish_for_school"
            v-else
          >
            <i class="fa fa-globe mx-1"></i>Publish
          </button>
        </template>
      </div>
      <div
        class="col-xl-3 col-md-3"
        id="quiz-editor-sidebar"
        :style="
          quizID
            ? quiz_detail[0].user_id == 0
              ? 'padding: 24px 24px 24px 24px;'
              : 'padding: 59px 24px 24px 24px;'
            : 'padding: 24px 24px 24px 24px;'
        "
      >
        <div
          class="mb-3"
          :style="
            'overflow-y:auto;position:relative;' +
              [
                quiz_detail.length
                  ? quiz_detail[0].user_id == 0
                    ? 'height:90%;'
                    : 'height:100%'
                  : 'height:100%'
              ]
          "
        >
          <template v-if="quizInitialized">
            <h3>Quiz name</h3>
            <p id="quiz_update_name" v-html="quiz_name"></p>
            <h3>Subject</h3>
            <p v-html="subjectName"></p>
            <h3>Price</h3>
            <div class="row">
              <input
                class="cv-input"
                id="quiz_price"
                type="number"
                v-model="quiz_price"
                readonly="readonly"
              />
              <button
                id="updtprice"
                class="btn btn-purple"
                style="margin-bottom: 8px;"
                @click="updt_price()"
              >
                Edit
              </button>
            </div>
            <h3>Quiz icon</h3>
            <div class="" v-if="quiz_img">
              <img
                class="img-fluid "
                :src="'/dynamic/Quizzes/quiz_img/' + quiz_img"
                style="width:70%;"
              />
              <div>
                <button
                  class="btn btn-danger ml-2 mt-1"
                  @click="icon_update('delete')"
                >
                  Remove
                </button>
              </div>
            </div>
            <div v-else class="mx-0">
              <div class="file-field mx-0">
                <div class="btn btn-sm float-left mx-0">
                  <input
                    class="mx-0 px-0"
                    type="file"
                    accept="image/*"
                    id="quiz_image_update"
                    onchange="imageSize(this)"
                  />
                </div>
              </div>
              <div>
                <button
                  class="btn btn-success ml-2 mt-1"
                  @click="icon_update('add')"
                >
                  Add icon
                </button>
              </div>
            </div>
            <div>
              <h3 class="mt-1">Quiz description</h3>
              <div
                id="quiz_desc_update"
                v-html="quiz_desc"
                placeholder="Quiz description"
                style="border:#ccc thin solid;padding:4px 16px;height:80px;overflow-y:auto;"
              ></div>
            </div>
            <button
              class="btn btn-purple mt-4"
              id="updatebutton"
              @click="update_quiz_info($event)"
            >
              Edit
            </button>
          </template>
          <i class="flex-filler"></i>
          <div id="new-question-button-wrapper" class="mb-2">
            <button
              id="quiz-editor-add-question"
              class="btn btn-purple mb-2"
              @click="showAddQuizDropupMenu"
            >
              Add question
            </button>
            <div
              onclick="(function(e) {e.preventDefault();e.stopPropagation();})(event);"
            >
              <a @click="showNewQuestionModal">Create question</a>
              <a @click="showExistingQuestionsModal">Add existing questions</a>
            </div>
          </div>
        </div>
      </div>
      <div
        class="col-xl-9 col-md-9"
        id="quiz-editor-mainbar"
        :style="
          quizID
            ? quiz_detail[0].user_id == 0
              ? 'padding: 24px 24px 24px 24px;'
              : 'padding: 59px 24px 24px 24px;'
            : 'padding: 59px 24px 24px 24px;'
        "
      >
        <div>
          <div v-if="quiz_questions.length == 0" class="cv-empty-state-message">
            <p>There are no questions in the quiz.</p>
            <p>Start by adding a question.</p>
          </div>

          <div
            v-else
            v-for="(quiz_question, index) in quiz_questions"
            v-bind:key="index"
            class="quiz-questions-list-item-container"
          >
            <div v-html="quiz_question.question"></div>
            <div>
              <span>Points: {{ quiz_question.points }}</span>
              <i></i>
              <button
                @click="removeQuestion(quiz_question.que_id)"
                class="btn btn-gray"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODALS ============================== -->

    <div
      id="quiz-setup-modal"
      :class="[
        quizID
          ? 'cv-modal normal undismissable'
          : 'cv-modal normal undismissable visible'
      ]"
    >
      <div style="padding: 24px 24px 8px;">
        <div class="cv-input-group">
          <label>Type</label>
          <select id="quiz_for" @change="quiztypeChange($event)">
            <option value="0">Public</option>
            <option value="1">Course</option>
          </select>

          <label>Subject</label>
          <template v-if="publicQuiz">
            <select
              v-if="subjects.length"
              id="quiz_subject"
              class="form-control"
            >
              <option value="0">--select subject--</option>
              <option
                v-for="subject in subjects"
                :key="subject.sub_id"
                :value="subject.sub_id"
                >{{ subject.subject }}</option
              >
            </select>
          </template>
          <template v-else>
            <select
              v-if="course_subjects.length"
              id="quiz_course_subject"
              class="form-control"
              @change="topics($event)"
            >
              <option value="0">--select subject--</option>
              <option
                v-for="subject in course_subjects"
                :key="subject.book_id"
                :value="subject.book_id"
                >{{ subject.book_name }}</option
              >
            </select>
            <template v-if="subTopics.length">
              <label>Topics</label>
              <select id="quiz_sub_topics" class="form-control">
                <option
                  v-for="topic in subTopics"
                  :key="topic.topic_id"
                  :value="topic.topic_id"
                  >{{ topic.topic_name }}</option
                >
              </select>
            </template>
          </template>
        </div>
        <div class="cv-input-group">
          <label>Quiz name</label>
          <input
            type="text"
            v-model="quiz_name"
            required
            placeholder="Quiz name"
          />
        </div>
        <div v-if="publicQuiz" class="cv-input-group">
          <label>Quiz Image</label>
          <input
            type="file"
            accept="image/*"
            id="quiz_image"
            onchange="imageSize(this)"
          />
        </div>
        <div v-if="publicQuiz" class="cv-input-group">
          <label>Price</label>
          <input type="number" v-model="quiz_price" required />
        </div>
        <div v-if="publicQuiz" class="cv-input-group">
          <label>Quiz Description</label>
          <div
            contenteditable="true"
            id="quiz_desc"
            placeholder="Quiz description"
            style="border:#ccc thin solid;padding:4px 16px;min-height:80px;"
          ></div>
        </div>
        <div class="cv-modal-bottom-buttons text-right">
          <button class="btn btn-purple" @click="next_step()">Save</button>
        </div>
      </div>
    </div>

    <div id="new-quiz-question-modal" class="cv-modal full">
      <div>
        <div
          class="header"
          style="display: flex;flex-direction: row;align-items: center;"
        >
          <h3 class="col-sm-4">Add new question</h3>
          <i class="flex-filler"></i>
          <select
            style="margin: 0 24px 0 8px;"
            class="cv-input col-sm-4 mb-1"
            id="quiz_types"
            @change="change_type()"
          >
            <option
              v-for="(quiz_type, q_ind) in quiz_types"
              :key="q_ind"
              :value="quiz_type.qt_id"
              >{{ quiz_type.type }}</option
            >
          </select>
          <input
            style="width: 80px"
            class="cv-input col-sm-2 my-1 ml-2"
            id="points"
            type="number"
            placeholder="Points"
            onkeydown="javascript: return event.keyCode == 69 ? false : true"
          />
        </div>
        <!--All types Quiz Question-->
        <div class="body">
          <div
            style="width:50%; min-width: 0; display: flex; flex-direction: column;"
          >
            <!--fill in the blank-->
            <div id="quiz_type_modal1" class="quiz-type-modal-content">
              <div id="quiz-editor-modal-editor">
                <h3>Heading</h3>
                <input
                  type="text"
                  class="cv-input"
                  id="fitb-heading"
                  placeholder="Question heading.."
                />
                <!--<div class="cv-input" id="fitb-heading" contenteditable="true"></div>-->
                <h3>Body</h3>
                <div id="fitb-editor-wrapper">
                  <div id="quiz-editor-editable-box"></div>
                  <div
                    style="display: flex; flex-direction: row; padding: 8px; border-top: 1px solid rgba(0,0,0,0.1)"
                  >
                    <i class="flex-filler"></i>
                    <button class="btn btn-purple" @click="addBlank">
                      Add blank
                    </button>
                  </div>
                </div>
                <h3>Options</h3>
                <div id="fitb-options-editor-wrapper">
                  <div></div>
                  <input
                    id="fitb-options-editable-box"
                    placeholder="Write quiz option here"
                  />
                </div>
                <h3>Explanation</h3>
                <!--<input id="fitb-explanation" class="cv-input" placeholder="Write the explanation for the answer here" />-->
                <div
                  id="fitb-explanation"
                  placeholder="Write the explanation for the answer here"
                  contenteditable="true"
                  style="border:#ccc thin solid;padding:4px 16px;"
                ></div>
              </div>
              <div></div>
            </div>
            <!--end fil in the blank-->
            <!--mcq question-->
            <div
              id="quiz_type_modal2"
              class="quiz-type-modal-content"
              style="display:none;"
            >
              <div id="quiz-editor-modal-editor">
                <h3>Question</h3>
                <!--<input class="cv-input" id="mcq_question" placeholder="Question">-->
                <div
                  class="mb-2"
                  id="mcq_question"
                  contenteditable="true"
                  placeholder="Question"
                  style="border:#ccc thin solid;padding:4px 16px;"
                ></div>
                <input
                  class="cv-input"
                  id="mcq_question_image"
                  type="file"
                  accept="image/*"
                  onchange="imageSize(this)"
                />
                <h3 class="mt-3">Options</h3>

                <!--<div class="row">
                   <div contenteditable="true" placeholder="Write quiz option here">afsafasdfsadf</div>
                 </div>-->

                <!--<input id="mcq-options-editable-box" placeholder="Write quiz option here" />-->
                <div class="row">
                  <div
                    class="col-sm-8 ml-3"
                    id="mcq-options-editable-box"
                    contenteditable="true"
                    placeholder="Write quiz option here"
                    style="border:#ccc thin solid;padding:4px 16px;width:80%;"
                  ></div>
                  <span class="col-sm-2" style="width:20%;"
                    ><input
                      id="mcq-options-editable-button"
                      type="button"
                      value="ADD"
                      @click="mcqOptionEditableButton($event)"
                  /></span>
                </div>
                <div id="mcq-editor-options"></div>
                <h3 class="mt-2">Explanation</h3>
                <div
                  id="mcq_description"
                  style="min-height:80px;background:#fff;border:#ccc thin solid"
                  contenteditable="true"
                ></div>
              </div>
            </div>
          </div>
          <div
            style="width:50%; padding: 24px;"
            v-html="questionPreviewContent"
          ></div>
        </div>
        <div class="footer">
          <button
            class="btn btn-purple"
            style="margin-right: 16px;"
            @click="preview()"
          >
            Preview
          </button>
          <i class="flex-filler"></i>
          <button
            class="btn btn-danger"
            style="margin-right: 16px;"
            @click="closeNewQuestionModal()"
          >
            Close
          </button>
          <button class="btn btn-success" @click="add_question()">Add</button>
        </div>
      </div>
    </div>

    <div id="existing-quiz-questions-modal" class="cv-modal full">
      <div>
        <div
          class="header"
          style="display: flex;flex-direction: row;align-items: center;"
        >
          <h3>Add from existing questions</h3>
          <i class="flex-filler"></i>
        </div>
        <!--All types Quiz Question-->
        <div class="body">
          <div
            id="existing-questions-list-wrapper"
            style="width:50%; min-width: 0; display: flex; flex-direction: column;"
          >
            <div class="cv-tablayout">
              <div class="tabs stretch">
                <div class="active">Fill In The Blanks</div>
                <div>MCQ</div>
              </div>
              <!--mcq question-->

              <div
                id="existing-fitb-questions-list"
                class="existing-questions-list content active"
              >
                <template v-for="(question, index) in questions">
                  <div
                    v-if="question.qt_id == 1"
                    :key="question.que_id"
                    @click="onExistingFitbQuestionClick($event)"
                    :data-index="index"
                  >
                    <span v-html="question_title[index]"></span>
                    <span class="ml-5"
                      >used {{ question.used_times }} times</span
                    >
                    <i class="flex-filler"></i>
                    <label onclick="(function(e) {e.stopPropagation()})(event)"
                      >Points: <input type="text" class="cv-input input-points"
                    /></label>
                  </div>
                </template>
              </div>
              <div
                id="existing-mcq-questions-list"
                class="existing-questions-list content"
              >
                <template v-for="(question, index) in questions">
                  <div
                    v-if="question.qt_id == 2"
                    :key="question.que_id"
                    @click="onExistingFitbQuestionClick($event)"
                    :data-index="index"
                  >
                    <span v-html="question_title[index]"></span>
                    <span class="ml-3"
                      >used {{ question.used_times }} times</span
                    >
                    <i class="flex-filler"></i>
                    <label onclick="(function(e) {e.stopPropagation()})(event)"
                      >Points: <input type="text" class="cv-input"
                    /></label>
                  </div>
                </template>
              </div>

              <!--end mcq question-->
            </div>
          </div>
          <div
            style="width:50%; padding: 24px;"
            v-html="questionPreviewContent"
          ></div>
        </div>
        <div class="footer">
          <i class="flex-filler"></i>
          <button
            class="btn btn-danger"
            style="margin-right: 16px;"
            @click="closeExistingQuestionsModal()"
          >
            Close
          </button>
          <button class="btn btn-success" @click="add_quiz_questions()">
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AdminNavbar from "@/components/header/HeaderMenuForAdmin.vue";
import moment from "vue-moment";
import axios from "axios";
export default {
  components: { AdminNavbar },

  data() {
    return {
      quizInitialized: false,
      lms_books: [],
      quiz_types: [],
      inc_btn: 1,
      subjects: [],
      course_subjects: [],
      questionPreviewContent: "",
      quiz_name: "",
      sub_id: "",
      quiz_id: "",
      subjectName: "",
      questions: [],
      question_title: [],
      quiz_questions: [],
      quiz_question_title: [],
      fillInTheBlanksEditable: undefined,
      top_users: [],
      quiz_price: 0,
      userId: 0,
      quizID: 0,
      quiz_img: "",
      quiz_desc: "",
      quiz_detail: [],
      publicQuiz: 1,
      subTopics: []
    };
  },

  computed: {
    /*user_id: function() {
      let userId = this.$store.getters.getAuthData.auth_user_id;
      if (userId) {
      }
      return this.$store.getters.getAuthData.auth_user_id;
    }*/
  },

  beforeCreate() {},
  created() {},
  beforeMount() {
    this.quiz_type(this.userId);
    this.get_subject();
    this.getCourseSubject();
    this.get_quiz_question(this.userId);
  },
  methods: {
    quiztypeChange: function(e) {
      if (e.target.value == 1) {
        this.publicQuiz = 0;
       
      } else {
        this.publicQuiz = 1;
      }
    },

    publish_for_school: function(event) {
      const result = event.target.id;
      let publish_institute;
      if (result == "publish") publish_institute = 1;
      else publish_institute = 0;
      let vm = this;

      axios
        .post("/api/user/update_admininst_permission", {
          quiz_id: this.quiz_id,
          publish_institute: publish_institute
        })
        .then(res => {
          window.cvNotify("Updated Successfully", "success");

          vm.get_quiz_detail(vm.quizID);
        });
    },
    update_quiz_info: function(e) {
      let action = $("#updatebutton").text();
      if (action == "Edit") {
        $("#updatebutton").text("Update");

        $("#quiz_update_name").attr("contenteditable", "true");
        $("#quiz_update_name").attr(
          "style",
          "border:#ccc thin solid;padding:4px 8px;overflow:scroll"
        );
        $("#quiz_desc_update").attr("contenteditable", "true");
      } else {
        $("#updatebutton").text("Edit");
        $("#quiz_update_name").removeAttr("style");
        $("#quiz_update_name").attr("contenteditable", "false");
        $("#quiz_desc_update").attr("contenteditable", "false");
        $("#quiz_update_name").focus();

        let quiz_name = $("#quiz_update_name").text();
        let quiz_desc = $("#quiz_desc_update").text();
        axios
          .post("/api/user/update_quiz_basic_admin", {
            quiz_id: this.quiz_id,
            user_id: this.userId,
            quiz_name: quiz_name,
            quiz_desc: quiz_desc
          })
          .then(res => {
            if (res.status == 200) {
              if (res.data == 0) {
                cvNotify("Quiz Name already exists", "error");
                $("#quiz_update_name").text(this.quiz_name);
                $("#quiz_desc_update").text(this.quiz_desc);
              } else {
                cvNotify("Update successfull", "success");
                this.quiz_name = quiz_name;
                this.quiz_desc = quiz_desc;
              }
            }
          });
      }
    },
    /****mcq editable add option button */
    mcqOptionEditableButton: function(e) {
      e.preventDefault();
      var mcqOptt = $("#mcq-options-editable-box");

      mcqOptt.find("div").replaceWith(function() {
        return "\n" + this.innerHTML;
      });

      //  this.addMcqOption(mcqOptt[0].innerText);
      this.addMcqOption(mcqOptt.text());
      $("#mcq-options-editable-box").html("");
    },
    /****end mcq editable option button */
    updt_price: function() {
      let ans = $("#updtprice").text();
      if (ans == "Edit") {
        $("#updtprice").text("Update");
        $("#quiz_price").removeAttr("readonly");
      } else {
        //this.quiz_price = $("#quiz_price").val();

        axios
          .post("/api/user/UpdateQuizPrice", {
            quiz_price: this.quiz_price,
            quiz_id: this.quiz_id
          })
          .then(() => {
            $("#updtprice").text("Edit");
            $("#quiz_price").attr("readonly", "readonly");
            window.cvNotify("Successfully updated", "success");
          });
      }
    },

    get_subject: function() {
      axios.post("/api/user/get_subject").then(res => {
        this.subjects = res.data.data;
        //  console.log(this.subjects);
      });
    },
    getCourseSubject: function() {
      axios.post("/api/user/get_course_subjects").then(res => {
        this.course_subjects = res.data;
         this.getAllTopics(this.course_subjects[0].book_id);
      });
    },
    topics: function(e) {
      let book_id = e.target.value;
      this.getAllTopics(book_id);
      
    },
    getAllTopics(book_id) {
      axios
        .post("/api/user/getSubTopicsForQuiz", { book_id: book_id })
        .then(res => {
          this.subTopics = res.data;
          this.getAllSubTopics(this.subTopics.topic_id);
        });
    },
   getAllSubTopics(topic_id)
   {
     
     //axios.post("/api/user/getAllSub")
   },

    preview: function() {
      let quiz_type_question = $("#quiz_types").val();
      if (quiz_type_question == 1) {
        this.questionPreviewContent = this.fillinTheBlank();
        if (
          this.questionPreviewContent == "false" ||
          this.questionPreviewContent == false
        ) {
          this.questionPreviewContent = "";
          return false;
        }

        this.questionPreviewContent = getQuizRepresentation(
          this.questionPreviewContent
        );
        // console.log(this.questionPreviewContent);
      } else {
        this.mcq();
      }
    },
    quiz_type: function(userId) {
      let vm = this;
      axios
        .post("/api/user/DisplayQuizTypeForQuiz", {
          user_id: userId
        })
        .then(res => {
          this.quiz_types = res.data.data;
        });
    },
    onFillInTheBlanksEditorClicked: function(e) {
      var editor = $(e.currentTarget);
      editor.attr("contenteditable", "true");
      if (
        editor.children().length == 1 &&
        editor.children()[0].tagName.toLowerCase() == "br"
      ) {
        // Remove weird unwanted br
        editor
          .children()
          .first()
          .remove();
      }

      if (e.currentTarget == e.target) {
        if (e.target.lastElementChild) {
          var last = $(e.target.lastElementChild);
          if (last.hasClass("fitb-text")) {
            last.focus();
          } else {
            this.addText();
            setTimeout(function() {
              editor.click();
            }, 200);
          }
        } else {
          this.addText();
          setTimeout(function() {
            editor.focus();
          }, 100);
        }
      }
    },
    addBlank: function() {
      var editor = $("#quiz-editor-editable-box");
      var last = editor.children().last();

      if (last.hasClass("fitb-text") && !last.text()) {
        last.remove();
      }
      editor.append(
        '<span class="fitb-editor-blank" contenteditable="true"></span>'
      );
      this.addText();
    },
    addText: function() {
      var text = document.createElement("span");
      text.className = "fitb-text";
      text.setAttribute("contenteditable", true);
      text.setAttribute("tabindex", -1);
      $("#quiz-editor-editable-box").append(text);
    },
    addFitbOption: function(val) {
      var options = $("#fitb-options-editor-wrapper > div");
      options.append(
        '<div class="fitb-editor-option"><span class="fitb-option-text">' +
          val
            .replace(/\s/g, "&nbsp;")
            .replace(/&/g, "&amp;")
            .replace(/>/g, "&gt;")
            .replace(/</g, "&lt;")
            .replace(/"/g, "&quot;") +
          '</span><button onclick="(function(e) {e.currentTarget.parentElement.parentElement.removeChild(e.currentTarget.parentElement)})(event);">x</button></div>'
      );
    },
    addMcqOption: function(val) {
      //console.log('add options called');
      //  console.log(val);
      val = val
        .replace(/&/g, "&amp;")
        .replace(/>/g, "&gt;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;");
      val = val.replace(
        /\n/g,
        "<span class='options_new_line'><br class='options_new_line' /></span>"
      );
      var options = $("#mcq-editor-options");
      options.append(
        "<div>" +
          "<p>" +
          val +
          "</p>" +
          '<input  type="file" class="options_images mx-2" accept="image/*" onchange="imageSize(this)"/>' +
          "<label>" +
          '<input type="radio" name="options"/>' +
          "<span>Correct answer</span>" +
          "</label>" +
          '<button class="cv-button cv-btn-flat" onclick="(function(e) {e.currentTarget.parentElement.parentElement.removeChild(e.currentTarget.parentElement)})(event);">x</button>' +
          "</div>"
      );
    },
    get_quiz_question: function(userId) {
      //console.log(this.sub_id+' '+this.quiz_id);
      axios
        .post("/api/user/DisplayCurrentQuizQuestions", {
          sub_id: this.sub_id,
          quiz_id: this.quiz_id
        })
        .then(res => {
          this.quiz_questions = res.data.data;
          // console.log(this.quiz_questions);
          for (var i = 0; i < this.quiz_questions.length; i++) {
            this.quiz_questions[
              i
            ].question = getQuizContentWithAllTemplateRendered(
              this.quiz_questions[i].question
            );
            if (this.quiz_questions[i].qt_id == 1) {
              this.quiz_question_title[i] = $(this.quiz_questions[i].question)
                .find("h3 > pre")
                .html();
            } else
              this.quiz_question_title[i] = $(this.quiz_questions[i].question)
                .find("#qtest")
                .html();
          }
        });
    },
    removeQuestion: function(que_id) {
      axios
        .post("/api/user/DeleteQuizQuestion", {
          sub_id: this.sub_id,
          quiz_id: this.quiz_id,
          que_id: que_id
        })
        .then(res => {
          let resp = res.data.data;
          if (resp == "0") {
            //notify("Try again.", "danger");
          } else {
            window.cvNotify("Successfull deleted", "success");
            this.get_quiz_question(this.user_id);
          }
        });
    },
    get_All_question: function() {
      axios
        .post("/api/user/DisplayAllTeacherQuizQuestions", {
          sub_id: this.sub_id,
          quiz_id: this.quiz_id,
          user_id: this.userId
        })
        .then(res => {
          this.questions = res.data.data;

          for (var i = 0; i < this.questions.length; i++) {
            this.questions[i].question = getQuizContentWithAllTemplateRendered(
              this.questions[i].question
            );
            if (this.questions[i].qt_id == 1) {
              this.question_title[i] = $(this.questions[i].question)
                .find("h3")
                .text();
            } else {
              this.question_title[i] = $(this.questions[i].question)
                .find("#qtest")
                .text();
              if ($.trim(this.question_title[i])) {
                // console.log($(this.questions[i].question));
              }
            }

            //console.log()
          }
        });
    },
    change_type: function() {
      let quiz_type_question = $("#quiz_types").val();
      $(".quiz-type-modal-content").hide();
      $("#quiz_type_modal" + quiz_type_question).show();
    },
    next_step: function() {
      let vm = this;
      if (this.publicQuiz == 1) {
        this.sub_id = $("#quiz_subject").val();
        if (this.sub_id == "0") {
          //apply select subject required code here..
          window.cvNotify("Please select any subject", "warning");
          return false;
        }

        if (this.quiz_name == "") {
          //apply input required code here..
          window.cvNotify("Please enter quiz name.", "warning");
          return false;
        }
        let img_test = $("#quiz_image").val();
        if (img_test) {
          let file = $("#quiz_image")[0].files[0];

          if (file) {
            var formData = new FormData();
            formData.append("file", file);
            axios.post("/api/user/quiz_icon_img", formData).then(() => {
              //console.log(res);
            });
          }
          this.quiz_img = file.name;
        }
        let insertUsertypePost = "";
        this.quiz_desc = $("#quiz_desc").text();
        axios
          .post("/api/user/InsertQuizDetail", {
            quiz_name: this.quiz_name,
            sub_id: this.sub_id,
            quiz_price: this.quiz_price,
            user_id: this.userId,
            sch_id: this.$store.getters.getAuthData.auth_sch_id,
            quiz_img_files: this.quiz_img,
            quiz_desc: this.quiz_desc
          })
          .then(res => {
            let resp = res.data.data;
            //console.log(resp);
            if (resp == "0") {
              window.cvNotify("Quiz name already exists.", "danger");
              return false;
            } else {
              vm.quiz_detail = res.data.data;
              vm.quiz_id = res.data.data[0].quiz_id;
              vm.quizID = res.data.data[0].quiz_id;
              vm.subjectName = vm.subjects.filter(
                x => x.sub_id == vm.sub_id
              )[0].subject;

              hideModal("quiz-setup-modal");
              vm.quizInitialized = true;
            }
          });
      } else {
        let sub_id = $("#quiz_course_subject").val();
        if (sub_id == 0) {
          window.cvNotify("Please select any subject", "warning");
          return false;
        }
        if (this.quiz_name == "") {
          window.cvNotify("Please enter quiz name.", "warning");
          return false;
        }
        let topicId = $("#quiz_sub_topics").val();
        axios
          .post("api/user/InsertCourseQuizDetail", {
            quiz_name: this.quiz_name,
            sub_id: sub_id,
            user_id: this.userId,
            sch_id: this.$store.getters.getAuthData.auth_sch_id,
            topic_id: topicId
          })
          .then(res => {
            let resp = res.data.data;
            if (resp == "0") {
              window.cvNotify("Quiz name already exists", "danger");
              return false;
            } else {
              vm.quiz_detail = res.data.data;
            vm.quiz_id = res.data.data[0].quiz_id;
              vm.quizID = res.data.data[0].quiz_id;
              vm.subjectName = vm.course_subjects.filter(
                x => x.sub_id == vm.sub_id
              )[0].subject;
             // let topicName =vm.subTopics.filter(x=>x.topic_id =vm.topic_id)
               hideModal("quiz-setup-modal");
              vm.quizInitialized = true;
            }
          });
      }
    },
    pre_step: function(e) {
      let id = e.path[3].id;
      id = parseInt(id) - 1;
      $(".first-step").hide();
      $("#" + id).show();
    },

    /***icon update */
    icon_update: function(e) {
      if (e == "delete") {
        axios
          .post("/api/user/delete_admin_quiz_icon", { quiz_id: this.quiz_id })
          .then(res => {
            this.quiz_img = "";
          });
      } else if (e == "add") {
        let file = $("#quiz_image_update")[0].files[0];

        if (file) {
          var formData = new FormData();
          formData.append("file", file);
          let vm = this;
          axios.post("/api/user/quiz_icon_img", formData).then(() => {
            //console.log(res);
          });
          vm.quiz_img = file.name;
          axios
            .post("/api/user/update_admin_quiz_icon", {
              quiz_img: vm.quiz_img,
              quiz_id: vm.quiz_id
            })
            .then(() => {});
        }
      }
    },
    /***end icon update */
    /**add quiz question */
    add_question: function() {
      let qt_id = $("#quiz_types").val();

      let point = $("#points").val();
      if (point == "" || point == null) {
        // notify("Please insert point", "danger");
        window.cvNotify("Please insert point", "danger");
        return false;
      }
      let sub_id = this.sub_id;
      let content1 = "";
      if (qt_id == 2) {
        content1 = this.getMcqTemplate();
      } else {
        content1 = this.fillinTheBlank();
      }
      if (!content1) {
        notify("Please choose correct answer", "danger");
        return false;
      }
      var question_img_val = $("#mcq_question_image").val();
      if (question_img_val) {
        var question_img = $("#mcq_question_image")[0].files[0];
        var formData11 = new FormData();
        formData11.append("file", question_img);
        axios.post("/api/user/quiz_questions_img", formData11).then(res => {
          // console.log(res);
        });
      }
      var mcqImgeOptions = $("#mcq-editor-options >div>input[type='file']");
      let vm = this;

      for (var i = 0; i < mcqImgeOptions.length; i++) {
        (function(foo) {
          var formData12 = new FormData();
          let option = $(mcqImgeOptions[i])[0].files[0];
          if (option) {
            formData12.append("file", option);
            axios.post("/api/user/quiz_questions_img", formData12).then(res => {
              // console.log(res)
            });
          }
        })(i);
      }
      axios
        .post("/api/user/InsertTeacherQuizQuestions", {
          quiz_id: this.quiz_id,
          sub_id: sub_id,
          question: content1,
          qt_id: qt_id,
          point: point,
          user_id: this.userId
        })
        .then(res => {
          let resp = res.data.data;
          if (resp == "0") {
            // notify("Question already exists.", "danger");
            window.cvNotify("Question already exists", "danger");
          } else {
            // notify("Successfully added.", "success");
            window.cvNotify("Successfully added.", "success");
            $("#fitb-heading").val("");
            $("#quiz-editor-editable-box").html("");
            $("#fitb-options-editor-wrapper > div").html("");
            $("#fitb-explanation").html("");

            $("#mcq_question").html("");
            $("#mcq-options-editable-box").val("");
            $("#mcq-editor-options").html("");
            $("#mcq_description").html("");

            this.questionPreviewContent = "";
            this.get_quiz_question(this.userId);
          }
        });
    },
    showAddQuizDropupMenu: function(event) {
      var button = event.currentTarget;
      var menu = $("#new-question-button-wrapper > div");
      menu.prepareTransition({ property: "opacity" }).addClass("visible");
      var outsideClickListener = function(e) {
        e.preventDefault();
        if (e.target != button && e.target != menu) {
          menu.removeClass("visible");
          document.removeEventListener("click", outsideClickListener);
        }
      };
      document.addEventListener("click", outsideClickListener);
    },
    fillinTheBlank: function() {
      let heading = $("#fitb-heading");
      if (!heading.val()) {
        // notify("Please insert Question Heading","danger");
        window.cvNotify("Please insert Question Heading", "danger");
        return false;
      }
      var template = "%fwo%";
      var elements = $("#quiz-editor-editable-box").children();
      var ans = "";
      let statementTemplate = "";
      var points = document.getElementById("points").value;

      //var description = document.getElementById("fitb-explanation").innerText;
      var ce = $("#fitb-explanation");
      ce.find("div").replaceWith(function() {
        return "\n" + this.innerHTML;
      });
      var description = ce.text();
      if (points == "" || points == null) {
        //notify("Please insert point", "danger");
        // return false;
      }

      for (var i = 0; i < elements.length; i++) {
        if (elements[i].tagName.toLowerCase() == "br") {
          statementTemplate += "%br%";
        } else {
          let spanContent = elements[i].textContent.trim();
          ans += spanContent;
          if ($(elements[i]).hasClass("fitb-editor-blank")) {
            if (spanContent.length < 4) {
              statementTemplate += "%blanksmall%";
            } else if (spanContent.length < 10) {
              statementTemplate += "%blank%";
            } else {
              statementTemplate += "%blanklarge%";
            }
          } else {
            statementTemplate +=
              "%words%" + elements[i].textContent.trim() + "%endwords%";
          }
        }
      }

      ans = escapeRegExp(ans);
      template += "%answer%" + ans + "%endanswer%";
      template += "%questionpoint%" + points + "%endquestionpoint%";
      template += "%question%" + heading.val() + "%endquestion%";
      template += "%statement%" + statementTemplate + "%endstatement%";

      let options = $(".fitb-option-text");
      let optionsTemplate = "";
      for (var i = 0; i < options.length; i++) {
        optionsTemplate += "%option%" + options[i].textContent + "%endoption%";
      }
      template += "%options%" + optionsTemplate + "%endoptions%";
      template += "%description%" + description + "%enddescription%";
      template +=
        "%correctfeedback%" +
        $("#fwo-correct-feedback").val() +
        "%endcorrectfeedback%";
      template +=
        "%wrongfeedback%" +
        $("#fwo-wrong-feedback").val() +
        "%endwrongfeedback%";
      template += "%endfwo%";
      template =
        "<pre>" +
        template
          .replace(/>/g, "&gt;")
          .replace(/</g, "&lt;")
          .replace(/"/g, "&quot;") +
        "</pre>";
      //console.log(template);
      // $('#fwo-editor-statements').html('');
      // $('#fwo-editor-options-wrapper').html('');

      return template;
    },
    showNewQuestionModal: function() {
      $("#fitb-heading").val("");
      $("#quiz-editor-editable-box").html("");
      $("#fitb-options-editor-wrapper > div").html("");
      $("#fitb-explanation").html("");

      $("#mcq_question").html("");
      $("#mcq-options-editable-box").val("");
      $("#mcq-editor-options").html("");
      $("#mcq_description").html("");

      this.questionPreviewContent = "";
      $("#new-question-button-wrapper > div").removeClass("visible");
      showModal($("#new-quiz-question-modal"));
    },
    showExistingQuestionsModal: function(e) {
      $("#new-question-button-wrapper > div").removeClass("visible");
      showModal($("#existing-quiz-questions-modal"));
      this.get_All_question();
    },
    /***mcq */
    getMcqTemplate: function() {
      var true_ans = "";
      var flag = 0;
      var mcq_quiz = "<pre>%mcq%";
      var points = document.getElementById("points").value;
      if (points == "" || points == null) {
        points = 0;
      }

      var correctAnswerCheckbox = $("#mcq-editor-options input:checked");

      if (!correctAnswerCheckbox.length) {
        window.cvNotify("Please select a correct answer.", "error");
        return false;
      }
      var true_ans = $(correctAnswerCheckbox[0].parentElement.parentElement)
        .find("p")
        .text();
      var test = $.trim(true_ans);
      if (!test) {
        if (
          $(
            $(correctAnswerCheckbox[0].parentElement.parentElement).find(
              "input[type='file']"
            )
          ).val()
        )
          true_ans = $(
            $(correctAnswerCheckbox[0].parentElement.parentElement).find(
              "input[type='file']"
            )
          )[0].files[0].name;
      } else {
        // true_ans = $("pre").html($(correctAnswerCheckbox[0].parentElement.parentElement).find("p").html());
        /* true_ans.find('.options_new_line').replaceWith(function(){
          return "\n"+this.innerHTML;
        });*/
      }
      if (!$.trim(true_ans)) {
        cvNotify("Correct answer is not empty", "error");
        return false;
      }
      let true_option =
        $(correctAnswerCheckbox[0].parentElement.parentElement).index() + 1;
      var que_img = $("#mcq_question_image").val();
      if (que_img) {
        que_img = $("#mcq_question_image")[0].files[0].name;
      } else {
        que_img = "";
      }
      let question = document.getElementById("mcq_question").innerText;
      if (question == "" && que_img == "") {
        cvNotify("Please insert question.", "error");
        return false;
      }
      mcq_quiz +=
        "%answer%" +
        true_ans
          .replace(/&/g, "&amp;")
          .replace(/>/g, "&gt;")
          .replace(/</g, "&lt;")
          .replace(/"/g, "&quot;") +
        "%endanswer%";

      mcq_quiz += "%trueoption%" + true_option + "%endtrueoption%";
      mcq_quiz += "%questionpoint%" + points + "%endquestionpoint%";

      mcq_quiz +=
        "%question%<pre>" +
        document
          .getElementById("mcq_question")
          .innerText.replace(/&/g, "&amp;")
          .replace(/>/g, "&gt;")
          .replace(/</g, "&lt;")
          .replace(/"/g, "&quot;")
          .replace(/</g) +
        "</pre>%endquestion%";
      if (que_img) {
        mcq_quiz += "%questionimg%" + que_img + "%endquestionimg%";
      }

      mcq_quiz += "%options%";

      let mcqOptions = $("#mcq-editor-options >div>p");
      let mcqImgeOption = $("#mcq-editor-options >div>input[type='file']");

      for (var i = 0; i < mcqOptions.length; i++) {
        var image_options = $(mcqImgeOption[i]).val();
        if (image_options) {
          image_options = $(mcqImgeOption[i])[0].files[0].name;
        } else {
          image_options = "";
        }
        let mcq_option = $(mcqOptions[i]);
        mcq_option.find(".options_new_line").replaceWith(function() {
          return "\n" + this.innerHTML;
        });
        mcq_quiz += "%option%";
        if (image_options) {
          mcq_quiz += "%optionimg%" + image_options + "%endoptionimg%";
          //  mcq_quiz +="%endoption%";
        }
        mcq_quiz +=
          "%optiontxt%<pre>" +
          mcq_option
            .text()
            .replace(/&/g, "&amp;")
            .replace(/>/g, "&gt;")
            .replace(/</g, "&lt;")
            .replace(/"/g, "&quot;");

        mcq_quiz += "</pre>%endoptiontxt%";

        //else
        //{
        mcq_quiz += "%endoption%";
        //}
      }
      mcq_quiz +=
        "%endoptions%%description%" +
        document.getElementById("mcq_description").innerText +
        "%enddescription%%endmcq%</pre>";
      // console.log(mcq_quiz);
      return mcq_quiz;
    },

    /*******image preview */
    /***mcq */
    getMcqTemplatePreview: function() {
      var true_ans = "";
      var flag = 0;
      var mcq_quiz = "<pre>%mcq%";
      var points = document.getElementById("points").value;
      if (points == "" || points == null) {
        points = 0;
      }
      var correctAnswerCheckbox = $("#mcq-editor-options input:checked");
      if (!correctAnswerCheckbox.length) {
        cvNotify("Please select a correct answer.", "error");
        return false;
      }

      var true_ans = $(correctAnswerCheckbox[0].parentElement.parentElement)
        .find("p")
        .text();
      var test = $.trim(true_ans);
      if (!test) {
        if (
          $(
            $(correctAnswerCheckbox[0].parentElement.parentElement).find(
              "input[type='file']"
            )
          ).val()
        )
          true_ans = $(
            $(correctAnswerCheckbox[0].parentElement.parentElement).find(
              "input[type='file']"
            )
          )[0].files[0].name;
      } else {
        // true_ans = $("pre").html($(correctAnswerCheckbox[0].parentElement.parentElement).find("p").html());
        /* true_ans.find('.options_new_line').replaceWith(function(){
          return "\n"+this.innerHTML;
        });*/
      }
      if (!$.trim(true_ans)) {
        cvNotify("Correct answer is not empty", "error");
        return false;
      }
      //  console.log(getElementIndex($(correctAnswerCheckbox[0].parentElement.parentElement)));

      let true_option =
        $(correctAnswerCheckbox[0].parentElement.parentElement).index() + 1;
      var que_img = $("#mcq_question_image").val();
      var reader = new FileReader();
      if (que_img) {
        que_img = $("#mcq_question_image")[0].files[0].name;
        que_img = URL.createObjectURL($("#mcq_question_image")[0].files[0]);
      } else {
        que_img = "";
      }
      let question = document.getElementById("mcq_question").innerText;
      if (question == "" && que_img == "") {
        cvNotify("Please insert question.", "error");
        return false;
      }
      //console.log(true_ans);
      mcq_quiz +=
        "%answer%" +
        true_ans
          .replace(/&/g, "&amp;")
          .replace(/\n/g, "%opttextNewLine%")
          .replace(/>/g, "&gt;")
          .replace(/</g, "&lt;")
          .replace(/"/g, "&quot;") +
        "%endanswer%";

      mcq_quiz += "%trueoption%" + true_option + "%endtrueoption%";
      mcq_quiz += "%questionpoint%" + points + "%endquestionpoint%";
      mcq_quiz +=
        "%question%<pre>" +
        document
          .getElementById("mcq_question")
          .innerText.replace(/&/g, "&amp;")
          .replace(/>/g, "&gt;")
          .replace(/</g, "&lt;")
          .replace(/"/g, "&quot;") +
        "</pre>%endquestion%";
      if (que_img) {
        mcq_quiz += "%questionimg%" + que_img + "%endquestionimg%";
      }
      mcq_quiz += "%options%";
      let mcqOptions = $("#mcq-editor-options >div>p");
      let mcqImgeOption = $("#mcq-editor-options >div>input[type='file']");
      for (var i = 0; i < mcqOptions.length; i++) {
        var image_options = $(mcqImgeOption[i]).val();
        if (image_options) {
          image_options = $(mcqImgeOption[i])[0].files[0].name;
          image_options = URL.createObjectURL($(mcqImgeOption[i])[0].files[0]);
        } else {
          image_options = "";
        }
        let mcq_option = $(mcqOptions[i]);
        mcq_option.find(".options_new_line").replaceWith(function() {
          return "\n" + this.innerHTML;
        });

        if (mcq_option.text() == "" && image_options == "") {
          continue;
        }
        mcq_quiz += "%option%";
        if (image_options) {
          mcq_quiz += "%optionimg%" + image_options + "%endoptionimg%";
        }
        mcq_quiz +=
          "%optiontxt%<pre>" +
          mcq_option
            .text()
            .replace(/&/g, "&amp;")
            .replace(/>/g, "&gt;")
            .replace(/</g, "&lt;")
            .replace(/"/g, "&quot;");

        mcq_quiz += "</pre>%endoptiontxt%";

        /* else
              {*/
        mcq_quiz += "%endoption%";
        //}
      }
      mcq_quiz +=
        "%endoptions%%description%" +
        document.getElementById("mcq_description").innerText +
        "%enddescription%%endmcq%</pre>";
      return mcq_quiz;
    },
    /*****End preview image */

    mcq: function() {
      //let content1 = this.getMcqTemplate();
      //this.questionPreviewContent = getQuestionContentWithMcqQuizTemplatesRendered(content1);
      let content1 = this.getMcqTemplatePreview();
      if (content1) {
        this.questionPreviewContent = getQuestionContentWithMcqQuizTemplatesRenderedPreview(
          content1
        );
      }
    },
    onExistingFitbQuestionClick: function(e) {
      $(e.currentTarget).toggleClass("checked");
      var index = e.currentTarget.dataset.index;
      this.questionPreviewContent = this.questions[index].question;
    },
    add_quiz_questions: function() {
      var fitbQuestions = $("#existing-fitb-questions-list .checked");
      let que_id = [];
      for (var i = 0; i < fitbQuestions.length; i++) {
        let index = fitbQuestions[i].dataset.index;
        let points = $(fitbQuestions[i])
          .find("input")
          .val();
        if (!points) {
          window.cvNotify(
            "Please enter points for all selected questions.",
            "danger"
          );
          return false;
        }
        que_id.push({ que_id: this.questions[index].que_id, point: points });
      }

      var mcqQuestions = $("#existing-mcq-questions-list .checked");

      for (var i = 0; i < mcqQuestions.length; i++) {
        let index = mcqQuestions[i].dataset.index;
        let points = $(mcqQuestions[i])
          .find("input")
          .val();
        if (!points) {
          window.cvNotify(
            "Please enter points for all selected questions.",
            "danger"
          );
          return false;
        }
        que_id.push({ que_id: this.questions[index].que_id, point: points });
      }
      //console.log(que_id);
      //return false;
      if (que_id.length) {
        this.$http
          .post("/api/user/InsertTeacherQuizMultipleQuestions", {
            quiz_id: this.quiz_id,
            questions_id: que_id,
            sub_id: this.sub_id,
            user_id: this.user_id
          })
          .then(function(res) {
            if (res.body.status == "403") {
            } else {
              let resp = res.body.data;
              if (resp == "0") {
                window.cvNotify("not inserted", "danger");
              } else {
                window.cvNotify("Successfully added.", "success");
                this.questions = res.body.data;
                // console.log(this.questions);
                for (var i = 0; i < this.questions.length; i++) {
                  this.questions[
                    i
                  ].question = getQuizContentWithAllTemplateRendered(
                    this.questions[i].question
                  );
                  if (this.questions[i].qt_id == 1)
                    this.question_title[i] = $(this.questions[i].question)
                      .find("h3")
                      .html();
                  else
                    this.question_title[i] = $(this.questions[i].question)
                      .find("#qtest")
                      .html();
                  //console.log()
                }
                this.get_quiz_question(this.userId);
              }
            }
          });
      }
    },
    closeNewQuestionModal: function(e) {
      hideModal("new-quiz-question-modal");
    },
    closeExistingQuestionsModal: function(e) {
      hideModal("existing-quiz-questions-modal");
    },
    get_quiz_detail: function(quizId) {
      axios
        .post("/api/user/GetQuizDetailAdmin", {
          quiz_id: quizId,
          user_id: this.userId
        })
        .then(res => {
          if (res.data.length) {
            this.quiz_detail = res.data;
            this.quiz_id = this.quizID;
            this.quiz_name = res.data[0].quiz_name;
            this.subjectName = res.data[0].subject;
            this.quiz_price = res.data[0].price;
            this.sub_id = res.data[0].sub_id;
            this.quiz_img = res.data[0].quiz_img;
            this.quiz_desc = res.data[0].quiz_desc;
            this.quizInitialized = true;
            this.get_quiz_question(this.userId);
          } else {
            this.get_quiz_question(this.userId);
            //window.open("/quiz-admin","_self");
            // return false;
          }
        });
    }
  },
  mounted: function() {
    this.quizID = new URL(window.location).searchParams.get("id");
    if (this.quizID) {
      this.get_quiz_detail(this.quizID);
    }

    hideTawk();

    var vm = this;
    /**** Set up 'Fill With Options' quiz modal  ********/
    var fwoEditorStatmentContainer = $("#fwo-editor-statements");
    $("#fwo-editor-add-blank-btn").unbind("click");
    $("#fwo-editor-add-blank-btn").click(function() {
      fwoEditorStatmentContainer.append(
        '<span class="fwo-editor-blank" contenteditable="true"></span>'
      );
    });
    $("#fwo-editor-new-line").unbind("click");
    $("#fwo-editor-new-line").click(function() {
      fwoEditorStatmentContainer.append("<br>");
    });
    var fwoEditorTextInput = $("#fwo-editor-text-input");
    $("#fwo-editor-add-text-btn").unbind("click");
    $("#fwo-editor-add-text-btn").click(function() {
      fwoEditorStatmentContainer.append(
        '<span contenteditable="true">' +
          fwoEditorTextInput
            .val()
            .replace(/\s/g, "&nbsp;")
            .replace(/&/g, "&amp;")
            .replace(/>/g, "&gt;")
            .replace(/</g, "&lt;")
            .replace(/"/g, "&quot;") +
          "</span>"
      );
      fwoEditorTextInput.val("");
    });

    var fwoOptionInput = $("#fwo-editor-add-options-wrapper input")[0];
    var fwoOptionsWrapper = $("#fwo-editor-options-wrapper");
    $($("#fwo-editor-add-options-wrapper button")[0]).unbind("click");
    $($("#fwo-editor-add-options-wrapper button")[0]).click(function() {
      //if(fwoOptionInput.value == '') return;
      fwoOptionsWrapper.append(
        '<div class="fwo-editor-option"><span>' +
          fwoOptionInput.value
            .replace(/&/g, "&amp;")
            .replace(/>/g, "&gt;")
            .replace(/</g, "&lt;")
            .replace(/"/g, "&quot;") +
          '</span><a><i class="fas fa-times"></i></a></div>'
      );
      fwoOptionInput.value = "";
      let options = $(".fwo-editor-option");
      $(options[options.length - 1])
        .find("a")
        .click(function(e) {
          e.currentTarget.parentElement.parentElement.removeChild(
            e.currentTarget.parentElement
          );
        });
    });

    $("#fwo-editor-add-btn").click(function() {
      vm.questionPreviewContent = vm.fillinTheBlank();
      vm.questionPreviewContent = getQuizRepresentation(
        vm.questionPreviewContent
      ); //getLmsLessonContentWithFwoQuizTemplatesRendered(vm.questionPreviewContent);
    });

    //initCvModals();
    this.fillInTheBlanksEditable = document.getElementById(
      "quiz-editor-editable-box"
    );
    $(this.fillInTheBlanksEditable).click(function(e) {
      vm.onFillInTheBlanksEditorClicked(e);
    });

    $("#quiz-editor-editable-box").on("input", function() {
      if (!$(this).find("span").length) {
        $(this).html("");
        vm.addText();
        setTimeout(function() {
          $(this).focus();
        }, 100);
      }
    });
    $("#quiz-editor-editable-box").on("keypress", e => {
      if (e.keyCode == 13) {
        setTimeout(() => {
          $(e.currentTarget.lastElementChild).remove();
          $(e.currentTarget).append(
            '<br/><span class="fitb-text" contenteditable="true" tabindex="-1">'
          );
          $(e.currentTarget.lastElementChild).focus();
        }, 200);
      }
    });

    $("#fitb-options-editable-box").on("keypress", function(e) {
      if (e.keyCode == 13) {
        e.preventDefault();
        if (!e.currentTarget.value) return;
        vm.addFitbOption(e.currentTarget.value);
        e.currentTarget.value = "";
      }
    });
  },
  beforeDestroy: function() {
    showTawk();
  },
  updated: function() {
    initQuizAndStuff();
    initCvModals();
    initCvTablayouts();

    $("#mcq_qiestion")
      .focusout(() => {
        var element = $(this);
        if (!element.text().replace(" ", "").length) {
          element.empty();
        }
      })
      .bind(this);
  }
};
</script>
<style lang="scss">
#quiz-editor-root {
  min-height: 100%;
  height: 0;
  background: #fff;
  #main {
    flex-direction: row;
    min-height: 100%;
    height: 0;
  }
  & * {
    font-family: "Rubik";
  }
}
#quiz-editor-sidebar {
  padding: 59px 24px 24px 24px;
  & > div {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 24px 24px 8px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  h3 {
    margin: 0 0 8px;
    font-size: 1rem;
    line-height: 1;
    font-weight: bold;
  }
  p {
    margin: 0 0 24px;
    font-size: 1.1rem;
    line-height: 1;
  }

  #quiz-editor-add-question {
    width: 100%;
  }
}

#new-question-button-wrapper {
  position: relative;
  min-width: 0;
  div {
    position: absolute;
    display: none;
    width: 100%;
    bottom: 100%;
    padding: 8px 0;
    background: #fff;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: all 200ms;
    &.visible {
      display: block;
      opacity: 1;
    }
    &.is-transitioning {
      display: block !important;
    }
    a {
      display: block;
      padding: 8px 16px;
      color: #444;
      cursor: pointer;
      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
}

#quiz-editor-mainbar {
  flex-grow: 1;
  height: 100%;
  padding: 24px 24px 16px 24px;
  padding-left: 0;
  & > div {
    position: relative;
    height: 100%;
    overflow-y: auto;
    padding: 16px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
  counter-reset: quiz-questions-counter;
}
.quiz-questions-list-item-container {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 32px 0 0 32px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.05);
  & > div:first-of-type {
    flex-grow: 1;
  }
  &::before {
    counter-increment: quiz-questions-counter;
    content: counter(quiz-questions-counter);
    position: absolute;
    left: -32px;
    display: block;
    padding: 4px 16px 0 0;
    font-size: 1.3rem;
  }

  .quiz-item {
    margin-bottom: 0;
    background: none;
  }
  & > div:last-of-type {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 24px 8px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    i {
      flex-grow: 1;
    }
    button {
      margin: 0;
      padding: 8px 16px;
      background: rgba(0, 0, 0, 0.05);
      color: #444;
      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
}

#new-quiz-question-modal {
  .body {
    display: flex;
    flex-direction: row;
  }
}

.quiz-type-modal-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  & > div:first-of-type {
    width: 100%;
    padding: 24px;
  }
  & > div:last-of-type {
    width: 100%;
  }

  h3 {
    margin: 0 0 8px;
    font-size: 1rem;
    line-height: 1;
    font-weight: bold;
  }
  p {
    margin: 0 0 24px;
    font-size: 1.1rem;
    line-height: 1;
  }
}

#fitb-editor-wrapper {
  margin-bottom: 24px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  button {
    padding: 8px 12px;
  }
}

#quiz-editor-modal-editor {
  width: 100%;
  input {
    width: 100%;
    margin-bottom: 24px;
  }
}

#quiz-editor-editable-box {
  width: 100%;
  height: 150px;
  padding: 16px;
  &:focus {
    outline: none;
  }
}

.fitb-text,
.fitb-editor-blank {
  display: inline-block;
  vertical-align: middle;
  min-width: 32px;
  height: 24px;
  margin: 0 4px 4px;
  padding: 0 4px;
  line-height: 24px;
}
.fitb-editor-blank {
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.2);
}

#fitb-options-editor-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 24px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  & > div {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 0 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
}

#fitb-options-editable-box {
  margin: 0 !important;
  padding: 8px 8px;
  background: transparent;
  border: none;
  &:focus {
    outline: none;
  }
}

.fitb-editor-option {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 4px 4px 4px 0;
  padding: 4px 4px 4px 16px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 32px;
  color: #444;
  button {
    width: 24px;
    height: 24px;
    margin: 0;
    margin-left: 8px;
    padding: 0;
    text-align: center;
    line-height: 24px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 12px;
    font-style: normal;
  }
}

#fitb-explanation {
  width: 100%;
  margin: 0px !important;
  padding: 4px;
  &:focus {
    outline: none;
  }
}

#mcq-editor-options {
  & > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px;
    margin-bottom: 16px;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: rgba(0, 0, 0, 0.05);
    p {
      flex-grow: 1;
      margin: 0;
    }
    label {
      display: block;
      position: relative;
      margin: 0 24px 0 0;
      padding-left: 35px;
      cursor: pointer;
      font-size: 22px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
      }
      span {
        padding: 4px;
        background: #eee;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        font-size: 12px;
        color: #aaa;
      }
      input:checked ~ span {
        background: rgba(0, 168, 28, 1);
        color: #fff;
      }
    }
    button {
      width: 24px;
      height: 24px;
      margin: 0;
      padding: 0;
      text-align: center;
      line-height: 24px;
      color: #777;
    }
  }
}

#existing-quiz-questions-modal {
  .body {
    display: flex;
    flex-direction: row;
    & > div:first-of-type {
      border-right: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
}

#existing-questions-list-wrapper {
  .cv-tablayout {
    flex-grow: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
  .tabs {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .content {
    flex-grow: 1;
    overflow: auto;
  }
}
.existing-questions-list {
  & > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 8px 16px;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: rgba(0, 0, 0, 0.05);
    p {
      flex-grow: 1;
    }
    i {
      width: 24px;
      height: 24px;
      background: rgb(3, 201, 36);
      visibility: hidden;
    }
    &.checked {
      background: rgba(6, 194, 53, 0.4);
      label {
        visibility: visible;
      }
    }
    label {
      visibility: hidden;
    }
    input[type="text"] {
      width: 48px;
      padding-left: 4px;
      padding-right: 4px;
      text-align: center;
      background: transparent;
    }
  }
}
.content {
  .active {
    display: block;
  }
}

[contenteditable="true"]:empty:before {
  content: attr(placeholder);
  display: block; /* For Firefox */
}
@media only screen and (max-width: 768px) {
  #cQuizPage {
    overflow-y: auto;
  }
  #main {
    padding-top: 0;
  }
}

@media only screen and (max-width: 425px) {
  #new-quiz-question-modal {
    .body {
      flex-wrap: wrap;
      > div {
        width: 100% !important;
      }
    }
  }
  #existing-quiz-questions-modal {
    .body {
      flex-wrap: wrap;
      > div {
        width: 100% !important;
      }
      & > div:first-of-type {
        border-right: none;
      }
    }
  }
}

#qtest > pre {
  padding-left: 0px !important;
}
.option-container > button {
  pre {
    padding-top: 8px !important;
    color: #000 !important;
    padding-left: 0px !important;
    padding-bottom: 4px !important;
    margin-bottom: 0px !important;
    line-height: normal !important;
    height: auto !important;
  }
}
.option-container:hover {
  pre {
    color: #fff !important;
  }
}
</style>
