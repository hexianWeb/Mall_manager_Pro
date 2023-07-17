import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      keepAlive: true,
      requireAuth: false
    },
    component: () => import('@/views/login/login.vue')
  },
  {
    path: '/',
    name: 'admin',
    meta: {
      title: '首页'
    },
    component: () => import('@views/main/main.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@views/not-found/not-found.vue')
  }
];

export default routes;
