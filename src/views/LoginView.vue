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
      userStore.setUserInfo(userInfo)
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
  <div class="login-container">
    <div class="card login-card">
      <div class="text-center mb-4">
        <h1 style="font-size: 3rem; margin-bottom: 0.5rem;">🎬</h1>
        <h2>影院选座系统</h2>
        <p class="text-muted">请登录以继续</p>
      </div>
      
      <div class="form-group">
        <label class="form-label">用户名</label>
        <input 
          v-model="username" 
          class="form-control" 
          placeholder="请输入用户名"
          @keyup.enter="handleLogin"
        />
      </div>
      
      <div class="form-group">
        <label class="form-label">密码</label>
        <input 
          v-model="password" 
          type="password" 
          class="form-control" 
          placeholder="请输入密码"
          @keyup.enter="handleLogin"
        />
      </div>

      <button @click="handleLogin" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
        登录
      </button>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color);
  background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
  background-size: 20px 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
}
</style>
