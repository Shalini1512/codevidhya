<template>
  <div id="project-preview-root">
    <Header />
    <div id="project-preview-container">
      <div id="project-preview-banner">
        <div style="position: relative; top: 50%; transform: translateY(-50%);">
          <h2 class="font-primary font-bold fs-large">
            {{ projectInfo.name }}
          </h2>
          <p><small>by</small> {{ projectInfo.user_name }}</p>
          <div id="stats" class="d-flex flex-row justify-content-center">
            <p class="mr-3">
              <small style="font-size: 0.8rem"
                >Created on {{ createdAt }}</small
              >
            </p>
            <div :title="'This project was viewed ' + views + ' times.'">
              <i class="far fa-eye" /> {{ views }}
            </div>
            <div :title="'This project was liked ' + likes + ' times.'">
              <i class="far fa-heart" /> {{ likes }}
            </div>
            <div
              :title="
                'There are ' + commentsCount + ' comments on this project.'
              "
            >
              <i class="far fa-comment" /> {{ commentsCount }}
            </div>
          </div>
        </div>
      </div>
      <div id="description" class="container d-flex flex-row">
        <div class="col-md-7 pr-5">
          <h3>DESCRIPTION</h3>
          <p>
            This is a project built by a Codevidhya learner.
          </p>
        </div>
        <div class="col-md-5">
          <div id="share">
            <button
              :class="
                'btn btn-pink btn-pill' +
                  (liked ? '' : ' reaction-btn color-pink')
              "
              @click="handleLikeClicked"
            >
              <i class="fas fa-heart" /> {{ liked ? "Liked" : "Like" }}
            </button>
            <button
              class="reaction-btn btn btn-blue btn-pill color-blue"
              @click="scrollToComments"
            >
              <i class="fas fa-comment" /> Comment
            </button>
            <!--button class="reaction-btn btn btn-green btn-pill color-green">
              <i class="fas fa-share-alt" /> Share
            </button-->
          </div>
        </div>
      </div>
      <!--div id="project-preview-sidebar">
        <small>Project</small>
        <p class="mb-2">{{ projectInfo.name }}</p>
        <small>Created by</small>
        <p class="mb-2">{{ projectInfo.user_name }}</p>
        <small>Created on</small>
        <p>{{ createdAt }}</p>
        <i class="flex-grow-1"></i>
        <button class="btn btn-primary" @click="$router.push('/projects')">
          Go back
        </button>
      </div-->
      <div id="project-preview-wrapper" style="flex-grow: 1;">
        <h4>PROJECT OUTPUT</h4>
        <iframe
          v-if="projectInfo.type == 'web' && canLoad"
          id="web-project-preview-iframe"
          :src="webProjectSrc"
          :style="'height: ' + (viewportHeight - 59 - 32) + 'px'"
        ></iframe>
        <iframe
          v-if="projectInfo.type == 'scratch' && canLoad"
          id="scratch-iframe"
          :src="
            scratchUrl +
              '?origin=' +
              origin +
              '&file=' +
              projectInfo.projectPath +
              '/project.sb3&mode=viewonly'
          "
          :style="'height: ' + (viewportHeight - 59 - 32) + 'px'"
        >
          Your browser does not support Scratch.
        </iframe>
        <iframe
          v-if="projectInfo.type == 'python' && pythonFile"
          id="python-output-iframe"
          :src="pyapiUrl + '?run_file=' + pythonFile"
          :style="'height: ' + (viewportHeight - 59 - 32) + 'px'"
        ></iframe>
      </div>
      <div v-if="loadingFinished && !canLoad" id="failed-to-load-container">
        <h3>Failed to load project.</h3>
        <router-link to="/projects" class="btn btn-primary"
          >Go back</router-link
        >
      </div>

      <div class="container" style="margin-top: 56px">
        <div class="d-flex flex-row">
          <Comments class="col-md-6" :projectId="projectId" />
          <div class="col-md-6"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import Header from "@/components/header/HeaderMenuOnly.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import Comments from "@/components/comments/Comments.vue";

import AuthMixin from "@/mixins/AuthMixin.js";

