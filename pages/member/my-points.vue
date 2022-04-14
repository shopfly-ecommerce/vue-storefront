<template>
  <div id="my-points">
    <div class="member-nav">
      <ul class="member-nav-list">
        <li :class="[type === 1 && 'active']">
          <nuxt-link to="./my-points">Points</nuxt-link>
        </li>
        <li :class="[type === 2 && 'active']">
          <nuxt-link to="./my-points?type=detail">The integral subsidiary</nuxt-link>
        </li>
      </ul>
    </div>
    <div class="points-container">
      <div v-show="type !== 'detail'" class="points-my">
        <el-alert type="warning" title="" :closable="false">
          <h2>Integral rules:</h2>
          <p>When the points have reached a certain point exchange standard, the customers can exchange the accumulated points for feedback products according to the corresponding points and exchange standards of the website, and the website will deduct the corresponding points from the users member points immediately.</p>
          <p>Feedback programs（Including all commodities、Services or vouchers, etc）And exchange criteria and exchange rules are subject to the latest announcement or catalogue of exchange activities.</p>
          <p>Where there is a limit on the quantity of some commodities to be exchanged, the exchange shall be completed.</p>
          <p>If the announcement or catalogue has an expiry date, it shall not be exchanged after the expiry date.</p>
          <p>Goods in the point exchange area are only redeemable by points(Such as the price of points：100point)</p>
        </el-alert>
        <el-alert type="info" title="" :closable="false">
          <h2>score</h2>
          <p>Available integral：{{ points.consum_point || 0 }}</p>
          <h2>Level of integration</h2>
          <p>Available integral：{{ points.grade_point || 0 }}</p>
        </el-alert>
      </div>
      <div v-show="type === 'detail'" class="points-detail">
        <el-table
          :data="pointsData.data"
          :header-cell-style="{textAlign: 'center'}"
          style="width: 100%"
        >
          <el-table-column label="The date of" align="center">
            <template slot-scope="scope">{{ scope.row.time | unixToDate }}</template>
          </el-table-column>
          <el-table-column prop="reason" label="The detail" align="center"/>
          <el-table-column label="Level of integration" align="center" width="120">
            <template slot-scope="{ row }">
              <span v-if="row.grade_point === 0">{{ row.grade_point }}</span>
              <span v-else-if="row.grade_point_type === 0">
                -{{ row.grade_point }}
              </span>
              <span v-else>+{{ row.grade_point }}</span>
            </template>
          </el-table-column>
          <el-table-column label="score" align="center" width="120">
            <template slot-scope="{ row }">
              <span v-if="row.consum_point === 0">{{ row.consum_point }}</span>
              <span v-else-if="row.consum_point_type === 0">
                -{{ row.consum_point }}
              </span>
              <span v-else>+{{ row.consum_point }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="pointsData"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :total="pointsData.data_total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import * as API_Members from '@/api/members'
  export default {
    name: 'my-points',
    head() {
      return {
        title: `Points${this.site.title}`
      }
    },
    data() {
      return {
        type: this.$route.query.type,
        params: {
          page_no: 1,
          page_size: 10
        },
        pointsData: '',
        points: {
          consum_point: 'To obtain the...',
          grade_point: 'To obtain the...'
        }
      }
    },
    mounted() {
      this.type !== 'detail'
        ? this.GET_Points()
        : this.GET_PointsData()
    },
    watch: {
      $route: function () {
        const { type } =this.$route.query
        this.type = type
        if (type !== 'detail' && this.points.consum_point === 'To obtain the...') this.GET_Points()
        if (type === 'detail' && !this.pointsData) this.GET_PointsData()
      }
    },
    methods: {
      /** The current page has changed*/
      handleCurrentChange(page) {
        this.params.page_no = page
        this.GET_PointsData()
      },
      /**
       * Obtain integral details
       * @constructor
       */
      GET_PointsData() {
        API_Members.getPointsData(this.params).then(response => {
          this.pointsData = response
          this.MixinScrollToTop()
        })
      },
      /**
       * Get points for current members
       * @constructor
       */
      GET_Points() {
        API_Members.getPoints().then(response => {
          this.points = response
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .points-container {
    padding-top: 10px;
    /deep/ .cell { font-size: 12px }
    /deep/ .el-pagination {
      text-align: right;
      margin-top: 15px;
    }
  }
  .points-my /deep/ .el-alert--warning {
    h2 {
      font-size: 18px;
      margin-bottom: 10px;
    }
    p {
      margin-bottom: 5px;
    }
  }
  .points-my /deep/ .el-alert--info {
    margin-top: 15px;
    h2 {
      font-size: 16px;
      margin-bottom: 10px;
    }
    p {
      margin-bottom: 5px;
    }
  }
</style>
