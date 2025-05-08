// sharedSchedule.js

const schedule = {
  "Thứ 2": {
    morning: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} },
    afternoon: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} },
  },
  "Thứ 3": {
    morning: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} },
    afternoon: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} },
  },
  "Thứ 4": {
    morning: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} },
    afternoon: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} },
  },
  "Thứ 5": {
    morning: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} },
    afternoon: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} },
  },
  "Thứ 6": {
    morning: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} },
    afternoon: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} },
  },
};

function getSchedule() {
  const localData = localStorage.getItem("savedSchedule");
  return localData ? JSON.parse(localData) : schedule;
}

function saveSchedule(newSchedule) {
  localStorage.setItem("savedSchedule", JSON.stringify(newSchedule));
}

export { getSchedule, saveSchedule };
