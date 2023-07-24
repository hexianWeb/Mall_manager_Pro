import App from './App.vue';
// 初始化 css 样式
import 'normalize.css';
// 引入 tailwindcss
import './assets/tailMain.css';
// 引入全局 css 样式
import '@/assets/css/index.less';
// 引入加载进度条
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
// ICON 图标引入
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// 路由信息引入
import router from '@/router';
// 持久化状态管理工具
import pinia, { setupStore } from './stores';
// 全局路由守卫引入
import { setupRouterGuard } from './router/guard';
// errorHandler 全局错误捕捉
import errorHandler from '@/utils/errorHandler';
// 全局自定义指令引入
import directive from './directives/index';
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
app.use(directive);
app.mount('#app');
