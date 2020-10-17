import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueResource from "vue-resource";
Vue.use(require("vue-moment"));
// import axios from "axios";
import VueGoogleCharts from "vue-google-charts";
Vue.use(VueGoogleCharts);
// Vue.use(axios)

/****Facebook pixel */
!(function(f, b, e, v, n, t, s) {
  if (f.fbq) return;
  n = f.fbq = function() {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = !0;
  n.version = "2.0";
  n.queue = [];
  t = b.createElement(e);
  t.async = !0;
  t.src = v;
  s = b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t, s);
})(
  window,
  document,
  "script",
  "https://connect.facebook.net/en_US/fbevents.js"
);
fbq("init", "645680736277783");
fbq("track", "PageView");
/****End facebook pixel */
/*******Ideal time count */
let idleTime = 0;
let userId = store.getters.getAuthData.auth_user_id;
$(document).ready(function() {
  //Increment the idle time counter every minute.

  if (userId != 0) {
    var idleInterval = setInterval(timerIncrement, 60000); // 1 minute =60000
  }
  //Zero the idle timer on mouse movement.
  $(this).mousemove(function(e) {
    idleTime = 0;
  });
  $(this).keypress(function(e) {
    idleTime = 0;
  });
});

function timerIncrement() {
  // console.log(idleTime);
  /*****logout after 10 minutes if user ideal */
  if (userId) {
    if (userId != 0) {
      idleTime = idleTime + 1;
      if (idleTime >= 10) {
        //for test
        Vue.http
          .post("/api/auth/logout", {})
          .then(function() {
            window.localStorage.setItem("isLoggedIn", false);
            window.open("/", "_self");
          })
          .catch(function(err) {});
      }
    }
  }
  /*****end logout after 10 minutes if user ideal */
}
/******End Ideal time */
function post_page_detail(visited_path, from_path, next) {
  let user_id = 0;
  if (!store.getters.getAuthData.auth_user_id) {
    user_id = 0;
  } else {
    user_id = store.getters.getAuthData.auth_user_id;
  }
  next();
  Vue.http
    .post("/api/userTracking/user_visited_page", {
      user_id: store.getters.getAuthData.auth_user_id,
      to: visited_path,
      from: from_path
    })
    .then((res) => {})
    .catch((err) => {});
}
router.beforeEach((to, from, next) => {
  if (store.getters.getAuthData.auth_user_id) {
    if (store.getters.getAuthData.auth_user_id != 0) {
      post_page_detail(to.path, from.path, next);
    } else {
      next();
    }
  } else {
    next();
  }
});
Vue.use(VueResource);

new Vue({
  router,
  store,
  created() {
    //  window.addEventListener("beforeunload", this.leaving);
    cvAuth.getUserId(function(id) {
      userId = id;
    });
  },
  methods: {
    leaving(e) {
      e.preventDefault();
    }
  },
  render: (h) => h(App)
}).$mount("#app");
