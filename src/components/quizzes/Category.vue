<template>
  <div
    class="d-md-flex justify-content-left"
    style="position:relative; z-index:10; margin-top:-100px; "
  >
    <!--review for all-->
    <div class="cv-modal medium" id="quiz_reviews">
      <div style="padding: 24px 24px 8px;">
        <div
          class="header text-center"
          style="width:100%;"
          v-if="review_all.length"
        >
          <h3>
            {{ review_all[0].quiz_name ? review_all[0].quiz_name : "test" }}
            Reviews
          </h3>
        </div>
        <div class="body">
          <div
            class="lesson-cards testimonials-card"
            v-for="(review, rev_index) in review_all"
            v-bind:key="rev_index"
          >
            <div style="display:flex;flex-direction:row; width:100%;">
              <img
                :src="
                  review.profile_pic
                    ? '/assets/images/users/' + review.profile_pic
                    : '/assets/images/users/user.svg'
                "
                class="review-person"
                style="flex-shrink: 0;width:56px;height:56px;padding:4px;background:#ddd;border-radius: 50%;"
              />
              <div
                style="display:flex;flex-direction:column;margin-left:5%; width:100%;"
              >
                <div
                  style="display:flex;flex-direction:row;margin-top:5%;font-size:22px;min-width:100%;"
                >
                  <span style="flex-grow:3">{{
                    review.name ? review.name : "Test"
                  }}</span>
                  <!--<span class="text-right" style="flex-grow:1"><input id="star-rating" class="rating lesson-review-item-rating" type="text" :value="(review.obt_rat).toString()" data-size="xs"/></span>-->

                  <div
                    class="rating-container theme-krajee-fas rating-xs rating-animate is-display-only"
                  >
                    <div class="rating-stars" title="">
                      <span class="empty-stars">
                        <span class="star"><i class="far fa-star"></i></span
                        ><span class="star"><i class="far fa-star"></i></span
                        ><span class="star"><i class="far fa-star"></i></span
                        ><span class="star"><i class="far fa-star"></i></span
                        ><span class="star"><i class="far fa-star"></i></span
                      ></span>
                      <span
                        class="filled-stars"
                        :style="'width:' + review.obt_rat * 20 + '%;'"
                        ><span class="star"><i class="fas fa-star"></i></span
                        ><span class="star"><i class="fas fa-star"></i></span
                        ><span class="star"><i class="fas fa-star"></i></span
                        ><span class="star"><i class="fas fa-star"></i></span
                        ><span class="star"><i class="fas fa-star"></i></span
                      ></span>
                    </div>
                  </div>
                </div>
                <div
                  class="cv-testimonials"
                  style="line-height:1.44;letter-spacing:.5px; font-style:italic;padding-top:12px;padding-left:10px;padding-right:10px;text-align:left;margin-top:10px;"
                >
                  "{{ review.message }}"
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="p-2 text-right">
          <button class="btn btn-danger" onclick="hideModal('quiz_reviews')">
            Close
          </button>
        </div>
      </div>
    </div>
    <!--end review for all-->
    <!--quiz description for all-->
    <div class="cv-modal medium" id="quiz_description">
      <div style="padding: 24px 24px 8px;">
        <div class="header text-center" style="width:100%;">
          <h3>{{ quiz_desc_name }}</h3>
        </div>
        <div class="body">
          {{ quiz_desc_desc }}
        </div>
        <div class="p-2 text-right">
          <button
            class="btn btn-danger"
            onclick="hideModal('quiz_description')"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
    <!--end quiz description for all-->

    <div
      class="d-md-flex flex-column col-xl-8 col-md-8 home-card-2 pt-0 pl-0 pr-0 m-5"
    >
      <div class="col-xl-12 p-0">
        <!--tabs-->
        <div class="tab-menu-heading">
          <div class="tabs-menu ">
            <!-- Tabs -->
            <!--public and private Quizzes-->
            <div
              v-if="userId != 0 && sch_id != 1"
              class="tabs"
              style="display:flex;flex-direction:row;overflow:hidden;margin-bottom:10px;"
            >
              <div
                class="quizzes-types cv-quiz-active"
                id="public"
                @click="change_quizzes('public-quizzes')"
                style="height:100%;padding:8px; cursor:pointer;overflow:hidden;border-radius:8px;"
              >
                Public Quizzes
              </div>
              <div
                class="quizzes-types"
                id="school"
                @click="change_quizzes('school-quizzes')"
                style="height:100%;padding:8px;cursor:pointer;overflow:hidden;border-radius:8px"
              >
                Institute Quizzes
              </div>
              <i class="flex-grow-1" />
              <div
                class="quizzes-types"
                v-show="show_performace"
                @click="$router.push(`/quiz-progress`)"
                style="height:100%;padding:8px;cursor:pointer;overflow:hidden;border-radius:8px;"
              >
                <u>Quiz Performace</u>
              </div>
            </div>

            <!--end public and private Quizzes-->
            <!--public Quizzes-->
            <!-- subject tabs-->
            <div class="public-quizzes ">
              <ul class="nav panel-tabs">
                <template v-for="(subject, index) in subjects">
                  <span
                    v-bind:key="index"
                    style="display:flex;justify-content: space-around"
                  >
                    <li class="text-center" style="width:90px;">
                      <a
                        :id="'sub' + (index + 1)"
                        @click="switchSubject(index)"
                        :class="
                          [index == 0 ? 'active ' : ''] +
                            ' cv-tabs cv-pub-tab d-flex flex-column align-items-center'
                        "
                        data-toggle="tab"
                      >
                        <i
                          :class="[
                            subject.slug == 'html'
                              ? 'fab fa-html5'
                              : subject.slug == 'css'
                              ? 'fab fa-css3-alt'
                              : subject.slug == 'javascript'
                              ? 'fab fa-js-square'
                              : subject.slug == 'python'
                              ? 'fab fa-python'
                              : subject.slug == 'sql'
                              ? 'fas fa-server'
                              : 'fas fa-puzzle-piece'
                          ]"
                          style="font-size:40px;"
                        ></i>
                        <span>{{ subject.subject }}</span></a
                      >
                    </li>
                  </span>
                </template>
              </ul>
              <!-- end subject tabs-->
              <!--quizzes start -->
              <div class="panel-body mt-2">
                <div
                  class="tab-content"
                  v-for="(subject, index1) in subjects"
                  v-bind:key="index1"
                >
                  <div
                    :class="
                      'tab-pane public-pane' + [index1 == 0 ? ' active' : '']
                    "
                    :id="'tab' + (index1 + 1)"
                  >
                    <!--quiz design-->

                    <div
                      class="d-flex flex-wrap"
                      v-if="
                        quizzes && quizzes.length
                          ? quizzes.findIndex(
                              x => x.sub_id === subjects[index1].sub_id
                            ) != -1
                          : false
                      "
                    >
                      <div
                        class="text-center w-100"
                        style="color:#cc;padding:24px;"
                        v-if="
                          userId && (quizzes && quizzes.length)
                            ? quizzes[
                                parseInt(
                                  quizzes.findIndex(
                                    x => x.sub_id === subjects[index1].sub_id
                                  )
                                )
                              ].quiz_total_quiz ==
                              quizzes[
                                parseInt(
                                  quizzes.findIndex(
                                    x => x.sub_id === subjects[index1].sub_id
                                  )
                                )
                              ].total_quiz_attempt
                              ? true
                              : false
                            : false
                        "
                      >
                        There are no Quizzes!
                      </div>
                      <template v-for="(quiz, quiz_index) in quizzes">
                        <div
                          class=" quizzes-card col-md-6 col-xl-4 "
                          v-bind:key="quiz_index"
                          v-if="
                            quiz.sub_id == subjects[index1].sub_id &&
                              quiz.attempted_question != quiz.no_of_questions
                          "
                        >
                          <!--new card-->
                          <div class="card border p-0">
                            <div class="item-card2-img" style="height:180px;">
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
                                  class="text-white bg-warning p-1 "
                                  style="border-radius:3px;z-index:9999; position:relative"
                                  :title="
                                    quiz.no_of_questions + ' users attempted'
                                  "
                                  ><i
                                    class="fa fa-paper-plane"
                                    data-toggle="tooltip"
                                    title="fa fa-paper-plane"
                                  ></i>
                                  {{ quiz.total_attempted }}</span
                                >
                              </div>
                              <div class="item-tag" style="left:15px;">
                                <span
                                  class="text-white bg-primary p-1"
                                  style="border-radius:3px;"
                                  >Questions: {{ quiz.no_of_questions }}</span
                                >
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
                            <div class="card-body ">
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
                                    style="font-size:12px;"
                                  >
                                    By: <i class="icon icon-user mr-1"></i
                                    ><span
                                      class=""
                                      style="font-size:12px;"
                                      v-html="
                                        quiz.name ? quiz.name : 'Codevidhya'
                                      "
                                    ></span>
                                  </div>
                                  <p
                                    style="font-size:16px; color:#5e748e;"
                                    v-if="quiz.quiz_desc"
                                    v-html="
                                      quiz.quiz_desc.length >= 30
                                        ? quiz.quiz_desc.substring(0, 27) +
                                          '...'
                                        : quiz.quiz_desc
                                    "
                                  ></p>
                                </div>
                                <div v-if="quiz.rating" class="">
                                  <span
                                    class="rating-stars d-inline-block mr-2"
                                  >
                                    <span class="empty-stars">
                                      <span class="star"
                                        ><i class="fas fa-star"></i
                                      ></span>
                                      <span class="star"
                                        ><i class="fas fa-star"></i
                                      ></span>
                                      <span class="star"
                                        ><i class="fas fa-star"></i
                                      ></span>
                                      <span class="star"
                                        ><i class="fas fa-star"></i
                                      ></span>
                                      <span class="star"
                                        ><i class="fas fa-star"></i
                                      ></span>
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
                                      <span class="star"
                                        ><i class="fas fa-star"></i
                                      ></span>
                                      <span class="star"
                                        ><i class="fas fa-star"></i
                                      ></span>
                                      <span class="star"
                                        ><i class="fas fa-star"></i
                                      ></span>
                                      <span class="star"
                                        ><i class="fas fa-star"></i
                                      ></span>
                                      <span class="star"
                                        ><i class="fas fa-star"></i
                                      ></span>
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
                                  <!--<span v-if="(quiz.quiz_desc) && ((quiz.quiz_desc).length >=30)" class="my-auto text-dark" style="cursor:pointer" @click="learn_more(quiz.quiz_name,quiz.quiz_desc)">Learn More</span>-->
                                  <!-- (quiz.price == 0 || quiz.status) &&
                                      !quiz.attempted_question
                                        ? 'Learn More'
                                        : (quiz.price == 0 || quiz.status) &&
                                          quiz.attempted_question
                                        ? 'Resume'
                                        : 'Unlock (Rs. ' + quiz.price + ')'-->
                                  <div class="product-item-price">
                                    <span
                                      class="newprice text-dark"
                                      style="font-size:14px;"
                                    >
                                      {{
                                        quiz.price
                                          ? "Rs. " + quiz.price
                                          : "Free"
                                      }}</span
                                    >
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
                      <!--end Quiz card-->
                    </div>
                    <div
                      v-else
                      class="text-center"
                      style="color:#cc;padding:24px;"
                    >
                      There are no Quizzes!
                    </div>

                    <!--end quiz design-->
                  </div>
                </div>
              </div>
            </div>
            <!--end quiz start-->
            <!--end public Quizzes-->

            <!--School Quizzes-->
            <!-- subject tabs-->
            <div class="school-quizzes" style="display:none">
              <ul class="nav panel-tabs">
                <template v-for="(subject, index) in subjects">
                  <span
                    v-bind:key="index"
                    style="display:flex;justify-content: space-around"
                  >
                    <li class="text-center" style="width:90px;">
                      <a
                        :id="'sch_sub' + (index + 1)"
                        @click="switchSubject2(index)"
                        :class="
                          [index == 0 ? 'active' : ''] +
                            ' cv-sch-tabs cv-tabs d-flex flex-column align-items-center'
                        "
                        data-toggle="tab"
                        style="display:flex;flex-direction:column"
                      >
                        <i
                          :class="[
                            subject.slug == 'html'
                              ? 'fab fa-html5'
                              : subject.slug == 'css'
                              ? 'fab fa-css3-alt'
                              : subject.slug == 'javascript'
                              ? 'fab fa-js-square'
                              : subject.slug == 'python'
                              ? 'fab fa-python'
                              : 'fas fa-server'
                          ]"
                          style="font-size:40px;"
                        ></i>
                        <span>{{ subject.subject }}</span></a
                      >
                    </li>
                  </span>
                </template>
              </ul>
              <!-- end subject tabs-->
              <!--quizzes start -->
              <div class="panel-body mt-2">
                <div
                  class="tab-content"
                  v-for="(subject, index1) in subjects"
                  v-bind:key="index1"
                >
                  <div
                    :class="
                      'tab-sch-pane tab-pane' + [index1 == 0 ? ' active' : '']
                    "
                    :id="'tab-sch' + (index1 + 1)"
                  >
                    <!--quiz design-->

                    <div
                      class="d-flex flex-wrap"
                      v-if="
                        sch_quizzess && sch_quizzess.length
                          ? sch_quizzess.findIndex(
                              x => x.sub_id === subjects[index1].sub_id
                            ) != -1
                          : false
                      "
                    >
                      <!--Quiz card-->
                      <div
                        class="text-center w-100"
                        style="color:#cc;padding:24px;"
                        v-if="
                          sch_quizzess && sch_quizzess.length
                            ? sch_quizzess[
                                parseInt(
                                  sch_quizzess.findIndex(
                                    x => x.sub_id === subjects[index1].sub_id
                                  )
                                )
                              ].quiz_total_quiz ==
                              sch_quizzess[
                                parseInt(
                                  sch_quizzess.findIndex(
                                    x => x.sub_id === subjects[index1].sub_id
                                  )
                                )
                              ].total_quiz_attempt
                              ? true
                              : false
                            : false
                        "
                      >
                        There are no Quizzes!
                      </div>
                      <template v-for="(quiz, quiz_index) in sch_quizzess">
                        <div
                          class=" quizzes-card col-md-4 col-xl-4"
                          v-bind:key="quiz_index"
                          v-if="
                            quiz.sub_id == subjects[index1].sub_id &&
                              quiz.attempted_question != quiz.no_of_questions
                          "
                        >
                          <!--new card-->
                          <div class="card">
                            <div class="item-card2-img" style="height:180px;">
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
                                  style="border-radius:3px;z-index:1; position:relative"
                                  :title="
                                    quiz.no_of_questions + ' users attempted'
                                  "
                                  ><i
                                    class="fa fa-paper-plane"
                                    data-toggle="tooltip"
                                    title="fa fa-paper-plane"
                                  ></i>
                                  {{ quiz.total_attempted }}</span
                                >
                              </div>
                              <div class="item-tag" style="left:15px;">
                                <span
                                  class="text-white bg-primary p-1"
                                  style="border-radius:3px;"
                                  >Questions: {{ quiz.no_of_questions }}</span
                                >
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
                                      quiz.quiz_name ? quiz.quiz_name : 'test'
                                    "
                                  ></h4>
                                  <div
                                    class="mb-1 text-muted"
                                    style="font-size:12px;"
                                  >
                                    By: <i class="icon icon-user mr-1"></i
                                    ><span
                                      class=""
                                      style="font-size:12px;"
                                      v-html="
                                        quiz.name ? quiz.name : 'Codevidhya'
                                      "
                                    ></span>
                                  </div>
                                  <p
                                    style="font-size:16px; color:#5e748e;"
                                    v-if="quiz.quiz_desc"
                                    v-html="
                                      quiz.quiz_desc.length >= 30
                                        ? quiz.quiz_desc.substring(0, 30) +
                                          '...'
                                        : quiz.quiz_desc
                                    "
                                  ></p>
                                </div>
                                <div v-if="quiz.rating" class="">
                                  <span
                                    class="rating-stars d-inline-block mr-2"
                                  >
                                    <span class="empty-stars">
                                      <span class="star"
                                        ><i class="fas fa-star"></i
                                      ></span>
                                      <span class="star"
                                        ><i class="fas fa-star"></i
                                      ></span>
                                      <span class="star"
                                        ><i class="fas fa-star"></i
                                      ></span>
                                      <span class="star"
                                        ><i class="fas fa-star"></i
                                      ></span>
                                      <span class="star"
                                        ><i class="fas fa-star"></i
                                      ></span>
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
                                      <span class="star"
                                        ><i class="fas fa-star"></i
                                      ></span>
                                      <span class="star"
                                        ><i class="fas fa-star"></i
                                      ></span>
                                      <span class="star"
                                        ><i class="fas fa-star"></i
                                      ></span>
                                      <span class="star"
                                        ><i class="fas fa-star"></i
                                      ></span>
                                      <span class="star"
                                        ><i class="fas fa-star"></i
                                      ></span>
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
                                  <!-- <span v-if="(quiz.quiz_desc) && ((quiz.quiz_desc).length >=30)" class="my-auto text-dark" style="cursor:pointer" @click="learn_more(quiz.quiz_name,quiz.quiz_desc)">Learn More</span>-->

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
                                    v-html="
                                      (quiz.price == 0 || quiz.status) &&
                                      !quiz.attempted_question
                                        ? 'Learn More'
                                        : (quiz.price == 0 || quiz.status) &&
                                          quiz.attempted_question
                                        ? 'Resume'
                                        : 'Unlock (Rs. ' + quiz.price + ')'
                                    "
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
                      <!--end Quiz card-->
                    </div>
                    <div
                      v-else
                      class="text-center"
                      style="color:#cc;padding:24px;"
                    >
                      There are no Quizzes!
                    </div>
                    <!--end Quiz-->
                  </div>
                </div>
              </div>
            </div>
            <!--end quiz start-->
            <!--end School Quizzes-->
          </div>
        </div>

        <!--end tabs-->
      </div>
    </div>
    <slot></slot>
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
export default {
  props: [
    "subjects",
    "userId",
    "sch_id",
    "quizzes",
    "sch_quizzess",
    "review_all",
    "quiz_reviews",
    "top_users",
    "show_performace"
  ],
  data() {
    return {
      quiz_desc_name: "",
      quiz_desc_desc: ""
    };
  },

  updated() {
    $(".lesson-review-item-rating").rating({
      displayOnly: true,
      theme: "krajee-fas",
      showCaption: false
    });
  },

  methods: {
    learn_more: function(quiz_name, quiz_desc) {
      this.quiz_desc_name = quiz_name;
      this.quiz_desc_desc = quiz_desc;
      showModal("quiz_description");
    },
    quiz_action: function(quiz) {
      // console.log(quiz);
      //if((quiz.price == 0 || quiz.status) && (quiz.no_of_questions !=quiz.attempted_question))
      {
        this.$router.push("/quiz-instruction?id=" + quiz.quiz_id);
      }
      /* else
         {
          this.$router.push('/checkout?product_name=' +quiz.slug+'&id='+quiz.product_id+'&sub_id='+quiz.sub_id+'&type=quiz');
         }*/

      /*
      userId
                                        ? (quiz.price == 0 || quiz.status) &&
                                          quiz.no_of_questions !=
                                            quiz.attempted_question
                                          ? $router.push({
                                              name: 'quiz-exam',
                                              params: {
                                                quiz_slug: quiz.slug,
                                                quiz_id: quiz.quiz_id,
                                                sub_id: quiz.sub_id
                                              }
                                            })
                                          : quiz.no_of_questions ==
                                            quiz.attempted_question
                                          ? nofiyCompleteExam(quiz.quiz_id)
                                          : $router.push('/checkout?product_name=' +quiz.slug+'&id='+quiz.quiz_id+'sub_id='+quiz.sub_id+'&type=quiz')
                                        : login_quiz()
      */
    },
    switchSubject: function(e) {
      let index = e + 1;
      window.jQuery(".cv-pub-tab.active").removeClass("active");
      window.jQuery("#sub" + index).addClass("active");
      window.jQuery(".public-pane.active").removeClass("active");
      window.jQuery("#tab" + index).addClass("active");
    },
    switchSubject2: function(e) {
      let index = e + 1;
      window.jQuery(".cv-sch-tabs.active").removeClass("active");
      window.jQuery("#sch_sub" + index).addClass("active");
      window.jQuery(".tab-sch-pane").removeClass("active");
      window.jQuery("#tab-sch" + index).addClass("active");
    },
    change_quizzes: function(cat_type) {
      window
        .jQuery(".quizzes-types.cv-quiz-active")
        .removeClass("cv-quiz-active");
      if (cat_type == "public-quizzes") {
        window.jQuery("#public").addClass("cv-quiz-active");
        window.jQuery("." + cat_type).show();
        window.jQuery(".school-quizzes").hide();
      } else if (cat_type == "school-quizzes") {
        window.jQuery("#school").addClass("cv-quiz-active");
        window.jQuery("." + cat_type).show();
        window.jQuery(".public-quizzes").hide();
      }
    }
  }
};
</script>
<style lang="scss">
a.active {
  border-radius: 8px !important;
}
.cv-quiz-active {
  background: #ec296b;
  color: #fff;
}
.scoreNum {
  // background: #ffaaaa;

  font-weight: 700;
  border-radius: 4px;
  padding: 4px 12px;
}
.scoreUser {
  width: 160px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  > img {
    width: 32px;
    height: 32px;
    padding: 2px;
    background: #d9e8fb;
    border-radius: 50%;
    margin-right: 8px;
  }
}
.scoreScore {
  width: 82px;
  font-weight: 600;
  > img {
    width: 32px;
    height: 32px;
    margin-right: 2px;
  }
}
.scoreHover {
  > .row:hover {
    background: #ffaaaa;
    color: #fff;
    cursor: pointer;
  }
}
</style>
