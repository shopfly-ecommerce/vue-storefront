/**
 * Created by Andste on 2018/5/7.
 */

import Vue from 'vue'
import Storage from './storage'
import request from '@/utils/request'
import { api } from '@/ui-domain'

/**
 * 检查token：
 * 1. user/accessToken/refreshToken都不存在。
 *    表示用户没有登录，放行所有API
 * 2. 不存在accessToken，但是user/refreshToken存在。
 *    表示accessToken过期，需要重新获取accessToken。
 *    如果重新获取accessToken返回token失效错误，说明已被登出。
 * @param options
 * @returns {Promise<any>}
 */
export default function checkToken(options) {
  // user
  const user = Storage.getItem('user')
  // 访问Token
  const accessToken = Storage.getItem('access_token')
  // 刷新Token
  const refreshToken = Storage.getItem('refresh_token')
  // 获取store
  const { $store } = Vue.prototype.$nuxt
  // 返回异步方法
  return new Promise((resolve, reject) => {
    /**
     * 如果accessToken、user、refreshToken都存在。
     * 说明必要条件都存在，可以直接通过，并且不需要后续操作。
     */
    if (accessToken && user && refreshToken) {
      resolve()
      return
    }
    /**
     * 如果需要Token，但是refreshToken或者user没有。
     * 说明登录已失效、或者cookie有问题，需要重新登录。
     */
    if (options.needToken && (!refreshToken)) {
      $store.dispatch('cart/cleanCartStoreAction')
      $store.dispatch('user/removeUserAction')
      $store.dispatch('user/removeAccessTokenAction')
      $store.dispatch('user/removeRefreshTokenAction')
      resolve()
      return
    }
    /**
     * 如果不需要Token，并且没有。
     * 但是如果有refreshToken或user，说明只是Token过期。需要到下一步去获取新的Token
     * 但是有accessToken并且有，说明
     */
    if (!options.needToken && !accessToken && (!user || !refreshToken)) {
      resolve()
      return
    }
    /**
     * 不存在accessToken，但是user/refreshToken存在。
     * 说明用户已登录，只是accessToken过期，需要重新获取accessToken。
     * 如果没有needToken，说明不需要等待获取到新的accessToken后再请求。
     * 否则，需要等待
     */
    if (!accessToken && refreshToken) {
      /**
       * 如果没有刷新token锁，需要刷新token。
       * 如果有刷新token锁，则进入循环检测。
       */
      if (!window.__refreshTokenLock__) {
        // console.log(options.url + ' | 检测到accessToken失效，这个请求需要等待刷新token。')
        // 如果不需要Token，则不需要等拿到新的Token再请求。
        if (!options.needToken) resolve()
        // 开始请求新的Token，并加锁。
        window.__refreshTokenLock__ = request({
          url: `passport/token`,
          method: 'post',
          headers: { uuid: Storage.getItem('uuid') },
          data: { refresh_token: refreshToken }
        }).then(response => {
          $store.dispatch('user/setAccessTokenAction', response.accessToken)
          $store.dispatch('user/setRefreshTokenAction', response.refreshToken)
          window.__refreshTokenLock__ = null
          // console.log(options.url + ' | 已拿到新的token。')
          options.needToken && resolve()
        }).catch(error => {
          window.__refreshTokenLock__ = undefined
          $store.dispatch('cart/cleanCartStoreAction')
          $store.dispatch('user/removeUserAction')
          $store.dispatch('user/removeAccessTokenAction')
          $store.dispatch('user/removeRefreshTokenAction')
        })
      } else {
        if (!options.needToken) {
          // console.log(options.url + ' | 不需要Token，直接通过...')
          resolve()
          return
        }
        // console.log('进入循环检测...')
        // 循环检测刷新token锁，当刷新锁变为null时，说明新的token已经取回。
        checkLock()
        function checkLock() {
          setTimeout(() => {
            const __RTK__ = window.__refreshTokenLock__
            // console.log(options.url + ' | 是否已拿到新的token：', __RTK__ === null)
            if (__RTK__ === undefined) {
              // console.log('登录已失效了，不用再等待了...')
              $store.dispatch('user/removeUserAction')
              $store.dispatch('user/removeAccessTokenAction')
              $store.dispatch('user/removeRefreshTokenAction')
              location.reload()
              return
            }
            __RTK__ === null
              ? resolve()
              : checkLock()
          }, 500)
        }
      }
      return
    }
    resolve()
  })
}
