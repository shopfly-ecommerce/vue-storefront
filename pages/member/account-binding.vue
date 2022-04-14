<template>
  <div id="account-binding">
    <el-alert type="info" title="" :closable="false">
      <h2>What are the benefits of binding third-party logins？</h2>
      <p>1. You can quickly log into our site from a third party. </p>
      <p>2. Avoid the embarrassing situation of not remembering the password.</p>
    </el-alert>
    <div class="">
      <div class="bind-item">
        <div class="fore1">
          <strong>tencentQQ</strong>
        </div>
        <div class="fore2">
          <span class="ftx-03"><img src="../../assets/images/icon-bind-qq.png"></span>
          <span class="ftx-01">&nbsp;The bindingQQaccount</span>
          <span :style="{color: bind['QQ'] ? '#67C23A' : '#ff6c00'}">&nbsp;{{ bind['QQ'] ? 'Is binding' : 'unbounded' }}</span>
        </div>
        <div class="fore3">
          <a class="ftx-05" v-if="bind['QQ']" href="javascript:;" @click="unbindConnect('QQ')">unbundling</a>
          <a class="ftx-05" v-else href="javascript:;" @click="bindConnect('QQ')">The binding</a>
        </div>
      </div>
      <div class="bind-item">
        <div class="fore1">
          <strong>Tencent WeChat</strong>
        </div>
        <div class="fore2">
          <span class="ftx-03"><img src="../../assets/images/icon-bind-weixin.png"></span>
          <span class="ftx-01">&nbsp;Bind wechat account</span>
          <span :style="{color: bind['WECHAT'] ? '#67C23A' : '#ff6c00'}">&nbsp;{{ bind['WECHAT'] ? 'Is binding' : 'unbounded' }}</span>
        </div>
        <div class="fore3">
          <a class="ftx-05" v-if="bind['WECHAT']" href="javascript:;" @click="unbindConnect('WECHAT')">unbundling</a>
          <a class="ftx-05" v-else href="javascript:;" @click="bindConnect('WECHAT')">The binding</a>
        </div>
      </div>
      <div class="bind-item">
        <div class="fore1">
          <strong>Sina weibo</strong>
        </div>
        <div class="fore2">
          <span class="ftx-03"><img src="../../assets/images/icon-bind-sina.png"></span>
          <span class="ftx-01">&nbsp;Bind the weibo account</span>
          <span :style="{color: bind['WEIBO'] ? '#67C23A' : '#ff6c00'}">&nbsp;{{ bind['WEIBO'] ? 'Is binding' : 'unbounded' }}</span>
        </div>
        <div class="fore3">
          <a class="ftx-05" v-if="bind['WEIBO']" href="javascript:;" @click="unbindConnect('WEIBO')">unbundling</a>
          <a class="ftx-05" v-else href="javascript:;" @click="bindConnect('WEIBO')">The binding</a>
        </div>
      </div>
      <div class="bind-item">
        <div class="fore1">
          <strong>Alipay</strong>
        </div>
        <div class="fore2">
          <span class="ftx-03"><img src="../../assets/images/icon-bind-alipay.png"></span>
          <span class="ftx-01">&nbsp;Bind Alipay</span>
          <span :style="{color: bind['ALIPAY'] ? '#67C23A' : '#ff6c00'}">&nbsp;{{ bind['ALIPAY'] ? 'Is binding' : 'unbounded' }}</span>
        </div>
        <div class="fore3">
          <a class="ftx-05" v-if="bind['ALIPAY']" href="javascript:;" @click="unbindConnect('ALIPAY')">unbundling</a>
          <a class="ftx-05" v-else href="javascript:;" @click="bindConnect('ALIPAY')">The binding</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as API_Connect from '@/api/connect'
  export default {
    name: 'account-binding',
    head() {
      return {
        title: `Account binding-${this.site.title}`
      }
    },
    data() {
      return {
        bind: ''
      }
    },
    mounted() {
      this.GET_Connects()
    },
    methods: {
      getConnectUrl: API_Connect.getLogindConnectUrl,
      /** unbundling*/
      unbindConnect(type) {
        this.$confirm('Are you sure you want to unbind？', () => {
          API_Connect.unbindConnect(type).then(() => {
            this.$message.success('Unbundling success！')
            this.GET_Connects()
          })
        })
      },
      /** A binding*/
      bindConnect(type) {
        API_Connect.getLogindConnectUrl(type).then(response => {
          location.href = response
        })
      },
      /** Getting the binding list*/
      GET_Connects() {
        API_Connect.getConnectList().then(response => {
          const bind = {}
          response.forEach(item => {
            bind[item.union_type] = item.is_bind
          })
          this.bind = bind
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/styles/color";
  .el-alert {
    h2 { margin: 20px 0 }
    p { margin-bottom: 10px }
  }
  .bind-item {
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
    padding: 30px 0;
    .fore1 {
      font-family: Microsoft jas black;
      font-size: 18px;
      padding-left: 25px;
      text-align: left;
      width: 130px;
    }
    .fore2 {
      border-left: 1px solid #e6e6e6;
      height: auto;
      line-height: 32px;
      padding: 4px 0 4px 15px;
      width: 200px;
    }
    .fore3 {
      text-align: center;
      width: 140px;
    }
    .ftx-05 {
      color: $color-href;
      &:hover { color: $color-main }
    }
    &:last-child {
      border-bottom: none;
    }
  }
</style>
