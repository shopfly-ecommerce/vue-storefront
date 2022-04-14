<template>
  <div id="withdrawals-apply">
    <div class="member-nav">
      <ul class="member-nav-list">
        <li><nuxt-link to="./withdrawals-apply">Withdrawal application</nuxt-link></li>
      </ul>
    </div>
    <div class="recommend-container">
      <el-form
        :model="applyWithdrawalsForm"
        status-icon
        :rules="applyWithdrawalsRules"
        ref="applyWithdrawalsForm"
        label-width="100px"
        class="demo-ruleForm">
        <el-form-item label="Withdrawal amount：">
          <span>{{ applyWithdrawalsForm.can_rebate | unitPrice('¥') }}</span>
        </el-form-item>
        <el-form-item label="Withdrawal amount：" prop="apply_money">
          <el-input placeholder="Please enter the amount" v-model="applyWithdrawalsForm.apply_money" auto-complete="off">
            <template slot="prepend">¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="note：">
          <el-input type="textarea" v-model="applyWithdrawalsForm.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" size="small" @click="handleApplyWithdrawals('applyWithdrawalsForm')">To apply for</el-button>
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
    name: 'withdrawals-apply',
    data() {
      const checkApplyMoney = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('The withdrawal amount cannot be empty and cannot be0'))
        }
        setTimeout(() => {
          if (!RegExp.money.test(value)) {
            callback(new Error('Please enter a positive integer or two decimal places'))
          } else if (parseFloat(value) > parseFloat(this.applyWithdrawalsForm.can_rebate) ) {
            callback(new Error('The withdrawal amount exceeds the limit'))
          }else {
            callback()
          }
        }, 1000)
      }
      return {
        /** Application form*/
        applyWithdrawalsForm: {
          /** Withdrawal amount*/
          can_rebate: 0,

          /** Withdrawal amount*/
          apply_money: 0,

          /** note*/
          remark: ''
        },

        /** Application Rule Verification*/
        applyWithdrawalsRules: {
          apply_money: [
            { required: true, message: 'The withdrawal amount cannot be empty', trigger: 'blur' },
            { validator: checkApplyMoney, trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.GET_canRebate()
    },
    methods: {
      /** Get the amount available for withdrawal*/
      GET_canRebate() {
        API_distribution.getWithdrawalsCanRebate().then(response => {
          this.applyWithdrawalsForm.can_rebate = response.message
        })
      },

      /** To apply for cash withdrawals*/
      handleApplyWithdrawals(FormName) {
        this.$refs[FormName].validate((valid) => {
          if (valid) {
            const _params = {
              apply_money: this.applyWithdrawalsForm.apply_money,
              remark: this.applyWithdrawalsForm.remark
            }
            API_distribution.applyWithdrawals(_params).then(response => {
              this.$message.success('Application has been submitted, please be patient...')
              this.GET_canRebate()
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
