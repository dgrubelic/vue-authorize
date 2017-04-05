import Promise from '../promise.js'
import { isArray, isPromise } from '../utils.js'

export default class Role {
  constructor(name, handler, permissions) {
    this.name = name
    this.handler = handler
    this.permissions = permissions
  }

  invoke(permission, context) {
    if (!context) {
      context = permission
      permission = null
    }

    if (permission && !isArray(permission)) {
      permission = [permission]
    }

    let permissionInstances = null;
    if (permission) {
      permissionInstances = this.permissions.filter((permissionInstance) => {
        return (permission.indexOf(permissionInstance.name) >= 0)
      })
      if (permissionInstances.length === 0) {
        permissionInstances = null
      }
    }

    let invokeResult = this.handler.call(context || this)
    if (isPromise(invokeResult)) {
      if (permission) {
        if (permissionInstances) {
          // Permissions passed to check, run their invocation
          return invokeResult.then(() => {
            return Promise.any(permissionInstances.map((permissionInstance) => {
              return permissionInstance.invoke(context || this)
            })).then(() => {
              return Promise.resolve()
            }, () => {
              return Promise.reject()
            })
          })
        } else {
          Promise.reject()
        }
      } else {
        // No permissions passed, return invoked result
        return invokeResult
      }
    } else {
      return new Promise(function (resolve, reject) {
        if (!!invokeResult) {
          if (permission) {
            if (permissionInstances) {
              return Promise.any(permissionInstances.map((permissionInstance) => {
                return permissionInstance.invoke(context || this)
              })).then(resolve, reject)
            } else {
              reject()
            }
          } else {
            resolve()
          }
        } else {
          reject()
        }
      })
    }
  }
}