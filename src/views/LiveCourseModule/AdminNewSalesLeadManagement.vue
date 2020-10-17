<template>
  <div>
    <Header>
      <div class="bannerimg">
        <div class="header-text mb-0">
          <div class="container">
            <div class="text-center text-white">
              <h1 class>New Trial Class Request</h1>
            </div>
          </div>
        </div>
      </div>
    </Header>
    <!--register users-->
    <!--Register-section-->
    <section class="sptb">
      <div class="container customerpage">
        <div class="row">
          <div class="single-page">
            <div class="col-lg-8 col-xl-12 col-md-12 d-block mx-auto">
              <div class="wrapper wrapper2">
                <form id="Register" class="card-body" tabindex="500">
                  <h3>New Demo Class Request</h3>
                  <div class="row">
                    <div class="name col-sm-6">
                      <input type="text" name="name" v-model="parent_name" />
                      <label>Parent's Name</label>
                      <small v-if="registerButtonClicked && !parent_name" class="cv-error">
                        <i class="fas fa-exclamation-circle"></i> Name is
                        required.
                      </small>
                    </div>
                    <div class="mail col-sm-6">
                      <input type="email" name="mail" v-model="parent_mail" />
                      <label>Parent's Mail</label>
                      <small
                        v-if="registerButtonClicked && !validateEmail(parent_mail )"
                        class="cv-error"
                      >
                        <i class="fas fa-exclamation-circle"></i> Enter valid
                        email address.
                      </small>
                    </div>
                    <div class="contact col-sm-6 mt-3">
                      <input type="text" name="contact" v-model="parent_contact" />
                      <label>Parent's Mobile Number</label>
                      <small
                        v-if="registerButtonClicked && !validatePhone(parent_contact)"
                        class="cv-error"
                      >
                        <i class="fas fa-exclamation-circle"></i> Enter valid
                        phone number.
                      </small>
                    </div>
                    <div class="kids col-sm-6 mt-3">
                      <input type="text" name="contact" v-model="kids_name" />
                      <label>Kid's Name</label>
                      <small v-if="registerButtonClicked && !kids_name" class="cv-error">
                        <i class="fas fa-exclamation-circle"></i> Enter Kids Name.
                      </small>
                    </div>
                    <div class="col-sm-6 mt-3">
                      <select class="form-control" id="grade">
                        <option value="0">--select grade--</option>
                        <option value="UKG">Grade UKG</option>
                        <option value="1">Grade 1</option>
                        <option value="2">Grade 2</option>
                        <option value="3">Grade 3</option>
                        <option value="4">Grade 4</option>
                        <option value="5">Grade 5</option>
                        <option value="6">Grade 6</option>
                        <option value="7">Grade 7</option>
                        <option value="8">Grade 8</option>
                        <option value="9">Grade 9</option>
                        <option value="10">Grade 10</option>
                        <option value="11">Grade 11</option>
                        <option value="12">Grade 12</option>
                      </select>
                      <label>Garde</label>
                    </div>
                    <div class="col-sm-6 mt-3">
                      <select
                        name="country"
                        id="select-countries"
                        class="form-control student_input"
                        @change="getstates($event)"
                        v-model="select_country"
                      >
                        <option value="0" selected disabled>Select Country</option>
                        <option
                          v-for="(country, key) in countries"
                          :value="country.shortName"
                          v-bind:key="key"
                        >{{ country.name }}</option>
                      </select>
                    </div>
                    <div class="col-sm-6 mt-3">
                      <select
                        name="state"
                        id="select-state"
                        class="form-control student_input"
                        @change="getcities()"
                        v-model="select_state"
                      >
                        <option value="0" selected disabled>Select State</option>
                        <option
                          v-for="(state, key) in states"
                          :value="state"
                          v-bind:key="key"
                        >{{ state }}</option>
                      </select>
                    </div>
                    <div class="col-sm-6 mt-3">
                      <select
                        name="city"
                        id="select-cities"
                        class="form-control student_input"
                        v-model="select_city"
                      >
                        <option value="0" selected disabled>Select City</option>
                        <option
                          v-for="(city, key) in cities"
                          :value="city"
                          v-bind:key="key"
                        >{{ city }}</option>
                      </select>
                    </div>
                    <div class="col-sm-6 mt-3">
                      <select id="course_level" class="form-control">
                        <option value="0">--select Demo Session--</option>
                        <option
                          v-for="(demoCourse,index) in demoCourses"
                          :key="index"
                          :value="demoCourse.demo_course_id"
                        >{{demoCourse.demo_course_name}} ({{demoCourse.theme}})</option>
                      </select>
                      <i
                        class="fa fa-info-circle text-info"
                        style="position:absolute;right:6%;cursor:pointer;bottom:22%;"
                        @click="demoCourseDetails"
                      ></i>
                      <label>Demo Session</label>
                    </div>
                    <div class="institute col-sm-12 mt-3">
                      <input type="text" name="inst" v-model="institute_name" />
                      <label>Institution Name</label>
                    </div>
                    <div class="col-sm-6 mt-3" v-if="salesPersons && salesPersons.length">
                      <select id="trainer" class="form-control">
                        <option
                          v-for="(sales,index) in salesPersons"
                          :key="index"
                          :value="sales.user_id"
                        >{{sales.name}}</option>
                      </select>
                      <label>Alloted To(Sales)</label>
                    </div>

                    <div class="col-sm-6 mt-3">
                      <input type="date" placeholder id="schedule-time" v-model="currentDate" />
                      <label>Date</label>
                      <small v-if="registerButtonClicked && !currentDate" class="cv-error">
                        <i class="fas fa-exclamation-circle"></i> Schedule date and time is required.
                      </small>
                    </div>
                  </div>

                  <div class="submit text-center mt-2" style="height:160px;">
                    <a class="btn btn-primary" @click="bookForTrailClasss($event)">Add Request</a>
                  </div>
                </form>
                <hr class="divider" />
                <div class="row">
                  <div class="col-sm-6 mt-3 mb-5">
                    <button
                      class="btn btn-pill btn-primary"
                      @click="downloadExcelFile()"
                    >Download Excel File Format</button>
                  </div>
                  <div class="col-sm-5 mt-3 mb-5">
                    <div class="form-group">
                      <label for="exampleFormControlFile1">Example file input</label>
                      <input
                        type="file"
                        class="form-control-file"
                        style="color:#000;"
                        id="exampleFormControlFile1"
                      />
                      <button class="btn btn-pill btn-success mt-2" @click="uploadExcelFile">Upload</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--/Register-section-->
    <!--end users-->
    <div class="sptb bg-white mb-0">
      <Footer />
    </div>
    <!--demo course modal-->
    <div id="demo-course-modal" class="cv-modal large">
      <div>
        <h3
          class="text-center"
          id="trail-course-name"
        >{{demoCourses.length?demoCourses[Selectedkey].demo_course_name:''}}</h3>

        <div class="row course-details">
          <div class="col-sm-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Age Group:</label>
            <span
              id="trial_age_group"
              style="margin-left:3%;"
            >{{demoCourses.length?demoCourses[Selectedkey].age_group:''}}</span>
          </div>
          <div class="col-sm-4">
            <label style="font-weight:bold;font-display: 'Poppins';">Grade:</label>
            <span
              id="trial_grade_group"
              tyle="margin-left:3%;"
            >{{demoCourses.length?demoCourses[Selectedkey].grade:''}}</span>
          </div>
          <div class="col-sm-12 mt-2">
            <label style="font-weight:bold;font-display: 'Poppins'; font-size: 1.2rem;">Theme:</label>
          </div>
          <div
            class="col-sm-12"
            id="theme1"
          >{{demoCourses.length?demoCourses[Selectedkey].theme:''}}</div>
          <div class="col-sm-12 mt-2" v-if="prerequisites.length">
            <label
              style="font-weight:bold;font-display: 'Poppins';font-size: 1.2rem; margin-bottom:0;"
            >Prerequisite:</label>
          </div>
          <div class="col-sm-12" id="prerequisite">
            <ul v-if="prerequisites.length">
              <li v-for="(prerequisite,index) in prerequisites" :key="index">{{prerequisite}}</li>
            </ul>
          </div>
          <div class="col-sm-12 mt-2" v-if="topics.length">
            <label
              style="font-weight:bold;font-display: 'Poppins';font-size: 1.2rem;margin-bottom:0;"
            >Topics:</label>
          </div>
          <div class="col-sm-12" id="topics">
            <ul v-if="topics.length">
              <li v-for="(topic,index) in topics" :key="index">{{topic}}</li>
            </ul>
          </div>
          <div class="col-sm-12 mt-2">
            <label
              style="font-weight:bold;font-display: 'Poppins';font-size: 1.2rem;margin-bottom:0;"
            >Outcomes:</label>
          </div>
          <div class="col-sm-12" id="outcomes" v-if="outcomes.length">
            <ul v-if="outcomes.length">
              <li v-for="(outcome,index) in outcomes" :key="index">{{outcome}}</li>
            </ul>
          </div>
        </div>
        <div class="text-center mt-4">
          <button class="btn btn-primary" @click="handleCloseLearnAtHomeClicked">Close</button>
        </div>
      </div>
    </div>
    <!--end demo course modal-->
    <Loader v-if="processing" />
  </div>
