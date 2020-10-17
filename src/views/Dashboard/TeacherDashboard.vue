<template>
  <div id="teacher-dashboard-root">
    <Header
      ref="header"
      @OpenProfileCurrent="myCurrentProfile"
      @openMyUnnreadNotification="myNotification"
    />
    <!--profile pic-->
    <div
      class="modal fade show"
      id="updateProfilePicModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="updateProfilePicModal"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header" style="border: none;">
            <h5 class="modal-title" id="exampleModalLabel">
              Upload Profile Picture
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="col-md-12">
              <div class="col-lg-12 col-md-12 mb-3">
                <div class="wideget-user-desc text-center">
                  <div class="profile-image-container">
                    <img
                      id="preview_image"
                      :src="
                        userProfile.length
                          ? userProfile[0].profile_pic
                            ? userProfile[0].profile_pic
                              ? '/dynamic/profiles/' +
                                userProfile[0].profile_pic
                              : '/assets/images/users/user.svg'
                            : '/assets/images/users/user.svg'
                          : '/assets/images/users/user.svg'
                      "
                      alt="user"
                    />
                    <div class="image-upload">
                      <label for="file-input">
                        <i class="fa fa-camera" />
                      </label>
                      <input
                        id="file-input"
                        type="file"
                        @change="preview_img($event)"
                        style="display: none;"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click.prevent="updateProfilePic()"
            >
              Save
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              id="closeProfilePicModalButton"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--end profile pic-->
    <!--User Dashboard-->
    <!--Time Schedualr-->
    <!--modal for new user-->
    <div id="AddNewTimeSlot" class="cv-modal normal">
      <div
        style="
          display: flex;
          flex-direction: column;
          max-width: 3000px;
          width: 89%;
          height: 98%;
          overflow: auto;
        "
      >
        <div class="row m-0 p-2 bg-primary text-white">
          <div class="active d-inline-block">
            <h5>Add Time Slot</h5>
          </div>
          <i class="flex-fill"></i>
          <span
            class="d-inline-block mr-4"
            onclick="hideModal('AddNewTimeSlot')"
          >
            <i class="fas fa-times"></i>
          </span>
        </div>
        <!--form design-->

        <div class="single-page">
          <div class="col-lg-8 col-xl-12 col-md-12 d-block mx-auto">
            <div class="wrapper wrapper2 h-100">
              <form id="Register" class="card-body h-100" tabindex="500">
                <div class="trainer col-sm-12 mb-3" id="schedule_date">
                  <div class="com-sm-12 dropdown-contents" id="trainer_names">
                    <input
                      type="date"
                      placeholder
                      id="schedule-time"
                      v-model="currentDate"
                    />
                    <label>Date</label>
                  </div>
                </div>
                <div class="row">
                  <div class="trainer col-sm-6 mb-3" id="t_s_time">
                    <input
                      type="time"
                      placeholder
                      id="schedule-s-time"
                      @change="changeCalender()"
                      value="09:00:00"
                    />
                    <label>Start Time</label>
                  </div>
                  <div
                    class="trainer col-sm-6 mb-3"
                    id="t_e_time"
                    style="display:none"
                  >
                    <input
                      type="time"
                      placeholder
                      id="schedule-e-time"
                      value="23:59:00"
                      readonly
                    />
                    <label>End Time</label>
                  </div>
                  <div class="trainer col-sm-6 mb-3" id="t_e_time">
                    <input
                      type="Number"
                      placeholder
                      id="duration"
                      value="60"
                      readonly
                    />
                    <label>Class Duration</label>
                  </div>
                  <!-- <div class="trainer col-sm-6 mb-3" id="t_e_time">
                    <select
                      class="form-control"
                      id="lunch-break"
                      @click="changeLunchBreak()"
                    ></select>
                    <label>Lunch Break</label>
                  </div>-->
                  <hr class="col-sm-12" />
                  <Div class="trainer col-sm-12 mb-5">
                    <label style="font-size: 16px;">Time Slots</label>
                  </Div>
                  <div class="row col-sm-12 mb-3">
                    <div class="col-sm-12">
                      <div class="table-responsive">
                        <table
                          class="table card-table table-vcenter text-nowrap"
                          style="overflow: auto;"
                        >
                          <thead class="bg-secondary text-white">
                            <tr>
                              <th class="text-white">Sr. No.</th>
                              <td class="text-white">
                                Select Slot<input
                                  type="checkbox"
                                  class="multiSlotSelect"
                                  style="width:8%;padding:0px;margin-left:4px;height:16px;"
                                  @click="selectAllSlots"
                                />
                              </td>
                              <th class="text-white">Class</th>
                              <th class="text-white">Start Time</th>
                              <th class="text-white">End Time</th>
                              <th class="text-white" style="display: none;">
                                break
                              </th>
                              <!--<td class="text-white">Action</td>-->
                            </tr>
                          </thead>
                          <tbody id="sloted-classses">
                            <tr
                              v-for="(data, index) in TabularTime"
                              :key="index"
                            >
                              <td>{{ data.id }}</td>
                              <td>
                                <input
                                  class="selectSlots"
                                  :id="index + 1"
                                  style="width:15%;"
                                  type="checkbox"
                                />
                              </td>
                              <td>Class {{ index + 1 }}</td>
                              <td>{{ data.stime }}</td>
                              <td>{{ data.endTime }}</td>
                              <td style="display:none">No Break</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div class="form-footer col-xl-12 text-center mt-2 pl-4">
                      <center>
                        <button
                          id="register-btn"
                          class="btn btn-primary btn-block col-xl-2"
                          @click.prevent="submit_schedule_time()"
                        >
                          Add Calender
                        </button>
                      </center>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!--end form design-->
      </div>
    </div>
    <!--end modal for new user-->

    <!--feddback test-->
    <div id="feedbackTest" class="cv-modal large">
      <div
        style="
          display: flex;
          flex-direction: column;
          max-width: 3000px;
          width: 60%;
          height: 60%;
          overflow: auto;
        "
      >
        <div class="row m-0 p-2 bg-secondary text-white">
          <div class="active d-inline-block">
            <h3>Final Status</h3>
          </div>
          <i class="flex-fill"></i>
          <span class="d-inline-block mr-4" onclick="hideModal('feedbackTest')">
            <i class="fas fa-times"></i>
          </span>
        </div>
        <!--container-->
        <template v-for="(data, index) in userTimeSlotsFeedback">
          <div class="text-center p-4" :key="index">
            <div class="form-group">
              <select
                class="form-control col-sm-10 users-feedbacks"
                :id="'user-feedback' + (index + 1)"
                @click="ViewCoursesEnable(index + 1)"
              >
                <option value="0">--Select Option--</option>
                <template v-for="(feedback, key) in feedbacks">
                  <option
                    :key="key"
                    :value="feedback.feedback_status_id"
                    :selected="
                      feedback.feedback_status_id === data.feedback_status_id
                        ? true
                        : false
                    "
                  >
                    {{ feedback.feedback_status }}
                  </option>
                </template>
              </select>
            </div>
            <div class="form-group">
              <select
                class="form-control col-sm-10 users-feedbacks"
                style="color: #000;"
                :id="'user-products' + (index + 1)"
                v-if="viewCourses"
              >
                <option value="0" disabled>--Select Option--</option>
                <template
                  v-for="(suggestCourse, key2) in suggestedCourseSelection"
                >
                  <option
                    style="color: #000;"
                    :key="key2"
                    :value="suggestCourse.product_id"
                    :selected="
                      suggestCourse.product_id == data.sale_product_id
                        ? true
                        : false
                    "
                  >
                    {{ suggestCourse.live_course_name }}
                  </option>
                </template>
              </select>
            </div>
            <div class="form-group">
              <textarea
                class="content2 form-control feedbacks-descs"
                :id="'feed_desc' + (index + 1)"
                name="example"
                rows="6"
                placeholder="Detail descriptions..."
                :value="data.feedback_message"
              ></textarea>
            </div>
            <div class="form-footer col-xl-12 text-center mt-2 pl-4">
              <center>
                <button
                  v-if="
                    userTimeSlotsFeedback &&
                      userTimeSlotsFeedback[0].feedback_status_id
                  "
                  type="button"
                  class="feedbackSubmits btn btn-secondary"
                  :id="'feedbacksubmit' + (index + 1)"
                  @click="submitFeedbackMessage(data.assigned_id, index + 1)"
                  disabled
                >
                  Submit
                </button>
                <button
                  v-else
                  type="button"
                  class="feedbackSubmits btn btn-secondary"
                  :id="'feedbacksubmit' + (index + 1)"
                  @click="submitFeedbackMessage(data.assigned_id, index + 1)"
                >
                  Submit
                </button>
              </center>
            </div>
          </div>
        </template>
        <!--end container-->
      </div>
    </div>

    <!--View Cancle Region-->
    <div id="CancleRegion" class="cv-modal large">
      <div
        style="
          display: flex;
          flex-direction: column;
          max-width: 3000px;
          width: 60%;
          height: 60%;
          overflow: auto;
        "
      >
        <div class="row m-0 p-2 bg-secondary text-white">
          <div class="active d-inline-block">
            <h3>Cancle Region</h3>
          </div>
          <i class="flex-fill"></i>
          <span class="d-inline-block mr-4" onclick="hideModal('CancleRegion')">
            <i class="fas fa-times"></i>
          </span>
        </div>
        <div class="text-center p-4 mt-4">
          <div class="form-group mt-4">
            <textarea
              class="content2 form-control feedbacks-descs"
              id="cancle-session-region"
              name="example"
              rows="6"
              placeholder="Detail descriptions..."
            ></textarea>
          </div>
          <div class="form-footer col-xl-12 text-center mt-4 pl-4">
            <center>
              <button
                type="button"
                class="feedbackSubmits btn btn-secondary"
                :id="'cancle-region-button'"
                @click="SubmitCancleRegion"
              >
                Submit
              </button>
            </center>
          </div>
        </div>
      </div>
    </div>

    <!-- End View Cancle Region-->
    <!--end feedback test-->
    <!--user information-->
    <div id="demo-trainee-information" class="cv-modal large">
      <div>
        <h3 class="text-center mt-3" id="trail-course-name">
          Follow up details
        </h3>

        <div class="course-details">
          <div class="col-sm-12 mx-4" style="height: 400px; overflow-y: auto;">
            <template v-for="(followdetail, key) in followUpDetails">
              <div class="my-2" :key="key">
                <h4
                  class="mt-0 mb-1 font-weight-bold"
                  style="font-weight: bold; font-display: 'Poppins';"
                >
                  {{ followdetail.sales_Person_name }}
                </h4>
                <small class="text-muted">
                  <i class="fa fa-calendar"></i>
                  {{ followdetail.followup_time }}
                  <i class="ml-3 fa fa-book"></i>
                  {{ followdetail.theme }}
                </small>
                <h5 class="font-weight-bold mt-2">{{ followdetail.status }}</h5>
                <p class="font-13 mb-2">{{ followdetail.remark }}</p>
              </div>
            </template>
          </div>
        </div>
        <div class="text-center my-4">
          <button
            class="btn btn-primary"
            @click="handleCloseLearnAtHomeClicked"
          >
            Close
          </button>
        </div>
      </div>
    </div>
    <!--Feedback Modal -->
    <!--end time Schedular-->

    <!--start cv-resources modal-->
    <!--lesson Plan-->
    <div class="modal fade" id="lesson_plan_modal" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content" style="width: 100%;">
          <div
            class="modal-header"
            style="
              background-color: #ec296b;
              color: #fff;
              border-top-left-radius: 4px;
              border-top-right-radius: 4px;
            "
          >
            <h3 class="modal-title" style>Download Lesson Plan</h3>
          </div>
          <div class="modal-body lesson-plan-body">
            <p style="font-size: 16px; color: #444;">
              Select a grade for lesson plan.
            </p>
            <div
              id="ans-key-dl-form"
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
              "
            >
              <select
                id="grade-select_lessonplan_grade"
                class
                style="height: 40px; flex-grow: 1; width: 100%;"
                v-model="selectedLessonPlanGrade"
              >
                <option selected value="0">Select grade</option>
                <template v-for="(cls, cls_index) in cls_grp">
                  <option
                    v-bind:key="cls_index"
                    v-if="cls.cls_id < 9"
                    :value="cls.cls_id"
                  >
                    Grade {{ cls.cls_id }}
                  </option>
                </template>
              </select>
              <p
                v-if="selectedLessonPlanGrade != '0'"
                style="font-size: 16px; color: #444; width: 100%;"
              >
                Select a lesson.
              </p>
              <select
                id="grade-lesson-plan"
                v-if="selectedLessonPlanGrade != '0'"
                style="height: 40px; flex-grow: 1; width: 100%;"
                :data-lesson="[
                  selectedLessonPlanGrade == '1' ||
                  selectedLessonPlanGrade == '5'
                    ? (lessonplans = 10)
                    : selectedLessonPlanGrade == '2' ||
                      selectedLessonPlanGrade == '3' ||
                      selectedLessonPlanGrade == '6'
                    ? (lessonplans = 9)
                    : (lessonplans = 11),
                ]"
              >
                <option selected value="0">Select lesson</option>

                <option
                  v-for="(lessonplan, l_ind) in lessonplans"
                  v-bind:key="l_ind"
                  :value="lessonplan"
                >
                  Lesson plan {{ lessonplan }}
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary btn-round"
              v-on:click="down_lesson_plan()"
            >
              Download
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--end lesson Plan-->
    <!--Answer Key-->
    <!-- Modal -->
    <div class="modal fade" id="answer_key_modal" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div
            class="modal-header"
            style="
              background-color: #ec296b;
              color: #fff;
              border-top-left-radius: 4px;
              border-top-right-radius: 4px;
            "
          >
            <h3 class="modal-title" style>Download Answer Key</h3>
          </div>
          <div class="modal-body">
            <p style="padding: 0; font-size: 16px; color: #444;">
              Select a grade for Answer key.
            </p>

            <div
              id="ans-key-dl-form"
              style="display: flex; flex-direction: row; align-items: center;"
            >
              <select
                id="grade-select"
                class
                style="height: 40px; flex-grow: 1;"
              >
                <option selected disabled value="0">Select grade</option>
                <template v-for="(cls, c_ind) in cls_grp">
                  <option
                    v-bind:key="c_ind"
                    v-if="cls.cls_id < 10"
                    :value="cls.cls_id"
                  >
                    Grade {{ cls.cls_id }}
                  </option>
                </template>
              </select>
              <button
                type="button"
                class="btn btn-primary btn-round mt-0"
                style="height: 40px;"
                v-on:click="down()"
              >
                Download
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button "
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!--end modal-->
    <!-- Modal -->
    <!--end ANSWER key -->
    <!--Question Bank-->
    <!--Answer Key-->
    <!-- Modal -->
    <div class="modal fade" id="que_bank_modal" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content" style="width: 100%;">
          <div
            class="modal-header"
            style="
              background-color: #ec296b;
              color: #fff;
              border-top-left-radius: 4px;
              border-top-right-radius: 4px;
            "
          >
            <h3 class="modal-title" style>Download Question Bank</h3>
          </div>
          <div class="modal-body">
            <p style="font-size: 16px; color: #444;">
              Select a grade for Question Bank.
            </p>
            <div
              id="ans-key-dl-form"
              style="display: flex; flex-direction: row; align-items: center;"
            >
              <select
                id="grade-select_que_bank"
                class
                style="height: 40px; flex-grow: 1;"
              >
                <option selected value="0">Select grade</option>
                <template v-for="(cls, q_cind) in cls_grp">
                  <option
                    :key="q_cind"
                    v-if="cls.cls_id < 9"
                    :value="cls.cls_id"
                  >
                    Grade {{ cls.cls_id }}
                  </option>
                </template>
              </select>
            </div>
            <p style="font-size: 16px; color: #444;">
              Select a grade for Answer Key.
            </p>

            <div
              id="ans-key-dl-form"
              style="display: flex; flex-direction: row; align-items: center;"
            >
              <select
                id="grade-select_que_bank_answer_key"
                class
                style="height: 40px; flex-grow: 1;"
              >
                <option selected value="0">Select grade</option>
                <template v-for="(cls, a_cind) in cls_grp">
                  <option
                    v-bind:key="a_cind"
                    v-if="cls.cls_id < 9"
                    :value="cls.cls_id"
                  >
                    Grade {{ cls.cls_id }}
                  </option>
                </template>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary btn-round"
              v-on:click="down_que_bank()"
            >
              Download
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!--end modal-->
    <!-- Modal -->

    <!--end ANSWER key -->
    <!--end Question Bank-->
    <!--Bridge Course-->
    <!-- Modal -->
    <div class="modal fade" id="bridge_course_modal" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div
            class="modal-header"
            style="
              background-color: #ec296b;
              color: #fff;
              border-top-left-radius: 4px;
              border-top-right-radius: 4px;
            "
          >
            <h3 class="modal-title" style>Download Bridge Course</h3>
          </div>
          <div class="modal-body">
            <p style="padding: 0 16px; font-size: 16px; color: #444;">
              Select for Bridge Course.
            </p>

            <div
              id="ans-key-dl-form"
              style="display: flex; flex-direction: row; align-items: center;"
            >
              <select
                id="grade-select-bridge"
                class
                style="height: 40px; flex-grow: 1;"
              >
                <option selected disabled value="0">Select grade</option>
                <option
                  value="4"
                  v-if="cls_grp.findIndex((x) => x.cls_id === 4)"
                >
                  Grade 4
                </option>
                <option
                  value="6"
                  v-if="cls_grp.findIndex((x) => x.cls_id === 6)"
                >
                  Grade 6
                </option>
              </select>
              <button
                type="button"
                class="btn btn-primary btn-round mt-0"
                style="height: 40px;"
                v-on:click="down_bridge()"
              >
                Download
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!--end modal-->
    <!--end Bridge Course-->
    <!--end cv-resources modal-->
    <!--User Dashboard-->

    <section class="sptb h-100 w-100 p-0">
      <div class="container-fluid h-100 w-100">
        <div class="row">
          <!--side nav bar-->
          <sideNav
            ref="sidenav"
            @removeUserProfile="removeProfilePic()"
            @accountSetting="accountSetting"
            @updateAgainEdit="updateEditAgaingFunction"
            @updateAgainNoti="OpenNoti"
            @updateAgainSchedular="openTrainerSchedular"
            @updatedDashboard="(...args) => updateDashboard(...args)"
            @studentProfileSetting="(...args) => updateStudentProfile(...args)"
          ></sideNav>
          <!-- end side nav-->

          <div
            class="col-xl-9 col-lg-12 col-md-12 pl-0 teacher-view-dashboard-content"
          >
            <!--courses with curruiculum-->
            <showTeacherProfile
              ref="TeacherProfile"
              @updateUesrProfile="changeSidNavData"
              v-if="profile"
              :edit="0"
            ></showTeacherProfile>
            <Notification
              ref="notific"
              v-else-if="notif"
              @delenoticall="callNoti"
            />
            <ProfileSetting ref="stprofileSetting" v-else-if="st_prof_set" />
            <AccountSetting ref="accountSetting" v-else-if="account_setting" />
            <TrainerTimeSchedular
              ref="trainerscheduletime"
              v-else-if="trainerSchedular"
              @OpenNewSlotModel="openNewTimeSlot"
              @OpenFinalStatus="OpenFinalStatus"
              @OpenFollowupModal="OpenFollowupModal"
              @ViewCancleRegion="ViewCancleRegion"
            />
            <div
              v-else
              style="position: relative; overflow: auto; height: 100%;"
            >
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">My Courses</h3>
                </div>
                <div class="card-body p-6">
                  <div class="panel panel-primary">
                    <div class="tab-menu-heading" v-if="sch_id != 1">
                      <div class="tabs-menu1">
                        <ul class="nav panel-tabs">
                          <li class>
                            <a href="#tab5" class="active" data-toggle="tab">
                              Institute Curriculum
                            </a>
                          </li>
                          <!--  <li>
                            <a href="#tab6" data-toggle="tab">
                              Self Learning Courses
                            </a>
                          </li>
                          <li>
                            <a
                              href="#tab71"
                              id="other_subject"
                              data-toggle="tab"
                            >
                              Learn@Home
                            </a>
                          </li>-->
                          <li>
                            <a
                              href="#tab811"
                              id="live_classes"
                              data-toggle="tab"
                            >
                              Live Courses
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="panel-body tabs-menu-body">
                      <div class="tab-content">
                        <div
                          :class="'tab-pane' + [sch_id != 1 ? ' active' : '']"
                          id="tab5"
                        >
                          <div v-if="sch_curriculm == -1">No Course.</div>
                          <div class="row m-0" v-else>
                            <template
                              v-for="(lms_book, index) in lms_user_books"
                            >
                              <div
                                class="col-lg-4 col-md-6 col-xl-4 mt-2"
                                v-bind:key="index"
                                v-if="
                                  lms_book.sch_course == 1 &&
                                    lms_book.other_courses == 0 &&
                                    (grades.length
                                      ? grades[0].grades != ''
                                        ? grades.find(
                                            (x) => x == lms_book.for_grade
                                          )
                                        : assignClasses.find(
                                            (x) =>
                                              x.cls_id == lms_book.for_grade
                                          )
                                      : assignClasses.find(
                                          (x) => x.cls_id == lms_book.for_grade
                                        ))
                                "
                              >
                                <div class="card mb-0">
                                  <div class="item-card2-img">
                                    <a
                                      v-if="!lms_book.downloaad"
                                      @click="
                                        $router.push({
                                          name: 'course-details',
                                          params: {
                                            curName: lms_book.slug,
                                            bookId: lms_book.book_id,
                                            book_per: lms_book.per,
                                          },
                                        })
                                      "
                                    ></a>
                                    <img
                                      :src="
                                        lms_book.img
                                          ? '/assets/images/png/courses/' +
                                            lms_book.img
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
                                              (lms_book.avg_rating
                                                ? lms_book.avg_rating * 20
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
                                      <div class="item-card2-desc">
                                        <div class="item-card2-text mb-3">
                                          <a
                                            @click="
                                              !lms_book.downloaad
                                                ? $router.push({
                                                    name: 'course-details',
                                                    params: {
                                                      curName: lms_book.slug,
                                                      bookId: lms_book.book_id,
                                                      book_per: lms_book.per,
                                                    },
                                                  })
                                                : ''
                                            "
                                            class="text-dark"
                                          >
                                            <h4
                                              class="mb-2"
                                              v-html="lms_book.book_name"
                                            ></h4>
                                          </a>
                                        </div>
                                        <p>{{ lms_book.book_summary }}</p>

                                        <ul class="mt-3">
                                          <li>
                                            <a href="#" class="icons">
                                              <i
                                                class="icon icon-user mr-1"
                                              ></i>
                                              {{ lms_book.level }}
                                            </a>
                                          </li>
                                          <li class="text-right">
                                            <a
                                              v-if="!lms_book.downloaad"
                                              @click="
                                                $router.push({
                                                  name: 'course-details',
                                                  params: {
                                                    curName: lms_book.slug,
                                                    bookId: lms_book.book_id,
                                                    book_per: lms_book.per,
                                                  },
                                                })
                                              "
                                              class="learn-more-btn"
                                              style="
                                                background: #48c9b0;
                                                padding: 4px 8px;
                                                color: #fff;
                                                border-radius: 2px;
                                              "
                                            >
                                              Learn More
                                            </a>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="card-footer">
                                    <div class="item-card2-footer">
                                      <div class="item-card2-footer-u">
                                        <div class="product-item-wrap d-flex">
                                          <div
                                            class="product-item-price"
                                            v-if="lms_book.sch_course == 0"
                                          >
                                            Rs.
                                            <del
                                              v-if="
                                                lms_book.actual_price !=
                                                  lms_book.price
                                              "
                                              class="oldprice text-muted"
                                              style="font-size: 14px;"
                                            >
                                              {{ lms_book.actual_price }}
                                            </del>
                                            <span
                                              class="newprice text-dark"
                                              style="font-size: 14px;"
                                            >
                                              {{
                                                lms_book.price
                                                  ? lms_book.price
                                                  : "Free"
                                              }}
                                            </span>
                                          </div>
                                          <a
                                            :class="
                                              'btn btn-info btn-sm ml-auto btn-primary text-white'
                                            "
                                            v-if="!lms_book.downloaad"
                                            @click="
                                              $router.push({
                                                name: 'course-details',
                                                params: {
                                                  curName: lms_book.slug,
                                                  bookId: lms_book.book_id,
                                                  book_per: lms_book.per,
                                                },
                                              })
                                            "
                                          >
                                            {{ "Start Learning" }}
                                          </a>
                                          <a
                                            :class="
                                              'btn btn-info btn-sm ml-auto btn-primary text-white'
                                            "
                                            v-else
                                            :download="lms_book.book_name"
                                            :href="
                                              'dynamic/cv_resources/textbooks/' +
                                                lms_book.download_link
                                            "
                                          >
                                            {{ "Download" }}
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </template>

                            <!--end test purpose-->
                          </div>
                        </div>
                        <div
                          :class="'tab-pane' + [sch_id == 1 ? ' active' : '']"
                          id="tab6"
                        >
                          <div v-if="p_curriculum == -1">No Course.</div>
                          <div class="row m-0" v-else>
                            <template
                              v-for="(lms_book, index) in lms_user_books"
                            >
                              <div
                                class="col-lg-4 col-md-6 col-xl-4 mt-2"
                                v-bind:key="index"
                                v-if="
                                  unlockedCourses[lms_book.book_id] &&
                                    lms_book.sch_course == 0
                                "
                              >
                                <div class="card mb-0">
                                  <div class="item-card2-img">
                                    <a
                                      @click="
                                        $router.push({
                                          name: 'course-details',
                                          params: {
                                            curName: lms_book.slug,
                                            bookId: lms_book.book_id,
                                            book_per: lms_book.per,
                                          },
                                        })
                                      "
                                    ></a>
                                    <img
                                      :src="
                                        '/assets/images/png/courses/' +
                                          lms_book.img
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
                                              (lms_book.avg_rating
                                                ? lms_book.avg_rating * 20
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
                                      <div class="item-card2-desc">
                                        <div class="item-card2-text mb-3">
                                          <a
                                            @click="
                                              $router.push({
                                                name: 'course-details',
                                                params: {
                                                  curName: lms_book.slug,
                                                  bookId: lms_book.book_id,
                                                  book_per: lms_book.per,
                                                },
                                              })
                                            "
                                            class="text-dark"
                                          >
                                            <h4
                                              class="mb-2"
                                              v-html="lms_book.book_name"
                                            ></h4>
                                          </a>
                                        </div>
                                        <p>{{ lms_book.book_summary }}</p>
                                        <ul class="mt-3">
                                          <li>
                                            <a href="#" class="icons">
                                              <i
                                                class="icon icon-user mr-1"
                                              ></i>
                                              {{ lms_book.level }}
                                            </a>
                                          </li>
                                          <li class="text-right">
                                            <a
                                              @click="
                                                $router.push({
                                                  name: 'course-details',
                                                  params: {
                                                    curName: lms_book.slug,
                                                    bookId: lms_book.book_id,
                                                    book_per: lms_book.per,
                                                  },
                                                })
                                              "
                                              class="learn-more-btn"
                                              style="
                                                background: #48c9b0;
                                                padding: 4px 8px;
                                                color: #fff;
                                                border-radius: 2px;
                                              "
                                            >
                                              Learn More
                                            </a>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="card-footer">
                                    <div class="item-card2-footer">
                                      <div class="item-card2-footer-u">
                                        <div class="product-item-wrap d-flex">
                                          <div
                                            class="product-item-price"
                                            v-if="!lms_book.purchases_status"
                                          >
                                            Rs.
                                            <del
                                              v-if="
                                                lms_book.actual_price !=
                                                  lms_book.price
                                              "
                                              class="oldprice text-muted"
                                              style="font-size: 14px;"
                                            >
                                              {{ lms_book.actual_price }}
                                            </del>
                                            <span
                                              class="newprice text-dark"
                                              style="font-size: 14px;"
                                            >
                                              {{
                                                lms_book.price
                                                  ? lms_book.price
                                                  : "Free"
                                              }}
                                            </span>
                                          </div>
                                          <a
                                            :class="
                                              'btn btn-info btn-sm ml-auto ' +
                                                [
                                                  unlockedCourses[
                                                    lms_book.book_id
                                                  ]
                                                    ? 'btn-primary text-white'
                                                    : 'btn-outline-primary',
                                                ]
                                            "
                                            @click="
                                              $router.push({
                                                name: 'course-details',
                                                params: {
                                                  curName: lms_book.slug,
                                                  bookId: lms_book.book_id,
                                                  book_per: lms_book.per,
                                                },
                                              })
                                            "
                                          >
                                            {{
                                              unlockedCourses[lms_book.book_id]
                                                ? "Start Learning"
                                                : "Enroll Now"
                                            }}
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </template>
                          </div>
                        </div>
                        <!--tab 7-->
                        <div
                          :class="'tab-pane' + [sch_id == 1 ? ' active' : '']"
                          id="tab71"
                        >
                          <div v-if="other_course_curriculam == -1">
                            No Course.
                          </div>

                          <!--course-->
                          <!--new card-->
                          <div class="row m-0" v-else>
                            <div class="w-100">
                              <select
                                class="p-2"
                                id="grade"
                                @change="gradeChange"
                              >
                                <template
                                  v-if="
                                    grades.length
                                      ? grades[0].grades != ''
                                        ? true
                                        : false
                                      : false
                                  "
                                >
                                  <option
                                    v-for="(grade, index) in grades"
                                    v-bind:key="index"
                                    :value="grade"
                                  >
                                    Grade
                                    {{
                                      grade == 11
                                        ? "Nursery"
                                        : grade == 12
                                        ? "LKG"
                                        : grade == 13
                                        ? "UKG"
                                        : grade
                                    }}
                                  </option>
                                </template>
                                <template v-else>
                                  <option
                                    v-for="(grade, index) in assignClasses"
                                    v-bind:key="index"
                                    :value="grade.cls_id"
                                  >
                                    Grade {{ grade.cls_name }}
                                  </option>
                                </template>
                              </select>
                            </div>
                            <template
                              v-for="(lms_book, index) in lms_user_books"
                            >
                              <div
                                class="col-lg-4 col-md-6 col-xl-4 mt-2"
                                v-bind:key="index"
                                v-if="
                                  lms_book.sch_course === 1 &&
                                    lms_book.other_courses === 1 &&
                                    lms_book.for_grade == grade &&
                                    (grades.length
                                      ? grades[0].grades != ''
                                        ? grades.find(
                                            (x) => x == lms_book.for_grade
                                          )
                                        : assignClasses.find(
                                            (x) =>
                                              x.cls_id == lms_book.for_grade
                                          )
                                      : assignClasses.find(
                                          (x) => x.cls_id == lms_book.for_grade
                                        ))
                                "
                              >
                                <div class="card mb-0">
                                  <div class="item-card2-img">
                                    <a
                                      @click="
                                        $router.push({
                                          name: 'learn-more',
                                          params: {
                                            curName: lms_book.slug,
                                            bookId: lms_book.book_id,
                                            book_per: lms_book.per,
                                            tab: 'curriculum',
                                          },
                                        })
                                      "
                                    ></a>
                                    <img
                                      :src="
                                        lms_book.img
                                          ? '/assets/images/png/courses/' +
                                            lms_book.img
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
                                          :style="'width: 90%'"
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
                                  <!--card body-->
                                  <div class="card-body">
                                    <div class="item-card2">
                                      <div class="item-card2-desc">
                                        <div class="item-card2-text mb-3">
                                          <!--
                                          <a
                                            @click="
                                              !lms_book.downloaad
                                                ? $router.push({
                                                    name: 'course-details',
                                                    params: {
                                                      curName: lms_book.slug,
                                                      bookId: lms_book.book_id,
                                                      book_per: lms_book.per
                                                    }
                                                  })
                                                : ''
                                            "
                                            class="text-dark"
                                          >
                                            <h4
                                              class="mb-2"
                                              v-html="lms_book.book_name"
                                            ></h4>
                                          </a>
                                          -->
                                          <a
                                            @click="
                                              $router.push({
                                                name: 'learn-more',
                                                params: {
                                                  curName: lms_book.slug,
                                                  bookId: lms_book.book_id,
                                                  book_per: lms_book.per,
                                                  tab: 'curriculum',
                                                },
                                              })
                                            "
                                          >
                                            <h4
                                              class="mb-2"
                                              v-html="lms_book.book_name"
                                            ></h4>
                                          </a>
                                        </div>
                                        <p>{{ lms_book.book_summary }}</p>
                                        <ul>
                                          <li>
                                            <a
                                              style="
                                                background: #48c9b0;
                                                padding: 4px 8px;
                                                color: #fff;
                                                border-radius: 2px;
                                                cursor: pointer;
                                              "
                                              @click="
                                                $router.push({
                                                  name: 'learn-more',
                                                  params: {
                                                    curName: lms_book.slug,
                                                    bookId: lms_book.book_id,
                                                    book_per: lms_book.per,
                                                    tab: 'question-and-answer',
                                                  },
                                                })
                                              "
                                            >
                                              Q&A
                                            </a>
                                          </li>
                                          <li class="text-right">
                                            <a
                                              style="
                                                background: #48c9b0;
                                                padding: 4px 8px;
                                                color: #fff;
                                                border-radius: 2px;
                                                cursor: pointer;
                                              "
                                              @click="
                                                $router.push({
                                                  name: 'learn-more',
                                                  params: {
                                                    curName: lms_book.slug,
                                                    bookId: lms_book.book_id,
                                                    book_per: lms_book.per,
                                                    tab: 'learn-more',
                                                  },
                                                })
                                              "
                                            >
                                              Learn More
                                            </a>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <!--end card body-->
                                  <!--card footer-->
                                  <div class="card-footer">
                                    <div class="item-card2-footer">
                                      <div class="item-card2-footer-u">
                                        <div class="product-item-wrap d-flex">
                                          <div class="product-item-price">
                                            &nbsp;
                                            <!--<del
                                        v-if="
                                          lms_book.actual_price !=
                                            lms_book.price
                                        "
                                        class="oldprice text-muted"
                                        style="font-size:14px;"
                                        >{{ lms_book.actual_price }}</del
                                            >-->
                                            <span
                                              class="newprice text-dark"
                                              style="font-size: 14px;"
                                            >
                                              {{ "Free" }}
                                            </span>
                                          </div>
                                          <a
                                            :class="
                                              'btn btn-info btn-sm ml-auto btn-primary text-white'
                                            "
                                            @click="
                                              $router.push({
                                                name: 'learn-more',
                                                params: {
                                                  curName: lms_book.slug,
                                                  bookId: lms_book.book_id,
                                                  book_per: lms_book.per,
                                                  tab: 'curriculum',
                                                },
                                              })
                                            "
                                          >
                                            {{ "Start Learning" }}
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <!--end card footer-->
                                </div>
                              </div>
                            </template>
                            <!--end new card-->
                            <!--end course-->
                          </div>
                        </div>
                        <!--end tab 7-->
                        <!--tab81-->
                        <div
                          :class="'tab-pane' + [sch_id == 1 ? 'active' : '']"
                          id="tab811"
                        >
                          <!--test demo class-->
                          <!--card for testing-->
                          <div class="text-center" v-if="!live_courses.length">
                            <div class="tex-center">No Course.</div>
                            <div class="tex-center">
                              <button
                                class="btn btn-secondary mt-2"
                                @click="$router.push('/live-courses')"
                              >
                                Add Course
                              </button>
                            </div>
                          </div>
                          <!--course-->
                          <!--new card-->
                          <div class="row" v-else>
                            <div
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
                                          liveCourseName:
                                            live_course.live_course_slug,
                                          bookId: live_course.live_course_id,
                                        },
                                      })
                                    "
                                  ></a>
                                  <!--<a @click.prevent="learnMore()"></a>-->

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
                                              liveCourseName:
                                                live_course.live_course_slug,
                                              bookId:
                                                live_course.live_course_id,
                                            },
                                          })
                                        "
                                        class="text-dark"
                                      >
                                        <!--   <a   @click.prevent="learnMore()"
                                        class="text-dark">-->
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
                                          style="
                                            background: #ec296b;
                                            padding: 4px 8px;
                                            color: #fff;
                                            border-radius: 2px;
                                            font-size: 10px;
                                          "
                                        >
                                          <b>Grade:</b>
                                          {{
                                            live_course.grade.split(",")[0]
                                          }}-{{
                                            live_course.grade
                                              .split(/[, ]+/)
                                              .pop()
                                          }}
                                        </a>
                                      </li>
                                      <li class="col-sm-6 text-right">
                                        <a
                                          href="#"
                                          class="icons"
                                          style="
                                            background: #48c9b0;
                                            padding: 4px 8px;
                                            color: #fff;
                                            border-radius: 2px;
                                            font-size: 10px;
                                          "
                                        >
                                          <b>Age Group:</b>
                                          {{ live_course.age_group }}
                                        </a>
                                      </li>
                                      <li class="col-sm-6 mt-4">
                                        <a
                                          href="#"
                                          class="icons"
                                          style="
                                            color: #000;
                                            border-radius: 2px;
                                            font-size: 10px;
                                          "
                                        >
                                          <i class="fas fa-clock"></i>
                                          <span
                                            class="newprice text-dark ml-1"
                                            style="font-size: 10px;"
                                          >
                                            {{ live_course.duration }}
                                            Hours
                                          </span>
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
                                                bookId:
                                                  live_course.live_course_id,
                                              },
                                            })
                                          "
                                          class="icons text-center"
                                          style="
                                            background: #007cff;
                                            padding: 4px 20px 4px 20px;
                                            color: #fff;
                                            border-radius: 2px;
                                            font-size: 10px;
                                          "
                                        >
                                          <b>Learn More</b>
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
                                            style="font-size: 14px;"
                                          >
                                            {{ live_course.course_price }}
                                          </span>
                                          <!--<i class="fas fa-clock"></i><span class="text-dark ml-1">Duration</span>
                                          <span class="newprice text-dark ml-1" style="font-size:14px;">{{live_course.duration}} Hours</span>-->

                                          <!--<del class="oldprice text-muted" style="font-size:14px;">58000</del>
                                          <span class="newprice text-dark" style="font-size:14px;">20000</span>-->
                                        </div>

                                        <a
                                          @click="
                                            $router.push({
                                              name: 'LiveCourseDetail',
                                              params: {
                                                liveCourseName:
                                                  live_course.live_course_slug,
                                                bookId:
                                                  live_course.live_course_id,
                                              },
                                            })
                                          "
                                          :class="
                                            'btn btn-info btn-sm ml-auto ' +
                                              [
                                                live_course.purchases_status ==
                                                1
                                                  ? 'btn-primary text-white'
                                                  : 'btn-outline-primary',
                                              ]
                                          "
                                        >
                                          <!--<a
                                   
                                  @click.prevent="learnMore()"
                                    :class="
                                      'btn btn-info btn-sm ml-auto ' +
                                        'btn-outline-primary'"
                                          >-->
                                          {{
                                            live_course.purchases_status == 1 ||
                                            trainer
                                              ? "Purchased"
                                              : "Enroll Now"
                                          }}
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <!--end new card-->
                            <!--end course-->
                          </div>

                          <!--end card testing-->
                          <!--end demo class-->
                        </div>
                        <!--end tab81-->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--assessment-->
              <div class="card p-1 row" id="assessments">
                <div class="col-sm-12 pl-2 pt-2 mb-2">
                  <h3 class="card-title">Assessments</h3>
                </div>
                <div class="col-sm-12 p-2" v-if="assessments.length">
                  <template v-for="(assessment, index) in assessments">
                    <div
                      :key="index"
                      v-if="assessment.score == null && assessment.tot_que != 0"
                      class="col-sm-6 col-xl-4 col-sm-4 d-inline-block"
                    >
                      <div class="card">
                        <a href="#">
                          <img
                            class="card-img-top br-tr-3 br-tl-3"
                            src="/assets/images/project-thumbs/web.svg"
                            alt="Well, I didn't vote for you."
                          />
                        </a>
                        <div class="card-body d-flex flex-column">
                          <h4>{{ assessment.assessment_name }}</h4>
                          <div class="text-muted">
                            <p style="margin-bottom: 4; margin-top: 8px;">
                              Total Questions: {{ assessment.tot_que }}
                            </p>
                            <p style="margin-bottom: 4;">
                              Total Marks : {{ assessment.tot_marks }}
                            </p>
                            <p style="margin-bottom: 0; marigin-top: 4px;">
                              Duration : {{ assessment.duration }} min.
                            </p>
                          </div>
                        </div>
                        <div class="card-body d-flex">
                          <button
                            class="btn btn-info"
                            @click="openModal('instruction-modal')"
                            v-if="role_id == 3"
                          >
                            More
                          </button>
                          <i class="flex-fill"></i>
                          <button
                            class="btn btn-success"
                            v-if="
                              assessment.exam_status == 'true' &&
                                assessment.score == null &&
                                assessment.user_id != null
                            "
                            @click="
                              start_exam(
                                assessment.assessment_id,
                                assessment.assessment_name,
                                assessment.duration
                              )
                            "
                          >
                            Resume
                          </button>
                          <button
                            class="btn btn-success"
                            v-else-if="
                              assessment.exam_status == 'false' &&
                                assessment.score == null &&
                                assessment.user_id == null &&
                                $moment(assessment.date) < $moment(serverTime)
                            "
                            @click="
                              start_exam(
                                assessment.assessment_id,
                                assessment.assessment_name,
                                assessment.duration
                              )
                            "
                          >
                            Start
                          </button>
                          <button
                            class="btn btn-secondary"
                            v-else-if="
                              assessment.exam_status == 'true' &&
                                assessment.score != null &&
                                assessment.user_id != null
                            "
                          >
                            Result will be soon.
                          </button>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
                <div class="col-sm-12 p-2" v-else>
                  <h3>No Assessment scheduled.</h3>
                </div>
              </div>
              <!--end assessments section-->
              <!--this section for projects-->
              <div class="card p-1 row" id="projects">
                <div class="col-sm-12 pl-2 pt-2 mb-2">
                  <h3 class="card-title">Projects</h3>
                </div>
                <div class="col-sm-12 p-2">
                  <template v-for="project in recentProjects">
                    <div
                      :key="project.project_id"
                      class="col-sm-6 col-xl-4 col-sm-4 d-inline-block"
                      v-if="!project.hidden"
                      :style="
                        project.hidden
                          ? 'visibility: hidden'
                          : 'visibility: visible'
                      "
                    >
                      <div class="card">
                        <div
                          v-if="project.type == 'scratch'"
                          class="project-card-img"
                          style="
                            background-image: url(/assets/images/project-thumbs/scratch.png);
                          "
                        >
                          <div
                            class="project-type-tag"
                            style="background-color: #f1c40f;"
                          >
                            {{ project.type }}
                          </div>
                        </div>
                        <div
                          v-else-if="project.type == 'python'"
                          class="project-card-img"
                          style="
                            background-image: url(/assets/images/project-thumbs/python.jpg);
                          "
                        >
                          <div
                            class="project-type-tag"
                            style="background-color: #3498db;"
                          >
                            {{ project.type }}
                          </div>
                        </div>
                        <div
                          v-else
                          class="project-card-img"
                          style="
                            background-image: url(/assets/images/project-thumbs/web.svg);
                          "
                        >
                          <div
                            class="project-type-tag"
                            style="background-color: #e74c3c;"
                          >
                            {{ project.type }}
                          </div>
                        </div>

                        <div class="card-body d-flex flex-column">
                          <h4>{{ project.lenght ? project.name : "" }}</h4>
                          <div class="text-muted">
                            {{ project.description }}
                          </div>
                        </div>
                        <div class="card-footer text-right">
                          <button
                            class="btn btn-success"
                            @click="
                              $router.push({
                                name: 'project-editor',
                                params: { id: project.project_id },
                              })
                            "
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <!--end projects section-->
              <!--this section for quize-->
              <div class="card p-1 row" id="quizzes">
                <div class="col-sm-12 pl-2 pt-2 mb-2">
                  <h3 class="card-title">Quizzes</h3>
                </div>
                <div class="col-sm-12 p-2">
                  <template v-for="(quiz, quiz_index) in quizzes">
                    <div
                      :key="quiz_index"
                      v-if="quiz.attempted_question != quiz.no_of_questions"
                      class="col-sm-6 col-xl-4 col-sm-4 d-inline-block"
                    >
                      <div class="card">
                        <div class="item-card2-img">
                          <img
                            class="card-img-top br-tr-3 br-tl-3"
                            :src="
                              quiz.quiz_img
                                ? '/assets/images/' + quiz.quiz_img
                                : '/assets/images/project-thumbs/web.svg'
                            "
                          />
                          <div class="item-tag" style="top: 15px;">
                            <span
                              class="text-white bg-warning p-1"
                              style="
                                border-radius: 3px;
                                z-index: 9999;
                                position: relative;
                              "
                              :title="quiz.no_of_questions + ' users attempted'"
                            >
                              <i
                                class="fa fa-paper-plane"
                                data-toggle="tooltip"
                                title="fa fa-paper-plane"
                              ></i>
                              {{ quiz.total_attempted }}
                            </span>
                          </div>
                          <div class="item-tag" style="left: 15px;">
                            <span
                              class="text-white bg-primary p-1"
                              style="border-radius: 3px;"
                            >
                              Questions: {{ quiz.no_of_questions }}
                            </span>
                          </div>
                          <div class="item-tag">
                            <span
                              class="text-white bg-primary p-1"
                              style="border-radius: 3px;"
                            >
                              Points: {{ quiz.total_points }}
                            </span>
                          </div>
                        </div>
                        <div class="card-body d-flex flex-column">
                          <div class="item-card2">
                            <div class="item-card2-text mb-3">
                              <h4
                                class="font-weight-semibold text-dark mb-1"
                                v-html="
                                  quiz.quiz_name ? quiz.quiz_name : 'test'
                                "
                              ></h4>
                              <div
                                class="mb-1 text-muted"
                                style="font-size: 12px;"
                              >
                                By:
                                <i class="icon icon-user mr-1"></i>
                                <span
                                  class
                                  style="font-size: 12px;"
                                  v-html="
                                    quiz.length
                                      ? quiz.name
                                        ? quiz.name
                                        : 'Codevidhya'
                                      : 'Codevidhya'
                                  "
                                ></span>
                              </div>
                              <p
                                style="font-size: 16px; color: #5e748e;"
                                v-if="quiz.quiz_desc"
                                v-html="
                                  quiz.quiz_desc.length >= 30
                                    ? quiz.quiz_desc.substring(0, 30) + '...'
                                    : quiz.quiz_desc
                                "
                              ></p>
                            </div>
                            <div>
                              <span class="rating-stars d-inline-block mr-2">
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
                                      (quiz.rating ? quiz.rating * 20 : 0) +
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
                              </span>
                              <!--<span
                                    class="mx-1 d-inline-block"
                                    style="cursor:pointer"
                                    @click="quiz_reviews(quiz.quiz_id)"
                                    ><u>View all</u>
                              </span>-->
                            </div>
                          </div>
                        </div>
                        <div class="card-footer d-flex">
                          <i class="flex-fill"></i>
                          <button
                            class="btn btn-success"
                            @click="
                              router.push(
                                '/quizzes/quiz-instruction?id=' + quiz.quiz_id
                              )
                            "
                          >
                            Learn More
                          </button>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <!--here notification-->
              <!--end notification-->
              <!--end quizzes section-->
            </div>
            <!--end courses with curriculum-->
          </div>
        </div>
      </div>
    </section>
    <!--live class modal-->
    <div
      class="modal fade"
      id="LiveClassModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Live Classes</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label text-dark">participant ID: 115648</label>
            </div>
            <div class="form-group">
              <label class="form-label text-dark">password: 262334</label>
            </div>
            <div class="form-group">
              <label>
                <a style="cursor: pointer;" @click.stop.prevent="clipBoardCopy">
                  <u>Copy URL</u>
                </a>
                to share with students
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="InvitesFriends"
            >
              Invites
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--end class modal-->
    <!--/User Dashboard-->
    <!-- iNSTRUCTION Modal details -->
    <div id="instruction-modal" class="cv-modal normal">
      <div style="max-width: 3000px; width: 90%; height: 90%;">
        <div class="row bg-secondary p-2 text-white mb-2">
          <div class="col-sm-12">
            <h4>Assessment Instructions</h4>
          </div>
        </div>
        <div class="cv-input-group p-2" style="overflow: auto;">
          <p class="mb-2" style="color: #000000;">
            <i
              class="fas fa-dot-circle"
              aria-hidden="true"
              style="color: #08ca73;"
            ></i>
            &nbsp;
            <strong>Countdown Timer:</strong>
            The countdown timer at the top right of screen will display the
            remaining time available for you to complete the examination. when
            the timer reaches zero, the examination will end automatically. You
            need not terminate the examination or submit your paper.
          </p>

          <p class="mb-2" style="color: #000000;">
            <i class="fas fa-dot-circle" style="color: #08ca73;"></i>
            &nbsp; Note that your answer for the current question will not be
            saved, if you navigate to another question directly by clicking on a
            question number without saving the answer to the previous question.
          </p>
          <p class="mb-2" style="color: #000000;">
            <i class="fas fa-dot-circle" style="color: #08ca73;"></i>
            &nbsp;
            <strong>Answering a Question :</strong>
          </p>
          <p style="color: #000000;">
            Procedure for answering a multiple choice question:
          </p>
          <p class="pl-4"></p>
          <ul class="p-2" type="none">
            <li>
              <i class="fas fa-dot-circle text-danger"></i>
              <b>
                Choose one answer from the 4 options (A,B,C,D) given below the
                question, click on the bubble placed before the chosen option.
              </b>
            </li>
            <li>
              <i class="fas fa-dot-circle text-danger"></i>
              <b>
                To deselect your chosen answer, click on the bubble of the
                chosen option again or click on the Clear Response button.
              </b>
            </li>
            <li>
              <i class="fas fa-dot-circle text-danger"></i>
              <b>
                To change your chosen answer. click on the bubble of another
                option.
              </b>
            </li>
            <li>
              <i class="fas fa-dot-circle text-danger"></i>
              <b>To save your answer, you MUST click on the</b>
              <strong>Save & Next</strong>
            </li>
          </ul>

          <p class="mb-2" style="color: #000000;">
            <i class="fas fa-dot-circle text-success"></i>
            &nbsp; Sections of the question paper are displayed on the top bar
            of the screen. Questions in this section can be viewed by clicking
            on the name of the section.
          </p>
          <p class="mb-2" style="color: #000000;">
            <i class="fas fa-dot-circle text-success"></i>
            &nbsp; After clicking the
            <strong>Save & Next</strong>
            for the last question in a section, you will automatically be taken
            to the first question of the next section.
          </p>
          <p class="mb-2" style="color: #000000;">
            <i class="fas fa-dot-circle text-success"></i>
            &nbsp;
            <strong>Read the following instructions carefully:</strong>
          </p>
          <p class="pl-4"></p>
          <ul type="none">
            <li>
              <i class="fas fa-dot-circle text-danger"></i>
              <b>This test comprises multiple-choice questions (MCQs).</b>
            </li>
            <li>
              <i class="fas fa-dot-circle text-danger"></i>
              <b>
                You are advised not to close the browser window before
                submitting the test.
              </b>
            </li>
            <li>
              <i class="fas fa-dot-circle text-danger"></i>
              <b>
                In case the test does not load completely or becomes
                un-responsive, click on browser's refresh button to reload.
              </b>
            </li>
            <li>
              <i class="fas fa-dot-circle" style="color: #ff6633;"></i>
              <b>
                You can write this test only once, so for best results do not
                try to guess answers.
              </b>
            </li>
            <li>
              <i class="fas fa-dot-circle" style="color: #ff6633;"></i>
              <b>No negetive marking for wrong answers.</b>
            </li>
          </ul>
          <br />
          <p class="mb-2" style="color: #000000;">
            <i class="fas fa-dot-circle" style="color: #08ca73;"></i>
            &nbsp;
            <strong>Declaration :</strong>
          </p>
          <p class="mb-2 pt-2" style="color: #000000;">
            I have read all the instructions carefully and have understood them.
            I agree not to cheat or use unfair means in this examination. I
            understand that using unfair means of any sort for my own or someone
            else's advantage will lead to my immediate disqualification. The
            decision of
            <strong>Codevidhya</strong>
            will be final in these matters and cannot be appealed.
          </p>
        </div>
        <div class="text-center">
          <button
            class="btn btn-info"
            onclick="hideModal('instruction-modal');"
          >
            Close
          </button>
        </div>
      </div>
    </div>
    <!--end instruction-->
    <!-- <Footer />-->
    <Loader v-if="processing" />
  </div>
