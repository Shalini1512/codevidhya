<template>
  <div id="assessments-root" >
    <Header>
      <HeaderContent />
    </Header>
    <div class="container-fluid" >
      <div class="row" v-if="role_id==3">
        <div class="col-xl-12 col-lg-12 col-md-12" >
          <div class="card">
            <div class="card-header bg-secondary">
              <h3 class="card-title text-white w-auto">Assessments</h3>
            </div>
            <div class="card-body">
              <div class="panel panel-primary">
                <div class="tab-menu-heading">
                  
                  <div class="tabs-menu">
                    <!-- Tabs -->
                    <ul class="nav panel-tabs">
                     <li class=""><a href="#instituteAssessments" id="instituteTab" class="active" data-toggle="tab">Subject Assessments <span class="badge badge-pill badge-secondary">{{assessments.length}}</span></a></li>
                      <li><a href="#asmntReport" id="reportTab" data-toggle="tab">Assessment Report</a></li>
                    </ul>
                  </div>
                </div>
                <div class="panel-body tabs-menu-body">
                  <div class="tab-content">
                    <div class="tab-pane active" id="instituteAssessments">
                      <!--School Assessment card  start for school-->
                          <div class="row" v-if="assessments.length">
                          <template v-for="(assessment, index) in assessments" >
                            <div  :key="index" v-if="assessment.tot_que!=0" class="col-sm-3 d-inline-block">
                              <div class="card">
                                <img class="card-img-top br-tr-3 br-tl-3" src="/assets/images/project-thumbs/web.svg" alt="Well, I didn't vote for you.">
                                  <span v-if="assessment.score==null && ($moment(assessment.date) > $moment(serverTime))" class="badge badge-warning p-2 col-sm-12 remaining-time" style="position:absolute; right:0;" :data-remaining-time="assessment.date"></span>
                                  <span v-if="assessment.score!=null" class="badge badge-success p-2 col-sm-12" style="position:absolute; right:0;">Attempted</span>
                                <div class="card-body d-flex flex-column">
                                  <h4>{{ assessment.assessment_name }}</h4>
                                  <div class="text-muted">
                                    <p style="margin-bottom:4; margin-top:8px;"> Total Questions: {{ assessment.tot_que }} </p>
                                    <p style="margin-bottom:4;"> Total Marks : {{ assessment.tot_marks }} </p>
                                    <p style="margin-bottom:0; marigin-top:4px;"> Duration : {{ assessment.duration }} min.</p>
                                  </div>
                                </div>
                                <div class="card-body d-flex">
                                  
                                  <button class="btn btn-sm btn-info"  onclick="showModal('instruction-modal')" v-if="role_id == 3" > More </button>
                                  <i class="flex-fill"></i>
                                  {{assessment.assessment_id}}
                                  <button class="btn btn-sm btn-success bd-highlight" v-if=" assessment.exam_status == 'true' && assessment.exam__submit_status ==0 && assessment.score == null && assessment.user_id != null" @click="start_exam(assessment.assessment_id,assessment.assessment_name,assessment.duration)"> Resume </button>
                                  <button class="btn btn-sm btn-success bd-highlight" v-else-if="assessment.exam_status == 'false' && assessment.score == null && ($moment(serverTime) > $moment(assessment.date))" @click="start_exam(assessment.assessment_id,assessment.assessment_name,assessment.duration)"> Start </button>
                                  <button class="btn btn-sm btn-primary bd-highlight" v-else-if="assessment.score != null && assessment.user_id != null " onclick="$('#reportTab').click();" > Result </button>
                                </div>
                              </div>
                            </div>
                          </template>
                        </div>
                        <div v-if="!assessments.length">
                          <h5 style="color:#666"> There is no assessment scheduled by institute. </h5> 
                        </div>
                      <!-- school Assessment card end-->
                    </div>
                    
                 
                    <div class="tab-pane" id="asmntReport">
                      <div v-if="studentReport.length">
                        <template v-for="(assessment, index) in studentReport">
                          <div
                            class="row bg-secondary text-white d-flex align-items-center mb-2 p-4"
                            :key="index"
                            v-if="
                              assessment.score != null
                            "
                          >
                            <div class="col-sm-4">
                              {{ assessment.assessment_name }}
                            </div>
                            <div class="col-sm-4">
                              You got
                              <span class="badge badge-success ml-1 mr-1">{{
                                assessment.score
                              }}</span>
                              marks out of
                              <span class="badge badge-primary ml-1 mr-1">{{
                                assessment.tot_marks
                              }}</span>
                              marks.
                            </div>
                           <!-- <div
                              class="col-sm-4 text-right"
                              
                            >
                              <button
                                class="btn btn-warning mr-1"
                                @click="
                                  st_view_report(
                                    assessment.assessment_id,
                                    assessment.sch_id
                                  )
                                "
                              >
                                Report
                              </button>
                              <button
                                class="btn btn-primary mr-1"
                                @click="view_solution(assessment.assessment_id)"
                              >
                                Solution
                              </button>
                            </div>-->
                          </div>
                        </template>
                      </div>
                      <div
                        v-else
                        class="row"
                        style="margin:4px; padding:5px 5px;"
                      >
                        <div class="quediv-a">
                          <h5 style="color:#666">No Record.</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-else >
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header bg-secondary">
               <button
                            class="btn btn-primary"
                            @click="
                              $router.push({
                                name: 'learn-more',
                                params: {
                                  curName: courseName,
                                  bookId: courseId,
                                  book_per: 0,
                                  tab: 'curriculum'
                                }
                              })
                            "
                          >
                            Back
                          </button>
              <h3 class="card-title  text-white w-auto ml-2">Assessments</h3>
              <i class="flex-fill"></i>
             
              <button
                type="submit"
                class="btn btn-warning mr-1"
                v-if="role_id != 3"
                onclick="showModal('questionUploadFileModal');"
              >
               Upload Question File
              </button>
              <button
                type="submit"
                class="btn btn-warning"
                v-if="role_id != 3"
                onclick="showModal('createAssessmentModal')"
              >
                Create New Assessment
              </button>
            </div>
            <div class="card-body">
              <div class="panel panel-primary">
                <div class="tab-menu-heading">
                  
                  <div class="tabs-menu">
                    <!-- Tabs -->
                    <ul class="nav panel-tabs">
                     <li class=""><a href="#otherSubjectAssessments" id="othersubjectAssessmentTab" class="active" data-toggle="tab">Subject Assessments <span class="badge badge-pill badge-secondary">{{assessments.length}}</span></a></li>
                      <li><a href="#studentAssessmentResult" id="studentResultTab" data-toggle="tab">Student Assessment Result</a></li>
                      <li><a href="#assessmentQuestions" id="assessmentQuestionsTab" data-toggle="tab">Assessment Questions</a></li>
                    </ul>
                  </div>
                </div>
                <div class="panel-body tabs-menu-body">
                  <div class="tab-content">
                    <div class="tab-pane active" id="otherSubjectAssessments">
                      <!--School Assessment card  start for school-->
                             <div v-if="assessments.length">
                <template v-for="(assessment, index) in assessments" >
                  <div  :key="index" v-if="!assessment.score" class="col-sm-3 d-inline-block">
                    <div class="card">
                      <img class="card-img-top br-tr-3 br-tl-3" src="/assets/images/project-thumbs/web.svg" alt="Well, I didn't vote for you.">
                      <div class="card-body d-flex flex-column">
                        <h4>{{ assessment.assessment_name }}</h4>
                        <div class="text-muted">
                          <p style="margin-bottom:4; margin-top:8px;"> Total Questions: {{ assessment.tot_que }} </p>
                          <p style="margin-bottom:4;"> Total Marks : {{ assessment.tot_marks }} </p>
                          <p style="margin-bottom:0; marigin-top:4px;"> Duration : {{ assessment.duration }} min.</p>
                        </div>
                      </div>
                      <div class="card-body d-flex">
                        <i class="flex-fill"></i>
                        <button class="btn btn-sm btn-warning bd-highlight"  @click="assessmentDetails(assessment.assessment_id)"> Details </button>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <div v-if="!assessments.length">
                <h5 style="color:#666">
                  There is no assessment scheduled.
                </h5>
              </div>
                      <!-- school Assessment card end-->
                    </div>
                    <div class="tab-pane" id="studentAssessmentResult">
                      <div class="row bg-secondary text-white p-2">
                        <div class="col-sm-2" >
                          <select class="form-control" v-model="assessment_id" @change="displayAssessmentResult()">
                            <option value="0"> Select Assessment</option>
                            <template v-for="(assessment, index) in assessments">
                              <option :key="index" :value="assessment.assessment_id">{{assessment.assessment_name}}</option>
                            </template>
                          </select>
                        </div>
                      </div>
                      <div class="row p-2">
                        <div class="col-sm-12" v-if="assessmentsResult.length">
                          	<table class="table card-table table-vcenter text-nowrap table-primary" >
											<thead  class="bg-primary text-white">
												<tr >
													<th class="text-white">Sr. No</th>
													<th class="text-white">Student Name</th>
													<th class="text-white">Total Marks</th>
													<th class="text-white">Obtained Marks</th>
                          	<th class="text-white">Action</th>
												</tr>
											</thead>
											<tbody>
                        <template v-for="(student,index) in assessmentsResult">
												<tr :key="index">
													<th>{{index+1}}</th>
													<td>{{student.name}}</td>
													<td>{{student.tot_marks}}</td>
													<td v-if="student.exam_attempt>0&&student.score">{{student.score}}</td>
                          <td v-else>Not Attempted</td>
                          <td>
                             <button
                            class="btn btn-warning mr-1"
                            disabled
                          >
                            Solution
                          </button>
                          <button
                            class="btn btn-danger mr-2"
                            v-on:click="clear_report(student.user_id, 'record')"
                            v-if="student.score != null"
                          >
                            Clear
                          </button>
                          </td>
												</tr>
                        </template>
												
											</tbody>
										</table>
                        </div>
                        <div class="col-sm-12" v-else>
                          <h2>No Record.</h2>
                        </div>
                      </div>
                    </div>
                    
                 
                    <div class="tab-pane" id="assessmentQuestions">
                      <div class="row">
                        <div class="col-sm-12">
                  <div class="panel-group1" id="subjectsaccordion2">
                    <div class="panel panel-default mb-4  border">
                      <div class="panel-heading bg-primary text-white d-flex">
                        <h4 class="panel-title1  w-85">
                          <a
                            class="accordion-toggle collapsed text-white"
                            data-toggle="collapse"
                            data-parent="#subjectsaccordion2"
                            href="#subjectscollapseFour"
                            aria-expanded="false"
                            >Subjects</a
                          >
                        </h4>
                        
                        <div class="d-flex align-items-center ">
                            <div class="col-sm-1.5 mr-1">
                    Filter by Grade: 
                  </div>
                  <div class="col-sm-2.5">
                    <select class="form-control" v-model="filterselectedGrade">
                      <option value="">All</option>
                      <template v-for="(sch_class, index) in sch_classes">
                        <option :key="index" :value="sch_class.cls_id">{{
                          sch_class.cls_name
                        }}</option>
                      </template>
                    </select>
                  </div>

                        </div>
                      </div>
                      <div
                        id="subjectscollapseFour"
                        class="panel-collapse collapse"
                        role="tabpanel"
                        aria-expanded="false"
                      >
                        <div class="panel-body p-2">
                          <div class="tabs-menu mb-4 mt-4">
                            <!-- Tabs -->
                            <ul class="nav panel-tabs">
                              <li
                                class="mb-2"
                                @click="
                                  sub_id = '';
                                  load_questions();
                                "
                              >
                                <a href="#tab1" class="active" data-toggle="tab"
                                  >All</a
                                >
                              </li>
                              <template v-for="subject in subjects">
                                <li
                                  class="mb-2"
                                  :key="subject.sub_id"
                                  v-if="subject.sch_id == sch_id || subject.sch_id==0 "
                                  @click="
                                    sub_id = subject.sub_id;
                                    load_questions();
                                  "
                                >
                                  <a href="#" data-toggle="tab">{{
                                    subject.sub_name
                                  }}</a>
                                </li>
                              </template>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 p-2">
                  <!-- questions accordian start-->
                  <div class="panel-group1" id="accordion2">
                    <template v-for="(question, index) in allQuestions">
                      <div
                        :key="question.que_id"
                        class="panel panel-default mb-2 p-0 border mx-auto d-block "
                        v-if="question.for_grade.includes(filterselectedGrade)"
                      >
                        <div class="panel-heading">
                          <div
                            class="row p-2"
                            style="cursor:pointer"
                            data-toggle="collapse"
                            data-parent="#accordion2"
                            :href="'#questionNumber' + index"
                            aria-expanded="false"
                          >
                            <div class="col-sm-10 d-flex align-items-center">
                              <p
                                class="badge badge-default mr-1 text-dark d-inline-block"
                              >
                                {{ index + 1 }}
                              </p>
                              <p
                                class="d-inline-block"
                                v-html="question.question"
                              ></p>
                            </div>
                            <div class="col-sm-2 d-flex  align-items-center">
                              <img
                                v-if="question.question_img"
                                class="card-profile-img d-flex align-self-center mb-0 "
                                style="width:40px; height:40px; cursor:pointer; border:thin solid #999;"
                                :src="
                                  '/static/uploads/' + question.question_img
                                "
                                alt="img"
                                @click="
                                  imagePreview = question.question_img;"
                                  onclick="showModal('modalImagePreview');"
                              />
                              <i class="flex-fill"></i>
                              <span
                                class="badge badge-success mr-1"
                                style="cursor:pointer"
                                @click="editQuestion(question.que_id, question)"
                                >Edit</span
                              >
                              <span
                                class="badge badge-danger"
                                style="cursor:pointer"
                                @click="deleteQuestion(question.que_id)"
                                >Delete</span
                              >
                            </div>
                          </div>
                        </div>
                        <div
                          :id="'questionNumber' + index"
                          class="panel-collapse collapse"
                          role="tabpanel"
                          aria-expanded="false"
                        >
                          <div class="panel-body">
                            <div
                              class="row mb-1 align-items-center p-2"
                              style="background:#D5DBDB;"
                              v-if="question.opt1 || question.opt1_img"
                            >
                              <div class="col-sm-11">
                                <p class="mr-2 d-inline-block">
                                  <span
                                    :class="
                                      question.true_ans == 'opt1'
                                        ? 'badge ' + 'badge-success'
                                        : 'badge ' + 'badge-secondary'
                                    "
                                    >A</span
                                  >
                                </p>
                                <p
                                  class="d-inline-block"
                                  v-html="question.opt1"
                                ></p>
                              </div>
                              <div class="col-sm-1">
                                <img
                                  v-if="question.opt1_img"
                                  class="card-profile-img mx-auto d-block mb-0"
                                  style="width:50px; height:50px; cursor:pointer;"
                                  :src="
                                    '/static/uploads/' + question.opt1_img
                                  "
                                  alt="img"
                                  @click="
                                    imagePreview = question.opt1_img;
                                  "
                                  onclick="showModal('modalImagePreview');"
                                />
                              </div>
                            </div>
                            <div
                              class="row mb-1 align-items-center p-2"
                              style="background:#D5DBDB;"
                              v-if="question.opt2 || question.opt2_img"
                            >
                              <div class="col-sm-11">
                                <p class="mr-2 d-inline-block">
                                  <span
                                    :class="
                                      question.true_ans == 'opt2'
                                        ? 'badge ' + 'badge-success'
                                        : 'badge ' + 'badge-secondary'
                                    "
                                    >B</span
                                  >
                                </p>
                                <p
                                  class="d-inline-block"
                                  v-html="question.opt2"
                                ></p>
                              </div>
                              <div class="col-sm-1">
                                <img
                                  v-if="question.opt2_img"
                                  class="card-profile-img mx-auto d-block mb-0"
                                  style="width:50px; height:50px; cursor:pointer;"
                                  :src="
                                    '/static/uploads/' + question.opt2_img
                                  "
                                  alt="img"
                                  @click="
                                    imagePreview = question.opt2_img;
                                  "
                                  onclick="showModal('modalImagePreview');"
                                />
                              </div>
                            </div>
                            <div
                              class="row mb-1 align-items-center p-2"
                              style="background:#D5DBDB;"
                              v-if="question.opt3 || question.opt3_img"
                            >
                              <div class="col-sm-11">
                                <p class="mr-2 d-inline-block">
                                  <span
                                    :class="
                                      question.true_ans == 'opt3'
                                        ? 'badge ' + 'badge-success'
                                        : 'badge ' + 'badge-secondary'
                                    "
                                    >C</span
                                  >
                                </p>
                                <p
                                  class="d-inline-block"
                                  v-html="question.opt3"
                                ></p>
                              </div>
                              <div class="col-sm-1">
                                <img
                                  v-if="question.opt3_img"
                                  class="card-profile-img mx-auto d-block mb-0"
                                  style="width:50px; height:50px; cursor:pointer;"
                                  :src="
                                    '/static/uploads/' + question.opt3_img
                                  "
                                  alt="img"
                                  @click="
                                    imagePreview = question.opt3_img;
                                  "
                                  onclick="showModal('modalImagePreview');"
                                />
                              </div>
                            </div>
                            <div
                              class="row mb-1 align-items-center p-2"
                              style="background:#D5DBDB;"
                              v-if="question.opt4 || question.opt4_img"
                            >
                              <div class="col-sm-11">
                                <p class="mr-2 d-inline-block">
                                  <span
                                    :class="
                                      question.true_ans == 'opt4'
                                        ? 'badge ' + 'badge-success'
                                        : 'badge ' + 'badge-secondary'
                                    "
                                    >D</span
                                  >
                                </p>
                                <p
                                  class="d-inline-block"
                                  v-html="question.opt4"
                                ></p>
                              </div>
                              <div class="col-sm-1">
                                <img
                                  v-if="question.opt4_img"
                                  class="card-profile-img mx-auto d-block mb-0"
                                  style="width:50px; height:50px; cursor:pointer;"
                                  :src="
                                    '/static/uploads/' + question.opt4_img
                                  "
                                  alt="img"
                                  @click="
                                    imagePreview = question.opt4_img;
                                  "
                                  onclick="showModal('modalImagePreview');"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                    <div
                      class="panel panel-default border p-4"
                      v-if="!allQuestions.length"
                    >
                      <h4>There are no questions.</h4>
                    </div>
                  </div>
                  <!--end question accordian-->
                </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>






           
            </div>
          </div>  
        </div>
      </div>
    </div>


