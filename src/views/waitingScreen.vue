<template>
  <div id="waiting-screen">
    <Header />
    <div class="waiting-msg page page-h" v-if="shouldShowLoggedInState()">
      <div class="page-content z-index-10">
        <div class="container text-center">
          <h1
            class="h2 mb-3"
            v-if="closeTime <=0"
          >Your session was scheduled for {{date}} at {{time}} and is over now</h1>
          <h1 class="h2 mb-3" v-else-if="remainingTime<=0 && closeTime>=0">Your session is running.</h1>
          <h1
            class="h2 mb-3"
            v-else-if="recheduled"
          >Your session has been rescheduled for {{date}} at {{time}}</h1>
          <h1 class="h2 mb-3" v-else>Your class is scheduled for {{date}} at {{time}}</h1>

          <div id="timer" v-if="remainingTime > -3600">
            <h3 class="mb-3" v-if="remainingTime>=0">Come Back in</h3>
            <h3 class="mb-3" v-else-if="remaining<=0 && closeTime >=0">Your Session Is Running</h3>
            <h1 class="mb-3" v-if="remainingTime>=0">
              {{parseInt(remainingTime/3600)}}
              <span class="small-notation">Hrs</span>
              :
              {{parseInt((remainingTime%3600)/60) >= 10 ? parseInt((remainingTime%3600)/60) :'0'+ parseInt((remainingTime%3600)/60)}}
              <span
                class="small-notation"
              >Min</span>
              :
              {{parseInt(remainingTime%60)}}
              <span
                class="small-notation"
              >Sec</span>
            </h1>
          </div>
          <router-link to="/" class="btn btn-primary" style="margin-top: 50px">Back To Home</router-link>
        </div>
      </div>
    </div>
    <div class="waiting-msg page page-h" v-else>
      <div class="page-content z-index-10">
        <div class="container text-center">
          <h1 class="h2 mb-3">You Need to be Logged in to access live classes.</h1>
          <router-link
            to="/"
            class="btn btn-primary"
            id="backbutton"
            style="margin-top: 50px"
          >Back To Home</router-link>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import Footer from "@/components/footer/Footer.vue";
import AuthMixin from "@/mixins/AuthMixin.js";
import axios from "axios";

export default {
  components: {
    Header,
    Footer
  },
  mixins: [AuthMixin],
  data() {
    return {
      remainingTime: 0,
      recheduled: false,
      date: "",
      time: "",
      trainer_assigned_id: "",
      scheduleDate: "",
      escheduleDate: "",
      userId: 0,
      closeTime: 0
    };
  },
  created() {
    if (!this.shouldShowLoggedInState()) {
      window.open(encodeURI(`/login?redirect=${window.location}`), "_self");
    }
  },
  mounted() {
    cvAuth.getUserId(
      function(userId) {
        this.userId = userId;
        this.roleId = this.$store.getters.getAuthData.auth_role_id;
        this.id = new URL(window.location).searchParams.get("reqId");
        this.callClassStatus();
      }.bind(this)
    );

    const interval = setInterval(() => {
      this.remainingTime--;
      if (this.escheduleDate) {
        this.closeTime = parseInt(
          (this.escheduleDate.getTime() - Date.now()) / 1000
        );
      }

      if (this.remainingTime <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  },
  updated() {
    if (parseInt(this.remainingTime) / 60 <= 5 && parseInt(this.closeTime) >= 0)
      window.open(encodeURI(this.classLink), "_self");
  },
  methods: {
    callClassStatus() {
      axios
        .post("/api/liveCourse/getMyLiveClassDetails", {
          user_id: this.userId,
          req_id: this.id
        })
        .then(res => {
          if (res.data && res.data.length) {
            this.scheduleDate = new Date(res.data[0].date_s_time_slot);
            this.scheduleDate = this.scheduleDate.toLocaleString("en-US", {
              timeZone: "Asia/Kolkata"
            });
            this.scheduleDate = new Date(this.scheduleDate);
            this.scheduleDate.setMinutes(this.scheduleDate.getMinutes() - 330);
            this.scheduleDate = new Date(this.scheduleDate);
            this.classLink = res.data[0].class_link;
            this.recheduled = false;
            const monthNames = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sept",
              "Oct",
              "Nov",
              "Dec"
            ];
            this.time =
              this.scheduleDate.getHours() > 12
                ? `${this.scheduleDate.getHours() - 12}:${
                    this.scheduleDate.getMinutes() < 9
                      ? "0" + this.scheduleDate.getMinutes()
                      : this.scheduleDate.getMinutes()
                  } PM`
                : `${this.scheduleDate.getHours()}:${
                    this.scheduleDate.getMinutes() < 9
                      ? "0" + this.scheduleDate.getMinutes()
                      : this.scheduleDate.getMinutes()
                  } AM`;
            this.escheduleDate = new Date(res.data[0].date_e_time_slot);
            this.escheduleDate = this.escheduleDate.toLocaleString("en-US", {
              timeZone: "Asia/Kolkata"
            });
            this.escheduleDate = new Date(this.escheduleDate);
            this.escheduleDate.setMinutes(
              this.escheduleDate.getMinutes() - 330
            );
            this.escheduleDate = new Date(this.escheduleDate);
            this.date =
              this.scheduleDate.toDateString() ==
              new Date(Date.now()).toDateString()
                ? "Today"
                : `${this.scheduleDate.getDate()} ${
                    monthNames[this.scheduleDate.getMonth()]
                  } ${this.scheduleDate.getFullYear()}`;
            this.remainingTime = parseInt(
              (this.scheduleDate.getTime() - Date.now()) / 1000
            );
            this.closeTime = parseInt(
              (this.escheduleDate.getTime() - Date.now()) / 1000
            );

            /*if (
            parseInt(this.remainingTime) / 60 <= 5 &&
            parseInt(this.remainingTime) / 60 >= 5
          )
            window.open(encodeURI(this.classLink), "_self");*/
          } else {
            this.$router.push("/");
          }
        });
    }
  }
};
</script>

<style scoped>
#waiting-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.waiting-msg {
  background-color: #fff !important;
  color: #000 !important;
  min-height: 100%;
  height: 100%;
  flex-grow: 1;
  position: relative;
  padding-top: 59px;
}
.construction-image:before {
  position: absolute !important;
  top: 0;
  height: 100%;
}
.small-notation {
  font-size: 16px;
}
#timer {
  padding: 40px 0;
}
</style>
