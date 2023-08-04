<template>
  <ProTableComponent
    ref="proTable"
    :columns="columns"
    :searchConfig="searchConfig"
    :requestApi="getGoodsList"
    :init-param="initParam"
  >
    <template #searchbarHeader> 商品管理 </template>
    <template #searchbarContent>
      <el-tabs v-model="initParam.tab">
        <el-tab-pane :label="item.name" :name="item.key" v-for="(item, index) in tabBars" :key="index"></el-tab-pane>
      </el-tabs>
    </template>
    <!-- 表格 header 按钮 -->
    <template #tableHeader="scope">
      <el-button type="primary" @click="handleCreate()">
        <el-icon :size="20"> <CirclePlus /> </el-icon>
        <span class="pl-1">新增商品</span>
      </el-button>
      <el-button
        type="danger"
        plain
        :disabled="!scope.isSelected"
        @click="handleDeleteGoodsByIds(scope.selectedListIds)"
      >
        <el-icon :size="20">
          <Delete />
        </el-icon>
        <span class="pl-1">批量删除商品</span>
      </el-button>
      <el-button
        type="primary"
        plain
        :disabled="!scope.isSelected"
        @click="handleUpdateGoodsStatus(scope.selectedListIds, 1)"
      >
        <el-icon :size="20">
          <Upload />
        </el-icon>
        <span class="pl-1">批量上架商品</span>
      </el-button>
      <el-button
        type="warning"
        plain
        :disabled="!scope.isSelected"
        @click="handleUpdateGoodsStatus(scope.selectedListIds, 0)"
      >
        <el-icon :size="20">
          <Download />
        </el-icon>
        <span class="pl-1">批量下架商品</span>
      </el-button>
    </template>
    <template #operation="scope">
      <el-button type="primary" size="default" text @click="handleEdit(scope.row)" :disabled="initParam.tab == 'delete'"
        >修改</el-button
      >
      <el-button type="primary" size="default" text :disabled="initParam.tab == 'delete'">商品规格</el-button>
      <el-button
        :type="scope.row.goods_banner.length == 0 ? 'danger' : 'primary'"
        size="default"
        text
        :disabled="initParam.tab == 'delete'"
        @click="handleSetGoodsBanners(scope.row)"
        >设置轮播图</el-button
      >
      <el-button
        :type="!scope.row.content ? 'danger' : 'primary'"
        size="default"
        text
        :disabled="initParam.tab == 'delete'"
        @click="handleSetGoodsContent(scope.row)"
        >商品详情</el-button
      >
      <el-popconfirm
        title="是否要删除该管理员？"
        confirmButtonText="确认"
        cancelButtonText="取消"
        @confirm="handleDeleteGoodsByIds([scope.row.id])"
      >
        <template #reference>
          <el-button text type="primary" size="default">删除</el-button>
        </template>
      </el-popconfirm>
    </template>
  </ProTableComponent>
  <FormDrawer ref="formDrawerRef" :drawer-title="drawerTitle" @submit="handleSubmit">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="120px" :inline="false">
      <el-form-item label="商品名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入商品名称，不能超过60个字符"></el-input>
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <ChooseImage v-model="form.cover" />
      </el-form-item>
      <el-form-item label="商品分类" prop="category_id">
        <el-select v-model="form.category_id" placeholder="选择所属商品分类">
          <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品描述" prop="desc">
        <el-input type="textarea" v-model="form.desc" placeholder="选填，商品卖点"></el-input>
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input v-model="form.unit" placeholder="请输入单位" style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label="总库存" prop="stock">
        <el-input v-model="form.stock" type="number" style="width: 40%">
          <template #append>件</template>
        </el-input>
      </el-form-item>
      <el-form-item label="库存预警" prop="min_stock">
        <el-input v-model="form.min_stock" type="number" style="width: 40%">
          <template #append>件</template>
        </el-input>
      </el-form-item>
      <el-form-item label="最低销售价" prop="min_price">
        <el-input v-model="form.min_price" type="number" style="width: 40%">
          <template #append>元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="最低原价" prop="min_oprice">
        <el-input v-model="form.min_oprice" type="number" style="width: 40%">
          <template #append>元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="库存显示" prop="stock_display">
        <el-radio-group v-model="form.stock_display">
          <el-radio :label="0">隐藏</el-radio>
          <el-radio :label="1">显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否上架" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="0">放入仓库</el-radio>
          <el-radio :label="1">立即上架</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </FormDrawer>

  <banners ref="bannersRef" @reload-data="proTable?.getTableList" />
  <content ref="contentRef" @reload-data="proTable?.getTableList" />
