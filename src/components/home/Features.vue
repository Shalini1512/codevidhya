<template>
  <section class="sptb pt-6 pb-6">
    <div class="container">
      <div class="row">
        <div class="col-lg-3 col-md-6 my-2">
          <div class="mycard">
            <div class="d-flex flex-column align-items-center">
              <div class="icon">
                <span class="icon-service1 icon-primary fs-35">
                  <i class="fe fe-layers"></i>
                </span>
              </div>
              <div>
                <h3 class="mb-2 font-weight-bold text-center">
                  Learning by Doing
                </h3>
                <p class="text-muted mb-0 text-center">
                  Courses come with practical examples that you can edit and
                  run.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 my-2">
          <div class="mycard">
            <div class="d-flex flex-column align-items-center">
              <div class="icon">
                <span class="icon-service1 icon-secondary fs-35">
                  <i class="fe fe-book"></i>
                </span>
              </div>
              <div class="mt-1">
                <h3 class="mb-2 font-weight-bold text-center">
                  Self Directed Coding
                </h3>
                <p class="text-muted mb-0 text-center">
                  Courses are specifically designed for kids by IITians & STEM
                  Educators.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 my-2">
          <div class="mycard">
            <div class="d-flex flex-column align-items-center">
              <div class="icon">
                <span class="icon-service1 icon-success fs-35">
                  <i class="fe fe-users"></i>
                </span>
              </div>
              <div class="mt-1">
                <h3 class="mb-2 font-weight-bold text-center">Live Support</h3>
                <p class="text-muted mb-0 text-center">
                  Dedicated support team to ensure hassle free learning
                  experience.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 my-2">
          <div class="mycard">
            <div class="d-flex flex-column align-items-center">
              <div class="icon">
                <span class="icon-service1 icon-warning fs-35">
                  <i class="fe fe-file-text"></i>
                </span>
              </div>
              <div class="mt-1">
                <h3 class="mb-2 font-weight-bold text-center">Certification</h3>
                <p class="text-muted mb-0 text-center">
                  Become a Codevidhya certified coder by completing assessments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.mycard {
  padding: 56px 8px;
  background: #fff;
  border-radius: 8px;
  border-top-left-radius: 64px;
  transition: all 500ms;
  h3,
  p {
    color: #212121;
    transition: all 500ms;
  }
  &:hover {
    background: rgb(0, 141, 210);
    color: #fff;
    h3,
    p {
      color: rgba(255, 255, 255, 0.8) !important;
    }
  }
  .icon {
    margin-bottom: 32px;
  }
}
</style>
