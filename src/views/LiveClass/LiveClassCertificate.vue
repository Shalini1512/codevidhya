<!--:style="'height:'+windowHegiht+'px !important;'"-->
<template>
  <div id="projects-root">
    <Header>
      <section>
        <div class="sptb-4 sptb-tab" style="padding-bottom: 2rem;">
          <div class="header-text mb-0">
            <div class="container">
              <div class="row align-items-center">
                <div
                  class="col-md-6"
                  style="display: flex; flex-direction: column; justify-content: center"
                >
                  <div class="text-left text-white">
                    <h2>Live Class Certificates</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Header>
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-12 col-lg-12 col-md-12">
          <div class="card">
            <div class="card-header bg-secondary">
              <h3 class="card-title  text-white w-auto">
                Demo class Certificates
              </h3>
              <i class="flex-fill"></i>
            </div>

            <div class="card-body">
              <div class="row">
                <div class="col-sm-12 mb-2">
                  <table
                    class="table card-table text-nowrap table-bordered border-top mb-0"
                    v-if="allStudents.length||allDemoCertificate.length"
                  >
                    <thead class="bg-primary text-white">
                      <tr>
                        <th class="text-white">Sr. No.</th>
                        <th class="text-white">Demo Name</th>
                        <th class="text-white">Certificate Keyword</th>
                        <th class="text-white">Class Status</th>
                        <th class="text-white">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="(student, index) in allStudents">
                        <tr
                          v-if="student.username == userDetail[0].username"
                          :key="(index = 0)"
                        >
                          <td>{{ index + 1 }}</td>
                          <td>{{ student.demo_name }}</td>
                          <td>{{ student.certificate_keyword }}</td>
                          <td>{{ student.demo_class_status }}</td>
                          <td>
                            <button
                              class="btn btn-success mr-2"
                              @click="downloadCertificate(student)"
                            >
                              Download
                            </button>
                          </td>
                        </tr>
                      </template>
                      <template v-for="(student,index) in allDemoCertificate">
                          <tr
                          :key="index"
                        >
                          <td>{{ index + 1 }}</td>
                          <td>{{ student.theme }}</td>
                          <td>{{ student.certificate_keyword }}</td>
                          <td>Done</td>
                          <td>
                            <button
                              class="btn btn-success mr-2"
                              @click="downloadPlatformCertificate(student)"
                            >
                              Download
                            </button>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                  <div class="p-4" v-else><h4>No record.</h4></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12" id="output"></div>
      </div>
      <div class="row">
        <div class="col-xl-12 col-lg-12 col-md-12">
          <div class="card">
            <div class="card-header bg-secondary">
              <h3 class="card-title  text-white w-auto">
                Live class Certificates
              </h3>
              <i class="flex-fill"></i>
            </div>

            <div class="card-body">
              <div class="row">
                <div class="col-sm-12 mb-2">
                  <table
                    class="table card-table text-nowrap table-bordered border-top mb-0"
                    v-if="allLiveClassStudents.length"
                  >
                    <thead class="bg-primary text-white">
                      <tr>
                        <th class="text-white">Sr. No.</th>
                        <th class="text-white">Class Name</th>
                        <th class="text-white">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template
                        v-for="(student, index) in allLiveClassStudents"
                      >
                        <tr
                          v-if="student.username == userDetail[0].username"
                          :key="(index = 0)"
                        >
                          <td>{{ index + 1 }}</td>
                          <td>{{ student.coursename }}</td>

                          <td>
                            <button
                              class="btn btn-success mr-2"
                              @click="downloadLiveClassCertificate(student)"
                            >
                              Download
                            </button>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                  <div class="p-4" v-else><h4>No record.</h4></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12" id="output"></div>
      </div>
    </div>
    <Footer />

    <img
      id="certificatetemplate"
      src="/static/certificates/LiveCourseCertificate.jpg"
      style="display:none;"
    />
    <img
      id="liveclasscertificatetemplate"
      src="/static/certificates/LiveClassCertificate.jpg"
      style="display:none;"
    />
  </div>
</template>

