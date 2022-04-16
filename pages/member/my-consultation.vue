<template>
  <div id="my-consultation">
    <div class="member-nav">
      <ul class="member-nav-list">
        <li class="active">
          <nuxt-link to="./my-consultation">My advice</nuxt-link>
        </li>
      </ul>
    </div>
    <empty-member v-if="consultation && !consultation.data.length">No consulting</empty-member>
    <template v-else>
      <div class="consultation-container">
        <ul>
          <li v-for="consultation in consultation.data" :key="consultation.ask_id" class="comment-item">
            <div class="comment-title">
              <a :href="'/goods/' + consultation.goods_id" target="_blank">{{ consultation.goods_name }}</a>
              <span>{{ consultation.create_time | unixToDate }}</span>
            </div>
            <div class="comment-body">
              <div class="comment-content">
                <strong>Consulting content：</strong>
                <div>
                  <p v-html="consultation.content.replace(/\n/g, '<br>')"></p>
                </div>
              </div>
              <div class="comment-content seller-reply">
                <strong>Business reply：</strong>
                <div>
                  <p>{{ consultation.reply || 'Temporary didnt respond' }}</p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="member-pagination" v-if="consultation">
        <el-pagination
          @current-change="handleCurrentPageChange"
          :current-page.sync="params.page_no"
          :page-size="params.page_size"
          layout="total, prev, pager, next"
          :total="consultation.data_total">
        </el-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  import * as API_Members from '@/api/members'
  export default {
    name: 'my-consultation',
    head() {
      return {
        title: `My advice-${this.site.title}`
      }
    },
    data() {
      return {
        consultation: '',
        params: {
          page_no: 1,
          page_size: 10
        }
      }
    },
    mounted() {
      this.GET_Consulatation()
    },
    methods: {
      /** The current page number changed*/
      handleCurrentPageChange(page) {
        this.params.page_no = page
        this.GET_Consulatation()
      },
      /** Get my advice*/
      GET_Consulatation() {
        API_Members.getConsultations(this.params).then(response => {
          this.consultation = response
          this.MixinScrollToTop()
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/styles/color";
  .consultation-container {
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
      float: left;
      color: $color-href;
      margin-left: 10px;
      margin-right: 20px;
      display: -webkit-box;
      max-width: 500px;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      &:hover { color: $color-main }
    }
  }
  .comment-body {
    border: 1px solid #e7e7e7;
    overflow: hidden;
    padding: 10px;
    border-top: none;
  }
  .comment-content {
    strong { flex-shrink: 0 }
    display: flex;
    margin-bottom: 5px;
    &.seller-reply { color: #FF5722 }
  }
</style>
