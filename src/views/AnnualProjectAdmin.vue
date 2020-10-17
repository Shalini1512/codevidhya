<template>
  <div id="annual-project-admin-root">
    <Header>
      <HeaderContent />
    </Header>
    <div class="container">
      <div
        id="submissions-manager-container"
        :style="'height:' + (this.viewportHeight - 59 - 16) + 'px'"
      >
        <div id="sidebar" class="d-flex flex-column">
          <div id="code-challenge-school-selector">
            <select v-model="selectedSchoolId" @change="handleSchoolSelected">
              <option value="none" selected disabled>Select school</option>
              <option
                v-for="school in schools"
                :key="school.sch_id"
                :value="school.sch_id"
                >{{ school.name }}</option
              >
            </select>
          </div>

          <div id="grades-list" class="flex-grow-1" data-simplebar>
            <div id="project-submission-grade-items">
              <div
                v-for="grade in selectedSchooAnnualProjectGrades"
                :key="grade.cls_id"
                :class="
                  'grade-item' +
                    (grade.cls_id == selectedGrade ? ' active' : '')
                "
                :data-grade="grade.cls_id"
                :data-grades="
                  selectedSchooAnnualProjectGradesData.gradesInGroup[
                    selectedSchooAnnualProjectGradesData.gradeGroups[
                      grade.cls_id
                    ]
                  ]
                "
                @click="handleGradeSelected"
              >
                <p>
                  Grades
                  {{
                    selectedSchooAnnualProjectGradesData.gradesInGroup[
                      selectedSchooAnnualProjectGradesData.gradeGroups[
                        grade.cls_id
                      ]
                    ]
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex-grow-1"
          style="min-height: 0; display: flex; flex-direction: column;"
        >
          <div
            v-if="selectedSchoolId != 'none'"
            id="stats"
            class="d-flex flex-row"
          >
            <p class="pr-5">
              <b>Total students: </b>
              <span>{{
                selectedGradeStats.students ? selectedGradeStats.students : 0
              }}</span>
            </p>
            <p>
              <b>Total submissions: </b>
              <span>{{
                selectedGradeStats.submissions
                  ? selectedGradeStats.submissions
                  : 0
              }}</span>
            </p>
          </div>
          <div class="flex-grow-1" data-simplebar>
            <div id="project-submissions-list">
              <div
                v-for="project in selectedGradeFinalShortlist"
                :key="project.project_id"
                class="d-flex flex-row align-items-center"
              >
                <div class="d-flex flex-column flex-grow-1">
                  <p>
                    <small><b>Project:</b> {{ project.project_name }}</small>
                  </p>
                  <p>
                    <small><b>Student:</b> {{ project.user_name }}</small>
                  </p>
                  <p>
                    <small><b>Grade:</b> {{ project.grade }} </small>
                    <small
                      ><b>Section:</b>
                      {{ getSectionName(project.section) }}</small
                    >
                  </p>
                </div>
                <button
                  class="btn btn-success btn-sm"
                  :data-project-id="project.project_id"
                  @click="handleViewProjectClicked"
                >
                  VIEW PROJECT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <BlockingLoader v-if="blockingProcesses.length" />
  </div>
</template>

<script>
import Header from "@/components/header/HeaderMenuForAdmin.vue";

import HeaderContent from "@/components/annual-project-admin/HeaderContent.vue";
import Footer from "@/components/footer/Footer.vue";

import BlockingLoader from "@/components/widgets/BlockingLoader.vue";

export default {
  name: "home",
  components: {
    Header,
    HeaderContent,
    Footer,
    BlockingLoader
  },
  data() {
    return {
      viewportHeight: 0,
      allSchools: [],
      selectedSchoolId: "none",
      selectedGrade: 1,
      selectedSchooAnnualProjectGradesData: null,
      selectedSchooAnnualProjectGrades: [],
      selectedGradeStats: {},
      selectedGradeFinalShortlist: [],
      blockingProcesses: []
    };
  },
  computed: {
    schools: function() {
      return this.allSchools.filter(function(school) {
        return school.sch_id > 1;
      });
    }
  },
  mounted() {
    this.viewportHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
    this.getSchools();
  },
  methods: {
    getSchools() {
      this.$http
        .post("/api/projects/getSchools")
        .then(function(res) {
          this.allSchools = res.body;
        })
        .catch(function(err) {});
    },
    handleSchoolSelected(e) {
      this.blockingProcesses.push("a");
      this.getGradesWithAnnualProjectForSchool(e.currentTarget.value);
    },
    getGradesWithAnnualProjectForSchool(schoolId) {
      this.$http
        .post("/api/projects/getGradesWithAnnualProjectForSchool", {
          school_id: schoolId
        })
        .then(function(res) {
          this.selectedSchooAnnualProjectGradesData = res.body;
          this.selectedSchooAnnualProjectGrades = this.selectedSchooAnnualProjectGradesData.grades;
          var grade = this.selectedSchooAnnualProjectGrades[0].cls_id;
          this.getAnnualProjectStatsForSchoolGradeGroup(
            schoolId,
            this.selectedSchooAnnualProjectGradesData.gradesInGroup[
              this.selectedSchooAnnualProjectGradesData.gradeGroups[grade]
            ]
          );
          this.blockingProcesses.pop();
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    getAnnualProjectStatsForSchoolGradeGroup(school, grades) {
      this.blockingProcesses.push("a");
      this.$http
        .post("/api/projects/getAnnualProjectStatsForSchoolGradeGroup", {
          school_id: "" + school,
          grades: "" + grades
        })
        .then(function(res) {
          this.selectedGradeStats = res.body;
          console.log(res.body);
          this.selectedGradeFinalShortlist = res.body.finalShortlist;
          //this.selectedGradeFinalShortlist = this.selectedGradeStats.winners;
          this.blockingProcesses.pop();
        })
        .catch(function(err) {});
    },
    handleGradeSelected(e) {
      this.selectedGrade = e.currentTarget.dataset.grade;
      var grades = e.currentTarget.dataset.grades;
      this.getAnnualProjectStatsForSchoolGradeGroup(
        this.selectedSchoolId,
        grades
      );
    },
    handleViewProjectClicked(e) {
      window.open("/projects/" + e.currentTarget.dataset.projectId, "_blank");
    },
    getSectionName(sectionId) {
      return getSectionName(sectionId);
    }
  }
};
</script>
<style lang="scss">
#annual-project-admin-root {
  #submissions-manager-container {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    min-height: 0;
    margin: 8px auto;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    overflow: hidden;
    #sidebar {
      flex-shrink: 0;
      width: 200px;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
    }
    #grades-list {
      display: flex;
      flex-direction: column;
      .horizontal {
        display: none;
      }
      .simplebar-scroll-content {
        height: 100%;
      }
      .simplebar-content {
        padding-bottom: 0 !important;
        overflow-x: hidden;
      }
    }
  }
  #project-submission-grade-items > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px 24px;
    cursor: pointer;
    p {
      font-size: 0.9rem;
    }
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
    &.active {
      background: rgb(26, 112, 224);
      color: #fff;
    }
    &.ranking-completed {
      border-left: 4px solid rgb(10, 173, 37);
    }
  }
  .simplebar-content {
    display: flex;
    flex-direction: column;
  }
  #project-submissions-list {
    flex-grow: 1;
    position: relative;
    min-height: 100%;
    & > div:not(#code-challenge-submissions-loader) {
      padding: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      &:hover {
        background: rgba(0, 0, 0, 0.03);
      }
    }
    h4 {
      font-family: "Rubik", sans-serif;
    }
  }
  #code-challenge-school-selector {
    display: flex;
    flex-direction: column;
    padding: 4px;
    select {
      padding: 8px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
  }
  .grade-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px 24px;
    cursor: pointer;
    p {
      font-size: 0.9rem;
    }
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
    &.active {
      background: rgb(26, 112, 224);
      color: #fff;
    }
    &.ranking-completed {
      border-left: 4px solid rgb(10, 173, 37);
    }
  }

  #stats {
    padding: 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
}
</style>