</template>

<script>
import axios from "axios";
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/dashboard/HeaderContent.vue";
import SideNav from "@/components/dashboard/SideNavProfileTeacher.vue";
import Footer from "@/components/footer/Footer.vue";
import showTeacherProfile from "@/views/Profile/ShowTeacherProfile.vue";
import Notification from "@/views/Profile/Notifications.vue";
import ProfileSetting from "@/views/Profile/ProfileSetting.vue";
import AccountSetting from "@/views/Profile/AccountSetting.vue";
import TrainerTimeSchedular from "@/views/LiveCourseModule/TrainerTimeSchedular.vue";
import Loader from "@/components/widgets/BlockingLoader.vue";

export default {
  name: "teacherdashboard",
  props: ["openProfile", "OpenNotif", "openOtherCourse"],
  components: {
    Header,
    HeaderContent,
    SideNav,
    showTeacherProfile,
    Notification,
    ProfileSetting,
    AccountSetting,
    Loader,

    TrainerTimeSchedular,
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
      p_curriculum: "",
      other_course_curriculam: "",
      user_img: "",
      profile: 0,
      showProfile: 0,
      quote: "",
      notif: 0,
      trainerSchedular: 0,
      profilePic: "",
      st_prof_set: 0,
      promot_st: 0,
      account_setting: 0,
      profilePicData: new FormData(),
      selectedLessonPlanGrade: 0,
      lessonplans: 0,
      cls_grp: [],
      curriculum: [],
      programId: 1,
      url: null,
      grade: 1,
      grades: [],
      assignClasses: [],
      liveCourse: [],
      live_courses: [],
      currentDate: new Date().toISOString().slice(0, 10),
      trainer: "",
      launchBreaks: [],
      processing: false,
      classSlots: [],
      SelectedKey: 0,
      followUpDetails: [],
      lastClassSlots: [],
      userTimeSlotsFeedback: [],
      feedbacks: [],
      viewCourses: 0,
      cancleRegionId: "",
      TabularTime: [],
      suggestedCourseSelection: [],
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
          this.trainer = this.$store.getters.getAuthData.trainer;

          this.getServerTime();
          this.cls_loop();
          if (this.$refs.sidnav)
            this.$refs.sidenav.updateuserProfile("mycourses", $event);
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
    function editFunction() {
      cvNotify("Coming Soon", "Warning");
    }
  },
  methods: {
    submitFeedbackMessage(assigned_id, key) {
      let feedbackDes = $("#feed_desc" + key).val();
      let feedbackStatus = $("#user-feedback" + key).val();
      let product_id;
      if (feedbackStatus == 4) {
        product_id = $("#user-products" + key).val();
        if (!product_id || product_id == 0) {
          cvNotify("Please wait trainer suggestion", "warning");
          return false;
        }
      } else {
        product_id = 0;
      }
      axios
        .post("/api/liveCourse/saveMyTraineeFeedback", {
          assigned_id: assigned_id,
          feed_desc: feedbackDes,
          feedbackStatus: feedbackStatus,
          product_id: product_id,
          user_id: this.userId,
        })
        .then(async (res) => {
          cvNotify("Successfully Updated");
          $(".feedbackSubmits").removeAttr("disabled");
          $(".feedbacks-descs").removeAttr("disabled");
          $(".users-feedbacks").removeAttr("disabled");
          this.$refs.trainerscheduletime.filterAccordingSubject();
          hideModal("feedbackTest");
        });
    },
    async OpenFinalStatus(...data) {
      //console.log(data);
      let req_id = data[0].reqId;
      let CourseIds = data[0].CourseIds;
      this.processing = true;
      let vm = this;
      axios
        .post("/api/liveCourse/getSuggestedCourses", {
          courses_ids: CourseIds,
        })
        .then(async (res) => {
          this.suggestedCourseSelection = res.data;
          await axios
            .post("/api/liveCourse/getSalesPersonFeedbacks")
            .then(async (res) => {
              this.feedbacks = res.data;
              await axios
                .post("/api/liveCourse/getParticularRequestFinalStep", {
                  user_id: vm.userId,
                  req_id: req_id,
                })
                .then(async (res) => {
                  vm.userTimeSlotsFeedback = res.data;
                  vm.processing = false;
                  if (
                    vm.userTimeSlotsFeedback &&
                    vm.userTimeSlotsFeedback[0].feedback_status
                  ) {
                    if (vm.userTimeSlotsFeedback[0].feedback_status_id == 4) {
                      vm.viewCourses = 1;
                    } else {
                      vm.viewCourses = 0;
                    }
                    await $(".feedbackSubmits").attr("disabled", "disabled");
                    await $(".feedbacks-descs").attr("disabled", "disabled");
                    await $(".users-feedbacks").attr("disabled", "disabled");

                    showModal("feedbackTest");
                  } else {
                    $(".feedbackSubmits").removeAttr("disabled");
                    $(".feedbacks-descs").removeAttr("disabled");
                    $(".users-feedbacks").removeAttr("disabled");

                    showModal("feedbackTest");
                  }
                });
            });
        });
    },
    handleCloseLearnAtHomeClicked() {
      hideModal("demo-trainee-information");
    },
    ViewCoursesEnable(key) {
      let CourseOption = $("#user-feedback" + key).val();
      if (CourseOption == 4) {
        this.viewCourses = 1;
      } else {
        this.viewCourses = 0;
      }
    },
    ViewCancleRegion(...CancleRegion) {
      this.cancleRegionId = "";

      let region = CancleRegion[0].region;
      let action = CancleRegion[0].action;
      this.cancleRegionId = CancleRegion[0].assigned_id;

      $("#cancle-session-region").val(region);
      if (action == "hide") {
        $("#cancle-session-region").attr("disabled", "disabled");
        $("#cancle-region-button").attr("disabled", "disabled");
      } else {
        $("#cancle-session-region").removeAttr("disabled");
        $("#cancle-region-button").removeAttr("disabled");
      }
      showModal("CancleRegion");
    },
    SubmitCancleRegion() {
      let regionDetail = $("#cancle-session-region").val();
      axios
        .post("/api/liveCourse/postCancleRegion", {
          assigned_id: this.cancleRegionId,
          detail: regionDetail,
          user_id: this.userId,
        })
        .then((res) => {
          cvNotify("Successfully Updated");
          $(".feedbackSubmits").removeAttr("disabled");
          $(".feedbacks-descs").removeAttr("disabled");
          $(".users-feedbacks").removeAttr("disabled");
          this.$refs.trainerscheduletime.filterAccordingSubject();
          hideModal("CancleRegion");
        });
    },
    OpenFollowupModal(reqId) {
      axios
        .post("/api/liveCourse/getUserFolloupDetails", { req_id: reqId })
        .then((res) => {
          this.followUpDetails = res.data;
          if (this.followUpDetails.length)
            showModal("demo-trainee-information");
          else cvNotify("No Follow up Detail available", "warning");
        });
    },
    selectAllSlots() {
      let selectData = $(".multiSlotSelect")[0].checked;
      let dataArray = $(".selectSlots");
      if (selectData) {
        for (let i = 0; i < dataArray.length; i++)
          $(".selectSlots")[i].checked = true;
      } else {
        for (let i = 0; i < dataArray.length; i++)
          $(".selectSlots")[i].checked = false;
      }
    },
    changeCalender() {
      let start_exam = $("#schedule-s-time").val();
      let selectData = $(".multiSlotSelect")[0].checked;
      if (selectData) $(".multiSlotSelect")[0].checked = false;

      let end_time = "23:59:00";
      $("#schedule-e-time").val(end_time);

      this.openNewTimeSlot1();
    },
    openNewTimeSlot1() {
      var star_time = $("#schedule-s-time").val();
      var last_time = $("#schedule-e-time").val();
      let first_h = star_time.split(":");
      let last_h = last_time.split(":");
      let last_date;
      if (parseInt(first_h) > parseInt(last_h)) {
        let last = new Date(this.currentDate);
        last_date = last.setDate(last.getDate() + 1);
        last_date = new Date(last_date).toISOString().slice(0, 10);
      } else {
        last_date = this.currentDate;
      }
      var stat_dtime = new Date(this.currentDate + " " + star_time);
      var ltat_dtime = new Date(last_date + " " + last_time);
      var diff = ltat_dtime - stat_dtime;
      var resultInMinutes = Math.round(diff / 60000);
      var lunch_break = $("#lunch-break").val();
      let duration = $("#duration").val();
      var index = 1,
        classes = 1,
        break_time,
        break_time_e,
        classess,
        classess_e;
      let timeInc = star_time,
        timeInb = star_time,
        timeInd;
           $(".multiSlotSelect")[0].checked =false;
          let dataArray = $(".selectSlots");
          for (let i = 0; i < dataArray.length; i++)
          $(".selectSlots")[i].checked = false;
      

    /*  $("#lunch-break")
        .children()
        .remove()
        .end();
      $("#sloted-classses")
        .children()
        .remove()
        .end();*/
        this.TabularTime =[];
      for (
        var time = 0, breakT = duration;
        time < resultInMinutes;
        time += 60
      ) {
        if (time > resultInMinutes) {
          time = resultInMinutes;
        }

        break_time = new Date(this.currentDate + " " + star_time);
        classess_e = new Date(this.currentDate + " " + star_time);
        let new_time = parseInt(time) + parseInt(duration);
        classess_e.setMinutes(classess_e.getMinutes() + new_time);
        break_time.setMinutes(break_time.getMinutes() + time);
        timeInc = break_time.toLocaleTimeString();
        classess = new Date(this.currentDate + " " + star_time);
        break_time_e = new Date(this.currentDate + " " + star_time);

        if (time >= duration) {
          let new_timee = parseInt(time);
          classess.setMinutes(classess.getMinutes() + new_timee);
          break_time_e.setMinutes(break_time_e.getMinutes() + (new_timee + 60));
          timeInd = break_time_e.toLocaleTimeString();
          timeInb = classess.toLocaleTimeString();
          /*this.launchBreaks["break" + index] = timeInb + "-" + timeInd;
          $("#lunch-break").append(
            $("<option>", {
              value: timeInb,
              text: timeInb + "-" + timeInd,
            })
          );*/
        }

        var lunch_time = $("#lunch-break option:first").val(); //$("#target option:first").val()

      /*  if (lunch_time == timeInb) {
          var newRowContent = `<tr class="bg-warning text-white"><td>${index}</td><td colspan="5">Lunch Break(${$(
            "#lunch-break :selected"
          ).text()})</td></td>`;
          $("#sloted-classses").append(newRowContent);
        } else {
          var newRowContent = `<tr><td>${index}</td><td><input class ="selectSlots" id='${index}' style='width:15%;' type='checkbox'/></td><td>Class ${classes++}</td><td>${timeInc}</td><td>${classess_e.toLocaleTimeString()}</td><td style="display:none">No Break</td></tr>`;
          $("#sloted-classses").append(newRowContent);
        }*/
         this.TabularTime.push({
          id: index,
          className: classes,
          stime: timeInc,
          endTime: classess_e.toLocaleTimeString(),
        });
        classes++;
        this.classSlots[index] = timeInc;
        this.lastClassSlots[index] = classess_e.toLocaleTimeString();

        index++;
      }
    },
    openNewTimeSlot() {
      showModal("AddNewTimeSlot");
      var datas = this.$refs.trainerscheduletime.userTimeSlots;

      this.currentDate = new Date();
      this.currentDate.setTime(this.currentDate.getTime() + 330 * 60 * 1000);
      this.currentDate = this.currentDate.toISOString().substring(0, 10);

      if (datas && datas.length) {
        let dates = datas[datas.length - 1].date_s_time_slot;
        dates = new Date(dates);
        dates.setDate(dates.getDate() + 1);
        if (new Date() > dates) {
          dates = new Date();
        }
        dates.setTime(dates.getTime() + 330 * 60 * 1000);
        var minDate = dates.toISOString().substring(0, 10);
        $("#schedule-time").prop("min", minDate);
        this.currentDate = minDate;
      } else {
        $("#schedule-time").prop("min", this.currentDate);
      }

      var star_time = $("#schedule-s-time").val();
      var last_time = $("#schedule-e-time").val();
      var stat_dtime = new Date(this.currentDate + " " + star_time);
      var ltat_dtime = new Date(this.currentDate + " " + last_time);
      var diff = ltat_dtime - stat_dtime;
      var resultInMinutes = Math.round(diff / 60000);
      var lunch_break = $("#lunch-break").val();
      let duration = $("#duration").val();
      var index = 1,
        classes = 1,
        break_time,
        break_time_e,
        classess,
        classess_e;
      let timeInc = star_time,
        timeInb = star_time,
        timeInd;
         $(".multiSlotSelect")[0].checked =false;
          let dataArray = $(".selectSlots");
          for (let i = 0; i < dataArray.length; i++)
          $(".selectSlots")[i].checked = false;
      

      /* $("#lunch-break")
        .children()
        .remove()
        .end();
      $("#sloted-classses")
        .children()
        .remove()
        .end();*/

    this.TabularTime =[];
      for (
        var time = 0, breakT = duration;
        time < resultInMinutes;
        time += 60
      ) {
        if (time > resultInMinutes) {
          time = resultInMinutes;
        }
        break_time = new Date(this.currentDate + " " + star_time);
        classess_e = new Date(this.currentDate + " " + star_time);
        let new_time = parseInt(time) + parseInt(duration);
        classess_e.setMinutes(classess_e.getMinutes() + new_time);
        break_time.setMinutes(break_time.getMinutes() + time);
        timeInc = break_time.toLocaleTimeString();
        classess = new Date(this.currentDate + " " + star_time);
        break_time_e = new Date(this.currentDate + " " + star_time);

        if (time >= duration) {
          let new_timee = parseInt(time);
          classess.setMinutes(classess.getMinutes() + new_timee);
          break_time_e.setMinutes(break_time_e.getMinutes() + (new_timee + 60));
          timeInd = break_time_e.toLocaleTimeString();
          timeInb = classess.toLocaleTimeString();
          /*this.launchBreaks["break" + index] = timeInb + "-" + timeInd;
          $("#lunch-break").append(
            $("<option>", {
              value: timeInb,
              text: timeInb + "-" + timeInd,
            })
          );*/
        }

        var lunch_time = $("#lunch-break option:first").val(); //$("#target option:first").val()

        /*if (lunch_time == timeInb) {
          var newRowContent = `<tr class="bg-warning text-white"><td>${index}</td><td colspan="5">Lunch Break(${$(
            "#lunch-break :selected"
          ).text()})</td></td>`;
          $("#sloted-classses").append(newRowContent);
        } else {
          var newRowContent = `<tr><td>${index}</td><td><input class ="selectSlots" id='${index}' style='width:15%;' type='checkbox'/></td><td>Class ${classes++}</td><td>${timeInc}</td><td>${classess_e.toLocaleTimeString()}</td><td style="display:none">No Break</td></tr>`;
          $("#sloted-classses").append(newRowContent);
        }*/
        this.TabularTime.push({
          id: index,
          className: classes,
          stime: timeInc,
          endTime: classess_e.toLocaleTimeString(),
        });
        classes++;
        this.classSlots[index] = timeInc;
        this.lastClassSlots[index] = classess_e.toLocaleTimeString();
        index++;
      }
     
    },

    async submit_schedule_time() {
      var lunch_time = $("#lunch-break").val();
      let selecteddata = $(".selectSlots:checkbox:checked");
      let pushdata = new Array();
      if (selecteddata.length == 0) {
        cvNotify("Select Your Slot", "warning");
      } else {
        for (let i = 0; i < selecteddata.length; i++) {
          pushdata.push(selecteddata[i].id);
        }
        let newClassSlots = [],
          newlastClassSlots = [];
        await pushdata.forEach((item) => {
          newClassSlots.push(this.classSlots[item]);
          if (this.lastClassSlots[item] == "12:00:00 AM")
            newlastClassSlots.push("11:59:59 PM");
          else newlastClassSlots.push(this.lastClassSlots[item]);
        });

        this.classSlots = this.classSlots.filter((x) => x !== "");
        this.classSlots = Array.from(new Set(this.classSlots));
        this.lastClassSlots = newClassSlots.filter((x) => x !== "");
        this.lastClassSlots = Array.from(new Set(this.lastClassSlots));
        var findIndex = this.lastClassSlots.findIndex((x) => x == lunch_time);
        let filterArray = this.classSlots.filter(
          (x, index) => index !== findIndex + 1
        );
        let lfilterArray = this.lastClassSlots.filter(
          (x, index) => index !== findIndex + 1
        );

        let duration = $("#duration").val();
        axios
          .post("/api/liveCourse/insertDataTrainerSchedular", {
            user_id: this.userId,
            lunchbreakIndex: findIndex,
            filterArray: newClassSlots,
            lfilterArray: newlastClassSlots,
            currentDate: this.currentDate,
            duration: duration,
          })
          .then((res) => {
            this.$refs.trainerscheduletime.getBasicDeatils(this.userId);
            hideModal("AddNewTimeSlot");
          });
      }
    },
    /*  changeLunchBreak() {
      var lunch_time = $("#lunch-break").val();
      var findIndex = this.lastClassSlots.findIndex((x) => x == lunch_time);
      $("#sloted-classses")
        .children()
        .remove()
        .end();
      let classess = 1;
      if (findIndex != -1) {
        this.lastClassSlots.forEach((item, index) => {
          if (index == findIndex + 1) {
            var newRowContent = `<tr class="bg-warning text-white"><td>${index}</td><td colspan="5">Lunch Break(${$(
              "#lunch-break :selected"
            ).text()})</td></td>`;
          } else {
            var newRowContent = `<tr><td>${index}</td><td><input class ="selectSlots" id='${index}' style='width:15%;' type='checkbox' /></td><td>Class ${classess++}</td><td>${
              this.classSlots[index]
            }</td><td>${item}</td><td style="display:none">0 Minutes</td></tr>`;
          }
          $("#sloted-classses").append(newRowContent);
        });
      }
    },*/
    clipBoardCopy() {
      let testingCodeToCopy = document.createElement("INPUT");
      testingCodeToCopy.setAttribute(
        "value",
        "https://us04web.zoom.us/j/6323847695?pwd=dTcxdmdZOUt2SzZKZ2NqNjc2K3pLZz09"
      );
      testingCodeToCopy.setAttribute("type", "text");
      testingCodeToCopy.select();

      try {
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        cvNotify("URL copied successful");
      } catch (err) {
        cvNotify("Oops, unable to copy");
      }

      /* unselect the range */
      testingCodeToCopy.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();
    },
    InvitesFriends() {
      $("#LiveClassModal").modal("hide");
      window.open(
        "https://us04web.zoom.us/j/6323847695?pwd=dTcxdmdZOUt2SzZKZ2NqNjc2K3pLZz09",
        "liveclass",
        'toolbar="no", location="no", directories="no", status="no", menubar="no", scrollbars="no", resizable="yes", copyhistory="no",fullscreen="yes", top="top", left="left"'
      );
    },
    gradeChange() {
      this.grade = $("#grade").val();
    },
    callNoti() {
      this.$refs.header.totalUnreadNoti(this.userId);
    },
    changeSidNavData() {
      if (this.$refs.sidenav) this.$refs.sidenav.getProfileInformation();
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
    accountSetting() {
      this.account_setting = 1;
    },
    myCurrentProfile() {
      this.$refs.sidenav.moveprofile("profile");
    },
    myNotification() {
      this.$refs.sidenav.moveNoti("notification");
    },
    updateProfileInfo: function() {
      this.$http
        .post("/api/profile/updateUserProfileInfo", {
          editProfile: this.editProfile,
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
              if (this.$refs.sidenav)
                this.$refs.sidenav.getProfileInformation();
              if (this.$refs.TeacherProfile)
                this.$refs.TeacherProfile.getServerTime();
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
          positiveButtonClass: "negative",
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
    updateStudentProfile(profile_name, event) {
      if (profile_name == "profile_setting") {
        if (this.$refs.stprofileSetting) {
          this.$refs.stprofileSetting.prof_setting = 0;
        }
        this.profile = 0;
        this.promot_st = 0;
        this.notif = 0;
        this.account_setting = 0;
        this.trainerSchedular = 0;
        this.st_prof_set = 1;
      } else if (profile_name == "promote_students") {
        this.promot_st = 1;
        this.profile = 0;
        this.notif = 0;
        this.account_setting = 0;
        this.trainerSchedular = 0;
        this.st_prof_set = 0;
      } else {
        window, cvNotify("This feature will be available soon", "warning");
      }
    },
    updateDashboard(args, event) {
      this.profile = 0;
      this.notif = 0;
      this.st_prof_set = 0;
      this.account_setting = 0;
      this.trainerSchedular = 0;
      this.promot_st = 0;
      $(".item1-links > a").removeClass("active");
      $(event.toElement).addClass("active");
      //console.log(args);
      let container = this.$el.querySelector("#" + args);
      if (container) container.scrollIntoView(true);
    },
    openTrainerSchedular(openEdit) {
      this.trainerSchedular = 1;
      this.notif = 0;
      this.profile = 0;
      this.st_prof_set = 0;
      this.account_setting = 0;
    },

    OpenNoti(openEdit) {
      this.trainerSchedular = 0;
      this.notif = 1;
      this.profile = 0;
      this.st_prof_set = 0;
      this.account_setting = 0;
      // this.$refs.notific.noti = 1;
    },
    updateEditAgaingFunction(updateProfile) {
      this.profile = 1;
      this.notif = 0;
      this.st_prof_set = 0;
      this.account_setting = 0;
      this.trainerSchedular = 0;
      // this.$refs.userProfile.edit =0;
    },
    openModal: function(modalId) {
      $("#" + modalId + " > div").removeClass("visible");
      //showModal($("#" + modalId));
    },

    getServerTime: function() {
      this.$http.post("/api/user/getServerTime").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.serverTime = res.body.serverTime;
          this.getProfileInformation();
          this.getLiveCourses(this.userId);
          this.lmscont(this.userId);
          //this.getRandomImgForQuote();
          this.getTeacherGrades(this.userId);
          this.load_assessments();
          this.getAllQuizzess(this.userId);
          this.getRecentProjects();
        }
      });
    },
    getTeacherGrades: function(userId) {
      let vm = this;
      axios
        .post("/api/profile/getTeacherGrades", { user_id: userId })
        .then((res) => {
          vm.grades = res.data;
          if (!vm.grades.length || vm.grades[0].grades == "") {
            vm.getSchoolCurriculum(vm.userId);
          } else {
            vm.grades = vm.grades[0].grades
              ? vm.grades[0].grades.split(",")
              : "";
            vm.grade = vm.grades[0];
          }
        });
    },
    getSchoolCurriculum: function(userId) {
      let vm = this;
      axios
        .post("/api/profile/getSchoolGrades", { user_id: userId })
        .then((res) => {
          vm.assignClasses = res.data;
          vm.grade = vm.assignClasses[0].cls_id;
        });
    },
    getProfileInformation: function() {
      let vm = this;
      axios
        .post("/api/profile/getUserInformation", {
          user_id: vm.userId,
          role_id: vm.role_id,
        })
        .then((res) => {
          if (!res.data.length) {
            vm.$router.push("/login");
          } else {
            vm.userProfile = res.data;
          }
        });
    },
    getRandomImgForQuote: function() {
      /*axios.post("/api/user/getrandomfile").then(res => {
        this.quote = res.data;
      });*/
    },
    getLiveCourses(userId) {
      let vm = this;
      axios
        .post("api/liveCourse/getUserLiveCourse", { user_id: userId })
        .then((data) => {
          vm.live_courses = data.data;
        });
    },
    lmscont(userId) {
      /*dashboard user cart*/
      this.$http
        .post("/api/user/DisplayDashboardLmsActivity", {
          user_id: userId,
        })
        .then(function(res) {
          this.lms_user_books = res.data;
          this.other_course_curriculam = this.lms_user_books.findIndex(
            (x) => x.sch_course === 1 && x.other_courses === 1
          );
          this.sch_curriculm = this.lms_user_books.findIndex(
            (x) => x.sch_course === 1
          );
          this.p_curriculum = this.lms_user_books.findIndex(
            (x) => x.purchases_status === 1
          );
          for (var i = 0; i < this.lms_user_books.length; i++) {
            this.unlockedCourses[this.lms_user_books[i].book_id] = false;
            if (this.userId == 0) {
              this.unlockedCourses[this.lms_books[i].book_id] = false;
            } else {
              //if (this.sch_id == 1) {
              // Independent user
              if (this.lms_user_books[i].purchases_status) {
                this.unlockedCourses[this.lms_user_books[i].book_id] = true;
              }
              /*} else if (this.sch_id != 1) {
                  // School student
                  if (this.isCourseForMyGrade(this.lms_user_books[i].slug)) {
                    this.unlockedCourses[this.lms_user_books[i].book_id] = true;
                  } else {
                    if (this.lms_user_books[i].purchases_status) {
                      this.unlockedCourses[
                        this.lms_user_books[i].book_id
                      ] = true;
                    }
                  }
                }*/
            }
          }
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
        name: "BooksTopics",
        params: { curName: bookSlug, bookId: ec, book_per: book_per },
      });
      //this.$router.push({name:'BooksTopics', params:{curName:bookName}});
    },
    notify_for_future1: function(e) {
      notify("Will be available soon!", "warning");
      return false;
    },
    load_assessments: function() {
      var cls_id;
      if (this.role_id == 2) {
        cls_id = 0;
      } else {
        cls_id = this.cls_id;
      }
      this.$http
        .post("/api/user/assessmentForUsers", {
          cls_id: cls_id,
          sch_id: this.sch_id,
          user_id: this.user_id,
          role_id: this.role_id,
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.assessments = [];
            var assessments = res.body.data;
            for (var i = 0; i < assessments.length; i++) {
              var teacher_grades;
              var assessment_grades;
              assessment_grades = assessments[i].assessment_grades
                ? assessments[i].assessment_grades.split(",")
                : "";
              teacher_grades = assessments[i].teacher_grades
                ? assessments[i].teacher_grades.split(",")
                : "";

              var teacher_grades =
                teacher_grades && teacher_grades.length
                  ? assessment_grades.filter((n) => teacher_grades.includes(n))
                  : "";

              if (
                teacher_grades.length &&
                assessments[i].price == 0 &&
                assessments[i].date &&
                assessments[i].used_for == 0 &&
                assessments[i].status == 1 &&
                assessments[i].score == null
              ) {
                this.assessments.push(assessments[i]);
              }

              if (
                assessments[i].price == 0 &&
                assessments[i].date &&
                assessments[i].used_for == 1 &&
                assessments[i].status == 1 &&
                assessments[i].score == null
              ) {
                this.assessments.push(assessments[i]);
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
          assessment_id: asmnt_id,
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            var det = btoa(asmnt_id + "," + asmnt_name);
            this.$router.push({
              path: "/assessments/assessment-exam",
              query: { assessment: det },
            });
          }
        });

      var i;
      var j;
    },
    getAllQuizzess: function(userId) {
      this.$http
        .post("/api/user/display_all_sub_quizzes", { user_id: userId })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            this.quizzes = res.body.data;
          }
        });
      this.$http
        .post("/api/user/display_all_school_sub_quizzess", { user_id: userId })
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
                hidden: "hidden",
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
    },
    /***Download pdf functions */
    down_bridge: function() {
      var grade = document.getElementById("grade-select-bridge").value;

      if (grade != 0) {
        var link = document.createElement("a");
        link.download = "grade_" + grade + "_bridge_course";
        link.href =
          "/dynamic/cv_resources/bridgeCourse/grade_" + grade + ".pdf";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        //delete link;
      }
    },
    down_lesson_plan: function() {
      var grade = document.getElementById("grade-select_lessonplan_grade")
        .value;
      var lesson_plan = document.getElementById("grade-lesson-plan").value;
      if (grade != 0 && lesson_plan != 0) {
        var link = document.createElement("a");
        link.download = "Grade " + grade + " Lesson Plan " + lesson_plan;
        link.href =
          "/dynamic/cv_resources/lessonPlans/grade" +
          grade +
          "/grade_" +
          grade +
          "_lesson_plan_" +
          lesson_plan +
          ".pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    down_que_bank: function() {
      var grade = document.getElementById("grade-select_que_bank").value;
      if (grade != 0) {
        var link = document.createElement("a");
        link.download = "Question Bank Grade " + grade;
        link.href =
          "/dynamic/cv_resources/question_bank/question_bank_grade_" +
          grade +
          ".pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // delete link;
      }
      var ans_key = document.getElementById("grade-select_que_bank_answer_key")
        .value;

      if (ans_key != 0) {
        var link = document.createElement("a");
        link.download = "Question Bank Answer Key Grade " + ans_key;
        link.href =
          "/dynamic/cv_resources/question_bank/question_bank_answer_key_grade_" +
          ans_key +
          ".pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    down: function() {
      var grade = document.getElementById("grade-select").value;
      if (grade != 0) {
        var link = document.createElement("a");
        link.download = "grade_" + grade + "_answer_key";
        link.href =
          "/dynamic/cv_resources/answer_key/answer/grade_" + grade + ".pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // delete link;
      }
    },
    /***End Download Functions */
  },
  updated() {
    $(".selectSlots").change((event) => {
      let dataArray = $("." + $(event.currentTarget)[0].className);
      for (let i = 0; i < dataArray.length; i++) {
        if (!$(dataArray[i])[0].checked) {
          $(".multiSlotSelect")[0].checked = false;
          break;
        }
      }
    });
  },
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
<style lang="scss">
#teacher-dashboard-root {
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
.teacher-view-dashboard-content {
  position: fixed;
  margin-left: 25%;
  height: 85%;
  width: 100%;
  margin-top: 0px;
}

@media only screen and (max-width: 992px) {
  .teacher-view-dashboard-content {
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
