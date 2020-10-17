<template>
  <div
    class="container-fluid"
    style="display:flex; flex-direction:column;height:100%;"
  >
    <div style="display:flex; flex-direction:column;flex-grow:1;height:100%;">
      <div
        class="pt-2"
        style="display:flex; flex-direction:column;flex-grow:1;height:100%;"
      >
        <div
          style="display: flex; flex-direction:column; width:100%; height:100%;"
        >
          <!--Question Modal -->
          <div style="flex-grow: 1; overflow-y: auto;">
            <div style="display:none">{{ updateQuestion }}</div>
            <div class="col-sm-12 modal-left-row1">
              <input
                class="modalQues active"
                style="margin-right:20px"
                type="button"
                name=""
                value="Question"
                @click="inputType = 'que'"
              />
              <input
                class="modalQues"
                style="margin-right:10px"
                type="button"
                name=""
                value="Option 1"
                v-if="que_type != 'subj_type'"
                :disabled="que_type == 'subj_type'"
                @click="inputType = 'opt1'"
              />
              <input
                class="modalQues"
                style="margin-right:10px"
                type="button"
                name=""
                value="Option 2"
                v-if="que_type != 'subj_type'"
                :disabled="que_type == 'subj_type' ? true : false"
                @click="inputType = 'opt2'"
              />
              <input
                class="modalQues"
                style="margin-right:10px"
                type="button"
                name=""
                value="Option 3"
                v-if="que_type != 'subj_type'"
                :disabled="que_type == 'subj_type' ? true : false"
                @click="inputType = 'opt3'"
              />
              <input
                class="modalQues"
                style="margin-right:10px"
                type="button"
                name=""
                value="Option 4"
                v-if="que_type != 'subj_type'"
                :disabled="que_type == 'subj_type' ? true : false"
                @click="inputType = 'opt4'"
              />
              <input
                style="margin-right:10px; background:#E74C3C; color:#FFF;"
                type="button"
                value="Upload Image"
                onclick="showModal('update-file-upload-modal');"
              />
              <i class="flex-fill" />
              <div
                class="p-3 bg-secondary"
                style="border-radius:20px 0px 0px 20px;"
              >
                Question Type
              </div>
              <div
                class="custom-controls-stacked col-sm-4 bg-secondary"
                style="padding:8.2px 9px; "
              >
                <label
                  class="custom-control custom-radio pt-1 pb-1 d-inline-block mr-4"
                >
                  <input
                    type="radio"
                    class="custom-control-input"
                    id="q1"
                    name="p"
                    v-model="que_type"
                    checked
                    value="obj_type"
                    @click="que_type = 'obj_type'"
                  />
                  <span class="custom-control-label">Objective</span>
                </label>
                <label class="custom-control custom-radio pt-1 d-inline-block ">
                  <input
                    type="radio"
                    class="custom-control-input"
                    id="q2"
                    name="p"
                    v-model="que_type"
                    value="subj_type"
                    @click="que_type = 'subj_type'"
                  />
                  <span class="custom-control-label">Subjective</span>
                </label>
              </div>
            </div>
            <div class="modal-row-a" style="height: auto;">
              <div class="modal-left-right" style="margin-right: 12px;">
                <div class="modal-left-row1">
                  <p>Question & Answer Detail</p>
                </div>
                <div
                  class="bg-white"
                  id="que-div"
                  style="flex-grow:1; margin-top: 8px; overflow:hidden; border-radius: 12px;"
                  v-if="inputType == 'que'"
                >
                  <VueEditor v-model="question" :config="config" />
                </div>
                <div
                  class="bg-white"
                  id="opt1-div"
                  style="flex-grow:1;  margin-top: 8px; overflow:auto; border-radius: 12px;"
                  v-else-if="inputType == 'opt1'"
                >
                  <VueEditor v-model="opt1" :config="config" />
                </div>
                <div
                  class="bg-white"
                  id="opt2-div"
                  style="flex-grow:1;  margin-top: 8px; overflow:auto; border-radius: 12px;"
                  v-else-if="inputType == 'opt2'"
                >
                  <VueEditor v-model="opt2" :config="config" />
                </div>
                <div
                  class="bg-white"
                  id="opt3-div"
                  style="flex-grow:1;  margin-top: 8px; overflow:auto; border-radius: 12px;"
                  v-else-if="inputType == 'opt3'"
                >
                  <VueEditor v-model="opt3" :config="config" />
                </div>
                <div
                  class="bg-white"
                  id="opt4-div"
                  style="flex-grow:1;  margin-top: 8px; overflow:auto; border-radius: 12px;"
                  v-else-if="inputType == 'opt4'"
                >
                  <VueEditor v-model="opt4" :config="config" />
                </div>
              </div>
              <div
                class="modal-left-right"
                style="justify-content: flex-start;"
              >
                <div class="modal-left-row1"><p>Preview</p></div>
                <div class="modal-right-row2">
                  <div style="margin-bottom:5px;" v-if="question || queImg">
                    <div
                      style="background:#E5E8E8; padding:3px 3px; font-size:14px;"
                    >
                      Question:
                    </div>
                    <div class="row" style="height:110px; overflow:auto;">
                      <div class="col-sm-9">
                        <div id="pre" v-html="question"></div>
                      </div>
                      <div class="col-sm-3">
                        <img class="preview" v-if="queImg" :src="queImg" />
                      </div>
                    </div>
                  </div>
                  <div v-if="(opt1 || op1Img) && que_type != 'subj_type'">
                    <div
                      style="background:#E5E8E8; padding:3px 3px; font-size:14px;"
                    >
                      Option1:
                    </div>
                    <div class="row" style="height:110px; overflow:auto;">
                      <div class="col-sm-9">
                        <div id="pre" v-html="opt1"></div>
                      </div>
                      <div class="col-sm-3">
                        <img class="preview" v-if="op1Img" :src="op1Img" />
                      </div>
                    </div>
                  </div>
                  <div v-if="(opt2 || op2Img) && que_type != 'subj_type'">
                    <div
                      style="background:#E5E8E8; padding:3px 3px; font-size:14px;"
                    >
                      Option2:
                    </div>
                    <div class="row" style="height:110px; overflow:auto;">
                      <div class="col-sm-9">
                        <div id="pre" v-html="opt2"></div>
                      </div>
                      <div class="col-sm-3">
                        <img class="preview" v-if="op2Img" :src="op2Img" />
                      </div>
                    </div>
                  </div>
                  <div v-if="(opt3 || op3Img) && que_type != 'subj_type'">
                    <div
                      style="background:#E5E8E8; padding:3px 3px; font-size:14px;"
                    >
                      Option3:
                    </div>
                    <div class="row" style="height:110px; overflow:auto;">
                      <div class="col-sm-9">
                        <div id="pre" v-html="opt3"></div>
                      </div>
                      <div class="col-sm-3">
                        <img class="preview" v-if="op3Img" :src="op3Img" />
                      </div>
                    </div>
                  </div>
                  <div v-if="(opt4 || op4Img) && que_type != 'subj_type'">
                    <div
                      style="background:#E5E8E8; padding:3px 3px; font-size:14px;"
                    >
                      Option4:
                    </div>
                    <div class="row" style="height:110px; overflow:auto;">
                      <div class="col-sm-9">
                        <div id="pre" v-html="opt4"></div>
                      </div>
                      <div class="col-sm-3">
                        <img class="preview" v-if="op4Img" :src="op4Img" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row p-2 m-1 modal-left-row1">
              <div class="col-sm-6 row">
                <div class="col-sm-3"><p>Correct Answer</p></div>
                <div class="col-sm-4">
                  <select
                    name=""
                    v-model="trueAns"
                    class="form-control"
                    :disabled="que_type == 'subj_type' ? true : false"
                  >
                    <option value="0" selected>Select option</option>
                    <option value="opt1">Option 1</option>
                    <option value="opt2">Option 2</option>
                    <option value="opt3">Option 3</option>
                    <option value="opt4">Option 4</option></select
                  >
                </div>
              </div>
              <div class="col-sm-6 row ">
                <div
                  class="col-sm-3 p-3 bg-secondary"
                  style="border-radius:20px 0px 0px 20px;"
                >
                  Question for Grade
                </div>
                <div
                  class="custom-controls-stacked col-sm-9 bg-secondary"
                  style="padding:8.5px 9px; "
                >
                  <div class="custom-controls-stacked">
                    <template v-for="(sch_cls, index) in sch_classes">
                      <label
                        class="custom-control custom-checkbox d-inline-block pt-1 ml-2"
                        :key="index"
                      >
                        <input
                          type="checkbox"
                          class="custom-control-input"
                          v-model="queForGrade"
                          name="que_choice"
                          id="inlineCheckbox1"
                          :value="sch_cls.cls_id"
                        />
                        <span class="custom-control-label">{{
                          sch_cls.cls_name
                        }}</span>
                      </label>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-row-a justify-content-center">
            <button
              class="btn btn-success mr-1"
              style="background: rgb(50, 185, 100); display:inline-block;"
              @click="updateQuestionDetail()"
            >
              Update
            </button>
            <button
              class="btn btn-danger"
              style="display:inline-block;"
              onclick="hideModal('updateQueInQueTab-button-modal');"
            >
              Cancel
            </button>
          </div>
          <!--Question Modal ends here-->
        </div>
      </div>
      <!--end main id-->
      <!-- Modal of Add new subject -->
      <div id="addsubject-modal" class="cv-modal normal ">
        <div
          style="display: flex; flex-direction: column;  width:50%; height: 30%;"
        >
          <div class="mbody-a" style="flex-grow: 1; overflow-y: auto;">
            <div class="modal-row-a" style="border-bottom:thin solid #999;">
              <h5>New Subject</h5>
            </div>
            <div class="modal-row-a">
              <input
                type="text"
                class="form-control"
                placeholder="Enter subject name...."
                v-model="newSubject"
              />
            </div>
          </div>
          <div class="modal-row-a" style="justify-content: flex-end;">
            <div>
              <button
                class="cv-button"
                style="background: rgb(50, 185, 100); display:inline-block;"
                @click="addSubject()"
              >
                Create
              </button>
              <button
                class="cv-button negative"
                style="display:inline-block;"
                onclick="hideModal('addsubject-modal');"
                @click="newSubject = ''"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <!--Modal ends here -->
      <!--Upload image editor of ck -->
      <div id="update-file-upload-modal" class="cv-modal normal">
        <div>
          <div class="header">
            <h3>Upload file</h3>
          </div>
          <div class="body" style="padding: 24px">
            <div class="cv-file-input-group">
              <input
                type="file"
                id="update-file-input"
                accept=".jpg, .png, .jpeg"
              />
              <label for="update-file-input">
                <span class="selected-file" id="file-input-file-name"></span>
                <span class="choose-file">Choose file</span>
              </label>
              <div style="display:flex; align-items:center; padding:4px 4px; ">
                <label class="text-danger"
                  ><i class="fas fa-info-circle" style="padding-top:4px;"></i>
                  &nbsp; Image should be less than 100Kb.</label
                >
              </div>
            </div>
          </div>
          <div class="footer">
            <button
              class="btn btn-danger"
              onclick="(function() {hideModal('update-file-upload-modal');})()"
            >
              Cancel
            </button>
            <button class="btn btn-success" @click="uploadFile()">
              Upload
            </button>
          </div>
        </div>
      </div>
      <!--Upload image editor of ck ends here-->
    </div>
    <!-- Quiz design copied end here-->
  </div>
