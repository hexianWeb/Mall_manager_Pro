<template>
  <el-upload
    class="upload-demo"
    drag
    :action="UPLOADER_IMAGE_URL"
    multiple
    :headers="{
      token
    }"
    name="img"
    :data="data"
    :on-success="onUploadSuccess"
    :on-error="onUploadError"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">拖动文件或<em>点击上传</em></div>
    <template #tip>
      <div class="el-upload__tip">图片大小不得超过 500 kb</div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { useCookies } from '@vueuse/integrations/useCookies';
import { UploadFilled } from '@element-plus/icons-vue';
import { UPLOADER_IMAGE_URL, USER_PERMISSION_KEY } from '@/constants/cache_keys';
const token = useCookies().get(USER_PERMISSION_KEY);

defineProps({
  data: {
    type: Object,
    required: true
  }
});

/**
 * 注册 emit 事件
 */
const emit = defineEmits(['success', 'failed']);

/**
 * 上传成功的钩子
 * @param response
 * @param uploadFile
 * @param uploadFiles
 */
function onUploadSuccess(response: any, uploadFile: UploadFile, uploadFiles: UploadFiles): void {
  console.log(response, uploadFile, uploadFiles);

  emit('success', {
    response,
    uploadFile,
    uploadFiles
  });
}

/**
 * 上传失败的钩子
 * @param error
 * @param uploadFile
 * @param uploadFiles
 */
function onUploadError(error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles): void {
  let msg = JSON.parse(error.message).mes || '上传失败';
  ElMessage({
    message: msg,
    type: 'error'
  });
}
</script>
