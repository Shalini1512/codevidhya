<template>
  <div>
    <div class="sptb-1">
      <div class="header-text1 mb-0">
        <div class="container">
          <div class="row">
            <div class="col-xl-9 col-lg-12 col-md-12 d-block mx-auto">
              <div class="text-center text-white text-property">
                <h1 class>
                  <span class="font-weight-bold">{{ book_name }}</span>
                </h1>

                <center>
                  <div class="font-weight-bold mt-3" style="font-size:2.5rem">
                    <p class="pl-1 text-white" style="padding-right:16px;">
                      Chapters: {{ tot_topic }} | Topics: {{ tot_sub_topic }} |
                      Level: {{ level }} | Age:
                      {{age_group}}
                    </p>
                  </div>
                  <div
                    class="progress progress-md mb-3 mt-2 w-30"
                    v-if="tot_per > 0"
                  >
                    <div
                      :class="'progress-bar bg-pink w-' + tot_per"
                      v-html="tot_per + '%'"
                    ></div>
                  </div>
                </center>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /header-text -->
    </div>
  </div>
  <!--/Section-->
</template>
<script>
export default {
  name: "HeaderContent",
  props: [
    "tot_topic",
    "tot_sub_topic",
    "tot_per",
    "level",
    "purchases_status",
    "sch_id",
    "product_id",
    "book_name",
    "book_slug",
    "price",
    "prod_info",
    "prod_type",
    "sub_topic_status",
    "age_group"
  ]
};
</script>
