<template>
  <div class="container-fliud">
    <!-- Navbar -->
    <Header></Header>
    <!-- /Navbar -->
    <div class="container-fluid" style="padding-top:80px !important;">
      <div class="row bg-secondary">
        <div class="col-sm-2  text-white p-3">
          <h4>Select School</h4>
        </div>
        <div class="col-sm-3 p-2">
          <select
            class="form-control bg-warning"
            v-model="sch_id"
            v-on:change="
              load_classes();
              load_students();
              cls_id = 0;
              sec_id = 0;
            "
          >
            <option value="0">Select School</option>
            <template v-for="school in schools">
              <option :key="school.sch_id" v-bind:value="school.sch_id">{{
                school.name
              }}</option>
            </template>
          </select>
        </div>
        <div class="col-sm-2 p-2">
          <select
            v-if="sch_classes.length && sch_id != 0"
            class="form-control bg-warning"
            v-model="cls_id"
            v-on:change="load_sections(), load_students()"
          >
            <option value="0">Select Grade</option>
            <option
              v-for="classes in sch_classes"
              v-bind:key="classes.cls_id"
              v-bind:value="classes.cls_id"
              >{{ classes.cls_name }}</option
            >
          </select>
        </div>
        <div class="col-sm-2 p-2">
          <select
            v-if="sch_sections.length && sch_id != 0"
            class="form-control bg-warning"
            v-model="sec_id"
            v-on:change="load_students"
          >
            <option value="0">Select Section</option>
            <option
              v-for="sections in sch_sections"
              v-bind:key="sections.sec_id"
              v-bind:value="sections.sec_id"
              >{{ sections.sec_name }}</option
            >
          </select>
        </div>
        <i class="flex flex-fill" />
        <div
          class="col-sm-2 text-white d-flex justify-content-center align-items-center"
        >
          <h4>Total Students:</h4>
          <span class="ml-2 badge badge-primary"
            ><h4>{{ sch_students.length }}</h4></span
          >
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 p-2">
          <div
            class="panel-group1"
            id="staffDetailAccordian"
            role="tablist"
            aria-multiselectable="true"
          >
            <template v-for="(student, index) in sch_students">
              <div
                :key="index"
                class="panel panel-default mb-2 p-0 border mx-auto d-block"
              >
                <div
                  class="panel-heading bg-default"
                  role="tab"
                  id="headingOne"
                >
                  <div
                    class="row p-2"
                    data-toggle="collapse"
                    data-parent="#staffDetailAccordian"
                    :href="'#student' + student.user_id"
                    aria-expanded="false"
                  >
                    <div class="col-sm-1 d-flex align-items-center">
                      <p
                        :class="
                          student.status == 1
                            ? 'badge badge-pill badge-success mr-1  d-inline-block'
                            : 'badge badge-pill badge-danger mr-1  d-inline-block'
                        "
                      >
                        UserId : {{ student.user_id }}
                      </p>
                    </div>
                    <div class="col-sm-9 d-flex align-items-center">
                      {{ student.name }}
                    </div>
                    <div class="col-sm-2 d-flex align-items-center">
                      <!--<input
                        type="button"
                        class="btn btn-warning mr-1"
                        value="Details "
                      />-->
                      <input
                        type="button"
                        class="btn btn-success mr-1"
                        value="Edit "
                        data-toggle="modal"
                        v-on:click="updateDetail = student"
                        onclick="showModal('StudentDetailEditModal')"
                      />
                      <input
                        type="button"
                        class="btn btn-danger"
                        :value="student.status == 1 ? 'Deactivate' : 'Activate'"
                        v-on:click="
                          student.status == 1
                            ? delete_student(student.sch_id, student.user_id, 0)
                            : delete_student(student.sch_id, student.user_id, 1)
                        "
                      />
                    </div>
                  </div>
                </div>
                <div
                  :id="'student' + student.user_id"
                  class="panel-collapse collapse"
                  role="tabpanel"
                  aria-labelledby="headingOne"
                >
                  <div class="panel-body">
                    <div class="row">
                      <div class="col-sm-12 p-2 border-bottom border-secondary">
                        <h3>Personal Detail</h3>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Name: {{ student.name }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Email: {{ student.email }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Contact: {{ student.contact }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>DOB: {{ $moment(student.dob).format("LL") }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Gender: {{ student.sex }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Grade: {{ student.cls_name }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Section: {{ student.sec_name }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>State: {{ student.state }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>City: {{ student.city }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Address: {{ student.address }}</h4>
                      </div>

                      <div class="col-sm-4 p-2">
                        <h4>Username: {{ student.username }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Password: {{ student.password }}</h4>
                      </div>

                      <div class="col-sm-12 p-2 border-bottom border-secondary">
                        <h3>Parent Detail</h3>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Father's Name: {{ student.father_name }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Father's Email: {{ student.father_email_id }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Father's Contact: {{ student.fcontact_no }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>
                          Father's Employer Name: {{ student.f_employer_name }}
                        </h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>
                          Father's Designation: {{ student.f_designation }}
                        </h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Father's Address: {{ student.f_address }}</h4>
                      </div>

                      <div class="col-sm-4 p-2">
                        <h4>Mother's Name: {{ student.mother_name }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Mother's Email: {{ student.mother_email_id }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Mother's Contact: {{ student.mcontact_no }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>
                          Mother's Employer Name: {{ student.m_employer_name }}
                        </h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>
                          Mother's Designation: {{ student.m_designation }}
                        </h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Mother's Address: {{ student.m_address }}</h4>
                      </div>
                      <div class="col-sm-12 p-2 border-bottom border-secondary">
                        <h3>Guardian Detail</h3>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Guardian's Name: {{ student.g_name }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Guardian's Email: {{ student.g_email_id }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Guardian's Contact: {{ student.gcontact_no }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>
                          Guardian's Employer Name:
                          {{ student.g_employer_name }}
                        </h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>
                          Guardian's Designation: {{ student.g_designation }}
                        </h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Mother's Address: {{ student.gaddress }}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <!-- panel-group -->
        </div>
      </div>
    </div>
    <!-- Modal of create new assessment button -->
    <div id="StudentDetailEditModal" class="cv-modal normal ">
      <div
        style="display: flex; flex-direction: column; max-width:3000px; width:98%; height:98%; overflow:auto;"
      >
        <div class="card">
          <div class="card-header bg-secondary text-white">
            <h4>Update Student Detail</h4>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-sm-2 m-1">Student Name</div>
              <div class="col-sm-8 m-1">
                <input
                  class="form-control"
                  v-model="updateDetail.name"
                  placeholder="Staff Name"
                />
              </div>
              <div class="col-sm-2 m-1">Student Grade</div>
              <div class="col-sm-8 m-1">
                <select class="form-control" v-model="updateDetail.cls_id">
                  <template v-for="(grade, index) in sch_classes">
                    <option :key="index" :value="grade.cls_id">{{
                      grade.cls_name
                    }}</option>
                  </template>
                </select>
              </div>
              <div class="col-sm-2 m-1">Student Section</div>
              <div class="col-sm-8 m-1">
                <select class="form-control" v-model="updateDetail.sec_id">
                  <template v-for="(section, index) in all_sections">
                    <option :key="index" :value="section.sec_id">{{
                      section.sec_name
                    }}</option>
                  </template>
                </select>
              </div>

              <div class="col-sm-2 m-1">Email</div>
              <div class="col-sm-8 m-1">
                <input
                  class="form-control"
                  v-model="updateDetail.email"
                  placeholder="Email"
                />
              </div>

              <div class="col-sm-2 m-1">Contact</div>
              <div class="col-sm-8 m-1">
                <input
                  class="form-control"
                  v-model="updateDetail.contact"
                  placeholder="Contact"
                />
              </div>

              <div class="col-sm-2 m-1">State</div>
              <div class="col-sm-8 m-1">
                <input
                  class="form-control"
                  v-model="updateDetail.state"
                  placeholder="State"
                />
              </div>
              <div class="col-sm-2 m-1">City</div>
              <div class="col-sm-8 m-1">
                <input
                  class="form-control"
                  v-model="updateDetail.city"
                  placeholder="City"
                />
              </div>
              <div class="col-sm-2 m-1">Address</div>
              <div class="col-sm-8 m-1">
                <input
                  class="form-control"
                  v-model="updateDetail.address"
                  placeholder="Address"
                />
              </div>

              <div class="col-sm-2 m-1">Password</div>
              <div class="col-sm-8 m-1">
                <input
                  class="form-control"
                  v-model="updateDetail.password"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>
          <div
            class="card-footer d-flex justify-content-center align-items-center p-2"
          >
            <button
              type="button"
              class="btn btn-success mr-1"
              v-on:click="update_student()"
            >
              Update
            </button>
            <button
              type="button"
              class="btn btn-danger"
              onclick="hideModal('StudentDetailEditModal')"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--assessment Modal ends here -->
  </div>
</template>
<script>
import Header from "@/components/header/HeaderMenuForAdmin.vue";
import moment from "vue-moment";
import axios from "axios";
import Loader from "@/components/widgets/BlockingLoader.vue";
export default {
  name: "StudentsDetails",
  components: {
    Header,
    Loader
  },
  data() {
    return {
      sch_id: 0,
      cls_id: 0,
      sec_id: 0,
      st_range: 10,
      schools: [],
      sch_classes: [],
      sch_sections: [],
      sch_students: [],
      all_sections: [],
      st_name: "",
      updt_cls_id: 0,
      updt_sec_id: 0,
      username: "",
      password: "",
      user_id: "",
      updateDetail: []
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    this.display_school();
    this.loadAllSections();
  },
  methods: {
    display_school: function() {
      this.$http.post("/api/user/DisplaySchools").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.schools = res.body.schools;
        }
      });
    },
    load_classes: function() {
      if (this.sch_id == 0) {
        this.sch_classes = [];
        this.sch_sections = [];
        this.cls_id = 0;
        this.sec_id = 0;
      }
      this.$http
        .post("/api/user/School_classes", { sch_id: this.sch_id })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.sch_classes = res.body.all_classes;
          }
        });
    },
    load_sections: function() {
      if (this.cls_id == 0) {
        this.sch_sections = [];
      }
      this.$http
        .post("/api/user/School_sections", {
          sch_id: this.sch_id,
          cls_id: this.cls_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.sch_sections = res.body.all_sections;
          }
        });
    },
    loadAllSections: function() {
      this.all_sections = [];
      this.$http.post("/api/user/All_sections", {}).then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.all_sections = res.body.all_sections;
        }
      });
    },

    load_students: function() {
      this.$http
        .post("/api/user/School_students", {
          sch_id: this.sch_id,
          cls_id: this.cls_id,
          sec_id: this.sec_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.sch_students = res.body.all_students;
          }
        });
    },
    display_student: function(user_id) {
      this.load_sections();
      for (var i = 0; i < this.sch_students.length; i++) {
        if (this.sch_students[i].user_id == user_id) {
          this.user_id = this.sch_students[i].user_id;
          this.st_name = this.sch_students[i].name;
          this.updt_cls_id = this.sch_students[i].cls_id;
          this.updt_sec_id = this.sch_students[i].sec_id;
          this.username = this.sch_students[i].username;
          this.password = this.sch_students[i].password;
          break;
        }
      }
    },
    update_student: function() {
      /*if (this.st_name == "") {
        cvNotify("Student name can not be empty.", "danger");
        return false;
      } else if (this.updt_cls_id == 0) {
        cvNotify("Please provide student class.", "danger");
        return false;
      } else if (this.updt_sec_id == 0) {
        cvNotify("Please provide student section.", "danger");
        return false;
      } else if (this.username == "") {
        cvNotify("Username can not be empty.", "danger");
        return false;
      } else if (this.password == "") {
        cvNotify("Password can not be empty.", "danger");
        return false;
      }*/
      this.$http
        .post("/api/user/Update_student", {
          studentDetails: this.updateDetail
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            if (res.body.data == "done") {
              this.updateDetail = [];
              this.load_students();
              //document.getElementById("close_btn").click();
              hideModal("StudentDetailEditModal");
              cvNotify("You have successfully updated a student.", "info");
            }
          }
        });
    },
    delete_student: function(sch_id, user_id, acivateValue) {
      var msg = confirm("Do you really wants to delete this student?");
      if (msg == true) {
        this.$http
          .post("/api/user/Delete_student", {
            user_id: user_id,
            sch_id: sch_id,
            acivateValue: acivateValue
          })
          .then(function(res) {
            if (res.body.status == "403") {
              //this.$router.push('/login');
            } else {
              if (res.body.data == "done") {
                this.load_students();
                cvNotify("You have successfully deleted a student.", "info");
              }
            }
          });
      }
    }
  }
};
</script>
<style>
table,
td,
th {
  border: thin solid #999;

  border-collapse: collapse;
}
.slidecontainer {
  width: 100%; /* Width of the outside container */
}

/* The slider itself */
.slider {
  -webkit-appearance: none; /* Override default CSS styles */
  appearance: none;
  width: 100%; /* Full-width */
  height: 25px; /* Specified height */
  background: #d3d3d3; /* Grey background */
  outline: none; /* Remove outline */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: 0.2s; /* 0.2 seconds transition on hover */
  transition: opacity 0.2s;
}

/* Mouse-over effects */
.slider:hover {
  opacity: 1; /* Fully shown on mouse-over */
}

/* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
.slider::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #4caf50; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

.slider::-moz-range-thumb {
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #4caf50; /* Green background */
  cursor: pointer; /* Cursor on hover */
}
</style>
