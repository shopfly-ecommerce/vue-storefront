/**
 * 站内消息相关API
 */

import request, { Method } from '@/utils/request'

/**
 * 获取消息列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getMessages(params) {
  params = params || {}
  params.page_size = params.page_size || 5
  return request({
    url: 'members/member-nocice-logs',
    method: Method.GET,
    needToken: true,
    params
  })
}

/**
 * 获取站内未读消息
 * @param params
 * @returns {AxiosPromise}
 */
export function getMesssagesAsUnread(params) {
  params = params || {}
  params.read = 0
  return request({
    url: 'members/member-nocice-logs',
    method: Method.GET,
    needToken: true,
    loading: false,
    params
  })
}

/**
 * 标记消息为已读
 * @param ids
 */
export function messageMarkAsRead(ids) {
  return request({
    url: `members/member-nocice-logs/${ids}/read`,
    method: Method.PUT,
    needToken: true
  })
}

/**
 * 删除消息
 * @param ids
 */
export function deleteMessage(ids) {
  return request({
    url: `members/member-nocice-logs/${ids}`,
    method: Method.DELETE,
    needToken: true
  })
}

/**
 * 获取未读客服IM消息数量
 * @returns {AxiosPromise<any>|Promise<unknown>|*}
 */
export function getUnreadChatNum() {
  return request({
    url: `${process.env.API_IM}/buyer/im/unread-num`,
    method: Method.POST,
    loading: false,
    needToken: true
  })
}
