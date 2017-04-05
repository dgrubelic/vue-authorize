import Vue from 'vue'

/**
 * This directive should serve as a way to 
 * remove DOM elements if user is not auhtorized 
 * to see or interact with them.
 *
 * Example:
 *
 * Current user role: guest
 * 
 * <div class="user-only" v-if-authorized="{ roles: ['user'] }">
 * </div>
 *
 *
 * 
 * Other examples:
 *
 * Current user role: user
 * Current user permissions: ['can_read', can_create', 'can_update']
 * 
 * <div class="user-can_delete-only" 
 *   v-if-authorized="{ roles: ['user'], permissions: ['can_delete']}">
 * </div>
 * 
 */
export default {
  bind: function (el, bindings, vnode) {
    el.style.display = 'none'
    compileAuthorize(el, bindings, vnode)
  },

  update: function (el, bindings, vnode) {
    compileAuthorize(el, bindings, vnode)
  },

  componentUpdated: function (el, bindings, vnode) {
    compileAuthorize(el, bindings, vnode)
  },

  unbind: function (el) {
    el.style.display = null
  }
}

function compileAuthorize(el, bindings, vnode) {
  let roles = bindings.value.roles || null
  let permissions = bindings.value.permissions || null

  // Run authorization
  vnode.context.$authorize.isAuthorized(roles, permissions).then(function () {
    el.style.display = null
  }).catch(function () {
    el.style.display = 'none'
  })
}
