<template>
  <div>
    <Header>
      <HeaderContent />
    </Header>
    <div class="row" style="background: #fff;">
      <div class="col-xl-5">
        <div class="card overflow-hidden m-0 p-0">
          <div class="card-body m-0 p-3" style="background: #f6f6f6;">
            <div class="product-slider">
              <video
                controls
                autoplay
                controlsList="nodownload"
                poster="assets/video/video_preview_poster.png"
              >
                <source src="assets/video/Codevidhya.m4v" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-7">
        <div
          class="mt-5 pt-3"
          style="
            font: normal 3rem/1.5 'Poppins';
            font-size: 38px;
            font-weight: 600;
          "
        >
          Today’s teens are the graduating class of 2025. Are we preparing them
          for the future?
        </div>
        <div class="schDemo text-center mt-2">
          <router-link to="/enquiry" class="btn btn-lg btn-primary btn-pill m-3"
            >Schedule Demo</router-link
          >
        </div>
      </div>
    </div>
    <div class="row mt-2" style="background: #fff;">
      <div class="col-xl-12 text-center" id="year-long">
        <div
          class="header-text font-semi-bold"
          style="
            font-family: 'Poppins', sans-serif;
            font-size: 2rem;
            font-weight: 600;
            padding-top: 59px;
          "
        >
          Our Year Long Programs
        </div>
      </div>
      <div class="sptb p-0 w-100">
        <div class="container">
          <div class="row h-100 justify-content-md-center">
            <!--card1-->
            <div class="col-sm-4 mt-2">
              <div
                class="card h-100 panel price panel-color br-2 overflow-hidden"
              >
                <div class="bg-white text-center h-auto">
                  <svg x="0" y="0" viewBox="0 0 360 220">
                    <g>
                      <path
                        fill="#9d37f6"
                        d="M0.732,193.75c0,0,29.706,28.572,43.736-4.512c12.976-30.599,37.005-27.589,44.983-7.061
											c8.09,20.815,22.83,41.034,48.324,27.781c21.875-11.372,46.499,4.066,49.155,5.591c6.242,3.586,28.729,7.626,38.246-14.243
											s27.202-37.185,46.917-8.488c19.715,28.693,38.687,13.116,46.502,4.832c7.817-8.282,27.386-15.906,41.405,6.294V0H0.48
											L0.732,193.75z"
                      />
                    </g>
                    <text
                      x="60"
                      transform="matrix(1 0 0 1 54 116.2686)"
                      fill="#fff"
                      font-size="30.4489"
                    >
                      CV Basic
                    </text>
                  </svg>
                </div>
                <div class="panel-body text-center" style="height:auto;">
                  <h4 class>
                    <strong>Offering</strong>
                  </h4>
                </div>
                <ul class="list-group list-group-flush text-center h-100">
                  <li class="list-group-item">Learn By Doing Books</li>
                  <li class="list-group-item">Hour of Code</li>
                  <li class="list-group-item">Annual Project Support</li>
                  <li class="list-group-item">Teachers</li>
                  <li class="list-group-item">Mentorship</li>
                  <li class="list-group-item">Support</li>
                </ul>
                <div class="panel-footer text-center">
                  <router-link
                    to="/enquiry"
                    class="btn btn-lg btn-primary btn-block"
                  >
                    Schedule Demo
                  </router-link>
                </div>
              </div>
            </div>
            <!--end card1-->
            <!--card2-->
            <div class="col-sm-4 mt-2">
              <div
                class="card h-100 panel price panel-color br-2 overflow-hidden"
              >
                <div class="bg-white text-center h-auto">
                  <svg x="0" y="0" viewBox="0 0 360 220">
                    <g>
                      <path
                        fill="#ffa22b"
                        d="M0.732,193.75c0,0,29.706,28.572,43.736-4.512c12.976-30.599,37.005-27.589,44.983-7.061
                      c8.09,20.815,22.83,41.034,48.324,27.781c21.875-11.372,46.499,4.066,49.155,5.591c6.242,3.586,28.729,7.626,38.246-14.243
                      s27.202-37.185,46.917-8.488c19.715,28.693,38.687,13.116,46.502,4.832c7.817-8.282,27.386-15.906,41.405,6.294V0H0.48
                      L0.732,193.75z"
                      />
                    </g>
                    <text
                      x="80"
                      transform="matrix(1 0 0 1 28 116.2686)"
                      fill="#fff"
                      font-size="30.4489"
                    >
                      CV Lite
                    </text>
                  </svg>
                </div>
                <div class="panel-body text-center" style="height:auto;">
                  <h4 class>
                    <strong>Offering</strong>
                  </h4>
                </div>
                <ul class="list-group list-group-flush text-center h-100">
                  <li class="list-group-item">Learn By Doing Books</li>
                  <li class="list-group-item">CV Platform Access</li>
                  <li class="list-group-item">Hour of Code</li>
                  <li class="list-group-item">Annual Project Support</li>
                </ul>
                <div class="panel-footer text-center">
                  <router-link
                    to="/enquiry"
                    class="btn btn-lg btn-primary btn-block"
                  >
                    Schedule Demo
                  </router-link>
                </div>
              </div>
            </div>
            <!--end card2-->
            <!--card3-->
            <div class="col-sm-4 mt-2">
              <div
                class="card h-100 panel price panel-color br-2 overflow-hidden"
              >
                <div class="bg-white text-center h-auto">
                  <svg x="0" y="0" viewBox="0 0 360 220">
                    <g>
                      <path
                        fill="#22a5e0"
                        d="M0.732,193.75c0,0,29.706,28.572,43.736-4.512c12.976-30.599,37.005-27.589,44.983-7.061
                      c8.09,20.815,22.83,41.034,48.324,27.781c21.875-11.372,46.499,4.066,49.155,5.591c6.242,3.586,28.729,7.626,38.246-14.243
                      s27.202-37.185,46.917-8.488c19.715,28.693,38.687,13.116,46.502,4.832c7.817-8.282,27.386-15.906,41.405,6.294V0H0.48
                      L0.732,193.75z"
                      />
                    </g>
                    <text
                      x="0"
                      transform="matrix(1 0 0 1 84 116.2686)"
                      fill="#fff"
                      font-size="30.4489"
                    >
                      <tspan x="10">CV Premium</tspan>
                    </text>
                  </svg>
                </div>
                <div class="panel-body text-center" style="height:auto;">
                  <h4 class>
                    <strong>Offering</strong>
                  </h4>
                </div>
                <ul class="list-group list-group-flush text-center h-100">
                  <li class="list-group-item">Learn By Doing Books</li>
                  <li class="list-group-item">CV Platform Access</li>
                  <li class="list-group-item">
                    Access to all Online Tools & Resources
                  </li>
                  <li class="list-group-item">Hour of Code</li>
                  <li class="list-group-item">
                    Live Sessions for Teachers Live Sessions for Teachers
                  </li>
                  <li class="list-group-item">Annual Project Mentorship</li>
                  <li class="list-group-item">
                    Program Monitoring and Support
                  </li>
                </ul>
                <div class="panel-footer text-center">
                  <router-link
                    to="/enquiry"
                    class="btn btn-lg btn-primary btn-block"
                  >
                    Schedule Demo
                  </router-link>
                </div>
              </div>
            </div>
            <!--end card3-->
          </div>
        </div>
      </div>
    </div>
    <!--testimonials -->
    <WhyCoding :demoschedule="demoschedule" style="background: #fafafa;" />
    <OurCustomers :demoschedule="demoschedule" />
    <TestimonialsTabbed
      demoschedule="demoschedule"
      style="background: #fafafa;"
    />

    <!-- featured in section-->
    <FeaturedIn :demoschedule="demoschedule" />
    <!-- featured in section ends here-->

    <!--Contact-->
    <div class="sptb mt-2" style="background: #fff;">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-body">
                <div class="support">
                  <div class="row text-white">
                    <div class="col-xl-4 col-lg-12 col-md-12 border-right">
                      <div class="support-service bg-primary">
                        <i class="fas fa-phone"></i>
                        <p>Call us at</p>
                        <h6 style="font-size: 18px;">+91 7357286330</h6>
                      </div>
                    </div>
                    <div class="col-xl-4 col-lg-12 col-md-12 border-right">
                      <div class="support-service bg-success">
                        <i class="fas fa-envelope"></i>
                        <p>Email us at</p>
                        <h6 style="font-size: 18px;">contact@codevidhya.com</h6>
                      </div>
                    </div>
                    <div class="col-xl-4 col-lg-12 col-md-12">
                      <div class="support-service bg-danger">
                        <i class="far fa-clock"></i>
                        <p>Working Hours!</p>
                        <h6 style="font-size: 18px;">Mon-Sat(10:00-19:00)</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12 text-center">
          <button
            class="btn btn-primary btn-pill"
            @click.prevent="$router.push('/enquiry')"
          >
            Schedule Demo
          </button>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/for-schools/HeaderContent.vue";
import TestimonialsTabbed from "@/components/home/TestimonialsTabbed.vue";
import FeaturedIn from "@/components/home/FeaturedIn.vue";
import OurCustomers from "@/components/home/OurCustomers.vue";
import Footer from "@/components/footer/Footer.vue";
import WhyCoding from "@/components/home/WhyCoding.vue";
import TrialButton from "@/components/BookTrialButton/BookTrialShareButton.vue";

export default {
  name: "ForSchool",
  components: {
    Header,
    HeaderContent,
    TestimonialsTabbed,
    FeaturedIn,
    OurCustomers,
    WhyCoding,
    Footer,
    TrialButton,
  },
  data() {
    return {
      demoschedule: 1,
    };
  },
  mounted() {
    this.scrollMethod();
  },
  methods: {
    scrollMethod() {
      if (window.location.hash) {
        let data = window.location.hash.substring(1);
        let x = document.getElementById(data);
        x.scrollIntoView();
      }
    },
  },
};
</script>
