<!-- VueWithTS -->
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
    <!-- 分页器 -->
    <div class="footer">
      <div class="demo-pagination-block">
        <el-pagination
          v-bind="options.footer"
          :small="true"
          :disabled="false"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="options.footer.sizeChange"
          @current-change="options.footer.currentChange"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { NewUserInfo } from '@/service/main/user/types';

const props = defineProps({
  options: {
    type: Object,
    requied: true
  }
});
const emit = defineEmits(['selectOptions']);

// 表单过长解决方案
const TableContent = ref<HTMLElement | null>(null);
onMounted(() => {
  const instance = TableContent.value!;
  console.log(instance);

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
const multipleSelection = ref<NewUserInfo[]>([]);
const handleSelectionChange = (val: NewUserInfo[]) => {
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
    border-radius: 0 0 29px 29px;
    padding: 6px 29px;
    display: flex;
    justify-content: end;
    align-items: center;
  }
}
</style>
