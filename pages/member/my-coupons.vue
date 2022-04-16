<template>
  <div id="my-coupons">
    <div class="member-nav">
      <ul class="member-nav-list">
        <li class="active">
          <a href="./my-coupons">My coupon</a>
        </li>
      </ul>
    </div>
    <div class="coupons-container">
      <empty-member v-if="coupons && !coupons.data.length">No coupon</empty-member>
      <ul v-else class="coupon-list">
        <li v-for="(coupon, index) in coupons.data" :key="index" class="coupon-item" :class="[coupon.used_status === 1 && 'used', coupon.used_status === 2 && 'overdue']">
          <div class="c-type">
            <div class="c-money">
              <span>￥</span>
              <strong>{{ coupon.coupon_price | unitPrice }}</strong>
            </div>
            <div class="c-limit">
              full￥{{ coupon.coupon_threshold_price | unitPrice }}available
            </div>
            <div class="c-time">
              {{ coupon.start_time | unixToDate('yyyy-MM-dd') }} - {{ coupon.end_time | unixToDate('yyyy-MM-dd') }}
            </div>
          </div>
          <div class="c-othr">
            <span v-if="coupon.used_status === 1">Has been used</span>
            <span v-else-if="coupon.used_status === 2">expired</span>
            <nuxt-link v-else to="/goods" class="use-btn">Immediate use</nuxt-link>
          </div>
          <i class="is-used"></i>
          <i class="is-overdue"></i>
        </li>
      </ul>
      <span class="clr"></span>
      <div class="member-pagination" v-if="coupons">
        <el-pagination
          v-if="coupons.data_total"
          @current-change="handleCurrentPageChange"
          :current-page.sync="params.page_no"
          :page-size="params.page_size"
          layout="total, prev, pager, next"
          :total="coupons.data_total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import * as API_Members from '@/api/members'
  export default {
    name: 'my-coupons',
    head() {
      return {
        title: `My coupon-${this.site.title}`
      }
    },
    data() {
      return {
        coupons: '',
        params: {
          page_no: 1,
          page_size: 8
        }
      }
    },
    mounted() {
      this.GET_Coupons()
    },
    methods: {
      /** The current page number changed*/
      handleCurrentPageChange(page) {
        this.params.page_no = page
        this.GET_Coupons()
      },
      GET_Coupons() {
        API_Members.getCoupons(this.params).then(response => {
          this.coupons = response
          this.MixinScrollToTop()
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .coupons-container {
    padding-top: 10px;
  }
  .coupon-item {
    float: left;
    position: relative;
    width: 227px;
    margin: 0 20px 20px 0;
    &.used {
      filter: grayscale(100%);
      .is-used {
        display: block;
      }
    }
    &.overdue {
      filter: grayscale(100%);
      .is-overdue {
        display: block;
      }
    }
    &:nth-child(4n) {
      margin-right: 0;
    }
    .c-type {
      position: relative;
      background-color: #ff5e5e;
      height: 125px;
      padding-top: 30px;
      color: #fff;
      overflow: hidden;
      text-align: center;
      background-image:
        -webkit-gradient(linear, 50% 0, 0 100%, from(transparent),
          color-stop(.5,transparent),
          color-stop(.5,#f9f9f9),
          to(#f9f9f9)),
        -webkit-gradient(linear,50% 0,100% 100%,from(transparent),
          color-stop(.5,transparent),
          color-stop(.5,#f9f9f9),
          to(#f9f9f9));
      background-size:12px 6px;
      background-repeat:repeat-x;
      background-position:0 100%;
      &:before, &:after {
        content: ' ';
        position: absolute;
        top: 50%;
        margin-top: -35px;
        width: 40px;
        height: 40px;
        background-color: #fff;
        border-radius: 100%;
      }
      &:before { left: -20px }
      &:after { right: -20px }
    }
    .c-money {
      span { font-size: 18px }
      strong {
        line-height: 45px;
        font-size: 40px;
        font-family: Arial;
        margin-left: 3px;
      }
    }
    .c-limit {
      height: 40px;
      line-height: 22px;
      overflow: hidden;
      margin: 0 5px 5px;
    }
    .c-time {
      font-family: Verdana;
    }
    .c-othr {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 75px;
      background-color: #fff;
      box-shadow: 0 2px 10px 0 #ccc;
      .use-btn {
        display: block;
        width: 100px;
        line-height: 28px;
        text-align: center;
        color: #ff5d5e;
        border-radius: 15px;
        cursor: pointer;
        border: 1px solid #ff6966;
        transition: all .2s ease;
        font-weight: 500;
        &:hover {
          background-color: #ff6966;
          color: #fff;
        }
      }
    }
    .is-used, .is-overdue {
      display: none;
      position: absolute;
      z-index: 10;
      top: 0;
      right: 20px;
      width: 120px;
      height: 120px;
      background: url("data:image/png;base64,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") no-repeat;
      background-size: 100%;
    }
    .is-overdue {
      background: url("data:image/png;base64,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");
    }
  }
</style>
