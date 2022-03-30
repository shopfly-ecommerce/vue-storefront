<template>
  <div v-if="goods" id="snapshot">
    <bread-nav :goods="goods"/>
    <div class="content">
      <div class="inner-content">
        <!--商品相册-->
        <goods-zoom :images="goods.gallery_list" :spec-img="specImage"/>
        <!--商品信息【包括规格】-->
        <goods-info :goods="goods" :orderprice="goodsPrice" :promotions="promotions" @spec-img-change="(img) => { this.specImage = img }"/>
        <!--店铺卡片-->
        <shop-card :shop-id="goods.seller_id"/>
      </div>
    </div>
    <div class="details">
      <div class="inner w">
        <!--店铺标签商品推荐-->
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
            <div v-show="curTab === '商品详情'" class="intro-detail" v-html="goods.intro"></div>
            <!--商品参数-->
            <goods-params v-show="curTab === '规格参数'" :goods-params="goods.param_list"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { mapGetters } from 'vuex'
  import * as API_Goods from '@/api/goods'
  import * as APT_Trade from '@/api/trade'
  import * as API_Members from '@/api/members'
  import * as API_Promotions from '@/api/promotions'
  import * as GoodsComponents from './'
  import Storage from '@/utils/storage'
  import { Pagination } from 'element-ui'
  Vue.use(Pagination)
  export default {
    name: 'snapshot',
    validate({ query }) {
      return /^\d+$/.test(query.id)
    },
    middleware: 'auth-user',
    head() {
      const { goods, site } = this
      return {
        title: `${goods.goods_name || '商品详情'}-${site.site_name}`,
      }
    },
    components: GoodsComponents,
    data() {
      return {
        goods: '',
        /** 实付金额 */ 
        orderprice:this.$route.query.orderData,
        goodsPrice: '',
        /** 规格图片 */       
        specImage: '',
        tabs: ['商品详情', '规格参数'].map((item, index) => ({ title: item, active: index === 0 })),
        curTab: '商品详情'
      }
    },
    mounted() {
      const { id } = this.$route.query
      APT_Trade.getSnapshot(id).then(response => {
        response.goods_name = response.name
        this.goods = response
        this.promotions = response.promotion_list// || JSON.parse(response.promotion_json)
        this.goodsPrice = response.price
      })
    },
    methods: {
      /** 商品详情tab点击事件 */
      handleClickTabItem(tab) {
        this.curTab = tab.title
        this.tabs.map(item => {
          item.active = tab === item
          return item
        })
      },
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
  .collect-goods-btn {
    margin-left: 20px;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABrElEQVQ4T62TP0hcQRCHf7P7zk64BITEPliJtQQMCJaJpLjCRu723u6BMYgpgmArmkaCkCI7U5xw5StsgoJaXGMn6ZLiSJr8wSbkVeHgMLfhyT05L4cIuuWPmW/Yb2cJtzx0y35cARhjJrTWNQAPlVKJ934vG2CtLQF4DiAAOBCRRj74EuCcyxrjEAIT0ZcQwisAPwFERPSIiHa73W4EYJ2I9pl5KYNcAJxzkwAkTdPHSZL8zenW2n0iOmfmZ3lmjBnXWn9USs167z/ngOUQwqiIbPU7qdVqU51O53e9Xv/en8dxvEFEP0TkfQ54EUK4JyIbN5Fqrd0G8E1Edi4A1Wr1vtb6JE3TqSRJOtdBSqXSSLFY/EREM8x81i9xNbPPzK+vAzjn3gL4yszvLiX2Gsg5dxRC2BaRg2EQa60BsCAic/89YxYYY0a11odKqZfe+9MBcYtKqZV2uz3TaDT+DAVkYblcflAoFD4AWBOR4yyL43heKbUJ4Akz/+oHD13lSqUyFkVRBjnpFU8T0dPB5kEHV67ds/2GiLqtVmut2WyeD/Nyt5/pJks0WPMPjeaXEW5C95kAAAAASUVORK5CYII=");
    &.collected {
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABd0lEQVQ4T6WSPUvDcBDGn2uVxjRpQVqngqXJomBnaUEcHBXBTfFbuCouOjn7CURw081BN18KgksHoZg/aSeHikvTSrXJSVMT+pJKgzfey4977h7CP4P651nXYy1gkZjlGSEeCWCvzpnMbEuS5mXghQyj7eV9gKVpeyA6BhBzi8xlcpz9KebX72j0FMAqiCJg/gRwqAhx0m1zAVYut4NI5DxATRvMNojk4Rozb6tCXLiAhq6XCFgOcw5mLqlCFDxAnYBUKADwrhpGuidB025AtBYKwHynCrHSA+j6LoCzMABiPogLceR/oaFpV0S0OQmEmSuKEHkCvnwAp9NKM5F4AFH+LwgDH9O2XZBMs+K/sd8sliTdE7AQBGHAItsuKqZZHjGSl2ho2hwBtyBaGnApUI/a9rpsmk/9+QEr+5ukUqqVTF4TUfHXlc/U6WzEa7W34c0CAa6TdT3WZL4E4MSF2OoeLEjWWIALyWYlVKvOuOGRI07ywuGeH8P8iBFSzfHsAAAAAElFTkSuQmCC");
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
        width: ($dc_width - 4px) / 2;
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
    .intro-detail { text-align: center }
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
