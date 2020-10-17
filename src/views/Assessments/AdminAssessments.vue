<template>
  <div class="container-fluid m-0 p-0">
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
                    <h1>Assessment</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Header>

    <div class="container-fluid">
      <div class="panel panel-primary">
        <div class="tab-menu-heading">
          <div class="tabs-menu d-flex">
            <!-- Tabs -->

            <ul class="nav panel-tabs">
              <li class="">
                <a href="#tab1" class="active" data-toggle="tab"
                  >View Assessment</a
                >
              </li>

              <li><a href="#tab2" data-toggle="tab">Assign Assessment</a></li>

              <li><a href="#tab3" data-toggle="tab">Assessment Report</a></li>

              <li>
                <a href="#tab4" data-toggle="tab">Assessment Questions</a>
              </li>
            </ul>

            <i class="flex flex-fill"></i>

            <button
              type="button"
              class="btn btn-success"
              onclick="showModal('createAssessmentModal')"
            >
              Create Assessment
            </button>
          </div>
        </div>

        <div class="panel-body tabs-menu-body">
          <div class="tab-content">
            <div class="tab-pane active " id="tab1">
              <div class="row bg-secondary p-2 d-flex align-items-center">
                <div class="col-sm-2">
                  <select
                    class="form-control bg-warning "
                    v-model="sch_id"
                    v-on:change="displayAssessment(sch_id)"
                  >
                    <option value="0" selected>All</option>

                    <option value="codevidhya">Codevidhya</option>

                    <option
                      v-for="(school, index) in schools"
                      :key="index"
                      v-bind:value="school.sch_id"
                    >
                      {{ school.name }}</option
                    >
                  </select>
                </div>

                <!-- <div class="col-sm-2">
    
                      <select
    
                        class="form-control bg-warning"
    
                        v-model="asmntType"
    
                        v-on:change="
    
                          asmnt_id = 0;
    
                          students = [];
    
                        "
    
                      >
    
                        <option value="1">Course</option>
    
                        <option value="2">Teacher</option>
    
                        <option value="3" selected>Student</option>
    
                        <option value="4">Code Quotient</option>
    
                      </select>
    
                    </div>-->

                <div class="col-sm-10 d-flex justify-content-end">
                  <template v-for="(asmnt, index) in asmntCategory">
                    <button
                      :key="index"
                      class="btn btn-primary p-2 mt-1 mr-1"
                      v-if="asmnt.status == 1"
                      @click="
                        asmnt_cat = asmnt.type;

                        selectedAssessment = asmnt.assessment;
                      "
                    >
                      {{ asmnt.name }}

                      <span class="badge badge-secondary badge-pill">{{
                        asmnt.assessment.length
                      }}</span>
                    </button>
                  </template>
                </div>
              </div>
              <div class="row mt-4">
                <div class="col-sm-12" v-if="selectedAssessment.length">
                  <div class="table-responsive">
                    <table class="table card-table table-vcenter text-nowrap">
                      <thead class="bg-primary text-white">
                        <tr>
                          <th class="text-white">Sr. No.</th>
                          <th class="text-white">Name</th>

                          <th class="text-white">Tot. Que.</th>
                          <th class="text-white">Tot. Marks</th>
                          <th class="text-white">Duration</th>
                          <th class="text-white">Created By</th>
                          <!--<th class="text-white">Assessment for</th>-->
                          <th class="text-white">Assigned to</th>
                          <th class="text-white">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <template
                          v-for="(assessment, index) in selectedAssessment"
                        >
                          <tr :key="index">
                            <th>{{ index + 1 }}</th>

                            <td>{{ assessment.assessment_name }}</td>

                            <td>{{ assessment.tot_que }}</td>

                            <th>{{ assessment.tot_marks }}</th>

                            <td>{{ assessment.duration }} min.</td>

                            <td>
                              <span v-if="assessment.sch_id == 0">
                                Codevidhya</span
                              >

                              <span v-else>
                                {{ schools[assessment.sch_id].name }}
                              </span>
                            </td>

                            <!--<td>school</td>-->

                            <td>
                              <span v-if="assessment.role_id == 3"
                                >For Student</span
                              >

                              <span v-else-if="assessment.role_id == 2"
                                >For Teacher</span
                              >
                            </td>

                            <td>
                              <button
                                class="btn btn-warning mr-1"
                                @click="
                                  assessmentDetails(
                                    assessment.assessment_id,

                                    asmnt_cat
                                  )
                                "
                              >
                                Details
                              </button>
                              <button
                                v-if="asmnt_cat == 4"
                                class="btn btn-success"
                                onclick="showModal('alertOnModal')"
                                @click="
                                  shareAssessmentId = assessment.assessment_id
                                "
                              >
                                Share
                              </button>
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>

                  <!--<template v-for="(assessment, index) in selectedAssessment">
    <div class="col-sm-3 d-inline-block">
    
        <div class="card">
    
            <span class="badge badge-pill badge-secondary mt-2" style="position:absolute; right:10px;" v-if="assessment.role_id == 3">For Student</span
    
                            >
    
                            <span
    
                              class="badge badge-pill badge-warning mt-2"
    
                              style="position:absolute; right:10px;"
    
                              v-else-if="assessment.role_id == 2"
    
                              >For Teacher</span
    
                            >
    
                            <img
    
                              class="card-img-top br-tr-3 br-tl-3"
    
                              src="/assets/images/project-thumbs/web.svg"
    
                              alt="Well, I didn't vote for you."
    
                            />
    
                            <div class="card-body d-flex flex-column">
    
                              <h4>{{ assessment.assessment_name }}</h4>
    
                              <div class="text-muted">
    
                                <p style="margin-bottom:4; margin-top:8px;">
    
                                  Total Questions: {{ assessment.tot_que }}
    
                                </p>
    
                                <p style="margin-bottom:4;">
    
                                  Total Marks : {{ assessment.tot_marks }}
    
                                </p>
    
                                <p style="margin-bottom:0; marigin-top:4px;">
    
                                  Duration : {{ assessment.duration }} min.
    
                                </p>
    
                              </div>
    
                            </div>
    
                            <div class="card-body d-flex">
    
                              <button
    
                                class="btn btn-warning"
    
                                @click="assessmentDetails(assessment.assessment_id)"
    
                              >
    
                                Details
    
                              </button>
    
                            </div>
    
                          </div>
    
                        </div>
