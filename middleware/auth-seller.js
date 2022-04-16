/**
 * 商家店铺鉴权
 * @param store
 * @param redirect
 * @param route
 * @returns {*}
 */
export default function ({ store, redirect, route }) {
  const { user } = store.getters
  // 如果没有登录/登录了有店铺，跳转到商家中心
  if (!user || user.have_shop) {
    return redirect(process.env.domain_seller)
  }
}
