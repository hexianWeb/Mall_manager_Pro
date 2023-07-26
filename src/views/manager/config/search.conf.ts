const formData = {
  labelWidth: '120px',
  formOptions: [
    {
      label: '角色关键字',
      type: 'input',
      field: 'keyword',
      placeHolder: '请输入关键字'
    },
    {
      label: '每次查询笔数',
      type: 'input',
      field: 'limit',
      defaultFieldValue: '6',
      placeHolder: '请输入查询笔数'
    }
  ]
};

export default formData;
