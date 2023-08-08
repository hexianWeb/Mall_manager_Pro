<template>
  <el-dialog title="商品选择" v-model="dialogVisible" width="80%" destroy-on-close>
    <ProTableComponent
      ref="proTable"
      :searchConfig="searchConfig"
      :requestApi="getGoodsList"
      :init-param="initParam"
      :columns="columns"
    >
      <template #searchbarHeader> 请选择关联商品 </template>
      <template #tableHeader="scope">
        <el-button type="success" plain @click="handleConnect(scope.selectedListIds)" :disabled="!scope.isSelected">
          <el-icon :size="20"> <Bell /> </el-icon>
          <span class="pl-1">关联此批商品</span>
        </el-button>
      </template>
    </ProTableComponent>
  </el-dialog>
</template>
<script setup lang="tsx">
import type { ProTableInstance, ColumnProps } from '@/base-ui/ProTable/types';
import { searchConfig } from '../config/search.conf';
import { getGoodsList } from '@/api/goods/index';
import { connectCategoryGoods } from '@/api/category/index';
import ProTableComponent from '@/base-ui/ProTable/src/index.vue';

const props = defineProps({
  categoryId: {
    type: Number,
    required: true
  }
});
/**
 * 如果表格需要初始化请求参数，直接定义传给 ProTable 之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据
 * @type {Object}
 */
const initParam = reactive({ tab: 'all', limit: 3 });

/**
 * 表格 Column 配置（ColumnProps）配置项
 * @type {ColumnProps}
 */
const columns: ColumnProps<any>[] = [
  { type: 'selection', width: 55 },
  {
    prop: 'title',
    label: '商品',
    render({ row }) {
      return (
        <div class="flex items-center">
          <div class="good flex">
            {/* 图片加载失败时的回退行为。 */}
            <el-image src={row.cover} fit="cover" lazy={true} class="mr-3 rounded" style="width:150px;height: 120px;">
              <template /* error */>
                <img src="@/assets/img/notData.png" />
              </template>
            </el-image>
            <div class="flex-1">
              <p>{row.title}</p>
              <div>
                <span class="text-rose-500">最低销售价￥{row.min_price}</span>
                <el-divider direction="vertical" />
                <span class="text-teal-500 text-xxs">原价￥{row.min_oprice}</span>
              </div>
              <p class="text-gray-400 text-xxs">分类:{row.category ? row.category.name : '未分类'}</p>
              <p class="text-gray-400 text-xxs">创建时间：{row.create_time}</p>
            </div>
          </div>
        </div>
      );
    }
  },
  { prop: 'sale_count', label: '实际销量', width: 120 },
  {
    prop: 'status',
    label: '商品状态',
    width: 120,
    render({ row }) {
      return (
        <el-tag type={row.status ? 'success' : 'danger'} size="default">
          {row.status ? '上架' : '仓库'}
        </el-tag>
      );
    }
  },
  { prop: 'stock', label: '总库存', width: 120 },
  { prop: 'desc', label: '商品描述', width: 240 }
];
const dialogVisible = ref(false);

const open = () => {
  dialogVisible.value = true;
};

const close = () => {
  dialogVisible.value = false;
};

const emit = defineEmits(['reload']);
const reloadData = () => {
  emit('reload');
};
const handleConnect = (ids: string[]) => {
  connectCategoryGoods({
    category_id: props.categoryId,
    goods_ids: ids
  }).then(() => {
    ElMessage({
      type: 'success',
      message: '关联成功'
    });
    reloadData();
    close();
  });
};
defineExpose({
  open
});
</script>
