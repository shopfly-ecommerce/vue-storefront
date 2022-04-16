<template>
  <div id="my-recommend">
    <div class="member-nav">
      <ul class="member-nav-list">
        <li>
          <nuxt-link to="./my-recommend">Someone I recommend</nuxt-link>
        </li>
      </ul>
    </div>
    <div>
      <div class="my-refereer">My references：<span>{{ myRefereer || 'No references' }}</span></div>
      <div>
        <el-table
	        :data="data"
	        style="width: 100%"
	        :row-style="showTr">
          <el-table-column
            v-for="(column, index) in columns"
            :key="column.dataIndex"
            :label="column.text"
            align="center">
            <template slot-scope="scope">
              <template v-if="spaceIconShow(index)">
                <span
                  v-for="(space, levelIndex) in scope.row._level"
                  :key="levelIndex"
                  class="ms-tree-space"
                ></span>
              </template>
              <button
                style="border:0;
                background:transparent;
                outline:none;"
                class="button is-outlined is-primary is-small"
                v-if="toggleIconShow(index,scope.row)"
                @click="toggle(scope.$index)">
                <i v-if="!scope.row._expanded" class="el-icon el-icon-plus " aria-hidden="true"></i>
                <i v-if="scope.row._expanded" class="el-icon el-icon-minus" aria-hidden="true"></i>
              </button>
              <span v-else-if="index===0" class="ms-tree-space">
                <i class="el-icon el-icon-tickets"></i>
              </span>
              <span v-if="column.dataIndex === 'useravatar'" class="user-avatar"></span>
              <span>{{scope.row[column.dataIndex]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="TAThe order of" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="lookDetails(scope.row)">Check the details</el-button>
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
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Table, TableColumn, Pagination } from 'element-ui'
  Vue.use(Table).use(TableColumn).use(Pagination);
  import Utils from './utils/index.js'
  import * as API_distribution from '@/api/distribution'
  export default {
    name: 'my-recommend',
    computed: {
      // Formatted data source
      data() {
        return Utils.MSDataTransfer.treeToArray(this.dataSource, null, null, this.defaultExpandAll)
      }
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

        /** My references*/
        myRefereer: '',

        /** According to the state*/
        showstatus: 1,

        /** Commodity group*/
        categoryID: 0,

        /** Open by default*/
        defaultExpandAll: false,

        /** Whether to default to tree structured data*/
        treeStructure: true,

        /** Column information*/
        columns: [
          {
            text: '',
            dataIndex: 'useravatar'
          },
          {
            text: 'members',
            dataIndex: 'name'
          },
          {
            text: 'TANumber of recommendations',
            dataIndex: 'downline'
          },
          {
            text: 'TAThe rebate',
            dataIndex: 'rebate_total'
          }
        ],

        /** Referral List*/
        dataSource: []
      }
    },
    mounted() {
      this.GET_myReferee();
      this.GET_referee()
    },
    methods: {
      /** My references*/
      GET_myReferee() {
        API_distribution.getMyRefereer().then(response => {
          this.myRefereer = response.message
        })
      },

      /** Get referees*/
      GET_referee() {
        API_distribution.getRefereeList().then(response => {
          this.dataSource = response
        })
      },

      /** The current page number changed*/
      handleCurrentPageChange(cur) {
        this.params.page_no = cur;
        this.GET_referee()
      },

      /** Check the details*/
      lookDetails(row) {
        this.$router.push({ path: '/member/distribution/my-performance', query: { member_id: row.id } })
      },

      // The lines
      showTr({ row, index }) {
        let show = (row._parent ? (row._parent._expanded && row._parent._show) : true);
        row._show = show;
        return show ? '' : 'display:none;'
      },

      // On the lower
      toggle(trIndex) {
        this.data[trIndex]._expanded = !this.data[trIndex]._expanded
      },

      // Displays Spaces and ICONS for hierarchical relationships
      spaceIconShow(index) {
        return this.treeStructure && index === 0
      },

      // Click expand and close when the icon toggles
      toggleIconShow(index, record) {
        return this.treeStructure && index === 0 && record.item && record.item.length
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /*My references*/
  .my-refereer {
    line-height: 50px;
    font-size: 16px;
    margin-left: 10px;
    color: #333;
  }
  /*The avatars*/
  .user-avatar {
    width: 10px;
    /*width: 25px;*/
    /*height: 25px;*/
    border-radius: 50%;
    margin-left: 15px;
  }


  /deep/ .el-table td:not(.is-left) {
    text-align: center;
  }

  .ms-tree-space{
    position: relative;
    top: 1px;
    display: inline-block;
    font-family: "Glyphicons Halflings";
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 14px;
    height: 14px;
  }
  .ms-tree-space::before{
    content: ""
  }
  /deep/ table {
    thead th{
      text-align: center;
      vertical-align: middle;
      background-color: #dddddd;
      border-bottom: none;
    }
    thead th:first-child {
      width: 10%;
    }
    td {
      line-height: 26px;
    }
  }
  /deep/ div.cell {
    display: flex;
    display: inline-block;
    flex-direction: row;
    align-items: center;
  }
  .el-icon {
    cursor: pointer;
    &::before {
      font-weight: bold;
      color: #999;
    }
  }
</style>
