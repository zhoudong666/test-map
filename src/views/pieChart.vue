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

      const option = {
        tooltip: {
          show: false,
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },

        graphic: {
          elements: [
            // {
            //   type: 'image',
            //   style: {
            //     image: './ccc.png',
            //     width: 120, // https://yp.a-hh.cn/zhjk/img.jpg
            //     height: 120
            //   },
            //   left: 'center',
            //   top: 'center'
            // }
            {
              type: 'text',
              left: 'center', // 相对父元素居中
              top: '50%', // 相对父元素上下的位置
              style: {
                fill: '#333333',
                text: ['总人数'],
                font: '12px Arial Normal'
              }
            }
          ]
        },
        legend: {
          orient: 'vertical',
          x: 'right', // 可设定图例在左、右、居中
          y: 'center', // 可设定图例在上、下、居中
          align: 'left', // 文字位置
          itemHeight: 16, // 每个图例的宽度
          itemWidth: 16, // 每个图例的高度
          itemGap: 20, // 图例每项之间的间隔
          textStyle: {
            color: '#fft' // 表示 label 的文字的颜色跟随色块
          },
          emphasis: {
            selectorLabel: {
              backgroundColor: '#ff00ff'
            }
          },
          // 重写legend显示样式
          formatter: function (name) {
            // 获取legend显示内容
            const data = option.series[0].data
            let total = 0
            let tarValue = 0
            for (let i = 0, l = data.length; i < l; i++) {
              total += data[i].value
              if (data[i].name === name) tarValue = data[i].value
            }
            const p = ((tarValue / total) * 100).toFixed(0)
            return name + ' ' + ' ' + p + '%'
          },
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 10,
              borderRadius: 10
            },
            label: {
              show: false,
              position: 'center'
            },
            labelLine: { show: false },
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ]
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
