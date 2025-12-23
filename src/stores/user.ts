import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    id: 0,
    username: '',
    name: '',
    token: localStorage.getItem('token') || '',
  }),
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    logout() {
      this.$reset()
      localStorage.removeItem('token')
    },
  },
})

// ✅ 必须导出默认，否则 import 会报错
export default useUserStore
