<template>
  <div>
    <form
      v-if="transactionPaytmData"
      method="post"
      action="https://securegw.paytm.in/theia/processTransaction"
      name="f1"
    >
      <input
        v-for="(value, name, index) in transactionPaytmData"
        :key="index"
        type="hidden"
        :name="name"
        :value="value"
      />
    </form>
    <Loader v-if="processing" />
  </div>
</template>
<script>
import Loader from '@/components/widgets/BlockingLoader.vue'
import axios from 'axios'
export default {
  components: { Loader },
  data() {
    return {
      transactionPaytmData: [],
      processing: false,
      userId: '',
    }
  },
  mounted() {
    cvAuth.getUserId(
      function (userId) {
        if (userId) {
          this.userId = userId
        }
      }.bind(this),
    )
  },
  methods: {
    buycourse(
      name,
      email,
      phone,
      prod_id,
      prod_name,
      prod_slug,
      prod_info,
      coupon_id = 0,
      coupon_desc = '',
    ) {
      if (!coupon_desc) {
        coupon_id = 0
      }
      let product_id = prod_id
      this.transactionPaytmData = []
      axios
        .post('/api/payments/all_paytmproduct_beginTransaction', {
          user_id: this.userId,
          product_id: product_id,
          product_name: prod_name,
          prod_info: '' + prod_info,
          full_name: name,
          email: email,
          phone: phone,
          coupon_id: '' + coupon_id,
        })
        .then((res) => {
          this.processing = false
          this.transactionPaytmData = res.data.transaction_data.checksum

          this.processing = true
          // return;
          let vm =this;
          window.setTimeout(
            vm.startPaytm,
            4000,
            vm.transactionPaytmData,
          ).then((res) => {})
          //	document.f1.submit();
          //var myWindow = setTimeout(window.open("http://localhost:3010/testtxn?jsondata="+JSON.stringify(jsonData), "sasd", "width=200,height=100"),3000);
        })
    },
    startPaytm(transaction_data) {
      document.f1.submit()
    },
  },
}
</script>
