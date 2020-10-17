<template>
  <div style="position:relative; overflow:auto;">
    <!--userprofile-->

    <div class="card">
      <div class="card-body pattern-1">
        <div class="wideget-user">
          <div class="row">
            <div class="col-lg-12 col-md-12">
              <div class="wideget-user-desc text-center">
                <div class="profile-image-container">
                  <img
                    src="
                            /assets/images/users/user.svg
                    "
                    alt="user"
                  />
                  <div class="image-edit">
                    <label
                      for="file-image"
                      data-toggle="modal"
                      data-target="#updateProfilePicModal"
                    >
                      <i class="fas fa-edit"></i>
                    </label>
                  </div>
                </div>
                <div class="user-wrap wideget-user-info">
                  <h4 class="font-weight-semibold text-white">
                    Demo School
                  </h4>
                  <span class="text-white pt-5">
                    City:
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--end userprofile-->

    <div class="card">
      <div class="card-header">
        <a href="#" class="card-options-collapse" data-toggle="card-collapse">
          <div class="d-flex">
            <i class="fe fe-chevron-up mr-2" style="line-height:1.4"></i>
            <h3 class="card-title">School Details</h3>
          </div>
        </a>

        <div class="card-options">
          <button class="btn btn-sm btn-secondary basic_detail">Edit</button>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-sm-6">
            <div class="form-group">
              <label class="form-label"
                >Name of School<span style="color:rgb(238,0,0)">*</span></label
              >
              <input
                type="text"
                class="form-control"
                placeholder="Name of School"
                readonly
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >Affiliated to <span style="color:rgb(238,0,0)">*</span></label
              >
              <input
                type="text"
                class="form-control"
                placeholder="Board"
                readonly
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >School Level <span style="color:rgb(238,0,0)">*</span></label
              >
              <input
                type="text"
                class="form-control"
                placeholder="Primary/Secondary"
                readonly
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >Establishment Year
                <span style="color:rgb(238,0,0)">*</span></label
              >
              <input
                type="text"
                class="form-control"
                placeholder="--Select Year--"
                readonly
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >Country<span style="color:rgb(238,0,0)">*</span></label
              >
              <select
                class="form-control select2-show-search border-bottom-0 w-100 select2-show-search"
                data-placeholder="Select"
              >
                <optgroup label="Categories">
                  <option>--Select--</option>
                  <option value="1">Germany</option>
                  <option value="2">Italy</option>
                  <option value="3">Canada</option>
                  <option value="4">US</option>
                  <option value="5">Afghanistan</option>
                  <option value="6">Albania</option>
                  <option value="7">China</option>
                  <option value="8">Denmark</option>
                  <option value="9">Finland</option>
                  <option value="10">India</option>
                  <option value="11">Kiribati</option>
                  <option value="12">Kuwait</option>
                  <option value="13">Mexico</option>
                  <option value="14">Japan</option>
                </optgroup>
              </select>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >State<span style="color:rgb(238,0,0)">*</span></label
              >
              <input
                type="text"
                class="form-control"
                placeholder="State"
                readonly
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >City<span style="color:rgb(238,0,0)">*</span></label
              >
              <input
                type="text"
                class="form-control"
                placeholder="City"
                readonly
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label">Locality</label>
              <input
                type="text"
                class="form-control"
                placeholder="Locality"
                readonly
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >Email Id<span style="color:rgb(238,0,0)">*</span></label
              >
              <input
                type="email"
                class="form-control"
                placeholder="Email"
                readonly
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >Mobile No.<span style="color:rgb(238,0,0)">*</span></label
              >
              <input
                type="tel"
                class="form-control"
                placeholder="9xxxxxxxxx"
                pattern="[0-9]{10}"
                readonly
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-4 ">
            <div class="form-group">
              <label class="form-label"
                >Codevidhya Curriculum<span style="color:rgb(238,0,0)"
                  >*</span
                ></label
              >
              <input
                type="text"
                class="form-control"
                placeholder="Annual Curriculum"
                readonly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <a href="#" class="card-options-collapse" data-toggle="card-collapse">
          <div class="d-flex">
            <i class="fe fe-chevron-up mr-2" style="line-height:1.4"></i>
            <h3 class="card-title">Account Settings</h3>
          </div>
        </a>

        <div class="card-options">
          <button
            class="btn btn-sm btn-secondary basic_detail"
            @click="editAccountDetail()"
          >
            Edit
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-4 col-sm-6 col-xs-12">
            <span>Username: </span>
            <span>{{ userProfile.length ? userProfile[0].Username : "" }}</span>
          </div>
          <div class="col-md-4 col-sm-6 col-xs-12">
            <span>Password: </span>
          </div>
        </div>
        <div class="row"></div>
      </div>
    </div>
  </div>
