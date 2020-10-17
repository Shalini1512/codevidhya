<template>
  <div>
    <div class="bannerimg">
      <div class="header-text mb-0">
        <div class="container">
          <div class="row">
            <div
              class="col-sm-6"
              style="display: flex; flex-direction: column; justify-content: center;"
            >
              <div class="text-left text-white">
                <h1 class="header-text">Teaching Kids to {Code}</h1>
                <p>Futuristic Coding Curriculum for your School!</p>
                <div class="schDemo text-left mt-2">
                  <router-link to="/enquiry" class="btn btn-lg btn-warning btn-pill m-3"
                  >Schedule Demo</router-link
                >
                </div>
              </div>
            </div>

            <div
              class="col-sm-6"
              style="display: flex; flex-direction: column; justify-content: center;"
            >
              <div class="row">
                <div class="col-lg-4 col-md-5">
                  <div class="rscValues text-left text-white">
                    <h2 class="counter">35000+</h2>
                    <h5>Students</h5>
                  </div>
                </div>

                <div class="col-lg-3 col-md-3">
                  <div class="rscValues text-left text-white">
                    <h2 class="counter">49</h2>
                    <h5>Schools</h5>
                  </div>
                </div>

                <div class="col-lg-4 col-md-4">
                  <div class="rscValues text-left text-white">
                    <h2 class="counter">8400+</h2>
                    <h5>Training Hours</h5>
                  </div>
                </div>
              </div>
              <div class="row m-0 mt-5">
                <p>
                <a
                  class="text-warning"
                  href="https://delhi.tie.org/"
                  target="_blank"
                >
                  <i class="fas fa-globe">
                    One of the most scalable startups -TIE Global</i
                  >
                </a>
              </p>
              <p>
                <a
                  class="text-warning"
                  href="https://education.cioreviewindia.com/vendors/2018/1"
                  target="_blank"
                >
                  <i class="fas fa-globe">
                    Most promising edtech startups of 2018 -CIO Review India.</i
                  >
                </a>
              </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@media only screen and (max-width: 425px) {
  .schDemo {
    text-align: center!important;
  }
  .rscValues {
    text-align: center!important;
  }
}
</style>