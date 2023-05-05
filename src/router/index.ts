import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: { name: 'MAIN' } },
  {
    path: '/login',
    name: 'LOGIN',
    meta: {
      title: '登录',
      keepAlive: true,
      requireAuth: false
    },
    component: () => import('@/views/login/login.vue')
  },
  {
    path: '/main',
    name: 'MAIN',
    meta: {
      title: '首页',
      keepAlive: true,
      requireAuth: true
    },
    component: () => import('@views/main/main.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@views/not-found/not-found.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});
export default router;
