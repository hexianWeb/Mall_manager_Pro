<!-- VueWithTS -->
<template>
  <div class="header">
    <el-row :gutter="20">
      <el-row v-if="panelsData?.length == 0">
        <el-col :span="6" v-for="i in 4" :key="i">
          <el-skeleton style="width: 100%" animated loading>
            <template #template>
              <el-card shadow="hover" class="border-0">
                <template #header>
                  <div class="flex justify-between">
                    <el-skeleton-item variant="text" style="width: 50%" />
                    <el-skeleton-item variant="text" style="width: 10%" />
                  </div>
                </template>
                <el-skeleton-item variant="h3" style="width: 80%" />
                <el-divider />
                <div class="flex justify-between text-sm text-gray-500">
                  <el-skeleton-item variant="text" style="width: 50%" />
                  <el-skeleton-item variant="text" style="width: 10%" />
                </div>
              </el-card>
            </template>
          </el-skeleton>
        </el-col>
      </el-row>
    </el-row>
    <el-row :gutter="20">
      <el-col v-for="(panels, index) in panelsData" :key="index" :span="6">
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <template #header>
            <div class="flex justify-between text-xs text-center items-center">
              <span>{{ panels.title }}</span>
              <el-tag :type="panels.unitColor" effect="plain">{{ panels.unit }}</el-tag>
            </div>
          </template>
          <div class="text-3xl font-bold text-gray-500 text-left px-3 pt-3">
            <magicNumber :targetNumber="panels.value"> </magicNumber>
          </div>
          <el-divider></el-divider>
          <div class="flex justify-between text-sm text-center items-center py-3 pt-1 px-2">
            <span class="text-gray-500">{{ panels.subTitle }}</span>
            <span class="text-gray-500 font-semibold">{{ panels.subValue }} {{ panels?.subUnit }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <iconList />
  </div>
  <div class="middle mt-5">
    <el-row :gutter="20">
      <el-col :span="12">
        <echartIndex />
      </el-col>
      <el-col :span="12">
        <indexCard title="店铺以及商品提示" tip="请注意及时处理" :btns="goodsData" v-auth="['getStatistics2,GET']" />
        <indexCard title="交易提示" tip="需要及时处理的交易订单" :btns="orderData" />
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts" name="index">
import { getStatistics1, getStatistics2 } from '@/api/index/index';
import { Statistics1, btnItem } from '@/api/index/type';
import magicNumber from '@/base-ui/magicNumber/index.vue';
import iconList from '@cp/icon-list/src/index.vue';
import echartIndex from '@cp/echart-index/src/index.vue';
import indexCard from '@/base-ui/indexCard/index.vue';

const panelsData = ref<Statistics1[]>();

const goodsData = ref<btnItem[]>();

const orderData = ref<btnItem[]>();

getStatistics1().then((res) => {
  panelsData.value = res.panels;
});

getStatistics2().then((res) => {
  goodsData.value = res.goods;
  orderData.value = res.order;
});
</script>
<style lang="less" scoped></style>
