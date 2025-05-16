// src/main.js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// ✅ Import Bootstrap 4 & jQuery
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
window.$ = window.jQuery = $;

// ✅ Import Toastr & CSS
import toastr from "toastr";
import "toastr/build/toastr.min.css";

// Cấu hình Toastr
toastr.options = {
  closeButton: true,
  progressBar: true,
  timeOut: 2000,
  positionClass: "toast-bottom-right",
};

// Gắn toastr vào Vue prototype (nếu cần dùng this.$toastr)
Vue.prototype.$toastr = toastr;

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
