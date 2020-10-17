<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title text-capitalize">You can also learn</h3>
    </div>
    <div class="card-body">
      <div class="row">
        <template v-for="(lms_book, index) in next_lms_books">
          <div class="col-md-12 col-lg-6 col-xl-4" v-bind:key="index">
            <div class="card mb-0">
              <div class="item-card2-img">
                <a
                  @click="
                    $router.push({
                      name: 'course-details',
                      params: {
                        curName: lms_book.slug,
                        bookId: lms_book.book_id,
                        book_per: lms_book.per
                      }
                    })
                  "
                ></a>
                <img
                  :src="'/assets/images/png/courses/' + lms_book.img"
                  alt="img"
                  class="cover-image"
                />
                <div class="item-tag"></div>
                <div class="rating-stars">
                  <div>
                    <span class="empty-stars">
                      <span class="star"><i class="fas fa-star"></i></span
                      ><span class="star"><i class="fas fa-star"></i></span
                      ><span class="star"><i class="fas fa-star"></i></span
                      ><span class="star"><i class="fas fa-star"></i></span
                      ><span class="star"><i class="fas fa-star"></i></span
                    ></span>
                    <span
                      class="filled-stars"
                      :style="
                        'width:' +
                          (lms_book.avg_rating
                            ? lms_book.avg_rating * 20
                            : 90) +
                          '%'
                      "
                      ><span class="star"><i class="fas fa-star"></i></span
                      ><span class="star"><i class="fas fa-star"></i></span
                      ><span class="star"><i class="fas fa-star"></i></span
                      ><span class="star"><i class="fas fa-star"></i></span
                      ><span class="star"><i class="fas fa-star"></i></span
                    ></span>
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
                              book_per: lms_book.per
                            }
                          })
                        "
                        class="text-dark"
                      >
                        <h4 class="mb-2" v-html="lms_book.book_name"></h4>
                      </a>
                    </div>
                    <p>
                      {{ lms_book.book_summary }}
                    </p>
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
                                book_per: lms_book.per
                              }
                            })
                          "
                          class="learn-more-btn"
                          style="background:#48c9b0;padding: 4px 8px;color: #fff;border-radius: 2px;"
                          >Learn More</a
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <div class="item-card2-footer">
                  <div class="item-card2-footer-u">
                    <div class="product-item-wrap d-flex">
                      <div class="product-item-price">
                        Rs.<del
                          class="oldprice text-muted"
                          style="font-size:14px;"
                          >{{ lms_book.actual_price }}</del
                        >
                        <span
                          class="newprice text-dark"
                          style="font-size:14px;"
                        >
                          {{ lms_book.price ? lms_book.price : "Free" }}</span
                        >
                      </div>
                      <a
                        :class="
                          'btn btn-info btn-sm ml-auto btn-outline-primary'
                        "
                        @click="
                          $router.push({
                            name: 'course-details',
                            params: {
                              curName: lms_book.slug,
                              bookId: lms_book.book_id,
                              book_per: lms_book.per
                            }
                          })
                        "
                        >Enroll Now</a
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <span
          class="float-right text-black"
          style="cursor:pointer"
          @click="$router.push('/courses')"
          ><u>View all</u></span
        >
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
    userId: { type: Number, required: true },
    next_lms_books: { type: Array, required: true }
  },
  mounted() {
    window.scrollTo(0, 0);
    var ratingOptions = {
      selectors: {
        starsSelector: ".rating-stars",
        starSelector: ".rating-star",
        starActiveClass: "is--active",
        starHoverClass: "is--hover",
        starNoHoverClass: "is--no-hover",
        targetFormElementSelector: ".rating-value"
      }
    };
    window.jQuery(".rating-stars").ratingStars(ratingOptions);
  },
  updated() {
    $(".lesson-review-item-rating").rating({
      displayOnly: true,
      theme: "krajee-fas",
      showCaption: false
    });
  }
};
</script>
