// src/main.js
import Vue from "vue";
import App from "./App.vue";
import router from "./router"; // Import router
import toastr from "toastr"; // Import Toastr
import "toastr/build/toastr.min.css"; // Import CSS của Toastr

Vue.config.productionTip = false;
// Cấu hình Toastr
toastr.options = {
  closeButton: true,
  progressBar: true,
  timeOut: 2000,
  positionClass: "toast-bottom-right", // Vị trí thông báo
};

// Tạo và khởi động Vue instance với router
new Vue({
  render: (h) => h(App),
  router, // Thêm router vào Vue instance
}).$mount("#app");
