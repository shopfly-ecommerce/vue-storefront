/**
 * Order relatedAPI
 */

import request, { Method } from '@/utils/request'

/**
 * Get order list
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
 * Obtain order details
 * @param order_sn Order no.
 */
export function getOrderDetail(order_sn) {
  return request({
    url: `trade/orders/${order_sn}`,
    method: Method.GET,
    needToken: true
  })
}

/**
 * Cancel the order
 * @param order_sn Order no.
 * @param reason   Cancel the reason
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
 * Confirm the goods
 * @param order_sn Order no.
 */
export function confirmReceipt(order_sn) {
  return request({
    url: `trade/orders/${order_sn}/rog`,
    method: Method.POST,
    needToken: true
  })
}

/**
 * Gets the order status quantity
 */
export function getOrderStatusNum() {
  return request({
    url: 'trade/orders/status-num',
    method: Method.GET,
    needToken: true
  })
}

/**
 * Query the order list based on the order number
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
 * Get order log
 * @param order_sn
 */
export function getOrderLog(order_sn) {
  return request({
    url: `trade/orders/${order_sn}/log`,
    method: Method.GET,
    needToken: true
  })
}
