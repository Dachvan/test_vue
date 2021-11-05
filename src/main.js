import { createApp } from 'vue'
import App from './App'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/scss/style.scss'
import router from '@/router'

createApp(App).use(router).mount('#app')
