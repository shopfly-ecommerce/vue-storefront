<template>
  <div id="goods-consulting" class="goods-consulting">
    <div class="inner-consulting">
      <span class="consu-tip">因厂家更改商品包装、场地、附配件等不做提前通知，且每位咨询者购买、提问时间等不同。为此，客服回复的咨询只针对当前当天咨询问题，给您带来的不便还请谅解，谢谢！</span>
      <a href="javascript:;" class="want-consu-btn" @click="handleShowPrompt">我要咨询</a>
    </div>
    <div v-if="consulting" class="content-consulting">
      <div v-for="consult in consulting.data" :key="consult.ask_id" class="item-consulting">
        <div class="cons-left">
          <en-face :url="consult.member_face" class="face-consulting"/>
          <div class="name-consulting" :title="consult.member_name">{{ consult.member_name }}</div>
        </div>
        <div class="cons-right">
          <div class="time-cons">{{ consult.create_time | unixToDate }}</div>
          <div class="box-cons">
            <p class="content-cons" v-html="consult.content.replace(/\n/g, '<br>')"></p>
            <template v-if="consult.reply_status === 1">
              <p style="margin-top: 10px;color: #e6a23c">掌柜回复：</p>
              <p class="reply-cons">{{ consult.reply }}</p>
            </template>
          </div>
        </div>
        <span class="clr"></span>
      </div>
    </div>
    <el-pagination
      @current-change="handleCurrentPageChange"
      :current-page.sync="params.page_no"
      :page-size="params.page_size"
      layout="total, prev, pager, next"
      :total="consulting.data_total">
    </el-pagination>
  </div>
</template>

<script>
  /**
   * 商品咨询模块
   * 这里可以对商品进行咨询
   */
  import * as API_Members from '@/api/members'
  import Storage from '@/utils/storage'
  export default {
    name: "goods-consulting",
    props: ['goodsId'],
    data() {
      return {
        params: {
          page_no: 1,
          page_size: 10
        },
        consulting: ''
      }
    },
    mounted() {
      this.GET_Consulting()
    },
    methods: {
      /** 当页数发生改变时 */
      handleCurrentPageChange(page_no) {
        this.params.page_no = page_no
        this.GET_Consulting()
      },
      /** 显示咨询窗 */
      handleShowPrompt() {
        if (!Storage.getItem('user')) {
          this.$confirm('您还未登录，要现在去登录吗？', () => {
            this.$router.push({ path: '/login', query: { forward: this.$route.path } })
          })
          return false
        }
        this.$layer.prompt({
          formType: 2,
          title: '向商家咨询',
          maxlength: 200,
          area: ['300px', '60px'],
          scrollbar: false
        }, (value, index, elem) => {
          if (!value.trim()) return false
          value.replace(/\n/g, '<br>')
          API_Members.consultating(this.goodsId, value).then(() => {
            layer.close(index)
            this.$message.success('提交成功！')
            this.GET_Consulting()
          })
        })
      },
      /** 获取咨询列表 */
      GET_Consulting() {
        API_Members.getGoodsConsultations(this.goodsId, this.params).then(response => {
          this.consulting = response
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/styles/color";
  .goods-consulting {
    background-color: #fff;
    padding: 40px 30px 30px;
    .inner-consulting {
      position: relative;
      border: 1px solid #d7d7d7;
      height: 67px;
      padding: 10px 10px 20px 10px;
      background: url(../../assets/images/icon-goods-consulting-tip.png) no-repeat 10px 10px;
    }
    .consu-tip {
      color: #9b827d;
      height: 36px;
      left: 70px;
      line-height: 18px;
      position: absolute;
      top: 40px;
      width: 600px;
    }
    .want-consu-btn {
      padding: 5px 20px;
      background-color: $color-main;
      border-color: $color-main;
      color: #fff;
      position: absolute;
      top: 30px;
      right: 30px;
      &:hover { background-color: darken($color-main,10%) }
    }
    .content-consulting {
      border-top: 1px dashed #ccc;
      margin-top: 20px;
    }
    .item-consulting {
      margin-top: 15px;
    }
    .cons-left {
      float: left;
      width: 70px;
      .face-consulting, .name-consulting {
        width: 50px;
        height: 50px;
        text-align: center;
      }
      .name-consulting {
        height: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .cons-right {
      float: left;
      box-sizing: border-box;
      width: 900px - 70px;
      min-height: 100px;
      padding: 20px;
      background-color: #fafafa;
      .time-cons {
        padding: 10px;
        text-align: right;
        font-size: 14px;
        border-bottom: 1px dashed #ccc;
      }
      .box-cons {
        width: 900px - 70px - 40px;
        background-color: #fff;
        min-height: 50px;
        margin-top: 10px;
        box-sizing: border-box;
        padding: 10px;
        p { color: $color-main }
        p.reply-cons {
          color: #666;
        }
      }
    }
    /deep/ .el-pagination {
      text-align: right;
      padding: 10px 0;
    }
  }
</style>
