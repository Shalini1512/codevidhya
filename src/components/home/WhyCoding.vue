<template>
  <section class="sptb mt-4 pt-6 pb-6">
    <div
      class="container"
      :style="
        'background:#fafafa;padding-left:.12rem;padding-right:.12rem'
        "
    >
      <div class="section-title center-block text-center pt-6">
        <h2 class="mb-2">Why Coding?</h2>
      </div>
      <div
        :class="
          'row justify-content-between ' +
            [!demoschedule ? 'px-6' : '']
        "
      >
        <div class="mycard" @click="$router.push('/why-coding')">
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
                  <h4 class="mb-4">Coding is the <b>New Literacy</b></h4>
                  <!-- <p class="text-muted mb-0">
                    Lorem ipsum dolor sit amet
                  </p>-->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="mycard"
          @click="$router.push('/why-coding')"
          :style="!demoschedule? 'margin-left:auto;' : ''"
        >
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
                  <!--<p class="step mb-2">BBB</p>-->
                  <h4 class="mb-4">
                    Helps kids to become <b>Creators versus Consumers</b> of
                    Technology
                  </h4>
                  <!--<p class="text-muted mb-0">
                    Lorem ipsum dolor sit amet
                  </p>-->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="mycard"
          @click="$router.push('/why-coding')"
          :style="!demoschedule ? 'margin-left:auto;' : ''"
        >
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
                  <!--<p class="step mb-2">CCC</p>-->
                  <h4 class="mb-4">Helps <b>Improve Maths & Logic</b></h4>
                  <!-- <p class="text-muted mb-0">
                    Lorem ipsum dolor sit amet
                  </p>-->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="mycard"
          @click="$router.push('/why-coding')"
          :style="!demoschedule ? 'margin-left:auto' : ''"
        >
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
                  <!--<p class="step mb-2">CCC</p>-->
                  <h4 class="mb-4">
                    Improves <b>Thinking</b> and drives <b>Innovation</b>
                  </h4>
                  <!-- <p class="text-muted mb-0">
                    Lorem ipsum dolor sit amet
                  </p>-->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12 text-center mt-6 pb-5" v-if="!demoschedule">
          <TrialButton />
        </div>
        <div class="col-sm-12 text-center mt-4" v-else>
          <button
            class="btn btn-primary btn-pill"
            @click.prevent="$router.push('/enquiry')"
          >
            Schedule Demo
          </button>
        </div>
      </div>
    </div>
  </section>
  <!--/Section-->
</template>
<script>
import TrialButton from "@/components/BookTrialButton/BookTrialShareButton.vue";
export default {
  props: ["demoschedule"],
  components: { TrialButton },
};
</script>
<style lang="scss" scoped>
.mycard {
  width: 23%;
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
  &:hover {
    background: rgb(0, 141, 210);
    color: #fff;
    h4,
    p {
      color: rgba(255, 255, 255, 0.8) !important;
    }
  }
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
