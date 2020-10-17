<template>
  <div id="main-div">
    <Header />
    <div
      class="container-fluid"
      id="student-feedback"
      style="background: #fff;"
    >
      <div id="student-info">
        <div class="col-sm-2">
          Student Name:
          {{
            StudentDetails && StudentDetails.length
              ? StudentDetails[0].name
              : ''
          }}
        </div>
        <div class="col-sm-2">
          Parent Name:
          {{
            StudentDetails && StudentDetails.length
              ? StudentDetails[0].parent_name
              : ''
          }}
        </div>
        <div class="col-sm-4">
          Parent Email:
          {{
            StudentDetails && StudentDetails.length
              ? StudentDetails[0].parent_email
              : ''
          }}
        </div>
        <div class="col-sm-2">
          Parent Contact:
          {{
            StudentDetails && StudentDetails.length
              ? StudentDetails[0].parent_contact
              : ''
          }}
        </div>
        <div class="col-sm-2">
          Parent Module:
          {{
            StudentDetails && StudentDetails.length
              ? StudentDetails[0].theme
              : ''
          }}
        </div>
      </div>
      <div id="feedback-form">
        <div id="star-rating">
          <div class="star-field">
            <span class="star-label">Communication</span>
            <StarRating
              ref="communication"
              v-bind:rating="rating && rating.length ? rating[0] * 5 : 0"
              @setVal="setVal"
              :idx="0"
            />
          </div>
          <div class="star-field">
            <span class="star-label">Colaboration</span>
            <StarRating
              ref="colaboration"
              v-bind:rating="rating && rating.length ? rating[1] * 5 : 0"
              @setVal="setVal"
              :idx="1"
            />
          </div>
          <div class="star-field">
            <span class="star-label">Creativity</span>
            <StarRating
              ref="creativity"
              v-bind:rating="rating && rating.length ? rating[2] * 5 : 0"
              @setVal="setVal"
              :idx="2"
            />
          </div>
          <div class="star-field">
            <span class="star-label">Critical Thinking</span>
            <StarRating
              ref="critica_thinking"
              v-bind:rating="rating && rating.length ? rating[3] * 5 : 0"
              @setVal="setVal"
              :idx="3"
            />
          </div>
        </div>
        <div id="comment-box">
          <textarea
            class="form-control mx-1"
            name="comment"
            id="add-comment"
            cols="30"
            rows="5"
            placeholder="Add Comment"
          ></textarea>
          <div id="select-course">
            <select
              class="form-control"
              id="suggestion1"
              name="course-2"
              @change="dynamicCourse"
            >
              <option
                v-for="course in courses"
                :value="course.live_course_id"
                :key="course.value"
              >
                {{ course.live_course_name }}
              </option>
            </select>
            <select
              id="suggestion2"
              class="form-control mx-1"
              name="course-2"
              @change="dynamicCourse"
            >
              <option
                v-for="course in suggestedCourse"
                :value="course.live_course_id"
                :key="course.value"
              >
                {{ course.live_course_name }}
              </option>
            </select>
          </div>
          <button
            class="btn btn-primary"
            v-on:click="submitFeedback"
            style="margin-top: 20px;"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
    <div id="skill-chart" v-if="viewChart" style="background: #fff;">
      <GChart type="BarChart" :data="chartData" :options="options" :key="key" />
      <div style="font-size: 24px; padding: 20px;">
        Your kid has shown exceptional skills in colaboration communication and
        creative thinking. He has to work on his creativity skill. Below are
        suggested courses for your child. You should be very proud of your
        child.
      </div>

      <div id="suggested-courses">
        <div class="col-sm-6">
          <!--card1-->
          <div class="col-lg-12 col-md-8 col-xl-8 mt-5">
            <div class="card mb-12">
              <div class="item-card2-img">
                <a
                  @click="
                    $router.push({
                      name: 'LiveCourseDetail',
                      params: {
                        liveCourseName: courses.filter(
                          (x) => x.live_course_id == course1,
                        )[0].live_course_slug,
                        bookId: courses.filter(
                          (x) => x.live_course_id == course1,
                        )[0].live_course_id,
                      },
                    })
                  "
                ></a>

                <img
                  :src="
                    courses.filter((x) => x.live_course_id == course1)[0].img
                      ? '/assets/images/png/courses/' +
                        courses.filter((x) => x.live_course_id == course1)[0]
                          .img
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
                        (courses.filter((x) => x.live_course_id == course1)[0]
                          .avg_rating
                          ? courses.filter(
                              (x) => x.live_course_id == course1,
                            )[0].avg_rating * 20
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
                            liveCourseName: courses.filter(
                              (x) => x.live_course_id == course1,
                            )[0].live_course_slug,
                            bookId: courses.filter(
                              (x) => x.live_course_id == course1,
                            )[0].live_course_id,
                          },
                        })
                      "
                      class="text-dark"
                    >
                      <h4
                        class="mb-2"
                        v-html="
                          courses.filter((x) => x.live_course_id == course1)[0]
                            .live_course_name
                        "
                      ></h4>
                    </a>
                  </div>
                  <p>
                    {{
                      courses.filter((x) => x.live_course_id == course1)[0]
                        .live_course_outcomes
                    }}
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
                        "
                      >
                        <b>Grade:</b>
                        {{
                          courses
                            .filter((x) => x.live_course_id == course1)[0]
                            .grade.split(',')[0]
                        }}-{{
                          courses
                            .filter((x) => x.live_course_id == course1)[0]
                            .grade.split(/[, ]+/)
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
                        "
                      >
                        <b>Age Group:</b>
                        {{
                          courses.filter((x) => x.live_course_id == course1)[0]
                            .age_group
                        }}
                      </a>
                    </li>
                    <li class="col-sm-6 mt-4">
                      <a
                        href="#"
                        class="icons"
                        style="color: #000; border-radius: 2px;"
                      >
                        <i class="fas fa-clock"></i>
                        <span
                          class="newprice text-dark ml-1"
                          style="font-size: 14px;"
                        >
                          {{
                            courses.filter(
                              (x) => x.live_course_id == course1,
                            )[0].duration
                          }}
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
                              liveCourseName: courses.filter(
                                (x) => x.live_course_id == course1,
                              )[0].live_course_slug,
                              bookId: courses.filter(
                                (x) => x.live_course_id == course1,
                              )[0].live_course_id,
                            },
                          })
                        "
                        class="icons text-center"
                        style="
                          background: #007cff;
                          padding: 4px 20px 4px 20px;
                          color: #fff;
                          border-radius: 2px;
                        "
                      >
                        <b>Learn More</b>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <!--end card1-->
        </div>
        <div class="col-sm-6">
          <!--card1-->
          <div class="col-lg-12 col-md-8 col-xl-8 mt-5">
            <div class="card mb-12">
              <div class="item-card2-img">
                <a
                  @click="
                    $router.push({
                      name: 'LiveCourseDetail',
                      params: {
                        liveCourseName: suggestedCourse.filter(
                          (x) => x.live_course_id == course2,
                        )[0].live_course_slug,
                        bookId: suggestedCourse.filter(
                          (x) => x.live_course_id == course2,
                        )[0].live_course_id,
                      },
                    })
                  "
                ></a>

                <img
                  :src="
                    suggestedCourse.filter(
                      (x) => x.live_course_id == course2,
                    )[0].img
                      ? '/assets/images/png/courses/' +
                        suggestedCourse.filter(
                          (x) => x.live_course_id == course2,
                        )[0].img
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
                        (suggestedCourse.filter(
                          (x) => x.live_course_id == course2,
                        )[0].avg_rating
                          ? suggestedCourse.filter(
                              (x) => x.live_course_id == course2,
                            )[0].avg_rating * 20
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
                            liveCourseName: suggestedCourse.filter(
                              (x) => x.live_course_id == course2,
                            )[0].live_course_slug,
                            bookId: suggestedCourse.filter(
                              (x) => x.live_course_id == course2,
                            )[0].live_course_id,
                          },
                        })
                      "
                      class="text-dark"
                    >
                      <h4
                        class="mb-2"
                        v-html="
                          suggestedCourse.filter(
                            (x) => x.live_course_id == course2,
                          )[0].live_course_name
                        "
                      ></h4>
                    </a>
                  </div>
                  <p>
                    {{
                      suggestedCourse.filter(
                        (x) => x.live_course_id == course2,
                      )[0].live_course_outcomes
                    }}
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
                        "
                      >
                        <b>Grade:</b>
                        {{
                          suggestedCourse
                            .filter((x) => x.live_course_id == course2)[0]
                            .grade.split(',')[0]
                        }}-{{
                          suggestedCourse
                            .filter((x) => x.live_course_id == course2)[0]
                            .grade.split(/[, ]+/)
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
                        "
                      >
                        <b>Age Group:</b>
                        {{
                          suggestedCourse.filter(
                            (x) => x.live_course_id == course2,
                          )[0].age_group
                        }}
                      </a>
                    </li>
                    <li class="col-sm-6 mt-4">
                      <a
                        href="#"
                        class="icons"
                        style="color: #000; border-radius: 2px;"
                      >
                        <i class="fas fa-clock"></i>
                        <span
                          class="newprice text-dark ml-1"
                          style="font-size: 14px;"
                        >
                          {{
                            suggestedCourse.filter(
                              (x) => x.live_course_id == course2,
                            )[0].duration
                          }}
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
                              liveCourseName: suggestedCourse.filter(
                                (x) => x.live_course_id == course2,
                              )[0].live_course_slug,
                              bookId: suggestedCourse.filter(
                                (x) => x.live_course_id == course2,
                              )[0].live_course_id,
                            },
                          })
                        "
                        class="icons text-center"
                        style="
                          background: #007cff;
                          padding: 4px 20px 4px 20px;
                          color: #fff;
                          border-radius: 2px;
                        "
                      >
                        <b>Learn More</b>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <!--end card1-->
        </div>
      </div>

      <button
        class="btn btn-primary"
        style="width: 60px; align-self: center;"
        @click="SendReport"
      >
        Send
      </button>
    </div>
    <div id="footer-wrapper">
      <Footer />
    </div>
    <Loader v-if="processing" />
  </div>
