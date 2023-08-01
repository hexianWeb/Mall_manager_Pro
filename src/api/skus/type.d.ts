export interface Skus {
  status: number; // Consider using boolean instead if status is boolean.
  name: string;
  order: number;
  default: string;
}

export interface SkusList {
  list: Skus[];
}

export interface SkusInfo {
  id: number;
  name: string;
  type: number;
  create_time: string;
  update_time: string;
  status: number;
  order: number;
  default: string;
}

export interface Data {
  list: SkusInfo[];
  totalCount: number;
}
