<template>
  <div id="withdrawals-history">
    <div class="member-nav">
      <ul class="member-nav-list">
        <li><nuxt-link to="./withdrawals-history">提现记录</nuxt-link></li>
      </ul>
    </div>
    <div class="recommend-container">
      <el-table :data="withdrawalsList" style="width: 100%">
        <el-table-column label="提现时间" align="center">
          <template slot-scope="scope">
            <span class="time">{{ scope.row.apply_time | unixToDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="提现金额" align="center">
          <template slot-scope="scope">
            <span class="price">{{ scope.row.apply_money | unitPrice('¥') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="提现状态" :formatter="withdraealsStatus" align="center"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="lookDetails(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="member-pagination">
        <el-pagination
          @current-change="handleCurrentPageChange"
          :current-page.sync="pageData.page_no"
          :page-size="pageData.page_size"
          layout="total, prev, pager, next"
          :total="pageData.data_total">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="提现详情"
      :visible.sync="isShowDialog"
      class="dialog-show"
      align="center"
      width="25%">
      <div>
        <span>提现金额：</span> <span class="price"> {{ currentRow.apply_money | unitPrice('¥') }}</span>
      </div>
      <div>
        <span>当前状态：</span> <span> {{ withdraealsStatus(currentRow) }}</span>
      </div>
      <div>
        <span>备注信息：</span> <span> {{currentRow.apply_remark }}</span>
      </div>
      <div>
        <span>转账备注：</span> <span> {{currentRow.transfer_remark }}</span>
      </div>
      <div>
        <span>审核备注：</span> <span> {{currentRow.inspect_remark }}</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Table, TableColumn, Pagination, Dialog } from 'element-ui'
  Vue.use(Table).use(TableColumn).use(Pagination).use(Dialog)
  import * as API_distribution from '@/api/distribution'
  export default {
    name: 'withdrawals-history',
    data() {
      return {
        /** 分页请求参数 */
        params: {
          page_no: 1,
          page_size: 10
        },

        /** 分页信息 */
        pageData: {
          page_no: 1,
          page_size: 10,
          data_total: 0
        },

        /** 提现记录列表 */
        withdrawalsList: [],

        /** 是否显示详情 */
        isShowDialog: false,

        /** 当前行的对象 */
        currentRow: {}
      }
    },
    mounted() {
      this.GET_WithdrawalsList()
    },
    methods: {
      /** 当前页数发生改变 */
      handleCurrentPageChange(cur) {
        this.params.page_no = cur
        this.GET_WithdrawalsList()
      },

      withdraealsStatus(row, column, cellValue) {
        switch (row.status) {
          case 'APPLY': return '申请中'
            break
          case 'TRANSFER_ACCOUNTS': return '已转账'
            break
          case 'VIA_AUDITING': return '审核通过'
            break
          case 'FAIL_AUDITING': return '审核失败'
            break
        }
      },

      /** 获取提现记录 */
      GET_WithdrawalsList() {
        API_distribution.getWithdrawalsList(this.params).then(response => {
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
          this.withdrawalsList = response.data
        })
      },

      /** 查看详情 */
      lookDetails(row) {
        this.isShowDialog = true
        this.currentRow = row
        console.log(this.currentRow)
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ .recommend-container {
    div {
      font-size: 12px;
    }
  }
  /deep/ .el-dialog__body {
    padding-top: 10px;
    & > div {
      margin: 10px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }
  }
</style>
