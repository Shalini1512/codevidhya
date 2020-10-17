<template>
  <div id="students-projects-root">
    <Header>
      <HeaderContent />
    </Header>
    <div class="container" style="padding: 48px 0 0;">
      <div id="students-projects-container">
        <div id="sidebar">
          <template v-if="mode == 'main'">
            <h4 class="mb-4">Filters</h4>
            <div id="students-or-projects-container" class="mb-4">
              <label for="show-students"
                ><input
                  id="show-students"
                  type="radio"
                  name="students-or-projects"
                  value="students"
                  checked
                />
                Students</label
              >
              <label for="show-projects"
                ><input
                  id="show-projects"
                  type="radio"
                  name="students-or-projects"
                  value="projects"
                />Projects</label
              >
            </div>
            <div id="grades-container">
              <p class="mb-2"><b>Grades</b></p>
              <label
                ><input
                  id="all-grades"
                  type="checkbox"
                  value="all"
                  checked
                  @change="handleAllGradesChange($event)"
                />
                All</label
              >
              <template v-if="schoolInfo.grades">
                <label v-for="grade in schoolInfo.grades" :key="grade.cls_id"
                  ><input
                    type="checkbox"
                    :value="grade.cls_id"
                    checked
                    @change="handleGradeChange($event)"
                  />
                  {{ grade.cls_id }}</label
                >
              </template>
            </div>
            <button
              class="btn btn-primary w-100 mb-4"
              @click="handleApplyFilters()"
            >
              Apply
            </button>

            <div id="search-container">
              <input type="text" placeholder="Search" />
              <button class="btn"><i class="fas fa-search" /></button>
            </div>
          </template>

          <template v-if="mode == 'student-view'">
            <h4 class="mb-4">Student's Projects</h4>
            <label>Name</label>
            <p class="mb-4">{{ selectedStudent.name }}</p>

            <label>Grade</label>
            <p>{{ selectedStudent.cls_id }}</p>

            <template v-if="getSectionName(selectedStudent.sec_id)">
              <label>Section</label>
              <p class="mb-4">{{ getSectionName(selectedStudent.sec_id) }}</p>
            </template>
            <i class="flex-grow-1" />
            <button class="btn btn-primary" @click="closeStudentView()">
              Close
            </button>
          </template>
        </div>

        <div id="students-projects-simplebar" data-simplebar>
          <div id="students-projects-cards-container">
            <template v-if="showing == 'students' && mode != 'student-view'">
              <div
                v-for="student in students"
                :key="student.user_id"
                class="student-card cv-card interactive-card"
                :style="
                  student.hidden ? 'visibility: hidden' : 'visibility: visible'
                "
                :data-student-id="student.user_id"
                @click="handleStudentSelected($event)"
              >
                <div
                  class="student-card-img"
                  style="background-image:url(/assets/images/users/student.svg);"
                ></div>

                <div class="student-card-content">
                  <h3 class="singleline">{{ student.name }}</h3>
                </div>
              </div>
            </template>
            <template v-if="showing == 'projects' || mode == 'student-view'">
              <div
                v-for="project in selectedStudentsProjects"
                :key="project.project_id"
                class="project-card cv-card interactive-card"
                :style="
                  project.hidden ? 'visibility: hidden' : 'visibility: visible'
                "
              >
                <div
                  v-if="project.type == 'scratch'"
                  class="project-card-img"
                  style="background-image:url(/assets/images/project-thumbs/scratch.png);"
                >
                  <div
                    class="project-type-tag"
                    style="background-color: #f1c40f"
                  >
                    {{ project.type }}
                  </div>
                </div>
                <div
                  v-else-if="project.type == 'python'"
                  class="project-card-img"
                  style="background-image:url(/assets/images/project-thumbs/python.jpg);"
                >
                  <div
                    class="project-type-tag"
                    style="background-color: #3498DB"
                  >
                    {{ project.type }}
                  </div>
                </div>
                <div
                  v-else
                  class="project-card-img"
                  style="background-image:url(/assets/images/project-thumbs/web.svg);"
                >
                  <div
                    class="project-type-tag"
                    style="background-color: #E74C3C"
                  >
                    {{ project.type }}
                  </div>
                </div>
                <div class="project-card-content">
                  <h3 class="singleline">{{ project.name }}</h3>
                  <p>{{ project.description }}</p>
                </div>
                <i class="flex-filler"></i>
                <div class="hr"></div>
                <div class="project-card-bottom">
                  <a
                    class="btn btn-primary edit-project-btn"
                    :href="'/projects/' + project.project_id"
                    target="_blank"
                  >
                    Open
                  </a>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/students-projects/HeaderContent.vue";

