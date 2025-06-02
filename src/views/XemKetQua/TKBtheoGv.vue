<template>
  <div class="container-fluid mt-4">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0 font-weight-bold">THỜI KHÓA BIỂU GIÁO VIÊN</h4>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-bordered mb-0">
            <thead class="thead-light">
              <tr>
                <th rowspan="3" class="sticky-column bg-light font-weight-bold">
                  GIÁO VIÊN
                </th>
                <th
                  v-for="day in days"
                  :key="'day-' + day.id"
                  :colspan="sessions.length * periods.length"
                  class="text-center font-weight-bold"
                >
                  {{ day.name.toUpperCase() }}
                </th>
              </tr>
              <tr>
                <template v-for="day in days">
                  <th
                    v-for="session in sessions"
                    :key="'session-' + day.id + '-' + session.type"
                    :colspan="periods.length"
                    class="text-center font-weight-medium"
                  >
                    {{ session.name }}
                  </th>
                </template>
              </tr>
              <tr>
                <template v-for="day in days">
                  <template v-for="session in sessions">
                    <th
                      v-for="period in periods"
                      :key="'period-' + day.id + '-' + session.type + '-' + period.id"
                      class="text-center"
                    >
                      Tiết {{ period.id }}
                    </th>
                  </template>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr v-for="teacher in teachers" :key="'teacher-' + teacher.id">
                <td class="teacher-name sticky-column font-weight-bold bg-light">
                  {{ teacher.name }}
                </td>
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
                        period.id
                      "
                      class="border-right border-bottom"
                    >
                      <template
                        v-if="
                          getTeacherLessons(teacher.id, day.id, period.id, session.type)
                            .length > 0
                        "
                      >
                        <div
                          v-for="lesson in getTeacherLessons(
                            teacher.id,
                            day.id,
                            period.id,
                            session.type
                          )"
                          :key="'lesson-' + lesson.id"
                          class="lesson-item p-2"
                        >
                          <div class="font-weight-medium">
                            {{ getSubjectName(lesson.subjectId) }}
                          </div>
                          <div class="text-muted small">
                            {{ getClassName(lesson.classId) }}
                          </div>
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
        { type: "morning", name: "Sáng" },
        { type: "afternoon", name: "Chiều" },
      ],
      periods: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
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
          period: 1,
          sessionType: "morning",
          classId: 1,
          subjectId: 1,
          teacherId: 1,
        },
        {
          id: 2,
          dayId: 1,
          period: 2,
          sessionType: "morning",
          classId: 1,
          subjectId: 2,
          teacherId: 3,
        },
        {
          id: 3,
          dayId: 2,
          period: 2,
          sessionType: "afternoon",
          classId: 1,
          subjectId: 2,
          teacherId: 2,
        },
        {
          id: 4,
          dayId: 3,
          period: 3,
          sessionType: "morning",
          classId: 2,
          subjectId: 3,
          teacherId: 3,
        },
        {
          id: 5,
          dayId: 4,
          period: 1,
          sessionType: "morning",
          classId: 2,
          subjectId: 4,
          teacherId: 4,
        },
        {
          id: 6,
          dayId: 5,
          period: 4,
          sessionType: "afternoon",
          classId: 3,
          subjectId: 1,
          teacherId: 5,
        },
      ],
    };
  },
  methods: {
    getTeacherLessons(teacherId, dayId, periodId, sessionType) {
      return this.schedule.filter(
        (lesson) =>
          lesson.teacherId === teacherId &&
          lesson.dayId === dayId &&
          lesson.period === periodId &&
          lesson.sessionType === sessionType
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
  },
};
</script>

<style scoped>
.card {
  border: none;
  border-radius: 0.5rem;
}

.card-header {
  border-radius: 0.5rem 0.5rem 0 0 !important;
  padding: 1rem 1.5rem;
}

.table {
  font-size: 0.875rem;
  min-width: 2000px;
}

.table th {
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
}

.table td {
  vertical-align: top;
  min-width: 100px;
  height: 70px;
  padding: 0;
}

.teacher-name {
  font-weight: 600;
  white-space: nowrap;
  min-width: 150px;
  position: sticky;
  left: 0;
  z-index: 1;
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
}

.sticky-column {
  position: sticky;
  left: 0;
  z-index: 3;
  background-color: #f8f9fa;
}

.table-responsive {
  position: relative;
  max-height: 80vh;
  overflow: auto;
}

.lesson-item {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.lesson-item:last-child {
  border-bottom: none;
}

.table-bordered thead th {
  border-bottom-width: 2px;
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #e0e0e0;
}

.table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
}

.border-right {
  border-right: 1px solid #e0e0e0 !important;
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0 !important;
}
</style>
