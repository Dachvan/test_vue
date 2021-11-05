import Main from '@/pages/Main';
import Contacts from '@/pages/Contacts';
import PersonalPage from '@/pages/PersonalPage';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Main,
  },
  {
    path: '/personal-page',
    component: PersonalPage,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router;