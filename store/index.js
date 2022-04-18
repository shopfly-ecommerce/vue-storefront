import * as types from './mutation-types'
import * as API_Common from '@/api/common'
import * as API_Home from '@/api/home'
import * as API_Message from '@/api/message'
import uuidv1 from 'uuid/v1'
import Storage from '@/utils/storage'

if (!Storage.getItem('uuid') && process.client) {
  Storage.setItem('uuid', uuidv1(), { expires: 30 })
}

/** state */
export const state = () => ({
  // The navigation bar
  navList: [],
  // Categories
  categories: [],
  // Hot search keywords
  hotKeywords: [],
  // Site information
  site: '',
  // Number of unread messages
  unreadMessageNum: 0
})

/** mutations */
export const mutations = {
  /**
   * Set up the sitecookie
   * @param state
   * @param data
   */
  [types.SET_SITE_DATA](state, data) {
    state.site = data
    process.client && Storage.setItem('site', global.JSON.stringify(data))
  },
  /**
   * Setting Classification Data
   * @param state
   * @param data
   */
  [types.SET_CATEGORY_DATA](state, data) {
    state.categories = data
  },
  /**
   * Set the navigation bar data
   * @param state
   * @param data
   */
  [types.SET_NAV_DATA](state, data) {
    state.navList = data
  },
  /**
   * Set the hot search keyword data
   * @param state
   * @param data
   */
  [types.SET_HOT_KEYWORDS](state, data) {
    state.hotKeywords = data
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
    // Getting public data
    await dispatch('getCommonDataAction')
  },
  /**
   * Getting public data
   * @param commit
   * @returns {Promise<void>}
   */
  async getCommonDataAction({ commit }) {
    const commons = await Promise.all([
      // Site information
      API_Common.getSiteData(),
      // The navigation bar
      API_Home.getSiteMenu(),
      // Categorical data
      API_Home.getCategory(),
      // Hot keywords
      API_Home.getHotKeywords()
    ])
    // Site information
    commit(types.SET_SITE_DATA, commons[0])
    // The navigation bar
    commit(types.SET_NAV_DATA, commons[1])
    // Categorical data
    commit(types.SET_CATEGORY_DATA, commons[2])
    // Hot keywords
    commit(types.SET_HOT_KEYWORDS, commons[3])
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
   * Classification list
   * @param state
   * @returns {*}
   */
  categories: state => state.categories,
  /**
   * The navigation bar
   * @param state
   * @returns {*}
   */
  navList: state => state.navList,
  /**
   * Hot search keywords
   * @param state
   * @returns {*}
   */
  hotKeywords: state => state.hotKeywords,
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
