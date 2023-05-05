// index.ts
import Request from './request';
import { BASE_URL, TIME_OUT } from './request/config';

const instance = new Request({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    // 请求拦截器
    requestInterceptors: (config) => {
      console.log('实例请求拦截器');
      return config;
    },
    // 响应拦截器
    responseInterceptors: (result) => {
      console.log('实例响应拦截器');
      return result;
    }
  }
});

export default instance;
