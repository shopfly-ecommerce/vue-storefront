<template>
  <div id="group-buy">
    <div class="nav-bar">
      <div class="w">
        <template v-for="(cate, index) in categorys">
          <div
            v-if="index < 10"
            :key="cate.cat_id"
            :class="['cate-item', cate.active && 'active']"
            @click="handleClickCate(cate)"
          >{{ cate.cat_name }}</div>
        </template>
      </div>
    </div>
    <div class="group-buy w">
      <div v-if="groupBuy && !groupBuy.data.length" class="no-data">暂无数据...</div>
      <ul v-else class="group-buy-list">
        <li v-for="(gb, index) in groupBuy.data" :key="index">
          <div class="gl-item">
            <div class="gl-img">
              <a :href="'/goods/' + gb.goods_id" target="_blank">
                <img :src="gb.img_url" :alt="gb.goods_name">
              </a>
            </div>
            <div class="gl-price">
              <strong><em>¥</em><i>{{ gb.price | unitPrice }}</i></strong>
              <span class="gl-original-price">￥{{ gb.original_price | unitPrice }}</span>
            </div>
            <div class="gl-name">
              <a :href="'/goods/' + gb.goods_id" :title="gb.goods_name" target="_blank">
                <em>{{ gb.goods_name }}</em>
              </a>
            </div>
            <p class="gl-sub-title">{{ gb.gb_title }}</p>
            <div class="gl-buy-count">已销售：{{ gb.show_buy_num }}件</div>
            <a :href="'/goods/' + gb.goods_id" target="_blank" class="gl-join-btn">我要参团</a>
          </div>
        </li>
      </ul>
      <el-pagination
        v-if="groupBuy"
        @current-change="handleCurrentPageChange"
        :current-page.sync="groupBuy.page_no"
        :page-size="groupBuy.page_size"
        layout="total, prev, pager, next"
        :total="groupBuy.data_total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Pagination } from 'element-ui'
  Vue.use(Pagination)
  import * as API_Promotions from '@/api/promotions'
  export default {
    name: 'group-buy',
    head() {
      return {
        title: `团购-${this.site.title}`
      }
    },
    data() {
      return {
        params: {
          page_no: 1,
          page_size: 10,
          cat_id: 0
        },
        categorys: [
          { cat_id: 0, cat_name: '全部', active: true }
        ],
        groupBuy: ''
      }
    },
    mounted() {
      // 获取团购分类
      API_Promotions.getGroupBuyCategorys().then(response => {
        this.categorys.push(...response.sort((x, y) => x.cat_order > y.cat_order))
      })
      this.GET_GroupBuyGoods()
    },
    methods: {
      /** 当前分页数发生改变 */
      handleCurrentPageChange(page_no) {
        this.params.page_no = page_no
        this.GET_GroupBuyGoods()
      },
      /** 选择团购分类 */
      handleClickCate(cate) {
        const { categorys } = this
        this.$set(this, 'categorys', categorys.map(item => {
          item.active = item.cat_id === cate.cat_id
          return item
        }))
        this.params.cat_id = cate.cat_id
        this.GET_GroupBuyGoods()
      },
      /** 获取团购商品 */
      GET_GroupBuyGoods() {
        const params = JSON.parse(JSON.stringify(this.params))
        if (params.cat_id === 0) delete params.cat_id
        API_Promotions.getGroupBuyGoods(params).then(response => {
          this.groupBuy = response
          this.MixinScrollToTop()
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../assets/styles/color";
  .nav-bar {
    width: 100%;
    height: 40px;
    background-color: $color-main;
  }
  .cate-item {
    float: left;
    height: 24px;
    line-height: 24px;
    margin-top: 7px;
    padding: 0 10px;
    font-size: 14px;
    font-weight: 600;
    color: #FFCFBF;
    margin-right: 10px;
    border-radius: 12.5px;
    transition: background-color, border-color ease .2s;
    cursor: pointer;
    border: 2px solid $color-main;
    &.active {
      background-color: #fff;
      color: $color-main
    }
    &:hover {
      border-color: #FFCFBF;
    }
  }
  .group-buy {
    margin-top: 20px;
    margin-bottom: 50px;
  }
  .group-buy-list {
    overflow: hidden;
    padding: 20px 10px;
    li {
      width: 234px;
      height: 400px;
      float: left;
      position: relative;
      z-index: 1;
      margin-top: 10px;
      box-shadow: 0 0 0 0 #e4e7ed;
      transition: box-shadow .2s ease;
    }
    li:hover {
      border-color: #e9e9e9;
      box-shadow: 0 0 5px 2px #e4e7ed;
      z-index: 2;
      .gl-join-btn {
        opacity: 1 !important;
      }
    }
  }
  .gb-item {
    font-size: 12px;
    background-color: #FFF;
    vertical-align: top;
    letter-spacing: normal;
    word-spacing: normal;
    display: inline-block;
    margin-bottom: 20px;
    border: solid 1px #E7E7E7;
    margin: -1px;
    &:hover {
      border-width: 0;
      .inner-gb-item {
        padding: 11px;
        border: solid 1px $color-main;
        box-shadow: 0 0 3px rgba(204,204,204,0.9);
        .group_num {
          display: none;
        }
        .buy-button {
          opacity: 1;
          filter: alpha(opacity=100)/*IE*/;
        }
      }
    }
  }
  /deep/ .el-pagination {
    padding: 10px 0 30px 0;
    text-align: right;
    margin-top: 30px;
  }
  .no-data {
    text-align: center;
    height: 100px;
    line-height: 100px;
  }
  .gl-item {
    padding: 12px 6px;
    width: 220px;
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    background: #fff;
    border: 1px solid #fff;
    transition: border-color .1s ease;
    .gl-img {
      margin-bottom: 5px;
      img {
        display: block;
        width: 220px;
        height: 220px;
        background-color: #fafafa;
      }
    }
  }
  .gl-price {
    position: relative;
    line-height: 22px;
    overflow: hidden;
    width: 100%;
    margin: 0 0 8px;
    strong {
      float: left;
      margin-right: 10px;
      color: $color-main;
      font-size: 20px;
      font-weight: 400;
      font-family: Verdana,serif;
      em { font-size: 16px }
    }
  }
  .gl-name {
    height: 40px;
    overflow: hidden;
    a {
      color: #666;
      &:hover { color: $color-main }
    }
    em {
      display: block;
      height: 40px;
      line-height: 20px;
      overflow: hidden;
      transition: height .08s ease;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    .gl-attribute {
      display: block;
      width: 228px;
      height: 19px;
      margin-top: 1px;
      margin-right: -8px;
      overflow: hidden;
      .attr {
        float: left;
        height: 19px;
        line-height: 19px;
        padding: 0 4px;
        margin-right: 7px;
        background: #f4f4f4;
        b {
          font-weight: 400;
          color: #999;
        }
      }
    }
  }
  .gl-commit {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 18px;
    margin-top: -3px;
    overflow: hidden;
    strong {
      color: #a7a7a7;
      font-weight: 400;
      a {
        color: #646fb0;
        font-family: verdana,serif;
        font-weight: 700;
      }
    }
    .gl-grade i { color: $color-main }
  }
  .gl-buy-count {
    color: #a7a7a7;
    margin: 5px 0;
  }
  .gl-sub-title {
    color: #909399;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    margin: 5px 0;
  }
  .gl-original-price {
    color: #909399;
    text-decoration: line-through;
    vertical-align: -2px;
    float: right;
  }
  .gl-join-btn {
    display: block;
    color: #FFFFFF;
    padding: 5px 10px;
    text-align: center;
    background-color: $color-main;
    border-radius: 2px;
    opacity: 0;
    transition: opacity ease .2s;
  }
</style>
