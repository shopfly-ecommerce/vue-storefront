<template>
  <div v-if="goods" id="goods">
    <div v-if="!goods.goods_off" class="goods-auth w">
      <img src="../../assets/images/background-goods-off.jpg" alt="The merchandise has been removed from the shelves">
      <div class="goods-auth-btns">
        <a href="/">Go to the home page</a>
        <a href="javascript:" @click="handleCloseWindow">Close the window</a>
      </div>
    </div>
    <template v-else>
      <bread-nav :goods="goods"/>
      <div class="content">
        <div class="inner-content">
          <!--Photo album-->
          <goods-zoom :images="goods.gallery_list" :spec-img="specImage"/>
          <!--Product information【Including specifications、coupons、Sales promotion etc.】-->
          <goods-info :goods="goods" @spec-img-change="(img) => { this.specImage = img }"/>
        </div>
        <div class="collect-goods-box" @click="handleCollectionGoods">
          <i :class="['collect-goods-btn', collected && 'collected']"></i>
          <a href="javascript:">{{ collected ? 'Already collected' : 'Collection product' }}</a>
        </div>
      </div>
      <div class="details">
        <div class="inner w">
          <!--Store label product recommendation-->
          <goods-tags :shop-id="goods.seller_id"/>
          <div class="detail-container">
            <div class="detail-tabs">
              <div
                v-for="tab in tabs"
                :key="tab.title"
                :class="['item-tab', tab.active && 'active']"
                @click="handleClickTabItem(tab)"
              >{{ tab.title }}</div>
            </div>
            <div class="detail-content">
              <div
                v-show="curTab === 'Product details'"
                class="intro-detail"
                v-html="goods.intro"
                v-lazy-container="{ selector: 'img' }"
              ></div>
              <!--Product parameters-->
              <goods-params v-show="curTab === 'Specification'" :goods-params="goods.param_list"/>
              <!--Product comments-->
              <goods-comments v-show="curTab === 'Product comments'" :goods-id="goods.goods_id" :grade="goods.grade"/>
              <!--Product consulting-->
              <goods-consulting v-show="curTab === 'Product consulting'" :goods-id="goods.goods_id"/>
              <!--Sales record-->
              <sales-record v-show="curTab === 'Sales record'" :goods-id="goods.goods_id"/>
            </div>
          </div>
        </div>
      </div>
      <goods-distribution v-if="show_dis"/>
    </template>
  </div>
</template>