</template>-->
                </div>
                <div v-if="!selectedAssessment.length">
                  <h5 style="color:#666">There is no assessment scheduled.</h5>
                </div>
              </div>
            </div>
            <div class="tab-pane  " id="tab2">
              <div class="row d-flex bg-secondary p-2">
                <div class="col-sm-2">
                  <select class="form-control" v-model="asmntType">
                    <option value="0">Assessment for</option>
                    <option value="1">Course</option>
                    <option value="2">Skill Certificate for Teacher</option>
                    <option value="3">Skill Certificate for Student</option>
                    <option value="4">Code Quotient</option>
                    <option value="5"
                      >Post Training Assessment for Teacher</option
                    >
                  </select>
                </div>
                <div
                  class="col-sm-2"
                  v-if="asmntType != 1 && asmntType != 2 && asmntType != 5"
                >
                  <select
                    class="form-control "
                    v-model="assign_sch_id"
                    v-on:change="load_classes(assign_sch_id)"
                  >
                    <option value="0" selected>All</option>
                    <option
                      v-for="(school, index) in schools"
                      :key="index"
                      v-bind:value="school.sch_id"
                    >
                      {{ school.name }}</option
                    >
                  </select>
                </div>

                <div class="col-sm-4" v-if="asmntType == 1">
                  <select class="form-control" v-model="book_id">
                    <option value="0" selected>Select Course</option>
                    <option
                      v-for="(course, index) in courses"
                      :key="index"
                      v-bind:value="course.book_id"
                    >
                      {{ course.book_name }}</option
                    >
                  </select>
                </div>
                <div class="col-sm-3">
                  <select
                    class="form-control"
                    data-input-type="asmntDropDown"
                    v-model="asmnt_id"
                    @change="
                      asmntType == 1 || asmntType == 2 || asmntType == 5
                        ? handleChangedEvents($event)
                        : load_assessments_classes(this.assign_sch_id, asmnt_id)
                    "
                  >
                    <option value="0" selected>Select Assessment</option>
                    <template v-for="(assessment, index) in cv_assessments">
                      <option
                        :key="index"
                        v-bind:value="assessment.assessment_id"
                        v-if="
                          asmntType == 1 &&
                            assessment.sch_id == 0 &&
                            assessment.book_id == 1 &&
                            assessment.used_for == 0 &&
                            assessment.role_id == 3
                        "
                      >
                        {{ assessment.assessment_name }}</option
                      >

                      <option
                        :key="index"
                        v-bind:value="assessment.assessment_id"
                        v-if="
                          asmntType == 2 &&
                            assessment.role_id == 2 &&
                            assessment.sch_id == 0 &&
                            assessment.price == 0 &&
                            assessment.product_id == 0 &&
                            assessment.used_for == 0
                        "
                        ><span
                          class="badge badge-primary"
                          v-if="assessment.price != 0"
                          >(Paid)</span
                        >

                        <span class="badge badge-primary" v-else>(Free)</span>
                        {{ assessment.assessment_name }}</option
                      >

                      <option
                        :key="index"
                        v-bind:value="assessment.assessment_id"
                        v-if="
                          asmntType == 3 &&
                            assessment.role_id == 3 &&
                            assessment.sch_id == 0 &&
                            assessment.book_id == 0 &&
                            assessment.used_for == 0
                        "
                      >
                        {{ assessment.assessment_name }}</option
                      >

                      <option
                        :key="index"
                        v-bind:value="assessment.assessment_id"
                        v-if="
                          asmntType == 4 &&
                            assessment.sch_id == 0 &&
                            assessment.role_id == 3 &&
                            assessment.book_id == 0 &&
                            assessment.used_for == 1
                        "
                      >
                        {{ assessment.assessment_name }}</option
                      >

                      <option
                        :key="index"
                        v-bind:value="assessment.assessment_id"
                        v-if="
                          asmntType == 5 &&
                            assessment.sch_id == 0 &&
                            assessment.role_id == 2 &&
                            assessment.book_id == 0 &&
                            assessment.used_for == 1
                        "
                      >
                        {{ assessment.assessment_name }}</option
                      >
                    </template>
                  </select>
                </div>
                <div
                  class="col-sm-2"
                  v-if="asmnt_id != 0 && (asmntType == 2 || asmntType == 5)"
                >
                  <input
                    type="datetime-local"
                    title="data for all schools"
                    v-model="techAsmntDate"
                    class="form-control"
                    :min="mindate"
                    data-input-type="dateTimeForAll"
                    @keyup.enter="handleChangedEvents"
                  />
                </div>
                <div
                  class="col-sm-2"
                  v-if="
                    asmnt_id != 0 &&
                      (asmntType == 2 || asmntType == 5 || asmntType == 3)
                  "
                >
                  <input
                    type="datetime-local"
                    title="Result declaration date"
                    v-model="techResultAsmntDate"
                    class="form-control"
                    :min="mindate"
                    data-input-type="ResultdateTime"
                    @keyup.enter="handleChangedEvents"
                  />
                </div>
                <div
                  class="col-sm-1"
                  v-if="asmnt_id != 0 && (asmntType == 2 || asmntType == 5)"
                >
                  <span
                    class="badge badge-secondary w-50 p-2 d-flex align-items-center justify-content-center"
                    style="cursor:pointer"
                  >
                    <label
                      class="custom-control custom-checkbox d-flex align-items-center justify-content-center"
                      style="cursor:pointer"
                    >
                      <input
                        type="checkbox"
                        data-input-type="selectAllCheckbox"
                        class="custom-control-input"
                        name="example-checkbox1dfsd"
                        style="cursor:pointer"
                        value="gh"
                        @change="handleChangedEvents"
                      />
                      <span class="custom-control-label">All</span>
                    </label>
                  </span>
                </div>
                <i class="flex flex-fill"></i>
                <div class="col-sm-1">
                  <button
                    class="btn btn-success"
                    title="assign assessment to course"
                    v-if="asmnt_id != 0 && asmntType == 1"
                    @click="assignAssessmentToCourse()"
                  >
                    Assign
                  </button>
                  <button
                    class="btn btn-success"
                    title="assign assessment to teacher"
                    v-if="asmnt_id != 0 && (asmntType == 2 || asmntType == 5)"
                    @click="assignAssessmentToTeacher()"
                  >
                    Assign
                  </button>
                  <button
                    type="button"
                    title="assign assessment to student"
                    class="btn btn-success"
                    v-if="asmnt_id != 0 && asmntType == 3"
                    @click="assignAssessment()"
                  >
                    Assign
                  </button>
                  <button
                    class="btn btn-success"
                    title="assign assessment to code quotient"
                    v-if="asmnt_id != 0 && asmntType == 4"
                    @click="assignAssessment()"
                  >
                    Assign
                  </button>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6" v-if="asmntType == 3 || asmntType == 4">
                  <div class="px-4 py-2">
                    <b>Assign and schedule this assessment:</b>
                  </div>
                  <div class="px-4 py-2">
                    <table
                      class="table card-table table-vcenter text-nowrap table-primary"
                    >
                      <thead class="bg-primary text-white">
                        <tr>
                          <th class="text-white"></th>
                          <th class="text-white">Grade</th>
                          <th class="text-white">Schedule Assessment</th>
                        </tr>
                      </thead>
                      <tbody>
                        <template v-for="(cls, index) in sch_classes">
                          <tr :key="index">
                            <td>
                              <input
                                type="checkbox"
                                name="grade"
                                :id="'clschk' + cls.cls_id"
                                v-model="selectedClass"
                                :value="cls.cls_id"
                              />
                            </td>

                            <td>{{ cls.cls_name }}</td>

                            <td>
                              <input
                                type="datetime-local"
                                :id="'cls_date' + cls.cls_id"
                                class="form-control"
                                :value="asmntTime"
                                :min="mindate"
                              />
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  class="col-sm-12"
                  v-else-if="
                    (asmntType == 2 || asmntType == 5) && asmnt_id != 0
                  "
                >
                  <div class="table-responsive">
                    <table
                      class="table card-table table-vcenter text-nowrap table-primary"
                    >
                      <thead class="bg-primary text-white">
                        <tr>
                          <th class="text-white">Sr. No.</th>
                          <th class="text-white">School Name</th>
                          <th class="text-white">Exam Happened on</th>
                          <th class="text-white">Select School</th>
                        </tr>
                      </thead>
                      <tbody>
                        <template v-for="(school, index) in selectedSchools">
                          <tr :key="index">
                            <th>{{ index }}</th>

                            <td>{{ school.name }}</td>

                            <td>
                              <input
                                type="datetime-local"
                                class="form-control"
                                data-input-type="dateTimeSchool"
                                v-model="selectedSchools[school.sch_id].date"
                                :data-sch-id="school.sch_id"
                                :min="mindate"
                                @keyup.enter="handleChangedEvents"
                              />
                            </td>

                            <td>
                              <span
                                class="badge badge-secondary w-50 p-2 d-flex align-items-center justify-content-center"
                                style="cursor:pointer"
                              >
                                <label
                                  class="custom-control custom-checkbox"
                                  style="cursor:pointer"
                                >
                                  <input
                                    type="checkbox"
                                    class="custom-control-input"
                                    name="example-checkbox1"
                                    style="cursor:pointer"
                                    :data-sch-id="school.sch_id"
                                    data-input-type="checkBox"
                                    :checked="
                                      school.status == true ? true : false
                                    "
                                    @change="handleChangedEvents"
                                  />

                                  <span class="custom-control-label"></span>
                                </label>
                              </span>
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-pane " id="tab3">
              <div class="row bg-secondary p-2 d-flex align-items-center">
                <div class="col-sm-2 text-white">
                  <select
                    class="form-control bg-warning "
                    v-model="report_sch_id"
                    v-on:change="
                      students = [];
                      displayAssessment(report_sch_id);
                      load_classes(report_sch_id);
                    "
                  >
                    <option value="" selected>Select school</option>
                    <option
                      v-for="(school, index) in schools"
                      :key="index"
                      v-bind:value="school.sch_id"
                    >
                      {{ school.name }}</option
                    >
                  </select>
                </div>
                <div
                  class="col-sm-2"
                  v-if="report_sch_id != '' || report_sch_id != 0"
                >
                  <select class="form-control bg-warning" v-model="asmntType">
                    <option value="0">Assessment for</option>
                    <option value="2">Skill Certificate for Teacher</option>
                    <option value="3">Skill Certificate for Student</option>
                    <option value="4">Code Quotient</option>
                    <option value="5"
                      >Post Training Assessment for Teacher</option
                    >
                  </select>
                </div>
                <div
                  class="col-sm-2"
                  v-if="report_sch_id != 0 && asmntType != 0"
                >
                  <select
                    class="form-control bg-warning"
                    v-model="report_asmnt_id"
                    v-on:change="
                      load_assessments_classes(report_sch_id, report_asmnt_id);
                      assessments_students(report_sch_id, report_asmnt_id);
                    "
                  >
                    <option value="0" selected>Select Assessment</option>
                    <template v-for="(assessment, index) in cv_assessments">
                      <option
                        :key="index"
                        v-bind:value="assessment.assessment_id"
                        v-if="
                          asmntType == 2 &&
                            assessment.role_id == 2 &&
                            assessment.sch_id == 0 &&
                            assessment.book_id == 0
                        "
                      >
                        {{ assessment.assessment_name }}</option
                      >

                      <option
                        :key="index"
                        v-bind:value="assessment.assessment_id"
                        v-if="
                          asmntType == 3 &&
                            assessment.role_id == 3 &&
                            assessment.sch_id == 0 &&
                            assessment.book_id == 0 &&
                            assessment.used_for == 0
                        "
                      >
                        {{ assessment.assessment_name }}</option
                      >

                      <option
                        :key="index"
                        v-bind:value="assessment.assessment_id"
                        v-if="
                          asmntType == 4 &&
                            assessment.sch_id == 0 &&
                            assessment.role_id == 3 &&
                            assessment.book_id == 0 &&
                            assessment.used_for == 1
                        "
                      >
                        {{ assessment.assessment_name }}</option
                      >

                      <option
                        :key="index"
                        v-bind:value="assessment.assessment_id"
                        v-if="
                          asmntType == 5 &&
                            assessment.sch_id == 0 &&
                            assessment.role_id == 2 &&
                            assessment.book_id == 0 &&
                            assessment.used_for == 1
                        "
                      >
                        {{ assessment.assessment_name }}</option
                      >
                    </template>
                  </select>
                </div>

                <div
                  class="col-sm-2"
                  v-if="
                    report_sch_id != 0 &&
                      report_asmnt_id != 0 &&
                      (asmntType == 3 || asmntType == 4)
                  "
                >
                  <select
                    class="form-control bg-warning"
                    v-model="cls_id"
                    v-on:change="
                      assessments_students(report_sch_id, report_asmnt_id)
                    "
                  >
                    <option value="0" selected>Select Grade</option>
                    <option
                      v-for="(asmnt_cls, index) in asmnt_classes"
                      :key="index"
                      v-bind:value="asmnt_cls.cls_id"
                    >
                      {{ asmnt_cls.cls_name }}</option
                    >
                  </select>
                </div>
                <i class="flex flex-fill"></i>

                <div
                  class="col-sm-3 bg-warning "
                  style="display:flex;align-items:center;"
                  v-if="students.length"
                >
                  <table style="width:100%;">
                    <tr>
                      <th>Total Users</th>
                      <th>Attempted</th>
                      <th>Not Attempted</th>
                    </tr>
                    <tr>
                      <td>{{ students.length }}</td>
                      <td>{{ students.length - st_count }}</td>
                      <td>{{ st_count }}</td>
                    </tr>
                  </table>
                </div>
              </div>
              <div class="row" v-if="students.length">
                <table class="table card-table table-vcenter text-nowrap">
                  <thead class="bg-primary text-white">
                    <tr>
                      <th class="text-white">Stdent Name</th>
                      <th class="text-white">Section</th>
                      <th class="text-white">Score</th>
                      <!--<th class="text-white">Rank in Class</th>
                      <th class="text-white">Rank in Section</th>-->
                      <th class="text-white">Status</th>
                      <th class="text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(student, index) in students">
                      <tr :key="index">
                        <th>{{ student.name }}</th>

                        <td>{{ student.sec_name }}</td>

                        <td>{{ student.score }}</td>

                        <!-- <td>{{ student.cls_rank }}</td>

                        <th>{{ student.sec_rank }}</th>-->

                        <td v-if="student.exam_status > 0">Present</td>

                        <td v-else>Absent</td>

                        <td>
                          <button
                            class="btn btn-info"
                            v-bind:id="student.user_id"
                            v-on:click="check_assessment(student.user_id)"
                            v-if="
                              student.exam_status > 0 && student.score == null
                            "
                          >
                            Check
                          </button>
                          <button
                            class="btn btn-warning mr-1"
                            @click="downloadCertificate(student)"
                            v-if="student.score != null"
                          >
                            Download Certificate
                          </button>
                          <!--<button
                            class="btn btn-warning"
                            v-on:click="view_report(student.user_id)"
                            v-if="student.score != null"
                          >
                            Report
                          </button>-->

                          <!--<button class="btn btn-danger"  v-on:click="clear_report(student.user_id,'record');" v-if="student.score!=null">Clear</button>
    
                            <button class="btn btn-warning"  v-on:click="clear_report(student.user_id,'time');" v-if="student.exam_status>0 && student.score==null">Reset Time</button>-->

                          <span
                            v-if="
                              student.score == null && student.exam_status == 0
                            "
                            >Not Attempted</span
                          >
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="tab-pane  " id="tab4">
              <div class="row">
                <div class="col-sm-12">
                  <div class="panel-group1" id="subjectsaccordion2">
                    <div class="panel panel-default  border">
                      <div class="panel-heading bg-secondary text-white row">
                        <div class="col-sm-10">
                          <h4 class="panel-title">
                            <a
                              role="button"
                              data-toggle="collapse"
                              data-parent="#subjectsaccordion2"
                              href="#subjectscollapseFour"
                              aria-expanded="false"
                              aria-controls="collapseOne"
                              class="collapsed text-white"
                            >
                              Subjects
                            </a>
                          </h4>
                        </div>
                        <div
                          class="col-sm-2 d-flex justify-conent-end align-items-center "
                        >
                          <i class="flex flex-fill" />
                          <span
                            class="badge badge-primary mr-1"
                            title="Download file to upload questions"
                            style="cursor:pointer"
                            @click="downloadQuestionFile()"
                          >
                            <h3><i class="fas fa-download" /></h3>
                          </span>
                          <span
                            class="badge badge-primary mr-1"
                            title="Upload questions file"
                            style="cursor:pointer"
                            onclick="showModal('questionUploadFileModal');"
                          >
                            <h3><i class="fas fa-upload" /></h3>
                          </span>

                          <span
                            class="badge badge-primary mr-1"
                            title="Add new question"
                            style="cursor:pointer"
                            onclick="showModal('addQueInQueTab-button-modal');"
                          >
                            <h3><i class="fas fa-plus" /></h3>
                          </span>
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
                                <a href="#" class="active" data-toggle="tab"
                                  >All</a
                                >
                              </li>
                              <template v-for="subject in subjects">
                                <li
                                  class="mb-2"
                                  :key="subject.sub_id"
                                  v-if="subject.sch_id == sch_id"
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
                      >
                        <div class="panel-heading1">
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
                                {{ question.que_id }}
                              </p>
                              <p
                                class="badge badge-primary mr-1 d-inline-block"
                              >
                                {{ question.que_type }}
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
                                @click="imagePreview = question.question_img"
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
                                  :src="'/static/uploads/' + question.opt1_img"
                                  alt="img"
                                  @click="imagePreview = question.opt1_img"
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
                                  :src="'/static/uploads/' + question.opt2_img"
                                  alt="img"
                                  @click="imagePreview = question.opt2_img"
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
                                  :src="'/static/uploads/' + question.opt3_img"
                                  alt="img"
                                  @click="imagePreview = question.opt3_img"
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
                                  :src="'/static/uploads/' + question.opt4_img"
                                  alt="img"
                                  @click="imagePreview = question.opt4_img"
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

    <!-- Modal of alerton -->
    <div id="alertOnModal" class="cv-modal normal ">
      <div
        style="display: flex; flex-direction: column; max-width:3000px; width:50%; height:50%;"
      >
        <div class="card">
          <div class="card-header bg-secondary text-white">
            <h4>Pop Model Number</h4>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-sm-4"><h4>Enter Number</h4></div>
              <div class="col-sm-8">
                <input type="number" v-model="alertOn" />
              </div>
            </div>
          </div>

          <div class="card-footer d-flex justify-content-center">
            <button class="btn btn-success mr-1" @click="shareAssessment()">
              Share
            </button>
            <button class="btn btn-success" onclick="hideModal('alertOnModal')">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--Modal ends here -->
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

    <!-- Modal of Add new question button -->
    <div id="addQueInQueTab-button-modal" class="cv-modal normal ">
      <div
        style="display: flex; flex-direction: column; max-width:3000px; width:98%; height:98%;"
      >
        <NewQuestion
          :sch_id="0"
          :load_questions="load_questions"
          :load_all_subjects="load_all_subjects"
        ></NewQuestion>
      </div>
    </div>
    <!--Modal ends here -->
    <!-- Modal of create new assessment button -->
    <div id="createAssessmentModal" class="cv-modal normal ">
      <div
        style="display: flex; flex-direction: column; max-width:3000px; width:98%; height:98%; overflow:auto;"
      >
        <CreateAssessment
          :load_assessments="loadAssessments"
          :sch_id="0"
        ></CreateAssessment>
      </div>
    </div>
    <!--assessment Modal ends here -->
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

    <!------------Upload question file modal------------------------>
    <div id="questionUploadFileModal" class="cv-modal normal">
      <div>
        <div class="header">
          <h3>Upload file</h3>
        </div>
        <div class="body" style="padding: 24px">
          <div class="cv-file-input-group">
            <input
              type="file"
              id="uploadfile-input"
              accept=".csv, .xls, .xlsx"
            />
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

    <img
      id="certificate"
      src="/static/certificates/CVCertifiedTeacherAssessment.jpg"
      style="display:none;"
    />
  </div>
