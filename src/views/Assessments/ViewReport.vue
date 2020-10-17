<template>
  <div class="container-fluid p-0 m-0">
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
                    <!--  <a href="" class="typewrite" data-period="2000" data-type='[ "Code to Decode your Future" ]'>
                        <span class="wrap"></span>
                </a>-->
                    <h1>Assessment {{ schSession }}</h1>
                    <p>
                      {{ sch_name }}
                    </p>
                  </div>
                </div>
                <!--<div class="btn-list col-md-6 row justify-content-end">
              <button class="btn btn-secondary" @click="onCreateNewClick()">
                <i class="fas fa-plus"></i>
                Create new
              </button>
            </div>-->
              </div>
            </div>
          </div>
          <!-- /header-text -->
        </div>
      </section>
    </Header>
    <!--<div class="col-sm-12" id="stChart" style="height:600px" >
        <GChart id="gchart" type="ColumnChart" :data="chartData" :options="chartOptions"/>
      </div>-->
    <div class="row" id="test_div">
      <div class="col-sm-4">
        <img
          id="brand_logo"
          src="/assets/images/png/codevidhya_logo.png"
          style="display:none;"
        />
      </div>
      <!--<div class="col-sm-4 text-center text-white">
        <h2 class="mb-1">Assessment {{ schSession }}</h2>
        <h3 class="mb-1">{{ sch_name }}</h3>
        <h4 class="mb-1">{{ asmnt_name }} Report</h4>
      </div>-->
      <div class="col-sm-4">
        <img
          id="sch_logo"
          :src="'../static/school_logo/' + sch_logo"
          style="display:none;"
        />
      </div>
    </div>
    <div class="container-fluid p-4">
      <div class="card">
        <div class="card-body">
          <div class="row mt-1">
            <div class="col-sm-12 bg-secondary p-2 text-white">
              <h4 class="pl-2">Your Detail</h4>
            </div>
            <div class="col-sm-12 p-0">
              <table
                class="table table-hover table-bordered"
                id="stDetail"
                style="text-transform:uppercase;"
              >
                <thead>
                  <tr>
                    <th>
                      <strong>Name</strong>
                    </th>
                    <th>
                      <strong>Grade</strong>
                    </th>
                    <th>
                      <strong>Section</strong>
                    </th>
                    <th>
                      <strong>Generated On</strong>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ st_name }}</td>
                    <td>{{ cls_name }}</td>
                    <td>{{ sec_name }}</td>
                    <td>{{ new Date() | moment("LL") }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 bg-secondary p-2 text-white">
              <h4 class="pl-2">Your Score</h4>
            </div>
            <table class="table table-hover table-bordered" id="your_score">
              <thead>
                <tr>
                  <th>
                    <strong>Assessment Name</strong>
                  </th>
                  <th>
                    <strong>Obtained marks</strong>
                  </th>
                  <th>
                    <strong>Rank in Section</strong>
                  </th>
                  <th>
                    <strong>Rank in Grade</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style="font-size:16px">
                  <td>{{ asmnt_name }}</td>
                  <td>
                    <span class="badge badge-success">
                      {{ obtained_marks }}
                    </span>
                    marks out of
                    <span class="badge badge-primary">
                      {{ asmnt_tot_marks }}
                    </span>
                  </td>
                  <td>
                    <span class="badge badge-success">{{ sec_rank }}</span> rank
                    in section out of
                    <span class="badge badge-primary">{{ tot_sec_st }}</span>
                    students.
                  </td>
                  <td>
                    <span class="badge badge-success">{{ cls_rank }}</span> rank
                    in grade out of
                    <span class="badge badge-primary">{{ tot_cls_st }}</span>
                    students.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="row">
            <div class="col-sm-12 bg-secondary p-2 text-white">
              <h4 class="pl-2">Sectional Marks</h4>
            </div>
            <table class="table table-hover table-bordered" id="your_marks">
              <thead>
                <tr>
                  <th>
                    <strong>Subject</strong>
                  </th>
                  <th>
                    <strong>Max Marks</strong>
                  </th>
                  <th>
                    <strong>Obtained marks</strong>
                  </th>
                  <th>
                    <strong>Average marks</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(marks, index) in students_marks">
                  <tr :key="index" style="font-size:16px">
                    <td>{{ marks.sub_name }}</td>
                    <td>{{ marks.max_marks }}</td>
                    <td>{{ marks.obtain_marks }}</td>
                    <td>{{ marks.avg_marks }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <div class="row">
            <div class="col-sm-12 bg-secondary p-2 text-white">
              <h4 class="pl-2">Obtain Marks Chart</h4>
            </div>
            <div class="col-sm-12" id="st_chart" style="height:600px">
              <GChart
                id="gchart"
                type="ColumnChart"
                :data="chartData"
                :options="chartOptions"
              />
            </div>
          </div>
          <div class="row" id="disclaimer">
            <div class="col-sm-12 bg-secondary p-2 text-white">
              <h4 class="pl-2">Disclaimer</h4>
            </div>
            <div class="col-sm-12" style="font-size:16px;">
              This is a confidential report, to be read by student and his/her
              parents only. It is a computer generated report based on the
              performance of the students in the assessment. It is for academic
              purpose only and should not be used to judge the capability of the
              student.
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 p-4" style="text-align:center">
              <button
                type="button"
                class="btn btn-primary mr-2"
                v-on:click="back_to_home()"
              >
                Back to Home
              </button>
              <button
                type="button"
                class="btn btn-success"
                v-on:click="genpdf()"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

   
  </div>
</template>

<script>
import { GChart } from "vue-google-charts";
import moment from "vue-moment";
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";


//import html2canvas from "html2canvas";
export default {
  components: {
    GChart,
    Header
  },
  data() {
    return {
      sch_session: "",
      gen_date: "",
      cls_id: this.$store.getters.getAuthData.auth_cls_id,
      user_id: this.$store.getters.getAuthData.auth_user_id,
      sec_id: this.$store.getters.getAuthData.auth_sec_id,
      role_id: this.$store.getters.getAuthData.auth_role_id,
      sch_id: this.$store.getters.getAuthData.auth_sch_id,
      st_id: "",
      st_name: this.$store.getters.getAuthData.auth_user_full_name,
      sch_name: this.$store.getters.getAuthData.auth_sch_name,
      sch_logo: this.$store.getters.getAuthData.auth_sch_logo,
      name: "",
      token: "",
      cls_name: "",
      sec_name: "",
      asmnt_id: "",
      asmnt_name: "",
      asmnt_date: "",
      asmnt_tot_que: "",
      asmnt_tot_marks: "",
      assessments: [],
      classes: [],
      students: [],
      st_tot_marks: 0,
      students_detail: [],
      obtained_marks: 0,
      que: [],
      students_marks: [],
      cls_rank: 0,
      sec_rank: 0,
      tot_cls_st: 0,
      tot_sec_st: 0,
      // Array will be automatically processed with visualization.arrayToDataTable function
      chartData: [["Subject", "Obtain Marks", "Max Marks"]],
      chartOptions: {
        height: 600,
        colors: ["silver", "blue"],
        hAxis: { title: "Subjects - Obtained marks" },
        vAxis: { gridlines: { count: 10 } },
        bar: { groupWidth: "50%" },

        chart: {
          title: "Sectional Marks"
        }
      },
      chartCanvas: "",
      schSession:
        this.$moment(new Date()).format("YYYY") +
        " - " +
        this.$moment(new Date())
          .add(1, "year")
          .format("YY")
    };
  },
  beforeCreate() {},
  created() {
    this.gen_date = this.$moment().format("DD/MM/YYYY ");
  },
  beforeMount() {},
  mounted: function() {
    var vm = this;
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.cls_id = this.$store.getters.getAuthData.auth_cls_id;
          this.user_id = this.$store.getters.getAuthData.auth_user_id;
          this.sec_id = this.$store.getters.getAuthData.auth_sec_id;
          this.role_id = this.$store.getters.getAuthData.auth_role_id;
          this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
          this.st_name = this.$store.getters.getAuthData.auth_user_full_name;
          this.sch_name = this.$store.getters.getAuthData.auth_sch_name;
          this.sch_logo = this.$store.getters.getAuthData.auth_sch_logo;
          if (this.role_id == 3) {
            this.load_assessments();
          }

          if (this.$route.query.assessment) {
            var query = atob(this.$route.query.assessment);
            var params = query.split(",");

            this.asmnt_id = params[0];
            this.st_id = params[1];
            this.cls_id = params[2];
            this.load_assessments();
            this.assessment_students();
          }

          //this.assessment_students();
        }
      }.bind(this)
    );
  },
  updated: function() {
    var vm = this;
    html2canvas(document.querySelector("#st_chart")).then(function(canvas) {
      vm.chartCanvas = canvas;
    });
  },
  methods: {
    assessment_students: function() {
      this.$http
        .post("/api/user/Assessment_students", {
          sch_id: this.$store.getters.getAuthData.auth_sch_id,
          assessment_id: this.asmnt_id,
          cls_id: this.cls_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.students = res.body.students;
            for (var i = 0; i < this.students.length; i++) {
              if (this.students[i].user_id == this.st_id) {
                this.st_name = this.students[i].name;
                this.cls_name = this.students[i].cls_name;
                this.sec_name = this.students[i].sec_name;
                this.sec_id = this.students[i].sec_id;
                this.get_marks();
                break;
              }
            }
          }
        });
    },

    back_to_home: function() {
      this.$router.push({ path: "/assessments/" });
    },
    load_assessments: function() {
      this.$http
        .post("/api/user/DisplayAssessment", {
          cls_id: this.cls_id,
          sch_id: this.$store.getters.getAuthData.auth_sch_id,
          user_id: this.user_id,
          role_id: this.$store.getters.getAuthData.auth_role_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            if (this.role_id == 1 || this.role_id == 2) {
              //this.assessments = res.body.assessments;
              this.assessments = res.body.assessments.concat(
                res.body.cv_assessments
              );
            } else if (this.role_id == 3) {
              this.assessments = res.body.data;
            }

            for (var i = 0; i < this.assessments.length; i++) {
              if (this.assessments[i].assessment_id == this.asmnt_id) {
                this.asmnt_tot_que = this.assessments[i].tot_que;
                this.asmnt_tot_marks = this.assessments[i].tot_marks;
                this.asmnt_name = this.assessments[i].assessment_name;
                this.asmnt_date = this.$moment(this.assessments[i].date).format(
                  "DD/MM/YYYY"
                );
                break;
              }
            }
          }
        });
    },
    get_marks: function() {
      this.$http
        .post("/api/user/Get_assessment_marks", {
          user_id: this.st_id,
          assessment_id: this.asmnt_id,
          cls_id: this.cls_id,
          sch_id: this.$store.getters.getAuthData.auth_sch_id,
          sec_id: this.sec_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.students_marks = res.body.students_marks;
            for (var i = 0; i < this.students_marks.length; i++) {
              this.chartData.push([
                this.students_marks[i].sub_name,
                this.students_marks[i].obtain_marks,
                this.students_marks[i].max_marks
              ]);
            }
            this.chartData.push(["", 0, 0]);
            this.obtained_marks = res.body.students_score[0].score;
            this.cls_rank = res.body.students_score[0].cls_rank;
            this.sec_rank = res.body.students_score[0].sec_rank;
            this.tot_cls_st = res.body.students_score[0].tot_cls_st;
            this.tot_sec_st = res.body.students_score[0].tot_sec_st;
          }
        });
    },
    genpdf: function() {
      var vm = this;
      var doc = new jsPDF("p", "px", "a4", true);

      var width = doc.internal.pageSize.width;
      var height = doc.internal.pageSize.height;
      var sch_session = this.$moment(new Date()).format("YYYY");
      var sch_session1 = this.$moment(new Date())
        .add("year", 1)
        .format("YY");
      var columns = [
        { title: "Subject", dataKey: "sub_name" },
        { title: "Max Marks", dataKey: "max_marks" },
        { title: "Obtained Marks", dataKey: "obtain_marks" },
        { title: "Average Marks", dataKey: "avg_marks" }
      ];

      /*html2canvas(document.querySelector("#stChart")).then(function(canvas) {
        var link = document.createElement("a");
        document.body.appendChild(link);
        link.download = "html_image.png";
        link.href = canvas.toDataURL("image/png");
        
          doc.save('Certificate.pdf');
        link.target = '_blank';
        link.click();

      });*/
      var can = document.querySelector("#sch_logo");
      /* doc.addImage(document.querySelector("#sch_logo"), "JPEG", 30, 10, 80, 30);
      doc.addImage(
        document.querySelector("#brand_logo"),
        "JPEG",
        height - 295,
        10,
        80,
        25
      );*/
      doc.setTextColor("#2471A3");
      doc.setFontSize(20);
      doc.text(
        this.asmnt_name + " " + sch_session + "-" + sch_session1,
        width / 2,
        70,
        null,
        null,
        "center"
      );
      doc.setFontSize(5);
      var res1 = doc.autoTableHtmlToJson(document.getElementById("stDetail"));
      doc.autoTable(res1.columns, res1.data, {
        margin: { top: 95 },
        styles: { fontSize: 8 }
      });
      var res2 = doc.autoTableHtmlToJson(document.getElementById("your_score"));
      doc.autoTable(res2.columns, res2.data, {
        margin: { top: 140 },
        styles: { fontSize: 8 }
      });
      doc.autoTable(columns, this.students_marks, {
        margin: { top: 190 },
        styles: { fontSize: 8 }
      });
      doc.addImage(
        this.chartCanvas.toDataURL("image/png"),
        "png",
        5,
        260,
        width,
        200,
        "center"
      );
      doc.text(
        "Generated on: " + this.$moment().format("DD/MM/YYYY"),
        30,
        doc.internal.pageSize.height - 10
      );
      doc.setTextColor("#2471A3");
      doc.setFontSize(12);
      doc.text("Disclaimer", 30, 482);
      doc.fromHTML($("#disclaimer")[0], 30, 480, { width: width - 60 });
      doc.setFontSize(8);
      doc.save("Assessment Report.pdf");
      /*html2canvas(document.querySelector("#stChart")).then(function(canvas) {
        doc.addImage(canvas.toDataURL("image/png"),'png', 30, 10, width, 200, 'center');
        //doc.save("Assessment Report.pdf");
      });*/
      /*html2canvas(document.querySelector('#st_chart')).then(canvas => {
       var imgData = canvas.toDataURL('image/JPEG'); 
        doc.addImage(imgData,'JPEG', 5, 20, width, 200, 'center');
        doc.setTextColor("#2471A3");
        doc.setFontSize(12);
        doc.text("Disclaimer", 30, 480);
        doc.fromHTML($("#disclaimer")[0], 30, 476, { width: width - 60 });
        doc.setFontSize(8);
        doc.save("Assessment Report.pdf");
		  });*/
      /*html2canvas(document.querySelector("#st_chart")).then(function(canvas) {
        doc.addImage(canvas, "PNG", 5, 10, width, 200, "center");
        doc.setTextColor("#2471A3");
        doc.setFontSize(12);
        doc.text("Disclaimer", 30, 250);
        doc.fromHTML($("#disclaimer")[0], 30, 476, { width: width - 60 });
        doc.setFontSize(8);
        doc.save("Assessment Report.pdf");
      });*/
    }
  }
};
</script>

<style></style>
