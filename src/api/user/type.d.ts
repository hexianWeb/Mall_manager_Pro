export interface User {
  username: string;
  password: number | string;
  status: 0 | 1;
  nickname?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  user_level_id: number;
}
