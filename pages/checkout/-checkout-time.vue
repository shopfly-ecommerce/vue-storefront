<template>
  <div class="ckt-item time">
    <div class="top-ckt">
      <span class="title-top">Delivery time</span>
      <div class="clearfix"></div>
    </div>
    <div class="content-ckt time">
      <div
        :class="['ckt-checkbox time', receiveTime === 'At any time' && 'selected']"
        @click="handleSetReceiveTime('At any time')"
      >
        <span>At any time</span>
      </div>
      <div
        :class="['ckt-checkbox time', receiveTime === 'Only working day' && 'selected']"
        @click="handleSetReceiveTime('Only working day')"
      >
        <span>Only working days</span>
      </div>
      <div
        :class="['ckt-checkbox time', receiveTime === 'Only holiday' && 'selected']"
        @click="handleSetReceiveTime('Only holiday')"
      >
        <span>Only a day off</span>
      </div>
    </div>
    <div class="placeholder-20"></div>
  </div>
</template>

<script>
  /**
   * The settlement page
   * Delivery time component
   */
  import * as API_Trade from '@/api/trade'
  export default {
    name: 'checkout-time',
    props: ['receiveTime'],
    methods: {
      handleSetReceiveTime(time) {
        API_Trade.setReceiveTime(time).then(() => {
          this.$message.success('Set up the success！')
          this.$emit('change', time)
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>

</style>
