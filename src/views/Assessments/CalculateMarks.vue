<template>
  <div
    class="container-fluid"
    style="display:flex; flex-direction:column;height:100%;"
  >
    <blockingLoader v-if="calculateProcess" />
  </div>
</template>

<script>
import moment from "vue-moment";
import blockingLoader from "@/components/widgets/BlockingLoader.vue";
export default {
  components: { blockingLoader },
  data() {
    return {
      st_id: "",
      st_name: "",
      user_id: "",
      role_id: "",
      sch_id: "",
      name: "",
      cls_id: "",
      cls_name: "",
      sec_id: "",
      sec_name: "",
      asmnt_id: "",
      asmnt_name: "",
      asmnt_tot_que: "",
      asmnt_tot_marks: "",
      assessments: [],
      classes: [],
      students: [],
      st_tot_marks: 0,
      students_detail: [],
      student_obtained: [],
      que: [],
      calculateProcess: true
    };
  },
  beforeCreate() {},
  created() {
    if (this.$route.query.assessment) {
      var query = atob(this.$route.query.assessment);
      var params = query.split(",");
      this.asmnt_id = params[0];
    }
  },
  beforeMount() {},
  methods: {
    back_to_home: function() {
      //this.$router.push({path: '/Assessments/Check-Assessment',query: {}});
    },
    students_assessment_detail: function() {
      this.$http
        .post("/api/user/Student_assessment_detail", {
          user_id: this.st_id,
          assessment_id: this.asmnt_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.students_detail = res.body.students_detail;
            for (var i = 0; i < this.students_detail.length; i++) {
              if (
                this.students_detail[i].st_ans ==
                  this.students_detail[i].true_ans &&
                this.students_detail[i].st_ans != ""
              ) {
                this.student_obtained.push({
                  user_id: this.st_id,
                  assessment_id: this.asmnt_id,
                  que_id: this.students_detail[i].que_id,
                  marks: this.students_detail[i].marks
                });
              } else {
                this.student_obtained.push({
                  user_id: this.st_id,
                  assessment_id: this.asmnt_id,
                  que_id: this.students_detail[i].que_id,
                  marks: 0
                });
              }
            }
            this.set_marks();
          }
        });
    },
    set_marks: function() {
      this.$http
        .post("/api/user/Assessment_marks", {
          user_id: this.st_id,
          assessment_id: this.asmnt_id,
          cls_id: this.cls_id,
          sch_id: this.sch_id,
          obtain_marks: this.student_obtained
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            if (res.body.data == "done") {
              this.calculate_result();
            }
          }
        });
    },

    calculate_result: function() {
      this.$http
        .post("/api/user/Assessment_result", {
          user_id: this.st_id,
          assessment_id: this.asmnt_id,
          cls_id: this.cls_id,
          sec_id: this.sec_id,
          sch_id: this.sch_id
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            if (res.body.data == "done") {
              //hidePreloader();
              this.calculateProcess = false;
              this.$router.push({ path: "/assessments/thankyou" });
            }
          }
        });
    }
  },
  mounted() {
    cvAuth.getUserId(
      function(userId) {
        this.user_id = this.userId;
        this.st_id = this.$store.getters.getAuthData.auth_user_id;
        this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
        this.cls_id = this.$store.getters.getAuthData.auth_cls_id;
        this.role_id = this.$store.getters.getAuthData.auth_role_id;
        this.sec_id = this.$store.getters.getAuthData.auth_sec_id;
        if (this.user_id != undefined || this.user_id != 0) {
          this.students_assessment_detail();
        }
      }.bind(this)
    );
  }
};
</script>
<style></style>
