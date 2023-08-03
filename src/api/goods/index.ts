import request from '@/service';
import { objectToUrlParams } from '@/utils/Serializable';
import {
  OrderSearchParams,
  Good,
  GoodsBanner,
  GoodsSkusCardValue,
  GoodsListResponse,
  NewGoodInfo,
  updateGoodInfo,
  ReadGood
} from './type';

enum GoodsAPI {
  goodUrl = '/goods',
  goodSkusUrl = '/goods_skus_card_value'
}

interface id {
  id: number;
}

/**
 * 获取商品列表
 * @param page 页码
 * @param queryData 请求Query参数
 * @returns 商品列表
 */
export function getGoodsList(page: number, queryData: OrderSearchParams) {
  const urlParams = objectToUrlParams(queryData);
  const SerializableUrl = urlParams ? `?${urlParams}` : '';
  return request.get<GoodsListResponse>({
    url: `${GoodsAPI.goodUrl}/${page}${SerializableUrl}`
  });
}

/**
 * 增加商品
 * @param data 请求Body参数
 * @returns 新增商品的信息
 */
export function createGoods(data: Good) {
  return request.post<NewGoodInfo>({
    url: GoodsAPI.goodUrl,
    data
  });
}

/**
 * 修改商品
 * @param id 商品 ID
 * @param data 请求 Body 参数
 * @returns 修改商品是否成功
 */
export function updateGoods(id: number, data: updateGoodInfo) {
  return request.post<boolean>({ url: `${GoodsAPI.goodUrl}/${id}`, data });
}

/**
 * 批量上架下架商品
 * @param ids 商品 ID 汇总
 * @param status 商品状态
 * @returns 是否成功
 */
export function updateGoodsStatus(ids: string[], status: 0 | 1) {
  return request.post<boolean>({
    url: `${GoodsAPI.goodUrl}/changestatus`,
    data: {
      ids,
      status
    }
  });
}

/**
 * 批量删除商品
 * @param ids 商品 ID 汇总
 * @returns 是否删除成功
 */
export function deleteGoods(ids: string[]) {
  return request.post<boolean>({
    url: `${GoodsAPI.goodUrl}/delete_all`,
    data: {
      ids
    }
  });
}

/**
 * 批量恢复商品
 * @param ids 商品 ID 汇总
 * @returns 是否恢复成功
 */
export function restoreGoods(ids: string[]) {
  return request.post<boolean>({
    url: `${GoodsAPI.goodUrl}/restore`,
    data: {
      ids
    }
  });
}

/**
 * 彻底删除商品
 * @param ids 商品 ID 汇总
 * @returns 是否恢复成功
 */
export function destroyGoods(ids: string[]) {
  return request.post<boolean>({
    url: `${GoodsAPI.goodUrl}/destroy`,
    data: {
      ids
    }
  });
}

/**
 * 查看商品资料
 * @param id 商品ID
 * @returns {ReadGood} 商品资料
 */
export function readGood(id: number) {
  return request.get<ReadGood>({ url: `${GoodsAPI.goodUrl}/read/${id}` });
}

/**
 * 设置商品轮播图
 * @param id 商品ID
 * @param data 图片链接组成的一维数组
 * @returns 商品轮播图资料
 */
export function setGoodsBanner(id: number, banners: string[]) {
  return request.post<GoodsBanner>({
    url: `${GoodsAPI.goodUrl}/banners/${id}`,
    data: {
      banners
    }
  });
}

/**
 * 更新商品规格
 * @param id 商品 ID
 * @param data 请求Body参数
 * @returns 成功响应
 */
export function updateGoodsSkus(id: number, data: Record<string, any>) {
  return request.post<boolean>({
    url: `${GoodsAPI.goodUrl}/updateskus/${id}`,
    data
  });
}

/**
 * 添加商品规格选项的值
 * @param data 请求Body参数
 * @returns
 */
export function createGoodsSkusCard(data: GoodsSkusCardValue) {
  return request.post<GoodsSkusCardValue & id>({
    url: GoodsAPI.goodSkusUrl,
    data
  });
}

/**
 * 修改商品规格选项的值
 * @param id 规格选项 ID
 * @param data 请求Body参数
 * @returns
 */
export function updateGoodsSkusCard(id: number, data: GoodsSkusCardValue) {
  return request.post<boolean>({
    url: `${GoodsAPI.goodSkusUrl}/${id}`,
    data
  });
}

/**
 * 删除商品规格选项
 * @param id 规格 ID
 * @returns
 */
export function deleteGoodsSkusCard(id: number) {
  return request.post<boolean>({
    url: `${GoodsAPI.goodSkusUrl}/${id}/delete`
  });
}

/**
 * 排序商品规格选项
 * @param data 排序后的数据
 * @returns
 */
export function sortGoodsSkusCard(data: Record<string, any>) {
  return request.post({
    url: `${GoodsAPI.goodSkusUrl}/sort`,
    data
  });
}

/**
 * 添加商品规格选项的值
 * @param data
 * @returns
 */
export function createGoodsSkusCardValue(data: GoodsSkusCardValue) {
  return request.post<GoodsSkusCardValue & id>({ url: `${GoodsAPI.goodSkusUrl}`, data });
}

/**
 * 修改商品规格选项的值
 * @param id 规格选项 ID
 * @param data
 * @returns
 */
export function updateGoodsSkusCardValue(id: number, data: GoodsSkusCardValue) {
  return request.post<boolean>({
    url: `${GoodsAPI.goodSkusUrl}/${id}`,
    data
  });
}

/**
 * 删除商品规格选项的值
 * @param id 规格选项 ID
 * @returns
 */
export function deleteGoodsSkusCardValue(id: number) {
  return request.post<boolean>({
    url: `${GoodsAPI.goodSkusUrl}/${id}/delete`
  });
}

/**
 * 选择设置商品规格选项和值
 * @param id 规格 ID
 * @param data
 * @returns
 */
export function chooseAndSetGoodsSkusCard(id: number, data: { name: string; value: [] }) {
  return request.post({
    url: `${GoodsAPI.goodSkusUrl}/${id}/set`,
    data
  });
}
