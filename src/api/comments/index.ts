import request from '@/service';
import { objectToUrlParams } from '@/utils/Serializable';
import type { Data } from './type';
enum CommentsAPI {
  commentUrl = '/goods_comment'
}

/**
 * 商品评价列表
 * @param page 	分页页码
 * @param query [title] 商品标题
 * @returns
 */
export function getGoodsCommentList(page: number, queryData = {}) {
  const urlParams = objectToUrlParams(queryData);
  const SerializableUrl = urlParams ? `?${urlParams}` : '';
  return request.get<Data>({
    url: `${CommentsAPI.commentUrl}/${page}${SerializableUrl}`
  });
}

/**
 * 修改商品评价状态
 * @param id 商品评价 ID
 * @param status 状态：0禁用1启用
 * @returns
 */
export function updateGoodsCommentStatus(id: number, status: 0 | 1) {
  return request.post<boolean>({
    url: `${CommentsAPI.commentUrl}/${id}/update_status`,
    data: {
      status
    }
  });
}

/**
 * 回复商品评价
 * @param id 订单 ID
 * @param data 评价内容
 * @returns
 */
export function reviewGoodsComment(id: number, data: string) {
  return request.post<boolean>({
    url: `${CommentsAPI.commentUrl}/review/${id}`,
    data: {
      data
    }
  });
}
