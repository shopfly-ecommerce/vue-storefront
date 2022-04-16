/**
 * Created by Andste on 2018/8/2.
 */

import request, { Method } from '@/utils/request'

/**
 * Generating short links
 */
export function generateShortLink() {
  return request({
    url: 'distribution/su/get-short-url',
    method: Method.POST,
    needToken: true
  })
}

/**
 * Accessing short links
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
 * Get my references
 */
export function getMyRefereer() {
  return request({
    url: 'distribution/recommend-me',
    method: Method.GET,
    needToken: true
  })
}

/**
 * Get a list of referees
 */
export function getRefereeList() {
  return request({
    url: 'distribution/lower-list',
    method: Method.GET,
    needToken: true
  })
}

/**
 * Obtain statement information related to me
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
 * Get the order information related to me
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
 * Get the refund receipt information related to me
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
 * Get my track record
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
 * Gets the withdrawal Settings
 */
export function getWithdrawalsParams() {
  return request({
    url: 'distribution/withdraw/params',
    method: Method.GET,
    needToken: true
  })
}

/**
 * Save the withdrawal Settings
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
 * To apply for cash withdrawals
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
 * Get the amount available for withdrawal
 */
export function getWithdrawalsCanRebate() {
  return request({
    url: 'distribution/withdraw/can-rebate',
    method: Method.GET,
    needToken: true
  })
}

/**
 * Get withdrawal records
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
