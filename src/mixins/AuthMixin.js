import axios from "axios";

export default {
  data() {
    return {};
  },
  methods: {
    saveUserData(data) {
      var authData = this.$store.getters.getAuthData;
      authData.auth_user_full_name = data.name;
      authData.auth_role_id = data.role_id;
      authData.auth_cls_id = data.cls_id;
      authData.auth_sec_id = data.sec_id;
      authData.auth_sch_id = data.sch_id;
      authData.auth_user_id = data.user_id;
      authData.auth_sch_name = data.sch_name;
      authData.auth_dir_path = data.dir_path;
      authData.auth_sch_logo = data.sch_logo;
      authData.auth_user_email = data.user_email;
      authData.auth_user_contact = data.user_contact;
      authData.auth_program_id = data.program_id;
      authData.programs = data.programs;
      authData.trainer =data.trainer;
      authData.sales =data.sales;
      authData.isLoggedIn = true;
      window.localStorage.setItem("isLoggedIn", true);
      window.localStorage.setItem("lastLoginTime", new Date().getTime());
      this.$store.dispatch("setAuthData", authData);
      this.$store.dispatch("setUserId", authData.auth_user_id);
      window.cvAuth.setUserId(authData.auth_user_id);
    },
    shouldShowLoggedInState() {
      var isLoggedIn = window.localStorage.getItem("isLoggedIn") == "true";
      var lastLoginTime = parseInt(
        window.localStorage.getItem("lastLoginTime")
      );
      return (
        this.$store.getters.getAuthData.isLoggedIn ||
        (isLoggedIn && new Date().getTime() - lastLoginTime < 60000)
      );
    },
    saveUserProfile(data) {
      this.$store.dispatch("setProfileData", data);
    },
    getUserFromSession() {
      var vm = this;
      axios
        .post("/api/auth/getUserFromSession", {})
        .then(function(res) {
          vm.saveUserData(res.data);
        })
        .catch(function(err) {
          if (err.response.status >= 400 || err.response.status == 403) {
            var authData = new Object();
            authData.isLoggedIn = false;
            window.localStorage.setItem("isLoggedIn", false);
            vm.isLoggedIn = false;
            vm.$store.dispatch("setAuthData", authData);
            vm.$store.dispatch("setUserId", 0);
            window.cvAuth.setUserId(0);
          }
        });
    },
    getUserProfile(userId, roleId) {
      var vm = this;
      axios
        .post("/api/profile/getUserInformation", {
          user_id: userId,
          role_id: roleId
        })
        .then(res => {
          if (!res.data.length) {
            //vm.$router.push("/login");
          } else {
            vm.saveUserProfile(res.data);
          }
        });
    },
    doLogout() {
      var vm = this;
      let userId = 0;
      window.cvAuth.getUserId(function(id) {
        userId = id;
      });

      axios
        .post("/api/auth/logout", {})
        .then(function() {
          window.localStorage.setItem("isLoggedIn", false);
          window.localStorage.setItem("logout-event", "logout" + Math.random());
          window.open("/", "_self");
        })
        .catch(function(err) {});
    }
  }
};