<script>
  import Vue from 'vue'
  import * as API_Common from '@/api/common'
  import * as API_Goods from '@/api/goods'
  import * as API_Members from '@/api/members'
  import * as API_distribution from '@/api/distribution'
  import * as GoodsComponents from './'
  import Storage from '@/utils/storage'
  import { Pagination } from 'element-ui'
  import 'viewerjs/dist/viewer.css'
  import Viewer from 'v-viewer'
  Vue.use(Pagination).use(Viewer)
  const components = {}
  Object.keys(GoodsComponents).forEach(key => {
    components[key] = GoodsComponents[key]
  })

  export default {
    name: 'goods-detail',
    validate({ params }) {
      return /^\d+$/.test(params.id)
    },
    async asyncData({ params, error }) {
      let goods = {}
      try {
        goods = await API_Goods.getGoods(params.id)
      } catch (e) {
        error({ statusCode: 500, message: 'The product not exist' })
      }
      if (goods.intro) {
        goods.intro = goods.intro.replace(/src=/g, 'data-src=')
      }
      return {
        goods,
        // Whether the current item is browsable
        canView: goods.is_auth !== 0 && goods.goods_off === 1
      }
    },
    head() {
      const { goods, site } = this
      return {
        title: `${goods.page_title || goods.goods_name || 'Product details'}-${site.site_name}`,
        meta: [
          { hid: 'keywords', name: 'keywords', content: goods.meta_keywords },
          { hid: 'description', name: 'description', content: `${goods.meta_description}-${site.site_name}` },
          { 'http-equiv': 'mobile-agent', content: `format=xhtml; url=/goods/${goods.goods_id}` },
          { 'http-equiv': 'mobile-agent', content: `format=html5; url=/goods/${goods.goods_id}` }
        ]
      }
    },
    components: components,
    data() {
      return {
        // Displays the distribution share button
        show_dis: process.env.distribution,
        goods: '',
        /** Sku pictures*/
        specImage: '',
        tabs: ['Product details', 'Specification', 'Product comments', 'Product consulting', 'Sales record'].map((item, index) => ({ title: item, active: index === 0 })),
        curTab: 'Product details',
        // Whether the item has been collected
        collected: false,
        // Show share button
        showShare: true
      }
    },
    mounted() {
      const { goods_id, seller_id } = this.goods
      // If the goods can be viewed
      if (this.canView) {
        // If the user is logged in, load the favorites state
        if (Storage.getItem('refresh_token')) {
          API_Members.getGoodsIsCollect(goods_id).then(response => {
            this.collected = response.message
          })
        }
        // 2. Used of statistics.
        API_Common.recordViews(window.location.href)
        // 加载百度分享代码
        this.loadBdShareScript()
        // 如果页面是被分享的
        if (this.$route.query.su) {
          API_distribution.accessShortLink({su: this.$route.query.su }).then(() => { console.log(9856) })
        }
      }
    },
    methods: {
      /** Collection product*/
      handleCollectionGoods() {
        if (!Storage.getItem('refresh_token')) {
          this.$message.error('You have not logged in, can not collect goods！')
          return false
        }
        const { goods_id } = this.goods
        if (this.collected) {
          API_Members.deleteGoodsCollection(goods_id).then(() => {
            this.$message.success('Unfavorites successful！')
            this.collected = false
          })
        } else {
          API_Members.collectionGoods(goods_id).then(() => {
            this.$message.success('Collection of success！')
            this.collected = true
          })
        }
      },
      /** Product detailstabClick on the event*/
      handleClickTabItem(tab) {
        this.curTab = tab.title
        this.tabs.map(item => {
          item.active = tab === item
          return item
        })
      },
      /** Close current window*/
      handleCloseWindow() {
        window.close()
      },
      /** 加载百度分享 */
      loadBdShareScript() {
        this.$nextTick(() => {
          const { goods } = this
          window._bd_share_config = {
            common: {
              bdSnsKey:{},
              bdUrl: location.href,
              bdText: goods.goods_name,
              bdMini: "2",
              bdPic: goods.thumbnail,
              bdStyle: "1",
              bdSize: "16",
              bdMiniList: ["mshare","qzone","tsina","bdysc","weixin","kaixin001","tqf","tieba","douban","sqq","copy"]
            },
            share: {
              bdSize: 16,
              bdMiniList: ["mshare","qzone","tsina","bdysc","weixin","kaixin001","tqf","tieba","douban","sqq","copy"],
            }
          };
          const s = document.createElement('script');
          s.type = 'text/javascript';
          s.id = 'BdShareScript';
          s.src = '/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5);
          document.body.appendChild(s);
          this.showShare = true
        })
      }
    },
    destroyed() {
      // Tags created by Baidu Share are removed when the component is destroyed
      const removeIds = ['BdShareScript', 'bdshare_weixin_qrcode_dialog_bg', 'bdshare_weixin_qrcode_dialog']
      const removeClass = ['bdshare_dialog_box', 'bdshare_dialog_bg', 'bdshare_popup_box']
      removeIds.forEach(id => {
        const ele = $('#' + id)
        ele.length && ele.remove()
      })
      removeClass.forEach(cl => {
        const ele = $('.' + cl)
        ele.length && ele.remove()
      })
      window._bd_share_main = undefined
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/styles/color";
  .content {
    width: 1210px;
    min-height: 500px;
    margin: 0 auto;
    background-color: #fff;
    box-shadow: 0 2px 5px #ccc;
    padding: 40px 40px 12px 40px;
    box-sizing: border-box;
    .inner-content {
      display: flex;
      justify-content: space-between;
    }
  }
  .collect-goods-box {
    display: flex;
    align-items: center;
    margin-top: 10px;
    i {
      display: inline-block;
      width: 15px;
      height: 15px;
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABrElEQVQ4T62TP0hcQRCHf7P7zk64BITEPliJtQQMCJaJpLjCRu723u6BMYgpgmArmkaCkCI7U5xw5StsgoJaXGMn6ZLiSJr8wSbkVeHgMLfhyT05L4cIuuWPmW/Yb2cJtzx0y35cARhjJrTWNQAPlVKJ934vG2CtLQF4DiAAOBCRRj74EuCcyxrjEAIT0ZcQwisAPwFERPSIiHa73W4EYJ2I9pl5KYNcAJxzkwAkTdPHSZL8zenW2n0iOmfmZ3lmjBnXWn9USs167z/ngOUQwqiIbPU7qdVqU51O53e9Xv/en8dxvEFEP0TkfQ54EUK4JyIbN5Fqrd0G8E1Edi4A1Wr1vtb6JE3TqSRJOtdBSqXSSLFY/EREM8x81i9xNbPPzK+vAzjn3gL4yszvLiX2Gsg5dxRC2BaRg2EQa60BsCAic/89YxYYY0a11odKqZfe+9MBcYtKqZV2uz3TaDT+DAVkYblcflAoFD4AWBOR4yyL43heKbUJ4Akz/+oHD13lSqUyFkVRBjnpFU8T0dPB5kEHV67ds/2GiLqtVmut2WyeD/Nyt5/pJks0WPMPjeaXEW5C95kAAAAASUVORK5CYII=");
      background-repeat: no-repeat;
      background-size: 100%;
      &.collected {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABd0lEQVQ4T6WSPUvDcBDGn2uVxjRpQVqngqXJomBnaUEcHBXBTfFbuCouOjn7CURw081BN18KgksHoZg/aSeHikvTSrXJSVMT+pJKgzfey4977h7CP4P651nXYy1gkZjlGSEeCWCvzpnMbEuS5mXghQyj7eV9gKVpeyA6BhBzi8xlcpz9KebX72j0FMAqiCJg/gRwqAhx0m1zAVYut4NI5DxATRvMNojk4Rozb6tCXLiAhq6XCFgOcw5mLqlCFDxAnYBUKADwrhpGuidB025AtBYKwHynCrHSA+j6LoCzMABiPogLceR/oaFpV0S0OQmEmSuKEHkCvnwAp9NKM5F4AFH+LwgDH9O2XZBMs+K/sd8sliTdE7AQBGHAItsuKqZZHjGSl2ho2hwBtyBaGnApUI/a9rpsmk/9+QEr+5ukUqqVTF4TUfHXlc/U6WzEa7W34c0CAa6TdT3WZL4E4MSF2OoeLEjWWIALyWYlVKvOuOGRI07ywuGeH8P8iBFSzfHsAAAAAElFTkSuQmCC");
      }
    }
  }
  .details {
    margin: 50px 0;
    .inner {
      display: flex;
      justify-content: space-between;
    }
    $dc_width: 1210px - 200px - 30px;
    .detail-container {
      width: $dc_width;
      min-height: 100px;
    }
    .detail-tabs {
      display: flex;
      width: 100%;
      height: 36px;
      .item-tab {
        width: ($dc_width - 4px) / 5;
        height: 36px;
        background-color: #333;
        border-right: 1px solid #fff;
        line-height: 36px;
        color: #fff;
        text-align: center;
        cursor: pointer;
        transition: all .2s ease;
        &:hover, &.active { background-color: $color-main }
        &:nth-child(5) { border-right: 0 }
      }
    }
    .detail-content {
      padding-top: 10px;
      overflow: hidden;
    }
    .intro-detail {
      text-align: center;
      /deep/ img[lazy=loading] {
        display: block;
        width: 100%;
        height: 450px;
      }
    }
  }
  /deep/ .el-pagination {
    margin-top: 20px;
    text-align: right;
  }
  .goods-auth {
    text-align: center;
    padding: 50px 0;
    .goods-auth-btns {
      margin-top: 20px;
    }
    a {
      display: inline-block;
      min-width: 100px;
      height: 20px;
      background-color: $color-main;
      color: #fff;
      padding: 10px 20px;
      margin-right: 20px;
      border-radius: 2px;
      font-size: 14px;
      font-weight: 600;
      transition: background-color ease .2s;
      &:hover {
        background-color: lighten($color-main, 15%);
      }
    }
  }
</style>
