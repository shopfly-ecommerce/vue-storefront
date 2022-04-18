/**
 * Created by Andste on 2018/5/2.
 * User authentication relatedAPI
 */

import request, { Method } from '@/utils/request'
import Storage from '@/utils/storage'
import md5 from 'js-md5'

/**
 * Normal login
 * @param params
 */
export function login(params) {
  params = JSON.parse(JSON.stringify(params))
  params.password = md5(params.password)
  return request({
    url: `passport/login`,
    method: Method.GET,
    params
  })
}

/**
 * Log in using your mobile phone number
 * @param mobile
 * @param sms_code
 */
export function loginByMobile(mobile, sms_code) {
  return request({
    url: `passport/login/${mobile}`,
    method: Method.GET,
    params: { sms_code }
  })
}

/**
 * Send the mobile verification code for member registration
 * @param mobile
 * @param captcha
 */
export function sendRegisterSms(mobile, captcha) {
  return request({
    url: `passport/register/smscode/${mobile}`,
    method: Method.POST,
    data: {
      captcha,
      uuid: Storage.getItem('uuid')
    }
  })
}

/**
 * Send the verification code of member login mobile phone
 * @param mobile
 * @param captcha
 */
export function sendLoginSms(mobile, captcha) {
  return request({
    url: `passport/login/smscode/${mobile}`,
    method: Method.POST,
    data: {
      captcha,
      uuid: Storage.getItem('uuid')
    }
  })
}

/**
 * The user name is verified repeatedly
 * @param username
 */
export function checkUsernameRepeat(username) {
  return request({
    url: `passport/username/${username}`,
    method: Method.GET,
    loading: false
  })
}

/**
 * The mobile phone number is checked repeatedly
 * @param mobile
 */
export function checkMobileRepeat(mobile) {
  return request({
    url: `passport/mobile/${mobile}`,
    method: Method.GET,
    loading: false
  })
}

/**
 * Registered members【Mobile phone no.】
 * @param params
 */
export function registerByEmail(params) {
  params = JSON.parse(JSON.stringify(params))
  params.password = md5(params.password)
  return request({
    url: `passport/register/email`,
    method: Method.POST,
    data: params
  })
}


/**
 * Registered members【Mobile phone no.】
 * @param params
 */
export function registerByMobile(params) {
  params = JSON.parse(JSON.stringify(params))
  params.password = md5(params.password)
  return request({
    url: `passport/register/pc`,
    method: Method.POST,
    data: params
  })
}

/**
 * Verify the mobile phone verification code
 * @param mobile   Mobile phone number
 * @param scene    The business scenario
 * @param sms_code SMS verification code
 */
export function validMobileSms(mobile, scene, sms_code) {
  return request({
    url: `passport/smscode/${mobile}`,
    method: Method.GET,
    params: {
      scene,
      sms_code
    }
  })
}

/**
 * Verify account information
 * @param uuid
 * @param captcha
 * @param account
 */
export function validAccount(uuid, captcha, account) {
  return request({
    url: `passport/find-pwd`,
    method: Method.GET,
    params: {
      uuid,
      captcha,
      account
    }
  })
}

/**
 * Send a message to retrieve the password
 * @param uuid
 * @param captcha
 */
export function sendFindPasswordSms(uuid, captcha) {
  return request({
    url: `passport/find-pwd/send`,
    method: Method.POST,
    data: {
      uuid,
      captcha
    }
  })
}

/**
 * Verification retrieve password verification code
 * @param uuid
 * @param sms_code
 */
export function validFindPasswordSms(uuid, sms_code) {
  return request({
    url: `passport/find-pwd/valid`,
    method: Method.GET,
    params: {
      uuid,
      sms_code
    }
  })
}

/**
 * Change the password【To retrieve the password】
 * @param uuid
 * @param password
 */
export function changePassword(uuid, password) {
  return request({
    url: `passport/find-pwd/update-password`,
    method: Method.PUT,
    data: {
      uuid,
      password: md5(password)
    }
  })
}
