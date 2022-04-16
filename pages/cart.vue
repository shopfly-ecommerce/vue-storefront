<template>
  <div id="cart" style="background: #f5f5f5;padding-bottom: 20px">
    <div class="cart-header">
      <div class="w">
        <div class="logo"><en-logo/></div>
        <en-cart-step :step="1"/>
      </div>
    </div>
    <div class="cart-content" id="cart-content">
      <div class="w">
        <div class="list-header">
          <span class="checkbox select-all" @click="handleCheckAll">
            <a href="javascript:;" :class="['check', 'check-all', all_checked && 'checked']">
              <i class="iconfont ea-icon-check"></i>
            </a>Select all
          </span>
          <span class="title">Product information</span>
          <span class="price">Price（USD）</span>
          <span class="num">Number</span>
          <span class="weight">Weight（kg）</span>
          <span class="total">subtotal（USD）</span>
          <span class="action">&nbsp;</span>
        </div>
        <div class="list-content">
          <div v-if="shopList && shopList.length > 0" class="">
            <div v-for="shop in shopList" :key="shop.shop_id" class="shop-item">
<!--              <div class="shop-header" :class="[shop.invalid === 1 && 'invalid']">-->
<!--                <div v-if="shop.invalid === 1" style="width: 35px"></div>-->
<!--                <a v-else href="javascript:;" :class="['check', shop.checked && 'checked']" @click="handleCheckShop(shop)">-->
<!--                  <i class="iconfont ea-icon-check"></i>-->
<!--                </a>-->
<!--                <span class="shop-name">{{ shop.seller_name }}</span>-->
<!--                <span class="shop-act-info" v-if="shop.promotion_notice">[{{ shop.promotion_notice }}]</span>-->
<!--              </div>-->
              <div class="shop-body">
                <div v-for="sku in shop.sku_list" :key="sku.sku_id" class="sku-item" :class="[sku.invalid === 1 && 'invalid']">
                  <div class="item clearfix">
                    <span v-if="sku.invalid === 1" class="invalid-pla">Has the failure</span>
                    <a v-else href="javascript:;" :class="['check', sku.checked && 'checked']" @click="handleCheckSku(sku)">
                      <i class="iconfont ea-icon-check"></i>
                    </a>
                    <a :href="'/goods/' + sku.goods_id" class="sku-pic">
                      <img :src="sku.goods_image" :alt="sku.name">
                    </a>
                    <div class="sku-name-box">
                      <a :href="'/goods/' + sku.goods_id" class="sku-name">
                        {{ sku.name }}
                      </a>
                      <span v-if="sku.spec_list && sku.spec_list.length > 0" class="sku-spec">
                        {{ sku | formatterSkuSpec }}
                      </span>
                      <p v-if="sku.promotion_tags && sku.promotion_tags.length">
                        <span class="sku-act-tag" v-for="(tag, index) in sku.promotion_tags" :key="index">{{ tag }}</span>
                      </p>
                    </div>
                    <div class="sku-price">
                      <span v-if="sku.purchase_price < sku.original_price" class="original-price">{{ sku.original_price | unitPrice }}</span>
                      <span> {{ sku.purchase_price | unitPrice }}</span>
                      <div
                        :class="[show_act_sku_id === sku.sku_id && 'show-act']"
                        class="activity-box"
                        v-if="sku.invalid !== 1 && sku.single_list && sku.single_list.length"
                      >
                        <a @click.stop="handleShowAct(sku)" class="activity-btn" href="javascript:void(0)" slot="reference">
                          Sales promotion<i class="iconfont ea-icon-arrow-down"></i>
                        </a>
                        <div @click.stop="() => {}" class="activity-list" v-show="sku.sku_id === show_act_sku_id">
                          <ul class="act-list">
                            <li :key="index" v-for="(act, index) in sku.single_list">
                              <input
                                :checked="act.is_check && 'checked'"
                                :name="'act_'+sku.sku_id"
                                :value="JSON.stringify(act)"
                                type="radio"
                              >{{ act.title }}
                            </li>
                            <li>
                              <input
                                :checked="handleActsChecked(sku.single_list) && 'checked'"
                                :name="'act_'+sku.sku_id"
                                value="clean"
                                type="radio"
                              >Do not participate in promotional activities
                            </li>
                          </ul>
                          <div class="activity-list-btns">
                            <a @click="handleConfirmChangeAct(sku)" class="act-l-btn confirm" href="javascript:void(0)">save</a>
                            <a @click="show_act_sku_id = null" class="act-l-btn" href="javascript:void(0)">cancel</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="sku-num">
                      <div v-if="sku.invalid !== 1" class="num-action clearfix">
                        <a :class="['oper', sku.num < 2 && 'unable']" href="javascript:;" @click="handleUpdateSkuNum(sku, '-')">−</a>
                        <input
                          class="input"
                          type="number"
                          :value="sku.num"
                          :title="sku.num"
                          @focus="handleSkuNumFocus(sku)"
                          @change="handleSkuNumChanged($event, sku)"
                        >
                        <a :class="['oper', sku.num >= sku.enable_quantity && 'unable']" href="javascript:;" @click="handleUpdateSkuNum(sku, '+')">+</a>
                      </div>
                      <div v-if="sku.invalid === 1">This item is no longer valid</div>
                      <span v-if="!sku.is_ship" class="out-of-stock-tip">Is not available</span>
                    </div>
                    <div class="sku-weight">
                      {{ (sku.num * sku.goods_weight).toFixed(2) }}
                    </div>
                    <div class="sku-total">
                      {{ sku.subtotal | unitPrice }}
                    </div>
                    <div class="sku-action">
                      <i class="iconfont ea-icon-delete" @click="handleDelete(sku)"></i>
                    </div>
                    <div v-if="sku.error_message" class="sku-error-msg">{{ sku.error_message }}</div>
                  </div>
                </div>
              </div>
              <div class="shop-footer">
                <div class="shop-footer-item">
                  Weight：<span>{{ shop.weight.toFixed(2) }}kg</span>
                </div>
                <div class="shop-footer-item price">
                  <em>￥</em>
                  <span>{{ shop.price.original_price | unitPrice }}</span>
                </div>
                <div class="shop-cash-back" v-if="shop.price.cash_back">[Cash back：-￥{{ shop.price.cash_back | unitPrice }}]</div>
              </div>
            </div>
          </div>
          <div v-else style="background: #fff">
            <div class="empty-cart">
              <h1>Your cart is empty</h1>
              <a href="/">Choose  favorite</a>
              <nuxt-link to="/member/my-order">Check my order</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="['cart-checkbar', check_bar_fiexd_top && 'fiexd-top', check_bar_fiexd_bottom && 'fiexd-bottom']" id="check-bar">
      <div class="check-bar">
        <div class="w">
          <div class="check-bar-left">
            <span class="select-all" @click="handleCheckAll">
              <a href="javascript:;" :class="['check', 'check-all', all_checked && 'checked']">
                  <i class="iconfont ea-icon-check"></i>
                </a>
                <span>Selelct all（<b>{{ allCount }}</b>）items</span>
            </span>
            <em>|</em>
            <a href="javascript:;" class="check-tool-a" @click="handleBatchDelete">Batch delete</a>
            <em>|</em>
            <a href="javascript:;" class="check-tool-a" @click="handleCleanCart">Empty shopping cart</a>
          </div>
          <div class="check-bar-right">
            <span>Items( <b style="color: #ff5e5e; margin: 0 2px">{{ checkedCount }}</b>)</span>
            <em>|</em>
            <span>Subtotal：<b class="price">￥<i>{{ (cartTotal.total_price || 0) | unitPrice }}</i></b></span>
            <a href="javascript:;" :class="['check-btn', !checkedCount && 'disabled']" @click="handleCheckout">Checkout</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Popover, Tooltip } from 'element-ui'
  Vue.use(Popover).use(Tooltip)
  import { mapActions, mapGetters } from 'vuex'
  import * as API_Trade from '@/api/trade'
  import { RegExp } from '@/ui-utils'
  export default {
    name: 'cart',
    layout: 'full',
    middleware: 'auth-user',
    head() {
      return {
        title: `The shopping cart-${this.site.title}`
      }
    },
    data() {
      return {
        /** Height of settlement column relative to top*/
        check_bar_top: 0,
        /** Whether fixed to the top*/
        check_bar_fiexd_top: false,
        /** Whether to fix the bottom*/
        check_bar_fiexd_bottom: false,
        /** The value of the input box for the current operation【Before the change】 */
        current_input_value: 1,
        /** Displays the promotion selection box*/
        show_act_sku_id: null
      }
    },
    mounted() {
      this.$nextTick(() => {
        /** Access content areajQueryobject*/
        this.$cartContent = $('#cart-content')
        /** Add a scroll event listener*/
        window.addEventListener('scroll', this.countCheckBarFiexd)
        /** Add click events*/
        window.addEventListener('click', this.handleCloseAct)
        /** Get shopping cart data*/
        this.getCartData()
      })
    },
    computed: {
      ...mapGetters({
        shopList: 'cart/shopList',
        skuList: 'cart/skuList',
        checkedCount: 'cart/checkedCount',
        allCount: 'cart/allCount',
        cartTotal: 'cart/cartTotal'
      }),
      /** All selected*/
      all_checked() {
        return !!this.checkedCount && this.checkedCount === this.allCount
      }
    },
    watch: {
      /** When the data changes, recalculate the distance between the settlement column and the top. And calculate whether it should be fixed at the top, or at the bottom, or in the same position*/
      skuList() {
        // Calculate the distance between the current settlement bar and the top of the settlement bar
        this.$nextTick(() => {
          // 31: at the top of the quick navigation highly - | - 100: the logo area highly - | - 20 + 20: content padding - bottom margin - top + content
          this.check_bar_top = 31 + (this.$cartContent.height() + 20 + 20) + 100
          this.countCheckBarFiexd()
        })
      }
    },
    methods: {
      /** Check the、cancelCheck theproduct*/
      handleCheckSku(sku) {
        console.log(11, sku)
        this.checkSkuItem({ sku_id: sku.sku_id, checked: sku.checked ? 0 : 1 })
      },
      /** Check the、cancelCheck theThe store*/
      handleCheckShop(shop) {
        this.checkShopSku({ shop_id: shop.seller_id, checked: shop.checked ? 0 : 1 })
      },
      /** Select all、cancelSelect all*/
      handleCheckAll() {
        this.checkAll(this.all_checked ? 0 : 1)
      },
      /** Update quantity of goods*/
      handleUpdateSkuNum(sku, symbol) {
        if (symbol === '-' && sku.num < 2) return
        if (symbol === '+' && sku.num >= sku.enable_quantity) {
          this.$message.error('Over maximum stock！')
          return
        }
        let _num = symbol === '+' ? sku.num + 1 : sku.num - 1
        this.updateSkuNum({sku_id: sku.sku_id, num: _num})
      },
      /** The input box is focused【Record current value】 */
      handleSkuNumFocus(sku) {
        this.current_input_value = sku.num
      },
      /** The input field value changed*/
      handleSkuNumChanged(event, sku) {
        const _value = event.target.value
        if (!RegExp.integer.test(_value)) {
          this.$message.error('Your input is invalid！')
          event.target.value = this.current_input_value
          return
        }
        if(Number(_value) > sku.enable_quantity) {
          this.$message.error('Excess of available stock！');
          return
        }
        if (Number(_value) === sku.num) return
        this.current_input_value = sku.num
        this.updateSkuNum({sku_id: sku.sku_id, num: Number(_value)})
      },
      /** delete*/
      handleDelete(sku) {
        this.$confirm('Are you sure you want to delete this item？', () => {
          this.deleteSkuItem(sku.sku_id).then(response => {
            this.$message.success('Delete the success！')
          })
        })
      },
      /** Batch delete*/
      handleBatchDelete() {
        this.skuList.forEach(ite => {
          if (ite.checked == 1) {
            if (!this.skuList.length) return
            this.$confirm('Are you sure you want to delete these items？', () => {
              // Filter out the selected ones
              const _sku_list = this.skuList.filter(item => item.checked).map(item => item.sku_id)
              if (!_sku_list.length) return
              this.deleteSkuItem(_sku_list).then(response => {
                this.$message.success('Delete the success！')
              })
            })
          } else {
            return
          }
        })
      },
      /** Empty shopping cart*/
      handleCleanCart() {
        this.$confirm('Are you sure you want to empty your shopping cart？', () => {
          this.cleanCart().then(() => this.$message.success('Cart empty！'))
        })
      },
      /** To settle accounts*/
      handleCheckout() {
        if (!this.checkedCount) return false
        this.$router.push({ path: '/checkout' })
      },
      /** Monitor page scrolling, realize the settlement column float、fixed*/
      countCheckBarFiexd(event) {
        // Gets the current position of the scroll bar
        const bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop
        // Whether fixed to the top
        this.check_bar_fiexd_top = bodyScrollTop > this.check_bar_top
        // Whether to fix the bottom
        this.check_bar_fiexd_bottom = bodyScrollTop < (this.check_bar_top - window.innerHeight  + 60)
      },
      /** Confirm modification of promotion*/
      handleConfirmChangeAct(sku) {
        const eleStr = `input[name=act_${sku.sku_id}]:checked`
        const val = $(eleStr).val()
        if (val === 'clean') {
          const { seller_id, sku_id } = sku
          this.cleanActivity({seller_id, sku_id})
        } else {
          const val = JSON.parse($(eleStr).val())
          const { activity_id, promotion_type } = val
          const { seller_id, sku_id } = sku
          const params = { seller_id, sku_id, activity_id, promotion_type }
          this.changeActivity(params)
        }
        this.show_act_sku_id = null
      },
      /** showskuPromotion bounced*/
      handleShowAct(sku) {
        const { sku_id } = sku
        const { show_act_sku_id } = this
        if (sku_id === show_act_sku_id) {
          this.show_act_sku_id = null
          return
        } else {
          this.show_act_sku_id = sku_id
        }
      },
      /** closeskuPromotion bounced*/
      handleCloseAct() {
        this.show_act_sku_id = null
      },
      /** Check to see if no activity is involved*/
      handleActsChecked(acts) {
        const act = acts.filter(item => item.is_check === 1)
        return act.length === 0
      },
      /** vuex/cart */
      ...mapActions({
        // Get shopping cart data
        getCartData: 'cart/getCartDataAction',
        // Update quantity of goods
        updateSkuNum: 'cart/updateSkuNumAction',
        // Select and deselect goods
        checkSkuItem: 'cart/checkSkuItemAction',
        // Select and deselect all items in the store
        checkShopSku: 'cart/checkShopSkuAction',
        // Select all, cancel select all
        checkAll: 'cart/checkAllAction',
        // Delete the item
        deleteSkuItem: 'cart/deleteSkuItemAction',
        // Empty shopping cart
        cleanCart: 'cart/cleanCartAction',
        // Change promotions
        changeActivity: 'cart/changeActivityAction',
        // Not participating in activities
        cleanActivity: 'cart/cleanActivityAction'
      })
    },
    destroyed() {
      /** Remove event listeners when a component is destroyed*/
      window.removeEventListener('scroll', this.countCheckBarFiexd)
      window.removeEventListener('click', this.handleCloseAct)
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../assets/styles/cart";
</style>
