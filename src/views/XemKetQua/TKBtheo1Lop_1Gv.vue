<template>
  <div>
    <h3 class="mb-3">Xem thời khóa biểu theo 1 lớp - 1 giáo viên</h3>

    <!-- Bộ lọc lớp và giáo viên -->
    <div class="row mb-4">
      <div class="col-md-4">
        <label>Chọn lớp:</label>
        <select class="form-control" v-model="selectedClass">
          <option disabled value="">-- Chọn lớp --</option>
          <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
        </select>
      </div>
      <div class="col-md-4">
        <label>Chọn giáo viên:</label>
        <select class="form-control" v-model="selectedTeacher">
          <option disabled value="">-- Chọn giáo viên --</option>
          <option v-for="gv in teachers" :key="gv" :value="gv">{{ gv }}</option>
        </select>
      </div>
    </div>

    <!-- Hiển thị bảng -->
    <div v-if="selectedClass && selectedTeacher">
      <h5 class="mb-2">
        Thời khóa biểu - Lớp {{ selectedClass }} - {{ selectedTeacher }}
      </h5>
      <div class="table-responsive">
        <table class="table table-bordered text-center">
          <thead>
            <tr>
              <th rowspan="2" colspan="2" class="align-middle">Thứ</th>
              <th colspan="5">Sáng</th>
              <th colspan="5">Chiều</th>
            </tr>
            <tr>
              <th v-for="i in 5" :key="'m_' + i">Tiết {{ i }}</th>
              <th v-for="i in 5" :key="'a_' + i">Tiết {{ i }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(day, index) in days" :key="index">
              <td colspan="2" class="align-middle">{{ day }}</td>

              <!-- Tiết sáng -->
              <td v-for="i in 5" :key="'s_' + index + '_' + i">
                {{ getLesson(day, "morning", i) }}
              </td>

              <!-- Tiết chiều -->
              <td v-for="i in 5" :key="'c_' + index + '_' + i">
                {{ getLesson(day, "afternoon", i) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else>
      <p class="text-muted">Vui lòng chọn lớp và giáo viên để xem thời khóa biểu.</p>
    </div>
  </div>
</template>

<script>
import { getSchedule } from "@/data/sharedSchedule";

export default {
  data() {
    return {
      schedule: getSchedule(), // dùng chung dữ liệu
      selectedClass: "",
      selectedTeacher: "",
      classes: ["1A", "1B", "1C", "2A", "2B", "2C"],
      teachers: ["GV A", "GV B", "GV C", "GV D", "GV E", "GV F", "GV G", "GV H"],
      days: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"],
    };
  },
  methods: {
    getLesson(day, session, period) {
      const value = this.schedule[day]?.[session]?.[period]?.[this.selectedClass] || "";
      return value.includes(this.selectedTeacher) ? value : "";
    },
  },
};
</script>

<style scoped>
.table {
  table-layout: fixed;
  width: 100%;
}

.table th,
.table td {
  vertical-align: middle;
  border: 1px solid #dee2e6;
  font-size: 14px;
  padding: 0.5rem;
  white-space: nowrap;
}

.table thead th {
  background-color: #f0f8ff;
  font-weight: bold;
  text-align: center;
}

.text-muted {
  font-style: italic;
}
</style>
