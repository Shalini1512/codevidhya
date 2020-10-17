<template>
  <div id="projects-root">
    <Header>
      <section>
        <div class="sptb-4 sptb-tab" style="padding-bottom: 2rem;">
          <div class="header-text mb-0">
            <div class="container">
              <div class="row align-items-center">
                <div
                  class="col-md-6"
                  style="display: flex; flex-direction: column; justify-content: center"
                >
                  <div class="text-left text-white">
                    <h2>Assessment Questions</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Header>
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-12 col-lg-12 col-md-12">
          <div class="card">
            <div class="card-header bg-secondary">
              <h3 class="card-title  text-white w-auto">
                Assessment Questions
              </h3>
              <i class="flex-fill"></i>
              <span
                class="badge badge-primary mr-1"
                title="Download file to upload questions"
                style="cursor:pointer"
                @click="downloadQuestionFile()"
              >
                <h3><i class="fas fa-download" /></h3>
              </span>
              <span
                class="badge badge-primary mr-1"
                title="Upload questions file"
                style="cursor:pointer"
                onclick="showModal('questionUploadFileModal');"
              >
                <h3><i class="fas fa-upload" /></h3>
              </span>

              <span
                class="badge badge-primary mr-1"
                title="Add new question"
                style="cursor:pointer"
                @click="openModal('addNewQuestionModal')"
              >
                <h3><i class="fas fa-plus" /></h3>
              </span>
            </div>
            <div class="card-body">
              <div class=" card p-2 row">
                <div class="col-sm-12 p-2">
                  <div class="panel-group1" id="subjectsaccordion2">
                    <div class="panel panel-default mb-4  border">
                      <div class="panel-heading1 bg-primary text-white">
                        <h4 class="panel-title1">
                          <a
                            class="accordion-toggle collapsed text-white"
                            data-toggle="collapse"
                            data-parent="#subjectsaccordion2"
                            href="#subjectscollapseFour"
                            aria-expanded="false"
                            >Subjects</a
                          >
                        </h4>
                      </div>
                      <div
                        id="subjectscollapseFour"
                        class="panel-collapse collapse"
                        role="tabpanel"
                        aria-expanded="false"
                      >
                        <div class="panel-body p-2">
                          <div class="tabs-menu mb-4 mt-4">
                            <!-- Tabs -->
                            <ul class="nav panel-tabs">
                              <li
                                class="mb-2"
                                @click="
                                  sub_id = '';
                                  load_questions();
                                "
                              >
                                <a href="#tab1" class="active" data-toggle="tab"
                                  >All</a
                                >
                              </li>
                              <template v-for="subject in subjects">
                                <li
                                  class="mb-2"
                                  :key="subject.sub_id"
                                  v-if="subject.sch_id == sch_id"
                                  @click="
                                    sub_id = subject.sub_id;
                                    load_questions();
                                  "
                                >
                                  <a href="#" data-toggle="tab">{{
                                    subject.sub_name
                                  }}</a>
                                </li>
                              </template>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 p-2">
                  <!-- questions accordian start-->
                  <div class="panel-group1" id="accordion2">
                    <template v-for="(question, index) in allQuestions">
                      <div
                        :key="question.que_id"
                        class="panel panel-default mb-2 p-0 border mx-auto d-block "
                      >
                        <div class="panel-heading">
                          <div
                            class="row p-2"
                            style="cursor:pointer"
                            data-toggle="collapse"
                            data-parent="#accordion2"
                            :href="'#questionNumber' + index"
                            aria-expanded="false"
                          >
                            <div class="col-sm-10 d-flex align-items-center">
                              <p
                                class="badge badge-default mr-1 text-dark d-inline-block"
                              >
                                {{ index + 1 }}
                              </p>
                              <p
                                class="d-inline-block"
                                v-html="question.question"
                              ></p>
                            </div>
                            <div class="col-sm-2 d-flex  align-items-center">
                              <img
                                v-if="question.question_img"
                                class="card-profile-img d-flex align-self-center mb-0 "
                                style="width:40px; height:40px; cursor:pointer; border:thin solid #999;"
                                :src="
                                  '../static/uploads/' + question.question_img
                                "
                                alt="img"
                                @click="
                                  imagePreview = question.question_img;
                                  openModal('modalImagePreview');
                                "
                              />
                              <i class="flex-fill"></i>
                              <span
                                class="badge badge-success mr-1"
                                style="cursor:pointer"
                                @click="editQuestion(question.que_id, question)"
                                >Edit</span
                              >
                              <span
                                class="badge badge-danger"
                                style="cursor:pointer"
                                @click="deleteQuestion(question.que_id)"
                                >Delete</span
                              >
                            </div>
                          </div>
                        </div>
                        <div
                          :id="'questionNumber' + index"
                          class="panel-collapse collapse"
                          role="tabpanel"
                          aria-expanded="false"
                        >
                          <div class="panel-body">
                            <div
                              class="row mb-1 align-items-center p-2"
                              style="background:#D5DBDB;"
                              v-if="question.opt1 || question.opt1_img"
                            >
                              <div class="col-sm-11">
                                <p class="mr-2 d-inline-block">
                                  <span
                                    :class="
                                      question.true_ans == 'opt1'
                                        ? 'badge ' + 'badge-success'
                                        : 'badge ' + 'badge-secondary'
                                    "
                                    >A</span
                                  >
                                </p>
                                <p
                                  class="d-inline-block"
                                  v-html="question.opt1"
                                ></p>
                              </div>
                              <div class="col-sm-1">
                                <img
                                  v-if="question.opt1_img"
                                  class="card-profile-img mx-auto d-block mb-0"
                                  style="width:50px; height:50px; cursor:pointer;"
                                  :src="
                                    '../static/uploads/' + question.opt1_img
                                  "
                                  alt="img"
                                  @click="
                                    imagePreview = question.opt1_img;
                                    openModal('modalImagePreview');
                                  "
                                />
                              </div>
                            </div>
                            <div
                              class="row mb-1 align-items-center p-2"
                              style="background:#D5DBDB;"
                              v-if="question.opt2 || question.opt2_img"
                            >
                              <div class="col-sm-11">
                                <p class="mr-2 d-inline-block">
                                  <span
                                    :class="
                                      question.true_ans == 'opt2'
                                        ? 'badge ' + 'badge-success'
                                        : 'badge ' + 'badge-secondary'
                                    "
                                    >B</span
                                  >
                                </p>
                                <p
                                  class="d-inline-block"
                                  v-html="question.opt2"
                                ></p>
                              </div>
                              <div class="col-sm-1">
                                <img
                                  v-if="question.opt2_img"
                                  class="card-profile-img mx-auto d-block mb-0"
                                  style="width:50px; height:50px; cursor:pointer;"
                                  :src="
                                    '../static/uploads/' + question.opt2_img
                                  "
                                  alt="img"
                                  @click="
                                    imagePreview = question.opt2_img;
                                    openModal('modalImagePreview');
                                  "
                                />
                              </div>
                            </div>
                            <div
                              class="row mb-1 align-items-center p-2"
                              style="background:#D5DBDB;"
                              v-if="question.opt3 || question.opt3_img"
                            >
                              <div class="col-sm-11">
                                <p class="mr-2 d-inline-block">
                                  <span
                                    :class="
                                      question.true_ans == 'opt3'
                                        ? 'badge ' + 'badge-success'
                                        : 'badge ' + 'badge-secondary'
                                    "
                                    >C</span
                                  >
                                </p>
                                <p
                                  class="d-inline-block"
                                  v-html="question.opt3"
                                ></p>
                              </div>
                              <div class="col-sm-1">
                                <img
                                  v-if="question.opt3_img"
                                  class="card-profile-img mx-auto d-block mb-0"
                                  style="width:50px; height:50px; cursor:pointer;"
                                  :src="
                                    '../static/uploads/' + question.opt3_img
                                  "
                                  alt="img"
                                  @click="
                                    imagePreview = question.opt3_img;
                                    openModal('modalImagePreview');
                                  "
                                />
                              </div>
                            </div>
                            <div
                              class="row mb-1 align-items-center p-2"
                              style="background:#D5DBDB;"
                              v-if="question.opt4 || question.opt4_img"
                            >
                              <div class="col-sm-11">
                                <p class="mr-2 d-inline-block">
                                  <span
                                    :class="
                                      question.true_ans == 'opt4'
                                        ? 'badge ' + 'badge-success'
                                        : 'badge ' + 'badge-secondary'
                                    "
                                    >D</span
                                  >
                                </p>
                                <p
                                  class="d-inline-block"
                                  v-html="question.opt4"
                                ></p>
                              </div>
                              <div class="col-sm-1">
                                <img
                                  v-if="question.opt4_img"
                                  class="card-profile-img mx-auto d-block mb-0"
                                  style="width:50px; height:50px; cursor:pointer;"
                                  :src="
                                    '../static/uploads/' + question.opt4_img
                                  "
                                  alt="img"
                                  @click="
                                    imagePreview = question.opt4_img;
                                    openModal('modalImagePreview');
                                  "
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                    <div
                      class="panel panel-default border p-4"
                      v-if="!allQuestions.length"
                    >
                      <h4>There are no questions.</h4>
                    </div>
                  </div>
                  <!--end question accordian-->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal to preview images-->
    <div id="modalImagePreview" class="cv-modal normal ">
      <div
        style="display: flex; flex-direction: column; max-width:3000px; width:98%; height:98%;"
      >
        <div class="row p-2 m-1 ">
          <i class="flex-fill"></i
          ><span
            class="badge badge-primary"
            style="cursor:pointer"
            onclick="hideModal('modalImagePreview');"
            >&times;</span
          >
        </div>
        <div
          class="mx-auto d-flex align-items-center justify-content-center h-100"
        >
          <img
            v-if="imagePreview"
            :src="'/static/uploads/' + imagePreview"
            alt="img"
          />
        </div>
      </div>
    </div>
    <!--modal image preview ends-->

    <!-- Modal of Add new question button -->
    <div id="addNewQuestionModal" class="cv-modal normal ">
      <div
        style="display: flex; flex-direction: column; max-width:3000px; width:98%; height:98%;"
      >
        <NewQuestion
          :sch_id="sch_id"
          :load_questions="load_questions"
          :load_all_subjects="load_all_subjects"
        ></NewQuestion>
      </div>
    </div>
    <!--Question Modal ends here -->
    <!-- Modal of Update new question button -->
    <div id="updateQueInQueTab-button-modal" class="cv-modal normal ">
      <div
        style="display: flex; flex-direction: column; max-width:3000px; width:98%; height:98%;"
      >
        <UpdateQuestionModal
          :queId="queId"
          :updateQuestion="updateQuestion"
          :queStatus="false"
          :load_questions="load_questions"
        ></UpdateQuestionModal>
      </div>
    </div>
    <!--Question Modal ends here -->
    <!------------Upload question file modal------------------------>
    <div id="questionUploadFileModal" class="cv-modal normal">
      <div>
        <div class="header">
          <h3>Upload file</h3>
        </div>
        <div class="body" style="padding: 24px">
          <div class="cv-file-input-group">
            <input type="file" id="uploadfile-input" accept=".xls,.xlsx" />
            <label for="uploadfile-input">
              <span class="selected-file" id="filename-input"></span>
              <span class="choose-file">Choose file</span>
            </label>
            <div style="display:flex; align-items:center; padding:4px 4px; ">
              <label class="text-danger"
                ><i class="fas fa-info-circle" style="padding-top:4px;"></i>
                &nbsp; File should be less than 100Kb.</label
              >
            </div>
          </div>
        </div>
        <div class="footer">
          <button
            class="btn btn-danger"
            onclick="(function() {hideModal('questionUploadFileModal');$('#filename-input').text('');})()"
          >
            Cancel
          </button>
          <button class="btn btn-success" @click="uploadQuestionFile()">
            Upload
          </button>
        </div>
      </div>
    </div>
    <!------------end modal------------------------>
    <Footer />
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import NewQuestion from "@/components/assessments/NewQuestion.vue";
import UpdateQuestionModal from "@/components/assessments/UpdateQuestion.vue";
import Footer from "@/components/footer/Footer.vue";
export default {
  name: "home",
  components: {
    Header,
    NewQuestion,
    UpdateQuestionModal,
    Footer
  },
  data() {
    return {
      userId: 0,
      cls_id: "",
      user_id: "",
      sec_id: "",
      role_id: "",
      sch_id: "",
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
      }
    };
  },
  beforeCreate() {},
  created() {
    /*if (this.$route.query.assessment) {
      var query = atob(this.$route.query.assessment);
      var params = query.split(",");
      this.asmnt_id = params[0];
      this.asmnt_cls_id = params[2];
    }*/
  },
  beforeMount() {},
  mounted: function() {
    //initCvModals();
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.cls_id = this.$store.getters.getAuthData.auth_cls_id;
          this.user_id = this.$store.getters.getAuthData.auth_user_id;
          this.sec_id = this.$store.getters.getAuthData.auth_sec_id;
          this.role_id = this.$store.getters.getAuthData.auth_role_id;
          this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
          this.getServerTime();
        }
      }.bind(this)
    );
    document
      .getElementById("uploadfile-input")
      .addEventListener("change", function(e) {
        var fileName = "";
        if (this.files && this.files.length > 1)
          fileName = (this.getAttribute("data-multiple-caption") || "").replace(
            "{count}",
            this.files.length
          );
        else fileName = e.target.value.split("\\").pop();
        if (fileName) $("#filename-input").text(fileName);
      });
  },
  methods: {
    openModal: function(modalId) {
      $("#" + modalId + " > div").removeClass("visible");
      showModal($("#" + modalId));
    },
    downloadQuestionFile: function() {
      this.$http
        .post(
          "/api/user/downloadQuestionFile",
          { sch_id: this.sch_id },
          { responseType: "blob" }
        )
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            let blob = new Blob([res.body], {
              type: res.headers.get("content-type")
            });
            let link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "Questions File.xlsx";
            link.click();
          }
        });
    },
    uploadQuestionFile: function() {
      var data = new FormData();
      var fileInput = document.getElementById("uploadfile-input");
      var file = fileInput.files[0];
      var url = URL.createObjectURL(file);
      if (!file) return;
      if (fileInput.files[0].size > 102400) {
        cvNotify("Image should be less than 100kb.", "warning");
        return false;
      }
      data.append("questionFile", file);
      data.append("sch_id", this.sch_id);
      this.$http.post("/api/user/UploadQuestionFile", data).then(function(res) {
        if (res.body.status == 1) {
          cvNotify("You have successfully uploaded the questions.", "success");
          $("#filename-input").text("");
          $("#uploadfile-input").val(null);
          hideModal("questionUploadFileModal");
          this.load_all_subjects();
          this.load_questions();
          data = new FormData();
        }
      });
    },
    getServerTime: function() {
      this.$http.post("/api/user/getServerTime").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.serverTime = res.body.serverTime;
          this.load_all_subjects();
          this.load_questions();
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
