<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { getSeatMap, lockSeats } from "@/api/seats";
import { toast } from "@/utils/toast";

const route = useRoute();
const scheduleId = Number(route.params.id);
const seatMap = ref<any>(null);
const selectedSeats = ref<number[]>([]);
const hoveredSeat = ref<any>(null);
const tooltipPosition = ref({ x: 0, y: 0 });

// 加载座位图
onMounted(async () => {
  try {
    const res = await getSeatMap(scheduleId);
    seatMap.value = res.data.data;
  } catch (err) {
    toast.error("加载座位失败，请重试");
  }
});

// 动态计算 grid 列数（用于 :style）
const gridColumns = computed(() => {
  const cols = seatMap.value?.cols || 10;
  return `repeat(${cols}, 36px)`; // 增加座位大小
});

// 计算所有行号
const rowNumbers = computed(() => {
  if (!seatMap.value) return [];
  const rows = seatMap.value.rows;
  return Array.from({ length: rows }, (_, i) => i + 1);
});

// 计算选中座位的总价
const totalPrice = computed(() => {
  if (!seatMap.value || !selectedSeats.value.length) return 0;
  
  return selectedSeats.value.reduce((total, seatId) => {
    const seat = seatMap.value.seats.find((s: any) => s.id === seatId);
    // 优先使用后端返回的座位价格，否则使用默认价格
    const price = seat?.price !== undefined ? seat.price : (seat?.type === 'VIP' ? 80 : 50);
    return total + price;
  }, 0);
});

// 计算选中的VIP座位数量
const selectedVipSeatsCount = computed(() => {
  if (!seatMap.value || !selectedSeats.value.length) return 0;
  
  return selectedSeats.value.filter(seatId => {
    const seat = seatMap.value.seats.find((s: any) => s.id === seatId);
    return seat?.type === 'VIP';
  }).length;
});

// 切换座位选中状态
const toggleSeat = (seat: any) => {
  if (seat.status !== "AVAILABLE") return;

  const index = selectedSeats.value.indexOf(seat.id);
  if (index > -1) {
    selectedSeats.value.splice(index, 1);
  } else {
    selectedSeats.value.push(seat.id);
  }
};

// 清空选择
const clearSelection = () => {
  if (selectedSeats.value.length === 0) return;
  selectedSeats.value = [];
  toast.info("已清空选择");
};

// 鼠标悬停显示座位信息
const handleSeatHover = (seat: any, event: MouseEvent) => {
  if (seat.status === "AVAILABLE") {
    hoveredSeat.value = seat;
    tooltipPosition.value = {
      x: event.clientX,
      y: event.clientY
    };
  }
};

const handleSeatLeave = () => {
  hoveredSeat.value = null;
};

// 锁定座位（创建订单）
const confirmLock = async () => {
  if (selectedSeats.value.length === 0) {
    toast.warning("请选择至少一个座位");
    return;
  }

  try {
    const res = await lockSeats({ scheduleId, seatIds: selectedSeats.value });
    if (res.data.code === 1) {
      toast.success("锁座成功！请前往“我的订单”完成支付。");
      selectedSeats.value = []; // 清空选择
    } else {
      toast.error(res.data.msg || "锁座失败");
    }
  } catch (err) {
    toast.error("网络错误，请检查后端是否运行");
  }
};
</script>

