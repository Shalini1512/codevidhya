<template>
  <div>
    <Header>
      <HeaderContent />
    </Header>
    <Statistics />

    <!--div class="sptb mt-0 pt-0">
      <div class="container mt-0 pt-0">
        <div class="row text-center justify-content-md-center">
          <div class="col-sm-12">
            <h1>Get Started</h1>
          </div>
          <div class="col-lg-3 col-md-4 item-all-cat">
            <div class="item-all-card text-dark text-center card mb-5">
              <a href="https://studio.codevidhya.com/login"></a>
              <div class="iteam-all-icon">
                <img src="/assets/images/svg/user.svg" class="imag-service" alt="Sales" />
                <h5 class="text-body font-weight-bold mb-2 mt-2">Sign up or Log in.</h5>
              </div>
              <div class="item-all-text mt-2">
                <button class="btn btn-primary btn-pill">Sign Up</button>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-4 item-all-cat">
            <div class="item-all-card text-dark text-center card mb-5">
              <router-link to="/courses"></router-link>
              <div class="iteam-all-icon">
                <img src="/assets/images/svg/upload.svg" class="imag-service" alt="Sales" />
                <h5 class="text-body font-weight-bold mb-2 mt-2">Choose Course.</h5>
              </div>
              <div class="item-all-text mt-2">
                <button class="btn btn-secondary btn-pill">View Courses</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div-->
    <!--steps section completed-->

    <Courses />

    <!--future ready section-->
    <div class="sptb">
      <div class="container">
        <div class="row text-center justify-content-md-center">
          <div class="col-sm-12">
            <h1>Want to be Future Ready?</h1>
          </div>
          <div class="item-all-cat col-lg-3 col-md-6">
            <div
              class="item-all-card text-dark text-center card mb-5 bg-transparent"
              style="border:none; box-shadow: none;"
            >
              <div class="iteam-all-icon">
                <img
                  src="/assets/images/svg/d1.svg"
                  class="imag-service mb-3"
                  alt="Sales"
                />
                <h3 class="text-body font-weight-bold mb-2 mt-2">
                  Sharpen Logical Thinking and Computational Thinking Skills
                </h3>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 item-all-cat">
            <div
              class="item-all-card text-dark text-center card mb-5 bg-transparent"
              style="border:none; box-shadow: none;"
            >
              <div class="iteam-all-icon">
                <img
                  src="/assets/images/svg/d2.svg"
                  class="imag-service mb-3"
                  alt="Sales"
                />
                <h3 class="text-body font-weight-bold mb-2 mt-2">
                  Be a Problem Solver
                </h3>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 item-all-cat">
            <div
              class="item-all-card text-dark text-center card mb-5 bg-transparent"
              style="border:none; box-shadow: none;"
            >
              <div class="iteam-all-icon">
                <img
                  src="/assets/images/svg/d3.svg"
                  class="imag-service mb-3"
                  alt="Sales"
                />
                <h3 class="text-body font-weight-bold mb-2 mt-2">
                  Hone your 21st Century Skills
                </h3>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 item-all-cat">
            <div
              class="item-all-card text-dark text-center card mb-5 bg-transparent"
              style="border:none; box-shadow: none;"
            >
              <div class="iteam-all-icon">
                <img
                  src="/assets/images/svg/d4.svg"
                  class="imag-service mb-3"
                  alt="Sales"
                />
                <h3 class="text-body font-weight-bold mb-2 mt-2">
                  Create and Innovate
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- future ready section ends-->

    <!--Potential Impact-->
    <div class="sptb bg-white">
      <div class="container">
        <div class="row text-center justify-content-md-center">
          <div class="col-sm-12">
            <h1>Potential Impact</h1>
            <h5 class="py-3" style="line-height:1.4">
              If students, as young as 6, start to learn coding and Computer Science with Codevidhya, they are way beyond Computer Science graduates. Codevidhya learning path provides futuristic programming languages with practical knowledge. Students who are learning with Codevidhya are starting their entrepreneur journey at just the age of 16. Even a little coding knowledge could:
            </h5>
          </div>
          <div class="item-all-cat col-lg-3 col-md-6">
            <div
              class="item-all-card text-dark text-center card mb-5 bg-white"
              style="border:none; box-shadow: none;"
            >
              <div class="iteam-all-icon">
                <img
                  src="/assets/images/svg/p1.svg"
                  class="imag-service mb-3"
                  alt="Sales"
                />
                <h3 class="text-body font-weight-bold mb-2 mt-2">
                  Empower the young generation to well-paying jobs and internships.
                </h3>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 item-all-cat">
            <div
              class="item-all-card text-dark text-center card mb-5 bg-white"
              style="border:none; box-shadow: none;"
            >
              <div class="iteam-all-icon">
                <img
                  src="/assets/images/svg/p2.svg"
                  class="imag-service mb-3"
                  alt="Sales"
                />
                <h3 class="text-body font-weight-bold mb-2 mt-2">
                  Help students start their career just after graduation or even before it.
                </h3>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 item-all-cat">
            <div
              class="item-all-card text-dark text-center card mb-5 bg-white"
              style="border:none; box-shadow: none;"
            >
              <div class="iteam-all-icon">
                <img
                  src="/assets/images/svg/p3.svg"
                  class="imag-service mb-3"
                  alt="Sales"
                />
                <h3 class="text-body font-weight-bold mb-2 mt-2">
                  Elevate living standards and opportunities of disadvantaged youth.
                </h3>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 item-all-cat">
            <div
              class="item-all-card text-dark text-center card mb-5 bg-white"
              style="border:none; box-shadow: none; background: #fff;"
            >
              <div class="iteam-all-icon">
                <img
                  src="/assets/images/svg/p4.svg"
                  class="imag-service mb-3"
                  alt="Sales"
                />
                <h3 class="text-body font-weight-bold mb-2 mt-2">
                  Inspire youth for entrepreneurship.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Potential Impact ends here-->

    <TestimonialsTabbed />

    <!-- featured in section-->
    <FeaturedIn />
    <!-- featured in section ends here-->

    <!--Contact-->
    <div class="sptb">
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <div class="card">
              <div class="card-body">
                <div class="support">
                  <div class="row text-white">
                    <div class="col-xl-4 col-lg-12 col-md-12 border-right">
                      <div class="support-service bg-primary">
                        <i class="fas fa-phone"></i>
                        <p>Call us at</p>
                        <h6 style="font-size:18px">+91 7357286330</h6>
                      </div>
                    </div>
                    <div class="col-xl-4 col-lg-12 col-md-12 border-right">
                      <div class="support-service bg-success">
                        <i class="fas fa-envelope"></i>
                        <p>Email us at</p>
                        <h6 style="font-size:18px">contact@codevidhya.com</h6>
                      </div>
                    </div>
                    <div class="col-xl-4 col-lg-12 col-md-12">
                      <div class="support-service bg-danger">
                        <i class="far fa-clock"></i>
                        <p>Working Hours!</p>
                        <h6 style="font-size:18px">Mon-Sat(10:00-19:00)</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--/Contact-->

    <Footer />
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/for-parents/HeaderContent.vue";
import Statistics from "@/components/for-parents/Statistics.vue";
import Courses from "@/components/courses/Courses.vue";
import TestimonialsTabbed from "@/components/home/TestimonialsTabbed.vue";
import FeaturedIn from "@/components/home/FeaturedIn.vue";
import Footer from "@/components/footer/Footer.vue";
export default {
  name: "home",
  components: {
    Header,
    HeaderContent,
    Statistics,
    Courses,
    TestimonialsTabbed,
    FeaturedIn,
    Footer
  }
};
</script>
