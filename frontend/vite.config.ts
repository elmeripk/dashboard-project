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
      '/api/v1': 'http://localhost:3000',
    },
  },


})
