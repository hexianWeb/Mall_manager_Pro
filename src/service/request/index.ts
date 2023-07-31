// index.ts
import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { HXAxiosRequestConfig, HXInterceptors, HXRequestConfig } from '../types';
import { useCookies } from '@vueuse/integrations/useCookies';
import { USER_PERMISSION_KEY } from '@/constants/cache_keys';
import { useUserStore } from '@/stores/modules/login';
// 类拦截器
class Request {
  // axios 实例
  instance: AxiosInstance;
  // 拦截器对象
  interceptorsObj?: HXInterceptors;

  // 注意 顺序很重要 虽然脑子正常人都想得到
  constructor(config: HXAxiosRequestConfig) {
    this.instance = axios.create(config);
    // 添加请求拦截器 **所有实例**
    this.instance.interceptors.request.use(
      function (config: InternalAxiosRequestConfig) {
        // 在发送请求之前 设置请求头 携带token
        const userStore = useUserStore();
        const token = userStore.getToken;
        if (token) {
          config.headers['token'] = token;
        }
        return config;
      },
      function (error) {
        // 对请求错误做些什么
        return Promise.reject(error.response.data);
      }
    );

    // 添加客制化拦截器 **一类示例**
    this.instance.interceptors.request.use(
      this.interceptorsObj?.requestInterceptors,
      this.interceptorsObj?.requestInterceptorsCatch
    );
    this.instance.interceptors.response.use(
      this.interceptorsObj?.responseInterceptors,
      this.interceptorsObj?.responseInterceptorsCatch
    );

    // 添加相应拦截器 **所有实例**
    this.instance.interceptors.response.use(
      // 因为我们接口的数据都在res.data下，所以我们直接返回res.data
      (res: AxiosResponse) => {
        if (res.data.msg === 'ok') {
          return res.data.data;
        }
        // then 和 catch前对数据的处理
      },
      (err: any) => Promise.reject(err)
    );
  }

  // **单个实例**
  request<T>(config: HXRequestConfig<T>): Promise<T> {
    // 如果我们为单个请求设置拦截器，这里使用单个请求的拦截器
    if (config.interceptors?.requestInterceptors) {
      config = config.interceptors.requestInterceptors(config);
    }
    return new Promise<T>((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 如果我们为单个响应设置拦截器，这里使用单个响应的拦截器
          if (config.interceptors?.responseInterceptors) {
            res = config.interceptors.responseInterceptors(res);
          }
          resolve(res);
        })
        .catch((err: any) => {
          console.log(err.response.data);
          reject(err.response.data);
        });
    });
  }
  get<T>(config: HXRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' });
  }

  post<T>(config: HXRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' });
  }

  delete<T>(config: HXRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' });
  }
  patch<T>(config: HXRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' });
  }
}

export default Request;
