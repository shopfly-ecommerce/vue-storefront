<template>
  <nuxt-child/>
</template>

<script>
  /**
   * 这里只是作为路由容器
   * 主要的代码在checkout/index.vue里
   */
  export default {
    name: 'checkout',
    layout: 'full',
    middleware: 'auth-user'
  }
</script>
