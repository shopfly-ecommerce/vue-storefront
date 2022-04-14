<template>
  <div id="website-message">
    <div class="member-nav">
      <ul class="member-nav-list">
        <li>
          <nuxt-link to="./website-message">Unread messages</nuxt-link>
        </li>
        <li>
          <nuxt-link to="./website-message?type=all">All the news</nuxt-link>
        </li>
      </ul>
    </div>
    <div class="message-container">
      <empty-member v-if="tableData && !tableData.data.length">There is no intra-site message</empty-member>
      <ul v-else>
        <li v-for="message in tableData.data" :key="message.id" class="message-item">
          <div class="msg-time">{{ message.send_time | unixToDate }}</div>
          <div class="msg-box">
            <div class="msg-title">
              <h4>{{ message.title || 'Messages' }}</h4>
              <div class="message-tools">
                <i v-if="message.is_read === 0"
                   class="el-icon-check"
                   title="Mark as read"
                   @click="handleReadMessage(message)"
                ></i>
                <i class="el-icon-close" title="Delete the message" @click="handleDeleteMessage(message)"></i>
              </div>
            </div>
            <div class="msg-content clearfix">
              <div>{{ message.content }}</div>
              <!--<nuxt-link to="#">Check the details> </nuxt-link>-->
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="member-pagination" v-if="tableData && tableData.data.length">
      <a v-if="params.type !== 'all'" href="javascript:;" class="read-all" @click="handleReadPageMessages">Marks the current page as read</a>
      <el-pagination
        @current-change="handleCurrentPageChange"
        :current-page.sync="params.page_no"
        :page-size="params.page_size"
        layout="total, prev, pager, next"
        :total="tableData.data_total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import * as API_Message from '@/api/message'
  export default {
    name: 'website-message',
    head() {
      return {
        title: `Messages-${this.site.title}`
      }
    },
    data() {
      return {
        params: {
          page_no: 1,
          page_size: 5,
          type: this.$route.query.type
        },
        tableData: ''
      }
    },
    mounted() {
      this.GET_MessageList()
    },
    watch: {
      $route: function({ query }) {
        this.params.type = query.type
        this.params.page_no = 1
        this.GET_MessageList()
      },
    },
    methods: {
      /** The current page number changed*/
      handleCurrentPageChange(page) {
        this.params.page_no = page
        this.GET_MessageList()
      },
      /** Delete the message*/
      handleDeleteMessage(message) {
        this.$confirm('Are you sure you want to delete this message？', () => {
          API_Message.deleteMessage(message.id).then(async () => {
            await this.getUnreadMessageNumAction()
            this.$message.success('Delete the success！')
            this.GET_MessageList()
          })
        })
      },
      /** Mark the message as read*/
      handleReadMessage(message) {
        API_Message.messageMarkAsRead(message.id).then(async () => {
          await this.getUnreadMessageNumAction()
          this.GET_MessageList()
        })
      },
      /** Marks the current page message as read*/
      handleReadPageMessages() {
        const ids = this.tableData.data.map(item => item.id).join(',')
        API_Message.messageMarkAsRead(ids).then(async () => {
          await this.getUnreadMessageNumAction()
          this.GET_MessageList()
        })
      },
      /** Get the intra-site message*/
      GET_MessageList(){
        const params = JSON.parse(JSON.stringify(this.params))
        if (params.type !== 'all') {
          params.read = 0
        } else {
          delete params.read
        }
        API_Message.getMessages(params).then(response => {
          this.tableData = response
          this.MixinScrollToTop()
        })
      },
      ...mapActions(['getUnreadMessageNumAction'])
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/styles/color";
  .message-container {
    padding-top: 10px;
  }
  .message-item {
    position: relative;
    text-align: center;
    margin-bottom: 15px;
    .msg-time {
      display: inline-block;
      background-color: #f7f7f7;
      height: 20px;
      padding: 0 10px;
      margin-bottom: 10px;
      border-radius: 1px;
      text-align: center;
    }
    .msg-box {
      position: relative;
      padding: 10px 20px;
      background-color: #f3f3f3;
      border: 1px solid #FFF;
      text-align: left;
      &:hover { border: 1px solid #dbdbdb }
      .msg-title {
        position: relative;
        height: 32px;
        line-height: 32px;
        border-bottom: 1px solid #d3d3d3;
        .message-tools {
          position: absolute;
          top: 0;
          right: 0;
        }
        .el-icon-check {
          margin-right: 10px;
        }
        .el-icon-close, .el-icon-check {
          width: 20px;
          height: 20px;
          text-align: center;
          line-height: 20px;
          cursor: pointer;
        }
      }
      .msg-content {
        width: 100%;
        padding-top: 10px;
        a { float: right }
      }
    }
  }
  .member-pagination {
    position: relative;
    .read-all {
      position: absolute;
      left: 10px;
      color: $color-href;
      &:hover {
        color: $color-main;
        text-decoration: underline;
      }
    }
  }
</style>
