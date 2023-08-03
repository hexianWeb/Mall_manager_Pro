export interface Category {
  id: number;
  name: string;
  status: number;
  create_time: string;
  update_time: string;
  category_id: number;
  order: number;
  child: Category[]; // 递归定义子分类
}