</template>

<script>
var insertedImageBrowseBtn = false;
let ckEditorImageUrlInput;
let currentlyEditingQuizItem;
import moment from "vue-moment";
import { VueEditor } from "vue2-editor";

export default {
  props: ["queId", "updateQuestion", "queStatus", "load_questions"],
  components: { VueEditor },
  data() {
    return {
      userId: 0,
      cls_id: "",
      user_id: "",
      sec_id: "",
      role_id: "",
      sch_id: "",
      assessments: [],
      cv_assessments: [],
      complited_assessments: [],
      comp_length: "",
      students_marks: [],
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
      queImg: "",
      op1Img: "",
      op2Img: "",
      op3Img: "",
      op4Img: "",
      trueAns: 0,
      content: "",
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
    //this.load_subjects()
    this.load_classes();
  },
  beforeMount() {},

  methods: {
    load_classes: function() {
      this.$http
        .post("/api/user/School_classes", {
          sch_id: this.sch_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.sch_classes = res.body.all_classes;
          }
        });
    },
    load_subjects: function() {
      this.$http.post("/api/user/All_subjects").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.subjects = res.body.all_subject;
        }
      });
    },
    addSubject: function() {
      if (this.newSubject == "") {
        cvNotify("Subject name can not be empty.");
        return false;
      }
      this.$http
        .post("/api/user/Add_subjects", {
          sch_id: this.sch_id,
          sub_name: this.newSubject
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            if (res.body.success == 1) {
              cvNotify("You have successfully added a subjects.");
              this.newSubject = "";
              this.load_subjects();
              hideModal("addsubject-modal");
            } else {
              cvNotify("Subject already exist.", "warning");
            }
          }
        });
    },
    uploadFile() {
      //var data = new FormData();
      var fileInput = document.getElementById("update-file-input");
      var file = fileInput.files[0];
      var url = URL.createObjectURL(file);
      if (!file) return;
      if (fileInput.files[0].size > 102400) {
        cvNotify("Image should be less than 100kb.", "warning");
        return false;
      }
      if (this.que_type == "obj_type") {
        if (this.inputType == "que") {
          this.questionImg = file;
          this.queImg = url;
        }
        if (this.inputType == "opt1") {
          this.opt1Img = file;
          this.op1Img = url;
        }
        if (this.inputType == "opt2") {
          this.opt2Img = file;
          this.op2Img = url;
        }
        if (this.inputType == "opt3") {
          this.opt3Img = file;
          this.op3Img = url;
        }
        if (this.inputType == "opt4") {
          this.opt4Img = file;
          this.op4Img = url;
        }
      } else if (this.que_type == "subj_type") {
        if (this.inputType == "que") {
          this.questionImg = file;
          this.queImg = url;
        }
      }
      $("#file-input-file-name").text("");
      $("#update-file-input").val(null);
      hideModal("update-file-upload-modal");
    },
    get_empty: function() {
      this.sub_id = "";
      this.question = "";
      this.opt1 = "";
      this.opt2 = "";
      this.opt3 = "";
      this.opt4 = "";
      this.trueAns = 0;
      this.questionImg = "";
      this.opt1Img = "";
      this.opt2Img = "";
      this.opt3Img = "";
      this.opt4Img = "";
      this.queForGrade = [];
      this.queImg = "";
      this.op1Img = "";
      this.op2Img = "";
      this.op3Img = "";
      this.op4Img = "";
    },
    queValidate: function() {
      if (!this.sub_id) {
        cvNotify("Please select subject.", "info");
        return false;
      }
      if (this.question.length == 0) {
        cvNotify("Please provide a question.", "info");
        $("#que-div").addClass("input-valid");
        return false;
      } else {
        $("#que-div").removeClass("input-valid");
      }
      if (this.que_type == "obj_type") {
        var providedOptionsCount = 0;
        var maxOptionsCount = 4;
        for (var i = 1; i <= maxOptionsCount; i++) {
          if (this["opt" + i] || this["opt" + i + "Img"])
            providedOptionsCount++;
        }
        if (providedOptionsCount < 2) {
          cvNotify("Please provide at least two options.", "info");
          return false;
        }
        if (this.trueAns == 0) {
          cvNotify("Please select true answer.", "info");
          return false;
        } else {
          return true;
        }
      } else if (this.que_type == "subj_type") {
        return true;
      }
    },
    updateQuestionDetail: function() {
      var data = new FormData();
      if (this.queValidate()) {
        data.append("question", this.question);
        data.append("option1", this.opt1);
        data.append("option2", this.opt2);
        data.append("option3", this.opt3);
        data.append("option4", this.opt4);
        data.append("question_img", this.questionImg);
        data.append("option1_img", this.opt1Img);
        data.append("option2_img", this.opt2Img);
        data.append("option3_img", this.opt3Img);
        data.append("option4_img", this.opt4Img);
        data.append("true_ans", this.trueAns);
        data.append("sch_id", this.sch_id);
        data.append("sub_id", this.sub_id);
        data.append("que_id", this.queId);
        data.append("que_type", this.que_type);
        data.append("queForGrade", this.queForGrade);

        this.$http.post("/api/user/Update_question", data).then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            if (res.body.data == "done") {
              cvNotify("You have successfully updated a new question.", "info");
              this.get_empty();
              hideModal("updateQueInQueTab-button-modal");
              this.load_questions();
              //this.queStatus=false;
            }
          }
        });
      }
    },
    showDetail: function() {
      this.sch_id = this.updateQuestion.sch_id;
      this.sub_id = this.updateQuestion.sub_id;
      this.question = this.updateQuestion.question;
      this.questionImg = this.updateQuestion.question_img;
      if (this.updateQuestion.question_img) {
        this.queImg = "../static/uploads/" + this.updateQuestion.question_img;
      }
      this.opt1 = this.updateQuestion.opt1;
      this.opt1Img = this.updateQuestion.opt1_img;
      if (this.updateQuestion.opt1_img) {
        this.op1Img = "../static/uploads/" + this.updateQuestion.opt1_img;
      }
      this.opt2 = this.updateQuestion.opt2;
      this.opt2Img = this.updateQuestion.opt2_img;
      if (this.updateQuestion.opt2_img) {
        this.op2Img = "../static/uploads/" + this.updateQuestion.opt2_img;
      }
      this.opt3 = this.updateQuestion.opt3;
      this.opt3Img = this.updateQuestion.opt3_img;
      if (this.updateQuestion.opt3_img) {
        this.op3Img = "../static/uploads/" + this.updateQuestion.opt3_img;
      }
      this.opt4 = this.updateQuestion.opt4;
      this.opt4Img = this.updateQuestion.opt4_img;
      if (this.updateQuestion.opt4_img) {
        this.op4Img = "../static/uploads/" + this.updateQuestion.opt4_img;
      }
      this.trueAns = this.updateQuestion.true_ans;
      if (this.updateQuestion.for_grade) {
        var grades = this.updateQuestion.for_grade.split(",");
      }

      if (this.updateQuestion.for_grade && this.updateQuestion.for_grade != 0) {
        for (var i = 0; i < grades.length; i++) {
          this.queForGrade.push(grades[i]);
        }
      } else {
        this.queForGrade = [];
      }
      this.queStatus = true;
    }
  },
  mounted: function() {
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.cls_id = this.$store.getters.getAuthData.auth_cls_id;
          this.user_id = this.$store.getters.getAuthData.auth_user_id;
          this.sec_id = this.$store.getters.getAuthData.auth_sec_id;
          this.role_id = this.$store.getters.getAuthData.auth_role_id;
          this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
        }
      }.bind(this)
    );

    var vm = this;
    document
      .getElementById("file-input")
      .addEventListener("change", function(e) {
        var fileName = "";
        if (this.files && this.files.length > 1)
          fileName = (this.getAttribute("data-multiple-caption") || "").replace(
            "{count}",
            this.files.length
          );
        else fileName = e.target.value.split("\\").pop();
        if (fileName) $("#file-input-file-name").text(fileName);
      });
  },
  updated() {
    if (this.queStatus == false) {
      this.showDetail();
    }

    initCvTablayouts();
    $(function() {
      $(".modaltopic-a").on("click", function(e) {
        $(".modaltopic-a").removeClass("active");
        $(e.currentTarget).addClass("active");
      });
      $(".modalQues").on("click", function(e) {
        $(".modalQues").removeClass("active");
        $(e.currentTarget).addClass("active");
      });
    });
  }
};
</script>
<style lang="scss">
.errorclass {
  border: solid 1px red;
}
.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.drag-btn {
  border: 2px dashed #58d68d;
  color: gray;
  background-color: #d5f5e3;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
  height: 50px;
}

