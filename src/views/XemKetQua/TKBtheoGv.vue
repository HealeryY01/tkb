<template>
    <div class="container-fluid mt-4">
        <div class="card">
            <div class="card-header bg-primary text-white">
                <h4 class="mb-0">Thời Khóa Biểu Theo Giáo Viên</h4>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-4">
                        <label class="font-weight-bold">Chọn giáo viên:</label>
                        <select v-model="selectedTeacher" class="form-control" @change="filterSchedule">
                            <option value="" disabled selected>-- Chọn giáo viên --</option>
                            <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                                {{ teacher.name }}
                            </option>
                        </select>
                    </div>
                </div>

                <div v-if="selectedTeacher" class="teacher-schedule">
                    <h5 class="teacher-name mb-4">
                        <i class="fa fa-user mr-2"></i>
                        {{ getTeacherName(selectedTeacher) }}
                    </h5>

                    <div v-for="session in sessions" :key="session.type" class="mb-4">
                        <h5 class="session-title">{{ session.name }}</h5>
                        <div class="table-responsive">
                            <table class="table table-bordered table-hover">
                                <thead class="thead-light">
                                    <tr>
                                        <th>Tiết</th>
                                        <th v-for="day in days" :key="day.id">{{ day.name }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="period in periods" :key="period.id">
                                        <td class="align-middle">{{ period.name }}</td>
                                        <td v-for="day in days" :key="day.id" @dragover.prevent
                                            @drop="dropLesson(day.id, period.id, session.type, $event)">
                                            <div v-for="lesson in getLessons(day.id, period.id, session.type)"
                                                :key="lesson.id" class="lesson-item" draggable="true"
                                                @dragstart="dragLesson($event, lesson)">
                                                <div class="lesson-content">
                                                    <strong>{{ getSubjectName(lesson.subjectId) }}</strong><br>
                                                    {{ getClassName(lesson.classId) }}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div v-else class="alert alert-info">
                    Vui lòng chọn giáo viên để xem thời khóa biểu
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
            periods: [
                { id: 1, name: "Tiết 1" },
                { id: 2, name: "Tiết 2" },
                { id: 3, name: "Tiết 3" },
                { id: 4, name: "Tiết 4" },
                { id: 5, name: "Tiết 5" },
            ],
            sessions: [
                { type: "morning", name: "Buổi sáng" },
                { type: "afternoon", name: "Buổi chiều" }
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
                    sessionType: "morning",
                    classId: 1,
                    subjectId: 2,
                    teacherId: 2,
                },
                {
                    id: 4,
                    dayId: 3,
                    period: 3,
                    sessionType: "afternoon",
                    classId: 2,
                    subjectId: 3,
                    teacherId: 3,
                },
            ],
            selectedTeacher: "",
            filteredSchedule: [],
            draggedLesson: null,
        };
    },
    methods: {
        filterSchedule() {
            if (this.selectedTeacher) {
                this.filteredSchedule = this.schedule.filter(
                    (lesson) => lesson.teacherId == this.selectedTeacher
                );
            }
        },
        getLessons(dayId, periodId, sessionType) {
            return this.filteredSchedule.filter(
                (lesson) =>
                    lesson.dayId == dayId &&
                    lesson.period == periodId &&
                    lesson.sessionType == sessionType
            );
        },
        getSubjectName(subjectId) {
            const subject = this.subjects.find((s) => s.id == subjectId);
            return subject ? subject.name : "";
        },
        getClassName(classId) {
            for (const grade of this.grades) {
                const cls = grade.classes.find((c) => c.id == classId);
                if (cls) return cls.name;
            }
            return "";
        },
        getTeacherName(teacherId) {
            const teacher = this.teachers.find((t) => t.id == teacherId);
            return teacher ? teacher.name : "";
        },
        dragLesson(event, lesson) {
            this.draggedLesson = lesson;
            event.dataTransfer.setData("text/plain", lesson.id);
        },
        dropLesson(dayId, periodId, sessionType, event) {
            event.preventDefault();
            if (!this.draggedLesson) return;

            this.schedule = this.schedule.map((lesson) => {
                if (lesson.id === this.draggedLesson.id) {
                    return {
                        ...lesson,
                        dayId: dayId,
                        period: periodId,
                        sessionType: sessionType
                    };
                }
                return lesson;
            });

            this.filterSchedule();
            this.draggedLesson = null;
        },
    },
};
</script>

<style scoped>
.lesson-item {
    background-color: #e9f7fe;
    border: 1px solid #b8daff;
    border-radius: 4px;
    padding: 8px;
    margin-bottom: 5px;
    cursor: move;
}

.lesson-content {
    font-size: 0.9rem;
}

.table td {
    min-width: 150px;
    height: 80px;
    vertical-align: top;
}

.table th {
    text-align: center;
}

.table td:first-child {
    font-weight: bold;
    text-align: center;
    width: 80px;
}

.session-title {
    background-color: #f8f9fa;
    padding: 8px;
    border-left: 4px solid #007bff;
    margin-bottom: 15px;
}

.teacher-name {
    color: #2c3e50;
    font-weight: 600;
    padding-bottom: 8px;
    border-bottom: 2px solid #eee;
}

.alert {
    margin-top: 20px;
}

select[disabled] {
    color: #6c757d;
    background-color: #e9ecef;
}
</style>