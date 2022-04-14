<template>
  <img :src="url || noFace">
</template>

<script>
  /**
   * Head component
   * If the incomingurlEmpty, use the default image
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
