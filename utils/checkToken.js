/**
 * Created by Andste on 2018/5/7.
 */

import Vue from 'vue'
import Storage from './storage'
import request from '@/utils/request'

/**
 * checktoken：
 * 1. user/accessToken/refreshTokenNone of them exist.
 *    Indicates that the user is not logged inAPI
 * 2. There is noaccessToken, butuser/refreshTokenThere is.
 *    saidaccessTokenExpired and needs to be retrievedaccessToken。
 *    If I reacquireaccessTokenreturntokenInvalid error indicating that it has been logged out.
 * @param options
 * @returns {Promise<any>}
 */
export default function checkToken(options) {
  // user
  const user = Storage.getItem('user')
  // Access Token
  const accessToken = Storage.getItem('access_token')
  // The refresh Token
  const refreshToken = Storage.getItem('refresh_token')
  // Access to the store
  const { $store } = window.$nuxt
  // Return asynchronous method
  return new Promise((resolve, reject) => {
    /**
     * ifaccessToken、user、refreshTokenThere are.
     * Indicates that the necessary conditions exist, can be passed directly, and no subsequent operations are required.
     */
    if (accessToken && user && refreshToken) {
      resolve()
      return
    }
    /**
     * If you needToken, butrefreshTokenoruserNo.
     * Indicates that the login has expired、orcookieThere is a problem and you need to log in again.
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
     * If you dont need itTokenAnd no.
     * But if there isrefreshTokenoruserThe statement is onlyTokenExpired. You need to go to the next step to get new onesToken
     * But there areaccessTokenAnd there are instructions
     */
    if (!options.needToken && !accessToken && (!user || !refreshToken)) {
      resolve()
      return
    }
    /**
     * There is noaccessToken, butuser/refreshTokenThere is.
     * Indicates that the user is logged in, butaccessTokenExpired and needs to be retrievedaccessToken。
     * If there is noneedToken, indicating that there is no need to wait to get a new oneaccessTokenAsk later.
     * Otherwise, you need to wait
     */
    if (!accessToken && refreshToken) {
      /**
       * If its not refreshedtokenLock, need to refreshtoken。
       * If there is a refreshtokenLock, then enter the loop detection.
       */
      if (!window.__refreshTokenLock__) {
        // Console.log (options. Url + | detects that the accessToken has failed, and this request waits for the refresh token. )
        // If the Token is not needed, there is no need to wait for a new Token to request it.
        if (!options.needToken) resolve()
        // Start requesting a new Token and lock it.
        window.__refreshTokenLock__ = request({
          url: `passport/token`,
          method: 'post',
          headers: { uuid: Storage.getItem('uuid') },
          data: { refresh_token: refreshToken }
        }).then(response => {
          $store.dispatch('user/setAccessTokenAction', response.accessToken)
          $store.dispatch('user/setRefreshTokenAction', response.refreshToken)
          window.__refreshTokenLock__ = null
          // Console. log(options. Url + | has got the new token. )
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
          // The console. The log (options. Url + | dont need a Token, directly through the... )
          resolve()
          return
        }
        // Console.log ( Enter loop detection... )
        // Loop detection refreshes the Token lock, and when the refresh lock becomes null, the new Token has been retrieved.
        checkLock()
        function checkLock() {
          setTimeout(() => {
            const __RTK__ = window.__refreshTokenLock__
            // Console.log (options. Url + | if youve got a new token: , ___ === null)
            if (__RTK__ === undefined) {
              // Console.log ( Login has expired, no more waiting... )
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
