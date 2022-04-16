<template>
  <nuxt-child></nuxt-child>
</template>

<script>
  export default {
    name: 'my-order',
    head() {
      return {
        title: `Orders-${this.site.title}`
      }
    }
  }
</script>
