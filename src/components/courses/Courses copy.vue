<template>
  <div id="courses-grid-section" class="sptb bg-white" style="background: red;">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="">
            <div class="items-gallery">
              <div class="items-blog-tab text-center">
                <div class="tab-content">
                  <div class="tab-pane" id="tab-1">
                    <div class="row">
                      <!--one course block-->
                      <!--one course block ended-->
                      <!--one course block-->
                      <!-- dynamic courses -->
                      <div
                        class="col-lg-6 col-md-12 col-xl-4 mt-5"
                        v-for="(lms_book, index) in lms_books"
                        v-bind:key="index"
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
                                '/assets/images/png/courses/' + lms_book.img
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
                                    <!--<a
                                  :href="'https://studio.codevidhya.com/courses/'+lms_book.slug"
                                    class="text-dark"
                                    >-->
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
                                      <i class="icon icon-user mr-1"></i>
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
                                    v-if="!unlockedCourses[lms_book.book_id]"
                                  >
                                    Rs.
                                    <del
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
                                        lms_book.price ? lms_book.price : 'Free'
                                      }}
                                    </span>
                                  </div>
                                  <a
                                    :class="
                                      'btn btn-info btn-sm ml-auto ' +
                                      [
                                        unlockedCourses[lms_book.book_id]
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
                                        ? 'Start Learning'
                                        : 'Enroll Now'
                                    }}
                                  </a>
                                  
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--tab--2-->
                  <div class="tab-pane active" id="tab-2">
                    <div class="row">
                      <!--card-->
                      <!--card1-->

                      <div
                        class="col-lg-6 col-md-12 col-xl-4 mt-5"
                        v-for="(live_course, index) in liveCourse"
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
                                        bookId: live_course.live_course_id,
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
                              <p>{{ live_course.live_course_outcomes }}</p>
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
                                    {{ live_course.grade.split(',')[0] }}-{{
                                      live_course.grade.split(/[, ]+/).pop()
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
                                    {{ live_course.age_group }}
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
                                      {{ live_course.duration }} Hours
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
                                          bookId: live_course.live_course_id,
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
                          <div class="card-footer">
                            <div class="item-card2-footer">
                              <div class="item-card2-footer-u">
                                <div class="product-item-wrap d-flex">
                                  <div class="product-item-price">
                                    {{
                                      live_course.cprice == 'IN' ? 'Rs.' : '$'
                                    }}
                                    <del
                                      class="product-item-price"
                                      v-if="live_course.actual_price"
                                    >
                                      {{ live_course.actual_price }}
                                    </del>
                                    <span
                                      class="newprice text-dark ml-1"
                                      style="font-size: 14px;"
                                    >
                                      {{ live_course.course_price }}
                                    </span>
                                  </div>

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
                                    :class="
                                      'btn btn-info btn-sm ml-auto ' +
                                      [
                                        live_course.purchases_status == 1
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
                                      live_course.purchases_status == 1
                                        ? 'Purchased'
                                        : 'Enroll Now'
                                    }}
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!--end card1-->

                      <!--end card-->
                    </div>
                  </div>
                  <!--end tab-2-->
                  <!--tab3-->
                  <div class="tab-pane" id="tab-3">
                    <div class="row">
                      <div
                        class="text-center col-xl-12 m-6 text-gray"
                        v-if="byteSizeCourse && !byteSizeCourse.length"
                      >
                        Courses Coming Soon!
                      </div>
                      <!--card-->
                      <!--card1-->
                      <template v-else>
                        <div
                          class="col-lg-6 col-md-12 col-xl-4 mt-5"
                          v-for="(byte_course, index) in byteSizeCourse"
                          v-bind:key="index"
                        >
                          <div class="card mb-0">
                            <div class="item-card2-img">
                              <a
                                @click.prevent="
                                  $router.push({
                                    name: 'ByteCourseDetail',
                                    params: {
                                      ByteCourseName:
                                        byte_course.byte_course_slug,
                                      bookId: byte_course.byte_course_id,
                                    },
                                  })
                                "
                              ></a>
                              <!--<a @click.prevent="learnMore()"></a>-->

                              <img
                                :src="
                                  byte_course.img
                                    ? '/assets/images/png/courses/' +
                                      byte_course.img
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
                                      (byte_course.avg_rating
                                        ? byte_course.avg_rating * 20
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
                                        name: 'ByteCourseDetail',
                                        params: {
                                          ByteCourseName:
                                            byte_course.byte_course_slug,
                                          bookId: byte_course.byte_course_id,
                                        },
                                      })
                                    "
                                    class="text-dark"
                                  >
                                    <!--   <a   @click.prevent="learnMore()"
                                  class="text-dark">-->
                                    <h4
                                      class="mb-2"
                                      v-html="byte_course.byte_course_name"
                                    ></h4>
                                  </a>
                                </div>
                                <p>{{ byte_course.byte_course_outcomes }}</p>
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
                                      {{ byte_course.grade.split(',')[0] }}-{{
                                        byte_course.grade.split(/[, ]+/).pop()
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
                                      {{ byte_course.age_group }}
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
                                        {{ byte_course.duration }} Hours
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
                                              byte_course.byte_course_slug,
                                            bookId: byte_course.byte_course_id,
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
                            <div class="card-footer">
                              <div class="item-card2-footer">
                                <div class="item-card2-footer-u">
                                  <div class="product-item-wrap d-flex">
                                    <!--<div class="product-item-price">
                                      Rs.
                                      <span
                                        class="newprice text-dark ml-1"
                                        style="font-size:14px;"
                                        >{{ byte_course.course_price }}</span
                                      >
                                    </div>-->

                                    <a
                                      @click="
                                        $router.push({
                                          name: 'ByteCourseDetail',
                                          params: {
                                            ByteCourseName:
                                              byte_course.byte_course_slug,
                                            bookId: byte_course.byte_course_id,
                                          },
                                        })
                                      "
                                      :class="
                                        'btn btn-info btn-sm ml-auto ' +
                                        [
                                          byte_course.purchases_status == 1
                                            ? 'btn-primary text-white'
                                            : 'btn-outline-primary',
                                        ]
                                      "
                                    >
                                      {{
                                        byte_course.purchases_status == 1
                                          ? 'Purchased'
                                          : 'Start Learning'
                                      }}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                      <!--end card1-->

                      <!--end card-->
                    </div>
                  </div>
                  <!--end tab3-->
                </div>
              </div>
            </div>
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
  <!-- courses section end-->
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      userId: 0,
      lms_books: '',
      isSignedIn: '',
      callmms: false,
      bookContentLoadedWithoutUserId: false,
      bookContentLoadedWithUserId: false,
      unlockedCourses: [],
      liveCourse: [],
      byteSizeCourse: [],
    }
  },

  mounted() {
    window.scrollTo(0, 0)
    cvAuth.getUserId(
      function (userId) {
        this.userId = userId
        // console.log(this.userId);
        this.lmscont(this.userId)
      }.bind(this),
    )

    //user

    var ratingOptions = {
      selectors: {
        starsSelector: '.rating-stars',
        starSelector: '.rating-star',
        starActiveClass: 'is--active',
        starHoverClass: 'is--hover',
        starNoHoverClass: 'is--no-hover',
        targetFormElementSelector: '.rating-value',
      },
    }
    window.jQuery('.rating-stars').ratingStars(ratingOptions)
  },
  updated() {
    $('.lesson-review-item-rating').rating({
      displayOnly: true,
      theme: 'krajee-fas',
      showCaption: false,
    })
  },
  methods: {
    learnMore() {
      cvNotify('Comming Soon!', 'warning')
    },
    isCourseForMyGrade(slug) {
      switch (this.$store.getters.getAuthData.auth_cls_id) {
        case 10:
        case 9:
        case 8: {
          if (~['python', 'database'].indexOf(slug)) return true
          return false
        }
        case 7: {
          if (~['javascript', 'database'].indexOf(slug)) return true
          return false
        }
        case 6: {
          if (~['javascript'].indexOf(slug)) return true
          return false
        }
        case 5:
        case 4: {
          if (~['html&css'].indexOf(slug)) return true
          return false
        }
        case 3:
        case 2:
        case 1: {
          if (~['scratch'].indexOf(slug)) return true
          return false
        }
      }
    },
    lmscont(userId) {
      /*if(userId) {
         if(this.bookContentLoadedWithUserId) {
           return;
         } else {
           this.bookContentLoadedWithUserId = true;
         }
       }

       if(!userId) {
         if(this.bookContentLoadedWithoutUserId) {
           return;
         } else {
           this.bookContentLoadedWithoutUserId = true;
         }
       }*/

      let vm = this
      axios
        .post('/api/liveCourse/DisplayLiveCourses', { user_id: userId })
        .then((res) => {
          vm.liveCourse = res.data
          if (vm.$router.currentRoute.path == '/live-courses') {
            $('#liveClass').click()
          }
        })
      axios
        .post('/api/liveCourse/DisplayByteCourse', { user_id: userId })
        .then((res) => {
          vm.byteSizeCourse = res.data
        })
      axios
        .post('/api/user/DisplayLmsActivity', { user_id: userId })
        .then((res) => {
          //  console.log(res);
          if (res.data.status == 200) {
            this.lms_books = res.data.data
            //  console.log(this.lms_books);
          }

          for (var i = 0; i < this.lms_books.length; i++) {
            // console.log('hehehe')
            this.unlockedCourses[this.lms_books[i].book_id] = false
            if (userId == 0) {
              this.unlockedCourses[this.lms_books[i].book_id] = false
            } else {
              // if (this.$store.getters.getAuthData.auth_sch_id == 1) {
              // Independent user
              if (this.lms_books[i].purchases_status) {
                this.unlockedCourses[this.lms_books[i].book_id] = true
              }
              /* } else if (this.$store.getters.getAuthData.auth_sch_id != 1) {
                // School student
                var hyh = this.isCourseForMyGrade(this.lms_books[i].slug);

                if (hyh) {
                  this.unlockedCourses[this.lms_books[i].book_id] = true;
                } else {
                  if (this.lms_books[i].purchases_status) {
                    this.unlockedCourses[this.lms_books[i].book_id] = true;
                  }
                }
              }*/
            }
          }
        })
    },
  },
}
</script>

<style lang="scss">
#courses-grid-section {
  .rating-stars {
    position: absolute;
    left: 16px;
    bottom: 16px;
  }
}
</style>
