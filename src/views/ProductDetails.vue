<template>
  <div>
    <Header>
      <HeaderContent
        :tot_topic="topic_names.length ? topic_names[0].tot_topic : ''"
        :tot_sub_topic="topic_names.length ? topic_names[0].tot_sub_topic : ''"
        :tot_per="topic_names.length ? topic_names[0].tot_per : ''"
        :level="topic_names.length ? topic_names[0].level : ''"
        :purchases_status="
          topic_names.length ? topic_names[0].purchases_status : ''
        "
        :sch_id="topic_names.length ? topic_names[0].sch_id : ''"
        :product_id="topic_names.length ? topic_names[0].product_id : ''"
        :book_name="topic_names.length ? topic_names[0].book_name : ''"
        :book_slug="topic_names.length ? topic_names[0].book_slug : ''"
        :price="topic_names.length ? topic_names[0].price : ''"
        :prod_info="topic_names.length ? topic_names[0].prod_info : ''"
        :prod_type="topic_names.length ? topic_names[0].product_type : ''"
        :sub_topic_status="topic_names.length ? sub_topic_status : ''"
        :age_group="topic_names.length ? topic_names[0].age_group : ''"
      />
    </Header>

    <section class="sptb">
      <div class="container">
        <div class="row">
          <div class="col-xl-8 col-lg-8 col-md-12">
            <div class="card overflow-hidden">
              <div class="ribbon ribbon-top-right text-danger">
                <span class="bg-danger">Trending</span>
              </div>
              <div class="card-body">
                <div class="item-det mb-4">
                  <a href="#" class="text-dark">
                    <h3>
                      {{
                        topic_names.length ? topic_names[0].book_summary : ""
                      }}
                    </h3>
                  </a>
                  <div class="d-flex">
                    <ul class="d-flex mb-0">
                      <!-- <li class="mr-5">
                        <a href="#" class="icons">
                          <i class="icon icon-calendar text-muted mr-1"></i> 5
                          hours
                        </a>
                      </li>-->
                      <!--<li class="mr-5">
                        <a href="#" class="icons">
                          <i class="icon icon-people text-muted mr-1"></i> 12560
                          Enrolled
                        </a>
                      </li>-->
                    </ul>
                    <!--<div class="rating-stars d-flex mr-5">
                      <input
                        type="number"
                        readonly="readonly"
                        class="rating-value star"
                        name="rating-stars-value"
                        id="rating-stars-value"
                        value="4"
                      />
                      <div class="rating-stars-container mr-2">
                        <div class="rating-star sm">
                          <i class="fas fa-star"></i>
                        </div>
                        <div class="rating-star sm">
                          <i class="fas fa-star"></i>
                        </div>
                        <div class="rating-star sm">
                          <i class="fas fa-star"></i>
                        </div>
                        <div class="rating-star sm">
                          <i class="fas fa-star"></i>
                        </div>
                        <div class="rating-star sm">
                          <i class="fas fa-star"></i>
                        </div>
                      </div>
                      4.0
                    </div>-->
                    <!--<div class="rating-stars d-flex">
                      <div class="rating-stars-container mr-2">
                        <div class="rating-star sm">
                          <i class="fas fa-heart"></i>
                        </div>
                      </div>
                      135
                    </div>-->
                  </div>
                </div>
                <div class="product-slider">
                  <!--<ul class="list-unstyled video-list-thumbs">-->
                  <ul class="list-unstyled video-list-thumbs">
                    <li class="mb-0">
                      <a
                        data-toggle="modal"
                        data-target="#homeVideo"
                        class="class-video p-0"
                      >
                        <!--<div class="arrow-ribbon bg-primary">20% off</div>-->
                        <img
                          :src="course_cover_img"
                          alt="img"
                          class="img-responsive br-3"
                        />
                        <span
                          class="fe fe-play-circle text-white class-icon"
                        ></span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="border-0 mb-5">
              <div class="wideget-user-tab wideget-user-tab3">
                <div class="tab-menu-heading">
                  <div class="tabs-menu1">
                    <ul class="nav">
                      <li class>
                        <a href="#tab-1" class="active" data-toggle="tab"
                          >Overview</a
                        >
                      </li>
                      <li>
                        <a href="#tab-2" data-toggle="tab" class>Curriculum</a>
                      </li>
                      <li v-if="topic_names[0].sch_course == 0">
                        <a href="#tab-5" data-toggle="tab" class>Assessments</a>
                      </li>
                      <li v-if="topic_names[0].sch_course == 0">
                        <a href="#tab-certificate" data-toggle="tab" class
                          >Certificate</a
                        >
                      </li>
                      <!--<li>
                        <a href="#tab-4" data-toggle="tab" class>Ratings</a>
                      </li>-->
                    </ul>
                  </div>
                </div>
              </div>
              <div
                class="tab-content border-left border-right p-5 bg-white details-tab-content"
              >
                <div class="tab-pane active" id="tab-1">
                  <CourseDescription
                    :course_slug="
                      topic_names.length ? topic_names[0].book_slug : ''
                    "
                    :desc="topic_names.length ? topic_names[0].description : ''"
                    :cover_topics="
                      topic_names.length ? topic_names[0].learn : ''
                    "
                    :prerequisite="
                      topic_names.length ? topic_names[0].prerequisite : ''
                    "
                  />
                </div>
                <div class="tab-pane" id="tab-2">
                  <!--faq section-->
                  <div class="panel-group1" id="accordion2">
                    <!--accordian start-->

                    <div
                      class="panel panel-default mb-4 border p-0"
                      v-for="(topic_name, index) in topic_names"
                      :key="index"
                      :data-set="(sub_index = 1)"
                    >
                      <div class="panel-heading1">
                        <h4 class="panel-title1">
                          <a
                            class="accordion-toggle collapsed p-3"
                            data-toggle="collapse"
                            data-parent="#accordion2"
                            :href="'#collapse' + (index + 1)"
                            aria-expanded="false"
                            :style="
                              [topic_name.per ? 'background:#d8dee6;' : ''] +
                                'color:#4b5d73'
                            "
                          >
                            <span class style="display:flex;">
                              <span
                                class="col-7 col-md-9"
                                style="color: #2e384d"
                                v-html="
                                  index + 1 + '.&nbsp;' + topic_name.topic_name
                                "
                              ></span>

                              <span
                                style="color: #2e384d"
                                v-html="'Topics: ' + topic_name.total_subtopic"
                              ></span>
                            </span>
                          </a>
                        </h4>
                      </div>
                      <template v-for="(sub_topic, index1) in sub_topic_list">
                        <div
                          v-bind:key="index1"
                          :id="'collapse' + (index + 1)"
                          :class="[
                            userId
                              ? (topic_names[0].purchases_status ||
                                  (((cls_id != ''
                                    ? cls_id == topic_names[0].for_grade
                                    : topic_names[0].sch_course == 1) ||
                                    sub_topic_status == 1) &&
                                    topic_names[0].sch_id != 1) ||
                                  (topic_names[0].sch_id == 1 &&
                                    (topic_names[0].purchases_status ||
                                      (cls_id != ''
                                        ? cls_id == topic_names[0].for_grade
                                        : topic_names[0].sch_course == 1))) ||
                                  index < 1) &&
                                (index > 0
                                  ? topic_names[index - 1].total_subtopic ==
                                    topic_names[index - 1].st_read_topic
                                  : true)
                                ? 'panel-collapse collapse cursor-pointer active'
                                : 'panel-collapse collapse active cursor-pointer disabled'
                              : index < 1
                              ? 'panel-collapse collapse cursor-pointer active'
                              : 'panel-collapse collapse cursor-pointer active disabled'
                          ]"
                          role="tabpanel"
                          aria-expanded="false"
                          v-if="sub_topic.topic_id == topic_name.topic_id"
                          @click="
                            onLessonSubtopicItemClick(
                              $event,
                              index + 1,
                              topic_name.topic_slug,
                              topic_name.topic_name,
                              sub_topic.page_id,
                              index
                            )
                          "
                        >
                          <div
                            :class="
                              'panel-title1 border-bottom  col-sm-12 pl-2 cursor-pointer ' +
                                [index1 == 0 ? 'border-top' : '']
                            "
                          >
                            <div
                              class="col-sm-12"
                              style="display:flex;align-items:center"
                            >
                              <a
                                class="accordion-toggle collapsed cursor-pointer col-10 p-2"
                                style="font-size:12px;cursor:pointer"
                                v-html="
                                  sub_topic_img +
                                    '&nbsp;<span>' +
                                    sub_topic.page_name +
                                    '</span>'
                                "
                              ></a>
                              <div class="col-sm-2">
                                <i
                                  v-if="sub_topic.status"
                                  class="fas fa-check-circle lesson-topics-list-done"
                                ></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                  <!--end faq section-->
                </div>

                <!--Assessments-->
                <div class="tab-pane" id="tab-5">
                  <!--faq section-->
                  <div class="panel-group1" id="accordion2">
                    <!--accordian start-->

                    <div
                      class="panel panel-default mb-4 border p-0 "
                      v-for="(assessment, index) in assessments"
                      :key="index"
                    >
                      <div class="panel-heading">
                        <h3 class="panel-title1">
                          <a
                            class="cursor-pointer col-sm-10 p-4"
                            style="font-size:14px;cursor:pointer"
                            :id="'assessment' + assessment.assessment_id"
                            @click="showAssessmentDetail(assessment)"
                          >
                            <span class style="display:flex;">
                              <span
                                class="col-sm-9"
                                style="color: #2e384d"
                                v-html="
                                  index +
                                    1 +
                                    '.&nbsp;' +
                                    assessment.assessment_name
                                "
                              ></span>
                              <i class="flex flex-fill" />
                              <i
                                class="fas fa-check-circle lesson-topics-list-done"
                                v-if="assessment.score"
                              ></i>
                            </span>
                          </a>
                        </h3>
                      </div>
                    </div>
                  </div>
                  <!--end faq section-->
                </div>
                <!--end Assessment-->
                <!--certificate Tab started-->
                <div class="tab-pane" id="tab-certificate">
                  <div class="panel-group1" id="accordion2">
                    <div class="panel panel-default mb-4 border p-2">
                      <div
                        class="panel-heading1"
                        style="display:flex; flex-direction:row; align-items:center;"
                      >
                        <h4 class="panel-title2" style="display:inline-block;">
                          Certificate for {{ topic_names[0].book_name }}
                        </h4>
                        <i class="flex-filler"></i>
                        <span
                          class="btn badge badge-primary"
                          style="cursor:pointer"
                          v-on:click="downloadCertificate()"
                          >Download</span
                        >
                      </div>
                      <div
                        class=""
                        style="width:150px; height:110px; magin:2px 2px; padding:5px 5px;"
                      >
                        <!--<img
                          class="img-thumbnail"
                          alt="Cetificate Sample"
                          src="../assets/Certificatedemo.jpg"
                        />-->
                      </div>
                      <div></div>
                    </div>
                  </div>
                </div>
                <!--certificate tab end-->
                <div class="tab-pane" id="tab-4">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="mb-4">
                        <p class="mb-2">
                          <span class="fs-14 ml-2">
                            <i class="fas fa-star text-yellow mr-2"></i>5
                          </span>
                        </p>
                        <div class="progress progress-md mb-4 h-4">
                          <div class="progress-bar bg-success w-100">9,232</div>
                        </div>
                      </div>
                      <div class="mb-4">
                        <p class="mb-2">
                          <span class="fs-14 ml-2">
                            <i class="fas fa-star text-yellow mr-2"></i>4
                          </span>
                        </p>
                        <div class="progress progress-md mb-4 h-4">
                          <div class="progress-bar bg-info w-80">8,125</div>
                        </div>
                      </div>
                      <div class="mb-4">
                        <p class="mb-2">
                          <span class="fs-14 ml-2">
                            <i class="fas fa-star text-yellow mr-2"></i> 3
                          </span>
                        </p>
                        <div class="progress progress-md mb-4 h-4">
                          <div class="progress-bar bg-primary w-60">6,263</div>
                        </div>
                      </div>
                      <div class="mb-4">
                        <p class="mb-2">
                          <span class="fs-14 ml-2">
                            <i class="fas fa-star text-yellow mr-2"></i> 2
                          </span>
                        </p>
                        <div class="progress progress-md mb-4 h-4">
                          <div class="progress-bar bg-secondary w-30">
                            3,463
                          </div>
                        </div>
                      </div>
                      <div class="mb-0">
                        <p class="mb-2">
                          <span class="fs-14 ml-2">
                            <i class="fas fa-star text-yellow mr-2"></i> 1
                          </span>
                        </p>
                        <div class="progress progress-md mb-4 h-4">
                          <div class="progress-bar bg-orange w-20">1,456</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--buy and share course-->

              <!--End buy and share course-->
            </div>
            <!-- <h3 class="mb-5 mt-4">Related Posts</h3>-->
            <!--Related Posts-->

            <!--/Related Posts-->

            <!--Comments-->
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Reviews</h3>
                <a
                  class="pull-right"
                  style="margin-left:auto;margin-right:0;cursor:pointer"
                  href="#add_your_review"
                  v-if="userId"
                  >Add your review</a
                >
              </div>
              <div class="card-body p-0" v-if="review_all.length">
                <div
                  class="p-0"
                  v-for="(review, index) in review_all"
                  v-bind:key="index"
                >
                  <span
                    class="media mt-0 p-5"
                    v-if="view_more == 1 ? index < 4 : index >= 0"
                  >
                    <div class="d-flex mr-3">
                      <a href="#">
                        <img
                          class="media-object brround"
                          alt="64x64"
                          :src="
                            review.profile_pic
                              ? '/assets/images/users/' + review.profile_pic
                              : '/assets/images/users/user.svg'
                          "
                        />
                      </a>
                    </div>
                    <div class="media-body">
                      <h4 class="mt-0 mb-1 font-weight-bold">
                        {{ review.name ? review.name : "Test" }}
                        <span
                          class="fs-14 ml-0"
                          data-toggle="tooltip"
                          data-placement="top"
                          title
                          data-original-title="verified"
                        >
                          <i class="fas fa-check-circle-o text-success"></i>
                        </span>
                        <span
                          class="fs-14 ml-2 rating-container theme-krajee-fas rating-xs rating-animate is-display-only"
                        >
                          {{ review.obt_rat }}

                          <div class="rating-stars">
                            <span class="empty-stars">
                              <span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                            ></span>
                            <span
                              class="filled-stars"
                              :style="'width:' + review.obt_rat * 20 + '%;'"
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                            ></span>
                          </div>
                        </span>
                      </h4>
                      <!-- <small class="text-muted">
                      <i class="fas fa-calendar"></i> Dec 21st
                      <i class="ml-3 fas fa-clock-o"></i> 13.00
                      <i class="ml-3 fas fa-map-marker"></i> Brezil
                    </small>-->
                      <p class="fs-15 mb-2 mt-2">"{{ review.message }}"</p>
                      <!-- <a href="#" class="mr-2">
                      <span class="badge badge-primary">Helpful</span>
                    </a>
                    <a
                      href
                      class="mr-2 text-muted"
                      data-toggle="modal"
                      data-target="#Comment"
                    >
                      <span class="badge badge-default">Comment</span>
                    </a>
                    <a
                      href
                      class="mr-2 text-muted"
                      data-toggle="modal"
                      data-target="#report"
                    >
                      <span class="badge badge-default">Report</span>
                    </a>-->
                    </div>
                  </span>
                </div>
                <div
                  class="text-center mb-3 col-sm-12"
                  style="width:100%;"
                  v-if="review_all.length > 4"
                >
                  <button
                    class="btn btn-primary"
                    id="view_more"
                    @click="view_moree()"
                    v-html="view_more == 1 ? 'View more' : 'View less'"
                  ></button>
                </div>
              </div>
            </div>
            <!--/Comments-->
            <div class="card mb-lg-0" v-if="userId">
              <div
                id="add_your_review"
                style="position: relative; top: -100px"
              ></div>
              <div class="card-header">
                <h3 class="card-title">Rating & Feedback</h3>
              </div>
              <div class="card-body">
                <div>
                  <div class="form-group">
                    <label v-if="!button_editable"
                      >Rating:
                      <input
                        id="star-rating"
                        class="rating lesson-review-item-rating"
                        type="text"
                        :value="user_rating"
                        data-size="xs"
                    /></label>
                    <span v-else>
                      <span
                        v-for="index in Math.floor(user_rating)"
                        v-bind:key="index"
                      >
                        <i class="fas fa-star text-yellow"></i>
                      </span>
                      <span v-if="precious_part > 0">
                        <i class="fas fa-star-half-o text-yellow"></i>
                      </span>
                      <!-- <i class="fas fa-star text-yellow"></i>
                        <i class="fas fa-star text-yellow"></i>
                        <i class="fas fa-star text-yellow"></i>
                        <i class="fas fa-star-half-o text-yellow"></i>-->
                    </span>
                  </div>
                  <div class="form-group">
                    <textarea
                      class="form-control"
                      name="example-textarea-input"
                      rows="6"
                      id="feedback_msg"
                      placeholder="Feedback"
                      v-if="!button_editable"
                    ></textarea>
                    <div v-else class="form-control" style="min-height:200px;">
                      {{ user_feed_back }}
                    </div>
                  </div>
                  <button
                    class="btn btn-primary "
                    @click="editable"
                    v-if="button_editable"
                  >
                    Edit
                  </button>
                  <button
                    class="btn btn-primary"
                    v-else
                    @click="sent_feedback()"
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!--Right Side Content-->
          <div class="col-xl-4 col-lg-4 col-md-12">
            <div class="card">
              <div
                class="card"
                v-if="
                  (topic_names.length
                    ? topic_names[0].purchases_status
                    : false) ||
                    sub_topic_status == 1 ||
                    (cls_id
                      ? cls_id == topic_names[0].for_grade
                      : topic_names[0].sch_course == 1)
                "
              >
                <div class="card-body">
                  <div class="text-center">
                    <button
                      class="btn btn-info btn-lg btn-block"
                      @click="
                        $router.push({
                          name: 'course-content',
                          params: {
                            curName: topic_names[0].book_slug,
                            topicActualName: topic_names[0].topic_name,
                            topicName: topic_names[0].topic_slug,
                            pageId: sub_topic_list[0].page_id,
                            user_sch_id: topic_names[0].sch_id,
                            purchases_status: topic_names[0].purchases_status,
                            for_grade: topic_names[0].for_grade,
                            sch_course: topic_names[0].sch_course
                          }
                        })
                      "
                    >
                      Start Learning
                    </button>
                  </div>
                </div>
              </div>
              <div class="card-body" v-else>
                <div class="mb-5">
                  <div class="text-dark mb-2">
                    <span
                      class="text-dark font-weight-semibold h1"
                      v-html="
                        `Rs. <del style='color:#999'>` +
                          [
                            topic_names.length
                              ? topic_names[0].actual_price
                              : ''
                          ] +
                          '</del> ' +
                          [topic_names.length ? topic_names[0].price : '']
                      "
                    ></span>
                    <!--<span class="text-muted h3 font-weight-normal ml-1">
                      <span class="strike-text">$155</span>
                    </span>-->
                  </div>
                  <!-- <p class="text-danger">
                    <i class="fe fe-clock mr-1"></i>5 days to left of this Price
                  </p>-->
                </div>
                <div class>
                  <button
                    class="btn btn-primary btn-lg btn-block text-white"
                    @click="payment_gateway()"
                  >
                    Buy Now
                  </button>
                  <button
                    class="btn btn-info btn-lg btn-block text-white"
                    @click="
                      $router.push({
                        name: 'course-content',
                        params: {
                          curName: topic_names[0].book_slug,
                          topicActualName: topic_names[0].topic_name,
                          topicName: topic_names[0].topic_slug,
                          pageId: sub_topic_list[0].page_id,
                          user_sch_id: topic_names[0].sch_id,
                          purchases_status: topic_names[0].purchases_status,
                          for_grade: topic_names[0].for_grade,
                          sch_course: topic_names[0].sch_course
                        }
                      })
                    "
                  >
                    Start Trial
                  </button>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Other Courses</h3>
              </div>
              <div class="card-body">
                <div class="rated-products">
                  <ul class="vertical-scroll">
                    <template v-for="(other_book, index) in other_books">
                      <li
                        class="item"
                        v-bind:key="index"
                        v-if="other_book.book_id != topic_names[0].book_id"
                        @click="
                          change_course(
                            other_book.slug,
                            other_book.book_id,
                            other_book.per
                          )
                        "
                      >
                        <div class="media m-0 mt-0 p-5">
                          <img
                            class="mr-4"
                            :src="
                              other_book.img
                                ? '/assets/images/png/courses/' + other_book.img
                                : '/assets/images/png/courses/web.svg'
                            "
                            alt="img"
                          />
                          <div class="media-body">
                            <h4 class="mt-2 mb-1">
                              {{ other_book.book_name }}
                            </h4>
                            <div class="rating-stars">
                              <div>
                                <span class="empty-stars">
                                  <span class="star"
                                    ><i class="fas fa-star"></i></span
                                  ><span class="star"
                                    ><i class="fas fa-star"></i></span
                                  ><span class="star"
                                    ><i class="fas fa-star"></i></span
                                  ><span class="star"
                                    ><i class="fas fa-star"></i></span
                                  ><span class="star"
                                    ><i class="fas fa-star"></i></span
                                ></span>
                                <span
                                  class="filled-stars"
                                  :style="
                                    'width:' +
                                      (other_book.avg_rating
                                        ? other_book.avg_rating * 20
                                        : 90) +
                                      '%'
                                  "
                                  ><span class="star"
                                    ><i class="fas fa-star"></i></span
                                  ><span class="star"
                                    ><i class="fas fa-star"></i></span
                                  ><span class="star"
                                    ><i class="fas fa-star"></i></span
                                  ><span class="star"
                                    ><i class="fas fa-star"></i></span
                                  ><span class="star"
                                    ><i class="fas fa-star"></i></span
                                ></span>
                              </div>
                            </div>
                            <div
                              class="h5 mb-0 font-weight-semibold mt-1"
                              v-html="
                                other_book.price
                                  ? `Rs. <del style='color:#999'>` +
                                    other_book.actual_price +
                                    '</del> ' +
                                    other_book.price
                                  : 'Free'
                              "
                            ></div>
                          </div>
                        </div>
                      </li>
                    </template>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <!--/Right Side Content-->
        </div>
      </div>
    </section>
    <!--/Section-->

    <Footer />

    <!-- Large Modal -->
    <div id="largeModal" class="modal fade" style="overflow:scroll;">
      <div class="modal-dialog w-80 mw-100" role="document">
        <div class="modal-content ">
          <div class="modal-header pd-x-20">
            <h6 class="modal-title">Assessment Details</h6>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body pd-20">
            <!--this block is used to show assessment details---->
            <div id="lesson-container">
              <div id="instruction-div">
                <div class="row">
                  <div class="col-md-12">
                    <table class="table table-bordered">
                      <thead class="thead-light">
                        <tr>
                          <th>Assessment Name</th>
                          <th>Duration</th>
                          <th>Total Questions</th>
                          <th>Total Marks</th>
                        </tr>
                      </thead>
                      <tr>
                        <td>
                          {{
                            current_assessment
                              ? current_assessment.assessment_name
                              : ""
                          }}
                        </td>
                        <td>
                          {{
                            current_assessment
                              ? current_assessment.duration
                              : ""
                          }}
                        </td>
                        <td>
                          {{
                            current_assessment ? current_assessment.tot_que : ""
                          }}
                        </td>
                        <td>
                          {{
                            current_assessment
                              ? current_assessment.tot_marks
                              : ""
                          }}
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>

                <p style="color:#000000">
                  <i
                    class="fas fa-dot-circle-o"
                    aria-hidden="true"
                    style="color:#08CA73"
                  ></i>
                  &nbsp; <strong> Countdown Timer:</strong> The countdown timer
                  at the top right of screen will display the remaining time
                  available for you to complete the examination. when the timer
                  reaches zero, the examination will end automatically. You need
                  not terminate the examination or submit your paper.
                </p>
                <p style="color:#000000">
                  <i class="fas fa-dot-circle-o" style=" color:#08CA73"></i>
                  &nbsp; Note that your answer for the current question will not
                  be saved, if you navigate to another question directly by
                  clicking on a question number without saving the answer to the
                  previous question.
                </p>
                <p style="color:#000000">
                  <i class="fas fa-dot-circle-o" style=" color:#08CA73"></i>
                  &nbsp;<strong>Answering a Question : </strong>
                </p>
                <p style="color:#000000; padding-left: 20px;">
                  Procedure for answering a multiple choice question:
                </p>
                <p style="color:#000000; padding:0px 20px;">
                  <i class="fas fa-dot-circle-o" style="color:#FF6633"></i>
                  Choose one answer from the 4 options (A,B,C,D) given below the
                  question, click on the bubble placed before the chosen option.
                </p>
                <p style="color:#000000; padding:0px 20px;">
                  <i class="fas fa-dot-circle-o" style="color:#FF6633"></i>
                  To deselect your chosen answer, click on the bubble of the
                  chosen option again or click on the Clear Response button.
                </p>
                <p style="color:#000000; padding:0px 20px;">
                  <i class="fas fa-dot-circle-o" style="color:#FF6633"></i> To
                  change your chosen answer. click on the bubble of another
                  option.
                </p>
                <p style="color:#000000; padding:0px 20px;">
                  <i class="fas fa-dot-circle-o" style="color:#FF6633"></i>
                  To save your answer, you MUST click on the
                  <strong> Save & Next</strong>
                </p>

                <p style="color:#000000">
                  <i class="fas fa-dot-circle-o" style=" color:#08CA73"></i>
                  &nbsp; Sections of the question paper are displayed on the top
                  bar of the screen. Questions in this section can be viewed by
                  clicking on the name of the section.
                </p>
                <p style="color:#000000">
                  <i class="fas fa-dot-circle-o" style=" color:#08CA73"></i>
                  &nbsp; After clicking the <strong> Save & Next</strong> for
                  the last question in a section, you will automatically be
                  taken to the first question of the next section.
                </p>
                <p style="color:#000000">
                  <i class="fas fa-dot-circle-o" style=" color:#08CA73"></i>
                  &nbsp;
                  <strong>Read the following instructions carefully:</strong>
                </p>
                <p style="color:#000000; padding:0px 20px;">
                  <i class="fas fa-dot-circle-o" style="color:#FF6633"></i>
                  This test comprises multiple-choice questions (MCQs).
                </p>
                <p style="color:#000000; padding:0px 20px;">
                  <i class="fas fa-dot-circle-o" style="color:#FF6633"></i>
                  You are advised not to close the browser window before
                  submitting the test.
                </p>
                <p style="color:#000000; padding:0px 20px;">
                  <i class="fas fa-dot-circle-o" style="color:#FF6633"></i>
                  In case the test does not load completely or becomes
                  un-responsive, click on browser's refresh button to reload.
                </p>
                <p style="color:#000000; padding:0px 20px;">
                  <i class="fas fa-dot-circle-o" style="color:#FF6633"></i>
                  You can write this test only once, so for best results do not
                  try to guess answers.
                </p>
                <p style="color:#000000; padding:0px 20px;">
                  <i class="fas fa-dot-circle-o" style="color:#FF6633"></i>
                  No negetive marking for wrong answers.
                </p>

                <p style="color:#000000">
                  <i class="fas fa-dot-circle-o" style=" color:#08CA73"></i>
                  &nbsp;
                  <strong> Declaration : </strong>
                </p>
                <p style="color:#000000; padding-left:20px;">
                  I have read all the instructions carefully and have understood
                  them. I agree not to cheat or use unfair means in this
                  examination. I understand that using unfair means of any sort
                  for my own or someone else's advantage will lead to my
                  immediate disqualification. The decision of
                  <strong>Codevidhya</strong> will be final in these matters and
                  cannot be appealed.
                </p>
              </div>
            </div>
          </div>
          <!-- modal-body -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="
                start_exam(
                  current_assessment ? current_assessment.assessment_id : '',
                  current_assessment ? current_assessment.assessment_name : '',
                  current_assessment ? current_assessment.duration : ''
                )
              "
            >
              Start Now
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <!-- modal-dialog -->
    </div>
    <!-- modal -->
    <component
      :is="'link'"
      href="/assets/bootstrap-star-rating/css/star-rating.min.css"
      media="all"
      rel="stylesheet"
      type="text/css"
    />
    <component
      :is="'link'"
      href="/assets/bootstrap-star-rating/themes/krajee-fa/theme.min.css"
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
      src="/assets/bootstrap-star-rating/themes/krajee-fa/theme.min.js"
      type="text/javascript"
    />
    <img
      id="certificatetemplate"
      src="/public/static/certificates/selfLearningCourseCertificate.jpg"
      style="display:none;"
    />
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/product-details/HeaderContent.vue";
import Footer from "@/components/footer/Footer.vue";
import axios from "axios";
import CourseDescription from "@/components/product-details/CourseDescription.vue";
import html2canvas from "html2canvas";
export default {
  name: "course-details",
  props: ["curName", "topicId", "btopicId", "book_per"],
  components: {
    Header,
    HeaderContent,
    Footer,
    CourseDescription
  },
  data() {
    return {
      topic_names: [],
      book_id: "",
      book: "",
      slug: "",
      sub_topic_list: [],
      sub_topic_status: 0,
      user_id: "",
      role_id: "",
      view_more: 1,
      sub_index: 1,
      desc: "",
      cover_topics: "",
      prerequisite: "",
      userId: 0,
      assessments: "",
      current_assessment: "",
      sub_topic_img:
        '<img class="sub_topics_image" style="width: 16px;height: 16px;margin-right: 16px;padding: 4px;background: rgba(0, 0, 0, 0.2);border-radius: 4px;opacity: 0.4;" src="/assets/images/course/subtopic-icon.png"/>',
      other_books: "",
      course_cover_img: "",
      review_all: "",
      user_rating: 0,
      user_feed_back: "",
      button_editable: 0,
      precious_part: 0,
      serverTime: "",
      cls_id: "",
      userDetail: []
    };
  },
  created() {
    this.slug = this.curName;
  },
  beforeMount() {
    this.getServerTime();
  },
  mounted() {
    $(".clear-rating").hide();
    cvAuth.getUserId(
      function(userId) {
        this.userId = userId;
        this.cls_id = this.$store.getters.getAuthData.auth_cls_id;
        this.role_id = this.$store.getters.getAuthData.auth_role_id;
        this.loadBooksTopics(userId);
        this.getUserInformation();
      }.bind(this)
    );
  },
  updated() {
    $(".clear-rating").hide();
    $(".lesson-review-item-rating").rating({
      displayOnly: false,
      theme: "krajee-fas",
      showCaption: false
    });
  },

  methods: {
    view_moree: function() {
      if (this.view_more == 1) {
        $("#view_more").html("View less");
        this.view_more = 0;
      } else {
        $("#view_more").html("View more");
        this.view_more = 1;
      }
    },
    editable: function() {
      this.button_editable = 0;
    },
    sent_feedback: function() {
      var rating = $("#star-rating").val();
      var feedback_msg = $("#feedback_msg").val();
      /*if(feedback_msg=="")
        {
          window.cvNotify("Please provide your precious feedback","danger");
        }*/
      var product_id = this.topic_names[0].product_id;
      axios
        .post("/api/user/submit_course_feedback", {
          user_id: this.userId,
          rating: rating,
          message: feedback_msg,
          product_id: product_id
        })
        .then(res => {
          if (res.data.data == 1)
            window.cvNotify("Thank you for your valuable feedback");
          axios
            .post("/api/user/get_product_review", {
              product_id: product_id,
              user_id: this.userId
            })
            .then(res => {
              this.review_all = res.data.data;
              let index = this.review_all.findIndex(
                x => x.user_id == this.userId
              );
              if (index != -1) {
                this.user_rating = this.review_all[index].obt_rat;
                this.user_feed_back = this.review_all[index].message;
                this.button_editable = 1;
                this.precious_part =
                  this.user_rating - Math.floor(this.user_rating);
              }
            });
        });
    },
    payment_gateway: function() {
      this.$router.push(
        "/checkout?product_name=" +
          encodeURIComponent(this.topic_names[0].book_slug) +
          "&id=" +
          encodeURIComponent(this.topic_names[0].product_id) +
          "&type=" +
          encodeURIComponent(this.topic_names[0].product_type)
      );
    },
    change_course: function(curName, bookId, book_per) {
      this.slug = curName;
      this.sub_topic_status = 0;
      this.loadBooksTopics(this.userId);
      this.$router.push({
        name: "course-details",
        params: { curName: curName, bookId: bookId, book_per: book_per }
      });
    },
    showAssessmentDetail: function(assessment) {
      if (this.topic_names[0].tot_per == 100) {
        if (this.userId == 0) {
          this.$router.push(
            "/login?redirect=" + encodeURIComponent(window.location.href)
          );
          return false;
        } else if (assessment.score) {
          cvNotify("You have already attempted this assessment.", "info");
          return false;
        } else {
          this.current_assessment = assessment;
          $("#assessment" + assessment.assessment_id).attr(
            "data-toggle",
            "modal"
          );
          $("#assessment" + assessment.assessment_id).attr(
            "href",
            "#largeModal"
          );
        }
      } else if (this.topic_names[0].tot_per < 100) {
        cvNotify(
          "You can not attempt the assessment before completing the course.",
          "warning"
        );
        return false;
      }
      /*this.current_assessment = assessment;
      $("#assessment" + assessment.assessment_id).attr("data-toggle", "modal");
      $("#assessment" + assessment.assessment_id).attr("href", "#largeModal");*/
    },
    getUserInformation: function() {
      this.$http
        .post("/api/profile/getUserInformation", {
          user_id: this.userId,
          role_id: this.role_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.userDetail = res.body;
          }
        });
    },
    loadBooksTopics: function(userId) {
      let vm = this;
      axios
        .post("/api/user/DisplayTopics", { slug: this.slug, user_id: userId })
        .then(res => {
          if (!res.data.data.length) {
            if (userId == 0) vm.$router.push("/courses");
            else vm.$router.push("/dashboard");
          }
          vm.topic_names = res.data.data;

          // console.log(this.topic_names);
          vm.book_id = vm.topic_names[0].book_id;
          let product_id = vm.topic_names[0].product_id;
          this.course_cover_img =
            "/assets/images/png/courses/" +
            [this.topic_names[0].img ? this.topic_names[0].img : "web.svg"];
          /*axios.post("/api/user/get_product_review",{product_id: product_id,user_id: this.userId})
          .then(res =>{
              console.log(res);
                this.review_all = res.data.data;
                console.log(this.review_all);
            }
          );*/
          axios
            .post("/api/user/get_product_review", {
              product_id: product_id,
              user_id: this.userId
            })
            .then(res => {
              this.review_all = res.data.data;
              let index = this.review_all.findIndex(
                x => x.user_id == this.userId
              );
              if (index != -1) {
                this.user_rating = this.review_all[index].obt_rat;
                this.user_feed_back = this.review_all[index].message;
                this.button_editable = 1;
                this.precious_part =
                  this.user_rating - Math.floor(this.user_rating);
              }
            });

          axios
            .post("/api/user/DisplayOtherLmsActivity", {
              user_id: userId,
              book_id: this.book_id
            })
            .then(res => {
              if (res.data.status == 200) {
                this.other_books = res.data.data;
                let curr_index = this.other_books.findIndex(
                  x => x.book_id === this.book_id
                );
                if (curr_index != -1) {
                  this.course_cover_img =
                    "/assets/images/png/courses/" +
                    this.other_books[curr_index].img;
                }
              }
            });
          axios
            .post("/api/user/displayCourseAsessment", {
              user_id: userId,
              book_id: this.book_id
            })
            .then(res => {
              this.assessments = res.data.assessments;
              //res.data.assessments;
            });
        })
        .catch(err => {
          console.log(err);
        });

      axios
        .post("/api/user/DisplayAllSubTopics", {
          slug: this.slug,
          user_id: userId
        })
        .then(res => {
          this.sub_topic_list = res.data.data;
          /*********For School alloted clasa */
          /*     axios.post("/api/user/DisplayAllotedClasses",{ slug: this.slug,
          user_id: userId}).then(res1 =>{
              let sch_allot_class = res1.data.data
          });*/
          /********End School alloted class */

          if (this.userId == 0) {
            this.sub_topic_status = 0;
          } /*else if (this.$store.getters.getAuthData.auth_role_id == 3) {
            switch (this.$store.getters.getAuthData.auth_cls_id) {
              case 10:
              case 9:
              case 8:
                if (this.slug == "python" || this.slug == "sql")
                  this.sub_topic_status = 1;
                break;

              case 7:
                if (this.slug == "javascript" || this.slug == "sql")
                  this.sub_topic_status = 1;
                break;
              case 6:
                if (this.slug == "javascript") this.sub_topic_status = 1;
                break;
              case 5:
                if (this.slug == "css" || this.slug == "html&css")
                  this.sub_topic_status = 1;
                break;
              case 4:
                if (this.slug == "html&css") this.sub_topic_status = 1;
                break;
              case 3:
              case 2:
              case 1: {
                if (this.slug == "scratch") this.sub_topic_status = 1;
                break;
              }
            }
          } else {
            this.sub_topic_status = 1;
          }*/
        })
        .catch(err => {
          console.log(err);
        });
    },
    onLessonSubtopicItemClick(
      e,
      chapter,
      topic_slug,
      topic_name,
      page_id,
      lockCourse
    ) {
      if (this.userId) {
        if (
          ((this.sub_topic_status == 1 ||
            (this.topic_names[0].purchases_status ||
              (this.cls_id != ""
                ? this.cls_id == this.topic_names[0].for_grade
                : this.topic_names[0].sch_course == 1))) &&
            this.topic_names[0].sch_id != 1) ||
          ((this.topic_names[0].sch_id == 1 &&
            (this.topic_names[0].purchases_status ||
              (this.cls_id != ""
                ? this.cls_id == this.topic_names[0].for_grade
                : this.topic_names[0].sch_course == 1))) ||
            chapter < 2)
        ) {
          if (
            lockCourse <= 0 ||
            (lockCourse > 0
              ? this.topic_names[lockCourse - 1].total_subtopic ==
                this.topic_names[lockCourse - 1].st_read_topic
                ? true
                : false
              : false)
          ) {
            this.$router.push({
              name: "course-content",
              params: {
                curName: this.topic_names[0].book_slug,
                topicActualName: topic_name,
                topicName: topic_slug,
                pageId: page_id,
                user_sch_id: this.topic_names[0].sch_id,
                purchases_status: this.topic_names[0].purchases_status,
                for_grade: this.topic_names[0].for_grade,
                sch_course: this.topic_names[0].sch_course
              }
            });
          } else {
            this.notifylockmsg(e);
          }
        } else {
          if (chapter < 2) {
            this.$router.push({
              name: "course-content",
              params: {
                curName: this.topic_names[0].book_slug,
                topicActualName: topic_name,
                topicName: topic_slug,
                pageId: page_id,
                user_sch_id: this.topic_names[0].sch_id,
                purchases_status: this.topic_names[0].purchases_status,
                for_grade: this.topic_names[0].for_grade,
                sch_course: this.topic_names[0].sch_course
              }
            });
          } else {
            this.notifymsg(e);
          }
        }
      } else {
        if (chapter < 2) {
          // alert("logout called");
          this.$router.push({
            name: "course-content",
            params: {
              curName: this.topic_names[0].book_slug,
              topicActualName: topic_name,
              topicName: topic_slug,
              pageId: page_id,
              user_sch_id: this.topic_names[0].sch_id,
              purchases_status: this.topic_names[0].purchases_status,
              for_grade: this.topic_names[0].for_grade,
              sch_course: this.topic_names[0].sch_course
            }
          });
        } else {
          // console.log("i also logout");
          this.notifybuymsg(e);
        }
      }
      //  [(auth_user_id)?((((() && (sub_topic_status==1))&&(topic_names[0].sch_id!=1)))) ? ):notifymsg($event): (index<1) ? $router.push({name:'course-content', params:{curName:topic_name.book_slug,topicActualName:topic_name.topic_name,logout_user:1}}): notifybuymsg($event)]
    },
    notifylockmsg(e) {
      e.stopPropagation();
      cvNotify("Complete previous topic's quiz to unlock it.", "warning");
    },
    start_exam: function(asmnt_id, asmnt_name, duration) {
      // console.log("start exam" + this.$store.getters.getAuthData.auth_user_id);

      this.$http
        .post("/api/user/Insert_assessment_time", {
          user_id: this.userId,
          duration: duration,
          assessment_id: asmnt_id
        })
        .then(() => {
          var det = btoa(asmnt_id + "," + asmnt_name);
          this.$router.push({
            path: "/assessments/assessment-exam",
            query: { assessment: det }
          });
          $("largeModal").modal("toggle");
        });
    },
    notifybuymsg: function(e) {
      e.stopPropagation();
      window.cvNotify("Buy this course to start learning", "warning");
    },
    notifymsg: function(e) {
      e.stopPropagation();

      if (
        this.topic_names[0].sch_id == 1 &&
        this.topic_names[0].purchases_status
      )
        return;
      {
        window.cvNotify("Buy this course to start learning", "warning");
        return;
      }
    },
    getServerTime: function() {
      this.$http.post("/api/user/getServerTime").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.serverTime = res.body.serverTime;
        }
      });
    },
    downloadCertificate: function() {
      var doc = new jsPDF("landscape", "px", "a4", true);
      var width = doc.internal.pageSize.width;
      var height = doc.internal.pageSize.height;
      var assessmentDone = false;
      var j = 0;
      for (var i = 0; i < this.assessments.length; i++) {
        if (this.assessments[i].score != null) {
          j++;
        }
      }

      if (this.userId == 0) {
        this.$router.push(
          "/login?redirect=" + encodeURIComponent(window.location.href)
        );
        return false;
      } else if (this.topic_names[0].tot_per < 100) {
        cvNotify(
          "You can not download the certificate before completing the course.",
          "warning"
        );
        return false;
      } else if (this.assessments.length != j) {
        cvNotify(
          "You can not download the certificate before attempting the assessments.",
          "warning"
        );
        return false;
      } else {
        doc.addImage(
          document.querySelector("#certificatetemplate"),
          "JPEG",
          0,
          0,
          width,
          height
        );
        doc.setFont("times");
        doc.setFontType("italic");
        doc.setTextColor("#000000");
        doc.setFontSize(20);
        doc.text(
          this.userDetail[0].name,
          width / 2 + 60,
          206,
          null,
          null,
          "center"
        );
        doc.text(
          this.userDetail[0].father_name,
          125,
          228,
          null,
          null,
          "center"
        );
        doc.text(
          this.userDetail[0].mother_name,
          width / 2 + 70,
          228,
          null,
          null,
          "center"
        );
        doc.text(
          this.topic_names[0].book_name,
          width / 2 + 155,
          250,
          null,
          null,
          "center"
        );
        doc.text(
          this.$moment(this.serverTime).format("DD/MM/YYYY"),
          width / 2 - 190,
          383,
          null,
          null,
          "center"
        );
        doc.save("Certificate.pdf");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.filled-stars {
  color: #ffa22b !important;
}
.disabled {
  opacity: 0.5;
}
.lesson-topics-list-done {
  font-size: 1rem;
  background: #efefef;
  border-radius: 8px;
  color: #0bb46e;
  background: none;
  padding: 4px;
}
.sub_topics_image {
  width: 16px;
  height: 16px;
  margin-right: 16px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  opacity: 0.4;
}
</style>
