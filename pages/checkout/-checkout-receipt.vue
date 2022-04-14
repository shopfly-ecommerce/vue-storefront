<template>
  <div class="ckt-item receipt">
    <div class="top-ckt">
      <span class="title-top">The invoice information</span>
      <div class="clearfix"></div>
    </div>
    <div class="content-ckt receipt">
      <div v-if="!receipt.receipt_title" class="item">Without the invoice</div>
      <template v-else>
        <div class="item receipt-title">{{ receipt.receipt_title }}</div>
        <div class="item receipt-content">{{ receipt.receipt_content }}</div>
      </template>
      <a href="javascript:;" class="item edit-btn" @click="handleEditReceiptInfo">edit</a>
      <a v-if="receipt && receipt.receipt_title" href="javascript:;" class="item cancel-btn" @click="handleCancelReceipt">Cancel the invoice</a>
    </div>
    <div id="receiptForm" class="receipt-layer" style="display: none">
      <el-form :model="receiptForm" :rules="receiptRules" ref="receiptForm" label-width="100px">
        <el-form-item label="The invoice looked up" prop="receipt_title">
          <!--People looked upstart-->
          <div
            class="ckt-checkbox title-receipt"
            :class="[selectedReceipt.receipt_title === 'personal' && 'selected']"
            @click="handleSelectReceipt"
          >
            <span class="title">personal</span>
          </div>
          <!--People looked upend-->
          <!--Personal invoice title liststart-->
          <div
            v-for="receipt in receipts"
            :key="receipt.receipt_title"
            class="ckt-checkbox title-receipt"
            :class="[
              selectedReceipt.receipt_title === receipt.receipt_title && 'selected',
              receiptForm.receipt_id === receipt.receipt_id && 'editting'
            ]"
            @click="handleSelectReceipt(receipt)"
          >
            <span class="title">{{ receipt.receipt_title }}</span>
            <input
              class="company-receipt-input"
              v-model="receiptForm.receipt_title"
              maxlength="60"
              placeholder="Title of unit invoice"
              @click.stop="() => {}"
            >
            <div class="title-btns">
              <a href="javascript:;" class="btn save-btn" @click.stop="handleSaveReceipt">save</a>
              <a href="javascript:;" class="btn edit-btn" @click.stop="handleEditReceipt(receipt)">edit</a>
              <a href="javascript:;" class="btn delete-btn" @click.stop="handleDeleteReceipt(receipt)">delete</a>
              <a href="javascript:;" class="btn cancel-btn" @click="receiptForm = {}">cancel</a>
            </div>
          </div>
          <!--Personal invoice title listend-->
          <!--Editor looked upstart-->
          <div
            v-if="receiptForm.receipt_title !== undefined && receiptForm.receipt_id === -1"
            class="ckt-checkbox title-receipt selected editting"
          >
            <input class="company-receipt-input" v-model="receiptForm.receipt_title" maxlength="60" placeholder="New unit invoice title">
            <div class="title-btns">
              <a href="javascript:;" class="btn save-btn" @click.stop="handleSaveReceipt">save</a>
            </div>
          </div>
          <!--Editor looked upend-->
          <!--New unit invoicestart-->
          <a
            v-if="!receiptForm.receipt_id"
            href="javascript:;"
            class="add-receipt"
            @click="handleAddReceipt"
          >New unit invoice</a>
          <!--New unit invoiceend-->
        </el-form-item>
        <el-form-item
          v-if="receiptForm.tax_no !== undefined"
          label="The invoice id number"
          prop="tax_no"
        >
          <input
            v-model="receiptForm.tax_no"
            :readonly="receiptForm.receipt_title === undefined"
            class="duty-receipt-input"
            placeholder="Please fill in the invoice tax number"
            maxlength="50"
          >
        </el-form-item>
        <el-form-item label="The invoice content" prop="content">
          <div class="ckt-checkbox content-receipt selected">
            <span>{{ content }}</span>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  /**
   * The settlement page
   * Invoice component
   */
  import * as API_Members from '@/api/members'
  import * as API_Trade from '@/api/trade'
  import { RegExp } from '@/ui-utils'
  export default {
    name: 'checkout-receipt',
    props: ['receipt'],
    data() {
      return {
        // The invoice form
        receiptForm: {},
        // Invoice form rules
        receiptRules: {
          receipt_title: [this.MixinRequired('Please fill in the invoice title！')],
          tax_no: [
            this.MixinRequired('Please fill in taxpayer identification number！'),
            {
              validator: (rule, value, callback) => {
                if (!RegExp.TINumber.test(value)) {
                  callback(new Error('The taxpayer identification number format is incorrect！'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
        },
        // Member invoice List
        receipts: [],
        // Invoice content is set uniformly
        content: 'The detail',
        // Selected invoice
        selectedReceipt: this.receipt
      }
    },
    mounted() {
      // Get a list of member invoices
      this.GET_ReceiptList()
    },
    methods: {
      /** Modifying invoice information*/
      handleEditReceiptInfo() {
        this.$layer.open({
          type: 1,
          title: 'The invoice information',
          zIndex: 200,
          area: '550px',
          scrollbar: false,
          content: $('#receiptForm'),
          btn: ['confirm', 'cancel'],
          yes: this.handleConfirmReceipt
        })
      },
      /** Select existing invoice*/
      handleSelectReceipt(receipt) {
        this.receiptForm = {
          tax_no: receipt.tax_no
        }
        this.$refs['receiptForm'].clearValidate()
        if (!receipt.receipt_title) {
          this.selectedReceipt = {
            receipt_title: 'personal',
            receipt_content: this.content
          }
          return false
        }
        this.selectedReceipt = JSON.parse(JSON.stringify(receipt))
      },
      /** New unit invoice*/
      handleAddReceipt() {
        this.receiptForm = {
          receipt_id: -1,
          receipt_title: '',
          receipt_content: this.content,
          tax_no: ''
        }
        this.selectedReceipt = ''
      },
      /** Modify the invoice*/
      handleEditReceipt(receipt) {
        this.receiptForm = JSON.parse(JSON.stringify(receipt))
        this.selectedReceipt = ''
      },
      /** Delete the invoice*/
      handleDeleteReceipt(receipt) {
        if (receipt.receipt_id === this.selectedReceipt.receipt_id) {
          this.$message.error('Selected invoices cannot be deleted！')
          return
        }
        this.$confirm('Are you sure you want to delete this invoice？', () => {
          API_Members.deleteReceipt(receipt.receipt_id).then(() => {
            this.$message.success('Delete the success！')
            this.GET_ReceiptList()
          })
        })
      },
      /** Save the invoice*/
      handleSaveReceipt() {
        const params = JSON.parse(JSON.stringify(this.receiptForm))
        const { receipt_title } = params
        const { receipt_id } = params
        if (receipt_id) {
          const hasSameTitle = this.receipts.filter(item => item.receipt_title === receipt_title)[0]
          if (hasSameTitle && hasSameTitle.receipt_id !== receipt_id) {
            this.$message.error('We already have the same invoice title！')
            return false
          }
        }
        this.$refs['receiptForm'].validate((valid) => {
          if (valid) {
            const saveSuccess = () => {
              this.$message.success('Save success！')
              this.receiptForm = {}
              this.handleSelectReceipt(params)
              this.GET_ReceiptList()
            }
            params.receipt_content = this.content
            if (receipt_id && receipt_id !== -1) {
              API_Members.editReceipt(receipt_id, params).then(saveSuccess)
            } else {
              API_Members.addReceipt(params).then(saveSuccess)
            }
          } else {
            this.$message.error('There is an error in the form. Please check it！')
            return false
          }
        })
      },
      /** Confirm the invoice*/
      handleConfirmReceipt(index) {
        if (this.receiptForm.receipt_title !== undefined) {
          this.$message.error('Please save the invoice you are editing first！')
          return false
        }
        if (!this.selectedReceipt.receipt_title) {
          this.$message.error('Please select invoice title！')
          return false
        }
        let receipt = JSON.parse(JSON.stringify(this.selectedReceipt)) || {}
        receipt.type = receipt.receipt_title === 'personal' ? 0 : 1
        API_Trade.setRecepit(receipt).then(() => {
          this.$message.success('Set up the success！')
          this.$emit('change', receipt)
          this.$layer.close(index)
        })
      },
      /** Cancel the invoice*/
      handleCancelReceipt() {
        this.$confirm('Are you sure you want to cancel the invoice？', () => {
          API_Trade.cancelReceipt().then(() => {
            this.$message.success('Cancel the success！')
            this.$emit('change', {})
          })
        })
      },
      /** Get invoice list*/
      GET_ReceiptList() {
        API_Members.getReceipts().then(response => {
          this.receipts = response.VATORDINARY.reverse()
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/styles/color";
  /deep/ {
    .receipt-layer {
      padding: 10px 30px;
      .add-receipt {
        color: rgb(0, 94, 167)
      }
      .title-receipt {
        padding-left: 10px;
        max-width: 300px;
        text-align: left;
        margin-bottom: 10px;
        .title {
          display: inline-block;
          width: 220px;
          height: 24px;
        }
        .company-receipt-input, .title-btns {
          display: none;
        }
        .company-receipt-input {
          width: 220px;
          height: 100%;
        }
        .title-btns {
          width: 70px;
          text-align: right;
          .btn {
            margin-right: 7px;
            color: #005ea7;
            &:hover {
              color: $color-main;
            }
            &.save-btn, &.cancel-btn {
              display: none;
            }
          }
        }
        &.selected {
          .title-btns {
            .delete-btn { cursor: not-allowed }
          }
        }
        &.editting {
          .company-receipt-input, .title-btns {
            display: inline-block;
          }
          .title {
            display: none;
          }
          .title-btns {
            .save-btn, .cancel-btn { display: inline }
            .edit-btn, .delete-btn { display: none }
          }
        }
        &:hover .title-btns {
          display: inline-block;
        }
      }
      .duty-receipt-input {
        padding-left: 10px;
        height: 28px;
        line-height: 28px;
        width: 230px;
        outline: none;
        border: 1px solid #ddd;
      }
      .content-receipt {
        float: left;
        min-width: 50px;
        padding: 0 10px;
        margin: 0 10px 10px 0;
      }
    }
    .el-form-item__label, .el-form-item__content {
      font-size: 12px;
      line-height: 30px
    }
  }

</style>
