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
            </a>全选
          </span>
          <span class="title">商品信息</span>
          <span class="price">单价（元）</span>
          <span class="num">数量</span>
          <span class="weight">重量（kg）</span>
          <span class="total">小计（元）</span>
          <span class="action">操作</span>
        </div>
        <div class="list-content">
          <div v-if="shopList && shopList.length > 0" class="">
            <div v-for="shop in shopList" :key="shop.shop_id" class="shop-item">
              <div class="shop-header" :class="[shop.invalid === 1 && 'invalid']">
                <div v-if="shop.invalid === 1" style="width: 35px"></div>
                <a v-else href="javascript:;" :class="['check', shop.checked && 'checked']" @click="handleCheckShop(shop)">
                  <i class="iconfont ea-icon-check"></i>
                </a>
                <span class="shop-name">{{ shop.seller_name }}</span>
                <span class="shop-act-info" v-if="shop.promotion_notice">[{{ shop.promotion_notice }}]</span>
              </div>
              <div class="shop-body">
                <div v-for="sku in shop.sku_list" :key="sku.sku_id" class="sku-item" :class="[sku.invalid === 1 && 'invalid']">
                  <div class="item clearfix">
                    <span v-if="sku.invalid === 1" class="invalid-pla">已失效</span>
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
                          促销<i class="iconfont ea-icon-arrow-down"></i>
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
                              >不参与促销活动
                            </li>
                          </ul>
                          <div class="activity-list-btns">
                            <a @click="handleConfirmChangeAct(sku)" class="act-l-btn confirm" href="javascript:void(0)">确定</a>
                            <a @click="show_act_sku_id = null" class="act-l-btn" href="javascript:void(0)">取消</a>
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
                      <div v-if="sku.invalid === 1">此商品已失效</div>
                      <span v-if="!sku.is_ship" class="out-of-stock-tip">无货</span>
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
                  重量：<span>{{ shop.weight.toFixed(2) }}kg</span>
                </div>
                <div class="shop-footer-item price">
                  <em>￥</em>
                  <span>{{ shop.price.original_price | unitPrice }}</span>
                </div>
                <div class="shop-cash-back" v-if="shop.price.cash_back">[返现：-￥{{ shop.price.cash_back | unitPrice }}]</div>
              </div>
            </div>
          </div>
          <div v-else style="background: #fff">
            <div class="empty-cart">
              <h1>您的购物车中暂无商品</h1>
              <a href="/">挑选心爱的商品</a>
              <nuxt-link to="/member/my-order">查看我的订单</nuxt-link>
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
                <span>全选 共（<b>{{ allCount }}</b>）件</span>
            </span>
            <em>|</em>
            <a href="javascript:;" class="check-tool-a" @click="handleBatchDelete">批量删除</a>
            <em>|</em>
            <a href="javascript:;" class="check-tool-a" @click="handleCleanCart">清空购物车</a>
          </div>
          <div class="check-bar-right">
            <span>已选商品<b style="color: #ff5e5e; margin: 0 2px">{{ checkedCount }}</b>件</span>
            <em>|</em>
            <span>合计：<b class="price">￥<i>{{ (cartTotal.total_price || 0) | unitPrice }}</i></b></span>
            <a href="javascript:;" :class="['check-btn', !checkedCount && 'disabled']" @click="handleCheckout">去结算</a>
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
        title: `购物车-${this.site.title}`
      }
    },
    data() {
      return {
        /** 结算栏相对顶部高度 */
        check_bar_top: 0,
        /** 是否固定到顶部 */
        check_bar_fiexd_top: false,
        /** 是否固定到底部 */
        check_bar_fiexd_bottom: false,
        /** 当前操作的输入框的值【变化之前】 */
        current_input_value: 1,
        /** 显示促销选择框 */
        show_act_sku_id: null
      }
    },
    mounted() {
      this.$nextTick(() => {
        /** 获内容区域jQuery对象 */
        this.$cartContent = $('#cart-content')
        /** 添加滚动事件监听 */
        window.addEventListener('scroll', this.countCheckBarFiexd)
        /** 添加点击事件 */
        window.addEventListener('click', this.handleCloseAct)
        /** 获取购物车数据 */
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
      /** 是否全部选中 */
      all_checked() {
        return !!this.checkedCount && this.checkedCount === this.allCount
      }
    },
    watch: {
      /** 当数据变化时，重新计算结算栏相对顶部距离。并且计算是应该固定在顶部，还是固定到底部，或者是位置不变 */
      skuList() {
        // 计算当前结算栏相对顶部距离【计算结算栏以上的高度】
        this.$nextTick(() => {
          // 31: 顶部快捷导航高度 -|- 100: logo区域高度 -|- 20 + 20: 内容margin-top + 内容padding-bottom
          this.check_bar_top = 31 + (this.$cartContent.height() + 20 + 20) + 100
          this.countCheckBarFiexd()
        })
      }
    },
    methods: {
      /** 勾选、取消勾选商品 */
      handleCheckSku(sku) {
        console.log(11, sku)
        this.checkSkuItem({ sku_id: sku.sku_id, checked: sku.checked ? 0 : 1 })
      },
      /** 勾选、取消勾选店铺 */
      handleCheckShop(shop) {
        this.checkShopSku({ shop_id: shop.seller_id, checked: shop.checked ? 0 : 1 })
      },
      /** 全选、取消全选 */
      handleCheckAll() {
        this.checkAll(this.all_checked ? 0 : 1)
      },
      /** 更新商品数量 */
      handleUpdateSkuNum(sku, symbol) {
        if (symbol === '-' && sku.num < 2) return
        if (symbol === '+' && sku.num >= sku.enable_quantity) {
          this.$message.error('超过最大库存！')
          return
        }
        let _num = symbol === '+' ? sku.num + 1 : sku.num - 1
        this.updateSkuNum({sku_id: sku.sku_id, num: _num})
      },
      /** 输入框被焦点【记录当前值】 */
      handleSkuNumFocus(sku) {
        this.current_input_value = sku.num
      },
      /** 输入框值发生改变 */
      handleSkuNumChanged(event, sku) {
        const _value = event.target.value
        if (!RegExp.integer.test(_value)) {
          this.$message.error('您的输入不合法！')
          event.target.value = this.current_input_value
          return
        }
        if(Number(_value) > sku.enable_quantity) {
          this.$message.error('超过可用库存！');
          return
        }
        if (Number(_value) === sku.num) return
        this.current_input_value = sku.num
        this.updateSkuNum({sku_id: sku.sku_id, num: Number(_value)})
      },
      /** 删除 */
      handleDelete(sku) {
        this.$confirm('确定要删除这个货品吗？', () => {
          this.deleteSkuItem(sku.sku_id).then(response => {
            this.$message.success('删除成功！')
          })
        })
      },
      /** 批量删除 */
      handleBatchDelete() {
        this.skuList.forEach(ite => {
          if (ite.checked == 1) {
            if (!this.skuList.length) return
            this.$confirm('确定要删除这些货品吗？', () => {
              // 筛选出已选中的
              const _sku_list = this.skuList.filter(item => item.checked).map(item => item.sku_id)
              if (!_sku_list.length) return
              this.deleteSkuItem(_sku_list).then(response => {
                this.$message.success('删除成功！')
              })
            })
          } else {
            return
          }
        })
      },
      /** 清空购物车 */
      handleCleanCart() {
        this.$confirm('确定要清空购物车吗？', () => {
          this.cleanCart().then(() => this.$message.success('购物车已清空！'))
        })
      },
      /** 去结算 */
      handleCheckout() {
        if (!this.checkedCount) return false
        this.$router.push({ path: '/checkout' })
      },
      /** 监听页面滚动，实现结算栏浮起、固定 */
      countCheckBarFiexd(event) {
        // 获取滚动条当前位置
        const bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop
        // 是否固定到顶部
        this.check_bar_fiexd_top = bodyScrollTop > this.check_bar_top
        // 是否固定到底部
        this.check_bar_fiexd_bottom = bodyScrollTop < (this.check_bar_top - window.innerHeight  + 60)
      },
      /** 确认修改促销活动 */
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
      /** 展示sku促销弹框 */
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
      /** 关闭sku促销弹框 */
      handleCloseAct() {
        this.show_act_sku_id = null
      },
      /** 检查是否没有活动被参与 */
      handleActsChecked(acts) {
        const act = acts.filter(item => item.is_check === 1)
        return act.length === 0
      },
      /** vuex/cart */
      ...mapActions({
        // 获取购物车数据
        getCartData: 'cart/getCartDataAction',
        // 更新货品数量
        updateSkuNum: 'cart/updateSkuNumAction',
        // 选择、取消选择货品
        checkSkuItem: 'cart/checkSkuItemAction',
        // 选择、取消选择店铺内所有商品
        checkShopSku: 'cart/checkShopSkuAction',
        // 全选、取消全选
        checkAll: 'cart/checkAllAction',
        // 删除货品
        deleteSkuItem: 'cart/deleteSkuItemAction',
        // 清空购物车
        cleanCart: 'cart/cleanCartAction',
        // 更换促销活动
        changeActivity: 'cart/changeActivityAction',
        // 不参加活动
        cleanActivity: 'cart/cleanActivityAction'
      })
    },
    destroyed() {
      /** 当组件销毁时，移除事件监听 */
      window.removeEventListener('scroll', this.countCheckBarFiexd)
      window.removeEventListener('click', this.handleCloseAct)
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../assets/styles/cart";
</style>
