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
.tkb-header {
  background-color: #c5dcef;
  padding: 4px 8px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.tkb-title {
  color: #ec1d1d;
  font-size: 1rem;
  font-weight: bold;
  white-space: nowrap;
}

.custom-tabs {
  list-style: none;
  padding-left: 20px;
  margin-bottom: 0;
  display: flex;
  flex-wrap: wrap;
  overflow-x: auto;
  border-bottom: none;
  scrollbar-width: thin;
}

.custom-tabs .nav-item {
  margin-right: 12px;
  margin-bottom: 4px;
}

.custom-tabs .nav-link {
  font-size: 0.9rem;
  padding: 6px 12px;
  text-decoration: none;
  color: #003366;
  border: 1px solid #ccc;
  background-color: #e6f0fa;
  margin-right: -1px;
  white-space: nowrap;
}

.custom-tabs .nav-link.active {
  background-color: white;
  color: black;
  border-bottom: 1px solid white;
  z-index: 1;
  position: relative;
}

@media (max-width: 768px) {
  .tkb-title {
    font-size: 0.9rem;
  }

  .custom-tabs .nav-link {
    font-size: 0.8rem;
    padding: 4px 8px;
  }
}
</style>
