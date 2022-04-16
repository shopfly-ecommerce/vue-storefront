<template>
  <div id="checkout">
    <div v-if="inventoryList && inventoryList.length === 0" class="listing-empty">
      <img src="../../assets/images/icon-listing-empty.png" alt="The shopping list is empty！">
      <h2>
        Your shopping list is empty, please
        <nuxt-link to="/cart" class="back-cart-btn">Return to shopping cart</nuxt-link>
        Select goods to be billed！Or product status change, please repurchase！
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
        <div class="ckt-title">Check the order information</div>
        <div class="ckt-content">
          <!--Consignee informationstart-->
          <checkout-address
            :address-id="params.address_id"
            @change="handleAddressChanged"
          />
          <!--Consignee informationend-->

          <!--Method of paymentstart-->
          <checkout-payment
            :payment-type="params.payment_type"
            @change="(type) => { params.payment_type = type }"
          />
          <!--Method of paymentend-->

          <!--Distribution liststart-->
          <checkout-inventory
            :inventory-list="inventoryList"
            :remark="params.remark"
            @coupon-change="couponUseChange"
          />
          <!--Distribution listend-->

          <!--Delivery timestart-->
          <checkout-time
            :receive-time="params.receive_time"
            @change="(time) => { params.receive_time = time }"
          />
          <!--Delivery timeend-->

          <!--The invoice informationstart-->
<!--          <checkout-receipt :receipt="params.receipt || {}" @change="(receipt) => { params.receipt = receipt }"/>-->
          <!--The invoice informationend-->
        </div>
        <div class="ckt-total">
          <checkout-total :order-total="orderTotal"/>
          <div v-if="selectedAddress" class="summary-ckt-total">
            <div class="address-info-ckt">
              <span>Consignee information：</span>
              <span>{{ formatterAddress(selectedAddress) }}</span>
              <span>&nbsp;The consignee：&nbsp;<em>{{ selectedAddress.name }}</em>&nbsp;<em>{{ selectedAddress.mobile }}</em></span>
            </div>
          </div>
          <div class="bill-btn-ckt">
            <a href="javascript:;" class="bill_btn" @click="handleCreateTrade">Submit order</a>
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
        // Settlement parameter
        params: '',
        // Total order Amount
        orderTotal: {},
        // Shopping list
        inventoryList: '',
        // The selected address
        selectedAddress: ''
      }
    },
    mounted() {
      // Get settlement parameters
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
      /** Use coupons*/
      couponUseChange(shopIndex, couponIndex, use) {
        this.GET_Inventories()
      },
      /** The receiving address has changed*/
      handleAddressChanged(address) {
        this.selectedAddress = address
        this.params.address_id = address.addr_id
        this.GET_Inventories()
      },
      /** Formatting address information*/
      formatterAddress(address) {
        return `${address.province} ${address.city} ${address.county} ${address.town} ${address.addr}`
      },
      /** Submit orders*/
      handleCreateTrade() {
        /** Call the create order interface first, then jump to the cash register*/
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
              title: data.message || 'prompt',
              area: ['420px', '240px'],
              scrollbar: false,
              content
            })
          } else {
            this.$message.error(data.message)
          }
        })
      },
      /** Get a shopping list*/
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
