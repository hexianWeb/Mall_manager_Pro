import request from '@/service';
import { ImageCatList, imageList } from '@/api/image/type';
enum ImageAPI {
  cateListUrl = '/image_class'
}

/**
 * 获取图库列表
 * @param page 分页页码
 * @param limit 每页显示条数
 */
export function getImageCatList(page: number = 1, limit: number = 10) {
  return request.get<ImageCatList>({
    url: `${ImageAPI.cateListUrl}/${page}?limit=${limit}`
  });
}

/**
 * 增加图库分类
 * @param name 图库分类名称
 * @param order 排序
 * @returns {boolean} 是否修改成功
 */
export function addImageCate(params: any) {
  return request.post<boolean>({
    url: ImageAPI.cateListUrl,
    data: params
  });
}

/**
 * 修改图库分类
 * @path /:id 图库分类所属 id
 * @param name 图库分类名称
 * @param order 排序
 * @returns {boolean} 是否修改成功
 */
export function updateImageCate(id: number, params: any) {
  return request.post<boolean>({
    url: `${ImageAPI.cateListUrl}/${id}`,
    data: params
  });
}

/**
 * 删除图库分类
 * @param id 图库分类 ID
 */
export function deleteImageCate(id: number) {
  return request.post<boolean>({
    url: `${ImageAPI.cateListUrl}/${id}/delete`
  });
}

export function getImageListByCateId(id: number, page: number = 1, limit: number = 10) {
  return request.get<imageList>({
    url: `${ImageAPI.cateListUrl}/${id}/image/${page}?limit = ${limit}`
  });
}
