<template>
  <div class="container-fluid">
    <!-- Navbar -->
    <Header></Header>
    <!-- /Navbar -->
    <div class="container-fluid" style="padding-top:80px !important;">
      <div class="row bg-secondary p-2">
        <i class="flex flex-fill" />
        <span
          class="badge badge-primary mr-1"
          title="Upload questions file"
          style="cursor:pointer"
          onclick="showModal('questionUploadFileModal');"
        >
          <h3><i class="fas fa-upload" /></h3>
        </span>
      </div>
    </div>

    <!------------Upload question file modal------------------------>
    <div id="questionUploadFileModal" class="cv-modal normal">
      <div>
        <div class="header">
          <h3>Upload file</h3>
        </div>
        <div class="body" style="padding: 24px">
          <div class="cv-file-input-group">
            <input type="file" id="uploadfile-input" accept=".xls,.xlsx" />
            <label for="uploadfile-input">
              <span class="selected-file" id="filename-input"></span>
              <span class="choose-file">Choose file</span>
            </label>
            <div style="display:flex; align-items:center; padding:4px 4px; ">
              <label class="text-danger"
                ><i class="fas fa-info-circle" style="padding-top:4px;"></i>
                &nbsp; File should be less than 100Kb.</label
              >
            </div>
          </div>
        </div>
        <div class="footer">
          <button
            class="btn btn-danger"
            onclick="(function() {hideModal('questionUploadFileModal');$('#filename-input').text('');})()"
          >
            Cancel
          </button>
          <button class="btn btn-success" @click="uploadQuestionFile()">
            Upload
          </button>
        </div>
      </div>
    </div>
    <!------------end modal------------------------>
    <Footer />
  </div>
</template>
<script>
import Header from "@/components/header/HeaderMenuForAdmin.vue";
import moment from "vue-moment";
import axios from "axios";
import Loader from "@/components/widgets/BlockingLoader.vue";

export default {
  name: "SchoolRegistration",
  components: {
    Header,
    Loader
  },
  data() {
    return {
      sch_path: "",
      processing: false,
      st_name: "",
      st_dob: "",
      st_email: "",
      st_contact: "",
      st_address: "",
      cls_id: 0,
      sec_id: 0,
      sch_id: 0,
      m_sch_id: 0,
      st_state: "",
      st_city: "",
      sch_classes: [],
      all_sections: [],
      schools: [],
      tabIndex: 0,
      states: {},
      fd: new FormData(),
      datafile: "",
      state_name: "",
      city_name: "",
      reg_date: this.$moment().format("DD-MM-YYYY ")
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  methods: {
    uploadQuestionFile: function() {
      var data = new FormData();
      var fileInput = document.getElementById("uploadfile-input");
      var file = fileInput.files[0];
      var url = URL.createObjectURL(file);
      if (!file) return;
      if (fileInput.files[0].size > 102400) {
        cvNotify("Image should be less than 100kb.", "warning");
        return false;
      }
      data.append("questionFile", file);
      data.append("sch_id", this.sch_id);
      this.$http.post("/api/user/studentActivation", data).then(function(res) {
        if (res.body.status == 1) {
          cvNotify("You have successfully uploaded the questions.", "success");
          $("#filename-input").text("");
          $("#uploadfile-input").val(null);
          hideModal("questionUploadFileModal");
          data = new FormData();
        }
      });
    }
  }
};
</script>

<style>
#html-tab___BV_tab_button__,
#css-tab___BV_tab_button__,
#js-tab___BV_tab_button__ {
  font-size: 1rem;
  border-radius: 0;
  min-width: 64px;
  padding: 0 16px;
  text-align: center;
  transition-duration: 0ms;
  line-height: 18px !important;
}

.filebtn {
  border: 2px dashed #58d68d;
  color: gray;
  background-color: #d5f5e3;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: bold;
  height: 250px;
  width: 80%;
}

.dragfile {
  font-size: 100px;
  height: 260px;
  width: 80%;
  position: absolute;
  left: 10%;
  top: 0;
  opacity: 0;
}
</style>
