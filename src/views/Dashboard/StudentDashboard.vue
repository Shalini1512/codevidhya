<template>
  <div id="student-dashboard-root">
    <Header
      ref="header"
      @OpenProfileCurrent="myCurrentProfile"
      @openMyUnnreadNotification="myNotification"
    />

    <!--end profile pic-->
    <!--User Dashboard-->
    <section class="sptb h-100 w-100 p-0" style>
      <div class="container-fluid h-100 w-100" style>
        <div class="row" style>
          <!--side nav bar-->
          <sideNav
            ref="sidnav"
            @removeUserProfile="removeProfilePic()"
            @updateAgainEdit="updateEditAgaingFunction"
            @updateAgainNoti="OpenNoti"
            @updatedDashboard="(...args) => updateDashboard(...args)"
          ></sideNav>
          <!-- end side nav-->
          <!--simple dashboard-->
          <div
            class="col-xl-9 col-lg-12 col-md-12 pl-0 student-view-dashboard-content"
          >
            <div
              class="sb-container"
              style="position:relative;height:92%;overflow:auto;margin-top:59px;"
            >
              <div class="card-header">
                <h3 class="card-title">Enrolled Courses</h3>
              </div>
              <div class="card-body" v-if="live_courses.length">
                <template v-for="(live_course, index) in live_courses">
                  <div v-bind:key="index" class="card mt-4">
                    <!--<div class="card-header">
                      <h3>{{ live_course.live_course_name }}</h3>
                    </div>-->
                    <div class="d-md-flex">
                      <div class="item-card9-img">
                        <div class="item-card9-imgs">
                          <a href="#"></a>
                          <img
                            :src="
                              live_course.img
                                ? '/assets/images/png/courses/' +
                                  live_course.img
                                : '/assets/images/png/courses/web.svg'
                            "
                            alt="img"
                            class="cover-image"
                          />
                        </div>
                      </div>
                      <div class="card border-0 mb-0">
                        <div class="card-body ">
                          <div class="item-card9">
                            <!--<a href="business.html">Online</a>-->
                            <a href="#" class="text-dark"
                              ><h3 class="font-weight-semibold mt-1">
                                {{ live_course.live_course_name }}
                              </h3></a
                            >
                            <p class="mb-0 leading-tight mt-2">
                              {{ live_course.description }}
                            </p>
                          </div>
                        </div>
                        <div class="card-footer pt-4 pb-4">
                          <div class="item-card9-footer d-flex">
                            <div class="item-card9-cost">
                              <!--<h4
                                class="text-dark font-weight-semibold mb-0 mt-0"
                              >
                                $263.99
                              </h4>-->
                            </div>
                            <div class="ml-auto">
                              <router-link
                                :to="{
                                  name: 'livecoursecontent',
                                  params: {
                                    liveCourseName:
                                      live_course.live_course_slug,
                                    courseId: live_course.live_course_id
                                  }
                                }"
                              >
                                <button class="btn btn-info">
                                  Learn More
                                </button>
                              </router-link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <!--<div
                  class="col-lg-6 col-md-12 col-xl-4 mt-5"
                  v-for="(live_course, index) in live_courses"
                  v-bind:key="index"
                >
                  <div class="card mb-0">
                    <div class="item-card2-img">
                      <a
                        @click="
                          $router.push({
                            name: 'LiveCourseDetail',
                            params: {
                              liveCourseName: live_course.live_course_slug,
                              bookId: live_course.live_course_id
                            }
                          })
                        "
                      ></a>

                      <img
                        :src="
                          live_course.img
                            ? '/assets/images/png/courses/' + live_course.img
                            : '/assets/images/png/courses/web.svg'
                        "
                        alt="img"
                        class="cover-image"
                      />
                      <div class="item-tag"></div>
                      <div class="rating-stars">
                        <div>
                          <span class="empty-stars">
                            <span class="star">
                              <i class="fas fa-star"></i>
                            </span>
                            <span class="star">
                              <i class="fas fa-star"></i>
                            </span>
                            <span class="star">
                              <i class="fas fa-star"></i>
                            </span>
                            <span class="star">
                              <i class="fas fa-star"></i>
                            </span>
                            <span class="star">
                              <i class="fas fa-star"></i>
                            </span>
                          </span>
                          <span
                            class="filled-stars"
                            :style="
                              'width:' +
                                (live_course.avg_rating
                                  ? live_course.avg_rating * 20
                                  : 90) +
                                '%'
                            "
                          >
                            <span class="star">
                              <i class="fas fa-star"></i>
                            </span>
                            <span class="star">
                              <i class="fas fa-star"></i>
                            </span>
                            <span class="star">
                              <i class="fas fa-star"></i>
                            </span>
                            <span class="star">
                              <i class="fas fa-star"></i>
                            </span>
                            <span class="star">
                              <i class="fas fa-star"></i>
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="card-body">
                      <div class="item-card2">
                        <div item-card2-desc>
                          <a
                            @click="
                              $router.push({
                                name: 'LiveCourseDetail',
                                params: {
                                  liveCourseName: live_course.live_course_slug,
                                  bookId: live_course.live_course_id
                                }
                              })
                            "
                            class="text-dark"
                          >
                            <h4
                              class="mb-2"
                              v-html="live_course.live_course_name"
                            ></h4>
                          </a>
                        </div>
                        <p>
                          {{ live_course.live_course_outcomes }}
                        </p>
                        <ul class="mt-3 row">
                          <li class="col-sm-6">
                            <a
                              href="#"
                              class="icons"
                              style="background:#ec296b;padding: 4px 8px;color: #fff;border-radius: 2px;font-size:10px;"
                            >
                              <b> Grade:</b>
                              {{ live_course.grade.split(",")[0] }}-{{
                                live_course.grade.split(/[, ]+/).pop()
                              }}
                            </a>
                          </li>
                          <li class="col-sm-6 text-right">
                            <a
                              href="#"
                              class="icons"
                              style="background:#48c9b0;padding: 4px 8px;color: #fff;border-radius: 2px;font-size:10px;"
                            >
                              <b> Age Group:</b>
                              {{ live_course.age_group }}
                            </a>
                          </li>
                          <li class="col-sm-6 mt-4">
                            <a
                              href="#"
                              class="icons"
                              style="color:#000;border-radius: 2px;font-size:10px;"
                            >
                              <i class="fas fa-clock"></i>
                              <span
                                class="newprice text-dark ml-1"
                                style="font-size:10px;"
                                >{{ live_course.duration }} Hours</span
                              >
                            </a>
                          </li>
                          <li class="col-sm-6 text-right mt-4">
                            <a
                              href="#"
                              @click.prevent="
                                $router.push({
                                  name: 'LiveCourseDetail',
                                  params: {
                                    liveCourseName:
                                      live_course.live_course_slug,
                                    bookId: live_course.live_course_id
                                  }
                                })
                              "
                              class="icons text-center"
                              style="background:#007CFF;padding: 4px 20px 4px 20px;color: #fff;border-radius: 2px;font-size:10px;"
                            >
                              <b> Learn More</b>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="card-footer">
                      <div class="item-card2-footer">
                        <div class="item-card2-footer-u">
                          <div class="product-item-wrap d-flex">
                            <div class="product-item-price">
                              Rs.
                              <span
                                class="newprice text-dark ml-1"
                                style="font-size:14px;"
                              >
                                {{ live_course.course_price }}
                              </span>
                            </div>

                            <a
                              @click="
                                $router.push({
                                  name: 'LiveCourseDetail',
                                  params: {
                                    liveCourseName:
                                      live_course.live_course_slug,
                                    bookId: live_course.live_course_id
                                  }
                                })
                              "
                              :class="
                                'btn btn-info btn-sm ml-auto ' +
                                  [
                                    live_course.purchases_status == 1
                                      ? 'btn-primary text-white'
                                      : 'btn-outline-primary'
                                  ]
                              "
                            >
                              {{
                                live_course.purchases_status == 1
                                  ? "Purchased"
                                  : "Enroll Now"
                              }}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>-->
              </div>
              <div class="p-4" v-else>
                <h3>No Record.</h3>
              </div>
            </div>

            <!--end simple dashboard-->
          </div>
        </div>
      </div>
    </section>
    <!--/User Dashboard-->
  </div>