</template>

<script>
import moment from "vue-moment";
import Header from "@/components/header/HeaderMenuForAdmin.vue";
import NewQuestion from "@/components/assessments/NewQuestion.vue";
import UpdateQuestionModal from "@/components/assessments/UpdateQuestion.vue";
import CreateAssessment from "@/components/assessments/CreateAssessment.vue";

export default {
  components: { NewQuestion, CreateAssessment, UpdateQuestionModal, Header },
  data() {
    return {
      asmnt_cat: "",
      asmntCategory: [
        {
          id: 0,
          name: "All Assessments",
          assessment: "",
          status: 0,
          type: 0
        },
        {
          id: 1,
          name: "Course Assessments",
          assessment: [],
          status: 0,
          type: 1
        },
        {
          id: 2,
          name: "Coding Quotients",
          assessment: [],
          status: 0,
          type: 4
        },
        {
          id: 3,
          name: "Skill Assessments(Student) ",
          assessment: [],
          status: 0,
          type: 3
        },

        {
          id: 5,
          name: "Skill Assessments(Teacher)",
          assessment: [],
          status: 0,
          type: 2
        },

        {
          id: 4,
          name: "School Assessments",
          assessment: [],
          status: 0,
          type: 0
        },
        {
          id: 5,
          name: "Post Training (Teacher)",
          assessment: [],
          status: 0,
          type: 5
        }
      ],
      selectedAssessment: [],
      sch_id: 0,
      assign_sch_id: 0,
      report_sch_id: "",
      schools: new Object(),
      name: "",
      assessments: "",
      cv_assessments: [],
      allAssessments: [],
      codevidhyaAssessments: [],
      schoolAssessments: [],
      codeQuotientsAssessments: [],
      courseAssessments: [],
      studentAssessments: [],
      teacherAssessments: [],
      assessment_id: 0,
      assignedAsmntId: 0,
      assessment_det: [],
      asmnt_name: "",
      cls_name: "",
      cls_id: 0,
      asmnt_time: "",
      allQuestions: [],
      subjects: [],
      sub_id: "",
      search_que: "",
      sub_sch_id: 0,
      asmntType: 0,
      asmnt_id: 0,
      report_asmnt_id: 0,
      sch_classes: [],
      selectedClass: [],
      asmntTime: this.$moment().format("YYYY-MM-DDTHH:mm"),
      mindate: this.$moment().format("YYYY-MM-DDTHH:mm"),
      asmnt_classes: new Object(),
      techAsmntDate: this.$moment().format("YYYY-MM-DDTHH:mm"),
      techResultAsmntDate: this.$moment().format("YYYY-MM-DDTHH:mm"),
      students: [],
      st_count: 0,
      book_id: 0,
      courses: [],
      queId: 0,
      updateQuestion: [],
      schoolsWithClasses: new Object(),
      selectedSchools: new Object(),
      checkbit: "",
      imagePreview: "",
      shareAssessmentId: "",
      alertOn: 0
    };
  },
  beforeCreate() {},
  created() {
    if (this.$route.query.data) {
      this.sch_id = this.$route.query.data;
      this.loadSchoolAssessment();
    }
  },
  beforeMount() {
    this.load_schools();
    //this.loadSchoolsWithClasses();
    this.load_all_subjects();
    this.load_questions();
    this.loadAssessments(0);
    this.loadCourses();
  },
  methods: {
    handleChangedEvents(e) {
      var inputType = e.currentTarget.dataset.inputType;
      if (inputType == "checkBox") {
        // get the checked status and set the status
        this.selectedSchools[e.currentTarget.dataset.schId].status =
          e.currentTarget.checked;
      } else if (inputType == "dateTimeSchool") {
        // change the date and time for the specific school
        this.selectedSchools[e.currentTarget.dataset.schId].date =
          e.currentTarget.value;
      } else if (inputType == "dateTimeForAll") {
        // change the date and time for all the school
        var objKeys = Object.keys(this.selectedSchools);
        if (e.keyCode === 13) {
          for (var i = 0; i < objKeys.length; i++) {
            this.selectedSchools[objKeys[i]].date = this.techAsmntDate;
          }
        }
      } else if (inputType == "ResultdateTime") {
        // change the date and time for all the school
        var objKeys = Object.keys(this.selectedSchools);
        if (e.keyCode === 13) {
          for (var i = 0; i < objKeys.length; i++) {
            this.selectedSchools[
              objKeys[i]
            ].result_date = this.techResultAsmntDate;
          }
        }
      } else if (inputType == "asmntDropDown") {
        // change the assessment_id of the all the schools
        var objKeys = Object.keys(this.selectedSchools);
        for (var i = 0; i < objKeys.length; i++) {
          this.selectedSchools[objKeys[i]].assessment_id = this.asmnt_id;
        }
      } else if (inputType == "selectAllCheckbox") {
        // change the assessment_id of the all the schools
        var objKeys = Object.keys(this.selectedSchools);
        for (var i = 0; i < objKeys.length; i++) {
          this.selectedSchools[objKeys[i]].status = e.currentTarget.checked;
        }
      }
      this.selectedSchools = recreateObject(this.selectedSchools);
    },
    downloadQuestionFile: function() {
      this.$http
        .post(
          "/api/user/downloadQuestionFile",
          { sch_id: 0 },
          { responseType: "blob" }
        )
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            let blob = new Blob([res.body], {
              type: res.headers.get("content-type")
            });
            let link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "Questions File.xlsx";
            link.click();
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

    assessmentDetails: function(assessment_id, asmnt_cat) {
      var sch_id = "";
      if (this.sch_id == 0 || this.sch_id == "codevidhya") {
        sch_id = 0;
      } else {
        sch_id = this.sch_id;
      }
      var det = btoa(assessment_id + "," + sch_id + "," + asmnt_cat);
      this.$router.push({
        name: "adminassessmentdetail",
        query: { assessment: det }
      });
    },

    displayAssessment: function(sch_id) {
      if (sch_id == 0 || sch_id == "codevidhya") {
        this.loadAssessments(sch_id);
      } else if (sch_id != "") {
        this.loadSchoolAssessment(sch_id);
      }
    },
    loadCourses: function() {
      this.$http.post("/api/user/displayAllBooks").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push('/login');
        } else {
          this.courses = res.body.courses;
        }
      });
    },
    load_classes: function(sch_id) {
      this.$http
        .post("/api/user/School_classes", { sch_id: sch_id })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.sch_classes = res.body.all_classes;
          }
        });
    },

    load_schools: function() {
      this.selectedSchools = new Object();
      this.$http.post("/api/user/DisplaySchools").then(function(res) {
        if (res.body.status == "403") {
          //this.$router.push("/login");
        } else {
          var schools = res.body.schools;
          for (var i = 0; i < schools.length; i++) {
            this.selectedSchools[schools[i].sch_id] = {
              sch_id: schools[i].sch_id,
              name: schools[i].name,
              assessment_id: "",
              date: this.techAsmntDate,
              cls_id: 0,
              status: false,
              result_date: ""
            };
            this.schools[schools[i].sch_id] = schools[i];
          }
        }
      });
    },
    loadSchoolsWithClasses: function() {
      this.$http
        .post("/api/user/DisplaySchoolsWithClasses")
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push("/login");
          } else {
            var schoolsClasses = res.body.schoolsGrades;
            for (var i = 0; i < schoolsClasses.length; i++) {
              this.schoolsWithClasses[schools[i].sch_id] = schools[i];
            }
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
    load_assessments_classes: function(sch_id, asmnt_id) {
      if (this.asmntType == 2) {
        return false;
      }
      this.$http
        .post("/api/user/Assessment_classes", {
          sch_id: sch_id,
          assessment_id: asmnt_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            // this.asignedAsmntClass=res.body.asmnt_classes;
            this.selectedClass = [];
            var ass_classes = res.body.asmnt_classes;
            for (var i = 0; i < ass_classes.length; i++) {
              this.asmnt_classes[ass_classes[i].cls_id] = ass_classes[i];
              this.selectedClass[i] = ass_classes[i].cls_id;
            }
          }
        });
    },
    assignAssessment: function() {
      var asmntAssignedClass = [];
      if (this.asmnt_id == 0) {
        cvNotify("Please select an assessment.", "info");
        return false;
      }
      if (
        this.selectedClass.length != 0 &&
        (this.asmntType == 3 || this.asmntType == 4)
      ) {
        for (var i = 0; i < this.selectedClass.length; i++) {
          var dt = $("#cls_date" + this.selectedClass[i]).val();
          var cls_date = this.$moment(dt).format("YYYY-MM-DD HH:mm:ss");
          asmntAssignedClass.push({
            cls_id: this.selectedClass[i],
            asmnt_date: cls_date
          });
        }
        this.$http
          .post("/api/user/assignAssessment", {
            asmnt_id: this.asmnt_id,
            sch_id: this.assign_sch_id,
            classes: asmntAssignedClass
          })
          .then(function(res) {
            if (res.body.status == "403") {
              //this.$router.push('/login');
            } else {
              if (res.body.success == 1) {
                cvNotify(
                  "You have successfully assigned this assessment.",
                  "info"
                );
                this.load_assessments_classes(
                  this.assign_sch_id,
                  this.asmnt_id
                );
                asmntAssignedClass = [];
              }
            }
          });
      } else {
        cvNotify("Please select at least one grade.", "info");
        return false;
      }
    },

    assignAssessmentToTeacher: function() {
      var objKeys = Object.keys(this.selectedSchools);
      for (var i = 0; i < objKeys.length; i++) {
        this.selectedSchools[objKeys[i]].date = this.$moment(
          this.selectedSchools[objKeys[i]].date
        ).format("YYYY-MM-DD HH:mm:ss");

        this.selectedSchools[objKeys[i]].result_date = this.$moment(
          this.selectedSchools[objKeys[i]].result_date
        ).format("YYYY-MM-DD HH:mm:ss");
      }

      if (this.asmnt_id == 0) {
        cvNotify("Please select an assessment.", "info");
        return false;
      }
      if (this.asmntType == 2 || this.asmntType == 5) {
        this.$http
          .post("/api/user/assignAssessmentToTeacher", {
            schoolsDetail: this.selectedSchools
          })
          .then(function(res) {
            if (res.body.status == "403") {
              //this.$router.push('/login');
            } else {
              if (res.body.success == 1) {
                cvNotify(
                  "You have successfully assigned this assessment.",
                  "info"
                );
              } else if (res.body.success == 0) {
                cvNotify("This assessment already assigned", "warning");
              }
              this.load_schools();
              this.asmnt_id = 0;
            }
          });
      } else {
        cvNotify("Please provide date.", "info");
        return false;
      }
    },
    assignAssessmentToCourse: function() {
      if (this.asmnt_id == 0) {
        cvNotify("Please select an assessment.", "info");
        return false;
      }
      if (this.book_id == 0) {
        cvNotify("Please select a course.", "info");
        return false;
      }

      if (this.asmntType == 1) {
        this.$http
          .post("/api/user/assignAssessmentToCourse", {
            asmnt_id: this.asmnt_id,
            book_id: this.book_id
          })
          .then(function(res) {
            if (res.body.status == "403") {
              //this.$router.push('/login');
            } else {
              if (res.body.success == 1) {
                this.loadAssessments(this.assign_sch_id);
                this.asmnt_id = 0;
                cvNotify(
                  "You have successfully assigned this assessment to course.",
                  "info"
                );
              } else if (res.body.success == 0) {
                cvNotify(
                  "This assessment already assigned to this course.",
                  "warning"
                );
              }
            }
          });
      } else {
        cvNotify("Please provide date.", "info");
        return false;
      }
    },
    assignAssessmentCodeQuotient: function() {
      if (this.asmnt_id == 0) {
        cvNotify("Please select an assessment.", "info");
        return false;
      }
      if (this.asmntType == 4) {
        this.$http
          .post("/api/user/assignAssessmentToCodeQuotient", {
            asmnt_id: this.asmnt_id
          })
          .then(function(res) {
            if (res.body.status == "403") {
              //this.$router.push('/login');
            } else {
              if (res.body.success == 1) {
                this.loadAssessments(this.assign_sch_id);
                this.asmnt_id = 0;
                cvNotify(
                  "You have successfully assigned this assessment to code Quotient.",
                  "info"
                );
              }
            }
          });
      }
    },

    load_questions: function() {
      this.$http
        .post("/api/user/Subject_questions", {
          sub_id: this.sub_id,
          search_for: this.search_que,
          sch_id: 0
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.allQuestions = res.body.all_questions;
          }
        });
    },
    editQuestion: function(queId, question) {
      this.updateQuestion = [];
      this.queId = queId;
      this.updateQuestion = question;
      showModal("updateQueInQueTab-button-modal");
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
    loadAssessments: function(sch_id) {
      this.cv_assessments = [];
      this.allAssessments = [];
      this.codeQuotientsAssessments = [];
      this.courseAssessments = [];
      this.codevidhyaAssessments = [];
      this.schoolAssessments = [];
      this.selectedAssessment = [];
      this.asmntCategory[0].status = 0;
      this.asmntCategory[1].status = 0;
      this.asmntCategory[2].status = 0;
      this.asmntCategory[3].status = 0;
      this.asmntCategory[4].status = 0;
      this.asmntCategory[5].status = 0;

      this.asmntCategory[0].assessment = [];
      this.asmntCategory[1].assessment = [];
      this.asmntCategory[2].assessment = [];
      this.asmntCategory[3].assessment = [];
      this.asmntCategory[4].assessment = [];
      this.asmntCategory[5].assessment = [];
      this.asmntCategory[6].assessment = [];

      this.$http
        .post("/api/user/DisplayAssessment", { role_id: "" })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.cv_assessments = res.body.assessments;
            if (sch_id == 0) {
              this.allAssessments = res.body.assessments;
              this.selectedAssessment = res.body.assessments;
              this.asmntCategory[0].assessment = this.allAssessments;
              this.asmntCategory[0].status = 1;
              for (var i = 0; i < this.cv_assessments.length; i++) {
                if (
                  this.allAssessments[i].used_for == 1 &&
                  this.allAssessments[i].role_id == 3 &&
                  this.allAssessments[i].sch_id == 0 &&
                  this.allAssessments[i].book_id == 0
                ) {
                  this.asmntCategory[2].status = 1;
                  this.asmntCategory[2].assessment.push(this.allAssessments[i]);
                  this.codeQuotientsAssessments.push(this.allAssessments[i]);
                }
                if (
                  this.allAssessments[i].used_for == 0 &&
                  this.allAssessments[i].role_id == 3 &&
                  this.allAssessments[i].sch_id == 0 &&
                  this.allAssessments[i].book_id != 0
                ) {
                  this.asmntCategory[1].status = 1;
                  this.asmntCategory[1].assessment.push(this.allAssessments[i]);
                  this.courseAssessments.push(this.allAssessments[i]);
                }
                if (
                  this.allAssessments[i].used_for == 0 &&
                  this.allAssessments[i].role_id == 3 &&
                  this.allAssessments[i].sch_id == 0 &&
                  this.allAssessments[i].book_id == 0
                ) {
                  this.asmntCategory[3].status = 1;
                  this.asmntCategory[3].assessment.push(this.allAssessments[i]);
                  this.codevidhyaAssessments.push(this.allAssessments[i]);
                }
                if (
                  this.allAssessments[i].used_for == 0 &&
                  this.allAssessments[i].role_id == 2 &&
                  this.allAssessments[i].sch_id == 0 &&
                  this.allAssessments[i].book_id == 0
                ) {
                  this.asmntCategory[4].status = 1;
                  this.asmntCategory[4].assessment.push(this.allAssessments[i]);
                  this.teacherAssessments.push(this.allAssessments[i]);
                }
                if (
                  this.allAssessments[i].used_for == 0 &&
                  this.allAssessments[i].role_id == 3 &&
                  this.allAssessments[i].sch_id != 0 &&
                  this.allAssessments[i].book_id == 0
                ) {
                  this.asmntCategory[5].status = 1;
                  this.asmntCategory[5].assessment.push(this.allAssessments[i]);
                  this.schoolAssessments.push(this.allAssessments[i]);
                }
              }
            } else if (sch_id == "codevidhya") {
              for (var i = 0; i < this.cv_assessments.length; i++) {
                if (this.cv_assessments[i].sch_id == 0) {
                  this.selectedAssessment.push(this.cv_assessments[i]);
                  this.asmntCategory[0].assessment.push(this.cv_assessments[i]);
                  this.asmntCategory[0].status = 1;
                  if (
                    this.cv_assessments[i].sch_id == 0 &&
                    this.cv_assessments[i].book_id != 0
                  ) {
                    this.asmntCategory[1].status = 1;
                    this.asmntCategory[1].assessment.push(
                      this.cv_assessments[i]
                    );
                  }
                  if (
                    this.cv_assessments[i].used_for == 1 &&
                    this.cv_assessments[i].role_id == 3 &&
                    this.cv_assessments[i].sch_id == 0 &&
                    this.cv_assessments[i].book_id == 0
                  ) {
                    this.asmntCategory[2].status = 1;
                    this.asmntCategory[2].assessment.push(
                      this.cv_assessments[i]
                    );
                  }
                  if (
                    this.cv_assessments[i].used_for == 0 &&
                    this.cv_assessments[i].role_id == 3 &&
                    this.cv_assessments[i].sch_id == 0 &&
                    this.cv_assessments[i].book_id == 0
                  ) {
                    this.asmntCategory[3].status = 1;
                    this.asmntCategory[3].assessment.push(
                      this.cv_assessments[i]
                    );
                  }
                  if (
                    this.cv_assessments[i].used_for == 0 &&
                    this.cv_assessments[i].role_id == 2 &&
                    this.cv_assessments[i].sch_id == 0 &&
                    this.cv_assessments[i].book_id == 0
                  ) {
                    this.asmntCategory[4].status = 1;
                    this.asmntCategory[4].assessment.push(
                      this.cv_assessments[i]
                    );
                  }
                  if (
                    this.cv_assessments[i].used_for == 1 &&
                    this.cv_assessments[i].role_id == 2 &&
                    this.cv_assessments[i].sch_id == 0 &&
                    this.cv_assessments[i].book_id == 0
                  ) {
                    this.asmntCategory[6].status = 1;
                    this.asmntCategory[6].assessment.push(
                      this.cv_assessments[i]
                    );
                  }
                }
              }
            }
          }
        });
    },
    loadSchoolAssessment: function(sch_id) {
      if (sch_id == 0) {
        return false;
      }

      this.allAssessments = [];
      //this.cv_assessments=[];
      this.codevidhyaAssessments = [];
      this.schoolAssessments = [];
      this.selectedAssessment = [];
      this.asmntCategory[0].status = 0;
      this.asmntCategory[1].status = 0;
      this.asmntCategory[2].status = 0;
      this.asmntCategory[3].status = 0;
      this.asmntCategory[4].status = 0;
      this.asmntCategory[5].status = 0;
      this.asmntCategory[0].assessment = [];
      this.asmntCategory[1].assessment = [];
      this.asmntCategory[2].assessment = [];
      this.asmntCategory[3].assessment = [];
      this.asmntCategory[4].assessment = [];
      this.asmntCategory[5].assessment = [];

      this.$http
        .post("/api/user/School_assessment", { sch_id: sch_id })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            //this.cv_assessments=res.body.cv_assessments;
            this.allAssessments = res.body.cv_assessments;
            this.selectedAssessment = res.body.cv_assessments;
            this.asmntCategory[0].status = 1;
            this.asmntCategory[0].assessment = this.allAssessments;
            for (var i = 0; i < this.allAssessments.length; i++) {
              if (
                this.allAssessments[i].used_for == 0 &&
                this.allAssessments[i].sch_id == 0 &&
                this.allAssessments[i].book_id == 0 &&
                this.allAssessments[i].role_id == 3
              ) {
                //this.codevidhyaAssessments.push(this.allAssessments[i]);
                this.asmntCategory[2].status = 1;
                this.asmntCategory[2].assessment.push(this.allAssessments[i]);
              }
              if (
                this.allAssessments[i].used_for == 0 &&
                this.allAssessments[i].sch_id == 0 &&
                this.allAssessments[i].book_id == 0 &&
                this.allAssessments[i].role_id == 2
              ) {
                // this.teacherAssessments.push(this.allAssessments[i]);
                this.asmntCategory[4].status = 1;
                this.asmntCategory[4].assessment.push(this.allAssessments[i]);
              }

              if (
                this.allAssessments[i].used_for == 0 &&
                this.allAssessments[i].sch_id == sch_id &&
                this.allAssessments[i].book_id == 0
              ) {
                //this.schoolAssessments.push(this.allAssessments[i]);
                this.asmntCategory[5].status = 1;
                this.asmntCategory[5].assessment.push(this.allAssessments[i]);
              }
            }
          }
        });
    },

    assessment_detail: function() {
      if (this.assessment_id == 0) {
        return false;
      }
      this.$http
        .post("/api/user/Assessment_detail", {
          sch_id: this.sch_id,
          assessment_id: this.assessment_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.assessment_det = res.body.assessment_det;
          }
        });
    },
    assessments_students: function(sch_id, asmnt_id) {
      if (this.asmntType == 2) {
        this.cls_id = 0;
      }
      this.$http
        .post("/api/user/Assessment_students", {
          sch_id: sch_id,
          assessment_id: asmnt_id,
          cls_id: this.cls_id,
          asmntType: this.asmntType
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.students = res.body.students;
            this.st_count = 0;
            for (var i = 0; i < this.students.length; i++) {
              if (this.students[i].exam_status == 0) {
                this.st_count += 1;
              }
            }
          }
        });
    },
    check_assessment: function(user_id) {
      var det = btoa(
        this.report_asmnt_id +
          "," +
          user_id +
          "," +
          this.report_sch_id +
          "," +
          this.asmntType
      );
      var routeData = this.$router.resolve({
        name: "admincheckassessment",
        query: { assessment: det }
      });

      window.open(routeData.href, "_blank");
      /*this.$router.push({
              name: "admincheckassessment",
              query: { assessment: det }
            });*/
    },
    view_report: function(user_id) {
      var det = btoa(
        this.report_asmnt_id +
          "," +
          user_id +
          "," +
          0 +
          "," +
          this.report_sch_id
      );
      var routeData = this.$router.resolve({
        path: "/assessments/view-report",
        query: { assessment: det }
      });
      window.open(routeData.href, "_blank");
      //this.$router.push({path: '/ad-assessments/ad-student-report', query: {assessment:det}});
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
                assessment_id: vm.asmnt_id,
                clear_type: clr_type
              })
              .then(function(res) {
                if (res.body.status == "403") {
                  //this.$router.push('/login');
                } else {
                  cvNotify("Student record successfully cleared.", "success");
                  vm.assessments_students();
                }
              });
          }
        },
        positiveButton: "Reset",
        positiveButtonClass: "negative"
      });
    },

    downloadCertificate: function(userData) {
      var doc = new jsPDF("landscape", "px", "a4", true);
      var width = doc.internal.pageSize.width;
      var height = doc.internal.pageSize.height;
      var grade =
        (userData.score * 100) / userData.tot_marks >= 90
          ? "A+"
          : (userData.score * 100) / userData.tot_marks >= 75
          ? "A"
          : (userData.score * 100) / userData.tot_marks >= 60
          ? "B"
          : (userData.score * 100) / userData.tot_marks >= 36
          ? "C"
          : "Fail";

      if (grade == "Fail") {
        cvNotify("User scored less than 36 percent.", "Warning");
        return false;
      }

      var sch_session = this.$moment(userData.result_date)
        .subtract("year", 1)
        .format("YYYY");
      var sch_session1 = this.$moment(userData.result_date).format("YY");
      doc.addImage(
        document.querySelector("#certificate"),
        "JPEG",
        0,
        0,
        width,
        height
      );
      doc.setFont("times");
      doc.setFontType("italic");
      doc.setTextColor("#000000");
      doc.setFontSize(20);
      doc.text(userData.name, width / 2 + 60, 195, null, null, "center");
      doc.text(userData.school_name, width / 2, 218, null, null, "center");
      doc.text(
        userData.assessment_name,
        width / 2 - 110,
        261,
        null,
        null,
        "center"
      );
      doc.text("2019-20", width / 2 - 125, 283, null, null, "center");
      doc.text(grade, width / 2 + 135, 283, null, null, "center");
      doc.text(
        this.$moment(userData.result_date).format("DD/MM/YYYY"),
        width / 2 - 190,
        383,
        null,
        null,
        "center"
      );
      doc.save("Certificate.pdf");
    },
    shareAssessment: function() {
      if (!this.shareAssessmentId) {
        return false;
      }
      var det = btoa(this.shareAssessmentId + "," + this.alertOn);
      window.open(
        "https://www.facebook.com/sharer/sharer.php?u=" +
          encodeURIComponent(
            window.location.hostname +
              "/shareAssessment?assessment=" +
              det +
              "&src=sdkpreparse"
          )
      );
      hideModal("alertOnModal");
    }
  },
  updated() {
    initCvTablayouts();
  },
  mounted: function() {
    initCvTablayouts();
    var vm = this;
    document
      .getElementById("uploadfile-input")
      .addEventListener("change", function(e) {
        var fileName = "";
        if (this.files && this.files.length > 1)
          fileName = (this.getAttribute("data-multiple-caption") || "").replace(
            "{count}",
            this.files.length
          );
        else fileName = e.target.value.split("\\").pop();
        if (fileName) $("#filename-input").text(fileName);
      });
  }
};
</script>

