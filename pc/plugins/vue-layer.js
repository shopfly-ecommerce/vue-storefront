import Vue from 'vue'

/**
 * 普通alert弹框
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
 * 操作确认
 * @param message
 * @param fn
 * @returns {*|boolean}
 */
const confirm = function (message, fn, cancel) {
  return window.layer.confirm(message || '确认这个操作吗？', {
    icon: 3,
    title: '提示',
    area: ['275px'],
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
 * 消息提示
 * @type {{success : (function(*=, *=, *=) : *), error : (function(*=, *=, *=) : *)}}
 * @private
 */
const _message = {
  /**
   * 成功提示
   * @param message
   * @param opts
   * @param fn
   * @returns {*}
   */
  success: function (message, opts, fn) {
    fn = typeof fn === 'function' ? fn : opts
    opts = typeof opts === 'object' ? opts : {}
    return window.layer.msg(message || '成功！', {
      icon: 1,
      skin: 'layer-skin-custom-msg',
      offset: '10px',
      time: 3000,
      ...opts
    }, fn)
  },

  /**
   * 错误提示
   * @param message
   * @param opts
   * @param fn
   * @returns {*}
   */
  error: function (message, opts, fn) {
    fn = typeof fn === 'function' ? fn : opts
    opts = typeof opts === 'object' ? opts : {}
    return window.layer.msg(message || '出错！', {
      icon: 2,
      skin: 'layer-skin-custom-msg',
      offset: '10px',
      time: 3000,
      ...opts
    }, fn)
  }
}

/**
 * 配置全局layer
 */
window.layer.config({
  skin: 'layer-skin-common',
  btnAlign: 'c'
})

// 注册到Vue原型链上
Vue.prototype.$layer = window.layer
Vue.prototype.$alert = alert
Vue.prototype.$confirm = confirm
Vue.prototype.$message = _message
