import { VNode, ComponentPublicInstance } from 'vue';
import { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults';
import { ProTableProps } from '@/base-ui/ProTable/src/index.vue';
import ProTable from '@/base-ui/ProTable/src/index.vue';

export interface EnumProps {
  label?: string; // 选项框显示的文字
  value?: string | number | boolean | any[]; // 选项框值
  disabled?: boolean; // 是否禁用此选项
  tagType?: string; // 当 tag 为 true 时，此选择会指定 tag 显示类型
  children?: EnumProps[]; // 为树形选择时，可以通过 children 属性指定子选项
  [key: string]: any;
}

export type TypeProps = 'index' | 'selection' | 'expand';

export type FieldNamesProps = {
  label: string;
  value: string;
  children?: string;
};

export type RenderScope<T> = {
  row: T;
  $index: number;
  column: TableColumnCtx<T>;
  [key: string]: any;
};

export type HeaderRenderScope<T> = {
  $index: number;
  column: TableColumnCtx<T>;
  [key: string]: any;
};

export interface ColumnProps<T = any>
  extends Partial<Omit<TableColumnCtx<T>, 'children' | 'renderCell' | 'renderHeader'>> {
  tag?: boolean; // 是否是标签展示
  isShow?: boolean; // 是否显示在表格当中
  enum?: EnumProps[] | ((params?: any) => Promise<any>); // 枚举类型（字典）
  isFilterEnum?: boolean; // 当前单元格值是否根据 enum 格式化（示例：enum 只作为搜索项数据）
  fieldNames?: FieldNamesProps; // 指定 label && value && children 的 key 值
  render?: (scope: RenderScope<T>) => VNode | string; // 自定义单元格内容渲染（tsx语法）
  headerRender?: (scope: HeaderRenderScope<T>) => VNode; // 自定义表头内容渲染（tsx语法）
  _children?: ColumnProps<T>[]; // 多级表头
}

export type ProTableInstance = Omit<InstanceType<typeof ProTable>, keyof ComponentPublicInstance | keyof ProTableProps>;
