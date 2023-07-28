<template>
  <!-- 分页组件 -->
  <el-pagination
    :background="true"
    layout="prev, pager ,next"
    :total="pageable.total"
    :current-page="pageable.pageNum"
    :page-size="pageable.pageSize"
    @current-change="handleCurrentChange"
  ></el-pagination>
</template>

<script setup lang="ts" name="Pagination">
interface Pageable {
  pageNum: number;
  pageSize: number;
  total: number;
}

export interface PaginationProps {
  pageable: Pageable;
  handleCurrentChange: (currentPage: number) => void;
}

defineProps<PaginationProps>();
</script>
