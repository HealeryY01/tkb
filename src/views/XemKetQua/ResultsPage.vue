<template>
  <div>
    <div class="d-flex gap-2 mb-3">
      <button @click="tab = 'lop'" :class="btnClass('lop')">TKB theo lớp</button>
      <button @click="tab = '1lop1gv'" :class="btnClass('1lop1gv')">TKB theo 1 lớp - 1 Gv</button>
      <button @click="tab = 'gv'" :class="btnClass('gv')">TKB theo GV</button>
    </div>

    <TKBtheoLop v-if="tab === 'lop'" />
    <TKBtheo1Lop_1Gv v-else-if="tab === '1lop1gv'" />
    <TKBtheoGv v-else />
  </div>
</template>

<script>
import TKBtheoLop from "@/views/XemKetQua/TKBtheoLop.vue";
import TKBtheo1Lop_1Gv from "@/views/XemKetQua/TKBtheo1Lop_1Gv.vue";
import TKBtheoGv from "@/views/XemKetQua/TKBtheoGv.vue"; // Import component mới

export default {
  components: { TKBtheoLop, TKBtheo1Lop_1Gv, TKBtheoGv }, // Đăng ký component mới
  data() {
    return {
      tab: "lop",
    };
  },
  methods: {
    btnClass(type) {
      return type === this.tab ? "btn btn-primary" : "btn btn-outline-primary";
    },
  },
};
</script>

<style scoped>
button.btn {
  margin-left: 10px;
  margin-bottom: 10px;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

button.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

button.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

button.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

button.btn-outline-primary:hover {
  background-color: #0d6efd;
  color: white;
}
</style>