import axios from "axios";
export default {
  components: {
    Header,
    HeaderContent
  },
  data() {
    return {
      viewportHeight: 0,
      mode: "main", // main, student-view
      showing: "students", // students, projects
      schoolInfo: {},
      students: [],
      selectedStudentId: null,
      selectedStudent: null,
      studentsProjects: {},
      selectedStudentsProjects: []
    };
  },
  mounted() {
    this.viewportHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
    $("#students-projects-container").height(this.viewportHeight - 59 + "px"); // 59 is the sticky menu height
    $("#students-projects-container").height(this.viewportHeight - 59 + "px");

    this.getSchoolInfo();
    this.getStudents();
  },
  methods: {
    getSchoolInfo() {
      this.$http
        .post("/api/projects/getSchoolInfo")
        .then(function(res) {
          // console.log(res.body);
          this.schoolInfo = res.body;
        })
        .catch(function(err) {
          cvNotify("Failed to load school information.", "error");
        });
    },
    getStudents() {
      this.$http
        .post("/api/projects/getStudents")
        .then(function(res) {
          this.students = res.body;
        })
        .catch(function(err) {
          cvNotify("Failed to load students.", "error");
        });
    },
    getStudentProjects(studentId) {
      let existingProjects = this.studentsProjects[studentId];
      if (existingProjects && existingProjects.length) {
        this.selectedStudentsProjects = existingProjects;
        // console.log("request avoided");
        return;
      }
      //   console.log("requesting");
      this.$http
        .post("/api/projects/getStudentProjects", {
          student_id: "" + studentId
        })
        .then(function(res) {
          if (res.body.length) {
            // console.log(res.body);
            var projects = res.body;
            var placeholdersCount =
              projects.length % 3 == 0 ? 0 : 3 - (projects.length % 3);
            for (var i = 0; i < placeholdersCount; i++) {
              // Add these placeholder items to help with flex space-between
              projects.push({ project_id: "hidden-" + i, hidden: "hidden" });
            }

            this.studentsProjects[studentId] = projects;
            this.selectedStudentsProjects = projects;
          }
        })
        .catch(function(err) {
          console.log(err);
          cvNotify("Failed to load projects.", "error");
        });
    },
    handleStudentSelected(e) {
      this.mode = "student-view";
      this.selectedStudentId = e.currentTarget.dataset.studentId;
      this.selectedStudentsProjects = {};
      this.getStudentProjects(this.selectedStudentId);
      for (var i = 0; i < this.students.length; i++) {
        if (this.students[i].user_id == this.selectedStudentId) {
          this.selectedStudent = this.students[i];
          //  console.log(this.selectedStudent);
          break;
        }
      }
    },
    closeStudentView() {
      this.mode = "main";
    },
    getSectionName(sectionId) {
      switch (sectionId) {
        case 1:
          return "A";
        case 2:
          return "B";
        case 3:
          return "C";
        case 4:
          return "D";
        case 5:
          return "E";
        case 6:
          return "F";
        case 7:
          return "G";
        case 8:
          return "H";
        case 9:
          return "I";
        case 10:
          return "J";
        case 11:
          return "K";
        case 12:
          return "L";
        case 13:
          return "M";
        case 14:
          return "N";
        case 15:
          return "O";
        case 16:
          return "P";
        case 17:
          return "Q";
        case 18:
          return "R";
        case 19:
          return "S";
        case 20:
          return "T";
        case 21:
          return "U";
        case 22:
          return "V";
        case 23:
          return "W";
        case 24:
          return "X";
        case 25:
          return "Y";
        case 26:
          return "Z";
        default:
          return null;
      }
    },
    handleAllGradesChange(e) {
      if (e.currentTarget.checked) {
        $("#grades-container input").prop("checked", "true");
      } else {
        $("#grades-container input").prop("checked", "");
      }
    },
    handleGradeChange(e) {
      if (!e.currentTarget.checked) {
        $("#all-grades").prop("checked", "");
      }
    },
    handleApplyFilters() {}
  }
};
</script>

<style lang="scss">
#students-projects-root {
  & > .container {
    padding-bottom: 0;
  }
}
#students-projects-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 300px;
  border-radius: 4px;
  & > div:first-of-type {
    flex-shrink: 0;
  }
  & > div:last-of-type {
    flex-grow: 1;
  }

  #sidebar {
    display: flex;
    flex-direction: column;
    width: 250px;
    height: 100%;
    padding: 16px;
    color: #444;
    label {
      margin-bottom: 4px;
    }
    p {
      margin-bottom: 16px;
    }
    #search-container {
      position: relative;
      width: 100%;
      margin-bottom: 16px;
      input {
        width: 100%;
        flex-shrink: 1;
        box-sizing: border-box;
      }
      button {
        position: absolute;
        right: 0;
        flex-shrink: 0;
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-left: none;
      }
    }
    #students-or-projects-container {
      label {
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        input {
          height: auto;
          margin-right: 8px;
        }
      }
    }
    #grades-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      p {
        width: 100%;
      }
      label {
        display: flex;
        flex-direction: row;
        vertical-align: center;
        width: 52px;
        padding: 8px 4px;
        line-height: 1;
        border-radius: 4px;
        color: #444;
        cursor: pointer;
        transition: all 200ms;
        &:hover {
          background: rgba(0, 0, 0, 0.1);
        }
        input[type="checkbox"] {
          height: auto;
          margin-right: 8px;
          cursor: pointer;
        }
      }
    }
  }
}

#students-projects-cards-container {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 16px;
  .student-card,
  .project-card {
    display: flex;
    flex-direction: column;
    width: 30%;
    margin-bottom: 32px;
    border-radius: 4px;
    &:hover {
      box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
    }
  }

  .student-card-img,
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

  .student-card-img {
    background-size: 40%;
  }

  .student-card-content,
  .project-card-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 0;
    padding: 16px;
    align-items: stretch;
    padding-right: 16px;
  }

  .student-card,
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
    .view-project-btn {
      flex-shrink: 0;
      align-self: flex-start;
      padding: 7px 8px;
      line-height: 1;
    }
  }
}
</style>
