/**
 * Created by Andste on 2018/7/2.
 * Trusted login correlationAPI
 */

import request, { Method } from '@/utils/request'
import md5 from 'js-md5'

/**
 * Obtaining third-party Loginurl
 * @param client_type
 * @param login_type
 * @returns {string}
 */
export function getConnectUrl(client_type, login_type) {
  return `passport/connect/${client_type}/${login_type}`
}

/**
 * Get the personal center bindingurl
 * @param login_type
 * @returns {string}
 */
export function getLogindConnectUrl(login_type) {
  return request({
    url: `account-binder/pc/${login_type}`,
    method: Method.GET,
    needToken: true
  })
}

/**
 * Third-party Login Binding
 * @param uuid
 * @param params
 */
export function loginByConnect(uuid, params) {
  params.password = md5(params.password)
  return request({
    url: `passport/login-binder/pc/${uuid}`,
    method: Method.PUT,
    data: params
  })
}

/**
 * Log on to the bindingopenid
 * @param uuid
 */
export function loginBindConnect(uuid) {
  return request({
    url: `account-binder/login/${uuid}`,
    method: Method.POST,
    needToken: true
  })
}

/**
 * Registered bindingopenid
 * @param uuid
 */
export function registerBindConnect(uuid) {
  return request({
    url: `account-binder/register/${uuid}`,
    method: Method.POST,
    needToken: true
  })
}

/**
 * Getting the binding list
 */
export function getConnectList() {
  return request({
    url: 'account-binder/list',
    method: Method.GET,
    needToken: true
  })
}

/**
 * unbundling
 * @param type
 */
export function unbindConnect(type) {
  return request({
    url: `account-binder/unbind/${type}`,
    method: Method.POST,
    needToken: true
  })
}

