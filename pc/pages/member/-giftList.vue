<template>
  <el-table v-if="giftList && giftList.length" :data="giftList" style="width: 100%">
    <el-table-column label="赠品列表" width="100" align="center">
      <template slot-scope="scope">
        <a :href="scope.row.gift_img" target="_blank">
          <img :src="scope.row.gift_img"  class="goods-image">
        </a>
      </template>
    </el-table-column>
    <el-table-column label="赠品名称" align="center">
      <template slot-scope="scope">
        <div style="display: inline-block">
          <a :href="scope.row.gift_img" target="_blank" class="goods-name">{{ scope.row.gift_name }}</a>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="赠品单价" width="120" align="center">
      <template slot-scope="scope">{{ scope.row.gift_price | unitPrice('￥') }}</template>
    </el-table-column>
    <el-table-column label="" width="90"/>
    <el-table-column label="" width="120"/>
  </el-table>
</template>

<script>
  // 订单附赠赠品和优惠券列表
  export default {
    name: 'gift-list',
    props: ['gift-list']
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ .el-table__header th:first-child .cell {
    font-size: 16px;
    font-weight: bold;
  }
  .el-table {
    border: 1px solid #ebeef5;
    border-bottom: none;
    font-size: 12px;
    margin-top: 10px;
  }
  .el-table /deep/ .el-table__header .cell { text-align: center }
  .el-table /deep/ .el-table__body .cell { text-align: center }
  .goods-name {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .goods-image {
    width: 50px;
    height: 50px;
  }
</style>
