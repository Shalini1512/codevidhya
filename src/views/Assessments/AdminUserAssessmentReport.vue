<template>
  <div class="container-fluid">
    <div
      class="container col-sm-12 bg-info"
      id="test_div"
      style="border:#999999;"
    >
      <div class="row">
        <div class="col-sm-4"></div>
        <div class="col-sm-4 text-center text-white">
          <h3>
            Assessment {{ new Date() | moment("YYYY") }} -{{
              new Date() | moment("add", "1 year").format("YY")
            }}
          </h3>
          <h4>{{ sch_name }}</h4>
          <h5>{{ asmnt_name }} Report</h5>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <table
          class="table table-hover  text-center"
          id="st_detail"
          style="text-transform:uppercase;"
        >
          <tr>
            <th class="th  text-center">Name</th>
            <th class="th  text-center">Class</th>
            <th class="th text-center">Section</th>
            <th class="th  text-center">Generated On:</th>
          </tr>
          <tr>
            <td>{{ st_name }}</td>
            <td>{{ cls_name }}</td>
            <td>{{ sec_name }}</td>
            <td>{{ new Date() | moment("Do MMMM  YYYY") }}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="col-sm-12">
      <div class="row heading bg-info">Your Score</div>
      <table class="table">
        <thead>
          <tr>
            <th>Assessment Name</th>
            <th>Obtained marks</th>
            <th>Rank in Section</th>
            <th>Rank in Class</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ asmnt_name }}</td>
            <td>
              <span
                style="width:70px; height:70px; border-radius:25px 25px; padding:3px 3px; background:#08CA73; color:#FFFFFF;"
                >{{ obtained_marks }}</span
              >
              marks out of
              <span
                class="red_cir"
                style="width:70px; height:70px; border-radius:25px 25px; padding:3px 3px; background:#EC7063; color:#FFFFFF;"
                >{{ asmnt_tot_marks }}</span
              >
            </td>
            <td>
              <span
                style="width:70px; height:70px; border-radius:25px 25px; padding:3px 3px; background:#08CA73; color:#FFFFFF;"
                >{{ sec_rank }}</span
              >
              rank in section out of
              <span
                class="red_cir"
                style="width:70px; height:70px; border-radius:25px 25px; padding:3px 3px; background:#EC7063; color:#FFFFFF;"
                >{{ tot_sec_st }}</span
              >
              students.
            </td>
            <td>
              <span
                style="width:70px; height:70px; border-radius:25px 25px; padding:3px 3px; background:#08CA73; color:#FFFFFF;"
                >{{ cls_rank }}</span
              >
              rank in grade out of
              <span
                class="red_cir"
                style="width:70px; height:70px; border-radius:25px 25px; padding:3px 3px; background:#EC7063; color:#FFFFFF;"
                >{{ tot_cls_st }}</span
              >
              students.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="col-sm-12">
      <div class="row heading bg-info">Sectional Marks</div>
      <table class="table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Max Marks</th>
            <th>Obtained marks</th>
            <th>Average marks</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="marks in students_marks">
            <td>{{ marks.sub_name }}</td>
            <td>{{ marks.max_marks }}</td>
            <td>{{ marks.obtain_marks }}</td>
            <td>{{ marks.avg_marks }}</td>
          </tr>
        </tbody>
      </table>
      <div class="container-fliud" id="st_chart" style="height:600px;">
        <GChart type="ColumnChart" :data="chartData" :options="chartOptions" />
      </div>
    </div>

    <div class="col-sm-12">
      <div class="row heading bg-info p-3">Disclaimer</div>
      This is a confidential report, to be read by student and his/her parents
      only. It is a computer generated report based on the performance of the
      students in the assessment. It is for academic purpose only and should not
      be used to judge the capability of the student.
    </div>
    <div class="col-sm-12 p-4" style="text-align:center">
      <input
        type="button"
        class="btn btn-primary"
        value="Back"
        v-on:click="back_to_home()"
      />
    </div>
  </div>
</template>