</template>
<script>
import AuthMixin from "@/mixins/AuthMixin.js";
import moment from "vue-moment";
import axios from "axios";
export default {
  mixins: [AuthMixin],
  components: {},
  data() {
    return {
      userId: 0,
      isSignedIn: "",
      sch_id: "",
      countries: [],
      states: [],
      cities: [],
      estabYear: [],
      schoolLevel: [],
      affiliatedTo: [],
      userProfile: [],
      role_id: 0,
      schoolDetailEdit: 0,
      show1: 0,
      select_instname: "",
      select_affiliatedTo: 0,
      select_schoolLevel: 0,
      select_estabYear: 0,
      select_country: 0,
      select_state: 0,
      select_city: 0,
      select_locality: "",
      mobile_no: "",
      codevidhya_curriculum: "",
      account_setting: 0
    };
  },

  beforeCreate() {},
  created() {},

  mounted: function() {
    hideTawk();
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.role_id = this.$store.getters.getAuthData.auth_role_id;
          this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
          this.getServerTime();
        }
      }.bind(this)
    );
  },
  updated() {},
  methods: {
    getstates(e) {
      let vm = this;
      let c_name = $(e.currentTarget).val();
      this.getAllStates(c_name);
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
    getcities() {
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
    editSchoolDetailsReset() {
      this.schoolDetailEdit = 0;
    },
    editAccountDetail(event) {
      if (event.currentTarget.innerText == "Edit") {
        this.account_setting = 1;
        event.currentTarget.innerText = "Save";
        $(event.currentTarget).removeClass("btn-secondary");
        $(event.currentTarget).addClass("btn-success");
      } else {
        this.account_setting = 0;
        event.currentTarget.innerText = "Edit";
        $(event.currentTarget).removeClass("btn-success");
        $(event.currentTarget).addClass("btn-secondary");
        const password = $("#school_password").val();
      }
    },
    getServerTime: function() {
      let vm = this;
      axios.post("/api/countries/get_all_country").then(res => {
        vm.countries = res.data;
        vm.states = "";
        vm.cities = "";
      });

      axios
        .post("/api/profile/getuserInformation", {
          user_id: this.userId,
          role_id: this.role_id
        })
        .then(res => {
          if (!res.data.length) {
          } else {
            vm.userProfile = res.data;
            //if (vm.userProfile.length) {
            let c_name = vm.userProfile.length
              ? vm.userProfile[0].country
                ? vm.countries.filter(
                    x => x.name == vm.userProfile[0].country
                  )[0].shortName
                : 0
              : 0;
            vm.select_country = vm.userProfile.length
              ? vm.userProfile[0].country
                ? vm.countries.filter(
                    x => x.name == vm.userProfile[0].country
                  )[0].shortName
                : 0
              : 0;

            let s_name = vm.userProfile.length ? vm.userProfile[0].state : "";
            vm.select_state = vm.userProfile.length
              ? vm.userProfile[0].state
                ? vm.userProfile[0].state
                : 0
              : 0;
            vm.select_city = vm.userProfile.length
              ? vm.userProfile[0].select_city
                ? vm.userProfile[0].select_city
                : 0
              : 0;
            vm.select_instname = vm.userProfile.length
              ? vm.userProfile[0].sch_name
                ? vm.userProfile[0].sch_name
                : ""
              : "";
            vm.mobile_no = vm.userProfile.length
              ? vm.userProfile[0].contact
                ? vm.userProfile[0].contact
                : ""
              : "";
            if (c_name != 0) vm.getAllStates(c_name);
            if (s_name && c_name) vm.getAllCities(s_name, c_name);
            //}
          }
        });
    }
  },
  beforeDestroy() {
    showTawk();
  }
};
</script>
<style lang="scss" scoped>
.card {
  margin-bottom: 0px;
}
.profile-image-container {
  position: relative;
  padding: 24px;
  width: 128px;
  margin: 0 auto;
  padding: 0;
  text-align: center;
  img {
    width: 128px;
    height: 128px;
    border-radius: 50%;
    border: 4px solid #fff;
  }
  .image-edit {
    position: absolute;
    right: 0;
    bottom: 0;
    label {
      cursor: pointer;
    }
    i {
      width: 28px;
      height: 28px;
      padding-left: 2px;
      border-radius: 50%;
      background: #fff;
      color: #000;
      text-align: center;
      line-height: 28px;
    }
  }
}
</style>
