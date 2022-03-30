<template>
  <div style="background-color: #f9f9f9">
    <en-header-other title="帮助中心"/>
    <div v-if="categorys" class="help-container">
      <div class="help-menus">
        <nuxt-link to="./" class="h3-title">帮助中心</nuxt-link>
        <dl
          v-for="cate in categorys"
          :key="cate.id"
          :class="['subside-mod', cate.on ? 'on' : 'off']"
        >
          <dt class="title" @click="cate.on = !cate.on">
            {{ cate.name }} <b class="icon-triangle"></b>
          </dt>
          <dd v-if="cate.articles" class="subside-cnt" :style="{height: cate.articles.length * 31 + 'px'}">
            <ul class="subside-list">
              <li v-for="article in cate.articles" :key="article.article_id" class="list-item">
                <nuxt-link :to="'/help/' + article.article_id">{{ article.article_name }}</nuxt-link>
              </li>
            </ul>
          </dd>
        </dl>
      </div>
      <div class="help-content">
        <nuxt-child class="content"/>
      </div>
    </div>
    <span class="clr"></span>
  </div>
</template>

<script>
  import * as API_Article from '@/api/article'
  export default {
    name: 'help',
    layout: 'full',
    async asyncData({ params }) {
      let { id } = params
      if (id) id = Number(id)
      const data = await API_Article.getArticleCategory('HELP')
      let categorys = data.children || []
      categorys = categorys.map(item => {
        item.on = false
        if (!item.articles || !id) return item
        if (item.articles && item.articles.findIndex(_item => _item.article_id === id) !== -1) {
          item.on = true
        }
        return item
      })
      return { categorys }
    },
    head() {
      return {
        title: `帮助中心-${this.site.tilte}`
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../assets/styles/color";
  .help-container {
    width: 1000px;
    margin: 20px auto;
    overflow: hidden;
  }
  .help-menus {
    width: 210px;
    float: left;
    .h3-title {
      display: block;
      color: #fff;
      text-align: center;
      font-size: 18px;
      line-height: 40px;
      height: 40px;
      background-color: $color-main;
      font-weight: normal;
    }
    .subside-mod {
      .title {
        position: relative;
        height: 39px;
        line-height: 39px;
        padding-left: 45px;
        background-color: #eaeaea;
        border-bottom: 1px solid #fff;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          background-color: #dadada;
        }
      }
      &.on .icon-triangle {
        border-width: 0 5px 5px;
      }
      .icon-triangle {
        border-style: solid dashed solid dashed;
        border-color: #999 transparent #999 transparent;
        border-width: 5px 5px 0;
        position: absolute;
        top: 17px;
        right: 20px;
        font-size: 0;
        line-height: 0;
        height: 0;
        overflow: hidden;
        transition: all ease .3s;
      }
    }
    .subside-mod.off .subside-cnt {
      height: 0 !important;
    }
    .subside-cnt {
      height: 0;
      transition: all ease .3s;
      background-color: #fff;
      overflow: hidden;
      .list-item {
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #faf8f9;
        a {
          padding-left: 45px;
          color: #333;
          &:hover, &.nuxt-link-active {
            color: $color-main;
          }
        }
      }
    }
  }
  .help-content {
    float: left;
    width: 780px;
    min-height: 800px;
    margin-left: 10px;
    background-color: #fff;
  }
</style>
