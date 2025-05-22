<template>
  <div class="container-fluid">
    <div v-for="grade in grades" :key="grade.id" class="mb-5">
      <h2>{{ grade.name }}</h2>
      <div class="table-responsive">
        <table class="table table-bordered schedule-table">
          <thead>
            <tr>
              <th rowspan="2">Buổi/Tiết</th>
              <th rowspan="2">Tiết</th>
              <th
                v-for="day in days"
                :key="`day-${day.id}`"
                :colspan="grade.classes.length"
                class="text-center"
              >
                {{ day.name }}
              </th>
            </tr>
            <tr>
              <template v-for="day in days">
                <th
                  v-for="cls in grade.classes"
                  :key="`class-${day.id}-${cls.id}`"
                  class="text-center"
                >
                  {{ cls.name }}
                </th>
              </template>
            </tr>
          </thead>

          <!-- Phần body -->
          <tbody>
            <template v-for="session in sessions">
              <tr v-for="period in periods" :key="`period-${session.type}-${period}`">
                <td v-if="period === 1" :rowspan="periods.length" class="session-cell">
                  {{ session.label }}
                </td>
                <td class="period-cell">{{ period }}</td>
                <template v-for="day in days">
                  <td
                    v-for="cls in grade.classes"
                    :key="`cell-${day.id}-${cls.id}-${session.type}-${period}`"
                    class="lesson-cell"
                    @dragover.prevent
                    @dragenter.prevent
                    @drop="handleDrop(day, session, period, cls)"
                  >
                    <div
                      draggable="true"
                      @dragstart="handleDragStart(day, session, period, cls)"
                      class="lesson-content"
                      :class="{
                        'empty-lesson': !getLesson(day, session, period, cls),
                        dragging: isDragging(day, session, period, cls),
                        highlight: isHighlighted(day, session, period, cls),
                      }"
                    >
                      <template v-if="getLesson(day, session, period, cls)">
                        <div class="subject">
                          {{ getSubjectName(day, session, period, cls) }}
                          <span class="teacher-tooltip">
                            {{ getTeacherName(day, session, period, cls) }}
                          </span>
                        </div>
                      </template>
                    </div>
                  </td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <SwapModal
      v-if="swapData"
      :from="swapData.from"
      :to="swapData.to"
      :teachers="teachers"
      @confirm="confirmSwap"
      @cancel="cancelSwap"
    />
  </div>
</template>

<script>
import SwapModal from "./SwapModal.vue";