</template>
<script>
import axios from "axios";
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/dashboard/HeaderContent.vue";
import SideNav from "@/components/dashboard/SideNavProfile.vue";
import Footer from "@/components/footer/Footer.vue";
import showStudentProfile from "@/views/Profile/ShowStudentProfile.vue";
import Notification from "@/views/Profile/Notifications.vue";
import CourseAchievement from "@/views/Dashboard/CourseAchievement.vue";
import NewCourse from "@/views/Dashboard/NewCourse.vue";

export default {
  name: "studentdashboard",
  props: ["openProfile", "OpenNotif", "openOtherCourse"],
  components: {
    Header,
    HeaderContent,
    showStudentProfile,
    SideNav,
    Notification,
    CourseAchievement,
    NewCourse
  },
  data() {
    return {
      userId: 0,
      userProfile: [],
      isSignedIn: "",
      cls_id: this.$store.getters.getAuthData.auth_cls_id,
      user_id: this.$store.getters.getAuthData.auth_user_id,
      sec_id: this.$store.getters.getAuthData.auth_sec_id,
      role_id: this.$store.getters.getAuthData.auth_role_id,
      sch_id: this.$store.getters.getAuthData.auth_sch_id,
      assessments: [],
      serverTime: "",
      unlockedCourses: {},
      lms_books: [],
      lms_user_books: [],
      allQuizzes: [],
      quizzes: [],
      sch_quizzes: [],
      recentProjects: [],
      sch_curriculm: "",
      other_course_curriculam: "",
      p_curriculum: "",
      profile: 0,
      quote: "",
      notif: 0,
      profilePic: "",
      profilePicData: new FormData(),
      selectedLessonPlanGrade: 0,
      lessonplans: 0,
      cls_grp: [],
      curriculum: [],
      programId: 1,
      url: null,
      ass_count: 0,
      book_group: [],
      books_group: [],
      next_lms_books: new Array(),
      programs: new Array(),
      userFullName: "",
      notificationvideo: [],
      liveCourse: [],
      live_courses: [],
      jitsiApi: ""
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted: function() {
    //initCvModals();
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.cls_id = this.$store.getters.getAuthData.auth_cls_id;
          this.user_id = this.$store.getters.getAuthData.auth_user_id;
          this.sec_id = this.$store.getters.getAuthData.auth_sec_id;
          this.role_id = this.$store.getters.getAuthData.auth_role_id;
          this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
          this.programs = this.$store.getters.getAuthData.programs;
          this.userFullName = this.$store.getters.getAuthData.name;
          this.getServerTime();
          this.nextlmscont(this.userId);

          if (this.openProfile) {
            this.myCurrentProfile();
          }
          if (this.OpenNotif) {
            this.myNotification();
          }
          if (this.openOtherCourse) {
            $("#other_subject").click();
          }
        }
      }.bind(this)
    );
    //$(".sb-container").scrollBox();
  },
  updated() {
    //$(".sb-container").scrollBox();
  },
  methods: {
    nextlmscont(userId) {
      axios
        .post("/api/user/DisplayLmsActivityForNextCourses", { user_id: userId })
        .then((res) => {
          if (res.data.status == 200) {
            this.next_lms_books = res.data.data;
          }
        });
    },
    callCvAchievement(tabName) {
      if (tabName == "tab5") {
        this.$refs.InstituteAchievment.achievementCalling(
          "institute",
          this.lms_user_books,
          this.books_group
        );
      } else if (tabName == "tab6") {
        this.$refs.SelfAchievement.achievementCalling(
          "self",
          this.lms_user_books,
          this.books_group
        );
      } else if (tabName == "tab71") {
      }
    },
    callNoti() {
      this.$refs.header.totalUnreadNoti(this.userId);
    },
    quiz_action(quiz) {
      this.$router.push("/quiz-instruction?id=" + quiz.quiz_id);
    },
    changeSidNavData() {
      if (this.$refs.sidnav) this.$refs.sidnav.getProfileInformation();
    },
    preview_img(event) {
      const file11 = event.target.files[0];
      let urlp = URL.createObjectURL(file11);
      $("#preview_image").attr("src", urlp);
      var fileInput = document.getElementById("file-input");
      var file = fileInput.files[0];
      var url = URL.createObjectURL(file);
      if (file) {
        if (fileInput.files[0].size > 102400) {
          window.cvNotify("Image should be less than 100kb.", "warning");
        } else {
          this.profilePicData.append("profilePic", file);
          this.profilePicData.append("sch_id", this.sch_id);
          this.profilePicData.append("user_id", this.user_id);
          this.profilePicData.append("profleType", "update");
          this.profilePicData.append(
            "oldFileName",
            this.userProfile[0].profile_pic
          );
          $("#file-input").text("");
        }
      }
    },
    myCurrentProfile() {
      this.$refs.sidnav.moveprofile("profile");
    },
    myNotification() {
      this.$refs.sidnav.moveNoti("notification");
    },
    updateProfileInfo: function() {
      this.$http
        .post("/api/profile/updateUserProfileInfo", {
          editProfile: this.editProfile
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            if (res.body.data == "done") {
              window.cvNotify(
                "You have successfully updated your profile details.",
                "success"
              );
              this.getProfileInformation();
            }
          }
        });
    },
    updateProfilePic: function() {
      let vm = this;
      this.$http
        .post("/api/profile/updateUserProfilePic", this.profilePicData)
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            if (res.body.data == "done") {
              window.cvNotify(
                "You have successfully updated your profile picture.",
                "success"
              );
              //console.log(this.$refs.sidenav.getProfileInformation());
              //console.log(this.$refs.TeacherProfile.getServerTime());
              if (this.$refs.sidnav) this.$refs.sidnav.getProfileInformation();
              if (this.$refs.userProfile)
                this.$refs.userProfile.getServerTime();
              vm.profilePicData = new FormData();
              $("#updateProfilePicModal").modal("hide");
            }
          }
        });
    },
    removeProfilePic() {
      if (this.userProfile[0].profile_pic) {
        this.profilePicData.append("sch_id", this.sch_id);
        this.profilePicData.append("user_id", this.user_id);
        this.profilePicData.append(
          "oldFileName",
          this.userProfile[0].profile_pic
        );
        var vm = this;
        showConfirmationDialog({
          title: "Remove Profile Picture",
          message: "Do you really want to remove your profile picture?",
          callback: function(type) {
            if (type == "positive") {
              vm.updateProfilePic();
            }
          },
          positiveButton: "Delete",
          positiveButtonClass: "negative"
        });
      } else {
        window.cvNotify("There is no profile Picture.", "warning");
      }
    },
    uploadFile: function() {
      var fileInput = document.getElementById("profile-file-input");
      var file = fileInput.files[0];
      var url = URL.createObjectURL(file);
      if (file) {
        if (fileInput.files[0].size > 102400) {
          window.cvNotify("Image should be less than 100kb.", "warning");
        } else {
          this.profilePicData.append("profilePic", file);
          this.profilePicData.append("sch_id", this.sch_id);
          this.profilePicData.append("user_id", this.user_id);
          this.profilePicData.append("profleType", "update");
          this.profilePicData.append(
            "oldFileName",
            this.userProfile[0].profile_pic
          );
          $("#file-input-file-name").text("");
        }
      }
    },
    updateDashboard(args, event) {
      this.profile = 0;
      this.notif = 0;
      $(".item1-links > a").removeClass("active");
      $(event.toElement).addClass("active");
      let container = this.$el.querySelector("#" + args);
      if (container) container.scrollIntoView(true);
    },
    OpenNoti(openEdit) {
      this.notif = 1;
      this.profile = 0;
      // this.$refs.notific.noti = 1;
    },
    updateEditAgaingFunction(updateProfile) {
      this.profile = 1;
      this.notif = 0;
      // this.$refs.userProfile.edit =0;
    },
    openModal: function(modalId) {
      $("#" + modalId + " > div").removeClass("visible");
      showModal($("#" + modalId));
    },

    getServerTime: function() {
      this.$http.post("/api/user/getServerTime").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.serverTime = res.body.serverTime;
          this.getLiveCourses(this.userId);
          this.getProfileInformation();
          this.lmscont(this.userId);

          this.getRandomImgForQuote();
          this.load_assessments();
          this.getAllQuizzess(this.userId);
          this.getVideoNotification(this.userId);
          this.getRecentProjects();
        }
      });
    },
    hidevideNot() {
      var video = document.getElementById("video-noti");
      video.pause();
      hideModal("learn-at-home-modal");
    },
    getVideoNotification: function(user_id) {
      let vm = this;
      axios
        .post("/api/notifications/getStudentVideoNotification", {
          user_id: user_id
        })
        .then((res) => {
          vm.notificationvideo = res.data;
          if (vm.notificationvideo && vm.notificationvideo.length) {
            showModal("learn-at-home-modal");
          }
        });
    },
    readNoti(notiid) {
      var video = document.getElementById("video-noti");
      video.pause();
      axios
        .post("/api/notifications/readNotification", {
          noti_id: notiid,
          user_id: this.userId
        })
        .then((res) => {
          hideModal("learn-at-home-modal");
        });
    },
    getProfileInformation: function() {
      let vm = this;

      axios
        .post("/api/profile/getUserInformation", {
          user_id: vm.userId,
          role_id: vm.role_id
        })
        .then((res) => {
          if (!res.data.length) {
            // vm.$router.push("/login");
          } else {
            vm.userProfile = res.data;
          }
        });
    },
    getRandomImgForQuote: function() {
      /* axios.post("/api/user/getrandomfile").then(res => {
        this.quote = res.data;
      });*/
    },
    async callingCourseOtherData(userId, lms_user_books) {
      let vm = this;
      await lms_user_books.forEach(async (item, index) => {
        vm.book_group.push(item.book_id);
        let books = this.book_group.join();
      });
      await axios
        .post("/api/user/getLMSUserActivity", {
          userId: userId,
          books: vm.book_group
        })
        .then(async (res) => {
          vm.books_group = res.data;
          await vm.$refs.InstituteAchievment.achievementCalling(
            "institute",
            vm.lms_user_books,
            vm.books_group
          );
        });

      return vm.book_group;
    },

    getLiveCourses(userId) {
      let vm = this;
      axios
        .post("api/liveCourse/getUserLiveCourse", { user_id: userId })
        .then((data) => {
          vm.live_courses = data.data;
          console.log(data.data);
        });
    },
    lmscont(userId) {
      this.$http
        .post("/api/user/DisplayDashboardLmsActivity", {
          user_id: userId
        })
        .then(function(res) {
          /*if (res.body.status == "403") {
          } else {*/
          this.lms_user_books = res.data;

          this.callingCourseOtherData(userId, this.lms_user_books);

          this.sch_curriculm = this.lms_user_books.findIndex(
            (x) => x.sch_course === 1 && x.other_courses === 0
          );
          this.other_course_curriculam = this.lms_user_books.findIndex(
            (x) => x.sch_course === 1 && x.other_courses === 1
          );
          this.p_curriculum = this.lms_user_books.findIndex(
            (x) => x.purchases_status === 1
          );

          for (var i = 0; i < this.lms_user_books.length; i++) {
            this.unlockedCourses[this.lms_user_books[i].book_id] = false;
            if (this.userId == 0) {
              this.unlockedCourses[this.lms_books[i].book_id] = false;
            } else {
              //if(this.sch_id == 1) {
              // Independent user
              if (
                this.lms_user_books[i].purchases_status ||
                this.lms_user_books[i].for_grade != 0
              ) {
                this.unlockedCourses[this.lms_user_books[i].book_id] = true;
              }
              /* } else if(this.sch_id != 1) {
                  // School student
                  if(this.isCourseForMyGrade(this.lms_user_books[i].slug)) {
                    this.unlockedCourses[this.lms_user_books[i].book_id] = true;
                  } else {
                    if(this.lms_user_books[i].purchases_status) {
                      this.unlockedCourses[this.lms_user_books[i].book_id] = true;
                    }
                  }
                }*/
            }
          }
          //  }
        });

      /*end dashboard user cart*/
    },
    isCourseForMyGrade(slug) {
      switch (this.cls_id ? this.cls_id : 0) {
        case 10:
        case 9:
        case 8: {
          if (~["python", "database"].indexOf(slug)) return true;
          return false;
        }
        case 7: {
          if (~["javascript", "database"].indexOf(slug)) return true;
          return false;
        }
        case 6: {
          if (~["javascript"].indexOf(slug)) return true;
          return false;
        }
        case 5:
        case 4: {
          if (~["html&css"].indexOf(slug)) return true;
          return false;
        }
      }
    },
    call_url: function(bookName, bookId, book_per) {
      let ec = btoa(bookId);
      let bookSlug = bookName;

      this.$router.push({
        name: "course-details",
        params: { curName: bookSlug, bookId: ec, book_per: book_per }
      });
      //this.$router.push({name:'BooksTopics', params:{curName:bookName}});
    },
    notify_for_future1: function(e) {
      notify("Will be available soon!", "warning");
      return false;
    },
    load_assessments: function() {
      this.assessments = [];
      this.$http
        .post("/api/user/DisplayAssessment", {
          cls_id: this.cls_id,
          sch_id: this.sch_id,
          user_id: this.user_id,
          role_id: this.role_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            if (this.role_id == 3) {
              var ass = new Object();
              var assessments = res.body.data;
              for (var i = 0; i < assessments.length; i++) {
                if (
                  this.$moment(assessments[i].date).format("YYYY-MM-DD") ==
                  this.$moment(this.serverTime).format("YYYY-MM-DD")
                ) {
                  if (!ass.hasOwnProperty(assessments[i].assessment_id)) {
                    ass[assessments[i].assessment_id] = assessments[i];
                    this.assessments.push(assessments[i]);
                  }
                }
              }
            }
          }
        });
    },
    start_exam: function(asmnt_id, asmnt_name, duration) {
      this.$http
        .post("/api/user/Insert_assessment_time", {
          user_id: this.user_id,
          duration: duration,
          assessment_id: asmnt_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            var det = btoa(asmnt_id + "," + asmnt_name);
            this.$router.push({
              path: "/assessments/assessment-exam",
              query: { assessment: det }
            });
          }
        });

      var i;
      var j;
    },
    getAllQuizzess: function(userId) {
      this.$http
        .post("/api/user/display_dashboard_sub_quizzes", { user_id: userId })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            this.quizzes = res.body.data;
          }
        });
      this.$http
        .post("/api/user/display_dashboard_school_sub_quizzess", {
          user_id: userId
        })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            this.sch_quizzes = res.body.data;
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
    timeDifference: function(date1) {
      var dateA = new Date(date1).getTime();
      var dateB = new Date(this.serverTime).getTime();
      var timeDiff = Math.floor((dateA - dateB) / 1000);
      return timeDiff;
    },
    countdown: function(seconds, node) {
      var endTime, hours, minutes, msLeft, time, seconds, days;
      var vm = this;
      function twoDigits(n) {
        return n <= 9 ? "0" + n : n;
      }

      function updateTimer(prevtime, node) {
        var msLeft = prevtime - 1;
        if (msLeft < 1) {
          node.textContent = "This assessment is live.";
        } else {
          seconds = msLeft;
          minutes = Math.floor(seconds / 60);
          hours = Math.floor(minutes / 60);

          days = Math.floor(hours / 24);
          hours = hours - days * 24;
          minutes = minutes - days * 24 * 60 - hours * 60;
          seconds =
            seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

          node.textContent =
            (days > 0 ? days + " Days " : "") +
            (hours ? hours + " Hours " : "") +
            (minutes ? minutes + " Minutes " : "") +
            seconds +
            " Seconds";
        }
        setTimeout(updateTimer, 1000, msLeft, node);
      }
      updateTimer(seconds, node);
    },
    cls_loop: function() {
      this.$http
        .post("/api/user/download_cls_file", { sch_id: this.sch_id })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            this.cls_grp = res.body.data;
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.card {
  margin-bottom: 0px;
}
.profile-image-container {
  position: relative;
  padding: 24px;
  width: 128px;
  margin: 0 auto;
  padding: 0;
  text-align: center;
  img {
    width: 128px;
    height: 128px;
    border-radius: 50%;
    border: 4px solid rgb(0, 141, 210);
  }
  .image-upload {
    position: absolute;
    right: 0;
    bottom: 0;
    label {
      cursor: pointer;
    }
    i {
      width: 28px;
      height: 28px;
      padding-left: 2px;
      border-radius: 50%;
      background: rgb(0, 141, 210);
      color: #fff;
      text-align: center;
      line-height: 28px;
    }
  }
}
</style>
<style lang="scss" scoped>
#student-dashboard-root {
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
.student-view-dashboard-content {
  position: fixed;
  margin-left: 25%;
  height: 88%;
  width: 100%;
  margin-top: 0px;
}
@media only screen and (max-width: 992px) {
  .student-view-dashboard-content {
    position: relative;
    margin-left: 0px;
    height: auto;
    width: auto;
    margin-top: 0px;
  }
}
#live-icon:after {
  content: " \25CF";
}
</style>
