import Vue from 'vue'
import axios from 'axios'
import https from 'https'
import { Loading } from 'element-ui'
import { api} from '@/ui-domain'
import Storage from '@/utils/storage'
import { Foundation } from '@/ui-utils'
import md5 from 'js-md5'
import checkToken from '@/utils/checkToken'
const qs = require('qs')

// createaxiosThe instance
const service = axios.create({
  timeout: 8000,     // Request timeout
  baseURL: api.buyer, // Buyer sideAPI
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})

// requestThe interceptor
service.interceptors.request.use(config => {
  const { loading } = config
  // For put/ Post requests, use Qs.Stringify to serialize the parameter
  const is_put_post = config.method === 'put' || config.method === 'post'
  const is_json = config.headers['Content-Type'] === 'application/json'
  const is_file = config.headers['Content-Type'] === 'multipart/form-data'
  if (is_put_post && is_json) {
    config.data = JSON.stringify(config.data)
  }
  if (is_put_post && !is_file && !is_json) {
    config.data = qs.stringify(config.data, { arrayFormat: 'repeat' })
  }
  /** Configure full screen loading*/
  if (process.client && loading !== false) {
    config.loading = Loading.service({
      fullscreen: true,
      background: 'rgba(255,255,255,.3)',
      spinner: 'icon-custom-loading',
      lock: false
    })
  }

  // uuid
  if (process.client) {
    const uuid = Storage.getItem('uuid')
    config.headers['uuid'] = uuid
  }

  // Get access Token
  let accessToken = Storage.getItem('access_token')
  if (accessToken && config.needToken) {
    config.headers['Authorization'] = accessToken
  }
  return config
}, error => {
  Promise.reject(error)
})

// responeThe interceptor
service.interceptors.response.use(
  async response => {
    await closeLoading(response)
    return response.data
  },
  async error => {
    if (process.server) return Promise.reject(error)
    await closeLoading(error)
    const error_response = error.response || {}
    const error_data = error_response.data || {}
    if (error_response.status === 403) {
      const { $store, $router, $route } = Vue.prototype.$nuxt
      if (!Storage.getItem('refresh_token')) return
      $store.dispatch('cart/cleanCartStoreAction')
      $store.dispatch('user/removeUserAction')
      $store.dispatch('user/removeAccessTokenAction')
      $store.dispatch('user/removeRefreshTokenAction')
      $router.push(`/login?forward=${$route.fullPath}`)
      return Promise.reject(error)
    }
    if (error.config.message !== false) {
      let _message = error.code === 'ECONNABORTED' ? 'Connection timeout, please try again later！' : 'Network error, please try again later！'
      Vue.prototype.$message.error(error_data.message || _message)
    }
    return Promise.reject(error)
  }
)

/**
 * Turn off global loading
 * @param target
 */
const closeLoading = (target) => {
  if (!target.config || !target.config.loading) return true
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      target.config.loading.close()
      resolve()
    }, 200)
  })
}

export const Method = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete'
}

export default function request(options) {
  // If it is a server or a request for a refresh token, the request is made without checking the token.
  if (process.server || options.url.indexOf('passport/token') !== -1) {
    return service(options)
  }
  return new Promise((resolve, reject) => {
    checkToken(options).then(() => {
      service(options).then(resolve).catch(reject)
    })
  })
}
