<template>
  <div
    class="cover-image bg-background3"
    data-image-src="/assets/images/banners/banner2.jpg"
  >
    <div class="header-main menu-only">
      <!-- Mobile Header -->
      <div class="horizontal-header clearfix">
        <div class="container">
          <a id="horizontal-navtoggle" class="animated-arrow">
            <span></span>
          </a>
          <span class="smllogo">
            <router-link to="/">
              <img
                src="/assets/images/png/codevidhya_reverse_logo.png"
                width="120"
                alt="img"
              />
            </router-link>
          </span>
        </div>
      </div>
      <!-- /Mobile Header -->

      <!--Horizontal-main -->
      <div class="header-style horizontal-main bg-dark-transparent clearfix">
        <div class="horizontal-mainwrapper container clearfix">
          <nav class="horizontalMenu clearfix d-md-flex">
            <ul class="horizontalMenu-list">
              <li aria-haspopup="true">
                <router-link to="/">Home</router-link>
              </li>
              <li aria-haspopup="true">
                <router-link to="/for-parents">For Parents</router-link>
              </li>
              <li aria-haspopup="true">
                <router-link to="for-schools">For Schools</router-link>
              </li>
              <li aria-haspopup="true">
                <router-link to="/why-coding">Why Coding?</router-link>
              </li>
              <li aria-haspopup="true">
                <router-link to="/in-media">In Media</router-link>
              </li>
              <li aria-haspopup="true">
                <router-link to="/courses">Courses</router-link>
              </li>
              <li aria-haspopup="true">
                <a href="https://studio.codevidhya.com/quizzes">Quiz</a>
              </li>
              <!--<li aria-haspopup="true">
                <router-link to="/projects">Projects</router-link>
              </li>-->
              <li aria-haspopup="true">
                <router-link to="/enquiry">Enquiry</router-link>
              </li>
              <li aria-haspopup="true">
                <router-link to="/contact">Contact Us</router-link>
              </li>
              <li aria-haspopup="true" class="d-lg-none mt-5 pb-5 mt-lg-0">
                <span>
                  <router-link to="/register" class="btn btn-info"
                    >Register Now</router-link
                  >
                </span>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <!--/Horizontal-main -->

    <slot></slot>
  </div>
</template>

<script>
import AuthMixin from "@/mixins/AuthMixin.js";
import axios from "axios";
export default {
  mixins: [AuthMixin],
  data() {
    return {
      user_id: null,
      headerInitialized: false
    };
  },
  mounted() {
    cvAuth.getUserId(
      function(userId) {
        this.user_id = userId;
      }.bind(this)
    );

    if (!this.headerInitialized) {
      $(".horizontal-main").sticky({ topSpacing: 0 });
      $('<div class="horizontal-overlapbg"></div>').prependTo(
        ".horizontalMenu"
      );
      $("#horizontal-navtoggle").on("click", function(e) {
        $("body").toggleClass("active");
      });
      $(".horizontal-overlapbg").on("click", function(e) {
        $("body").removeClass("active");
      });
      $(".horizontalMenu > .horizontalMenu-list > li")
        .has(".sub-menu")
        .prepend(
          '<span class="horizontalMenu-click"><i class="horizontalMenu-arrow fas fa-angle-down"></i></span>'
        );
      $(".horizontalMenu > .horizontalMenu-list > li")
        .has(".horizontal-megamenu")
        .prepend(
          '<span class="horizontalMenu-click"><i class="horizontalMenu-arrow fas fa-angle-down"></i></span>'
        );
      $(".horizontalMenu-click").on("click", function(e) {
        $(this)
          .toggleClass("horizontal-activearrow")
          .parent()
          .siblings()
          .children()
          .removeClass("horizontal-activearrow");
        $(
          ".horizontalMenu > .horizontalMenu-list > li > .sub-menu, .horizontal-megamenu"
        )
          .not(
            $(this).siblings(
              ".horizontalMenu > .horizontalMenu-list > li > .sub-menu, .horizontal-megamenu"
            )
          )
          .slideUp("slow");
        $(this)
          .siblings(".sub-menu")
          .slideToggle("slow");
        $(this)
          .siblings(".horizontal-megamenu")
          .slideToggle("slow");
      });
      $(".horizontalMenu > .horizontalMenu-list > li > ul > li")
        .has(".sub-menu")
        .prepend(
          '<span class="horizontalMenu-click02"><i class="horizontalMenu-arrow fas fa-angle-down"></i></span>'
        );
      $(".horizontalMenu > .horizontalMenu-list > li > ul > li > ul > li")
        .has(".sub-menu")
        .prepend(
          '<span class="horizontalMenu-click02"><i class="horizontalMenu-arrow fas fa-angle-down"></i></span>'
        );
      $(".horizontalMenu-click02").on("click", function(e) {
        $(this)
          .children(".horizontalMenu-arrow")
          .toggleClass("horizontalMenu-rotate");
        $(this)
          .siblings("li > .sub-menu")
          .slideToggle("slow");
      });
      this.headerInitialized = true;
    }
  },
  methods: {
    /*onLoginPage() {
      var pathName = window.location.pathname;
      return ~pathName.indexOf("/login") || ~pathName.indexOf("/register");
    }*/
  }
};
</script>

<style lang="scss">
</style>
