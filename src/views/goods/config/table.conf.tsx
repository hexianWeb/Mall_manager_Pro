import { ColumnProps } from '@/base-ui/ProTable/types';

// 表格配置项
const columns: ColumnProps<any>[] = [
  {
    prop: 'username',
    label: '管理员',
    width: 220,
    render({ row }) {
      return (
        <div class="flex items-center">
          <div class="avatar">
            {/* 图片加载失败时的回退行为。 */}
            <el-avatar size={60} src={row.avatar}>
              <img src="@/assets/img/notData.png" />
            </el-avatar>
          </div>
          <div class="detail ml-4">
            <p class="text-sm whitespace-nowrap" title={row.username}>
              {row.username}
            </p>
            <small class="text-xs text-zinc-400 oldstyle-nums">ID: {row.id}</small>
          </div>
        </div>
      );
    }
  },
  {
    prop: 'role',
    label: '状态',
    width: 200,
    render({ row }) {
      return (
        <el-switch
          v-model={row.status}
          size="small"
          active-value={1}
          inactive-value={0}
          onChange={() => handleUpdateManagerStatus(row.id, row.status)}
        />
      );
    }
  },
  { prop: 'role.name', label: '所属角色', tag: true },
  { prop: 'create_time', label: '最初创建时间', width: 300 },
  { prop: 'update_time', label: '最后修改时间', width: 300 },
  { prop: 'operation', label: '操作', fixed: 'right', width: 300 }
];
export default columns;
