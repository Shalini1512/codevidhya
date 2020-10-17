<template>
  <!--<div id="projects-root">
  >
   <section class="sptb" style="padding-top:16px;">
      <div class="container-fluid">
        <div class="row">
          <sideNav ref="profdata" @updateAgainEdit="updateEditFunction"></sideNav>-->

  <div style="position:relative;overflow:auto;height:100%;margin-top:59px;">
    <!--Show student profile -->
    <!--userprofile-->

    <div class="row">
      <div class="card-body pattern-1">
        <div class="wideget-user">
          <div class="row">
            <div class="col-lg-12 col-md-12">
              <div class="wideget-user-desc text-center">
                <div class="profile-pic-img">
                  <img
                    class="brround"
                    :src="
                      userProfile.length
                        ? userProfile[0].profile_pic
                          ? '/dynamic/profiles/' + userProfile[0].profile_pic
                          : '/assets/images/users/user.svg'
                        : '/assets/images/users/user.svg'
                    "
                    alt="img"
                  />
                  <div class="image-upload">
                    <label for="file-input">
                      <i class="fa fa-camera" />
                    </label>
                    <input id="file-input" type="file" style="display:none" />
                  </div>
                </div>
                <div class="user-wrap wideget-user-info pt-2">
                  <h4 class="font-weight-semibold text-white">
                    {{
                      userProfile.length
                        ? userProfile[0].name
                          ? userProfile[0].name
                          : ""
                        : ""
                    }}
                  </h4>
                  <span
                    class="text-white"
                    v-if="
                      userProfile.length
                        ? userProfile[0].cls_id
                          ? true
                          : false
                        : false
                    "
                    >Grade: {{ romanize(userProfile[0].cls_id) }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--end userprofile-->

    <!--Basic Details-->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Basic Details</h3>
        <div class="card-options">
          <button
            class="btn btn-secondary basic_detail"
            @click="editBasicDetails($event)"
          >
            Edit
          </button>
          <button
            v-if="basicDetailEdit == 1"
            class="btn btn-danger mx-1"
            @click="editBasicDetailsReset($event)"
          >
            Cancel
          </button>
          <a href="#" class="card-options-collapse" data-toggle="card-collapse"
            ><i class="fe fe-chevron-up"></i
          ></a>
          <!--<a href="#" class="card-options-remove" data-toggle="card-remove"><i class="fe fe-x"></i></a>-->
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold"
              >Name<span style="color:rgb(238,0,0)">*</span>: </span
            ><span v-if="basicDetailEdit" class="flex-grow-1"
              ><label
                ><input
                  class="student_input"
                  style="color: #2e384d;opacity:1"
                  type="text"
                  id="name"
                  placeholder="Name"
                  :value="
                    userProfile.length ? userProfile[0].name : ''
                  "/></label></span
            ><span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].name : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold"
              >Email<span style="color:rgb(238,0,0)">*</span>: </span
            ><span v-if="basicDetailEdit" class="flex-grow-1"
              ><label
                ><input
                  class="student_input"
                  style="color: #2e384d;opacity:1"
                  type="text"
                  id="email"
                  placeholder="Email"
                  :value="
                    userProfile.length ? userProfile[0].email : ''
                  "/></label
            ></span>
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].email : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1  font-weight-bold">Contact No.: </span
            ><span v-if="basicDetailEdit" class="flex-grow-1"
              ><label
                ><input
                  class="student_input"
                  style="color: #2e384d;opacity:1"
                  type="text"
                  id="contact_no"
                  placeholder="Contact no"
                  v-model="contact_no"/></label
            ></span>
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].contact : ""
            }}</span></span
          >
        </div>
        <div class="row my-2">
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">DOB: </span
            ><span v-if="basicDetailEdit" class="flex-grow-1"
              ><label
                ><input
                  class="student_input"
                  @change="agecalculate($event)"
                  :max="$moment().format('YYYY-MM-DD')"
                  :min="'1990-01-01'"
                  style="color: #2e384d;opacity:1"
                  type="date"
                  id="dob"
                  v-model="select_dob"/></label
            ></span>
            <span v-else class="flex-grow-1">{{
              userProfile.length
                ? $moment(userProfile[0].dob).format("DD-MM-YYYY")
                : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Age: </span>
            <span class="flex-grow-1">{{
              userProfile.length ? myage : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Sex: </span
            ><span v-if="basicDetailEdit" class="flex-grow-1"
              ><label>
                <select
                  class="student_input form-control "
                  id="sex"
                  style="color: #2e384d;opacity:1"
                  v-model="select_sex"
                >
                  <option disabled value="0">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select></label
              ></span
            >
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].sex : ""
            }}</span></span
          >
        </div>
        <div class="row">
          <span class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Institute Name: </span
            ><span v-if="basicDetailEdit && sch_id == 1" class="flex-grow-1"
              ><label
                ><input
                  class="student_input"
                  style="color: #2e384d;opacity:1"
                  type="text"
                  id="institute_name"
                  placeholder="Institute Name"
                  v-model="select_instname"/></label
            ></span>
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].sch_name : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">School Board: </span
            ><span v-if="basicDetailEdit && sch_id == 1" class="flex-grow-1"
              ><label
                ><select
                  class="form-control student_input"
                  id="board"
                  v-model="select_board"
                  @change="change_board"
                >
                  <option selected value="0" disabled>Select Board</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="IB/ICGSE">IB/ICGSE</option>
                  <option value="4">Other</option>
                </select></label
              ></span
            >
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].board : ""
            }}</span></span
          >
          <span v-if="show1" class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Other: </span
            ><span v-if="basicDetailEdit && sch_id == 1" class="flex-grow-1"
              ><label
                ><input
                  class="student_input"
                  style="color: #2e384d;opacity:1"
                  type="text"
                  id="student_other_board"
                  placeholder="Board Name"
                  v-model="other_board"/></label
            ></span>
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].cls_id : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Grade: </span
            ><span v-if="basicDetailEdit" class="flex-grow-1"
              ><label>
                <select
                  class="form-control student_input"
                  id="grade"
                  v-model="select_grade"
                  @change="gradeChange($event)"
                >
                  <option selected disabled value="0">Select Grade</option>
                  <option
                    v-for="(clas, cls_index) in classes"
                    v-bind:key="cls_index"
                    :value="clas.cls_id"
                    >{{ clas.cls_name }}</option
                  >
                  <option v-if="sch_id == 1" value="other">other</option>
                </select>
              </label></span
            >
            <span v-else class="flex-grow-1">{{
              userProfile.length
                ? userProfile[0].cls_id == 0
                  ? userProfile[0].other_grade
                  : userProfile[0].cls_id
                : ""
            }}</span></span
          >

          <span
            v-if="
              ((userProfile.length
                ? userProfile[0].other_grade
                  ? true
                  : false
                : false) ||
                other_grade) &&
                basicDetailEdit
            "
            class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Qualification: </span
            ><span v-if="basicDetailEdit && sch_id == 1" class="flex-grow-1"
              ><label
                ><input
                  class="student_input"
                  style="color: #2e384d;opacity:1"
                  type="text"
                  id="other_grade"
                  placeholder="Qualification"
                  v-model="qualification"/></label
            ></span>
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].cls_id : ""
            }}</span></span
          >
        </div>
        <div class="row my-2">
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Section: </span
            ><span v-if="basicDetailEdit" class="flex-grow-1"
              ><label>
                <select
                  class="form-control student_input"
                  id="section"
                  v-model="select_section"
                >
                  <option selected disabled value="0">Select Section</option>
                  <option
                    v-for="(section, s_key) in sections"
                    v-bind:key="s_key"
                    :value="section.sec_id"
                    >{{ section.sec_name }}</option
                  >
                </select></label
              ></span
            >
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].sec_name : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Country: </span
            ><span v-if="basicDetailEdit" class="flex-grow-1"
              ><label>
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
                    >{{ country.name }}</option
                  >
                </select></label
              ></span
            >
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].country : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">State: </span
            ><span v-if="basicDetailEdit" class="flex-grow-1"
              ><label>
                <select
                  name="state"
                  id="select-state"
                  class="form-control  student_input"
                  @change="getcities()"
                  v-model="select_state"
                >
                  <option value="0" selected disabled>Select State</option>
                  <option
                    v-for="(state, key) in states"
                    :value="state"
                    v-bind:key="key"
                    >{{ state }}</option
                  >
                </select></label
              ></span
            >
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].state : ""
            }}</span></span
          >
        </div>
        <div class="row">
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">City: </span
            ><span v-if="basicDetailEdit" class="flex-grow-1"
              ><label>
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
                    >{{ city }}</option
                  >
                </select></label
              ></span
            >
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].city : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Address: </span
            ><span v-if="basicDetailEdit" class="flex-grow-1"
              ><label
                ><textarea
                  id="address"
                  class="form-control student_input"
                  rows="5"
                  cols="45"
                  placeholder="Address"
                  v-model="address"
                ></textarea></label
            ></span>
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].address : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold"
              >Emergency Contact No.: </span
            ><span v-if="basicDetailEdit" class="flex-grow-1"
              ><label>
                <input
                  class="student_input"
                  style="color: #2e384d;opacity:1"
                  type="text"
                  id="student_emergency_contact_no"
                  placeholder="Emergency Contact no"
                  v-model="emergency_contact_no"/></label
            ></span>
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].emergency_contact_no : ""
            }}</span></span
          >
        </div>
      </div>
    </div>
    <!--end Basic Details-->
    <!--Account Setting-->
    <div class="card card-collapsed">
      <div class="card-header">
        <h3 class="card-title">Account Setting</h3>
        <div class="card-options">
          <button
            id="account-detail-edit"
            class="btn btn-secondary"
            @click="editAccountDetail"
          >
            Edit
          </button>
          <button
            v-if="account_setting == 1"
            class="btn btn-danger mx-1"
            @click="editAccountDetailsReset($event)"
          >
            Cancel
          </button>
          <a href="#" class="card-options-collapse" data-toggle="card-collapse"
            ><i class="fe fe-chevron-up"></i
          ></a>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Username: </span>
            <span v-if="account_setting == 2" class="flex-grow-1"
              ><label
                ><input
                  class="account_input"
                  style="color: #2e384d;opacity:1"
                  type="text"
                  id="student_username"
                  placeholder="Name"
                  :value="
                    userProfile.length ? userProfile[0].username : ''
                  "/></label></span
            ><span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].username : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Password: </span
            ><span v-if="account_setting" class="flex-grow-1"
              ><label
                ><input
                  class="account_input"
                  style="color: #2e384d;opacity:1"
                  type="text"
                  id="student_password"
                  placeholder="Email"
                  :value="
                    userProfile.length ? userProfile[0].password : ''
                  "/></label
            ></span>
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].password : ""
            }}</span></span
          >
        </div>
      </div>
    </div>
    <!--end Account setting-->
    <!--father details-->
    <div class="card card-collapsed">
      <div class="card-header">
        <h3 class="card-title">Father's Details</h3>
        <div class="card-options">
          <button
            id="father-detail-edit"
            class="btn btn-secondary"
            @click="editFatherDetail"
          >
            Edit
          </button>
          <button
            v-if="fatherDetailEdit == 1"
            class="btn btn-danger mx-1"
            @click="editFatherDetailsReset($event)"
          >
            Cancel
          </button>
          <a href="#" class="card-options-collapse" data-toggle="card-collapse"
            ><i class="fe fe-chevron-up"></i
          ></a>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Name: </span>
            <span v-if="fatherDetailEdit" class="flex-grow-1"
              ><label
                ><input
                  class="father_input"
                  style="color: #2e384d;opacity:1"
                  type="text"
                  id="father_name"
                  placeholder="Name"
                  :value="
                    userProfile.length ? userProfile[0].father_name : ''
                  "/></label></span
            ><span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].father_name : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Email: </span
            ><span v-if="fatherDetailEdit" class="flex-grow-1"
              ><label
                ><input
                  class="father_input"
                  style="color: #2e384d;opacity:1"
                  type="text"
                  id="father_email_id"
                  placeholder="Email"
                  :value="
                    userProfile.length ? userProfile[0].father_email_id : ''
                  "/></label
            ></span>
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].father_email_id : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Mobile No: </span
            ><span v-if="fatherDetailEdit" class="flex-grow-1"
              ><label
                ><input
                  class="father_input"
                  style="color: #2e384d;opacity:1"
                  type="text"
                  id="fcontact_no"
                  placeholder="Contact No"
                  :value="
                    userProfile.length ? userProfile[0].fcontact_no : ''
                  "/></label
            ></span>
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].fcontact_no : ""
            }}</span></span
          >
        </div>
        <div class="row my-2">
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Employer Name: </span
            ><span v-if="fatherDetailEdit" class="flex-grow-1"
              ><label
                ><input
                  class="father_input"
                  style="color: #2e384d;opacity:1"
                  type="text"
                  id="f_employer_name"
                  placeholder="Employer Name"
                  :value="
                    userProfile.length ? userProfile[0].f_employer_name : ''
                  "/></label
            ></span>
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].f_employer_name : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Designation: </span
            ><span v-if="fatherDetailEdit" class="flex-grow-1"
              ><label
                ><input
                  class="father_input"
                  style="color: #2e384d;opacity:1"
                  type="text"
                  id="f_designation"
                  placeholder="Designation"
                  :value="
                    userProfile.length ? userProfile[0].f_designation : ''
                  "/></label
            ></span>
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].f_designation : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Address: </span
            ><span v-if="fatherDetailEdit" class="flex-grow-1"
              ><label
                ><textarea
                  class="form-control father_input"
                  id="f_address"
                  placeholder="Address"
                  :value="userProfile.length ? userProfile[0].f_address : ''"
                ></textarea></label
            ></span>
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].f_address : ""
            }}</span></span
          >
        </div>
      </div>
    </div>
    <!--end father details-->
    <!--Mother Details-->
    <div class="card card-collapsed">
      <div class="card-header">
        <h3 class="card-title">Mother's Details</h3>
        <div class="card-options">
          <!--<button class="btn btn-secondary" @click ="editProfiles()" >Edit</button>-->
          <button
            id="mother-detail-edit"
            class="btn btn-secondary"
            @click="editMotherDetail"
          >
            Edit
          </button>
          <button
            v-if="motherDetailEdit == 1"
            class="btn btn-danger mx-1"
            @click="editMotherDetailsReset($event)"
          >
            Cancel
          </button>
          <a href="#" class="card-options-collapse" data-toggle="card-collapse"
            ><i class="fe fe-chevron-up"></i
          ></a>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Name: </span
            ><span v-if="motherDetailEdit" class="flex-grow-1"
              ><label
                ><input
                  class="mother_input"
                  style="color: #2e384d;opacity:1"
                  type="text"
                  id="mother_name"
                  placeholder="Name"
                  :value="
                    userProfile.length ? userProfile[0].mother_name : ''
                  "/></label
            ></span>
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].mother_name : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Email: </span
            ><span v-if="motherDetailEdit" class="flex-grow-1"
              ><label
                ><input
                  class="mother_input"
                  style="color: #2e384d;opacity:1"
                  type="text"
                  id="mother_email_id"
                  placeholder="Email"
                  :value="
                    userProfile.length ? userProfile[0].mother_email_id : ''
                  "/></label
            ></span>
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].m_email_id : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Mobile No: </span>
            <span v-if="motherDetailEdit" class="flex-grow-1"
              ><label
                ><input
                  class="mother_input"
                  style="color: #2e384d;opacity:1"
                  type="text"
                  id="mcontact_no"
                  placeholder="Contact No"
                  :value="
                    userProfile.length ? userProfile[0].mcontact_no : ''
                  "/></label></span
            ><span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].m_contact_no : ""
            }}</span></span
          >
        </div>
        <div class="row my-2">
          <span class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Employer Name: </span
            ><span v-if="motherDetailEdit" class="flex-grow-1"
              ><label
                ><input
                  class="mother_input"
                  style="color: #2e384d;opacity:1"
                  type="text"
                  id="m_employer_name"
                  placeholder="Employer Name"
                  :value="
                    userProfile.length ? userProfile[0].m_employer_name : ''
                  "/></label
            ></span>
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].m_employer_name : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Designation: </span
            ><span v-if="motherDetailEdit" class="flex-grow-1"
              ><label
                ><input
                  class="mother_input"
                  style="color: #2e384d;opacity:1"
                  type="text"
                  id="m_designation"
                  placeholder="Designation"
                  :value="
                    userProfile.length ? userProfile[0].m_designation : ''
                  "/></label
            ></span>
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].m_designation : ""
            }}</span></span
          >
          <span class="col-lg-4 col-md-4 col-sm-6  col-xs-12"
            ><span class="flex-grow-1 font-weight-bold">Address: </span
            ><span v-if="motherDetailEdit" class="flex-grow-1"
              ><label
                ><textarea
                  class="form-control mother_input"
                  rows="5"
                  cols="45"
                  id="m_address"
                  placeholder="Address"
                  :value="userProfile.length ? userProfile[0].m_address : ''"
                ></textarea></label
            ></span>
            <span v-else class="flex-grow-1">{{
              userProfile.length ? userProfile[0].m_address : ""
            }}</span></span
          >
        </div>
      </div>
    </div>
    <!--end mother details-->

    <!--End Show student profile -->
  </div>
