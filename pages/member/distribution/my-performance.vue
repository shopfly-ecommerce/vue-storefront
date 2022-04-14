<template>
  <div id="my-performance">
	<div class="member-nav">
	    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
		    <el-tab-pane label="Orders related to me" name="order">
			    <div class="recommend-container">
				    <div class="achievement-summary">
					    <div>
						    <span class="current-money performance-money">This commission：</span>
						    <span> {{ settlementTotal.start_time | unixToDate('yyyy-MM-dd') }} ～ {{ settlementTotal.end_time | unixToDate('yyyy-MM-dd') }} </span>
					    </div>
					    <div>
						    <span class="finally-money performance-money">{{ settlementTotal.final_money | unitPrice('¥') }}</span>
						    <span>The final commission</span>
					    </div>
					    <div>
						    <span class="performance-symbol">=</span>
					    </div>
					    <div>
						    <span class="summary-money performance-money">{{ settlementTotal.push_money | unitPrice('¥') }}</span>
						    <span>The order of commission</span>
					    </div>
					    <div>
						    <span class="performance-symbol">-</span>
					    </div>
					    <div>
						    <span class="refund-money performance-money">{{ settlementTotal.return_push_money | unitPrice('¥') }}</span>
						    <span>Return order commission refund</span>
					    </div>
				    </div>
				    <performanceOrder :performanceList="relevantList"/>
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
		    </el-tab-pane>
		    <el-tab-pane label="A return receipt associated with me" name="refund">
			    <div class="recommend-container">
				    <div class="achievement-summary">
					    <div>
						    <span class="current-money performance-money">This commission：</span>
						    <span> {{ settlementTotal.start_time | unixToDate('yyyy-MM-dd') }} ～ {{ settlementTotal.end_time | unixToDate('yyyy-MM-dd') }} </span>
					    </div>
					    <div>
						    <span class="finally-money performance-money">{{ settlementTotal.final_money | unitPrice('¥') }}</span>
						    <span>The final commission</span>
					    </div>
					    <div>
						    <span class="performance-symbol">=</span>
					    </div>
					    <div>
						    <span class="summary-money performance-money">{{ settlementTotal.push_money | unitPrice('¥') }}</span>
						    <span>The order of commission</span>
					    </div>
					    <div>
						    <span class="performance-symbol">-</span>
					    </div>
					    <div>
						    <span class="refund-money performance-money">{{ settlementTotal.return_push_money | unitPrice('¥') }}</span>
						    <span>Return order commission refund</span>
					    </div>
				    </div>
				    <performanceRefund :performanceList="relevantRefundList"/>
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
		    </el-tab-pane>
		    <el-tab-pane label="My track record" name="history">
			    <div class="recommend-container">
				    <div class="achievement-summary">
					    <div>
						    <span class="current-money performance-money">This commission：</span>
						    <span> {{ settlementTotal.start_time | unixToDate('yyyy-MM-dd') }} ～ {{ settlementTotal.end_time | unixToDate('yyyy-MM-dd') }} </span>
					    </div>
					    <div>
						    <span class="finally-money performance-money">{{ settlementTotal.final_money | unitPrice('¥') }}</span>
						    <span>The final commission</span>
					    </div>
					    <div>
						    <span class="performance-symbol">=</span>
					    </div>
					    <div>
						    <span class="summary-money performance-money">{{ settlementTotal.push_money | unitPrice('¥') }}</span>
						    <span>The order of commission</span>
					    </div>
					    <div>
						    <span class="performance-symbol">-</span>
					    </div>
					    <div>
						    <span class="refund-money performance-money">{{ settlementTotal.return_push_money | unitPrice('¥') }}</span>
						    <span>Return order commission refund</span>
					    </div>
				    </div>
				    <performanceHistory :performanceList="myHistoryList" @newBill="handleNewBill"/>
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
		    </el-tab-pane>
	    </el-tabs>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Table, TableColumn, Pagination, Tabs, TabPane } from 'element-ui'
  Vue.use(Table).use(TableColumn).use(Pagination).use(Tabs).use(TabPane);
  import * as API_distribution from '@/api/distribution'
  import performanceHistory from './performance-history'
  import performanceRefund from './performance-refund'
  import performanceOrder from './performance-order'
  export default {
    name: 'my-performance',
	  components: {
      performanceHistory,
      performanceRefund,
      performanceOrder
	  },
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

	      /** The current operationtab */
        activeName: 'order',

        /** An order associated with a member*/
        relevantList: [],

	      /** A return receipt associated with a member*/
        relevantRefundList: [],

	      /** Historical performance relevant to a member*/
        myHistoryList: [],

        /** My statement*/
        settlementTotal: {
          start_time: 0,

          end_time: 0,

          push_money: 0,

          final_money: 0,

          return_order_money: 0,

          return_push_money: 0
        },

	      /** Statement related request parameters*/
        perParmas: {
          // Active member ID
          member_id: 0,
          // The statement ID of the current operation
          bill_id: ''
        }
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      async init() {
        // Obtain statement information
        const response = await API_distribution.getSettlementTotal(this.perParmas);
        this.settlementTotal = response;
        const { member_id, id } = response;
        this.params = {
          ...this.params,
          member_id: member_id,
          bill_id: id
        };
        // Obtain the corresponding data according to the current click status by default to obtain the order information of the current members current statement
        this.GET_RelevantList()
      },
      /** The current page number changed*/
      handleCurrentPageChange(cur) {
        this.params.page_no = cur;
        switch (this.activeName) {
          case 'order': this.GET_RelevantList();
            break;
          case 'refund': this.GET_RelevantRefundList();
            break;
          case 'history': this.GET_MyhistoryList();
            break;
          default: this.GET_RelevantList()
        }
      },

	    /** switchtab */
      handleClick(tab) {
        this.activeName = tab.name;
		    switch (this.activeName) {
			    case 'order': this.GET_RelevantList();
				    break;
          case 'refund': this.GET_RelevantRefundList();
            break;
          case 'history': this.GET_MyhistoryList();
            break;
			    default: this.GET_RelevantList()
		    }
      },

      /** Get the order record associated with me*/
      GET_RelevantList() {
        API_distribution.getRelevantList(this.params).then(response => {
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          };
          this.relevantList = response.data
        })
      },

      /** Get the record of refund receipt associated with me*/
      GET_RelevantRefundList() {
        API_distribution.getRelevantRefundList(this.params).then(response => {
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          };
          this.relevantRefundList = response.data
        })
      },

      /** Get my track record*/
      GET_MyhistoryList() {
        API_distribution.getMyHistoryList(this.params).then(response => {
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          };
          this.myHistoryList = response.data
        })
      },

      handleNewBill(row) {
        this.activeName = 'order';
	      this.perParmas = {
          member_id: row.member_id,
		      bill_id: row.id
	      };
        this.init()
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /*Performance reviews*/
  .achievement-summary {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    margin: 15px 0 20px;
    padding: 0;
    border: 1px solid #ddd;
    & > div {
      margin:0 25px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      & > span {
        display:inline-block;
        line-height: 40px;
      }
      span.performance-money {
        font-size: 20px;
        font-weight: 700;
      }
      span.current-money {
        color: #00a0e9;
      }
      span.finally-money, span.summary-money {
        color: #D93600;
      }
      span.refund-money {
        color: #aaa;
      }
      span.performance-symbol {
        font-family: "Yuanti SC", Arial, "Yuanti SC", Helvetica, sans-serif;
        font-size: 60px;
        color: #aaa;
      }
    }
  }
</style>
