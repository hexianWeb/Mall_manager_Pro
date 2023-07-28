<!-- VueWithTS -->
<template>
  <div class="content">
    <!-- 搜素组件 -->
    <Searchbar v-bind="searchConfig" @query="queryData" @reset="resetData" v-show="isShowSearch">
      <template #header>角色管理 </template>
    </Searchbar>
    <!-- 搜素组件结束 -->
    <el-card shadow="never" class="border-0">
      <!-- 按钮群组件 -->
      <div class="table-header">
        <div class="header-button-left">
          <slot
            name="tableHeader"
            :selected-list-ids="selectedListIds"
            :selected-list="selectedList"
            :is-selected="isSelected"
          >
            <el-button type="primary" size="default">新增</el-button>
          </slot>
        </div>
        <div class="header-button-right" v-if="toolButton">
          <slot name="toolButton">
            <el-tooltip effect="dark" content="刷新数据" placement="top">
              <el-button text @click="getTableList">
                <el-icon :size="20">
                  <Refresh />
                </el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="打印表单" placement="top">
              <el-button text>
                <el-icon :size="20">
                  <Printer />
                </el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="操作栏位" placement="top">
              <el-button text>
                <el-icon :size="20">
                  <Operation />
                </el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="搜索启用" placement="top">
              <el-button text @click="isShowSearch = !isShowSearch">
                <el-icon :size="20">
                  <Search />
                </el-icon>
              </el-button>
            </el-tooltip>
          </slot>
        </div>
      </div>
      <!-- 按钮群组件结束 -->

      <el-table ref="tableRef" :data="data ?? tableData" stripe :row-key="rowKey" @selection-change="selectionChange">
        <!-- 默认插槽 -->
        <slot></slot>
        <template v-for="item in tableColumns" :key="item">
          <!-- selection || index || expand -->
          <el-table-column
            v-if="item.type && ['selection', 'index', 'expand'].includes(item.type)"
            v-bind="item"
            :align="item.align ?? 'center'"
            :reserve-selection="item.type == 'selection'"
          >
            <template v-if="item.type == 'expand'" #default="scope">
              <component :is="item.render" v-bind="scope" v-if="item.render"> </component>
              <slot v-else :name="item.type" v-bind="scope"></slot>
            </template>
          </el-table-column>
          <!-- other -->
          <TableColumn v-if="!item.type && item.prop && item.isShow" :column="item">
            <template v-for="slot in Object.keys($slots)" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </TableColumn>
        </template>
        <!-- 插入表格最后一行之后的插槽 -->
        <template #append>
          <slot name="append"> </slot>
        </template>
        <!-- 无数据 -->
        <template #empty>
          <div class="table-empty">
            <slot name="empty">
              <img src="@/assets/images/notData.png" alt="notData" />
              <div>暂无数据</div>
            </slot>
          </div>
        </template>
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
            <el-switch
              v-model="row.status"
              size="small"
              :active-value="1"
              :inactive-value="0"
              @change="handleUpdateManagerStatus(row.id, row.status)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="最初创建时间" width="330" align="center" />
        <el-table-column prop="update_time" label="最后修改时间" width="330" align="center" />
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
            <el-popconfirm
              title="是否要删除该管理员？"
              confirmButtonText="确认"
              cancelButtonText="取消"
              @confirm="handleDeleteManagerById(scope.row.id)"
            >
              <template #reference>
                <el-button text type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="flex items-center justify-center mt-5">
        <slot name="pagination">
          <Pagination
            v-if="pagination"
            :pageable="pageable"
            :handle-size-change="handleSizeChange"
            :handle-current-change="handleCurrentChange"
          />
        </slot>
      </div>
      <!-- 分页组件结束 -->
    </el-card>
  </div>
</template>
<script setup lang="ts">
import Searchbar, { IFormProps } from '@/base-ui/form';
import Pagination from './Pagination.vue';
import { useTable } from '@/hooks/useCommon';
import { useSelection } from '@/hooks/useSelection';
import type { ElTable } from 'element-plus/es/components/table';
import type { ColumnProps } from '@/views/goods/types';

export interface ProTableProps {
  columns: ColumnProps[]; // 列配置项  ==> 必传
  searchConfig: IFormProps; //搜素配置项 ==>必传
  data?: any[]; // 静态 table data 数据，若存在则不会使用 requestApi 返回的 data ==> 非必传
  requestAuto?: boolean; // 是否自动执行请求 api ==> 非必传（默认为true）
  title?: string; // 表格标题，目前只在打印的时候用到 ==> 非必传
  pagination?: boolean; // 是否需要分页组件 ==> 非必传（默认为true）
  initParam?: any; // 初始化请求参数 ==> 非必传（默认为{}）
  border?: boolean; // 是否带有纵向边框 ==> 非必传（默认为true）
  toolButton?: boolean; // 是否显示表格功能按钮 ==> 非必传（默认为true）
  rowKey?: string; // 行数据的 Key，用来优化 Table 的渲染，当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
  requestApi?: (params: any) => Promise<any>; // 请求表格数据的 api ==> 非必传
  requestError?: (params: any) => void; // 表格 api 请求错误监听 ==> 非必传
  dataCallback?: (data: any) => any; // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
}

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  requestAuto: true,
  pagination: true,
  initParam: {},
  border: true,
  toolButton: true,
  rowKey: 'id',
  searchConfig: undefined
});

// 是否显示搜索模块
const isShowSearch = ref(true);

// 表格 DOM 元素
const tableRef = ref<InstanceType<typeof ElTable>>();

// 表格多选 Hooks
const { selectionChange, selectedList, selectedListIds, isSelected } = useSelection(props.rowKey);

// 清空选中数据列表
const clearSelection = () => tableRef.value!.clearSelection();

// 表格操作 Hooks
const {
  tableData,
  pageable,
  searchParam,
  searchInitParam,
  getTableList,
  search,
  reset,
  handleSizeChange,
  handleCurrentChange
} = useTable(props.requestApi, props.initParam);

/**
 * 根据请求 Query 参数查询用户数据
 * @param queryInfo 请求Query参数
 */
const queryData = (queryInfo: object) => {
  searchParam.value = queryInfo;
  search();
};

/**
 * 重置请求 Query 参数
 */
const resetData = () => {
  reset();
};

/**
 * 调用这个我乐意
 */
onMounted(() => {
  resetData();
});

defineExpose({
  element: tableRef,
  tableData,
  pageable,
  searchParam,
  searchInitParam,
  getTableList,
  search,
  reset,
  handleSizeChange,
  handleCurrentChange,
  clearSelection,
  isSelected,
  selectedList,
  selectedListIds
});
</script>
<style lang="less" scoped>
.table-header {
  @apply flex items-center justify-between mb-4;
}
</style>
