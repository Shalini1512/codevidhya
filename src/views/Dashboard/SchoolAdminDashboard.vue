<template>
  <div>
    <Header></Header>
    <!--Dashboard starts here-->
    <section class="sptb" style="padding-top:72px;">
      <div class="container-fluid">
        <div class="row">
          <!--side nav bar-->
          <sideNav></sideNav>
          <!-- end side nav-->

          <div class="col-xl-9 col-lg-12 col-md-12">
            <showSchoolProfile ref="userProfile"></showSchoolProfile>

            <div class="row">
              <div class="col-sm-12">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Tracking</h3>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-sm-4 ">
                        <div class="form-group">
                          <label class="form-label"
                            >Grade<span style="color:rgb(238,0,0)"
                              >*</span
                            ></label
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
                      <div class="col-sm-4 ">
                        <div class="form-group">
                          <label class="form-label"
                            >Section<span style="color:rgb(238,0,0)"
                              >*</span
                            ></label
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
                      <div class="col-sm-4 ">
                        <div class="form-group">
                          <label class="form-label"
                            >Subject Teacher<span style="color:rgb(238,0,0)"
                              >*</span
                            ></label
                          >
                          <select class="form-control">
                            <option selected disabled>Teacher</option>
                            <option>A</option>
                            <option>B</option>
                            <option>C</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-sm-4 ">
                        <div class="form-group">
                          <label class="form-label"
                            >Student Count<span style="color:rgb(238,0,0)"
                              >*</span
                            ></label
                          >
                          <input
                            type="number"
                            class="form-control"
                            value="25"
                            readonly
                          />
                        </div>
                      </div>
                      <div class="col-sm-4 ">
                        <div class="form-group">
                          <label class="form-label"
                            >Course Enrolled<span style="color:rgb(238,0,0)"
                              >*</span
                            ></label
                          >
                          <select class="form-control">
                            <option>HTML</option>
                            <option>CSS</option>
                            <option>JavaScript</option>
                            <option>Python</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-6">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Quickbook</h3>
                  </div>
                  <div class="card-body">
                    <div class="widgets-cards">
                      <div class="d-flex">
                        <div class="widgets-cards-data">
                          <div class="wrp text-wrapper">
                            <p
                              class="fs-18 font-weight-normal"
                              style="line-height: 1.4!important;"
                            >
                              Your classroom under your control
                            </p>
                            <button
                              type="button"
                              class="btn btn-primary mt-4 ml-3"
                            >
                              Start Using
                            </button>
                          </div>
                        </div>
                        <div class=" ml-5">
                          <div class="">
                            <i
                              class="far fa-window-restore p-2"
                              style="font-size: 104px;"
                            ></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Recent Quizzes</h3>
                  </div>
                  <div class="card-body pb-3">
                    <ul class="vertical-scroll">
                      <li class="news-item">
                        <table>
                          <tr>
                            <td>
                              <img
                                src="/assets/images/png/1.png"
                                alt="img"
                                class="w-8 border mr-2"
                              />
                            </td>
                            <td>
                              <h5 class="mb-1 ">HTML Quiz</h5>
                              <a href="#" class="btn-link">View Details</a
                              ><span class="float-right font-weight-bold"
                                >Rs.20</span
                              >
                            </td>
                          </tr>
                        </table>
                      </li>
                      <li class="news-item">
                        <table>
                          <tr>
                            <td>
                              <img
                                src="/assets/images/png/2.png"
                                alt="img"
                                class="w-8 border mr-2"
                              />
                            </td>
                            <td>
                              <h5 class="mb-1 ">Python Quiz</h5>
                              <a href="#" class="btn-link">View Details</a
                              ><span class="float-right font-weight-bold"
                                >Free</span
                              >
                            </td>
                          </tr>
                        </table>
                      </li>
                      <li class="news-item">
                        <table>
                          <tr>
                            <td>
                              <img
                                src="/assets/images/png/3.png"
                                alt="img"
                                class="w-8 border mr-2"
                              />
                            </td>
                            <td>
                              <h5 class="mb-1 ">CSS Quiz</h5>
                              <a href="#" class="btn-link">View Details</a
                              ><span class="float-right font-weight-bold"
                                >Rs.15</span
                              >
                            </td>
                          </tr>
                        </table>
                      </li>
                      <li class="news-item">
                        <table>
                          <tr>
                            <td>
                              <img
                                src="/assets/images/png/4.png"
                                alt="img"
                                class="w-8 border mr-2"
                              />
                            </td>
                            <td>
                              <h5 class="mb-1 ">Scratch Quiz</h5>
                              <a href="#" class="btn-link">View Details</a
                              ><span class="float-right font-weight-bold"
                                >Free</span
                              >
                            </td>
                          </tr>
                        </table>
                      </li>
                      <li class="news-item">
                        <table>
                          <tr>
                            <td>
                              <img
                                src="/assets/images/png/5.png"
                                alt="img"
                                class="w-8 border mr-2"
                              />
                            </td>
                            <td>
                              <h5 class="mb-1 ">JavaScript Quiz</h5>
                              <a href="#" class="btn-link">View Details</a
                              ><span class="float-right font-weight-bold"
                                >Rs.70</span
                              >
                            </td>
                          </tr>
                        </table>
                      </li>
                      <li class="news-item">
                        <table>
                          <tr>
                            <td>
                              <img
                                src="/assets/images/png/6.png"
                                alt="img"
                                class="w-8 border mr-2"
                              />
                            </td>
                            <td>
                              <h5 class="mb-1 ">Web Designing Quiz</h5>
                              <a href="#" class="btn-link">View Details</a
                              ><span class="float-right font-weight-bold"
                                >Rs. 40</span
                              >
                            </td>
                          </tr>
                        </table>
                      </li>
                      <li class="news-item">
                        <table>
                          <tr>
                            <td>
                              <img
                                src="/assets/images/png/8.png"
                                alt="img"
                                class="w-8 border mr-2"
                              />
                            </td>
                            <td>
                              <h5 class="mb-1 ">SQL Quiz</h5>
                              <a href="#" class="btn-link">View Details</a
                              ><span class="float-right font-weight-bold"
                                >Rs. 100</span
                              >
                            </td>
                          </tr>
                        </table>
                      </li>
                    </ul>
                    <div class="text-right mt-3">
                      <a href="#" class="btn-link font-weight-bold">View all</a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="card">
                  <div class="card-header">
                    <div class="card-title">Recent Projects</div>
                  </div>
                  <div class="pl-5 pt-3 pb-2 text-dark font-weight-bold">
                    My school projects
                  </div>
                  <div class="card-body p-0">
                    <div class="table-responsive">
                      <table class="table card-table table-vcenter text-nowrap">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th class="font-weight-semibold">Project Name</th>
                            <th class="font-weight-semibold">Date Created</th>
                            <th class="font-weight-semibold">Created by</th>
                            <th class="font-weight-semibold">View</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th>1</th>
                            <td>Make a car</td>
                            <td>10 Jan, 2020</td>
                            <td>Renu M 230</td>
                            <td>
                              <span class="badge badge-success"
                                ><i class="fa fa-external-link"></i
                              ></span>
                            </td>
                          </tr>
                          <tr>
                            <th>2</th>
                            <td>Maze game</td>
                            <td>25 Mar, 2019</td>
                            <td>Renu M 230</td>
                            <td>
                              <span class="badge badge-success"
                                ><i class="fa fa-external-link"></i
                              ></span>
                            </td>
                          </tr>
                          <tr>
                            <th>3</th>
                            <td>Chat bot</td>
                            <td>07 Jul, 2020</td>
                            <td>Renu M 230</td>
                            <td>
                              <span class="badge badge-success"
                                ><i class="fa fa-external-link"></i
                              ></span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div
                      class="text-right mt-3 pb-2 pr-5"
                      style="border-bottom: 1px solid #e0e8f3;"
                    >
                      <a href="#" class="btn-link font-weight-bold">View all</a>
                    </div>
                  </div>
                  <div class="pl-5 pt-3 pb-2 text-dark font-weight-bold">
                    Other's projects
                  </div>
                  <div class="card-body p-0">
                    <div class="table-responsive">
                      <table class="table card-table table-vcenter text-nowrap">
                        <thead>
                          <tr>
                            <th class="font-weight-semibold">#</th>
                            <th class="font-weight-semibold">Project Name</th>
                            <th class="font-weight-semibold">Date Created</th>
                            <th class="font-weight-semibold">Created By</th>
                            <th class="font-weight-semibold">View</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th>1</th>
                            <td>Make a robot</td>
                            <td>14 Jun, 2020</td>
                            <td>Deepa sri.s 570</td>
                            <td>
                              <span class="badge badge-success"
                                ><i class="fa fa-external-link"></i
                              ></span>
                            </td>
                          </tr>
                          <tr>
                            <th>2</th>
                            <td>Calculator</td>
                            <td>30 Sep, 2019</td>
                            <td>Renu M 230</td>
                            <td>
                              <span class="badge badge-success"
                                ><i class="fa fa-external-link"></i
                              ></span>
                            </td>
                          </tr>
                          <tr>
                            <th>3</th>
                            <td>Travel car</td>
                            <td>19 Nov, 2019</td>
                            <td>Mohit Jain</td>
                            <td>
                              <span class="badge badge-success"
                                ><i class="fa fa-external-link"></i
                              ></span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="text-right my-3 mr-5">
                      <a href="#" class="btn-link font-weight-bold">View all</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-6">
                <div class="card">
                  <div class="card-header">
                    <div class="card-title">Reports</div>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-sm-6 text-center">
                        <i
                          class="far fa-chart-bar"
                          style="font-size: 120px;"
                        ></i>
                      </div>
                      <div class="col-sm-6 pt-4 font" style="font-size: 18px;">
                        View reports of each student as per your convenience
                      </div>
                    </div>
                    <div class="row pt-4">
                      <button type="button" class="btn btn-primary mx-auto">
                        View reports
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">
                      Help <i class="fa fa-question-circle-o"></i>
                    </h3>
                  </div>
                  <div class="card-body">
                    <ul class="list-group">
                      <a
                        href="#"
                        class="list-group-item btn-outline-secondary text-dark"
                        ><li>
                          <i
                            class="fa fa-phone text-success mr-1"
                            aria-hidden="true"
                          ></i>
                          Speak to Codevidhya team
                        </li></a
                      >
                      <a
                        href="#"
                        class="list-group-item btn-outline-secondary text-dark"
                        ><li>
                          <i
                            class="fa fa-exclamation-circle text-warning mr-1"
                            aria-hidden="true"
                          ></i>
                          Report an issue
                        </li></a
                      >
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="row m-0">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Payment Details</h3>
                </div>
                <div class="card-body">
                  <div
                    class="fs-16 pb-2"
                    style="border-bottom: 1px solid #e0e8f3;"
                  >
                    Due Amount:
                    <span class="font-weight-semibold fs-20 text-dark"
                      >Rs. 1,50,000</span
                    >
                  </div>
                  <div class="fs-16 py-3 font-weight-semibold">
                    Payment History
                  </div>
                  <div class="table-responsive border-top">
                    <table class="table table-bordered table-hover text-nowrap">
                      <thead>
                        <tr>
                          <th>Payment ID</th>
                          <th>For</th>
                          <th>Date</th>
                          <th>Amount Paid</th>
                          <th>Mode</th>
                          <th>Status</th>
                          <th>Due Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="text-info">#89345</td>
                          <td>Annual School Curriculum</td>
                          <td>07-12-2018</td>
                          <td class="font-weight-semibold fs-16">
                            Rs. 1,50,000
                          </td>
                          <td>Cheque</td>
                          <td>
                            <a href="#" class="badge badge-danger">Failed</a>
                          </td>
                          <td>Rs. 50,000</td>
                        </tr>
                        <tr>
                          <td class="text-info">#79854</td>
                          <td>Annual School Curriculum</td>
                          <td>16-08-2018</td>
                          <td class="font-weight-semibold fs-16">Rs. 80,000</td>
                          <td>NEFT</td>
                          <td>
                            <a href="#" class="badge badge-primary">Pending</a>
                          </td>
                          <td>Rs. 2,00,000</td>
                        </tr>
                        <tr>
                          <td class="text-info">#94722</td>
                          <td>After School Curriculum</td>
                          <td>26-05-2018</td>
                          <td class="font-weight-semibold fs-16">
                            Rs. 2,50,000
                          </td>
                          <td>Cheque</td>
                          <td>
                            <a href="#" class="badge badge-success"
                              >Completed</a
                            >
                          </td>
                          <td>Rs. 50,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <ul class="pagination">
                    <li class="page-item page-prev disabled">
                      <a class="page-link" href="#" tabindex="-1">Prev</a>
                    </li>
                    <li class="page-item active">
                      <a class="page-link" href="#">1</a>
                    </li>
                    <li class="page-item">
                      <a class="page-link" href="#">2</a>
                    </li>
                    <li class="page-item">
                      <a class="page-link" href="#">3</a>
                    </li>
                    <li class="page-item page-next">
                      <a class="page-link" href="#">Next</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Header from "@/components/header/Header.vue";
import SideNav from "@/components/dashboard/SideNav.vue";
import Footer from "@/components/footer/Footer.vue";
import showSchoolProfile from "@/views/Profile/schoolAdmin/showSchoolProfile.vue";
export default {
  components: {
    Header,
    SideNav,
    Footer,
    showSchoolProfile
  }
};
</script>
