<!--:style="'height:'+windowHegiht+'px !important;'"-->
<template>
  <div id="projects-root" >
    <Header>
      <HeaderContent />
    </Header>
    <div class="container-fluid" >
      <div class="row py-2">
        <!--side nav bar
          <sideNav></sideNav>
        end side nav-->

        <div class="col-xl-12  col-sm-12 col-lg-12 col-md-12" >
          <div class="card">
            <div class="card-header bg-secondary">
              <h3 class="card-title  text-white w-auto">Assessments</h3>
              <i class="flex-fill"></i>
              <button
                type="submit"
                class="btn btn-warning"
                v-if="role_id != 3"
                @click="openModal('createAssessmentModal')"
              >
                Create New Assessment
              </button>

            </div>
            <div class="card-body">

              <div class="panel panel-primary">
											<div class=" tab-menu-heading">
												<div class="tabs-menu">
													<!-- Tabs -->
													<ul class="nav panel-tabs">
														<li class=""><a href="#instituteAssessments" class="active" data-toggle="tab">Institute Assessments <span class="badge badge-pill badge-secondary">{{schoolAssessments.length}}</span></a> </li>
														<li><a href="#codevidhyaAssessments" data-toggle="tab">Codevidhya Assessments <span class="badge badge-pill badge-secondary">{{codevidhyaAssessments.length}}</span></a></li>
														<li><a href="#codevidhyaCertifiedTeacherAssessments" data-toggle="tab">Codevidhya Certification Assessments <span class="badge badge-pill badge-secondary">{{userAssessment.length+purchasedAssessments.length}}</span></a></li>
                            <li><a href="#postTrainigTeacherAssessments" data-toggle="tab">Post Training Assessments <span class="badge badge-pill badge-secondary">{{postTrainingAssessment.length}}</span></a></li>
                            <li><a href="#assessmentResult" id="asmntResult" data-toggle="tab">Result <span class="badge badge-pill badge-secondary"></span></a></li>
													</ul>
												</div>
											</div>
											<div class="panel-body tabs-menu-body">
												<div class="tab-content">
													<div class="tab-pane active " id="instituteAssessments">
                            <!--<div class="row bg-secondary p-2 mb-2">
                              <div class="col-sm-3">
                                <select class="form-control">
                                  <option value="0" selected disabled>Select Assessment</option>
                                  <template v-for="assessment in schoolAssessments">
                                    <option :key="assessment.assessment_id" :value="assessment.assessment_id">{{assessment.assessment_name}}</option>
                                  </template>
                                </select>
                              </div>
                            </div>-->
                            <!--School Assessment card  start for school-->
                            <div v-if="role_id == 2 && schoolAssessments.length">
                              <template v-for="(assessment, index) in schoolAssessments" >
                                <div  :key="index" v-if="!assessment.score" class="col-sm-3 d-inline-block">
                                  <div class="card">
                                    <img class="card-img-top br-tr-3 br-tl-3" src="/assets/images/project-thumbs/web.svg" alt="Well, I didn't vote for you.">
                                    <span v-if="assessment.score==null && ($moment(assessment.date) > $moment(serverTime))" class="badge badge-warning p-2 col-sm-12 remaining-time" style="position:absolute; right:0;" :data-remaining-time="assessment.date"></span>
                                    <span v-if="assessment.score" class="badge badge-success p-2 col-sm-12" style="position:absolute; right:0;">Attempted</span>
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
                                      <button class="btn btn-sm btn-warning bd-highlight" v-if="role_id != 3"  @click="assessmentDetails(assessment.assessment_id)"> Details </button>
                                    </div>
                                  </div>
                                </div>
                              </template>
                            </div>
                            <div v-if="!schoolAssessments.length && role_id == 2">
                              <h5 style="color:#666">
                                There is no assessment scheduled.
                              </h5>
                            </div>
                            <!-- school Assessment card end-->
													</div>
													<div class="tab-pane " id="codevidhyaAssessments">
                            <!--Codevidhya Assessments for school students-->
                            <div v-if="role_id == 2 && codevidhyaAssessments.length">
                              <template v-for="(assessment, index) in codevidhyaAssessments" >
                                <div  :key="index" v-if=" assessment.sch_id == 0 && assessment.role_id == 3 && assessment.book_id == 0 " class="col-sm-3 d-inline-block">
                                  <div class="card">
                                    <img class="card-img-top br-tr-3 br-tl-3" src="/assets/images/project-thumbs/web.svg" alt="Well, I didn't vote for you.">
                                    <span v-if="assessment.score==null && ($moment(assessment.date) > $moment(serverTime))" class="badge badge-warning p-2 col-sm-12 remaining-time" style="position:absolute; right:0;" :data-remaining-time="assessment.date"></span>
                                    <span v-if="assessment.score" class="badge badge-success p-2 col-sm-12" style="position:absolute; right:0;">Attempted</span>
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
                                      <button class="btn btn-sm btn-warning bd-highlight" v-if="role_id != 3"  @click="assessmentDetails(assessment.assessment_id)"> Details </button>
                                    </div>
                                  </div>
                                </div>
                              </template>
                            </div>
                            <div v-if="!codevidhyaAssessments.length && role_id == 2">
                              <h5 style="color:#666">
                                There is no assessment scheduled.
                              </h5>
                            </div>
                            <!--Assessment card end-->
													</div>
													<div class="tab-pane " id="codevidhyaCertifiedTeacherAssessments">
                            <div v-if="role_id == 2 && userAssessment.length">
                              <template v-for="(assessment, index) in userAssessment" >
                                <!--Codevidhya Assessments for school teachers-->
                                <div class="card col-sm-6 d-inline-block" :key="index">
                                  <div class="d-md-flex">
                                    <div class="item-card9-img">
                                      <div v-if="assessment.price!=0" class="arrow-ribbon bg-primary"><i class="fas fa-rupee-sign"></i> {{assessment.price}}<sup>*</sup> </div>
                                      <div class="item-card9-imgs">
                                        <img src="/assets/images/media/asmnt.jpg" alt="img" class="cover-image">
                                      </div>
                                      <!--<div class="item-card9-icons">
                                        <a href="#" class="item-card9-icons1 bg-black-trasparant"> <i class="fa fa fa-share-alt"></i></a>
                                      </div>-->
                                    </div>
                                    <div class="card border-0 mb-0 d-flex">
                                      <div class="card-body ">
                                        <div class="item-card9">
                                          <div class="d-flex">
                                             <span v-if="assessment.score" class="badge badge-primary">Attempted</span>
                                              <!--<i class="flex flex-fill"/>-->
                                          <span v-if="assessment.score==null && ($moment(assessment.date) > $moment(serverTime))" class="badge badge-secondary remaining-time" :data-remaining-time="assessment.date"></span>
                                          </div>
                                         
                                          <h4 class="font-weight-semibold mt-1 mb-2">{{ assessment.assessment_name }} </h4>
                                          <p class="mb-0 mt-2 leading-tight">Total Questions: {{ assessment.tot_que }} </p>
                                          <p class="mb-0 leading-tight">Total Marks : {{ assessment.tot_marks }} </p>
                                          <p class="mb-0 leading-tight">Duration : {{ assessment.duration }} min. </p>
                                        </div>
                                      </div>
                                      <div class="card-footer pt-4 pb-4">
                                        <div class="item-card9-footer d-flex">
                                          <div class="item-card9-cost">
                                            <!--<h4 class="text-dark font-weight-semibold mb-0 mt-0"><span v-if="assessment.score==null && ($moment(assessment.date) > $moment(serverTime))" class="badge badge-warning p-2 col-sm-12 remaining-time" style="position:absolute; right:0;" :data-remaining-time="assessment.date"></span></h4>-->
                                            <h5 v-if="assessment.price!=0" class="text-dark font-weight-semibold mb-0 mt-0">Get 25% off on online course purchase.</h5>
                                          </div>
                                          <div class="ml-auto">
                                            <!--<button class="btn btn-primary mr-1">Buy</button>-->
                                            <button class="btn btn-info mr-1" @click="openModal('instruction-modal');insAsmntDuration=assessment.duration; insTotQue =assessment.tot_que;" v-if="assessment.role_id == 2 && assessment.exam_status == 'false' && !assessment.score">Instructions</button>
                                            <button class="btn btn-success mr-1" v-if="assessment.exam_status == 'true' && assessment.exam_submit_status==0 && assessment.score == null && assessment.user_id != null" @click="start_exam(assessment.assessment_id, assessment.assessment_name,assessment.duration)">Resume</button>
                                            <button class="btn btn-success mr-1" v-else-if="assessment.exam_status == 'false' && assessment.score == null && assessment.user_id == null && ($moment(assessment.date).format('YYYY-MM-DD') == $moment(serverTime).format('YYYY-MM-DD'))" @click="start_exam(assessment.assessment_id,assessment.assessment_name, assessment.duration)">Start</button>
                                            <button class="btn btn-warning bd-highlight" v-if="assessment.score" onclick="$('#asmntResult').click()">Result</button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <!--end card------------------------->
                              </template>
                              <template v-for="(assessment, index) in purchasedAssessments" >
                                <!--Codevidhya Assessments for school teachers-->
                                <div class="card col-sm-6 d-inline-block" :key="index">
                                  <div class="d-md-flex">
                                    <div class="item-card9-img">
                                      <div class="item-card9-imgs">
                                        <img src="/assets/images/media/asmnt.jpg" alt="img" class="cover-image">
                                      </div>
                                      <!--<div class="item-card9-icons">
                                        <a href="#" class="item-card9-icons1 bg-black-trasparant"> <i class="fa fa fa-share-alt"></i></a>
                                      </div>-->
                                    </div>
                                    <div class="card border-0 mb-0 d-flex">
                                      <div class="card-body ">
                                        <div class="item-card9">
                                          <div class="d-flex">
                                             <span v-if="assessment.score" class="badge badge-primary">Attempted</span>
                                              <!--<i class="flex flex-fill"/>-->
                                          <span v-if="assessment.score==null && ($moment(assessment.date) > $moment(serverTime))" class="badge badge-secondary remaining-time" :data-remaining-time="assessment.date"></span>
                                          </div>
                                         
                                          <h4 class="font-weight-semibold mt-1 mb-2">{{ assessment.assessment_name }} </h4>
                                          <p class="mb-0 mt-2 leading-tight">Total Questions: {{ assessment.tot_que }} </p>
                                          <p class="mb-0 leading-tight">Total Marks : {{ assessment.tot_marks }} </p>
                                          <p class="mb-0 leading-tight">Duration : {{ assessment.duration }} min. </p>
                                        </div>
                                      </div>
                                      <div class="card-footer pt-4 pb-4">
                                        <div class="item-card9-footer d-flex">
                                          <div class="item-card9-cost">
                                            <!--<h4 class="text-dark font-weight-semibold mb-0 mt-0"><span v-if="assessment.score==null && ($moment(assessment.date) > $moment(serverTime))" class="badge badge-warning p-2 col-sm-12 remaining-time" style="position:absolute; right:0;" :data-remaining-time="assessment.date"></span></h4>-->
                                          </div>
                                          <div class="ml-auto">
                                            <!--<button class="btn btn-primary mr-1">Buy</button>-->
                                            <button class="btn btn-info mr-1" @click="openModal('instruction-modal');insAsmntDuration=assessment.duration; insTotQue =assessment.tot_que;" v-if="assessment.role_id == 2 && assessment.exam_status == 'false' && !assessment.score">Instructions</button>
                                            <button class="btn btn-success mr-1" v-if="assessment.exam_status == 'true' && assessment.exam__submit_status ==0 && assessment.score == null && assessment.user_id != null" @click="start_exam(assessment.assessment_id, assessment.assessment_name,assessment.duration)">Resume</button>
                                            <button class="btn btn-success mr-1" v-else-if="assessment.exam_status == 'false' && assessment.score == null && assessment.user_id == null" @click="start_exam(assessment.assessment_id,assessment.assessment_name, assessment.duration)">Start</button>
                                            <button class="btn btn-warning bd-highlight" v-if="assessment.score" onclick="$('#asmntResult').click()">Result</button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <!--end card------------------------->
                              </template>
                            </div>
                            <div v-if="!userAssessment.length && role_id == 2">
                              <h5 style="color:#666">
                                There is no assessment scheduled.
                              </h5>
                            </div>
                            <!--Assessment card end-->
                            <div class="card d-none">
                              <div class="card-header bg-secondary text-white"><h4>On Purchase Assessments</h4></div>

                              <div class="card-body">
                                <div v-if="role_id == 2 && allPackages.length">
                                  <!----single purchase------>
                                  <template v-for="(packages,index) in allPackages">
                                   <div :key="index" class="card col-sm-6 d-inline-block">
                                    <div  class="d-md-flex">
                                      <div class="item-card9-img">
                                        <div class="arrow-ribbon bg-primary"><i class="fas fa-rupee-sign"></i> {{packages.price-Math.ceil((packages.price*packages.discount)/100)}}<sup>*</sup> </div>
                                        <div class="item-card9-imgs">
                                          <img src="/assets/images/media/asmnt.jpg" alt="img" class="cover-image">
                                        </div>
                                      </div>
                                      <div class="card border-0 mb-0 d-flex">
                                        <div class="card-body ">
                                          <div class="item-card9">
                                            <h4 class="font-weight-semibold mt-1 mb-2">Buy Any One @ <blink class="text-white badge-pill badge badge-primary">{{packages.price-Math.ceil((packages.price*packages.discount)/100)}}</blink></h4>
                                           <div class="custom-controls-stacked mt-4">
                                             <template v-for="(assessment,index) in packageAssessment">
                                               <label :key="index" class="custom-control custom-checkbox">
                                                  <input type="checkbox" class="custom-control-input border border-thin border-primary" name="example-checkbox1" value="option1" :data-order-id="assessment.order_id" :data-assessment-id="assessment.assessment_id" :data-purchase-type="packages.package_id" @change="selectProduct" :checked="selectedProducts[assessment.assessment_id] && selectedProducts[assessment.assessment_id].purchaseType==packages.package_id?true:false">
                                                  <span class="custom-control-label"><h5>{{assessment.assessment_name}}</h5></span>
                                                </label>
                                             </template>
                                           </div>
                                          </div>
                                        </div>
                                        <div class="card-footer pt-4 pb-4">
                                          <div class="item-card9-footer d-flex">
                                            <div class="item-card9-cost">
                                              <h5 class="text-dark font-weight-semibold mb-0 mt-0">Get 25% off on online course purchase.</h5>
                                            </div>
                                            <div class="ml-auto">
                                              <button class="btn btn-primary mr-1" @click="buyProducts(packages.package_id)">Buy Now</button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  </template> 
                                </div>
                                <div v-if="!allPackages.length && role_id == 2">
                                  <h5 style="color:#666">
                                    There is no purchase module.
                                  </h5>
                                </div>
                              </div>
                            </div>
													</div>
                          <div class="tab-pane" id="postTrainigTeacherAssessments">
                            <div v-if="role_id == 2 && postTrainingAssessment.length">
                              <template v-for="(assessment, index) in postTrainingAssessment" >
                                <!--Codevidhya Assessments for school teachers-->
                                <div class="card col-sm-6 d-inline-block" :key="index">
                                  <div class="d-md-flex">
                                    <div class="item-card9-img">
                                      <div v-if="assessment.price!=0" class="arrow-ribbon bg-primary"><i class="fas fa-rupee-sign"></i> {{assessment.price}}<sup>*</sup> </div>
                                      <div class="item-card9-imgs">
                                        <img src="/assets/images/media/asmnt.jpg" alt="img" class="cover-image">
                                      </div>
                                      <!--<div class="item-card9-icons">
                                        <a href="#" class="item-card9-icons1 bg-black-trasparant"> <i class="fa fa fa-share-alt"></i></a>
                                      </div>-->
                                    </div>
                                    <div class="card border-0 mb-0 d-flex">
                                      <div class="card-body ">
                                        <div class="item-card9">
                                          <div class="d-flex">
                                             <span v-if="assessment.score" class="badge badge-primary">Attempted</span>
                                              <!--<i class="flex flex-fill"/>-->
                                          <span v-if="assessment.score==null && ($moment(assessment.date) > $moment(serverTime))" class="badge badge-secondary remaining-time" :data-remaining-time="assessment.date"></span>
                                          </div>
                                         
                                          <h4 class="font-weight-semibold mt-1 mb-2">{{ assessment.assessment_name }} </h4>
                                          <p class="mb-0 mt-2 leading-tight">Total Questions: {{ assessment.tot_que }} </p>
                                          <p class="mb-0 leading-tight">Total Marks : {{ assessment.tot_marks }} </p>
                                          <p class="mb-0 leading-tight">Duration : {{ assessment.duration }} min. </p>
                                        </div>
                                      </div>
                                      <div class="card-footer pt-4 pb-4">
                                        <div class="item-card9-footer d-flex">
                                          <div class="item-card9-cost">
                                            <!--<h4 class="text-dark font-weight-semibold mb-0 mt-0"><span v-if="assessment.score==null && ($moment(assessment.date) > $moment(serverTime))" class="badge badge-warning p-2 col-sm-12 remaining-time" style="position:absolute; right:0;" :data-remaining-time="assessment.date"></span></h4>-->
                                            <h5 v-if="assessment.price!=0" class="text-dark font-weight-semibold mb-0 mt-0">Get 25% off on online course purchase.</h5>
                                          </div>
                                          <div class="ml-auto">
                                            <!--<button class="btn btn-primary mr-1">Buy</button>-->
                                            <button class="btn btn-info mr-1" @click="openModal('instruction-modal');insAsmntDuration=assessment.duration; insTotQue =assessment.tot_que;" v-if="assessment.role_id == 2 && assessment.exam_status == 'false' && !assessment.score">Instructions</button>
                                            <button class="btn btn-success mr-1" v-if="assessment.exam_status == 'true' && assessment.score == null && assessment.user_id != null" @click="start_exam(assessment.assessment_id, assessment.assessment_name,assessment.duration)">Resume</button>
                                            <button class="btn btn-success mr-1" v-else-if="assessment.exam_status == 'false' && assessment.score == null && assessment.user_id == null && $moment(assessment.date) < $moment(serverTime)" @click="start_exam(assessment.assessment_id,assessment.assessment_name, assessment.duration)">Start</button>
                                            <button class="btn btn-warning bd-highlight" v-if="assessment.score" onclick="$('#asmntResult').click()">Result</button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <!--end card------------------------->
                              </template>
                            </div>
                             <div v-if="!postTrainingAssessment.length && role_id == 2">
                                  <h5 style="color:#666">
                                    There is no post training assessments scheduled for now.
                                  </h5>
                                </div>  
                          </div>
                          <div class="tab-pane" id="assessmentResult">
                              <div v-if="userAssessment.length">
                        <template v-for="(assessment, index) in userAssessment">
                          <div
                            class="row bg-secondary text-white p-2 d-flex align-items-center mb-2"
                            :key="index"
                            v-if="assessment.score"
                          >
                            <div class="col-sm-4">
                              {{ assessment.assessment_name }}
                            </div>
                            <div class="col-sm-4 d-flex align-items-center justify-content-center">
                            </div>
                            <!--<div class="col-sm-4">
                              You got
                              <span class="badge badge-success ml-1 mr-1">{{
                                assessment.score
                              }}</span>
                              marks out of
                              <span class="badge badge-primary ml-1 mr-1">{{
                                assessment.tot_marks
                              }}</span>
                              marks.
                            </div>-->
                            <div
                              class="col-sm-4 text-right"
                            >
                              <button class="btn btn-warning mr-1" v-if="$moment(assessment.result_date).add('months', 3).format('DD-MM-YYYY')>=$moment(serverTime).format('DD-MM-YYYY')" @click="downloadCertificate(assessment.assessment_name, assessment.score, assessment.tot_marks,assessment.result_date )"> Download Certificate </button>
                           
                            </div>
                          </div>
                        </template>
                        <template v-for="(assessment, index) in purchasedAssessments">
                          <div
                            class="row bg-secondary text-white p-2 d-flex align-items-center mb-2"
                            :key="index"
                            v-if="assessment.score"
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
                            <div
                              class="col-sm-4 text-right"
                              
                            >
                              <button class="btn btn-warning mr-1" @click="downloadCertificate(assessment.assessment_name, assessment.score, assessment.tot_marks, assessment.result_date)"> Download Certificate </button>
                           
                            </div>
                          </div>
                        </template>
                        <template v-for="(assessment, index) in postTrainingAssessment">
                          <div
                            class="row bg-secondary text-white p-2 d-flex align-items-center mb-2"
                            :key="index"
                            v-if="assessment.score"
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
                            <div
                              class="col-sm-4 text-right"
                              
                            >
                              <!--<button class="btn btn-warning mr-1"> Download Certificate </button>-->
                           
                            </div>
                          </div>
                        </template>
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



    <!-- Modal of create new assessment button -->
    <div id="createAssessmentModal" class="cv-modal normal ">
      <div
        style="display: flex; flex-direction: column; max-width:3000px; width:98%; height:98%; overflow:auto;"
      >
        <CreateAssessment :load_assessments="load_assessments" :sch_id="sch_id" ></CreateAssessment>
      </div>
    </div>
    <!--assessment Modal ends here -->
    
    
    
    <!-- iNSTRUCTION Modal details -->
    <div id="instruction-modal" class="cv-modal normal">
      <div style="max-width:3000px; width:90%; height: 90%;">
        <div class="row bg-secondary p-2 text-white mb-2"><div class="col-sm-12"><h4>Assessment Instructions</h4></div></div>
        <div class="cv-input-group p-2" style="overflow:auto;">
          <p class="mb-2"  style="color:#000000"> <i class="fas fa-dot-circle" aria-hidden="true" style="color:#08CA73" ></i>
            &nbsp; <strong> General Instructions:</strong></p>
          <p class="pl-4">
            <ul class="p-2" type="none">
              <li> <i class="fas fa-dot-circle text-danger"></i>  <b>Number of questions:{{insTotQue}}</b> </li>
              <li> <i class="fas fa-dot-circle text-danger"></i>  <b>Duration:{{insAsmntDuration}} Minutes</b> </li>
              <li> <i class="fas fa-dot-circle text-danger"></i>  <b>Negative Marking: No negative marking</b> </li>
              <li> <i class="fas fa-dot-circle text-danger"></i>  <b>It is mandatory to answer all the questions.</b> </li>
              <li> <i class="fas fa-dot-circle text-danger"></i>  <b>If you don’t clear the exam, there is no repeat attempt and no certification for the same.</b> </li>
              <li> <i class="fas fa-dot-circle text-danger"></i>  <b>If the teacher misses the assessment as per the schedule, it can’t be attempted some other day.</b> </li>
            </ul>
          </p> 
          <p class="mb-2"  style="color:#000000"> <i class="fas fa-dot-circle" aria-hidden="true" style="color:#08CA73" ></i>
            &nbsp; <strong> Countdown Instructions:</strong></p>
          <p class="pl-4">
            <ul class="p-2" type="none">
              <li> <i class="fas fa-dot-circle text-danger"></i>  <b>The Countdown timer of {{insAsmntDuration}} minutes will be displayed at the top right of the screen.</b> </li>
              <li> <i class="fas fa-dot-circle text-danger"></i>  <b>Test will be automatically saved and submitted after {{insAsmntDuration}} minutes.</b> </li>
              <li> <i class="fas fa-dot-circle text-danger"></i>  <b>If any interruption is encountered, the Assessment will resume from the last attempted question reflecting the remaining time.</b> </li>
            </ul>
          </p>
          <p class="mb-2"  style="color:#000000"> <i class="fas fa-dot-circle" aria-hidden="true" style="color:#08CA73" ></i>
            &nbsp; <strong> Answering a Question:</strong></p>
          <p class="pl-4">
            <ul class="p-2" type="none">
              <li> <i class="fas fa-dot-circle text-danger"></i>  <b>This assessment comprises of 20 Multiple Choice Questions (MCQs) and 5 Subjective type questions.</b> </li>
              <li> <i class="fas fa-dot-circle text-danger"></i>  <b>You are advised not to close the browser window before submitting the test.</b> </li>
              <li> <i class="fas fa-dot-circle text-danger"></i>  <b>In case the test does not load completely or become unresponsive, click on browser’s refresh button to reload.</b> </li>
              <li> <i class="fas fa-dot-circle text-danger"></i>  <b>Click on Save & Next after attempting each question.</b> </li>
              <li> <i class="fas fa-dot-circle text-danger"></i>  <b>You can change the option selected for a particular question after clicking Save & Next button, by just clicking on the different option and then clicking again at Save & Next button.</b> </li>
              <li> <i class="fas fa-dot-circle text-danger"></i>  <b>Click at Submit button after completing the Assessment. </b> </li>
            </ul>
          </p>     
          <br>
          <p class="mb-2" style="color:#000000">
            <i class="fas fa-dot-circle" style=" color:#08CA73"></i> &nbsp;
            <strong> Declaration : </strong>
          </p>
          <p class="mb-2 pt-2" style="color:#000000">
            <b>
            I have read all the instructions carefully and have understood them.
            I agree not to cheat or use unfair means in this examination. I
            understand that using unfair means of any sort for my own or someone
            else's advantage will lead to my immediate disqualification. The
            decision of <strong>Codevidhya</strong> will be final in these
            matters and cannot be appealed.</b>
          </p>
        </div>
        <div class="text-center">
          <button class="btn btn-info" onclick="hideModal('instruction-modal');">Close </button>
        </div>
      </div>
    </div>
    <!---->
    <Footer />

    <img
      id="certificate"
      src="/static/certificates/CVCertifiedTeacherAssessment.jpg"
      style="display:none;"
    />
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/assessments/HeaderContent.vue";
import CreateAssessment from "@/components/assessments/CreateAssessment.vue";
import Footer from "@/components/footer/Footer.vue";
import SideNav from "@/components/dashboard/SideNavTeacher.vue";
import html2canvas from "html2canvas";
export default {
  name: "home",
  components: {
    Header,
    SideNav,
    HeaderContent,
    CreateAssessment,
    Footer
  },
  data() {
    return {
      userId: 0,
      cls_id: this.$store.getters.getAuthData.auth_cls_id,
      user_id: this.$store.getters.getAuthData.auth_user_id,
      sec_id: this.$store.getters.getAuthData.auth_sec_id,
      role_id: this.$store.getters.getAuthData.auth_role_id,
      sch_id: this.$store.getters.getAuthData.auth_sch_id,
      user_name: this.$store.getters.getAuthData.auth_user_full_name,
      sch_name: this.$store.getters.getAuthData.auth_sch_name,
      assessments: [],
      codevidhyaAssessments: [],
      schoolAssessments: [],
      cv_assessments: [],
      userAssessment: [],
      publicUserAssessment: [],
      codevidhyaUserAssessment: [],
      schoolUserAssessment: [],
      assessmentsForSchool: [],
      postTrainingAssessment:[],
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
      st_count: 0,
      subjects: [],
      sub_id: "",
      search_que: "",
      allQuestions: [],
      newSubject: "",
      windowHegiht:0,
      purchasedAssessments:[],
      packageAssessment:[],
      selectedProducts:new Object(),
      allPackages:[],
      insAsmntDuration:'',
      insTotQue:''
    };
  },
  beforeCreate() {},
  created() {
    if (this.$route.query.assessment) {
      var query = atob(this.$route.query.assessment);
      var params = query.split(",");
      this.asmnt_id = params[0];
      this.assessments_students();
    }
  },
  beforeMount() {
    /*var item = [2,3,1];
    var oldItems = [4,13];
    oldItems = oldItems.filter(n=>item.includes(n))
    console.log("cls length"+oldItems.length)
    console.log(oldItems)*/
  },
  mounted: function() {
    //initCvModals();
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.user_name=this.$store.getters.getAuthData.auth_user_full_name;
          this.sch_name=this.$store.getters.getAuthData.auth_sch_name;
          this.getServerTime();
        }
      }.bind(this)
    );
    var vm = this;
    $(document).ready(function(){
      vm.windowHegiht = $(window).height();
    });
    $(window).resize(function(){
        this.windowHegiht = $(window).height();
    }.bind(this)); 
  },
  updated : function(){
      var vm = this;
      var items = $('.remaining-time');
			for(var i=0 ; i<items.length; i++){
        var assessmentDate = items[i].dataset.remainingTime
        
				var timeDiff = vm.timeDifference(assessmentDate);
        this.countdown(timeDiff, items[i])
      }
  },
  methods: {
    openModal: function(modalId) {
      $("#" + modalId + " > div").removeClass("visible");
      showModal($("#" + modalId));
    },
    assessmentDetails: function(assessment_id) {
      var det = btoa(assessment_id);
      this.$router.push({
        name: "assessmentdetail",
        query: { assessment: det }
      });
    },
    selectProduct: function(event){
       var keys =Object.keys(this.selectedProducts);
       if(event.currentTarget.dataset.orderId!=null){
         cvNotify("You have already purchased this assessment", "warning");
         event.currentTarget.checked=false
         return false;
       } 

        if(event.currentTarget.dataset.purchaseType==this.allPackages[0].package_id){
        if(event.currentTarget.checked==true){
          this.selectedProducts = new Object();
          this.selectedProducts[event.currentTarget.dataset.assessmentId] ={assessmentId:event.currentTarget.dataset.assessmentId, purchaseType:this.allPackages[0].package_id} 
        }else{
          this.selectedProducts =new Object();
        }
      }
      if(event.currentTarget.dataset.purchaseType==this.allPackages[1].package_id){
         var count=0;
        if(event.currentTarget.checked==true ){
          for(var i=0; i<keys.length;i++){
            if(this.selectedProducts[keys[i]].purchaseType==this.allPackages[1].package_id){
              count+=1;
            }else{
               delete this.selectedProducts[keys[i]];
            }  
          }
          if(count<2){
            this.selectedProducts[event.currentTarget.dataset.assessmentId] ={assessmentId:event.currentTarget.dataset.assessmentId, purchaseType:this.allPackages[1].package_id}
          }else{
            event.currentTarget.checked=false
            cvNotify("Select any two.", 'warning');
          }
        }else{
          delete this.selectedProducts[event.currentTarget.dataset.assessmentId];
        }
      }
      if(event.currentTarget.dataset.purchaseType==this.allPackages[2].package_id){
         var count=0;
        if(event.currentTarget.checked==true ){
          for(var i=0; i<keys.length;i++){
            if(this.selectedProducts[keys[i]].purchaseType==this.allPackages[2].package_id){
              count+=1;
            }
            else{
               delete this.selectedProducts[keys[i]];
            }    
          }
          if(count<3){
            this.selectedProducts[event.currentTarget.dataset.assessmentId] ={assessmentId:event.currentTarget.dataset.assessmentId,purchaseType:this.allPackages[2].package_id}
          }else{
            event.currentTarget.checked=false
            cvNotify("Select any three.", 'warning');
          }
        }else{
          delete this.selectedProducts[event.currentTarget.dataset.assessmentId];
        }
      }

      
      


       this.selectedProducts = recreateObject(this.selectedProducts);
    },
    buyProducts: function(package_id){
      
       /*this.$router.push(
        "/institute/assessments/checkout?products=" +
          this.selectedProducts +
          "&purchaseType=" +
          encodeURIComponent(buyType) 
      );*/

      this.$router.push({
        name: "assessmentcheckout",
        query: { assessmentDetail: this.selectedProducts,purchaseType:package_id }});

    },
    getServerTime: function() {
      this.$http.post("/api/user/getServerTime").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.serverTime = res.body.serverTime;
          this.load_assessments();
          this.assessmentForUsers();
          this.load_all_subjects();
          this.load_all_packages();
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
    load_all_packages : function() {
      this.$http.post("/api/user/All_packages", {}).then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          var allPackages = res.body.all_packages;
          for(var i=0; i<allPackages.length;i++){
            if(allPackages[i].used_for =='assessment'){
              this.allPackages.push(allPackages[i]);
            }
          }
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
   
    
    assessmentForUsers: function() {
      var cls_id;
      if (this.role_id == 2) {
        cls_id = 0;
      } else {
        cls_id = this.cls_id;
      }
      this.$http
        .post("/api/user/assessmentForUsers", {
          cls_id: cls_id,
          sch_id: this.sch_id,
          user_id: this.user_id,
          role_id: this.role_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.userAssessment =[]
            this.packageAssessment=[]
            this.purchasedAssessments=[]
            
            var assessments = res.body.data;

            
            for(var i=0; i<assessments.length;i++){
              var teacher_grades;
            var assessment_grades;
              assessment_grades=assessments[i].assessment_grades.split(",");
              teacher_grades=assessments[i].teacher_grades.split(",");
              var teacher_grades =assessment_grades.filter(n=>teacher_grades.includes(n))
             
              if(teacher_grades.length && assessments[i].price==0 && assessments[i].date && assessments[i].used_for==0 && assessments[i].status==1 ){
               this.userAssessment.push(assessments[i]);
              }

              if(assessments[i].price==0 && assessments[i].date && assessments[i].used_for==1 && assessments[i].status==1){
               this.postTrainingAssessment.push(assessments[i]);
              }  
              
              
              if(assessments[i].price!=0 && assessments[i].status==1){
                this.packageAssessment.push(assessments[i]);
                if(assessments[i].price!=0 && assessments[i].package_id && assessments[i].order_id){
                  this.purchasedAssessments.push(assessments[i]);
                }
              }
            }
           
          }
        });
    },
    load_assessments: function() {
      this.$http
        .post("/api/user/DisplayAssessment", {
          cls_id: this.cls_id,
          sch_id: this.sch_id,
          user_id: this.user_id,
          role_id: this.role_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.assessments=[]
            this.cv_assessments=[]
            this.schoolAssessments=[]
            this.schoolUserAssessment=[]
            this.assessmentsForSchool=[]
            this.codevidhyaAssessments=[]
            this.codevidhyaUserAssessment=[]
            this.publicAssessments=[]
            this.publicUserAssessment=[]
            
              this.cv_assessments = res.body.cv_assessments;
              
              this.assessments=res.body.cv_assessments;

              for (var i = 0; i < this.assessments.length; i++) {
                if (
                  this.assessments[i].sch_id == 0 &&
                  this.assessments[i].book_id == 0 &&
                  this.assessments[i].role_id == 3 &&
                  this.assessments[i].used_for == 0
                ) {
                  this.codevidhyaAssessments.push(this.assessments[i]);
                } 
                if (
                  this.assessments[i].book_id == 0 &&
                  this.assessments[i].sch_id == this.sch_id &&
                  this.assessments[i].role_id == 3 &&
                  this.assessments[i].used_for == 0
                ) {
                  this.schoolAssessments.push(this.assessments[i]);
                }

                if (
                  this.assessments[i].sch_id == 0 &&
                  this.assessments[i].book_id == 0 &&
                  this.assessments[i].used_for == 1
                ) {
                  this.publicUserAssessment.push(this.assessments[i]);
                }
              }
          }
        });
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
    shareAssessment: function(sharedType) {
      if (sharedType == "facebook") {
        var a = document.createElement("a");
        a.target = "_blank";
        a.href =
          "https://www.facebook.com/sharer/sharer.php?u=https://codevidhya.com/MySharedCode/share-assessment.php?src=sdkpreparse";
        a.click();
      } else if (sharedType == "whatsapp") {
        window.open(
          "https://api.whatsapp.com/send?text=https://codevidhya.com/MySharedCode/share-assessment.php",
          "_blank"
        );
      } else if (sharedType == "twitter") {
        window.open(
          "https://www.twitter.com/share?url=https://codevidhya.com/MySharedCode/share-assessment.php",
          "_blank"
        );
      } else if (sharedType == "linkedin") {
        window.open(
          "https://www.linkedin.com/shareArticle?mini=true&url=https://codevidhya.com/MySharedCode/share-assessment.php",
          "_blank"
        );
      }
    },
    downloadCertificate : function(assessmentName, score, tot_marks, result_date){
      if(this.$moment(result_date).format('DD-MM-YYYY')!=this.$moment(this.serverTime).format('DD-MM-YYYY')){
        cvNotify('Your certificate wiil be available on '+this.$moment(result_date).format('DD-MM-YYYY')+'.', 'Warning');
        return false 
      }
      var doc = new jsPDF("landscape", "px", "a4", true);
      var width = doc.internal.pageSize.width;
      var height = doc.internal.pageSize.height;
      var grade = ((score*100)/tot_marks) >=90?'A+':((score*100)/tot_marks) >=75 ? 'A':((score*100)/tot_marks)>=60? 'B' :((score*100)/tot_marks) >=36?'C':'Fail';
      if(grade=='Fail'){
        cvNotify('You scored less than 36 percent.', 'Warning');
        return false
      }
      
      var sch_session = this.$moment(result_date).subtract("year", 1).format("YYYY");
      var sch_session1 = this.$moment(result_date).format("YY");
      doc.addImage(document.querySelector("#certificate"), "JPEG", 0, 0, width, height);
      doc.setFont("times");
      doc.setFontType("italic");
      doc.setTextColor("#000000");
      doc.setFontSize(20);
      doc.text(this.user_name, width / 2+60, 195, null, null, "center");
      doc.text(this.sch_name, width / 2, 218, null, null, "center");
      doc.text(assessmentName, width / 2-110, 261, null, null, "center");
      doc.text('2019-20', width / 2-125, 283, null, null, "center");
      doc.text(grade, width / 2+135, 283, null, null, "center");
      doc.text(this.$moment(result_date).format("DD/MM/YYYY"), width / 2-190, 383, null, null, "center");
      doc.save("Certificate.pdf");

    }
  }
};
</script>

<style lang="scss">
blink {
  -webkit-animation: 1.2s linear infinite condemned_blink_effect; /* for Safari 4.0 - 8.0 */
  animation: 1.2s linear infinite condemned_blink_effect;

}

/* for Safari 4.0 - 8.0 */
@-webkit-keyframes condemned_blink_effect { 
  0% {
    visibility: hidden;
  }
  50% {
    visibility: hidden;
  }
  100% {
    visibility: visible;
  }
}

@keyframes condemned_blink_effect {
  0% {
    visibility: hidden;
  }
  50% {
    visibility: hidden;
  }
  100% {
    visibility: visible;
  }
}

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
