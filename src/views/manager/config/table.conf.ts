const tableOptions = {
  header: {
    title: '角色列表',
    handleOption: {
      title: '新建用户',
      icon: 'Avatar',
      handleNewClick: () => {
        console.log('新建用户角色列表');
      },
      handleRefresh: () => {
        console.log('刷新数据');
      }
    }
  },
  content: {
    showIndex: true,
    showSelect: true,
    dataSource: [],
    columns: [
      {
        label: '职位等级',
        minWidth: '100',
        slotName: 'id'
      },
      {
        prop: 'name',
        label: '角色',
        minWidth: '100'
      },
      {
        prop: 'intro',
        label: '职位名称',
        minWidth: '120'
      },
      {
        label: '创建时间',
        minWidth: '250',
        slotName: 'createAt'
      },
      {
        label: '更新时间',
        minWidth: '250',
        slotName: 'updateAt'
      },
      {
        label: '操作',
        width: '180',
        slotName: 'operation'
      }
    ]
  },
  footer: {
    currentPage: 0,
    pageSizes: [5, 10],
    pageSize: 10,
    total: 0,
    sizeChange: (size: number) => {
      console.log(size);
    },
    currentChange: (current: number) => {
      console.log(current);
    }
  }
};

export default tableOptions;
