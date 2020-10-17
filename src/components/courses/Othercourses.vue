<template>
  <section id="featured-courses-section" class="sptb pb-0">
    <div class="container">
      <div id="myCarousel2" class="owl-carousel owl-carousel-icons2 row" >
        <!--card item-->

        <div
          class="item h-100"
          v-for="(live_course, index) in liveCourse"
          v-bind:key="index"
        >
          <div class="card mb-0" style="height:380px;">
            <div class="item-card2-img">
              <a
                 href=""
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
            <div class="card-body" style="height:auto;">
              <div class="item-card2">
                <div item-card2-desc>
                  <a href=""
                    @click="
                      $router.push({
                        name: 'LiveCourseDetail',
                        params: {
                          liveCourseName: live_course.live_course_slug,
                          bookId: live_course.live_course_id
                        },
                      })
                    "
                    class="text-dark"
                  >
                    <!--   <a   @click.prevent="learnMore()"
                                  class="text-dark">-->
                    <h5 class="mb-2" v-html="live_course.live_course_name"></h5>
                  </a>
                </div>
                <p style="font: normal 0.8rem/1.2 'Poppins', sans-serif;">
                  {{ live_course.live_course_outcomes }}
                </p>
                <ul class="mt-3 row">
                  <li class="col-sm-6">
                    <a
                      class="icons"
                      style="
                        background: #ec296b;
                        padding: 4px 8px;
                        color: #fff;
                        border-radius: 2px;
                        font-size: 10px;
                      "
                    >
                      <b>Grade:</b>
                      {{live_course.grade.split(",")[0] }}+
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
                        font-size: 10px;
                      "
                    >
                      <b>Age Group:</b>
                      {{live_course.age_group.split('-')[0]}}+
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
                style="background-color: rgb(255, 223, 203); padding: 8px 16px; font-size: 12px;"
              >
                {{ live_course.cprice == "IN" ? "INR" : "USD" }}
                <del class="product-item-price" v-if="live_course.actual_price">
                  {{ live_course.actual_price }}
                </del>
                <span class="newprice text-dark ml-1" style="font-size: 16px;">
                  {{ live_course.course_price }}
                </span>
              </span>
            </div>
            <div class="card-footer">
              <div class="item-card2-footer">
                <div class="item-card2-footer-u">
                  <div class="product-item-wrap d-flex">
                    <a class="icons" style="color: #000; border-radius: 2px;">
                      <i class="fas fa-clock"></i>
                      <span
                        class="newprice text-dark ml-1"
                        style="font-size: 10px;"
                      >
                        {{ live_course.duration }} Hours
                      </span>
                    </a>

                    <a
                      href=""
                      class="'btn ml-auto btn-pill btn-primary"
                      style="font-size: 0.7225rem; padding-top: 0.2em;cursor:pointer"
                      @click="
                        $router.push({
                          name: 'LiveCourseDetail',
                          params: {
                            liveCourseName: live_course.live_course_slug,
                            bookId: live_course.live_course_id
                          },
                        })
                      "
                    >
                      LEARN MORE
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--end card item-->
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
        src="/assets/bootstrap-star-rating/themes/krajee-fa/theme.min.js"
        type="text/javascript"
      />
    </div>
  </section>
</template>

<script>
import axios from "axios";
import CoursesModule from "@/components/courses/CouseShareableModule.vue";
export default {
  components: {
    CoursesModule,
  },
  props: ["liveCourseName"],
  data() {
    return {
      userId: 0,
      lms_books: "",
      isSignedIn: "",
      email: "",
      phone: "",
      callmms: false,
      bookContentLoadedWithoutUserId: false,
      bookContentLoadedWithUserId: false,
      unlockedCourses: [],
      liveCourse: [],
      test_array: "",
      trainer: 0,
      product_id: "",
      product_name: "",
      prduct_slug: "",
      product_info: "",
      name: "",
    };
  },

  mounted() {
    window.scrollTo(0, 0);
    cvAuth.getUserId(
      function(userId) {
        this.userId = userId;
        this.name = this.$store.getters.getAuthData.auth_user_full_name;
        this.email = this.$store.getters.getAuthData.auth_user_email;
        this.phone = this.$store.getters.getAuthData.auth_user_contact;
        this.trainer = this.$store.getters.getAuthData.trainer;
        this.lmscont(this.userId);
      }.bind(this)
    );
    var ratingOptions = {
      selectors: {
        starsSelector: ".rating-stars",
        starSelector: ".rating-star",
        starActiveClass: "is--active",
        starHoverClass: "is--hover",
        starNoHoverClass: "is--no-hover",
        targetFormElementSelector: ".rating-value",
      },
    };
    window.jQuery(".rating-stars").ratingStars(ratingOptions);
  },

  methods: {
    updationComplete(...data) {
      this.email = data[0].email;
      this.phone = data[0].email;
      hideModal("PaymentUserProfile");
      this.callPaymentApi();
    },
    directPaymentModule(prod_id, prod_name, prod_slug, prod_info) {
     
      if (!this.userId) {
        this.$router.push(
          "/login?redirect=" + encodeURIComponent(window.location.href)
        );
        return;
      }
      this.product_id = prod_id;
      this.product_name = prod_name;
      this.prduct_slug = prod_slug;
      this.product_info = prod_info;
      if (!this.email || !this.phone) showModal("PaymentUserProfile");
      else this.callPaymentApi();
    },
    callPaymentApi() {
      this.$refs.PaymentApi.buycourse(
        this.name,
        this.email,
        this.phone,
        this.product_id,
        this.product_name,
        this.prduct_slug,
        this.product_info
      );
    },
    lmscont(userId) {
      let vm = this;
      axios
        .post("/api/liveCourse/OtherCourses", {
          user_id: userId,
          courseSlug: this.liveCourseName,
        })
        .then((res) => {
          vm.liveCourse = res.data;
          if (vm.$router.currentRoute.path == "/live-courses") {
            $("#liveClass").click();
          }
        });
    },
  },
  updated() {
    $(".lesson-review-item-rating").rating({
      displayOnly: true,
      theme: "krajee-fas",
      showCaption: false,
    });
    var owl = window.jQuery(".owl-carousel-icons2");
    owl.owlCarousel({
      loop: true,
      rewind: false,
      margin: 25,
      animateIn: "fadeInDown",
      animateOut: "fadeOutDown",
      autoplay: true,
      autoplayTimeout: 1000,
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
          items: 4,
          nav: true,
        },
      },
    });
  },
};
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
