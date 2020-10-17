<template>
  <div class="container-fliud w-100">
    <!-- Navbar -->
    <Header></Header>
    <!-- /Navbar -->
    <div class="row" style="padding-top:57px;">
      <div class="col-lg-6 col-sm-6">
        <span class="text-white bg-primary row p-3 text-center mx-1">School Register</span>
        <div class="col-sm-12">
          <input class="form-control" type="text" v-model="sch_name" placeholder="School Name" />
        </div>
        <div class="col-sm-12">
          <input class="form-control" type="text" v-model="sch_email" placeholder="Email" />
        </div>
        <div class="col-sm-12">
          <input class="form-control" type="text" v-model="sch_contact" placeholder="Contact" />
        </div>
        <div class="col-sm-12">
          <input class="form-control" type="text" v-model="sch_city" placeholder="City" />
        </div>
        <div class="col-sm-12">
          <input class="form-control" type="text" v-model="sch_state" placeholder="State" />
        </div>
        <div class="col-sm-12">
          <textarea class="input-sm w-100" v-model="sch_address" placeholder="Address"></textarea>
        </div>
        <div class="col-sm-12">
          <input class="form-control" type="text" v-model="sch_dir" placeholder="school folder" />
        </div>
        <div class="col-sm-12">
          <div class="form-group">
            <button class="btn1">School logo</button>
            <input type="file" name="myfile" id="myfile" @change="previewFile" accept="image/png" />
          </div>
          <div class="col-sm-12">
            <div class="image-preview text-center" v-if="logo_img != ''">
              <img class="preview" :src="logo_img" />
            </div>
          </div>
        </div>
        <div class="col-sm-12 p-3 text-center">
          <input
            type="button"
            class="btn btn-success"
            value="Submit"
            v-on:click="school_register()"
          />
        </div>
      </div>
      <div class="col-lg-6 col-sm-6">
        <span class="text-white bg-primary row p-3 text-center mx-1">School All Data</span>
        <div class="form-group text-center mt-1" style="position:relative;">
          <button class="filebtn">Drag and drop annual program file</button>
          <input
            type="file"
            class="dragfile"
            name="myfiles"
            id="myfiles"
            @change="previewFile"
            accept=".csv, .xls, .xlsx"
          />
          <div class="form-group text-center" style="margin:20px;">
            <button class="btn btn-primary" @click="uploadSchoolFile()">Submit</button>
          </div>
        </div>
        <!--after school-->
        <div class="form-group text-center" style="position:relative;">
          <button class="filebtn">Drag and drop after program file</button>
          <input
            type="file"
            class="dragfile"
            name="myfiles"
            id="myafiles"
            @change="previewFile"
            accept=".csv, .xls, .xlsx"
          />
          <div class="form-group text-center" style="margin:20px;">
            <button class="btn btn-primary" @click="uploadAfterSchoolSchoolFile()">Submit</button>
          </div>
        </div>
        <!--end after school-->
      </div>
    </div>
    <Loader v-if="processing" />
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
      token: "",
      sch_name: "",
      sch_email: "",
      sch_contact: "",
      sch_city: "",
      sch_state: "",
      sch_address: "",
      sch_logo: "",
      logo_img: "",
      reg_date: "",
      sch_dir: "",
      processing: false,
      fd: new FormData(),
    };
  },
  beforeCreate() {},
  created() {
    this.reg_date = this.$moment().format("DD-MM-YYYY ");
  },
  beforeMount() {},
  methods: {
    uploadSchoolFile() {
      var data = new FormData();
      var fileInput = document.getElementById("myfiles");
      var file = fileInput.files[0];
      var url = URL.createObjectURL(file);
      if (!file) return;
      data.append("SchoolRecord", file);
      this.processing = true;
      this.$http
        .post("api/adminschooldatamanipulation/uploadSchoolRecord", data)
        .then(res => {
          cvNotify(
            "You have successfully uploaded the school records",
            "success"
          );
          this.processing = false;
          $(".dragfile").text("");
          data = new FormData();
          // }
        });
    },
    uploadAfterSchoolSchoolFile() {
      var data = new FormData();
      var fileInput = document.getElementById("myafiles");
      var file = fileInput.files[0];
      var url = URL.createObjectURL(file);
      if (!file) return;
      data.append("SchoolRecord", file);
      this.$http
        .post("api/adminadterschooldatamanipulation/uploadSchoolRecord", data)
        .then(res => {
          //   if (res.body.status == 1) {
          console.log(res);
          if(res.data =="done")
          cvNotify(
            "You have successfully uploaded the school records",
            "success"
          );
          else
          cvNotify(
            "Something Problem occur",
            "error"
          );
          $(".dragfile").text("");
          data = new FormData();
          // }
        });
    },
    school_register: function() {
      if (this.sch_name == "") {
        notify("School name can not be empty.", "info");
        return false;
      } else if (this.sch_email == "") {
        notify("Email can not be empty.", "info");
        return false;
      } else if (this.sch_contact == "") {
        notify("Please provide valid contact number.", "info");
        return false;
      }
      this.fd.append("name", this.sch_name);
      this.fd.append("email", this.sch_email);
      this.fd.append("contact", this.sch_contact);
      this.fd.append("city", this.sch_city);
      this.fd.append("state", this.sch_state);
      this.fd.append("address", this.sch_address);
      this.fd.append("logo", this.sch_logo);
      this.fd.append("sch_dir", this.sch_dir);

      this.$http.post("/api/user/School_register", this.fd).then(
        function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            if (res.body.data == "done") {
              notify("You have successfully registered a school.", "info");
              this.sch_name = "";
              this.sch_email = "";
              this.sch_contact = "";
              this.sch_city = "";
              this.sch_state = "";
              this.sch_address = "";
              this.logo_img = "";
              this.sch_logo = "";
              this.sch_dir = "";
            }
          }
        },
        function(res) {
          //this.$router.push('/login');
        }
      );
    },
    previewFile: function(event) {
      var input = event.target;
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = e => {
          if (input.id == "myfile") {
            this.logo_img = e.target.result;
            this.sch_logo = event.target.files[0];
          }
        };
        reader.readAsDataURL(input.files[0]);
      }
    }
  }
};
</script>

<style scoped>
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
.btn1 {
  border: 2px dashed #58d68d;
  color: gray;
  background-color: #d5f5e3;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: bold;
  height: 80px;
}
#myfile {
  height: 260px;
  width: 80%;
  position: absolute;
  left: 10%;
  top: 0;
  opacity: 0;
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

.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.upload-btn-wrapper input[type="file"] {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}

.file-upload-form,
.image-preview {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}
img.preview {
  width: 130px;
  height: 100px;
  background-color: white;
  border: 2px solid #58d68d;
  padding: 2px;
}
</style>
