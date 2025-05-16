import Vue from "vue";

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
        4: {
          "2A": { subject: "Sinh", teacher: "GV I" },
          "2B": { subject: "Lý", teacher: "GV J" },
          "2C": { subject: "Hóa", teacher: "GV K" },
        },
        5: {
          "1A": { subject: "Thể dục", teacher: "GV L" },
          "1B": { subject: "Mỹ thuật", teacher: "GV M" },
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
        3: {
          "1B": { subject: "Tin học", teacher: "GV F" },
          "1C": { subject: "Thể dục", teacher: "GV G" },
        },
        4: {
          "2A": { subject: "Công nghệ", teacher: "GV H" },
          "2B": { subject: "GDCD", teacher: "GV I" },
        },
      },
    },
    "Thứ 3": {
      morning: {
        1: {
          "1A": { subject: "Toán", teacher: "GV A" },
          "2A": { subject: "Văn", teacher: "GV B" },
        },
        2: {
          "1B": { subject: "Anh", teacher: "GV C" },
          "2B": { subject: "Toán", teacher: "GV D" },
        },
        3: {
          "1C": { subject: "Sử", teacher: "GV E" },
          "2C": { subject: "Địa", teacher: "GV F" },
        },
        4: {
          "1A": { subject: "Sinh", teacher: "GV G" },
          "1B": { subject: "Tin học", teacher: "GV H" },
        },
        5: {
          "2A": { subject: "Thể dục", teacher: "GV I" },
        },
      },
      afternoon: {
        1: {
          "2B": { subject: "Nhạc", teacher: "GV J" },
          "1C": { subject: "Mỹ thuật", teacher: "GV K" },
        },
        2: {
          "1A": { subject: "GDCD", teacher: "GV L" },
          "2C": { subject: "Công nghệ", teacher: "GV M" },
        },
      },
    },
    "Thứ 4": {
      morning: {
        1: {
          "1A": { subject: "Toán", teacher: "GV A" },
          "2A": { subject: "Văn", teacher: "GV B" },
        },
        2: {
          "1B": { subject: "Anh", teacher: "GV C" },
          "2B": { subject: "Toán", teacher: "GV D" },
        },
        3: {
          "1C": { subject: "Hóa", teacher: "GV E" },
          "2C": { subject: "Lý", teacher: "GV F" },
        },
        4: {
          "1A": { subject: "Sinh", teacher: "GV G" },
        },
      },
      afternoon: {
        1: {
          "1B": { subject: "GDCD", teacher: "GV H" },
          "2A": { subject: "Thể dục", teacher: "GV I" },
        },
        2: {
          "1C": { subject: "Tin học", teacher: "GV J" },
        },
      },
    },
    "Thứ 5": {
      morning: {
        1: {
          "1A": { subject: "Sử", teacher: "GV K" },
          "2A": { subject: "Địa", teacher: "GV L" },
        },
        2: {
          "1B": { subject: "Văn", teacher: "GV M" },
          "2B": { subject: "Toán", teacher: "GV A" },
        },
        3: {
          "1C": { subject: "Anh", teacher: "GV B" },
          "2C": { subject: "Hóa", teacher: "GV C" },
        },
      },
      afternoon: {
        1: {
          "2A": { subject: "Nhạc", teacher: "GV D" },
          "2B": { subject: "Mỹ thuật", teacher: "GV E" },
        },
        2: {
          "1A": { subject: "GDCD", teacher: "GV F" },
          "1B": { subject: "Công nghệ", teacher: "GV G" },
        },
      },
    },
    "Thứ 6": {
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
          "1A": { subject: "Sinh", teacher: "GV G" },
          "1B": { subject: "Địa", teacher: "GV H" },
          "1C": { subject: "GDCD", teacher: "GV I" },
        },
        4: {
          "2A": { subject: "Sử", teacher: "GV J" },
          "2B": { subject: "Lý", teacher: "GV K" },
        },
      },
      afternoon: {
        1: {
          "2C": { subject: "Thể dục", teacher: "GV L" },
          "1A": { subject: "Tin học", teacher: "GV M" },
        },
        2: {
          "1B": { subject: "Mỹ thuật", teacher: "GV N" },
        },
      },
    },
  },
};

// Tạo observable cho state
const reactiveSchedule = Vue.observable({
  schedule: {},
});

const scheduleStore = {
  get schedule() {
    return reactiveSchedule.schedule;
  },

  init() {
    const localData = localStorage.getItem("savedSchedule");
    if (!localData) {
      localStorage.setItem("savedSchedule", JSON.stringify(defaultSchedule));
      reactiveSchedule.schedule = JSON.parse(
        JSON.stringify(defaultSchedule.data)
      );
    } else {
      const parsed = JSON.parse(localData);
      if (parsed.version !== defaultScheduleVersion) {
        localStorage.setItem("savedSchedule", JSON.stringify(defaultSchedule));
        reactiveSchedule.schedule = JSON.parse(
          JSON.stringify(defaultSchedule.data)
        );
      } else {
        reactiveSchedule.schedule = parsed.data;
      }
    }
  },

  save() {
    localStorage.setItem(
      "savedSchedule",
      JSON.stringify({
        version: defaultScheduleVersion,
        data: reactiveSchedule.schedule,
      })
    );
  },

  updateLesson(day, session, period, cls, value) {
    const s = reactiveSchedule.schedule;

    if (!s[day]) Vue.set(s, day, {});
    if (!s[day][session]) Vue.set(s[day], session, {});
    if (!s[day][session][period]) Vue.set(s[day][session], period, {});
    Vue.set(s[day][session][period], cls, value);

    this.save();
  },

  reset() {
    localStorage.removeItem("savedSchedule");
    reactiveSchedule.schedule = JSON.parse(
      JSON.stringify(defaultSchedule.data)
    );
  },
};

// Khởi tạo ngay khi import
scheduleStore.init();

export default scheduleStore;
