import type { FormInstance } from 'element-plus/es/components/form';
import FormDrawer from '@/base-ui/formDrawer/FormDrawer.vue';
import { Table } from './interface';
/**
 * @description table 页面操作方法封装
 * @param {Function} requestApi 获取表格数据 requestApi 方法 (必传)
 * @param {Object} initParam 获取数据初始化参数 (非必传，默认为{})
 * @param {Boolean} isPageable 是否有分页 (非必传，默认为true)
 * @param {Function} dataCallBack 对后台返回的数据进行处理的方法 (非必传)
 * */
export const useTable = (
  requestApi?: (page: number, params: any) => Promise<any>,
  initParam: object = {},
  isPageable: boolean = true,
  dataCallBack?: (data: any) => any,
  requestError?: (error: any) => void
) => {
  let state = reactive<Table.Options>({
    // 表格数据
    tableData: [],
    // 分页数据
    pageable: {
      // 当前页数
      pageNum: 1,
      // 每页显示条数
      pageSize: 10,
      // 总条数
      totalCount: 0
    },
    // 查询参数(只包括查询)
    searchParam: {},
    // 初始化默认的查询参数
    searchInitParam: {},
    // 总参数(包含分页和查询参数)
    totalParam: {}
  });

  /**
   * @description 分页查询参数(只包括分页和表格字段排序,其他排序方式可自行配置)
   * */
  const pageParam = computed({
    get: () => {
      return {
        pageNum: state.pageable.pageNum,
        pageSize: state.pageable.pageSize
      };
    },
    set: (newVal: any) => {
      console.log('我是分页更新之后的值', newVal);
    }
  });

  /**
   * @description 获取表格数据
   * @return void
   * */
  const getTableList = async () => {
    if (!requestApi) return;
    try {
      // 先把初始化参数和分页参数放到总参数里面
      Object.assign(state.totalParam, initParam, isPageable ? pageParam.value : {});
      let res = await requestApi(pageParam.value.pageNum, { ...state.searchInitParam, ...state.totalParam });
      if (dataCallBack && typeof dataCallBack == 'function') {
        dataCallBack(res);
      }
      state.tableData = isPageable ? res.list : res;
      // 解构后台返回的分页数据 (如果有分页更新分页信息)
      if (isPageable) {
        updatePageable({
          pageNum: state.pageable.pageNum,
          pageSize: state.pageable.pageSize,
          totalCount: res.totalCount
        });
      }
    } catch (error) {
      console.log(error);
      requestError && requestError(error);
    }
  };

  /**
   * @description 更新查询参数
   * @return void
   * */
  const updatedTotalParam = () => {
    state.totalParam = {};
    // 处理查询参数，可以给查询参数加自定义前缀操作
    let nowSearchParam: Table.Options['searchParam'] = {};
    // 防止手动清空输入框携带参数（这里可以自定义查询参数前缀）
    for (let key in state.searchParam) {
      // * 某些情况下参数为 false/0 也应该携带参数
      if (state.searchParam[key] || state.searchParam[key] === false || state.searchParam[key] === 0) {
        nowSearchParam[key] = state.searchParam[key];
      }
    }
    Object.assign(state.totalParam, nowSearchParam, isPageable ? pageParam.value : {});
  };

  /**
   * @description 更新分页信息
   * @param {Object} pageable 后台返回的分页数据
   * @return void
   * */
  const updatePageable = (pageable: Table.Pageable) => {
    Object.assign(state.pageable, pageable);
  };

  /**
   * @description 表格数据查询
   * @return void
   * */
  const search = () => {
    state.pageable.pageNum = 1;
    updatedTotalParam();
    getTableList();
  };

  /**
   * @description 表格数据重置
   * @return void
   * */
  const reset = () => {
    state.pageable.pageNum = 1;
    state.searchParam = {};
    // 重置搜索表单的时，如果有默认搜索参数，则重置默认的搜索参数
    Object.keys(state.searchInitParam).forEach((key) => {
      state.searchParam[key] = state.searchInitParam[key];
    });
    updatedTotalParam();
    getTableList();
  };

  /**
   * @description 每页条数改变
   * @param {Number} val 当前条数
   * @return void
   * */
  const handleSizeChange = (val: number) => {
    state.pageable.pageNum = 1;
    state.pageable.pageSize = val;
    getTableList();
  };

  /**
   * @description 当前页改变
   * @param {Number} val 当前页
   * @return void
   * */
  const handleCurrentChange = (val: number) => {
    state.pageable.pageNum = val;
    getTableList();
  };

  return {
    ...toRefs(state),
    getTableList,
    search,
    reset,
    handleSizeChange,
    handleCurrentChange,
    updatedTotalParam
  };
};

export interface FormOptions {
  form: Record<string, any>;
  rules?: Record<string, any>;
  update: (id: number, form: Record<string, any>) => Promise<any>;
  create: (form: Record<string, any>) => Promise<any>;
  getData: (page?: number | false) => Promise<void>;
  beforeSubmit?: Function;
}

/**
 * @description FormDrawer 组件页面操作方法封装
 * @param opt 所需要参数
 */
export function useInitForm(opt: FormOptions) {
  // 表单部分
  const formDrawerRef = ref<typeof FormDrawer | null>(null);
  const formRef = ref<FormInstance>();
  const defaultForm: Record<string, any> = opt.form;
  const form = reactive<Record<string, any>>({});
  const rules: Record<string, any> = opt.rules || {};
  const editId = ref<number>(0);
  const drawerTitle = computed(() => (editId.value ? '修改' : '新增'));

  const handleSubmit = () => {
    if (!formRef.value) return;
    formRef.value.validate((valid: boolean) => {
      if (!valid) return;
      let processForm = {};
      if (opt.beforeSubmit) {
        processForm = opt.beforeSubmit({ ...form });
      } else {
        processForm = form;
      }
      const fun = editId.value ? opt.update(editId.value, processForm) : opt.create(processForm);

      fun
        .then(() => {
          ElMessage({
            message: drawerTitle.value + '成功',
            type: 'success'
          });
          // 修改刷新当前页，新增刷新第一页
          opt.getData(editId.value ? false : 1);
          formDrawerRef.value!.close();
        })
        .catch((err) => {
          ElMessage({
            message: '错误:' + err.msg,
            type: 'error'
          });
        });
    });
  };

  // 重置表单
  function resetForm(row: Record<string, any> | false = false) {
    if (formRef.value) formRef.value.clearValidate();
    for (const key in defaultForm) {
      form[key] = row ? row[key] : defaultForm[key];
    }
  }

  // 新增
  const handleCreate = () => {
    editId.value = 0;
    resetForm();
    formDrawerRef.value!.open();
  };

  // 编辑
  const handleEdit = (row: Record<string, any>) => {
    editId.value = row.id;
    resetForm(row);
    formDrawerRef.value!.open();
  };

  return {
    formDrawerRef,
    formRef,
    form,
    rules,
    editId,
    drawerTitle,
    handleSubmit,
    resetForm,
    handleCreate,
    handleEdit
  };
}
