<!-- VueWithTS -->
<template>
  <div class="container bg-white rounded h-5/6 m-3">
    <el-container class="h-full rounded">
      <el-header>
        <div class="header flex justify-start p-3 pl-1">
          <el-button type="primary" @click="cateDialogAddtorShow()">新增图片分类</el-button>
        </div>
      </el-header>
      <el-container class="h-5/6">
        <el-aside width="280px" class="flex flex-col rounded">
          <div class="top flex-auto overflow-y-scroll =">
            <div v-for="image in imageCatListData" :key="image.id">
              <div class="aside-list" :class="activatedId === image.id ? 'active' : ''">
                <span class="cat-title flex-auto w-72 text-stone-500"> {{ image.name }} </span>
                <span class="flex flex-auto w-28 items-center justify-between text-sky-500">
                  <el-icon :size="24">
                    <Edit @click="cateDialogEditorShow(image)" />
                  </el-icon>
                  <el-icon :size="24">
                    <CloseBold />
                  </el-icon>
                </span>
              </div>
            </div>
          </div>
          <div class="bottom min-h-min">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="total"
              :pager-count="5"
              :current-page="currentPage"
              :page-size="limit"
              @current-change="getCateData"
            />
          </div>
        </el-aside>
        <el-main class="flex flex-col rounded">
          <div class="top flex-auto overflow-y-scroll main-container-height">
            <div v-for="(a, index) in 100" :key="index">{{ a }}</div>
          </div>
          <div class="min-h-min">
            <el-pagination background layout="prev, pager, next" :total="100" />
          </div>
        </el-main>
      </el-container>
    </el-container>

    <!-- 表单部分 -->
    <FormDrawer
      drawerSize="30%"
      :drawerTitle="drawerTitle"
      ref="formDrawerRef"
      @submit="handleCateSubmit"
      @cancel="CateDialogClose"
    >
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false" size="default">
        <el-form-item label="图库分类" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="255" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup lang="ts">
import { getImageCatList, addImageCate, updateImageCate, deleteImageCate } from '@/api/image/cat';
import type { ImageCatList, ImageCatData } from '@/api/image/cat/type';
import FormDrawer from '@/base-ui/formDrawer/FormDrawer.vue';
import { FormInstance } from 'element-plus/es/components/form';

// 右侧图片类别栏位逻辑
const imageCatListData = ref<ImageCatList>();
const activatedId = ref(0);

//分页器逻辑
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);

/**
 * 获取图片分类数据
 */
function getCateData(p?: number | undefined) {
  if (typeof p == 'number') {
    currentPage.value = p;
  }
  getImageCatList(currentPage.value, limit.value).then((res) => {
    imageCatListData.value = res.list;
    total.value = res.totalCount;
    activatedId.value = res.list[0].id;
  });
}

getCateData();

//图片分类 dialog 框显示控制逻辑
const formDrawerRef: Ref<typeof FormDrawer | null> = ref(null);
const formRef = ref<FormInstance>();
const drawerTitle = ref<'新增图片分类' | '修改图片分类' | ''>('');

/**
 * 提交图片分类表单请求
 */
function handleCateSubmit() {
  formRef.value?.validate((isValid) => {
    // 是否通过验证规则
    if (!isValid) {
      return;
    }
    const promiseInstance = form.id ? updateImageCate(form.id, form) : addImageCate(form);
    promiseInstance.then(() => {
      ElMessage({
        message: '操作成功',
        type: 'success'
      });
      getCateData();
      CateDialogClose();
    });
  });
}

/**
 * 新增图片分类的 dialog 展示
 */
const cateDialogAddtorShow = () => {
  drawerTitle.value = '新增图片分类';
  form.id = 0;
  form.name = '';
  form.order = 50;
  formDrawerRef.value?.open();
};

/**
 * 修改图片分类的 dialog 展示
 */
function cateDialogEditorShow(image: ImageCatData) {
  drawerTitle.value = '修改图片分类';
  form.id = image.id;
  form.name = image.name;
  form.order = image.order;
  formDrawerRef.value?.open();
}

/**
 * 关闭图片分类 dialog
 */
const CateDialogClose = () => formDrawerRef.value?.close();

//图片分类页面数据管理
const form = reactive({
  id: 0,
  name: '',
  order: 50
});

const rules = {
  name: [
    {
      required: true,
      message: '图库分类名称不得为空',
      trigger: 'blur'
    }
  ]
};
</script>
<style lang="less" scoped>
:deep(.el-main) {
  display: flex;
  overflow: hidden;
}

.aside-list {
  cursor: pointer;
  @apply flex p-3;
}
.aside-list:hover,
.active {
  @apply bg-sky-100;
}
</style>
