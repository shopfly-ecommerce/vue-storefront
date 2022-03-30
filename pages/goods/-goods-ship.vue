<template>
  <div class="pro-list">
    <div class="pro-title">配&ensp;送&ensp;至</div>
    <div class="pro-content">
      <en-region-picker
        :api="MixinRegionApi"
        @changed="handleShipAreaChange"
        style="display: inline-block"
      />
      <span class="area-tip">{{ stockMsg }}</span>
    </div>
  </div>
</template>

<script>
  import * as API_Goods from '@/api/goods'
  export default {
    name: 'goods-ship',
    props: ['goods-id'],
    data() {
      return {
        in_store: 2
      }
    },
    computed: {
      stockMsg() {
        const { in_store } = this
        switch (in_store) {
          case 0: return '该地区无货'
          case 1: return '该地区有货'
          default: return '配送地区'
        }
      }
    },
    methods: {
      handleShipAreaChange(object) {
        const goods_id = this.goodsId
        const area_id = object.last_id
        API_Goods.getGoodsShip(goods_id, area_id).then(response => {
          this.in_store = response
          this.$emit('in-stock-change', response)
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ {
    .app-address {
      margin-top: 4px;
      z-index: 1;
    }
    .area-tip {
      color: #666;
      margin-left: 10px;
    }
  }
</style>
