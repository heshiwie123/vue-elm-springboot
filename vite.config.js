import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      //所有以/api开头的请求都会被代理
      '/api': {
        //代理的目标服务，即后端的服务地址
        target: 'http://localhost:8087',
        // 服务器将以代理服务器的地址作为来源地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/elm-mybatisplus'),
      },
    },
  }
})
