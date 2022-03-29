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
          // 链接地址
          case 'URL': return value
          // 商品
          case 'GOODS': return `/goods/${value}`
          // 关键字
          case 'KEYWORD': return `/goods?keyword=${encodeURIComponent(value)}`
          // 店铺
          case 'SHOP': return `/shop/${value}`
          // 分类
          case 'CATEGORY': return `/goods?category=${value}`
          default: return '/'
        }
      }
    }
  }
</script>
