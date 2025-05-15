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
import scheduleStore from "@/stores/scheduleStore"; // import store
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export default {
  data() {
    return {
      selectedClass: "",
      selectedTeacher: "",
      classes: ["1A", "1B", "1C", "2A", "2B", "2C"],
      teachers: ["GV A", "GV B", "GV C", "GV D", "GV E", "GV F", "GV G", "GV H"],
      days: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"],
      dragData: null,
      schedule: scheduleStore.schedule, // lấy từ store, để reactive
    };
  },
  methods: {
    getLesson(day, session, period) {
      // Lấy lesson object từ store
      const lessonObj =
        scheduleStore.schedule?.[day]?.[session]?.[period]?.[this.selectedClass];
      if (!lessonObj) return "";

      // Chỉ hiển thị nếu giáo viên trùng với lựa chọn
      if (lessonObj.teacher === this.selectedTeacher) {
        return lessonObj.subject; // Chỉ trả về môn học
      }
      return "";
    },

    onDragStart(day, session, period, cls) {
      this.dragData = { day, session, period, cls };
    },

    onDrop(day, session, period, cls) {
      if (!this.dragData) return;

      const {
        day: fromDay,
        session: fromSession,
        period: fromPeriod,
        cls: fromCls,
      } = this.dragData;

      if (fromCls !== cls) {
        this.dragData = null;
        return;
      }

      const fromVal =
        scheduleStore.schedule?.[fromDay]?.[fromSession]?.[fromPeriod]?.[fromCls] || null;
      const toVal = scheduleStore.schedule?.[day]?.[session]?.[period]?.[cls] || null;

      if (!fromVal) {
        this.dragData = null;
        return;
      }

      if (
        toVal &&
        fromVal.teacher &&
        toVal.teacher &&
        fromVal.teacher !== toVal.teacher
      ) {
        toastr.warning(
          `Đang thay tiết ${fromVal.subject} - ${fromVal.teacher} bằng tiết ${toVal.subject} - ${toVal.teacher}`,
          "Cảnh báo"
        );
      }

      // Cập nhật lại dữ liệu trong scheduleStore
      scheduleStore.updateLesson(fromDay, fromSession, fromPeriod, fromCls, toVal);
      scheduleStore.updateLesson(day, session, period, cls, fromVal);

      this.dragData = null;
    },

    resetSchedule() {
      scheduleStore.reset();
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
  border: 1px solid #dee2e6;
  font-size: 14px;
  padding: 0.5rem;
  white-space: nowrap;

  /* Căn giữa ngang và dọc */
  text-align: center;
  vertical-align: middle;
}

.table td > div {
  /* Căn giữa nội dung trong mỗi tiết */
  min-height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Căn giữa cột Thứ (colspan=2) */
.table td[colspan="2"] {
  text-align: center;
  vertical-align: middle;
}

.table thead th {
  background-color: #b3e9ef;
  font-weight: bold;
  text-align: center;
}

.text-muted {
  font-style: italic;
}
.align-middle {
  background-color: #dab1a7a1 !important;
}
</style>
