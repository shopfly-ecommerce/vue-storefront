/**
 * 申请售后相关API
 */

import request, { Method } from '@/utils/request'

/**
 * 获取售后列表
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
 * 获取售后申请数据
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
 * 获取售后详情
 * @param sn 订单编号
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
 * 申请退款
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
 * 申请退货
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
 * 申请取消订单
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
