<template>
  <div class="home">
    <Header />
    <Banner />
    <Skills />
    <FeaturedCourses />
    <WhyCoding />
    <WhyUs />
    <!--Gallery /-->
    <!--Features /-->

    <!--Statistics /-->
    <!--Subscribe /-->
    <!--HowItWorks /-->
    <!--SignUp /-->
    <TestimonialsTabbed />
    <!-- Blog /-->
    <FeaturedIn />
    <!--<FeaturedProjects />-->
    <Footer />

    <div id="learn-at-home-modal" class="cv-modal medium">
      <div>
        <h3 class="text-center">CV LIVE</h3>
        <img
          class="img-responsive"
          src="/assets/images/live-class-trial/liveClass.jpg"
        />
        <p v-if="userFullName">Welcome, {{ userFullName }}.</p>
        <p>   We bring you 'Codevidhya Live Coding Classes' for digital classroom
          where you can start 1:1 learning with your trainer.
       </p>
        <p>
       
          <span style="font-size: 24px;">Book Your Free Trial Now!</span>
        </p>
        <p class="pb-1">Learning in the safety of your home!</p>
        <div id="footer" class="d-flex flex-row justify-content-center">
          <button class="btn btn-primary btn-pill" @click="handleRegisterLearnAtHomeClicked">
            Book Now
          </button>
        </div>
        <div class="text-center mt-4">
          <button class="btn  btn-link" @click="handleCloseLearnAtHomeClicked">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import Header from "@/components/header/SingleRowHeader.vue";
import Header from '@/components/header/CodevidhyaNewHeader.vue'
import Banner from '@/components/home/Banner.vue'
import Gallery from '@/components/home/Gallery.vue'
import Skills from "@/components/home/Skills.vue"
import Features from '@/components/home/Features.vue'
import FeaturedProjects from '@/components/home/FeaturedProjects.vue'
import Statistics from '@/components/home/Statistics.vue'
import FeaturedCourses from '@/components/home/FeaturedCourses.vue'
import Subscribe from '@/components/home/Subscribe.vue'
import HowItWorks from '@/components/home/HowItWorks.vue'
import WhyCoding from '@/components/home/WhyCoding.vue'
import WhyUs from '@/components/home/WhyUs.vue'
// import SignUp from "@/components/home/SignUp.vue";
import TestimonialsTabbed from '@/components/home/TestimonialsTabbed.vue'
// import Blog from "@/components/home/Blog.vue";
import FeaturedIn from '@/components/home/FeaturedIn.vue'
import Footer from '@/components/footer/Footer.vue'
export default {
  name: 'home',
  components: {
    Header,
    Banner,
    Gallery,
    Features,
    FeaturedProjects,
    Statistics,
    FeaturedCourses,
    Subscribe,
    HowItWorks,
    WhyCoding,
    WhyUs,
    Skills,
    // SignUp,
    TestimonialsTabbed,
    // Blog,
    FeaturedIn,
    Footer,
  },
  computed: {
    userFullName() {
      return this.$store.getters.getAuthData.auth_user_full_name
    },
  },
  mounted() {
      if (window.localStorage.getItem("shownLearnAtHomeModal") !== "true")
    showModal('learn-at-home-modal')
  },
  methods: {
    handleRegisterLearnAtHomeClicked() {
      window.localStorage.setItem('shownLearnAtHomeModal', 'true')
      this.$router.push('/live-demo-session/request')
    },
    handleCloseLearnAtHomeClicked() {
      window.localStorage.setItem('shownLearnAtHomeModal', 'true')
      hideModal('learn-at-home-modal')
    },
  },
}
</script>

<style lang="scss">
.home-card-2 {
  padding: 48px 36px;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 20px 31px 0 rgba(0, 0, 0, 0.16), 0 0 20px 0 rgba(0, 0, 0, 0.04);
}
.home-card-part {
  flex-wrap: wrap;
  padding-top: 16px;
}
.home-card-part > div {
  display: flex;
  flex-direction: column;
  padding: 16px 8px;
  flex-grow: 1;
  max-width: 150px;
  align-items: center;
}
.home-card-part > div > div {
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
}
.home-card-part-image {
  width: 100%;
  height: auto;
  margin-bottom: 20px;
}
.home-card-part-image img {
  width: 60%;
}
.image-section {
  padding: 18px 0;
  z-index: 5;
  position: relative;
}
.image-section div {
  display: inline-block;
  margin: 6px 0.5%;
  width: 23.5%;
  height: 180px;
  border-radius: 4px;
  overflow: hidden;
}

#learn-at-home-modal {
  & > div {
    padding: 0 16px 16px;
    overflow: auto;
  }
  h3 {
    padding: 24px 0 16px;
    font-display: 'Poppins';
    font-weight: bold;
  }
  img {
    display: block;
    width: 300px;
    margin: 0 auto 16px;
    border-radius: 8px;
  }

  p {
    padding: 0 0 16px;
    font-size: 1rem;
    text-align: center;
  }

  .btn-link {
    color: #212121;
  }
}
</style>
