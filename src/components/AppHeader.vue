<template>
  <div class="container-fluid min-vh-100 d-flex flex-column">
    <!-- Tiêu đề -->
    <div class="tkb-header px-2">
      <span class="tkb-title">Thời khóa biểu vnEdu</span>
    </div>

    <!-- Tabs -->
    <div class="tabs-container">
      <ul class="nav nav-tabs custom-tabs mb-0 d-flex flex-row">
        <li class="nav-item" v-for="(tab, index) in tabs" :key="index">
          <router-link
            class="nav-link"
            :to="tab.path"
            :class="{ active: $route.path === tab.path }"
          >
            {{ tab.label }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppHeader",
  data() {
    return {
      tabs: [
        { label: "1. Dữ liệu đầu vào", path: "/input" },
        { label: "2. Ràng buộc", path: "/constraints" },
        { label: "3. Xếp thời khóa biểu", path: "/schedule" },
        { label: "4. Xem kết quả", path: "/results" },
      ],
    };
  },
};
</script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
}

.container-fluid {
  display: flex;
  flex-direction: column;
}

.tkb-header {
  background-color: #c5dcef;
  padding: 4px 8px;
  height: 28px;
}

.tkb-title {
  color: #003366;
  font-size: 13px;
  font-weight: bold;
}

.custom-tabs {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
  display: flex;
  border-bottom: none;
}

.custom-tabs .nav-item {
  margin-right: 20px;
}

.custom-tabs .nav-link {
  padding: 4px 12px;
  font-size: 13px;
  text-decoration: none;
  color: #003366;
  border: 1px solid #ccc;
  border-radius: 0;
  background-color: #e6f0fa;
  margin-right: -1px;
}

.custom-tabs .nav-link.active {
  background-color: white;
  color: black;
  border-bottom: 1px solid white;
  position: relative;
  z-index: 1;
}
</style>
