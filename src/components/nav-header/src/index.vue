<!-- VueWithTS -->
<template>
  <div class="nav-header">
    <div class="left-wrapper">
      <el-icon :size="30" @click="handleFoldClick">
        <component :is="isFold ? 'Expand' : 'Fold'"></component>
      </el-icon>
      <el-icon :size="30" @click="handleFullSizeChange">
        <component :is="isFullscreen ? 'Crop' : 'FullScreen'"></component>
      </el-icon>
      <el-icon :size="30" @click="handleRefresh"><Refresh /></el-icon>
      <!-- 面包屑 -->
      <div class="brand">
        <!-- <breadComponent :breadCrumbs="breadcrumbs"></breadComponent> -->
      </div>
    </div>

    <div class="right-wrapper">
      <el-icon :size="20"><ChatDotRound /></el-icon>
      <el-icon :size="20"><CollectionTag /></el-icon>
      <el-icon :size="20"><Paperclip /></el-icon>
      <el-space wrap>
        <el-tag>等级</el-tag>
      </el-space>
      <el-avatar :size="32" class="mr-3" :src="userInfo!.avatar" />
      <el-dropdown @command="handleCommand">
        <span class="text-sm" style="color: var(--el-text-color-regular)"> 用户信息 </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logOutSystem">登出系统</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <!-- 修改密码 -->
    <form-drawer
      drawer-title="修改密码"
      ref="formDrawerRef"
      @submit="handleSendForm"
      @cancel="handleCancelChangePassword"
    >
      <el-form
        ref="formPasswordRef"
        label-position="right"
        label-width="100px"
        :model="formPassword"
        :rules="rulesPassWord"
      >
        <el-form-item label="旧密码" prop="oldpassword">
          <el-input v-model="formPassword.oldpassword" />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="formPassword.password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
          <el-input v-model="formPassword.repassword" />
        </el-form-item>
      </el-form>
    </form-drawer>
  </div>
</template>
<script setup lang="ts" name="nav-header">
// import breadComponent, { BreadcrumbProp } from '@/base-ui/breadcrumb/index';
import type { FormInstance, FormRules } from 'element-plus';
import FormDrawer from '@/base-ui/formDrawer/FormDrawer.vue';
import { useUserStore } from '@/stores/modules/login';
import { useFullscreen } from '@vueuse/core';
import { updatePassword } from '@/api/admin';
const route = useRoute();

const userStore = useUserStore();

const userInfo = userStore.getUserInfo;

// 伸缩按钮逻辑
const emit = defineEmits(['foldClick']);
const isFold = ref<Boolean>(false);
const handleFoldClick = () => {
  isFold.value = !isFold.value;
  emit('foldClick', isFold.value);
};

// 全屏按钮逻辑
const { isFullscreen, toggle } = useFullscreen();
const handleFullSizeChange = () => toggle();

// 刷新按钮逻辑
const handleRefresh = () => location.reload();

// 用户菜单功能触发逻辑
const handleCommand = (command: string) => {
  switch (command) {
    case 'changePassword':
      formDrawerRef.value?.open();
      break;
    case 'logOutSystem':
      handleLogOut();
      break;
    default:
      break;
  }
};

// 右侧修改密码框逻辑
const formDrawerRef: Ref<typeof FormDrawer | null> = ref(null);

const formPasswordRef = ref<FormInstance>();

const formPassword = reactive({
  oldpassword: '',
  password: '',
  repassword: ''
});

const rulesPassWord = reactive<FormRules>({
  oldpassword: [
    {
      required: true,
      message: '旧密码不能为空',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '新密码不能为空',
      trigger: 'blur'
    }
  ],
  repassword: [
    {
      required: true,
      message: '新密码不能为空',
      trigger: 'blur'
    }
  ]
});

const handleSendForm = () => {
  if (!formPasswordRef) return;
  formPasswordRef.value!.validate((valid) => {
    if (valid) {
      updatePassword(formPassword)
        .then((res) => {
          ElMessage({
            message: '修改密码成功',
            type: 'success'
          });
        })
        .finally(() => {
          userStore.$reset;
          handleLogOut();
        });
    } else {
      ElMessage({
        message: '输入信息格式错误',
        type: 'error'
      });
    }
  });
};

const handleCancelChangePassword = () => {
  formDrawerRef.value?.close();
  formPasswordRef.value?.resetFields();
};

const handleLogOut = () => {
  ElMessage({
    message: '您尚未拥有修改密码的权利',
    type: 'error'
  });
};
</script>
<style lang="less" scoped>
.nav-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  .left-wrapper {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-start;
    .brand {
      padding-left: 13px;
    }
    .el-icon {
      padding: 5px;
    }
  }
  .right-wrapper {
    display: flex;
    flex: 0 0 300px;
    align-items: end;
    justify-content: flex-end;
    padding: 3px;
    .el-icon {
      margin: 5px;
    }
    .text-sm {
      cursor: pointer;
      margin: 0 7px;
      font-size: 16px;
      vertical-align: bottom;
    }
  }
}
</style>
