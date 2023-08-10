const searchConfig = {
  labelWidth: '120px',
  formOptions: [
    {
      label: '订单号',
      type: 'input',
      field: 'no',
      placeHolder: '请输入订单号'
    },

    {
      label: '开始时间',
      type: 'datepicker',
      field: 'starttime',
      otherOptions: {
        valueFormat: 'YYYY-MM-DD'
      }
    },
    {
      label: '结束时间',
      type: 'datepicker',
      field: 'endtime',
      otherOptions: {
        valueFormat: 'YYYY-MM-DD'
      }
    },
    {
      label: '收货人',
      type: 'input',
      field: 'name',
      placeHolder: '请输入收货人'
    },
    {
      label: '收货人手机号',
      type: 'input',
      field: 'phone',
      placeHolder: '收货人手机号'
    }
  ]
};

export default searchConfig;
