<!-- 不套用 proTable 组件 -->
<template>
  <el-card shadow="never" class="border-0">
    <div class="flex justify-between m-3">
      <el-button type="primary" size="default" @click.stop="addCategory()" plain>增加</el-button>
      <el-button type="info" size="default" @click.stop="refreshCategory()" plain>
        <el-icon :size="20"> <Refresh /> </el-icon
      ></el-button>
    </div>
    <el-tree :data="tableData" empty-text="暂无数据" :props="{ label: 'name', children: 'child' }" node-key="id">
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <span>{{ data.name }}</span>

          <div class="ml-auto">
            <el-switch
              :modelValue="data.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange($event, data.id)"
            />
            <el-button text type="primary" size="default" @click="openGoodsDrawer(data.id, data.name)"
              >推荐商品</el-button
            >
            <el-button text type="primary" size="default" @click.stop="handleEdit(data)">修改</el-button>
            <el-button text type="primary" size="default" @click.stop="addChild(data.id)">增加</el-button>

            <el-popconfirm
              title="是否要删除该分类？"
              confirmButtonText="确认"
              cancelButtonText="取消"
              @confirm="handleDelete(data.id)"
            >
              <template #reference>
                <el-button text type="primary" size="default">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </el-tree>
    <FormDrawer ref="formDrawerRef" :drawerTitle="drawerTitle" @submit="handleSubmit" drawer-size="27%">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="分类名称"></el-input>
        </el-form-item>
      </el-form>
    </FormDrawer>
    <GoodsDrawer ref="GoodsDrawerRef" />
  </el-card>
</template>
<script setup lang="tsx">
import FormDrawer from '@/base-ui/formDrawer/FormDrawer.vue';
import GoodsDrawer from './component/GoodsDrawer.vue';
import { useTable, useInitForm } from '@/hooks/useCommon';
import {
  getCategoryList,
  updateCategory,
  createCategory,
  updateCategoryStatus,
  deleteCategory
} from '@/api/category/index';

const dataCallback = (res: any) => {};

const { tableData, getTableList } = useTable(getCategoryList, {}, false, dataCallback);

const { formDrawerRef, formRef, form, rules, drawerTitle, handleSubmit, handleCreate, handleEdit } = useInitForm({
  form: {
    name: ''
  },
  rules: {},
  getData: getTableList,
  update: updateCategory,
  create: createCategory
});

// 添加子分类
const addChild = (id: number) => {
  handleCreate();
  form.rule_id = id;
  form.status = 1;
};

const handleStatusChange = ($event: 0 | 1, cateId: number) => {
  updateCategoryStatus(cateId, $event)
    .then(() => {
      getTableList().then(() => {
        ElMessage({
          message: '修改成功',
          type: 'success'
        });
      });
    })
    .catch(() => {
      ElMessage({
        message: '仅供演示，禁止更改',
        type: 'error'
      });
    });
};

const handleDelete = (cateId: number) => {
  deleteCategory(cateId)
    .then(() => {
      getTableList().then(() => {
        ElMessage({
          message: '删除成功',
          type: 'success'
        });
      });
    })
    .catch(() => {
      ElMessage({
        message: '仅供演示，禁止更改',
        type: 'error'
      });
    });
};

/**
 * 新增分类
 */
const addCategory = () => formDrawerRef.value!.open();

/**
 * 刷新列表
 */
const refreshCategory = () => {
  getTableList();
};

const GoodsDrawerRef = ref<typeof GoodsDrawer>();
const openGoodsDrawer = (cateId: number, cateName: string) => GoodsDrawerRef.value!.open(cateId, cateName);

onMounted(() => {
  getTableList();
});
</script>

<style lang="less" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 17px;
  padding-right: 8px;
}
:deep(.el-tree-node__content) {
  padding: 20px 0;
}
</style>
