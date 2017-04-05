import Promise from './promise.js'
import { objectExtend, forEach, isString, isFunction, isArray, isObject } from './utils.js'
import defaultOptions from './options.js'
import Role from './authorize/role.js'
import Permission from './authorize/permission.js'

export default class VueAuthorize {
  constructor($auth, overrideOptions) {
    let options = objectExtend({}, defaultOptions)
    options = objectExtend(options, overrideOptions)

    let roles_ = {}
    let permissions_ = {}

    Object.defineProperties(this, {
      options: {
        get() {
          return options
        }
      },

      roles: {
        get() {
          return roles_
        }
      },

      permissions: {
        get() {
          return permissions_
        }
      },

      $auth: {
        get() {
          return $auth
        }
      }
    })

    // First define permissions because roles may include them
    forEach(this.options.permissions, (handler, name) => {
      this.definePermission(name, handler)
    }, this)

    // Once permissions are done, define roles
    forEach(this.options.roles, (handler, name) => {
      let rolePermissions = []
      if (isObject(handler)) {
        this.defineRole(name, handler.handler, handler.permissions)
      } else {
        this.defineRole(name, handler)
      }
    })
  }

  defineRole(name, handler, permissions) {
    if (this.roles[name]) {
      throw new Error(`Role "${name}" already defined`)
    }

    if (!isFunction(handler)) {
      throw new Error('Role handler must be function')
    }

    let rolePermissions = []
    if (isArray(permissions)) {
      permissions.map((permissionName) => {
        if (this.permissions[permissionName]) {
          rolePermissions.push(this.permissions[permissionName])
        } else {
          throw new Error(`Unknown permission "${permissionName}"`)
        }
      })
    }

    this.roles[name] = new Role(name, handler, rolePermissions)
  }

  definePermission(name, handler) {
    if (this.permissions[name]) {
      throw new Error(`Permission "${name}" already defined`)
    }

    this.permissions[name] = new Permission(name, handler)
  }

  /**
   * Check user authorization status
   * @param  {String|Array}  role
   * @param  {String|Array}  permission
   * @return {Boolean|Promise}
   */
  isAuthorized(role, permission) {
    let roleInstances = []
    if (role) {
      if (!isArray(role)) {
        role = [role]
      }

      forEach(this.roles, (roleInstance, roleName) => {
        if (role.indexOf(roleInstance.name) >= 0) {
          roleInstances.push(roleInstance)
        }
      })
    } else {
      forEach(this.roles, (roleInstance) => {
        roleInstances.push(roleInstance)
      })
    }

    if (permission && !isArray(permission)) {
      permission = [permission]
    }

    return new Promise((resolve, reject) => {
      if (roleInstances.length === 0) {
        reject()
      }

      return Promise.any(roleInstances.map((roleInstance) => {
        return roleInstance.invoke(permission, this)
      })).then(resolve).catch(reject)
    })
  }
}