<script>
import GSheetProcessor from "g-sheets-api";
import Header from "@/components/header/Header.vue";
import HeaderContent from "@/components/assessments/HeaderContent.vue";
import Footer from "@/components/footer/Footer.vue";
import axios from "axios"; 
export default {
  name: "home",
  components: {
    Header,
    HeaderContent,
    Footer
  },
  data() {
    return {
      userId: 0,
      cls_id: this.$store.getters.getAuthData.auth_cls_id,
      user_id: this.$store.getters.getAuthData.auth_user_id,
      sec_id: this.$store.getters.getAuthData.auth_sec_id,
      role_id: this.$store.getters.getAuthData.auth_role_id,
      sch_id: this.$store.getters.getAuthData.auth_sch_id,
      user_email: this.$store.getters.getAuthData.auth_user_email,
      user_contact: this.$store.getters.getAuthData.auth_user_contact,
      user_dir_path: this.$store.getters.getAuthData.auth_dir_path,
      options: {
        sheetId: "1j_qmwXm4afajUD1LTEpr7QjPe3rE02eZDTWszvbuuB0",
        returnAllResults: true
      },
      options1: {
        sheetId: "1WpE0e49IUlv7ajdpYJi_7wiLN_qziHlkc4uUat2UzJg",
        returnAllResults: true
      },
      allStudents: [],
      allLiveClassStudents: [],
      serverTime: "",
      userDetail: "",
      allDemoCertificate:[],
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted: function() {
    //initCvModals();
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.getServerTime();
          this.getUserInformation();
          //this.displayLiveCourseStudents();
        } else {
          this.$router.push(
            "/login?redirect=" + encodeURIComponent(window.location.href)
          );
        }
      }.bind(this)
    );
    this.getSheetData(this.options, "demo");
    this.getSheetData(this.options1, "liveclass");
  },
  methods: {
    getSheetData: function(options, courseType) {
      GSheetProcessor(options, (results) => {
        this.allStudents = [];
        // Next, fill the rest of the rows with the lovely data
        if (courseType == "demo") {
          results.forEach((result) => {
            if (
              result.demo_class_status == "Done" &&
              result.username == this.userDetail[0].username
            ) {
              this.allStudents.push(result);
            }
          });
        } else if (courseType == "liveclass") {
          results.forEach((result) => {
            if (result.username == this.userDetail[0].username) {
              this.allLiveClassStudents.push(result);
            }
          });
        }
      });
    },
    getServerTime: function() {
      this.$http.post("/api/user/getServerTime").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.serverTime = res.body.serverTime;
        }
      });
    },
    getUserInformation: function() {
      this.$http
        .post("/api/profile/getUserInformation", {
          user_id: this.userId,
          role_id: this.role_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            //console.log(res.body);
            this.userDetail = res.body;
            
          }
        });
      axios.post("/api/liveCourse/getCerficateDetails",{user_id:this.userId}).then(CertificateResult =>{
        this.allDemoCertificate =CertificateResult.data;
        
      })
    },
    displayLiveCourseStudents: function() {
      this.students = [];
      this.$http
        .post("/api/user/displayLiveCourseStudents", {
          user_id: this.userId,
          role: "student"
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.students = res.body.data;
          }
        });
    },
    getCompletedDemoSessionsListForCurrentUser() {
      this.$http.post("/api/liveCourse/getCompleted");
    },
    downloadCertificate: function(student) {
      var doc = new jsPDF("p", "px", "a4", true);
      var width = doc.internal.pageSize.width;
      var height = doc.internal.pageSize.height;
      doc.addImage(
        document.querySelector("#certificatetemplate"),
        "JPEG",
        0,
        0,
        width,
        height
      );
      doc.setFontType("bold");
      doc.setTextColor("#FFFFFF");
      doc.setFontSize(28);
      doc.text(
        this.userDetail[0].name,
        width / 2 - 140,
        height / 2 + 15,
        null,
        null
      );
      doc.setFontSize(14);
      doc.text(student.demo_name, width / 2 - 135, height / 2 + 59, null, null);
      doc.text(
        student.certificate_keyword,
        width / 2 - 112,
        height / 2 + 77,
        null,
        null
      );
      doc.text(
        this.$moment(this.serverTime).format("Do MMMM, YYYY"),
        width / 2 - 100,
        height - 156,
        null,
        null
      );
      doc.save("Certificate.pdf");
    },
     downloadPlatformCertificate: function(student) {
      var doc = new jsPDF("p", "px", "a4", true);
      var width = doc.internal.pageSize.width;
      var height = doc.internal.pageSize.height;
      doc.addImage(
        document.querySelector("#certificatetemplate"),
        "JPEG",
        0,
        0,
        width,
        height
      );
      doc.setFontType("bold");
      doc.setTextColor("#FFFFFF");
      doc.setFontSize(28);
      doc.text(
        this.userDetail[0].name,
        width / 2 - 140,
        height / 2 + 15,
        null,
        null
      );
      doc.setFontSize(14);
      doc.text(student.theme, width / 2 - 135, height / 2 + 59, null, null);
      doc.text(
        student.certificate_keyword,
        width / 2 - 112,
        height / 2 + 77,
        null,
        null
      );
      doc.text(
        this.$moment(this.serverTime).format("Do MMMM, YYYY"),
        width / 2 - 100,
        height - 156,
        null,
        null
      );
      doc.save("Certificate.pdf");
    },
    downloadLiveClassCertificate: function(student) {
      var doc = new jsPDF("l", "px", "a4", true);
      var width = doc.internal.pageSize.width;
      var height = doc.internal.pageSize.height;
      doc.addImage(
        document.querySelector("#liveclasscertificatetemplate"),
        "JPEG",
        0,
        0,
        width,
        height
      );
      doc.setFontType("bold");
      doc.setTextColor("#4386BC");
      doc.setFontSize(20);
      doc.text(
        this.userDetail[0].name.toUpperCase(),
        width / 2 - 190,
        height / 2 - 40,
        null,
        null
      );
      doc.setFontType("normal");
      doc.setTextColor("#000");

      doc.setFontSize(16);
      doc.text(student.coursename, width / 2 - 135, height / 2 + 7, null, null);

      doc.text(
        this.$moment(student.date).format("DD MMMM, YYYY"),
        100,
        height - 65,
        null,
        null
      );
      doc.save("Certificate.pdf");
    }
  }
};
</script>

