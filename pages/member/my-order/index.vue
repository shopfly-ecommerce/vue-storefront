<template>
  <div id="my-order">
    <div class="member-nav">
      <ul class="member-nav-list">
        <li v-for="item in navList" :key="item.status">
          <nuxt-link v-if="!item.status" to="./my-order">{{ item.title }}</nuxt-link>
          <nuxt-link v-else :to="'./my-order?order_status=' + item.status">{{ item.title }}</nuxt-link>
        </li>
      </ul>
    </div>
    <div class="order-search">
      <input type="text" v-model="params.goods_name" placeholder="Enter keywords" @keyup.enter="Search_GET_OrderList">
      <button type="button" @click="Search_GET_OrderList">search</button>
      <span v-if="orderData">search：<em>{{ orderData.data_total }}</em> orders</span>
      <span v-else>In the search...</span>
    </div>
    <empty-member v-if="orderData && !orderData.data.length">No orders</empty-member>
    <template v-else>
      <div class="order-table">
        <div class="order-table-thead">
          <span style="width: 420px">Name</span>
          <span style="width: 80px">Price</span>
          <span style="width: 80px">Quantity</span>
          <span style="width: 60px"></span>
          <span style="width: 150px">Amount</span>
          <span style="width: 100px">Status</span>
          <span style="width: 110px">&nbsp;</span>
        </div>
        <ul class="order-table-tbody">
          <template v-for="order in orderData.data">
            <li v-if="orderData" :key="order.order_sn">
              <div class="order-tbody-title">
                <span class="pay-type">{{ order.payment_type === 'ONLINE' ? 'The online payment' : 'Cash on delivery' }}：</span>
                <span class="price"><em>￥</em>{{ order.order_amount | unitPrice }}</span>
              </div>
              <div class="order-tbody-ordersn">
                <span>order no.：{{ order.sn }}</span>
                <span>create time：{{ order.create_time | unixToDate }}</span>
              </div>
              <div class="order-tbody-item">
                <div class="order-item-sku">
                  <div class="sku-item" v-for="sku in order.sku_list" :key="sku.sku_id">
                    <div class="goods-image">
                      <a :href="'/goods/' + sku.goods_id" target="_blank">
                        <img :src="sku.goods_image" :alt="sku.name">
                      </a>
                    </div>
                    <div class="goods-name-box">
                      <a :href="'/goods/' + sku.goods_id" class="goods-name" target="_blank">
                        <span v-if="order.order_type === 'pintuan'" class="assemble-color">Many people spell group</span>
                        {{ sku.name }}
                      </a>
                      <p v-if="sku.spec_list" class="sku-spec">{{ sku | formatterSkuSpec }}</p>
                    </div>
                    <div class="sku-price">{{ sku.original_price | unitPrice('￥') }}</div>
                    <div class="sku-num">x {{ sku.num }}</div>
                    <div class="after-sale-btn">
                      <nuxt-link v-if="sku.goods_operate_allowable_vo.allow_apply_service" :to="'/member/after-sale/apply?order_sn=' + order.sn + '&sku_id=' + sku.sku_id">Apply for after sales</nuxt-link>
                      <nuxt-link v-if="sku.snapshot_id" :to="{path:'/goods/snapshot?id=' + sku.snapshot_id + '&sku_id=' + sku.sku_id,query:{orderData:order.order_amount}}">snapshot</nuxt-link>
                    </div>
                  </div>
                </div>
                <div class="order-item-price">
                  <strong>{{ order.order_amount | unitPrice('￥') }}</strong>
                  <p>freight（{{ order.shipping_amount | unitPrice('￥') }}）</p>
                  <p>{{ order.payment_text }}</p>
                </div>
                <div class="order-item-status">
                <span
                  :class="[
                  order.pay_status === 'PAY_NO' &&
                  order.payment_type === 'ONLINE' &&
                  order.order_status === 'CONFIRM' &&
                  'wait-pay'
                  ]"
                >{{ order.order_status_text }}</span>
                  <div
                    class="time-down"
                    v-if="order.cancel_left_time"
                  >
                    <i class="iconfont ea-icon-time"></i>{{ getPayTimeDown(order) }}
                  </div>
                </div>
                <div class="order-item-operate">
                  <a v-if="order.order_operate_allowable_vo.allow_cancel" href="javascript:;" @click="handleCancelOrder(order.sn)">Cancel</a>
                  <nuxt-link v-if="order.order_operate_allowable_vo.allow_service_cancel" :to="'./after-sale/apply?order_sn=' + order.sn">Cancel</nuxt-link>
                  <a v-if="order.order_operate_allowable_vo.allow_rog" href="javascript:;" @click="handleRogOrder(order.sn)">Confirm delivery</a>
                  <nuxt-link v-if="order.order_operate_allowable_vo.allow_pay" :to="'/checkout/cashier?order_sn=' + order.sn">Payment</nuxt-link>
                  <nuxt-link v-if="order.order_operate_allowable_vo.allow_comment" :to="'/member/comments?order_sn=' + order.sn">Comment</nuxt-link>
                  <nuxt-link v-if="order.order_operate_allowable_vo.allow_apply_service" :to="'/member/after-sale/apply?order_sn=' + order.sn">Return</nuxt-link>
                  <nuxt-link :to="'./my-order/detail?order_sn=' + order.sn">Detail</nuxt-link>
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
      <div class="member-pagination">
        <el-pagination
          @current-change="handleCurrentPageChange"
          :current-page.sync="params.page_no"
          :page-size="params.page_size"
          layout="total, prev, pager, next"
          :total="orderData.data_total">
        </el-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  import * as API_Order from '@/api/order'
  export default {
    name: 'my-order-index',
    mounted() {
      if (!this.orderData) this.GET_OrderList()
    },
    data() {
      return {
        params: {
          page_no: 1,
          page_size: 5,
          order_status: this.$route.query.order_status,
          goods_name: ''
        },
        orderData: '',
        navList: [
          { title: 'All orders', status: '' },
          { title: 'Not Yet Payment', status: 'WAIT_PAY' },
          { title: 'Not Yet Shipped', status: 'WAIT_SHIP' },
          // { title: 'For the goods', status: 'WAIT_ROG' },
          { title: 'Cancelled', status: 'CANCELLED' },
          { title: 'Completed', status: 'COMPLETE' },
          { title: 'To evaluate', status: 'WAIT_COMMENT' }
        ]
      }
    },
    watch: {
      $route: function ({ query }) {
        this.params.page_no = 1
        this.params.order_status = query.order_status
        this.GET_OrderList()
      }
    },
    methods: {
      /** The current page number changed*/
      handleCurrentPageChange(cur) {
        this.params.page_no = cur
        this.GET_OrderList()
      },
      /** Cancel the order*/
      handleCancelOrder(order_sn) {
        this.$layer.prompt({
          formType: 2,
          value: ' ',
          title: 'Please enter a reason for cancellation',
          maxlength: 200
        }, (value, index) => {
          const val = value.trim()
          if (!val) {
            this.$message.error('Please fill in the reason for cancellation！')
          } else if (val.length > 200) {
            this.$message.error('Most input200A character！')
          } else {
            API_Order.cancelOrder(order_sn, val).then(() => {
              this.$message.success('Order cancellation request successful！')
              layer.close(index)
              this.GET_OrderList()
            })
          }
        })
      },
      /** Confirm the goods*/
      handleRogOrder(order_sn) {
        this.$confirm('Please confirm whether you have received the goods or you may lose all your money！', () => {
          API_Order.confirmReceipt(order_sn).then(() => {
            this.$message.success('Confirm receipt of goods successfully！')
            this.GET_OrderList()
          })
        })
      },
      /** Get payment countdown*/
      getPayTimeDown(order) {
        const { cancel_left_time: rema } = order
        if (rema <= 3600) {
          return `0:${parseInt(rema / 60)}`
        } else {
          const h = parseInt(rema / 3600)
          const m = parseInt((rema - h * 3600) / 60)
          return `${h}:${m}`
        }
      },
      /** Search for data*/
      Search_GET_OrderList(){
        this.params.page_no = 1
        this.GET_OrderList()
      },
      /** Get order data*/
      GET_OrderList() {
        API_Order.getOrderList(this.params).then(response => {
          this.orderData = response
          this.MixinScrollToTop()
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../../assets/styles/color";
  .order-search {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: 44px;
    border-bottom: 1px solid #e7e7e7;
    em {
      color: $color-main;
    }
    input {
      border: 1px solid #ccc;
      padding: 5px 15px;
      height: 15px;
      width: 150px;
      color: #333;
      border-radius: 3px;
      transition: border .2s ease-out;
      &:focus {
        border-color: darken($color-main, 75%);
      }
    }
    button {
      width: 80px;
      background-color: #e7e7e7;
      color: #333;
      cursor: pointer;
      line-height: 27px;
      margin-left: 10px;
      margin-right: 10px;
      transition: background-color .2s ease-out;
      border-radius: 3px;
      &:hover {
        background-color: #d3d3d3;
      }
    }
  }
  .order-table {
    .order-table-thead {
      display: flex;
      align-items: center;
      height: 20px;
      padding: 8px 0;
      text-align: center;
      color: #999;
    }
    .order-table-tbody {
      li {
        margin-bottom: 20px;
      }
    }
    .order-tbody-title {
      background-color: #faece0;
      border: 1px solid #f9dbcc;
      padding: 9px 0;
      text-align: left;
      .pay-type {
        color: #53514f;
        font-weight: 600;
        margin-left: 20px;
      }
      .price {
        color: $color-main;
        font-size: 14px;
        font-weight: 600;
        em {
          font-size: 12px;
          font-weight: normal;
        }
      }
    }
    .order-tbody-ordersn {
      background-color: #fff;
      border: 1px solid #f9dbcc;
      padding: 5px 0;
      color: #999;
      height: 20px;
      font-size: 12px;
      font-weight: 400;
      span { margin-left: 20px }
    }
    .order-tbody-item {
      display: flex;
      align-items: center;
      position: relative;
      border: 1px solid #f9dbcc;
      border-top: none;
      .order-item-sku {
        width: 470px + 80px + 80px;
      }
      .sku-item {
        display: flex;
        align-items: center;
        margin-top: 6px;
      }
      .goods-image {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 86px;
        height: 86px;
        a {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 66px;
          height: 66px;
          text-align: center;
          border: 1px solid #ccc;
          background-color: #fff;
        }
        img {
          width: 62px;
          height: 62px;
        }
      }
      .goods-name-box { width: 450px - 86px }
      .goods-name {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        .assemble-color {
          color: $color-main;
          border: 1px solid $color-main;
          border-radius: 3px;
        }
      }
      .sku-price { color: $color-main }
      .sku-price, .sku-num {
        width: 80px;
        text-align: center;
      }
      .after-sale-btn {
        width: 60px;
        a { color: #666 }
        a:hover { color: $color-main }
      }
      .order-item-price, .order-item-status {
        width: 100px;
        text-align: center;
      }
      .order-item-price {
        width: 150px;
        &::before {
          content: ' ';
          position: absolute;
          top: 0;
          right: 110px + 100px + 150px;
          width: 1px;
          height: 100%;
          background-color: #f9dbcc;
        }
        &::after {
          content: ' ';
          position: absolute;
          top: 0;
          right: 110px + 100px;
          width: 1px;
          height: 100%;
          background-color: #f9dbcc;
        }
        strong { color: $color-main }
      }
      .order-item-status {
        width: 120px;
        &::after {
          content: ' ';
          position: absolute;
          top: 0;
          right: 100px;
          width: 1px;
          height: 100%;
          background-color: #f9dbcc;
        }
      }
      .order-item-operate {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 110px;
        a {
          display: block;
          width: 80px;
          height: 30px;
          line-height: 30px;
          border: 1px solid #ccc;
          text-align: center;
          background: #f9f9f9;
          color: #666;
          cursor: pointer;
          margin-bottom: 5px;
          &:first-child {
            margin-top: 5px;
          };
          &:hover {
            background: #eaeaea;
          }
        }
      }
    }
  }
  .wait-pay {
    color: $color-main !important;
  }
  .time-down {
    .ea-icon-time {
      vertical-align: -1px;
    }
  }
</style>
