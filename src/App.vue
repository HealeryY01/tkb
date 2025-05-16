<template>
  <div id="app">
    <AppHeader />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";

export default {
  name: "App",
  components: {
    AppHeader,
  },
};
</script>

<style>
/* App container full height */
html,
body,
#app {
  height: 100%;
  margin: 0;
}

/* Main content should take the remaining height */
.main-content {
  flex: 1;
  padding: 20px;
}

/* Ghi đè nếu toastr bị Bootstrap 4 làm mất màu */
.toast {
  color: #000 !important; /* Đảm bảo chữ hiển thị rõ */
}

.toast-success {
  background-color: #51a351 !important;
}

.toast-error {
  background-color: #bd362f !important;
}

.toast-warning {
  background-color: #f89406 !important;
}

.toast-info {
  background-color: #2f96b4 !important;
}
</style>
