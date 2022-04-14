/**
 * Created by Andste on 2018/7/2.
 * base    : Based on the businessAPI
 * buyer   : buyersAPI
 * seller  : Business centerAPI
 * admin   ：Background managementAPI
 */

let env = process.server
  ? process.env
  : (global.window && window.__NUXT__.state ? window.__NUXT__.state.env : {})

// The development environment
export const dev = {
  base: 'http://52.53.155.58',
  buyer: 'http://52.53.155.58',
  seller: 'https://api-b2c-v710.javamall.com.cn/seller',
  live: 'https://api-b2c-v710.javamall.com.cn/live',
  im: 'https://api-b2c-v710.javamall.com.cn/im'
}

// The production environment
export const pro = {
  base: env.API_BASE || 'http://api:8080',
  buyer: env.API_BUYER || 'http://api:8080',
  seller: env.API_SELLER || 'https://api-b2c-v710.javamall.com.cn/seller',
  live: env.API_LIVE || 'https://api-b2c-v710.javamall.com.cn/live',
  im: env.API_IM || 'https://api-b2c-v710.javamall.com.cn/im'
}
