<!--:style="'height:'+windowHegiht+'px !important;'"-->
<template>
  <div class="container-fliud">
    <!-- Navbar -->
    <Header></Header>
    <!-- /Navbar -->
    <div class="container-fluid" style="padding-top:58px !important;">
      <div class="card">
        <div class="card-header bg-secondary">
          <div class="col-sm-3">
            <select
              class="form-control bg-warning"
              v-model="sch_id"
              v-on:change="
                load_classes();
                cls_id = 0;
                sec_id = 0;
                schStudents = [];
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
          <div class="col-sm-2">
            <select
              class="form-control bg-warning"
              v-model="cls_id"
              @change="
                load_students();
                promote_cls_id =
                  cls_id == 11
                    ? 12
                    : cls_id == 12
                    ? 13
                    : cls_id == 13
                    ? 1
                    : cls_id;
              "
            >
              <option value="0">Select Grade</option>
              <template v-for="(classes, index) in sch_classes">
                <option :key="index" v-bind:value="classes.cls_id">{{
                  classes.cls_name
                }}</option>
              </template>
            </select>
          </div>
          <div class="col-sm-2 d-flex justify-content-center">
            <div class="custom-switches-stacked">
              <label class="custom-switch pl-0">
                <input
                  type="radio"
                  name="option"
                  :value="0"
                  class="custom-switch-input"
                  v-model="update_type"
                  checked=""
                />
                <span class="custom-switch-indicator"></span>
                <span class="custom-switch-description text-white"
                  >Promote</span
                >
              </label>
              <label class="custom-switch pl-0">
                <input
                  type="radio"
                  name="option"
                  :value="1"
                  v-model="update_type"
                  class="custom-switch-input"
                />
                <span class="custom-switch-indicator"></span>
                <span class="custom-switch-description text-white">Delete</span>
              </label>
            </div>
          </div>
          <div class="col-sm-2">
            <select
              class="form-control bg-warning"
              v-model="promote_cls_id"
              v-if="update_type == 0"
            >
              <option value="0">Select Grade</option>
              <template v-for="(classes, index) in sch_classes">
                <option :key="index" v-bind:value="classes.cls_id">{{
                  classes.cls_name
                }}</option>
              </template>
            </select>
          </div>
          <div
            class="col-sm-1 align-items-center d-flex justify-content-center"
          >
            <button
              class="btn btn-pill btn-primary px-5"
              @click="saveDetails()"
            >
              Save
            </button>
          </div>
          <div
            class="col-sm-2 d-flex align-items-center justify-content-center"
          >
            <span class="badge badge-success"
              >Total Students : {{ schStudents.length }}
            </span>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 d-flex justify-content-end mb-1">
            <span class="badge badge-warning" v-if="update_type == 0"
              >Students to be promoted
              <span class="badge badge-secondary">{{
                Object.keys(promoteStudents).length
              }}</span></span
            >
            <span class="badge badge-warning" v-if="update_type == 1"
              >Students to be deleted
              <span class="badge badge-secondary">{{
                Object.keys(deleteStudents).length
              }}</span></span
            >
          </div>
          <div class="col-sm-12">
            <table
              class="table table-vcenter text-nowrap table-border border-dark"
              v-if="schStudents.length"
            >
              <thead class="bg-primary text-white">
                <tr>
                  <th class="text-white">Sr. No.</th>
                  <th class="text-white">Name</th>
                  <th class="text-white">Grade</th>
                  <th class="text-white">Section</th>
                  <th class="text-white">
                    Select / Unselect
                  </th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(student, index) in schStudents">
                  <tr :key="index">
                    <th>{{ index + 1 }}</th>
                    <td>{{ student.name }}</td>
                    <td>{{ student.cls_name }}</td>
                    <td>{{ student.sec_name }}</td>
                    <td>
                      <div class="form-group mb-0">
                        <label class="custom-switch pl-0">
                          <input
                            type="checkbox"
                            name="custom-switch-checkbox"
                            class="custom-switch-input"
                            :data-user-id="student.user_id"
                            @change="
                              update_type == 0
                                ? promoteStudent($event)
                                : deleteStudent($event)
                            "
                            :checked="
                              update_type == 0 &&
                              promoteStudents.hasOwnProperty(student.user_id)
                                ? true
                                : deleteStudents.hasOwnProperty(student.user_id)
                                ? true
                                : false
                            "
                          />
                          <span class="custom-switch-indicator"></span>
                        </label>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
            <div v-else><h3>There are no students.</h3></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/header/HeaderMenuForAdmin.vue";

