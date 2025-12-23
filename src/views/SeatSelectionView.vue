<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getSeatMap, lockSeats } from '@/api/seats'

const route = useRoute()
const scheduleId = Number(route.params.id)
const seatMap = ref<any>(null)
const selectedSeats = ref<number[]>([])

// 加载座位图
onMounted(async () => {
  try {
    const res = await getSeatMap(scheduleId)
    seatMap.value = res.data.data
  } catch (err) {
    alert('加载座位失败，请重试')
  }
})

// 动态计算 grid 列数（用于 :style）
const gridColumns = computed(() => {
  const cols = seatMap.value?.cols || 10
  return `repeat(${cols}, 30px)`
})

// 切换座位选中状态
const toggleSeat = (seat: any) => {
  if (seat.status !== 'AVAILABLE') return

  const index = selectedSeats.value.indexOf(seat.id)
  if (index > -1) {
    selectedSeats.value.splice(index, 1)
  } else {
    selectedSeats.value.push(seat.id)
  }
}

// 锁定座位（创建订单）
const confirmLock = async () => {
  if (selectedSeats.value.length === 0) {
    alert('请选择至少一个座位')
    return
  }

  try {
    const res = await lockSeats({ scheduleId, seatIds: selectedSeats.value })
    if (res.data.code === 1) {
      alert('锁座成功！请前往“我的订单”完成支付。')
      selectedSeats.value = [] // 清空选择
    } else {
      alert(res.data.msg || '锁座失败')
    }
  } catch (err) {
    alert('网络错误，请检查后端是否运行')
  }
}
</script>

<template>
  <div v-if="seatMap" style="padding: 20px; max-width: 1200px; margin: 0 auto;">
    <h2>{{ seatMap.hallName }}</h2>
    <div class="screen">银幕</div>

    <!-- 使用 :style 动态设置 grid-template-columns -->
    <div class="seat-map" :style="{ 'grid-template-columns': gridColumns }">
      <div
        v-for="seat in seatMap.seats"
        :key="seat.id"
        :class="[
          'seat',
          seat.status.toLowerCase(),
          { selected: selectedSeats.includes(seat.id) }
        ]"
        @click="toggleSeat(seat)"
      >
        {{ seat.col }}
      </div>
    </div>

    <button
      @click="confirmLock"
      style="
        margin-top: 20px;
        padding: 10px 20px;
        background: #2196f3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      "
    >
      锁定选中座位 ({{ selectedSeats.length }})
    </button>
  </div>

  <div v-else style="text-align: center; padding: 50px;">
    正在加载座位信息...
  </div>
</template>

<style scoped>
.screen {
  text-align: center;
  padding: 10px;
  background: #333;
  color: white;
  margin-bottom: 20px;
  border-radius: 4px;
  font-weight: bold;
}

.seat-map {
  display: grid;
  gap: 2px;
  justify-content: center;
  margin-top: 10px;
}

.seat {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
}

.available {
  background: #4caf50;
  color: white;
}

.locked,
.sold {
  background: #ccc;
  cursor: not-allowed;
}

.selected {
  background: #2196f3 !important;
  color: white;
}
</style>
