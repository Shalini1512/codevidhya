<template>
  <div id="courses-grid-section" class="sptb bg-white" style="background: red;">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="">
            <div class="items-gallery">
              <div class="items-blog-tab text-center">
                <div class="tab-content">
                  <!--tab--2-->
                  <div class="tab-pane active" id="tab-2">
                    <div class="row">
                      <slot></slot>
                    </div>
                  </div>
                  <!--end tab-2-->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-sm-12 text-center mt-2">
      <TrialButton />
    </div>
  </div>
  <!-- courses section end-->
</template>

<script>
import TrialButton from "@/components/BookTrialButton/BookTrialShareButton.vue";
export default {
  components: { TrialButton },
};
</script>

<style lang="scss">
#courses-grid-section {
  .rating-stars {
    position: absolute;
    left: 16px;
    bottom: 16px;
  }
}
</style>
