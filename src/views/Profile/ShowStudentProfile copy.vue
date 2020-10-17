<template>
  <!--<div id="projects-root">
  >
   <section class="sptb" style="padding-top:16px;">
      <div class="container-fluid">
        <div class="row">
          <sideNav ref="profdata" @updateAgainEdit="updateEditFunction"></sideNav>-->

  <div
    v-if="!edit"
    style="position:relative;overflow:auto;height:100%;margin-top:0px;"
  >
    <!--Show student profile -->
    <!--Basic Details-->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Basic Details</h3>
        <div class="card-options">
          <a href="#" class="card-options-collapse" data-toggle="card-collapse"
            ><i class="fe fe-chevron-up"></i
          ></a>
          <!--<a href="#" class="card-options-remove" data-toggle="card-remove"><i class="fe fe-x"></i></a>-->
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Name:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].name : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Email:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].email : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Contact No.:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].contact : ""
            }}</span></span
          >
        </div>
        <div class="row my-2">
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">DOB:</span>
            <span class="flex-grow-1">{{
              userProfile.length
                ? $moment(userProfile[0].dob).format("DD-MM-YYYY")
                : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Age:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].age : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Sex:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].sex : ""
            }}</span></span
          >
        </div>
        <div class="row">
          <span class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Institute Name:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].sch_name : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">School Board:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].board : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Grade:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].cls_id : ""
            }}</span></span
          >
        </div>
        <div class="row my-2">
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Section:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].sec_name : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Country:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].country : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">State:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].state : ""
            }}</span></span
          >
        </div>
        <div class="row">
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">City:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].city : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Address:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].address : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold"
              >Emergency Contact No.:</span
            >
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].emergency_contact_no : ""
            }}</span></span
          >
        </div>
      </div>
    </div>
    <!--end Basic Details-->

    <!--father details-->
    <div class="card m-0 p-0">
      <div class="card-header">
        <h3 class="card-title">Father's Details</h3>
        <div class="card-options">
          <a href="#" class="card-options-collapse" data-toggle="card-collapse"
            ><i class="fe fe-chevron-up"></i
          ></a>
          <a href="#" class="card-options-remove" data-toggle="card-remove"
            ><i class="fe fe-x"></i
          ></a>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Name:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].father_name : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Email:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].father_email_id : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Mobile No:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].fcontact_no : ""
            }}</span></span
          >
        </div>
        <div class="row my-2">
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Employer Name:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].f_employer_name : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Designation:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].f_designation : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Address:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].f_address : ""
            }}</span></span
          >
        </div>
      </div>
    </div>
    <!--end father details-->
    <!--Mother Details-->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Mother's Details</h3>
        <div class="card-options">
          <a href="#" class="card-options-collapse" data-toggle="card-collapse"
            ><i class="fe fe-chevron-up"></i
          ></a>
          <a href="#" class="card-options-remove" data-toggle="card-remove"
            ><i class="fe fe-x"></i
          ></a>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Name:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].mother_name : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Email:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].m_email_id : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Mobile No:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].m_contact_no : ""
            }}</span></span
          >
        </div>
        <div class="row my-2">
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Employer Name:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].m_employer_name : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Designation:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].m_employer_name : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Address:</span>
            <span class="flex-grow-1">{{
              userProfile.length ? userProfile[0].m_address : ""
            }}</span></span
          >
        </div>
      </div>
    </div>
    <!--end mother details-->
    <div class="card">
      <div class="card-header">
        <div class="card-title d-flex flex-grow-1 font-weight-bold">
          Profile
        </div>
        <div class="">
          <button class="btn btn-secondary" @click="editProfiles()">
            Edit
          </button>
        </div>
      </div>
      <div class="card-body">
        <table class="table">
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Name</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].name : "" }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Age</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].age : "" }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Sex</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].sex : "" }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">DOB</td>
            <td class="col-sm-10">
              {{
                userProfile.length
                  ? $moment(userProfile[0].dob).format("DD-MM-YYYY")
                  : ""
              }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Institute Name</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].sch_name : "" }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Grade</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].cls_id : "" }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Section</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].sec_name : "" }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">School Board</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].board : "" }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Country</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].country : "" }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">State</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].state : "" }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">City</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].city : "" }}
            </td>
          </tr>

          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Emergency Contact No.</td>
            <td class="col-sm-10">
              {{
                userProfile.length ? userProfile[0].emergency_contact_no : ""
              }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Email Id</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].email : "" }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Contact No.</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].contact : "" }}
            </td>
          </tr>
        </table>

        <h5>Father's Details</h5>
        <table class="table">
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Father's Name</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].father_name : "" }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Father's Email Id</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].father_email_id : "" }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Father's Mobile No.</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].fcontact_no : "" }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Employer Name</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].f_employer_name : "" }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Designation</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].f_designation : "" }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Address</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].f_address : "" }}
            </td>
          </tr>
        </table>

        <h5>Mother's Details</h5>
        <table class="table">
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Mother's Name</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].mother_name : "" }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Mother's Email Id</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].m_email_id : "" }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Mother's Mobile No.</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].m_contact_no : "" }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Employer Name</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].m_employer_name : "" }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Designation</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].m_employer_name : "" }}
            </td>
          </tr>
          <tr class="row">
            <td class="col-sm-2 font-weight-bold">Address</td>
            <td class="col-sm-10">
              {{ userProfile.length ? userProfile[0].m_address : "" }}
            </td>
          </tr>
        </table>
      </div>
    </div>
    <!--End Show student profile -->
  </div>
  <editStudentProfile
    v-else
    :userProfile="userProfile"
    @cancelEdit="updateEditFunction"
  />
  <!--</div>
      </div>
    </section>
    

    <Footer />
    <div
      class="modal fade"
      id="updateProfilePicModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="updateProfilePicModal"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Upload Profile Picture
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="col-md-12">
              <div class="form-group mb-0">
                
                <div class="custom-file">
                  <input
                    type="file"
                    id="profile-file-input"
                    class="custom-file-input"
                    name="example-file-input-custom"
                    accept=".jpg, .png, .jpeg"
                    v-on:change="uploadFile()"
                  />
                  <label class="custom-file-label">Choose file</label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="updateProfilePic()"
            >
              Save
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              id="closeProfilePicModalButton"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>-->
</template>
<script>
import AuthMixin from "@/mixins/AuthMixin.js";
import moment from "vue-moment";
import axios from "axios";
import editStudentProfile from "@/views/Profile/EditStudentProfile.vue";
export default {
  mixins: [AuthMixin],
  components: {
    editStudentProfile
  },
  props: ["edit"],
  data() {
    return {
      userId: 0,
      isSignedIn: "",
      userProfile: [],
      role_id: 0
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
          this.role_id = this.$store.getters.getAuthData.auth_role_id;
          this.getServerTime();
        }
      }.bind(this)
    );
  },
  methods: {
    updateEditFunction(updateEdit) {
      this.edit = 0;
    },
    editProfiles: function() {
      this.edit = 1;
    },
    checkEvent: function(e) {
      //console.log(e);
    },
    getServerTime: function() {
      let vm = this;
      axios
        .post("/api/profile/getUserInformation", {
          user_id: this.userId,
          role_id: this.role_id
        })
        .then(res => {
          if (!res.data.length) {
            //vm.$router.push("/login");
          } else {
            vm.userProfile = res.data;
          }
        });
    }
  }
};
</script>
<style scoped>
.card {
  margin-bottom: 0px;
}
</style>
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
