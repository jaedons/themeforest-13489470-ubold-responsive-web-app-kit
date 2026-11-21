import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@jaedons/admin-ui/style.css'
import './styles/main.scss'
import App from './App.vue'
import { router } from './app/router'
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
