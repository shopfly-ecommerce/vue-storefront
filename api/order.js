/**
 * 订单相关API
 */

import request, { Method } from '@/utils/request'

/**
 * 获取订单列表
 * @param params
 */
export function getOrderList(params) {
  return request({
    url: 'trade/orders',
    method: Method.GET,
    needToken: true,
    params
  })
}

/**
 * 获取订单详情
 * @param order_sn 订单编号
 */
export function getOrderDetail(order_sn) {
  return request({
    url: `trade/orders/${order_sn}`,
    method: Method.GET,
    needToken: true
  })
}

/**
 * 取消订单
 * @param order_sn 订单编号
 * @param reason   取消原因
 */
export function cancelOrder(order_sn, reason) {
  return request({
    url: `trade/orders/${order_sn}/cancel`,
    method: Method.POST,
    needToken: true,
    data: { reason }
  })
}

/**
 * 确认收货
 * @param order_sn 订单编号
 */
export function confirmReceipt(order_sn) {
  return request({
    url: `trade/orders/${order_sn}/rog`,
    method: Method.POST,
    needToken: true
  })
}

/**
 * 获取订单状态数量
 */
export function getOrderStatusNum() {
  return request({
    url: 'trade/orders/status-num',
    method: Method.GET,
    needToken: true
  })
}

/**
 * 根据交易单号查询订单列表
 * @param trade_sn
 */
export function getOrderListByTradeSn(trade_sn) {
  return request({
    url: `trade/orders/${trade_sn}/list`,
    method: Method.GET,
    needToken: true
  })
}

/**
 * 获取订单日志
 * @param order_sn
 */
export function getOrderLog(order_sn) {
  return request({
    url: `trade/orders/${order_sn}/log`,
    method: Method.GET,
    needToken: true
  })
}
