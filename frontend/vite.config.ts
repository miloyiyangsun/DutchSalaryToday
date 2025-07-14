import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // 设置为您想要的端口
    strictPort: true, // 如果端口被占用则退出
  }
})
