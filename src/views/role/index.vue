<template>
  <ProTableComponent ref="proTable" :columns="columns" :requestApi="getRoleList" :init-param="initParam">
    <template #tableHeader="scope">
      <el-button type="primary" @click="handleCreate()">
        <el-icon :size="20"> <CirclePlus /> </el-icon>
        <span class="pl-1">新增角色</span>
      </el-button>
    </template>
    <template #operation="scope">
      <el-button type="primary" size="small" text @click="openSetRule(scope.row)">配置权限</el-button>
      <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
      <el-popconfirm
        title="是否要删除该权限？"
        confirmButtonText="确认"
        cancelButtonText="取消"
        @confirm="deleteRoleById(scope.row.id)"
      >
        <template #reference>
          <el-button text type="primary" size="small">删除</el-button>
        </template>
      </el-popconfirm>
    </template>
  </ProTableComponent>

  <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="desc">
        <el-input v-model="form.desc" placeholder="角色描述" type="textarea" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="0"> </el-switch>
      </el-form-item>
    </el-form>
  </FormDrawer>

  <!-- 权限配置 -->
  <FormDrawer ref="setRuleFormDrawerRef" title="权限配置" @submit="handleSetRuleSubmit">
    <el-tree-v2
      ref="elTreeRef"
      node-key="id"
      :default-expanded-keys="defaultExpandedKeys"
      :data="ruleList"
      :props="{ label: 'name', children: 'child' }"
      show-checkbox
      :height="treeHeight"
      :check-strictly="checkStrictly"
      @check="handleTreeCheck"
    >
      <template #default="{ node, data }">
        <div class="flex items-center">
          <el-tag :type="data.menu ? '' : 'info'" size="small">
            {{ data.menu ? '菜单' : '权限' }}
          </el-tag>
          <span class="ml-2 text-sm"> {{ data.name }} </span>
        </div>
      </template>
    </el-tree-v2>
  </FormDrawer>
</template>
<script setup lang="tsx">
import type { FormInstance } from 'element-plus/es/components/form';
import type { ProTableInstance, ColumnProps } from '@/base-ui/ProTable/types';
import type { ElTreeV2 } from 'element-plus/es/components/tree-v2';
import ProTableComponent from '@/base-ui/ProTable/src/index.vue';
import FormDrawer from '@/base-ui/formDrawer/FormDrawer.vue';
import { getRoleList, createRole, updateRole, updateRoleStatus, deleteRole, setRoles } from '@/api/role/index';
import { getRuleList } from '@/api/rule';
import { useInitForm } from '@/hooks/useCommon';
import { Rule } from '../../api/rule/type';

/**
 * 如果表格需要初始化请求参数，直接定义传给 ProTable 之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据
 * @type {Object}
 */
const initParam = reactive({});

/**
 *  获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
 * @type {ProTableInstance}
 */
const proTable = ref<ProTableInstance>();

/**
 * ProTable 配置项
 */
const columns: ColumnProps<any>[] = [
  { prop: 'name', label: '角色名称' },
  { prop: 'desc', label: '角色描述', width: 380 },
  {
    prop: 'status',
    label: '状态',
    width: 200,
    render({ row }) {
      return (
        <el-switch
          v-model={row.status}
          size="small"
          active-value={1}
          inactive-value={0}
          onChange={() => handleUpdateRoleStatus(row.id, row.status)}
        />
      );
    }
  },
  { prop: 'create_time', label: '最初创建时间', width: 300 },
  { prop: 'update_time', label: '最后修改时间', width: 300 },
  { prop: 'operation', label: '操作', fixed: 'right', width: 280 }
];

const { formDrawerRef, formRef, form, rules, drawerTitle, handleSubmit, handleCreate, handleEdit } = useInitForm({
  form: {
    name: '',
    desc: '',
    status: 1
  },
  rules: {
    name: [
      {
        required: true,
        message: '角色名称不能为空',
        trigger: 'blur'
      }
    ]
  },
  getData: () => proTable.value!.getTableList(),
  update: updateRole,
  create: createRole
});

const deleteRoleById = (id: number) => {
  deleteRole(id)
    .then((res) => {
      if (typeof res == 'boolean' && res == true) {
        ElMessage({
          message: '删除成功',
          type: 'success'
        });
        proTable.value!.getTableList();
      }
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
const handleUpdateRoleStatus = (id: number, status: number) => {
  updateRoleStatus(id, status)
    .then((res: any) => {
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
    });
};

const setRuleFormDrawerRef = ref<typeof FormDrawer | null>(null);
const ruleList = ref<Rule[]>([]);
const defaultExpandedKeys = ref<number[]>([]);
const treeHeight = ref(0);
const roleId = ref(0);
const checkStrictly = ref(false);
const userHasRuleIds = ref<number[]>([]);
const elTreeRef = ref<InstanceType<typeof ElTreeV2>>();

const openSetRule = (row: Rule) => {
  roleId.value = row.id;
  treeHeight.value = window.innerHeight - 180;
  checkStrictly.value = true;
  getRuleList(1).then((res) => {
    ruleList.value = res.list;
    defaultExpandedKeys.value = res.list.map((rule) => rule.id);
    setRuleFormDrawerRef.value!.open();

    // 当前角色拥有的权限ID
    userHasRuleIds.value = row.rules!.map((item) => item.id);
    setTimeout(() => {
      elTreeRef.value!.setCheckedKeys(userHasRuleIds.value);
      checkStrictly.value = false;
    }, 0);
  });
};

const handleSetRuleSubmit = () => {
  setRoles(roleId.value, userHasRuleIds.value).then(() => {
    ElMessage({
      message: '设定成功',
      type: 'success'
    });
    proTable.value?.getTableList().then(() => {
      setRuleFormDrawerRef.value!.close();
    });
  });
};

const handleTreeCheck = (...e: any) => {
  const { checkedKeys, halfCheckedKeys } = e[1];
  userHasRuleIds.value = [...checkedKeys, ...halfCheckedKeys];
};
</script>
