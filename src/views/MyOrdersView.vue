<template>
  <div class="container py-6">
    <div class="page-header">
      <h2 class="mb-4">📋 我的订单</h2>
      
      <!-- 订单筛选标签 -->
      <div class="filter-tabs">
        <button 
          v-for="tab in filterTabs" 
          :key="tab.value"
          @click="currentFilter = tab.value"
          :class="['filter-tab', { active: currentFilter === tab.value }]"
        >
          {{ tab.label }}
          <span v-if="getFilterCount(tab.value) > 0" class="tab-badge">
            {{ getFilterCount(tab.value) }}
          </span>
        </button>
      </div>
    </div>
    
    <div v-if="filteredOrders.length > 0" class="orders-list">
      <div v-for="(order, index) in filteredOrders" :key="order.id" class="card order-card" :style="{ animationDelay: `${index * 0.05}s` }">
        <div class="order-header">
          <div class="movie-info">
            <h3>{{ order.movieTitle }}</h3>
            <p class="text-muted text-sm">{{ order.hallName }} · {{ new Date(order.startTime).toLocaleString() }}</p>
            <!-- 显示订单过期时间（仅待支付状态） -->
            <p v-if="order.status === 'PENDING' && order.expiresAt" class="text-muted text-sm">
              过期时间: {{ new Date(order.expiresAt).toLocaleString() }} (剩余: <span :class="['countdown', { urgent: isUrgent(order.expiresAt) }]">{{ getOrderRemainingTime(order.expiresAt) }}</span>)
            </p>
          </div>
          <div class="order-status">
            <span :class="['status-badge', getStatusClass(order.status)]">
              <span class="status-icon">{{ getStatusIcon(order.status) }}</span>
              {{ getStatusText(order.status) }}
            </span>
          </div>
        </div>
        
        <div class="order-body">
          <div class="info-row">
            <span class="label">座位：</span>
            <span class="value">{{ Array.isArray(order.seatNumbers) ? order.seatNumbers.join(', ') : order.seatNumbers }}</span>
          </div>
          <div class="info-row" v-if="order.totalAmount">
            <span class="label">价格：</span>
            <span class="value text-danger">¥{{ order.totalAmount }}</span>
          </div>
        </div>

        <div class="order-footer" v-if="order.status === 'PENDING' || order.status === 'PAID'">
          <button
            @click="() => handleCancel(order.id)"
            class="btn btn-outline btn-sm mr-2"
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
      <div class="empty-icon">📭</div>
      <p>{{ currentFilter === 'ALL' ? '暂无订单' : `暂无${getFilterLabel()}订单` }}</p>
      <p class="text-sm text-muted">快去选座购票吧~</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import {cancelOrder, getMyOrders, payOrder} from '@/api/seats'
import { toast } from '@/utils/toast'

const orders = ref<any[]>([])
let refreshTimer: number | null = null // 声明refreshTimer变量
const currentFilter = ref('ALL')

const filterTabs = [
  { label: '全部', value: 'ALL' },
  { label: '待支付', value: 'PENDING' },
  { label: '已支付', value: 'PAID' },
  { label: '已取消', value: 'CANCELLED' }
]

// 筛选订单
const filteredOrders = computed(() => {
  if (currentFilter.value === 'ALL') {
    return orders.value
  }
  return orders.value.filter(order => order.status === currentFilter.value)
})

// 获取各状态订单数量
const getFilterCount = (status: string) => {
  if (status === 'ALL') return orders.value.length
  return orders.value.filter(order => order.status === status).length
}

// 获取当前筛选标签文字
const getFilterLabel = () => {
  const tab = filterTabs.find(t => t.value === currentFilter.value)
  return tab ? tab.label : ''
}

// 定义loadOrders函数
const loadOrders = async () => {
  const res = await getMyOrders()
  console.log('后端返回的订单数据:', res.data.data) // 方便调试查看真实数据
  orders.value = res.data.data
}


