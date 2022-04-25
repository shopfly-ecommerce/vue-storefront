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
              <li
                v-for="payment in paymentList"
                :key="payment.plugin_id"
                :class="['payment-item', payment.selected && 'selected']"
                @click="initiatePay(payment, 'qr')"
              >
                <img :src="payment.image">
              </li>
            </ul>
          </div>
        </div>
        <div v-show="showPayBox" class="cashier-pay-box" :class="payment_plugin_id">
          <div v-if="payment_plugin_id === 'PayPalPlugin'" class="paypal-box">
            <div class="credit-card">
              <div class="card-box">
                <div class="card-item">
                  <label for="credit-card-number" class="card-item-label">Card number</label>
                  <input type="text" id="credit-card-number" class="card-item-input" autocomplete="off">
                  <div class="icon-card"></div>
                </div>
                <div class="card-item card-valid-thru">
                  <label for="credit-card-month" class="card-item-label">Valid thru (mm/yy)</label>
                  <input type="text" id="credit-card-month" class="card-item-input" maxlength="2" autocomplete="off">
                  &nbsp;&nbsp;/&nbsp;&nbsp;
                  <input type="text" id="credit-card-year" class="card-item-input" maxlength="2" autocomplete="off">
                </div>
                <div class="card-item">
                  <label for="credit-card-name" class="card-item-label">Cardholder's name</label>
                  <input type="text" id="credit-card-name" class="card-item-input" autocomplete="off">
                </div>
              </div>
              <div class="card-box cvv2">
                <div class="card-item">
                  <label for="credit-card-cvv" class="card-item-label">CVV/CVC</label>
                  <input type="text" id="credit-card-cvv" class="card-item-input" autocomplete="off">
                  <div class="cvv-tip-box">
                    <span class="cvv-tip">What is CVV/CVC</span>
                    <div class="cvv-tip-dialog">
                      <div class="cvv-tip-info">
                        <div class="cvv-tip-info-image">
                          <img src="https://demos.mv.cs-cart.com/99a10ad1927fad52/design/themes/responsive/media/images/visa_cvv.png" alt="">
                        </div>
                        <div class="cvv-tip-info-description">
                          <h5 class="cvv-tip-info-description-title">Visa, MasterCard, Discover</h5>
                          <p>This number is printed in the signature area on the back of the card. It is the 3 digits AFTER the credit card number.</p>
                        </div>
                      </div>
                      <div class="cvv-tip-info">
                        <div class="cvv-tip-info-image">
                          <img src="https://demos.mv.cs-cart.com/99a10ad1927fad52/design/themes/responsive/media/images/express_cvv.png" alt="">
                        </div>
                        <div class="cvv-tip-info-description">
                          <h5 class="cvv-tip-info-description-title">American Express</h5>
                          <p>CVV is on the front of the card above the credit card number (either on the right or on the left side of the credit card).</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <a class="pay-btn" href="javascript:;">Pay ${{ order.need_pay_price }} </a>
          </div>
          <div v-else class="pay-item">
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
        this.paymentList.push({
          image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjI0NnB4IiBoZWlnaHQ9IjYwcHgiIHZpZXdCb3g9IjAgMCAyNDYgNjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuNiAoMjYzMDQpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPnBwX2ZjX2hsPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+CiAgICAgICAgPHBhdGggaWQ9InBhdGgtMSIgZD0iTTAuMDM2MzYzNjM2NCw2MCBMMjQ1LjI0NDg0OCw2MCBMMjQ1LjI0NDg0OCwwLjQ5NzU3NTc1OCBMMC4wMzYzNjM2MzY0LDAuNDk3NTc1NzU4IEwwLjAzNjM2MzYzNjQsNjAgTDAuMDM2MzYzNjM2NCw2MCBaIj48L3BhdGg+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0icHBfZmNfaGwiPgogICAgICAgICAgICA8ZyBpZD0icHBfaF9yZ2IiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTE5MC40MjE4MTgsMjYuNDMyMTIxMiBDMTg5LjY4NDg0OCwzMS4yNzI3MjczIDE4NS45ODc4NzksMzEuMjcyNzI3MyAxODIuNDEyMTIxLDMxLjI3MjcyNzMgTDE4MC4zNzc1NzYsMzEuMjcyNzI3MyBMMTgxLjgwNDg0OCwyMi4yMzUxNTE1IEMxODEuODkwOTA5LDIxLjY4OTA5MDkgMTgyLjM2MTgxOCwyMS4yODY2NjY3IDE4Mi45MTUxNTIsMjEuMjg2NjY2NyBMMTgzLjg0Nzg3OSwyMS4yODY2NjY3IEMxODYuMjgxMjEyLDIxLjI4NjY2NjcgMTg4LjU4MDYwNiwyMS4yODY2NjY3IDE4OS43NjYwNjEsMjIuNjczMzMzMyBDMTkwLjQ3NTE1MiwyMy41MDMwMzAzIDE5MC42ODk2OTcsMjQuNzMyNzI3MyAxOTAuNDIxODE4LDI2LjQzMjEyMTIgTDE5MC40MjE4MTgsMjYuNDMyMTIxMiBaIE0xODguODY1NDU1LDEzLjgwMzYzNjQgTDE3NS4zOCwxMy44MDM2MzY0IEMxNzQuNDU4MTgyLDEzLjgwMzYzNjQgMTczLjY3MzMzMywxNC40NzQ1NDU1IDE3My41Mjk2OTcsMTUuMzg1NDU0NSBMMTY4LjA3Njk3LDQ5Ljk2MzAzMDMgQzE2Ny45NjkwOTEsNTAuNjQ0ODQ4NSAxNjguNDk2MzY0LDUxLjI2MTgxODIgMTY5LjE4NzI3Myw1MS4yNjE4MTgyIEwxNzYuMTA2MDYxLDUxLjI2MTgxODIgQzE3Ni43NTE1MTUsNTEuMjYxODE4MiAxNzcuMzAxMjEyLDUwLjc5MjEyMTIgMTc3LjQwMTIxMiw1MC4xNTQ1NDU1IEwxNzguOTQ3ODc5LDQwLjM1MjEyMTIgQzE3OS4wOTE1MTUsMzkuNDQxMjEyMSAxNzkuODc2MzY0LDM4Ljc3MDMwMyAxODAuNzk4MTgyLDM4Ljc3MDMwMyBMMTg1LjA2NTQ1NSwzOC43NzAzMDMgQzE5My45NDc4NzksMzguNzcwMzAzIDE5OS4wNzM5MzksMzQuNDcxNTE1MiAyMDAuNDEzOTM5LDI1Ljk1MjEyMTIgQzIwMS4wMTY5NywyMi4yMjYwNjA2IDIwMC40MzgxODIsMTkuMjk4MTgxOCAxOTguNjkzMzMzLDE3LjI0ODQ4NDggQzE5Ni43NzU3NTgsMTQuOTk1MTUxNSAxOTMuMzc2OTcsMTMuODAzNjM2NCAxODguODY1NDU1LDEzLjgwMzYzNjQgTDE4OC44NjU0NTUsMTMuODAzNjM2NCBaIiBpZD0iRmlsbC0xIiBmaWxsPSIjMjc5MEMzIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOTQuMjQxODE4MiwyNi40MzIxMjEyIEM5My41MDQ4NDg1LDMxLjI3MjcyNzMgODkuODA3ODc4OCwzMS4yNzI3MjczIDg2LjIzMjcyNzMsMzEuMjcyNzI3MyBMODQuMTk4MTgxOCwzMS4yNzI3MjczIEw4NS42MjQ4NDg1LDIyLjIzNTE1MTUgQzg1LjcxMTUxNTIsMjEuNjg5MDkwOSA4Ni4xODI0MjQyLDIxLjI4NjY2NjcgODYuNzM1MTUxNSwyMS4yODY2NjY3IEw4Ny42Njc4Nzg4LDIxLjI4NjY2NjcgQzkwLjEwMTgxODIsMjEuMjg2NjY2NyA5Mi40MDEyMTIxLDIxLjI4NjY2NjcgOTMuNTg2MDYwNiwyMi42NzMzMzMzIEM5NC4yOTU3NTc2LDIzLjUwMzAzMDMgOTQuNTEwMzAzLDI0LjczMjcyNzMgOTQuMjQxODE4MiwyNi40MzIxMjEyIEw5NC4yNDE4MTgyLDI2LjQzMjEyMTIgWiBNOTIuNjg2MDYwNiwxMy44MDM2MzY0IEw3OS4yMDA2MDYxLDEzLjgwMzYzNjQgQzc4LjI3ODc4NzksMTMuODAzNjM2NCA3Ny40OTM5Mzk0LDE0LjQ3NDU0NTUgNzcuMzUwMzAzLDE1LjM4NTQ1NDUgTDcxLjg5Njk2OTcsNDkuOTYzMDMwMyBDNzEuNzg5Njk3LDUwLjY0NDg0ODUgNzIuMzE2OTY5Nyw1MS4yNjE4MTgyIDczLjAwNzI3MjcsNTEuMjYxODE4MiBMNzkuNDQ2MDYwNiw1MS4yNjE4MTgyIEM4MC4zNjc4Nzg4LDUxLjI2MTgxODIgODEuMTUzMzMzMyw1MC41OTA5MDkxIDgxLjI5Njk2OTcsNDkuNjgwNjA2MSBMODIuNzY4NDg0OCw0MC4zNTIxMjEyIEM4Mi45MTE1MTUyLDM5LjQ0MTIxMjEgODMuNjk2OTY5NywzOC43NzAzMDMgODQuNjE4Nzg3OSwzOC43NzAzMDMgTDg4Ljg4NjA2MDYsMzguNzcwMzAzIEM5Ny43Njc4Nzg4LDM4Ljc3MDMwMyAxMDIuODk0NTQ1LDM0LjQ3MTUxNTIgMTA0LjIzNDU0NSwyNS45NTIxMjEyIEMxMDQuODM3NTc2LDIyLjIyNjA2MDYgMTA0LjI1ODc4OCwxOS4yOTgxODE4IDEwMi41MTM5MzksMTcuMjQ4NDg0OCBDMTAwLjU5NTc1OCwxNC45OTUxNTE1IDk3LjE5Njk2OTcsMTMuODAzNjM2NCA5Mi42ODYwNjA2LDEzLjgwMzYzNjQgTDkyLjY4NjA2MDYsMTMuODAzNjM2NCBaIiBpZD0iRmlsbC0yIiBmaWxsPSIjMjczNDZBIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTIzLjk5MjEyMSwzOC44NDU0NTQ1IEMxMjMuMzY4NDg1LDQyLjUzNTE1MTUgMTIwLjQzOTM5NCw0NS4wMTIxMjEyIDExNi43MDM2MzYsNDUuMDEyMTIxMiBDMTE0LjgzMDkwOSw0NS4wMTIxMjEyIDExMy4zMzE1MTUsNDQuNDA5Njk3IDExMi4zNjc4NzksNDMuMjY5MDkwOSBDMTExLjQxMjcyNyw0Mi4xMzgxODE4IDExMS4wNTMzMzMsNDAuNTI3MjcyNyAxMTEuMzU1NzU4LDM4LjczMzMzMzMgQzExMS45Mzc1NzYsMzUuMDc2OTY5NyAxMTQuOTEzMzMzLDMyLjUyIDExOC41OTIxMjEsMzIuNTIgQzEyMC40MjYwNjEsMzIuNTIgMTIxLjkxNDU0NSwzMy4xMjg0ODQ4IDEyMi44OTc1NzYsMzQuMjc5MzkzOSBDMTIzLjg4NjY2NywzNS40Mzg3ODc5IDEyNC4yNzUxNTIsMzcuMDYwNjA2MSAxMjMuOTkyMTIxLDM4Ljg0NTQ1NDUgTDEyMy45OTIxMjEsMzguODQ1NDU0NSBaIE0xMzIuOTkwOTA5LDI2LjI3NzU3NTggTDEyNi41MzM5MzksMjYuMjc3NTc1OCBDMTI1Ljk4MDYwNiwyNi4yNzc1NzU4IDEyNS41MDk2OTcsMjYuNjc5MzkzOSAxMjUuNDIzNjM2LDI3LjIyNjY2NjcgTDEyNS4xMzkzOTQsMjkuMDMyMTIxMiBMMTI0LjY4Nzg3OSwyOC4zNzc1NzU4IEMxMjMuMjg5Njk3LDI2LjM0Nzg3ODggMTIwLjE3MzMzMywyNS42Njk2OTcgMTE3LjA2MTIxMiwyNS42Njk2OTcgQzEwOS45MjcyNzMsMjUuNjY5Njk3IDEwMy44MzMzMzMsMzEuMDc1NzU3NiAxMDIuNjQ3MjczLDM4LjY1ODE4MTggQzEwMi4wMjk2OTcsNDIuNDQwNjA2MSAxMDIuOTA2MDYxLDQ2LjA1NTE1MTUgMTA1LjA1MDkwOSw0OC41NzgxODE4IEMxMDcuMDIxMjEyLDUwLjg5NjM2MzYgMTA5LjgzMzMzMyw1MS44NjEyMTIxIDExMy4xODM2MzYsNTEuODYxMjEyMSBDMTE4LjkzMzkzOSw1MS44NjEyMTIxIDEyMi4xMjMwMyw0OC4xNjcyNzI3IDEyMi4xMjMwMyw0OC4xNjcyNzI3IEwxMjEuODM0NTQ1LDQ5Ljk2MTgxODIgQzEyMS43MjY2NjcsNTAuNjQ0MjQyNCAxMjIuMjUzOTM5LDUxLjI2MTgxODIgMTIyLjk0NDg0OCw1MS4yNjE4MTgyIEwxMjguNzYsNTEuMjYxODE4MiBDMTI5LjY4MTgxOCw1MS4yNjE4MTgyIDEzMC40NjY2NjcsNTAuNTkxNTE1MiAxMzAuNjEwMzAzLDQ5LjY4MDYwNjEgTDEzNC4xMDEyMTIsMjcuNTc2MzYzNiBDMTM0LjIwOTA5MSwyNi44OTM5Mzk0IDEzMy42ODE4MTgsMjYuMjc3NTc1OCAxMzIuOTkwOTA5LDI2LjI3NzU3NTggTDEzMi45OTA5MDksMjYuMjc3NTc1OCBaIiBpZD0iRmlsbC0zIiBmaWxsPSIjMjczNDZBIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjIwLjE3MTUxNSwzOC44NDU0NTQ1IEMyMTkuNTQ3ODc5LDQyLjUzNTE1MTUgMjE2LjYxOTM5NCw0NS4wMTIxMjEyIDIxMi44ODM2MzYsNDUuMDEyMTIxMiBDMjExLjAxMDMwMyw0NS4wMTIxMjEyIDIwOS41MTE1MTUsNDQuNDA5Njk3IDIwOC41NDcyNzMsNDMuMjY5MDkwOSBDMjA3LjU5MjEyMSw0Mi4xMzgxODE4IDIwNy4yMzI3MjcsNDAuNTI3MjcyNyAyMDcuNTM1NzU4LDM4LjczMzMzMzMgQzIwOC4xMTY5NywzNS4wNzY5Njk3IDIxMS4wOTI3MjcsMzIuNTIgMjE0Ljc3MjEyMSwzMi41MiBDMjE2LjYwNTQ1NSwzMi41MiAyMTguMDk0NTQ1LDMzLjEyODQ4NDggMjE5LjA3Njk3LDM0LjI3OTM5MzkgQzIyMC4wNjYwNjEsMzUuNDM4Nzg3OSAyMjAuNDU0NTQ1LDM3LjA2MDYwNjEgMjIwLjE3MTUxNSwzOC44NDU0NTQ1IEwyMjAuMTcxNTE1LDM4Ljg0NTQ1NDUgWiBNMjI5LjE3MDMwMywyNi4yNzc1NzU4IEwyMjIuNzEzMzMzLDI2LjI3NzU3NTggQzIyMi4xNiwyNi4yNzc1NzU4IDIyMS42ODkwOTEsMjYuNjc5MzkzOSAyMjEuNjAzMDMsMjcuMjI2NjY2NyBMMjIxLjMxODc4OCwyOS4wMzIxMjEyIEwyMjAuODY3ODc5LDI4LjM3NzU3NTggQzIxOS40NjkwOTEsMjYuMzQ3ODc4OCAyMTYuMzUyNzI3LDI1LjY2OTY5NyAyMTMuMjQwNjA2LDI1LjY2OTY5NyBDMjA2LjEwNzI3MywyNS42Njk2OTcgMjAwLjAxMjcyNywzMS4wNzU3NTc2IDE5OC44MjY2NjcsMzguNjU4MTgxOCBDMTk4LjIwOTY5Nyw0Mi40NDA2MDYxIDE5OS4wODYwNjEsNDYuMDU1MTUxNSAyMDEuMjMwMzAzLDQ4LjU3ODE4MTggQzIwMy4yMDEyMTIsNTAuODk2MzYzNiAyMDYuMDEyNzI3LDUxLjg2MTIxMjEgMjA5LjM2MzAzLDUxLjg2MTIxMjEgQzIxNS4xMTMzMzMsNTEuODYxMjEyMSAyMTguMzAyNDI0LDQ4LjE2NzI3MjcgMjE4LjMwMjQyNCw0OC4xNjcyNzI3IEwyMTguMDE0NTQ1LDQ5Ljk2MTgxODIgQzIxNy45MDYwNjEsNTAuNjQ0MjQyNCAyMTguNDMzMzMzLDUxLjI2MTgxODIgMjE5LjEyNDg0OCw1MS4yNjE4MTgyIEwyMjQuOTM5Mzk0LDUxLjI2MTgxODIgQzIyNS44NjEyMTIsNTEuMjYxODE4MiAyMjYuNjQ2MDYxLDUwLjU5MTUxNTIgMjI2Ljc5MDMwMyw0OS42ODA2MDYxIEwyMzAuMjgwNjA2LDI3LjU3NjM2MzYgQzIzMC4zODg0ODUsMjYuODkzOTM5NCAyMjkuODYxMjEyLDI2LjI3NzU3NTggMjI5LjE3MDMwMywyNi4yNzc1NzU4IEwyMjkuMTcwMzAzLDI2LjI3NzU3NTggWiIgaWQ9IkZpbGwtNCIgZmlsbD0iIzI3OTBDMyI+PC9wYXRoPgogICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTEwIj4KICAgICAgICAgICAgICAgICAgICA8bWFzayBpZD0ibWFzay0yIiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgPC9tYXNrPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJDbGlwLTYiPjwvZz4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTY3LjM4MTgxOCwyNi4yNzc1NzU4IEwxNjAuODkxNTE1LDI2LjI3NzU3NTggQzE2MC4yNzA5MDksMjYuMjc3NTc1OCAxNTkuNjkwMzAzLDI2LjU4NTQ1NDUgMTU5LjM0MTgxOCwyNy4wOTg3ODc5IEwxNTAuMzg5MDkxLDQwLjI4NDg0ODUgTDE0Ni41OTQ1NDUsMjcuNjEzOTM5NCBDMTQ2LjM1NzU3NiwyNi44MjEyMTIxIDE0NS42Mjc4NzksMjYuMjc3NTc1OCAxNDQuOCwyNi4yNzc1NzU4IEwxMzguNDIsMjYuMjc3NTc1OCBDMTM3LjY0OTY5NywyNi4yNzc1NzU4IDEzNy4xMDcyNzMsMjcuMDM1MTUxNSAxMzcuMzU1NzU4LDI3Ljc2NDI0MjQgTDE0NC41MDI0MjQsNDguNzQxMjEyMSBMMTM3Ljc4MDYwNiw1OC4yMjYwNjA2IEMxMzcuMjUyNzI3LDU4Ljk3MDMwMyAxMzcuNzg1NDU1LDYwIDEzOC42OTc1NzYsNjAgTDE0NS4xODE4MTgsNjAgQzE0NS43OTYzNjQsNjAgMTQ2LjM3MTUxNSw1OS42OTg3ODc5IDE0Ni43MjE4MTgsNTkuMTkzMzMzMyBMMTY4LjMwNjA2MSwyOC4wNDI0MjQyIEMxNjguODIyNDI0LDI3LjI5Njk2OTcgMTY4LjI4OTA5MSwyNi4yNzc1NzU4IDE2Ny4zODE4MTgsMjYuMjc3NTc1OCIgaWQ9IkZpbGwtNSIgZmlsbD0iIzI3MzQ2QSIgbWFzaz0idXJsKCNtYXNrLTIpIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTIzNi43ODEyMTIsMTQuNzUzMzMzMyBMMjMxLjI0NjY2Nyw0OS45NjMwMzAzIEMyMzEuMTM5Mzk0LDUwLjY0NTQ1NDUgMjMxLjY2NjY2Nyw1MS4yNjE4MTgyIDIzMi4zNTY5Nyw1MS4yNjE4MTgyIEwyMzcuOTIzNjM2LDUxLjI2MTgxODIgQzIzOC44NDU0NTUsNTEuMjYxODE4MiAyMzkuNjMwMzAzLDUwLjU5MDkwOTEgMjM5Ljc3MzkzOSw0OS42ODA2MDYxIEwyNDUuMjMwOTA5LDE1LjEwMzAzMDMgQzI0NS4zMzg3ODgsMTQuNDIwNjA2MSAyNDQuODExNTE1LDEzLjgwMzYzNjQgMjQ0LjEyMDYwNiwxMy44MDM2MzY0IEwyMzcuODkxNTE1LDEzLjgwMzYzNjQgQzIzNy4zMzgxODIsMTMuODAzNjM2NCAyMzYuODY3MjczLDE0LjIwNjY2NjcgMjM2Ljc4MTIxMiwxNC43NTMzMzMzIiBpZD0iRmlsbC03IiBmaWxsPSIjMjc5MEMzIiBtYXNrPSJ1cmwoI21hc2stMikiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjUuNTQ2NjY2Nyw1Ny41NDg0ODQ4IEwyNy4zNTkzOTM5LDQ2LjA1MzkzOTQgTDI3LjQ3NjM2MzYsNDUuNDE2OTY5NyBDMjcuNTYzNjM2NCw0NC44NjMwMzAzIDI3Ljg0NzI3MjcsNDQuMzU2MzYzNiAyOC4yNzQ1NDU1LDQzLjk5MTUxNTIgQzI4LjcwMTgxODIsNDMuNjI2NjY2NyAyOS4yNDY2NjY3LDQzLjQyNTQ1NDUgMjkuODA4NDg0OCw0My40MjU0NTQ1IEwzMS4yNDc4Nzg4LDQzLjQyNTQ1NDUgQzMzLjY0NzI3MjcsNDMuNDI1NDU0NSAzNS44NTE1MTUyLDQzLjE2OTA5MDkgMzcuOCw0Mi42NjM2MzY0IEMzOS44Nzg3ODc5LDQyLjEyNDg0ODUgNDEuNzI3ODc4OCw0MS4yODU0NTQ1IDQzLjI5NTE1MTUsNDAuMTcwOTA5MSBDNDQuOTU2OTY5NywzOC45ODkwOTA5IDQ2LjM1MjcyNzMsMzcuNDYxMjEyMSA0Ny40NDQyNDI0LDM1LjYzMDkwOTEgQzQ4LjU5NTc1NzYsMzMuNyA0OS40NDEyMTIxLDMxLjM3NTE1MTUgNDkuOTU3NTc1OCwyOC43MjE4MTgyIEM1MC40MTM5Mzk0LDI2LjM3ODc4NzkgNTAuNDk5MzkzOSwyNC4yODEyMTIxIDUwLjIxMjcyNzMsMjIuNDg2NjY2NyBDNDkuOTA5MDkwOSwyMC41OTA5MDkxIDQ5LjE3ODc4NzksMTguOTczMzMzMyA0OC4wNDI0MjQyLDE3LjY3NzU3NTggQzQ3LjM1MzMzMzMsMTYuODkyNzI3MyA0Ni40NzE1MTUyLDE2LjIxMjcyNzMgNDUuNDIxODE4MiwxNS42NTYzNjM2IEw0NS4zOTY5Njk3LDE1LjY0MzAzMDMgTDQ1LjM5NjM2MzYsMTUuNjEyNzI3MyBDNDUuNzYzMDMwMywxMy4yNzM5Mzk0IDQ1Ljc0OTA5MDksMTEuMzIzMDMwMyA0NS4zNTQ1NDU1LDkuNjQzNjM2MzYgQzQ0Ljk1ODE4MTgsNy45NjA2MDYwNiA0NC4xNTU3NTc2LDYuNDQ2MDYwNjEgNDIuODk5MzkzOSw1LjAxNDU0NTQ1IEM0MC4yOTYzNjM2LDIuMDQ4NDg0ODUgMzUuNTYxODE4MiwwLjU0NDI0MjQyNCAyOC44Mjc4Nzg4LDAuNTQ0MjQyNDI0IEwxMC4zMzM5Mzk0LDAuNTQ0MjQyNDI0IEM5LjcxNTc1NzU4LDAuNTQ0MjQyNDI0IDkuMTE1NzU3NTgsMC43NjU0NTQ1NDUgOC42NDU0NTQ1NSwxLjE2NzI3MjczIEM4LjE3NTE1MTUyLDEuNTY5MDkwOTEgNy44NjM2MzYzNiwyLjEyNzI3MjczIDcuNzY2NjY2NjcsMi43MzgxODE4MiBMMC4wNjYwNjA2MDYxLDUxLjU3MDMwMyBDLTAuMDA0MjQyNDI0MjQsNTIuMDE1NzU3NiAwLjEyMzYzNjM2NCw1Mi40Njg0ODQ4IDAuNDE2OTY5Njk3LDUyLjgxMDMwMyBDMC43MTAzMDMwMyw1My4xNTM5Mzk0IDEuMTM2OTY5Nyw1My4zNTA5MDkxIDEuNTg3ODc4NzksNTMuMzUwOTA5MSBMMTMuMDYxMjEyMSw1My4zNTA5MDkxIEwxMy4wNTA5MDkxLDUzLjQwNTQ1NDUgTDEyLjI2MzAzMDMsNTguNDAxODE4MiBDMTIuMjAyNDI0Miw1OC43OTAzMDMgMTIuMzEzOTM5NCw1OS4xODQyNDI0IDEyLjU2OTA5MDksNTkuNDgyNDI0MiBDMTIuODI0MjQyNCw1OS43ODEyMTIxIDEzLjE5NTc1NzYsNTkuOTUzMzMzMyAxMy41ODg0ODQ4LDU5Ljk1MzMzMzMgTDIzLjIxMTUxNTIsNTkuOTUzMzMzMyBDMjMuNzUxNTE1Miw1OS45NTMzMzMzIDI0LjI3NDU0NTUsNTkuNzYgMjQuNjg0ODQ4NSw1OS40MDkwOTA5IEMyNS4wOTUxNTE1LDU5LjA1ODE4MTggMjUuMzY3ODc4OCw1OC41NzE1MTUyIDI1LjQ1MjEyMTIsNTguMDM4Nzg3OSBMMjUuNTQ2NjY2Nyw1Ny41NDg0ODQ4IiBpZD0iRmlsbC04IiBmaWxsPSIjMjczNDZBIiBtYXNrPSJ1cmwoI21hc2stMikiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTguOTUzOTM5NCwxNS42NzYzNjM2IEMxOS4wNzU3NTc2LDE0LjkwMjQyNDIgMTkuNTcyMTIxMiwxNC4yNjkwOTA5IDIwLjI0MDYwNjEsMTMuOTQ4NDg0OCBDMjAuNTQ0ODQ4NSwxMy44MDMwMzAzIDIwLjg4NDI0MjQsMTMuNzIxODE4MiAyMS4yNCwxMy43MjE4MTgyIEwzNS43MzYzNjM2LDEzLjcyMTgxODIgQzM3LjQ1MzkzOTQsMTMuNzIxODE4MiAzOS4wNTUxNTE1LDEzLjgzNDU0NTUgNDAuNTE5MzkzOSwxNC4wNzAzMDMgQzQwLjkzNzU3NTgsMTQuMTM3NTc1OCA0MS4zNDQyNDI0LDE0LjIxNTE1MTUgNDEuNzQsMTQuMzAzMDMwMyBDNDIuMTM1NzU3NiwxNC4zOTA5MDkxIDQyLjUxOTM5MzksMTQuNDg4NDg0OCA0Mi44OTA5MDkxLDE0LjU5NzU3NTggQzQzLjA3Njk2OTcsMTQuNjUxNTE1MiA0My4yNTkzOTM5LDE0LjcwODQ4NDggNDMuNDM5MzkzOSwxNC43Njg0ODQ4IEM0NC4xNTgxODE4LDE1LjAwNzI3MjcgNDQuODI3MjcyNywxNS4yODg0ODQ4IDQ1LjQ0MzAzMDMsMTUuNjE0NTQ1NSBDNDYuMTY5MDkwOSwxMC45ODYwNjA2IDQ1LjQzODE4MTgsNy44MzYzNjM2NCA0Mi45MzQ1NDU1LDQuOTgzNjM2MzYgQzQwLjE3ODE4MTgsMS44NDMwMzAzIDM1LjE5ODc4NzksMC40OTc1NzU3NTggMjguODI3ODc4OCwwLjQ5NzU3NTc1OCBMMTAuMzMzOTM5NCwwLjQ5NzU3NTc1OCBDOS4wMzIxMjEyMSwwLjQ5NzU3NTc1OCA3LjkyMzYzNjM2LDEuNDQ0ODQ4NDggNy43MjA2MDYwNiwyLjczMDkwOTA5IEwwLjAyLDUxLjU2MzAzMDMgQy0wLjEzMjEyMTIxMiw1Mi41MjY2NjY3IDAuNjEyNzI3MjczLDUzLjM5NzU3NTggMS41ODc4Nzg3OSw1My4zOTc1NzU4IEwxMy4wMDQ4NDg1LDUzLjM5NzU3NTggTDE4Ljk1MzkzOTQsMTUuNjc2MzYzNiIgaWQ9IkZpbGwtOSIgZmlsbD0iIzI3MzQ2QSIgbWFzaz0idXJsKCNtYXNrLTIpIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNDUuNDQzMDMwMywxNS42MTQ1NDU1IEw0NS40NDMwMzAzLDE1LjYxNDU0NTUgQzQ1LjM4Nzg3ODgsMTUuOTY3ODc4OCA0NS4zMjY2NjY3LDE2LjMyNzI3MjcgNDUuMjUzOTM5NCwxNi42OTc1NzU4IEM0Mi44MTU3NTc2LDI5LjIxOTM5MzkgMzQuNDcxNTE1MiwzMy41NDg0ODQ4IDIzLjgxNDU0NTUsMzMuNTQ4NDg0OCBMMTguMzg3ODc4OCwzMy41NDg0ODQ4IEMxNy4wODYwNjA2LDMzLjU0ODQ4NDggMTUuOTg2NjY2NywzNC40OTYzNjM2IDE1Ljc4MzYzNjQsMzUuNzgyNDI0MiBMMTIuMjE2OTY5Nyw1OC4zOTUxNTE1IEMxMi4wODQyNDI0LDU5LjIzNzU3NTggMTIuNzM1NzU3Niw2MCAxMy41ODg0ODQ4LDYwIEwyMy4yMTIxMjEyLDYwIEMyNC4zNTA5MDkxLDYwIDI1LjMyMDYwNjEsNTkuMTcxNTE1MiAyNS40OTgxODE4LDU4LjA0NjA2MDYgTDI1LjU5MjcyNzMsNTcuNTU2OTY5NyBMMjcuNDA1NDU0NSw0Ni4wNjEyMTIxIEwyNy41MjI0MjQyLDQ1LjQyNjA2MDYgQzI3LjcsNDQuMzAwNjA2MSAyOC42Njk2OTcsNDMuNDcyMTIxMiAyOS44MDg0ODQ4LDQzLjQ3MjEyMTIgTDMxLjI0Nzg3ODgsNDMuNDcyMTIxMiBDNDAuNTcwOTA5MSw0My40NzIxMjEyIDQ3Ljg3MDkwOTEsMzkuNjg0MjQyNCA1MC4wMDQyNDI0LDI4LjczMDMwMyBDNTAuODk1MTUxNSwyNC4xNTMzMzMzIDUwLjQzNDU0NTUsMjAuMzMyNzI3MyA0OC4wNzc1NzU4LDE3LjY0NjY2NjcgQzQ3LjM2NDg0ODUsMTYuODM0NTQ1NSA0Ni40Nzc1NzU4LDE2LjE2MjQyNDIgNDUuNDQzMDMwMywxNS42MTQ1NDU1IiBpZD0iRmlsbC0xMSIgZmlsbD0iIzI3OTBDMyI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTQyLjg5MDkwOTEsMTQuNTk3NTc1OCBDNDIuNTE5MzkzOSwxNC40ODg0ODQ4IDQyLjEzNTc1NzYsMTQuMzkwOTA5MSA0MS43NCwxNC4zMDMwMzAzIEM0MS4zNDQyNDI0LDE0LjIxNTE1MTUgNDAuOTM3NTc1OCwxNC4xMzc1NzU4IDQwLjUxOTM5MzksMTQuMDcwMzAzIEMzOS4wNTUxNTE1LDEzLjgzNDU0NTUgMzcuNDUzOTM5NCwxMy43MjE4MTgyIDM1LjczNjM2MzYsMTMuNzIxODE4MiBMMjEuMjQsMTMuNzIxODE4MiBDMjAuODg0MjQyNCwxMy43MjE4MTgyIDIwLjU0NDg0ODUsMTMuODAzMDMwMyAyMC4yNDA2MDYxLDEzLjk0ODQ4NDggQzE5LjU3MjEyMTIsMTQuMjY5MDkwOSAxOS4wNzU3NTc2LDE0LjkwMjQyNDIgMTguOTUzOTM5NCwxNS42NzYzNjM2IEwxNS44NzI3MjczLDM1LjIxMjEyMTIgTDE1Ljc4MzYzNjQsMzUuNzgyNDI0MiBDMTUuOTg2NjY2NywzNC40OTYzNjM2IDE3LjA4NjA2MDYsMzMuNTQ4NDg0OCAxOC4zODc4Nzg4LDMzLjU0ODQ4NDggTDIzLjgxNDU0NTUsMzMuNTQ4NDg0OCBDMzQuNDcxNTE1MiwzMy41NDg0ODQ4IDQyLjgxNTc1NzYsMjkuMjE5MzkzOSA0NS4yNTM5Mzk0LDE2LjY5NzU3NTggQzQ1LjMyNjY2NjcsMTYuMzI3MjcyNyA0NS4zODc4Nzg4LDE1Ljk2Nzg3ODggNDUuNDQzMDMwMywxNS42MTQ1NDU1IEM0NC44MjcyNzI3LDE1LjI4ODQ4NDggNDQuMTU4MTgxOCwxNS4wMDcyNzI3IDQzLjQzOTM5MzksMTQuNzY4NDg0OCBDNDMuMjU5MzkzOSwxNC43MDg0ODQ4IDQzLjA3Njk2OTcsMTQuNjUxNTE1MiA0Mi44OTA5MDkxLDE0LjU5NzU3NTgiIGlkPSJGaWxsLTEyIiBmaWxsPSIjMUYyNjRGIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==',
          is_retrace: 0,
          method_name: 'PayPal',
          plugin_id: 'PayPalPlugin',
        })
      })
    },
    methods: {
      /** Initiate payment*/
      initiatePay(payment, pay_mode) {
        this.showPayBox = true
        if (payment) {
          this.paymentList.forEach(item => {
            item.selected = item.plugin_id === payment.plugin_id
          })
        } else {
          payment = this.paymentList.filter(item => item.selected)[0]
        }
        this.payment_plugin_id = payment.plugin_id
        if (payment.plugin_id === 'PayPalPlugin') return this.payWithPayPal(payment)
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
      },
      payWithPayPal(payment) {
        console.log('payment: ', payment)
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
  .cashier-pay-box.PayPalPlugin {
    background-color: #ffffff;
    padding: 20px;
    box-sizing: border-box;
  }
  .paypal-box {
    .credit-card {
      display: flex;
    }
    .card-box {
      display: inline-block;
      box-sizing: border-box;
      padding: 15px 22px;
      width: 363px;
      border: 1px solid #f6f6f6;
      border-radius: 5px;
      background: #f6f6f6;
    }
    .card-item {
      position: relative;
      margin: 0 0 12px 0;
      vertical-align: middle;
      .card-item-label {
        position: relative;
        color: #737373;
        display: block;
        padding: 6px 0;
        font-weight: bold;
        &:after {
          padding-left: 3px;
          color: #ea7162;
          content: "*";
          font-size: 13px;
          line-height: 1px;
        }
      }
      .card-item-input {
        padding: 8px 60px 8px 8px;
        width: 100%;
        background-color: #fff;
        min-height: 36px;
        height: 36px;
        outline: none;
        border: 1px solid #c8c8c8;
        font-size: 14px;
        color: #000000;
        box-sizing: border-box;
        border-radius: 4px;
        transition: all ease .2s;
        &:focus,
        &:hover {
          border-color: #10b9e4;
          box-shadow: 0 0 0 2px rgba(16,185,228,0.1);
        }
      }
      .icon-card {
        position: absolute;
        right: 5px;
        bottom: -10px;
        z-index: 10;
        display: inline-block;
        border-radius: 4px;
        margin: 0;
        width: 51px;
        height: 32px;
        background: url(../../assets/images/payments.png) no-repeat -300px 0px;
      }
      &.card-valid-thru {
        .card-item-input {
          width: 50px;
          padding-left: 8px;
          padding-right: 8px;
        }
      }
    }
    .card-box.cvv2 {
      background-color: #ffffff;
      .card-item-input {
        width: 65px;
        padding-left: 8px;
        padding-right: 8px;
      }
      .cvv-tip-box {
        position: relative;
        display: inline-block;
        .cvv-tip {
          cursor: pointer;
          color: #10b9e4;
          font-size: 13px;
        }
        .cvv-tip-dialog {
          display: none;
          position: absolute;
          bottom: 0;
          left: 100%;
          z-index: 100;
          padding: 15px 5px;
          width: 340px;
          border: 1px solid #fff;
          background-color: #fff;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          .cvv-tip-info {
            display: flex;
            color: #000;
            font-weight: 400;
            .cvv-tip-info-image {
              padding: 0 15px;
            }
            .cvv-tip-info-description {
              width: 240px;
              font-size: 13px;
              h5, p {
                margin: 0;
              }
              p {
                padding: 6px 0;
              }
            }
          }
        }
        &:hover .cvv-tip-dialog {
          display: block;
        }
      }
    }
  }
</style>
