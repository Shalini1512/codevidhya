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
            v-model="course_id"
            @change="displayLiveCourseStudents()"
          >
            <option value="0">Select course</option>
            <template v-for="course in allLiveCourses">
              <option
                :key="course.live_course_id"
                v-bind:value="course.live_course_id"
                >{{ course.live_course_name }}</option
              >
            </template>
          </select>
        </div>
        <i class="flex flex-fill" />
        <div
          class="col-sm-2 text-white d-flex justify-content-center align-items-center"
        >
          <h4>Total Students:</h4>
          <span class="ml-2 badge badge-primary"
            ><h4>{{ allStudents.length }}</h4></span
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
            <template v-for="(student, index) in allStudents">
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
                    :href="'#staff' + student.user_id"
                    aria-expanded="false"
                  >
                    <div class="col-sm-1 d-flex align-items-center">
                      <p
                        class="badge badge-pill badge-secondary mr-1  d-inline-block"
                      >
                        UserId : {{ student.user_id }}
                      </p>
                    </div>
                    <div class="col-sm-9 d-flex align-items-center">
                      {{ student.name }}
                    </div>
                    <div class="col-sm-2 d-flex align-items-center">
                      <input
                        type="button"
                        :class="
                          student.certificate_status &&
                          student.certificate_status == 1
                            ? 'btn btn-danger'
                            : 'btn btn-success'
                        "
                        :value="
                          student.certificate_status &&
                          student.certificate_status == 1
                            ? 'Deactivate'
                            : 'Activate'
                        "
                        v-on:click="
                          student.certificate_status &&
                          student.certificate_status == 1
                            ? certificatePermission(student.user_id, 0)
                            : certificatePermission(student.user_id, 1)
                        "
                      />
                    </div>
                  </div>
                </div>
                <div
                  :id="'staff' + student.user_id"
                  class="panel-collapse collapse"
                  role="tabpanel"
                  aria-labelledby="headingOne"
                >
                  <div class="panel-body">
                    <div class="row">
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
      course_id: 0,
      allLiveCourses: [],
      allStudents: []
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    this.displayLiveCourses();
  },
  methods: {
    displayLiveCourses: function() {
      this.$http.post("/api/user/displayLiveCourses").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.allLiveCourses = res.body.data;
        }
      });
    },
    displayLiveCourseStudents: function() {
      this.allStudents = []
      this.$http
        .post("/api/user/displayLiveCourseStudents", {
          course_id: this.course_id,
          role:'codevidhya'
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.allStudents = res.body.data;
          }
        });
    },
    certificatePermission: function(user_id, acivateValue) {
      this.$http
        .post("/api/user/certificatePermission", {
          course_id: this.course_id,
          user_id: user_id,
          acivateValue: acivateValue
        })
        .then(
          function(res) {
            if (res.body.status == "403") {
              //this.$router.push('/login');
            } else {
              if (res.body.data == "done") {
                this.displayLiveCourseStudents();
                cvNotify("You have successfully set permission.", "info");
              }
            }
          },
          function(res) {
            //this.$router.push('/login');
          }
        );
    }
  }
};
</script>
