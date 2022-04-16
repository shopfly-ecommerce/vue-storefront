<template>
  <div id="sales-record" class="sales-record">
    <el-table :data="salesList.data" style="width: 100%">
      <el-table-column prop="buyer_name" label="buyers" align="center"/>
      <el-table-column label="The purchase price" align="center">
        <template slot-scope="scope">
          <span class="price">￥{{ scope.row.price | unitPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="num" label="Purchase quantity" align="center"/>
      <el-table-column label="Time of payment" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.pay_time">{{ scope.row.pay_time | unixToDate }}</span>
          <span v-else>Not paying</span>
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
      /** When the page count changes*/
      handleCurrentChange(page_no) {
        this.params.page_no = page_no
        this.GET_SalesList()
      },
      /** Obtain sales records*/
      GET_SalesList() {
        API_Trade.getGoodsSales(this.goodsId, this.params).then(response => {
          this.salesList = response
        })
      }
    }
  }
</script>
