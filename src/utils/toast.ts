import { createApp, h } from 'vue'
import Toast from '@/components/Toast.vue'

export interface ToastOptions {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

let toastInstance: any = null

export const showToast = (options: ToastOptions | string) => {
  // 如果传入字符串，转换为对象
  const config = typeof options === 'string' ? { message: options } : options

  // 移除旧的toast
  if (toastInstance) {
    toastInstance.unmount()
    toastInstance = null
  }

  // 创建容器
  const container = document.createElement('div')
  document.body.appendChild(container)

  // 创建toast实例
  toastInstance = createApp({
    render() {
      return h(Toast, {
        ...config,
        onClose: () => {
          toastInstance.unmount()
          document.body.removeChild(container)
          toastInstance = null
        }
      })
    }
  })

  toastInstance.mount(container)
}

// 便捷方法
export const toast = {
  success: (message: string, duration?: number) => 
    showToast({ message, type: 'success', duration }),
  
  error: (message: string, duration?: number) => 
    showToast({ message, type: 'error', duration }),
  
  warning: (message: string, duration?: number) => 
    showToast({ message, type: 'warning', duration }),
  
  info: (message: string, duration?: number) => 
    showToast({ message, type: 'info', duration })
}
