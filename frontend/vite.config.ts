import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // Docker环境需要监听所有接口
    port: 3000, // 设置为您想要的端口
    strictPort: true, // 如果端口被占用则退出
    hmr: {
      port: 24678, // HMR热重载端口，与docker-compose匹配
      host: 'localhost' // HMR主机配置
    },
    watch: {
      usePolling: true, // Docker环境文件监听需要轮询
      interval: 1000 // 轮询间隔
    }
  }
})
