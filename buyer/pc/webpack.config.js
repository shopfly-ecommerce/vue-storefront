// 为webstorm配置，与nuxt无关。

const path = require('path')

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
      '~': path.resolve(__dirname)
    }
  }
}