export default {
  name: "PromoteStudent",
  components: {
    Header
  },

  data() {
    return {
      user_id: "",
      role_id: "",
      sch_id: 0,
      cls_id: 0,
      sec_id: 0,
      schools: [],
      sch_classes: [],
      schStudents: [],
      promote_cls_id: 0,
      update_type: 0,
      promoteStudents: new Object(),
      deleteStudents: new Object(),
      promoteCheck: new Object(),
      deleteCheck: new Object()
    };
  },
  beforeCreate() {},
  created() {
    this.display_school();
  },
  beforeMount() {},
  mounted: function() {
    //initCvModals();
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
        }
      }.bind(this)
    );
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
      this.$http
        .post("/api/profile/School_classes", { sch_id: this.sch_id })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.sch_classes = res.body.all_classes;
          }
        });
    },
    load_students: function() {
      this.promoteStudents = new Object();
      this.deleteStudents = new Object();
      if (this.cls_id != 0) {
        this.$http
          .post("/api/profile/School_students", {
            sch_id: this.sch_id,
            cls_id: this.cls_id,
            sec_id: this.sec_id
          })
          .then(function(res) {
            if (res.body.status == "403") {
              //this.$router.push('/login');
            } else {
              this.schStudents = res.body.all_students;
              var schoolStudents = res.body.all_students;
              schoolStudents.forEach(student => {
                this.promoteStudents[student.user_id] = {
                  status: true
                };
                this.deleteStudents[student.user_id] = {
                  status: true
                };
              });
            }
          });
      } else {
        this.schStudents = [];
      }
    },
    promoteStudent: function(event) {
      var user_id = event.currentTarget.dataset.userId;
      if (event.currentTarget.checked == true) {
        this.promoteStudents[user_id] = { status: true };
      } else if (event.currentTarget.checked == false) {
        delete this.promoteStudents[user_id];
      }
      this.promoteStudents = recreateObject(this.promoteStudents);
    },
    deleteStudent: function(event) {
      var user_id = event.currentTarget.dataset.userId;
      if (event.currentTarget.checked == true) {
        this.deleteStudents[user_id] = { status: true };
      } else if (event.currentTarget.checked == false) {
        delete this.deleteStudents[user_id];
      }
      this.deleteStudents = recreateObject(this.deleteStudents);
    },

    saveDetails: function() {
      var vm = this;
      var updateDetails = [];
      if (this.update_type == 0) {
        if (
          Object.keys(this.promoteStudents).length &&
          this.promote_cls_id != 0
        ) {
          showConfirmationDialog({
            title: "Promote Students",
            message:
              "Do you really want to promote " +
              Object.keys(vm.promoteStudents).length +
              " students to grade " +
              vm.promote_cls_id +
              "?<br> <span class='text-danger' style='font-size:14px; line-height:normal;'>You cannot move the students back to the previous class once you promote them.</span> ",
            callback: function(type) {
              if (type == "positive") {
                vm.$http
                  .post("/api/profile/promoteStudents", {
                    sch_id: vm.sch_id,
                    promoteStudents: vm.promoteStudents,
                    promote_cls_id: vm.promote_cls_id
                  })
                  .then(function(res) {
                    if (res.body.status == "403") {
                      //this.$router.push('/login');
                    } else {
                      if (res.body.data == "done") {
                        cvNotify(
                          "You have successfully promoted the students to grade " +
                            vm.promote_cls_id +
                            ".",
                          "success"
                        );
                      }
                      vm.cls_id = 0;
                      vm.promote_cls_id = 0;
                      vm.schStudents = [];
                      vm.promoteStudents = new Object();
                    }
                  });
              }
            },
            positiveButton: "Yes",
            negativeButton: "No",
            positiveButtonClass: "negative"
          });
        } else {
          if (!Object.keys(vm.promoteStudents).length) {
            cvNotify("No student is selected to promote.", "danger");
          }
          if (vm.promote_cls_id == 0) {
            cvNotify(
              "Please select a grade to which you want to promote.",
              "info"
            );
          }
        }
      } else if (this.update_type == 1) {
        if (Object.keys(vm.deleteStudents).length) {
          showConfirmationDialog({
            title: "Delete Students",
            message:
              "Do you really want to delete " +
              Object.keys(vm.deleteStudents).length +
              " students?<br> <span class='text-danger' style='font-size:14px; line-height:normal;'>You cannot add the students back once you delete them.</span> ",
            callback: function(type) {
              if (type == "positive") {
                vm.$http
                  .post("/api/profile/deleteStudents", {
                    sch_id: vm.sch_id,
                    deleteStudents: vm.deleteStudents
                  })
                  .then(function(res) {
                    if (res.body.status == "403") {
                      //this.$router.push('/login');
                    } else {
                      if (res.body.data == "done") {
                        cvNotify(
                          "You have successfully deleted the students of grade " +
                            vm.cls_id +
                            ".",
                          "success"
                        );
                      }
                      vm.deleteStudents = new Object();
                      vm.load_students();
                    }
                  });
              }
            },
            positiveButton: "Yes",
            negativeButton: "No",
            positiveButtonClass: "negative"
          });
        } else {
          if (!Object.keys(vm.deleteStudents).length) {
            cvNotify("No student is selected to promote.", "danger");
          }
        }
      }
    }
  }
};
</script>

