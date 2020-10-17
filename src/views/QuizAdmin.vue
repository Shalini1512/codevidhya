<template>
  <!-- Navbar -->
  <div id="quiz-admin-root">
    <AdminNavbar></AdminNavbar>
    <div id="main">
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
              v-for="(review, key) in review_all"
              :key="key"
              style
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
                    <div
                      class="rating-container theme-krajee-fas rating-xs rating-animate is-display-only"
                    >
                      <div class="rating-stars" title>
                        <span class="empty-stars">
                          <span class="star">
                            <i class="far fa-star"></i>
                          </span>
                          <span class="star">
                            <i class="far fa-star"></i>
                          </span>
                          <span class="star">
                            <i class="far fa-star"></i>
                          </span>
                          <span class="star">
                            <i class="far fa-star"></i>
                          </span>
                          <span class="star">
                            <i class="far fa-star"></i>
                          </span>
                        </span>
                        <span
                          class="filled-stars"
                          :style="'width:' + review.obt_rat * 20 + '%;'"
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
                  <div
                    class="cv-testimonials"
                    style="line-height:1.44;letter-spacing:.5px; font-style:italic;padding-top:12px;padding-left:10px;padding-right:10px;text-align:left;margin-top:10px;"
                  >
                    {{ review.message }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="footer mt-3">
            <button class="btn btn-danger" onclick="hideModal('quiz_reviews')">
              Close
            </button>
          </div>
        </div>
      </div>
      <!--end review for all-->
      <div id="quizzes-and-questions-tabs" class="cv-tablayout cardlayout">
        <div class="tabs">
          <div class="active">Quizzes</div>
          <!--<div>Question pool</div>-->
          <div>Teachers Quizzes</div>
          <div>Users Quizzes</div>
          <i class="flex-filler"></i>
          <button class="btn btn-success" @click="$router.push('/new-quiz')">
            Create new quiz
          </button>
        </div>
        <!--mcq question-->

        <div class="content active">
          <div id="quizzes-tablayout" class="cv-tablayout">
            <div class="tabs">
              <template v-for="(subject, index) in subjects">
                <div
                  class="active"
                  :key="index"
                  v-if="index == 0"
                  @click="change_subject($event)"
                >
                  {{ subject.subject }}
                </div>
                <div :key="index" v-else @click="change_subject($event)">
                  {{ subject.subject }}
                </div>
              </template>
            </div>
            <!--mcq question-->
            <template v-for="(quiz_for_sub, sub_index) in subjects">
              <div
                :class="'content ' + [sub_index + 1 == 1 ? ' active' : '']"
                :key="sub_index"
              >
                <template
                  v-if="
                    quizzes.findIndex(x => x.sub_id === quiz_for_sub.sub_id) !=
                      -1
                  "
                >
                  <template v-for="(quiz, key) in quizzes">
                    <div :key="key" v-if="quiz.sub_id == quiz_for_sub.sub_id">
                      <div style="margin-right: 20px;">
                        <img
                          alt="Responsive image"
                          :src="
                            '/dynamic/Quizzes/quiz_img/' +
                              [
                                quiz.quiz_img
                                  ? quiz.quiz_img
                                  : 'default_quiz.png'
                              ]
                          "
                          style="width: 110px; background: rgb(51, 224, 255);"
                        />
                      </div>
                      <div>
                        <h3>
                          {{ quiz.quiz_name }}
                          <span class="subject-tag">{{
                            quiz.quiz_subject
                          }}</span>
                        </h3>
                        <p>Price: {{ quiz.price ? quiz.price : 0 }}</p>
                        <p class="mt-1">
                          {{
                            quiz.total_question ? quiz.total_question : 0
                          }}
                          Questions
                          <span class="spacer"></span>
                          {{ quiz.total_marks ? quiz.total_marks : 0 }} Points
                          <span class="spacer"></span>
                          <span
                            class="text-success"
                            style="font-family:'Rubik'"
                          >
                            <b>
                              <i
                                class="fa fa-info-circle"
                                aria-hidden="true"
                              ></i>
                              {{
                                quiz.total_attempted ? quiz.total_attempted : 0
                              }}
                              users attempted
                            </b>
                          </span>
                        </p>
                        <span
                          v-if="quiz.rating"
                          class="mt-1"
                          style="display:flex;flex-direction:row"
                        >
                          <label>
                            <input
                              id="star-rating"
                              class="rating lesson-review-item-rating"
                              type="text"
                              :value="quiz.rating"
                              data-size="xs"
                            />
                          </label>
                          <span
                            style="cursor:pointer"
                            @click="quiz_reviews(quiz.quiz_id)"
                            >View all</span
                          >
                        </span>
                      </div>
                      <i class="flex-filler"></i>
                      <div>
                        <button
                          class="btn btn-purple"
                          @click="
                            $router.push(
                              '/quiz-admin-update/?quiz_name=' +
                                quiz.slug +
                                '&id=' +
                                quiz.quiz_id
                            )
                          "
                        >
                          Edit
                        </button>
                        <button
                          class="btn btn-success"
                          v-if="quiz.public_institute == 0"
                          @click="publish_quiz(quiz.quiz_id)"
                        >
                          <i class="fa fa-globe mr-1"></i>Publish
                        </button>
                        <button class="btn btn-success" v-else disabled>
                          <i class="fa fa-globe mr-1"></i>Published
                        </button>
                        <!--<button
                          class="btn btn-danger"
                          @click="remove_quiz(quiz.quiz_id,quiz.quiz_name,quiz.quiz_name)"
                        >Delete</button>-->
                      </div>
                    </div>
                  </template>
                </template>
                <div v-else style="padding:24px;color:#ccc;text-align:center">
                  There are no Quizzes!
                </div>
              </div>
            </template>
            <!--end mcq question-->
          </div>
        </div>
        <!--Question pool-->
        <!--<div class="content">
          <div id="question-pool-tablayout" class="cv-tablayout">
            <div class="tabs">
              <template v-for="(subject,index) in subjects">
                <div class="active" :key="index" v-if="index==0">{{subject.subject}}</div>

                <div :key="index" v-else>{{subject.subject}}</div>
              </template>
            </div>
      
      <template v-for="(quiz_for_sub,sub_index1) in subjects">
              <div :class="'content '+[(sub_index1+1)==1? ' active':'']" :key="sub_index1">
                <template v-if="quizzes.findIndex(x => x.sub_id ===(quiz_for_sub.sub_id))!=-1">
                  <template v-for="(question,q_ind) in questions">
                    <div :key="q_ind" v-if="question.sub_id==(quiz_for_sub.sub_id)">
                      <div v-html="question.question"></div>
                      
                      <span>used {{question.used_times}} times</span>
                    </div>
                  </template>
                </template>
                <div
                  v-else
                  style="padding:24px;color:#ccc;text-align:center"
                >There are no Questions!</div>
              </div>
            </template>
       
          </div>
        </div>-->
        <!--teachers Quizzess-->
        <!--mcq question-->

        <div class="content">
          <div id="quizzes-tablayout" class="cv-tablayout">
            <div class="tabs">
              <template v-for="(subject, index) in subjects">
                <div class="active" :key="index" v-if="index == 0">
                  {{ subject.subject }}
                </div>

                <div :key="index" v-else>{{ subject.subject }}</div>
              </template>
            </div>
            <!--mcq question-->
            <div style="display:flex;justify-content:flex-end;padding:12px">
              <label style="margin-bottom:0">Select Quiz</label>
              <select
                class
                id="filter_teacher_quiz"
                @change="filter_teacher_data()"
              >
                <option value="0">All Quizzes</option>
                <option value="1">Requested For Public</option>
                <option value="2">Approved</option>
              </select>
            </div>
            <template v-for="(quiz_for_sub, sub_index22) in subjects">
              <div
                :class="'content ' + [sub_index22 + 1 == 1 ? ' active' : '']"
                :key="sub_index22"
              >
                <template
                  v-if="
                    quizzes.findIndex(x => x.sub_id === quiz_for_sub.sub_id) !=
                      -1
                  "
                >
                  <template v-for="(quiz, q_ind) in teacher_quizzess">
                    <div :key="q_ind" v-if="quiz.sub_id == quiz_for_sub.sub_id">
                      <div style="margin-right: 20px;">
                        <img
                          alt="Responsive image"
                          :src="
                            '/dynamic/Quizzes/quiz_img/' +
                              [
                                quiz.quiz_img
                                  ? quiz.quiz_img
                                  : 'default_quiz.png'
                              ]
                          "
                          style="width: 110px; background: rgb(51, 224, 255);"
                        />
                      </div>
                      <div>
                        <h3>
                          {{ quiz.quiz_name }}
                          <span class="subject-tag">{{
                            quiz.quiz_subject
                          }}</span>
                        </h3>
                        <div>
                          <p>Created by: {{ quiz.teacher_name }}</p>
                          <p>School: {{ quiz.school_name }}</p>
                        </div>
                        <p class="mt-1">
                          {{
                            quiz.total_question ? quiz.total_question : 0
                          }}
                          Questions
                          <span class="spacer"></span>
                          {{ quiz.total_marks ? quiz.total_marks : 0 }} Points
                          <span class="spacer"></span>
                          <span
                            class="text-success"
                            style="font-family:'Rubik'"
                          >
                            <b>
                              <i
                                class="fa fa-info-circle"
                                aria-hidden="true"
                              ></i>
                              {{
                                quiz.total_attempted ? quiz.total_attempted : 0
                              }}
                              users attempted
                            </b>
                          </span>
                        </p>
                        <span
                          v-if="quiz.rating"
                          class="mt-1"
                          style="display:flex;flex-direction:row"
                        >
                          <label>
                            <input
                              id="star-rating"
                              class="rating lesson-review-item-rating"
                              type="text"
                              :value="quiz.rating"
                              data-size="xs"
                            />
                          </label>
                          <span
                            style="cursor:pointer"
                            @click="quiz_reviews(quiz.quiz_id)"
                            >View all</span
                          >
                        </span>
                      </div>
                      <i class="flex-filler"></i>
                      <div>
                        <button
                          class="cv-button noshadow"
                          @click="
                            $router.push(
                              '/quiz-admin-update/?quiz_name=' +
                                quiz.slug +
                                '&id=' +
                                quiz.quiz_id
                            )
                          "
                        >
                          Edit
                        </button>
                        <button
                          v-if="
                            quiz.public_permission == 1 && quiz.visible == 0
                          "
                          class="cv-button noshadow"
                          style="background:#13c047"
                          @click="public_quiz(quiz.quiz_id)"
                        >
                          Publish
                        </button>
                        <button
                          v-if="
                            quiz.public_permission == 1 && quiz.visible == 0
                          "
                          class="cv-button negative noshadow mt-1"
                          @click="reject_public_quiz(quiz.quiz_id)"
                        >
                          Reject
                        </button>
                        <span
                          class="text-success"
                          v-if="
                            quiz.public_permission == 1 && quiz.visible == 1
                          "
                        >
                          Approved
                          <i
                            class="fa fa-check"
                            style="color:#28a745;font-size:20px;padding-left:15px;"
                          ></i>
                        </span>
                      </div>
                    </div>
                  </template>
                </template>
                <div v-else style="padding:24px;color:#ccc;text-align:center">
                  There are no Quizzes!
                </div>
              </div>
            </template>
            <!-- <div class="content">
               <template  v-if="teacher_quizzess.findIndex(x => x.sub_id ===2)!=-1">
                <div v-for="quiz in teacher_quizzess" v-if="quiz.sub_id==2">
                  <div style="margin-right: 20px;"><img alt="Responsive image" src="/dynamic/Quizzes/quiz_img/default_quiz.png" style="width: 110px; background: rgb(51, 224, 255);"></div>
                <div>
                  <h3>{{quiz.quiz_name}}<span class="subject-tag">{{quiz.Subject}}</span></h3>
                  <div>
                  <p>Created by: {{quiz.teacher_name}}</p>
                  <p>School: {{quiz.school_name}}</p>
                  </div>
                   <p class="mt-1">{{quiz.total_question ? quiz.total_question:0}} Questions <span class="spacer"></span>{{quiz.total_marks? quiz.total_marks:0 }} Points <span class="spacer"></span> <span  class="text-success" style="font-family:'Rubik'"><b><i class="fa fa-info-circle" aria-hidden="true"></i> {{quiz.total_attempted? quiz.total_attempted:0}} users attempted</b></span> </p>
                  <span v-if="quiz.rating" class="mt-1" style="display:flex;flex-direction:row">
                  <label><input id="star-rating" class="rating lesson-review-item-rating" type="text" :value="quiz.rating" data-size="xs"/></label>
                  <span style="cursor:pointer" @click="quiz_reviews(quiz.quiz_id)">View all</span></span>

                 
                </div>
                <i class="flex-filler"></i>
                <div>
                 <button class="cv-button noshadow" @click="$router.push({name:'UpdateQuiz', params:{quiz_slug:quiz.slug,quizID:quiz.quiz_id,SubjectName:quiz.Subject,QuizName:quiz.quiz_name,subID:quiz.sub_id,quizPrice:quiz.price}})">Edit</button>
                  <button v-if="quiz.public_permission==1 && quiz.visible==0" class="cv-button noshadow" style="background:#13c047" @click="public_quiz(quiz.quiz_id)">Publish</button>
                  <button v-if="quiz.public_permission==1 && quiz.visible==0" class="cv-button negative noshadow mt-1" @click="reject_public_quiz(quiz.quiz_id)">Reject</button>
                  <span class="text-success" v-if="quiz.public_permission==1 && quiz.visible==1">Approved<i class="fa fa-check" style="color:#28a745;font-size:20px;padding-left:15px;"></i></span>
                </div>
              </div>
                  </template>
            <div v-else style="padding:24px;color:#ccc;text-align:center">There are no Quizzes!</div>
              
            </div>
            <div class="content">
              <template  v-if="teacher_quizzess.findIndex(x => x.sub_id ===3)!=-1">
                <div v-for="quiz in teacher_quizzess" v-if="quiz.sub_id==3">
                  <div style="margin-right: 20px;"><img alt="Responsive image" src="/dynamic/Quizzes/quiz_img/default_quiz.png" style="width: 110px; background: rgb(51, 224, 255);"></div>
                <div>
                  <h3>{{quiz.quiz_name}}<span class="subject-tag">{{quiz.Subject}}</span></h3>
                  
                 <div>
                  <p>Created by: {{quiz.teacher_name}}</p>
                  <p>School: {{quiz.school_name}}</p>
                  </div>
                  <p class="mt-1">{{quiz.total_question ? quiz.total_question:0}} Questions <span class="spacer"></span>{{quiz.total_marks? quiz.total_marks:0 }} Points <span class="spacer"></span> <span  class="text-success" style="font-family:'Rubik'"><b><i class="fa fa-info-circle" aria-hidden="true"></i> {{quiz.total_attempted? quiz.total_attempted:0}} users attempted</b></span> </p>
                  <span v-if="quiz.rating" class="mt-1" style="display:flex;flex-direction:row">
                  <label><input id="star-rating" class="rating lesson-review-item-rating" type="text" :value="quiz.rating" data-size="xs"/></label>
                  <span style="cursor:pointer" @click="quiz_reviews(quiz.quiz_id)">View all</span></span>

                </div>
                <i class="flex-filler"></i>
                <div>
                 <button class="cv-button noshadow" @click="$router.push({name:'UpdateQuiz', params:{quiz_slug:quiz.slug,quizID:quiz.quiz_id,SubjectName:quiz.Subject,QuizName:quiz.quiz_name,subID:quiz.sub_id,quizPrice:quiz.price}})">Edit</button>
                  <button v-if="quiz.public_permission==1 && quiz.visible==0" class="cv-button noshadow" style="background:#13c047" @click="public_quiz(quiz.quiz_id)">Publish</button>
                  <button v-if="quiz.public_permission==1 && quiz.visible==0" class="cv-button negative noshadow mt-1" @click="reject_public_quiz(quiz.quiz_id)">Reject</button>
                  <span class="text-success" v-if="quiz.public_permission==1 && quiz.visible==1">Approved<i class="fa fa-check" style="color:#28a745;font-size:20px;padding-left:15px;"></i></span>
                </div>
              </div>
                   </template>
            <div v-else style="padding:24px;color:#ccc;text-align:center">There are no Quizzes!</div>
            
            </div>
            <div class="content">
              <template  v-if="teacher_quizzess.findIndex(x => x.sub_id ===4)!=-1">
                <div v-for="quiz in teacher_quizzess" v-if="quiz.sub_id==4">
                  <div style="margin-right: 20px;"><img alt="Responsive image" src="/dynamic/Quizzes/quiz_img/default_quiz.png" style="width: 110px; background: rgb(51, 224, 255);"></div>
                <div>
                  <h3>{{quiz.quiz_name}}<span class="subject-tag">{{quiz.Subject}}</span></h3>
                 
                 <div>
                  <p>Created by: {{quiz.teacher_name}}</p>
                  <p>School: {{quiz.school_name}}</p>
                  </div>
                 <p class="mt-1">{{quiz.total_question ? quiz.total_question:0}} Questions <span class="spacer"></span>{{quiz.total_marks? quiz.total_marks:0 }} Points <span class="spacer"></span> <span  class="text-success" style="font-family:'Rubik'"><b><i class="fa fa-info-circle" aria-hidden="true"></i> {{quiz.total_attempted? quiz.total_attempted:0}} users attempted</b></span> </p>
                  <span v-if="quiz.rating" class="mt-1" style="display:flex;flex-direction:row">
                  <label><input id="star-rating" class="rating lesson-review-item-rating" type="text" :value="quiz.rating" data-size="xs"/></label>
                  <span style="cursor:pointer" @click="quiz_reviews(quiz.quiz_id)">View all</span></span>

                </div>
                <i class="flex-filler"></i>
                <div>
               <button class="cv-button noshadow" @click="$router.push({name:'UpdateQuiz', params:{quiz_slug:quiz.slug,quizID:quiz.quiz_id,SubjectName:quiz.Subject,QuizName:quiz.quiz_name,subID:quiz.sub_id,quizPrice:quiz.price}})">Edit</button>
                  <button v-if="quiz.public_permission==1 && quiz.visible==0" class="cv-button noshadow" style="background:#13c047" @click="public_quiz(quiz.quiz_id)">Publish</button>
                  <button v-if="quiz.public_permission==1 && quiz.visible==0" class="cv-button negative noshadow mt-1" @click="reject_public_quiz(quiz.quiz_id)">Reject</button>
                  <span class="text-success" v-if="quiz.public_permission==1 && quiz.visible==1">Approved<i class="fa fa-check" style="color:#28a745;font-size:20px;padding-left:15px;"></i></span>
                </div>
              </div>

                  </template>
            <div v-else style="padding:24px;color:#ccc;text-align:center">There are no Quizzes!</div>
              
            </div>
            <div class="content">
               <template  v-if="teacher_quizzess.findIndex(x => x.sub_id ===5)!=-1">
                <div v-for="quiz in teacher_quizzess" v-if="quiz.sub_id==5">
                  <div style="margin-right: 20px;"><img alt="Responsive image" src="/dynamic/Quizzes/quiz_img/default_quiz.png" style="width: 110px; background: rgb(51, 224, 255);"></div>
                <div>
                  <h3>{{quiz.quiz_name}}<span class="subject-tag">{{quiz.Subject}}</span></h3>
                 
                <div>
                  <p>Created by: {{quiz.teacher_name}}</p>
                  <p>School: {{quiz.school_name}}</p>
                  </div>
                   <p class="mt-1">{{quiz.total_question ? quiz.total_question:0}} Questions <span class="spacer"></span>{{quiz.total_marks? quiz.total_marks:0 }} Points <span class="spacer"></span> <span  class="text-success" style="font-family:'Rubik'"><b><i class="fa fa-info-circle" aria-hidden="true"></i> {{quiz.total_attempted? quiz.total_attempted:0}} users attempted</b></span> </p>
                  <span v-if="quiz.rating" class="mt-1" style="display:flex;flex-direction:row">
                  <label><input id="star-rating" class="rating lesson-review-item-rating" type="text" :value="quiz.rating" data-size="xs"/></label>
                  <span style="cursor:pointer" @click="quiz_reviews(quiz.quiz_id)">View all</span></span>

                </div>
                <i class="flex-filler"></i>
                <div>
                  <button class="cv-button noshadow" @click="$router.push({name:'UpdateQuiz', params:{quiz_slug:quiz.slug,quizID:quiz.quiz_id,SubjectName:quiz.Subject,QuizName:quiz.quiz_name,subID:quiz.sub_id,quizPrice:quiz.price}})">Edit</button>
                   <button v-if="quiz.public_permission==1 && quiz.visible==0" class="cv-button noshadow" style="background:#13c047" @click="public_quiz(quiz.quiz_id)">Publish</button>
                   <button v-if="quiz.public_permission==1 && quiz.visible==0" class="cv-button negative noshadow mt-1" @click="reject_public_quiz(quiz.quiz_id)">Reject</button>
                  <span class="text-success" v-if="quiz.public_permission==1 && quiz.visible==1">Approved<i class="fa fa-check" style="color:#28a745;font-size:20px;padding-left:15px;"></i></span>
                </div>
              </div>
                   </template>
            <div v-else style="padding:24px;color:#ccc;text-align:center">There are no Quizzes!</div>
            
            </div>-->
            <!--end mcq question-->
          </div>
        </div>
        <!--end teacher Quizzess-->
        <!--users Quizzess-->
        <div class="content">
          <div id="quizzes-tablayout" class="cv-tablayout">
            <div class="tabs">
              <template v-for="(subject, index) in subjects">
                <div class="active" :key="index" v-if="index == 0">
                  {{ subject.subject }}
                </div>
                <div :key="index" v-else>{{ subject.subject }}</div>
              </template>
            </div>
            <!--mcq question-->
            <div style="display:flex;justify-content:flex-end;padding:12px">
              <label style="margin-bottom:0">Select Quiz</label>
              <select class id="filter_user_quiz" @change="filter_user_data()">
                <option value="0">All Quizzes</option>
                <option value="1">Requested For Public</option>
                <option value="2">Approved</option>
              </select>
            </div>
            <template v-for="(quiz_for_sub, sub_index22) in subjects">
              <div
                :class="'content ' + [sub_index22 + 1 == 1 ? ' active' : '']"
                :key="sub_index22"
              >
                <template
                  v-if="
                    quizzes.findIndex(x => x.sub_id === quiz_for_sub.sub_id) !=
                      -1
                  "
                >
                  <template v-for="(quiz, q_ind) in users_quizzes">
                    <div :key="q_ind" v-if="quiz.sub_id == quiz_for_sub.sub_id">
                      <div style="margin-right: 20px;">
                        <img
                          alt="Responsive image"
                          :src="
                            '/dynamic/Quizzes/quiz_img/' +
                              [
                                quiz.quiz_img
                                  ? quiz.quiz_img
                                  : 'default_quiz.png'
                              ]
                          "
                          style="width: 110px; background: rgb(51, 224, 255);"
                        />
                      </div>
                      <div>
                        <h3>
                          {{ quiz.quiz_name }}
                          <span class="subject-tag">{{
                            quiz.quiz_subject
                          }}</span>
                        </h3>
                        <div>
                          <p>Created by: {{ quiz.teacher_name }}</p>
                          <p>School: {{ quiz.school_name }}</p>
                        </div>
                        <p class="mt-1">
                          {{
                            quiz.total_question ? quiz.total_question : 0
                          }}
                          Questions
                          <span class="spacer"></span>
                          {{ quiz.total_marks ? quiz.total_marks : 0 }} Points
                          <span class="spacer"></span>
                          <span
                            class="text-success"
                            style="font-family:'Rubik'"
                          >
                            <b>
                              <i
                                class="fa fa-info-circle"
                                aria-hidden="true"
                              ></i>
                              {{
                                quiz.total_attempted ? quiz.total_attempted : 0
                              }}
                              users attempted
                            </b>
                          </span>
                        </p>
                        <span
                          v-if="quiz.rating"
                          class="mt-1"
                          style="display:flex;flex-direction:row"
                        >
                          <label>
                            <input
                              id="star-rating"
                              class="rating lesson-review-item-rating"
                              type="text"
                              :value="quiz.rating"
                              data-size="xs"
                            />
                          </label>
                          <span
                            style="cursor:pointer"
                            @click="quiz_reviews(quiz.quiz_id)"
                            >View all</span
                          >
                        </span>
                      </div>
                      <i class="flex-filler"></i>
                      <div>
                        <button
                          class="cv-button noshadow"
                          @click="
                            $router.push(
                              '/quiz-admin-update/?quiz_name=' +
                                quiz.slug +
                                '&id=' +
                                quiz.quiz_id
                            )
                          "
                        >
                          Edit
                        </button>
                        <button
                          v-if="
                            quiz.public_permission == 1 && quiz.visible == 0
                          "
                          class="cv-button noshadow"
                          style="background:#13c047"
                          @click="public_quiz_user(quiz.quiz_id)"
                        >
                          Publish
                        </button>
                        <button
                          v-if="
                            quiz.public_permission == 1 && quiz.visible == 0
                          "
                          class="cv-button negative noshadow mt-1"
                          @click="reject_public_quiz_user(quiz.quiz_id)"
                        >
                          Reject
                        </button>
                        <span
                          class="text-success"
                          v-if="
                            quiz.public_permission == 1 && quiz.visible == 1
                          "
                        >
                          Approved
                          <i
                            class="fa fa-check"
                            style="color:#28a745;font-size:20px;padding-left:15px;"
                          ></i>
                        </span>
                      </div>
                    </div>
                  </template>
                </template>
                <div v-else style="padding:24px;color:#ccc;text-align:center">
                  There are no Quizzes!
                </div>
              </div>
            </template>
          </div>
        </div>
        <!--end teacher Quizzes-->
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
import AdminNavbar from "@/components/header/HeaderMenuForAdmin.vue";
import moment from "vue-moment";
import axios from "axios";
export default {
  components: { AdminNavbar: AdminNavbar },
  data() {
    return {
      subjects: [],
      quizzes: [],
      questions: [],
      teacher_quizzess: [],
      users_quizzes: [],
      review_all: []
    };
  },
  beforeCreate() {},

  created() {},
  mounted: function() {
    this.get_subject();
  },
  updated() {
    initQuizAndStuff();
    initCvModals();
    initCvTablayouts();
    $(".lesson-review-item-rating").rating({
      displayOnly: true,
      theme: "krajee-fas",
      showCaption: false
    });
  },
  methods: {
    publish_quiz: function(quiz_id) {
      let vm = this;
      axios
        .post("/api/user/update_admininst_permission", {
          quiz_id: quiz_id,
          publish_institute: 1
        })
        .then(res => {
          window.cvNotify("Updated Successfully", "success");
          vm.get_subject();
        });
    },
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
      this.$http
        .post("/api/user/get_quiz_reviews", { quiz_id: quiz_id })
        .then(function(res) {
          if (res.body.status == "403") {
          } else {
            this.review_all = res.body.data;
            //   console.log(this.review_all);
            showModal("quiz_reviews");
          }
        });
    },
    public_quiz: function(quiz_id) {
      let vm = this;
      axios
        .post("/api/user/ApprovePublishPermission", { quiz_id: quiz_id })
        .then(function(res) {
          window, cvNotify("Quiz publish approved successful", "success");
          vm.filter_teacher_data();
        });
    },

    public_quiz_user: function(quiz_id) {
      let vm = this;
      axios
        .post("/api/user/ApproveUserPublishPermission", { quiz_id: quiz_id })
        .then(function(res) {
          window.cvNotify("Quiz publish approved successful", "success");
          vm.filter_user_data();
        });
    },
    reject_public_quiz: function(quiz_id) {
      let vm = this;
      axios
        .post("/api/user/RejectPublishPermission", { quiz_id: quiz_id })
        .then(function(res) {
          window.cvNotify("Quiz publish approved successful", "success");
          vm.filter_teacher_data();
        });
    },
    reject_public_quiz_user: function(quiz_id) {
      axios
        .post("/api/user/RejectPublishPermission", { quiz_id: quiz_id })
        .then(function(res) {
          window.cvNotify("Quiz publish request reject successful", "success");
          vm.filter_user_data();
        });
    },
    filter_teacher_data: function() {
      this.select_data = $("#filter_teacher_quiz").val();

      if (this.select_data == 0) {
        this.$http.post("/api/user/AllteachersQuizzes").then(function(res) {
          if (res.body.status != 200) {
          } else {
            this.teacher_quizzess = res.body.data;
          }
        });
      } else if (this.select_data == 1) {
        this.$http
          .post("/api/user/AllteachersfilterQuizzes", {
            public_permission: 1,
            visible: 0
          })
          .then(function(res) {
            if (res.body.status != 200) {
            } else {
              this.teacher_quizzess = res.body.data;
            }
          });
      } else if (this.select_data == 2) {
        this.$http
          .post("/api/user/AllteachersfilterQuizzes", {
            public_permission: 1,
            visible: 1
          })
          .then(function(res) {
            if (res.body.status != 200) {
            } else {
              this.teacher_quizzess = res.body.data;
            }
          });
      }
    },
    filter_user_data: function() {
      this.select_data = $("#filter_user_quiz").val();

      if (this.select_data == 0) {
        this.$http.post("/api/user/AllUsersQuizzes").then(function(res) {
          if (res.body.status != 200) {
          } else {
            this.users_quizzes = res.body.data;
          }
        });
      } else if (this.select_data == 1) {
        this.$http
          .post("/api/user/AllUsersfilterQuizzes", {
            public_permission: 1,
            visible: 0
          })
          .then(function(res) {
            if (res.body.status != 200) {
            } else {
              this.users_quizzes = res.body.data;
            }
          });
      } else if (this.select_data == 2) {
        this.$http
          .post("/api/user/AllUsersfilterQuizzes", {
            public_permission: 1,
            visible: 1
          })
          .then(function(res) {
            if (res.body.status != 200) {
            } else {
              this.users_quizzes = res.body.data;
            }
          });
      }
    },
    remove_quiz: function(e, name) {
      //   console.log(e);
      let ans = confirm("Do you want to delete " + name + "?");
      if (ans) {
        //delete functionality
      }
    },
    get_subject: function() {
      this.$http.post("/api/user/get_subject").then(function(res) {
        if (res.body.status == "403") {
        } else {
          this.subjects = res.body.data;
        }
      });
      this.$http.post("/api/user/AllQuizes").then(function(res) {
        if (res.body.status == "403") {
        } else {
          this.quizzes = res.body.data;

          //hidePreloader();
        }
      });
      this.$http.post("/api/user/get_all_questions").then(function(res) {
        if (res.body.status == "403") {
        } else {
          this.questions = res.body.data;
          for (var i = 0; i < this.questions.length; i++) {
            this.questions[i].question = getQuizContentWithAllTemplateRendered(
              this.questions[i].question
            );

            //console.log()
          }
          hidePreloader();
        }
      });
      this.$http.post("/api/user/AllteachersQuizzes").then(function(res) {
        if (res.body.status != 200) {
        } else {
          this.teacher_quizzess = res.body.data;
        }
      });
      this.$http.post("/api/user/AllUsersQuizzes").then(function(res) {
        if (res.body.status != 200) {
        } else {
          this.users_quizzes = res.body.data;
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
  width: 100%;
  margin: 16px 24px;
  & > .tabs {
    align-items: center;
    div {
      min-width: 140px;
      &:first-of-type {
        border-top-left-radius: 8px;
      }
    }
    i {
      visibility: hidden;
    }
    button {
      height: 32px;
      margin-right: 8px;
      padding: 8px;
      line-height: 1;
      background: rgb(19, 192, 71);
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
      border-radius: 8px;
      &.active {
        background: rgb(0, 0, 0);
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
