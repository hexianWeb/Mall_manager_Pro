import request from '@/service';
import { objectToUrlParams } from '@/utils/Serializable';
import { Category } from './type';

enum categoryAPI {
  indexUrl = '/category',
  contactUrl = '/app_category_item'
}

/**
 * 商品分类列表
 * @returns
 */
export function getCategoryList() {
  return request.get<Category[]>({
    url: categoryAPI.indexUrl
  });
}

/**
 * 增加商品分类
 * @param data [name] 分类名称
 * @returns
 */
export function createCategory(data: { name: string }) {
  return request.post({
    url: categoryAPI.indexUrl,
    data
  });
}

/**
 * 修改商品分类
 * @param id 分类 ID
 * @param data [name] 分类名称
 * @returns
 */
export function updateCategory(id: number, form: { name: string }) {
  return request.post({ url: categoryAPI.indexUrl + '/' + id, data: form });
}

/**
 * 修改商品分类状态
 * @param id 分类 ID
 * @param status 状态：0禁用,1启用
 * @returns
 */
export function updateCategoryStatus(id: number, status: 0 | 1) {
  return request.post({
    url: `${categoryAPI.indexUrl}/${id}/update_status`,
    data: {
      status
    }
  });
}

/**
 * 删除商品分类
 * @param id 分类 ID
 * @returns
 */
export function deleteCategory(id: number) {
  return request.post({
    url: `${categoryAPI.indexUrl}/${id}/delete`
  });
}

/**
 * 分类关联产品列表
 * @param id 分类ID
 * @returns
 */
export function getCategoryGoods(id: number, queryData: { category_id: number }) {
  const urlParams = objectToUrlParams(queryData);
  const SerializableUrl = urlParams ? `?${urlParams}` : '';
  return request.get({
    url: `${categoryAPI.contactUrl}/list` + SerializableUrl
  });
}

/**
 * 删除关联产品
 * @param id 分类产品关联 ID
 * @returns
 */
export function deleteCategoryGoods(id: number) {
  return request.post({
    url: `${categoryAPI.contactUrl}/${id}/delete`
  });
}

/**
 * 关联产品
 * @param data
 * @returns
 */
export function connectCategoryGoods(data: { category_id: number; goods_ids: string[] }) {
  return request.post({ url: categoryAPI.contactUrl, data });
}
