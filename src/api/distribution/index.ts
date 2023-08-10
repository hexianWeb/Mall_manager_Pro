import request from '@/service';
import { objectToUrlParams } from '@/utils/Serializable';
import { Data, DistributionConfig, StatisticsData } from './type';

enum distributionAPI {
  url = '/agent',
  userBillUrl = '/user_bill',
  settingUrl = '/distribution_setting'
}

interface RequestParams {
  keyword?: string;
  type?: 'all' | 'today' | 'yesterday' | 'last7days';
  starttime?: string;
  endtime?: string;
  level?: 0 | 1 | 2;
  user_id?: number;
}

/**
 * 分销推广员列表
 * @param page 分页页码
 * @param queryData
 * @returns
 */
export function getAgentList(page: number, queryData: RequestParams = {}) {
  const urlParams = objectToUrlParams(queryData);
  const SerializableUrl = urlParams ? `?${urlParams}` : '';
  return request.get({
    url: `${distributionAPI.url}/${page}${SerializableUrl}`
  });
}

type TimePeriod = 'all' | 'today' | 'yesterday' | 'last7days';

interface Params {
  type?: TimePeriod;
  starttime?: string;
  endtime?: string;
}

/**
 * 推广订单列表
 * @param page 分页页码
 * @param queryData
 * @returns
 */
export function getAgentOrderList(page: number, queryData: Params = {}) {
  const urlParams = objectToUrlParams(queryData);
  const SerializableUrl = urlParams ? `?${urlParams}` : '';
  return request.get({
    url: `${distributionAPI.userBillUrl}/${page}${SerializableUrl}`
  });
}

/**
 * 分销数据统计
 * @returns
 */
export function getAgentStatistics() {
  return request.get<StatisticsData>({
    url: distributionAPI.url + '/statistics'
  });
}

/**
 * 获取分销配置
 * @returns
 */
export function getConfig() {
  return request.get<Data>({
    url: `${distributionAPI.settingUrl}/get`
  });
}

/**
 * 修改分销配置
 * @param data
 * @returns
 */
export function setConfig(data: DistributionConfig) {
  return request.post({
    url: `${distributionAPI.settingUrl}/set`,
    data
  });
}
