<template>
  <div class="container-fluid">
    <!-- Navbar -->
    <Header></Header>
    <!-- /Navbar -->
    <div class="row" style="padding-top:57px;">
      <div style="width:100%;">
        <b-tabs v-model="tabIndex" style="height:100%;">
          <b-tab
            title="All Staff Members"
            id="html-tab"
            :title-link-class="linkClass(0)"
          >
          </b-tab>
          <b-tab
            title="Staff Register"
            id="css-tab"
            :title-link-class="linkClass(1)"
          >
            <div class="row">
              <div class="col-sm-6" style="padding-left:20px;">
                <div class=" bg-info p-2 text-white">
                  <strong>Single Registration</strong>
                </div>
                <div class="form-group">
                  <label for="st_grade">School</label>
                  <select
                    class="form-control"
                    v-model="sch_id"
                    id="sch_id"
                    @change="setpath(sch_id)"
                  >
                    <option value="0">select school</option>
                    <option
                      v-for="school in schools"
                      v-bind:key="school.sch_id"
                      v-bind:value="school.sch_id"
                      >{{ school.name }}</option
                    >
                  </select>
                </div>
                <div class="form-group">
                  <label for="st_name">Name</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="name"
                    id="st_name"
                    aria-describedby="name"
                    placeholder="Enter name"
                  />
                </div>
                <div class="form-group">
                  <label for="st_email">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    v-model="email"
                    id="st_email"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                  />
                </div>
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="st_contact">Contact</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="contact"
                      id="st_contact"
                      aria-describedby="contact"
                      placeholder="Enter contact"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="st_board">State </label>
                    <select
                      class="form-control"
                      v-model="state"
                      id="st_state"
                      @change="state_name = states[state].state"
                    >
                      <option value="">Select state</option>
                      <option
                        v-for="(state, index) in states"
                        v-bind:key="index"
                        v-bind:value="index"
                        >{{ state.state }}</option
                      >
                    </select>
                  </div>
                  <div
                    class="form-group col-md-6"
                    v-if="states && states[state]"
                  >
                    <label for="st_board">City </label>
                    <select
                      class="form-control"
                      v-model="city"
                      id="st_city"
                      @change="city_name = states[state].districts[city]"
                    >
                      <option value="">Select city</option>
                      <option
                        v-for="(city, index) in states[state].districts"
                        v-bind:key="index"
                        v-bind:value="index"
                        >{{ city }}</option
                      >
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label for="st_address">Address</label>
                  <textarea
                    class="form-control"
                    v-model="address"
                    id="st_address"
                    rows="3"
                  ></textarea>
                </div>
                <div class="form-group text-center">
                  <button
                    class="btn btn-primary"
                    @click="set_validation('single')"
                  >
                    Submit
                  </button>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="row bg-info p-2 text-white">
                  <strong>Multiple Registration</strong>
                </div>
                <div class="form-group">
                  <label for="st_grade">School</label>
                  <select
                    class="form-control"
                    v-model="m_sch_id"
                    id="m_sch_id"
                    @change="setpath(m_sch_id)"
                  >
                    <option value="0">select school</option>
                    <option
                      v-for="school in schools"
                      v-bind:key="school.sch_id"
                      v-bind:value="school.sch_id"
                      >{{ school.name }}</option
                    >
                  </select>
                </div>
                <div
                  class="form-group text-center"
                  style="position:relative; top:15%;"
                >
                  <button class="filebtn">Drag and drop a file</button>
                  <input
                    type="file"
                    class="dragfile"
                    name="myfiles"
                    id="myfiles"
                    @change="previewFile"
                    accept=".csv"
                  />
                  <div class="form-group text-center" style="margin:20px;">
                    <button
                      class="btn btn-primary"
                      @click="set_validation('multi')"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </b-tab>
          <b-tab
            title="Multi Register"
            id="js-tab"
            :title-link-class="linkClass(2)"
          >
          </b-tab>
        </b-tabs>
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
  name: "StaffRegistration",
  components: {
    Header,
    Loader
  },
  data() {
    return {
      sch_path: "",
      name: "",
      email: "",
      contact: "",
      address: "",
      sch_id: 0,
      m_sch_id: 0,
      state: "",
      city: "",
      sch_classes: [],
      all_sections: [],
      schools: [],
      tabIndex: 0,
      states: {},
      processing: false,
      fd: new FormData(),
      datafile: "",
      state_name: "",
      city_name: "",
      reg_date: this.$moment().format("DD-MM-YYYY ")
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    this.load_classes();
    this.load_sections();
    this.load_schools();
    var mv = this;
    $.getJSON("/static/states/states.json", function(data) {
      mv.states = data.states;
    });
  },
  methods: {
    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ["bg-info", "text-light"];
      } else {
        return ["bg-light", "text-info"];
      }
    },
    setpath: function(sch_id) {
      for (var i = 0; i < this.schools.length; i++) {
        if (this.schools[i].sch_id == sch_id) {
          this.sch_path = this.schools[i].path;
        }
      }
    },
    load_classes: function() {
      this.$http.post("/api/user/School_classes").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.sch_classes = res.body.all_classes;
        }
      });
    },
    load_sections: function() {
      this.$http.post("/api/user/All_sections").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.all_sections = res.body.all_sections;
        }
      });
    },
    load_schools: function() {
      this.$http.post("/api/user/DisplaySchools").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.schools = res.body.schools;
        }
      });
    },
    set_validation: function(reg_type) {
      if (reg_type == "single") {
        if (this.sch_id == 0 && this.name == "") {
          $("#sch_id").addClass("border border-danger");
          $("#st_name").addClass("border border-danger");
          cvNotify("Feilds are madetory to fill", "danger");
          return false;
        } else {
          $("#sch_id").removeClass("border border-danger");
          $("#st_name").removeClass("border border-danger");
          this.staff_register("single");
        }
      } else if (reg_type == "multi") {
        if (this.m_sch_id != 0 && this.datafile != "") {
          $("#m_sch_id").removeClass("border border-danger");
          this.fd.append("sch_id", this.m_sch_id);
          this.fd.append("schoolPath", this.sch_path);
          this.fd.append("datafile", this.datafile);
          this.staff_register("multi");
        } else if (this.m_sch_id == 0 || this.datafile == "") {
          if (this.m_sch_id == 0) {
            $("#m_sch_id").addClass("border border-danger");
            cvNotify("please select a school.", "danger");
          } else if (this.datafile == "") {
            cvNotify("Please select a csv file.", "danger");
          }
        }
      }
    },
    previewFile: function(event) {
      var input = event.target;

      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = e => {
          if (input.id == "myfiles") {
            this.datafile = event.target.files[0];
          }
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
    staff_register: function(reg_type) {
      if (reg_type == "single") {
        this.$http
          .post("/api/user/Staff_register", {
            sch_id: this.sch_id,
            name: this.name,
            email: this.email,
            contact: this.contact,
            state: this.state_name,
            city: this.city_name,
            address: this.address,
            schoolPath: this.sch_path,
            reg_date: this.reg_date
          })
          .then(
            function(res) {
              if (res.body.status == "403") {
                //this.$router.push('/login');
              } else {
                if (res.body.data == "done") {
                  cvNotify(
                    "You have successfully registered a staff member.",
                    "info"
                  );
                  this.sch_id = 0;
                  this.name = "";
                  this.email = "";
                  this.contact = "";
                }
              }
            },
            function(res) {
              //this.$router.push('/login');
            }
          );
      } else if (reg_type == "multi") {
        this.$http.post("/api/user/Multi_staff_register", this.fd).then(
          function(res) {
            if (res.body.status == "403") {
              //this.$router.push('/login');
            } else {
              if (res.body.data == "done") {
                cvNotify("You have successfully registered students.", "info");
              }
            }
          },
          function(res) {
            //this.$router.push('/login');
          }
        );
      }
    }
  },
  mounted: function() {
    window.addEventListener("load", () => {});
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
