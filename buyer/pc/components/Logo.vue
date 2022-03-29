<template>
  <a href="/">
    <img :src="$store.getters.site.logo" id="logo">
  </a>
</template>

<script>
  export default {
    name: 'EnLogo'
  }
</script>
<style type="text/scss" lang="scss" scoped>
  #logo {
    width: 260px;
    height: 100%;
  }
</style>
