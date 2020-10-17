<template>
  <div>
    <Header>
      <HeaderContent />
    </Header>

    <div class="sptb bg-white">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="row">
              <div class="col-lg-6 col-md-12 text-center">
                <div class="card border-0 text-white">
                  <Tweet id="1129990531033980928">
                    <div class="spinner"></div>
                  </Tweet>
                </div>
              </div>
              <div class="col-lg-6 col-md-12 p-0">
                <!--caurusel-->
                <div class="card-body">
                  <div
                    id="carousel-captions"
                    class="carousel slide"
                    data-ride="carousel"
                  >
                    <div class="carousel-inner">
                      <div class="carousel-item active">
                        <img
                          class="d-block w-100"
                          alt
                          src="/assets/images/media/inmedia/Codevidhya-The-Hindu-BusinessLine-op.png"
                          data-holder-rendered="true"
                        />
                        <div
                          class="carousel-item-background d-none d-md-block"
                        ></div>
                        <div class="carousel-caption d-none d-md-block">
                          <!--<h3>Slide label</h3>
                          <p>Secure other greater pleasures</p>-->
                        </div>
                      </div>
                    </div>
                    <a
                      class="carousel-control-prev"
                      href="#carousel-captions"
                      role="button"
                      data-slide="prev"
                    >
                      <span
                        class="carousel-control-prev-icon"
                        aria-hidden="true"
                      ></span>
                      <span class="sr-only">Previous</span>
                    </a>
                    <a
                      class="carousel-control-next"
                      href="#carousel-captions"
                      role="button"
                      data-slide="next"
                    >
                      <span
                        class="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span class="sr-only">Next</span>
                    </a>
                  </div>
                </div>
                <!--caurusel-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--media section 1 ends -->
    <div class="sptb bg-white">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="row">
              <div class="col-lg-6 col-md-12 text-center">
                <div class="card border-0 text-white">
                  <img
                    class="d-block w-100"
                    alt
                    src="/assets/images/media/inmedia/Codevidhya-Dainik-Bhaskar-Jaipur-20th-April-2020.jpg"
                    data-holder-rendered="true"
                  />
                </div>
              </div>
              <div class="col-lg-6 col-md-12 p-0">
                <!--caurusel-->
                <div class="card-body"></div>
                <!--caurusel-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--media section 1 ends -->

    <!--media section 2-->
    <div class="sptb">
      <div class="container">
        <div class="row">
          <div class="col-sm-6">
            <div class="card p-5" style="min-height: 225px;">
              <img
                class="w-50 mb-5"
                src="/assets/images/media/inmedia/tie-silicon-logo.png"
              />
              <h4 class="text-muted">
                Codevidhya has been selected in top 5 most scalable and
                innovative startups of the nation by TIE Global TIE THE KNOT,
                CNBC Young Turks 2018.
              </h4>
            </div>
          </div>

          <div class="col-sm-6">
            <div class="card p-5" style="min-height: 225px;">
              <img
                class="w-50 mb-5"
                src="/assets/images/media/inmedia/CIO-Review-Chrismas-2018.png"
              />
              <a
                href="https://education.cioreviewindia.com/vendors/2018/1"
                target="_blank"
              >
                <h4 class="text-muted">
                  Codevidhya has been selected in top 20 most promising Edtech
                  startups of 2018 by CIO India Review Magazine.
                </h4>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- media section 2 ended-->

    <FeaturedIn />

    <Footer />
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/in-media/HeaderContent.vue";
import FeaturedIn from "@/components/home/FeaturedIn.vue";
import Footer from "@/components/footer/Footer.vue";

import { Tweet } from "vue-tweet-embed";

export default {
  name: "home",
  components: {
    Header,
    HeaderContent,
    FeaturedIn,
    Footer,
    Tweet
  },
  mounted() {}
};
</script>
