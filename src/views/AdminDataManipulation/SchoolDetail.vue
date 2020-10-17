<template>
  <div class="container-fliud">
    <!-- Navbar -->
    <Header></Header>
    <!-- /Navbar -->
    <div class="container-fluid" style="padding-top:80px !important;">
      <div class="row bg-secondary">
        <div class="col-sm-2  text-white p-3">
          <h4>School Details</h4>
        </div>

        <i class="flex flex-fill" />
        <div
          class="col-sm-2 text-white d-flex justify-content-center align-items-center"
        >
          <h4>Total Schools:</h4>
          <span class="ml-2 badge badge-primary"
            ><h4>{{ schools.length }}</h4></span
          >
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 p-2">
          <div
            class="panel-group1"
            id="schoolDetailAccordian"
            role="tablist"
            aria-multiselectable="true"
          >
            <template v-for="(school, index) in schools">
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
                    data-parent="#schoolDetailAccordian"
                    :href="'#school' + school.sch_id"
                    aria-expanded="false"
                    @click="load_staffs(school.sch_id)"
                  >
                    <div class="col-sm-1 d-flex align-items-center">
                      <p
                        :class="
                          school.status == 1
                            ? 'badge badge-pill badge-success mr-1  d-inline-block'
                            : 'badge badge-pill badge-danger mr-1  d-inline-block'
                        "
                      >
                        SchoolId : {{ school.sch_id }}
                      </p>
                    </div>
                    <div class="col-sm-9 d-flex align-items-center">
                      <h5>{{ school.name }}</h5>
                    </div>
                    <div class="col-sm-2 d-flex align-items-center">
                      <input
                        type="button"
                        class="btn btn-success mr-1"
                        value="Edit "
                        data-toggle="modal"
                        v-on:click="updateDetail = school"
                        onclick="showModal('schoolDetailEditModal')"
                      />
                      <input
                        type="button"
                        class="btn btn-danger"
                        :value="school.status == 1 ? 'Deactivate' : 'Activate'"
                        v-on:click="
                          school.status == 1
                            ? delete_school(school.sch_id, 0)
                            : delete_school(school.sch_id, 1)
                        "
                      />
                    </div>
                  </div>
                </div>
                <div
                  :id="'school' + school.sch_id"
                  class="panel-collapse collapse"
                  role="tabpanel"
                  aria-labelledby="headingOne"
                >
                  <div class="panel-body">
                    <div class="row">
                      <div class="col-sm-4 p-2">
                        <h4>Name: {{ school.name }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Email: {{ school.email }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Contact: {{ school.contact }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>State: {{ school.state }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>City: {{ school.city }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Address: {{ school.address }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Board: {{ school.board }}</h4>
                      </div>
                      <div class="col-sm-4 p-2" v-if="school.grades">
                        <h4 class="d-inline-block mr-2">Grades:</h4>
                        <template
                          v-for="(grade, index) in school.grades.split(',')"
                        >
                          <span :key="index" class="badge  p-2 mr-1">{{
                            grade
                          }}</span>
                        </template>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Username: {{ school.username }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Password: {{ school.password }}</h4>
                      </div>
                      <div class="col-sm-4 p-2"><h4></h4></div>

                      <div class="col-sm-5 p-2">
                        <div class="row p-2 border-bottom border-secondary">
                          <h4>
                            Total Teachers :
                            <span class="badge badge-primary ml-1">{{
                              staffs.length
                            }}</span>
                          </h4>
                        </div>
                        <div
                          class="row p-2"
                          style="height:250px; overflow:auto;"
                        >
                          <table
                            class="table table-vcenter text-nowrap table-primary"
                          >
                            <thead class="bg-primary text-white">
                              <tr class="p-2">
                                <th class="text-white">Sr. No.</th>
                                <th class="text-white">Teacher Name</th>
                                <th class="text-white">Grades Tought</th>
                              </tr>
                            </thead>
                            <tbody>
                              <template v-for="(staff, index) in staffs">
                                <tr :key="index">
                                  <th>{{ index + 1 }}</th>
                                  <td>
                                    {{ staff.name }}
                                  </td>
                                  <td>
                                    {{ staff.grades }}
                                  </td>
                                </tr>
                              </template>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div class="col-sm-2"></div>
                      <div class="col-sm-5 p-2">
                        <div class="row p-2 border-bottom border-secondary">
                          <h4>
                            Total Students :
                            <span class="badge badge-primary ml-1">{{
                              school.total_students
                            }}</span>
                          </h4>
                        </div>
                        <div
                          class="row p-2"
                          style="height:250px; overflow:auto;"
                        >
                          <table
                            class="table table-vcenter text-nowrap table-primary"
                          >
                            <thead class="bg-primary text-white">
                              <tr class="p-2">
                                <th class="text-white">Grade</th>
                                <th class="text-white">Student Count</th>
                              </tr>
                            </thead>
                            <tbody>
                              <template
                                v-for="(grade, index) in school.grades.split(
                                  ','
                                )"
                              >
                                <tr :key="index">
                                  <th>{{ grade }}</th>
                                  <td>
                                    {{
                                      schoolsWithClasses[school.sch_id][grade]
                                    }}
                                  </td>
                                </tr>
                              </template>
                            </tbody>
                          </table>
                        </div>
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

      <!-- Modal of create new assessment button -->
      <div id="schoolDetailEditModal" class="cv-modal normal ">
        <div
          style="display: flex; flex-direction: column; max-width:3000px; width:98%; height:98%; overflow:auto;"
        >
          <div class="card">
            <div class="card-header bg-secondary text-white">
              <h4>Update School Detail</h4>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-sm-2 m-1">School Name</div>
                <div class="col-sm-8 m-1">
                  <input
                    class="form-control"
                    v-model="updateDetail.name"
                    placeholder="School Name"
                  />
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

                <!--<div class="col-sm-2 m-1">Grades</div>
                <div class="col-sm-8 m-1" v-if="updateDetail.grades">
                  <template
                    v-for="(grade, index) in updateDetail.grades.split(',')"
                  >
                    <span :key="index" class="badge badge-secondary p-2 mr-1">{{
                      grade
                    }}</span>
                  </template>
                </div>-->
              </div>
            </div>
            <div
              class="card-footer d-flex justify-content-center align-items-center p-2"
            >
              <button
                type="button"
                class="btn btn-success mr-1"
                v-on:click="update_school()"
              >
                Update
              </button>
              <button
                type="button"
                class="btn btn-danger"
                onclick="hideModal('schoolDetailEditModal')"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <!--assessment Modal ends here -->
    </div>
  </div>
</template>
<script>
import Header from "@/components/header/HeaderMenuForAdmin.vue";
import moment from "vue-moment";
import axios from "axios";
export default {
  name: "SchoolDetails",
  components: {
    Header
  },
  data() {
    return {
      token: "",
      schools: [],
      staffs: [],
      schoolsMap: new Object(),
      schoolsWithClasses: new Object(),
      sch_name: "",
      sch_email: "",
      contact: "",
      city: "",
      state: "",
      address: "",
      sch_id: "",
      username: "",
      password: "",
      processing: false,
      user_id: "",
      updateDetail: []
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.load_schools();
  },
  methods: {
    loadSchoolsWithClasses: function() {
      this.$http
        .post("/api/user/DisplaySchoolsWithClasses")
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push("/login");
          } else {
            var schoolsWithGrades = res.body.schoolsGrades;

            this.schools.forEach(school => {
              var grades = "";
              var totalStudents = 0;
              schoolsWithGrades.forEach(schoolGrades => {
                if (school.sch_id == schoolGrades.sch_id) {
                  grades = grades + schoolGrades.cls_id + ",";
                  totalStudents =
                    totalStudents + parseInt(schoolGrades.total_students);
                  this.schoolsWithClasses[school.sch_id][schoolGrades.cls_id] =
                    schoolGrades.total_students;
                }
              });
              grades = grades.substring(0, grades.length - 1);
              this.schoolsMap[school.sch_id]["grades"] = grades;
              this.schoolsMap[school.sch_id]["total_students"] = totalStudents;
            });
            this.schools = recreateObject(this.schools);
          }
        });
    },
    load_schools: function() {
      this.$http.post("/api/user/DisplaySchools").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push("/login");
        } else {
          this.schools = res.body.schools;
          this.schools.forEach(school => {
            this.schoolsMap[school.sch_id] = school;
            this.schoolsWithClasses[school.sch_id] = {};
          });
          this.loadSchoolsWithClasses();
        }
      });
    },

    load_staffs: function(sch_id) {
      this.$http.post("/api/user/DisplayStaff", { sch_id: sch_id }).then(
        function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.staffs = res.body.staffs;
          }
        },
        function(res) {
          //this.$router.push('/login');
        }
      );
    },

    update_school: function() {
      if (this.updateDetail.name == "") {
        cvNotify("School name can not be empty.", "danger");
        return false;
      } else if (this.updateDetail.email == "") {
        cvNotify("Email can not be empty.", "danger");
        return false;
      } else if (this.updateDetail.password == "") {
        cvNotify("Password can not be empty.", "danger");
        return false;
      }

      this.$http
        .post("/api/user/Update_school", {
          schoolDetail: this.updateDetail
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            if (res.body.data == "done") {
              hideModal("schoolDetailEditModal");
              this.load_schools();
              cvNotify("You have successfully updated a school.", "info");
            }
          }
        });
    },
    delete_school: function(sch_id, acivateValue) {
      var msg = confirm("Do you really wants to delete this school?");
      if (msg == true) {
        this.$http
          .post("/api/user/Delete_school", {
            sch_id: sch_id,
            acivateValue: acivateValue
          })
          .then(function(res) {
            if (res.body.status == "403") {
              //this.$router.push('/login');
            } else {
              if (res.body.data == "done") {
                this.load_schools();
                cvNnotify("You have successfully deleted a school.", "info");
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
</style>
