import request from '@/service';

enum roleAPI {
  roleUrl = 'role'
}

/**
 * 角色权限列表
 * @param page 角色权限列表页数
 * @returns 角色权限列表
 */
export function getRoleList(page: number) {
  return request.get<any>({
    url: `${roleAPI.roleUrl}/${page}`
  });
}

/**
 * 增加角色权限
 * @param data 请求 Body 参数
 * @returns 增加的角色权限细节
 */
export function createRole(data: any) {
  return request.post<any>({ url: roleAPI.roleUrl, data });
}

/**
 * 修改角色权限
 * @param id 对应角色 ID
 * @param data 请求 Body 参数
 * @returns 修改的角色权限细节
 */
export function updateRole(id: number, data: any) {
  return request.post({
    url: roleAPI.roleUrl + '/' + id,
    data
  });
}

/**
 * 修改角色状态
 * @param id 对应角色 ID
 * @param status 是否开启：0否1是
 * @returns {boolean} 是否修改成功
 */
export function updateRoleStatus(id: number, status: number) {
  return request.post({
    url: `${roleAPI.roleUrl}/${id}/update_status`,
    data: {
      status
    }
  });
}

/**
 * 删除角色权限
 * @param id 角色/权限ID
 * @returns {boolean} 是否删除成功
 */
export function deleteRole(id: number) {
  return request.post({
    url: `${roleAPI.roleUrl}/${id}/delete`
  });
}

/**
 * 配置角色权限
 * @param id 角色 ID
 * @param ruleIds 角色权限 ID 汇总
 */
export function setRoles(id: number, rule_ids: number[]) {
  return request.post({
    url: `${roleAPI.roleUrl}/set_rules`,
    data: {
      id,
      rule_ids
    }
  });
}
