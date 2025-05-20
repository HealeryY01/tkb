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
import Vue from "vue";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const defaultScheduleVersion = "v3";

const defaultSchedule = {
  version: defaultScheduleVersion,
  data: {
    "Thứ 2": {
      morning: {
        1: {
          "1A": { subject: "Toán", teacher: "GV A" },
          "1B": { subject: "Văn", teacher: "GV B" },
          "1C": { subject: "Anh", teacher: "GV C" },
        },
        2: {
          "2A": { subject: "Toán", teacher: "GV D" },
          "2B": { subject: "Văn", teacher: "GV E" },
          "2C": { subject: "Anh", teacher: "GV F" },
        },
        3: {
          "1A": { subject: "Sử", teacher: "GV G" },
          "1B": { subject: "Địa", teacher: "GV H" },
          "1C": { subject: "GDCD", teacher: "GV A" },
        },
        4: {
          "2A": { subject: "Sinh", teacher: "GV I" },
          "2B": { subject: "Lý", teacher: "GV J" },
          "2C": { subject: "Hóa", teacher: "GV K" },
        },
        5: {
          "1A": { subject: "Thể dục", teacher: "GV L" },
          "1B": { subject: "Mỹ thuật", teacher: "GV M" },
        },
      },
      afternoon: {
        1: {
          "2A": { subject: "Lý", teacher: "GV B" },
          "2B": { subject: "Hóa", teacher: "GV C" },
        },
        2: {
          "2C": { subject: "Sinh", teacher: "GV D" },
          "1A": { subject: "Nhạc", teacher: "GV E" },
        },
        3: {
          "1B": { subject: "Tin học", teacher: "GV F" },
          "1C": { subject: "Thể dục", teacher: "GV G" },
        },
        4: {
          "2A": { subject: "Công nghệ", teacher: "GV H" },
          "2B": { subject: "GDCD", teacher: "GV I" },
        },
      },
    },
    "Thứ 3": {
      morning: {
        1: {
          "1A": { subject: "Toán", teacher: "GV A" },
          "2A": { subject: "Văn", teacher: "GV B" },
        },
        2: {
          "1B": { subject: "Anh", teacher: "GV C" },
          "2B": { subject: "Toán", teacher: "GV D" },
        },
        3: {
          "1C": { subject: "Sử", teacher: "GV E" },
          "2C": { subject: "Địa", teacher: "GV F" },
        },
        4: {
          "1A": { subject: "Sinh", teacher: "GV G" },
          "1B": { subject: "Tin học", teacher: "GV H" },
        },
        5: {
          "2A": { subject: "Thể dục", teacher: "GV I" },
        },
      },
      afternoon: {
        1: {
          "2B": { subject: "Nhạc", teacher: "GV J" },
          "1C": { subject: "Mỹ thuật", teacher: "GV K" },
        },
        2: {
          "1A": { subject: "GDCD", teacher: "GV L" },
          "2C": { subject: "Công nghệ", teacher: "GV M" },
        },
      },
    },
    "Thứ 4": {
      morning: {
        1: {
          "1A": { subject: "Toán", teacher: "GV A" },
          "2A": { subject: "Văn", teacher: "GV B" },
        },
        2: {
          "1B": { subject: "Anh", teacher: "GV C" },
          "2B": { subject: "Toán", teacher: "GV D" },
        },
        3: {
          "1C": { subject: "Hóa", teacher: "GV E" },
          "2C": { subject: "Lý", teacher: "GV F" },
        },
        4: {
          "1A": { subject: "Sinh", teacher: "GV G" },
        },
      },
      afternoon: {
        1: {
          "1B": { subject: "GDCD", teacher: "GV H" },
          "2A": { subject: "Thể dục", teacher: "GV I" },
        },
        2: {
          "1C": { subject: "Tin học", teacher: "GV J" },
        },
      },
    },
    "Thứ 5": {
      morning: {
        1: {
          "1A": { subject: "Sử", teacher: "GV K" },
          "2A": { subject: "Địa", teacher: "GV L" },
        },
        2: {
          "1B": { subject: "Văn", teacher: "GV M" },
          "2B": { subject: "Toán", teacher: "GV A" },
        },
        3: {
          "1C": { subject: "Anh", teacher: "GV B" },
          "2C": { subject: "Hóa", teacher: "GV C" },
        },
      },
      afternoon: {
        1: {
          "2A": { subject: "Nhạc", teacher: "GV D" },
          "2B": { subject: "Mỹ thuật", teacher: "GV E" },
        },
        2: {
          "1A": { subject: "GDCD", teacher: "GV F" },
          "1B": { subject: "Công nghệ", teacher: "GV G" },
        },
      },
    },
    "Thứ 6": {
      morning: {
        1: {
          "1A": { subject: "Toán", teacher: "GV A" },
          "1B": { subject: "Văn", teacher: "GV B" },
          "1C": { subject: "Anh", teacher: "GV C" },
        },
        2: {
          "2A": { subject: "Toán", teacher: "GV D" },
          "2B": { subject: "Văn", teacher: "GV E" },
          "2C": { subject: "Anh", teacher: "GV F" },
        },
        3: {
          "1A": { subject: "Sinh", teacher: "GV G" },
          "1B": { subject: "Địa", teacher: "GV H" },
          "1C": { subject: "GDCD", teacher: "GV I" },
        },
        4: {
          "2A": { subject: "Sử", teacher: "GV J" },
          "2B": { subject: "Lý", teacher: "GV K" },
        },
      },
      afternoon: {
        1: {
          "2C": { subject: "Thể dục", teacher: "GV L" },
          "1A": { subject: "Tin học", teacher: "GV M" },
        },
        2: {
          "1B": { subject: "Mỹ thuật", teacher: "GV N" },
        },
      },
    },
  },
};

