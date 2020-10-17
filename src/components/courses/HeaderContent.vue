<template>
  <div>
    <div class="bannerimg">
      <div class="header-text mb-0">
        <div class="container">
          <div class="">
            <img
              src="/assets/images/svg/LiveClass/live_course_banner.png"
              class="img-fluid mx-auto d-block"
              width="750"
            />
            <div class="text-center">
              <TrialButton/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TrialButton from '@/components/BookTrialButton/BookTrialShareButton.vue';
export default {
  components:{TrialButton},
  
}
</script>
