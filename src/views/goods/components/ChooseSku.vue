<template>
  <el-dialog title="规格选择" v-model="dialogVisible" width="80%" top="5vh">
    <el-container style="height: 65vh">
      <el-aside width="280px" class="image-aside">
        <div class="top">
          <div
            class="sku-list"
            :class="{ active: activeId == item.id }"
            v-for="(item, index) in tableData"
            :key="index"
            @click="handleChangeActiveId(item.id)"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="bottom">
          <el-pagination
            background
            layout="prev, pager ,next"
            :total="pageable.totalCount"
            :page-size="pageable.pageSize"
            :current-page="pageable.pageNum"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-aside>
      <el-main>
        <el-checkbox-group v-model="form.list" size="large">
          <el-checkbox v-for="item in list" :key="item" :label="item" border>
            {{ item }}
          </el-checkbox>
        </el-checkbox-group>
      </el-main>
    </el-container>

    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { getSkusList } from '@/api/skus';
import { useTable } from '@/hooks/useCommon';
/**
 * 如果表格需要初始化请求参数，直接定义传给 ProTable 之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据
 * @type {Object}
 */
const initParam = reactive({});

const dialogVisible = ref(false);
const activeId = ref(0);

const { tableData, pageable, getTableList, handleCurrentChange } = useTable(getSkusList, initParam, true);

const callbackFunction = ref<Function | null>();
const open = (callback = null) => {
  callbackFunction.value = callback;
  getTableList();
  dialogVisible.value = true;
};

const list = ref([]);

const form = reactive({
  name: '',
  list: []
});

function handleChangeActiveId(id: number) {
  activeId.value = id;
  list.value = [];
  let item = tableData.value.find((itemDetail) => itemDetail.id == id);
  if (item) {
    list.value = item.default.split(',');
    form.name = item.name;
  }
}

const submit = () => {
  if (typeof callbackFunction.value === 'function') {
    callbackFunction.value(form);
  }
  dialogVisible.value = false;
};

defineExpose({
  open
});

watch(
  () => tableData.value,
  () => {
    activeId.value = tableData.value[0]?.id;
    handleChangeActiveId(activeId.value);
  }
);
</script>
<style scoped>
.image-aside {
  border-right: 1px solid #eeeeee;
  position: relative;
}
.image-aside .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}
.image-aside .bottom {
  position: absolute;
  bottom: 0;
  height: 50px;
  left: 0;
  right: 0;
  @apply flex items-center justify-center;
}
.sku-list {
  border-bottom: 1px solid #f4f4f4;
  @apply p-3 text-sm text-gray-600 flex items-center cursor-pointer;
}
.sku-list:hover,
.active {
  @apply bg-blue-50;
}
</style>
