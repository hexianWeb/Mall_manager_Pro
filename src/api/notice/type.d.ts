export interface noticeList {
  list: notice[];
  totalCount: number;
}

export interface notice {
  id: number;
  title: string;
  content: string;
  order: number;
  create_time: string;
  update_time: string;
}

export interface newNotice {
  title: string;
  content: string;
  create_time: string;
  update_time: string;
  id: string;
}