<style lang="scss">
#projects-root {
  .lms-section-heading {
    font-size: 2rem;
    line-height: 1;
    margin-bottom: 24px;
  }
}
#projects-hero {
  position: relative;
  width: 100%;
  padding: 32px 0;
  color: #fff;
  background-image: url("/static/dashboard/img/new/hero-bg.svg");
  background-size: cover;
  background-position: bottom;
  & * {
    position: relative;
    z-index: 1;
  }
  &::before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(113, 0, 179, 0.5);
    z-index: 0;
  }
  & > div {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    div {
      flex-grow: 1;
    }
    button {
      background: #fff;
      color: #000;
      i {
        margin-right: 8px;
      }
      &:last-of-type {
        margin-left: 8px;
      }
    }
  }
  h3 {
    margin: 0 0 16px;
  }
}

#project-cards-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 24px;
}

.project-card {
  display: flex;
  flex-direction: column;
  width: 23%;
  margin-bottom: 32px;
  border-radius: 4px;
}

.project-card-img {
  width: 100%;
  height: 0;
  padding-bottom: 50%;
  flex-shrink: 0;
  background: #efefef;
  border: none;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.project-card-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  padding: 16px;
  align-items: stretch;
  padding-right: 16px;
}

.project-card {
  position: relative;
  opacity: 1;
  transition: all 300ms, box-shadow 300ms, opacity 1000ms;
  h3 {
    margin: 0;
    padding: 0;
    font-size: 1.2rem;
    font-family: "Nunito", sans-serif !important;
    font-weight: 600;
    line-height: 1;
  }
  p {
    margin: 8px 0 0;
    font-size: 0.9rem;
    color: #444;
    font-family: "Nunito", sans-serif !important;
  }
}

.project-type-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  background: rgb(209, 42, 120);
  font-size: 0.8rem;
  line-height: 1;
  color: #fff;
  border-radius: 16px;
}

.project-card-bottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px;
  img {
    width: 32px;
    height: 32px;
    margin-right: 16px;
    border-radius: 16px;
    background: #000;
    outline: none;
  }
  span {
    padding-top: 3px;
    font-family: "Nunito";
    line-height: 1;
  }
  .edit-project-btn {
    margin: 0;
    padding: 7px 16px;
    border-radius: 4px;
    font-size: 0.9rem;
    line-height: 1;
  }
}

#new-project-modal {
  .body {
    display: flex;
    flex-direction: column;
    padding: 16px 24px;
  }
  label {
    margin-bottom: 4px;
  }
  select {
    margin-bottom: 16px;
    padding-left: 8px;
    padding-right: 8px;
  }
  textarea {
    height: 64px;
    padding: 8px;
    line-height: 1.2;
    resize: none;
  }
}
</style>
