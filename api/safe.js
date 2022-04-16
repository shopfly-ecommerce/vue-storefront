/**
 * Safety relatedAPI
 */

import request, { Method } from '@/utils/request'
import md5 from 'js-md5'

/**
 * Send the verification code of the bound mobile phone
 * @param mobile
 * @param captcha
 * @param uuid
 */
export function sendBindMobileSms(mobile, captcha, uuid) {
  return request({
    url: `members/security/bind/send/${mobile}`,
    method: Method.POST,
    needToken: true,
    data: {
      uuid,
      captcha
    }
  })
}

/**
 * Bind mobile phone number
 * @param mobile
 * @param sms_code
 */
export function bindMobile(mobile, sms_code) {
  return request({
    url: `members/security/bind/${mobile}`,
    method: Method.PUT,
    needToken: true,
    data: { sms_code }
  })
}

/**
 * Send the mobile verification code
 * This is used when changing mobile phone numbers and passwords
 * @param uuid
 * @param captcha
 */
export function sendMobileSms(uuid, captcha) {
  return request({
    url: 'members/security/send',
    method: Method.POST,
    needToken: true,
    data: {
      uuid,
      captcha
    }
  })
}

/**
 * Verify the replacement of mobile phone number SMS
 * @param sms_code
 */
export function validChangeMobileSms(sms_code) {
  return request({
    url: 'members/security/exchange-bind',
    method: Method.GET,
    needToken: true,
    params: { sms_code }
  })
}

/**
 * Change your Phone number
 * @param mobile
 * @param sms_code
 */
export function changeMobile(mobile, sms_code) {
  return request({
    url: `members/security/exchange-bind/${mobile}`,
    method: Method.PUT,
    needToken: true,
    data: { sms_code }
  })
}

/**
 * Verify change password SMS
 * @param sms_code
 */
export function validChangePasswordSms(sms_code) {
  return request({
    url: 'members/security/password',
    method: Method.GET,
    needToken: true,
    params: { sms_code }
  })
}

/**
 * Change password
 * @param uuid
 * @param captcha
 * @param password
 */
export function changePassword(uuid, captcha, password) {
  return request({
    url: 'members/security/password',
    method: Method.PUT,
    needToken: true,
    data: {
      uuid,
      captcha,
      password: md5(password)
    }
  })
}
