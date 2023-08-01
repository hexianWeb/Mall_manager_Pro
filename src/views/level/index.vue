<template>
  <ProTableComponent ref="proTable" :columns="columns" :requestApi="getMembershipList" :init-param="initParam">
    <template #tableHeader="scope">
      <el-button type="primary" @click="handleCreate()">
        <el-icon :size="20"> <CirclePlus /> </el-icon>
        <span class="pl-1">新增会员等级</span>
      </el-button>
    </template>
    <template #operation="scope">
      <el-button type="primary" size="default" text @click="handleEdit(scope.row)">修改</el-button>
      <el-popconfirm
        title="是否要删除该规格？"
        confirmButtonText="确认"
        cancelButtonText="取消"
        @confirm="deleteSkusByIds(scope.row.id)"
      >
        <template #reference>
          <el-button text type="primary" size="default">删除</el-button>
        </template>
      </el-popconfirm>
    </template>
  </ProTableComponent>

  <FormDrawer destroyOnClose ref="formDrawerRef" :drawerTitle="drawerTitle" @submit="handleSubmit">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
      <el-form-item label="等级名称" prop="name">
        <el-input v-model="form.name" placeholder="等级名称"></el-input>
      </el-form-item>
      <el-form-item label="等级权重" prop="level">
        <el-input type="number" v-model="form.level" placeholder="等级权重"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="0"> </el-switch>
      </el-form-item>
      <el-form-item label="升级条件">
        <div class="text-left">
          <small class="text-xs mr-2">累计消费满</small>
          <el-input type="number" v-model="form.max_price" placeholder="累计消费" style="width: 50%">
            <template #append>元</template>
          </el-input>
          <small class="text-gray-400 flex"> 设置会员等级所需要的累计消费必须大于等于0,单位：元 </small>
        </div>
        <div class="text-left">
          <small class="text-xs mr-2">累计次数满</small>
          <el-input type="number" v-model="form.max_times" placeholder="累计次数" style="width: 50%">
            <template #append>%</template>
          </el-input>
          <small class="text-gray-400 flex"> 设置会员等级所需要的购买量必须大于等于0,单位：笔 </small>
        </div>
      </el-form-item>
      <el-form-item label="折扣率(%)" prop="discount">
        <el-input type="number" v-model="form.discount" placeholder="折扣率(%)" style="width: 50%">
          <template #append>%</template>
        </el-input>
        <small class="text-gray-400 flex">
          折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买
        </small>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup lang="tsx">
import type { ProTableInstance, ColumnProps } from '@/base-ui/ProTable/types';
import ProTableComponent from '@/base-ui/ProTable/src/index.vue';
import FormDrawer from '@/base-ui/formDrawer/FormDrawer.vue';
import {
  getMembershipList,
  createMembership,
  updateMembership,
  updateMembershipStatus,
  deleteMembership
} from '@/api/level/index';
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
  { prop: 'name', label: '会员等级' },
  { prop: 'discount', label: '折扣率' },
  { prop: 'level', label: '等级序号' },
  {
    prop: 'status',
    label: '状态',
    width: 200,
    render({ row }) {
      return (
        <el-switch
          v-model={row.status}
          size="default"
          active-value={1}
          inactive-value={0}
          disabled={row.super == 1}
          onChange={() => handleUpdateSkusStatus(row.id, row.status)}
        />
      );
    }
  },
  { prop: 'max_price', label: '累计消费金额', width: 200 },
  { prop: 'max_times', label: '累计消费次数', width: 200 },
  { prop: 'operation', label: '操作', fixed: 'right', width: 280 }
];

const { formDrawerRef, formRef, form, rules, drawerTitle, handleSubmit, handleCreate, handleEdit } = useInitForm({
  form: {
    name: '',
    level: 100,
    status: 1,
    discount: 0,
    max_price: 0,
    max_times: 0
  },
  rules: {
    name: [
      {
        required: true,
        message: '会员等级名称不能为空',
        trigger: 'blur'
      }
    ]
  },
  getData: () => proTable.value!.getTableList(),
  update: updateMembership,
  create: createMembership
});

const deleteSkusByIds = (id: number) => {
  deleteMembership(id)
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
  updateMembershipStatus(id, status)
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
