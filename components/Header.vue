<template>
  <div id="header">
    <div class="top-header w">
      <en-logo/>
      <en-search/>
      <en-settleup/>
    </div>
    <en-nav/>
  </div>
</template>

<script>
  export default {
    name: 'EnHeader'
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../assets/styles/color";
  #header {
    border-bottom: 3px solid $color-main;
    .top-header {
      display: flex;
      justify-content: space-between;
      height: 67px;
      padding-top: 30px;
      /deep/ #logo {
        width: 240px;
        height: 60px;
      }
    }
  }
</style>
