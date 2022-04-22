<template>
  <div class="line-container">
    <!-- <p>点击省份可以跳转到省级地图(省级数据只有青海和内蒙古,点击其他省份展示重复数据)</p>
    <p>点击市可以跳转到市级地图(市数据只有锡林郭勒)市数据有颜色块区分</p>
    <p>点击地图空白处回到上一级地图</p> -->
    <div style="display: flex">
      <div id="mapChart"></div>
      <div id="provinceChart"></div>
    </div>
    <svg-icon icon-class="download" style="font-size: 40px; color: red"></svg-icon>
  </div>
</template>

<script>
import chinaJson from '@/utils/map/china.json' // json数据引入

import axios from 'axios'
export default {
  name: 'mapChina',
  data() {
    return {
      option: {
        backgroundColor: '#000F32',
        // title: { text: '中国地图'  subtext: '鼠标缩放比例大于2.5展示名称'  },
        tooltip: { trigger: 'item' },
        visualMap: {
          min: 1,
          max: 1000,
          text: ['High', 'Low'],
          realtime: true,
          calculable: true,
          inRange: {
            color: ['#4c77da', '#3436b7']
          },
          seriesIndex: 0
        },
        geo: {
          map: 'china',
          zoom: 1.2,
          roam: true,
          seriesIndex: 0,

          // nameMap: { China: '中国' }, // 自定义地区的名称映射，
          center: [103.948024, 35.263161], // 中心点(经纬度)
          // 鼠标划过区块的样式 颜色
          emphasis: {
            areaColor: '#0f0',
            label: { color: '#fff' }
          },
          // 是否显示省市名称
          label: { show: false, color: '#fff' },
          itemStyle: {
            areaColor: '#4474ec',
            borderColor: '#fff'
          }
        }
      },
      mapChart: '',
      provinceChart: ''
    }
  },
  created() {},
  mounted() {
    this.getMapChart()
  },
  methods: {
    renderProvinceChart(params) {
      this.provinceChart = this.provinceChart || this.$echarts.init(document.getElementById('provinceChart'))
      axios.get(`static/province/${params.name}.geoJson`).then((res) => {
        this.$echarts.registerMap('province', res.data)
        var option = {
          tooltip: { trigger: 'item' },
          visualMap: {
            min: 1,
            max: 1000,
            text: ['High', 'Low'],
            realtime: true,
            calculable: true,
            inRange: { color: ['#ff0000', '#00ff00'] },
            seriesIndex: 0
          },
          geo: {
            map: 'province',
            zoom: 1.2,
            roam: true,
            seriesIndex: 1,
            itemStyle: {
              areaColor: '#4474ec',
              borderColor: '#fff'
            },
            label: {
              show: true
            },
            emphasis: {
              label: {
                // show: false
              },
              itemStyle: {
                areaColor: '#4474ec'
              }
            }
          },
          series: [
            { type: 'map', map: 'province', geoIndex: 0, label: { show: true } },
            {
              // 涟漪效果
              name: 'Top 6',
              type: 'effectScatter',
              coordinateSystem: 'geo',
              geoIndex: 0,
              symbol:
                'path://M937.472 404.864A450.496 450.496 0 0 0 494.72 74.016c473.376 229.728 260.416 555.52 260.416 555.52l-274.272-277.408 105.024-113.376-72.192-66.464-56.896 50.56-106.496-1.44-215.168 218.144 131.2 117.728 81.664-78.016 280.096 269.472c-238.496 154.56-455.136-99.712-455.136-99.712l-85.344 73.6 64.928 75.136-10.944 15.168a51.584 51.584 0 0 0-43.04 10.816c-74.4 71.52 15.328 110.528 15.328 110.528 86.784 19.488 83.2-70.08 83.2-70.08l16-20.224c326.784 174.816 520.064 18.048 520.064 18.048l94.112 87.424 128.384-127.136-83.904-90.304c-0.704 0 113.792-166.848 65.664-327.232"',
              data: [
                {
                  name: '连云港市',
                  value: [119.178821, 34.600018, 14500]
                }
              ],
              symbolSize: 30,
              // symbolSize: function (val) {
              //   return val[2] / 200;
              // },
              encode: {
                value: 2
              },
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(230, 10, 10, 1)',
                color: '#ff3040'
              },
              zlevel: 1
            }
          ]
        }
        this.provinceChart.setOption(option)
      })
    },
    // echarts初始化
    async getMapChart() {
      this.mapChart = this.$echarts.init(document.getElementById('mapChart'))
      this.$echarts.registerMap('china', chinaJson)
      this.option.series = [
        {
          type: 'map',
          name: '所发生的',
          // geoIndex 指定geo属性后，series-map.map 属性，以及 series-map.itemStyle 等样式
          // 配置不再起作用，而是采用 geo 中的相应属性。
          geoIndex: 0,
          map: 'china', // 使用 registerMap 注册的地图名称。
          selectedMode: false, // 是否开启选中效果,默认开启
          data: [
            { name: '北京市', value: Math.round(Math.random() * 1000) },
            { name: '天津市', value: Math.round(Math.random() * 1000) },
            { name: '上海市', value: Math.round(Math.random() * 1000) },
            { name: '重庆市', value: Math.round(Math.random() * 1000) },
            { name: '河北省', value: Math.round(Math.random() * 1000) },
            { name: '河南省', value: Math.round(Math.random() * 1000) },
            { name: '云南省', value: Math.round(Math.random() * 1000) },
            { name: '辽宁省', value: Math.round(Math.random() * 1000) },
            { name: '黑龙江省', value: Math.round(Math.random() * 1000) },
            { name: '湖南省', value: Math.round(Math.random() * 1000) },
            { name: '安徽省', value: Math.round(Math.random() * 1000) },
            { name: '山东省', value: Math.round(Math.random() * 1000) },
            { name: '新疆维吾尔自治区', value: Math.round(Math.random() * 1000) },
            { name: '江苏省', value: Math.round(Math.random() * 1000) },
            { name: '浙江省', value: Math.round(Math.random() * 1000) },
            { name: '江西省', value: Math.round(Math.random() * 1000) },
            { name: '湖北省', value: Math.round(Math.random() * 1000) },
            { name: '广西壮族自治区', value: Math.round(Math.random() * 1000) },
            { name: '甘肃省', value: Math.round(Math.random() * 1000) },
            { name: '山西省', value: Math.round(Math.random() * 1000) },
            { name: '内蒙古自治区', value: Math.round(Math.random() * 1000) },
            { name: '陕西省', value: Math.round(Math.random() * 1000) },
            { name: '吉林省', value: Math.round(Math.random() * 1000) },
            { name: '福建省', value: Math.round(Math.random() * 1000) },
            { name: '贵州省', value: Math.round(Math.random() * 1000) },
            { name: '广东省', value: Math.round(Math.random() * 1000) },
            { name: '青海省', value: Math.round(Math.random() * 1000) },
            { name: '西藏自治区', value: Math.round(Math.random() * 1000) },
            { name: '四川省', value: Math.round(Math.random() * 1000) },
            { name: '宁夏回族自治区', value: Math.round(Math.random() * 1000) },
            { name: '海南省', value: Math.round(Math.random() * 1000) },
            { name: '台湾省', value: Math.round(Math.random() * 1000) },
            { name: '香港特别行政区', value: Math.round(Math.random() * 1000) },
            { name: '澳门特别行政区', value: Math.round(Math.random() * 1000) }
          ]
        },
        // {
        //   name: '企业分布', // 红色标注
        //   type: 'custom',
        //   coordinateSystem: 'geo',
        //   clickable: true,
        //   data: [{ name: '江苏省', value: [118.767413, 32.041544, 100] }],
        //   renderItem: function (params, api) {
        //     console.log(params, api)
        //     return {
        //       type: 'image',
        //       name: 'aaa',
        //       style: {
        //         image: require('@/assets/icon_mark.png'), // 标注点图标
        //         width: 14,
        //         height: 18,
        //         x: 118.767413,
        //         y: 32.041544
        //         // x: api.coord([markList[params.dataIndex].value[0], markList[params.dataIndex].value[1]])[0],
        //         // y: api.coord([markList[params.dataIndex].value[0], markList[params.dataIndex].value[1]])[1]
        //       }
        //     }
        //   }
        // },
        {
          name: 'Top 6',
          type: 'scatter',
          geoIndex: 0,
          // tooltip: { show: false },
          symbol22:
            'path://M937.472 404.864A450.496 450.496 0 0 0 494.72 74.016c473.376 229.728 260.416 555.52 260.416 555.52l-274.272-277.408 105.024-113.376-72.192-66.464-56.896 50.56-106.496-1.44-215.168 218.144 131.2 117.728 81.664-78.016 280.096 269.472c-238.496 154.56-455.136-99.712-455.136-99.712l-85.344 73.6 64.928 75.136-10.944 15.168a51.584 51.584 0 0 0-43.04 10.816c-74.4 71.52 15.328 110.528 15.328 110.528 86.784 19.488 83.2-70.08 83.2-70.08l16-20.224c326.784 174.816 520.064 18.048 520.064 18.048l94.112 87.424 128.384-127.136-83.904-90.304c-0.704 0 113.792-166.848 65.664-327.232"',
          symbol: 'pin',
          coordinateSystem: 'geo',
          data: [{ name: '江苏省', value: [118.767413, 32.041544, 1000] }],
          symbolSize: 20,
          label: {
            formatter: '{b}',
            position: 'right',
            show: false
          },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(230, 10, 10, 1)',
            color: 'red'
          },
          zlevel: 1
        }
      ]
      this.mapChart.setOption(this.option)
      // 点击地图省份
      this.mapChart.on('click', (params) => {
        // console.log(params.name)
        if (params.name === '南海诸岛') return
        this.renderProvinceChart(params)
      })

      this.mapChart.dispatchAction({
        // 高亮指定的数据图形。
        // 通过seriesName或者seriesIndex指定系列。如果要再指定某个数据可以再指定dataIndex或者name。
        type: 'highlight',
        // seriesIndex: 0,
        name: '北京市'
      })
    }
  }
}
</script>

<style>
#mapChart,
#provinceChart {
  width: 800px;
  height: 500px;
  border: 1px solid red;
}
</style>
