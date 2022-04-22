<template>
  <div style="display: flex">
    <div id="barChart"></div>
  </div>
</template>

<script>
import { LinearGradient } from 'echarts/lib/export/api/graphic'
export default {
  name: 'barChart',
  data() {
    return {
      option: {
        tooltip: { trigger: 'item' }
      },
      barChart: ''
    }
  },
  created() {},
  mounted() {
    this.initBarChart()
  },
  methods: {
    // echarts初始化
    initBarChart() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('barChart'))

      const option2 = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'none' },
          formatter: function (params) {
            return params[0].name + ': ' + params[0].value
          }
        },
        xAxis: {
          data: ['驯鹿', '火箭', '飞机'],
          axisTick: { show: false },
          axisLine: { show: true },
          axisLabel: { color: '#e54035' }
        },
        yAxis: {
          splitLine: { show: true },
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: { show: true }
        },
        color: ['#e54035'],
        series: [
          {
            name: 'hill',
            type: 'pictorialBar',
            // barCategoryGap: '30%',
            symbol: 'path://M0,10 L10,10 L5,0 L0,10 z', // 三角形
            // symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
            barWidth: 40,
            itemStyle: {
              // opacity: 1
              color: new LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: 'pink' }, // 开始位置
                { offset: 1, color: 'red' }
              ])
            },
            data: [123, 60, 25],
            z: 10
          },
          {
            name: 'hill2',
            type: 'pictorialBar',
            // barCategoryGap: '130%',
            symbolOffset: [35, 0],
            // symbol: 'path://M0,10 L10,10 L5,0 L0,10 z', // 三角形
            symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
            itemStyle: {
              // opacity: 0.5
              color: 'green'
            },
            barWidth: 40,
            emphasis: {
              itemStyle: {
                opacity: 1
              }
            },
            data: [13, 40, 125],
            z: 10
          },
          {
            type: 'bar',
            data: [150, 150, 150],
            itemStyle: {
              // color: 'rgba(255,255,255,.1)'
              color: '#ccc',
              opacity: 0.3
            },
            z: 1
          },
          {
            name: 'glyph',
            type: 'pictorialBar',
            barGap: '-100%',
            symbolPosition: 'end',
            // symbolSize: 30,
            // symbolOffset: [0, '-20%'],
            data: [
              { value: 123, symbol: 'trangle', symbolSize: [20, 20], symbolOffset: [-20, '-120%'] },
              { value: 60, symbol: 'trangle', symbolSize: [20, 20], symbolOffset: [-20, '-120%'] },
              { value: 25, symbol: 'trangle', symbolSize: [20, 20], symbolOffset: [-20, '-120%'] }
            ]
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option2)
    }
  }
}
</script>

<style>
#barChart {
  width: 800px;
  height: 400px;
  border: 1px solid red;
}
</style>
