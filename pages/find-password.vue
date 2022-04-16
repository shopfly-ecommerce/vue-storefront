<template>
  <div id="find-password" class="container">
    <div class="find-container w">
      <h1>Retrieve password<span>Please fill in the form below to change your password</span></h1>
      <div class="find-content">
        <div v-show="step === 1" class="find-item RegExp">
          <el-form :model="validAccountForm" :rules="validAccountRules" ref="validAccountForm" label-width="120px" style="width: 370px">
            <el-form-item label="Account name：" prop="account" :error="accountError">
              <el-input v-model="validAccountForm.account"></el-input>
            </el-form-item>
            <el-form-item label="Image verification code：" prop="img_code" class="vali-img">
              <el-input v-model="validAccountForm.img_code" :maxlength="4">
                <img :src="valid_img_url" @click="getValidImgUrl" slot="append">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="next-btn" type="danger" @click="handleValidAccount">Verify the account</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="step === 2" class="find-item RegExp">
          <el-form :model="validMobileForm" :rules="validMobileRules" ref="validMobileForm" label-width="120px" style="width: 370px">
            <el-form-item label="Mobile phone number：">
              <span>{{ validMobileForm.mobile }}</span>
            </el-form-item>
            <el-form-item label="Image verification code：" prop="img_code" class="vali-img">
              <el-input v-model="validMobileForm.img_code" :maxlength="4">
                <img :src="valid_img_url" @click="getValidImgUrl" slot="append">
              </el-input>
            </el-form-item>
            <el-form-item label="SMS verification code：" prop="sms_code">
              <el-input v-model="validMobileForm.sms_code" :maxlength="6">
                <en-count-down-btn :time="60" :start="sendValidMobileSms" @end="getValidImgUrl" slot="append"/>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="next-btn" type="danger" @click="handleNextStep">Next</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="step === 3" class="find-item RegExp">
          <el-form :model="changePasswordForm" :rules="changePasswordRules" ref="changePasswordForm" label-width="140px">
            <el-form-item label="Please enter your password.：" prop="password">
              <el-input v-model="changePasswordForm.password" placeholder="Please enter your password." type="password"></el-input>
            </el-form-item>
            <el-form-item label="Please confirm password.：" prop="rep_password">
              <el-input v-model="changePasswordForm.rep_password" placeholder="Please confirm password." type="password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click.stop="submitChangeForm">Confirm the change</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Form, FormItem, Input } from 'element-ui'
  import * as API_Passport from '@/api/passport'
  import * as API_Common from '@/api/common'
  import { RegExp } from '@/ui-utils'
  import Storage from '@/utils/storage'

  Vue.use(Form)
  Vue.use(FormItem)
  Vue.use(Input)
  export default {
    name: 'find-password',
    layout: 'full',
    data() {
      return {
        // uuid
        uuid: Storage.getItem('uuid'),
        // steps
        step: 1,
        /** Verify the account information form*/
        validAccountForm: {},
        /** Verify account information form authentication*/
        validAccountRules: {
          account: [this.MixinRequired('Please enter your account name！')],
          img_code: [this.MixinRequired('Please enter the image verification code！')]
        },
        accountError: '',
        /** Verify the mobile form*/
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
          rep_password: ''
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
          ]
        }
      }
    },
    mounted() {
      this.$nextTick(this.getValidImgUrl)
    },
    methods: {
      /** Get the image captchaURL */
      getValidImgUrl() {
        const uuid = this.step === 1 ? this.uuid : this.validMobileForm.uuid
        this.valid_img_url = API_Common.getValidateCodeUrl(uuid, 'FIND_PASSWORD')
      },
      /** Verify the account*/
      handleValidAccount() {
        this.$refs['validAccountForm'].validate((valid) => {
          if (valid) {
            const { uuid } = this
            const { account, img_code } = this.validAccountForm
            API_Passport.validAccount(uuid, img_code, account).then((response) => {
              this.validMobileForm.mobile = response.mobile
              this.validMobileForm.uname = response.uname
              this.validMobileForm.uuid = response.uuid
              this.step = 2
              this.getValidImgUrl()
            }).catch(error => {
              this.getValidImgUrl()
              this.accountError = error.response.data.message
            })
          } else {
            this.$message.error('There is an error in the form. Please check it！')
            return false
          }
        })
      },
      /** Sending a mobile verification code asynchronously*/
      sendValidMobileSms() {
        return new Promise((resolve, reject) => {
          this.$refs['validMobileForm'].validateField('img_code', (error) => {
            if (error) {
              this.$message.error('Please enter the image verification code！')
              reject()
            } else {
              const { uuid, img_code } = this.validMobileForm
              API_Passport.sendFindPasswordSms(uuid, img_code).then(() => {
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
      /** Next*/
      handleNextStep() {
        this.$refs['validMobileForm'].validate((valid) => {
          if (valid) {
            const { uuid, sms_code } = this.validMobileForm
            API_Passport.validFindPasswordSms(uuid, sms_code).then(() => {
              this.step = 3
              this.getValidImgUrl()
            }).catch(this.getValidImgUrl)
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },
      /** Retrieve password*/
      submitChangeForm() {
        this.$refs['changePasswordForm'].validate((valid) => {
          if (valid) {
            const { uuid } = this.validMobileForm
            const { password } = this.changePasswordForm
            API_Passport.changePassword(uuid, password).then(() => {
              this.$message.success('Password recovered successfully, please remember your new password！')
              setTimeout(() => {
                this.$router.push(`/login${this.MixinForward}`)
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
  @import "../assets/styles/color";
  .container {
    background: #f5f5f5;
    overflow: hidden;
    padding: 30px 0;
    .find-container {
      margin: 0 auto 10px;
      width: 794px;
      padding: 30px;
      background: #fff;
      h1 {
        font-size: 30px;
        font-weight: 600;
        color: #333;
        line-height: 1.5;
        font-family: arial,"Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei","Microsoft is in bold","Midnight blackPro",sans-serif;
        span {
          color: #757575;
          font-size: 12px;
          line-height: 1.5;
          margin-left: 10px;
          font-weight: normal;
        }
      }
    }
    .find-title {
      margin: 30px 0 0;
      overflow: hidden;
      width: 794px;
      ul {
        font-size: 16px;
        line-height: 1.25;
        list-style-type: none;
        margin: 0;
        width: 800px;
        overflow: hidden;
        li {
          color: #757575;
          cursor: pointer;
          float: left;
          font-size: 16px;
          line-height: 1.25;
          list-style-type: none;
          border-left: 1px solid #e0e0e0;
          width: 397px;
          text-align: center;
          &.active {
            color: $color-main;
            font-weight: 600;
          }
        }
      }
    }
    .find-content {
      display: flex;
      justify-content: center;
      border-top: 1px solid #e0e0e0;
      margin-top: 20px;
      padding: 25px 0;
      position: relative;
      width: 794px;
    }
    .find-item.RegExp {
      /deep/ .vali-img .el-input-group__append { padding: 0 }
      img { height: 38px; cursor: pointer }
      .next-btn { width: 250px }
      .el-form-item {
          margin-bottom: 29px;
      }
    }
  }
</style>
