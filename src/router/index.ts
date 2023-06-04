import { createRouter, createWebHashHistory } from 'vue-router';

// 静态路由加载
import staticRoutes from './modules/staticRouter';

const router = createRouter({
  history: createWebHashHistory(),
  routes: staticRoutes
});
export default router;
