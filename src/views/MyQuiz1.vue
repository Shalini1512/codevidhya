<template>
  <!-- Navbar -->
  <div id="quiz-admin-root">
    <Header></Header>
    <!--review for all-->
    <div class="cv-modal medium" id="quiz_reviews">
      <div style="padding: 24px 24px 8px;">
        <div
          class="header text-center"
          style="width:100%;"
          v-if="review_all.length"
        >
          <h3>
            {{
              review_all[0].quiz_name ? review_all[0].quiz_name : "test"
            }}
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
    <!--agreement-->
    <div class="cv-modal medium" id="quiz_aggrement">
      <div style="padding: 24px 24px 8px;">
        <div class="header text-left text-danger" style="width:100%;">
          <p>Quiz name already exits.</p>
        </div>
        <div class="body">
          <div style="display:flex;flex-direction:row">
            <div
              class="text-left"
              style="width:100%;"
              v-if="quiz_exist_status > 1"
            >
              <input
                class="cv-input mt-1"
                v-model="current_quiz_name"
                placeholder="Enter quiz name"
              />
              <p>
                <b>Note:</b> Your quiz name must be unique in Public category.
              </p>
            </div>
            <div v-else>
              <span
                >{{ current_quiz_name ? current_quiz_name : "" }}
                <i
                  class="fa fa-check"
                  style="color:#28a745;font-size:20px;padding-left:15px;"
                ></i
              ></span>
            </div>
          </div>
        </div>
        <div class="footer mt-3">
          <button
            class="cv-button negative noshadow"
            onclick="hideModal('quiz_aggrement')"
          >
            Cancel
          </button>
          <button
            v-if="quiz_exist_status > 1"
            class="cv-button noshadow"
            @click="quiz_name_update()"
          >
            Submit
          </button>
          <!--<button class="cv-button noshadow" @click="submit_public_request()">Submit</button>-->
        </div>
      </div>
    </div>
    <!--end aggrement modal-->
    <!--guidlines-->
    <div class="cv-modal medium" id="quiz_guidlines">
      <div style="padding: 24px 24px 8px;">
        <div class="header text-center" style="width:100%;">
          <h3>Guidelines for the teacher to publish this quiz for everyone.</h3>
        </div>
        <div class="body">
          <div style="display:flex;flex-direction:row">
            <ol>
              <li>Your quiz name must be unique in Public category.</li>
              <li>
                You will earn additional coins depending upon the number of
                unique students attempt your quiz.
              </li>
              <li>
                The additional coins you earn will be 5% of the total number of
                unique students that attempt the quiz only above 50 students.
              </li>
            </ol>
          </div>
        </div>
        <div class="p-2 text-right">
          <button class="btn btn-danger" onclick="hideModal('quiz_guidlines')">
            Cancel
          </button>
        </div>
      </div>
    </div>
    <!--end guidlines-->
    <div id="main">
      <div id="quizzes-and-questions-tabs" class="cv-tablayout cardlayout">
        <div class="tabs">
          <div class="active">Quizzes</div>
          <i class="flex-filler"></i>
          <button class="btn btn-success" @click="$router.push('/create_quiz')">
            Create new quiz
          </button>
        </div>
        <!--mcq question-->

        <div class="content active">
          <div id="quizzes-tablayout" class="cv-tablayout">
            <div class="tabs">
              <template v-for="(subject, index) in subjects">
                <div
                  v-bind:key="index"
                  class="subjects active"
                  v-if="index == 0"
                  @click="change_subject($event)"
                >
                  {{ subject.subject }}
                </div>
                <div
                  v-bind:key="index"
                  class="subjects"
                  v-else
                  @click="change_subject($event)"
                >
                  {{ subject.subject }}
                </div>
              </template>
            </div>
            <!--mcq question-->

            <div class="content active">
              <template v-if="quizzes.findIndex(x => x.sub_id === 1) != -1">
                <template v-for="(quiz, quiz_index) in quizzes">
                  <div v-bind:key="quiz_index" v-if="quiz.sub_id == 1">
                    <div>
                      <h3>
                        {{ quiz.quiz_name
                        }}<span class="subject-tag">{{ quiz.Subject }}</span>
                      </h3>
                      <p>
                        {{
                          quiz.total_question ? quiz.total_question : 0
                        }}
                        Questions <span class="spacer"></span
                        >{{ quiz.total_marks ? quiz.total_marks : 0 }} Points
                        <span class="spacer"></span>
                        <span class="text-success" style="font-family:'Rubik'"
                          ><b
                            ><i
                              class="fa fa-info-circle"
                              aria-hidden="true"
                            ></i>
                            {{
                              quiz.total_attempted ? quiz.total_attempted : 0
                            }}
                            users attempted</b
                          ></span
                        >
                      </p>
                      <span
                        v-if="quiz.rating"
                        class="mt-1"
                        style="display:flex;flex-direction:row"
                      >
                        <label
                          ><input
                            id="star-rating"
                            class="rating lesson-review-item-rating"
                            type="text"
                            :value="quiz.rating"
                            data-size="xs"
                        /></label>
                        <span
                          style="cursor:pointer"
                          @click="quiz_reviews(quiz.quiz_id)"
                          >View all</span
                        ></span
                      >
                      <p v-if="quiz.public_permission == 0">
                        <span class="text-info" style="font-family:'Rubik'"
                          ><b
                            ><i class="fa fa-info-circle" aria-hidden="true"></i
                            >&nbsp;Publish this quiz for everyone to earn more
                            coins.</b
                          ></span
                        >
                      </p>
                    </div>

                    <i class="flex-filler"></i>
                    <div></div>
                    <div>
                      <button
                        class="btn btn-purple"
                        @click="
                          $router.push({
                            name: 'UpdateTeacherQuiz',
                            params: {
                              quiz_slug: quiz.slug,
                              quizID: quiz.quiz_id,
                              SubjectName: quiz.Subject,
                              QuizName: quiz.quiz_name,
                              subID: quiz.sub_id,
                              quizPrice: quiz.price
                            }
                          })
                        "
                      >
                        Edit
                      </button>
                      <button
                        v-if="quiz.public_permission == 0"
                        class="btn btn-success"
                        style="background:#13c047"
                        @click="show_public(quiz.quiz_id, quiz.quiz_name)"
                      >
                        Publish for everyone
                      </button>
                      <button
                        v-if="quiz.public_permission == 1 && quiz.visible == 0"
                        class="btn btn-gray"
                        style="background:#666;"
                      >
                        Requested
                      </button>
                      <span
                        v-if="quiz.public_permission == 0"
                        class="text-success"
                        style="cursor:pointer"
                        onclick="showModal('quiz_guidlines')"
                        ><u>Guidelines </u></span
                      >
                      <div
                        v-if="quiz.visible == 1 && quiz.public_permission == 1"
                      >
                        <span class="text-success"
                          >Approved<i
                            class="fa fa-check"
                            style="color:#28a745;font-size:20px;padding-left:15px;"
                          ></i
                        ></span>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
              <div v-else style="padding:24px;color:#ccc;text-align:center">
                There are no Quizzes!
              </div>
            </div>
            <div class="content">
              <template v-if="quizzes.findIndex(x => x.sub_id === 2) != -1">
                <template v-for="(quiz, q_ind) in quizzes">
                  <div v-bind:key="q_ind" v-if="quiz.sub_id == 2">
                    <div>
                      <h3>
                        {{ quiz.quiz_name
                        }}<span class="subject-tag">{{ quiz.Subject }}</span>
                      </h3>
                      <p>
                        {{
                          quiz.total_question ? quiz.total_question : 0
                        }}
                        Questions <span class="spacer"></span
                        >{{ quiz.total_marks ? quiz.total_marks : 0 }} Points
                        <span class="spacer"></span>
                        <span class="text-success" style="font-family:'Rubik'"
                          ><b
                            ><i
                              class="fa fa-info-circle"
                              aria-hidden="true"
                            ></i>
                            {{
                              quiz.total_attempted ? quiz.total_attempted : 0
                            }}
                            users attempted</b
                          ></span
                        >
                      </p>
                      <span
                        v-if="quiz.rating"
                        class="mt-1"
                        style="display:flex;flex-direction:row"
                      >
                        <label
                          ><input
                            id="star-rating"
                            class="rating lesson-review-item-rating"
                            type="text"
                            :value="quiz.rating"
                            data-size="xs"
                        /></label>
                        <span
                          style="cursor:pointer"
                          @click="quiz_reviews(quiz.quiz_id)"
                          >View all</span
                        ></span
                      >
                      <p v-if="quiz.public_permission == 0">
                        <span class="text-info" style="font-family:'Rubik'"
                          ><b
                            ><i class="fa fa-info-circle" aria-hidden="true"></i
                            >&nbsp;Publish this quiz for everyone to earn more
                            coins.</b
                          ></span
                        >
                      </p>
                    </div>
                    <i class="flex-filler"></i>
                    <div>
                      <button
                        class="btn btn-purple"
                        @click="
                          $router.push({
                            name: 'UpdateTeacherQuiz',
                            params: {
                              quiz_slug: quiz.slug,
                              quizID: quiz.quiz_id,
                              SubjectName: quiz.Subject,
                              QuizName: quiz.quiz_name,
                              subID: quiz.sub_id,
                              quizPrice: quiz.price
                            }
                          })
                        "
                      >
                        Edit
                      </button>
                      <button
                        v-if="quiz.public_permission == 0"
                        class="btn btn-success"
                        style="background:#13c047"
                        @click="show_public(quiz.quiz_id, quiz.quiz_name)"
                      >
                        Publish for everyone
                      </button>
                      <button
                        v-if="quiz.public_permission == 1 && quiz.visible == 0"
                        class="btn btn-gray"
                        style="background:#666;"
                      >
                        Requested
                      </button>
                      <span
                        v-if="quiz.public_permission == 0"
                        class="text-success"
                        style="cursor:pointer"
                        onclick="showModal('quiz_guidlines')"
                        ><u>Guidelines </u></span
                      >
                      <div
                        v-if="quiz.visible == 1 && quiz.public_permission == 1"
                      >
                        <span class="text-success"
                          >Approved<i
                            class="fa fa-check"
                            style="color:#28a745;font-size:20px;padding-left:15px;"
                          ></i
                        ></span>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
              <div v-else style="padding:24px;color:#ccc;text-align:center">
                There are no Quizzes!
              </div>
            </div>
            <div class="content">
              <template v-if="quizzes.findIndex(x => x.sub_id === 3) != -1">
                <template v-for="(quiz, q_indd) in quizzes">
                  <div v-bind:key="q_indd" v-if="quiz.sub_id == 3">
                    <div>
                      <h3>
                        {{ quiz.quiz_name
                        }}<span class="subject-tag">{{ quiz.Subject }}</span>
                      </h3>
                      <p>
                        {{
                          quiz.total_question ? quiz.total_question : 0
                        }}
                        Questions <span class="spacer"></span
                        >{{ quiz.total_marks ? quiz.total_marks : 0 }} Points
                        <span class="spacer"></span>
                        <span class="text-success" style="font-family:'Rubik'"
                          ><b
                            ><i
                              class="fa fa-info-circle"
                              aria-hidden="true"
                            ></i>
                            {{
                              quiz.total_attempted ? quiz.total_attempted : 0
                            }}
                            users attempted</b
                          ></span
                        >
                      </p>
                      <span
                        v-if="quiz.rating"
                        class="mt-1"
                        style="display:flex;flex-direction:row"
                      >
                        <label
                          ><input
                            id="star-rating"
                            class="rating lesson-review-item-rating"
                            type="text"
                            :value="quiz.rating"
                            data-size="xs"
                        /></label>
                        <span
                          style="cursor:pointer"
                          @click="quiz_reviews(quiz.quiz_id)"
                          >View all</span
                        ></span
                      >
                      <p v-if="quiz.public_permission == 0">
                        <span class="text-info" style="font-family:'Rubik'"
                          ><b
                            ><i class="fa fa-info-circle" aria-hidden="true"></i
                            >&nbsp;Publish this quiz for everyone to earn more
                            coins.</b
                          ></span
                        >
                      </p>
                    </div>
                    <i class="flex-filler"></i>
                    <div>
                      <button
                        class="btn btn-purple"
                        @click="
                          $router.push({
                            name: 'UpdateTeacherQuiz',
                            params: {
                              quiz_slug: quiz.slug,
                              quizID: quiz.quiz_id,
                              SubjectName: quiz.Subject,
                              QuizName: quiz.quiz_name,
                              subID: quiz.sub_id,
                              quizPrice: quiz.price
                            }
                          })
                        "
                      >
                        Edit
                      </button>
                      <button
                        v-if="quiz.public_permission == 0"
                        class="btn btn-success"
                        style="background:#13c047"
                        @click="show_public(quiz.quiz_id, quiz.quiz_name)"
                      >
                        Publish for everyone
                      </button>
                      <button
                        v-if="quiz.public_permission == 1 && quiz.visible == 0"
                        class="btn btn-gray"
                        style="background:#666;"
                      >
                        Requested
                      </button>
                      <span
                        v-if="quiz.public_permission == 0"
                        class="text-success"
                        style="cursor:pointer"
                        onclick="showModal('quiz_guidlines')"
                        ><u>Guidelines </u></span
                      >
                      <div
                        v-if="quiz.visible == 1 && quiz.public_permission == 1"
                      >
                        <span class="text-success"
                          >Approved<i
                            class="fa fa-check"
                            style="color:#28a745;font-size:20px;padding-left:15px;"
                          ></i
                        ></span>
                      </div>

                      <!-- <button class="cv-button negative noshadow" @click="remove_quiz(quiz.quiz_id,quiz.quiz_name)">Delete</button>-->
                    </div>
                  </div>
                </template>
              </template>
              <div v-else style="padding:24px;color:#ccc;text-align:center">
                There are no Quizzes!
              </div>
            </div>
            <div class="content">
              <template v-if="quizzes.findIndex(x => x.sub_id === 4) != -1">
                <template v-for="(quiz, qz_ind) in quizzes">
                  <div v-bind:key="qz_ind">
                    <div v-if="quiz.sub_id == 4">
                      <div>
                        <h3>
                          {{ quiz.quiz_name
                          }}<span class="subject-tag">{{ quiz.Subject }}</span>
                        </h3>
                        <p>
                          {{
                            quiz.total_question ? quiz.total_question : 0
                          }}
                          Questions <span class="spacer"></span
                          >{{ quiz.total_marks ? quiz.total_marks : 0 }} Points
                          <span class="spacer"></span>
                          <span class="text-success" style="font-family:'Rubik'"
                            ><b
                              ><i
                                class="fa fa-info-circle"
                                aria-hidden="true"
                              ></i>
                              {{
                                quiz.total_attempted ? quiz.total_attempted : 0
                              }}
                              users attempted</b
                            ></span
                          >
                        </p>
                        <span
                          v-if="quiz.rating"
                          class="mt-1"
                          style="display:flex;flex-direction:row"
                        >
                          <label
                            ><input
                              id="star-rating"
                              class="rating lesson-review-item-rating"
                              type="text"
                              :value="quiz.rating"
                              data-size="xs"
                          /></label>
                          <span
                            style="cursor:pointer"
                            @click="quiz_reviews(quiz.quiz_id)"
                            >View all</span
                          ></span
                        >
                        <p v-if="quiz.public_permission == 0">
                          <span class="text-info" style="font-family:'Rubik'"
                            ><b
                              ><i
                                class="fa fa-info-circle"
                                aria-hidden="true"
                              ></i
                              >&nbsp;Publish this quiz for everyone to earn more
                              coins.</b
                            ></span
                          >
                        </p>
                      </div>

                      <i class="flex-filler"></i>
                      <div>
                        <button
                          class="btn btn-purple"
                          @click="
                            $router.push({
                              name: 'UpdateTeacherQuiz',
                              params: {
                                quiz_slug: quiz.slug,
                                quizID: quiz.quiz_id,
                                SubjectName: quiz.Subject,
                                QuizName: quiz.quiz_name,
                                subID: quiz.sub_id,
                                quizPrice: quiz.price
                              }
                            })
                          "
                        >
                          Edit
                        </button>
                        <button
                          v-if="quiz.public_permission == 0"
                          class="btn btn-success"
                          style="background:#13c047"
                          @click="show_public(quiz.quiz_id, quiz.quiz_name)"
                        >
                          Publish for everyone
                        </button>
                        <button
                          v-if="
                            quiz.public_permission == 1 && quiz.visible == 0
                          "
                          class="btn btn-gray"
                          style="background:#666;"
                        >
                          Requested
                        </button>
                        <span
                          v-if="quiz.public_permission == 0"
                          class="text-success"
                          style="cursor:pointer"
                          onclick="showModal('quiz_guidlines')"
                          ><u>Guidelines </u></span
                        >
                        <div
                          v-if="
                            quiz.visible == 1 && quiz.public_permission == 1
                          "
                        >
                          <span class="text-success"
                            >Approved<i
                              class="fa fa-check"
                              style="color:#28a745;font-size:20px;padding-left:15px;"
                            ></i
                          ></span>
                        </div>

                        <!-- <button class="cv-button negative noshadow" @click="remove_quiz(quiz.quiz_id,quiz.quiz_name)">Delete</button>-->
                      </div>
                    </div>
                  </div>
                </template>
              </template>
              <div v-else style="padding:24px;color:#ccc;text-align:center">
                There are no Quizzes!
              </div>
            </div>
            <div class="content">
              <template v-if="quizzes.findIndex(x => x.sub_id === 5) != -1">
                <template v-for="(quiz, qz_ind) in quizzes">
                  <div v-bind:key="qz_ind">
                    <div v-if="quiz.sub_id == 5">
                      <div>
                        <h3>
                          {{ quiz.quiz_name
                          }}<span class="subject-tag">{{ quiz.Subject }}</span>
                        </h3>
                        <p>
                          {{
                            quiz.total_question ? quiz.total_question : 0
                          }}
                          Questions <span class="spacer"></span
                          >{{ quiz.total_marks ? quiz.total_marks : 0 }} Points
                          <span class="spacer"></span>
                          <span class="text-success" style="font-family:'Rubik'"
                            ><b
                              ><i
                                class="fa fa-info-circle"
                                aria-hidden="true"
                              ></i>
                              {{
                                quiz.total_attempted ? quiz.total_attempted : 0
                              }}
                              users attempted</b
                            ></span
                          >
                        </p>
                        <span
                          v-if="quiz.rating"
                          class="mt-1"
                          style="display:flex;flex-direction:row"
                        >
                          <label
                            ><input
                              id="star-rating"
                              class="rating lesson-review-item-rating"
                              type="text"
                              :value="quiz.rating"
                              data-size="xs"
                          /></label>
                          <span
                            style="cursor:pointer"
                            @click="quiz_reviews(quiz.quiz_id)"
                            >View all</span
                          ></span
                        >
                        <p v-if="quiz.public_permission == 0">
                          <span class="text-info" style="font-family:'Rubik'"
                            ><b
                              ><i
                                class="fa fa-info-circle"
                                aria-hidden="true"
                              ></i
                              >&nbsp;Publish this quiz for everyone to earn more
                              coins.</b
                            ></span
                          >
                        </p>
                      </div>
                      <i class="flex-filler"></i>
                      <div>
                        <button
                          class="btn btn-purple"
                          @click="
                            $router.push({
                              name: 'UpdateTeacherQuiz',
                              params: {
                                quiz_slug: quiz.slug,
                                quizID: quiz.quiz_id,
                                SubjectName: quiz.Subject,
                                QuizName: quiz.quiz_name,
                                subID: quiz.sub_id,
                                quizPrice: quiz.price
                              }
                            })
                          "
                        >
                          Edit
                        </button>
                        <button
                          v-if="quiz.public_permission == 0"
                          class="btn btn-success"
                          style="background:#13c047"
                          @click="show_public(quiz.quiz_id, quiz.quiz_name)"
                        >
                          Publish for everyone
                        </button>
                        <button
                          v-if="
                            quiz.public_permission == 1 && quiz.visible == 0
                          "
                          class="btn btn-gray"
                          style="background:#666;"
                        >
                          Requested
                        </button>
                        <span
                          v-if="quiz.public_permission == 0"
                          class="text-success"
                          style="cursor:pointer"
                          onclick="showModal('quiz_guidlines')"
                          ><u>Guidelines </u></span
                        >
                        <div
                          v-if="
                            quiz.visible == 1 && quiz.public_permission == 1
                          "
                        >
                          <span class="text-success"
                            >Approved<i
                              class="fa fa-check"
                              style="color:#28a745;font-size:20px;padding-left:15px;"
                            ></i
                          ></span>
                        </div>

                        <!-- <button class="cv-button negative noshadow" @click="remove_quiz(quiz.quiz_id,quiz.quiz_name)">Delete</button>-->
                      </div>
                    </div>
                  </div>
                </template>
              </template>
              <div v-else style="padding:24px;color:#ccc;text-align:center">
                There are no Quizzes!
              </div>
            </div>
            <!--end mcq question-->
          </div>
        </div>
        <div class="content">
          <div id="question-pool-tablayout" class="cv-tablayout">
            <div class="tabs">
              <template v-for="(subject, index) in subjects">
                <div v-bind:key="index">
                  <div class="active" v-if="index == 0">
                    {{ subject.subject }}
                  </div>

                  <div v-else>{{ subject.subject }}</div>
                </div>
              </template>
            </div>
            <!--mcq question-->

            <div class="content active">
              <template v-if="questions.findIndex(x => x.sub_id === 1) != -1">
                <template v-for="(question, q_ind) in questions">
                  <div v-bind:key="q_ind">
                    <div v-if="question.sub_id == 1">
                      <div v-html="question.question"></div>
                      <span>used {{ question.used_times }} times</span>
                    </div>
                  </div>
                </template>
              </template>
              <div v-else style="padding:24px;color:#ccc;text-align:center">
                There are no Questions!
              </div>
            </div>
            <div class="content">
              <template v-for="(question, q_ind) in questions">
                <div v-bind:key="q_ind">
                  <div v-if="question.sub_id == 2">
                    <div v-html="question.question"></div>
                    <span>used {{ question.used_times }} times</span>
                  </div>
                </div>
              </template>
            </div>
            <div class="content">
              <template v-for="(question, q_ind) in questions">
                <div v-bind:key="q_ind" v-if="question.sub_id == 3">
                  <div v-html="question.question"></div>
                  <span>used {{ question.used_times }} times</span>
                </div>
              </template>
            </div>
            <div class="content">
              <template v-for="(question, q_ind) in questions">
                <div v-bind:key="q_ind" v-if="question.sub_id == 4">
                  <div v-html="question.question"></div>
                  <span>used {{ question.used_times }} times</span>
                </div>
              </template>
            </div>
            <div class="content">
              <template v-if="questions.findIndex(x => x.sub_id === 5) != -1">
                <template v-for="(question, q_ind) in questions">
                  <div v-bind:key="q_ind" v-if="question.sub_id == 5">
                    <div v-html="question.question"></div>
                    <span>used {{ question.used_times }} times</span>
                  </div>
                </template>
              </template>
              <div v-else style="padding:24px;color:#ccc;text-align:center">
                There are no Questions!
              </div>
            </div>
            <!--end mcq question-->
          </div>
        </div>
      </div>
    </div>
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
  <!-- /Navbar -->
