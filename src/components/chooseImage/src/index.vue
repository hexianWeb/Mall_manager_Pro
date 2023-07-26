<template>
  <div v-if="modelValue">
    <el-image
      :src="modelValue"
      fit="cover"
      class="w-[100px] h-[100px] rounded border mr-2"
      @click="open"
      @error="handleImageLoadingError"
    ></el-image>
  </div>

  <div class="choose-image-btn" @click="open" v-else>
    <el-icon :size="25" class="text-gray-500"><Plus /></el-icon>
  </div>
  <el-dialog title="选择图片" v-model="dialogVisible" width="80%" top="5vh">
    <el-container class="bg-white rounded" style="height: 70vh">
      <el-container>
        <imageList @picture-checked="getSelectedImage" :preview="false"></imageList>
      </el-container>
    </el-container>
  </el-dialog>
</template>
<script setup lang="ts">
import imageList from '@/views/image/list.vue';

defineProps({
  modelValue: String
});
/**
 * 图片选择 dialog 显示与隐藏
 */
const dialogVisible = ref(false);
const open = () => (dialogVisible.value = true);
const close = () => (dialogVisible.value = false);

const emit = defineEmits(['update:modelValue']);
/**
 * 获取所选图片的地址
 * @param imgUrl 所选图片的地址
 */
function getSelectedImage(imgUrl: string) {
  emit('update:modelValue', imgUrl);
  close();
}

/**
 * 图片加载失败
 */
function handleImageLoadingError() {
  ElMessage({
    message: '因为不可抗力因素，这个图片消失啦',
    type: 'error'
  });
  avatarUrl.value = '';
}
</script>
<style>
.image-header {
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
.choose-image-btn {
  @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:bg-gray-100;
}
</style>
