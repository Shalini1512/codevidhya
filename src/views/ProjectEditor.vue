<template>
  <div id="project-editor-root">
    <Header />
    <div v-if="projectInfo && projectInfo.type != 'scratch'" id="main">
      <div id="project-editor__sidebar">
        <div id="header">
          <h3 class="singleline">{{ projectInfo.name }}</h3>
          <template v-if="!makeUneditable">
            <i
              v-if="changesExist"
              class="fas fa-save"
              title="Save changes (ctrl+s)"
              @click="saveChanges()"
            ></i>
            <i
              class="fas fa-ellipsis-h"
              @click="showProjectContextMenu($event)"
            ></i>
          </template>
        </div>
        <div id="files-list-wrapper" data-simplebar>
          <div id="files-list">
            <project-file-tree
              v-for="file in projectFileTree"
              :file="file"
              :createProjectFile="createProjectFile"
              :showFileUploadModal="showFileUploadModal"
              :deleteProjectFile="deleteProjectFile"
              :onContextMenuRunFileClick="onContextMenuRunFileClick"
              :onContextMenuRenameClick="onContextMenuRenameClick"
              :openFile="openFile"
              :uneditable="makeUneditable"
              :key="file.file_id"
            ></project-file-tree>
          </div>
        </div>
        <div
          v-if="projectInfo.code_challenge_entry"
          id="challenge-timer-container"
        >
          <template v-if="projectInfo.code_challenge_time_remaining">
            <p>
              <b>{{ projectInfo.code_challenge_name }}</b>
            </p>
            <small>Time remaining</small>
            <small
              >{{ this.codeChallengeTimeRemainingM }} minutes,
              {{ this.codeChallengeTimeRemainingS }} seconds</small
            >
            <button
              class="btn btn-primary btn-pill show-instructions"
              @click="showInstructions()"
            >
              Show instructions
            </button>
          </template>

          <div
            v-if="projectInfo.code_challenge_time_remaining == 0"
            id="challenge-completed"
          >
            <p><b>Challenge completed!</b></p>
            <button
              class="btn btn-primary btn-pill"
              @click="$router.push('/projects')"
            >
              Close project
            </button>
          </div>
        </div>
      </div>
      <div id="file-editor-container">
        <div
          id="project-editor-tablayout"
          class="cv-tablayout"
          :style="
            'display: ' +
              (openFileIds.length ? 'flex;' : 'none;') +
              'width:' +
              (livePreviewShown ? '50%' : '100%')
          "
        >
          <div class="tabs">
            <div
              v-for="file in openFileIds"
              :key="file"
              :class="file == activeFileId ? 'active' : ''"
              :data-file-id="file"
              @click.middle="closeFile($event)"
            >
              <span class="singleline">{{ allProjectFiles[file].name }}</span>
              <i class="fas fa-times" @click="closeFile($event)"></i>
            </div>
            <i class="flex-filler"></i>
            <button
              v-if="!livePreviewShown"
              id="preview-button"
              class="btn btn-secondary singleline py-1"
              @click="onRunButtonClick()"
            >
              <i class="fas fa-play"></i>
              {{ projectInfo.type == "python" ? "RUN" : "RUN" }}
            </button>
          </div>
          <!--div id="file-content-container" style="display: none"></div-->
        </div>
        <div
          id="no-files-open"
          v-if="!openFileIds.length"
          :style="
            'height: 100%; padding: 128px 32px; text-align: center;' +
              'width: ' +
              (livePreviewShown ? '50%' : '100%')
          "
        >
          <p style="margin-bottom: 16px">Open a file to start editing.</p>
        </div>
        <div
          id="project-editor__live-preview-container"
          :style="'display: ' + (livePreviewShown ? 'flex' : 'none')"
        >
          <div id="live-preview-header">
            <span v-if="projectInfo.type == 'web'" class="singleline">{{
              previewedFileId
                ? allProjectFiles[previewedFileId].name
                : "index.html"
            }}</span>
            <span v-if="projectInfo.type == 'python'" class="singleline">{{
              previewedFileId
                ? allProjectFiles[previewedFileId].name
                : "main.py"
            }}</span>
            <i class="flex-filler"></i>
            <button
              class="cv-button borderless square"
              title="Project info"
              @click="showProjectInfoModal()"
            >
              <i class="fas fa-info-circle"></i>
            </button>
            <button
              v-if="changesExist && !makeUneditable"
              class="cv-button borderless square"
              title="Save changes"
              @click="saveChanges()"
            >
              <i class="fas fa-save"></i>
            </button>
            <template v-if="projectInfo.type == 'web'">
              <button
                class="cv-button borderless square"
                title="Reload"
                @click="reloadPreview()"
              >
                <i class="fas fa-redo"></i>
              </button>
              <button
                class="cv-button borderless square"
                title="Preview in new tab"
                @click="previewInNewTab()"
              >
                <i class="fas fa-external-link-alt"></i>
              </button>
            </template>
            <button
              class="cv-button borderless square"
              title="Save and run"
              @click="onRunButtonClick()"
            >
              <i class="fas fa-play"></i>
            </button>
            <button
              class="cv-button borderless square"
              title="Close"
              @click="livePreviewShown = false"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <iframe
            v-if="projectInfo.type == 'web'"
            id="live-preview-iframe"
          ></iframe>
          <iframe
            v-if="projectInfo.type == 'python'"
            id="python-output-iframe"
            :src="pyapiUrl"
          ></iframe>
        </div>
      </div>
    </div>
    <div v-else-if="projectInfo && projectInfo.type == 'scratch'" id="main">
      <iframe
        id="scratch-iframe"
        :src="
          scratchUrl +
            '?origin=' +
            origin +
            '&file=' +
            projectInfo.projectPath +
            '/project.sb3'
        "
      >
        Your browser does not support Scratch.
      </iframe>
      <!--iframe id="scratch-iframe" :src="'https://codevidhya.com/scratch?file=' + projectInfo.projectPath + '/project.sb3'">
        Your browser does not support Scratch.
      </iframe-->
    </div>

    <div id="project-info-modal" class="cv-modal normal">
      <div>
        <div class="header">
          <h3>Project Details</h3>
        </div>
        <div class="body" style="padding: 0 16px;">
          <div class="d-flex flex-row mb-2">
            <p class="col-md-4"><b>Name</b></p>
            <p>{{ projectInfo.name }}</p>
          </div>
          <div class="d-flex flex-row mb-2">
            <p class="col-md-4"><b>Description</b></p>
            <p>{{ projectInfo.description }}</p>
          </div>
          <div class="d-flex flex-row mb-2">
            <p class="col-md-4"><b>Created by</b></p>
            <p>{{ projectInfo.user_name }}</p>
          </div>
          <div class="d-flex flex-row mb-2">
            <p class="col-md-4"><b>Created on</b></p>
            <p v-if="projectCreatedAt">
              {{
                getMonthName(projectCreatedAt.getMonth()) +
                  " " +
                  projectCreatedAt.getDate() +
                  ", " +
                  projectCreatedAt.getFullYear()
              }}
            </p>
          </div>
        </div>
        <div class="footer">
          <button
            class="btn btn-secondary"
            onclick="(function() {hideModal('project-info-modal');})()"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <div id="file-upload-modal" class="cv-modal normal">
      <div>
        <div class="header">
          <h3>Upload file</h3>
        </div>
        <div class="body" style="padding: 24px">
          <div class="cv-file-input-group">
            <input
              type="file"
              id="file-input"
              accept=".htm, .html, .css, .js, .png, .jpg, .py"
            />
            <label for="file-input">
              <span class="selected-file" id="file-input-file-name"></span>
              <span class="choose-file">Choose file</span>
            </label>
          </div>
        </div>
        <div class="footer">
          <button
            class="btn btn-secondary"
            onclick="(function() {hideModal('file-upload-modal');$('#file-input-file-name').text('');})()"
          >
            Cancel
          </button>
          <button class="btn btn-primary" @click="uploadFile()">
            Upload
          </button>
        </div>
      </div>
    </div>

    <div
      id="code-challenge-question-modal"
      class="cv-modal large undismissable"
    >
      <div>
        <div class="header">
          <h3>Your Task</h3>
        </div>
        <div class="body" style="padding: 24px">
          <Grade1CodeChallenge
            v-if="
              projectInfo &&
                projectInfo.code_challenge_entry &&
                studentGrade == 1
            "
          />
          <Grade2CodeChallenge
            v-if="
              projectInfo &&
                projectInfo.code_challenge_entry &&
                studentGrade == 2
            "
          />
          <Grade3CodeChallenge
            v-if="
              projectInfo &&
                projectInfo.code_challenge_entry &&
                studentGrade == 3
            "
          />
          <Grade4CodeChallenge
            v-if="
              projectInfo &&
                projectInfo.code_challenge_entry &&
                studentGrade == 4
            "
          />
          <Grade5CodeChallenge
            v-if="
              projectInfo &&
                projectInfo.code_challenge_entry &&
                studentGrade == 5
            "
          />
          <Grade6CodeChallenge
            v-if="
              projectInfo &&
                projectInfo.code_challenge_entry &&
                studentGrade == 6
            "
          />
          <Grade7CodeChallenge
            v-if="
              projectInfo &&
                projectInfo.code_challenge_entry &&
                studentGrade == 7
            "
          />
          <Grade8CodeChallenge
            v-if="
              projectInfo &&
                projectInfo.code_challenge_entry &&
                studentGrade == 8
            "
          />
          <Grade9CodeChallenge
            v-if="
              projectInfo &&
                projectInfo.code_challenge_entry &&
                studentGrade == 9
            "
          />
          <Grade10CodeChallenge
            v-if="
              projectInfo &&
                projectInfo.code_challenge_entry &&
                studentGrade == 10
            "
          />
        </div>
        <div class="footer">
          <button
            class="btn btn-primary"
            onclick="(function() {hideModal('code-challenge-question-modal');})()"
          >
            Continue
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="projectInfo.code_challenge_entry && projectInfo.type == 'scratch'"
      id="scratch-challenge-timer-container"
    >
      <template v-if="projectInfo.code_challenge_time_remaining">
        <p>
          <b>{{ projectInfo.code_challenge_name }}</b>
        </p>
        <small>Time remaining</small>
        <small
          >{{ this.codeChallengeTimeRemainingM }} minutes,
          {{ this.codeChallengeTimeRemainingS }} seconds</small
        >
        <button
          class="btn btn-primary btn-pill show-instructions"
          @click="showInstructions()"
        >
          Show instructions
        </button>
      </template>

      <div
        v-if="projectInfo.code_challenge_time_remaining == 0"
        id="challenge-completed"
      >
        <p><b>Challenge completed!</b></p>
        <button
          class="btn btn-primary btn-pill"
          @click="$router.push('/projects')"
        >
          Close project
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    Header
  }
};
</script>
<script>
//import Header from "@/components/header/HeaderMenuOnly.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import ProjectFileTree from "@/components/project-editor/ProjectFileTree.vue";
import AuthMixin from "@/mixins/AuthMixin.js";

