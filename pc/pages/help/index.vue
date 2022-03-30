<template>
  <div class="help-index">
    <div class="list-box">
      <template v-for="(cate, index) in $parent.categorys">
        <dl v-if="index < 6" :key="cate.id" :class="['list-item', 'list-item-' + index]">
          <dt class="list-tit">{{ cate.name }}</dt>
          <dd class="list-cnt">
            <ul>
              <li v-for="article in cate.articles" :key="article.article_id" class="article-item">
                <nuxt-link :to="'/help/' + article.article_id">{{ article.article_name }}</nuxt-link>
              </li>
              <li v-if="!cate.articles || !cate.articles.length">
                暂无文章...
              </li>
            </ul>
          </dd>
        </dl>
        <span v-if="index % 2 === 1" :key="'clr-' + cate.id" class="clr"></span>
      </template>
    </div>
  </div>
</template>

<script>
	export default {
		name: 'help-index'
	}
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/styles/color";
  .help-index {
    .list-box {
      overflow: hidden;
      padding-left: 10px;
      padding-top: 10px;
    }
    .list-item {
      float: left;
      width: 350px;
      min-height: 150px;
      margin-right: 13px;
      overflow: hidden;
      $stars: (#4db7eb, #85b716, #f8bb00, #8099eb, #e191f6, #ff5722);
      @for $i from 1 through length($stars) {
        &.list-item-#{$i} .list-tit {
          border-color: nth($stars, $i);
        }
      }
    }
    .list-tit {
      font-size: 14px;
      margin-bottom: 10px;
      border-left: 4px solid;
      padding-left: 5px;
      height: 13px;
      line-height: 15px;
    }
    .list-cnt {
      padding-left: 10px;
      margin-bottom: 35px;
    }
    .article-item {
      float: left;
      width: 33%;
      line-height: 25px;
      a {
        color: $color-href;
        &:hover { color: $color-main }
      }
    }
  }
</style>
