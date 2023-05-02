// types.ts
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosRequestConfig } from 'axios';

// InternalAxiosRequestConfig 则是 Axios 库内部使用的配置对象类型。 这些属性或选项通常不需要由外部使用者设置或访问。
export interface HXInterceptors<T = AxiosResponse> {
  // 请求拦截
  requestInterceptors?: (config: any) => InternalAxiosRequestConfig;
  // 请求错误拦截
  requestInterceptorsCatch?: (err: any) => any;
  // 响应拦截
  // 在类拦截器中已经将返回的类型改变，所以说我们需要为拦截器传递一个泛型
  responseInterceptors?: (res: T) => T;
  // 响应错误拦截
  responseInterceptorsCatch?: (err: any) => any;
}
export interface HXRequestInterceptors<T = AxiosResponse> {
  // 请求拦截
  requestInterceptors?: (config: any) => AxiosRequestConfig;
  // 请求错误拦截
  requestInterceptorsCatch?: (err: any) => any;
  // 响应拦截
  // 在类拦截器中已经将返回的类型改变，所以说我们需要为拦截器传递一个泛型
  responseInterceptors?: (res: T) => T;
  // 响应错误拦截
  responseInterceptorsCatch?: (err: any) => any;
}
// 要设置内部
export interface HXAxiosRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: HXInterceptors<T>;
}
// 设置通用
export interface HXRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: HXRequestInterceptors<T>;
}
