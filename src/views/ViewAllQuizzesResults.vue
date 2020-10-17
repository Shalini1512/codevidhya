<template>
  <div>
    <Header>
      <HeaderContent />
    </Header>
    <CategoryResult
      :subjects="subjects"
      :userId="userId"
      :sch_id="sch_id"
      :quizzes="quizzes"
      :sch_quizzess="sch_quizzess"
      :review_all="review_all"
      :quiz_reviews="quiz_reviews"
    >
      <TopScorer :top_users="top_users" />
    </CategoryResult>
    <Footer />
  </div>
</template>
<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/quizzes/HeaderContent.vue";
import CategoryResult from "@/components/quizzes/CategoryResult.vue";
import Footer from "@/components/footer/Footer.vue";
import TopScorer from "@/components/quizzes/TopScorer.vue";
import axios from "axios";
import moment from "vue-moment";

export default {
  name: "ViewAllQuizzesResults",
  components: {
    Header,
    HeaderContent,
    CategoryResult,
    TopScorer,
    Footer
  },
  props: ["sub_id"],
  data() {
    return {
      quizzes: "",
      points: 0,
      subjects: "",
      sch_quizzess: "",
      ranks: "",
      rank: 0,
      top_users: "",
      userId: 0,
      sch_id: 0,
      review_all: ""
    };
  },
  mounted() {
    cvAuth.getUserId(
      function(userId) {
        this.userId = userId;
        this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
        this.getQuizQuestions(userId);
      }.bind(this)
    );
    window.scrollTo(0, 0);
  },
  methods: {
    quiz_reviews: function(quiz_id) {
      axios
        .post("/api/user/get_quiz_reviews", { quiz_id: quiz_id })
        .then(res => {
          this.review_all = res.data.data;
          showModal("quiz_reviews");
        });
    },
    getQuizQuestions: function(userId) {
      axios.post("/api/user/get_subject").then(res => {
        this.subjects = res.data.data;
      });
      axios
        .post("/api/user/display_overall_quiz_rank", {
          user_id: userId
        })
        .then(res => {
          this.quizzes = res.data.data;
        });
      axios
        .post("/api/user/display_overall_school_quiz_rank", { user_id: userId })
        .then(res => {
          this.sch_quizzess = res.data.data;
        });

      axios
        .post("/api/user/DisplayPoints", {
          user_id: userId
        })
        .then(res => {
          this.points = res.data.data[0].points;
        });
      axios.post("/api/user/display_top_quiz_st_name").then(res => {
        this.top_users = res.data.data;
      });
    }
  }
};
</script>
