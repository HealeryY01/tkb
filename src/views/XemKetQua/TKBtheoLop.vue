<template>
  <div class="container-fluid mt-3">
    <div v-for="grade in grades" :key="grade.id" class="mb-5">
      <h4>{{ grade.name }}</h4>
      <div v-for="classItem in grade.classes" :key="classItem.id" class="mb-4">
        <h5>Lớp {{ classItem.name }}</h5>
        <div class="table-responsive">
          <table class="table table-bordered table-sm text-center align-middle">
            <thead class="thead-light">
              <tr>
                <th rowspan="2" style="width: 80px;">Buổi</th>
                <th rowspan="2" style="width: 50px;">Tiết/Thứ</th>
                <th colspan="5" class="text-center">Lớp {{ classItem.name }}</th>
              </tr>
              <tr>
                <th v-for="day in days" :key="day.id" class="text-center">
                  {{ day.name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="session in sessions">
                <tr v-for="period in periods" :key="`${session.type}-${period}`">
                  <td v-if="period === 1" :rowspan="periods.length" class="align-middle font-weight-bold">
                    {{ session.label }}
                  </td>
                  <td>{{ period }}</td>
                  <template v-for="day in days">
                    <td :key="`${day.id}-${period}`" @dragover.prevent
                      @drop="handleDrop(day, session, period, classItem)" style="cursor: grab; height: 50px;">
                      <div class="p-2 bg-light rounded" draggable="true"
                        @dragstart="handleDragStart(day, session, period, classItem)">
                        <span v-if="getLesson(day, session, period, classItem)">
                          {{ getSubjectName(day, session, period, classItem) }}
                          <br />
                          <small class="text-primary">
                            ({{ getTeacherName(day, session, period, classItem) }})
                          </small>
                        </span>
                        <span v-else class="text-muted">-</span>
                      </div>
                    </td>
                  </template>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal đổi tiết -->
    <div ref="swapModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="swapModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title font-weight-bold" id="swapModalLabel">
              <i class="fas fa-exchange-alt mr-2"></i>Xác nhận đổi tiết
            </h5>
            <button type="button" class="close text-white" @click="cancelSwap" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body" v-if="swapData">
            <div class="swap-summary mb-4 p-3 bg-light rounded">
              <div class="row">
                <div class="col-md-6">
                  <div class="card border-primary">
                    <div class="card-header bg-primary text-white">
                      <h6 class="mb-0"><i class="fas fa-arrow-circle-right mr-2"></i>Từ tiết</h6>
                    </div>
                    <div class="card-body">
                      <h5 class="text-primary">{{ swapData.from.subjectName }}</h5>
                      <p class="mb-1"><strong>Giáo viên:</strong> {{ swapData.from.teacherName }}</p>
                      <p class="mb-1"><strong>Lớp:</strong> {{ getClassName(swapData.from.classId) }}</p>
                      <p><strong>Thời gian:</strong> {{ getDayName(swapData.from.dayId) }}, {{ swapData.from.sessionType
                      }},
                        Tiết {{ swapData.from.period }}</p>
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="card border-success">
                    <div class="card-header bg-success text-white">
                      <h6 class="mb-0"><i class="fas fa-arrow-circle-left mr-2"></i>Đến tiết</h6>
                    </div>
                    <div class="card-body">
                      <h5 class="text-success">{{ swapData.to.subjectName || "Trống" }}</h5>
                      <p class="mb-1"><strong>Giáo viên:</strong> {{ swapData.to.teacherName || "Trống" }}</p>
                      <p class="mb-1"><strong>Lớp:</strong> {{ swapData.to.classId ? getClassName(swapData.to.classId) :
                        "Trống" }}</p>
                      <p><strong>Thời gian:</strong> {{ getDayName(swapData.to.dayId) }}, {{ swapData.to.sessionType }},
                        Tiết {{ swapData.to.period }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3 mb-md-0">
                <div class="card h-100">
                  <div class="card-header bg-info text-white">
                    <h6 class="mb-0">
                      <i class="fas fa-calendar-alt mr-2"></i>
                      Lịch tuần của {{ swapData.from.teacherName }}
                    </h6>
                  </div>
                  <div class="card-body p-0">
                    <div class="table-responsive" style="max-height: 300px; overflow-y: auto;">
                      <table class="table table-sm table-hover mb-0">
                        <thead class="thead-light sticky-top">
                          <tr>
                            <th width="15%">Thứ</th>
                            <th width="15%">Buổi</th>
                            <th width="15%">Tiết</th>
                            <th width="25%">Lớp</th>
                            <th width="30%">Môn học</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in getScheduleByTeacher(swapData.from.teacherId)" :key="item.id"
                            :class="{ 'table-primary': item.id === swapData.from.id }">
                            <td><strong>{{ getDayName(item.dayId) }}</strong></td>
                            <td>{{ item.sessionType }}</td>
                            <td>Tiết {{ item.period }}</td>
                            <td><em>{{ getClassName(item.classId) }}</em></td>
                            <td>{{ getSubjectNameById(item.subjectId) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="card h-100">
                  <div class="card-header bg-info text-white">
                    <h6 class="mb-0">
                      <i class="fas fa-calendar-alt mr-2"></i>
                      Lịch tuần của {{ swapData.to.teacherName || "Trống" }}
                    </h6>
                  </div>
                  <div class="card-body p-0">
                    <div class="table-responsive" style="max-height: 300px; overflow-y: auto;">
                      <table class="table table-sm table-hover mb-0">
                        <thead class="thead-light sticky-top">
                          <tr>
                            <th width="15%">Thứ</th>
                            <th width="15%">Buổi</th>
                            <th width="15%">Tiết</th>
                            <th width="25%">Lớp</th>
                            <th width="30%">Môn học</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in getScheduleByTeacher(swapData.to.teacherId)" :key="item.id"
                            :class="{ 'table-success': item.id === swapData.to.id }">
                            <td><strong>{{ getDayName(item.dayId) }}</strong></td>
                            <td>{{ item.sessionType }}</td>
                            <td>Tiết {{ item.period }}</td>
                            <td><em>{{ getClassName(item.classId) }}</em></td>
                            <td>{{ getSubjectNameById(item.subjectId) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="cancelSwap">
              <i class="fas fa-times mr-2"></i>Hủy
            </button>
            <button type="button" class="btn btn-primary" @click="confirmSwap">
              <i class="fas fa-check mr-2"></i>Xác nhận đổi tiết
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Thêm modal thông báo lỗi -->
    <div ref="errorModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="errorModalLabel"
      aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="errorModalLabel">Không thể đổi tiết</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Bạn chỉ có thể đổi các tiết trong cùng một lớp!</p>
            <p>Không thể đổi tiết giữa các lớp khác nhau.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "TKBtheolop",
  data() {
    return {
      days: [
        { id: 1, name: "Thứ 2" },
        { id: 2, name: "Thứ 3" },
        { id: 3, name: "Thứ 4" },
        { id: 4, name: "Thứ 5" },
        { id: 5, name: "Thứ 6" },
      ],
      sessions: [
        { type: "Sáng", label: "Sáng" },
        { type: "Chiều", label: "Chiều" },
      ],
      periods: [1, 2, 3, 4, 5],
      grades: [
        {
          id: 1,
          name: "Khối 1",
          classes: [
            { id: 1, name: "1A" },
            { id: 2, name: "1B" },
          ],
        },
        {
          id: 2,
          name: "Khối 2",
          classes: [
            { id: 3, name: "2A" },
            { id: 4, name: "2B" },
          ],
        },
      ],
      subjects: [
        { id: 1, name: "Toán" },
        { id: 2, name: "Văn" },
        { id: 3, name: "Anh" },
        { id: 4, name: "Lý" },
      ],
      teachers: [
        { id: 1, name: "GV A" },
        { id: 2, name: "GV B" },
        { id: 3, name: "GV C" },
        { id: 4, name: "GV D" },
      ],
      schedule: [
        {
          id: 1,
          dayId: 1,
          sessionType: "Sáng",
          period: 1,
          classId: 1,
          subjectId: 1,
          teacherId: 1,
        },
        {
          id: 1,
          dayId: 1,
          sessionType: "Sáng",
          period: 2,
          classId: 1,
          subjectId: 2,
          teacherId: 3,
        },
        {
          id: 2,
          dayId: 2,
          sessionType: "Sáng",
          period: 2,
          classId: 1,
          subjectId: 2,
          teacherId: 2,
        },
        {
          id: 3,
          dayId: 3,
          sessionType: "Chiều",
          period: 3,
          classId: 2,
          subjectId: 3,
          teacherId: 3,
        },
      ],
      dragData: null,
      swapData: null,
    };
  },
  methods: {
    getLesson(day, session, period, cls) {
      return this.schedule.find(
        (item) =>
          item.dayId === day.id &&
          item.sessionType === session.type &&
          item.period === period &&
          item.classId === cls.id
      );
    },
    getSubjectName(day, session, period, classItem) {
      const lesson = this.getLesson(day, session, period, classItem);
      if (lesson) {
        const subject = this.subjects.find((s) => s.id === lesson.subjectId);
        return subject ? subject.name : "";
      }
      return "";
    },
    getTeacherName(day, session, period, classItem) {
      const lesson = this.getLesson(day, session, period, classItem);
      if (lesson) {
        const teacher = this.teachers.find((t) => t.id === lesson.teacherId);
        return teacher ? teacher.name : "";
      }
      return "";
    },
    getSubjectNameById(subjectId) {
      const subject = this.subjects.find((s) => s.id === subjectId);
      return subject ? subject.name : "";
    },
    getDayName(dayId) {
      const day = this.days.find((d) => d.id === dayId);
      return day ? day.name : "";
    },
    getClassName(classId) {
      const cls = this.grades
        .flatMap((g) => g.classes)
        .find((c) => c.id === classId);
      return cls ? cls.name : "";
    },
    handleDragStart(day, session, period, cls) {
      const lesson = this.getLesson(day, session, period, cls);
      this.dragData = {
        day,
        session,
        period,
        cls,
        lesson,
      }; // Lưu thông tin từ vị trí kéo (kể cả khi lesson trống)
    },

    handleDrop(day, session, period, cls) {
      if (!this.dragData) return;
      // Kiểm tra xem có cùng lớp không
      if (this.dragData.cls.id !== cls.id) {
        $(this.$refs.errorModal).modal("show");
        this.dragData = null;
        return;
      }
      const targetLesson = this.getLesson(day, session, period, cls);

      // Cập nhật swapData để hiển thị modal xác nhận
      this.swapData = {
        from: this.dragData.lesson
          ? {
            ...this.dragData.lesson,
            teacherName: this.getTeacherName(
              this.dragData.day,
              this.dragData.session,
              this.dragData.period,
              this.dragData.cls
            ),
            subjectName: this.getSubjectName(
              this.dragData.day,
              this.dragData.session,
              this.dragData.period,
              this.dragData.cls
            ),
            teacherId: this.dragData.lesson.teacherId,
          }
          : {
            teacherName: null,
            subjectName: null,
            teacherId: null,
            dayId: this.dragData.day.id,
            sessionType: this.dragData.session.type,
            period: this.dragData.period,
            classId: this.dragData.cls.id,
          },
        to: targetLesson
          ? {
            ...targetLesson,
            teacherName: this.getTeacherName(day, session, period, cls),
            subjectName: this.getSubjectName(day, session, period, cls),
            teacherId: targetLesson.teacherId,
          }
          : {
            teacherName: null,
            subjectName: null,
            teacherId: null,
          },
        fromPos: {
          day: this.dragData.day,
          session: this.dragData.session,
          period: this.dragData.period,
          cls: this.dragData.cls,
        },
        toPos: {
          day,
          session,
          period,
          cls,
        },
      };

      $(this.$refs.swapModal).modal("show");
    },
    cancelSwap() {
      this.swapData = null;
      this.dragData = null;
      $(this.$refs.swapModal).modal("hide");
    },
    confirmSwap() {
      if (!this.swapData) return;

      const fromLesson = this.swapData.from.teacherId
        ? this.schedule.find(
          (item) =>
            item.dayId === this.swapData.from.dayId &&
            item.sessionType === this.swapData.from.sessionType &&
            item.period === this.swapData.from.period &&
            item.classId === this.swapData.from.classId
        )
        : null;

      const toLesson = this.swapData.to.teacherId
        ? this.schedule.find(
          (item) =>
            item.dayId === this.swapData.to.dayId &&
            item.sessionType === this.swapData.to.sessionType &&
            item.period === this.swapData.to.period &&
            item.classId === this.swapData.to.classId
        )
        : null;

      let newSchedule = [...this.schedule];

      if (fromLesson && toLesson) {
        // Hoán đổi giữa 2 tiết
        const fromIndex = newSchedule.indexOf(fromLesson);
        const toIndex = newSchedule.indexOf(toLesson);

        // Hoán đổi dữ liệu
        const temp = {
          dayId: fromLesson.dayId,
          sessionType: fromLesson.sessionType,
          period: fromLesson.period,
          classId: fromLesson.classId,
        };

        newSchedule[fromIndex].dayId = toLesson.dayId;
        newSchedule[fromIndex].sessionType = toLesson.sessionType;
        newSchedule[fromIndex].period = toLesson.period;
        newSchedule[fromIndex].classId = toLesson.classId;

        newSchedule[toIndex].dayId = temp.dayId;
        newSchedule[toIndex].sessionType = temp.sessionType;
        newSchedule[toIndex].period = temp.period;
        newSchedule[toIndex].classId = temp.classId;
      } else if (fromLesson) {
        // Di chuyển tiết từ from sang to
        const fromIndex = newSchedule.indexOf(fromLesson);
        newSchedule[fromIndex] = {
          ...newSchedule[fromIndex],
          dayId: this.swapData.toPos.day.id,
          sessionType: this.swapData.toPos.session.type,
          period: this.swapData.toPos.period,
          classId: this.swapData.toPos.cls.id,
        };
      } else if (toLesson) {
        // Di chuyển tiết từ to sang from
        const toIndex = newSchedule.indexOf(toLesson);
        newSchedule[toIndex] = {
          ...newSchedule[toIndex],
          dayId: this.swapData.fromPos.day.id,
          sessionType: this.swapData.fromPos.session.type,
          period: this.swapData.fromPos.period,
          classId: this.swapData.fromPos.cls.id,
        };
      }

      this.schedule = newSchedule;
      this.cancelSwap();
    },
    getScheduleByTeacher(teacherId) {
      if (!teacherId) return [];
      return this.schedule
        .filter((item) => item.teacherId === teacherId)
        .sort((a, b) => a.dayId - b.dayId || a.period - b.period);
    },
    isHighlight(item, swapInfo) {
      return (
        item.dayId === swapInfo.dayId &&
        item.period === swapInfo.period &&
        item.classId === swapInfo.classId &&
        item.subjectId === swapInfo.subjectId
      );
    },
  },
};
</script>

<style scoped>
table {
  table-layout: fixed;
  word-wrap: break-word;
  font-size: 0.9rem;
}

td,
th {
  vertical-align: middle !important;
  padding: 0.35rem !important;
}

div[draggable="true"] {
  cursor: grab;
  user-select: none;
}

div[draggable="true"]:active {
  cursor: grabbing;
}

.modal-lg {
  max-width: 900px;
}
</style>
