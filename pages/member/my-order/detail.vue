<template>
  <div id="order-detail">
    <div v-if="order" class="info-detail">
      <div class="info-order">
        <h2>订单信息</h2>
        <div class="info-list">
          <dl><dt>订单编号：</dt><dd>{{ order.sn }}</dd></dl>
          <dl><dt>下单时间：</dt><dd>{{ order.create_time | unixToDate }}</dd></dl>
          <dl><dt>收货地址：</dt><dd>{{ order.ship_province }} {{ order.ship_city }} {{ order.ship_county }} {{ order.ship_town }} {{order.ship_address}} - {{ order.ship_addr }}</dd></dl>
          <dl><dt>收货人：</dt><dd>{{ order.ship_name }}</dd></dl>
          <dl><dt>送货时间:</dt><dd>{{ order.receive_time }}</dd></dl>
          <dl><dt>客户留言：</dt><dd>{{ order.remark || '无' }}</dd></dl>
          <template v-if="order.receipt_history && order.receipt_history.receipt_title">
            <dl class="top_line"><dt>发票抬头:</dt><dd>{{ order.receipt_history.receipt_title }}</dd></dl>
            <dl><dt>发票内容:</dt><dd>{{ order.receipt_history.receipt_content }}</dd></dl>
            <dl><dt>发票类型:</dt><dd>{{ order.receipt_history.receipt_type }}</dd></dl>
            <dl v-if="order.receipt_history.tax_no"><dt>发票税号:</dt><dd>{{ order.receipt_history.tax_no }}</dd></dl>
            <dl><dt>开票金额:</dt><dd>￥{{ order.receipt_history.receipt_amount | unitPrice }}</dd></dl>
          </template>
          <dl v-else><dt>发票信息:</dt><dd>无</dd></dl>
          <dl class="top_line"><dt>付款方式：</dt><dd>{{ order.payment_type === "ONLINE" ? '在线支付' : '货到付款' }}</dd></dl>
          <dl><dt>支付状态：</dt><dd>{{ order.pay_status_text }}</dd></dl>
          <dl><dt>商品总价：</dt><dd>￥{{ (order.goods_price || 0) | unitPrice }}</dd></dl>
          <dl class="bottom_line"><dt>运费：</dt><dd>￥{{ (order.shipping_price || 0) | unitPrice }}</dd></dl>
          <dl v-if="order.coupon_price"><dt>优惠券抵扣:</dt><dd>-￥{{ order.coupon_price | unitPrice }}</dd></dl>
          <dl v-if="order.cash_back"><dt>返现金额:</dt><dd>-￥{{ order.cash_back | unitPrice }}</dd></dl>
          <dl v-if="order.use_point"><dt>积分抵扣:</dt><dd>-{{ order.use_point }}积分</dd></dl>
          <dl><dt>订单总价：</dt><dd style="font-size: 16px; color: #49afcd">￥{{ (order.need_pay_money || 0) | unitPrice }}</dd></dl>
          <dl v-if="order.pay_status=='PAY_YES'"><dt>实付金额：</dt><dd style="font-size: 22px;" class="price">￥{{ (order.need_pay_money || 0) | unitPrice }}</dd></dl>
        </div>
      </div>
      <div class="status-order">
        <h2>订单状态：{{ order.order_status_text }}</h2>
        <ul class="status-list">
          <li v-if="order.order_status === 'CANCELLED'">
            - 订单取消原因：
            <strong>{{ order.cancel_reason }}</strong>
          </li>
          <li v-if="order.order_operate_allowable_vo.allow_pay">
            - 如果您尚未对该订单进行支付，请
            <strong><a :href="'/checkout/cashier?order_sn=' + order.sn">按此为订单付款</a></strong>
            以确保商家及时发货。
          </li>
          <li v-if="order.order_operate_allowable_vo.allow_cancel">
            - 如果您不想购买此订单的商品，您可以
            <strong><a href="javascript:;" @click="handleCancelOrder">取消订单</a></strong>
            操作。
          </li>
          <li v-if="order.order_operate_allowable_vo.allow_service_cancel">
            - 如果您依然不想购买此订单的商品，您可以
            <strong><nuxt-link :to="'../after-sale/apply?order_sn=' + order.sn">申请取消订单</nuxt-link></strong>
            操作
          </li>
          <li v-if="order.order_operate_allowable_vo.allow_rog">
            - 如果您已经收到商品，请
            <strong><a href="javascript:;" @click="handleRogOrder">确认收货</a></strong>
            操作。
          </li>
          <li v-if="order.order_operate_allowable_vo.allow_rog">
            - 当前订单已发货，您可以
            <strong><a href="javascript:;" @click="handleViewExpress">刷新快递</a></strong>
          </li>
        </ul>
        <div v-if="express" class="express-box">
          <div class="express-info">
            <span>快递公司：<em>{{ express.name }}</em></span>
            <span style="margin-left: 20px">快递单号：<em>{{ express.courier_num }}</em></span>
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
                  <i v-if="index === 0" class="ex-text">最新</i>
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
      /** 取消订单 */
      handleCancelOrder() {
        this.$layer.prompt({
          formType: 2,
          title: '请输入取消原因',
          maxlength: 200
        }, (value, index) => {
          const val = value.trim()
          if (!val) {
            this.$message.error('请填写取消原因！')
          }else if (val.length > 200) {
            this.$message.error('最多输入200个字符！')
          } else {
            API_Order.cancelOrder(this.order_sn, val).then(() => {
              this.$message.success('订单取消申请成功！')
              layer.close(index)
              this.GET_OrderDetail()
            })
          }
        })
      },
      /** 确认收货 */
      handleRogOrder() {
        this.$confirm('请确认是否收到货物，否则可能会钱财两空！', () => {
          API_Order.confirmReceipt(this.order_sn).then(() => {
            this.$message.success('确认收货成功！')
            this.GET_OrderDetail()
          })
        })
      },
      /** 查看快递 */
      handleViewExpress() {
        const { logi_id, ship_no } = this.order
        API_Trade.getExpress(logi_id, ship_no).then(response => {
          this.express = response
        })
      },
      /** 获取订单详情 */
      GET_OrderDetail() {
        API_Order.getOrderDetail(this.order_sn).then(response => {
          this.order = response
          if (response.logi_id && response.ship_no) {
            this.handleViewExpress()
          }
          this.skuList = JSON.parse(response.items_json)
        })
        // 订单流程
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
      width: 23%;
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
