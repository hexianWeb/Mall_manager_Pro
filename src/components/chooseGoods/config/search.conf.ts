import { getCategoryList } from '@/api/category/index';

interface Option {
  value: number;
  label: string;
}
export let categoryList: Option[] = [];

await getCategoryList().then((res) => {
  categoryList = res.map((item) => {
    return {
      value: item.id,
      label: item.name
    };
  });
});

export const searchConfig = {
  labelWidth: '120px',
  formOptions: [
    {
      label: '商品关键字',
      type: 'input',
      field: 'title',
      placeHolder: '请输入关键字'
    },
    {
      label: '每次查询笔数',
      type: 'input',
      field: 'limit',
      defaultFieldValue: '6',
      placeHolder: '请输入查询笔数'
    },
    {
      label: '商品分类',
      type: 'select',
      field: 'category_id',
      otherOptions: {
        options: categoryList
      }
    }
  ]
};