<style lang="scss">
.errorclass {
  border: solid 1px red;
}

.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.drag-btn {
  border: 2px dashed #58d68d;
  color: gray;
  background-color: #d5f5e3;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
  height: 50px;
}

.drag-file1 {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  height: 50px;
}

.file-upload-form,
.image-preview {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

img.preview {
  width: 130px;
  height: 100px;
  background-color: white;
  border: 2px solid #58d68d;
  padding: 2px;
}

a {
  text-decoration: none;
  color: #000;
}

.srch_btn {
  background: #ccc;
  font-size: 17px;
  border: none;
  cursor: pointer;
  width: auto;
}

/*Quiz design copied */

#assessment-admin-root {
  #main {
    padding-left: 24px;
    padding-right: 24px;
  }
}

#assessments-and-questions-tabs {
  width: 100%;
  margin: 16px 24px;
  & > .tabs {
    align-items: center;
    div {
      min-width: 140px;
      font-family: "Rubik", sans-serif;
      &:first-of-type {
        border-top-left-radius: 8px;
      }
    }
    i {
      visibility: hidden;
    }
    button {
      height: 32px;
      margin-right: 8px;
      padding: 8px;
      line-height: 1;
      background: rgb(19, 192, 71);
    }
  }
}

#assessments-tablayout,
#que-pool-tablayout {
  .tabs {
    padding: 8px;
    background: rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    div {
      min-width: 140px;
      margin-right: 8px;
      padding: 8px;
      border-radius: 8px;
      font-family: "Rubik", sans-serif;
      &.active {
        background: rgb(0, 120, 230);
        color: #fff;
      }
    }
  }
}

