<template>
  <div id="PaymentApplyCoupon" class="cv-modal normal">
    <div
      style="
        display: flex;
        flex-direction: column;
        max-width: 1000px;
        width: 55%;
        height: 55%;
        overflow: auto;
      "
    >
      <!--header-->
      <div class="row m-0 p-2 bg-primary text-white">
        <div class="active d-inline-block">
          <h5>Coupons</h5>
        </div>
        <i class="flex-fill"></i>
        <span
          onclick="hideModal('PaymentApplyCoupon')"
          class="d-inline-block mr-4"
        >
          <i class="fas fa-times"></i>
        </span>
      </div>
      <!--end header-->
      <!--body-->
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
            <div class="col-sm-12 text-red p-0 applied" style="display: none;">
              <i class="fas fa-exclamation-triangle"></i>
              coupon is not valid
            </div>
          </div>
        </form>
        <h4>Your offers</h4>
        <div
          v-if="coupon_details.length == 0 || visible_coupons == -1"
          class="coupons"
        >
          <div style="padding: 24px; color: #ccc; text-align: center;">
            No coupon!
          </div>
        </div>
        <div class="overflow-auto" style="max-height: 300px;" v-else>
          <template v-for="(coupon_detail, index) in coupon_details">
            <div
              class="coupons"
              v-if="coupon_detail.visible_all == 1"
              v-bind:key="index"
            >
              <div class="row justify-content-end mx-1">
                <div class="coupon-details mr-5 py-2 flex-grow-1">
                  <h4 class="coupon-code-header align-items-center">
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
                      coupon_detail.coupon_id,
                    )
                  "
                >
                  Apply
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
      <!--end body-->
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'CouponModule',
  props: ['product_id', 'product_price'],
  data() {
    return {
      coupon_id: 0,
      userId: 0,
      coupon_details: [],
      coupon_desc: '',
      grant_total: '',
      coupon_code: '',
      discount: 0,
      visible_coupons: [],
    }
  },
  mounted() {
    cvAuth.getUserId(
      function (userId) {
        this.userId = userId
        this.getCouponsDetails(userId)
      }.bind(this),
    )
  },
  methods: {
    getCouponsDetails(userId) {
      axios
        .post('/api/user/get_coupons_detail', {
          user_id: userId,
          product_id: this.product_id,
        })
        .then((res1) => {
          this.coupon_details = res1.data.data
          this.visible_coupons = this.coupon_details.findIndex(
            (x) => x.visible_all == 1,
          )
        })
    },

    apply_coupon_dis: function () {
      axios
        .post('/api/user/get_coupons_detail', {
          user_id: this.userId,
          product_id: this.product_id,
        })
        .then((res1) => {
          this.coupon_details = res1.data.data
          this.visible_coupons = this.coupon_details.findIndex(
            (x) => x.visible_all == 1,
          )
          let index = this.coupon_details.findIndex(
            (x) => x.coupon_code === this.coupon_code,
          )
          if (index == -1) {
            this.coupon_id = 0
            this.coupon_code = ''
            this.discount = 0
            this.grant_total = ''
            $('.applied').css('display', 'inline-block')
            return false
          }
          $('.applied').css('display', 'none')
          this.coupon_id = this.coupon_details[index].coupon_id
          this.coupon_desc = this.coupon_details[index].coupon_desc
          this.discount =
            (this.product_price * this.coupon_details[index].discount) / 100
          this.grant_total = this.product_price - this.discount
          this.callBackFunction()
        })
    },
    change_coupon: function () {
      // console.log(this.coupon_code);
      let index = this.coupon_details.findIndex(
        (x) => x.coupon_code === this.coupon_code,
      )
      if (index == -1) {
        this.discount = 0
        this.coupon_id = 0
        return
      }
      this.coupon_id = this.coupon_details[index].coupon_id
    },
    coupon_apply: function (disc, coupon_code, coupon_id) {
      let index = this.coupon_details.findIndex(
        (x) => x.coupon_code === coupon_code,
      )

      if (index == -1) {
        this.coupon_id = 0
        this.coupon_code = ''
        this.discount = 0
        this.grant_total = ''
        $('.applied').css('display', 'inline-block')
        return false
      }
      this.coupon_code = coupon_code
      this.coupon_id = coupon_id
      this.coupon_desc = this.coupon_details[index].coupon_desc
      this.discount =
        (this.product_price * this.coupon_details[index].discount) / 100
      this.grant_total = this.product_price - this.discount
      this.callBackFunction()
    },
    callBackFunction() {
      let coupon_id = this.coupon_id,
        coupon_desc = this.coupon_desc,
        discount = this.discount,
        grant_total = this.grant_total,
        coupon_code =this.coupon_code;
      this.$emit('UpdateCouponDetail', {
        coupon_id,
        coupon_desc,
        discount,
        coupon_code,
        grant_total,
      })
    },
  },
}
</script>
<style lang="scss">
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
</style>
