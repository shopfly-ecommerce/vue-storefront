/**
 * publicAPI
 */

import request, { Method } from '@/utils/request'
import Storage from '@/utils/storage'
import { api } from '@/ui-domain'

/**
 * Get the image captchaURL
 * @param uuid
 * @param type
 * @returns {string}
 */
export function getValidateCodeUrl(uuid, type) {
  if (!uuid || !type) return ''
  return `${process.env.API_BASE || api.base}/captchas/${uuid}/${type}?r=${new Date().getTime()}`
}

/**
 * Get site Settings
 */
export function getSiteData() {
  return request({
    url: `${process.env.API_BASE || api.base}/site-show`,
    method: Method.GET
  })
}

/**
 * Record page Views【For statistical】
 */
export function recordViews(url) {
  return request({
    url: 'view',
    method: Method.GET,
    loading: false,
    params: {
      url,
      uuid: Storage.getItem('uuid')
    }
  })
}

/**
 * Get setting Information
 * mainlyQQNo.
 * @returns {*}
 */
export function getSettingsInfo() {
  return request({
    url: `${api.base}/settings/info`,
    method: 'get'
  })
}
