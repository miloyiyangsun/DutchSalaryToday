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
  },
  build: {
    // 性能优化设置 (Performance Optimization Settings)
    target: 'es2018', // 支持更多浏览器的同时保持现代语法
    minify: 'esbuild', // 使用Vite内置的esbuild压缩（更快）
    cssMinify: true, // CSS压缩
    
    // 代码拆分优化 (Code Splitting Optimization)
    rollupOptions: {
      output: {
        // 手动代码块分割策略 (Manual Chunk Splitting Strategy)
        manualChunks: {
          // React生态系统单独打包 (React Ecosystem Bundle)
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // 图表库单独打包 (Charts Library Bundle)
          'charts-vendor': ['recharts'],
          
          // Story页面代码拆分 (Story Pages Code Splitting)
          'stories-pages': [
            './src/pages/stories/IceAndFirePage',
            './src/pages/stories/WorkHoursPage', 
            './src/pages/stories/WorkIntensificationPage',
            './src/pages/stories/GenderPowerPage',
            './src/pages/stories/HiddenCostPage'
          ],
          
          // Hooks和Services单独打包 (Hooks and Services Bundle)
          'utils': [
            './src/hooks/index',
            './src/services/api',
            './src/types/salary'
          ]
        },
        
        // 文件命名优化 (File Naming Optimization)
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    // 构建大小警告阈值调整 (Build Size Warning Threshold)
    chunkSizeWarningLimit: 600, // 将警告阈值提高到600kb
    
    // 启用源码映射用于生产调试 (Enable Source Maps for Production Debug)
    sourcemap: false, // 生产环境关闭源码映射减少包体积
    
    // 预加载优化 (Preload Optimization)
    manifest: true, // 生成manifest用于预加载优化
  },
  
  // CSS优化配置 (CSS Optimization Config)
  css: {
    devSourcemap: true, // 开发环境CSS源码映射
    modules: {
      // CSS模块优化配置
      localsConvention: 'camelCase', // 支持camelCase访问
      generateScopedName: '[name]_[local]_[hash:base64:5]' // 优化CSS模块类名生成
    }
  }
})
