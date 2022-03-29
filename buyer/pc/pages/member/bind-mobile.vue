<template>
  <div id="bind-mobile">
    <div class="change-mobile-container">
      <el-alert type="info" title="" :closable="false">
        <h2>为什么要绑定手机？</h2>
        <p>1. 绑定手机可加强账户安全，您可以使用已绑定手机快速找回密码或支付密码。 </p>
        <p>2. 已绑定手机可用于接收账户余额变动提醒。</p>
      </el-alert>
      <el-form v-if="!bindMobile" :model="bindMobileForm" :rules="bindMobileRules" ref="bindMobileForm" label-width="160px">
        <el-form-item label="请输入手机号：" prop="mobile">
          <el-input v-model="bindMobileForm.mobile" placeholder="请输入手机号" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="图片验证码：" prop="captcha" class="img-code">
          <el-input v-model="bindMobileForm.captcha" placeholder="请输入图片验证码" clearable :maxlength="4">
            <img slot="append" :src="valid_img_url" @click="getValidImgUrl">
          </el-input>
        </el-form-item>
        <el-form-item label="请输入短信验证码：" prop="sms_code" class="sms-code">
          <el-input v-model="bindMobileForm.sms_code" placeholder="请输入短信验证码" auto-complete="off" :maxlength="6">
            <en-count-down-btn :time="60" :start="sendBindMobileSms" @end="getValidImgUrl" slot="append"/>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button @click.stop="submitBindForm">绑定</el-button>
        </el-form-item>
      </el-form>
      <div v-else class="bind-success">
        <div class="inner-success">
          <img src="../../assets/images/icon-success.png" class="icon-success">
          <div class="success-title">
            <p class="p1">您已成功绑定手机号：<span class="success-mobile">{{bindMobile | secrecyMobile }}</span></p>
            <p class="p2">您可能需要：<nuxt-link to="/member/account-safe">返回安全中心</nuxt-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as API_Safe from '@/api/safe'
  import * as API_Common from '@/api/common'
  import { RegExp } from '@/ui-utils'
  import Storage from '@/utils/storage'
  export default {
    name: 'bind-mobile',
    head() {
      return {
        title: `绑定手机号-${this.site.title}`
      }
    },
    data() {
      return {
        uuid: Storage.getItem('uuid'),
        bindMobileForm: {},
        bindMobileRules: {
          mobile: [
            this.MixinRequired('请填写手机号码！'),
            {
              validator: (rule, value, callback) => {
                if (!RegExp.mobile.test(value)) {
                  callback(new Error('手机格式有误！'))
                } else {
                  callback()
                }
              }
            }
          ],
          captcha: [this.MixinRequired('请填写图片验证码！')],
          sms_code: [this.MixinRequired('请填写短信验证码！')]
        },
        // 图片验证码url
        valid_img_url: '',
        // 绑定成功的手机号
        bindMobile: this.$store.getters.user.mobile
      }
    },
    mounted() {
      this.$nextTick(this.getValidImgUrl)
    },
    methods: {
      /** 获取图片验证码url */
      getValidImgUrl() {
        this.valid_img_url = API_Common.getValidateCodeUrl(this.uuid, 'BIND_MOBILE')
      },
      /** 发送绑定手机验证码 */
      sendBindMobileSms () {
        return new Promise((resolve, reject) => {
          const form = this.$refs['bindMobileForm']
          form.validateField('mobile', (error1) => {
            form.validateField('captcha', (error2) => {
              if (error1 || error2) {
                reject()
                this.$message.error('表单填写有误，请检查！')
              } else {
                const { uuid } = this
                const { mobile, captcha } = this.bindMobileForm
                API_Safe.sendBindMobileSms(mobile, captcha, uuid).then(() => {
                  this.$message.success('发送成功，请注意查收！')
                  resolve()
                }).catch(() => {
                  this.getValidImgUrl()
                  reject()
                })
              }
            })
          })
        })
      },
      /** 绑定手机号 表单提交 */
      submitBindForm() {
        this.$refs['bindMobileForm'].validate((valid) => {
          if (valid) {
            const { mobile, sms_code } = this.bindMobileForm
            API_Safe.bindMobile(mobile, sms_code).then(() => {
              this.$message.success('绑定成功！')
              this.$store.dispatch('user/getUserDataAction')
              this.bindMobile = mobile
            }).catch(this.getValidImgUrl)
          } else {
            this.$message.error('表单填写有误，请检查！')
            return false
          }
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/styles/color";
  /deep/ .el-alert {
    h2 { margin: 20px 0 }
    p { margin-bottom: 10px }
  }
  /deep/ .el-form {
    margin-top: 10px;
    padding-left: 24px
  }
  /deep/ .el-input__inner { width: 190px }
  /deep/ .img-code {
    .el-input { width: auto }
    .el-input-group__append {
      padding: 0;
      cursor: pointer;
      img { height: 38px }
    }
  }
  /deep/ .sms-code {
    .el-input { width: auto }
  }
  .bind-success {
    display: flex;
    justify-content: center;
    width: 100%;
    min-height: 300px;
    .inner-success {
      display: flex;
      margin-top: 30px;
    }
    .icon-success {
      width: 50px;
      height: 50px;
      margin-right: 15px;
    }
    .success-title {
      .p1 {
        font-size: 16px;
        color: #333;
        span {
          display: inline-block;
          padding: 3px 5px;
          background-color: #1E9DFF;
          color: #fff;
          border-radius: 10px;
        }
      }
      .p2 {
        font-size: 12px;
        color: #666;
        a {
          color: $color-href;
          &:hover { color: $color-main }
        }
      }
    }
  }
</style>
