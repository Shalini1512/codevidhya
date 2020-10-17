<template>
  <div class="file-group">
    <div
      class="item-name"
      @click="toggleExpand($event)"
      @dblclick="onFileDoubleClick($event)"
      :data-file-id="file.file_id"
    >
      <i
        v-if="file.type == 'folder' && showChildren"
        class="fas fa-folder-open"
      ></i>
      <i
        v-else-if="file.type == 'folder' && !showChildren"
        class="fas fa-folder"
      ></i>
      <i v-else class="extension" :style="'background:' + fileColor">{{
        extension
      }}</i>
      <span class="singleline">{{ file.name }}</span>
      <i
        v-if="!uneditable"
        class="fas fa-ellipsis-h more"
        :data-file-id="file.file_id"
        @click="showFileContextMenu($event)"
      ></i>
    </div>
    <template v-if="showChildren && file.files">
      <project-file-tree
        v-for="child in file.files"
        :file="child"
        :createProjectFile="createProjectFile"
        :showFileUploadModal="showFileUploadModal"
        :deleteProjectFile="deleteProjectFile"
        :onContextMenuRunFileClick="onContextMenuRunFileClick"
        :onContextMenuRenameClick="onContextMenuRenameClick"
        :openFile="openFile"
        :key="child.file_id"
      ></project-file-tree>
    </template>
  </div>
</template>
<script>
export default {
  props: [
    "file",
    "createProjectFile",
    "showFileUploadModal",
    "deleteProjectFile",
    "onContextMenuRunFileClick",
    "onContextMenuRenameClick",
    "openFile",
    "uneditable"
  ],
  name: "project-file-tree",
  data() {
    return {
      showChildren: false,
      tabCounter: 0,
      fileColors: {
        html: "#27AE60",
        css: "#FF3399",
        js: "#E74C3C",
        default: "#3498DB"
      }
    };
  },
  computed: {
    extension: function() {
      return getFileExtension(this.file.name);
    },
    fileColor: function() {
      switch (this.extension) {
        case "htm":
        case "html":
          return this.fileColors.html;
        case "css":
          return this.fileColors.css;
        case "js":
          return this.fileColors.js;
        default:
          return this.fileColors.default;
      }
    }
  },
  methods: {
    toggleExpand(e) {
      if (!$(e.target).hasClass("more")) this.showChildren = !this.showChildren;
    },
    onFileDoubleClick(e) {
      this.openFile(e.currentTarget.dataset.fileId);
    },
    showFileContextMenu(e) {
      e.stopPropagation();
      var fileId = e.target.dataset.fileId;
      var vm = this;

      function callback(option) {
        switch (option) {
          case "New folder": {
            vm.createProjectFile("folder", fileId);
            break;
          }
          case "New file": {
            vm.createProjectFile("file", fileId);
            break;
          }
          case "Upload file": {
            vm.showFileUploadModal(fileId);
            break;
          }
          case "Preview":
          case "Run": {
            if (~["jpg", "jpeg", "png"].indexOf(vm.extension)) {
              vm.openFile(fileId);
              return;
            }
            vm.onContextMenuRunFileClick(fileId);
            break;
          }
          case "Edit": {
            vm.openFile(fileId);
            break;
          }
          case "Rename": {
            vm.onContextMenuRenameClick(fileId);
            break;
          }
          case "Delete": {
            vm.deleteProjectFile(vm.file.type, fileId);
            break;
          }
        }
      }
      var options;
      if (this.file.type == "folder") {
        options = ["New folder", "New file", "Upload file", "Rename", "Delete"];
      } else {
        if (this.extension == "py") {
          options = ["Run", "Edit", "Rename", "Delete"];
        } else if (~["html", "htm"].indexOf(this.extension)) {
          options = ["Preview", "Edit", "Rename", "Delete"];
        } else if (~["jpg", "jpeg", "png"].indexOf(this.extension)) {
          options = ["Preview", "Rename", "Delete"];
        } else {
          options = ["Edit", "Rename", "Delete"];
        }
      }
      showContextMenu(e.currentTarget, options, callback);
    }
  },
  mounted() {}
};
</script>
<style lang="scss">
#project-editor__sidebar {
  #files-list {
    .file-group {
      padding-left: 16px;
    }
    & > .file-group {
      padding-left: 0;
    }
    .item-name {
      position: relative;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      padding: 4px 8px 4px 16px;
      border-radius: 4px;
      transition: all 300ms;
      cursor: pointer;
      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
      i:first-of-type {
        position: absolute;
        color: rgb(63, 63, 63);
      }
      i.extension {
        min-width: 24px;
        padding: 2px 3px;
        border-radius: 4px;
        background: #000;
        color: #fff;
        text-align: center;
        font-style: normal;
        font-size: 0.6rem;
        line-height: 1;
      }
      i:not(.extension):last-of-type {
        padding: 4px;
        opacity: 0;
        border-radius: 4px;
        transition: all 200ms;
        &:hover {
          color: #fff;
          background: rgba(0, 0, 0, 0.2);
        }
      }
      &:hover {
        i:not(.extension):last-of-type {
          opacity: 0.5;
        }
      }
      span {
        flex-grow: 1;
        padding-left: 28px;
      }
    }
  }
}
</style>