export default {
  mixins: [AuthMixin],
  components: { Header, Comments },
  data() {
    return {
      projectId: null,
      projectInfo: {},
      canLoad: false,
      loadingFinished: false,
      webProjectSrc: null,
      pyapiUrl: "",
      pythonFile: "",
      scratchUrl: "",
      origin: "",
      createdAt: null,
      viewportHeight: 0,
      views: 0,
      liked: false,
      likes: 0,
      liking: false,
      commentsCount: 0
    };
  },
  beforeMount() {
    this.origin = window.location.origin;
    var split = window.location.href.split("/");
    this.projectId = split[split.length - 1];
  },
  mounted() {
    this.viewportHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );

    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      this.pyapiUrl = "http://localhost:3500";
      this.scratchUrl = "http://localhost:8601";
    } else {
      this.pyapiUrl = "https://pyapi.codevidhya.com";
      this.scratchUrl = "https://codevidhya.com/scratch";
    }

    this.getProjectInfo();

    hideTawk();
  },
  beforeDestroy() {
    showTawk();
  },
  methods: {
    getProjectInfo() {
      var vm = this;
      this.$http
        .post("/api/projects/getProjectPreviewInfo", {
          project_id: this.projectId
        })
        .then(function(res) {
          var data = res.body;
          this.projectInfo = data;
          this.createdAt = this.$moment(this.projectInfo.created_at).format(
            "DD MMM, YYYY"
          );
          switch (this.projectInfo.type) {
            case "web": {
              var src =
                this.projectInfo.projectPath + "/" + this.projectInfo.main_file;
              vm.$http
                .get(src)
                .then(function() {
                  vm.loadingFinished = true;
                  vm.canLoad = true;
                  vm.webProjectSrc = src;
                })
                .catch(function(e) {
                  vm.loadingFinished = true;
                  vm.canLoad = false;
                  console.log(e);
                });
              break;
            }
            case "scratch": {
              this.canLoad = true;
              break;
            }
            case "python": {
              this.pythonFile =
                this.projectInfo.projectPath + "/" + this.projectInfo.main_file;
            }
          }
          this.views = this.projectInfo.views;
          this.liked = this.projectInfo.liked;
          this.likes = this.projectInfo.likes;
          this.commentsCount = this.projectInfo.commentsCount;
          this.handleProjectViewed(this.projectInfo.project_id);
        })
        .catch(err => {
        });
    },
    handleLikeClicked() {
      if (this.liking) return;
      this.liking = true;
      this.$http
        .post("/api/reactions/toggleProjectLike", { projectId: this.projectId })
        .then(res => {
          this.liked = res.body.likeAdded;
          if (this.liked) {
            this.likes += 1;
          } else {
            this.likes -= 1;
          }
          this.liking = false;
        })
        .catch(err => {
          this.liking = false;
        });
    },
    handleProjectViewed(projectId) {
      var alreadyViewedProject = window.localStorage.getItem(
        "viewed-project-" + projectId
      );
      if (alreadyViewedProject) return;
      this.views = this.projectInfo.views + 1;
      window.localStorage.setItem("viewed-project-" + projectId, "viewed");
      this.$http
        .post("/api/projects/handleProjectViewed", { projectId: projectId })
        .then(res => {})
        .catch(err => {});
    },
    scrollToComments() {
      var scrollTop =
        $("#comments-heading")[0].getBoundingClientRect().top +
        window.scrollY -
        59;
      $("html, body").animate(
        {
          scrollTop: scrollTop
        },
        600
      );
    }
  }
};
</script>

<style lang="scss">
#project-preview-root {
  width: 100%;
}

#project-preview-container {
  width: 100%;
  padding-top: 59px;
  #project-preview-wrapper {
    margin: 0 16px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    border-radius: 4px;
    overflow: hidden;
    h4 {
      text-align: center;
      margin: 0;
      padding: 8px;
      background: rgb(71, 0, 165);
      color: #fff;
    }
    iframe {
      width: 100%;
      height: 100%;
      border-radius: 4px;
      overflow: hidden;
      border: none;
    }
  }
  #failed-to-load-container {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    .btn {
      margin-top: 24px;
    }
  }

  #description {
    margin-top: 56px;
    margin-bottom: 48px;
    h3 {
      margin-bottom: 12px;
      font-size: 1.6rem;
      font-weight: bold;
    }
    p {
      font-size: 1.3rem;
      line-height: 1.5;
    }
    #share {
      display: flex;
      flex-direction: row;
      padding-top: 24px;
      button {
        margin-right: 8px;
      }
    }
  }
}

#project-preview-banner {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  color: #fff;
  border-bottom: 2px solid rgba(31, 0, 88, 0.507);
  &::before {
    content: " ";
    display: block;
    position: absolute;
    width: 110%;
    height: 110%;
    left: 50%;
    top: 50%;
    z-index: -1;
    transform: translate(-50%, -50%);
    background-image: url("/assets/images/banners/hero-bg.svg");
    background-size: 120%;
    background-position: center;
    filter: blur(6px);
  }
  &::after {
    content: " ";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: -1;
    background-image: linear-gradient(
      to top,
      rgba(42, 12, 90, 0.5),
      rgba(0, 0, 0, 0)
    );
  }
  h2 {
    margin-bottom: 16px;
    font-size: 3rem;
    text-align: center;
  }
  p {
    text-align: center;
    font-size: 1rem;
    small {
      font-size: 0.8em;
    }
  }

  #stats {
    width: 100%;
    margin-top: 36px;
    padding: 0 32px;
    font-size: 0.9rem;
    line-height: 1;
    font-weight: 300;
    * {
      line-height: 1;
    }
    i {
      margin-right: 8px;
      font-size: 12px;
    }
    > div {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0 8px;
    }
  }
}

.reaction-btn {
  background: none;
}
</style>
