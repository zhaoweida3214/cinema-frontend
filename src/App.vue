<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import useUserStore from './stores/user'

const userStore = useUserStore()

const handleLogout = () => {
  userStore.logout()
}
</script>

<template>
  <header v-if="$route.path !== '/login'" style="background: #333; color: white; padding: 10px;">
    <div style="display: flex; justify-content: space-between; max-width: 1200px; margin: 0 auto;">
      <div>🎬 影院选座系统</div>
      <div>
        欢迎, {{ userStore.name || userStore.username }}
        <button @click="handleLogout" style="margin-left: 10px; color: white; background: none; border: 1px solid white;">
          退出
        </button>
      </div>
    </div>
  </header>
  <RouterView />
</template>
