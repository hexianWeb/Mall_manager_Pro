import ProTableComponent from '@/base-ui/ProTable/src/index.vue';
<!-- VueWithTS -->
<template>
  <ProTableComponent
    ref="proTable"
    :columns="columns"
    :searchConfig="searchConfig"
    :requestApi="getOrderList"
    :init-param="initParam"
  >
    <template #searchbarHeader> 订单管理 </template>
    <template #searchbarContent>
      <el-tabs v-model="initParam.tab">
        <el-tab-pane :label="item.name" :name="item.key" v-for="(item, index) in tabBars" :key="index"></el-tab-pane>
      </el-tabs>
    </template>
    <!-- 表格 header 按钮 -->
    <template #tableHeader="scope">
      <el-button type="primary" @click="handleExportExcel">
        <el-icon :size="20"> <Upload /> </el-icon>
        <span class="pl-1">导出数据</span>
      </el-button>
    </template>
    <template #operation="{ row }">
      <el-button class="px-1" type="primary" size="small" text @click="openInfoModal(row)">订单详情</el-button>
      <el-button v-if="initParam.tab === 'noship'" class="px-1" type="primary" size="small" text>订单发货</el-button>
      <el-button
        v-if="initParam.tab === 'refunding'"
        class="px-1"
        type="primary"
        size="small"
        text
        @click="handleRefund(row.id, 1)"
        >同意退款</el-button
      >
      <el-button
        v-if="initParam.tab === 'refunding'"
        class="px-1"
        type="primary"
        size="small"
        text
        @click="handleRefund(row.id, 0)"
        >拒绝退款</el-button
      >
    </template>
  </ProTableComponent>
  <ExportExcel :tabs="tabBars" ref="ExportExcelRef" />

  <InfoModal ref="InfoModalRef" :info="info" />
</template>
<script setup lang="tsx">
import type { ProTableInstance, ColumnProps } from '@/base-ui/ProTable/types';
import type { Order } from '@/api/order/type';
import ProTableComponent from '@/base-ui/ProTable/src/index.vue';
import ExportExcel from './ExportExcel.vue';
import InfoModal from './InfoModal.vue';
import { getOrderList, deleteOrder, exportOrder, getShipInfo, refundOrder } from '@/api/order/index';
import searchConfig from './config/search.conf';
import { showModal, showPrompt } from '@/utils/ui';
const tabBars = [
  {
    key: 'all',
    name: '全部'
  },
  {
    key: 'nopay',
    name: '待支付'
  },
  {
    key: 'noship',
    name: '待发货'
  },
  {
    key: 'shiped',
    name: '待收货'
  },
  {
    key: 'received',
    name: '已收货'
  },
  {
    key: 'finish',
    name: '已完成'
  },
  {
    key: 'closed',
    name: '已关闭'
  },
  {
    key: 'refunding',
    name: '退款中'
  }
];

/**
 * 如果表格需要初始化请求参数，直接定义传给 ProTable 之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据
 * @type {Object}
 */
const initParam = reactive({ tab: 'all', limit: 3 });

/**
 * 表格 Column 配置（ColumnProps）配置项
 * @type {ColumnProps}
 */
