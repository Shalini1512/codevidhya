<template>
  <div>
    <Header>
      <HeaderContent />
    </Header>

    <Courses>
      <CoursesModule />
    </Courses>
    <div class="sptb bg-white">
      <div class="container">
        <div class="row">
          <div class="col-md-12 text-center mb-5">
            <h1>CAN’T FIND WHAT YOU’RE LOOKING FOR?</h1>
            <p>
              Suggest a course topic so we can build a custom curriculum for
              you. One of our counselors will contact you.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="card m-b-20">
              <div class="card-body">
                <form>
                  <div class="form-row">
                    <div class="col-lg-1"></div>
                    <div class="form-group col-lg-4 col-md-6">
                      <!-- <div class="form-group"> -->
                      <label class="form-label" for="exampleInputEmail1">
                        Courses You Want:
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="name1"
                        placeholder="Course Name eg. Python"
                        v-model="course"
                        required
                      />
                      <small
                        v-if="requestFormSubmitClicked && !course"
                        class="cv-error"
                      >
                        Please enter name of the course.
                      </small>
                      <!-- </div> -->
                    </div>
                    <div class="col-lg-2"></div>
                    <div class="form-group col-lg-4 col-md-6">
                      <!-- <div class="form-group"> -->
                      <label class="form-label" for="exampleInputEmail1">
                        Student's Grade:
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="name2"
                        placeholder="Enter Grade"
                        v-model="grade"
                        required
                      />
                      <small
                        v-if="requestFormSubmitClicked && !grade"
                        class="cv-error"
                      >
                        Please enter Grade.
                      </small>
                      <!-- </div> -->
                    </div>
                    <div class="col-lg-1"></div>

                    <div class="col-lg-1"></div>
                    <div class="form-group col-lg-4 col-md-6">
                      <label for="inputEmail4" class="col-form-label">
                        Parent’s Full Name:
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="inputParentsName5"
                        placeholder="Enter First Name and Last Name"
                        v-model="parentName"
                        required
                      />
                      <small
                        v-if="requestFormSubmitClicked && !parentName"
                        class="cv-error"
                      >
                        Please enter Parent's Name.
                      </small>
                    </div>
                    <div class="col-lg-2"></div>
                    <div class="form-group col-lg-4 col-md-6">
                      <label for="inputPassword4" class="col-form-label">
                        Parent’s Contact:
                      </label>
                      <input
                        type="number"
                        class="form-control"
                        id="inputPassword4"
                        placeholder="Phone Number"
                        v-model="phone"
                        required
                      />
                      <small
                        v-if="requestFormSubmitClicked && !validatePhone(phone)"
                        class="cv-error"
                      >
                        Please enter Phone Number.
                      </small>
                    </div>
                    <div class="col-lg-1"></div>

                    <div class="col-lg-1"></div>
                    <div class="form-group col-lg-4 col-md-6">
                      <label for="inputPassword4" class="col-form-label">
                        Parent’s Email Address:
                      </label>
                      <input
                        type="email"
                        class="form-control"
                        id="inputEmail5"
                        placeholder="Email Address"
                        v-model="email"
                        required
                      />
                      <small
                        v-if="requestFormSubmitClicked && !validateEmail(email)"
                        class="cv-error"
                      >
                        Please enter Email Address.
                      </small>
                    </div>
                    <div class="col-lg-2"></div>
                  </div>

                  <div class="row justify-content-md-center">
                    <div class="col-sm-12 text-center">
                      <button
                        type="button"
                        class="btn btn-lg btn-primary mt-3"
                        @click="sendCourseRequestMessage()"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--Contact-->
    <div class="sptb">
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
                        <h6 class="fs-18">+91 7357286330</h6>
                      </div>
                    </div>
                    <div class="col-xl-4 col-lg-12 col-md-12 border-right">
                      <div class="support-service bg-success">
                        <i class="fas fa-envelope"></i>
                        <p>Email us at</p>
                        <h6 class="fs-18">contact@codevidhya.com</h6>
                      </div>
                    </div>
                    <div class="col-xl-4 col-lg-12 col-md-12">
                      <div class="support-service bg-danger">
                        <i class="far fa-clock"></i>
                        <p>Working Hours!</p>
                        <h6 class="fs-18">Mon-Sat(10:00-19:00)</h6>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-12 text-center mt-2">
                    <TrialButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/courses/HeaderContent.vue";
import Courses from "@/components/courses/Courses.vue";
import Footer from "@/components/footer/Footer.vue";
import CoursesModule from "@/components/courses/CouseShareableModule.vue";
import TrialButton from "@/components/BookTrialButton/BookTrialShareButton.vue";

import axios from "axios";

export default {
  name: "home",
  components: {
    Header,
    HeaderContent,
    Courses,
    Footer,
    CoursesModule,
    TrialButton,
  },
  data: function() {
    return {
      requestFormSubmitClicked: false,
      course: "",
      grade: "",
      parentName: "",
      phone: "",
      email: "",
    };
  },
  mounted() {},
  methods: {
    validateEmail(email) {
      return window.validateEmail(email);
    },
    validatePhone(phone) {
      return window.validatePhone(phone);
    },
    sendCourseRequestMessage() {
      this.requestFormSubmitClicked = true;
      var canSend = true;
      if (!this.course) {
        canSend = false;
      }
      if (!this.grade) {
        canSend = false;
      }
      if (!this.parentName) {
        canSend = false;
      }
      if (!this.validateEmail(this.email)) {
        canSend = false;
      }
      if (!this.validatePhone(this.phone)) {
        canSend = false;
      }

      if (!canSend) {
        window.cvNotify("Please provide all details.", "error");
        return;
      }
      if (!window.validateEmail(this.email)) {
        window.cvNotify("Please provide a valid email address.", "error");
        return;
      }
      var vm = this;
      axios
        .post("/api/user/sendCourseRequest", {
          courseName: this.course,
          grade: this.grade,
          parentName: this.parentName,
          phone: this.phone,
          email: this.email,
        })
        .then(() => {
          vm.requestFormSubmitClicked = false;
          vm.course = "";
          vm.grade = "";
          vm.parentName = "";
          vm.email = "";
          vm.phone = "";
          window.cvNotify(
            "Thanks for reaching out to us. We will get back to you as soon as possible."
          );
        })
        .catch(() => {
          window.cvNotify("Sorry, your message could not be sent.", "error");
        });
    },
  },
};
</script>
