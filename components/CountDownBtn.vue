<template>
  <el-button :disabled="disabled" @click.stop="handleClicked" class="count-down-btn">{{ message || initTip }}</el-button>
</template>

<script>
  export default {
    name: 'EnCountDownBtn',
    props: {
      /** You need to count down the time*/
      time: {
        type: Number,
        default: 60
      },
      /** Initialization prompt*/
      initTip: {
        type: String,
        default: 'Get verification code'
      },
      /** A reminder that the countdown is over*/
      endTip: {
        type: String,
        default: 'To obtain'
      },
      /** The prefix of the number of seconds after the countdown begins*/
      preTip: {
        type: String,
        default: ''
      },
      /** The suffix for the number of seconds after the countdown begins*/
      sufTip: {
        type: String,
        default: 'Retrieve after seconds'
      },
      /** An asynchronous method that starts the countdown after the callback*/
      start:{
        type: Function,
        required: true
      }
    },
    data() {
      return {
        count_time: this.time,
        disabled: false,
        message: '',
        interval: null
      }
    },
    methods: {
      handleClicked() {
        this.start().then(() => this.startCountDown()).catch(() => {})
      },
      startCountDown() {
        this.disabled = true
        this.interval = setInterval(() => {
          if (this.count_time > 1) {
            this.count_time--
            this.message = this.count_time + this.sufTip
          } else {
            clearInterval(this.interval)
            this.message = 'To resend'
            this.count_time = this.time
            this.disabled = false
            this.$emit('end')
          }
        }, 1000)
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .count-down-btn {
    &.is-disabled {
      color: #c0c4cc;
      cursor: not-allowed;
      background-image: none;
      background-color: #fff;
      border-color: transparent;
    }
  }
</style>
