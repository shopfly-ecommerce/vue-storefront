<template>
  <div id="register">
    <en-header-other title="欢迎注册">
      <div class="have-account">
        <span>已有账号？</span>
        <nuxt-link :to="'/login' + MixinForward">请登录></nuxt-link>
      </div>
    </en-header-other>
    <div class="register-content">
      <el-form
        :model="registerForm"
        :rules="registerRules"
        ref="registerForm"
        status-icon
        label-width="100px"
      >
        <el-form-item prop="username">
          <span slot="label">用&ensp;户&ensp;名</span>
          <el-input
            v-model="registerForm.username"
            :maxlength="20"
            placeholder="请输入用户名"
            :validate-event="validateEvent"
            @input="input"
          ></el-input>
        </el-form-item>
        <el-form-item label="设置密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            :maxlength="20"
            placeholder="密码设置6-20位"
            :validate-event="validateEvent"
            @input="input"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password">
          <el-input
            v-model="registerForm.confirm_password"
            type="password"
            :maxlength="20"
            placeholder="请牢记您的密码"
            :validate-event="validateEvent"
            @input="input"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :error="requiredMobile" prop="mobile">
          <el-input
            v-model="registerForm.mobile"
            :maxlength="11"
            placeholder="请输入手机号"
            :validate-event="validateEvent"
            @input="input"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="showValidCode" label="图片验证码" :error="requiredValCode" prop="vali_code" class="vali-code">
          <el-input
            v-model="registerForm.vali_code"
            :maxlength="4"
            placeholder="请输入图片验证码"
            :validate-event="validateEvent"
            @input="input"
          >
            <img v-if="valid_code_url" :src="valid_code_url" slot="append" @click="changeValidCodeUrl">
          </el-input>
        </el-form-item>
        <el-form-item prop="sms_code" class="sms-code">
          <span slot="label">短信验证码</span>
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
        <button type="button" class="register-btn" @click="handleConfirmRegister">立即注册</button>
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
        return { protocol: '协议获取失败...' }
      }
    },
    head() {
      return {
        title: `会员注册-${this.site.title}`
      }
    },
    data() {
      return {
        //uuid
        uuid: Storage.getItem('uuid'),
        // 会员注册 表单
        registerForm: {
          username: '',
          password: '',
          confirm_password: '',
          mobile: '',
          vali_code: '',
          sms_code: ''
        },
        // 会员注册 表单规则
        registerRules: {
          username: [
            this.MixinRequired('请输入账户名！'),
            { min: 2, max: 10, message: '长度在 2 到 10 个字符' },
            { validator: (rule, value, callback) => {
              if (!RegExp.userName.test(value)) {
                callback(new Error('只支持汉字、字母、数字、“-”、“_”的组合！'))
              } else {
                callback()
              }
            } },
            { validator: (rule, value, callback) => {
              if (!/[^\d]+/.test(value)) {
                callback(new Error('账户名不能为纯数字！'))
              } else {
                callback()
              }
            } },
            { validator: (rule, value, callback) => {
              API_Passport.checkUsernameRepeat(value).then(response => {
                  if (response.exist) {
                    callback(new Error('此用户名已被注册！'))
                  } else {
                    callback()
                  }
                }).catch(error => {
                callback(new Error('用户名重复校验出错，请稍后再试！'))
              })
            }, trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { validator: (rule, value, callback) => {
              if (!RegExp.password.test(value)) {
                callback(new Error('密码应为6-20位数字、英文字母，或者特殊字符！'))
              } else {
                callback()
              }
            } }
          ],
          confirm_password: [
            { required: true, message: '请确认密码', trigger: 'blur' },
            { validator: (rule, value, callback) => {
                const { password, confirm_password } = this.registerForm
                if (password !== confirm_password) {
                  callback(new Error('两次输入不一致！'))
                } else {
                  callback()
                }
              } }
          ],
          mobile: [
            this.MixinRequired('请输入手机号码！'),
            { validator: (rule, value, callback) => {
              if (!RegExp.mobile.test(value)) {
                callback(new Error('手机格式有误！'))
              } else {
                API_Passport.checkMobileRepeat(value).then(response => {
                  if (response.exist) {
                    callback(new Error('手机号已被注册！'))
                  } else {
                    this.showValidCode = true
                    callback()
                  }
                }).catch(error => {
                  callback(new Error('手机号重复校验出错，请稍后再试！'))
                })
              }
            } }
          ],
          vali_code: [this.MixinRequired('请输入图片验证码！')],
          sms_code: [this.MixinRequired('请输入短信验证码！')]
        },
        requiredMobile: '',
        requiredValCode: '',
        // 是否显示图片验证码
        showValidCode: false,
        // 图片验证码URL
        valid_code_url: '',
        // 同意注册协议
        agreed: false,
        // 是否为信任登录
        isConnect: false,
        // 初始化校验事件【兼容IE】
        validateEvent: false,
	      // 有效分钟数
        effectiveMinutes: '2分钟内有效'
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
        title: '注册协议',
        area: ['800px', '600px'],
        scrollbar: false,
        btn: ['取消', '同意并继续'],
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
      /** 获取图片验证码 */
      changeValidCodeUrl() {
        this.valid_code_url = API_Common.getValidateCodeUrl(this.uuid, 'REGISTER')
      },
      /** 发送手机验证码异步方法 */
      sendValidMobileSms() {
        return new Promise((resolve, reject) => {
          const { mobile, vali_code } = this.registerForm
          if (!mobile) {
            this.$message.error('请输入手机号！')
            this.requiredMobile = '手机号不能为空！'
          } else if (!vali_code) {
            this.$message.error('请输入图片验证码！')
            this.requiredValCode = '图片验证码不能为空！'
          } else {
            API_Passport.sendRegisterSms(mobile, vali_code).then(response => {
              this.effectiveMinutes = `${response}分钟内有效`
              this.$message.success('短信发送成功，请注意查收！')
              resolve()
            }).catch(reject)
          }
        })
      },
      /** 输入框输入 */
      input(value) {
        !this.validateEvent && (this.validateEvent = true)
      },
      /** 立即注册 */
      handleConfirmRegister() {
        if (!this.agreed) {
          this.$message.error('请先同意注册协议！')
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
            this.$message.error('表单填写有误，请检查！')
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
    width: 400px;
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
