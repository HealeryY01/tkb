<template>
  <div class="container-fluid mt-4">
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">Thời Khóa Biểu Giáo Viên</h4>
      </div>
      <div class="card-body p-0">
        <!-- Thêm thông báo lỗi -->
        <div
          v-if="errorMessage"
          class="alert alert-danger alert-dismissible fade show m-3"
          role="alert"
        >
          {{ errorMessage }}
        </div>

        <div class="table-responsive">
          <table class="table table-bordered mb-0">
            <!-- Phần header giữ nguyên như cũ -->
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

            <!-- Phần body với các sự kiện drag/drop -->
            <tbody>
              <tr v-for="teacher in teachers" :key="'teacher-' + teacher.id">
                <td class="teacher-name sticky-column">{{ teacher.name }}</td>
                <template v-for="day in days">
                  <template v-for="session in sessions">
                    <td
                      v-for="period in periods"
                      :key="
                        'teacher-period-' +
                        teacher.id +
                        '-' +
                        day.id +
                        '-' +
                        session.type +
                        '-' +
                        period
                      "
                      @dragover.prevent="onDragOver($event)"
                      @dragenter.prevent="onDragEnter($event, teacher.id)"
                      @drop="onDrop($event, teacher.id, day.id, session.type, period)"
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
                    </td>
                  </template>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
          sessionType: "Sáng",
          period: 2,
          classId: 1,
          subjectId: 2,
          teacherId: 3,
        },
        {
          id: 3,
          dayId: 2,
          sessionType: "Sáng",
          period: 2,
          classId: 1,
          subjectId: 2,
          teacherId: 2,
        },
        {
          id: 4,
          dayId: 3,
          sessionType: "Chiều",
          period: 3,
          classId: 2,
          subjectId: 3,
          teacherId: 3,
        },
      ],
      draggedLesson: null,
      currentHoverTeacherId: null,
      errorMessage: "",
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

    // Drag and Drop methods
    onDragStart(event, lesson) {
      this.draggedLesson = lesson;
      event.target.classList.add("dragging");
      event.dataTransfer.setData("text/plain", lesson.id);
      event.dataTransfer.effectAllowed = "move";
      this.errorMessage = "";
    },

    onDragEnd(event) {
      event.target.classList.remove("dragging");
      this.currentHoverTeacherId = null;
    },

    onDragOver(event) {
      const container = event.currentTarget.closest(".table-responsive");
      const rect = container.getBoundingClientRect();

      const scrollThreshold = 80;
      const scrollSpeed = 10;

      const clientX = event.clientX;

      // Cuộn sang phải
      if (clientX > rect.right - scrollThreshold) {
        if (container.scrollLeft + container.clientWidth < container.scrollWidth) {
          container.scrollLeft += scrollSpeed;
        }
      }
      // Cuộn sang trái
      else if (clientX < rect.left + scrollThreshold) {
        if (container.scrollLeft > 0) {
          container.scrollLeft -= scrollSpeed;
        }
      }

      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },

    onDragEnter(event, teacherId) {
      event.preventDefault();
      this.currentHoverTeacherId = teacherId;
    },

    onDrop(event, teacherId, dayId, sessionType, period) {
      event.preventDefault();
      this.currentHoverTeacherId = null;

      // Kiểm tra nếu không phải cùng giáo viên
      if (this.draggedLesson.teacherId !== teacherId) {
        this.showError("Không thể chuyển tiết học sang giáo viên khác!");
        return;
      }

      // Kiểm tra nếu đang kéo đến cùng vị trí
      if (
        this.draggedLesson.dayId === dayId &&
        this.draggedLesson.sessionType === sessionType &&
        this.draggedLesson.period === period
      ) {
        return;
      }

      // Cập nhật vị trí mới cho tiết học
      const lessonIndex = this.schedule.findIndex((l) => l.id === this.draggedLesson.id);
      if (lessonIndex !== -1) {
        this.schedule[lessonIndex] = {
          ...this.schedule[lessonIndex],
          dayId,
          sessionType,
          period,
        };
      }

      // Force update để render lại
      this.$forceUpdate();
    },
    showError(message, duration = 2000) {
      this.errorMessage = message;
      // Thêm hiệu ứng fade out trước khi xóa
      setTimeout(() => {
        const alertElement = document.querySelector(".alert");
        if (alertElement) {
          alertElement.classList.add("fade-out");

          // Xóa sau khi hiệu ứng hoàn thành
          setTimeout(() => {
            this.errorMessage = "";
          }, 500);
        } else {
          this.errorMessage = "";
        }
      }, duration);
    },
  },
};
</script>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 0;
}

.card-header {
  background-color: #337ab7;
  border-radius: 0;
  padding: 10px 15px;
}

.card-header h4 {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
}

.table {
  font-size: 14px;
  margin-bottom: 0;
  min-width: 100%;
}

.table th {
  background-color: #f5f5f5;
  border: 1px solid #ddd !important;
  font-weight: normal;
  padding: 8px;
  text-align: center;
  vertical-align: middle;
}

.table td {
  border: 1px solid #ddd !important;
  height: 60px;
  padding: 5px;
  vertical-align: top;
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
}
/* .table-responsive {
  scroll-behavior: smooth;
} */

.lesson-item {
  height: 100%;
  text-align: center;
  cursor: move;
  background-color: #e3f2fd;
  border-radius: 4px;
  padding: 2px;
  margin: 2px;
}

.lesson-item.dragging {
  opacity: 0.5;
  background-color: #bbdefb;
}

.table-bordered {
  border: 1px solid #ddd;
}

.table-bordered > thead > tr > th,
.table-bordered > tbody > tr > th,
.table-bordered > tfoot > tr > th,
.table-bordered > thead > tr > td,
.table-bordered > tbody > tr > td,
.table-bordered > tfoot > tr > td {
  border: 1px solid #ddd;
}

/* Style cho thông báo lỗi */
.alert {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  min-width: 300px;
  animation: slideIn 0.3s ease-out;
  transition: opacity 0.5s ease-out;
}

.alert.fade-out {
  opacity: 0;
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
