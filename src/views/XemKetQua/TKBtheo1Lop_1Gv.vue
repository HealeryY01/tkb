<template>
  <div>
    <h3 class="mb-3">Xem thời khóa biểu theo 1 lớp - 1 giáo viên</h3>

    <div class="row mb-4">
      <div class="col-md-4">
        <label>Chọn lớp:</label>
        <select class="form-control" v-model="selectedClass">
          <option disabled value="">-- Chọn lớp --</option>
          <optgroup v-for="grade in grades" :key="grade.id" :label="grade.name">
            <option v-for="cls in grade.classes" :key="cls.id" :value="cls.name">
              {{ cls.name }}
            </option>
          </optgroup>
        </select>
      </div>
      <div class="col-md-4">
        <label>Chọn giáo viên:</label>
        <select class="form-control" v-model="selectedTeacher">
          <option disabled value="">-- Chọn giáo viên --</option>
          <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.name">
            {{ teacher.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Hiển thị TKB lớp -->
    <div v-if="selectedClass">
      <h5>Thời khóa biểu Lớp {{ selectedClass }}</h5>
      <div class="table-responsive">
        <table class="table table-bordered text-center">
          <thead>
            <tr>
              <th rowspan="2" colspan="2">Thứ</th>
              <th colspan="5">Sáng</th>
              <th colspan="5">Chiều</th>
            </tr>
            <tr>
              <th v-for="i in 5" :key="'m_' + i">Tiết {{ i }}</th>
              <th v-for="i in 5" :key="'a_' + i">Tiết {{ i }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="day in days" :key="day.id">
              <td colspan="2">{{ day.name }}</td>
              <td v-for="i in 5" :key="'m_' + day.id + '_' + i">
                <div class="p-1" :class="getCellClass(day.id, 'morning', i, selectedClass, 'class')"
                  style="min-height:40px" draggable="true"
                  @dragstart="onDragStartClass(day.id, 'morning', i, selectedClass)"
                  @dragover.prevent="onDragOverClass(day.id, 'morning', i, selectedClass)" @dragleave="onDragLeave"
                  @drop="onDropInClass(day.id, 'morning', i, selectedClass)">
                  {{ getLessonDisplay(day.id, 'morning', i, selectedClass, 'class') }}
                </div>
              </td>
              <td v-for="i in 5" :key="'a_' + day.id + '_' + i">
                <div class="p-1" :class="getCellClass(day.id, 'afternoon', i, selectedClass, 'class')"
                  style="min-height:40px" draggable="true"
                  @dragstart="onDragStartClass(day.id, 'afternoon', i, selectedClass)"
                  @dragover.prevent="onDragOverClass(day.id, 'afternoon', i, selectedClass)" @dragleave="onDragLeave"
                  @drop="onDropInClass(day.id, 'afternoon', i, selectedClass)">
                  {{ getLessonDisplay(day.id, 'afternoon', i, selectedClass, 'class') }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Hiển thị TKB giáo viên -->
    <div v-if="selectedTeacher" class="mt-4">
      <h5>Thời khóa biểu Giáo viên {{ selectedTeacher }}</h5>
      <div class="table-responsive">
        <table class="table table-bordered text-center">
          <thead>
            <tr>
              <th rowspan="2" colspan="2">Thứ</th>
              <th colspan="5">Sáng</th>
              <th colspan="5">Chiều</th>
            </tr>
            <tr>
              <th v-for="i in 5" :key="'m_' + i">Tiết {{ i }}</th>
              <th v-for="i in 5" :key="'a_' + i">Tiết {{ i }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="day in days" :key="day.id">
              <td colspan="2">{{ day.name }}</td>
              <td v-for="i in 5" :key="'m_' + day.id + '_' + i">
                <div class="p-1" :class="getCellClass(day.id, 'morning', i, selectedTeacher, 'teacher')"
                  style="min-height:40px" draggable="true" @dragstart="onDragStartTeacher(day.id, 'morning', i)"
                  @dragover.prevent="onDragOverTeacher(day.id, 'morning', i)" @dragleave="onDragLeave"
                  @drop="onDropInTeacher(day.id, 'morning', i)">
                  {{ getLessonDisplay(day.id, 'morning', i, selectedTeacher, 'teacher') }}
                </div>
              </td>
              <td v-for="i in 5" :key="'a_' + day.id + '_' + i">
                <div class="p-1" :class="getCellClass(day.id, 'afternoon', i, selectedTeacher, 'teacher')"
                  style="min-height:40px" draggable="true" @dragstart="onDragStartTeacher(day.id, 'afternoon', i)"
                  @dragover.prevent="onDragOverTeacher(day.id, 'afternoon', i)" @dragleave="onDragLeave"
                  @drop="onDropInTeacher(day.id, 'afternoon', i)">
                  {{ getLessonDisplay(day.id, 'afternoon', i, selectedTeacher, 'teacher') }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="!selectedClass && !selectedTeacher" class="alert alert-info">
      Vui lòng chọn lớp hoặc giáo viên để xem TKB.
    </div>
  </div>
</template>

<script>
export default {
  name: "TKBtheo1lop_1Gv",
  data() {
    return {
      days: [
        { id: 1, name: "Thứ 2" },
        { id: 2, name: "Thứ 3" },
        { id: 3, name: "Thứ 4" },
        { id: 4, name: "Thứ 5" },
        { id: 5, name: "Thứ 6" },
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
          sessionType: "morning",
          period: 1,
          classId: 1,
          subjectId: 1,
          teacherId: 1,
        },
        {
          id: 2,
          dayId: 1,
          sessionType: "morning",
          period: 2,
          classId: 1,
          subjectId: 2,
          teacherId: 3,
        },
        {
          id: 3,
          dayId: 2,
          sessionType: "morning",
          period: 2,
          classId: 1,
          subjectId: 2,
          teacherId: 2,
        },
        {
          id: 4,
          dayId: 3,
          sessionType: "afternoon",
          period: 3,
          classId: 2,
          subjectId: 3,
          teacherId: 3,
        },
      ],
      selectedClass: "",
      selectedTeacher: "",
      dragData: null,
      highlightCell: null,
    };
  },
  methods: {
    getClassName(classId) {
      for (const grade of this.grades) {
        const cls = grade.classes.find(c => c.id === classId);
        if (cls) return cls.name;
      }
      return "";
    },
    getSubjectName(subjectId) {
      const subject = this.subjects.find(s => s.id === subjectId);
      return subject ? subject.name : "";
    },
    getTeacherName(teacherId) {
      const teacher = this.teachers.find(t => t.id === teacherId);
      return teacher ? teacher.name : "";
    },
    getClassId(className) {
      for (const grade of this.grades) {
        const cls = grade.classes.find(c => c.name === className);
        if (cls) return cls.id;
      }
      return null;
    },
    getTeacherId(teacherName) {
      const teacher = this.teachers.find(t => t.name === teacherName);
      return teacher ? teacher.id : null;
    },
    getLessonDisplay(dayId, session, period, selected, type) {
      if (!selected) return "";
      if (type === 'class') {
        const classId = this.getClassId(selected);
        if (!classId) return "";
        const lesson = this.schedule.find(item =>
          item.classId === classId &&
          item.dayId === dayId &&
          item.sessionType === session &&
          item.period === period
        );
        return lesson ? `${this.getSubjectName(lesson.subjectId)}` : "";
      } else {
        const teacherId = this.getTeacherId(selected);
        if (!teacherId) return "";
        const lesson = this.schedule.find(item =>
          item.teacherId === teacherId &&
          item.dayId === dayId &&
          item.sessionType === session &&
          item.period === period
        );
        return lesson ? `${this.getClassName(lesson.classId)}` : "";
      }
    },
    getCellClass(dayId, sessionType, period, selected, type) {
      const isHighlighted = this.highlightCell &&
        this.highlightCell.dayId === dayId &&
        this.highlightCell.sessionType === sessionType &&
        this.highlightCell.period === period;
      const classes = {
        'bg-warning': isHighlighted,
        'bg-light': !this.getLessonDisplay(dayId, sessionType, period, selected, type)
      };
      return classes;
    },

    // Drag for Class Table
    onDragStartClass(dayId, sessionType, period, className) {
      const classId = this.getClassId(className);
      if (!classId) return;
      const lesson = this.schedule.find(item =>
        item.dayId === dayId &&
        item.sessionType === sessionType &&
        item.period === period &&
        item.classId === classId
      );
      if (lesson) {
        this.dragData = { ...lesson, type: 'class' };
      }
    },
    onDragOverClass(dayId, sessionType, period) {
      this.highlightCell = { dayId, sessionType, period };
    },
    onDragLeave() {
      this.highlightCell = null;
    },
    onDropInClass(dayId, sessionType, period, className) {
      const classId = this.getClassId(className);
      if (!classId || !this.dragData) return;
      if (this.dragData.type !== 'class') return;
      const targetLesson = this.schedule.find(item =>
        item.dayId === dayId &&
        item.sessionType === sessionType &&
        item.period === period &&
        item.classId === classId
      );
      if (targetLesson) {
        const tempSubject = targetLesson.subjectId;
        const tempTeacher = targetLesson.teacherId;
        targetLesson.subjectId = this.dragData.subjectId;
        targetLesson.teacherId = this.dragData.teacherId;
        const originalLesson = this.schedule.find(item => item.id === this.dragData.id);
        originalLesson.subjectId = tempSubject;
        originalLesson.teacherId = tempTeacher;
      } else {
        const originalLesson = this.schedule.find(item => item.id === this.dragData.id);
        originalLesson.dayId = dayId;
        originalLesson.sessionType = sessionType;
        originalLesson.period = period;
        originalLesson.classId = classId;
      }
      this.dragData = null;
      this.highlightCell = null;
    },

    // Drag for Teacher Table
    onDragStartTeacher(dayId, sessionType, period) {
      const teacherId = this.getTeacherId(this.selectedTeacher);
      if (!teacherId) return;
      const lesson = this.schedule.find(item =>
        item.dayId === dayId &&
        item.sessionType === sessionType &&
        item.period === period &&
        item.teacherId === teacherId
      );
      if (lesson) {
        this.dragData = { ...lesson, type: 'teacher' };
      }
    },
    onDragOverTeacher(dayId, sessionType, period) {
      this.highlightCell = { dayId, sessionType, period };
    },
    onDropInTeacher(dayId, sessionType, period) {
      const teacherId = this.getTeacherId(this.selectedTeacher);
      if (!teacherId || !this.dragData) return;
      if (this.dragData.type !== 'teacher') return;
      const targetLesson = this.schedule.find(item =>
        item.dayId === dayId &&
        item.sessionType === sessionType &&
        item.period === period &&
        item.teacherId === teacherId
      );
      if (targetLesson) {
        const tempSubject = targetLesson.subjectId;
        const tempClass = targetLesson.classId;
        targetLesson.subjectId = this.dragData.subjectId;
        targetLesson.classId = this.dragData.classId;
        const originalLesson = this.schedule.find(item => item.id === this.dragData.id);
        originalLesson.subjectId = tempSubject;
        originalLesson.classId = tempClass;
      } else {
        const originalLesson = this.schedule.find(item => item.id === this.dragData.id);
        originalLesson.dayId = dayId;
        originalLesson.sessionType = sessionType;
        originalLesson.period = period;
        originalLesson.teacherId = teacherId;
      }
      this.dragData = null;
      this.highlightCell = null;
    }
  }
};
</script>
