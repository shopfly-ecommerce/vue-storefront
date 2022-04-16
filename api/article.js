/**
 * Created by Andste on 2018/7/3.
 * The article relatedAPI
 */

import request, { Method } from '@/utils/request'

/**
 * Gets a list of articles for a category
 * @param category_type
 */
export function getArticleCategory(category_type) {
  return request({
    url: `${process.env.api_base}/pages/article-categories`,
    method: Method.GET,
    params: { category_type }
  })
}

/**
 * Get article details
 * @param id
 */
export function getArticleDetail(id) {
  return request({
    url: `${process.env.api_base}/pages/articles/${id}`,
    method: Method.GET
  })
}

/**
 * Gets a list of articles at a location
 * @param position
 */
export function getArticlesByPosition(position) {
  return request({
    url: `${process.env.api_base}/pages/${position}/articles`,
    method: Method.GET
  })
}

/**
 * Gets the article at a location
 * @param position
 */
export function getArticleByPosition(position) {
  return request({
    url: `${process.env.api_base}/pages/${position}/articles`,
    method: Method.GET
  })
}

/**
 * Gets a list of articles under a category
 * @param category_type
 */
export function getArticlesByCategory(category_type) {
  return request({
    url: `${process.env.api_base}/pages/article-categories/${category_type}/articles`,
    method: Method.GET,
    loading: false
  })
}
