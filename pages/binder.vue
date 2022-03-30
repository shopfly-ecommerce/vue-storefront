<template>
  <div id="binder" class="binder-container w"></div>
</template>

<script>
  import Storage from '@/utils/storage'
  import * as API_Connect from '@/api/connect'
  import { domain } from '@/ui-domain'
  export default {
    name: 'binder',
    layout: 'full',
    mounted() {
      const { uuid } = this.$route.query
      if (uuid) Storage.setItem('uuid', uuid, { expires: 30 })
      // 如果有刷新token，说明是在已登录的情况下绑定或换绑
      if (Storage.getItem('refresh_token')) {
        const uuid_connect = Storage.getItem('uuid_connect')
        API_Connect.loginBindConnect(uuid_connect).then(response => {
          const { access_token, refresh_token } = response
          Storage.setItem('access_token', access_token)
          Storage.setItem('refresh_token', refresh_token)
          Storage.setItem('uuid', uuid_connect)
          Storage.removeItem('uuid_connect')
          this.$router.replace({ name: 'member-account-binding' })
        }).catch(() => {
          this.$router.replace({ name: 'member-account-binding' })
        })
        return false
      }
      this.$layer.open({
        title: '授权成功',
        btn: ['登录', '注册'],
        closeBtn: 0,
        content: '当前已授权成功，请您：',
        move: false,
        yes: (index) => {
          this.$layer.close(index)
          this.$router.push({ name: 'login', query: { form: 'connect' } })
        },
        btn2: (index) => {
          this.$layer.close(index)
          this.$router.push({ name: 'register', query: { form: 'connect' } })
        }
      })
    },
    methods: {
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../assets/styles/color";
  .binder-container {
    min-height: 200px;
  }
</style>
