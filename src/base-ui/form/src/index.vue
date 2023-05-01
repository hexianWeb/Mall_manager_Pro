<template>
  <div class="content-wrapper">
    <div class="header-wrapper">
      <el-icon><Search /></el-icon>
      <span class="text">
        <slot name="header"> </slot>
      </span>
    </div>
    <!-- 表单空间 -->
    <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" size="default">
      <el-row>
        <template v-for="option in formOptions" :key="option.label">
          <el-row v-bind="option.colLayout || colLayout">
            <form-base v-bind="option" v-model="formModel[`${option.field}`]"></form-base>
          </el-row>
        </template>
      </el-row>
    </el-form>
    <div class="footer">
      <el-row type="flex" justify="end" class="footer-btns">
        <el-button size="default" icon="Refresh" @click="resetClick">重置</el-button>
        <el-button size="default" type="primary" icon="Search" @click="queryClick"> 查询 </el-button>
      </el-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import { IFormItemProps } from '../types/formItemType';
import formBase from './formBase.vue';
const emit = defineEmits(['reset', 'query', 'formChange']);
const props = defineProps({
  labelWidth: {
    type: String,
    default: () => '100px'
  },
  labelPosition: {
    type: String,
    default: () => 'right'
  },
  formOptions: {
    type: Array as PropType<IFormItemProps[]>,
    required: true
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

// 或者在根作用域中使用解构语法将 props 赋值给一个新变量
// const formOptions: any = toRef(props, 'formOptions');
const formData: any = {};

// 如何解决此类问题
// eslint-disable-next-line vue/no-setup-props-destructure
const formOptions: any[] = props.formOptions;

for (let option of formOptions) {
  formData[`${option.field}`] = option.defaultFieldValue;
}

const formModel = reactive(formData);

// 重置
const resetClick = () => {
  for (let option of formOptions) {
    formModel[`${option.field}`] = option.defaultFieldValue;
  }
  emit('reset');
};

// 查询
const queryClick = () => {
  emit('query', { ...formModel });
};

// 侦听器
watch(formModel, (newValue: any) => {
  console.log(newValue);
  emit('formChange', newValue);
});
</script>
<style lang="less" scoped>
@import '@/assets/css/_var.less';
.content-wrapper {
  background-color: #fff;
  padding: 12px 0;
  border-radius: 12px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  .header-wrapper {
    // text-align: left;
    margin: 12px;
    display: flex;
    justify-content: start;
    align-items: stretch;
    color: @info-text-color;
    .text {
      font-weight: 550;
      padding-left: 10px;
    }
  }
  .footer {
    margin-right: 25px;
  }
}
</style>
