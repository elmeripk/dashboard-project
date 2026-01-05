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
      // Forward /dashboard/api/v1/* to Express
      '/dashboard/api/v1': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          // Remove '/dashboard/api/v1' prefix
          return path.replace(/^\/dashboard\/api\/v1/, '')
        },
      },
    },
  },


})
