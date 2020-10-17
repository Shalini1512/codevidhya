<template>
  <div id="root-404">
    <Header />
    <div class="construction-image page page-h">
      <div class="page-content z-index-10">
        <div class="container text-center">
          <div class="display-1 text-white mb-5">404</div>
          <h1 class="h2 text-white  mb-3">Page Not Found</h1>
          <p class="h4 font-weight-normal mb-7 leading-normal text-white">
            Oops! You tried to access a page which is not available.
          </p>
          <router-link to="/" class="btn btn-primary">
            Back To Home
          </router-link>
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