import Grade1CodeChallenge from "@/components/code-challenge/Grade1CodeChallenge.vue";
import Grade2CodeChallenge from "@/components/code-challenge/Grade2CodeChallenge.vue";
import Grade3CodeChallenge from "@/components/code-challenge/Grade3CodeChallenge.vue";
import Grade4CodeChallenge from "@/components/code-challenge/Grade4CodeChallenge.vue";
import Grade5CodeChallenge from "@/components/code-challenge/Grade5CodeChallenge.vue";
import Grade6CodeChallenge from "@/components/code-challenge/Grade6CodeChallenge.vue";
import Grade7CodeChallenge from "@/components/code-challenge/Grade7CodeChallenge.vue";
import Grade8CodeChallenge from "@/components/code-challenge/Grade8CodeChallenge.vue";
import Grade9CodeChallenge from "@/components/code-challenge/Grade9CodeChallenge.vue";
import Grade10CodeChallenge from "@/components/code-challenge/Grade10CodeChallenge.vue";

export default {
  mixins: [AuthMixin],
  components: {
    Header,
    ProjectFileTree,
    Grade1CodeChallenge,
    Grade2CodeChallenge,
    Grade3CodeChallenge,
    Grade4CodeChallenge,
    Grade5CodeChallenge,
    Grade6CodeChallenge,
    Grade7CodeChallenge,
    Grade8CodeChallenge,
    Grade9CodeChallenge,
    Grade10CodeChallenge
  },
  data() {
    return {
      projectId: null,
      projectInfo: {},
      projectCreatedAt: null,
      studentGrade: 0,
      allProjectFiles: {},
      projectFileTree: [],
      openFileIds: [],
      activeFileId: null,
      changesExist: false,
      previewedFileId: null,
      originalFileContents: {},
      updatedFileContents: {},
      shouldInitializeTabs: true,
      codeMirrors: {},
      livePreviewShown: true,
      ctrlSListener: null,
      previewTab: null,
      currentUploadParentId: null,
      savingScratchProject: false,
      origin: "",
      pyapiUrl: "",
      scratchUrl: "",
      codeChallengeTimeRemainingM: 0,
      codeChallengeTimeRemainingS: 0,
      makeUneditable: false,
      autosavePending: false,
      autosaveTimeoutId: null
    };
  },
  beforeMount() {
    this.origin = window.location.origin;
    console.log(process.env);
    if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
      this.pyapiUrl = "http://localhost:3500";
      this.scratchUrl = "http://localhost:8601";
    } else {
      this.pyapiUrl = "https://pyapi.codevidhya.com";
      this.scratchUrl = "https://codevidhya.com/scratch";
    }
  },
  mounted() {
    window.addEventListener("message", this.scratchEventListener);
    hideTawk();

    let projectId = window.location.pathname;
    this.projectId = projectId.substring(projectId.lastIndexOf("/") + 1);
    if (!this.projectId) {
      this.$router.go("/projects");
      return;
    }

    showProgressOverlay("page-load");
    cvAuth.getUserId(
      function(userId) {
        if (userId != 0) {
          this.studentGrade = this.$store.getters.getAuthData.auth_cls_id;
          this.getProjectInfo();
          this.loadProjectFiles();
        } else {
          this.$router.push("/projects");
        }
      }.bind(this)
    );

    this.ctrlSListener = function(e) {
      if (
        (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
        e.keyCode == 83
      ) {
        e.preventDefault();
        if (this.makeUneditable) return;
        if (this.projectInfo.type == "scratch") {
          this.saveScratchProject();
        } else {
          this.saveChanges();
        }
      }
    }.bind(this);
    document.addEventListener("keydown", this.ctrlSListener, false);

    initCvModals();
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
    if (this.shouldInitializeTabs) {
      var tabItems = $(
        "#project-editor-tablayout .tabs > :not(div[data-initialized])"
      );
      tabItems.attr("data-initialized", "");
      if (tabItems.length) {
        initCvTablayouts(
          function(clickedTabItem) {
            var clickedFileId = clickedTabItem.dataset.fileId;
            this.openFile(clickedFileId);
          }.bind(this)
        );
      }
    }
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.ctrlSListener);
    window.removeEventListener("message", this.scratchEventListener);
    this.stopAutosave();
    showTawk();
  },
  methods: {
    getMonthName(month) {
      return getMonthName(month);
    },
    getProjectInfo() {
      this.$http
        .post("/api/projects/getProjectInfo", {
          projectId: this.projectId
        })
        .then(function(res) {
          var data = res.body;
          this.projectInfo = data;
          this.projectCreatedAt = new Date(
            Date.parse(this.projectInfo.created_at)
          );
          if (!this.projectInfo.canEdit && !this.projectInfo.isTeacher) {
            this.$router.push("/projects");
            return;
          }
          if (this.projectInfo.isTeacher) {
            this.makeUneditable = true;
          }
          if (this.projectInfo.code_challenge_entry) {
            if (this.projectInfo.code_challenge_time_remaining) {
              this.updateTimeRemaining();
              showModal("code-challenge-question-modal");
            } else {
              this.doCodeChallengeCompleted(false);
              this.makeUneditable = true;
            }
          }
          if (this.projectInfo.type == "scratch") {
            /*
            Start autosave timeout for Scratch projects.
            For other project types, timeout will be
            started on opening a file.
            */
            this.autoSave();
          }
        })
        .catch(err => {});
    },
    loadProjectFiles() {
      this.$http
        .post("/api/projects/getProjectFiles", {
          projectId: this.projectId
        })
        .then(
          function(res) {
            var data = res.body; // This is an array sorted by file type and by file name. Folders first, files next
            var allFiles = new Object();
            for (var i = 0; i < data.length; i++) {
              allFiles[data[i].file_id] = data[i];
            }
            this.allProjectFiles = allFiles;
            var tree = new Array(); // This will be a nested array representing directory structure

            for (var i = 0; i < data.length; i++) {
              if (data[i].parent) {
                let parent = allFiles[data[i].parent];
                if (!parent.files) parent.files = new Array();
                parent.files.push(data[i]);
                /*
                We don't need to push this 'parent' object to the 'tree' array
                because it is already pushed in the 'else' block.
                We are only updating the 'files' property of
                this 'parent' object which is already in 'tree'.
                */
              } else {
                tree.push(data[i]);
              }
            }
            this.projectFileTree = tree;
            if (this.projectInfo.type == "web") this.runFile();
            hideProgressOverlay("page-load");
          }.bind(this)
        )
        .catch(err => {
          hideProgressOverlay("page-load");
        });
    },
    showProjectInfoModal() {
      showModal("project-info-modal");
    },
    showProjectContextMenu(e) {
      showContextMenu(
        e.currentTarget,
        [
          "New folder",
          "New file",
          "Upload file",
          "Delete project",
          "Close project"
        ],
        function(option) {
          switch (option) {
            case "New folder": {
              this.createProjectFile("folder", null);
              break;
            }
            case "New file": {
              this.createProjectFile("file", null);
              break;
            }
            case "Upload file": {
              //this.createProjectFile('file', null);
              this.showFileUploadModal(null);
              break;
            }
            case "Delete project": {
              this.deleteProject();
              break;
            }
            case "Close project": {
              this.$router.push({ path: "/projects" });
            }
          }
        }.bind(this)
      );
    },
    showFileUploadModal(folderId) {
      this.currentUploadParentId = folderId;
      showModal("file-upload-modal");
    },
    createProjectFile(fileType, parentFileId) {
      // if (!this.auth_getToken()) return;
      var vm = this;
      var dialogOptions = {
        title: "Add new " + fileType,
        message:
          fileType == "file"
            ? "Supported file extensions:<br><strong>.htm .html .css .js .py</strong>"
            : null,
        callback: function(options) {
          if (fileType == "file") {
            var lastDotIndex = options.value.lastIndexOf(".");
            var extension = getFileExtension(options.value);
            if (!~["html", "htm", "css", "js", "py"].indexOf(extension)) {
              cvNotify("Unsupported file extension: " + extension, "error");
              return false;
            }
          }
          showProgressOverlay("file-creation");
          vm.$http
            .post("/api/projects/createProjectFile", {
              projectId: vm.projectId,
              type: fileType,
              parentId: parentFileId,
              name: options.value
            })
            .then(function(res) {
              hideProgressOverlay("file-creation");
              if (res.status != 200) {
              } else {
                vm.loadProjectFiles();
              }
              if (fileType == "file") cvNotify("File created.");
              else cvNotify("Folder created.");
            })
            .catch(err => {
              if (err.body == "already_exists") {
                cvNotify("File name already exists.", "error");
                dialogOptions.prefill = options.value;
                showPromptDialog(dialogOptions);
              }
              hideProgressOverlay("file-creation");
            });
          return true;
        }.bind(vm),
        positiveButton: "Add",
        undismissable: true
      };
      showPromptDialog(dialogOptions);
    },
    deleteProject() {
      showConfirmationDialog({
        title: "Delete project?",
        message:
          "<strong>" +
          this.projectInfo.name +
          "</strong> will be deleted permanently.",
        callback: function(type) {
          if (type == "positive") {
            showProgressOverlay("project-deletion");
            this.$http
              .post("/api/projects/deleteProject", {
                projectId: this.projectId
              })
              .then(
                function(res) {
                  hideProgressOverlay("project-deletion");
                  cvNotify("Project successfully deleted.");
                  this.$router.go(-1);
                }.bind(this)
              )
              .catch(function(err) {
                hideProgressOverlay("project-deletion");
                cvNotify("Failed to delete project.", "error");
              });
          }
        }.bind(this),
        positiveButton: "Delete",
        positiveButtonClass: "negative"
      });
    },
    deleteProjectFile(fileType, fileId) {
      // if (!this.auth_getToken()) return;
      var file = this.allProjectFiles[fileId];
      if (
        file.name == "index.html" &&
        this.projectInfo.type === "web" &&
        !file.parent
      ) {
        cvNotify("Cannot delete index.html file.", "error");
        return;
      }
      if (
        file.name == "main.py" &&
        this.projectInfo.type === "python" &&
        !file.parent
      ) {
        cvNotify("Cannot delete main.py file.", "error");
        return;
      }
      showConfirmationDialog({
        title: "Delete " + fileType + "?",
        message:
          "<strong>" +
          this.allProjectFiles[fileId].name +
          "</strong> will be deleted permanently.",
        callback: function(type) {
          if (type == "positive") {
            showProgressOverlay("file-deletion");
            this.$http
              .post("/api/projects/deleteProjectFile", {
                type: fileType,
                id: fileId
              })
              .then(function(res) {
                hideProgressOverlay("file-deletion");
                cvNotify("Successfully deleted.");
                this.closeTab(fileId);
                this.loadProjectFiles();
              })
              .catch(function(err) {
                hideProgressOverlay("file-deletion");
                cvNotify("Failed to delete " + fileType + ".", "error");
              });
          }
        }.bind(this),
        positiveButton: "Delete",
        positiveButtonClass: "negative"
      });
    },
    openFile(fileId) {
      var alreadyOpen = false;
      if (this.allProjectFiles[fileId].type == "folder") return;
      for (var i = 0; i < this.openFileIds.length; i++) {
        if (this.openFileIds[i] == fileId) {
          alreadyOpen = true;
          break;
        }
      }

      if (alreadyOpen) {
        if (fileId == this.activeFileId) return;
        else {
          $("#project-editor-tablayout > .content").removeClass("active");
          $("#file-content-" + fileId).addClass("active");
        }
      } else {
        var fileName = this.allProjectFiles[fileId].name;
        var fileExtension = getFileExtension(fileName);
        this.shouldInitializeTabs = true;
        this.openFileIds.push(fileId);
        if (["jpg", "jpeg", "png"].indexOf(fileExtension) > -1) {
          $("#project-editor-tablayout > .content").removeClass("active");
          var filePreviewContainer = document.createElement("div");
          filePreviewContainer.id = "file-content-" + fileId;
          filePreviewContainer.className = "content active filepreview";
          filePreviewContainer.innerHTML =
            '<img src="' +
            this.projectInfo.projectPath +
            "/" +
            this.allProjectFiles[fileId].name +
            '" />';
          $("#project-editor-tablayout").append(filePreviewContainer);
        } else {
          this.fetchFileContent(fileId);
        }
        this.autoSave();
      }
      this.activeFileId = fileId;
    },
    fetchFileContent(fileId) {
      this.$http
        .post("/api/projects/getProjectFileContent", { id: fileId })
        .then(function(res) {
          this.originalFileContents[fileId] = res.body;
          this.updatedFileContents[fileId] = res.body;
          $("#project-editor-tablayout > .content").removeClass("active");
          var cmContainer = document.createElement("div");
          cmContainer.id = "file-content-" + fileId;
          cmContainer.className = "content active";
          $("#project-editor-tablayout").append(cmContainer);
          this.codeMirrors[fileId] = CodeMirror(cmContainer, {
            value: res.body,
            mode: this.getCodeMirrorModeForFile(fileId),
            lineNumbers: true,
            styleActiveLine: true,
            styleActiveSelected: true,
            styleSelectedText: true,
            autoCloseTags: true,
            autoCloseBrackets: true,
            autoRefresh: true,
            line: true,
            connect: "align",
            lineWrapping: true,
            matchTags: { bothTags: true },
            colorpicker: true,
            fileName: "file"
          });
          this.codeMirrors[fileId].on(
            "change",
            function() {
              this.changesExist = true;
            }.bind(this)
          );
          this.codeMirrors[fileId].refresh();
        })
        .catch(function(err) {
          cvNotify("Failed to open file.", "error");
        });
    },
    closeTab(fileId) {
      this.codeMirrors[fileId] = null;
      var codeMirrorElement = document.getElementById("file-content-" + fileId);
      if (codeMirrorElement) {
        codeMirrorElement.parentElement.removeChild(codeMirrorElement);
      }
      for (var i = 0; i < this.openFileIds.length; i++) {
        if (fileId == this.openFileIds[i]) {
          if (fileId == this.activeFileId) {
            // change content
            var newActiveFileId;
            if (i < this.openFileIds.length - 1) {
              // There are tabs on the right side.
              // So, activate the next tab on the right.
              newActiveFileId = this.openFileIds[i + 1];
            } else if (i > 0) {
              newActiveFileId = this.openFileIds[i - 1];
            } else {
              newActiveFileId = null;
            }
            $("#file-content-" + newActiveFileId).addClass("active");
            if (newActiveFileId) this.openFile(newActiveFileId);
          }
          this.openFileIds.splice(i, 1);
          break;
        }
      }
      if (!this.openFileIds.length) {
        this.stopAutosave();
      }
    },
    closeFile(e) {
      e.stopPropagation();
      var fileId = e.currentTarget.dataset.fileId;
      fileId = fileId ? fileId : e.currentTarget.parentElement.dataset.fileId;
      var fileExtension = getFileExtension(this.allProjectFiles[fileId].name);
      if (["jpg", "jpeg", "png"].indexOf(fileExtension) > -1) {
        this.closeTab(fileId);
      } else {
        if (
          (fileId == this.activeFileId &&
            this.originalFileContents[fileId] ==
              this.codeMirrors[fileId].getValue()) ||
          (fileId != this.activeFileId &&
            this.originalFileContents[fileId] ==
              this.updatedFileContents[fileId])
        ) {
          this.closeTab(fileId);
        } else {
          if (this.makeUneditable) {
            this.closeTab(fileId);
          } else {
            showConfirmationDialog({
              title: "Close without saving?",
              message:
                "Do you really want to close the file without saving your changes?",
              callback: function(type) {
                if (type == "positive") {
                  this.closeTab(fileId);
                }
              }.bind(this),
              positiveButton: "Close without saving",
              positiveButtonClass: "negative"
            });
          }
        }
      }
    },
    getCodeMirrorModeForFile(fileId) {
      var fileName = this.allProjectFiles[fileId].name;
      var lastDotIndex = fileName.lastIndexOf(".");
      var extension =
        lastDotIndex < 0
          ? ""
          : fileName.substring(lastDotIndex + 1).toLowerCase();
      var mode;
      switch (extension) {
        case "html":
        case "htm":
          mode = "htmlmixed";
          break;
        case "css":
          mode = "css";
          break;
        case "js":
          mode = "javascript";
          break;
        case "py":
          mode = "python";
          break;
        default:
          mode = "htmlmixed";
      }
      return mode;
    },
    saveChanges(options) {
      // For text editor based projects
      var changedFiles = new Object();
      for (var i = 0; i < this.openFileIds.length; i++) {
        var fileId = this.openFileIds[i];
        if (this.codeMirrors[fileId])
          this.updatedFileContents[fileId] = this.codeMirrors[
            fileId
          ].getValue();
      }
      for (var fileId in this.updatedFileContents) {
        if (
          this.updatedFileContents[fileId] != this.originalFileContents[fileId]
        ) {
          changedFiles[fileId] = this.updatedFileContents[fileId];
        }
      }
      if (!Object.keys(changedFiles).length) {
        this.changesExist = false;
        if (this.projectInfo.type == "web") {
          this.runFile(options ? options.fileId : null);
        } else if (this.projectInfo.type == "python") {
          if (options && options.saveAndRun) {
            this.runFile(options ? options.fileId : null);
          }
        }
        return;
      }
      this.$http
        .post("/api/projects/saveProjectFiles", {
          projectId: this.projectId,
          files: changedFiles
        })
        .then(
          function(res) {
            for (var fileId in changedFiles) {
              if (this.originalFileContents.hasOwnProperty(fileId)) {
                this.originalFileContents[fileId] = changedFiles[fileId];
              }
            }
            this.changesExist = false;
            cvNotify("Changes saved.");
            if (this.projectInfo.type == "web") {
              this.runFile(options ? options.fileId : null);
            } else if (this.projectInfo.type == "python") {
              if (options && options.saveAndRun) {
                this.runFile(options ? options.fileId : null);
              }
            }
          }.bind(this)
        )
        .catch(function(err) {
          cvNotify("Failed to save changes.", "error");
        });
    },
    saveScratchProject() {
      // The scratch-gui iframe will handle the saving.
      var outputIframe = $("#scratch-iframe")[0];
      outputIframe = outputIframe.contentWindow || outputIframe.contentDocument;
      outputIframe.postMessage({ action: "initiate_save_project" }, "*");
    },
    onRunButtonClick() {
      this.livePreviewShown = true;
      var file = this.allProjectFiles[this.activeFileId];
      if (
        file &&
        !~["html", "htm", "py"].indexOf(getFileExtension(file.name))
      ) {
        file = null;
      }
      var options = { saveAndRun: true, fileId: file ? file.file_id : null };
      if (options.saveAndRun) {
        this.saveChanges(options);
      }
    },
    onContextMenuRunFileClick(fileid) {
      var options = { saveAndRun: true, fileId: fileid };
      if (options.saveAndRun) {
        this.saveChanges(options);
      }
      this.livePreviewShown = true;
    },
    runFile(fileId) {
      if (this.projectInfo.type == "web") {
        var url;
        if (fileId) {
          this.previewedFileId = fileId;
          var file = this.allProjectFiles[fileId];
          url = this.resolveFilePath(this.projectInfo.projectPath, file);
        } else {
          if (this.previewedFileId) {
            var file = this.allProjectFiles[this.previewedFileId];
            url = this.resolveFilePath(this.projectInfo.projectPath, file);
          } else {
            url = this.projectInfo.projectPath + "/index.html";
          }
        }
        if (this.livePreviewShown) {
          var iframe = document.getElementById("live-preview-iframe");
          iframe.src = url;
        }
        if (this.previewTab) {
          this.previewTab.open(url, "_self");
          return;
        }
      } else if (this.projectInfo.type == "python") {
        this.runPythonCode(fileId);
      }
    },
    onContextMenuRenameClick(fileid) {
      var file = this.allProjectFiles[fileid];
      // var fileType = file.type;
      // var originalName = file.name;
      // var fileName = file.name;
      if (
        file.name === "index.html" &&
        this.projectInfo.type === "web" &&
        !file.parent
      ) {
        cvNotify("Cannot rename index.html file.", "error");
        return;
      }
      if (
        file.name === "main.py" &&
        this.projectInfo.type === "python" &&
        !file.parent
      ) {
        cvNotify("Cannot rename main.py file.", "error");
        return;
      }
      showPromptDialog({
        title: "Rename " + file.type,
        message:
          file.type == "file"
            ? "Supported file extensions:<br><strong>.htm .html .css .js .py</strong>"
            : null,
        prefill: file.name,
        callback: function(options) {
          if (file.type == "file") {
            var lastDotIndex = options.value.lastIndexOf(".");
            var extension = getFileExtension(options.value);
            if (!~["html", "htm", "css", "js", "py"].indexOf(extension)) {
              cvNotify("Unsupported file extension: " + extension, "error");
              return false;
            }
          }
          showProgressOverlay("file-rename");
          this.$http
            .post("/api/projects/renameProjectFile", {
              fileId: fileid,
              name: options.value
            })
            .then(
              function(res) {
                hideProgressOverlay("file-rename");
                if (res.status != 200) {
                } else {
                  this.loadProjectFiles();
                }
                if (file.type == "file") cvNotify("File renamed.");
                else cvNotify("Folder renamed.");
              }.bind(this)
            )
            .catch(err => {
              if (err.body == "already_exists") {
                cvNotify("File name already exists.", "error");
              }
              hideProgressOverlay("file-rename");
            });
          return true;
        }.bind(this),
        positiveButton: "Rename",
        undismissable: false
      });
    },
    previewInNewTab() {
      var url = this.projectInfo.projectPath + "/index.html";
      var win = window.open(url, "_blank");
      this.previewTab = win;
      win.focus();
    },
    reloadPreview() {
      var iframe = document.getElementById("live-preview-iframe");
      iframe.src = iframe.src;
    },
    runPythonCode(fileId) {
      var filePath;
      var file = this.allProjectFiles[fileId];
      if (fileId) {
        filePath = this.resolveFilePath(this.projectInfo.projectPath, file);
      } else {
        filePath = this.projectInfo.projectPath + "/main.py";
      }
      var outputIframe = $("#python-output-iframe")[0];
      outputIframe = outputIframe.contentWindow || outputIframe.contentDocument;
      outputIframe.postMessage({ action: "run_file", file: filePath }, "*");
    },
    uploadFile() {
      var data = new FormData();
      var fileInput = document.getElementById("file-input");
      var file = fileInput.files[0];
      var parentId = this.currentUploadParentId;
      if (!file) return;
      data.append("file", file);
      showProgressOverlay("file-upload");
      this.$http
        .post("/api/projects/uploadProjectFile", data, {
          headers: {
            project_id: this.projectId,
            parent_folder_id: parentId
          }
        })
        .then(function(res) {
          this.loadProjectFiles();
          hideModal("file-upload-modal");
          $("#file-input-file-name").text("");
          hideProgressOverlay("file-upload");
          cvNotify("File uploaded.");
        })
        .catch(err => {
          hideProgressOverlay("file-upload");
          if (err.body == "already_exists") {
            cvNotify("File already exits.", "error");
          }
        });
    },
    scratchEventListener(e) {
      var data = new FormData();
      data.append("file", e.data.data);

      var safe = false;
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        if (~e.origin.indexOf("http://localhost:8601")) {
          safe = true;
        }
      } else {
        if (
          ~e.origin.indexOf("https://codevidhya.com") ||
          ~e.origin.indexOf("https://test.codevidhya.com")
        ) {
          safe = true;
        }
      }
      if (safe) {
        switch (e.data.name) {
          case "saveScratchProject": {
            if (this.savingScratchProject) return;
            this.savingScratchProject = true;
            this.$http
              .post("/api/projects/saveScratchProject", data, {
                headers: {
                  project_id: this.projectId
                }
              })
              .then(function(res) {
                this.savingScratchProject = false;
                cvNotify("Project saved.");
              })
              .catch(function(err) {
                this.savingScratchProject = false;
                cvNotify("Failed to save project", "error");
              });
            break;
          }

          case "closeScratchProject": {
            this.$router.push("/projects");
          }
        }
      }
    },
    resolveFilePath(projectDir, file) {
      projectDir = projectDir.substring(0, projectDir.lastIndexOf("/"));
      return projectDir + "/" + file.path + "/" + file.name;
    },
    updateTimeRemaining() {
      this.projectInfo.code_challenge_time_remaining =
        this.projectInfo.code_challenge_time_remaining - 1000;
      if (this.projectInfo.code_challenge_time_remaining <= 0) {
        this.projectInfo.code_challenge_time_remaining = 0;
        this.doCodeChallengeCompleted(true);
        return;
      }
      var timeRemaining = getTimeHMS(
        this.projectInfo.code_challenge_time_remaining
      );
      if (!timeRemaining[0] && !timeRemaining[1] && !timeRemaining[2]) {
        this.codeChallengeTimeRemainingM = 0;
        this.codeChallengeTimeRemainingS = 0;
        this.projectInfo.code_challenge_time_remaining = 0;
        this.doCodeChallengeCompleted(true);
      } else {
        this.codeChallengeTimeRemainingM = timeRemaining[1];
        this.codeChallengeTimeRemainingS = timeRemaining[2];
        window.setTimeout(this.updateTimeRemaining, 1000);
      }
    },
    doCodeChallengeCompleted(saveChanges) {
      if (saveChanges) {
        if (this.projectInfo.type == "scratch") {
          this.saveScratchProject();
        } else {
          this.saveChanges();
        }
      }
      this.makeUneditable = true;
      showConfirmationDialog({
        title: "Congratulations!",
        message:
          "You have completed " +
          this.projectInfo.code_challenge_name +
          "! Your entry has been saved and submitted automatically. All the best!",
        negativeButton: "Close",
        callback: function() {}
      });
    },
    showInstructions() {
      showModal("code-challenge-question-modal");
    },
    autoSave() {
      if (this.autosavePending) return;
      var vm = this;
      this.autosavePending = true;
      this.autosaveTimeoutId = setTimeout(function() {
        if (vm.projectInfo.type == "scratch") {
          vm.autosavePending = false;
          vm.saveScratchProject();
          vm.autoSave();
        } else {
          if (vm.openFileIds.length) {
            vm.autosavePending = false;
            vm.saveChanges();
            vm.autoSave();
          }
        }
      }, 1000 * 60); // Autosave every 60 seconds
    },
    stopAutosave() {
      if (this.autosaveTimeoutId) {
        clearTimeout(this.autosaveTimeoutId);
        this.autosaveTimeoutId = null;
      }
    }
  }
};
</script>

