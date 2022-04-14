<template>
  <div id="withdrawals-history">
    <div class="member-nav">
      <ul class="member-nav-list">
        <li><nuxt-link to="./withdrawals-history">Withdrawal record</nuxt-link></li>
      </ul>
    </div>
    <div class="recommend-container">
      <el-table :data="withdrawalsList" style="width: 100%">
        <el-table-column label="Withdrawal time" align="center">
          <template slot-scope="scope">
            <span class="time">{{ scope.row.apply_time | unixToDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Withdrawal amount" align="center">
          <template slot-scope="scope">
            <span class="price">{{ scope.row.apply_money | unitPrice('¥') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Withdrawal state" :formatter="withdraealsStatus" align="center"/>
        <el-table-column label="Operation" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="lookDetails(scope.row)">Check the details</el-button>
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
      title="Show details"
      :visible.sync="isShowDialog"
      class="dialog-show"
      align="center"
      width="25%">
      <div>
        <span>Withdrawal amount：</span> <span class="price"> {{ currentRow.apply_money | unitPrice('¥') }}</span>
      </div>
      <div>
        <span>The current state：</span> <span> {{ withdraealsStatus(currentRow) }}</span>
      </div>
      <div>
        <span>Note information：</span> <span> {{currentRow.apply_remark }}</span>
      </div>
      <div>
        <span>Transfer note：</span> <span> {{currentRow.transfer_remark }}</span>
      </div>
      <div>
        <span>Review the note：</span> <span> {{currentRow.inspect_remark }}</span>
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
        /** Paging request parameters*/
        params: {
          page_no: 1,
          page_size: 10
        },

        /** The paging information*/
        pageData: {
          page_no: 1,
          page_size: 10,
          data_total: 0
        },

        /** Withdrawal record list*/
        withdrawalsList: [],

        /** Whether to display details*/
        isShowDialog: false,

        /** Object of current row*/
        currentRow: {}
      }
    },
    mounted() {
      this.GET_WithdrawalsList()
    },
    methods: {
      /** The current page number changed*/
      handleCurrentPageChange(cur) {
        this.params.page_no = cur
        this.GET_WithdrawalsList()
      },

      withdraealsStatus(row, column, cellValue) {
        switch (row.status) {
          case 'APPLY': return 'In the application'
            break
          case 'TRANSFER_ACCOUNTS': return 'Have transfer'
            break
          case 'VIA_AUDITING': return 'approved'
            break
          case 'FAIL_AUDITING': return 'Audit failure'
            break
        }
      },

      /** Get withdrawal records*/
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

      /** Check the details*/
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
