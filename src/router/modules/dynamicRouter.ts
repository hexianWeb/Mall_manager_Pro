import router from '@/router/index';
import { Menu } from '@/stores/modules/login/type';
import { RouteRecordRaw } from 'vue-router';
const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    meta: {
      title: '主控台'
    },
    component: () => import('@views/index/index.vue')
  },
  {
    path: '/goods/list',
    name: 'goodsList',
    meta: {
      title: '商品页'
    },
    component: () => import('@/views/goods/list.vue')
  },
  {
    path: '/image/list',
    name: 'imageList',
    meta: {
      title: '图库管理'
    },
    component: () => import('@/views/image/list.vue')
  },
  {
    path: '/notice/list',
    name: 'noticeIndex',
    meta: {
      title: '公告管理'
    },
    component: () => import('@/views/notice/index.vue')
  },
  {
    path: '/manager/list',
    name: 'managerList',
    meta: {
      title: '管理员列表'
    },
    component: () => import('@/views/manager/index.vue')
  }
];
// 动态添加路由的方法
export function dynamicAddRouter(Menus: Menu[]) {
  // 是否有新的路由
  const findAndAddMenus = (Menus: Menu[]) => {
    Menus.forEach((menu: Menu) => {
      let item = asyncRoutes.find((subMenu) => subMenu.path == menu.frontpath);
      if (item && !router.hasRoute(item.path)) {
        router.addRoute('admin', item);
      }
      if (menu.child && menu.child.length > 0) {
        findAndAddMenus(menu.child);
      }
    });
  };

  findAndAddMenus(Menus);
}
// /**
//  * @description 初始化动态路由
//  */
// export const initDynamicRouter = async () => {
//   // // 0. 获取 pinia 实例
//   // const userStore = useUserStore();
//   try {
//     //   // 1.获取菜单列表 && 按钮权限列表
//     //   const Menus = await userStore.getMenus;
//     //   console.log(Menus);
//     //   // 2.判断当前用户有没有菜单权限
//     //   if (!Menus?.length) {
//     //     ElNotification({
//     //       title: '无权限访问',
//     //       message: '当前账号无任何菜单权限，请联系系统管理员！',
//     //       type: 'warning',
//     //       duration: 3000
//     //     });
//     //     userStore.setUserInfo(null);
//     //     router.replace('/');
//     //     return Promise.reject('No permission');
//     //   }
//     // 3.添加动态路由
//     // dynamicAddRouter(asyncRoutes);
//   } catch (error) {
//     // 当按钮 || 菜单请求出错时，重定向到登陆页
//     // userStore.setToken('');
//     router.replace('/');
//     return Promise.reject(error);
//   }
// };
