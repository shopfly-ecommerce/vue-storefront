/**
 * Created by Andste on 2018/7/15.
 * Sales relatedAPI
 */

import request, { Method } from '@/utils/request'

/**
 * Get a list of promotional items
 * @param goods_id
 */
export function getGoodsPromotions(goods_id) {
  return request({
    url: `promotions/${goods_id}`,
    method: Method.GET,
    loading: false
  })
}

/**
 * Get group-buying categories
 */
export function getGroupBuyCategorys() {
  return request({
    url: 'promotions/group-buy/cats',
    method: Method.GET
  })
}

/**
 * Get group-buy items
 * @param params
 */
export function getGroupBuyGoods(params) {
  return request({
    url: `promotions/group-buy/goods`,
    method: Method.GET,
    params
  })
}

/**
 * Get group information
 * @param gb_id
 */
export function getGroupBuyDetail(gb_id) {
  return request({
    url: `promotions/group-buy/active`,
    method: Method.GET
  })
}

/**
 * Get store coupons
 * @param seller_id
 */
export function getShopCoupons(seller_id) {
  return request({
    url: 'promotions/coupons',
    method: Method.GET,
    loading: false,
    params: { seller_id }
  })
}

/**
 * Get points mall classification
 */
export function getPointsCategory() {
  return request({
    url: 'promotions/exchange/cats',
    method: Method.GET
  })
}

/**
 * Get points mall goods
 * @param params
 */
export function getPointsGoods(params) {
  return request({
    url: `promotions/exchange/goods`,
    method: Method.GET,
    params
  })
}

/**
 * Get a flash sale timeline
 */
export function getSeckillTimeLine() {
  return request({
    url: 'promotions/seckill/time-line',
    method: Method.GET,
    loading: false
  })
}

/**
 * Get flash sale items
 * @param params
 */
export function getSeckillTimeGoods(params) {
  return request({
    url: 'promotions/seckill/goods-list',
    method: Method.GET,
    loading: false,
    params
  })
}

/**
 * Get all coupons
 * @param params
 */
export function getAllCoupons(params) {
  return request({
    url: 'promotions/coupons/all',
    method: Method.GET,
    params
  })
}
