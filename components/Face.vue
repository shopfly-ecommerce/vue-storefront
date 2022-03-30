<template>
  <img :src="url || noFace">
</template>

<script>
  /**
   * 头像组件
   * 如果传入url为空，使用默认图片
   */
  const noFace = require('../assets/images/icon-noface.jpg')
  export default {
    name: 'EnFace',
    props: {
      url: {
        type: String,
        default: ''
      }
    },
    data: () => ({ noFace })
  }
</script>
