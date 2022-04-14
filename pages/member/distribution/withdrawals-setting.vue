<template>
  <div id="withdrawals-setting">
    <div class="member-nav">
      <ul class="member-nav-list">
        <li><nuxt-link to="./withdrawals-setting">Withdrawal is set</nuxt-link></li>
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
        <el-form-item label="Account name：" prop="member_name">
          <el-input v-model="setWithdrawalsForm.member_name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="Belongs to the bank：" prop="bank_name">
          <el-input v-model="setWithdrawalsForm.bank_name" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="Bank no.：" prop="opening_num">
          <el-input v-model="setWithdrawalsForm.opening_num"></el-input>
        </el-form-item>
        <el-form-item label="Bank card number：" prop="bank_card">
          <el-input v-model="setWithdrawalsForm.bank_card"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" size="small" @click="handleReserveWithdrawalsParams('ReserveWithdrawals')">Save Settings</el-button>
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
      /** Checking bank number*/
      const checkOpeningNum = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('The opening bank number cannot be blank'))
        }
        setTimeout(() => {
          if (!/^[0-9]\d*$/.test(value)) {
            callback(new Error('Please enter the0-9The integer'))
          } else {
            callback()
          }
        }, 1000)
      }
      /** Check bank card number*/
      const checkBankCard = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('The bank card number cannot be empty'))
        }
        setTimeout(() => {
          if (!/^[0-9]\d*$/.test(value)) {
            callback(new Error('Please enter the0-9The integer'))
          } else {
            callback()
          }
        }, 1000)
      }
      return {
        /** Application form*/
        setWithdrawalsForm: {
          /** Account name*/
          member_name: '',

          /** Bank name*/
          bank_name: '',

          /** Bank no.*/
          opening_num: '',

          /** Bank card number*/
          bank_card: ''
        },
        /** Validation rules*/
        setRules: {
          /** Account name*/
          member_name: [
            { required: true, message: 'Please fill in your account name', trigger: 'blur' },
            { whitespace: true, message: 'The user name cannot be pure space', trigger: 'blur' },
            { max: 20, message: 'Maximum account length20A character', trigger: 'blur' }
          ],
          /** Belongs to the bank*/
          bank_name: [
            { required: true, message: 'Please fill in your bank', trigger: 'blur' },
            { whitespace: true, message: 'Owning bank cannot be pure space', trigger: 'blur' },
            { max: 20, message: 'The length of the owning bank is maximum20A character', trigger: 'blur' }
          ],
          /** Bank no.*/
          opening_num: [
            { required: true, message: 'Please fill in the opening bank number', trigger: 'blur' },
            { whitespace: true, message: 'The opening bank number cannot be blank', trigger: 'blur' },
            { max: 20, message: 'Maximum length of bank number20A character', trigger: 'blur' },
            { validator: checkOpeningNum, trigger: 'blur' }
          ],
          /** Bank card number*/
          bank_card: [
            { required: true, message: 'Please fill in your bank card number', trigger: 'blur' },
            { whitespace: true, message: 'The bank card number cannot be blank', trigger: 'blur' },
            { max: 20, message: 'The bank card number is the longest20A character', trigger: 'blur' },
            { validator: checkBankCard, trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.GET_withdrawalsParams()
    },
    methods: {
      /** Get the amount available for withdrawal*/
      GET_withdrawalsParams() {
        API_distribution.getWithdrawalsParams().then(response => {
          this.setWithdrawalsForm = { ...response }
        })
      },

      /** Save Settings*/
      handleReserveWithdrawalsParams(FormName) {
        this.$refs[FormName].validate((valid) => {
          if (valid) {
            API_distribution.reserveWithdrawalsParams(this.setWithdrawalsForm).then(response => {
              this.$message.success('Save success')
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
