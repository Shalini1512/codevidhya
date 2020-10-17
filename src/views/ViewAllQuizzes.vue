<template>
  <div>
    <Header>
      <HeaderContent />
    </Header>
    <Category
      v-if="quizzes"
      :subjects="subjects"
      :userId="userId"
      :sch_id="sch_id"
      :quizzes="quizzes"
      :sch_quizzess="sch_quizzess"
      :review_all="review_all"
      :quiz_reviews="quiz_reviews"
      :show_performace="show_performace"
    >
      <TopScorer :top_users="top_users" />
    </Category>
    <Footer />
  </div>
</template>
<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/quizzes/HeaderContent.vue";
import Category from "@/components/quizzes/Category.vue";
import Footer from "@/components/footer/Footer.vue";
import TopScorer from "@/components/quizzes/TopScorer.vue";
import axios from "axios";
export default {
  name: "viewAllQuizzes",
  components: {
    Header,
    HeaderContent,
    Category,
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
      review_all: 0,
      show_performace:false
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
        .post("/api/user/display_all_sub_quizzes", {
          user_id: userId
        })
        .then(res => {
          this.quizzes = res.data.data;
          //console.log(this.quizzes);
          const ind = this.quizzes.findIndex(x=>x.total_quiz_attempt>0)
         if(ind==-1)  
         this.show_performace=false
         else
         this.show_performace=true;
        });
      axios
        .post("/api/user/display_all_school_sub_quizzess", { user_id: userId })
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