.drag-file1 {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  height: 50px;
}

.file-upload-form,
.image-preview {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}
img.preview {
  width: 130px;
  height: 100px;
  background-color: white;
  border: 2px solid #58d68d;
  padding: 2px;
}
a {
  text-decoration: none;
  color: #000;
}

.srch_btn {
  background: #ccc;
  font-size: 17px;
  border: none;
  cursor: pointer;
  width: auto;
}
/*Quiz design copied */
#assessment-admin-root {
  #main {
    padding-left: 24px;
    padding-right: 24px;
  }
}
#assessments-and-questions-tabs {
  width: 100%;
  margin: 16px 24px;
  & > .tabs {
    align-items: center;
    div {
      min-width: 140px;
      font-family: "Rubik", sans-serif;
      &:first-of-type {
        border-top-left-radius: 8px;
      }
    }
    i {
      visibility: hidden;
    }
    button {
      height: 32px;
      margin-right: 8px;
      padding: 8px;
      line-height: 1;
      background: rgb(19, 192, 71);
    }
  }
}

#assessments-tablayout,
#que-pool-tablayout {
  .tabs {
    padding: 8px;
    background: rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    div {
      min-width: 140px;
      margin-right: 8px;
      padding: 8px;
      border-radius: 8px;
      font-family: "Rubik", sans-serif;
      &.active {
        background: rgb(0, 120, 230);
        color: #fff;
      }
    }
  }
}

