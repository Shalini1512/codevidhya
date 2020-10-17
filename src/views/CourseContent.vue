<template>
  <div id="course-content-root">
    <!--onmousedown="return false;"    onselectstart="return false;"-->
    <Header> </Header>
    <!-- User-All-->
    <section class="sptb mt-4">
      <div class="container" id="bar-fixed" v-if="topicName != 'assessment'">
        <div class="row">
          <div class="col-lg-12 users-list">
            <div class="card">
              <div class="card-header" id="backRow">
                <a
                  class="btn btn-pink px-4 text-white"
                  @click="
                    $router.push({
                      name: 'course-details',
                      params: {
                        curName: curName,
                        bookId: book_id,
                        btopicId: topic_id
                      }
                    })
                  "
                  ><i class="fas fas fa-arrow-left"></i> Back</a
                >
                <h3 class="card-title pl-5">
                  {{ book_pages.length ? book_pages[0].topic_name : "" }}
                </h3>
              </div>
              <div class="card-body p-6">
                <div id="privacy-tablayout" class="tab_wrapper second_tab">
                  <ul class="tab_list" id="lms-topic-list">
                    <template v-for="(book_page, ind) in book_pages">
                      <span :key="ind">
                        <li
                          v-if="book_page.page_id == page_id"
                          :id="book_page.page_id"
                          class="lms-sub-topic-list active"
                          :style="[
                            book_page.status ? { color: '#ec296b' } : ''
                          ]"
                          @click="switch_page(book_page.page_id)"
                          v-html="ind + 1 + '.&nbsp;' + book_page.page_name"
                        ></li>
                        <li
                          v-else
                          :id="book_page.page_id"
                          class="lms-sub-topic-list"
                          :style="[
                            book_page.status ? { color: '#ec296b' } : ''
                          ]"
                          @click="switch_page(book_page.page_id)"
                          v-html="ind + 1 + '.&nbsp;' + book_page.page_name"
                        ></li>
                      </span>
                    </template>
                  </ul>
                  <div class="content_wrapper lesson-content-wrapper">
                    <div class="tab_content active">
                      <h3
                        v-html="
                          book_pages.length ? book_pages[index].page_name : ''
                        "
                      ></h3>
                      <div
                        id="lesson-content-actual"
                        v-html="
                          book_pages.length ? book_pages[index].content : ''
                        "
                      ></div>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div id="lesson-bottom-controls" :data-user-id="userId">
                    <button
                      class="btn btn-primary"
                      v-if="userId"
                      @click="next_page(current_page_id)"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="lightbox-modal" class="offscreen-modal-cv">
        <div class="modal-box-cv lightbox-cv"></div>
        <a class="modal-close-btn-cv">
          <i class="fas fa-times"></i>
        </a>
      </div>
    </section>
    <!--/Userall-->
    <Footer />
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import Footer from "@/components/footer/Footer.vue";
import axios from "axios";
export default {
  props: [
    "curName",
    "topicName",
    "pageId",
    "topicActualName",
    "purchases_status",
    "user_sch_id",
    "logout_user",
    "assessment",
    "for_grade",
    "sch_course"
  ],
  name: "course-content",
  components: {
    Header,
    Footer
  },
  data() {
    return {
      userId: 0,
      book_pages: "",
      topic_id: "",
      book_id: "",
      c_page: "",
      current_page_id: 0,
      read_page: [],
      index: 0,
      sub_topic_status: 0,
      role_id: "",
      next_topic_data: "",
      page_id: "",
      cls_id: "",
      keydownCallback: null
    };
  },
  created() {
    this.book_name = this.curName;
    this.topic_name = this.topicName;
  },
  mounted() {
    window.jQuery("#privacy-tablayout").champ({
      plugin_type: "tab",
      side: "right",
      active_tab: "1",
      controllers: "false"
    });
    cvAuth.getUserId(
      function(userId) {
        this.userId = userId;
        this.cls_id = this.$store.getters.getAuthData.auth_cls_id;
        this.role_id = this.$store.getters.getAuthData.auth_role_id;
        this.load_books_content(this.userId);
      }.bind(this)
    );

    $("#course-content-root").contextmenu(function() {
      return false;
    });

    if (this.keydownCallback)
      window.removeEventListener("keydown", this.keydownCallback);
    this.keydownCallback = function(event) {
      //console.log(event);
      if (event.keyCode == 123) {
        event.preventDefault();
        return false;
      } else if (
        (event.ctrlKey && event.shiftKey && event.keyCode == 73) ||
        (event.ctrlKey && event.shiftKey && event.keyCode == 74)
      ) {
        event.preventDefault();
        return false;
      } else if (event.ctrlKey && event.keyCode == "C".charCodeAt(0)) {
        event.preventDefault();
        return false;
      } else if (event.ctrlKey && event.keyCode == "A".charCodeAt(0)) {
        event.preventDefault();
        return false;
      } else if (
        event.ctrlKey &&
        event.shiftKey &&
        event.keyCode == "I".charCodeAt(0)
      ) {
        event.preventDefault();
        return false;
      } else if (
        event.ctrlKey &&
        event.shiftKey &&
        event.keyCode == "C".charCodeAt(0)
      ) {
        event.preventDefault();
        return false;
      } else if (
        event.ctrlKey &&
        event.shiftKey &&
        event.keyCode == "J".charCodeAt(0)
      ) {
        event.preventDefault();
        return false;
      } else if (event.ctrlKey && event.keyCode == "U".charCodeAt(0)) {
        event.preventDefault();
        return false;
      }
    }.bind(this);

    let vm = this;

    window.addEventListener("keydown", vm.keydownCallback);
  },
  updated() {
    $("#course-content-root").contextmenu(function() {
      return false;
    });

    $("#lesson-topics-list-inner > a").click(function() {
      $("#lesson-topics-list-wrapper").removeClass("active");
      if ($(window).width() <= 768) {
        $("#currTop").show();
      }
    });
    initLmsQuizzesAndStuff();
    // Initialize Lightbox
    $("#lesson-content-actual img").unbind("click");
    $("#lesson-content-actual img").click(function(e) {
      e.preventDefault();
      e.stopPropagation();
      showOffscreenModal("lightbox-modal");
      $($("#lightbox-modal .modal-box-cv")[0]).css(
        "background-image",
        'url("' + e.currentTarget.src + '")'
      );
    });

    $(".modal-close-btn-cv").unbind("click");
    $(".modal-close-btn-cv").click(function(e) {
      e.preventDefault();
      hideOffscreenModal(e.currentTarget.parentElement.id);
    });

    $(".offscreen-modal-cv").unbind("click");
    $(".offscreen-modal-cv").click(function(e) {
      if (e.currentTarget == e.target) hideOffscreenModal(e.currentTarget.id);
    });
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.keydownCallback);
  },
  methods: {
    load_books_content: function(userId) {
      this.book_name = this.curName;
      this.topic_name = this.topicName;
      this.book_pages = "";
      this.read_page = [];
      axios
        .post("/api/user/DisplaySubTopics", {
          topic_name: this.topic_name,
          book_name: this.book_name,
          st_id: userId
        })
        .then(res => {
          this.book_pages = res.data.data;

          if (!this.book_pages.length) {
            this.sub_topic_status = 0;
          } else if (this.purchases_status == 1) {
            this.sub_topic_status = 1;
          } else if (this.book_pages[0].sch_course == 1) {
            if (this.role_id == 2) {
              this.sub_topic_status = 1;
            } else if (this.role_id == 3) {
              if (this.book_pages[0].for_grade == this.cls_id) {
                this.sub_topic_status = 1;
              }
            }
          } else if (this.userId == 0) {
            this.sub_topic_status = 1;
          }

          if (
            this.sub_topic_status == 0 &&
            this.book_pages.findIndex(x => x.page_id === this.pageId) == -1
          ) {
            this.$router.push({
              name: "course-details",
              params: {
                curName: this.curName,
                bookId: this.book_id,
                topicId: this.topic_id
              }
            });
          }

          /** end user restriction */

          this.page_id = this.pageId ? this.pageId : this.book_pages[0].page_id;
          for (var i = 0; i < this.book_pages.length; i++) {
            if (!this.book_pages[i].status) {
              this.index = i;
              break;
            } else {
              this.index = 0;
            }
          }
          for (i = 0; i < this.book_pages.length; i++) {
            this.book_pages[i].content = getLmsContentWithAllTemplatesRendered(
              this.book_pages[i].content
            );
          }
          this.c_page = this.book_pages[this.index].page_name;
          this.current_page_id = this.book_pages[this.index].page_id;
          this.book_id = this.book_pages[this.index].book_id;
          this.topic_id = this.book_pages[this.index].topic_id;
          //alert(this.topic_id =this.book_pages[this.index].topic_id);
          if (!(typeof this.pageId == "undefined")) {
            this.switch_page(this.pageId);
          }
        });
    },
    switch_page: function(page_id) {
      window.jQuery(".lms-sub-topic-list.active").removeClass("active");
      window.jQuery("#" + page_id).addClass("active");
      this.current_page_id = page_id;
      this.index = this.book_pages.findIndex(x => x.page_id === page_id);
      this.c_page = this.book_pages[this.index].page_name;
      this.current_page_id = this.book_pages[this.index].page_id;
      let container = this.$el.querySelector(".lesson-content-wrapper");
      if (container) container.scrollIntoView(true);
    },
    next_page: function(page_id) {
      var curr_index = this.book_pages.findIndex(x => x.page_id === page_id);
      var currentPageIndex =
        this.book_pages.findIndex(x => x.page_id === page_id) + 1;
    
      if (!this.purchases_status && !this.sub_topic_status) {
        if (currentPageIndex >= this.book_pages.length) {
          this.$router.push({
            name: "course-details",
            params: {
              curName: this.curName,
              bookId: this.book_id,
              topicId: this.topic_id + 1
            }
          });
          return;
        } else {

          this.index = currentPageIndex;
          this.c_page = this.book_pages[this.index].page_name;
          this.current_page_id = this.book_pages[this.index].page_id;
          window.jQuery(".lms-sub-topic-list.active").removeClass("active");
          window.jQuery("#" + this.current_page_id).addClass("active");
          
        }
      } else {
        if (
          this.book_pages.length ? !this.book_pages[curr_index].status : false
        ) {
          axios
            .post("/api/user/curnt_read", {
              page_id: page_id,
              st_id: this.userId,
              book_id: this.book_id,
              topic_id: this.topic_id
            })
            .then(() => {
              this.read_page.push(page_id);
            });
        }

        if (currentPageIndex >= this.book_pages.length) {
          axios
            .post("/api/user/next_topic", {
              book_id: this.book_id,
              current_topic_id: this.topic_id
            })
            .then(res => {
              this.next_topic_data = res.data.data;
              if (!this.next_topic_data[0].topic_id) {
                this.$router.push({
                  name: "course-details",
                  params: {
                    curName: this.curName,
                    bookId: this.book_id,
                    topicId: this.topic_id + 1
                  }
                });
                return;
              } else {
                this.curName = this.next_topic_data[0].book_slug;
                this.topicName = this.next_topic_data[0].topic_slug;
                this.pageId = this.next_topic_data[0].page_id;
                this.topicActualName = this.next_topic_data[0].topic_name;
                this.load_books_content(this.userId);
                this.$router.push({
                  name: "course-content",
                  params: {
                    curName: this.next_topic_data[0].book_slug,
                    topicActualName: this.next_topic_data[0].topic_name,
                    topicName: this.next_topic_data[0].topic_slug,
                    pageId: this.next_topic_data[0].page_id,
                    user_sch_id: this.user_sch_id,
                    purchases_status: this.purchases_status
                  }
                });
              }
            });
        }
        window.jQuery("#" + this.current_page_id).css("color", "#ec296b");
        this.index = currentPageIndex;
        this.c_page = this.book_pages.length
          ? this.book_pages[this.index].page_name
          : "";
        this.current_page_id = this.book_pages.length
          ? this.book_pages[this.index].page_id
          : "";
        window.jQuery(".lms-sub-topic-list.active").removeClass("active");
        window.jQuery("#" + this.current_page_id).addClass("active");
      }
        let container = this.$el.querySelector(".lesson-content-wrapper");
                 if (container) container.scrollIntoView(true);
    }
  }
};
</script>
<style lang="scss">
#lms-topic-list.stickIt {
  position: fixed;
  top: 180px;
}
#backRow.stickBRow {
  position: fixed;
  top: 90px;
}
span > li.active {
  color: #fff !important;
}
.lesson-content-wrapper {
  h3 {
    margin-bottom: 24px;
    font-weight: 700;
  }
  p {
    margin-bottom: 1rem;
  }
  p + h3 {
    margin-top: 24px;
  }
  pre:not([class*="language-"]) {
    padding: 0;
    border-radius: 0;
    background: none;
  }

  pre[class*="language-"] {
    margin-bottom: 32px;
    padding: 24px;
    font-size: 1.3rem;
    line-height: 1;
    border-radius: 16px;
    code {
      font-size: 1rem;
      white-space: pre-wrap;
      line-height: 1;
      span {
        line-height: 1;
      }
    }
    .tag {
      padding: 0;
    }
  }
}
.lms-editor-container {
  margin: 0 0 32px;
}
.lms-editor-run-btn {
  border: none;
  color: #fff;
}

