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
import chinaJson from '@/utils/map/china2.json' // json数据引入

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
            inRange: { color: ['#ff0000', '#00ff00'] }
          },
          series: [{ type: 'map', map: 'province', label: { show: true } }]
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
          map: 'china', // 使用 registerMap 注册的地图名称。
          zoom: 1.25, // 当前视角的缩放比例。
          roam: false, // 是否开启鼠标缩放和平移漫游。默认不开启
          // nameMap: { China: '中国' }, // 自定义地区的名称映射，
          // center: [118.27958, 31.117566],  // 中心点(经纬度)
          // 鼠标划过区块的样式 颜色
          emphasis: {
            areaColor: '#0f0',
            label: { color: '#fff' }
          },
          // 是否显示省市名称
          label: { show: false, color: '#fff' },
          data: [
            {
              name: '北京市',
              value: Math.round(Math.random() * 1000),
              emphasis: { itemStyle: { areaColor: 'red' } }
            },
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