#assessments-tablayout {
  .content {
    & > div {
      display: flex;
      flex-direction: row;
      padding: 24px;
      .subject-tag {
        margin-left: 24px;
        padding: 4px 8px;
        background: rgb(4, 146, 23);
        border-radius: 4px;
        font: normal 12px/1 "Rubik";
        color: #fff;
      }
      p {
        margin: 0;
      }
      .spacer {
        padding-right: 24px;
      }

      & > div:last-of-type {
        display: flex;
        flex-direction: column;
        button:first-of-type {
          margin-bottom: 8px;
        }
      }
    }
  }
}
.searchadd-a {
  padding: 16px 32px;
}
.quediv-a {
  padding: 8px;
  margin: 4px;
  background: rgba(0, 0, 0, 0.05);
}
.quedivinner-a {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.small-abutton {
  width: auto;
  margin: 0;
  padding: 4px 12px;
  background: #fff;
  border-radius: 24px;
  color: #7700ff;
  font: normal 1rem/1 "Rubik";
  border: thin solid #7700ff;
}
.small-abutton:hover {
  border-color: #fff;
  background: #7700ff;
  cursor: pointer;
  color: #fff;
}
/*ankit design */
.mbody-a {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 8px 8px;
  border-radius: 8px;
}

.modaltopic-a {
  min-width: 140px;
  padding: 8px;
  border-radius: 8px;
  background: rgba(0, 120, 230, 0.6) !important;
  color: #fff;
  text-align: center;
  &:hover {
    background-color: #7f8c8d !important;
    color: white;
  }
  &.active {
    background-color: rgb(0, 120, 230) !important;
    color: white;
  }
}

.modal-row-a {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 50px;
  padding: 8px;
}
.subtype-a {
  input[type="radio"] {
    height: auto;
    margin: 8px 8px 0px 18px;
    width: 16px;
    height: 16px;
  }
}

.modal-left-right {
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 500px;
  border-radius: 12px;
  padding: 8px;
  background: rgb(217, 232, 251);
  justify-content: flex-start;
}
.modal-left-row1 {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: row;
  padding: 8px 8px;
  background: rgb(30, 150, 255);
  border-radius: 8px;
  color: #fff;

  p,
  label {
    margin: 0;
    line-height: 1;
    font-family: "Rubik", sans-serif;
    font-size: 16px;
  }
  input[type="button"] {
    border-radius: 20px;
    font-family: "Rubik", sans-serif;
    background: #fff;
    padding: 0px 12px;
    height: 32px;
    line-height: 1.5;
    &:hover {
      background: rgb(67, 203, 254);
      color: #fff;
      border: none;
    }
    &.active {
      background-color: rgb(0, 120, 230) !important;
      color: white;
    }
  }
}
.modal-left-row2 {
  padding: 12px 8px;
  font-family: "Rubik", sans-serif;
  span {
    font-size: 16px;
    margin-right: 8px;
  }
  label {
    margin: 0;
    line-height: 1;
    font-family: "Rubik", sans-serif;
    font-size: 16px;
  }
  input[type="radio"] {
    height: auto;
    margin: 0 4px 0 24px;
  }
}
.modal-right-row2 {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  overflow: auto;
  word-break: break-word;
  background: #fff;
  margin-top: 8px;
}
.modal-right-row2 > div {
  padding: 8px;
  width: 100%;
}
.uimage-a {
  font-size: 16px;
  margin-right: 12px;
  font-family: "Rubik", sans-serif;
}
.checkbox-a {
  height: auto;
  margin: 0 16px 0 8px;
  line-height: 1;
  font-family: "Rubik", sans-serif;
  font-size: 16px;
  input {
    height: 16px;
    margin-right: 8px;
    width: 16px;
  }
  label {
    margin: 0px;
  }
}
.input-valid {
  border: thin solid #e74c3c;
}
.ql-editor {
  min-height: 350px !important;
}
</style>
