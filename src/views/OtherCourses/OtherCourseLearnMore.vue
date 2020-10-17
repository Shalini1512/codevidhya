  <template>
  <div>
    <Header>
      <HeaderContent
        :tot_topic="'0'"
        :tot_sub_topic="'0'"
        :tot_per="'0'"
        :level="osCourseDetail.length ? osCourseDetail[0].level : ''"
        :purchases_status="'1'"
        :sch_id="osCourseDetail.length ? osCourseDetail[0].sch_id : ''"
        :product_id="osCourseDetail.length ? osCourseDetail[0].product_id : ''"
        :book_name="osCourseDetail.length ? osCourseDetail[0].book_name : ''"
        :book_slug="osCourseDetail.length ? osCourseDetail[0].book_slug : ''"
        :price="'0'"
        :prod_info="''"
        :prod_type="''"
        :sub_topic_status="''"
        :age_group="''"
        @backButton="switchOtherCourses"
      />
    </Header>

    <section class="sptb">
      <!--<div class=" m col-xl-12 col-lg-12 col-md-12 curdor-pointer">
        <button class="btn btn-primary" @click="switchOtherCourses()">
          Back
        </button>
      </div>-->
      <div class="container-fluid">
        <div class="row">
          <div class="col-xl-12 col-lg-12 col-md-12">
            <div class="border-0 mb-5">
              <div class="wideget-user-tab wideget-user-tab3">
                <div class="tab-menu-heading">
                  <div class="tabs-menu1">
                    <ul class="nav">
                      <li class>
                        <a
                          href="#tab-1"
                          class="active"
                          id="overview"
                          data-toggle="tab"
                          >Overview</a
                        >
                      </li>
                      <li>
                        <a href="#tab-2" data-toggle="tab" id="cur" class
                          >Curriculum</a
                        >
                      </li>
                      <li>
                        <a href="#tab-5" data-toggle="tab" id="qa" class>Q&A</a>
                      </li>
                      <li v-if="roleId == 2 && otherCourseType == 1">
                        <a href="#tab-6" data-toggle="tab" id="upload"
                          >Upload</a
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div
                class="tab-content border-left border-right p-5 bg-white details-tab-content"
              >
                <div class="tab-pane active" id="tab-1">
                  <CourseDescription
                    :course_slug="
                      osCourseDetail.length ? osCourseDetail[0].book_slug : ''
                    "
                    :desc="
                      osCourseDetail.length
                        ? osCourseDetail[0].description
                          ? osCourseDetail[0].description
                          : ''
                        : ''
                    "
                    :cover_topics="
                      osCourseDetail.length
                        ? osCourseDetail[0].learn
                          ? osCourseDetail[0].learn
                          : ''
                        : ''
                    "
                    :prerequisite="
                      osCourseDetail.length
                        ? osCourseDetail[0].prerequisite
                          ? osCourseDetail[0].prerequisite
                          : ''
                        : ''
                    "
                  />
                </div>

                <div class="tab-pane row " id="tab-6">
                  <div class="row">
                    <div class="form-group col-xl-4">
                      <label class="form-label text-dark">Lesson</label>
                      <select
                        class="form-control"
                        id="lesson"
                        v-on:change="sub_topic()"
                      >
                        <option value="0">--Select Lesson--</option>
                        <option value="new_topic">New Lesson</option>
                        <option
                          v-for="(topic_name, t_ind) in topics"
                          :key="t_ind"
                          v-bind:value="topic_name.topic_id"
                          >{{ topic_name.topic_name }}</option
                        > </select
                      ><i
                        v-if="!newLessonShow"
                        class="fa fa-edit"
                        style="position:absolute;right:6%;cursor:pointer;bottom:22%;"
                        @click="topicModification"
                      ></i>
                      <i
                        v-if="!newLessonShow"
                        class="fas fa-trash-alt"
                        style="position:absolute;right:12%;cursor:pointer;bottom:22%;"
                        @click="topicMDelete"
                      ></i>
                    </div>
                    <div class="form-group col-xl-4" v-if="newTopic">
                      <label class="form-label text-dark">New Lesson</label>
                      <input
                        class="form-control"
                        id="newTopicName"
                        placeholder="Lesson Name"
                        v-model="NewLesson"
                      /><i
                        class="fas fa-save"
                        style="position:absolute;right:6%;cursor:pointer;bottom:22%;"
                        @click="insertNewTopic"
                      ></i>
                    </div>
                    <div class="form-group col-xl-4" v-if="topicView">
                      <label class="form-label text-dark">Topic</label>
                      <select
                        class="form-control"
                        id="topic"
                        v-on:change="sub_stopic()"
                      >
                        <option value="0">--Select Lesson--</option>
                        <option value="new_stopic">New Topic</option>
                        <option
                          v-for="(subtopic_name, t_ind) in subTopics"
                          :key="t_ind"
                          v-bind:value="subtopic_name.other_course_content_id"
                          ><span class="row"
                            ><span class="col-7">{{ subtopic_name.name }}</span>
                          </span></option
                        > </select
                      ><i
                        v-if="!newTopicShow"
                        class="fa fa-edit"
                        style="position:absolute;right:6%;cursor:pointer;bottom:28%;"
                      ></i>
                    </div>
                    <!--upload-->
                    <div class="col-xl-12 row" v-if="newSTopic">
                      <div class="form-group col-xl-4" v-if="true">
                        <label class="form-label text-dark">New Lesson</label>
                        <input
                          class="form-control"
                          id="nuwSubTopic"
                          placeholder="Topic Name"
                          v-model="topicName"
                        />
                        <i
                          class="fas fa-save"
                          v-if="newSNTopic"
                          style="position:absolute;right:6%;cursor:pointer;bottom:22%;"
                          @click="sSubTopicUpdate"
                        ></i>
                        <i
                          v-if="newSNTopic"
                          class="fas fa-trash-alt"
                          style="position:absolute;right:12%;cursor:pointer;bottom:22%;"
                          @click="sdeleteSubTopic"
                        ></i>
                      </div>
                      <div class="form-group col-xl-4" v-if="!newSNTopic">
                        <label class="form-label text-dark">Content Type</label>
                        <select
                          class="form-control"
                          id="Contenttype"
                          v-on:change="ContentChange"
                        >
                          <option
                            value="video"
                            :selected="video ? true : false"
                          >
                            Video</option
                          >
                          <option value="document">Notes</option>
                        </select>
                      </div>
                      <div
                        class="form-group col-xl-4"
                        v-if="!newSNTopic && video"
                      >
                        <label class="form-label text-dark">Video Upload</label>
                        <div class="file-field big">
                          <label
                            class="btn btn-default"
                            id="fileU"
                            @change="AddedFun"
                          >
                            <i class="fas fa-cloud-upload-alt fa-2x"></i>
                            <input
                              type="file"
                              accept="video/mp4"
                              class="video-upload"
                              hidden
                            />
                            <input
                              id="video-text"
                              name="upload_cont_img"
                              type="text"
                              readonly
                            />
                          </label>
                        </div>
                      </div>
                      <div
                        class="form-group col-xl-4"
                        v-if="!newSNTopic && !video"
                      >
                        <label class="form-label text-dark"
                          >Document Upload</label
                        >
                        <div class="file-field big">
                          <label
                            class="btn btn-default"
                            id="fileU"
                            @change="AddedFun1"
                          >
                            <i class="fas fa-cloud-upload-alt fa-2x"></i>
                            <input
                              type="file"
                              accept="application/pdf"
                              class="doc-upload"
                              hidden
                            />
                            <input
                              id="doc-text"
                              name="upload_cont_img"
                              type="text"
                            />
                          </label>
                        </div>
                      </div>
                      <div
                        class="form-group col-xl-12 text-center"
                        v-if="!newSNTopic"
                      >
                        <button
                          class="btn btn-primary"
                          @click="uploadNewTopic()"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                    <!--end upload-->
                  </div>
                </div>
                <div class="tab-pane" id="tab-2">
                  <!--faq section-->
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="card ">
                        <div class="card-body">
                          <div class="support">
                            <div class="row text-white">
                              <div
                                class="col-xl-4 col-lg-12 col-md-12 border-right cursor-pointer"
                                @click="resource('videos')"
                              >
                                <div class="support-service bg-primary">
                                  <i class="fas fa-film"></i>
                                  <h6 class="mt-2">Videos</h6>
                                  <P></P>
                                </div>
                              </div>
                              <div
                                class="col-xl-4 col-lg-12 col-md-12 border-right cursor-pointer"
                                @click="resource('ppt')"
                              >
                                <div class="support-service bg-success">
                                  <i class="fas fa-file-powerpoint"></i>
                                  <h6 class="mt-2">PDF/Notes</h6>
                                  <p></p>
                                </div>
                              </div>
                              <div
                                class="col-xl-4 col-lg-12 col-md-12 cursor-pointer"
                                @click="resource('assessments')"
                              >
                                <div class="support-service bg-danger">
                                  <i class="far fa-edit"></i>
                                  <h6 class="mt-2">Assessments</h6>
                                  <p></p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--end faq section-->
                </div>

                <!--Assessments-->
                <div class="tab-pane" id="tab-5">
                  <!--faq section-->
                  <!--Comments-->
                  <div class="card">
                    <div class="card-header">
                      <h3 class="card-title col-sm-6">Q&A</h3>
                      <a
                        class="col-sm-6 text-right cursor-pointer"
                        data-toggle="modal"
                        data-target="#QuestionModal"
                        style="cursor:pointer"
                        ><u>Ask Question</u></a
                      >
                    </div>

                    <div class="card-body p-0">
                      <template v-for="(question, index) in onlyQuestions">
                        <div class="media mt-0 p-5" :key="index">
                          <div class="d-flex mr-3">
                            <a href="#"
                              ><img
                                class="media-object brround"
                                alt="64x64"
                                src="/assets/images/users/user.svg"
                              />
                            </a>
                          </div>
                          <div class="media-body">
                            <h4 class="mt-0 mb-1 font-weight-bold">
                              {{ question.name }}
                            </h4>
                            <small class="text-muted"
                              ><i class="fa fa-calendar"></i>
                              {{ question.date }}
                              <i class="ml-3 fa fa-user"></i>{{ question.role }}
                              <i class=" ml-3 far fa-edit"></i>
                              {{ question.question_topic }}</small
                            >
                            <h3>{{ question.question_title }}</h3>
                            <p class="font-13  mb-2 mt-2">
                              {{ question.question_description }}
                            </p>
                            <a
                              v-if="roleId != 3"
                              data-toggle="modal"
                              :data-target="'#AnswerModal' + (index + 1)"
                              style="cursor:pointer"
                              class="mr-2"
                              ><span class="badge badge-primary"
                                >Answer</span
                              ></a
                            >
                            <template v-for="(ans, subIndex) in onlyResponse">
                              <div
                                class="media mt-5"
                                :key="subIndex"
                                v-if="
                                  ans.response_qa_id ==
                                    onlyQuestions[index].qa_id
                                "
                              >
                                <div class="d-flex mr-3">
                                  <a href="#">
                                    <img
                                      class="media-object brround"
                                      alt="64x64"
                                      src="/assets/images/users/user.svg"
                                    />
                                  </a>
                                </div>
                                <div class="media-body">
                                  <h4 class="mt-0 mb-1 font-weight-bold">
                                    {{ ans.name }}
                                    <span
                                      class="fs-14 ml-0"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="verified"
                                      ><i
                                        class="fa fa-check-circle-o text-success"
                                      ></i
                                    ></span>
                                  </h4>
                                  <small class="text-muted"
                                    ><i class="fa fa-calendar"></i>
                                    {{ ans.date }}
                                    <i class="ml-3 fa fa-user"></i
                                    >{{ ans.role }}
                                    <i class=" ml-3 far fa-edit"></i>
                                    {{ ans.question_topic }}</small
                                  >
                                  <h3>{{ ans.question_title }}</h3>
                                  <p class="font-13  mb-2 mt-2">
                                    {{ ans.question_description }}
                                  </p>
                                  <!--<a
                                    href=""
                                    data-toggle="modal"
                                    data-target="#Comment"
                                    ><span class="badge badge-default"
                                      >Comment</span
                                    ></a
                                  >-->
                                </div>
                              </div>
                            </template>
                          </div>
                          <!-- Large Modal -->
                          <div
                            :id="'AnswerModal' + (index + 1)"
                            class="modal fade"
                          >
                            <div class="modal-dialog modal-lg" role="document">
                              <div class="modal-content ">
                                <div class="modal-header pd-x-20">
                                  <h3 class="modal-title">Answer</h3>
                                  <button
                                    type="button"
                                    class="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                  >
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                                </div>
                                <div class="modal-body pd-20">
                                  <div class="card mb-lg-0">
                                    <div class="card-body">
                                      <div>
                                        <div class="form-group">
                                          <input
                                            type="text"
                                            class="form-control"
                                            :id="'ans_topic'+(index+1)"
                                            :value="question.question_topic"
                                            placeholder="Question Topic"
                                          />
                                        </div>
                                        <div class="form-group">
                                          <input
                                            type="text"
                                            class="form-control"
                                            :id="'ans_title'+(index+1)"
                                            :value="question.question_title"
                                            placeholder="Title"
                                          />
                                        </div>
                                        <div class="form-group">
                                          <textarea
                                            class="content2 form-control"
                                            :id="'ans_desc'+(index+1)"
                                            name="example"
                                            rows="6"
                                            placeholder="Description"
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <!-- modal-body -->
                                <div class="modal-footer">
                                  <button
                                    type="button"
                                    class="btn btn-primary"
                                    @click="
                                      PostResponse(question.qa_id, index + 1)
                                    "
                                  >
                                    Post
                                  </button>
                                  <button
                                    type="button"
                                    class="btn btn-secondary"
                                    data-dismiss="modal"
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <!-- modal-dialog -->
                        </div>
                      </template>
                    </div>
                  </div>
                  <!--/Comments-->
                  <!--end faq section-->
                </div>
                <!--end Assessment-->
                <!--certificate Tab started-->
              </div>
              <!--buy and share course-->

              <!--End buy and share course-->
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--/Section-->
    <!-- Large Modal -->
    <div id="QuestionModal" class="modal fade">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content ">
          <div class="modal-header pd-x-20">
            <h3 class="modal-title">Ask Question</h3>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body pd-20">
            <div class="card mb-lg-0">
              <div class="card-body">
                <div>
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control"
                      id="que_topic"
                      placeholder="Question Topic"
                    />
                  </div>
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control"
                      id="question_title"
                      placeholder="Title"
                    />
                  </div>
                  <div class="form-group">
                    <textarea
                      class="content2 form-control"
                      id="que_desc"
                      name="example"
                      rows="6"
                      placeholder="Description"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- modal-body -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="PostQuestion()"
            >
              Post
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      <!-- modal-dialog -->
    </div>
    <!-- modal -->

    <!-- small Modal -->
    <div id="topicModification" class="modal fade">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h6 class="tx-14 mg-b-0 tx-uppercase tx-inverse tx-bold">
              Topic Modification
            </h6>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <label for="recipient-name" class="form-control-label"
              >Topic Name</label
            >
            <input type="text" class="form-control" id="topicMName" />
          </div>
          <!-- modal-body -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="topicNameUpdate"
            >
              Update
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <!-- modal-dialog -->
    </div>
    <!-- modal -->
    <Footer />
    <Loader v-if="processing" />
    <component
      :is="'link'"
      href="/assets/bootstrap-star-rating/css/star-rating.min.css"
      media="all"
      rel="stylesheet"
      type="text/css"
    />
    <component
      :is="'link'"
      href="/assets/bootstrap-star-rating/themes/krajee-fa/theme.min.css"
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
      src="/assets/bootstrap-star-rating/themes/krajee-fa/theme.min.js"
      type="text/javascript"
    />
   
    <component
      :is="'script'"
      src="/assets/plugins/wysiwyag/jquery.richtext.js"
      type="text/javasctipt"
    />
    <component
      :is="'script'"
      src="/assets/js/formeditor.js"
      type="text/javasctipt"
    />
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/OtherCourse/HeaderContent.vue";
import Footer from "@/components/footer/Footer.vue";
import axios from "axios";
import CourseDescription from "@/components/product-details/CourseDescription.vue";
import html2canvas from "html2canvas";
import Loader from "@/components/widgets/BlockingLoader.vue";
export default {
  name: "learn-more",
  props: ["curName", "topicId", "btopicId", "book_per", "tab"],
  components: {
    Header,
    HeaderContent,
    Footer,
    CourseDescription,
    Loader
  },
  data() {
    return {
      topic_names: [],
      osCourseDetail: [],
      book_id: "",
      book: "",
      slug: "",
      sub_topic_list: [],
      sub_topic_status: 0,
      user_id: "",
      view_more: 1,
      sub_index: 1,
      desc: "",
      cover_topics: "",
      prerequisite: "",
      userId: 0,
      assessments: "",
      current_assessment: "",
      sub_topic_img:
        '<img class="sub_topics_image" src="/assets/images/course/subtopic-icon.png"/>',
      other_books: "",
      course_cover_img: "",
      review_all: "",
      user_rating: 0,
      user_feed_back: "",
      button_editable: 0,
      precious_part: 0,
      serverTime: "",
      cls_id: "",
      sch_course: 1,
      processing: false,
      roleId: "",
      questions: [],
      onlyQuestions: [],
      onlyResponse: [],
      topics: [],
      subTopics: [],
      sch_id: 0,
      topicView: 0,
      NewLesson: "",
      newLessonShow: 1,
      newTopic: 0,
      newTopicShow: 1,
      newSTopic: 0,
      newSNTopic: 0,
      topicName: "",
      LessonName: "",
      video: 1,
      otherCourseType: 0
    };
  },
  created() {
    this.slug = this.curName;
  },

  mounted() {
    $(".clear-rating").hide();
    cvAuth.getUserId(
      function(userId) {
        this.userId = userId;
        this.cls_id = this.$store.getters.getAuthData.auth_cls_id;
        this.roleId = this.$store.getters.getAuthData.auth_role_id;
        this.sch_id = this.$store.getters.getAuthData.auth_sch_id;

        this.loadBooksTopics(userId);
      //  this.loadTopics(userId);
      }.bind(this)
    );
  },
  updated() {
    $(".clear-rating").hide();
    $(".lesson-review-item-rating").rating({
      displayOnly: false,
      theme: "krajee-fas",
      showCaption: false
    });
  },

  methods: {
    uploadNewTopic() {
      if (this.video == 1) {
        let vm = this;
        var formData = new FormData();
        var files = $(".video-upload")[0].files[0];
        if (!files) {
          window.cvNotify("Choose File before upload.", "error");
          return;
        }
        let Name = $("#nuwSubTopic").val();
        if (!Name) {
          window.cvNotify("Please enter video name", "error");
          return;
        }
        this.processing = true;
        formData.append("file", files);
        let config = {
          header: {
            "Content-Type": "multipart/form-data"
          }
        };
        axios
          .post("/api/user/uploadOtherLmsVideo", formData, config)
          .then((res) => {
            this.uploadData(files);
          });
      } else {
        let vm = this;
        var formData = new FormData();
        var files = $(".doc-upload")[0].files[0];
        if (!files) {
          window.cvNotify("Choose File before upload.", "error");
          return;
        }
        let Name = $("#nuwSubTopic").val();
        if (!Name) {
          window.cvNotify("Please enter file name", "error");
          return;
        }
        this.processing = true;
        formData.append("file", files);
        let config = {
          header: {
            "Content-Type": "multipart/form-data"
          }
        };
        axios
          .post("/api/user/uploadOtherLmsPdf", formData, config)
          .then((res) => {
            this.uploadpdfData(files);
          });
      }
    },
    uploadpdfData(file) {
      this.processing = true;
      let contentName = file.name;
      let type = file.type;
      let pageName = $("#nuwSubTopic").val();
      let book_id = this.book_id;
      let topic_id = $("#lesson").val();
      let vm = this;
      axios
        .post("/api/user/uploadUOtherLmsCont", {
          book_id: book_id,
          pageName: pageName,
          content: contentName,
          type: type,
          user_id: this.userId,
          contentType: "document",
          topic_id: topic_id,
          sch_id: this.sch_id
        })
        .then((res) => {
          window.cvNotify("successfully uploaded", "success");
          vm.newSTopic = 0;
          vm.newSNTopic = 1;
          document.getElementById("topic").selectedIndex = "0";
          vm.newTopic = 0;
          vm.topicView = 0;
          vm.newLessonShow = 1;
          vm.video = 1;
          document.getElementById("lesson").selectedIndex = "0";
          vm.processing = false;
        });
    },
    uploadData(file) {
      this.processing = true;
      let contentName = file.name;
      let type = file.type;
      let pageName = $("#nuwSubTopic").val();
      let book_id = this.book_id;
      let topic_id = $("#lesson").val();
      let vm = this;
      axios
        .post("/api/user/uploadUOtherLmsCont", {
          book_id: book_id,
          pageName: pageName,
          content: contentName,
          type: type,
          user_id: this.userId,
          contentType: "video",
          topic_id: topic_id,
          sch_id: this.sch_id
        })
        .then((res) => {
          window.cvNotify("successfully uploaded", "success");
          vm.newSTopic = 0;
          vm.newSNTopic = 1;
          document.getElementById("topic").selectedIndex = "0";
          vm.newTopic = 0;
          vm.topicView = 0;
          vm.newLessonShow = 1;
          vm.video = 1;
          document.getElementById("lesson").selectedIndex = "0";
          vm.processing = false;
        });
    },
    ContentChange() {
      let contentType = $("#Contenttype").val();
      if (contentType == "video") {
        this.video = 1;
      } else {
        this.video = 0;
      }
    },
    insertNewTopic() {
      let topic_name = $("#newTopicName").val();
      axios
        .post("/api/user/InsertCNewTopic", {
          user_id: this.userId,
          sch_id: this.sch_id,
          book_id: this.book_id,
          topic_name: topic_name
        })
        .then((res) => {
          cvNotify("Successfully inserted");
          this.loadAllLessons(this.book_id);
          this.newTopic = 0;
          this.topicView = 0;
          this.newLessonShow = 1;
          vm.video = 1;
          document.getElementById("lesson").selectedIndex = "0";
        });
    },
    topicNameUpdate() {
      var topic_id = document.getElementById("lesson").value;
      var name = document.getElementById("topicMName").value;
      axios
        .post("/api/user/UpdateUTopic", {
          topic_id: topic_id,
          topic_name: name
        })
        .then((data) => {
          cvNotify("Successfully updated");
          $("#topicModification").modal("hide");
          this.loadAllLessons(this.book_id);
          this.newTopic = 0;
          this.topicView = 0;
          this.newLessonShow = 1;
          vm.video = 1;
          document.getElementById("lesson").selectedIndex = "0";
        });
    },

    sSubTopicUpdate() {
      var other_course_content_id = document.getElementById("topic").value;
      var name = document.getElementById("nuwSubTopic").value;
      let vm = this;
      vm.newSTopic = 0;
      vm.newSNTopic = 1;
      document.getElementById("topic").selectedIndex = "0";
      vm.newTopic = 0;
      vm.topicView = 0;
      vm.newLessonShow = 1;
      vm.video = 1;
      document.getElementById("lesson").selectedIndex = "0";
      axios
        .post("/api/user/UpdateUSTopic", {
          other_course_content_id: other_course_content_id,
          topic_name: name
        })
        .then((data) => {
          cvNotify("Successfully updated");
          vm.newSTopic = 0;

          this.loadAllLessons(this.book_id);
        });
    },
    topicMDelete() {
      var ans = confirm("Are you want to delete");
      if (ans) {
        var topic_id = document.getElementById("lesson").value;
        axios
          .post("/api/user/DeleteMTopic", { topic_id: topic_id })
          .then((res) => {
            cvNotify("Successfully deleted");
            this.newTopic = 0;
            this.topicView = 0;
            this.newLessonShow = 1;
            vm.video = 1;
            document.getElementById("lesson").selectedIndex = "0";
            this.loadAllLessons(this.book_id);
          });
      }
    },
    sdeleteSubTopic() {
      let vm = this;
      var ans = confirm("Are you want to delete");
      if (ans) {
        var other_course_content_id = document.getElementById("topic").value;
        axios
          .post("/api/user/DeleteMSTopic", {
            other_course_content_id: other_course_content_id
          })
          .then((res) => {
            cvNotify("Successfully deleted");
            vm.newSTopic = 0;
            vm.newSNTopic = 1;
            document.getElementById("topic").selectedIndex = 1;
            vm.newTopic = 0;
            vm.topicView = 0;
            vm.newLessonShow = 1;
            vm.video = 1;
            document.getElementById("lesson").selectedIndex = 1;
            this.loadAllLessons(this.book_id);
          });
      }
    },
    topicModification() {
      var topic_id = document.getElementById("lesson").value;

      this.LessonName = this.topics.filter(
        (x) => x.topic_id == topic_id
      )[0].topic_name;
      $("#topicMName").val(this.LessonName);
      $("#topicModification").modal("show");
    },
    AddedFun() {
      let filename = $(".video-upload")[0].files[0].name;
      $("#video-text").val(filename);
    },
    AddedFun1() {
      let filename = $(".doc-upload")[0].files[0].name;
      $("#doc-text").val(filename);
    },
    sub_stopic() {
      var stopic_id = document.getElementById("topic").value;
      if (stopic_id == 0) {
        this.newSTopic = 0;
        this.newSNTopic = 1;
        this.video = 1;
      } else if (stopic_id == "new_stopic") {
        $("#nuwSubTopic").val("");
        this.topicName = "";
        this.newSTopic = 1;
        this.newSNTopic = 0;
        this.video = 1;
      } else {
        this.newSTopic = 1;
        this.newSNTopic = 1;
        this.video = 1;
        this.topicName = this.subTopics.filter(
          (x) => x.other_course_content_id == stopic_id
        )[0].name;
      }
    },
    sub_topic: function() {
      var topic_id = document.getElementById("lesson").value;
      if (topic_id == "new_topic") {
        this.newTopic = 1;
        this.newLessonShow = 0;
        this.topicView = 0;
        this.video = 1;
      } else if (topic_id == 0) {
        this.newTopic = 0;
        this.topicView = 0;
        this.newLessonShow = 1;
        this.video = 1;
      } else {
        this.newTopic = 0;
        this.topicView = 0;
        this.newLessonShow = 0;
        this.video = 1;

        axios
          .post("/api/user/getThisCourseSubTopics", {
            topic_id: topic_id,
            sch_id: this.sch_id
          })
          .then((result) => {
            this.topicView = 1;
            this.subTopics = result.data;
          });
      }
    },
    resource(productName) {
      let resName = "";
      if (productName == "videos") {
        resName = "/course/" + this.curName + "/videos/";
      } else if (productName == "assessments") {
        resName =
          "/course/" + this.curName + "/assessments/?id=" + this.book_id;
      } else if (productName == "ppt") {
        resName = "/course/" + this.curName + "/notes/?id=" + this.book_id;
      }
      if (this.userId) {
        this.$router.push(resName);
      } else {
        this.$router.push(
          "/login?redirect=" + encodeURIComponent(window.location.href)
        );
        return;
      }
    },
    PostResponse(questionId, index) {
     
      if (!this.userId) {
        $("#AnswerModal" + index).modal("hide");
        this.$router.push(
          "/login?redirect=" + encodeURIComponent(window.location.href)
        );
        return;
      } else {
        let que_topic = $("#ans_topic"+index).val();
        let question_title = $("#ans_title"+index).val();
        let question_desc = $("#ans_desc"+index).val();
      
        axios
          .post("/api/user/InsertQRQuestion", {
            qa_id: questionId,
            user_id: this.userId,
            book_id: this.book_id,
            question_topic: que_topic,
            question_title: question_title,
            question_description: question_desc
          })
          .then((res) => {
            cvNotify("Successfully post!");
            $("#AnswerModal" + index).modal("hide");
            this.getAllQA(this.book_id);
          });
      }
    },
    PostQuestion() {
      if (!this.userId) {
        $("#QuestionModal").modal("hide");
        this.$router.push(
          "/login?redirect=" + encodeURIComponent(window.location.href)
        );

        return;
      } else {
        let que_topic = $("#que_topic").val();
        let question_title = $("#question_title").val();
        let question_desc = $("#que_desc").val();

        axios
          .post("/api/user/InsertQAQuestion", {
            user_id: this.userId,
            book_id: this.book_id,
            question_topic: que_topic,
            question_title: question_title,
            question_description: question_desc
          })
          .then((res) => {
            cvNotify("Successfully post!");
            $("#QuestionModal").modal("hide");
            this.getAllQA(this.book_id);
          });
      }
    },
    switchOtherCourses() {
      if (this.roleId == 2) {
        this.$router.push({
          name: "teacherdashboard",
          params: { openOtherCourse: 1 }
        });
      } else if (this.roleId == 3) {
        this.$router.push({
          name: "studentdashboard",
          params: { openOtherCourse: 1 }
        });
      }
    },
    getAllQA(bookID) {
      axios
        .post("/api/user/getOtherCourseAskedQuestions", {
          book_id: bookID
        })
        .then((res) => {
          this.questions = res.data;
          this.onlyQuestions = this.questions.filter(
            (x) => x.response_qa_id == 0
          );
          this.onlyResponse = this.questions.filter(
            (x) => x.response_qa_id !== 0
          );
        });
    },
    loadAllLessons(book_id) {
      let vm = this;
      axios
        .post("/api/user/getCourseAccess", { sch_id: vm.sch_id })
        .then((dat) => {
        //  console.log(dat);
          vm.otherCourseType = dat.data[0].other_subject_course_available;
        });
      axios
        .post("/api/user/getCourseAllTopics", {
          bookId: book_id,
          sch_id: vm.sch_id
        })
        .then((data) => {
          vm.topics = data.data;
        });
    },
    loadBooksTopics: function(userId) {
      this.sch_course = 1;
      let vm = this;

      axios
        .post("/api/user/getOSCourseDetails", { slug: this.slug })
        .then((res) => {
          this.osCourseDetail = res.data;
          this.book_id = this.osCourseDetail.length
            ? this.osCourseDetail[0].book_id
            : 0;

          if (this.tab == "question-and-answer") {
            $("#qa").click();
          } else if (this.tab == "learn-more") {
            $("#overview").click();
          } else {
            $("#cur").click();
          }
          this.getAllQA(this.book_id);
          this.loadAllLessons(this.book_id);
        })
        .catch((err) => {
          console.log("err");
        });
    }
  }
};
</script>
<style>
.filled-stars {
  color: #ffa22b !important;
}
.disabled {
  opacity: 0.5;
}
.lesson-topics-list-done {
  font-size: 1rem;
  background: #efefef;
  border-radius: 8px;
  color: #0bb46e;
  background: none;
  padding: 4px;
}
.sub_topics_image {
  width: 16px;
  height: 16px;
  margin-right: 16px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  opacity: 0.4;
}
</style>
