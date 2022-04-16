<template>
  <div v-if="promotion && showPromotion" id="goods-groupbuy" class="groupbuy-container">
    <!--Group-buying activities-->
    <template v-if="promotion.prom_type === 'gb'">
      <goods-prom-bar
        title="Group-buying activities"
        :end-time="promotion.end_time - parseInt(new Date() / 1000)"
        @count-end="handleCountEnd"
      >
        <i class="iconfont ea-icon-prom-tag" slot="icon"></i>
      </goods-prom-bar>
      <div class="pro-list">
        <div class="pro-title">group</div>
        <div class="pro-content price">
          <span>￥</span>
          <strong>{{ promotion.groupbuy_goods_vo.price | unitPrice }}</strong>
        </div>
      </div>
    </template>
    <!--flash-->
    <template v-else>
      <goods-prom-bar
        title="flash"
        :end-time="promotion.seckill_goods_vo.distance_end_time"
        @count-end="handleCountEnd"
      >
        <i class="iconfont ea-icon-time seckill" slot="icon"></i>
      </goods-prom-bar>
      <div class="pro-list">
        <div class="pro-title">Flash sale price</div>
        <div class="pro-content price">
          <span>￥</span>
          <strong>{{ promotion.seckill_goods_vo.seckill_price | unitPrice }}</strong>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  /**
   * Commodity page group purchase module
   */
  export default {
    name: 'goods-groupbuy-seckill',
    props: ['promotions'],
    data() {
      return {
        showPromotion: true
      }
    },
    computed: {
      promotion() {
        if (!this.promotions || !this.promotions.length) return false
        // Try group buying first
        let prom = this.promotions.filter(item => item.groupbuy_goods_vo)
        // If there is a group purchase activity, the activity type is marked as GroupBuy
        if (prom && prom[0]) {
          prom[0].prom_type = 'gb'
        } else {
          // Otherwise, try a flash sale
          prom = this.promotions.filter(item => item.seckill_goods_vo)
          if (prom && prom[0] && prom[0].seckill_goods_vo.distance_start_time < 0) {
            return false
          }
        }
        // If none, return false
        if (!prom || !prom[0]) return false
        return prom[0]
      }
    },
    methods: {
      handleCountEnd() {
        this.showPromotion = false
        this.$alert('The event has ended and the goods have been restored to their original price.', function () {
          location.reload()
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .groupbuy-container {
    position: relative;
    .iconfont {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-right: 5px;
      vertical-align: -1px;
      color: #fff;
      &.seckill {
        font-size: 20px;
      }
    }
    .pro-list {
      position: absolute;
      z-index: 3;
      top: 32px;
      left: 0;
      right: 0;
      background-color: #f3f3f3;
    }
  }
</style>