</template>
<script>
import moment from "vue-moment";
import Header from "@/components/header/HeaderMenuForAdmin.vue";
import Footer from "@/components/footer/Footer.vue";
import Loader from "@/components/widgets/BlockingLoader.vue";
import axios from "axios";
/*import datetime from 'vuejs-datetimepicker';*/

export default {
  name: "RegisterForTrialClass",
  components: {
    Header,
    Footer,
    Loader
  },
  data: function() {
    return {
      userId: 0,
      processing: false,
      registerButtonClicked: false,
      demoCourses: [],
      Selectedkey: 0,
      prerequisites: [],
      topics: [],
      outcomes: [],
      dateTimes: "",
      parent_name: "",
      parent_mail: "",
      parent_contact: "",
      kids_name: "",
      grade: 0,
      courses: 0,
      institute_name: "",
      trainer_name: "",
      schedule_date: "",
      query_assigned_to: "",
      trainersList: "",
      availableTimeSlots: "",
      salesPersons: [],
      countries: [],
      states: [],
      cities: [],
      select_country: 0,
      select_state: 0,
      select_city: 0,
      currentDate: new Date().toISOString().slice(0, 10)
    };
  },
  mounted() {
    this.currentDate = new Date();
    this.currentDate.setTime(this.currentDate.getTime() + 330 * 60 * 1000);
    this.currentDate = this.currentDate.toISOString().substring(0, 10);
    $("#schedule-time").prop("min", this.currentDate);
    this.getAllDemoCourses();
  },
  methods: {
    getstates: function(e) {
      let vm = this;
      let c_name = $(e.currentTarget).val();
      this.getAllStates(c_name);
    },
    downloadExcelFile() {
      this.processing = true;
      this.$http
        .post(
          "/api/liveCourse/downloadExcelFiles",
          {
            sch_id: 0,
            salesPersons: this.salesPersons,
            courses: this.demoCourses
          },
          { responseType: "blob" }
        )
        .then(res => {
          let blob = new Blob([res.body], {
            type: res.headers.get("content-type")
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "UploadLiveClassMultipleRequests.xlsx";
          link.click();
          this.processing = false;
        });
    },
    getAllStates(c_name) {
      let vm = this;
      axios
        .post("/api/countries/get_all_state", { shortname: c_name })
        .then(res => {
          vm.states = res.data;
          vm.cities = "";
        });
    },
    getcities: function() {
      let s_name = $("#select-state").val();
      let countries = $("#select-countries").val();
      this.getAllCities(s_name, countries);
    },
    getAllCities(s_name, countries) {
      let vm = this;
      axios
        .post("/api/countries/get_all_cities", {
          shortname: countries,
          state: s_name
        })
        .then(res => {
          vm.cities = res.data;
        });
    },
    validateEmail(email) {
      return validateEmail(email);
    },
    validatePhone(phone) {
      return validatePhone(phone);
    },
    bookForTrailClasss(e) {
      let country = $("#select-countries :selected").text();
      e.preventDefault();
      this.registerButtonClicked = true;
      var canSubmit = true;
      if (!this.parent_name) canSubmit = false;
      if (!this.validateEmail(this.parent_mail)) canSubmit = false;
      if (!this.validatePhone(this.parent_contact)) canSubmit = false;
      // if (!this.kids_name) canSubmit = false;
      if (!canSubmit) return;
      this.sendRequest();
    },
    sendRequest() {
      this.processing = true;
      var demo_course_id = $("#course_level").val();
      let country = $("#select-countries :selected").text();
      let theme =
        demo_course_id != 0 ? this.demoCourses[this.Selectedkey].theme : "";
      var sales_id = $("#trainer").val();
      var grade = $("#grade").val();
      var gradeName = $("#grade option:selected").text();
      axios
        .post("/api/liveCourse/allotRequestToSalesPerson", {
          parent_name: this.parent_name,
          parent_mail: this.parent_mail,
          parent_contact: this.parent_contact,
          kids_name: this.kids_name,
          demo_course_id: demo_course_id,
          theme: theme,
          sales_id: sales_id,
          grade: grade,
          gradeName: gradeName,
          country: this.select_country != 0 ? country : "",
          state: this.select_state != 0 ? this.select_state : "",
          city: this.select_city != 0 ? this.select_city : "",
          institute_name: this.institute_name,
          schedule_date: this.currentDate
        })
        .then(res => {
          this.processing = false;
          cvNotify("Successful submitted");
          this.parent_name = this.parent_mail = this.parent_contact = this.kids_name = this.institute_name =
            "";
          $("#grade").val(0);
          $("#course_level").val(0);
          this.currentDate = new Date().toISOString().slice(0, 10);
        });
    },
    async uploadExcelFile() {
      var data = new FormData();

      var fileInput = document.getElementById("exampleFormControlFile1");
      var file = fileInput.files[0];
      if (!file) {
        cvNotify("KIndly Choose Your Excel File", "error");
        return false;
      }
      var url = URL.createObjectURL(file);
      await data.append("UploadLiveClassMultipleRequests", file);

      this.processing = true;
      await this.$http
        .post("/api/liveCourse/uploadDemoClassRequests", data)
        .then(res => {
          cvNotify(
            "You have successfully uploaded the school records",
            "success"
          );
          this.processing = false;
          $("#exampleFormControlFile1").val("");
          data = new FormData();
          // }
        });

      if (!file) return;
    },
    getAllDemoCourses() {
      let vm = this;
      axios.post("/api/liveCourse/getDemoCoursesForFreeTrail").then(res => {
        vm.demoCourses = res.data;
        this.GetSalesPersonList();
      });
      axios.post("/api/countries/get_all_country").then(res => {
        vm.countries = res.data;
        vm.states = "";
        vm.cities = "";
      });
    },
    GetSalesPersonList() {
      let vm = this;
      axios.post("/api/liveCourse/getAllSalesMembers").then(res => {
        vm.salesPersons = res.data;
      });
    },

    demoCourseDetails() {
      let demoCourseId = $("#course_level").val();
      let demoClassdata = this.demoCourses.findIndex(
        x => x.demo_course_id == demoCourseId
      );
      // console.log(demoClassdata);
      this.Selectedkey = demoClassdata;
      this.prerequisites = this.demoCourses[
        this.Selectedkey
      ].prerequisite.split(",");
      this.topics = this.demoCourses[this.Selectedkey].topics.split(",");
      this.outcomes = this.demoCourses[this.Selectedkey].outcomes.split(",");
      // console.log(this.prerequisites);

      showModal("demo-course-modal");
    },
    handleCloseLearnAtHomeClicked() {
      hideModal("demo-course-modal");
    },
    handleRegisterLearnAtHomeClicked() {}
  }
};
</script>
<style scoped lang="scss">
#demo-course-modal {
  & > div {
    padding: 0 16px 16px;
    overflow: auto;
  }
  h3 {
    padding: 24px 0 16px;
    font-display: "Poppins";
    font-weight: bold;
  }
  img {
    display: block;
    width: 300px;
    margin: 0 auto 16px;
    border-radius: 8px;
  }

  .course-details {
    padding: 0 0 16px;
    font-size: 1rem;
    text-align: left;
  }
  p {
    padding: 0 0 16px;
    font-size: 1rem;
    text-align: left;
  }

  .btn-link {
    color: #212121;
  }
}
</style>