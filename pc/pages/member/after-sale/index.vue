<template>
  <div id="after-sale">
    <div class="member-nav">
      <ul class="member-nav-list">
        <li class="active">
          <nuxt-link to="./after-sale">售后列表</nuxt-link>
        </li>
      </ul>
    </div>
    <div class="after-sale-container">
      <el-table :data="afterSale.data" style="width: 100%">
        <el-table-column label="申请时间">
          <template slot-scope="scope">{{ scope.row.create_time | unixToDate }}</template>
        </el-table-column>
        <el-table-column prop="sn" label="退货(款)单编号"/>
        <el-table-column prop="refuse_type_text" label="售后类型"/>
        <el-table-column prop="refund_status_text" label="售后状态" width="150"/>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <nuxt-link :to="'/member/after-sale/detail?sn=' + scope.row.sn">查看</nuxt-link>
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
      /** 当前页数发生改变 */
      handleCurrentPageChange(page) {
        this.params.page_no = page
        this.GET_AfterSale()
      },
      /** 获取售后列表 */
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
