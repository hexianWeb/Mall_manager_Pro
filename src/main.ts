import App from './App.vue';
// 初始化css样式
import 'normalize.css';
// 引入加载进度条
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import router from '@/router';
import pinia, { setupStore } from './stores';
import { setupRouterGuard } from './router/guard';
// errorHandler 全局错误捕捉
import errorHandler from '@/utils/errorHandler';

const app = createApp(App);

app.config.errorHandler = errorHandler;

// 注册图标组件（不推荐 推荐自动引入） https://blog.csdn.net/zhoudingding/article/details/127237942
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(pinia);
// setup store
setupStore();

setupRouterGuard();
app.use(router);
app.mount('#app');
