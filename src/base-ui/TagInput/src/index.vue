<template>
  <el-tag
    v-for="tag in dynamicTags"
    :key="tag"
    class="mx-1"
    closable
    :disable-transitions="false"
    @close="handleClose(tag)"
  >
    {{ tag }}
  </el-tag>
  <el-input
    v-if="inputVisible"
    ref="InputRef"
    v-model="inputValue"
    class="ml-1"
    size="small"
    style="width: 80px"
    @keyup.enter="handleInputConfirm"
    @blur="handleInputConfirm"
  />
  <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput"> + 新增规格 </el-button>
</template>

<script lang="ts" setup>
import { ElInput } from 'element-plus';

const props = defineProps({
  modelValue: String
});

const inputValue = ref('');
const dynamicTags = ref<string[]>(props.modelValue ? props.modelValue.split(',') : []);
const inputVisible = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();
const emit = defineEmits(['update:modelValue']);

const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
  emit('update:modelValue', dynamicTags.value.join(','));
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value);
    emit('update:modelValue', dynamicTags.value.join(','));
  }
  inputVisible.value = false;
  inputValue.value = '';
};
</script>
<style lang="less" scoped></style>
