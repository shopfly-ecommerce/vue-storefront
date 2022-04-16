<template>
  <div class="total-ckt-total">
    <div class="details-ckt-total">
      <ul class="ul-details-ckt-total">
        <li>
          <span class="title-details-ckt-total">Total amount of goods：</span>
          <em class="price-details-ckt-total">￥{{ orderTotal.original_price | unitPrice }}</em>
          <div class="clear-details-ckt-total"></div>
        </li>
        <li class="li_discount_price" v-if="orderTotal.coupon_price">
          <span class="title-details-ckt-total">Coupon deduction：</span>
          <em class="price-details-ckt-total">-￥{{ orderTotal.coupon_price | unitPrice }}</em>
          <div class="clear-details-ckt-total"></div>
        </li>
        <li class="li_discount_price" v-if="orderTotal.cash_back">
          <span class="title-details-ckt-total">Cashback amount：</span>
          <em class="price-details-ckt-total">-￥{{ orderTotal.cash_back | unitPrice }}</em>
          <div class="clear-details-ckt-total"></div>
        </li>
        <li class="li_discount_price" v-if="orderTotal.exchange_point">
          <span class="title-details-ckt-total">Deduction of integral：</span>
          <em class="price-details-ckt-total">-{{ orderTotal.exchange_point }}point</em>
          <div class="clear-details-ckt-total"></div>
          <p class="tip-details-ckt-total">Warm prompt：Order cancellation、Application for after-sale credits is not refundable</p>
        </li>
        <li>
          <span class="title-details-ckt-total">The freight in total：</span>
          <em class="price-details-ckt-total">￥{{ orderTotal.freight_price | unitPrice }}</em>
          <div class="clear-details-ckt-total"></div>
        </li>
      </ul>
    </div>
    <div class="summary-ckt-total">
      <div class="amounts-payable-ckt">
        <span class="title-details-ckt-total amounts">Amount payable：</span>
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
