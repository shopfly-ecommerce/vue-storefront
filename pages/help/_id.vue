<template>
  <div class="container">
    <div class="help-breadcrumb">
      <span>{{ categoryName }}</span>
      &gt;
      <a href="#"><span id="sLevel2">{{ article.article_name }}</span></a>
    </div>
    <div class="help-header">
      <h1>{{ article.article_name }}</h1>
      <h2>{{ article.modify_time | unixToDate }}</h2>
    </div>
    <div class="help-body" v-html="article.content"></div>
  </div>
</template>

<script>
  import * as API_Article from '@/api/article'
  export default {
    name: 'help-detail',
    async asyncData({ params }) {
      const article = await API_Article.getArticleDetail(params.id)
      return { article }
    },
    head() {
      return {
        title: `${this.article.article_name}-${this.site.site_name}`
      }
    },
    computed: {
      categoryName() {
        const { categorys } = this.$parent
        const cate = categorys.filter(item => item.id === this.article.category_id)[0]
        return cate.name
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .help-breadcrumb {
    height: 39px;
    line-height: 39px;
    font-size: 14px;
    background: #eaeaea;
    padding-left: 13px;
  }
  .help-header {
    text-align: center;
    h1 {
      color: #3d3f3e;
      font: 600 16px/32px "microsoft yahei";
    }
    h2 {
      border-bottom: 1px solid #d2d2d2;
      color: #9a9a9a;
      font-weight: normal;
      font: 12px/20px Arial, Verdana, "宋体", "Lucida Grande", "Lucida Sans Unicode", Helvetica, sans-serif;
      padding: 5px 0 10px;
    }
  }
  .help-body {
    padding: 10px 20px;
  }
</style>
