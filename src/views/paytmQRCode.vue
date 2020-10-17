<template>
  <div id="root-404">
    <Header />
    <div class="construction-image page page-h">
      <div class="page-content z-index-10">
        <div class="container text-center">
          
        <img src="dynamic/paytm_qr_code/paytmQrcode.jpeg" class="rounded img-fluid pr-4 mr-4" alt="PaytmQrCode" style="width: 300px">
        <img src="dynamic/paytm_qr_code/googlePayNew.jpg" class="rounded img-fluid pl-4 ml-4" alt="GoogleQrCode" style="width: 300px">
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import Footer from "@/components/footer/Footer.vue";
export default {
  components: {
    Header,
    Footer
  }
};
</script>

<style lang="scss">
#root-404 {
  .construction-image {
    position: relative;
    padding-top: 59px;
    &:before {
      position: absolute !important;
      top: 0;
      height: 100%;
    }
  }
}
</style>
