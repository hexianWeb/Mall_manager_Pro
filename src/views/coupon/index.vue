<template>
  <ProTableComponent
    ref="proTable"
    :columns="columns"
    :requestApi="getCouponList"
    :init-param="initParam"
    :data-callback="dataCallBack"
  >
    <template #tableHeader="scope">
      <el-button type="primary" @click="handleCreate()">
        <el-icon :size="20">
          <CirclePlus />
        </el-icon>
        <span class="pl-1">新增优惠券</span>
      </el-button>
    </template>
    <template #operation="scope">
      <el-button
        v-if="scope.row.statusText == '未开始'"
        type="warning"
        size="default"
        plain
        @click="handleEdit(scope.row)"
        >修改</el-button
      >
      <el-popconfirm
        v-if="scope.row.statusText != '领取中'"
        title="是否要删除该优惠券？"
        confirmButtonText="确认"
        cancelButtonText="取消"
        @confirm="deleteSkusById(scope.row.id)"
      >
        <template #reference>
          <el-button type="danger" plain size="default">删除</el-button>
        </template>
      </el-popconfirm>

      <el-popconfirm
        v-if="scope.row.statusText == '领取中'"
        title="是否要让该优惠券失效？"
        confirmButtonText="失效"
        cancelButtonText="取消"
        @confirm="handleUpdateSkusStatus(scope.row.id, 0)"
      >
        <template #reference>
          <el-button type="danger" size="default">失效</el-button>
        </template>
      </el-popconfirm>
    </template>
  </ProTableComponent>

  <FormDrawer ref="formDrawerRef" :drawerTitle="drawerTitle" @submit="handleSubmit">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="120px" :inline="false">
      <el-form-item label="优惠券名称" prop="name">
        <el-input v-model="form.name" placeholder="优惠券名称" style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="0">满减</el-radio>
          <el-radio :label="1">折扣</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="面值" prop="value">
        <el-input v-model="form.value" placeholder="面值" style="width: 50%">
          <template #append>{{ form.type ? '折' : '元' }}</template>
        </el-input>
      </el-form-item>
      <el-form-item label="发行量" prop="total">
        <el-input-number v-model="form.total" :min="0" :max="10000"></el-input-number>
      </el-form-item>
      <el-form-item label="最低使用价格" prop="min_price">
        <el-input v-model="form.min_price" placeholder="最低使用价格" type="number"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number v-model="form.order" :min="0" :max="1000"></el-input-number>
      </el-form-item>
      <el-form-item label="活动时间">
        <el-date-picker
          :editable="false"
          v-model="timeRange"
          type="datetimerange"
          range-separator="To"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="form.desc" placeholder="描述" type="textarea" :rows="5"></el-input>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup lang="tsx">
import type { ProTableInstance, ColumnProps } from '@/base-ui/ProTable/types';
import type { CouponInfo } from '@/api/coupon/type';
import ProTableComponent from '@/base-ui/ProTable/src/index.vue';
import FormDrawer from '@/base-ui/formDrawer/FormDrawer.vue';
import { getCouponList, createCoupon, updateCoupon, updateCouponStatus, deleteCoupon } from '@/api/coupon/index';
import { useInitForm } from '@/hooks/useCommon';

/**
 * 默认请求数据
 * @type {number}
 */
const DEFAULT_PAGE = 6;

/**
 * 如果表格需要初始化请求参数，直接定义传给 ProTable 之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据
 * @type {Object}
 */
const initParam = reactive({ limit: DEFAULT_PAGE });

/**
 *  获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
 * @type {ProTableInstance}
 */
const proTable = ref<ProTableInstance>();

/**
 * ProTable 配置项
 */
