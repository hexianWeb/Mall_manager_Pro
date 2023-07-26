<template>
  <div class="content-wrapper bg-white py-1">
    <!-- header 部分 -->
    <div class="header-wrapper m-1 pl-2 flex items-center justify-start text-slate-700">
      <el-icon><Search /></el-icon>
      <!-- header 插槽 用于定义搜索标题 -->
      <span class="text font-medium pl-1">
        <slot name="header"> </slot>
      </span>
    </div>
    <!-- header 部分结束 -->

    <!-- 表单主体部分 -->
    <!-- 遍历配置项 生成配置项表单-->
    <div class="main-wrapper m-1 px-2">
      <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="isInlineEnabled" size="default">
        <el-row>
          <template v-for="option in formOptions" :key="option.label">
            <el-row v-bind="option.colLayout || colLayout">
              <form-base v-bind="option" v-model="formModel[`${option.field}`]"></form-base>
            </el-row>
          </template>
        </el-row>
      </el-form>
    </div>
    <!-- 表单主体部分结束 -->

    <!-- footer 部分 -->
    <div class="footer-wrapper mr-3">
      <el-row type="flex" justify="end" class="footer-btns">
        <el-button size="default" icon="Refresh" @click="resetClick">重置</el-button>
        <el-button size="default" type="primary" icon="Search" @click="queryClick"> 查询 </el-button>
      </el-row>
    </div>
    <!-- footer 部分结束 -->
  </div>
</template>
<script setup lang="ts">
import { IFormOption } from '../types/formItemType';
import formBase from './formBase.vue';
const emit = defineEmits(['reset', 'query', 'formChange']);
const props = defineProps({
  formOptions: {
    type: Array as PropType<IFormOption[]>,
    required: true
  },
  labelWidth: {
    type: String,
    default: () => '100px'
  },
  labelPosition: {
    type: String,
    default: () => 'right'
  },
  colLayout: {
    type: Object,
    default: () => ({
      xl: 6,
      lg: 8,
      md: 12,
      sm: 24,
      xs: 24
    })
  }
});

//获取所传递的配置项参数
const rawFormOptions = toRef(props, 'formOptions');
const formOptions: IFormOption[] = rawFormOptions.value;

const formData: any = {};
for (let option of formOptions) {
  formData[`${option.field}`] = option.defaultFieldValue;
}

const formModel = reactive(formData);
const isInlineEnabled = computed(() => (formOptions.length > 1 ? true : false));

/**
 * 重置 表单填写内容为 配置项 defaultFieldValue 所约定内容
 */
const resetClick = () => {
  for (let option of formOptions) {
    formModel[`${option.field}`] = option.defaultFieldValue;
  }
  emit('reset');
};

/**
 * 将 formData 作为 query 事件的参数 携带传递给父组件
 */
const queryClick = () => {
  emit('query', { ...formModel });
};

/**
 * 侦听表单中填写内是否的变化，若有变化则发送 formChange 事件
 */
watch(formModel, (newValue: any) => {
  emit('formChange', newValue);
});
</script>
<style lang="less" scoped>
@import '@/assets/css/_var.less';
</style>
