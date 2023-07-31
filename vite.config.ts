import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'path';
import vueJsx from '@vitejs/plugin-vue-jsx';
export default defineConfig({
  css: {
    // css预处理器
    preprocessorOptions: {
      less: {
        charset: false
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://ceshi13.dishait.cn/admin', // 要代理的目标地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 可选的路径重写规则
      }
    }
  },
  plugins: [
    // 自动按需引入 vue\vue-router\pinia 等的 api
    AutoImport({
      // 自动按需引入 vue 需要额外的import vue的api。比如使用ref时，需要先import { ref } from 'vue'。
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()],
      eslintrc: {
        enabled: true // Default `false`
      }
    }),
    // 自动按需引入 第三方的组件库组件 和 我们自定义的组件
    Components({
      // dirs 指定组件所在位置，默认为 src/components
      // 可以让我们使用自己定义组件的时候免去 import 的麻烦
      dirs: ['src/components/'],
      // 配置需要将哪些后缀类型的文件进行自动按需引入
      extensions: ['vue', 'md'],
      // 解析的 UI 组件库，这里以 Element Plus 和 Ant Design Vue 为例
      resolvers: [ElementPlusResolver()]
    }),
    vue(),
    // vue 可以使用 jsx/tsx 语法
    vueJsx(),
    // name 可以写在 script 标签上
    VueSetupExtend({})
  ],
  resolve: {
    alias: {
      '@': resolve('src'), // 源码根目录
      '@img': resolve('src/assets/img'), // 图片
      '@less': resolve('src/assets/less'), // 预处理器
      '@libs': resolve('src/libs'), // 本地库
      '@plugins': resolve('src/plugins'), // 本地插件
      '@cp': resolve('src/components'), // 公共组件
      '@views': resolve('src/views'), // 路由组件
      '@store': resolve('src/stores') // pinia组件
    }
  }
});
