import request from '@/service';
import { objectToUrlParams } from '@/utils/Serializable';
import { Data, DeliveryData } from './type';

enum orderAPI {
  url = '/order'
}

interface QueryParams {
  tab: 'all' | 'nopay' | 'noship' | 'shiped' | 'received' | 'finish' | 'closed' | 'refunding';
  no?: string;
  starttime?: string;
  endtime?: string;
  name?: string;
  phone?: string;
}
/**
 * 获取订单列表
 * @param page 分页页码
 * @param query 请求Query参数
 * @returns
 */
export function getOrderList(page: number, query: QueryParams) {
  const urlParams = objectToUrlParams(query);
  const SerializableUrl = urlParams ? `?${urlParams}` : '';
  return request.get<Data>({
    url: `${orderAPI.url}/${page}${SerializableUrl}`
  });
}

/**
 * 批量删除订单
 * @param ids id组成的一维数组
 * @returns
 */
export function deleteOrder(ids: number[]) {
  return request.post<boolean>({
    url: `${orderAPI.url}/delete_all`,
    data: {
      ids
    }
  });
}

/**
 * 导出订单
 * @param query Query参数
 * @returns
 */
export function exportOrder(query = {}) {
  const urlParams = objectToUrlParams(query);
  const SerializableUrl = urlParams ? `?${urlParams}` : '';
  return request.post({
    url: `${orderAPI.url}/excelexport${SerializableUrl}`,
    data: {},
    responseType: 'blob'
  });
}

/**
 * 查看订单物流信息
 * @param id 订单 ID
 * @returns
 */
export function getShipInfo(id: number) {
  return request.get<DeliveryData>({
    url: `${orderAPI.url}/${id}/get_ship_info`
  });
}

/**
 * 拒绝or同意退款
 * @param id 订单id
 * @param data
 * @returns
 */
export function refundOrder(
  id: number,
  data: {
    agree: 0 | 1;
    disagree_reason: string;
  }
) {
  return request.post({
    url: `${orderAPI.url}/${id}/handle_refund`,
    data
  });
}
