<template>
  <div id="my-comments">
    <div class="member-nav">
      <ul class="member-nav-list">
        <li class="active">
          <a href="./my-comments">我的评论</a>
        </li>
      </ul>
    </div>
    <empty-member v-if="comments && !comments.data.length">暂无评论</empty-member>
    <template v-else>
      <div class="comments-container">
        <ul>
          <li v-for="comment in comments.data" :key="comment.comment_id" class="comment-item">
            <div class="comment-title">
              <a :href="'/goods/' + comment.goods_id">{{ comment.goods_name }}</a>
              <span>{{ comment.create_time | unixToDate }}</span>
            </div>
            <div class="comment-body">
              <strong>我的评论：</strong>
              <div>
                <p v-html="comment.content.replace(/\n/g, '<br>')"></p>
                <div v-if="comment.images && comment.images.length > 0" class="comment-gallery">
                  <a v-for="(image, index) in comment.images" :key="index" :href="image" target="_blank">
                    <img :src="image" class="comment-thumbnail">
                  </a>
                </div>
              </div>
            </div>
            <div v-if="comment.reply_status === 1" class="comment-body reply">
              <strong>掌柜回复：</strong>
              <div>
                <p v-html="comment.reply.content.replace(/\n/g, '<br>')"></p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="member-pagination" v-if="comments">
        <el-pagination
          @current-change="handleCurrentPageChange"
          :current-page.sync="params.page_no"
          :page-size="params.page_size"
          layout="total, prev, pager, next"
          :total="comments.data_total">
        </el-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  import * as API_Members from '@/api/members'
  export default {
    name: 'my-comments',
    head() {
      return {
        title: `我的评论-${this.site.title}`
      }
    },
    data() {
      return {
        comments: '',
        params: {
          page_no: 1,
          page_size: 10
        }
      }
    },
    mounted() {
      this.GET_Comments()
    },
    methods: {
      /** 当前页数发生改变 */
      handleCurrentPageChange(page) {
        this.params.page_no = page
        this.GET_Comments()
      },
      GET_Comments() {
        API_Members.getComments(this.params).then(response => {
          this.comments = response
          this.MixinScrollToTop()
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/styles/color";
  .comments-container {
    padding-top: 10px;
  }
  .comment-item {
    margin-bottom: 10px;
  }
  .comment-title {
    padding: 5px 0;
    border: 1px solid #e7e7e7;
    background: #fafafa;
    overflow: hidden;
    a {
      color: $color-href;
      margin-left: 10px;
      margin-right: 20px;
      &:hover { color: $color-main }
    }
  }
  .comment-body {
    display: flex;
    border: 1px solid #e7e7e7;
    overflow: hidden;
    padding: 10px;
    border-top: none;
    &.reply {
      color: $color-main;
    }
    strong {
      width: 60px;
      flex-shrink: 0;
    }
    .comment-gallery {
      margin-top: 10px;
    }
    .comment-thumbnail {
      width: 100px;
      height: 100px;
      margin-right: 10px;
    }
  }
</style>
