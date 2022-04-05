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
      const datas = [10, 23, 55, 67] // 图标用于处理的数据

      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('barChart'))

      // max 函数用于 获取数据里最大值
      const max = (datas) => Math.max.apply(null, datas)
      const getSymbolData = (datas) => datas.map((i) => ({ value: i, symbolPosition: 'end' }))
      // 背景xdata  渐变色柱状图   间隔色 两种  你可以设置多种
      var maxVal = max(datas)
      var bgData = Array(datas.length).fill(maxVal + 30)
      const option = {
        backgroundColor: '#000F32',
        // 在画布中各个位置的偏移量
        grid: { left: '8%', right: '10%', top: '20%', bottom: '15%' },
        xAxis: [
          {
            axisLine: { lineStyle: { type: 'solid', color: '#fff', width: '1' } },
            axisTick: { show: true, stroke: '#0f0' },
            axisLabel: { color: '#f00', fontSize: 20 },
            data: ['Mon', 'Tue', 'Wed', 'Thu'],
            splitLine: {
              show: true,
              lineStyle: {
                // type: 'dotted', // 写法 1
                type: [5, 20], // 写法 2
                dashOffset: 5
              }
            }
          },
          // x轴的第二个做阴影的数据对象
          {
            data: [],
            axisLine: { show: false },
            axisLabel: { show: false },
            axisTick: { show: false }
          }
        ],
        yAxis: [
          {
            position: 'left',
            type: 'value',
            axisLine: { show: false }
          }
        ],
        series: [
          {
            type: 'bar',
            data: datas,
            label: {
              show: true,
              position: 'top', // 汉字位于上方
              padding: 40, // 汉字距离柱状图间距
              color: '#fff',
              fontSize: 18,
              fontWeight: 800
            },
            itemStyle: { color: '#1F77D7' },
            barWidth: 32
          },
          {
            type: 'pictorialBar',
            // symbol: 'image://a.png',
            // symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
            symbol: 'path://M0,0 L0,10 L10,10 L10,0 z',
            // symbol: 'triangle',
            symbolSize: [40, 10],
            symbolOffset: [0, -22],
            z: 12,
            itemStyle: { color: '#fff' },
            data: getSymbolData(datas)
          },
          {
            type: 'bar',
            xAxisIndex: 1,
            data: bgData,
            itemStyle: {
              // color: 'rgba(255,255,255,.1)'
              // barBorderRadius: 20,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 1, color: '#082858' },
                { offset: 0.5, color: '#000F32' },
                { offset: 0.4, color: '#000F32' },
                { offset: 0.1, color: '#082858' }
              ])
            },
            z: 1
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
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
