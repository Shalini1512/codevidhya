<template>
  <div class="card" v-if="next_lessons && next_lessons.length">
    <div class="card-header">
      <h3 class="card-title">Upcoming Lessons</h3>
    </div>
    <div class="card-body">
      <div class="row">
        <template v-for="(next_lesson, next_key) in next_lessons">
          <div class="col-xl-4 col-md-6" v-bind:key="next_key">
            <div class="card overflow-hidden">
              <div class="item-card7-img" style="max-height:200px">
                <div class="item-card7-imgs">
                  <a
                    href=""
                    @click.prevent="
                      $router.push({
                        name: 'course-content',
                        params: {
                          curName: next_lesson.book_slug,
                          topicActualName: next_lesson.topic_name,
                          topicName: next_lesson.slug,
                          pageId: next_lesson.page_id,
                          user_sch_id: next_lesson.sch_id,
                          purchases_status: next_lesson.purchases_status,
                          for_grade: next_lesson.for_grade,
                          sch_course: next_lesson.sch_course
                        }
                      })
                    "
                  ></a>
                  <img
                    src="/assets/images/quiz/default_quiz.png"
                    alt="img"
                    class="cover-image"
                  />
                </div>
              </div>
              <div class="card-body">
                <div class="item-card7-desc">
                  <div class="item-card7-text  d-flex mb-3">
                    <div class="text-dark">
                      <h5 class="">
                        {{
                          next_lesson.topic_name.length > 20
                            ? next_lesson.topic_name.substring(0, 20) + "..."
                            : next_lesson.topic_name
                        }}
                      </h5>
                    </div>
                  </div>
                  <a class="mr-4"
                    >Lesson No.
                    <span class="font-weight-bold">{{
                      next_lesson.lesson_no
                    }}</span></a
                  >
                  <a class="mr-4 float-right"
                    >Topics:
                    <span class="font-weight-bold">{{
                      next_lesson.tot_topic
                    }}</span></a
                  >
                </div>
              </div>
              <div class="card-footer">
                <button
                  class="btn btn-primary btn-block"
                  @click="
                    $router.push({
                      name: 'course-content',
                      params: {
                        curName: next_lesson.book_slug,
                        topicActualName: next_lesson.topic_name,
                        topicName: next_lesson.slug,
                        pageId: next_lesson.page_id,
                        user_sch_id: next_lesson.sch_id,
                        purchases_status: next_lesson.purchases_status,
                        for_grade: next_lesson.for_grade,
                        sch_course: next_lesson.sch_course
                      }
                    })
                  "
                >
                  Start Learning
                </button>
              </div>
            </div>
          </div>
        </template>
        <!--<div class="col-xl-4 col-md-6">
          <div class="card overflow-hidden">
            <div class="item-card7-img" style="max-height:200px">
              <div class="item-card7-imgs">
                <a href="page-details.html"></a>
                <img
                  src="/assets/images/quiz/default_quiz.png"
                  alt="img"
                  class="cover-image"
                />
              </div>
            </div>
            <div class="card-body">
              <div class="item-card7-desc">
                <div class="item-card7-text  d-flex mb-3">
                  <div class="text-dark"><h4 class="">Text Elements</h4></div>
                </div>
                <a class="mr-4"
                  >Lesson No. <span class="font-weight-bold">3</span></a
                >
                <a class="mr-4 float-right"
                  >Topics: <span class="font-weight-bold">12</span></a
                >
              </div>
            </div>
            <div class="card-footer">
              <a href="education.html" class="btn btn-primary btn-block"
                >Start Learning</a
              >
            </div>
          </div>
        </div>-->
        <!--<div class="col-xl-4 col-md-6">
          <div class="card overflow-hidden">
            <div class="item-card7-img" style="max-height:200px">
              <div class="item-card7-imgs">
                <a href="page-details.html"></a>
                <img
                  src="/assets/images/quiz/default_quiz.png"
                  alt="img"
                  class="cover-image"
                />
              </div>
            </div>
            <div class="card-body">
              <div class="item-card7-desc">
                <div class="item-card7-text  d-flex mb-3">
                  <div class="text-dark"><h4 class="">Text Elements</h4></div>
                </div>
                <a class="mr-4"
                  >Lesson No. <span class="font-weight-bold">3</span></a
                >
                <a class="mr-4 float-right"
                  >Topics: <span class="font-weight-bold">12</span></a
                >
              </div>
            </div>
            <div class="card-footer">
              <a href="education.html" class="btn btn-primary btn-block"
                >Start Learning</a
              >
            </div>
          </div>
        </div>-->
      </div>
    </div>
  </div>
</template>
<script>
import AuthMixin from "@/mixins/AuthMixin.js";
import axios from "axios";
export default {
  mixins: [AuthMixin],
  props: {
    next_lessons: Array
  }
};
</script>
