<template>
  <div id="account-binding">
    <el-alert type="info" title="" :closable="false">
      <h2>绑定第三方登录有什么好处？</h2>
      <p>1. 您可以快速地从第三方登录我们的站点。 </p>
      <p>2. 避免了记不住密码的尴尬局面。</p>
    </el-alert>
    <div class="">
      <div class="bind-item">
        <div class="fore1">
          <strong>腾讯QQ</strong>
        </div>
        <div class="fore2">
          <span class="ftx-03"><img src="../../assets/images/icon-bind-qq.png"></span>
          <span class="ftx-01">&nbsp;绑定QQ帐号</span>
          <span :style="{color: bind['QQ'] ? '#67C23A' : '#ff6c00'}">&nbsp;{{ bind['QQ'] ? '已绑定' : '未绑定' }}</span>
        </div>
        <div class="fore3">
          <a class="ftx-05" v-if="bind['QQ']" href="javascript:;" @click="unbindConnect('QQ')">解绑</a>
          <a class="ftx-05" v-else href="javascript:;" @click="bindConnect('QQ')">绑定</a>
        </div>
      </div>
      <div class="bind-item">
        <div class="fore1">
          <strong>腾讯微信</strong>
        </div>
        <div class="fore2">
          <span class="ftx-03"><img src="../../assets/images/icon-bind-weixin.png"></span>
          <span class="ftx-01">&nbsp;绑定微信帐号</span>
          <span :style="{color: bind['WECHAT'] ? '#67C23A' : '#ff6c00'}">&nbsp;{{ bind['WECHAT'] ? '已绑定' : '未绑定' }}</span>
        </div>
        <div class="fore3">
          <a class="ftx-05" v-if="bind['WECHAT']" href="javascript:;" @click="unbindConnect('WECHAT')">解绑</a>
          <a class="ftx-05" v-else href="javascript:;" @click="bindConnect('WECHAT')">绑定</a>
        </div>
      </div>
      <div class="bind-item">
        <div class="fore1">
          <strong>新浪微博</strong>
        </div>
        <div class="fore2">
          <span class="ftx-03"><img src="../../assets/images/icon-bind-sina.png"></span>
          <span class="ftx-01">&nbsp;绑定微博帐号</span>
          <span :style="{color: bind['WEIBO'] ? '#67C23A' : '#ff6c00'}">&nbsp;{{ bind['WEIBO'] ? '已绑定' : '未绑定' }}</span>
        </div>
        <div class="fore3">
          <a class="ftx-05" v-if="bind['WEIBO']" href="javascript:;" @click="unbindConnect('WEIBO')">解绑</a>
          <a class="ftx-05" v-else href="javascript:;" @click="bindConnect('WEIBO')">绑定</a>
        </div>
      </div>
      <div class="bind-item">
        <div class="fore1">
          <strong>支付宝</strong>
        </div>
        <div class="fore2">
          <span class="ftx-03"><img src="../../assets/images/icon-bind-alipay.png"></span>
          <span class="ftx-01">&nbsp;绑定支付宝</span>
          <span :style="{color: bind['ALIPAY'] ? '#67C23A' : '#ff6c00'}">&nbsp;{{ bind['ALIPAY'] ? '已绑定' : '未绑定' }}</span>
        </div>
        <div class="fore3">
          <a class="ftx-05" v-if="bind['ALIPAY']" href="javascript:;" @click="unbindConnect('ALIPAY')">解绑</a>
          <a class="ftx-05" v-else href="javascript:;" @click="bindConnect('ALIPAY')">绑定</a>
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
        title: `账号绑定-${this.site.title}`
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
      /** 解绑 */
      unbindConnect(type) {
        this.$confirm('确定要解绑吗？', () => {
          API_Connect.unbindConnect(type).then(() => {
            this.$message.success('解绑成功！')
            this.GET_Connects()
          })
        })
      },
      /** 发起绑定 */
      bindConnect(type) {
        API_Connect.getLogindConnectUrl(type).then(response => {
          location.href = response
        })
      },
      /** 获取绑定列表 */
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
      font-family: 微软雅黑;
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
