import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/components/SvgIcon/icons' // icon 添加svg图标

var echarts = require('echarts')
// import echarts from '@/plugins/echarts.js'

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
