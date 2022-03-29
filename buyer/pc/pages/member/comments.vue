<template>
  <div id="comments">
    <el-form v-if="!cantComments" :model="commentsForm" :rules="commentsRules" ref="commentsForm">
      <div class="comments-goods-box">
        <div v-for="(comment, index) in commentsForm.comments" :key="index" class="comments-item">
          <a :href="'/goods/' + skulist[index].goods_id + '?sku_id=' + skulist[index].sku_id" target="_blank" class="comments-goods">
            <div class="goods-image"><img :src="skulist[index].goods_image" :alt="skulist[index].name"></div>
            <div class="goods-name">
              <span>{{ skulist[index].name }}</span>
              <p class="sku-spec">{{ skulist[index] | formatterSkuSpec }}</p>
            </div>
          </a>
          <div class="comments-content">
            <div class="comments-grade">评分：
              <el-radio-group
                v-model="comment.grade"
                @change="(value) => { commentsRules.comments[index].content[0].required = value !== 'good' }"
              >
                <el-radio label="good">好评</el-radio>
                <el-radio label="neutral">中评</el-radio>
                <el-radio label="bad">差评</el-radio>
              </el-radio-group>
            </div>
            <div class="comments-input">
              <el-form-item :prop="'comments.' + index + '.content'" label="">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 10 }"
                  :maxlength="300"
                  placeholder="请在此处输入您的评论"
                  v-model="comment.content">
                </el-input>
              </el-form-item>
            </div>
            <div :class="['comments-images', comment.images.length >= 5 && 'limit']">
              <el-upload
                :action="MixinUploadApi"
                list-type="picture-card"
                multiple
                :on-exceed="() => { $message.error('超过最大可上传数！') }"
                :limit="5"
                :on-success="(res, file, fileList) => { comment.images = fileList }"
                :on-remove="(file, fileList) => { comment.images = fileList }"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
            <p>您收到的商品是什么样的呢？晒个照片吧（最多可上传5张照片）</p>
          </div>
        </div>
      </div>
      <div class="comments-btn-box">
        <el-button type="danger" @click="submitForm">发表评论</el-button>
      </div>
    </el-form>
    <div v-else class="cant-comments">
      <h3><i class="el-icon-warning"></i>该订单不能评论！</h3>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Rate, RadioGroup, Radio, Upload } from 'element-ui'
  Vue.use(Rate).use(RadioGroup).use(Radio).use(Upload)
  import * as API_Order from '@/api/order'
  import * as API_Members from '@/api/members'
  export default {
    name: 'comments',
    head() {
      return {
        title: `评价商品-${this.site.title}`
      }
    },
    data() {
      return {
        order_sn: this.$route.query.order_sn,
        skulist: '',
        commentsForm: {},
        commentsRules: {
          comments: []
        },
        // 评分颜色
        rateColors: ['#99A9BF', '#F7BA2A', '#FF9900'],
        // 不能评论【已评论过】
        cantComments: false
      }
    },
    mounted() {
      API_Order.getOrderDetail(this.order_sn).then(response => {
        if (!response.order_operate_allowable_vo.allow_comment) {
          this.cantComments = true
          return false
        }
        this.skulist = response.order_sku_list
        this.commentsForm = {
          order_sn: this.order_sn,
          delivery_score: 5,
          description_score: 5,
          service_score: 5,
          comments: response.order_sku_list.map((item, index) => {
            this.commentsRules.comments[index] = {}
            this.commentsRules.comments[index].content = [{ required: false, message: '可以告诉我们您遇到了什么问题吗？', trigger: 'blur' }]
            return {
              sku_id: item.sku_id,
              content: '',
              grade: 'good',
              images: []
            }
          })
        }
      })
    },
    methods: {
      submitForm() {
        this.$refs['commentsForm'].validate((valid) => {
          if (valid) {
            const params = JSON.parse(JSON.stringify(this.commentsForm))
            params.comments.map(item => {
              item.images = item.images.map(img => img.response.url)
              return item
            })
            API_Members.commentsOrder(params).then(() => {
              this.$message.success('发表成功！')
              this.$router.replace({ path: '/member/my-order' })
            })
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
  .shop-grade {
    overflow: hidden;
    margin-bottom: 20px;
    h3 {
      font-size: 12px;
      color: #fc982c;
      height: 30px;
      line-height: 30px;
      i { margin-right: 5px; font-size: 14px }
    }
    .shop-grade-item {
      display: inline-block;
      margin-right: 20px;
      .el-rate {
        position: relative;
        top: -2px;
        display: inline-block;
        .el-rate__text {
          font-size: 12px;
        }
      }
    }
  }
  .comments-goods-box {
    overflow: hidden;
    .comments-item {
      width: 100%;
      border-top: 1px solid #e4e4e4;
      overflow: hidden;
      ::before {
        display: block;
        clear: both;
      }
    }
    .comments-goods {
      display: block;
      float: left;
      width: 219px;
      padding: 30px 50px;
    }
    .goods-image {
      width: 150px;
      height: 150px;
      margin: 0 auto;
      img { width: 100%; height: 100% }
    }
    .goods-name{
      text-align: center;
    }
    .comments-content {
      float: left;
      width: 630px;
      min-height: 300px;
      padding-left: 40px;
      border-left: 1px solid #e4e4e4;
    }
    .comments-grade {
      margin: 20px 0;
    }
    .comments-input /deep/ .el-form-item.is-success .el-textarea__inner {
      border-color: #dcdfe6;
    }
    .comments-images {
      width: 630px;
      height: 113px;
      overflow: hidden;
      &.limit /deep/ .el-upload--picture-card { display: none !important; }
      /deep/ {
        .el-upload-list__item, .el-upload--picture-card, .el-progress {
          width: 100px;
          height: 100px;
        }
        .el-upload--picture-card, .el-progress {
          line-height: 100px;
        }
        .el-upload-list__item-status-label i {
          margin-top: 6px !important;
        }
        .el-progress-circle {
          width: 75px !important;
          height: 75px !important;
          margin: 12.5px !important;
        }
        .el-progress__text {
          font-size: 14px !important;
        }
        .el-icon-plus {
          line-height: inherit !important;
        }
      }
    }
  }
  .comments-btn-box {
    width: 100%;
    text-align: center;
    margin-top: 30px;
    .el-button {
      width: 175px;
      background-color: #df3033;
      &:hover {
        background-color: #be2629
      }
    }
  }
  .cant-comments {
    width: 100%;
    text-align: center;
    line-height: 100px;
    font-size: 18px;
    color: #fc982c;
    i { margin-right: 10px }
  }
</style>
