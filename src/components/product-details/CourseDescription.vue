<template>
  <div>
    <h3 class="card-title mb-3 font-weight-bold">Description</h3>
    <div class="mb-3" v-html="'<p>' + desc + '</p>'"></div>
    <h3 class="card-title mb-3 font-weight-bold">
      What Will I Learn?
    </h3>
    <div class="mb-0" v-html="cover_topics"></div>
    <h4 class="card-title mb-3 font-weight-bold">
      Prerequisite for this course:
    </h4>
    <div class="mb-0" v-html="prerequisite"></div>
  </div>
</template>
<script>
export default {
  name: "HeaderContent",
  props: ["course_slug", "desc", "cover_topics", "prerequisite"],
  data() {
    return {};
  }
};
</script>
