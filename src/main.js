// src/main.js
import Vue from "vue";
import App from "./App.vue";
import router from "./router"; // Import router

Vue.config.productionTip = false;

// Tạo và khởi động Vue instance với router
new Vue({
  render: (h) => h(App),
  router, // Thêm router vào Vue instance
}).$mount("#app");
