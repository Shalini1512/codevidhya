<template>
  <div style="position:relative;overflow:auto;height:100%;margin-top:59px;">
    <div class="card">
      <div class="card-header bg-secondary">
        <h3 class="card-title text-white">Edit Profile</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >Name<span style="color:rgb(238,0,0)">*</span></label
              >
              <input
                type="text"
                class="form-control"
                placeholder="Name"
                readonly
                disabled="true"
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >Age<span style="color:rgb(238,0,0)">*</span></label
              >
              <input
                type="number"
                class="form-control"
                placeholder="Age"
                readonly
                disabled
                :value="
                  editProfile.length
                    ? editProfile[0].age
                      ? editProfile[0].age
                      : ''
                    : ''
                "
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >Sex<span style="color:rgb(238,0,0)">*</span></label
              >
              <select class="form-control">
                <option selected disabled>Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >DOB<span style="color:rgb(238,0,0)">*</span></label
              >
              <p
                class="form-control"
                style="background-color:#e0e8f3;"
                v-if="
                  editProfile.length
                    ? editProfile[0].dob
                      ? true
                      : false
                    : false
                "
              >
                {{ $moment(editProfile[0].dob).format("YYYY-MM-DD") }}
              </p>
              <input
                v-else
                type="date"
                :max="$moment().format('YYYY-MM-DD')"
                :min="'2000-01-01'"
                v-model="editProfile[0].dob"
                class="form-control"
                placeholder="DOB"
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >School<span style="color:rgb(238,0,0)">*</span></label
              >
              <input
                type="text"
                class="form-control"
                placeholder="School Name"
                readonly
                :value="userProfile[0].sch_name"
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >Grade<span style="color:rgb(238,0,0)">*</span></label
              >
              <p
                class="form-control"
                style="background-color:#e0e8f3;"
                v-if="
                  userProfile.length
                    ? userProfile[0].cls_id
                      ? true
                      : false
                    : false
                "
              >
                {{ userProfile[0].cls_id }}
              </p>
              <select
                v-else
                class="form-control"
                :value="userProfile[0].cls_name"
              >
                <option selected disabled>Select Grade</option>
                <option
                  v-for="(clas, cls_index) in classes"
                  v-bind:key="cls_index"
                  >{{ clas.cls_name }}</option
                >
              </select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >Section<span style="color:rgb(238,0,0)">*</span></label
              >
              <p
                class="form-control"
                style="background-color:#e0e8f3;"
                v-if="
                  userProfile.length
                    ? userProfile[0].sec_name
                      ? true
                      : false
                    : false
                "
              >
                {{ userProfile[0].sec_name }}
              </p>
              <select
                v-else
                class="form-control"
                :value="userProfile[0].sec_name"
              >
                <option selected disabled>Select Section</option>
                <option
                  v-for="(section, s_key) in sections"
                  v-bind:key="s_key"
                  >{{ section.sec_name }}</option
                >
              </select>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >School Board<span style="color:rgb(238,0,0)">*</span></label
              >
              <p
                class="form-control"
                style="background-color:#e0e8f3;"
                v-if="
                  userProfile.length
                    ? userProfile[0].board
                      ? true
                      : false
                    : false
                "
              >
                {{ userProfile[0].board }}
              </p>
              <!-- v-else-if="userProfile.length?userProfile[0].cv_pid==3 ?true:false:false"-->
              <select v-else class="form-control" @change="change_board_list">
                <option selected disabled>Select Board</option>
                <option value="1">CBSE</option>
                <option value="2">ICSE</option>
                <option value="3">IB/ICGSE</option>
                <option value="4">Other</option>
              </select>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group" v-show="show1" id="board_selection">
              <label class="form-label"
                >Other<span style="color:rgb(238,0,0)">*</span></label
              >
              <input
                type="text"
                class="form-control"
                placeholder="Enter School Board"
                v-modal="editProfile[0].board"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >Country<span style="color:rgb(238,0,0)">*</span></label
              >
              <select
                name="country"
                id="select-countries"
                class="form-control"
                @change="getstates($event)"
                v-model="editProfile[0].country"
              >
                <option value="br" selected disabled>Select Country</option>
                <option
                  v-for="(country, key) in countries"
                  :value="country.shortName"
                  v-bind:key="key"
                  >{{ country.name }}</option
                >
              </select>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >State<span style="color:rgb(238,0,0)">*</span></label
              >
              <select
                name="state"
                id="select-state"
                class="form-control"
                @change="getcities($event)"
                v-model="editProfile[0].state"
              >
                <option value="0" selected disabled>Select State</option>
                <option
                  v-for="(state, key) in states"
                  :value="state"
                  v-bind:key="key"
                  >{{ state }}</option
                >
              </select>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >City<span style="color:rgb(238,0,0)">*</span></label
              >
              <select
                name="state"
                id="select-state"
                class="form-control"
                v-model="editProfile[0].city"
              >
                <option value="0" selected disabled>Select City</option>
                <option
                  v-for="(city, key) in cities"
                  :value="city"
                  v-bind:key="key"
                  >{{ city }}</option
                >
              </select>
              <!--<input
                        type="text"
                        class="form-control"
                        placeholder="City name"
                        v-model="editProfile[0].city"
                      />-->
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >Emergency Contact No.<span style="color:rgb(238,0,0)"
                  >*</span
                ></label
              >
              <p
                class="form-control"
                style="background-color:#e0e8f3;"
                v-if="
                  userProfile.length
                    ? userProfile[0].board
                      ? true
                      : false
                    : false
                "
              >
                {{ userProfile[0].emergency_contact_no }}
              </p>
              <input
                v-else
                type="tel"
                class="form-control"
                placeholder="9xxxxxxxxx"
                pattern="[0-9]{10}"
                v-model="editProfile[0].emergency_contact_no"
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label">Email Id</label>
              <p
                class="form-control"
                style="background-color:#e0e8f3;"
                v-if="
                  userProfile.length
                    ? userProfile[0].email
                      ? true
                      : false
                    : false
                "
              >
                {{ userProfile[0].email }}
              </p>
              <input
                v-else
                type="email"
                class="form-control"
                :disabled="role_id == 3 ? true : false"
                placeholder="Email"
                v-model="editProfile[0].email"
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label">Mobile No.</label>
              <p
                class="form-control"
                style="background-color:#e0e8f3;"
                v-if="
                  userProfile.length
                    ? userProfile[0].contact
                      ? true
                      : false
                    : false
                "
              >
                {{ userProfile[0].contact }}
              </p>
              <input
                v-else
                type="tel"
                class="form-control"
                placeholder="9xxxxxxxxx"
                pattern="[0-9]{10}"
                readonly
                v-model="editProfile[0].contact"
                :disabled="role_id == 3 ? true : false"
              />
            </div>
          </div>
        </div>
        <!--Father's details-->
        <label class="form-label text-dark font-weight-bold"
          >Father's Details</label
        >
        <div class="row">
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >Father's Name<span style="color:rgb(238,0,0)">*</span></label
              >
              <input
                type="text"
                class="form-control"
                placeholder="Father Name"
                v-modal="editProfile[0].father_name"
                :value="editProfile[0].father_name"
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label">Father's Email Id</label>
              <input
                type="text"
                class="form-control"
                placeholder="father email id"
                v-modal="editProfile[0].father_email_id"
                :value="editProfile[0].fcontact_no"
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >Father's Mobile No.<span style="color:rgb(238,0,0)"
                  >*</span
                ></label
              >
              <input
                type="text"
                class="form-control"
                placeholder="Mobile No"
                v-modal="editProfile[0].fcontact_no"
                :value="editProfile[0].fcontact_no"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label">Employer Name</label>
              <input
                type="text"
                class="form-control"
                placeholder="Employer Name"
                v-modal="editProfile[0].f_employer_name"
                :value="editProfile[0].f_employer_name"
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label">Designation</label>
              <input
                type="text"
                class="form-control"
                placeholder="designation"
                v-modal="editProfile[0].f_designation"
                :value="editProfile[0].f_designation"
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >Address<span style="color:rgb(238,0,0)">*</span></label
              >
              <input
                type="text"
                class="form-control"
                placeholder="address"
                v-modal="editProfile[0].f_address"
                :value="editProfile[0].f_address"
              />
            </div>
          </div>
        </div>
        <!--Mother's Details-->
        <label class="form-label text-dark font-weight-bold"
          >Mother's Details</label
        >
        <div class="row">
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >Mother's Name<span style="color:rgb(238,0,0)">*</span></label
              >
              <input
                type="text"
                class="form-control"
                placeholder="Mother Name"
                v-modal="editProfile[0].mother_name"
                :value="editProfile[0].mother_name"
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label">Mother's Email Id</label>
              <input
                type="text"
                class="form-control"
                placeholder="mother email_id"
                v-modal="editProfile[0].mother_mail_id"
                :value="editProfile[0].mother_mail_id"
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label">Mother's Mob. No.</label>
              <input
                type="text"
                class="form-control"
                placeholder="Mother mobile no"
                v-modal="editProfile[0].mother_mob_no"
                :value="editProfile[0].mother_mob_no"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label">Employer Name</label>
              <input
                type="text"
                class="form-control"
                placeholder="Employer Name"
                v-modal="editProfile[0].m_employer_name"
                :value="editProfile[0].m_employer_name"
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label">Designation</label>
              <input
                type="text"
                class="form-control"
                placeholder="Designation"
                v-modal="editProfile[0].m_designation"
                :value="editProfile[0].m_designation"
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label">Mother Address</label>
              <input
                type="text"
                class="form-control"
                placeholder="Designation"
                v-modal="editProfile[0].m_address"
                :value="editProfile[0].m_address"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer text-right">
        <button class="btn btn-success" @click="updateProfileInfo()">
          Save
        </button>
        <button
          class="btn btn-danger ml-2"
          @click="editCancelProfile('cancel')"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AuthMixin from "@/mixins/AuthMixin.js";
