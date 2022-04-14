/**
 * Created by Andste on 2018/6/8.
 */

import request, { Method } from '@/utils/request'
import Storage from '@/utils/storage'

/**
 * Get a coupon list
 * @param params
 */
export function getCoupons(params) {
  return request({
    url: 'members/coupon',
    method: Method.GET,
    needToken: true,
    params
  })
}

/**
 * Get a coupon
 * @param coupon_id
 */
export function receiveCoupons(coupon_id) {
  return request({
    url: `members/coupon/${coupon_id}/receive`,
    method: Method.POST,
    needToken: true
  })
}

/**
 * Get current membership points
 * @returns {*}
 */

export function getPoints() {
  return request({
    url: 'members/points/current',
    method: Method.GET,
    needToken: true
  })
}

/**
 * Obtain integral detail data
 * @param params
 * @returns {AxiosPromise}
 */
export function getPointsData(params) {
  return request({
    url: 'members/points',
    method: Method.GET,
    needToken: true,
    params
  })
}

/**
 * Get my list of comments
 * @param params
 * @returns {AxiosPromise}
 */
export function getComments(params) {
  return request({
    url: 'members/comments',
    method: Method.GET,
    needToken: true,
    params
  })
}

/**
 * Order review
 * @param params
 */
export function commentsOrder(params) {
  return request({
    url: 'members/comments',
    method: Method.POST,
    needToken: true,
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/**
 * Additional comments
 * @param params
 */
// export function AppendCommentsOrder(params) {
//   return request({
//     url: 'members/comments/additional',
//     method: Method.POST,
//     needToken: true,
//     headers: { 'Content-Type': 'application/json' },
//     data: params
//   })
// }

/**
 * Get my list of inquiries
 * @param params
 * @returns {AxiosPromise}
 */
export function getConsultations(params) {
  return request({
    url: 'members/asks',
    method: Method.GET,
    needToken: true,
    params
  })
}

/**
 * Product consulting
 * @param goods_id
 * @param ask_content
 */
export function consultating(goods_id, ask_content) {
  return request({
    url: 'members/asks',
    method: Method.POST,
    needToken: true,
    data: {
      goods_id,
      ask_content
    }
  })
}

/**
 * Get merchandise collection
 * @param params
 * @returns {AxiosPromise}
 */
export function getGoodsCollection(params) {
  return request({
    url: 'members/collection/goods',
    method: Method.GET,
    needToken: true,
    loading: false,
    message: false,
    params
  })
}

/**
 * Collection product
 * @param goods_id productID
 * @returns {AxiosPromise}
 */
export function collectionGoods(goods_id) {
  return request({
    url: 'members/collection/goods',
    method: Method.POST,
    needToken: true,
    data: { goods_id }
  })
}

/**
 * Delete merchandise collection
 * @param ids collectionID【A collection or a single commodityID】
 * @returns {AxiosPromise}
 */
export function deleteGoodsCollection(ids) {
  if (Array.isArray(ids)) ids = ids.join(',')
  return request({
    url: `members/collection/goods/${ids}`,
    method: Method.DELETE,
    needToken: true
  })
}

/**
 * Gets whether the item is collectable
 * @param good_id
 */
export function getGoodsIsCollect(good_id) {
  return request({
    url: `members/collection/goods/${good_id}`,
    method: Method.GET,
    needToken: true,
    loading: false
  })
}

/**
 * Get the information about the currently logged in user
 * @returns {AxiosPromise}
 */
export function getUserInfo() {
  return request({
    url: `members`,
    method: Method.GET,
    needToken: true,
    loading: false
  })
}

/**
 * Save user information
 * @param params
 * @returns {AxiosPromise}
 */
export function saveUserInfo(params) {
  return request({
    url: 'members',
    method: Method.PUT,
    needToken: true,
    data: params
  })
}

/**
 * logout
 * @returns {AxiosPromise}
 */
export function logout() {
  if(Storage.getItem('uid')) {
    return request({
      url: `members/logout?uid=${Storage.getItem('uid')}`,
      method: Method.POST,
      needToken: true
    })
  } else {
    return Promise.resolve()
  }
}

/**
 * Get invoice list
 */
export function getReceipts() {
  return request({
    url: 'members/receipt',
    method: Method.GET,
    needToken: true
  })
}

/**
 * Add the invoice
 * @param params
 */
export function addReceipt(params) {
  return request({
    url: 'members/receipt/ordinary',
    method: Method.POST,
    needToken: true,
    data: params
  })
}

/**
 * Modify the invoice
 * @param id
 * @param params
 */
export function editReceipt(id, params) {
  return request({
    url: `members/receipt/${id}/ordinary`,
    method: Method.PUT,
    needToken: true,
    data: params
  })
}

/**
 * Delete the invoice
 * @param id
 */
export function deleteReceipt(id) {
  return request({
    url: `members/receipt/${id}`,
    method: Method.DELETE,
    needToken: true
  })
}

/**
 * Set invoice to default
 * @param id
 */
export function setDefaultReceipt(id) {
  return request({
    url: `members/receipt/${id}/default`,
    method: Method.PUT,
    needToken: true
  })
}

/**
 * Obtain statistical quantity
 * Including but not limited to【The order number、The number of items in the collection、Number of stores collected】
 */
export function getStatisticsNum() {
  return request({
    url: 'members/statistics',
    method: Method.GET,
    needToken: true
  })
}

/**
 * Gets a list of third-party bindings
 */
export function getAccountBinder() {
  return request({
    url: 'members/account-binder',
    method: Method.GET,
    needToken: true
  })
}

/**
 * Initiating account binding
 * @param type
 */
export function bindAccount(type) {
  return request({
    url: `members/account-binder/pc/${type}`,
    method: Method.GET,
    needToken: true
  })
}

/**
 * Initiate account unbinding
 * @param type
 */
export function unbundAccount(type) {
  return request({
    url: `members/account-binder/pc/${type}`,
    method: Method.POST,
    needToken: true
  })
}

/**
 * Log on to the binding
 * @param uuid
 */
export function loginBindAccount(uuid) {
  return request({
    url: `members/account-binder/login/${uuid}`,
    method: Method.POST,
    needToken: true
  })
}

/**
 * Registered binding
 * @param uuid
 */
export function registerBindAccount(uuid) {
  return request({
    url: `members/account-binder/register/${uuid}`,
    method: Method.POST,
    needToken: true
  })
}

/**
 * Get a list of coupons available to merchants
 * @param seller_ids
 */
export function getShopsCoupons(seller_ids) {
  return request({
    url: `members/coupon/${seller_ids}`,
    method: Method.GET,
    needToken: true
  })
}

/**
 * Get a list of product inquiries
 * @param goods_id
 * @param params
 */
export function getGoodsConsultations(goods_id, params) {
  return request({
    url: `members/asks/goods/${goods_id}`,
    method: Method.GET,
    loading: false,
    params
  })
}

/**
 * Get a list of product reviews
 * @param goods_id
 * @param params
 */
export function getGoodsComments(goods_id, params) {
  return request({
    url: `members/comments/goods/${goods_id}`,
    method: Method.GET,
    loading: false,
    params
  })
}
