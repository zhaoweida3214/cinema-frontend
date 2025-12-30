<template>
  <div class="container py-6">
    <h2 class="mb-4">我的订单</h2>
    
    <div v-if="orders.length > 0" class="orders-list">
      <div v-for="order in orders" :key="order.id" class="card order-card">
        <div class="order-header">
          <div class="movie-info">
            <h3>{{ order.movieTitle }}</h3>
            <p class="text-muted text-sm">{{ order.hallName }} · {{ new Date(order.startTime).toLocaleString() }}</p>
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

        <div class="order-footer" v-if="order.status === 'PENDING'">
          <button
            @click="() => handlePay(order.id)"
            class="btn btn-primary btn-sm"
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
import { onMounted, ref } from 'vue'
import { getMyOrders, payOrder } from '@/api/seats'

const orders = ref<any[]>([])

onMounted(async () => {
  const res = await getMyOrders()
  console.log('后端返回的订单数据:', res.data.data) // 方便调试查看真实数据
  orders.value = res.data.data
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

const getStatusClass = (status: string) => {
  switch (status) {
    case 'PAID': return 'badge-success';
    case 'PENDING': return 'badge-warning';
    default: return 'badge-danger';
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'PAID': return '已支付';
    case 'PENDING': return '待支付';
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
