<template>
  <section class="sptb mt-0 pt-0 pb-6">
    <div class="container " style="padding-left:.12rem;padding-right:.12rem;">
      <div class="section-title center-block text-center pb-3">
        <h2 class="mb-4">Why Codevidhya?</h2>
      </div>
      <div class="row justify-content-between px-6" style="margin-bottom: 32px;">
        <div class="mycard">
          <div class>
            <div class="mb-lg-0 mb-4">
              <div class="service-card text-center">
                <div class="bg-white icon-bg icon-service text-purple about">
                  <img
                    src="/assets/images/png/howItWorks/play-button.svg"
                    alt="img"
                  />
                </div>
                <div class="servic-data mt-3">
                  <!--<p class="step mb-2">AAA</p>-->
                  <h4 class="mb-4">
                    Well-researched Curriculum, Innovative Pedgogy
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mycard">
          <div class>
            <div class="mb-lg-0 mb-4">
              <div class="service-card text-center">
                <div class="bg-white icon-bg icon-service text-purple about">
                  <img
                    src="/assets/images/png/howItWorks/coding.svg"
                    alt="img"
                  />
                </div>
                <div class="servic-data mt-3">
                  <!-- <p class="step mb-2">BBB</p>-->
                  <h4 class="mb-4">
                    Designed After Great Research, Delivered via-Activity
                    Based-Learning
                  </h4>
                  <!--<p class="text-muted mb-0">
                    Lorem ipsum dolor sit amet
                  </p>-->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mycard">
          <div class>
            <div class="mb-lg-0 mb-4">
              <div class="service-card text-center">
                <div class="bg-white icon-bg icon-service text-purple about">
                  <img
                    src="/assets/images/png/howItWorks/coding.svg"
                    alt="img"
                  />
                </div>
                <div class="servic-data mt-3">
                  <!-- <p class="step mb-2">BBB</p>-->
                  <h4 class="mb-4">
                    Focus on Real Coding, Development of Real World Skills
                  </h4>
                  <!--<p class="text-muted mb-0">
                    Lorem ipsum dolor sit amet
                  </p>-->
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--<div class="mycard">
          <div class>
            <div class="mb-sm-0 mb-4">
              <div class="service-card text-center">
                <div class="bg-white icon-bg icon-service text-purple about">
                  <img
                    src="/assets/images/png/howItWorks/chart.svg"
                    alt="img"
                  />
                </div>
                <div class="servic-data mt-3">
                  <p class="step mb-2">CCC</p>
                  <h4 class="mb-4">
                    Lorem ipsum dolor sit amet
                  </h4>
                  <p class="text-muted mb-0">
                    Lorem ipsum dolor sit amet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>-->
      </div>

      <div class="col-sm-12 text-center">
        <TrialButton />
      </div>
    </div>
  </section>
  <!--/Section-->
</template>
<script>
import TrialButton from "@/components/BookTrialButton/BookTrialShareButton.vue";
export default {
  components: { TrialButton },
};
</script>
<style lang="scss" scoped>
.mycard {
  width: 28%;
  padding: 56px 8px;
  background: #fff;
  border-radius: 8px;
  border-top-left-radius: 64px;
  transition: all 500ms;
  h4 {
    min-height: 48px;
  }
  h4,
  p {
    color: #4b5d73;
    transition: all 500ms;
  }
  /*&:hover {
    background: rgb(0, 141, 210);
    color: #fff;
    h4,
    p {
      color: rgba(255, 255, 255, 0.8) !important;
    }
  }*/
}

.step {
  font-size: 1.2rem;
  font-weight: 600;
  color: #4b5d73;
}

@media only screen and (max-width: 425px) {
  .mycard {
    width: 48%;
    margin-top: 12px;
  }
  .row {
    justify-content: space-around !important;
  }
}
</style>
