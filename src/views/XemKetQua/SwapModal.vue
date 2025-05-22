<template>
  <div
    class="modal fade"
    id="swapModal"
    tabindex="-1"
    aria-hidden="true"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            @click="cancel"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <div class="swap-container">
            <div class="swap-from">
              <h5 :class="{ 'text-primary': from.lesson }">
                {{ from.subjectName || "Ô trống" }}
                <small class="text-muted d-block">
                  {{ getPositionText(from) }}
                </small>
              </h5>
              <div v-if="from.lesson" class="teacher-info">
                Giáo viên: {{ from.teacherName }}
              </div>
            </div>

            <div class="swap-arrow">
              <i class="bi bi-arrow-left-right"></i>
            </div>

            <div class="swap-to">
              <h5 :class="{ 'text-primary': to.lesson }">
                {{ to.subjectName || "Ô trống" }}
                <small class="text-muted d-block">
                  {{ getPositionText(to) }}
                </small>
              </h5>
              <div v-if="to.lesson" class="teacher-info">
                Giáo viên: {{ to.teacherName }}
              </div>
            </div>
          </div>

          <div v-if="bothEmpty" class="alert alert-warning mt-3">
            Không thể thực hiện đổi tiết giữa hai ô trống
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="cancel">Hủy</button>
          <button
            type="button"
            class="btn btn-primary"
            @click="confirm"
            :disabled="bothEmpty"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";

export default {
  props: {
    from: {
      type: Object,
      required: true,
    },
    to: {
      type: Object,
      required: true,
    },
    teachers: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      modal: null,
    };
  },

  computed: {
    title() {
      if (this.bothEmpty) return "Cảnh báo";
      if (!this.from.lesson || !this.to.lesson) return "Xác nhận di chuyển tiết";
      return "Xác nhận đổi tiết";
    },

    bothEmpty() {
      return !this.from.lesson && !this.to.lesson;
    },
  },

  methods: {
    getPositionText(item) {
      return `${item.day.name} - ${item.session.label} - Tiết ${item.period} - ${item.class.name}`;
    },

    show() {
      if (!this.modal) {
        this.modal = new Modal(document.getElementById("swapModal"));
      }
      this.modal.show();
    },

    hide() {
      if (this.modal) {
        this.modal.hide();
      }
    },

    confirm() {
      this.$emit("confirm");
      this.hide();
    },

    cancel() {
      this.$emit("cancel");
      this.hide();
    },
  },

  mounted() {
    this.modal = new Modal(document.getElementById("swapModal"));
    this.modal.show();
  },
};
</script>

<style scoped>
.swap-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.swap-from,
.swap-to {
  flex: 1;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f8f9fa;
}

.swap-arrow {
  font-size: 2rem;
  color: #0d6efd;
}

.teacher-info {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.text-primary {
  color: #0d6efd !important;
  font-weight: 500;
}

.modal-footer {
  border-top: none;
  padding-top: 0;
}

@media (max-width: 768px) {
  .swap-container {
    flex-direction: column;
    gap: 1rem;
  }

  .swap-arrow {
    transform: rotate(90deg);
  }
}
</style>
