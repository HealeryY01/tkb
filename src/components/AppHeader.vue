<template>
  <div class="container-fluid d-flex flex-column">
    <!-- Tiêu đề -->
    <div class="tkb-header text-center py-2">
      <span class="tkb-title">Thời khóa biểu vnEdu</span>
    </div>

    <!-- Tabs -->
    <div class="tabs-container border-bottom bg-light mt-2">
      <ul class="nav nav-tabs px-2 flex-nowrap overflow-auto">
        <li
          class="nav-item"
          v-for="(tab, index) in tabs"
          :key="index"
          style="white-space: nowrap"
        >
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
}

.tkb-title {
  color: #ec1d1d;
  font-size: 1rem;
  font-weight: bold;
}

.nav-tabs .nav-link {
  font-size: 0.9rem;
  padding: 6px 12px;
  color: #003366;
  background-color: #e6f0fa;
  border: 1px solid #ccc;
  margin-right: 4px;
}

.nav-tabs .nav-link.active {
  background-color: white;
  color: #000;
  border-color: #dee2e6 #dee2e6 white;
}

@media (max-width: 768px) {
  .tkb-title {
    font-size: 0.9rem;
  }

  .nav-tabs .nav-link {
    font-size: 0.8rem;
    padding: 4px 8px;
  }
}
</style>
