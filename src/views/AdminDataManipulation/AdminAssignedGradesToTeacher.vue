<template>
  <div class="container-fluid m-0 p-0">
    <Header>
      <section>
        <div class="sptb-4 sptb-tab" style="padding-bottom: 2rem;">
          <div class="header-text mb-0">
            <div class="container">
              <div class="row align-items-center">
                <div
                  class="col-md-6"
                  style="display: flex; flex-direction: column; justify-content: center"
                >
                  <div class="text-left text-white">
                    <h3>Assign Grades to Teachers</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Header>
    <div class="container-fluid">
      <div class="card">
        <div class="card-body">
          <div
            class="row bg-secondary d-flex jusitfy-content-center align-items-center p-2"
          >
            <div class="col-sm-2 text-white">
              Select School
            </div>
            <div class="col-sm-3">
              <select
                class="form-control bg-warning "
                v-model="sch_id"
                @change="
                  load_staffs();
                  load_classes();
                "
              >
                <option value="0" selected disabled>Select school</option>
                <option
                  v-for="(school, index) in schools"
                  :key="index"
                  v-bind:value="school.sch_id"
                >
                  {{ school.name }}</option
                >
              </select>
            </div>
            <i class="flex flex-fill" />
            <div class="col-sm-1">
              <button class="btn btn-warning" @click="assignGrade()">
                Assign
              </button>
            </div>
          </div>
          <div class="row mt-2" v-if="allTeachers.length">
            <div class="col-sm-12">
              <table class="table card-table table-vcenter text-nowrap">
                <thead class="bg-primary text-white">
                  <tr>
                    <th class="text-white">Sr. No.</th>
                    <th class="text-white">User Id</th>
                    <th class="text-white">Name</th>
                    <th class="text-white">Grades</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(teacher, index) in allTeachers">
                    <tr :key="index">
                      <th>{{ index + 1 }}</th>
                      <td>{{ teacher.user_id }}</td>
                      <td>{{ teacher.name }}</td>
                      <td class="d-flex align-items-center">
                        <template v-for="(grade, index) in sch_classes">
                          <span
                            :key="index"
                            class="badge badge-secondary mr-1 p-2"
                            style="cursor:pointer"
                          >
                            <label
                              class="custom-control custom-checkbox d-flex align-items-center justify-content-center"
                              style="cursor:pointer"
                            >
                              <input
                                type="checkbox"
                                class="custom-control-input"
                                name="example-checkbox1"
                                style="cursor:pointer"
                                :value="grade.cls_id"
                                :checked="
                                  teacher.grades != null
                                    ? teacher.grades.includes(
                                        grade.cls_id.toString()
                                      )
                                      ? true
                                      : false
                                    : ''
                                "
                                @change="teacher.grades.push(grade.cls_id)"
                              />
                              <span class="custom-control-label">{{
                                grade.cls_name
                              }}</span>
                            </label>
                          </span>
                        </template>
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

<script>
import moment from "vue-moment";
import Header from "@/components/header/HeaderMenuForAdmin.vue";

export default {
  components: { Header },
  data() {
    return {
      sch_id: 0,
      schools: [],
      cls_id: 0,
      asmnt_time: "",
      sch_classes: [],
      selectedClass: [],
      asmntTime: this.$moment().format("YYYY-MM-DDTHH:mm"),
      mindate: this.$moment().format("YYYY-MM-DDTHH:mm"),
      asmnt_classes: new Object(),
      techAsmntDate: this.$moment().format("YYYY-MM-DDTHH:mm"),
      students: [],
      allTeachers: []
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    this.load_schools();
  },
  methods: {
    load_classes: function() {
      this.sch_classes = [];
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
    load_schools: function() {
      this.$http.post("/api/user/DisplaySchools").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push("/login");
        } else {
          this.schools = res.body.schools;
        }
      });
    },
    load_staffs: function() {
      this.allTeachers = [];
      this.$http.post("/api/user/DisplayStaff", { sch_id: this.sch_id }).then(
        function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            var teachers = res.body.staffs;

            for (var i = 0; i < teachers.length; i++) {
              this.allTeachers.push({
                sch_id: this.sch_id,
                user_id: teachers[i].user_id,
                name: teachers[i].name,
                grades:
                  teachers[i].grades != null
                    ? teachers[i].grades.split(",")
                    : []
              });
            }
          }
        },
        function(res) {
          //this.$router.push('/login');
        }
      );
    },
    assignGrade: function() {
      this.$http
        .post("/api/user/assignGradesToTeachers", {
          teachersDetails: this.allTeachers
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            if (res.body.success == 1) {
              cvNotify("you have successfully assigned");
              this.load_staffs();
            }
          }
        });
    }
  },
  updated() {},
  mounted: function() {}
};
</script>

<style lang="scss">
.errorclass {
  border: solid 1px red;
}
.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.drag-btn {
  border: 2px dashed #58d68d;
  color: gray;
  background-color: #d5f5e3;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
  height: 50px;
}

