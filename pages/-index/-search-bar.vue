<template>
  <div class="search-bar-container" style="position: fixed; top: -160px;" :class="[show_bar && 'show']">
    <div class="inner-search-bar">
      <div class="categorys">
        <en-category :init-unfold="false"/>
      </div>
      <div class="mall-search">
        <en-search :hide-keywords="true" />
      </div>
      <div class="suspend-login">
        <template v-if="!user">
          <a href="/login">登录</a> | <a href="/register">注册</a>
        </template>
        <nuxt-link v-else to="/member" :title="user.nickname || user.uname">{{ user.nickname || user.uname }}</nuxt-link>
      </div>
      <div class="header-cart">
        <div class="header-cart-con">
          <a href="/cart">
            <i class="iconfont ea-icon-cart"></i>
            <em class="cart-num">{{ allCount > 99 ? '99+' : allCount }}</em>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import EnCategory from "@/components/Category"
  import EnSearch from "@/components/Search"
  export default {
    name: 'search-bar',
    components: {EnSearch, EnCategory},
    data() {
      return {
        show_bar: false
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.searchBarFixedStatus()
        window.addEventListener('scroll', this.searchBarFixedStatus)
      })
    },
    computed: {
      ...mapGetters({
        user: 'user',
        allCount: 'cart/allCount'
      })
    },
    methods: {
      /** 计算搜索bar是否显示 */
      searchBarFixedStatus() {
        // 获取滚动条当前位置
        const bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop
        // 是否固定到顶部
        this.show_bar = bodyScrollTop >= 31 + 140 + 500
      }
    },
    destroyed() {
      window.removeEventListener('scroll', this.searchBarFixedStatus)
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/styles/color";
  .search-bar-container {
    display: block;
    margin: 0 auto;
    position: fixed;
    top: -160px;
    height: 60px;
    width: 100%;
    z-index: 10000;
    transition: top 0.3s ease-out;
    background-color: #fff;
    &.show {
      top: 0 !important;
      box-shadow: 0 0 10px 2px rgba(90, 90, 90, 0.6);
    }
    .inner-search-bar {
      width: 1210px;
      margin: 0 auto;
      position: relative;
      z-index: 10;
    }
    .categorys {
      width: 240px;
      margin-top: 10px;
      float: left;
    }
    .mall-search {
      float: left;
      margin-top: 13px;
      margin-left: 100px;
    }
    .suspend-login {
      float: left;
      margin-left: 80px;
      margin-top: 12px;
      line-height: 34px;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .header-cart {
      float: left;
      margin-top: 12px;
      .header-cart-con {
        position: relative;
        height: 34px;
        line-height: 34px;
        border: none;
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
        .cart-num {
          position: absolute;
          left: 40px;
          top: 0;
          min-width: 13px;
          height: 13px;
          line-height: 13px;
          padding: 1px;
          border-radius: 50%;
          background: $color-main;
          color: #fff;
          text-align: center;
          font-size: 12px;
          margin-left: 10px;
        }
      }
    }
  }
</style>
