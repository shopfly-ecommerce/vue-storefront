/**
 * Created by Andste on 2018/8/2.
 */

import request, { Method } from '@/utils/request'

/**
 * 生成短链接
 */
export function generateShortLink() {
  return request({
    url: 'distribution/su/get-short-url',
    method: Method.POST,
    needToken: true
  })
}

/**
 * 访问短链接
 * @param params
 */
export function accessShortLink(params) {
  return request({
    url: 'distribution/su/visit',
    method: Method.GET,
    needToken: false,
    loading: false,
    params
  })
}


/**
 * 获取我的推荐人
 */
export function getMyRefereer() {
  return request({
    url: 'distribution/recommend-me',
    method: Method.GET,
    needToken: true
  })
}

/**
 * 获取推荐人列表
 */
export function getRefereeList() {
  return request({
    url: 'distribution/lower-list',
    method: Method.GET,
    needToken: true
  })
}

/**
 * 获取与我相关的结算单信息
 * @param params
 */
export function getSettlementTotal(params) {
  return request({
    url: 'distribution/bill/member',
    method: Method.GET,
    needToken: true,
    params
  })
}

/**
 * 获取与我相关的订单信息
 * @param params
 */
export function getRelevantList(params) {
  return request({
    url: 'distribution/bill/order-list',
    method: Method.GET,
    needToken: true,
    params
  })
}

/**
 * 获取与我相关的退款单信息
 * @param params
 */
export function getRelevantRefundList(params) {
  return request({
    url: 'distribution/bill/sellback-order-list',
    method: Method.GET,
    needToken: true,
    params
  })
}

/**
 * 获取我的历史业绩
 * @param params
 */
export function getMyHistoryList(params) {
  return request({
    url: 'distribution/bill/history',
    method: Method.GET,
    needToken: true,
    params
  })
}

/**
 * 获取提现设置
 */
export function getWithdrawalsParams() {
  return request({
    url: 'distribution/withdraw/params',
    method: Method.GET,
    needToken: true
  })
}

/**
 * 保存提现设置
 * @param params
 */
export function reserveWithdrawalsParams(params) {
  return request({
    url: 'distribution/withdraw/params',
    method: Method.PUT,
    needToken: true,
    params
  })
}

/**
 * 申请提现
 * @param params
 */
export function applyWithdrawals(params) {
  return request({
    url: 'distribution/withdraw/apply-withdraw',
    method: Method.POST,
    needToken: true,
    params
  })
}


/**
 * 获取可提现金额
 */
export function getWithdrawalsCanRebate() {
  return request({
    url: 'distribution/withdraw/can-rebate',
    method: Method.GET,
    needToken: true
  })
}

/**
 * 获取提现记录
 * @param params
 */
export function getWithdrawalsList(params) {
  return request({
    url: 'distribution/withdraw/apply-history',
    method: Method.GET,
    needToken: true,
    params
  })
}
