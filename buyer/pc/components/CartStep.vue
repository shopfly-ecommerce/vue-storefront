<template>
  <ul id="cart-step">
    <li :class="[step === 1 ? 'active' : '']">
      <i class="step-1"></i>
      <span></span>
      <p>我的购物车</p>
      <strong></strong>
    </li>
    <li :class="[step === 2 ? 'active' : '']">
      <i class="step-2"></i>
      <span></span>
      <p>填写核对订单信息</p>
      <strong></strong>
    </li>
    <li :class="[step === 3 ? 'active' : '']">
      <i class="step-3"></i>
      <span></span>
      <p>成功提交订单</p>
      <strong></strong>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'EnCartStep',
    props: {
      step: {
        type: Number,
        default: 1
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  #cart-step {
    width: 640px;
    li {
      display: inline-block;
      font-size: 12px;
      height: 70px;
      letter-spacing: normal;
      position: relative;
      vertical-align: top;
      word-spacing: normal;
      z-index: 1;
      text-align: center;
      width: 180px;
      float: left;
      &.active {
        .step-1 { background: url(../assets/images/icons-cart-step.jpg) no-repeat -10px -43px }
        .step-2 { background: url(../assets/images/icons-cart-step.jpg) no-repeat -53px -43px }
        .step-3 { background: url(../assets/images/icons-cart-step.jpg) no-repeat -102px -4px }
        span { background: #27a9e3 }
        p { color: #27a9e3 }
        strong {
          background-color: #27a9e3;
          border-color: #27a9e3;
          box-shadow: 0 0 0 2px rgba(0, 153, 204, 0.15);
        }
      }
    }
    i {
      height: 36px;
      width: 36px;
      display: block;
      margin-left: 70px;
    }
    span {
      width: 180px;
      height: 1px;
      display: block;
      background: #ccc;
      margin: 5px 0;
    }
    strong {
      display: block;
      position: absolute;
      width: 5px;
      height: 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
      left: 86px;
      top: 38px;
      background: #fff;
    }
    .step-1 { background: url(../assets/images/icons-cart-step.jpg) no-repeat -15px -4px }
    .step-2 { background: url(../assets/images/icons-cart-step.jpg) no-repeat -56px -4px }
    .step-3 { background: url(../assets/images/icons-cart-step.jpg) no-repeat -102px -4px }
  }
</style>
