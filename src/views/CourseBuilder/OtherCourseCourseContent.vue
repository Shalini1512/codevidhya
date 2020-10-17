<template>
  <div>
    <Header>
      <div class="bannerimg">
        <div class="header-text mb-0">
          <div class="container">
            <div class="text-center text-white">
              <h1 class>Course upload</h1>
            </div>
          </div>
        </div>
      </div>
    </Header>
    <div>
      <div class="col-sm-12">
        <span class="p-2" style="background:#33cccc;color:#fff">Schools</span>
        <select class="p-1" id="sch_id">
          <option value="0">--Select School--</option>
          <option
            v-for="(school, index) in schools"
            :key="index"
            v-bind:value="school.sch_id"
            >{{ school.name }}</option
          >
        </select>
        <div class="container-fluid">
          <label class="form-control"
            >Subject:
            <select class="" id="courses" @change="subjectChange">
              <option
                v-for="(course, index) in other_courses"
                :key="index"
                :value="course.book_id"
                >{{ course.book_name }}</option
              >
            </select></label
          >

          <!--Topic start-->

          <span class="p-2" style="background:#33cccc;color:#fff">Topics</span>

          <select class="p-1" id="books_topic" v-on:change="sub_topic()">
            <option value="0">--Select Lesson--</option>
            <option value="new_topic">New Lesson</option>
            <option
              v-for="(topic_name, t_ind) in topics"
              :key="t_ind"
              v-bind:value="topic_name.topic_id"
              >{{ topic_name.topic_name }}</option
            >
          </select>

          <div
            class="container-fluid p-0 m-0"
            id="new_topic"
            style="display:none"
          >
            <div class="col-xs-4 p-0" id="topic_label">
              <label class="sr-only" for="inlineFormInputGroup"
                >Enter Topic</label
              >
              <div class="input-group mb-3 mr-sm-3 mb-sm-0">
                <div
                  class="input-group-addon"
                  style="background:#33cccc;color:#fff"
                >
                  Topic
                </div>
                <input
                  class="form-control"
                  aria-label="Large"
                  aria-describedby="inputGroup-sizing-sm"
                  id="topic"
                  placeholder="Enter Topic"
                />
                <button @click="NewTopic">Save</button>
              </div>
            </div>
          </div>

          <!--Topic End-->
        </div>
        <label
          >Name<input
            class="form-input"
            type="text"
            id="video_name"
            placeholder="video name"
        /></label>
        <label
          >Video upload<input
            class="form-input"
            id="video-chooser-input"
            type="file"
            accept="video/mp4"
            placeholder="choose mp4 video to upload"
        /></label>

        <button
          id="upload-vdo-btn"
          type="button"
          style="margin: 0 8px; padding: 8px; background: #3399ff; color: #fff; border-radius: 4px;"
          @click="upload_video"
        >
          Upload
        </button>
      </div>
      <div class="col-sm-12">
        <label
          >Name<input
            class="form-input"
            type="text"
            id="pdf_name"
            placeholder="file name"
        /></label>
        <label class="forn-control"
          >Upload pdf<input
            class="form-input"
            id="pdf-chooser-input"
            type="file"
            accept=".pdf"
            placeholder="choose pdf for upload"
        /></label>

        <button
          id="upload-vdo-btn"
          type="button"
          style="margin: 0 8px; padding: 8px; background: #3399ff; color: #fff; border-radius: 4px;"
          @click="upload_pdf"
        >
          Upload
        </button>
      </div>
      <!--<button
        type="button"
        class="btn container-fluid"
        data-toggle="modal"
        data-target="#render_video"
      >
        <i
          class="mdi mdi-video"
          data-toggle="tooltip"
          title=""
          data-original-title="mdi-video"
          style="font-size:1.20rem;"
        ></i>
      </button>-->
      <!--video upload-->
      <!-- <div class="modal" id="render_video">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Video Viewer</h4>
              <button type="button" class="close" data-dismiss="modal">
                &times;
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
            
                <input class="" type="text" id="video_url" placeholder="URL" />
                <button
                  type="button"
                  style="margin: 0 4px; padding: 4px; background: #3399ff;color:#fff;border:none; border-radius: 4px;"
                  onclick="showOffscreenModal('video-chooser')"
                >
                  Choose/Upload
                </button>
                <div class="row col-sm-12 mt-2">
                  <div class="col-sm-12">
                    <label class="text-center "
                      >Width
                      <input
                        id="width"
                        type="text"
                        size="6"
                        v-model="v_width"
                        @keyup="propertyHandler($event)"
                    /></label>
                    <label class="text-center mx-1"
                      >Height
                      <input
                        id="height"
                        type="text"
                        size="6"
                        v-model="v_height"
                        @keyup="propertyHandler($event)"
                    /></label>
                  
                  </div>
                  <div class="col-sm-12">
                    <label class="row">Preview</label>
                   
                    <span
                      class="row text-center"
                      id="pvdo"
                      style="border: solid thin #ccc; min-height:100px;min-width:100px;"
                    >
                      <span class="text-center m-2" style="color:#ccc"
                        >Preview</span
                      >
                    </span>
                    
                  </div>
                </div>
              </div>
            </div>
           
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-success"
                v-on:click="addVideoToContent()"
              >
                Add
              </button>
              <button type="button" class="btn btn-danger" data-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>-->
      <!--end video upload-->
      <!--video chooser-->
      <!--<div id="video-chooser" class="offscreen-modal-cv">
        <div class="modal-box-cv">
          <div class="modal-cv-header">
            <h3>Choose Video</h3>
            <i class="flex-filler"></i>
            <a class="modal-cv-close" data-modal-id="video-chooser"
              ><i class="fas fa-times"></i
            ></a>
          </div>
          <div class="modal-cv-content">
            <div
              class=""
              id="image-gallery-wrapper"
              style="height: 100%; overflow-x: hidden; overflow-y: auto"
            >
              <div
                class="col-sm-2 mx-1 my-1 p-0 text-center"
                v-for="(video, ind) in videos"
                :key="ind"
                style="display:inline-block;border:solid thin #ccc;cursor:pointer"
                @click="videoSelected($event)"
              >
                {{ videos }}
               
                <span class="col-sm-12 m-0 p-0">
                  <i class="fas fa-video fa-4x"></i>
                  <p
                    style="text-align:center;color:#000;font-size:12px;overflow:hidden"
                  >
                    {{ video }}
                  </p>
                </span>
              </div>
            </div>
          </div>
          <div class="modal-cv-footer">
            <input
              id="video-chooser-input"
              type="file"
              accept="video/mp4,video/ogg,video/webm"
              style="padding: 8px; border-radius: 4px;"
            />
            <i class="flex-filler"></i>
            <button
              id="upload-vdo-btn"
              type="button"
              style="margin: 0 8px; padding: 8px; background: #3399ff; color: #fff; border-radius: 4px;"
              @click="upload_video"
            >
              Upload
            </button>
          </div>
        </div>
      </div>-->
      <!--end video chooser-->
    </div>

    <div class="sptb bg-white mb-0">
      <Footer />
    </div>
    <Loader v-if="processing" />
  </div>
