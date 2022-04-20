/**
 * 站点鉴权
 * @param store
 * @param redirect
 * @returns {*}
 */
export default async function ({ store, error }) {
  if (!store.getters.site) {
    await store.dispatch('getSiteDataAction')
  }
  if (store.getters.site.siteon === 0) {
    return error({ statusCode: 503, message: store.getters.site.close_reson || '站点已关闭' })
  }
}
