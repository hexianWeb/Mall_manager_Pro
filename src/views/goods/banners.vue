<template>
  <el-drawer title="设置轮播图" v-model="dialogVisible" size="50%" destroy-on-close>
    <el-form :model="form" label-width="80px">
      <el-form-item label="轮播图">
        <ChooseImage :limit="9" v-model="form.banners" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" :loading="loading" size="large">提交</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script setup lang="ts">
import type { NewGoodInfo } from '@/api/goods/type';
import ChooseImage from '@cp/chooseImage/src/index.vue';
import { readGood, setGoodsBanner } from '@/api/goods/index';

const dialogVisible = ref(false);

const form = reactive<{ banners: string[] }>({
  banners: []
});

const goodsId = ref(0);

const open = (row: NewGoodInfo) => {
  goodsId.value = Number(row.id);
  readGood(goodsId.value).then((res) => {
    form.banners = res.goodsBanner.map((item) => item.url);
    dialogVisible.value = true;
  });
};

const emit = defineEmits(['reloadData']);

const loading = ref(false);
const submit = () => {
  loading.value = true;
  setGoodsBanner(goodsId.value, form.banners)
    .then((res) => {
      console.log(res);
      ElMessage({
        type: 'success',
        message: '设置轮播图成功'
      });
      dialogVisible.value = false;
      emit('reloadData');
    })
    .finally(() => {
      loading.value = false;
    });
};

defineExpose({
  open
});
</script>
