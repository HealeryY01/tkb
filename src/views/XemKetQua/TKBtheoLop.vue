<template>
  <div class="container-fluid mt-3">
    <div v-for="grade in grades" :key="grade.id" class="mb-5">
      <h4>{{ grade.name }}</h4>

      <!-- Thêm combobox chọn lớp -->
      <div class="form-group mb-3">
        <label for="classSelect">Chọn lớp:</label>
        <select id="classSelect" class="form-control" v-model="selectedClass[grade.id]">
          <option value="">-- Chọn lớp --</option>
          <option
            v-for="classItem in grade.classes"
            :key="classItem.id"
            :value="classItem.id"
          >
            Lớp {{ classItem.name }}
          </option>
        </select>
      </div>

      <!-- Chỉ hiển thị bảng khi lớp được chọn -->
      <div v-if="selectedClass[grade.id] && getSelectedClass(grade.id)">
        <div class="table-responsive">
          <table class="table table-bordered table-sm text-center align-middle">
            <thead class="thead-light">
              <tr>
                <th rowspan="2" style="width: 80px">Buổi</th>
                <th rowspan="2" style="width: 50px">Tiết/Thứ</th>
                <th colspan="5" class="text-center">
                  Lớp {{ getSelectedClassName(grade.id) }}
                </th>
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
                  <td
                    v-if="period === 1"
                    :rowspan="periods.length"
                    class="align-middle font-weight-bold"
                  >
                    {{ session.label }}
                  </td>
                  <td>{{ period }}</td>
                  <template v-for="day in days">
                    <td
                      :key="`${day.id}-${period}`"
                      @dragover.prevent
                      @drop="handleDrop(day, session, period, getSelectedClass(grade.id))"
                      style="cursor: grab; height: 50px"
                    >
                      <div
                        class="p-2 bg-light rounded"
                        draggable="true"
                        @dragstart="
                          handleDragStart(
                            day,
                            session,
                            period,
                            getSelectedClass(grade.id)
                          )
                        "
                      >
                        <span
                          v-if="
                            getLesson(day, session, period, getSelectedClass(grade.id))
                          "
                        >
                          {{
                            getSubjectName(
                              day,
                              session,
                              period,
                              getSelectedClass(grade.id)
                            )
                          }}
                          <br />
                          <small class="text-primary">
                            ({{
                              getTeacherName(
                                day,
                                session,
                                period,
                                getSelectedClass(grade.id)
                              )
                            }})
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
    <div
      ref="swapModal"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-labelledby="swapModalLabel"
      aria-hidden="true"
      v-if="swapData && isDataReady"
    >
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title font-weight-bold" id="swapModalLabel">
              <i class="fas fa-exchange-alt mr-2"></i>Xác nhận đổi tiết
            </h5>
            <button
              type="button"
              class="close text-white"
              @click="cancelSwap"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body" v-if="swapData">
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
                        {{ swapData.from.subjectName || "Chưa có môn" }}
                      </h5>
                      <p>
                        <strong>Giáo viên:</strong>
                        {{ swapData.from.teacherName || "Chưa có GV" }}
                      </p>
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
                        {{ swapData.to.subjectName || "Trống" }}
                      </h5>
                      <p class="mb-1">
                        <strong>Giáo viên:</strong>
                        {{ swapData.to.teacherName || "Trống" }}
                      </p>
                      <p class="mb-1">
                        <strong>Lớp:</strong>
                        {{
                          swapData.to.classId
                            ? getClassName(swapData.to.classId)
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
              <div class="col-md-6 mb-3 mb-md-0">
                <div class="card h-100">
                  <div class="card-header bg-info text-white">
                    <h6 class="mb-0">
                      <i class="fas fa-calendar-alt mr-2"></i>
                      Lịch tuần của {{ swapData.from.teacherName }}
                    </h6>
                  </div>
                  <div class="card-body p-0">
                    <div
                      class="table-responsive"
                      style="max-height: 300px; overflow-y: auto"
                    >
                      <!-- Phần bảng của giáo viên 1 -->
                      <table class="table table-sm table-bordered mb-0">
                        <thead class="thead-light">
                          <tr>
                            <th>Buổi</th>
                            <th>Tiết</th>
                            <th v-for="day in days" :key="`header-${day.id}`">
                              {{ day.name }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <!-- Buổi sáng -->
                          <tr
                            v-for="(period, index) in periods"
                            :key="`morning-row-${period}`"
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
                              :key="`morning-${day.id}-${period}`"
                              :class="{
                                'bg-primary text-white': isCurrentCell(
                                  'Sáng',
                                  day.name,
                                  period,
                                  swapData.from
                                ),
                              }"
                            >
                              {{
                                getTeacherScheduleCell(
                                  "Sáng",
                                  day.name,
                                  period,
                                  swapData.from.teacherId
                                )
                              }}
                            </td>
                          </tr>

                          <!-- Buổi chiều -->
                          <tr
                            v-for="(period, index) in periods"
                            :key="`afternoon-row-${period}`"
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
                              :key="`afternoon-${day.id}-${period}`"
                              :class="{
                                'bg-primary text-white': isCurrentCell(
                                  'Chiều',
                                  day.name,
                                  period,
                                  swapData.from
                                ),
                              }"
                            >
                              {{
                                getTeacherScheduleCell(
                                  "Chiều",
                                  day.name,
                                  period,
                                  swapData.from.teacherId
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

              <div class="col-md-6">
                <div class="card h-100">
                  <div class="card-header bg-info text-white">
                    <h6 class="mb-0">
                      <i class="fas fa-calendar-alt mr-2"></i>
                      Lịch tuần của {{ swapData.to.teacherName || "Trống" }}
                    </h6>
                  </div>
                  <div class="card-body p-0">
                    <div
                      class="table-responsive"
                      style="max-height: 300px; overflow-y: auto"
                    >
                      <!-- Phần bảng của giáo viên 2 -->
                      <table class="table table-sm table-bordered mb-0">
                        <thead class="thead-light">
                          <tr>
                            <th>Buổi</th>
                            <th>Tiết</th>
                            <th v-for="day in days" :key="`to-header-${day.id}`">
                              {{ day.name }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <!-- Buổi sáng -->
                          <tr
                            v-for="(period, index) in periods"
                            :key="`to-morning-row-${period}`"
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
                              :key="`to-morning-${day.id}-${period}`"
                              :class="{
                                'bg-success text-white': isCurrentCell(
                                  'Sáng',
                                  day.name,
                                  period,
                                  swapData.to
                                ),
                              }"
                            >
                              {{
                                getTeacherScheduleCell(
                                  "Sáng",
                                  day.name,
                                  period,
                                  swapData.to.teacherId
                                )
                              }}
                            </td>
                          </tr>

                          <!-- Buổi chiều -->
                          <tr
                            v-for="(period, index) in periods"
                            :key="`to-afternoon-row-${period}`"
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
                              :key="`to-afternoon-${day.id}-${period}`"
                              :class="{
                                'bg-success text-white': isCurrentCell(
                                  'Chiều',
                                  day.name,
                                  period,
                                  swapData.to
                                ),
                              }"
                            >
                              {{
                                getTeacherScheduleCell(
                                  "Chiều",
                                  day.name,
                                  period,
                                  swapData.to.teacherId
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
    <div
      ref="errorModal_2"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-labelledby="errorModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="errorModalLabel">Không thể đổi tiết</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Bạn chỉ có thể đổi các tiết trong cùng một lớp c!</p>
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

    <div class="modal fade" ref="errorModal_1" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Không thể đổi chính tiết đó cho tiết đó được!</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
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
        { id: 1, name: "Khối 1", classes: [] },
        { id: 2, name: "Khối 2", classes: [] },
      ],
      subjects: [],
      teachers: [],
      schedule: [],
      dragData: null,
      swapData: null,
      selectedClass: {},
      isDataReady: false, // ✅ Đánh dấu dữ liệu đã sẵn sàng
    };
  },
  created() {
    // Tải song song cả giáo viên và môn học
    Promise.all([
      fetch("/api/get_subjects.php").then((res) => res.json()),
      fetch("/api/get_teachers.php").then((res) => res.json()),
    ])
      .then(([subjectsData, teachersData]) => {
        this.subjects = subjectsData;
        this.teachers = teachersData;
        this.isDataReady = true; // ✅ Đánh dấu đã xong
      })
      .catch((err) => console.error("Lỗi tải dữ liệu:", err));

    // Lấy danh sách lớp cho từng khối
    this.grades.forEach((grade) => {
      this.fetchClasses(grade.id);
    });
  },
  methods: {
    fetchClasses(gradeId) {
      fetch(`/api/get_classes.php?grade_id=${gradeId}`)
        .then((res) => res.json())
        .then((data) => {
          const grade = this.grades.find((g) => g.id === gradeId);
          if (grade) grade.classes = data;
        })
        .catch((err) => console.error("Lỗi khi lấy danh sách lớp:", err));
    },
    fetchSchedule(classId) {
      fetch(`/api/get_schedule.php?class_id=${classId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            this.schedule = data.data;
          } else {
            console.error("Lỗi:", data.message);
          }
        })
        .catch((err) => console.error("Lỗi fetch:", err));
    },
    getSelectedClass(gradeId) {
      if (!this.selectedClass[gradeId]) return null;
      const grade = this.grades.find((g) => g.id === gradeId);
      return grade?.classes.find((c) => c.id === this.selectedClass[gradeId]) || null;
    },
    getSelectedClassName(gradeId) {
      const selected = this.getSelectedClass(gradeId);
      return selected ? selected.name : "";
    },
    getClassName(classId) {
      const cls = this.grades.flatMap((g) => g.classes).find((c) => c.id === classId);
      return cls ? cls.name : "";
    },
    getDayName(dayId) {
      const day = this.days.find((d) => d.id === dayId);
      return day ? day.name : "";
    },
    getSubjectNameById(subjectId) {
      const subject = this.subjects.find((s) => String(s.id) === String(subjectId));
      return subject ? subject.name : "";
    },
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
        const teacher = this.teachers.find(
          (t) => String(t.id) === String(lesson.teacherId)
        );
        return teacher ? teacher.name : "";
      }
      return "";
    },
    handleDrop(day, session, period, cls) {
      if (!this.dragData) return;

      if (!this.isDataReady) {
        alert("Vui lòng đợi dữ liệu môn học và giáo viên được tải xong.");
        return;
      }

      if (
        this.dragData.dayId === day.id &&
        this.dragData.sessionType === session.type &&
        this.dragData.period === period &&
        this.dragData.classId === cls.id
      ) {
        $(this.$refs.errorModal_1).modal("show");
        return;
      }

      if (this.dragData.classId !== cls.id) {
        $(this.$refs.errorModal_2).modal("show");
        return;
      }

      const targetLesson = this.getLesson(day, session, period, cls);
      this.swapData = {
        from: { ...this.dragData },
        to: targetLesson
          ? {
              dayId: day.id,
              sessionType: session.type,
              period: period,
              classId: cls.id,
              lessonId: targetLesson.id,
              subjectId: targetLesson.subjectId,
              teacherId: targetLesson.teacherId,
              subjectName: this.getSubjectNameById(targetLesson.subjectId),
              teacherName:
                this.teachers.find((t) => t.id === targetLesson.teacherId)?.name || "",
            }
          : {
              dayId: day.id,
              sessionType: session.type,
              period: period,
              classId: cls.id,
            },
      };

      $(this.$refs.swapModal).modal("show");
    },
    handleDragStart(day, session, period, cls) {
      const lesson = this.getLesson(day, session, period, cls);
      if (lesson) {
        this.dragData = {
          dayId: day.id,
          sessionType: session.type,
          period: period,
          classId: cls.id,
          lessonId: lesson.id,
          subjectId: lesson.subjectId,
          teacherId: lesson.teacherId,
          subjectName: this.getSubjectNameById(lesson.subjectId),
          teacherName: this.teachers.find((t) => t.id === lesson.teacherId)?.name || "",
        };
      } else {
        this.dragData = null;
      }
    },
    confirmSwap() {
      fetch("/api/swap_schedule.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: this.swapData.from,
          to: this.swapData.to,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            this.fetchSchedule(this.swapData.from.classId); // ← Cập nhật lại TKB sau khi đổi
            this.cancelSwap(); // ← Đóng modal
          } else {
            alert("Đổi tiết thất bại: " + data.message);
          }
        });
    },
    cancelSwap() {
      this.swapData = null;
      $(this.$refs.swapModal).modal("hide");
    },
  },
  watch: {
    selectedClass: {
      deep: true,
      handler(val) {
        const gradeId = Object.keys(val)[0];
        const classId = val[gradeId];
        if (classId) {
          this.fetchClasses(parseInt(gradeId));
          this.fetchSchedule(classId);
        }
      },
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
.table-sm td {
  height: 60px;
  white-space: pre-line;
  vertical-align: middle;
  padding: 0.25rem !important;
}

.table-sm th {
  vertical-align: middle;
  padding: 0.5rem !important;
}
</style>
