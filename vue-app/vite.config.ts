import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
import { existsSync, readdirSync } from 'node:fs'
// Prebuild style entry points injected by the plugin, including lazy routes.
// This avoids replacing the dependency cache during a page navigation.
const componentRoot = new URL('./node_modules/element-plus/es/components/', import.meta.url)
const componentStyles = readdirSync(componentRoot)
  .filter((name) => existsSync(new URL(`${name}/style/css.mjs`, componentRoot)))
  .map((name) => `element-plus/es/components/${name}/style/css`)
export default defineConfig({
  plugins: [vue(), ElementPlus({ useSource: false })],
  optimizeDeps: { include: componentStyles },
  server: { port: 5173, strictPort: true },
  preview: { port: 4174, strictPort: true },
  build: { chunkSizeWarningLimit: 900 },
})
