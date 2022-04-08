<template>
  <div class="icon-container">
    <div>使用方法</div>
    &lt;svg-icon icon-class="table">&lt;/svg-icon>
    <hr />
    <div class="icon-item" v-for="(item, index) in iconList" :key="item">
      <svg-icon :icon-class="item" :key="index"></svg-icon>
      <span> {{ item }}</span>
    </div>
  </div>
</template>

<script>
import fileNames from './icons/index.js'

export default {
  name: 'IconDemo',

  data() {
    return {
      iconList: []
    }
  },

  mounted() {
    this.$nextTick(() => {
      var list = fileNames.reduce((arr, curr) => {
        if (!curr) return arr
        arr.push(curr.split('.')[1].slice(1))
        return arr
      }, [])
      this.iconList = list
    })
  },

  methods: {}
}
</script>

<style scoped>
.icon-container {
  padding: 10px;
}
.icon-item {
  float: left;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  width: 100px;
  margin-bottom: 10px;
}
</style>
