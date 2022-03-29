/**
 * Created by Andste on 2018/7/3.
 * 文章相关API
 */

import request, { Method } from '@/utils/request'
import { api } from '@/ui-domain'

/**
 * 获取某个分类的文章列表
 * @param category_type
 */
export function getArticleCategory(category_type) {
  return request({
    url: `${process.env.API_BASE || api.base}/pages/article-categories`,
    method: Method.GET,
    params: { category_type }
  })
}

/**
 * 获取文章详情
 * @param id
 */
export function getArticleDetail(id) {
  return request({
    url: `${process.env.API_BASE || api.base}/pages/articles/${id}`,
    method: Method.GET
  })
}

/**
 * 获取某个位置的文章列表
 * @param position
 */
export function getArticlesByPosition(position) {
  return request({
    url: `${process.env.API_BASE || api.base}/pages/${position}/articles`,
    method: Method.GET
  })
}

/**
 * 获取某个位置的文章
 * @param position
 */
export function getArticleByPosition(position) {
  return request({
    url: `${process.env.API_BASE || api.base}/pages/${position}/articles`,
    method: Method.GET
  })
}

/**
 * 获取某个分类下的文章列表
 * @param category_type
 */
export function getArticlesByCategory(category_type) {
  return request({
    url: `${process.env.API_BASE || api.base}/pages/article-categories/${category_type}/articles`,
    method: Method.GET,
    loading: false
  })
}
