<template>
  <div class="prom-bar-container">
    <div class="prom-type">
      <slot name="icon" class="icon-prom-type"></slot>
      <strong>{{ title }}</strong>
    </div>
    <div class="prom-time" v-if="!is_snapshot">
      距离结束
      <template v-if="day > 0">
        <span>{{ day }}</span>天
      </template>
      <span>{{ hours }}</span>:<span>{{ minutes }}</span>:<span>{{ seconds }}</span>
    </div>
  </div>
</template>

<script>
  import { Foundation } from '@/ui-utils'
  export default {
    name: 'goods-prom-bar',
    props: ['title', 'end-time'],
    data() {
      return {
        timer: null,
        day: 0,
        hours: '00',
        minutes: '00',
        seconds: '00',
        is_snapshot: this.$route.name === 'goods-snapshot'
      }
    },
    mounted() {
      !this.is_snapshot && this.contDown(this.endTime)
    },
    methods: {
      contDown(times) {
        let end_ime = times
        this.timer = setInterval(() => {
          if (end_ime <= 0) {
            clearInterval(this.timer)
            this.$emit('count-end')
          } else {
            const time = Foundation.countTimeDown(end_ime)
            this.day = parseInt(time.day)
            this.hours = time.hours
            this.minutes = time.minutes
            this.seconds = time.seconds
            end_ime--
          }
        }, 1000)
      }
    },
    destroyed() {
      this.timer && clearInterval(this.timer)
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .prom-bar-container {
    height: 32px;
    line-height: 32px;
    padding: 0 10px;
    overflow: hidden;
    zoom: 1;
    background: url("../../assets/images/background-prom-bar.png") no-repeat #e84540;
    .prom-type {
      float: left;
      strong {
        font-size: 16px;
        font-weight: 600;
        color: #fff
      }
    }
    .prom-time {
      float: right;
      font-size: 12px;
      color: #fff;
      span {
        display: inline-block;
        font-size: 14px;
        color: #fff;
        min-width: 22px;
        height: 22px;
        background: #443b3b;
        margin: 0 4px;
        line-height: 24px;
        text-align: center;
        vertical-align: middle;
      }
    }
  }
</style>
