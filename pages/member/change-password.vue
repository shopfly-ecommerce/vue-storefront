<template>
  <div id="change-password">
    <div v-show="step === 1" class="valid-mobile-container">
      <el-alert type="info" title="" :closable="false">
        <h2>Why authentication？</h2>
        <p>1. To ensure the security of your account information, authentication is required to change important information in your account. Thank you for your understanding and support. </p>
        <p>2. Problem with authentication？Please provide user name, mobile phone number, historical invoice, click to contact our online customer service or call400*****400Consultation.</p>
      </el-alert>
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
    <div v-show="step === 2" class="change-password-container">
      <el-alert type="warning" title="" :closable="false">
        <h2>prompt</h2>
        <p>1. The password can only be6-20Letters or numbers. </p>
        <p>2. Be sure to remember your new password.</p>
      </el-alert>
      <el-form :model="changePasswordForm" :rules="changePasswordRules" ref="changePasswordForm" label-width="140px">
        <el-form-item label="Please enter your password.：" prop="password">
          <el-input v-model="changePasswordForm.password" placeholder="Please enter your password." type="password"></el-input>
        </el-form-item>
        <el-form-item label="Please confirm password.：" prop="rep_password">
          <el-input v-model="changePasswordForm.rep_password" placeholder="Please confirm password." type="password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Image verification code：" prop="img_code" class="img-code">
          <el-input v-model="changePasswordForm.img_code" placeholder="Please enter the image verification code" clearable :maxlength="4">
            <img slot="append" :src="valid_img_url" @click="getValidImgUrl">
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button @click.stop="submitChangeForm">Confirm the change</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import * as API_Common from '@/api/common'
  import * as API_Safe from '@/api/safe'
  import { RegExp } from '@/ui-utils'
  import Storage from '@/utils/storage'
  export default {
    name: 'change-password',
    head() {
      return {
        title: `Change the password-${this.site.title}`
      }
    },
    data() {
      return {
        uuid: Storage.getItem('uuid'),
        /** steps*/
        step: 1,
        /** Verify mobile forms*/
        validMobileForm: {},
        /** Verify mobile form rules*/
        validMobileRules: {
          img_code: [this.MixinRequired('Please enter the image verification code！')],
          sms_code: [this.MixinRequired('Please enter the SMS verification code！')]
        },
        /** Image verification codeURL */
        valid_img_url: '',
        /** Change password Form*/
        changePasswordForm: {
          password: '',
          rep_password: '',
          img_code: ''
        },
        /** Modify password form rules*/
        changePasswordRules: {
          password: [
            this.MixinRequired('Please enter a new login password！'),
            {
              validator: (rule, value, callback) => {
                if (!RegExp.password.test(value)) {
                  callback(new Error('The password should be6-20English bits or Numbers！'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
          rep_password: [
            this.MixinRequired('Please enter your password again！'),
            {
              validator: (rule, value, callback) => {
                if (value !== this.changePasswordForm.password) {
                  callback(new Error('The passwords entered are different'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
          img_code: [this.MixinRequired('Please enter the image verification code！')]
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
        this.valid_img_url = API_Common.getValidateCodeUrl(this.uuid, this.step === 1 ? 'VALIDATE_MOBILE' : 'MODIFY_PASSWORD')
      },
      /** Send the mobile phone verification code*/
      sendValidMobileSms() {
        return new Promise((resolve, reject) => {
          this.$refs['validMobileForm'].validateField('img_code', (error) => {
            if (error) {
              reject()
              this.$message.error('Please enter the image verification code！')
            } else {
              const { uuid } = this
              const { img_code } = this.validMobileForm
              API_Safe.sendMobileSms(uuid, img_code).then(() => {
                this.$message.success('Verification code has been sent successfully. Please check！')
                resolve()
              }).catch(() => {
                this.getValidImgUrl()
                reject()
              })
            }
          })
        })
      },
      /** Phone verification*/
      submitValMobileForm() {
        this.$refs['validMobileForm'].validate((valid) => {
          if (valid) {
            const { sms_code } = this.validMobileForm
            API_Safe.validChangePasswordSms(sms_code).then(() => {
              this.step = 2
              this.getValidImgUrl()
            }).catch(this.getValidImgUrl)
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },
      /** Change the password*/
      submitChangeForm() {
        this.$refs['changePasswordForm'].validate((valid) => {
          if (valid) {
            const { uuid } = this
            const { img_code, password } = this.changePasswordForm
            API_Safe.changePassword(uuid, img_code, password).then(() => {
              this.$message.success('The password is successfully changed. Please log in again！')
              setTimeout(async () => {
                await this.$store.dispatch('user/logoutAction', 'change-pwd')
                this.$router.push('/login')
              }, 200)
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
  .valid-mobile-container, .change-password-container {
    width: 100%;
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
  }
</style>
