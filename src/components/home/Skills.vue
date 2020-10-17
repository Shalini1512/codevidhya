<template>
  <div class="container d-md-flex justify-content-center">
    <div class="w-100 d-md-flex align-items-center flex-column content-wrapper" style="padding-bottom:20px;">
      <h2 class="mb-4">
        Teaching Necessary 21
        <sup>st</sup>
        Century Skills To The Young Generation
      </h2>
      <div class="home-card-part d-flex justify-content-center cards-container">
        
      <div>
        <div class="home-card-part-image">
          <a href="/live-course/enter_the_world_of_web_development">
            <img src="/assets/images/png/html.svg" class="img-fluid" />
          </a>
        </div>
        <div>HTML & CSS</div>
      </div>
    
      <div>
        <div class="home-card-part-image">
          <a href="/live-course/showcase_your_web_skills">
            <img src="/assets/images/png/javascript.svg" class="img-fluid" />
          </a>
        </div>
        <div>JavaScript</div>
      </div>

      <div>
        <div class="home-card-part-image">
          <a href="/live-course/scratch_that_gamify_it">
            <img src="/assets/images/png/scratch.svg" class="img-fluid" />
          </a> 
        </div>
        <div>Scratch</div>
      </div>

      <div>
        <div class="home-card-part-image">
          <a href="/live-course/python_the_beginning">
            <img src="/assets/images/png/python.svg" class="img-fluid" />
          </a>
        </div>
        <div>Python</div>
      </div>
        <!--  -->
        <!-- <div>
          <div class="home-card-part-image">
            <img src="/assets/images/png/robotics.svg" class="img-fluid" />
          </div>
          <div>Robotics</div>
        </div>
        <div>
          <div class="home-card-part-image">
            <img src="/assets/images/png/database.svg" class="img-fluid" />
          </div>
          <div>Database</div>
        </div> -->
      </div>
      <div class="row text-center mt-2">
      <TrialButton />
    </div>
    </div>
    
  </div>
</template>
<script>
import TrialButton from '@/components/BookTrialButton/BookTrialShareButton.vue';
export default {
  components: { TrialButton },
}
</script>
<style lang="scss" scoped>
.content-wrapper {
  margin-top: 32px;
  padding: 48px 24px;
  background: #fff;
  border-radius: 16px;
}

.cards-container {
  > div {
    padding: 24px 16px;
    border-radius: 8px;
    transition: all 1000ms;
    &:hover {
      border-top-left-radius: 48px;
      background: rgba(0, 141, 210, 1);
      color: #fff;
    }
  }
}
</style>
