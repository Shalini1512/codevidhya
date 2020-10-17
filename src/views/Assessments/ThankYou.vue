<template>
  <div id="overlay1">
    <div class="p-2 mb-2">
      <span> <h3>Thank You for </h3></span>
    </div>
    <div class="p-2">
      <button
        class="btn btn-warning"
        style="width:auto;"
        v-on:click="back_to_home()"
      >
        Back to Home
      </button>
    </div>
  </div>
</template>

<script>
import moment from "vue-moment";
export default {
  data() {
    return {
      cls_id: this.$store.getters.getAuthData.auth_cls_id,
      user_id: this.$store.getters.getAuthData.auth_user_id,
      sec_id: this.$store.getters.getAuthData.auth_sec_id,
      role_id: this.$store.getters.getAuthData.auth_role_id,
      sch_id: this.$store.getters.getAuthData.auth_sch_id,
      name: this.$store.getters.getAuthData.auth_user_full_name,
      token: ""
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  methods: {
    back_to_home: function() {
      if (this.role_id == 3) {
        this.$router.push("/assessments");
      } else {
        this.$router.push("/institute/assessments");
      }
    }
  },
  mounted: function() {
    //initCvModals();
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.user_id = userId;
        }
      }.bind(this)
    );
  }
};
</script>

<style lang="scss">
#overlay1 {
  position: fixed;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  align-items: center;
}
</style>
