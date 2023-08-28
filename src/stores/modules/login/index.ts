import { USER_PERMISSION_KEY, USER_INFO_KEY, USER_MENUS_KEY } from '@/constants/cache_keys';
import { useCookies } from '@vueuse/integrations/useCookies';
import localCache from '@/utils/cache';
import { adminAuth, adminLogin } from '@/api/admin';
import { Account, Menu, UserInfo, UserState } from './type';

const docCookie = useCookies(['auth']);
export function setupUser() {
  const userStore = useUserStore();
  // 设置token
  const token = docCookie.get(USER_PERMISSION_KEY);
  token && userStore.setToken(token);
}
export const useUserStore = defineStore({
  id: 'user',
  state: (): Partial<UserState> => ({
    token: undefined,
    userInfo: undefined,
    userMenus: undefined
  }),
  getters: {
    getToken(): Partial<string> {
      return this.token || docCookie.get(USER_PERMISSION_KEY);
    },
    getUserInfo(): UserInfo | null {
      const userInfo = this.userInfo || localCache.getCache(USER_INFO_KEY) || '';
      if (userInfo && typeof userInfo === 'object') {
        return userInfo as UserInfo;
      }
      return null;
    },
    getMenus(): Menu[] | null {
      const userMenus = this.userMenus || localCache.getCache(USER_MENUS_KEY) || '';
      if (userMenus && typeof userMenus === 'object') {
        return userMenus as Menu[];
      }
      return null;
    }
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      docCookie.set(USER_PERMISSION_KEY, token);
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
      localCache.setCache(USER_INFO_KEY, userInfo);
    },
    setUserMenus(userMenus: Menu[]) {
      this.userMenus = userMenus;
      localCache.setCache(USER_MENUS_KEY, userMenus);
    },
    $reset() {
      docCookie.remove(USER_PERMISSION_KEY);
      localCache.clearCache();
      this.userInfo = undefined;
      this.token = undefined;
    },
    async login(account: Account) {
      try {
        const { token } = await adminLogin(account);
        this.setToken(token);
        const userInfo = await adminAuth();
        this.setUserInfo(userInfo);
        this.setUserMenus(userInfo.menus);
      } catch (err) {
        ElMessage({
          type: 'error',
          message: `错误信息 ${err || '请求失败'}`
        });
      }
    }
  }
});
