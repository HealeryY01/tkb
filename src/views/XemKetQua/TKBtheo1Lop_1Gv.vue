<template>
  <div>
    <h3 class="mb-3">Xem thời khóa biểu theo 1 lớp - 1 giáo viên</h3>

    <!-- Bộ lọc lớp và giáo viên -->
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

    <!-- Hiển thị bảng -->
    <div v-if="selectedClass && selectedTeacher">
      <h5 class="mb-2">
        Thời khóa biểu - Lớp {{ selectedClass }} - {{ selectedTeacher }}
      </h5>
      <div class="table-responsive">
        <table class="table table-bordered text-center">
          <thead>
            <tr>
              <th rowspan="2" colspan="2" class="align-middle">Thứ</th>
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
              <td colspan="2" class="align-middle">{{ day.name }}</td>
              <td v-for="i in 5" :key="'s_' + day.id + '_' + i">
                <div draggable="true" @dragstart="onDragStart(day.id, 'morning', i, selectedClass)" @dragover.prevent="
                  onDragOver(day.id, 'morning', i, selectedClass)
                  " @dragleave="onDragLeave" @drop="onDrop(day.id, 'morning', i, selectedClass)"
                  :class="getHighlightClass(day.id, 'morning', i)" class="p-1" style="min-height: 40px">
                  {{ getLesson(day.id, "morning", i) }}
                </div>
              </td>
              <td v-for="i in 5" :key="'c_' + day.id + '_' + i">
                <div draggable="true" @dragstart="
                  onDragStart(day.id, 'afternoon', i, selectedClass)
                  " @dragover.prevent="
                    onDragOver(day.id, 'afternoon', i, selectedClass)
                    " @dragleave="onDragLeave" @drop="onDrop(day.id, 'afternoon', i, selectedClass)"
                  :class="getHighlightClass(day.id, 'afternoon', i)" class="p-1" style="min-height: 40px">
                  {{ getLesson(day.id, "afternoon", i) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else>
      <p class="text-muted">
        Vui lòng chọn lớp và giáo viên để xem thời khóa biểu.
      </p>
    </div>

    <!-- Modal xác nhận đổi tiết -->
    <div v-if="showModal" class="modal d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xác nhận đổi tiết</h5>
            <button type="button" class="btn-close" @click="cancelSwap"></button>
          </div>
          <div class="modal-body">
            <p>
              Bạn đang đổi vào tiết của
              <b>{{ swapInfo.toTeacherName }}</b>?
            </p>
            <div class="row">
              <div class="col-md-6">
                <h6>Thời khóa biểu của {{ swapInfo.fromTeacherName }}</h6>
                <table class="table table-sm table-bordered text-center">
                  <thead>
                    <tr>
                      <th>Thứ</th>
                      <th>Buổi</th>
                      <th>Tiết</th>
                      <th>Môn</th>
                      <th>Lớp</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in getTeacherSchedule(
                      swapInfo.fromItem.teacherId
                    )" :key="'from_' + item.id" :class="{
                      'table-warning':
                        item.dayId === swapInfo.fromItem.dayId &&
                        item.sessionType === swapInfo.fromItem.sessionType &&
                        item.period === swapInfo.fromItem.period,
                    }">
                      <td>{{ getDayName(item.dayId) }}</td>
                      <td>
                        {{ item.sessionType === "morning" ? "Sáng" : "Chiều" }}
                      </td>
                      <td>{{ item.period }}</td>
                      <td>{{ getSubjectName(item.subjectId) }}</td>
                      <td>{{ getClassName(item.classId) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="col-md-6">
                <h6>Thời khóa biểu của {{ swapInfo.toTeacherName }}</h6>
                <table class="table table-sm table-bordered text-center">
                  <thead>
                    <tr>
                      <th>Thứ</th>
                      <th>Buổi</th>
                      <th>Tiết</th>
                      <th>Môn</th>
                      <th>Lớp</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in getTeacherSchedule(
                      swapInfo.toItem.teacherId
                    )" :key="'to_' + item.id" :class="{
                      'table-warning':
                        item.dayId === swapInfo.toItem.dayId &&
                        item.sessionType === swapInfo.toItem.sessionType &&
                        item.period === swapInfo.toItem.period,
                    }">
                      <td>{{ getDayName(item.dayId) }}</td>
                      <td>
                        {{ item.sessionType === "morning" ? "Sáng" : "Chiều" }}
                      </td>
                      <td>{{ item.period }}</td>
                      <td>{{ getSubjectName(item.subjectId) }}</td>
                      <td>{{ getClassName(item.classId) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cancelSwap">
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
      showModal: false,
      swapInfo: null,
      highlightCell: null,
    };
  },
  methods: {
    getTeacherSchedule(teacherId) {
      return this.schedule.filter((item) => item.teacherId === teacherId);
    },
    getDayName(dayId) {
      const d = this.days.find((x) => x.id === dayId);
      return d ? d.name : "";
    },
    getSubjectName(subjectId) {
      const s = this.subjects.find((x) => x.id === subjectId);
      return s ? s.name : "";
    },
    getClassName(classId) {
      const c = this.grades
        .flatMap((g) => g.classes)
        .find((x) => x.id === classId);
      return c ? c.name : "";
    },
    getLesson(dayId, sessionType, period) {
      const cls = this.grades
        .flatMap((g) => g.classes)
        .find((c) => c.name === this.selectedClass);
      if (!cls) return "";
      const lesson = this.schedule.find(
        (item) =>
          item.dayId === dayId &&
          item.sessionType === sessionType &&
          item.period === period &&
          item.classId === cls.id
      );
      if (
        lesson &&
        this.teachers.find((t) => t.id === lesson.teacherId)?.name ===
        this.selectedTeacher
      ) {
        return this.getSubjectName(lesson.subjectId);
      }
      return "";
    },
    // Khi bắt đầu kéo, lưu dữ liệu tiết học (dragData).
    onDragStart(dayId, sessionType, period, className) {
      const cls = this.grades
        .flatMap((g) => g.classes)
        .find((c) => c.name === className);
      if (cls) this.dragData = { dayId, sessionType, period, classId: cls.id };
    },
    //Khi kéo qua ô khác, lưu dữ liệu highlightCell để làm nổi ô.
    onDragOver(dayId, sessionType, period, className) {
      const cls = this.grades
        .flatMap((g) => g.classes)
        .find((c) => c.name === className);
      if (cls && this.dragData)
        this.highlightCell = { dayId, sessionType, period, classId: cls.id };
    },
    // Khi rời ô, xóa highlight.
    onDragLeave() {
      this.highlightCell = null;
    },
    onDrop(dayId, sessionType, period, className) {
      const cls = this.grades
        .flatMap((g) => g.classes)
        .find((c) => c.name === className);
      if (!this.dragData || !cls || cls.id !== this.dragData.classId) {
        this.dragData = null;
        this.highlightCell = null;
        return;
      }
      const fromItem = this.schedule.find(
        (i) =>
          i.dayId === this.dragData.dayId &&
          i.sessionType === this.dragData.sessionType &&
          i.period === this.dragData.period &&
          i.classId === this.dragData.classId
      );
      const toItem = this.schedule.find(
        (i) =>
          i.dayId === dayId &&
          i.sessionType === sessionType &&
          i.period === period &&
          i.classId === cls.id
      );
      if (fromItem) {
        if (toItem) {
          const fromT = this.teachers.find((t) => t.id === fromItem.teacherId);
          const toT = this.teachers.find((t) => t.id === toItem.teacherId);
          if (fromT && toT && fromT.id !== toT.id) {
            this.swapInfo = {
              fromItem,
              toItem,
              fromTeacherName: fromT.name,
              toTeacherName: toT.name,
            };
            this.showModal = true;
            this.highlightCell = null;
            return;
          }
        } else {
          fromItem.dayId = dayId;
          fromItem.sessionType = sessionType;
          fromItem.period = period;
        }
      }
      this.dragData = null;
      this.highlightCell = null;
    },
    //Hiển thị highlight (ô sáng màu)
    getHighlightClass(dayId, sessionType, period) {
      return this.highlightCell &&
        this.highlightCell.dayId === dayId &&
        this.highlightCell.sessionType === sessionType &&
        this.highlightCell.period === period
        ? "bg-warning"
        : "";
    },
    // Xác nhận hoán đổi, hoán đổi teacherId và subjectId giữa 2 tiết.
    confirmSwap() {
      if (this.swapInfo) {
        const { fromItem, toItem } = this.swapInfo;
        // Hoán đổi teacherId
        const tempTeacherId = fromItem.teacherId;
        fromItem.teacherId = toItem.teacherId;
        toItem.teacherId = tempTeacherId;
        // Hoán đổi subjectId
        const tempSubjectId = fromItem.subjectId;
        fromItem.subjectId = toItem.subjectId;
        toItem.subjectId = tempSubjectId;
      }
      this.showModal = false;
      this.swapInfo = null;
      this.dragData = null;
      this.highlightCell = null;
    },
    //Hủy hoán đổi, đóng modal.
    cancelSwap() {
      this.showModal = false;
      this.swapInfo = null;
      this.dragData = null;
      this.highlightCell = null;
    },
  },
};
</script>
