<template>
  <ProTableComponent ref="proTable" :columns="columns" :requestApi="getSkusList" :init-param="initParam">
    <template #tableHeader="scope">
      <el-button type="primary" @click="handleCreate()">
        <el-icon :size="20"> <CirclePlus /> </el-icon>
        <span class="pl-1">新增规格</span>
      </el-button>
      <el-popconfirm
        title="是否要删除该规格？"
        confirmButtonText="确认"
        cancelButtonText="取消"
        @confirm="deleteSkusByIds(scope.selectedListIds)"
      >
        <template #reference>
          <el-button type="danger" plain :disabled="!scope.isSelected">
            <el-icon :size="20">
              <Delete />
            </el-icon>
            <span class="pl-1">批量删除用户</span>
          </el-button>
        </template>
      </el-popconfirm>
    </template>
    <template #operation="scope">
      <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
      <el-popconfirm
        title="是否要删除该规格？"
        confirmButtonText="确认"
        cancelButtonText="取消"
        @confirm="deleteSkusByIds([scope.row.id])"
      >
        <template #reference>
          <el-button text type="primary" size="small">删除</el-button>
        </template>
      </el-popconfirm>
    </template>
  </ProTableComponent>

  <FormDrawer destroyOnClose ref="formDrawerRef" :drawerTitle="drawerTitle" @submit="handleSubmit">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
      <el-form-item label="规格名称" prop="name">
        <el-input v-model="form.name" placeholder="规格名称"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number v-model="form.order" :min="0" :max="1000"> </el-input-number>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="0"> </el-switch>
      </el-form-item>
      <el-form-item label="规格值" prop="default">
        <TagInput v-model="form.default" />
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup lang="tsx">
import type { ProTableInstance, ColumnProps } from '@/base-ui/ProTable/types';
import ProTableComponent from '@/base-ui/ProTable/src/index.vue';
import FormDrawer from '@/base-ui/formDrawer/FormDrawer.vue';
import TagInput from '@/base-ui/TagInput/src/index.vue';
import { getSkusList, createSkus, updateSkus, updateSkusStatus, deleteSkus } from '@/api/skus/index';
import { useInitForm } from '@/hooks/useCommon';
/**
 * 如果表格需要初始化请求参数，直接定义传给 ProTable 之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据
 * @type {Object}
 */
const initParam = reactive({});

/**
 *  获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
 * @type {ProTableInstance}
 */
const proTable = ref<ProTableInstance>();

/**
 * ProTable 配置项
 */
const columns: ColumnProps<any>[] = [
  { type: 'selection', fixed: 'left', width: 50 },
  { prop: 'name', label: '规格名称' },
  { prop: 'default', label: '规格值', width: 300 },
  { prop: 'order', label: '排序' },
  {
    prop: 'status',
    label: '状态',
    width: 200,
    render({ row }) {
      return (
        <el-switch
          v-model={row.status}
          size="small"
          active-value={1}
          inactive-value={0}
          disabled={row.super == 1}
          onChange={() => handleUpdateSkusStatus(row.id, row.status)}
        />
      );
    }
  },
  { prop: 'create_time', label: '最初创建时间', width: 200 },
  { prop: 'update_time', label: '最后修改时间', width: 200 },
  { prop: 'operation', label: '操作', fixed: 'right', width: 280 }
];

const { formDrawerRef, formRef, form, rules, drawerTitle, handleSubmit, handleCreate, handleEdit } = useInitForm({
  form: {
    name: '',
    status: 1,
    default: '',
    order: 50
  },
  rules: {
    name: [
      {
        required: true,
        message: '规格名称不能为空',
        trigger: 'blur'
      }
    ],
    default: [
      {
        required: true,
        message: '规格值不能为空',
        trigger: 'blur'
      }
    ]
  },
  getData: () => proTable.value!.getTableList(),
  update: updateSkus,
  create: createSkus
});

const deleteSkusByIds = (ids: string[]) => {
  deleteSkus(ids)
    .then(() => {
      ElMessage({
        message: '删除成功',
        type: 'success'
      });
      proTable.value!.getTableList();
    })
    .catch((err) => {
      ElMessage({
        message: err.msg,
        type: 'error'
      });
    });
};

/**
 * 修改管理员状态代码逻辑
 * @param id 修改人 ID
 * @param status 要修改的状态
 */
const handleUpdateSkusStatus = (id: number, status: 0 | 1) => {
  updateSkusStatus(id, status)
    .then((res: any) => {
      if (res) {
        ElMessage({
          message: '更新成功',
          type: 'success'
        });
      }
    })
    .catch(() => {
      ElMessage({
        message: '非超级管理员禁止操作',
        type: 'error'
      });
    });
};
</script>
