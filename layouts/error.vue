<template>
  <div id="app" class="container">
    <div v-if="error.statusCode === 404" class="error-404">
      <div class="error-left">
        <img src="~assets/images/background-404.jpg">
      </div>
      <div class="error-right">
        <h1>bad！The page you visited is missing...</h1>
        <span class="error-title">Probably because：</span>
        <p>The url is wrong.：<span class="error-message">Check whether the address is complete or contains extra characters</span></p>
        <p>The url is no longer valid.：<span class="error-message">The page may have been deleted, the activity may have been taken offline, etc</span></p>
        <span class="error-title" style="margin-top: 20px">You can：</span>
        <div>
          <el-button type="danger" size="small" @click="$router.back()">On the back page</el-button>
          <el-button type="danger" size="small" @click="$router.push({ path: '/' })">Go to the home page</el-button>
        </div>
      </div>
    </div>
    <div v-else-if="error.statusCode === 503" class="error-500">
      <div class="inner-error">
        <p>{{ error.message || 'Server error...' }}</p>
      </div>
      <div class="inner-btns">
        <el-button size="small" @click="handleReload">Refresh the page</el-button>
      </div>
    </div>
    <div v-else class="error-500">
      <div class="inner-error">
        <p>{{ error.message || 'Server error...' }}</p>
      </div>
      <div class="inner-btns">
	      <el-button size="small" @click="$router.back()">On the back page</el-button>
        <el-button size="small" @click="handleReload">Refresh the page</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'error',
    props: ['error'],
    layout: 'full',
    methods: {
      /** Refresh the page*/
      handleReload() {
        window.location.reload()
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../assets/styles/color";
  .container {
    background-color: #fff;
  }
  .error-404 {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 980px;
    margin: 0 auto;
    min-height: 500px;
    .error-left {
      width: 450px;
      height: 380px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .error-right {
      font-size: 14px;
      .error-title {
        display: inline-block;
        margin-bottom: 10px
      }
      .error-message { color: #ff5722 }
      h1 {
        font-size: 26px;
        margin-bottom: 20px;
      }
      p {
        margin-bottom: 5px;
        margin-left: 30px;
      }
      /deep/ .el-button { width: 90px }
    }
  }
  .error-500 {
    text-align: center;
    .inner-error {
      width: 500px;
      height: 350px;
      margin: 50px auto 20px;
      text-align: center;
      line-height: 200px;
      font-size: 18px;
      font-weight: 600;
      background: url("../assets/images/backbround-500.png") no-repeat center;
    }
    .inner-btns {
      margin-bottom: 30px;
      /deep/ .el-button {
        &:hover, &:focus, &:active {
          border-color: lighten($color-main, 10%);
          color: lighten($color-main, 10%);
          background-color: #fff;
        }
        &:first-child {
          margin-right: 10px;
        }
      }
    }
  }
</style>
