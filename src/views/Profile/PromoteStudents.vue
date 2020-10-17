<!--:style="'height:'+windowHegiht+'px !important;'"-->
<template>
  <div style="position:relative;overflow:auto;height:100%;">
    <div class="card">
      <div class="card-header bg-secondary">
        <h3 class="card-title  text-white w-auto">
          Promote Students
        </h3>
        <i class="flex-fill"></i>
        <div class="col-sm-2 d-flex align-items-center">
          <span class="badge badge-success"
            >Total Students : {{ schStudents.length }}
          </span>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-sm-3 col-md-3">
            <div class="form-group">
              <label class="form-label text-dark">Grade</label>
              <select
                class="form-control"
                v-model="cls_id"
                @change="
                  load_students();
                  promote_cls_id = cls_id + 1;
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
          </div>
          <div class="col-sm-3 col-md-3 d-flex justify-content-center">
            <div class="custom-switches-stacked">
              <div class="form-label text-dark">
                Promote / Delete
              </div>
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
                <span class="custom-switch-description">Promote</span>
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
                <span class="custom-switch-description">Delete</span>
              </label>
            </div>
          </div>
          <div class="col-sm-3 col-md-3">
            <label class="form-label text-dark" v-if="update_type == 0"
              >Promote to</label
            >
            <select
              class="form-control"
              v-model="promote_cls_id"
              v-if="update_type == 0"
              disabled
            >
              <option value="0">Select Grade</option>
              <template v-for="(classes, index) in sch_classes">
                <option
                  :key="index"
                  v-bind:value="classes.cls_id"
                  v-if="classes.cls_id > cls_id"
                  >{{ classes.cls_name }}</option
                >
              </template>
            </select>
          </div>
          <div
            class="col-sm-3 col-md-3  align-items-center d-flex justify-content-center"
          >
            <button class="btn btn-pill btn-green px-5" @click="saveDetails()">
              Save
            </button>
          </div>
        </div>

        <div class="row mt-4">
          <div class="col-sm-12 d-flex justify-content-end mb-1">
            <span class="badge badge-warning" v-if="update_type == 0"
              >Students to be promoted
              <span class="badge badge-secondary">{{
                promoteStudents.length
              }}</span></span
            >
            <span class="badge badge-warning" v-if="update_type == 1"
              >Students to be deleted
              <span class="badge badge-secondary">{{
                deleteStudents.length
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
                            @click="
                              update_type == 0
                                ? promoteStudent(student, $event)
                                : deleteStudent(student, $event)
                            "
                            :checked="
                              update_type == 0 &&
                              promoteCheck &&
                              promoteCheck[student.user_id]
                                ? true
                                : deleteCheck && deleteCheck[student.user_id]
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
            <div v-else><h5>There are no students.</h5></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PromoteStudent",

  data() {
    return {
      user_id: this.$store.getters.getAuthData.auth_user_id,
      role_id: this.$store.getters.getAuthData.auth_role_id,
      sch_id: this.$store.getters.getAuthData.auth_sch_id,
      cls_id: 0,
      sec_id: 0,
      sch_classes: [],
      schStudents: [],
      promote_cls_id: 0,
      update_type: 0,
      promoteStudents: [],
      deleteStudents: [],
      promoteCheck: new Object(),
      deleteCheck: new Object()
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted: function() {
    //initCvModals();
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.user_id = this.$store.getters.getAuthData.auth_user_id;
          this.role_id = this.$store.getters.getAuthData.auth_role_id;
          this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
          this.sec_id = 0;
          this.load_classes();
        }
      }.bind(this)
    );
  },
  methods: {
    openModal: function(modalId) {
      $("#" + modalId + " > div").removeClass("visible");
      showModal($("#" + modalId));
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
      if (this.cls_id != 0) {
        this.$http
          .post("/api/profile/School_students", {
            sch_id: this.sch_id,
            cls_id: this.cls_id,
            sec_id: this.sec_id
          })
          .then(
            function(res) {
              if (res.body.status == "403") {
                //this.$router.push('/login');
              } else {
                this.schStudents = res.body.all_students;
                // Create a copy of the same array
                var copy = new Array();
                for (var i = 0; i < this.schStudents.length; i++) {
                  copy[i] = this.schStudents[i];
                  this.promoteCheck[
                    this.schStudents[i].user_id
                  ] = this.schStudents[i].user_id;
                }
                this.promoteStudents = copy;
              }
            },
            function(res) {
              //this.$router.push('/login');
            }
          );
      } else {
        this.schStudents = [];
      }
    },
    promoteStudent: function(student, event) {
      if (event.target.checked == true) {
        for (var i = 0; i < this.schStudents.length; i++) {
          if (this.promoteStudents[i].user_id != student.user_id) {
            this.promoteStudents.push(student);
            this.promoteCheck[student.user_id] = student.user_id;

            break;
          }
        }
      } else if (event.target.checked == false) {
        for (var i = 0; i < this.promoteStudents.length; i++) {
          if (this.promoteStudents[i].user_id == student.user_id) {
            this.promoteStudents.splice(i, 1);
            delete this.promoteCheck[student.user_id];
          }
        }
      }
    },
    deleteStudent: function(student, event) {
      if (event.target.checked == true) {
        for (var i = 0; i < this.schStudents.length; i++) {
          if (
            this.schStudents.length ||
            this.deleteStudents[i].user_id != student.user_id
          ) {
            this.deleteStudents.push(student);
            this.deleteCheck[student.user_id] = student.user_id;

            break;
          }
        }
      } else if (event.target.checked == false) {
        for (var i = 0; i < this.deleteStudents.length; i++) {
          if (this.deleteStudents[i].user_id == student.user_id) {
            this.deleteStudents.splice(i, 1);
            delete this.deleteCheck[student.user_id];
          }
        }
      }
    },

    saveDetails: function() {
      var vm = this;
      var updateDetails = [];
      if (this.update_type == 0) {
        if (this.promoteStudents.length && this.promote_cls_id != 0) {
          showConfirmationDialog({
            title: "Promote Students",
            message:
              "Do you really want to promote " +
              vm.promoteStudents.length +
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
                      vm.promoteStudents = [];
                    }
                  });
              }
            },
            positiveButton: "Yes",
            negativeButton: "No",
            positiveButtonClass: "negative"
          });
        } else {
          if (!vm.promoteStudents.length) {
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
        if (this.promoteStudents.length) {
          showConfirmationDialog({
            title: "Delete Students",
            message:
              "Do you really want to delete " +
              vm.deleteStudents.length +
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
                      vm.deleteStudents = [];
                      vm.deleteCheck = new Object();
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
          if (!vm.deleteStudents.length) {
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
