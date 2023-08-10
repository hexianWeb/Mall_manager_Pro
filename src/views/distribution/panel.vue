<template>
  <el-row :gutter="20" class="mb-5">
    <template v-if="loading">
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
            </el-card>
          </template>
        </el-skeleton>
      </el-col>
    </template>
    <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="index">
      <el-card shadow="never">
        <div class="flex items-center">
          <div :class="item.color" class="text-back w-[40px] h-[40px] rounded-full leading-10">
            <el-icon :size="24">
              <User v-if="index == 0" />
              <ShoppingCart v-if="index == 1" />
              <PriceTag v-if="index == 2" />
              <Timer v-if="index == 3" />
            </el-icon>
          </div>
          <div class="ml-2">
            <h2 class="text-lg font-bold">{{ item.value }}</h2>
            <small class="text-xs text-gray-400">{{ item.label }}</small>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import type { Panel } from '@/api/distribution/type';
import { getAgentStatistics } from '@/api/distribution/index';

const list = ref<Panel[]>([]);
const loading = ref(false);
loading.value = true;
getAgentStatistics()
  .then((res) => {
    list.value = res.panels;
  })
  .finally(() => {
    loading.value = false;
  });
</script>