</template>

<script>
import StarRating from '@/components/student-feedback/StarRating'
//import Header from "@/components/header/Header.vue";
import Header from '@/components/header/CodevidhyaNewHeader.vue'
import Footer from '@/components/footer/Footer.vue'
import { GChart } from 'vue-google-charts'
import axios from 'axios'
import moment from 'vue-moment'
import Loader from '@/components/widgets/BlockingLoader.vue'
import AuthMixin from '@/mixins/AuthMixin.js'
export default {
  mixins: [AuthMixin],
  name: 'StudentFeedback',
  props: ['req_id'],
  components: {
    StarRating,
    Loader,
    GChart,
    Header,
    Footer,
  },
  data() {
    return {
      username: '',
      comment: '',
      suggestedCourse: [],
      processing: false,

      values: [
        ['Skill', 'Rating'],
        ['Communication', 0],
        ['Colaboration', 0],
        ['Creativity', 0],
        ['Critical Thinking', 0],
      ],
      options: {
        backgroundColor: '#fff',
        height: 400,
        title: "Your Kid's Progress on 21st Century Skills",
        colors: ['#e0440e'],
        hAxis: {
          format: 'percent',
          ticks: [0, 0.2, 0.4, 0.6, 0.8, 1],
        },
        legend: {
          position: 'none',
        },
      },
      viewChart: false,
      key: 0,
      courses: [],

      userId: '',
      StudentDetails: [],
      allCourses: [],
      objSkill: [],
      PreviousData: [],
      rating: [],
      course1: 0,
      course2: 0,
    }
  },
  mounted() {
    cvAuth.getUserId(
      function (userId) {
        if (userId) {
          this.userId = userId
          this.getRequestDetails()
        }
      }.bind(this),
    )
  },
  methods: {
    dynamicCourse() {
      let id = $('#suggestion1').val()
      this.course1 = id
      let id2 = $('#suggestion2').val()
      this.course2 = id2
      let vm = this
      let index = vm.courses.findIndex((x) => x.live_course_id == id)
      let index2 = vm.suggestedCourse.findIndex((x) => x.live_course_id == id2)
      vm.suggestedCourse = vm.allCourses.filter(
        (x) => x.live_course_id != vm.courses[index].live_course_id,
      )
      vm.courses = vm.allCourses.filter(
        (x) => x.live_course_id != vm.suggestedCourse[index2].live_course_id,
      )
    },
    async getRequestDetails() {
      let vm = this
      axios
        .post('/api/liveCourse/GetStudentDetailForCourseSuggestion', {
          req_id: this.req_id,
        })
        .then(async (res) => {
          this.StudentDetails = res.data
          await axios
            .post('/api/liveCourse/GetStudentExistFeedbackDetails', {
              req_id: this.req_id,
              user_id: this.StudentDetails[0].user_id,
            })
            .then((res2) => {
              this.PreviousData = res2.data
              $('#add-comment').val(this.PreviousData[0].comments)
              let Courses = this.PreviousData[0].course_suggestion.split('|')
              $('#suggestion1').find(':selected').text(Courses[0])
              $('#suggestion2').find(':selected').text(Courses[1])
              this.course1 = $('#suggestion1').val()
              this.course2 = $('#suggestion2').val()
              JSON.parse(this.PreviousData[0].skills).forEach((item, index) => {
                let data = parseFloat(Object.values(item))
                this.rating.push(data)
              })
            })
        })
      axios.post('/api/liveCourse/getLiveCoursesForFeedback').then((res) => {
        vm.allCourses = res.data
        console.log(vm.allCourses)
        vm.suggestedCourse = vm.allCourses.filter(
          (x) => x.live_course_id != vm.allCourses[0].live_course_id,
        )
        vm.courses = vm.allCourses.filter(
          (x) => x.live_course_id != vm.suggestedCourse[0].live_course_id,
        )
        vm.course1 = vm.courses[0].live_course_id
        vm.course2 = vm.suggestedCourse[0].live_course_id
      })
    },
    setVal(idx, val) {
      if (this.username) {
        this.db[this.username].rating[idx] = val / 5
      }
      this.values[idx + 1][1] = val / 5
    },
    async submitFeedback() {
      this.viewChart = true
      this.Course1 = this.key++
    },
    async SendReport() {
      let keyData
      this.objSkill = []
      await this.values.forEach((item, index) => {
        if (index != 0) {
          let obj = {}
          let key = item[0]
          obj[key] = item[1]
          this.objSkill.push(obj)
        }
      })
      // console.log(this.values)

      let suggestCourse1 = $('#suggestion1 option:selected').text()
      let suggestCourse2 = $('#suggestion2 option:selected').text()

      let courses = suggestCourse1 + '|' + suggestCourse2
      let courses_ids = this.course1 + ',' + this.course2
      let req_id = this.StudentDetails[0].req_id
      let user_id = this.StudentDetails[0].user_id
      let studentName = this.StudentDetails[0].name
      let parent_email = this.StudentDetails[0].parent_email
      let comment = $('#add-comment').val()
      this.processing = true
      await axios
        .post('/api/liveCourse/PostStudentDetailForCourseSuggestion', {
          req_id: req_id,
          user_id: user_id,
          skills: this.objSkill,
          course_suggestion: courses,
          courses_ids: courses_ids,
          comment: comment,
          studentName: studentName,
          parent_email: parent_email,
        })
        .then((dataResponse) => {
          cvNotify('Psychometric Report has been sent successfully', 'success')
          this.processing = false
          this.getRequestDetails()
        })
    },
  },
  computed: {
    chartData() {
      return this.values
    },
  },
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}
#main-div {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: flex-start;
}
#footer-wrapper {
  margin-top: auto;
}
#student-feedback {
  padding-top: 59px;
  margin: 20px auto;
  margin-bottom: 0;
  width: 80%;
}
#skill-chart {
  margin: 0 auto;
  padding: 40px 10px;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
#student-info {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
}
#feedback-form {
  display: flex;
  justify-content: space-between;
}
#star-rating {
  width: 50%;
  align-items: center;
  margin: 20px;
}
#select-course {
  margin-top: 20px;
  width: 75%;
  display: flex;
  justify-content: space-around;
}
#comment-box {
  width: 50%;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 20px;
}
.star-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.star-label {
  font-size: 24px;
}
#suggested-courses {
  display: flex;
  justify-content: space-around;
  margin: 30px;
}
.course-placeholder {
  height: 180px;
  width: 320px;
  background-color: violet;
}
</style>
