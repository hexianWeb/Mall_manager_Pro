<template>
  <div class="flex justify-start align-middle">
    <el-tag
      style="width: 100px"
      class="mx-1"
      closable
      :disable-transitions="false"
      effect="plain"
      v-for="tag in item?.goodsSkusCardValue"
      :key="tag.goods_skus_card_id"
      @close="handleClose(tag)"
    >
      <el-input placeholder="选项值" size="small" v-model="tag.text" @change="handleChange($event, tag)"></el-input>
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="ml-1 w-20"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput"> + 添加选项值 </el-button>
  </div>
</template>

<script lang="ts" setup>
import { initSkusCardItem } from '@/hooks/useSku';

const props = defineProps({
  skuCardId: {
    type: [Number, String],
    required: true
  }
});

const { item, inputValue, inputVisible, InputRef, handleInputConfirm, showInput, handleChange, handleClose } =
  initSkusCardItem(props.skuCardId);
</script>
<style scoped>
:deep(.el-tag) {
  @apply pl-0;
}
</style>
