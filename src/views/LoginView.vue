<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth'
import useUserStore from '@/stores/user'
import { toast } from '@/utils/toast'

const username = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()
const userStore = useUserStore()

const handleLogin = async () => {
  if (!username.value.trim()) {
    toast.warning('请输入用户名')
    return
  }
  if (!password.value.trim()) {
    toast.warning('请输入密码')
    return
  }

  loading.value = true
  try {
    const res = await login({ username: username.value, password: password.value })
    if (res.data.code === 1) {
      const userInfo = res.data.data
      userStore.setUserInfo(userInfo)
      toast.success('登录成功！')
      setTimeout(() => {
        router.push('/cinemas')
      }, 500)
    } else {
      toast.error(res.data.msg || '登录失败')
    }
  } catch (err) {
    toast.error('网络错误，请检查后端是否启动')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="card login-card">
      <div class="text-center mb-4 fade-in">
        <div class="logo-bounce">
          <h1 style="font-size: 3rem; margin-bottom: 0.5rem;">🎬</h1>
        </div>
        <h2>影院选座系统</h2>
        <p class="text-muted">请登录以继续</p>
      </div>
      
      <div class="form-group fade-in" style="animation-delay: 0.1s">
        <label class="form-label">用户名</label>
        <div class="input-wrapper">
          <span class="input-icon">👤</span>
          <input 
            v-model="username" 
            class="form-control with-icon" 
            placeholder="请输入用户名"
            @keyup.enter="handleLogin"
            :disabled="loading"
          />
        </div>
      </div>
      
      <div class="form-group fade-in" style="animation-delay: 0.2s">
        <label class="form-label">密码</label>
        <div class="input-wrapper">
          <span class="input-icon">🔒</span>
          <input 
            v-model="password" 
            type="password" 
            class="form-control with-icon" 
            placeholder="请输入密码"
            @keyup.enter="handleLogin"
            :disabled="loading"
          />
        </div>
      </div>

      <button 
        @click="handleLogin" 
        class="btn btn-primary login-btn fade-in" 
        style="animation-delay: 0.3s"
        :disabled="loading"
      >
        <span v-if="loading" class="spinner"></span>
        <span v-else>登录</span>
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
  animation: slideUp 0.5s ease-out;
}

/* Logo弹跳动画 */
.logo-bounce {
  display: inline-block;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* 淡入动画 */
.fade-in {
  animation: fadeIn 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 输入框样式 */
.input-wrapper {
  position: relative;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  pointer-events: none;
  z-index: 1;
}

.form-control.with-icon {
  padding-left: 3rem;
  width: 100%;
  box-sizing: border-box;
}

.form-control:focus {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2) !important;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.login-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
}

.login-btn:not(:disabled):active {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 加载动画 */
.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
