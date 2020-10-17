<template>
  <div>
   
    <Loader v-if="processing" />
  </div>
</template>
<script>
import Loader from "@/components/widgets/BlockingLoader.vue";
import axios from "axios";
export default {
  components: { Loader },
  data() {
    return {
      transactionPaypalData: [],
      processing: false,
      userId: "",
    };
  },
  mounted() {
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
        }
      }.bind(this)
    );
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
      coupon_desc = ""
    ) {
      if (!coupon_desc) {
        coupon_id = 0;
      }
      let product_id = prod_id;
      this.transactionPaypalData = [];
      axios
        .post("/api/payments/all_paypalproduct_beginTransaction", {
          user_id: this.userId,
          product_id: product_id,
          product_name: prod_name,
          prod_info: "" + prod_info,
          full_name: name,
          email: email,
          phone: phone,
          coupon_id: "" + coupon_id,
        })
        .then(async (res) => {
          this.processing = false;
          this.transactionPaypalData = res.data.transaction_data;
         // this.processing = true;
         window.location.href =this.transactionPaypalData.redirect;
        }).then(result =>{
          console.log(result);
        });
    },
    startPaytm(transaction_data) {
      
    },
  },
};
</script>
