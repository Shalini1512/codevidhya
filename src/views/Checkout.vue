<template>
  <div>
    <Header>
      <HeaderContent />
    </Header>

    <section class="sptb">
      <div class="container">
        <div class="row row-cards">
          <div class="col-lg-8">
            <div class="card m-b-20">
              <div class="card-header">
                <div class="card-title">Order</div>
              </div>
              <div class="card-body">
                <div id="checkout-items">
                  <div class="checkout-row checkout-items-header">
                    <div class="cell num-col"></div>
                    <div class="item-info-wrapper">
                      <div class="cell item-col">ITEMS</div>
                      <div class="cell price-col">PRICE</div>
                    </div>
                  </div>
                  <div class="checkout-row">
                    <div class="cell num-col">1</div>
                    <div class="item-info-wrapper">
                      <div
                        class="cell item-col"
                        v-html="
                          payment_details.length
                            ? payment_details[0].product_name
                            : ''
                        "
                      ></div>
                      <div
                        class="cell price-col"
                        v-html="
                          payment_details&&payment_details.length
                            ? [payment_details[0].cprice =='IN'?'Rs.':'$'] + payment_details[0].price
                            : ''
                        "
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card" style="display:none">
              <div class="card-header text-white" style="background:#E75160">
                <div class="card-title">Payment Methods</div>
              </div>
              <div class="card-body">
                <div class="col-sm-12">
                  <label class="custom-control custom-radio">
                    <input
                      type="radio"
                      class="custom-control-input payment-methods"
                      name="example-radios"
                      value="payu"
                    />
                    <span class="custom-control-label">PayU Online Payment</span>
                  </label>
                </div>
                <div class="col-sm-12">
                  <label class="custom-control custom-radio">
                    <input
                      type="radio"
                      class="custom-control-input payment-methods"
                      name="example-radios"
                      value="paytm"
                      checked
                    />
                    <span class="custom-control-label">Paytm Online Payment</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="card">
              <div class="card-header">
                <div class="card-title">Order Summary</div>
              </div>
              <div class="card-body">
                <div class="coupons-wrapper mb-3 px-3">
                  <div class="row font-weight-bold">Coupons</div>
                  <div class="row align-items-center">
                    <div class="applied-coupon flex-grow-1">
                      <template v-if="coupon_desc">
                        <div>{{ coupon_code }}</div>
                        <div>{{ coupon_desc }}</div>
                      </template>
                      <div v-else class="font-weight-bold">No coupon applied</div>
                    </div>
                    <button
                      v-if="!coupon_desc"
                      class="btn btn-outline-primary align-self-center py-1"
                      data-toggle="modal"
                      data-target="#exampleModalLong"
                    >Apply coupon</button>
                    <button
                      v-else
                      class="btn btn-outline-primary align-self-center py-1"
                      @click="remove_coupon()"
                    >Remove</button>
                  </div>
                </div>
                <div class="table-responsive">
                  <table class="table table-bordered">
                    <tbody>
                      <tr>
                        <td>Subtotal</td>
                        <td class="text-right">
                          {{
                          product_slug
                          ? payment_details&&payment_details.length
                          ? [payment_details[0].cprice =='IN'?"Rs.":"$"] + payment_details[0].price
                          : "Rs. 0"
                          : "Rs. 0"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span>Discount</span>
                        </td>
                        <td class="text-right text-muted">
                          <span>- {{payment_details&&payment_details.length?payment_details[0].cprice =='IN'?"Rs.":"$":'Rs.'}} {{ product_slug ? discount : 0 }}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span>Total</span>
                        </td>
                        <td>
                          <h2 class="price text-right mb-0" id="grand-total">
                            {{payment_details&&payment_details.length?payment_details[0].cprice =='IN'?"Rs.":"$":"Rs."}}
                            {{
                            grant_total
                            ? parseFloat(grant_total).toFixed(2)
                            : payment_details.length
                            ? parseFloat(payment_details[0].price).toFixed(2)
                            : "0"
                            }}
                          </h2>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="contact_form" style="display:none">
                  <form>
                    <div
                      class="form-group"
                      v-if="
                        payment_details.length
                          ? !payment_details[0].email
                          : true
                      "
                    >
                      <label class="form-label" for="exampleInputEmail1">Email Address</label>
                      <input
                        type="email"
                        class="form-control"
                        id="user_email"
                        placeholder="email address"
                        :value="
                          payment_details.length ? payment_details[0].email : ''
                        "
                      />
                    </div>
                    <div
                      class="form-group"
                      v-if="
                        payment_details.length
                          ? !payment_details[0].contact
                          : true
                      "
                    >
                      <label class="form-label" for="exampleInputEmail1">Phone Number</label>
                      <input
                        type="Number"
                        class="form-control"
                        id="user_phone"
                        placeholder="mobile number"
                        :value="
                          payment_details.length
                            ? payment_details[0].contact
                            : ''
                        "
                      />
                    </div>
                    <div class="form-group mb-0">
                      <div class="checkbox checkbox-secondary text-center">
                        <button type="button" class="btn btn-primary" @click="update_profile">Update</button>
                      </div>
                    </div>
                  </form>
                </div>
                <form class="text-right">
                  <button
                    class="btn btn-primary mt-2 m-b-20 payment-process"
                    type="button"
                    v-if="buyClicked"
                    disabled="disabled"
                  >
                    Proceed To Payment
                    <i class="fas fa-long-arrow-right"></i>
                  </button>

                  <button
                    v-else
                    class="btn btn-primary mt-2 m-b-20 payment-process"
                    type="button"
                    @click="
                      buycourse(
                        payment_details[0].product_id,
                        payment_details[0].product_name,
                        payment_details[0].slug,
                        payment_details[0].prod_info
                      )
                    "
                  >
                    Proceed To Payment
                    <i class="fas fa-long-arrow-right"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div
      class="modal fade"
      id="exampleModalLong"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLongTitle"
      aria-hidden="true"
      style="max-height:90%;"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Coupons</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="input-group mb-5">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Coupon code"
                  aria-label="Coupon code"
                  aria-describedby="basic-addon2"
                  v-model="coupon_code"
                />

                <div class="input-group-append">
                  <button
                    class="btn btn-outline-secondary"
                    @click="apply_coupon_dis()"
                    type="button"
                  >Apply</button>
                </div>
                <div class="col-sm-12 text-red p-0 applied" style="display:none">
                  <i class="fas fa-exclamation-triangle"></i> coupon is not
                  valid
                </div>
              </div>
            </form>
            <h4>Your offers</h4>
            <div v-if="coupon_details.length == 0 || visible_coupons == -1" class="coupons">
              <div style="padding:24px;color:#ccc;text-align:center">No coupon!</div>
            </div>
            <div class="overflow-auto" style="max-height:300px;" v-else>
              <template v-for="(coupon_detail, index) in coupon_details">
                <div class="coupons" v-if="coupon_detail.visible_all == 1" v-bind:key="index">
                  <div class="row justify-content-end mx-1">
                    <div class="coupon-details mr-5 py-2 flex-grow-1">
                      <h4 class="coupon-code-header align-items-center">
                        <div class="coupon-code">{{ coupon_detail.coupon_code }}</div>
                      </h4>
                      <div v-html="coupon_detail.coupon_desc"></div>
                    </div>

                    <button
                      class="btn border px-3 align-self-center"
                      @click="
                        coupon_apply(
                          coupon_detail.discount,
                          coupon_detail.coupon_code,
                          coupon_detail.coupon_id
                        )
                      "
                    >Apply</button>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <form
      v-if="transactionPaytmData"
      method="post"
      action="https://securegw.paytm.in/theia/processTransaction"
      name="f1"
    >
      <input
        v-for="(value, name,index) in transactionPaytmData"
        :key="index"
        type="hidden"
        :name="name"
        :value="value"
      />
    </form>
    <Footer />
    <!--<template v-for="(value, name,index) in transactionPaytmData">
       <span :key="index">
         <template>{{value}}</template>
         <template>{{name}}</template>
       </span>
    </template>-->
    <Loader v-if="processing" />

    <!-- <component
      :is="'script'"
      id="bolt"
      src="https://sboxcheckout-static.citruspay.com/bolt/run/bolt.min.js"
      bolt-color="ff003a"
      bolt-logo="https://codevidhya.com/socialshare/Challenge_a_Friend!.png"
    >
    </component>-->
    <component
      :is="'script'"
      id="bolt"
      src="https://checkout-static.citruspay.com/bolt/run/bolt.min.js"
      bolt-color="ff003a"
      bolt-logo
    ></component>

    <!--<script
    id="bolt"
    src="https://checkout-static.citruspay.com/bolt/run/bolt.min.js"
    bolt-color="#2b7de9" bolt-logo="">
    </script>-->
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/checkout/HeaderContent.vue";
import Footer from "@/components/footer/Footer.vue";
import Loader from "@/components/widgets/BlockingLoader.vue";
import axios from "axios";
export default {
  name: "home",
  components: {
    Header,
    HeaderContent,
    Footer,
    Loader
  },
  data() {
    return {
      payment_details: "",
      order_id: "",
      isSignedIn: "",
      coupon_details: "",
      coursesCheckoutWithUserId: false,
      coursesCheckoutWithoutUserId: false,
      unlockedCourses: {},
      view_more: 1,
      grant_total: 0,
      discount: 0,
      coupon_code: "",
      userId: 0,
      buyClicked: false,
      coupon_id: 0,
      coupon_desc: "",
      product_id: "",
      product_slug: "",
      product_type: "",
      processing: false,
      quiz_sub_id: 0,
      visible_coupons: "",
      transactionPaytmData: []
    };
  },
  mounted() {
    this.product_id = new URL(window.location).searchParams.get("id");
    this.product_slug = decodeURIComponent(
      new URL(window.location).searchParams.get("product_name")
    );
    this.product_type = decodeURIComponent(
      new URL(window.location).searchParams.get("type")
    );
    this.quiz_sub_id = decodeURIComponent(
      new URL(window.location).searchParams.get("sub_id")
    );

    cvAuth.getUserId(
      function(userId) {
        if (!userId) {
          this.$router.push(
            "/login?redirect=" + encodeURIComponent(window.location.href)
          );
          return;
        }
        this.userId = userId;
        this.getPaymentDetail(userId);
      }.bind(this)
    );
  },
  methods: {
    update_profile: function() {
      var emailField = $("#user_email");
      let user_email = emailField.length ? emailField.val() : undefined;
      if (user_email == undefined) {
        user_email = this.payment_details[0].email;
      }
      var phoneField = $("#user_phone");
      let mobile = phoneField.length ? phoneField.val() : undefined;
      if (mobile == undefined) {
        mobile = this.payment_details[0].contact;
      }

      if (!user_email || !mobile) {
        window.cvNotify("Please provide all details", "error");
        return false;
      } else if (!window.validateEmail(user_email)) {
        window.cvNotify("Please provide valid email", "error");
        return false;
      } else if (!window.validatePhone(mobile)) {
        window.cvNotify("Please provide valid email", "error");
        return false;
      } else {
        if (this.payment_details[0].email) {
          user_email = 1;
        }
        axios
          .post("api/user/UdateUserData", {
            user_id: this.userId,
            email: user_email,
            phone: mobile
          })
          .then(res => {
            if (res.data.status == 200) {
              if (res.data.data == 0) {
                window.cvNotify("Email already exists", "warning");
              } else {
                this.getPaymentDetail(this.userId);
                $("#contact_form").hide();
                $(".payment-process").show();
              }
            }
          });
      }
    },
    remove_coupon: function() {
      this.coupon_code = "";
      this.coupon_desc = "";
      this.coupon_id = 0;
      this.discount = 0;
      this.grant_total = "";
    },
    apply_coupon_dis: function() {
      axios
        .post("/api/user/get_coupons_detail", {
          user_id: this.userId,
          product_id: this.payment_details.length
            ? this.payment_details[0].product_id
            : this.product_id
        })
        .then(res1 => {
          this.coupon_details = res1.data.data;
          this.visible_coupons = this.coupon_details.findIndex(
            x => x.visible_all == 1
          );
          let index = this.coupon_details.findIndex(
            x => x.coupon_code === this.coupon_code
          );
          if (index == -1) {
            this.coupon_id = 0;
            this.coupon_code = "";
            this.discount = 0;
            this.grant_total = "";
            $(".applied").css("display", "inline-block");
            return false;
          }
          $(".applied").css("display", "none");
          this.coupon_id = this.coupon_details[index].coupon_id;
          this.coupon_desc = this.coupon_details[index].coupon_desc;
          this.discount =
            (this.payment_details[0].price *
              this.coupon_details[index].discount) /
            100;
          this.grant_total = this.payment_details[0].price - this.discount;
          $("#exampleModalLong").modal("toggle");
        });
    },
    change_coupon: function() {
      // console.log(this.coupon_code);
      let index = this.coupon_details.findIndex(
        x => x.coupon_code === this.coupon_code
      );
      if (index == -1) {
        this.discount = 0;
        this.coupon_id = 0;
        return;
      }
      this.coupon_id = this.coupon_details[index].coupon_id;
    },
    coupon_apply: function(disc, coupon_code, coupon_id) {
      let index = this.coupon_details.findIndex(
        x => x.coupon_code === coupon_code
      );

      if (index == -1) {
        this.coupon_id = 0;
        this.coupon_code = "";
        this.discount = 0;
        this.grant_total = "";
        $(".applied").css("display", "inline-block");
        return false;
      }
      this.coupon_code = coupon_code;
      this.coupon_id = coupon_id;
      this.coupon_desc = this.coupon_details[index].coupon_desc;
      this.discount =
        (this.payment_details[0].price * this.coupon_details[index].discount) /
        100;
      this.grant_total = this.payment_details[0].price - this.discount;

      $("#exampleModalLong").modal("toggle");
    },
    getPaymentDetail: function(userId) {
      axios
        .post("/api/user/get_product_payment_detail", {
          user_id: userId,
          product_slug: this.product_slug,
          product_id: this.product_id,
          product_type: this.product_type,
          quiz_sub_id: this.quiz_sub_id
        })
        .then(res => {
          this.payment_details = res.data.data;
          // console.log(this.payment_details);

          if (this.payment_details[0].purchased_status) {
            if (this.product_type == "quiz") {
              this.$router.push(
                "/quiz-instruction?id=" + this.payment_details[0].p_p_id
              );
            } else {
              this.$router.push({
                name: "course-details",
                params: {
                  curName: this.product_slug
                }
              });
            }
          } else if (
            this.payment_details[0].sch_id != 1 &&
            this.product_type == "course"
          ) {
          }

          axios
            .post("/api/user/get_coupons_detail", {
              user_id: userId,
              product_id: this.payment_details.length
                ? this.payment_details[0].product_id
                : this.product_id
            })
            .then(res1 => {
              this.coupon_details = res1.data.data;
              this.visible_coupons = this.coupon_details.findIndex(
                x => x.visible_all == 1
              );
            });
        });
    },
    /*****Payment Process */
    buycourse: function(prod_id, prod_name, prod_slug, prod_info) {
      if (!this.coupon_desc) {
        this.coupon_code = "";
        this.coupon_id = 0;
      }
      let product_id = prod_id;
      let email = this.payment_details[0].email;
      let name = this.payment_details[0].name;
      let phone = this.payment_details[0].contact;

      //if (phone == null || phone == "") phone = "1234567890";
      if (phone == null || phone == "" || (email == null || email == "")) {
        $("#contact_form").show();
        $(".payment-process").hide();
        this.processing = false;
        return false;
      }
      let paymentMethod = $("input[name='example-radios']:checked").val();
      console.log(paymentMethod);
      if (paymentMethod == "payu") {
        axios
          .post("/api/payments/all_product_beginTransaction", {
            user_id: this.userId,
            product_id: product_id,
            product_name: prod_name,
            prod_info: "" + prod_info,
            full_name: name,
            email: email,
            phone: phone,
            coupon_id: "" + this.coupon_id
          })
          .then(res => {
            var transactionData = res.data;
            this.startBolt(transactionData.transaction_data);
          })
          .catch(function(err) {
            this.buyClicked = false;
          });
      } else if (paymentMethod == "paytm") {
        axios
          .post("/api/payments/all_paytmproduct_beginTransaction", {
            user_id: this.userId,
            product_id: product_id,
            product_name: prod_name,
            prod_info: "" + prod_info,
            full_name: name,
            email: email,
            phone: phone,
            coupon_id: "" + this.coupon_id
          })
          .then(res => {
            this.processing = false;
            this.transactionPaytmData = res.data.transaction_data.checksum;
            this.processing = true;
            // return;
            setTimeout(this.startPaytm, 4000, this.transactionPaytmData).then(
              res => {}
            );
            //	document.f1.submit();
            //var myWindow = setTimeout(window.open("http://localhost:3010/testtxn?jsondata="+JSON.stringify(jsonData), "sasd", "width=200,height=100"),3000);
          });
      }
    },
    startPaytm(transaction_data) {
      document.f1.submit();
    },
    startBolt: function(transactionData) {
      let vm = this;
      this.order_id = transactionData.id;
      var data = {
        key: "" + transactionData.key,
        txnid: "" + transactionData.id,
        hash: transactionData.hash,
        amount: "" + transactionData.amount,
        firstname: transactionData.first_name,
        email: transactionData.email,
        phone: "" + transactionData.phone,
        productinfo: transactionData.product_info,
        surl: "https://codevidhya.com",
        furl: "https://codevidhya.com" //,
        //mode:'dropout'// non-mandatory for Customized Response Handling
      };
      var handler = {
        responseHandler: function(BOLT) {
          if (BOLT.response.status == "success") {
            vm.buyClicked = true;
            vm.processing = true;
            vm.doPaymentSuccessful(BOLT.response);
            //vm.checkOrderStatus();
          } else {
            vm.processing = false;
          }
        },
        catchException: function(BOLT) {
          vm.processing = false;
          vm.buyClicked = false;
        }
      };
      bolt.launch(data, handler);
    },
    doPaymentSuccessful(boltResponse) {
      //   console.log(boltResponse);
      if (this.doingPaymentSuccessful) return;
      this.doingPaymentSuccessful = true;

      //this.$http.post('https://dev.codevidhya.com/api/payments/payment_successful', boltResponse)
      //console.log(boltResponse);
      axios
        .post("/api/payments/payment_successful", boltResponse)
        .then(res => {
          this.doingPaymentSuccessful = false;
          this.buyClicked = false;
          this.processing = false;
          if (this.product_type == "course") {
            this.$router.push({
              name: "course-details",
              params: {
                curName: this.product_slug
              }
            });
          } else if (this.product_type == "live_course") {
            this.$router.push(
              "/live-courses-thank-you?id=" +
                this.product_id +
                "&name=" +
                this.payment_details[0].product_name
            );
          } else {
            this.$router.push(
              "/quiz-instruction?id=" + this.payment_details[0].p_p_id
            );
          }

          // window.open('/Dashboard', '_self');
        })
        .catch(() => {
          this.processing = true;
          this.doingPaymentSuccessful = false;
          this.buyClicked = false;
        });
    }
    /***End Payment Process */
  }
};
</script>

<style lang="scss">
$border: 1px solid rgba(0, 0, 0, 0.1);

#checkout-items {
  margin-bottom: 16px;
  border: $border;
}
.checkout-row {
  display: flex;
  flex-direction: row;
  border-bottom: $border;
  &:last-of-type {
    border-bottom: none;
  }
  .cell {
    padding: 16px;
    border-right: $border;
    &:last-of-type {
      border-right: none;
    }
  }
  .num-col {
    width: 72px;
  }
  .item-info-wrapper {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
  }
  .item-col {
    flex-grow: 1;
  }
  .price-col {
    flex-shrink: 0;
    width: 128px;
    text-align: right;
  }
}

.coupon-code-header {
  display: flex;
  flex-direction: row;
}

.coupon-code {
  margin-left: 16px;
  padding: 4px 8px;
  border: 1px dashed #f00;
  border-radius: 4px;
  background: rgba(255, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .checkout-row {
    .num-col {
      width: 48px;
    }
    .price-col {
      width: 128px;
    }
  }
}

@media (max-width: 480px) {
  .checkout-items-header {
    display: none;
  }
  .checkout-row {
    .item-info-wrapper {
      flex-direction: column;
    }
    .price-col {
      padding-top: 0;
      text-align: left;
    }
  }
}
</style>
