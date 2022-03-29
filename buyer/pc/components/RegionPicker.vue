<template>
  <div></div>
</template>

<script>
  export default {
    name: 'EnRegionPicker',
    data () {
      return {
        value: null
      }
    },
    props: {
      default: {
        default: null
      },
      api: {
        type: String,
        required: true
      }
    },
    watch: {
      default(next) {
        this.value = Array.isArray(next) ? next : null
        this.initAddressSelect()
      }
    },
    mounted() {
      this.value = Array.isArray(this.default) ? this.default : null
      this.initAddressSelect()
    },
    methods: {
      callback(object) {
        this.$emit('changed', object)
      },
      initAddressSelect() {
        this.$nextTick(() => {
          $(this.$el).addressSelect({
            api: this.api,
            callback: this.callback,
            deData: this.value
          })
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>

</style>
