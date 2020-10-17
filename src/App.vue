<template>
  <div id="app">
    <div id="global-loader">
      <img src="/assets/images/loader.svg" class="loader-img" alt="img" />
    </div>

    <transition>
      <router-view class="router-view" />
    </transition>

    <!--a href="#top" id="back-to-top">
      <i class="fas fa-caret-up"></i>
    </a-->
  </div>
</template>
<script>
import AuthMixin from "@/mixins/AuthMixin.js";

export default {
  mixins: [AuthMixin],
  mounted() {
    this.getUserFromSession();
    window.addEventListener("storage", function(event) {
      if (event.key == "logout-event") {
        window.open("/", "_self");
      }
    });

    /*$("#body").wrapInner('<div class="horizontalMenucontainer" />');

    $(function() {
      $(window).on("resize", function(e) {
        if ($(window).outerWidth() < 992) {
          $(".horizontalMenu").css("height", $(this).height() + "px");
          $(".horizontalMenucontainer").css(
            "min-width",
            $(this).width() + "px"
          );
        } else {
          $(".horizontalMenu").removeAttr("style");
          $(".horizontalMenucontainer").removeAttr("style");
          $("body").removeClass("active");
          $(
            ".horizontalMenu > .horizontalMenu-list > li > .horizontal-megamenu, .horizontalMenu > .horizontalMenu-list > li > ul.sub-menu, .horizontalMenu > .horizontalMenu-list > li > ul.sub-menu > li > ul.sub-menu, .horizontalMenu > .horizontalMenu-list > li > ul.sub-menu > li > ul.sub-menu > li > ul.sub-menu"
          ).removeAttr("style");
          $(".horizontalMenu-click").removeClass("horizontal-activearrow");
          $(".horizontalMenu-click02 > i").removeClass("horizontalMenu-rotate");
        }
      });
      $(window).trigger("resize");
    });*/
  }
};
</script>

<style lang="scss">
#app {
  min-height: 100vh;
  & > .router-view {
    transition: all 1000ms;
    &.v-leave {
      opacity: 0;
    }
    &.v-enter {
      opacity: 0.5;
    }
  }
}
.horizontalMenucontainer {
  min-height: 100%;
}

.router-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
