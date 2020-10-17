<template>
  <section class="sptb">
    <div class="container">
      <div class="section-title center-block text-center">
        <h2 class="mb-4">How It Works</h2>
        <p>
          You choose the course for your students. Your students choose how they
          learn.
          <br />Students progress independently through self-directed coding
          courses in 3 easy steps:
        </p>
      </div>
      <div class="row justify-content-between">
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
                  <p class="step mb-2">Step 1</p>
                  <h4 class="mb-4">
                    Watch and Follow Instructions
                  </h4>
                  <p class="text-muted mb-0">
                    Learn to code from story based videos and content in Course.
                  </p>
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
                  <p class="step mb-2">Step 2</p>
                  <h4 class="mb-4">
                    Write Code and Play Quizzes
                  </h4>
                  <p class="text-muted mb-0">
                    Play with practical examples and quizzes in lessons.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mycard">
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
                  <p class="step mb-2">Step 3</p>
                  <h4 class="mb-4">
                    Do Assessments and Projects
                  </h4>
                  <p class="text-muted mb-0">
                    Complete the final Skill Assessment and Project for
                    Certification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mycard">
          <div class>
            <div class>
              <div class="service-card text-center">
                <div class="bg-white icon-bg icon-service text-purple about">
                  <img
                    src="/assets/images/png/howItWorks/rocket.svg"
                    alt="img"
                  />
                </div>
                <div class="servic-data mt-3">
                  <p class="step mb-2">Step 4</p>
                  <h4 class="mb-4">
                    Repeat
                  </h4>
                  <p class="text-muted mb-0">
                    Repeat the steps for every lesson.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!--/Section-->
</template>

<style lang="scss" scoped>
.mycard {
  width: 24%;
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
    justify-content: space-around!important;
  }
}
</style>
