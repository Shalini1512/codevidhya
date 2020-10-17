<template>
  <div id="notes-root" class="d-flex flex-column">
    <Header></Header>
    <div
      id="container"
      class="d-flex flex-column flex-grow-1"
      style="margin-top:57px;"
    >
      <div
        id="inner-header"
        class="d-flex flex-row align-items-center justify-content-end px-4"
      >
        <button
          class="cv-button square borderless mr-2"
          @click="
            $router.push({
              name: 'learn-more',
              params: {
                curName: courseName,
                bookId: topic_names.length ? topic_names[0].book_id : 0,
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
          {{ topicName }}
        </h3>
       <!-- <p v-if="topic_names.length && sub_topic_list.length">
          Page <span id="page_num"></span> / <span id="page_count"></span>
        </p>
        <button
          v-if="topic_names.length && sub_topic_list.length"
          class="cv-button square mx-2"
          id="prev"
          @click="onPrevPage"
        >
          <i class="fas fa-chevron-left" />
        </button>
        <button
          v-if="topic_names.length && sub_topic_list.length"
          class="cv-button square mx-2"
          id="next"
          @click="onNextPage"
        >
          <i class="fas fa-chevron-right" />
        </button>-->
      </div>
      <div
        class="d-flex flex-row flex-grow-1 flex-shrink-1"
        style="min-height: 0;"
      >
        <div id="sidebarr" class="flex-grow-1">
          <div
            class="tab-content border-left border-right p-2 bg-white details-tab-content"
          >
            <div class="tab-pane active" id="tab-2">
              <div class="panel-group1" id="accordion2">
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
                        :id="'tab' + (index + 1)"
                        :href="'#collapse1' + (index + 1)"
                        aria-expanded="false"
                        :style="
                          [true ? 'background:#7700ff;' : ''] + 'color:#fff'
                        "
                      >
                        <span class style="display:flex;">
                          <span
                            class="col-7 col-md-9"
                            style="color: #fff;font: normal 1rem/1 'Poppins'"
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
                        'panel-collapse collapse cursor-pointer active text-danger' +
                          [index == 0 ? ' show ' : '']
                      "
                      role="tabpanel"
                      aria-expanded="false"
                      v-if="sub_topic.topic_id == topic_name.topic_id"
                      @click="subtopicLoad(index1)"
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
                            style="font-size:12px;cursor:pointer;color:#ec296b;font: .8rem / 1 Poppins"
                            v-html="
                              '<i class=\'fas fa-file\'></i>' +
                                '&nbsp;<span>' +
                                sub_topic.name +
                                '</span>'
                            "
                          ></a>
                          <a
                            v-else
                            :id="'subtopcombo' + (index1 + 1)"
                            class="subtopcombo accordion-toggle collapsed cursor-pointer col-10 p-2"
                            style="font-size:12px;cursor:pointer; font: .8rem / 1 Poppins"
                            v-html="
                              '<i class=\'fas fa-file\'></i>' +
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
              </div>
            </div>
          </div>
        </div>

        <div id="pdf-container" class="flex-grow-1">
          <embed  id="the-canvas"
          :src="url"
            class=""
            :style="
              'overflow:auto;position:relative;height:100%; width:100%; display: ' +
                (topic_names.length && sub_topic_list.length ? 'block' : 'none')"/>
          <!--<canvas
            id="the-canvas"
            class=""
            :style="
              'overflow:auto; display: ' +
                (topic_names.length && sub_topic_list.length ? 'block' : 'none')
            "
          ></canvas>-->

          <div
            v-if="!topic_names.length && !sub_topic_list.length"
            class="text-center m-4"
          >
            No Content has been uploaded.
          </div>
        </div>
      </div>
    </div>

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
import Loader from "@/components/widgets/BlockingLoader.vue";
import Footer from "@/components/footer/Footer.vue";
import axios from "axios";

export default {
  name: "CourseNotes",
  /*props: ["curName", "topicId", "btopicId", "book_per"],*/
  props: ["courseName"],
  components: {
    Header,
    HeaderContent,
    Footer,
    Loader
  },
  data() {
    return {
      vidoes: "",
      sub_topic_list: [],
      sub_topic_status: 0,
      topic_names: [],
      book_id: "",
      book: "",
      slug: "",
      user_id: "",
      sub_topic_img: '<i class="fas fa-file-powerpoint"></i>',
      serverTime: "",
      type: "video/mp4",
      url: "/resources/other_course_pdf/sample.pdf#toolbar=0",
      topicName: "document",
      pageRendering: false,
      pageNumPending: null,
      pdfDoc: null,
      scale: 1.8,
      pageNum: 1,
      canvas: "",
      ctx: "",
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
   beforeDestroy() {
    showTawk();
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
    subtopicLoad(index) {
      
       this.processing=true;
       this.url ="/resources/other_course_pdf/" + this.sub_topic_list[index].content+"#toolbar=0";
       var game=document.getElementById("the-canvas");
       var clone=game.cloneNode(true);
        clone.setAttribute('src',this.url);
        game.parentNode.replaceChild(clone,game)
       this.processing = false;

     /* let vm = this;
      vm.pageNum = 1;
      vm.canvas = "";
      vm.processing = true;
      vm.pdfDoc = null;
      vm.padeNumPending = null;
      vm.pageRendering = false;
      vm.ctx = "";
      this.type = this.sub_topic_list[index].type;
      $(".subtopcombo").css("color", "#2e384d");
      $("#subtopcombo" + (index + 1)).css("color", "#ec296b");
      this.url =
        "/resources/other_course_pdf/" + this.sub_topic_list[index].content;
      this.topicName = this.sub_topic_list[index].name;
      var pdfjsLib = window["pdfjs-dist/build/pdf"];
      // The workerSrc property shall be specified.
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://mozilla.github.io/pdf.js/build/pdf.worker.js";

      this.canvas = document.getElementById("the-canvas");

      this.ctx = this.canvas.getContext("2d");

      pdfjsLib.getDocument(this.url).promise.then(function(pdfDoc_) {
        vm.pdfDoc = pdfDoc_;
        document.getElementById("page_count").textContent = vm.pdfDoc.numPages;
        if (vm.pdfDoc.numPages == 1) {
          $("#prev").hide();
          $("#next").hide();
        }

        // Initial/first page rendering
        vm.renderPage(vm.pageNum);
      });*/
    },
    renderPage(num) {
      let vm = this;
      this.pageRendering = true;
      if (num == 1) {
        $("#prev").hide();
      } else {
        $("#prev").show();
      }
      if (this.pageNum >= this.pdfDoc.numPages) {
        $("#next").hide();
      } else {
        $("#next").show();
      }
      
      // Using promise to fetch the page
      this.pdfDoc.getPage(num).then(function(page) {
        var viewport = page.getViewport({ scale: vm.scale });
        vm.canvas.height = viewport.height;
        vm.canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: vm.ctx,
          viewport: viewport
        };
        var renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(function() {
          vm.pageRendering = false;
          if (vm.pageNumPending !== null) {
            // New page rendering is pending
            this.renderPage(vm.pageNumPending);
            vm.pageNumPending = null;
          }
        });
      });

      // Update page counters
      document.getElementById("page_num").textContent = num;
      vm.processing = false;
    },
    queueRenderPage(num) {
      if (this.pageRendering) {
        this.pageNumPending = num;
      } else {
        this.renderPage(num);
      }
    },
    onPrevPage() {
      if (this.pageNum <= 1) {
        return;
      }

      this.pageNum--;
      this.queueRenderPage(this.pageNum);
    },
    onNextPage() {
      if (this.pageNum >= this.pdfDoc.numPages) {
        $("#next").hide();
      } else {
        $("#next").show();
      }
      if (this.pageNum >= this.pdfDoc.numPages) {
        return;
      }

      this.pageNum++;
      this.queueRenderPage(this.pageNum);
    },
    loadBooksTopics: function(userId) {
      let vm = this;

      axios
        .post("/api/user/DisplayDOtherTopics", {
          slug: this.slug,
          user_id: userId
        })
        .then(res => {
          vm.topic_names = res.data;
             if(!vm.topic_names.length)
          {
             vm.processing = false;
          }
          // vm.book_id = vm.topic_names[0].book_id;
          if (vm.topic_names.length) {
              let vm = this;  
            axios
              .post("/api/user/DisplayAllOFSubTopics", {
                slug: vm.slug,
                user_id: userId
              })
              .then(res => {
                vm.sub_topic_list = res.data;
                if (vm.sub_topic_list.length) {
                  vm.topicName = this.sub_topic_list[0].name;
                  this.url ="/resources/other_course_pdf/" + this.sub_topic_list[0].content+"#toolbar=0"; 
                //  vm.subtopicLoad(0);

                  if (vm.userId == 0) {
                    vm.sub_topic_status = 0;
                  }
                } else {
                  vm.processing = false;
                }
                vm.processing = false;
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
    }
  }
};
</script>
<style lang="scss" scoped>
#quiz-editor-sidebar {
  flex-grow: 1;
  height: 30%;
  padding: 2px 2px 0px 2px;
  padding-left: 0;
  & > div {
    position: fixed;
    overflow-y: auto;
    height: 80%;
    width: 25%;
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 1px;
    border-radius: 8px;
  }
  #quiz-editor-add-question {
    width: 100%;
    position: absolute;
    right: 0;
    bottom: 6%;
  }
}
#quiz-editor-mainbar {
  flex-grow: 1;
  height: 30%;
  padding: 24px 24px 16px 24px;
  padding-left: 0;
  & > div {
    position: fixed;
    height: 80%;
    overflow-y: auto;
    padding: 2px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
}
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

#notes-root {
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

    #pdf-container {
      overflow: auto;
    }
  }
}
</style>