</template>
<script>
import AuthMixin from "@/mixins/AuthMixin.js";
import moment from "vue-moment";
import axios from "axios";

export default {
  mixins: [AuthMixin],

  data() {
    return {
      userId: 0,
      isSignedIn: "",
      sch_id: "",
      countries: [],
      states: [],
      cities: [],
      sections: [],
      classes: [],
      userProfile: [],
      role_id: 0,
      myage: 0,
      basicDetailEdit: 0,
      fatherDetailEdit: 0,
      account_setting: 0,
      motherDetailEdit: 0,
      show1: 0,
      other_grade: 0,
      select_grade: 0,
      select_section: 0,
      select_country: 0,
      select_state: 0,
      select_city: 0,
      select_board: 0,
      select_sex: 0,
      select_dob: "",
      select_instname: "",
      other_board: "",
      qualification: "",
      contact_no: "",
      address: "",
      emergency_contact_no: ""
    };
  },

  beforeCreate() {},
  created() {},

  mounted: function() {
    //initCvModals();
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
  methods: {
    backPreviousPart(event) {
      this.$emit("changeProfileFunctionality", event);
    },
    romanize(num) {
      var lookup = {
          M: 1000,
          CM: 900,
          D: 500,
          CD: 400,
          C: 100,
          XC: 90,
          L: 50,
          XL: 40,
          X: 10,
          IX: 9,
          V: 5,
          IV: 4,
          I: 1
        },
        roman = "",
        i;
      for (i in lookup) {
        while (num >= lookup[i]) {
          roman += i;
          num -= lookup[i];
        }
      }
      return roman;
    },
    gradeChange(e) {
      let val = $(e.currentTarget).val();
      if (val == "other") this.other_grade = 1;
      else this.other_grade = 0;
    },
    change_board(e) {
      let other_board = $(event.currentTarget).val();
      if (other_board == 4 || other_board == "4") {
        this.show1 = 1;
      } else {
        this.show1 = 0;
      }
    },
    agecalculate(e) {
      let calca = $(e.currentTarget).val();
      this.calage(calca);
    },
    calage(dob) {
      let today = new Date();
      var birthDate = new Date(dob);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1;
      }
      this.myage = age;
    },
    getstates: function(e) {
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

    editBasicDetailsReset() {
      this.basicDetailEdit = 0;
      $(".basic_detail").text("Edit");
      $(".basic_detail").removeClass("btn-success");
      $(".basic_detail").addClass("btn-secondary");
      if (this.userProfile.length) this.calage(this.userProfile[0].dob);
      else {
        let today = new Date();
        this.calage(today);
      }
    },
    editAccountDetailsReset() {
      this.account_setting = 0;
      $("#account-detail-edit").text("Edit");
      $("#account-detail-edit").removeClass("btn-success");
      $("#account-detail-edit").addClass("btn-secondary");
    },
    editFatherDetailsReset() {
      this.fatherDetailEdit = 0;
      $("#father-detail-edit").text("Edit");
      $("#father-detail-edit").removeClass("btn-success");
      $("#father-detail-edit").addClass("btn-secondary");
    },
    editMotherDetailsReset() {
      this.motherDetailEdit = 0;
      $("#mother-detail-edit").text("Edit");
      $("#mother-detail-edit").removeClass("btn-success");
      $("#mother-detail-edit").addClass("btn-secondary");
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
        const password = $("#student_password").val();
        axios
          .post("/api/profile/updateStudentPasswordProfileDetail", {
            user_id: this.userId,
            sch_id: this.sch_id,
            password: password
          })
          .then(res => {
            if (res.status == 200) {
              this.getServerTime();
              window.cvNotify("successfully updated", "success");
            }
          });
      }
    },
    editMotherDetail(event) {
      if (event.currentTarget.innerText == "Edit") {
        this.motherDetailEdit = 1;
        event.currentTarget.innerText = "Save";
        $(event.currentTarget).removeClass("btn-secondary");
        $(event.currentTarget).addClass("btn-success");
      } else {
        this.motherDetailEdit = 0;
        event.currentTarget.innerText = "Edit";
        $(event.currentTarget).removeClass("btn-success");
        $(event.currentTarget).addClass("btn-secondary");
        const user_array = this.$el.getElementsByClassName("mother_input");
        let send_data = new Object();
        user_array.forEach((element, index) => {
          send_data[element.id] = element.value;
        });
        let vm = this;
        axios
          .post("/api/profile/updateStudentMotherProfileDetail", {
            user_id: this.userId,
            sch_id: this.sch_id,
            data: send_data
          })
          .then(res => {
            // console.log(res);
            if (res.status == 200) {
              this.getServerTime();
              window.cvNotify("successfully updated", "success");
            }
          });
      }
    },
    editFatherDetail(event) {
      if (event.currentTarget.innerText == "Edit") {
        this.fatherDetailEdit = 1;
        event.currentTarget.innerText = "Save";
        $(event.currentTarget).removeClass("btn-secondary");
        $(event.currentTarget).addClass("btn-success");
      } else {
        this.fatherDetailEdit = 0;
        event.currentTarget.innerText = "Edit";
        $(event.currentTarget).removeClass("btn-success");
        $(event.currentTarget).addClass("btn-secondary");
        const user_array = this.$el.getElementsByClassName("father_input");
        let send_data = new Object();
        user_array.forEach((element, index) => {
          send_data[element.id] = element.value;
        });
        let vm = this;
        axios
          .post("/api/profile/updateStudentFatherProfileDetail", {
            user_id: this.userId,
            sch_id: this.sch_id,
            data: send_data
          })
          .then(res => {
            if (res.status == 200) {
              this.getServerTime();
              window.cvNotify("successfully updated", "success");
            }
          });
      }
    },
    editBasicDetails(event) {
      if (event.currentTarget.innerText == "Edit") {
        let Oboard = ["CBSE", "ICSE", "IB/ICGSE"];
        this.basicDetailEdit = 1;
        event.currentTarget.innerText = "Save";
        $(event.currentTarget).removeClass("btn-secondary");
        $(event.currentTarget).addClass("btn-success");
        if (
          this.select_board != 0 &&
          Oboard.indexOf(this.select_board) === -1
        ) {
          this.select_board = "4";
          this.show1 = 1;
        }
        if (
          this.userProfile.length
            ? this.userProfile.other_grade
              ? true
              : false
            : false
        ) {
          this.select_grade = "other";
          this.other_grade = 1;
        }
      } else {
        this.basicDetailEdit = 0;
        this.show1 = 0;
        this.other_grade = 0;
        event.currentTarget.innerText = "Edit";
        $(event.currentTarget).removeClass("btn-success");
        $(event.currentTarget).addClass("btn-secondary");
        const user_array = this.$el.getElementsByClassName("student_input");
        let send_data = new Object();
        user_array.forEach((element, index) => {
          send_data[element.id] = element.value;
        });
        send_data["select-countries"] =
          send_data["select-countries"] != 0
            ? this.countries.filter(
                x => x.shortName == send_data["select-countries"]
              )[0].name
            : "";
        send_data["grade"] =
          send_data["grade"] == "other" ? 0 : send_data["grade"];
        send_data["board"] =
          send_data["board"] == 4 || send_data["board"] == ""
            ? send_data["student_other_board"]
            : send_data["board"];
        send_data["sex"] = send_data["sex"] == 0 ? "" : send_data["sex"];
        let program_id = this.userProfile[0].cv_pid;
        let vm = this;
        axios
          .post("/api/profile/updateStudentBasicProfileDetail", {
            user_id: this.userId,
            sch_id: this.sch_id,
            cv_pid: program_id,
            data: send_data
          })
          .then(res => {
            if (res.status == 200) {
              this.getServerTime();
              window.cvNotify("successfully updated", "success");
            }
          });

        // console.log(send_data);
      }
    },
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
          if (!res.data.length) {
            //vm.$router.push("/login");
          } else {
            vm.userProfile = res.data;
            if (vm.userProfile.length) {
              vm.calage(vm.userProfile[0].dob);
              let Oboard = ["CBSE", "ICSE", "IB/ICGSE"];

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
                ? vm.userProfile[0].city
                  ? vm.userProfile[0].city
                  : 0
                : 0;
              vm.select_board = vm.userProfile.length
                ? vm.userProfile[0].board
                  ? vm.userProfile[0].board
                  : 0
                : 0;
              vm.select_grade = vm.userProfile.length
                ? vm.userProfile[0].cls_id
                  ? vm.userProfile[0].cls_id
                  : 0
                : 0;
              vm.select_sex = vm.userProfile.length
                ? vm.userProfile[0].sex
                  ? vm.userProfile[0].sex
                  : 0
                : 0;
              vm.select_section = vm.userProfile.length
                ? vm.userProfile[0].sec_id
                  ? vm.userProfile[0].sec_id
                  : 0
                : 0;
              vm.select_dob = vm.userProfile.length
                ? vm.userProfile[0].dob
                  ? vm.userProfile[0].dob
                  : ""
                : "";
              vm.select_instname = vm.userProfile.length
                ? vm.userProfile[0].sch_name
                  ? vm.userProfile[0].sch_name
                  : ""
                : "";
              vm.other_board = vm.userProfile.length
                ? vm.userProfile[0].board
                  ? vm.userProfile[0].board
                  : ""
                : "";
              vm.qualification = vm.userProfile.length
                ? vm.userProfile[0].other_grade
                  ? vm.userProfile[0].other_grade
                  : ""
                : "";
              vm.contact_no = vm.userProfile.length
                ? vm.userProfile[0].contact
                  ? vm.userProfile[0].contact
                  : ""
                : "";
              vm.address = vm.userProfile.length
                ? vm.userProfile[0].address
                  ? vm.userProfile[0].address
                  : ""
                : "";
              vm.emergency_contact_no = vm.userProfile.length
                ? vm.userProfile[0].emergency_contact_no
                  ? vm.userProfile[0].emergency_contact_no
                  : ""
                : "";
              if (
                vm.select_board != 0 &&
                Oboard.indexOf(vm.select_board) === -1
              ) {
                vm.select_board = "4";
                vm.show1 = vm.basicDetailEdit === 1 ? 1 : 0;
              }
              if (vm.qualification) {
                vm.select_grade = "other";
                vm.other_grade = vm.show1 = vm.basicDetailEdit === 1 ? 1 : 0;
              }
              if (c_name != 0) vm.getAllStates(c_name);
              if (s_name && c_name) vm.getAllCities(s_name, c_name);
            }

            /* let today = new Date()
            var birthDate = new Date(this.userProfile[0].dob);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
         if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age = age - 1;
        }
         this.myage =age;*/
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
.profile-pic-img {
  position: relative;
}

.profile-pic-img > div {
  position: absolute;
  bottom: 0;
  right: 0;
  label {
    padding-top: 20%;
    font-size: 16px;
    color: #fff;
  }
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
