import { useCookies } from '@vueuse/integrations/useCookies';
import { USER_PERMISSION_KEY } from '@/constants/cache_keys';
import type { Router } from 'vue-router';
import { dynamicAddRouter } from '../modules/dynamicRouter';
import { useUserStore } from '@/stores/modules/login';
import NProgress from '@/utils/loading';

export const createPermissionGuard = (router: Router): void => {
  let hasRouteInfo = false;
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    // 1.NProgress 开始
    NProgress.start();

    //todo: 2.设置动态标题
    let title = to.meta.title ? to.meta.title : '';
    document.title = title as string;
    const token = useCookies(['auth']).get(USER_PERMISSION_KEY);

    // 3.如果没有 token 还想去了 login 页之外的，就让它先登录
    if (!token && to.path != '/login') {
      ElMessage.error('请先登录');
      next('/login');
      return;
    }
    //todo: 4.判断访问页面是否在路由白名单地址(静态路由)中，如果存在直接放行

    if (token && to.path == '/login') {
      ElMessage.error('请勿试图重复登录');
      return next({ path: from.path ? from.path : '/' });
    }

    // 6.如果没有菜单列表，就重新请求菜单列表并添加动态路由
    if (token && !hasRouteInfo) {
      const menus = userStore.getMenus;
      // 动态添加路由
      dynamicAddRouter(menus!);
      hasRouteInfo = true;
      return next(to.fullPath);
    } else {
      next();
    }
    // todo:  7.存储 routerName 做按钮权限筛选
  });
  /**
   * @description 路由跳转错误
   * */
  router.onError((error) => {
    NProgress.done();
    console.warn('路由错误', error.message);
  });

  /**
   * @description 路由跳转结束
   * */
  router.afterEach(() => {
    NProgress.done();
  });
};

/**
 * @description 重置路由
 * */
export const resetRouter = () => {
  // .flatMenuListGet.forEach((route) => {
  //   const { name } = route;
  //   if (name && router.hasRoute(name)) router.removeRoute(name);
  // });
};
