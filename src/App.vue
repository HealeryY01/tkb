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
  background-color: #f5f5f5;
}
</style>
