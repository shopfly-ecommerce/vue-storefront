<template>
  <div v-if="promotion && showPromotion" id="goods-groupbuy" class="groupbuy-container">
    <!--团购活动-->
    <template v-if="promotion.prom_type === 'gb'">
      <goods-prom-bar
        title="团购活动"
        :end-time="promotion.end_time - parseInt(new Date() / 1000)"
        @count-end="handleCountEnd"
      >
        <i class="iconfont ea-icon-prom-tag" slot="icon"></i>
      </goods-prom-bar>
      <div class="pro-list">
        <div class="pro-title">团购价</div>
        <div class="pro-content price">
          <span>￥</span>
          <strong>{{ promotion.groupbuy_goods_vo.price | unitPrice }}</strong>
        </div>
      </div>
    </template>
    <!--限时抢购-->
    <template v-else>
      <goods-prom-bar
        title="限时抢购"
        :end-time="promotion.seckill_goods_vo.distance_end_time"
        @count-end="handleCountEnd"
      >
        <i class="iconfont ea-icon-time seckill" slot="icon"></i>
      </goods-prom-bar>
      <div class="pro-list">
        <div class="pro-title">限时抢购价</div>
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
   * 商品页团购模块
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
        // 先试试看有没有团购活动
        let prom = this.promotions.filter(item => item.groupbuy_goods_vo)
        // 如果有团购活动，活动类型标记为groupbuy
        if (prom && prom[0]) {
          prom[0].prom_type = 'gb'
        } else {
          // 否则再试试有没有限时抢购活动
          prom = this.promotions.filter(item => item.seckill_goods_vo)
          if (prom && prom[0] && prom[0].seckill_goods_vo.distance_start_time < 0) {
            return false
          }
        }
        // 如果都没有，返回false
        if (!prom || !prom[0]) return false
        return prom[0]
      }
    },
    methods: {
      handleCountEnd() {
        this.showPromotion = false
        this.$alert('活动已结束，商品已恢复原价。', function () {
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
