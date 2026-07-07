import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Backend cookielarini brauzer bloklamasligi uchun proxy qatlamini qo'shamiz
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend portingiz (agar boshqa port bo'lsa, o'zgartiring)
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})