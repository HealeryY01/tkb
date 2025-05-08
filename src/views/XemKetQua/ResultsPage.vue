<template>
  <div>
    <div class="d-flex gap-2 mb-3">
      <button @click="tab = 'lop'" :class="btnClass('lop')">TKB theo lớp</button>
      <button @click="tab = '1lop1gv'" :class="btnClass('1lop1gv')">
        TKB theo 1 lớp - 1 Gv
      </button>
    </div>

    <TKBtheoLop v-if="tab === 'lop'" />
    <TKBtheo1Lop_1Gv v-else />
  </div>
</template>

<script>
import TKBtheoLop from "@/views/XemKetQua/TKBtheoLop.vue";
import TKBtheo1Lop_1Gv from "@/views/XemKetQua/TKBtheo1Lop_1Gv.vue";

export default {
  components: { TKBtheoLop, TKBtheo1Lop_1Gv },
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
