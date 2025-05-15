<template>
  <div class="container-fluid flex-grow-1 d-flex flex-column">
    <div class="row flex-grow-1">
      <div class="col-12 col-lg-10 mx-auto border px-2 py-2">
        <div class="table-responsive">
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

                  <!-- Tiết sáng -->
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

                  <!-- Tiết chiều -->
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
  </div>
</template>

<script>
import scheduleStore from "@/stores/scheduleStore";
import toastr from "toastr";

export default {
  name: "TKBtheoLop",
  data() {
    return {
      days: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"],
      classes: ["1A", "1B", "1C", "2A", "2B", "2C"],
      dragData: null,
      schedule: scheduleStore.schedule, // Gán lúc khởi tạo
    };
  },
  methods: {
    getSubject(day, session, period, cls) {
      return this.schedule?.[day]?.[session]?.[period]?.[cls]?.subject || "";
    },
    getTeacher(day, session, period, cls) {
      return this.schedule?.[day]?.[session]?.[period]?.[cls]?.teacher || "";
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
        toastr.warning("Chỉ được di chuyển trong cùng một lớp!");
        this.dragData = null;
        return;
      }

      const fromVal =
        this.schedule?.[fromDay]?.[fromSession]?.[fromPeriod]?.[fromCls] || null;
      const toVal = this.schedule?.[day]?.[session]?.[period]?.[cls] || null;

      scheduleStore.updateLesson(fromDay, fromSession, fromPeriod, fromCls, toVal);
      scheduleStore.updateLesson(day, session, period, cls, fromVal);

      this.dragData = null;

      // Cập nhật lại data reactive trong component để Vue render
      this.schedule = scheduleStore.schedule;
    },
    resetSchedule() {
      scheduleStore.reset();
      this.schedule = scheduleStore.schedule; // Đồng bộ lại sau reset
    },
  },
};
</script>

<style scoped>
.table-responsive {
  overflow-x: auto;
}

.table {
  table-layout: auto;
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
  min-height: 40px; /*có thể điều chỉnh */
  height: 100%;
  text-align: center;
}

.table th,
.table td {
  font-size: 14px;
  padding: 0.4rem;
  word-break: break-word;
  min-width: 80px;
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

@media (max-width: 768px) {
  .table {
    min-width: 600px;
  }

  .table th,
  .table td {
    font-size: 12px;
    padding: 0.3rem;
    min-width: 60px;
  }
}
</style>