import moment from "vue-moment";
import axios from "axios";
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import Footer from "@/components/footer/Footer.vue";
import SideNav from "@/components/dashboard/SideNav.vue";
export default {
  name: "editstudentprofile",
  props: { userProfile: Array },
  mixins: [AuthMixin],
  components: {
    Header,
    Footer,
    SideNav
  },
  data() {
    return {
      userId: 0,
      isSignedIn: "",
      sch_id: this.$store.getters.getAuthData.auth_sch_id,
      countries: [],
      states: [],
      cities: [],
      sections: [],
      classes: [],
      // userProfile: [],
      editProfile: [
        {
          sch_id: "",
          user_id: "",
          role_id: "",
          contact: "",
          email: "",
          dob: "",
          password: "",
          address: "",
          state: "",
          city: "",
          pin_code: "",
          name: "",
          board: "",
          age: "",
          country: "",
          sex: "",
          emergency_contact_no: "",
          father_name: "",
          father_email_id: "",
          fcontact_no: "",
          f_employer_name: "",
          f_designation: "",
          mother_name: "",
          mother_mail_id: "",
          mother_mob_no: "",
          m_designation: "",
          m_employer_name: "",
          f_address: "",
          m_address: "",
          sch_name: ""
        }
      ],
      profilePic: "",
      profilePicData: new FormData(),
      show1: 0
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted: function() {
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.user_id = this.$store.getters.getAuthData.auth_user_id;
          this.role_id = this.$store.getters.getAuthData.auth_role_id;
          this.getServerTime();
        }
      }.bind(this)
    );
  },
  methods: {
    editCancelProfile(e) {
      this.$emit("cancelEdit", e);
    },
    change_board_list(event) {
      let other_board = $(event.currentTarget).val();
      if (other_board == 4 || other_board == "4") {
        this.show1 = 1;
      } else {
        this.show1 = 0;
      }
    },
    openModal: function(modalId) {
      $("#" + modalId + " > div").removeClass("visible");
      showModal($("#" + modalId));
    },
    getstates: function(e) {
      let vm = this;
      let c_name = $(e.currentTarget).val();
      axios
        .post("/api/countries/get_all_state", { shortname: c_name })
        .then(res => {
          vm.states = res.data;
          vm.cities = "";
        });
    },
    getcities: function(e) {
      let s_name = $(e.currentTarget).val();
      let vm = this;
      axios
        .post("/api/countries/get_all_cities", {
          shortname: vm.editProfile[0].country,
          state: s_name
        })
        .then(res => {
          vm.cities = res.data;
        });
    },
    getServerTime: function() {
      let vm = this;
      this.$http.post("/api/user/getServerTime").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.serverTime = res.body.serverTime;
          this.getProfileInformation();
        }
      });
    },
    getProfileInformation: function() {
      let vm = this;
      axios.post("/api/profile/getAllSections").then(res => {
        vm.sections = res.data;
      });
      axios.post("/api/profile/getAllClass").then(res => {
        vm.classes = res.data;
      });

      axios.post("/api/countries/get_all_country").then(res => {
        vm.countries = res.data;
        vm.states = "";
        vm.cities = "";
      });
      axios
        .post("/api/profile/getUserInformation", {
          user_id: this.userId,
          role_id: this.role_id
        })
        .then(res => {
          this.userProfile = res.data.result;
          this.editProfile[0].name = this.userProfile[0].name;
          this.editProfile[0].sch_id = this.userProfile[0].sch_id;
          this.editProfile[0].user_id = this.userProfile[0].user_id;
          this.editProfile[0].role_id = this.userProfile[0].role_id;
          this.editProfile[0].contact = this.userProfile[0].contact;
          this.editProfile[0].email = this.userProfile[0].email;
          this.editProfile[0].dob = this.userProfile[0].dob
            ? this.$moment(this.userProfile[0].dob).format("YYYY-MM-DD")
            : this.$moment().format("YYYY-MM-DD");
          this.editProfile[0].password = this.userProfile[0].password;
          this.editProfile[0].address = this.userProfile[0].address;
          this.editProfile[0].state = this.userProfile[0].state;
          this.editProfile[0].city = this.userProfile[0].city;
          this.editProfile[0].pin_code = this.userProfile[0].pin_code;
          this.editProfile[0].name = this.userProfile[0].name;
          this.editProfile[0].board = this.userProfile[0].board;
          this.editProfile[0].age = this.userProfile[0].age;
          this.editProfile[0].sex = this.userProfile[0].sex;
          this.editProfile[0].emergency_contact_no = this.userProfile[0].emergency_contact_no;
          this.editProfile[0].father_name = this.userProfile[0].father_name;
          this.editProfile[0].father_email_id = this.userProfile[0].father_email_id;
          this.editProfile[0].fcontact_no = this.userProfile[0].fcontact_no;
          this.editProfile[0].f_employer_name = this.userProfile[0].f_employer_name;
          this.editProfile[0].f_designation = this.userProfile[0].f_designation;
          this.editProfile[0].f_address = this.userProfile[0].f_address;
          this.editProfile[0].mother_name = this.userProfile[0].mother_name;
          this.editProfile[0].mother_email_id = this.userProfile[0].mother_email_id;
          this.editProfile[0].mcontact_no = this.userProfile[0].mcontact_no;
          this.editProfile[0].m_employer_name = this.userProfile[0].m_employer_name;
          this.editProfile[0].m_designation = this.userProfile[0].m_designation;
          this.editProfile[0].m_address = this.userProfile[0].m_address;
        });
    },
    updateProfileInfo: function() {
      this.$http
        .post("/api/profile/updateUserProfileInfo", {
          editProfile: this.editProfile
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            if (res.body.data == "done") {
              cvNotify(
                "You have successfully updated your profile details.",
                "success"
              );
              this.getProfileInformation();
            }
          }
        });
    },
    updateProfilePic: function() {
      this.$http
        .post("/api/profile/updateUserProfilePic", this.profilePicData)
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            if (res.body.data == "done") {
              this.getProfileInformation();
              cvNotify(
                "You have successfully updated your profile picture.",
                "success"
              );
              $("#closeProfilePicModalButton").click();
              this.profilePicData = new FormData();
            }
          }
        });
    },
    removeProfilePic() {
      if (this.userProfile[0].profile_pic) {
        this.profilePicData.append("sch_id", this.sch_id);
        this.profilePicData.append("user_id", this.user_id);
        this.profilePicData.append(
          "oldFileName",
          this.userProfile[0].profile_pic
        );
        var vm = this;
        showConfirmationDialog({
          title: "Remove Profile Picture",
          message: "Do you really want to remove your profile picture?",
          callback: function(type) {
            if (type == "positive") {
              vm.updateProfilePic();
            }
          },
          positiveButton: "Delete",
          positiveButtonClass: "negative"
        });
      } else {
        cvNotify("There is no profile Picture.", "info");
      }
    },
    uploadFile: function() {
      var fileInput = document.getElementById("profile-file-input");
      var file = fileInput.files[0];
      var url = URL.createObjectURL(file);
      if (file) {
        if (fileInput.files[0].size > 102400) {
          cvNotify("Image should be less than 100kb.", "warning");
        } else {
          this.profilePicData.append("profilePic", file);
          this.profilePicData.append("sch_id", this.sch_id);
          this.profilePicData.append("user_id", this.user_id);
          this.profilePicData.append("profleType", "update");
          this.profilePicData.append(
            "oldFileName",
            this.userProfile[0].profile_pic
          );
          $("#file-input-file-name").text("");
        }
      }
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
