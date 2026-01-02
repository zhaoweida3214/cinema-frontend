<template>
  <div class="container py-6">
    <h2 class="mb-4">我的订单</h2>
    
    <div v-if="orders.length > 0" class="orders-list">
      <div v-for="order in orders" :key="order.id" class="card order-card">
        <div class="order-header">
          <div class="movie-info">
            <h3>{{ order.movieTitle }}</h3>
            <p class="text-muted text-sm">{{ order.hallName }} · {{ new Date(order.startTime).toLocaleString() }}</p>
            <!-- 显示订单过期时间（仅待支付状态） -->
            <p v-if="order.status === 'PENDING' && order.expiresAt" class="text-muted text-sm">
              过期时间: {{ new Date(order.expiresAt).toLocaleString() }}
            </p>
          </div>
          <div class="order-status">
            <span :class="['badge', getStatusClass(order.status)]">
              {{ getStatusText(order.status) }}
            </span>
          </div>
        </div>
        
        <div class="order-body">
          <div class="info-row">
            <span class="label">座位：</span>
            <span class="value">{{ Array.isArray(order.seatNumbers) ? order.seatNumbers.join(', ') : order.seatNumbers }}</span>
          </div>
        </div>

        <div class="order-footer" v-if="order.status === 'PENDING' || order.status === 'PAID'">
          <button
            @click="() => handleCancel(order.id)"
            class="btn btn-primary btn-sm"
          >
            取消订单
          </button>
          <button
              v-if="order.status === 'PENDING'"
              @click="() => handlePay(order.id)"
              class="btn btn-primary btn-sm ml-2"
          >
            立即支付
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>暂无订单</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import {cancelOrder, getMyOrders, payOrder} from '@/api/seats'

const orders = ref<any[]>([])
let refreshTimer: number | null = null // 声明refreshTimer变量

// 定义loadOrders函数
const loadOrders = async () => {
  const res = await getMyOrders()
  console.log('后端返回的订单数据:', res.data.data) // 方便调试查看真实数据
  orders.value = res.data.data
}

onMounted(async () => {
  // 初始加载订单
  await loadOrders()

  // 设置定时刷新，每隔60秒刷新一次
  refreshTimer = window.setInterval(async () => {
    await loadOrders()
  }, 60000)
})

onUnmounted(() => {
  // 清理定时器
  if (refreshTimer) {
    window.clearInterval(refreshTimer)
    refreshTimer = null
  }
})


const handlePay = async (orderId: number) => {
  if (confirm('确认支付？')) {
    await payOrder(orderId)
    alert('支付成功！')
    // 重新加载
    const res = await getMyOrders()
    orders.value = res.data.data
  }
}
// 添加取消订单的处理函数
const handleCancel = async (orderId: number) => {
  if (confirm('确认取消订单？')) {
    try {
      await cancelOrder(orderId)
      alert('订单已取消！')
      // 重新加载订单列表
      const res = await getMyOrders()
      orders.value = res.data.data
    } catch (error) {
      console.error('取消订单失败:', error)
      alert('取消订单失败，请稍后重试')
    }
  }
}
const getStatusClass = (status: string) => {
  switch (status) {
    case 'PAID': return 'badge-success';
    case 'PENDING': return 'badge-warning';
    case 'CANCELLED': return 'badge-danger';
    default: return 'badge-danger';
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'PAID': return '已支付';
    case 'PENDING': return '待支付';
    case 'CANCELLED': return '已取消';
    default: return '已取消';
  }
}
</script>

<style scoped>
.py-6 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
}

.movie-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-success {
  background-color: #d1fae5;
  color: #065f46;
}

.badge-warning {
  background-color: #fef3c7;
  color: #92400e;
}

.badge-danger {
  background-color: #fee2e2;
  color: #991b1b;
}

.order-body {
  font-size: 0.95rem;
}

.info-row {
  display: flex;
  gap: 0.5rem;
}

.label {
  color: var(--text-light);
}

.order-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: var(--text-light);
  background: var(--card-bg);
  border-radius: var(--radius);
  border: 1px dashed var(--border-color);
}
</style>
