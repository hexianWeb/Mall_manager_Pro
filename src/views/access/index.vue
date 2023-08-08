<!-- 不套用 proTable 组件 -->
<template>
  <el-card shadow="never" class="border-0">
    <el-tree
      :data="tableData"
      empty-text="暂无数据"
      :props="{ label: 'name', children: 'child' }"
      node-key="id"
      :default-expanded-keys="defaultExpandedKeys"
    >
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <el-tag size="small" :type="data.menu ? '' : 'info'">{{ data.menu ? '菜单' : '权限' }}</el-tag>
          <el-icon v-if="data.icon" :size="24" class="mx-2">
            <component :is="data.icon" />
          </el-icon>
          <span>{{ data.name }}</span>

          <div class="ml-auto">
            <el-switch
              :modelValue="data.status"
              :active-value="1"
              :inactive-value="0"
              @click.stop="handleStatusChange($event, data)"
            />
            <el-button text type="primary" size="small" @click.stop="handleEdit(data)">修改</el-button>
            <el-button text type="primary" size="small" @click.stop="addChild(data.id)">增加</el-button>

            <el-popconfirm
              title="是否要删除该记录？"
              confirmButtonText="确认"
              cancelButtonText="取消"
              @confirm="handleDelete(data.id)"
            >
              <template #reference>
                <el-button text type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </el-tree>
    <FormDrawer ref="formDrawerRef" :drawerTitle="drawerTitle" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="上级菜单" prop="rule_id">
          <el-cascader
            v-model="form.rule_id"
            :options="options"
            :props="{ value: 'id', label: 'name', children: 'child', checkStrictly: true, emitPath: false }"
            placeholder="请选择上级菜单"
          />
        </el-form-item>
        <el-form-item label="菜单/规则" prop="menu">
          <el-radio-group v-model="form.menu">
            <el-radio :label="1" border>菜单</el-radio>
            <el-radio :label="0" border>规则</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" style="width: 30%" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-if="form.menu == 1">
          <IconSelect v-model="form.icon" />
        </el-form-item>
        <el-form-item label="前端路由" prop="frontpath" v-if="form.menu == 1 && form.rule_id > 0">
          <el-input v-model="form.frontpath" placeholder="前端路由"></el-input>
        </el-form-item>
        <el-form-item label="后端规则" prop="condition" v-if="form.menu == 0">
          <el-input v-model="form.condition" placeholder="后端规则"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" prop="method" v-if="form.menu == 0">
          <el-select v-model="form.method" placeholder="请选择请求方式">
            <el-option v-for="item in ['GET', 'POST', 'PUT', 'DELETE']" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>
<script setup lang="tsx">
import FormDrawer from '@/base-ui/formDrawer/FormDrawer.vue';
import IconSelect from '@/base-ui/iconSelect/index.vue';
import { useTable, useInitForm } from '@/hooks/useCommon';
import { getRuleList, updateRule, createRule, updateRuleStatus } from '@/api/rule/index';

/**
 * 默认展开菜单的 key 值总汇
 */
const defaultExpandedKeys = ref<number[]>([]);
const options = ref([]);
const dataCallback = (res: any) => {
  defaultExpandedKeys.value = res.list.map((rule) => rule.id);
  options.value = res.rules;
};

const { tableData, getTableList } = useTable(getRuleList, {}, true, dataCallback);

const { formDrawerRef, formRef, form, rules, drawerTitle, handleSubmit, handleCreate, handleEdit } = useInitForm({
  form: {
    rule_id: 0,
    menu: 0,
    name: '',
    condition: '',
    method: 'GET',
    status: 1,
    order: 50,
    icon: '',
    frontpath: ''
  },
  rules: {},
  getData: getTableList,
  update: updateRule,
  create: createRule
});

// 添加子分类
const addChild = (id: number) => {
  handleCreate();
  form.rule_id = id;
  form.status = 1;
};

const handleStatusChange = ($event: number, data: any) => {
  updateRuleStatus(data.id, $event);
  ElMessage({
    message: '仅供演示，禁止更改',
    type: 'error'
  });
};
onMounted(() => {
  getTableList();
});
</script>

<style lang="less" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 17px;
  padding-right: 8px;
}
:deep(.el-tree-node__content) {
  padding: 20px 0;
}
</style>
