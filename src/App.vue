<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from "vue-router";
import useUserStore from "./stores/user";
import "./assets/theme.css";

const userStore = useUserStore();
const router = useRouter();

const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};
</script>

<template>
  <header v-if="$route.path !== '/login'" class="app-header">
    <div class="container header-content">
      <RouterLink
        to="/cinemas"
        class="brand"
        style="color: white; text-decoration: none"
      >
        <span style="font-size: 1.5rem">🎬</span>
        <span>影院选座系统</span>
      </RouterLink>

      <nav class="main-nav">
        <RouterLink to="/cinemas" class="nav-link" active-class="active"
          >首页</RouterLink
        >
        <RouterLink to="/orders" class="nav-link" active-class="active"
          >我的订单</RouterLink
        >
      </nav>

      <div class="flex items-center gap-4">
        <span
          >欢迎,
          <strong>{{ userStore.name || userStore.username }}</strong></span
        >
        <button @click="handleLogout" class="btn btn-outline text-sm">
          退出
        </button>
      </div>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
.main-nav {
  display: flex;
  gap: 1.5rem;
  margin-right: auto;
  margin-left: 2rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover,
.nav-link.active {
  color: white;
}
</style>
