<template>
  <div id="after-sale">
    <div class="member-nav">
      <ul class="member-nav-list">
        <li class="active">
          <nuxt-link to="./after-sale">After the list</nuxt-link>
        </li>
      </ul>
    </div>
    <div class="after-sale-container">
      <el-table :data="afterSale.data" style="width: 100%">
        <el-table-column label="To apply for time">
          <template slot-scope="scope">{{ scope.row.create_time | unixToDate }}</template>
        </el-table-column>
        <el-table-column prop="sn" label="Return of the goods(paragraph)A single number"/>
        <el-table-column prop="refuse_type_text" label="After type"/>
        <el-table-column prop="refund_status_text" label="After state" width="150"/>
        <el-table-column label="Operation" width="100">
          <template slot-scope="scope">
            <nuxt-link :to="'/member/after-sale/detail?sn=' + scope.row.sn">To view</nuxt-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="member-pagination" v-if="afterSale">
      <el-pagination
        @current-change="handleCurrentPageChange"
        :current-page.sync="params.page_no"
        :page-size="params.page_size"
        layout="total, prev, pager, next"
        :total="afterSale.data_total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import * as API_AfterSale from '@/api/after-sale'
  export default {
    name: 'after-sale-index',
    data() {
      return {
        afterSale: '',
        params: {
          page_no: 1,
          page_size: 10
        }
      }
    },
    mounted() {
      this.GET_AfterSale()
    },
    methods: {
      /** The current page number changed*/
      handleCurrentPageChange(page) {
        this.params.page_no = page
        this.GET_AfterSale()
      },
      /** Get after-sale list*/
      GET_AfterSale() {
        API_AfterSale.getAfterSale(this.params).then(response => {
          this.afterSale = response
          this.MixinScrollToTop()
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .after-sale-container {
    margin-bottom: 10px;
    /deep/ .el-table__header .cell { text-align: center }
    /deep/ .el-table__body .cell {
      text-align: center;
      font-size: 14px;
    }
  }
</style>
