<!-- VueWithTS -->
<template>
  <el-form-item label="规格选项">
    <el-card shadow="always" class="w-full mt-2" v-for="(item, index) in sku_card_list" :key="item.id">
      <template #header>
        <div class="flex items-center justify-around">
          <el-input placeholder="规格名称" size="default" clearable v-model="item.text" @change="handleUpdate(item)">
            <template #append>
              <el-icon @click="handleChooseSku(item)"><more /></el-icon>
            </template>
          </el-input>
          <div class="flex ml-2">
            <el-button size="default" @click="sortCard('up', index)" :disabled="index == 0"
              ><el-icon><Top /></el-icon
            ></el-button>
            <el-button size="default" @click="sortCard('down', index)" :disabled="index === sku_card_list!.length - 1"
              ><el-icon><Bottom /></el-icon
            ></el-button>
            <el-popconfirm
              title="是否要删除该规格选项？"
              confirmButtonText="确认"
              cancelButtonText="取消"
              @confirm="handleDelete(item)"
            >
              <template #reference>
                <el-button size="default"
                  ><el-icon><Delete /></el-icon
                ></el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
      <!-- card body -->
      <SkuCardItem :skuCardId="item.id"></SkuCardItem>
    </el-card>
    <ChooseSku ref="ChooseSkuRef" />
    <div class="mt-2">
      <el-button type="success" size="default" @click="addSkuCardEvent">添加规格选项</el-button>
    </div>
  </el-form-item>
</template>
<script setup lang="ts">
import SkuCardItem from './SkuCardItem.vue';
import ChooseSku from './ChooseSku.vue';
import {
  sku_card_list,
  addSkuCardEvent,
  handleDelete,
  handleUpdate,
  sortCard,
  GoodsSkusCardHasText,
  handleChooseSetGoodsSkusCard
} from '@/hooks/useSku';

const ChooseSkuRef = ref<typeof ChooseSku>();
const handleChooseSku = (item: GoodsSkusCardHasText) => {
  ChooseSkuRef.value!.open((value: any) => {
    handleChooseSetGoodsSkusCard(item.id, {
      name: value.name,
      value: value.list
    });
  });
};
</script>
