<template>
  <div id="apply-after-sale">
    <div class="member-nav">
      <ul class="member-nav-list">
        <li :class="[type === 'money' && 'active']" @click="handleChangeType('money')">
          <a href="javascript:;">To apply for a refund</a>
        </li>
        <li v-if="$route.query.sku_id" :class="[type === 'goods' && 'active']" @click="handleChangeType('goods')">
          <a href="javascript:;">To apply for a refund</a>
        </li>
      </ul>
    </div>
    <div class="apply-container">
      <div v-show="type === 'money'">
        <el-form :model="returnMoneyForm" :rules="returnMoneyRules" ref="returnMoneyForm" label-width="120px">
          <el-form-item label="The refund way：" prop="account_type">
            <el-select v-model="returnMoneyForm.account_type" :disabled="original_way" size="small" placeholder="Please select refund method">
              <el-option v-if="original_way" label="The way back" value=""></el-option>
              <el-option label="Alipay" value="ALIPAY"></el-option>
              <el-option label="WeChat" value="WEIXINPAY"></el-option>
              <el-option label="Bank transfer" value="BANKTRANSFER"></el-option>
            </el-select>
          </el-form-item>
          <div v-if="returnMoneyForm.account_type === 'BANKTRANSFER'">
            <el-form-item label="Bank name：" prop="bank_name">
              <el-input v-model="returnMoneyForm.bank_name" size="small" :maxlength="180" placeholder="Please enter the bank name"/>
            </el-form-item>
            <el-form-item label="Bank opening bank：" prop="bank_deposit_name">
              <el-input v-model="returnMoneyForm.bank_deposit_name" size="small" :maxlength="180" placeholder="Please input bank opening bank"/>
            </el-form-item>
            <el-form-item label="Bank account name：" prop="bank_account_name">
              <el-input v-model="returnMoneyForm.bank_account_name" size="small" :maxlength="180" placeholder="Please enter your bank account name"/>
            </el-form-item>
            <el-form-item label="The bank account：" prop="bank_account_number">
              <el-input v-model="returnMoneyForm.bank_account_number" size="small" :maxlength="180" placeholder="Please enter your bank account number"/>
            </el-form-item>
          </div>
          <el-form-item v-else label="Refund account：" prop="return_account">
            <el-input v-model="returnMoneyForm.return_account" :disabled="original_way" size="small" :maxlength="180" placeholder="Please enter your refund account number"/>
          </el-form-item>
          <el-form-item label="A refund reason：" prop="refund_reason">
            <el-select v-model="returnMoneyForm.refund_reason" size="small" placeholder="Please select the reason for the refund">
              <el-option v-if="ship_rog" label="There is something wrong with the quality of the goods" value="There is something wrong with the quality of the goods"></el-option>
              <el-option v-if="ship_rog" label="The goods received did not match the description" value="The goods received did not match the description"></el-option>
              <el-option v-if="ship_rog" label="Dont like/Dont want" value="Dont like/Dont want"></el-option>
              <el-option label="The invoice issue" value="The invoice issue"></el-option>
              <el-option v-if="ship_rog" label="Air parcel" value="Air parcel"></el-option>
              <el-option label="Express delivery no record" value="Express delivery no record"></el-option>
              <el-option label="The delivery never arrived" value="The delivery never arrived"></el-option>
              <el-option label="Buy the wrong/Dont want" value="Buy the wrong/Dont want"></el-option>
              <el-option label="The goods are not delivered as scheduled" value="The goods are not delivered as scheduled"></el-option>
              <el-option label="other" value="other"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="The refund amount：">
            <span class="price">￥</span>
            <span class="price" style="font-size: 16px;font-weight: 600">{{ (returnMoneyForm.return_money || 0) | unitPrice }}</span>
          </el-form-item>
          <!--<el-form-item label="Points deduction：">-->
            <!--<span class="price">-{{ order.use_point }}point</span>-->
            <!--<span class="point-tip">（Credits are not refundable）</span>-->
          <!--</el-form-item>-->
          <el-form-item label="Problem description：">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="Please enter a problem description(180characters)"
              :maxlength="180"
              style="width: 300px"
              v-model="returnMoneyForm.customer_remark">
            </el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="danger" size="small" @click="handleSubmitRturnMoney">Submit an application</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="type === 'goods'">
        <div class="order-detail">
          <div class="order-intro">
            <h1>The order information</h1>
            <div class="detail-list">
              <dl><dt>Shipping address：</dt><dd>{{ `${order.ship_country} - ${order.ship_state} - ${order.ship_city} - ${order.ship_addr}` }}</dd></dl>
              <dl class="top-line"><dt>Order no.：</dt><dd>{{ this.order_sn }}</dd></dl>
              <dl><dt>Terms of payment：</dt><dd>{{ this.order.payment_type === 'ONLINE' ? `Online payment${this.order.payment_method_name || ''}` : 'Cash on delivery' }}</dd></dl>
              <dl><dt>Amount paid：</dt><dd><span class="price">￥{{ this.order.order_price | unitPrice }}</span></dd></dl>
              <dl><dt>Create time：</dt><dd>{{ this.order.create_time | unixToDate }}</dd></dl>
            </div>
          </div>
          <el-form :model="returnGoodsForm" :rules="returnGoodsRules" ref="returnGoodsForm" label-width="120px" style="margin-top: 10px;margin-left: 10px">
            <el-form-item label="The refund way：" prop="account_type">
              <el-select v-model="returnGoodsForm.account_type" :disabled="original_way" size="small" placeholder="Please select refund method">
                <el-option v-if="original_way" label="The way back" value=""></el-option>
                <el-option label="Alipay" value="ALIPAY"></el-option>
                <el-option label="WeChat" value="WEIXINPAY"></el-option>
                <el-option label="Bank transfer" value="BANKTRANSFER"></el-option>
              </el-select>
            </el-form-item>
            <div v-if="returnGoodsForm.account_type === 'BANKTRANSFER'">
              <el-form-item label="Bank name：" prop="bank_name">
                <el-input v-model="returnGoodsForm.bank_name" size="small" :maxlength="180" placeholder="Please enter the bank name"/>
              </el-form-item>
              <el-form-item label="Bank opening bank：" prop="bank_deposit_name">
                <el-input v-model="returnGoodsForm.bank_deposit_name" size="small" :maxlength="180" placeholder="Please input bank opening bank"/>
              </el-form-item>
              <el-form-item label="Bank account name：" prop="bank_account_name">
                <el-input v-model="returnGoodsForm.bank_account_name" size="small" :maxlength="180" placeholder="Please enter your bank account name"/>
              </el-form-item>
              <el-form-item label="The bank account：" prop="bank_account_number">
                <el-input v-model="returnGoodsForm.bank_account_number" size="small" :maxlength="180" placeholder="Please enter your bank account number"/>
              </el-form-item>
            </div>
            <el-form-item v-else label="Refund account：" prop="return_account">
              <el-input v-model="returnGoodsForm.return_account" :disabled="original_way" size="small" :maxlength="180" placeholder="Please enter your refund account number"/>
            </el-form-item>
            <el-form-item label="The return reason：" prop="refund_reason">
              <el-select v-model="returnGoodsForm.refund_reason" size="small" placeholder="Please select the reason for the refund">
                <el-option label="There is something wrong with the quality of the goods" value="There is something wrong with the quality of the goods"></el-option>
                <el-option label="The goods received did not match the description" value="The goods received did not match the description"></el-option>
                <el-option label="Dont like/Dont want" value="Dont like/Dont want"></el-option>
                <el-option label="The invoice issue" value="The invoice issue"></el-option>
                <el-option label="Air parcel" value="Air parcel"></el-option>
                <el-option label="Express delivery no record" value="Express delivery no record"></el-option>
                <el-option label="The delivery never arrived" value="The delivery never arrived"></el-option>
                <el-option label="Buy the wrong/Dont want" value="Buy the wrong/Dont want"></el-option>
                <el-option label="The goods are not delivered as scheduled" value="The goods are not delivered as scheduled"></el-option>
                <el-option label="other" value="other"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="The refund amount：">
              <span class="price">￥</span>
              <span class="price" style="font-size: 16px;font-weight: 600">{{ returnGoodsForm.return_money | unitPrice }}</span>
            </el-form-item>
            <!--<el-form-item v-if="order.use_point" label="Points deduction：">-->
              <!--<span class="price">-{{ order.use_point }}point</span>-->
              <!--<span class="point-tip">（Credits are not refundable）</span>-->
            <!--</el-form-item>-->
            <el-form-item label="Returns the number of：" prop="return_num">
              <el-input-number size="mini" v-model="returnGoodsForm.return_num" :min="1" :max="maxReturnNum"></el-input-number>
            </el-form-item>
            <el-form-item label="Problem description：" prop="customer_remark">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="Please enter a problem description(180characters)"
                :maxlength="180"
                style="width: 300px"
                v-model="returnGoodsForm.customer_remark">
              </el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="danger" size="small" @click="handleSubmitRturnGoods">Submit an application</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div v-if="order" class="goods-list">
      <sku-list :skuList="skuList" name="name" price="purchase_price" total="subtotal"/>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { InputNumber, Select, Option } from 'element-ui'
  Vue.use(InputNumber)
  Vue.use(Select)
  Vue.use(Option)
  import * as API_AfterSale from '@/api/after-sale'
  import SkuList from '../-skuList'
  import { Foundation } from '@/ui-utils'
  export default {
    name: 'apply',
    components: { SkuList },
    data() {
      return {
        // The order details
        order: '',
        // The item list
        skuList: [],
        // Type of after-sale application
        type: this.$route.query.sku_id ? 'money' : 'money',
        // Refund Application Form
        returnMoneyForm: {
          account_type: '',
          order_sn: this.$route.query.order_sn
        },
        // Apply for refund form rules
        returnMoneyRules: {
          // The refund way
          account_type: [{ required: true, message: 'Please select refund method！', trigger: 'change' }],
          // Refund account
          return_account: [{ required: true, message: 'Please enter your refund account number！', trigger: 'blur' }],
          // Bank name
          bank_name: [{ required: false, message: 'Please enter the bank name', trigger: 'blur' }],
          // Bank opening Bank
          bank_deposit_name: [{ required: false, message: 'Please input bank opening bank', trigger: 'blur' }],
          // Bank account name
          bank_account_name: [{ required: false, message: 'Please enter your bank account name', trigger: 'blur' }],
          // The bank account
          bank_account_number: [{ required: false, message: 'Please enter your bank account number', trigger: 'blur' }],
          // A refund reason
          refund_reason: [{ required: true, message: 'Please select the reason for the refund！', trigger: 'change' }]
        },
        // Return request Form
        returnGoodsForm: {
          account_type: '',
          order_sn: this.$route.query.order_sn,
          return_num: 1
        },
        // Apply for return form rules
        returnGoodsRules: {
          // The refund way
          account_type: [{ required: true, message: 'Please select refund method！', trigger: 'change' }],
          // Refund account
          return_account: [{ required: true, message: 'Please enter your refund account number！', trigger: 'blur' }],
          // Bank name
          bank_name: [{ required: false, message: 'Please enter the bank name', trigger: 'blur' }],
          // Bank opening Bank
          bank_deposit_name: [{ required: false, message: 'Please input bank opening bank', trigger: 'blur' }],
          // Bank account name
          bank_account_name: [{ required: false, message: 'Please enter your bank account name', trigger: 'blur' }],
          // The bank account
          bank_account_number: [{ required: false, message: 'Please enter your bank account number', trigger: 'blur' }],
          // A refund reason
          refund_reason: [{ required: true, message: 'Please select the reason for the refund！', trigger: 'change' }],
          // Returns the number of
          return_num: [{ required: true, message: 'Please enter the amount of refund！', trigger: 'change' }]
        },
        // Maximum returnable quantity
        maxReturnNum: 1,
        // Whether the order is cancelled
        isCancel: !(!!this.$route.query.sku_id),
        // Whether to return to the original route
        original_way: false,
        // Whether the goods have been received
        ship_rog: false,
        ...this.$route.query
      }
    },
    mounted() {
      // Obtain after-sales data
      API_AfterSale.getAfterSaleData(this.order_sn, this.sku_id).then(response => {
        this.order = response.order
        this.ship_rog = response.order.ship_status === 'SHIP_ROG'
        this.skuList = response.sku_list
	      if (this.order.order_operate_allowable_vo.allow_service_cancel) {
          this.returnMoneyForm.return_money = Foundation.formatPrice(response.order.order_price)
          this.returnGoodsForm.return_money = Foundation.formatPrice(response.order.order_price)
	      } else {
          this.returnMoneyForm.return_money = Foundation.formatPrice(response.return_money)
          this.returnGoodsForm.return_money = Foundation.formatPrice(response.return_money)
	      }
        if (response.original_way === 'yes') {
          this.returnMoneyForm.account_type = ''
          this.returnGoodsForm.account_type = ''
          this.returnMoneyRules.account_type[0].required = false
          this.returnMoneyRules.return_account[0].required = false
          this.returnGoodsRules.account_type[0].required = false
          this.returnGoodsRules.return_account[0].required = false
          this.original_way = true
        }
        if (response.sku_list && response.sku_list.length) {
          this.returnGoodsForm.return_num = response.sku_list[0].num
          this.maxReturnNum = response.sku_list[0].num
        }
      })
    },
    watch: {
      'returnMoneyForm.account_type': function (newVal) {
        this.returnMoneyRules.return_account[0].required = newVal !== 'BANKTRANSFER'
        this.returnMoneyRules.bank_name[0].required = newVal === 'BANKTRANSFER'
        this.returnMoneyRules.bank_deposit_name[0].required = newVal === 'BANKTRANSFER'
        this.returnMoneyRules.bank_account_name[0].required = newVal === 'BANKTRANSFER'
        this.returnMoneyRules.bank_account_number[0].required = newVal === 'BANKTRANSFER'
      },
      'returnGoodsForm.account_type': function (newVal) {
        this.returnGoodsRules.return_account[0].required = newVal !== 'BANKTRANSFER'
        this.returnGoodsRules.bank_name[0].required = newVal === 'BANKTRANSFER'
        this.returnGoodsRules.bank_deposit_name[0].required = newVal === 'BANKTRANSFER'
        this.returnGoodsRules.bank_account_name[0].required = newVal === 'BANKTRANSFER'
        this.returnGoodsRules.bank_account_number[0].required = newVal === 'BANKTRANSFER'
      },
      'returnGoodsForm.return_num': function (newVal) {
        if (!this.order || !this.skuList || !this.skuList[0]) return
        const { refund_price, num } = this.skuList[0]
        this.returnGoodsForm.return_money = newVal === num ? Foundation.formatPrice(this.returnMoneyForm.return_money) : Foundation.formatPrice(newVal * refund_price)
      }
    },
    methods: {
      /** The type of application for after-sales service is changed*/
      handleChangeType(type) {
        this.type = type
      },
      /** To apply for a refund*/
      handleSubmitRturnMoney() {
        this.$refs['returnMoneyForm'].validate((valid) => {
          if (valid) {
            const params = JSON.parse(JSON.stringify(this.returnMoneyForm))
            if (this.isCancel) {
              API_AfterSale.applyAfterSaleCancel(params).then(this.handleApplySuccess)
            } else {
              params.sku_id = this.sku_id
              API_AfterSale.applyAfterSaleMoney(params).then(this.handleApplySuccess)
            }
          } else {
            this.$message.error('There is an error in the form. Please check it！')
            return false
          }
        })
      },
      /** To apply for a refund*/
      handleSubmitRturnGoods() {
        this.$refs['returnGoodsForm'].validate((valid) => {
          if (valid) {
            const params = JSON.parse(JSON.stringify(this.returnGoodsForm))
            params.sku_id = this.sku_id
            API_AfterSale.applyAfterSaleGoods(params).then(this.handleApplySuccess)
          } else {
            this.$message.error('There is an error in the form. Please check it！')
            return false
          }
        })
      },
      /** Successful application for after-sales service*/
      handleApplySuccess() {
        this.$message.success('Application is successful！')
        this.$router.back()
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../../assets/styles/color";
  .goods-list {
    margin-top: 20px;
  }
  .apply-container {
    padding-top: 20px;
    .order-detail {
      display: flex;
      border: 1px solid #d8d8d8;
      position: relative;
      z-index: 2;
    }
    .order-intro {
      background-color: #fbfbfb;
      border-right: 1px solid #d8d8d8;
      letter-spacing: normal;
      vertical-align: top;
      width: 389px;
      word-spacing: normal;
      h1 {
        background-color: #f3f3f3;
        border-bottom: 1px solid #d8d8d8;
        font-size: 12px;
        font-weight: 600;
        height: 20px;
        line-height: 20px;
        padding: 9px;
      }
      .detail-list {
        display: block;
        padding: 17px 17px 7px;
        width: auto;
      }
      dl {
        margin-bottom: 10px;
        display: inline-block;
        font-size: 12px;
        letter-spacing: normal;
        line-height: 20px;
        vertical-align: top;
        word-spacing: normal;
        width: 100%;
        &.top-line {
          border-top: 1px dotted #d8d8d8;
          padding-top: 10px;
        }
      }
      dt {
        color: #888;
        width: 23%;
        float: left;
        display: inline;
      }
      dd {
        color: #666;
        width: 77%;
        float: left;
        display: inline;
      }
    }
  }
  /deep/ {
    .el-input:not(.el-input--mini) {
      width: 212px;
    }
    .point-tip {
      font-size: 12px;
      color: #999;
    }
  }
</style>
