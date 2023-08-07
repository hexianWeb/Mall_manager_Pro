<!-- VueWithTS -->
<template>
  <div class="top flex-auto overflow-y-scroll main-container-height overflow-x-hidden">
    <el-row :gutter="20">
      <el-col :span="6" :offset="0" v-for="item in imageListData" :key="item.id">
        <el-card shadow="hover" class="m-2 p-0" @click="handlePicChecked(item)">
          <el-image
            :src="item.url"
            fit="cover"
            :lazy="true"
            class="w-full h-[150px]"
            :preview-src-list="preview ? [item.url] : []"
            :initial-index="0"
          />
          <div class="image-name">
            <p>
              {{ item.name }}
            </p>
          </div>
          <div class="flex content-center items-center justify-center p-3">
            <el-button type="primary" size="small" @click="imageRenameOperator(item)">重命名</el-button>
            <el-button type="primary" size="small" @click="imageDeletion">删除</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <div class="min-h-min">
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :pager-count="5"
      :current-page="currentPage"
      :page-size="limit"
      @current-change="getImageListData"
    />
  </div>
</template>
<script setup lang="ts">
import { getImageListByCateId, updateImageNameById } from '@/api/image/index';
import type { imageData } from '@/api/image/type';
import { confirmPopover } from '@/base-ui/confirmPopover/index';

defineProps({
  preview: {
    type: Boolean,
    required: true
  }
});

const imageListData = ref<imageData[]>([]);
const currentCateId = ref(0);
//分页器逻辑
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);

/**
 * 获取图片列表数据
 * @param {number} 当前页面
 */
function getImageListData(page: number = 1) {
  currentPage.value = page;
  getImageListByCateId(currentCateId.value, page).then((res) => {
    imageListData.value = res.list;
    total.value = res.totalCount;
  });
}

/**
 * 图片删除 popover 逻辑
 */
function imageDeletion() {
  ElMessage({
    message: '您无权删除图片！',
    type: 'warning'
  });
}

/**
 * 图片重命名 popover 逻辑
 * @param image 图片信息
 */
function imageRenameOperator(image: imageData) {
  confirmPopover('重命名当前图片', '请为图片重命名', image.name).then(({ value }) => {
    updateImageNameById(image.id, value).then((res) => {
      ElMessage({
        message: '重命名成功',
        type: 'success'
      });
      getImageListData(currentPage.value);
    });
  });
}

/**
 * 加载对应分类所属的 图片列表
 * @param id 当前图片分类的 ID
 */
const loadData = (id: number) => {
  currentCateId.value = id;
  getImageListData();
};

/**
 * 对父组件暴露部分方法
 */
defineExpose({
  loadData
});

const emit = defineEmits(['pictureChecked']);

/**
 * 获取图片 url 并传递给父组件
 * @param image 图片信息
 */
function handlePicChecked(image: imageData) {
  if (image.url == '') {
    ElMessage({
      message: '请不要选择无法正常加载的图片',
      type: 'error'
    });
  } else {
    emit('pictureChecked', image.url);
  }
}
</script>
<style lang="less" scoped>
.image-name {
  width: 100%;
  position: relative;
  overflow: hidden;
  p {
    width: 100%;
    display: inline-block;
    white-space: nowrap;
  }
}
:deep(.el-card__body) {
  padding: 0;
}
</style>
