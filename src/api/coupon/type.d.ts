export interface CouponInfo extends Coupon {
  id: number;
  create_time: string;
  update_time: string;
}

export interface Coupon {
  name: string;
  type: number;
  value: string;
  total: number;
  used: number;
  min_price: string;
  start_time: string;
  end_time: string;
  status: number;
  order: number;
  desc: string;
}
export interface Data {
  list: CouponInfo[];
  totalCount: number;
}
