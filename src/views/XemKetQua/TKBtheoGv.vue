<template>
  <div class="container-fluid mt-4">
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">Thời Khóa Biểu Giáo Viên</h4>
      </div>
      <div class="card-body p-0">
        <!-- Thông báo lỗi -->
        <div
          v-if="errorMessage"
          class="alert alert-danger alert-dismissible fade show m-3"
          role="alert"
        >
          {{ errorMessage }}
          <button type="button" class="close" @click="errorMessage = ''">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="table-responsive">
          <table class="table table-bordered mb-0">
            <thead>
              <tr>
                <th rowspan="3" class="sticky-column">Giáo viên</th>
                <th
                  v-for="day in days"
                  :key="'day-' + day.id"
                  :colspan="sessions.length * periods.length"
                >
                  {{ day.name }}
                </th>
              </tr>
              <tr>
                <template v-for="day in days">
                  <th
                    v-for="session in sessions"
                    :key="'session-' + day.id + '-' + session.type"
                    :colspan="periods.length"
                  >
                    {{ session.label }}
                  </th>
                </template>
              </tr>
              <tr>
                <template v-for="day in days">
                  <template v-for="session in sessions">
                    <th
                      v-for="period in periods"
                      :key="'period-' + day.id + '-' + session.type + '-' + period"
                    >
                      Tiết {{ period }}
                    </th>
                  </template>
                </template>
              </tr>
            </thead>

            <tbody>
              <tr v-for="teacher in teachers" :key="'teacher-' + teacher.id">
                <td class="teacher-name sticky-column">{{ teacher.name }}</td>
                <template v-for="day in days">
                  <template v-for="session in sessions">
                    <td
                      v-for="period in periods"
                      :key="
                        'cell-' +
                        teacher.id +
                        '-' +
                        day.id +
                        '-' +
                        session.type +
                        '-' +
                        period
                      "
                      @dragover.prevent="onDragOver($event)"
                      @dragenter.prevent="
                        onDragEnter($event, teacher.id, day.id, session.type, period)
                      "
                      @drop="onDrop($event, teacher.id, day.id, session.type, period)"
                      :class="{
                        'drop-target': isDropTarget(
                          teacher.id,
                          day.id,
                          session.type,
                          period
                        ),
                        'has-lesson': hasLesson(teacher.id, day.id, session.type, period),
                      }"
                    >
                      <template
                        v-if="
                          getTeacherLessons(teacher.id, day.id, session.type, period)
                            .length > 0
                        "
                      >
                        <div
                          v-for="lesson in getTeacherLessons(
                            teacher.id,
                            day.id,
                            session.type,
                            period
                          )"
                          :key="'lesson-' + lesson.id"
                          class="lesson-item"
                          draggable="true"
                          @dragstart="onDragStart($event, lesson)"
                          @dragend="onDragEnd($event)"
                        >
                          {{ getSubjectName(lesson.subjectId) }}<br />
                          {{ getClassName(lesson.classId) }}
                        </div>
                      </template>
                      <template v-else>
                        <div class="empty-slot"></div>
                      </template>
                    </td>
                  </template>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận thay đổi -->
    <div
      class="modal fade"
      id="confirmModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="confirmModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title font-weight-bold" id="confirmModalLabel">
              <i class="fas fa-exchange-alt mr-2"></i>Xác nhận thay đổi
            </h5>
            <button
              type="button"
              class="close text-white"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body" v-if="swapData">
            <!-- Tóm tắt -->
            <div class="swap-summary mb-4 p-3 bg-light rounded">
              <div class="row">
                <div class="col-md-6">
                  <div class="card border-primary">
                    <div class="card-header bg-primary text-white">
                      <h6 class="mb-0">
                        <i class="fas fa-arrow-circle-right mr-2"></i>Từ tiết
                      </h6>
                    </div>
                    <div class="card-body">
                      <h5 class="text-primary">
                        {{ getSubjectName(swapData.from.subjectId) }}
                      </h5>
                      <p class="mb-1">
                        <strong>Lớp:</strong> {{ getClassName(swapData.from.classId) }}
                      </p>
                      <p>
                        <strong>Thời gian:</strong> {{ getDayName(swapData.from.dayId) }},
                        {{ swapData.from.sessionType }}, Tiết {{ swapData.from.period }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="card border-success">
                    <div class="card-header bg-success text-white">
                      <h6 class="mb-0">
                        <i class="fas fa-arrow-circle-left mr-2"></i>Đến tiết
                      </h6>
                    </div>
                    <div class="card-body">
                      <h5 class="text-success">
                        {{
                          swapData.to.existingLesson
                            ? getSubjectName(swapData.to.existingLesson.subjectId)
                            : "Trống"
                        }}
                      </h5>
                      <p class="mb-1">
                        <strong>Lớp:</strong>
                        {{
                          swapData.to.existingLesson
                            ? getClassName(swapData.to.existingLesson.classId)
                            : "Trống"
                        }}
                      </p>
                      <p>
                        <strong>Thời gian:</strong> {{ getDayName(swapData.to.dayId) }},
                        {{ swapData.to.sessionType }}, Tiết {{ swapData.to.period }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <!-- Lịch lớp nguồn -->
              <div class="col-md-6 mb-3 mb-md-0">
                <div class="card h-100">
                  <div class="card-header bg-info text-white">
                    <h6 class="mb-0">
                      <i class="fas fa-calendar-alt mr-2"></i>
                      Lịch tuần của lớp {{ getClassName(swapData.from.classId) }}
                    </h6>
                  </div>
                  <div class="card-body p-0">
                    <div
                      class="table-responsive"
                      style="max-height: 300px; overflow-y: auto"
                    >
                      <table class="table table-sm table-bordered mb-0">
                        <thead class="thead-light">
                          <tr>
                            <th>Buổi</th>
                            <th>Tiết</th>
                            <th v-for="day in days" :key="`header-from-${day.id}`">
                              {{ day.name }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <!-- Buổi sáng -->
                          <tr
                            v-for="(period, index) in periods"
                            :key="`morning-from-${period}`"
                          >
                            <td
                              v-if="index === 0"
                              rowspan="5"
                              class="bg-light font-weight-bold"
                            >
                              Sáng
                            </td>
                            <td class="font-weight-bold">{{ period }}</td>
                            <td
                              v-for="day in days"
                              :key="`morning-from-${day.id}-${period}`"
                              :class="{
                                'bg-primary text-white': isCurrentCell(
                                  'Sáng',
                                  day.name,
                                  period,
                                  swapData.from
                                ),
                                'bg-success text-white': isCurrentCell(
                                  'Sáng',
                                  day.name,
                                  period,
                                  swapData.to
                                ),
                              }"
                            >
                              {{
                                getClassScheduleCell(
                                  "Sáng",
                                  day.name,
                                  period,
                                  swapData.from.classId
                                )
                              }}
                            </td>
                          </tr>

                          <!-- Buổi chiều -->
                          <tr
                            v-for="(period, index) in periods"
                            :key="`afternoon-from-${period}`"
                          >
                            <td
                              v-if="index === 0"
                              rowspan="5"
                              class="bg-light font-weight-bold"
                            >
                              Chiều
                            </td>
                            <td class="font-weight-bold">{{ period }}</td>
                            <td
                              v-for="day in days"
                              :key="`afternoon-from-${day.id}-${period}`"
                              :class="{
                                'bg-primary text-white': isCurrentCell(
                                  'Chiều',
                                  day.name,
                                  period,
                                  swapData.from
                                ),
                                'bg-success text-white': isCurrentCell(
                                  'Chiều',
                                  day.name,
                                  period,
                                  swapData.to
                                ),
                              }"
                            >
                              {{
                                getClassScheduleCell(
                                  "Chiều",
                                  day.name,
                                  period,
                                  swapData.from.classId
                                )
                              }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Lịch lớp đích -->
              <div class="col-md-6">
                <div class="card h-100">
                  <div class="card-header bg-warning text-dark">
                    <h6 class="mb-0">
                      <i class="fas fa-calendar-alt mr-2"></i>
                      Lịch tuần của lớp
                      {{
                        swapData.to.existingLesson
                          ? getClassName(swapData.to.existingLesson.classId)
                          : "Trống"
                      }}
                    </h6>
                  </div>
                  <div class="card-body p-0">
                    <div
                      class="table-responsive"
                      style="max-height: 300px; overflow-y: auto"
                    >
                      <table class="table table-sm table-bordered mb-0">
                        <thead class="thead-light">
                          <tr>
                            <th>Buổi</th>
                            <th>Tiết</th>
                            <th v-for="day in days" :key="`header-to-${day.id}`">
                              {{ day.name }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <!-- Buổi sáng -->
                          <tr
                            v-for="(period, index) in periods"
                            :key="`morning-to-${period}`"
                          >
                            <td
                              v-if="index === 0"
                              rowspan="5"
                              class="bg-light font-weight-bold"
                            >
                              Sáng
                            </td>
                            <td class="font-weight-bold">{{ period }}</td>
                            <td
                              v-for="day in days"
                              :key="`morning-to-${day.id}-${period}`"
                              :class="{
                                'bg-primary text-white': isCurrentCell(
                                  'Sáng',
                                  day.name,
                                  period,
                                  swapData.from
                                ),
                                'bg-success text-white': isCurrentCell(
                                  'Sáng',
                                  day.name,
                                  period,
                                  swapData.to
                                ),
                              }"
                            >
                              {{
                                swapData.to.existingLesson
                                  ? getClassScheduleCell(
                                      "Sáng",
                                      day.name,
                                      period,
                                      swapData.to.existingLesson.classId
                                    )
                                  : ""
                              }}
                            </td>
                          </tr>

                          <!-- Buổi chiều -->
                          <tr
                            v-for="(period, index) in periods"
                            :key="`afternoon-to-${period}`"
                          >
                            <td
                              v-if="index === 0"
                              rowspan="5"
                              class="bg-light font-weight-bold"
                            >
                              Chiều
                            </td>
                            <td class="font-weight-bold">{{ period }}</td>
                            <td
                              v-for="day in days"
                              :key="`afternoon-to-${day.id}-${period}`"
                              :class="{
                                'bg-primary text-white': isCurrentCell(
                                  'Chiều',
                                  day.name,
                                  period,
                                  swapData.from
                                ),
                                'bg-success text-white': isCurrentCell(
                                  'Chiều',
                                  day.name,
                                  period,
                                  swapData.to
                                ),
                              }"
                            >
                              {{
                                swapData.to.existingLesson
                                  ? getClassScheduleCell(
                                      "Chiều",
                                      day.name,
                                      period,
                                      swapData.to.existingLesson.classId
                                    )
                                  : ""
                              }}
                            </td>
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
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">
              <i class="fas fa-times mr-2"></i>Hủy
            </button>
            <button type="button" class="btn btn-primary" @click="confirmChange">
              <i class="fas fa-check mr-2"></i>Xác nhận thay đổi
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
  name: "TKBtheoGV",
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
      teachers: [
        { id: 1, name: "Lê Văn Bảy" },
        { id: 2, name: "Nguyễn Thị Bé" },
        { id: 3, name: "Nguyễn Văn Bình" },
        { id: 4, name: "Trần Quốc Bửu" },
        { id: 5, name: "Nguyễn Bá Cần" },
      ],
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
          id: 2,
          dayId: 1,
          sessionType: "Chiều",
          period: 1,
          classId: 2,
          subjectId: 2,
          teacherId: 1,
        },
        {
          id: 3,
          dayId: 1,
          sessionType: "Sáng",
          period: 2,
          classId: 1,
          subjectId: 2,
          teacherId: 3,
        },
        {
          id: 4,
          dayId: 2,
          sessionType: "Sáng",
          period: 2,
          classId: 1,
          subjectId: 2,
          teacherId: 2,
        },
        {
          id: 5,
          dayId: 3,
          sessionType: "Chiều",
          period: 3,
          classId: 2,
          subjectId: 3,
          teacherId: 3,
        },
      ],
      draggedLesson: null,
      currentDropTarget: null,
      errorMessage: "",
      swapData: null,
    };
  },
  methods: {
    getTeacherLessons(teacherId, dayId, sessionType, period) {
      return this.schedule.filter(
        (lesson) =>
          lesson.teacherId === teacherId &&
          lesson.dayId === dayId &&
          lesson.sessionType === sessionType &&
          lesson.period === period
      );
    },

    hasLesson(teacherId, dayId, sessionType, period) {
      return this.getTeacherLessons(teacherId, dayId, sessionType, period).length > 0;
    },

    getSubjectName(subjectId) {
      const subject = this.subjects.find((s) => s.id === subjectId);
      return subject ? subject.name : "";
    },

    getClassName(classId) {
      for (const grade of this.grades) {
        const cls = grade.classes.find((c) => c.id === classId);
        if (cls) return cls.name;
      }
      return "";
    },

    getDayName(dayId) {
      const day = this.days.find((d) => d.id === dayId);
      return day ? day.name : "";
    },

    getTeacherName(teacherId) {
      const teacher = this.teachers.find((t) => t.id === teacherId);
      return teacher ? teacher.name : "";
    },

    // Drag and Drop methods
    onDragStart(event, lesson) {
      this.draggedLesson = lesson;
      event.target.classList.add("dragging");
      event.dataTransfer.setData("text/plain", lesson.id);
      event.dataTransfer.effectAllowed = "move";
      this.errorMessage = "";
    },

    isCurrentCell(sessionType, dayName, period, refData) {
      return (
        this.getDayName(refData.dayId) === dayName &&
        refData.sessionType === sessionType &&
        refData.period === period
      );
    },

    getClassScheduleCell(sessionType, dayName, period, classId) {
      if (!classId) return "";

      const lesson = this.schedule.find(
        (l) =>
          l.classId === classId &&
          this.getDayName(l.dayId) === dayName &&
          l.sessionType === sessionType &&
          l.period === period
      );
      return lesson
        ? `${this.getSubjectName(lesson.subjectId)} - ${this.getTeacherName(
            lesson.teacherId
          )}`
        : "";
    },

    onDragEnd(event) {
      event.target.classList.remove("dragging");
      this.currentDropTarget = null;
    },

    onDragOver(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },

    onDragEnter(event, teacherId, dayId, sessionType, period) {
      event.preventDefault();
      this.currentDropTarget = { teacherId, dayId, sessionType, period };
    },

    isDropTarget(teacherId, dayId, sessionType, period) {
      if (!this.currentDropTarget || !this.draggedLesson) return false;

      return (
        this.currentDropTarget.teacherId === teacherId &&
        this.currentDropTarget.dayId === dayId &&
        this.currentDropTarget.sessionType === sessionType &&
        this.currentDropTarget.period === period
      );
    },

    onDrop(event, teacherId, dayId, sessionType, period) {
      event.preventDefault();

      if (!this.draggedLesson) {
        this.showError("Không có tiết học nào được chọn để di chuyển");
        return;
      }

      //  Không cho phép kéo đến ô của giáo viên khác
      if (this.draggedLesson.teacherId !== teacherId) {
        this.showError("Chỉ được kéo thả trong cùng một giáo viên");
        return;
      }

      // Không cho phép kéo vào đúng vị trí hiện tại
      if (
        this.draggedLesson.dayId === dayId &&
        this.draggedLesson.sessionType === sessionType &&
        this.draggedLesson.period === period
      ) {
        return;
      }

      const existingLesson = this.schedule.find(
        (l) =>
          l.teacherId === teacherId &&
          l.dayId === dayId &&
          l.sessionType === sessionType &&
          l.period === period
      );

      // Không được chồng lớp nếu cùng lớp đã có giáo viên khác
      if (!existingLesson) {
        const classConflict = this.schedule.some(
          (l) =>
            l.classId === this.draggedLesson.classId &&
            l.dayId === dayId &&
            l.sessionType === sessionType &&
            l.period === period &&
            l.teacherId !== teacherId
        );

        if (classConflict) {
          this.showError("Lớp này đã có giáo viên khác dạy vào tiết này");
          return;
        }
      }

      this.swapData = {
        from: { ...this.draggedLesson },
        to: {
          teacherId,
          dayId,
          sessionType,
          period,
          existingLesson: existingLesson ? { ...existingLesson } : null,
        },
      };

      $("#confirmModal").modal("show");
    },

    checkConflict(teacherId, dayId, sessionType, period) {
      // Chỉ kiểm tra xung đột khi không phải hoán đổi 2 tiết cùng giáo viên
      if (!this.swapData.to.existingLesson) {
        // Kiểm tra xem giáo viên đã có tiết nào vào thời điểm này chưa
        const teacherConflict = this.schedule.some(
          (l) =>
            l.teacherId === teacherId &&
            l.dayId === dayId &&
            l.sessionType === sessionType &&
            l.period === period
        );

        if (teacherConflict) {
          return "Giáo viên đã có tiết học vào thời điểm này";
        }

        // Kiểm tra xem lớp đã có giáo viên khác dạy vào thời điểm này chưa
        const classConflict = this.schedule.some(
          (l) =>
            l.classId === this.draggedLesson.classId &&
            l.dayId === dayId &&
            l.sessionType === sessionType &&
            l.period === period &&
            l.teacherId !== teacherId
        );

        if (classConflict) {
          return "Lớp này đã có giáo viên khác dạy vào tiết này";
        }
      }

      return null;
    },

    confirmChange() {
      if (!this.swapData || !this.draggedLesson) return;

      const fromLessonId = this.draggedLesson.id;
      const toLessonId = this.swapData.to?.existingLesson?.id;

      // Tìm index trong lịch học
      const fromIndex = this.schedule.findIndex((item) => item.id === fromLessonId);
      const toIndex = this.schedule.findIndex((item) => item.id === toLessonId);

      // Tạo bản sao để giữ reactivity
      const newSchedule = [...this.schedule];

      if (fromIndex !== -1) {
        // Cập nhật tiết bị kéo sang vị trí mới
        newSchedule[fromIndex] = {
          ...newSchedule[fromIndex],
          dayId: this.swapData.to.dayId,
          sessionType: this.swapData.to.sessionType,
          period: this.swapData.to.period,
          teacherId: this.swapData.to.teacherId,
        };

        // Nếu có tiết đang nằm ở vị trí đích, thì hoán đổi nó về vị trí gốc
        if (toIndex !== -1) {
          newSchedule[toIndex] = {
            ...newSchedule[toIndex],
            dayId: this.swapData.from.dayId,
            sessionType: this.swapData.from.sessionType,
            period: this.swapData.from.period,
          };
        }

        this.schedule = newSchedule;
      }

      $("#confirmModal").modal("hide");
      this.draggedLesson = null;
      this.swapData = null;
      this.$forceUpdate();
    },
    showError(message, duration = 3000) {
      this.errorMessage = message;
      if (duration > 0) {
        setTimeout(() => {
          this.errorMessage = "";
        }, duration);
      }
    },
  },
};
</script>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 0.25rem;
}

