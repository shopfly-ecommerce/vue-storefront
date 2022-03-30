/** UUID相关 */

/** 用户信息相关 */
// 保存用户信息
export const SET_USER_INFO = 'SET_USER_INFO'
// 移除用户信息
export const REMOVE_USER_INFO = 'REMOVE_USER_INFO'
// 移除商家中心登录状态
export const REMOVE_SELLER_AUTH = 'REMOVE_SELLER_AUTH'

/** TOKEN相关 */
// 保存访问令牌
export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'
// 移除访问令牌
export const REMOVE_ACCESS_TOKEN = 'REMOVE_ACCESS_TOKEN'
// 保存刷新令牌
export const SET_REFRESH_TOKEN = 'SET_REFRESH_TOKEN'
// 移除刷新令牌
export const REMOVE_REFRESH_TOKEN = 'REMOVE_REFRESH_TOKEN'

/** 购物车相关 */
// 设置购物车数据
export const SET_CART_DATA = 'SET_CART_DATA'
// 更新货品数量
export const UPDATE_SKU_NUM = 'UPDATE_SKU_NUM'
// 选择、取消选择货品
export const CHECK_SKU_ITEM = 'CHECK_SKU_ITEM'
// 选择、取消选择店铺内所有货品
export const CHECK_SHOP_SKU = 'CHECK_SHOP_SKU'
// 全选、取消全选
export const CHECK_ALL = 'CHECK_ALL'
// 删除货品【可能是多个】
export const DELETE_SKU_ITEMS = 'DELETE_SKU_ITEMS'
// 清空购物车
export const CLEAN_CART = 'CLEAN_CART'
// 获取购物车总价
export const SET_CART_TOTAL = 'SET_CART_TOTAL'

/** 店铺相关 */
// 设置店铺信息
export const SET_SHOP_DATA = 'SET_SHOP_DATA'

/** 站点信息相关 */
// 设置站点信息
export const SET_SITE_DATA = 'SET_SITE_DATA'

/** 首页静态数据 */
// 设置分类
export const SET_CATEGORY_DATA = 'SET_CATEGORY_DATA'
// 设置导航栏
export const SET_NAV_DATA = 'SET_NAV_DATA'
// 设置热搜关键词
export const SET_HOT_KEYWORDS = 'SET_HOT_KEYWORDS'

/** 站内消息相关 */
// 获取未读消息
export const GET_UNREAD_MESSAGE = 'GET_UNREAD_MESSAGE'

/** 环境变量相关 */
// 设置环境变量
export const SET_ENV_VARS = 'SET_ENV_VARS'
