export interface Review {
  data: string;
  image: string[];
}

export interface GoodsItem {
  id: number;
  title: string;
  category_id: number;
  cover: string;
  rating: number;
  sale_count: number;
  review_count: number;
  min_price: string;
  min_oprice: string;
  desc: string;
  unit: string;
  stock: number;
  min_stock: number;
  ischeck: number;
  status: number;
  stock_display: number;
  express_id: number;
  sku_type: number;
  sku_value: {
    oprice: number;
    pprice: number;
    cprice: number;
    weight: number;
    volume: number;
  };
  content: string;
  discount: number;
  create_time: string;
  update_time: string;
  delete_time: string | null;
  order: number;
}

export interface User {
  id: number;
  username: string;
  avatar: string;
  nickname: string;
  phone: string;
  email: string;
  user_level_id: number;
  create_time: string;
  update_time: string;
  last_login_time: string | null;
  status: number;
}

export interface ListItem {
  id: number;
  order_id: number;
  shop_id: number;
  num: number;
  price: string;
  rating: number;
  review: Review;
  review_time: string;
  create_time: string;
  skus_type: number;
  goods_id: number;
  goods_num: number;
  user_id: number;
  extra: null;
  status: number;
  goods_item: GoodsItem;
  user: User;
}

export interface Data {
  list: ListItem[];
  totalCount: number;
}
