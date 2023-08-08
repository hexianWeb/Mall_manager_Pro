<template>
  <FormDrawer
    ref="formDrawerRef"
    :drawerTitle="`推荐${drawerTitle}商品`"
    drawerConfirm="关联"
    @submit="openChooseGoods"
  >
    <ProTableComponent
      ref="proTable"
      :pagination="false"
      :columns="columns"
      :requestApi="getCategoryGoods"
      :init-param="initParam"
    >
      <template #operation="{ row }">
        <el-popconfirm
          title="是否要删除该记录？"
          confirmButtonText="确认"
          cancelButtonText="取消"
          @confirm="handleDelete(row.id)"
        >
          <template #reference>
            <el-button text type="primary" size="small" :loading="row.loading">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </ProTableComponent>
  </FormDrawer>
  <chooseGoods ref="chooseGoodsRef" :category-id="initParam.category_id" @reload="reloadData" />
</template>
<script setup lang="tsx">
import type { ProTableInstance, ColumnProps } from '@/base-ui/ProTable/types';
import chooseGoods from '@/components/chooseGoods/src/index.vue';
import { getCategoryGoods, deleteCategoryGoods } from '@/api/category/index';
import FormDrawer from '@/base-ui/formDrawer/FormDrawer.vue';
import ProTableComponent from '@/base-ui/ProTable/src/index.vue';

const drawerTitle = ref('');
/**
 * 如果表格需要初始化请求参数，直接定义传给 ProTable 之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据
 * @type {Object}
 */
const initParam = reactive({ category_id: 0 });

/**
 *  获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
 * @type {ProTableInstance}
 */
const proTable = ref<ProTableInstance>();

/**
 * ProTable 配置项
 */
const columns: ColumnProps<any>[] = [
  { prop: 'goods_id', label: 'ID', width: 60 },
  {
    prop: 'cover',
    label: '商品封面',
    width: 180,
    render({ row }) {
      return <el-image src={row.cover} fit="fill" lazy={true} style="width: 64px; height: 64px"></el-image>;
    }
  },
  { prop: 'name', label: '商品名称' },
  { prop: 'operation', label: '操作', fixed: 'right', width: 280 }
];
const formDrawerRef = ref<typeof FormDrawer>();

const open = (cateId: number, cateName: string) => {
  drawerTitle.value = cateName;
  initParam.category_id = cateId;
  formDrawerRef.value!.open();
};

const handleDelete = (categoryGoodId: number) => {
  deleteCategoryGoods(categoryGoodId).then(() => {
    proTable.value?.getTableList().then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功'
      });
    });
  });
};

const chooseGoodsRef = ref<typeof chooseGoods>();
const openChooseGoods = () => chooseGoodsRef.value!.open();

const reloadData = () => {
  proTable.value?.getTableList();
};

defineExpose({
  open
});
</script>
