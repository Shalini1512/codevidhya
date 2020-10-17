import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
Vue.use(VueRouter);
const routes = [
  {
    path: "/newLiveCourse",
    name: "newLiveCourse",
    component: () => import("../views/newLiveCourse.vue")
  },
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue")
  },
  {
    path: "/dashboard",
    name: "studentdashboard",
    props: true,
    component: () => import("../views/Dashboard/StudentDashboard.vue")
  },
  {
    path: "/teacher-dashboard",
    name: "teacherdashboard",
    props: true,
    component: () => import("../views/Dashboard/TeacherDashboard.vue")
  },
  {
    path: "/parent-dashboard",
    name: "parentdashboard",
    props: true,
    component: () => import("../views/Dashboard/ParentDashboard.vue")
  },
  {
    path: "/schooladmin-dashboard",
    name: "schooladmindashboard",
    props: true,
    component: () => import("../views/Dashboard/SchoolAdminDashboard.vue")
  },
  {
    path: "/edit-profile/:username/",
    name: "userprofile",
    props: true,
    component: () => import("../views/UserProfile.vue")
  },
  {
    path: "/profile/:username/",
    name: "showteacherprofile",
    props: true,
    component: () => import("../views/Profile/ShowTeacherProfile.vue")
  },
  {
    path: "/user-profile/:username/",
    name: "showstudentprofile",
    props: true,
    component: () => import("../views/Profile/ShowStudentProfile.vue")
  },
  {
    path: "/edit-user-profile/:username/",
    name: "editstudentprofile",
    props: true,
    component: () => import("../views/Profile/EditStudentProfile.vue")
  },
  {
    path: "/notifications",
    name: "notifications",
    component: () => import("../views/Notifications/Notifications.vue")
  },

  {
    path: "/resource",
    name: "Resources",
    component: () => import("../views/Resources.vue")
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/Login.vue")
  },
  {
    path: "/learn-at-home/register",
    name: "LearnAtHome",
    component: () => import("../views/learnAtHomeRegister.vue")
  },
  {
    path: "/live-demo-session/request",
    name: "LiveClassTrail",
    component: () => import("../views/LiveClassRegister.vue")
  },

  {
    path: "/live-class/certificate",
    name: "liveclasscertificate",
    component: () => import("../views/LiveClass/LiveClassCertificate.vue")
  },

  {
    path: "/active-mail",
    name: "active-mail",
    component: () => import("../views/ActiveEmail.vue")
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: () => import("../views/ResetPassword.vue")
  },
  {
    path: "/courses",
    name: "courses",
    component: () => import("../views/Courses.vue")
  },
  {
    path: "/live-courses",
    name: "courses ",
    component: () => import("../views/Courses.vue")
  },
  {
    path: "/live-class",
    name: "WaitTimeURLRedirect",
    component: () => import("../views/waitingScreen.vue")
  },
  /****other course module */
  /*{
    path: "/course/:courseName",
    name: "otherCourseDetails",
    props: true,
    component: () => import("../views/OtherCourses/OtherCoursedetail.vue")
  },*/
  /***AdminNotification */
  {
    path: "/admin-notification",
    name: "AdminNotification",
    props: true,
    component: () =>
      import("../views/AdminDataManipulation/AdminNotification.vue")
  },

  /****End Notification */
  {
    path: "/course/:courseName/assessments/",
    name: "OtherCouseAssessment",
    props: true,
    component: () => import("../views/OtherCourses/OtherCouseAssessment.vue")
  },

  {
    path: "/course/assessments/other-course-assessmentDetail",
    name: "OtherCourseAssessmentDetails",
    props: true,
    component: () =>
      import("../views/OtherCourses/OtherCourseAssessmentDetail.vue")
  },

  {
    path: "/course/:courseName/notes/",
    name: "CourseNotes",
    props: true,
    component: () => import("../views/OtherCourses/OtherCoursedoc.vue")
  },
  {
    path: "/course/:courseName/videos/",
    name: "CourseVideos",
    props: true,
    component: () => import("../views/OtherCourses/OtherCoursesVideos.vue")
  },
  {
    path: "/course/:curName/",
    name: "learn-more",
    props: true,
    component: () => import("../views/OtherCourses/OtherCourseLearnMore.vue")
  },
  {
    path: "/courses/:curName/",
    name: "course-details",
    props: true,
    component: () => import("../views/ProductDetails.vue")
  },
  {
    path: "/paymentQRCode",
    name: "OrCode",
    props: true,
    component: () => import("../views/paytmQRCode.vue")
  },

  /***Cash Payment Module */
  {
    path: "/admin/cash-payment",
    name: "CashPayment.vue",
    props: true,
    component: () => import("../views/Payment.vue")
  },
  /***End cash Payment Module */

  {
    path: "/live-course/:liveCourseName/",
    name: "LiveCourseDetail",
    props: true,
    component: () => import("../views/liveCourseDetails.vue")
  },
  {
    path: "/byte-course/:ByteCourseName/",
    name: "ByteCourseDetail",
    props: true,
    component: () => import("../views/ByteCourses/ByteSizeCourseDetails.vue")
  },

  {
    path: "/byte-course/:ByteCourseName/topics/",
    name: "ByteCourVideos",
    props: true,
    component: () => import("../views/ByteCourses/ByteCoursesVideos.vue")
  },
  {
    path: "/live-courses/:liveCourseName/",
    name: "LiveCourseDetail",
    props: true,
    component: () => import("../views/liveCourseDetails.vue")
  },
  {
    path: "/live-courses-thank-you/",
    name: "LiveCourseThankyou",
    props: true,
    component: () => import("../views/LiveCourseThankyou.vue")
  },

  {
    path: "/courses/:curName/:topicName/",
    name: "course-content",
    props: true,
    component: () => import("../views/CourseContent.vue")
  },
  {
    path: "/other-course/",
    name: "OtherCourseContent",
    props: true,
    component: () =>
      import("../views/CourseBuilder/OtherCourseCourseContent.vue")
  },
  /*****end other course module */
  /***Live Course Module */
  {
    path: "/admin-sales/assign-new-sales-lead",
    name: "RegisterForTrialClass",
    props: true,
    component: () =>
      import("../views/LiveCourseModule/AdminNewSalesLeadManagement.vue")
  },

  {
    path: "/trial-live-courses/trial-class-user-management",
    name: "TrialClassUserManagement",
    props: true,
    component: () =>
      import("../views/LiveCourseModule/SalesManageTrialClasses.vue")
  },
  {
    path: "/trial-live-courses/trial-class-sales-follow-up",
    name: "SalesFollowupLiveCoursesLead",
    props: true,
    component: () =>
      import("../views/LiveCourseModule/SalesFollowupLiveCoursesLead.vue")
  },
  {
    path: "/trial-live-courses/trial-class-schedule-class-request",
    name: "SalesManageTrialClassesScheduleRequest",
    props: true,
    component: () =>
      import(
        "../views/LiveCourseModule/SalesManageTrialClassesScheduleRequest.vue"
      )
  },
  {
    path: "/trial-live-courses/register-for-demo-trial-class",
    name: "RegisterForTrialClassSales",
    props: true,
    component: () =>
      import("../views/LiveCourseModule/LiveCourseRegisterSales.vue")
  },
  {
    path: "/admin-sales/schedule-demo-session",
    name: "AdminRegisterForTrialClass",
    props: true,
    component: () =>
      import("../views/LiveCourseModule/AdminLiveCourseRegister.vue")
  },
  {
    path: "/sales-leads",
    name: "SalesLeadsManagement",
    component: () => import("../views/Samples/SalesLeadsManagement.vue")
  },
  {
    path: "/student-feedback-report/:req_id",
    name: "StudentfeedbackReport",
    props: true,
    component: () => import("../views/LiveCourseModule/StudentFeedback")
  },
  {
    path: "/admin-trainer/add-new-trainer",
    name: "AddNewTrainer",
    props: true,
    component: () => import("../views/LiveCourseModule/AddNewTrainer.vue")
  },
  {
    path: "/admin-trainer/trainer-management",
    name: "TrainerManagement",
    props: true,
    component: () =>
      import("../views/LiveCourseModule/AdminTrainerManagement.vue")
  },
  {
    path: "/admin-sales/sales-live-course-management",
    name: "SalesCourseManagement",
    props: true,
    component: () =>
      import("../views/LiveCourseModule/AdminSalesLiveCourseManagement.vue")
  },
  {
    path: "/admin-sales/trial-class-sales-followup",
    name: "AdminTrialClassSalesFollowup",
    props: true,
    component: () =>
      import("../views/LiveCourseModule/AdminTrialClassSalesFollowup.vue")
  },
  /*******End Live Course Module */
  /***course Builder */
  {
    path: "/course-builder",
    name: "CourseBuilder",
    props: true,
    component: () => import("../views/CourseBuilder/CourseBuilder.vue")
  },
  {
    path: "/all-new-courses",
    name: "AllNewCourses",
    props: true,
    component: () => import("../views/CourseBuilder/AllNewCourses.vue")
  },
  {
    path: "/new-course",
    name: "NewCourse",
    props: true,
    component: () => import("../views/CourseBuilder/NewCourse.vue")
  },
  {
    path: "/course-setup",
    name: "CourseSetup",
    props: true,
    component: () => import("../views/CourseBuilder/CourseSetup")
  },
  {
    path: "/course-topic-content",
    name: "CourseTopicContent",
    props: true,
    component: () => import("../views/CourseBuilder/CourseTopicContent")
  },
  /****end course Builder */
  /****Admin Registrarion */
  {
    path: "/admin-school-registration",
    name: "SchoolRegistration",
    props: true,
    component: () =>
      import("../views/AdminDataManipulation/SchoolRegistration.vue")
  },
  {
    path: "/admin-school-details",
    name: "SchoolDetails",
    props: true,
    component: () => import("../views/AdminDataManipulation/SchoolDetail.vue")
  },
  {
    path: "/admin-staff-registrations",
    name: "StaffRegistration",
    props: true,
    component: () =>
      import("../views/AdminDataManipulation/StaffRegistration.vue")
  },
  {
    path: "/admin-staff-details",
    name: "StaffDetails",
    props: true,
    component: () => import("../views/AdminDataManipulation/StaffDetail.vue")
  },
  {
    path: "/admin-student-registrations",
    name: "StudentRegistration",
    props: true,
    component: () =>
      import("../views/AdminDataManipulation/StudentRegistration.vue")
  },
  {
    path: "/admin-student-details",
    name: "StudentsDetails",
    props: true,
    component: () => import("../views/AdminDataManipulation/StudentDetail.vue")
  },
  {
    path: "/admin-student-activation",
    name: "studentactivation",
    props: true,
    component: () =>
      import("../views/AdminDataManipulation/StudentActivation.vue")
  },
  {
    path: "/admin-promote-students",
    name: "promotestudents",
    component: () =>
      import("../views/AdminDataManipulation/PromoteStudents.vue")
  },
  /*****End Admin Registration */

  {
    path: "/projects",
    name: "projects",
    component: () => import("../views/Projects.vue")
  },
  {
    path: "/resource/projects",
    name: "projects",
    component: () => import("../views/Projects.vue")
  },
  {
    path: "/projects/students",
    name: "students-projects",
    component: () => import("../views/StudentsProjects.vue")
  },
  {
    path: "/projects/code-challenge",
    redirect: { name: "projects" }
  },
  {
    path: "/projects/code-challenge/manage",
    name: "code-challenge",
    component: () => import("../views/CodeChallengeManager.vue")
  },
  {
    path: "/projects/code-challenge/submissions",
    name: "code-challenge-submissions",
    component: () => import("../views/CodeChallengeSubmissions.vue")
  },
  {
    path: "/projects/annual-project/submissions",
    name: "annual-project-submissions",
    component: () => import("../views/AnnualProjectSubmissions.vue")
  },
  {
    path: "/admin/code-challenge",
    name: "code-challenge-admin",
    component: () => import("../views/CodeChallengeAdmin.vue")
  },
  {
    path: "/admin/annual-project",
    name: "annual-project-admin",
    component: () => import("../views/AnnualProjectAdmin.vue")
  },
  {
    path: "/projects/submissions",
    name: "project-submissions",
    component: () => import("../views/ProjectSubmissions.vue")
  },
  {
    path: "/projects/:id",
    name: "project-editor",
    component: () => import("../views/ProjectEditor.vue")
  },
  {
    path: "/projects/preview/:id",
    name: "project-preview",
    component: () => import("../views/ProjectPreview.vue")
  },
  {
    path: "/checkout",
    name: "checkout",
    props: {
      header: true,
      content: true
    },
    component: () => import("../views/Checkout.vue")
  },
  {
    path: "/for-parents",
    name: "parents",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ForParents.vue")
  },
  {
    path: "/account-setting",
    name: "AccountSetting",
    component: () => import("../views/Profile/AccountSetting.vue")
  },
  {
    path: "/for-schools",
    name: "schools",
    component: () => import("../views/ForSchools.vue")
  },
  {
    path: "/why-coding",
    name: "why-coding",
    component: () => import("../views/WhyCoding.vue")
  },
  {
    path: "/privacy-policy",
    name: "privacy",
    component: () => import("../views/PrivacyPolicy.vue")
  },
  {
    path: "/about-us",
    name: "about",
    component: () => import("../views/AboutUs.vue")
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import("../views/ContactUs.vue")
  },
  /*{
    path: "/spark19",
    name: "sparkjpis",
    component: () => import("../views/Spark19.vue")
  },*/
  {
    path: "/enquiry",
    name: "enquiry",
    component: () => import("../views/Enquiry.vue")
  },
  {
    path: "/faq",
    name: "faq",
    component: () => import("../views/Faq.vue")
  },
  {
    path: "/team",
    name: "team",
    component: () => import("../views/OurTeam.vue")
  },
  {
    path: "/terms-of-use",
    name: "terms",
    component: () => import("../views/TermsOfUse.vue")
  },
  {
    path: "/payment&refund-policy",
    name: "payment&refundpolicy",
    component: () => import("../views/Payment&RefundPolicy.vue")
  },
  {
    path: "/in-media",
    name: "in-media",
    component: () => import("../views/InMedia.vue")
  },
  {
    path: "/create-coupon",
    name: "create-coupon",
    component: () => import("../views/CreateCoupon.vue")
  },
  //Quickbook routes starting//
  {
    path: "/quickbook",
    name: "quickbook",
    component: () => import("../views/Quickbook.vue")
  },
  //Quickbook routes end//

  //Student profile start
  {
    path: "/profile-setting",
    name: "profilesetting",
    component: () => import("../views/Profile/ProfileSetting.vue")
  },
  {
    path: "/userprofile",
    name: "studentprofile",
    props: true,
    component: () => import("../views/Profile/UserProfile.vue")
  },
  //Student profile start

  //Assessment routes starting//

  {
    path: "/institute/assessments",
    name: "instituteassessments",
    component: () => import("../views/Assessments/TeachersAssessments.vue")
  },
  {
    path: "/assessments/checkout",
    name: "assessmentcheckout",
    component: () => import("../views/Assessments/AssessmentCheckout.vue")
  },

  {
    path: "/assessment-questions",
    name: "assessmentquestions",
    component: () => import("../views/Assessments/AssessmentQuestions.vue")
  },
  {
    path: "/assessment-report",
    name: "assessmentreport",
    component: () => import("../views/Assessments/AssessmentReport.vue")
  },

  {
    path: "/assessments",
    name: "assessments",
    component: () => import("../views/Assessments/Assessments.vue")
  },
  {
    path: "/resource/assessments",
    name: "assessments",
    component: () => import("../views/Assessments/Assessments.vue")
  },
  {
    path: "/assessments/assessment-detail",
    name: "assessmentdetail",
    component: () => import("../views/Assessments/AssessmentDetail.vue")
  },
  {
    path: "/assessments/assessment-exam",
    name: "assessmentexam",
    component: () => import("../views/Assessments/AssessmentExam.vue")
  },
  {
    path: "/assessments/calculatemarks",
    name: "calculatemarks",
    component: () => import("../views/Assessments/CalculateMarks.vue")
  },
  {
    path: "/assessments/view-report",
    name: "viewreport",
    component: () => import("../views/Assessments/ViewReport.vue")
  },
  {
    path: "/assessments/solution",
    name: "assessmentsolution",
    component: () => import("../views/Assessments/AssessmentSolution.vue")
  },
  {
    path: "/assessments/thankyou",
    name: "thankyou",
    component: () => import("../views/Assessments/ThankYou.vue")
  },
  {
    path: "/individual/assessment",
    name: "individualassessment",
    component: () => import("../views/IndividualAssessments/Assessments.vue")
  },
  {
    path: "/individual/assessment/checkout",
    name: "individualassessmentcheckout",
    component: () =>
      import("../views/IndividualAssessments/AssessmentCheckout.vue")
  },

  {
    path: "/individual/assessment/assessment-exam",
    name: "individualassessmentexam",
    component: () => import("../views/IndividualAssessments/AssessmentExam.vue")
  },
  //Assessment routes ends//

  //World Record Event routes starting//
  {
    path: "/robothon",
    name: "worldrecordevent",
    component: () => import("../views/WorldRecordEvent.vue")
  },
  /*{
    path: "/robothon/register",
    name: "eventregister",
    component: () => import("../views/WorldRecordEventRegister.vue")
  },*/
  {
    path: "/robothon/download",
    name: "eventticket",
    component: () => import("../views/WorldRecordEventTicket.vue")
  },
  //World Record Event routes End//

  //Assessment routes ends//
  //Quizzes start//
  //user side //
  {
    path: "/quizzes",
    name: "viewAllQuizzes",
    component: () => import("../views/ViewAllQuizzes.vue")
  },
  {
    path: "/resource/quizzes",
    name: "viewAllQuizzes",
    component: () => import("../views/ViewAllQuizzes.vue")
  },
  {
    path: "/quiz",
    name: "quiz-exam",
    props: true,
    component: () => import("../views/QuizExam.vue")
  },
  {
    path: "/quiz-admin",
    name: "QuizAdmin",
    props: true,
    component: () => import("../views/QuizAdmin.vue")
  },
  {
    path: "/new-quiz",
    name: "CreateAdminQuiz",
    props: true,
    component: () => import("../views/CreateAdminQuiz.vue")
  },
  {
    path: "/quiz-admin-update",
    name: "UpdateAdminQuiz",
    props: true,
    component: () => import("../views/CreateAdminQuiz.vue")
  },
  {
    path: "/quiz-instruction",
    name: "quizInstruction",
    props: true,
    component: () => import("../components/quizzes/Quiz_instruction.vue")
  },
  {
    path: "/quiz-instruction1",
    name: "quizInstruction1",
    props: true,
    component: () => import("../components/quizzes/Quiz_instruction1.vue")
  },
  {
    path: "/quiz-result",
    name: "quizResult",
    props: true,
    component: () => import("../components/quizzes/Quiz_result.vue")
  },
  {
    path: "/quiz-result1",
    name: "quizResult1",
    props: true,
    component: () => import("../components/quizzes/Quiz_result1.vue")
  },
  {
    path: "/quiz-progress",
    name: "ViewAllQuizzesResults",
    props: true,
    component: () => import("../views/ViewAllQuizzesResults.vue")
  },

  {
    path: "/my-quizzes",
    name: "MyQuiz",
    props: true,
    component: () => import("../views/MyQuiz.vue")
  },
  //end user side//
  {
    path: "/create-quiz",
    name: "CreateQuiz",
    props: true,
    component: () => import("../views/CreateTeacherQuiz.vue")
  },
  {
    path: "/update-quiz",
    name: "UpdateTeacherQuiz",
    props: true,
    component: () => import("../views/CreateTeacherQuiz.vue")
  },
  //end Quizzes//
  //admin start
  {
    path: "/admin-dashboard",
    name: "AdminHome",
    props: true,
    component: () => import("../views/AdminHome.vue")
  },
  {
    path: "/assigngradestoteachers",
    name: "assigngradestoteachers",
    props: true,
    component: () =>
      import("../views/AdminDataManipulation/AdminAssignedGradesToTeacher.vue")
  },
  {
    path: "/assigngradestoschool",
    name: "assigngradestoschool",
    props: true,
    component: () =>
      import("../views/AdminDataManipulation/AdminAssignedGradesToSchool.vue")
  },
  {
    path: "/:sch_username/report",
    name: "AdminSchoolTrackingReport",
    props: true,
    component: () => import("../views/AdminSchoolTrackingReport.vue")
  },
  {
    path: "/:sch_username/student/:st_username",
    name: "AdminSchoolIndividualUserTrackingReport",
    props: true,
    component: () =>
      import("../views/AdminSchoolIndividualUserTrackingReport.vue")
  },

  {
    path: "/admin-assessments",
    name: "adminAssessments",
    props: true,
    component: () => import("../views/Assessments/AdminAssessments.vue")
  },
  {
    path: "/admin/coupon-for-individual",
    name: "AddCouponForIndivisual",
    props: true,
    component: () => import("../views/coupons/AddCouponsForIndividual.vue")
  },
  {
    path: "/admin-assessments/admin-assessments-detail",
    name: "adminassessmentdetail",
    props: true,
    component: () => import("../views/Assessments/AdminAssessmentDetail.vue")
  },
  {
    path: "/admin-assessments/admin-check-assessment",
    name: "admincheckassessment",
    props: true,
    component: () => import("../views/Assessments/AdminCheckAssessment.vue")
  },
  {
    path: "/live-course-students",
    name: "livecoursestudents",
    props: true,
    component: () =>
      import("../views/AdminDataManipulation/LiveCourseStudents.vue")
  },

  {
    path: "/test-dashboard",
    name: "test-dashboard",
    props: true,
    component: () => import("../views/Dashboard/Test.vue")
  },

  {
    path: "/sales-followup-test",
    name: "sales-followup-test",
    props: true,
    component: () => import("../views/Samples/SalesFollowup.vue")
  },

  //end admin

  /*--------------live cources module start-----------*/
  {
    path: "/live-course/:liveCourseName/:courseId",
    name: "livecoursecontent",
    props: true,
    component: () => import("../views/LiveCourses/liveCourseContent.vue")
  },
  /*-------------end---------------------*/

  {
    path: "*",
    name: "404",
    component: () => import("../views/404.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ x: 0, y: 0 });
      }, 500);
    });
  }
});

export default router;
