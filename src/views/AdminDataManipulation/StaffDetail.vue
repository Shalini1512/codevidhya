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
        <div class="col-sm-4 p-2">
          <select
            class="form-control bg-warning"
            style="padding:5px 5px; height:40px;"
            v-model="sch_id"
            v-on:change="sch_id != 0 ? load_staffs() : ''"
          >
            <option value="0">Select School</option>
            <template v-for="school in schools">
              <option
                :key="school.sch_id"
                v-bind:value="school.sch_id"
                v-if="school.sch_id != 1"
                >{{ school.name }}</option
              >
            </template>
          </select>
        </div>
        <i class="flex flex-fill" />
        <div
          class="col-sm-2 text-white d-flex justify-content-center align-items-center"
        >
          <h4>Total Teacher:</h4>
          <span class="ml-2 badge badge-primary"
            ><h4>{{ staffs.length }}</h4></span
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
            <template v-for="(staff, index) in staffs">
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
                    :href="'#staff' + staff.user_id"
                    aria-expanded="false"
                  >
                    <div class="col-sm-1 d-flex align-items-center">
                      <p
                        class="badge badge-pill badge-secondary mr-1  d-inline-block"
                      >
                        UserId : {{ staff.user_id }}
                      </p>
                    </div>
                    <div class="col-sm-9 d-flex align-items-center">
                      {{ staff.name }}
                    </div>
                    <div class="col-sm-2 d-flex align-items-center">
                      <input
                        type="button"
                        class="btn btn-success mr-1"
                        value="Edit "
                        data-toggle="modal"
                        v-on:click="updateDetail = staff"
                        onclick="showModal('StaffDetailEditModal')"
                      />
                      <input
                        type="button"
                        class="btn btn-danger"
                        :value="staff.status == 1 ? 'Deactivate' : 'Activate'"
                        v-on:click="
                          staff.status == 1
                            ? delete_staff(staff.user_id, 0)
                            : delete_staff(staff.user_id, 1)
                        "
                      />
                    </div>
                  </div>
                </div>
                <div
                  :id="'staff' + staff.user_id"
                  class="panel-collapse collapse"
                  role="tabpanel"
                  aria-labelledby="headingOne"
                >
                  <div class="panel-body">
                    <div class="row">
                      <div class="col-sm-4 p-2">
                        <h4>Name: {{ staff.name }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Email: {{ staff.email }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Contact: {{ staff.contact }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>State: {{ staff.state }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>City: {{ staff.city }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Address: {{ staff.address }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Grades Taught: {{ staff.grades }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Username: {{ staff.username }}</h4>
                      </div>
                      <div class="col-sm-4 p-2">
                        <h4>Password: {{ staff.password }}</h4>
                      </div>
                      <div class="col-sm-4 p-2"><h4></h4></div>
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
      <div id="StaffDetailEditModal" class="cv-modal normal ">
        <div
          style="display: flex; flex-direction: column; max-width:3000px; width:98%; height:98%; overflow:auto;"
        >
          <div class="card">
            <div class="card-header bg-secondary text-white">
              <h4>Update Teacher Detail</h4>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-sm-2 m-1">Teacher Name</div>
                <div class="col-sm-8 m-1">
                  <input
                    class="form-control"
                    v-model="updateDetail.name"
                    placeholder="Staff Name"
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
              </div>
            </div>
            <div
              class="card-footer d-flex justify-content-center align-items-center p-2"
            >
              <button
                type="button"
                class="btn btn-success mr-1"
                v-on:click="update_staff()"
              >
                Update
              </button>
              <button
                type="button"
                class="btn btn-danger"
                onclick="hideModal('StaffDetailEditModal')"
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
  name: "StaffDetails",
  components: {
    Header
  },
  data() {
    return {
      token: "",
      schools: [],
      staffs: [],
      name: "",
      email: "",
      contact: "",
      city: "",
      state: "",
      address: "",
      sch_id: 0,
      username: "",
      password: "",
      user_id: "",
      processing: false,
      updateDetail: []
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    this.display_schools();
    this.load_staffs();
  },
  methods: {
    display_schools: function() {
      this.$http.post("/api/user/DisplaySchools").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.schools = res.body.schools;
        }
      });
    },
    load_staffs: function() {
      this.$http.post("/api/user/DisplayStaff", { sch_id: this.sch_id }).then(
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
    update_staff: function() {
      /*if (this.updateDetail.name == "") {
        cvNotify("Teacher name can not be empty.", "danger");
        return false;
      } else if (this.updateDetail.email == "") {
        cvNotify("Email can not be empty.", "danger");
        return false;
      } else if (this.updateDetail.password == "") {
        cvNotify("Password can not be empty.", "danger");
        return false;
      }*/

      this.$http
        .post("/api/user/Update_staff", {
          teacherDetail: this.updateDetail
        })
        .then(
          function(res) {
            if (res.body.status == "403") {
              //this.$router.push('/login');
            } else {
              if (res.body.data == "done") {
                this.load_staffs();
                hideModal("StaffDetailEditModal");
                cvNotify(
                  "You have successfully updated a staff member.",
                  "info"
                );
              }
            }
          },
          function(res) {
            //this.$router.push('/login');
          }
        );
    },
    delete_staff: function(user_id, acivateValue) {
      var msg = confirm("Do you really wants to delete this school?");
      if (msg == true) {
        this.$http
          .post("/api/user/Delete_staff", {
            user_id: user_id,
            acivateValue: acivateValue
          })
          .then(
            function(res) {
              if (res.body.status == "403") {
                //this.$router.push('/login');
              } else {
                if (res.body.data == "done") {
                  this.load_staffs();
                  cvNotify(
                    "You have successfully deleted a staff member.",
                    "info"
                  );
                }
              }
            },
            function(res) {
              //this.$router.push('/login');
            }
          );
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
