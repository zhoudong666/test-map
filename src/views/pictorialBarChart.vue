<template>
  <div style="display: flex">
    <div id="barChart"></div>
  </div>
</template>

<script>
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
            barCategoryGap: '30%',
            // symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',  // 三角形
            symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
            itemStyle: {
              // opacity: 0.5
            },
            emphasis: {
              itemStyle: {
                opacity: 1
              }
            },
            data: [123, 60, 25],
            z: 10
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
  height: 500px;
  border: 1px solid red;
}
</style>
