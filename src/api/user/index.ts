import type { User } from './type';
import request from '@/service';
import { objectToUrlParams } from '@/utils/Serializable';
enum IndexAPI {
  userUrl = '/user'
}

interface Parameters {
  limit?: number;
  keyword?: string;
  user_level_id?: number;
}

/**
 * 用户列表
 * @param page 分页页码
 * @param query 请求Query参数
 * @returns
 */
export function getUserList(page: number, queryData?: Parameters) {
  const urlParams = objectToUrlParams(queryData);
  const SerializableUrl = urlParams ? `?${urlParams}` : '';
  return request.get({
    url: `${IndexAPI.userUrl}/${page}${SerializableUrl}`
  });
}

/**
 * 修改用户状态
 * @param id 用户ID
 * @param status 状态：0禁用1启用
 * @returns
 */
export function updateUserStatus(id: number, status: 0 | 1) {
  return request.post({
    url: `${IndexAPI.userUrl}/${id}/update_status`,
    data: {
      status
    }
  });
}

/**
 * 增加用户
 * @param data 用户信息
 * @returns
 */
export function createUser(data: User) {
  return request.post({
    url: `${IndexAPI.userUrl}`,
    data
  });
}

/**
 * 修改用户
 * @param id 用户ID
 * @param data 用户信息
 * @returns
 */
export function updateUser(id: number, data: User) {
  return request.post({
    url: `${IndexAPI.userUrl}/${id}`,
    data
  });
}

/**
 * 删除会员
 * @param id 用户ID
 * @returns
 */
export function deleteUser(id: number) {
  return request.post({
    url: `${IndexAPI.userUrl}/${id}/delete`
  });
}
