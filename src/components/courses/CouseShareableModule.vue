<template>
  <div class="row w-100">
    <div
      class="col-lg-6 col-md-12 col-xl-4 mt-5"
      v-for="(live_course, index) in liveCourse"
      v-bind:key="index"
    >
      <div class="card h-100 mb-0">
        <div class="item-card2-img">
          <a @click="clickLearnMore(live_course)"></a>
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
                  {{ live_course.grade.split(",")[0] }}+
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
                  {{ live_course.age_group.split("-")[0] }}+
                </a>
              </li>
              <li class="col-sm-6 mt-4">
                <a class="icons" style="color: #000; border-radius: 2px;">
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
                    cursor:pointer
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
            {{ live_course.cprice == "IN" ? "INR" : "USD" }}
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
                  href=""
                  @click.prevent="$router.push({ name: 'LiveClassTrail' })"
                  class="btn btn-primary btn-outline-primary btn-pill"
                  style="font-size: 0.7125rem; cursor: pointer;"
                >
                  BOOK FREE DEMO
                </a>
                <a
                  v-if="live_course.cprice == 'IN'"
                  class="'btn ml-auto btn-primary btn-pill text-white"
                  style="font-size: 0.8225rem;
                        padding-top: 0.70em;
                        cursor: pointer;"
                  @click.prevent="
                    directPaymentModule(
                      live_course.product_id,
                      live_course.product_name,
                      live_course.slug,
                      live_course.prod_info,
                      live_course.purchases_status
                    )
                  "
                >
                  {{
                    live_course.purchases_status == 1 || trainer == 1
                      ? "Purchased"
                      : "BUY NOW"
                  }}
                </a>
                <a
                  v-else
                  class="'btn ml-auto btn-primary btn-pill text-white"
                  style="font-size: 0.8225rem;
                        padding-top: 0.70em;
                        cursor: pointer;"
                  @click.prevent="NotificationMe()"
                >
                  {{
                    live_course.purchases_status == 1 || trainer == 1
                      ? "Purchased"
                      : "BUY NOW"
                  }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
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
      src="/assets/bootstrap-star-rating/themes/krajee-fas/theme.min.js"
      type="text/javascript"
    />
  </div>
</template>
<script>
import axios from "axios";
import CoursesModule from "@/components/courses/CouseShareableModule.vue";
import userProfileUpdationBeforePayment from "@/components/PaymentModule/userProfileUpdationBeforePayment.vue";
import PaymentModule from "@/components/PaymentModule/PaymentModuleApi.vue";
import Loader from "@/components/widgets/BlockingLoader.vue";
export default {
  components: {
    CoursesModule,
    userProfileUpdationBeforePayment,
    PaymentModule,
    Loader,
  },
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
      byteSizeCourse: [],
      trainer: 0,
      product_id: "",
      product_name: "",
      prduct_slug: "",
      product_info: "",
      processing: false,
      name: "",
    };
  },

  mounted() {
    window.scrollTo(0, 0);
    cvAuth.getUserId(
      function(userId) {
        this.userId = userId;
        this.trainer = this.$store.getters.getAuthData.trainer;
        this.email = this.$store.getters.getAuthData.auth_user_email;
        this.phone = this.$store.getters.getAuthData.auth_user_contact;
        // console.log(this.userId);
        this.lmscont(this.userId);
      }.bind(this)
    );

    //user

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
  updated() {
    $(".lesson-review-item-rating").rating({
      displayOnly: true,
      theme: "krajee-fas",
      showCaption: false,
    });
  },
  methods: {
    clickLearnMore(live_course) {
      this.$router.push({
        name: "LiveCourseDetail",
        params: {
          liveCourseName: live_course.live_course_slug,
          bookId: live_course.live_course_id,
        },
      });
    },
    NotificationMe() {
      $router.push("/contact");
    },
    learnMore() {
      cvNotify("Comming Soon!", "warning");
    },
    updationComplete(...data) {
      this.email = data[0].email;
      this.phone = data[0].email;
      hideModal("PaymentUserProfile");
      this.callPaymentApi();
    },
    directPaymentModule(
      prod_id,
      prod_name,
      prod_slug,
      prod_info,
      purchases_status
    ) {
      if (!this.userId) {
        var url = window.location.href;
        if (url.indexOf("?") > -1) {
          url += "&product_id=" + prod_id;
        } else {
          url += "?product_id=" + prod_id;
        }
        this.$router.push("/login?redirect=" + encodeURIComponent(url));
        return;
      }
      if (purchases_status || this.trainer == 1) {
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
        .post("/api/liveCourse/DisplayLiveCourses", { user_id: userId })
        .then((res) => {
          vm.liveCourse = res.data;
          if (vm.$router.currentRoute.path == "/live-courses") {
            $("#liveClass").click();
          }
          this.callDirectPaymentApi();
        });
    },
    callDirectPaymentApi() {
      let vm = this;
      let uri = window.location.search.substring(1);
      let params = new URLSearchParams(uri);
      if (params.get("product_id")) {
        let product_id = params.get("product_id");
        let product_details = vm.liveCourse.filter(
          (x) => x.product_id == product_id
        );
        let purchases_status = vm.liveCourse
          .filter((x) => x.product_id == product_id)
          .findIndex((x) => x.purchases_status == 1);
        if (purchases_status == -1) {
          product_details = vm.liveCourse.filter(
            (x) => x.product_id == product_id
          );
          if (product_details[0].purchases_status == 1 || vm.trainer == 1) {
            this.$router.push({
              name: "LiveCourseDetail",
              params: {
                liveCourseName: product_details[0].live_course_slug,
                bookId: product_details[0].live_course_id,
              },
            });
          } else {
            this.processing = true;
            vm.directPaymentModule(
              product_details[0].product_id,
              product_details[0].product_name,
              product_details[0].slug,
              product_details[0].prod_info,
              product_details[0].purchases_status
            );
          }
        }
      } else {
      }
    },
  },
};
</script>
