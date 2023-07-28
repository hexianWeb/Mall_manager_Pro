<!-- VueWithTS -->
<template>
  <ProTableComponent :searchConfig="searchConfig" :requestApi="getManagerList" :init-param="initParam">
    <!-- 表格 header 按钮 -->
    <template #tableHeader="scope">
      <el-button type="primary" @click="openDrawer('新增')">
        <el-icon :size="20"> <CirclePlus /> </el-icon>
        <span class="pl-1">新增用户</span>
      </el-button>
      <el-button type="primary" plain @click="batchAdd">
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
  </ProTableComponent>
  <!-- <FormDrawer ref="formDrawerRef" :drawer-title="drawerTitle" @submit="handleSubmit">
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
  </FormDrawer> -->
</template>
<script setup lang="ts">
import searchConfig from './config/search.conf';
import ProTableComponent from '@/base-ui/ProTable/src/index.vue';
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

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ limit: DEFAULT_PAGE });

//  * FormDrawer 表单部分逻辑
//  */
// interface roleOption {
//   id: number;
//   name: string;
// }
// const formDrawerRef = ref<typeof FormDrawer | null>(null);
// const formRef = ref<FormInstance>();
// const roleOptionsList = ref<roleOption[]>();

// const form = reactive<User>({
//   username: '',
//   password: '',
//   role_id: 2,
//   status: 0,
//   avatar: ''
// });
// /**
//  * 提交表单逻辑
//  */
// const handleSubmit = () => {
//   formRef.value?.validate((valid) => {
//     if (!valid) return;

//     const fun = editId.value ? updateManagerInfoById(editId.value, form) : createManager(form);

//     fun.then(() => {
//       ElMessage({
//         message: drawerTitle.value + '成功',
//         type: 'success'
//       });
//       // 修改刷新当前页，新增刷新第一页
//       getTableList(editId.value ? false : 1);
//       formDrawerRef.value!.close();
//     });
//   });
// };

// /**
//  * 重置表单逻辑
//  * @param row 单行表单信息
//  */
// function resetForm(row: any) {
//   if (formRef.value) formRef.value.clearValidate();
//   for (const key in form) {
//     form[key] = row[key];
//   }
// }

// /**
//  * 表单验证规则
//  */
// const rules = {
//   username: [
//     {
//       required: true,
//       message: '用户名不能为空',
//       trigger: 'blur'
//     }
//   ],
//   password: [
//     {
//       required: true,
//       message: '密码公告不能为空',
//       trigger: 'blur'
//     }
//   ],
//   role_id: [
//     {
//       required: true,
//       message: '角色 ID 不能为空',
//       trigger: 'blur'
//     }
//   ]
// };

// /**
//  * 头像 URL 获取逻辑
//  */

// const editId = ref(0);
// const drawerTitle = computed(() => (editId.value ? '修改' : '新增'));

// /**
//  * 新增公告 popover 显示逻辑
//  */
// const handleCreate = () => {
//   editId.value = 0;
//   resetForm({
//     username: '',
//     password: '',
//     role_id: 2,
//     status: 0,
//     avatar: ''
//   });
//   formDrawerRef.value!.open();
// };

// /**
//  * 修改公告 popover 显示逻辑
//  * @param row 对应行所要展示的信息
//  */
// const handleEdit = (row: UpdateUser) => {
//   console.log(row);

//   editId.value = row.id;
//   resetForm(row);
//   formDrawerRef.value!.open();
// };
</script>
<style lang="less" scoped></style>