<template>
  <div v-if="seatMap" class="container py-6">
    <div class="header-section text-center">
      <h2>{{ seatMap.hallName }}</h2>
      <p class="text-muted">请选择您喜欢的座位</p>
    </div>

    <div class="seat-legend">
      <div class="legend-item">
        <div class="seat-icon available normal">
          <svg viewBox="0 0 100 100" class="seat-svg">
            <path
                d="M10,20 C10,10 20,5 50,5 C80,5 90,10 90,20 L90,60 C90,70 80,75 80,75 L80,85 C80,90 75,95 70,95 L30,95 C25,95 20,90 20,85 L20,75 C20,75 10,70 10,60 Z"
            />
          </svg>
        </div>
        <span>普通可选</span>
      </div>

      <div class="legend-item">
        <div class="seat-icon available vip">
          <svg viewBox="0 0 100 100" class="seat-svg">
            <path
                d="M10,20 C10,10 20,5 50,5 C80,5 90,10 90,20 L90,60 C90,70 80,75 80,75 L80,85 C80,90 75,95 70,95 L30,95 C25,95 20,90 20,85 L20,75 C20,75 10,70 10,60 Z"
            />
          </svg>
        </div>
        <span>VIP可选</span>
      </div>

      <div class="legend-item">
        <div class="seat-icon selected">
          <svg viewBox="0 0 100 100" class="seat-svg">
            <path
                d="M10,20 C10,10 20,5 50,5 C80,5 90,10 90,20 L90,60 C90,70 80,75 80,75 L80,85 C80,90 75,95 70,95 L30,95 C25,95 20,90 20,85 L20,75 C20,75 10,70 10,60 Z"
            />
          </svg>
        </div>
        <span>已选</span>
      </div>

      <div class="legend-item">
        <div class="seat-icon sold">
          <svg viewBox="0 0 100 100" class="seat-svg">
            <path
                d="M10,20 C10,10 20,5 50,5 C80,5 90,10 90,20 L90,60 C90,70 80,75 80,75 L80,85 C80,90 75,95 70,95 L30,95 C25,95 20,90 20,85 L20,75 C20,75 10,70 10,60 Z"
            />
          </svg>
        </div>
        <span>已售</span>
      </div>
    </div>

    <div class="screen-container">
      <div class="screen">银幕中央</div>
    </div>

    <div class="main-seat-area">
      <!-- 左侧行号条 -->
      <div class="row-numbers">
        <div v-for="r in rowNumbers" :key="r" class="row-num">{{ r }}</div>
      </div>

      <!-- 座位网格 -->
      <div class="seat-map-container">
        <div class="seat-map-wrapper">
          <div class="seat-map" :style="{ 'grid-template-columns': gridColumns }">
            <div
                v-for="seat in seatMap.seats"
                :key="seat.id"
                class="seat-wrapper"
                @click="toggleSeat(seat)"
                @mouseenter="handleSeatHover(seat, $event)"
                @mouseleave="handleSeatLeave"
                :title="`${seat.row}排${seat.col}座 - ${seat.type === 'VIP' ? 'VIP座位' : '普通座位'}`"
            >
              <!-- 座位图标 SVG -->
              <div
                  :class="[
              'seat-icon',
              seat.status.toLowerCase(),
              seat.type.toLowerCase(),
              { selected: selectedSeats.includes(seat.id) }
            ]"
              >
                <!-- 简单的座位形状 -->
                <svg viewBox="0 0 100 100" class="seat-svg">
                  <path
                      d="M10,20 C10,10 20,5 50,5 C80,5 90,10 90,20 L90,60 C90,70 80,75 80,75 L80,85 C80,90 75,95 70,95 L30,95 C25,95 20,90 20,85 L20,75 C20,75 10,70 10,60 Z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部选座信息栏 -->
    <div class="action-bar card">
      <div class="selected-info">
        <div class="seat-summary">
          <span>已选座位：</span>
          <span v-if="selectedSeats.length === 0" class="text-muted">未选择</span>
          <span v-else class="text-primary font-bold"
            >{{ selectedSeats.length }} 个</span
          >
        </div>
        <div class="type-summary">
          <span>VIP座：</span>
          <span class="text-warning font-bold">{{ selectedVipSeatsCount }} 个</span>
        </div>
        <div class="price-summary">
          <span>总计：</span>
          <span class="text-danger font-bold">¥{{ totalPrice }}</span>
        </div>
      </div>
      <div class="action-buttons">
        <button
          v-if="selectedSeats.length > 0"
          @click="clearSelection"
          class="btn btn-outline-danger btn-sm mr-2"
        >
          清空选择
        </button>
        <button
          @click="confirmLock"
          class="btn btn-primary"
          :disabled="selectedSeats.length === 0"
        >
          确认选座
        </button>
      </div>
    </div>

    <!-- 座位价格提示 -->
    <Teleport to="body">
      <div
        v-if="hoveredSeat"
        class="seat-tooltip"
        :style="{
          left: tooltipPosition.x + 10 + 'px',
          top: tooltipPosition.y + 10 + 'px'
        }"
      >
        <div class="tooltip-content">
          <div class="tooltip-row">
            <strong>{{ hoveredSeat.row }}排{{ hoveredSeat.col }}座</strong>
          </div>
          <div class="tooltip-row">
            <span>{{ hoveredSeat.type === 'VIP' ? 'VIP座位' : '普通座位' }}</span>
          </div>
          <div class="tooltip-row price">
            <span>¥{{ hoveredSeat.price !== undefined ? hoveredSeat.price : (hoveredSeat.type === 'VIP' ? 80 : 50) }}</span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>

  <div v-else class="loading-state">
    <div class="spinner"></div>
    <p>正在加载座位信息...</p>
  </div>
