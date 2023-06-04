<!-- VueWithTS -->
<template>
  <div class="content">
    <div class="slice-menu">
      <!-- Logo 部分-->
      <div class="logo">
        <img class="img" src="@/assets/img/logo.png" alt="logo" />
        <span class="title" v-show="!isCollapse">商城后台管理</span>
      </div>
      <!-- 菜单部分 -->
      <el-menu
        :unique-opened="false"
        :default-active="currentActiveMenuIndex"
        class="el-menu-vertical"
        active-text-color="#ffd04b"
        background-color="#001529"
        text-color="#B7BDC3"
        :collapse="isCollapse"
      >
        <template v-for="menu in menus" :key="menu.id">
          <!-- CASE1： 一级菜单 -->
          <el-menu-item v-if="!(menu.child && menu.child.length)" :index="menu.id + ''">
            <el-icon :size="20"> <component :is="menu.icon"></component> </el-icon>
            <span>{{ menu.name }}</span>
          </el-menu-item>
          <!-- CASE2:二级菜单 -->
          <el-sub-menu v-else :index="menu.id + ''">
            <template #title>
              <el-icon :size="20">
                <component :is="menu.icon"></component>
              </el-icon>
              <span>{{ menu.name }}</span>
            </template>
            <template v-for="submenu in menu.child" :key="submenu.id">
              <!-- 绑定路由跳转事件在二级菜单上 -->
              <el-menu-item :index="submenu.id + ''" @click="handleItemClick(submenu)">
                <el-icon :size="20">
                  <component :is="submenu.icon"></component>
                </el-icon>
                {{ submenu.name }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
  </div>
</template>
<script setup lang="ts" name="nav-menu">
import { useUserStore } from '@/stores/modules/login';
import { Menu } from '@/stores/modules/login/type';
import { isUrl } from '@/utils/common';
import { getMenuByPath } from '@/utils/menu';

// 父子组件传值 伸展
defineProps({
  isCollapse: {
    type: Boolean,
    defalut: false,
    require: true
  }
});

// // 获取menus数据
const menus = useUserStore().getMenus;

const router = useRouter();

const route = useRoute();

const currentActiveMenuIndex = ref<String>('');

// 监听路由地址是否存在变化
watch(
  () => route.path,
  () => {
    _selectCurrentMenu();
  }
);

// 挂载时 根据当前URL已有的路径 获取相应MENU
onMounted(() => {
  _selectCurrentMenu();
});

const _selectCurrentMenu = () => {
  const currentMenu = getMenuByPath(menus as Menu[], route.path) as Menu;
  currentActiveMenuIndex.value = String(`${currentMenu?.id}`);
};

// 菜单项点击跳转逻辑
const handleItemClick = (subMenu: Menu) => {
  currentActiveMenuIndex.value = String(subMenu.id);
  if (isUrl(subMenu.frontpath!)) {
    window.open(subMenu.frontpath as string);
  } else {
    router.push({
      path: subMenu.frontpath || '/notfound'
    });
  }
};
</script>
<style lang="less" scoped>
@import '@/assets/css/_var.less';

// less 混合模式
.selectActiveColor {
  color: white !important;
}
.slice-menu {
  cursor: pointer;
  height: 100%;
  .logo {
    display: flex;
    height: 28px;
    padding: 10px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .img {
      height: 100%;
      margin: 0 10px;
    }
    .title {
      font-size: 16px;
      font-weight: 700;
      color: white;
    }
  }
  .el-menu-vertical {
    .el-menu-item {
      padding-left: 50px !important;
      background-color: @side-lighten-bg-color !important;
      &:hover {
        background-color: #2c3e50 !important;
      }
      .is-active {
        background-color: #2c3e50 !important;
      }
    }
  }
}
</style>
