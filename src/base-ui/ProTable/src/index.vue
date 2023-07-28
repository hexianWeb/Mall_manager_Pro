<template>
  <!--整体表  -->
  <div class="table">
    <!-- 表头 -->
    <div class="header">
      <slot name="header">
        <span class="title">{{ options.header.title }}</span>
        <slot name="handler">
          <el-row class="handler">
            <!-- 自定义功能按钮 -->
            <el-button
              type="primary"
              size="default"
              @click="options.header.handleOption.handleNewClick"
              :icon="options.header.handleOption.icon"
            >
              {{ options.header.handleOption.title }}
            </el-button>
            <el-button type="text" size="default" icon="Refresh" @click="options.header.handleOption.handleRefresh">
            </el-button>
          </el-row>
        </slot>
      </slot>
    </div>
    <!-- 表的主题内容 -->
    <div class="content" ref="TableContent">
      <slot name="content">
        <el-table :data="options.content.dataSource" style="width: 100%" @selection-change="handleSelectionChange">
          <!-- 是否选择勾选框 -->
          <template v-if="options.content.showSelect">
            <el-table-column type="selection" width="55" />
          </template>
          <!-- 是否显示表头序号 -->
          <template v-if="options.content.showIndex">
            <el-table-column type="index" align="center" label="序号" width="55"></el-table-column>
          </template>
          <template v-for="(item, index) in options.content.columns" :key="index">
            <el-table-column align="center" show-overflow-tooltip v-bind="item">
              <template #default="scope">
                <slot :name="item.slotName" :row="scope.row">
                  {{ item.type === 'index' ? index + 1 : scope.row[item.prop] }}
                </slot>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </slot>
    </div>
    <!-- 分页组件 -->
    <div class="footer">
      <Pagination
        :pageable="pageable"
        :handle-size-change="handleSizeChange"
        :handle-current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ColumnProps } from '@/base-ui/ProTable/types/index';
import pagination from '@/base-ui/table/src/Pagination.vue';
export interface ProTableProps {
  columns: ColumnProps[]; // 列配置项  ==> 必传
  data?: any[]; // 静态 table data 数据，若存在则不会使用 requestApi 返回的 data ==> 非必传
  requestApi?: (params: any) => Promise<any>; // 请求表格数据的 api ==> 非必传
  requestAuto?: boolean; // 是否自动执行请求 api ==> 非必传（默认为true）
  requestError?: (params: any) => void; // 表格 api 请求错误监听 ==> 非必传
  dataCallback?: (data: any) => any; // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
  title?: string; // 表格标题，目前只在打印的时候用到 ==> 非必传
  pagination?: boolean; // 是否需要分页组件 ==> 非必传（默认为true）
  initParam?: any; // 初始化请求参数 ==> 非必传（默认为{}）
  border?: boolean; // 是否带有纵向边框 ==> 非必传（默认为true）
  toolButton?: boolean; // 是否显示表格功能按钮 ==> 非必传（默认为true）
  rowKey?: string; // 行数据的 Key，用来优化 Table 的渲染，当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
}

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  requestAuto: true,
  pagination: true,
  initParam: {},
  border: true,
  toolButton: true,
  rowKey: 'id'
});

const emit = defineEmits(['selectOptions']);

// 表单过长解决方案
const TableContent = ref<HTMLElement | null>(null);
onMounted(() => {
  const instance = TableContent.value!;

  watch(
    () => instance?.scrollTop,
    (newScrollY) => {
      console.log(newScrollY);

      // 监听鼠标下移事件改为右移
      const scrollX = (newScrollY * instance.scrollWidth) / instance.scrollHeight;
      instance.scrollTop = scrollX;
    }
  );
});

// 选框逻辑
const multipleSelection = ref<[]>([]);
const handleSelectionChange = (val: []) => {
  multipleSelection.value = val;
  emit('selectOptions', multipleSelection.value);
};

// 保证数据单项流
const options = computed(() => props.options!);
</script>
<style lang="less" scoped>
@import '@/assets/css/_var.less';
.table {
  margin-top: 22px;
  border-radius: 29px;
  background: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  .header {
    border-radius: 29px 29px 0 0;
    padding: 18px 29px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      color: @info-text-color;
      // margin-top: 12px;
      font-size: 17px;
      font-weight: bold;
    }
  }
  .content {
    margin-left: 29px;
  }
  .footer {
    @apply flex items-center justify-center mt-5;
  }
}
</style>
