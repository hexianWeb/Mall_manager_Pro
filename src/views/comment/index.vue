<!-- VueWithTS -->
<template>
  <ProTableComponent
    ref="proTable"
    :searchConfig="searchConfig"
    :requestApi="getGoodsCommentList"
    :columns="columns"
    :data-callback="dataCallback"
  >
    <template #searchbarHeader> 评论管理 </template>
    <!-- Expand -->
    <template #expand="{ row }">
      <div class="flex pl-18">
        <el-avatar :size="50" :src="row.user.avatar" fit="fill" class="mr-3"></el-avatar>
        <div class="flex-1">
          <h6 class="flex items-center">
            {{ row.user.nickname || row.user.username }}
            <small class="text-gray-400 ml-2">{{ row.review_time }}</small>
            <el-button size="small" class="ml-auto" @click="openTextarea(row)" v-if="!row.textareaEdit && !row.extra"
              >回复</el-button
            >
          </h6>
          {{ row.review.data }}
          <div class="py-2">
            <el-image
              v-for="(item, index) in row.review.image"
              :key="index"
              :src="item"
              fit="cover"
              :lazy="true"
              style="width: 100px; height: 100px"
              class="rounded"
            ></el-image>
          </div>
          <div v-if="row.textareaEdit">
            <el-input v-model="textarea" placeholder="请输入评价内容" type="textarea" :rows="2"></el-input>
            <div class="py-2">
              <el-button type="primary" size="small" @click="review(row)">回复</el-button>
              <el-button size="small" class="ml-2" @click="row.textareaEdit = false">取消</el-button>
            </div>
          </div>

          <template v-else>
            <div class="mt-3 bg-gray-100 p-3 rounded" v-for="(item, index) in row.extra" :key="index">
              <h6 class="flex font-bold">
                客服
                <el-button type="info" size="small" class="ml-auto" @click="openTextarea(row, item.data)"
                  >修改</el-button
                >
              </h6>
              <p>{{ item.data }}</p>
            </div>
          </template>
        </div>
      </div>
    </template>
  </ProTableComponent>
</template>
<script setup lang="tsx">
import type { ProTableInstance, ColumnProps } from '@/base-ui/ProTable/types';
import type { ListItem } from '@/api/comments/type';
import ProTableComponent from '@/base-ui/ProTable/src/index.vue';
import searchConfig from './config/search.conf';
import { getGoodsCommentList, updateGoodsCommentStatus, reviewGoodsComment } from '@/api/comments/index';
import { ElMessage } from 'element-plus';

/**
 *  获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
 * @type {ProTableInstance}
 */
const proTable = ref<ProTableInstance>();

/**
 * 表格 Column 配置（ColumnProps）配置项
 * @type {ColumnProps}
 */
const columns: ColumnProps<any>[] = [
  { type: 'expand', label: '评论列表', width: 100 },
  { prop: 'id', label: 'ID', width: 100 },
  {
    prop: 'goods_item',
    label: '商品',
    width: 410,
    render({ row }) {
      return (
        <div class="flex items-center">
          <div class="good flex">
            {/* 图片加载失败时的回退行为。 */}
            <el-image
              src={row.goods_item.cover}
              fit="cover"
              lazy={true}
              class="mr-3 rounded"
              style="width:150px;height: 120px;"
            >
              <template /* error */>
                <img src="@/assets/img/notData.png" />
              </template>
            </el-image>
            <div class="flex-1 text-left">
              <p class="text-sm">{row.goods_item.title}</p>
              <div>
                <span class="text-rose-500">最低销售价￥{row.goods_item.min_price}</span>
                <el-divider direction="vertical" />
                <span class="text-teal-500 text-xxs">原价￥{row.goods_item.min_oprice}</span>
              </div>
              <p class="text-gray-400 text-xxs">创建时间：{row.goods_item.create_time}</p>
              <p class="text-gray-400 text-xxs">描述: {row.goods_item.desc}</p>
            </div>
          </div>
        </div>
      );
    }
  },
  {
    prop: 'user',
    label: '评价信息',
    render({ row }) {
      const customerName = row.user.nickname || row.user.username;
      return (
        <div>
          <p class="text-xs">用户名：{customerName}</p>
          <p>
            <el-rate v-model={row.rating} disabled show-score text-color="#ff9900" size="large" />
          </p>
        </div>
      );
    }
  },
  { prop: 'review_time', label: '评价时间', width: 200 },
  {
    prop: 'status',
    label: '是否显示',
    width: 180,
    render({ row }) {
      return (
        <el-switch
          v-model={row.status}
          active-value={1}
          inactive-value={0}
          disabled={row.super == 1}
          onChange={() => handleUpdateGoodsCommentStatus(row.id, row.status)}
        ></el-switch>
      );
    }
  }
];

const dataCallback = (res: any) => {
  res = res.list.map((goodsItem: any) => {
    goodsItem.textareaEdit = false;
    return goodsItem;
  });
};

const handleUpdateGoodsCommentStatus = (id: number, status: 0 | 1) => {
  updateGoodsCommentStatus(id, status)
    .then((res: boolean) => {
      if (res) {
        proTable.value?.getTableList().then(() => {
          ElMessage({
            message: '更新成功',
            type: 'success'
          });
        });
      }
    })
    .catch(() => {
      ElMessage({
        message: '非超级管理员禁止操作',
        type: 'error'
      });
    });
};

const textarea = ref('');

const openTextarea = (row: ListItem & { textareaEdit: boolean }, data: string = '') => {
  textarea.value = data;
  row.textareaEdit = true;
};

const review = (row: ListItem & { textareaEdit: boolean }) => {
  if (textarea.value == '') {
    return ElMessage({
      type: 'error',
      message: '回复内容不能为空'
    });
  }
  reviewGoodsComment(row.id, textarea.value).then((res) => {
    row.textareaEdit = false;
    ElMessage({
      message: '回复成功',
      type: 'success'
    });
    proTable.value?.getTableList();
  });
};
</script>
<style lang="less" scoped></style>
