<template>
  <div class="ckt-item payment">
    <div class="top-ckt">
      <span class="title-top">Payment type</span>
      <span class="other-top"><a href="javascript:;"></a></span>
      <div class="clearfix"></div>
    </div>
    <div class="content-ckt-pay">
      <ul class="ul-ckt-pay min">
        <li
          :class="['ckt-checkbox', 'pay', paymentType === 'ONLINE' && 'selected']"
          @click="handleSetPaymentType('ONLINE')"
        >
          <span>Online payment</span>
        </li>
        <li
          :class="['ckt-checkbox', 'pay', paymentType === 'COD' && 'selected']"
          @click="handleSetPaymentType('COD')"
        >
          <span>Cash on delivery</span>
        </li>
      </ul>
    </div>
    <div class="collapse-ckt-pay">
      <span class="more-collapse-ckt">More ways</span>
      <i class="icon-collapse-ckt-pay"></i>
    </div>
    <div class="placeholder-20"></div>
  </div>
</template>

<script>
  /**
   * The settlement page
   * Payment type component
   */
  import * as API_Trade from '@/api/trade'
  export default {
    name: 'checkout-payment',
    props: ['paymentType'],
    methods: {
      handleSetPaymentType(type) {
        API_Trade.setPaymentType(type).then(() => {
          this.$message.success('Set up the success！')
          this.$emit('change', type)
        })
      }
    }
  }
</script>
