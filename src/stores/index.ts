import { setupUser } from './modules/login';
// 对于 pinia-plugin-persistedstate 插件，它提供了在 Vue.js 中使用 Pinia 状态管理库时，将状态持久化到本地存储（如 localStorage）的功能。
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
const pinia = createPinia();
export function setupStore() {
  setupUser();
}
pinia.use(piniaPluginPersistedstate);
export default pinia;
