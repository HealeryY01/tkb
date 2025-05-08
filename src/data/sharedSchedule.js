const defaultScheduleVersion = "v2"; // đổi version khi cập nhật
const defaultSchedule = {
  version: defaultScheduleVersion,
  data: {
    "Thứ 2": {
      morning: {
        1: { "1A": "Toán - GV A", "1B": "Văn - GV B", "1C": "Anh - GV C" },
        2: { "2A": "Toán - GV D", "2B": "Văn - GV E", "2C": "Anh - GV F" },
        3: { "1A": "Sử - GV G", "1B": "Địa - GV H", "1C": "GDCD - GV A" },
        4: {},
        5: {},
      },
      afternoon: {
        1: { "2A": "Lý - GV B", "2B": "Hóa - GV C" },
        2: { "2C": "Sinh - GV D", "1A": "Nhạc - GV E" },
        3: { "1B": "Mỹ thuật - GV F", "1C": "Công nghệ - GV G" },
        4: {},
        5: {},
      },
    },
    "Thứ 3": {
      morning: {
        1: { "1A": "Toán - GV A", "1B": "Toán - GV A", "1C": "Văn - GV B" },
        2: { "2A": "Anh - GV C", "2B": "Sử - GV D", "2C": "Địa - GV E" },
        3: { "1A": "Hóa - GV F", "1B": "Sinh - GV G", "1C": "Lý - GV H" },
        4: {},
        5: {},
      },
      afternoon: {
        1: { "1A": "Thể dục - GV C", "2B": "Tin - GV D" },
        2: { "2C": "Tin - GV E", "1B": "GDCD - GV F" },
        3: { "1C": "Thể dục - GV G" },
        4: {},
        5: {},
      },
    },
    "Thứ 4": {
      morning: {
        1: { "1A": "Văn - GV B", "1B": "Toán - GV A", "2A": "Anh - GV C" },
        2: { "2B": "Sử - GV D", "2C": "Địa - GV E" },
        3: { "1A": "GDCD - GV F", "1C": "Mỹ thuật - GV G" },
        4: {},
        5: {},
      },
      afternoon: {
        1: { "1B": "Âm nhạc - GV H", "1A": "Tin - GV A" },
        2: { "2A": "Lý - GV B", "2B": "Hóa - GV C" },
        3: {},
        4: {},
        5: {},
      },
    },
    "Thứ 5": {
      morning: {
        1: { "1A": "Toán - GV A", "1B": "Văn - GV B", "1C": "Anh - GV C" },
        2: { "2A": "Toán - GV D", "2B": "Văn - GV E", "2C": "Anh - GV F" },
        3: { "1A": "Sử - GV G", "1B": "Địa - GV H", "1C": "GDCD - GV A" },
        4: {},
        5: {},
      },
      afternoon: {
        1: { "2A": "Lý - GV B", "2B": "Hóa - GV C" },
        2: { "2C": "Sinh - GV D", "1A": "Nhạc - GV E" },
        3: { "1B": "Mỹ thuật - GV F", "1C": "Công nghệ - GV G" },
        4: {},
        5: {},
      },
    },
    "Thứ 6": {
      morning: {
        1: { "1A": "Toán - GV A", "1B": "Toán - GV A", "1C": "Văn - GV B" },
        2: { "2A": "Anh - GV C", "2B": "Sử - GV D", "2C": "Địa - GV E" },
        3: { "1A": "Hóa - GV F", "1B": "Sinh - GV G", "1C": "Lý - GV H" },
        4: {},
        5: {},
      },
      afternoon: {
        1: { "1A": "Thể dục - GV C", "2B": "Tin - GV D" },
        2: { "2C": "Tin - GV E", "1B": "GDCD - GV F" },
        3: { "1C": "Thể dục - GV G" },
        4: {},
        5: {},
      },
    },
  },
};

function getSchedule() {
  const localData = localStorage.getItem("savedSchedule");
  if (!localData) {
    localStorage.setItem("savedSchedule", JSON.stringify(defaultSchedule));
    return defaultSchedule.data;
  }

  const parsed = JSON.parse(localData);
  if (parsed.version !== defaultScheduleVersion) {
    // Cập nhật khi version thay đổi
    localStorage.setItem("savedSchedule", JSON.stringify(defaultSchedule));
    return defaultSchedule.data;
  }

  return parsed.data;
}

function saveSchedule(newSchedule) {
  const wrapped = {
    version: defaultScheduleVersion,
    data: newSchedule,
  };
  localStorage.setItem("savedSchedule", JSON.stringify(wrapped));
}

export { getSchedule, saveSchedule };
