<template>
  <a :href="toPage" target="_blank"><slot/></a>
</template>

<script>
  export default {
    name: 'EnOperation',
    props: ['opt'],
    computed: {
      toPage() {
        const { type, value } = this.opt
        switch (type) {
          // The link address
          case 'URL': return value
          // goods
          case 'GOODS': return `/goods/${value}`
          // keyword
          case 'KEYWORD': return `/goods?keyword=${encodeURIComponent(value)}`
          // The store
          case 'SHOP': return `/shop/${value}`
          // Categories
          case 'CATEGORY': return `/goods?category=${value}`
          default: return '/'
        }
      }
    }
  }
</script>
