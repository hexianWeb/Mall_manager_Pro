export interface OrderSearchParams {
  tab: 'all' | 'checking' | 'saling' | 'off' | 'min_stock' | 'delete';
  title?: string;
  category_id?: number;
  limit?: number;
}

export interface GoodsBanner {
  id: number;
  goods_id: number;
  url: string;
  create_time: string;
  update_time: string;
}

export interface GoodsSkusCard {
  id: number;
  name: string;
  goods_id?: number;
  type?: number;
  order?: number;
  goodsSkusCardValue?: GoodsSkusCardValue[];
}

export interface GoodsSkusCardValue {
  goods_skus_card_id: number;
  name: string;
  order: number;
  value: string;
}

export interface Category {
  id: number;
  name: string;
  status: number;
  create_time: string;
  update_time: string;
  category_id: number;
  order: number;
  level: number;
}

interface Sku {
  goods_skus_card_id: string;
  name: string;
  order: number;
  value: string;
  id: string;
  text: string;
}
export interface GoodsSku {
  skus: Sku[];
  image: string;
  pprice: number;
  oprice: number;
  cprice: number;
  stock: number;
  volume: number;
  weight: number;
  code: string;
  goods_id: number;
}
export interface ReadGood {
  id: number;
  title: string;
  category_id: number;
  cover: string;
  rating: number;
  sale_count: number;
  review_count: number;
  min_price: string;
  min_oprice: string;
  desc: string | null;
  unit: string;
  stock: number;
  min_stock: number;
  ischeck: number;
  status: number;
  stock_display: number;
  express_id: number;
  sku_type: number;
  sku_value: Record<string, any>;
  content: string;
  discount: number;
  create_time: string;
  update_time: string;
  delete_time: string | null;
  order: number;
  category: Category;
  goodsBanner: GoodsBanner[];
  goodsAttrs: any[]; // You can define a type for this if needed
  goodsSkus: GoodsSku[]; // You can define a type for this if needed
  goodsSkusCard: GoodsSkusCard[];
}

export interface GoodsListResponse {
  msg: string;
  data: {
    list: ReadGood[];
    totalCount: number;
    cates: Category[];
  };
}

export interface Good {
  title: string;
  category_id: number;
  cover: string;
  desc: string;
  unit: string;
  stock: number;
  min_stock: number;
  status: 0 | 1;
  stock_display: 0 | 1;
  min_price: number;
  min_oprice: number;
}

export interface NewGoodInfo {
  title: string;
  category_id: number;
  cover: string;
  desc: string;
  unit: string;
  stock: number;
  min_stock: number;
  status: 0 | 1;
  stock_display: 0 | 1;
  min_price: string; // Assuming this should be a string based on the provided JSON
  min_oprice: string; // Assuming this should be a string based on the provided JSON
  ischeck: number; // Assuming this is a number, change to a more accurate type if needed
  create_time: string; // Assuming this is a string, change to a more accurate type if needed
  update_time: string; // Assuming this is a string, change to a more accurate type if needed
  id: string; // Assuming this is a string, change to a more accurate type if needed
}

export interface updateGoodInfo {
  title?: string;
  category_id?: number;
  cover?: string;
  desc?: string;
  unit?: string;
  stock?: number;
  min_stock?: number;
  status?: 0 | 1;
  stock_display?: 0 | 1;
  min_price?: number;
  min_oprice?: number;
  content?: string;
}
