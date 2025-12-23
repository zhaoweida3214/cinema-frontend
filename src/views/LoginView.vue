<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth'
import useUserStore from '@/stores/user'

const username = ref('')
const password = ref('')
const router = useRouter()
const userStore = useUserStore()

const handleLogin = async () => {
  try {
    const res = await login({ username: username.value, password: password.value })
    if (res.data.code === 1) {
      const userInfo = res.data.data
      userStore.setToken(userInfo.token)
      router.push('/cinemas')
    } else {
      alert(res.data.msg || '登录失败')
    }
  } catch (err) {
    alert('网络错误，请检查后端是否启动')
  }
}
</script>

<template>
  <div style="max-width: 400px; margin: 100px auto; padding: 20px;">
    <h2 style="text-align: center;">影院选座系统 - 登录</h2>
    <div style="margin: 20px 0;">
      <input v-model="username" placeholder="用户名 (如: user1)" style="width: 100%; padding: 8px; margin: 5px 0;" />
      <input v-model="password" type="password" placeholder="密码 (如: 123456)" style="width: 100%; padding: 8px; margin: 5px 0;" />
    </div>
    <button @click="handleLogin" style="width: 100%; padding: 10px; background: #4CAF50; color: white; border: none; cursor: pointer;">
      登录
    </button>
  </div>
</template>
