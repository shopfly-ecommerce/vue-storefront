<template>
  <div id="member">
    <en-breadcrumb/>
    <div class="member-layout w">
      <en-menu v-if="$route.name !== 'member-comments'"/>
      <nuxt-child style="width: calc(1210px - 220px); margin-bottom: 20px"/>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Alert, Checkbox, Form, FormItem, Input, Pagination, Radio, Table, TableColumn } from 'element-ui'
  Vue.use(Alert).use(Checkbox).use(Form).use(FormItem).use(Input).use(Pagination).use(Radio).use(Table).use(TableColumn)
  import Breadcrumb from '@/pages/member/-breadcrumb'
  import Menu from '@/pages/member/-menu'
  import Empty from '@/pages/member/-empty'
  Vue.component('empty-member', Empty)
  export default {
    name: 'member',
    middleware: 'auth-user',
    head() {
      const { $store, site } = this
      const name = $store.getters.user.nickname || '个人中心'
      return {
        title: `${name}-${site.title}`
      }
    },
    components: {
      'en-breadcrumb': Breadcrumb,
      'en-menu': Menu
    }
  }
</script>

<style type="text/scss" lang="scss">
  @import "../assets/styles/color";
  .member-layout {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .member-nav {
    position: relative;
    width: 100%;
    height: 38px;
    background-color: #fff;
    z-index: 1;
  }
  .member-nav-list {
    display: flex;
    align-items: center;
    height: 36px;
    background-color: #fff;
    border-bottom: 1px solid #e7e7e7;
    @mixin active {
      background-color: #fff;
      color: $color-main;
      border-bottom: 1px solid #fff;
    }
    li {
      background-color: #f7f7f7;
      border-right: 1px solid #e7e7e7;
      border-top: 1px solid #e7e7e7;
      line-height: 35px;
      /*padding: 0 20px;*/
      color: #666;
      font-weight: 600;
      font-size: 12px;
      cursor: pointer;
      transition: background-color .3s ease-out;
      &:first-child {
        border-left: 1px solid #e7e7e7;
      }
      &.active {
        @include active
      }
      &:not(.active):hover {
        background-color: #e7e7e7;
        color: #000;
      }
      a {
        display: block;
        padding: 0 20px;
        &.nuxt-link-exact-active {
          @include active
        }
      }
    }
  }
  .member-pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: 50px;
  }
</style>
