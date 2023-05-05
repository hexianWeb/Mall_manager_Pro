import App from './App.vue';
import router from './router';
// 初始化css样式
import 'normalize.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import store, { setupStore } from './stores';
import { setupRouterGuard } from './router/guard';
const app = createApp(App);
// 注册图标组件（不推荐 推荐自动引入） https://blog.csdn.net/zhoudingding/article/details/127237942

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(store);
// setup store
setupStore();
setupRouterGuard();
app.use(router);
app.mount('#app');
