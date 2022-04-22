<template>
  <div style="display: flex">
    <div id="gaugeChart"></div>
  </div>
</template>

<script>
export default {
  name: 'gaugeChart',
  data() {
    return {
      option: {
        tooltip: { trigger: 'item' }
      },
      gaugeChart: ''
    }
  },
  created() {},
  mounted() {
    this.initgaugeChart({ domId: 'gaugeChart', finish: 460, plan: 1000 })
  },
  methods: {
    // echarts初始化
    initgaugeChart(opts) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById(opts.domId))

      const option = {
        tooltip: {
          show: false,
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },

        series: [
          {
            type: 'gauge',
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 1,
            splitNumber: 4,
            progress: { show: true },
            axisTick: { show: false },
            itemStyle: { color: 'pink' },
            splitLine: { distance: 0, lineStyle: { color: 'red' } },
            axisLabel: {
              show: true,
              formatter: function (val) {
                return val * 100 + '%'
              }
            },
            detail: {
              width: 40,
              lineHeight: 18,
              fontSize: 10,
              formatter: `{title|已完成/指标} \n {num|${opts.finish}/${opts.plan}} 
              \n {title|完成率} \n {per|${((opts.finish / opts.plan) * 100).toFixed(2)}%}`,
              rich: {
                title: { color: '#999' },
                num: { fontWeight: 700, color: '#000' },
                per: { fontWeight: 700, color: '#000', fontSize: 16 }
              }
            },
            data: [{ value: opts.finish / opts.plan, detail: { offsetCenter: ['0%', '60%'] } }]
          },
          {
            type: 'gauge',
            startAngle: 160,
            endAngle: 20,
            min: 0,
            max: 1,
            splitNumber: 3,
            progress: { show: false },
            axisTick: { show: false },
            itemStyle: { show: false, color: 'pink' },
            splitLine: { show: false, distance: 0, lineStyle: { color: 'red' } },
            axisLabel: {
              color: 'blue',
              fontWeight: 700,
              fontSize: 14,
              distance: 40,
              formatter: function (val) {
                if (val > 0.75) return '优'
                if (val > 0.5) return '良'
                if (val > 0.25) return '中'
                return '差'
              }
            }
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
#gaugeChart {
  width: 800px;
  height: 400px;
  border: 1px solid red;
}
</style>
