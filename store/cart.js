import * as API_Trade from '@/api/trade'
import * as types from './mutation-types'

export const state = () => ({
  shopList: [],
  cartTotal: ''
})

/** mutations */
export const mutations = {
  /**
   * Set shopping cart data
   * @param state
   * @param data
   */
  [types.SET_CART_DATA](state, data) {
    state.shopList = data
  },
  /**
   * Update quantity of goods
   * @param state
   * @param params
   */
  [types.UPDATE_SKU_NUM](state, params) {
    state.shopList.every(shop => {
      let flag = true
      shop.sku_list.every(item => {
        if (item.sku_id === params.sku_id) {
          item.num = params.num
          flag = false
        }
        return flag
      })
      return flag
    })
  },
  /**
   * choose、取消choose货品
   * @param state
   * @param params
   */
  [types.CHECK_SKU_ITEM](state, params) {
    state.shopList.every(shop => {
      let flag = true
      let _checked = 1
      shop.sku_list.forEach(item => {
        if (item.sku_id === params.sku_id) {
          item.checked = params.checked
          flag = false
        }
        if (item.checked === 0) _checked = 0
      })
      shop.checked = _checked
      return flag
    })
  },
  /**
   * choose、取消choose店铺内所有货品
   * @param state
   * @param params
   */
  [types.CHECK_SHOP_SKU](state, params) {
    state.shopList.every(shop => {
      if (shop.shop_id === params.shop_id) {
        shop.checked = params.checked
        shop.sku_list.map(sku => {
          sku.checked = params.checked
          return sku
        })
        return false
      }
      return true
    })
  },
  /**
   * Select all、取消Select all
   * @param state
   * @param checked
   */
  [types.CHECK_ALL](state, checked) {
    state.shopList = state.shopList.map(shop => {
      shop.checked = checked
      shop.sku_list.map(sku => {
        sku.checked = checked
        return sku
      })
      return shop
    })
  },
  /**
   * Delete the item【It could be multiple】
   * @param state
   * @param sku_ids
   */
  [types.DELETE_SKU_ITEMS](state, sku_ids) {
    sku_ids = Array.isArray(sku_ids) ? sku_ids : [sku_ids]
    const _shopList = []
    state.shopList.forEach(shop => {
      const _skuList = []
      shop.sku_list.forEach(sku => {
        if (!sku_ids.includes(sku.sku_id)) _skuList.push(sku)
      })
      if (_skuList.length > 0) {
        shop.sku_list = _skuList
        _shopList.push(shop)
      }
    })
    state.shopList = _shopList
  },
  /**
   * Empty shopping cart
   * @param state
   */
  [types.CLEAN_CART](state) {
    state.shopList = []
  },
  /**
   * Set the total shopping cart price
   * @param state
   * @param total
   */
  [types.SET_CART_TOTAL](state, total) {
    state.cartTotal = total
  }
}

