export interface MembershipInfo {
  id: number;
  name: string;
  level: number;
  status: number;
  discount: number;
  max_price: number;
  max_times: number;
}

export interface Data {
  list: MembershipInfo[];
  totalCount: number;
}

export interface Membership {
  name: string;
  level: number;
  status: number;
  discount: number;
  max_price: number;
  max_times: number;
}