<!-- Modal to preview images-->
    <div id="modalImagePreview" class="cv-modal normal ">
      <div
        style="display: flex; flex-direction: column; max-width:3000px; width:98%; height:98%;"
      >
        <div class="row p-2 m-1 ">
          <i class="flex-fill"></i
          ><span
            class="badge badge-primary"
            style="cursor:pointer"
            onclick="hideModal('modalImagePreview');"
            >&times;</span
          >
        </div>
        <div
          class="mx-auto d-flex align-items-center justify-content-center h-100"
        >
          <img
            v-if="imagePreview"
            :src="'/static/uploads/' + imagePreview"
            alt="img"
          />
        </div>
      </div>
    </div>
    <!--modal image preview ends-->
    <!-- Modal of Update new question button -->
    <div id="updateQueInQueTab-button-modal" class="cv-modal normal ">
      <div
        style="display: flex; flex-direction: column; max-width:3000px; width:98%; height:98%;"
      >
        <UpdateQuestionModal
          :queId="queId"
          :updateQuestion="updateQuestion"
          :queStatus="false"
          :load_questions="load_questions"
        ></UpdateQuestionModal>
      </div>
    </div>
    <!--Question Modal ends here --> 
    <!-- iNSTRUCTION Modal details -->
    <div id="instruction-modal" class="cv-modal normal">
      <div style="max-width:3000px; width:90%; height: 90%;">
        <div class="row bg-secondary p-2 text-white mb-2"><div class="col-sm-12"><h4>Assessment Instructions</h4></div></div>
        <div class="cv-input-group p-2" style="overflow:auto;">
          <p class="mb-2"  style="color:#000000"> <i class="fas fa-dot-circle" aria-hidden="true" style="color:#08CA73" ></i>
            &nbsp; <strong> Countdown Timer:</strong> The countdown timer at the
            top right of screen will display the remaining time available for
            you to complete the examination. when the timer reaches zero, the
            examination will end automatically. You need not terminate the
            examination or submit your paper.
          </p>
          
          <p class="mb-2" style="color:#000000">
            <i class="fas fa-dot-circle" style=" color:#08CA73"></i> &nbsp; Note
            that your answer for the current question will not be saved, if you
            navigate to another question directly by clicking on a question
            number without saving the answer to the previous question.
          </p>
          <p class="mb-2" style="color:#000000">
            <i class="fas fa-dot-circle" style=" color:#08CA73"></i>
            &nbsp;<strong>Answering a Question : </strong>
          </p>
          <p style="color:#000000">
            Procedure for answering a multiple choice question:
          </p>
          <p class="pl-4">
            <ul class="p-2" type="none">
              <li>
                <i class="fas fa-dot-circle text-danger"></i> 
                <b> Choose one answer from the 4 options (A,B,C,D) given below the question, click on the bubble placed before the chosen option.</b>
              </li>
              <li>
                        <i class="fas fa-dot-circle text-danger"
                        
                        ></i> 
                <b>To deselect your chosen answer, click on the bubble of the chosen option again or click on the Clear Response button.</b>
              </li>
              <li>
                <i class="fas fa-dot-circle text-danger"></i> 
                <b>To change your chosen answer. click on the bubble of another option.</b>
              </li>
              <li>
                <i class="fas fa-dot-circle text-danger" ></i> 
                <b>To save your answer, you MUST click on the</b> <strong> Save & Next</strong>
              </li>

            </ul>
          </p>  

          <p class="mb-2" style="color:#000000">
            <i class="fas fa-dot-circle text-success"></i> &nbsp;
            Sections of the question paper are displayed on the top bar of the
            screen. Questions in this section can be viewed by clicking on the
            name of the section.
          </p>
          <p  class="mb-2" style="color:#000000">
            <i class="fas fa-dot-circle text-success"></i> &nbsp;
            After clicking the <strong> Save & Next</strong> for the last
            question in a section, you will automatically be taken to the first
            question of the next section.
          </p>
          <p  class="mb-2" style="color:#000000">
            <i class="fas fa-dot-circle text-success"></i> &nbsp;
            <strong>Read the following instructions carefully:</strong>
          </p>
          <p class="pl-4">
            <ul type="none">
              <li>
                <i class="fas fa-dot-circle text-danger"></i>
                <b>This test comprises multiple-choice questions (MCQs). </b>
              </li>
              <li>
                <i class="fas fa-dot-circle text-danger"></i>
                <b
                  >You are advised not to close the browser window before
                  submitting the test.</b
                >
              </li>
              <li>
                <i class="fas fa-dot-circle text-danger"></i>
                <b
                  >In case the test does not load completely or becomes
                  un-responsive, click on browser's refresh button to reload.</b
                >
              </li>
              <li>
                <i class="fas fa-dot-circle" style="color:#FF6633"></i>
                <b
                  >You can write this test only once, so for best results do not
                  try to guess answers.
                </b>
              </li>
               <li>
                <i class="fas fa-dot-circle" style="color:#FF6633"></i>
                <b>No negetive marking for wrong answers. </b>
              </li>
            </ul>
          </p>  
          <br>
          <p class="mb-2" style="color:#000000">
            <i class="fas fa-dot-circle" style=" color:#08CA73"></i> &nbsp;
            <strong> Declaration : </strong>
          </p>
          <p class="mb-2 pt-2" style="color:#000000">
            I have read all the instructions carefully and have understood them.
            I agree not to cheat or use unfair means in this examination. I
            understand that using unfair means of any sort for my own or someone
            else's advantage will lead to my immediate disqualification. The
            decision of <strong>Codevidhya</strong> will be final in these
            matters and cannot be appealed.
          </p>
        </div>
        <div class="text-center">
          <button class="btn btn-info" onclick="hideModal('instruction-modal');">Close </button>
        </div>
      </div>
    </div>
    <!---->
    <Footer />
    <!--Question Modal ends here -->
    <!------------Upload question file modal------------------------>
    <div id="questionUploadFileModal" class="cv-modal normal">
      <div>
        <div class="header">
          <h3>Upload file</h3>
        </div>
        <div class="body" style="padding: 24px">
          <div class="cv-file-input-group">
            <input type="file" id="uploadfile-input" accept=".xls,.xlsx" />
            <label for="uploadfile-input">
              <span class="selected-file" id="filename-input"></span>
              <span class="choose-file">Choose file</span>
            </label>
            <div style="display:flex; align-items:center; padding:4px 4px; ">
              <label class="text-danger"
                ><i class="fas fa-info-circle" style="padding-top:4px;"></i>
                &nbsp; File should be less than 100Kb.</label
              >
            </div>
          </div>
        </div>
        <div class="footer">

          <button
            class="btn btn-danger"
            onclick="(function() {hideModal('questionUploadFileModal');$('#filename-input').text('');})()"
          >
            Cancel
          </button>
          <button class="btn btn-success" @click="uploadQuestionFile()">
            Upload
          </button>
        </div>
      </div>
    </div>
    <!------------end modal------------------------>

    <!-- Modal of create new assessment button -->
    <div id="createAssessmentModal" class="cv-modal normal ">
      <div
        style="display: flex; flex-direction: column; max-width:3000px; width:98%; height:98%; overflow:auto;"
      >
        <CreateAssessment v-if="courseId!=0" :load_assessments="load_assessments" :sch_id="sch_id" :courseId="courseId"></CreateAssessment>
      </div>
    </div>
    <!--assessment Modal ends here -->
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/assessments/HeaderContent.vue";
import Footer from "@/components/footer/Footer.vue";
import CreateAssessment from "@/views/OtherCourses/CreateAssessmentForOtherCourse.vue";
import UpdateQuestionModal from "@/components/assessments/UpdateQuestion.vue";
export default {
  name: "OtherCouseAssessment",
  components: {
    Header,
    HeaderContent,
    Footer,
    CreateAssessment,
    UpdateQuestionModal
  },
  data() {
    return {
      userId: 0,
      cls_id: this.$store.getters.getAuthData.auth_cls_id,
      user_id: this.$store.getters.getAuthData.auth_user_id,
      sec_id: this.$store.getters.getAuthData.auth_sec_id,
      role_id: this.$store.getters.getAuthData.auth_role_id,
      sch_id: this.$store.getters.getAuthData.auth_sch_id,
      assessments: [],
      codevidhyaAssessments: [],
      schoolAssessments: [],
      cv_assessments: [],
      userAssessment: [],
      publicUserAssessment: [],
      codevidhyaUserAssessment: [],
      schoolUserAssessment: [],
      assessmentsForSchool: [],
      studentReport: [],
      sch_classes: [],
      classes: [],
      asmnt_classes: [],
      queForGrade: [],
      serverTime: "",
      remainingTime: "",
      disabl: 0,
      sub_name: "",
      asmnt_id: 0,
      asmnt_cls_id: 0,
      students: [],
      st_count: 0,
      subjects: [],
      sub_id: '',
      courseId:0,
      allQuestions: [],
      search_que: "",
      queId: 0,
      updateQuestion: [],
      filterselectedGrade:"",
      imagePreview: "",
      assessment_id:0,
      assessmentsResult:[],



     
    };
  },
  beforeCreate() {},
  created() {
   
  },
  beforeMount() {},
  updated : function(){
      var vm = this;
      var items = $('.remaining-time');
			for(var i=0 ; i<items.length; i++){
        var assessmentDate = items[i].dataset.remainingTime
        
				var timeDiff = vm.timeDifference(assessmentDate);
        this.countdown(timeDiff, items[i])
      }
  },
  mounted: function() {
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.courseId =new URL(window.location).searchParams.get("id");
          this.getServerTime();
        }
      }.bind(this)
    );
  
    
  },
  methods: {
   
    getServerTime: function() {
      this.$http.post("/api/user/getServerTime").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.serverTime = res.body.serverTime;
          this.load_classes();
          this.load_all_subjects();
          this.load_assessments();
          this.load_questions()
        }
      });
    },
    load_classes: function() {
      this.$http
        .post("/api/user/School_classes", { sch_id: this.sch_id })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.sch_classes = res.body.all_classes;
          }
        });
    },
     load_all_subjects: function() {
      this.$http.post("/api/user/All_subjects", {}).then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.subjects = res.body.all_subject;
        }
      });
    },
    load_questions: function() {
      this.$http
        .post("/api/user/Subject_questions", {
          sub_id: this.sub_id,
          search_for: this.search_que,
          sch_id: this.sch_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.allQuestions = res.body.all_questions;
          }
        });
    },
    uploadQuestionFile: function() {
      var data = new FormData();
      var fileInput = document.getElementById("uploadfile-input");
      var file = fileInput.files[0];
      var url = URL.createObjectURL(file);
      if (!file) return;
      if (fileInput.files[0].size > 102400) {
        cvNotify("Image should be less than 100kb.", "warning");
        return false;
      }
      data.append("questionFile", file);
      data.append("sch_id", this.sch_id);
      this.$http.post("/api/user/UploadQuestionFile", data).then(function(res) {
        if (res.body.status == 1) {
          cvNotify("You have successfully uploaded the questions.", "success");
          $("#filename-input").text("");
          $("#uploadfile-input").val(null);
          hideModal("questionUploadFileModal");
          this.load_all_subjects();
          this.load_questions();
          data = new FormData();
        }
      });
    },
    deleteQuestion: function(que_id) {
      var vm = this;
      showConfirmationDialog({
        title:
          '<span class="text-danger">Are you sure to delete this question?</span>',
        message:
          "Once you delete it, you will not be able to use this question anymore.",
        callback: function(type) {
          if (type == "positive") {
            vm.$http
              .post("/api/user/disableQuestion", {
                que_id: que_id,
                sch_id: vm.sch_id
              })
              .then(function(res) {
                if (res.body.status == "403") {
                  //this.$router.push('/login');
                } else {
                  if (res.body.success == 1) {
                    cvNotify("You have successfully deleted", "success");
                    vm.load_questions();
                  }
                }
              });
          }
        },
        positiveButton: "Delete",
        positiveButtonClass: "negative"
      });
    },
    load_assessments: function() {
      this.assessments=[]
     this.$http
        .post("/api/user/displayOtherCourseAsessment", {
          user_id: this.user_id,
          sch_id: this.sch_id,
          role_id: this.role_id,
          book_id: this.courseId
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.assessments = res.body.assessments;
            if(this.role_id==3){
              this.studentReport = res.body.assessments;
            }
            

            
          }
        });
    },
       
    displayAssessmentResult : function(){
      this.assessmentsResult = []
      this.$http
        .post("/api/user/displayOtherCourseAsessmentResult", {
          sch_id: this.sch_id,
          assessment_id:this.assessment_id,
          book_id: this.courseId
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.assessmentsResult = res.body.assessmentsResult;
            
          }
        });
    },
    editQuestion: function(queId, question) {
      this.updateQuestion = [];
      this.queId = queId;
      this.updateQuestion = question;
      showModal("updateQueInQueTab-button-modal");
    },
    assessmentDetails: function(assessment_id) {
      var det = btoa(assessment_id+','+this.courseId);
      let routeData = this.$router.resolve({name: "OtherCourseAssessmentDetails", query: {assessment: det}});
      window.open(routeData.href, '_blank');
     /* this.$router.push({
        name: "assessmentdetail",
        query: { assessment: det }
      });*/
    },
    

   start_exam: function(asmnt_id, asmnt_name, duration) {
      this.$http
        .post("/api/user/Insert_assessment_time", {
          user_id: this.user_id,
          duration: duration,
          assessment_id: asmnt_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            var det = btoa(asmnt_id + "," + asmnt_name);
            this.$router.push({
              path: "/assessments/assessment-exam",
              query: { assessment: det }
            });
            //this.$router.push({path: '/Assessments/Assessment-Exam', query: {assessment_id: asmnt_id, assessment_name:assessment_name}});
          }
        });

      var i;
      var j;
    },
    view_report: function(user_id, sch_id) {
      //var det = btoa(this.asmnt_id + "," + user_id + "," + this.asmnt_cls_id);
      var det = btoa(this.asmnt_id + "," + user_id + "," + this.asmnt_cls_id);
      this.$router.push({
          path: "/assessments/view-report",
          query: { assessment: det }
        });
    },
     clear_report: function(user_id, clr_type) {
      var message =
        clr_type == "record"
          ? "You really want to clear record?"
          : "You really want to reset time?";
      var vm = this;
      showConfirmationDialog({
        title: "Delete Record",
        message: message,
        callback: function(type) {
          if (type == "positive") {
            vm.$http
              .post("/api/user/ClearReport", {
                user_id: user_id,
                assessment_id: vm.assessment_id,
                clear_type: clr_type
              })
              .then(function(res) {
                if (res.body.status == "403") {
                  //this.$router.push('/login');
                } else {
                  notify("Student record successfully cleared.", "success");
                  vm.displayAssessmentResult();
                }
              });
          }
        },
        positiveButton: "Reset",
        positiveButtonClass: "negative"
      });
    },
    timeDifference: function(date1) {
      var dateA = new Date(date1).getTime();
      var dateB = new Date(this.serverTime).getTime();
      var timeDiff = Math.floor((dateA - dateB) / 1000);
      return timeDiff;
    },
    countdown: function(seconds, node) {
      var endTime, hours, minutes, msLeft, time, seconds, days;
      var vm = this;
      function twoDigits(n) {
        return n <= 9 ? "0" + n : n;
      }

      function updateTimer(prevtime, node) {
        var msLeft = prevtime - 1;
        if (msLeft < 1) {
          node.textContent = "Live now.";
        } else {
          seconds = msLeft;
          minutes = Math.floor(seconds / 60);
          hours = Math.floor(minutes / 60);

          days = Math.floor(hours / 24);
          hours = hours - days * 24;
          minutes = minutes - days * 24 * 60 - hours * 60;
          seconds =
            seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

          node.textContent =
            (days > 0 ? days + " Days " : "") +
            (hours ? hours + " Hours " : "") +
            (minutes ? minutes + " Minutes " : "") +
            seconds +
            " Seconds";
        }
        setTimeout(updateTimer, 1000, msLeft, node);
      }
      updateTimer(seconds, node);
    },

  }
};
</script>

<style lang="scss">
#assessments-root {
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
