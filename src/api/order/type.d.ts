interface Address {
  id: number;
  user_id: number;
  province: string;
  city: string;
  district: string;
  address: string;
  zip: number;
  name: string;
  phone: string;
  last_used_time: number;
  create_time: string;
  update_time: string;
}

interface GoodsSkus {
  id: number;
  goods_skus_card_id: number;
  name: string;
  value: string;
  order: number;
  text: string;
  color: string;
  image: string;
}

interface GoodsItem {
  id: number;
  title: string;
  cover: string;
  sku_type: number;
}

interface OrderItem {
  id: number;
  order_id: number;
  shop_id: number;
  goods_id: number;
  num: number;
  price: string;
  skus_type: number;
  goods_item: GoodsItem;
  goods_skus: {
    id: number;
    skus: {
      [key: string]: GoodsSkus;
    };
  };
  sku?: string;
}

interface User {
  id: number;
  nickname: string;
  username: string;
  avatar: string;
}

interface Order {
  id: number;
  no: string;
  user_id: number;
  address: Address;
  total_price: string;
  remark: string;
  paid_time: number;
  payment_method: string;
  payment_no: string;
  refund_status: string;
  refund_no: string | null;
  closed: number;
  ship_status: string;
  ship_data: any;
  extra: any;
  create_time: string;
  update_time: string;
  reviewed: number;
  coupon_user_id: number;
  order_items: OrderItem[];
  user: User;
}

export interface Data {
  list: Order[];
  totalCount: number;
}

interface DeliveryStatusItem {
  time: string;
  status: string;
}

export interface DeliveryResult {
  number: string;
  type: string;
  typename: string;
  logo: string;
  list: DeliveryStatusItem[];
  deliverystatus: number;
  issign: number;
}

export interface DeliveryData {
  status: number;
  msg: string;
  result: DeliveryResult;
}
