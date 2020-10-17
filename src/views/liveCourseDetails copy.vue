<template>
  <div>
    <Header />
    <div class="container-fluid" style="margin-top: 58px;background: #008dd2;">
      <!--book demo-->
      <!--<div class="m-0 p-0">
        <div class="row mt-3 ml-3 mb-1">
          <transition name="bounce">
            <button
              v-if="show"
              class="btn btn-link text-white"
              @click.prevent="$router.push({ name: 'LiveClassTrail' })"
            >
              <u>Book Free Demo Now</u>
            </button>
          </transition>
        </div>
      </div>-->
      <!--<hr class="row m-0 p-0" />-->
      <section class="sptb">
        <div class="row  m-0 mt-3">
          <div class="col-xl-8 d-block">
            <div class="text-property text-white">
              <div class="mt-1 ml-2">
                <span
                  style="
                  color: ;
                  font: normal 3rem/1.7 'Poppins', sans-serif;
                  font-size: 38px;
                  font-weight: 600;
                "
                >
                  {{
                    courseDetails.length
                      ? courseDetails[0].live_course_name
                      : ""
                  }}
                </span>
              </div>
              <div class="ml-2">
                <span
                  style="
                  font: normal 1rem/1.2 'Poppins', sans-serif;
                  font-size: 20px;
                  font-weight: 600;
                "
                >
                  {{
                    courseDetails.length ? courseDetails[0].course_theme : ""
                  }}
                </span>
              </div>
              <div
                class="mt-1 ml-2"
                style="display: flex; flex-direction: row;"
              >
                <div
                  class="flex-grow-1"
                  style="color: ; font: normal 1rem/1.2 'Poppins', sans-serif;"
                >
                  <span class="mr-2">
                    Grade:
                    <span class="ml-1" style="color: ;">
                      {{
                        courseDetails.length
                          ? courseDetails[0].grade.split(",")[0]
                          : ""
                      }}+
                    </span>
                  </span>
                  <span class="mx-2">
                    Age:
                    <span class="ml-1">
                      {{
                        courseDetails.length
                          ? courseDetails[0].age_group.split("-")[0] + "+"
                          : ""
                      }}
                    </span>
                  </span>
                  <span class="mx-2">
                    Duration
                    <i class="fas fa-clock"></i>
                    :
                    <span class="ml-1">
                      {{
                        courseDetails.length ? courseDetails[0].duration : ""
                      }}
                      Hours
                    </span>
                  </span>
                </div>
              </div>
              <div class="mt-2 ml-2">
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
                    <span class="filled-stars" :style="'width:' + 90 + '%'">
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
              <div class="ml-5 mt-2">
                <button
                  class="btn btn-primary btn-pill ml-7 text-white"
                  @click.prevent="$router.push({ name: 'LiveClassTrail' })"
                >
                  Book Free Demo Now
                </button>
              </div>
            </div>
          </div>
          <div class="col-xl-4 ">
            <div
              class="card overflow-hidden m-0"
              style="background:#fff ;position:absolute;top:20%;right:0;z-index:999;"
            >
              <div class="card-body text-center px-1 py-0 pt-1  ">
                <div class="product-slider">
                  <ul class="list-unstyled video-list-thumbs">
                    <li class="mb-0">
                      <img
                        :src="
                          courseDetails.length
                            ? courseDetails[0].img
                              ? ' /assets/images/png/courses/' +
                                courseDetails[0].img
                              : ' /assets/images/png/courses/web.svg'
                            : ' /assets/images/png/courses/web.svg'
                        "
                        alt="img"
                        class="img-responsive br-3"
                        
                      />
                    </li>
                  </ul>
                </div>
              </div>
              <div class="card-footer">
                <div
              :class="
                'card ' + courseDetails && courseDetails.length
                  ? courseDetails[0].purchases_status || trainer || true
                    ? ' m-0'
                    : ' border m-0'
                  : ' border m-0'
              "
            >
              <div
                class="card-body"
                :style="
                  courseDetails && courseDetails.length
                    ? courseDetails[0].purchases_status || trainer || true
                      ? 'border:none'
                      : ''
                    : ''
                "
              >
                <div class="mb-2" style="font: 'Poppins';">
                  <div>
                    <div
                      v-if="
                        courseDetails && courseDetails.length
                          ? courseDetails[0].purchases_status || trainer
                            ? false
                            : true
                          : true
                      "
                      class="text-center"
                    >
                      <span class="text-dark font-weight-semibold h1">
                        {{
                          courseDetails && courseDetails.length
                            ? courseDetails[0].cprice == "IN"
                              ? "INR"
                              : "USD"
                            : "USD"
                        }}
                        <del
                          class="h2 mr-1"
                          style="color: #999;"
                          v-if="
                            courseDetails.length
                              ? courseDetails[0].actual_price
                                ? true
                                : false
                              : false
                          "
                        >
                          {{
                            courseDetails.length
                              ? courseDetails[0].actual_price
                              : ""
                          }}
                        </del>
                        {{
                          courseDetails.length
                            ? courseDetails[0].course_price
                            : ""
                        }}
                      </span>
                    </div>

                    <div
                      v-if="
                        courseDetails && courseDetails.length
                          ? courseDetails[0].purchases_status || trainer
                            ? false
                            : true
                          : true
                      "
                      class="table-responsive mt-2"
                    >
                      <table class="table table-bordered">
                        <tbody>
                          <tr>
                            <td>Subtotal</td>
                            <td class="text-right">
                              {{
                                courseDetails && courseDetails.length
                                  ? courseDetails[0].cprice == "IN"
                                    ? "INR"
                                    : "USD"
                                  : "USD"
                              }}
                              {{
                                courseDetails.length
                                  ? courseDetails[0].course_price
                                  : ""
                              }}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span>Discount</span>
                            </td>
                            <td class="text-right text-muted">
                              <span>
                                -
                                {{
                                  courseDetails && courseDetails.length
                                    ? courseDetails[0].cprice == "IN"
                                      ? "INR"
                                      : "USD"
                                    : "USD"
                                }}
                                {{
                                  courseDetails && courseDetails.length
                                    ? parseFloat(discount).toFixed(2)
                                    : 0
                                }}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span>Total</span>
                            </td>
                            <td>
                              <h2
                                id="grand-total"
                                class="price text-right mb-0"
                              >
                                {{
                                  courseDetails && courseDetails.length
                                    ? courseDetails[0].cprice == "IN"
                                      ? "INR"
                                      : "USD"
                                    : "USD"
                                }}
                                {{
                                  grant_total
                                    ? parseFloat(grant_total).toFixed(2)
                                    : courseDetails && courseDetails.length
                                    ? parseFloat(
                                        courseDetails[0].course_price
                                      ).toFixed(2)
                                    : "0"
                                }}
                              </h2>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div
                      v-if="
                        courseDetails && courseDetails.length
                          ? courseDetails[0].purchases_status || trainer
                            ? false
                            : true
                          : true
                      "
                      class="text-center applied-coupon flex-grow-1 mt-2"
                    >
                      <button
                        v-if="!coupon_desc"
                        class="btn btn-link"
                        @click.prevent="ApplyCouponCode()"
                      >
                        Apply Coupon
                      </button>
                      <button
                        v-else
                        class="btn btn-outline-primary align-self-center py-1"
                        @click="remove_coupon()"
                      >
                        Remove
                      </button>
                      <div class="applied-coupon flex-grow-1">
                        <template v-if="coupon_desc">
                          <div>{{ coupon_code }}</div>
                          <div>{{ coupon_desc }}</div>
                        </template>
                        <div v-else class="font-weight-bold">
                          No coupon applied
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="
                        courseDetails && courseDetails.length
                          ? courseDetails[0].purchases_status || trainer
                            ? true
                            : false
                          : false
                      "
                    >
                      <button class="btn btn-info btn-lg btn-block">
                        Purchased
                      </button>
                    </div>
                    <div v-else>
                      <button
                        v-if="
                          courseDetails && courseDetails.length
                            ? courseDetails[0].cprice == 'IN'
                              ? true
                              : false
                            : false
                        "
                        class="btn btn-primary btn-lg btn-block text-white"
                        @click.prevent="
                          directPaymentModule(
                            courseDetails.length
                              ? courseDetails[0].product_id
                              : '0',
                            courseDetails.length
                              ? courseDetails[0].live_course_name
                              : '',
                            courseDetails.length
                              ? courseDetails[0].live_course_slug
                              : '',
                            courseDetails.length ? courseDetails[0].cprice : ''
                          )
                        "
                      >
                        Pay Now
                      </button>
                      <!--<button
                        v-else
                        class="btn btn-primary btn-lg btn-block text-white"
                        @click.prevent="
                          directPaymentModule(
                            courseDetails.length
                              ? courseDetails[0].product_id
                              : '0',
                            courseDetails.length
                              ? courseDetails[0].live_course_name
                              : '',
                            courseDetails.length
                              ? courseDetails[0].live_course_slug
                              : '',
                            courseDetails.length ? courseDetails[0].cprice : ''
                          )
                        "
                      >
                        Pay Now
                      </button>-->
                      <button
                        v-else
                        class="btn btn-primary btn-lg btn-block text-white"
                        @click.prevent="NotificationMe"
                      >
                        Pay Now
                      </button>
                    </div>
                    <div class="mt-3 ml-3">
                      <h3
                        class="card-title mb-3 font-weight-bold"
                        style="font: normal 1.3rem/1 'Poppins';"
                      >
                        This Course Includes
                      </h3>
                      <ul class="list-group">
                        <li
                          class="listunorder p-1"
                          style=" border: none;font: normal 1rem 'Poppins';"
                          v-for="(require, index) in course_requirement"
                          :key="index"
                          v-html="require"
                        ></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!--end book demo-->
    </div>
    <!--courses-->
    <section class="sptb ml-2 p-0">
      <div class="row m-0 p-0 mt-2">
        <div class="row d-flex w-100 border-bottom">
          <div
            class="col-xl-8 col-lg-8 border-right col-md-12 flex-grow-1 bg-white"
          >
            <div
              class="border-0 bg-white"
              v-if="
                courseDetails && courseDetails.length
                  ? liveCourseTopics.length &&
                    (courseDetails[0].purchases_status || trainer || true)
                    ? true
                    : false
                  : false
              "
            >
              <div class="wideget-user-tab wideget-user-tab3">
                <div class="tab-menu-heading">
                  <div class="tabs-menu1">
                    <ul class="nav">
                      <li class>
                        <a href="#tab-1" class="active" data-toggle="tab">
                          Overview
                        </a>
                      </li>
                      <li>
                        <a href="#tab-2" data-toggle="tab" class>Curriculum</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <!--courses details-->
            <div
              class="tab-content border-left p-5 bg-white details-tab-content"
              style="border: none;"
            >
              <div class="tab-pane active" id="tab-1">
                <div>
                  <h3
                    class="card-title mb-3 font-weight-bold"
                    style="font: normal 1.3rem/1 'Poppins';"
                  >
                    Description
                  </h3>
                  <p style="font: normal 1rem 'Poppins';">
                    {{
                      courseDetails && courseDetails.length
                        ? courseDetails[0].description
                        : ""
                    }}
                  </p>
                  <h3
                    class="card-title mb-3 mt-3 font-weight-bold"
                    style="font: normal 1.3rem/1 'Poppins';"
                  >
                    Requirement
                  </h3>
                  <ul class="list-group">
                    <li
                      class="list p-2"
                      v-for="(topic, index) in requirement"
                      :key="index"
                      style="font: normal 1rem 'Poppins';"
                    >
                      {{ index + 1 + ". " + topic }}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="tab-pane" id="tab-2">
                <div class="panel-group1" id="accordion2">
                  <div
                    class="panel panel-default mb-4 border p-0"
                    v-for="(topic_name, index) in liveCourseTopics"
                    :key="index"
                  >
                    <div class="panel-heading1">
                      <h4 class="panel-title1">
                        <a
                          class="accordion-toggle collapsed p-3"
                          data-toggle="collapse"
                          data-parent="accordion2"
                          :href="'#collapse' + (index + 1)"
                          aria-expanded="false"
                          :style="'color:#4b5d73'"
                        >
                          <span class style="display: flex;">
                            <span
                              class="col-7 col-md-9"
                              style="color: #2e384d;"
                              v-html="
                                'Session&nbsp;' +
                                  topic_name.session +
                                  '&nbsp;' +
                                  topic_name.topic_name
                              "
                            ></span>

                            <span
                              style="color: #2e384d;"
                              v-html="
                                'Duration&nbsp;<i class=\'fas fa-clock\'></i>: ' +
                                  topic_name.time_in_minutes +
                                  ' minutes'
                              "
                            ></span>
                          </span>
                        </a>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--end courses details-->
          </div>
          <div
            class="col-xl-4 col-lg-4 border-left col-md-12 flex-grow-1 bg-white"
            style=""
          >
            <div style="margin-top:100px;"></div>
            
          </div>
        </div>
      </div>
      <PaymentModule ref="PaymentsApi" />
      <PaypalModule ref="PaypalPaymentsApi" />
      <div class="m-0">
        <div class="card p-0 m-0">
          <div class="card-header text-dark font-weight-semibold h4">
            Other Courses
          </div>
          <!-- other courses-->
          <otherCourses class="col-sm-8" :liveCourseName="liveCourseName" />
          <!--end other courses-->
        </div>
      </div>
    </section>

    <Footer />
    <Loader v-if="processing" />

    <userProfileUpdationBeforePayment @updationComplete="updationComplete" />

    <PaymentCouponModule
      :product_price="courseDetails.length ? courseDetails[0].course_price : 0"
      :product_id="courseDetails.length ? courseDetails[0].product_id : 0"
      @UpdateCouponDetail="UpdateCouponDetail"
    />

    <!--end courses-->
    <component
      :is="'link'"
      href="/assets/bootstrap-star-rating/css/star-rating.min.css"
      media="all"
      rel="stylesheet"
      type="text/css"
    />
    <component
      :is="'link'"
      href="/assets/bootstrap-star-rating/themes/krajee-fa/theme.min.css"
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
</template>
<script>
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/product-details/HeaderContent.vue";
import Footer from "@/components/footer/Footer.vue";
import Loader from "@/components/widgets/BlockingLoader.vue";
import axios from "axios";
import otherCourses from "@/components/courses/Othercourses.vue";
import userProfileUpdationBeforePayment from "@/components/PaymentModule/userProfileUpdationBeforePayment.vue";
import PaymentModule from "@/components/PaymentModule/PaymentModuleApi.vue";
import PaypalModule from "@/components/PaymentModule/PaypalPaymentModuleApi.vue";
import PaymentCouponModule from "@/components/PaymentModule/PaymentCouponModule.vue";
export default {
  props: ["liveCourseName", "bookId"],
  components: {
    Header,
    HeaderContent,
    otherCourses,
    Footer,
    Loader,
    userProfileUpdationBeforePayment,
    PaymentCouponModule,
    PaypalModule,
    PaymentModule,
  },
  data() {
    return {
      slug: "",
      user_id: "",
      cls_id: "",
      book_id: "",
      email: "",
      phone: "",
      topic_names: [],
      courseDetails: [],
      liveCourseTopics: [],
      trainer: 0,
      subTopics: [],
      topicView: 0,
      processing: false,
      product_id: "",
      product_name: "",
      prduct_slug: "",
      product_info: "",
      name: "",
      show: true,
      grant_total: 0,
      discount: 0,
      coupon_code: "",
      coupon_desc: "",
      requirement: "",
      course_requirement: "",
    };
  },
  created() {
    this.slug = this.liveCourseName;
  },
  beforeMount() {},
  mounted() {
    this.$nextTick(function() {
      let vm = this;
      window.setInterval(() => {
        vm.show = !vm.show;
      }, 500);
    });
    if (this.$router.currentRoute.path.indexOf("live-courses") !== -1) {
      this.$router.push(
        "/live-course/" + this.$router.currentRoute.params.liveCourseName
      );
    }

    $(".clear-rating").hide();
    cvAuth.getUserId(
      function(userId) {
        this.userId = userId;
        this.cls_id = this.$store.getters.getAuthData.auth_cls_id;
        this.name = this.$store.getters.getAuthData.auth_user_full_name;
        this.email = this.$store.getters.getAuthData.auth_user_email;
        this.phone = this.$store.getters.getAuthData.auth_user_contact;
        this.trainer = this.$store.getters.getAuthData.trainer;
        this.getCourseDetails(userId);
      }.bind(this)
    );
  },
  methods: {
    /***new upload Functions */
    NotificationMe() {
      $router.push("/contact");
    },
    updationComplete(...data) {
      this.email = data[0].email;
      this.phone = data[0].email;
      hideModal("PaymentUserProfile");
      this.callPaymentApi();
    },
    directPaymentModule(prod_id, prod_name, prod_slug, region) {
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
      this.product_id = prod_id;
      this.product_name = prod_name;
      this.prduct_slug = prod_slug;
      if (!this.email || !this.phone) {
        showModal("PaymentUserProfile");
        this.processing = false;
      } else if (region == "IN") this.callPaymentApi();
      else this.callPaypalAccount();
    },
    callPaypalAccount() {
      this.$refs.PaypalPaymentsApi.buycourse(
        this.name,
        this.email,
        this.phone,
        this.product_id,
        this.product_name,
        this.prduct_slug,
        this.product_info,
        this.coupon_id,
        this.coupon_desc
      );
    },
    callPaymentApi() {
      this.$refs.PaymentsApi.buycourse(
        this.name,
        this.email,
        this.phone,
        this.product_id,
        this.product_name,
        this.prduct_slug,
        this.product_info,
        this.coupon_id,
        this.coupon_desc
      );
    },
    UpdateCouponDetail(...data) {
      this.coupon_id = data[0].coupon_id;
      this.coupon_desc = data[0].coupon_desc;
      this.coupon_code = data[0].coupon_code;
      this.discount = data[0].discount;
      this.grant_total = data[0].grant_total;
      hideModal("PaymentApplyCoupon");
    },
    ApplyCouponCode() {
      if (!this.userId) {
        this.$router.push(
          "/login?redirect=" + encodeURIComponent(window.location.href)
        );
        return;
      }
      showModal("PaymentApplyCoupon");
    },
    remove_coupon: function() {
      this.coupon_code = "";
      this.coupon_desc = "";
      this.coupon_id = 0;
      this.discount = 0;
      this.grant_total = "";
    },

    getCourseDetails(userId) {
      let vm = this;
      vm.processing = true;
      axios
        .post("/api/liveCourse/getCourseDetails", {
          user_id: userId,
          courseSlug: this.liveCourseName,
        })
        .then((result) => {
          vm.courseDetails = result.data;
          vm.book_id =
            vm.courseDetails && vm.courseDetails.length
              ? vm.courseDetails[0].live_course_id
              : 0;
          vm.requirement =
            vm.courseDetails && vm.courseDetails.length
              ? vm.courseDetails[0].requirement.split("<br/>")
              : "";
          vm.course_requirement =
            vm.courseDetails && vm.courseDetails.length
              ? vm.courseDetails[0].course_includes.split("<br/>")
              : "";
          vm.processing = false;
          this.callDirectPaymentApi();
          vm.loadAllLessons(vm.book_id);
        });
    },
    loadAllLessons(book_id) {
      let vm = this;
      vm.processing = true;

      axios
        .post("/api/liveCourse/getCoursesTopics", {
          user_id: this.userId,
          live_course_id: book_id,
        })
        .then((resp) => {
          vm.liveCourseTopics = resp.data;
          vm.processing = false;
        });
    },
    callDirectPaymentApi() {
      let vm = this;
      let uri = window.location.search.substring(1);
      let params = new URLSearchParams(uri);
      if (params.get("product_id")) {
        let product_id = params.get("product_id");
        let purchases_status =
          vm.courseDetails && vm.courseDetails.length
            ? vm.courseDetails[0].purchases_status
            : null;

        if (!purchases_status) {
          if (vm.courseDetails[0].purchases_status == 1 || vm.trainer == 1) {
            /*  this.$router.push({
              name: "LiveCourseDetail",
              params: {
                liveCourseName:
                  vm.courseDetails && vm.courseDetails.length
                    ? vm.courseDetails[0].live_course_slug
                    : "",
                bookId:
                  vm.courseDetails && vm.courseDetails.length
                    ? vm.courseDetails[0].live_course_id
                    : "",
              },
            });*/
          } else {
            this.processing = true;
            vm.directPaymentModule(
              vm.courseDetails.length ? vm.courseDetails[0].product_id : "0",
              vm.courseDetails.length
                ? vm.courseDetails[0].live_course_name
                : "",
              vm.courseDetails.length
                ? vm.courseDetails[0].live_course_slug
                : ""
            );
          }
        }
      }
    },
    payment_gateway: function() {
      this.$router.push(
        "/checkout?product_name=" +
          encodeURIComponent(this.courseDetails[0].live_course_slug) +
          "&id=" +
          encodeURIComponent(this.courseDetails[0].product_id) +
          "&type=" +
          encodeURIComponent(this.courseDetails[0].product_type)
      );
    },
  },
  updated() {
    $(".clear-rating").hide();
    var owl = window.jQuery(".owl-carousel-icons2");
  },
};
</script>
<style lang="scss" scoped>
.filled-stars {
  color: #ffa22b !important;
}
.disabled {
  opacity: 0.5;
}
.lesson-topics-list-done {
  font-size: 1rem;
  background: #efefef;
  border-radius: 8px;
  color: #0bb46e;
  background: none;
  padding: 4px;
}
.sub_topics_image {
  width: 16px;
  height: 16px;
  margin-right: 16px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  opacity: 0.4;
}
.panel-heading1::after {
  content: "" !important;
}
.panel-heading1::before {
  content: "" !important;
}
.tabs-menu1 ul li .active {
  border: 1px solid #ec296b;
  color: #ec296b;
  border-radius: 3px;
}
.tabs-menu1 ul li a {
  border-radius: 3px;
  background: #fff !important;
}
.accordion-toggle::before {
  content: "" !important;
}
.bounce-enter-active {
  animation: bounce-in 2s;
}
.bounce-leave-active {
  animation: bounce-in 2s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0.99);
  }
  50% {
    transform: scale(1.01);
  }
  100% {
    transform: scale(1);
  }
}
</style>