</template>

<script>
import moment from "vue-moment";
import Header from "@/components/header/HeaderMenuForAdmin.vue";
import Footer from "@/components/footer/Footer.vue";
import Loader from "@/components/widgets/BlockingLoader.vue";
import axios from "axios";
export default {
  name: "OtherCourseContent",

  components: {
    Header,
    Footer,
    Loader
  },
  data: function() {
    return {
      userId: 0,
      courseName: "",
      videos: [],
      other_courses: [],
      topic_id: "",
      topics: [],
      processing: false,
      schools: []
    };
  },
  mounted() {
    this.getAllContent();
  },
  methods: {
    subjectChange() {
      let sub_id = $("#courses").val();
      this.gettopics(sub_id);
    },
    gettopics(book_id) {
      this.processing = true;
      let vm = this;
      axios
        .post("/api/user/getOtherCourseSubTopics", { book_id: book_id,sch_id })
        .then(res => {
          vm.topics = res.data;
          vm.processing = false;
        });
    },
    getAllContent() {
      let vm = this;
      axios.get("/api/user/getLmsVideos").then(res => {
        vm.videos = res.data;
      });
      axios.post("/api/user/getSchools").then(res => {
        vm.schools = res.data;
      });
      axios.get("/api/user/getLCourses").then(res => {
        vm.other_courses = res.data;
        let book_id = vm.other_courses[0].book_id;
        vm.gettopics(book_id);
      });
    },
    upload_pdf: async function() {
      let sch_id = $("#sch_id").val();
      if (sch_id == 0) {
        cvNotify("Choose your school", "error");
        return false;
      }
      let vm = this;
      var formData = new FormData();
      var files = $("#pdf-chooser-input")[0].files[0];

      if (!files) {
        window.cvNotify("Choose File before upload.");
        return;
      }
      let Name = $("#pdf_name").val();
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

      axios.post("/api/user/uploadOtherLmsPdf", formData, config).then(res => {
        this.uploadpdfData(files, sch_id);
      });
    },
    uploadpdfData(file, sch_id) {
      this.processing = true;
      let contentName = file.name;
      let type = file.type;
      let pageName = $("#pdf_name").val();
      let book_id = $("#courses").val();
      let topic_id = $("#books_topic").val();
      let vm = this;
      axios
        .post("/api/user/uploadOtherLmsCont", {
          book_id: book_id,
          pageName: pageName,
          content: contentName,
          type: type,
          contentType: "document",
          topic_id: topic_id,
          sch_id: sch_id
        })
        .then(res => {
          window.cvNotify("successfully uploaded", "success");
          this.processing = false;
        });
    },
    uploadData(file, sch_id) {
      this.processing = true;
      let contentName = file.name;
      let type = file.type;
      let pageName = $("#video_name").val();
      let book_id = $("#courses").val();
      let topic_id = $("#books_topic").val();
      let vm = this;
      axios
        .post("/api/user/uploadOtherLmsCont", {
          book_id: book_id,
          pageName: pageName,
          content: contentName,
          type: type,
          contentType: "video",
          topic_id: topic_id,
          sch_id: sch_id
        })
        .then(res => {
          window.cvNotify("successfully uploaded", "success");
          vm.processing = false;
        });
    },
    upload_video: async function() {
      let vm = this;
      let sch_id = $("#sch_id").val();
      if (sch_id == 0) {
        cvNotify("Choose your school", "error");
        return false;
      }
      var formData = new FormData();
      var files = $("#video-chooser-input")[0].files[0];

      if (!files) {
        window.cvNotify("Choose File before upload.", "error");
        return;
      }
      let Name = $("#video_name").val();
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
        .then(res => {
          this.uploadData(files, sch_id);
        });
    },
    /****Chapter */
    NewTopic: function() {
      let sch_id = $("#sch_id").val();
      if (sch_id == 0) {
        cvNotify("Choose your school", "error");
        return false;
      }
      let book_id = $("#courses").val();
      let title_name = $("#topic").val();
      let vm = this;
      vm.NewTopic = true;
      axios
        .post("api/user/insertOtherCourseTopic", {
          book_id: book_id,
          topic: title_name,
          sch_id: sch_id
        })
        .then(res => {
          this.topics = res.data;
          this.gettopics(book_id);
          document.getElementById("new_topic").style.display = "none";
          document.getElementById("sub_topics").style.display = "block";
        });
    },
    sub_topic: function() {
      var topic_id = document.getElementById("books_topic").value;
      if (topic_id == "new_topic") {
        document.getElementById("new_topic").style.display = "block";
        document.getElementById("sub_topics").style.display = "none";
      } else if (topic_id == 0) {
        document.getElementById("new_topic").style.display = "none";
        document.getElementById("sub_topics").style.display = "block";
      }
    }
    /***End chapter */
  }
};
</script>
