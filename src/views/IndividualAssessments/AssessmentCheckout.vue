<template>
  <div>
    <Header>
      <HeaderContent />
    </Header>

    <section class="sptb">
      <div class="container-fluid">
        <div class="row row-cards">
          <div class="col-lg-8 col-sm-8 col-md-8">
            <div class="card m-b-20">
              <div class="card-header bg-secondary">
                <div class="card-title text-white">Order</div>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table
                    class="table card-table table-vcenter text-nowrap table-primary"
                  >
                    <thead class="bg-primary text-white">
                      <tr>
                        <th class="text-white">Sr. No.</th>
                        <th class="text-white">Item Name</th>
                        <th class="text-white">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="(item, index) in itemInCart">
                        <tr :key="index">
                          <th>{{ index + 1 }}</th>
                          <td>{{ item.assessment_name }}</td>
                          <td>
                            <i class="fas fa-rupee-sign text-muted"></i>
                            {{ item.price }}
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-sm-4 col-md-4">
            <div class="card">
              <div class="card-header bg-secondary">
                <div class="card-title text-white">Order Summary</div>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table
                    class="table table-bordered"
                    v-if="payment_details.length"
                  >
                    <tbody>
                      <tr>
                        <td>Subtotal</td>
                        <td class="text-right">
                          <i class="fas fa-rupee-sign text-muted"></i>
                          {{ payment_details[0].subTotal }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span>Discount</span>
                        </td>
                        <td class="text-right ">
                          <i class="fas fa-rupee-sign text-muted"></i>
                          {{ payment_details[0].discountPrice }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span>Total</span>
                        </td>
                        <td>
                          <h3 class="price text-right mb-0" id="grand-total">
                            <i class="fas fa-rupee-sign text-muted"></i>
                            {{ payment_details[0].totalPrice }}
                          </h3>
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
                      <label class="form-label" for="exampleInputEmail1"
                        >Email Address</label
                      >
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
                      <label class="form-label" for="exampleInputEmail1"
                        >Phone Number</label
                      >
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
                        <button
                          type="button"
                          class="btn btn-primary"
                          @click="update_profile"
                        >
                          Update
                        </button>
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
                    Proceed To Payment <i class="fas fa-long-arrow-right"></i>
                  </button>
                  <button
                    v-else
                    class="btn btn-primary mt-2 m-b-20 payment-process"
                    type="button"
                    @click="purchaseProduct()"
                  >
                    Proceed To Payment <i class="fas fa-long-arrow-right"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div
      class="modal fade "
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
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
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
                  >
                    Apply
                  </button>
                </div>
                <div
                  class="col-sm-12 text-red p-0 applied"
                  style="display:none"
                >
                  <i class="fas fa-exclamation-triangle"></i> coupon is not
                  valid
                </div>
              </div>
            </form>
            <h4>Your offers</h4>
            <div v-if="coupon_details.length == 0" class="coupons">
              <div style="padding:24px;color:#ccc;text-align:center">
                No coupon!
              </div>
            </div>
            <div class="overflow-auto" style="max-height:300px;" v-else>
              <div
                class="coupons"
                v-for="(coupon_detail, index) in coupon_details"
                v-bind:key="index"
              >
                <div class="row justify-content-end mx-1">
                  <div class="coupon-details mr-5 py-2 flex-grow-1">
                    <h4 class="coupon-code-header align-items-center">
                      Diwali offer
                      <div class="coupon-code">
                        {{ coupon_detail.coupon_code }}
                      </div>
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
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <Footer />

    <Loader v-if="processing" />

    <component
      :is="'script'"
      id="bolt"
      src="https://sboxcheckout-static.citruspay.com/bolt/run/bolt.min.js"
      bolt-color="ff003a"
      bolt-logo=""
    >
    </component>
    <!--<component
      :is="'script'"
      id="bolt"
      src="https://checkout-static.citruspay.com/bolt/run/bolt.min.js"
      bolt-color="ff003a"
      bolt-logo=""
    >
    </component>-->
    <!--<script
    id="bolt"
    src="https://checkout-static.citruspay.com/bolt/run/bolt.min.js"
    bolt-color="#2b7de9" bolt-logo="">
  </script>-->
  </div>
</template>

<script>
import Header from "@/components/header/Header.vue";
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
      userId: 0,
      user_full_name: this.$store.getters.getAuthData.auth_user_full_name,
      cls_id: this.$store.getters.getAuthData.auth_cls_id,
      user_id: this.$store.getters.getAuthData.auth_user_id,
      sec_id: this.$store.getters.getAuthData.auth_sec_id,
      role_id: this.$store.getters.getAuthData.auth_role_id,
      sch_id: this.$store.getters.getAuthData.auth_sch_id,
      user_email: this.$store.getters.getAuthData.auth_user_email,
      user_contact: this.$store.getters.getAuthData.auth_user_contact,
      assessments: [],
      payment_details: [],
      itemInCart: [],
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
      buyClicked: false,
      coupon_id: 0,
      coupon_desc: "",
      product_id: "",
      product_slug: "",
      product_type: "",
      processing: false,
      quiz_sub_id: 0,
      selectedProducts: new Object(),
      purchaseType: "",
      allPackages: [],
      selectedAssessmentId: "",
      assessmentStatus: false
    };
  },
  beforeMount: function() {
    //this.load_all_packages();
  },
  mounted() {
    cvAuth.getUserId(
      function(userId) {
        if (!userId) {
          this.$router.push(
            "/login?redirect=" + encodeURIComponent(window.location.href)
          );
          return;
        }
        if (this.$route.query.assessmentDetail) {
          this.selectedAssessmentId = this.$route.query.assessmentDetail;
        }

        this.userId = userId;
        this.user_full_name = this.$store.getters.getAuthData.auth_user_full_name;
        this.cls_id = this.$store.getters.getAuthData.auth_cls_id;
        this.user_id = this.$store.getters.getAuthData.auth_user_id;
        this.sec_id = this.$store.getters.getAuthData.auth_sec_id;
        this.role_id = this.$store.getters.getAuthData.auth_role_id;
        this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
        this.user_email = this.$store.getters.getAuthData.auth_user_email;
        this.user_contact = this.$store.getters.getAuthData.auth_user_contact;
        this.assessmentForUsers();
      }.bind(this)
    );
  },
  methods: {
    assessmentForUsers: function() {
      this.$http
        .post("/api/user/DisplayIndividualAssessment", { user_id: this.userId })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            var assessments = res.body.assessments;
            for (var i = 0; i < assessments.length; i++) {
              if (assessments[i].assessment_id == this.selectedAssessmentId) {
                if (assessments[i].order_status != 0) {
                  this.assessmentStatus = true;
                }
                this.assessments.push(assessments[i]);
                this.itemInCart.push(assessments[i]);
                this.payment_details.push({
                  subTotal: assessments[i].price,
                  discountPrice: 0,
                  totalPrice: assessments[i].price,
                  package_id: 0,
                  product_id: assessments[i].product_id,
                  name: this.user_full_name,
                  email: this.user_email,
                  contact: this.user_contact
                });
              }
            }
          }
        });
    },
    calculatePayblePrice: function() {
      var subTotal = 0;
      var discountPrice = 0;
      var totalPrice = 0;
      for (var i = 0; i < this.allPackages.length; i++) {
        if (this.allPackages[i].package_id == this.purchaseType) {
          this.payment_details.push({
            subTotal: this.allPackages[i].price,
            discountPrice: Math.ceil(
              (this.allPackages[i].price * this.allPackages[i].discount) / 100
            ),
            totalPrice:
              this.allPackages[i].price -
              Math.ceil(
                (this.allPackages[i].price * this.allPackages[i].discount) / 100
              ),
            package_id: this.purchaseType,
            package_name: this.itemInCart[0].package_name,
            name: this.user_full_name,
            email: this.user_email,
            contact: this.user_contact
          });
        }
      }
    },
    update_profile: function() {
      var vm = this;
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
        this.$http
          .post("/api/user/UdateUserData", {
            user_id: this.userId,
            email: user_email,
            phone: mobile
          })
          .then((res) => {
            if (res.data.status == 200) {
              if (res.data.data == 0) {
                window.cvNotify("Email already exists", "warning");
              } else {
                // this.getPaymentDetail(this.userId);
                vm.user_email =
                  user_email == 1 ? vm.payment_details[0].email : user_email;
                vm.user_contact = mobile;
                vm.payment_details[0].email = user_email;
                vm.payment_details[0].contact = mobile;
                $("#contact_form").hide();
                $(".payment-process").show();
              }
            }
          });
      }
    },
    /*****Payment Process */
    purchaseProduct: function() {
      if (this.assessmentStatus) {
        cvNotify("You have already purchased this assessment.");
        return false;
      }
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
      this.$http
        .post("/api/assessments/beginTransactionProcess", {
          products: this.assessments,
          user_id: this.user_id,
          user_full_name: this.user_full_name,
          user_email: this.user_email,
          user_contact: this.user_contact,
          payment_details: this.payment_details
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
            this.buyClicked = false;
          } else {
            var transactionData = res.body;
            this.startBolt(transactionData.transaction_data);
          }
        });
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
      if (this.doingPaymentSuccessful) return;
      this.doingPaymentSuccessful = true;
      axios
        .post("/api/assessments/assessmentPaymentSuccessful", boltResponse)
        .then((res) => {
          this.doingPaymentSuccessful = false;
          this.buyClicked = false;
          this.processing = false;
          this.$router.push({
            name: "individualassessment"
          });
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
