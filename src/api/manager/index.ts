import request from '@/service';
import { objectToUrlParams } from '@/utils/Serializable';
import { Data, User, UserData } from './type';
enum IndexAPI {
  listUrl = '/manager'
}

interface QueryData {
  limit?: number;
  keyword?: string;
}

/**
 * 管理员列表
 * @param page 分页页码
 * @param queryData 请求 Query 参数
 */
export function getManagerList(page: number, queryData?: QueryData) {
  const urlParams = objectToUrlParams(queryData);
  const SerializableUrl = urlParams ? `?${urlParams}` : '';
  return request.get<Data>({
    url: `${IndexAPI.listUrl}/${page}` + SerializableUrl
  });
}

/**
 * 增加管理员
 * @param managerInfo 请求Body参数
 */
export function createManager(managerInfo: User) {
  return request.post<UserData>({
    url: `${IndexAPI.listUrl}`,
    data: managerInfo
  });
}

/**
 * 删除管理员
 * @param id 管理员 ID
 */
export function deleteManagerById(id: number) {
  return request.post<boolean>({
    url: `${IndexAPI.listUrl}/${id}/delete`
  });
}

/**
 * 修改管理员
 * @param managerInfo 请求Body参数
 */
export function updateManagerInfoById(id: number, managerInfo: User) {
  return request.post<boolean | string>({
    url: `${IndexAPI.listUrl}/${id}`,
    data: managerInfo
  });
}
/**
 * 修改管理员状态
 * @param id 管理员 ID
 * @param status 	是否启用：0禁用1启用
 */
export function updateManagerStatusById(id: number, status: number) {
  return request.post<boolean>({
    url: `${IndexAPI.listUrl}/${id}/update_status`,
    data: {
      status
    }
  });
}
