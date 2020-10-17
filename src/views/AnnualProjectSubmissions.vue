<template>
  <div id="annual-project-submissions-root">
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
            v-if="annualProjectFinalShortlistCompletedGrades[selectedGrade]"
            class="winners-selected-bar"
          >
            <p v-if="~[1, 2, 3].indexOf(parseInt(selectedGrade))">
              Final shortlist for grades 1, 2 and 3 has been created. That's all
              for these grades.
            </p>
            <p v-if="~[4, 5].indexOf(parseInt(selectedGrade))">
              Final shortlist for grades 4 and 5 has been created. That's all
              for these grades.
            </p>
            <p v-if="~[6, 7].indexOf(parseInt(selectedGrade))">
              Final shortlist for grades 6 and 7 has been created. That's all
              for these grades.
            </p>
            <p v-if="~[8, 9, 10].indexOf(parseInt(selectedGrade))">
              Final shortlist for grades 8, 9 and 10 has been created. That's
              all for these grades.
            </p>
          </div>

          <div
            v-else-if="annualProjectRatingCompletedGrades[selectedGrade]"
            class="rating-completed-bar"
          >
            <p v-if="~[1, 2, 3].indexOf(parseInt(selectedGrade))">
              All submissions from grades 1, 2 and 3 have been rated. Final
              shortlisting can now be done.
            </p>
            <p v-if="~[4, 5].indexOf(parseInt(selectedGrade))">
              All submissions from grades 4 and 5 have been rated. Final
              shortlisting can now be done.
            </p>
            <p v-if="~[6, 7].indexOf(parseInt(selectedGrade))">
              All submissions from grades 6 and 7 have been rated. Final
              shortlisting can now be done.
            </p>
            <p v-if="~[8, 9, 10].indexOf(parseInt(selectedGrade))">
              All submissions from grades 8, 9 and 10 have been rated. Final
              shortlisting can now be done.
            </p>
            <button class="btn" @click="handleFinalShortlistClicked($event)">
              MAKE FINAL SHORTLIST
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
                  <div class="flex-grow-1 flex-shrink-1">
                    <p>
                      <small><b>Name:</b> {{ item.project_name }}</small>
                    </p>
                    <p>
                      <small><b>Description:</b> {{ item.description }}</small>
                    </p>
                    <p>
                      <small
                        ><b>Submission id:</b> {{ item.submission_id }}</small
                      >
                    </p>
                  </div>

                  <div class="d-flex flex-column">
                    <button
                      class="btn btn-primary btn-sm m-0 mb-1"
                      :data-project-id="item.project_id"
                      @click="handleViewProjectClicked($event)"
                    >
                      VIEW PROJECT
                    </button>
                    <button
                      v-if="existingShortlist[item.submission_id]"
                      class="btn btn-info btn-sm m-0 mb-1"
                      :data-project-id="item.submission_id"
                      @click="handleRateProjectClicked($event)"
                    >
                      SHORTLISTED
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
                <tbody>
                  <tr
                    v-for="(value, name) in projectRatingCriteria"
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
              <label>
                <input
                  id="shortlist-project"
                  class="cv-input"
                  type="checkbox"
                  v-model="selectedProjectShortlisted"
                />Shortlist for submission to Codevidhya
              </label>
              <small style="margin-left: 32px"
                >This is not the final shortlisting. You can shortlist as many
                projects as you want.</small
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
            <p style="color: red">
              <b>Notice:</b> Once a submission is rated, the student will not be
              allowed to cancel the submission.
            </p>
          </div>
        </div>
        <i class="flex-filler"></i>
        <div class="footer">
          <button class="btn btn-secondary" @click="handleDismissRatingModal()">
            Close
          </button>
          <!--button
            v-if="!annualProjectRatingCompletedGrades[selectedGrade]"
            class="btn btn-primary"
            @click="handleSaveRatingClicked()"
          >
            Save
          </button-->
          <button
            v-if="!annualProjectFinalShortlistCompletedGrades[selectedGrade]"
            class="btn btn-primary"
            @click="handleSaveRatingClicked()"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <div id="final-shortlister-modal" class="cv-modal full">
      <div>
        <div class="header">
          <h3>Create Final Shortlist</h3>
        </div>
        <div class="body px-4 flex-grow-1">
          <ContentLoader v-if="!currentlySelectedGradeGroupShortlist.length" />
          <div v-else id="final-shortlister">
            <div data-simplebar>
              <div id="shortlist-1">
                <div
                  v-for="item in currentlySelectedGradeGroupShortlist"
                  :key="item.submission_id"
                >
                  <p>{{ item.name }}</p>
                  <button
                    class="btn btn-primary btn-sm m-0 mr-1"
                    :data-project-id="item.project_id"
                    @click="handleViewProjectClicked($event)"
                  >
                    VIEW PROJECT
                  </button>
                  <button
                    v-if="
                      currentlySelectedGradeGroupFinalShortlistIds[
                        item.submission_id
                      ]
                    "
                    class="btn btn-secondary btn-sm m-0"
                    :data-submission-id="item.submission_id"
                    @click="handleFinalShortlistItemRemoveClicked($event)"
                  >
                    SHORTLISTED
                  </button>
                  <button
                    v-else
                    class="btn btn-success btn-sm m-0"
                    :data-submission-id="item.submission_id"
                    @click="handleShortlistItemClicked($event)"
                  >
                    SHORTLIST
                  </button>
                </div>
              </div>
            </div>
            <div class="d-flex flex-column">
              <p class="p-2 text-center"><strong>Final Shortlist</strong></p>
              <div class="flex-grow-1" data-simplebar>
                <div id="shortlist-final">
                  <div
                    v-for="item in currentlySelectedGradeGroupFinalShortlist"
                    :key="item.submission_id"
                  >
                    <p>{{ item.name }}</p>
                    <button
                      class="btn btn-primary btn-sm m-0 mr-1"
                      :data-project-id="item.project_id"
                      @click="handleViewProjectClicked($event)"
                    >
                      VIEW
                    </button>
                    <button
                      class="btn btn-danger btn-sm m-0"
                      :data-submission-id="item.submission_id"
                      @click="handleFinalShortlistItemRemoveClicked($event)"
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <button
            class="btn btn-secondary"
            onclick="(function() {hideModal('final-shortlister-modal')})()"
          >
            Close
          </button>
          <button
            class="btn btn-primary"
            @click="handleFinalShortlistSubmitClicked()"
          >
            SUBMIT FINAL SHORTLIST
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
import HeaderContent from "@/components/annual-project-submissions/HeaderContent.vue";
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
      projectRatingCriteria: {},
      scoreValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      currentlyRatingProjectType: null,
      ratingNotGiven: false,
      remark: "",
      selectedProjectShortlisted: false,
      saveRatingClicked: false,
      selectedSubmissionRatings: null,
      existingRatings: {},
      existingShortlist: {},
      annualProjectRatingCompletedGrades: {},
      codeChallengeWinners: {},
      selectedGradeTopScorers: {},
      processes: [],
      viewportHeight: 0,
      currentlySelectedGradeGroupShortlist: [],
      currentlySelectedGradeGroupFinalShortlistIds: [],
      currentlySelectedGradeGroupFinalShortlist: [],
      annualProjectFinalShortlistCompletedGrades: {}
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
          this.getProjectRatingCriteria();
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
    getProjectRatingCriteria() {
      this.$http
        .post("/api/projects/getAnnualProjectRatingCriteria")
        .then(function(res) {
          var criteria = res.body;
          for (var key in criteria) {
            if (!key.match(/criteria_[0-9]/)) {
              delete criteria[key];
            }
          }
          this.projectRatingCriteria = criteria;
        })
        .catch(function(err) {
          handleFatalError();
        });
    },
    getGradesAndSectionsHavingLiveChallenges() {
      this.$http
        .post("/api/projects/getGradesAndSectionsHavingLiveAnnualProject")
        .then(function(res) {
          this.grades = res.body;
          if (this.grades.length) {
            this.selectedGrade = this.grades[0].cls_id;
            this.selectedSection = this.grades[0].sec_id;
            this.selectedEventId = this.grades[0].event_id;
            this.getSubmissionsCountForGrade(this.selectedGrade);
            this.getSubmissionsForGradeSection(
              this.selectedGrade,
              this.selectedSection
            );
            this.getRatingCompletionStatusForGradeGroup(
              this.selectedEventId,
              this.selectedGrade
            );
            this.getFinalShortlistCompletionStatusForGradeGroup(
              this.selectedGrade
            );
          }
          //this.getExistingAnnualProjectShortlist1(this.selectedEventId);
        })
        .catch(function(err) {
          handleFatalError();
        });
    },
    getSubmissionsCountForGrade(grade, section) {
      this.$http
        .post("/api/projects/getAnnualProjectSubmissionsCountForGrade", {
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
        .post("/api/projects/getAnnualProjectSubmissionsForGradeSection", {
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
        .post("/api/projects/getAnnualProjectRatingsForGrade", {
          grade: "" + grade,
          section: "" + section
        })
        .then(function(res) {
          var ratings = res.body;
          var existingRatings = recreateObject(this.existingRatings);
          for (var i = 0; i < ratings.length; i++) {
            existingRatings[ratings[i].submission_id] = "exists";
          }
          this.existingRatings = existingRatings;

          var existingShortlist = recreateObject(this.existingShortlist);
          for (var i = 0; i < ratings.length; i++) {
            existingShortlist[ratings[i].submission_id] = existingRatings[
              ratings[i].shortlisted
            ]
              ? true
              : false;
          }
          this.existingShortlist = existingShortlist;
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
      //this.getExistingAnnualProjectShortlist1(this.selectedEventId);
      this.getRatingCompletionStatusForGradeGroup(
        this.selectedEventId,
        this.selectedGrade
      );
      this.getFinalShortlistCompletionStatusForGradeGroup(this.selectedGrade);
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
        .post("/api/projects/getAnnualProjectRatingForSubmission", {
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
            this.selectedProjectShortlisted = this.existingShortlist[
              this.showingProjectRatingModalFor
            ];
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
      this.selectedProjectShortlisted = false;
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

      for (var key in this.projectRatingCriteria) {
        var score = $("#criteria-" + key + " input[type=checkbox]:checked");
        if (score.length) {
          scores[key] = score.val();
        } else {
          this.ratingNotGiven = true;
          break;
        }
      }

      if (this.ratingNotGiven || !this.remark) {
        return;
      }

      var shortlist = $("#shortlist-project").prop("checked");

      var submissionId = this.showingProjectRatingModalFor;
      this.$http
        .post("/api/projects/saveAnnualProjectSubmissionRating", {
          event_id: "" + eventId,
          submission_id: "" + submissionId,
          ratings: scores,
          remark: this.remark,
          shortlist: shortlist
        })
        .then(function(res) {
          hideModal("project-rating-modal");
          cvNotify("Rating saved.");
          this.handleDismissRatingModal();
          var existingRatings = recreateObject(this.existingRatings);
          existingRatings[submissionId] = "exists";
          this.existingRatings = existingRatings;

          var existingShortlist = recreateObject(this.existingShortlist);
          existingShortlist[submissionId] = shortlist;
          this.existingShortlist = existingShortlist;

          this.getRatingCompletionStatusForGradeGroup(eventId, grade);
        })
        .catch(function(err) {});
    },
    getRatingCompletionStatusForGradeGroup(eventId, grade) {
      this.$http
        .post(
          "/api/projects/getAnnualProjectRatingCompletionStatusForGradeGroup",
          {
            event_id: "" + eventId,
            grade: "" + grade
          }
        )
        .then(function(res) {
          var data = res.body;
          if (
            data.submissions_count &&
            data.submissions_count == data.ratings_count
          ) {
            var completed = recreateObject(
              this.annualProjectRatingCompletedGrades
            );
            completed[grade] = "completed";
            this.annualProjectRatingCompletedGrades = completed;
          }
        })
        .catch(function(err) {
          handleFatalError();
        });
    },
    handleFinalShortlistClicked(e) {
      var eventId = this.selectedEventId;
      showModal("final-shortlister-modal");
      this.getExistingAnnualProjectShortlist1(this.selectedEventId);
    },
    getExistingAnnualProjectShortlist1(eventId) {
      var grade = this.selectedGrade;
      this.currentlySelectedGradeGroupShortlist = new Array();
      this.currentlySelectedGradeGroupFinalShortlistIds = new Object();
      this.$http
        .post("/api/projects/getAnnualProjectShortlist1", {
          event_id: "" + eventId,
          grade: "" + grade
        })
        .then(function(res) {
          var data = res.body;
          if (grade == data.grade) {
            this.currentlySelectedGradeGroupShortlist = data.shortlist;
          }
        })
        .catch(function(err) {
          handleFatalError();
        });
    },

    handleShortlistItemClicked(e) {
      var submissionId = e.currentTarget.dataset.submissionId;
      if (this.currentlySelectedGradeGroupFinalShortlistIds[submissionId])
        return;

      if (this.currentlySelectedGradeGroupFinalShortlist.length >= 3) {
        cvNotify("Only 3 submissions allowed for final shortlist.");
        return;
      }

      for (
        var i = 0;
        i < this.currentlySelectedGradeGroupShortlist.length;
        i++
      ) {
        if (
          this.currentlySelectedGradeGroupShortlist[i].submission_id ==
          submissionId
        ) {
          this.currentlySelectedGradeGroupFinalShortlist.push(
            this.currentlySelectedGradeGroupShortlist[i]
          );
          this.currentlySelectedGradeGroupFinalShortlistIds[submissionId] = "a";
          break;
        }
      }
    },
    handleFinalShortlistItemRemoveClicked(e) {
      var submissionId = e.currentTarget.dataset.submissionId;
      for (
        var i = 0;
        i < this.currentlySelectedGradeGroupFinalShortlist.length;
        i++
      ) {
        if (
          this.currentlySelectedGradeGroupFinalShortlist[i].submission_id ==
          submissionId
        ) {
          this.currentlySelectedGradeGroupFinalShortlist.splice(i, 1);
          delete this.currentlySelectedGradeGroupFinalShortlistIds[
            submissionId
          ];
          break;
        }
      }
    },
    handleFinalShortlistSubmitClicked() {
      var vm = this;
      if (this.currentlySelectedGradeGroupFinalShortlist.length < 3) {
        showConfirmationDialog({
          title: "There are less than 3 submissions",
          message:
            "You should add 3 submissions to the final shortlist. Sure to submit final shortlist with less than 3 submissions?",
          callback: function(type) {
            if (type == "positive") {
              vm.submitFinalShortlist();
            }
          }
        });
      } else {
        vm.submitFinalShortlist();
      }
    },
    submitFinalShortlist() {
      this.processes.push("a");
      this.$http
        .post("/api/projects/submitFinalAnnualProjectShortlist", {
          shortlist: this.currentlySelectedGradeGroupFinalShortlist
        })
        .then(function(result) {
          this.processes.pop();
          hideModal("final-shortlister-modal");
          this.currentlySelectedGradeGroupShortlist = new Array();
          this.currentlySelectedGradeGroupFinalShortlist = new Array();
          this.currentlySelectedGradeGroupFinalShortlistIds = new Array();
          this.getFinalShortlistCompletionStatusForGradeGroup(
            this.selectedGrade
          );
        })
        .catch(function(err) {
          this.processes.pop();
        });
    },
    getFinalShortlistCompletionStatusForGradeGroup(grade) {
      this.$http
        .post("/api/projects/getFinalShortlistCompletionStatusForGradeGroup", {
          grade: "" + grade
        })
        .then(function(res) {
          var data = res.body;
          if (data.shortlist_count > 0)
            this.annualProjectFinalShortlistCompletedGrades[data.grade] =
              "completed";
          this.annualProjectFinalShortlistCompletedGrades = recreateObject(
            this.annualProjectFinalShortlistCompletedGrades
          );
        })
        .catch(function(err) {
          handleFatalError();
        });
    }
  }
};
</script>

<style lang="scss">
#annual-project-submissions-root {
  #submissions-manager-container {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    width: 100%;
    min-height: 0;
    margin: 8px auto;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.1);
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
      p {
        word-wrap: break-word;
      }
    }

    .rating-completed-bar,
    .winners-selected-bar {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 16px;
      background: rgb(39, 184, 58);
      color: #fff;
      p {
        flex-grow: 1;
      }
      button {
        flex-shrink: 0;
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

#final-shortlister-modal {
  & > div {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 90%;
  }
}

#final-shortlister {
  display: flex;
  flex-direction: row;
  height: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  > div {
    width: 50%;
    height: 100%;
    &:first-of-type {
      border-right: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  #shortlist-1,
  #shortlist-final {
    & > div {
      display: flex;
      flex-direction: row;
      padding: 24px;
      p {
        flex-grow: 1;
      }
    }
  }
}
</style>
