<template>
  <div id="login">
    <en-header-other title="Welcome to login"/>
    <!-- A larger version-->
    <div class="login-content">

      <div class="login-box">
        <div class="login-form">

          <div class="login-tab">
            <ul>

              <li>
                <a href="javascript:;" >Sign in</a>
              </li>
            </ul>
          </div>
          <div class="login-interface">
            <div class="login-show account-login">
              <form class="account-form" @keyup.enter="handleLogin">
                <div class="item">
                  <label for="username">
                    <i class="iconfont ea-icon-persion"></i>
                  </label>
                  <input id="username" v-model="accountForm.username" placeholder="email">
                </div>
                <div class="item">
                  <label for="password">
                    <i class="iconfont ea-icon-password"></i>
                  </label>
                  <input id="password" v-model="accountForm.password" type="password" placeholder="Please enter your password.">
                </div>
                <div class="item">
                  <label for="validcode">
                    <i class="iconfont ea-icon-safe"></i>
                  </label>
                  <input id="validcode" v-model="accountForm.captcha" placeholder="Please enter captcha" maxlength="4">
                  <img v-if="val_code_url" class="validcode-img" :src="val_code_url" @click="handleChangeValUrl">
                </div>
                <div class="forget">
                  <span><nuxt-link :to="'/find-password' + MixinForward">Forgot password</nuxt-link></span>
                </div>
                <button class="form-sub" type="button" @click="handleLogin">Sign in</button>
              </form>
            </div>
          </div>

        </div>
      </div>


    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { RegExp } from '@/ui-utils'
  import Storage from '@/utils/storage'
  import jwt_decode from 'jwt-decode'
  import * as API_Common from '@/api/common'
  import * as API_Passport from '@/api/passport'
  import * as API_Connect from '@/api/connect'
  export default {
    name: 'login',
    layout: 'full',
    head() {
      return {
        title: `Member login-${this.site.title}`
      }
    },
    data() {
      return {
        // uuid
        uuid: Storage.getItem('uuid'),
        // Login type
        login_type: 'account',
        // Image captcha
        val_code_url: '',
        // Quick Login form
        quickForm: {
        },
        // Normal Login form
        accountForm: {
          username: '',
          password: ''
        },
        // Whether the login is trusted
        isConnect: false
      }
    },
    mounted() {
      this.handleChangeValUrl()
      const uuid_connect = Storage.getItem('uuid_connect')
      const isConnect = this.$route.query.form === 'connect' && !!uuid_connect
      this.isConnect = isConnect
      if (isConnect) {
        this.login_type = 'account'
      }
    },
    computed: {
      ...mapGetters(['site'])
    },
    methods: {

      /** Change the image verification codeURL */
      handleChangeValUrl() {
        this.val_code_url = API_Common.getValidateCodeUrl(this.uuid, 'LOGIN')
      },
      /** Log events*/
      handleLogin() {
        const _forwardMatch = this.MixinForward.match(/\?forward=(.+)/) || []
        let forward = _forwardMatch[1]
        if (!forward || forward.indexOf('/login') > -1) {
          forward = '/'
        }
        const login_type = this.login_type
        const form =  this.accountForm

        if (!form.username || !form.password || !form.captcha) {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
        }

          this.login({ login_type, form }).then(async () => {
            await this.getCartData()
            window.location.href = forward
          }).catch(this.handleChangeValUrl)

      },
      getConnectUrl: API_Connect.getConnectUrl,
      ...mapActions({
        login: 'user/loginAction',
        getCartData: 'cart/getCartDataAction',
        setAccessToken: 'user/setAccessTokenAction',
        removeAccessToken: 'user/removeAccessTokenAction',
        setRefreshToken: 'user/setRefreshTokenAction',
        removeRefreshToken: 'user/removeRefreshTokenAction',
        getUserData: 'user/getUserDataAction'
      })
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../assets/styles/color";
  .login-content{
    margin-bottom: 20px;
  }
  .login-content .prompt {
    width: 100%;
    text-align: center;
    background: #fff8f0;
    margin: 0 auto;
    padding: 10px 0;
    a { color: black }
  }
  .login-content .login-banner {
    background: #FF5E18;
    width: 100%;
    .bg-banner {
      width: 1200px;
      margin: 0 auto;
      position: relative;
      .banner-img {
        background: url(../assets/images/background-banner.jpg) no-repeat center center;
        background-size: cover;
        height: 560px;
      }
    }
  }
  .login-box {
    position: relative;
    margin: 0 auto;
    width: 400px;
    background: #ffffff;
    border: 1px solid #DDDDDD;
  }
  .login-box .login-form .tips-wapper {
    background: #fff8f0;
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
    p {
      font-size: 12px;
      color: #999;
    }
  }
  .login-box .login-form .login-tab {
    height: 60px;
    border-bottom: 1px solid #f4f4f4;
    clear: both;
    ul li {
      float: left;
      width: 100%;
      padding: 20px 0;
      text-align: center;
      font-size: 20px;
      a {
        display: block;
        height: 18px;
        width: 99%;
        color: #666;
        &:hover, &.active { color: $color-main }
        &.disabled {
          cursor: not-allowed;
          color: #ccc
        }
      }
      .tab-a { border-right: 1px solid #f4f4f4 }
    }
  }
  .login-form .login-interface .account-login { display: block }
  .login-form .login-interface .login-show form {
    width: 350px;
    margin: 25px auto;
  }
  .active { color: $color-main }
  .login-interface form .item.focus {
    border-color: #666;
    label {
      border-color: #666;
      .iconfont { color: #666 }
    }
  }
  .login-interface form .item-form-t {
    height: 30px;
    border: 0 !important;
    button {
      width: 100%;
      height: 100%;
      cursor: pointer;
      border-radius: 3px;
    }
  }
  .login-interface .quick-form .item {
    position: relative;
    width: 100%;
    height: 35px;
    margin-bottom: 10px;
    border: 1px solid #bdbdbd;
  }
  .login-interface .account-form .item {
    position: relative;
    width: 100%;
    height: 35px;
    margin-bottom: 25px;
    border: 1px solid #bdbdbd;
  }
  .validcode-img {
    position: absolute;
    top: 0;
    right: 0;
    width: 85px;
    height: 35px;
    cursor: pointer;
  }
  .login-interface form .item label {
    width: 35px;
    height: 35px;
    float: left;
    display: inline-block;
    border-right: 1px solid #bdbdbd;
  }
  .login-interface form .item .iconfont {
    display: block;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 35px;
    color: #666;
  }
  .login-interface form .item input {
    display: inline-block;
    height: 35px;
    line-height: 35px;
    width: 225px;
    padding-left: 10px;
  }
  .login-interface form .forget {
    height: 18px;
    margin: 20px 0;
  }
  .login-interface form .forget span {
    float: right;
  }
  .login-interface form .form-sub {
    width: 100%;
    height: 35px;
    background: $color-main;
    text-align: center;
    margin: 10px 0;
    cursor: pointer;
    color: #fff;
    font-size: 14px;
    transition: background ease-out .2s;
  }
  .login-interface form .form-sub:hover {
    background: darken($color-main, 10%);
  }
  .login-box .login-form .other-login {
    height: 50px;
    border-top: 1px solid #f4f4f4;
    padding: 0 20px;
    background-color: #fcfcfc;
  }
  .login-box .login-form .other-login ul li {
    float: left;
    line-height: 50px;
    a>span {
      padding: 0 10px;
      color: #666666;
      &:hover { color: $color-main }
    }
  }
  .login-box .login-form .other-login ul .other-one a>span {
    border-right: 1px solid #bdbdbd;
  }
  .login-box .login-form .other-login ul .other-right {
    float: right;
  }
  .other-login ul .other-right a {
    color: $color-main;
    font-size: 15px;
  }
  .send-sms-btn {
    width: 187px;
    height: 35px;
    border: none;
    color: #ffffff;
    background-color: #607d8b;
    transition: background ease-out .2s;
  }
  .send-sms-btn:hover {
    background-color: #516a77;
  }
  .send-sms-btn:disabled {
    background-color: #ccc !important;
    color: #fff !important;
    cursor: not-allowed !important;
  }
</style>
