<template>
  <div id="find-password" class="container">
    <div class="find-container w">
      <h1>找回密码<span>请您填写下面的表单来修改密码</span></h1>
      <div class="find-content">
        <div v-show="step === 1" class="find-item RegExp">
          <el-form :model="validAccountForm" :rules="validAccountRules" ref="validAccountForm" label-width="120px" style="width: 370px">
            <el-form-item label="账户名：" prop="account" :error="accountError">
              <el-input v-model="validAccountForm.account"></el-input>
            </el-form-item>
            <el-form-item label="图片验证码：" prop="img_code" class="vali-img">
              <el-input v-model="validAccountForm.img_code" :maxlength="4">
                <img :src="valid_img_url" @click="getValidImgUrl" slot="append">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="next-btn" type="danger" @click="handleValidAccount">验证账户</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="step === 2" class="find-item RegExp">
          <el-form :model="validMobileForm" :rules="validMobileRules" ref="validMobileForm" label-width="120px" style="width: 370px">
            <el-form-item label="手机号码：">
              <span>{{ validMobileForm.mobile }}</span>
            </el-form-item>
            <el-form-item label="图片验证码：" prop="img_code" class="vali-img">
              <el-input v-model="validMobileForm.img_code" :maxlength="4">
                <img :src="valid_img_url" @click="getValidImgUrl" slot="append">
              </el-input>
            </el-form-item>
            <el-form-item label="短信验证码：" prop="sms_code">
              <el-input v-model="validMobileForm.sms_code" :maxlength="6">
                <en-count-down-btn :time="60" :start="sendValidMobileSms" @end="getValidImgUrl" slot="append"/>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="next-btn" type="danger" @click="handleNextStep">下一步</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="step === 3" class="find-item RegExp">
          <el-form :model="changePasswordForm" :rules="changePasswordRules" ref="changePasswordForm" label-width="140px">
            <el-form-item label="请输入密码：" prop="password">
              <el-input v-model="changePasswordForm.password" placeholder="请输入密码" type="password"></el-input>
            </el-form-item>
            <el-form-item label="请确认密码：" prop="rep_password">
              <el-input v-model="changePasswordForm.rep_password" placeholder="请确认密码" type="password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click.stop="submitChangeForm">确认修改</el-button>
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
        // 步骤
        step: 1,
        /** 校验账户信息 表单 */
        validAccountForm: {},
        /** 校验账户信息 表单验证 */
        validAccountRules: {
          account: [this.MixinRequired('请输入账户名称！')],
          img_code: [this.MixinRequired('请输入图片验证码！')]
        },
        accountError: '',
        /** 校验手机 表单 */
        validMobileForm: {},
        /** 校验手机 表单规则 */
        validMobileRules: {
          img_code: [this.MixinRequired('请输入图片验证码！')],
          sms_code: [this.MixinRequired('请输入短信验证码！')]
        },
        /** 图片验证码URL */
        valid_img_url: '',
        /** 修改密码 表单 */
        changePasswordForm: {
          password: '',
          rep_password: ''
        },
        /** 修改密码 表单规则 */
        changePasswordRules: {
          password: [
            this.MixinRequired('请输入新的登录密码！'),
            {
              validator: (rule, value, callback) => {
                if (!RegExp.password.test(value)) {
                  callback(new Error('密码应为6-20位英文或数字！'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
          rep_password: [
            this.MixinRequired('请再次输入密码！'),
            {
              validator: (rule, value, callback) => {
                if (value !== this.changePasswordForm.password) {
                  callback(new Error('两次输入的密码不相同'))
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
      /** 获取图片验证码URL */
      getValidImgUrl() {
        const uuid = this.step === 1 ? this.uuid : this.validMobileForm.uuid
        this.valid_img_url = API_Common.getValidateCodeUrl(uuid, 'FIND_PASSWORD')
      },
      /** 验证账户 */
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
            this.$message.error('表单填写有误，请核对！')
            return false
          }
        })
      },
      /** 发送手机验证码异步方法 */
      sendValidMobileSms() {
        return new Promise((resolve, reject) => {
          this.$refs['validMobileForm'].validateField('img_code', (error) => {
            if (error) {
              this.$message.error('请输入图片验证码！')
              reject()
            } else {
              const { uuid, img_code } = this.validMobileForm
              API_Passport.sendFindPasswordSms(uuid, img_code).then(() => {
                this.$message.success('发送成功，请注意查收！')
                resolve()
              }).catch(() => {
                this.getValidImgUrl()
                reject()
              })
            }
          })
        })
      },
      /** 下一步 */
      handleNextStep() {
        this.$refs['validMobileForm'].validate((valid) => {
          if (valid) {
            const { uuid, sms_code } = this.validMobileForm
            API_Passport.validFindPasswordSms(uuid, sms_code).then(() => {
              this.step = 3
              this.getValidImgUrl()
            }).catch(this.getValidImgUrl)
          } else {
            this.$message.error('表单填写有误，请检查！')
            return false
          }
        })
      },
      /** 找回密码 */
      submitChangeForm() {
        this.$refs['changePasswordForm'].validate((valid) => {
          if (valid) {
            const { uuid } = this.validMobileForm
            const { password } = this.changePasswordForm
            API_Passport.changePassword(uuid, password).then(() => {
              this.$message.success('密码找回成功，请牢记您的新密码！')
              setTimeout(() => {
                this.$router.push(`/login${this.MixinForward}`)
              }, 200)
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
        font-family: arial,"Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei","微軟正黑體","儷黑 Pro",sans-serif;
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
