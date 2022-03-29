<template>
  <div id="change-password">
    <div v-show="step === 1" class="valid-mobile-container">
      <el-alert type="info" title="" :closable="false">
        <h2>为什么要进行身份验证？</h2>
        <p>1. 为保障您的账户信息安全，在变更账户中的重要信息时需要身份验证，感谢您的理解与支持。 </p>
        <p>2. 验证身份遇到问题？请提供用户名，手机号，历史发票，点击联系我司 在线客服 或者拨打400*****400咨询。</p>
      </el-alert>
      <el-form v-if="user" :model="validMobileForm" :rules="validMobileRules" ref="validMobileForm" label-width="110px">
        <el-form-item label="已验证手机：">
          <h2>{{ user.mobile | secrecyMobile }}</h2>
        </el-form-item>
        <el-form-item label="图片验证码：" prop="img_code" class="img-code">
          <el-input v-model="validMobileForm.img_code" placeholder="请输入图片验证码" clearable :maxlength="4">
            <img slot="append" :src="valid_img_url" @click="getValidImgUrl">
          </el-input>
        </el-form-item>
        <el-form-item label="短信验证码：" prop="sms_code" class="sms-code">
          <el-input v-model="validMobileForm.sms_code" placeholder="请输入短信验证码" clearable :maxlength="6">
            <en-count-down-btn :time="60" :start="sendValidMobileSms" @end="getValidImgUrl" slot="append"/>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button @click.stop="submitValMobileForm">提交验证</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-show="step === 2" class="change-password-container">
      <el-alert type="warning" title="" :closable="false">
        <h2>提示</h2>
        <p>1. 密码只能为6-20个英文字母或数字。 </p>
        <p>2. 请务必牢记您的新密码。</p>
      </el-alert>
      <el-form :model="changePasswordForm" :rules="changePasswordRules" ref="changePasswordForm" label-width="140px">
        <el-form-item label="请输入密码：" prop="password">
          <el-input v-model="changePasswordForm.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="请确认密码：" prop="rep_password">
          <el-input v-model="changePasswordForm.rep_password" placeholder="请确认密码" type="password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片验证码：" prop="img_code" class="img-code">
          <el-input v-model="changePasswordForm.img_code" placeholder="请输入图片验证码" clearable :maxlength="4">
            <img slot="append" :src="valid_img_url" @click="getValidImgUrl">
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button @click.stop="submitChangeForm">确认修改</el-button>
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
        title: `修改密码-${this.site.title}`
      }
    },
    data() {
      return {
        uuid: Storage.getItem('uuid'),
        /** 步骤 */
        step: 1,
        /** 验证手机 表单 */
        validMobileForm: {},
        /** 验证手机 表单规则 */
        validMobileRules: {
          img_code: [this.MixinRequired('请输入图片验证码！')],
          sms_code: [this.MixinRequired('请输入短信验证码！')]
        },
        /** 图片验证码URL */
        valid_img_url: '',
        /** 修改密码 表单 */
        changePasswordForm: {
          password: '',
          rep_password: '',
          img_code: ''
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
          ],
          img_code: [this.MixinRequired('请输入图片验证码！')]
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
      /** 获取图片验证码URL */
      getValidImgUrl() {
        this.valid_img_url = API_Common.getValidateCodeUrl(this.uuid, this.step === 1 ? 'VALIDATE_MOBILE' : 'MODIFY_PASSWORD')
      },
      /** 发送验证手机验证码 */
      sendValidMobileSms() {
        return new Promise((resolve, reject) => {
          this.$refs['validMobileForm'].validateField('img_code', (error) => {
            if (error) {
              reject()
              this.$message.error('请输入图片验证码！')
            } else {
              const { uuid } = this
              const { img_code } = this.validMobileForm
              API_Safe.sendMobileSms(uuid, img_code).then(() => {
                this.$message.success('验证码发送成功，请注意查收！')
                resolve()
              }).catch(() => {
                this.getValidImgUrl()
                reject()
              })
            }
          })
        })
      },
      /** 手机验证 */
      submitValMobileForm() {
        this.$refs['validMobileForm'].validate((valid) => {
          if (valid) {
            const { sms_code } = this.validMobileForm
            API_Safe.validChangePasswordSms(sms_code).then(() => {
              this.step = 2
              this.getValidImgUrl()
            }).catch(this.getValidImgUrl)
          } else {
            this.$message.error('表单填写有误，请检查！')
            return false
          }
        })
      },
      /** 修改密码 */
      submitChangeForm() {
        this.$refs['changePasswordForm'].validate((valid) => {
          if (valid) {
            const { uuid } = this
            const { img_code, password } = this.changePasswordForm
            API_Safe.changePassword(uuid, img_code, password).then(() => {
              this.$message.success('密码修改成功，请重新登录！')
              setTimeout(async () => {
                await this.$store.dispatch('user/logoutAction', 'change-pwd')
                this.$router.push('/login')
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
