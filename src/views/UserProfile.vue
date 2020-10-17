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
                    <h1>{{ userProfile[0].name }}</h1>
                    <p>{{ userProfile[0].sch_name }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- /header-text -->
        </div>
      </section>
    </Header>
    <!--User Dashboard-->
    <section class="sptb">
      <div class="container-fluid">
        <div class="row">
          <div class="col-xl-3 col-lg-12 col-md-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">My Profile</h3>
              </div>
              <div class="card-body text-center item-user border-bottom">
                <div class="profile-pic">
                  <div
                    class="btn-group dropleft"
                    style="position:absolute; right:25px; "
                  >
                    <label
                      class="p-2"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      style="cursor:pointer;"
                      ><i class="fas fa-ellipsis-v fa-lg"></i
                    ></label>
                    <ul class="dropdown-menu">
                      <li
                        class="dropdown-item"
                        data-toggle="modal"
                        data-target="#updateProfilePicModal"
                        style="cursor:pointer;"
                      >
                        Edit
                      </li>
                      <li
                        class="dropdown-item"
                        @click="removeProfilePic()"
                        style="cursor:pointer;"
                      >
                        Remove
                      </li>
                    </ul>
                  </div>

                  <div class="profile-pic-img mb-2">
                    <span
                      class="bg-success dots"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="online"
                    ></span>
                    <img
                      :src="
                        userProfile[0].profile_pic
                          ? '/static/profiles/' + userProfile[0].profile_pic
                          : '/assets/images/users/user.svg'
                      "
                      class="brround"
                      alt="user"
                    />
                  </div>
                  <h4 class="mt-5 mb-0 font-weight-semibold text-dark">
                    {{ userProfile[0].name }}
                  </h4>
                </div>
              </div>
              <div class="item1-links  mb-0">
                <a
                  href="#"
                  class="d-flex border-bottom"
                  @click.prevent="moveToProfile()"
                >
                  <span class="icon1 mr-3"><i class="far fa-id-card"></i></span>
                  My Profile
                </a>
                <div class="dropdown show" v-if="role_id == 2">
                  <a
                    v-if="role_id == 2"
                    class="d-flex border-bottom dropdown-toggle"
                    data-toggle="dropdown"
                    id="student-dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span class="icon1 mr-3"><i class="fas fa-user"></i></span>
                    Students
                    <i class="flex-fill"></i>
                  </a>
                  <ul
                    class="dropdown-menu w-100 m-0"
                    role="menu"
                    aria-labelledby="student-dropdown"
                  >
                    <router-link
                      to="/assessment-questions"
                      class="d-flex border-bottom"
                    >
                      Profile Setting
                    </router-link>
                    <router-link
                      to="/assessment-questions"
                      class="d-flex border-bottom"
                    >
                      Update Students
                    </router-link>
                    <router-link
                      to="/assessment-report"
                      class="d-flex border-bottom"
                    >
                      Send a Message
                    </router-link>
                    <router-link
                      to="/assessment-questions"
                      class="d-flex border-bottom"
                    >
                      Monitoring
                    </router-link>
                  </ul>
                </div>
                <div class="dropdown show" v-if="role_id == 2">
                  <a
                    class="d-flex border-bottom dropdown-toggle"
                    data-toggle="dropdown"
                    id="assessment-dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span class="icon1 mr-3"
                      ><i class="fas fa-clipboard-list"></i
                    ></span>
                    Assessments
                    <i class="flex-fill"></i>
                  </a>
                  <ul
                    class="dropdown-menu w-100 m-0"
                    role="menu"
                    aria-labelledby="assessment-dropdown"
                  >
                    <router-link
                      :to="{
                        name: 'instituteassessments'
                      }"
                      class="d-flex border-bottom"
                      v-if="role_id == 2"
                    >
                      All Assessments
                    </router-link>
                    <router-link
                      to="/assessment-questions"
                      class="d-flex border-bottom"
                    >
                      Assessment Questions
                    </router-link>
                    <router-link
                      to="/assessment-report"
                      class="d-flex border-bottom"
                    >
                      Assessment Report
                    </router-link>
                  </ul>
                </div>
                <router-link
                  to="/assessments"
                  class="d-flex border-bottom"
                  v-if="role_id == 3"
                >
                  <span class="icon1 mr-3"
                    ><i class="fas fa-clipboard-list"></i
                  ></span>
                  Assessments
                </router-link>

                <router-link to="/courses" class="d-flex border-bottom">
                  <span class="icon1 mr-3"
                    ><i class="fas fa-book-reader"></i
                  ></span>
                  Courses
                </router-link>
                <router-link to="/projects" class="d-flex border-bottom">
                  <span class="icon1 mr-3"
                    ><!--<i class="fas fa-folder"></i>--><i
                      class="fas fa-folder-open"
                    ></i
                  ></span>
                  Projects
                </router-link>
                <router-link to="/quizzes" class="d-flex border-bottom">
                  <span class="icon1 mr-3"><i class="fas fa-edit"></i></span>
                  Quizzes
                </router-link>
                <router-link to="/quickbook" class="d-flex border-bottom">
                  <span class="icon1 mr-3"><i class="fas fa-book"></i></span>
                  Quickbook
                </router-link>
                <router-link to="/notifications" class="d-flex border-bottom">
                  <span class="icon1 mr-3"><i class="fas fa-bell"></i></span>
                  Notifications
                </router-link>
                <a href="#" class="d-flex border-bottom" @click="doLogout()">
                  <span class="icon1 mr-3"
                    ><i class="fas fa-power-off"></i
                  ></span>
                  Logout
                </a>
              </div>
            </div>
          </div>

          <div class="col-xl-9 col-lg-12 col-md-12">
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
                        :disabled="role_id == 3 ? true : false"
                        v-model="editProfile[0].name"
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
                      <input
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
                      <select
                        class="form-control"
                        :value="userProfile[0].cls_name"
                      >
                        <option selected disabled>Select Grade</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
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
                      <select
                        class="form-control"
                        :value="userProfile[0].sec_name"
                      >
                        <option selected disabled>Select Section</option>
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                        <option>D</option>
                        <option>E</option>
                        <option>F</option>
                        <option>G</option>
                        <option>H</option>
                        <option>I</option>
                        <option>J</option>
                        <option>K</option>
                        <option>L</option>
                        <option>M</option>
                        <option>N</option>
                        <option>O</option>
                        <option>P</option>
                        <option>Q</option>
                        <option>R</option>
                        <option>S</option>
                        <option>T</option>
                        <option>U</option>
                        <option>V</option>
                        <option>W</option>
                        <option>X</option>
                        <option>Y</option>
                        <option>Z</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-group">
                      <label class="form-label"
                        >School Board<span style="color:rgb(238,0,0)"
                          >*</span
                        ></label
                      >
                      <select class="form-control">
                        <option selected disabled>Select Board</option>
                        <option>CBSE</option>
                        <option>ICSE</option>
                        <option>IB/ICGSE</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-group">
                      <label class="form-label"
                        >Other<span style="color:rgb(238,0,0)">*</span></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter School Board"
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
                      >
                        <option
                          value="br"
                          data-data='{"image": "../assets/images/flags/br.svg"}'
                          selected
                          disabled
                          >Select Country</option
                        >
                        <option
                          value="in"
                          data-data='{"image": "../assets/images/flags/br.svg"}'
                          >India</option
                        >
                        <option
                          value="br"
                          data-data='{"image": "../assets/images/flags/br.svg"}'
                          >Brazil</option
                        >
                        <option
                          value="cz"
                          data-data='{"image": "../assets/images/flags/cz.svg"}'
                          >Czech Republic</option
                        >
                        <option
                          value="de"
                          data-data='{"image": "../assets/images/flags/de.svg"}'
                          >Germany</option
                        >
                        <option
                          value="pl"
                          data-data='{"image": "../assets/images/flags/pl.svg"}'
                          >Poland</option
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
                        v-model="editProfile[0].state"
                      >
                        <option value="0" selected disabled
                          >Select State</option
                        >
                        <option value="rj">Rajasthan</option>
                        <option value="pb">Punjab</option>
                        <option value="gj">Gujarat</option>
                        <option value="ka">Karnataka</option>
                        <option value="or">Orissa</option>
                      </select>
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
                        placeholder="City name"
                        v-model="editProfile[0].city"
                      />
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
                      <input
                        type="tel"
                        class="form-control"
                        placeholder="9xxxxxxxxx"
                        pattern="[0-9]{10}"
                      />
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-group">
                      <label class="form-label">Email Id</label>
                      <input
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
                      <input
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
                        >Father's Name<span style="color:rgb(238,0,0)"
                          >*</span
                        ></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        placeholder="def"
                      />
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-group">
                      <label class="form-label">Father's Email Id</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="def"
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
                        placeholder="def"
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
                        placeholder="def"
                      />
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-group">
                      <label class="form-label">Designation</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="def"
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
                        placeholder="def"
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
                        >Mother's Name<span style="color:rgb(238,0,0)"
                          >*</span
                        ></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        placeholder="def"
                      />
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-group">
                      <label class="form-label">Mother's Email Id</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="def"
                      />
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-group">
                      <label class="form-label">Mother's Mob. No.</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="def"
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
                        placeholder="def"
                      />
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-group">
                      <label class="form-label">Designation</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="def"
                      />
                    </div>
                  </div>
                </div>

                <!--Harish sir work-->
                <!--  <div class="row">
                  <div class="col-sm-6 col-md-6">
                    <div class="form-group">
                      <label class="form-label">Name</label>
                      <input
                        type="text"
                        class="form-control"
                        :disabled="role_id == 3 ? true : false"
                        placeholder="Name"
                        v-model="editProfile[0].name"
                      />
                    </div>
                  </div>
                  <div class="col-sm-6 col-md-6" v-if="role_id == 3">
                    <div class="form-group">
                      <label class="form-label">Parent Name</label>
                      <input
                        type="text"
                        class="form-control"
                        disabled
                        placeholder="Parent's Name"
                        v-model="editProfile[0].parent_name"
                      />
                    </div>
                  </div>
                  <div class="col-sm-6 col-md-6">
                    <div class="form-group">
                      <label class="form-label">Email address</label>
                      <input
                        type="email"
                        class="form-control"
                        :disabled="role_id == 3 ? true : false"
                        placeholder="Email"
                        v-model="editProfile[0].email"
                      />
                    </div>
                  </div>
                  <div class="col-sm-6 col-md-6">
                    <div class="form-group">
                      <label class="form-label">Phone Number</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="editProfile[0].contact"
                        :disabled="role_id == 3 ? true : false"
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>
                  <div class="col-sm-6 col-md-6" v-if="role_id == 3">
                    <div class="form-group">
                      <label class="form-label">Grade</label>
                      <input
                        type="text"
                        class="form-control"
                        disabled
                        placeholder="Grade"
                        :value="userProfile[0].cls_name"
                      />
                    </div>
                  </div>
                  <div class="col-sm-6 col-md-6" v-if="role_id == 3">
                    <div class="form-group">
                      <label class="form-label">Section</label>
                      <input
                        type="text"
                        class="form-control"
                        disabled
                        placeholder="Section"
                        :value="userProfile[0].sec_name"
                      />
                    </div>
                  </div>
                  <div class="col-sm-6 col-md-6">
                    <div class="form-group">
                      <label class="form-label">Username</label>
                      <input
                        type="text"
                        class="form-control"
                        disabled
                        placeholder="Username"
                        :value="userProfile[0].username"
                      />
                    </div>
                  </div>
                  <div class="col-sm-6 col-md-6">
                    <div class="form-group">
                      <label class="form-label">Password</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Password"
                        v-model="editProfile[0].password"
                      />
                    </div>
                  </div>
                  <div class="col-sm-6 col-md-6" v-if="role_id == 3">
                    <div class="form-group">
                      <label class="form-label">DOB</label>
                      <input
                        type="date"
                        :max="$moment().format('YYYY-MM-DD')"
                        :min="'2000-01-01'"
                        v-model="editProfile[0].dob"
                        class="form-control"
                        placeholder="DOB"
                      />
                    </div>
                  </div>
                  <div class="col-sm-6 col-md-6">
                    <div class="form-group">
                      <label class="form-label">School Name</label>
                      <input
                        type="text"
                        class="form-control"
                        disabled
                        placeholder="School"
                        :value="userProfile[0].sch_name"
                      />
                    </div>
                  </div>

                  <div class="col-md-12">
                    <div class="form-group">
                      <label class="form-label">Address</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Address"
                        v-model="editProfile[0].address"
                      />
                    </div>
                  </div>
                  <div class="col-sm-6 col-md-6">
                    <div class="form-group">
                      <label class="form-label">State</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="State"
                        v-model="editProfile[0].state"
                      />
                    </div>
                  </div>
                  <div class="col-sm-6 col-md-6">
                    <div class="form-group">
                      <label class="form-label">City</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="City"
                        v-model="editProfile[0].city"
                      />
                    </div>
                  </div>
               
                </div>-->
              </div>
              <div class="card-footer text-center">
                <button class="btn btn-success" @click="updateProfileInfo()">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--/User Dashboard-->

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
                <!--<label class="form-label">Upload Profile Picture</label>-->
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
  </div>
