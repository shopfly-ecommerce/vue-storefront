<template>
  <div id="goods-info" class="goods-info">
    <div class="pro-name bottom-border" :title="goodsInfo.goods_name">
      <h1>{{ goodsInfo.goods_name }}</h1>
    </div>
    <div class="pro-details">
      <goods-exchange :promotions="promotions"/>
      <goods-groupbuy-seckill :promotions="promotions"/>
      <div class="price-box">
        <div class="pro-list">
          <div class="pro-title">Price</div>
          <!--If I have more than1One of thesku, the price range is displayed-->
          <div v-if="priceRange" class="pro-content price">
            <span>￥</span>
            <strong>{{ priceRange[0] | unitPrice }}</strong>
            <template v-if="priceRange[1]"> ~ <strong>{{ priceRange[1] | unitPrice }}</strong></template>
          </div>
          <div v-else class="pro-content price">
            <div v-if="is_snapshot">
               <span>￥</span>
               <strong>{{ orderprice | unitPrice }}</strong>
            </div>
            <div v-else>
              <span>￥</span>
              <strong>{{ goodsInfo.price | unitPrice }}</strong>
            </div>
          </div>
        </div>
        <goods-promotions :promotions="promotions"/>
      </div>
      <goods-coupons :goods="goodsInfo" :is-snapshot="is_snapshot"/>
    </div>
    <div v-if="specList && specList.length" :class="['pro-spec', unselectedSku && 'error']">
      <div v-for="(spec, specIndex) in specList" :key="spec.spec_id" class="pro-list">
        <div class="pro-title pro-title1">{{ spec.spec_name }}</div>
        <div class="pro-content">
          <button
            v-if="is_snapshot"
            :class="['spec-val-btn', 'selected', spec.spec_image && 'spec-image']"
            type="button"
          >
            <img v-if="spec.spec_image" :src="spec.spec_image">
            <span class="spec-text">{{ spec.spec_value }}</span>
            <i class="iconfont ea-icon-right-bottom-checked"></i>
          </button>
          <template v-else>
            <button
              v-for="spec_val in spec.valueList"
              :key="spec_val.spec_value_id"
              :class="['spec-val-btn', spec_val.selected && 'selected', spec.spec_type === 1 && 'spec-image']"
              @click="handleClickSpec(spec, specIndex, spec_val)"
              type="button"
            >
              <img v-if="spec.spec_type === 1" :src="spec_val['spec_value_img'].thumbnail">
              <span class="spec-text">{{ spec_val.spec_value }}</span>
              <i class="iconfont ea-icon-right-bottom-checked"></i>
            </button>
          </template>
        </div>
      </div>
      <div v-if="unselectedSku" class="pro-list error-msg">
        <div class="pro-title"></div>
        <div class="pro-content">Please select product specifications！</div>
      </div>
    </div>
    <div v-if="goods.is_auth === 0" class="no-auth">
      This product is under review, lets have a look at other products first.
    </div>
    <div v-else-if="is_snapshot" class="snapshot-box">
      The current page is a snapshot of the order, which shows the product information when it is created. This page can be used as the basis for judging the transaction dispute.
      <a :href="'/goods/' + goods.goods_id">Click here for the latest product details</a>
    </div>
    <template v-else>
      <div class="pro-list buy-num">
        <div class="pro-title">Quantity</div>
        <div class="pro-content">
          <div class="count-num">
            <a href="javascript:;" @click="handleBuyNumChanged('-')" class="oper-num down" :class="[buyNum < 2 && 'not-oper']"></a>
            <span class="num">
            <input type="number" v-model.number="buyNum">
          </span>
            <a href="javascript:;" @click="handleBuyNumChanged('+')" class="oper-num up"></a>
          </div>
          <span style="margin-left: 15px">Only {{ goodsInfo.enable_quantity }} available</span>
        </div>
      </div>
      <div class="buy-btns">
        <button
          type="button"
          class="buy-btn buy"
          :class="[!in_store && 'disabled']"
          @click="handleBuyNow"
        >Buy now</button>
        <button
          type="button"
          class="buy-btn add"
          :class="[!in_store && 'disabled']"
          @click="handleAddToCart"
        ><i class="iconfont ea-icon-cart"></i>Add cart</button>
      </div>
    </template>
  </div>
</template>

