import * as echarts from 'echarts'; import { getStatistics3 } from '../../../api/index/index';
<!-- VueWithTS -->
<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex justify-between">
        <span class="text-sm">订单统计</span>
        <div>
          <el-check-tag
            v-for="(item, index) in options"
            :key="index"
            :checked="current == item.value"
            style="margin-right: 8px"
            @click="handleChoose(item.value)"
            >{{ item.text }}</el-check-tag
          >
        </div>
      </div>
    </template>
    <div id="chart" style="width: 100%; height: 300px"></div>
  </el-card>
</template>
<script setup lang="ts" name="echartIndex">
import * as echarts from 'echarts';
import { getStatistics3 } from '@/api/index/index';
import { useResizeObserver } from '@vueuse/core';

const current = ref<string>('month');

function handleChoose(param: string) {
  current.value = param;
  getData();
}
const options = [
  {
    text: '近1个月',
    value: 'month'
  },
  {
    text: '近1周',
    value: 'week'
  },
  {
    text: '近24小时',
    value: 'hour'
  }
];
var myChart = null;
onMounted(() => {
  var chartDom = document.getElementById('chart');
  myChart = echarts.init(chartDom);
  getData();
});

//在离开页面时销毁数据
onBeforeUnmount(() => {
  if (myChart) echarts.dispose(myChart);
});

/**
 * 获取图表数据
 */
function getData() {
  let option = {
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ]
  };

  myChart.showLoading();
  getStatistics3(current.value)
    .then((res) => {
      option.xAxis.data = res.x;
      option.series[0].data = res.y;

      myChart.setOption(option);
    })
    .finally(() => {
      myChart.hideLoading();
    });
}

const el = ref<Element>(null);
// 监听窗口大小切换 修改图表大小
useResizeObserver(el, (entries) => myChart.resize());
</script>
<style lang="less" scoped></style>
