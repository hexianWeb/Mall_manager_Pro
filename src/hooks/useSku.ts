import type { ReadGood, GoodsSkusCard, GoodsSkusCardValue, GoodsSku } from '@/api/goods/type';
import {
  createGoodsSkusCard,
  updateGoodsSkusCard,
  deleteGoodsSkusCard,
  sortGoodsSkusCard,
  createGoodsSkusCardValue,
  updateGoodsSkusCardValue,
  deleteGoodsSkusCardValue,
  chooseAndSetGoodsSkusCard
} from '@/api/goods/index';
import { cartesianProductOf, useArrayMoveDown, useArrayMoveUp } from '@/utils/moveArray';
// 当前商品ID
export const goodsId = ref(0);

interface GoodsSkusCardValueHasText extends GoodsSkusCardValue {
  id: number;
  text: string;
}

export interface GoodsSkusCardHasText extends GoodsSkusCard {
  text: string;
  goodsSkusCardValue: GoodsSkusCardValueHasText[];
}

// 规格选项列表
export const sku_card_list = ref<GoodsSkusCardHasText[]>();

export const sku_list = ref<GoodsSku[]>();

// 初始化规格选项列表
export function initSkuCardList(goodDetail: ReadGood) {
  goodsId.value = goodDetail.id;
  sku_card_list.value = goodDetail.goodsSkusCard.map((item) => {
    const newItem: GoodsSkusCardHasText = {
      ...item,
      text: item.name,
      goodsSkusCardValue: item.goodsSkusCardValue!.map((v) => ({
        ...v,
        text: v.value || '属性值'
      }))
    };
    return newItem;
  });
  sku_list.value = goodDetail.goodsSkus;
}

// 初始化规格设置表格
export function initSkuTable() {
  const skuLabels = computed(() => sku_card_list.value?.filter((item) => item.goodsSkusCardValue.length > 0));

  const tableTheads = computed(() => {
    let length = skuLabels.value!.length;
    return [
      {
        name: '商品规格',
        colspan: length,
        width: '',
        rowspan: length > 0 ? 1 : 2
      },
      {
        name: '销售价',
        width: '100',
        rowspan: 2
      },
      {
        name: '市场价',
        width: '100',
        rowspan: 2
      },
      {
        name: '成本价',
        width: '100',
        rowspan: 2
      },
      {
        name: '库存',
        width: '100',
        rowspan: 2
      },
      {
        name: '体积',
        width: '100',
        rowspan: 2
      },
      {
        name: '重量',
        width: '100',
        rowspan: 2
      },
      {
        name: '编码',
        width: '100',
        rowspan: 2
      }
    ];
  });
  return {
    skuLabels,
    tableTheads,
    sku_list
  };
}

// 初始化规格属性
export function initSkusCardItem(id: number | string) {
  const item = sku_card_list.value!.find((o) => o.id == id);
  const inputValue = ref('');
  const inputVisible = ref(false);
  const InputRef = ref();

  const handleInputConfirm = () => {
    if (!inputValue.value) {
      inputVisible.value = false;
      return;
    }
    createGoodsSkusCardValue({
      goods_skus_card_id: Number(id),
      name: item!.name,
      order: 50,
      value: inputValue.value
    })
      .then((res) => {
        item!.goodsSkusCardValue.push({
          ...res,
          text: res.value
        });
        getTableData();
      })
      .finally(() => {
        inputVisible.value = false;
        inputValue.value = '';
      });
  };

  const handleChange = (value: string, tag: GoodsSkusCardValueHasText) => {
    updateGoodsSkusCardValue(tag.id, {
      goods_skus_card_id: Number(id),
      name: item!.name,
      order: tag.order,
      value: value
    })
      .then(() => {
        tag.value = value;
        getTableData();
      })
      .catch(() => {
        tag.text = tag.value;
      });
  };

  const handleClose = (tag: GoodsSkusCardValueHasText) => {
    deleteGoodsSkusCardValue(tag.id).then(() => {
      let i = item!.goodsSkusCardValue.findIndex((o) => o.id === tag.id);
      if (i != -1) {
        item!.goodsSkusCardValue.splice(i, 1);
      }
      getTableData();
    });
  };

  const showInput = () => {
    inputVisible.value = true;
    nextTick(() => {
      InputRef.value.input.focus();
    });
  };
  return {
    item,
    inputValue,
    inputVisible,
    InputRef,
    handleInputConfirm,
    handleChange,
    handleClose,
    showInput
  };
}

