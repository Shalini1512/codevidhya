<template>
  <div>
    <Header></Header>
    <!--User Dashboard-->
    <section class="sptb" style="padding-top:72px;">
      <div class="container">
        <div class="row">
          <!--side nav bar-->
          <sideNav></sideNav>
          <!-- end side nav-->

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
                      />
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-group">
                      <label class="form-label">Email Id</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Email Address"
                      />
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-group">
                      <label class="form-label"
                        >Mobile No.<span style="color:rgb(238,0,0)"
                          >*</span
                        ></label
                      >
                      <input
                        type="number"
                        minlength="10"
                        class="form-control"
                        placeholder="9xxxxxxxxxx"
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
                        placeholder="Address"
                      />
                    </div>
                  </div>
                </div>
                <!--Child's Details-->
                <label class="form-label text-dark font-weight-bold"
                  >Child's Details</label
                >
                <div class="row">
                  <div class="col-sm-4">
                    <div class="form-group">
                      <label class="form-label"
                        >Child Name<span style="color:rgb(238,0,0)"
                          >*</span
                        ></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Name"
                        readonly
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
                        min="'2000-01-01'"
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
                      />
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-group">
                      <label class="form-label"
                        >Grade<span style="color:rgb(238,0,0)">*</span></label
                      >
                      <select class="form-control">
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
                      <select class="form-control">
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
                          data-data='{"image": "/assets/images/flags/br.svg"}'
                          selected
                          disabled
                          >Select Country</option
                        >
                        <option
                          value="in"
                          data-data='{"image": "/assets/images/flags/br.svg"}'
                          >India</option
                        >
                        <option
                          value="br"
                          data-data='{"image": "/assets/images/flags/br.svg"}'
                          >Brazil</option
                        >
                        <option
                          value="cz"
                          data-data='{"image": "/assets/images/flags/cz.svg"}'
                          >Czech Republic</option
                        >
                        <option
                          value="de"
                          data-data='{"image": "/assets/images/flags/de.svg"}'
                          >Germany</option
                        >
                        <option
                          value="pl"
                          data-data='{"image": "/assets/images/flags/pl.svg"}'
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
                        placeholder="Email"
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
                      />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-4">
                    <div class="form-group">
                      <label class="form-label"
                        >Relation with child<span style="color:rgb(238,0,0)"
                          >*</span
                        ></label
                      >
                      <select
                        name="relation"
                        id="select-relation"
                        class="form-control"
                      >
                        <option value="0" selected disabled
                          >Select Relation</option
                        >
                        <option value="father">Father</option>
                        <option value="mother">Mother</option>
                        <option value="guardian">Guardian</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-footer text-right">
                <button class="btn btn-success">
                  Save
                </button>
              </div>
            </div>
            <div class="card">
              <div class="card-header bg-secondary">
                <h3 class="card-title text-white">Codevidhya Achievements</h3>
              </div>
              <div class="card-body">
                <div class="row p-2">
                  <div class="col-sm-4">
                    <h4 class="text-danger">
                      <i class="fas fa-book-reader mr-1"></i> Courses Enrolled
                    </h4>
                  </div>
                  <div class="col-sm-8"><p>Learn By Doing</p></div>
                </div>
                <div class="row p-2">
                  <div class="col-sm-4">
                    <h4 class="text-danger">
                      <i class="fab fa-font-awesome-flag mr-1"></i> Milestone
                      Achieved
                    </h4>
                  </div>
                  <div class="col-sm-8">
                    <p>
                      <span class="badge badge-success">2</span> out of
                      <span class="badge badge-primary">15</span> lessons
                      completed
                    </p>
                    <p class="pt-2">
                      <i class="fa fa-check text-success"></i> Success rate:
                      100%
                    </p>
                  </div>
                </div>
                <div class="row p-2">
                  <div class="col-sm-4">
                    <h4 class="text-danger">
                      <i class="fas fa-share-alt mr-1"></i> Share Achievements
                    </h4>
                  </div>
                  <div class="col-sm-8">
                    <div class="a-social-share">
                      <a href="#" class="facebook-bg mt-0 mr-2"
                        ><i class="fab fa-facebook-f"></i
                      ></a>
                      <a href="#" class="twitter-bg mr-2"
                        ><i class="fab fa-twitter"></i
                      ></a>
                      <a href="#" class="badge-success mr-2"
                        ><i class="fab fa-whatsapp"></i
                      ></a>
                      <a href="#" class="badge-primary"
                        ><i class="fab fa-instagram"></i
                      ></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Growth Analysis</h3>
              </div>
              <div class="card-body">
                Graphs
              </div>
            </div>
            <div class="row">
              <div class="col-sm-6">
                <quizcard />
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">
                      Help <i class="far fa-question-circle"></i>
                    </h3>
                  </div>
                  <div class="card-body">
                    <ul class="list-group">
                      <a
                        href=""
                        class="list-group-item btn-outline-secondary text-dark"
                        data-toggle="modal"
                        data-target="#contactForm"
                        ><li>
                          <i
                            class="fa fa-phone text-success mr-1"
                            aria-hidden="true"
                          ></i>
                          Speak to an instructor
                        </li></a
                      >
                      <a
                        href=""
                        class="list-group-item btn-outline-secondary text-dark"
                        data-toggle="modal"
                        data-target="#issueForm"
                        ><li>
                          <i
                            class="fa fa-exclamation-circle text-warning mr-1"
                            aria-hidden="true"
                          ></i>
                          Report an issue
                        </li></a
                      >
                      <a
                        href="#"
                        class="list-group-item btn-outline-secondary text-dark"
                        ><li>
                          <i
                            class="fas fa-map-marker-alt text-cyan mr-1"
                            aria-hidden="true"
                          ></i>
                          Locate an after school center
                        </li></a
                      >
                    </ul>
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <projectcard />
              </div>
            </div>
            <div class="card">
              <div class="card-header">
                <h3 class="card-title text-capitalize">
                  Your child can also learn
                </h3>
              </div>
              <div class="card-body">
                <!--Card starts here-->
                <div class="row">
                  <div class="col-md-6 col-lg-6 col-xl-4">
                    <div class="card mb-0">
                      <div class="item-card2-img">
                        <a></a>
                        <img
                          src="/assets/images/media/1.jpg"
                          alt="img"
                          class="cover-image"
                        />
                        <div class="item-tag"></div>
                        <div class="rating-stars">
                          <div>
                            <span class="empty-stars">
                              <span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                            ></span>
                            <span class="filled-stars"
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                              ><span class="star"
                                ><i class="fas fa-star"></i></span
                            ></span>
                          </div>
                        </div>
                      </div>
                      <div class="card-body">
                        <div class="item-card2">
                          <div class="item-card2-desc">
                            <div class="item-card2-text mb-3">
                              <a class="text-dark">
                                <h4 class="mb-2">JavaScript</h4>
                              </a>
                            </div>
                            <p>
                              Learn and create beautiful webpages with HTML and
                              CSS.
                            </p>
                            <ul class="mt-3">
                              <li>
                                <a href="#" class="icons">
                                  <i class="icon icon-user mr-1"></i>Beginner
                                </a>
                              </li>
                              <li class="text-right">
                                <a
                                  class="learn-more-btn"
                                  style="background:#48c9b0;padding: 4px 8px;color: #fff;border-radius: 2px;"
                                  >Learn More</a
                                >
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div class="card-footer">
                        <div class="item-card2-footer">
                          <div class="item-card2-footer-u">
                            <div class="product-item-wrap d-flex">
                              <div class="product-item-price">
                                Rs.<del
                                  class="oldprice text-muted"
                                  style="font-size:14px;"
                                  >12,000</del
                                >
                                <span
                                  class="newprice text-dark"
                                  style="font-size:14px;"
                                  >2,000</span
                                >
                              </div>
                              <a class="btn btn-outline-primary btn-sm ml-auto"
                                >Buy Now</a
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!--Card Ends here-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--/User Dashboard-->
    <Footer />
    <!-- Speak to an Instructor Modal -->
    <div id="contactForm" class="modal fade">
      <div class="modal-dialog" role="document">
        <div class="modal-content px-5">
          <div class="modal-header pd-x-20">
            <h4 class="modal-title font-weight-bold">Contact Us</h4>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body pd-20">
            <div class="form-group">
              <label class="form-label"
                >Name<span style="color: rgb(238, 0, 0);">*</span></label
              >
              <input type="text" class="form-control" placeholder="Full Name" />
            </div>
            <div class="row">
              <div class="col-sm-6">
                <div class="form-group">
                  <label class="form-label"
                    >Email<span style="color: rgb(238, 0, 0);">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Email Address"
                    required
                  />
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <label class="form-label"
                    >Phone Number<span style="color: rgb(238, 0, 0);"
                      >*</span
                    ></label
                  >
                  <input
                    type="number"
                    class="form-control"
                    placeholder="Phone Number"
                    minlength="10"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label"
                >Address<span style="color: rgb(238, 0, 0);">*</span></label
              >
              <textarea
                class="form-control"
                style="resize: none;"
                rows="2"
                placeholder="Your Address"
                required
              ></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Message</label>
              <textarea
                class="form-control"
                style="resize: none;"
                rows="3"
                placeholder="Your Message"
                required
              ></textarea>
            </div>
          </div>
          <!-- modal-body -->
          <div class="row mt-n3 mb-3">
            <button type="button" class="btn btn-info mx-auto">Submit</button>
          </div>
        </div>
      </div>
      <!-- modal-dialog -->
    </div>
    <!-- modal -->
    <!-- Report an Issue Modal -->
    <div id="issueForm" class="modal fade">
      <div class="modal-dialog" role="document">
        <div class="modal-content px-5">
          <div class="modal-header pd-x-20">
            <h4 class="modal-title font-weight-bold">Report an Issue</h4>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body pd-20">
            <div class="form-group">
              <label class="form-label"
                >Name<span style="color: rgb(238, 0, 0);">*</span></label
              >
              <input type="text" class="form-control" placeholder="Full Name" />
            </div>
            <div class="row">
              <div class="col-sm-6">
                <div class="form-group">
                  <label class="form-label"
                    >Email<span style="color: rgb(238, 0, 0);">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Email Address"
                    required
                  />
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <label class="form-label"
                    >Phone Number<span style="color: rgb(238, 0, 0);"
                      >*</span
                    ></label
                  >
                  <input
                    type="number"
                    class="form-control"
                    placeholder="Phone Number"
                    minlength="10"
                    required
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-6">
                <div class="form-group">
                  <label class="form-label"
                    >Category<span style="color: rgb(238, 0, 0);"
                      >*</span
                    ></label
                  >
                  <select class="form-control">
                    <option selected disabled>Select Category</option>
                    <option>Courses</option>
                    <option>Quickbook</option>
                    <option>Assessments</option>
                    <option>Projects</option>
                    <option>Quizzes</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <label class="form-label"
                    >Summary<span style="color: rgb(238, 0, 0);">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Summary"
                    required
                  />
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label"
                >Description<span style="color: rgb(238, 0, 0);">*</span></label
              >
              <textarea
                class="form-control"
                style="resize: none;"
                rows="3"
                placeholder="Your Message"
                required
              ></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Attach File</label>
              <input
                type="file"
                accept=".jpg, .jpeg, .png"
                placeholder="Choose"
              />
            </div>
          </div>
          <!-- modal-body -->
          <div class="row mt-n3 mb-3">
            <button type="button" class="btn btn-info mx-auto">Submit</button>
          </div>
        </div>
      </div>
      <!-- modal-dialog -->
    </div>
    <!-- modal -->
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import SideNav from "@/components/dashboard/SideNav.vue";
import Footer from "@/components/footer/Footer.vue";
import projectcard from "@/components/dashboard/ProjectsCard.vue";
import quizcard from "@/components/dashboard/QuizzesCard.vue";
export default {
  components: {
    Header,
    SideNav,
    Footer,
    projectcard,
    quizcard
  }
};
</script>

<style lang="scss">
.a-social-share {
  a {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    text-align: center;
    border-radius: 100px;
    line-height: 2rem;
  }
}
</style>
