<template>
  <div class="container-fluid">
    <Header></Header>
    <div class="container-fluid" style="padding: 56px 0 0;">
      <div class="rows mt-2" style="display:flex;flex-direction:row">
        <div class="col-sm-1 form-group" style="width:25%;display:none">
          <select
            id="page_q"
            class="col-xs-1 p-1"
            v-on:change="qpp()"
            style="display:none"
          >
            <option value="page">Page</option>
            <option value="quiz">Quiz</option>
          </select>
        </div>
        <div class="">
          <div class="input-group mb-5 mx-1">
            <span class="p-2" style="background:#33cccc;color:#fff">Books</span>
            <select class="p-1" id="books" v-on:change="qp()">
              <option
                v-for="book_name in book_names"
                :key="book_name.book_id"
                v-bind:value="book_name.book_id"
                >{{ book_name.book_name }}</option
              >
            </select>
          </div>
        </div>
        <!--course price-->
        <div class="">
          <div class="input-group mb-5 mx-1" id="cont_ropic">
            <span class="p-2" style="background:#33cccc;color:#fff"
              >Course Price</span
            >
            <input
              type="text"
              :value="'Rs. ' + after_disount"
              class="p-2 ml-0"
              readonly="readonly"
            />
            <button class="p-1" data-toggle="modal" data-target="#changePrice">
              Edit
            </button>
          </div>
        </div>
        <!--end course price-->

        <!--Topic start-->
        <div class="">
          <div class="input-group mb-5 mx-1" id="cont_ropic">
            <span class="p-2" style="background:#33cccc;color:#fff"
              >Topics</span
            >
            <select class="p-1" id="books_topic" v-on:change="sub_topic()">
              <option value="0">--Select Lesson--</option>
              <option value="new_topic">New Lesson</option>
              <option
                v-for="(topic_name, t_ind) in topic_names"
                :key="t_ind"
                v-bind:value="topic_name.topic_id"
                >{{ topic_name.topic_name }}</option
              >
            </select>
            <div
              class="container-fluid p-0 m-0"
              id="new_topic"
              style="display:none"
            >
              <div class="col-xs-4 p-0" id="topic_label">
                <label class="sr-only" for="inlineFormInputGroup"
                  >Enter Topic</label
                >
                <div class="input-group mb-3 mr-sm-3 mb-sm-0">
                  <div
                    class="input-group-addon"
                    style="background:#33cccc;color:#fff"
                  >
                    Topic
                  </div>
                  <input
                    class="form-control"
                    aria-label="Large"
                    aria-describedby="inputGroup-sizing-sm"
                    id="topic"
                    placeholder="Enter Topic"
                  />
                  
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--Topic End-->
        <!--sub topic start-->
        <div class="">
          <div class="input-group mb-5" id="sub_topics" style="display:none;">
            <span class="p-2 mt-0" style="background:#33cccc;color:#fff"
              >Pages</span
            >
            <select class="p-1 ml-0" id="sub_topic" v-on:change="sub_content()">
              <option value="0">--Select Page--</option>
              <option value="new_sub_topic">New Page</option>
              <option
                v-for="sub_topic_name in sub_topic_names"
                :key="sub_topic_name.page_id"
                v-bind:value="sub_topic_name.page_id"
                >{{ sub_topic_name.page_name }}</option
              >
            </select>
            <button
              class="p-1"
              data-toggle="modal"
              data-target="#changetopicModal"
            >
              Edit
            </button>
            <!-- <button class="p-1" data-toggle="modal" data-target="#AddNewAfterTopic" >Add page After</button>-->
          </div>

          <div
            class="container-fluid p-0 m-0"
            id="new_sub_topic"
            style="display:none"
          >
            <div class="col-xs-4 p-0" id="topic_label">
              <label class="sr-only" for="inlineFormInputGroup"
                >Enter Topic</label
              >
              <div class="input-group mb-3 mr-sm-3 mb-sm-0">
                <div
                  class="input-group-addon"
                  style="background:#33cccc;color:#fff"
                >
                  Sub_topic
                </div>
                <input
                  class="form-control"
                  aria-label="Large"
                  aria-describedby="inputGroup-sizing-sm"
                  id="insub_topic"
                  placeholder="Enter Topic"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--sub topic end-->
      <!--Quiz type-->
      <div class="container-fluid">
        <div class="input-group mb-5" id="Quiz_types" style="display:none;">
          <span class="p-2" style="background:#33cccc;color:#fff"
            >Quiz Type</span
          >
          <select class="p-1" id="quiz_option" v-on:change="Quiz_content()">
            <option value="0">--Select Quiz--</option>
            <!--<option value="new_sub_topic">New Sub_topic</option>-->
            <option
              v-for="quiz_type in quiz_types"
              :key="quiz_type.qt_id"
              v-bind:value="quiz_type.qt_id"
              >{{ quiz_type.type }}</option
            >
          </select>
        </div>
      </div>

      <!--Quiz Type End-->
      <div class="container-fluid">
        <select
          id="quiz_topic"
          style=" margin-bottom:3%;padding: 5px 5px 5px 5px; display:none"
        >
          <option
            v-for="topic_name in topic_names"
            :key="topic_name.topic_id"
            v-bind:value="topic_name.topic_id"
            >{{ topic_name.topic_name }}</option
          >
        </select>
      </div>
      <div class="container-fluid"></div>
      <!--<div class="container-fluid"><input type="text" class="col-xs-12" id="topic" placeholder="put your topic here" style=" margin-bottom:5%;padding: 5px 5px 5px 5px;"></div>-->
      <div class="container-fluid mt-7 p-0">
        <label class="col-xs-1" id="que_title"></label>
        <span class="col-xs-12" id="content_id">
          <!--test start -->
          <div class="col-xs-12 m-0" id="example_btn" style="display:none">
            <span class="col-xs-1 m-0" style="float:right">
              <button
                type="button"
                class="btn btn-success container-fluid"
                data-toggle="modal"
                data-target="#exampleModalCenter"
              >
                Example
              </button>
            </span>
            <span class="col-xs-2 m-0 p-0" style="float:right">
              <button
                type="button"
                class="btn container-fluid"
                data-toggle="modal"
                data-target="#precodeModal"
              >
                Code
              </button>
            </span>
            <span class="col-xs-2 m-0 p-0" style="float:right">
              <button
                type="button"
                class="btn container-fluid"
                data-toggle="modal"
                data-target="#mcq"
              >
                MCQ
              </button>
            </span>
            <span class="col-xs-2 m-0 p-0" style="float:right">
              <button
                type="button"
                class="btn container-fluid"
                data-toggle="modal"
                data-target="#fill_in_blank"
              >
                Fill in Blank
              </button>
            </span>
            <span class="col-xs-2 m-0 p-0" style="float:right">
              <button
                type="button"
                class="btn container-fluid"
                data-toggle="modal"
                data-target="#render_html"
              >
                RenderHtml
              </button>
            </span>
            <span class="col-xs-1 m-0" style="float:right">
              <button
                type="button"
                class="btn container-fluid"
                data-toggle="modal"
                data-target="#render_video"
              >
                <i
                  class="mdi mdi-video"
                  data-toggle="tooltip"
                  title=""
                  data-original-title="mdi-video"
                  style="font-size:1.20rem;"
                ></i></button
            ></span>
          </div>

          <!--video upload-->
          <div class="modal" id="render_video">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title">Video Viewer</h4>
                  <button type="button" class="close" data-dismiss="modal">
                    &times;
                  </button>
                </div>
                <div class="modal-body">
                  <div class="row">
                    <!--<input type="file" id="img" accept="video/*">-->
                    <input
                      class=""
                      type="text"
                      id="video_url"
                      placeholder="URL"
                    />
                    <button
                      type="button"
                      style="margin: 0 4px; padding: 4px; background: #3399ff;color:#fff;border:none; border-radius: 4px;"
                      onclick="showOffscreenModal('video-chooser')"
                    >
                      Choose/Upload
                    </button>
                    <div class="row col-sm-12 mt-2">
                      <div class="col-sm-12">
                        <label class="text-center "
                          >Width
                          <input
                            id="width"
                            type="text"
                            size="6"
                            v-model="v_width"
                            @keyup="propertyHandler($event)"
                        /></label>
                        <label class="text-center mx-1"
                          >Height
                          <input
                            id="height"
                            type="text"
                            size="6"
                            v-model="v_height"
                            @keyup="propertyHandler($event)"
                        /></label>
                        <!--<label class="col-sm-3 text-center">VSpace <input id="vspace" type="text" size="3" v-model="vspace" @keyup="propertyHandler($event)"></label>
                        <label class="col-sm-3 text-center">HSpace <input id="hspace" type="text" size="3" v-model="hspace" @keyup="propertyHandler($event)"></label>-->
                      </div>
                      <div class="col-sm-12">
                        <label class="row">Preview</label>
                        <!--add video-->
                        <span
                          class="row text-center"
                          id="pvdo"
                          style="border: solid thin #ccc; min-height:100px;min-width:100px;"
                        >
                          <span class="text-center m-2" style="color:#ccc"
                            >Preview</span
                          >
                        </span>
                        <!--end video-->
                      </div>
                    </div>
                  </div>
                </div>
                <!--<textarea id="lms_editor_render_html" rows="15" v-model="render_code" style="min-width:100%;"></textarea>-->
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-success"
                    v-on:click="addVideoToContent()"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!--end video upload-->
          <!--render Html-->
          <!-- The Modal -->
          <div class="modal" id="render_html">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title">Render HTML</h4>
                  <button type="button" class="close" data-dismiss="modal">
                    &times;
                  </button>
                </div>
                <textarea
                  id="lms_editor_render_html"
                  rows="15"
                  v-model="render_code"
                  style="min-width:100%;"
                ></textarea>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-success"
                    v-on:click="addHtmlRenderTemplate()"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="modal" id="fill_in_blank">
            <div class="modal-dialog">
              <div class="modal-content">
                <!-- Modal Header -->
                <div class="modal-header">
                  <h4 class="modal-title">Fill in the blank</h4>
                  <button type="button" class="close" data-dismiss="modal">
                    &times;
                  </button>
                </div>
                <!-- Modal body -->
                <div id="fwo-editor-modal">
                  <input
                    id="fwo-editor-heading"
                    type="text"
                    placeholder="Heading/Question"
                  />

                  <p class="fwo-editor-section-name">
                    Construct the quiz statement, including the blanks below.
                  </p>
                  <div id="fwo-editor-statement"></div>
                  <div id="fwo-editor-add-blank-wrapper">
                    <button id="fwo-editor-add-blank-btn">Add blank</button>
                    <button id="fwo-editor-new-line">Add New Line</button>
                    <i class="flex-filler"></i>
                    <input id="fwo-editor-text-input" type="text" />
                    <button id="fwo-editor-add-text-btn">Add text</button>
                  </div>
                  <div id="fwo-editor-add-options-wrapper">
                    <input type="text" />
                    <button>Add option</button>
                  </div>
                  <div id="fwo-editor-options-wrapper"></div>
                  <div>
                    <p class="fwo-editor-section-name">Correct feedback</p>
                    <input
                      type="text"
                      id="fwo-correct-feedback"
                      value="That's right!"
                    />

                    <p class="fwo-editor-section-name">Wrong feedback</p>
                    <input
                      type="text"
                      id="fwo-wrong-feedback"
                      value="That's not correct. Try again."
                    />
                  </div>
                </div>
                <!-- Modal footer -->
                <div class="modal-footer">
                  <button
                    id="fwo-editor-add-btn"
                    type="button"
                    class="btn btn-success"
                  >
                    Add Quiz
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!--end fill in blank-->
          <!--MCQ-->
          <!-- The Modal -->
          <div class="modal" id="mcq">
            <div class="modal-dialog">
              <div class="modal-content">
                <!-- Modal Header -->
                <div class="modal-header">
                  <h4 class="modal-title">MCQ</h4>
                  <button type="button" class="close" data-dismiss="modal">
                    &times;
                  </button>
                </div>

                <!-- Modal body -->
                <span class="col-xs-12"
                  ><input
                    class="col-sm-12"
                    type="text"
                    id="mcq_question"
                    placeholder="Question"
                  /><button
                    class=" col-sm-5 mr-2 btn btn-success"
                    @click="inc_btn += 1"
                  >
                    ADD</button
                  ><button
                    class="btn col-sm-5 btn-danger"
                    @click="inc_btn -= 1"
                    v-if="inc_btn >= 1"
                  >
                    Delete
                  </button></span
                >
                <span class="col-sm-12" v-for="i in inc_btn" :key="i + 1">
                  <input
                    class="col-sm-6"
                    :id="'opt' + i"
                    type="text"
                    :placeholder="'option' + i"
                  />Ans<input
                    type="radio"
                    :id="'true_ans' + i"
                    name="mcq_option"
                  />
                </span>
                <div id="mcq-editor-options-container"></div>
                <span class="rows">
                  <span class="rows">
                    <label class="m-0">Correct feedback</label>
                    <input
                      class="p-1 col-sm-10"
                      type="text"
                      id="correct_feedback"
                      value="That's right!"
                  /></span>

                  <span class="rows">
                    <label class="m-0">Wrong feedback</label>
                    <input
                      class="p-1 col-sm-10"
                      type="text"
                      id="wrong_feedback"
                      value="That's not correct. Try again."
                  /></span>
                </span>

                <!-- Modal footer -->
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-success"
                    v-on:click="mcq()"
                  >
                    update
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!--end MCQ-->
          <!--change course price-->
          <div class="modal" id="changePrice">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h4>Course Price</h4>
                  <button type="button" class="close" data-dismiss="modal">
                    &times;
                  </button>
                </div>
                <label
                  >Actual Price:<input
                    type="text"
                    id="disount"
                    placeholder="Actual price"
                    :value="books_price"
                    @keyup="ac_change($event)"
                /></label>
                <label
                  >Discount:
                  <input
                    type="text"
                    id="disount"
                    placeholder="discount"
                    :value="discount"
                    @keyup="dis_price($event)"
                /></label>
                <label
                  >New Price:
                  <input
                    type="text"
                    id="discounted_price"
                    placeholder="after discount course price"
                    :value="after_disount"
                    readonly="readonly"
                /></label>
                <!-- Modal footer -->
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-success"
                    v-on:click="u_price(sub_topic_name)"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!--end change price-->

          <div class="modal" id="changetopicModal">
            <div class="modal-dialog">
              <div class="modal-content">
                <!-- Modal Header -->
                <div class="modal-header">
                  <h4 class="modal-title">Topic</h4>
                  <button type="button" class="close" data-dismiss="modal">
                    &times;
                  </button>
                </div>

                <!-- Modal body -->
                <input type="text" v-model="upd_sub_topic" />

                <!-- Modal footer -->
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-success"
                    v-on:click="update_topic(sub_topic_name)"
                  >
                    update
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!--end change topic-->
          <!--precode Modal--->
          <!-- The Modal -->
          <div class="modal" id="precodeModal">
            <div class="modal-dialog">
              <div class="modal-content">
                <!-- Modal Header -->
                <div class="modal-header">
                  <h4 class="modal-title">Syntax Highlighter</h4>
                  <button type="button" class="close" data-dismiss="modal">
                    &times;
                  </button>
                </div>
                <!-- Modal body -->
                <select id="code_lang">
                  <option value="0">Select Language</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="js">javaScript</option>
                  <option value="py">Python</option>
                  <option value="sql">SQL</option>
                </select>
                <div class="modal-body">
                  <textarea
                    class="m-0 p-0"
                    id="pre_code"
                    row="20"
                    cols="45"
                  ></textarea>
                </div>
                <!-- Modal footer -->
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-success"
                    v-on:click="save_code()"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!--pre code end Modal-->
          <!-- Modal -->
          <div
            class="modal"
            id="exampleModalCenter"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div
              class="modal-dialog modal-dialog-centered"
              role="document"
              style="min-width:100%;min-height:100%;margin:0px 0px"
            >
              <div
                class="modal-content m-0"
                style="min-width:100%;min-height:100%;"
              >
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLongTitle">
                    LMS Editor
                  </h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body container-fluid">
                  <div class="container-fluid">
                    <div class="container-fluid" style="min-width:100%;">
                      <span class="col-xs-2 text-right" style="float:right">
                        <select
                          class="browser-default custom-select custom-select-lg mb-3"
                          id="example_opt"
                        >
                          <option value="1" selected>Related Example</option>
                          <option value="2">Other Example</option>
                        </select>
                      </span>
                      <ul
                        class="nav nav-pills mb-3"
                        id="pills-tab"
                        role="tablist"
                      >
                        <li
                          class="nav-item"
                          style="display:flex;flex-direction:row; align-items: center; margin: 0 8px;"
                        >
                          <a
                            class="nav-link active"
                            id="pills-home-tab"
                            data-toggle="pill"
                            href="#pills-home"
                            role="tab"
                            aria-controls="pills-home"
                            aria-selected="true"
                            >index.html</a
                          >
                          <input
                            type="checkbox"
                            style="margin-left:8px;;"
                            id="html_checkbox"
                          />
                        </li>
                        <li
                          class="nav-item"
                          style="display:flex;flex-direction:row; align-items: center; margin: 0 8px;"
                        >
                          <a
                            class="nav-link"
                            id="pills-profile-tab"
                            data-toggle="pill"
                            href="#pills-profile"
                            role="tab"
                            aria-controls="pills-profile"
                            aria-selected="false"
                            >style.css</a
                          >
                          <input
                            type="checkbox"
                            style="margin-left: 8px;"
                            id="css_checkbox"
                          />
                        </li>
                        <li
                          class="nav-item"
                          style="display:flex;flex-direction:row; align-items: center; margin: 0 8px;"
                        >
                          <a
                            class="nav-link"
                            id="pills-contact-tab"
                            data-toggle="pill"
                            href="#pills-contact"
                            role="tab"
                            aria-controls="pills-contact"
                            aria-selected="false"
                            >script.js</a
                          >
                          <input
                            type="checkbox"
                            style="margin-left: 8px;"
                            id="js_checkbox"
                          />
                        </li>
                        <li
                          class="nav-item"
                          style="display:flex;flex-direction:row; align-items: center; margin: 0 8px;"
                        >
                          <a
                            class="nav-link"
                            id="pills-python-tab"
                            data-toggle="pill"
                            href="#pills-python"
                            role="tab"
                            aria-controls="pills-python"
                            aria-selected="false"
                            >main.py</a
                          >
                          <input
                            type="checkbox"
                            style="margin-left: 8px;"
                            id="py_checkbox"
                          />
                        </li>
                        <li
                          class="nav-item"
                          style="display:flex;flex-direction:row; align-items: center; margin: 0 8px;"
                        >
                          <a
                            class="nav-link"
                            id="pills-sql-tab"
                            data-toggle="pill"
                            href="#pills-sql"
                            role="tab"
                            aria-controls="pills-sql"
                            aria-selected="false"
                            >SQL</a
                          >
                          <input
                            type="checkbox"
                            style="margin-left: 8px;"
                            id="sql_checkbox"
                          />
                        </li>
                      </ul>

                      <div class="tab-content" id="pills-tabContent">
                        <div
                          class="tab-pane fade show active"
                          id="pills-home"
                          role="tabpanel"
                          aria-labelledby="pills-home-tab"
                        >
                          <codemirror
                            class="container-fluid"
                            ref="myCm"
                            :value="html_code"
                            :options="cmOptions"
                            @ready="onCmReady"
                            @focus="onCmFocus"
                            @input="onCmCodeChange"
                          ></codemirror>
                        </div>
                        <div
                          class="tab-pane fade"
                          id="pills-profile"
                          role="tabpanel"
                          aria-labelledby="pills-profile-tab"
                        >
                          <codemirror
                            class="container-fluid"
                            ref="myCm1"
                            :value="css_code"
                            :options="cmOptions"
                            @ready="onCmReady1"
                            @focus="onCmFocus1"
                            @input="onCmCodeChange1"
                          ></codemirror>
                        </div>
                        <div
                          class="tab-pane fade"
                          id="pills-contact"
                          role="tabpanel"
                          aria-labelledby="pills-contact-tab"
                        >
                          <codemirror
                            class="container-fluid"
                            ref="myCm2"
                            :value="jss_code"
                            :options="cmOptions"
                            @ready="onCmReady2"
                            @focus="onCmFocus2"
                            @input="onCmCodeChange2"
                          ></codemirror>
                        </div>
                        <!--python codemirror-->
                        <div
                          class="tab-pane fade"
                          id="pills-python"
                          role="tabpanel"
                          aria-labelledby="pills-python-tab"
                        >
                          <codemirror
                            class="container-fluid"
                            ref="myCm2"
                            v-model="py_code"
                            :options="cmOptions"
                            @ready="onCmReady3"
                            @focus="onCmFocus3"
                            @input="onCmCodeChange3"
                          ></codemirror>
                        </div>
                        <!--end python mirror-->
                        <!--Sql Editor-->
                        <div
                          class="tab-pane fade"
                          id="pills-sql"
                          role="tabpanel"
                          aria-labelledby="pills-sql-tab"
                        >
                          <codemirror
                            class="container-fluid"
                            ref="myCm3"
                            v-model="sql_code"
                            :options="cmOptions"
                            @ready="onCmReady4"
                            @focus="onCmFocus4"
                            @input="onCmCodeChange4"
                          ></codemirror>
                        </div>
                        <!--end Sql Editor-->
                      </div>

                      <div></div>
                      <div
                        class="container-fluid"
                        style="border: thin dashed #ccc;margin-top:2%; "
                      >
                        <label>Output</label>
                        <div id="sectionA" class="active in">
                          <iframe frameborder="0" id="preview"></iframe>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <div class="col-xs-12 text-right" style="text-align:right">
                      <button
                        type="button"
                        class="btn btn-success col-xs-2"
                        v-on:click="editPreview()"
                        style
                      >
                        Run
                      </button>
                      <button
                        type="button"
                        class="btn btn-success col-xs-2"
                        v-on:click="save_editor_code()"
                        style
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        class="btn btn-danger col-xs-2"
                        data-dismiss="modal"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- end test content-->

          <vue-ckeditor v-model="content" :config="config" />
        </span>
      </div>
      <!--Multiple choice Quiz-->
      <div class="container-fluid mt-3" id="mcq" style="display:none;">
        <label class="col-xs-1">Option A</label>
        <span class="col-xs-11">
          <vue-ckeditor v-model="opt1" :config="config" />
        </span>
        <label class="col-xs-1">Option B</label>
        <span class="col-xs-11">
          <vue-ckeditor v-model="opt2" :config="config" />
        </span>
        <label class="col-xs-1">Option C</label>
        <span class="col-xs-11">
          <vue-ckeditor v-model="opt3" :config="config" />
        </span>
        <label class="col-xs-1">Option D</label>
        <span class="col-xs-11">
          <vue-ckeditor v-model="opt4" :config="config" />
        </span>

        <label class="col-xs-1">True Option</label>
        <select class="col-xs-2 p-3 dropdown-default" id="true_ans_mcq">
          <option value="0">--Select Option--</option>
          <option value="opt1">Option 1</option>
          <option value="opt2">Option 2</option>
          <option value="opt3">Option 3</option>
          <option value="opt4">Option 4</option>
        </select>
      </div>
      <!--Multiple choice Quiz-->
      <div class="container-fluid" id="dess" style=" display:none;">
        <span class="col-xs-12 text-warning h3"
          >Note:seperate Description content by ',' sign</span
        >
        <label class="col-xs-1">Description</label>
        <span class="col-xs-11">
          <vue-ckeditor v-model="content1" :config="config" />
        </span>
        <span class="col-xs-12 text-warning h3" id="true_ans_label"
          >Note: seperate Answer content by ',' sign same as description</span
        >
        <label class="col-xs-1">Ans</label>
        <span class="col-xs-11">
          <vue-ckeditor v-model="content2" :config="config" />
        </span>
      </div>

      <div class="container-fluid text-right" style="text-align:right;">
        <button class="col-xs-3" style="float:right" v-on:click="daat()">
          Save
        </button>
        <button
          class="col-xs-3"
          style="float:right;margin-right:8px"
          v-on:click="delete_page()"
        >
          Delete
        </button>
      </div>
      <span id="preview" style="display:;">
        Preview:
        <div id="pre" v-html="content"></div>
      </span>
    </div>

    <div id="image-chooser" class="offscreen-modal-cv">
      <div class="modal-box-cv">
        <div class="modal-cv-header">
          <h3>Choose image</h3>
          <i class="flex-filler"></i>
          <a class="modal-cv-close" data-modal-id="image-chooser"
            ><i class="fas fa-times"></i
          ></a>
        </div>
        <div class="modal-cv-content">
          <div
            id="image-gallery-wrapper"
            style="height: 100%; padding: 16px; text-align: center; overflow-x: hidden; overflow-y: auto"
          >
            <div
              v-for="(file, ind) in files"
              :key="ind"
              style="display:inline-block;"
              @click="imageSelected($event)"
            >
              <img
                :src="'/resources/Book_content/' + file"
                border="2"
                style="height: 100px;margin: 5px 10px 5px"
              />
              <p style="text-align:center;color:#000">{{ file }}</p>
            </div>
          </div>
        </div>
        <div class="modal-cv-footer">
          <input
            id="file-chooser-input"
            accept="image/*"
            type="file"
            style="padding: 8px; border-radius: 4px;"
          />
          <i class="flex-filler"></i>
          <button
            id="upload-img-btn"
            type="button"
            style="margin: 0 8px; padding: 8px; background: #3399ff; color: #fff; border-radius: 4px;"
          >
            Upload
          </button>
        </div>
      </div>
    </div>

    <!--video chooser-->
    <div id="video-chooser" class="offscreen-modal-cv">
      <div class="modal-box-cv">
        <div class="modal-cv-header">
          <h3>Choose Video</h3>
          <i class="flex-filler"></i>
          <a class="modal-cv-close" data-modal-id="video-chooser"
            ><i class="fas fa-times"></i
          ></a>
        </div>
        <div class="modal-cv-content">
          <div
            class=""
            id="image-gallery-wrapper"
            style="height: 100%; overflow-x: hidden; overflow-y: auto"
          >
            <div
              class="col-sm-2 mx-1 my-1 p-0 text-center"
              v-for="(video, ind) in videos"
              :key="ind"
              style="display:inline-block;border:solid thin #ccc;cursor:pointer"
              @click="videoSelected($event)"
            >
              <!--<video width="320" height="240" controls controlsList="nodownload">
            <source :src="'/resources/books_video/'+video" :type="'video/'+video.substr(video.lastIndexOf('.') + 1)">
         </video>-->
              <span class="col-sm-12 m-0 p-0">
                <i class="fas fa-video fa-4x"></i>
                <p
                  style="text-align:center;color:#000;font-size:12px;overflow:hidden"
                >
                  {{ video }}
                </p>
              </span>
            </div>
          </div>
        </div>
        <div class="modal-cv-footer">
          <input
            id="video-chooser-input"
            type="file"
            accept="video/mp4,video/ogg,video/webm"
            style="padding: 8px; border-radius: 4px;"
          />
          <i class="flex-filler"></i>
          <button
            id="upload-vdo-btn"
            type="button"
            style="margin: 0 8px; padding: 8px; background: #3399ff; color: #fff; border-radius: 4px;"
            @click="upload_video"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
    <!--end video chooser-->
    <!--<component
      :is="'script'"
      src="/assets/js/ckeditor/ckeditor.js"
    >
   </component>-->
  </div>