const columns: ColumnProps<any>[] = [
  { type: 'selection', width: 70 },
  {
    prop: 'no',
    label: '商品',
    width: 245,
    render({ row }) {
      return (
        <div>
          <div class="flex text-sm text-left">
            <div class="flex-1">
              <p>订单号：</p>
              <small class="text-blue-500">{row.no}</small>
            </div>
          </div>
          {row.order_items.map((item, index) => (
            <div class="flex py-2">
              <el-image
                src={item.goods_item ? item.goods_item.cover : ''}
                fit="cover"
                lazy={true}
                style="width: 30px;height: 30px;"
              ></el-image>
              <p class="text-gray-500 ml-3">{item.goods_item ? item.goods_item.title : '商品已被删除'}</p>
            </div>
          ))}
        </div>
      );
    }
  },
  { prop: 'create_time', label: '下单时间', width: 180 },
  { prop: 'total_price', label: '实际付款', width: 120 },
  {
    prop: 'user',
    label: '买家',
    width: 120,
    render({ row }) {
      return (
        <>
          <p>{row.user.nickname || row.user.username}</p>
          <small class="text-gray-400">(用户ID：{row.user.id})</small>
        </>
      );
    }
  },
  {
    prop: 'address',
    label: '派送地址',
    width: 350,
    render({ row }) {
      const { province, city, district, address } = row.address;

      return <>{province + ' ' + city + ' ' + district + ' ' + address}</>;
    }
  },
  {
    prop: 'ship_status',
    label: '交易状态',
    width: 170,
    render({ row }) {
      let paymentTag;
      let shipData;
      switch (row.payment_method) {
        case 'wechat':
          paymentTag = <span class="el-tag el-tag--success el-tag--small">微信支付</span>;
          break;
        case 'alipay':
          paymentTag = <span class="el-tag el-tag--small">支付宝支付</span>;
          break;
        default:
          paymentTag = <span class="el-tag el-tag--info el-tag--small">未支付</span>;
          break;
      }

      return (
        <>
          <div class="text-red-700">付款状态： {paymentTag}</div>
          <div class="my-2">
            发货状态：
            <el-tag type={row.ship_data ? 'success' : 'info'} size="default">
              {row.ship_data ? '已发货' : '未发货'}
            </el-tag>
          </div>
          <div>
            收货状态：
            <el-tag type={row.ship_status == 'received' ? 'success' : 'info'} size="default">
              {row.ship_status == 'received' ? '已收货' : '未收货'}
            </el-tag>
          </div>
        </>
      );
    }
  },
  { prop: 'operation', label: '操作', fixed: 'right' }
];

/**
 *  获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
 * @type {ProTableInstance}
 */
const proTable = ref<ProTableInstance>();

/**
 *删除商品 代码逻辑
 * @param ids string[]
 */
const handleDeleteGoodsByIds = (ids: string[]) => handleMutationByIds(deleteOrder, '删除成功!!', ids);

/**
 * 批量操作 代码逻辑
 * @params ids string[]
 */
const handleMutationByIds = (func: Function, msg: string = '操作成功', ids: string[]) => {
  func(ids)
    .then((res) => {
      if (res) {
        ElMessage({
          message: '恢复商品成功!!',
          type: 'success'
        });
      }
    })
    .catch(() => {
      ElMessage({
        message: '非超级管理员禁止操作',
        type: 'error'
      });
    })
    .finally(() => {
      proTable.value?.getTableList();
      proTable.value?.clearSelection();
    });
};

/**
 * 导出数据 组件
 */
const ExportExcelRef = ref<typeof ExportExcel>();
const handleExportExcel = () => ExportExcelRef.value!.open();

/**
 * 订单详情 组件
 */
const InfoModalRef = ref<typeof InfoModal>();
const info = ref<Order>();

const openInfoModal = (row: Order) => {
  row.order_items = row.order_items.map((o) => {
    if (o.skus_type == 1 && o.goods_skus) {
      let s = [];
      for (const k in o.goods_skus.skus) {
        s.push(o.goods_skus.skus[k].value);
      }
      o.sku = s.join(',');
    }
    return o;
  });
  info.value = row;
  InfoModalRef.value!.open();
};

/**
 * 同意退款 & 拒绝退款
 */
const handleRefund = (id: number, agree: 0 | 1) => {
  (agree ? showModal('是否要同意该订单退款?') : showPrompt('请输入拒绝的理由')).then(({ value }) => {
    let data: any = { agree };
    if (!agree) {
      data.disagree_reason = value;
    }
    refundOrder(id, data)
      .then((res) => {
        proTable.value?.getTableList();
        ElMessage({
          type: 'success',
          message: '操作成功'
        });
      })
      .catch((err) => {
        ElMessage({
          type: 'error',
          message: err.msg
        });
      });
  });
};
</script>
<style lang="less" scoped></style>
