<template>
  <div>
    <panel />

    <el-card shadow="never" class="border-0">
      <ProTableComponent
        ref="proTable"
        :requestApi="getAgentList"
        :searchConfig="searchConfig"
        :init-param="initParam"
        :columns="columns"
      >
        <template #searchbarHeader> 分销管理 </template>
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-form :inline="true">
            <el-form-item label="时间选择">
              <el-radio-group v-model="initParam.type">
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="today">今天</el-radio-button>
                <el-radio-button label="yesterday">昨天</el-radio-button>
                <el-radio-button label="last7days">最近7天</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="类型选择">
              <el-radio-group v-model="initParam.level">
                <el-radio-button label="0">全部</el-radio-button>
                <el-radio-button label="1">一级推广</el-radio-button>
                <el-radio-button label="2">二级推广</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </template>
      </ProTableComponent>
    </el-card>

    <!-- <dataDrawer ref="dataDrawerRef" />
    <dataDrawer ref="orderDataDrawerRef" type="order" /> -->
  </div>
</template>
<script setup lang="tsx">
import type { ProTableInstance, ColumnProps } from '@/base-ui/ProTable/types';
import panel from './panel.vue';
import ProTableComponent from '@/base-ui/ProTable/src/index.vue';
import searchConfig from './config/search.conf';
import { getAgentList } from '@/api/distribution/index';

/**
 * 如果表格需要初始化请求参数，直接定义传给 ProTable 之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据
 * @type {Object}
 */
const initParam = reactive({ type: 'all', level: 0 });

/**
 * 表格 Column 配置（ColumnProps）配置项
 * @type {ColumnProps}
 */
const columns: ColumnProps<any>[] = [
  { prop: 'id', label: 'ID' },
  {
    prop: 'avatar',
    label: '头像',
    width: 65,
    render({ row }) {
      return (
        <el-avatar size={40} src={row.avatar}>
          <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
        </el-avatar>
      );
    }
  },
  {
    prop: 'user_info',
    label: '用户信息',
    width: 300,
    render({ row }) {
      return (
        <el-descriptions direction="vertical" column={2} size="small" border>
          <el-descriptions-item label="用户" width="120px">
            {row.username}
          </el-descriptions-item>
          <el-descriptions-item label="昵称">{row.nickname ?? '暂无'}</el-descriptions-item>
          <el-descriptions-item label="姓名 ">{row.user_info.name ?? '暂无'}</el-descriptions-item>
          <el-descriptions-item label="电话">{row.phone ?? '暂无'}</el-descriptions-item>
        </el-descriptions>
      );
    }
  },
  { prop: 'share_num', label: '推广用户数量' },
  { prop: 'share_order_num', label: '订单数量' },
  { prop: 'order_price', label: '订单金额' },
  { prop: 'commission', label: '账户佣金' },
  { prop: 'cash_out_price', label: '已提现金额' },
  { prop: 'cash_out_time', label: '提现次数' },
  { prop: 'no_cash_out_price', label: '未提现金额' }
];

const dataDrawerRef = ref(null);
const orderDataDrawerRef = ref(null);
// const openDataDrawer = (id, type) => {
//   (type == 'user' ? dataDrawerRef : orderDataDrawerRef).value.open(id);
// };
</script>
