<!-- VueWithTS -->
<template>
  <div class="searchbar">
    <fromComponent v-bind="searchConfig" @query="queryData" @reset="resetData">
      <template #header>角色管理 </template>
    </fromComponent>
  </div>
  <div class="content">
    <el-card shadow="never" class="border-0">
      <!-- 新增|刷新 -->
      <div class="flex items-center justify-between mb-4">
        <el-button type="primary" size="small" @click="handleCreate">新增</el-button>
        <el-tooltip effect="dark" content="刷新数据" placement="top">
          <el-button text @click="getData">
            <el-icon :size="20">
              <Refresh />
            </el-icon>
          </el-button>
        </el-tooltip>
      </div>

      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column label="管理员" width="200">
          <template #default="{ row }">
            <div class="flex items-center">
              <div class="avatar">
                <!-- 图片加载失败时的回退行为。 -->
                <el-avatar :size="60" :src="row.avatar">
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                </el-avatar>
              </div>
              <div class="detail ml-4">
                <p class="text-sm whitespace-nowrap" :title="row.username">{{ row.username }}</p>
                <small class="text-xs text-zinc-400 oldstyle-nums">ID: {{ row.id }}</small>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属角色" align="center">
          <template #default="{ row }">
            <el-tag effect="plain">
              {{ row.role?.name || '-' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-switch v-model="row.status" size="small" :active-value="1" :inactive-value="0" />
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="最初创建时间" width="330" align="center" />
        <el-table-column prop="update_time" label="最后上线时间" width="330" align="center" />
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>

            <el-popconfirm
              title="是否要删除该公告？"
              confirmButtonText="确认"
              cancelButtonText="取消"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button text type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex items-center justify-center mt-5">
        <el-pagination
          background
          layout="prev, pager ,next"
          :total="total"
          :current-page="currentPage"
          :page-size="limit"
          @current-change="getData"
        />
      </div>

      <FormDrawer ref="formDrawerRef" :drawer-title="drawerTitle" @submit="handleSubmit">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
          <el-form-item label="公告标题" prop="title">
            <el-input v-model="form.title" placeholder="公告标题"></el-input>
          </el-form-item>
          <el-form-item label="公告内容" prop="content">
            <el-input v-model="form.content" placeholder="公告内容" type="textarea" :rows="5"></el-input>
          </el-form-item>
        </el-form>
      </FormDrawer>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import FormDrawer from '@/base-ui/formDrawer/FormDrawer.vue';
import fromComponent from '@/base-ui/form';
import searchConfig from './config/search.conf';
import { getNoticeList, createNotice, updateNotice, deleteNotice } from '@/api/notice/index';
import { getManagerList } from '@/api/manager/index';
import type { ManagerData } from '@/api/manager/type';
import type { notice } from '@/api/notice/type';
import { ElMessage } from 'element-plus';
import { FormInstance } from 'element-plus/es/components/form';

interface resetNotice {
  title: '';
  content: '';
}

const tableData = ref<ManagerData[]>([]);

// 分页
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);

/**
 * 获取管理员列表数据
 * @param p 如果为 boolean 则请求当前页码数据，如果为 number 则请求对应页码数据
 */
function getData(p: number | boolean = false) {
  if (typeof p == 'number') {
    currentPage.value = p;
  }

  getManagerList(currentPage.value, {
    limit: 6
  }).then((res) => {
    tableData.value = res.list;
    total.value = res.totalCount;
  });
}

/**
 *删除部分代码逻辑
 * @param id 公告 ID
 */
const handleDelete = (id: number) => {
  deleteNotice(id).then((res) => {
    ElMessage({
      message: '删除成功',
      type: 'success'
    });
    getData();
  });
};

/**
 * 表单部分逻辑
 */
const formDrawerRef = ref<typeof FormDrawer | null>(null);
const formRef = ref<FormInstance>();
const form = reactive({
  title: '',
  content: ''
});

/**
 * 表单验证规则
 */
const rules = {
  title: [
    {
      required: true,
      message: '公告标题不能为空',
      trigger: 'blur'
    }
  ],
  content: [
    {
      required: true,
      message: '公告内容不能为空',
      trigger: 'blur'
    }
  ]
};

const editId = ref(0);
const drawerTitle = computed(() => (editId.value ? '修改' : '新增'));

/**
 * 提交表单逻辑
 */
const handleSubmit = () => {
  formRef.value?.validate((valid) => {
    if (!valid) return;

    const fun = editId.value ? updateNotice(editId.value, form) : createNotice(form);

    fun.then(() => {
      ElMessage({
        message: drawerTitle.value + '成功',
        type: 'success'
      });
      // 修改刷新当前页，新增刷新第一页
      getData(editId.value ? false : 1);
      formDrawerRef.value!.close();
    });
  });
};

/**
 * 重置表单逻辑
 * @param row 单行表单信息
 */
function resetForm(row: notice | resetNotice) {
  if (formRef.value) formRef.value.clearValidate();
  if ('id' in row) {
    for (const key in form) {
      form[key] = row[key];
    }
  }
}

// 新增公告 popover显示逻辑
const handleCreate = () => {
  editId.value = 0;
  resetForm({
    title: '',
    content: ''
  });
  formDrawerRef.value!.open();
};

/**
 * 修改公告 popover显示逻辑
 * @param row 对应行所要展示的信息
 */
const handleEdit = (row: notice) => {
  editId.value = row.id;
  resetForm(row);
  formDrawerRef.value!.open();
};

/**
 * 根据请求 Query 参数查询用户数据
 * @param queryInfo 请求Query参数
 */
const queryData = (queryInfo: any) => {
  getManagerList(currentPage.value, queryInfo).then((res) => {
    tableData.value = res.list;
    total.value = res.totalCount;
  });
};

/**
 * 重置请求 Query 参数
 */
const resetData = () => {
  getData();
};

onMounted(() => {
  getData();
});
</script>
<style lang="less" scoped></style>
