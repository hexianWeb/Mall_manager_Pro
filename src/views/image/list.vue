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
            <div v-for="image in imageCateListData" :key="image.id">
              <div class="aside-list" :class="activatedId === image.id ? 'active' : ''" @click="activatedId = image.id">
                <span class="cat-title flex-auto w-72 text-stone-500"> {{ image.name }} </span>
                <span class="flex flex-auto w-28 items-center justify-between text-sky-500">
                  <el-icon :size="24">
                    <Edit @click="cateDialogEditorShow(image)" />
                  </el-icon>
                  <el-popconfirm title="您确定要删除这个图片分类吗？" @confirm="cateDialogDeletorShow(image.id)">
                    <template #reference>
                      <el-icon :size="24">
                        <CloseBold />
                      </el-icon>
                    </template>
                  </el-popconfirm>
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
          <mainContainer ref="mainContainRef"></mainContainer>
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
import { getImageCatList, addImageCate, updateImageCate, deleteImageCate } from '@/api/image/index';
import type { ImageCatList, ImageCatData } from '@/api/image/type';
import FormDrawer from '@/base-ui/formDrawer/FormDrawer.vue';
import { FormInstance } from 'element-plus/es/components/form';
import mainContainer from './mainContainer.vue';
// 右侧图片类别栏位逻辑
const imageCateListData = ref<ImageCatList>();
const activatedId = ref<number>(0);

//分页器逻辑
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);

/**
 * 获取图片分类数据
 */
function getCateData(page?: number | undefined) {
  if (typeof page == 'number') {
    currentPage.value = page;
  }
  getImageCatList(currentPage.value, limit.value).then((res) => {
    imageCateListData.value = res.list;
    total.value = res.totalCount;
    activatedId.value = res.list[0].id;
  });
}

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
      ElNotification({
        title: '当前操作',
        message: '操作成功',
        type: 'success'
      });
      getCateData(currentPage.value);
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
 * 删除图片分类相关逻辑
 * @param 图片分类 ID
 */
function cateDialogDeletorShow(id: number) {
  deleteImageCate(id).then((res) => {
    ElNotification({
      title: '已删除',
      message: '删除操作成功',
      type: 'error'
    });
    getCateData(currentPage.value);
  });
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

// 图片列表逻辑 在左侧图片分类 activatedId 更改时发送一次数据请求
const mainContainRef: Ref<typeof mainContainer | null> = ref(null);
watch(activatedId, () => {
  mainContainRef.value!.loadData(activatedId.value);
});

onMounted(() => {
  getCateData();
});
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
