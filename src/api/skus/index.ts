import request from '@/service';
import type { Skus, SkusList, Data } from './type';

enum skusAPI {
  skusUrl = 'skus'
}

/**
 * 商品规格列表
 * @param page 商品规格列表页数
 * @returns 商品规格列表
 */
export function getSkusList(page: number) {
  return request.get<Data>({
    url: `${skusAPI.skusUrl}/${page}`
  });
}

/**
 * 增加商品规格
 * @param data 请求 Body 参数
 * @returns 增加的商品规格细节
 */
export function createSkus(data: Skus) {
  return request.post<Skus>({ url: skusAPI.skusUrl, data });
}

/**
 * 修改商品规格
 * @param id 对应菜单 ID
 * @param data 请求 Body 参数
 * @returns 修改的商品规格细节
 */
export function updateSkus(id: number, data: Skus) {
  return request.post<boolean>({
    url: skusAPI.skusUrl + '/' + id,
    data
  });
}

/**
 * 修改商品规格状态
 * @param id 对应菜单 ID
 * @param status 是否开启：0否1是
 * @returns {boolean} 是否修改成功
 */
export function updateSkusStatus(id: number, status: 0 | 1) {
  return request.post<boolean>({
    url: `${skusAPI.skusUrl}/${id}/update_status`,
    data: {
      status
    }
  });
}

/**
 * 删除商品规格
 * @param id 菜单/权限ID
 * @returns {boolean} 是否删除成功
 */
export function deleteSkus(ids: string[]) {
  return request.post<boolean>({
    url: `${skusAPI.skusUrl}/delete_all`,
    data: {
      ids: ids
    }
  });
}
