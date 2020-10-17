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
          <h1>hello</h1>
          <p>
            it improve ypur ait improve ypur all skillit improve ypur all
            skillit improve ypur all skillll skill it improve ypur ait improve
            ypur all skillit improve ypur all skillit improve ypur all skillll
            skill it improve ypur ait improve ypur all skillit improve ypur all
            skillit improve ypur all skillll skill it improve ypur ait improve
            ypur all skillit improve ypur all skillit improve ypur all skillll
            skill
          </p>
          <!-- Attempted date-->
          <div class="text-left">
            <span class="text-success">
              <b
                >Attempted at:
                {{ $moment(quizzes[0].attempted_at).format("LL") }}</b
              ></span
            >
          </div>
          <!-- date ended-->

          <!-- attempted no. of users-->
          <div class="mb-0 text-left">
            {{ quizzes[0].total_attempted ? quizzes[0].total_attempted : 0 }}
            attempted users
          </div>
          <!-- no of users ended-->
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
              <div class="quizzes-types" @click="$router.push(`/quizzes`)" style="height:100%;padding:8px;cursor:pointer;overflow:hidden;border-radius:8px;"><u>More quizzes</u></div>
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
                      'tab-pane public-pane' + [index1 == 0 ? ' active' : '']
                    "
                    :id="'tab' + (index1 + 1)"
                  >
                    <!--quiz design-->

                    <div
                      class="d-flex flex-wrap"
                      v-if="
                        quizzes.length
                          ? quizzes.findIndex(
                              x => x.sub_id === subjects[index1].sub_id
                            ) != -1
                          : false
                      "
                    >
                      <!--Quiz card-->

                      <template v-for="(quiz, quizr_index) in quizzes">
                        <div
                          class=" quizzes-card col-md-12 col-xl-4"
                          v-bind:key="quizr_index"
                          v-if="quiz.sub_id == subjects[index1].sub_id"
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

                              <div class="item-tag" style="left:10px;">
                                <span
                                  class="text-white bg-primary p-2"
                                  style="border-radius:3px;"
                                  >Obt. Points: {{ quiz.obtained }}</span
                                >
                              </div>
                              <div class="item-tag" style="right:10px;">
                                <span
                                  class="text-white bg-primary p-2"
                                  style="border-radius:3px;"
                                  >Total Points:{{ quiz.total_points }}</span
                                >
                              </div>
                            </div>
                            <!--<div class="item-tag" style="top:15px;">
                                <span class="text-white bg-warning p-1" style="border-radius:3px;">{{quiz.total_attempted?quiz.total_attempted:0}}  Students</span>
                          </div>-->
                            <div class="item-card2-icons">
                              <div class="dropdown show">
                                <a
                                  role="button"
                                  id="dropdownMenuLink"
                                  data-toggle="dropdown"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                  class="item-card-8-icons-l bg-danger text-center"
                                >
                                  <i
                                    class="fa fa-share-alt"
                                    style="color:#fff"
                                  ></i>
                                </a>
                                <div
                                  class="dropdown-menu"
                                  aria-labelledby="dropdownMenuLink"
                                >
                                  <a
                                    class="dropdown-item text-center"
                                    @click="
                                      SharedCode(
                                        'facebook',
                                        quiz.obtained,
                                        quiz.total_points,
                                        quiz.quiz_name,
                                        quiz.quiz_id,
                                        quiz.quiz_slug
                                      )
                                    "
                                    style="background:#fff; color:#fff; display:inline-block; padding:5px; margin:5px;;cursor:pointer"
                                    ><i
                                      class="fab fa-facebook-square fa-2x"
                                      style="color:#3b5998;background:#fff"
                                    ></i>
                                  </a>
                                  <a
                                    class="dropdown-item text-center"
                                    @click="
                                      SharedCode(
                                        'twitter',
                                        quiz.obtained,
                                        quiz.total_points,
                                        quiz.quiz_name,
                                        quiz.quiz_id,
                                        quiz.quiz_slug
                                      )
                                    "
                                    style="background:#fff; color:#fff; display:inline-block; padding:5px; margin:5px;;cursor:pointer"
                                    ><i
                                      class="fab fa-twitter fa-2x"
                                      style="color:#00acee;background:#fff"
                                    ></i>
                                  </a>

                                  <a
                                    class="dropdown-item text-center"
                                    @click="
                                      SharedCode(
                                        'linkedin',
                                        quiz.obtained,
                                        quiz.total_points,
                                        quiz.quiz_name,
                                        quiz.quiz_id,
                                        quiz.quiz_slug
                                      )
                                    "
                                    style="background:#fff; color:#fff; display:inline-block; padding:5px; margin:5px;;cursor:pointer"
                                    ><i
                                      class="fab fa-linkedin fa-2x"
                                      style="color:#0e76a8;background:#fff"
                                    ></i>
                                  </a>
                                  <a
                                    class="dropdown-item text-center"
                                    @click="
                                      SharedCode(
                                        'whatsapp',
                                        quiz.obtained,
                                        quiz.total_points,
                                        quiz.quiz_name,
                                        quiz.quiz_id,
                                        quiz.quiz_slug
                                      )
                                    "
                                    style="background:#fff; color:#fff; display:inline-block; padding:5px; margin:5px;;cursor:pointer"
                                  >
                                    <i
                                      class="fab fa-whatsapp fa-2x"
                                      style="background:linear-gradient(#25d366,#25d366)10px 84%/10px 15px no-repeat,radial-gradient(#25d366 60%,transparent 0);color:#fff;font-size: 2em;"
                                    ></i>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <!--card body-->
                            <div class="card-body">
                              <div class="item-card2">
                                <div class="item-card2-desc">
                                  <div class="item-card2-text mb-3 text-dark">
                                    <h4
                                      class="mb-1"
                                      v-html="
                                        quiz.quiz_name ? quiz.quiz_name : 'test'
                                      "
                                    ></h4>
                                    <!-- created by-->
                                    <div
                                      class="product-item-price mb-1 text-muted"
                                    >
                                      By: <i class="icon icon-user mr-1"></i>
                                      <span
                                        class="newprice"
                                        style="font-size:12px;"
                                        v-html="
                                          quiz.name ? quiz.name : 'Codevidhya'
                                        "
                                      ></span>
                                    </div>
                                    <!-- created by ended-->

                                    <div
                                      style="display:block; width:100% !important; min-width:100%;"
                                    >
                                      <p
                                        style="font-size:16px;"
                                        v-if="quiz.quiz_desc"
                                        v-html="
                                          quiz.quiz_desc.length >= 30
                                            ? quiz.quiz_desc.substring(0, 27) +
                                              '...'
                                            : quiz.quiz_desc
                                        "
                                      ></p>
                                    </div>
                                    <div class="">
                                      <ul class="">
                                        <li class="">
                                          <!--<i class="icon icon-user mr-1"></i> {{quiz.name}}-->
                                          <span
                                            v-if="quiz.rating"
                                            class="mt-1 mb-0"
                                          >
                                            <div
                                              class="rating-stars flex-grow-1 mb-0 mt-1"
                                              style="display:block; width:100%;"
                                            >
                                              <div>
                                                <span class="empty-stars">
                                                  <span class="star"
                                                    ><i
                                                      class="fas fa-star"
                                                    ></i></span
                                                  ><span class="star"
                                                    ><i
                                                      class="fas fa-star"
                                                    ></i></span
                                                  ><span class="star"
                                                    ><i
                                                      class="fas fa-star"
                                                    ></i></span
                                                  ><span class="star"
                                                    ><i
                                                      class="fas fa-star"
                                                    ></i></span
                                                  ><span class="star"
                                                    ><i
                                                      class="fas fa-star"
                                                    ></i></span
                                                ></span>
                                                <span
                                                  class="filled-stars"
                                                  :style="
                                                    'width:' +
                                                      (quiz.rating
                                                        ? quiz.rating * 20
                                                        : 90) +
                                                      '%'
                                                  "
                                                  ><span class="star"
                                                    ><i
                                                      class="fas fa-star"
                                                    ></i></span
                                                  ><span class="star"
                                                    ><i
                                                      class="fas fa-star"
                                                    ></i></span
                                                  ><span class="star"
                                                    ><i
                                                      class="fas fa-star"
                                                    ></i></span
                                                  ><span class="star"
                                                    ><i
                                                      class="fas fa-star"
                                                    ></i></span
                                                  ><span class="star"
                                                    ><i
                                                      class="fas fa-star"
                                                    ></i></span
                                                ></span>
                                              </div>
                                            </div>
                                            <!--<span class="flex-grow-1 mx-1" style="cursor:pointer"
                                      @click="quiz_reviews(quiz.quiz_id)"><u>View all</u></span>-->
                                          </span>
                                          <div
                                            v-else
                                            class="flex-fill bg-danger"
                                          ></div>
                                          <!--</li>
                                     <li class="text-right flex-fill">
                                   <button v-if="(quiz.quiz_desc) && (quiz.quiz_desc.length >=30)" class="learn-more-btn" style="background:#48c9b0;padding: 4px 8px;color: #fff;border-radius: 2px;" @click="learn_more(quiz.quiz_name,quiz.quiz_desc)">Learn More</button>-->
                                        </li>

                                        <li class="text-left">
                                          <!-- <div class="mb-0 text-left">{{quiz.total_attempted?quiz.total_attempted:0}} attempted users</div>-->
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <!--<div class="text-left">
                              <span class="text-success"
                                    ><b>Attempted at: {{
                                      $moment(quiz.attempted_at).format("LL")
                                    }}</b></span></div>-->
                            <!--end card body-->
                            <!--card footer-->
                            <div class="card-footer">
                              <div class="item-card2-footer">
                                <div class="item-card2-footer-u">
                                  <div class="product-item-wrap d-flex">
                                    <div class="product-item-price">
                                      <!--<button v-if="quiz.quiz_desc.length >=30" class="learn-more-btn" style="background:#48c9b0;margin:0px;padding: 4px 8px;color: #fff;border-radius: 2px;" @click="learn_more(quiz.quiz_name,quiz.quiz_desc)">Learn More</button>-->
                                      <button
                                        class="btn btn-primary  ml-auto priceunlocked"
                                        style="border-radius: 4px; width: auto;"
                                        @click="
                                          $router.push(
                                            '/quiz-result?id=' + quiz.quiz_id
                                          )
                                        "
                                      >
                                        Learn More
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <!--end card footer-->
                          </div>
                          <!--end new card-->
                          <!--<div class="card ">
                            <div
                              class="card-body text-left m-0 p-0 d-flex align-content-center flex-wrap"
                            >
                              <div class="row m-0 p-2">
                                <div
                                  class="col-sm-6 border-right border-bottom d-flex align-content-center flex-wrap flex-grow-1"
                                >
                                  <p class="col-sm-12 m-0 p-0">
                                    {{
                                      quiz.quiz_name ? quiz.quiz_name : "test"
                                    }}
                                  </p>
                                  <span
                                    v-if="quiz.rating"
                                    class="d-flex flex-direction-column flex-wrap mt-3"
                                  >
                                    <div class="rating-stars flex-grow-1">
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
                                              (quiz.rating
                                                ? quiz.rating * 20
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
                                    <span
                                      class="flex-grow-1 mx-1"
                                      style="cursor:pointer"
                                      @click="quiz_reviews(quiz.quiz_id)"
                                      ><u>View all</u></span
                                    ></span
                                  >
                                  <span class="text-success"
                                    ><b>{{
                                      $moment(quiz.attempted_at).format("LL")
                                    }}</b></span
                                  >
                                </div>
                                <div
                                  class="col-sm-6 d-flex align-content-center flex-wrap flex-grow-1"
                                >
                                  <p class="col-sm-12 p-2">
                                    Obained Points: {{ quiz.obtained }}
                                  </p>
                                  <p class="col-sm-12 p-2">
                                    Total Points:{{ quiz.total_points }}
                                  </p>
                                
                                   <div class="dropdown show">
                                    <a
                                      class="btn btn-primary price dropdown-toggle"
                                      href="#"
                                      role="button"
                                      id="dropdownMenuLink"
                                      data-toggle="dropdown"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                    >
                                      Social share
                                    </a>

                                    <div
                                      class="dropdown-menu"
                                      aria-labelledby="dropdownMenuLink"
                                    >
                                      <a
                                        class="dropdown-item"
                                        href=""
                                        @click="
                                          SharedCode(
                                            'facebook',
                                            quiz.obtained,
                                            quiz.total_points,
                                            quiz.quiz_name,
                                            quiz.quiz_id,
                                            quiz.quiz_slug
                                          )
                                        "
                                        ><i class="fab fa-facebook-square"></i>
                                        Facebook</a
                                      >
                                      <a
                                        class="dropdown-item"
                                        href=""
                                        @click="
                                          SharedCode(
                                            'twitter',
                                            quiz.obtained,
                                            quiz.total_points,
                                            quiz.quiz_name,
                                            quiz.quiz_id,
                                            quiz.quiz_slug
                                          )
                                        "
                                        ><i class="fab fa-twitter"></i>
                                        Twitter</a
                                      >
                              
                                      <a
                                        class="dropdown-item"
                                        href=""
                                        @click="
                                          SharedCode(
                                            'linkedin',
                                            quiz.obtained,
                                            quiz.total_points,
                                            quiz.quiz_name,
                                            quiz.quiz_id,
                                            quiz.quiz_slug
                                          )
                                        "
                                        ><i class="fab fa-linkedin"></i>
                                        Linkedin</a
                                      >
                                      <a
                                        class="dropdown-item"
                                        href="#"
                                        @click="
                                          SharedCode(
                                            'whatsapp',
                                            quiz.obtained,
                                            quiz.total_points,
                                            quiz.quiz_name,
                                            quiz.quiz_id,
                                            quiz.quiz_slug
                                          )
                                        "
                                        ><i class="fab fa-whatsapp"></i>
                                        Whatsapp</a
                                      >
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>-->
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
                        sch_quizzess.length
                          ? sch_quizzess.findIndex(
                              x => x.sub_id === subjects[index1].sub_id
                            ) != -1
                          : false
                      "
                    >
                      <!--Quiz card-->
                      <template v-for="(quiz, quiz_index) in sch_quizzess">
                        <div
                          class=" quizzes-card col-md-12 col-xl-4"
                          v-bind:key="quiz_index"
                          v-if="quiz.sub_id == subjects[index1].sub_id"
                        >
                          <!--new card-->
                          <div class="card border p-0 mb-0">
                            <div class="item-card2-img">
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
                                style="background:#33E0FF; height:150px;"
                              />

                              <div class="item-tag" style="left:10px;">
                                <span
                                  class="text-white bg-primary p-2"
                                  style="font-size:12px;"
                                  >Obtained points: {{ quiz.obtained }}</span
                                >
                              </div>
                              <div class="item-tag" style="right:10px;">
                                <span
                                  class="text-white bg-primary p-2"
                                  style="font-size:12px;"
                                  >Total points:{{ quiz.total_points }}</span
                                >
                              </div>
                            </div>
                            <div class="item-card2-icons">
                              <div class="dropdown show">
                                <a
                                  role="button"
                                  id="dropdownMenuLink"
                                  data-toggle="dropdown"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                  class="item-card-8-icons-l bg-danger"
                                >
                                  <i
                                    class="fa fa-share-alt"
                                    style="color:#fff"
                                  ></i>
                                </a>
                                <div
                                  class="dropdown-menu"
                                  aria-labelledby="dropdownMenuLink"
                                >
                                  <a
                                    class="dropdown-item text-center"
                                    @click="
                                      SharedCode(
                                        'facebook',
                                        quiz.obtained,
                                        quiz.total_points,
                                        quiz.quiz_name,
                                        quiz.quiz_id,
                                        quiz.quiz_slug
                                      )
                                    "
                                    style="background:#fff; color:#fff; display:inline-block; padding:5px; margin:5px;cursor:pointer"
                                  >
                                    <i
                                      class="fab fa-facebook-square fa-2x"
                                      style="color:#3b5998;background:#fff"
                                    ></i>
                                  </a>
                                  <a
                                    class="dropdown-item text-center"
                                    @click="
                                      SharedCode(
                                        'twitter',
                                        quiz.obtained,
                                        quiz.total_points,
                                        quiz.quiz_name,
                                        quiz.quiz_id,
                                        quiz.quiz_slug
                                      )
                                    "
                                    style="background:#fff; color:#fff; display:inline-block; padding:5px; margin:5px;;cursor:pointer"
                                  >
                                    <i
                                      class="fab fa-twitter fa-2x"
                                      style="color:#00acee;background:#fff"
                                    ></i>
                                  </a>

                                  <a
                                    class="dropdown-item text-center"
                                    @click="
                                      SharedCode(
                                        'linkedin',
                                        quiz.obtained,
                                        quiz.total_points,
                                        quiz.quiz_name,
                                        quiz.quiz_id,
                                        quiz.quiz_slug
                                      )
                                    "
                                    style="background:#fff; color:#fff; display:inline-block; padding:5px; margin:5px;;cursor:pointer"
                                  >
                                    <i
                                      class="fab fa-linkedin fa-2x"
                                      style="color:#0e76a8;background:#fff"
                                    ></i>
                                  </a>
                                  <a
                                    class="dropdown-item text-center"
                                    @click="
                                      SharedCode(
                                        'whatsapp',
                                        quiz.obtained,
                                        quiz.total_points,
                                        quiz.quiz_name,
                                        quiz.quiz_id,
                                        quiz.quiz_slug
                                      )
                                    "
                                    style="background:#fff; color:#fff; display:inline-block; padding:5px; margin:5px;;cursor:pointer"
                                  >
                                    <i
                                      class="fab fa-whatsapp fa-2x"
                                      style="background:linear-gradient(#25d366,#25d366)10px 84%/10px 15px no-repeat,radial-gradient(#25d366 60%,transparent 0);color:#fff"
                                    ></i>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <!--card body-->
                            <div class="card-body ">
                              <div class="item-card2">
                                <div class="item-card2-desc">
                                  <div class="item-card2-text mb-3 text-dark">
                                    <h4
                                      class="mb-1"
                                      v-html="
                                        quiz.quiz_name ? quiz.quiz_name : 'test'
                                      "
                                    ></h4>

                                    <!-- created by-->
                                    <div class="product-item-price mb-2 mt-2">
                                      <i class="icon icon-user mr-1"></i> By:
                                      <span
                                        class="newprice text-dark"
                                        style="font-size:12px;"
                                        v-html="
                                          quiz.name ? quiz.name : 'Codevidhya'
                                        "
                                      ></span>
                                    </div>
                                    <!-- created by ended-->

                                    <div
                                      style="display:block; width:100% !important; min-width:100%;"
                                    >
                                      <p
                                        style="font-size:13px;"
                                        v-if="quiz.quiz_desc"
                                        v-html="
                                          quiz.quiz_desc.length >= 30
                                            ? quiz.quiz_desc.substring(0, 30) +
                                              '...'
                                            : quiz.quiz_desc
                                        "
                                      ></p>
                                    </div>

                                    <div class="">
                                      <ul>
                                        <li class="">
                                          <!--<i class="icon icon-user mr-1"></i> {{quiz.name}}-->
                                          <span
                                            v-if="quiz.rating"
                                            class="d-flex flex-direction-column flex-wrap mt-3"
                                          >
                                            <div
                                              class="rating-stars flex-grow-1"
                                            >
                                              <div>
                                                <span class="empty-stars">
                                                  <span class="star"
                                                    ><i
                                                      class="fas fa-star"
                                                    ></i></span
                                                  ><span class="star"
                                                    ><i
                                                      class="fas fa-star"
                                                    ></i></span
                                                  ><span class="star"
                                                    ><i
                                                      class="fas fa-star"
                                                    ></i></span
                                                  ><span class="star"
                                                    ><i
                                                      class="fas fa-star"
                                                    ></i></span
                                                  ><span class="star"
                                                    ><i
                                                      class="fas fa-star"
                                                    ></i></span
                                                ></span>
                                                <span
                                                  class="filled-stars"
                                                  :style="
                                                    'width:' +
                                                      (quiz.rating
                                                        ? quiz.rating * 20
                                                        : 90) +
                                                      '%'
                                                  "
                                                  ><span class="star"
                                                    ><i
                                                      class="fas fa-star"
                                                    ></i></span
                                                  ><span class="star"
                                                    ><i
                                                      class="fas fa-star"
                                                    ></i></span
                                                  ><span class="star"
                                                    ><i
                                                      class="fas fa-star"
                                                    ></i></span
                                                  ><span class="star"
                                                    ><i
                                                      class="fas fa-star"
                                                    ></i></span
                                                  ><span class="star"
                                                    ><i
                                                      class="fas fa-star"
                                                    ></i></span
                                                ></span>
                                              </div>
                                            </div>
                                          </span>

                                          <div v-else class="flex-fill"></div>
                                        </li>
                                        <!--<li class="text-right flex-fill">
                                     <button v-if="(quiz.quiz_desc)&& (quiz.quiz_desc.length >=30)" class="learn-more-btn" style="background:#48c9b0;padding: 4px 8px;color: #fff;border-radius: 2px;" @click="learn_more(quiz.quiz_name,quiz.quiz_desc)">Learn More</button>
                                   </li>-->
                                        <li class="text-left">
                                          <!-- <div class="mb-0 text-left">{{quiz.total_attempted?quiz.total_attempted:0}} attempted users</div>-->
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <!--<div class="text-left">
                              <span class="text-success"
                                    ><b>Attempted at: {{
                                      $moment(quiz.attempted_at).format("LL")
                                    }}</b></span></div>-->
                            <!--end card body-->
                            <!--card footer-->
                            <div class="card-footer">
                              <div class="item-card2-footer">
                                <div class="item-card2-footer-u">
                                  <div class="product-item-wrap d-flex">
                                    <div class="product-item-price">
                                      <!--<i class="icon icon-user mr-1"></i> Created By: 
									            <span class="newprice text-dark" style="font-size:14px;" v-html="quiz.name ? quiz.name:'Codevidhya'"></span>-->
                                      <button
                                        class="btn btn-primary ml-auto priceunlocked"
                                        style="border-radius: 4px; width: auto;"
                                        @click="
                                          $router.push(
                                            '/quiz-result?id=' + quiz.quiz_id
                                          )
                                        "
                                      >
                                        Learn More
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <!--end card footer-->
                          </div>
                          <!--end new card-->
                          <!--<div class="card ">
                            <div
                              class="card-body text-left m-0 p-0 d-flex align-content-center flex-wrap"
                            >
                              <div class="row m-0 p-2">
                                <div
                                  class="col-sm-6 border-right border-bottom d-flex align-content-center flex-wrap flex-grow-1"
                                >
                                  <p class="col-sm-12 m-0 p-0">
                                    {{
                                      quiz.quiz_name ? quiz.quiz_name : "test"
                                    }}
                                  </p>
                                  <span
                                    v-if="quiz.rating"
                                    class="d-flex flex-direction-column flex-wrap mt-3"
                                  >
                                    <div class="rating-stars flex-grow-1">
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
                                              (quiz.rating
                                                ? quiz.rating * 20
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
                                    <span
                                      class="flex-grow-1 mx-1"
                                      style="cursor:pointer"
                                      @click="quiz_reviews(quiz.quiz_id)"
                                      ><u>View all</u></span
                                    ></span
                                  >
                                  <span class="text-success"
                                    ><b>{{
                                      $moment(quiz.attempted_at).format("LL")
                                    }}</b></span
                                  >
                                </div>
                                <div
                                  class="col-sm-6 d-flex align-content-center flex-wrap flex-grow-1"
                                >
                                  <p class="col-sm-12 p-2">
                                    Obained Points: {{ quiz.obtained }}
                                  </p>
                                  <p class="col-sm-12 p-2">
                                    Total Points:{{ quiz.total_points }}
                                  </p>
                               
                                
                                  <div class="dropdown show">
                                    <a
                                      class="btn btn-primary price dropdown-toggle"
                                      href="#"
                                      role="button"
                                      id="dropdownMenuLink"
                                      data-toggle="dropdown"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                    >
                                      Social share
                                    </a>

                                    <div
                                      class="dropdown-menu"
                                      aria-labelledby="dropdownMenuLink"
                                    >
                                      <a
                                        class="dropdown-item"
                                        href=""
                                        @click="
                                          SharedCode(
                                            'facebook',
                                            quiz.obtained,
                                            quiz.total_points,
                                            quiz.quiz_name,
                                            quiz.quiz_id,
                                            quiz.quiz_slug
                                          )
                                        "
                                        ><i class="fab fa-facebook-square"></i>
                                        Facebook</a
                                      >
                                      <a
                                        class="dropdown-item"
                                        href=""
                                        @click="
                                          SharedCode(
                                            'twitter',
                                            quiz.obtained,
                                            quiz.total_points,
                                            quiz.quiz_name,
                                            quiz.quiz_id,
                                            quiz.quiz_slug
                                          )
                                        "
                                        ><i class="fab fa-twitter"></i>
                                        Twitter</a
                                      >
                                      <a
                                        class="dropdown-item"
                                        href=""
                                        @click="
                                          SharedCode(
                                            'linkedin',
                                            quiz.obtained,
                                            quiz.total_points,
                                            quiz.quiz_name,
                                            quiz.quiz_id,
                                            quiz.quiz_slug
                                          )
                                        "
                                        ><i class="fab fa-linkedin"></i>
                                        Linkedin</a
                                      >
                                      <a
                                        class="dropdown-item"
                                        href="#"
                                        @click="
                                          SharedCode(
                                            'whatsapp',
                                            quiz.obtained,
                                            quiz.total_points,
                                            quiz.quiz_name,
                                            quiz.quiz_id,
                                            quiz.quiz_slug
                                          )
                                        "
                                        ><i class="fab fa-whatsapp"></i>
                                        Whatsapp</a
                                      >
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>-->
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
import moment from "vue-moment";

export default {
  props: [
    "subjects",
    "userId",
    "sch_id",
    "quizzes",
    "sch_quizzess",
    "review_all",
    "quiz_reviews",
    "top_users"
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
    my_function: function(event, quiz_id) {
      document
        .getElementById("drop_down" + event.currentTarget.id)
        .classList.toggle("show");
      this.nofiyCompleteExam(quiz_id);
    },
    SharedCode: function(
      sharedType,
      obtain,
      out_of,
      quiz_name,
      quiz_id,
      quiz_slug
    ) {
      var left = screen.width / 2 - 580 / 2;
      var top = screen.height / 2 - 325 / 2;
      // console.log(this.rank);
      //window.open('http://www.facebook.com/sharer.php?s=100&amp;p[title]=<?php echo $title;?>&amp;p[summary]=<?php echo $summary;?>&amp;p[url]=<?php echo $url; ?>&amp;p[images][0]=<?php echo $image;?>','sharer','toolbar=0,status=0,width=550,height=300');" href="javascript: void(0)"
      if (sharedType == "facebook") {
        //test.codevidhya.com/api/user/fb-share
        var a = document.createElement("a");
        /*a.target = "_blank";
        a.href =
          "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.hostname + "/share?type=quiz&id=" +
          quiz_id +
          "&user=" +
          this.userId+"&src=sdkpreparse");
        a.click();*/
        a.href = "javascript: void(0)";
        a.addEventListener("click", function(e) {
          e.preventDefault();
          window.open(
            "https://www.facebook.com/sharer/sharer.php?u=" +
              encodeURIComponent(
                window.location.hostname +
                  "/share?type=quiz&id=" +
                  quiz_id +
                  "&user=" +
                  this.userId +
                  "&src=sdkpreparse"
              ),
            "sharer",
            "toolbar=0,status=0,width=580,height=325, left=" +
              left +
              ", top=" +
              top
          );
        });
        a.click();
      } else if (sharedType == "linkedin") {
        let url =
          "https://www.linkedin.com/shareArticle?mini=true&url=" +
          encodeURIComponent(
            "https://" +
              window.location.hostname +
              "/share?type=quiz&id=" +
              quiz_id +
              "&user=" +
              this.userId
          );
        window.open(
          url,
          "linkedin",
          "toolbar=0,status=0,width=580,height=325, left=" +
            left +
            ", top=" +
            top
        );
      } else if (sharedType == "whatsapp") {
        let url =
          "https://api.whatsapp.com/send?text=" +
          encodeURIComponent(
            "https://" +
              window.location.hostname +
              "/share?type=quiz&id=" +
              quiz_id +
              "&user=" +
              this.userId
          );
        window.open(
          url,
          "whatsapp",
          "toolbar=0,status=0,width=580,height=325, left=" +
            left +
            ", top=" +
            top
        );
      } else if (sharedType == "twitter") {
        let url =
          "https://www.twitter.com/share?url=" +
          encodeURIComponent(
            "https://" +
              window.location.hostname +
              "/share?type=quiz&id=" +
              quiz_id +
              "&user=" +
              this.userId
          );
        window.open(
          url,
          "twitter",
          "toolbar=0,status=0,width=580,height=325, left=" +
            left +
            ", top=" +
            top
        );
      }
    },

    nofiyCompleteExam: function(quiz_id) {
      this.$http
        .post("/api/user/display_ind_quiz_rank", {
          user_id: this.userId,
          quiz_id: quiz_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            this.ranks = res.body.data;
            let r = 1;
            let asum = "";
            for (var i = 0; i < this.ranks.length; i++) {
              if (this.userId == this.ranks[i].user_id) {
                asum = this.ranks[i].obtained;
                break;
              }
            }

            let sums = this.ranks.reduce(function(carry, item) {
              if (item["obtained"] && !~carry.indexOf(item["obtained"]))
                carry.push(item["obtained"]);
              return carry;
            }, []);
            for (var i = 0; i < sums.length; i++) {
              if (sums[i] == asum) {
                this.rank = i + 1;
              }
            }
          }
        });
    },
    quiz_action: function(quiz) {
      // console.log(quiz);
      if (
        (quiz.price == 0 || quiz.status) &&
        quiz.no_of_questions != quiz.attempted_question
      ) {
        if (this.userId == 0) {
          this.$router.push(
            "/login?redirect=" + encodeURIComponent(window.location.href)
          );
          return false;
        } else {
          this.$router.push("quiz?id=" + quiz.quiz_id);
          //this.$router.push({name: 'quiz-exam',params: {quiz_slug: quiz.slug,quiz_id: quiz.quiz_id,sub_id: quiz.sub_id}});
        }
      } else {
        this.$router.push(
          "/checkout?product_name=" +
            quiz.slug +
            "&id=" +
            quiz.product_id +
            "&sub_id=" +
            quiz.sub_id +
            "&type=quiz"
        );
      }

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
  },
  filters: {
    moment: function(date) {
      return moment(date).format("MMMM DD YYYY");
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

.social_login {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: auto;
  margin: 0;
  padding: 8px 12px;

  border-radius: 4px;
  transition: all 200ms;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  font: normal 1rem/1 "Rubik";
  color: #fff;
  cursor: pointer;
}

.social_login:hover,
.social_login:focus {
  opacity: 0.5;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  overflow: auto;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  right: 0;
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown a:hover {
  background-color: #ddd;
}

.show {
  display: block;
}
</style>
