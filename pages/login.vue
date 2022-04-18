<template>
  <div id="login">
    <en-header-other title="Welcome to login"/>
    <!-- A larger version-->
    <div class="login-content">

      <div class="login-box">
        <div class="login-form">

          <div class="login-tab">
            <ul>
              <li @click="!isConnect && (login_type = 'quick')">
                <a href="javascript:;" class="tab-a" :class="[login_type === 'quick' && 'active', isConnect && 'disabled']">Mobile login</a>
              </li>
              <li @click="login_type = 'account'">
                <a href="javascript:;" :class="[login_type === 'account' && 'active']">Password login</a>
              </li>
            </ul>
          </div>
          <div class="login-interface">
            <div v-show="login_type === 'quick'" class="login-show quick-login">
              <form class="quick-form" @keyup.enter="handleLogin">
                <div class="item item-form-o">
                  <label for="mobile">
                    <i class="iconfont ea-icon-mobile"></i>
                  </label>
                  <input id="mobile" v-model="quickForm.mobile" placeholder="Please enter your cell phone number" maxlength="20" autofocus>
                </div>
                <div class="item">
                  <label for="validcode-mobile">
                    <i class="iconfont ea-icon-safe"></i>
                  </label>
                  <input id="validcode-mobile" v-model="quickForm.captcha" placeholder="Image verification code" maxlength="4">
                  <img v-if="val_code_url" class="validcode-img" :src="val_code_url" @click="handleChangeValUrl">
                </div>
                <div class="item item-form-t">
                  <en-count-down-btn :start="sendValidMobileSms" @end="handleChangeValUrl" class="send-sms-btn"/>
                </div>
                <div class="item item-form-p">
                  <label for="sms-code">
                    <i class="iconfont ea-icon-sms"></i>
                  </label>
                  <input id="sms-code" v-model="quickForm.sms_code" placeholder="SMS verification code" maxlength="6">
                </div>
                <div class="forget">
                  <span><nuxt-link :to="'/find-password' + MixinForward">Forgot password</nuxt-link></span>
                </div>
                <button class="form-sub" type="button" @click="handleLogin">Sign in</button>
              </form>
            </div>
            <div v-show=" login_type === 'account'" class="login-show account-login">
              <form class="account-form" @keyup.enter="handleLogin">
                <div class="item">
                  <label for="username">
                    <i class="iconfont ea-icon-persion"></i>
                  </label>
                  <input id="username" v-model="accountForm.username" placeholder="email/username/mobile">
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
                  <input id="validcode" v-model="accountForm.captcha" placeholder="Image verification code" maxlength="4">
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
          username: 'food',
          password: '111111'
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
      /** Send SMS verification code asynchronous callback*/
      sendValidMobileSms() {
        const { mobile, captcha } = this.quickForm
        return new Promise((resolve, reject) => {
          if (!mobile) {
            this.$message.error('Please enter your mobile phone number！')
            reject()
          } else if (!RegExp.mobile.test(mobile)) {
            this.$message.error('The phone number is incorrectly formatted！')
            reject()
          } else if (!captcha) {
            this.$message.error('Please enter the image verification code！')
            reject()
          } else {
            API_Passport.sendLoginSms(mobile, captcha).then(() => {
              this.$message.success('The text message has been sent successfully, please note that check！')
              resolve()
            }).catch(() => {
              this.handleChangeValUrl()
              reject()
            })
          }
        })
      },
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
        const form = login_type === 'quick' ? this.quickForm : this.accountForm
        if (login_type === 'quick') {
          if (!form.mobile || !RegExp.mobile.test(form.mobile) || !form.sms_code) {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        } else {
          if (!form.username || !form.password || !form.captcha) {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        }
        if (this.isConnect) {
          const uuid = Storage.getItem('uuid_connect')
          if (!uuid) {
            this.$message.error('Parameters are abnormal. Please refresh the page！')
            return false
          }
          const params = JSON.parse(JSON.stringify(form))
          params.uuid = this.uuid
          API_Connect.loginByConnect(uuid, params).then(async response => {
            if (response.result === 'bind_success') {
              this.setAccessToken(response.access_token)
              this.setRefreshToken(response.refresh_token)
              const expires = new Date(jwt_decode(response.refresh_token).exp * 1000)
              Storage.setItem('uid', response.uid, { expires })
              await this.getUserData()
              Storage.removeItem('uuid_connect')
              window.location.href = forward
            } else {
              this.$alert('The current user has been bound to another account！', () => {
                this.removeAccessToken()
                this.removeRefreshToken()
                Storage.removeItem('uuid_connect')
              })
            }
          }).catch(this.handleChangeValUrl)
        } else {
          this.login({ login_type, form }).then(async () => {
            await this.getCartData()
            window.location.href = forward
          }).catch(this.handleChangeValUrl)
        }
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
      width: 50%;
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
