<template>
  <div id="change-mobile">
    <el-alert v-if="step === 1" type="info" title="" :closable="false">
      <h2>Why authentication？</h2>
      <p>1. To ensure the security of your account information, authentication is required to change important information in your account. Thank you for your understanding and support. </p>
      <p>2. Problem with authentication？Please provide user name, mobile phone number, historical invoice, click to contact our online customer service or call400*****400Consultation.</p>
    </el-alert>
    <el-alert v-if="step === 2 || step === 3" type="info" title="" :closable="false">
      <h2>Why verify the phone？</h2>
      <p>1. Verify mobile phone can strengthen account security, you can use the verified mobile phone to quickly retrieve the password or pay the password. </p>
      <p>2. Verified mobile phones can be used to receive notifications of account balance changes.</p>
    </el-alert>
    <template v-if="step !== 3">
      <div v-show="step === 1" class="valid-mobile-container">
        <el-form v-if="user" :model="validMobileForm" :rules="validMobileRules" ref="validMobileForm" label-width="110px">
          <el-form-item label="Authenticated mobile phone：">
            <h2>{{ user.mobile | secrecyMobile }}</h2>
          </el-form-item>
          <el-form-item label="Image verification code：" prop="img_code" class="img-code">
            <el-input v-model="validMobileForm.img_code" placeholder="Please enter the image verification code" clearable :maxlength="4">
              <img slot="append" :src="valid_img_url" @click="getValidImgUrl">
            </el-input>
          </el-form-item>
          <el-form-item label="SMS verification code：" prop="sms_code" class="sms-code">
            <el-input v-model="validMobileForm.sms_code" placeholder="Please enter the SMS verification code" clearable :maxlength="6">
              <en-count-down-btn :time="60" :start="sendValidMobileSms" @end="getValidImgUrl" slot="append"/>
            </el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button @click.stop="submitValMobileForm">Submit the validation</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="step === 2" class="change-mobile-container">
        <el-form :model="changeMobileForm" :rules="changeMobileRules" ref="changeMobileForm" label-width="160px">
          <el-form-item label="Please enter your cell phone number：" prop="mobile">
            <el-input v-model="changeMobileForm.mobile" placeholder="Please enter your cell phone number" :maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="Image verification code：" prop="img_code" class="img-code">
            <el-input v-model="changeMobileForm.img_code" placeholder="Please enter the image verification code" clearable :maxlength="4">
              <img slot="append" :src="valid_img_url" @click="getValidImgUrl">
            </el-input>
          </el-form-item>
          <el-form-item label="Please enter the SMS verification code：" prop="sms_code">
            <el-input v-model="changeMobileForm.sms_code" placeholder="Please enter the SMS verification code" auto-complete="off">
              <en-count-down-btn :time="60" :start="sendChangeMobileSms" @end="getValidImgUrl" slot="append"/>
            </el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button @click.stop="submitChangeForm">Confirm the change</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <div v-else class="change-success-container">
      <div class="inner-success">
        <img src="../../assets/images/icon-success.png" class="icon-success">
        <div class="success-title">
          <p class="p1">You have successfully changed your mobile phone number：<span class="success-mobile">{{changeMobileForm.mobile | secrecyMobile }}</span></p>
          <p class="p2">You may need to：<nuxt-link to="/member/account-safe">Return to the security center</nuxt-link></p>
        </div>
    </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import * as API_Common from '@/api/common'
  import * as API_Safe from '@/api/safe'
  import { RegExp } from '@/ui-utils'
  import Storage from '@/utils/storage'
  export default {
    name: 'change-mobile',
    head() {
      return {
        title: `Change mobile Phone Number-${this.site.title}`
      }
    },
    data() {
      return {
        uuid: Storage.getItem('uuid'),
        /** steps*/
        step: 1,
        /** Verify the mobile phone number form*/
        validMobileForm: {}, // Image verification code
        /** Verify mobile phone number form rules*/
        validMobileRules: {
          img_code: [{ required: true, message: 'Please enter the image verification code', trigger: 'blur' }],
          sms_code: [{ required: true, message: 'Please enter the SMS verification code', trigger: 'blur' }]
        },
        /** Image verification codeURL */
        valid_img_url: '',
        /** Change the mobile phone form*/
        changeMobileForm: {},
        /** Change the mobile form rules*/
        changeMobileRules: {
          mobile: [
            this.MixinRequired('Please fill in your cell phone number！'),
            {
              required: true,
              validator: (rule, value, callback) => {
                if (!RegExp.mobile.test(value)) {
                  callback(new Error('The mobile phone number format is incorrect！'))
                } else {
                  callback()
                }
              }
            }
          ],
          img_code: [this.MixinRequired('Please enter the image verification code！')],
          sms_code: [this.MixinRequired('Please enter the SMS verification code！')],
        }
      }
    },
    mounted() {
      this.$nextTick(this.getValidImgUrl)
    },
    computed: {
      ...mapGetters(['user'])
    },
    methods: {
      /** Get the image captchaURL */
      getValidImgUrl() {
        this.valid_img_url = API_Common.getValidateCodeUrl(this.uuid, this.step === 1 ? 'VALIDATE_MOBILE' : 'BIND_MOBILE')
      },
      /** Send the mobile verification code*/
      sendValidMobileSms() {
        return new Promise((resolve, reject) => {
          this.$refs['validMobileForm'].validateField('img_code', (error) => {
            if (error) {
              reject()
              this.$message.error('Please enter the image verification code！')
            } else {
              const { uuid } = this
              const { img_code } = this.validMobileForm
              API_Safe.sendMobileSms(this.uuid, img_code).then(() => {
                this.$message.success('Successfully sent, please note to check！')
                resolve()
              }).catch(() => {
                this.getValidImgUrl()
                reject()
              })
            }
          })
        })
      },
      /** Verify the verification code of the mobile phone number*/
      submitValMobileForm() {
        this.$refs['validMobileForm'].validate((valid) => {
          if (valid) {
            const { sms_code } = this.validMobileForm
            API_Safe.validChangeMobileSms(sms_code).then(() => {
              this.step = 2
              this.getValidImgUrl()
            }).catch(this.getValidImgUrl)
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },
      /** Modify the verification code for sending mobile phone numbers*/
      sendChangeMobileSms() {
        return new Promise((resolve, reject) => {
          const form = this.$refs['changeMobileForm']
          form.validateField('mobile', (error1) => {
            form.validateField('img_code', (error2) => {
              if (error1 || error2) {
                reject()
                this.$message.success('The form is filled incorrectly, please check！')
              } else {
                const { uuid } = this
                const { mobile, img_code } = this.changeMobileForm
                API_Safe.sendBindMobileSms(mobile, img_code, uuid).then(() => {
                  this.$message.success('Verification code has been sent successfully. Please check！')
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
      /** Confirm the change*/
      submitChangeForm() {
        this.$refs['changeMobileForm'].validate((valid) => {
          if (valid) {
            const { mobile, sms_code } = this.changeMobileForm
            API_Safe.changeMobile(mobile, sms_code).then(() => {
              this.$message.success('Replace the success！')
              this.$store.dispatch('user/getUserDataAction')
              this.step = 3
            }).catch(this.getValidImgUrl)
          } else {
            this.$message.error('Please enter your mobile phone verification code！')
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
  .valid-mobile-container, .change-mobile-container {
    width: 100%;
    /deep/ .el-form {
      margin-top: 10px;
      padding-left: 24px
    }
    /deep/ .el-input { width: auto }
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
      .el-input__inner { width: 190px }
    }
  }
  .change-success-container {
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
