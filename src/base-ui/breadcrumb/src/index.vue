<!-- VueWithTS -->
<template>
  <div class="">
    <el-breadcrumb separator="/">
      <template v-for="breadCrumb in breadCrumbs" :key="breadCrumb.name">
        <el-breadcrumb-item v-if="breadCrumb.path" :to="{ path: breadCrumb.path }">{{
          breadCrumb.name
        }}</el-breadcrumb-item>
        <el-breadcrumb-item v-else>
          {{ breadCrumb.name }}
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>
<script setup lang="ts">
import { BreadcrumbProp } from '../types';

const props = defineProps({
  breadCrumbs: {
    type: Array as PropType<BreadcrumbProp[]>,
    required: true
  }
});
// 保证数据单项流
const breadCrumbs = computed(() => props.breadCrumbs!);
</script>
<style lang="less" scoped></style>
