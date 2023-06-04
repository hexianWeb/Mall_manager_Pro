<!-- VueWithTS -->
<template>
  <div class="main">
    <el-container class="main-content">
      <el-aside :width="isCollapse ? '62px' : '200px'">
        <navMenu :isCollapse="isCollapse" />
      </el-aside>

      <el-container class="page">
        <el-header class="page-header">
          <navHeader @foldClick="handleFoldClick" />
        </el-header>
        <el-container class="page-content">
          <el-main>
            <router-view v-slot="{ Component }">
              <transition appear mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts" setup name="main">
import navMenu from '@cp/nav-menu/src/index.vue';
import navHeader from '@cp/nav-header/src/index.vue';

const isCollapse = ref<Boolean>(false);

const handleFoldClick = (isFold: Boolean) => {
  isCollapse.value = isFold;
};
</script>
<style lang="less" scoped>
@import '@/assets/css/_var.less';

.main {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .main-content,
  .page {
    height: 100%;
  }

  .page-content {
    height: calc(100% - 48px);
  }
  .el-header {
    display: flex;
    color: #333;
    text-align: center;
    align-items: center;
    height: 48px !important;
  }

  .el-aside {
    overflow-x: hidden;
    overflow-y: auto;
    line-height: 200px;
    text-align: left;
    cursor: pointer;
    background-color: @side-bg-color;
    transition: width 0.3s linear;
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .el-main {
    color: #333;
    text-align: center;
    background-color: #f0f2f5;
  }
}

/* 下面我们会解释这些 class 是做什么的 */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
