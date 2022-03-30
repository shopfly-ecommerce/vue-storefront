<template>
  <div id="app">
    <en-shortcut/>
    <en-header/>
    <nuxt id="wrapper"/>
    <en-footer/>
  </div>
</template>
<script>
  export default {
    name: 'defalt'
  }
</script>
<style type="text/scss" lang="scss">
  #wrapper {
    min-height: calc(100vh - 31px - 219px)
  }
</style>
