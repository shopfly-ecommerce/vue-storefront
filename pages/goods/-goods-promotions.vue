<template>
  <div v-if="promotions && showPromotion" class="promotions-container">
    <div class="pro-list promotions-box" id="promotions-box">
      <div class="pro-title">Promotional information</div>
      <div class="pro-content prom">
        <template v-for="(prom, index) in promotions">
          <!--Full reduction-->
          <template v-if="prom.full_discount_vo">
            <!--Full reduction-->
            <div v-if="prom.full_discount_vo.is_full_minus" :key="index + '-full'" class="prom-item">
              <em class="hl_red_bg">Full reduction</em>
              <em class="hl_red">full{{ prom.full_discount_vo.full_money }}Yuan, immediately reduce cash<span class="price">{{ prom.full_discount_vo.minus_value }}USD</span></em>
            </div>
            <!--At a discount-->
            <div v-if="prom.full_discount_vo.is_discount" :key="index + '-full'" class="prom-item">
              <em class="hl_red_bg">At a discount</em>
              <em class="hl_red">full{{ prom.full_discount_vo.full_money }}Yuan, enjoy<span class="price">{{ prom.full_discount_vo.discount_value }}fold</span>preferential</em>
            </div>
            <!--With a gift gift-->
            <div v-if="prom.full_discount_vo.is_send_gift" :key="index + '-gift'" class="prom-item">
              <em class="hl_red_bg">gift</em>
              <em class="hl_red">
                Present value<span class="price">{{ prom.full_discount_vo.full_discount_gift_do.gift_price }}USD</span>the
                <a :href="prom.full_discount_vo.full_discount_gift_do.gift_img" target="_blank">
                  <img :src="prom.full_discount_vo.full_discount_gift_do.gift_img" class="gift-image">
                </a>
              </em>
            </div>
            <!--With a gift coupon-->
            <div v-if="prom.full_discount_vo.is_send_bonus" :key="index + '-coupon'" class="prom-item">
              <em class="hl_red_bg">coupon</em>
              <em class="hl_red">
                giving<span class="price">{{ prom.full_discount_vo.coupon_do.coupon_price }}USD</span>coupons
              </em>
            </div>
            <!--With a gift from mail-->
            <div v-if="prom.full_discount_vo.is_free_ship" :key="index + '-free_ship'" class="prom-item">
              <em class="hl_red_bg">No mail</em>
              <em class="hl_red">
                full<span class="price">{{ prom.full_discount_vo.full_money }}USD</span>No mail
              </em>
            </div>
            <!--With a gift of integral-->
            <div v-if="prom.full_discount_vo.is_send_point" :key="index + '-send_point'" class="prom-item">
              <em class="hl_red_bg">point</em>
              <em class="hl_red">
                giving<span class="price">{{ prom.full_discount_vo.point_value }}</span>point
              </em>
            </div>
          </template>
          <!--Item set-->
          <div :key="index" v-if="prom.minus_vo" class="prom-item">
            <em class="hl_red_bg">Item set</em>
            <em class="hl_red">Immediate reduction of cash per piece<span class="price">{{ prom.minus_vo.single_reduction_value }}</span>USD</em>
          </div>
          <!--The second one is half price-->
          <div :key="index" v-if="prom.half_price_vo" class="prom-item">
            <em class="hl_red_bg">The second one is half price</em>
            <em class="hl_red">The second item is half off</em>
          </div>
        </template>
      </div>
    </div>
    <div id="promotions-place" class="promotions-place"></div>
  </div>
</template>

<script>
  /**
   * Commodity promotion module
   * Includes full minus full bonus、Item set、The second one is half price
   */
  import * as API_Promotions from '@/api/promotions'
  export default {
    name: 'goods-promotions',
    props: ['promotions'],
    mounted() {
      this.handleCountPlaBoxHeight()
    },
    watch: {
      showPromotion: 'handleCountPlaBoxHeight'
    },
    computed: {
      showPromotion: function () {
        const { promotions } = this
        if (!promotions || !Array.isArray(promotions)) return false
        let flag = false
        const proms = ['full_discount_vo', 'half_price_vo', 'minus_vo']
        this.promotions.forEach(item => {
          proms.forEach(porm => {
            if (item[porm]) flag = true
          })
        })
        return flag
      }
    },
    methods: {
      /** Recalculate the assignment placeholderboxhighly*/
      handleCountPlaBoxHeight() {
        this.$nextTick(() => {
          const $proBox = document.getElementById('promotions-box')
          const $plaBox = document.getElementById('promotions-place')
          if (!$proBox || !$plaBox) return
          $plaBox.style.height = $proBox.offsetHeight + 'px'
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/styles/color";
  .promotions-container {
    position: relative;
  }
  .promotions-box {
    background: url("../../assets/images/background-price.png") 0 -12px repeat-x #efefef;
    padding-bottom: 5px;
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    right: 0;
  }
  .promotions-place {
    position: relative;
    z-index: 1;
  }
  .pro-content {
    em.hl_red_bg {
      padding: 2px 3px;
      color: $color-main;
      border: 1px solid $color-main;
      margin-right: 4px;
    }
    .prom-item:not(:first-child) {
      display: inline-block;
      .hl_red {
        display: none;
      }
    }
  }
  .promotions-box:hover .prom-item {
    display: block;
    .hl_red { display: inline-block }
  }
  .gift-image {
    width: 20px;
    height: 20px;
    vertical-align: middle;
  }
</style>
