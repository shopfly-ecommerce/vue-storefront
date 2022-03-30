<template>
  <div class="ckt-item payment">
    <div class="top-ckt">
      <span class="title-top">支付类型</span>
      <span class="other-top"><a href="javascript:;"></a></span>
      <div class="clearfix"></div>
    </div>
    <div class="content-ckt-pay">
      <ul class="ul-ckt-pay min">
        <li
          :class="['ckt-checkbox', 'pay', paymentType === 'ONLINE' && 'selected']"
          @click="handleSetPaymentType('ONLINE')"
        >
          <span>在线支付</span>
        </li>
        <li
          :class="['ckt-checkbox', 'pay', paymentType === 'COD' && 'selected']"
          @click="handleSetPaymentType('COD')"
        >
          <span>货到付款</span>
        </li>
      </ul>
    </div>
    <div class="collapse-ckt-pay">
      <span class="more-collapse-ckt">更多方式</span>
      <i class="icon-collapse-ckt-pay"></i>
    </div>
    <div class="placeholder-20"></div>
  </div>
</template>

<script>
  /**
   * 结算页
   * 支付类型组件
   */
  import * as API_Trade from '@/api/trade'
  export default {
    name: 'checkout-payment',
    props: ['paymentType'],
    methods: {
      handleSetPaymentType(type) {
        API_Trade.setPaymentType(type).then(() => {
          this.$message.success('设置成功！')
          this.$emit('change', type)
        })
      }
    }
  }
</script>
