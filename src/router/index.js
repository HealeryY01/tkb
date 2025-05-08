// src/router/index.js
import Vue from "vue";
import VueRouter from "vue-router";

// Import các trang của bạn
import InputPage from "@/views/DuLieuDauVao/InputPage.vue";
import ConstraintsPage from "@/views/RangBuoc/ConstraintsPage.vue";
import SchedulePage from "@/views/XemThoiKhoaBieu/SchedulePage.vue";
import ResultsPage from "@/views/XemKetQua/ResultsPage.vue";

// Sử dụng Vue Router
Vue.use(VueRouter);

// Định nghĩa các route
const routes = [
  { path: "/input", component: InputPage },
  { path: "/constraints", component: ConstraintsPage },
  { path: "/schedule", component: SchedulePage },
  { path: "/results", component: ResultsPage },
];

// Tạo router với VueRouter
const router = new VueRouter({
  routes, // Cấu hình các routes
  mode: "history", // Sử dụng chế độ history cho URL đẹp hơn
});

export default router;
