<template>
  <div id="code-challenge-admin-root">
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
                v-for="grade in selectedSchoolCodeChallengeGrades"
                :key="grade.cls_id"
                :class="
                  'grade-item' +
                    (grade.cls_id == selectedGrade ? ' active' : '')
                "
                :data-grade="grade.cls_id"
                @click="handleGradeSelected"
              >
                <p>Grade {{ grade.cls_id }}</p>
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
                v-for="winner in selectedGradeWinners"
                :key="winner.project_id"
                class="d-flex flex-row align-items-center"
              >
                <button class="btn btn-primary btn-sm mr-5">
                  {{ winner.place == 1 ? "First place" : "" }}
                  {{ winner.place == 2 ? "Second place" : "" }}
                </button>
                <div class="d-flex flex-column flex-grow-1">
                  <p>
                    {{ winner.name }}
                  </p>
                  <p>
                    <small>Section {{ getSectionName(winner.sec_id) }}</small>
                  </p>
                </div>
                <button
                  class="btn btn-success btn-sm"
                  :data-project-id="winner.project_id"
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
import HeaderContent from "@/components/code-challenge-admin/HeaderContent.vue";
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
      blockingProcesses: [],
      selectedSchoolCodeChallengeGrades: [],
      selectedGradeStats: {},
      selectedGradeWinners: {}
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
      this.getGradesWithCodeChallengeForSchool(e.currentTarget.value);
    },
    getGradesWithCodeChallengeForSchool(schoolId) {
      this.$http
        .post("/api/projects/getGradesWithCodeChallengeForSchool", {
          school_id: schoolId
        })
        .then(function(res) {
          this.selectedSchoolCodeChallengeGrades = res.body;
          this.selectedGrade = this.selectedSchoolCodeChallengeGrades[0].cls_id;
          this.getStatsForSchoolGrade(
            this.selectedSchoolId,
            this.selectedGrade
          );
          this.blockingProcesses.pop();
        })
        .catch(function(err) {});
    },
    getStatsForSchoolGrade(school, grade) {
      this.blockingProcesses.push("a");
      this.$http
        .post("/api/projects/getCodeChallengeResultsAndStatsForGrade", {
          school_id: "" + school,
          grade: "" + grade
        })
        .then(function(res) {
          this.selectedGradeStats = res.body;
          this.selectedGradeWinners = this.selectedGradeStats.winners;
          this.blockingProcesses.pop();
        })
        .catch(function(err) {});
    },
    handleGradeSelected(e) {
      this.selectedGrade = e.currentTarget.dataset.grade;
      this.getStatsForSchoolGrade(this.selectedSchoolId, this.selectedGrade);
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
#code-challenge-admin-root {
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
