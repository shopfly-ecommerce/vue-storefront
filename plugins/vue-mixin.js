import Vue from 'vue'
import * as API_Common from '@/api/common'
import { domain, api } from '@/ui-domain'

Vue.mixin({
  data() {
    return {
      // Image upload API
      MixinUploadApi: `${process.env.API_BASE || api.base}/uploaders`,
      // Region upload API
      MixinRegionApi: `${process.env.API_BASE || api.base}/regions/@id/children`,
      // The domain name
      MixinDomain: domain,
      // API
      MixinApi: api
    }
  },
  computed: {
    /** Calculate if there isforward */
    MixinForward() {
      const { forward } = this.$route.query
      return forward ? `?forward=${forward}` : ''
    },
    /** Site information*/
    site() {
      return this.$store.getters.site
    }
  },
  methods: {
    /** Scroll to the top【animation】 */
    MixinScrollToTop(top) {
      if (process.server) return
      $("html,body").animate({ scrollTop: top || 0 }, 300)
    },
    /** Use it a lot. Put it inmixinIn the*/
    MixinRequired(message, trigger) {
      return { required: true, pattern: /^\S.*$/gi, message: message + '【Cannot start with a space】', trigger: trigger || 'blur' }
    },
    /** Return to previous page*/
    MixinRouterBack() {
      if (window.history.length <= 1) {
        location.href = '/'
      } else {
        window.history.back()
      }
    },
    /** Whether the browser is wechat*/
    MixinIsWeChatBrowser() {
      if (!process.client) return false
      return /micromessenger/i.test(navigator.userAgent)
    },
    /** base64turnBlob */
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
     * Open theIM
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
            this.$message.error('Customer service contact information is not configured！')
          }
        })
      }
    }
  }
})
