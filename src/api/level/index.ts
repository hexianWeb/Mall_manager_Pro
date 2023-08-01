import request from '@/service';
import type { MembershipInfo, Membership, Data } from './type';

enum membershipAPI {
  membershipUrl = 'user_level'
}

/**
 * 会员等级列表
 * @param page 会员等级列表页数
 * @returns 会员等级列表
 */
export function getMembershipList(page: number) {
  return request.get<Data>({
    url: `${membershipAPI.membershipUrl}/${page}`
  });
}

/**
 * 增加会员等级
 * @param data 请求 Body 参数
 * @returns 增加的会员等级细节
 */
export function createMembership(data: Membership) {
  return request.post<MembershipInfo>({ url: membershipAPI.membershipUrl, data });
}

/**
 * 修改会员等级
 * @param id 会员等级ID
 * @param data 请求 Body 参数
 * @returns 修改的会员等级细节
 */
export function updateMembership(id: number, data: Membership) {
  return request.post<boolean>({
    url: membershipAPI.membershipUrl + '/' + id,
    data
  });
}

/**
 * 修改会员等级状态
 * @param id 会员等级ID
 * @param status 状态：0禁用1启用
 * @returns {boolean} 是否修改成功
 */
export function updateMembershipStatus(id: number, status: 0 | 1) {
  return request.post<boolean>({
    url: `${membershipAPI.membershipUrl}/${id}/update_status`,
    data: {
      status
    }
  });
}

/**
 * 删除会员等级
 * @param id 会员等级ID
 * @returns {boolean} 是否删除成功
 */
export function deleteMembership(id: number) {
  return request.post<boolean>({
    url: `${membershipAPI.membershipUrl}/${id}/delete`
  });
}
