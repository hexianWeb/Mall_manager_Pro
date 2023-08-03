<template>
  <ProTableComponent
    ref="proTable"
    :columns="columns"
    :searchConfig="searchConfig"
    :requestApi="getManagerList"
    :init-param="initParam"
    :data-callback="dataCallBack"
  >
    <!-- 表格 header 按钮 -->
    <template #tableHeader="scope">
      <el-button type="primary" @click="handleCreate()">
        <el-icon :size="20"> <CirclePlus /> </el-icon>
        <span class="pl-1">新增用户</span>
      </el-button>
      <el-button type="primary" plain>
        <el-icon :size="20">
          <Upload />
        </el-icon>
        <span class="pl-1">批量添加用户</span>
      </el-button>
      <el-button v-auth="'export'" type="primary" plain>
        <el-icon :size="20">
          <Download />
        </el-icon>
        <span class="pl-1">导出用户数据</span>
      </el-button>
      <el-button type="primary" plain> To 子集详情页面 </el-button>
      <el-button type="danger" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
        <el-icon :size="20">
          <Delete />
        </el-icon>
        <span class="pl-1">批量删除用户</span>
      </el-button>
    </template>
    <template #operation="scope">
      <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
      <el-popconfirm
        title="是否要删除该管理员？"
        confirmButtonText="确认"
        cancelButtonText="取消"
        @confirm="handleDeleteManagerById(scope.row.id)"
      >
        <template #reference>
          <el-button text type="primary" size="small">删除</el-button>
        </template>
      </el-popconfirm>
    </template>
  </ProTableComponent>
  <FormDrawer ref="formDrawerRef" :drawer-title="drawerTitle" @submit="handleSubmit">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="头像上传">
        <template #default>
          <chooseAvatar v-model="form.avatar"></chooseAvatar>
        </template>
      </el-form-item>
      <el-form-item label="所属角色" prop="role_id">
        <el-select v-model="form.role_id" placeholder="选择所属角色">
          <el-option
            v-for="roleOption in roleOptionsList"
            :key="roleOption.id"
            :label="roleOption.name"
            :value="roleOption.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <template #default>
          <el-switch v-model="form.status" size="small" :active-value="1" :inactive-value="0"></el-switch>
        </template>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>
<script setup lang="tsx">
import type { FormInstance } from 'element-plus/es/components/form';
import type { User, UpdateUser } from '@/api/manager/type';
import type { ProTableInstance, ColumnProps } from '@/base-ui/ProTable/types';
import FormDrawer from '@/base-ui/formDrawer/FormDrawer.vue';
import ProTableComponent from '@/base-ui/ProTable/src/index.vue';
import chooseAvatar from '@cp/chooseImage/src/index.vue';
import searchConfig from './config/search.conf';
import {
  getManagerList,
  updateManagerStatusById,
  deleteManagerById,
  updateManagerInfoById,
  createManager
} from '@/api/manager/index';

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
          onChange={() => handleUpdateManagerStatus(row.id, row.status)}
        />
      );
    }
  },
  { prop: 'role.name', label: '所属角色', tag: true },
  { prop: 'create_time', label: '最初创建时间', width: 300 },
  { prop: 'update_time', label: '最后修改时间', width: 300 },
  { prop: 'operation', label: '操作', fixed: 'right', width: 300 }
];

/**
 *  获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
 * @type {ProTableInstance}
 */
const proTable = ref<ProTableInstance>();

/**
 * 修改管理员状态代码逻辑
 * @param id 修改人 ID
 * @param status 要修改的状态
 */
const handleUpdateManagerStatus = (id: number, status: number) => {
  status = status == 1 ? 0 : 1;
  updateManagerStatusById(id, status)
    .then((res: boolean) => {
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

/**
 *删除管理员 代码逻辑
 * @param id 公告 ID
 */
const handleDeleteManagerById = (id: number) => {
  deleteManagerById(id)
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
interface roleOption {
  id: number;
  name: string;
}

const formDrawerRef = ref<typeof FormDrawer | null>(null);
const formRef = ref<FormInstance>();
const roleOptionsList = ref<roleOption[]>();
const editId = ref(0);
const drawerTitle = computed(() => (editId.value ? '修改' : '新增'));

/**
 * 额外赋值逻辑 额外的赋值操作都在这里进行
 * @param res 请求返回的参数
 */
const dataCallBack = (res: any) => {
  roleOptionsList.value = res.roles;
};

const form = reactive<User>({
  username: '',
  password: '',
  role_id: 2,
  status: 0,
  avatar: ''
});

/**
 * 提交表单逻辑
 */
const handleSubmit = () => {
  formRef.value?.validate((valid) => {
    if (!valid) return;

    const fun = editId.value ? updateManagerInfoById(editId.value, form) : createManager(form);

    fun.then(() => {
      ElMessage({
        message: drawerTitle.value + '成功',
        type: 'success'
      });
      proTable.value?.getTableList();
      formDrawerRef.value!.close();
    });
  });
};

/**
 * 重置表单逻辑
 * @param row 单行表单信息
 */
function resetForm(row: any) {
  if (formRef.value) formRef.value.clearValidate();
  for (const key in form) {
    form[key] = row[key];
  }
}

/**
 * 表单验证规则
 */
const rules = {
  username: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur'
    }
  ],
  password: [
    {
      // required: true,
      message: '密码公告不能为空',
      trigger: 'blur'
    }
  ],
  role_id: [
    {
      required: true,
      message: '角色 ID 不能为空',
      trigger: 'blur'
    }
  ]
};

/**
 * 新增公告 popover 显示逻辑
 */
const handleCreate = () => {
  editId.value = 0;
  resetForm({
    username: '',
    password: '',
    role_id: 2,
    status: 0,
    avatar: ''
  });
  formDrawerRef.value!.open();
};

/**
 * 修改公告 popover 显示逻辑
 * @param row 对应行所要展示的信息
 */
const handleEdit = (row: UpdateUser) => {
  editId.value = row.id;
  resetForm(row);
  formDrawerRef.value!.open();
};
</script>