</template>

<script>
var insertedImageBrowseBtn = false;
var ckEditorImageUrlInput;
var currentlyEditingQuizItem;
import VueCkeditor from "vue-ckeditor2";
import { codemirror } from "vue-codemirror";
import Header from "@/components/header/HeaderMenuForAdmin.vue";

import moment from "vue-moment";

import axios from "axios";
// require styles
import "codemirror/lib/codemirror.css";
// language js
import "codemirror/mode/javascript/javascript.js";
// theme css
import "codemirror/theme/base16-dark.css";
export default {
  components: { VueCkeditor, codemirror, Header },
  data() {
    return {
      html_code: "",
      css_code: "",
      jss_code: "",
      py_code: "",
      sql_code: "",
      content: "",
      content1: "",
      content2: "",
      opt1: "",
      opt2: "",
      opt3: "",
      opt4: "",
      files: [],
      videos: [],
      v_width: 320,
      v_height: 240,
      vspace: 0,
      hspace: 0,
      inc_btn: 1,
      fill_words: "",
      fill_inc_btn: 0,
      fill_in_statement: "",
      render_code: "",
      discount: 0,
      after_disount: 0,
      books_price: 0,

      cmOptions: {
        // codemirror options
        tabSize: 5,
        mode: "text/javascript",
        extraKeys: { "Ctrl-Space": "autocomplete" },
        autoCloseTags: true,
        theme: "base16-dark",
        lineNumbers: true,
        styleActiveLine: true,
        line: true,
        connect: "align",

        collapseIdentical: false,
        highlightDifferences: true,
        lineWrapping: true
      },
      book_names: [],
      topic_names: [],
      sub_topic_names: [],
      sub_topic_name: 0,
      upd_sub_topic: "",
      quiz_types: [],
      config: {
        toolbar: [
          // { name: 'document', items: [ 'Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates' ] },
          { name: "document", items: ["Templates"] },
          //{ name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
          {
            name: "clipboard",
            items: ["Cut", "Copy", "Paste", "Undo", "Redo"]
          },
          //{ name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
          { name: "editing", items: ["Find", "Replace"] },
          { name: "forms", items: ["Button", "TextField", "Textarea"] },
          //	{ name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
          //	'/',
          //{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
          {
            name: "basicstyles",
            items: [
              "Bold",
              "Italic",
              "Underline",
              "Strike",
              "Subscript",
              "Superscript",
              "CopyFormatting",
              "RemoveFormat"
            ]
          },
          //{ name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
          {
            name: "paragraph",
            items: [
              "NumberedList",
              "BulletedList",
              "-",
              "Outdent",
              "Indent",
              "-",
              "Blockquote",
              "-",
              "JustifyLeft",
              "JustifyCenter",
              "JustifyRight",
              "JustifyBlock",
              "Language"
            ]
          },
          //{ name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
          { name: "links", items: ["Link", "Unlink", "Iframe"] },
          { name: "colors", items: ["TextColor", "BGColor"] },
          //{ name: 'insert', items: [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
          //'/',
          //{ name: 'insert', items: [ 'Image',  'Table', 'HorizontalRule', 'Smiley', 'SpecialChar' ] },
          {
            name: "insert",
            items: [
              "Image",
              "Flash",
              "Video",
              "Table",
              "HorizontalRule",
              "SpecialChar"
            ]
          },
          { name: "styles", items: ["Styles", "Format", "Font", "FontSize"] }
        ],
        height: 150
      }
    };
  },

  beforeCreate() {},
  created() {},
  beforeMount() {
    showPreloader();
    this.books_content();
  },

  mounted() {
    var vm = this;

    // Add file upload button to CKEditor image insert dialog.
    if (!insertedImageBrowseBtn) {
      var observer = new MutationObserver(function() {
        var imgPreviewBox = $(".ImagePreviewBox");
        // console.log(imgPreviewBox.length);
        if (imgPreviewBox.length) {
          var input;
          var currentParent = imgPreviewBox[0].parentElement;
          var foundParent = false;
          while (!foundParent) {
            if ($(currentParent).hasClass("cke_dialog")) {
              foundParent = true;
              break;
            } else currentParent = currentParent.parentElement;
          }
          if (foundParent) {
            var inputElements = $(currentParent).find("input");
            ckEditorImageUrlInput = inputElements[0];
            var upload = $(
              '<button type="button" style="margin: 0 8px; padding: 8px; background: #3399ff; color: #fff; border-radius: 4px;">Choose/Upload</button>'
            );
            $(inputElements[0]).after(upload);
            upload.click(function() {
              showOffscreenModal("image-chooser");
            });

            insertedImageBrowseBtn = true;
            observer.disconnect();
          }
        }

        var upload = $("#upload-img-btn");
        upload.unbind("click");
        upload.click(function() {
          var formData = new FormData();
          let file = $("#file-chooser-input")[0].files[0];
          if (!file) return;
          formData.append("file", file);

          $.ajax({
            url: "/api/user/uploadLmsImage",
            data: formData,
            type: "POST",
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
              $.ajax({
                url: "/api/user/getLmsImages",
                type: "GET",
                contentType: false,
                success: function(data) {
                  vm.files = data;
                }
              });
            }
          });
        });
      });

      observer.observe(document.body, {
        attributes: false,
        childList: true,
        subtree: true
      });
      //function for file chooser
      $.ajax({
        url: "/api/user/getLmsImages",
        type: "GET",
        contentType: false,
        success: function(data) {
          vm.files = data;
        }
      });
      //end function for filechooser
      $("#upload-image-btn").click(function() {});

      $(".offscreen-modal-cv").click(function(e) {
        if (e.currentTarget == e.target) hideOffscreenModal(e.currentTarget.id);
      });
      $(".modal-cv-close").click(function(e) {
        e.preventDefault();
        hideOffscreenModal(e.currentTarget.dataset.modalId);
      });
    }

    /**** Set up 'Fill With Options' quiz modal  ********/
    var fwoEditorStatmentContainer = $("#fwo-editor-statement");
    $("#fwo-editor-add-blank-btn").unbind("click");
    $("#fwo-editor-add-blank-btn").click(function() {
      fwoEditorStatmentContainer.append(
        '<span class="fwo-editor-blank" contenteditable="true"></span>'
      );
    });
    $("#fwo-editor-new-line").unbind("click");
    $("#fwo-editor-new-line").click(function() {
      fwoEditorStatmentContainer.append("<br>");
    });
    var fwoEditorTextInput = $("#fwo-editor-text-input");
    $("#fwo-editor-add-text-btn").unbind("click");
    $("#fwo-editor-add-text-btn").click(function() {
      fwoEditorStatmentContainer.append(
        '<span contenteditable="true">' +
          fwoEditorTextInput
            .val()
            .replace(/\s/g, "&nbsp;")
            .replace(/&/g, "&amp;")
            .replace(/>/g, "&gt;")
            .replace(/</g, "&lt;")
            .replace(/"/g, "&quot;") +
          "</span>"
      );
      fwoEditorTextInput.val("");
    });

    var fwoOptionInput = $("#fwo-editor-add-options-wrapper input")[0];
    var fwoOptionsWrapper = $("#fwo-editor-options-wrapper");
    $($("#fwo-editor-add-options-wrapper button")[0]).unbind("click");
    $($("#fwo-editor-add-options-wrapper button")[0]).click(function() {
      if (fwoOptionInput.value == "") return;
      fwoOptionsWrapper.append(
        '<div class="fwo-editor-option"><span>' +
          fwoOptionInput.value
            .replace(/&/g, "&amp;")
            .replace(/>/g, "&gt;")
            .replace(/</g, "&lt;")
            .replace(/"/g, "&quot;") +
          '</span><a><i class="fas fa-times"></i></a></div>'
      );
      fwoOptionInput.value = "";
      let options = $(".fwo-editor-option");
      $(options[options.length - 1])
        .find("a")
        .click(function(e) {
          e.currentTarget.parentElement.parentElement.removeChild(
            e.currentTarget.parentElement
          );
        });
    });

    $("#fwo-editor-add-btn").click(function() {
      let heading = $("#fwo-editor-heading");
      if (heading.val() == "") return;
      var template = "%fwo%";
      var elements = $("#fwo-editor-statement").children();
      var ans = "";
      let statementTemplate = "";
      for (var i = 0; i < elements.length; i++) {
        if (elements[i].tagName.toLowerCase() == "br") {
          statementTemplate += "%br%";
        } else {
          let spanContent = elements[i].textContent.trim();
          ans += spanContent;

          if ($(elements[i]).hasClass("fwo-editor-blank")) {
            if (spanContent.length < 4) {
              statementTemplate += "%blanksmall%";
            } else if (spanContent.length < 10) {
              statementTemplate += "%blank%";
            } else {
              statementTemplate += "%blanklarge%";
            }
          } else {
            statementTemplate +=
              "%words%" + elements[i].textContent.trim() + "%endwords%";
          }
        }
      }
      ans = escapeRegExp(ans);
      template += "%answer%" + ans + "%endanswer%";
      template += "%question%" + heading.val() + "%endquestion%";
      template += "%statement%" + statementTemplate + "%endstatement%";

      let options = $(".fwo-editor-option span");
      let optionsTemplate = "";
      for (var i = 0; i < options.length; i++) {
        optionsTemplate += "%option%" + options[i].textContent + "%endoption%";
      }

      template += "%options%" + optionsTemplate + "%endoptions%";
      template +=
        "%correctfeedback%" +
        $("#fwo-correct-feedback").val() +
        "%endcorrectfeedback%";
      template +=
        "%wrongfeedback%" +
        $("#fwo-wrong-feedback").val() +
        "%endwrongfeedback%";
      template += "%endfwo%";

      vm.content +=
        "<pre>" +
        template
          .replace(/>/g, "&gt;")
          .replace(/</g, "&lt;")
          .replace(/"/g, "&quot;") +
        "</pre>";
      heading.val("");
      $("#fwo-editor-statement").html("");
      $("#fwo-editor-options-wrapper").html("");
      $("[data-dismiss=modal]").trigger({ type: "click" });
    });
  },

  updated() {
    $($(".cke_wysiwyg_frame").contents()[0].body).unbind("click");
    $($(".cke_wysiwyg_frame").contents()[0].body).click(function(e) {
      var target = e.target;
      var text = target.textContent;
      if (text.includes("%mcq%")) {
        // Open mcq editor with data
        $("#mcq").modal();
        // Fill mcq dialog with data

        var questions = getWholeMatches(text, "%question%", "%endquestion%");
        var question = getStringBetween(
          questions[0],
          "%question%",
          "%endquestion%"
        );

        var options = getWholeMatches(text, "%option%", "%endoption%");

        var optionsHtml = "";
        for (var i = 0; i < options.length; i++) {
          let optionText = getStringBetween(
            options[i],
            "%option%",
            "%endoption%"
          );
          optionsHtml +=
            '<span class="col-sm-12">' +
            '<input class="col-sm-6" id=opt"' +
            i +
            '" type="text" placeholder="option' +
            i +
            '" value="' +
            optionText +
            '"><button class="btn btn-danger">Delete</button>Ans<input type="radio" id=""  name="mcq_option">' +
            "</span>";
        }
        $("#mcq_question").val(question);
        $("#mcq-editor-options-container").html(optionsHtml);
      }
    });

    document.getElementById(
      "pre"
    ).innerHTML = getLmsContentWithAllTemplatesRendered(this.content);

    initLmsQuizzesAndStuff();

    $("#lesson-content-actual img").unbind("click");
    $("#lesson-content-actual img").click(function(e) {
      e.preventDefault();
      e.stopPropagation();
      showOffscreenModal("lightbox-modal");

      $($("#lightbox-modal .modal-box-cv")[0]).css(
        "background-image",
        'url("' + e.currentTarget.src + '")'
      );
    });

    $(".modal-close-btn-cv").unbind("click");
    $(".modal-close-btn-cv").click(function(e) {
      e.preventDefault();
      hideOffscreenModal(e.currentTarget.parentElement.id);
    });

    $(".offscreen-modal-cv").unbind("click");
    $(".offscreen-modal-cv").click(function(e) {
      if (e.currentTarget == e.target) hideOffscreenModal(e.currentTarget.id);
    });
  },
  methods: {
    propertyHandler: function(e) {
      let attr = e.currentTarget.id;
      switch (attr) {
        case "width":
          {
          }
          $("#video").attr("width", this.v_width);
          break;
        case "height":
          $("#video").attr("height", this.v_height);
          break;
        case "vspace":
          $("#video").attr("vspace", this.vspace);
          break;
        case "hspace":
          $("#video").attr("hspace", this.hspace);
          break;
      }
    },
    upload_video: async function() {
      let vm = this;
      var formData = new FormData();
      var files = $("#video-chooser-input")[0].files[0];
      //   console.log(files);
      if (!files) {
        window.cvNotify("Choose File before upload.");
        return;
      }
      formData.append("file", files);
      let config = {
        header: {
          "Content-Type": "multipart/form-data"
        }
      };
      // console.log(formData);
      axios.post("/api/user/uploadLmsVideo", formData, config).then(res => {
        window.cvNotify("successfully uploaded", "success");
        vm.books_content();
      });
    },
    u_price: function() {
      let book_id = document.getElementById("books").value;
      let vm = this;
      axios
        .post("/api/user/UpdateBookPrice", {
          book_id: book_id,
          discount: this.discount,
          actual_price: this.books_price,
          new_price: this.after_disount
        })
        .then(res => {
          vm.after_disount = (vm.books_price * (100 - vm.discount)) / 100;
          window.cvNotify("Course Successfully Updated", "success");
          $("#changePrice").modal("hide");
        });
    },
    ac_change: function(e) {
      this.books_price = e.target.value.trim();
    },
    dis_price: function(e) {
      let discount = e.target.value.trim();

      var numbers = /^[+-]?\d+(\.\d+)?$/; // /^[0-9]+$/;
      //   if(e.key=="Enter")
      {
        if (discount.match(numbers)) {
          discount = parseFloat(discount);
          if (discount >= 0 && discount <= 100) {
            this.discount = discount;
            let after_disount =
              (this.books_price * (100 - this.discount)) / 100;
            $("#discounted_price").val(after_disount);
          } else {
            window.cvNotify(
              "Please provide discount only 0 to 100 numbers only",
              "warning"
            );
            return false;
          }
        } else {
          window.cvNotify("Please insert numeric value only", "error");
          return false;
        }
      }
    },
    onCmReady(cm) {},
    onCmFocus(cm) {},
    onCmReady1(cm) {},
    onCmFocus1(cm) {},
    onCmReady2(cm) {},
    onCmFocus2(cm) {},
    onCmReady3(cm) {},
    onCmFocus3(cm) {},
    onCmReady4(cm) {},
    onCmFocus4(cm) {},
    onCmCodeChange(newCode) {
      this.html_code = newCode;
      //alert('this is new code', newCode);
    },
    onCmCodeChange1(newCode) {
      this.css_code = newCode;
    },
    onCmCodeChange2(newCode) {
      this.jss_code = newCode;
    },
    onCmCodeChange3(newCode) {
      this.py_code = newCode;
    },
    onCmCodeChange4(newCode) {
      //this.py_code = newCode;
    },
    run_code: function() {
      //alert(this.html_code);
      document.getElementById("preview").innerHTML = "";
      var previewFrame = document.getElementById("preview");
      var preview =
        previewFrame.contentDocument || previewFrame.contentWindow.document;
      preview.open();
      if (this.html_code == "") {
        var cs_code = this.css_code;
        var js = this.jss_code;
      } else {
        var result = this.html_code.includes("<head>");
        if (result == true) {
          var cs_code = this.css_code;
          var js = this.jss_code;
          var code = this.html_code.replace(
            "<head>",
            "<head><style>" +
              cs_code +
              "<\/\style>\<\script>" +
              js +
              " <\/\script>"
          );
        } else {
          var cs_code = this.css_code;
          var js = this.jss_code;
          var code = this.html_code.replace(
            "<html>",
            "<html><head><style> " +
              cs_code +
              " </style>\<\script> " +
              js +
              " <\/\script></head>"
          );
        }
      }
      preview.write(code);
      preview.close();
    },
    editPreview: function() {
      var frame = document.getElementById("preview");
      frame.parentNode.removeChild(frame);
      var ifrm = document.createElement("iframe");
      ifrm.setAttribute("frameborder", "0");
      ifrm.setAttribute("id", "preview");
      document.getElementById("sectionA").appendChild(ifrm);
      this.run_code();
    },

    qpp: function() {
      var dec = document.getElementById("page_q").value;
      let vm = this;
      //alert(dec);
      if (dec == "quiz") {
        this.content = " ";
        var elem = document.getElementById("content_id");
        elem.classList.remove("col-xs-12");
        elem.classList.add("col-xs-11"); // Add class
        //document.getElementById("quiz_topic").style.display = "inline-block";
        document.getElementById("topic_label").style.display = "none";
        document.getElementById("topic").style.display = "none";
        document.getElementById("preview").style.display = "none";
        //documnent.getElementById("que_title").style.display = "block";
        document.getElementById("Quiz_types").style.display = "block";
        document.getElementById("example_btn").style.display = "none";
        //document.getElementById("dess").style.display = "block";
        document.getElementById("que_title").innerHTML = "Question";
        var book_id = document.getElementById("books").value;
        var topicd = document.getElementById("books_topic");
        var stopicd = document.getElementById("sub_topic");
        for (var i = 0; i < topicd.length; i++) {
          topicd[i].value == "new_topic"
            ? (topicd[i].disabled = true)
            : (topicd[i].disabled = false);
        }
        topicd.options[0].selected = true;

        for (var i = 0; i < stopicd.length; i++) {
          stopicd[i].value == "new_sub_topic"
            ? (stopicd[i].disabled = true)
            : (stopicd[i].disabled = false);
        }
        stopicd.options[0].selected = true;
        this.sub_topic();

        axios
          .post("/api/user/DisplayTopicss", { book_id: book_id })
          .then(function(res) {
            // console.log('Display topicss')
            //  console.log(res);
            vm.topic_names = res.data.data;
          });
      } else {
        this.content = " ";
        this.content1 = " ";
        this.content2 = " ";
        this.opt1 = " ";
        this.opt2 = " ";
        this.opt3 = " ";
        this.opt4 = " ";
        document.getElementById("true_ans_mcq").options[0].selected = true;
        var elem = document.getElementById("content_id");
        elem.classList.remove("col-xs-11");
        elem.classList.add("col-xs-12"); // Add class
        document.getElementById("example_btn").style.display = "none";
        document.getElementById("quiz_topic").style.display = "none";
        document.getElementById("Quiz_types").style.display = "none";
        document.getElementById("topic_label").style.display = "block";
        document.getElementById("topic").style.display = "block";
        document.getElementById("preview").style.display = "none";
        document.getElementById("dess").style.display = "none";
        document.getElementById("mcq").style.display = "none";
        document.getElementById("que_title").innerHTML = "";
        var topicd = document.getElementById("books_topic");
        var stopicd = document.getElementById("sub_topic");
        for (var i = 0; i < topicd.length; i++)
          if (topicd[i].disabled == true) {
            topicd[i].disabled = false;
            break;
          }
        topicd.options[0].selected = true;

        for (var i = 0; i < stopicd.length; i++)
          if (stopicd[i].disabled == true) {
            stopicd[i].disabled = false;
            break;
          }
        stopicd.options[0].selected = true;
        this.sub_topic();
      }
    },
    sub_content: function() {
      var sub_topic_id = document.getElementById("sub_topic").value;
      let vm = this;
      if (sub_topic_id == "new_sub_topic") {
        var dec = document.getElementById("page_q").value;
        if (dec == "page") {
          document.getElementById("example_btn").style.display = "block";
          this.content = " ";
        } else {
          document.getElementById("example_btn").style.display = "none";
          this.content = " ";
          this.content1 = " ";
          this.content2 = " ";
          this.opt1 = " ";
          this.opt2 = " ";
          this.opt3 = " ";
          this.opt4 = " ";
        }
        document.getElementById("new_sub_topic").style.display = "block";
      } else {
        var dec = document.getElementById("page_q").value;

        if (dec == "page") {
          document.getElementById("example_btn").style.display = "block";
          this.sub_topic_name = document.getElementById("sub_topic").value;
          var index = this.sub_topic_names.findIndex(
            x => x.page_id == this.sub_topic_name
          );
          this.upd_sub_topic = this.sub_topic_names[index].page_name;
        } else document.getElementById("example_btn").style.display = "none";
        document.getElementById("new_sub_topic").style.display = "none";
        document.getElementById("example_btn").style.display = "block";
        var qopt = document.getElementById("quiz_option");
        qopt.options[0].selected = true;

        this.Quiz_content();
        //alert(sub_topic_id);
        this.sub_data(sub_topic_id);
      }
    },
    Quiz_content: function() {
      var quiz_option = document.getElementById("quiz_option").value;

      if (quiz_option == 1 || quiz_option == 2) {
        document.getElementById("dess").style.display = "block";
        document.getElementById("mcq").style.display = "none";
      } else if (quiz_option == 0) {
        document.getElementById("dess").style.display = "none";
        document.getElementById("mcq").style.display = "none";
      } else {
        document.getElementById("dess").style.display = "none";
        document.getElementById("mcq").style.display = "block";
      }
    },
    sub_data: function(e) {
      var sub_topic_id = e;
      let vm = this;
      var dec = document.getElementById("page_q").value;

      if (dec == "quiz") {
        document.getElementById("example_btn").style.display = "none";
        if (sub_topic_id == 0) {
          this.content = " ";
          this.content1 = " ";
          this.content2 = " ";
          this.opt1 = " ";
          this.opt2 = " ";
          this.opt3 = " ";
          this.opt4 = " ";
          document.getElementById("true_ans_mcq").options[0].selected = true;
        }

        axios
          .post("/api/user/DisplaySubTopicQuiz", { sub_topic_id: sub_topic_id })
          .then(function(res) {
            if (res.data.data.length == "0" || res.data.data.length == 0) {
              vm.content = " ";
              vm.content1 = " ";
              vm.content2 = " ";
              vm.opt1 = " ";
              vm.opt2 = " ";
              vm.opt3 = " ";
              vm.opt4 = " ";
              document.getElementById(
                "true_ans_mcq"
              ).options[0].selected = true;
            } else {
              vm.content = res.data.data[0].question;
              vm.content1 = res.data.data[0].description;
              vm.content2 = res.data.data[0].true_ans;
              var qtId = res.data.data[0].qt_id;
              vm.opt1 = res.data.data[0].opt1;
              vm.opt2 = res.data.data[0].opt2;
              vm.opt3 = res.data.data[0].opt3;
              vm.opt4 = res.data.data[0].opt4;
              var qopt = document.getElementById("quiz_option");
              // alert(qtId);
              if (qtId == "3" || qtId == 3) {
                var txt = res.data.data[0].true_ans;
                var numb = txt.match(/\d/g);
                numb = parseInt(numb);
                document.getElementById("true_ans_mcq").options[
                  numb
                ].selected = true;
              }
              //var t_v_q  = res.body.data[0].true_ans;
              //true_ans.options[this.content2].selected = true;
              qopt.options[qtId].selected = true;
              vm.Quiz_content();
            }
            //var t_v_q  = res.body.data[0].true_ans;
            //true_ans.options[this.content2].selected = true;
            qopt.options[qtId].selected = true;
            this.Quiz_content();
          });
      } else {
        if (sub_topic_id == 0) {
          this.content = " ";
          document.getElementById("example_btn").style.display = "none";
        } else document.getElementById("example_btn").style.display = "block";
        this.$http
          .post("/api/user/DisplaySubTopicCont", { sub_topic_id: sub_topic_id })
          .then(
            function(res) {
              this.content = res.data.data[0].content;
            },
            function(res) {}
          );
      }
    },
    sub_topic: function() {
      var topic_id = document.getElementById("books_topic").value;
      //alert(topic_id);
      if (topic_id == 0) {
        if (document.getElementById("new_topic").style.display == "block")
          document.getElementById("new_topic").style.display = "none"; //new_sub_topic
        document.getElementById("sub_topics").style.display = "none";
        document.getElementById("new_sub_topic").style.display = "none";
        document.getElementById("example_btn").style.display = "none";
        this.content = " ";
        this.content1 = " ";
        this.content2 = " ";
        this.opt1 = " ";
        this.opt2 = " ";
        this.opt3 = " ";
        this.opt4 = " ";
        var qopt = document.getElementById("quiz_option");
        qopt.options[0].selected = true;
        this.Quiz_content();

        return;
      } else {
        if (topic_id == "new_topic") {
          var dec = document.getElementById("page_q").value;
          if (dec == "page") {
            document.getElementById("example_btn").style.display = "block";
            this.content = " ";
          } else {
            document.getElementById("example_btn").style.display = "none";
            this.content = " ";
            this.content1 = " ";
            this.content2 = " ";
            this.opt1 = " ";
            this.opt2 = " ";
            this.opt3 = " ";
            this.opt4 = " ";
          }
          document.getElementById("new_topic").style.display = "block";
          document.getElementById("new_sub_topic").style.display = "block";
          document.getElementById("sub_topics").style.display = "none";
        } else {
          var dec = document.getElementById("page_q").value;

          document.getElementById("example_btn").style.display = "none";
          document.getElementById("new_topic").style.display = "none";
          document.getElementById("new_sub_topic").style.display = "none";
          document.getElementById("sub_topics").style.display = "block";
          var stopicd = document.getElementById("sub_topic");
          stopicd.options[0].selected = true;
          var qopt = document.getElementById("quiz_option");
          qopt.options[0].selected = true;
          this.Quiz_content();
          this.$http
            .post("/api/user/DisplaySubTopicss", { topic_id: topic_id })
            .then(
              function(res) {
                this.sub_topic_names = "";
                this.sub_topic_names = res.data.data;
              },
              function(res) {}
            );
          if (
            document.getElementById("new_sub_topic").style.display == "none"
          ) {
            var e = document.getElementById("sub_topic");
            var sub_topic_id = e.options[e.selectedIndex].value;

            if (sub_topic_id != 0) {
              this.sub_data(sub_topic_id);
            }
          }
        }
      }
    },
    qp: function() {
      var book_id = document.getElementById("books").value;
      let vm = this;
      axios
        .post("/api/user/DisplayTopicss", { book_id: book_id })
        .then(function(res) {
          vm.topic_names = res.data.data;
          vm.after_disount = vm.topic_names[0].price;
          vm.books_price = vm.topic_names[0].actual_price;
          vm.discount = vm.topic_names[0].discount;

          var sel = document.getElementById("books_topic");
          sel.options[0].selected = true;
          this.sub_topic();
          vm.sub_topic();
        });
    },
    books_content: function() {
      let vm = this;
      axios.post("/api/user/DisplayAdminBooksName").then(res => {
        vm.book_names = res.data.data;
        //console.log(vm.book_names[0].discount)
        vm.books_price = vm.book_names[0].actual_price;
        vm.after_disount = vm.book_names[0].price;
        vm.discount = vm.book_names[0].discount;
        hidePreloader();
      });

      axios.post("/api/user/DisplayTopicss", { book_id: 1 }).then(res => {
        vm.topic_names = res.data.data;
      });
      axios.get("/api/user/getLmsVideos").then(res => {
        vm.videos = res.data;
      });
      /*axios.post("/api/user/DisplayQuizTypes").then(
        function(res) {
          console.log('quiz types');
           vm.quiz_types = res.data.data;
           console.log(vm.quiz_types);

        },

      );*/
    },
    /* fill_in_blank: function()
    {
       var statement =document.getElementById("statement").querySelectorAll("input");
       for(var i =0;i<statement.length;i++)
       {

       }

    },*/
    addVideoToContent: function() {
      var dat = document.getElementById("video");
      //dat = "%rendervideo%"+(dat.outerHTML).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;")+"%endrendervideo%";
      dat =
        "%rendervideo%" +
        dat.outerHTML
          .replace(/&/g, "&amp;")
          .replace(/>/g, "&gt;")
          .replace(/</g, "&lt;")
          .replace(/"/g, "&quot;") +
        "%endrendervideo%";
      this.content += dat;
      // console.log(this.content);
      $("[data-dismiss=modal]").trigger({ type: "click" });
    },
    addHtmlRenderTemplate: function() {
      var dat =
        "<pre>%renderhtml%" +
        $("#lms_editor_render_html")
          .val()
          .trim()
          .replace(/&/g, "&amp;")
          .replace(/>/g, "&gt;")
          .replace(/</g, "&lt;")
          .replace(/"/g, "&quot;") +
        "%endrenderhtml%</pre>";
      this.content += dat;
      $("[data-dismiss=modal]").trigger({ type: "click" });
      //code render
    },
    mcq: function() {
      var true_ans = "";
      var flag = 0;
      var mcq_quiz = "<pre>%mcq%";
      for (var i = 1; i <= this.inc_btn; i++) {
        if (document.getElementById("true_ans" + i).checked) {
          mcq_quiz +=
            "%answer%" +
            document
              .getElementById("opt" + i)
              .value.replace(/&/g, "&amp;")
              .replace(/>/g, "&gt;")
              .replace(/</g, "&lt;")
              .replace(/"/g, "&quot;") +
            "%endanswer%";
          flag = 1;
          break;
        }
      }
      if (flag == 0) {
        window.cvNotify("Please select true ans", "danger");
        return;
      }

      mcq_quiz +=
        "%question%" +
        document
          .getElementById("mcq_question")
          .value.replace(/&/g, "&amp;")
          .replace(/>/g, "&gt;")
          .replace(/</g, "&lt;")
          .replace(/"/g, "&quot;") +
        "%endquestion%%options%";

      for (var i = 1; i <= this.inc_btn; i++) {
        if (
          document.getElementById("opt" + i).value ||
          document.getElementById("opt" + i).value != ""
        )
          mcq_quiz +=
            "%option%" +
            document
              .getElementById("opt" + i)
              .value.replace(/&/g, "&amp;")
              .replace(/>/g, "&gt;")
              .replace(/</g, "&lt;")
              .replace(/"/g, "&quot;") +
            "%endoption%";
      }
      mcq_quiz +=
        "%endoptions%%correctfeedback%" +
        document.getElementById("correct_feedback").value +
        "%endcorrectfeedback%%wrongfeedback% " +
        document.getElementById("wrong_feedback").value +
        "%endwrongfeedback%%endmcq%</pre>";
      this.content += mcq_quiz;
      $("[data-dismiss=modal]").trigger({ type: "click" });
    },
    update_topic: function(topic_id) {
      this.$http
        .post("/api/user/update_topic", {
          topic_id: topic_id,
          topic_name: this.upd_sub_topic
        })
        .then(
          function(res) {
            if (res.data.status == "403") {
            } else {
              this.sub_topic();
              $("[data-dismiss=modal]").trigger({ type: "click" });
              //res.body.data;
            }
          },
          function(res) {
            $("[data-dismiss=modal]").trigger({ type: "click" });
          }
        );
    },
    save_code: function() {
      var text_area_code = document.getElementById("pre_code").value;
      var lang = document.getElementById("code_lang").value;
      text_area_code = text_area_code
        .replace(/&/g, "&amp;")
        .replace(/>/g, "&gt;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;");
      if (lang == 0) {
        alert("choose language");
        return;
      } else {
        if (lang == "html") {
          this.content =
            this.content +
            "<pre>%htmlsnippet%" +
            text_area_code +
            "%endhtmlsnippet%</pre>";
        } else if (lang == "css") {
          this.content =
            this.content +
            "<pre>%csssnippet%" +
            text_area_code +
            "%endcsssnippet% </pre>";
        } else if (lang == "js") {
          this.content =
            this.content +
            "<pre>%jssnippet%" +
            text_area_code +
            "%endjssnippet%</pre>";
        } else if (lang == "py") {
          this.content =
            this.content +
            "<pre>%pysnippet%" +
            text_area_code +
            "%endpysnippet%</pre>";
        } else if (lang == "sql") {
          this.content =
            this.content +
            "<pre>%sqlsnippet%" +
            text_area_code +
            "%endsqlsnippet%</pre>";
        }
      }

      // $("#precodeModal").modal('hide');

      $("[data-dismiss=modal]").trigger({ type: "click" });
    },
    save_editor_code: function() {
      var book_id = document.getElementById("books").value;
      var dec = document.getElementById("page_q").value;
      if (dec == "page") {
        var sub_topic = "";
        var sub_topic_id = "0";
        var topic_name = "";
        var topic_id = document.getElementById("books_topic").value;
        if (topic_id == "0") {
          window.cvNotify(
            "Please select any topic or new topic for content",
            "primary"
          );
          return;
        } else if (topic_id == "new_topic") {
          topic_name = document.getElementById("topic").value;
          if (topic_name == "") {
            window.cvNotify(
              "Please Insert any topic name.Topic field can not be empty.",
              "primary"
            );
            return;
          }
          var sub_topic = document.getElementById("insub_topic").value;
        } else {
          sub_topic_id = document.getElementById("sub_topic").value;
          if (sub_topic_id == "0") {
            window.cvNotify(
              "Please select any sub topic or new topic for content",
              "primary"
            );
            return;
          } else if (sub_topic_id == "new_sub_topic") {
            sub_topic = document.getElementById("insub_topic").value;
            if (sub_topic == "") {
              window.cvNotify(
                "Please Insert any sub topic name.Sub topic field can not be empty.",
                "primary"
              );
              return;
            }
          }
        }

        var includePyTab = $("#py_checkbox")[0].checked;
        var editorTemplate = "";
        var includeSqlTab = $("#sql_checkbox")[0].checked;
        if (includeSqlTab) {
          editorTemplate += "%sqleditor%";
          editorTemplate += this.sql_code;
          editorTemplate += "%endsqleditor%";
          // console.log(editorTemplate);
        } else if (includePyTab) {
          editorTemplate += "%pythoneditor%";
          editorTemplate += this.py_code;
          editorTemplate += "%endpythoneditor%";
        } else {
          var includeHtmlTab = $("#html_checkbox")[0].checked;
          var includeCssTab = $("#css_checkbox")[0].checked;
          var includeJsTab = $("#js_checkbox")[0].checked;

          editorTemplate += "%tabs%";
          if (includeHtmlTab)
            editorTemplate += "%htmltab%index.html%endhtmltab%";
          if (includeCssTab) editorTemplate += "%csstab%style.css%endcsstab%";
          if (includeJsTab) editorTemplate += "%jstab%script.js%endjstab%";
          editorTemplate += "%endtabs%";
          editorTemplate += "%files%";
          if (includeHtmlTab) {
            editorTemplate += "%htmlfile%";
            editorTemplate += this.html_code
              .replace(/&/g, "&amp;")
              .replace(/>/g, "&gt;")
              .replace(/</g, "&lt;")
              .replace(/"/g, "&quot;");
            editorTemplate += "%endhtmlfile%";
          }
          if (includeCssTab) {
            editorTemplate += "%cssfile%";
            editorTemplate += this.css_code;
            editorTemplate += "%endcssfile%";
          }

          if (includeJsTab) {
            editorTemplate += "%jsfile%";
            editorTemplate += this.jss_code;
            editorTemplate += "%endjsfile%";
          }
          editorTemplate += "%endfiles%%endeditor%";
        }

        this.content += "<pre>" + editorTemplate + "</pre>";
        $("[data-dismiss=modal]").trigger({ type: "click" });
      }
    },
    delete_page: function() {
      var book_id = document.getElementById("books").value;
      var dec = document.getElementById("page_q").value;
      let vm = this;
      if (dec == "page") {
        var topic_id = document.getElementById("books_topic").value;
        var sub_topic_id = document.getElementById("sub_topic").value;

        if (sub_topic_id == "0") {
          window.cnNotify(
            "Please select any sub topic or new topic for content",
            "primary"
          );
          return;
        }

        axios
          .post("/api/user/delete_data", {
            book_id: book_id,
            sub_topic_id: sub_topic_id,
            topic_id: topic_id
          })
          .then(function(res) {
            if (res.data.data == 1 || res.data.data == "1") {
              window.cvNotify("successfully deleted", "success");
              vm.qp();
            } else {
              window.cvNotify("successfully deleted", "success");
            }

            vm.sub_topic();

            vm.content = " ";
          });
      } else {
        window.cvNotify("only delete data only", "warning");
      }
    },
    daat: function() {
      var book_id = document.getElementById("books").value;
      var dec = document.getElementById("page_q").value;
      let vm = this;
      if (dec == "page") {
        var sub_topic = "";
        var sub_topic_id = "0";
        var topic_name = "";
        var topic_id = document.getElementById("books_topic").value;
        if (topic_id == "0") {
          window.cvNotify(
            "Please select any topic or new topic for content",
            "primary"
          );
          return;
        } else if (topic_id == "new_topic") {
          topic_name = document.getElementById("topic").value;
          if (topic_name == "") {
            window.cvNotify(
              "Please Insert any topic name.Topic field can not be empty.",
              "primary"
            );
            return;
          }
          var sub_topic = document.getElementById("insub_topic").value;
        } else {
          sub_topic_id = document.getElementById("sub_topic").value;
          if (sub_topic_id == "0") {
            window.cvNotify(
              "Please select any sub topic or new topic for content",
              "primary"
            );
            return;
          } else if (sub_topic_id == "new_sub_topic") {
            sub_topic = document.getElementById("insub_topic").value;
            if (sub_topic == "") {
              window.cvNotify(
                "Please Insert any sub topic name.Sub topic field can not be empty.",
                "primary"
              );
              return;
            }
          }
        }

        axios
          .post("/api/user/insert_data", {
            book_id: book_id,
            topic_name: topic_name,
            topic_id: topic_id,
            sub_topic: sub_topic,
            sub_topic_id: sub_topic_id,
            book_data: this.content
          })
          .then(function(res) {
            window.cvNotify(res.data.data, "success");
            document.getElementById("insub_topic").value = "";
            document.getElementById("topic").value = "";
            var topic_id = document.getElementById("books_topic").value;
            if (topic_id == "new_topic") {
              vm.books_content();
              var books = document.getElementById("books");
              books.options[0].selected = true;
              var sel = document.getElementById("books_topic");
              sel.options[0].selected = true;
              vm.sub_topic();
            } else {
              vm.sub_topic();
            }

            vm.content = " ";
          });
      } else {
        var topic_id = document.getElementById("books_topic").value;
        if (topic_id == "0") {
          window.cvNotify(
            "Please select any topic or new topic for Quiz",
            "primary"
          );
          return;
        } else {
          var sub_topic_id = document.getElementById("sub_topic").value;
          if (sub_topic_id == "0") {
            window.cvNotify(
              "Please select any sub topic or new topic for Quiz",
              "primary"
            );
            return;
          } else {
            /* Test*/

            var quiz_option = document.getElementById("quiz_option").value;
            // alert(quiz_option);
            if (quiz_option == "0") {
              window.cvNotify("please select quiz type", "primary");
              return false;
            }
            if (quiz_option == "1" || quiz_option == "2") {
              this.content1 = this.content1.replace(/<(?:.|\n)*?>/gm, "");
              this.content2 = this.content2.replace(/<(?:.|\n)*?>/gm, "");
              var data = {
                book_id: book_id,
                topic_id: topic_id,
                qt_id: quiz_option,
                sub_topic_id: sub_topic_id,
                que: this.content,
                des: this.content1,
                true_ans: this.content2,
                quiz: 1
              };
            } else if (quiz_option == "3") {
              var quiz_true_mcq = document.getElementById("true_ans_mcq").value;

              if (quiz_true_mcq == "0") {
                window.cvNotify("please select quiz option", "primary");
                return false;
              }
              this.opt1 = this.opt1.replace(/<(?:.|\n)*?>/gm, "");
              this.opt2 = this.opt2.replace(/<(?:.|\n)*?>/gm, "");
              this.opt3 = this.opt3.replace(/<(?:.|\n)*?>/gm, "");
              this.opt4 = this.opt4.replace(/<(?:.|\n)*?>/gm, "");
              var data = {
                book_id: book_id,
                topic_id: topic_id,
                qt_id: quiz_option,
                sub_topic_id: sub_topic_id,
                que: this.content,
                opt1: this.opt1,
                opt2: this.opt2,
                opt3: this.opt3,
                opt4: this.opt4,
                true_ans: quiz_true_mcq,
                quiz: 1
              };
            }

            /* end Test*/

            axios.post("/api/user/insert_quiz_data", data).then(function(res) {
              window.cvNotify(res.data.data, "success");
              document.getElementById("quiz_option").options[0].selected = true;
              var sel = document.getElementById("books_topic");
              sel.options[0].selected = true;
              vm.content = " ";
              vm.content1 = " ";
              vm.content2 = " ";
              vm.opt1 = " ";
              vm.opt2 = " ";
              vm.opt3 = " ";
              vm.opt4 = " ";
              document.getElementById(
                "true_ans_mcq"
              ).options[0].selected = true;
              vm.sub_topic();
            });
          }
        }
      }
    },
    /***Video function */
    videoSelected: function(event) {
      let src = $(event.currentTarget).find("p")[0].innerText;
      var path = src.replace(/.*?\/\/.*?\/(.*)/, "/$1");

      $("#video_url").val(path);
      $("#pvdo").empty();
      let video = document.getElementById("pvdo");
      let subvideo = document.createElement("video");
      subvideo.setAttribute("width", this.v_width);
      subvideo.setAttribute("height", this.v_height);
      subvideo.setAttribute("vspace", this.vspace);
      subvideo.setAttribute("hspace", this.hspace);
      subvideo.setAttribute("controls", "controls");
      subvideo.setAttribute("controlsList", "nodownload");
      subvideo.setAttribute("id", "video");
      let source = document.createElement("source");
      source.setAttribute("src", "/resources/books_video/" + src);
      source.setAttribute(
        "type",
        "video/" + path.substr(path.lastIndexOf(".") + 1)
      );
      subvideo.appendChild(source);
      video.appendChild(subvideo);
      hideOffscreenModal(
        event.currentTarget.parentElement.parentElement.parentElement
          .parentElement.id
      );
    },
    /****End Video Function */
    imageSelected: function(event) {
      var src = $(event.currentTarget).find("img")[0].src;
      var path = src.replace(/.*?\/\/.*?\/(.*)/, "/$1");
      if (ckEditorImageUrlInput) {
        ckEditorImageUrlInput.value = path;
      }

      hideOffscreenModal(
        event.currentTarget.parentElement.parentElement.parentElement
          .parentElement.id
      );
      let imgPreviewBox = $(".ImagePreviewBox");
      let previewImage = imgPreviewBox.find("img");
      previewImage.attr("src", path);
      previewImage.css("display", "inline");
    },
    handleSavingContent: function() {}
  }
};
</script>

<style>
#fwo-editor-heading {
  display: block;
  width: calc(100% - 32px);
  margin: 16px 16px;
}
.fwo-editor-section-name {
  padding: 0 16px;
  font-size: 12px;
  font-weight: bold;
  color: #444;
}
#fwo-editor-statement {
  border: 1px solid #dfdfdf;
  min-height: 48px;
  margin: 0 16px;
  padding: 8px;
}

#fwo-editor-statement span {
  margin: 0 4px 4px 0;
}

.fwo-editor-blank {
  display: inline-block;
  min-width: 56px;
  max-width: 120px;
  margin: 0 4px 4px 0;
  padding: 4px;
  border: 1px solid #aaa;
  background: #dfdfdf;
}

#fwo-editor-add-blank-wrapper {
  display: flex;
  flex-direction: row;
  padding: 0 16px;
}

#fwo-editor-modal button {
  padding: 4px 8px;
  background: rgb(172, 62, 11);
}

#fwo-editor-modal input {
  padding: 4px;
}

#fwo-editor-add-options-wrapper {
  display: flex;
  flex-direction: row;
  margin: 0 16px;
}
#fwo-editor-add-options-wrapper input {
  flex-grow: 1;
}

#fwo-editor-options-wrapper {
  margin-bottom: 16px;
  padding: 0 16px;
}

.fwo-editor-option {
  display: inline-block;
  margin-right: 4px;
  padding: 8px;
  background: rgb(31, 100, 31);
  border-radius: 24px;
  color: #fff;
}

.fwo-editor-option a {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-left: 4px;
  padding: 4px;
  background: #fff;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
}

.fwo-editor-option a i {
  color: #000;
}
.cke_contents {
  height: 400px !important;
}

#fwo-correct-feedback,
#fwo-wrong-feedback {
  display: block;
  width: calc(100% - 32px);
  margin: 0 16px;
}

#fwo-wrong-feedback {
  margin-bottom: 16px;
}
body {
  padding-right: 0 !important;
  width: 100%;
}
</style>