.card-header {
  padding: 0.75rem 1.25rem;
}

.table {
  font-size: 14px;
  margin-bottom: 0;
}

.table th {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 0.5rem;
  text-align: center;
  vertical-align: middle;
}

.table td {
  border: 1px solid #dee2e6;
  height: 80px;
  padding: 0.25rem;
  vertical-align: top;
  transition: background-color 0.2s;
}

.table td.drop-target {
  background-color: #e9f7ef;
  box-shadow: inset 0 0 0 2px #28a745;
}

.table td.has-lesson {
  background-color: #e3f2fd;
}

.teacher-name {
  font-weight: bold;
  min-width: 150px;
  white-space: nowrap;
}

.sticky-column {
  background-color: #fff;
  position: sticky;
  left: 0;
  z-index: 1;
}

.table-responsive {
  overflow-x: auto;
  max-height: 80vh;
  scroll-behavior: smooth;
}

.lesson-item {
  height: 100%;
  padding: 0.25rem;
  margin: 0.1rem;
  border-radius: 0.2rem;
  background-color: #d1e7ff;
  cursor: move;
  text-align: center;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.lesson-item.dragging {
  opacity: 0.5;
  background-color: #bbdefb;
}

.empty-slot {
  height: 100%;
  min-height: 50px;
}

/* Animation for drag and drop */
@keyframes pulse {
  0% {
    background-color: #e9f7ef;
  }
  50% {
    background-color: #d4edda;
  }
  100% {
    background-color: #e9f7ef;
  }
}

.drop-target {
  animation: pulse 1s infinite;
}

/* Alert styles */
.alert {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1050;
  min-width: 300px;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
