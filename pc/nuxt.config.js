module.exports = {
  env: {
    /**
     * 分销功能开关
     * 如果您需要开启分销相关功能，请设置为true
     */
    distribution: true,
    /**
     * IM功能开关
     * 如果有IM使用权限，请设置为true
     * 如果没有启用IM，则会使用环信服务
     */
    im: false
  },
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'renderer', content: 'webkit' },
      { name: 'force-rendering', content: 'webkit' },
      { hid: 'X-UA-Compatible', 'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { type: 'text/javascript', src: '/jquery.min.js' },
      { type: 'text/javascript', src: '/layer/layer.js' },
      { type: 'text/javascript', src: '/psl.min.js' },
      { type: 'text/javascript', src: '/base64.min.js' }
    ],
    __dangerouslyDisableSanitizers: ['script']
  },
  loading: { color: '#29d' },
  build: {
    analyze: false,
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (isClient) {
        config.entry['polyfill'] = ['babel-polyfill']
      }
      config.resolve.alias['vue$'] = 'vue/dist/vue.esm.js'
    },
    extractCSS: {
      allChunks: true
    },
    externals: {
      psl: 'window.psl'
    },
    vendor: ['axios'],
    babel: {
      "plugins": [
        ["component",
          {
            "libraryName": "element-ui",
            "styleLibraryName": "theme-chalk"
          }
        ]
      ]
    },
    plugins: [],
    publicPath: '/'
  },
  css: [
    '~assets/styles/normalize.css',
    '~assets/styles/base.scss',
    '~assets/styles/iconfont/iconfont.css',
    '~assets/styles/page-transletion.scss',
    'swiper/dist/css/swiper.css',
    'viewerjs/dist/viewer.css'
  ],
  plugins: [
    { src: '~plugins/vue-layer', ssr: false },
    { src: '~plugins/vue-lazyload', ssr: true },
    { src: '~plugins/vue-components', ssr: true },
    { src: '~plugins/vue-filters', ssr: true },
    { src: '~plugins/vue-mixin', ssr: true },
    { src: '~plugins/element-ui', ssr: true },
    { src: '~plugins/address-selector', ssr: false },
    { src: '~plugins/vue-swiper', ssr: false },
    { src: '~plugins/vue-cropper', ssr: false },
    { src: '~plugins/v-viewer.js', ssr: false },
  ],
  router: {
    middleware: 'auth-site',
    scrollBehavior: function (to, from, savedPosition) {
      return { x: 0, y: 0 }
    }
  },
  transition: 'page',
  ignorePrefix: '-',
  generate: {
    subFolders: true
  }
}
