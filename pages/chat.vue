<template>
  <no-ssr>
    <chat-app
      v-if="userInfo.member_id"
      :user="userInfo"
      :apis="MixinApi"
      :domains="MixinDomain"
      :request="request"
      type="buyer"
    />
    <div v-else class="no-login">
      Please first<a :href="`/login?forward=${$route.fullPath}`" class="login-btn">Sign in</a>
    </div>
  </no-ssr>
</template>

<script>
import ChatApp from '../components/ChatApp/ChatApp'
import request from '../utils/request'
import Storage from '../utils/storage'
let user = {}
if (process.client) {
  user = Storage.getItem('user')
  user = user ? JSON.parse(user) : {}
}
export default {
  name: 'chat',
  layout: 'im',
  components: { ChatApp },
  data() {
    return {
      userInfo: {...user, name: user.nickname || user.name || user.uname}
    }
  },
  computed: {
    request() {
      return request
    }
  }
}
</script>

<style lang="scss" scoped>
.no-login {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  .login-btn {
    color: #1E50A2;
  }
}
</style>
