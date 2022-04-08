const path = require('path')
const resolve = (p) => path.resolve(p)
module.exports = {
  productionSourceMap: process.env.NODE_ENV !== 'production',
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/components/SvgIcon/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/components/SvgIcon/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