.drag-file1 {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  height: 50px;
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
a {
  text-decoration: none;
  color: #000;
}

.srch_btn {
  background: #ccc;
  font-size: 17px;
  border: none;
  cursor: pointer;
  width: auto;
}
/*Quiz design copied */
#assessment-admin-root {
  #main {
    padding-left: 24px;
    padding-right: 24px;
  }
}
#assessments-and-questions-tabs {
  width: 100%;
  margin: 16px 24px;
  & > .tabs {
    align-items: center;
    div {
      min-width: 140px;
      font-family: "Rubik", sans-serif;
      &:first-of-type {
        border-top-left-radius: 8px;
      }
    }
    i {
      visibility: hidden;
    }
    button {
      height: 32px;
      margin-right: 8px;
      padding: 8px;
      line-height: 1;
      background: rgb(19, 192, 71);
    }
  }
}

#assessments-tablayout,
#que-pool-tablayout {
  .tabs {
    padding: 8px;
    background: rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    div {
      min-width: 140px;
      margin-right: 8px;
      padding: 8px;
      border-radius: 8px;
      font-family: "Rubik", sans-serif;
      &.active {
        background: rgb(0, 120, 230);
        color: #fff;
      }
    }
  }
}

#assessments-tablayout {
  .content {
    & > div {
      display: flex;
      flex-direction: row;
      padding: 24px;
      .subject-tag {
        margin-left: 24px;
        padding: 4px 8px;
        background: rgb(4, 146, 23);
        border-radius: 4px;
        font: normal 12px/1 "Rubik";
        color: #fff;
      }
      p {
        margin: 0;
      }
      .spacer {
        padding-right: 24px;
      }

      & > div:last-of-type {
        display: flex;
        flex-direction: column;
        button:first-of-type {
          margin-bottom: 8px;
        }
      }
    }
  }
}
.searchadd-a {
  padding: 16px 32px;
}
.quediv-a {
  padding: 8px;
  margin: 4px;
  background: rgba(0, 0, 0, 0.05);
}
.quedivinner-a {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.small-abutton {
  width: auto;
  margin: 0;
  padding: 4px 12px;
  background: #fff;
  border-radius: 24px;
  color: #7700ff;
  font: normal 1rem/1 "Rubik";
  border: thin solid #7700ff;
}
.small-abutton:hover {
  border-color: #fff;
  background: #7700ff;
  cursor: pointer;
  color: #fff;
}
/*ankit design */
.mbody-a {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 8px 8px;
  border-radius: 8px;
}
.modaltopic-a {
  min-width: 140px;
  padding: 8px;
  border-radius: 8px;
  background: rgb(0, 120, 230);
  color: #fff;
  text-align: center;
}
.modal-row-a {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 50px;
  padding: 8px;
}
.subtype-a {
  input[type="radio"] {
    height: auto;
    margin: 8px 8px 0px 18px;
    width: 16px;
    height: 16px;
  }
}

.modal-left-right {
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 370px;
  border-radius: 12px;
  padding: 8px;
  background: rgb(217, 232, 251);
  justify-content: flex-start;
}
.modal-left-row1 {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: row;
  padding: 8px 8px;
  background: rgb(30, 150, 255);
  border-radius: 8px;
  color: #fff;

  p,
  label {
    margin: 0;
    line-height: 1;
    font-family: "Rubik", sans-serif;
    font-size: 16px;
  }
  input[type="button"] {
    border-radius: 20px;
    font-family: "Rubik", sans-serif;
    background: #fff;
    padding: 0px 12px;
    height: 32px;
    line-height: 1.5;
    &:hover {
      background: rgb(67, 203, 254);
      color: #fff;
      border: none;
    }
  }
}
.modal-left-row2 {
  padding: 12px 8px;
  font-family: "Rubik", sans-serif;
  span {
    font-size: 16px;
    margin-right: 8px;
  }
  label {
    margin: 0;
    line-height: 1;
    font-family: "Rubik", sans-serif;
    font-size: 16px;
  }
  input[type="radio"] {
    height: auto;
    margin: 0 4px 0 24px;
  }
}
.modal-right-row2 {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  overflow: auto;
  word-break: break-word;
  background: #fff;
  margin-top: 8px;
}
.modal-right-row2 > div {
  padding: 8px;
  width: 100%;
}
.uimage-a {
  font-size: 16px;
  margin-right: 12px;
  font-family: "Rubik", sans-serif;
}
.checkbox-a {
  height: auto;
  margin: 0 16px 0 8px;
  line-height: 1;
  font-family: "Rubik", sans-serif;
  font-size: 16px;
  input {
    height: 16px;
    margin-right: 8px;
    width: 16px;
  }
  label {
    margin: 0px;
  }
}
.input-valid {
  border: thin solid #e74c3c;
}
</style>
