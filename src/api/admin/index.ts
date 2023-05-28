import request from '@/service';
import { LoginInfo, UpdatePassword, UserInfo } from '@/stores/modules/login/type';
import { LogOutInfo } from './type';

enum LoginAPI {
  loginUrl = '/login',
  authUrl = '/getinfo',
  LogOutUrl = '/logout',
  updatePasswordURL = '/updatepassword'
}

export function adminLogin(params: any) {
  return request.post<LoginInfo>({
    url: LoginAPI.loginUrl,
    data: params
  });
}

export function adminAuth() {
  return request.post<UserInfo>({
    url: LoginAPI.authUrl
  });
}

export function adminLogOut() {
  return request.post<LogOutInfo>({
    url: LoginAPI.LogOutUrl
  });
}

export function updatePassword(params: any) {
  return request.post<UpdatePassword>({
    url: LoginAPI.updatePasswordURL,
    data: params
  });
}
