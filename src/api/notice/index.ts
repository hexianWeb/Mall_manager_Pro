import request from '@/service';
import { newNotice, noticeList } from './type';

enum IndexAPI {
  noticeUrl = '/notice'
}

/**
 * 公告列表
 * @param page 分页页码
 * @returns 返回公告列表相关信息
 */
export function getNoticeList(page: number) {
  return request.get<noticeList>({
    url: `${IndexAPI.noticeUrl}/${page}`
  });
}

/**
 * 增加公告
 * @param params 公告内容
 * @returns 成功响应
 */
export function createNotice(params: any) {
  return request.post<newNotice>({
    url: IndexAPI.noticeUrl,
    data: params
  });
}

/**
 * 修改公告
 * @param id 公告ID
 * @param data 公告内容
 * @returns 成功响应
 */
export function updateNotice(id: number, params: any) {
  return request.post<boolean>({
    url: IndexAPI.noticeUrl + id,
    data: params
  });
}

/**
 * 删除公告
 * @param id 公告 ID
 * @returns 成功响应
 */
export function deleteNotice(id: number) {
  return request.post({ url: `${IndexAPI.noticeUrl}/${id}/delete` });
}
