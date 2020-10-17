<template>
  <div id="projects-root">
    <Header>
      <HeaderContent
        :onCreateNewClick="onCreateNewClick"
        :handleShowSubmissions="handleShowSubmissions"
      />
    </Header>
    <ul
      v-if="isTeacher"
      class="nav row nav-pills justify-content-center bg-secondary"
    >
      <!--li class="nav-item m-2">
        <router-link to="/projects/students" class="nav-link">
          Students' projects
        </router-link>
      </li-->

      <li class="nav-item dropdown m-2">
        <a
          class="nav-link dropdown-toggle"
          data-toggle="dropdown"
          href="#"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
          >Code Challenge</a
        >
        <div
          class="dropdown-menu"
          x-placement="bottom-start"
          style="position: absolute; will-change: transform; top: -4px; left: 0px; transform: translate3d(0px, 27px, 0px);"
        >
          <router-link
            to="/projects/code-challenge/manage"
            class="dropdown-item"
          >
            Manage
          </router-link>
          <router-link
            to="/projects/code-challenge/submissions"
            class="dropdown-item"
          >
            Submissions
          </router-link>
        </div>
      </li>

      <!-- TODO -->
      <li class="nav-item m-2">
        <router-link to="/projects/annual-project/submissions" class="nav-link">
          Annual Project
        </router-link>
      </li>

      <!--li class="nav-item dropdown m-2">
        <a
          class="nav-link dropdown-toggle"
          data-toggle="dropdown"
          href="#"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
          >Submissions</a
        >
        <div
          class="dropdown-menu"
          x-placement="bottom-start"
          style="position: absolute; will-change: transform; top: -4px; left: 0px; transform: translate3d(0px, 27px, 0px);"
        >
          <a
            v-for="challenge in allChallenges"
            class="dropdown-item"
            href="#"
            :data-event-id="challenge.event_id"
            :key="challenge.event_id"
            @click.prevent="
              $router.push(
                '/projects/submissions?event_id=' + challenge.event_id
              )
            "
            >{{ challenge.name }}</a
          >
        </div>
      </li-->
    </ul>

    <section v-if="myCodeChallenge" class="text-center py-5">
      <div id="code-challenge-banner">
        <h2 class="text-center mb-4">
          <b>{{ myCodeChallenge.name }} is live!</b>
        </h2>
        <button
          v-if="!myCodeChallenge.attempted"
          class="btn normal"
          @click="handleCodeChallengeAttemptClicked()"
        >
          ATTEMPT CODE CHALLENGE NOW
        </button>

        <button
          v-else-if="!myCodeChallenge.completed"
          class="btn btn-blue"
          :data-project-id="myCodeChallenge.project_id"
          @click="handleCodeChallengeResumeClicked($event)"
        >
          CONTINUE CODE CHALLENGE
        </button>

        <button v-else class="btn btn-success">
          YOU HAVE COMPLETED CODE CHALLENGE
        </button>
      </div>
    </section>

    <div class="container" style="padding: 48px 0;">
      <template v-if="recentProjects.length">
        <div class="section-title center-block text-center">
          <h2>My recent projects</h2>
        </div>
        <transition-group
          id="project-cards-container"
          name="transition"
          tag="div"
        >
          <div
            v-for="project in recentProjects"
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
              <div class="project-type-tag" style="background-color: #f1c40f">
                {{ project.type }}
              </div>
            </div>
            <div
              v-else-if="project.type == 'python'"
              class="project-card-img"
              style="background-image:url(/assets/images/project-thumbs/python.jpg);"
            >
              <div class="project-type-tag" style="background-color: #3498DB">
                {{ project.type }}
              </div>
            </div>
            <div
              v-else
              class="project-card-img"
              style="background-image:url(/assets/images/project-thumbs/web.svg);"
            >
              <div class="project-type-tag" style="background-color: #E74C3C">
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
              <button
                class="btn btn-primary edit-project-btn"
                @click="
                  $router.push({
                    name: 'project-editor',
                    params: { id: project.project_id }
                  })
                "
              >
                {{ project.code_challenge_entry ? "View" : "Edit" }}
              </button>
              <i class="flex-filler"></i>
              <button
                v-if="!project.code_challenge_entry"
                class="cv-button borderless square"
                :data-project-id="project.project_id"
                :data-code-challenge-entry="project.code_challenge_entry"
                :data-annual-project-entry="project.annual_project_entry"
                @click="showProjectItemContextMenu($event)"
              >
                <i class="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
        </transition-group>
      </template>

      <div class="text-center">
        <button
          v-if="userId && !showAllProjects"
          :class="
            'btn btn-primary' + (loadingAllProjects ? ' btn-loading' : '')
          "
          style="margin: 0 auto 48px;"
          @click="showAllProjects = true"
        >
          See all projects
        </button>
      </div>

      <template v-if="userId && showAllProjects">
        <div class="section-title center-block text-center">
          <h2>My projects</h2>
        </div>
        <div
          id="no-projects"
          v-if="!projects.length"
          style="display: flex; flex-direction: column; align-items: center; width: 100%; padding: 0 32px 32px; text-align: center;"
        >
          <p style="margin-bottom: 16px">You have not created any projects.</p>
          <button class="btn btn-primary" @click="showNewProjectModal()">
            Create project
          </button>
        </div>
        <transition-group
          id="project-cards-container"
          name="transition"
          tag="div"
        >
          <div
            v-for="project in projects"
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
              <div class="project-type-tag" style="background-color: #f1c40f">
                {{ project.type }}
              </div>
            </div>
            <div
              v-else-if="project.type == 'python'"
              class="project-card-img"
              style="background-image:url(/assets/images/project-thumbs/python.jpg);"
            >
              <div class="project-type-tag" style="background-color: #3498DB">
                {{ project.type }}
              </div>
            </div>
            <div
              v-else
              class="project-card-img"
              style="background-image:url(/assets/images/project-thumbs/web.svg);"
            >
              <div class="project-type-tag" style="background-color: #E74C3C">
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
              <button
                class="btn btn-primary edit-project-btn"
                @click="
                  $router.push({
                    name: 'project-editor',
                    params: { id: project.project_id }
                  })
                "
              >
                {{ project.code_challenge_entry ? "View" : "Edit" }}
              </button>
              <i class="flex-filler"></i>
              <button
                v-if="!project.code_challenge_entry"
                class="cv-button borderless square"
                :data-project-id="project.project_id"
                :data-code-challenge-entry="project.code_challenge_entry"
                :data-annual-project-entry="project.annual_project_entry"
                @click="showProjectItemContextMenu($event)"
              >
                <i class="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
        </transition-group>
      </template>

      <div class="section-title center-block text-center">
        <h2>Other also created</h2>
      </div>
      <div
        id="no-projects"
        v-if="!communityProjects.length"
        style="display: flex; flex-direction: column; align-items: center; width: 100%; padding: 32px; text-align: center;"
      >
        <p style="margin-bottom: 16px">There are no community projects yet.</p>
      </div>
      <transition-group
        id="project-cards-container"
        name="transition"
        tag="div"
      >
        <div
          v-for="project in communityProjects"
          :key="project.project_id"
          class="project-card cv-card interactive-card"
          :style="project.hidden ? 'visibility: hidden' : 'visibility: visible'"
        >
          <div
            v-if="project.type == 'scratch'"
            class="project-card-img"
            style="background-image:url(/assets/images/project-thumbs/scratch.png);"
          >
            <div class="project-type-tag" style="background-color: #f1c40f">
              {{ project.type }}
            </div>
          </div>
          <div
            v-else-if="project.type == 'python'"
            class="project-card-img"
            style="background-image:url(/assets/images/project-thumbs/python.jpg);"
          >
            <div class="project-type-tag" style="background-color: #3498DB">
              {{ project.type }}
            </div>
          </div>
          <div
            v-else
            class="project-card-img"
            style="background-image:url(/assets/images/project-thumbs/web.svg);"
          >
            <div class="project-type-tag" style="background-color: #E74C3C">
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
            <img src="/assets/images/users/user.svg" />
            <div class="project-name-school-wrapper">
              <span class="singline">{{ project.user_name }}</span>
              <small v-if="project.sch_id != 1" class="singline">{{
                project.school
              }}</small>
            </div>
            <router-link
              :to="'/projects/preview/' + project.project_id"
              class="view-project-btn btn btn-primary"
              ><i class="fas fa-eye"></i> View</router-link
            >
          </div>
        </div>
      </transition-group>
      <!--button
        v-if="!communityProjectsEndOfList"
        id="show-more-community-projects"
        class="cv cv-button progress-btn"
        style="margin: 0 auto 24px"
        @click="getCommunityProjects()"
      >
        <img src="/static/dashboard/img/gifs/bars.gif" />
        See more
      </button-->
      <div class="text-center">
        <button
          v-if="!communityProjectsEndOfList"
          id="show-more-community-projects"
          :class="
            'btn btn-primary' + (loadingCommunityProjects ? ' btn-loading' : '')
          "
          @click="getCommunityProjects()"
        >
          See more
        </button>
      </div>
    </div>
    <Footer />
    <div id="new-project-modal" class="cv-modal medium undismissable">
      <div>
        <div class="header">
          <h3>Create new project</h3>
        </div>
        <div class="body">
          <div class="cv-input-group">
            <label>Type</label>
            <select id="project-type" class="cv-input" v-model="projectType">
              <option value="none" selected disabled
                >Select Project Type</option
              >
              <option value="web">Web (HTML, CSS, JavaScript)</option>
              <option value="python">Python</option>
              <option value="scratch">Scratch</option>
            </select>
            <p
              v-if="createProjectClicked && projectType === 'none'"
              class="error"
            >
              <i class="fas fa-exclamation-circle"></i> Please select a project
              type
            </p>
          </div>

          <div class="cv-input-group">
            <label>Project name</label>
            <input
              id="project-name"
              class="cv-input"
              type="text"
              v-model="projectName"
              placeholder='Give your project a name such as "Image Gallery".'
            />
            <p v-if="projectName === ''" class="error">
              <i class="fas fa-exclamation-circle"></i> Project name is required
            </p>
          </div>

          <div class="cv-input-group">
            <label>Description</label>
            <textarea
              id="project-description"
              class="cv-input"
              rows="2"
              v-model="projectDesc"
              placeholder="Write a short description for your project."
            ></textarea>
            <p v-if="projectDesc === ''" class="error">
              <i class="fas fa-exclamation-circle"></i> Project description is
              required
            </p>
          </div>
        </div>
        <i class="flex-filler"></i>
        <div class="footer">
          <!--button class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i>
            Back
          </button>
          <i class="flex-filler"></i-->
          <button
            class="btn btn-neutral"
            onclick="(function() {hideModal('new-project-modal');})();"
          >
            Cancel
          </button>
          <button class="btn btn-primary" @click="createProject()">
            Create
          </button>
        </div>
      </div>
    </div>

    <div id="project-submission-modal" class="cv-modal medium undismissable">
      <div>
        <div class="header">
          <h3>Submit project to teacher</h3>
        </div>
        <div class="body">
          <template v-if="activeChallenges != null">
            <div class="cv-input-group">
              <label>Submit for</label>
              <select
                id="submission-purpose"
                class="cv-input"
                v-model="submissionPurpose"
              >
                <option value="" selected disabled>Select a purpose</option>
                <option
                  v-for="challenge in activeChallenges"
                  :value="challenge.event_id"
                  :key="challenge.event_id"
                  >{{ challenge.name }}</option
                >
              </select>
              <p
                v-if="submitProjectClicked && !submissionPurpose"
                class="error"
              >
                <i class="fas fa-exclamation-circle"></i> Choose a purpose for
                your submission
              </p>
            </div>

            <div class="cv-input-group">
              <label>Description</label>
              <textarea
                id="project-submission-description"
                class="cv-input"
                rows="2"
                v-model="submissionDescription"
                placeholder="Tell your teacher something about this project."
              ></textarea>
              <p
                v-if="submitProjectClicked && !submissionDescription"
                class="error"
              >
                <i class="fas fa-exclamation-circle"></i> Write something about
                your submission.
              </p>
            </div>
          </template>
          <ContentLoader v-else class="content-loader" />
        </div>
        <i class="flex-filler"></i>
        <div class="footer">
          <button
            class="btn btn-secondary"
            onclick="(function() {hideModal('project-submission-modal');})();"
          >
            Cancel
          </button>
          <button class="btn btn-primary" @click="handleSubmitProject()">
            Submit
          </button>
        </div>
      </div>
    </div>

    <div id="my-submissions-modal" class="cv-modal medium undismissable">
      <div>
        <div class="header">
          <h3>My Project Submissions</h3>
        </div>
        <div class="body">
          <template v-if="mySubmissions != null">
            <div
              v-for="submission in mySubmissions"
              :key="submission.submission_id"
              class="submission-item"
            >
              <div>
                <h4>{{ submission.event_name }}</h4>
                <p>{{ submission.project_name }}</p>
              </div>
              <button
                v-if="submission.submission_status == 'pending review'"
                type="button"
                class="btn btn-secondary btn-sm"
                :data-submission-id="submission.submission_id"
                :data-project-id="submission.project_id"
                @click="handleCancelSubmission($event)"
              >
                Cancel submission
              </button>
              <span class="status-tag ml-4">{{
                submission.submission_status
              }}</span>
            </div>
          </template>
          <p v-if="mySubmissions && !mySubmissions.length">
            You have no project submissions.
          </p>
          <ContentLoader v-if="mySubmissions == null" />
        </div>
        <i class="flex-filler"></i>
        <div class="footer">
          <button
            class="btn btn-secondary"
            onclick="(function() {hideModal('my-submissions-modal');})();"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="myCodeChallenge"
      id="code-challenge-modal"
      class="cv-modal medium"
    >
      <div>
        <div class="header">
          <h3>{{ myCodeChallenge.name }}</h3>
        </div>
        <div class="body">
          <p style="padding: 16px 24px; font-size: 1.2rem">
            Once you start the challenge, you will have 30 minutes to complete
            it. You will not be able to attempt the challenge more than once.
          </p>
          <div class="text-center my-4">
            <button
              class="btn btn-primary"
              :data-event-id="myCodeChallenge.event_id"
              @click="handleStartCodeChallengeClicked($event)"
            >
              START CHALLENGE
            </button>
          </div>
        </div>
        <i class="flex-filler"></i>
        <div class="footer">
          <button
            class="btn btn-secondary"
            onclick="(function() {hideModal('code-challenge-modal');})();"
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
import HeaderContent from "@/components/projects/HeaderContent.vue";
import Footer from "@/components/footer/Footer.vue";
import ContentLoader from "@/components/widgets/ContentLoader.vue";
import BlockingLoader from "@/components/widgets/BlockingLoader.vue";
export default {
  components: {
    Header,
    HeaderContent,
    Footer,
    ContentLoader,
    BlockingLoader
  },
  data() {
    return {
      userId: 0,
      recentProjects: [],
      projects: [],
      showAllProjects: false,
      communityProjects: [],
      communityProjectsOffset: "0",
      communityProjectsEndOfList: false,
      projectType: "none",
      projectName: undefined,
      projectDesc: undefined,
      createProjectClicked: false,
      loadingAllProjects: true,
      loadingCommunityProjects: false,
      allChallenges: null,
      activeChallenges: null,
      selectedProjectForSubmission: null,
      submissionPurpose: "",
      submissionDescription: null,
      submitProjectClicked: false,
      mySubmissions: null,
      processes: [],
      isSchoolStudent: false,
      isTeacher: false,
      myCodeChallenge: null
    };
  },
  mounted: function() {
    //initCvModals();
    cvAuth.getUserId(
      function(userId) {
       // console.log(userId);
        if (userId) {
          this.userId = userId;
          this.getRecentProjects();
          this.getAllProjects();
          var authData = this.$store.getters.getAuthData;
          this.isSchoolStudent =
            authData.auth_role_id == 3 && authData.auth_sch_id != 1;
          this.isTeacher = authData.auth_role_id == 2;
          if (this.isTeacher) {
            this.getAllChallenges();
          }
          if (this.isSchoolStudent) {
            this.getMyCodeChallenge();
          }
        }
      }.bind(this)
    );
    this.getCommunityProjects();
  },
  methods: {
    onCreateNewClick() {
      if (this.userId) {
        this.showNewProjectModal();
      } else {
        var params = encodeURIComponent("/projects");
        //this.$router.push("/login?redirect=" + params);
      }
    },
    showNewProjectModal: function() {
      showModal("new-project-modal");
    },
    showProjectItemContextMenu: function(e) {
      var vm = this;
      var projectId = e.currentTarget.dataset.projectId;
      var isCodeChallengeEntry = e.currentTarget.dataset.codeChallengeEntry;
      var isAnnualProjectEntry = e.currentTarget.dataset.annualProjectEntry;
      var menuItems = new Array();

      menuItems.push("Rename");
      if (!isCodeChallengeEntry && !isAnnualProjectEntry) {
        menuItems.push("Delete");
        if (this.isSchoolStudent) {
          menuItems.push("Submit project");
        }
      }

      showContextMenu(
        e.currentTarget,
        menuItems,
        function(option) {
          switch (option) {
            case "Rename": {
              this.renameProject(projectId);
              break;
            }
            case "Delete": {
              this.deleteProject(projectId);
              break;
            }
            case "Submit project": {
              this.selectedProjectForSubmission = projectId;
              if (this.activeChallenges == null) this.getMyChallenges();
              showModal("project-submission-modal");
            }
          }
        }.bind(this)
      );
    },
    createProject: function() {
      // if(!this.auth_getToken()) return;
      //var projectType = $("#project-type").val();
      var canProceed = true;
      this.createProjectClicked = true;
      if (!this.projectType == "none") {
        canProceed = false;
      }

      if (!this.projectName) {
        canProceed = false;
        this.projectName = "";
      }
      if (!this.projectDesc) {
        canProceed = false;
        this.projectDesc = "";
      }

      if (!canProceed) return;

      showProgressOverlay("project-creation");
      this.$http
        .post("/api/projects/createProject", {
          type: this.projectType,
          name: this.projectName,
          desc: this.projectDesc
        })
        .then(function(res) {
          hideProgressOverlay("project-creation");
          if (res.status != 200) {
          } else {
            this.getRecentProjects();
            this.getAllProjects();
            hideModal("new-project-modal");
            cvNotify('Project "' + this.projectName + '" created.');
            this.projectName = undefined;
            this.projectDesc = undefined;
            $("#project-name").val("");
            $("#project-description").val("");
          }
        })
        .catch(err => {
          hideProgressOverlay("project-creation");
          if (err.body == "duplicate_entry") {
            cvNotify("Project with this name already exists.", "error");
          }
        });
    },
    getRecentProjects: function() {
      this.$http
        .post("/api/projects/getRecentProjects")
        .then(function(res) {
          if (res.body.length) {
            var recentProjects = res.body;
            var placeholdersCount = 4 - recentProjects.length;
            for (var i = 0; i < placeholdersCount; i++) {
              // Add these placeholder items to help with flex space-between
              recentProjects.push({
                project_id: "hidden-" + i,
                hidden: "hidden"
              });
            }
            this.recentProjects = recentProjects;
          } else {
            this.recentProjects = [];
          }
        })
        .catch(function() {});
    },
    getAllProjects: function() {
      this.loadingAllProjects = true;
      this.$http
        .post("/api/projects/getAllProjects")
        .then(function(res) {
          if (res.body.length) {
            var projects = res.body;
            var placeholdersCount =
              projects.length % 4 == 0 ? 0 : 4 - (projects.length % 4);
            for (var i = 0; i < placeholdersCount; i++) {
              // Add these placeholder items to help with flex space-between
              projects.push({ project_id: "hidden-" + i, hidden: "hidden" });
            }
            this.projects = projects;
          } else {
            this.projects = [];
          }
          this.loadingAllProjects = false;
        })
        .catch(function() {
          this.loadingAllProjects = false;
        });
    },
    getCommunityProjects: function() {
      this.loadingCommunityProjects = true;
      this.$http
        .post("/api/projects/getCommunityProjects", {
          query_offset: this.communityProjectsOffset
        })
        .then(function(res) {
          var projects = res.body;
          this.communityProjectsOffset = (
            parseInt(this.communityProjectsOffset) + projects.length
          ).toString();
          if (projects.length < 8) {
            // This case happens when we're at the end of the list.
            // Otherwise, there would be 8 items as we have a "limit" of 8.
            // We are adding placeholder elements only at the very end of the list.
            // These placeholder elements help with maintaining the 4-column grid in the flex layout
            var placeholdersCount =
              projects.length % 4 == 0 ? 0 : 4 - (projects.length % 4);
            for (var i = 0; i < placeholdersCount; i++) {
              // Add these placeholder items to help with flex space-between.
              projects.push({ project_id: "hidden-" + i, hidden: "hidden" });
            }
            this.communityProjectsEndOfList = true;
          }
          this.communityProjects = this.communityProjects.concat(projects);
          this.loadingCommunityProjects = false;
        })
        .catch(function() {
          this.loadingCommunityProjects = false;
        });
    },
    renameProject: function(id) {
      var vm = this;
      var existingName = "";
      for (var i = 0; i < this.projects.length; i++) {
        if (id == this.projects[i].project_id) {
          existingName = this.projects[i].name;
          break;
        }
      }
      showPromptDialog({
        title: "Rename project?",
        prefill: existingName,
        callback: function(options) {
          showProgressOverlay("project-rename");
          vm.$http
            .post("/api/projects/renameProject", {
              projectId: id,
              newName: options.value
            })
            .then(function(res) {
              cvNotify("Project renamed.");
              vm.getRecentProjects();
              vm.getAllProjects();
              hideProgressOverlay("project-rename");
            })
            .catch(function(err) {
              hideProgressOverlay("project-rename");
              if (err.body == "duplicate_entry") {
                cvNotify("Project with this name already exists.", "error");
              } else {
                cvNotify("Failed to rename project.", "error");
              }
            });
          return true;
        },
        positiveButton: "Rename"
      });
    },
    deleteProject: function(id) {
      var vm = this;
      // if(!this.auth_getToken()) return;
      showConfirmationDialog({
        title: "Delete project?",
        callback: function(type) {
          if (type == "positive") {
            showProgressOverlay("project-deletion");
            vm.$http
              .post("/api/projects/deleteProject", { projectId: id })
              .then(function(res) {
                hideProgressOverlay("project-deletion");
                cvNotify("Project successfully deleted.");
                vm.getRecentProjects();
                vm.getAllProjects();
              })
              .catch(function(err) {
                hideProgressOverlay("project-deletion");
                if (err.body === "annual_project_entry") {
                  cvNotify("Cannot delete Annual Project entry.", "error");
                } else if (err.body === "code_challenge_entry") {
                  cvNotify("Cannot delete Code Challenge entry.", "error");
                } else cvNotify("Failed to delete project.", "error");
              });
          }
        },
        positiveButton: "Delete",
        positiveButtonClass: "negative"
      });
    },
    // START Projects submission
    getAllChallenges() {
      this.$http
        .post("/api/projects/getAllChallenges")
        .then(function(res) {
          this.allChallenges = res.body;
        })
        .catch(function(err) {});
    },
    getMyChallenges() {
      this.$http
        .post("/api/projects/getMyChallenges")
        .then(function(res) {
          this.activeChallenges = res.body;
        })
        .catch(function(err) {});
    },
    handleSubmitProject() {
      // var submissionPurpose =
      this.submitProjectClicked = true;
      if (!this.submissionPurpose || !this.submissionDescription) {
        return;
      }
      this.processes.push("a");
      var projectId = this.selectedProjectForSubmission;
      var vm = this;
      this.$http
        .post("/api/projects/submitChallenge", {
          eventId: this.submissionPurpose,
          projectId: projectId,
          description: this.submissionDescription
        })
        .then(function(res) {
          vm.mySubmissions = null;
          vm.processes.pop();
          // Update item in recent projects list so that correct menu items are shown
          var updatedRecentProjectItem = this.getProjectFromArray(
            this.recentProjects,
            projectId
          );
          if (updatedRecentProjectItem) {
            updatedRecentProjectItem.annual_project_entry = "something";
            this.recentProjects = recreateObject(this.recentProjects);
          }
          // Update item in all projects list so that correct menu items are shown
          var updatedAllProjectsItem = this.getProjectFromArray(
            this.projects,
            projectId
          );
          if (updatedAllProjectsItem) {
            updatedAllProjectsItem.annual_project_entry = "something";
            this.projects = recreateObject(this.projects);
          }
          hideModal("project-submission-modal");
          cvNotify("Project successfully submitted.");
        })
        .catch(function(err) {
          vm.processes.pop();
          if (err.body === "already_submitted")
            cvNotify("Already submitted.", "error");
          else cvNotify("Failed to submit project.", "error");
        });
    },
    handleShowSubmissions() {
      if (this.mySubmissions == null) {
        this.getMySubmissions();
      }
      showModal("my-submissions-modal");
    },
    getMySubmissions() {
      this.$http
        .post("/api/projects/getMyAnnualProjectSubmissions")
        .then(function(res) {
          this.mySubmissions = res.body;
        })
        .catch(function(err) {});
    },
    handleCancelSubmission(e) {
      var submissionId = e.currentTarget.dataset.submissionId;
      var projectId = e.currentTarget.dataset.projectId;
      showConfirmationDialog({
        title: "Cancel project submission?",
        callback: function(type) {
          if (type == "positive") {
            this.processes.push("a");
            this.cancelSubmission(submissionId, projectId);
            return;
          }
        }.bind(this),
        positiveButton: "Cancel submission",
        positiveButtonClass: "negative",
        negativeButton: "Don't cancel"
      });
    },
    cancelSubmission(submissionId, projectId) {
      this.$http
        .post("/api/projects/cancelChallengeSubmission", {
          submissionId: submissionId
        })
        .then(function(res) {
          this.processes.pop();
          this.getMySubmissions();

          // Update item in recent projects list so that correct menu items are shown
          var updatedRecentProjectItem = this.getProjectFromArray(
            this.recentProjects,
            projectId
          );
          if (updatedRecentProjectItem) {
            delete updatedRecentProjectItem.annual_project_entry;
            this.recentProjects = recreateObject(this.recentProjects);
          }
          // Update item in all projects list so that correct menu items are shown
          var updatedAllProjectsItem = this.getProjectFromArray(
            this.projects,
            projectId
          );
          if (updatedAllProjectsItem) {
            delete updatedAllProjectsItem.annual_project_entry;
            this.projects = recreateObject(this.projects);
          }
        })
        .catch(function(err) {
          this.processes.pop();
        });
    },
    // Code challenge
    getMyCodeChallenge() {
      this.$http
        .post("/api/projects/getMyCodeChallenge")
        .then(function(res) {
          this.myCodeChallenge = res.body;
        })
        .catch(function(err) {});
    },
    handleCodeChallengeAttemptClicked() {
      showModal("code-challenge-modal");
    },
    handleCodeChallengeResumeClicked(e) {
      this.$router.push("/projects/" + e.currentTarget.dataset.projectId);
    },
    handleStartCodeChallengeClicked(e) {
      this.processes.push("a");
      this.$http
        .post("/api/projects/startCodeChallenge", {
          event_id: e.currentTarget.dataset.eventId
        })
        .then(function(res) {
          hideModal("code-challenge-modal");
          this.$router.push("/projects/" + res.body);
          this.processes.pop();
        })
        .catch(function(err) {
          this.processes.pop();
        });
    },
    getProjectFromArray(projects, projectId) {
      for (var i = 0; i < projects.length; i++) {
        if (projects[i].project_id == projectId) {
          return projects[i];
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
  .nav {
    a {
      color: #fff;
      &:hover {
        color: #ec296b;
      }
    }
    .dropdown-menu a {
      color: #444;
    }
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
    font-family: "Poppins", sans-serif !important;
    font-weight: 600;
    line-height: 1;
  }
  p {
    margin: 8px 0 0;
    font-size: 0.9rem;
    color: #444;
    font-family: "Poppins", sans-serif !important;
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
    font-family: "Poppins";
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

.project-name-school-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  small {
    font-size: 0.7rem;
  }
}

#new-project-modal,
#project-submission-modal,
#my-submissions-modal {
  .body {
    display: flex;
    flex-direction: column;
    padding: 16px 24px;
  }
  label {
    margin-bottom: 4px;
  }
  select {
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

.submission-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 0;
  div {
    flex-grow: 1;
  }
  .status-tag {
    height: 28px;
    padding: 0 8px;
    background: rgba(0, 0, 0, 0.1);
    color: #444;
    border-radius: 4px;
    line-height: 28px;
    &.approved {
      background: rgb(42, 207, 20);
      color: #fff;
    }
  }
  button {
    padding-top: 0;
    padding-bottom: 0;
    height: 28px;
    line-height: 28px;
  }
}
#code-challenge-banner {
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 0;
  border-radius: 8px;
  color: #fff;
  background-image: linear-gradient(
    to right bottom,
    #3f32cd,
    #e2009d,
    #ff3057,
    #ff9b00,
    #e2eb12
  );
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  button.normal {
    background: #fff;
    color: #444;
  }
  button {
    border-radius: 48px;
  }
}
</style>
