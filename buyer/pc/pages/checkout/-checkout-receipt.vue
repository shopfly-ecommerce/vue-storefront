<template>
  <div class="ckt-item receipt">
    <div class="top-ckt">
      <span class="title-top">发票信息</span>
      <div class="clearfix"></div>
    </div>
    <div class="content-ckt receipt">
      <div v-if="!receipt.receipt_title" class="item">无需发票</div>
      <template v-else>
        <div class="item receipt-title">{{ receipt.receipt_title }}</div>
        <div class="item receipt-content">{{ receipt.receipt_content }}</div>
      </template>
      <a href="javascript:;" class="item edit-btn" @click="handleEditReceiptInfo">修改</a>
      <a v-if="receipt && receipt.receipt_title" href="javascript:;" class="item cancel-btn" @click="handleCancelReceipt">取消发票</a>
    </div>
    <div id="receiptForm" class="receipt-layer" style="display: none">
      <el-form :model="receiptForm" :rules="receiptRules" ref="receiptForm" label-width="100px">
        <el-form-item label="发票抬头" prop="receipt_title">
          <!--个人抬头 start-->
          <div
            class="ckt-checkbox title-receipt"
            :class="[selectedReceipt.receipt_title === '个人' && 'selected']"
            @click="handleSelectReceipt"
          >
            <span class="title">个人</span>
          </div>
          <!--个人抬头 end-->
          <!--个人发票抬头列表 start-->
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
              placeholder="单位发票抬头"
              @click.stop="() => {}"
            >
            <div class="title-btns">
              <a href="javascript:;" class="btn save-btn" @click.stop="handleSaveReceipt">保存</a>
              <a href="javascript:;" class="btn edit-btn" @click.stop="handleEditReceipt(receipt)">编辑</a>
              <a href="javascript:;" class="btn delete-btn" @click.stop="handleDeleteReceipt(receipt)">删除</a>
              <a href="javascript:;" class="btn cancel-btn" @click="receiptForm = {}">取消</a>
            </div>
          </div>
          <!--个人发票抬头列表 end-->
          <!--编辑抬头 start-->
          <div
            v-if="receiptForm.receipt_title !== undefined && receiptForm.receipt_id === -1"
            class="ckt-checkbox title-receipt selected editting"
          >
            <input class="company-receipt-input" v-model="receiptForm.receipt_title" maxlength="60" placeholder="新增单位发票抬头">
            <div class="title-btns">
              <a href="javascript:;" class="btn save-btn" @click.stop="handleSaveReceipt">保存</a>
            </div>
          </div>
          <!--编辑抬头 end-->
          <!--新增单位发票 start-->
          <a
            v-if="!receiptForm.receipt_id"
            href="javascript:;"
            class="add-receipt"
            @click="handleAddReceipt"
          >新增单位发票</a>
          <!--新增单位发票 end-->
        </el-form-item>
        <el-form-item
          v-if="receiptForm.tax_no !== undefined"
          label="发票税号"
          prop="tax_no"
        >
          <input
            v-model="receiptForm.tax_no"
            :readonly="receiptForm.receipt_title === undefined"
            class="duty-receipt-input"
            placeholder="请填写发票税号"
            maxlength="50"
          >
        </el-form-item>
        <el-form-item label="发票内容" prop="content">
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
   * 结算页
   * 发票组件
   */
  import * as API_Members from '@/api/members'
  import * as API_Trade from '@/api/trade'
  import { RegExp } from '@/ui-utils'
  export default {
    name: 'checkout-receipt',
    props: ['receipt'],
    data() {
      return {
        // 发票表单
        receiptForm: {},
        // 发票表单规则
        receiptRules: {
          receipt_title: [this.MixinRequired('请填写发票抬头！')],
          tax_no: [
            this.MixinRequired('请填写纳税人识别号！'),
            {
              validator: (rule, value, callback) => {
                if (!RegExp.TINumber.test(value)) {
                  callback(new Error('纳税人识别号格式不正确！'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
        },
        // 会员发票列表
        receipts: [],
        // 发票内容统一设置
        content: '明细',
        // 已选择发票
        selectedReceipt: this.receipt
      }
    },
    mounted() {
      // 获取会员发票列表
      this.GET_ReceiptList()
    },
    methods: {
      /** 修改发票信息 */
      handleEditReceiptInfo() {
        this.$layer.open({
          type: 1,
          title: '发票信息',
          zIndex: 200,
          area: '550px',
          scrollbar: false,
          content: $('#receiptForm'),
          btn: ['确认', '取消'],
          yes: this.handleConfirmReceipt
        })
      },
      /** 选择已有发票 */
      handleSelectReceipt(receipt) {
        this.receiptForm = {
          tax_no: receipt.tax_no
        }
        this.$refs['receiptForm'].clearValidate()
        if (!receipt.receipt_title) {
          this.selectedReceipt = {
            receipt_title: '个人',
            receipt_content: this.content
          }
          return false
        }
        this.selectedReceipt = JSON.parse(JSON.stringify(receipt))
      },
      /** 新增单位发票 */
      handleAddReceipt() {
        this.receiptForm = {
          receipt_id: -1,
          receipt_title: '',
          receipt_content: this.content,
          tax_no: ''
        }
        this.selectedReceipt = ''
      },
      /** 修改发票 */
      handleEditReceipt(receipt) {
        this.receiptForm = JSON.parse(JSON.stringify(receipt))
        this.selectedReceipt = ''
      },
      /** 删除发票 */
      handleDeleteReceipt(receipt) {
        if (receipt.receipt_id === this.selectedReceipt.receipt_id) {
          this.$message.error('已选择发票不能删除！')
          return
        }
        this.$confirm('确定要删除这个发票吗？', () => {
          API_Members.deleteReceipt(receipt.receipt_id).then(() => {
            this.$message.success('删除成功！')
            this.GET_ReceiptList()
          })
        })
      },
      /** 保存发票 */
      handleSaveReceipt() {
        const params = JSON.parse(JSON.stringify(this.receiptForm))
        const { receipt_title } = params
        const { receipt_id } = params
        if (receipt_id) {
          const hasSameTitle = this.receipts.filter(item => item.receipt_title === receipt_title)[0]
          if (hasSameTitle && hasSameTitle.receipt_id !== receipt_id) {
            this.$message.error('已经有相同的发票抬头了！')
            return false
          }
        }
        this.$refs['receiptForm'].validate((valid) => {
          if (valid) {
            const saveSuccess = () => {
              this.$message.success('保存成功！')
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
            this.$message.error('表单填写有误，请核对！')
            return false
          }
        })
      },
      /** 确认发票 */
      handleConfirmReceipt(index) {
        if (this.receiptForm.receipt_title !== undefined) {
          this.$message.error('请先保存正在编辑的发票！')
          return false
        }
        if (!this.selectedReceipt.receipt_title) {
          this.$message.error('请选择发票抬头！')
          return false
        }
        let receipt = JSON.parse(JSON.stringify(this.selectedReceipt)) || {}
        receipt.type = receipt.receipt_title === '个人' ? 0 : 1
        API_Trade.setRecepit(receipt).then(() => {
          this.$message.success('设置成功！')
          this.$emit('change', receipt)
          this.$layer.close(index)
        })
      },
      /** 取消发票 */
      handleCancelReceipt() {
        this.$confirm('确定要取消发票吗？', () => {
          API_Trade.cancelReceipt().then(() => {
            this.$message.success('取消成功！')
            this.$emit('change', {})
          })
        })
      },
      /** 获取发票列表 */
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
