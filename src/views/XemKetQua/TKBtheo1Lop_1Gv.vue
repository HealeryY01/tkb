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
                <div
                  draggable="true"
                  @dragstart="onDragStart(day, 'morning', i, selectedClass)"
                  @dragover.prevent
                  @drop="onDrop(day, 'morning', i, selectedClass)"
                  class="p-1"
                  style="min-height: 40px"
                >
                  {{ getLesson(day, "morning", i) }}
                </div>
              </td>

              <!-- Tiết chiều -->
              <td v-for="i in 5" :key="'c_' + index + '_' + i">
                <div
                  draggable="true"
                  @dragstart="onDragStart(day, 'afternoon', i, selectedClass)"
                  @dragover.prevent
                  @drop="onDrop(day, 'afternoon', i, selectedClass)"
                  class="p-1"
                  style="min-height: 40px"
                >
                  {{ getLesson(day, "afternoon", i) }}
                </div>
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
import { getSchedule, saveSchedule } from "@/data/sharedSchedule";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export default {
  data() {
    return {
      schedule: getSchedule(),
      selectedClass: "",
      selectedTeacher: "",
      classes: ["1A", "1B", "1C", "2A", "2B", "2C"],
      teachers: ["GV A", "GV B", "GV C", "GV D", "GV E", "GV F", "GV G", "GV H"],
      days: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"],
      dragData: null,
    };
  },
  methods: {
    // Hàm lấy tiết học từ dữ liệu
    getLesson(day, session, period) {
      const value = this.schedule[day]?.[session]?.[period]?.[this.selectedClass] || "";
      if (value && value.includes(this.selectedTeacher)) {
        return value;
      }
      return "";
    },

    // Hàm xử lý khi kéo bắt đầu
    onDragStart(day, session, period, cls) {
      this.dragData = { day, session, period, cls };
    },

    // Hàm xử lý khi thả tiết học
    onDrop(day, session, period, cls) {
      if (!this.dragData) return;

      const {
        day: fromDay,
        session: fromSession,
        period: fromPeriod,
        cls: fromCls,
      } = this.dragData;

      if (fromCls !== cls) return;

      const fromVal =
        this.schedule[fromDay]?.[fromSession]?.[fromPeriod]?.[fromCls] || "";
      const toVal = this.schedule[day]?.[session]?.[period]?.[cls] || "";

      // Trích xuất thông tin giáo viên và môn học
      const {
        subject: fromSubject,
        teacher: fromTeacher,
      } = this.extractSubjectAndTeacher(fromVal);
      const { subject: toSubject, teacher: toTeacher } = this.extractSubjectAndTeacher(
        toVal
      );

      // Nếu có sự thay đổi giữa các tiết học
      if (toVal && fromTeacher && toTeacher && fromTeacher !== toTeacher) {
        toastr.warning(
          `Đang thay tiết ${fromSubject} - ${fromTeacher} bằng tiết ${toSubject} - ${toTeacher}`,
          "Cảnh báo"
        );
      }

      // Cập nhật tiết học
      this.updateLesson(fromDay, fromSession, fromPeriod, fromCls, toVal);
      this.updateLesson(day, session, period, cls, fromVal);

      this.dragData = null;
    },

    // Hàm cập nhật tiết học
    updateLesson(day, session, period, cls, value) {
      if (!this.schedule[day]) this.$set(this.schedule, day, {});
      if (!this.schedule[day][session]) this.$set(this.schedule[day], session, {});
      if (!this.schedule[day][session][period])
        this.$set(this.schedule[day][session], period, {});
      this.$set(this.schedule[day][session][period], cls, value);
      saveSchedule(this.schedule);
    },

    // Hàm trích xuất môn học và giáo viên từ chuỗi
    extractSubjectAndTeacher(val) {
      const parts = val.split(" - ");
      return {
        subject: parts[0] || "Môn học chưa xác định",
        teacher: parts[1] || "Giáo viên chưa xác định",
      };
    },

    resetSchedule() {
      localStorage.removeItem("savedSchedule");
      this.schedule = getSchedule();
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
