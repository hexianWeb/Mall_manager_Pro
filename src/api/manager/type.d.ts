export interface Data {
  list: ManagerData[];
  totalCount: number;
  roles: Role[];
}

export interface ManagerData {
  id: number;
  status: number;
  create_time: string;
  update_time: string;
  username: string;
  avatar: string;
  role_id: number;
  super: number;
  role: Role;
}

export interface Role {
  id: number;
  name: string;
}

export interface User {
  username: string;
  password: string;
  role_id: number;
  status: number;
  avatar?: string;
}

export interface UpdateUser extends User {
  id: number;
}
export interface UserData {
  username: string;
  role_id: number;
  status: number;
  avatar: string;
  super: number;
  create_time: string;
  update_time: string;
  id: number;
}