<style lang="scss">
#project-editor-root {
  position: fixed;
  width: 100%;
  height: 100%;
  #main {
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: row;
    height: 100%;
    padding-top: 59px;
    z-index: -1;
    & > iframe {
      /* Scratch iframe */
      width: 100%;
      height: 100%;
      border: none;
    }
  }
  #file-editor-container {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    height: 100%;
    padding: 16px;
    overflow: hidden;
  }
}
#project-editor__sidebar {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 240px;
  height: 100%;
  background: rgba(26, 188, 156, 0.1);
  #header {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px 16px 8px;
    h3 {
      flex-grow: 1;
      font: bold 1.2rem/1 "Poppins";
    }
    i {
      flex-shrink: 0;
      width: 24px;
      padding: 4px 0;
      text-align: center;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
  #files-list-wrapper {
    flex-grow: 1;
    flex-shrink: 1;
    overflow: hidden;
  }
  #files-list {
    padding: 0 8px;
    .file-group {
      /* padding-left: 16px; */
    }
  }
}

#project-editor-tablayout {
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 100%;
  padding-right: 16px;
  .tabs {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    & > div {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-basis: 1;
      flex-shrink: 1;
      min-width: 0;
      max-width: 160px;
      position: relative;
      padding: 6px 6px 6px 16px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      z-index: 0;
      &:hover {
        background: none;
      }
      &.active {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        background: #1abc9c;
        color: #fff;
      }
      span {
        flex-shrink: 1;
      }
      i {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        margin-left: 4px;
        border-radius: 12px;
        color: rgba(0, 0, 0, 0.3);
        transition: all 200ms;
        &:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      }
    }
  }
  .content {
    position: relative;
    z-index: 100;
    flex-grow: 1;
    flex-shrink: 1;
    overflow: hidden;
    background: #fff;
    border-top: 2px solid #1abc9c;
    &.filepreview.active {
      display: flex;
      overflow: auto;
      img {
        margin: auto;
      }
    }
  }
  #preview-button {
    flex-shrink: 0;
    align-self: center;
    margin-left: 8px;
    padding: 8px;
    font-size: 0.7rem;
    i {
      margin-right: 4px;
    }
  }
  .CodeMirror {
    height: 100%;
  }
}

