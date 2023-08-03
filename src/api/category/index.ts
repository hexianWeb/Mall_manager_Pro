import request from '@/service';
import { Category } from './type';

enum categoryAPI {
  indexUrl = '/category'
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
