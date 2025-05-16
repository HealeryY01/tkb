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
import scheduleStore from "@/stores/scheduleStore";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import $ from "jquery";

export default {
  name: "TKBtheoLop",
  data() {
    return {
      days: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"],
      classes: ["1A", "1B", "1C", "2A", "2B", "2C"],
      dragData: null,
      swapInfo: null,
      swapInfoText: {
        from: "",
        to: "",
      },
      fromTeacher: "",
      toTeacher: "",
      schedule: scheduleStore.schedule,
    };
  },
  methods: {
    getSubject(day, session, period, cls) {
      return this.schedule?.[day]?.[session]?.[period]?.[cls]?.subject || "";
    },
    getTeacher(day, session, period, cls) {
      return this.schedule?.[day]?.[session]?.[period]?.[cls]?.teacher || "";
    },
    getTeacherSubject(day, session, period, teacher) {
      for (let cls of this.classes) {
        const cell = this.schedule?.[day]?.[session]?.[period]?.[cls];
        if (cell?.teacher === teacher) {
          return cell.subject || "";
        }
      }
      return "";
    },
    isSwappingCell(day, session, period, teacher) {
      if (!this.swapInfo) return false;

      const isFromCell =
        day === this.swapInfo.fromDay &&
        session === this.swapInfo.fromSession &&
        period === this.swapInfo.fromPeriod &&
        teacher === this.swapInfo.fromVal.teacher;

      const isToCell =
        day === this.swapInfo.toDay &&
        session === this.swapInfo.toSession &&
        period === this.swapInfo.toPeriod &&
        teacher === this.swapInfo.toVal.teacher;

      return isFromCell || isToCell;
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
        this.schedule?.[fromDay]?.[fromSession]?.[fromPeriod]?.[fromCls] || {};
      const toVal = this.schedule?.[day]?.[session]?.[period]?.[cls] || {};

      this.swapInfo = {
        fromDay,
        fromSession,
        fromPeriod,
        fromCls,
        toDay: day,
        toSession: session,
        toPeriod: period,
        toCls: cls,
        fromVal,
        toVal,
      };

      this.swapInfoText.from = `${fromVal.subject || "---"} (${
        fromVal.teacher || "---"
      })`;
      this.swapInfoText.to = `${toVal.subject || "---"} (${toVal.teacher || "---"})`;

      this.fromTeacher = fromVal.teacher || "---";
      this.toTeacher = toVal.teacher || "---";

      $("#confirmModal").modal("show");
      this.dragData = null;
    },
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

      scheduleStore.updateLesson(fromDay, fromSession, fromPeriod, fromCls, toVal);
      scheduleStore.updateLesson(toDay, toSession, toPeriod, toCls, fromVal);

      this.schedule = scheduleStore.schedule;
      this.swapInfo = null;

      $("#confirmModal").modal("hide");
      toastr.success("Đổi tiết thành công!");
    },
    resetSchedule() {
      scheduleStore.reset();
      this.schedule = scheduleStore.schedule;
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
@media (max-width: 768px) {
  .modal .row > div {
    flex: 0 0 100% !important;
    max-width: 100% !important;
    margin-bottom: 1rem;
  }
  .table th,
  .table td {
    font-size: 12px;
    padding: 0.3rem;
    min-width: 40px;
  }
}
</style>