</template>
<script setup lang="tsx">
import type { ProTableInstance, ColumnProps } from '@/base-ui/ProTable/types';
import type { ReadGood } from '@/api/goods/type';
import FormDrawer from '@/base-ui/formDrawer/FormDrawer.vue';
import ProTableComponent from '@/base-ui/ProTable/src/index.vue';
import ChooseImage from '@cp/chooseImage/src/index.vue';
import banners from './banners.vue';
import content from './goodDetail.vue';
import { searchConfig, categoryList } from './config/search.conf';
import { getGoodsList, updateGoodsStatus, deleteGoods, updateGoods, createGoods } from '@/api/goods/index';
import { useInitForm } from '@/hooks/useCommon';

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
  { type: 'selection', width: 55 },
  {
    prop: 'title',
    label: '商品',
    width: 410,
    render({ row }) {
      return (
        <div class="flex items-center">
          <div class="good flex">
            {/* 图片加载失败时的回退行为。 */}
            <el-image src={row.cover} fit="cover" lazy={true} class="mr-3 rounded" style="width:150px;height: 120px;">
              <template /* error */>
                <img src="@/assets/img/notData.png" />
              </template>
            </el-image>
            <div class="flex-1">
              <p>{row.title}</p>
              <div>
                <span class="text-rose-500">最低销售价￥{row.min_price}</span>
                <el-divider direction="vertical" />
                <span class="text-teal-500 text-xxs">原价￥{row.min_oprice}</span>
              </div>
              <p class="text-gray-400 text-xxs">分类:{row.category ? row.category.name : '未分类'}</p>
              <p class="text-gray-400 text-xxs">创建时间：{row.create_time}</p>
            </div>
          </div>
        </div>
      );
    }
  },
  { prop: 'sale_count', label: '实际销量', width: 120 },
  {
    prop: 'status',
    label: '商品状态',
    width: 120,
    render({ row }) {
      return (
        <el-tag type={row.status ? 'success' : 'danger'} size="default">
          {row.status ? '上架' : '仓库'}
        </el-tag>
      );
    }
  },
  {
    prop: 'ischeck',
    label: '审核状态',
    width: 120,
    render({ row }) {
      return (
        <div>
          {row.ischeck == 0 ? (
            <div class="flex flex-col">
              <el-button type="success" size="small" plain disabled={initParam.tab == 'delete'}>
                审核通过
              </el-button>
              <el-button class="mt-2 !ml-0" type="danger" size="small" plain disabled={initParam.tab == 'delete'}>
                审核拒绝
              </el-button>
            </div>
          ) : (
            <el-button type={row.ischeck == 1 ? 'success' : 'danger'} size="default" plain>
              {row.ischeck == 1 ? '通过' : '拒绝'}
            </el-button>
          )}
        </div>
      );
    }
  },
  { prop: 'stock', label: '总库存', width: 120 },
  { prop: 'desc', label: '商品描述', width: 240 },
  { prop: 'operation', label: '操作', fixed: 'right' }
];

const tabBars = [
  {
    key: 'all',
    name: '全部'
  },
  {
    key: 'checking',
    name: '审核中'
  },
  {
    key: 'saling',
    name: '出售中'
  },
  {
    key: 'off',
    name: '已下架'
  },
  {
    key: 'min_stock',
    name: '库存预警'
  },
  {
    key: 'delete',
    name: '回收站'
  }
];
/**
 *  获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
 * @type {ProTableInstance}
 */
const proTable = ref<ProTableInstance>();

/**
 * 修改管理员状态代码逻辑
 * @param id 修改人 ID
 * @param status 要修改的状态
 */
const handleUpdateGoodsStatus = (ids: string[], status: 0 | 1) => {
  updateGoodsStatus(ids, status)
    .then((res: boolean) => {
      if (res) {
        ElMessage({
          message: '更新成功',
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
    });
};

/**
 *删除管理员 代码逻辑
 * @param id 公告 ID
 */
const handleDeleteGoodsByIds = (ids: string[]) => {
  deleteGoods(ids)
    .then((res) => {
      if (res) {
        ElMessage({
          message: '删除成功',
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
    });
};

/*
 * FormDrawer 表单部分逻辑
 */
const { formDrawerRef, formRef, form, rules, drawerTitle, handleSubmit, handleCreate, handleEdit } = useInitForm({
  form: {
    title: null, //商品名称
    category_id: null, //商品分类
    cover: null, //商品封面
    desc: null, //商品描述
    unit: '件', //商品单位
    stock: 100, //总库存
    min_stock: 10, //库存预警
    status: 1, //是否上架 0仓库1上架
    stock_display: 1, //库存显示 0隐藏1显示
    min_price: 0, //最低销售价
    min_oprice: 0 //最低原价
  },
  getData: () => proTable.value!.getTableList(),
  update: updateGoods,
  create: createGoods
});

// 设置轮播图
const bannersRef = ref<typeof banners>();
const handleSetGoodsBanners = (row: ReadGood) => bannersRef.value!.open(row);

// 设置商品详情
const contentRef = ref<typeof content>();
const handleSetGoodsContent = (row: ReadGood) => contentRef.value!.open(row);
</script>
