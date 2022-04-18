/**
 * 路由鉴权
 * @param store
 * @param redirect
 * @param route
 * @returns {*}
 */

import Cookie from 'cookie'
import Storage from '@/utils/storage'

export default function ({ redirect, route, req }) {
  // if (req && req.headers && req.headers.cookie) {
  //   const cookies = Cookie.parse(req.headers.cookie) || {}
  //   if (!cookies.user) {
  //     return redirect(`/login?forward=${route.fullPath}`)
  //   }
  // }
  if (!Storage.getItem('user')) {
    return redirect(`/login?forward=${route.fullPath}`)
  }
}
