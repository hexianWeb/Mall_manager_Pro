<!-- VueWithTS -->
<template>
  <ProTableComponent
    ref="proTable"
    :columns="columns"
    :searchConfig="searchConfig"
    :requestApi="getUserList"
    :init-param="initParam"
  >
    <template #searchbarHeader> 用户管理 </template>
    <template #tableHeader="scope">
      <el-button type="primary" @click="handleCreate()">
        <el-icon :size="20"> <User /> </el-icon>
        <span class="pl-1">新增会员</span>
      </el-button>
    </template>
    <template #operation="scope">
      <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
      <el-popconfirm
        title="是否要删除该管理员？"
        confirmButtonText="确认"
        cancelButtonText="取消"
        @confirm="handleDeleteUserById(scope.row.id)"
      >
        <template #reference>
          <el-button text type="primary" size="small">删除</el-button>
        </template>
      </el-popconfirm>
    </template>
  </ProTableComponent>
  <FormDrawer ref="formDrawerRef" :drawerTitle="drawerTitle" @submit="handleSubmit">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <ChooseImage v-model="form.avatar" />
      </el-form-item>
      <el-form-item label="会员等级" prop="user_level_id">
        <el-select v-model="form.user_level_id" placeholder="选择会员等级">
          <el-option v-for="item in levelList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="form.phone" placeholder="手机"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="content">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="0"> </el-switch>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>
<script setup lang="tsx">
import type { ProTableInstance, ColumnProps } from '@/base-ui/ProTable/types';
import ProTableComponent from '@/base-ui/ProTable/src/index.vue';
import FormDrawer from '@/base-ui/formDrawer/FormDrawer.vue';
import ChooseImage from '@cp/chooseImage/src/index.vue';
import { searchConfig, levelList } from './config/search.conf';
import { getUserList, updateUserStatus, deleteUser, updateUser, createUser } from '@/api/user/index';
import { useInitForm } from '@/hooks/useCommon';

/**
 * 默认请求数据
 * @type {number}
 */
const DEFAULT_PAGE = 6;

/**
 * 如果表格需要初始化请求参数，直接定义传给 ProTable 之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据
 * @type {Object}
 */
const initParam = reactive({ limit: DEFAULT_PAGE });

/**
 * 表格 Column 配置（ColumnProps）配置项
 * @type {ColumnProps}
 */
const columns: ColumnProps<any>[] = [
  {
    prop: 'username',
    label: '管理员',
    width: 220,
    render({ row }) {
      return (
        <div class="flex items-center">
          <div class="avatar">
            {/* 图片加载失败时的回退行为。 */}
            <el-avatar size={60} src={row.avatar}>
              <img src="@/assets/img/notData.png" />
            </el-avatar>
          </div>
          <div class="detail ml-4">
            <p class="text-sm whitespace-nowrap" title={row.username}>
              {row.username}
            </p>
            <small class="text-xs text-zinc-400 oldstyle-nums">ID: {row.id}</small>
          </div>
        </div>
      );
    }
  },
  {
    prop: 'role',
    label: '状态',
    width: 200,
    render({ row }) {
      return (
        <el-switch
          v-model={row.status}
          size="small"
          active-value={1}
          inactive-value={0}
          onChange={() => handleUpdateUserStauts(row.id, row.status)}
        />
      );
    }
  },
  { prop: 'user_level.name', label: '会员等级', tag: true },
  { prop: 'create_time', label: '最初创建时间', width: 300 },
  { prop: 'update_time', label: '最后修改时间', width: 300 },
  { prop: 'operation', label: '操作', fixed: 'right', width: 300 }
];

/**
 *  获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
 * @type {ProTableInstance}
 */
const proTable = ref<ProTableInstance>();

const handleUpdateUserStauts = (id: number, status: 0 | 1) => {
  updateUserStatus(id, status)
    .then((res) => {
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

const handleDeleteUserById = (id: number) => {
  deleteUser(id)
    .then((res) => {
      if (res) {
        ElMessage({
          message: '删除成功',
          type: 'success'
        });
      }
    })
    .catch(() => {
      ElMessage({
        message: '非超级管理员禁止操作',
        type: 'error'
      });
    })
    .finally(() => {
      proTable.value?.getTableList();
    });
};

/*
 * FormDrawer 表单部分逻辑
 */
const { formDrawerRef, formRef, form, rules, drawerTitle, handleSubmit, handleCreate, handleEdit } = useInitForm({
  form: {
    username: '',
    password: '',
    user_level_id: null,
    status: 1,
    avatar: 'http://localhost:5173/image/notData.png',
    nickname: '',
    phone: '',
    email: ''
  },
  rules: {
    username: [
      {
        required: true,
        message: '用户名称不能为空',
        trigger: 'blur'
      }
    ],
    avatar: [
      {
        required: true,
        message: '头像不能为空',
        trigger: 'blur'
      }
    ],
    email: [
      {
        type: 'email',
        message: '请输入正确的邮箱地址',
        trigger: ['blur', 'change']
      }
    ],
    phone: [
      { min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' },
      {
        pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
        message: '请输入正确的手机号码'
      }
    ]
  },
  getData: () => proTable.value!.getTableList(),
  update: updateUser,
  create: createUser
});
</script>
<style lang="less" scoped></style>
