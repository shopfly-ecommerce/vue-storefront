<template>
  <div id="register-by-email">
    <div class="index-register w">
      <div class="welcome">
        <en-logo/>
        <span>欢迎注册</span>
      </div>
      <div class="have-account">
        <span>已有账号？</span>
        <nuxt-link :to="'/login' + MixinForward">请登录></nuxt-link>
      </div>
    </div>
    <div class="content-register">
      <div class="inner-register">
        <div class="left-reg">
          <h1>用户注册</h1>
          <el-form :model="registerForm" :rules="registerRules" ref="registerForm" label-width="100px" style="width: 400px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="registerForm.username"></el-input>
            </el-form-item>
            <el-form-item label="注册邮箱" prop="email">
              <el-input v-model="registerForm.email"></el-input>
            </el-form-item>
            <el-form-item label="账号密码" prop="password">
              <el-input v-model="registerForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="rep_password">
              <el-input v-model="registerForm.rep_password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="vali_code" class="vali-img">
              <el-input v-model="registerForm.vali_code">
                <img src="http://data.andste.cc/developers/web/temp/images/validcode-img.png" slot="append">
              </el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="danger" size="small" class="sub-btn">注册新用户</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="right-reg">
          <h1>注册之后您可以</h1>
          <ul>
            <li><i class="reg1"></i><span>购买商品支付订单</span></li>
            <li><i class="reg2"></i><span>申请开店销售商品</span></li>
            <li><i class="reg3"></i><span>空间好友推送分享</span></li>
            <li><i class="reg4"></i><span>收藏商品关注店铺</span></li>
            <li><i class="reg5"></i><span>商品咨询服务评价</span></li>
            <li><i class="reg6"></i><span>安全交易诚信无忧</span></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Form, FormItem, Input } from 'element-ui'
  Vue.use(Form)
  Vue.use(FormItem)
  Vue.use(Input)
  import { RegExp } from '@/ui-utils'
  import EnLogo from "@/components/Logo"
  export default {
    name: 'register-by-email',
    components: {EnLogo},
    validate() {
      return false
    },
    layout: 'full',
    data() {
      return{
        registerForm: {
          username: '',
          email: '',
          password: '',
          rep_password: '',
          vali_code: ''
        },
        registerRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (!RegExp.email.test(value)) {
                  callback(new Error('邮箱格式不正确！'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (!RegExp.password.test(value)) {
                  callback(new Error('密码应为6-20位数字、英文字母！'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
          rep_password: [
            { required: true, message: '请确认密码', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                const { password, rep_password} = this.registerForm
                if (password !== rep_password) {
                  callback(new Error('两次输入不一致！'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
          vali_code: [{ required: true, message: '请输入图片验证码', trigger: 'blur' }]
        }
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../assets/styles/color";
  .index-register {
    position: relative;
    width: 1000px;
    margin: 20px auto;
    height: 100px;
    .welcome {
      a {
        float: left;
        width: 245px;
        height: 60px;
      }
      img {
        width: 240px;
        height: 60px;
      }
      span {
        font-size: 23px;
        float: left;
        display: block;
        margin: 25px 5px;
      }
    }
    .have-account {
      font-size: 16px;
      float: right;
      margin-top: 24px;
      color: #999;
      a { color: $color-main }
    }
  }
  .content-register {
    position: relative;
    height: 680px;
    background-color: #fafafa;
    overflow: hidden;
    .inner-register {
      display: flex;
      justify-content: space-around;
      width: 860px;
      height: 560px;
      margin: 60px auto;
      border: 2px solid #E6E6E6;
      box-shadow: 2px 2px 2px #E6E6E6;
      border-radius: 0 15px;
      background-color: #ffffff;
      padding: 20px;
    }
    h1 {
      color: #FF500B;
      font-family: "microsoft yahei";
      font-size: 18px;
      font-weight: 500;
      line-height: 20px;
      padding: 15px 0 25px 25px;
      width: 200px;
      text-align: center;
      border-bottom: 3px solid #FF500B;
    }
    .left-reg {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 515px;
      /deep/ .el-form { margin-top: 50px }
      .vali-img {
        /deep/ .el-input-group__append { padding: 0 }
        img { width: 90px; height: 38px }
      }
      h1 { width: 485px }
      .sub-btn {
        width: 300px;
      }
    }
    .right-reg {
      width: 235px;
      height: 475px;
      border-left: 1px solid #E6E6E6;
      margin-left: 20px;
      padding: 0 0 0 25px;
      box-shadow: -1px 0px 2px rgba(231, 231, 231, 0.59);
      ul { margin-top: 30px }
      li {
        display: block;
        float: left;
        font-family: "microsoft yahei";
        font-size: 14px;
        height: 48px;
        line-height: 48px;
        margin: 0 0 5px 10px;
        overflow: hidden;
        padding: 0 0 12px;
        vertical-align: middle;
        width: 200px;
        i {
          background: url(../assets/images/icons-dltup.png) no-repeat left top;
          display: inline-block;
          height: 48px;
          margin-right: 10px;
          vertical-align: middle;
          width: 48px;
          &.reg1{ background-position: -304px -48px }
          &.reg2{ background-position: -256px 0 }
          &.reg3{ background-position: -352px 0 }
          &.reg4{ background-position: -304px 0 }
          &.reg5{ background-position: -352px -48px }
          &.reg6{ background-position: -256px -48px }
        }
      }
    }
  }
</style>
