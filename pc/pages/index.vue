<template>
  <div class="container">
    <index-search-bar/>
    <div class="focus-container">
      <div class="w">
        <index-banner :focus-list="focusList"/>
        <index-card/>
      </div>
    </div>
    <index-seckill/>
    <div v-if="floorList" class="floor-container">
      <div v-for="(item, index) in floorList" :key="index" :class="'item-' + item.tpl_id" class="floor-item">
        <component
          :is="templates[item.tpl_id]"
          :data="item"
        ></component>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Tag } from 'element-ui'
  Vue.use(Tag)
  import * as IndexComponents from '@/pages/-index'
  import * as API_Home from '@/api/home'
  import templates, { templateArray } from './-index/templates'
  export default {
    name: 'index',
    async asyncData() {
      const datas = await Promise.all([
        API_Home.getFloorData(),
        API_Home.getFocusPictures()
      ])
      const floor = datas[0]
      return {
        // 楼层数据
        floorList: floor.page_data ? global.JSON.parse(floor.page_data) : [],
        // 焦点图
        focusList: datas[1]
      }
    },
    head() {
      return {
        title: `商城首页-${this.site.title}`
      }
    },
    components: { ...IndexComponents },
    data() {
      return {
        /** 首页卡片tab x坐标 */
        card_news_tab_x: 0,
        floorList: '',
        templates,
        templateArray,
      }
    },
    mounted() {
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../assets/styles/color";
  @import "./-index/templates/floor-pc";
  .container {
    background-color: #F9F9F9;
    padding-bottom: 20px;
  }
  .focus-container {
    height: 500px;
    .index-card {
      position: absolute;
    }
    .w {
      position: relative;
    }
    .swiper-container {
      height: 100%;
    }
    /deep/ .swiper-pagination-index {
      position: relative;
      .custom-pagination-inner {
        display: block;
        position: absolute;
        z-index: 1;
        left: 50%;
        bottom: 20px;
        font-size: 0;
        padding: 4px 8px;
        border-radius: 12px;
        background-color: hsla(0, 0%, 100%, 0.4);
        .custom-pagination-btn {
          display: inline-block;
          margin-right: 10px;
          width: 12px;
          height: 12px;
          border-radius: 100%;
          background-color: #fff;
          cursor: pointer;
        }
        .custom-pagination-btn.__active__ {
          background-color: $color-main;
        }
        .custom-pagination-btn.__last__ {
          margin-right: 0;
        }
      }
    }
  }
  .floor-container {
    width: 1210px;
    margin: 0 auto;
  }
  .floor-item:after {
    content: ' ';
    display: block;
    clear: both;
  }
</style>
