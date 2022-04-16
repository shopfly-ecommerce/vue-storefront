<template>
  <div v-if="time !== false && goodsList && goodsList.length" class="seckill-container w">
    <div class="seckill-hd">
      <a href="/seckill" class="seckill-hd-a" target="_blank">
        <div class="sk-title">flash</div>
        <div class="sk-sub-title">FLASH DEALS</div>
        <i class="iconfont ea-icon-lightning sk-icon"></i>
        <div class="sk-desc">
          {{ timeLine.distance_time === 0 ? (onlyOne ? 'Were still close to the end of this cycle' : 'Theres still time for the next round') : 'From the start' }}
        </div>
        <div class="sk-time">
          <div class="time-item"><span class="time-text">{{ times.hours }}</span></div>
          <div class="time-item"><span class="time-text">{{ times.minutes }}</span></div>
          <div class="time-item"><span class="time-text">{{ times.seconds }}</span></div>
        </div>
      </a>
    </div>
    <div class="seckill-bd">
      <no-ssr>
        <swiper :options="swiperOptions">
          <swiper-slide v-for="(goods, index) in goodsList" :key="index" class="goods-item">
            <a :href="'/goods/' + goods.goods_id" class="goods-item-a" target="_blank">
              <div class="goods-item-img">
                <img :src="goods.goods_image" :alt="goods.goods_name">
              </div>
              <p class="goods-item-name">{{ goods.goods_name }}</p>
              <div class="goods-item-price">
                <span class="goods-item-price-new">
                  <i>¥</i>
                  <span>{{ goods.seckill_price | unitPrice }}</span>
                </span>
                <span class="goods-item-price-origin">
                  <i>¥</i><span>{{ goods.original_price | unitPrice }}</span>
                </span>
              </div>
            </a>
          </swiper-slide>
          <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
          <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
        </swiper>
      </no-ssr>
    </div>
  </div>
</template>

<script>
  import * as API_Promotions from '@/api/promotions'
  import { Foundation } from '@/ui-utils'
  export default {
    name: 'index-seckill',
    data() {
      return {
        // time
        time: false,
        // List of goods
        goodsList: '',
        // time
        times: {
          hours: '00',
          minutes: '00',
          seconds: '00'
        },
        // Is there only one show
        onlyOne: false,
        // Time information for the current scene
        timeLine: '',
        // Swiper configuration
        swiperOptions: {
          autoplay: false,
          simulateTouch: false,
          slidesPerView: 5,
          slidesPerGroup: 5,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }
        }
      }
    },
    mounted() {
      this.GET_TimeLine()
    },
    methods: {
      /** Start the countdown*/
      startCountDown() {
        this.interval = setInterval(() => {
          let { time } = this;
          if (time <= 0) {
            clearInterval(this.interval);
            this.$alert(this.onlyOne ? 'This round of flash sale has ended！' : 'The next flash sale has already started！Please confirm and check.', function () {
              location.reload()
            });
            return false
          }
          time -= 1;
          const timeText = Foundation.countTimeDown(time);
          this.$set(this, 'times', Foundation.countTimeDown(time));
          this.$set(this, 'time', time)
        }, 1000)
      },
      /** Get time period*/
      GET_TimeLine() {
        API_Promotions.getSeckillTimeLine().then(response => {
          if (!response || !response.length) {
            return
          }
          response = response.sort((x, y) => (Number(x.time_text) - Number(y.time_text)));
          const onlyOne = response.length === 1;
          this.onlyOne = onlyOne;
          this.time = response[0].distance_time !== 0 ? response[0].distance_time : onlyOne ? Foundation.theNextDayTime() : response[1].distance_time;
          this.startCountDown();
          this.timeLine = response[0];
          this.GET_GoodsList(response[0].time_text)
        })
      },
      /** Get a list of items*/
      GET_GoodsList(range_time) {
        API_Promotions.getSeckillTimeGoods({ range_time }).then(response => {
          this.goodsList = response.data
        })
      }
    },
    destroyed() {
      this.interval && clearInterval(this.interval)
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/styles/color";
  .seckill-container {
    height: 275px;
    margin: 30px auto;
    background-color: #fff;
    overflow: hidden;
  }
  .seckill-hd {
    position: relative;
    float: left;
    width: 190px;
    height: 275px;
    background: $color-main;
    color: #fff;
    .seckill-hd-a {
      display: block;
      width: 100%;
      height: 100%;
      color: #fff;
    }
    .sk-title  {
      position: absolute;
      left: 0;
      width: 100%;
      text-align: center;
      top: 42px;
      font-size: 34px;
      color: #eee;
    }
    .sk-sub-title {
      position: absolute;
      left: 0;
      width: 100%;
      text-align: center;
      top: 90px;
      color: rgba(255, 255, 255, 0.5);
      font-size: 20px;
    }
    .sk-icon {
      position: absolute;
      left: 75px;
      top: 126px;
      display: block;
      font-size: 30px;
    }
    .sk-desc {
      position: absolute;
      left: 0;
      width: 100%;
      text-align: center;
      top: 170px;
      font-size: 16px;
    }
    .sk-time {
      position: absolute;
      top: 212px;
      left: 25px;
      height: 40px;
    }
    .time-item {
      position: relative;
      float: left;
      width: 40px;
      height: 40px;
      text-align: center;
      background-color: #2f3430;
      margin-right: 11px;
      span {
        position: relative;
        line-height: 40px;
        font-weight: bold;
        font-size: 20px;
      }
      &:after {
        content: ':';
        position: absolute;
        top: 11px;
        right: -9px;
        color: #ffffff;
        font-size: 16px;
      }
      &:last-child {
        margin-right: 0;
        &:after {
          content: none;
        }
      }
    }
  }
  .seckill-bd {
    .goods-item {
      position: relative;
      float: left;
      width: 200px;
      height: 275px;
      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        width: 1px;
        height: 275px;
        background: #f0f0f0;
      }
    }
    .goods-item-a {
      position: relative;
      display: block;
      width: 190px;
      height: 275px;
      text-align: center;
      margin: auto;
    }
    .goods-item-img {
      position: absolute;
      width: 140px;
      height: 140px;
      left: 50%;
      margin-left: -70px;
      top: 40px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .goods-item-name {
      position: absolute;
      top: 190px;
      left: 0;
      width: 160px;
      padding: 0 15px;
      line-height: 30px;
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .goods-item-price {
      position: absolute;
      left: 0px;
      top: 230px;
      width: 192px;
      height: 20px;
      padding: 1px;
      background: $color-main;
      line-height: 20px;
      i {
        margin-right: 3px;
        font-family: arial;
        font-weight: 400;
        font-size: 12px;
      }
    }
    .goods-item-price-new {
      float: left;
      width: 96px;
      height: 20px;
      text-align: center;
      color: #fff;
      font-size: 12px;
      font-weight: bold;
    }
    .goods-item-price-origin {
      float: left;
      width: 96px;
      height: 20px;
      background: #fff;
      text-align: center;
      color: #b7bcb8;
      font-size: 12px;
      text-decoration: line-through;
    }
    .swiper-button-prev, .swiper-button-next {
      width: 20px;
      height: 40px;
      background-color: rgba(0,0,0,.15);
      z-index: 20;
      background-size: 50%;
      &.swiper-button-disabled {
        pointer-events: auto;
      }
    }
  }
</style>
