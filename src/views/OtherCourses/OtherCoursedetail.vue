<template>
  <div>
    <Header>
      <div class="bannerimg">
        <div class="header-text mb-0">
          <div class="container">
            <div class="text-center text-white">
              <h1 class>Course Detail</h1>
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
                  <div
                    class="col-xl-4 col-lg-12 col-md-12 border-right cursor-pointer"
                    @click="resource('videos')"
                  >
                    <div class="support-service bg-primary">
                      <i class="fas fa-film"></i>
                      <h6 class="mt-2">Videos</h6>
                      <P></P>
                    </div>
                  </div>
                  <div
                    class="col-xl-4 col-lg-12 col-md-12 border-right cursor-pointer"
                    @click="resource('ppt')"
                  >
                    <div class="support-service bg-success">
                      <i class="fas fa-file-powerpoint"></i>
                      <h6 class="mt-2">PDF/Notes</h6>
                      <p></p>
                    </div>
                  </div>
                  <div
                    class="col-xl-4 col-lg-12 col-md-12 cursor-pointer"
                    @click="resource('assessments')"
                  >
                    <div class="support-service bg-danger">
                      <i class="far fa-edit"></i>
                      <h6 class="mt-2">Assessments</h6>
                      <p></p>
                    </div>
                  </div>
                  <div
                    class=" mt-2 col-xl-12 col-lg-12 col-md-12 curdor-pointer text-center"
                  >
                    <button
                      class="btn btn-primary"
                      @click="switchOtherCourses()"
                    >
                      Back
                    </button>
                  </div>
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
  name: "otherCourseDetails",

  components: {
    Header,
    HeaderContent,
    Footer
  },
  props: ["courseName"],
  data: function() {
    return {
      userId: 0,
      roleId: 0
      //courseName: ""
    };
  },
  mounted() {
    cvAuth.getUserId(
      function(userId) {
        this.userId = userId;
        this.roleId = this.$store.getters.getAuthData.auth_role_id;
        this.id = new URL(window.location).searchParams.get("id");
      }.bind(this)
    );
  },
  methods: {
    switchOtherCourses() {
      if (this.roleId == 2) {
        this.$router.push({
          name: "teacherdashboard",
          params: { openOtherCourse: 1 }
        });
      } else if (this.roleId == 3) {
        this.$router.push({
          name: "studentdashboard",
          params: { openOtherCourse: 1 }
        });
      }
    },
    resource(productName) {
      let resName = "";
      if (productName == "videos") {
        resName = "/course/" + this.courseName + "/videos/";
      } else if (productName == "assessments") {
        resName = "/course/" + this.courseName + "/assessments/?id=" + this.id;
      } else if (productName == "ppt") {
        resName = "/course/" + this.courseName + "/notes/?id=" + this.id;
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
