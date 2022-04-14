<template>
  <div id="register-by-email">
    <div class="index-register w">
      <div class="welcome">
        <en-logo/>
        <span>Welcome to register</span>
      </div>
      <div class="have-account">
        <span>Existing account？</span>
        <nuxt-link :to="'/login' + MixinForward">Sign in ></nuxt-link>
      </div>
    </div>
    <div class="content-register">
      <div class="inner-register">
        <div class="left-reg">
          <h1>User registration</h1>
          <el-form :model="registerForm" :rules="registerRules" ref="registerForm" label-width="100px" style="width: 400px">
            <el-form-item label="username" prop="username">
              <el-input v-model="registerForm.username"></el-input>
            </el-form-item>
            <el-form-item label="Registered mail" prop="email">
              <el-input v-model="registerForm.email"></el-input>
            </el-form-item>
            <el-form-item label="The account password" prop="password">
              <el-input v-model="registerForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="Confirm password" prop="rep_password">
              <el-input v-model="registerForm.rep_password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="captcha" prop="vali_code" class="vali-img">
              <el-input v-model="registerForm.vali_code">
                <img src="http://data.andste.cc/developers/web/temp/images/validcode-img.png" slot="append">
              </el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="danger" size="small" class="sub-btn">Register a new user</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="right-reg">
          <h1>After registration you can</h1>
          <ul>
            <li><i class="reg1"></i><span>Purchase goods to pay for orders</span></li>
            <li><i class="reg2"></i><span>Apply for a shop to sell goods</span></li>
            <li><i class="reg3"></i><span>Space friends push sharing</span></li>
            <li><i class="reg4"></i><span>Collect goods and pay attention to the store</span></li>
            <li><i class="reg5"></i><span>Evaluation of commodity consulting services</span></li>
            <li><i class="reg6"></i><span>Safe transaction integrity without worry</span></li>
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
            { required: true, message: 'Please enter the user name', trigger: 'blur' },
            { min: 2, max: 10, message: 'The length of2 to10 A character', trigger: 'blur' }
          ],
          email: [
            { required: true, message: 'Please enter email address', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (!RegExp.email.test(value)) {
                  callback(new Error('The mailbox format is incorrect！'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
          password: [
            { required: true, message: 'Please enter your password.', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (!RegExp.password.test(value)) {
                  callback(new Error('The password should be6-20A digital、The English alphabet！'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
          rep_password: [
            { required: true, message: 'Please confirm password.', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                const { password, rep_password} = this.registerForm
                if (password !== rep_password) {
                  callback(new Error('The two inputs are inconsistent！'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
          vali_code: [{ required: true, message: 'Please enter the image verification code', trigger: 'blur' }]
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
