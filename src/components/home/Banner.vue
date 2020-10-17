<template>
  <section id="home-banner">
    <div class>
      <div class="header-text">
        <div class="container">
          <div
            id="carousel-controls"
            class="carousel slide"
            data-ride="carousel"
            style="height:400px;"
          >
            <div class="carousel-inner">
              <div class="carousel-item active">
                <div class="row mb-0 pb-0">
                  <div
                    class="col-md-6"
                    style="display: flex; flex-direction: column; justify-content: center"
                  >
                    <div class="text-left text-white mb-6 pl-5 mt-3">
                      <!--  <a href="" class="typewrite" data-period="2000" data-type='[ "Code to Decode your Future" ]'>
                        <span class="wrap"></span>
                      </a>-->
                      <img
                        src="/assets/images/svg/LiveClass/Mockup_B.png"
                        class=".img-fluid mx-auto d-block"
                        width="560"
                      />
                      <div class="text-center">
                        <!--<router-link 
                        to="/live-trial-class/request"
                        class="cv-button col-sm-4 gradient-corner" style="margin-left:40%;"
                        >Enquiry Now</router-link>-->
                        <router-link to="/live-demo-session/request">
                          <img
                            src="/assets/images/svg/LiveClass/button_book.png"
                            class=".img-fluid mx-auto d-block cursor-pointer"
                            width="140"
                          />
                        </router-link>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 px-5">
                    <img
                      src="/assets/images/svg/LiveClass/Mockup_B.svg"
                      class=".img-fluid mx-auto d-block"
                      width="420"
                    />
                  </div>
                </div>
              </div>
              <div class="carousel-item">
                <div class="row">
                  <div
                    class="col-md-7"
                    style="display: flex; flex-direction: column; justify-content: center"
                  >
                    <div class="text-left text-white mb-6 px-5">
                      <!--  <a href="" class="typewrite" data-period="2000" data-type='[ "Code to Decode your Future" ]'>
                        <span class="wrap"></span>
                      </a>-->
                      <h2
                        class="mb-2 font-primary font-bold"
                        style="font-size: 2.4rem;"
                      >Code to Decode your Future</h2>
                      <p class="font-primary font-light fs-large">
                        Codevidhya equips students age 6 to 16 with programming skills
                        to hone their <span style="font-weight: 800;">Computational Thinking & Problem Solving</span>
                        abilities to ensure success in the Digital Economy.
                      </p>
                    </div>
                    <div class="btn-list align-self-start px-5">
                      <router-link to="/live-courses" class="cv-button btn-primary gradient-corner">EXPLORE COURSES</router-link>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <img
                      src="/assets/images/svg/Kid-with-Robot.svg"
                      class=".img-fluid mx-auto d-block"
                      width="350"
                    />
                  </div>
                </div>
              </div>
            </div>
            <a
              class="carousel-control-prev m-0 p-0"
              href="#carousel-controls"
              role="button"
              data-slide="prev"
              style="width:48px"
            >
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
            </a>
            <a
              class="carousel-control-next m-0 p-0"
              href="#carousel-controls"
              role="button"
              data-slide="next"
              style="width:48px"
            >
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
            </a>
          </div>
        </div>
        <div class="text-center"></div>
      </div>
      <!-- /header-text -->
    </div>
  </section>
</template>

<style lang="scss" scoped>
#home-banner {
  padding-top: calc(56px + 32px);
  background: rgb(0, 141, 210);
}
.btn-list {
  a:hover {
    color: #fff;
  }
}

@media only screen and (max-width: 991px) {
  .sptb-4 {
  }
}
</style>
