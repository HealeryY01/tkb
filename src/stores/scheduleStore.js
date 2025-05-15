const defaultScheduleVersion = "v3";

const defaultSchedule = {
  version: defaultScheduleVersion,
  data: {
    "Thứ 2": {
      morning: {
        1: {
          "1A": { subject: "Toán", teacher: "GV A" },
          "1B": { subject: "Văn", teacher: "GV B" },
          "1C": { subject: "Anh", teacher: "GV C" },
        },
        2: {
          "2A": { subject: "Toán", teacher: "GV D" },
          "2B": { subject: "Văn", teacher: "GV E" },
          "2C": { subject: "Anh", teacher: "GV F" },
        },
        3: {
          "1A": { subject: "Sử", teacher: "GV G" },
          "1B": { subject: "Địa", teacher: "GV H" },
          "1C": { subject: "GDCD", teacher: "GV A" },
        },
      },
      afternoon: {
        1: {
          "2A": { subject: "Lý", teacher: "GV B" },
          "2B": { subject: "Hóa", teacher: "GV C" },
        },
        2: {
          "2C": { subject: "Sinh", teacher: "GV D" },
          "1A": { subject: "Nhạc", teacher: "GV E" },
        },
      },
    },
  },
};

const scheduleStore = {
  schedule: null,

  init() {
    const localData = localStorage.getItem("savedSchedule");
    if (!localData) {
      localStorage.setItem("savedSchedule", JSON.stringify(defaultSchedule));
      this.schedule = JSON.parse(JSON.stringify(defaultSchedule.data));
    } else {
      const parsed = JSON.parse(localData);
      if (parsed.version !== defaultScheduleVersion) {
        localStorage.setItem("savedSchedule", JSON.stringify(defaultSchedule));
        this.schedule = JSON.parse(JSON.stringify(defaultSchedule.data));
      } else {
        this.schedule = parsed.data;
      }
    }
  },

  save() {
    localStorage.setItem(
      "savedSchedule",
      JSON.stringify({
        version: defaultScheduleVersion,
        data: this.schedule,
      })
    );
  },

  updateLesson(day, session, period, cls, value) {
    if (!this.schedule[day]) this.schedule[day] = {};
    if (!this.schedule[day][session]) this.schedule[day][session] = {};
    if (!this.schedule[day][session][period])
      this.schedule[day][session][period] = {};
    this.schedule[day][session][period][cls] = value;
    this.save();
  },

  reset() {
    localStorage.removeItem("savedSchedule");
    this.schedule = JSON.parse(JSON.stringify(defaultSchedule.data));
  },
};

// Khởi tạo ngay khi import
scheduleStore.init();

export default scheduleStore;
