<template>
  <div id="goods-comments" class="goods-comments">
    <div class="inner-comments">
      好评率：<em>{{ grade }}%</em>
    </div>
    <div v-if="comments" class="content-comments">
      <div v-for="comment in comments.data" :key="comment.ask_id" class="item-comments">
        <div class="cons-left">
          <en-face :url="comment.member_face" class="face-comments"/>
          <div class="name-comments" :title="comment.member_name">{{ comment.member_name }}</div>
        </div>
        <div class="cons-right">
          <div class="time-cons">
            <span class="grade">评价：<em>{{ comment.grade | filterGrade }}</em></span>
            {{ comment.create_time | unixToDate }}
          </div>
          <div class="box-cons">
            <p class="content-cons" v-html="comment.content.replace(/\n/g, '<br>')"></p>
            <div v-if="comment.images && comment.images.length" class="comment-images">
              <viewer :images="comment.images">
                <a
                  :key="index"
                  class="comment-img-item"
                  v-for="(image, index) in comment.images"
                >
                  <img :src="image" alt="">
                </a>
              </viewer>
              <span class="clear"></span>
            </div>
            <template v-if="comment.reply_status === 1 && comment.reply">
              <p class="reply-p">掌柜回复：</p>
              <p class="reply-cons" style="overflow:hidden;word-break: break-word;">{{ comment.reply.content }}</p>
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
      :total="comments.data_total">
    </el-pagination>
  </div>
</template>

<script>
  /**
   * 商品评论模块
   * 这里只负责展示商品的评论
   */
  import * as API_Members from '@/api/members'
  export default {
    name: "goods-comments",
    props: ['goods-id', 'grade'],
    data() {
      return {
        params: {
          page_no: 1,
          page_size: 10
        },
        comments: ''
      }
    },
    mounted() {
      this.GET_GoodsComments()
    },
    filters: {
      /** 评分 */
      filterGrade(val) {
        switch (val) {
          case 'bad':
            return '差评'
          case 'neutral':
            return '中评'
          default:
            return '好评'
        }
      }
    },
    methods: {
      /** 当页数发生改变时 */
      handleCurrentPageChange(page_no) {
        this.params.page_no = page_no
        this.GET_GoodsComments()
      },
      /** 获取商品评论 */
      GET_GoodsComments(){
        API_Members.getGoodsComments(this.goodsId, this.params).then(response => {
          this.comments = response
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/styles/color";
  .goods-comments {
    background-color: #fff;
    padding: 40px 30px 30px;
    .inner-comments {
      font-size: 18px;
      color: $color-main;
      font-weight: 600;
    }
    .content-comments {
      border-top: 1px dashed #ccc;
      margin-top: 20px;
    }
    .item-comments {
      margin-top: 15px;
    }
    .cons-left {
      float: left;
      width: 70px;
      .face-comments, .name-comments {
        width: 50px;
        height: 50px;
        text-align: center;
      }
      .name-comments {
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
        padding: 10px 10px 10px 0;
        text-align: right;
        font-size: 14px;
        border-bottom: 1px dashed #ccc;
        .grade {
          float: left;
        }
      }
      .box-cons {
        width: 900px - 70px - 40px;
        background-color: #fff;
        min-height: 50px;
        margin-top: 10px;
        box-sizing: border-box;
        padding: 10px;
        .reply-p {
          color: darken($color-main, 10%);
          border-top: 1px dashed #e2e2e2;
          margin-top: 10px;
          padding-top: 5px;
        }
      }
    }
    /deep/ .el-pagination {
      text-align: right;
      padding: 10px 0;
    }
  }
  .comment-images {
    padding: 10px 0;
  }
  .comment-img-item {
    float: left;
    display: block;
    width: 50px;
    height: 50px;
    margin-right: 10px;
    cursor: pointer;
    border: 1px solid #e2e2e2;
    padding: 1px;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