</template>
<script>
//import Header from "@/components/header/HeaderMenuOnly.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import moment from "vue-moment";
import axios from "axios";
export default {
  components: { Header },
  data() {
    return {
      subjects: [],
      quizzes: [],
      questions: [],
      userId: 0,
      current_quiz_id: 0,
      current_quiz_name: "",
      quiz_exist_status: 0,
      review_all: []
    };
  },
  beforeCreate() {},

  created() {},
  mounted: function() {
    //
    cvAuth.getUserId(
      function(userId) {
        showPreloader();
        this.userId = userId;
        this.get_subject(userId);
      }.bind(this)
    );
  },
  updated() {
    $(".lesson-review-item-rating").rating({
      displayOnly: true,
      theme: "krajee-fas",
      showCaption: false
    });
  },
  methods: {
    change_subject: function(e) {
      $(".subjects").removeClass("active");
      $(e.currentTarget).addClass("active");
      var clickedTabIndex = getElementIndex(e.currentTarget);
      var tabContentBoxes = $(e.currentTarget.parentElement.parentElement).find(
        "> .content"
      );
      tabContentBoxes.removeClass("active");
      $(tabContentBoxes[clickedTabIndex]).addClass("active");
    },
    quiz_reviews: function(quiz_id) {
      axios
        .post("/api/user/get_quiz_reviews", { quiz_id: quiz_id })
        .then(res => {
          this.review_all = res.data.data;
          //   console.log(this.review_all);
          showModal("quiz_reviews");
        });
    },
    submit_public_request: function() {
      axios
        .post("/api/user/sent_public_request", {
          quiz_id: this.current_quiz_id,
          user_id: this.userId
        })
        .then(res => {
          this.quiz_exist_status = res.data.data;
          notify("Request sent successfully", "success");
          hideModal("quiz_aggrement");
          this.get_subject(this.userId);
        });
    },
    quiz_name_update: function() {
      axios
        .post("/api/user/get_public_quiz_updation", {
          quiz_id: this.current_quiz_id,
          quiz_name: this.current_quiz_name
        })
        .then(res => {
          this.quiz_exist_status = res.data.data;
          if (this.quiz_exist_status > 1) this.get_subject(this.userId);
          else this.submit_public_request();
        });
    },
    show_public: function(quiz_id, quiz_name) {
      this.current_quiz_id = quiz_id;
      this.current_quiz_name = quiz_name;
      axios
        .post("/api/user/get_public_quiz_existance", {
          quiz_id: quiz_id,
          quiz_name: quiz_name
        })
        .then(res => {
          this.quiz_exist_status = res.data.data;
          if (this.quiz_exist_status > 1) showModal($("#quiz_aggrement"));
          else this.submit_public_request();
        });
    },
    remove_quiz: function(e, name) {
      let ans = confirm("Do you want to delete " + name + "?");
      if (ans) {
      }
    },
    get_subject: function(userId) {
      axios.post("/api/user/get_subject").then(res => {
        this.subjects = res.data.data;
      });
      axios
        .post("/api/user/AllTeacherQuizes", { user_id: userId })
        .then(res => {
          this.quizzes = res.data.data;
        });
      axios
        .post("/api/user/get_teacher_all_questions", { user_id: userId })
        .then(res => {
          this.questions = res.data.data;
          for (var i = 0; i < this.questions.length; i++) {
            this.questions[i].question = getQuizContentWithAllTemplateRendered(
              this.questions[i].question
            );
          }
        });
    }
  }
};
</script>
<style lang="scss">
#quiz-admin-root {
  #main {
    padding-left: 24px;
    padding-right: 24px;
  }
}
#quizzes-and-questions-tabs {
  // width: 100%;
  margin: 16px 24px;
  & > .tabs {
    align-items: center;
    div {
      min-width: 140px;
      font-weight: 700;
      &:first-of-type {
        border-top-left-radius: 8px;
      }
    }
    i {
      visibility: hidden;
    }
    button {
      margin-right: 8px;
    }
  }
}

#quizzes-tablayout,
#question-pool-tablayout {
  .tabs {
    padding: 8px;
    background: rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    div {
      min-width: 140px;
      margin-right: 8px;
      padding: 8px;
      border-radius: 4px;
      font-weight: 700;
      &.active {
        background: #ec296b;
        color: #fff;
      }
    }
  }
}

#quizzes-tablayout {
  .content {
    & > div {
      display: flex;
      flex-direction: row;
      padding: 24px;
      .subject-tag {
        margin-left: 24px;
        padding: 4px 8px;
        background: rgb(4, 146, 23);
        border-radius: 4px;
        font: normal 12px/1 "Rubik";
        color: #fff;
      }
      p {
        margin: 0;
      }
      .spacer {
        padding-right: 24px;
      }

      & > div:last-of-type {
        display: flex;
        flex-direction: column;
        button:first-of-type {
          margin-bottom: 8px;
        }
      }
    }
  }
}
</style>
