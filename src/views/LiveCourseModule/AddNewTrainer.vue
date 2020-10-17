<template>
  <div>
    <Header>
      <div class="bannerimg">
        <div class="header-text mb-0">
          <div class="container">
            <div class="text-center text-white">
              <h1 class>Add New Trainer</h1>
              <!--<ol class="breadcrumb text-center">
									<li class="breadcrumb-item"><a href="#">Home</a></li>
									<li class="breadcrumb-item"><a href="#">Pages</a></li>
									<li class="breadcrumb-item active text-white" aria-current="page">Register</li>
              </ol>-->
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
                  <h3>Add New Trainer</h3>
                  <div class="row">
                    <div class="trainer col-sm-12 mb-3">
                      <select class="form-control">
                        <option value="1">Existing Users</option>
                        <option value="2">New</option>
                      </select>
                    </div>
                    <div class="trainer col-sm-12 mb-3" id="trainers">
                      <div class="com-sm-12 dropdown-contents mb-3" id="trainer_names">
                        <input
                          type="text"
                          placeholder="Search.."
                          id="serach-trainer"
                          @keyup="calfunc"
                        />
                        <div class="col-sm-12" id="expected-users" v-if="existUsersLists.length">
                          <span
                            href="#base"
                            v-for="(existUsersList,index) in existUsersLists"
                            :key="index"
                            @click="getuserdetail(existUsersList)"
                          >{{existUsersList.name}}</span>
                        </div>
                        <label>Search By Name</label>
                      </div>
                      <div class="row">
                        <div class="trainer col-sm-6 mb-3" id="trainers">
                          <div class="com-sm-6 dropdown-contents" id="trainer_names">
                            <input
                              type="text"
                              placeholder="Name"
                              id="Name"
                              :value="userDetail?userDetail[0].name:''"
                            />
                            <label>Name</label>
                          </div>
                        </div>
                        <div class="trainer col-sm-6 mb-3" id="trainers">
                          <div class="com-sm-6 dropdown-contents" id="trainer_names">
                            <input
                              type="Email"
                              placeholder="Name"
                              id="Name"
                              :value="userDetail?userDetail[0].name:''"
                            />
                            <label>Email</label>
                          </div>
                        </div>
                        <div class="trainer col-sm-6 mb-3" id="trainers">
                          <div class="com-sm-6 dropdown-contents" id="trainer_names">
                            <input type="text" placeholder="contact" id="contact" />
                            <label>Contact</label>
                          </div>
                        </div>
                        <hr class="col-sm-12" />
                        <!--additional link-->
                        <div class="trainer col-sm-6 mb-3" id="class_link">
                          <div class="com-sm-6 dropdown-contents" id="trainer_names">
                            <input type="text" placeholder="Class Link" id="class-link" />
                            <label>Class Link</label>
                          </div>
                        </div>
                        <div class="trainer col-sm-6 mb-3" id="class_link">
                          <div class="com-sm-6 dropdown-contents" id="trainer_names">
                            <select class="form-control">
                              <option value="0">Demo Session</option>
                              <option value="0">Live Sessions</option>
                            </select>
                            <label>Register For</label>
                          </div>
                        </div>
                        <div class="trainer col-sm-6 mb-3" id="class_link">
                          <div class="com-sm-6 dropdown-contents" id="trainer_names">
                            <select id="course_level" class="form-control">
                              <option
                                v-for="(demoCourse,index) in demoCourses"
                                :key="index"
                                :value="demoCourse.demo_course_id"
                              >{{demoCourse.demo_course_name}}</option>
                            </select>
                            <i
                              class="fa fa-info-circle text-info"
                              style="position:absolute;right:6%;cursor:pointer;bottom:22%;"
                              @click="demoCourseDetails"
                            ></i>
                            <label>Course Level</label>
                          </div>
                        </div>

                        <!--end additional link-->
                      </div>
                    </div>
                  </div>
                  <div class="submit text-center mt-2" style="height:160px;">
                    <a class="btn btn-primary" @click="bookForTrailClasss($event)">Add Trainer</a>
                  </div>
                </form>
                <!--<hr class="divider">-->
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
      existUsersLists: [],
      trainerDetails: []
    };
  },
  mounted() {
    this.getAllDemoCourses();
  },
  methods: {
    calfunc() {
      let text = $("#serach-trainer").val();
      $("#user_detail").hide();
      let vm = this;
      axios
        .post("/api/liveCourse/getusersfortrainer", { text: text })
        .then(res => {
          vm.existUsersLists = res.data;
          console.log(vm.existUsersLists);
        });
    },
    getuserdetail(obj) {
      this.existUsersLists = [];
      $("#user_detail").show();
      $("#serach-trainer").val(obj.name);
      let vm = this;
      axios
        .post("/api/liveCourse/getTrainerForAdd", { user_id: obj.user_id })
        .then(res => {
          trainerDetails = res.data;
        });
    },

    validateEmail(email) {
      return validateEmail(email);
    },
    validatePhone(phone) {
      return validatePhone(phone);
    },
    bookForTrailClasss(e) {
      e.preventDefault();
      this.registerButtonClicked = true;
      var canSubmit = true;
      if (!this.parent_name) canSubmit = false;
      if (!this.validateEmail(parent_mail)) canSubmit = false;
      if (!this.validatePhone(this.parent_contact)) canSubmit = false;
      if (!this.kids_name) canSubmit = false;
      if (!this.schedule_date) canSubmit = false;
      if (!canSubmit) return;
    },

    getAllDemoCourses() {
      let vm = this;
      axios.post("/api/liveCourse/getDemoCoursesForFreeTrail").then(res => {
        vm.demoCourses = res.data;
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
      console.log(this.prerequisites);

      showModal("demo-course-modal");
    },
    handleCloseLearnAtHomeClicked() {
      hideModal("demo-course-modal");
    },
    handleRegisterLearnAtHomeClicked() {
      console.log("dfsdf");
    }
  },
  updated() {}
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

#trainers {
  background-color: #fff;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

#trainers:hover,
#trainers:focus {
  background-color: #fff;
}
#serach-trainer {
  box-sizing: border-box;
  border-bottom: 1px solid #ddd;
}
#search-trainer:focus {
  outline: 3px slid #ddd;
}

#trainer_names {
  background-color: #f6f6f6;
  overflow: auto;
  border: 1px solid #ddd;
  z-index: 1;
}

#trainer_names span {
  color: #000;
  padding: 8px 8px;
  text-decoration: none;
  display: block;
  cursor: pointer;
}
#trainers > span :hover {
  background: #ccc;
}
#expected-users {
  height: 100px;
  overflow: auto;
}
#expected-users span {
  color: #000;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}
#expected-users span:hover {
  background-color: #ddd;
}
</style>