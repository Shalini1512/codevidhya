<template>
  <div>
    <Header>
      <div class="row mb-0" style="margin-top:10%;">
        <div class="col-xl-9 col-lg-12 col-md-12 d-block mx-6">
          <div class="text-white text-property mb-5">
            <div class="mt-1 ml-2">
              <span
                style="color: #fff;font: normal 3rem/1.5 'Poppins';font-size:38px;font-weight:600; "
                >Enrolled course</span
              >
            </div>
          </div>
        </div>
      </div>
    </Header>
    <!--courses-->
    <section class="sptb ml-2 p-0">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            {{ courseDetails.length ? courseDetails[0].live_course_name : "" }}
          </h3>
        </div>
        <div class="card-body p-6">
          <div class="panel panel-primary">
            <div class="tab-menu-heading">
              <div class="tabs-menu ">
                <!-- Tabs -->
                <ul class="nav panel-tabs">
                  <li class="">
                    <a href="#tab1" class="active" data-toggle="tab"
                      >Schedule</a
                    >
                  </li>
                  <li><a href="#tab2" data-toggle="tab">Content</a></li>
                  <li><a href="#tab3" data-toggle="tab">Projects</a></li>
                  <li><a href="#tab4" data-toggle="tab">Current Status</a></li>
                </ul>
              </div>
            </div>
            <div class="panel-body tabs-menu-body">
              <div class="tab-content">
                <div class="tab-pane active " id="tab1">
                  <div class="row">
                    <div class="col-sm-12 bg-secondary text-white p-2">
                      Next/Upcoming classes
                    </div>
                    <div class="col-sm-12  p-2 m-0">
                      <div class="table-responsive">
                        <table class="table table-bordered border-top mb-0">
                          <thead>
                            <tr>
                              <th>Class</th>
                              <th>Date</th>
                              <th>Time</th>
                              <th>Course Name</th>
                              <th>Teacher Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th>1</th>
                              <td>Colin Carr</td>
                              <td>Accountant</td>
                              <td>colin@gmail.com</td>
                              <td>colin@gmail.com</td>
                            </tr>
                            <tr>
                              <th>2</th>
                              <td>Alison Fraser</td>
                              <td>Content Writer</td>
                              <td>alison@gmail.com</td>
                              <td>alison@gmail.com</td>
                            </tr>
                            <tr>
                              <th>3</th>
                              <td>Lily Ogden</td>
                              <td>Sr.Designer</td>
                              <td>lily@gmail.com</td>
                              <td>lily@gmail.com</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-12 bg-secondary text-white p-2">
                      Completed
                    </div>
                    <div class="col-sm-12  p-2 m-0">
                      <div class="table-responsive">
                        <table class="table table-bordered border-top mb-0">
                          <thead>
                            <tr>
                              <th>Class</th>
                              <th>Date</th>
                              <th>Time</th>
                              <th>Course Name</th>
                              <th>Teacher Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th>1</th>
                              <td>Colin Carr</td>
                              <td>Accountant</td>
                              <td>colin@gmail.com</td>
                              <td>colin@gmail.com</td>
                            </tr>
                            <tr>
                              <th>2</th>
                              <td>Alison Fraser</td>
                              <td>Content Writer</td>
                              <td>alison@gmail.com</td>
                              <td>alison@gmail.com</td>
                            </tr>
                            <tr>
                              <th>3</th>
                              <td>Lily Ogden</td>
                              <td>Sr.Designer</td>
                              <td>lily@gmail.com</td>
                              <td>lily@gmail.com</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tab-pane  " id="tab2">
                  <div class="table-responsive">
                    <table class="table table-bordered border-top mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Title</th>
                          <th>PDF/PPT</th>
                          <th>Assignment</th>
                          <th>Quiz</th>
                        </tr>
                      </thead>
                      <tbody>
                        <template
                          v-for="(topic_name, index) in liveCourseTopics"
                        >
                          <tr :key="index">
                            <th>Class {{ topic_name.session }}</th>
                            <td>{{ topic_name.topic_name }}</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="tab-pane " id="tab3">
                  <p>
                    No Record.
                  </p>
                </div>
                <div class="tab-pane  " id="tab4">
                  <p>
                    No Record.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
    <Loader v-if="processing" />
  </div>
</template>
<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/product-details/HeaderContent.vue";
import Footer from "@/components/footer/Footer.vue";
import SideNav from "@/components/dashboard/SideNavProfile.vue";

import Loader from "@/components/widgets/BlockingLoader.vue";
import axios from "axios";

export default {
  props: ["liveCourseName", "courseId"],
  name: "LiveCourseContent",
  components: {
    Header,
    HeaderContent,
    Footer,
    Loader,
    SideNav
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
        "/live-course/" + this.$router.currentRoute.params.liveCourseName
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
        .post("/api/liveCourse/getCourseDetails", {
          user_id: userId,
          courseSlug: this.liveCourseName
        })
        .then((result) => {
          vm.courseDetails = result.data;
          vm.book_id = vm.courseDetails[0].live_course_id;
          vm.loadAllLessons(vm.book_id);
        });
      axios
        .post("/api/liveCourse/OtherCourses", {
          user_id: userId,
          courseSlug: this.liveCourseName
        })
        .then((ores) => {
          this.other_books = ores.data;
        });
    },
    loadAllLessons(book_id) {
      let vm = this;
      axios
        .post("/api/liveCourse/getCoursesTopics", {
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
          encodeURIComponent(this.courseDetails[0].live_course_slug) +
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
