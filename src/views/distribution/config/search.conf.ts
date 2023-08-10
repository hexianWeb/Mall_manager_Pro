const searchConfig = {
  labelWidth: '120px',
  formOptions: [
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
      label: '关键词',
      type: 'input',
      field: 'keyword',
      placeHolder: '请输入关键词'
    }
  ]
};

export default searchConfig;
