<template>
  <div id="withdrawals-setting">
    <div class="member-nav">
      <ul class="member-nav-list">
        <li><nuxt-link to="./withdrawals-setting">提现设置</nuxt-link></li>
      </ul>
    </div>
    <div class="recommend-container">
      <el-form
        :model="setWithdrawalsForm"
        status-icon
        :rules="setRules"
        ref="ReserveWithdrawals"
        label-width="100px"
        class="demo-ruleForm">
        <el-form-item label="户名：" prop="member_name">
          <el-input v-model="setWithdrawalsForm.member_name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="所属银行：" prop="bank_name">
          <el-input v-model="setWithdrawalsForm.bank_name" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="开户行号：" prop="opening_num">
          <el-input v-model="setWithdrawalsForm.opening_num"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号：" prop="bank_card">
          <el-input v-model="setWithdrawalsForm.bank_card"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" size="small" @click="handleReserveWithdrawalsParams('ReserveWithdrawals')">保存设置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Form, FormItem } from 'element-ui'
  Vue.use(Form).use(FormItem)
  import { RegExp } from '@/ui-utils'
  import * as API_distribution from '@/api/distribution'
  export default {
    name: 'withdrawals-setting',
    data() {
      /** 开户行号校验 */
      const checkOpeningNum = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('开户行号不能为空'))
        }
        setTimeout(() => {
          if (!/^[0-9]\d*$/.test(value)) {
            callback(new Error('请输入0-9的整数'))
          } else {
            callback()
          }
        }, 1000)
      }
      /** 银行卡号校验 */
      const checkBankCard = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('银行卡号不能为空'))
        }
        setTimeout(() => {
          if (!/^[0-9]\d*$/.test(value)) {
            callback(new Error('请输入0-9的整数'))
          } else {
            callback()
          }
        }, 1000)
      }
      return {
        /** 申请表单 */
        setWithdrawalsForm: {
          /** 户名 */
          member_name: '',

          /** 银行名称 */
          bank_name: '',

          /** 开户行号 */
          opening_num: '',

          /** 银行卡号 */
          bank_card: ''
        },
        /** 校验规则 */
        setRules: {
          /** 户名 */
          member_name: [
            { required: true, message: '请填写户名', trigger: 'blur' },
            { whitespace: true, message: '户名不可为纯空格', trigger: 'blur' },
            { max: 20, message: '户名长度最多20个字符', trigger: 'blur' }
          ],
          /** 所属银行 */
          bank_name: [
            { required: true, message: '请填写所属银行', trigger: 'blur' },
            { whitespace: true, message: '所属银行不可为纯空格', trigger: 'blur' },
            { max: 20, message: '所属银行长度最多20个字符', trigger: 'blur' }
          ],
          /** 开户行号 */
          opening_num: [
            { required: true, message: '请填写开户行号', trigger: 'blur' },
            { whitespace: true, message: '开户行号不可为纯空格', trigger: 'blur' },
            { max: 20, message: '开户行号长度最多20个字符', trigger: 'blur' },
            { validator: checkOpeningNum, trigger: 'blur' }
          ],
          /** 银行卡号 */
          bank_card: [
            { required: true, message: '请填写银行卡号', trigger: 'blur' },
            { whitespace: true, message: '银行卡号不可为纯空格', trigger: 'blur' },
            { max: 20, message: '银行卡号长度最多20个字符', trigger: 'blur' },
            { validator: checkBankCard, trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.GET_withdrawalsParams()
    },
    methods: {
      /** 获取可提现金额 */
      GET_withdrawalsParams() {
        API_distribution.getWithdrawalsParams().then(response => {
          this.setWithdrawalsForm = { ...response }
        })
      },

      /** 保存设置 */
      handleReserveWithdrawalsParams(FormName) {
        this.$refs[FormName].validate((valid) => {
          if (valid) {
            API_distribution.reserveWithdrawalsParams(this.setWithdrawalsForm).then(response => {
              this.$message.success('保存成功')
            })
          }
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/.el-form {
    padding: 25px;
    .el-form-item {
      .el-form-item__label {
        font-size: 13px;
      }
      .el-form-item__content {
        width: 250px;
      }
    }
  }
</style>
