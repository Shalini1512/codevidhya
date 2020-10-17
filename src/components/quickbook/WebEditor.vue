<template>
  <div>
    <div class="bg-danger p-2">xdsdfsdfdsf</div>
    <div>
      <split-pane
        :min-percent="20"
        :default-percent="windowWidth > 768 ? 50 : 100"
        split="vertical"
      >
        <template slot="paneL">
          <div class="w-100 bg-success p-2">
            first slot
          </div>
        </template>
        <template slot="paneR" v-if="windowWidth > 768">
          <div class="w-100 bg-primary p-2">
            second slot
          </div>
        </template>
      </split-pane>
    </div>
  </div>
</template>

<script>
import moment from "vue-moment";
import splitPane from "vue-splitpane";
export default {
  components: { "split-pane": splitPane },
  data() {
    return {
      windowWidth: 0
    };
  },
  computed: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  methods: {},
  mounted: function() {
    var vm = this;
    $(document).ready(function() {
      vm.windowWidth = $(window).width();
    });
    $(window).resize(
      function() {
        this.windowWidth = $(window).width();
      }.bind(this)
    );
  },
  updated() {}
};
</script>
<style lang="scss"></style>
