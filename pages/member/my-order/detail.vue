<template>
  <div id="order-detail">
    <div v-if="order" class="info-detail">
      <div class="info-order">
        <h2>The order information</h2>
        <div class="info-list">
          <dl><dt>Order no.：</dt><dd>{{ order.sn }}</dd></dl>
          <dl><dt>Create time：</dt><dd>{{ order.create_time | unixToDate }}</dd></dl>
          <dl><dt>Shipping address：</dt><dd>{{ order.ship_province }} {{ order.ship_city }} {{ order.ship_county }} {{ order.ship_town }} {{order.ship_address}} - {{ order.ship_addr }}</dd></dl>
          <dl><dt>The consignee：</dt><dd>{{ order.ship_name }}</dd></dl>
          <dl><dt>Delivery time:</dt><dd>{{ order.receive_time }}</dd></dl>
          <dl><dt>Customer message：</dt><dd>{{ order.remark || 'There is no' }}</dd></dl>
          <template v-if="order.receipt_history && order.receipt_history.receipt_title">
            <dl class="top_line"><dt>The invoice looked up:</dt><dd>{{ order.receipt_history.receipt_title }}</dd></dl>
            <dl><dt>The invoice content:</dt><dd>{{ order.receipt_history.receipt_content }}</dd></dl>
            <dl><dt>Invoice type:</dt><dd>{{ order.receipt_history.receipt_type }}</dd></dl>
            <dl v-if="order.receipt_history.tax_no"><dt>The invoice id number:</dt><dd>{{ order.receipt_history.tax_no }}</dd></dl>
            <dl><dt>c.:</dt><dd>￥{{ order.receipt_history.receipt_amount | unitPrice }}</dd></dl>
          </template>
          <dl v-else><dt>The invoice information:</dt><dd>There is no</dd></dl>
          <dl class="top_line"><dt>Payment method：</dt><dd>{{ order.payment_type === "ONLINE" ? 'Online payment' : 'Cash on delivery' }}</dd></dl>
          <dl><dt>Payment status：</dt><dd>{{ order.pay_status_text }}</dd></dl>
          <dl><dt>Price：</dt><dd>￥{{ (order.goods_price || 0) | unitPrice }}</dd></dl>
          <dl class="bottom_line"><dt>freight：</dt><dd>￥{{ (order.shipping_price || 0) | unitPrice }}</dd></dl>
          <dl v-if="order.coupon_price"><dt>Coupon deduction:</dt><dd>-￥{{ order.coupon_price | unitPrice }}</dd></dl>
          <dl v-if="order.cash_back"><dt>Cashback amount:</dt><dd>-￥{{ order.cash_back | unitPrice }}</dd></dl>
          <dl v-if="order.use_point"><dt>Points deduction:</dt><dd>-{{ order.use_point }}point</dd></dl>
          <dl><dt>Total：</dt><dd style="font-size: 16px; color: #49afcd">￥{{ (order.need_pay_money || 0) | unitPrice }}</dd></dl>
          <dl v-if="order.pay_status=='PAY_YES'"><dt>Amount of real pay：</dt><dd style="font-size: 22px;" class="price">￥{{ (order.need_pay_money || 0) | unitPrice }}</dd></dl>
        </div>
      </div>
      <div class="status-order">
        <h2>Status：{{ order.order_status_text }}</h2>
        <ul class="status-list">
          <li v-if="order.order_status === 'CANCELLED'">
            - Reason for Order Cancellation：
            <strong>{{ order.cancel_reason }}</strong>
          </li>
          <li v-if="order.order_operate_allowable_vo.allow_pay">
            - If you have not paid for this order, please
            <strong><a :href="'/checkout/cashier?order_sn=' + order.sn">Click here to pay for your order</a></strong>
            To ensure timely delivery of goods.
          </li>
          <li v-if="order.order_operate_allowable_vo.allow_cancel">
            - If you do not want to purchase the goods of this order, you may
            <strong><a href="javascript:;" @click="handleCancelOrder">Cancel the order</a></strong>
            Operation.
          </li>
          <li v-if="order.order_operate_allowable_vo.allow_service_cancel">
            - If you still do not want to purchase the goods of this order, you can
            <strong><nuxt-link :to="'../after-sale/apply?order_sn=' + order.sn">Application for Cancellation of order</nuxt-link></strong>
            Operation
          </li>
          <li v-if="order.order_operate_allowable_vo.allow_rog">
            - If you have received the goods, please
            <strong><a href="javascript:;" @click="handleRogOrder">Confirm the goods</a></strong>
            Operation.
          </li>
          <li v-if="order.order_operate_allowable_vo.allow_rog">
            - The current order has been shipped, you can
            <strong><a href="javascript:;" @click="handleViewExpress">Refresh the Courier</a></strong>
          </li>
        </ul>
        <div v-if="express" class="express-box">
          <div class="express-info">
            <span>Courier company：<em>{{ express.name }}</em></span>
            <span style="margin-left: 20px">Courier number：<em>{{ express.courier_num }}</em></span>
          </div>
          <ul class="express-list">
            <li
              v-for="(item, index) in express.data"
              :key="index"
              class="ex-item"
            >
              <div class="inner-ex">
                <div class="ex-circle">
                  <i class="ex-icon iconfont ea-icon-dot"></i>
                  <i v-if="index === 0" class="ex-text">The latest</i>
                </div>
                <div class="ex-info">
                  {{ item.time }}
                  <br>
                  {{ item.context }}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="flow" class="order-flow">
      <el-steps align-center :active="flow_active" finish-status="success">
        <el-step
          v-for="(step, index) in flow"
          :key="index"
          :title="step.text"
        ></el-step>
      </el-steps>
    </div>
    <div v-if="skuList" class="goods-list">
      <sku-list :skuList="skuList" name="name" price="original_price" total="subtotal"></sku-list>
    </div>
    <div v-if="order.gift_list">
      <gift-list :giftList="order.gift_list"/>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Steps, Step } from 'element-ui'
  Vue.use(Steps).use(Step)
  import * as API_Order from '@/api/order'
  import * as API_Trade from '@/api/trade'
  import SkuList from '../-skuList'
  import GiftList from '../-giftList'
  export default {
    name: 'order-detail',
    validate({ query }) {
      return !!query.order_sn
    },
    components: {
      SkuList,
      GiftList
    },
    data() {
      return {
        order_sn: this.$route.query.order_sn,
        order: '',
        skuList: '',
        express: '',
        flow: '',
        flow_active: 0
      }
    },
    mounted() {
      this.GET_OrderDetail()
    },
    methods: {
      /** Cancel the order*/
      handleCancelOrder() {
        this.$layer.prompt({
          formType: 2,
          title: 'Please enter a reason for cancellation',
          maxlength: 200
        }, (value, index) => {
          const val = value.trim()
          if (!val) {
            this.$message.error('Please fill in the reason for cancellation！')
          }else if (val.length > 200) {
            this.$message.error('Most input200A character！')
          } else {
            API_Order.cancelOrder(this.order_sn, val).then(() => {
              this.$message.success('Order cancellation request successful！')
              layer.close(index)
              this.GET_OrderDetail()
            })
          }
        })
      },
      /** Confirm the goods*/
      handleRogOrder() {
        this.$confirm('Please confirm whether you have received the goods or you may lose all your money！', () => {
          API_Order.confirmReceipt(this.order_sn).then(() => {
            this.$message.success('Confirm receipt of goods successfully！')
            this.GET_OrderDetail()
          })
        })
      },
      /** Check the delivery*/
      handleViewExpress() {
        const { logi_id, ship_no } = this.order
        API_Trade.getExpress(logi_id, ship_no).then(response => {
          this.express = response
        })
      },
      /** Obtain order details*/
      GET_OrderDetail() {
        API_Order.getOrderDetail(this.order_sn).then(response => {
          this.order = response
          if (response.logi_id && response.ship_no) {
            this.handleViewExpress()
          }
          this.skuList = JSON.parse(response.items_json)
        })
        // Order process
        API_Trade.getOrderFlow(this.order_sn).then(response => {
          this.flow = response
          const index = response.findIndex(item => item.show_status === 0)
          this.flow_active = index === -1 ? response.length : index
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../../assets/styles/color";
  .info-detail {
    display: flex;
    border: 1px solid #d8d8d8;
    position: relative;
    z-index: 2;
  }
  .info-order {
    background-color: #fbfbfb;
    border-right: 1px solid #d8d8d8;
    width: 398px;
    h2 {
      background-color: #f3f3f3;
      border-bottom: 1px solid #d8d8d8;
      font-size: 12px;
      font-weight: 600;
      height: 20px;
      line-height: 20px;
      padding: 9px;
    }
  }
  .info-list {
    display: block;
    padding: 17px 17px 7px;
    width: auto;
    min-height: 300px;

    dl {
      margin-bottom: 10px;
      display: inline-block;
      font-size: 12px;
      letter-spacing: normal;
      line-height: 20px;
      vertical-align: top;
      word-spacing: normal;
      width: 100%;
      &.top_line {
        border-top: 1px dotted #d8d8d8;
        padding-top: 10px;
      }
      &.bottom_line {
        border-bottom: 1px dotted #d8d8d8;
        padding-bottom: 10px;
      }
    }
    dt {
      color: #888;
      width: 50%;
      float: left;
      display: inline;
    }
    dd {
      color: #666;
      width: 77%;
      float: left;
      display: inline;
    }
  }
  .status-order {
    width: 970px - 400px;
    background-color: #fff;
    font-size: 12px;
    letter-spacing: normal;
    padding: 20px 30px;
    vertical-align: top;
    word-spacing: normal;
    h2 {
      display: block;
      width: 100%;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px dotted #e7e7e7;
      margin-bottom: 20px;
    }
    .status-list {
      li {
        margin-bottom: 10px;
      }
    }
  }
  .goods-list {
    margin-top: 10px;
  }
  .express-box {
    position: relative;
    width: 520px;
    padding: 9px;
    border: 1px solid #e3e3e3;
    border-bottom-color: #e0e0e0;
    border-right-color: #ececec;
    box-shadow: 1px 2px 1px rgba(0,0,0,.072);
    .express-info {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: 0 10px;
      height: 40px;
      line-height: 40px;
      background-color: #fff;
    }
    .express-list {
      height: 350px;
      margin-top: 37px;
      overflow: scroll;
    }
    .ex-item {
      list-style: none;
      border-bottom: solid 1px #f5f5f5;
      width: 500px;
      overflow: hidden;
      &:first-child {
        color: $color-main
      }
    }
    .inner-ex {
      padding: 10px;
      margin-left: 15px;
      float: left;
      border-left: solid 2px #ececec;
    }
    .ex-circle {
      width: 55px;
      float: left;
      display: inline-block;
      position: relative;
      overflow: hidden;
      background-color: #fff;
      left: -18px;
      margin-top: 17px;
    }
    .ex-icon {
      display: inline-block;
      width: 14px;
      height: 14px;
      vertical-align: text-bottom;
      font-style: normal;
      overflow: hidden;
      font-size: 18px;
      text-align: center;
      line-height: 14px;
      margin-left: -2px;
      color: #A2BDE3
    }
    .ex-text {
      display: inline-block;
      padding: 2px 5px;
      margin-left: 5px;
      text-align: center;
      vertical-align: text-bottom;
      font-size: 12px;
      line-height: 100%;
      font-style: normal;
      font-weight: 400;
      color: #fff;
      overflow: hidden;
      background-color: $color-main;
    }
    .ex-info {
      float: left;
      width: 390px;
      margin-left: -10px;
      word-break: normal;
    }
  }
  .order-flow {
    width: 100%;
    padding-top: 10px;
    /deep/ {
      .el-step__head, .el-step__title {
        &.is-success, &.is-finish {
          color: lighten($color-main, 10%);
          border-color: lighten($color-main, 10%);
        }
      }
    }
  }
</style>
