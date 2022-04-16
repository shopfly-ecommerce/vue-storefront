<template>
  <div id="register">
    <en-header-other title="Welcome to register">
      <div class="have-account">
        <span>Existing account？</span>
        <nuxt-link :to="'/login' + MixinForward">Sign in ></nuxt-link>
      </div>
    </en-header-other>
    <div class="register-content">
      <el-form
        :model="registerForm"
        :rules="registerRules"
        ref="registerForm"
        status-icon
        label-width="200px"
      >
        <el-form-item prop="username">
          <span slot="label">username</span>
          <el-input
            v-model="registerForm.username"
            :maxlength="20"
            placeholder="Please enter the user name"
            :validate-event="validateEvent"
            @input="input"
          ></el-input>
        </el-form-item>
        <el-form-item label="password" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            :maxlength="20"
            placeholder="password6-20position"
            :validate-event="validateEvent"
            @input="input"
          ></el-input>
        </el-form-item>
        <el-form-item label="Confirm password" prop="confirm_password">
          <el-input
            v-model="registerForm.confirm_password"
            type="password"
            :maxlength="20"
            placeholder="Please remember your password"
            :validate-event="validateEvent"
            @input="input"
          ></el-input>
        </el-form-item>
        <el-form-item label="mobile" :error="requiredMobile" prop="mobile">
          <el-input
            v-model="registerForm.mobile"
            :maxlength="11"
            placeholder="Please enter your cell phone number"
            :validate-event="validateEvent"
            @input="input"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="showValidCode" label="Image verification code" :error="requiredValCode" prop="vali_code" class="vali-code">
          <el-input
            v-model="registerForm.vali_code"
            :maxlength="4"
            placeholder="Please enter the image verification code"
            :validate-event="validateEvent"
            @input="input"
          >
            <img v-if="valid_code_url" :src="valid_code_url" slot="append" @click="changeValidCodeUrl">
          </el-input>
        </el-form-item>
        <el-form-item prop="sms_code" class="sms-code">
          <span slot="label">SMS verification code</span>
          <el-input
            v-model="registerForm.sms_code"
            :maxlength="6"
            :placeholder="effectiveMinutes"
            :validate-event="validateEvent"
            @input="input"
          >
            <en-count-down-btn :start="sendValidMobileSms" @end="changeValidCodeUrl" slot="append"/>
          </el-input>
        </el-form-item>
        <button type="button" class="register-btn" @click="handleConfirmRegister">Register now</button>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { mapActions } from 'vuex'
  import { Button, Form, FormItem, Input } from 'element-ui'
  Vue.use(Button).use(Form).use(FormItem).use(Input)
  import * as API_Common from '@/api/common'
  import * as API_Passport from '@/api/passport'
  import * as API_Article from '@/api/article'
  import * as API_Connect from '@/api/connect'
  import { RegExp } from '@/ui-utils'
  import { domain } from '@/ui-domain'
  import Storage from '@/utils/storage'
  export default {
    name: 'register',
    layout: 'full',
    async asyncData() {
      try {
        const protocol = await API_Article.getArticleByPosition('REGISTRATION_AGREEMENT')
        return { protocol }
      } catch (e) {
        return { protocol: 'Protocol obtaining failure...' }
      }
    },
    head() {
      return {
        title: `Registered members-${this.site.title}`
      }
    },
    data() {
      return {
        //uuid
        uuid: Storage.getItem('uuid'),
        // Member Registration Form
        registerForm: {
          username: '',
          password: '',
          confirm_password: '',
          mobile: '',
          vali_code: '',
          sms_code: ''
        },
        // Membership registration form rules
        registerRules: {
          username: [
            this.MixinRequired('Please enter your account name！'),
            { min: 2, max: 10, message: 'The length of2 to10 A character' },
            { validator: (rule, value, callback) => {
              if (!RegExp.userName.test(value)) {
                callback(new Error('Support only Chinese characters、The letter、digital、“-”、“_The combination of"！'))
              } else {
                callback()
              }
            } },
            { validator: (rule, value, callback) => {
              if (!/[^\d]+/.test(value)) {
                callback(new Error('The account name cannot be pure digits！'))
              } else {
                callback()
              }
            } },
            { validator: (rule, value, callback) => {
              API_Passport.checkUsernameRepeat(value).then(response => {
                  if (response.exist) {
                    callback(new Error('This username is already registered！'))
                  } else {
                    callback()
                  }
                }).catch(error => {
                callback(new Error('User name duplicate verification error, please try again later！'))
              })
            }, trigger: 'blur' }
          ],
          password: [
            { required: true, message: 'Please enter your password.', trigger: 'blur' },
            { validator: (rule, value, callback) => {
              if (!RegExp.password.test(value)) {
                callback(new Error('The password should be6-20A digital、English letters, or special characters！'))
              } else {
                callback()
              }
            } }
          ],
          confirm_password: [
            { required: true, message: 'Please confirm password.', trigger: 'blur' },
            { validator: (rule, value, callback) => {
                const { password, confirm_password } = this.registerForm
                if (password !== confirm_password) {
                  callback(new Error('The two inputs are inconsistent！'))
                } else {
                  callback()
                }
              } }
          ],
          mobile: [
            this.MixinRequired('Please enter your mobile phone number！'),
            { validator: (rule, value, callback) => {
              if (!RegExp.mobile.test(value)) {
                callback(new Error('Incorrect phone format！'))
              } else {
                API_Passport.checkMobileRepeat(value).then(response => {
                  if (response.exist) {
                    callback(new Error('The phone number has been registered！'))
                  } else {
                    this.showValidCode = true
                    callback()
                  }
                }).catch(error => {
                  callback(new Error('Duplicate verification error, please try again later！'))
                })
              }
            } }
          ],
          vali_code: [this.MixinRequired('Please enter the image verification code！')],
          sms_code: [this.MixinRequired('Please enter the SMS verification code！')]
        },
        requiredMobile: '',
        requiredValCode: '',
        // Whether to display the image verification code
        showValidCode: false,
        // Image verification code URL
        valid_code_url: '',
        // Consent registration Agreement
        agreed: false,
        // Whether the login is trusted
        isConnect: false,
        // Initialization verification event [Compatible with IE]
        validateEvent: false,
	      // Effective minutes
        effectiveMinutes: '2Within minutes'
      }
    },
    mounted() {
      this.changeValidCodeUrl()
      const uuid_connect = Storage.getItem('uuid_connect')
      const isConnect = this.$route.query.form === 'connect' && !!uuid_connect
      this.isConnect = isConnect
      this.$layer.open({
        type: 1,
        skin: 'layer-register',
        title: 'The registration agreement',
        area: ['800px', '600px'],
        scrollbar: false,
        btn: ['cancel', 'Agree'],
        btnAlign: 'c',
        yes: () => {
          location.href = '/'
        },
        btn2: () => {
          this.agreed = true
        },
        cancel: () => {
          location.href = '/'
        },
        content: `<div style="padding: 15px">${this.protocol.content}</div>`
      });
    },
    methods: {
      /** Get the image captcha*/
      changeValidCodeUrl() {
        this.valid_code_url = API_Common.getValidateCodeUrl(this.uuid, 'REGISTER')
      },
      /** Sending a mobile verification code asynchronously*/
      sendValidMobileSms() {
        return new Promise((resolve, reject) => {
          const { mobile, vali_code } = this.registerForm
          if (!mobile) {
            this.$message.error('Please enter your cell phone number！')
            this.requiredMobile = 'The cell phone number cannot be empty！'
          } else if (!vali_code) {
            this.$message.error('Please enter the image verification code！')
            this.requiredValCode = 'The image verification code cannot be empty！'
          } else {
            API_Passport.sendRegisterSms(mobile, vali_code).then(response => {
              this.effectiveMinutes = `${response}Within minutes`
              this.$message.success('The text message has been sent successfully, please note that check！')
              resolve()
            }).catch(reject)
          }
        })
      },
      /** Input box input*/
      input(value) {
        !this.validateEvent && (this.validateEvent = true)
      },
      /** Register now*/
      handleConfirmRegister() {
        if (!this.agreed) {
          this.$message.error('Please agree to the registration agreement first！')
          return false
        }
        const _forwardMatch = this.MixinForward.match(/\?forward=(.+)/) || []
        let forward = _forwardMatch[1]
        if (!forward || forward.indexOf('/login') > -1) {
          forward = '/'
        }
        this.$refs['registerForm'].validate(valide => {
          if (valide) {
            this.registerByMobile(this.registerForm).then(() => {
              if (this.isConnect) {
                API_Connect.registerBindConnect(Storage.getItem('uuid_connect')).then(() => {
                  Storage.removeItem('uuid_connect')
                  this.getUserData().then(() => {
                    this.$router.push({ path: forward || '/member' })
                  })
                })
              } else {
                this.getUserData().then(() => {
                  this.$router.push({ path: forward || '/member' })
                })
              }
            })
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },
      ...mapActions({
        registerByMobile: 'user/registerByMobileAction',
        getUserData: 'user/getUserDataAction'
      })
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../assets/styles/color";
  .have-account {
    font-size: 16px;
    float: right;
    margin-top: 24px;
    color: #999;
    a { color: $color-main }
  }
  .register-content {
    border-top: 2px solid $color-main;
    padding-top: 50px;
    margin-bottom: 50px;
  }
  .register-content /deep/ .el-form {
    width: 500px;
    margin: 0 auto;
    .el-form-item {
      position: relative;
      margin-bottom: 30px;
      border: 1px solid #ddd;
      &.is-error { border-color: #f56c6c }
      &.is-error .el-input__inner { color: #f56c6c }
      &:hover { border-color: #999 }
    }
    .el-input__inner { border: none }
    .el-form-item__label {
      letter-spacing: 3px;
      &:before { content: '' }
    }
    .vali-code .el-form-item__label, .sms-code .el-form-item__label {
      letter-spacing: 1px
    }
    .sms-code .el-input-group__append {
      width: 70px;
      text-align: center;
      .count-down-btn {
        padding: 0;
      }
    }
    .is-error .el-form-item__label { color: #f56c6c }
    .el-form-item__label, .el-form-item__content { line-height: 50px }
    .el-form-item__error { padding-top: 9px }
    .vali-code {
      .el-input-group__append {
        width: 100px;
        padding: 0;
        background-color: transparent;
        border: none;
        position: relative;
        img {
          width: 100%;
          height: 50px;
          cursor: pointer;
          position: absolute;
          top: -6px;
          left: 0;
        }
      }
    }
    .sms-code .el-input-group__append {
      background-color: transparent;
      border: none;
    }
    .register-btn {
      width: 400px;
      height: 52px;
      background-color: $color-main;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
      border-radius: 2px;
      &:hover { background-color: darken($color-main, 10%) }
    }
  }
  /deep/ {
    .count-down-btn {
      line-height: 40px !important;
    }
  }
</style>
<style type="text/scss" lang="scss">
  @import "../assets/styles/color";
  .layer-register {
    .layui-layer-title {
      text-align: center;
      font-size: 16px;
    }
    .layui-layer-content {
      line-height: 30px;
    }
    .layui-layer-btn a {
      min-width: 80px;
      height: 35px;
      line-height: 35px;
    }
    .layui-layer-btn0 {
      background-color: #e3e4e5;
      border-color: #e3e4e5;
      color: #999
    }
    .layui-layer-btn1 {
      background-color: $color-main;
      border-color: $color-main;
      color: #fff;
    }
  }
</style>
