export interface ImageCatList {
  list: ImageCatData[];
  totalCount: number;
}

export interface ImageCatData {
  id: number;
  name: string;
  order: number;
  images_count: number;
}
