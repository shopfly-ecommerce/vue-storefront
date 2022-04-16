import Vue from 'vue'

/**
 * ordinaryalertbounced
 * @param message
 * @param fn
 * @returns {*|void}
 */
const alert = function (message, fn) {
  return window.layer.alert(message || '', {
    scrollbar: false,
    closeBtn: 0
  }, function (index) {
    let __ = true
    typeof (fn) === 'function' && (__ = fn(index))
    __ !== false && window.layer.close(index)
  })
}
/**
 * Operational qualification
 * @param message
 * @param fn
 * @returns {*|boolean}
 */
const confirm = function (message, fn, cancel) {
  return window.layer.confirm(message || 'Confirm this operation？', {
    icon: 3,
    title: 'prompt',
    area: ['275px'],
    btn: ['yes','no'],
    closeBtn: 0,
    scrollbar: false
  }, function (index) {
    let __ = true
    typeof (fn) === 'function' && (__ = fn(index))
    __ !== false && window.layer.close(index)
  }, function (index) {
    typeof (cancel) === 'function' && cancel()
  });
}

/**
 * Message prompt
 * @type {{success : (function(*=, *=, *=) : *), error : (function(*=, *=, *=) : *)}}
 * @private
 */
const _message = {
  /**
   * Successful tip
   * @param message
   * @param opts
   * @param fn
   * @returns {*}
   */
  success: function (message, opts, fn) {
    fn = typeof fn === 'function' ? fn : opts
    opts = typeof opts === 'object' ? opts : {}
    return window.layer.msg(message || 'successful！', {
      icon: 1,
      skin: 'layer-skin-custom-msg',
      offset: '10px',
      time: 3000,
      ...opts
    }, fn)
  },

  /**
   * Error message
   * @param message
   * @param opts
   * @param fn
   * @returns {*}
   */
  error: function (message, opts, fn) {
    fn = typeof fn === 'function' ? fn : opts
    opts = typeof opts === 'object' ? opts : {}
    return window.layer.msg(message || 'error！', {
      icon: 2,
      skin: 'layer-skin-custom-msg',
      offset: '10px',
      time: 3000,
      ...opts
    }, fn)
  }
}

/**
 * Configure globallayer
 */
window.layer.config({
  skin: 'layer-skin-common',
  btnAlign: 'c'
})

// Registered toVueOn the prototype chain
Vue.prototype.$layer = window.layer
Vue.prototype.$alert = alert
Vue.prototype.$confirm = confirm
Vue.prototype.$message = _message
