<template>
  <div id="my-points">
    <div class="member-nav">
      <ul class="member-nav-list">
        <li :class="[type === 1 && 'active']">
          <nuxt-link to="./my-points">我的积分</nuxt-link>
        </li>
        <li :class="[type === 2 && 'active']">
          <nuxt-link to="./my-points?type=detail">积分明细</nuxt-link>
        </li>
      </ul>
    </div>
    <div class="points-container">
      <div v-show="type !== 'detail'" class="points-my">
        <el-alert type="warning" title="" :closable="false">
          <h2>积分规则:</h2>
          <p>当积分已达到某一兑换积分标准时，顾客可将累计积分依照网站相应积分及兑换标准兑换回馈商品，网站将即时从用户会员积分中扣减相应积分。</p>
          <p>各项回馈项目（包含各项商品、服务或抵用券等）及兑换标准及兑换规则均以兑换当时最新回馈活动公告或目录为准。</p>
          <p>部分兑换商品有数量限制的，兑完为止。</p>
          <p>公告或目录如有有效期限的，逾期即不得兑换。</p>
          <p>积分兑换区的商品为只可用积分兑换的商品(如积分价格：100积分)</p>
        </el-alert>
        <el-alert type="info" title="" :closable="false">
          <h2>消费积分</h2>
          <p>可用积分：{{ points.consum_point || 0 }}</p>
          <h2>等级积分</h2>
          <p>可用积分：{{ points.grade_point || 0 }}</p>
        </el-alert>
      </div>
      <div v-show="type === 'detail'" class="points-detail">
        <el-table
          :data="pointsData.data"
          :header-cell-style="{textAlign: 'center'}"
          style="width: 100%"
        >
          <el-table-column label="日期" align="center">
            <template slot-scope="scope">{{ scope.row.time | unixToDate }}</template>
          </el-table-column>
          <el-table-column prop="reason" label="明细" align="center"/>
          <el-table-column label="等级积分" align="center" width="120">
            <template slot-scope="{ row }">
              <span v-if="row.grade_point === 0">{{ row.grade_point }}</span>
              <span v-else-if="row.grade_point_type === 0">
                -{{ row.grade_point }}
              </span>
              <span v-else>+{{ row.grade_point }}</span>
            </template>
          </el-table-column>
          <el-table-column label="消费积分" align="center" width="120">
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
        title: `我的积分${this.site.title}`
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
          consum_point: '获取中...',
          grade_point: '获取中...'
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
        if (type !== 'detail' && this.points.consum_point === '获取中...') this.GET_Points()
        if (type === 'detail' && !this.pointsData) this.GET_PointsData()
      }
    },
    methods: {
      /** 当前分页发生变化 */
      handleCurrentChange(page) {
        this.params.page_no = page
        this.GET_PointsData()
      },
      /**
       * 获取积分明细
       * @constructor
       */
      GET_PointsData() {
        API_Members.getPointsData(this.params).then(response => {
          this.pointsData = response
          this.MixinScrollToTop()
        })
      },
      /**
       * 获取当前会员的积分
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
