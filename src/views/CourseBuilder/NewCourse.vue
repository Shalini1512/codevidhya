<template>
  <div>
    <Header></Header>
    <section class="sptb" style="padding-top:72px;">
      <div class="container">
        <div class="row">
          <div class="col-xl-12 col-lg-12 col-md-12">
            <!--Step 1 card-->
            <div class="card">
              <div class="card-header">
                <button type="button" class="btn btn-outline-danger mr-4">
                  Back
                </button>
                <h3 class="card-title font-weight-normal border-left pl-4">
                  Step 1 of 2
                </h3>
              </div>
              <div class="progress progress-xs">
                <div class="progress-bar bg-primary w-50"></div>
              </div>
              <div class="card-body text-center">
                <div class="my-5 py-5">
                  <h2 class="text-center p-2">Course Title</h2>
                  <div class="form-group row m-0 mb-5">
                    <div class="col-sm-8 col-md-8 col-lg-5 mx-auto">
                      <label class="form-label p-2"
                        >Enter course title here. You can change it
                        later.</label
                      >
                      <input
                        type="text"
                        class="form-control input-lg"
                        maxlength="40"
                        placeholder="e.g. Web Development"
                      />
                      <div
                        class="form-control-counter"
                        data-purpose="form-control-counter"
                      >
                        40
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <div class="container px-5">
                  <button
                    type="button"
                    class="btn btn-outline-primary float-right"
                    disabled
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
            <!--Step 2 card-->
            <div class="card">
              <div class="card-header">
                <button type="button" class="btn btn-outline-danger mr-4">
                  Close
                </button>
                <h3 class="card-title font-weight-normal border-left pl-4">
                  Step 2 of 2
                </h3>
              </div>
              <div class="progress progress-xs">
                <div class="progress-bar bg-primary w-100"></div>
              </div>
              <div class="card-body text-center">
                <div class="my-5 py-5">
                  <h2 class="text-center p-2">Category</h2>
                  <div class="form-group row m-0 mb-5">
                    <div class="col-sm-8 col-md-8 col-lg-5 mx-auto">
                      <label class="form-label p-2"
                        >Select the category that fits the best for this course.
                        You can change it later.</label
                      >
                      <select
                        class="form-control select2-show-search border-bottom-0 w-100"
                        data-placeholder="Select"
                      >
                        <option>--Select a category--</option>
                        <option value="1">Web Development</option>
                        <option value="2">Game Development</option>
                        <option value="3">Designing</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <div class="container px-5">
                  <button type="button" class="btn btn-outline-primary">
                    Previous
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-primary float-right"
                    disabled
                  >
                    Create Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Header from "@/components/header/HeaderMenuForAdmin.vue";
export default {
  components: { Header }
};
</script>

<style lang="scss">
.form-control-counter {
  position: absolute;
  bottom: 5px;
  right: 20px;
  padding: 5px;
  color: #686f7a;
  background: #dedfe0;
  font-weight: 700;
  min-width: 34px;
  line-height: 24px;
  text-align: center;
}
</style>
