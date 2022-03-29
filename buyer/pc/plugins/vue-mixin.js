import Vue from 'vue'
import * as API_Common from '@/api/common'
import { domain, api } from '@/ui-domain'

Vue.mixin({
  data() {
    return {
      // 图片上传API
      MixinUploadApi: `${process.env.API_BASE || api.base}/uploaders`,
      // 地区上传API
      MixinRegionApi: `${process.env.API_BASE || api.base}/regions/@id/children`,
      // 域名
      MixinDomain: domain,
      // API
      MixinApi: api
    }
  },
  computed: {
    /** 计算是否有forward */
    MixinForward() {
      const { forward } = this.$route.query
      return forward ? `?forward=${forward}` : ''
    },
    /** 站点信息 */
    site() {
      return this.$store.getters.site
    }
  },
  methods: {
    /** 滚动到顶部【动画】 */
    MixinScrollToTop(top) {
      if (process.server) return
      $("html,body").animate({ scrollTop: top || 0 }, 300)
    },
    /** 用得比较多，放到mixin里 */
    MixinRequired(message, trigger) {
      return { required: true, pattern: /^\S.*$/gi, message: message + '【不能以空格开始】', trigger: trigger || 'blur' }
    },
    /** 返回上一页 */
    MixinRouterBack() {
      if (window.history.length <= 1) {
        location.href = '/'
      } else {
        window.history.back()
      }
    },
    /** 是否为微信浏览器 */
    MixinIsWeChatBrowser() {
      if (!process.client) return false
      return /micromessenger/i.test(navigator.userAgent)
    },
    /** base64转Blob */
    MixinBase64toBlob(base64) {
      const byteString = atob(base64.split(',')[1])
      const mimeString = base64.split(',')[0].split(':')[1].split(';')[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ab], {type: mimeString})
    },
    /**
     * 打开IM
     * @constructor
     */
    MixinOpenIm(shop_id = '', params = {}) {
      if (process.env.im) {
        let url = `/chat?shop_id=${shop_id}`
        if (params.goods_id) url += `&goods_id=${params.goods_id}`
        window.open(url)
      } else {
        API_Common.getSettingsInfo().then(res => {
          if (res.qq) {
            window.open("http://wpa.qq.com/msgrd?v=3&uin="+ res.qq +"&site=qq&menu=yes")
          } else {
            this.$message.error('未配置客服联系方式！')
          }
        })
      }
    }
  }
})
