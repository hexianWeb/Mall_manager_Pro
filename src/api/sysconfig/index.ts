import request from '@/service';
import { Data } from './type';

enum configAPI {
  sysconfigUrl = '/sysconfig'
}

/**
 * 获取原有系统设置
 * @returns
 */
export function getSysconfig() {
  return request.get<Data>({
    url: configAPI.sysconfigUrl
  });
}

/**
 * 修改系统设置
 * @param data
 * @returns
 */
export function setSysconfig(data: any) {
  return request.post({
    url: configAPI.sysconfigUrl,
    data
  });
}

/**
 * 上传文件 URL
 */
export const uploadAction = configAPI.sysconfigUrl + '/upload';
