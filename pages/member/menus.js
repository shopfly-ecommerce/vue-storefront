/**
 * 个人中心通用菜单
 * @type {*[]}
 */
let menus = [
  {
    title: '交易管理',
    name: 'transaction',
    children: [
      { title: '我的订单', name: 'my-order', path: 'my-order' },
      { title: '收货地址', name: 'shipping-address', path: 'shipping-address' },
      { title: '订单售后', name: 'after-sale', path: 'after-sale' }
    ]
  },
  {
    title: '客服服务',
    name: 'service',
    children: [
      { title: '我的收藏', name: 'my-collection', path: 'my-collection' },
      { title: '我的评论', name: 'my-comments', path: 'my-comments' },
      { title: '发表评论', name: 'comments', path: 'comments', 'hidden': true },
      { title: '我的咨询', name: 'my-consultation', path: 'my-consultation' },
      { title: '我的积分', name: 'my-points', path: 'my-points' },
      { title: '我的优惠券', name: 'my-coupons', path: 'my-coupons' },
      { title: '站内消息', name: 'website-message', path: 'website-message' }
    ]
  },
  {
    title: '账号管理',
    name: 'account',
    children: [
      { title: '我的资料', name: 'my-profile', path: 'my-profile' },
      { title: '账户安全', name: 'account-safe', path: 'account-safe', 'include': ['change-password', 'change-mobile', 'bind-mobile'] },
      { title: '修改密码', name: 'change-password', path: 'change-password', 'hidden': true },
      { title: '修改手机', name: 'change-mobile', path: 'change-mobile', 'hidden': true },
      { title: '账号绑定', name: 'account-binding', path: 'account-binding' }
    ]
  }
]

/**
 * 个人中心分销菜单
 * @type {*[]}
 */
const dis_menus = [
  {
    title: '分销管理',
    name: 'distribution',
    children: [
      { title: '分销管理', name: 'distribution', path: 'distribution/my-recommend', 'hidden': true },
      { title: '我推荐的人', name: 'my-recommend', path: 'distribution/my-recommend' },
      { title: '我的业绩', name: 'my-performance', path: 'distribution/my-performance', 'include': ['distribution-my-performance-refund', 'distribution-my-performance-history'] },
      { title: '与我相关的退货单', name: 'my-performance-refund', path: 'distribution/my-performance-refund', 'hidden': true },
      { title: '我的历史业绩', name: 'my-performance-history', path: 'distribution/my-performance-history', 'hidden': true },
      { title: '提现设置', name: 'withdrawals-setting', path: 'distribution/withdrawals-setting' },
      { title: '提现申请', name: 'withdrawals-apply', path: 'distribution/withdrawals-apply' },
      { title: '提现记录', name: 'withdrawals-history', path: 'distribution/withdrawals-history' }
    ]
  }
]

if (process.env.distribution) {
  menus = menus.concat(dis_menus)
}

export default menus
