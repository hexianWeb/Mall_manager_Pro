import { USER_PERMISSION_KEY, USER_INFO_KEY } from '@/constants/cache_keys';
import { useCookies } from '@vueuse/integrations/useCookies';
import localCache from '@/utils/cache';
import { adminAuth, adminLogin } from '@/service/admin';
import { Account, UserInfo, UserState } from './type';

const docCookie = useCookies(['auth']);
export function setupUser() {
  const userStore = useUserStore();
  // 设置token
  const token = docCookie.get(USER_PERMISSION_KEY);
  token && userStore.setToken(token);
}
export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: undefined,
    userInfo: undefined
  }),
  getters: {
    getToken(): string | null {
      return this.token || docCookie.get(USER_PERMISSION_KEY);
    },
    getUserInfo(): UserInfo | null {
      const userInfo = this.userInfo || localCache.getCache(USER_INFO_KEY) || '';
      if (userInfo && typeof userInfo === 'object') {
        return userInfo as UserInfo;
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
    $reset() {
      docCookie.remove(USER_PERMISSION_KEY);
      localCache.clearCache();
      this.userInfo = null;
      this.token = null;
    },
    async login(account: Account) {
      try {
        const { token } = await adminLogin(account);
        this.setToken(token);
        const userInfo = await adminAuth();
        this.setUserInfo(userInfo);
      } catch (err) {
        ElMessage({
          type: 'error',
          message: `错误信息 ${err || '请求失败'}`
        });
      }
      // // 3.获取并设置 请求用户菜单
      // const UserMenusRes = await getUserMenusById({ id });
      // this.setUserMenu(UserMenusRes);

      // // 4.跳转到用户第一个菜单 配合 router/guard 的 permission
      // const firstMenu = getFirstMenuPath(UserMenusRes);
      // router.push(firstMenu!.url);
    }
  }
});
