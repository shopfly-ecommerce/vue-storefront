/**
 * Personal center general menu
 * @type {*[]}
 */
let menus = [
  {
    title: 'Transaction',
    name: 'transaction',
    children: [
      { title: 'Orders', name: 'my-order', path: 'my-order' },
      { title: 'Shipping address', name: 'shipping-address', path: 'shipping-address' },
      { title: 'Return order', name: 'after-sale', path: 'after-sale' }
    ]
  },
  {
    title: 'Service',
    name: 'service',
    children: [
      { title: 'Collection', name: 'my-collection', path: 'my-collection' },
      { title: 'My comments', name: 'my-comments', path: 'my-comments' },
      { title: 'comment', name: 'comments', path: 'comments', 'hidden': true },
      { title: 'My advice', name: 'my-consultation', path: 'my-consultation' },
      { title: 'Points', name: 'my-points', path: 'my-points' },
      { title: 'My coupon', name: 'my-coupons', path: 'my-coupons' },
      { title: 'Messages', name: 'website-message', path: 'website-message' }
    ]
  },
  {
    title: 'Account',
    name: 'account',
    children: [
      { title: 'My profile', name: 'my-profile', path: 'my-profile' },
      { title: 'Security', name: 'account-safe', path: 'account-safe', 'include': ['change-password', 'change-mobile', 'bind-mobile'] },
      { title: 'Change the password', name: 'change-password', path: 'change-password', 'hidden': true },
      { title: 'Modify the phone', name: 'change-mobile', path: 'change-mobile', 'hidden': true },
      // { title: 'Account binding', name: 'account-binding', path: 'account-binding' }
    ]
  }
]

/**
 * Personal center distribution menu
 * @type {*[]}
 */
const dis_menus = [
  {
    title: 'Distribution',
    name: 'distribution',
    children: [
      { title: 'Distribution management', name: 'distribution', path: 'distribution/my-recommend', 'hidden': true },
      { title: 'Someone I recommend', name: 'my-recommend', path: 'distribution/my-recommend' },
      { title: 'My performance', name: 'my-performance', path: 'distribution/my-performance', 'include': ['distribution-my-performance-refund', 'distribution-my-performance-history'] },
      { title: 'A return receipt associated with me', name: 'my-performance-refund', path: 'distribution/my-performance-refund', 'hidden': true },
      { title: 'My track record', name: 'my-performance-history', path: 'distribution/my-performance-history', 'hidden': true },
      { title: 'Withdrawal is set', name: 'withdrawals-setting', path: 'distribution/withdrawals-setting' },
      { title: 'Withdrawal application', name: 'withdrawals-apply', path: 'distribution/withdrawals-apply' },
      { title: 'Withdrawal record', name: 'withdrawals-history', path: 'distribution/withdrawals-history' }
    ]
  }
]

if (process.env.distribution) {
  menus = menus.concat(dis_menus)
}

export default menus
