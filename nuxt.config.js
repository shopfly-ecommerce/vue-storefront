import { resolve } from 'path'
import { api, domain } from './ui-domain'

module.exports = {
  alias: {
    '~': resolve(__dirname),
    '@': resolve(__dirname)
  },
  env: {
    /**
     * Distribution function switch
     * Set this parameter to enable distribution functionstrue
     */
    distribution: true,
    /**
     * IMFunction of the switch
     * If you haveIMPermission, please set totrue
     * If not enabledIM, the ring service will be used
     */
    im: false,
    api_base: process.env.API_BASE || api.base,
    api_buyer: process.env.API_BUYER || api.buyer,
    api_im: process.env.API_IM || api.im,
    domain_buyer_pc: process.env.DOMAIN_BUYER_PC || domain.buyer_pc,
    domain_buyer_wap: process.env.DOMAIN_BUYER_WAP || domain.buyer_wap,
    domain_seller: process.env.DOMAIN_SELLER || domain.seller
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
    externals: {
      psl: 'window.psl'
    },
    babel: {
      'plugins': [
        ['component',
          {
            'libraryName': 'element-ui',
            'styleLibraryName': 'theme-chalk'
          }
        ]
      ]
    },
  },
  ssr: false,
  css: [
    '~assets/styles/normalize.css',
    '~assets/styles/base.scss',
    '~assets/styles/iconfont/iconfont.css',
    '~assets/styles/page-transletion.scss',
    'swiper/dist/css/swiper.css',
    'viewerjs/dist/viewer.css'
  ],
  // modules: ['@kimyvgy/nuxt-page-cache'],
  // cache: {
  //   enabled: process.env.NODE_ENV === 'production',
  //   useHostPrefix: false,
  //   pages: ['/'],
  //   store: {
  //     type: 'memory',
  //     max: 200,
  //     ttl: 60
  //   }
  // },
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
    middleware: 'auth-site'
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    timing: false
  },
  generate: {
    interval: 1000,
    subFolders: true
  }
}
