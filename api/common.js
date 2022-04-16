/**
 * 公共API
 */

import request, { Method } from '@/utils/request'
import Storage from '@/utils/storage'

/**
 * 获取图片验证码URL
 * @param uuid
 * @param type
 * @returns {string}
 */
export function getValidateCodeUrl(uuid, type) {
  if (!uuid || !type) return ''
  return `${process.env.api_base}/captchas/${uuid}/${type}?r=${new Date().getTime()}`
}

/**
 * 获取站点设置
 */
export function getSiteData() {
  return request({
    url: `${process.env.api_base}/site-show`,
    method: Method.GET
  })
}

/**
 * 记录浏览量【用于统计】
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
 * 获取设置信息
 * 主要是QQ号
 * @returns {*}
 */
export function getSettingsInfo() {
  return request({
    url: `${process.env.api_base}/settings/info`,
    method: 'get'
  })
}
