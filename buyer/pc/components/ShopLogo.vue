<template>
  <img :src="url || noImg">
</template>

<script>
  const noImg = require('../assets/images/icon-no-shop-logo.png')
  export default {
    name: 'EnShopLogo',
    props: {
      url: {
        type: String,
        default: ''
      }
    },
    data: () => ({ noImg })
  }
</script>
