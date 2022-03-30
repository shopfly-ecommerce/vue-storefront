<template>
  <div id="binder-error" class="binder-error w">
    <h1>{{ message }}</h1>
    <div class="btns">
	    <el-button type="danger" @click="$router.replace({ path: '/member/account-binding' })" size="small">返回上页</el-button>
		  <el-button type="danger" size="small" @click="$router.replace({ path: '/' })">去首页</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'binder-error',
    data() {
      return {
        message: this.$route.query.message
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .binder-error {
    h1 {
      font-size: 20px;
      line-height: 200px;
      text-align: center;
    }
    .btns {
      text-align: center;
      button {
        width: 80px;
      }
    }
  }
</style>
