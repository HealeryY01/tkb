<template>
  <div class="container-fluid flex-grow-1 d-flex flex-column">
    <!-- TABLE TKB -->
    <div class="row flex-grow-1">
      <div class="col-12 col-lg-10 mx-auto border px-2 py-2">
        <div class="table-responsive">
          <!-- TABLE HEADER -->
          <table class="table table-bordered table-sm text-center mb-0">
            <thead>
              <tr>
                <th rowspan="2" colspan="2" class="align-middle">Lớp</th>
                <th colspan="6">Sáng</th>
                <th colspan="6">Chiều</th>
              </tr>
              <tr>
                <th v-for="cls in classes" :key="'s_' + cls">{{ cls }}</th>
                <th v-for="cls in classes" :key="'c_' + cls">{{ cls }}</th>
              </tr>
            </thead>

            <tbody class="tb">
              <template v-for="(dayName, dayIndex) in days">
                <tr v-for="period in 5" :key="`${dayIndex}-${period}`">
                  <td
                    v-if="period === 1"
                    :rowspan="5"
                    class="align-middle bg-light font-weight-bold"
                  >
                    {{ dayName }}
                  </td>
                  <td>{{ period }}</td>

                  <!-- Sáng -->
                  <td v-for="cls in classes" :key="'m_' + cls + '_' + period">
                    <div
                      draggable="true"
                      @dragstart="onDragStart(dayName, 'morning', period, cls)"
                      @dragover.prevent
                      @drop="onDrop(dayName, 'morning', period, cls)"
                      class="p-1"
                      style="min-height: 40px"
                      :title="getTeacher(dayName, 'morning', period, cls)"
                    >
                      {{ getSubject(dayName, "morning", period, cls) }}
                    </div>
                  </td>

                  <!-- Chiều -->
                  <td v-for="cls in classes" :key="'a_' + cls + '_' + period">
                    <div
                      draggable="true"
                      @dragstart="onDragStart(dayName, 'afternoon', period, cls)"
                      @dragover.prevent
                      @drop="onDrop(dayName, 'afternoon', period, cls)"
                      class="p-1"
                      style="min-height: 40px"
                      :title="getTeacher(dayName, 'afternoon', period, cls)"
                    >
                      {{ getSubject(dayName, "afternoon", period, cls) }}
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- MODAL: Xác nhận đổi tiết -->
    <div
      class="modal fade"
      id="confirmModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="confirmModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header bg-warning">
            <h5 class="modal-title">Xác nhận thay đổi tiết</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Đóng">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p><strong>Bạn có chắc chắn muốn đổi tiết học này?</strong></p>
            <p><span class="text-primary">Từ:</span> {{ swapInfoText.from }}</p>
            <p><span class="text-success">Sang:</span> {{ swapInfoText.to }}</p>

            <div class="row">
              <!-- Lịch của giáo viên gốc -->
              <div class="col-md-6 mb-3">
                <h6 class="text-info">Thời khóa biểu của {{ fromTeacher }}</h6>
                <div class="table-responsive custom-table-responsive">
                  <table class="table table-bordered table-sm text-center">
                    <thead>
                      <tr>
                        <th>Thứ / Tiết</th>
                        <th>Buổi</th>
                        <th v-for="p in 5" :key="'p_from_' + p">Tiết {{ p }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="day in days">
                        <tr :key="'from_' + day + '_morning'">
                          <td rowspan="2">{{ day }}</td>
                          <td>Sáng</td>
                          <td
                            v-for="p in 5"
                            :key="'from_m_' + p"
                            :class="{
                              'table-warning': isSwappingCell(
                                day,
                                'morning',
                                p,
                                fromTeacher
                              ),
                            }"
                          >
                            {{ getTeacherSubject(day, "morning", p, fromTeacher) }}
                          </td>
                        </tr>
                        <tr :key="'from_' + day + '_afternoon'">
                          <td>Chiều</td>
                          <td
                            v-for="p in 5"
                            :key="'from_a_' + p"
                            :class="{
                              'table-warning': isSwappingCell(
                                day,
                                'afternoon',
                                p,
                                fromTeacher
                              ),
                            }"
                          >
                            {{ getTeacherSubject(day, "afternoon", p, fromTeacher) }}
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Lịch của giáo viên muốn đổi -->
              <div class="col-md-6 mb-3">
                <h6 class="text-success">Thời khóa biểu của {{ toTeacher }}</h6>
                <div class="table-responsive custom-table-responsive">
                  <table class="table table-bordered table-sm text-center">
                    <thead>
                      <tr>
                        <th>Thứ / Tiết</th>
                        <th>Buổi</th>
                        <th v-for="p in 5" :key="'p_to_' + p">Tiết {{ p }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="day in days">
                        <tr :key="'to_' + day + '_morning'">
                          <td rowspan="2">{{ day }}</td>
                          <td>Sáng</td>
                          <td
                            v-for="p in 5"
                            :key="'to_m_' + p"
                            :class="{
                              'table-warning': isSwappingCell(
                                day,
                                'morning',
                                p,
                                toTeacher
                              ),
                            }"
                          >
                            {{ getTeacherSubject(day, "morning", p, toTeacher) }}
                          </td>
                        </tr>
                        <tr :key="'to_' + day + '_afternoon'">
                          <td>Chiều</td>
                          <td
                            v-for="p in 5"
                            :key="'to_a_' + p"
                            :class="{
                              'table-warning': isSwappingCell(
                                day,
                                'afternoon',
                                p,
                                toTeacher
                              ),
                            }"
                          >
                            {{ getTeacherSubject(day, "afternoon", p, toTeacher) }}
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">
              Hủy
            </button>
            <button type="button" class="btn btn-primary" @click="confirmSwap">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import $ from "jquery";

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
  name: "TKBtheoLop",
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
      days: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"],
      classes: ["1A", "1B", "1C", "2A", "2B", "2C"],
      dragData: null,
      swapInfo: null,
      swapInfoText: { from: "", to: "" },
      fromTeacher: "",
      toTeacher: "",
      reactiveSchedule,
    };
  },
  computed: {
    schedule() {
      return this.reactiveSchedule.schedule;
    },
  },
  methods: {
    // Các phương thức getter
    getSubject(day, session, period, cls) {
      return this.schedule?.[day]?.[session]?.[period]?.[cls]?.subject || "";
    },

    getTeacher(day, session, period, cls) {
      return this.schedule?.[day]?.[session]?.[period]?.[cls]?.teacher || "";
    },

    getTeacherSubject(day, session, period, teacher) {
      for (const cls of this.classes) {
        const cell = this.schedule?.[day]?.[session]?.[period]?.[cls];
        if (cell?.teacher === teacher) {
          return cell.subject || "";
        }
      }
      return "";
    },

    // Các phương thức xử lý drag-drop
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
        toastr.warning("Chỉ được di chuyển trong cùng một lớp!");
        this.dragData = null;
        return;
      }

      const fromVal =
        this.schedule?.[fromDay]?.[fromSession]?.[fromPeriod]?.[fromCls] || {};
      const toVal = this.schedule?.[day]?.[session]?.[period]?.[cls] || {};

      this.setSwapInfo(
        fromDay,
        fromSession,
        fromPeriod,
        fromCls,
        day,
        session,
        period,
        cls,
        fromVal,
        toVal
      );
      this.dragData = null;
    },

    setSwapInfo(
      fromDay,
      fromSession,
      fromPeriod,
      fromCls,
      toDay,
      toSession,
      toPeriod,
      toCls,
      fromVal,
      toVal
    ) {
      this.swapInfo = {
        fromDay,
        fromSession,
        fromPeriod,
        fromCls,
        toDay,
        toSession,
        toPeriod,
        toCls,
        fromVal,
        toVal,
      };

      this.swapInfoText = {
        from: `${fromVal.subject || "---"} (${fromVal.teacher || "---"})`,
        to: `${toVal.subject || "---"} (${toVal.teacher || "---"})`,
      };

      this.fromTeacher = fromVal.teacher || "---";
      this.toTeacher = toVal.teacher || "---";

      this.$nextTick(() => {
        $("#confirmModal").modal("show");
      });
    },

    // Các phương thức quản lý schedule
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

    // Xử lý confirm swap
    confirmSwap() {
      if (!this.swapInfo) return;

      const {
        fromDay,
        fromSession,
        fromPeriod,
        fromCls,
        toDay,
        toSession,
        toPeriod,
        toCls,
        fromVal,
        toVal,
      } = this.swapInfo;

      this.updateLesson(fromDay, fromSession, fromPeriod, fromCls, toVal);
      this.updateLesson(toDay, toSession, toPeriod, toCls, fromVal);

      this.swapInfo = null;
      $("#confirmModal").modal("hide");
      toastr.success("Đổi tiết thành công!");
    },

    isSwappingCell(day, session, period, teacher) {
      if (!this.swapInfo) return false;

      return (
        (day === this.swapInfo.fromDay &&
          session === this.swapInfo.fromSession &&
          period === this.swapInfo.fromPeriod &&
          teacher === this.swapInfo.fromVal.teacher) ||
        (day === this.swapInfo.toDay &&
          session === this.swapInfo.toSession &&
          period === this.swapInfo.toPeriod &&
          teacher === this.swapInfo.toVal.teacher)
      );
    },
  },
};
</script>

<style scoped>
/* Giữ nguyên các style như cũ */
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table {
  table-layout: fixed;
  width: 100%;
  min-width: 800px;
}

.tb {
  background-color: #e9b5795c;
}

.tb th,
.tb td {
  text-align: center;
  vertical-align: middle;
}

.tb td > div {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  height: 100%;
  text-align: center;
}

.table th,
.table td {
  font-size: 14px;
  padding: 0.4rem;
  word-break: break-word;
  min-width: 80px;
  border: 1px solid #68727b;
}

.table thead th {
  background-color: #b3e9ef;
  font-weight: bold;
}

.table tbody td:first-child {
  background-color: #f1f1f1;
}

.bg-light {
  background-color: #dab1a7a1 !important;
}

.modal-xl {
  max-width: 90vw;
  margin: 1rem auto;
}

/* Giới hạn chiều cao và cuộn dọc, cuộn ngang cho bảng */
.custom-table-responsive {
  max-height: 350px;
  overflow-x: auto;
  overflow-y: auto;
}

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
    min-width: 60px;
  }

  .modal .row > div {
    flex: 0 0 100% !important;
    max-width: 100% !important;
    margin-bottom: 1rem;
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
