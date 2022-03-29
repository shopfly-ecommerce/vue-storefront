<template>
  <div id="after-sale-detail">
    <div v-if="detail" class="order-detail">
      <h1>订单信息</h1>
      <div class="detail-list">
        <dl><dt>订单编号：</dt><dd>{{ detail.order_sn }}</dd></dl>
        <dl class="top-line"><dt>申请时间：</dt><dd>{{ detail.create_time | unixToDate }}</dd></dl>
        <dl><dt>状态：</dt><dd><span>{{ detail.refund_status_text }}</span></dd></dl>
        <dl><dt>商家审核备注：</dt><dd><span>{{ detail.seller_remark || '无' }}</span></dd></dl>
        <dl><dt>申请售后原因：</dt><dd>{{ detail.refund_reason }}</dd></dl>
        <dl><dt>申请售后详细描述：</dt><dd>{{ detail.customer_remark || '无' }}</dd></dl>
        <dl><dt>退款方式：</dt><dd>{{ detail.refund_way === 'ORIGINAL' ? '原路退回' : (detail.account_type_text || '无') }}</dd></dl>
        <dl><dt>退款账号：</dt><dd>{{ detail.refund_way === 'ORIGINAL' ? '原路退回' : (detail.return_account || '无') }}</dd></dl>
        <dl><dt>申请售后金额：</dt><dd>￥{{ detail.refund_price | unitPrice }}</dd></dl>
      </div>
    </div>
    <div v-if="sku" class="goods-list">
      <sku-list :skuList="sku" num="return_num"></sku-list>
    </div>
  </div>
</template>

<script>
  import * as API_AfterSale from '@/api/after-sale'
  import SkuList from '../-skuList'
  export default {
    name: 'detail',
    validate({ query }) {
      return !!query.sn
    },
    components: { SkuList },
    data() {
      return {
        sn: this.$route.query.sn,
        detail: '',
        sku: ''
      }
    },
    mounted() {
      this.GET_AfterSaleDetail()
    },
    methods: {
      GET_AfterSaleDetail() {
        API_AfterSale.getAfterSaleDetail(this.sn).then(response => {
          this.detail = response.refund
          this.sku = response.refund_goods
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .order-detail {
    background-color: #fbfbfb;
    border: 1px solid #d8d8d8;
    display: inline-block;
    letter-spacing: normal;
    vertical-align: top;
    width: 100%;
    word-spacing: normal;
    h1 {
      background-color: #f3f3f3;
      border-bottom: 1px solid #d8d8d8;
      font-size: 12px;
      font-weight: 600;
      height: 20px;
      line-height: 20px;
      padding: 9px;
    }
    .detail-list {
      display: block;
      padding: 17px 17px 7px;
      width: auto;
      dl {
        margin-bottom: 10px;
        display: inline-block;
        font-size: 12px;
        letter-spacing: normal;
        line-height: 20px;
        vertical-align: top;
        word-spacing: normal;
        width: 100%;
        &.top-line {
          border-top: 1px dotted #d8d8d8;
          padding-top: 10px;
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
  }
  .goods-list {
    margin-top: 20px;
  }
</style>
