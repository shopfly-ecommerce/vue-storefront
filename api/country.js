/**
 * The country API
 */

import request, { Method } from '@/utils/request'

/**
 * Get all countries
 * @returns {AxiosPromise}
 */
export function getCountries() {
  return request({
    url: `${process.env.api_base}/countries`,
    method: Method.GET,
    needToken: true
  })
}

export function getStates(code) {
  return request({
    url: `${process.env.api_base}/countries/${code}/states`,
    method: Method.GET,
    needToken: true
  })
}
