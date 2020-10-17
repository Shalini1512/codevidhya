<template>
  <div id="video-root" class="d-flex flex-column">
    <Header></Header>
    <div
      id="container"
      class="d-flex flex-column flex-grow-1"
      style="margin-top:59px;"
    >
      <div
        id="inner-header"
        class="d-flex flex-row align-items-center justify-content-end  px-4"
      >
        <button
          class="cv-button square borderless mr-2"
          @click="
            $router.push({
              name: 'learn-more',
              params: {
                curName: courseName,
                bookId: book_id,
                book_per: 0,
                tab: 'curriculum'
              }
            })
          "
        >
          <i class="fas fa-chevron-left" />
        </button>
        <h3
          class="flex-grow-1"
          v-if="topic_names.length && sub_topic_list.length"
        >
          {{ topic_names.length ? topic_names[0].book_name : "" }} - -{{
            chapterName
          }}
          - {{ topicName }}
        </h3>
      </div>
      <div
        class="d-flex flex-row flex-grow-1 flex-shrink-1"
        style="min-height:0;"
      >
        <div id="sidebarr">
          <div
            class="tab-content border-left border-right p-2 bg-white details-tab-content"
          >
            <div class="tab-pane active" id="tab-2">
              <!--faq section-->
              <div class="panel-group1" id="accordion2">
                <!--accordian start-->

                <!--  <label v-if="topic_names.length && sub_topic_list.length"
                  ><h4>Topics</h4></label
                >-->
                <div
                  v-if="!(topic_names.length && sub_topic_list.length)"
                  class="text-center m-4"
                >
                  No Content has been uploaded.
                </div>
                <template v-else>
                  <div
                    class="panel panel-default mb-4 border p-0"
                    v-for="(topic_name, index) in topic_names"
                    :key="index"
                    :data-set="(sub_index = 1)"
                  >
                    <div class="panel-heading1">
                      <h4 class="panel-title1">
                        <a
                          class="accordion-toggle collapsed p-3"
                          data-toggle="collapse"
                          data-parent="#accordion2"
                          :id="'courseTopics' + (index + 1)"
                          :href="'#collapse1' + (index + 1)"
                          aria-expanded="false"
                          :style="
                            [true ? 'background:#7700ff;' : ''] + 'color:#fff'
                          "
                        >
                          <span class style="display:flex;">
                            <span
                              class="col-7 col-md-9"
                              style="color: #fff"
                              v-html="
                                index + 1 + '.&nbsp;' + topic_name.topic_name
                              "
                            ></span>
                          </span>
                        </a>
                      </h4>
                    </div>
                    <template v-for="(sub_topic, index1) in sub_topic_list">
                      <div
                        v-bind:key="index1"
                        :id="'collapse1' + (index + 1)"
                        :class="
                          'panel-collapse collapse cursor-pointer active text-danger ' +
                            [index == 0 ? ' show ' : '']
                        "
                        role="tabpanel"
                        aria-expanded="false"
                        v-if="sub_topic.topic_id == topic_name.topic_id"
                        @click="subtopicLoad(index1, index)"
                      >
                        <div
                          :class="
                            'panel-title1 border-bottom  col-sm-12 pl-2 cursor-pointer ' +
                              [index1 == 0 ? 'border-top' : '']
                          "
                        >
                          <div
                            class="col-sm-12"
                            style="display:flex;align-items:center"
                          >
                            <a
                              v-if="index1 == 0"
                              :id="'subtopcombo' + (index1 + 1)"
                              class="subtopcombo accordion-toggle collapsed cursor-pointer col-10 p-2"
                              style="font-size:12px;cursor:pointer;color:#ec296b"
                              v-html="
                                '<i  class=\'subtpp fa fa-pause-circle\'></i>' +
                                  '&nbsp;<span>' +
                                  sub_topic.name +
                                  '</span>'
                              "
                            ></a>
                            <a
                              v-else
                              :id="'subtopcombo' + (index1 + 1)"
                              class="subtopcombo accordion-toggle collapsed cursor-pointer col-10 p-2"
                              style="font-size:12px;cursor:pointer"
                              v-html="
                                '<i class=\'subtpp fa fa-play-circle\'></i>' +
                                  '&nbsp;<span>' +
                                  sub_topic.name +
                                  '</span>'
                              "
                            ></a>
                            <div class="col-sm-2">
                              <i
                                v-if="sub_topic.status"
                                class="fas fa-check-circle lesson-topics-list-done"
                              ></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </template>
              </div>
              <!--end faq section-->
            </div>
          </div>
        </div>

        <div
          id="video-container"
          class="d-flex flex-row align-items-center justify-content-center flex-grow-1"
        >
          <video
            class="video-responsive br-3"
            vspace="0"
            hspace="0"
            controls="controls"
            controlslist="nodownload"
            id="video"
          ></video>
        </div>
      </div>
    </div>

    <!-- Large Modal -->
    <Loader v-if="processing" />
    <!-- modal -->
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
//import Header from "@/components/header/HeaderMenuOnly.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/product-details/HeaderContent.vue";
import Footer from "@/components/footer/Footer.vue";
import axios from "axios";
import CourseDescription from "@/components/product-details/CourseDescription.vue";
import html2canvas from "html2canvas";
import Loader from "@/components/widgets/BlockingLoader.vue";
export default {
  name: "CourseVideos",
  /*props: ["curName", "topicId", "btopicId", "book_per"],*/
  props: ["courseName"],
  components: {
    Header,
    HeaderContent,
    Footer,
    CourseDescription,
    Loader
  },
  data() {
    return {
      vidoes: "",
      sub_topic_list: [],
      sub_topic_status: 0,
      topic_names: [],
      book_id: 0,
      book: "",
      slug: "",
      user_id: "",
      sub_topic_img: '<i class="fa fa-play-circle"></i> ',
      serverTime: "",
      type: "video/mp4",
      src: "",
      topicName: "video",
      chapterName: "",
      processing: true
    };
  },
  created() {
    this.slug = this.curName;
  },
  beforeMount() {
    hideTawk();
    this.getServerTime();
  },
  mounted() {
    $(".clear-rating").hide();
    cvAuth.getUserId(
      function(userId) {
        this.userId = userId;
        this.cls_id = this.$store.getters.getAuthData.auth_cls_id;
        this.slug = this.courseName;
        this.loadBooksTopics(userId);
      }.bind(this)
    );
    if (document.querySelector("video").playing) {
      // Do anything you want to
      // console.log("play");
    }
  },
  updated() {
    $(".clear-rating").hide();
    $(".lesson-review-item-rating").rating({
      displayOnly: false,
      theme: "krajee-fas",
      showCaption: false
    });
    if (document.querySelector("video").playing) {
      // Do anything you want to
      // console.log("play");
    }
  },
  beforeDestroy() {
    showTawk();
  },
  methods: {
    subtopicLoad(index, key) {
      this.processing = true;
      this.type = this.sub_topic_list[index].type;

      $(".subtopcombo").css("color", "#2e384d");

      $(".subtpp")
        .addClass("fa-play-circle")
        .removeClass("fa-pause-circle");
      $("#subtopcombo" + (index + 1)).css("color", "#ec296b");
      $($($("#subtopcombo" + (index + 1))[0].children)[0])
        .addClass("fa-pause-circle")
        .removeClass("fa-play-circle");
      var video = document.getElementById("video");
      video.innerHTML = "";
      var source = document.createElement("source");
      this.src =
        "/resources/other_course_video/" + this.sub_topic_list[index].content;
      source.setAttribute("src", this.src);
      video.appendChild(source);
      video.play();
      let vm = this;
      setTimeout(function() {
        video.pause();

        source.setAttribute("src", vm.src);

        video.load();
        video.play();
      }, 1000);
      this.topicName = this.sub_topic_list[index].name;
      this.chapterName = this.topic_names[key].topic_name;
      this.processing = false;
    },
    subtopicLoadFirst(index) {
      this.processing = true;
      this.type = this.sub_topic_list[index].type;
      var video = document.getElementById("video");
      video.innerHTML = "";
      var source = document.createElement("source");
      this.src =
        "/resources/other_course_video/" + this.sub_topic_list[index].content;
      source.setAttribute("src", this.src);
      video.appendChild(source);
      video.play();
      let vm = this;
      setTimeout(function() {
        video.pause();

        source.setAttribute("src", vm.src);

        video.load();
        video.play();
      }, 1000);
      this.topicName = this.sub_topic_list[index].name;
      this.processing = false;
    },
    loadBooksTopics: function(userId) {
      let vm = this;

      axios
        .post("/api/user/DisplayOtherTopics", {
          slug: this.slug,
          user_id: userId
        })
        .then(res => {
          vm.topic_names = res.data;
          if(!vm.topic_names.length)
          {
             vm.processing = false;
          }
          vm.chapterName = vm.topic_names[0].topic_name;
          if (vm.topic_names.length) {
            $("#collapse11").collapse("show");
            vm.book_id = vm.topic_names[0].book_id;
            axios
              .post("/api/user/DisplayAllOVSubTopics", {
                slug: this.slug,
                user_id: userId
              })
              .then(res => {
                this.sub_topic_list = res.data;
                if (this.sub_topic_list.length) {
                  this.topicName = this.sub_topic_list[0].name;
                  this.subtopicLoadFirst(0);
                  if (this.userId == 0) {
                    this.sub_topic_status = 0;
                  }
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            vm.processing = false;
          }
        });
    },
    getServerTime: function() {
      this.$http.post("/api/user/getServerTime").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.serverTime = res.body.serverTime;
        }
      });
    },

    getvideos() {
      let vm = this;
      axios.get("/api/user/getOtherLmsVideos").then(res => {
        vm.videos = res.data;
      });
    },
    videoFunction(e) {
      if (e.target.className.includes("fe-play-circle")) {
        e.target.className = "fe fe-pause-circle text-white class-icon";
        document.getElementById("video").play();
      } else {
        e.target.className = "fe fe-play-circle text-white class-icon";
        document.getElementById("video").pause();
      }
    }
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
#video-root {
  position: fixed;
  width: 100%;
  height: 100%;
  #container {
    min-height: 0;
    #inner-header {
      flex-shrink: 0;
      height: 56px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      button {
        border: none;
      }
    }

    #sidebarr {
      flex-shrink: 0;
      width: 300px;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      overflow-y: auto;
    }

    #video-container {
      min-width: 0;
      min-height: 0;
      video {
        width: 100%;
        max-height: 100%;
      }
    }
  }
}
</style>