// 添加规格选项
export function addSkuCardEvent(e: number) {
  createGoodsSkusCard({
    goods_id: goodsId.value,
    name: '规格选项',
    order: 50,
    type: 0
  }).then((res) => {
    sku_card_list.value!.push({
      ...res,
      text: res.name,
      goodsSkusCardValue: []
    });
  });
}

// 删除规格选项
export function handleDelete(item: GoodsSkusCardHasText) {
  deleteGoodsSkusCard(item.id).then(() => {
    const i = sku_card_list.value!.findIndex((o) => o.id == item.id);
    if (i != -1) {
      sku_card_list.value!.splice(i, 1);
    }
    getTableData();
  });
}

// 修改规格选项
export function handleUpdate(item: GoodsSkusCardHasText) {
  updateGoodsSkusCard(item.id, {
    goods_id: item.goods_id,
    name: item.text,
    order: item.order,
    type: 0
  })
    .then(() => {
      item.name = item.text;
      ElMessage({
        type: 'success',
        message: '修改规格选项成功'
      });
      getTableData();
    })
    .catch(() => {
      item.text = item.name;
      ElMessage({
        type: 'error',
        message: '修改规格选项失败'
      });
    });
}

//排序规格选项
export function sortCard(action: 'up' | 'down', index: number) {
  let rawCopyList = JSON.parse(JSON.stringify(sku_card_list.value));
  let func = action == 'up' ? useArrayMoveUp<GoodsSkusCardHasText> : useArrayMoveDown<GoodsSkusCardHasText>;
  let copyList = func(rawCopyList, index);
  let sortData = copyList.map((item: GoodsSkusCardHasText, i: number) => {
    return {
      id: item.id,
      order: i + 1
    };
  });
  sortGoodsSkusCard({
    sortdata: sortData
  }).then(() => {
    sku_card_list.value = func(sku_card_list.value!, index);
    getTableData();
  });
}

// 选择设置规格
export function handleChooseSetGoodsSkusCard(id: number, data: { name: string; value: string[] }) {
  let item = sku_card_list.value!.find((o) => o.id == id) as GoodsSkusCardHasText;
  chooseAndSetGoodsSkusCard(id, data).then((res: any) => {
    item.name = item.text = res.goods_skus_card.name;
    item.goodsSkusCardValue = res.goods_skus_card_value.map((o) => {
      o.text = o.value || '属性值';
      return o;
    });
    getTableData();
  });
}

// 获取规格表格数据
function getTableData() {
  if (sku_card_list.value!.length === 0) return [];

  let list: any = [];
  sku_card_list.value!.forEach((o) => {
    if (o.goodsSkusCardValue && o.goodsSkusCardValue.length > 0) {
      list.push(o.goodsSkusCardValue);
    }
  });

  if (list.length == 0) {
    return [];
  }
  let arr = cartesianProductOf(...list);

  // 获取之前的规格列表，将规格ID排序之后转化成字符串
  let beforeSkuList = JSON.parse(JSON.stringify(sku_list.value)).map((o: any) => {
    if (!Array.isArray(o.skus)) {
      o.skus = Object.keys(o.skus).map((k) => o.skus[k]);
    }
    o.skusId = o.skus
      .sort((a, b) => a.id - b.id)
      .map((s) => s.id)
      .join(',');
    return o;
  });

  sku_list.value = [];
  sku_list.value = arr.map((skus) => {
    let o = getBeforeSkuItem(JSON.parse(JSON.stringify(skus)), beforeSkuList);
    return {
      code: o?.code || '',
      cprice: o?.cprice || '0.00',
      goods_id: goodsId.value,
      image: o?.image || '',
      oprice: o?.oprice || '0.00',
      pprice: o?.pprice || '0.00',
      skus,
      stock: o?.stock || 0,
      volume: o?.volume || 0,
      weight: o?.weight || 0
    };
  });
}
function getBeforeSkuItem(skus, beforeSkuList) {
  let skusId = skus
    .sort((a, b) => a.id - b.id)
    .map((s) => s.id)
    .join(',');
  return beforeSkuList.find((o) => {
    if (skus.length > o.skus.length) {
      return skusId.indexOf(o.skusId) != -1;
    }
    return o.skusId.indexOf(skusId) != -1;
  });
}
