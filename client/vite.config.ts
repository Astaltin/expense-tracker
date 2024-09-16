import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()]
    }
  },
  plugins: [vue()],
  server: {
    host: true,
    port: process.env.PORT,
    watch: { usePolling: true }
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  }
})
