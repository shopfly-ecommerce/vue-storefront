<template>
  <div class="__pay_form__">
    <h3 class="tip">支付跳转中...</h3>
  </div>
</template>

<script>
  import * as API_Trade from '@/api/trade'
  import request from '@/utils/request'
  export default {
    name: 'cashier-load-pay',
    mounted() {
      const { trade_type, sn, payment_plugin_id } = this.$route.query
      API_Trade.initiatePay(trade_type, sn, {
        client_type: 'PC',
        pay_mode: 'normal',
        payment_plugin_id
      }).then(response => {
        let $formItems = ''
        response.form_items.forEach(item => {
          $formItems += `<input name="${item.item_name}" type="hidden" value='${item.item_value}' />`
        })
        let $form = `<form action="${response.gateway_url}" method="post">${$formItems}</form>`
        document.getElementsByClassName('__pay_form__')[0].innerHTML = $form
        document.forms[0].submit()
      })
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .tip {
    text-align: center;
    font-size: 20px;
    line-height: 200px;
    font-weight: 600;
  }
</style>
