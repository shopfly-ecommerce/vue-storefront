<template>
  <div id="shortcut">
    <div class="w">
      <div v-if="user" class="login-status logined">
        <span><nuxt-link to="/member">My account</nuxt-link></span>
        <span>[<a href="javascript:;" @click="handleLogout">exit</a>]</span>
      </div>
      <div v-else class="login-status">
        <span>Hi&nbsp;&nbsp;</span>
        <span>[<nuxt-link :to="'/login' + MixinForward">Sign in</nuxt-link>] [<nuxt-link :to="'/register' + MixinForward">Register</nuxt-link>]</span>
      </div>
      <ul class="links">
        <li>
          <div class="dt">
            <a href="/shop/apply">{{ user.have_shop ? 'I shop' : '' }}</a>
          </div>
        </li>
        <li class="spacer"></li>
        <li class="dorpdown">
          <div class="dt hs-icon">
            <nuxt-link to="/member/my-order">Orders</nuxt-link>
            <i class="iconfont ea-icon-arrow-down"></i>
          </div>
          <div class="dd dorpdown-layer">
            <dl>
              <dd><nuxt-link to="/member/my-order?order_status=WAIT_PAY">Unpaid</nuxt-link></dd>
              <dd><nuxt-link to="/member/my-order?order_status=WAIT_ROG">Shipped</nuxt-link></dd>
            </dl>
          </div>
        </li>
        <li class="spacer"></li>
        <li class="dorpdown">
          <div class="dt hs-icon">
            <nuxt-link to="/member/my-collection">Collection</nuxt-link>
            <i class="iconfont ea-icon-arrow-down"></i>
          </div>

        </li>

        <li class="spacer"></li>
        <li class="dorpdown">
          <div class="dt">
            <a href="/help">Help center</a>
            <!--<i class="iconfont ea-icon-arrow-down"></i>-->
          </div>
          <!--<div class="dd dorpdown-layer">
            <dl>
              <dd><nuxt-link to="/help">Help center</nuxt-link></dd>
              <dd><a href="/">Service center</nuxt-link></dd>
              <dd><a href="/">Customer service center</nuxt-link></dd>
            </dl>
          </div>-->
        </li>
        <li class="spacer"></li>
        <li class="dorpdown">
          <div v-if="im" class="dt hs-icon">
            <nuxt-link to="">
              Service message[{{ (unreadMessageNum + chat_unread_num) > 99 ? '99+' : (unreadMessageNum + chat_unread_num) }}]
            </nuxt-link>
            <i class="iconfont ea-icon-arrow-down"></i>
          </div>
          <div v-else class="dt">
            <nuxt-link to="/member/website-message">
              Messages[{{ unreadMessageNum > 99 ? '99+' : unreadMessageNum }}]
            </nuxt-link>
          </div>
          <div v-if="im" class="dd dorpdown-layer">
            <dl>
              <dd><nuxt-link to="/chat">The news of the service({{ chat_unread_num > 99 ? '99+' : chat_unread_num }})</nuxt-link></dd>
              <dd><nuxt-link to="/member/website-message">Messages({{ unreadMessageNum > 99 ? '99+' : unreadMessageNum }})</nuxt-link></dd>
            </dl>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Storage from '@/utils/storage'
  import * as API_Message from '@/api/message'
  import { mapActions, mapGetters } from 'vuex'
  export default {
    name: 'EnShortcut',
    head() {
      return {
        meta: [
          { hid: 'keywords', name: 'keywords', content: this.site.keywords },
          { hid: 'description', name: 'description', content: this.site.descript }
        ]
      }
    },
    data() {
      return {
        message_total: 0,
        message_timer: null,
        chat_unread_num: 0,
        chat_timer: null,
        im: process.env.im
      }
    },
    computed: {
      ...mapGetters(['user', 'site', 'unreadMessageNum'])
    },
    mounted() {
      // If it is the home page and has a UUID, replace the UUID in the cookie and remove the UUID from the URL
      const { name, query } = this.$route
      if (name === 'index' && query.uuid) {
        Storage.setItem('uuid', query.uuid)
        Storage.removeItem('uuid_connect')
        location.href = '/'
        return
      }
      // If there is a refresh Token, the user information will be obtained again.
      if (Storage.getItem('refresh_token')) {
        this.getUserData()
      }
      if(process.client) {
        this.GET_UnreadMessage()
        this.GET_UnreadChatNum()
      }
    },
    methods: {
      ...mapActions({
        logout: 'user/logoutAction',
        getUserData: 'user/getUserDataAction',
        cleanCartStore: 'cart/cleanCartStoreAction',
        getUnreadMessageNum: 'getUnreadMessageNumAction'
      }),
      /** Account to log out*/
      handleLogout() {
        this.logout().then(() => {
          this.cleanCartStore()
          document.location.reload()
        })
      },
      /** Gets unread messages*/
      async GET_UnreadMessage() {
        if (!Storage.getItem('refresh_token')) return;
        try {
          clearTimeout(this.message_timer)
          await this.getUnreadMessageNum();
        } finally {
          // Message polling, every 5 minutes
          this.message_timer = setTimeout(this.GET_UnreadMessage, 1000 * 60 * 5)
        }
      },
      /**
       * Get the number of unread customer service messages
       * @returns {Promise<void>}
       */
      async GET_UnreadChatNum() {
        if (!this.im || !Storage.getItem('refresh_token')) return;
        try {
          clearTimeout(this.chat_timer)
          this.chat_unread_num = await API_Message.getUnreadChatNum()
        } finally {
          // Customer service Number of unread IM messages, which is queried once a minute
          this.chat_timer = setTimeout(this.GET_UnreadChatNum, 1000 * 60 * 1)
        }
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../assets/styles/color";
  #shortcut {
    border-bottom: 1px solid #ddd;
    background-color: #e3e4e5;
    .w {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 30px;
      line-height: 30px;
    }
    .login-status {
      a { color: #666 }
    }
    .logined a { color: #333 }
    a:hover {
      color: $color-main
    }
  }
  .links {
    z-index: 100;
    a {
      color: #999;
      display: block;
    }
    li {
      position: relative;
      float: left;
      &.spacer {
        overflow: hidden;
        margin: 11px 5px 0;
        width: 1px;
        height: 10px;
        background-color: #ccc;
      }
      &.dorpdown:hover {
        .dorpdown-layer {
          display: block;
        }
        .dt {z-index: 3;}
        .iconfont {transform: rotate(180deg);}
      }
      .dt {
        padding-left: 7px;
        padding-right: 7px;
        &.hs-icon {
          height: 28px;
          line-height: 28px;
          overflow: hidden;
          position: relative;
          z-index: 1;
          float: left;
          padding-right: 20px;
        }
        .iconfont {
          position: absolute;
          right: 5px;
          top: 10px;
          width: 12px;
          height: 12px;
          line-height: 12px;
          font-size: 12px;
          transition: all .3s ease-out;
        }
      }

      .dorpdown-layer {
        background-color: #FFF;
        display: none;
        width: auto;
        border: solid 1px #F0F0F0;
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        padding-top: 30px;
        dd {
          cursor: pointer;
          &:hover {background-color: #f5f6f5;}
        }
        a {
          line-height: 24px;
          padding-left: 7px;
        }
      }
    }
  }
</style>
