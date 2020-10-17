<template>
  <div id="quickbook-root">
    <Header></Header>
    <div
      id="main"
      class="d-flex flex-column"
      :style="'display: ' + (isTopicsLoaded ? 'flex' : 'none!important')"
    >
      <div
        v-if="!welcomeViewClickedThrough"
        style="height: 100%; overflow-y: auto"
      >
        <div
          id="wc-code-input-wrapper"
          class="d-flex flex-row justify-content-center"
        >
          <input placeholder="Enter example code" />
          <button class="cv-button">Go</button>
        </div>

        <div class="text-center mb-4">Select a topic</div>
        <div
          id="wc-topics-wrapper"
          class="d-flex flex-row flex-wrap justify-content-center mb-6"
        >
          <template v-for="topic in topics">
            <div
              v-if="topic.type == 'for_independent_user'"
              :key="topic.fake_id"
              :data-for="'independent_user'"
              :data-skill="topic.skill"
              @click="handleTopicSelectedFromWelcomePage"
              class="topic"
            >
              {{ topic.name }}
            </div>
            <div
              v-else
              :key="topic.item_id"
              :data-topic="topic.topic"
              @click="handleTopicSelectedFromWelcomePage"
              class="topic"
            >
              {{ topic.name }}
            </div>
          </template>

          <div
            v-if="!userId"
            class="d-flex flex-column align-items-center px-6 pb-4"
            style="border-radius: 24px"
          >
            <p class="mb-2">Log in to practice with course related examples.</p>
            <button class="btn btn-primary noshadow" @click="doLogin">
              Log in
            </button>
          </div>
        </div>

        <div class="text-center mb-4">Or pick a language</div>
        <div
          id="wc-languages-wrapper"
          class="d-flex flex-row flex-wrap justify-content-center"
        >
          <div
            id="scratch"
            data-language="scratch"
            @click="handleWelcomePageLanguageSelected"
          >
            <img src="@/assets/images/quickbook/scratch.svg" />
            <p>Scratch</p>
          </div>

          <div
            id="html"
            data-language="html"
            @click="handleWelcomePageLanguageSelected"
          >
            <img src="@/assets/images/quickbook/html.svg" />
            <p>HTML</p>
          </div>

          <div
            id="css"
            data-language="css"
            @click="handleWelcomePageLanguageSelected"
          >
            <img src="@/assets/images/quickbook/css.svg" />
            <p>CSS</p>
          </div>

          <div
            id="javascript"
            data-language="javascript"
            @click="handleWelcomePageLanguageSelected"
          >
            <img src="@/assets/images/quickbook/javascript.svg" />
            <p>JS</p>
          </div>

          <div
            id="python"
            data-language="python"
            @click="handleWelcomePageLanguageSelected"
          >
            <img src="@/assets/images/quickbook/python.svg" />
            <p>Python</p>
          </div>
        </div>
      </div>

      <div
        id="inner-header"
        class="d-flex p-2 align-items-center"
        :style="
          'display: ' + (welcomeViewClickedThrough ? 'flex' : 'none!important')
        "
      >
        <button
          class="cv-button square borderless mr-4"
          @click="resetQuickbook"
        >
          <i class="fas fa-chevron-left" />
        </button>
        <h3 id="quickbook-example-heading">
          {{ selectedTopicName }}
        </h3>
        <i class="flex-grow-1" />
        <div id="language-dropdown-container" class="btn-group mr-1">
          <button
            type="button"
            class="btn btn-warning btn-pill dropdown-toggle"
            data-toggle="dropdown"
          >
            Select topic <i class="fas fa-caret-down"></i>
          </button>
          <ul class="dropdown-menu" role="menu">
            <template v-for="(topic, index) in topics">
              <li
                v-if="topic.type == 'for_independent_user'"
                class="dropdown-plus-title"
                :key="topic.fake_id"
                :data-for="'independent_user'"
                :data-skill="topic.skill"
                @click="handleTopicSelected"
              >
                {{ topic.name }}
              </li>
              <li
                v-else
                class="dropdown-plus-title"
                :key="index"
                :data-topic="topic.topic"
                @click="handleTopicSelected"
              >
                {{ topic.name }}
              </li>
            </template>
            <div v-if="!userId" class="px-2 py-4" style="text-align: center">
              <p class="mb-2" style="font-size: 0.9rem; line-height: 1.3">
                Log in to view course related examples.
              </p>
              <button class="btn btn-primary noshadow" @click="doLogin">
                Log in
              </button>
            </div>
          </ul>
        </div>
        <button
          v-if="examples.length"
          id="view-all-examples-btn"
          class="btn btn-danger btn-pill mr-1"
          title="Examples"
          @click="openExamplesDrawer(true)"
        >
          Examples
        </button>
      </div>
      <!-- END #inner-header -->

      <div
        id="editor-container"
        class="flex-grow-1 d-flex flex-row"
        :style="
          'display: ' +
            (selectedExampleType == 'custom_html' ? 'flex' : 'none!important')
        "
      >
        <!--
        v-if is not used and conditional display property is used
        because the iframe needs to be available for jquery.
        If v-if is used, due to asynchronous behaviour jquery doesn't find
        the iframe.
        -->
        <iframe id="custom-html-iframe"></iframe>
      </div>

      <div
        v-if="selectedExampleType == 'scratch'"
        id="editor-container"
        class="flex-grow-1 d-flex flex-row"
      >
        <iframe
          id="scratch-iframe"
          :src="scratchUrl + '?origin=' + origin + '&file=' + scratchFile"
        ></iframe>
      </div>
      <div
        id="editor-container"
        class="flex-grow-1 d-flex flex-row"
        :style="
          'display: ' +
            (welcomeViewClickedThrough &&
            selectedExampleType &&
            (selectedExampleType == 'web' || selectedExampleType == 'python')
              ? 'flex'
              : 'none!important')
        "
      >
        <!--
          CSS is used to show/hide this element because we need to jQuery it.
          If v-if is used, jQuery can't find it on time in certain situations.
        -->
        <div id="file-editor-tablayout" class="cv-tablayout">
          <div class="tabs">
            <div
              v-for="tab in editorTabs"
              :key="tab.fileType"
              :class="tab.fileType == activeTabFiletype ? 'active' : ''"
              :data-file-type="tab.fileType"
              @click="handleEditorTabClicked"
            >
              <span class="singleline">{{ tab.name }}</span>
            </div>
            <i class="flex-filler"></i>
            <button
              id="preview-button"
              class="btn btn-secondary singleline py-1"
              @click="handleRunButtonClicked"
            >
              <i class="fas fa-play"></i>
              RUN
            </button>
          </div>
          <!--div id="file-content-container" style="display: none"></div-->
        </div>

        <div id="preview-container">
          <div id="preview-header">
            <span class="singleline">Output</span>
          </div>
          <iframe
            v-if="selectedExampleType == 'web'"
            id="web-preview-iframe"
          ></iframe>
          <iframe
            v-if="selectedExampleType == 'python'"
            id="python-output-iframe"
            :src="pyapiUrl"
          ></iframe>
          <iframe
            v-if="selectedExampleType == 'python_fixed_output'"
            id="python-fixed-output-iframe"
          ></iframe>
        </div>
      </div>

      <div id="examples-drawer" class="d-flex flex-column">
        <div class="examples-header d-flex flex-row align-items-center">
          <h5>{{ selectedTopicName }} Examples</h5>
          <i class="flex-grow-1" />
          <button
            class="cv-button square borderless"
            @click="openExamplesDrawer(false)"
          >
            <i class="fas fa-times" />
          </button>
        </div>

        <div class="examples-container flex-grow-1">
          <template v-for="(example, index) in examples">
            <div :key="index" class="example-item">
              <h5>{{ example.title }}</h5>
              <div class="d-flex justify-content-end">
                <span
                  class="badge badge-primary"
                  @click="handleExampleSelected(example.item_id)"
                  >VIEW</span
                >
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <Loader
      v-if="!isTopicsLoaded || processes.length"
      style="position: fixed; top: 45%;"
    />
  </div>
