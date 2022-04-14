/**
 * commodity-relatedAPI
 */

import request, { Method } from '@/utils/request'

/**
 * Obtain product details
 * @param goods_id productID
 * @returns {AxiosPromise}
 */
export function getGoods(goods_id) {
  return request({
    url: `goods/${goods_id}`,
    method: Method.GET
  })
}

/**
 * Get a list of items
 * @param params
 * @returns {AxiosPromise}
 */
export function getGoodsList(params) {
  return request({
    url: 'goods/search',
    method: Method.GET,
    loading: false,
    params
  })
}

/**
 * Gets the item selector
 * @param params
 */
export function getGoodsSelector(params) {
  return request({
    url: 'goods/search/selector',
    method: Method.GET,
    loading: false,
    params
  })
}

/**
 * Gets the number of items corresponding to the item keyword
 * @param keyword
 */
export function getKeywordNum(keyword) {
  return request({
    url: 'goods/search/words',
    method: Method.GET,
    loading: false,
    params: { keyword }
  })
}

/**
 * Access to goodsskuThe list of
 * @param goods_id
 */
export function getGoodsSkus(goods_id) {
  return request({
    url: `goods/${goods_id}/skus`,
    method: Method.GET,
    loading: false
  })
}

/**
 * Get tagged goods
 * @param seller_id The sellerid
 * @param mark      The labelhot：sellingnew：New productrecommend：recommended
 * @param num       Get the number
 */
export function getTagGoods(seller_id, mark = 'hot', num = 5) {
  return request({
    url: `goods/tags/${mark}/goods`,
    method: Method.GET,
    loading: false,
    params: {
      seller_id,
      mark,
      num
    }
  })
}

/**
 * Get product categories
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
 * Check if the goods are in the distribution area1 In stock0 Is not available
 * @param goods_id
 * @param area_id
 */
export function getGoodsShip(goods_id, area_id) {
  return request({
    url: `goods/${goods_id}/area/${area_id}`,
    method: Method.GET
  })
}
