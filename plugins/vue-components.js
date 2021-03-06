/**
 * Registering global components
 */

import Vue from 'vue'
import * as components from '@/components'

Object.keys(components).forEach(key => {
  Vue.component(components[key].name, components[key])
})
