<template>
  <div id="code-challenge-manager-root">
    <Header>
      <HeaderContent />
    </Header>
    <div class="container" style="padding: 48px 0 0;">
      <div v-if="grades" id="manager-grades-list">
        <div v-for="grade in grades" :key="'' + grade.cls_id + grade.sec_id">
          <p>
            Grade {{ grade.cls_id }} Section {{ getSectionName(grade.sec_id) }}
          </p>
          <button
            v-if="
              activeCodeChallegesForGrades &&
                activeCodeChallegesForGrades[grade.cls_id + '-' + grade.sec_id]
            "
            class="btn btn-success btn-sm mr-1"
            @click="showQuestionForGrade(grade.cls_id)"
          >
            Show Question
          </button>
          <template
            v-if="
              activeCodeChallegesForGrades &&
                activeCodeChallegesForGrades[grade.cls_id + '-' + grade.sec_id]
            "
          >
            <button
              v-if="
                !activeCodeChallegesForGrades[grade.cls_id + '-' + grade.sec_id]
                  .expired
              "
              class="btn btn-success btn-sm"
              :data-grade="grade.cls_id"
              :data-section="grade.sec_id"
            >
              ACTIVE
            </button>
            <button
              v-else
              class="btn btn-danger btn-sm"
              :data-grade="grade.cls_id"
              :data-section="grade.sec_id"
            >
              FINISHED
            </button>
          </template>

          <button
            v-else
            class="btn btn-primary btn-sm"
            :data-grade="grade.cls_id"
            :data-section="grade.sec_id"
            @click="handleStartButtonClicked($event)"
          >
            START
          </button>
        </div>
      </div>
    </div>
    <Footer />
    <div
      id="code-challenge-question-modal"
      class="cv-modal large undismissable"
    >
      <div>
        <div class="header">
          <h3>Your Task</h3>
        </div>
        <div class="body" style="padding: 24px">
          <Grade1CodeChallenge v-if="showingQuestionForGrade == 1" />
          <Grade2CodeChallenge v-if="showingQuestionForGrade == 2" />
          <Grade3CodeChallenge v-if="showingQuestionForGrade == 3" />
          <Grade4CodeChallenge v-if="showingQuestionForGrade == 4" />
          <Grade5CodeChallenge v-if="showingQuestionForGrade == 5" />
          <Grade6CodeChallenge v-if="showingQuestionForGrade == 6" />
          <Grade7CodeChallenge v-if="showingQuestionForGrade == 7" />
          <Grade8CodeChallenge v-if="showingQuestionForGrade == 8" />
          <Grade9CodeChallenge v-if="showingQuestionForGrade == 9" />
          <Grade10CodeChallenge v-if="showingQuestionForGrade == 10" />
        </div>
        <div class="footer">
          <button
            class="cv-button noshadow"
            onclick="(function() {hideModal('code-challenge-question-modal');})()"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
    <BlockingLoader v-if="processes.length" />
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/code-challenge-manager/HeaderContent.vue";
import Footer from "@/components/footer/Footer.vue";
import BlockingLoader from "@/components/widgets/BlockingLoader.vue";

import Grade1CodeChallenge from "@/components/code-challenge/Grade1CodeChallenge.vue";
import Grade2CodeChallenge from "@/components/code-challenge/Grade2CodeChallenge.vue";
import Grade3CodeChallenge from "@/components/code-challenge/Grade3CodeChallenge.vue";
import Grade4CodeChallenge from "@/components/code-challenge/Grade4CodeChallenge.vue";
import Grade5CodeChallenge from "@/components/code-challenge/Grade5CodeChallenge.vue";
import Grade6CodeChallenge from "@/components/code-challenge/Grade6CodeChallenge.vue";
import Grade7CodeChallenge from "@/components/code-challenge/Grade7CodeChallenge.vue";
import Grade8CodeChallenge from "@/components/code-challenge/Grade8CodeChallenge.vue";
import Grade9CodeChallenge from "@/components/code-challenge/Grade9CodeChallenge.vue";
import Grade10CodeChallenge from "@/components/code-challenge/Grade10CodeChallenge.vue";

