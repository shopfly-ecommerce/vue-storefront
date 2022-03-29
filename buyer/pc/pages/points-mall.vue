<template>
  <div id="points-mall">
    <div class="points-category">
      <ul class="inner-points-cate w">
        <li v-for="cat in categorys" :key="cat.cat_id" :class="[cat.active && 'active']">
          <a href="javascript:;" @click="handleClickCat(cat)">{{ cat.name }}</a>
        </li>
      </ul>
    </div>
    <div class="points-goods">
      <div v-if="tableData && !tableData.data.length" class="no-goods w">
        暂无商品...
      </div>
      <div v-else class="w">
        <ul class="goods-list">
          <template v-for="(goods, index) in tableData.data">
            <li v-if="goods.enable_exchange === 1" :key="index" class="goods-item">
              <div class="gl-item">
                <div class="gl-img">
                  <a :href="'/goods/' + goods.goods_id" target="_blank">
                    <img :src="goods.goods_img" :alt="goods.goods_name">
                  </a>
                </div>
                <div class="gl-price">
                  <strong v-if="goods.exchange_money"><em>¥</em><i>{{ goods.exchange_money | unitPrice }}</i> + {{ goods.exchange_point }}积分</strong>
	                <strong v-else>{{ goods.exchange_point }}积分</strong>
                </div>
                <p>
                  原价：<span class="gl-original-price">￥{{ goods.goods_price | unitPrice }}</span>
                </p>
                <div class="gl-name">
                  <a :href="'/goods/' + goods.goods_id" :title="goods.goods_name" target="_blank">
                    <em>{{ goods.goods_name }}</em>
                  </a>
                </div>
              </div>
            </li>
          </template>
        </ul>
        <el-pagination
          @current-change="handleCurrentPageChange"
          :current-page.sync="params.page_no"
          :page-size="params.page_size"
          layout="total, prev, pager, next"
          :total="tableData.data_total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Pagination } from 'element-ui'
  Vue.use(Pagination)
  import * as API_Promotions from '@/api/promotions'
  export default {
    name: 'points-mall',
    head() {
      return {
        title: `积分商城-${this.site.title}`
      }
    },
    data() {
      return {
        categorys: '',
        params: {
          page_no: 1,
          page_size: 10,
          cat_id: 0
        },
        tableData: ''
      }
    },
    mounted() {
      this.GET_PointsCategory()
      this.GET_PointsGoods()
    },
    methods: {
      /** 当前分页发生改变 */
      handleCurrentPageChange(page_no) {
        this.params.page_no = page_no
        this.GET_PointsGoods()
      },
      /** 选择积分分类 */
      handleClickCat(cat) {
        this.$set(this, 'categorys', this.categorys.map(item => {
          item.active = item.cat_id === cat.cat_id
          return item
        }))
        this.params.cat_id = cat.cat_id
        this.GET_PointsGoods()
      },
      /** 获取积分分类 */
      GET_PointsCategory() {
        API_Promotions.getPointsCategory().then(response => {
          this.categorys = [
            { name: '全部', cat_id: 0, active: true },
            ...response.map(item => ({
              active: false,
              name: item.name,
              cat_id: item.category_id
            }))
          ]
        })
      },
      /** 获取积分商品 */
      GET_PointsGoods() {
        const params = JSON.parse(JSON.stringify(this.params))
        if (params.cat_id === 0) delete params.cat_id
        API_Promotions.getPointsGoods(params).then(response => {
          this.tableData = response
          this.MixinScrollToTop()
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../assets/styles/color";
  .points-category {
    width: 100%;
    background: #eceaea;
    :after {
      display: block;
      clear: both;
    }
    ul {
      height: 80px;
      line-height: 80px;
    }
    li {
      position: relative;
      float: left;
      font-size: 16px;
      margin-right: 25px;
      &:not(:first-child)::after {
        position: absolute;
        top: 0;
        left: -17.5px;
        font-size: 30px;
        content: '∙';
      }
      &.active a {
        color: $color-main;
      }
    }
  }
  .points-goods {
    margin-top: 10px;
    margin-bottom: 50px;
    /deep/ .el-pagination {
      padding: 10px 0 30px 0;
      text-align: right;
      margin-right: 10px;
    }
  }
  .no-goods {
    text-align: center;
    line-height: 100px;
    font-size: 18px;
    font-weight: 700;
  }
  .goods-list {
    padding: 20px 10px;
    overflow: hidden;
    li {
      width: 234px;
      height: 340px;
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
      height: 22px;
      overflow: hidden;
      width: 100%;
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
      margin-bottom: 8px;
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
    .gl-original-price {
      color: #909399;
      text-decoration: line-through;
    }
  }
</style>
