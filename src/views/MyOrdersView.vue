<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getMyOrders, payOrder } from '@/api/seats'

const orders = ref<any[]>([])

onMounted(async () => {
  const res = await getMyOrders()
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
</script>

<template>
  <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
    <h2>我的订单</h2>
    <div v-for="order in orders" :key="order.id" style="border: 1px solid #eee; padding: 15px; margin: 10px 0;">
      <div><strong>{{ order.movieTitle }}</strong></div>
      <div>{{ order.hallName }} · {{ new Date(order.startTime).toLocaleString() }}</div>
      <div>座位: {{ order.seatNumbers.join(', ') }}</div>
      <div>
        状态:
        <span v-if="order.status === 'PAID'" style="color: green;">已支付</span>
        <span v-else-if="order.status === 'PENDING'" style="color: orange;">待支付</span>
        <span v-else style="color: red;">已取消</span>
      </div>
      <button
        v-if="order.status === 'PENDING'"
        @click="() => handlePay(order.id)"
        style="margin-top: 10px; padding: 5px 10px; background: #4CAF50; color: white; border: none; cursor: pointer;"
      >
        立即支付
      </button>
    </div>
  </div>
</template>
