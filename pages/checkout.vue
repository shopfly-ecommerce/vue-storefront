<template>
  <nuxt-child/>
</template>

<script>
  /**
   * This is just a routing container
   * The main code is incheckout/index.vueIn the
   */
  export default {
    name: 'checkout',
    layout: 'full',
    middleware: 'auth-user'
  }
</script>