import axios from "axios";
export default {
  components: {
    Header,
    HeaderContent,
    Footer,
    BlockingLoader,
    Grade1CodeChallenge,
    Grade2CodeChallenge,
    Grade3CodeChallenge,
    Grade4CodeChallenge,
    Grade5CodeChallenge,
    Grade6CodeChallenge,
    Grade7CodeChallenge,
    Grade8CodeChallenge,
    Grade9CodeChallenge,
    Grade10CodeChallenge
  },
  data() {
    return {
      challengeInfo: null,
      liveChallenges: null,
      grades: null,
      activeCodeChallegesForGrades: null,
      showingQuestionForGrade: 0,
      processes: []
    };
  },
  mounted() {
    cvAuth.getUserId(
      function(userId) {
        if (userId && this.$store.getters.getAuthData.auth_role_id != 2) {
          window.open("/", "_self");
        }
      }.bind(this)
    );
    this.getLiveCodeChallenges();
    this.getGradesAndSectionsHavingLiveCodeChallenges();
    this.getActiveCodeChallenges();
  },
  methods: {
    getLiveCodeChallenges() {
      this.$http
        .post("/api/projects/getLiveCodeChallenges")
        .then(function(res) {
          this.challengeInfo = res.body;
          this.liveChallenges = res.body;
        })
        .catch(function(err) {
          this.$router.push("/projects");
        });
    },
    getGradesAndSectionsHavingLiveCodeChallenges() {
      this.$http
        .post("/api/projects/getGradesAndSectionsHavingLiveCodeChallenges")
        .then(function(res) {
          this.grades = res.body;
          console.log(this.grades);
        })
        .catch(function(err) {});
    },
    getActiveCodeChallenges() {
      this.$http
        .post("/api/projects/getActiveCodeChallengesForGrades")
        .then(function(res) {
          this.activeCodeChallegesForGrades = res.body;
        })
        .catch(function(err) {});
    },
    getSectionName(sectionId) {
      return getSectionName(sectionId);
    },
    handleStartButtonClicked(e) {
      var grade = e.currentTarget.dataset.grade;
      var section = e.currentTarget.dataset.section;
      var vm = this;
      var eventId = this.liveChallenges[grade].event_id;
      if (!grade || !section || !eventId) {
        return;
      }
      showConfirmationDialog({
        title:
          "Start Code Challenge for Grade " +
          grade +
          ", Section " +
          getSectionName(section) +
          "?",
        message:
          "The Challenge will remain active during school hours for <b>ONLY</b> today.",
        callback: function(type, dismissFunction) {
          if (type == "positive") {
            vm.processes.push("a");
            vm.$http
              .post("/api/projects/startCodeChallengeForGrade", {
                event_id: eventId,
                grade: grade,
                section: section
              })
              .then(function(res) {
                vm.processes.pop();
                dismissFunction();
                vm.getActiveCodeChallenges();
                vm.showQuestionForGrade(parseInt(grade));
              })
              .catch(function(err) {});
          }
        },
        positiveButton: "Start",
        positiveButtonClass: "negative",
        manualDismissOnPositive: true
      });
    },
    showQuestionForGrade(grade) {
      this.showingQuestionForGrade = grade;
      showModal("code-challenge-question-modal");
    }
  }
};
</script>

<style lang="scss">
#code-challenge-manager-root {
  & > .container {
    padding-bottom: 0;
  }
  #manager-grades-list {
    width: 400px;
    min-height: 400px;
    margin: 0 auto 32px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    & > div {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 16px 24px;
      p {
        flex-grow: 1;
      }
      .btn {
        color: #fff;
      }
    }
  }
}
</style>