</template>
<script>
import Loader from "@/components/widgets/ContentLoader.vue";
//import Header from "@/components/header/HeaderMenuOnly.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import WebEditor from "@/components/quickbook/WebEditor.vue";
import SqlEditor from "@/components/quickbook/SqlEditor.vue";
import PythonEditor from "@/components/quickbook/PythonEditor.vue";

import { codemirror } from "vue-codemirror";
// require styles
import "codemirror/lib/codemirror.css";
import "codemirror/lib/codemirror.js";

// require active-line.js
import "codemirror/addon/edit/closetag.js";
import "codemirror/addon/fold/xml-fold.js";

import "codemirror/addon/selection/active-line.js";
import "codemirror/addon/edit/matchbrackets.js";

// language js
import "codemirror/mode/xml/xml.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/css/css.js";
import "codemirror/mode/htmlmixed/htmlmixed.js";

export default {
  components: {
    Header,
    codemirror,
    WebEditor,
    SqlEditor,
    PythonEditor,
    Loader
  },
  data() {
    return {
      userId: null,
      welcomeViewClickedThrough: false,
      editorOnly: true,
      editorOnlySelectedLanguage: "html",
      editorOnlyContent: {},

      topics: [],
      examples: [],
      examplesMap: {},
      selectedTopicName: "",

      isTopicsLoaded: false,

      editorTabs: [],
      codeMirrors: {},
      activeTabFiletype: "html",
      selectedExampleId: null,
      selectedExampleType: null,
      selectedExampleContent: {},

      origin: "",
      pyapiUrl: "",
      scratchUrl: "",
      scratchFile: "",

      htmlCode: "",
      jsCode: "",
      cssCode: "",
      quickExamples: [],
      expNo: "",
      qrCode: "",
      langSelected: 1,
      editorTheme: "",
      selectedLanguageName: "HTML&CCC",
      selectedLanguage: "",
      pythonEditor: false,
      windowWidth: 0,
      windowHeight: 0,
      tabIndex: 0,
      codeId: "",
      exportCode: 0,
      foldername: "",
      //sql Editor
      sqlEditor: false,
      sqlStatement: "SELECT * FROM Customers ORDER BY CustomerName ASC",
      texteditor: "SELECT * FROM Customers ORDER BY CustomerName ASC",
      sqlcmOptions: {
        mode: "text/x-mysql",
        htmlMode: true,
        lineWrapping: true,
        smartIndent: true,
        addModeClass: true,
        lineNumbers: true,
        line: true
      },
      cvWebSQL1: "",
      cvWebSQLOK: !!window.openDatabase,
      statementSupport: "",
      databasePane: false,
      processes: []
    };
  },
  computed: {
    pageContainerHeight() {
      return this.windowHeight - 59;
    }
    /*selectedLanguageName() {
      if (this.pythonEditor) {
        return "Python";
      } else if (this.sqlEditor) {
        return "SQL";
      } else {
        return "HTML&CSS";
      }
    }*/
  },
  created() {
    if (this.$route.query.cont) {
      this.qrCode = this.$route.query.cont;
      this.searchQr();
      this.$router.push("/quickbook");
    }
  },
  beforeMount() {
    /*this.loadCode(
      this.$store.getters.getAuthData.auth_cls_id,
      this.$store.getters.getAuthData.auth_role_id
    );
    if (this.$store.getters.getAuthData.auth_cls_id >= 8) {
      this.pythonEditor = true;
    }*/

    this.origin = window.location.origin;
    if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
      this.pyapiUrl = "http://localhost:3500";
      this.scratchUrl = "http://localhost:8601";
    } else {
      this.pyapiUrl = "https://pyapi.codevidhya.com";
      this.scratchUrl = "https://codevidhya.com/scratch";
    }
  },
  mounted: function() {
    //initCvModals();
    cvAuth.getUserId(
      function(userId) {
        this.userId = userId;
        if (userId) {
          // this.userId = userId;
          this.cls_id = this.$store.getters.getAuthData.auth_cls_id;
          this.user_id = this.$store.getters.getAuthData.auth_user_id;
          this.sec_id = this.$store.getters.getAuthData.auth_sec_id;
          this.role_id = this.$store.getters.getAuthData.auth_role_id;
          this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
        }
      }.bind(this)
    );
    hideTawk();

    this.getTopics();
  },
  methods: {
    doLogin() {
      loginAndRedirectBack(this.$router);
    },
    resetQuickbook() {
      this.welcomeViewClickedThrough = false;
      this.selectedExampleType = null;
    },
    handleWelcomePageLanguageSelected(e) {
      this.welcomeViewClickedThrough = true;
      this.editorOnly = true;
      this.editorOnlySelectedLanguage = e.currentTarget.dataset.language;

      switch (this.editorOnlySelectedLanguage) {
        case "scratch": {
          this.selectedExampleType = "scratch";
          this.selectedTopicName = "Scratch";
          this.scratchFile = "/api/quickbook/getScratchFile/" + 0; // 0 for default blank project
          break;
        }
        case "html": {
          this.selectedExampleType = "web";
          this.selectedTopicName = "HTML";
          var content =
            '{"html": "PCFkb2N0eXBlIGh0bWw+CjxodG1sPgogICAgPGhlYWQ+CiAgICAgICAgPHRpdGxlPlByYWN0aWNlIEhUTUw8L3RpdGxlPgogICAgPC9oZWFkPgogICAgPGJvZHk+CiAgICAgICAgPGgxPkVkaXQgdGhpcyBleGFtcGxlIHRvIHBsYXkgYXJvdW5kIHdpdGggSFRNTC48L2gxPgogICAgPC9ib2R5Pgo8L2h0bWw+Cg=="}';
          this.initEditor(content);
          var data = JSON.parse(content);
          setTimeout(this.showWebExampleOutput, 1000, atob(data.html));
          break;
        }
        case "css": {
          this.selectedExampleType = "web";
          this.selectedTopicName = "CSS";
          var content = `
            {
              "html": "PCFkb2N0eXBlIGh0bWw+CjxodG1sPgogICAgPGhlYWQ+CiAgICAgICAgPHRpdGxlPlByYWN0aWNlIEhUTUwgJiBDU1M8L3RpdGxlPgogICAgICAgIDxsaW5rIHJlbD0ic3R5bGVzaGVldCIgdHlwZT0idGV4dC9jc3MiIGhyZWY9InN0eWxlLmNzcyIgLz4KICAgIDwvaGVhZD4KICAgIDxib2R5PgogICAgICAgIDxoMT5FZGl0IHRoaXMgZXhhbXBsZSB0byBwbGF5IGFyb3VuZCB3aXRoIEhUTUwgYW5kIENTUy48L2gxPgogICAgPC9ib2R5Pgo8L2h0bWw+Cg==",
              "css": "LyogRWRpdCB0aGlzIGZpbGUgdG8gc3R5bGUgeW91ciBIVE1MIHBhZ2UgKi8KaDEgewogICAgdGV4dC1hbGlnbjogY2VudGVyOwp9Cg=="
            }
            `;
          this.initEditor(content);
          var data = JSON.parse(content);
          setTimeout(
            this.showWebExampleOutput,
            1000,
            atob(data.html),
            atob(data.css)
          );
          break;
        }
        case "javascript": {
          this.selectedExampleType = "web";
          this.selectedTopicName = "JavaScript";
          var content = `
            {
              "html": "PCFkb2N0eXBlIGh0bWw+CjxodG1sPgogICAgPGhlYWQ+CiAgICAgICAgPHRpdGxlPlByYWN0aWNlIEhUTUwgJiBDU1M8L3RpdGxlPgogICAgICAgIDxsaW5rIHJlbD0ic3R5bGVzaGVldCIgdHlwZT0idGV4dC9jc3MiIGhyZWY9InN0eWxlLmNzcyIgLz4KICAgIDwvaGVhZD4KICAgIDxib2R5PgogICAgICAgIDxoMT5FZGl0IHRoaXMgZXhhbXBsZSB0byBwbGF5IGFyb3VuZCB3aXRoIEhUTUwsIENTUyBhbmQgSmF2YVNjcmlwdC48L2gxPgoKICAgICAgICA8c2NyaXB0IHR5cGU9InRleHQvamF2YXNjcmlwdCIgc3JjPSJzY3JpcHQuanMiPjwvc2NyaXB0PgogICAgPC9ib2R5Pgo8L2h0bWw+Cg==",
              "css": "LyogRWRpdCB0aGlzIGZpbGUgdG8gc3R5bGUgeW91ciBIVE1MIHBhZ2UgKi8KYm9keSB7CiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7Cn0K",
              "js": "LyogV3JpdGUgeW91ciBKYXZhU2NyaXB0IGNvZGUgaGVyZSAqLwoKZG9jdW1lbnQud3JpdGUoIlRoaXMgdGV4dCBpcyBmcm9tIEphdmFTY3JpcHQiKTsK"
            }
            `;
          this.initEditor(content);
          var data = JSON.parse(content);
          setTimeout(
            this.showWebExampleOutput,
            1000,
            atob(data.html),
            atob(data.css),
            atob(data.js)
          );
          break;
        }
        case "python": {
          this.selectedExampleType = "python";
          this.selectedTopicName = "Python";
          var content = `
            {
              "py": "IyBFZGl0IHRoaXMgZmlsZSB0byBwcmFjdGlzZSB5b3VyIFB5dGhvbiBza2lsbHMKCnByaW50KCJIZWxsbywgV29ybGQhIikK"
            }
            `;
          this.initEditor(content);
        }
      }
    },
    getTopics() {
      this.$http
        .post("/api/quickbook/getTopics")
        .then(res => {
          this.topics = res.body;
          this.isTopicsLoaded = true;
        })
        .catch(err => {});
    },
    handleTopicSelectedFromWelcomePage(e) {
      this.handleTopicSelected(e);
      this.welcomeViewClickedThrough = true;
    },
    handleTopicSelected(e) {
      var forUserType = e.currentTarget.dataset.for;
      var data = new Object();
      if (forUserType == "independent_user") {
        var skill = e.currentTarget.dataset.skill;
        data.skill = skill;
      } else {
        var topic = e.currentTarget.dataset.topic;
        data.topic = topic;
      }

      this.processes.push("a");
      this.$http
        .post("/api/quickbook/getExamplesInTopic", data)
        .then(res => {
          this.selectedTopicName = res.body.topicName;
          this.examples = res.body.examples;
          this.examplesMap = new Object();
          for (var i = 0; i < this.examples.length; i++) {
            this.examplesMap[this.examples[i].item_id] = this.examples[i];
          }
          this.handleExampleSelected(this.examples[0].item_id);
          this.processes.pop();
        })
        .catch(err => {
          this.processes.pop();
        });
    },
    handleIndependentUserTopicSelected() {},
    openExamplesDrawer(open) {
      if (open) {
        $("#examples-drawer").addClass("active");
      } else {
        $("#examples-drawer").removeClass("active");
      }
    },
    handleExampleSelected(exampleId) {
      this.selectedExampleId = exampleId;
      var example = this.examplesMap[exampleId];
      this.selectedExampleType = example.type;
      if (this.selectedExampleType === "scratch") {
        this.openExamplesDrawer(false);
        this.scratchFile = "/api/quickbook/getScratchFile/" + exampleId;
      } else if (this.selectedExampleType === "custom_html") {
        var content = JSON.parse(example.content);
        content = atob(content.custom_html);
        this.displayCustomHTMLExample(content);
        this.openExamplesDrawer(false);
      } else {
        this.openExamplesDrawer(false);
        this.initEditor(example.content);
      }
    },
    handleEditorTabClicked(e) {
      $("#file-editor-tablayout .tabs > div").removeClass("active");
      $(e.currentTarget).addClass("active");
      var fileType = e.currentTarget.dataset.fileType;
      $("#file-editor-tablayout .content").removeClass("active");
      $("#file-content-" + fileType).addClass("active");
    },
    initEditor(contentJSON) {
      var content = JSON.parse(contentJSON);
      this.selectedExampleContent = content;
      $("#file-editor-tablayout .content").remove();
      this.editorTabs = new Array();
      this.codeMirrors = new Object();
      var activeFileChosen = false;
      if (content.html) {
        this.editorTabs.push({
          name: "index.html",
          fileType: "html",
          active: true
        });
        this.addCodeMirror("html", content.html, true);
        activeFileChosen = true;
      }
      if (content.css) {
        this.editorTabs.push({ name: "style.css", fileType: "css" });
        var active = false;
        if (!activeFileChosen && !content.js && !content.py) active = true;
        this.addCodeMirror("css", content.css, active);
      }
      if (content.js) {
        this.editorTabs.push({ name: "script.js", fileType: "js" });
        var active = false;
        if (!activeFileChosen && !content.py) active = true;
        this.addCodeMirror("js", content.js, active);
      }
      if (content.py) {
        this.editorTabs.push({ name: "main.py", fileType: "py" });
        var active = false;
        if (!activeFileChosen) active = true;
        this.addCodeMirror("py", content.py, active);
      }
    },
    getCodeMirrorModeForFileType(fileType) {
      var mode;
      switch (fileType) {
        case "html":
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
    addCodeMirror(fileType, fileContent, active) {
      if (active) this.activeTabFiletype = fileType;
      var cmContainer = document.createElement("div");
      cmContainer.id = "file-content-" + fileType;
      if (active) cmContainer.className = "content active";
      else cmContainer.className = "content";
      $("#file-editor-tablayout").append(cmContainer);
      var contentDecoded = atob(fileContent);
      this.codeMirrors[fileType] = CodeMirror(cmContainer, {
        value: contentDecoded,
        mode: this.getCodeMirrorModeForFileType(fileType),
        lineNumbers: true,
        styleActiveLine: true,
        styleActiveSelected: true,
        styleSelectedText: true,
        // autoCloseTags: true,
        autoCloseBrackets: true,
        autoRefresh: true,
        line: true,
        connect: "align",
        lineWrapping: true,
        matchTags: { bothTags: true },
        colorpicker: true,
        fileName: "file",
        readOnly:
          this.selectedExampleType == "python_fixed_output" ? true : false
      });
      this.codeMirrors[fileType].on(
        "change",
        function() {
          // this.changesExist = true;
        }.bind(this)
      );
      this.codeMirrors[fileType].refresh();
    },
    handleRunButtonClicked() {
      switch (this.selectedExampleType) {
        case "python": {
          var code = this.codeMirrors.py.getValue();
          this.runPythonCode(code);
          break;
        }
        case "python_fixed_output": {
          var outputHTML = atob(this.selectedExampleContent.fixed_output);
          var outputIframe = $("#python-fixed-output-iframe")[0];
          outputIframe.innerHTML = "";
          outputIframe =
            outputIframe.contentWindow || outputIframe.contentDocument;
          if (outputIframe.document) outputIframe = outputIframe.document;
          outputIframe.open();
          outputIframe.write(outputHTML);
          outputIframe.close();
          break;
        }
        case "web": {
          var outputHTML = this.codeMirrors.html.getValue();
          var outputCSS;
          var outputJS;

          if (this.codeMirrors.css) {
            outputCSS = this.codeMirrors.css.getValue();
          }

          if (this.codeMirrors.js) {
            outputJS = this.codeMirrors.js.getValue();
          }
          this.showWebExampleOutput(outputHTML, outputCSS, outputJS);
          break;
        }
      }
    },
    showWebExampleOutput(html, css, js) {
      var outputHTML = html;
      if (this.codeMirrors.css) {
        outputHTML += "<style>" + this.codeMirrors.css.getValue() + "<\/style>";
      }

      if (this.codeMirrors.js) {
        outputHTML +=
          "<script>" + this.codeMirrors.js.getValue() + "<\/script>";
      }

      var outputIframe = $("#web-preview-iframe")[0];
      outputIframe.innerHTML = "";
      outputIframe = outputIframe.contentWindow || outputIframe.contentDocument;
      if (outputIframe.document) outputIframe = outputIframe.document;
      outputIframe.open();
      outputIframe.write(outputHTML);
      outputIframe.close();
    },
    runPythonCode(code) {
      var outputIframe = $("#python-output-iframe")[0];
      outputIframe = outputIframe.contentWindow || outputIframe.contentDocument;
      outputIframe.postMessage({ action: "run_script", code: code }, "*");
    },
    displayCustomHTMLExample(content) {
      var outputIframe = $("#custom-html-iframe")[0];
      outputIframe.innerHTML = "";
      outputIframe = outputIframe.contentWindow || outputIframe.contentDocument;
      if (outputIframe.document) outputIframe = outputIframe.document;
      outputIframe.open();
      outputIframe.write(content);
      outputIframe.close();
    }
  }
};
</script>
<style lang="scss">
#quickbook-root {
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  #main {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    padding-top: 59px;
    z-index: -1;
  }

  #wc-code-input-wrapper {
    margin-top: 56px;
    margin-bottom: 48px;
    input {
      height: 48px;
      padding-right: 56px;
      background: #f2f5f9;
      border: none;
      border-radius: 100px;
      box-shadow: 4px 8px 12px rgba(0, 0, 0, 0.1),
        -4px -4px 8px rgba(255, 255, 255, 1);
      transition: all 300ms;
      &:focus {
        border-color: rgba(35, 136, 252, 0.3);
        box-shadow: 4px 12px 16px 4px rgba(0, 0, 0, 0.1),
          -4px -4px 16px 4px rgba(255, 255, 255, 1);
      }
    }
    button {
      width: 56px;
      height: 48px;
      margin-left: -56px;
      border: none;
      border-radius: 50%;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      box-shadow: none;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 1;
      }
    }
  }

  #wc-topics-wrapper {
    padding: 0 24px;
    .topic {
      flex-shrink: 0;
      margin: 0 8px 16px;
      padding: 8px 16px;
      border-radius: 16px;
      background: #f2f5f9;
      box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1),
        -4px -4px 8px rgba(255, 255, 255, 1);
      transition: all 150ms;
      cursor: pointer;
      &:hover {
        transform: scale(1.1);
      }
      &:active {
        transition: all 50ms;
        transform: scale(1);
        box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1),
          -4px -4px 8px rgba(255, 255, 255, 1);
      }
    }
  }

  #wc-languages-wrapper {
    & > div {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 16px 24px;
      padding: 24px 24px 16px;
      border: 2px solid #ff0;
      border-radius: 24px;
      box-shadow: 4px 8px 16px rgba(0, 0, 0, 0.15),
        -4px -4px 8px 4px rgba(255, 255, 255, 1);
      transition: all 150ms;
      cursor: pointer;
      &:hover {
        transform: scale(1.1);
      }
      img {
        width: 72px;
        margin-bottom: 8px;
      }
      p {
        font-family: "Poppins";
      }
    }

    #scratch {
      background-color: #12aef633;
      border-color: #12adf6;
    }

    #html {
      background-color: #fc490b33;
      border-color: #fc490b;
    }

    #css {
      background-color: #0277bd33;
      border-color: #0277bd;
    }

    #javascript {
      background-color: #e7a42b33;
      border-color: #e7a42b;
    }

    #python {
      background-color: #3779af33;
      border-color: #3779af;
    }
  }

  #inner-header {
    * {
      line-height: 1;
    }
    h3 {
      font-size: 1.2rem;
      font-weight: 700;
    }
  }
  #language-dropdown-container {
    button {
      padding: 8px 12px;
      &:hover,
      &:active {
        z-index: initial !important;
      }
    }
    ul {
      margin-top: -4px;
    }
    li {
      border: none !important;
      transition: all 200ms;
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }

  #view-all-examples-btn {
    padding: 8px 12px;
  }

  #editor-container {
    min-height: 0;
    padding: 0 8px 8px;
    #scratch-iframe,
    #custom-html-iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }

  #file-editor-tablayout {
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
        padding: 6px 16px;
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
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
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
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 1;
      }
      &:focus {
        outline: none;
        box-shadow: none;
      }
    }
    .CodeMirror {
      height: 100%;
    }
  }

  #preview-container {
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 100%;
    background: rgba(0, 0, 0, 0.025);
    border-radius: 4px;
    overflow: hidden;
    #preview-header {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 34px;
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
      height: 100%;
      border: none;
    }
    #preview-iframe {
      width: 100%;
      flex-grow: 1;
    }
    #python-output-iframe {
      width: 100%;
      flex-grow: 1;
    }
  }

  #examples-drawer {
    position: absolute;
    bottom: 0;
    right: -300px;
    width: 300px;
    height: calc(100% - 59px);
    background: #efefef;
    padding: 0 16px;
    transition: all 300ms;
    &.active {
      right: 0;
      box-shadow: -4px 0 8px rgba(0, 0, 0, 0.2);
    }
    .examples-header {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 8px 0;
      h5 {
        font-weight: bold;
      }
      i {
        width: 32px;
        height: 32px;
        line-height: 32px;
        text-align: center;
      }
    }

    .examples-container {
      overflow-y: auto;
    }

    .example-item {
      h5 {
        margin-bottom: 8px;
      }
      width: 100%;
      margin-bottom: 8px;
      padding: 16px;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 4px;
    }
  }
}
</style>
