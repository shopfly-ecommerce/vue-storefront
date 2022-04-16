/**
 * Created by Andste on 2018/6/6.
 */

import request, { Method } from '@/utils/request'

/**
 * Get focus map
 * @param client_type
 */
export function getFocusPictures(client_type = 'PC') {
  return request({
    url: 'focus-pictures',
    method: Method.GET,
    loading: false,
    params: { client_type }
  })
}

/**
 * Get the navigation list
 */
export function getSiteMenu(client_type = 'PC') {
  return request({
    url: 'pages/site-navigations',
    method: Method.GET,
    loading: false,
    params: { client_type }
  })
}

/**
 * Get home page merchandise classification
 * @param parent_id
 */
export function getCategory(parent_id = 0) {
  return request({
    url: `goods/categories/${parent_id}/children`,
    method: Method.GET,
    loading: false
  })
}

/**
 * Get hot keywords
 * @param num
 */
export function getHotKeywords(num = 7) {
  return request({
    url: 'pages/hot-keywords',
    method: Method.GET,
    loading: false,
    params: { num }
  })
}

/**
 * Get floor data
 * @param client_type
 * @param page_type
 */
export function getFloorData(client_type = 'PC', page_type = 'INDEX') {
  return request({
    url: `pages/${client_type}/${page_type}`,
    method: 'get'
  })
}
