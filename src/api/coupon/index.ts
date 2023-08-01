import request from '@/service';
import type { Coupon, Data, CouponInfo } from './type';

enum couponAPI {
  couponUrl = 'coupon'
}

/**
 * 优惠券列表
 * @param page 优惠券列表页数
 * @returns 优惠券列表
 */
export function getCouponList(page: number) {
  return request.get<Data>({
    url: `${couponAPI.couponUrl}/${page}`
  });
}

/**
 * 增加优惠券
 * @param data 请求 Body 参数
 * @returns 增加的优惠券细节
 */
export function createCoupon(data: Coupon) {
  return request.post<CouponInfo>({ url: couponAPI.couponUrl, data });
}

/**
 * 修改优惠券
 * @param id 对应优惠券 ID
 * @param data 请求 Body 参数
 * @returns 修改的优惠券细节
 */
export function updateCoupon(id: number, data: Coupon) {
  return request.post<boolean>({
    url: couponAPI.couponUrl + '/' + id,
    data
  });
}

/**
 * 修改优惠券状态
 * @param id 对应优惠券 ID
 * @param status 是否开启：0否1是
 * @returns {boolean} 是否修改成功
 */
export function updateCouponStatus(id: number, status: 0 | 1) {
  return request.post<boolean>({
    url: `${couponAPI.couponUrl}/${id}/update_status`,
    data: {
      status
    }
  });
}

/**
 * 删除优惠券
 * @param id 优惠券 ID
 * @returns {boolean} 是否删除成功
 */
export function deleteCoupon(id: number) {
  return request.post<boolean>({
    url: `${couponAPI.couponUrl}/${id}/delete`
  });
}
