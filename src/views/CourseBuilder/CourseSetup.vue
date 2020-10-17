<template>
  <div>
    <Header></Header>
    <section class="sptb" style="padding-top: 72px;">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-12">
            <div class="card">
              <div class="card-header">
                <button type="button" class="btn btn-outline-danger mr-4">
                  Back
                </button>
                <div class="wideget-user-tab">
                  <div class="tab-menu-heading">
                    <div class="tabs-menu1">
                      <ul class="nav">
                        <li class="">
                          <a href="#tab-51" class="active" data-toggle="tab"
                            >Course Setup</a
                          >
                        </li>
                        <li>
                          <a href="#tab-61" data-toggle="tab" class=""
                            >Course Content</a
                          >
                        </li>
                        <li>
                          <a href="#tab-71" data-toggle="tab" class=""
                            >Settings</a
                          >
                        </li>
                        <li>
                          <a href="#tab-81" data-toggle="tab" class=""
                            >Pricing</a
                          >
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="flex-grow-1 text-right">
                  <a href="#" class="btn btn-indigo">Save Draft</a>
                  <a href="#" class="btn btn-primary ml-2">
                    Publish
                  </a>
                </div>
              </div>
              <div class="card-body">
                <div class="border-0">
                  <div class="tab-content">
                    <div class="tab-pane active" id="tab-51">
                      <div class="container">
                        <div class="row">
                          <div class="col-sm-12">
                            <h4>Course Title</h4>
                            <div class="form-group" style="position: relative;">
                              <input
                                type="text"
                                class="form-control"
                                maxlength="40"
                              />
                              <div
                                class="form-control-counter"
                                data-purpose="form-control-counter"
                                style="right:4px; bottom:3px;"
                              >
                                40
                              </div>
                            </div>
                            <h4>Course Category</h4>
                            <div class="form-group">
                              <select
                                class="form-control select2-show-search border-bottom-0 w-100"
                                data-placeholder="Select"
                              >
                                <option>--Select a category--</option>
                                <option value="1">Web Development</option>
                                <option value="2">Game Development</option>
                                <option value="3">Designing</option>
                              </select>
                            </div>
                            <h4>Course Information</h4>
                            <div class="form-group" style="position: relative;">
                              <input
                                type="text"
                                class="form-control"
                                maxlength="25"
                                placeholder="Example: Learn and create beautiful webpages with HTML & CSS."
                              />
                              <div
                                class="form-control-counter"
                                data-purpose="form-control-counter"
                                style="right:4px; bottom:3px;"
                              >
                                25
                              </div>
                            </div>
                            <h4>Course Description</h4>
                            <div class="form-group">
                              <label class="form-label"
                                >The description you write here will help the
                                learners decide if this course is the one for
                                them.</label
                              >
                              <textarea
                                class="form-control"
                                rows="5"
                                name="example"
                                placeholder="Example: This course introduces students to basic web design .."
                              ></textarea>
                            </div>
                            <div class="row m-0">
                              <div class="col-sm-6">
                                <h4>Course Image</h4>
                                <div class="form-group">
                                  <label class="form-label"
                                    >Image file size should be less than 1 MB.
                                    Accepted file types are JPG, JPEG, GIF and
                                    PNG.</label
                                  >
                                  <input
                                    type="file"
                                    class="dropify"
                                    accept=".gif, .jpg, .jpeg, .png"
                                    data-default-file="/assets/images/media/media1.jpg"
                                    data-height="240"
                                    placeholder=""
                                  />
                                </div>
                              </div>
                              <div class="col-sm-6">
                                <h4>Course Video</h4>
                                <div class="form-group">
                                  <label class="form-label"
                                    >Video file size should be less than 10 MB.
                                    Accepted formats are MP4, WMV and
                                    FLV.</label
                                  >
                                  <input
                                    type="file"
                                    class="dropify"
                                    accept=".avi,.mpg,.mpeg,.flv,.mov,.m2v,.m4v,.mp4,.rm,.ram,.vob,.ogv,.webm,.wmv"
                                    data-default-file="/assets/images/media/media1.jpg"
                                    data-height="240"
                                    placeholder=""
                                  />
                                </div>
                              </div>
                            </div>
                            <h4>What will learners learn in this course?</h4>
                            <div class="form-group">
                              <input
                                type="text"
                                class="form-control"
                                placeholder="Example: Web Development"
                              />
                            </div>
                            <h4>Prerequisites for this course</h4>
                            <div class="form-group">
                              <input
                                type="text"
                                class="form-control"
                                placeholder="Example: Student should know using a Computer"
                              />
                            </div>
                            <h4>Ideal for</h4>
                            <div class="form-group">
                              <div class="custom-controls-stacked">
                                <label class="custom-control custom-radio">
                                  <input
                                    type="radio"
                                    class="custom-control-input"
                                    name="example-radios"
                                    value="option1"
                                  />
                                  <span class="custom-control-label"
                                    >Grade 1 to 3</span
                                  >
                                </label>
                                <label class="custom-control custom-radio">
                                  <input
                                    type="radio"
                                    class="custom-control-input"
                                    name="example-radios"
                                    value="option2"
                                  />
                                  <span class="custom-control-label"
                                    >Grade 4 and 5</span
                                  >
                                </label>
                                <label class="custom-control custom-radio">
                                  <input
                                    type="radio"
                                    class="custom-control-input"
                                    name="example-radios"
                                    value="option3"
                                  />
                                  <span class="custom-control-label"
                                    >Grade 6 to 8</span
                                  >
                                </label>
                                <label class="custom-control custom-radio">
                                  <input
                                    type="radio"
                                    class="custom-control-input"
                                    name="example-radios"
                                    value="option4"
                                  />
                                  <span class="custom-control-label"
                                    >Grade 10 to 12</span
                                  >
                                </label>
                                <label class="custom-control custom-radio">
                                  <input
                                    type="radio"
                                    class="custom-control-input"
                                    name="example-radios"
                                    value="option5"
                                  />
                                  <span class="custom-control-label"
                                    >Everyone</span
                                  >
                                </label>
                              </div>
                            </div>
                            <h4>Course Level</h4>
                            <div class="form-group">
                              <div class="custom-switches-stacked flex-row">
                                <label class="custom-switch">
                                  <input
                                    type="radio"
                                    name="option"
                                    value="1"
                                    class="custom-switch-input"
                                    checked=""
                                  />
                                  <span class="custom-switch-indicator"></span>
                                  <span class="custom-switch-description"
                                    >Beginner</span
                                  >
                                </label>
                                <label class="custom-switch">
                                  <input
                                    type="radio"
                                    name="option"
                                    value="2"
                                    class="custom-switch-input"
                                  />
                                  <span class="custom-switch-indicator"></span>
                                  <span class="custom-switch-description"
                                    >Intermediate</span
                                  >
                                </label>
                                <label class="custom-switch">
                                  <input
                                    type="radio"
                                    name="option"
                                    value="3"
                                    class="custom-switch-input"
                                  />
                                  <span class="custom-switch-indicator"></span>
                                  <span class="custom-switch-description"
                                    >Advanced</span
                                  >
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row mt-2 border-top p-2 pt-4">
                          <button
                            type="button"
                            class="btn btn-outline-primary ml-auto"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="tab-pane" id="tab-61">
                      <!--course content tab-->
                      <div class="panel-group1" id="accordion2">
                        <!--accordian start-->

                        <div class="panel panel-default mb-4 border p-0">
                          <div class="panel-heading1">
                            <h4 class="panel-title1">
                              <a
                                class="accordion-toggle collapsed p-3"
                                data-toggle="collapse"
                                data-parent="#accordion2"
                                href="#collapse"
                                aria-expanded="false"
                                style="background:#d8dee6; color:#4b5d73"
                              >
                                <span class style="display:flex;">
                                  <span class="col-sm-9" style="color: #2e384d"
                                    >1 Introduction
                                    <button
                                      class="btn btn-sm btn-outline-dark border-0"
                                      data-toggle="modal"
                                      data-target="#editModal"
                                      onclick="(function (event) { event.stopPropagation(); })(event);"
                                    >
                                      <i class="fas fa-pencil-alt"></i>
                                    </button>
                                    <button
                                      class="btn btn-sm btn-outline-dark border-0"
                                      data-toggle="modal"
                                      data-target="#deleteModal"
                                    >
                                      <i class="far fa-trash-alt"></i>
                                    </button>
                                  </span>
                                  <span style="color: #2e384d">Topics: 1</span>
                                </span>
                              </a>
                            </h4>
                          </div>

                          <div
                            id="collapse"
                            class="panel-collapse collapse cursor-pointer active"
                            aria-expanded="false"
                          >
                            <div
                              class="panel-title1 border-bottom col-sm-12 pl-2 cursor-pointer"
                            >
                              <div
                                class="col-sm-12"
                                style="display:flex;align-items:center"
                              >
                                <a
                                  class="accordion-toggle collapsed cursor-pointer col-sm-12 p-2"
                                  style="font-size:12px;cursor:pointer"
                                  >Sub-topic-image sub-topic-page-name
                                  <button
                                    class="btn btn-sm btn-outline-dark border-0"
                                    data-toggle="modal"
                                    data-target="#editPageModal"
                                    onclick="(function (event) { event.stopPropagation(); })(event);"
                                  >
                                    <i class="fas fa-pencil-alt"></i>
                                  </button>
                                  <button
                                    class="btn btn-sm btn-outline-dark border-0"
                                    data-toggle="modal"
                                    data-target="#deletePageModal"
                                  >
                                    <i class="far fa-trash-alt"></i></button
                                ></a>
                              </div>
                            </div>
                          </div>
                          <div
                            id="collapse"
                            class="panel-collapse collapse cursor-pointer active"
                            aria-expanded="false"
                          >
                            <div
                              class="panel-title1 border-bottom col-sm-12 pl-2 cursor-pointer btn-outline-success"
                            >
                              <div
                                class="col-sm-12"
                                style="display:flex;align-items:center"
                              >
                                <a
                                  class="accordion-toggle collapsed cursor-pointer col-sm-12 p-2"
                                  style="font-size:12px;cursor:pointer"
                                  data-toggle="modal"
                                  data-target="#createNewPageModal"
                                  >Create new page
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="text-center">
                        <button
                          class="btn btn-outline-success"
                          data-toggle="modal"
                          data-target="#createNewLessonModal"
                        >
                          Create new lesson
                        </button>
                      </div>
                      <!--end course content tab-->
                    </div>
                    <div class="tab-pane" id="tab-71">
                      <div class="container">
                        <div class="row">
                          <div class="col-sm-12">
                            <h4>Privacy</h4>
                            <div class="form-group">
                              <div class="custom-switches-stacked">
                                <label class="custom-switch">
                                  <input
                                    type="radio"
                                    name="privacy"
                                    value="1"
                                    class="custom-switch-input"
                                    checked=""
                                  />
                                  <span class="custom-switch-indicator"></span>
                                  <span class="custom-switch-description"
                                    >Public</span
                                  >
                                </label>
                                <label style="padding-left: 80px;"
                                  >Public courses are shown up everywhere and
                                  are available for anyone to take on codevidhya
                                  platform.</label
                                >
                                <label class="custom-switch">
                                  <input
                                    type="radio"
                                    name="privacy"
                                    value="2"
                                    class="custom-switch-input"
                                  />
                                  <span class="custom-switch-indicator"></span>
                                  <span class="custom-switch-description"
                                    >Schools Only</span
                                  >
                                </label>
                                <label style="padding-left: 80px;"
                                  >School courses are shown up in the user
                                  accounts of the associated schools.</label
                                >
                                <div
                                  class=""
                                  style="margin-left: 80px; max-width: 300px;"
                                >
                                  <div class="form-group">
                                    <select class="form-control">
                                      <option selected disabled
                                        >Select Grade</option
                                      >
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
                                <label class="custom-switch">
                                  <input
                                    type="radio"
                                    name="privacy"
                                    value="3"
                                    class="custom-switch-input"
                                  />
                                  <span class="custom-switch-indicator"></span>
                                  <span class="custom-switch-description"
                                    >Custom</span
                                  >
                                </label>
                                <label style="padding-left: 80px;"
                                  >Custom courses are shown up only to
                                  particular school(s) / Institute(s) / user
                                  account(s) to take on codevidhya
                                  platform.</label
                                >
                              </div>
                            </div>
                            <h4>Access Mode</h4>
                            <div class="form-group">
                              <div class="custom-controls-stacked pl-5">
                                <label class="custom-control custom-radio">
                                  <input
                                    type="radio"
                                    class="custom-control-input"
                                    name="example-radios"
                                    value="option1"
                                  />
                                  <span class="custom-control-label">Open</span>
                                </label>
                                <label style="padding-left: 26px;"
                                  >The course content can be accessed by anyone
                                  without logging in or enrolling.</label
                                >

                                <label class="custom-control custom-radio">
                                  <input
                                    type="radio"
                                    class="custom-control-input"
                                    name="example-radios"
                                    value="option2"
                                  />
                                  <span class="custom-control-label">Free</span>
                                </label>
                                <label style="padding-left: 26px;"
                                  >The course content can be accessed only after
                                  registration and enrollment.</label
                                >

                                <label class="custom-control custom-radio">
                                  <input
                                    type="radio"
                                    class="custom-control-input"
                                    name="example-radios"
                                    value="option3"
                                    checked
                                  />
                                  <span class="custom-control-label"
                                    >Buy Now</span
                                  >
                                </label>
                                <label style="padding-left: 26px;"
                                  >The course content can be accessed only after
                                  purchasing it. (one-time fee)</label
                                >

                                <label class="custom-control custom-radio">
                                  <input
                                    type="radio"
                                    class="custom-control-input"
                                    name="example-radios"
                                    value="option4"
                                  />
                                  <span class="custom-control-label"
                                    >Recurring</span
                                  >
                                </label>
                                <label style="padding-left: 26px;"
                                  >The course content can be accessed only after
                                  purchasing it. (recurring fee)</label
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row mt-2 border-top p-2 pt-4">
                          <button
                            type="button"
                            class="btn btn-outline-primary ml-auto"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="tab-pane" id="tab-81">
                      <div class="container">
                        <div class="row">
                          <div class="col-sm-12">
                            <h4>Actual Course Price</h4>
                            <div class="form-group">
                              <div
                                class="col-md-8 col-lg-5"
                                style="position: relative;"
                              >
                                <label class="form-label"
                                  >Enter the course price for this
                                  course.</label
                                >
                                <span
                                  style="position: absolute; bottom: 0; padding: 7px; color: #686f7a; background: #dedfe0; font-weight: 700; min-width: 34px; line-height: 24px; text-align: center;"
                                  >INR</span
                                >
                                <input
                                  type="number"
                                  class="form-control"
                                  style="padding-left: 44px;"
                                />
                              </div>
                            </div>
                            <h4>Discount %</h4>
                            <div class="form-group">
                              <div class="col-md-8 col-lg-5">
                                <label class="form-label"
                                  >Enter any number between 0 and 100.</label
                                >
                                <input
                                  type="number"
                                  class="form-control"
                                  min="0"
                                  max="100"
                                />
                              </div>
                            </div>
                            <h4>Discounted Price</h4>
                            <div class="form-group">
                              <div class="col-md-8 col-lg-5">
                                <label class="form-label"
                                  >This price will be visible to the learner to
                                  buy this course.</label
                                >
                                <input
                                  type="text"
                                  class="form-control"
                                  readonly
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row mt-2 border-top p-2 pt-4">
                          <button
                            type="button"
                            class="btn btn-outline-primary ml-auto"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <component
                    :is="'script'"
                    src="/assets/plugins/fileuploads/js/fileupload.js"
                  >
                  </component>
                  <component
                    :is="'script'"
                    src="/assets/js/formelements.js"
                  ></component>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Edit lesson name Modal -->
    <div id="editModal" class="modal fade">
      <div class="modal-dialog" role="document">
        <div class="modal-content ">
          <div class="modal-header pd-x-20">
            <h6 class="modal-title font-weight-bold">Edit Lesson Name</h6>
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
            <input type="text" class="form-control" />
          </div>
          <!-- modal-body -->
          <div class="modal-footer">
            <button type="button" class="btn btn-success">Save changes</button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <!-- modal-dialog -->
    </div>
    <!-- modal -->

    <!-- Edit page name Modal -->
    <div id="editPageModal" class="modal fade">
      <div class="modal-dialog" role="document">
        <div class="modal-content ">
          <div class="modal-header pd-x-20">
            <h6 class="modal-title font-weight-bold">Edit Page Name</h6>
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
            <input type="text" class="form-control" />
          </div>
          <!-- modal-body -->
          <div class="modal-footer">
            <button type="button" class="btn btn-success">Save changes</button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <!-- modal-dialog -->
    </div>
    <!-- modal -->

    <!-- Create New Page Modal -->
    <div id="createNewPageModal" class="modal fade">
      <div class="modal-dialog" role="document">
        <div class="modal-content ">
          <div class="modal-header pd-x-20">
            <h6 class="modal-title font-weight-bold">New Page</h6>
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
              <label class="form-label">Enter page name here</label>
              <input type="text" class="form-control" />
            </div>
          </div>
          <!-- modal-body -->
          <div class="modal-footer">
            <button type="button" class="btn btn-success">Create</button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <!-- modal-dialog -->
    </div>
    <!-- modal -->

    <!-- Create New Lesson Modal -->
    <div id="createNewLessonModal" class="modal fade">
      <div class="modal-dialog" role="document">
        <div class="modal-content ">
          <div class="modal-header pd-x-20">
            <h6 class="modal-title font-weight-bold">New Lesson</h6>
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
              <label class="form-label">Enter lesson name here</label>
              <input type="text" class="form-control" />
            </div>
          </div>
          <!-- modal-body -->
          <div class="modal-footer">
            <button type="button" class="btn btn-success">Create</button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <!-- modal-dialog -->
    </div>
    <!-- modal -->

    <!-- Delete lesson Modal -->
    <div id="deleteModal" class="modal fade">
      <div class="modal-dialog" role="document">
        <div class="modal-content ">
          <div class="modal-header pd-x-20">
            <h6 class="modal-title font-weight-bold">Confirm Deletion</h6>
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
            <p>Are you sure to delete the lesson 'Introduction'.</p>
          </div>
          <!-- modal-body -->
          <div class="modal-footer">
            <button type="button" class="btn btn-danger">Delete</button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <!-- modal-dialog -->
    </div>
    <!-- modal -->

    <!-- Delete Page Modal -->
    <div id="deletePageModal" class="modal fade">
      <div class="modal-dialog" role="document">
        <div class="modal-content ">
          <div class="modal-header pd-x-20">
            <h6 class="modal-title font-weight-bold">Confirm Deletion</h6>
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
            <p>Are you sure to delete the page 'Introduction'.</p>
          </div>
          <!-- modal-body -->
          <div class="modal-footer">
            <button type="button" class="btn btn-danger">Delete</button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <!-- modal-dialog -->
    </div>
    <!-- modal -->
  </div>
</template>

<script>
import Header from "@/components/header/HeaderMenuForAdmin.vue";
export default {
  components: { Header }
};
</script>

<style lang="scss">
.form-control-counter {
  position: absolute;
  bottom: 5px;
  right: 20px;
  padding: 5px;
  color: #686f7a;
  background: #dedfe0;
  font-weight: 700;
  min-width: 34px;
  line-height: 24px;
  text-align: center;
}
</style>
