/**
 * Application for after-sale relatedAPI
 */

import request, { Method } from '@/utils/request'

/**
 * Get after-sale list
 * @param params
 * @returns {AxiosPromise}
 */
export function getAfterSale(params) {
  return request({
    url: 'after-sales/refunds',
    method: Method.GET,
    needToken: true,
    params
  })
}

/**
 * Obtain after-sales application data
 * @param order_sn
 * @param sku_id
 */
export function getAfterSaleData(order_sn, sku_id) {
  return request({
    url: `after-sales/refunds/apply/${order_sn}`,
    method: Method.GET,
    needToken: true,
    params: { sku_id }
  })
}

/**
 * Obtain after-sale details
 * @param sn Order no.
 * @returns {AxiosPromise}
 */
export function getAfterSaleDetail(sn) {
  return request({
    url: `after-sales/refund/${sn}`,
    method: Method.GET,
    needToken: true
  })
}

/**
 * To apply for a refund
 * @param params
 */
export function applyAfterSaleMoney(params) {
  return request({
    url: 'after-sales/refunds/apply',
    method: Method.POST,
    needToken: true,
    data: params
  })
}

/**
 * To apply for a refund
 * @param params
 */
export function applyAfterSaleGoods(params) {
  return request({
    url: 'after-sales/return-goods/apply',
    method: Method.POST,
    needToken: true,
    data: params
  })
}

/**
 * Application for Cancellation of order
 * @param params
 */
export function applyAfterSaleCancel(params) {
  return request({
    url: 'after-sales/refunds/cancel-order',
    method: Method.POST,
    needToken: true,
    data: params
  })
}
