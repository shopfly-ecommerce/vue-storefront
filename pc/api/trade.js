/**
 * Created by Andste on 2018/6/7.
 * 交♂易相关API
 */

import request, { Method } from '@/utils/request'
import { api } from '@/ui-domain'

/**
 * 获取购物车列表
 * @param show_type 要显示的类型 all：全部 checked：已选中的
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
 * 添加货品到购物车
 * @param sku_id      产品ID
 * @param num         产品的购买数量
 * @param activity_id 默认参与的活动id
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
 * 立即购买
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
 * 更新购物车商品数量
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
 * 更新购物车货品选中状态
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
 * 删除多个货品项
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
 * 清空购物车
 */
export function cleanCarts() {
  return request({
    url: 'trade/carts',
    method: Method.DELETE,
    needToken: true
  })
}

/**
 * 设置全部货品为选中或不选中
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
 * 设置店铺内全部货品选中状态
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
 * 获取购物车总价
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
 * 获取结算参数
 */
export function getCheckoutParams() {
  return request({
    url: 'trade/checkout-params',
    method: Method.GET,
    needToken: true
  })
}

/**
 * 设置收货地址ID
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
 * 设置支付类型
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
 * 设置发票信息
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
 * 取消使用发票
 */
export function cancelReceipt() {
  return request({
    url: 'trade/checkout-params/receipt',
    method: Method.DELETE,
    needToken: true
  })
}

/**
 * 设置送货时间
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
 * 设置订单备注
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
 * 获取订单总价
 */
export function getOrderTotal() {
  return request({
    url: 'trade/price',
    method: Method.GET,
    needToken: true
  })
}

/**
 * 创建订单
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
 * 获取支付方式列表
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
 * 根据交易编号或订单编号查询收银台数据
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
 * 主动查询支付结果
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
 * 获取微信扫描支付的状态
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
 * 对一个交易发起支付
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
 * 查询物流
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
 * 使用优惠券
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
 * 获取订单流程图
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
 * 获取订单交易快照数据
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
 * 获取商品销售记录
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
 * 更换参与活动
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
 * 不参加促销活动
 */
export function cleanPromotion(params) {
  return request({
    url: 'trade/promotion',
    method: Method.DELETE,
    needToken: true,
    params
  })
}
