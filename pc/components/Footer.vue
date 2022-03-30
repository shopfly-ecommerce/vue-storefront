<template>
  <div id="footer">
    <span class="clr"></span>
    <div class="help-center-footer">
      <div class="w">
        <dl class="fore1">
          <dt>购物指南</dt>
          <dd><a target="_blank" href="/help/102">网站使用条款</a></dd>
          <dd><a target="_blank" href="/help/103">购物流程</a></dd>
          <dd><a target="_blank" href="/help/104">常见问题</a></dd>
        </dl>

        <dl class="fore2">
          <dt>配送方式</dt>
          <dd><a target="_blank" href="/help/106">配送方式</a></dd>
          <dd><a target="_blank" href="/help/105">验货</a></dd>
        </dl>

        <dl class="fore3">
          <dt>支付方式</dt>
          <dd><a target="_blank" href="/help/108">在线支付</a></dd>
          <dd><a target="_blank" href="/help/109">货到付款</a></dd>
        </dl>

        <dl class="fore4">
          <dt>售后服务</dt>
          <dd><a target="_blank" href="/help/110">售后服务</a></dd>
          <dd><a target="_blank" href="/help/111">免责条款</a></dd>
          <dd><a target="_blank" href="/help/112">商品退换货保障</a></dd>
        </dl>

        <dl class="fore5">
          <dt>关于网站</dt>
          <dd><a target="_blank" href="/help/98">关于我们</a></dd>
          <dd><a target="_blank" href="/help/99">联系我们</a></dd>
          <dd><a target="_blank" href="/help/101">业务合作</a></dd>
        </dl>
        <span class="clr"></span>
      </div>
    </div>
    <div class="link-footer">
      <div class="w">
        <a href="/">首页</a>
        | <nuxt-link to="/member">会员中心</nuxt-link>
        | <a href="/shop/apply" target="_blank"></a>
        | <a href="/help/100" target="_blank">关于网站</a>
        | <a href="/help/98" target="_blank">关于我们</a>
        | <a href="/help/99" target="_blank">联系我们</a>
        | <a href="https://www.javamall.com.cn" title="JAVA B2B2C网店系统">网店系统</a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'EnFooter'
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../assets/styles/color";
  /* Footer */
  #footer {
    background-color: #f5f6f5;
    a { color: #666 }
    a:hover { color: $color-main }
    .help-center-footer {
      border-bottom: solid 1px #eaeaea;
      padding: 20px 0;
      dl {
        box-sizing: border-box;
        width: 20%;
        float: left;
        padding-left: 75px;
        line-height: 22px;
      }
      dt {
        padding-bottom: 6px;
        font-weight: 700;
        font-size: 14px;
        color: #777;
        height: 22px;
      }
      dd {
        font-size: 12px;
        color: #666;
        height: 22px;
        overflow: hidden;
      }
    }
    .link-footer {
      text-align: center;
      height: 40px;
      line-height: 40px;
    }
  }
</style>
