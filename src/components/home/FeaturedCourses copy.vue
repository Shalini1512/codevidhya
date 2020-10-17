<template>
  <section id="featured-courses-section" class="sptb pb-0">
    
    <div class="container">
      <div class="section-title center-block text-center">
        <h2 class="mb-4">Featured Courses</h2>
        <p>
          Explore Coding courses and choose the best that suits you the most.
        </p>
      </div>
      <div id="myCarousel2" class="owl-carousel owl-carousel-icons2 h-100">
        <!--card item-->

        <div
          class="item"
          v-for="(live_course, index) in liveCourse"
          v-bind:key="index"
        >
          <div class="card mb-0 h-100">
            <div class="item-card2-img">
              <a
                @click="
                  $router.push({
                    name: 'LiveCourseDetail',
                    params: {
                      liveCourseName: live_course.live_course_slug,
                      bookId: live_course.live_course_id,
                    },
                  })
                "
              ></a>
              <!--<a @click.prevent="learnMore()"></a>-->

              <img
                :src="
                  live_course.img
                    ? '/assets/images/png/courses/' + live_course.img
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
                          liveCourseName: live_course.live_course_slug,
                          bookId: live_course.live_course_id,
                        },
                      })
                    "
                    class="text-dark"
                  >
                    <!--   <a   @click.prevent="learnMore()"
                                  class="text-dark">-->
                    <h4 class="mb-2" v-html="live_course.live_course_name"></h4>
                  </a>
                </div>
                <p>{{ live_course.live_course_outcomes }}</p>
                <ul class="mt-3 row">
                  <li class="col-sm-6">
                    <a
                     
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
                      
                      @click.prevent="
                        $router.push({
                          name: 'LiveCourseDetail',
                          params: {
                            liveCourseName: live_course.live_course_slug,
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
            <div
              class="product-item-price text-center"
              style="font-family: Poppins; margin-bottom: 5px;"
            >
              <span
                style="background-color: rgb(255, 223, 203); padding: 8px 16px;"
              >
                {{ live_course.cprice == 'IN' ? 'Rs.' : '$' }}
                <del class="product-item-price" v-if="live_course.actual_price">
                  {{ live_course.actual_price }}
                </del>
                <span class="newprice text-dark ml-1" style="font-size: 18px;">
                  {{ live_course.course_price }}
                </span>
              </span>
            </div>
            <div class="card-footer">
              <div class="item-card2-footer">
                <div class="item-card2-footer-u">
                  <div class="product-item-wrap d-flex">
                    <a
                      href="#"
                      @click.prevent="$router.push({ name: 'LiveClassTrail' })"
                      class="btn btn-outline-danger btn-pill"
                      style="font-size: 0.6125rem;"
                    >
                      Book Free Demo
                    </a>
                    <a
                      href="#"
                      class="'btn ml-auto btn-primary btn-pill text-white"
                      style="font-size: 0.6225rem; padding-top: 1em;"
                      @click.prevent="
                        directPaymentModule(
                          live_course.product_id,
                          live_course.product_name,
                          live_course.slug,
                          live_course.prod_info,
                          live_course.purchases_status,
                        )
                      "
                    >
                      {{
                        live_course.purchases_status == 1 || trainer == 1
                          ? 'Purchased'
                          : 'Buy Now'
                      }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--end card item-->
      </div>
      <div class="col-sm-12 text-center mt-4">
        <TrialButton />
      </div>
      <userProfileUpdationBeforePayment @updationComplete="updationComplete" />
      <PaymentModule ref="PaymentApi" />
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
        src="/assets/bootstrap-star-rating/themes/krajee-fa/theme.min.js"
        type="text/javascript"
      />
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import TrialButton from '@/components/BookTrialButton/BookTrialShareButton.vue'
import CoursesModule from '@/components/courses/CouseShareableModule.vue'
import userProfileUpdationBeforePayment from '@/components/PaymentModule/userProfileUpdationBeforePayment.vue'
import PaymentModule from '@/components/PaymentModule/PaymentModuleApi.vue'

export default {
  components: {
    TrialButton,
    CoursesModule,
    userProfileUpdationBeforePayment,
    PaymentModule,
  },
  data() {
    return {
      userId: 0,
      lms_books: '',
      isSignedIn: '',
      email: '',
      phone: '',
      callmms: false,
      bookContentLoadedWithoutUserId: false,
      bookContentLoadedWithUserId: false,
      unlockedCourses: [],
      liveCourse: [],
      test_array: '',
      trainer: 0,
      product_id: '',
      product_name: '',
      prduct_slug: '',
      product_info: '',
      name: '',
    }
  },

  mounted() {
    window.scrollTo(0, 0)
    cvAuth.getUserId(
      function (userId) {
        this.userId = userId
        this.name = this.$store.getters.getAuthData.auth_user_full_name
        this.email = this.$store.getters.getAuthData.auth_user_email
        this.phone = this.$store.getters.getAuthData.auth_user_contact
        this.trainer = this.$store.getters.getAuthData.trainer
        this.lmscont(this.userId)
      }.bind(this),
    )
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

  methods: {
    updationComplete(...data) {
      this.email = data[0].email
      this.phone = data[0].email
      hideModal('PaymentUserProfile')
      this.callPaymentApi()
    },
    directPaymentModule(
      prod_id,
      prod_name,
      prod_slug,
      prod_info,
      purchases_status,
    ) {
      if (!this.userId) {
        this.$router.push(
          '/login?redirect=' + encodeURIComponent(window.location.href),
        )
        return
      }
      if (purchases_status || this.trainer == 1) {
        return
      }
      this.product_id = prod_id
      this.product_name = prod_name
      this.prduct_slug = prod_slug
      this.product_info = prod_info
      if (!this.email || !this.phone) showModal('PaymentUserProfile')
      else this.callPaymentApi()
    },
    callPaymentApi() {
      this.$refs.PaymentApi.buycourse(
        this.name,
        this.email,
        this.phone,
        this.product_id,
        this.product_name,
        this.prduct_slug,
        this.product_info,
      )
    },
    lmscont(userId) {
      let vm = this
      axios
        .post('/api/liveCourse/DisplayLiveCourses', { user_id: userId })
        .then((res) => {
          vm.liveCourse = res.data
          if (vm.$router.currentRoute.path == '/live-courses') {
            $('#liveClass').click()
          }
        })
    },
  },
  updated() {
    $('.lesson-review-item-rating').rating({
      displayOnly: true,
      theme: 'krajee-fas',
      showCaption: false,
    })
    var owl = window.jQuery('.owl-carousel-icons2')
    owl.owlCarousel({
      loop: true,
      rewind: false,
      margin: 25,
      animateIn: 'fadeInDown',
      animateOut: 'fadeOutDown',
      autoplay: true,
      autoplayTimeout: 50000,
      autoplayHoverPause: true,
      dots: false,
      nav: true,
      responsiveClass: true,
      responsive: {
        0: {
          items: 1,
          nav: true,
        },
        600: {
          items: 2,
          nav: true,
        },
        1300: {
          items: 3,
          nav: true,
        },
      },
    })
  },
}
</script>

<style lang="scss" scoped>
#featured-courses-section {
  .learn-more-btn {
    padding: 4px 8px;
    background: #48c9b0;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .rating-stars {
    position: absolute;
    left: 16px;
    bottom: 12px;
  }
}
</style>
