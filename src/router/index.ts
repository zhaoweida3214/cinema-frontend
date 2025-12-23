import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: LoginView },
    { path: '/', redirect: '/cinemas' },
    {
      path: '/cinemas',
      component: () => import('../views/CinemaListView.vue')
    },
    {
      path: '/schedules/:id/seats',
      component: () => import('../views/SeatSelectionView.vue'),
      props: true
    },
    {
      path: '/orders',
      component: () => import('../views/MyOrdersView.vue')
    }
  ]
})

// 路由守卫：未登录跳转登录页
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (!token && to.path !== '/login') {
    return '/login'
  }
})

export default router
