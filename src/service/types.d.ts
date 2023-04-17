// types.ts
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
export interface RequestInterceptors {
  // 请求拦截
  requestInterceptors?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
  requestInterceptorsCatch?: (err: any) => any;
  // 响应拦截
  // 在类拦截器中已经将返回的类型改变，所以说我们需要为拦截器传递一个泛型
  responseInterceptors?: <T = AxiosResponse>(config: T) => T;
  responseInterceptorsCatch?: (err: any) => any;
}
// 自定义传入的参数 让实例拦截器可以客制化拦截动作
export interface RequestConfig extends InternalAxiosRequestConfig {
  interceptors?: RequestInterceptors;
}
