/** UUIDrelated*/

/** User information correlation*/
// Save user information
export const SET_USER_INFO = 'SET_USER_INFO'
// Remove user information
export const REMOVE_USER_INFO = 'REMOVE_USER_INFO'
// Removes the merchant center login status
export const REMOVE_SELLER_AUTH = 'REMOVE_SELLER_AUTH'

/** TOKENrelated*/
// Save the access token
export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'
// Remove the access token
export const REMOVE_ACCESS_TOKEN = 'REMOVE_ACCESS_TOKEN'
// Save the refresh token
export const SET_REFRESH_TOKEN = 'SET_REFRESH_TOKEN'
// Removes the refresh token
export const REMOVE_REFRESH_TOKEN = 'REMOVE_REFRESH_TOKEN'

/** Shopping cart correlation*/
// Set shopping cart data
export const SET_CART_DATA = 'SET_CART_DATA'
// Update quantity of goods
export const UPDATE_SKU_NUM = 'UPDATE_SKU_NUM'
// choose、取消choose货品
export const CHECK_SKU_ITEM = 'CHECK_SKU_ITEM'
// choose、取消choose店铺内所有货品
export const CHECK_SHOP_SKU = 'CHECK_SHOP_SKU'
// Select all、取消Select all
export const CHECK_ALL = 'CHECK_ALL'
// Delete the item【It could be multiple】
export const DELETE_SKU_ITEMS = 'DELETE_SKU_ITEMS'
// Empty shopping cart
export const CLEAN_CART = 'CLEAN_CART'
// Get the total cart price
export const SET_CART_TOTAL = 'SET_CART_TOTAL'

/** Store related*/
// Set store information
export const SET_SHOP_DATA = 'SET_SHOP_DATA'

/** Site information correlation*/
// Setting site Information
export const SET_SITE_DATA = 'SET_SITE_DATA'

/** Intra-station message correlation*/
// Gets unread messages
export const GET_UNREAD_MESSAGE = 'GET_UNREAD_MESSAGE'

/** Correlation of environment variables*/
// Setting environment Variables
export const SET_ENV_VARS = 'SET_ENV_VARS'
