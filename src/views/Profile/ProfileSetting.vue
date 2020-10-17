<!--:style="'height:'+windowHegiht+'px !important;'"-->
<template>
  <div
    v-if="!prof_setting"
    style="position:relative;overflow:auto;height:100%;margin-top:59px;"
  >
    <div class="card">
      <div class="card-header bg-secondary">
        <h3 class="card-title  text-white w-auto">
          Profile Setting
        </h3>
        <i class="flex-fill"></i>
      </div>
      <div class="card-body">
        <div class="row mb-2 mt-2 pb-2">
          <div class="col-sm-2 d-flex align-items-center">
            Select Grade
          </div>
          <div class="col-sm-2">
            <select
              class="form-control border border-dark"
              v-model="cls_id"
              @change="load_students()"
            >
              <option value="0">All</option>
              <template v-for="(classes, index) in sch_classes">
                <option :key="index" v-bind:value="classes.cls_id">{{
                  classes.cls_name
                }}</option>
              </template>
            </select>
          </div>
          <div class="col-sm-2 d-flex align-items-center">
            Select Section
          </div>
          <div class="col-sm-2">
            <select
              class="form-control border border-dark"
              v-model="sec_id"
              @change="load_students()"
            >
              <option value="0">All</option>
              <template v-for="(sections, index) in all_sections">
                <option :key="index" v-bind:value="sections.sec_id">{{
                  sections.sec_name
                }}</option>
              </template>
            </select>
          </div>
          <i class="flex-fill"></i>
          <div class="col-sm-2 d-flex align-items-center">
            <span class="badge badge-success"
              >Total Students : {{ sch_students.length }}
            </span>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <table
              class="table card-table table-vcenter text-nowrap table-border border-dark"
              v-if="sch_students.length"
            >
              <thead class="bg-primary text-white">
                <tr>
                  <th class="text-white">Sr. No.</th>
                  <th class="text-white">Name</th>
                  <th class="text-white">Grade</th>
                  <th class="text-white">Section</th>
                  <!--<th class="text-white">Username</th>
                        <th class="text-white">Password</th>-->
                  <th class="text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(student, index) in sch_students">
                  <tr :key="index">
                    <th>{{ index + 1 }}</th>
                    <td>{{ student.name }}</td>
                    <td>{{ student.cls_name }}</td>
                    <td>{{ student.sec_name }}</td>
                    <!--<td>{{ student.username }}</td>
                          <td>{{ student.password }}</td>-->
                    <td>
                      <button
                        class="btn btn-success"
                        @click="editProfile(student.user_id)"
                      >
                        Update
                      </button>
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
  <StudentProfile
    v-else
    :st_user_id="st_user_id"
    @changeProfileFunctionality="prof_setting = !prof_setting"
  />
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import Footer from "@/components/footer/Footer.vue";
import SideNav from "@/components/dashboard/SideNav.vue";
import StudentProfile from "@/views/Profile/UserProfile.vue";

export default {
  name: "home",
  components: {
    StudentProfile
  },
  data() {
    return {
      user_id: this.$store.getters.getAuthData.auth_user_id,
      role_id: this.$store.getters.getAuthData.auth_role_id,
      sch_id: this.$store.getters.getAuthData.auth_sch_id,
      cls_id: this.$store.getters.getAuthData.auth_cls_id,
      sec_id: this.$store.getters.getAuthData.auth_sec_id,
      sch_classes: [],
      all_sections: [],
      sch_students: [],
      prof_setting: 0,
      st_user_id: 0
    };
  },
  beforeCreate() {},
  created() {},

  mounted: function() {
    //initCvModals();
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.user_id = this.$store.getters.getAuthData.auth_user_id;
          this.role_id = this.$store.getters.getAuthData.auth_role_id;
          this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
          this.cls_id = this.$store.getters.getAuthData.auth_cls_id;
          this.sec_id = this.$store.getters.getAuthData.auth_sec_id;
          this.load_classes();
          this.load_sections();
          this.load_students();
        }
      }.bind(this)
    );
  },
  methods: {
    editProfSet: function() {
      this.prof_setting = 0;
    },
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
    load_sections: function() {
      this.$http.post("/api/profile/All_sections").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.all_sections = res.body.all_sections;
        }
      });
    },
    load_students: function() {
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
              this.sch_students = res.body.all_students;
            }
          },
          function(res) {
            //this.$router.push('/login');
          }
        );
    },
    editProfile: function(user_id) {
      this.prof_setting = 1;
      this.st_user_id = user_id;
      /* this.$router.push({
        name: "studentprofile",
        query: { user: btoa(user_id) }
      });*/
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
