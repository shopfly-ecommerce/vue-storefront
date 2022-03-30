<template>
  <div id="checkout">
    <div v-if="inventoryList && inventoryList.length === 0" class="listing-empty">
      <img src="../../assets/images/icon-listing-empty.png" alt="购物清单为空！">
      <h2>
        您的购物清单为空，请
        <nuxt-link to="/cart" class="back-cart-btn">返回购物车</nuxt-link>
        选择要结算的商品！或 商品状态变更，请重新购买！
      </h2>
    </div>
    <template v-else>
      <div class="checkout-header">
        <div class="w">
          <div class="logo"><en-logo/></div>
          <en-cart-step :step="2"/>
        </div>
      </div>
      <div v-if="params" class="ckt-control">
        <div class="ckt-title">填写并核对订单信息</div>
        <div class="ckt-content">
          <!--收货人信息 start-->
          <checkout-address
            :address-id="params.address_id"
            @change="handleAddressChanged"
          />
          <!--收货人信息 end-->

          <!--支付方式 start-->
          <checkout-payment
            :payment-type="params.payment_type"
            @change="(type) => { params.payment_type = type }"
          />
          <!--支付方式 end-->

          <!--配送清单 start-->
          <checkout-inventory
            :inventory-list="inventoryList"
            :remark="params.remark"
            @coupon-change="couponUseChange"
          />
          <!--配送清单 end-->

          <!--送货时间 start-->
          <checkout-time
            :receive-time="params.receive_time"
            @change="(time) => { params.receive_time = time }"
          />
          <!--送货时间 end-->

          <!--发票信息 start-->
          <checkout-receipt :receipt="params.receipt || {}" @change="(receipt) => { params.receipt = receipt }"/>
          <!--发票信息 end-->
        </div>
        <div class="ckt-total">
          <checkout-total :order-total="orderTotal"/>
          <div v-if="selectedAddress" class="summary-ckt-total">
            <div class="address-info-ckt">
              <span>收货人信息：</span>
              <span>{{ formatterAddress(selectedAddress) }}</span>
              <span>&nbsp;收货人：&nbsp;<em>{{ selectedAddress.name }}</em>&nbsp;<em>{{ selectedAddress.mobile }}</em></span>
            </div>
          </div>
          <div class="bill-btn-ckt">
            <a href="javascript:;" class="bill_btn" @click="handleCreateTrade">提交订单</a>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Input } from 'element-ui'
  Vue.use(Input)
  import { mapGetters, mapActions } from 'vuex'
  import * as CheckoutComponents from './'
  import * as API_Trade from '@/api/trade'
  import * as API_Members from '@/api/members'
  export default {
    name: 'checkout-index',
    components: CheckoutComponents,
    data() {
      return {
        // 结算参数
        params: '',
        // 订单总金额
        orderTotal: {},
        // 购物清单
        inventoryList: '',
        // 已选地址
        selectedAddress: ''
      }
    },
    mounted() {
      // 获取结算参数
      API_Trade.getCheckoutParams().then(response => {
        if (response.address_id) {
          API_Trade.setAddressId(response.address_id).then(this.GET_Inventories)
        } else {
          this.GET_Inventories()
        }
        this.params = response
      })
    },
    methods: {
      /** 使用优惠券 */
      couponUseChange(shopIndex, couponIndex, use) {
        this.GET_Inventories()
      },
      /** 收货地址发生改变 */
      handleAddressChanged(address) {
        this.selectedAddress = address
        this.params.address_id = address.addr_id
        this.GET_Inventories()
      },
      /** 格式化地址信息 */
      formatterAddress(address) {
        return `${address.province} ${address.city} ${address.county} ${address.town} ${address.addr}`
      },
      /** 提交订单 */
      handleCreateTrade() {
        /** 先调用创建订单接口，再跳转到收银台 */
        API_Trade.createTrade(this.way).then(response => {
          this.$store.dispatch('cart/getCartDataAction');
          this.$router.push({ path: '/checkout/cashier?trade_sn=' + response.trade_sn })
        }).catch(error => {
          const { data = {} } = error.response || {};
          if (data.data) {
            let { data: list } = data;
            try {
              list = eval(list)
            } catch (e) {
            }
            if (!list || !list[0]) {
              this.$message.error(data.message);
              return
            }
            list = typeof (list) === 'string' ? JSON.parse(data) : list;
            let content = '';
            list.forEach(item => {
              content += `
              <div style="display:flex;align-items:center;margin:10px 0;">
                <img src="${item.image}" alt="${item.name}" style="width:80px;height:80px;margin:0 10px;">
                <h5 style="display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp: 3;overflow: hidden;color: red;">${item.name}</h5>
              </div>`
            });
            this.$layer.open({
              type: 1,
              title: data.message || '提示',
              area: ['420px', '240px'],
              scrollbar: false,
              content
            })
          } else {
            this.$message.error(data.message)
          }
        })
      },
      /** 获取购物清单 */
      GET_Inventories() {
        API_Trade.getCarts('checked').then(response => {
          this.inventoryList = response.cart_list
          this.orderTotal = response.total_price
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/styles/checkout";
</style>
