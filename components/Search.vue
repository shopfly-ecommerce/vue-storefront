<template>
  <div id="search">
    <div class="search-form">
      <input
        ref="searchInput"
        v-model="keyword"
        @input="handleKeywordChnaged"
        @focus="show_autocomplete = true"
        @blur="handleSearchInputBlur"
        @keyup.enter="handleSearchGoods"
        class="search-input"
      >
      <button type="button" class="search-btn goods" @click="handleSearchGoods">Search</button>
    </div>
    <ul v-if="!hideKeywords && hotKeywords" class="search-hot-keywords">
      <li v-for="item in hotKeywords" :key="item.id">
        <a :href="'/goods?keyword=' + encodeURIComponent(item.hot_name)">{{ item.hot_name }}</a>
      </li>
    </ul>
    <div v-show="show_autocomplete && autoCompleteData.length > 0" class="search-autocomplete">
      <ul>
        <li v-for="(item, index) in autoCompleteData" :key="index" @click="handleSearchGoods(item.words)">
          <div class="left-span">
            <!--&nbsp;<span style="font-weight: bold">{{ autoCompleteStr }}</span>-->
            <!--<span>{{ item.words.substr(autoCompleteStr.length, item.words.length) }}</span>-->
            <span>{{ item.words }}</span>
          </div>
          <div class="autocomplete-span">about{{ item.goods_num }}A commodity</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import * as API_Home from '@/api/home'
  import * as API_Goods from '@/api/goods'
  export default {
    name: 'EnSearch',
    props: ['hideKeywords'],
    data() {
      const { keyword } = this.$route.query;
      return {
        keyword: keyword || '',
        autoCompleteStr: '',
        autoCompleteData: [],
        show_autocomplete: false,
        hotKeywords: ''
      }
    },
    async fetch() {
      this.hotKeywords = await API_Home.getHotKeywords()
    },
    mounted() {
      this.handleQueryKeywordChange()
    },
    watch: {
      $route: 'handleQueryKeywordChange'
    },
    methods: {
      /** The keyword changed. Procedure*/
      handleKeywordChnaged(event) {
        let _str = event.target.value || '';
        _str = _str.replace('\'', '');
        // this.keyword = _str
        this.GET_AutoCompleteWords(_str)
      },
      /** The search box loses focus*/
      handleSearchInputBlur() {
        setTimeout(() => {
          this.show_autocomplete = false
        }, 200)
      },
      /** Search for goods*/
      handleSearchGoods(keyword) {
        keyword = typeof (keyword) === 'string' ? keyword : this.keyword;
        this.keyword = keyword;
        this.show_autocomplete = false;
        this.$refs['searchInput'].blur();
        window.location.href = `/goods${keyword ? `?keyword=${encodeURIComponent(keyword)}` : ''}`
      },
      /** Search the store*/
      handleSearchShop() {
        window.location.href = `/shop${this.keyword ? '?keyword=' + encodeURIComponent(this.keyword) : ''}`
      },
      /** URLIn thekeywordchange*/
      handleQueryKeywordChange() {
        const { keyword } = this.$route.query;
        if (keyword) {
          this.keyword = keyword;
          this.GET_AutoCompleteWords(keyword)
        }
      },
      /** Get auto-complete data*/
      GET_AutoCompleteWords(keyword) {
        let _str = keyword || this.keyword;
        if (_str === this.autoCompleteStr) return;
        this.autoCompleteStr = _str;
        _str = _str.trim();
        API_Goods.getKeywordNum(_str).then(response => {
          this.autoCompleteData = response
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../assets/styles/color";
  #search {
    position: relative;
    .search-form {
    }
    .search-input {
      box-sizing: content-box;
      width: 378px;
      height: 14px;
      padding: 8px;
      border: 2px solid $color-main;
      outline: 0;
      font-size: 12px;
      float: left;
      color: #999;
    }
    .search-btn {
      width: 70px;
      height: 34px;
      line-height: 34px;
      padding: 0;
      background-color: $color-main;
      font-size: 14px;
      cursor: pointer;
      float: left;
      outline: 0;
      transition: all ease-out .3s;
      color: #fff;
      font-weight: bold;
      border: 0;
      &:hover {
        opacity: .8;
      }
      &.goods {
        margin-right: 8px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
      &.shop {
        background-color: darken($color-main, 15%);
      }
    }
    .search-hot-keywords {
      float: left;
      width: 100%;
      height: 28px;
      li {
        float: left;
        height: 28px;
        line-height: 28px;
        margin-right: 10px;
        a {
          display: block;
          color: #999;
          &:hover {
            color: $color-main;
          }
        }
      }
    }
    .search-autocomplete {
      width: 395px;
      background: white;
      border: 1px solid $color-main;
      position: absolute;
      z-index: 99999;
      border-top: none;
      top: 34px;
      left: 0;
      li {
        height: 28px;
        line-height: 28px;
        clear: both;
        padding: 0 5px;
        cursor: pointer;
        &:hover {
          background-color: #f5f5f5;
        }
      }
      .left-span {
        width: 306px;
        height: 28px;
        overflow: hidden;
        float: left;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .autocomplete-span {
        float: right;
        color: #d2d2d2;
      }
    }
  }
</style>
