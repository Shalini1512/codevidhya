<template>
  <div id="code-challenge-submissions-root">
    <Header>
      <HeaderContent />
    </Header>
    <div class="container">
      <div
        v-if="grades"
        id="submissions-manager-container"
        :style="'height:' + (this.viewportHeight - 59 - 16) + 'px'"
      >
        <!--div v-for="grade in grades" :key="'' + grade.cls_id + grade.sec_id">
          <p>
            Grade {{ grade.cls_id }} Section {{ getSectionName(grade.sec_id) }}
          </p>
        </div-->
        <div id="grades-list" data-simplebar>
          <div>
            <div
              v-for="grade in grades"
              :key="'' + grade.cls_id + grade.sec_id"
              :class="
                'project-submission-grade-item' +
                  (grade.cls_id == selectedGrade &&
                  grade.sec_id == selectedSection
                    ? ' active'
                    : '') +
                  (grade.ranking_completed == 'todo-remove-this'
                    ? ' ranking-completed'
                    : '')
              "
              :data-grade="grade.cls_id"
              :data-section="grade.sec_id"
              :data-event-id="grade.event_id"
              @click="handleGradeSelected($event)"
            >
              <p>
                Grade {{ grade.cls_id }} Section
                {{ getSectionName(grade.sec_id) }}
              </p>
            </div>
          </div>
        </div>
        <div
          class="flex-grow-1"
          style="min-height: 0; display: flex; flex-direction: column;"
        >
          <div
            v-if="
              codeChallengeWinners[selectedEventId] &&
                (selectedGradeSubmissionsCount >= 2
                  ? codeChallengeWinners[selectedEventId].first &&
                    codeChallengeWinners[selectedEventId].second
                  : codeChallengeWinners[selectedEventId].first)
            "
            class="winners-selected-bar"
          >
            <p>
              Winners for this grade have been selected. That's all for this
              grade.
            </p>
          </div>

          <div
            v-else-if="codeChallengeRatingCompletedGrades[selectedGrade]"
            class="rating-completed-bar"
          >
            <p>
              All submissions from this grade are rated. You can now select the
              winners.
            </p>
            <button class="btn" @click="handleSelectWinnerClicked($event)">
              SELECT WINNERS
            </button>
          </div>
          <div class="flex-grow-1" data-simplebar>
            <div id="project-submissions-list">
              <template v-if="selectedGradeSectionSubmissions">
                <div
                  v-for="item in selectedGradeSectionSubmissions"
                  :key="item.submission_id"
                  class="d-flex flex-row align-items-center"
                >
                  <div class="flex-grow-1">
                    <p>{{ item.project_name }}</p>
                    <p>
                      <small>Submission id: {{ item.submission_id }}</small>
                    </p>
                  </div>
                  <button
                    class="btn btn-primary btn-sm m-0 mr-1"
                    :data-project-id="item.project_id"
                    @click="handleViewProjectClicked($event)"
                  >
                    VIEW PROJECT
                  </button>
                  <button
                    v-if="existingRatings[item.submission_id]"
                    class="btn btn-success btn-sm m-0"
                    :data-project-id="item.submission_id"
                    :data-project-type="item.project_type"
                    @click="handleRateProjectClicked($event)"
                  >
                    RATED
                  </button>
                  <button
                    v-else
                    class="btn btn-primary btn-sm m-0"
                    :data-project-id="item.submission_id"
                    :data-project-type="item.project_type"
                    @click="handleRateProjectClicked($event)"
                  >
                    RATE
                  </button>
                </div>
              </template>
              <ContentLoader v-else id="code-challenge-submissions-loader" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="project-rating-modal" class="cv-modal medium">
      <div>
        <div class="header">
          <h3 style="font-family: 'Rubik'">Rate project</h3>
        </div>
        <div class="body p-4">
          <ContentLoader
            v-if="
              showingProjectRatingModalFor && selectedSubmissionRatings == null
            "
          />
          <div
            :style="
              'overflow: hidden; height:' +
                (selectedSubmissionRatings != null ? 'auto' : '0')
            "
          >
            <div class="cv-input-group">
              <table>
                <thead>
                  <tr>
                    <th>Criteria</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody v-if="currentlyRatingProjectType == 'web'">
                  <tr
                    v-for="(value, name) in webProjectRatingCriteria"
                    :key="name"
                  >
                    <td>{{ value }}</td>
                    <td>
                      <div :id="'criteria-' + name" class="score-bar">
                        <label v-for="score in scoreValues" :key="score">
                          <input type="checkbox" :value="score" />
                          <div>{{ score }}</div>
                        </label>
                      </div>
                    </td>
                  </tr>
                </tbody>
                <tbody v-if="currentlyRatingProjectType == 'scratch'">
                  <tr
                    v-for="(value, name) in scratchProjectRatingCriteria"
                    :key="name"
                  >
                    <td>{{ value }}</td>
                    <td>
                      <div :id="'criteria-' + name" class="score-bar">
                        <label v-for="score in scoreValues" :key="score">
                          <input type="checkbox" :value="score" />
                          <div>{{ score }}</div>
                        </label>
                      </div>
                    </td>
                  </tr>
                </tbody>
                <tbody v-if="currentlyRatingProjectType == 'python'">
                  <tr
                    v-for="(value, name) in pythonProjectRatingCriteria"
                    :key="name"
                  >
                    <td>{{ value }}</td>
                    <td>
                      <div :id="'criteria-' + name" class="score-bar">
                        <label v-for="score in scoreValues" :key="score">
                          <input type="checkbox" :value="score" />
                          <div>{{ score }}</div>
                        </label>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <small v-if="ratingNotGiven" class="error"
                >Please give ratings.</small
              >
            </div>

            <div class="cv-input-group">
              <label>Remark</label>
              <textarea
                id="project-submission-remark"
                class="cv-input"
                rows="3"
                v-model="remark"
                placeholder="Student will see this."
              ></textarea>
              <small v-if="saveRatingClicked && !remark" class="error"
                >Please write a remark.</small
              >
            </div>
            <p
              v-if="codeChallengeRatingCompletedGrades[selectedGrade]"
              style="color: red"
            >
              <b>Notice:</b> Cannot change ratings after all submissions are
              rated.
            </p>
          </div>
        </div>
        <i class="flex-filler"></i>
        <div class="footer">
          <button class="btn btn-secondary" @click="handleDismissRatingModal()">
            Close
          </button>
          <button
            v-if="!codeChallengeRatingCompletedGrades[selectedGrade]"
            class="btn btn-primary"
            @click="handleSaveRatingClicked()"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <div id="winner-selection-modal" class="cv-modal medium">
      <div>
        <div class="header">
          <h3 style="font-family: 'Rubik'">Select winners</h3>
        </div>
        <div class="body px-4">
          <!--ContentLoader /-->
          <div
            v-if="codeChallengeWinners[selectedEventId]"
            id="selected-winners"
          >
            <div
              v-if="codeChallengeWinners[selectedEventId].first"
              class="winner-selection-item"
            >
              <p>First place selected!</p>
            </div>

            <div
              v-if="codeChallengeWinners[selectedEventId].second"
              class="winner-selection-item"
            >
              <p>Second place selected!</p>
            </div>
          </div>
          <div
            v-if="
              codeChallengeWinners[selectedEventId] &&
                (selectedGradeSubmissionsCount >= 2
                  ? codeChallengeWinners[selectedEventId].first &&
                    codeChallengeWinners[selectedEventId].second
                  : codeChallengeWinners[selectedEventId].first)
            "
            style="padding: 16px; background: green; color: #fff"
          >
            All done with this grade!
          </div>
          <div
            v-if="
              !codeChallengeWinners[selectedEventId] ||
                !codeChallengeWinners[selectedEventId].first ||
                !codeChallengeWinners[selectedEventId].second
            "
          >
            <div
              v-for="topScorer in selectedGradeTopScorers"
              :key="topScorer.submission_id"
              class="winner-selection-item"
            >
              <p class="top-scorer-item">
                <small>Submission id: {{ topScorer.submission_id }}</small>
              </p>
              <span class="mr-2">Score: {{ topScorer.score }}</span>
              <button
                v-if="
                  codeChallengeWinners[selectedEventId] &&
                    !codeChallengeWinners[selectedEventId].first
                "
                class="btn btn-primary btn-sm m-0 mr-1"
                data-place="1"
                :data-submission-id="topScorer.submission_id"
                @click="handleWinnerSelected($event)"
              >
                SELECT AS FIRST PLACE WINNER
              </button>
              <button
                v-else-if="
                  codeChallengeWinners[selectedEventId] &&
                    !codeChallengeWinners[selectedEventId].second
                "
                class="btn btn-secondary btn-sm m-0 mr-1"
                data-place="2"
                :data-submission-id="topScorer.submission_id"
                @click="handleWinnerSelected($event)"
              >
                SELECT AS SECOND PLACE WINNER
              </button>
              <button class="btn btn-primary btn-sm m-0 mr-1">
                VIEW PROJECT
              </button>
            </div>
          </div>
        </div>
        <i class="flex-filler"></i>
        <div class="footer">
          <button
            class="btn btn-secondary"
            onclick="(function() {hideModal('winner-selection-modal')})()"
          >
            Close
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
import HeaderContent from "@/components/code-challenge-submissions/HeaderContent.vue";
import ContentLoader from "@/components/widgets/ContentLoader.vue";
import BlockingLoader from "@/components/widgets/BlockingLoader.vue";

