<template>
  <div id="footer">
    <span class="clr"></span>
    <div class="help-center-footer">
      <div class="w">
        <dl class="fore1">
          <dt>Shopping guide</dt>
          <dd><a target="_blank" href="/help/102">Terms of Use</a></dd>
          <dd><a target="_blank" href="/help/103">Shopping process</a></dd>
          <dd><a target="_blank" href="/help/104">Q&A</a></dd>
        </dl>

        <dl class="fore2">
          <dt>Shipping type</dt>
          <dd><a target="_blank" href="/help/106">Shipping type</a></dd>
          <dd><a target="_blank" href="/help/105">The inspection</a></dd>
        </dl>

        <dl class="fore3">
          <dt>Method of payment</dt>
          <dd><a target="_blank" href="/help/108">Online payment</a></dd>
          <dd><a target="_blank" href="/help/109">Cash on delivery</a></dd>
        </dl>

        <dl class="fore4">
          <dt>After-sales service</dt>
          <dd><a target="_blank" href="/help/110">After-sales service</a></dd>
          <dd><a target="_blank" href="/help/111">disclaimer</a></dd>
          <dd><a target="_blank" href="/help/112">Guarantee of return and exchange of goods</a></dd>
        </dl>

        <dl class="fore5">
          <dt>On the website</dt>
          <dd><a target="_blank" href="/help/98">About us</a></dd>
          <dd><a target="_blank" href="/help/99">Contact us</a></dd>
          <dd><a target="_blank" href="/help/101">Business cooperation</a></dd>
        </dl>
        <span class="clr"></span>
      </div>
    </div>
    <div class="link-footer">
      <div class="w">
        <a href="/">Home</a>
        | <nuxt-link to="/member">Your Account</nuxt-link>
        | <a href="/shop/apply" target="_blank"></a>
        | <a href="/help/100" target="_blank">On the website</a>
        | <a href="/help/98" target="_blank">About us</a>
        | <a href="/help/99" target="_blank">Contact us</a>
        | <a href="https://www.javamall.com.cn" title="JAVA B2B2COnline system">Online system</a>
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
