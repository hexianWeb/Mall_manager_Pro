<template>
  <div v-if="modelValue">
    <el-image
      v-if="typeof modelValue == 'string'"
      :src="modelValue"
      fit="cover"
      class="w-[100px] h-[100px] rounded border mr-2"
      @click="open"
      @error="handleImageLoadingError"
    ></el-image>
    <div v-else class="flex flex-wrap">
      <div class="relative w-[200px] h-[200px]" v-for="(url, index) in modelValue" :key="index">
        <el-icon
          style="position: absolute"
          class="right-0 top-0 cursor-pointer bg-white rounded-full z-10"
          size="24"
          @click="removeImage(url)"
          ><CircleClose
        /></el-icon>
        <el-image :src="url" fit="cover" class="w-[200px] h-[200px] rounded border"></el-image>
      </div>
      <div class="choose-multiple-image-btn" @click="open" v-if="modelValue.length < limit">
        <el-icon :size="25" class="text-gray-500"><Plus /></el-icon>
      </div>
    </div>
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

const props = defineProps({
  modelValue: {
    type: [String, Array<string>]
  },
  limit: {
    type: Number,
    default: () => 1
  }
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
  if (typeof props.modelValue == 'string') {
    emit('update:modelValue', imgUrl);
  } else {
    const imgsUrl: string[] = props.modelValue!;
    imgsUrl.push(imgUrl);
    emit('update:modelValue', imgsUrl);
  }
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
  emit('update:modelValue', '');
}

const removeImage = (url: string) => {
  if (typeof props.modelValue == 'object') {
    emit(
      'update:modelValue',
      props.modelValue.filter((u) => u != url)
    );
  }
};
</script>
<style scoped>
.image-header {
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
.choose-image-btn {
  @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:bg-gray-100;
}
.choose-multiple-image-btn {
  @apply w-[200px] h-[200px] rounded border flex justify-center items-center cursor-pointer hover:bg-gray-100;
}
</style>
