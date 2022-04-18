import * as API_Members from '@/api/members'
import * as API_Passport from '@/api/passport'
import * as types from './mutation-types'
import Storage from '@/utils/storage'
import jwt_decode from 'jwt-decode'
import { Foundation } from '@/ui-utils'
import * as API_Address from "@/api/address"

export const state = () => {
  const user = Storage.getItem('user')
  return {
    user: user ? JSON.parse(user) : ''
  }
}

/** mutations */
export const mutations = {
  /**
   * Save user information
   * @param state
   * @param data
   */
  [types.SET_USER_INFO](state, data) {
    state.user = data
    if (process.client) {
      const refreshToken = Storage.getItem('refresh_token')
      const expires = new Date(jwt_decode(refreshToken).exp * 1000)
      Storage.setItem('user', JSON.stringify(data), { expires })
    }
  },
  /**
   * Remove user information
   * @param state
   * @param data
   */
  [types.REMOVE_USER_INFO](state, data) {
    state.user = ''
    Storage.removeItem('user')
    Storage.removeItem('uid')
    // Data generated during third-party login
    Storage.removeItem('uuid_connect')
  },
  /**
   * Set the access token
   * @param state
   * @param token
   */
  [types.SET_ACCESS_TOKEN](state, token) {
    if (process.client) {
      const expires = new Date(jwt_decode(token).exp * 1000)
      Storage.setItem('access_token', token, { expires })
    }
  },
  /**
   * Remove the access token
   * @param state
   */
  [types.REMOVE_ACCESS_TOKEN](state) {
    if (process.client) {
      Storage.removeItem('access_token')
    }
  },
  /**
   * Sets the refresh token
   * @param state
   * @param token
   */
  [types.SET_REFRESH_TOKEN](state, token) {
    if (process.client) {
      const expires = new Date(jwt_decode(token).exp * 1000)
      Storage.setItem('refresh_token', token, { expires })
      Storage.setItem('uid', Storage.getItem('uid'), { expires })
      Storage.setItem('user', Storage.getItem('user'), { expires })
    }
  },
  /**
   * Removes the refresh token
   * @param state
   */
  [types.REMOVE_REFRESH_TOKEN](state) {
    Storage.removeItem('refresh_token')
  },
  /**
   * Removes the merchant center login status
   * @param state
   */
  [types.REMOVE_SELLER_AUTH](state) {
    Storage.removeItem('seller_access_token')
    Storage.removeItem('seller_refresh_token')
    Storage.removeItem('seller_shop')
    Storage.removeItem('seller_uid')
    Storage.removeItem('seller_user')
  }
}

/** actions */
export const actions = {
  /**
   * Obtaining User data
   * @param commit
   * @param params
   */
  getUserDataAction: ({ commit }) => {
    return new Promise((resolve, reject) => {
      API_Members.getUserInfo().then(response => {
        response.birthday *= 1000
        commit(types.SET_USER_INFO, response)
        resolve(response)
      }).catch(error => reject(error))
    })
  },
  /**
   * Sign in
   * @param commit
   * @param params
   * @returns {Promise<any>}
   */
  loginAction: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      if (params.login_type === 'quick') {
        const { mobile, sms_code } = params.form
        API_Passport.loginByMobile(mobile, sms_code).then(loginSccess).catch(reject)
      } else {
        params.form.uuid = Storage.getItem('uuid')
        API_Passport.login(params.form).then(loginSccess).catch(reject)
      }
      function loginSccess(res) {
        const { access_token, refresh_token, uid } = res
        commit(types.SET_ACCESS_TOKEN, access_token)
        commit(types.SET_REFRESH_TOKEN, refresh_token)
        const expires = new Date(jwt_decode(refresh_token).exp * 1000)
        Storage.setItem('uid', uid, { expires })
        API_Members.getUserInfo().then(response => {
          response.birthday *= 1000
          commit(types.SET_USER_INFO, response)
          resolve(response)
        }).catch(reject)
      }
    })
  },
  /**
   * logout
   * @param commit
   * @param dispatch
   * @returns {Promise<any>}
   */
  logoutAction: ({ commit, dispatch }, type) => {
    return new Promise((resolve, reject) => {
      API_Members.logout().then(() => {
        /**
         * Change the password
         * So determine the current useridWhether the user is logged in with the merchant centeridconsistent
         * If they are, remove them along with the merchant center login status
         */
        if (type === 'change-pwd') {
          const uid = Storage.getItem('uid')
          const seller_uid = Storage.getItem('seller_uid')
          if (uid === seller_uid) {
            commit(types.REMOVE_SELLER_AUTH)
          }
        }
        commit(types.REMOVE_USER_INFO)
        commit(types.REMOVE_ACCESS_TOKEN)
        commit(types.REMOVE_REFRESH_TOKEN)
        // Remove unwanted arguments - distribution
        Storage.removeItem('bill_id')
        Storage.removeItem('memeber_id')
        resolve()
      }).catch(error => reject(error))
    })
  },
  /**
   * Save user information【Modify the data】
   * @param commit
   * @param params
   * @returns {Promise<any>}
   */
  saveUserInfoAction: ({ commit }, params) => {
    return new Promise((resolve, reject) => {
      API_Members.saveUserInfo(params).then(response => {
        response.birthday *= 1000
        commit(types.SET_USER_INFO, response)
        resolve(response)
      }).catch(error => reject(error))
    })
  },
  /**
   * Remove user information
   * @param commit
   */
  removeUserAction: ({ commit }) => {
    commit(types.REMOVE_USER_INFO)
  },
  /**
   * Register【By phone number】
   * @param commit
   * @param params
   * @returns {Promise<any>}
   */
  registerByEmailAction: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      console.log("email...")
      params.uuid = Storage.getItem('uuid')
      API_Passport.registerByEmail(params).then(res=> {
        const { access_token, refresh_token, uid } = res
        commit(types.SET_ACCESS_TOKEN, access_token)
        commit(types.SET_REFRESH_TOKEN, refresh_token)
        const expires = new Date(jwt_decode(refresh_token).exp * 1000)
        Storage.setItem('uid', uid, { expires })
        resolve(res)
      })
    })
  },
  /**
   * Set up theaccessToken
   * @param commit
   * @param accessToken
   */
  setAccessTokenAction: ({ commit }, accessToken) => {
    commit(types.SET_ACCESS_TOKEN, accessToken)
  },
  /**
   * removeaccessToken
   * @param commit
   */
  removeAccessTokenAction: ({ commit }) => {
    commit(types.REMOVE_ACCESS_TOKEN)
  },
  /**
   * Set up therefreshToken
   * @param commit
   * @param refreshToken
   */
  setRefreshTokenAction: ({ commit }, refreshToken) => {
    commit(types.SET_REFRESH_TOKEN, refreshToken)
  },
  /**
   * removerefreshToken
   * @param commit
   */
  removeRefreshTokenAction: ({ commit }) => {
    commit(types.REMOVE_REFRESH_TOKEN)
  }
}
