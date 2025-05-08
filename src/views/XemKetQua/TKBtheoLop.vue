<template>
  <div class="row flex-grow-1">
    <!-- Main Content -->
    <div class="col-md-10 border">
      <div class="table-responsive">
        <table class="table table-bordered text-center mb-0">
          <thead>
            <tr>
              <th rowspan="2" colspan="2" class="align-middle">Lớp</th>
              <th colspan="6" class="text-center">Sáng</th>
              <th colspan="6" class="text-center">Chiều</th>
            </tr>
            <tr>
              <th v-for="cls in classes" :key="'s_' + cls">{{ cls }}</th>
              <th v-for="cls in classes" :key="'c_' + cls">{{ cls }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(dayName, dayIndex) in days">
              <tr v-for="period in 5" :key="`${dayIndex}-${period}`">
                <!-- Cột "Thứ" và số tiết -->
                <td v-if="period === 1" :rowspan="5" class="align-middle bg-light font-weight-bold"
                  style="text-align: center">
                  {{ dayName }}
                </td>
                <td class="text-center">{{ period }}</td>

                <!-- Các cột cho tiết sáng -->
                <td v-for="cls in classes" :key="'m_' + cls + '_' + period">
                  <div draggable="true" @dragstart="onDragStart(dayName, 'morning', period, cls)" @dragover.prevent
                    @drop="onDrop(dayName, 'morning', period, cls)" class="p-1" style="min-height: 40px">
                    {{ schedule[dayName]?.morning?.[period]?.[cls] || "" }}
                  </div>
                </td>

                <!-- Các cột cho tiết chiều -->
                <td v-for="cls in classes" :key="'a_' + cls + '_' + period">
                  <div draggable="true" @dragstart="onDragStart(dayName, 'afternoon', period, cls)" @dragover.prevent
                    @drop="onDrop(dayName, 'afternoon', period, cls)" class="p-1" style="min-height: 40px">
                    {{ schedule[dayName]?.afternoon?.[period]?.[cls] || "" }}
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { getSchedule, saveSchedule } from "@/data/sharedSchedule";

export default {
  name: "TKBtheoLop",
  data() {
    return {
      days: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"],
      classes: ["1A", "1B", "1C", "2A", "2B", "2C"],
      schedule: getSchedule(),
      dragData: null,
    };
  },
  methods: {
    onDragStart(day, session, period, cls) {
      this.dragData = { day, session, period, cls };
    },
    onDrop(day, session, period, cls) {
      if (!this.dragData) return;

      const { day: fromDay, session: fromSession, period: fromPeriod, cls: fromCls } = this.dragData;

      const fromVal = this.schedule[fromDay]?.[fromSession]?.[fromPeriod]?.[fromCls] || "";
      const toVal = this.schedule[day]?.[session]?.[period]?.[cls] || "";

      this.updateLesson(fromDay, fromSession, fromPeriod, fromCls, toVal);
      this.updateLesson(day, session, period, cls, fromVal);

      this.dragData = null;
    },
    updateLesson(day, session, period, cls, value) {
      if (!this.schedule[day]) this.$set(this.schedule, day, {});
      if (!this.schedule[day][session]) this.$set(this.schedule[day], session, {});
      if (!this.schedule[day][session][period]) this.$set(this.schedule[day][session], period, {});
      this.$set(this.schedule[day][session][period], cls, value);
      saveSchedule(this.schedule);
    },
    resetSchedule() {
      localStorage.removeItem("savedSchedule");
      this.schedule = getSchedule(); // reset lại dữ liệu gốc
    },
  },
};
</script>

<style scoped>
.table {
  table-layout: auto;
  width: auto;
}

.table th,
.table td {
  vertical-align: middle;
  border: 1px solid #dee2e6;
  font-size: 14px;
  padding: 0.5rem;
  white-space: normal;
  word-break: break-word;
  min-width: 100px;
  max-width: 200px;
}


.table thead th {
  background-color: #f0f8ff;
  font-weight: bold;
  text-align: center;
}

.table tbody td:first-child {
  background-color: #f1f1f1;
}

.bg-light {
  background-color: #f8f9fa !important;
}
</style>
