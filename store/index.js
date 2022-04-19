import * as types from './mutation-types'
import * as API_Common from '@/api/common'
import * as API_Message from '@/api/message'
import uuidv1 from 'uuid/v1'
import Storage from '@/utils/storage'

if (!Storage.getItem('uuid') && process.client) {
  Storage.setItem('uuid', uuidv1(), { expires: 30 })
}

/** state */
export const state = () => ({
  // Site information
  site: '',
  // Number of unread messages
  unreadMessageNum: 0
})

/** mutations */
export const mutations = {
  /**
   * Set up the site data
   * @param state
   * @param data
   */
  [types.SET_SITE_DATA](state, data) {
    state.site = data
    process.client && Storage.setItem('site', global.JSON.stringify(data))
  },
  /**
   * Number of unread messages
   * @param state
   * @param num
   */
  [types.GET_UNREAD_MESSAGE](state, num) {
    state.unreadMessageNum = num
  }
}

/** actions */
export const actions = {
  /**
   * nuxtCalled when the service is initialized
   * @param commit
   * @param dispatch
   * @param req
   * @param res
   */
  async nuxtServerInit({ commit, dispatch }, { req, res }) {
    //
  },
  /**
   * Getting public data
   * @param commit
   * @returns {Promise<void>}
   */
  async getSiteDataAction({ commit }) {
    const siteData = await API_Common.getSiteData()
    // Site information
    commit(types.SET_SITE_DATA, siteData)
  },
  /**
   * Gets the number of unread messages
   * @param commit
   * @returns {Promise<void>}
   */
  async getUnreadMessageNumAction({ commit }) {
    const res = await API_Message.getMesssagesAsUnread()
    commit(types.GET_UNREAD_MESSAGE, res.data_total)
  }
}

/** getters */
export const getters = {
  /**
   * Obtaining User information
   * @param state
   * @returns {*}
   */
  user: state => state.user.user,
  /**
   * Get site information
   * @param state
   * @returns {getters.site|(function(*))|string}
   */
  site: state => state.site,
  /**
   * Gets the number of unread messages
   * @param state
   * @returns {getters.unreadMessageNum|(function(*))|*|number}
   */
  unreadMessageNum: state => state.unreadMessageNum
}
