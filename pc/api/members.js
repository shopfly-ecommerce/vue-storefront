/**
 * Created by Andste on 2018/6/8.
 */

import request, { Method } from '@/utils/request'
import Storage from '@/utils/storage'

/**
 * 获取优惠券列表
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
 * 领取优惠券
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
 * 获取当前会员积分
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
 * 获取积分明细数据
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
 * 获取我的评论列表
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
 * 订单评论
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
 * 追加评论
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
 * 获取我的咨询列表
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
 * 商品咨询
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
 * 获取商品收藏
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
 * 收藏商品
 * @param goods_id 商品ID
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
 * 删除商品收藏
 * @param ids 收藏ID【集合或单个商品ID】
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
 * 获取商品是否被收藏
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
 * 获取当前登录的用户信息
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
 * 保存用户信息
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
 * 登出
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
 * 获取发票列表
 */
export function getReceipts() {
  return request({
    url: 'members/receipt',
    method: Method.GET,
    needToken: true
  })
}

/**
 * 添加发票
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
 * 修改发票
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
 * 删除发票
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
 * 设置发票为默认
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
 * 获取统计数量
 * 包括但不限于【订单数量、收藏的商品数量、收藏的店铺数量】
 */
export function getStatisticsNum() {
  return request({
    url: 'members/statistics',
    method: Method.GET,
    needToken: true
  })
}

/**
 * 获取第三方绑定列表
 */
export function getAccountBinder() {
  return request({
    url: 'members/account-binder',
    method: Method.GET,
    needToken: true
  })
}

/**
 * 发起账号绑定
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
 * 发起账号解绑
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
 * 登录绑定
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
 * 注册绑定
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
 * 获取商家可用优惠券列表
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
 * 获取商品咨询列表
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
 * 获取商品评论列表
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
