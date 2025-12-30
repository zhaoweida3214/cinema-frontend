import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [vue()],

    // 👇 解析路径别名 @ → src/
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },

    // 👇 开发服务器配置（仅 npm run dev 时生效）
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            }
        }
    }
})