<template>
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
                <h1 class="mb-4">Projects</h1>
                <p>
                  Create awesome projects.
                </p>
              </div>
            </div>
            <div class="btn-list col-md-6 row justify-content-end">
              <button
                v-if="isSchoolStudent"
                class="btn btn-primary"
                @click="handleShowSubmissions()"
              >
                My submissions
              </button>
              <button class="btn btn-primary" @click="onCreateNewClick()">
                <i class="fas fa-plus"></i>
                Create new
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- /header-text -->
    </div>
  </section>
</template>

<script>
export default {
  props: ["onCreateNewClick", "handleShowSubmissions"],
  data() {
    return {
      isSchoolStudent: false
    };
  },
  mounted() {
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          var authData = this.$store.getters.getAuthData;
          this.isSchoolStudent =
            authData.auth_role_id == 3 && authData.auth_sch_id != 1;
        }
      }.bind(this)
    );
  }
};
</script>
