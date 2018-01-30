import './utils.js'
import { objectExtend } from './utils.js'
import VueAuthorize from './authorize.js'
import IsAuthorizedDirective from './directive.js'
import IsAuthorizedComponent from './component.js'

/**
 * VueAuthorize plugin
 * @param {Object} Vue
 */
function plugin(Vue, options) {
  if (plugin.installed) {
    return
  }

  Vue.directive('ifAuthorized', IsAuthorizedDirective)
  Vue.component('isAuthorized', IsAuthorizedComponent)

  let vueAuthorizeInstance = null
  Object.defineProperties(Vue.prototype, {
    $authorize: {
      get() {
        if (!vueAuthorizeInstance) {
          // vue-authenticate module not found, throw error
          if (!this.$auth) {
            throw new Error('Missing "vue-authenticate" library')
          }
          vueAuthorizeInstance = new VueAuthorize(this.$auth, options)
        }
        return vueAuthorizeInstance
      }
    }
  })
}

export default plugin
export { VueAuthorize }
