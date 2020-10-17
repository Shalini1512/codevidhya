<template>
  <div id="student-dashboard-root">
    <Header
      ref="header"
      @OpenProfileCurrent="myCurrentProfile"
      @openMyUnnreadNotification="myNotification"
    />
    <!--modal for welcome notifcation-->
    <div id="learn-at-home-modal" class="cv-modal medium">
      <div>
        <h3 class="text-center">
          {{
            notificationvideo
              ? notificationvideo.length
                ? notificationvideo[0].title
                : ""
              : ""
          }}
        </h3>
        <video
          v-if="
            notificationvideo
              ? notificationvideo.length
                ? true
                : false
              : false
          "
          vspace="0"
          hspace="0"
          controls="controls"
          controlslist="nodownload"
          id="video-noti"
        >
          <source
            :src="
              '/resources/notification_video/' + notificationvideo[0].file_name
            "
            type="video/mp4"
          />
        </video>
        <p>
          {{
            notificationvideo
              ? notificationvideo.length
                ? notificationvideo[0].message
                : ""
              : ""
          }}
        </p>

        <div id="footer" class="d-flex flex-row">
          <div
            class="form-check"
            v-if="
              notificationvideo
                ? notificationvideo.length
                  ? true
                  : false
                : false
            "
            vspace="0"
          >
            <input
              type="checkbox"
              class="form-check-input"
              id="exampleCheck1"
            />
            <label
              class="form-check-label"
              for="exampleCheck1"
              style="height:38px;line-height:42px"
              @click="readNoti(notificationvideo[0].noti_id)"
              >Don't Show me this Notification Again</label
            >
          </div>
        </div>
        <div class="text-center mt-4">
          <button class="btn btn-secondary" @click="hidevideNot()">
            Close
          </button>
        </div>
      </div>
    </div>
    <!--end modal welcome notification-->
    <!--Modal-->
    <!--<div
      class="modal fade"
      id="exampleModal3"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div
        class="modal-dialog"
        role="document"
        style="max-height:95%; overflow-y: auto;"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title font-weight-semibold" id="example-Modal3">
              Welcome back {{ userProfile.length ? userProfile[0].name : "" }}
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body text-center" v-if="userProfile.length"></div>
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
    </div>-->
    <!--End Modal-->
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
          <div class="modal-header" style="border:none">
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
                        style="display:none"
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
            <showStudentProfile
              ref="userProfile"
              @updateUesrProfile="changeSidNavData"
              v-if="profile"
              :edit="0"
            ></showStudentProfile>
            <Notification
              ref="notific"
              v-else-if="notif"
              @delenoticall="callNoti"
            />
            <div
              class="sb-container"
              v-else
              style="position:relative;height:92%;overflow:auto;margin-top:59px;"
            >
              <div
                class="card w-100 m-0 p-0"
                style="border:none"
                id="mycourses"
              >
                <div
                  class="card-header"
                  v-if="
                    programs
                      ? programs.curriculum_course == 1
                        ? true
                        : false
                      : true
                  "
                >
                  <h3 class="card-title">My Courses</h3>
                </div>
                <div class="card-body p-6">
                  <div class="panel panel-primary">
                    <div class="tab-menu-heading" v-if="sch_id != 1">
                      <div class="tabs-menu1">
                        <ul class="nav panel-tabs">
                          <li class v-if="sch_id != 1">
                            <a
                              href="#tab5"
                              :class="sch_id != 1 ? 'active' : ''"
                              data-toggle="tab"
                              @click="callCvAchievement('tab5')"
                              >Institute Curriculum</a
                            >
                          </li>
                          <!--<li>
                            <a
                              href="#tab6"
                              data-toggle="tab"
                              :class="sch_id == 1 ? 'active' : ''"
                              @click="callCvAchievement('tab6')"
                              >Self Learning Courses</a
                            >
                          </li>
                          <li v-if="sch_id != 1">
                            <a
                              href="#tab71"
                              id="other_subject"
                              data-toggle="tab"
                              >Learn@Home</a
                            >
                          </li>-->
                          <li>
                            <a
                            :class="sch_id == 1 ? 'active' : ''"
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
                                    lms_book.other_courses == 0
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
                                            book_per: lms_book.per
                                          }
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
                                                    book_per: lms_book.per
                                                  }
                                                })
                                              "
                                              class="learn-more-btn"
                                              style="background:#48c9b0;padding: 4px 8px;color: #fff;border-radius: 2px;"
                                              >Learn More</a
                                            >
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
                                              style="font-size:14px;"
                                              >{{ lms_book.actual_price }}</del
                                            >
                                            <span
                                              class="newprice text-dark"
                                              style="font-size:14px;"
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
                                                  book_per: lms_book.per
                                                }
                                              })
                                            "
                                            >{{ "Start Learning" }}</a
                                          >
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
                                            >{{ "Download" }}</a
                                          >
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </template>
                            <!--test purpose-->
                           <!-- <CourseAchievement
                              ref="InstituteAchievment"
                              style="margin-top:10px;"
                              :lms_user_books="lms_user_books"
                              :sch_course="1"
                              :books_group="books_group"
                              @loadFunctionData="callCvAchievement('tab5')"
                            />-->

                            <!--end test purpose-->
                          </div>
                        </div>
                        <div
                         
                          id="tab6" style="display:none"
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
                                            book_per: lms_book.per
                                          }
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
                                              $router.push({
                                                name: 'course-details',
                                                params: {
                                                  curName: lms_book.slug,
                                                  bookId: lms_book.book_id,
                                                  book_per: lms_book.per
                                                }
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
                                                    book_per: lms_book.per
                                                  }
                                                })
                                              "
                                              class="learn-more-btn"
                                              style="background:#48c9b0;padding: 4px 8px;color: #fff;border-radius: 2px;"
                                              >Learn More</a
                                            >
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
                                              style="font-size:14px;"
                                              >{{ lms_book.actual_price }}</del
                                            >
                                            <span
                                              class="newprice text-dark"
                                              style="font-size:14px;"
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
                                                    : 'btn-outline-primary'
                                                ]
                                            "
                                            @click="
                                              $router.push({
                                                name: 'course-details',
                                                params: {
                                                  curName: lms_book.slug,
                                                  bookId: lms_book.book_id,
                                                  book_per: lms_book.per
                                                }
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

                            <!--<CourseAchievement
                              ref="SelfAchievement"
                              style="margin-top:10px;"
                              :lms_user_books="lms_user_books"
                              :books_group="books_group"
                              :sch_course="0"
                            />-->
                          </div>
                        </div>
                        <!--tab 7-->
                        <div
                          :class="'tab-pane' + [sch_id == 1 ? '' : '']"
                          id="tab71"
                        >
                          <div v-if="other_course_curriculam == -1">
                            No Course.
                          </div>
                          <!--course-->
                          <!--new card-->
                          <div class="row m-0" v-else>
                            <template
                              v-for="(lms_book, index) in lms_user_books"
                            >
                              <div
                                class="col-lg-4 col-md-6 col-xl-4 mt-2"
                                v-bind:key="index"
                                v-if="
                                  lms_book.sch_course === 1 &&
                                    lms_book.other_courses === 1
                                "
                              >
                                <div class="card mb-0">
                                  <div class="item-card2-img">
                                    <!--<a
                                      @click="
                                        $router.push({
                                          name: 'course-details',
                                          params: {
                                            curName: lms_book.slug,
                                            bookId: lms_book.book_id,
                                            book_per: lms_book.per
                                          }
                                        })
                                      "
                                    ></a>-->
                                    <a
                                      @click="
                                        $router.push({
                                          name: 'learn-more',
                                          params: {
                                            curName: lms_book.slug,
                                            bookId: lms_book.book_id,
                                            book_per: lms_book.per,
                                            tab: 'curriculum'
                                          }
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
                                                  tab: 'curriculum'
                                                }
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
                                              style="background:#48c9b0;padding: 4px 8px;color: #fff;border-radius: 2px; cursor:pointer"
                                              @click="
                                                $router.push({
                                                  name: 'learn-more',
                                                  params: {
                                                    curName: lms_book.slug,
                                                    bookId: lms_book.book_id,
                                                    book_per: lms_book.per,
                                                    tab: 'question-and-answer'
                                                  }
                                                })
                                              "
                                              >Q&A</a
                                            >
                                          </li>
                                          <li class="text-right">
                                            <a
                                              style="background:#48c9b0;padding: 4px 8px;color: #fff;border-radius: 2px; cursor:pointer"
                                              @click="
                                                $router.push({
                                                  name: 'learn-more',
                                                  params: {
                                                    curName: lms_book.slug,
                                                    bookId: lms_book.book_id,
                                                    book_per: lms_book.per,
                                                    tab: 'learn-more'
                                                  }
                                                })
                                              "
                                              >Learn More</a
                                            >
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
                                              style="font-size:14px;"
                                              >{{ "Free" }}</span
                                            >
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
                                                  tab: 'curriculum'
                                                }
                                              })
                                            "
                                            >{{ "Start Learning" }}</a
                                          >
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
                           :class="'tab-pane' + [sch_id == 1 ? ' active' : '']"
                          id="tab811"
                        >
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
                                          bookId: live_course.live_course_id
                                        }
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
                                              bookId: live_course.live_course_id
                                            }
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
                                          style="background:#ec296b;padding: 4px 8px;color: #fff;border-radius: 2px;font-size:10px;"
                                        >
                                          <b> Grade:</b>
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
                                            >{{
                                              live_course.duration
                                            }}
                                            Hours</span
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
                                                bookId:
                                                  live_course.live_course_id
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
                                                  live_course.live_course_id
                                              }
                                            })
                                          "
                                          :class="
                                            'btn btn-info btn-sm ml-auto ' +
                                              [
                                                live_course.purchases_status ==
                                                1
                                                  ? 'btn-primary text-white'
                                                  : 'btn-outline-primary'
                                              ]
                                          "
                                        >
                                          <!--<a
                                   
                                  @click.prevent="learnMore()"
                                    :class="
                                      'btn btn-info btn-sm ml-auto ' +
                                        'btn-outline-primary'"
                                  >-->{{
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
                            </div>
                            <!--end new card-->
                            <!--end course-->
                          </div>

                          <!--end card testing-->
                        </div>
                        <!--end tab81-->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--<NewCourse :userId="userId" :next_lms_books="next_lms_books" />-->
              <div
                class="card p-1 row"
                id="assessments"
                v-if="
                  programs ? (programs.assessment == 1 ? true : false) : true
                "
              >
                <div class="col-sm-12 pl-2 pt-2 mb-2">
                  <h3 class="card-title">Assessments</h3>
                </div>
                <div class="col-sm-12 p-2" v-if="assessments.length">
                  <template v-for="(assessment, index) in assessments">
                    <div
                      :key="index"
                      v-if="
                        assessment.score == null &&
                          assessment.tot_que != 0 &&
                          $moment(assessment.date).format('YYYY-MM-DD') ==
                            $moment(serverTime).format('YYYY-MM-DD')
                      "
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
                            <p style="margin-bottom:4; margin-top:8px;">
                              Total Questions: {{ assessment.tot_que }}
                            </p>
                            <p style="margin-bottom:4;">
                              Total Marks : {{ assessment.tot_marks }}
                            </p>
                            <p style="margin-bottom:0; marigin-top:4px;">
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
                                assessment.exam__submit_status == 0 &&
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
                                $moment(assessment.date).format('YYYY-MM-DD') ==
                                  $moment(serverTime).format('YYYY-MM-DD')
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
                        </div>
                      </div>
                    </div>
                  </template>
                  <span
                    class="float-right text-black mt-1"
                    style="cursor:pointer"
                    @click="$router.push('/assessments')"
                  >
                    <u>View all</u>
                  </span>
                </div>
                <div class="col-sm-12 p-2" v-else>
                  <h4>No Assessment scheduled</h4>
                </div>
              </div>
              <!--end assessments section-->
              <!--this section for projects-->

              <div
                class="card p-1 row"
                id="projects"
                v-if="
                  programs
                    ? programs.project == 1 || programs.project == '1'
                      ? true
                      : false
                    : true
                "
              >
                <div class="col-sm-12 pl-2 pt-2 mb-2">
                  <h3 class="card-title">Projects</h3>
                </div>
                <div class="col-sm-12 p-2">
                  <template v-for="(project, project_index) in recentProjects">
                    <div
                      :key="project.project_id"
                      class="col-sm-6 col-xl-4 col-sm-4 d-inline-block"
                      v-if="!project.hidden && project_index < 3"
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
                          style="background-image:url(/assets/images/project-thumbs/scratch.png);"
                        >
                          <div
                            class="project-type-tag"
                            style="background-color: #f1c40f"
                          >
                            {{ project.type }}
                          </div>
                        </div>
                        <div
                          v-else-if="project.type == 'python'"
                          class="project-card-img"
                          style="background-image:url(/assets/images/project-thumbs/python.jpg);"
                        >
                          <div
                            class="project-type-tag"
                            style="background-color: #3498DB"
                          >
                            {{ project.type }}
                          </div>
                        </div>
                        <div
                          v-else
                          class="project-card-img"
                          style="background-image:url(/assets/images/project-thumbs/web.svg);"
                        >
                          <div
                            class="project-type-tag"
                            style="background-color: #E74C3C"
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
                                params: { id: project.project_id }
                              })
                            "
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </template>
                  <span
                    class="float-right text-black mt-1"
                    style="cursor:pointer"
                    @click="$router.push('/projects')"
                  >
                    <u>View all</u>
                  </span>
                </div>
              </div>
              <!--end projects section-->
              <!--this section for quize-->
              <div
                class="card p-1 row"
                id="quizzes"
                v-if="programs ? (programs.quiz == 1 ? true : false) : true"
              >
                <div class="col-sm-12 pl-2 pt-2 mb-2">
                  <h3 class="card-title">Quizzes</h3>
                </div>
                <div class="col-sm-12 p-2">
                  <div class="panel panel-primary">
                    <div class="tab-menu-heading" v-if="sch_id != 1">
                      <div class="tabs-menu1">
                        <ul class="nav panel-tabs">
                          <li class>
                            <a
                              href="#tabPublicQuiz"
                              class="active"
                              data-toggle="tab"
                              >Public Quiz</a
                            >
                          </li>
                          <li class>
                            <a href="#tabInstituteQuiz" class data-toggle="tab"
                              >Institute Quiz</a
                            >
                          </li>
                        </ul>
                      </div>
                    </div>
                    <!--content-->
                    <div class="panel-body tabs-menu-body">
                      <div class="tab-content">
                        <div
                          :class="
                            'tab-pane row' +
                              [sch_id == 1 ? ' active' : ' active']
                          "
                          id="tabPublicQuiz"
                        >
                          <!--no quizz-->
                          <div
                            class="text-center w-100"
                            style="color:#cc;padding:24px;"
                            v-if="
                              userId && (quizzes && quizzes.length)
                                ? false
                                : true
                            "
                          >
                            There are no Quizzes!
                          </div>
                          <template v-else>
                            <div class="row">
                              <template v-for="(quiz, quiz_index) in quizzes">
                                <div
                                  class="quizzes-card col-md-6 col-xl-4"
                                  v-bind:key="quiz_index"
                                  v-if="
                                    quiz.attempted_question !=
                                      quiz.no_of_questions
                                  "
                                >
                                  <!--new card-->
                                  <div class="card border p-0">
                                    <div
                                      class="item-card2-img"
                                      style="height:180px;"
                                    >
                                      <img
                                        :src="
                                          '/dynamic/Quizzes/quiz_img/' +
                                            [
                                              quiz.quiz_img
                                                ? quiz.quiz_img
                                                : 'default_quiz.png'
                                            ]
                                        "
                                        alt="img"
                                        class="cover-image"
                                        style="background:#33E0FF;"
                                      />

                                      <div class="item-tag" style="top:15px;">
                                        <span
                                          class="text-white bg-warning p-1"
                                          style="border-radius:3px;z-index:9999; position:relative"
                                          :title="
                                            quiz.no_of_questions +
                                              ' users attempted'
                                          "
                                        >
                                          <i
                                            class="fa fa-paper-plane"
                                            data-toggle="tooltip"
                                            title="fa fa-paper-plane"
                                          ></i>
                                          {{ quiz.total_attempted }}
                                        </span>
                                      </div>
                                      <div class="item-tag" style="left:15px;">
                                        <span
                                          class="text-white bg-primary p-1"
                                          style="border-radius:3px;"
                                        >
                                          Questions:
                                          {{ quiz.no_of_questions }}
                                        </span>
                                      </div>
                                      <div class="item-tag">
                                        <span
                                          class="text-white bg-primary p-1"
                                          style="border-radius:3px;"
                                          >Points: {{ quiz.total_points }}</span
                                        >
                                      </div>
                                    </div>
                                    <!--card body-->
                                    <div class="card-body">
                                      <div class="item-card2">
                                        <div class="item-card2-text mb-3">
                                          <h4
                                            class="font-weight-semibold text-dark mb-1"
                                            v-html="
                                              quiz.quiz_name
                                                ? quiz.quiz_name
                                                : 'test'
                                            "
                                          ></h4>
                                          <div
                                            class="mb-1 text-muted"
                                            style="font-size:12px;"
                                          >
                                            By:
                                            <i class="icon icon-user mr-1"></i>
                                            <span
                                              class
                                              style="font-size:12px;"
                                              v-html="
                                                quiz.name
                                                  ? quiz.name
                                                  : 'Codevidhya'
                                              "
                                            ></span>
                                          </div>
                                          <p
                                            style="font-size:16px; color:#5e748e;"
                                            v-if="quiz.quiz_desc"
                                            v-html="
                                              quiz.quiz_desc.length >= 30
                                                ? quiz.quiz_desc.substring(
                                                    0,
                                                    27
                                                  ) + '...'
                                                : quiz.quiz_desc
                                            "
                                          ></p>
                                        </div>
                                        <div v-if="quiz.rating" class>
                                          <span
                                            class="rating-stars d-inline-block mr-2"
                                          >
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
                                                  (quiz.rating
                                                    ? quiz.rating * 20
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
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <!--end card body-->
                                    <!--card footer-->
                                    <div class="card-footer">
                                      <div class="item-card2-footer">
                                        <div
                                          class="product-item-wrap d-flex align-items-center"
                                        >
                                          <!--<span v-if="(quiz.quiz_desc) && ((quiz.quiz_desc).length >=30)" class="my-auto text-dark" style="cursor:pointer" @click="learn_more(quiz.quiz_name,quiz.quiz_desc)">Learn More</span>-->

                                          <div class="product-item-price">
                                            <span
                                              class="newprice text-dark"
                                              style="font-size:14px;"
                                            >
                                              {{
                                                quiz.price
                                                  ? "Rs. " + quiz.price
                                                  : "Free"
                                              }}
                                            </span>
                                          </div>
                                          <button
                                            :class="
                                              'btn btn-primary  ml-auto price' +
                                                [
                                                  quiz.price == 0 || quiz.status
                                                    ? 'unlocked'
                                                    : ''
                                                ]
                                            "
                                            style="border-radius:4px;width:auto;"
                                            v-html="'Learn More'"
                                            @click="quiz_action(quiz)"
                                          ></button>
                                        </div>
                                      </div>
                                    </div>
                                    <!--end card footer-->
                                  </div>
                                  <!--end new card-->
                                </div>
                              </template>
                            </div>
                          </template>
                          <!--end no quizz-->
                        </div>
                        <div
                          :class="'tab-pane' + [sch_id != 1 ? ' active' : '']"
                          id="tabInstituteQuiz"
                        >
                          <!--no quizz-->
                          <div
                            class="text-center w-100"
                            style="color:#cc;padding:24px;"
                            v-if="
                              userId && (sch_quizzes && sch_quizzes.length)
                                ? false
                                : true
                            "
                          >
                            There are no Quizzes!
                          </div>
                          <template v-else>
                            <div class="row">
                              <template
                                v-for="(quiz, quiz_index) in sch_quizzes"
                              >
                                <div
                                  class="quizzes-card col-md-6 col-xl-4"
                                  v-bind:key="quiz_index"
                                  v-if="
                                    quiz.attempted_question !=
                                      quiz.no_of_questions && quiz_index < 3
                                  "
                                >
                                  <!--new card-->
                                  <div class="card border p-0">
                                    <div
                                      class="item-card2-img"
                                      style="height:180px;"
                                    >
                                      <img
                                        :src="
                                          '/dynamic/Quizzes/quiz_img/' +
                                            [
                                              quiz.quiz_img
                                                ? quiz.quiz_img
                                                : 'default_quiz.png'
                                            ]
                                        "
                                        alt="img"
                                        class="cover-image"
                                        style="background:#33E0FF;"
                                      />

                                      <div class="item-tag" style="top:15px;">
                                        <span
                                          class="text-white bg-warning p-1"
                                          style="border-radius:3px;z-index:9999; position:relative"
                                          :title="
                                            quiz.no_of_questions +
                                              ' users attempted'
                                          "
                                        >
                                          <i
                                            class="fa fa-paper-plane"
                                            data-toggle="tooltip"
                                            title="fa fa-paper-plane"
                                          ></i>
                                          {{ quiz.total_attempted }}
                                        </span>
                                      </div>
                                      <div class="item-tag" style="left:15px;">
                                        <span
                                          class="text-white bg-primary p-1"
                                          style="border-radius:3px;"
                                        >
                                          Questions:
                                          {{ quiz.no_of_questions }}
                                        </span>
                                      </div>
                                      <div class="item-tag">
                                        <span
                                          class="text-white bg-primary p-1"
                                          style="border-radius:3px;"
                                          >Points: {{ quiz.total_points }}</span
                                        >
                                      </div>
                                    </div>
                                    <!--card body-->
                                    <div class="card-body">
                                      <div class="item-card2">
                                        <div class="item-card2-text mb-3">
                                          <h4
                                            class="font-weight-semibold text-dark mb-1"
                                            v-html="
                                              quiz.quiz_name
                                                ? quiz.quiz_name
                                                : 'test'
                                            "
                                          ></h4>
                                          <div
                                            class="mb-1 text-muted"
                                            style="font-size:12px;"
                                          >
                                            By:
                                            <i class="icon icon-user mr-1"></i>
                                            <span
                                              class
                                              style="font-size:12px;"
                                              v-html="
                                                quiz.name
                                                  ? quiz.name
                                                  : 'Codevidhya'
                                              "
                                            ></span>
                                          </div>
                                          <p
                                            style="font-size:16px; color:#5e748e;"
                                            v-if="quiz.quiz_desc"
                                            v-html="
                                              quiz.quiz_desc.length >= 30
                                                ? quiz.quiz_desc.substring(
                                                    0,
                                                    27
                                                  ) + '...'
                                                : quiz.quiz_desc
                                            "
                                          ></p>
                                        </div>
                                        <div v-if="quiz.rating" class>
                                          <span
                                            class="rating-stars d-inline-block mr-2"
                                          >
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
                                                  (quiz.rating
                                                    ? quiz.rating * 20
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
                                    <!--end card body-->
                                    <!--card footer-->
                                    <div class="card-footer">
                                      <div class="item-card2-footer">
                                        <div
                                          class="product-item-wrap d-flex align-items-center"
                                        >
                                          <div class="product-item-price">
                                            <span
                                              class="newprice text-dark"
                                              style="font-size:14px;"
                                            >
                                              {{
                                                quiz.price
                                                  ? "Rs. " + quiz.price
                                                  : "Free"
                                              }}
                                            </span>
                                          </div>
                                          <button
                                            :class="
                                              'btn btn-primary  ml-auto price' +
                                                [
                                                  quiz.price == 0 || quiz.status
                                                    ? 'unlocked'
                                                    : ''
                                                ]
                                            "
                                            style="border-radius:4px;width:auto;"
                                            v-html="'Learn More'"
                                            @click="quiz_action(quiz)"
                                          ></button>
                                        </div>
                                      </div>
                                    </div>
                                    <!--end card footer-->
                                  </div>
                                  <!--end new card-->
                                </div>

                                <!--<div
                      v-else
                      class="text-center"
                      style="color:#cc;padding:24px;"
                    >
                      There are no Quizzes!
                                </div>-->
                              </template>
                            </div>
                          </template>
                          <!--end no quizz-->
                        </div>
                        <span
                          class="float-right text-black"
                          style="cursor:pointer"
                          @click="$router.push('/quizzes')"
                        >
                          <u>View all</u>
                        </span>
                      </div>
                    </div>
                    <!--end content-->
                  </div>
                </div>
              </div>
              <!--here notification-->
              <!--end notification-->
              <!--end quizzes section-->
            </div>

            <!--end simple dashboard-->
          </div>
        </div>
      </div>
    </section>
    <!--/User Dashboard-->
    <!-- iNSTRUCTION Modal details -->
    <div id="instruction-modal" class="cv-modal normal">
      <div style="max-width:3000px; width:90%; height: 90%;">
        <div class="row bg-secondary p-2 text-white mb-2">
          <div class="col-sm-12">
            <h4>Assessment Instructions</h4>
          </div>
        </div>
        <div class="cv-input-group p-2" style="overflow:auto;">
          <p class="mb-2" style="color:#000000">
            <i
              class="fas fa-dot-circle"
              aria-hidden="true"
              style="color:#08CA73"
            ></i>
            &nbsp;
            <strong>Countdown Timer:</strong> The countdown timer at the top
            right of screen will display the remaining time available for you to
            complete the examination. when the timer reaches zero, the
            examination will end automatically. You need not terminate the
            examination or submit your paper.
          </p>

          <p class="mb-2" style="color:#000000">
            <i class="fas fa-dot-circle" style=" color:#08CA73"></i> &nbsp; Note
            that your answer for the current question will not be saved, if you
            navigate to another question directly by clicking on a question
            number without saving the answer to the previous question.
          </p>
          <p class="mb-2" style="color:#000000">
            <i class="fas fa-dot-circle" style=" color:#08CA73"></i>
            &nbsp;
            <strong>Answering a Question :</strong>
          </p>
          <p style="color:#000000">
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

          <p class="mb-2" style="color:#000000">
            <i class="fas fa-dot-circle text-success"></i> &nbsp; Sections of
            the question paper are displayed on the top bar of the screen.
            Questions in this section can be viewed by clicking on the name of
            the section.
          </p>
          <p class="mb-2" style="color:#000000">
            <i class="fas fa-dot-circle text-success"></i> &nbsp; After clicking
            the <strong>Save & Next</strong> for the last question in a section,
            you will automatically be taken to the first question of the next
            section.
          </p>
          <p class="mb-2" style="color:#000000">
            <i class="fas fa-dot-circle text-success"></i> &nbsp;
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
              <i class="fas fa-dot-circle" style="color:#FF6633"></i>
              <b>
                You can write this test only once, so for best results do not
                try to guess answers.
              </b>
            </li>
            <li>
              <i class="fas fa-dot-circle" style="color:#FF6633"></i>
              <b>No negetive marking for wrong answers.</b>
            </li>
          </ul>
          <br />
          <p class="mb-2" style="color:#000000">
            <i class="fas fa-dot-circle" style=" color:#08CA73"></i> &nbsp;
            <strong>Declaration :</strong>
          </p>
          <p class="mb-2 pt-2" style="color:#000000">
            I have read all the instructions carefully and have understood them.
            I agree not to cheat or use unfair means in this examination. I
            understand that using unfair means of any sort for my own or someone
            else's advantage will lead to my immediate disqualification. The
            decision of
            <strong>Codevidhya</strong> will be final in these matters and
            cannot be appealed.
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
    <!---->
    <!-- <Footer />-->
    <component
      :is="'link'"
      href="/assets/bootstrap-star-rating/css/star-rating.min.css"
      media="all"
      rel="stylesheet"
      type="text/css"
    />
    <component
      :is="'link'"
      href="/assets/bootstrap-star-rating/themes/krajee-fas/theme.min.css"
      media="all"
      rel="stylesheet"
      type="text/css"
    />
    <component
      :is="'script'"
      src="/assets/bootstrap-star-rating/js/star-rating.min.js"
      type="text/javascript"
    />
    <component
      :is="'script'"
      src="/assets/bootstrap-star-rating/themes/krajee-fas/theme.min.js"
      type="text/javascript"
    />
  </div>
</template>
<script>
import axios from "axios";
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
          this.getProfileInformation();
          this.lmscont(this.userId);
          this.getLiveCourses(this.userId);
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