export default {
  name: "TKBtheo1lop_1Gv",
  data() {
    // Khởi tạo reactive schedule
    const reactiveSchedule = Vue.observable({
      schedule: {},
    });

    // Hàm khởi tạo schedule
    const initSchedule = () => {
      try {
        const localData = localStorage.getItem("savedSchedule");
        if (!localData) {
          this.resetSchedule();
        } else {
          const parsed = JSON.parse(localData);
          if (parsed.version !== defaultScheduleVersion) {
            this.resetSchedule();
          } else {
            reactiveSchedule.schedule = parsed.data;
          }
        }
      } catch (e) {
        console.error("Lỗi khi khởi tạo schedule:", e);
        this.resetSchedule();
      }
    };

    // Gọi khởi tạo
    initSchedule();

    return {
      selectedClass: "",
      selectedTeacher: "",
      classes: ["1A", "1B", "1C", "2A", "2B", "2C"],
      teachers: [
        "GV A",
        "GV B",
        "GV C",
        "GV D",
        "GV E",
        "GV F",
        "GV G",
        "GV H",
        "GV I",
        "GV J",
        "GV K",
        "GV L",
        "GV M",
        "GV N",
      ],
      days: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"],
      dragData: null,
      reactiveSchedule,
    };
  },
  computed: {
    schedule() {
      return this.reactiveSchedule.schedule;
    },
  },
  methods: {
    getLesson(day, session, period) {
      const lessonObj = this.schedule?.[day]?.[session]?.[period]?.[this.selectedClass];
      if (!lessonObj) return "";

      if (lessonObj.teacher === this.selectedTeacher) {
        return lessonObj.subject;
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
        this.schedule?.[fromDay]?.[fromSession]?.[fromPeriod]?.[fromCls] || null;
      const toVal = this.schedule?.[day]?.[session]?.[period]?.[cls] || null;

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

      this.updateLesson(fromDay, fromSession, fromPeriod, fromCls, toVal);
      this.updateLesson(day, session, period, cls, fromVal);

      this.dragData = null;
    },

    updateLesson(day, session, period, cls, value) {
      if (!this.reactiveSchedule.schedule[day]) {
        Vue.set(this.reactiveSchedule.schedule, day, {});
      }
      if (!this.reactiveSchedule.schedule[day][session]) {
        Vue.set(this.reactiveSchedule.schedule[day], session, {});
      }
      if (!this.reactiveSchedule.schedule[day][session][period]) {
        Vue.set(this.reactiveSchedule.schedule[day][session], period, {});
      }
      Vue.set(this.reactiveSchedule.schedule[day][session][period], cls, value);

      this.saveSchedule();
    },

    saveSchedule() {
      try {
        localStorage.setItem(
          "savedSchedule",
          JSON.stringify({
            version: defaultScheduleVersion,
            data: this.reactiveSchedule.schedule,
          })
        );
      } catch (e) {
        console.error("Lỗi khi lưu schedule:", e);
        toastr.error("Lỗi khi lưu thời khóa biểu!");
      }
    },

    resetSchedule() {
      try {
        localStorage.setItem("savedSchedule", JSON.stringify(defaultSchedule));
        this.reactiveSchedule.schedule = JSON.parse(JSON.stringify(defaultSchedule.data));
        toastr.success("Đã reset về thời khóa biểu mặc định");
      } catch (e) {
        console.error("Lỗi khi reset schedule:", e);
        toastr.error("Lỗi khi reset thời khóa biểu!");
      }
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
  border: 1px solid #151516;
  font-size: 14px;
  padding: 0.5rem;
  white-space: nowrap;
  text-align: center;
  vertical-align: middle;
}

.table td > div {
  min-height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

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

/* Thêm responsive cho mobile */
@media (max-width: 767.98px) {
  .table-responsive {
    width: 100%;
    margin-bottom: 1rem;
    overflow-y: hidden;
    -ms-overflow-style: -ms-autohiding-scrollbar;
    border: 1px solid #dee2e6;
  }

  .table {
    min-width: 600px;
  }

  .table th,
  .table td {
    font-size: 12px;
    padding: 0.3rem;
  }
}

@media (max-width: 575.98px) {
  .table th,
  .table td {
    font-size: 12px;
    padding: 0.3rem;
    min-width: 40px;
  }
}
</style>
