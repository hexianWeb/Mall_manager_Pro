import { BreadcrumbProp } from '@/base-ui/breadcrumb';
import { Menu } from '@/stores/modules/login/type';

/**
 * 根据路径获取目录
 * @param userMenus
 * @param pathName
 * @returns
 */
export const getMenuByPath = (userMenus: Menu[], pathName: string): Menu | void => {
  const currentMenu = __recursiveMenuByPath(userMenus, pathName);
  return currentMenu;
};

/**
 * 获取该用户的第一个目录
 * @param userMenus
 * @returns
 */
export const getFirstMenuPath = (userMenus: Menu[]): Menu | void => {
  const firstMenu = __recursiveFirstMenu(userMenus);
  return firstMenu;
};

/**
 * 获取用户当前模块的面包屑
 * @param userMenus
 * @param pathName
 * @param breadCrumbs
 * @returns
 */
export const getBreadCrumbsByPath = (userMenus: Menu[], pathName: string): BreadcrumbProp[] => {
  const breadcrumbs: BreadcrumbProp[] = [];
  __recursiveMenuByPath(userMenus, pathName, breadcrumbs);
  return breadcrumbs.reverse();
};

const __recursiveFirstMenu = (menus: Menu[]): Menu | void => {
  for (let i = 0; i < menus.length; i++) {
    const currentMenu = menus[i];
    if (currentMenu.child!.length > 0) {
      const subMenu = currentMenu.child || [];
      const m = __recursiveFirstMenu(subMenu);
      if (m) return m;
    } else if (currentMenu.child!.length === 0) {
      return currentMenu;
    }
  }
};
/**
 * 根据路径获取目录
 * @param menus
 * @param pathName
 * @returns
 */
const __recursiveMenuByPath = (menus: Menu[], pathName: string, breadCrumbs?: BreadcrumbProp[]): Menu | void => {
  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i];
    // 递归查找目录
    if (menu.child!.length > 0) {
      const submenu = menu?.child || [];
      const m = __recursiveMenuByPath(submenu, pathName, breadCrumbs);
      if (m) {
        if (breadCrumbs) {
          breadCrumbs?.push({
            name: menu.name,
            path: '' //一级路由 不可点击 不应该增加path
          });
        }
        return m;
      }
    } else if (menu.child!.length === 0 && menu.frontpath === pathName) {
      if (breadCrumbs) {
        breadCrumbs.push({
          name: menu.name,
          path: menu.frontpath
        });
      }
      return menu;
    }
  }
};
