<template>
  <div id="sales-record" class="sales-record">
    <el-table :data="salesList.data" style="width: 100%">
      <el-table-column prop="buyer_name" label="买家" align="center"/>
      <el-table-column label="购买价格" align="center">
        <template slot-scope="scope">
          <span class="price">￥{{ scope.row.price | unitPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="num" label="购买数量" align="center"/>
      <el-table-column label="付款时间" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.pay_time">{{ scope.row.pay_time | unixToDate }}</span>
          <span v-else>未付款</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="salesList"
      @current-change="handleCurrentChange"
      :current-page.sync="params.page_no"
      :page-size="params.page_size"
      layout="total, prev, pager, next"
      :total="salesList.data_total">
    </el-pagination>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Table, TableColumn } from 'element-ui'
  Vue.use(Table)
  Vue.use(TableColumn)
  import * as API_Trade from '@/api/trade'
  export default {
    name: "sales-record",
    props: ['goods-id'],
    data() {
      return {
        salesList: '',
        params: {
          page_no: 1,
          page_size: 10
        }
      }
    },
    mounted() {
      this.GET_SalesList()
    },
    methods: {
      /** 当页数发生改变 */
      handleCurrentChange(page_no) {
        this.params.page_no = page_no
        this.GET_SalesList()
      },
      /** 获取销售记录 */
      GET_SalesList() {
        API_Trade.getGoodsSales(this.goodsId, this.params).then(response => {
          this.salesList = response
        })
      }
    }
  }
</script>
