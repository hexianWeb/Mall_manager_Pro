<!-- VueWithTS -->
<template>
  <el-drawer
    v-model="showDrawer"
    :title="drawerTitle"
    :size="drawerSize"
    :close-on-click-modal="false"
    :destroy-on-close="drawerDestroyOnClose"
  >
    <div class="content">
      <div class="body">
        <slot></slot>
      </div>
      <div class="footer">
        <el-button type="primary" @click="submit">{{ drawerConfirm }}</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script setup lang="ts">
// 组件接纳属性定义
defineProps({
  // 抽屉窗口标题
  drawerTitle: {
    type: String,
    required: true
  },
  // 抽屉窗口宽度 可接受参数
  drawerSize: {
    type: [String, Number],
    default: '45%'
  },
  drawerDestroyOnClose: {
    type: Boolean,
    default: false
  },
  drawerConfirm: {
    type: String,
    default: '提交'
  }
});

const showDrawer = ref<boolean>(false);

// 打开
const open = () => (showDrawer.value = true);

// 关闭
const close = () => (showDrawer.value = false);

// 组件 emit 事件声明
const emit = defineEmits(['submit', 'cancel']);

// 提交事件
const submit = () => emit('submit');

// 取消事件
const cancel = () => emit('cancel');
// 向父组件暴露方法
defineExpose({
  open,
  close
});
</script>
<style lang="less" scoped>
.content {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
  .body {
    flex: auto;
  }
  .footer {
    display: flex;
    flex: 0 0 50px;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