import axios from "axios";
export default {
  components: {
    Header,
    HeaderContent,
    ContentLoader,
    BlockingLoader
  },
  data() {
    return {
      challengeInfo: null,
      // eventId: null,
      grades: null,
      activeCodeChallegesForGrades: null,
      gradeSubmissions: null,
      selectedGradeSubmissionsCount: 0,
      selectedGradeSectionSubmissions: null,
      selectedGrade: null,
      selectedSection: null,
      selectedEventId: null,
      showingProjectRatingModalFor: null,
      webProjectRatingCriteria: {},
      scratchProjectRatingCriteria: {},
      pythonProjectRatingCriteria: {},
      scoreValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      currentlyRatingProjectType: null,
      ratingNotGiven: false,
      remark: "",
      saveRatingClicked: false,
      selectedSubmissionRatings: null,
      existingRatings: {},
      codeChallengeRatingCompletedGrades: {},
      codeChallengeWinners: {},
      selectedGradeTopScorers: {},
      processes: [],
      viewportHeight: 0
    };
  },
  mounted() {
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          if (this.$store.getters.getAuthData.auth_role_id != 2) {
            window.open("/", "_self");
          }
          this.getGradesAndSectionsHavingLiveChallenges();
          this.getWebProjectRatingCriteria();
          this.getScratchProjectRatingCriteria();
          this.getPythonProjectRatingCriteria();
        }
      }.bind(this)
    );

    this.viewportHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
  },
  updated() {
    this.initScoreBars();
  },
  methods: {
    getWebProjectRatingCriteria() {
      this.$http
        .post("/api/projects/getCodeChallengeRatingCriteriaFor", {
          project_type: "web"
        })
        .then(function(res) {
          var criteria = res.body;
          for (var key in criteria) {
            if (!key.match(/criteria_[0-9]/)) {
              delete criteria[key];
            }
          }
          this.webProjectRatingCriteria = criteria;
        })
        .catch(function(err) {
          handleFatalError();
        });
    },
    getScratchProjectRatingCriteria() {
      this.$http
        .post("/api/projects/getCodeChallengeRatingCriteriaFor", {
          project_type: "scratch"
        })
        .then(function(res) {
          var criteria = res.body;
          for (var key in criteria) {
            if (!key.match(/criteria_[0-9]/)) {
              delete criteria[key];
            }
          }
          this.scratchProjectRatingCriteria = criteria;
        })
        .catch(function(err) {
          handleFatalError();
        });
    },
    getPythonProjectRatingCriteria() {
      this.$http
        .post("/api/projects/getCodeChallengeRatingCriteriaFor", {
          project_type: "python"
        })
        .then(function(res) {
          var criteria = res.body;
          for (var key in criteria) {
            if (!key.match(/criteria_[0-9]/)) {
              delete criteria[key];
            }
          }
          this.pythonProjectRatingCriteria = criteria;
        })
        .catch(function(err) {
          handleFatalError();
        });
    },
    getGradesAndSectionsHavingLiveChallenges() {
      this.$http
        .post("/api/projects/getGradesAndSectionsHavingLiveCodeChallenges")
        .then(function(res) {
          this.grades = res.body;
          this.selectedGrade = this.grades[0].cls_id;
          this.selectedSection = this.grades[0].sec_id;
          this.selectedEventId = this.grades[0].event_id;
          this.getSubmissionsCountForGrade(this.selectedGrade);
          this.getSubmissionsForGradeSection(
            this.selectedGrade,
            this.selectedSection
          );
          this.getRatingCompletionStatusForGrade(
            this.selectedEventId,
            this.selectedGrade
          );
          this.getExistingCodeChallengeWinners(this.selectedEventId);
        })
        .catch(function(err) {
          handleFatalError();
        });
    },
    getSubmissionsCountForGrade(grade, section) {
      this.$http
        .post("/api/projects/getCodeChallengeSubmissionsCountForGrade", {
          grade: "" + grade
        })
        .then(function(res) {
          this.selectedGradeSubmissionsCount = parseInt(res.body.count);
        })
        .catch(function(err) {
          handleFatalError();
        });
    },
    getSubmissionsForGradeSection(grade, section) {
      this.$http
        .post("/api/projects/getCodeChallengeSubmissionsForGradeSection", {
          grade: "" + grade,
          section: "" + section
        })
        .then(function(res) {
          if (!this.gradeSubmissions) this.gradeSubmissions = new Object();
          this.gradeSubmissions[grade + "-" + section] = res.body;
          this.selectedGradeSectionSubmissions = res.body;
        })
        .catch(function(err) {
          handleFatalError();
        });
      this.getExistingRatingsForGrade(grade, section);
    },

    getExistingRatingsForGrade(grade, section) {
      this.$http
        .post("/api/projects/getCodeChallengeRatingsForGrade", {
          grade: "" + grade,
          section: "" + section
        })
        .then(function(res) {
          var ratings = res.body;
          var existingRatings = JSON.parse(
            JSON.stringify(this.existingRatings)
          );
          for (var i = 0; i < ratings.length; i++) {
            existingRatings[ratings[i].submission_id] = "exists";
          }
          this.existingRatings = existingRatings;
        })
        .catch(function(err) {
          handleFatalError();
        });
    },

    handleGradeSelected(e) {
      this.selectedGradeSectionSubmissions = null;
      this.selectedGrade = e.currentTarget.dataset.grade;
      this.selectedSection = e.currentTarget.dataset.section;
      this.selectedEventId = e.currentTarget.dataset.eventId;
      this.getSubmissionsCountForGrade(this.selectedGrade);
      this.getSubmissionsForGradeSection(
        this.selectedGrade,
        this.selectedSection
      );
      this.getExistingCodeChallengeWinners(this.selectedEventId);
      this.getRatingCompletionStatusForGrade(
        this.selectedEventId,
        this.selectedGrade
      );
    },
    handleViewProjectClicked(e) {
      var projectId = e.currentTarget.dataset.projectId;
      window.open("/projects/" + projectId, "_blank");
    },
    handleRateProjectClicked(e) {
      this.showingProjectRatingModalFor = e.currentTarget.dataset.projectId;
      this.currentlyRatingProjectType = e.currentTarget.dataset.projectType;
      showModal("project-rating-modal");
      this.$http
        .post("/api/projects/getCodeChallengeRatingForSubmission", {
          submission_id: this.showingProjectRatingModalFor
        })
        .then(function(result) {
          if (!result.body.submission_id) {
            this.selectedSubmissionRatings = new Object();
            return;
          }
          if (this.showingProjectRatingModalFor == result.body.submission_id) {
            this.selectedSubmissionRatings = result.body;
            for (var key in this.selectedSubmissionRatings) {
              $(
                $("#criteria-" + key + " label")[
                  this.selectedSubmissionRatings[key]
                ]
              ).click();
            }
            this.remark = this.selectedSubmissionRatings.remark;
          }
        })
        .catch(function(err) {});
    },
    handleDismissRatingModal() {
      hideModal("project-rating-modal");
      this.showingProjectRatingModalFor = null;
      this.resetScoreBars();
      this.remark = "";
      this.saveRatingClicked = false;
      this.ratingNotGiven = false;
      this.selectedSubmissionRatings = null;
    },
    getSectionName(sectionId) {
      return getSectionName(sectionId);
    },
    initScoreBars() {
      var scoreBoxes = $(".score-bar label:not('.init')");
      scoreBoxes.on("click", function(e) {
        e.preventDefault();
        $(e.currentTarget.parentElement)
          .find("input[type=checkbox]")
          .prop("checked", false);
        $(e.currentTarget)
          .find("input[type=checkbox]")
          .prop("checked", true);

        $(e.currentTarget)
          .prevAll()
          .css("background-color", "rgb(42, 167, 63)");
        $(e.currentTarget).css("background-color", "rgb(42, 167, 63)");
        $(e.currentTarget)
          .nextAll()
          .css("background-color", "transparent");
      });
      scoreBoxes.addClass("init");
    },
    resetScoreBars() {
      var labels = $(".score-bar label");
      labels.css("background-color", "transparent");
      labels.find("input[type=checkbox]").prop("checked", false);
    },
    handleSaveRatingClicked() {
      this.saveRatingClicked = true;
      var scores = new Object();
      this.ratingNotGiven = false;
      var grade = this.selectedGrade;
      var eventId = this.selectedEventId;
      if (this.currentlyRatingProjectType == "web") {
        for (var key in this.webProjectRatingCriteria) {
          var score = $("#criteria-" + key + " input[type=checkbox]:checked");
          if (score.length) {
            scores[key] = score.val();
          } else {
            this.ratingNotGiven = true;
            break;
          }
        }
      }
      if (this.currentlyRatingProjectType == "scratch") {
        for (var key in this.scratchProjectRatingCriteria) {
          var score = $("#criteria-" + key + " input[type=checkbox]:checked");
          if (score.length) {
            scores[key] = score.val();
          } else {
            this.ratingNotGiven = true;
            break;
          }
        }
      }
      if (this.currentlyRatingProjectType == "python") {
        for (var key in this.pythonProjectRatingCriteria) {
          var score = $("#criteria-" + key + " input[type=checkbox]:checked");
          if (score.length) {
            scores[key] = score.val();
          } else {
            this.ratingNotGiven = true;
            break;
          }
        }
      }

      if (this.ratingNotGiven || !this.remark) {
        return;
      }

      var submissionId = this.showingProjectRatingModalFor;
      this.$http
        .post("/api/projects/saveCodeChallengeSubmissionRating", {
          submission_id: "" + submissionId,
          ratings: scores,
          remark: this.remark
        })
        .then(function(res) {
          hideModal("project-rating-modal");
          cvNotify("Rating saved.");
          this.handleDismissRatingModal();
          var existingRatings = JSON.parse(
            JSON.stringify(this.existingRatings)
          );
          existingRatings[submissionId] = "exists";
          this.existingRatings = existingRatings;
          this.getRatingCompletionStatusForGrade(eventId, grade);
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    getRatingCompletionStatusForGrade(eventId, grade) {
      this.$http
        .post("/api/projects/getCodeChallengeRatingCompletionStatusForGrade", {
          event_id: "" + eventId,
          grade: "" + grade
        })
        .then(function(res) {
          var data = res.body;
          if (
            data.submissions_count &&
            data.submissions_count == data.ratings_count
          ) {
            var completed = JSON.parse(
              JSON.stringify(this.codeChallengeRatingCompletedGrades)
            );
            completed[grade] = "completed";
            this.codeChallengeRatingCompletedGrades = completed;
          }
        })
        .catch(function(err) {
          handleFatalError();
        });
    },
    handleSelectWinnerClicked(e) {
      var eventId = this.selectedEventId;
      showModal("winner-selection-modal");
      this.getExistingCodeChallengeWinners(this.selectedEventId);
      this.getTopScorersInEvent(this.selectedEventId);
    },
    getExistingCodeChallengeWinners(eventId) {
      this.$http
        .post("/api/projects/getExistingWinnersForCodeChallenge", {
          event_id: "" + eventId,
          grade: "" + this.selectedGrade
        })
        .then(function(res) {
          var data = res.body;
          var winnerData = new Object();
          for (var i = 0; i < data.length; i++) {
            if (data[i].place == 1) winnerData.first = data[i].submission_id;
            if (data[i].place == 2) winnerData.second = data[i].submission_id;
          }
          this.codeChallengeWinners[eventId] = winnerData;
          this.codeChallengeWinners = JSON.parse(
            JSON.stringify(this.codeChallengeWinners)
          );
        })
        .catch(function(err) {
          handleFatalError();
        });
    },
    getTopScorersInEvent(eventId) {
      this.$http
        .post("/api/projects/getTopScorersInCodeChallenge", {
          event_id: "" + eventId
        })
        .then(function(res) {
          var data = res.body;
          this.selectedGradeTopScorers = data;
        })
        .catch(function(err) {
          handleFatalError();
        });
    },
    handleWinnerSelected(e) {
      var place = e.currentTarget.dataset.place;
      var submissionId = e.currentTarget.dataset.submissionId;
      var vm = this;
      showConfirmationDialog({
        title: "Are you sure?",
        message:
          "Select this submission as " +
          (place == 1 ? "first" : "second") +
          " place winner for this grade?",
        callback: function(type, dismiss) {
          vm.$http
            .post("/api/projects/setSubmissionAsWinner", {
              submission_id: submissionId,
              place: parseInt(place)
            })
            .then(function(res) {
              var winnerData = vm.codeChallengeWinners[vm.selectedEventId]
                ? vm.codeChallengeWinners[vm.selectedEventId]
                : new Object();
              if (place == "1") winnerData.first = submissionId;
              if (place == "2") winnerData.second = submissionId;
              vm.codeChallengeWinners[vm.selectedEventId] = winnerData;
              vm.codeChallengeWinners = JSON.parse(
                JSON.stringify(vm.codeChallengeWinners)
              );

              vm.getTopScorersInEvent(vm.selectedEventId);
              vm.getGradesAndSectionsHavingLiveChallenges();

              dismiss();
            })
            .catch(function(err) {
              if (err.body === "winner_already_exists") {
                cvNotify(
                  "This submission has already been selected as a winner.",
                  "error"
                );
              }
              if (err.body === "place_taken") {
                cvNotify("There is already a winner with this place.", "error");
              }
            });
        },
        manualDismissOnPositive: true
      });
    }
  }
};
</script>

<style lang="scss">
#code-challenge-submissions-root {
  #submissions-manager-container {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    width: 800px;
    min-height: 0;
    margin: 8px auto;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    overflow: hidden;
    #grades-list {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      width: 200px;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
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
    .project-submission-grade-item {
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
      counter-reset: item-counter;
      & > div:not(#code-challenge-submissions-loader) {
        padding: 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        &::before {
          counter-increment: item-counter;
          content: counter(item-counter);
          display: flex;
          line-height: 24px;
          padding: 0 16px;
        }
        &:hover {
          background: rgba(0, 0, 0, 0.03);
        }
      }
      h4 {
        font-family: "Rubik", sans-serif;
      }
    }

    .rating-completed-bar,
    .winners-selected-bar {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 8px;
      padding: 16px;
      background: rgb(39, 184, 58);
      color: #fff;
      border-radius: 8px;
      button {
        flex-shrink: 0;
        margin-left: 16px;
        background: #fff;
        color: #444;
      }
    }
    .winners-selected-bar {
      background: rgb(228, 20, 99);
    }
  }
}

#code-challenge-submissions-loader {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
}

#project-submissions-heading {
  padding-bottom: 16px;
  font: bold 1.2rem/1 "Rubik", sans-serif;
  text-align: center;
}

#project-rating-modal {
  table {
    width: 100%;
  }
  th,
  td {
    padding: 4px;
  }

  .score-bar {
    float: left;
    border-radius: 4px;
    overflow: hidden;
  }

  textarea {
    height: 56px;
  }
}

.score-bar {
  display: flex;
  flex-direction: row;
  label {
    margin: 0;
    input[type="checkbox"] {
      display: none;
    }
    div {
      width: 24px;
      height: 24px;
      background: rgba(0, 0, 0, 0.05);
      font: normal 0.8rem/24px "Rubik", sans-serif;
      text-align: center;
      cursor: pointer;
    }
  }
}

#winner-selection-modal {
  #selected-winners {
    background: rgba(247, 29, 83, 0.39);
  }
  .winner-selection-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    p {
      flex-grow: 1;
    }
    button {
      flex-shrink: 0;
    }
  }
}
</style>
