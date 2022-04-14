<template>
  <div id="account-security">
    <div class="member-nav">
      <ul class="member-nav-list">
        <li class="active">
          <a href="./account-safe">Security</a>
        </li>
      </ul>
    </div>
    <div class="safe-title">
      <el-alert
        title="Security reminder"
        type="warning"
        :closable="false"
        show-icon
      >
        <p>It is recommended that you start all security Settings to ensure the security of accounts and funds.</p>
        <p>Make sure you are logged in{{ site.site_name }}The url<a href="http://www.javamall.com.cn" target="_blank">http://www.javamall.com.cn</a>, pay attention to guard against entering phishing websites, do not trust a variety of instant messaging tools to send goods or payment links, beware of online fraud.</p>
        <p>You are advised to install antivirus software and update software patches such as the operating system regularly to ensure account and transaction security.</p>
      </el-alert>
    </div>
    <div class="safe-item">
      <div class="fore1"><strong>Password</strong></div>
      <div class="fore2">
        <span v-if="!user.mobile">Internet accounts may be stolen. You are advised to bind your mobile phone number first.</span>
        <span v-else>Your Internet account may be stolen. You are advised to change your password periodically to protect your account security.</span>
      </div>
      <div class="fore3">
        <nuxt-link v-if="!user.mobile" to="/member/bind-mobile">The binding</nuxt-link>
        <nuxt-link v-else to="/member/change-password">edit</nuxt-link>
      </div>
    </div>
    <div class="safe-item">
      <div class="fore1"><strong>Phone verification</strong></div>
      <div class="fore2">
        <span>Your verified mobile phone：</span>
        <strong v-if="!user.mobile">Unbound phone</strong>
        <strong v-else>{{ user.mobile | secrecyMobile }}</strong>&nbsp;&nbsp;
        <span>If lost or out of use, please replace immediately.</span><span style="color:#cc0000;">Avoid account theft</span>
      </div>
      <div class="fore3">
        <nuxt-link v-if="user.mobile" to="/member/change-mobile">edit</nuxt-link>
        <nuxt-link v-else to="/member/bind-mobile">The binding</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'account-safe',
    head() {
      return {
        title: `Security-${this.site.title}`
      }
    },
    computed: {
      ...mapGetters({
        user: 'user',
        site: 'site'
      })
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/styles/color";
  .safe-title {
    margin-top: 10px;
    p { margin-top: 3px }
    a { color: $color-href }
    a:hover { color: $color-main }
  }
  .safe-item {
    display: block;
    padding: 30px 0;
    border-bottom: 1px solid #e6e6e6;
    &:after {
      content: ".";
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
    }
    /deep/ .fore1, .fore2, .fore3 {
      float: left;
      height: 32px;
      line-height: 32px;
    }
    .fore1 {
      width: 125px;
      text-align: left;
      font-family: \5FAE\8F6F\96C5\9ED1;
      font-size: 18px;
      padding-left: 25px;
    }
    .fore2 {
      border-left: 1px solid #E6E6E6;
      width: 450px;
      height: auto;
      line-height: 24px;
      padding: 4px 0 4px 15px;
    }
    .fore3 {
      text-align: center;
      width: 140px;
    }
  }
</style>
