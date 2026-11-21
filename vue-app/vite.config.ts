import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
export default defineConfig({
  plugins: [vue(), ElementPlus({ useSource: false })],
  server: { port: 5173, strictPort: true },
  preview: { port: 4174, strictPort: true },
  build: { chunkSizeWarningLimit: 900 },
})