<script>
  /**
   * Commodity information module
   * Including trade name、Price、Purchase quantity、Add cart
   * Including coupons
   * Including promotional information
   * Including flash sales
   * Including group-buying activities
   */
  import Vue from 'vue'
  import { RegExp } from '@/ui-utils'
  import * as API_Goods from '@/api/goods'
  import * as API_Trade from '@/api/trade'
  import * as API_Promotions from '@/api/promotions'
  import Storage from '@/utils/storage'
  import GoodsCoupons from './-goods-coupons'
  import GoodsPromotions from './-goods-promotions'
  import GoodsGroupbuySeckill from './-goods-groupbuy-seckill'
  import GoodsExchange from './-goods-exchange'
  import GoodsPromBar from './-goods-prom-bar'
  import GoodsShip from './-goods-ship'
  Vue.component('goods-prom-bar', GoodsPromBar)
  export default {
    name: 'goods-info',
    props: ['goods','orderprice'],
    components: { GoodsCoupons, GoodsPromotions, GoodsGroupbuySeckill, GoodsExchange, GoodsShip },
    data() {
      const is_snapshot = this.$route.name === 'goods-snapshot'
      return {
        goodsInfo: JSON.parse(JSON.stringify(this.goods)),
        // Purchase quantity
        buyNum: 1,
        // skuMap
        skuMap: new Map(),
        // Specification list
        specList: [],
        // Selected specification
        selectedSpec: [],
        // The selected sku
        selectedSku: '',
        // Sku is not selected, initialize to false
        unselectedSku: false,
        // Price range with specifications
        priceRange: '',
        // Snapshot page
        is_snapshot,
        // Whether the distribution area is in stock
        in_store: true,
        // Promotional information
        promotions: ''
      }
    },
    watch: {
      promotions(newVal) {
        if (!newVal.length) {
          return
        }
        const strs = ['groupbuy_goods_vo', 'seckill_goods_vo']
        let num = null
        newVal.forEach(item => {
          strs.forEach(str => {
            if (item[str]) {
              if (str === 'groupbuy_goods_vo') {
                num = item[str].goods_num
              } else {
                num = item[str].sold_quantity
              }
            }
          })
        })
        if (num === null) {
          return
        }
        this.$set(this.goodsInfo, 'enable_quantity', num)
        this.skuMap.forEach(val => {
          val.enable_quantity = num
        })
        this.$set(this, 'skuMap', this.skuMap)
      }
    },
    async mounted() {
      if (this.is_snapshot) {
        this.specList = this.goods['spec_list']
      } else {
        const { goods_id } = this.goods
        const skus = await API_Goods.getGoodsSkus(goods_id)
        const promotions = await API_Promotions.getGoodsPromotions(goods_id)
        const specList = []
        const priceList = []
        skus.forEach((sku, skuIndex) => {
          const { spec_list, price } = sku
          priceList.push(price)
          const spec_value_ids = []
          if (spec_list) {
            spec_list.forEach((spec, specIndex) => {
              const _specIndex = specList.findIndex(_spec => _spec['spec_id'] === spec.spec_id)
              const _spec = {
                spec_id: spec.spec_id,
                spec_name: spec.spec_name,
                spec_type: spec.spec_type
              }
              const _value = {
                spec_value: spec.spec_value,
                spec_value_id: spec.spec_value_id,
                spec_value_img: {
                  original: spec.spec_image,
                  thumbnail: spec.thumbnail
                }
              }
              spec_value_ids.push(spec.spec_value_id)
              if(_specIndex === -1){
                specList.push({..._spec, valueList: [{..._value}]})
              }else if(specList[_specIndex]['valueList'].findIndex(_value => _value['spec_value_id'] === spec['spec_value_id']) === -1) {
                specList[_specIndex]['valueList'].push({ ..._value })
              }
            })
            this.skuMap.set(spec_value_ids.join('-'), sku)
          } else {
            this.skuMap.set('no_spec', sku)
          }
        })
        // If the price range is greater than 1
        if (priceList.length > 1) {
          const min = Math.min(...priceList)
          const max = Math.max(...priceList)
          if (min === max) {
            this.priceRange = [max]
          } else {
            this.priceRange = [min, max]
          }
        }
        this.specList = specList
        // If there is no specification, the first SKU of the item is given to the selected SKU
        if (!specList.length) {
          this.selectedSku = this.skuMap.get('no_spec')
          this.goodsInfo = {
            ...this.goodsInfo,
            ...this.selectedSku
          }
        }
        this.promotions = promotions
        // If there is SKU information, initialize the selected specifications
        if (this.$route.query.sku_id) {
          this.initSpec()
        }
      }
    },
    methods: {
      /** Initializing specifications*/
      initSpec() {
        let { sku_id } = this.$route.query
        let selectedSpecs = ''
        if (sku_id) {
          sku_id = Number(sku_id)
          this.skuMap.forEach((value, key) => {
            if (value.sku_id === sku_id) {
              selectedSpecs = key.split('-')
            }
          })
        }
        const _selectedSpecVals = []
        this.specList.forEach((spec, specIndex)=> {
          if (Array.isArray(spec.valueList)) {
            spec.valueList.forEach((val, specValIndex) => {
              if (selectedSpecs) {
                const spec_value_id = val.spec_value_id
                if (selectedSpecs.indexOf(String(spec_value_id)) !== -1) {
                  val.selected = true
                  this.selectedSpec[specIndex] = val.spec_value_id
                  _selectedSpecVals.push(val.spec_value_id)
                }
              } else if (specValIndex === 0) {
                val.selected = true
                this.selectedSpec[specIndex] = val.spec_value_id
                _selectedSpecVals.push(val.spec_value_id)
              }
            })
          }
        })
        this.handleSelectedSku()
      },
      /** Choose specifications*/
      handleClickSpec(spec, specIndex, spec_val) {
        if (spec.spec_type === 1 ) {
          this.$emit('spec-img-change', JSON.parse(JSON.stringify(spec_val.spec_value_img)))
        }
        if (spec_val.selected) return
        spec.valueList.map(item => {
          item.selected = item.spec_value_id === spec_val.spec_value_id
          return item
        })
        this.$set(this.specList, specIndex, spec)
        this.selectedSpec[specIndex] = spec_val.spec_value_id
        this.handleSelectedSku()
      },
      /** The number of purchases increased and decreased*/
      handleBuyNumChanged(symbol) {
        if (symbol === '+') {
          const { enable_quantity } = this.selectedSku
          if (enable_quantity === 0) {
            this.$message.error('This specification is temporarily out of stock！')
          } else if (this.buyNum >= enable_quantity) {
            this.$message.error('Over maximum stock！')
          } else {
            this.buyNum += 1
          }
        } else {
          if (this.buyNum < 2) {
            this.$message.error('No less！')
          } else {
            this.buyNum -= 1
          }
        }
      },
      /** Select one based on the selected specificationssku */
      handleSelectedSku() {
        let sku
        if (this.selectedSpec.length) {
          const spec_vals = []
          this.selectedSpec.forEach(item => spec_vals.push(item))
          sku = this.skuMap.get(spec_vals.join('-'))
        } else {
          sku = this.skuMap.get('no_spec')
        }
        if (sku) {
          this.selectedSku = sku
          this.unselectedSku = false
          this.priceRange = ''
          this.goodsInfo = { ...this.goodsInfo, ...sku }
          this.buyNum = sku.enable_quantity === 0 ? 0 : 1
        }
      },
      /** Buy now*/
      handleBuyNow() {
        if (!this.in_store || !this.isLogin()) return
        const { buyNum } = this
        if (!this.handleCheckNum()) return
        const { sku_id } = this.selectedSku
        API_Trade.buyNow(sku_id, buyNum, this.getActivityId()).then(response => {
          this.$store.dispatch('cart/getCartDataAction')
          this.$router.push('/checkout')
        })
      },
      /** Add cart*/
      handleAddToCart() {
        if (!this.in_store || !this.isLogin()) return
        const { buyNum } = this
        if (!this.handleCheckNum()) return
        const { sku_id } = this.selectedSku
        API_Trade.addToCart(sku_id, buyNum, this.getActivityId()).then(response => {
          this.$store.dispatch('cart/getCartDataAction')
          this.$confirm('Added to shopping cart successfully！Want to go check it out？', () => {
            this.$router.push({ path: '/cart' })
          })
        })
      },
      /** Login or not*/
      isLogin() {
        if (!this.selectedSku) {
          this.$message.error('Please select product specifications！')
          this.unselectedSku = true
          return false
        }
        if (!Storage.getItem('refresh_token')) {
          this.$confirm('You havent logged in yet. Do you want to log in now？', () => {
            this.$router.push({ path: '/login', query: { forward: `${this.$route.path}?sku_id=${this.selectedSku.sku_id}`} })
          })
          return false
        } else {
          return true
        }
      },
      /** Check if there are points redeemable、A bulk、Flash sales*/
      getActivityId() {
        const { promotions } = this
        if (!promotions || !promotions.length) return ''
        let pro
        for (let i = 0; i < promotions.length; i++) {
          let item = promotions[i]
          if (
            item.seckill_goods_vo ||
            item.groupbuy_goods_vo ||
            item.exchange ||
            item.minus_vo ||
            item.half_price_vo
          ) {
            pro = item
            break
          }
        }
        if (!pro) return ''
        return pro.activity_id
      },
      /** Check the validity of the purchase quantity*/
      handleCheckNum() {
        let { buyNum } = this
        if (!RegExp.integer.test(buyNum) || buyNum < 1) {
          this.$message.error('The goods are out of stock and cannot be purchased！')
          return false
        }
        return true
      },
      /** Whether there is a change of goods in the distribution area*/
      handleInStockChange(in_store) {
        this.in_store = in_store
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/styles/color";
  .pro-name, .pro-details {
    background: url(../../assets/images/icons-goods.png) repeat-x 0 bottom;
    padding-bottom: 15px;
  }
  .goods-info {
    padding-left: 20px;
    padding-right: 20px;
    .pro-name {
      h1 {
        font: normal 16px/24px "microsoft yahei";
        color: #333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        padding-left: 10px;
        word-break: break-all;
        width: 530px;
      }
    }
    .pro-details {
      padding: 10px 0;
      color: #666666;
      position: relative;
    }
    .buy-num {
      padding-top: 5px;
      .pro-content { display: flex }
    }
    .count-num {
      display: flex;
      align-items: center;
    }
    .num {
      border-top: 1px solid #ededed;
      border-bottom: 1px solid #ededed;
      height: 19px;
      padding-top: 1px;
      background: #fff;
      display: block;
      input {
        border: 0 none;
        display: block;
        width: 34px;
        height: 18px;
        line-height: 18px;
        text-align: center;
      }
    }
    .oper-num {
      display: block;
      align-items: center;
      background: url(../../assets/images/icons-goods.png) no-repeat;
      width: 21px;
      height: 22px;
      &.down {
        background-position: right -69px;
      }
      &.up {
        background-position: right -47px;
      }
      &:hover { background-position-x: -178px }
      &.not-oper { cursor: not-allowed }
    }
    .buy-btns {
      display: flex;
      .buy-btn {
        display: block;
        width: 160px;
        height: 45px;
        border: 2px solid $color-main;
        background-color: $color-main;
        color: #fff;
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        margin-right: 20px;
        &.disabled {
          background-color: #ccc;
          border-color: #ccc;
          color: #ffffff;
          cursor: not-allowed;
        }
      }
      .buy:not(.disabled):hover {
        background-color: darken($color-main, 10%);
      }
      .add {
        color: $color-main;
        background-color: #fff;
        .ea-icon-cart {
          font-size: 20px;
          margin-right: 10px;
        }
        &:not(.disabled):hover {
          color: darken($color-main, 10%);
          border-color: darken($color-main, 10%);
        }
      }
    }
  }
  /deep/ {
    .pro-list {
      display: flex;
      margin-bottom: 5px;
      padding-left: 10px;
    }
    .pro-title {
      width: 60px;
      padding-right: 17px;
      height: 33px;
      line-height: 33px;
    }
    .pro-title1{
      height: auto;
      line-height: 25px;
    }
    .pro-content {
      width: 454px;
      min-height: 33px;
      line-height: 33px;
      &.price {
        span { font-size: 16px }
        strong { font-size: 22px }
      }
    }
  }
  .pro-spec {
    position: relative;
    margin-top: 10px;
    &.error {
      &:before {
        position: absolute;
        content: '';
        width: 104%;
        height: 104%;
        border: 2px solid red;
        margin-left: -2%;
        margin-top: -2%;
      }
      .error-msg {
        color: red
      }
    }
  }
  .spec-val-btn {
    position: relative;
    border: 2px solid #e2e1e3;
    color: black;
    padding: 10px 15px;
    margin: 0 5px 5px 0;
    cursor: pointer;
    background-color: #fff;
    &.selected {
      border-color: $color-main;
      .ea-icon-right-bottom-checked{ display: block }
    }
    &.spec-image {
      float: left;
      padding: 2px 5px;
      margin-bottom: 5px;
      background-color: #F7F7F7;
      img {
        width: 40px;
        height: 40px;
        vertical-align: middle;
      }
      .spec-text {
        line-height: 50px;
        display: inline-block;
        margin-left: 5px;
        color: #666
      }
    }
    .ea-icon-right-bottom-checked {
      display: none;
      position: absolute;
      right: 0;
      bottom: -1px;
      color: $color-main;
      font-size: 18px;
    }
  }
  .price-box {
    position: relative;
    background-color: #f3f3f3;
  }
  .no-auth {
    width: 100%;
    line-height: 20px;
    background-color: #FFF7D1;
    margin: 10px auto;
    text-align: left;
    border: solid 1px #E5DEBC;
    color: #666;
    padding: 10px;
    box-sizing: border-box;
  }
  .snapshot-box {
    margin-top: 10px;
    padding: 10px;
    background-color: #eaeaea;
    a {
      color: $color-href;
      &:hover { color: $color-main }
    }
  }
</style>
