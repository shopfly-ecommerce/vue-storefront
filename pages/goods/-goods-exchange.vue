<template>
  <div v-if="promotion" class="exchange-container">
    <div class="pro-list">
      <div class="pro-title">Status</div>
      <div class="pro-content price" v-if="promotion.exchange_money">
        <span>￥</span>
        <strong>{{ promotion.exchange_money | unitPrice }} + {{ promotion.exchange_point }}point</strong>
      </div>
	    <div class="pro-content price" v-else>
		    <strong>{{ promotion.exchange_point }}point</strong>
	    </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'goods-exchange',
    props: ['promotions'],
    computed: {
      promotion() {
        if (!this.promotions || !this.promotions.length) return false
        // Try group buying first
        let prom = this.promotions.filter(item => item.exchange)
        // If none, return false
        if (!prom || !prom[0]) return false
        return prom[0].exchange
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .exchange-container {
    position: relative;
    .pro-list {
      position: absolute;
      z-index: 3;
      top: 0;
      left: 0;
      right: 0;
      background-color: #f3f3f3;
    }
  }
</style>
