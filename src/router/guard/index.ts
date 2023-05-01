import router from '@/router';
import { createPermissionGuard } from './permission-guard';

export const setupRouterGuard = () => {
  // 鉴权前置路由
  createPermissionGuard(router);
};