const columns: ColumnProps<any>[] = [
  {
    prop: 'name',
    label: '优惠券名称',
    width: 330,
    align: 'center',
    render({ row }) {
      const containerClass = row.statusText === '领取中' ? 'active' : 'inactive';

      return (
        <div class={`border border-dashed py-2 px-4 rounded inactive ${containerClass}`}>
          <h5 class="font-bold text-md">{row.name}</h5>
          <small>
            {row.start_time} ~ {row.end_time}
          </small>
        </div>
      );
    }
  },
  { prop: 'statusText', label: '状态' },
  {
    prop: 'type',
    label: '优惠',
    width: 200,
    render({ row }) {
      let type = '无';
      let content = '暂无';
      let containerClass = '';
      switch (row.type) {
        case 0:
          type = '满减';
          content = '￥' + row.value;
          containerClass = 'text-red-500';
          break;
        case 1:
          type = '折扣  ';
          content = Number(row.value).toFixed(0) + '  折';
          containerClass = 'text-yellow-500';
          break;
      }

      return (
        <div class={containerClass}>
          {type}
          {content}
        </div>
      );
    }
  },
  {
    prop: 'status',
    label: '状态',
    render({ row }) {
      return (
        <el-switch
          v-model={row.status}
          size="default"
          active-value={1}
          inactive-value={0}
          disabled={true}
          inline-prompt
          active-text="启用"
          inactive-text="失效"
        />
      );
    }
  },
  { prop: 'total', label: '发放数量' },
  { prop: 'used', label: '已使用' },
  { prop: 'create_time', label: '最初创建时间', width: 200 },
  { prop: 'update_time', label: '最后修改时间', width: 200 },
  { prop: 'operation', label: '操作', fixed: 'right', width: 280 }
];

/**
 * 格式化状态值
 */
function formatStatus(row: CouponInfo) {
  let status = '领取中';
  let start_time = new Date(row.start_time).getTime();
  let now = new Date().getTime();
  let end_time = new Date(row.end_time).getTime();
  if (start_time > now) {
    status = '未开始';
  } else if (end_time < now) {
    status = '已结束';
  } else if (row.status == 0) {
    status = '已失效';
  }
  return status;
}

/**
 * 额外数据处理
 */
const dataCallBack = (res: any) => {
  res = res.list.map((item: any) => {
    // 转化优惠券状态
    item.statusText = formatStatus(item);
    return item;
  });
};

const { formDrawerRef, formRef, form, rules, drawerTitle, handleSubmit, handleCreate, handleEdit } = useInitForm({
  form: {
    name: '',
    type: 0,
    value: 0,
    total: 100,
    min_price: 0,
    start_time: null,
    end_time: null,
    order: 50,
    desc: ''
  },
  getData: () => proTable.value!.getTableList(),
  update: updateCoupon,
  create: createCoupon,
  beforeSubmit: (rawForm: Record<string, any>) => {
    if (typeof rawForm.start_time != 'number') {
      rawForm.start_time = new Date(rawForm.start_time).getTime();
    }
    if (typeof rawForm.end_time != 'number') {
      rawForm.end_time = new Date(rawForm.end_time).getTime();
    }
    return rawForm;
  }
});

const timeRange = computed({
  get() {
    return form.start_time && form.end_time ? [form.start_time, form.end_time] : [];
  },
  set(val) {
    form.start_time = val[0];
    form.end_time = val[1];
  }
});
/**
 * 删除规格通过 规格 ID
 * @param id 规格 ID
 */
const deleteSkusById = (id: number) => {
  deleteCoupon(id)
    .then(() => {
      ElMessage({
        message: '删除成功',
        type: 'success'
      });
      proTable.value!.getTableList();
    })
    .catch((err) => {
      ElMessage({
        message: err.msg,
        type: 'error'
      });
    });
};

/**
 * 修改管理员状态代码逻辑
 * @param id 修改人 ID
 * @param status 要修改的状态
 */
const handleUpdateSkusStatus = (id: number, status: 0 | 1) => {
  updateCouponStatus(id, status)
    .then((res: any) => {
      if (res) {
        ElMessage({
          message: '更新成功',
          type: 'success'
        });
        proTable.value?.getTableList();
      }
    })
    .catch(() => {
      ElMessage({
        message: '非超级管理员禁止操作',
        type: 'error'
      });
    });
};
</script>
<style>
.active {
  @apply border-rose-200 bg-rose-50 text-red-400;
}

.inactive {
  @apply border-gray-200 bg-gray-50 text-gray-400;
}
</style>
