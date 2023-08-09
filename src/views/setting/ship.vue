<template>
  <div v-loading="loading" class="bg-white p-4 rounded">
    <el-form :model="form" label-width="160px">
      <el-form-item label="物流查询key">
        <div>
          <el-input v-model="form.ship" placeholder="物流查询key"></el-input>
          <small class="text-gray-500 flex mt-1"> 用于查询物流信息，接口申请（仅供参考） </small>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { getSysconfig, setSysconfig } from '@/api/sysconfig/index';
import { ElMessage } from 'element-plus';

const form = reactive({
  ship: ''
});

const loading = ref(false);

async function getData() {
  loading.value = true;
  try {
    const res = await getSysconfig(); // Assuming getSysconfig() is an asynchronous function
    Object.assign(form, res); // Assign properties from res to form
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    loading.value = false;
  }
}

getData();

const submit = () => {
  loading.value = true;
  setSysconfig({
    ...form
  })
    .then(() => {
      ElMessage('修改成功');
      getData();
    })
    .catch(() => {
      ElNotification({
        title: 'Error',
        message: '权限不足！禁止操作',
        type: 'error'
      });
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
