<template>
  <div id="base64-root">
    <div id="converter-container" class="d-flex flex-row flex-grow-1">
      <div class="d-flex flex-column">
        <input type="file" id="file-input" />
        <textarea v-model="raw" class="flex-grow-1"></textarea>
      </div>
      <div class="d-flex flex-row">
        <textarea v-model="encoded"></textarea>
      </div>
    </div>
    <div id="footer">
      <button class="cv-button noshadow" @click="handleResetClicked">
        Reset
      </button>
      <button class="cv-button noshadow" @click="handleDecodeClicked">
        Decode
      </button>
      <button class="cv-button noshadow" @click="handleEncodeClicked">
        Encode
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      raw: "",
      encoded: ""
    };
  },
  mounted() {
    setTimeout(hideTawk, 1000);
  },
  methods: {
    handleEncodeClicked() {
      var files = $("#file-input")[0].files;
      if (files.length) {
        var reader = new FileReader();
        reader.onload = function(e) {
          this.encoded = btoa(e.target.result);
        }.bind(this);
        reader.readAsBinaryString(files[0]);
      } else if (this.raw.length) {
        this.encoded = btoa(this.raw);
      } else {
        this.encoded = "";
      }
    },
    handleDecodeClicked() {
      this.raw = atob(this.encoded);
    },
    handleResetClicked() {
      $("#file-input").val("");
      this.encoded = "";
      this.raw = "";
    }
  }
};
</script>

<style lang="scss">
#base64-root {
  #converter-container {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding-bottom: 72px;
    & > div {
      width: 50%;
      height: 100%;
    }
    input {
      height: auto;
      margin: 16px 16px 0;
      padding: 16px 24px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      cursor: pointer;
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
    textarea {
      flex-grow: 1;
      margin: 16px;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
  }
  #footer {
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding: 16px;
    z-index: 100;
    button {
      height: auto;
      margin: 0 4px;
      padding: 16px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: rgb(240, 56, 0);
      color: #fff;
    }
  }
}
</style>
