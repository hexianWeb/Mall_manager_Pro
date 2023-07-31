import request from '@/service';
import type { NewRule, Rule, RuleList } from './type';

enum ruleAPI {
  ruleUrl = 'rule'
}

/**
 * 菜单权限列表
 * @param page 菜单权限列表页数
 * @returns 菜单权限列表
 */
export function getRuleList(page: number) {
  return request.get<RuleList>({
    url: `${ruleAPI.ruleUrl}/${page}`
  });
}

/**
 * 增加菜单权限
 * @param data 请求 Body 参数
 * @returns 增加的菜单权限细节
 */
export function createRule(data: NewRule) {
  return request.post<Rule>({ url: ruleAPI.ruleUrl, data });
}

/**
 * 修改菜单权限
 * @param id 对应菜单 ID
 * @param data 请求 Body 参数
 * @returns 修改的菜单权限细节
 */
export function updateRule(id: number, data: NewRule) {
  return request.post({
    url: ruleAPI.ruleUrl + id,
    data
  });
}

/**
 * 修改菜单权限状态
 * @param id 对应菜单 ID
 * @param status 是否开启：0否1是
 * @returns {boolean} 是否修改成功
 */
export function updateRuleStatus(id: number, status: number) {
  return request.post({
    url: `${ruleAPI.ruleUrl}/${id}/update_status`,
    data: {
      status
    }
  });
}

/**
 * 删除菜单权限
 * @param id 菜单/权限ID
 * @returns {boolean} 是否删除成功
 */
export function deleteRule(id: number) {
  return request.post({
    url: `/admin/rule/${id}/delete`
  });
}
