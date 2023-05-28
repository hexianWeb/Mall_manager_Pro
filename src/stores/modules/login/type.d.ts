export interface UserState {
  token?: string | null;
  userInfo?: UserInfo | null;
  // userMenus?: UserMenus[];
}

export interface Account {
  username: string;
  password: string;
}
export interface LoginInfo {
  token: string;
}

export interface UpdatePassword {
  oldpassword: string;
  password: string;
  repassword: string;
}
export interface UserInfo {
  id: number;
  username: string;
  avatar: string;
  super: number;
  role: Role;
  menus: Menu[];
  ruleNames: string[];
}

export interface Role {
  id: number;
  name: string;
}

export interface Menu {
  id: number;
  rule_id: number;
  status: number;
  create_time: string;
  update_time: string;
  name: string;
  desc?: string;
  frontpath?: string;
  condition?: string;
  menu: number;
  order: number;
  icon: string;
  method: string;
  child: Child[];
}

export interface Child {
  id: number;
  rule_id: number;
  status: number;
  create_time: string;
  update_time: string;
  name: string;
  desc?: string;
  frontpath: string;
  condition?: string;
  menu: number;
  order: number;
  icon: string;
  method: string;
  child: any[];
}