<script>
import { GChart } from "vue-google-charts";
import moment from "vue-moment";
export default {
  components: {
    GChart
  },

  data() {
    return {
      sch_session: "",
      gen_date: "",
      st_id: "",
      st_name: "",
      user_id: "",
      role_id: "",
      sch_id: "",
      sch_name: "",
      name: "",
      token: "",
      cls_id: "",
      cls_name: "",
      sec_id: "",
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
      chartData: [["Subject", "Obtain Marks", "Average Marks"]],
      chartOptions: {
        colors: ["silver", "blue"],
        height: 600,
        hAxis: { title: "Subjects - Obtained marks" },

        chart: {
          title: "Sectional Marks"
        }
      }
    };
  },
  beforeCreate() {},
  created() {
    if (this.$route.query.assessment_id) {
      this.asmnt_id = this.$route.query.assessment_id;
      this.st_id = this.$route.query.st_id;
      this.sch_id = this.$route.query.sch_id;
      this.cls_id = this.$route.query.cls_id;
      this.students = this.$route.query.students;
      this.$router.push("/AD-Assessments/AD-Report");
      for (var i = 0; i < this.students.length; i++) {
        if (this.students[i].user_id == this.st_id) {
          this.st_name = this.students[i].name;
          this.cls_name = this.students[i].cls_name;
          this.sec_name = this.students[i].sec_name;
          this.sec_id = this.students[i].sec_id;
          break;
        }
      }
      this.gen_date = this.$moment().format("DD-MM-YYYY ");
    }
  },
  beforeMount() {
    this.token = this.$cookies.get("token");
    if (!this.token) {
      this.$router.push("login");
    } else {
      this.displayuser();
    }
  },
  methods: {
    displayuser: function() {
      this.$http.post("/api/user/DisplayUser", { token: this.token }).then(
        function(res) {
          if (res.body.status == "403") {
            this.$router.push("/login");
          } else {
            // this.name=res.body.data.user.name;
            // this.role_id=res.body.data.user.role_id;
            //this.sch_id=res.body.data.user.sch_id;
            //this.user_id=res.body.data.user.user_id;
            this.sch_name = res.body.data.user.sch_name;
            this.load_assessments();
            this.generate_report();
          }
        },
        function(res) {
          this.$router.push("/login");
        }
      );
    },

    back_to_home: function() {
      this.$router.push({
        path: "/AD-Assessments/AD-Check-Assessment",
        query: {
          assessment_id: this.asmnt_id,
          cls_id: this.cls_id,
          sch_id: this.sch_id
        }
      });
    },
    load_assessments: function() {
      this.$http
        .post("/api/user/DisplayAssessment", {
          token: this.token,
          sch_id: this.sch_id,
          user_id: this.user_id,
          role_id: this.role_id
        })
        .then(
          function(res) {
            if (res.body.status == "403") {
              this.$router.push("/login");
            } else {
              this.assessments = res.body.assessments;

              for (var i = 0; i < this.assessments.length; i++) {
                if (this.assessments[i].assessment_id == this.asmnt_id) {
                  this.asmnt_tot_que = this.assessments[i].tot_que;
                  this.asmnt_tot_marks = this.assessments[i].tot_marks;
                  this.asmnt_name = this.assessments[i].assessment_name;
                  this.asmnt_date = this.assessments[i].date;
                  break;
                }
              }
            }
          },
          function(res) {
            this.$router.push("/login");
          }
        );
    },
    generate_report: function() {
      this.$http
        .post("/api/user/Assessment_result", {
          user_id: this.st_id,
          assessment_id: this.asmnt_id,
          cls_id: this.cls_id,
          sec_id: this.sec_id,
          sch_id: this.sch_id
        })
        .then(
          function(res) {
            if (res.body.status == "403") {
              this.$router.push("/login");
            } else {
              if (res.body.data == "done") {
                this.get_marks();
              }
            }
          },
          function(res) {
            this.$router.push("/login");
          }
        );
    },

    get_marks: function() {
      this.$http
        .post("/api/user/Get_assessment_marks", {
          user_id: this.st_id,
          assessment_id: this.asmnt_id,
          cls_id: this.cls_id,
          sch_id: this.sch_id,
          sec_id: this.sec_id
        })
        .then(
          function(res) {
            if (res.body.status == "403") {
              this.$router.push("/login");
            } else {
              this.students_marks = res.body.students_marks;
              for (var i = 0; i < this.students_marks.length; i++) {
                this.chartData.push([
                  this.students_marks[i].sub_name,
                  this.students_marks[i].obtain_marks,
                  this.students_marks[i].avg_marks
                ]);
              }
              this.obtained_marks = res.body.students_score[0].score;
              this.cls_rank = res.body.students_score[0].cls_rank;
              this.sec_rank = res.body.students_score[0].sec_rank;
              this.tot_cls_st = res.body.students_score[0].tot_cls_st;
              this.tot_sec_st = res.body.students_score[0].tot_sec_st;
            }
          },
          function(res) {
            this.$router.push("/login");
          }
        );
    }
  }
};
</script>

<style></style>
