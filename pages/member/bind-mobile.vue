<template>
  <div id="bind-mobile">
    <div class="change-mobile-container">
      <el-alert type="info" title="" :closable="false">
        <h2>Why tie your phone？</h2>
        <p>1. Binding mobile phone can strengthen account security, you can use the bound mobile phone to quickly retrieve the password or payment password. </p>
        <p>2. Your mobile phone can be used to receive notifications of account balance changes.</p>
      </el-alert>
      <el-form v-if="!bindMobile" :model="bindMobileForm" :rules="bindMobileRules" ref="bindMobileForm" label-width="160px">
        <el-form-item label="Please enter your cell phone number：" prop="mobile">
          <el-input v-model="bindMobileForm.mobile" placeholder="Please enter your cell phone number" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="Image verification code：" prop="captcha" class="img-code">
          <el-input v-model="bindMobileForm.captcha" placeholder="Please enter the image verification code" clearable :maxlength="4">
            <img slot="append" :src="valid_img_url" @click="getValidImgUrl">
          </el-input>
        </el-form-item>
        <el-form-item label="Please enter the SMS verification code：" prop="sms_code" class="sms-code">
          <el-input v-model="bindMobileForm.sms_code" placeholder="Please enter the SMS verification code" auto-complete="off" :maxlength="6">
            <en-count-down-btn :time="60" :start="sendBindMobileSms" @end="getValidImgUrl" slot="append"/>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button @click.stop="submitBindForm">The binding</el-button>
        </el-form-item>
      </el-form>
      <div v-else class="bind-success">
        <div class="inner-success">
          <img src="../../assets/images/icon-success.png" class="icon-success">
          <div class="success-title">
            <p class="p1">You have bound your mobile phone number successfully：<span class="success-mobile">{{bindMobile | secrecyMobile }}</span></p>
            <p class="p2">You may need to：<nuxt-link to="/member/account-safe">Return to the security center</nuxt-link></p>
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
        title: `Bind mobile phone number-${this.site.title}`
      }
    },
    data() {
      return {
        uuid: Storage.getItem('uuid'),
        bindMobileForm: {},
        bindMobileRules: {
          mobile: [
            this.MixinRequired('Please fill in your mobile phone number！'),
            {
              validator: (rule, value, callback) => {
                if (!RegExp.mobile.test(value)) {
                  callback(new Error('Incorrect phone format！'))
                } else {
                  callback()
                }
              }
            }
          ],
          captcha: [this.MixinRequired('Please fill in the picture verification code！')],
          sms_code: [this.MixinRequired('Fill in the SMS verification code！')]
        },
        // Image verification code URL
        valid_img_url: '',
        // The mobile phone number is bound successfully
        bindMobile: this.$store.getters.user.mobile
      }
    },
    mounted() {
      this.$nextTick(this.getValidImgUrl)
    },
    methods: {
      /** Get the image captchaurl */
      getValidImgUrl() {
        this.valid_img_url = API_Common.getValidateCodeUrl(this.uuid, 'BIND_MOBILE')
      },
      /** Send the verification code of the bound mobile phone*/
      sendBindMobileSms () {
        return new Promise((resolve, reject) => {
          const form = this.$refs['bindMobileForm']
          form.validateField('mobile', (error1) => {
            form.validateField('captcha', (error2) => {
              if (error1 || error2) {
                reject()
                this.$message.error('The form is filled incorrectly, please check！')
              } else {
                const { uuid } = this
                const { mobile, captcha } = this.bindMobileForm
                API_Safe.sendBindMobileSms(mobile, captcha, uuid).then(() => {
                  this.$message.success('Successfully sent, please note to check！')
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
      /** Bind mobile phone number form submission*/
      submitBindForm() {
        this.$refs['bindMobileForm'].validate((valid) => {
          if (valid) {
            const { mobile, sms_code } = this.bindMobileForm
            API_Safe.bindMobile(mobile, sms_code).then(() => {
              this.$message.success('Binding success！')
              this.$store.dispatch('user/getUserDataAction')
              this.bindMobile = mobile
            }).catch(this.getValidImgUrl)
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
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
