export namespace Table {
  export interface Pageable {
    totalCount: number;
    pageNum: number;
    pageSize?: number;
  }
  export interface Options {
    tableData: any[];
    pageable: Pageable;
    // 查询参数(只包括查询)
    searchParam: {
      [key: string]: any;
    };
    //初始化请求参数 ==> 非必传（默认为{}）
    searchInitParam: {
      [key: string]: any;
    };
    // 总参数(包含分页和查询参数)
    totalParam: {
      [key: string]: any;
    };
    icon?: {
      [key: string]: any;
    };
  }
}

export namespace HandleData {
  export type MessageType = '' | 'success' | 'warning' | 'info' | 'error';
}

export namespace Theme {
  export type ThemeType = 'light' | 'inverted' | 'dark';
  export type GreyOrWeakType = 'grey' | 'weak';
}