#assessments-tablayout {
  .content {
    & > div {
      display: flex;
      flex-direction: row;
      padding: 24px;
      .subject-tag {
        margin-left: 24px;
        padding: 4px 8px;
        background: rgb(4, 146, 23);
        border-radius: 4px;
        font: normal 12px/1 "Rubik";
        color: #fff;
      }
      p {
        margin: 0;
      }
      .spacer {
        padding-right: 24px;
      }
      & > div:last-of-type {
        display: flex;
        flex-direction: column;
        button:first-of-type {
          margin-bottom: 8px;
        }
      }
    }
  }
}

.searchadd-a {
  padding: 16px 32px;
}

.quediv-a {
  padding: 8px;
  margin: 4px;
  background: rgba(0, 0, 0, 0.05);
}

.quedivinner-a {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.small-abutton {
  width: auto;
  margin: 0;
  padding: 4px 12px;
  background: #fff;
  border-radius: 24px;
  color: #7700ff;
  font: normal 1rem/1 "Rubik";
  border: thin solid #7700ff;
}

.small-abutton:hover {
  border-color: #fff;
  background: #7700ff;
  cursor: pointer;
  color: #fff;
}

/*ankit design */

.mbody-a {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 8px 8px;
  border-radius: 8px;
}

.modaltopic-a {
  min-width: 140px;
  padding: 8px;
  border-radius: 8px;
  background: rgb(0, 120, 230);
  color: #fff;
  text-align: center;
}

.modal-row-a {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 50px;
  padding: 8px;
}

.subtype-a {
  input[type="radio"] {
    height: auto;
    margin: 8px 8px 0px 18px;
    width: 16px;
    height: 16px;
  }
}

.modal-left-right {
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 370px;
  border-radius: 12px;
  padding: 8px;
  background: rgb(217, 232, 251);
  justify-content: flex-start;
}

.modal-left-row1 {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: row;
  padding: 8px 8px;
  background: rgb(30, 150, 255);
  border-radius: 8px;
  color: #fff;
  p,
  label {
    margin: 0;
    line-height: 1;
    font-family: "Rubik", sans-serif;
    font-size: 16px;
  }
  input[type="button"] {
    border-radius: 20px;
    font-family: "Rubik", sans-serif;
    background: #fff;
    padding: 0px 12px;
    height: 32px;
    line-height: 1.5;
    &:hover {
      background: rgb(67, 203, 254);
      color: #fff;
      border: none;
    }
  }
}

.modal-left-row2 {
  padding: 12px 8px;
  font-family: "Rubik", sans-serif;
  span {
    font-size: 16px;
    margin-right: 8px;
  }
  label {
    margin: 0;
    line-height: 1;
    font-family: "Rubik", sans-serif;
    font-size: 16px;
  }
  input[type="radio"] {
    height: auto;
    margin: 0 4px 0 24px;
  }
}

.modal-right-row2 {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  overflow: auto;
  word-break: break-word;
  background: #fff;
  margin-top: 8px;
}

.modal-right-row2 > div {
  padding: 8px;
  width: 100%;
}

.uimage-a {
  font-size: 16px;
  margin-right: 12px;
  font-family: "Rubik", sans-serif;
}

.checkbox-a {
  height: auto;
  margin: 0 16px 0 8px;
  line-height: 1;
  font-family: "Rubik", sans-serif;
  font-size: 16px;
  input {
    height: 16px;
    margin-right: 8px;
    width: 16px;
  }
  label {
    margin: 0px;
  }
}

.input-valid {
  border: thin solid #e74c3c;
}
</style>
