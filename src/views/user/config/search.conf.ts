import { getMembershipList } from '@/api/level/index';

interface Option {
  value: number;
  label: string;
}
export let levelList: Option[] = [];

await getMembershipList(1).then((res) => {
  levelList = res.list.map((item) => {
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
    },
    {
      label: '会员等级',
      type: 'select',
      field: 'user_level_id',
      otherOptions: {
        options: levelList
      }
    }
  ]
};