</template>

<script>
import AuthMixin from "@/mixins/AuthMixin.js";
import moment from "vue-moment";
import axios from "axios";
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import Footer from "@/components/footer/Footer.vue";
export default {
  mixins: [AuthMixin],
  components: {
    Header,
    Footer
  },
  data() {
    return {
      userId: 0,
      isSignedIn: "",
      cls_id: this.$store.getters.getAuthData.auth_cls_id,
      user_id: this.$store.getters.getAuthData.auth_user_id,
      sec_id: this.$store.getters.getAuthData.auth_sec_id,
      role_id: this.$store.getters.getAuthData.auth_role_id,
      sch_id: this.$store.getters.getAuthData.auth_sch_id,
      userProfile: [],
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
          parent_name: "",
          name: ""
        }
      ],
      profilePic: "",
      profilePicData: new FormData()
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
          this.cls_id = this.$store.getters.getAuthData.auth_cls_id;
          this.user_id = this.$store.getters.getAuthData.auth_user_id;
          this.sec_id = this.$store.getters.getAuthData.auth_sec_id;
          this.role_id = this.$store.getters.getAuthData.auth_role_id;
          this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
          this.getServerTime();
        }
      }.bind(this)
    );
  },
  methods: {
    openModal: function(modalId) {
      $("#" + modalId + " > div").removeClass("visible");
      showModal($("#" + modalId));
    },

    getServerTime: function() {
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
      this.$http
        .post("/api/profile/getUserInformation", {
          user_id: this.userId,
          role_id: this.role_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.userProfile = res.body;

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
            this.editProfile[0].parent_name = this.userProfile[0].parent_name;
          }
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