export default {
  components: {
    SwapModal,
  },

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
        { type: "morning", label: "Sáng" },
        { type: "afternoon", label: "Chiều" },
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
        { id: 3, name: "Lý" },
        { id: 4, name: "Hóa" },
        { id: 5, name: "Anh" },
        { id: 6, name: "Sử" },
      ],

      teachers: [
        { id: 1, name: "GV A" },
        { id: 2, name: "GV B" },
        { id: 3, name: "GV C" },
        { id: 4, name: "GV D" },
        { id: 5, name: "GV E" },
        { id: 6, name: "GV F" },
      ],

      schedule: [
        // Khối 1 - Lớp 1A
        {
          dayId: 1,
          sessionType: "morning",
          period: 1,
          classId: 1,
          subjectId: 1,
          teacherId: 1,
        },
        {
          dayId: 1,
          sessionType: "morning",
          period: 2,
          classId: 1,
          subjectId: 2,
          teacherId: 2,
        },
        // ... (thêm các tiết học khác như trong code gốc)
      ],

      dragData: null,
      swapData: null,
      highlightedCell: null,
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

    getSubjectName(day, session, period, cls) {
      const lesson = this.getLesson(day, session, period, cls);
      if (!lesson) return "";
      const subject = this.subjects.find((s) => s.id === lesson.subjectId);
      return subject ? subject.name : "";
    },

    getTeacherName(day, session, period, cls) {
      const lesson = this.getLesson(day, session, period, cls);
      if (!lesson) return "";
      const teacher = this.teachers.find((t) => t.id === lesson.teacherId);
      return teacher ? teacher.name : "";
    },

    handleDragStart(day, session, period, cls) {
      const lesson = this.getLesson(day, session, period, cls);
      if (lesson) {
        this.dragData = {
          day,
          session,
          period,
          class: cls,
          lesson: JSON.parse(JSON.stringify(lesson)), // Deep copy
        };
        this.highlightedCell = { day, session, period, class: cls };
      }
    },

    handleDrop(day, session, period, cls) {
      if (!this.dragData) return;

      // Kiểm tra cùng lớp
      if (this.dragData.class.id !== cls.id) {
        alert("Chỉ có thể đổi tiết trong cùng lớp!");
        return;
      }

      // Không xử lý nếu thả vào chính ô đang kéo
      if (
        this.dragData.day.id === day.id &&
        this.dragData.session.type === session.type &&
        this.dragData.period === period
      ) {
        return;
      }

      const targetLesson = this.getLesson(day, session, period, cls);

      this.swapData = {
        from: {
          ...this.dragData,
          subjectName: this.getSubjectName(
            this.dragData.day,
            this.dragData.session,
            this.dragData.period,
            this.dragData.class
          ),
          teacherName: this.getTeacherName(
            this.dragData.day,
            this.dragData.session,
            this.dragData.period,
            this.dragData.class
          ),
        },
        to: {
          day,
          session,
          period,
          class: cls,
          lesson: targetLesson,
          subjectName: targetLesson ? this.getSubjectName(day, session, period, cls) : "",
          teacherName: targetLesson ? this.getTeacherName(day, session, period, cls) : "",
        },
      };

      this.highlightedCell = null;
    },

    confirmSwap() {
      if (!this.swapData) return;

      const { from, to } = this.swapData;

      // Tạo bản sao sâu của schedule
      const newSchedule = JSON.parse(JSON.stringify(this.schedule));

      // Tìm và xóa tiết nguồn
      const fromIndex = newSchedule.findIndex(
        (item) =>
          item.dayId === from.day.id &&
          item.sessionType === from.session.type &&
          item.period === from.period &&
          item.classId === from.class.id
      );

      if (fromIndex !== -1) {
        newSchedule.splice(fromIndex, 1);
      }

      // Tìm và xóa tiết đích
      const toIndex = newSchedule.findIndex(
        (item) =>
          item.dayId === to.day.id &&
          item.sessionType === to.session.type &&
          item.period === to.period &&
          item.classId === to.class.id
      );

      if (toIndex !== -1) {
        newSchedule.splice(toIndex, 1);
      }

      // Thêm tiết mới
      if (from.lesson) {
        newSchedule.push({
          ...from.lesson,
          dayId: to.day.id,
          sessionType: to.session.type,
          period: to.period,
          classId: to.class.id,
        });
      }

      if (to.lesson) {
        newSchedule.push({
          ...to.lesson,
          dayId: from.day.id,
          sessionType: from.session.type,
          period: from.period,
          classId: from.class.id,
        });
      }

      // Cập nhật schedule
      this.schedule = newSchedule;
      this.cancelSwap();
      this.$forceUpdate();
    },

    cancelSwap() {
      this.swapData = null;
      this.dragData = null;
      this.highlightedCell = null;
    },

    isDragging(day, session, period, cls) {
      return (
        this.dragData &&
        this.dragData.day.id === day.id &&
        this.dragData.session.type === session.type &&
        this.dragData.period === period &&
        this.dragData.class.id === cls.id
      );
    },

    isHighlighted(day, session, period, cls) {
      return (
        this.highlightedCell &&
        this.highlightedCell.day.id === day.id &&
        this.highlightedCell.session.type === session.type &&
        this.highlightedCell.period === period &&
        this.highlightedCell.class.id === cls.id
      );
    },
  },
};
</script>

<style scoped>
.schedule-table {
  table-layout: fixed;
  background-color: #f8f9fa;
}

.schedule-table th {
  background-color: #e9ecef;
  font-weight: 600;
}

.session-cell {
  background-color: #dee2e6;
  font-weight: 500;
}

.period-cell {
  background-color: #e9ecef;
  font-weight: 500;
}

.lesson-cell {
  min-height: 60px;
  padding: 4px;
  background-color: white;
}

.lesson-content {
  height: 100%;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dee2e6;
  transition: all 0.2s;
  cursor: move;
}

.empty-lesson {
  background-color: #f8f9fa;
}

.lesson-content.dragging {
  opacity: 0.5;
}

.lesson-content.highlight {
  background-color: #e7f5ff;
  border: 2px dashed #4dabf7;
}

.subject {
  position: relative;
  text-align: center;
  padding: 8px;
}

.teacher-tooltip {
  display: none;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #495057;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.subject:hover .teacher-tooltip {
  display: block;
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Responsive styles */
@media (max-width: 768px) {
  .schedule-table {
    font-size: 14px;
  }

  .lesson-cell {
    min-height: 50px;
  }
}
</style>