/** actions */
export const actions = {
  /**
   * Get shopping cart data
   * @param commit
   * @param params
   */
  getCartDataAction: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      API_Trade.getCarts(params).then(response => {
        commit(types.SET_CART_DATA, response.cart_list)
        commit(types.SET_CART_TOTAL, response.total_price)
        resolve(response)
      }).catch(error => reject(error))
    })
  },
  /**
   * Update shopping cart quantity
   * @param commit
   * @param params
   * @returns {Promise<any>}
   */
  updateSkuNumAction: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      API_Trade.updateSkuNum(params.sku_id, params.num).then(response => {
        // commit(types.UPDATE_SKU_NUM, params)
        dispatch('getCartDataAction')
        resolve(response)
      }).catch(error => reject(error))
    })
  },
  /**
   * choose、取消choose货品
   * @param commit
   * @param params
   * @returns {Promise<any>}
   */
  checkSkuItemAction: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      API_Trade.updateSkuChecked(params.sku_id, params.checked).then(response => {
        // commit(types.CHECK_SKU_ITEM, params)
        dispatch('getCartDataAction')
        resolve(response)
      }).catch(error => reject(error))
    })
  },
  /**
   * choose、取消choose店铺内所有货品
   * @param commit
   * @param params
   * @returns {Promise<any>}
   */
  checkShopSkuAction: ({ commit, dispatch }, params) => {
    return new Promise((resolve, reject) => {
      API_Trade.checkShop(params.shop_id, params.checked).then(resposne => {
        // commit(types.CHECK_SHOP_SKU, params)
        dispatch('getCartDataAction')
        resolve(resposne)
      }).catch(error => reject(error))
    })
  },
  /**
   * Select all、取消Select all
   * @param commit
   * @param checked
   * @returns {Promise<any>}
   */
  checkAllAction: ({ commit, dispatch }, checked) => {
    return new Promise((resolve, reject) => {
      API_Trade.checkAll(checked).then(response => {
        // commit(types.CHECK_ALL, checked)
        dispatch('getCartDataAction')
        resolve(response)
      }).catch(error => reject(error))
    })
  },
  /**
   * Delete the cart item
   * @param commit
   * @param dispatch
   * @param sku_ids
   * @returns {Promise<any>}
   */
  deleteSkuItemAction: ({ commit, dispatch }, sku_ids) => {
    return new Promise((resolve, reject) => {
      API_Trade.deleteSkuItem(sku_ids).then(response => {
        // commit(types.DELETE_SKU_ITEMS, sku_ids)
        dispatch('getCartDataAction')
        resolve(response)
      }).catch(error => reject(error))
    })
  },
  /**
   * Empty shopping cart
   * @param commit
   * @returns {Promise<any>}
   */
  cleanCartAction: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      API_Trade.cleanCarts().then(response => {
        // commit(types.CLEAN_CART)
        dispatch('getCartDataAction')
        resolve(response)
      }).catch(error => reject(error))
    })
  },
  /**
   * Get the total cart price
   * @param commit
   * @param dispatch
   * @returns {Promise<any>}
   */
  getCartTotalAction: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      API_Trade.getCartTotal().then(response => {
        commit(types.SET_CART_TOTAL, response)
        resolve(response)
      }).catch(error => reject(error))
    })
  },
  /**
   * emptyvuexShopping cart in
   * @param commit
   */
  cleanCartStoreAction: ({ commit }) => {
    commit(types.CLEAN_CART)
  },
  /**
   * Change promotions
   * @param dispatch
   * @param params
   * @returns {Promise<any>}
   */
  changeActivityAction: ({ dispatch }, params) => {
    return new Promise((resolve, reject) => {
      API_Trade.changeActivity(params).then(() => {
        dispatch('getCartDataAction')
        resolve()
      }).catch(reject)
    })
  },
  /**
   * Do not participate in promotional activities
   * @param dispatch
   * @param params
   * @returns {Promise<any>}
   */
  cleanActivityAction: ({ dispatch }, params) => {
    return new Promise((resolve, reject) => {
      API_Trade.cleanPromotion(params).then(() => {
        dispatch('getCartDataAction')
        resolve()
      }).catch(reject)
    })
  }
}

/** getters */
export const getters = {
  /**
   * To obtainskuList
   * @param state
   * @returns {Array}
   */
  skuList: state => {
    const _skuList = []
    state.shopList.forEach(item => _skuList.push(...item.sku_list))
    return _skuList
  },
  /**
   * To obtainshopList
   * @param state
   */
  shopList: state => state.shopList,
  /**
   * Total number of items in shopping cart
   * @param state
   * @returns {number}
   */
  allCount: state => {
    let _allCount = 0
    state.shopList.forEach(shop => {
      shop.sku_list.forEach(item => {
        if (item.invalid !== 1) {
          _allCount += item.num
        }
      })
    })
    return _allCount
  },
  /**
   * Total number of items selected in cart
   * @param state
   * @returns {number}
   */
  checkedCount: state => {
    let _checkedCount = 0
    state.shopList.forEach(shop => {
      shop.sku_list.forEach(item => {
        if (item.checked && item.invalid !== 1) _checkedCount += item.num
      })
    })
    return _checkedCount
  },
  /**
   * Shopping cart total price
   * @param state
   * @returns {*}
   */
  cartTotal: state => state.cartTotal
}
