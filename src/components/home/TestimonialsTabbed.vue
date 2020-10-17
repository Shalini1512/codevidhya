<template>
  <div class="sptb mt-0  pt-0 mb-0 pb-4">
    <div
      class="container"
      :style="
        !demoschedule && demoschedule != 1
          ? 'background:#fafafa;padding-left:.12rem;padding-right:.12rem;'
          : ' '
      "
    >
      <div :class="'row justify-content-between '+[!demoschedule && demoschedule != 1? 'px-6':'']">
        <div class="section-title col-sm-12 text-center pb-0 pt-6">
          <h2>Testimonials</h2>
        </div>
        <div class="card-body items-gallery">
          <div class="items-blog-tab text-center">
            <!--<div class="items-blog-tab-heading row mb-0">
              <div class="col-12">
                <ul class="nav items-blog-tab-menu">
                  <li class>
                    <a href="#tab-11" class="active show" data-toggle="tab"
                      >Parents</a
                    >
                  </li>
                  <li>
                    <a href="#tab-22" data-toggle="tab" class>Students</a>
                  </li>
                  <li>
                        <a href="#tab-33" data-toggle="tab" class>Principals</a>
                      </li>
               </ul>
              </div>
            </div>-->
            <div class="tab-content">
              <div
                v-if="!demoschedule && demoschedule != 1"
                :class="
                  'tab-pane ' + !demoschedule && demoschedule != 1
                    ? 'active'
                    : ''
                "
                id="tab-11"
              >
                <div class="row justify-content-between">
                  <!--one testimonial block-->
                  <div class="card">
                    <div class="card-body">
                      <div class="team-section text-center">
                        <div class="team-img">
                          <img
                            src="/assets/images/users/male/parent.svg"
                            class="img-thumbnail rounded-circle alt="
                            alt="img"
                          />
                        </div>
                        <h4 class="font-weight-bold dark-grey-text mt-4">
                          Sumit Pareek
                        </h4>
                        <h6 class="font-weight-bold blue-text">Parent</h6>
                        <p class="font-weight-normal dark-grey-text mt-4">
                          <i class="fas fa-quote-left pr-2"></i>
                          I am more than happy that my 7 year old little girl
                          can create stories and games. She has become an expert
                          at operating a computer now. Thank you Codevidhya for
                          making my kid so creative.
                        </p>
                        <div class="text-warning">
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--one testimonial block ended-->
                  <!--one testimonial block-->
                  <div class="card">
                    <div class="card-body">
                      <div class="team-section text-center">
                        <div class="team-img">
                          <img
                            src="/assets/images/users/female/parent.svg"
                            class="img-thumbnail rounded-circle alt="
                            alt="img"
                          />
                        </div>
                        <h4 class="font-weight-bold dark-grey-text mt-4">
                          Priya Jain
                        </h4>
                        <h6 class="font-weight-bold blue-text">Parent</h6>
                        <p class="font-weight-normal dark-grey-text mt-4">
                          <i class="fas fa-quote-left pr-2"></i>
                          I was wishing to create my own website for myself.
                          Some of the developers out there were asking a lot for
                          a few simple pages. My 12 year old did it in a jiffy.
                          Awesome work, Codevidhya. I am thoroughly impressed.
                        </p>
                        <div class="text-warning">
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--one testimonial block ended-->
                  <!--one testimonial block-->
                  <div class="card">
                    <div class="card-body">
                      <div class="team-section text-center">
                        <div class="team-img">
                          <img
                            src="/assets/images/users/male/parent.svg"
                            class="img-thumbnail rounded-circle alt="
                            alt="img"
                          />
                        </div>
                        <h4 class="font-weight-bold dark-grey-text mt-4">
                          Hemant Rawat
                        </h4>
                        <h6 class="font-weight-bold blue-text">Parent</h6>
                        <p class="font-weight-normal dark-grey-text mt-4">
                          <i class="fas fa-quote-left pr-2"></i>
                          We as parents have seen a lot of difference in the way
                          our child approaches technology and in her awareness.
                          Thank you codevidhya for making this happen.
                        </p>
                        <div class="text-warning">
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--one testimonial block ended-->
                </div>
              </div>
              <div class="tab-pane" id="tab-22">
                <div class="row justify-content-between">
                  <!--one testimonial block-->
                  <div class="card">
                    <div class="card-body">
                      <div class="team-section text-center">
                        <div class="team-img">
                          <img
                            src="/assets/images/users/female/student.svg"
                            class="img-thumbnail rounded-circle alt="
                            alt="img"
                          />
                        </div>
                        <h4 class="font-weight-bold dark-grey-text mt-4">
                          Ivanshika
                        </h4>
                        <h6 class="font-weight-bold blue-text">
                          Student
                        </h6>
                        <p class="font-weight-normal dark-grey-text mt-4">
                          <i class="fas fa-quote-left pr-2"></i>
                          It is AWESOME I LOVE IT. It is really interesting. I
                          sat at my computer 3 hrs. straight and couldn't get my
                          eyes off of it until my parents told me it was enough.
                          . THANKS FOR MAKING CODEVIDHYA!!!
                        </p>
                        <div class="text-warning">
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star-half-full"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--one testimonial block ended-->

                  <!--one testimonial block-->
                  <div class="card">
                    <div class="card-body">
                      <div class="team-section text-center">
                        <div class="team-img">
                          <img
                            src="/assets/images/users/female/student.svg"
                            class="img-thumbnail rounded-circle alt="
                            alt="img"
                          />
                        </div>
                        <h4 class="font-weight-bold dark-grey-text mt-4">
                          Sonu Siyak
                        </h4>
                        <h6 class="font-weight-bold blue-text">
                          Student
                        </h6>
                        <p class="font-weight-normal dark-grey-text mt-4">
                          <i class="fas fa-quote-left pr-2"></i>
                          Codevidhya is amazing! I found it very useful. I am
                          very thankful to Codevidhya and my computer teachers
                          that they made us aware about coding.
                        </p>
                        <div class="text-warning">
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--one testimonial block ended-->

                  <!--one testimonial block-->
                  <div class="card">
                    <div class="card-body">
                      <div class="team-section text-center">
                        <div class="team-img">
                          <img
                            src="/assets/images/users/male/student.svg"
                            class="img-thumbnail rounded-circle alt="
                            alt="img"
                          />
                        </div>
                        <h4 class="font-weight-bold dark-grey-text mt-4">
                          Shubham
                        </h4>
                        <h6 class="font-weight-bold blue-text">
                          Student
                        </h6>
                        <p class="font-weight-normal dark-grey-text mt-4">
                          <i class="fas fa-quote-left pr-2"></i>
                          I started learning codevidhya at school and now my
                          problem solving is faster and I can help myself with
                          technical things. Thank you codevidhya for the simple
                          and strong learning.
                        </p>
                        <div class="text-warning">
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--one testimonial block ended-->
                </div>
              </div>
              <div
                v-if="demoschedule"
                :class="'tab-pane ' + demoschedule == 1 ? 'active' : ''"
                id="tab-33"
              >
                <div class="row">
                  <div class="card">
                    <div class="card-body">
                      <div class="team-section text-center">
                        <div class="team-img">
                          <img
                            src="/assets/images/users/user.svg"
                            class="img-thumbnail rounded-circle alt="
                            alt="img"
                          />
                        </div>
                        <h4 class="font-weight-bold dark-grey-text mt-4">
                          Director, EIS
                        </h4>

                        <p class="font-weight-normal dark-grey-text mt-4">
                          <i class="fas fa-quote-left pr-2"></i>
                          Team is working hard to materialise the dream of
                          digital India ! Code to decode your bright future.
                        </p>
                        <div class="text-warning">
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card">
                    <div class="card-body">
                      <div class="team-section text-center">
                        <div class="team-img">
                          <img
                            src="/assets/images/users/user.svg"
                            class="img-thumbnail rounded-circle alt="
                            alt="img"
                          />
                        </div>
                        <h4 class="font-weight-bold dark-grey-text mt-4">
                          Principal, EIS
                        </h4>
                        <p class="font-weight-normal dark-grey-text mt-4">
                          <i class="fas fa-quote-left pr-2"></i>
                          The curriculum and support resources have been
                          exceptional! Found out a former student who did
                          Codevidhya and then went on to programming in college
                          tested out of his intro course.
                        </p>
                        <div class="text-warning">
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card">
                    <div class="card-body">
                      <div class="team-section text-center">
                        <div class="team-img">
                          <img
                            src="/assets/images/users/user.svg"
                            class="img-thumbnail rounded-circle alt="
                            alt="img"
                          />
                        </div>
                        <h4 class="font-weight-bold dark-grey-text mt-4">
                          David Heisnam, Faculty
                        </h4>

                        <p class="font-weight-normal dark-grey-text mt-4">
                          <i class="fas fa-quote-left pr-2"></i>
                          We come in and the students start working on their
                          code. We are self paced and they start where they left
                          off from the last class. Some students that are
                          further along will assist others in writing or solving
                          the code problem. It is great to see peer review and
                          assistance. The students are teaching each other. I
                          have set milestones to check progress, but students
                          seem to breeze by these most of the time. I usually
                          have to tell the students it is time to go at the end
                          of class, because they want to stay and finish.
                        </p>
                        <div class="text-warning">
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
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
    </div>
    <div class="col-sm-12 text-center mt-4" v-if="!demoschedule">
      <TrialButton />
    </div>
    <div class="col-sm-12 text-center mt-4" v-else>
      <button
        class="btn btn-primary btn-pill"
        @click.prevent="$router.push('/enquiry')"
      >
        Schedule Demo
      </button>
    </div>
  </div>
</template>
<script>
import TrialButton from "@/components/BookTrialButton/BookTrialShareButton.vue";
export default {
  props: ["demoschedule"],
  components: { TrialButton },
};
</script>
<style lang="scss" scoped>
.card {
  width: 32%;
  padding: 32px 16px;
  border-radius: 8px;
  transition: all 500ms;
  &:hover {
    border-top-left-radius: 48px;
  }
}

.team-img img {
  padding: 16px;
  box-shadow: none;
}

@media only screen and (max-width: 425px) {
  .card {
    width: 98%;
  }
  .row {
    justify-content: center !important;
  }
}
</style>
