<template>
  <div id="bread-nav">
    <div class="bread-nav-container w">
      <span class="left-nav">
        <a href="/">Home</a>
        &gt;
        <nuxt-link v-if="goods.category_id" :to="'/goods?category=' + goods.category_id">{{ goods.category_name }}</nuxt-link>
        <nuxt-link v-else :to="'/goods?keyword=' + goods.category_name">{{ goods.category_name }}</nuxt-link>
        &gt;
        <a href="javascript:;">{{ goods.goods_name || goods.name }}</a>
      </span>
      <div>
        <span class="connect-chat" @click="MixinOpenIm('', {goods_id: goods.goods_id})">
          <i class="icon-chat"></i>
          Contact customer service
        </span>
        <span>Commodity code：{{ goods.sn }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "bread-nav",
    props: ['goods']
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .bread-nav-container {
    display: flex;
    justify-content: space-between;
    padding: 30px 0;
    color: #333333;
    font-weight: 400;
  }
  .left-nav {
    a:last-child {
      font-family: serif;
    }
  }
  .connect-chat {
    margin-right: 20px;
    cursor: pointer;
    .icon-chat {
      display: inline-block;
      position: relative;
      top: 5px;
      width: 20px;
      height: 20px;
      margin-right: 5px;
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFZUlEQVRYR8WXfUwTZxzHfycdaKHXAwoFTdPaNzNRmDWSOEQ3lZfMRZcBM3GZ6CJ1IYjaChHQ8A5m4HyZ1T/EKSo4MZM55EUmE0REYIIQfKGWboa50natR+nayka7XDeI0JNWhvH+ueSe7+/7/dzzds8h8IYv5A3ng8sAXl5eC93c3MJQFI0xGAxRZOAeHh73LBbLQZvN1jE8PNznyss5BUBRdBOCIGUoippj42Kfb46Px4KCgki9u7u7oeRkybOrVVVzjEbjbARBJDiOH5oK5KUAGIZtttlspevWrXuyWyphh4SEuPJC4xoC5tDBr55UV1ezEQSJx3H8LJkBKQCPx9sze87slGMymX9YWNgrBU8W19XWQnpaukaj0dzSaDQxk9sdAEQi0bHIqMiYnNzcgP+VPKl4/779gz/W13/X2dmZ9GLTBACRSCTDvLH4umvXPGcyfMxr5Ypw88jIyDcvQowDMBiM7G0JCQk5uTmBryN8zDM2JhZvvX07U6vVHiWe2QEwDONQKJS+h32P3Ol0+uvMh97eXohYs3ZkdHR0AY7jv9oB/Pz8fkpMTFyasX8f+lrT/zPPyswynCop6VSr1e/bARgMhkWueOzh5eXlkC/vk8N7q1ZB480mEAqFLvEp+/shNSUVsnNzgGzPMBqNIODxR3Q6nQdCp9PjIiIijpd/e4FB5h4dGQVJO5JAnCCG3wdVLgEsDloEOp0OWCwWtHW0k9Z8umkTXn+tXowwmcwjuXl5yVu2bnEQtrS0wJ3WOyDdI4X0tDSIjY0D0VKRU4hdO3dBxcWL8MnGjXD4yGFSveyYDA4UFh5FOBxOZVl52UfLQkOdGs+k4FJFBWSkZ3yPzJ8/v73zXtcyT0/Xlv4H0dFTctTU1bnE2XijEbaLxe0Ih8ttqK2pWc3j8+yFPU/lMGjQARP1hZB5jpOOz+UCN4B0usAvgzp4rOx3AFAP6+CBSgk+nvRxz6tVVSCVSBsQFot1pqi4KP7jmH+36fpHraAmAGi+EPn2cgezuQGBEBa8APiBVvBDbfC3FUBvRKBfNQtaevpIJ2r9w1YgIIjrs9AP7feSkyWQn5d3GkFRNGv7F9sz8wsK7A3dT+X2XgieJyTtgYNFxXC/+Rxsi6KCL81mr9EMIVB82QSr12+Fnbt3OUA/Mxmg8XEHcBmscU+pRGIqPVNaRCxDHpPJbO99cN/HpcEDgIy0vXC3rQVoswxgtQKYgA7LlodDTn6+qxbEPmDAcVxk34iEQmHTufPnVy4RLXHZoPnmTejp6QEEEFgcHAzhK8Ndrr1QXg7ZWdnXlUplhB2ATqdHhIaGnqyurWG77DJN4dDQECwOWvTcYrFE4zjeOP41ZLPZl3ckJ69K3pns8lBMhyE1JdVUU11dJpfLxUT9OADxRaTRaLeLiosCx1bEdAKmqpFKpHCrubm1q6vr3THdhAOJj49PEIVC6Th+4sSc9RvWz2h+ZWUlHCgonBA+oQfG0jAMe8dms3VpdX/MCAAx5juSkgwN1xusWq3We7Kpw5mQTqdz2Wx2z8+dd13bm6fAPFt6FqQSCXHeOK1QKD4nk5IBxG0Ti78sLCzgEAU/XLkClyou/blm7VrPFeErgM/nT9kzTU1NcKGsfKitrc1sNpuVer0+Ecfx7pcVkQGkfH1ctteAD/lkpKeDQCDoUCgUMpvNttDf33+D2WzmCASCvygUCoVKpb5FGA8MDFhVKtUsk8nkFhAQ0KJWq09ZrdZmg8GgcDaODgAoimZ6e3tLqFTqDZVKlUlGT6PRfCkUytzR0dG5RIDVah1wd3f/Ta/XG5wFOp0DhADDMDaO409e1Ww6eqf/htMxfZWafwDBuQjag7Bo1gAAAABJRU5ErkJggg==');
      background-position: center center;
      background-size: 100% 100%;
      transform: scaleX(-1);
    }
  }
</style>
