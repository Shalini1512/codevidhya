<template>
  <div id="students-projects-root">
    <Header>
      <HeaderContent />
    </Header>
    <div class="container" style="padding: 48px 0 0;">
      <div id="students-projects-container">
        <div id="sidebar">
          <h3 class="mb-4">{{ eventInfo ? eventInfo.name : "" }}</h3>
          <div id="grades-container">
            <p class="mb-2"><b>Grades</b></p>
            <label
              ><input
                id="all-grades"
                type="checkbox"
                value="all"
                @change="handleAllGradesChange($event)"
              />
              All</label
            >
            <template v-if="schoolInfo.grades">
              <label v-for="grade in schoolInfo.grades" :key="grade.cls_id">
                <input
                  type="checkbox"
                  class="grade-checkbox"
                  :value="grade.cls_id"
                  @change="handleGradeChange($event)"
                />
                {{ grade.cls_id }}</label
              >
            </template>
          </div>

          <div id="sections-container" class="mt-4">
            <p class="mb-2"><b>Sections</b></p>
            <label
              ><input
                id="all-sections"
                type="checkbox"
                value="all"
                @change="handleAllSectionsChange($event)"
              />
              All</label
            >
            <template v-if="schoolInfo.sections">
              <label
                v-for="section in schoolInfo.sections"
                :key="section.sec_id"
              >
                <input
                  type="checkbox"
                  class="section-checkbox"
                  :value="section.sec_id"
                  @change="handleSectionChange($event)"
                />

                {{ getSectionName(section.sec_id) }}</label
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
        </div>

        <div data-simplebar>
          <div id="project-submissions-container">
            <div
              v-for="submission in selectedSubmissions"
              class="project-submission-item"
              :key="submission.submission_id"
            >
              <div>
                <p class="mb-4">
                  {{ submission.user_name }}
                  <span class="cv-tag mx-4">
                    Grade
                    <span class="tag-addon">{{ submission.grade }}</span>
                  </span>

                  <span class="cv-tag">
                    Section
                    <span class="tag-addon">{{
                      getSectionName(submission.section)
                    }}</span>
                  </span>
                </p>
                <p>{{ submission.event_name }}</p>
              </div>
              <div>
                <button class="btn btn-primary btn-sm mb-2">
                  {{ submission.submission_status }}
                </button>
                <router-link
                  :to="'/projects/' + submission.project_id"
                  target="_blank"
                  class="btn btn-secondary btn-sm"
                >
                  View project
                </router-link>
              </div>
            </div>

            <div v-if="!everAppliedFilters">
              <p>Select a grade and a section to begin.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/project-submissions/HeaderContent.vue";

import axios from "axios";
export default {
  components: {
    Header,
    HeaderContent
  },
  data() {
    return {
      viewportHeight: 0,
      eventId: null,
      eventInfo: null,
      mode: "main", // main, student-view
      showing: "projects", // students, projects
      schoolInfo: {},
      students: [],
      selectedStudentId: null,
      selectedStudent: null,
      studentsProjects: {},
      selectedStudentsProjects: [],
      selectedSubmissions: [],
      selectedGrades: null,
      selectedSections: null,
      everAppliedFilters: false
    };
  },
  mounted() {
    var url = new URL(window.location);
    this.eventId = url.searchParams.get("event_id");
    this.viewportHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
    $("#students-projects-container").height(this.viewportHeight - 59 + "px"); // 59 is the sticky menu height

    this.getEventInfo();
    this.getSchoolInfo();
  },
  methods: {
    getEventInfo() {
      this.$http
        .post("/api/projects/getChallengeInfo", {
          event_id: "" + this.eventId
        })
        .then(function(res) {
          this.eventInfo = res.body;
        })
        .catch(function(err) {
          cvNotify("Failed to load event information.", "error");
        });
    },
    getSchoolInfo() {
      this.$http
        .post("/api/projects/getSchoolInfo")
        .then(function(res) {
          this.schoolInfo = res.body;
        })
        .catch(function(err) {
          console.log(err);
          cvNotify("Failed to load school information.", "error");
        });
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
    handleAllSectionsChange(e) {
      if (e.currentTarget.checked) {
        $("#sections-container input").prop("checked", "true");
      } else {
        $("#sections-container input").prop("checked", "");
      }
    },
    handleSectionChange(e) {
      if (!e.currentTarget.checked) {
        $("#all-sections").prop("checked", "");
      }
    },
    handleApplyFilters() {
      var grades = document.querySelectorAll(".grade-checkbox:checked");
      if (!grades.length) {
        cvNotify("Select at least 1 grade.", "error");
        return;
      }
      this.selectedGrades = new Array();
      for (var i = 0; i < grades.length; i++) {
        this.selectedGrades.push(grades[i].value);
      }
      var sections = document.querySelectorAll(".section-checkbox:checked");
      if (!sections.length) {
        cvNotify("Select at least 1 section.", "error");
        return;
      }
      this.selectedSections = new Array();
      for (var i = 0; i < sections.length; i++) {
        this.selectedSections.push(sections[i].value);
      }

      this.everAppliedFilters = true;
      this.getSubmissions();
    },
    getSubmissions() {
      var grades = new Array();
      for (var i = 0; i < this.selectedGrades.length; i++) {
        grades.push(this.selectedGrades[i]);
      }
      grades.join(",");
      var sections = new Array();
      for (var i = 0; i < this.selectedSections.length; i++) {
        sections.push(this.selectedSections[i]);
      }
      sections.join(",");
      this.$http
        .post("/api/projects/getChallengeSubmissionsForGrades", {
          grades: "" + grades,
          sections: "" + sections
        })
        .then(function(res) {
          this.selectedSubmissions = res.body;
        })
        .catch(function(err) {
          cvNotify("Failed to load.", "error");
        });
    }
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
    #grades-container,
    #sections-container {
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

#project-submissions-container {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 16px;
  .project-submission-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin-bottom: 12px;
    padding: 16px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    div:first-of-type {
      flex-grow: 1;
    }
    div:last-of-type {
      display: flex;
      flex-direction: column;
    }
  }
}

.cv-tag {
  font-size: 0.75rem;
  color: #2c2c2c;
  background-color: #e0e8f3;
  border-radius: 3px;
  padding: 0 0.5rem;
  line-height: 2em;
  display: -ms-inline-flexbox;
  display: inline-flex;
  cursor: default;
  font-weight: 400;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
