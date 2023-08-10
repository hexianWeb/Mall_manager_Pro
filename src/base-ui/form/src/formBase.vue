<!-- 表单控件的最小单元 -->
<template>
  <el-form-item :label="label">
    <template v-if="type === 'input'">
      <el-input :placeholder="placeHolder" v-model="value"></el-input>
    </template>
    <template v-if="type === 'select'">
      <el-select :placeholder="placeHolder" v-model="value">
        <template v-for="option in otherOptions.options" :key="option.value">
          <el-option :label="option.label" :value="option.value"> </el-option>
        </template>
      </el-select>
    </template>
    <template v-if="type === 'datepicker'">
      <el-date-picker type="date" format="YYYY-MM-DD" v-model="value" v-bind="otherOptions" style="width: 100%">
      </el-date-picker>
    </template>
  </el-form-item>
</template>
<script setup lang="ts">
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: [String, Number, Array, Object],
    default: undefined
  },
  label: {
    type: String,
    required: true
  },
  placeHolder: {
    type: String,
    default: () => undefined
  },
  type: {
    type: String,
    default: () => {
      return 'input';
    }
  },
  otherOptions: {
    type: Object,
    default: () => ({})
  }
});

const value = computed({
  set(newValue) {
    if (props.type == 'datepicker') {
      console.log(newValue);
    }
    emit('update:modelValue', newValue);
  },
  get() {
    return props.modelValue;
  }
});
</script>
