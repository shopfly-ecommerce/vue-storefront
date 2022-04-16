<template>
  <div id="cashier">
    <en-header-other title="checkstand"/>
    <div class="cashier-box">
      <div class="cashier-change">
        <h2 class="time-tip" v-if="order.pay_type_text === 'ONLINE' && order.need_pay_price !== 0">
          The order has been submitted successfully<span>24hours</span>Otherwise the order will be automatically cancelled.
        </h2>
        <h2 class="time-tip" v-else-if="order.pay_type_text !== 'COD'">The order amount is<span>￥0.00</span>You dont have to pay.</h2>
        <h2 v-if="this.trade_sn">
          Transaction no.：<b>{{ trade_sn }}</b>
          <a class="see-order-btn" href="/member/my-order">To view the order</a>
        </h2>
        <h2 v-else>The order no.：<b>{{ order_sn }}</b>
          <a class="see-order-btn" :href="'/member/my-order/detail?order_sn=' + order_sn">To view the order</a>
        </h2>
        <h2>{{ !order ? '' : order.pay_type_text === 'ONLINE' ? 'Online payment：' : 'Cash on delivery：' }}
          <span v-if="order">￥{{ order.need_pay_price | unitPrice }}</span>
          <span v-else>Loading...</span>
          <i>USD</i>
          <span class="pay-tip">Order status refresh may be delayed. If you have paid successfully, do not pay again！</span>
        </h2>
        <div class="cashier-order-detail">
          <div class="cashier-order-inside">
            <h3><i></i>Delivery to the：
              <template v-if="order">
                <span>{{ order.ship_province }}</span>
                <span>{{ order.ship_city }}</span>
                <span>{{ order.ship_county }}</span>
                <span>{{ order.ship_town || '' }}</span>
                <span>{{ order.ship_addr }}</span>
                <span>{{ order.ship_mobile }}</span>
              </template>
              <span v-else>In the load...</span>
            </h3>
          </div>
        </div>
        <div class="cashier-tools" v-if="order.pay_type_text === 'ONLINE' && order.need_pay_price !== 0">
          <div class="cashier-tools-inside">
            <div class="cashier-tools-title">
              <h3>Payment method</h3>
            </div>
            <ul class="cashier-pay-list">
              <li v-for="payment in paymentList" :key="payment.plugin_id" :class="['payment-item', payment.selected && 'selected']">
                <img :src="payment.image" @click="initiatePay(payment, 'qr')">
              </li>
            </ul>
          </div>
        </div>
        <div v-show="showPayBox" class="cashier-pay-box">
          <div class="pay-item">
            <div class="pay-left">
              <p v-if="payment_plugin_id !== 'weixinPayPlugin'">Pay by computer</p>
              <div v-if="payment_plugin_id === 'weixinPayPlugin'" class="pc-pay-img">
                <img src="../../assets/images/background-wechat.jpg">
              </div>
              <div v-else class="pc-pay-img"></div>
              <a class="pay-btn" href="javascript:;" @click="initiatePay(false, 'normal')">Pay ${{ order.need_pay_price }} </a>
              <i v-if="payment_plugin_id === 'alipayDirectPlugin'" class="icon-or"></i>
            </div>
            <div v-if="payment_plugin_id === 'alipayDirectPlugin' || payment_plugin_id === 'weixinPayPlugin'" class="pay-right">
              <p v-if="payment_plugin_id === 'alipayDirectPlugin'">Use Alipay wallet scan to pay</p>
              <p v-if="payment_plugin_id === 'weixinPayPlugin'">You can pay with a swipe of your wechat wallet</p>
              <div class="pay-qrcode" id="pay-qrcode">
                <iframe id="iframe-qrcode" width="200px" height="200px" scrolling="no"></iframe>
              </div>
            </div>
          </div>
        </div>
        <div class="same-pay-way bank-pay paybtn">
          <a @click="$message.error('Please select payment method first！')" href="javascript:;" v-if="!showPayBox && order.pay_type_text === 'ONLINE' && order.need_pay_price !== 0">Pay ${{ order.need_pay_price }}</a>
          <nuxt-link to="/member/my-order" v-if="order.pay_type_text !== 'ONLINE' || order.need_pay_price === 0">To view the order</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as API_Trade from '@/api/trade'
  import request from '@/utils/request'
  export default {
    name: 'cashier',
    layout: 'full',
    middleware: 'auth-user',
    data() {
      return {
        trade_sn: this.$route.query.trade_sn,
        order_sn: this.$route.query.order_sn,
        // List of payment methods
        paymentList: [],
        // The order details
        order: '',
        // Display payment window
        showPayBox: false,
        // Method of payment
        payment_plugin_id: '',
        // Displays a dialog to confirm order completion payment
        showConfirmDialog: false
      }
    },
    mounted() {
      Promise.all([
        this.trade_sn
          ? API_Trade.getCashierData({ trade_sn: this.trade_sn })
          : API_Trade.getCashierData({ order_sn: this.order_sn }),
        API_Trade.getPaymentList()
      ]).then(responses => {
        this.order = responses[0]
        this.paymentList = responses[1].map(item => {
          item.selected = false
          return item
        })
      })
    },
    methods: {
      /** Initiate payment*/
      initiatePay(payment, pay_mode) {
        this.showPayBox = true
        if (payment) {
          this.$set(this, 'paymentList', this.paymentList.map(item => {
            item.selected = item.plugin_id === payment.plugin_id
            return item
          }))
        } else {
          payment = this.paymentList.filter(item => item.selected)[0]
        }
        this.payment_plugin_id = payment.plugin_id
        const trade_type = this.trade_sn ? 'trade' : 'order'
        const sn = this.trade_sn || this.order_sn
        const client_type = 'PC'
        const payment_plugin_id = payment.plugin_id
        // If it is normal mode, jump to a new window to pay
        if (pay_mode === 'normal') {
          window.open(`./cashier-load-pay?trade_type=${trade_type}&sn=${sn}&payment_plugin_id=${payment_plugin_id}`)
          return false
        }
        // If the qr code mode, and the payment method is not Alipay or wechat, jump to the new window to pay
        if (pay_mode === 'qr' && (payment_plugin_id !== 'alipayDirectPlugin' && payment_plugin_id !== 'weixinPayPlugin')) {
          window.open(`./cashier-load-pay?trade_type=${trade_type}&sn=${sn}&payment_plugin_id=${payment_plugin_id}`)
          return false
        }
        this.$nextTick(() => {
          document.getElementById('pay-qrcode').innerHTML = `<iframe id="iframe-qrcode" width="200px" height="200px" scrolling="no"></iframe>`
          // If it is a normal payment method, open a new window and then jump to the payment website
          API_Trade.initiatePay(trade_type, sn, {
            client_type,
            pay_mode,
            payment_plugin_id
          }).then(response => {
            let $formItems = ''
            response.form_items && response.form_items.forEach(item => {
              $formItems += `<input name="${item.item_name}" type="hidden" value='${item.item_value}' />`
            })
            let $form = `<form action="${response.gateway_url}" method="post">${$formItems}</form>`
            const qrIframe = document.getElementById('iframe-qrcode').contentWindow.document
            qrIframe.getElementsByTagName('body')[0].innerHTML = $form
            qrIframe.forms[0].submit()
          })
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/styles/color";
  .cashier-box {
    width: 100%;
    background: #f5f5f5;
    padding: 20px 0;
  }
  .cashier-change {
    width: 950px;
    margin: 0 auto;
    padding: 30px 50px;
    position: relative;
    box-shadow: 0 2px 5px #ccc;
    background: #fff;
    h2 {
      width: 950px;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      font-weight: 200;
      b {
        font-weight: 200;
        font-size: 14px;
        color: #ff6700;
      }
      span {
        font-size: 20px;
        color: $color-main;
        margin: 0 5px 0 0;
      }
    }
    .pay-tip {
      font-size: 16px;
      color: $color-main;
      font-weight: 400;
      margin-left: 20px;
    }
    .cashier-order-detail {
      width: 950px;
      border: 1px solid #e1e1e1;
      background: #f4f4f4;
      margin: 20px 0 0 0;
    }
    .cashier-tools {
      width: 950px;
      border: 1px solid #e1e1e1;
      background: #f4f4f4;
      margin: 20px 0 20px 0;
      .cashier-tools-inside {
        margin: 3px;
        background: #fff;
      }
      .cashier-tools-title {
        height: 52px;
        line-height: 52px;
        h3 {
          width: 924px;
          height: 52px;
          line-height: 52px;
          font-weight: 200;
          font-size: 12px;
          background: #fcfcfc;
          padding-left: 20px;
        }
      }
      .cashier-pay-list {
        width: 844px;
        overflow: hidden;
        margin: 0 10px;
        padding: 10px 40px;
        .payment-item {
          float: left;
          line-height: 30px;
          margin: 0 8px 10px 0;
          padding: 5px 5px;
          position: relative;
          border: 1px solid #e0e0e0;
          cursor: pointer;
          img {
            width: 150px;
            height: 35px;
          }
          &.selected {
            border: 2px solid #f56a3e;
            padding: 4px;
          }
        }
      }
    }
    .cashier-order-inside {
      margin: 3px;
      background: #fff;
      height: 52px;
      overflow: hidden;
      h3 {
        width: 944px;
        height: 52px;
        line-height: 52px;
        font-weight: 200;
        font-size: 12px;
        background: #fcfcfc;
        i {
          width: 21px;
          height: 21px;
          display: block;
          background: url(../../assets/images/icons-cashier.png) no-repeat -70px 0;
          float: left;
          margin: 15px 10px 0 20px;
        }
        span { margin: 0 5px }
      }
    }
    .paybtn {
      a {
        font-family: Microsoft YaHei;
        width: 180px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        background: $color-main;
        display: block;
        margin: 30px auto 0 auto;
      }
    }
  }
  .cashier-pay-box {
    width: 950px;
    border: 1px solid #e1e1e1;
    background: #f4f4f4;
    margin: 0 0 40px 0;
    padding-top: 3px;
    .pay-item {
      display: flex;
      justify-content: center;
      margin: 0 3px 3px 3px;
      background: #fff;
      overflow: hidden;
      height: 335px;
      .pay-left {
        width: 471px;
        float: left;
        height: 310px;
        position: relative;
        p {
          width: 450px;
          text-align: center;
          height: 30px;
          line-height: 30px;
          margin: 25px 0 0 0;
          font-size: 16px;
        }
        .pc-pay-img {
          height: 92px;
          margin-left: 150px;
          margin-top: 48px;
          width: 165px;
          background: url(../../assets/images/icons-cashier.png) no-repeat 0 -1417px;
        }
        .pay-btn {
          width: 180px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          color: #fff;
          font-size: 14px;
          background: $color-main;
          display: block;
          margin: 30px auto 0 auto;
        }
        .icon-or {
          display: block;
          background: url(../../assets/images/icons-cashier.png) no-repeat -212px -1417px;
          height: 41px;
          left: 464px;
          position: absolute;
          top: 130px;
          width: 31px;
        }
      }
      .pay-right {
        float: left;
        border-left: 1px solid #f4f4f4;
        p {
          width: 472px;
          text-align: center;
          height: 30px;
          line-height: 30px;
          margin: 25px 0 0 0;
          font-size: 16px;
        }
        .pay-qrcode {
          margin: 20px auto;
          height: 200px;
          width: 200px;
          overflow: hidden;
        }
      }
    }
  }
  .see-order-btn {
    margin-left: 20px;
    color: $color-href;
    &:hover { color: $color-main }
  }
  .cashier-change .time-tip {
    font-size: 16px;
    font-weight: 400;
    span {
      color: $color-main;
    }
  }
</style>
