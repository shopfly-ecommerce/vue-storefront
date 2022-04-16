/**
 * The receiving address is relevantAPI
 */

import request, { Method } from '@/utils/request'

/**
 * Get a list of shipping addresses
 * @returns {AxiosPromise}
 */
export function getAddressList() {
  return request({
    url: 'members/addresses',
    method: Method.GET,
    needToken: true
  })
}

/**
 * Add a shipping address
 * @param params Address parameter
 * @returns {AxiosPromise}
 */
export function addAddress(params) {
  return request({
    url: 'members/address',
    method: Method.POST,
    needToken: true,
    data: params
  })
}

/**
 * Edit the address
 * @param id addressID
 * @param params Address parameter
 * @returns {AxiosPromise}
 */
export function editAddress(id, params) {
  return request({
    url: `members/address/${id}`,
    method: Method.PUT,
    needToken: true,
    data: params
  })
}

/**
 * Delete the shipping address
 * @param id
 */
export function deleteAddress(id) {
  return request({
    url: `members/address/${id}`,
    method: Method.DELETE,
    needToken: true
  })
}

/**
 * Setting the Default address
 * @param id
 */
export function setDefaultAddress(id) {
  return request({
    url: `members/address/${id}/default`,
    method: Method.PUT,
    needToken: true
  })
}