const handlePay = async (orderId: number) => {
  if (confirm('确认支付？')) {
    try {
      await payOrder(orderId)
      toast.success('支付成功！')
      // 重新加载
      await loadOrders()
    } catch (error) {
      toast.error('支付失败，请重试')
    }
  }
}
// 添加取消订单的处理函数
const handleCancel = async (orderId: number) => {
  if (confirm('确认取消订单？')) {
    try {
      await cancelOrder(orderId)
      toast.success('订单已取消！')
      // 重新加载订单列表
      await loadOrders()
    } catch (error) {
      console.error('取消订单失败:', error)
      toast.error('取消订单失败，请稍后重试')
    }
  }
}
const getStatusClass = (status: string) => {
  switch (status) {
    case 'PAID': return 'status-success';
    case 'PENDING': return 'status-warning';
    case 'CANCELLED': return 'status-danger';
    default: return 'status-danger';
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'PAID': return '✓';
    case 'PENDING': return '⏱';
    case 'CANCELLED': return '✕';
    default: return '✕';
  }
}

// 计算订单剩余时间
const getOrderRemainingTime = (expiresAt: string) => {
  if (!expiresAt) return '';
  
  const now = new Date();
  const expireTime = new Date(expiresAt);
  const diffMs = expireTime.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return '已过期';
  }
  
  const minutes = Math.floor(diffMs / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  return `${minutes}分${seconds}秒`;
}

// 判断是否紧急（剩余时间少于3分钟）
const isUrgent = (expiresAt: string) => {
  if (!expiresAt) return false;
  const now = new Date();
  const expireTime = new Date(expiresAt);
  const diffMs = expireTime.getTime() - now.getTime();
  return diffMs > 0 && diffMs < 3 * 60 * 1000; // 少于3分钟
}

// 实时更新倒计时
const updateCountdown = () => {
  // 触发视图更新
  orders.value = [...orders.value];
};

// 设置定时器更新倒计时
let countdownTimer: number | null = null;
onMounted(() => {
  // 初始加载订单
  loadOrders();

  // 设置定时刷新，每隔60秒刷新一次
  refreshTimer = window.setInterval(async () => {
    await loadOrders();
  }, 60000);
  
  // 设置倒计时更新，每秒更新一次
  countdownTimer = window.setInterval(() => {
    updateCountdown();
  }, 1000);
});

onUnmounted(() => {
  // 清理定时器
  if (refreshTimer) {
    window.clearInterval(refreshTimer);
    refreshTimer = null;
  }
  if (countdownTimer) {
    window.clearInterval(countdownTimer);
    countdownTimer = null;
  }
});
</script>

<style scoped>
.py-6 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

/* 筛选标签 */
.filter-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.filter-tab {
  padding: 0.5rem 1rem;
  border: 2px solid var(--border-color);
  background: white;
  border-radius: var(--radius);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-tab:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filter-tab.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.tab-badge {
  background: rgba(255, 255, 255, 0.3);
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
}

.filter-tab.active .tab-badge {
  background: rgba(255, 255, 255, 0.3);
}

.filter-tab:not(.active) .tab-badge {
  background: var(--bg-color);
  color: var(--text-light);
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
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
  from {
    opacity: 0;
    transform: translateY(20px);
  }
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

/* 状态徽章 */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-icon {
  font-size: 1rem;
}

.status-success {
  background-color: #d1fae5;
  color: #065f46;
}

.status-warning {
  background-color: #fef3c7;
  color: #92400e;
}

.status-danger {
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

.btn-outline {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.btn-outline:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: var(--text-light);
  background: var(--card-bg);
  border-radius: var(--radius);
  border: 1px dashed var(--border-color);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* 倒计时样式 */
.countdown {
  font-weight: bold;
  color: #f59e0b; /* 琥珀色，引起注意 */
}

.countdown.urgent {
  color: #ef4444;
  animation: blink 1s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