#project-editor__live-preview-container {
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 100%;
  background: rgba(0, 0, 0, 0.025);
  border-radius: 4px;
  overflow: hidden;
  #live-preview-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px;
    background: #1abc9c;
    color: #fff;
    span {
      padding-left: 16px;
      line-height: 1;
    }
    button {
      width: 30px;
      height: 30px;
      i {
        color: #fff;
      }
    }
  }
  iframe {
    border: none;
  }
  #live-preview-iframe {
    width: 100%;
    flex-grow: 1;
  }
  #python-output-iframe {
    width: 100%;
    flex-grow: 1;
  }
  #scratch-iframe {
    width: 100%;
    height: 100%;
  }
}

#challenge-timer-container,
#scratch-challenge-timer-container {
  flex-shrink: 0;
  margin: 8px;
  padding: 16px;
  background: #000;
  border-radius: 8px;
  color: #fff;
  p {
    margin-bottom: 8px;
  }
  small {
    display: block;
  }
  .show-instructions {
    width: 100%;
    margin-top: 4px;
    padding: 4px 8px;
    border-radius: 48px;
  }
  #challenge-completed {
    display: flex;
    flex-direction: column;
    p {
      text-align: center;
    }
    button {
      width: 100%;
    }
  }
}

#scratch-challenge-timer-container {
  position: fixed;
  left: 64px;
  bottom: 8px;
  z-index: 10001;
}

#code-challenge-question-modal {
  .body {
    h3 {
      margin-bottom: 1rem;
      font: normal 1.3rem/1 "Rubik";
    }
    p,
    li {
      font: normal 1.2rem/1.5 "Rubik";
    }

    span {
      margin-top: 16px;
    }
  }
}

#project-info-modal {
  .body p {
    font-size: 0.9rem;
  }
}
</style>