<style lang="scss">
#projects-root {
  .lms-section-heading {
    font-size: 2rem;
    line-height: 1;
    margin-bottom: 24px;
  }
}
#projects-hero {
  position: relative;
  width: 100%;
  padding: 32px 0;
  color: #fff;
  background-image: url("/static/dashboard/img/new/hero-bg.svg");
  background-size: cover;
  background-position: bottom;
  & * {
    position: relative;
    z-index: 1;
  }
  &::before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(113, 0, 179, 0.5);
    z-index: 0;
  }
  & > div {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    div {
      flex-grow: 1;
    }
    button {
      background: #fff;
      color: #000;
      i {
        margin-right: 8px;
      }
      &:last-of-type {
        margin-left: 8px;
      }
    }
  }
  h3 {
    margin: 0 0 16px;
  }
}

#project-cards-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 24px;
}

.project-card {
  display: flex;
  flex-direction: column;
  width: 23%;
  margin-bottom: 32px;
  border-radius: 4px;
}

.project-card-img {
  width: 100%;
  height: 0;
  padding-bottom: 50%;
  flex-shrink: 0;
  background: #efefef;
  border: none;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.project-card-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  padding: 16px;
  align-items: stretch;
  padding-right: 16px;
}

.project-card {
  position: relative;
  opacity: 1;
  transition: all 300ms, box-shadow 300ms, opacity 1000ms;
  h3 {
    margin: 0;
    padding: 0;
    font-size: 1.2rem;
    font-family: "Nunito", sans-serif !important;
    font-weight: 600;
    line-height: 1;
  }
  p {
    margin: 8px 0 0;
    font-size: 0.9rem;
    color: #444;
    font-family: "Nunito", sans-serif !important;
  }
}

.project-type-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  background: rgb(209, 42, 120);
  font-size: 0.8rem;
  line-height: 1;
  color: #fff;
  border-radius: 16px;
}

.project-card-bottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px;
  img {
    width: 32px;
    height: 32px;
    margin-right: 16px;
    border-radius: 16px;
    background: #000;
    outline: none;
  }
  span {
    padding-top: 3px;
    font-family: "Nunito";
    line-height: 1;
  }
  .edit-project-btn {
    margin: 0;
    padding: 7px 16px;
    border-radius: 4px;
    font-size: 0.9rem;
    line-height: 1;
  }
}

#new-project-modal {
  .body {
    display: flex;
    flex-direction: column;
    padding: 16px 24px;
  }
  label {
    margin-bottom: 4px;
  }
  select {
    margin-bottom: 16px;
    padding-left: 8px;
    padding-right: 8px;
  }
  textarea {
    height: 64px;
    padding: 8px;
    line-height: 1.2;
    resize: none;
  }
}
</style>
