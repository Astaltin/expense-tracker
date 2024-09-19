import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'

export default defineConfig({
  envDir: '../.env',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './src')
    }
  },
  server: {
    host: true,
    port: process.env.CLIENT_PORT,
    watch: { usePolling: true }
  },
})
