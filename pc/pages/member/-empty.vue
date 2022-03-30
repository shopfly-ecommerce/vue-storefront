<template>
  <div id="empty">
    <i class="icon-empty"></i>
    <span class="text-empty"><slot></slot></span>
  </div>
</template>

<script>
  export default {
    name: 'empty-member'
  }
</script>

<style type="text/scss" lang="scss" scoped>
  #empty {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 120px;
    .icon-empty {
      display: block;
      width: 50px;
      height: 50px;
      background: url(../../assets/images/icon-empty-member.png) no-repeat;
      background-size: 100%;
    }
    .text-empty {
      font-size: 16px;
      color: #333;
      margin: 5px 0 0 15px;
    }
  }
</style>
