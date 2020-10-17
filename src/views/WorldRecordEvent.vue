<template>
  <div class="home">
    <Header>
      <div>
        <div class="bannerimg">
          <div class="header-text mb-0">
            <div class="container">
              <div class="row">
                <div class="col-sm-6">
                  <div class="text-left text-white">
                    <h1 class="mt-5 title" style="font-size: 56px">
                      Codevidhya <br />Robothon
                    </h1>
                    <p>
                      Codevidhya is conducting an event to get
                      <span class="text-warning"
                        ><b
                          >India Book Of Records, Asia Book Of Records and
                          Guinness Record
                        </b></span
                      >
                      for Robotics.
                    </p>
                    <hr />
                    <h4 style="font-size:20px;">
                      <i class="far fa-calendar-alt"></i> Sunday, 22 December
                      <span style="margin-right:8px;"></span>
                      <i class="fas fa-map-marker-alt"></i> Euro International
                      School, Sikar
                    </h4>
                    <hr />
                    <router-link
                      to="/robothon/register"
                      class="btn btn-lg btn-warning m-2 mt-3"
                      >Register Now</router-link
                    >
                    <router-link
                      to="/contact"
                      class="btn btn-lg btn-warning m-2 mt-3"
                      >Get More Info</router-link
                    >
                  </div>
                </div>

                <div class="col-sm-6">
                  <div
                    class="text-left text-white text-center"
                    style="vertical-align: middle;"
                  >
                    <!--<img src="" alt="img" class="bg-white br-3 p-1 m-2 img-fluid" >-->
                    <!--<p class="text-white"> Our Partners </p>
									<img src="../assets/images/worldrecordevent/code.org.png" alt="img" class="bg-white br-3 p-1 m-2 img-fluid" style="width:70px;"> <br>
									<img src="../assets/images/worldrecordevent/media-press-dst-goi.png" alt="img" class="bg-white m-2 br-3 p-1 img-fluid" style="width:200px;"> <br>
									<img src="../assets/images/worldrecordevent/stemorg logo.png" alt="img" class="bg-white br-3 m-2 p-1 img-fluid" style="width:300px;">-->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Header>
    <!--about event section-->
    <div class="sptb">
      <div class="container">
        <div class="row justify-content-md-center">
          <div class="col-sm-6 text-center">
            <h1>About Robothon</h1>
            <span class="sectiontitle-design"><span class="icons"></span></span>
            <h4 class="mt-5">
              Codevidhya is conducting Longest Robotics Lesson conducted by any
              Organization; this is going to be a record breaking event where
              1500+ students will attend Robotics Lesson and assemble Robots.
              This three hour Robotics Lesson shall take them through basics of
              robotics, fundamentals of robotics, how robots affect our daily
              life and the world.
            </h4>
            <!--<a href="#" class="btn btn-lg btn-primary m-2 mt-5">Register Now</a>-->
          </div>

          <div class="col-sm-4 text-center p-5">
            <div class="card p-5 bg-primary text-white mx-auto">
              <h2 class="mb-0 pb-0">Who can participate?</h2>
              <hr class="mb-3 pb-0" />
              <h4 class="text-left">
                <i class="fa fa-chevron-circle-right" aria-hidden="true"></i>
                Students from Grades 6 to 10
              </h4>
              <!--<h4 class="text-left"> <i class="fa fa-chevron-circle-right" aria-hidden="true"></i> Teachers</h4>
							<h4 class="text-left"> <i class="fa fa-chevron-circle-right" aria-hidden="true"></i> School Authorities </h4>-->

              <h2 class="mt-5 pb-0">Registration Fee</h2>
              <hr class="mb-3 pb-0" />
              <h4>Rs. 500/-</h4>
              <router-link
                to="/robothon/register"
                class="btn btn-lg btn-warning m-2 mt-3"
                >Register Now</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--about event section ends here-->
    <!--section 2-->
    <section>
      <div class="sptb bg-white">
        <div class="content-text mb-0">
          <div class="container">
            <div class="section-title center-block text-center">
              <h2>What You Will Get?</h2>
              <span class="sectiontitle-design"
                ><span class="icons"></span
              ></span>
              <p class=""></p>
            </div>
            <div class="row">
              <div class="col-lg-6 text-center">
                <div class="row">
                  <div class="col-md-12">
                    <div class="widgets-cards mb-5">
                      <div class="d-flex">
                        <div class="widgets-cards-icons">
                          <div class="wrp counter-icon1 mr-5">
                            <i class="fas fa-award"></i>
                          </div>
                        </div>
                        <div class="widgets-cards-data">
                          <div class="text-wrapper text-left">
                            <h4><a href="#" class="fs-25">Certification</a></h4>
                            <p class="mt-2 mb-0">
                              Individual Certificate will be given to each
                              participant with the logo of Codevidhya, Guinness,
                              Asia and India book of Records. This is a one in a
                              million opportunity to be a part of world Record.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="widgets-cards mb-5">
                      <div class="d-flex">
                        <div class="widgets-cards-icons">
                          <div class="wrp counter-icon1 mr-5">
                            <i class="fas fa-cog"></i>
                          </div>
                        </div>
                        <div class="widgets-cards-data">
                          <div class="text-wrapper text-left">
                            <h4>
                              <a href="#" class="fs-25">Hands-on Experience</a>
                            </h4>
                            <p class="mt-2 mb-0">
                              Students will be learning and assembling robots.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="widgets-cards">
                      <div class="d-flex">
                        <div class="widgets-cards-icons">
                          <div class="wrp counter-icon1 mr-5">
                            <i class="fe fe-book-open"></i>
                          </div>
                        </div>
                        <div class="widgets-cards-data">
                          <div class="text-wrapper text-left">
                            <h4><a href="#" class="fs-25">Learning</a></h4>
                            <p class="mt-2 mb-0">
                              They will take away the learnings and enhance
                              their robotics knowledge.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <router-link
                  to="/robothon/register"
                  class="btn btn-lg btn-warning ml-auto mr-auto mt-3"
                  >Register Now</router-link
                >
              </div>
              <div class="col-lg-6 mrt-sm-2">
                <div class="clients-img ">
                  <img
                    src="../assets/images/worldrecordevent/ibr.jpg"
                    alt="img"
                    class="bg-white br-3 p-1"
                  />
                  <img
                    src="../assets/images/worldrecordevent/guiness2.jpg"
                    alt="img"
                    class="bg-white br-3 p-1"
                  />
                  <img
                    src="../assets/images/worldrecordevent/asia.jpg"
                    alt="img"
                    class="bg-white br-3 p-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- section 2 end here-->
    <!--section 2-->

    <!-- Agenda Section-->
    <!--Section-->
    <section>
      <div
        class="about-1 cover-image sptb bg-background-color"
        data-image-src="../assets/images/banners/banner2.jpg"
      >
        <div class="content-text mb-0 info">
          <div class="container">
            <div class="section-title center-block text-center text-white">
              <h1 class="text-white">Agenda</h1>
              <span class="sectiontitle-design"
                ><span class="icons"></span
              ></span>
              <p class="text-white-50">Sessions and structure of the day</p>
            </div>
            <div class="row justify-content-md-center">
              <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="card text-center service-widgets mb-lg-0">
                  <div class="card-body ">
                    <div
                      class="wrp text-primary fs-30 icon-service1 bg-primary-transparent"
                    >
                      <i class="fe fe-user"></i>
                    </div>
                    <div class="servic-data mt-3">
                      <h4 class="font-weight-semibold mb-2">Session 1</h4>
                      <h5>09:00 AM to 10:00 AM</h5>
                      <p class="text-muted mb-0">
                        Registration Verification and Badge Collection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="card text-center service-widgets mb-lg-0">
                  <div class="card-body ">
                    <div
                      class="wrp text-secondary fs-30 icon-service1 bg-secondary-transparent"
                    >
                      <i class="fe fe-volume-2"></i>
                    </div>
                    <div class="servic-data mt-3">
                      <h4 class="font-weight-semibold mb-2">Session 2</h4>
                      <h5>10:00 AM to 01:00 PM</h5>
                      <p class="text-muted mb-0">
                        Record Event <br /><br /><br />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <!--<div class="col-lg-3 col-md-6 col-sm-6">
								<div class="card text-center service-widgets mb-sm-0">
									<div class="card-body ">
										<div class="wrp text-success fs-30 icon-service1 bg-success-transparent">
											<i class="fe fe-file-text"></i>
										</div>
										<div class="servic-data mt-3">
											<h4 class="font-weight-semibold mb-2">Session 3</h4>
											<h5> From: 11:00 AM to 12:00 AM </h5>
											<p class="text-muted mb-0"></p>
										</div>
									</div>
								</div>
							</div>-->
              <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="card text-center service-widgets mb-0">
                  <div class="card-body ">
                    <div
                      class="wrp text-warning fs-30 icon-service1 bg-warning-transparent"
                    >
                      <i class="fe fe-video"></i>
                    </div>
                    <div class="servic-data mt-3">
                      <h4 class="font-weight-semibold mb-2">Session 3</h4>
                      <h5>01:00 PM to 02:00 PM</h5>
                      <p class="text-muted mb-0">
                        Refreshments, Photo Shoot, Kit Sale (Students can
                        purchase Individual Robotics Kits)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--agenda Section ends here-->

    <!--Faq section-->
    <section class="sptb">
      <div class="container">
        <h1 class="text-center">FAQ</h1>
        <div class="panel-group1" id="accordion2">
          <div class="panel panel-default mb-4 border p-0">
            <div class="panel-heading1">
              <h4 class="panel-title1">
                <a
                  class="accordion-toggle collapsed"
                  data-toggle="collapse"
                  data-parent="#accordion2"
                  href="#collapseone"
                  aria-expanded="false"
                  >1. Do I need to bring My Laptop/mobile/tablet?</a
                >
              </h4>
            </div>
            <div
              id="collapseone"
              class="panel-collapse collapse active"
              role="tabpanel"
              aria-expanded="false"
            >
              <div class="panel-body bg-white">
                <p>No.</p>
              </div>
            </div>
          </div>
          <div class="panel panel-default mb-4 border p-0">
            <div class="panel-heading1">
              <h4 class="panel-title1">
                <a
                  class="accordion-toggle collapsed"
                  data-toggle="collapse"
                  data-parent="#accordion2"
                  href="#collapsetwo"
                  aria-expanded="false"
                  >2. Do I need to Register for the event online?</a
                >
              </h4>
            </div>
            <div
              id="collapsetwo"
              class="panel-collapse collapse active"
              role="tabpanel"
              aria-expanded="false"
            >
              <div class="panel-body bg-white">
                <p>
                  Yes, it is mandatory, we also have offline desk to register at
                  these schools where you can do the payment by cash, card or by
                  UPI.
                </p>
              </div>
            </div>
          </div>
          <div class="panel panel-default mb-4 border p-0">
            <div class="panel-heading1">
              <h4 class="panel-title1">
                <a
                  class="accordion-toggle collapsed"
                  data-toggle="collapse"
                  data-parent="#accordion2"
                  href="#collapsethree"
                  aria-expanded="false"
                  >3. When will I get Certificate?</a
                >
              </h4>
            </div>
            <div
              id="collapsethree"
              class="panel-collapse collapse active"
              role="tabpanel"
              aria-expanded="false"
            >
              <div class="panel-body bg-white">
                <p>Within 1 month.</p>
              </div>
            </div>
          </div>
          <div class="panel panel-default mb-4 border p-0">
            <div class="panel-heading1">
              <h4 class="panel-title1">
                <a
                  class="accordion-toggle collapsed"
                  data-toggle="collapse"
                  data-parent="#accordion2"
                  href="#collapseFour"
                  aria-expanded="false"
                  >4. Do I need to carry my ID card?</a
                >
              </h4>
            </div>
            <div
              id="collapseFour"
              class="panel-collapse collapse active"
              role="tabpanel"
              aria-expanded="false"
            >
              <div class="panel-body bg-white">
                <p>
                  Yes, along with the admit card carry one of your ID card and a
                  passport size photo.
                </p>
              </div>
            </div>
          </div>
          <div class="panel panel-default mb-4 border p-0">
            <div class="panel-heading1">
              <h4 class="panel-title1">
                <a
                  class="accordion-toggle collapsed"
                  data-toggle="collapse"
                  data-parent="#accordion2"
                  href="#collapseFive"
                  aria-expanded="false"
                  >5. Will you provide Robotics kits?</a
                >
              </h4>
            </div>
            <div
              id="collapseFive"
              class="panel-collapse collapse active"
              role="tabpanel"
              aria-expanded="false"
            >
              <div class="panel-body bg-white">
                <p>
                  Kits will be provided to a group of students, Robotic kits
                  will be there on sale as well which you can purchase for your
                  personal use.
                </p>
              </div>
            </div>
          </div>
          <div class="panel panel-default border p-0">
            <div class="panel-heading1">
              <h4 class="panel-title1">
                <a
                  class="accordion-toggle collapsed"
                  data-toggle="collapse"
                  data-parent="#accordion2"
                  href="#collapsesix"
                  aria-expanded="false"
                  >6.Can I purchase the kit and bring there and assemble
                  myself?</a
                >
              </h4>
            </div>
            <div
              id="collapsesix"
              class="panel-collapse collapse"
              role="tabpanel"
              aria-expanded="false"
            >
              <div class="panel-body bg-white">
                <p>
                  Yes you can however it is advisable to be there in a group.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--/Faq section-->

    <!-- counting section-->

    <section>
      <div
        class="about-1 cover-image sptb bg-background-color"
        data-image-src="../assets/images/banners/banner5.jpg"
      >
        <div class="content-text mb-0 text-white info">
          <div class="container">
            <div class="row text-center">
              <div class="col-lg-3 col-md-6">
                <div class="counter-status md-mb-0">
                  <div class="counter-icon">
                    <i class="typcn typcn-group-outline"></i>
                  </div>
                  <h5>Participants</h5>
                  <h2 class="counter mb-0">1500+</h2>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
                <div class="counter-status status-1 md-mb-0">
                  <div class="counter-icon text-warning">
                    <i class="typcn typcn-mortar-board"></i>
                  </div>
                  <h5>Robotic Kits</h5>
                  <h2 class="counter mb-0">1800+</h2>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
                <div class="counter-status status md-mb-0">
                  <div class="counter-icon text-primary">
                    <i class="typcn typcn-globe-outline"></i>
                  </div>
                  <h5>Robots Made</h5>
                  <h2 class="counter mb-0">300+</h2>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
                <div class="counter-status status">
                  <div class="counter-icon text-success">
                    <i class="typcn typcn-news"></i>
                  </div>
                  <h5>Teachers Involved</h5>
                  <h2 class="counter mb-0">70+</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--/Section-->
    <!-- counting session completed-->
    <!--Contact-->
    <div class="sptb">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="card ">
              <div class="card-body">
                <div class="support">
                  <div class="row text-white">
                    <div class="col-xl-6 col-lg-12 col-md-12 border-right">
                      <div class="support-service bg-primary">
                        <i class="fa fa-phone"></i>
                        <p>Call us at</p>
                        <h6>+91 7357286330</h6>
                      </div>
                    </div>
                    <div class="col-xl-6 col-lg-12 col-md-12 ">
                      <div class="support-service bg-success">
                        <i class="far fa-envelope"></i>
                        <p>Email us at</p>
                        <h6>contact@codevidhya.com</h6>
                      </div>
                    </div>
                    <!--<div class="col-xl-4 col-lg-12 col-md-12">
														<div class="support-service bg-danger">
															<i class="fa fa-envelope-o"></i>
															<p>Working Hours!</p>
															<h6>Mon-Sat(10:00-19:00)</h6>
															
														</div>
													</div>-->
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
import Footer from "@/components/footer/Footer.vue";
export default {
  components: {
    Header,
    Footer
  }
};
</script>

<style>
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
</style>
