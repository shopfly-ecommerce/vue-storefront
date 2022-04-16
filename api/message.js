/**
 * Intra-station message correlationAPI
 */

import request, { Method } from '@/utils/request'

/**
 * Get message list
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
 * Gets an unread message from the station
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
 * Mark the message as read
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
 * Delete the message
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
 * Get unread customer serviceIMNumber of messages
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