</template>

<style scoped>
.py-6 {
  padding-top: 2rem;
  padding-bottom: 8rem; /* 留出底部栏空间 */
}

.header-section {
  margin-bottom: 2rem;
}

.seat-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.legend-item .seat-icon {
  width: 24px;
  height: 24px;
}

.screen-container {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  perspective: 500px;
}

.screen {
  width: 80%;
  max-width: 600px;
  height: 30px;
  background: #f0f0f0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 0.8rem;
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
  transform: rotateX(-30deg) scale(0.9);
  border: 1px solid #ddd;
}

.main-seat-area {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;
  padding: 0 1rem;
}

.row-numbers {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 4px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  padding: 5px 10px;
  height: fit-content;
}

.row-num {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.8rem;
}

.seat-map-container {
  overflow-x: auto;
  padding: 0 1rem;
  display: flex;
  justify-content: center;
  flex: 1;
}

.seat-map-wrapper {
  display: flex;
  justify-content: center;
  width: fit-content;
}

.seat-map {
  display: grid;
  gap: 8px;
  margin: 0 auto;
}

.seat-wrapper {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.seat-wrapper:hover .available {
  transform: scale(1.15);
}

.seat-wrapper:active .available {
  animation: seatClick 0.3s ease;
}

@keyframes seatClick {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.9); }
}

.seat-svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.seat-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 状态颜色定义 */
.available {
  color: #ffffff; /* 内部填充白 */
  stroke: #b0b0b0; /* 边框灰 */
  stroke-width: 2px;
}
.available .seat-svg {
  fill: white;
  stroke: #cbd5e1;
  stroke-width: 5px;
}

.selected .seat-svg {
  fill: #4caf50 !important; /* 绿色 */
  stroke: none;
}

.sold,
.locked {
  cursor: not-allowed;
}
.sold .seat-svg,
.locked .seat-svg {
  fill: #ef4444; /* 红色 */
  stroke: none;
}

/* 座位类型颜色定义 */
.normal .seat-svg {
  fill: #94a3b8; /* 石墨灰 */
}

.vip .seat-svg {
  fill: #f59e0b; /* 琥珀色 */
}

.normal.selected .seat-svg {
  fill: #4caf50 !important; /* 选中时绿色 */
}

.vip.selected .seat-svg {
  fill: #4caf50 !important; /* 选中时绿色 */
}

/* 确保选中状态具有最高优先级 */
.available.selected .seat-svg,
.normal.available.selected .seat-svg,
.vip.available.selected .seat-svg {
  fill: #4caf50 !important; /* 选中时绿色 */
}

.normal.available .seat-svg {
  fill: #e2e8f0; /* 普通座位可用时颜色 */
}

.vip.available .seat-svg {
  fill: #fde68a; /* VIP座位可用时颜色 */
}

.normal.sold .seat-svg,
.normal.locked .seat-svg {
  fill: #ef4444; /* 普通座位售出/锁定时颜色 */
}

.vip.sold .seat-svg,
.vip.locked .seat-svg {
  fill: #ef4444; /* VIP座位售出/锁定时颜色 */
}

/* 底部固定栏 */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  border-radius: 0; /* 直角 */
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-outline-danger {
  background: transparent;
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
}

.btn-outline-danger:hover {
  background: var(--danger-color);
  color: white;
}

.mr-2 {
  margin-right: 0.5rem;
}

.selected-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-start;
}

.seat-summary, .price-summary, .type-summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.text-danger {
  color: #ef4444;
}

.text-warning {
  color: #f59e0b;
}

.loading-state {
  text-align: center;
  padding: 4rem;
  color: #666;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 座位提示框 */
.seat-tooltip {
  position: fixed;
  z-index: 10000;
  pointer-events: none;
  animation: tooltipFadeIn 0.2s ease-out;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tooltip-content {
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.tooltip-row {
  margin-bottom: 0.25rem;
}

.tooltip-row:last-child {
  margin-bottom: 0;
}

.tooltip-row.price {
  color: #fbbf24;
  font-size: 1rem;
  font-weight: bold;
  margin-top: 0.5rem;
}
</style>