#lesson-content-actual {
  td,
  th {
    padding: 4px 16px;
  }
  ol,
  ul {
    list-style-position: inside;
  }
  ol {
    list-style-type: decimal;
  }
  ul {
    list-style-type: disc;
  }
}

/******************* CODE EDITOR *******************/
#lesson-content-actual .CodeMirror-line span {
  font-size: 0.9rem !important;
}

.lms-editor-container .CodeMirror {
  background: #fafafa;
  height: 100%;
}

.lms-editor-container .CodeMirror .CodeMirror-gutters {
  background: #f7f7f7;
}

.lms-editor-tabs {
  display: flex;
  height: 32px;
  background: #1abc9c;
}

.lms-editor-tabs a {
  display: block;
  padding: 0 16px;
  font: normal 1rem/32px "Rubik", sans-serif !important;
  text-decoration: none !important;
  color: #fff !important;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.lms-editor-tabs a.lms-editor-active-tab {
  border-bottom: 4px solid #148f77;
}

.lms-editor-tabs button {
  height: 32px;
  margin: 0;
  padding: 0 32px;
  line-height: 32px;
  background: #0e6251;
}

.lms-editors-wrapper {
  position: relative;
  height: 218px;
}

.lms-editors-wrapper > div {
  width: 100%;
  height: 218px;
  position: absolute;
  left: 0;
  top: 0;
}

.lms-editors-wrapper > div {
  z-index: -10;
}

.lms-editors-wrapper > div.active-lms-editor-tab-content {
  z-index: 1;
}

.lms-editor-output {
  width: 100%;
  height: 200px;
  display: none;
  box-sizing: border-box;
  border: 2px solid #efefef;
  overflow: auto;
}

.lms-html-render {
  height: 150px;
  margin-bottom: 32px;
  border: 2px solid #dfdfdf;
}
</style>
