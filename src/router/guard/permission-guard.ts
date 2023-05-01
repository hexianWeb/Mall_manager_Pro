import { useCookies } from '@vueuse/integrations/useCookies';
import { USER_PERMISSION_KEY } from '@/constants/cache_keys';
import type { Router } from 'vue-router';
export const createPermissionGuard = (router: Router): void => {
  router.beforeEach((to, from, next) => {
    const token = useCookies(['auth']).get(USER_PERMISSION_KEY);
    if (!token && to.path != '/login') {
      ElMessage.error('请先登录');
      next('/login');
      return;
    }
    if (token && to.path == '/login') {
      ElMessage.error('请勿试图重复登录');
      return next({ path: from.path ? from.path : '/' });
    }
    next();
  });
};
