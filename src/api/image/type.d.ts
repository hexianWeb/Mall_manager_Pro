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

export interface imageList {
  list: imageData[];
  totalCount: number;
}

export interface imageData {
  id: number;
  url: string;
  name: string;
  path: string;
  create_time: string;
  update_time: string;
  image_class_id: number;
}
