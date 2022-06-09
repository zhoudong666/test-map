<template>
  <div style="display: flex">
    <div id="percentGuage"></div>
  </div>
</template>

<script>
export default {
  name: 'percentGuage',
  data() {
    return {
      option: {
        // tooltip: { trigger: 'item' }
      },
      percentGuage: ''
    }
  },
  created() {},
  mounted() {
    this.initpercentGuage({ domId: 'percentGuage', finish: 460, plan: 1000 })
  },
  methods: {
    // echarts初始化
    initpercentGuage(opts) {
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
            startAngle: 360,
            endAngle: 0,
            min: 0,
            max: 1,
            splitNumber: 4,
            axisLine: { lineStyle: { width: 40 } },
            progress: { show: true, width: 40 },
            axisTick: { show: false },

            itemStyle: { color: 'green' },
            splitLine: { show: false, distance: 0, lineStyle: { color: 'red' } },
            axisLabel: {
              show: false,
              formatter: function (val) {
                return val * 100 + '%'
              }
            },
            pointer: { show: false },
            detail: {
              width: 40,
              lineHeight: 16,
              fontSize: 10,
              // offsetCenter: ['50%', '50%'],
              formatter: `{title|已完成/指标} \n {num|${opts.finish}/${opts.plan}}
              \n {title|完成率} \n {per|${((opts.finish / opts.plan) * 100).toFixed(2)}%}`,
              rich: {
                title: { color: '#999' },
                num: { fontWeight: 700, color: '#000' },
                per: { fontWeight: 700, color: '#000', fontSize: 16 }
              }
            },
            data: [{ value: opts.finish / opts.plan, detail: { offsetCenter: ['0%', '10%'] } }]
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
#percentGuage {
  width: 800px;
  height: 400px;
  border: 1px solid red;
}
</style>
