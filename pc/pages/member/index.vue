<template>
  <div id="member-index">
    <div class="user-title">
      <div class="user-item">
        <nuxt-link to="/member/my-profile" class="user-avatar">
          <en-face :url="user.face"/>
        </nuxt-link>
        <div class="user-info">
          <p>{{ user.nickname || user.uname }}</p>
          <p v-if="user.mobile">联系方式：{{ user.mobile | secrecyMobile }} </p>
          <p v-else>联系方式：无 </p>
        </div>
      </div>
      <nuxt-link to="/member/my-order" class="other-item">
        <p>我的订单</p>
        <i class="iconfont ea-icon-my-order"></i>
        <p class="num">{{ statisticsNum.order_count || 0 }}</p>
      </nuxt-link>
      <nuxt-link to="/member/my-order?order_status=WAIT_COMMENT" class="other-item">
        <p>待评论</p>
        <i class="iconfont ea-icon-collection-of-shop" style="font-size: 42px"></i>
        <p class="num">{{ statisticsNum.pending_comment_count || 0}}</p>
      </nuxt-link>
      <nuxt-link to="/member/my-collection" class="other-item">
        <p>收藏的商品</p>
        <i class="iconfont ea-icon-collection-of-goods"></i>
        <p class="num">{{ statisticsNum.goods_collect_count || 0}}</p>
      </nuxt-link>
    </div>
    <div class="box-item">
      <div class="item left order">
        <div class="item-title">
          <h2>我的订单</h2>
          <div class="order-status">
            <nuxt-link to="/member/my-order">所有订单({{ orderStatusNum.all_num || 0 }})</nuxt-link>
            <nuxt-link :to="'/member/my-order?order_status=WAIT_PAY'">待付款({{ orderStatusNum.wait_pay_num || 0 }})</nuxt-link>
            <nuxt-link :to="'/member/my-order?order_status=COMPLETE'">已完成({{ orderStatusNum.complete_num || 0 }})</nuxt-link>
          </div>
        </div>
        <div class="item-content">
          <empty-member v-if="!orderData || orderData.data.length === 0">暂无订单</empty-member>
          <template v-else>
            <template v-for="(order, index) in orderData.data">
              <div v-if="index < 3" :key="order.sn" class="order-item" >
                <a :href="'/goods/' + order.sku_list[0].goods_id" target="_blank" class="goods-image">
                  <img :src="order.sku_list[0].goods_image"/>
                </a>
                <div class="order-info">
                  <a :href="'/goods/' + order.sku_list[0].goods_id" class="goods-name" target="_blank">{{ order.sku_list[0].name }}</a>
                  <p v-if="order.sku_list[0].spec_list" class="sku-spec">{{ order.sku_list[0] | formatterSkuSpec }}</p>
                  <p>下单时间：{{ order.create_time | unixToDate }}</p>
                  <p>订单金额：<span class="price">￥{{ order.order_amount | unitPrice }}</span></p>
                  <p class="order-status-num"><span>订单状态：{{ order.order_status_text }}</span><span>订单内共有（{{ order.sku_list.length }}）种商品</span></p>
                </div>
                <div class="order-oper">
                  <nuxt-link :to="'/member/my-order/detail?order_sn=' + order.sn">查看订单</nuxt-link>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
      <div class="item right cart">
        <div class="item-title">
          <h2>购物车</h2>
          <nuxt-link to="/cart">查看全部 	&gt;&gt;</nuxt-link>
        </div>
        <div class="item-content">
          <empty-member v-if="cartSkuList.length === 0">暂无商品</empty-member>
          <template v-else>
            <template v-for="(item, index) in cartSkuList">
              <div v-if="index < 4" :key="item.sku_id" class="cart-item">
                <a :href="'/goods/' + item.goods_id" class="goods-image">
                  <img :src="item.goods_image" :alt="item.name">
                </a>
                <div class="goods-name">
                  <a :href="'/goods/' + item.goods_id">{{ item.name }}</a>
                  <p><em>￥{{ item.purchase_price | unitPrice }}</em> <span>x {{ item.num }}</span></p>
                </div>
                <a href="javascript:;" class="delete-btn" @click="handleDeleteSkuItem(item)">删除</a>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
    <div class="box-item">
      <div class="item centon goods-collection">
        <div class="item-title">
          <h2>商品收藏</h2>
          <nuxt-link to="/member/my-collection">查看全部 	&gt;&gt;</nuxt-link>
        </div>
        <div class="item-content">
          <empty-member v-if="!goodsCollectionData || goodsCollectionData.data.length === 0">暂无收藏商品</empty-member>
          <template v-else>
            <template v-for="(item, index) in goodsCollectionData.data">
              <div
                v-if="index < 16"
                :key="item.goods_id"
                class="goods-collection-item"
              >
                <a :href="'/goods/' + item.goods_id">
                  <img :src="item.goods_img" :alt="item.goods_name" class="goods-image">
                </a>
                <span class="goods-name">{{ item.goods_name }}</span>
                <div class="goods-price">
                  <span>￥{{ item.goods_price | unitPrice }}</span>
                  <a href="javascript:;" class="delete-btn" @click="handleDeleteGoodsCollection(item)">删除</a>
                </div>
              </div>
            </template>
            <span class="clear"></span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import * as API_Order from '@/api/order'
  import * as API_Members from '@/api/members'
  export default {
    name: 'member-index',
    data() {
      return {
        // 订单数据
        orderData: '',
        // 统计数量
        statisticsNum: {},
        // 订单状态数量
        orderStatusNum: {},
        // 商品收藏
        goodsCollectionData: '',
        //积分明细
        pointsData: '',
        // 店铺商品swiper配置
        shopSwiperOptions: {
          slidesPerView: 3,
          slidesPerGroup: 3,
          spaceBetween: 5,
          simulateTouch: false,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }
        }
      }
    },
    mounted() {
      this.GET_OrderStatusNum()
      this.GET_StatisticsNum()
      // 获取订单数据
      API_Order.getOrderList().then(response => {
        this.orderData = response
      })
      // 获取商品收藏
      this.GET_GoodsCollection()
    },
    computed: {
      ...mapGetters({
        user: 'user',
        cartSkuList: 'cart/skuList'
      })
    },
    methods: {
      /** 删除购物车货品 */
      handleDeleteSkuItem(sku) {
        this.$confirm('确定要删除这个货品吗？', () => {
          this.deleteSkuItem(sku.sku_id).then(() => this.$message.success('删除成功！'))
        })
      },
      /** 删除商品收藏 */
      handleDeleteGoodsCollection(goods) {
        this.$confirm('确定要删除这个商品收藏吗？', () => {
          API_Members.deleteGoodsCollection(goods.goods_id).then(() => {
            this.$message.success('删除成功！')
            this.GET_GoodsCollection()
          })
        })
      },
      /** 获取订单状态数量 */
      GET_OrderStatusNum() {
        API_Order.getOrderStatusNum().then(response => {
          this.orderStatusNum = response
        })
      },
      /** 获取统计数量 包括但不限于【订单数量、收藏的商品数量、收藏的店铺数量】 */
      GET_StatisticsNum() {
        API_Members.getStatisticsNum().then(response => { this.statisticsNum = response })
      },
      /** 获取商品收藏 */
      GET_GoodsCollection() {
        API_Members.getGoodsCollection({ page_no: 1, page_size: 20 }).then(response => {
          this.goodsCollectionData = response
        })
      },
      ...mapActions({
        /** 删除购物车货品 */
        deleteSkuItem: 'cart/deleteSkuItemAction'
      })
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/styles/color";
  .user-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 148px;
    padding: 15px;
    border: 1px solid #e7e7e7;
    border-bottom: none;
    box-sizing: border-box;
    .user-item {
      display: flex;
      align-items: center;
      width: 375px;
      height: 100%;
      .user-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 100px;
        margin-left: 10px;
        overflow: hidden;
        border-radius: 100%;
        box-shadow: 0 0 10px #ccc;
        img {
          width: 90px;
          height: 90px;
          border-radius: 100%;
          transition: all .2s ease-out;
          &:hover {
            width: 100%;
            height: 100%;
          }
        }
      }
      .user-info {
        margin-left: 15px;
        p {
          color: #777;
          font-size: 14px;
          font-weight: 400;
        }
      }
    }
    .other-item {
      display: flex;
      align-items: center;
      flex-flow: column;
      width: 189px;
      height: 100%;
      border-left: 1px solid #e7e7e7;
      cursor: pointer;
      p {
        color: #666;
        font-size: 15px;
      }
      .iconfont {
        color: #FD92B0;
        font-size: 36px;
        margin: 15px 0;
      }
      .num { font-size: 20px }
    }
  }
  .box-item {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 410px;
    z-index: 1;
    font-family: "Hiragino Sans GB", "Microsoft Yahei", arial, 宋体, "Helvetica Neue", Helvetica, STHeiTi, sans-serif;;
    .item {
      box-sizing: border-box;
      height: 100%;
      padding: 10px;
      border: 1px solid #e7e7e7;
      transition: all .3s ease-out;
      z-index: 2;
      overflow: hidden;
      .item-title {
        display: flex;
        align-content: center;
        justify-content: space-between;
        h2 {
          border-left: 3px solid #fd6760;
          padding-left: 5px;
          font-size: 13px;
        }
      }
      .item-content { margin-top: 10px }
      &.left { width: 590px }
      &.right { width: 990px - 590px; border-left: none }
      &:hover {
        border-color: rgba(244, 36, 36, 0.5);
        box-shadow: 0 0 10px 0 $color-main;
        z-index: 10;
      }
    }
  }
  .centon{
    width: 100%;
  }
  .box-item:last-child .item {
    border-top: none;
  }
  .goods-image {
    display: block;
    width: 80px;
    height: 80px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .item.order {
    background-color: #fefbf8;
    .order-status {
      a {
        border-right: 1px solid #e7e7e7;
        padding: 0 15px;
        &:last-child { border-right: none }
      }
    }
    .order-item {
      display: flex;
      justify-items: center;
      background-color: #fbf8e9;
      margin-top: 10px;
      padding: 12px;
      .order-info {
        width: 320px;
        margin-left: 10px;
        .goods-name {
          display: block;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          font-size: 12px;
          color: #333;
          font-weight: 600;
        }
        .price { color: $color-main }
      }
      p {
        color: #777;
        font-weight: 400;
      }
      .order-status-num {
        display: flex;
        justify-content: space-between;
      }
      .order-oper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 130px;
        a {
          cursor: pointer;
          font: 12px/20px "microsoft yahei";
          height: 20px;
          padding: 4px 12px;
          text-align: center;
          vertical-align: middle;
          color: #777 !important;
          border: 1px solid #dcdcdc;
          background: #f5f5f5;
        }
      }
    }
  }
  .item.cart {
    .cart-item {
      display: flex;
      justify-items: center;
      width: 100%;
      margin-bottom: 10px;
      transition: background-color .2s ease-in;
      &:hover { background-color: #fefbf8 }
    }
    .goods-image {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    img {
      width: 60px;
      height: 60px;
    }
    .goods-name {
      display: flex;
      flex-flow: column;
      justify-content: center;
      width: 200px;
      a {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      p {
        display: flex;
        justify-content: space-between;
      }
      em {
        font-size: 12px;
        color: $color-main;
      }
      span { margin-right: 50px }
    }
    .delete-btn {
      color: red;
      align-self: center;
      margin-left: 20px;
    }
  }
  .item.goods-collection {
    .item-content {
      margin-left: -25px;
    }
    .goods-collection-item {
      width: 136px;
      height: 170px;
      border: 1px solid #e7e7e7;
      border-radius: 3px;
      float: left;
      margin-bottom: 10px;
      margin-left: 25px;
      transition: all .2s ease-in;
      &:hover {
        box-shadow: 0 0 15px #ccc;
      }
      .goods-image {
        width: 119px;
        height: 119px;
      }
      .goods-name {
        display: block;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        color: #333;
        padding: 0 5px;
      }
      .goods-price {
        display: flex;
        justify-content: space-between;
        padding: 0 5px;
      }
      .delete-btn { color: $color-main }
    }
  }
  .item.shop-collection {
    .shop-collection-item {
      display: flex;
      height: 78px;
      border: 1px solid #e7e7e7;
      margin-bottom: 10px;
    }
    .shop-info {
      display: flex;
      flex-flow: column;
      width: 124px;
      height: 100%;
      img {
        width: 124px;
        height: 55px;
      }
      .shop-btns {
        display: flex;
        justify-content: space-between;
        height: 78px - 55px;
        a {
          width: 100%;
          height: 100%;
          text-align: center;
          border-right: 1px solid #e7e7e7;
          background-color: #f9f9f9;
          color: #666;
          &:hover {
            color: $color-main
          }
        }
      }
    }
    .shop-goods {
      position: relative;
      width: 377px - 124px;
      overflow: hidden;
      user-select: none;
      &:hover {
        /deep/ .swiper-button-next, .swiper-button-prev { opacity: 1 }
      }
      .shop-goods-name {
        display: block;
        position: absolute;
        z-index: 10;
        bottom: 0;
        left: 0;
        width: 100%;
        color: #fff;
        height: 20px;
        font-size: 12px;
        line-height: 12px;
        background-color: rgba(0,0,0,.5);
        padding: 3px;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .shop-goods-image {
      width: 100%;
      height: 100%;
    }
    /deep/ .swiper-button-next, .swiper-button-prev {
      z-index: 11;
      opacity: 0;
      width: 20px;
      height: 100%;
      top: 0;
      margin-top: 0;
      background-size: 10px 20px;
      background-color: rgba(0,0,0,.5);
      transition: opacity .2s ease-in;
    }
    /deep/ .swiper-button-next.swiper-button-disabled, .swiper-button-prev.swiper-button-disabled {
      display: none;
    }
    /deep/ .swiper-button-prev { left: 0 }
    /deep/ .swiper-button-next { right: 0 }
  }
</style>

