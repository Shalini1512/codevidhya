<template>
  <div>
    <Header>
      <div class="bannerimg">
        <div class="header-text mb-0">
          <div class="container">
            <div class="text-center text-white">
              <h1 class>Resource</h1>
              <p>
                These are free resource for students, stay safe and stay at
                home, keep learning
              </p>
            </div>
          </div>
        </div>
      </div>
    </Header>

    <div class="sptb bg-white">
      <div class="row">
        <div class="col-lg-12">
          <div class="card ">
            <div class="card-body">
              <div class="support">
                <div class="row text-white">
                  <!--Quiz-->
                  <!--new card-->
                  <div class="col-xl-4 col-md-4">
                    <div class="card mb-0">
                      <div class="item-card2-img">
                        <img
                          :src="'/dynamic/resource_img/Quiz.jpeg'"
                          alt="img"
                          class="cover-image"
                          style="background:#33E0FF;"
                        />
                      </div>
                      <!--card body-->
                      <div class="card-body">
                        <div class="item-card2">
                          <div class="item-card2-text mb-3">
                            <h4
                              class="font-weight-semibold text-dark mb-2"
                              v-html="'Quiz'"
                            ></h4>
                            <div
                              class="mb-1 text-muted"
                              style="font-size:16px;"
                            >
                              By:&nbsp; <i class="icon icon-user mr-1"></i
                              ><span
                                class=""
                                style="font-size:12px;"
                                v-html="'Codevidhya'"
                              ></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!--end card body-->
                      <!--card footer-->
                      <div class="card-footer">
                        <div class="item-card2-footer">
                          <div
                            class="product-item-wrap d-flex align-items-center"
                          >
                            <button
                              :class="
                                'btn btn-primary  ml-auto price' + 'unlocked'
                              "
                              @click="resource('quiz')"
                              style="border-radius:4px;width:auto;"
                              v-html="'Attempt'"
                            ></button>
                          </div>
                        </div>
                      </div>
                      <!--end card footer-->
                    </div>
                  </div>
                  <!--end new card-->
                 <!--end quiz-->
                 <!--Assessment-->
                   <!--new card-->
                  <div class="col-xl-4 col-md-4">
                    <div class="card">
                      <div class="item-card2-img" style="height:220px;">
                        <img
                          :src="'/dynamic/resource_img/assessment.jpeg'"
                          alt="img"
                          class="cover-image"
                          style="background:#33E0FF;"
                        />
                      </div>
                      <!--card body-->
                      <div class="card-body">
                        <div class="item-card2">
                          <div class="item-card2-text mb-3">
                            <h4
                              class="font-weight-semibold text-dark mb-2"
                              v-html="'Assessment'"
                            ></h4>
                            <div
                              class="mb-1 text-muted"
                              style="font-size:16px;"
                            >
                              By:&nbsp; <i class="icon icon-user mr-1"></i
                              ><span
                                class=""
                                style="font-size:12px;"
                                v-html="'Codevidhya'"
                              ></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!--end card body-->
                      <!--card footer-->
                      <div class="card-footer">
                        <div class="item-card2-footer">
                          <div
                            class="product-item-wrap d-flex align-items-center"
                          >
                            <button
                              :class="
                                'btn btn-primary  ml-auto price' + 'unlocked'
                              "
                               @click="resource('assessment')"
                              style="border-radius:4px;width:auto;"
                              v-html="'Attempt'"
                            ></button>
                          </div>
                        </div>
                      </div>
                      <!--end card footer-->
                    </div>
                  </div>
                  <!--end new card-->
                 <!--End Assessment-->
                 <!--Project-->
                   <!--new card-->
                  <div class="col-xl-4 col-md-4">
                    <div class="card">
                      <div class="item-card2-img" style="height:220px;">
                        <img
                          :src="'/dynamic/resource_img/project.jpeg'"
                          alt="img"
                          class="cover-image"
                          style="background:#33E0FF;"
                        />
                      </div>
                      <!--card body-->
                      <div class="card-body">
                        <div class="item-card2">
                          <div class="item-card2-text mb-3">
                            <h4
                              class="font-weight-semibold text-dark mb-2"
                              v-html="'Project  '"
                            ></h4>
                            <div
                              class="mb-1 text-muted"
                              style="font-size:16px;"
                            >
                              By:&nbsp; <i class="icon icon-user mr-1"></i
                              ><span
                                class=""
                                style="font-size:12px;"
                                v-html="'Codevidhya'"
                              ></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!--end card body-->
                      <!--card footer-->
                      <div class="card-footer">
                        <div class="item-card2-footer">
                          <div
                            class="product-item-wrap d-flex align-items-center"
                          >
                            <button
                              :class="
                                'btn btn-primary  ml-auto price' + 'unlocked'
                              "
                               @click="resource('project')"
                              style="border-radius:4px;width:auto;"
                              v-html="'Attempt'"
                            ></button>
                          </div>
                        </div>
                      </div>
                      <!--end card footer-->
                    </div>
                  </div>
                  <!--end new card-->
                 <!--End Project-->
                  <!--<div
                    class="col-xl-4 col-lg-12 col-md-12 border-right cursor-pointer"
                    @click="resource('quiz')"
                  >
                    <div class="support-service bg-primary">
                      <i class="fa fa-question" aria-hidden="true"></i>
                      <h6 class="mt-2">Quiz</h6>
                      <P></P>
                    </div>
                  </div>
                  <div
                    class="col-xl-4 col-lg-12 col-md-12 border-right cursor-pointer"
                    @click="resource('assessment')"
                  >
                    <div class="support-service bg-success">
                      <i class="far fa-edit"></i>
                      <h6 class="mt-2">Assessment</h6>
                      <p></p>
                    </div>
                  </div>
                  <div
                    class="col-xl-4 col-lg-12 col-md-12 cursor-pointer"
                    @click="resource('project')"
                  >
                    <div class="support-service bg-danger">
                      <i class="fas fa-project-diagram"></i>
                      <h6 class="mt-2">Project</h6>
                      <p></p>
                    </div>
                  </div>-->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/contact-us/HeaderContent.vue";
import Footer from "@/components/footer/Footer.vue";

import axios from "axios";

export default {
  name: "Resources",
  components: {
    Header,
    HeaderContent,
    Footer
  },
  data: function() {
    return {
      userId: 0
    };
  },
  mounted() {
    cvAuth.getUserId(
      function(userId) {
        this.userId = userId;
      }.bind(this)
    );
  },
  methods: {
    resource(productName) {
      let resName = "/resource/quizzes";
      if (productName == "quiz") {
        resName = "/resource/quizzes";
      } else if (productName == "assessment") {
        resName = "/resource/assessments";
      } else {
        resName = "/resource/projects";
      }
      if (this.userId) {
        this.$router.push(resName);
      } else {
        this.$router.push(
          "/login?redirect=" + encodeURIComponent(window.location.href)
        );
        return;
      }
    }
  }
};
</script>
