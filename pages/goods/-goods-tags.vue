<template>
  <div id="goods-tags" class="goods-tags">
    <div v-for="tag in tagGoods" :key="tag.key" class="item-tag">
      <h5 class="title-tag">{{ tag.title }}</h5>
      <ul class="goods-list">
        <template v-for="(goods, index) in tag.data">
          <li
            v-if="index < 5"
            :key="index"
            class="goods-item">
            <a :href="'/goods/' + goods.goods_id">
              <img :src="goods.thumbnail" :alt="goods.goods_name" class="goods-image">
              <div class="goods-info">
                <div class="goods-name">{{ goods.goods_name }}</div>
                <div class="goods-price">￥{{ goods.price | unitPrice }}</div>
              </div>
            </a>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
  /**
   * 标签商品模块
   * 例如热销商品、新品上架等等
   */
  import * as API_Goods from '@/api/goods'
  export default {
    name: 'goods-tags',
    props: ['shopId'],
    data() {
      return {
        tagGoods: [
          { title: '热卖排行', key: 'hot', data: null },
          { title: '新品推荐', key: 'new', data: null },
          { title: '推荐商品', key: 'recommend', data: null }
        ],
        hotGoods: null,
        newGoods: null,
        recGoods: null
      }
    },
    mounted() {
      this.tagGoods.forEach(item => {
        API_Goods.getTagGoods(this.shopId, item.key, 10).then(response => {
          item.data = response
        })
      })
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .goods-tags {
    width: 200px;
    min-height: 100px;
  }
  .title-tag {
    width: 100%;
    height: 36px;
    line-height: 36px;
    text-align: center;
    color: #fff;
    background-color: #333333;
  }
  .goods-list { margin-bottom: 10px }
  .goods-item {
    position: relative;
    margin: 0 auto;
    border-top: 1px solid #f1f1f1;
    padding: 10px 0;
    a {
      display: flex;
    }
  }
  .goods-name {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    font-size: 12px;
    margin-bottom: 5px;
  }
  .goods-image {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
    margin-right: 10px;
  }
</style>
