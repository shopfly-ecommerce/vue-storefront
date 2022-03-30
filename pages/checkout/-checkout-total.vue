<template>
  <div class="total-ckt-total">
    <div class="details-ckt-total">
      <ul class="ul-details-ckt-total">
        <li>
          <span class="title-details-ckt-total">商品总金额：</span>
          <em class="price-details-ckt-total">￥{{ orderTotal.original_price | unitPrice }}</em>
          <div class="clear-details-ckt-total"></div>
        </li>
        <li class="li_discount_price" v-if="orderTotal.coupon_price">
          <span class="title-details-ckt-total">优惠券抵扣：</span>
          <em class="price-details-ckt-total">-￥{{ orderTotal.coupon_price | unitPrice }}</em>
          <div class="clear-details-ckt-total"></div>
        </li>
        <li class="li_discount_price" v-if="orderTotal.cash_back">
          <span class="title-details-ckt-total">返现金额：</span>
          <em class="price-details-ckt-total">-￥{{ orderTotal.cash_back | unitPrice }}</em>
          <div class="clear-details-ckt-total"></div>
        </li>
        <li class="li_discount_price" v-if="orderTotal.exchange_point">
          <span class="title-details-ckt-total">抵扣积分：</span>
          <em class="price-details-ckt-total">-{{ orderTotal.exchange_point }}积分</em>
          <div class="clear-details-ckt-total"></div>
          <p class="tip-details-ckt-total">温馨提示：订单取消、申请售后积分不退还</p>
        </li>
        <li>
          <span class="title-details-ckt-total">运费总计：</span>
          <em class="price-details-ckt-total">￥{{ orderTotal.freight_price | unitPrice }}</em>
          <div class="clear-details-ckt-total"></div>
        </li>
      </ul>
    </div>
    <div class="summary-ckt-total">
      <div class="amounts-payable-ckt">
        <span class="title-details-ckt-total amounts">应付金额：</span>
        <em class="price-details-ckt-total amounts">￥{{ orderTotal.total_price | unitPrice }}</em>
        <div class="clear-details-ckt-total"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'checkout-total',
    props: ['orderTotal']
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/styles/color";
  .tip-details-ckt-total {
    text-align: right;
    color: $color-main;
    line-height: 22px;
  }
</style>
