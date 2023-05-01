const info = {
  formOptions: [
    {
      label: '用户名',
      type: 'input',
      field: 'name',
      defaultFieldValue: 'UserName',
      placeHolder: '请输入用户名'
    },
    {
      label: '状态',
      type: 'select',
      placeHolder: '请选择状态',
      field: 'enable',
      otherOptions: {
        options: [
          {
            label: '正常',
            value: 1
          },
          {
            label: '禁止',
            value: 0
          }
        ]
      }
    },
    {
      label: '创建时间',
      type: 'datepicker',
      field: 'date',
      defaultFieldValue: undefined,
      placeHolder: '请选择日期范围',
      otherOptions: {
        type: 'daterange',
        rangeSeparator: '-',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期'
      }
    }
  ]
};
