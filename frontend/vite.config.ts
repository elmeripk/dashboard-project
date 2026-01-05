import { defineConfig } from 'vite'

export default defineConfig({

  base: '/dashboard/',

  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },


})
