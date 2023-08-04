<template>
  <FormDrawer ref="formDrawerRef" drawerTitle="设置商品详情" drawerSize="60%" @submit="submit" destroy-on-close>
    <el-form :model="form">
      <el-form-item>
        <Editor v-model="form.content" />
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>
<script setup lang="ts">
import type { NewGoodInfo } from '@/api/goods/type';
import FormDrawer from '@/base-ui/formDrawer/FormDrawer.vue';
import Editor from '@cp/editor/src/index.vue';
import { readGood, updateGoods } from '@/api/goods/index';

const formDrawerRef = ref<typeof FormDrawer>();

const form = reactive({
  content: ''
});

const goodsId = ref(0);
const open = (row: NewGoodInfo) => {
  goodsId.value = Number(row.id);
  readGood(goodsId.value).then((res) => {
    form.content = res.content;
    formDrawerRef.value!.open();
  });
};
const emit = defineEmits(['reloadData']);

const submit = () => {
  updateGoods(goodsId.value, form).then(() => {
    ElMessage({
      message: '设置商品详情成功',
      type: 'success'
    });
    emit('reloadData');
    formDrawerRef.value!.close();
  });
};

defineExpose({
  open
});
</script>
