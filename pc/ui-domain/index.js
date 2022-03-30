const uiDomain = process.env.uiDomain
const is_dev = process.env.NODE_ENV === 'development'
Object.keys(uiDomain).forEach(key => {
  if (~key.indexOf('_')) return
  uiDomain[key] = is_dev ? uiDomain[`${key}_dev`] : uiDomain[`${key}_pro`]
})
let env = process.server
  ? process.env
  : (global.window && window.__NUXT__.state ? window.__NUXT__.state.env : {})

env.API_BASE && (uiDomain.api.base = env.API_BASE)
env.API_BUYER && (uiDomain.api.buyer = env.API_BUYER)
env.API_SELLER && (uiDomain.api.seller = env.API_SELLER)
env.API_ADMIN && (uiDomain.api.admin = env.API_ADMIN)

env.DOMAIN_BUYER_PC && (uiDomain.domain.buyer_pc = env.DOMAIN_BUYER_PC)
env.DOMAIN_BUYER_WAP && (uiDomain.domain.buyer_wap = env.DOMAIN_BUYER_WAP)
env.DOMAIN_SELLER && (uiDomain.domain.seller = env.DOMAIN_SELLER)
env.DOMAIN_ADMIN && (uiDomain.domain.admin = env.DOMAIN_ADMIN)

export const api = uiDomain.api
export const api_dev = uiDomain.api_dev
export const api_pro = uiDomain.api_pro
export const domain = uiDomain.domain
export const domain_dev = uiDomain.domain_dev
export const domain_pro = uiDomain.domain_pro
