<template>
  <div id="seckill" class="seckill-container">
    <div class="seckill-title">
      <h1>flash</h1>
    </div>
    <div :class="['seckill-timeline', timeline_fixed && 'fixed']">
      <div class="inner-timeline w">
        <ul class="timeline-list">
          <li
            v-for="(timeLine, index) in timeLines"
            :key="index"
            :class="['timeline-item', , timeLine.active && 'active']"
            @click="handleClickTimeLine(index, timeLine)"
          >
            <a href="javascript:;" class="main-timeline-item">
              <div class="timeline-wrap">
                <div class="line-timeline"><i>{{ timeLine.time_text }}:00</i></div>
                <div class="next-timeline"><i>{{ timeLine.distance_time === 0 ? 'Are snapping up' : 'Is about to begin' }}</i></div>
                <div class="time-timeline">
                  <b class="b-text">{{ timeLine.distance_time === 0 ? 'Are snapping up' : 'Is about to begin' }}</b>
                  <b class="b-time">{{ timeLine.distance_time === 0 ? (onlyOne ? 'From the end of the' : 'From the next round of') : 'From the start' }}<i>{{ timesText[index].hours }}</i>:<i>{{ timesText[index].minutes }}</i>:<i>{{ timesText[index].seconds }}</i></b>
                </div>
              </div>
            </a>
          </li>
          <template v-if="timeLines.length < 5">
            <li
              v-for="i in (5 - timeLines.length)"
              :key="i + '_pla'"
              class="timeline-item"
            >
              <a href="javascript:;" class="main-timeline-item">
                <div class="timeline-wrap">
                  <div class="line-timeline"></div>
                  <div class="next-timeline"></div>
                  <div class="time-timeline">
                    <b class="b-text"></b>
                    <b class="b-time"></b>
                  </div>
                </div>
              </a>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <div v-if="timeline_fixed" class="seckill-timeline-place"></div>
    <div class="seckill-goods w">
      <ul class="seckill-list">
        <li v-for="(goods, index) in goodsList.data" :key="index" class="goods-item">
          <a :href="'/goods/' + goods.goods_id" class="link-goods-item">
            <img class="goods-img" :src="goods.goods_image" :alt="goods.goods_name">
            <h4 class="goods-name">{{ goods.goods_name }}</h4>
          </a>
          <div :class="['info-goods-item',countProgress(goods)===100 && 'end', !seckillIsStart && 'no-start']">
            <div class="goods-price">
              <div class="goods-prices">
                <span class="price">
                  <em>￥</em>{{ goods.seckill_price | unitPrice }}
                </span>
                <span class="goods-org-price">{{ goods.original_price | unitPrice }}</span>
              </div>
              <span v-if="seckillIsStart" class="progress">
                <i class="progress-txt">sold{{ countProgress(goods) }}%</i>
                <i class="progress-inner">
                  <b class="progress-completed" :style="{width: countProgress(goods) + '%'}"></b>
                </i>
              </span>
              <span v-else class="tip">Flash sale alert</span>
            </div>

            <a v-if="countProgress(goods)==100"
              href="javascript:;"
              class="buy-btn"
              target="_blank"
            >{{ seckillIsStart ? 'Has been sold out' : 'Is about to begin' }}</a>
            <a v-else
              :href="'/goods/' + goods.goods_id"
              class="buy-btn"
              target="_blank"
            >{{ seckillIsStart ? 'Snapped up immediately' : 'Is about to begin' }}</a>
          </div>
        </li>
      </ul>
      <el-pagination
        v-if="goodsList"
        @current-change="handleCurrentPageChange"
        :current-page.sync="goodsList.page_no"
        :page-size="goodsList.page_size"
        layout="total, prev, pager, next"
        :total="goodsList.data_total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Pagination } from 'element-ui'
  Vue.use(Pagination)
  import * as API_Promotions from '@/api/promotions'
  import { Foundation } from '@/ui-utils'
  export default {
    name: 'seckill',
    head() {
      return {
        title: `flash-${this.site.title}`
      }
    },
    data() {
      return {
        timeline_fixed: false,
        timeLines: '',
        times: [],
        timesText: [],
        goodsList: '',
        params: {
          page_no: 1,
          page_size: 20
        },
        onlyOne: false
      }
    },
    computed: {
      /** Gets whether the currently selected time node is started*/
      seckillIsStart() {
        return this.timeLines.filter(item => item.active)[0].distance_time === 0
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.timeLineFixedStatus()
        window.addEventListener('scroll', this.timeLineFixedStatus)
      })
      this.GET_TimeLine()
    },
    methods: {
      /** The current page number changed*/
      handleCurrentPageChange(page_no) {
        this.params.page_no = page_no
        this.GET_TimeLineGoods()
      },
      /** Whether the time range box floats*/
      timeLineFixedStatus() {
        // Gets the current position of the scroll bar
        const bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop
        // Whether fixed to the top
        this.timeline_fixed = bodyScrollTop >= 31 + 140 + 90
      },
      /** Time period selected*/
      handleClickTimeLine(timeLineIndex, timeLine) {
        const { timeLines } = this
        this.MixinScrollToTop(31 + 140 + 90)
        timeLines.map((item, index) => {
          item.active = index === timeLineIndex
          return item
        })
        this.params.page_no = 1
        this.params.range_time = timeLine.time_text
        this.GET_TimeLineGoods()
      },
      /** Start the countdown*/
      startCountDown() {
        this.interval = setInterval(() => {
          const { times, timesText } = this
          for (let i = 0; i < times.length; i ++) {
            if (i === 0 && times[i] === 0) {
              clearInterval(this.interval)
              this.$alert('The new flash sale has started, please confirm to check！', function () {
                location.reload()
              })
              break
            }
            times[i] -= 1
            const timeText = Foundation.countTimeDown(times[i])
            this.$set(this.timesText, i, Foundation.countTimeDown(times[i]))
          }
          this.$set(this, 'times', times)
        }, 1000)
      },
      /** Calculate percentage of sales*/
      countProgress(goods) {
        if (!this.seckillIsStart) return 0
        return (goods.sold_num / (goods.sold_num + goods.sold_quantity) * 100).toFixed(0)
      },
      /** Get the timeline*/
      GET_TimeLine() {
        API_Promotions.getSeckillTimeLine().then(response => {
          if (!response || !response.length) {
            this.$alert('There are no flash sales going on yet, so look elsewhere！', () => {
              this.$router.push({ path: '/' })
            })
            return false
          }
          response = response.sort((x, y) => (Number(x.time_text) - Number(y.time_text)))
          response = response.slice(0, 5)
          this.params.range_time = response[0].time_text
          this.GET_TimeLineGoods()
          const times = []
          const timesText = []
          const onlyOne = response.length === 1
          this.onlyOne = onlyOne
          response.map((item, index) => {
            item.active = index === 0
            if (item.distance_time === 0 && index === 0) {
              if (onlyOne) {
                times.push(Foundation.theNextDayTime())
              } else {
                times.push(response[1].distance_time)
              }
            } else {
              times.push(item.distance_time)
            }
            timesText.push({ hours: '00', minutes: '00', seconds: '00' })
            return item
          })
          this.times = times
          this.timesText = timesText
          this.timeLines = response
          this.startCountDown()
        })
      },
      /** Get the item at the corresponding time*/
      GET_TimeLineGoods() {
        API_Promotions.getSeckillTimeGoods(this.params).then(response => {
          this.$set(this, 'goodsList', response)
        })
      }
    },
    destroyed() {
      window.removeEventListener('scroll', this.timeLineFixedStatus)
      if (this.interval) clearInterval(this.interval)
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../assets/styles/color";
  .seckill-container {
    background-color: #f6f6f6;
    position: relative;
    overflow: hidden;
  }
  .seckill-title {
    position: absolute;
    top: 0;
    width: 100%;
    height: 300px;
    line-height: 90px;
    background: url("../assets/images/background-seckill-header.png") no-repeat top;
    text-align: center;
    h1 {
      font-size: 60px;
      font-family: cursive;
    }
  }
  .seckill-timeline {
    width: 100%;
    height: 60px;
    margin-top: 90px;
    margin-bottom: 10px;
    &.fixed {
      position: fixed;
      z-index: 99;
      top: 0;
      margin-top: 0;
      .inner-timeline {
        box-shadow: 0 5px 20px -8px #4e4e4e;
      }
      .timeline-list {
        margin-left: 0;
      }
      .timeline-item.active .main-timeline-item {
        width: 274px;
      }
      .main-timeline-item {
        width: 234px;
        margin-left: 0;
        &::before, &::after {
          content: none;
        }
        .timeline-wrap {
          margin: 0;
        }
      }
    }
    .inner-timeline {
      height: 100%;
    }
    .timeline-list {
      width: 1252px;
      margin-left: 60px;
      height: 60px;
      transition: all .3s;
    }
    .timeline-item {
      float: left;
      line-height: 60px;
      text-align: center;
      font-size: 18px;
      &:hover:not(.active) .line-timeline { color: $color-main }
    }
    .timeline-item.active .main-timeline-item {
      width: 354px;
      &::before {
        border-color: transparent transparent $color-main;
      }
      &::after {
        border-color: $color-main transparent transparent;
      }
      .timeline-wrap {
        color: #fff;
        background-color: $color-main;
      }
    }
    @mixin before_after {
      display: block;
      content: "";
      width: 0;
      height: 0;
      border-style: solid;
      position: absolute;
      top: 0;
      zoom: 1;
    }
    .main-timeline-item {
      position: relative;
      display: block;
      overflow: hidden;
      color: #000;
      width: 289px;
      height: 60px;
      margin-left: -60px;
      transition: all .3s;
      outline: none;
      &::before, &::after {
        @include before_after;
      }
      &::before {
        left: 0;
        border-width: 0 0 60px 60px;
        border-color: transparent transparent #fff;
      }
      &::after {
        right: 0;
        border-width: 60px 60px 0 0;
        border-color: #fff transparent transparent;
      }
    }
    .timeline-wrap {
      background: #fff;
      margin: 0 60px;
      height: 60px;
      overflow: hidden;
      text-align: center;
      font-size: 0;
    }
    .line-timeline {
      height: 60px;
      margin-right: 10px;
      overflow: hidden;
      display: inline-block;
      i {
        vertical-align: middle;
        font-weight: 700;
        font-size: 14px;
        margin-left: 10px;
      }
    }
    .next-timeline {
      overflow: hidden;
      display: inline-block;
      i {
        border: 1px solid #666;
        padding: 0 14px;
        vertical-align: middle;
        height: 26px;
        line-height: 25px;
        color: #666;
        -moz-border-radius: 22px;
        border-radius: 22px;
        font-size: 12px;
        display: inline-block;
      }
    }
    .timeline-item.active {
      .line-timeline i { font-size: 20px }
      .next-timeline { display: none }
      .time-timeline {
        display: inline-block;
      }
    }
    .time-timeline {
      font-size: 14px;
      display: none;
      height: 60px;
      overflow: hidden;
      text-align: left;
      .b-text {
        display: block;
        margin-top: 15px;
        line-height: 1;
      }
      .b-time {
        display: block;
        margin-top: 5px;
        line-height: 1;
      }
    }
  }
  .seckill-timeline-place {
    display: block;
    height: 60px;
    margin-top: 100px;
  }
  .seckill-list {
    overflow: hidden;
  }
  /deep/ .el-pagination {
    text-align: right;
    button, li { background-color: #f6f6f6 }
  }
  .goods-item {
    float: left;
    margin-bottom: 20px;
    margin-right: 10px;
    height: 390px;
    position: relative;
    background: #fff;
    &:nth-child(4n) {
      margin-right: 0;
    }
    .link-goods-item {
      display: block;
      position: relative;
      width: 235px;
      padding: 20px 30px 0;
      background: #fff;
      text-decoration: none;
      overflow: hidden;
      text-align: center;
      &:hover .goods-img { transform: translateY(-13px) }
      .goods-img {
        width: 100%;
        height: 230px;
        transition: transform .3s;
      }
      .goods-name {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        height: 40px;
        color: #333;
        font-size: 14px;
        margin: 20px 0;
        font-weight: 400;
        text-align: left;
        line-height: 20px;
        overflow: hidden;
      }
    }
    .info-goods-item {
      display: block;
      position: absolute;
      width: 293px;
      overflow: hidden;
      text-align: left;
      border: 1px solid $color-main;
      bottom: 0;
      left: 0;
      .goods-price {
        padding: 12px 0 5px 11px;
        display: block;
        position: relative;
        line-height: 1;
        width: 193px;
        .goods-prices{
          overflow: hidden;
        }
        .price {
          font-size: 24px;
          font-family: arial;
          margin-right: 2px;
          line-height: 1;
          display: inline-block;
          min-width: 50px;
          float: left;
          em {
            font-size: 12px;
          }
        }
        .goods-org-price {
          font-size: 14px;
          color: #82848a;
          text-decoration: line-through;
          float: left;
          padding-top: 8px;
        }
        .progress {
          display: block;
          margin-top: 5px;
          .progress-inner {
            width: 88px;
            height: 8px;
            background: #b8b8b8;
            display: inline-block;
            position: relative;
            overflow: hidden;
            margin-left: 5px;
          }
          .progress-completed {
            background: $color-main;
            width: 0;
            position: absolute;
            left: 0;
            top: 0;
            height: 11px;
          }
        }
        .tip {
          display: block;
          margin-top: 5px;
          width: 150px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #999
        }
      }
      .buy-btn {
        color: #fff;
        line-height: 62px;
        font-size: 16px;
        display: block;
        top: 0;
        right: 0;
        width: 89px;
        text-align: center;
        position: absolute;
        background: $color-main;
      }
      &.end {
        border-color: #666;
        .buy-btn { background: #666 }
        .price{ color:#666 !important;}
        .progress-completed{ background: #666 !important;}
      }
      &.no-start {
        border-color: #443630;
        .buy-btn { background: #443630 }
        .progress {
          display: none;
        }
      }
    }
  }
</style>
