/**
 * Created by Andste on 2018/6/7.
 * Hand in♂Easy to relatedAPI
 */

import request, { Method } from '@/utils/request'
import { api } from '@/ui-domain'

/**
 * Get shopping cart list
 * @param show_type The type to displayall：allchecked：Has been selected
 */
export function getCarts(show_type = 'all') {
  return request({
    url: `trade/carts/${show_type}`,
    method: Method.GET,
    needToken: true,
    loading: false
  })
}

/**
 * Add items to cart
 * @param sku_id      productID
 * @param num         The number of products purchased
 * @param activity_id Default participation activitiesid
 */
export function addToCart(sku_id, num = 1, activity_id) {
  return request({
    url: 'trade/carts',
    method: Method.POST,
    needToken: true,
    data: {
      sku_id,
      num,
      activity_id
    }
  })
}

/**
 * Buy now
 * @param sku_id
 * @param num
 * @param activity_id
 */
export function buyNow(sku_id, num = 1, activity_id) {
  return request({
    url: 'trade/carts/buy',
    method: Method.POST,
    needToken: true,
    params: {
      sku_id,
      num,
      activity_id
    }
  })
}

/**
 * Update the number of items in cart
 * @param sku_id
 * @param num
 */
export function updateSkuNum(sku_id, num = 1) {
  return request({
    url: `trade/carts/sku/${sku_id}`,
    method: Method.POST,
    needToken: true,
    data: { num }
  })
}

/**
 * Update shopping cart item selection status
 * @param sku_id
 * @param checked
 */
export function updateSkuChecked(sku_id, checked = true) {
  return request({
    url: `trade/carts/sku/${sku_id}`,
    method: Method.POST,
    needToken: true,
    data: { checked }
  })
}

/**
 * Delete multiple items
 * @param sku_ids
 */
export function deleteSkuItem(sku_ids) {
  return request({
    url: `trade/carts/${sku_ids}/sku`,
    method: Method.DELETE,
    needToken: true
  })
}

/**
 * Empty shopping cart
 */
export function cleanCarts() {
  return request({
    url: 'trade/carts',
    method: Method.DELETE,
    needToken: true
  })
}

/**
 * Sets all items to selected or unselected
 * @param checked
 */
export function checkAll(checked) {
  return request({
    url: 'trade/carts/checked',
    method: Method.POST,
    needToken: true,
    params: { checked }
  })
}

/**
 * Set the selected state of all goods in the store
 * @param shop_id
 * @param checked
 */
export function checkShop(shop_id, checked) {
  return request({
    url: `trade/carts/seller/${shop_id}`,
    method: Method.POST,
    needToken: true,
    params: { checked }
  })
}

/**
 * Get the total cart price
 */
export function getCartTotal() {
  return request({
    url: 'trade/carts/price',
    method: Method.GET,
    needToken: true,
    loading: false
  })
}

/**
 * Get settlement parameters
 */
export function getCheckoutParams() {
  return request({
    url: 'trade/checkout-params',
    method: Method.GET,
    needToken: true
  })
}

/**
 * Set the shipping addressID
 * @param address_id
 */
export function setAddressId(address_id) {
  return request({
    url: `trade/checkout-params/address-id/${address_id}`,
    method: Method.POST,
    needToken: true
  })
}

/**
 * Setting the payment Type
 * @param payment_type
 */
export function setPaymentType(payment_type = 'ONLINE') {
  return request({
    url: 'trade/checkout-params/payment-type',
    method: Method.POST,
    needToken: true,
    data: { payment_type }
  })
}

/**
 * Setting invoice Information
 * @param params
 */
export function setRecepit(params) {
  return request({
    url: 'trade/checkout-params/receipt',
    method: Method.POST,
    needToken: true,
    data: params
  })
}

/**
 * Cancellation of invoice
 */
export function cancelReceipt() {
  return request({
    url: 'trade/checkout-params/receipt',
    method: Method.DELETE,
    needToken: true
  })
}

/**
 * Set delivery time
 * @param receive_time
 */
export function setReceiveTime(receive_time) {
  return request({
    url: 'trade/checkout-params/receive-time',
    method: Method.POST,
    needToken: true,
    data: { receive_time }
  })
}

/**
 * Set order remarks
 * @param remark
 */
export function setRemark(remark) {
  return request({
    url: 'trade/checkout-params/remark',
    method: Method.POST,
    needToken: true,
    data: { remark }
  })
}

/**
 * Get the total order price
 */
export function getOrderTotal() {
  return request({
    url: 'trade/price',
    method: Method.GET,
    needToken: true
  })
}

/**
 * Create the order
 */
export function createTrade() {
  return request({
    url: 'trade/create',
    method: Method.POST,
    needToken: true,
    message: false
  })
}

/**
 * Gets a list of payment methods
 * @param client_type
 */
export function getPaymentList(client_type = 'PC') {
  return request({
    url: `order/pay/${client_type}`,
    method: Method.GET,
    needToken: true
  })
}

/**
 * Query cash register data by transaction number or order number
 * @param params
 */
export function getCashierData(params) {
  return request({
    url: 'trade/orders/cashier',
    method: Method.GET,
    needToken: true,
    params
  })
}

/**
 * Proactively query payment results
 * @param trade_type
 * @param sn
 * @param params
 */
export function getPayStatus(trade_type, sn, params) {
  return request({
    url: `order/pay/query/${trade_type}/${sn}`,
    method: Method.GET,
    needToken: true,
    params
  })
}

/**
 * Get the status of wechat scanning payment
 * @param sn
 */
export function getWeChatQrStatus(sn) {
  return request({
    url: `order/pay/weixin/status/${sn}`,
    method: Method.GET,
    needToken: true
  })
}

/**
 * Initiate payment for a transaction
 * @param trade_type
 * @param sn
 * @param params
 */
export function initiatePay(trade_type, sn, params) {
  return request({
    url: `order/pay/${trade_type}/${sn}`,
    method: Method.GET,
    needToken: true,
    params
  })
}

/**
 * Query the logistics
 * @param id
 * @param num
 */
export function getExpress(id, num) {
  return request({
    url: 'express',
    method: Method.GET,
    needToken: true,
    params: {
      id,
      num
    }
  })
}

/**
 * Use coupons
 * @param shop_id
 * @param coupon_id
 */
export function useCoupon(coupon_id) {
  return request({
    url: `trade/promotion/${coupon_id}/coupon`,
    method: Method.POST,
    needToken: true
  })
}

/**
 * Get order flow chart
 * @param order_sn
 */
export function getOrderFlow(order_sn) {
  return request({
    url: `trade/orders/${order_sn}/flow`,
    method: Method.GET,
    needToken: true
  })
}

/**
 * Get order trade snapshot data
 * @param id
 */
export function getSnapshot(id) {
  return request({
    url: `trade/snapshots/${id}`,
    method: Method.GET,
    needToken: true
  })
}

/**
 * Obtain merchandise sales records
 * @param goods_id
 * @param params
 */
export function getGoodsSales(goods_id, params) {
  return request({
    url: `trade/goods/${goods_id}/sales`,
    method: Method.GET,
    loading: false,
    params
  })
}

/**
 * Change of participating Activities
 * @param params
 */
export function changeActivity(params) {
  return request({
    url: 'trade/promotion',
    method: Method.POST,
    needToken: true,
    data: params
  })
}

/**
 * Do not participate in promotional activities
 */
export function cleanPromotion(params) {
  return request({
    url: 'trade/promotion',
    method: Method.DELETE,
    needToken: true,
    params
  })
}
