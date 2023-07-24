<!-- VueWithTS -->
<template>
  <div class="top flex-auto overflow-y-scroll main-container-height overflow-x-hidden">
    <el-row :gutter="20">
      <el-col :span="6" :offset="0" v-for="item in imageListData" :key="item.id">
        <el-card shadow="hover" class="m-2 p-0">
          <el-image
            :src="item.url"
            fit="cover"
            :lazy="true"
            class="w-full h-[150px]"
            :preview-src-list="[item.url]"
            :initial-index="0"
          />
          <div class="image-name">
            <p>
              {{ item.name }}
            </p>
          </div>
          <div class="flex content-center items-center justify-center p-3">
            <el-button type="primary" size="small">重命名</el-button>
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
      @current-change="getImageListByCateId"
    />
  </div>
</template>
<script setup lang="ts">
import { getImageListByCateId } from '@/api/image/index';
import type { imageData } from '@/api/image/type';
// 由于父子组件生命周期缘故 你不能通过传递父组件请求的数据来作为请求子组件数据的条件
// const props = defineProps({
//   cateId: {
//     type: Number,
//     required: true
//   }
// });
const imageListData = ref<imageData[]>([]);
//分页器逻辑
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);

/**
 * 获取图片列表数据
 * @param {number} 当前页面
 */
function getImageListData(cateId: number, page?: number | undefined) {
  if (typeof page == 'number') {
    currentPage.value = page;
  }
  getImageListByCateId(cateId, page).then((res) => {
    imageListData.value = res.list;
    total.value = res.totalCount;
  });
}

/**
 * 图片删除逻辑
 */
function imageDeletion() {
  ElMessage({
    message: '您无权删除图片！',
    type: 'warning'
  });
}
/**
 * 加载对应分类所属的 图片列表
 * @param id 当前图片分类的 ID
 */
const loadData = (id: number) => {
  getImageListData(id);
};

defineExpose({
  loadData
});
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
