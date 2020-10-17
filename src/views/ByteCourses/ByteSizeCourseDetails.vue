<template>
  <div>
    <Header>
      <div class="row mb-0" style="margin-top:10%;">
        <div class="col-xl-9 col-lg-12 col-md-12 d-block mx-6">
          <div class="text-white text-property mb-5">
            <div class="ml-2">
              <span
                style="color: hsla(0,0%,100%,.8);font: normal 1rem/1 'Poppins';font-size:20px;font-weight: 600;"
                >{{
                  courseDetails.length ? courseDetails[0].course_theme : ""
                }}</span
              >
            </div>
            <div class="mt-1 ml-2">
              <span
                style="color: #fff;font: normal 3rem/1.5 'Poppins';font-size:38px;font-weight:600; "
                >{{
                  courseDetails.length ? courseDetails[0].live_course_name : ""
                }}</span
              >
            </div>
            <div class="mt-1 ml-2" style="display:flex;flex-direction:row">
              <div
                class="flex-grow-1"
                style="color: #fff;font: normal 1rem/1 'Poppins'"
              >
                <span class="mr-2" style="color: hsla(0,0%,100%,.8);"
                  >Grade:<span class="ml-1" style="color: #fff"
                    >{{
                      courseDetails.length
                        ? courseDetails[0].grade.split(",")[0]
                        : ""
                    }}-{{
                      courseDetails.length
                        ? courseDetails[0].grade.split(/[, ]+/).pop()
                        : ""
                    }}</span
                  ></span
                >
                <span class="mx-2" style="color: hsla(0,0%,100%,.8);"
                  >Age:<span class="ml-1" style="color: #fff">{{
                    courseDetails.length ? courseDetails[0].age_group : ""
                  }}</span></span
                >
                <span class="mx-2" style="color: hsla(0,0%,100%,.8);"
                  >Duration <i class="fas fa-clock"></i> :<span
                    class="ml-1"
                    style="color: #fff"
                    >{{
                      courseDetails.length ? courseDetails[0].duration : ""
                    }}
                    Hours</span
                  ></span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </Header>
    <!--courses-->
    <section class="sptb ml-2 p-0">
      <div class="row m-0 p-0 mt-2">
        <div class="row flex-grow-1">
          <div class="col-xl-8 col-lg-8 col-md-12 flex-grow-1">
            <div class="card overflow-hidden m-0">
              <div class="ribbon ribbon-top-right text-danger">
                <span class="bg-danger">Trending</span>
              </div>
              <div class="card-body">
                <div class="item-det mb-4">
                  <a href="#" class="text-dark">
                    <h3>
                      {{
                        courseDetails.length
                          ? courseDetails[0].live_course_outcomes
                          : ""
                      }}
                    </h3>
                  </a>
                  <div class="d-flex">
                    <ul class="d-flex mb-0"></ul>
                  </div>
                </div>
                <div class="product-slider">
                  <!--<ul class="list-unstyled video-list-thumbs">-->
                  <ul class="list-unstyled video-list-thumbs">
                    <li class="mb-0">
                      <a
                        data-toggle="modal"
                        data-target="#homeVideo"
                        class="class-video p-0 text-center"
                      >
                        <img
                          :src="
                            courseDetails.length
                              ? courseDetails[0].img
                                ? ' /assets/images/png/courses/' +
                                  courseDetails[0].img
                                : ' /assets/images/png/courses/web.svg'
                              : ' /assets/images/png/courses/web.svg'
                          "
                          alt="img"
                          class="img-responsive br-3 "
                          width="400"
                        />
                        <span
                          class="fe fe-play-circle text-white class-icon"
                        ></span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <!--course details-->
            <div
              class="border-0 bg-white"
              v-if="
                courseDetails.length
                  ? liveCourseTopics.length
                    ? true
                    : false
                  : false
              "
            >
              <div class="wideget-user-tab wideget-user-tab3">
                <div class="tab-menu-heading">
                  <div class="tabs-menu1">
                    <ul class="nav">
                      <li class>
                        <a
                          href="#tab-1"
                          id="overview"
                          class="active"
                          data-toggle="tab"
                          >Overview</a
                        >
                      </li>
                      <li>
                        <a href="#tab-2" data-toggle="tab" id="cur" class
                          >Curriculum</a
                        >
                      </li>
                      <!--<li v-if="trainer==1">
                        <a href="#tab-3" data-toggle="tab" class>Upload</a>
                      </li>-->
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <!--courses details-->
            <div
              class="tab-content border-left border-right p-5 bg-white details-tab-content"
            >
              <div class="tab-pane active" id="tab-1">
                <div>
                  <h3
                    class="card-title mb-3 font-weight-bold"
                    style="font: normal 1rem/1 'Poppins'"
                  >
                    Course Summary
                  </h3>
                  <p class="text-body p-body">
                    {{
                      courseDetails.length
                        ? courseDetails[0].byte_course_outcomes
                        : ""
                    }}
                  </p>
                  <h3
                    class="card-title mb-3 font-weight-bold"
                    style="font: normal 1rem/1 'Poppins'"
                  >
                    Topics Covered
                  </h3>
                  <p class="text-body p-body">
                    In this Course you will learn Following Topics.
                  </p>
                  <ul
                    class="list"
                    v-if="
                      courseDetails.length
                        ? courseDetails[0].byte_course_id == 1
                          ? true
                          : false
                        : false
                    "
                  >
                    <li>Intro to Web Development</li>
                    <li>Basics of HTML</li>
                    <li>Basics of CSS</li>
                    <li>Basics of JS</li>
                    <li>Design Best Practices</li>
                    <li>HTML, CSS & JavaScript based website</li>
                    <li>Hosting & SEO Guidelines</li>
                  </ul>

                  <p class="text-body p-body">
                    At the end of the course, you will be building some cool
                    projects to apply your skills.
                  </p>
                </div>
              </div>
              <div class="tab-pane" id="tab-2">
                <div class="panel-group1" id="accordion2">
                  <div
                    class="panel panel-default mb-4 border p-0"
                    v-for="(topic_name, index) in liveCourseTopics"
                    :key="index"
                    @click="switchtopicsVideo(topic_name, index + 1)"
                  >
                    <div class="panel-heading1">
                      <h4 class="panel-title1">
                        <a
                          class="accordion-toggle collapsed p-3"
                          data-toggle="collapse"
                          data-parent="accordion2"
                          :href="'#collapse' + (index + 1)"
                          aria-expanded="false"
                          :style="'color:#4b5d73'"
                        >
                          <span class style="display:flex;">
                            <span
                              class="col-7 col-md-9"
                              style="color: #2e384d"
                              v-html="
                                index + 1 + '.&nbsp;' + topic_name.topic_name
                              "
                            ></span>

                            <!--<span
                                style="color: #2e384d"
                                v-html="'Duration&nbsp;<i class=\'fas fa-clock\'></i>: ' + topic_name.time_in_minutes+' minutes'"
                              ></span>-->
                          </span>
                        </a>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane" id="tab-3">
                <div class="row">
                  <div class="form-group col-xl-4">
                    <label class="form-label text-dark">Session</label>
                    <select
                      class="form-control"
                      id="lesson"
                      v-on:change="sub_topic()"
                    >
                      <option value="0">--Select Lesson--</option>
                      <option value="new_topic">New Lesson</option>
                      <option
                        v-for="(topic_name, t_ind) in liveCourseTopics"
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
                        v-bind:value="subtopic_name.live_course_content_id"
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
                        <option value="video" :selected="video ? true : false">
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
                      <button class="btn btn-primary" @click="uploadNewTopic()">
                        Upload
                      </button>
                    </div>
                  </div>
                  <!--end upload-->
                </div>
              </div>
            </div>
            <!--end courses details-->
            <!--end course details-->
          </div>
          <!--right side content-->
          <div class="col-xl-4 col-lg-4 col-md-12">
            <div class="card m-0">
              <div
                class="card-body"
                v-if="
                  courseDetails.length
                    ? courseDetails[0].purchases_status || trainer
                      ? true
                      : false
                    : false
                "
              >
                <div class>
                  <button
                    class="btn btn-info btn-lg btn-block"
                    @click="switchtopicsVideo(liveCourseTopics[0], 1)"
                  >
                    Start Learnig
                  </button>
                </div>
              </div>
              <div class="card-body" v-else>
                <!-- <div class="text-center mb-2" style="font:'Poppins'">
                  <span class="text-dark font-weight-semibold h1"
                    >Course Price
                    {{
                      courseDetails.length ? courseDetails[0].course_price : ""
                    }}</span
                  >
                </div>-->
                <div class>
                  <button
                    class="btn btn-primary btn-lg btn-block text-white"
                    @click="switchtopicsVideo(liveCourseTopics[0], 1)"
                  >
                    Start Learning
                  </button>
                </div>
              </div>
            </div>
            <!--other course details-->
            <div class="card" v-if="other_books && other_books.length">
              <div class="card-header">
                <h3 class="card-title">Other Byte Size Courses</h3>
              </div>
              <div class="card-body">
                <div class="rated-products">
                  <ul class="vertical-scroll">
                    <template v-for="(other_book, index) in other_books">
                      <li
                        class="item"
                        v-bind:key="index"
                        @click="
                          change_course(
                            other_book.live_course_slug,
                            other_book.live_course_id
                          )
                        "
                      >
                        <div class="media m-0 mt-0 p-5">
                          <img
                            class="mr-4"
                            :src="
                              other_book.img
                                ? '/assets/images/png/courses/' + other_book.img
                                : '/assets/images/png/courses/web.svg'
                            "
                            alt="img"
                          />
                          <div class="media-body">
                            <h4 class="mt-2 mb-1">
                              {{ other_book.live_course_name }}
                            </h4>
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
                                      (other_book.avg_rating
                                        ? other_book.avg_rating * 20
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
                            <div
                              class="h5 mb-0 font-weight-semibold mt-1"
                              v-html="
                                other_book.duration
                                  ? ` <i class='fas fa-clock'></i><span class='text-dark ml-1
                                  '>Duration:</span><span class='ml-1'>` +
                                    other_book.duration +
                                    ' Hours</span>'
                                  : '0'
                              "
                            ></div>
                          </div>
                        </div>
                      </li>
                    </template>
                  </ul>
                </div>
              </div>
            </div>
            <!--end other courser-->
          </div>
          <!--end right side content-->
        </div>
      </div>
    </section>
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
    <!--end courses-->
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
  </div>
</template>
<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/product-details/HeaderContent.vue";
import Footer from "@/components/footer/Footer.vue";
import Loader from "@/components/widgets/BlockingLoader.vue";
import axios from "axios";

export default {
  props: ["ByteCourseName", "bookId", "tab"],
  name: "ByteCourseDetail",
  components: {
    Header,
    HeaderContent,
    Footer,
    Loader
  },
  data() {
    return {
      slug: "",
      user_id: "",
      cls_id: "",
      book_id: "",
      topic_names: [],
      courseDetails: [],
      other_books: [],
      liveCourseTopics: [],
      trainer: 0,
      topics: [],
      subTopics: [],
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
      otherCourseType: 0,
      processing: false
    };
  },
  created() {
    this.slug = this.curName;
  },
  beforeMount() {},
  mounted() {
    if (this.$router.currentRoute.path.indexOf("live-courses") !== -1) {
      this.$router.push(
        "/live-course/" + this.$router.currentRoute.params.ByteCourseName
      );
    }

    $(".clear-rating").hide();
    cvAuth.getUserId(
      function(userId) {
        this.userId = userId;
        this.cls_id = this.$store.getters.getAuthData.auth_cls_id;
        this.trainer = this.$store.getters.getAuthData.trainer;
        this.getCourseDetails(userId);
      }.bind(this)
    );
  },
  methods: {
    /***new upload Functions */
    switchtopicsVideo(topicName, index) {
      if (!this.userId) {
        this.$router.push(
          "/login?redirect=" + encodeURIComponent(window.location.href)
        );
      } else {
        this.$router.push({
          name: "ByteCourVideos",
          params: {
            ByteCourseName: this.ByteCourseName,
            topicSlug: topicName.topic_slug
          }
        });
      }
    },
    insertNewTopic() {
      let topic_name = $("#newTopicName").val();
      let vm = this;
      axios
        .post("/api/liveCourse/InsertCNewTopic", {
          user_id: this.userId,
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
          (x) => x.live_course_content_id == stopic_id
        )[0].name;
      }
    },
    sSubTopicUpdate() {
      var live_course_content_id = document.getElementById("topic").value;
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
        .post("/api/liveCourse/UpdateUSTopic", {
          live_course_content_id: live_course_content_id,
          topic_name: name
        })
        .then((data) => {
          cvNotify("Successfully updated");
          vm.newSTopic = 0;

          this.loadAllLessons(this.book_id);
        });
    },
    sdeleteSubTopic() {
      let vm = this;
      var ans = confirm("Are you want to delete");
      if (ans) {
        var live_course_content_id = document.getElementById("topic").value;
        axios
          .post("/api/liveCourse/DeleteMSTopic", {
            live_course_content_id: live_course_content_id
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

    ContentChange() {
      let contentType = $("#Contenttype").val();
      if (contentType == "video") {
        this.video = 1;
      } else {
        this.video = 0;
      }
    },
    AddedFun() {
      let filename = $(".video-upload")[0].files[0].name;
      $("#video-text").val(filename);
    },
    AddedFun1() {
      let filename = $(".doc-upload")[0].files[0].name;
      $("#doc-text").val(filename);
    },
    topicMDelete() {
      let vm = this;
      var ans = confirm("Are you want to delete");
      if (ans) {
        var topic_id = document.getElementById("lesson").value;
        axios
          .post("/api/liveCourse/DeleteMTopic", { topic_id: topic_id })
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
          .post("/api/liveCourse/getThisCourseSubTopics", {
            topic_id: topic_id
          })
          .then((result) => {
            this.topicView = 1;
            this.subTopics = result.data;
          });
      }
    },
    topicModification() {
      var topic_id = document.getElementById("lesson").value;
      this.LessonName = this.liveCourseTopics.filter(
        (x) => x.topic_id == topic_id
      )[0].topic_name;
      $("#topicMName").val(this.LessonName);
      $("#topicModification").modal("show");
    },
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
          .post("/api/liveCourse/uploadOtherLmsVideo", formData, config)
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
          .post("/api/liveCourse/uploadOtherLmsPdf", formData, config)
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
        .post("/api/liveCourse/uploadUOtherLmsCont", {
          book_id: book_id,
          pageName: pageName,
          content: contentName,
          type: type,
          user_id: this.userId,
          contentType: "document",
          topic_id: topic_id
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
        .post("/api/liveCourse/uploadUOtherLmsCont", {
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
    topicNameUpdate() {
      let vm = this;
      var topic_id = document.getElementById("lesson").value;
      var name = document.getElementById("topicMName").value;
      axios
        .post("/api/liveCourse/UpdateUTopic", {
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

    /***end new upload Functions */
    getCourseDetails(userId) {
      let vm = this;

      axios
        .post("/api/liveCourse/getByteCourseDetails", {
          user_id: userId,
          courseSlug: this.ByteCourseName
        })
        .then((result) => {
          vm.courseDetails = result.data;

          vm.book_id = vm.courseDetails[0].byte_course_id;
          vm.loadAllLessons(vm.book_id);
        });
      axios
        .post("/api/liveCourse/OtherbyteCourses", {
          user_id: userId,
          courseSlug: this.ByteCourseName
        })
        .then((ores) => {
          this.other_books = ores.data;
        });
      if (this.tab == "learn-more") {
        $("#overview").click();
      } else {
        $("#cur").click();
      }
    },
    loadAllLessons(book_id) {
      let vm = this;
      axios
        .post("/api/liveCourse/getByteCoursesTopics", {
          user_id: this.userId,
          live_course_id: book_id
        })
        .then((resp) => {
          vm.liveCourseTopics = resp.data;
        });
    },
    payment_gateway: function() {
      this.$router.push(
        "/checkout?product_name=" +
          encodeURIComponent(this.courseDetails[0].byte_course_slug) +
          "&id=" +
          encodeURIComponent(this.courseDetails[0].product_id) +
          "&type=" +
          encodeURIComponent(this.courseDetails[0].product_type)
      );
    },
    change_course: function(curName, bookId) {
      /* this.$router.push({
        name: "LiveCourseDetail",
        params: { curName: curName, bookId: bookId }
      });*/
    }
  },
  updated() {
    $(".clear-rating").hide();
    $(".lesson-review-item-rating").rating({
      displayOnly: false,
      theme: "krajee-fas",
      showCaption: false
    });
  }
};
</script>
<style lang="scss" scoped>
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
.panel-heading1::after {
  content: "" !important;
}
.panel-heading1::before {
  content: "" !important;
}
.tabs-menu1 ul li .active {
  border: 1px solid #ec296b;
  color: #ec296b;
  border-radius: 3px;
}
.tabs-menu1 ul li a {
  border-radius: 3px;
  background: #fff !important;
}
.accordion-toggle::before {
  content: "" !important;
}
</style>
