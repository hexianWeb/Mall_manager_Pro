import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// 初始化css样式
import 'normalize.css';
createApp(App).use(router).mount('#app');
