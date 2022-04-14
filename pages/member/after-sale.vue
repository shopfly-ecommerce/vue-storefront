<template>
  <nuxt-child></nuxt-child>
</template>

<script>
  export default {
    name: 'after-sale',
    head() {
      return {
        title: `After-sales service-${this.site.title}`
      }
    }
  }
</script>

